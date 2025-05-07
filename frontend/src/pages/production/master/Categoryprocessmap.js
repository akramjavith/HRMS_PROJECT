import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Button, Checkbox, Dialog, InputAdornment, DialogActions, DialogContent, FormControl, Grid, Tooltip, IconButton, List, ListItem, ListItemText, MenuItem, RadioGroup, FormControlLabel, Divider, Table, TableHead, TableBody, Radio, OutlinedInput, Popover, Select, TextField, Typography, TableContainer, Paper, TableRow, TableCell } from "@mui/material";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/system";
import axios from "axios";
import * as FileSaver from "file-saver";
import { saveAs } from "file-saver";
import { CsvBuilder } from "filefy";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaDownload, FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaTrash } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import Resizable from "react-resizable";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
import { DeleteConfirmation, PleaseSelectRow } from "../../../components/DeleteConfirmation.js";
import { handleApiError } from "../../../components/Errorhandling";
import Headtitle from "../../../components/Headtitle";
import InfoPopup from "../../../components/InfoPopup.js";
import AlertDialog from "../../../components/Alert.js";
import ExportData from "../../../components/ExportData.js";
import MessageAlert from "../../../components/MessageAlert.js";
import PageHeading from "../../../components/PageHeading";
import { StyledTableCell, StyledTableRow } from "../../../components/Table";
import StyledDataGrid from "../../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from "../../../context/Appcontext";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
import SendToServer from "../../sendtoserver";
import domtoimage from "dom-to-image";
import AggridTableForPaginationTable from "../../../components/AggridTableForPaginationTable.js";

