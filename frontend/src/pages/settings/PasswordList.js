import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
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
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { NotificationContainer, NotificationManager, } from "react-notifications";
import { useReactToPrint } from "react-to-print";
import AggregatedSearchBar from '../../components/AggregatedSearchBar';
import AggridTable from "../../components/AggridTable";
import AlertDialog from "../../components/Alert";
import { handleApiError } from "../../components/Errorhandling";
import ExportData from "../../components/ExportData";
import Headtitle from "../../components/Headtitle";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import domtoimage from 'dom-to-image';
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import LoadingButton from "@mui/lab/LoadingButton";


function PasswordList() {
  const [btnLoading, setBtnLoading] = useState(false);

  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);

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
  }
  const handleCopy = (message) => {
    NotificationManager.success(`${message} 👍`, "", 2000);
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
  const [fileFormat, setFormat] = useState("");
  let exportColumnNames = ["Company", "Branch", "Unit",
    "Team", "EmployeeCode",
    "Name",
    "Updated Date Time",
    "Exp Date Time",
    "UserName",
    "Password"];
  let exportRowValues = ["company", "branch", "unit", "team",
    "empcode", "companyname",
    "updatetimedate",
    "expdatetime",
    "username",
    "originalpassword"];
  const gridRef = useRef(null);
  const [documentsList, setDocumentsList] = useState([]);
  const [documentsListForFilter, setDocumentsListForFilter] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess, allUsersData, allTeam, buttonStyles, isAssignBranch, pageName, setPageName, } = useContext(
    UserRoleAccessContext
  );
  const accessbranch = isUserRoleAccess?.role?.includes("Manager")
    ? isAssignBranch?.map((data) => ({
      branch: data.branch,
      company: data.company,
      unit: data.unit,
      branchaddress: data?.branchaddress,
    }))
    : isAssignBranch
      ?.filter((data) => {
        let fetfinalurl = [];
        if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 &&
          data?.subpagenameurl?.length !== 0 &&
          data?.subsubpagenameurl?.length !== 0 && data?.submodulenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subsubpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 &&
          data?.subpagenameurl?.length !== 0 && data?.submodulenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 && data?.submodulenameurl?.includes(window.location.pathname)
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
        branchaddress: data?.branchaddress
      }));

  const [singleDoc, setSingleDoc] = useState({});
  const [password, setPassword] = useState({
    newpassword: "",
    confirmpassword: "",
  });
  const { auth } = useContext(AuthContext);
  //Datatable
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [openInfo, setOpeninfo] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [viewInfo, setViewInfo] = useState([]);
  const [openView, setOpenView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const initialColumnVisibility = {
    actions: true,
    checkbox: true,
    serialNumber: true,
    company: true,
    branch: true,
    unit: true,
    team: true,
    empcode: true,
    companyname: true,
    username: true,
    originalpassword: true,
    updatetimedate: true,
    expdatetime: true,
    // password: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );
  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("PasswordList"),
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
  //useEffect
  useEffect(() => {
    fetchAllApproveds();
    getapi()
  }, []);
  useEffect(() => {
    fetchAllApproveds();
  }, [editOpen]);

  useEffect(() => {
    localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  useEffect(() => {
    const savedVisibility = localStorage.getItem("columnVisibility");
    if (savedVisibility) {
      setColumnVisibility(JSON.parse(savedVisibility));
    }
  }, []);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [searchedString, setSearchedString] = useState("")
  const gridRefTable = useRef(null);
  const [isHandleChange, setIsHandleChange] = useState(false);

  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Password List.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  const handleEditOpen = () => {
    setEditOpen(true);
  };
  const handleEditClose = () => {
    setEditOpen(false);
    setPassword({ newpassword: "", confirmpassword: "" });
  };
  const handlViewClose = () => {
    setOpenView(false);
  };
  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  //delete model
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };
  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  let emp_id = singleDoc._id;
  const username = isUserRoleAccess.username;
  const editSubmit = async (e) => {
    e.preventDefault();
    if (password.newpassword === "") {
      setPopupContentMalert("Please Enter New Password");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (password.confirmpassword === "") {
      setPopupContentMalert("Please Enter Confirm Password");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (password.confirmpassword !== password.newpassword) {
      setPopupContentMalert("Password Didn't Match");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendEditRequest();
    }
  };

  const sendEditRequest = async () => {
    setPageName(!pageName)
    try {

      let resSetting = await axios.get(
        `${SERVICE.GET_OVERALL_SETTINGS}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      const paswordupdateday = resSetting?.data?.overallsettings?.[0]?.passwordupdatedays ?? "0";

      await axios.put(`${SERVICE.SINGLE_USER_PASS}/${emp_id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        password: String(password.newpassword),
        originalpassword: String(password.newpassword),
        passexpdate: new Date(new Date().setDate(new Date().getDate() + Number(paswordupdateday))),
        updatedby: [
          ...updateby,
          { name: String(username), date: String(new Date()) },
        ],
      });

      if (singleDoc?.rocketchatid) {
        let res = await axios.put(
          `${SERVICE.UPDATE_ROCKETCHAT_USER_DETAILS}`,
          {
            id: String(singleDoc?.rocketchatid),
            employeeid: emp_id,
            password: String(password.newpassword),
          },
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          }
        );
      }

      let companyEmailArray = singleDoc?.companyemail?.split(",")
      if (companyEmailArray?.length) {
        try {
          let domainUpdate = await axios.post(
            SERVICE.UPDATEDOMAINMAILUSERPASSWORD,
            {
              usernames: companyEmailArray,
              password: String(password.originalpassword),
            }
          );
          console.log("Password Changed Successfully in post fix")

        } catch (error) {
          console.log(error, "Error Changing password in post fix")
        }
      }




      await fetchAllApproveds();
      setPassword({ newpassword: "", confirmpassword: "" });

      handleEditClose();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);; }
  };

  //Project updateby edit page...
  let updateby = singleDoc.updatedby;
  let addedby = viewInfo.addedby;
  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };
  // Excel
  const fileName = "Password List";
  // get particular columns for export excel
  const getinfoCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.SINGLE_USER_PASS}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleDoc(res?.data?.suser);
      handleEditOpen();

    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);; }
  };
  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Password List",
    pageStyle: "print",
  });
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
    setPage(1);
  };

  const [items, setItems] = useState([]);

  const addSerialNumber = (datas) => {
    setItems(datas);
  };
  useEffect(() => {
    addSerialNumber(documentsList);
  }, [documentsList]);


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
  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }
  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );
  const columnDataTable = [
    {
      field: "serialNumber",
      headerName: "S.No",
      flex: 0,
      width: 90,
      minHeight: "40px",
      hide: !columnVisibility.serialNumber,
      pinned: 'left', lockPinned: true,

    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 140,
      minHeight: "40px",
      hide: !columnVisibility.company,
      pinned: 'left',

    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 140,
      minHeight: "40px",
      hide: !columnVisibility.branch,
      pinned: 'left',

    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 140,
      minHeight: "40px",
      hide: !columnVisibility.unit,
    },
    {
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 140,
      minHeight: "40px",
      hide: !columnVisibility.team,
    },
    {
      field: "empcode",
      headerName: "Employee Code",
      flex: 0,
      width: 140,
      minHeight: "40px",
      hide: !columnVisibility.empcode,
    },
    {
      field: "companyname",
      headerName: "Name",
      flex: 0,
      width: 190,
      minHeight: "40px",
      hide: !columnVisibility.companyname,
    },
    {
      field: "updatetimedate",
      headerName: "Updated Date Time",
      flex: 0,
      width: 190,
      minHeight: "40px",
      hide: !columnVisibility.updatetimedate,
    },
    {
      field: "expdatetime",
      headerName: "Exp Date Time",
      flex: 0,
      width: 190,
      minHeight: "40px",
      hide: !columnVisibility.expdatetime,
    },
    {
      field: "username",
      headerName: "Username",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.username,
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          <ListItem
            sx={{
              "&:hover": {
                cursor: "pointer",
                color: "blue",
                textDecoration: "underline",
              },
            }}
          >
            <CopyToClipboard
              onCopy={() => {
                handleCopy("Copied UserName!");
              }}
              options={{ message: "Copied  UserName!" }}
              text={params?.data?.username}
            >
              <ListItemText primary={params?.data?.username} />
            </CopyToClipboard>
          </ListItem>
        </Grid>
      ),
    },
    {
      field: "originalpassword",
      headerName: "Password",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.originalpassword,
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          <ListItem
            sx={{
              "&:hover": {
                cursor: "pointer",
                color: "blue",
                textDecoration: "underline",
              },
            }}
          >
            <CopyToClipboard
              onCopy={() => {
                handleCopy("Copied password!");
              }}
              options={{ message: "Copied  password!" }}
              text={params?.data?.originalpassword}
            >
              <ListItemText primary={params?.data?.originalpassword} />
            </CopyToClipboard>
          </ListItem>
        </Grid>
      ),
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 250,
      sortable: false,
      hide: !columnVisibility.actions,
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {/* {isUserRoleCompare?.includes("epasswordlist") ?  */}
          <Button
            variant="contained"
            sx={{ maxHeight: "30px" }}
            onClick={() => {
              getinfoCode(params.data.id);
            }}
          >
            Change
          </Button>
          {/* : ""} */}
        </Grid>
      ),
    },
  ];
  const rowDataTable = filteredData.map((item) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      empcode: item.empcode,
      companyname: item.companyname,
      username: item.username,
      originalpassword: item.originalpassword,
      expdatetime: item.expdatetime,
      updatetimedate: item.updatetimedate,
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
          {filteredColumns.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={
                  <Switch
                    sx={{ marginTop: "-10px" }}
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
    </div>
  );
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  const [filterState, setFilterState] = useState({
    type: "Individual",
  });

  const TypeOptions = [
    { label: "Individual", value: "Individual" },
    { label: "Department", value: "Department" },
    { label: "Company", value: "Company" },
    { label: "Branch", value: "Branch" },
    { label: "Unit", value: "Unit" },
    { label: "Team", value: "Team" },
  ];
  //company multiselect
  const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
  let [valueCompanyCat, setValueCompanyCat] = useState([]);

  const handleCompanyChange = (options) => {
    setValueCompanyCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCompany(options);
    setValueBranchCat([]);
    setSelectedOptionsBranch([]);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
  };

  const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
    return valueCompanyCat?.length
      ? valueCompanyCat.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
  };

  //branch multiselect
  const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
  let [valueBranchCat, setValueBranchCat] = useState([]);

  const handleBranchChange = (options) => {
    setValueBranchCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBranch(options);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
  };

  const customValueRendererBranch = (valueBranchCat, _categoryname) => {
    return valueBranchCat?.length
      ? valueBranchCat.map(({ label }) => label)?.join(", ")
      : "Please Select Branch";
  };

  //unit multiselect
  const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
  let [valueUnitCat, setValueUnitCat] = useState([]);

  const handleUnitChange = (options) => {
    setValueUnitCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsUnit(options);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
  };

  const customValueRendererUnit = (valueUnitCat, _categoryname) => {
    return valueUnitCat?.length
      ? valueUnitCat.map(({ label }) => label)?.join(", ")
      : "Please Select Unit";
  };

  //team multiselect
  const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
  let [valueTeamCat, setValueTeamCat] = useState([]);

  const handleTeamChange = (options) => {
    setValueTeamCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsTeam(options);
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
  };

  const customValueRendererTeam = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length
      ? valueTeamCat.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };

  //department multiselect
  const [selectedOptionsDepartment, setSelectedOptionsDepartment] = useState(
    []
  );
  let [valueDepartmentCat, setValueDepartmentCat] = useState([]);

  const handleDepartmentChange = (options) => {
    setValueDepartmentCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsDepartment(options);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
  };

  const customValueRendererDepartment = (valueDepartmentCat, _categoryname) => {
    return valueDepartmentCat?.length
      ? valueDepartmentCat.map(({ label }) => label)?.join(", ")
      : "Please Select Department";
  };
  //employee multiselect
  const [selectedOptionsEmployee, setSelectedOptionsEmployee] = useState([]);
  let [valueEmployeeCat, setValueEmployeeCat] = useState([]);

  const handleEmployeeChange = (options) => {
    setValueEmployeeCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsEmployee(options);
  };

  const customValueRendererEmployee = (valueEmployeeCat, _categoryname) => {
    return valueEmployeeCat?.length
      ? valueEmployeeCat.map(({ label }) => label)?.join(", ")
      : "Please Select Employee";
  };

  useEffect(() => {
    fetchDepartments();
  }, []);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const fetchDepartments = async () => {
    try {
      let req = await axios.get(SERVICE.DEPARTMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDepartmentOptions(
        req?.data?.departmentdetails?.map((data) => ({
          label: data?.deptname,
          value: data?.deptname,
        }))
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const TypeCompany = allUsersData
    ?.filter(
      (u) =>
        valueCompanyCat?.includes(u.company)
    )
    .map((u) => ({
      ...u,
      label: u.companyname,
      value: u.companyname,
    }))

  const TypeBranch = allUsersData
    ?.filter(
      (u) =>
        valueCompanyCat?.includes(u.company) &&
        valueBranchCat?.includes(u.branch)
    )
    .map((u) => ({
      ...u,
      label: u.companyname,
      value: u.companyname,
    }))

  const TypeUnit = allUsersData
    ?.filter(
      (u) =>
        valueCompanyCat?.includes(u.company) &&
        valueBranchCat?.includes(u.branch) &&
        valueUnitCat?.includes(u.unit)
    )
    .map((u) => ({
      ...u,
      label: u.companyname,
      value: u.companyname,
    }))

  const TypeTeam = allUsersData
    ?.filter(
      (u) =>
        valueCompanyCat?.includes(u.company) &&
        valueBranchCat?.includes(u.branch) &&
        valueUnitCat?.includes(u.unit) &&
        valueTeamCat?.includes(u.team)
    )
    .map((u) => ({
      ...u,
      label: u.companyname,
      value: u.companyname,
    }))

  const TypeDepart = allUsersData
    ?.filter(
      (u) =>
        valueCompanyCat?.includes(u.company) &&
        valueDepartmentCat?.includes(u.department)
    )
    .map((u) => ({
      ...u,
      label: u.companyname,
      value: u.companyname,
    }))

  const TypeEmployee = allUsersData
    ?.filter(
      (u) =>
        valueCompanyCat?.includes(u.company) &&
        valueBranchCat?.includes(u.branch) &&
        valueUnitCat?.includes(u.unit) &&
        valueTeamCat?.includes(u.team) &&
        valueEmployeeCat?.includes(u.companyname)
    )
    .map((u) => ({
      ...u,
      label: u.companyname,
      value: u.companyname,
    }))

  const filterEmployee = filterState?.type === "Individual" ?
    TypeEmployee : filterState?.type === "Department" ? TypeDepart : filterState?.type === "Company" ?
      TypeCompany : filterState?.type === "Branch" ? TypeBranch : filterState?.type === "Unit" ?
        TypeUnit : filterState?.type === "Team" ? TypeTeam : []

  //auto select all dropdowns
  const [allAssignCompany, setAllAssignCompany] = useState([]);
  const [allAssignBranch, setAllAssignBranch] = useState([]);
  const [allAssignUnit, setAllAssignUnit] = useState([]);
  const handleAutoSelect = async () => {
    setPageName(!pageName);
    try {
      let selectedValues = accessbranch
        ?.map((data) => ({
          company: data.company,
          branch: data.branch,
          unit: data.unit,
        }))
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.company === value.company &&
                t.branch === value.branch &&
                t.unit === value.unit
            )
        );
      let selectedCompany = selectedValues
        ?.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.company === value.company)
        )
        .map((a, index) => {
          return a.company;
        });

      let mappedCompany = selectedValues
        ?.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.company === value.company)
        )
        ?.map((data) => ({
          label: data?.company,
          value: data?.company,
        }));

      setValueCompanyCat(selectedCompany);
      setSelectedOptionsCompany(mappedCompany);

      let selectedBranch = selectedValues
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) => t.company === value.company && t.branch === value.branch
            )
        )
        .map((a, index) => {
          return a.branch;
        });

      let mappedBranch = selectedValues
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) => t.company === value.company && t.branch === value.branch
            )
        )
        ?.map((data) => ({
          label: data?.branch,
          value: data?.branch,
        }));

      setValueBranchCat(selectedBranch);
      setSelectedOptionsBranch(mappedBranch);

      let selectedUnit = selectedValues
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.company === value.company &&
                t.branch === value.branch &&
                t.unit === value.unit
            )
        )
        .map((a, index) => {
          return a.unit;
        });

      let mappedUnit = selectedValues
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.company === value.company &&
                t.branch === value.branch &&
                t.unit === value.unit
            )
        )
        ?.map((data) => ({
          label: data?.unit,
          value: data?.unit,
        }));

      setValueUnitCat(selectedUnit);
      setSelectedOptionsUnit(mappedUnit);

      let mappedTeam = allTeam
        ?.filter(
          (u) =>
            selectedCompany?.includes(u.company) &&
            selectedBranch?.includes(u.branch) &&
            selectedUnit?.includes(u.unit)
        )
        .map((u) => ({
          label: u.teamname,
          value: u.teamname,
        }));

      let selectedTeam = allTeam
        ?.filter(
          (u) =>
            selectedCompany?.includes(u.company) &&
            selectedBranch?.includes(u.branch) &&
            selectedUnit?.includes(u.unit)
        )
        .map((u) => u.teamname);

      let mappedemployees = allUsersData
        ?.filter(
          (u) =>
            selectedCompany?.includes(u.company) &&
            selectedBranch?.includes(u.branch) &&
            selectedUnit?.includes(u.unit) &&
            selectedTeam?.includes(u.team)
        )
        .map((u) => ({
          label: u.companyname,
          value: u.companyname,
        }));

      let employees = allUsersData
        ?.filter(
          (u) =>
            selectedCompany?.includes(u.company) &&
            selectedBranch?.includes(u.branch) &&
            selectedUnit?.includes(u.unit) &&
            selectedTeam?.includes(u.team)
        )
        .map((u) => u.companyname);
      setValueTeamCat(selectedTeam);
      setSelectedOptionsTeam(mappedTeam);
      setAllAssignCompany(selectedCompany);

      setAllAssignBranch(selectedBranch);

      setAllAssignUnit(selectedUnit);

      setValueEmployeeCat(employees);
      setSelectedOptionsEmployee(mappedemployees);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  useEffect(() => {
    handleAutoSelect();
  }, [isAssignBranch]);

  const handleSubmit = (e) => {
    e.preventDefault()

    const filterEmployee = filterState?.type === "Individual" ?
      TypeEmployee : filterState?.type === "Department" ? TypeDepart : filterState?.type === "Company" ?
        TypeCompany : filterState?.type === "Branch" ? TypeBranch : filterState?.type === "Unit" ?
          TypeUnit : filterState?.type === "Team" ? TypeTeam : []

    if (selectedOptionsCompany?.length === 0) {
      setPopupContentMalert("Please Select Company");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      ["Individual", "Branch", "Unit", "Team"]?.includes(filterState?.type) &&
      selectedOptionsBranch?.length === 0
    ) {
      setPopupContentMalert("Please Select Branch");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      ["Individual", "Unit", "Team"]?.includes(filterState?.type) &&
      selectedOptionsUnit?.length === 0
    ) {
      setPopupContentMalert("Please Select Unit");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      ["Individual", "Team"]?.includes(filterState?.type) &&
      selectedOptionsTeam?.length === 0
    ) {
      setPopupContentMalert("Please Select Team");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      filterState?.type === "Individual" &&
      selectedOptionsEmployee?.length === 0
    ) {
      setPopupContentMalert("Please Select Employee Names");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      filterState?.type === "Department" &&
      selectedOptionsDepartment?.length === 0
    ) {
      setPopupContentMalert("Please Select Department!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      const IsFilteredData = documentsListForFilter?.filter((item) =>
        filterEmployee?.some((emp) =>
          emp?.company === item?.company &&
          emp?.branch === item?.branch &&
          emp?.unit === item?.unit &&
          emp?.team === item?.team &&
          emp?.companyname === item?.companyname
        )
      );


      setDocumentsList(IsFilteredData?.map((item, index) => {
        const options = {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        };

        // Process `updatedby`
        const lastUpdated = item.updatedby?.[item.updatedby.length - 1]?.date;
        let dateUpd = lastUpdated ? new Date(lastUpdated) : null;
        if (dateUpd && isNaN(dateUpd)) {
          console.warn('Invalid lastUpdated format:', lastUpdated);
          dateUpd = null;
        }

        // Process `passexpdate`
        const Expdate = item.passexpdate;
        let dateExp = Expdate ? new Date(Expdate) : null;
        if (dateExp && isNaN(dateExp)) {
          console.warn('Invalid Expdate format:', Expdate);
          dateExp = null;
        }

        // Create formatted dates
        const formattedExpDate = dateExp
          ? new Intl.DateTimeFormat('en-IN', options).format(dateExp)
          : null;

        const formattedUpdDate = dateUpd
          ? new Intl.DateTimeFormat('en-IN', options).format(dateUpd)
          : null;

        return {
          ...item,
          serialNumber: index + 1,
          expdatetime: formattedExpDate,
          updatetimedate: formattedUpdDate,
        };
      }));

    }

  }

  //get all project.
  const fetchAllApproveds = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.post(SERVICE.ALL_USER_PASSASSIGNBRANCH, {
        assignbranch: accessbranch
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDocumentsListForFilter(res?.data?.users);
      if (rowDataTable?.length > 0) {
        const filterEmployee = filterState?.type === "Individual"
          ? TypeEmployee
          : filterState?.type === "Department"
            ? TypeDepart
            : filterState?.type === "Company"
              ? TypeCompany
              : filterState?.type === "Branch"
                ? TypeBranch
                : filterState?.type === "Unit"
                  ? TypeUnit
                  : filterState?.type === "Team"
                    ? TypeTeam
                    : [];

        const IsFilteredData = res?.data?.users?.filter((item) =>
          filterEmployee?.some((emp) =>
            emp?.company === item?.company &&
            emp?.branch === item?.branch &&
            emp?.unit === item?.unit &&
            emp?.team === item?.team &&
            emp?.companyname === item?.companyname
          )
        );

        setDocumentsList(
          IsFilteredData?.map((item, index) => {
            const options = {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            };

            // Process `updatedby`
            const lastUpdated = item.updatedby?.[item.updatedby.length - 1]?.date;
            let dateUpd = lastUpdated ? new Date(lastUpdated) : null;
            if (dateUpd && isNaN(dateUpd)) {
              console.warn('Invalid lastUpdated format:', lastUpdated);
              dateUpd = null;
            }

            // Process `passexpdate`
            const Expdate = item.passexpdate;
            let dateExp = Expdate ? new Date(Expdate) : null;
            if (dateExp && isNaN(dateExp)) {
              console.warn('Invalid Expdate format:', Expdate);
              dateExp = null;
            }

            // Create formatted dates
            const formattedExpDate = dateExp
              ? new Intl.DateTimeFormat('en-IN', options).format(dateExp)
              : null;

            const formattedUpdDate = dateUpd
              ? new Intl.DateTimeFormat('en-IN', options).format(dateUpd)
              : null;

            return {
              ...item,
              serialNumber: index + 1,
              expdatetime: formattedExpDate,
              updatetimedate: formattedUpdDate,
            };
          })
        );
      }

      setLoading(true);
    } catch (err) {
      setLoading(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);;
    }
  };

  //MULTISELECT ONCHANGE END
  const handleclear = () => {
    setValueCompanyCat([]);
    setSelectedOptionsCompany([]);
    setValueBranchCat([]);
    setSelectedOptionsBranch([]);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
    setSelectedOptionsEmployee([]);
    setDocumentsList([])
    setFilterState({
      type: "Individual",
    });

    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  return (
    <Box>
      <NotificationContainer />
      <Headtitle title={"PASSWORD LIST"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Password List"
        modulename="Settings"
        submodulename="Password List"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("apasswordlist") && (
        <Box sx={userStyle.selectcontainer}>
          <>
            <Grid container spacing={2}>

              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Type<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    options={TypeOptions}
                    // styles={colourStyles}
                    value={{
                      label: filterState.type ?? "Please Select Type",
                      value: filterState.type ?? "Please Select Type",
                    }}
                    onChange={(e) => {
                      setFilterState((prev) => ({
                        ...prev,
                        type: e.value,
                      }));
                      setValueCompanyCat([]);
                      setSelectedOptionsCompany([]);
                      setValueBranchCat([]);
                      setSelectedOptionsBranch([]);
                      setValueUnitCat([]);
                      setSelectedOptionsUnit([]);
                      setValueTeamCat([]);
                      setSelectedOptionsTeam([]);
                      setValueDepartmentCat([]);
                      setSelectedOptionsDepartment([]);
                      setValueEmployeeCat([]);
                      setSelectedOptionsEmployee([]);
                      setDocumentsList([])
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <Typography>
                  Company<b style={{ color: "red" }}>*</b>
                </Typography>
                <FormControl size="small" fullWidth>
                  <MultiSelect
                    options={accessbranch
                      ?.map((data) => ({
                        label: data.company,
                        value: data.company,
                      }))
                      .filter((item, index, self) => {
                        return (
                          self.findIndex(
                            (i) =>
                              i.label === item.label && i.value === item.value
                          ) === index
                        );
                      })}
                    value={selectedOptionsCompany}
                    onChange={(e) => {
                      handleCompanyChange(e);
                    }}
                    valueRenderer={customValueRendererCompany}
                    labelledBy="Please Select Company"
                  />
                </FormControl>
              </Grid>
              {["Individual", "Team"]?.includes(filterState.type) ? (
                <>
                  {/* Branch Unit Team */}
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        {" "}
                        Branch <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={accessbranch
                          ?.filter((comp) =>
                            valueCompanyCat?.includes(comp.company)
                          )
                          ?.map((data) => ({
                            label: data.branch,
                            value: data.branch,
                          }))
                          .filter((item, index, self) => {
                            return (
                              self.findIndex(
                                (i) =>
                                  i.label === item.label &&
                                  i.value === item.value
                              ) === index
                            );
                          })}
                        value={selectedOptionsBranch}
                        onChange={(e) => {
                          handleBranchChange(e);
                        }}
                        valueRenderer={customValueRendererBranch}
                        labelledBy="Please Select Branch"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        {" "}
                        Unit<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={accessbranch
                          ?.filter(
                            (comp) =>
                              valueCompanyCat?.includes(comp.company) &&
                              valueBranchCat?.includes(comp.branch)
                          )
                          ?.map((data) => ({
                            label: data.unit,
                            value: data.unit,
                          }))
                          .filter((item, index, self) => {
                            return (
                              self.findIndex(
                                (i) =>
                                  i.label === item.label &&
                                  i.value === item.value
                              ) === index
                            );
                          })}
                        value={selectedOptionsUnit}
                        onChange={(e) => {
                          handleUnitChange(e);
                        }}
                        valueRenderer={customValueRendererUnit}
                        labelledBy="Please Select Unit"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Team<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={allTeam
                          ?.filter(
                            (u) =>
                              valueCompanyCat?.includes(u.company) &&
                              valueBranchCat?.includes(u.branch) &&
                              valueUnitCat?.includes(u.unit)
                          )
                          .map((u) => ({
                            ...u,
                            label: u.teamname,
                            value: u.teamname,
                          }))}
                        value={selectedOptionsTeam}
                        onChange={(e) => {
                          handleTeamChange(e);
                        }}
                        valueRenderer={customValueRendererTeam}
                        labelledBy="Please Select Team"
                      />
                    </FormControl>
                  </Grid>
                </>
              ) : ["Department"]?.includes(filterState.type) ? (
                <>
                  {/* Department */}
                  <Grid item md={3} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Department<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={departmentOptions}
                        value={selectedOptionsDepartment}
                        onChange={(e) => {
                          handleDepartmentChange(e);
                        }}
                        valueRenderer={customValueRendererDepartment}
                        labelledBy="Please Select Department"
                      />
                    </FormControl>
                  </Grid>
                </>
              ) : ["Branch"]?.includes(filterState.type) ? (
                <>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        {" "}
                        Branch <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={accessbranch
                          ?.filter((comp) =>
                            valueCompanyCat?.includes(comp.company)
                          )
                          ?.map((data) => ({
                            label: data.branch,
                            value: data.branch,
                          }))
                          .filter((item, index, self) => {
                            return (
                              self.findIndex(
                                (i) =>
                                  i.label === item.label &&
                                  i.value === item.value
                              ) === index
                            );
                          })}
                        value={selectedOptionsBranch}
                        onChange={(e) => {
                          handleBranchChange(e);
                        }}
                        valueRenderer={customValueRendererBranch}
                        labelledBy="Please Select Branch"
                      />
                    </FormControl>
                  </Grid>
                </>
              ) : ["Unit"]?.includes(filterState.type) ? (
                <>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        {" "}
                        Branch<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={accessbranch
                          ?.filter((comp) =>
                            valueCompanyCat?.includes(comp.company)
                          )
                          ?.map((data) => ({
                            label: data.branch,
                            value: data.branch,
                          }))
                          .filter((item, index, self) => {
                            return (
                              self.findIndex(
                                (i) =>
                                  i.label === item.label &&
                                  i.value === item.value
                              ) === index
                            );
                          })}
                        value={selectedOptionsBranch}
                        onChange={(e) => {
                          handleBranchChange(e);
                        }}
                        valueRenderer={customValueRendererBranch}
                        labelledBy="Please Select Branch"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        {" "}
                        Unit <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={accessbranch
                          ?.filter(
                            (comp) =>
                              valueCompanyCat?.includes(comp.company) &&
                              valueBranchCat?.includes(comp.branch)
                          )
                          ?.map((data) => ({
                            label: data.unit,
                            value: data.unit,
                          }))
                          .filter((item, index, self) => {
                            return (
                              self.findIndex(
                                (i) =>
                                  i.label === item.label &&
                                  i.value === item.value
                              ) === index
                            );
                          })}
                        value={selectedOptionsUnit}
                        onChange={(e) => {
                          handleUnitChange(e);
                        }}
                        valueRenderer={customValueRendererUnit}
                        labelledBy="Please Select Unit"
                      />
                    </FormControl>
                  </Grid>
                </>
              ) : (
                ""
              )}
              {["Individual"]?.includes(filterState.type) && (
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Employee<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={allUsersData
                        ?.filter(
                          (u) =>
                            valueCompanyCat?.includes(u.company) &&
                            valueBranchCat?.includes(u.branch) &&
                            valueUnitCat?.includes(u.unit) &&
                            valueTeamCat?.includes(u.team)
                        )
                        .map((u) => ({
                          label: u.companyname,
                          value: u.companyname,
                        }))}
                      value={selectedOptionsEmployee}
                      onChange={(e) => {
                        handleEmployeeChange(e);
                      }}
                      valueRenderer={customValueRendererEmployee}
                      labelledBy="Please Select Employee"
                    />
                  </FormControl>
                </Grid>
              )}



              <Grid item md={3} xs={12} sm={6}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignContent: "end",
                  alignItems: "end"
                }}>
                <Grid>
                  <LoadingButton
                    loading={btnLoading}
                    sx={buttonStyles.buttonsubmit}
                    onClick={handleSubmit}
                  >
                    Filter
                  </LoadingButton>
                  &nbsp;
                  &nbsp;
                  <Button sx={buttonStyles.btncancel} onClick={handleclear}>
                    {" "}
                    Clear{" "}
                  </Button>
                </Grid>
              </Grid>
              <br />
              <br />
              <br />

            </Grid>
          </>
        </Box>
      )}
      <br />

      {isUserRoleCompare?.includes("lpasswordlist") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  Password List
                </Typography>
              </Grid>
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
              <Grid>
                {isUserRoleCompare?.includes("excelpasswordlist") && (
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
                {isUserRoleCompare?.includes("csvpasswordlist") && (
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
                {isUserRoleCompare?.includes("printpasswordlist") && (
                  <>
                    <Button sx={userStyle.buttongrp} onClick={handleprint}>
                      &ensp;
                      <FaPrint />
                      &ensp;Print&ensp;
                    </Button>
                  </>
                )}
                {isUserRoleCompare?.includes("pdfpasswordlist") && (
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
                {isUserRoleCompare?.includes("imagepasswordlist") && (
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
            {/* ****** Table Grid Container ****** */}
            <Grid style={userStyle.dataTablestyle}>
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
                  <MenuItem value={documentsList?.length}>All</MenuItem>
                </Select>
              </Box>

              <Grid item md={2} xs={6} sm={6}>

                <AggregatedSearchBar
                  columnDataTable={columnDataTable}
                  setItems={setItems}
                  addSerialNumber={addSerialNumber}
                  setPage={setPage}
                  maindatas={documentsList}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                  totalDatas={documentsList}

                />
              </Grid>
            </Grid>
            <Button
              sx={userStyle.buttongrp}
              onClick={() => {
                handleShowAllColumns();
                setColumnVisibility(initialColumnVisibility);
              }}
            >
              Show All Columns
            </Button>
            &emsp;
            <Button
              sx={userStyle.buttongrp}
              onClick={handleOpenManageColumns}
            >
              Manage Columns
            </Button>
            <br />
            <br />
            {!loading ? (
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
              <>
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
                  paginated={false}
                  filteredDatas={filteredDatas}
                  // totalDatas={totalProjects}
                  searchQuery={searchedString}
                  handleShowAllColumns={handleShowAllColumns}
                  setFilteredRowData={setFilteredRowData}
                  filteredRowData={filteredRowData}
                  setFilteredChanges={setFilteredChanges}
                  filteredChanges={filteredChanges}
                  gridRefTableImg={gridRefTableImg}
                  itemsList={documentsList}

                />
              </>
            )}
            {/* ****** Table start ****** */}
            {/* ****** Table End ****** */}
          </Box>
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

        </>
      )}
      {/* view model */}
      <Dialog
        open={openView}
        onClose={handlViewClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box sx={{ width: "500px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Password List
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Employee Code</Typography>
                  <Typography>{singleDoc.empcode}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Name</Typography>
                  <Typography>{singleDoc.companyname}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handlViewClose}
              >
                Back
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>
      {/* alert dialog */}
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
              {" "}
              ok{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      {/* Edit DIALOG */}
      <Box>
        <Dialog
          open={editOpen}
          onClose={handleEditClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="sm"
          fullWidth={true}
        >
          <Box sx={{ padding: "20px 50px" }}>
            <>
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}>
                  Change Password
                </Typography>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Username<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Username"
                      value={singleDoc.username}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Old Password<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Old Password"
                      value={singleDoc.originalpassword}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      New Password<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter New Password"
                      value={password.newpassword}
                      onChange={(e) => {
                        setPassword({
                          ...password,
                          newpassword: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Confirm Password<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Confirm Password"
                      value={password.confirmpassword}
                      onChange={(e) => {
                        setPassword({
                          ...password,
                          confirmpassword: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>{" "}
              <br /> <br /> <br />
              <Grid container spacing={2}></Grid>
              <DialogActions>
                <Button
                  variant="contained"
                  onClick={editSubmit}
                  sx={buttonStyles.buttonsubmit}                >
                  {" "}
                  Update
                </Button>
                <Button sx={buttonStyles.btncancel} onClick={handleEditClose}>
                  {" "}
                  Cancel{" "}
                </Button>
              </DialogActions>
            </>
          </Box>
        </Dialog>
      </Box>
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
      {/* EXTERNAL COMPONENTS -------------- END */}
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
        itemsTwo={documentsList ?? []}
        filename={"Password List"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
    </Box>
  );
}
export default PasswordList;