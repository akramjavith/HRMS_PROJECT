import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  Checkbox,
  Select,
  OutlinedInput,
  FormControl,
  ListItem,
  ListItemText,
  Popover,
  TextField,
  IconButton,
  TextareaAutosize,
  MenuItem,
  DialogActions,
  Grid,
  Paper,
  Table,
  TableHead,
  TableContainer,
  Button,
  TableBody,
  List,
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { handleApiError } from "../../../components/Errorhandling";
import moment from "moment-timezone";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { SERVICE } from "../../../services/Baseservice";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useReactToPrint } from "react-to-print";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import {
  UserRoleAccessContext,
  AuthContext,

} from "../../../context/Appcontext";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Resizable from "react-resizable";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import StyledDataGrid from "../../../components/TableStyle";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import Headtitle from "../../../components/Headtitle";
import ScheduleMeetingNoticePeriod from "./ScheduleMeetingNoticePeriod";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import PageHeading from "../../../components/PageHeading";

function Noticestatuslist() {
  const gridRef = useRef(null);
  const gridRef1 = useRef(null);
  const [vendorAuto, setVendorAuto] = useState("");

  useEffect(() => {
    fetchNoticeperiodlistApproved();
    fetchNoticeperiodlist();
  }, [vendorAuto]);

  const [employees, setEmployees] = useState([]);
  const [employeeApproved, setemployeeApproved] = useState([]);
  const [pageApproved, setPageApproved] = useState(1);
  const [pageSizeApproved, setPageApprovedSize] = useState(10);
  const [fileApproved, setFileApproved] = useState("");

  // clipboard
  const [copiedData, setCopiedData] = useState("");
  // const [selectedbranch, setselectedbranch] = useState([]);
  const [exceldataApproved, setexceldataApproved] = useState([]);

  const [isBoardingApproved, setIsBoardingApproved] = useState(false);

  // let username = isUserRoleAccess.name
  // const id = useParams().id
  const { isUserRoleAccess, isUserRoleCompare, pageName, setPageName, isAssignBranch } = useContext(
    UserRoleAccessContext
  );
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { auth, setAuth } = useContext(AuthContext);
  const [file, setFile] = useState("");
  const [noticePeriod, setNoticeperiod] = useState("");

  let today = new Date();

  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + "-" + mm + "-" + dd;

  // const [selectedbranch, setselectedbranch] = useState([]);
  const [exceldata, setexceldata] = useState([]);

  const [isBoarding, setIsBoarding] = useState(false);

  const id = useParams().id;

  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  //alert model for schedule meeting
  const [openMeetingPopup, setOpenMeetingPopup] = useState(false);
  const [meetingValues, setMeetingValues] = useState([]);
  // meeting popup model
  const handleClickOpenMeetingPopup = (
    company,
    branch,
    team,
    department,
    empname,
    noticeperiodid
  ) => {
    setOpenMeetingPopup(true);
    setMeetingValues([
      company,
      branch,
      team,
      department,
      empname,
      noticeperiodid,
    ]);
  };

  const handleClickCloseMeetingPopup = () => {
    setOpenMeetingPopup(false);
  };

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const [isFilterOpen2, setIsFilterOpen2] = useState(false);
  const [isPdfFilterOpen2, setIsPdfFilterOpen2] = useState(false);

  // page refersh reload
  const handleCloseFilterMod2 = () => {
    setIsFilterOpen2(false);
  };

  const handleClosePdfFilterMod2 = () => {
    setIsPdfFilterOpen2(false);
  };

  //alert model for view schedule meeting
  const [openMeetingViewPopup, setOpenMeetingViewPopup] = useState(false);
  const [meetingData, setMeetingData] = useState(false);
  // meeting popup model
  const handleClickOpenMeetingViewPopup = () => {
    setOpenMeetingViewPopup(true);
  };

  const handleClickCloseMeetingViewPopup = () => {
    setOpenMeetingViewPopup(false);
  };

  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName);
        try {
      let res = await axios.get(`${SERVICE.SINGLE_NOTICEMEETING}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setMeetingData(res?.data?.nschedulemeeting);
      handleClickOpenMeetingViewPopup();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Noticeperiodrequestlist.png");
        });
      });
    }
  };
  const handleCaptureImageApproved = () => {
    if (gridRef1.current) {
      html2canvas(gridRef1.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "NoticePeriodListApproved.png");
        });
      });
    }
  };

  // clipboard
  const [copiedDataApproved, setCopiedDataApproved] = useState("");

  // State for manage columns search query
  const [searchQueryManageApproved, setSearchQueryManageApproved] =
    useState("");
  // Manage Columns
  const [isManageColumnsOpenApproved, setManageColumnsOpenApproved] =
    useState(false);
  const [anchorElApproved, setAnchorElApproved] = useState(null);
  const handleOpenManageColumnsApproved = (event) => {
    setAnchorElApproved(event.currentTarget);
    setManageColumnsOpenApproved(true);
  };
  const handleCloseManageColumnsApproved = () => {
    setManageColumnsOpenApproved(false);
    setSearchQueryManageApproved("");
  };

  const openApproved = Boolean(anchorElApproved);
  const idApproved = openApproved ? "simple-popover" : undefined;

  const [selectedRowsApproved, setSelectedRowsApproved] = useState([]);

  // State for manage columns search query
  const [searchQueryManage, setSearchQueryManage] = useState("");

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
  const ids = open ? "simple-popover" : undefined;

  const [selectedRows, setSelectedRows] = useState([]);

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    checkbox: true,
    actions: true,
    serialNumber: true,
    company: true,
    branch: true,
    unit: true,
    empname: true,
    empcode: true,
    department: true,
    noticedate: true,
    reasonleavingname: true,
    status: true,
    team: true,
    files: true,
    releasedate: true,
    approved: true,
    requestdate: true,
    reject: true,
    recheck: true,
    cancel: true,
    continue: true,
    upload: true,
    requestdatereason: true,
    scheduleinterview: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );
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

  const [appdate, setAppdate] = useState("");

  // getcode for Approved statsu
  const getCode = async (e, statuss) => {
    setPageName(!pageName);
        try {
      handleClickOpenEdit();
      let res = await axios.get(`${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let ans = rowDataTable.filter((data) => data.id === e);
      // if (statuss === "approve") {
      //   setAppdate(ans[0]?.approved);
      // } else  {
      //   setAppdate(ans[0]?.requestdate);
      // }
      setNoticeperiod(res?.data?.snoticeperiodapply);

      await handleSubmitApproved(res?.data?.snoticeperiodapply._id, statuss);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  let bor = noticePeriod._id;
  const [approvedDate, setApprovedDate] = useState("");

  //add function...ApprovedStatus
  const sendRequestApproved = async (e, status) => {
    setPageName(!pageName);
        try {
      let ans = rowDataTable.filter((data) => data.id === e);
      if (status === "approve") {
        let res = await axios.put(`${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${e}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },

          approvedStatus: "true",
          approvenoticereq:
            approvedDate.date === undefined
              ? ans[0]?.approved
              : approvedDate.date,
          approvedthrough: "Approved",
        });
        setNoticeperiod(res.data);
      } else if (status === "manualdate") {
        if (manualDate === "") {
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>
                {"Please Select Manual Date"}
              </p>
            </>
          );
          handleClickOpenerr();
        } else {
          let res = await axios.put(
            `${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${e}`,
            {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },

              approvedStatus: "true",
              approvenoticereq: manualDate,
              approvedthrough: "Manual Date",
            }
          );
          setNoticeperiod(res.data);
        }
      } else {
        let res = await axios.put(`${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${e}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },

          approvedStatus: "true",
          approvenoticereq: ans[0]?.requestdate,
          requestdate: ans[0]?.requestdate,
          approvedthrough: "Requestdate",
        });
        setNoticeperiod(res.data);
      }

      await fetchNoticeperiodlistApproved();
      await fetchNoticeperiodlist();
      setManualDate("");
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //submit option for saving approved
  const handleSubmitApproved = (e, status) => {
    sendRequestApproved(e, status);
  };

  // getcode fro the recheck
  const getCodeRecheck = async (e, value) => {
    setPageName(!pageName);
        try {
      handleClickOpenEdit();
      let res = await axios.get(`${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setNoticeperiod(res?.data?.snoticeperiodapply);
      handleSubmitRecheck(
        res?.data?.snoticeperiodapply._id,
        res?.data?.snoticeperiodapply?.rechecknoticereq
      );
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  // recheck status
  const sendRequestRecheck = async (e, value) => {
    setPageName(!pageName);
        try {
      let res = await axios.put(`${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

        recheckStatus: "true",
        rechecknoticereq: value,
      });
      await fetchNoticeperiodlist();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //submit option for saving recheck
  const handleSubmitRecheck = (e, value) => {
    sendRequestRecheck(e, value);
  };

  // getcode for the reject
  const getCodeReject = async (e, value, status) => {
    setPageName(!pageName);
        try {
      handleClickOpenEdit();
      let res = await axios.get(`${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setNoticeperiod(res?.data?.snoticeperiodapply);
      if (status === "reject") {
        handleSubmitReject(
          res?.data?.snoticeperiodapply._id,
          res?.data?.snoticeperiodapply?.rejectnoticereq,
          status
        );
      } else if (status === "cancel") {
        handleSubmitReject(
          res?.data?.snoticeperiodapply._id,
          res?.data?.snoticeperiodapply?.cancelreason,
          status
        );
      } else if (status === "continue") {
        handleSubmitReject(
          res?.data?.snoticeperiodapply._id,
          res?.data?.snoticeperiodapply?.continuereason,
          status
        );
      }
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  // reject status
  const sendRequestReject = async (e, value, status) => {
    setPageName(!pageName);
        try {
      if (status === "reject") {
        let res = await axios.put(`${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${e}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },

          rejectStatus: "true",
          rejectnoticereq: value,
        });
        setNoticeperiod(res.data);
      } else if (status === "cancel") {
        let res = await axios.put(`${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${e}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },

          cancelstatus: Boolean(true),
          cancelreason: String(value),
        });
        setNoticeperiod(res.data);
      } else if (status === "continue") {
        let res = await axios.put(`${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${e}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },

          continuestatus: Boolean(true),
          continuereason: String(value),
        });
        setNoticeperiod(res.data);
      }

      await fetchNoticeperiodlist();
      await fetchNoticeperiodlistApproved();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //submit option for saving reject
  const handleSubmitReject = (e, value, status) => {
    sendRequestReject(e, value, status);
  };

  // Edit model
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
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

  //get single row to edit....
  const fileData = async (id) => {
    setPageName(!pageName);
        try {
      let res = await axios.get(`${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      renderFilePreview(res?.data?.snoticeperiodapply.files[0]);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //get single row to edit....
  const fileDataDownload = async (id) => {
    setPageName(!pageName);
        try {
      let res = await axios.get(`${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setFile(res?.data?.snoticeperiodapply.files[0]);
      res?.data?.snoticeperiodapply.files.forEach((file) => {
        const link = document.createElement("a");
        link.href = `data:application/octet-stream;base64,${file.base64}`;
        link.download = file.name;
        link.click();
      });
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //get all employees list details
  const fetchNoticeperiodlist = async () => {
    setPageName(!pageName);
        try {
      let res = await axios.post(SERVICE.NOTICEPERIODAPPLYBYASSIGNBRANCH,{
        assignbranch:isAssignBranch
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let ans = res?.data?.noticeperiodapply.filter(
        (data) =>
          data.approvedStatus != "true" &&
          data.recheckStatus != "true" &&
          data.rejectStatus != "true"
      );
      setIsBoarding(true);
      setEmployees(ans);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const [employeesfilterArray, setEmployeesfilterArray] = useState([]);

  const fetchNoticeperiodlistArray = async () => {
    setPageName(!pageName);
        try {
      let res = await axios.post(SERVICE.NOTICEPERIODAPPLYBYASSIGNBRANCH,{
        assignbranch:isAssignBranch
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let ans = res?.data?.noticeperiodapply.filter(
        (data) =>
          data.approvedStatus != "true" &&
          data.recheckStatus != "true" &&
          data.rejectStatus != "true"
      );
      setIsBoarding(true);
      setEmployeesfilterArray(ans);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  useState(() => {
    fetchNoticeperiodlistArray();
  }, [isFilterOpen]);

  //  PDF
  const columns = [
    { title: "Company", field: "company" },
    { title: "Branch", field: "branch" },
    { title: "Unit", field: "unit" },
    { title: "Name", field: "empname" },
    { title: "Empcode", field: "empcode" },
    { title: "Team", field: "team" },
    { title: "Department", field: "department" },
    { title: "Date", field: "noticedate" },
    { title: "Reason", field: "reasonleavingname" },
    { title: "Status", field: "status" },
    { title: "Request Date", field: "requestdate" },
    { title: "Request Reason", field: "requestdatereason" },
    { title: "Release Date", field: "approvenoticereq" },
  ];

  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();

    let serialNumberCounter = 1;

    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" },
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];

    const dataWithSerial =
      isfilter === "filtered"
        ? rowDataTable.map((row) => ({
            ...row,
            serialNumber: serialNumberCounter++,
            approvenoticereq: moment(row.releasedate).format("DD-MM-YYYY"),
            noticedate: moment(row.noticedate).format("DD-MM-YYYY"),
            approved: moment(row.approvenoticereq).format("DD-MM-YYYY"),
            requestdate:
              row.requestdate === ""
                ? ""
                : moment(row.requestdate).format("DD-MM-YYYY"),
          }))
        : employeesfilterArray.map((row) => ({
            ...row,
            serialNumber: serialNumberCounter++,
            noticedate: moment(row.noticedate).format("DD-MM-YYYY"),
            approvenoticereq: moment(row.releasedate).format("DD-MM-YYYY"),
            requestdate:
              row.requestdate === ""
                ? ""
                : moment(row.requestdate).format("DD-MM-YYYY"),
          }));

    doc.autoTable({
      theme: "grid",
      styles: {
        fontSize: 4,
        cellWidth: "auto",
      },
      columns: columnsWithSerial,
      body: dataWithSerial,
    });

    doc.save("Noticeperiodrequestlist.pdf");
  };

  // Excel
  const fileName = "Noticeperiodrequestlistt";
  let excelno = 1;

  // get particular columns for export excel
  const getexcelDatas = async () => {
    setPageName(!pageName);
        try {
      let res = await axios.post(SERVICE.NOTICEPERIODAPPLYBYASSIGNBRANCH,{
        assignbranch:isAssignBranch
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let ans = res?.data?.noticeperiodapply.filter(
        (data) =>
          data.approvedStatus != "true" &&
          data.recheckStatus != "true" &&
          data.rejectStatus != "true"
      );
      var data =
        ans.length > 0 &&
        ans.map((t) => ({
          Sno: excelno++,
          Company: t.company,
          Branch: t.branch,
          unit: t.unit,
          Name: t.empname,
          Empcode: t.empcode,
          Team: t.team,
          Department: t.department,
          date: t.noticedate,
          Reason: t.reasonleavingname,
          Status: t.status,
          "Request Date": t.requestdate,
          "Request Reason": t.requestdatereason,
          Releasedate: t.approvenoticereq,
        }));
      setexceldata(data);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Noticeperiodrequestlist",
    pageStyle: "print",
  });

  useEffect(() => {
    fetchNoticeperiodlist();
  }, []);

  useEffect(() => {
    getexcelDatas();
  }, [employees]);

  //table entries ..,.
  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = employees?.map((item, index) => {
      return {
        ...item,
        serialNumber: index + 1,
      };
    });
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [employees]);

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
  };

  // Split the search query into individual terms
  const searchTerms = searchQuery.toLowerCase().split(" ");

  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
  });

  const [filteredDatalist, setfilteredDatalist] = useState([]);
  const filteredData = filteredDatas.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalPages = Math.ceil(employees.length / pageSize);

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

  const [manualDate, setManualDate] = useState("");

  const [rowIndex, setRowIndex] = useState();
  const [status, setStatus] = useState({});
  const [btnSubmit, setBtnSubmit] = useState(false);
  const handleAction = (value, rowId, sno) => {
    setStatus((prevStatus) => ({
      ...prevStatus,
      [rowId]: {
        ...prevStatus[rowId],
        approvethrough: value,
        btnShow: true,
      },
    }));
    setRowIndex(sno);
  };
  const attStatusOption = [
    { label: "Aproved Date", value: "Aproved Date" },
    { label: "Request Date", value: "Request Date" },
    { label: "Manual Date", value: "Manual Date" },
  ];
  // Table start colum and row
  // Define columns for the DataGrid
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
      headerName: "SNo",
      flex: 0,
      width: 50,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "actions",
      headerName: "Approve Through",
      flex: 0,
      width: 450,
      sortable: false,
      hide: !columnVisibility.actions,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          <>
            <Grid item md={12} xs={12} sm={12}>
              <FormControl size="large" fullWidth>
                <Select
                  labelId="demo-select-small"
                  id="demo-select-small"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                        width: "auto",
                      },
                    },
                  }}
                  style={{ minWidth: 150 }}
                  value={
                    status[params.row.id]?.approvethrough
                      ? status[params.row.id]?.approvethrough
                      : params.row.approvethrough
                  }
                  onChange={(e) => {
                    handleAction(
                      e.target.value,
                      params.row.id,
                      params.row.serialNumber
                    );
                    setManualDate("");
                  }}
                  inputProps={{ "aria-label": "Without label" }}
                >
                  <MenuItem value="Approve Date">Approve Date</MenuItem>
                  {params.row.requestdatestatus && (
                    <MenuItem value="Request Date">Request Date</MenuItem>
                  )}
                  <MenuItem value="Manual Date">Manual Date</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <br />
            <br />
            {status[params.row.id]?.btnShow &&
            rowIndex === params.row.serialNumber ? (
              <>
                {status[params.row.id]?.approvethrough === "Approve Date" ? (
                  <Grid sx={{ display: "flex" }}>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl size="small" fullWidth>
                        <OutlinedInput
                          id="component-outlined"
                          type="date"
                          value={params.row.approved}
                        />
                      </FormControl>
                    </Grid>{" "}
                    <br /> <br />
                    <Grid item md={3} xs={12} sm={12}>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => {
                          getCode(params.row.id, "approve");
                        }}
                      >
                        Approve
                      </Button>
                    </Grid>
                  </Grid>
                ) : status[params.row.id]?.approvethrough === "Request Date" ? (
                  <Grid sx={{ display: "flex" }}>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl size="small" fullWidth>
                        <OutlinedInput
                          id="component-outlined"
                          type="date"
                          value={params.row.requestdate}
                        />
                      </FormControl>
                    </Grid>{" "}
                    <br /> <br />
                    <Grid item md={3} xs={12} sm={12}>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => {
                          getCode(params.row.id, "requestdate");
                        }}
                      >
                        Approve
                      </Button>
                    </Grid>
                  </Grid>
                ) : status[params.row.id]?.approvethrough === "Manual Date" ? (
                  <Grid sx={{ display: "flex" }}>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl size="small" fullWidth>
                        <OutlinedInput
                          id="from-date"
                          type="date"
                          value={manualDate}
                          onChange={(e) => {
                            setManualDate(e.target.value);
                          }}
                        />
                      </FormControl>
                    </Grid>{" "}
                    <br /> <br />
                    <Grid item md={3} xs={12} sm={12}>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => {
                          getCode(params.row.id, "manualdate");
                        }}
                      >
                        Approve
                      </Button>
                    </Grid>
                  </Grid>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <></>
            )}
          </>
        </Grid>
      ),
    },
    {
      field: "reject",
      headerName: "Reject",
      flex: 0,
      width: 300,
      sortable: false,
      hide: !columnVisibility.reject,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          <Grid item md={3} xs={12} sm={12}>
            <FormControl size="small" fullWidth>
              <OutlinedInput
                id="component-outlined"
                type="text"
                placeholder="Reason"
                value={params.row.rejectnoticereq}
                onChange={(e) => {
                  RejectstatusFunction(params.row.id, e);
                }}
              />
            </FormControl>
          </Grid>{" "}
          <br /> <br />
          <Grid item md={3} xs={12} sm={12}>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                getCodeReject(
                  params.row.id,
                  params.row.rejectnoticereq,
                  "reject"
                );
              }}
            >
              Reject
            </Button>
          </Grid>
        </Grid>
      ),
    },
    {
      field: "recheck",
      headerName: "Recheck",
      flex: 0,
      width: 300,
      sortable: false,
      hide: !columnVisibility.recheck,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          <Grid item md={3} xs={12} sm={12}>
            <FormControl size="small" fullWidth>
              <OutlinedInput
                id="component-outlined"
                type="text"
                placeholder="Recheck Statement"
                value={params.row.rechecknoticereq}
                onChange={(e) => {
                  ReCheckStatement(params.row.id, e);
                }}
              />
            </FormControl>
          </Grid>{" "}
          <br /> <br />
          <Grid item md={3} xs={12} sm={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                getCodeRecheck(params.row.id, params.row.rechecknoticereq);
                // handleSubmit();
              }}
            >
              Recheck
            </Button>
          </Grid>
        </Grid>
      ),
    },
    {
      field: "scheduleinterview",
      headerName: "Schedule Interview",
      flex: 0,
      width: 250,
      sortable: false,
      hide: !columnVisibility.scheduleinterview,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          <Grid item md={3} xs={12} sm={12}>
            <>
              {params.row.meetingscheduled != true ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    handleClickOpenMeetingPopup(
                      params.row.company,
                      params.row.branch,
                      params.row.team,
                      params.row.department,
                      params.row.empname,
                      params.row.id
                    );
                  }}
                >
                  Schedule Interview
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    getviewCode(params.row.id);
                  }}
                >
                  View Interview
                </Button>
              )}
            </>
          </Grid>{" "}
          :
        </Grid>
      ),
    },
    {
      field: "empname",
      headerName: "Name",
      flex: 0,
      width: 100,
      hide: !columnVisibility.empname,
      headerClassName: "bold-header",
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 100,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 100,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 100,
      hide: !columnVisibility.unit,
      headerClassName: "bold-header",
    },

    {
      field: "empcode",
      headerName: "Empcode",
      flex: 0,
      width: 100,
      hide: !columnVisibility.empcode,
      headerClassName: "bold-header",
    },
    {
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 100,
      hide: !columnVisibility.team,
      headerClassName: "bold-header",
    },
    {
      field: "department",
      headerName: "Department",
      flex: 0,
      width: 100,
      hide: !columnVisibility.department,
      headerClassName: "bold-header",
    },
    {
      field: "noticedate",
      headerName: "Date",
      flex: 0,
      width: 100,
      hide: !columnVisibility.noticedate,
      headerClassName: "bold-header",
    },
    {
      field: "reasonleavingname",
      headerName: "Reason",
      flex: 0,
      width: 100,
      hide: !columnVisibility.reasonleavingname,
      headerClassName: "bold-header",
    },

    {
      field: "status",
      headerName: "Status",
      flex: 0,
      width: 100,
      hide: !columnVisibility.status,
      headerClassName: "bold-header",
    },

    {
      field: "files",
      headerName: "Document",
      flex: 0,
      width: 200,
      sortable: false,
      hide: !columnVisibility.actions,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          <a
            onClick={() => {
              fileData(params.row.id);
            }}
            style={{ minWidth: "0px", color: "#357AE8", cursor: "pointer" }}
          >
            View
          </a>
          <a
            style={{
              minWidth: "0px",
              textDecoration: "none",
              color: "#357AE8",
              cursor: "pointer",
            }}
            onClick={() => {
              fileDataDownload(params.row.id);
            }}
            download={file.name}
          >
            Download
          </a>
        </Grid>
      ),
    },
  ];

  const rowDataTable = filteredData.map((notice, index) => {
    return {
      id: notice._id,
      serialNumber: notice.serialNumber,
      index: index + 1,
      company: notice.company,
      branch: notice.branch,
      unit: notice.unit,
      empname: notice.empname,
      empcode: notice.empcode,
      team: notice.team,
      department: notice.department,
      reasonleavingname: notice.reasonleavingname,
      status: notice.status,
      files: notice.files,
      releasedate: notice.releasedate,
      noticedate: notice.noticedate,
      approved: notice.approvenoticereq,
      requestdate: notice.requestdate,
      requestdatereason: notice.requestdatestatus
        ? notice.requestdatereason
        : "",
      requestdatestatus: notice.requestdatestatus,
      reject: notice.reject,
      rejectnotice: notice.rejectnoticereq,
      recheck: notice.recheck,
      meetingscheduled: notice?.meetingscheduled,
    };
  });

  const ApprovedDateFunc = async (id, olddate, newdate, status) => {
    let ans = filteredData?.filter((data, index) => {
      if (id === data._id) {
        if (status === "approve") {
          let projectscreate = axios.put(
            `${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${id}`,
            {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              approvenoticereq:
                (new Date(newdate) - new Date(olddate)) / (1000 * 3600 * 24) < 0
                  ? olddate
                  : newdate,
            }
          );
        } else {
          let projectscreate = axios.put(
            `${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${id}`,
            {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              requestdate:
                (new Date(newdate) - new Date(olddate)) / (1000 * 3600 * 24) < 0
                  ? olddate
                  : newdate,
            }
          );
        }
      }
    });
    await fetchNoticeperiodlist();
  };

  const RejectstatusFunction = async (id, e) => {
    const value = e.target.value;
    let ans = filteredData?.filter((data, index) => {
      if (id === data._id) {
        let projectscreate = axios.put(
          `${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${id}`,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            rejectnoticereq: value,
          }
        );
      }
    });
    // setRejectNoticeMessage(value)
  };
  const cancelcontinuestatusFunction = async (id, e, func) => {
    const value = e.target.value;
    if (func === "cancel") {
      let ans = filteredDataApproved?.filter((data, index) => {
        if (id === data._id) {
          let projectscreate = axios.put(
            `${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${id}`,
            {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              cancelreason: value,
            }
          );
        }
      });
    } else if (func === "continue") {
      let ans = filteredDataApproved?.filter((data, index) => {
        if (id === data._id) {
          let projectscreate = axios.put(
            `${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${id}`,
            {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              continuereason: value,
            }
          );
        }
      });
    }
  };

  const ReCheckStatement = async (id, e) => {
    const value = e.target.value;
    let ans = filteredData?.filter((data, index) => {
      if (id === data._id) {
        let projectscreate = axios.put(
          `${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${id}`,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            rechecknoticereq: value,
          }
        );
      }
    });
  };

  const handleShowAllColumns = () => {
    const updatedVisibility = { ...columnVisibility };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibility(updatedVisibility);
  };

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
    <Box
      sx={{
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
          {filteredColumns?.map((column) => (
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
    </Box>
  );

  // Calculate the DataGrid height based on the number of rows
  const calculateDataGridHeight = () => {
    if (pageSize === "All") {
      return "auto"; // Auto height for 'All' entries
    } else {
      // Calculate the height based on the number of rows displayed
      const visibleRows = Math.min(pageSize, filteredDatas.length);
      const rowHeight = 65; // Assuming row height is 52px (adjust as needed)
      const extraSpace = 70; // Add some extra space to prevent the last row from being hidden
      const scrollbarWidth = 52; // Width of the scrollbar (adjust as needed)
      return `${
        visibleRows > 0
          ? visibleRows * rowHeight + extraSpace
          : scrollbarWidth + extraSpace
      }px`;
    }
  };

  const renderFilePreviewApproved = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  const initialColumnVisibilityApproved = {
    checkbox: true,
    actions: true,
    serialNumber: true,
    company: true,
    branch: true,
    unit: true,
    team: true,
    empname: true,
    empcode: true,
    department: true,
    date: true,
    reason: true,
    document: true,
    status: true,
    approvedthrough: true,
    reasonleavingname: true,
    releasedate: true,
    files: true,
    cancel: true,
    continue: true,
    scheduleinterview: true,
  };

  // Show all columns
  const [columnVisibilityApproved, setColumnVisibilityApproved] = useState(
    initialColumnVisibilityApproved
  );

  const getRowClassNameAll = (params) => {
    const itemTat = params.row.status || "";
    return "custom-others-row";
    // }
  };

  // Styles for the resizable column
  const ResizableColumnApproved = styled(Resizable)`
    .react-resizable-handle {
      width: 10px;
      height: 100%;
      position: absolute;
      right: 0;
      bottom: 0;
      cursor: col-resize;
    }
  `;

  const StyledDataGridApproved = styled(DataGrid)(({ theme }) => ({
    "& .MuiDataGrid-virtualScroller": {
      overflowY: "hidden",
    },
  }));

  //get all employeeApproved list details
  const fetchNoticeperiodlistApproved = async () => {
    setPageName(!pageName);
        try {
      let res = await axios.post(SERVICE.NOTICEPERIODAPPLYBYASSIGNBRANCH, {
        assignbranch:isAssignBranch
      },{
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let ans = res?.data?.noticeperiodapply.filter(
        (data) =>
          data.approvedStatus === "true" &&
          data.cancelstatus === false &&
          data.continuestatus === false
      );
      setIsBoardingApproved(true);

      setemployeeApproved(ans);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const [employeeApprovedFilterArray, setemployeeApprovedFilterArray] =
    useState([]);

  const fetchNoticeperiodlistApprovedArray = async () => {
    setPageName(!pageName);
        try {
      let res = await axios.post(SERVICE.NOTICEPERIODAPPLYBYASSIGNBRANCH,{
        assignbranch:isAssignBranch
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let ans = res?.data?.noticeperiodapply.filter(
        (data) =>
          data.approvedStatus === "true" &&
          data.cancelstatus === false &&
          data.continuestatus === false
      );
      setIsBoardingApproved(true);

      setemployeeApprovedFilterArray(ans);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  useEffect(() => {
    fetchNoticeperiodlistApprovedArray();
  }, [isFilterOpen2]);

  //get single row to edit....
  const fileDataApproved = async (id) => {
    setPageName(!pageName);
        try {
      let res = await axios.get(`${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      renderFilePreviewApproved(res?.data?.snoticeperiodapply.files[0]);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //get single row to edit....
  const fileDataApprovedDownload = async (id) => {
    setPageName(!pageName);
        try {
      let res = await axios.get(`${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setFileApproved(res?.data?.snoticeperiodapply.files[0]);
      res?.data?.snoticeperiodapply.files.forEach((file) => {
        const link = document.createElement("a");
        link.href = `data:application/octet-stream;base64,${file.base64}`;
        link.download = file.name;
        link.click();
      });
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  // Error Popup model
  const [isErrorOpenApproved, setIsErrorOpenApproved] = useState(false);
  const [setShowAlertApproved] = useState();
  const handleClickOpenerrApproved = () => {
    setIsErrorOpenApproved(true);
  };
  const handleCloseerrApproved = () => {
    setIsErrorOpenApproved(false);
  };

  //  PDF
  const columnsApproved = [
    // { title: "Sno", field: "Sno" },
    { title: "Company", field: "company" },
    { title: "Branch", field: "branch" },
    { title: "Unit", field: "unit" },
    { title: "Name", field: "empname" },
    { title: "Empcode", field: "empcode" },
    { title: "Team", field: "team" },
    { title: "Department", field: "department" },
    { title: "Reason", field: "reasonleavingname" },
    { title: "Status", field: "status" },
    { title: "Release Date", field: "releasedate" },
  ];

  const downloadPdf2 = (isfilter) => {
    const doc = new jsPDF();

    let serialNumberCounter = 1;

    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" },
      ...columnsApproved.map((col) => ({ ...col, dataKey: col.field })),
    ];

    const dataWithSerial =
      isfilter === "filtered"
        ? rowDataTableApproved.map((row) => ({
            ...row,
            serialNumber: serialNumberCounter++,
            approvenoticereq: moment(row.releasedate).format("DD-MM-YYYY"),
          }))
        : employeeApprovedFilterArray.map((row) => ({
            ...row,
            serialNumber: serialNumberCounter++,
            status: "Approved",
            releasedate: moment(row.approvenoticereq).format("DD-MM-YYYY"),
          }));

    doc.autoTable({
      theme: "grid",
      styles: {
        fontSize: 4,
        cellWidth: "auto",
      },
      columns: columnsWithSerial,
      body: dataWithSerial,
    });

    doc.save("NoticePeriodListApproved.pdf");
  };

  // Excel
  const fileNameApproved = "NoticePeriodListApproved";
  let excelnoapproved = 1;

  // get particular columnsApproved for export excel
  const getexcelDatasApproved = async () => {
    setPageName(!pageName);
        try {
      let res = await axios.post(SERVICE.NOTICEPERIODAPPLYBYASSIGNBRANCH,{
        assignbranch:isAssignBranch
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let ans = res?.data?.noticeperiodapply.filter(
        (data) => data.approvedStatus === "true"
      );
      var data =
        ans.length > 0 &&
        ans.map((t) => ({
          Sno: excelnoapproved++,
          Company: t.company,
          Branch: t.branch,
          unit: t.unit,
          Name: t.empname,
          Empcode: t.empcode,
          Team: t.team,
          Department: t.department,
          date: t.noticedate,
          Reason: t.reasonleavingname,
          approvedthrough: t.approvedthrough,
          Status: "Approved",
          Releasedate: t.approvenoticereq,
        }));
      setexceldataApproved(data);} catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //print...
  const componentRefApproved = useRef();
  const handleprintApproved = useReactToPrint({
    content: () => componentRefApproved.current,
    documentTitle: "NoticePeriodListApproved",
    pageStyle: "print",
  });

  useEffect(() => {
    fetchNoticeperiodlistApproved();
  }, []);

  useEffect(() => {
    getexcelDatasApproved();
  }, [employeeApproved]);

  //table entries ..,.
  const [itemsApproved, setItemsApproved] = useState([]);

  const addSerialNumberApproved = () => {
    const itemsWithSerialNumber = employeeApproved?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItemsApproved(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumberApproved();
  }, [employeeApproved]);

  //table sorting
  const [sortingApproved, setSortingApproved] = useState({
    column: "",
    direction: "",
  });

  const handleSortingApproved = (column) => {
    const direction =
      sortingApproved.column === column && sortingApproved.direction === "asc"
        ? "desc"
        : "asc";
    setSortingApproved({ column, direction });
  };

  itemsApproved.sort((a, b) => {
    if (sortingApproved.direction === "asc") {
      return a[sortingApproved.column] > b[sortingApproved.column] ? 1 : -1;
    } else if (sortingApproved.direction === "desc") {
      return a[sortingApproved.column] < b[sortingApproved.column] ? 1 : -1;
    }
    return 0;
  });

  //Datatable
  const handlePageChangeApproved = (newPage) => {
    setPageApproved(newPage);
  };

  const handlePageSizeChangeApproved = (event) => {
    setPageApprovedSize(Number(event.target.value));
    setPageApproved(1);
  };

  //datatable....
  const [searchQueryApproved, setSearchQueryApproved] = useState("");
  const handleSearchChangeApproved = (event) => {
    setSearchQueryApproved(event.target.value);
  };

  // Split the search query into individual terms
  const searchTermsApproved = searchQueryApproved.toLowerCase().split(" ");

  // Modify the filtering logic to check each term
  const filteredDatasApproved = itemsApproved?.filter((item) => {
    return searchTermsApproved.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
  });

  const filteredDataApproved = filteredDatasApproved.slice(
    (pageApproved - 1) * pageSizeApproved,
    pageApproved * pageSizeApproved
  );

  const totalPagesApproved = Math.ceil(
    employeeApproved.length / pageSizeApproved
  );

  const visiblePagesApproved = Math.min(totalPagesApproved, 3);

  const firstVisiblePageApproved = Math.max(1, pageApproved - 1);
  const lastVisiblePageApproved = Math.min(
    firstVisiblePageApproved + visiblePagesApproved - 1,
    totalPagesApproved
  );

  const pageNumbersApproved = [];

  for (let i = firstVisiblePageApproved; i <= lastVisiblePageApproved; i++) {
    pageNumbersApproved.push(i);
  }

  const [selectAllCheckedApproved, setSelectAllCheckedApproved] =
    useState(false);

  const CheckboxHeaderApproved = ({
    selectAllCheckedApproved,
    onSelectAll,
  }) => (
    <div>
      <Checkbox checked={selectAllCheckedApproved} onChange={onSelectAll} />
    </div>
  );

  // Table start colum and row
  // Define columnsApproved for the DataGrid
  const columnDataTableApproved = [
    {
      field: "checkbox",
      headerName: "Checkbox", // Default header name
      headerStyle: {
        fontWeight: "bold", // Apply the font-weight style to make the header text bold
        // Add any other CSS styles as needed
      },
      renderHeader: (params) => (
        <CheckboxHeaderApproved
          selectAllCheckedApproved={selectAllCheckedApproved}
          onSelectAll={() => {
            if (rowDataTableApproved.length === 0) {
              // Do not allow checking when there are no rows
              return;
            }
            if (selectAllCheckedApproved) {
              setSelectedRowsApproved([]);
            } else {
              const allRowIds = rowDataTableApproved.map((row) => row.id);
              setSelectedRowsApproved(allRowIds);
            }
            setSelectAllCheckedApproved(!selectAllCheckedApproved);
          }}
        />
      ),

      renderCell: (params) => (
        <Checkbox
          checked={selectedRowsApproved.includes(params.row.id)}
          onChange={() => {
            let updatedSelectedRows;
            if (selectedRowsApproved.includes(params.row.id)) {
              updatedSelectedRows = selectedRowsApproved.filter(
                (selectedId) => selectedId !== params.row.id
              );
            } else {
              updatedSelectedRows = [...selectedRowsApproved, params.row.id];
            }

            setSelectedRowsApproved(updatedSelectedRows);

            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllCheckedApproved(
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
      width: 50,
      hide: !columnVisibilityApproved.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "cancel",
      headerName: "Cancel",
      flex: 0,
      width: 300,
      sortable: false,
      hide: !columnVisibility.cancel,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          <Grid item md={3} xs={12} sm={12}>
            <FormControl size="small" fullWidth>
              <OutlinedInput
                id="component-outlined"
                type="text"
                placeholder="Reason"
                value={params.row.cancelreason}
                onChange={(e) => {
                  cancelcontinuestatusFunction(params.row.id, e, "cancel");
                }}
              />
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12} sm={12}>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                getCodeReject(params.row.id, params.row.cancelreason, "cancel");
              }}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      ),
    },
    {
      field: "continue",
      headerName: "Continue",
      flex: 0,
      width: 300,
      sortable: false,
      hide: !columnVisibility.continue,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          <Grid item md={3} xs={12} sm={12}>
            <FormControl size="small" fullWidth>
              <OutlinedInput
                id="component-outlined"
                type="text"
                placeholder="Reason"
                value={params.row.continuereason}
                onChange={(e) => {
                  cancelcontinuestatusFunction(params.row.id, e, "continue");
                }}
              />
            </FormControl>
          </Grid>{" "}
          <Grid item md={3} xs={12} sm={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                getCodeReject(
                  params.row.id,
                  params.row.continuereason,
                  "continue"
                );
              }}
            >
              Continue
            </Button>
          </Grid>
        </Grid>
      ),
    },
    {
      field: "scheduleinterview",
      headerName: "Schedule Interview",
      flex: 0,
      width: 250,
      sortable: false,
      hide: !columnVisibility.scheduleinterview,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          <Grid item md={3} xs={12} sm={12}>
            <>
              {params.row.meetingscheduled != true ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    handleClickOpenMeetingPopup(
                      params.row.company,
                      params.row.branch,
                      params.row.team,
                      params.row.department,
                      params.row.empname,
                      params.row.id
                    );
                  }}
                >
                  Schedule Interview
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    getviewCode(params.row.id);
                  }}
                >
                  View Interview
                </Button>
              )}
            </>
          </Grid>{" "}
          :
        </Grid>
      ),
    },
    {
      field: "empname",
      headerName: "Name",
      flex: 0,
      width: 100,
      hide: !columnVisibilityApproved.empname,
      headerClassName: "bold-header",
    },
    {
      field: "company",
      headerName: "Comapny",
      flex: 0,
      width: 100,
      hide: !columnVisibilityApproved.company,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 100,
      hide: !columnVisibilityApproved.branch,
      headerClassName: "bold-header",
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 100,
      hide: !columnVisibilityApproved.unit,
      headerClassName: "bold-header",
    },

    {
      field: "empcode",
      headerName: "Empcode",
      flex: 0,
      width: 100,
      hide: !columnVisibilityApproved.empcode,
      headerClassName: "bold-header",
    },
    {
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 100,
      hide: !columnVisibilityApproved.team,
      headerClassName: "bold-header",
    },
    {
      field: "department",
      headerName: "Department",
      flex: 0,
      width: 100,
      hide: !columnVisibilityApproved.department,
      headerClassName: "bold-header",
    },
    {
      field: "noticedate",
      headerName: "Date",
      flex: 0,
      width: 100,
      hide: !columnVisibilityApproved.noticedate,
      headerClassName: "bold-header",
    },
    {
      field: "reasonleavingname",
      headerName: "Reason",
      flex: 0,
      width: 100,
      hide: !columnVisibilityApproved.reasonleavingname,
      headerClassName: "bold-header",
    },
    {
      field: "files",
      headerName: "Document",
      flex: 0,
      width: 200,
      sortable: false,
      hide: !columnVisibilityApproved.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          <a
            onClick={() => {
              fileDataApproved(params.row.id);
            }}
            style={{ minWidth: "0px", color: "#357AE8", cursor: "pointer" }}
          >
            View
          </a>
          <a
            style={{
              minWidth: "0px",
              textDecoration: "none",
              color: "#357AE8",
              cursor: "pointer",
            }}
            onClick={() => {
              fileDataApprovedDownload(params.row.id);
            }}
          >
            Download
          </a>
        </Grid>
      ),
    },
    {
      field: "approvedthrough",
      headerName: "Approved Through",
      flex: 0,
      width: 150,
      hide: !columnVisibilityApproved.approvedthrough,
      headerClassName: "bold-header",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0,
      width: 200,
      renderCell: (params) => (
        <Button
          variant="contained"
          style={{
            padding: "5px",
            background:
              params.row.status === "Approved"
                ? "green"
                : params.row.status === "Reject"
                ? "red"
                : params.row.status === "Recheck"
                ? "blue"
                : params.row.status === "Applied"
                ? "yellow"
                : params.row.status,
            color: params.row.status === "Applied" ? "black" : "white",
            // color: params.value === "Approved" ? "black" : params.value === "Rejected" ? "white" : "white",
            fontSize: "10px",
            width: "90px",
            fontWeight: "bold",
          }}
        >
          {params.row.status}
        </Button>
      ),
      hide: !columnVisibilityApproved.status,
    },
    {
      field: "releasedate",
      headerName: "Release Date",
      flex: 0,
      width: 150,
      hide: !columnVisibilityApproved.releasedate,
      headerClassName: "bold-header",
    },
  ];

  // Create a row data object for the DataGrid
  const rowDataTableApproved = filteredDataApproved.map((notice, index) => {
    return {
      id: notice._id,
      serialNumber: notice.serialNumber,
      company: notice.company,
      branch: notice.branch,
      unit: notice.unit,
      empname: notice.empname,
      empcode: notice.empcode,
      team: notice.team,
      department: notice.department,
      noticedate: moment(notice.noticedate).format("DD-MM-YYYY"),
      reasonleavingname: notice.reasonleavingname,
      files: notice.files,
      // status: notice.status,
      status: "Approved",
      approvedthrough: notice.approvedthrough,
      releasedate: moment(notice.approvenoticereq).format("DD-MM-YYYY"),
      cancelreason: notice.cancelreason,
      continuereason: notice.continuereason,
      meetingscheduled: notice?.meetingscheduled,
    };
  });
  const handleShowAllcolumnsApproved = () => {
    const updatedVisibility = { ...columnVisibilityApproved };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibilityApproved(updatedVisibility);
  };

  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem("columnVisibilityApproved");
    if (savedVisibility) {
      setColumnVisibilityApproved(JSON.parse(savedVisibility));
    }
  }, []);

  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem(
      "columnVisibilityApproved",
      JSON.stringify(columnVisibilityApproved)
    );
  }, [columnVisibilityApproved]);
  // Manage Columns functionality
  const toggleColumnVisibilityApproved = (field) => {
    setColumnVisibilityApproved((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };
  // Function to filter columns based on search query
  const filteredColumnsApproved = columnDataTableApproved.filter((column) =>
    column.headerName
      .toLowerCase()
      .includes(searchQueryManageApproved.toLowerCase())
  );
  // JSX for the "Manage Columns" popover content
  const manageColumnsContentApproved = (
    <Box
      sx={{
        padding: "10px",
        minWidth: "325px",
        "& .MuiDialogContent-root": { padding: "10px 0" },
      }}
    >
      <Typography variant="h6">Manage Columns</Typography>
      <IconButton
        aria-label="close"
        onClick={handleCloseManageColumnsApproved}
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
          value={searchQueryManageApproved}
          onChange={(e) => setSearchQueryManageApproved(e.target.value)}
          sx={{ marginBottom: 5, position: "absolute" }}
        />
      </Box>
      <br />
      <br />
      <DialogContent
        sx={{ minWidth: "auto", height: "200px", position: "relative" }}
      >
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumnsApproved?.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={
                  <Switch
                    sx={{ marginTop: "-5px" }}
                    size="small"
                    checked={columnVisibilityApproved[column.field]}
                    onChange={() =>
                      toggleColumnVisibilityApproved(column.field)
                    }
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
              onClick={() =>
                setColumnVisibilityApproved(initialColumnVisibilityApproved)
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
              onClick={() => setColumnVisibilityApproved({})}
            >
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );
  // Calculate the DataGrid height based on the number of rows
  const calculateDataGridHeightApproved = () => {
    if (pageSizeApproved === "All") {
      return "auto"; // Auto height for 'All' entries
    } else {
      // Calculate the height based on the number of rows displayed
      const visibleRows = Math.min(
        pageSizeApproved,
        filteredDatasApproved.length
      );
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
          Company: t.company,
          Branch: t.branch,
          Unit: t.unit,
          Name: t.empname,
          Empcode: t.empcode,
          Team: t.team,
          Department: t.department,
          Date: moment(t.noticedate).format("DD-MM-YYYY"),
          Reason: t.reasonleavingname,
          Status: t.status,
          Requestdate:
            t.requestdate === ""
              ? ""
              : moment(t.requestdate).format("DD-MM-YYYY"),
          Requestdatereason: t.requestdatereason,
        })),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        employeesfilterArray.map((t, index) => ({
          Sno: index + 1,
          Company: t.company,
          Branch: t.branch,
          Unit: t.unit,
          Name: t.empname,
          Empcode: t.empcode,
          Team: t.team,
          Department: t.department,
          Date: moment(t.noticedate).format("DD-MM-YYYY"),
          Reason: t.reasonleavingname,
          Status: t.status,
          Requestdate:
            t.requestdate === ""
              ? ""
              : moment(t.requestdate).format("DD-MM-YYYY"),
          Requestdatereason: t.requestdatestatus ? t.requestdatereason : "",
          Releasedate: t.releasedate,
        })),
        fileName
      );
    }

    setIsFilterOpen(false);
  };

  const handleExportXL2 = (isfilter) => {
    if (isfilter === "filtered") {
      exportToCSV(
        rowDataTableApproved?.map((t, index) => ({
          Sno: index + 1,
          Company: t.company,
          Branch: t.branch,
          Unit: t.unit,
          Name: t.empname,
          Empcode: t.empcode,
          Team: t.team,
          Department: t.department,
          Reason: t.reasonleavingname,
          Status: t.status,
          Releasedate: t.releasedate,
        })),
        fileNameApproved
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        employeeApprovedFilterArray.map((t, index) => ({
          Sno: index + 1,
          Company: t.company,
          Branch: t.branch,
          Unit: t.unit,
          Name: t.empname,
          Empcode: t.empcode,
          Team: t.team,
          Department: t.department,
          Date: moment(t.noticedate).format("DD-MM-YYYY"),
          Reason: t.reasonleavingname,
          Status: "Approved",
          Releasedate: moment(t.approvenoticereq).format("DD-MM-YYYY"),
        })),
        fileNameApproved
      );
    }

    setIsFilterOpen2(false);
  };

  return (
    <Box>
      {/* ****** Header Content ****** */}
      <Headtitle title={"NOTICE PERIOD REQUEST LIST"} />
      <PageHeading
        title="Notice Period Request list"
        modulename="Human Resources"
        submodulename="HR"
        mainpagename="Employee"
        subpagename="Notice Period"
        subsubpagename="Notice Period Approve"
      />

      <br />
      {isUserRoleCompare?.includes("lnoticeperiodapprove") && (
        <>
          <Box sx={userStyle.container}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.SubHeaderText}>
                  Notice Period Request list
                </Typography>
              </Grid>
            </Grid>
            {!isBoarding ? (
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
                <br />
                <br />
                <Grid container sx={{ justifyContent: "center" }}>
                  <Grid>
                    {isUserRoleCompare?.includes(
                      "csvnoticeperiodapprove"
                    ) && (
                      <>
                        <Button
                          onClick={(e) => {
                            setIsFilterOpen(true);
                            fetchNoticeperiodlistArray();
                            setFormat("xl");
                          }}
                          sx={userStyle.buttongrp}
                        >
                          <FaFileExcel />
                          &ensp;Export to Excel&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes(
                      "excelnoticeperiodapprove"
                    ) && (
                      <>
                        <Button
                          onClick={(e) => {
                            setIsFilterOpen(true);
                            fetchNoticeperiodlistArray();
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
                      "printnoticeperiodapprove"
                    ) && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes(
                      "pdfnoticeperiodapprove"
                    ) && (
                      <>
                        <Button
                          sx={userStyle.buttongrp}
                          onClick={() => {
                            setIsPdfFilterOpen(true);
                            fetchNoticeperiodlistArray();
                          }}
                        >
                          <FaFilePdf />
                          &ensp;Export to PDF&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes(
                      "imagenoticeperiodapprove"
                    ) && (
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={handleCaptureImage}
                      >
                        {" "}
                        <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                        &ensp;Image&ensp;{" "}
                      </Button>
                    )}
                  </Grid>
                </Grid>
                <br />
                {/* added to the pagination grid */}
                <Grid style={userStyle.dataTablestyle}>
                  <Box>
                    <label htmlFor="pageSizeSelect">Show entries:</label>
                    <Select
                      id="pageSizeSelect"
                      value={pageSize}
                      onChange={handlePageSizeChange}
                      sx={{ width: "77px" }}
                    >
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={5}>5</MenuItem>
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={25}>25</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                      <MenuItem value={100}>100</MenuItem>
                      {/* <MenuItem value={employees.length}>All</MenuItem> */}
                    </Select>
                  </Box>
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
                <br />
                {/* ****** Table Grid Container ****** */}
                <Grid container>
                  <Grid md={4} sm={2} xs={1}></Grid>
                  <Grid md={8} sm={10} xs={10} sx={{ align: "center" }}></Grid>
                </Grid>
                <br />
                {/* ****** Table start ****** */}
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
                <br />
                <br />
                {/* {isLoader ? ( */}
                <>
                  <Box style={{ width: "100%", overflowY: "hidden" }}>
                    <StyledDataGrid
                      rows={rowDataTable}
                      columns={columnDataTable.filter(
                        (column) => columnVisibility[column.field]
                      )}
                      autoHeight={true}
                      density="standard"
                      ref={gridRef}
                      hideFooter
                      // getRowClassName={getRowClassNameAll}
                      disableRowSelectionOnClick
                      unstable_cellSelection
                      onClipboardCopy={(copiedString) =>
                        setCopiedData(copiedString)
                      }
                      unstable_ignoreValueFormatterDuringExport
                    />
                  </Box>
                  <Box style={userStyle.dataTablestyle}>
                    Showing{" "}
                    {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
                    {Math.min(page * pageSize, filteredDatas.length)} of{" "}
                    {filteredDatas.length} entries
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
                  </Box>{" "}
                  <br /> <br />
                </>
              </>
            )}
          </Box>
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

          <br />
          <Box sx={userStyle.container}>
            <Box>
              {/* ****** Header Content ****** */}
              {/* <Typography sx={userStyle.HeaderText}>Notice Period List</Typography> */}
              <br />
              {isUserRoleCompare?.includes("lnoticeperiodapprove") && (
                <>
                  <Box>
                    <Grid container spacing={2}>
                      <Grid item xs={8}>
                        <Typography sx={userStyle.SubHeaderText}>
                          Notice Period Approved List
                        </Typography>
                      </Grid>
                    </Grid>
                    {!isBoardingApproved ? (
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
                        <br />
                        <br />
                        <Grid container sx={{ justifyContent: "center" }}>
                          <Grid>
                            {isUserRoleCompare?.includes(
                              "csvnoticeperiodapprove"
                            ) && (
                              <>
                                <Button
                                  onClick={(e) => {
                                    setIsFilterOpen2(true);
                                    fetchNoticeperiodlistApprovedArray();
                                    setFormat("xl");
                                  }}
                                  sx={userStyle.buttongrp}
                                >
                                  <FaFileExcel />
                                  &ensp;Export to Excel&ensp;
                                </Button>
                              </>
                            )}
                            {isUserRoleCompare?.includes(
                              "excelnoticeperiodapprove"
                            ) && (
                              <>
                                <Button
                                  onClick={(e) => {
                                    setIsFilterOpen2(true);
                                    fetchNoticeperiodlistApprovedArray();

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
                              "printnoticeperiodapprove"
                            ) && (
                              <>
                                <Button
                                  sx={userStyle.buttongrp}
                                  onClick={handleprintApproved}
                                >
                                  &ensp;
                                  <FaPrint />
                                  &ensp;Print&ensp;
                                </Button>
                              </>
                            )}
                            {isUserRoleCompare?.includes(
                              "pdfnoticeperiodapprove"
                            ) && (
                              <>
                                <Button
                                  sx={userStyle.buttongrp}
                                  onClick={() => {
                                    setIsPdfFilterOpen2(true);
                                    fetchNoticeperiodlistApprovedArray();
                                  }}
                                >
                                  <FaFilePdf />
                                  &ensp;Export to PDF&ensp;
                                </Button>
                              </>
                            )}
                            {isUserRoleCompare?.includes(
                              "imagenoticeperiodapprove"
                            ) && (
                              <Button
                                sx={userStyle.buttongrp}
                                onClick={handleCaptureImageApproved}
                              >
                                {" "}
                                <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                                &ensp;Image&ensp;{" "}
                              </Button>
                            )}
                          </Grid>
                        </Grid>
                        <br />
                        {/* added to the pagination grid */}
                        <Grid style={userStyle.dataTablestyle}>
                          <Box>
                            <label htmlFor="pageSizeSelect">
                              Show entries:
                            </label>
                            <Select
                              id="pageSizeSelect"
                              value={pageSizeApproved}
                              onChange={handlePageSizeChangeApproved}
                              sx={{ width: "77px" }}
                            >
                              <MenuItem value={1}>1</MenuItem>
                              <MenuItem value={5}>5</MenuItem>
                              <MenuItem value={10}>10</MenuItem>
                              <MenuItem value={25}>25</MenuItem>
                              <MenuItem value={50}>50</MenuItem>
                              <MenuItem value={100}>100</MenuItem>
                              {/* <MenuItem value={employeeApproved.length}>
                                All
                              </MenuItem> */}
                            </Select>
                          </Box>
                          <Box>
                            <FormControl fullWidth size="small">
                              <Typography>Search</Typography>
                              <OutlinedInput
                                id="component-outlined"
                                type="text"
                                value={searchQueryApproved}
                                onChange={handleSearchChangeApproved}
                              />
                            </FormControl>
                          </Box>
                        </Grid>
                        <br />
                        {/* ****** Table Grid Container ****** */}
                        <Grid container>
                          <Grid md={4} sm={2} xs={1}></Grid>
                          <Grid
                            md={8}
                            sm={10}
                            xs={10}
                            sx={{ align: "center" }}
                          ></Grid>
                        </Grid>
                        <br />
                        {/* ****** Table start ****** */}
                        <Button
                          sx={userStyle.buttongrp}
                          onClick={() => {
                            handleShowAllcolumnsApproved();
                            setColumnVisibilityApproved(
                              initialColumnVisibilityApproved
                            );
                          }}
                        >
                          Show All Columns
                        </Button>
                        &ensp;
                        <Button
                          sx={userStyle.buttongrp}
                          onClick={handleOpenManageColumnsApproved}
                        >
                          Manage Columns
                        </Button>
                        <br />
                        <br />
                        {/* {isLoader ? ( */}
                        <>
                          <Box
                            style={{
                              height: calculateDataGridHeightApproved(),
                              width: "100%",
                              overflowY: "hidden", // Hide the y-axis scrollbar
                            }}
                          >
                            <Box style={{ width: "100%", overflowY: "hidden" }}>
                              <StyledDataGrid
                                rows={rowDataTableApproved}
                                columns={columnDataTableApproved.filter(
                                  (column) =>
                                    columnVisibilityApproved[column.field]
                                )}
                                autoHeight={true}
                                density="standard"
                                hideFooter
                                ref={gridRef1}
                                disableRowSelectionOnClick
                                unstable_cellSelection
                                onClipboardCopy={(copiedString) =>
                                  setCopiedDataApproved(copiedString)
                                }
                                unstable_ignoreValueFormatterDuringExport
                              />
                            </Box>
                          </Box>

                          <Box style={userStyle.dataTablestyle}>
                            <Box>
                              Showing{" "}
                              {filteredDataApproved.length > 0
                                ? (pageApproved - 1) * pageSizeApproved + 1
                                : 0}{" "}
                              to{" "}
                              {Math.min(
                                pageApproved * pageSizeApproved,
                                filteredDatasApproved.length
                              )}{" "}
                              of {filteredDatasApproved.length} entries
                            </Box>
                            <Box>
                              <Button
                                onClick={() => setPageApproved(1)}
                                disabled={pageApproved === 1}
                                sx={userStyle.paginationbtn}
                              >
                                <FirstPageIcon />
                              </Button>
                              <Button
                                onClick={() =>
                                  handlePageChangeApproved(pageApproved - 1)
                                }
                                disabled={pageApproved === 1}
                                sx={userStyle.paginationbtn}
                              >
                                <NavigateBeforeIcon />
                              </Button>
                              {pageNumbersApproved?.map((pageNumber) => (
                                <Button
                                  key={pageNumber}
                                  sx={userStyle.paginationbtn}
                                  onClick={() =>
                                    handlePageChangeApproved(pageNumber)
                                  }
                                  className={
                                    pageApproved === pageNumber ? "active" : ""
                                  }
                                  disabled={pageApproved === pageNumber}
                                >
                                  {pageNumber}
                                </Button>
                              ))}
                              {lastVisiblePageApproved < totalPagesApproved && (
                                <span>...</span>
                              )}
                              <Button
                                onClick={() =>
                                  handlePageChangeApproved(pageApproved + 1)
                                }
                                disabled={pageApproved === totalPagesApproved}
                                sx={userStyle.paginationbtn}
                              >
                                <NavigateNextIcon />
                              </Button>
                              <Button
                                onClick={() =>
                                  setPageApproved(totalPagesApproved)
                                }
                                disabled={pageApproved === totalPagesApproved}
                                sx={userStyle.paginationbtn}
                              >
                                <LastPageIcon />
                              </Button>
                            </Box>
                          </Box>
                          {/* Manage Column */}
                          <Popover
                            id={idApproved}
                            open={isManageColumnsOpenApproved}
                            anchorEl={anchorElApproved}
                            onClose={handleCloseManageColumnsApproved}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "left",
                            }}
                          >
                            {manageColumnsContentApproved}
                          </Popover>
                        </>
                      </>
                    )}
                  </Box>
                </>
              )}
              <br />
              {/* ****** Table End ****** */}
            </Box>
          </Box>
        </>
      )}
      <br />
      {/* ****** Table End ****** */}

      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table aria-label="simple table" id="branch" ref={componentRef}>
          <TableHead sx={{ fontWeight: "600" }}>
            <StyledTableRow>
              <StyledTableCell>SI.NO</StyledTableCell>
              <StyledTableCell>Company</StyledTableCell>
              <StyledTableCell>Branch</StyledTableCell>
              <StyledTableCell>Unit </StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Empcode</StyledTableCell>
              <StyledTableCell>Team</StyledTableCell>
              <StyledTableCell>Department</StyledTableCell>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell>Reason</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Request Date</StyledTableCell>
              <StyledTableCell>Request Reason</StyledTableCell>
              <StyledTableCell>Releasedate</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {rowDataTable &&
              rowDataTable.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{row.company} </StyledTableCell>
                  <StyledTableCell>{row.branch} </StyledTableCell>
                  <StyledTableCell> {row.unit}</StyledTableCell>
                  <StyledTableCell>{row.empname}</StyledTableCell>
                  <StyledTableCell>{row.empcode}</StyledTableCell>
                  <StyledTableCell>{row.team}</StyledTableCell>
                  <StyledTableCell>{row.department}</StyledTableCell>
                  <StyledTableCell>
                    {moment(row.noticedate).format("DD-MM-YYYY")}
                  </StyledTableCell>
                  <StyledTableCell>{row.reasonleavingname}</StyledTableCell>
                  <StyledTableCell>{row.status}</StyledTableCell>
                  <StyledTableCell>
                    {row.requestdate === ""
                      ? ""
                      : moment(row.requestdate).format("DD-MM-YYYY")}
                  </StyledTableCell>
                  <StyledTableCell>{row.requestdatereason}</StyledTableCell>
                  <StyledTableCell>{row.approvenoticereq}</StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table aria-label="simple table" id="branch" ref={componentRefApproved}>
          <TableHead sx={{ fontWeight: "600" }}>
            <StyledTableRow>
              <StyledTableCell>SI.NO</StyledTableCell>
              <StyledTableCell>Company</StyledTableCell>
              <StyledTableCell>Branch</StyledTableCell>
              <StyledTableCell>Unit </StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Empcode</StyledTableCell>
              <StyledTableCell>Team</StyledTableCell>
              <StyledTableCell>Department</StyledTableCell>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell>Reason</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Approved Through</StyledTableCell>
              <StyledTableCell>Request Date</StyledTableCell>
              <StyledTableCell>Releasedate</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {rowDataTableApproved &&
              rowDataTableApproved.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{row.company} </StyledTableCell>
                  <StyledTableCell>{row.branch} </StyledTableCell>
                  <StyledTableCell> {row.unit}</StyledTableCell>
                  <StyledTableCell>{row.empname}</StyledTableCell>
                  <StyledTableCell>{row.empcode}</StyledTableCell>
                  <StyledTableCell>{row.team}</StyledTableCell>
                  <StyledTableCell>{row.department}</StyledTableCell>
                  <StyledTableCell>{row.noticedate}</StyledTableCell>
                  <StyledTableCell>{row.reasonleavingname}</StyledTableCell>
                  <StyledTableCell>{"Approved"}</StyledTableCell>
                  <StyledTableCell>{row.approvedthrough}</StyledTableCell>
                  <StyledTableCell>{row.requestdate}</StyledTableCell>
                  <StyledTableCell>{row.approvenoticereq}</StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
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

          {fileFormat === "xl" ? (
            <FaFileExcel style={{ fontSize: "70px", color: "green" }} />
          ) : (
            <FaFileCsv style={{ fontSize: "70px", color: "green" }} />
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
              fetchNoticeperiodlistArray();
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
      {/*Export XL Data  */}
      <Dialog
        open={isFilterOpen2}
        onClose={handleCloseFilterMod2}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleCloseFilterMod2}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>

          {fileFormat === "xl" ? (
            <FaFileExcel style={{ fontSize: "70px", color: "green" }} />
          ) : (
            <FaFileCsv style={{ fontSize: "70px", color: "green" }} />
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
              handleExportXL2("filtered");
            }}
          >
            Export Filtered Data
          </Button>
          <Button
            autoFocus
            variant="contained"
            onClick={(e) => {
              handleExportXL2("overall");
              fetchNoticeperiodlistApprovedArray();
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
      {/*Export pdf Data  */}
      <Dialog
        open={isPdfFilterOpen2}
        onClose={handleClosePdfFilterMod2}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleClosePdfFilterMod2}
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
              downloadPdf2("filtered");
              setIsPdfFilterOpen2(false);
            }}
          >
            Export Filtered Data
          </Button>
          <Button
            variant="contained"
            onClick={(e) => {
              downloadPdf2("overall");
              setIsPdfFilterOpen2(false);
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>

      {/* schedule meeting popup*/}
      <Dialog
        open={openMeetingPopup}
        onClose={handleClickCloseMeetingPopup}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth={true}
      >
        {/* <VendorPopup setVendorAuto={setVendorAuto} handleCloseviewalertvendor={handleCloseviewalertvendor} /> */}
        <ScheduleMeetingNoticePeriod
          setVendorAuto={setVendorAuto}
          handleClickCloseMeetingPopup={handleClickCloseMeetingPopup}
          meetingValues={meetingValues}
        />
      </Dialog>

      {/* schdedule meeting view model */}
      <Dialog
        open={openMeetingViewPopup}
        onClose={handleClickCloseMeetingViewPopup}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Schedule Interview
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Company</Typography>
                  <Typography>
                    {meetingData.company
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Branch</Typography>
                  <Typography>
                    {meetingData.branch
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Team</Typography>
                  <Typography>
                    {meetingData.team
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Department</Typography>
                  <Typography>
                    {meetingData.department
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Meeting Category</Typography>
                  <Typography>{meetingData.meetingcategory}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Interviewer</Typography>
                  <Typography>
                    {meetingData.interviewer
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Meeting Type</Typography>
                  <Typography>{meetingData.meetingtype}</Typography>
                </FormControl>
              </Grid>
              {meetingData.meetingtype === "Online" && (
                <>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Meeting Mode</Typography>
                      <Typography>{meetingData.meetingmode}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Link</Typography>
                      <Link
                        href={meetingData.link}
                        variant="body3"
                        underline="none"
                        target="_blank"
                      >
                        {meetingData.link}
                      </Link>
                    </FormControl>
                  </Grid>
                </>
              )}
              {meetingData.meetingtype === "Offline" && (
                <>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Location-Branch</Typography>
                      <Typography>
                        {meetingData.branchvenue
                          ?.map((t, i) => `${i + 1 + ". "}` + t)
                          .toString()}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Location-Floor</Typography>
                      <Typography>
                        {meetingData.floorvenue
                          ?.map((t, i) => `${i + 1 + ". "}` + t)
                          .toString()}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Location-Area</Typography>
                      <Typography>{meetingData.venue}</Typography>
                    </FormControl>
                  </Grid>
                </>
              )}
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Title</Typography>
                  <Typography>{meetingData.title}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Date</Typography>
                  <Typography>
                    {moment(meetingData.date).format("DD-MM-YYYY")}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Time</Typography>
                  <Typography>{meetingData.time}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Duration</Typography>
                  <Typography>{meetingData.duration}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Time Zone</Typography>
                  <Typography>{meetingData.timezone}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Meeting Participant</Typography>
                  <Typography>
                    {meetingData.participants
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Meeting Type</Typography>
                  <Typography>{meetingData.meetingtype}</Typography>
                </FormControl>
              </Grid>
              {meetingData.reminder && (
                <>
                  {" "}
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Repeat Type</Typography>
                      <Typography>{meetingData.repeattype}</Typography>
                    </FormControl>
                  </Grid>
                </>
              )}
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleClickCloseMeetingViewPopup}
              >
                Back
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>
      {/* Alert Dialog */}
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
    </Box>
  );
}

export default Noticestatuslist;