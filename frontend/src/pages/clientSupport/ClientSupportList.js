import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Popover,
  TextField,
  IconButton,
  Switch,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Box,
  Typography,
  OutlinedInput,
  Dialog,
  Select,
  TableCell,
  MenuItem,
  TableBody,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Paper,
  Table,
  TableHead,
  TableContainer,
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
import StyledDataGrid from "../../components/TableStyle";
import "jspdf-autotable";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Headtitle from "../../components/Headtitle";
import PageHeading from "../../components/PageHeading";
import { useNavigate } from "react-router-dom";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import Pagination from "../../components/Pagination";

function ClientSupportList() {
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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

  const handleExportXL = async (isfilter) => {
    if (isfilter === "filtered") {
      exportToCSV(
        rowDataTable?.map((item, index) => ({
          "S.No": index + 1,
          ClientName: item.clientname,
          Autoid: item.autoid,
          ReferenceId: item.uniqueId,
          Status: item.status,
          Mode: item.mode,
          Priority: item.priority,
          Module: item.module,
          Submodule: item.submodule,
          Mainpage: item.mainpage,
          Subpage: item.subpage,
          Subsubpage: item.subsubpage,
          Category: item.category,
          Subcategory: item.subcategory,
          Createddate: item?.createddate,
          Createdtime: item?.createdtime,
          Createdby: item.createdby,
          Company: item.createdbycompany,
          Email: item.createdbyemail,
          ContactNo: item.createdbycontactnumber,
        })),
        fileName
      );
    } else if (isfilter === "overall") {
      let alldata = await exportallData();
      exportToCSV(
        alldata?.map((item, index) => ({
          "S.No": index + 1,
          ClientName: item.clientname,
          Autoid: item.autoid,
          ReferenceId: item.uniqueId,
          Status: item.status,
          Mode: item.mode,
          Priority: item.priority,
          Module: item.modulename,
          Submodule: item.submodulename,
          Mainpage: item.mainpagename,
          Subpage: item.subpagename,
          Subsubpage: item.subsubpagename,
          Category: item.category,
          Subcategory: item.subcategory,
          Createddate: item?.createddate,
          Createdtime: item?.createdtime,
          Createdby: item.createdby,
          Company: item.createdbycompany,
          Email: item.createdbyemail,
          ContactNo: item.createdbycontactnumber,
        })),
        fileName
      );
    }
    setIsFilterOpen(false);
  };

  const columns = [
    { title: "Client Name", field: "clientname" },
    { title: "Auto Id", field: "autoid" },
    { title: "Reference Id", field: "uniqueId" },
    { title: "Status", field: "status" },
    { title: "Mode", field: "mode" },
    { title: "Priority", field: "priority" },
    { title: "Module", field: "module" },
    { title: "Sub Module", field: "submodule" },
    { title: "Main Page", field: "mainpage" },
    { title: "Sub Page", field: "subpage" },
    { title: "Sub Sub-Page", field: "subsubpage" },
    { title: "Category", field: "category" },
    { title: "Sub Category", field: "subcategory" },
    { title: "Created Date", field: "createddate" },
    { title: "Created Time", field: "createdtime" },
    { title: "Created By", field: "createdby" },
    { title: "Company", field: "createdbycompany" },
    { title: "Email", field: "createdbyemail" },
    { title: "Contact No", field: "createdbycontactnumber" },
  ];

  const downloadPdf = async (isfilter) => {
    const doc = new jsPDF();
    // Modify columns to include serial number column
    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" }, // Serial number column
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];
    let alldata;
    if (isfilter !== "filtered") {
      alldata = await exportallData();
    }

    // Modify row data to include serial number
    const dataWithSerial =
      isfilter === "filtered"
        ? rowDataTable?.map((item, index) => ({
            serialNumber: index + 1,
            status: item.status,
            clientname: item.clientname,
            autoid: item.autoid,
            uniqueId: item.uniqueId,
            mode: item.mode,
            priority: item.priority,
            module: item.module,
            submodule: item.submodule,
            mainpage: item.mainpage,
            subpage: item.subpage,
            subsubpage: item.subsubpage,
            category: item.category,
            subcategory: item.subcategory,
            createddate: item?.createddate,
            createdtime: item?.createdtime,
            createdby: item.createdby,
            createdbycompany: item.createdbycompany,
            createdbyemail: item.createdbyemail,
            createdbycontactnumber: item.createdbycontactnumber,
          }))
        : alldata?.map((item, index) => ({
            serialNumber: index + 1,
            status: item.status,
            clientname: item.clientname,
            autoid: item.autoid,
            uniqueId: item.uniqueId,
            mode: item.mode,
            priority: item.priority,
            module: item.modulename,
            submodule: item.submodulename,
            mainpage: item.mainpagename,
            subpage: item.subpagename,
            subsubpage: item.subsubpagename,
            category: item.category,
            subcategory: item.subcategory,
            createddate: item?.createddate,
            createdtime: item?.createdtime,
            createdby: item.createdby,
            createdbycompany: item.createdbycompany,
            createdbyemail: item.createdbyemail,
            createdbycontactnumber: item.createdbycontactnumber,
          }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: "5" },
    });

    doc.save("RaiseProblem.pdf");
  };

  const [loading, setLoading] = useState(false);
  const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName } =
    useContext(UserRoleAccessContext);
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
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  const [raise, setRaise] = useState([]);
  //get all project.
  // get all branches

  useEffect(() => {
    fetchRaise();
  }, [page, pageSize]);

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
      setTotalProjects(ans?.length > 0 ? res?.data?.totalRaises : 0);
      setTotalPages(ans?.length > 0 ? res?.data?.totalPages : 0);
      setPageSize((data) => {
        return ans?.length > 0 ? data : 10;
      });
      setPage((data) => {
        return ans?.length > 0 ? data : 1;
      });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    fetchRaise();
  }, []);

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
    module: true,
    submodule: true,
    mainpage: true,
    subpage: true,
    subsubpage: true,
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
  const addSerialNumber = () => {
    const itemsWithSerialNumber = raise?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      createddate: moment(item?.createdAt).format("DD-MM-YYYY"),
      createdtime: moment(item?.createdAt).format("hh:mm:ss A"),
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [raise]);

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
  const filteredDatas = raise?.filter((item) => {
    return searchOverTerms.every((term) =>
      Object.values(item)?.join(" ")?.toLowerCase()?.includes(term)
    );
  });

  // const filteredData = filteredDatas?.slice(
  //   (page - 1) * pageSize,
  //   page * pageSize
  // );

  // const totalPages = Math.ceil(filteredDatas?.length / pageSize);

  // const visiblePages = Math.min(totalPages, 3);

  // const firstVisiblePage = Math.max(1, page - 1);
  // const lastVisiblePage = Math.min(
  //   firstVisiblePage + visiblePages - 1,
  //   totalPages
  // );
  // const pageNumbers = [];

  // for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
  //   pageNumbers.push(i);
  // }

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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
              updatedSelectedRows.length === filteredDatas.length
            );
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
      field: "clientname",
      headerName: "Client Name",
      flex: 0,
      width: 100,
      hide: !columnVisibility.clientname,
      headerClassName: "bold-header",
    },
    {
      field: "autoid",
      headerName: "Auto Id",
      flex: 0,
      width: 100,
      hide: !columnVisibility.autoid,
      headerClassName: "bold-header",
    },
    {
      field: "uniqueId",
      headerName: "Reference Id",
      flex: 0,
      width: 100,
      hide: !columnVisibility.uniqueId,
      headerClassName: "bold-header",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0,
      width: 130,
      hide: !columnVisibility.status,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <>
          {params.row.status && (
            <Button
              variant="contained"
              size="small"
              style={{
                cursor: "default",
                padding: "5px",
                background:
                  params.row.status === "Closed"
                    ? "red"
                    : params.row.status === "On Progress"
                    ? "green"
                    : params.row.status === "Open"
                    ? "yellow"
                    : "purple",
                color: params.row.status === "Open" ? "black" : "white",
                fontSize: "10px",
                fontWeight: "bold",
              }}
            >
              {params.row.status}
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
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("vclientsupportlist") && (
            <Button
              variant="contained"
              color="primary"
              sx={userStyle.buttonadd}
              onClick={() => {
                encryptAndNavigate(
                  params?.row?.id,
                  params.row.singledataurl,
                  params.row.apikey
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
      field: "module",
      headerName: "Module",
      flex: 0,
      width: 130,
      hide: !columnVisibility.module,
      headerClassName: "bold-header",
    },
    {
      field: "submodule",
      headerName: "Sub Module",
      flex: 0,
      width: 130,
      hide: !columnVisibility.submodule,
      headerClassName: "bold-header",
    },
    {
      field: "mainpage",
      headerName: "Main Page",
      flex: 0,
      width: 130,
      hide: !columnVisibility.mainpage,
      headerClassName: "bold-header",
    },
    {
      field: "subpage",
      headerName: "Sub Page",
      flex: 0,
      width: 130,
      hide: !columnVisibility.subpage,
      headerClassName: "bold-header",
    },
    {
      field: "subsubpage",
      headerName: "Sub Sub-Page",
      flex: 0,
      width: 150,
      hide: !columnVisibility.subsubpage,
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
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("eclientsupportlist") && (
            // <Button
            //   sx={userStyle.buttonedit}
            //   onClick={() => {
            //     getCode(params.row.id);
            //   }}
            // >
            <>
              {params.row.status === "Closed" ? (
                <Link
                  // to={`/production/raiseproblemedit/${params.row.id}`}
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
                    <EditOutlinedIcon style={{ fontsize: "large" }} />
                  </Button>
                </Link>
              ) : (
                <Link
                  to={`/production/raiseproblemedit/${params.row.id}`}
                  style={{
                    textDecoration: "none",
                    color: "#fff",
                    minWidth: "0px",
                    visibility: "hidden", // temp
                  }}
                >
                  <Button sx={userStyle.buttonedit}>
                    <EditOutlinedIcon style={{ fontsize: "large" }} />
                  </Button>
                </Link>
              )}{" "}
            </>
          )}

          {isUserRoleCompare?.includes("dclientsupportlist") && (
            <>
              {params.row.status === "Closed" ? (
                <Button
                  sx={userStyle.buttondelete}
                  style={{ visibility: "hidden" }}
                >
                  <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
                </Button>
              ) : (
                <Button
                  sx={userStyle.buttondelete}
                  onClick={(e) => {
                    setDeleteDatas({
                      id: params.row.id,
                      url: params.row.singledataurl,
                      apikey: params.row.apikey,
                    });
                    handleClickOpen();
                  }}
                >
                  <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
                </Button>
              )}{" "}
            </>
          )}
          {isUserRoleCompare?.includes("vclientsupportlist") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                encryptAndNavigateView(
                  params?.row?.id,
                  params.row.singledataurl,
                  params.row.apikey
                );
              }}
            >
              <VisibilityOutlinedIcon style={{ fontSize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iclientsupportlist") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                setSingleDoc(params.row);
                handleClickOpeninfo();
              }}
            >
              <InfoOutlinedIcon style={{ fontSize: "large" }} />
            </Button>
          )}
        </Grid>
      ),
    },
  ];

  const rowDataTable = filteredDatas.map((item, index) => {
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

      module: item.modulename,
      submodule: item.submodulename,
      mainpage: item.mainpagename,
      subpage: item.subpagename,
      subsubpage: item.subsubpagename,
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

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "RaiseProblem.png");
        });
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
      await fetchRaise();
      setShowAlert(
        <>
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "#7ac767" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Deleted Sucessfully"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      setShowAlert(
        <>
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "#7ac767" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Deleted Sucessfully"}
          </p>
        </>
      );
      handleClickOpenerr();
      await fetchRaise();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [copiedData, setCopiedData] = useState("");

  return (
    <Box>
      <Headtitle title={"CLIENT SUPPORT LIST"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Manage Client Support List"
        modulename="Client Support"
        submodulename="Client Support List"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />

      <>
        {isUserRoleCompare?.includes("lclientsupportlist") && (
          <>
            <Box sx={userStyle.container}>
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
                    {/* <MenuItem value={raise?.length}>All</MenuItem> */}
                  </Select>
                </Box>
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
                  <Box>
                    <Pagination
                      page={page}
                      pageSize={pageSize}
                      totalPages={searchQuery !== "" ? 1 : totalPages}
                      onPageChange={handlePageChange}
                      pageItemLength={filteredDatas?.length}
                      totalProjects={
                        searchQuery !== ""
                          ? filteredDatas?.length
                          : totalProjects
                      }
                    />
                  </Box>
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
                        <TableCell>{row.module}</TableCell>
                        <TableCell>{row.submodule}</TableCell>
                        <TableCell>{row.mainpage}</TableCell>
                        <TableCell>{row.subpage}</TableCell>
                        <TableCell>{row.subsubpage}</TableCell>
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

      <Dialog
        open={openInfo}
        onClose={handleCloseinfo}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              Client Support Info
            </Typography>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Addedby</Typography>
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
            <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
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

      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
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
          <Button onClick={handleCloseDelete} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={(e) => getviewCode()}
            autoFocus
            variant="contained"
            color="error"
          >
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>

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

      <br />
      <br />
    </Box>
  );
}

export default ClientSupportList;
