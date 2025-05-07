import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, Grid, IconButton, List, ListItem, ListItemText, MenuItem, Popover, Select, TextField, Typography, } from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { NotificationContainer, NotificationManager, } from "react-notifications";
import "react-notifications/lib/notifications.css";
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import PageHeading from "../../../components/PageHeading";
import { handleApiError } from "../../../components/Errorhandling";
import Headtitle from "../../../components/Headtitle";
import { AuthContext, UserRoleAccessContext, } from "../../../context/Appcontext";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
import domtoimage from 'dom-to-image';
import AlertDialog from "../../../components/Alert";
import { DeleteConfirmation } from "../../../components/DeleteConfirmation.js";
import ExportData from "../../../components/ExportData";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert";
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";

function InternDraftList() {

  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTable = useRef(null);
  const gridRefTableImg = useRef(null);

  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    //   setSubmitLoader(false);
    setOpenPopupMalert(true);
  };
  const handleClosePopupMalert = () => { setOpenPopupMalert(false); };

  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const handleClickOpenPopup = () => { setOpenPopup(true); };
  const handleClosePopup = () => { setOpenPopup(false); };

  let exportColumnNames = [
    "Status",
    "Percentage",
    "Empcode",
    "Employee Name",
    "User Name",
    "Email",
    "Branch",
    "Unit",
    "Team",
    "Experience",
    "Doj",
    "Mode",
    "Value",
    "End Exp",
    "End-Exp Date",
    "End Tar",
    "End-Tar Date",
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
    "team",
    "experience",
    "doj",
    "expmode",
    "expval",
    "endexp",
    "endexpdate",
    "endtar",
    "endtardate",
  ];

  const [employees, setEmployees] = useState([]);
  const [deleteuser, setDeleteuser] = useState([]);
  const [exceldata, setexceldata] = useState([]);
  const [useredit, setUseredit] = useState([]);

  const {
    isUserRoleCompare,
    pageName,
    isUserRoleAccess,
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
      pagename: String("Intern Draft List"),
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
  const [checkemployeelist, setcheckemployeelist] = useState(false);
  const { auth } = useContext(AuthContext);

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Copied fields Name
  const handleCopy = (message) => {
    NotificationManager.success(`${message} 👍`, "", 2000);
  };

  //image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Intern Draft List.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => { setIsFilterOpen(false); };
  const handleClosePdfFilterMod = () => { setIsPdfFilterOpen(false); };

  //Delete model
  const [isDeleteOpen, setisDeleteOpen] = useState(false);
  const handleClickOpendel = () => { setisDeleteOpen(true); };
  const handleCloseDel = () => { setisDeleteOpen(false); };

  //check delete model
  const [isCheckOpen, setisCheckOpen] = useState(false);
  const handleClickOpenCheck = () => { setisCheckOpen(true); };
  const handleCloseCheck = () => { setisCheckOpen(false); };

  // info model
  const [openInfo, setOpeninfo] = useState(false);
  const handleClickOpeninfo = () => { setOpeninfo(true); };
  const handleCloseinfo = () => { setOpeninfo(false); };

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
    team: true,
    shift: true,
    experience: true,
    doj: true,
    expmode: true,
    expval: true,
    endexp: true,
    endexpdate: true,
    endtar: true,
    endtardate: true,
    checkbox: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  let userid = deleteuser?._id;

  //set function to get particular row
  const [checkProject, setCheckProject] = useState();
  const [checkTask, setCheckTask] = useState();

  const rowData = async (id, username) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.DRAFT_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteuser(res?.data?.sdraft);
      let resdev = await axios.post(SERVICE.USERPROJECTCHECK, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        checkprojectouser: String(username),
      });
      setCheckProject(resdev?.data?.projects);

      let restask = await axios.post(SERVICE.USERTTASKCHECK, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        checkusertotask: String(username),
      });
      setCheckTask(restask?.data?.tasks);

      if (
        resdev?.data?.projects?.length > 0 ||
        restask?.data?.tasks?.length > 0
      ) {
        handleClickOpenCheck();
      } else {
        handleClickOpendel();
      }
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  let userId = localStorage?.LoginUserId;

  //get all employees list details
  const fetchEmployee = async () => {
    setPageName(!pageName);
    try {
      let res_employee = await axios.get(SERVICE.DRAFT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setcheckemployeelist(true);
      let filteredDatas = res_employee?.data?.drafts.filter((data) => {
        return data.fromwhere == "Intern";
      });
      setEmployees(filteredDatas?.map((item, index) => ({ ...item, serialNumber: index + 1 })));
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

  useEffect(() => {
    fetchEmployee();
  }, []);

  const [internDraftArray, setInternDraftArray] = useState([]);

  //get all employees list details
  const fetchInternDraftArray = async () => {
    setPageName(!pageName);
    try {
      let res_employee = await axios.get(SERVICE.DRAFT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setcheckemployeelist(true);
      let filteredDatas = res_employee?.data?.drafts.filter((data) => {
        return data.fromwhere == "Intern";
      });
      setInternDraftArray(filteredDatas);
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

  useEffect(() => {
    fetchInternDraftArray();
  }, []);

  const delAddemployee = async () => {
    setPageName(!pageName);
    try {
      let del = await axios.delete(`${SERVICE.DRAFT_SINGLE}/${userid}`, {
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
      let res = await axios.get(`${SERVICE.DRAFT_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setUseredit(res?.data?.sdraft);
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

  // Excel

  // const getexcelDatas = async () => {
  //     setPageName(!pageName);
  //     try {
  //         let res_employee = await axios.get(SERVICE.USERSEXCELDATA, {
  //             headers: {
  //                 Authorization: `Bearer ${auth.APIToken}`,
  //             },
  //         });
  //         var data =
  //             res_employee?.data?.users?.length > 0 &&
  //             res_employee.data.users.map((t, index) => {
  //                 let lastExpLog =
  //                     t?.assignExpLog?.length > 0
  //                         ? t?.assignExpLog[t?.assignExpLog?.length - 1]
  //                         : "";
  //                 return {
  //                     Sno: index + 1,
  //                     Empcode: t.empcode,
  //                     Username: t.username,
  //                     Firstname: t.firstname,
  //                     Lastname: t.lastname,
  //                     Legalname: t.legalname,
  //                     Fathername: t.fathername,
  //                     Mothername: t.mothername,
  //                     Gender: t.gender,
  //                     maritalstatus: t.maritalstatus,
  //                     dob: t.dob,
  //                     bloodgroup: t.bloodgroup,
  //                     location: t.location,
  //                     email: t.email,
  //                     contactpersonal: t.contactpersonal,
  //                     contactfamily: t.contactfamily,
  //                     emergencyno: t.emergencyno,
  //                     doj: t.doj,
  //                     expmode: lastExpLog ? lastExpLog.expmode : "",
  //                     expval: lastExpLog ? lastExpLog.expval : "",
  //                     endexp: lastExpLog ? lastExpLog.endexp : "",
  //                     endexpdate: lastExpLog ? lastExpLog.endexpdate : "",
  //                     endtar: lastExpLog ? lastExpLog.endtar : "",
  //                     endtardate: lastExpLog ? lastExpLog.endtardate : "",

  //                     contactno: t.contactno,
  //                     details: t.details,
  //                     companyname: t.companyname,
  //                     pdoorno: t.pdoorno,
  //                     pstreet: t.pstreet,
  //                     parea: t.parea,
  //                     plandmark: t.plandmark,
  //                     ptaluk: t.ptaluk,
  //                     ppincode: t.ppincode,
  //                     pcountry: t.pcountry,
  //                     pstate: t.pstate,
  //                     pcity: t.pcity,
  //                     cdoorno: t.cdoorno,
  //                     cstreet: t.cstreet,
  //                     carea: t.carea,
  //                     clandmark: t.clandmark,
  //                     ctaluk: t.ctaluk,
  //                     cpost: t.cpost,
  //                     cpincode: t.cpincode,
  //                     ccountry: t.ccountry,
  //                     cstate: t.cstate,
  //                     ccity: t.ccity,
  //                     branch: t.branch,
  //                     floor: t.floor,
  //                     department: t.department,
  //                     team: t.team,
  //                     unit: t.unit,
  //                     shifttiming: t.shifttiming,
  //                     reportingto: t.reportingto,
  //                 };
  //             });
  //         setexceldata(data);
  //     } catch (err) {
  //         handleApiError(
  //             err,
  //             setPopupContentMalert,
  //             setPopupSeverityMalert,
  //             handleClickOpenPopupMalert
  //         );
  //     }
  // };

  // useEffect(() => {
  //     getexcelDatas();
  // }, [employees]);

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Intern Draft List",
    pageStyle: "print",
  });

  const [items, setItems] = useState([]);

  const addSerialNumber = (datas) => {
    const itemsWithSerialNumber = datas?.map((item, index) => {
      let lastExpLog =
        item?.assignExpLog?.length > 0
          ? item?.assignExpLog[item?.assignExpLog?.length - 1]
          : "";

      return {
        ...item,
        serialNumber: item.serialNumber,
        percentage: item.percentage ? Math.round(item.percentage) + "%" : " ",
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
            : (new Date().getFullYear() - new Date(item.doj).getFullYear()) *
            12 +
            new Date().getMonth() -
            new Date(item.doj).getMonth() -
            (new Date(item.doj).getDate() > 2 ||
              new Date(item.doj).getDate() !== 1
              ? 1
              : 0),
        doj: moment(item.doj).format("DD-MM-YYYY"),
        expmode: lastExpLog ? lastExpLog.expmode : "",
        expval: lastExpLog ? lastExpLog.expval : "",
        endexp: lastExpLog ? lastExpLog.endexp : "",
        endexpdate: lastExpLog ? lastExpLog.endexpdate : "",
        endtar: lastExpLog ? lastExpLog.endtar : "",
        endtardate: lastExpLog ? lastExpLog.endtardate : "",
      };
    });
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber(employees);
  }, [employees]);

  //table sorting
  const [sorting, setSorting] = useState({ column: "", direction: "" });

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
      pinned: "left",
      hide: !columnVisibility.percentage,
    },
    {
      field: "empcode",
      headerName: "Empcode",
      flex: 0,
      width: 140,
      minHeight: "40px",
      pinned: "left",
      hide: !columnVisibility.empcode,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
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
                handleCopy("Copied Empcode!");
              }}
              options={{ message: "Copied Empcode!" }}
              text={params?.data?.empcode}
            >
              <ListItemText primary={params?.data?.empcode} />
            </CopyToClipboard>
          </ListItem>
        </Grid>
      ),
    },
    {
      field: "companyname",
      headerName: "Employee Name",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.companyname,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
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
                handleCopy("Copied Employee Name!");
              }}
              options={{ message: "Copied Employee Name!" }}
              text={params?.data?.companyname}
            >
              <ListItemText primary={params?.data?.companyname} />
            </CopyToClipboard>
          </ListItem>
        </Grid>
      ),
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
      field: "expmode",
      headerName: "Mode",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.expmode,
    },
    {
      field: "expval",
      headerName: "Value",
      flex: 0,
      width: 80,
      minHeight: "40px",
      hide: !columnVisibility.expval,
    },
    {
      field: "endexp",
      headerName: "End Exp",
      flex: 0,
      width: 80,
      minHeight: "40px",
      hide: !columnVisibility.endexp,
    },
    {
      field: "endexpdate",
      headerName: "End-Exp Date",
      flex: 0,
      width: 110,
      minHeight: "40px",
      hide: !columnVisibility.endexpdate,
    },
    {
      field: "endtar",
      headerName: "End Tar",
      flex: 0,
      width: 80,
      minHeight: "40px",
      hide: !columnVisibility.endtardate,
    },
    {
      field: "endtardate",
      headerName: "End-Tar Date",
      flex: 0,
      width: 110,
      minHeight: "40px",
      hide: !columnVisibility.endtardate,
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
                  {isUserRoleCompare?.includes("einterndraftlist") && (
                    <a
                      href={`/interndraft/edit/${params.data.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      <Button size="small" style={userStyle.actionbutton}>
                        <EditIcon sx={buttonStyles.buttonedit} />
                      </Button>
                    </a>
                  )}
                  {isUserRoleCompare?.includes("dinterndraftlist") && (
                    <Link to="">
                      <Button
                        size="small"
                        style={userStyle.actionbutton}
                        onClick={(e) => {
                          rowData(params.data.id, params.data.username);
                        }}
                      >
                        <DeleteIcon sx={buttonStyles.buttondelete} />
                      </Button>
                    </Link>
                  )}
                  {isUserRoleCompare?.includes("vinterndraftlist") && (
                    <a
                      href={`/draft/view/${params.data.id}/intern`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      <Button size="small" style={userStyle.actionbutton}>
                        <VisibilityIcon sx={buttonStyles.buttonview} />
                      </Button>
                    </a>
                  )}
                  {isUserRoleCompare?.includes("iinterndraftlist") && (
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
                {isUserRoleCompare?.includes("vinterndraftlist") && (
                  <Link
                    to={`/view/${params.data.id}`}
                    style={{ textDecoration: "none", color: "#fff" }}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      style={userStyle.actionbutton}
                    >
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
      empcode: item.empcode,
      nexttime: item.nexttime,
      companyname: item.companyname,
      username: item.username,
      email: item.email,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      shift: item.shift,
      percentage: item.percentage,
      experience: item?.experience,
      doj: item.doj,
      expmode: item.expmode,
      expval: item.expval,
      endexp: item.endexp,
      endexpdate: item.endexpdate,
      endtar: item.endtar,
      endtardate: item.endtardate,
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

  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem("columnVisibility");
    if (savedVisibility) {
      setColumnVisibility(JSON.parse(savedVisibility));
    }
  }, []);

  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
  }, [columnVisibility]);

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

  const [fileFormat, setFormat] = useState("");

  const fileName = "Intern Draft";

  return (
    <Box>
      <NotificationContainer />
      <Headtitle title={"INTERN DRAFT LIST"} />
      {/* ****** Header Content ****** */}

      <PageHeading
        title="Intern Draft List"
        modulename="Human Resources"
        submodulename="HR"
        mainpagename="Employee"
        subpagename="Intern details"
        subsubpagename="Intern Draft List"
      />
      <br />
      {isUserRoleCompare?.includes("linterndraftlist") && (
        <>
          <Box sx={userStyle.container}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.SubHeaderText}>
                  Intern Draft List
                </Typography>
              </Grid>
              {/* <Grid item xs={4}>
                                        {isUserRoleCompare?.includes("adraftlist") && (
                                        <>
                                            <Link
                                            to="/addemployee"
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
                                    </Grid> */}
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
                    {isUserRoleCompare?.includes("excelinterndraftlist") && (
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
                    {isUserRoleCompare?.includes("csvinterndraftlist") && (
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
                    {isUserRoleCompare?.includes("printinterndraftlist") && (
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
                    {isUserRoleCompare?.includes("pdfinterndraftlist") && (
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
                    {isUserRoleCompare?.includes("imageinterndraftlist") && (
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
              </Grid>   <br />
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

      {/* ****** Table End ****** */}

      {/* Check Modal */}
      <Box>
        <>
          <Box>
            {/* ALERT DIALOG */}
            <Dialog
              open={isCheckOpen}
              onClose={handleCloseCheck}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogContent
                sx={{
                  width: "350px",
                  textAlign: "center",
                  alignItems: "center",
                }}
              >
                <ErrorOutlineOutlinedIcon
                  sx={{ fontSize: "80px", color: "orange" }}
                />

                <Typography
                  variant="h6"
                  sx={{ color: "black", textAlign: "center" }}
                >
                  {checkProject?.length > 0 && checkTask?.length > 0 ? (
                    <>
                      <span
                        style={{ fontWeight: "700", color: "#777" }}
                      >{`${deleteuser?.username} `}</span>
                      was linked in{" "}
                      <span style={{ fontWeight: "700" }}>Project & Task</span>{" "}
                    </>
                  ) : checkProject?.length > 0 ? (
                    <>
                      <span
                        style={{ fontWeight: "700", color: "#777" }}
                      >{`${deleteuser?.username} `}</span>{" "}
                      was linked in{" "}
                      <span style={{ fontWeight: "700" }}>Project</span>
                    </>
                  ) : checkTask?.length > 0 ? (
                    <>
                      <span
                        style={{ fontWeight: "700", color: "#777" }}
                      >{`${deleteuser?.username} `}</span>{" "}
                      was linked in{" "}
                      <span style={{ fontWeight: "700" }}>Task</span>
                    </>
                  ) : (
                    ""
                  )}
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleCloseCheck}
                  autoFocus
                  variant="contained"
                  sx={buttonStyles.buttonsubmit}
                >
                  {" "}
                  OK{" "}
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </>
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
        itemsTwo={employees ?? []}
        filename={fileName}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Intern Draft Info"
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

export default InternDraftList;
