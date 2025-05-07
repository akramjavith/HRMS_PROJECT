import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import {
  Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton, List, ListItem, ListItemText, MenuItem,
  OutlinedInput, Popover, Select, TextField, Typography,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import { ThreeDots } from "react-loader-spinner";
import AlertDialog from "../../components/Alert";
import { DeleteConfirmation, PleaseSelectRow, } from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import domtoimage from 'dom-to-image';

function Group() {
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [isHandleChange, setIsHandleChange] = useState(false);
  const [searchedString, setSearchedString] = useState("");
  const gridRefTable = useRef(null);
  const gridRefTableImg = useRef(null);
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [loader, setLoader] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
    setloadingdeloverall(false);
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

  let exportColumnNames = ["Group"];
  let exportRowValues = ["name"];

  // Error Popup model
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showAlertpop, setShowAlertpop] = useState();
  const handleClickOpenerrpop = () => {
    setIsErrorOpenpop(true);
  };
  const handleCloseerrpop = () => {
    setIsErrorOpenpop(false);
  };

  const [selectedRowsGrp, setSelectedRowsGrp] = useState([]);
  const [ovProj, setOvProj] = useState("");
  const [ovProjCount, setOvProjCount] = useState("");
  const [getOverAllCount, setGetOverallCount] = useState("");
  //check delete model
  const [isCheckOpen, setisCheckOpen] = useState(false);
  const [overalldeletecheck, setOveraldeletecheck] = useState({
    under: [],
  });

  const handleClickOpenCheck = () => {
    setisCheckOpen(true);
  };
  const handleCloseCheck = () => {
    setisCheckOpen(false);
  };

  //check delete model
  const [isbulkCheckOpen, setisCheckOpenbulk] = useState(false);
  const handleClickOpenCheckbulk = () => {
    setisCheckOpenbulk(true);
  };
  const handlebulkCloseCheck = () => {

    setisCheckOpenbulk(false);
  };

  const [loadingdeloverall, setloadingdeloverall] = useState(false);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };
  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const [group, setGroup] = useState({ name: "", });
  const [groupEdit, setGroupEdit] = useState({ name: "" });
  const [groups, setGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [allGroupEdit, setAllGroupEdit] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const [openviewalert, setOpenviewalert] = useState(false);

  // view model
  const handleClickOpenviewalert = () => {
    setOpenviewalert(true);
  };
  const handleCloseviewalert = () => {
    setOpenviewalert(false);
  };

  //image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Group List.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // view model
  const [openview, setOpenview] = useState(false);

  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
  };

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
    setloadingdeloverall(false);
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

  // const handleClickOpenalert = () => {
  //   setIsHandleChange(true);
  //   if (selectedRows.length === 0) {
  //     setIsDeleteOpenalert(true);
  //   } else {
  //     setIsDeleteOpencheckbox(true);
  //   }
  // };


  const handleClickOpenalert = async () => {
    try {


      let value = [...new Set(selectedRowsGrp.flat())]
      setIsHandleChange(true);
      if (selectedRows.length === 0) {
        setIsDeleteOpenalert(true);
      } else {

        let res = await axios.post(SERVICE.OVERALL_DELETE_ACCOUNT_GROUP, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          accountname: value,
        });



        setDeleteAccGroup(res?.data?.groups)


        let under = res?.data?.groups.map(t => t.under);

        if ((res?.data?.groups).length > 0) {
          handleClickOpenCheckbulk();
          // setOveraldeletecheck({ ...overalldeletecheck, ebuse: resebuse?.data?.ebuse, ebread: resebread?.data?.ebread, ebmaterial: resebmaterial?.data?.ebmaterial })
          setOveraldeletecheck({ ...overalldeletecheck, under: [... new Set(under)] })

          setDeleteAccGroup([])

        } else {
          setIsDeleteOpencheckbox(true);
        }
      }
    }
    catch
    (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

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
    if (selectedRows.includes(params.data.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    name: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  const [deleteGroup, setDeletegroup] = useState("");
  const [deleteAccGroup, setDeleteAccGroup] = useState("");

  const rowData = async (id, name) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.GROUP_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let res1 = await axios.post(SERVICE.OVERALL_DELETE_ACCOUNT_GROUP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        accountname: [name],
      });
      setDeletegroup(res?.data?.sgroup);
      setDeleteAccGroup(res1?.data.groups)


      if (res1?.data.groups.length > 0) {
        handleClickOpenCheck();
      } else {
        handleClickOpen();
      }

    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // Alert delete popup
  let groupEditt = deleteGroup._id;
  const deleGroup = async () => {
    setPageName(!pageName)
    try {
      await axios.delete(`${SERVICE.GROUP_SINGLE}/${groupEditt}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchAllGroup();
      handleCloseMod();
      setFilteredRowData([])
      setFilteredChanges(null)
      setPage(1);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const delGroupcheckbox = async () => {
    setPageName(!pageName)
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.GROUP_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
      setIsHandleChange(false);
      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);
      setFilteredRowData([])
      setFilteredChanges(null)
      await fetchAllGroup();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };



  const delGroupcheckboxWithoutLink = async () => {
    try {
      let valfilter = [
        ...overalldeletecheck.under,
      ];

      let filtered = rowDataTable.filter(d => !valfilter.some(item => d.name === item))?.flatMap(d => selectedRows?.filter(item => d.id === item));


      const deletePromises = filtered?.map((item) => {
        return axios.delete(`${SERVICE.GROUP_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);

      handlebulkCloseCheck();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);

      await fetchAllGroup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //add function
  const sendRequest = async () => {
    setPageName(!pageName)
    try {
      let grpcreate = await axios.post(SERVICE.GROUP_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        name: String(group.name),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      setGroup(grpcreate.data);
      await fetchAllGroup();
      setGroup({ name: "" });
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setloadingdeloverall(false);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //submit option for saving
  const handleSubmit = (e) => {
    setPageName(!pageName)
    e.preventDefault();
    setloadingdeloverall(true);
    const isNameMatch = groups.some(
      (item) => item.name.toLowerCase() === group.name.toLowerCase()
    );
    if (group.name === "") {
      setPopupContentMalert("Please Enter Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Name Already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }

    else {
      sendRequest();
    }
  };

  const handleClear = () => {
    setPageName(!pageName)
    setGroup({ name: "" });
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
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
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.GROUP_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      getOverallEditSection(name);
      setOvProj(name);
      handleClickOpenEdit();
      setGroupEdit(res?.data?.sgroup);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName)

    try {
      let res = await axios.get(`${SERVICE.GROUP_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setGroupEdit(res?.data?.sgroup);
      handleClickOpenview();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.GROUP_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setGroupEdit(res?.data?.sgroup);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //Project updateby edit page...
  let updateby = groupEdit.updatedby;
  let addedby = groupEdit.addedby;
  let projectsid = groupEdit._id;


  //overall edit section for all pages
  const getOverallEditSection = async (e) => {
    try {
      let res = await axios.post(SERVICE.OVERALL_EDIT_ACCOUNT_GROUP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: e,
      });
      setOvProjCount(res?.data?.count);
      setGetOverallCount(`The ${e} is linked in
       ${res?.data?.under?.length > 0 ? "Account Group ," : ""} whether you want to do changes ..??`);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //overall edit section for all pages
  const getOverallEditSectionUpdate = async () => {
    try {
      let res = await axios.post(SERVICE.OVERALL_EDIT_ACCOUNT_GROUP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: ovProj,
      });
      sendEditRequestOverall(
        res?.data?.under,
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const sendEditRequestOverall = async (under) => {
    try {
      if (under.length > 0) {
        let answ = under.map((d, i) => {
          let res = axios.put(`${SERVICE.ACCOUNTGROUP_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            under: String(groupEdit.name),
          });
        });
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };




  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.put(`${SERVICE.GROUP_SINGLE}/${projectsid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        name: String(groupEdit.name),
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      setGroupEdit(res.data);
      await fetchGroupAll();
      await fetchAllGroup();
      getOverallEditSectionUpdate();
      handleCloseModEdit();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const editSubmit = (e) => {
    setPageName(!pageName)
    e.preventDefault();
    fetchGroupAll();
    const isNameMatch = allGroupEdit?.some(
      (item) => item?.name?.toLowerCase() === groupEdit?.name?.toLowerCase()
    );
    if (groupEdit.name === "") {
      setPopupContentMalert("Please Enter Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Name Already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (groupEdit.name != ovProj && ovProjCount > 0) {
      setShowAlertpop(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{getOverAllCount}</p>
        </>
      );
      handleClickOpenerrpop();
    }
    else {
      sendEditRequest();
    }
  };

  //get all project.
  const fetchAllGroup = async () => {
    setPageName(!pageName)
    try {
      let res_grp = await axios.get(SERVICE.GROUP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setGroups(res_grp?.data?.groups.map((item, index) => ({
        ...item,
        id: item._id,
        serialNumber: index + 1,

      })));
      setLoader(true);
    } catch (err) {
      setLoader(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //get all project.
  const fetchGroupAll = async () => {
    setPageName(!pageName)
    try {
      let res_grp = await axios.get(SERVICE.GROUP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAllGroupEdit(
        res_grp?.data?.groups.filter((item) => item._id !== groupEdit._id)
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Groupname List",
    pageStyle: "print",
  });

  useEffect(() => {
    fetchAllGroup();
  }, []);

  useEffect(() => {
    fetchGroupAll();
  }, [isEditOpen, groupEdit]);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [items, setItems] = useState([]);

  const addSerialNumber = (datas) => {
    setItems(datas);
  };

  useEffect(() => {
    addSerialNumber(groups);
  }, [groups]);

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

    {
      field: "checkbox",
      headerName: "Checkbox", // Default header name
      headerStyle: {
        fontWeight: "bold", // Apply the font-weight style to make the header text bold
        // Add any other CSS styles as needed
      },

      sortable: false, // Optionally, you can make this column not sortable
      width: 90,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
      pinned: "left",
      lockPinned: true,
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
      field: "name",
      headerName: "Group Name",
      flex: 0,
      width: 250,
      hide: !columnVisibility.name,
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
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("egroupmaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {

                getCode(params.data.id, params.data.name);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dgroupmaster") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id, params.data.name);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vgroupmaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("igroupmaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getinfoCode(params.data.id);
              }}
            >
              <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />
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
  const [fileFormat, setFormat] = useState("");

  //Access Module
  const pathname = window.location.pathname;
  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Group"),
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


  const getLinkedLabelItem = (overalldeletecheck) => {

    const { under = [] } = overalldeletecheck;
    const labels = [];

    under.forEach(item => labels.push(item));

    // Remove duplicates using a Set
    const uniqueLabels = [...new Set(labels)];

    return uniqueLabels.join(", ");
  };

  const getLinkedLabel = (overalldeletecheck) => {
    const { under = [] } = overalldeletecheck;
    const labels = [];

    if (under.length > 0) labels.push("Account Group");

    return labels.join(", ");
  };

  const getFilteredUnits = (groups, selectedRows, overalldeletecheck) => {
    const { under = [] } = overalldeletecheck;
    const allConditions = [...new Set([...under])];

    return groups.filter(d => selectedRows?.includes(d._id) && !allConditions.includes(d.name));
  };

  const shouldShowDeleteMessage = (groups, selectedRows, overalldeletecheck) => {
    return getFilteredUnits(groups, selectedRows, overalldeletecheck).length > 0;
  };

  const shouldEnableOkButton = (groups, selectedRows, overalldeletecheck) => {
    return getFilteredUnits(groups, selectedRows, overalldeletecheck).length === 0;
  };

  return (
    <Box>
      <Headtitle title={"Group"} />
      <PageHeading
        title="Group"
        modulename="Asset"
        submodulename="Master"
        mainpagename="Group Master"
        subpagename=""
        subsubpagename=""
      />

      {isUserRoleCompare?.includes("agroupmaster") && (
        <>
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Add Group Name
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter name"
                      value={group.name}
                      onChange={(e) => {
                        setGroup({ ...group, name: e.target.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2} sm={6} xs={6} marginTop={3}>
                  <LoadingButton
                    onClick={handleSubmit}
                    loading={loadingdeloverall}
                    sx={buttonStyles.buttonsubmit}
                    loadingPosition="end"
                    variant="contained"
                  >
                    Submit
                  </LoadingButton>
                </Grid>
                <Grid item md={2.5} sm={6} xs={12} marginTop={3}>
                  <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                    Clear
                  </Button>
                </Grid>
              </Grid>
              <br />
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
          maxWidth="sm"
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
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={12}>
                    <Typography sx={userStyle.HeaderText}>
                      Edit Group Name
                    </Typography>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Name <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter name"
                        value={groupEdit.name}
                        onChange={(e) => {
                          setGroupEdit({ ...groupEdit, name: e.target.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <br />

                <Grid container spacing={2}>
                  <Grid item md={6} xs={12} sm={12}>
                    <LoadingButton
                      onClick={editSubmit}
                      sx={buttonStyles.buttonsubmit}
                      loadingPosition="end"
                      variant="contained"
                    >
                      Update
                    </LoadingButton>
                  </Grid>
                  <Grid item md={6} xs={6} sm={6}>
                    <Button
                      sx={buttonStyles.btncancel}
                      onClick={handleCloseModEdit}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </>
          </Box>
        </Dialog>
      </Box>
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lgroupmaster") && (

        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Group name List
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
                    <MenuItem value={groups?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes("excelgroupmaster") && (
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
                  {isUserRoleCompare?.includes("csvgroupmaster") && (
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
                  {isUserRoleCompare?.includes("printgroupmaster") && (
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
                  {isUserRoleCompare?.includes("pdfgroupmaster") && (
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
                  {isUserRoleCompare?.includes("imagegroupmaster") && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={handleCaptureImage}
                      >
                        <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                        &ensp;Image&ensp;
                      </Button>
                    </>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={6} sm={6}>
                <Box>
                  <AggregatedSearchBar
                    columnDataTable={columnDataTable}
                    setItems={setItems}
                    addSerialNumber={addSerialNumber}
                    setPage={setPage}
                    maindatas={groups}
                    setSearchedString={setSearchedString}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    paginated={false}
                    totalDatas={groups}
                  />
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
            &ensp;
            {isUserRoleCompare?.includes("bdgroupmaster") && (
              <Button
                variant="contained"
                sx={buttonStyles.buttonbulkdelete}
                onClick={handleClickOpenalert}
              >
                Bulk Delete
              </Button>
            )}
            <br />
            {!loader ? (
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
                <AggridTable
                  rowDataTable={rowDataTable}
                  columnDataTable={columnDataTable}
                  columnVisibility={columnVisibility}
                  page={page}
                  setPage={setPage}
                  pageSize={pageSize}
                  selectedRowsGrp={selectedRowsGrp}
                  setSelectedRowsGrp={setSelectedRowsGrp}
                  totalPages={totalPages}
                  setColumnVisibility={setColumnVisibility}
                  isHandleChange={isHandleChange}
                  items={items}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                  gridRefTable={gridRefTable}
                  pagenamecheck={"Group Master"}
                  paginated={false}
                  filteredDatas={filteredDatas}
                  // totalDatas={totalDatas}
                  searchQuery={searchedString}
                  handleShowAllColumns={handleShowAllColumns}
                  setFilteredRowData={setFilteredRowData}
                  filteredRowData={filteredRowData}
                  setFilteredChanges={setFilteredChanges}
                  filteredChanges={filteredChanges}
                  gridRefTableImg={gridRefTableImg}
                  itemsList={groups}
                />
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

      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
      >
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> View Group Name</Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Name</Typography>
                  <Typography>{groupEdit.name}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                sx={buttonStyles.btncancel}
                onClick={handleCloseview}
              >
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

      {/* Reason of Leaving  */}
      <Dialog
        open={openviewalert}
        onClose={handleClickOpenviewalert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Name</Typography>
                </FormControl>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={8} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6"></Typography>

                    <FormControl size="small" fullWidth>
                      <TextField />
                    </FormControl>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={2} xs={12} sm={12}>
                <Button
                  variant="contained"
                  sx={buttonStyles.buttonsubmit}
                  onClick={handleCloseviewalert}
                >
                  Save
                </Button>
              </Grid>

              <Grid item md={0.2} xs={12} sm={12}></Grid>
              <Grid item md={2} xs={12} sm={12}>
                <Button
                  variant="contained"
                  sx={buttonStyles.btncancel}
                  onClick={handleCloseviewalert}
                >
                  {" "}
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </>
        </Box>
      </Dialog>


      <Box>

        <Dialog open={isCheckOpen} onClose={handleCloseCheck} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
            <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
              {(deleteAccGroup?.length > 0)

                ? (
                  <>
                    <span style={{ fontWeight: "700", color: "#777" }}>{`${deleteGroup.name} `}</span>was linked in <span style={{ fontWeight: "700" }}>Account Group</span>{" "}
                  </>
                )
                : (
                  ""
                )}



            </Typography>
          </DialogContent>
          <DialogActions>
            < Button onClick={handleCloseCheck} autoFocus variant="contained" color="error">
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>

        {/* checkbox bulkdelete */}
        <Dialog open={isbulkCheckOpen} onClose={handlebulkCloseCheck} aria-labelledby="alert-dialog-title" maxWidth="sm" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ textAlign: "center", alignItems: "center" }}>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
            <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
              {(overalldeletecheck.under?.length > 0) && (
                <>
                  <span style={{ fontWeight: "700", color: "#777" }}>
                    {getLinkedLabelItem(overalldeletecheck)}
                  </span>{' '}
                  was linked in{' '}
                  <span style={{ fontWeight: "700", color: "#777" }}>
                    {getLinkedLabel(overalldeletecheck)}
                  </span>
                  {shouldShowDeleteMessage(groups, selectedRows, overalldeletecheck) && (
                    <Typography>Do you want to delete others?...</Typography>
                  )}
                </>
              )}
            </Typography>
          </DialogContent>
          <DialogActions>
            {shouldEnableOkButton(groups, selectedRows, overalldeletecheck) ? (
              <Button onClick={handlebulkCloseCheck} autoFocus variant="contained" color="error"> OK </Button>
            ) : null}
            {shouldShowDeleteMessage(groups, selectedRows, overalldeletecheck) && (
              <>
                <Button onClick={delGroupcheckboxWithoutLink} variant="contained"> Yes </Button>
                <Button onClick={handlebulkCloseCheck} autoFocus variant="contained" color="error">Cancel</Button>
              </>
            )}
          </DialogActions>
        </Dialog>


        {/* overall edit */}

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
        itemsTwo={groups ?? []}
        filename={"GroupMaster"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Group Master Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={deleGroup}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={delGroupcheckbox}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/* PLEASE SELECT ANY ROW */}
      <PleaseSelectRow
        open={isDeleteOpenalert}
        onClose={handleCloseModalert}
        message="Please Select any Row"
        iconColor="orange"
        buttonText="OK"
      />
      {/* EXTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}

export default Group;
