import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Popover,
  Select,
  Switch,
  TextField,
  Typography,
  OutlinedInput,
  InputAdornment,
  Tooltip,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaDownload, FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaTrash, FaSearch } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import AggregatedSearchBar from '../../components/AggregatedSearchBar';
import AggridTable from "../../components/AggridTable";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import ExportData from "../../components/ExportData";
import AlertDialog from "../../components/Alert";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import domtoimage from 'dom-to-image';
import AggridTableForPaginationTable from "../../components/AggridTableForPaginationTable.js";
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";

function RaiseProblemOnProgress() {
  const [advancedFilter, setAdvancedFilter] = useState(null);
  const [additionalFilters, setAdditionalFilters] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const conditions = ["Contains", "Does Not Contain", "Equals", "Does Not Equal", "Begins With", "Ends With", "Blank", "Not Blank"]; // AgGrid-like conditions
  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("Contains");
  const [logicOperator, setLogicOperator] = useState("AND");
  const [filterValue, setFilterValue] = useState("");
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);

  const [totalProjects, setTotalProjects] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [allData, setAllData] = useState()
  const exportallData = async () => {
    setPageName(!pageName)
    try {
      let res_branch = await axios.get(SERVICE.RAISEPROBLEM, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let data = res_branch?.data?.raises
        ?.filter((data) => data.status === "On Progress")
        ?.map((item, index) => ({
          ...item,
          createddate: moment(item?.createdAt).format("DD-MM-YYYY"),
          createdtime: moment(item?.createdAt).format("hh:mm:ss A"),
        }));
      setAllData(data.map((item, index) => {
        return {
          id: item._id,
          serialNumber: item.serialNumber,
          mode: item.mode,
          status: item.status,
          autoid: item.autoid,
          priority: item.priority,
          createddate: item?.createddate,
          createdtime: item?.createdtime,
          module: item.modulename,
          submodule: item.submodulename,
          mainpage: item.mainpagename,
          subpage: item.subpagename,
          subsubpage: item.subsubpagename,
          createdby: item.createdby,
          category: item.category,
          subcategory: item.subcategory,
        };
      }));
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  const [isHandleChange, setIsHandleChange] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

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


  const [fileFormat, setFormat] = useState("");

  let exportColumnNames = [
    'Auto Id', 'Status',
    'Mode', 'Priority',
    'Module', 'Sub Module',
    'Main Page', 'Sub Page',
    'Sub Sub-Page', 'Category',
    'Sub Category', 'Created Date',
    'Created Time', 'Created By'
  ];
  let exportRowValues = [
    'autoid', 'status',
    'mode', 'priority',
    'module', 'submodule',
    'mainpage', 'subpage',
    'subsubpage', 'category',
    'subcategory', 'createddate',
    'createdtime', 'createdby'
  ]

  const [loading, setLoading] = useState(false);
  const { isUserRoleCompare, pageName, setPageName, isUserRoleAccess } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [selectedRows, setSelectedRows] = useState([]);
  const gridRef = useRef(null);
  const gridRefTable = useRef(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedString, setSearchedString] = useState("")

  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQueryManage, setSearchQueryManage] = useState("");

  const [priority, setPriority] = useState([]);

  const [filterSidebar, setFilterSidebar] = useState([]);

  const roleAccess = isUserRoleCompare;
  let ans;

  useEffect(() => {
    const fetchFilterSidebarItems = async () => {
      setPageName(!pageName)
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

  const fetchPriorityAll = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.get(SERVICE.PRIORITY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let companyalldata = res?.data?.priorities.map((item) => ({
        ...item,
        value: item.name,
        label: item.name,
      }));
      setPriority(companyalldata);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("RaiseProblemOnProgress"),
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
    fetchPriorityAll();
    getapi();
    exportallData();
  }, []);

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

  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };
  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const [raise, setRaise] = useState([]);
  const [overallRaiseproblem, setOverallRaiseproblem] = useState([]);

  //get all project.
  // get all branches

  useEffect(() => {
    fetchRaise();
  }, [page, pageSize, searchQuery]);

  const [anchorElSearch, setAnchorElSearch] = React.useState(null);
  const handleClickSearch = (event) => {
    setAnchorElSearch(event.currentTarget);
    localStorage.removeItem("filterModel");
  };
  const handleCloseSearch = () => {
    setAnchorElSearch(null);
    setSearchQuery("");
  };

  const openSearch = Boolean(anchorElSearch);
  const idSearch = openSearch ? 'simple-popover' : undefined;

  const handleAddFilter = () => {
    if (selectedColumn && filterValue || ["Blank", "Not Blank"].includes(selectedCondition)) {
      setAdditionalFilters([
        ...additionalFilters,
        { column: selectedColumn, condition: selectedCondition, value: filterValue }
      ]);
      setSelectedColumn("");
      setSelectedCondition("Contains");
      setFilterValue("");
    }
  };



  const getSearchDisplay = () => {
    if (advancedFilter && advancedFilter.length > 0) {
      return advancedFilter.map((filter, index) => {
        let showname = columnDataTable.find(col => col.field === filter.column)?.headerName;
        return `${showname} ${filter.condition} "${filter.value}"`;
      }).join(' ' + (advancedFilter.length > 1 ? advancedFilter[1].condition : '') + ' ');
    }
    return searchQuery;
  };


  const fetchRaise = async () => {
    setPageName(!pageName)
    const queryParams = {
      page: Number(page),
      pageSize: Number(pageSize),
      status: "On Progress",
      role: isUserRoleAccess?.role,
      username: isUserRoleAccess?.companyname,
    };

    const allFilters = [
      ...additionalFilters,
      { column: selectedColumn, condition: selectedCondition, value: filterValue }
    ];

    if (allFilters.length > 0 && selectedColumn !== "") {
      queryParams.allFilters = allFilters
      queryParams.logicOperator = logicOperator;
    } else if (searchQuery) {
      queryParams.searchQuery = searchQuery;
    }
    try {
      let res = await axios.post(SERVICE.SKIPPED_RAISEPROBLEMSTATUS, queryParams, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

      });

      const ans = res?.data?.result?.length > 0 ? res?.data?.result : [];
      const itemsWithSerialNumber = ans?.map((item, index) => ({
        ...item,
        serialNumber: (page - 1) * pageSize + index + 1,
        createddate: moment(item?.createdAt).format("DD-MM-YYYY"),
        createdtime: moment(item?.createdAt).format("hh:mm:ss A"),
      }));

      const anstotalProjectsOverall = res?.data?.totalProjectsOverall?.length > 0 ? res?.data?.totalProjectsOverall : [];
      const itemsWithSerialNumberOverall = anstotalProjectsOverall?.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
        createddate: moment(item?.createdAt).format("DD-MM-YYYY"),
        createdtime: moment(item?.createdAt).format("hh:mm:ss A"),
      }));

      setRaise(itemsWithSerialNumber.map((item, index) => {
        return {
          id: item._id,
          serialNumber: item.serialNumber,
          mode: item.mode,
          status: item.status,
          autoid: item.autoid,
          priority: item.priority,
          createddate: item?.createddate,
          createdtime: item?.createdtime,
          module: item.modulename,
          submodule: item.submodulename,
          mainpage: item.mainpagename,
          subpage: item.subpagename,
          subsubpage: item.subsubpagename,
          createdby: item.createdby,
          category: item.category,
          subcategory: item.subcategory,
        };
      }));
      setOverallRaiseproblem(itemsWithSerialNumberOverall.map((item, index) => {
        return {
          id: item._id,
          serialNumber: item.serialNumber,
          mode: item.mode,
          status: item.status,
          autoid: item.autoid,
          priority: item.priority,
          createddate: item?.createddate,
          createdtime: item?.createdtime,
          module: item.modulename,
          submodule: item.submodulename,
          mainpage: item.mainpagename,
          subpage: item.subpagename,
          subsubpage: item.subsubpagename,
          createdby: item.createdby,
          category: item.category,
          subcategory: item.subcategory,
        };
      }));
      setTotalProjects(ans?.length > 0 ? res?.data?.totalProjects : 0);
      setTotalPages(ans?.length > 0 ? res?.data?.totalPages : 0);
      setPageSize((data) => {
        return ans?.length > 0 ? data : 10;
      });
      setPage((data) => {
        return ans?.length > 0 ? data : 1;
      });
      setLoading(true);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const handleResetSearch = async () => {
    setPageName(!pageName)
    setAdvancedFilter(null);
    setAdditionalFilters([]);
    setSearchQuery("");
    setIsSearchActive(false);
    setSelectedColumn("");
    setSelectedCondition("Contains");
    setFilterValue("");
    setLogicOperator("AND");
    setFilteredChanges(null);

    const queryParams = {
      page: Number(page),
      pageSize: Number(pageSize),
      status: "On Progress",
      role: isUserRoleAccess?.role,
      username: isUserRoleAccess?.companyname,
    };

    const allFilters = [];

    if (allFilters.length > 0 && selectedColumn !== "") {
      queryParams.allFilters = allFilters
      queryParams.logicOperator = logicOperator;
    } else if (searchQuery) {
      queryParams.searchQuery = searchQuery;
    }
    try {
      let res = await axios.post(SERVICE.SKIPPED_RAISEPROBLEMSTATUS, queryParams, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

      });

      const ans = res?.data?.result?.length > 0 ? res?.data?.result : [];
      const itemsWithSerialNumber = ans?.map((item, index) => ({
        ...item,
        serialNumber: (page - 1) * pageSize + index + 1,
        createddate: moment(item?.createdAt).format("DD-MM-YYYY"),
        createdtime: moment(item?.createdAt).format("hh:mm:ss A"),
      }));

      const anstotalProjectsOverall = res?.data?.totalProjectsOverall?.length > 0 ? res?.data?.totalProjectsOverall : [];
      const itemsWithSerialNumberOverall = anstotalProjectsOverall?.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
        createddate: moment(item?.createdAt).format("DD-MM-YYYY"),
        createdtime: moment(item?.createdAt).format("hh:mm:ss A"),
      }));

      setRaise(itemsWithSerialNumber.map((item, index) => {
        return {
          id: item._id,
          serialNumber: item.serialNumber,
          mode: item.mode,
          status: item.status,
          autoid: item.autoid,
          priority: item.priority,
          createddate: item?.createddate,
          createdtime: item?.createdtime,
          module: item.modulename,
          submodule: item.submodulename,
          mainpage: item.mainpagename,
          subpage: item.subpagename,
          subsubpage: item.subsubpagename,
          createdby: item.createdby,
          category: item.category,
          subcategory: item.subcategory,
        };
      }));
      setItems(itemsWithSerialNumber.map((item, index) => {
        return {
          id: item._id,
          serialNumber: item.serialNumber,
          mode: item.mode,
          status: item.status,
          autoid: item.autoid,
          priority: item.priority,
          createddate: item?.createddate,
          createdtime: item?.createdtime,
          module: item.modulename,
          submodule: item.submodulename,
          mainpage: item.mainpagename,
          subpage: item.subpagename,
          subsubpage: item.subsubpagename,
          createdby: item.createdby,
          category: item.category,
          subcategory: item.subcategory,
        };
      }));
      setOverallRaiseproblem(itemsWithSerialNumberOverall.map((item, index) => {
        return {
          id: item._id,
          serialNumber: item.serialNumber,
          mode: item.mode,
          status: item.status,
          autoid: item.autoid,
          priority: item.priority,
          createddate: item?.createddate,
          createdtime: item?.createdtime,
          module: item.modulename,
          submodule: item.submodulename,
          mainpage: item.mainpagename,
          subpage: item.subpagename,
          subsubpage: item.subsubpagename,
          createdby: item.createdby,
          category: item.category,
          subcategory: item.subcategory,
        };
      }));
      setTotalProjects(ans?.length > 0 ? res?.data?.totalProjects : 0);
      setTotalPages(ans?.length > 0 ? res?.data?.totalPages : 0);
      setPageSize((data) => {
        return ans?.length > 0 ? data : 10;
      });
      setPage((data) => {
        return ans?.length > 0 ? data : 1;
      });
      setLoading(true);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };



  const [singleDoc, setSingleDoc] = useState({});
  let updateby = singleDoc?.updatedby;
  let addedby = singleDoc?.addedby;

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    checkbox: true,
    // actions: true,
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
    autoid: true,
    createddate: true,
    createdtime: true,
    createdby: true,
    category: true,
    subcategory: true,
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


  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setSelectedRows([]);
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


  const columnDataTable = [

    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 80,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
      pinned: 'left',
    },
    {
      field: "autoid",
      headerName: "Auto Id",
      flex: 0,
      width: 100,
      hide: !columnVisibility.autoid,
      headerClassName: "bold-header",
      pinned: 'left',
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0,
      width: 100,
      hide: !columnVisibility.status,
      headerClassName: "bold-header",
      pinned: 'left',
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
    {
      field: "createdby",
      headerName: "Created By",
      flex: 0,
      width: 130,
      hide: !columnVisibility.createdby,
      headerClassName: "bold-header",
    },

    {
      field: "view",
      headerName: "View",
      flex: 0,
      width: 100,
      hide: !columnVisibility.view,
      headerClassName: "bold-header",
      sortable: false,
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("vraiseproblemonprogress") && (
            <Link
              to={`/production/raiseproblemview/${params.data.id}/statusupdate/onprogress`}
              style={{ textDecoration: "none", color: "#fff", minWidth: "0px" }}
            >
              <Button
                variant="contained"
                color="primary"
                sx={userStyle.buttonadd}
              >
                View
              </Button>
            </Link>
          )}
        </Grid>
      ),
    },
  ];

  const filteredSelectedColumn = columnDataTable.filter(data => data.field !== 'checkbox' && data.field !== "actions" && data.field !== "serialNumber");


  const rowDataTable = filteredDatas.map((item, index) => {
    return {
      id: item.id,
      serialNumber: item.serialNumber,
      mode: item.mode,
      status: item.status,
      autoid: item.autoid,
      priority: item.priority,
      createddate: item?.createddate,
      createdtime: item?.createdtime,
      module: item.module,
      submodule: item.submodule,
      mainpage: item.mainpage,
      subpage: item.subpage,
      subsubpage: item.subsubpage,
      createdby: item.createdby,
      category: item.category,
      subcategory: item.subcategory,
    };
  });

  // Excel
  const fileName = "RaiseProblemOnProgress";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Raise Problem OnProgress",
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


  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Raise Problem OnProgress.png");
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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    // setFilterValue(event.target.value);
    // setPage(1);
  };


  return (
    <Box>
      <Headtitle title={"RAISE PROBLEM ON PROGRESS"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="List Raise Problem On Progress"
        modulename="Support"
        submodulename="Raise Problem Filter"
        mainpagename="Raise Problem On Progress"
        subpagename=""
        subsubpagename=""
      />

      <>
        {isUserRoleCompare?.includes("lraiseproblemonprogress") && (
          <>
            <Box sx={userStyle.container}>
              {/* ******************************************************EXPORT Buttons****************************************************** */}
              <Grid container spacing={2}>
                <Grid container spacing={2}>
                  <Grid item xs={8}></Grid>
                </Grid>
              </Grid>
              <br />

              {/* ****** Table Grid Container ****** */}
              <Grid style={userStyle.dataTablestyle} >
                <Grid item md={2} xs={6} sm={6}>
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
                    <MenuItem value={totalProjects}>All</MenuItem>
                  </Select>
                </Grid>
                <Grid item md={8} xs={6} sm={6}>
                  <Grid>
                    {isUserRoleCompare?.includes(
                      "excelraiseproblemonprogress"
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
                    {isUserRoleCompare?.includes("csvraiseproblemonprogress") && (
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
                      "printraiseproblemonprogress"
                    ) && (
                        <>
                          <Button sx={userStyle.buttongrp} onClick={handleprint}>
                            &ensp;
                            <FaPrint />
                            &ensp;Print&ensp;
                          </Button>
                        </>
                      )}
                    {isUserRoleCompare?.includes("pdfraiseproblemonprogress") && (
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
                      "imageraiseproblemonprogress"
                    ) && (
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
                <Grid item md={2} xs={6} sm={6}>

                  {/* <AggregatedSearchBar
                    columnDataTable={columnDataTable}
                    setItems={setItems}
                    addSerialNumber={addSerialNumber}
                    setPage={setPage}
                    maindatas={overallRaiseproblem}
                    setSearchedString={setSearchedString}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    paginated={true}
                    totalDatas={overallRaiseproblem}
                  /> */}
                  <FormControl fullWidth size="small">
                    <OutlinedInput size="small"
                      id="outlined-adornment-weight"
                      startAdornment={
                        <InputAdornment position="start">
                          <FaSearch />
                        </InputAdornment>
                      }
                      endAdornment={
                        <InputAdornment position="end">
                          {advancedFilter && (
                            <IconButton onClick={handleResetSearch}>
                              <MdClose />
                            </IconButton>
                          )}
                          <Tooltip title="Show search options">
                            <span>
                              <IoMdOptions style={{ cursor: 'pointer', }} onClick={handleClickSearch} />
                            </span>
                          </Tooltip>
                        </InputAdornment>}
                      aria-describedby="outlined-weight-helper-text"
                      inputProps={{ 'aria-label': 'weight', }}
                      type="text"
                      value={getSearchDisplay()}
                      onChange={handleSearchChange}
                      placeholder="Type to search..."
                      disabled={!!advancedFilter}
                    />
                  </FormControl>
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
              </Button>{" "}
              <br />
              <br />
              {/* ****** Table start ****** */}
              {!loading ? (
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

                  <AggridTableForPaginationTable
                    rowDataTable={rowDataTable}
                    columnDataTable={columnDataTable}
                    columnVisibility={columnVisibility}
                    page={page}
                    setPage={setPage}
                    pageSize={pageSize}
                    totalPages={totalPages}
                    setColumnVisibility={setColumnVisibility}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                    gridRefTable={gridRefTable}
                    totalDatas={totalProjects}
                    setFilteredRowData={setFilteredRowData}
                    filteredRowData={filteredRowData}
                    gridRefTableImg={gridRefTableImg}
                    itemsList={overallRaiseproblem}
                  />
                  {/* <AggridTable
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
                    paginated={true}
                    filteredDatas={filteredDatas}
                    totalDatas={totalProjects}
                    searchQuery={searchQuery}
                    handleShowAllColumns={handleShowAllColumns}
                    setFilteredRowData={setFilteredRowData}
                    filteredRowData={filteredRowData}
                    setFilteredChanges={setFilteredChanges}
                    filteredChanges={filteredChanges}
                    gridRefTableImg={gridRefTableImg}
                    itemsList={overallRaiseproblem}
                  /> */}
                </>
              )}
              {/* ****** Table End ****** */}
            </Box>

            <Popover
              id={idSearch}
              open={openSearch}
              anchorEl={anchorElSearch}
              onClose={handleCloseSearch}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
            >
              <Box style={{ padding: "10px", maxWidth: '450px' }}>
                <Typography variant="h6">Advance Search</Typography>
                <IconButton
                  aria-label="close"
                  onClick={handleCloseSearch}
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                  }}
                >
                  <CloseIcon />
                </IconButton>
                <DialogContent sx={{ width: "100%" }}>
                  <Box sx={{
                    width: '350px',
                    maxHeight: '400px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <Box sx={{
                      maxHeight: '300px',
                      overflowY: 'auto',
                      // paddingRight: '5px'
                    }}>
                      <Grid container spacing={1}>
                        <Grid item md={12} sm={12} xs={12}>
                          <Typography>Columns</Typography>
                          <Select fullWidth size="small"
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 200,
                                  width: "auto",
                                },
                              },
                            }}
                            style={{ minWidth: 150 }}
                            value={selectedColumn}
                            onChange={(e) => setSelectedColumn(e.target.value)}
                            displayEmpty
                          >
                            <MenuItem value="" disabled>Select Column</MenuItem>
                            {filteredSelectedColumn.map((col) => (
                              <MenuItem key={col.field} value={col.field}>
                                {col.headerName}
                              </MenuItem>
                            ))}
                          </Select>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                          <Typography>Operator</Typography>
                          <Select fullWidth size="small"
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 200,
                                  width: "auto",
                                },
                              },
                            }}
                            style={{ minWidth: 150 }}
                            value={selectedCondition}
                            onChange={(e) => setSelectedCondition(e.target.value)}
                            disabled={!selectedColumn}
                          >
                            {conditions.map((condition) => (
                              <MenuItem key={condition} value={condition}>
                                {condition}
                              </MenuItem>
                            ))}
                          </Select>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                          <Typography>Value</Typography>
                          <TextField fullWidth size="small"
                            value={["Blank", "Not Blank"].includes(selectedCondition) ? "" : filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                            disabled={["Blank", "Not Blank"].includes(selectedCondition)}
                            placeholder={["Blank", "Not Blank"].includes(selectedCondition) ? "Disabled" : "Enter value"}
                            sx={{
                              '& .MuiOutlinedInput-root.Mui-disabled': {
                                backgroundColor: 'rgb(0 0 0 / 26%)',
                              },
                              '& .MuiOutlinedInput-input.Mui-disabled': {
                                cursor: 'not-allowed',
                              },
                            }}
                          />
                        </Grid>
                        {additionalFilters.length > 0 && (
                          <>
                            <Grid item md={12} sm={12} xs={12}>
                              <RadioGroup
                                row
                                value={logicOperator}
                                onChange={(e) => setLogicOperator(e.target.value)}
                              >
                                <FormControlLabel value="AND" control={<Radio />} label="AND" />
                                <FormControlLabel value="OR" control={<Radio />} label="OR" />
                              </RadioGroup>
                            </Grid>
                          </>
                        )}
                        {additionalFilters.length === 0 && (
                          <Grid item md={4} sm={12} xs={12} >
                            <Button variant="contained" onClick={handleAddFilter} sx={{ textTransform: "capitalize" }} disabled={["Blank", "Not Blank"].includes(selectedCondition) ? false : !filterValue || selectedColumn.length === 0}>
                              Add Filter
                            </Button>
                          </Grid>
                        )}

                        <Grid item md={2} sm={12} xs={12}>
                          <Button variant="contained" onClick={() => {
                            fetchRaise();
                            setIsSearchActive(true);
                            setAdvancedFilter([
                              ...additionalFilters,
                              { column: selectedColumn, condition: selectedCondition, value: filterValue }
                            ])
                          }} sx={{ textTransform: "capitalize" }} disabled={["Blank", "Not Blank"].includes(selectedCondition) ? false : !filterValue || selectedColumn.length === 0}>
                            Search
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                </DialogContent>
              </Box>
            </Popover>
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
        itemsTwo={allData ?? []}
        filename={"Raise Problem OnProgress"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
    </Box>
  );
}

export default RaiseProblemOnProgress;
