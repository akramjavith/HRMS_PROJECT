import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Popover, TextField, IconButton, Switch, List, ListItem, ListItemText, Checkbox, Box, Typography, Dialog,
  Select, TableCell, MenuItem, TableBody, DialogContent, DialogActions, Grid, Paper, Table, TableHead, TableContainer,
  Button,
} from "@mui/material";
import { handleApiError } from "../../components/Errorhandling";
import { userStyle } from "../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import { ThreeDots } from "react-loader-spinner";
import { SERVICE } from "../../services/Baseservice";
import jsPDF from "jspdf";
import { Link } from "react-router-dom";
import axios from "axios";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import moment from "moment-timezone";
import { UserRoleAccessContext, AuthContext } from "../../context/Appcontext";
import "jspdf-autotable";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import Headtitle from "../../components/Headtitle";
import PageHeading from "../../components/PageHeading";
import { useNavigate } from "react-router-dom";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import Pagination from "../../components/Pagination";
import AlertDialog from "../../components/Alert";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import domtoimage from 'dom-to-image';
import ExportData from "../../components/ExportData";

function ClientSupportList() {
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
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
    "Client Name",
    "Auto Id",
    "Reference Id",
    "Status",
    "Mode",
    "Priority",
    "Module",
    "Sub Module",
    "Main Page",
    "Sub Page",
    "Sub Sub-Page",
    "Category",
    "Sub Category",
    "Created Date",
    "Created Time",
    "Created By",
    "Company",
    "Email",
    "Contact No",
  ];
  let exportRowValues = [
    "clientname",
    "autoid",
    "uniqueId",
    "status",
    "mode",
    "priority",
    "modulename",
    "submodulename",
    "mainpagename",
    "subpagename",
    "subsubpagename",
    "category",
    "subcategory",
    "createddate",
    "createdtime",
    "createdby",
    "createdbycompany",
    "createdbyemail",
    "createdbycontactnumber",
  ];

  const [totalProjects, setTotalProjects] = useState(0);
  // const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();

  const exportallData = async () => {
    setPageName(!pageName);
    try {
      let res_branch = await axios.get(
        `${SERVICE.CLIENTSUPPORT_OVERALLEXPORT}/?page=${page}&&limit=${pageSize}&&role=${isUserRoleAccess?.role}&&userid=${isUserRoleAccess?._id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      let data = res_branch?.data?.raises?.map((item, index) => ({
        ...item,
        createddate: moment(item?.createdAt).format("DD-MM-YYYY"),
        createdtime: moment(item?.createdAt).format("hh:mm:ss A"),
      }));
      return data;
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
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



  const [loading, setLoading] = useState(false);
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
      pagename: String("Client Support List"),
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
  const { auth } = useContext(AuthContext);
  const [selectedRows, setSelectedRows] = useState([]);
  const gridRef = useRef(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQueryManage, setSearchQueryManage] = useState("");

  const [filterSidebar, setFilterSidebar] = useState([]);

  const roleAccess = isUserRoleCompare;
  let ans;

  useEffect(() => {
    const fetchFilterSidebarItems = async () => {
      setPageName(!pageName);
      try {
        let roleSidebar = filterSidebar.filter((item) => {
          ans = roleAccess.includes(item.dbname);
          return ans;
        });

        let roleBasedSidebar = roleSidebar.map((item) => {
          if (item.submenu) {
            let roleBasedChild = item.submenu.filter((item) => {
              ans = roleAccess.includes(item.dbname);
              return ans;
            });
            let childrenbasedChild = roleBasedChild.map((value, i) => {
              if (value.submenu) {
                let roleBasedinnerChild = value.submenu.filter((item) => {
                  ans = roleAccess.includes(item.dbname);
                  return ans;
                });
                let childrenbasedInnerChild = roleBasedinnerChild.map(
                  (innerValue, j) => {
                    if (innerValue.submenu) {
                      let roleBasedInnermostChild = innerValue.submenu.filter(
                        (item) => {
                          ans = roleAccess.includes(item.dbname);
                          return ans;
                        }
                      );
                      return {
                        ...innerValue,
                        submenu: roleBasedInnermostChild,
                      };
                    } else {
                      return innerValue;
                    }
                  }
                );
                return { ...value, submenu: childrenbasedInnerChild };
              } else {
                return value;
              }
            });
            let childrenbasedChild1 = childrenbasedChild.map((values, i) => {
              if (values.submenu) {
                let roleBasedinnerChild1 = values.submenu.filter((item) => {
                  ans = roleAccess.includes(item.dbname);
                  return ans;
                });
                let childrenbasedInnerChild1 = roleBasedinnerChild1.map(
                  (innerValue1, j) => {
                    if (innerValue1.submenu) {
                      let roleBasedInnermostChild1 = innerValue1.submenu.filter(
                        (item) => {
                          ans = roleAccess.includes(item.dbname);
                          return ans;
                        }
                      );
                      return {
                        ...innerValue1,
                        submenu: roleBasedInnermostChild1,
                      };
                    } else {
                      return innerValue1;
                    }
                  }
                );
                return { ...values, submenu: childrenbasedInnerChild1 };
              } else {
                return values;
              }
            });
            return { ...item, submenu: childrenbasedChild1 };
          } else {
            return item;
          }
        });
        setFilterSidebar(roleBasedSidebar);
      } catch (err) {
        console.error(err?.response?.data?.message);
      }
    };

    fetchFilterSidebarItems();
  }, [roleAccess]);

  // Error Popup model
  const [showAlert, setShowAlert] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  };

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

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
  // info model
  const [openInfo, setOpeninfo] = useState(false);
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
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

  //delete model
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteDatas, setDeleteDatas] = useState({
    id: "",
    url: "",
    apikey: "",
  });
  const handleClickOpen = () => {
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  const getRowClassName = (params) => {
    if (selectedRows.includes(params.data.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  const [raise, setRaise] = useState([]);
  //get all project.
  // get all branches

  useEffect(() => {
    fetchRaise();
  }, []);

  const [finalans, setFinalans] = useState([]);

  const fetchRaise = async () => {
    setPageName(!pageName);
    try {
      setLoading(true);
      let res = await axios.get(
        `${SERVICE.CLIENTSUPPORT}/?page=${page}&&limit=${pageSize}&&role=${isUserRoleAccess?.role}&&userid=${isUserRoleAccess?._id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      const ans = res?.data?.raises?.length > 0 ? res?.data?.raises : [];
      const itemsWithSerialNumber = ans?.map((item, index) => ({
        ...item,
        serialNumber: (page - 1) * pageSize + index + 1,
        createddate: moment(item?.createdAt).format("DD-MM-YYYY"),
        createdtime: moment(item?.createdAt).format("hh:mm:ss A"),
        closedate:
          item.status === "Closed"
            ? moment(new Date(item?.closedAt)).format("DD-MM-YYYY")
            : "",
        closetime:
          item.status === "Closed"
            ? moment(new Date(item?.closedAt)).format("hh:mm:ss A")
            : "",
        closedby: item.status === "Closed" ? item?.closedby : "",
      }));

      setRaise(itemsWithSerialNumber);
      // setTotalProjects(ans?.length > 0 ? res?.data?.totalRaises : 0);
      // setTotalPages(ans?.length > 0 ? res?.data?.totalPages : 0);
      // setPageSize((data) => {
      //   return ans?.length > 0 ? data : 10;
      // });
      // setPage((data) => {
      //   return ans?.length > 0 ? data : 1;
      // });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };



  const [singleDoc, setSingleDoc] = useState({});
  let updateby = singleDoc?.updatedby;
  let addedby = singleDoc?.addedby;

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    checkbox: true,
    actions: true,
    mode: true,
    priority: true,
    serialNumber: true,
    modulename: true,
    submodulename: true,
    mainpagename: true,
    subpagename: true,
    subsubpagename: true,
    status: true,
    view: true,
    clientname: true,
    autoid: true,
    uniqueId: true,
    createddate: true,
    createdtime: true,
    // closedate: true,
    // closetime: true,
    createdby: true,
    category: true,
    subcategory: true,
    createdbycompany: true,
    createdbyemail: true,
    createdbycontactnumber: true,
    detailsneeded: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  //serial no for listing items
  const addSerialNumber = (datas) => {
    setItems(datas);
  };

  useEffect(() => {
    addSerialNumber(raise);
  }, [raise]);
  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTable = useRef(null);

  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSelectedRows([]);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setSelectedRows([]);
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

  function encryptString(str) {
    if (str) {
      const characters =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const shift = 3; // You can adjust the shift value as per your requirement
      let encrypted = "";
      for (let i = 0; i < str.length; i++) {
        let charIndex = characters.indexOf(str[i]);
        if (charIndex === -1) {
          // If character is not found, add it directly to the encrypted string
          encrypted += str[i];
        } else {
          // Shift the character index
          charIndex = (charIndex + shift) % characters.length;
          encrypted += characters[charIndex];
        }
      }
      return encrypted;
    } else {
      return "";
    }
  }

  const encryptAndNavigate = async (rowId, newUrl, apikey) => {
    setPageName(!pageName);
    try {
      let encryptApiKey = await encryptString(apikey);

      let migrateData = {
        apikey: encryptApiKey,
        ids: rowId,
        url: newUrl,
        riderectto: "clientsupportlist",
        riderectedfrom: "statusupdate",
      };

      navigate("/clientsupport/clientsupportview", { state: { migrateData } });
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const encryptAndNavigateView = async (rowId, newUrl, apikey) => {
    setPageName(!pageName);
    try {
      let encryptApiKey = await encryptString(apikey);

      let migrateData = {
        apikey: encryptApiKey,
        ids: rowId,
        url: newUrl,
        riderectto: "clientsupportlist",
        riderectedfrom: "view",
      };

      navigate("/clientsupport/clientsupportview", { state: { migrateData } });
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const columnDataTable = [
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 80,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
      pinned: "left",
    },
    {
      field: "clientname",
      headerName: "Client Name",
      flex: 0,
      width: 100,
      hide: !columnVisibility.clientname,
      headerClassName: "bold-header",
      pinned: "left",
    },
    {
      field: "autoid",
      headerName: "Auto Id",
      flex: 0,
      width: 100,
      hide: !columnVisibility.autoid,
      headerClassName: "bold-header",
      pinned: "left",
    },
    {
      field: "uniqueId",
      headerName: "Reference Id",
      flex: 0,
      width: 100,
      hide: !columnVisibility.uniqueId,
      headerClassName: "bold-header",
      pinned: "left",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0,
      width: 130,
      hide: !columnVisibility.status,
      headerClassName: "bold-header",
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      pinned: "left",
      cellRenderer: (params) => (
        <>
          {params.data.status && (
            <Button
              variant="contained"
              size="small"
              style={{
                cursor: "default",
                padding: "5px",
                background:
                  params.data.status === "Closed"
                    ? "red"
                    : params.data.status === "On Progress"
                      ? "green"
                      : params.data.status === "Open"
                        ? "yellow"
                        : "purple",
                color: params.data.status === "Open" ? "black" : "white",
                fontSize: "10px",
                fontWeight: "bold",
              }}
            >
              {params.data.status}
            </Button>
          )}
        </>
      ),
    },
    {
      field: "view",
      headerName: "View",
      flex: 0,
      width: 100,
      hide: !columnVisibility.view,
      headerClassName: "bold-header",
      sortable: false,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("vclientsupportlist") && (
            <Button
              variant="contained"
              color="primary"
              sx={userStyle.buttonadd}
              onClick={() => {
                encryptAndNavigate(
                  params?.data?.id,
                  params.data.singledataurl,
                  params.data.apikey
                );
              }}
            >
              View
            </Button>
          )}
        </Grid>
      ),
    },
    {
      field: "mode",
      headerName: "Mode",
      flex: 0,
      width: 100,
      hide: !columnVisibility.mode,
      headerClassName: "bold-header",
    },
    {
      field: "priority",
      headerName: "Priority",
      flex: 0,
      width: 130,
      hide: !columnVisibility.priority,
      headerClassName: "bold-header",
    },
    {
      field: "modulename",
      headerName: "Module",
      flex: 0,
      width: 130,
      hide: !columnVisibility.modulename,
      headerClassName: "bold-header",
    },
    {
      field: "submodulename",
      headerName: "Sub Module",
      flex: 0,
      width: 130,
      hide: !columnVisibility.submodulename,
      headerClassName: "bold-header",
    },
    {
      field: "mainpagename",
      headerName: "Main Page",
      flex: 0,
      width: 130,
      hide: !columnVisibility.mainpagename,
      headerClassName: "bold-header",
    },
    {
      field: "subpagename",
      headerName: "Sub Page",
      flex: 0,
      width: 130,
      hide: !columnVisibility.subpagename,
      headerClassName: "bold-header",
    },
    {
      field: "subsubpagename",
      headerName: "Sub Sub-Page",
      flex: 0,
      width: 150,
      hide: !columnVisibility.subsubpagename,
      headerClassName: "bold-header",
    },
    {
      field: "category",
      headerName: "Category",
      flex: 0,
      width: 130,
      hide: !columnVisibility.category,
      headerClassName: "bold-header",
    },
    {
      field: "subcategory",
      headerName: "Sub Category",
      flex: 0,
      width: 150,
      hide: !columnVisibility.subcategory,
      headerClassName: "bold-header",
    },
    {
      field: "createddate",
      headerName: "Created Date",
      flex: 0,
      width: 100,
      hide: !columnVisibility.createddate,
      headerClassName: "bold-header",
    },
    {
      field: "createdtime",
      headerName: "Created Time",
      flex: 0,
      width: 130,
      hide: !columnVisibility.createdtime,
      headerClassName: "bold-header",
    },
    // {
    //   field: "closedate",
    //   headerName: "Closed Date",
    //   flex: 0,
    //   width: 100,
    //   hide: !columnVisibility.closedate,
    //   headerClassName: "bold-header",
    // },
    // {
    //   field: "closetime",
    //   headerName: "Closed Time",
    //   flex: 0,
    //   width: 130,
    //   hide: !columnVisibility.closetime,
    //   headerClassName: "bold-header",
    // },
    {
      field: "createdby",
      headerName: "Created By",
      flex: 0,
      width: 130,
      hide: !columnVisibility.createdby,
      headerClassName: "bold-header",
    },
    {
      field: "createdbycompany",
      headerName: "Company",
      flex: 0,
      width: 130,
      hide: !columnVisibility.createdbycompany,
      headerClassName: "bold-header",
    },
    {
      field: "createdbyemail",
      headerName: "Email",
      flex: 0,
      width: 130,
      hide: !columnVisibility.createdbyemail,
      headerClassName: "bold-header",
    },
    {
      field: "createdbycontactnumber",
      headerName: "Contact No",
      flex: 0,
      width: 130,
      hide: !columnVisibility.createdbycontactnumber,
      headerClassName: "bold-header",
    },

    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 300,
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
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("eclientsupportlist") && (
            // <Button
            //   sx={userStyle.buttonedit}
            //   onClick={() => {
            //     getCode(params.data.id);
            //   }}
            // >
            <>
              {params.data.status === "Closed" ? (
                <Link
                  // to={`/production/raiseproblemedit/${params.data.id}`}
                  style={{
                    textDecoration: "none",
                    color: "#fff",
                    minWidth: "0px",
                  }}
                >
                  <Button
                    sx={userStyle.buttonedit}
                    style={{ visibility: "hidden" }}
                  >
                    <EditOutlinedIcon sx={buttonStyles.buttonedit} />
                  </Button>
                </Link>
              ) : (
                <Link
                  to={`/production/raiseproblemedit/${params.data.id}`}
                  style={{
                    textDecoration: "none",
                    color: "#fff",
                    minWidth: "0px",
                    visibility: "hidden", // temp
                  }}
                >
                  <Button sx={userStyle.buttonedit}>
                    <EditOutlinedIcon sx={buttonStyles.buttonedit} />
                  </Button>
                </Link>
              )}{" "}
            </>
          )}

          {isUserRoleCompare?.includes("dclientsupportlist") && (
            <>
              {params.data.status === "Closed" ? (
                <Button
                  sx={userStyle.buttondelete}
                  style={{ visibility: "hidden" }}
                >
                  <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
                </Button>
              ) : (
                <Button
                  sx={userStyle.buttondelete}
                  onClick={(e) => {
                    setDeleteDatas({
                      id: params.data.id,
                      url: params.data.singledataurl,
                      apikey: params.data.apikey,
                    });
                    handleClickOpen();
                  }}
                >
                  <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
                </Button>
              )}{" "}
            </>
          )}
          {isUserRoleCompare?.includes("vclientsupportlist") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                encryptAndNavigateView(
                  params?.data?.id,
                  params.data.singledataurl,
                  params.data.apikey
                );
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iclientsupportlist") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                setSingleDoc(params.data);
                handleClickOpeninfo();
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
      mode: item.mode,
      status: item.status,
      clientname: item.clientname,
      autoid: item.autoid,
      priority: item.priority,
      createddate: item?.createddate,
      createdtime: item?.createdtime,
      closedate: item.closedate,
      closetime: item.closetime,
      closedby: item?.closedby,

      modulename: item.modulename,
      submodulename: item.submodulename,
      mainpagename: item.mainpagename,
      subpagename: item.subpagename,
      subsubpagename: item.subsubpagename,
      category: item.category,
      subcategory: item.subcategory,
      createdby: item.createdby,
      createdbycompany: item.createdbycompany,
      createdbyemail: item.createdbyemail,
      createdbycontactnumber: item.createdbycontactnumber,
      detailsneeded: item.detailsneeded,
      singledataurl: item.singledataurl,
      apikey: item.apikey,
      uniqueId: item.uniqueId,

      updateby: item?.updateby,
      addedby: item?.addedby,
    };
  });

  // Excel
  const fileName = "RaiseProblem";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "RaiseProblem",
    pageStyle: "print",
  });

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
  const filteredColumns = columnDataTable.filter((column) =>
    column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
  );


  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Raise Problem.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };



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

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRows.includes(row.id),
  }));
  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );

  const getviewCode = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.delete(`${deleteDatas?.url}/${deleteDatas?.id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
          "clientsupport-api-keys": deleteDatas?.apikey,
        },
      });
      handleCloseDelete();
      setFilteredChanges(null)
      setFilteredRowData([]);
      await fetchRaise();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const delAccountcheckbox = async () => {
    setPageName(!pageName);
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.RAISEPROBLEM_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
      setPage(1);
      setSelectedRows([]);
      handleCloseModcheckbox();
      setFilteredChanges(null)
      setFilteredRowData([]);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      await fetchRaise();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [copiedData, setCopiedData] = useState("");

  return (
    <Box>
      <Headtitle title={"CLIENT SUPPORT LIST"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Manage Client Support List"
        modulename="Support"
        submodulename="Client Support"
        mainpagename="Client Support List"
        subpagename=""
        subsubpagename=""
      />

      <>
        {isUserRoleCompare?.includes("lclientsupportlist") && (
          <>
            <Box sx={userStyle.container}>


              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  Client Support List
                </Typography>
              </Grid>
              {/* ******************************************************EXPORT Buttons****************************************************** */}
              <br />
              <Grid container sx={{ justifyContent: "center" }}>
                <Grid>
                  {isUserRoleCompare?.includes("excelclientsupportlist") && (
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
                  {isUserRoleCompare?.includes("csvclientsupportlist") && (
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
                  {isUserRoleCompare?.includes("printclientsupportlist") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfclientsupportlist") && (
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
                  {isUserRoleCompare?.includes("imageclientsupportlist") && (
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
                </Grid>
              </Grid>
              <br />
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
                    <MenuItem value={raise?.length}>All</MenuItem>
                  </Select>
                </Box>
                <Box>
                  {/* <AggregatedSearchBar
                    columnDataTable={columnDataTable}
                    setItems={setItems}
                    addSerialNumber={addSerialNumber}
                    setPage={setPage}
                    maindatas={raise}
                    setSearchedString={setSearchedString}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    paginated={true}
                    totalDatas={raise}
                    setFilteredRowData={setFilteredRowData}
                    filteredRowData={filteredRowData}
                    setFilteredChanges={setFilteredChanges}
                    filteredChanges={filteredChanges}
                    gridRefTableImg={gridRefTableImg}
                    itemsList={raise}
                  /> */}


                  <AggregatedSearchBar
                    columnDataTable={columnDataTable}
                    setItems={setItems}
                    addSerialNumber={addSerialNumber}
                    setPage={setPage}
                    maindatas={raise}
                    setSearchedString={setSearchedString}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    paginated={false}
                    totalDatas={raise}
                  />
                </Box>
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
              &emsp;
              <Button
                sx={userStyle.buttongrp}
                onClick={handleOpenManageColumns}
              >
                Manage Columns
              </Button>{" "}
              &emsp;
              {/* {isUserRoleCompare?.includes("bdclientsupportlist") && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleClickOpenalert}
                >
                  Bulk Delete
                </Button>
              )} */}
              <br />
              <br />
              {/* ****** Table start ****** */}
              {loading ? (
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
                    searchQuery={searchQuery}
                    handleShowAllColumns={handleShowAllColumns}
                    setFilteredRowData={setFilteredRowData}
                    filteredRowData={filteredRowData}
                    setFilteredChanges={setFilteredChanges}
                    filteredChanges={filteredChanges}
                    gridRefTableImg={gridRefTableImg}
                    itemsList={raise}
                  />
                </>
              )}
              {/* ****** Table End ****** */}
            </Box>
            <TableContainer component={Paper} sx={userStyle.printcls}>
              <Table
                aria-label="customized table"
                id="raisetickets"
                ref={componentRef}
              >
                <TableHead sx={{ fontWeight: "600" }}>
                  <StyledTableRow>
                    <StyledTableCell>S.No</StyledTableCell>
                    <StyledTableCell>Client Name</StyledTableCell>
                    <StyledTableCell>Auto ID</StyledTableCell>
                    <StyledTableCell>Reference ID</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                    <TableCell>Mode</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell> Module</TableCell>
                    <TableCell>Sub Module</TableCell>
                    <TableCell>Main Page</TableCell>
                    <TableCell>Sub Page</TableCell>
                    <TableCell>Sub Sub-Page</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Sub Category</TableCell>
                    <TableCell>Created Date</TableCell>
                    <TableCell>Created Time</TableCell>
                    {/* <TableCell>Closed Date</TableCell>
                      <TableCell>Closed Time</TableCell> */}
                    <TableCell>Created By</TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Contact No.</TableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {rowDataTable?.length > 0 ? (
                    rowDataTable?.map((row, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <TableCell>{row.clientname}</TableCell>
                        <TableCell>{row.autoid}</TableCell>
                        <TableCell>{row.uniqueId}</TableCell>
                        <TableCell>{row.status}</TableCell>
                        <TableCell>{row.mode}</TableCell>
                        <TableCell>{row.priority}</TableCell>
                        <TableCell>{row.modulename}</TableCell>
                        <TableCell>{row.submodulename}</TableCell>
                        <TableCell>{row.mainpagename}</TableCell>
                        <TableCell>{row.subpagename}</TableCell>
                        <TableCell>{row.subsubpagename}</TableCell>
                        <TableCell>{row.category}</TableCell>
                        <TableCell>{row.subcategory}</TableCell>
                        <TableCell>{row.createddate}</TableCell>
                        <TableCell>{row.createdtime}</TableCell>
                        {/* <TableCell>{row.closedate}</TableCell>
                          <TableCell>{row.closetime}</TableCell> */}
                        <TableCell>{row.createdby}</TableCell>
                        <TableCell>{row.createdbycompany}</TableCell>
                        <TableCell>{row.createdbyemail}</TableCell>
                        <TableCell>{row.createdbycontactnumber}</TableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <StyledTableRow>
                      {" "}
                      <StyledTableCell colSpan={7} align="center">
                        No Data Available
                      </StyledTableCell>{" "}
                    </StyledTableRow>
                  )}
                  <StyledTableRow></StyledTableRow>
                </TableBody>
              </Table>
            </TableContainer>
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
      </>

      <Box>
        {/* ALERT DIALOG */}
        <Dialog
          open={isDeleteOpenalert}
          onClose={handleCloseModalert}
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

      <Box>
        <Dialog
          open={isDeleteOpencheckbox}
          onClose={handleCloseModcheckbox}
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
            <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
              Are you sure?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseModcheckbox}
              sx={buttonStyles.btncancel}
            >
              Cancel
            </Button>
            <Button
              autoFocus
              variant="contained"
              color="error"
              onClick={(e) => delAccountcheckbox(e)}
            >
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
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
            <Button
              variant="contained"
              style={{
                padding: "7px 13px",
                color: "white",
                background: "rgb(25, 118, 210)",
              }}
              onClick={handleCloseerr}
            >
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>


      <br />
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
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Client Support Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={openDelete}
        onClose={handleCloseDelete}
        onConfirm={getviewCode}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
        itemsTwo={raise ?? []}
        filename={"Client Support List"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* EXTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}

export default ClientSupportList;
