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
  Checkbox,
  IconButton,
  TextField,
  List,
  ListItem,
  ListItemText,
  Switch,
  Popover,
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { handleApiError } from "../../../components/Errorhandling";
import StyledDataGrid from "../../../components/TableStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import moment from "moment-timezone";
import {
  UserRoleAccessContext,
  AuthContext,
} from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import { Link } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import Pagination from "../../../components/Pagination";
import PageHeading from "../../../components/PageHeading";
function AllListVisitors() {
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  useEffect(() => {
    exportallData();
  }, [isFilterOpen, isPdfFilterOpen]);

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
        rowDataTable.map((t, index) => ({
          Sno: index + 1,
          Company: t.company,
          Branch: t.branch,
          Unit: t.unit,
          Date: t.date,
          "Visitor's ID": t.visitorid,
          // prefix:t.prefix,
          "Visitor Name": t.visitorname,
          "Visitor Type": t.visitortype,
          "Visitor Mode": t.visitormode,
          "Visitor Purpose": t.visitorpurpose,
          "Visitor Contact No": t.visitorcontactnumber,
          "IN Time": t.intime,
          "OUT Time": t.outtime,
        })),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        candidateExport?.map((t, index) => ({
          Sno: index + 1,
          Company: t.company,
          Branch: t.branch,
          Unit: t.unit,
          Date: t.date,
          "Visitor's ID": t.visitorid,
          // prefix:t.prefix,
          "Visitor Name": t.visitorname,
          "Visitor Type": t.visitortype,
          "Visitor Mode": t.visitormode,
          "Visitor Purpose": t.visitorpurpose,
          "Visitor Contact No": t.visitorcontactnumber,
          "IN Time": t.intime,
          "OUT Time": t.outtime,
        })),
        fileName
      );
    }

    setIsFilterOpen(false);
  };

  // pdf.....
  const columns = [
    { title: "Company", field: "company" },
    { title: "Branch", field: "branch" },
    { title: "Unit", field: "unit" },
    { title: "Date", field: "date" },
    { title: "Visitor's ID", field: "visitorid" },
    { title: "Visitor Name", field: "visitorname" },
    // { title: "Prefix", field: "prefix" },
    { title: "Visitor Type", field: "visitortype" },
    { title: "Visitor Mode", field: "visitormode" },
    { title: "Visitor Purpose", field: "visitorpurpose" },
    { title: "Visitor Contact No", field: "visitorcontactnumber" },
    { title: "IN Time", field: "intime" },
    { title: "OUT Time", field: "outtime" },
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
        ? rowDataTable.map((t, index) => {
          return {
            serialNumber: index + 1,
            company: t.company,
            branch: t.branch,
            unit: t.unit,
            date: t.date,
            visitorid: t.visitorid,
            // prefix:t.prefix,
            visitorname: t.visitorname,
            visitortype: t.visitortype,
            visitormode: t.visitormode,
            visitorpurpose: t.visitorpurpose,
            visitorcontactnumber: t.visitorcontactnumber,
            intime: t.intime,
            outtime: t.outtime,
          };
        })
        : candidateExport?.map((t, index) => ({
          serialNumber: index + 1,
          company: t.company,
          branch: t.branch,
          unit: t.unit,
          date: t.date,
          visitorid: t.visitorid,
          // prefix:t.prefix,
          visitorname: t.visitorname,
          visitortype: t.visitortype,
          visitormode: t.visitormode,
          visitorpurpose: t.visitorpurpose,
          visitorcontactnumber: t.visitorcontactnumber,
          intime: t.intime,
          outtime: t.outtime,
        }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: "5" },
    });

    doc.save("Visitors.pdf");
  };

  const [candidateExport, setCandidateExport] = useState([]);
  const exportallData = async () => {
    setPageName(!pageName);
    try {
      let res_project = await axios.post(
        SERVICE.ALL_VISITORS,
        {
          assignbranch: accessbranch,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setCandidateExport(
        res_project?.data?.visitors?.filter(
          (data) => data?.interactorstatus === "visitor"
        )
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [vendoredit, setVendoredit] = useState({});
  const [vendormaster, setVendormaster] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { isUserRoleCompare, pageName, setPageName, isAssignBranch } =
    useContext(UserRoleAccessContext);
  const accessbranch = isAssignBranch?.map((data) => ({
    branch: data.branch,
    company: data.company,
    unit: data.unit,
  }));

  const { auth } = useContext(AuthContext);
  const [vendorCheck, setVendorcheck] = useState(false);
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteVendor, setDeletevendor] = useState("");
  const [openInfo, setOpeninfo] = useState(false);
  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    actions: true,
    checkbox: true,
    company: true,
    branch: true,
    unit: true,
    date: true,
    serialNumber: true,
    visitorid: true,

    visitorname: true,
    visitortype: true,
    visitormode: true,
    visitorpurpose: true,
    visitorcontactnumber: true,
    intime: true,
    outtime: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  const [isErrorOpendupe, setIsErrorOpendupe] = useState(false);
  const [showAlertdupe, setShowAlertdupe] = useState();
  const handleClickOpenerrdupe = () => {
    setIsErrorOpendupe(true);
  };
  const handleCloseerrdupe = () => {
    setIsErrorOpendupe(false);
  };


  const [visitor, setVisitor] = useState()

  const [duplicateValues, setDuplicateValues] = useState([]);

  const checkDuplicateFunctionLinkedCandidate = async (e) => {
    setVisitor(e)
    try {
      // Toggle pageName state
      setPageName(!pageName);

      // Fetch all candidates
      const res = await axios.get(SERVICE.CANDIDATESALLBYRESTRICTION);
      const allcandidates = res?.data?.candidates || [];

      let duplicates = []

      let foundDataNameNew = allcandidates.find(
        (data) => data.firstname?.toLowerCase() + "" + data.lastname?.toLowerCase() === String(e.visitorname?.replace(/\s+/g, '')?.toLowerCase())
      );
      if (foundDataNameNew) {
        duplicates.push({
          field: "Name",
          value:
            foundDataNameNew.fullname +
            `(Role: ${foundDataNameNew.role}, Applied Date: ${moment(
              foundDataNameNew.createdAt
            ).format("DD-MM-YYYY")})`,
          id: foundDataNameNew?._id,
          _idv: e?.id
        });
      }

      let foundDataNew = allcandidates.find((data) =>
        e.visitoremail !== '' &&
        data.email !== '' &&
        data.email.toLowerCase() === e.visitoremail.toLowerCase()
      );

      if (foundDataNew) {
        duplicates.push({
          field: "Email",
          value: e.visitoremail,
          id: foundDataNew?._id,
          _idv: e?.id
        });
      }

      let foundDataPhone = allcandidates.find((data) =>
        e.mobile !== '' &&
        data.visitorcontactnumber !== '' &&
        Number(data.mobile) === Number(e.visitorcontactnumber)
      );

      if (foundDataPhone) {
        duplicates.push({
          field: "Phone",
          value: e.visitorcontactnumber,
          id: foundDataPhone?._id,
          _idv: e?.id
        });
      }


      setDuplicateValues(duplicates);

      // Construct alert content
      const alertContent = (
        <>
          <Typography
            style={{
              fontSize: "20px",
              fontWeight: 900,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            Duplicate Entry
            <Button onClick={handleCloseerrdupe}>
              <CloseIcon color="black" />
            </Button>
          </Typography>
          <div>
            <Table style={{ width: "100%" }}>
              <TableHead>
                <StyledTableCell sx={{ padding: "10px 20px !important" }}>SNO</StyledTableCell>
                <StyledTableCell sx={{ padding: "10px 20px !important" }}>Candidate Name</StyledTableCell>
                <StyledTableCell sx={{ padding: "10px 20px !important" }}>Field</StyledTableCell>
                <StyledTableCell sx={{ padding: "10px 20px !important" }}>View</StyledTableCell>
              </TableHead>
              <TableBody>
                {duplicates.length > 0 ? (
                  duplicates.map((item, i) => (
                    <StyledTableRow key={i}>
                      <StyledTableCell sx={{ padding: "10px 20px !important" }}>{i + 1}.</StyledTableCell>
                      <StyledTableCell sx={{ padding: "10px 20px !important" }}>{item.value}</StyledTableCell>
                      <StyledTableCell sx={{ padding: "10px 20px !important" }}>{item.field}</StyledTableCell>
                      <StyledTableCell sx={{ padding: "10px 20px !important" }}>
                        <Button
                          sx={userStyle.buttonedit}
                          onClick={() => window.open(`/resumemanagement/view/${item.id}`, "_blank")}
                        >
                          <VisibilityOutlinedIcon style={{ fontSize: "large" }} />
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <StyledTableRow>
                    <StyledTableCell sx={{ padding: "10px 20px !important" }}>No Linked Data Found</StyledTableCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </>
      );

      setShowAlertdupe(alertContent);
      handleClickOpenerrdupe();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };


  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  const handleClickOpenalert = () => {
    if (selectedRows?.length === 0) {
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

  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  };

  useEffect(() => {
    fetchVendor();
    visitorviseDisabledAddResume();
  }, []);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);
  useEffect(() => {
    addSerialNumber();
  }, [vendormaster]);
  const gridRef = useRef(null);
  const searchOverAllTerms = searchQuery.toLowerCase().split(" ");
  const filteredDatas = vendormaster?.filter((item) => {
    return searchOverAllTerms.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
  });
  const [allCandidate, setAllCandidate] = useState([])



  let rowDataTable = filteredDatas.map((item, index) => {
    const IsAvaile = allCandidate?.some(
      (data) =>
        data.firstname?.toLowerCase() + data.lastname?.toLowerCase() === String(item.visitorname?.replace(/\s+/g, '')?.toLowerCase())
    );

    const IsEmail = allCandidate?.some(
      (data) => data.email?.toLowerCase() === String(item.email?.toLowerCase())
    );

    return {
      id: item._id,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      date: moment(item.date).format("DD-MM-YYYY"),
      visitorid: item.visitorid,
      prefix: item.prefix,
      visitorname: item.visitorname,
      visitoremail: item.visitoremail,
      visitortype: item?.followuparray[item?.followuparray?.length - 1]?.visitortype,
      visitormode: item?.followuparray[item?.followuparray?.length - 1]?.visitormode,
      visitorpurpose: item.followuparray[item?.followuparray?.length - 1]?.visitorpurpose,
      visitorcontactnumber: item.visitorcontactnumber,
      intime: item?.followuparray[item?.followuparray?.length - 1]?.intime,
      outtime: item?.followuparray[item?.followuparray?.length - 1]?.outtime,
      interactorstatus: item.interactorstatus,
      isBtnEnable: IsAvaile || IsEmail,
    };
  });


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
            if (rowDataTable?.length === 0) {
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
            setSelectAllChecked(
              updatedSelectedRows?.length === filteredDatas?.length
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
      width: 80,
      minHeight: "40px",
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.unit,
      headerClassName: "bold-header",
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.date,
      headerClassName: "bold-header",
    },
    {
      field: "visitorid",
      headerName: "Visitor ID",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.visitorid,
      headerClassName: "bold-header",
    },
    {
      field: "visitorname",
      headerName: "Visitor Name",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.visitorname,
      headerClassName: "bold-header",
    },
    // {
    //   field: "prefix",
    //   headerName: "Prefix",
    //   flex: 0,
    //   width: 150,
    //   minHeight: "40px",
    //   hide: !columnVisibility.prefix,
    //   headerClassName: "bold-header",
    // },
    {
      field: "visitortype",
      headerName: "Visitor Type",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.visitortype,
      headerClassName: "bold-header",
    },
    {
      field: "visitormode",
      headerName: "Visitor Mode",
      flex: 0,
      width: 130,
      minHeight: "40px",
      hide: !columnVisibility.visitormode,
      headerClassName: "bold-header",
    },
    {
      field: "visitorpurpose",
      headerName: "Visitor Purpose",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.visitorpurpose,
      headerClassName: "bold-header",
    },
    {
      field: "visitorcontactnumber",
      headerName: "Visitor Contact Number",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.visitorcontactnumber,
      headerClassName: "bold-header",
    },
    {
      field: "intime",
      headerName: "IN Time",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.intime,
      headerClassName: "bold-header",
    },
    {
      field: "outtime",
      headerName: "OUT Time",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.outtime,
      headerClassName: "bold-header",
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 590,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {params.row.visitortype?.toLowerCase()?.includes("interview") && (
            <>
              {isUserRoleCompare?.includes("eallvisitors") &&
                (params.row.interactorstatus === "addresume" ? (
                  <Link
                    style={{
                      textDecoration: "none",
                      color: "green",
                      minWidth: "0px",
                    }}
                  >
                    <Button color="success">Resume Added</Button>
                  </Link>
                ) : (
                  <Link
                    to={params.row?.isBtnEnable ? '#' : `/recruitment/addresume/${params.row.id}`}
                    style={{
                      textDecoration: "none",
                      color: params.row?.isBtnEnable ? "#fff" : "#aaa", // change color when disabled
                      pointerEvents: params.row?.isBtnEnable ? "none" : "auto"
                    }}
                  >
                    <Button
                      variant="contained"
                      style={{
                        fontWeight: "bold",
                        cursor: params.row?.isBtnEnable ? "not-allowed" : "pointer"
                      }}
                      disabled={params.row?.isBtnEnable}
                    >
                      Add Resume
                    </Button>
                  </Link>

                ))}
            </>
          )}
          {isUserRoleCompare?.includes("eallvisitors") &&
            <Link
              style={{
                textDecoration: "none",
                color: "#fff",
                minWidth: "0px",
                padding: "0 3px",
              }}

            >
              <Button onClick={() => {
                checkDuplicateFunctionLinkedCandidate(params.row)
              }} variant="contained" style={{ fontWeight: "50px" }} disabled={params.row.interactorstatus === "addresume"}>Linked Datas</Button>
            </Link>
          }
          {isUserRoleCompare?.includes("eallvisitors") && (
            <Link
              to={`/interactor/master/editvisitors/${params.row.id}/allvisitor`}
              style={{ textDecoration: "none", color: "#fff", minWidth: "0px" }}
            >
              <Button sx={userStyle.buttonedit} style={{ minWidth: "0px" }}>
                <EditOutlinedIcon style={{ fontSize: "large" }} />
              </Button>
            </Link>
          )}
          {isUserRoleCompare?.includes("dallvisitors") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vallvisitors") && (
            <Link
              to={`/interactor/master/viewvisitors/${params.row.id}/allvisitor`}
              style={{ textDecoration: "none", color: "#fff", minWidth: "0px" }}
            >
              <Button sx={userStyle.buttonedit} style={{ minWidth: "0px" }}>
                <VisibilityOutlinedIcon style={{ fontSize: "large" }} />
              </Button>
            </Link>
          )}
          {isUserRoleCompare?.includes("iallvisitors") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpeninfo();
                getinfoCode(params.row.id);
              }}
            >
              {" "}
              <InfoOutlinedIcon style={{ fontsize: "large" }} />{" "}
            </Button>
          )}
          {isUserRoleCompare?.includes("vallvisitors") && (
            <Link
              to={`/interactor/master/followupvisitor/${params.row.id}/allvisitor`}
              style={{ textDecoration: "none", color: "#fff", minWidth: "0px" }}
            >
              <Button sx={userStyle.buttonedit} style={{ minWidth: "0px" }}>
                <AddCircleOutlineIcon style={{ fontSize: "large" }} />
              </Button>
            </Link>
          )}
        </Grid>
      ),
    },
  ];

  // Manage Columns
  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
    setSearchQueryManage("");
  };
  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };
  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  // Function to filter columns based on search query
  const filteredColumns = columnDataTable.filter((column) =>
    column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
  );
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
        {" "}
        <CloseIcon />{" "}
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
              Show All{" "}
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
                  newColumnVisibility[column.field] = false;
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
  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
    checkbox: selectedRows.includes(row.id),
  }));
  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );

  // Error Popup model
  const handleClickOpenerr = () => {
    setVendorcheck(false);
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };
  // Show All Columns functionality
  const handleShowAllColumns = () => {
    const updatedVisibility = { ...columnVisibility };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibility(updatedVisibility);
  };
  //Delete model
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };
  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  const rowData = async (id) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_VISITORS}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeletevendor(res?.data?.svisitors);
      handleClickOpen();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };


  const visitorviseDisabledAddResume = async () => {
    try {
      let res = await axios.get(SERVICE.VISITORCANDIDATESALL);

      setAllCandidate(res?.data?.candidates);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // Alert delete popup
  let Vendorsid = deleteVendor?._id;
  const delVendor = async (e) => {
    setPageName(!pageName);
    try {
      if (Vendorsid) {
        await axios.delete(`${SERVICE.SINGLE_VISITORS}/${e}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        await fetchVendor();
        handleCloseMod();
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
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const delVendorcheckbox = async () => {
    setPageName(!pageName);
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.SINGLE_VISITORS}/${item}`, {
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

      await fetchVendor();
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

  // info model
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_VISITORS}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setVendoredit(res?.data?.svisitors);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //Project updateby edit page...
  let updateby = vendoredit?.updatedby;
  let addedby = vendoredit?.addedby;



  //get all  vendordetails.
  // const fetchVendor = async () => {
  //   setVendorcheck(true);
  //   setPageName(!pageName);
  //   try {
  //     let res = await axios.post(SERVICE.SKIPPEDALL_VISITORS, {
  //       headers: {
  //         Authorization: `Bearer ${auth.APIToken}`,
  //       },
  //       page: Number(page),
  //       pageSize: Number(pageSize),
  //       assignbranch: accessbranch,
  //     });

  //     const ans = res?.data?.result?.length > 0 ? res?.data?.result : [];
  //     const itemsWithSerialNumber = ans?.map((item, index) => ({
  //       ...item,
  //       serialNumber: (page - 1) * pageSize + index + 1,
  //     }));
  //     setVendormaster(itemsWithSerialNumber);
  //     setItems(itemsWithSerialNumber);
  //     setTotalProjects(ans?.length > 0 ? res?.data?.totalProjects : 0);
  //     setTotalPages(ans?.length > 0 ? res?.data?.totalPages : 0);
  //     setPageSize((data) => {
  //       return ans?.length > 0 ? data : 10;
  //     });
  //     setPage((data) => {
  //       return ans?.length > 0 ? data : 1;
  //     });

  //     setVendorcheck(false);
  //   } catch (err) {
  //     setVendorcheck(false);
  //     handleApiError(err, setShowAlert, handleClickOpenerr);
  //   }
  // };

  const fetchVendor = async () => {
    setVendorcheck(true);
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.VISITOR_DATA, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

      });


      setVendormaster(res.data.visitors);


      setVendorcheck(false);
    } catch (err) {
      setVendorcheck(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Visitors.png");
        });
      });
    }
  };
  // Excel
  const fileName = "Visitors";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Visitors",
    pageStyle: "print",
  });
  const addSerialNumber = () => {
    const itemsWithSerialNumber = vendormaster?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };
  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setPage(1);
  };
  //datatable....
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    // setPage(1);
  };
  return (
    <Box>
      <Headtitle title={"LIST VISITORS"} />
      <PageHeading
        title="Manage All Visitors"
        modulename="Interactors"
        submodulename="Visitor"
        mainpagename="All Visitors"
        subpagename=""
        subsubpagename=""
      />
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lallvisitors") && (
        <>
          <Box sx={userStyle.container}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.SubHeaderText}>
                  Visitors List
                </Typography>
              </Grid>
              <Grid item xs={4}>
                {isUserRoleCompare?.includes("aallvisitors") && (
                  <>
                    <Link
                      to="/interactor/master/addvisitors"
                      style={{
                        textDecoration: "none",
                        color: "white",
                        float: "right",
                      }}
                    >
                      <Button variant="contained">ADD</Button>
                    </Link>
                  </>
                )}
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2} style={userStyle.dataTablestyle}>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <label>Show entries:</label>
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
                    {/* <MenuItem value={vendormaster?.length}>All</MenuItem> */}
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
                  {isUserRoleCompare?.includes("excelallvisitors") && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          // fetchProductionClientRateArray();
                          setFormat("xl");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileExcel />
                        &ensp;Export to Excel&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvallvisitors") && (
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
                  {isUserRoleCompare?.includes("printallvisitors") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfallvisitors") && (
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
                  {isUserRoleCompare?.includes("imageallvisitors") && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={handleCaptureImage}
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
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
              Manage Columns
            </Button>{" "}
            &ensp;
            {isUserRoleCompare?.includes("bdallvisitors") && (
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
            <Box style={{ width: "100%", overflowY: "hidden" }}>
              {vendorCheck ? (
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
                <StyledDataGrid
                  ref={gridRef}
                  rows={rowsWithCheckboxes}
                  columns={columnDataTable.filter(
                    (column) => columnVisibility[column.field]
                  )}
                  autoHeight={true}
                  hideFooter
                  density="compact"
                  getRowClassName={getRowClassName}
                  disableRowSelectionOnClick
                  onSelectionModelChange={handleSelectionChange}
                  selectionModel={selectedRows}
                />
              )}
            </Box>{" "}
            <br />
            <>
              <Box>
                <Pagination
                  page={page}
                  pageSize={pageSize}
                  totalPages={searchQuery !== "" ? 1 : totalPages}
                  onPageChange={handlePageChange}
                  pageItemLength={filteredDatas?.length}
                  totalProjects={
                    searchQuery !== "" ? filteredDatas?.length : totalProjects
                  }
                />
              </Box>
            </>
          </Box>
        </>
      )}
      {/* ****** Table End ****** */}
      {/* Delete ALERT DIALOG */}
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
            onClick={(e) => delVendor(Vendorsid)}
          >
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>
      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table
          aria-label="customized table"
          sx={{ minWidth: 100 }}
          id="usertable"
          ref={componentRef}
        >
          <TableHead>
            <TableRow>
              <TableCell> SI.No</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Visitor's ID</TableCell>
              <TableCell>Visitor Name</TableCell>
              {/* <TableCell>Visitor Type</TableCell> */}
              <TableCell>Visitor Mode</TableCell>
              <TableCell>Visitor Purpose</TableCell>
              <TableCell>Visitor Contact No.</TableCell>
              <TableCell>IN Time</TableCell>
              <TableCell>OUT Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody align="left">
            {rowDataTable &&
              rowDataTable.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.company}</TableCell>
                  <TableCell>{row.branch}</TableCell>
                  <TableCell>{row.unit}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.visitorid}</TableCell>
                  <TableCell>{row.visitorname}</TableCell>
                  {/* <TableCell>{row.visitortype}</TableCell> */}
                  <TableCell>{row.visitormode}</TableCell>
                  <TableCell>{row.visitorpurpose}</TableCell>
                  <TableCell>{row.visitorcontactnumber}</TableCell>
                  <TableCell>{row.intime}</TableCell>
                  <TableCell>{row.outtime}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* this is info view details */}
      <Dialog
        open={openInfo}
        onClose={handleCloseinfo}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>Visitor Info</Typography>
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
                        {" "}
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
      {/* Manage Column */}
      <Popover
        id={id}
        open={isManageColumnsOpen}
        anchorEl={anchorEl}
        onClose={handleCloseManageColumns}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        {" "}
        {manageColumnsContent}{" "}
      </Popover>
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
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <br />
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
              onClick={(e) => delVendorcheckbox(e)}
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

      <Box>
        <Dialog
          open={isErrorOpendupe}
          onClose={handleCloseerrdupe}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="sm"
          fullWidth={true}
        >
          <DialogContent sx={{ textAlign: "center", alignItems: "center" }}>
            <Typography variant="h6">{showAlertdupe}</Typography>
          </DialogContent>
          <DialogActions>
            <Link
              to={!duplicateValues?.length > 0 ? '#' : `/recruitment/addresume/${visitor?.id}`}
              style={{
                textDecoration: "none",
                color: !duplicateValues?.length > 0 ? "#fff" : "#aaa", // change color when disabled
                pointerEvents: !duplicateValues?.length > 0 ? "none" : "auto"
              }}
            >
              <Button
                variant="contained"
                style={{
                  fontWeight: "bold",
                  cursor: !duplicateValues?.length > 0 ? "not-allowed" : "pointer"
                }}
                disabled={!duplicateValues?.length > 0}
              >
                Need To Add
              </Button>
            </Link>
            {/* <Button
              variant="contained"
              color="primary"
              onClick={() => {
                handleAddCandidate(duplicateValues)
                handleCloseerrdupe()
              }}
            >
              Need To Add
            </Button>*/}
            <Button
              variant="contained"
              color="primary"
              onClick={handleCloseerrdupe}
              style={{
                marginLeft: "10px",
              }}
            >
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
export default AllListVisitors;
