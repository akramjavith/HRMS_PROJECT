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
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import "jspdf-autotable";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Headtitle from "../../components/Headtitle";
import { MultiSelect } from "react-multi-select-component";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import Pagination from "../../components/Pagination";
import PageHeading from "../../components/PageHeading";
import { menuItems } from "../../components/menuItemsList";

function RaiseProblemlist() {
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const deduction = [
    { label: "Corrections", value: "Corrections" },
    { label: "Existings", value: "Existings" },
    { label: "New", value: "New" },
  ];

  let [valueModeAdd, setValueModeAdd] = useState([]);
  let [valueModuleAdd, setValueModuleAdd] = useState([]);
  let [valueSubModuleAdd, setValueSubModuleAdd] = useState([]);
  let [valueCategoryAdd, setValueCategoryAdd] = useState([]);
  let [valueSubCategoryAdd, setValueSubCategoryAdd] = useState([]);
  const [rolesNewList, setRolesNewList] = useState([]);
  const [subModuleOptions, setSubModuleOptions] = useState([]);


  const [selectedMode, setselectedMode] = useState([]);
  const [selectedModule, setselectedModule] = useState([]);
  const [selectedSubmodule, setselectedSubmodule] = useState([]);
  const [selectedCategory, setselectedCategory] = useState([]);
  const [selectedSubCategory, setselectedSubCategory] = useState([]);


  const customValueRendererModeAdd = (valueModeAdd, _companies) => {
    return valueModeAdd.length ? valueModeAdd.map(({ label }) => label)?.join(",") :
      <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Mode</span>
  }
  const customValueRendererModuleAdd = (valueModuleAdd, _companies) => {
    return valueModuleAdd.length ? valueModuleAdd.map(({ label }) => label)?.join(",") :
      <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Module</span>
  }
  const customValueRendererSubModuleAdd = (valueSubModuleAdd, _companies) => {
    return valueSubModuleAdd.length ? valueSubModuleAdd.map(({ label }) => label)?.join(",") :
      <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Sub Module</span>
  }
  const customValueRendererCategoryAdd = (valueCategoryAdd, _companies) => {
    return valueCategoryAdd.length ? valueCategoryAdd.map(({ label }) => label)?.join(",") :
      <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Category</span>
  }
  const customValueRendererSubCategoryAdd = (valueSubCategoryAdd, _companies) => {
    return valueSubCategoryAdd.length ? valueSubCategoryAdd.map(({ label }) => label)?.join(",") :
      <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Sub Category</span>
  }

  const handleModeChangeAdd = (options) => {
    setValueModeAdd(
      options.map(a => {
        return a.value;
      })
    )
    setselectedMode(options);
  }


  const handleModuleChangeAdd = (options) => {
    setValueModuleAdd(
      options.map(a => {
        return a.value;
      })
    )
    setselectedModule(options);
    const values = options?.length > 0 ? options : []
    handleModuleNameChange(values);
    setselectedSubmodule([])
    setValueSubModuleAdd("")
    selectedSubmodule?.length === 0 && setValueSubModuleAdd("")
    selectedCategory?.length === 0 && setValueCategoryAdd("")
  }

  const handleSubModuleChangeAdd = (options) => {
    setValueSubModuleAdd(
      options.map(a => {
        return a.value;
      })
    )
    setselectedSubmodule(options);
  }

  const handleCategoryChangeAdd = (options) => {
    setValueCategoryAdd(
      options.map(a => {
        return a.value;
      })
    )
    setselectedCategory(options);
    setselectedSubCategory([])
    setValueSubCategoryAdd("")
  }

  const handleSubCategoryChangeAdd = (options) => {
    setValueSubCategoryAdd(
      options.map(a => {
        return a.value;
      })
    )
    setselectedSubCategory(options);
  }


  //single select fetch Submodule
  const handleModuleNameChange = (modulename) => {
    const filteredMenuitems = menuItems?.filter(
      (item) => modulename?.some((modu) => modu.value === item.title)
    ) || [];

    if (filteredMenuitems.length === 0) {
      setSubModuleOptions([]);
      return;
    }

    const submodulerole = rolesNewList[0]?.submodulename?.map((item) => item) || [];

    const filteredSubModulename = filteredMenuitems
      ?.flatMap((menuItem) =>
        menuItem.submenu?.filter((item) => submodulerole.includes(item.title)) || []
      )
      .map((item) => ({
        label: item.title,
        value: item.title,
      }));

    setSubModuleOptions(filteredSubModulename);

    if (filteredSubModulename.length === 0) {
      console.log('No submodules available for the selected module.');
    }

    // setSelectedModuleName(options);
  };




  const exportallData = async () => {
    setPageName(!pageName)
    try {
      let res_branch = await axios.get(SERVICE.RAISEPROBLEM, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let role = isUserRoleAccess?.role?.includes("Manager");
      let data = res_branch?.data?.raises
        ?.filter((item) => {
          if (role) {
            return true;
          } else {
            return item.createdby === isUserRoleAccess?.username;
          }
        })
        ?.map((item, index) => ({
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
          Status: item.status,
          Autoid: item.autoid,
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
        })),
        fileName
      );
    } else if (isfilter === "overall") {
      let alldata = await exportallData();
      exportToCSV(
        alldata?.map((item, index) => ({
          "S.No": index + 1,
          Status: item.status,
          Autoid: item.autoid,
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
        })),
        fileName
      );
    }
    setIsFilterOpen(false);
  };

  const columns = [
    { title: "Auto Id", field: "autoid" },
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
          autoid: item.autoid,
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
        }))
        : alldata?.map((item, index) => ({
          serialNumber: index + 1,
          status: item.status,
          autoid: item.autoid,
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
  const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName } = useContext(
    UserRoleAccessContext
  );
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
    fetchRaise();
  }, [page, pageSize]);

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

  const fetchRaise = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.post(SERVICE.SKIPPED_RAISEPROBLEM, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        page: Number(page),
        pageSize: Number(pageSize),
        status: "All",
        role: isUserRoleAccess?.role,
        username: isUserRoleAccess?.username,
        mode: valueModeAdd,
        modulename: valueModuleAdd,
        submodulename: valueSubModuleAdd,
        category: valueCategoryAdd,
        subcategory: valueSubCategoryAdd,
      });

      const ans = res?.data?.result?.length > 0 ? res?.data?.result : [];
      const itemsWithSerialNumber = ans?.map((item, index) => ({
        ...item,
        serialNumber: (page - 1) * pageSize + index + 1,
        createddate: moment(item?.createdAt).format("DD-MM-YYYY"),
        createdtime: moment(item?.createdAt).format("hh:mm:ss A"),
      }));

      setRaise(itemsWithSerialNumber);
      setTotalProjects(ans?.length > 0 ? res?.data?.totalProjects : 0);
      setTotalPages(ans?.length > 0 ? res?.data?.totalPages : 0);
      setPageSize((data) => {
        return ans?.length > 0 ? data : 10;
      });
      setPage((data) => {
        return ans?.length > 0 ? data : 1;
      });
      setLoading(false);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchNewRoleList = async () => {
    setPageName(!pageName)
    try {
      let role_new = await axios.get(SERVICE.ROLE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const allRoles = role_new?.data?.roles.filter((item) =>
        isUserRoleAccess?.role?.includes(item?.name)
      );

      let mergedObject = {};
      allRoles.forEach((obj) => {
        const keysToInclude = [
          "modulename",
          "submodulename",
          "mainpagename",
          "subpagename",
          "subsubpagename",
        ];

        keysToInclude.forEach((key) => {
          if (!mergedObject[key]) {
            mergedObject[key] = [];
          }

          if (Array.isArray(obj[key])) {
            obj[key].forEach((item) => {
              if (!mergedObject[key].includes(item)) {
                mergedObject[key].push(item);
              }
            });
          } else {
            if (!mergedObject[key].includes(obj[key])) {
              mergedObject[key].push(obj[key]);
            }
          }
        });
      });
      setRolesNewList([mergedObject]);

      setselectedMode(deduction)
      setValueModeAdd(deduction.map(a => {
        return a.value;
      }))
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [categoryMaster, setCategoryMaster] = useState([]);


  const getCategory = async () => {
    setPageName(!pageName)
    try {
      let response = await axios.get(`${SERVICE.CATEGORYMASTERGETALL}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCategoryMaster(response.data.categorymaster);
      setCategoryOptions(
        response.data.categorymaster.map((item) => ({
          label: item.categoryname,
          value: item.categoryname,
        }))
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };


  useEffect(() => {
    fetchNewRoleList();
  }, []);

  useEffect(() => {
    getCategory();
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
    autoid: true,
    createddate: true,
    createdtime: true,
    // closedate: true,
    // closetime: true,
    createdby: true,
    category: true,
    subcategory: true,
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
      field: "autoid",
      headerName: "Auto Id",
      flex: 0,
      width: 100,
      hide: !columnVisibility.autoid,
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
      width: 130,
      hide: !columnVisibility.view,
      headerClassName: "bold-header",
      sortable: false,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          <>
            {params.row.status === "Details Needed" ? (
              <Link
                to={`/production/raiseprobledetailsneeded/${params.row.id}`}
                style={{
                  textDecoration: "none",
                  color: "#fff",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    height: "30px",
                    width: "120px",
                    fontSize: "0.75rem",
                    padding: "5px 10px",
                    minWidth: "unset",
                  }}
                  size="small"
                >
                  Upload Details
                </Button>
              </Link>
            ) : (
              <>
                {" "}
                {isUserRoleCompare?.includes("vraiseproblem") && (
                  <Link
                    to={`/production/raiseproblemview/${params.row.id}/statusupdate/list`}
                    style={{
                      textDecoration: "none",
                      color: "#fff",
                      minWidth: "0px",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      sx={userStyle.buttonadd}
                      size="small"
                    >
                      View
                    </Button>
                  </Link>
                )}
              </>
            )}
          </>
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
          {isUserRoleCompare?.includes("eraiseproblem") && (
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
                  }}
                >
                  <Button sx={userStyle.buttonedit}>
                    <EditOutlinedIcon style={{ fontsize: "large" }} />
                  </Button>
                </Link>
              )}{" "}
            </>
          )}

          {isUserRoleCompare?.includes("draiseproblemlist") && (
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
                    getinfoCode(params.row.id);
                    handleClickOpen();
                  }}
                >
                  <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
                </Button>
              )}{" "}
            </>
          )}
          {isUserRoleCompare?.includes("vraiseproblemlist") && (
            <Link
              to={`/production/raiseproblemview/${params.row.id}/view/list`}
              style={{ textDecoration: "none", color: "#fff" }}
            >
              <Button sx={userStyle.buttonedit}>
                <VisibilityOutlinedIcon style={{ fontSize: "large" }} />
              </Button>
            </Link>
          )}
          {isUserRoleCompare?.includes("iraiseproblemlist") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                getInfoDetails(params.row.id);
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
      autoid: item.autoid,
      priority: item.priority,
      createddate: item?.createddate,
      createdtime: item?.createdtime,
      closedate:
        item.status === "Closed"
          ? moment(new Date(item?.closedAt)).format("DD-MM-YYYY")
          : "",
      closetime:
        item.status === "Closed"
          ? moment(new Date(item?.closedAt)).format("hh:mm:ss A")
          : "",
      closedby: item.status === "Closed" ? item?.closedby : "",
      module: item.modulename,
      submodule: item.submodulename,
      mainpage: item.mainpagename,
      subpage: item.subpagename,
      subsubpage: item.subsubpagename,
      createdby: item.createdby,
      category: item.category,
      subcategory: item.subcategory,
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

  const getinfoCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.RAISEPROBLEM_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleDoc(res.data.sraises);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const getviewCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.delete(
        `${SERVICE.RAISEPROBLEM_SINGLE}/${singleDoc._id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
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

  const getInfoDetails = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.RAISEPROBLEM_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleDoc(res.data.sraises);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const delAccountcheckbox = async () => {
    setPageName(!pageName)
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      selectedMode.length === 0 &&
      selectedModule.length === 0 &&
      selectedSubmodule.length === 0 &&
      selectedCategory.length === 0 &&
      selectedSubCategory.length === 0
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Any One Field"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      fetchRaise();
    }
  };

  const handleCleared = () => {
    setShowAlert(
      <>
        <CheckCircleOutlineIcon
          sx={{ fontSize: "100px", color: "#7ac767" }}
        />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>
          {"Cleared Sucessfully"}
        </p>
      </>
    );
    handleClickOpenerr();
    setselectedSubCategory([])
    setselectedSubmodule([])
    setSubModuleOptions([])
    setselectedModule([])
    setselectedMode([])
    setselectedCategory([])
    setRaise([])
    setTotalProjects(0)
    setValueModuleAdd("");
    setValueSubModuleAdd("");
    setValueCategoryAdd("");
    setValueSubCategoryAdd("");
  }



  const [copiedData, setCopiedData] = useState("");


  return (
    <Box>
      <Headtitle title={"RAISE PROBLEM LIST"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="List Raise Problem"
        modulename="Support"
        submodulename="Raise Problem List"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />
      <Box sx={userStyle.selectcontainer}>
        <>
          <Grid container spacing={2}>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Mode
                </Typography>
                <MultiSelect
                  maxMenuHeight={300}
                  options={deduction}
                  value={selectedMode}
                  valueRenderer={customValueRendererModeAdd}
                  onChange={handleModeChangeAdd}
                />

              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Module
                </Typography>
                <MultiSelect
                  maxMenuHeight={300}
                  options={
                    Array.isArray(rolesNewList[0]?.modulename)
                      ? rolesNewList[0].modulename.map((item) => ({ label: item, value: item }))
                      : []
                  }
                  value={selectedModule}
                  valueRenderer={customValueRendererModuleAdd}
                  onChange={handleModuleChangeAdd}
                />

              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Sub Module
                </Typography>
                <MultiSelect
                  maxMenuHeight={300}
                  options={subModuleOptions}
                  value={selectedSubmodule}
                  valueRenderer={customValueRendererSubModuleAdd}
                  onChange={handleSubModuleChangeAdd}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Category
                </Typography>
                <MultiSelect
                  maxMenuHeight={300}
                  options={categoryOptions}
                  value={selectedCategory}
                  valueRenderer={customValueRendererCategoryAdd}
                  onChange={handleCategoryChangeAdd}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Sub Category
                </Typography>
                <MultiSelect
                  maxMenuHeight={300}
                  options={categoryMaster
                    .filter((item) =>
                      selectedCategory?.some((cat) => cat.value === item.categoryname)
                    )
                    .flatMap((item) =>
                      item.subcategoryname.map((subCatName) => ({
                        label: subCatName,
                        value: subCatName,
                      }))
                    )}
                  value={selectedSubCategory}
                  valueRenderer={customValueRendererSubCategoryAdd}
                  onChange={handleSubCategoryChangeAdd}
                />
              </FormControl>
            </Grid>
            <br />
            <br />
            <br />
          </Grid>
          <br />
          <br />
          <Grid
            container
            spacing={2}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Grid
              item
              md={1}
              xs={2}
              sm={2}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Filter
              </Button>
            </Grid>
            <Grid item lg={1} md={2} sm={2} xs={12}>
              <Button sx={userStyle.btncancel}
                onClick={handleCleared}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </>
      </Box>

      <br></br>
      <>

        {isUserRoleCompare?.includes("lraiseproblem") && (
          <>
            <Box sx={userStyle.container}>
              {/* ******************************************************EXPORT Buttons****************************************************** */}
              <Grid container spacing={2}>
                <Grid container spacing={2}>
                  <Grid item xs={8}></Grid>
                  <Grid item xs={4}>
                    {isUserRoleCompare?.includes("araiseproblemlist") && (
                      <>
                        <Link
                          to="/production/raiseproblem"
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
                  </Grid>
                </Grid>
              </Grid>
              <br />
              <Grid container sx={{ justifyContent: "center" }}>
                <Grid>
                  {isUserRoleCompare?.includes("excelraiseproblemlist") && (
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
                  {isUserRoleCompare?.includes("csvraiseproblemlist") && (
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
                  {isUserRoleCompare?.includes("printraiseproblemlist") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfraiseproblemlist") && (
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
                  {isUserRoleCompare?.includes("imageraiseproblemlist") && (
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
                {rowDataTable?.length > 0 ?
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
                  </Box> :
                  <Box></Box>
                }
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
              {isUserRoleCompare?.includes("bdraiseproblemlist") && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleClickOpenalert}
                >
                  Bulk Delete
                </Button>
              )}
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
                  {rowDataTable?.length > 0 &&
                    <>
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

                    </>}
                  <Box>
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
                    <StyledTableCell>Auto ID</StyledTableCell>
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
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {rowDataTable?.length > 0 ? (
                    rowDataTable?.map((row, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <TableCell>{row.autoid}</TableCell>
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
              Raise Problem Info
            </Typography>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">addedby</Typography>
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

export default RaiseProblemlist;