import CloseIcon from "@mui/icons-material/Close";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  Box,
  Button,
  Checkbox,
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
  Dialog,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import moment from "moment";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../../components/Errorhandling";
import Headtitle from "../../../components/Headtitle";
import StyledDataGrid from "../../../components/TableStyle";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext.js";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice.js";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Restore as RestoreIcon,
  Undo as UndoIcon,
  Replay as ResetIcon,
  RotateRight as RetestIcon,
} from "@mui/icons-material";

import AlertDialog from "../../../components/Alert";
import ExportData from "../../../components/ExportData";
import MessageAlert from "../../../components/MessageAlert";

function RejectedCandidates() {
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

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const handleClickOpenPopup = () => {
    setOpenPopup(true);
  };

  let exportColumnNames = [
    "Round Name",
    "Applicant Name",
    "Gender",
    "Contact No",
    "Email",
    "Aadhar Number",
    "DOB",
    "Education",
    "Skill",
    "Experience",
  ];
  let exportRowValues = [
    "roundname",
    "fullname",
    "gender",
    "mobile",
    "email",
    "adharnumber",
    "dateofbirth",
    "qualification",
    "skill",
    "experience",
  ];

  const navigate = useNavigate();
  let ids = useParams().id;

  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");

  const [teamsArray, setTeamsArray] = useState([]);
  const { isUserRoleCompare } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [loader, setLoader] = useState(false);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
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
    scheduleinterview: true,
    prefix: true,
    gender: true,
    removescreening: false,
    removecandidate: false,
    adharnumber: true,
    roundname: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  //useEffect
  useEffect(() => {
    addSerialNumber();
  }, [teamsArray]);

  useEffect(() => {
    fetchCandidates();
  }, [ids]);
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

  //Delete model

  // page refersh reload code
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

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };
  const [singleJobData, setSingleJobData] = useState({});

  //get all Asset Variant name.
  const fetchCandidates = async () => {
    try {
      setLoader(true);

      const [res, response] = await Promise.all([
        axios.get(`${SERVICE.JOBOPENING_SINGLE}/${ids}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.get(
          `${SERVICE.REJECTED_CANDIDATES}/?jobopeningsid=${ids}`,

          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          }
        ),
      ]);

      setSingleJobData(res?.data?.sjobopening);

      setTeamsArray(response?.data?.rejectedCandidates);
      setLoader(false);
    } catch (err) {
      setLoader(false);
      console.log(err);
      let error = err.response?.data?.message;
      if (error) {
        setPopupContentMalert(error);
        setPopupSeverityMalert("error");
        handleClickOpenPopupMalert();
      } else {
        handleApiError(err, setShowAlert, handleClickOpenerr);
      }
    }
  };

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(
            blob,
            `${singleJobData.recruitmentname}_Rejected_Candidates.png`
          );
        });
      });
    }
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${singleJobData.recruitmentname}_Rejected_Candidates`,
    pageStyle: "print",
  });

  //serial no for listing items
  const addSerialNumber = () => {
    const itemsWithSerialNumber = teamsArray?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      roundname: item?.lastRound?.roundname,
      roundid: item?.lastRound?._id,
      rescheduleafterreject: item?.lastRound?.rescheduleafterreject || false,
      fullname: `${item.prefix}.${item.fullname}`,
      mobile: item.mobile,
      email: item.email,
      dateofbirth: item?.dateofbirth
        ? moment(item?.dateofbirth).format("DD-MM-YYYY")
        : "",
      qualification: item?.educationdetails
        ?.map(
          (t, i) =>
            `${i + 1 + ". "}` +
            `${t.categoryedu} - ${t.subcategoryedu} - ${t.specialization}`
        )
        .toString(),
      skill: Array.isArray(item?.skill)
        ? item.skill.map((d) => (Array.isArray(d) ? d.join(",") : d))
        : [],
      experience: `${item?.experience} ${
        item?.experienceestimation == undefined
          ? "Years"
          : item?.experienceestimation
      }`,
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
  //datatable....
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  // Split the search query into individual terms
  const searchTerms = searchQuery.toLowerCase().split(" ");

  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
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

  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );

  //Reset model
  const [isDeleteOpencheckboxReset, setIsDeleteOpencheckboxReset] =
    useState(false);
  const [dateTime, setDateTime] = useState({
    reportingdate: moment().format("YYYY-MM-DD"),
    reportingtime: moment().format("HH:mm"),
    deadlinedate: moment().format("YYYY-MM-DD"),
    deadlinetime: "23:59",
  });
  const [deleteRoundId, setDeleteRoundId] = useState("");
  const [moveBackUserName, setMoveBackUserName] = useState("");

  const handleCloseModcheckboxReset = () => {
    setIsDeleteOpencheckboxReset(false);
    setDeleteRoundId("");
    setDateTime({
      reportingdate: moment().format("YYYY-MM-DD"),
      reportingtime: moment().format("HH:mm"),
      deadlinedate: moment().format("YYYY-MM-DD"),
      deadlinetime: "23:59",
    });
  };
  const handleOpenModcheckboxReset = () => {
    setIsDeleteOpencheckboxReset(true);
  };

  const [isOpenMoveBack, setIsOpenMoveBack] = useState(false);
  const handleCloseMoveBack = () => {
    setIsOpenMoveBack(false);
    setDeleteRoundId("");
    setMoveBackUserName("");
  };
  const handleOpenMoveBack = () => {
    setIsOpenMoveBack(true);
  };
  const handleResetDate = async (e, roundstatus) => {
    try {
      // if (dateTime?.reportingdate === "") {
      //   setPopupContentMalert("Please Select Reporting Date!");
      //   setPopupSeverityMalert("info");
      //   handleClickOpenPopupMalert();
      // } else if (dateTime?.reportingtime === "") {
      //   setPopupContentMalert("Please Select Reporting Time!");
      //   setPopupSeverityMalert("info");
      //   handleClickOpenPopupMalert();
      // } else if (dateTime?.deadlinedate === "") {
      //   setPopupContentMalert("Please Select Deadline Date!");
      //   setPopupSeverityMalert("info");
      //   handleClickOpenPopupMalert();
      // } else if (dateTime?.deadlinetime === "") {
      //   setPopupContentMalert("Please Select Deadline Time!");
      //   setPopupSeverityMalert("info");
      //   handleClickOpenPopupMalert();
      // } else {
      let response = await axios.put(
        `${SERVICE.UPDATE_INTERVIEWROUNDSTATUS}/${e}`,
        {
          roundstatus: String(roundstatus),
          interviewForm: [],
          interviewFormLog: [],
          // date: dateTime?.reportingdate,
          // time: dateTime?.reportingtime,
          // deadlinedate: dateTime?.deadlinedate,
          // deadlinetime: dateTime?.deadlinetime,
          roundCreatedAt: new Date(),
          rescheduleafterreject: false,
          roundanswerstatus: "",
        }
      );
      await fetchCandidates();
      // handleCloseModcheckboxReset();
      handleCloseMoveBack();
      setPopupContent("Moved Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      // }
    } catch (err) {
      setLoader(false);
      console.log(err);
      let error = err.response?.data?.message;
      if (error) {
        setPopupContentMalert(error);
        setPopupSeverityMalert("error");
        handleClickOpenPopupMalert();
      } else {
        handleApiError(err, setShowAlert, handleClickOpenerr);
      }
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
      field: "roundname",
      headerName: "Round Name",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.roundname,
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
          {params?.row?.rescheduleafterreject &&
            isUserRoleCompare?.includes("ejobopenings") && (
              <Button
                endIcon={<RestoreIcon />}
                variant="contained"
                color="primary"
                size="small"
                style={{ backgroundColor: "#4CAF50", margin: "4px" }}
                onClick={() => {
                  // handleOpenModcheckboxReset();
                  handleOpenMoveBack();
                  setDeleteRoundId(params.row.roundid);
                  setMoveBackUserName(params.row.fullname);
                }}
              >
                Move Back
              </Button>
            )}

          {isUserRoleCompare?.includes("vjobopenings") && (
            <>
              <Link
                to={`/recruitment/viewresume/${params.row.id}/rejected/${ids}`}
              >
                <Button sx={userStyle.buttonedit}>
                  <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
                </Button>
              </Link>
            </>
          )}
        </Grid>
      ),
    },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      fullname: item.fullname,
      mobile: item.mobile,
      email: item.email,
      dateofbirth: item?.dateofbirth,
      qualification: item?.qualification,
      skill: item?.skill,
      experience: item?.experience,
      status: item.status,
      prefix: item?.prefix,
      gender: item?.gender,
      adharnumber: item?.adharnumber,
      roundname: item?.roundname,
      roundid: item?.roundid,
      rescheduleafterreject: item.rescheduleafterreject,
      //   company: singleJobData?.company,
      //   branch: singleJobData?.branch,
      //   designation: singleJobData?.designation,
    };
  });
  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRows.includes(row.id),
  }));
  // Show All Columns functionality
  const handleShowAllColumns = () => {
    setColumnVisibility(initialColumnVisibility);
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

  return (
    <Box>
      <Headtitle title={"REJECTED CANDIDATES"} />
      <br /> <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("ljobopenings") && (
        <>
          {loader ? (
            <Box sx={userStyle.container}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  minHeight: "350px",
                }}
              >
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
            </Box>
          ) : (
            <Box sx={userStyle.container}>
              {/* ******************************************************EXPORT Buttons****************************************************** */}
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  List {singleJobData.recruitmentname} Rejected Candidates
                </Typography>
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
                      {/* <MenuItem value={teamsArray?.length}>
                      All
                    </MenuItem> */}
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
                        <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                        &ensp;Image&ensp;{" "}
                      </Button>
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
              <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
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
              <Box
                style={{
                  width: "100%",
                  overflowY: "hidden", // Hide the y-axis scrollbar
                }}
              >
                <StyledDataGrid
                  // onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
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
                  {Math.min(page * pageSize, filteredDatas?.length)} of{" "}
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
              {/* ****** Table End ****** */}
            </Box>
          )}
        </>
      )}
      {/* ****** Table End ****** */}
      {/* reschedule model */}
      <Box>
        <Dialog
          open={isDeleteOpencheckboxReset}
          onClose={handleCloseModcheckboxReset}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth={true}
          maxWidth="sm"
        >
          <Box sx={{ padding: "20px 50px" }}>
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Reporting Date<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="date"
                    value={dateTime.reportingdate}
                    onChange={(e) => {
                      setDateTime({
                        ...dateTime,
                        reportingdate: e.target.value,
                        deadlinedate: "",
                      });
                      document.getElementById("deadline-date").min =
                        e.target.value;
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Reporting Time<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="time"
                    placeholder="HH:MM:AM/PM"
                    value={dateTime.reportingtime}
                    onChange={(e) => {
                      setDateTime({
                        ...dateTime,
                        reportingtime: e.target.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Deadline Date<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="deadline-date"
                    type="date"
                    value={dateTime.deadlinedate}
                    onChange={(e) => {
                      setDateTime({
                        ...dateTime,
                        deadlinedate: e.target.value,
                      });
                    }}
                    min={dateTime.date}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Deadline Time<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="time"
                    placeholder="HH:MM:AM/PM"
                    value={dateTime.deadlinetime}
                    onChange={(e) => {
                      setDateTime({
                        ...dateTime,
                        deadlinetime: e.target.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          <DialogActions>
            <Button
              onClick={handleCloseModcheckboxReset}
              sx={userStyle.btncancel}
            >
              Cancel
            </Button>
            <Button
              autoFocus
              variant="contained"
              color="primary"
              onClick={(e) => {
                handleResetDate(deleteRoundId, "Interview Scheduled");
              }}
            >
              {" "}
              Update{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Dialog
        open={isOpenMoveBack}
        onClose={handleCloseMoveBack}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
        >
          <RestoreIcon sx={{ fontSize: "80px", color: "orange" }} />
          <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
            Are you sure?. Do You want to move {moveBackUserName} to Interview
            Rounds?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseMoveBack}
            variant="contained"
            color="error"
          >
            No
          </Button>
          <Button
            autoFocus
            variant="contained"
            color="success"
            onClick={(e) => {
              handleResetDate(deleteRoundId, "Interview Scheduled");
            }}
          >
            YES
          </Button>
        </DialogActions>
      </Dialog>
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
        filteredDataTwo={filteredData ?? []}
        itemsTwo={items ?? []}
        filename={`${singleJobData.recruitmentname}_Rejected_Candidates`}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* EXTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}

export default RejectedCandidates;
