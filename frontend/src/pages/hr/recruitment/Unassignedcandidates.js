import React, { useState, useEffect, useRef, useContext } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {
  TextField,
  IconButton,
  ListItem,
  List,
  Checkbox,
  ListItemText,
  Popover,
  Box,
  Typography,
  OutlinedInput,
  TableBody,
  Select,
  Paper,
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Table,
  TableHead,
  TableContainer,
  Button,
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { handleApiError } from "../../../components/Errorhandling";
import moment from "moment-timezone";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Selects from "react-select";
import { userStyle } from "../../../pageStyle";
import StyledDataGrid from "../../../components/TableStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import PageHeading from "../../../components/PageHeading";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import { useNavigate, Link } from "react-router-dom";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";

function UnassignedCandidates() {
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
        rowDataTable?.map((item, index) => ({
          Sno: index + 1,
          Role: item.role,
          "Applicant Name": item.fullname,
          "Contact Name": item.mobile,
          Email: item.email,
          "Date of Birth": item.dateofbirth,
          Experience: item.experience,
          Skill: item.skill,
          "Applied Date": item.applieddate,
        })),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        items?.map((item, index) => ({
          Sno: index + 1,
          Role: item.role,
          "Applicant Name": item.fullname,
          "Contact Name": item.mobile,
          Email: item.email,
          "Date of Birth": item.dateofbirth,
          Experience: `${item?.experience} ${
            item?.experienceestimation == undefined
              ? "Years"
              : item?.experienceestimation
          }`,
          Skill: item.skill?.join(","),
          "Applied Date": item.applieddate,
        })),
        fileName
      );
    }
    setIsFilterOpen(false);
  };

  //  PDF
  const columns = [
    { title: "Role", field: "role" },
    { title: "Applicant Name", field: "fullname" },
    { title: "Contact No", field: "mobile" },
    { title: "Email", field: "email" },
    { title: "Date of Birth", field: "dateofbirth" },
    { title: "Experience", field: "experience" },
    { title: "Skill", field: "skill" },
    { title: "Applied Date", field: "applieddate" },
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
        ? rowDataTable?.map((item, index) => ({
            serialNumber: index + 1,
            role: item.role,
            fullname: item.fullname,
            mobile: item.mobile,
            email: item.email,
            dateofbirth: item.dateofbirth,
            experience: item.experience,
            skill: item.skill,
            applieddate: item.applieddate,
          }))
        : items?.map((item, index) => ({
            serialNumber: index + 1,
            role: item.role,
            fullname: item.fullname,
            mobile: item.mobile,
            email: item.email,
            dateofbirth: item.dateofbirth,
            experience: `${item?.experience} ${
              item?.experienceestimation == undefined
                ? "Years"
                : item?.experienceestimation
            }`,
            skill: item.skill?.join(","),
            applieddate: item.applieddate,
          }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: "5" },
    });

    doc.save("Unassigned Candidates Report.pdf");
  };

  const [candidates, setCandidates] = useState([]);
  const [candidateSingle, setCandidateSingle] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { isUserRoleAccess, isUserRoleCompare, pageName, setPageName } =
    useContext(UserRoleAccessContext);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const navigate = useNavigate();

  const { auth } = useContext(AuthContext);

  const handleClickOpenalert = () => {
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      setIsDeleteOpencheckbox(true);
    }
  };

  const [isEditOpen, setIsEditOpen] = useState(false);

  const [isBankdetail, setBankdetail] = useState(false);

  let username = isUserRoleAccess.username;
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };

  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Unassigned Candidates Report.png");
        });
      });
    }
  };

  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };

  //for assigning workstation
  const [companies, setCompanies] = useState([]);
  const [branches, setBranches] = useState([]);
  const [designation, setDesignation] = useState([]);
  const [jobRole, setJobRole] = useState([]);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const [openings, setOpenings] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    designation: "Please Select Designation",
    jobrole: "Please Select Job Role",
    jobopeningid: "",
  });
  //fetch companies for dropdown
  const fetchComapnies = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.COMPANY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      // Remove duplicates from companies
      let uniqueCompanies = Array.from(
        new Set(res?.data?.companies.map((t) => t.name))
      );
      setCompanies(
        uniqueCompanies.map((t) => ({
          label: t,
          value: t,
        }))
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    fetchComapnies();
  }, []);

  // Alert delete popup
  let brandid = candidateSingle._id;
  const delBrand = async () => {
    setPageName(!pageName);
    try {
      await axios.delete(`${SERVICE.CANDIDATES_SINGLE}/${brandid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchUnassignedCandidates();
      handleCloseMod();
      setSelectedRows([]);
      setPage(1);
      setShowAlert(
        <>
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "#7ac767" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Deleted Successfully 👍"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //set function to get particular row
  const rowData = async (id) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.CANDIDATES_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setCandidateSingle(res?.data?.scandidates);
      handleClickOpen();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //for getting branches
  const handleCompanyChange = async (options) => {
    setBranches([]);
    setDesignation([]);
    setJobRole([]);
    setOpenings((prev) => ({
      ...prev,
      branch: "Please Select Branch",
      designation: "Please Select Designation",
      jobrole: "Please Select Job Role",
    }));
    setPageName(!pageName);
    try {
      let res_branch = await axios.get(SERVICE.BRANCH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let branchArr = res_branch.data.branch.filter((branch) => {
        return branch.company === options.value;
      });
      let finalArr = branchArr.map((branch) => ({
        label: branch.name,
        value: branch.name,
      }));
      setBranches(finalArr);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //for branch change
  const handleBranchChange = async (options) => {
    setDesignation([]);
    setJobRole([]);
    setOpenings((prev) => ({
      ...prev,
      designation: "Please Select Designation",
      jobrole: "Please Select Job Role",
    }));
    setPageName(!pageName);
    try {
      let res_designation = await axios.get(SERVICE.DESIGNATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let designationArr = res_designation.data.designation.map(
        (designation) => ({
          label: designation.name,
          value: designation.name,
        })
      );

      setDesignation(designationArr);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const handleDesignationChange = async (options) => {
    setJobRole([]);
    setOpenings((prev) => ({
      ...prev,
      jobrole: "Please Select Job Role",
    }));
    setPageName(!pageName);
    try {
      let res_jobopenings = await axios.get(SERVICE.ALLJOBOPENINGS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let jobopeningsArr = res_jobopenings.data.jobopenings.filter(
        (opening) => {
          return (
            opening.status === "OnProgress" &&
            opening.company === openings.company &&
            opening.branch === openings.branch &&
            options.value === opening.designation
          );
        }
      );

      let jobRoleArr = jobopeningsArr.map((job) => ({
        label: job.recruitmentname,
        value: job._id,
      }));

      setJobRole(jobRoleArr);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [rowId, setRowId] = useState();
  const getCode = async (id) => {
    setRowId(id);
  };

  // submit option for saving....
  const handleSubmit = (e) => {
    //fetchUser();
    e.preventDefault();

    if (openings.company === "Please Select Company") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Company"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (openings.branch === "Please Select Branch") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Branch"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (openings.designation === "Please Select Designation") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Designation"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (openings.jobrole === "Please Select Job Role") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Job Role"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequest();
    }
  };

  // post call
  const sendRequest = async () => {
    setPageName(!pageName);
    try {
      // let singleUser = await axios.get(`${SERVICE.CANDIDATES_SINGLE}/${employee.employeeId}`)
      let assignbranches = await axios.put(
        `${SERVICE.CANDIDATES_SINGLE}/${rowId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          role: openings.jobrole,
          jobopeningsid: openings.jobopeningid,
          overallstatus: "Applied",
          updatedby: [
            {
              name: String(username),
              date: String(new Date()),
            },
          ],
        }
      );
      await fetchUnassignedCandidates();
      setOpenings({
        company: "Please Select Company",
        branch: "Please Select Branch",
        designation: "Please Select Designation",
        jobrole: "Please Select Job Role",
      });
      setShowAlert(
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "Green" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Added Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
      handleCloseModEdit();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  // view model
  const [openview, setOpenview] = useState(false);

  const handleClickOpenview = () => {
    setOpenview(true);
  };

  const handleCloseview = () => {
    setOpenview(false);
  };

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };

  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

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
    mode: true,
    role: true,
    branch: true,
    fullname: true,
    mobile: true,
    email: true,
    dateofbirth: true,
    qualification: true,
    experience: true,
    skill: true,
    applieddate: true,
    actions: true,
    category: true,
    subcategory: true,
    specialization: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  // get single row to view....
  const getinfoCode = async (id) => {
    navigate(`/recruitment/viewresume/${id}/unassigned`);
  };

  const delAreagrpcheckbox = async () => {
    setPageName(!pageName);
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.CANDIDATES_SINGLE}/${item}`, {
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

      await fetchUnassignedCandidates();
      setShowAlert(
        <>
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "#7ac767" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Deleted Successfully 👍"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const getinfoCodeNew = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.CANDIDATES_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCandidateSingle(res?.data?.scandidates);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //frequency master name updateby edit page...
  let updateby = candidateSingle.updatedby;
  let addedby = candidateSingle.addedby;

  // info model
  const [openInfo, setOpeninfo] = useState(false);
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  const handleClickOpenInfo = () => {
    setOpenview(true);
  };

  // Edit model
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    setOpenings({
      company: "Please Select Company",
      branch: "Please Select Branch",
      designation: "Please Select Designation",
      jobrole: "Please Select Job Role",
    });
    setDesignation([]);
    setJobRole([]);
    setBranches([]);
  };

  const getEditCode = (id) => {
    navigate(`/unassignedcandidates/editresume/${id}`);
  };

  //get all employees list details
  const fetchUnassignedCandidates = async () => {
    setPageName(!pageName);
    try {
      let res_candidates = await axios.get(SERVICE.INTERVIEWCANDIDATES, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let candi = res_candidates?.data?.candidates?.filter(
        (data) =>
          data?.role === "All" || data?.role === "" || data?.role == undefined
      );
      setCandidates(candi);

      setBankdetail(true);
    } catch (err) {
      setBankdetail(true);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
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

  // Excel
  const fileName = "Unassigned Candidates Report";
  // get particular columns for export excel

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Unassigned Candidates Report",
    pageStyle: "print",
  });

  useEffect(() => {
    fetchUnassignedCandidates();
  }, []);

  //table entries ..,.
  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = candidates?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      applieddate: moment(item.createdAt).format("DD-MM-YYYY"),
      dateofbirth: item?.dateofbirth
        ? moment(item?.dateofbirth).format("DD-MM-YYYY")
        : "",
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [candidates]);

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
      width: 75,

      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 75,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    // { field: "empcode", headerName: "Emp Code", flex: 0, width: 150, hide: !columnVisibility.empcode, headerClassName: "bold-header" },
    // { field: "companyname", headerName: "Name", flex: 0, width: 200, hide: !columnVisibility.companyname, headerClassName: "bold-header" },
    {
      field: "mode",
      headerName: "Mode",
      flex: 0,
      width: 130,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.mode,
      headerClassName: "bold-header",
      // Assign Bank Detail
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("eunassignedcandidates") && (
            <Button
              sx={userStyle.buttonedit}
              variant="contained"
              onClick={() => {
                handleClickOpenEdit();
                getCode(params.row.id);
              }}
            >
              Assign
            </Button>
          )}
          {/* )} */}
        </Grid>
      ),
    },
    {
      field: "role",
      headerName: "Role",
      flex: 0,
      width: 150,
      hide: !columnVisibility.role,
      headerClassName: "bold-header",
    },
    {
      field: "fullname",
      headerName: "Applicant Name",
      flex: 0,
      width: 150,
      hide: !columnVisibility.fullname,
      headerClassName: "bold-header",
    },
    {
      field: "mobile",
      headerName: "Contact No",
      flex: 0,
      width: 100,
      hide: !columnVisibility.mobile,
      headerClassName: "bold-header",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 0,
      width: 100,
      hide: !columnVisibility.email,
      headerClassName: "bold-header",
    },
    {
      field: "dateofbirth",
      headerName: "Date of Birth",
      flex: 0,
      width: 150,
      hide: !columnVisibility.dateofbirth,
      headerClassName: "bold-header",
    },
    // { field: "category", headerName: "Category", flex: 0, width: 100, hide: !columnVisibility.category, headerClassName: "bold-header" },
    // { field: "subcategory", headerName: "Sub Category", flex: 0, width: 100, hide: !columnVisibility.subcategory, headerClassName: "bold-header" },
    // { field: "specialization", headerName: "Specialization", flex: 0, width: 100, hide: !columnVisibility.specialization, headerClassName: "bold-header" },
    {
      field: "experience",
      headerName: "Experience",
      flex: 0,
      width: 100,
      hide: !columnVisibility.experience,
      headerClassName: "bold-header",
    },
    {
      field: "skill",
      headerName: "Skill",
      flex: 0,
      width: 100,
      hide: !columnVisibility.skill,
      headerClassName: "bold-header",
    },
    {
      field: "applieddate",
      headerName: "Applied Date",
      flex: 0,
      width: 100,
      hide: !columnVisibility.applieddate,
      headerClassName: "bold-header",
    },
    // { field: "companyname", headerName: "Name", flex: 0, width: 200, hide: !columnVisibility.companyname, headerClassName: "bold-header" },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 270,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      // Assign Bank Detail
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {/* {isUserRoleCompare?.includes("eassignworkstation") && ( */}
          <Button
            sx={userStyle.buttonedit}
            onClick={() => {
              handleClickOpenInfo();
              getinfoCode(params.row.id);
            }}
          >
            <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
          </Button>
          {isUserRoleCompare?.includes("eunassignedcandidates") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getEditCode(params.row.id);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dunassignedcandidates") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iunassignedcandidates") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpeninfo();
                getinfoCodeNew(params.row.id);
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
      role: item.role,
      fullname: item.fullname,
      mobile: item.mobile,
      email: item.email,
      dateofbirth: item.dateofbirth,
      qualification: item.qualification,
      experience: `${item?.experience} ${
        item?.experienceestimation == undefined
          ? "Years"
          : item?.experienceestimation
      }`,
      skill: item?.skill?.join(","),
      category: item.categoryedu,
      subcategory: item.subcategoryedu,
      specialization: item.specialization,
      applieddate: moment(item.createdAt).format("DD-MM-YYYY"),
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

  return (
    <Box>
      {/* ****** Header Content ****** */}
      <Headtitle title={"UNASSIGNED CANDIDATES REPORT"} />

      <PageHeading
        title="Manage Unassigned Candidates Report"
        modulename="Human Resources"
        submodulename="Recruitment"
        mainpagename="Resume"
        subpagename="Unassigned Candidates"
        subsubpagename=""
      />
      <br />
      {isUserRoleCompare?.includes("lunassignedcandidates") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.SubHeaderText}>
                  Unassigned Candidates List
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <>
                  <Link
                    to="/recruitment/addresume"
                    style={{
                      textDecoration: "none",
                      color: "white",
                      float: "right",
                    }}
                  >
                    <Button variant="contained">ADD</Button>
                  </Link>
                </>
              </Grid>
            </Grid>
            {/* <Grid container spacing={2}>
                            <Grid item xs={8}>
                                <Typography sx={userStyle.importheadtext}>Unassigned Candidates List</Typography>
                            </Grid>
                            <Grid item xs={8} style={{ display:"flex",justifyContent:"flex-end"}}>
                                <Button sx={userStyle.importheadtext} styles={{"right":"0"}}>Add</Button>
                            </Grid>
                        </Grid> */}
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
                    <MenuItem value={candidates?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes("excelunassignedcandidates") && (
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
                  {isUserRoleCompare?.includes("csvunassignedcandidates") && (
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
                  {isUserRoleCompare?.includes("printunassignedcandidates") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfunassignedcandidates") && (
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
                  {isUserRoleCompare?.includes("printunassignedcandidates") && (
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
            {isUserRoleCompare?.includes("bdunassignedcandidates") && (
              <>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleClickOpenalert}
                >
                  Bulk Delete
                </Button>
              </>
            )}
            <br />
            <br />
            {!isBankdetail ? (
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

      {/* Delete Modal */}

      {/* <Box>
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
                            onClick={(e) => delBoardingcheckbox(e)}
                        > OK </Button>
                    </DialogActions>
                </Dialog>

            </Box> */}
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
      {/* Bulk delete ALERT DIALOG */}
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
          <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
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
              onClick={(e) => delAreagrpcheckbox(e)}
            >
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      {/* this is info view details */}
      <Dialog
        open={openInfo}
        onClose={handleCloseinfo}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              Unassigned Candidate Info
            </Typography>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">addedby</Typography>
                  <br />
                  <Table>
                    <TableHead>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {"SNO"}.
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {"UserName"}
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
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
                            {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}
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
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {"SNO"}.
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {" "}
                        {"UserName"}
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
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
                            {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}
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

      <Box>
        {/*DELETE ALERT DIALOG */}
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
            <Button
              autoFocus
              variant="contained"
              color="error"
              onClick={(e) => delBrand(brandid)}
            >
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
          sx={{
            overflow: "visible",
            "& .MuiPaper-root": {
              overflow: "visible",
            },
            width: "50rem",
            margin: "auto auto",
          }}
        >
          <Box sx={{ padding: "20px 50px" }}>
            <>
              <Typography sx={userStyle.SubHeaderText}>
                Assign Unassigned Candidates
              </Typography>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company{" "}
                      <b style={{ color: "red", fontWeight: "lighter" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={companies}
                      placeholder="Please Select Company"
                      value={{
                        label: openings.company,
                        value: openings.company,
                      }}
                      onChange={(e) => {
                        handleCompanyChange(e);
                        setOpenings((prev) => ({
                          ...prev,
                          company: e.value,
                        }));
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch{" "}
                      <b style={{ color: "red", fontWeight: "lighter" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={branches}
                      placeholder="Please Select Branch"
                      value={{ label: openings.branch, value: openings.branch }}
                      onChange={(e) => {
                        handleBranchChange(e);
                        setOpenings((prev) => ({
                          ...prev,
                          branch: e.value,
                        }));
                      }}
                    />
                    {/* <MultiSelect size="small" options={branches} value={selectedOptionsBranchAdd} onChange={handleBranchChangeAdd} valueRenderer={customValueRendererBranchAdd} /> */}
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Designation{" "}
                      <b style={{ color: "red", fontWeight: "lighter" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={designation}
                      placeholder="Please Select Designation"
                      value={{
                        label: openings.designation,
                        value: openings.designation,
                      }}
                      onChange={(e) => {
                        handleDesignationChange(e);
                        setOpenings((prev) => ({
                          ...prev,
                          designation: e.value,
                        }));
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Job Role{" "}
                      <b style={{ color: "red", fontWeight: "lighter" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={jobRole}
                      placeholder="Please Select Job Role"
                      value={{
                        label: openings.jobrole,
                        value: openings.jobrole,
                      }}
                      onChange={(e) => {
                        setOpenings((prev) => ({
                          ...prev,
                          jobrole: e.label,
                          jobopeningid: e.value,
                        }));
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br /> <br /> <br />
              <Grid container>
                <Grid item md={1} sm={1}></Grid>
                <Button variant="contained" onClick={handleSubmit}>
                  Update
                </Button>
                <Grid item md={1} sm={1}></Grid>
                <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
                  Cancel
                </Button>
              </Grid>
            </>
          </Box>
        </Dialog>
      </Box>

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
          <Button variant="contained" color="error" onClick={handleCloseerr}>
            ok
          </Button>
        </DialogActions>
      </Dialog>

      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table aria-label="simple table" id="branch" ref={componentRef}>
          <TableHead sx={{ fontWeight: "500" }}>
            <StyledTableRow>
              <StyledTableCell>SI.NO</StyledTableCell>
              <StyledTableCell>Role</StyledTableCell>
              <StyledTableCell>Applicant Name</StyledTableCell>
              <StyledTableCell>Contact No</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Date of Birth</StyledTableCell>
              {/* <StyledTableCell>Category</StyledTableCell>
                            <StyledTableCell>Sub Category</StyledTableCell>
                            <StyledTableCell>Specialization</StyledTableCell> */}
              <StyledTableCell>Experience</StyledTableCell>
              <StyledTableCell>Skill</StyledTableCell>
              <StyledTableCell>Applied Date</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {rowDataTable &&
              rowDataTable.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell> {row.role}</StyledTableCell>
                  <StyledTableCell> {row.fullname}</StyledTableCell>
                  <StyledTableCell> {row.mobile}</StyledTableCell>
                  <StyledTableCell> {row.email}</StyledTableCell>
                  <StyledTableCell> {row.dateofbirth}</StyledTableCell>
                  {/* <StyledTableCell> {row.category}</StyledTableCell>
                                    <StyledTableCell> {row.subcategory}</StyledTableCell>
                                    <StyledTableCell> {row.specialization}</StyledTableCell> */}
                  <StyledTableCell> {row.experience}</StyledTableCell>
                  <StyledTableCell> {row.skill}</StyledTableCell>
                  <StyledTableCell> {row.applieddate}</StyledTableCell>
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
    </Box>
  );
}

export default UnassignedCandidates;
