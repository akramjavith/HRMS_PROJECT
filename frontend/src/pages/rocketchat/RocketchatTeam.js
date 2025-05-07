import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { MultiSelect } from "react-multi-select-component";
import {
  Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton, List, ListItem, ListItemText,
  MenuItem, OutlinedInput, Popover, Select, TextField, Typography,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../components/Errorhandling.js";
import Headtitle from "../../components/Headtitle.js";
import StyledDataGrid from "../../components/TableStyle.js";
import { UserRoleAccessContext } from "../../context/Appcontext.js";
import { AuthContext } from "../../context/Appcontext.js";
import { userStyle } from "../../pageStyle.js";
import { SERVICE } from "../../services/Baseservice.js";
import moment from "moment";
import RestoreIcon from "@mui/icons-material/Restore";
import AlertDialog from "../../components/Alert.js";
import { DeleteConfirmation } from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData.js";
import MessageAlert from "../../components/MessageAlert.js";
import PageHeading from "../../components/PageHeading.js";

function RocketchatTeam() {
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

  let exportColumnNames = ["Team Name", "Type", "CreatedAt", "CreatedBy", "UpdatedAt", "Rooms", "Number Of Users"];
  let exportRowValues = [
    "name",
    "typestring",
    "createdat",
    "createdby",
    "updatedat",
    "rooms",
    "numberofusers",
  ];

  let typeOptions = [
    { label: "Public", value: "Public" },
    { label: "Private", value: "Private" },
  ];
  let sidePanelOptions = [
    { label: "discussions", value: "discussions" },
    { label: "channels", value: "channels" },
  ];

  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [assetVariant, setAssetVariant] = useState({
    name: "",
    type: "Public",
  });
  //department multiselect
  const [selectedOptionsSidePannel, setSelectedOptionsSidePannel] = useState(
    []
  );
  let [valueSidePannelCat, setValueSidePannelCat] = useState([]);

  const handleSidePannelChange = (options) => {
    setValueSidePannelCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsSidePannel(options);
  };

  const customValueRendererSidePannel = (valueSidePannelCat, _categoryname) => {
    return valueSidePannelCat?.length
      ? valueSidePannelCat.map(({ label }) => label)?.join(", ")
      : "Please Select Side Panel";
  };
  const [assetVariantEdit, setAssetVariantEdit] = useState({
    name: "",
    displayname: "",
    type: "Invite",
  });
  const [teamsArray, setTeamsArray] = useState([]);
  const {
    isUserRoleCompare,
    isUserRoleAccess,
    pageName,
    setPageName,
    buttonStyles,
  } = useContext(UserRoleAccessContext);

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
      pagename: String("Create Connections Team"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),

      addedby: [
        {
          name: String(isUserRoleAccess?.companyname),
          date: String(new Date()),
        },
      ],
    });
  };

  const { auth } = useContext(AuthContext);
  const [loader, setLoader] = useState(false);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [isBtn, setIsBtn] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [openview, setOpenview] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleteOpenRestore, setIsDeleteOpenRestore] = useState(false);
  const [deleteAssetVariant, setDeleteAssetVariant] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [allAssetVariantEdit, setAllAssetVariantEdit] = useState([]);
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    name: true,
    type: true,
    typestring: true,
    createdat: true,
    createdby: true,
    updatedat: true,
    rooms: true,
    numberofusers: true,
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
    fetchHiConnectTeams();
  }, []);
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

  const [singleRow, setSingleRow] = useState({});
  // view model
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
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
  const handleClickOpenRestore = () => {
    setIsDeleteOpenRestore(true);
  };
  const handleCloseModRestore = () => {
    setIsDeleteOpenRestore(false);
  };
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
  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  };

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
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  const [deleteTeamId, setDeleteTeamId] = useState("");

  const deleteTeam = async () => {
    setPageName(!pageName);
    try {
      await axios.delete(
        `${SERVICE.DELETE_ROCKETCHAT_TEAM}/?teamid=${deleteTeamId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      await fetchHiConnectTeams();
      handleCloseMod();
      setSelectedRows([]);
      setPage(1);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      console.log(err);
      let error = err.response?.data?.message;
      if (error) {
        setPopupContentMalert(error);
        setPopupSeverityMalert("error");
        handleClickOpenPopupMalert();
      } else {
        handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
      }
    }
  };
  const [restoreTeamId, setRestoreTeamId] = useState("");

  // const restoreTeam = async () => {
  //   setPageName(!pageName);
  //   try {
  //     await axios.post(
  //       `${SERVICE.MATTERMOST_RESTORE_TEAM}/?teamid=${restoreTeamId}`,
  //       {},
  //       {
  //         headers: {
  //           Authorization: `Bearer ${auth.APIToken}`,
  //         },
  //       }
  //     );
  //     await fetchHiConnectTeams();
  //     handleCloseModRestore();
  //     setSelectedRows([]);
  //     setPage(1);
  //     setPopupContent("Restored Successfully");
  //     setPopupSeverity("success");
  //     handleClickOpenPopup();
  //   } catch (err) {
  //     console.log(err);
  //     let error = err.response?.data?.message;
  //     if (error) {
  //       setPopupContentMalert(error);
  //       setPopupSeverityMalert("error");
  //       handleClickOpenPopupMalert();
  //     } else {
  //       handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
  //     }
  //   }
  // };

  //add function
  const sendRequest = async () => {
    setPageName(!pageName);
    setIsBtn(true);
    try {
      let createTeam = await axios.post(
        SERVICE.CREATE_ROCKETCHAT_TEAM,
        {
          teamname: String(assetVariant.name?.trim()),
          type: assetVariant.type === "Public" ? 0 : 1,
          sidepanel: valueSidePannelCat
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      await fetchHiConnectTeams();
      setAssetVariant({ name: "", type: "Public" });
      setSelectedOptionsSidePannel([])
      setValueSidePannelCat([])
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setIsBtn(false);
    } catch (err) {
      setIsBtn(false);
      let error = err.response?.data?.message;
      if (error) {
        setPopupContentMalert(error);
        setPopupSeverityMalert("error");
        handleClickOpenPopupMalert();
      } else {
        handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
      }
    }
  };

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();

    if (assetVariant.name?.trim() === "") {
      setPopupContentMalert("Please Enter Team Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (assetVariant.type === "") {
      setPopupContentMalert("Please Select Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (valueSidePannelCat?.length === 0) {
      setPopupContentMalert("Please Select Side Panel!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (teamsArray?.some(data => data?.name?.trim()?.toLowerCase() === assetVariant.name?.trim()?.toLowerCase())) {
      setPopupContentMalert("Team Name Already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      sendRequest();
    }
  };

  const handleclear = (e) => {
    e.preventDefault();
    setAssetVariant({ name: "", type: "Public" });
    setSelectedOptionsSidePannel([])
    setValueSidePannelCat([])
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };
  //Edit model...
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
  };

  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.put(
        `${SERVICE.UPDATE_ROCKETCHAT_TEAM}`,
        {
          name: String(assetVariantEdit.name),
          type: assetVariantEdit.typestring === "Public" ? 0 : 1,
          teamid: assetVariantEdit.id
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      await fetchHiConnectTeams();
      handleCloseModEdit();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      console.log("Error Response:", err.response);
      let error = err.response?.data?.message;
      if (error) {
        setPopupContentMalert(error);
        setPopupSeverityMalert("error");
        handleClickOpenPopupMalert();
      } else {
        handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
      }
    }
  };
  const editSubmit = (e) => {
    e.preventDefault();

    if (assetVariantEdit.name?.trim() === "") {
      setPopupContentMalert("Please Enter Team Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (assetVariantEdit.typestring === "" || !assetVariantEdit.typestring) {
      setPopupContentMalert("Please Select Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (teamsArray?.filter(item => item?._id !== assetVariantEdit?.id)?.some(data => data?.name?.trim()?.toLowerCase() === assetVariantEdit.name?.trim()?.toLowerCase())) {
      setPopupContentMalert("Team Name Already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendEditRequest();
    }
  };
  //get all Asset Variant name.

  const fetchHiConnectTeams = async () => {
    setPageName(!pageName);
    try {
      setLoader(true);
      let response = await axios.get(SERVICE.GET_ALL_ROCKETCHAT_TEAMS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTeamsArray(response?.data?.rocketchatTeams.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));

      // setTeamsArray(response?.data?.rocketchatTeams);
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
        handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
      }
    }
  };

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Connections Team.png");
        });
      });
    }
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Connections Team",
    pageStyle: "print",
  });

  //serial no for listing items
  const addSerialNumber = () => {
    const itemsWithSerialNumber = teamsArray?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      typestring: item?.type === 0 ? "Public" : "Private",
      createdby: item?.createdBy?.username,
      createdat: moment(item?.createdAt).format("DD-MM-YYYY hh:mm A"),
      updatedat: moment(item?._updatedAt).format("DD-MM-YYYY hh:mm A"),
      numberofusers: item?.numberOfUsers,
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
  const columnDataTable = [

    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 100,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "name",
      headerName: "Team Name",
      flex: 0,
      width: 150,
      hide: !columnVisibility.name,
      headerClassName: "bold-header",
    },
    {
      field: "typestring",
      headerName: "Type",
      flex: 0,
      width: 150,
      hide: !columnVisibility.typestring,
      headerClassName: "bold-header",
    },
    {
      field: "createdat",
      headerName: "Created At",
      flex: 0,
      width: 180,
      hide: !columnVisibility.createdat,
      headerClassName: "bold-header",
    },
    {
      field: "createdby",
      headerName: "Created By",
      flex: 0,
      width: 150,
      hide: !columnVisibility.createdby,
      headerClassName: "bold-header",
    },
    {
      field: "updatedat",
      headerName: "Updated At",
      flex: 0,
      width: 180,
      hide: !columnVisibility.updatedat,
      headerClassName: "bold-header",
    },
    {
      field: "rooms",
      headerName: "Rooms",
      flex: 0,
      width: 100,
      hide: !columnVisibility.rooms,
      headerClassName: "bold-header",
    },
    {
      field: "numberofusers",
      headerName: "Number Of Users",
      flex: 0,
      width: 100,
      hide: !columnVisibility.numberofusers,
      headerClassName: "bold-header",
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
          {isUserRoleCompare?.includes("ecreateteam") && (
            <>
              <Button
                sx={userStyle.buttonedit}
                onClick={() => {
                  setAssetVariantEdit(params.row);
                  handleClickOpenEdit();
                }}
              >
                <EditOutlinedIcon sx={buttonStyles.buttonedit} />
              </Button>
            </>
          )}
          {/* {isUserRoleCompare?.includes("dcreateteam") && (
            <>
              {params?.row?.delete_at !== 0 && (
                <Button
                  variant="contained"
                  startIcon={<RestoreIcon />}
                  size="small"
                  sx={{
                    height: "30px",
                    width: "120px",
                    fontSize: "0.75rem",
                    padding: "5px 10px",
                    minWidth: "unset",
                  }}
                  onClick={(e) => {
                    setRestoreTeamId(params.row.id);
                    handleClickOpenRestore();
                  }}
                >
                  RESTORE
                </Button>
              )}
            </>
          )} */}
          {isUserRoleCompare?.includes("dcreateteam") && (
            <>
              <Button
                sx={userStyle.buttondelete}
                onClick={(e) => {
                  setDeleteTeamId(params.row.id);
                  handleClickOpen();
                }}
              >
                <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
              </Button>
            </>
          )}
          {isUserRoleCompare?.includes("vcreateteam") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                // getviewCode(params.row.id);
                setSingleRow(params?.row);
                handleClickOpenview();
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
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
      type: item.type,
      typestring: item?.typestring,
      createdat: item?.createdat,
      createdby: item?.createdby,
      updatedat: item?.updatedat,
      rooms: item?.rooms,
      numberofusers: item?.numberofusers,
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
      <Headtitle title={"CREATE CONNECTIONS TEAM"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Connections Team"
        modulename="Connections"
        submodulename="Create Connections Team"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />
      <>
        {isUserRoleCompare?.includes("acreateteam") && (
          <Box sx={userStyle.selectcontainer}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Add Connections Team
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Team Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Team Name"
                      value={assetVariant.name}
                      onChange={(e) => {
                        setAssetVariant({
                          ...assetVariant,
                          name: e.target.value?.trim(),
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Type <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={typeOptions}
                      value={{
                        label: assetVariant.type || "Please Select Type",
                        value: assetVariant.type || "Please Select Type",
                      }}
                      onChange={(e) => {
                        setAssetVariant({
                          ...assetVariant,
                          type: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Side Panel <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={sidePanelOptions}
                      value={selectedOptionsSidePannel}
                      onChange={(e) => {
                        handleSidePannelChange(e);
                      }}
                      valueRenderer={customValueRendererSidePannel}
                      labelledBy="Please Select Side Panel"
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <br />
              <Grid container>
                <Grid item md={3} xs={12} sm={6}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    sx={buttonStyles.buttonsubmit}
                    disabled={isBtn}
                  >
                    Submit
                  </Button>
                </Grid>
                <br />
                <Grid item md={3} xs={12} sm={6}>
                  <Button sx={buttonStyles.btncancel} onClick={handleclear}>
                    Clear
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        )}
      </>
      <br /> <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lcreateteam") && (
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
                  List Connections Team
                </Typography>
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
                      <MenuItem value={teamsArray?.length}>
                        All
                      </MenuItem>
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
                    {isUserRoleCompare?.includes("excelcreateteam") && (
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
                    {isUserRoleCompare?.includes("csvcreateteam") && (
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
                    {isUserRoleCompare?.includes("printcreateteam") && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("pdfcreateteam") && (
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
                    {isUserRoleCompare?.includes("imagecreateteam") && (
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
      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        fullWidth={true}
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Connections Team
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Team Name</Typography>
                  <Typography>{singleRow.name}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Type</Typography>
                  <Typography>{singleRow.typestring}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Created At</Typography>
                  <Typography>{singleRow.createdat}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Created By</Typography>
                  <Typography>{singleRow.createdby}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Updated At</Typography>
                  <Typography>{singleRow.updatedat}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Rooms</Typography>
                  <Typography>{singleRow.rooms}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Number Of Users</Typography>
                  <Typography>{singleRow.numberofusers}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2} sx={{ marginLeft: "-2px" }}>
              <Button
                variant="contained"
                sx={buttonStyles.btncancel}
                onClick={handleCloseview}
              >
                Back
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>
      {/* Edit DIALOG */}
      <Box>
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="sm"
          fullWidth={true}
          sx={{ marginTop: "47px" }}
        >
          <Box sx={{ padding: "20px 50px" }}>
            <>
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}>
                  Edit Connections Team
                </Typography>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Team Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Team Name"
                      value={assetVariantEdit.name}
                      onChange={(e) => {
                        setAssetVariantEdit({
                          ...assetVariantEdit,
                          name: e.target.value?.trim(),
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Type <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={typeOptions}
                      value={{
                        label: assetVariantEdit.typestring || "Please Select Type",
                        value: assetVariantEdit.typestring || "Please Select Type",
                      }}
                      onChange={(e) => {
                        setAssetVariantEdit({
                          ...assetVariantEdit,
                          typestring: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br /> <br />
              <Grid
                container
                spacing={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Grid item md={3} xs={12} sm={12}>
                  <Button
                    variant="contained"
                    onClick={editSubmit}
                    sx={buttonStyles.buttonsubmit}
                  >
                    {" "}
                    Update
                  </Button>
                </Grid>
                <br />
                <Grid item md={3} xs={12} sm={12}>
                  <Button
                    sx={buttonStyles.btncancel}
                    onClick={handleCloseModEdit}
                  >
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
        filename={"Connections Team"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={deleteTeam}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/*Team Restore ALERT DIALOG ARE YOU SURE? */}
      {/* <DeleteConfirmation
        open={isDeleteOpenRestore}
        onClose={handleCloseModRestore}
        onConfirm={restoreTeam}
        title="Are you sure, Do You Want to Restore This Team?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      /> */}
      {/* EXTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}

export default RocketchatTeam;