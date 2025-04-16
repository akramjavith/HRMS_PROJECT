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
import { userStyle } from "../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import { handleApiError } from "../../../components/Errorhandling";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import LoadingButton from "@mui/lab/LoadingButton";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
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
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";
import UndoIcon from "@mui/icons-material/Undo";
import moment from "moment-timezone";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";

function InactiveCandidates() {
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
        rowDataTable?.map((item, index) => {
          return {
            SNO: index + 1,
            Status: item.considervalue,
            "Applicant Name": item.fullname,
            Gender: item.gender,
            "Contact No": item.mobile,
            Email: item.email,
            "Aadhar Number": item.adharnumber,
            "DOB ": item.dateofbirth,
            Education: item.qualification,
            Skill: item.skill,
            Experience: item.experience,
            "Applied Date/Time": item?.appliedat,
          };
        }),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        items?.map((item, index) => ({
          SNO: index + 1,
          Status: item.considervalue,
          "Applicant Name": item.fullname,
          Gender: item.gender,
          "Contact No": item.mobile,
          Email: item.email,
          "Aadhar Number": item.adharnumber,
          "DOB ": item.dateofbirth,
          Education: item.qualification,
          Skill: item.skill,
          Experience: `${item?.experience} ${
            item?.experienceestimation == undefined
              ? "Years"
              : item?.experienceestimation
          }`,
          "Applied Date/Time": item?.appliedat,
        })),
        fileName
      );
    }
    setIsFilterOpen(false);
  };

  //  PDF
  const columns = [
    { title: "Status", field: "considervalue" },
    { title: "Applicant Name", field: "fullname" },
    { title: "Gender", field: "gender" },
    { title: "Contact No", field: "mobile" },
    { title: "Email", field: "email" },
    { title: "Aadhar Number", field: "adharnumber" },
    { title: "DOB ", field: "dateofbirth" },
    { title: "Education", field: "qualification" },
    { title: "Skill", field: "skill" },
    { title: "Experience", field: "experience" },
    { title: "Applied Date/Time", field: "appliedat" },
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
        ? rowDataTable?.map((item, index) => {
            return {
              serialNumber: index + 1,
              considervalue: item.considervalue,
              fullname: item.fullname,
              gender: item.gender,
              mobile: item.mobile,
              email: item.email,
              adharnumber: item.adharnumber,
              dateofbirth: item.dateofbirth,
              qualification: item.qualification,
              skill: item.skill,
              experience: item.experience,
              appliedat: item?.appliedat,
            };
          })
        : items?.map((item, index) => ({
            serialNumber: index + 1,
            considervalue: item.considervalue,
            fullname: item.fullname,
            gender: item.gender,
            mobile: item.mobile,
            email: item.email,
            adharnumber: item.adharnumber,
            dateofbirth: item.dateofbirth,
            qualification: item.qualification,
            skill: item.skill,
            appliedat: item?.appliedat,
            experience: `${item?.experience} ${
              item?.experienceestimation == undefined
                ? "Years"
                : item?.experienceestimation
            }`,
          }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: "5" },
    });

    doc.save(`${roleName}-${tableName}.pdf`);
  };

  let ids = useParams().id;

  const [singleJobData, setSingleJobData] = useState({});
  const [roleName, setRoleName] = useState("");

  const [candidates, setCandidates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { isUserRoleAccess, isUserRoleCompare } = useContext(
    UserRoleAccessContext
  );
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const navigate = useNavigate();

  const { auth } = useContext(AuthContext);

  const [isBankdetail, setBankdetail] = useState(false);

  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, `${roleName}-${tableName}.png`);
        });
      });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
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
  const handleOpenModcheckbox = () => {
    setIsDeleteOpencheckbox(true);
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
  const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    "& .MuiDataGrid-virtualScroller": {
      overflowY: "hidden",
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      fontWeight: " bold !important ",
    },
    "& .custom-id-row": {
      backgroundColor: "#1976d22b !important",
    },

    "& .MuiDataGrid-row.Mui-selected": {
      "& .custom-ago-row, & .custom-in-row, & .custom-others-row": {
        backgroundColor: "unset !important", // Clear the background color for selected rows
      },
    },
    "&:hover": {
      "& .custom-ago-row:hover": {
        backgroundColor: "#ff00004a !important",
      },
      "& .custom-in-row:hover": {
        backgroundColor: "#ffff0061 !important",
      },
      "& .custom-others-row:hover": {
        backgroundColor: "#0080005e !important",
      },
    },
  }));

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    fullname: true,
    mobile: true,
    email: true,
    dateofbirth: true,
    qualification: true,
    skill: true,
    experience: true,
    status: true,
    prefix: true,
    gender: true,
    adharnumber: true,
    actions: true,
    checkbox: true,
    appliedat: true,
    removescreening: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  const [tableName, setTableName] = useState();

  const [overAllCount, setOverAllCount] = useState();
  const [inActiveCandidates, setInActiveCandidates] = useState([]);
  const [overAllObj, setOverAllObj] = useState({});
  const getJobRoleDatas = async () => {
    try {
      let res = await axios.get(`${SERVICE.JOBOPENING_SINGLE}/${ids}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleJobData(res?.data?.sjobopening);
      let response = await axios.post(`${SERVICE.CANDIDATES}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        jobopeningsid: ids,
      });
      setRoleName(res?.data?.sjobopening?.recruitmentname);

      // Initialize counts object
      let counts = {};

      // Iterate through relatedDatas and assign considerValue
      let considerValue = response?.data?.allcandidate?.map((item) => {
        if (item.candidatestatus !== undefined && item.candidatestatus !== "") {
          return {
            ...item,
            considerValue: item.candidatestatus,
            considerId: item?._id,
            considerName: "Outer",
            considerLastName:
              item?.screencandidate === "Screened" ? "Screened" : "Applied",
          };
        } else if (item.interviewrounds && item.interviewrounds.length == 1) {
          let status =
            item.interviewrounds[0].rounduserstatus !== undefined &&
            item.interviewrounds[0].rounduserstatus !== "";
          if (status) {
            const fieldToCheck = "rounduserstatus";
            const foundObject = item.interviewrounds.find(
              (obj) =>
                obj[fieldToCheck] !== undefined && obj[fieldToCheck] !== ""
            );
            return {
              ...item,
              considerValue: foundObject.rounduserstatus,
              considerId: foundObject?._id,
              considerName: "Inner",
              considerLastName: foundObject?.roundname,
            };
          }
        } else {
          let status = item.interviewrounds.some(
            (item1) =>
              item1.rounduserstatus !== undefined &&
              item1.rounduserstatus !== ""
          );
          if (status) {
            const fieldToCheck = "rounduserstatus";
            const foundObject = item.interviewrounds.find(
              (obj) =>
                obj[fieldToCheck] !== undefined && obj[fieldToCheck] !== ""
            );
            return {
              ...item,
              considerValue: foundObject.rounduserstatus,
              considerId: foundObject?._id,
              considerName: "Inner",
              considerLastName: foundObject?.roundname,
            };
          }
        }
      });

      // Count occurrences of each considerValue
      considerValue?.forEach((obj) => {
        const value = obj?.considerValue;
        counts[value] = (counts[value] || 0) + 1;
      });

      const filteredArray = considerValue?.filter((item) => item !== undefined);
      setInActiveCandidates(filteredArray);
      let firstNoRes = considerValue?.filter(
        (data) => data?.considerValue === "First No Response"
      );
      setCandidates(firstNoRes);
      setTableName("First No Response");
      setOverAllObj(counts);

      let sum = 0;
      for (const key in counts) {
        if (key !== "undefined") {
          sum += counts[key];
        }
      }

      setOverAllCount(sum);
      setBankdetail(true);
    } catch (err) {
      setBankdetail(true);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const getJobRoleDatasOnUpdate = async (currenttable) => {
    try {
      let res = await axios.get(`${SERVICE.JOBOPENING_SINGLE}/${ids}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleJobData(res?.data?.sjobopening);
      let response = await axios.post(`${SERVICE.CANDIDATES}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        jobopeningsid: ids,
      });
      setRoleName(res?.data?.sjobopening?.recruitmentname);

      // Initialize counts object
      let counts = {};

      // Iterate through relatedDatas and assign considerValue
      let considerValue = response?.data?.allcandidate?.map((item) => {
        if (item.candidatestatus !== undefined && item.candidatestatus !== "") {
          return {
            ...item,
            considerValue: item.candidatestatus,
            considerId: item?._id,
            considerName: "Outer",
            considerLastName:
              item?.screencandidate === "Screened" ? "Screened" : "Applied",
          };
        } else if (item.interviewrounds && item.interviewrounds.length == 1) {
          let status =
            item.interviewrounds[0].rounduserstatus !== undefined &&
            item.interviewrounds[0].rounduserstatus !== "";
          if (status) {
            const fieldToCheck = "rounduserstatus";
            const foundObject = item.interviewrounds.find(
              (obj) =>
                obj[fieldToCheck] !== undefined && obj[fieldToCheck] !== ""
            );
            return {
              ...item,
              considerValue: foundObject.rounduserstatus,
              considerId: foundObject?._id,
              considerName: "Inner",
              considerLastName: foundObject?.roundname,
            };
          }
        } else {
          let status = item.interviewrounds.some(
            (item1) =>
              item1.rounduserstatus !== undefined &&
              item1.rounduserstatus !== ""
          );
          if (status) {
            const fieldToCheck = "rounduserstatus";
            const foundObject = item.interviewrounds.find(
              (obj) =>
                obj[fieldToCheck] !== undefined && obj[fieldToCheck] !== ""
            );
            return {
              ...item,
              considerValue: foundObject.rounduserstatus,
              considerId: foundObject?._id,
              considerName: "Inner",
              considerLastName: foundObject?.roundname,
            };
          }
        }
      });

      // Count occurrences of each considerValue
      considerValue?.forEach((obj) => {
        const value = obj?.considerValue;
        counts[value] = (counts[value] || 0) + 1;
      });

      const filteredArray = considerValue?.filter((item) => item !== undefined);
      setInActiveCandidates(filteredArray);
      let firstNoRes = considerValue?.filter(
        (data) => data?.considerValue === currenttable
      );
      setCandidates(
        currenttable === "OverAllStatus" ? filteredArray : firstNoRes
      );
      setTableName(currenttable);
      setOverAllObj(counts);

      let sum = 0;
      for (const key in counts) {
        if (key !== "undefined") {
          sum += counts[key];
        }
      }

      setOverAllCount(sum);
    } catch (err) {
      setBankdetail(true);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const tableWiseFilter = async (tablename) => {
    try {
      if (tablename === "OverAllStatus") {
        setCandidates(inActiveCandidates);
      } else {
        let firstNoRes = inActiveCandidates?.filter(
          (data) => data?.considerValue === tablename
        );
        setCandidates(firstNoRes);
      }

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
  const fileName = `${roleName}-${tableName}`;
  // get particular columns for export excel

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${roleName}-${tableName}`,
    pageStyle: "print",
  });

  useEffect(() => {
    getJobRoleDatas();
  }, [ids]);

  //table entries ..,.
  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = candidates?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      considervalue: item.considerValue,

      qualification: item?.educationdetails
        ?.map(
          (t, i) =>
            `${i + 1 + ". "}` +
            `${t.categoryedu} - ${t.subcategoryedu} - ${t.specialization}`
        )
        .toString(),
      skill: item.skill?.join(","),
      appliedat: moment(item?.createdAt).format("DD-MM-YYYY hh:mm A"),
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

  const [btnSubmit, setBtnSubmit] = useState(false);
  const [rowIndex, setRowIndex] = useState();
  const [status, setStatus] = useState({});
  const handleAction = (value, rowId, sno) => {
    setStatus((prevStatus) => ({
      ...prevStatus,
      [rowId]: {
        ...prevStatus[rowId],
        inactivestatus: value,
        btnShow: true,
      },
    }));
    setRowIndex(sno);
  };

  const [considerIds, setConsiderId] = useState("");
  const [candiateIds, setCandidateId] = useState("");
  const [considerNames, setConsiderName] = useState("");
  const [considerLastNames, setConsiderLastName] = useState("");
  const handleUpdate = async (
    e,
    name,
    rounduserstatus,
    from,
    candid,
    prevoverallstatus
  ) => {
    setBtnSubmit(true);
    try {
      if (name === "Inner") {
        let response = await axios.put(
          `${SERVICE.UPDATE_INTERVIEWROUNDSTATUS}/${e}`,
          {
            rounduserstatus: String(rounduserstatus),
          }
        );
        let responsessss = await axios.put(
          `${SERVICE.CANDIDATES_SINGLE}/${candid}`,
          {
            overallstatus:
              from === "move"
                ? String(prevoverallstatus)
                : String(rounduserstatus),
          }
        );
      } else if (name === "Outer") {
        let responseas = await axios.put(`${SERVICE.CANDIDATES_SINGLE}/${e}`, {
          candidatestatus: String(rounduserstatus),
          overallstatus:
            from === "move"
              ? String(prevoverallstatus)
              : String(rounduserstatus),
        });
      }
      await getJobRoleDatasOnUpdate(tableName);
      setStatus({});
      setBtnSubmit(false);
      handleCloseModcheckbox();
      setShowAlert(
        <>
          {" "}
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "green" }}
          />{" "}
          {from === "update" ? (
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {" "}
              {"Updated Successfully👍"}
            </p>
          ) : (
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {" "}
              {"Moved Successfully👍"}
            </p>
          )}
        </>
      );
      handleClickOpenerr();
    } catch (err) {
      setBtnSubmit(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      headerName: "S.No",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.serialNumber,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0,
      width: 300,
      sortable: false,
      hide: !columnVisibility.status,
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
                  style={{ minWidth: 150, width: 200, overflow: "hidden" }}
                  value={
                    status[params.row.considerid]?.inactivestatus
                      ? status[params.row.considerid]?.inactivestatus
                      : params.row.considervalue
                  }
                  onChange={(e) => {
                    handleAction(
                      e.target.value,
                      params.row.considerid,
                      params.row.serialNumber
                    );
                  }}
                  inputProps={{ "aria-label": "Without label" }}
                >
                  {/* {statusData?.map((d) => (
                      <MenuItem key={d._id} value={d.value}>
                        {d.label}
                      </MenuItem>
                    ))} */}
                  <MenuItem value="First No Response">
                    First No Response
                  </MenuItem>
                  <MenuItem value="Second No Response">
                    Second No Response
                  </MenuItem>
                  <MenuItem value="No Response">No Response</MenuItem>
                  <MenuItem value="Not Interested">Not Interested</MenuItem>
                  <MenuItem value="Got Other Job">Got Other Job</MenuItem>
                  <MenuItem value="Already Joined">Already Joined</MenuItem>
                  <MenuItem value="Duplicate Candidate">
                    Duplicate Candidate
                  </MenuItem>
                  <MenuItem value="Profile Not Eligible">
                    Profile Not Eligible
                  </MenuItem>
                  {/* <MenuItem value="Others">Others</MenuItem> */}
                </Select>
              </FormControl>
            </Grid>
            <br />
            <br />
            {status[params.row.considerid]?.btnShow &&
            rowIndex === params.row.serialNumber ? (
              <>
                {" "}
                <LoadingButton
                  sx={{
                    ...userStyle.buttonedit,
                    marginLeft: "10px",
                  }}
                  variant="contained"
                  loading={btnSubmit}
                  style={{ minWidth: "0px" }}
                  onClick={(e) =>
                    handleUpdate(
                      params.row.considerid,
                      params.row.considername,
                      status[params.row.considerid]?.inactivestatus,
                      "update",
                      params.row.id,
                      params.row.considerlastname
                    )
                  }
                >
                  SAVE
                </LoadingButton>
              </>
            ) : (
              <></>
            )}
          </>
        </Grid>
      ),
    },

    {
      field: "prefix",
      headerName: "Courtesy Titles",
      flex: 0,
      width: 80,
      minHeight: "40px",
      hide: !columnVisibility.prefix,
    },

    {
      field: "fullname",
      headerName: "Applicant Name",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.fullname,
    },
    {
      field: "gender",
      headerName: "Gender",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.gender,
    },
    {
      field: "mobile",
      headerName: "Contact No",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.mobile,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.email,
    },
    {
      field: "adharnumber",
      headerName: "Aadhar Number",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.adharnumber,
    },
    {
      field: "dateofbirth",
      headerName: "DOB",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.dateofbirth,
    },
    {
      field: "qualification",
      headerName: "Education",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.qualification,
    },
    {
      field: "skill",
      headerName: "Skill",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.skill,
    },
    {
      field: "experience",
      headerName: "Experience",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.experience,
    },
    {
      field: "appliedat",
      headerName: "Applied Date/Time",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.appliedat,
    },
    {
      field: "removescreening",
      headerName: "Move to Candidate",
      flex: 0,
      width: 200,
      minHeight: "40px",
      hide: !columnVisibility.removescreening,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setConsiderId(params?.row?.considerid);
              setCandidateId(params?.row?.id);
              setConsiderName(params?.row?.considername);
              setConsiderLastName(params.row.considerlastname);
              handleOpenModcheckbox();
            }}
          >
            <UndoIcon />
          </Button>
        </Grid>
      ),
    },

    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 100,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,

      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          <Link
            to={`/recruitment/viewresume/${params.row.id}/inactivecandidates/${ids}`}
          >
            <Button sx={userStyle.buttonedit}>
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          </Link>
        </Grid>
      ),
    },
    // {
    //   field: "status",
    //   headerName: "Status",
    //   flex: 0,
    //   width: 180,
    //   minHeight: "40px",
    //   hide: !columnVisibility.status,
    // },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    const correctedArray = Array.isArray(item?.skill)
      ? item.skill.map((d) => (Array.isArray(d) ? d.join(",") : d))
      : [];
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      fullname: item.fullname,
      considervalue: item.considerValue,
      considerid: item.considerId,
      considername: item.considerName,
      considerlastname: item.considerLastName,
      mobile: item.mobile,
      email: item.email,
      dateofbirth: item.dateofbirth,
      qualification: item?.educationdetails
        ?.map(
          (t, i) =>
            `${i + 1 + ". "}` +
            `${t.categoryedu} - ${t.subcategoryedu} - ${t.specialization}`
        )
        .toString(),
      skill: correctedArray,
      experience: `${item?.experience} ${
        item?.experienceestimation == undefined
          ? "Years"
          : item?.experienceestimation
      }`,
      status: item.status,
      tablename: item?.tablename,
      candidatestatus: item?.candidatestatus,
      prefix: item?.prefix,
      gender: item?.gender,
      adharnumber: item?.adharnumber,
      interviewrounds: item?.interviewrounds,
      appliedat: item?.appliedat,
      company: singleJobData?.company,
      branch: singleJobData?.branch,
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
      <Headtitle title={"INACTIVE CANDIDATES"} />

      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Typography sx={userStyle.HeaderText}>InActive Candidates</Typography>
        </Grid>
        <Grid item xs={4}>
          <>
            <Link
              to={`/company/recuritment/${ids}`}
              style={{
                textDecoration: "none",
                color: "white",
                float: "right",
              }}
            >
              <Button variant="contained">Back</Button>
            </Link>
          </>
        </Grid>
      </Grid>
      <NotificationContainer />
      <br />
      {isUserRoleCompare?.includes("ljobopenings") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                <b>Job Role : {roleName} </b>
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                <b>InActive Status: {tableName} </b>
              </Typography>
            </Grid>
            <br />
            <br />
            <Grid item md={12} xs={12} sm={12}>
              <Grid container spacing={2} sx={{ justifyContent: "center" }}>
                <Grid item md={1.33} xs={12} sm={4}>
                  <Button
                    onClick={() => {
                      tableWiseFilter("First No Response");
                      setTableName("First No Response");
                      setRowIndex();
                      setStatus({});
                    }}
                    sx={{
                      display: "block",
                      background: "#f4f4f4",
                      height: "75px",
                      border: "1px solid lightgrey",
                      width: "100%",
                      fontWeight: "bold",
                      fontSize: "11px",
                    }}
                  >
                    <Typography>
                      {overAllObj["First No Response"] == undefined
                        ? 0
                        : overAllObj["First No Response"]}
                    </Typography>
                    First No Response
                  </Button>
                </Grid>
                <Grid item md={1.33} xs={12} sm={4}>
                  <Button
                    onClick={() => {
                      tableWiseFilter("Second No Response");
                      setTableName("Second No Response");
                      setRowIndex();
                      setStatus({});
                    }}
                    sx={{
                      display: "block",
                      background: "#f4f4f4",
                      height: "75px",
                      border: "1px solid lightgrey",
                      width: "100%",
                      fontWeight: "bold",
                      fontSize: "11px",
                    }}
                  >
                    <Typography>
                      {overAllObj["Second No Response"] == undefined
                        ? 0
                        : overAllObj["Second No Response"]}
                    </Typography>
                    Second No Response
                  </Button>
                </Grid>
                <Grid item md={1.33} xs={12} sm={4}>
                  <Button
                    onClick={() => {
                      tableWiseFilter("No Response");
                      setTableName("No Response");
                      setRowIndex();
                      setStatus({});
                    }}
                    sx={{
                      display: "block",
                      background: "#f4f4f4",
                      height: "75px",
                      border: "1px solid lightgrey",
                      width: "100%",
                      fontWeight: "bold",
                      fontSize: "11px",
                    }}
                  >
                    <Typography>
                      {overAllObj["No Response"] == undefined
                        ? 0
                        : overAllObj["No Response"]}
                    </Typography>
                    No Response
                  </Button>
                </Grid>
                <Grid item md={1.33} xs={12} sm={4}>
                  <Button
                    onClick={() => {
                      tableWiseFilter("Not Interested");
                      setTableName("Not Interested");
                      setRowIndex();
                      setStatus({});
                    }}
                    sx={{
                      display: "block",
                      background: "#f4f4f4",
                      height: "75px",
                      border: "1px solid lightgrey",
                      width: "100%",
                      fontWeight: "bold",
                      fontSize: "11px",
                    }}
                  >
                    <Typography>
                      {overAllObj["Not Interested"] == undefined
                        ? 0
                        : overAllObj["Not Interested"]}
                    </Typography>
                    Not Interested
                  </Button>
                </Grid>
                <Grid item md={1.33} xs={12} sm={4}>
                  <Button
                    onClick={() => {
                      tableWiseFilter("Got Other Job");
                      setTableName("Got Other Job");
                      setRowIndex();
                      setStatus({});
                    }}
                    sx={{
                      display: "block",
                      background: "#f4f4f4",
                      height: "75px",
                      border: "1px solid lightgrey",
                      width: "100%",
                      fontWeight: "bold",
                      fontSize: "11px",
                    }}
                  >
                    <Typography>
                      {overAllObj["Got Other Job"] == undefined
                        ? 0
                        : overAllObj["Got Other Job"]}
                    </Typography>
                    Got Other Job
                  </Button>
                </Grid>
                <Grid item md={1.33} xs={12} sm={4}>
                  <Button
                    onClick={() => {
                      tableWiseFilter("Already Joined");
                      setTableName("Already Joined");
                      setRowIndex();
                      setStatus({});
                    }}
                    sx={{
                      display: "block",
                      background: "#f4f4f4",
                      height: "75px",
                      border: "1px solid lightgrey",
                      width: "100%",
                      fontWeight: "bold",
                      fontSize: "11px",
                    }}
                  >
                    <Typography>
                      {overAllObj["Already Joined"] == undefined
                        ? 0
                        : overAllObj["Already Joined"]}
                    </Typography>
                    Already Joined
                  </Button>
                </Grid>
                <Grid item md={1.33} xs={12} sm={4}>
                  <Button
                    onClick={() => {
                      tableWiseFilter("Duplicate Candidate");
                      setTableName("Duplicate Candidate");
                      setRowIndex();
                      setStatus({});
                    }}
                    sx={{
                      display: "block",
                      background: "#f4f4f4",
                      height: "75px",
                      border: "1px solid lightgrey",
                      width: "100%",
                      fontWeight: "bold",
                      fontSize: "11px",
                    }}
                  >
                    <Typography>
                      {overAllObj["Duplicate Candidate"] == undefined
                        ? 0
                        : overAllObj["Duplicate Candidate"]}
                    </Typography>
                    Duplicate Candidate
                  </Button>
                </Grid>
                <Grid item md={1.33} xs={12} sm={4}>
                  <Button
                    onClick={() => {
                      tableWiseFilter("Profile Not Eligible");
                      setTableName("Profile Not Eligible");
                      setRowIndex();
                      setStatus({});
                    }}
                    sx={{
                      display: "block",
                      background: "#f4f4f4",
                      height: "75px",
                      border: "1px solid lightgrey",
                      width: "100%",
                      fontWeight: "bold",
                      fontSize: "11px",
                    }}
                  >
                    <Typography>
                      {" "}
                      {overAllObj["Profile Not Eligible"] == undefined
                        ? 0
                        : overAllObj["Profile Not Eligible"]}
                    </Typography>
                    Profile Not Eligible
                  </Button>
                </Grid>
                <Grid item md={1.33} xs={12} sm={4}>
                  <Button
                    onClick={() => {
                      tableWiseFilter("OverAllStatus");
                      setTableName("OverAllStatus");
                      setRowIndex();
                      setStatus({});
                    }}
                    sx={{
                      display: "block",
                      background: "#f4f4f4",
                      height: "75px",
                      border: "1px solid lightgrey",
                      width: "100%",
                      fontWeight: "bold",
                      fontSize: "11px",
                    }}
                  >
                    <Typography>{overAllCount}</Typography>
                    Overall Status
                  </Button>
                </Grid>
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
                  {isUserRoleCompare?.includes("exceljobopenings") && (
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
                  {isUserRoleCompare?.includes("csvjobopenings") && (
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
                  {isUserRoleCompare?.includes("printjobopenings") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfjobopenings") && (
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
                  {isUserRoleCompare?.includes("imagejobopenings") && (
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
              onClick={(e) =>
                handleUpdate(
                  considerIds,
                  considerNames,
                  "",
                  "move",
                  candiateIds,
                  considerLastNames
                )
              }
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
          <TableHead sx={{ fontWeight: "600" }}>
            <StyledTableRow>
              <StyledTableCell>S.No</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Applicant Name </StyledTableCell>
              <StyledTableCell>Gender </StyledTableCell>
              <StyledTableCell>Contact No </StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Aadhar Number</StyledTableCell>
              <StyledTableCell>DOB </StyledTableCell>
              <StyledTableCell>Education</StyledTableCell>
              <StyledTableCell>Skill</StyledTableCell>
              <StyledTableCell>Experience</StyledTableCell>
              <StyledTableCell>Applied Date/Time</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {rowDataTable &&
              rowDataTable.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{row.considervalue} </StyledTableCell>
                  <StyledTableCell>{row.fullname} </StyledTableCell>
                  <StyledTableCell>{row.gender} </StyledTableCell>
                  <StyledTableCell>{row.mobile}</StyledTableCell>
                  <StyledTableCell>{row.email}</StyledTableCell>
                  <StyledTableCell>{row.adharnumber}</StyledTableCell>
                  <StyledTableCell>{row.dateofbirth} </StyledTableCell>
                  <StyledTableCell>{row.qualification} </StyledTableCell>
                  <StyledTableCell>{row.skill}</StyledTableCell>
                  <StyledTableCell>{row.experience}</StyledTableCell>
                  <StyledTableCell>{row.appliedat}</StyledTableCell>
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

export default InactiveCandidates;