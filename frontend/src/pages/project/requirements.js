import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, Dialog, IconButton, DialogContent, List, Popover, Checkbox, ListItemText, ListItem, TextField, OutlinedInput, DialogActions, Grid, Select, MenuItem, FormControl, Table, TableContainer, Button, TableBody } from "@mui/material";
import { userStyle } from "../../pageStyle";
import { FaPrint, FaFilePdf, FaTrash, FaEdit } from "react-icons/fa";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { SERVICE } from "../../services/Baseservice";
import { handleApiError } from "../../components/Errorhandling";
import axios from "axios";
import "jspdf-autotable";
import CloseIcon from '@mui/icons-material/Close';
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import PageHeading from "../../components/PageHeading";
// import Taskeditmodel from "./taskeditmodel";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Switch from "@mui/material/Switch";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import LastPageIcon from "@mui/icons-material/LastPage";
import { ThreeDots } from "react-loader-spinner";
import StyledDataGrid from "../../components/TableStyle";
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';
import { saveAs } from "file-saver";
import ExportData from "../../components/ExportData";
import AlertDialog from "../../components/Alert";
import MessageAlert from "../../components/MessageAlert";
import { DeleteConfirmation } from "../../components/DeleteConfirmation.js";

function Submodulelistview() {
  const { isUserRoleCompare, pageName, setPageName, buttonStyles, isUserRoleAccess } = useContext(UserRoleAccessContext);
  const pathname = window.location.pathname;;
  const [loader, setLoader] = useState(false);

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
  const handleClickOpenPopup = () => {
    setOpenPopup(true);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  let exportColumnNames = ['Project', "Sub Project", "Module", "Sub Module", "Page Type No", "Main Page", "Sub Page", "Sub Sub Page", "Page Branch"];
  let exportRowValues = ['project', 'subproject', 'module', 'submodule', 'pagetype', 'mainpage', 'subpage', 'name', 'pageBranch']

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const gridRef = useRef(null);
  let authToken = localStorage.APIToken;

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

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    project: true,
    subproject: true,
    module: true,
    submodule: true,
    pagetype: true,
    mainpage: true,
    subpage: true,
    name: true,
    page: true,
    pageBranch: true,
    status: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  // page refersh reload
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

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
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

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Requirements"),
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

  useEffect(() => {
    getapi();
  }, []);

  // Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };

  const { auth } = useContext(AuthContext);
  const [projectModels, setProjectModels] = useState([]);
  const [submoduleEnd, setSubmoduleEnd] = useState([]);
  const [endMerge, setEndmerge] = useState([]);
  const [taskassignBoardlist, settaskassignBoardlist] = useState([]);
  const [deletePageData, setDeletePageData] = useState([]);
  const [deletePageName, setDeletePageName] = useState([]);
  const [deleteid, setSelectid] = useState("");

  const [pageModelEdit, setPageModelEdit] = useState({
    name: "",
    project: "",
    subproject: "",
    module: "",
  });

  const filteredDataend = projectModels.filter((row) => row.pageBranch === "EndPage");
  {
    filteredDataend.map((row) => <li>{row.pageBranch}</li>);
  }

  //get all role list details
  const fetchtaskassignboardlist = async () => {
    setPageName(!pageName);
    try {
      let res_sub = await axios.get(SERVICE.TASKASSIGN_BOARD_LIST_LIMITED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      settaskassignBoardlist(res_sub?.data?.taskAssignBoardList);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const rowData = async (id, name) => {
    setPageName(!pageName);
    try {
      setDeletePageName(name);
      setSelectid(id);
      if (name === "submodule") {
        let res = await axios.get(`${SERVICE.SUBMODULE_SINGLE}/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        handleClickOpen();
        setDeletePageData(res?.data?.ssubmodule);
      } else {
        let res = await axios.get(`${SERVICE.PAGEMODEL_SINGLE}/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        handleClickOpen();
        setDeletePageData(res?.data?.spagemodel);
      }
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  // Alert delete popup
  let pageTypeId = deletePageData?._id;
  const delPageView = async () => {
    let ids = taskassignBoardlist.filter((task) => task.prevId == deleteid).map((item) => item._id);

    const deletePromises = ids?.map((item) => {
      return axios.delete(`${SERVICE.TASKASSIGNBOARDLIST_SINGLE}/${item}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
    });
    await Promise.all(deletePromises);
    try {
      setPageName(!pageName);
      if (deletePageName === "submodule") {
        await axios.put(`${SERVICE.SUBMODULE_SINGLE}/${pageTypeId}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          status: "not assigned",
          componentgrouping: "",
          component: "",
          subcomponent: "",
          count: "",
          subComReq: "",
          taskassignboardliststatus: "Yet to assign",
          uidesign: [],
          develop: [],
          testing: [],
          testinguidesign: [],
        });
        handleCloseMod();
        setPage(1);
        handleCloseMod();
        setSelectedRows([]);
        setPage(1);
      } else {
        await axios.put(`${SERVICE.PAGEMODEL_SINGLE}/${pageTypeId}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          status: "not assigned",
          componentgrouping: "",
          component: "",
          subcomponent: "",
          count: "",
          subComReq: "",
          taskassignboardliststatus: "Yet to assign",
          uidesign: [],
          develop: [],
          testing: [],
          testinguidesign: [],
        });
        handleCloseMod();
        setPage(1);
        handleCloseMod();
        setSelectedRows([]);
        setPage(1);
      }
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const fetchprojectModelsDropdwon = async () => {
    setPageName(!pageName);
    try {
      let res_project = await axios.get(SERVICE.PAGEMODEL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let resr = res_project.data.pagemodel.filter((a) => a.pageBranch === "EndPage");
      setProjectModels(resr);
      // setProjectModels(res_project?.data?.pagemodel);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const fetchSubmodule = async () => {
    setPageName(!pageName);
    try {
      let res_submodule = await axios.get(SERVICE.SUBMODULE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let res = res_submodule?.data?.submodules?.filter((a) => a.endpage === "end");

      const res_name = res.map((t, index) => ({
        _id: t._id,
        project: t.project,
        subproject: t.subproject,
        module: t.module,
        submodule: t.name,
        page: "submodule",
        endpage: t.endpage,
        pagetype: "",
        mainpage: "---",
        subpage: "",
        subsubpage: "",
        pageBranch: "",
        endpage: t.endpage,
        status: t.status,
      }));
      setSubmoduleEnd(res_name);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const fetchmerge = () => {
    let res = [...projectModels, ...submoduleEnd];
    setEndmerge(res);
    setLoader(true);
  };

  // get single row to view....
  const getviewCode = async (e, page) => {
    setPageName(!pageName);
    try {
      if (page === "submodule") {
        let res = await axios.get(`${SERVICE.SUBMODULE_SINGLE}/${e}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setPageModelEdit(res?.data?.ssubmodule);
      } else {
        let res = await axios.get(`${SERVICE.PAGEMODEL_SINGLE}/${e}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setPageModelEdit(res?.data?.spagemodel);
      }
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, 'Requirements.png');
        });
      });
    }
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Requirements",
    pageStyle: "print",
  });

  const [items, setItems] = useState([]);

  const modifiedData = endMerge.map((t, index) => ({
    // ...person,
    _id: t._id,
    sno: index + 1,
    status: t.status === "assigned" ? "Requirement assigned" : "Requirement not assigned",
    project: t.project,
    subproject: t.subproject,
    module: t.module,
    submodule: t.submodule,
    pagetype: t.pagetype === "" ? "---" : t.pagetype,
    mainpage: t.mainpage === "" ? "---" : t.mainpage,
    subpage: t.subpage === "" ? "---" : t.subpage,
    name: t.pagetypename === "SUBSUBPAGE" ? t.name : "---",
    pageBranch: t.pageBranch,
    endpage: t.endpage,
    page: t.page,
  }));

  const addSerialNumber = () => {
    const itemsWithSerialNumber = endMerge?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      _id: item._id,
      status: item.status === "assigned" ? "Requirement assigned" : "Requirement not assigned",
      project: item.project,
      subproject: item.subproject,
      module: item.module,
      submodule: item.submodule,
      pagetype: item.pagetype === "" ? "---" : item.pagetype,
      mainpage: item.mainpage === "" ? "---" : item.mainpage,
      subpage: item.subpage === "" ? "---" : item.subpage,
      name: item.pagetypename === "SUBSUBPAGE" ? item.name : "---",
      pageBranch: item.pageBranch,
      endpage: item.endpage,
      page: item.page,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [endMerge]);

  useEffect(() => {
    fetchprojectModelsDropdwon();
    fetchSubmodule();
    fetchmerge();
  }, [submoduleEnd, projectModels]);

  useEffect(() => {
    fetchtaskassignboardlist();
  }, []);

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
  const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchOverTerms.every((term) => Object.values(item)?.join(" ")?.toLowerCase()?.includes(term));
  });

  const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredDatas?.length / pageSize);
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
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );
  const columnDataTable = [
    {
      field: "checkbox",
      headerName: "Checkbox",
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
      width: 80,
      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 80,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "project",
      headerName: "Project",
      flex: 0,
      width: 150,
      hide: !columnVisibility.project,
      headerClassName: "bold-header",
    },
    {
      field: "subproject",
      headerName: "Sub Project",
      flex: 0,
      width: 150,
      hide: !columnVisibility.subproject,
      headerClassName: "bold-header",
    },
    {
      field: "module",
      headerName: "Module",
      flex: 0,
      width: 150,
      hide: !columnVisibility.module,
      headerClassName: "bold-header",
    },
    {
      field: "submodule",
      headerName: "Sub Module",
      flex: 0,
      width: 150,
      hide: !columnVisibility.submodule,
      headerClassName: "bold-header",
    },
    {
      field: "pagetype",
      headerName: "Page Type No",
      flex: 0,
      width: 150,
      hide: !columnVisibility.pagetype,
      headerClassName: "bold-header",
    },
    {
      field: "mainpage",
      headerName: "Main Page",
      flex: 0,
      width: 150,
      hide: !columnVisibility.mainpage,
      headerClassName: "bold-header",
    },
    {
      field: "subpage",
      headerName: "Sub Page",
      flex: 0,
      width: 150,
      hide: !columnVisibility.subpage,
      headerClassName: "bold-header",
    },
    {
      field: "name",
      headerName: "Sub Sub Page",
      flex: 0,
      width: 150,
      hide: !columnVisibility.name,
      headerClassName: "bold-header",
    },
    {
      field: "pageBranch",
      headerName: "Page Branch",
      flex: 0,
      width: 150,
      hide: !columnVisibility.pageBranch,
      headerClassName: "bold-header",
    },
    {
      field: "status",
      headerName: "Alloted Status",
      flex: 0,
      width: 200,
      hide: !columnVisibility.status,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          <Typography
            style={{
              background: params.row.status === "Requirement assigned" ? "#34a034ed" : "#f82c2ceb",
              width: "max-content",
              borderRadius: "14px",
              color: "white",
              padding: "0px 5px",
              textAlign: "center",
            }}
            variant="subtitle2"
          >
            {params.row.status}
          </Typography>
        </Grid>
      ),
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 200,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {params.row.status === "Requirement assigned" ? (
            <>
              {isUserRoleCompare?.includes("erequirements") && (
                <Link to={`/project/pagemodelfetchEdit/${params.row.id}`}>
                  <Button
                    sx={userStyle.buttonedit}
                    onClick={() => {
                      // handleClickOpenEdit();
                      // getCode(params.row.id);
                    }}
                  >
                    <FaEdit sx={buttonStyles.buttonedit} />
                  </Button>
                </Link>
              )}
              {isUserRoleCompare?.includes("drequirements") && (
                <Button
                  sx={userStyle.buttondelete}
                  onClick={(e) => {
                    rowData(params.row.id, params.row.page);
                  }}
                >
                  <FaTrash sx={buttonStyles.buttondelete} />
                </Button>
              )}
            </>
          ) : (
            <>
              {isUserRoleCompare?.includes("arequirements") && (
                <Link to={`/project/pagemodelfetch/${params.row.id}`}>
                  <div
                    style={{
                      fontSize: "20px",
                      color: "#1976d2",
                    }}
                  >
                    <AddCircleOutlineIcon />
                  </div>
                </Link>
              )}

              {/* <Button
                                    sx={userStyle.buttonedit}
                                    onClick={() => {
                                      handleClickOpenview();
                                      getviewCode(params.row.id);
                                    }}
                                  >
                                    <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                                  </Button> */}
            </>
          )}


          {/* {isUserRoleCompare?.includes("dproductionunitrate") && (
            <Button
              sx={{ minWidth: "50px", padding: "6px 8px" }}
              onClick={(e) => {
                rowData(params.row.id);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttoninfo} />
            </Button>
          )} */}

        </Grid>
      ),
    },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      project: item.project,
      subproject: item.subproject,
      module: item.module,
      submodule: item.submodule,
      pagetype: item.pagetype,
      mainpage: item.mainpage,
      subpage: item.subpage,
      name: item.name,
      pageBranch: item.page == "pageBranch" ? item.name : item.pageBranch,
      status: item.status,
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
  // Function to filter columns based on search query
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
        <TextField label="Find column" variant="standard" fullWidth value={searchQueryManage} onChange={(e) => setSearchQueryManage(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
      </Box>
      <br />
      <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumns.map((column) => (
            <ListItem key={column.field}>
              <ListItemText sx={{ display: "flex" }} primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />} secondary={column.field === "checkbox" ? "Checkbox" : column.headerName} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Grid container>
          <Grid item md={4}>
            <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibility(initialColumnVisibility)}>
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

  return (
    <Box>
      <Headtitle title={"Requirements"} />

      <PageHeading
        title="Requirements"
        modulename="Projects"
        submodulename="Sub Module"
        mainpagename="Requirements"
        subpagename=""
        subsubpagename=""
      />

      {!loader ? (
        <Box sx={userStyle.container}>
          <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
            <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
          </Box>
        </Box>
      ) : (
        <>
          {isUserRoleCompare?.includes("lrequirements") && (
            <Box sx={userStyle.container}>
              {/* ******************************************************EXPORT Buttons****************************************************** */}
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>Requirements List </Typography>
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
                      {/* <MenuItem value={endMerge?.length}>All</MenuItem> */}
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
                    {isUserRoleCompare?.includes("excelrequirements") && (
                      <>
                        <Button
                          onClick={(e) => {
                            setIsFilterOpen(true);
                            fetchmerge();
                            setFormat("xl");
                          }}
                          sx={userStyle.buttongrp}
                        >
                          <FaFileExcel />
                          &ensp;Export to Excel&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("csvrequirements") && (
                      <>
                        <Button
                          onClick={(e) => {
                            setIsFilterOpen(true);
                            fetchmerge();
                            setFormat("csv");
                          }}
                          sx={userStyle.buttongrp}
                        >
                          <FaFileCsv />
                          &ensp;Export to CSV&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("printrequirements") && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("pdfrequirements") && (
                      <>
                        <Button
                          sx={userStyle.buttongrp}
                          onClick={() => {
                            setIsPdfFilterOpen(true);
                            fetchmerge();
                          }}
                        >
                          <FaFilePdf />
                          &ensp;Export to PDF&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("imagerequirements") && (
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
          )}
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
        itemsTwo={endMerge ?? []}
        filename={"Requirements"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />

      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delPageView}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />

      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent
            sx={{
              width: "350px",
              textAlign: "center",
              alignItems: "center",
            }}
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

      {/* EXTERNAL COMPONENTS -------------- END */}
      <br />

    </Box>
  );
}

export default Submodulelistview;