function CategoryProcessMap() {
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

  const [categoryprocess, setCategoryprocess] = useState({
    company: "",
    branch: "",
    project: "",
    categoryname: "",
    subcategoryname: "",
    processtypes: "Primary",
  });

  const [categoryprocessEdit, setCategroyprocessEdit] = useState({
    company: "",
    branch: "",
    project: "",
    categoryname: "",
    subcategoryname: "",
    processtypes: "Primary",
  });
  const [updateSheet, setUpdatesheet] = useState([]);
  const [categoryprocessmaps, setCategoryprocessmaps] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [allCategoryprocessEdit, setAllCategoryprocessEdit] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);

  const accessbranch = isUserRoleAccess?.role?.includes("Manager")
    ? isAssignBranch?.map((data) => ({
        branch: data.branch,
        company: data.company,
      }))
    : isAssignBranch
        ?.filter((data) => {
          let fetfinalurl = [];

          if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
            fetfinalurl = data.subsubpagenameurl;
          } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
            fetfinalurl = data.subpagenameurl;
          } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
            fetfinalurl = data.mainpagenameurl;
          } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
            fetfinalurl = data.submodulenameurl;
          } else if (data?.modulenameurl?.length !== 0) {
            fetfinalurl = data.modulenameurl;
          } else {
            fetfinalurl = [];
          }

          const remove = [window.location.pathname?.substring(1), window.location.pathname];
          return fetfinalurl?.some((item) => remove?.includes(item));
        })
        ?.map((data) => ({
          branch: data.branch,
          company: data.company,
        }));

  const { auth } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

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

  // excelupload
  const [fileUploadName, setFileUploadName] = useState("");
  const [dataupdated, setDataupdated] = useState("");

  const [splitArray, setSplitArray] = useState([]);
  const [sheets, setSheets] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState("Please Select Sheet");
  const [selectedSheetindex, setSelectedSheetindex] = useState();

  const [categoryprocessCheck, setCategoryprocesscheck] = useState(false);

  const username = isUserRoleAccess.username;

  const gridRef = useRef(null);
  const gridRefFilename = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);

  const [searchQueryManage, setSearchQueryManage] = useState("");

  const [copiedData, setCopiedData] = useState("");
  const [processtypes, setProcesstypes] = useState("Primary");
  const [processtypesEdit, setProcesstypesEdit] = useState("Primary");

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };
  const [isFilterOpen2, setIsFilterOpen2] = useState(false);
  const [isPdfFilterOpen2, setIsPdfFilterOpen2] = useState(false);

  // page refersh reload
  const handleCloseFilterMod2 = () => {
    setIsFilterOpen2(false);
  };

  const handleClosePdfFilterMod2 = () => {
    setIsPdfFilterOpen2(false);
  };

  // This is create multi select
  // company
  const [selectedOptionsCom, setSelectedOptionsCom] = useState("Please Select Company");

  // branch
  const [selectedOptionsBran, setSelectedOptionsBran] = useState([]);
  let [valueBran, setValueBran] = useState("");

  const handleBranchChange = (options) => {
    setValueBran(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBran(options);
  };

  const customValueRendererBran = (valueBran, _branchs) => {
    return valueBran.length ? valueBran.map(({ label }) => label).join(", ") : "Please Select Branch";
  };

  // Project
  const [selectedOptionsProj, setSelectedOptionsProj] = useState([]);
  let [valueProj, setValueProj] = useState("");

  const handleProjectChange = (options) => {
    setValueProj(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsProj(options);
    setSelectedOptionsCate([])
    setSelectedOptionsSubCate([])
    setSubcategorys([])
  };

  const customValueRendererProj = (valueProj, _projects) => {
    return valueProj.length ? valueProj.map(({ label }) => label).join(", ") : "Please Select Project";
  };

  // Process
  const [selectedOptionsPro, setSelectedOptionsPro] = useState([]);
  let [valuePro, setValuePro] = useState("");

  const handleProcessChange = (options) => {
    setValuePro(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsPro(options);
  };

  const customValueRendererPro = (valuePro, _processs) => {
    return valuePro.length ? valuePro.map(({ label }) => label).join(", ") : "Please Select Process";
  };

  // This line edit functionality
  // company
  const [selectedOptionsComEdit, setSelectedOptionsComEdit] = useState("");
  // branch
  const [selectedOptionsBranEdit, setSelectedOptionsBranEdit] = useState("");

  // Project
  const [selectedOptionsProjEdit, setSelectedOptionsProjEdit] = useState("");

  // Process
  const [selectedOptionsProEdit, setSelectedOptionsProEdit] = useState("");

  const gridRefTableImg = useRef(null);

  //image

  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage
        .toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Category Process Map List.png");
        })
        .catch((err) => {
          handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        });
    }
  };

  // Category, Subcatgeory
  const [selectedOptionsCate, setSelectedOptionsCate] = useState([]);
  let [valueCate, setValueCate] = useState("");

  const handleCategoryChange = (options) => {
    setValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCate(options);
  };

  const customValueRendererCate = (valueCate, _categorys) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Category";
  };

  // Edit functionlity
  const [selectedOptionsCateEdit, setSelectedOptionsCateEdit] = useState("");

  // Subcategroy multi select
  const [selectedOptionsSubCate, setSelectedOptionsSubCate] = useState([]);
  let [valueSubCate, setValueSubCate] = useState("");

  const handleSubCategoryChange = (options) => {
    // setValueSubCate(
    //   options.map((a, index) => {
    //     return a.value;
    //   })
    // );
    // setSelectedOptionsSubCate(options);
  };

  const customValueRendererSubCate = (valueSubCate, _subcategorys) => {
    return valueSubCate.length ? valueSubCate.map(({ label }) => label).join(", ") : "Please Select Subcategory";
  };

  // Edit functionlity
  const [selectedOptionsSubCateEdit, setSelectedOptionsSubCateEdit] = useState("");
  let [valueSubCateEdit, setValueSubCateEdit] = useState("");

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
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showAlertpop, setShowAlertpop] = useState();
  const handleClickOpenerrpop = () => {
    setIsErrorOpenpop(true);
  };
  const handleCloseerrpop = () => {
    setIsErrorOpenpop(false);
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

  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };

  //Delete model
  const [isDeleteOpenFilename, setIsDeleteOpenFilename] = useState(false);

  const handleClickOpenFilename = () => {
    setIsDeleteOpenFilename(true);
  };
  const handleCloseModFilename = () => {
    setIsDeleteOpenFilename(false);
  };

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const handleClickOpenalert = () => {
    setIsHandleChange(true);

    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      setIsDeleteOpencheckbox(true);
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

  //SECOND DATATABLE
  const [pageFilename, setPageFilename] = useState(1);
  const [pageSizeFilename, setPageSizeFilename] = useState(10);
  const [itemsFilename, setItemsFilename] = useState([]);
  const [selectedRowsFilename, setSelectedRowsFilename] = useState([]);
  const [searchQueryFilename, setSearchQueryFilename] = useState("");
  const [isManageColumnsOpenFilename, setManageColumnsOpenFilename] = useState(false);
  const [anchorElFilename, setAnchorElFilename] = useState(null);
  const [selectAllCheckedFilename, setSelectAllCheckedFilename] = useState(false);
  const [searchQueryManageFilename, setSearchQueryManageFilename] = useState("");
  const [minimumPointDataFilename, setMinimumPointDataFilename] = useState([]);

  //SECOND TABLE FDATA AND FUNCTIONS

  const [deleteFilenameData, setDeletefilenamedata] = useState([]);
  const [minimumPointFilename, setMinimumPointFilename] = useState([]);
  const rowDatafileNameDelete = async (filename) => {
    setPageName(!pageName);
    try {
      let Res = await axios.get(SERVICE.CATEGORYPROCESSMAP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let getFilenames = Res?.data?.categoryprocessmaps.filter((item) => item.filename === filename).map((item) => item._id);
      setDeletefilenamedata(getFilenames);
      handleClickOpenFilename();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [overallCategoryProcess, setOverallCategoryProcessmap] = useState([]);

  const overallCategoryProcessmap = async () => {
    setPageName(!pageName);
    try {
      let Res = await axios.get(SERVICE.CATEGORYPROCESSMAP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let getFilenames = Res?.data?.categoryprocessmaps.map((item, index) => {
        return {
          id: item._id,
          serialNumber: index + 1,
          company: item.company,
          branch: item.branch,
          process: item.process,
          project: item.project,
          categoryname: item.categoryname,
          subcategoryname: item.subcategoryname,
          processtypes: item.processtypes,
        };
      });
      setOverallCategoryProcessmap(getFilenames);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const deleteFilenameList = async () => {
    setPageName(!pageName);
    try {
      if (deleteFilenameData.length != 0) {
        setCategoryprocesscheck(false);
        const deletePromises = await axios.post(SERVICE.CATEGORYPROCESSMAP_BULKDELETE, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          ids: [...deleteFilenameData],
        });
        if (deletePromises?.data?.success) {
          // await fetchCategoryProcessMap();
          await fetchEmployee();

          setCategoryprocesscheck(true);
          handleCloseMod();
          setSelectedRows([]);
          setSelectAllChecked(false);
          setPage(1);
          handleCloseModFilename();

          setPopupContent("Deleted Successfully");
          setPopupSeverity("success");
          handleClickOpenPopup();
        } else {
          setCategoryprocesscheck(true);
          handleCloseMod();
          setSelectedRows([]);
          setSelectAllChecked(false);
          setPage(1);
          // await fetchCategoryProcessMap();
          await fetchEmployee();
        }
      } else {
        setPopupContentMalert("No Data to Delete");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    } catch (err) {
      setCategoryprocesscheck(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // Manage Columns
  const handleOpenManageColumnsFilename = (event) => {
    setAnchorElFilename(event.currentTarget);
    setManageColumnsOpenFilename(true);
  };
  const handleCloseManageColumnsFilename = () => {
    setManageColumnsOpenFilename(false);
    setSearchQueryManageFilename("");
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibilityFilename = {
    serialNumber: true,
    checkbox: true,
    branch: true,
    company: true,
    filename: true,
    // lastupload: true,
    actions: true,
  };
  const [columnVisibilityFilename, setColumnVisibilityFilename] = useState(initialColumnVisibilityFilename);

  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem("columnVisibilityFilename", JSON.stringify(columnVisibilityFilename));
  }, [columnVisibilityFilename]);

  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem("columnVisibilityFilename");
    if (savedVisibility) {
      setColumnVisibilityFilename(JSON.parse(savedVisibility));
    }
  }, []);

  const handleSelectionChangeFilename = (newSelection) => {
    setSelectedRowsFilename(newSelection.selectionModel);
  };

  //image
  const handleCaptureImageFilename = () => {
    if (gridRefFilename.current) {
      html2canvas(gridRefFilename.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Upload File List.png");
        });
      });
    }
  };

  // pdf.....
  const columnsFilename = [
    { title: "Company", field: "company" },
    { title: "Branch", field: "branch" },
    { title: "File Name", field: "filename" },
  ];
  //  pdf download functionality
  const downloadPdfFilename = () => {
    const doc = new jsPDF();
    doc.autoTable({
      theme: "grid",
      columns: columnsFilename.map((col) => ({ ...col, dataKey: col.field })),
      body: rowDataTableFilename,
    });
    doc.save("Category_Process_Map_File_Name.pdf");
  };

  // Excel
  const fileNames = "Category_Process_Map_File_Name";

  //print...
  const componentRefFilename = useRef();
  const handleprintFilename = useReactToPrint({
    content: () => componentRefFilename.current,
    documentTitle: "Upload File List",
    pageStyle: "print",
  });
  //serial no for listing itemsFilename
  const addSerialNumberFilename = () => {
    const itemsWithSerialNumber = minimumPointFilename?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItemsFilename(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumberFilename();
  }, [minimumPointFilename]);

  //Datatable
  const handlePageChangeFilename = (newPage) => {
    setPageFilename(newPage);
    setSelectedRowsFilename([]);
    setSelectAllCheckedFilename(false);
  };
  const handlePageSizeChangeFilename = (event) => {
    setPageSizeFilename(Number(event.target.value));
    setSelectedRowsFilename([]);
    setSelectAllCheckedFilename(false);
    setPageFilename(1);
  };
  //datatable....
  const handleSearchChangeFilename = (event) => {
    setSearchQueryFilename(event.target.value);
    setPageFilename(1);
  };

  // Split the search query into individual terms
  const searchTermsFilename = searchQueryFilename.toLowerCase().split(" ");

  // Modify the filtering logic to check each term
  const filteredDatasFilename = itemsFilename?.filter((item) => {
    return searchTermsFilename.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  const FilenameFilename = filteredDatasFilename?.slice((pageFilename - 1) * pageSizeFilename, pageFilename * pageSizeFilename);
  const totalPagesFilename = Math.ceil(filteredDatasFilename?.length / pageSizeFilename);
  const visiblePagesFilename = Math.min(totalPagesFilename, 3);
  const firstVisiblePageFilename = Math.max(1, pageFilename - 1);
  const lastVisiblePageFilename = Math.min(firstVisiblePageFilename + visiblePagesFilename - 1, totalPagesFilename);

  const pageNumbersFilename = [];
  for (let i = firstVisiblePageFilename; i <= lastVisiblePageFilename; i++) {
    pageNumbersFilename.push(i);
  }

  const CheckboxHeaderFilename = ({ selectAllCheckedFilename, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllCheckedFilename} onChange={onSelectAll} />
    </div>
  );
  const columnDataTableFilename = [
    {
      field: "checkbox",
      headerName: "Checkbox",
      headerStyle: {
        fontWeight: "bold", // Apply the font-weight style to make the header text bold
        // Add any other CSS styles as needed
      },
      renderHeader: (params) => (
        <CheckboxHeaderFilename
          selectAllCheckedFilename={selectAllCheckedFilename}
          onSelectAll={() => {
            if (rowDataTableFilename.length === 0) {
              // Do not allow checking when there are no rows
              return;
            }
            if (selectAllCheckedFilename) {
              setSelectedRowsFilename([]);
            } else {
              const allRowIds = rowDataTableFilename.map((row) => row.id);
              setSelectedRowsFilename(allRowIds);
            }
            setSelectAllCheckedFilename(!selectAllCheckedFilename);
          }}
        />
      ),

      renderCell: (params) => (
        <Checkbox
          checked={selectedRowsFilename.includes(params.row.id)}
          onChange={() => {
            let updatedSelectedRows;
            if (selectedRowsFilename.includes(params.row.id)) {
              updatedSelectedRows = selectedRowsFilename.filter((selectedId) => selectedId !== params.row.id);
            } else {
              updatedSelectedRows = [...selectedRowsFilename, params.row.id];
            }
            setSelectedRowsFilename(updatedSelectedRows);
            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllCheckedFilename(updatedSelectedRows.length === FilenameFilename.length);
          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 90,
      hide: !columnVisibilityFilename.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 100,
      hide: !columnVisibilityFilename.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 180,
      hide: !columnVisibilityFilename.company,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 180,
      hide: !columnVisibilityFilename.branch,
      headerClassName: "bold-header",
    },
    {
      field: "filename",
      headerName: "File Name",
      flex: 0,
      width: 350,
      hide: !columnVisibilityFilename.filename,
      headerClassName: "bold-header",
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 250,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibilityFilename.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("dcategoryprocessmap") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowDatafileNameDelete(params.row.filename);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
        </Grid>
      ),
    },
  ];

  const rowDataTableFilename = FilenameFilename.map((item, index) => {
    return {
      id: item.serialNumber,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      filename: item.filename,
      // lastupload: moment(item.lastupload).format("DD-MM-YYYY hh:mm:ss a"),
    };
  });
  const rowsWithCheckboxesFilename = rowDataTableFilename.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRowsFilename.includes(row.id),
  }));
  // Show All Columns functionality
  const handleShowAllColumnsFilename = () => {
    const updatedVisibility = { ...columnVisibilityFilename };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibilityFilename(updatedVisibility);
  };
  // Function to filter columns based on search query
  const filteredColumnsFilename = columnDataTableFilename.filter((column) => column.headerName.toLowerCase().includes(searchQueryManageFilename.toLowerCase()));
  // Manage Columns functionality
  const toggleColumnVisibilityFilename = (field) => {
    setColumnVisibilityFilename((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };
  // JSX for the "Manage Columns" popover content
  const manageColumnsContentFilename = (
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
        onClick={handleCloseManageColumnsFilename}
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
        <TextField label="Find column" variant="standard" fullWidth value={searchQueryManageFilename} onChange={(e) => setSearchQueryManageFilename(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
      </Box>
      <br />
      <br />
      <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumnsFilename.map((column) => (
            <ListItem key={column.field}>
              <ListItemText sx={{ display: "flex" }} primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibilityFilename[column.field]} onChange={() => toggleColumnVisibilityFilename(column.field)} />} secondary={column.field === "checkbox" ? "Checkbox" : column.headerName} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Grid container>
          <Grid item md={4}>
            <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibilityFilename(initialColumnVisibilityFilename)}>
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
                columnDataTableFilename.forEach((column) => {
                  newColumnVisibility[column.field] = false; // Set hide property to true
                });
                setColumnVisibilityFilename(newColumnVisibility);
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

  // Styles for the resizable column
  const ResizableColumn = styled(Resizable)`
    .react-resizable-handle {
      width: 10px;
      height: 100%;
      position: absolute;
      right: 0;
      bottom: 0;
      cursor: col-resize;
    }
  `;

  const getRowClassName = (params) => {
    if (selectedRowsFilename.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    company: true,
    branch: true,
    process: true,
    project: true,
    categoryname: true,
    subcategoryname: true,
    processtypes: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  const [deleteCategoryprocess, setDeleteCategoryprocess] = useState("");

  const rowData = async (id, name) => {
    setPageName(!pageName);
    try {
      setDeleteCategoryprocess(id);
      handleClickOpen();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // Alert delete popup
  // let Categoryprocesssid = deleteCategoryprocess
  const delCategoryProcess = async () => {
    setPageName(!pageName);
    try {
      if (deleteCategoryprocess) {
        await axios.delete(`${SERVICE.CATEGORYPROCESSMAP_SINGLE}/${deleteCategoryprocess}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        // await fetchCategoryProcessMap();
        await fetchEmployee();

        handleCloseMod();
        setSelectedRows([]);
        setPage(1);

        setPopupContent("Deleted Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const delCategoryprocesscheckbox = async () => {
    setPageName(!pageName);
    try {
      setCategoryprocesscheck(false);
      const deletePromises = await axios.post(SERVICE.CATEGORYPROCESSMAP_BULKDELETE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        ids: [...selectedRows],
      });
      if (deletePromises?.data?.success) {
        // await fetchCategoryProcessMap();
        await fetchEmployee();

        setCategoryprocesscheck(true);
        setIsHandleChange(false);

        handleCloseModcheckbox();
        setSelectedRows([]);
        setSelectAllChecked(false);
        setPage(1);

        setPopupContent("Deleted Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
      } else {
        setCategoryprocesscheck(true);
        handleCloseModcheckbox();
        setSelectedRows([]);
        setSelectAllChecked(false);
        setPage(1);
        // await fetchCategoryProcessMap();
        await fetchEmployee();
      }
    } catch (err) {
      setCategoryprocesscheck(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [categorys, setCategorys] = useState([]);
  const [subcategorys, setSubcategorys] = useState([]);
  const [projects, setProjects] = useState([]);
  const [processs, setProcesss] = useState([]);

  const [categorysEdit, setCategorysEdit] = useState([]);
  const [subcategorysEdit, setSubcategorysEdit] = useState([]);
  const [projectsEdit, setProjectsEdit] = useState([]);
  const [processsEdit, setProcesssEdit] = useState([]);

  const fetchCategoryTicket = async () => {
    setPageName(!pageName);
    try {
      let res_category = await axios.get(SERVICE.CATEGORYPROD, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCategorys(res_category.data.categoryprod);
      setCategorysEdit(res_category.data.categoryprod);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const [subcategorysall, setSubcategorysall] = useState([]);
  const fetchCategoryBased = async (e) => {
    let employ = e.map((item) => item.value);

    setPageName(!pageName);
    try {
      let res_category = await axios.get(SERVICE.SUBCATEGORYPROD, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let data_set = res_category.data.subcategoryprod.filter((data) => employ.includes(data.categoryname) && valueProj.includes(data.project));
      setSubcategorysall(data_set);
      let filter_opt = [...new Set(data_set.map((d) => d.name))];

      // Convert to desired format
      const transformedCategory = filter_opt.map((data) => ({
        label: data,
        value: data,
      }));

      setSubcategorys(transformedCategory);
      setSelectedOptionsSubCate(transformedCategory);
      setValueSubCate(
        transformedCategory.map((a, index) => {
          return a.value;
        })
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchCategoryBasedEdit = async (e, changeproject) => {
    // let employ = e.map((item) => item.value);
    setPageName(!pageName);
    try {
      let res_category = await axios.get(SERVICE.SUBCATEGORYPROD, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let data_set = res_category?.data?.subcategoryprod
        .filter((data) => {
          return e === data.categoryname && changeproject === data.project;
        })
        .map((value) => value.name);

      let ans = [].concat(...data_set);

      let filter_opt = [...new Set(ans)];

      setSubcategorysEdit(
        filter_opt.map((data) => ({
          ...data,
          label: data,
          value: data,
        }))
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchProjectDropdowns = async () => {
    setPageName(!pageName);
    try {
      let res_proj = await axios.get(SERVICE.PROJECTMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const projall = [
        ...res_proj?.data?.projmaster.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];

      setProjects(projall);
      setProjectsEdit(projall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchProcessDropdowns = async (e) => {
    let ans = e ? e.map((data) => data.value) : [];

    setPageName(!pageName);
    try {
      let res_proj = await axios.get(SERVICE.ALL_PROCESSQUEUENAME, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let pro = res_proj?.data?.processqueuename
        .filter((data) => ans.includes(data.branch) && selectedOptionsCom === data.company)
        .map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        }));

      setProcesss(pro);
      // setProcesssEdit(proall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchProcessDropdownsEdit = async (company, e) => {
    // let ans = e ? e.map((data) => data.value) : [];
    setPageName(!pageName);
    try {
      let res_proj = await axios.get(SERVICE.ALL_PROCESSQUEUENAME, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const pro = res_proj?.data?.processqueuename.filter((data) => e === data.branch && company === data.company);
      const proall = [
        ...pro.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];

      setProcesssEdit(proall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Category Process Map"),
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

  useEffect(() => {
    getapi();
    fetchProjectDropdowns();
    fetchCategoryTicket();
    overallCategoryProcessmap();
  }, []);

  //add function
  const sendRequest = async (data) => {
    setPageName(!pageName);
    try {
      data?.map((item) => {
        return axios.post(`${SERVICE.CATEGORYPROCESSMAP_CREATE}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          company: String(item.company),
          branch: String(item.branch),
          process: String(item.process),
          categoryname: String(item.category),
          subcategoryname: String("ALL"),
          project: String(item.project),
          processtypes: String(item.processtype),
          filename: "nonexcel",
          addedby: [
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        });
      });
      // await fetchCategoryProcessMap();
      await fetchEmployee();

      setCategoryprocess({ ...categoryprocess });

      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //submit option for saving
  const handleSubmit = (e) => {
    let branchs = selectedOptionsBran.map((item) => item.value);
    let processs = selectedOptionsPro.map((item) => item.value);
    let slicedProcesss = selectedOptionsPro.map((item) => item.value.slice(-4));
    let projects = selectedOptionsProj.map((item) => item.value);
    let categorys = selectedOptionsCate.map((item) => item.value);
    let subcategoryies = selectedOptionsSubCate.map((item) => item.value);
    e.preventDefault();

    const isNameMatch = categoryprocessmaps.some((item) => item.processtypes === processtypes && item.company === selectedOptionsCom && branchs.includes(item.branch) && processs.includes(item.process) && projects.includes(item.project) && categorys.includes(item.categoryname) && "ALL" === item.subcategoryname);

    const isNameMatchWithProCType = processtypes === "Primary" ? categoryprocessmaps.filter((item) => item.company === selectedOptionsCom && item.processtypes === "Primary" && branchs.includes(item.branch) && slicedProcesss.includes(item.process.slice(-4)) && projects.includes(item.project) && categorys.includes(item.categoryname) && "ALL" === item.subcategoryname) : [];

    // const isNameMatchWithProCType/ = processtypes === "Primary" ?  categoryprocessmaps.filter((item) => item.company === selectedOptionsCom && item.processtypes === "Primary" && branchs.includes(item.branch) && slicedProcesss.includes(item.process.slice(-4)) && projects.includes(item.project) && categorys.includes(item.categoryname) && subcategoryies.includes(item.subcategoryname)) : [];

    const result_mappeddata = [];
    // Iterate through categories
    categorys.forEach((cat) => {
      result_mappeddata.push({ category: cat, company: selectedOptionsCom, processtype: processtypes, subcategory: "ALL" });
    });

    // Map projects and combine with existing items
    const withProjects = result_mappeddata.flatMap((item) => {
      return projects.map((proj) => ({ ...item, project: proj }));
    });

    // Map processes and combine with existing items
    const withProcesses = withProjects.flatMap((item) => {
      return processs.map((proc) => ({ ...item, process: proc }));
    });

    // Map branches and combine with existing items
    const withBranches = withProcesses.flatMap((item) => {
      return branchs.map((branch) => ({ ...item, branch: branch }));
    });

    if (selectedOptionsCom === "Please Select Company") {
      setPopupContentMalert("Please Select Company");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsBran.length === 0) {
      setPopupContentMalert("Please Select Branch");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsPro.length === 0) {
      setPopupContentMalert("Please Select Process");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsProj.length === 0) {
      setPopupContentMalert("Please Select Project");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsCate.length === 0) {
      setPopupContentMalert("Please Select Category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Data already exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (processtypes === "Primary" && isNameMatchWithProCType.length > 0) {
      setPopupContentMalert(`${isNameMatchWithProCType.map((item) => item.process)} These Process already added for this category, subcategory and branch!`);
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest(withBranches);
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setCategoryprocess({ processtypes: "Primary" });
    setProcesstypes("Primary");
    // setValueComp([]);
    setValueBran([]);
    setValuePro([]);
    setValueProj([]);
    setValueCate([]);
    setValueSubCate([]);
    setSelectedOptionsCate([]);
    setSelectedOptionsBran([]);
    setSelectedOptionsCom("Please Select Company");
    setSelectedOptionsPro([]);
    setSelectedOptionsProj([]);
    setSubcategorys([]);
    setProcesss([]);
    setSelectedOptionsSubCate([]);

    setFileUploadName("");
    setSplitArray([]);
    setDataupdated("");
    setSheets([]);
    setSelectedSheet("Please Select Sheet");
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
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.CATEGORYPROCESSMAP_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCategroyprocessEdit(res?.data?.scategoryprocessmap);
      fetchProcessDropdownsEdit(res?.data?.scategoryprocessmap?.company, res?.data?.scategoryprocessmap?.branch);
      fetchCategoryBasedEdit(res?.data?.scategoryprocessmap?.categoryname, res?.data?.scategoryprocessmap?.project);
      setSelectedOptionsComEdit(res?.data?.scategoryprocessmap?.company);
      setSelectedOptionsBranEdit(res?.data?.scategoryprocessmap?.branch);
      setSelectedOptionsProEdit(res?.data?.scategoryprocessmap?.process);
      setSelectedOptionsProjEdit(res?.data?.scategoryprocessmap?.project);
      setSelectedOptionsCateEdit(res?.data?.scategoryprocessmap?.categoryname);
      setSelectedOptionsSubCateEdit(res?.data?.scategoryprocessmap?.subcategoryname);
      setProcesstypesEdit(res?.data?.scategoryprocessmap?.processtypes);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.CATEGORYPROCESSMAP_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCategroyprocessEdit(res?.data?.scategoryprocessmap);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.CATEGORYPROCESSMAP_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCategroyprocessEdit(res?.data?.scategoryprocessmap);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //Project updateby edit page...
  let updateby = categoryprocessEdit?.updatedby;
  let addedby = categoryprocessEdit?.addedby;

  let subprojectsid = categoryprocessEdit?._id;

  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.put(`${SERVICE.CATEGORYPROCESSMAP_SINGLE}/${subprojectsid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        // company: String(categoryprocessEdit.company),
        company: selectedOptionsComEdit,
        branch: selectedOptionsBranEdit,
        process: selectedOptionsProEdit,
        project: selectedOptionsProjEdit,
        categoryname: selectedOptionsCateEdit,
        subcategoryname: selectedOptionsSubCateEdit,
        processtypes: String(processtypesEdit),
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      // await fetchCategoryProcessMap();
      fetchEmployee();
      handleCloseModEdit();

      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const editSubmit = async (e) => {
    e.preventDefault();
    let resdata = await fetchCategoryProcessMapAll();

    const isNameMatch = resdata.some((item) => item.processtypes === processtypesEdit && item.company === selectedOptionsComEdit && item.branch === selectedOptionsBranEdit && item.process === selectedOptionsProEdit && item.project === selectedOptionsProjEdit && item.categoryname === selectedOptionsCateEdit && item.subcategoryname === selectedOptionsSubCateEdit);

    // const isNameMatch = categoryprocessmaps.some((item) => item.processtypes === processtypes && item.company === selectedOptionsCom && branchs.includes(item.branch) && processs.includes(item.process) && projects.includes(item.project) && categorys.includes(item.categoryname) && subcategoryies.includes(item.subcategoryname));

    const isNameMatchWithProCType = processtypesEdit === "Primary" ? allCategoryprocessEdit.filter((item) => item.company === selectedOptionsComEdit && item.processtypes === "Primary" && selectedOptionsBranEdit === item.branch && selectedOptionsProEdit.slice(-4) === item.process.slice(-4) && selectedOptionsProjEdit === item.project && selectedOptionsCateEdit === item.categoryname && selectedOptionsSubCateEdit === item.subcategoryname) : [];

    if (selectedOptionsComEdit === "Please Select Company") {
      setPopupContentMalert("Please Select Company");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsBranEdit === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsProEdit === "Please Select Process") {
      setPopupContentMalert("Please Select Process");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsProjEdit === "Please Select Project") {
      setPopupContentMalert("Please Select Project");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsCateEdit === "Please Select Category") {
      setPopupContentMalert("Please Select Category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsSubCateEdit === "Please Select  Subcategory") {
      setPopupContentMalert("Please Select  Subcategory");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Data already exits!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (processtypesEdit === "Primary" && isNameMatchWithProCType.length > 0) {
      setPopupContentMalert(`${isNameMatchWithProCType.map((item) => item.process)} These Process already added for this category, subcategory and branch!`);
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendEditRequest();
    }
  };

  const [categoryprocessmapsArray, setCategoryprocessmapsArray] = useState([]);
  const [minimumPointFilenameArray, setMinimumPointFilenameArray] = useState([]);

  //get all Sub vendormasters.
  const fetchCategoryProcessMapArray = async () => {
    setPageName(!pageName);
    try {
      let res_vendor = await axios.post(
        SERVICE.CATEGORYPROCESSMAPASSIGNBRANCH,
        {
          assignbranch: accessbranch,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setCategoryprocesscheck(true);
      setCategoryprocessmapsArray(res_vendor?.data?.categoryprocessmaps);

      let getFilenames = res_vendor?.data?.categoryprocessmaps.filter((item) => item.filename !== "nonexcel");
      const uniqueArray = Array.from(new Set(getFilenames.map((obj) => obj.filename))).map((filename) => {
        return getFilenames.find((obj) => obj.filename === filename);
      });
      // const uniqueArray = Array.from(new Set(getFilenames));
      setMinimumPointFilenameArray(uniqueArray);
    } catch (err) {
      setCategoryprocesscheck(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchCategoryProcessMapArray();
  }, [isFilterOpen]);

  const [overallFilterdata, setOverallFilterdata] = useState([]);
  const [overallFilterdataforsearch, setOverallFilterdataforsearch] = useState([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchEmployee = async () => {
    setPageName(!pageName);
    const queryParams = {
      page: Number(page),
      pageSize: Number(pageSize),
      searchQuery: searchQuery,
      assignbranch: accessbranch,
    };

    const allFilters = [...additionalFilters, { column: selectedColumn, condition: selectedCondition, value: filterValue }];

    if (allFilters.length > 0 && selectedColumn !== "") {
      queryParams.allFilters = allFilters;
      queryParams.logicOperator = logicOperator;
    } else if (searchQuery) {
      queryParams.searchQuery = searchQuery;
    }

    try {
      let res_employee = await axios.post(SERVICE.CATEGORYPROCESSMAP_SORT, queryParams, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : [];
      const itemsWithSerialNumber = ans?.map((item, index) => ({
        ...item,
        serialNumber: (page - 1) * pageSize + index + 1,
        // serialNumber: index + 1,
      }));

      const ansFilename = res_employee?.data?.totalProjectsOverall?.length > 0 ? res_employee?.data?.totalProjectsOverall : [];

      let getFilenames = ansFilename.filter((item) => item.filename !== "nonexcel");
      const uniqueArray = Array.from(new Set(getFilenames.map((obj) => obj.filename))).map((filename) => {
        return getFilenames.find((obj) => obj.filename === filename);
      });

      const itemsWithSerialNumberFileName = uniqueArray?.map((item, index) => ({
        ...item,
        serialNumber: (page - 1) * pageSize + index + 1,
        // serialNumber: index + 1,
      }));

      const itemsWithSerialNumberFileNameforfile = ansFilename?.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
        // serialNumber: index + 1,
      }));

      setMinimumPointFilename(itemsWithSerialNumberFileName);
      setCategoryprocessmaps(ansFilename);
      setOverallFilterdata(itemsWithSerialNumber);
      setOverallFilterdataforsearch(itemsWithSerialNumberFileNameforfile);
      setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
      setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);

      setPageSize((data) => {
        return ans?.length > 0 ? data : 10;
      });
      setPage((data) => {
        return ans?.length > 0 ? data : 1;
      });
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

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
  const idSearch = openSearch ? "simple-popover" : undefined;

  const handleAddFilter = () => {
    if ((selectedColumn && filterValue) || ["Blank", "Not Blank"].includes(selectedCondition)) {
      setAdditionalFilters([...additionalFilters, { column: selectedColumn, condition: selectedCondition, value: filterValue }]);
      setSelectedColumn("");
      setSelectedCondition("Contains");
      setFilterValue("");
    }
  };

  const getSearchDisplay = () => {
    if (advancedFilter && advancedFilter.length > 0) {
      return advancedFilter
        .map((filter, index) => {
          let showname = columnDataTable.find((col) => col.field === filter.column)?.headerName;
          return `${showname} ${filter.condition} "${filter.value}"`;
        })
        .join(" " + (advancedFilter.length > 1 ? advancedFilter[1].condition : "") + " ");
    }
    return searchQuery;
  };

  const handleResetSearch = async () => {
    setPageName(!pageName);
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
      searchQuery: searchQuery,
      assignbranch: accessbranch,
    };

    const allFilters = [];
    // Only include advanced filters if they exist, otherwise just use regular searchQuery
    if (allFilters.length > 0 && selectedColumn !== "") {
      queryParams.allFilters = allFilters;
      queryParams.logicOperator = logicOperator;
    } else if (searchQuery) {
      queryParams.searchQuery = searchQuery; // Use searchQuery for regular search
    }

    try {
      let res_employee = await axios.post(SERVICE.CATEGORYPROCESSMAP_SORT, queryParams, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : [];
      const itemsWithSerialNumber = ans?.map((item, index) => ({
        ...item,
        serialNumber: (page - 1) * pageSize + index + 1,
        // serialNumber: index + 1,
      }));

      const ansFilename = res_employee?.data?.totalProjectsOverall?.length > 0 ? res_employee?.data?.totalProjectsOverall : [];

      let getFilenames = ansFilename.filter((item) => item.filename !== "nonexcel");
      const uniqueArray = Array.from(new Set(getFilenames.map((obj) => obj.filename))).map((filename) => {
        return getFilenames.find((obj) => obj.filename === filename);
      });

      const itemsWithSerialNumberFileName = uniqueArray?.map((item, index) => ({
        ...item,
        serialNumber: (page - 1) * pageSize + index + 1,
        // serialNumber: index + 1,
      }));

      const itemsWithSerialNumberFileNameforfile = ansFilename?.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
        // serialNumber: index + 1,
      }));

      setMinimumPointFilename(itemsWithSerialNumberFileName);
      setCategoryprocessmaps(ansFilename);
      setOverallFilterdata(itemsWithSerialNumber);
      setOverallFilterdataforsearch(itemsWithSerialNumberFileNameforfile);
      setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
      setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);

      setPageSize((data) => {
        return ans?.length > 0 ? data : 10;
      });
      setPage((data) => {
        return ans?.length > 0 ? data : 1;
      });
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, [page, pageSize, searchQuery]);

  const fetchCategoryProcessMapAll = async () => {
    setPageName(!pageName);
    try {
      let res_meet = await axios.get(SERVICE.CATEGORYPROCESSMAP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      return res_meet?.data?.categoryprocessmaps.filter((item) => item._id !== categoryprocessEdit._id);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  let exportColumnNames = ["Company", "Branch", "Process", "Project", "Category", "Subcategory", "Mode"];
  let exportRowValues = ["company", "branch", "process", "project", "categoryname", "subcategoryname", "processtypes"];

  // pdf.....
  const columns = [
    { title: "Company", field: "company" },
    { title: "Branch", field: "branch" },
    { title: "Process", field: "process" },
    { title: "Project", field: "project" },
    { title: "Category", field: "categoryname" },
    { title: "Subcategory", field: "subcategoryname" },
    { title: "Mode", field: "processtypes" },
  ];

  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();

    let serialNumberCounter = 1;

    const columnsWithSerial = [{ title: "SNo", dataKey: "serialNumber" }, ...columnsFilename.map((col) => ({ ...col, dataKey: col.field }))];

    const dataWithSerial = isfilter === "filtered" ? rowDataTableFilename.map((row) => ({ ...row, serialNumber: serialNumberCounter++ })) : minimumPointFilenameArray.map((row) => ({ ...row, serialNumber: serialNumberCounter++ }));

    doc.autoTable({
      theme: "grid",
      styles: {
        fontSize: 4,
        cellWidth: "auto",
      },
      columns: columnsWithSerial,
      body: dataWithSerial,
    });

    doc.save("Upload File List.pdf");
  };

  // Excel
  const fileName = "Upload File List";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Category Process Map List",
    pageStyle: "print",
  });

  useEffect(() => {
    // fetchCategoryProcessMap();
    fetchEmployee();
  }, []);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = categoryprocessmaps?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [categoryprocessmaps]);

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

  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTable = useRef(null);

  const [itemsoverall, setItemsoverall] = useState([]);

  const addSerialNumberOverall = (datas) => {
    setItemsoverall(datas);
  };
  useEffect(() => {
    addSerialNumberOverall(overallFilterdata);
  }, [overallFilterdata]);

  // Split the search query into individual terms
  const searchTerms = searchQuery.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = itemsoverall?.filter((item) => {
    return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  const [selectAllChecked, setSelectAllChecked] = useState(false);

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
      width: 80,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
      pinned: "left",
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 120,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
      pinned: "left",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 160,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
      pinned: "left",
    },
    {
      field: "process",
      headerName: "Process",
      flex: 0,
      width: 130,
      hide: !columnVisibility.process,
      headerClassName: "bold-header",
    },
    {
      field: "project",
      headerName: "Project",
      flex: 0,
      width: 130,
      hide: !columnVisibility.project,
      headerClassName: "bold-header",
    },
    {
      field: "categoryname",
      headerName: "Category",
      flex: 0,
      width: 250,
      hide: !columnVisibility.categoryname,
      headerClassName: "bold-header",
    },
    {
      field: "subcategoryname",
      headerName: "Subcategory",
      flex: 0,
      width: 150,
      hide: !columnVisibility.subcategoryname,
      headerClassName: "bold-header",
    },
    {
      field: "processtypes",
      headerName: "Modes",
      flex: 0,
      width: 90,
      hide: !columnVisibility.processtypes,
      headerClassName: "bold-header",
    },

    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 270,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("ecategoryprocessmap") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpenEdit();
                getCode(params.data.id, params.data.name);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />{" "}
            </Button>
          )}
          {isUserRoleCompare?.includes("dcategoryprocessmap") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id, params.data.name);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />{" "}
            </Button>
          )}
          {isUserRoleCompare?.includes("vcategoryprocessmap") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpenview();
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />{" "}
            </Button>
          )}
          {isUserRoleCompare?.includes("icategoryprocessmap") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpeninfo();
                getinfoCode(params.data.id);
              }}
            >
              <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />{" "}
            </Button>
          )}
        </Grid>
      ),
    },
  ];

  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];

        // Convert the sheet to JSON
        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
    //  Datefield
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = dd + "-" + mm + "-" + yyyy;

    promise.then((d) => {
      let uniqueArray = d.filter(
        (item) =>
          !categoryprocessmaps.some(
            (tp) =>
              tp.company === (item.company?.includes("\r\n") ? item.company.replace(/\r\n/g, "") : item.company) &&
              tp.branch === (item.branch?.includes("\r\n") ? item.branch.replace(/\r\n/g, "") : item.branch) &&
              tp.process === (item.process?.includes("\r\n") ? item.process.replace(/\r\n/g, "") : item.process) &&
              tp.project === (item.project?.includes("\r\n") ? item.project.replace(/\r\n/g, "") : item.project) &&
              tp.categoryname === (item.category?.includes("\r\n") ? item.category.replace(/\r\n/g, "") : item.category) &&
              tp.subcategoryname === (item.subcategory?.includes("\r\n") ? item.subcategory.replace(/\r\n/g, "") : item.subcategory) &&
              tp.processtypes === (item.processtype?.includes("\r\n") ? item.processtype.replace(/\r\n/g, "") : item.processtype)
          )
      );

      // let uniqueArray = d.filter((item) => !categoryprocessmaps.some((tp) => tp.company === (item.company).replace(/\r\n/g, "") && tp.branch === (item.branch).replace(/\r\n/g, "") && tp.process=== (item.process).replace(/\r\n/g, "") && tp.project===item.project && tp.categoryname===item.category && tp.subcategoryname===item.subcategory && tp.processtypes === item.processtype));

      const dataArray = uniqueArray.map((item) => ({
        filename: file.name,
        company: item.company?.includes("\r\n") ? item.company.replace(/\r\n/g, "") : item.company,
        branch: item.branch?.includes("\r\n") ? item.branch.replace(/\r\n/g, "") : item.branch,
        process: item.process?.includes("\r\n") ? item.process.replace(/\r\n/g, "") : item.process,
        project: item.project?.includes("\r\n") ? item.project.replace(/\r\n/g, "") : item.project,
        categoryname: item.category?.includes("\r\n") ? item.category.replace(/\r\n/g, "") : item.category,
        subcategoryname: item.subcategory?.includes("\r\n") ? item.subcategory.replace(/\r\n/g, "") : item.subcategory,
        processtypes: item.processtype?.includes("\r\n") ? item.processtype.replace(/\r\n/g, "") : item.processtype,
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      }));

      setUpdatesheet([]);

      let dataaryywithprimary = dataArray.filter((item) => item.processtypes === "Primary");
      let dataaryywitsecondary = dataArray.filter((item) => item.processtypes !== "Primary");

      let duplicatefilter = dataaryywithprimary.filter((data) => {
        const isNameMatchWithProCType = categoryprocessmaps.filter((d) => d.processtypes === "Primary").some((item) => data.processtypes === "Primary" && item.company === data.company && data.branch === item.branch && data.process.slice(-4) === item.process.slice(-4) && data.project === item.project && data.categoryname === item.categoryname && data.subcategoryname === item.subcategoryname);
        return !isNameMatchWithProCType;
      });

      let duplicatefilterwithown = duplicatefilter.filter((item, index, self) => index === self.findIndex((t) => t.company === item.company && t.branch === item.branch && t.process.slice(-4) === item.process.slice(-4) && t.project === item.project && t.categoryname === item.categoryname && t.subcategoryname === item.subcategoryname));

      let overalldata = [...duplicatefilterwithown, ...dataaryywitsecondary];
      let uniqueDataArray = overalldata
        .filter((item, index, self) => index === self.findIndex((t) => t.company === item.company && t.branch === item.branch && t.process === item.process && t.project === item.project && t.categoryname === item.categoryname && t.subcategoryname === item.subcategoryname && t.processtypes === item.processtypes))
        .map((item) => ({
          filename: file.name,
          company: item.company,
          branch: item.branch,
          process: item.process,
          project: item.project,
          categoryname: item.categoryname,
          subcategoryname: item.subcategoryname,
          processtypes: item.processtypes,
          addedby: [
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }));

      if (uniqueDataArray.length !== d.length) {
        setPopupContentMalert(uniqueDataArray.length !== d.length && uniqueArray.length === 0 ? "No Data to Upload" : uniqueDataArray.length !== d.length ? `Duplicate datas are Removed` : "");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }

      if (duplicatefilter.some((data) => data.subcategoryname !== "ALL")) {
        setPopupContentMalert(`Please Update "ALL" in Subcategory field`);
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (duplicatefilter.some((item) => item.subcategoryname === "" || item.categoryname === "" || item.branch === "" || item.company === "" || item.processtypes === "" || item.subcategoryname === undefined || item.categoryname === undefined || item.branch === undefined || item.company === undefined || item.processtypes === undefined)) {
        setPopupContentMalert("Please Update value in all fields");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else {
        const subarraySize = 1000;

        const splitedArray = [];

        for (let i = 0; i < uniqueDataArray.length; i += subarraySize) {
          const subarray = uniqueDataArray.slice(i, i + subarraySize);
          splitedArray.push(subarray);
        }
        setSplitArray(splitedArray);
      }
    });
  };

  const getSheetExcel = () => {
    if (!Array.isArray(splitArray) || (splitArray.length === 0 && fileUploadName === "")) {
      setPopupContentMalert("Please Upload a file");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      let getsheets = splitArray.map((d, index) => ({
        label: "Sheet" + (index + 1),
        value: "Sheet" + (index + 1),
        index: index,
      }));

      setSheets(getsheets);
    }
  };

  const sendJSON = async () => {
    let uploadExceldata = splitArray[selectedSheetindex];
    let uniqueArray = uploadExceldata.filter((item) => !categoryprocessmaps.some((tp) => tp.company === item.company && tp.branch === item.branch && tp.process === item.process && tp.project == item.project && tp.categoryname === item.categoryname && tp.subcategoryname === item.subcategoryname && tp.processtypes == item.processtypes));

    // Ensure that items is an array of objects before sending
    if (fileUploadName === "" || !Array.isArray(uniqueArray) || uniqueArray.length === 0 || selectedSheet === "Please Select Sheet") {
      setPopupContentMalert(fileUploadName === "" ? "Please Upload File" : selectedSheet === "Please Select Sheet" ? "Please Select Sheet" : "No data to upload");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
        }
      };

      setPageName(!pageName);
      try {
        setLoading(true); // Set loading to true when starting the upload
        xmlhttp.open("POST", SERVICE.CATEGORYPROCESSMAP_CREATE);
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlhttp.send(JSON.stringify(uniqueArray));
        // await fetchCategoryProcessMap();
        await fetchEmployee();
      } catch (err) {
        handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
      } finally {
        setLoading(false); // Set loading back to false when the upload is complete

        setPopupContent("Uploaded Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
        setSelectedSheet("Please Select Sheet");
        setUpdatesheet((prev) => [...prev, selectedSheetindex]);
        // await fetchCategoryProcessMap();
        await fetchEmployee();
      }
    }
  };
  const clearFileSelection = () => {
    setFileUploadName("");
    setSplitArray([]);
    // readExcel([]);
    setUpdatesheet([]);
    setDataupdated("");
    setSheets([]);
    setSelectedSheet("Please Select Sheet");
  };

  //  Datefield
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = dd + "-" + mm + "-" + yyyy;

  const ExportsHead = () => {
    let fileDownloadName = "Filename_Category_Process_Map" + "_" + today;

    new CsvBuilder(fileDownloadName).setColumns(["sno", "company", "branch", "process", "project", "category", "subcategory", "processtype"]).exportFile();
  };

  const filteredSelectedColumn = columnDataTable.filter((data) => data.field !== "checkbox" && data.field !== "actions" && data.field !== "serialNumber");

  const rowDataTable = filteredDatas.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      process: item.process,
      project: item.project,
      categoryname: item.categoryname,
      subcategoryname: item.subcategoryname,
      processtypes: item.processtypes,
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
      <br />
      <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumns.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />}
                secondary={column.field === "checkbox" ? "Checkbox" : column.headerName}
                // secondary={column.headerName }
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Grid container>
          <Grid item md={4}>
            <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibility(initialColumnVisibility)}>
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
  const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = fileFormat === "xl" ? ".xlsx" : ".csv";
  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const handleExportXL = (isfilter) => {
    if (isfilter === "filtered") {
      exportToCSV(
        rowDataTableFilename?.map((t, index) => ({
          Sno: index + 1,
          Company: t.company,
          Branch: t.branch,
          FileName: t.filename,
        })),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        minimumPointFilenameArray.map((t, index) => ({
          Sno: index + 1,
          Company: t.company,
          Branch: t.branch,
          FileName: t.filename,
        })),
        fileName
      );
    }

    setIsFilterOpen(false);
  };

  return (
    <Box>
      <Headtitle title={"Category Process Map"} />
      {/* ****** Header Content ****** */}
      <PageHeading title="Category Process Map" modulename="Production" submodulename="Report SetUp" mainpagename="Category Process Map" subpagename="" subsubpagename="" />
      <Typography sx={userStyle.HeaderText}></Typography>
      {isUserRoleCompare?.includes("acategoryprocessmap") && (
        <>
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>Add Category Process Map</Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company <b style={{ color: "red" }}>*</b>
                    </Typography>

                    <Selects
                      isDisabled={fileUploadName !== "" && splitArray.length > 0}
                      options={accessbranch
                        ?.map((data) => ({
                          label: data.company,
                          value: data.company,
                        }))
                        .filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                      value={{ label: selectedOptionsCom, value: selectedOptionsCom }}
                      onChange={(e) => {
                        setSelectedOptionsCom(e.value);
                        setSelectedOptionsBran([]);
                        setSelectedOptionsPro([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={accessbranch
                        ?.filter((comp) => selectedOptionsCom === comp.company)
                        ?.map((data) => ({
                          label: data.branch,
                          value: data.branch,
                        }))
                        .filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                      value={selectedOptionsBran}
                      disabled={fileUploadName !== "" && splitArray.length > 0}
                      onChange={(e) => {
                        handleBranchChange(e);
                        fetchProcessDropdowns(e);
                        setSelectedOptionsPro([]);
                      }}
                      valueRenderer={customValueRendererBran}
                      labelledBy="Please Select Branch"
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Process <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={processs}
                      value={selectedOptionsPro}
                      onChange={(e) => {
                        handleProcessChange(e);
                      }}
                      disabled={fileUploadName !== "" && splitArray.length > 0}
                      valueRenderer={customValueRendererPro}
                      labelledBy="Please Select Process"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Project <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={projects}
                      value={selectedOptionsProj}
                      onChange={(e) => {
                        handleProjectChange(e);
                      }}
                      disabled={fileUploadName !== "" && splitArray.length > 0}
                      valueRenderer={customValueRendererProj}
                      labelledBy="Please Select Project"
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Category <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={categorys
                        ?.filter((comp) => valueProj.includes(comp.project))
                        ?.map((data) => ({
                          label: data.name,
                          value: data.name,
                        }))
                        .filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                      value={selectedOptionsCate}
                      onChange={(e) => {
                        handleCategoryChange(e);
                        fetchCategoryBased(e);
                        setSelectedOptionsSubCate([]);
                      }}
                      valueRenderer={customValueRendererCate}
                      labelledBy="Please Select Category"
                      disabled={fileUploadName !== "" && splitArray.length > 0}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Sub Category <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect options={subcategorys} value={selectedOptionsSubCate} onChange={handleSubCategoryChange} valueRenderer={customValueRendererSubCate} labelledBy="Please Select Subcategory" disabled={fileUploadName !== "" && splitArray.length > 0} />
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Process Type </Typography>
                    <Select
                      fullWidth
                      labelId="demo-select-small"
                      id="demo-select-small"
                      disabled={fileUploadName != "" && splitArray.length > 0}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                            width: 80,
                          },
                        },
                      }}
                      value={processtypes}
                      onChange={(e) => {
                        setProcesstypes(e.target.value);
                      }}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem value="Primary"> {"Primary"} </MenuItem>
                      <MenuItem value="Secondary"> {"Secondary"} </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item md={1} xs={12} sm={4}></Grid>
                <Grid item md={2} xs={12} sm={4}>
                  <Typography>&nbsp;</Typography>
                  <Typography>(Or)</Typography>
                </Grid>
              </Grid>
              <br />
              <Divider />
              <br />
              <Grid container spacing={2}>
                <Grid item md={2} xs={12} sm={6} marginTop={1}>
                  <Typography>&nbsp;</Typography>

                  <Button variant="contained" color="success" sx={{ textTransform: "Capitalize" }} onClick={(e) => ExportsHead()} disabled={selectedOptionsCom !== "Please Select Company" || selectedOptionsBran.length !== 0 || selectedOptionsPro.length !== 0 || selectedOptionsCate.length !== 0 || selectedOptionsSubCate.length !== 0}>
                    <FaDownload />
                    &ensp;Download template file
                  </Button>
                </Grid>
                <Grid item md={4} xs={12} sm={6} marginTop={1}>
                  <Grid container spacing={2}>
                    <Grid item md={4}>
                      <Typography>&nbsp;</Typography>

                      <Button variant="contained" component="label" sx={{ textTransform: "capitalize" }}>
                        Choose File
                        <input
                          hidden
                          type="file"
                          accept=".xlsx, .xls , .csv"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            setDataupdated("uploaded");
                            readExcel(file);
                            setFileUploadName(file.name);
                            e.target.value = null;

                            setSplitArray([]);
                            setSheets([]);
                            setSelectedSheet("Please Select Sheet");
                          }}
                          disabled={selectedOptionsCom !== "Please Select Company" || selectedOptionsBran.length !== 0 || selectedOptionsPro.length !== 0 || selectedOptionsCate.length !== 0 || selectedOptionsSubCate.length !== 0}
                        />
                      </Button>
                    </Grid>
                    <Grid item md={7}>
                      {fileUploadName != "" && splitArray.length > 0 ? (
                        <Box sx={{ display: "flex", justifyContent: "left" }}>
                          <p>{fileUploadName}</p>
                          <Button sx={{ minWidth: "36px", borderRadius: "50%" }} onClick={() => clearFileSelection()}>
                            <FaTrash style={{ color: "red" }} />
                          </Button>
                        </Box>
                      ) : null}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={3} xs={12} sm={6} marginTop={1}>
                  <FormControl fullWidth size="small">
                    <Typography>Sheet</Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={sheets.filter((d) => !updateSheet.includes(d.index))}
                      value={{ label: selectedSheet, value: selectedSheet }}
                      onChange={(e) => {
                        setSelectedSheet(e.value);
                        setSelectedSheetindex(e.index);
                      }}
                      disabled={selectedOptionsCom !== "Please Select Company" || selectedOptionsBran.length !== 0 || selectedOptionsPro.length !== 0 || selectedOptionsCate.length !== 0 || selectedOptionsSubCate.length !== 0}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={1.5} xs={12} sm={6} marginTop={1}>
                  <Grid container>
                    <Grid item md={12} xs={12} sm={8}>
                      <Typography>&nbsp;</Typography>
                      <Button variant="contained" color="primary" onClick={() => getSheetExcel()} disabled={selectedOptionsCom !== "Please Select Company" || selectedOptionsBran.length !== 0 || selectedOptionsPro.length !== 0 || selectedOptionsCate.length !== 0 || selectedOptionsSubCate.length !== 0}>
                        Get Sheet
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={1.5} xs={12} sm={6} marginTop={1}>
                  <Typography>&nbsp;</Typography>

                  <Grid
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "15px",
                    }}
                  >
                    {!loading ? (
                      fileUploadName != "" && splitArray.length > 0 ? (
                        <>
                          <div readExcel={readExcel}>
                            <SendToServer sendJSON={sendJSON} />
                          </div>
                        </>
                      ) : (
                        <Button sx={buttonStyles.buttonsubmit} onClick={handleSubmit}>
                          Submit
                        </Button>
                      )
                    ) : (
                      <LoadingButton
                        // onClick={handleClick}
                        loading={loading}
                        loadingPosition="start"
                        variant="contained"
                      >
                        <span>Send</span>
                      </LoadingButton>
                    )}

                    <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                      CLEAR
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
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
          maxWidth="md"
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
                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={12}>
                    <Typography sx={userStyle.HeaderText}>Edit Category Process Map</Typography>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={4} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Company <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={accessbranch
                          ?.map((data) => ({
                            label: data.company,
                            value: data.company,
                          }))
                          .filter((item, index, self) => {
                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                          })}
                        value={{ label: selectedOptionsComEdit, value: selectedOptionsComEdit }}
                        onChange={(e) => {
                          setSelectedOptionsComEdit(e.value);
                          setSelectedOptionsBranEdit("Please Select Branch");
                          setSelectedOptionsProEdit("Please Select Process");
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Branch <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={accessbranch
                          ?.filter((comp) => selectedOptionsComEdit === comp.company)
                          ?.map((data) => ({
                            label: data.branch,
                            value: data.branch,
                          }))
                          .filter((item, index, self) => {
                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                          })}
                        value={{ label: selectedOptionsBranEdit, value: selectedOptionsBranEdit }}
                        onChange={(e) => {
                          setSelectedOptionsBranEdit(e.value);
                          fetchProcessDropdownsEdit(selectedOptionsComEdit, e.value);

                          setSelectedOptionsProEdit("Please Select Process");
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item md={4} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Process <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={processsEdit}
                        value={{ label: selectedOptionsProEdit, value: selectedOptionsProEdit }}
                        onChange={(e) => {
                          setSelectedOptionsProEdit(e.value);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Project <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={projectsEdit}
                        value={{ label: selectedOptionsProjEdit, value: selectedOptionsProjEdit }}
                        onChange={(e) => {
                          setSelectedOptionsProjEdit(e.value);
                          setSelectedOptionsCateEdit("Please Select Category");
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Category <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={categorysEdit
                          ?.filter((comp) => selectedOptionsProjEdit === comp.project)
                          ?.map((data) => ({
                            label: data.name,
                            value: data.name,
                          }))
                          .filter((item, index, self) => {
                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                          })}
                        value={{ label: selectedOptionsCateEdit, value: selectedOptionsCateEdit }}
                        onChange={(e) => {
                          setSelectedOptionsCateEdit(e.value);
                          fetchCategoryBasedEdit(e.value, selectedOptionsProjEdit);
                          setSelectedOptionsSubCateEdit("ALL");
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Sub Category <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={subcategorysEdit}
                        value={{ label: selectedOptionsSubCateEdit, value: selectedOptionsSubCateEdit }}
                        onChange={(e) => {
                          setSelectedOptionsSubCateEdit(e.value);
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Process Type </Typography>
                      <Select
                        fullWidth
                        labelId="demo-select-small"
                        id="demo-select-small"
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 200,
                              width: 80,
                            },
                          },
                        }}
                        value={processtypesEdit}
                        onChange={(e) => {
                          setProcesstypesEdit(e.target.value);
                        }}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                      >
                        <MenuItem value="Primary"> {"Primary"} </MenuItem>
                        <MenuItem value="Secondary"> {"Secondary"} </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <br />

                <br />

                <Grid container spacing={2}>
                  <Grid item md={6} xs={6} sm={6}>
                    <Button sx={buttonStyles.buttonsubmit} type="submit">
                      Update
                    </Button>
                  </Grid>
                  <Grid item md={6} xs={6} sm={6}>
                    <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit}>
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
                {/* </DialogContent> */}
              </form>
            </>
          </Box>
        </Dialog>
      </Box>
      <br />

      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lcategoryprocessmap") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Upload File List</Typography>
            </Grid>
            <Grid container spacing={2} style={userStyle.dataTablestyle}>
              <Grid item md={2} xs={12} sm={12}>
                <Typography>&nbsp;</Typography>
                <Box>
                  <label>Show entries:</label>
                  <Select
                    id="pageSizeSelect"
                    value={pageSizeFilename}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 180,
                          width: 80,
                        },
                      },
                    }}
                    onChange={handlePageSizeChangeFilename}
                    sx={{ width: "77px" }}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
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
                  {isUserRoleCompare?.includes("excelcategoryprocessmap") && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          fetchCategoryProcessMapArray();
                          setFormat("xl");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileExcel />
                        &ensp;Export to Excel&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvcategoryprocessmap") && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          fetchCategoryProcessMapArray();
                          setFormat("csv");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileCsv />
                        &ensp;Export to CSV&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("printcategoryprocessmap") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprintFilename}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfcategoryprocessmap") && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true);
                          fetchCategoryProcessMapArray();
                        }}
                      >
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imagecategoryprocessmap") && (
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImageFilename}>
                      <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                    </Button>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <FormControl fullWidth size="small">
                    <Typography>Search</Typography>
                    <OutlinedInput id="component-outlined" type="text" value={searchQueryFilename} onChange={handleSearchChangeFilename} />
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
            <br />
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsFilename}>
              Show All Columns
            </Button>
            &ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsFilename}>
              Manage Columns
            </Button>
            <Popover
              id={id}
              open={isManageColumnsOpenFilename}
              anchorElFilename={anchorElFilename}
              onClose={handleCloseManageColumnsFilename}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              {manageColumnsContentFilename}
            </Popover>
            &ensp;
            {/* <Button variant="contained" color="error" size="small" sx={{ textTransform: "capitalize" }} onClick={handleClickOpenalert}>
            Bulk Delete
          </Button> */}
            <br />
            <br />
            {!categoryprocessCheck ? (
              <>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
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
                  <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowsWithCheckboxesFilename} columns={columnDataTableFilename.filter((column) => columnVisibilityFilename[column.field])} onSelectionModelChange={handleSelectionChangeFilename} selectionModel={selectedRowsFilename} autoHeight={true} ref={gridRefFilename} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
                </Box>
                <Box style={userStyle.dataTablestyle}>
                  <Box>
                    Showing {FilenameFilename.length > 0 ? (pageFilename - 1) * pageSizeFilename + 1 : 0} to {Math.min(pageFilename * pageSizeFilename, filteredDatasFilename?.length)} of {filteredDatasFilename?.length} entries
                  </Box>
                  <Box>
                    <Button onClick={() => setPageFilename(1)} disabled={pageFilename === 1} sx={userStyle.paginationbtn}>
                      <FirstPageIcon />
                    </Button>
                    <Button onClick={() => handlePageChangeFilename(pageFilename - 1)} disabled={pageFilename === 1} sx={userStyle.paginationbtn}>
                      <NavigateBeforeIcon />
                    </Button>
                    {pageNumbersFilename?.map((pageNumber) => (
                      <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChangeFilename(pageNumber)} className={pageFilename === pageNumber ? "active" : ""} disabled={pageFilename === pageNumber}>
                        {pageNumber}
                      </Button>
                    ))}
                    {lastVisiblePageFilename < totalPagesFilename && <span>...</span>}
                    <Button onClick={() => handlePageChangeFilename(pageFilename + 1)} disabled={pageFilename === totalPagesFilename} sx={userStyle.paginationbtn}>
                      <NavigateNextIcon />
                    </Button>
                    <Button onClick={() => setPageFilename(totalPagesFilename)} disabled={pageFilename === totalPagesFilename} sx={userStyle.paginationbtn}>
                      <LastPageIcon />
                    </Button>
                  </Box>
                </Box>
              </>
            )}
            {/* ****** Table End ****** */}
          </Box>
        </>
      )}
      {/* ****** Table End ****** */}

      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lcategoryprocessmap") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Category Process Map List</Typography>
            </Grid>
            <br />
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
                    <MenuItem value={totalProjects}>All</MenuItem>
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
                  {isUserRoleCompare?.includes("excelcategoryprocessmap") && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen2(true);
                          fetchCategoryProcessMapArray();
                          setFormat("xl");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileExcel />
                        &ensp;Export to Excel&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvcategoryprocessmap") && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen2(true);
                          fetchCategoryProcessMapArray();
                          setFormat("csv");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileCsv />
                        &ensp;Export to CSV&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("printcategoryprocessmap") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfcategoryprocessmap") && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen2(true);
                          fetchCategoryProcessMapArray();
                        }}
                      >
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imagecategoryprocessmap") && (
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                      <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                    </Button>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={6} sm={6}>
                <AggregatedSearchBar columnDataTable={columnDataTable} setItems={setItemsoverall} addSerialNumber={addSerialNumberOverall} setPage={setPage} maindatas={overallFilterdata} setSearchedString={setSearchedString} searchQuery={searchQuery} setSearchQuery={setSearchQuery} paginated={true} totalDatas={overallFilterdataforsearch} />
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
            {isUserRoleCompare?.includes("bdcategoryprocessmap") && (
            <Button sx={buttonStyles.buttonbulkdelete} onClick={handleClickOpenalert}>
              Bulk Delete
            </Button>
            )}
            <br />
            <br />
            {!categoryprocessCheck ? (
              <>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
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
                  itemsList={overallFilterdataforsearch}
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
                  items={itemsoverall}
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
                  itemsList={overallFilterdataforsearch}

                /> */}
                <Popover id={idSearch} open={openSearch} anchorEl={anchorElSearch} onClose={handleCloseSearch} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
                  <Box style={{ padding: "10px", maxWidth: "450px" }}>
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
                      <Box
                        sx={{
                          width: "350px",
                          maxHeight: "400px",
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        <Box
                          sx={{
                            maxHeight: "300px",
                            overflowY: "auto",
                            // paddingRight: '5px'
                          }}
                        >
                          <Grid container spacing={1}>
                            <Grid item md={12} sm={12} xs={12}>
                              <Typography>Columns</Typography>
                              <Select
                                fullWidth
                                size="small"
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
                                <MenuItem value="" disabled>
                                  Select Column
                                </MenuItem>
                                {filteredSelectedColumn.map((col) => (
                                  <MenuItem key={col.field} value={col.field}>
                                    {col.headerName}
                                  </MenuItem>
                                ))}
                              </Select>
                            </Grid>
                            <Grid item md={12} sm={12} xs={12}>
                              <Typography>Operator</Typography>
                              <Select
                                fullWidth
                                size="small"
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
                              <TextField
                                fullWidth
                                size="small"
                                value={["Blank", "Not Blank"].includes(selectedCondition) ? "" : filterValue}
                                onChange={(e) => setFilterValue(e.target.value)}
                                disabled={["Blank", "Not Blank"].includes(selectedCondition)}
                                placeholder={["Blank", "Not Blank"].includes(selectedCondition) ? "Disabled" : "Enter value"}
                                sx={{
                                  "& .MuiOutlinedInput-root.Mui-disabled": {
                                    backgroundColor: "rgb(0 0 0 / 26%)",
                                  },
                                  "& .MuiOutlinedInput-input.Mui-disabled": {
                                    cursor: "not-allowed",
                                  },
                                }}
                              />
                            </Grid>
                            {additionalFilters.length > 0 && (
                              <>
                                <Grid item md={12} sm={12} xs={12}>
                                  <RadioGroup row value={logicOperator} onChange={(e) => setLogicOperator(e.target.value)}>
                                    <FormControlLabel value="AND" control={<Radio />} label="AND" />
                                    <FormControlLabel value="OR" control={<Radio />} label="OR" />
                                  </RadioGroup>
                                </Grid>
                              </>
                            )}
                            {additionalFilters.length === 0 && (
                              <Grid item md={4} sm={12} xs={12}>
                                <Button variant="contained" onClick={handleAddFilter} sx={{ textTransform: "capitalize" }} disabled={["Blank", "Not Blank"].includes(selectedCondition) ? false : !filterValue || selectedColumn.length === 0}>
                                  Add Filter
                                </Button>
                              </Grid>
                            )}

                            <Grid item md={2} sm={12} xs={12}>
                              <Button
                                variant="contained"
                                onClick={() => {
                                  fetchEmployee();
                                  setIsSearchActive(true);
                                  setAdvancedFilter([...additionalFilters, { column: selectedColumn, condition: selectedCondition, value: filterValue }]);
                                }}
                                sx={{ textTransform: "capitalize" }}
                                disabled={["Blank", "Not Blank"].includes(selectedCondition) ? false : !filterValue || selectedColumn.length === 0}
                              >
                                Search
                              </Button>
                            </Grid>
                          </Grid>
                        </Box>
                      </Box>
                    </DialogContent>
                  </Box>
                </Popover>
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

      {/* Delete Modal */}
      <Box>
        {/* ALERT DIALOG */}
        <Dialog open={isDeleteOpen} onClose={handleCloseMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
            <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
              Are you sure?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseMod} sx={userStyle.btncancel}>
              Cancel
            </Button>
            <Button autoFocus variant="contained" color="error" onClick={(e) => delCategoryProcess()}>
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>

        {/* this is info view details */}

        {/* <Dialog open={openInfo} onClose={handleCloseinfo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <Box sx={{ width: "550px", padding: "20px 50px" }}>
            <>
              <Typography sx={userStyle.HeaderText}>Category Process Map Info</Typography>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">addedby</Typography>
                    <br />
                    <Table>
                      <TableHead>
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"UserName"}</StyledTableCell>
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                      </TableHead>
                      <TableBody>
                        {addedby?.map((item, i) => (
                          <StyledTableRow>
                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                            <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                            <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
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
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"UserName"}</StyledTableCell>
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                      </TableHead>
                      <TableBody>
                        {updateby?.map((item, i) => (
                          <StyledTableRow>
                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                            <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                            <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
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
        </Dialog> */}
        {/* print layout */}

        <TableContainer component={Paper} sx={userStyle.printcls}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
            <TableHead>
              <TableRow>
                <TableCell>S.no</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Branch</TableCell>
                <TableCell>Process</TableCell>
                <TableCell>Project</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Subcategory</TableCell>
                <TableCell>Modes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody align="left">
              {rowDataTable &&
                rowDataTable.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.company}</TableCell>
                    <TableCell>{row.branch}</TableCell>
                    <TableCell>{row.process}</TableCell>
                    <TableCell>{row.project}</TableCell>
                    <TableCell>{row.categoryname}</TableCell>
                    <TableCell>{row.subcategoryname}</TableCell>
                    <TableCell>{row.processtypes}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* file name print */}
        <TableContainer component={Paper} sx={userStyle.printcls}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRefFilename}>
            <TableHead>
              <TableRow>
                <TableCell> SI.No</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Branch</TableCell>
                <TableCell>File Name</TableCell>
                {/* <TableCell>Last Upload</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody align="left">
              {rowDataTableFilename &&
                rowDataTableFilename.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.company}</TableCell>
                    <TableCell>{row.branch}</TableCell>
                    <TableCell>{row.filename}</TableCell>
                    {/* <TableCell>{moment(row.lastupload).format("DD-MM-YYYY hh:mm:ss a")}</TableCell> */}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* view model */}
      <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg">
        <Box sx={{ width: "auto", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> View Category Process Map</Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Company</Typography>
                  <Typography>{categoryprocessEdit.company?.toString()}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Branch</Typography>
                  <Typography>{categoryprocessEdit.branch?.toString()}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Process</Typography>
                  <Typography>{categoryprocessEdit.process?.toString()}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Project</Typography>
                  <Typography>{categoryprocessEdit.project?.toString()}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Category</Typography>
                  <Typography>{categoryprocessEdit.categoryname?.toString()}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Sub Category</Typography>
                  <Typography>{categoryprocessEdit.subcategoryname?.toString()}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Process Type</Typography>
                  <Typography>{categoryprocessEdit.processtypes}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button sx={buttonStyles.btncancel} onClick={handleCloseview}>
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpenpop} onClose={handleCloseerrpop} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
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

      <Box>
        {/* ALERT DIALOG */}
        <Dialog open={isDeleteOpenalert} onClose={handleCloseModalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: "orange" }} />
            <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
              Please Select any Row
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button autoFocus variant="contained" color="error" onClick={handleCloseModalert}>
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/*Export XL Data  */}
      <Dialog open={isFilterOpen} onClose={handleCloseFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
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

          {fileFormat === "xl" ? <FaFileExcel style={{ fontSize: "70px", color: "green" }} /> : <FaFileCsv style={{ fontSize: "70px", color: "green" }} />}
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
              fetchCategoryProcessMapArray();
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
      {/*Export pdf Data  */}
      <Dialog open={isPdfFilterOpen} onClose={handleClosePdfFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
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

      {/*DELETE ALERT DIALOG */}
      <Dialog open={isDeleteOpenFilename} onClose={handleCloseModFilename} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
          <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
            Are you sure?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseModFilename}
            style={{
              backgroundColor: "#f4f4f4",
              color: "#444",
              boxShadow: "none",
              borderRadius: "3px",
              border: "1px solid #0000006b",
              "&:hover": {
                "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                  backgroundColor: "#f4f4f4",
                },
              },
            }}
          >
            Cancel
          </Button>
          <Button autoFocus variant="contained" color="error" onClick={(e) => deleteFilenameList()}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <MessageAlert openPopup={openPopupMalert} handleClosePopup={handleClosePopupMalert} popupContent={popupContentMalert} popupSeverity={popupSeverityMalert} />
      <AlertDialog openPopup={openPopup} handleClosePopup={handleClosePopup} popupContent={popupContent} popupSeverity={popupSeverity} />
      <ExportData
        isFilterOpen={isFilterOpen2}
        handleCloseFilterMod={handleCloseFilterMod2}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen2}
        isPdfFilterOpen={isPdfFilterOpen2}
        setIsPdfFilterOpen={setIsPdfFilterOpen2}
        handleClosePdfFilterMod={handleClosePdfFilterMod2}
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
        itemsTwo={overallCategoryProcess ?? []}
        filename={"Category Process Map List"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      <InfoPopup openInfo={openInfo} handleCloseinfo={handleCloseinfo} heading="Category Process Map Info" addedby={addedby} updateby={updateby} />
      <DeleteConfirmation open={isDeleteOpen} onClose={handleCloseMod} onConfirm={delCategoryProcess} title="Are you sure?" confirmButtonText="Yes" cancelButtonText="Cancel" />
      <DeleteConfirmation open={isDeleteOpencheckbox} onClose={handleCloseModcheckbox} onConfirm={delCategoryprocesscheckbox} title="Are you sure?" confirmButtonText="Yes" cancelButtonText="Cancel" />
      <PleaseSelectRow open={isDeleteOpenalert} onClose={handleCloseModalert} message="Please Select any Row" iconColor="orange" buttonText="OK" />
    </Box>
  );
}

export default CategoryProcessMap;