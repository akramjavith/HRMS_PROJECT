import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  OutlinedInput,
  DialogActions,
  Grid,
  Select,
  MenuItem,
  FormControl,
  Button,
  List,
  ListItem,
  ListItemText,
  Popover,
  TextField,
  IconButton,
  Checkbox,
} from "@mui/material";
import { userStyle } from "../../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { handleApiError } from "../../../../components/Errorhandling";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { SERVICE } from "../../../../services/Baseservice";
import axios from "axios";
import { saveAs } from "file-saver";
import "jspdf-autotable";
import moment from "moment-timezone";
import { Link } from "react-router-dom";
import StyledDataGrid from "../../../../components/TableStyle";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { ThreeDots } from "react-loader-spinner";
import {
  UserRoleAccessContext,
  AuthContext,
} from "../../../../context/Appcontext";
import Headtitle from "../../../../components/Headtitle";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import html2canvas from "html2canvas";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import domtoimage from 'dom-to-image';
import ExportData from "../../../../components/ExportData";
import AlertDialog from "../../../../components/Alert";
import MessageAlert from "../../../../components/MessageAlert";
import InfoPopup from "../../../../components/InfoPopup.js";
import { DeleteConfirmation } from "../../../../components/DeleteConfirmation.js";
import PageHeading from "../../../../components/PageHeading";

import AggregatedSearchBar from "../../../../components/AggregatedSearchBar";
import AggridTable from "../../../../components/AggridTable";
function EnquiryPurposeUsersList() {
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    // setSubmitLoader(false);
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

  let exportColumnNames = [
    "Status",
    "Percentage",
    "Empcode",
    "Company Name",
    "User Name",
    "Email",
    "Branch",
    "Unit",
    "Team", "WorkMode",
    "Experience",
    "Doj",
    "Status",
  ];
  let exportRowValues = [
    "status",
    "percentage",
    "empcode",
    "companyname",
    "username",
    "email",
    "branch",
    "unit",
    "team", "workmode",
    "experience",
    "doj",
    "enquirystatus",
  ];

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
  const [employees, setEmployees] = useState([]);
  const [deleteuser, setDeleteuser] = useState([]);
  const [useredit, setUseredit] = useState([]);
  const {
    isUserRoleCompare,
    isUserRoleAccess,
    isAssignBranch,
    pageName,
    setPageName,
    buttonStyles,
  } = useContext(UserRoleAccessContext);

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
          data?.subpagenameurl?.length !== 0 && data?.subpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 && data?.mainpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.mainpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 && data?.submodulenameurl?.includes(window.location.pathname)
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
      pagename: String("Enquiry Purpose Users List"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),

      addedby: [
        {
          name: String(isUserRoleAccess?.username),
          date: String(new Date()),
        },
      ],
    });
  };
  const [checkemployeelist, setcheckemployeelist] = useState(false);
  const { auth } = useContext(AuthContext);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  //image 
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Enquiry Purpose Users List.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  //Delete model
  const [isDeleteOpen, setisDeleteOpen] = useState(false);
  const handleClickOpendel = () => {
    setisDeleteOpen(true);
  };
  const handleCloseDel = () => {
    setisDeleteOpen(false);
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

  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  // State for manage columns search query
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);

  const gridRef = useRef(null);

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
    actions: true,
    serialNumber: true,
    status: true,
    percentage: true,
    empcode: true,
    companyname: true,
    username: true,
    email: true,
    branch: true,
    unit: true,
    team: true, workmode: true,
    shift: true,
    experience: true,
    doj: true,
    // checkbox: true,
    enquirystatus: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  let userid = deleteuser?._id;

  //get all employees list details
  const fetchEmployee = async () => {
    setPageName(!pageName);
    try {
      let res_employee = await axios.get(SERVICE.USERSENQUIERY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let datasss = res_employee?.data?.users
        ?.filter((item) =>
          accessbranch.some(
            (branch) =>
              branch.company === item.company &&
              branch.branch === item.branch &&
              branch.unit === item.unit
          )
        )
        .map((item) => ({
          ...item,
          doj: moment(item.doj).format("DD/MM/YYYY"),
          percentage: item.percentage ? Math.round(item.percentage) + "%" : " ",
        }));

      setEmployees(datasss?.map((item, index) => ({ ...item, serialNumber: index + 1 })));
      setcheckemployeelist(true);
    } catch (err) {
      setcheckemployeelist(true);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const delAddemployee = async () => {
    setPageName(!pageName);
    try {
      let del = await axios.delete(`${SERVICE.USER_SINGLE}/${userid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchEmployee();
      setPage(1);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setUseredit(res?.data?.suser);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  let updateby = useredit?.updatedby;
  let addedby = useredit?.addedby;

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Enquiry Purpose Users List",
    pageStyle: "print",
  });

  useEffect(() => {
    fetchEmployee();
  }, []);

  const [items, setItems] = useState([]);

  const addSerialNumber = (datas) => {
    const itemsWithSerialNumber = datas?.map((item, index) => ({
      ...item,
      serialNumber: item.serialNumber,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber(employees);
  }, [employees]);

  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTable = useRef(null);
  const gridRefTableImg = useRef(null);

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
    setPage(1);
  };
  // Split the search query into individual terms
  const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchOverTerms.every((term) =>
      Object.values(item)?.join(" ")?.toLowerCase()?.includes(term)
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

  const indexOfLastItem = page * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;

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
    // {
    //   field: "checkbox",
    //   headerName: "Checkbox", // Default header name
    //   headerStyle: {
    //     fontWeight: "bold",
    //   },
    //   sortable: false,
    //   width: 90,
    //   headerCheckboxSelection: true,
    //   checkboxSelection: true,
    //   hide: !columnVisibility.checkbox,
    //   headerClassName: "bold-header",
    //   pinned: "left",
    // },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 90,
      minHeight: "40px",
      hide: !columnVisibility.serialNumber,
      pinned: "left",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0,
      width: 100,
      minHeight: "40px",
      pinned: "left",
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cellRenderer: (params) => (
        <Typography
          color={params.data.status == "incomplete" ? "error" : "green"}
          variant="contained"
          sx={{ padding: "5px" }}
        >
          {params.data.status}
        </Typography>
      ),
      hide: !columnVisibility.status,
    },
    {
      field: "percentage",
      headerName: "Percentage",
      flex: 0,
      width: 120,
      minHeight: "40px",

      hide: !columnVisibility.percentage,
    },
    {
      field: "empcode",
      headerName: "Empcode",
      flex: 0,
      width: 140,
      minHeight: "40px",
      hide: !columnVisibility.empcode,
    },
    {
      field: "companyname",
      headerName: "Company Name",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.companyname,
    },
    {
      field: "username",
      headerName: "User Name",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.username,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.email,
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.branch,
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.unit,
    },
    {
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.team,
    },
    {
      field: "workmode",
      headerName: "WorkMode",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.workmode,
    },
    {
      field: "experience",
      headerName: "Experience",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.experience,
    },
    {
      field: "doj",
      headerName: "Doj",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.doj,
    },
    {
      field: "enquirystatus",
      headerName: "Status",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.enquirystatus,
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
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cellRenderer: (params) => (
        <>
          {!isUserRoleCompare.includes("Manager") ? (
            <>
              <Grid container spacing={2}>
                <Grid item>
                  {isUserRoleCompare?.includes("eenquirypurposeuserslist") && (
                    <a
                      href={`/enquiryedit/${params.data.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      <Button size="small" style={userStyle.actionbutton}>
                        <EditIcon sx={buttonStyles.buttonedit} />
                      </Button>
                    </a>
                  )}

                  {isUserRoleCompare?.includes("venquirypurposeuserslist") && (
                    <a
                      href={`/view/${params.data.id}/enquiry`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      <Button size="small" style={userStyle.actionbutton}>
                        <VisibilityIcon sx={buttonStyles.buttonview} />
                      </Button>
                    </a>
                  )}
                  {isUserRoleCompare?.includes("ienquirypurposeuserslist") && (
                    <Link to="">
                      <Button
                        sx={userStyle.actionbutton}
                        onClick={() => {
                          getinfoCode(params.data.id);
                        }}
                      >
                        <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />
                      </Button>
                    </Link>
                  )}
                </Grid>
              </Grid>
            </>
          ) : (
            <>
              <Grid sx={{ display: "flex" }}>
                {isUserRoleCompare?.includes("venquirypurposeuserslist") && (
                  <Link
                    to={`/view/${params.data.id}/enquiry`}
                    style={{ textDecoration: "none", color: "#fff" }}
                  >
                    <Button size="small" style={userStyle.actionbutton}>
                      <VisibilityIcon sx={buttonStyles.buttonview} />
                    </Button>
                  </Link>
                )}
              </Grid>
            </>
          )}
        </>
      ),
    },
  ];

  // Create a row data object for the DataGrid
  const rowDataTable = filteredData.map((item) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      status: item.status,
      percentage: item.percentage,
      empcode: item.empcode,
      nexttime: item.nexttime,
      companyname: item.companyname,
      username: item.username,
      email: item.email,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      workmode: item.workmode,
      shift: item.shift,
      experience:
        (new Date().getFullYear() - new Date(item.doj).getFullYear()) * 12 +
          new Date().getMonth() -
          new Date(item.doj).getMonth() -
          (new Date(item.doj).getDate() > 2 ||
            new Date(item.doj).getDate() !== 1
            ? 1
            : 0) ==
          -1
          ? 0
          : (new Date().getFullYear() - new Date(item.doj).getFullYear()) * 12 +
          new Date().getMonth() -
          new Date(item.doj).getMonth() -
          (new Date(item.doj).getDate() > 2 ||
            new Date(item.doj).getDate() !== 1
            ? 1
            : 0),
      // doj: item.doj,
      doj: item.doj,
      enquirystatus: item.enquirystatus,
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

  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  // Function to filter columns based on search query
  const filteredColumns = columnDataTable?.filter((column) =>
    column?.headerName
      ?.toLowerCase()
      ?.includes(searchQueryManage?.toLowerCase())
  );

  // JSX for the "Manage Columns" popover content
  const manageColumnsContent = (
    <div style={{ padding: "10px", minWidth: "325px" }}>
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
            <ListItem key={column?.field}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={
                  <Switch
                    sx={{ marginTop: "-10px" }}
                    checked={columnVisibility[column?.field]}
                    onChange={() => toggleColumnVisibility(column?.field)}
                  />
                }
                secondary={column?.headerName}
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
    </div>
  );

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

  return (
    <Box>
      <Headtitle title={"ENQUIRY PURPOSE USERS LIST"} />
      {/* ****** Header Content ****** */}

      <PageHeading
        title="Enquiry Purpose Users Details"
        modulename="Human Resources"
        submodulename="HR"
        mainpagename="Employee"
        subpagename="Employee details"
        subsubpagename="Enquiry Purpose Users List"
      />
      <br />
      {isUserRoleCompare?.includes("lenquirypurposeuserslist") && (
        <>
          <Box sx={userStyle.container}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.SubHeaderText}>
                  Enquiry Purpose Users List
                </Typography>
              </Grid>
            </Grid>
            <Box>
              <Grid container spacing={2} style={userStyle.dataTablestyle}>
                <Grid item md={2} xs={12} sm={12}>
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
                      <MenuItem value={employees?.length}>All</MenuItem>
                    </Select>
                  </Box>
                </Grid>
                <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center", }}  >
                  <Box>
                    {isUserRoleCompare?.includes(
                      "excelenquirypurposeuserslist"
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
                    {isUserRoleCompare?.includes(
                      "csvenquirypurposeuserslist"
                    ) && (
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
                      "printenquirypurposeuserslist"
                    ) && (
                        <>
                          <Button
                            sx={userStyle.buttongrp}
                            onClick={handleprint}
                          >
                            &ensp;
                            <FaPrint />
                            &ensp;Print&ensp;
                          </Button>
                        </>
                      )}
                    {isUserRoleCompare?.includes(
                      "pdfenquirypurposeuserslist"
                    ) && (
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
                      "imageenquirypurposeuserslist"
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
                  </Box>
                </Grid>
                <Grid item md={2} xs={6} sm={6}>
                  <AggregatedSearchBar
                    columnDataTable={columnDataTable}
                    setItems={setItems}
                    addSerialNumber={addSerialNumber}
                    setPage={setPage}
                    maindatas={employees}
                    setSearchedString={setSearchedString}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    paginated={false}
                    totalDatas={employees}
                  />
                </Grid>
              </Grid><br />
              <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
              <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button><br /><br />
              {checkemployeelist ? (
                <>
                  <Box sx={{ width: "100%", }} className={"ag-theme-quartz"} ref={gridRefTableImg} >
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
                      gridRefTableImg={gridRefTableImg}
                      paginated={false}
                      filteredDatas={filteredDatas}
                      // totalDatas={totalDatas}
                      searchQuery={searchedString}
                      handleShowAllColumns={handleShowAllColumns}
                      setFilteredRowData={setFilteredRowData}
                      filteredRowData={filteredRowData}
                      setFilteredChanges={setFilteredChanges}
                      filteredChanges={filteredChanges}
                      itemsList={employees}
                    />
                  </Box>
                </>
              ) : (
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
              )}
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
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
        itemsTwo={employees ?? []}
        filename={"Enquiry Purpose Users List"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Enquiry Purpose Users List Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseDel}
        onConfirm={delAddemployee}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/* EXTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}

export default EnquiryPurposeUsersList;
