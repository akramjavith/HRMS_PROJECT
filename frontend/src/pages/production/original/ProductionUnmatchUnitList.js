import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, Divider, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaPrint, FaFilePdf, FaFileCsv, FaFileExcel } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../../components/Export";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
// import moment from "moment-timezone";
import StyledDataGrid from "../../../components/TableStyle";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Resizable from "react-resizable";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
// import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import Selects from "react-select";
import LinearProgress from "@mui/material/LinearProgress";
// import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWrench } from "@fortawesome/free-solid-svg-icons";
import LoadingButton from "@mui/lab/LoadingButton";
import { Space, TimePicker } from "antd";
// import { Flex, Progress } from "antd";
import { handleApiError } from "../../../components/Errorhandling";
import ExportData from "../../../components/ExportData";
import ExportDataTwo from "../../../components/ExportData";
import ExportDataThree from "../../../components/ExportData";
import ExportDataFour from "../../../components/ExportData";
import ExportDataFive from "../../../components/ExportData";
import ExportDataAllList from "../../../components/ExportData";
import ExportDataUpdatedList from "../../../components/ExportData";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert";
import PageHeading from "../../../components/PageHeading";
import dayjs from "dayjs";

function ProductionUnmatchUnitList() {

  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
  };
  // const handleClosePopupMalert = () => {
  //   setOpenPopupMalert(false);
  // };
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const handleClickOpenPopup = () => {
    setOpenPopup(true);
  };
  // const handleClosePopup = () => {
  //   setOpenPopup(false);
  // };

  const [searchQuery, setSearchQuery] = useState("");

  const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);

  const [sourceCheck, setSourcecheck] = useState(true);

  const [tableTwo, setTableTwo] = useState(true);
  const [tableThree, setTableThree] = useState(true);
  const [tableFour, setTableFour] = useState(true);
  const [tableFive, setTableFive] = useState(true);

  const [masterDatas, setMasterDatas] = useState([]);
  const [uniqueDates, setUniqueDates] = useState([]);

  const [tableTwoDatas, setTableTwoDatas] = useState([]);
  const [tableThreeDatas, setTableThreeDatas] = useState([]);
  const [tableFourDatas, setTableFourDatas] = useState([]);
  const [tableFiveDatas, setTableFiveDatas] = useState([]);

  const [identifierClick, setIdentifierClick] = useState(true);

  const [loginClick, setLoginClick] = useState(true);

  const [tableCount, setTableCount] = useState(0);

  const [updateContent, setUpdateContent] = useState(false);
  const [tableAllListDatas, setTableAllListDatas] = useState([]);

  const [flagCountFirst, setFlagCountFirst] = useState("");

  const [alltable, setalltable] = useState(false);
  // const [updatedTable, setUpdatedTable] = useState(false);

  // TABLE UNITFLAG BTNS LOADER
  const [isunitflagone, setIsunitflagone] = useState("");
  // const [isunitflagoneall, setIsunitflagoneall] = useState([]);

  const [isunitflagtwo, setIsunitflagtwo] = useState(false);
  // const [isunitflagtwoall, setIsunitflagtwoall] = useState([]);

  const [isunitflagthree, setIsunitflagthree] = useState(false);
  // const [isunitflagthreeall, setIsunitflagthreeall] = useState([]);

  const [isunitflagfour, setIsunitflagfour] = useState(false);
  // const [isunitflagfourall, setIsunitflagfourall] = useState([]);

  const [isunitflagfive, setIsunitflagfive] = useState(false);
  // const [isunitflagfiveall, setIsunitflagfiveall] = useState([]);

  // TABLE FLAG BTNS LOADER
  const [isFlagone, setIsFlagone] = useState(false);
  // const [isFlagoneall, setIsFlagoneall] = useState([]);

  const [isFlagtwo, setIsFlagtwo] = useState(false);
  // const [isFlagtwoall, setIsFlagtwoall] = useState([]);

  const [isFlagthree, setIsFlagthree] = useState(false);
  // const [isFlagthreeall, setIsFlagthreeall] = useState([]);

  const [isFlagfour, setIsFlagfour] = useState(false);
  // const [isFlagfourall, setIsFlagfourall] = useState([]);

  const [isFlagfive, setIsFlagfive] = useState(false);
  // const [isFlagfiveall, setIsFlagfiveall] = useState([]);

  // TABLE UNIT BTNS LOADER
  const [isUnitone, setIsUnitone] = useState(false);
  // const [isUnitoneall, setIsUnitoneall] = useState([]);

  const [isUnittwo, setIsUnittwo] = useState(false);
  // const [isUnittwoall, setIsUnittwoall] = useState(false);

  const [isUnitthree, setIsUnitthree] = useState(false);
  // const [isUnitthreeall, setIsUnitthreeall] = useState(false);

  const [isUnitfour, setIsUnitfour] = useState(false);
  // const [isUnitfourall, setIsUnitfourall] = useState(false);

  const [isUnitfive, setIsUnitfive] = useState(false);
  // const [isUnitfiveall, setIsUnitfiveall] = useState(false);

  // TABLE SECTION BTNS LOADER
  const [isSectionone, setIsSectionone] = useState(false);
  // const [isSectiononeall, setIsSectiononeall] = useState([]);

  const [isSectiontwo, setIsSectiontwo] = useState(false);
  // const [isSectiontwoall, setIsSectiontwoall] = useState([]);

  const [isSectionthree, setIsSectionthree] = useState(false);
  // const [isSectionthreeall, setIsSectionthreeall] = useState([]);

  const [isSectionfour, setIsSectionfour] = useState(false);
  // const [isSectionfourall, setIsSectionfourall] = useState([]);

  const [isSectionfive, setIsSectionfive] = useState(false);
  // const [isSectionfiveall, setIsSectionfiveall] = useState([]);

  const [mismatchmode, setMismatchmode] = useState("");
  const [mismatchmodeThree, setMismatchmodeThree] = useState("");
  const [mismatchmodeFour, setMismatchmodeFour] = useState("");
  const [mismatchmodeFive, setMismatchmodeFive] = useState("");

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowsTwo, setSelectedRowsTwo] = useState([]);
  const [selectedRowsThree, setSelectedRowsThree] = useState([]);
  const [selectedRowsFour, setSelectedRowsFour] = useState([]);
  const [selectedRowsFive, setSelectedRowsFive] = useState([]);

  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectAllCheckedTwo, setSelectAllCheckedTwo] = useState(false);
  const [selectAllCheckedThree, setSelectAllCheckedThree] = useState(false);
  const [selectAllCheckedFour, setSelectAllCheckedFour] = useState(false);
  const [selectAllCheckedFive, setSelectAllCheckedFive] = useState(false);

  const [isProdDayCount, setIsProdDayCount] = useState(0);

  let today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;

  const [overallState, setOverallState] = useState({
    project: "Please Select Project",
    date: today,
    fromtime: dayjs("12:00:00 AM", "h:mm:ss A"),
    totime: dayjs("11:59:59 PM", "h:mm:ss A"),
    fromtime24Hrs: dayjs("12:00:00 AM", "h:mm:ss A").format("HH:mm:ss"),
    totime24Hrs: dayjs("11:59:59 PM", "h:mm:ss A").format("HH:mm:ss"),
    category: "Please Select Category",
    subcategory: "Please Select Sub Category",
    projectvendor: "Please Select Project Vendor",
    employee: "Please Select employee",
    login: "Please Select Login",
    identifier: "Please Select Identifier",
    todate: today,
  });

  let misMatchModeOpt = [
    { label: "Unit + Flag", value: "Unit + Flag" },
    { label: "Unit", value: "Unit" },
    { label: "Flag", value: "Flag" },
    { label: "Unit + Section", value: "Unit + Section" },
  ];
  const [fileFormat, setFormat] = useState('');
  let exportColumnNames = ['Date', 'Count']
  let exportRowValues = ['date', 'count']


  let exportColumnNamesTwo = ['Date', 'Category', 'Project', 'Count']
  let exportRowValuesTwo = ['date', 'category', 'vendor', 'count']

  let exportColumnNamesThree = ['Date', 'Category', 'Project', 'Vendor', 'Count']
  let exportRowValuesThree = ['date', 'category', 'project', 'vendor1', 'count']

  let exportColumnNamesFour = ['Date', 'Project', 'Vendor', 'Category', 'Sub Category', 'Count']
  let exportRowValuesFour = ['date', 'project', 'vendor1', 'category1', 'subcategory', 'count']


  let exportColumnNamesFive = [
    'Date',
    'Project',
    'Vendor',
    'Category',
    'Sub Category',
    'Indentifier Name',
    'Flag Count',
    'Section',
    'Count'
  ]
  let exportRowValuesFive = [
    'date', 'project',
    'vendor1', 'category1',
    'subcategory', 'unitid',
    'flag', 'section',
    'count'
  ]

  let exportColumnNamesAllList = [
    'Date',
    'Project',
    'Vendor',
    'Category',
    'Sub Category',
    'Flag Count',
    'Unit',
    'Count'
  ]
  let exportRowValuesAllList = [
    'date',
    'project',
    'vendor',
    'category',
    'subcategory',
    'flag',
    'unit',
    'count'
  ]

  let exportColumnNamesUpdatedList = [
    'Login ID', 'Date',
    'Vendor', 'Category',
    'Sub Category', 'Identity Name',
    'UnitRate', 'Flag Count',
    'Section', 'A UnitRate',
    'A Flag Count', 'A Section'
  ]
  let exportRowValuesUpdatedList = [
    'user',
    'dateval',
    'vendor',
    'filename',
    'category',
    'unitid',
    'unitrate',
    'flag',
    'section',
    'updatedunitrate',
    'updatedflag',
    'updatedsection'
  ]



  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };


  const [isFilterOpenTwo, setIsFilterOpenTwo] = useState(false);
  const [isPdfFilterOpenTwo, setIsPdfFilterOpenTwo] = useState(false);
  // page refersh reload
  const handleCloseFilterModTwo = () => {
    setIsFilterOpenTwo(false);
  };

  const handleClosePdfFilterModTwo = () => {
    setIsPdfFilterOpenTwo(false);
  };

  const [isFilterOpenThree, setIsFilterOpenThree] = useState(false);
  const [isPdfFilterOpenThree, setIsPdfFilterOpenThree] = useState(false);
  // page refersh reload
  const handleCloseFilterModThree = () => {
    setIsFilterOpenThree(false);
  };

  const handleClosePdfFilterModThree = () => {
    setIsPdfFilterOpenThree(false);
  };

  const [isFilterOpenFour, setIsFilterOpenFour] = useState(false);
  const [isPdfFilterOpenFour, setIsPdfFilterOpenFour] = useState(false);
  // page refersh reload
  const handleCloseFilterModFour = () => {
    setIsFilterOpenFour(false);
  };

  const handleClosePdfFilterModFour = () => {
    setIsPdfFilterOpenFour(false);
  };

  const [isFilterOpenFive, setIsFilterOpenFive] = useState(false);
  const [isPdfFilterOpenFive, setIsPdfFilterOpenFive] = useState(false);
  // page refersh reload
  const handleCloseFilterModFive = () => {
    setIsFilterOpenFive(false);
  };

  const handleClosePdfFilterModFive = () => {
    setIsPdfFilterOpenFive(false);
  };

  const [isFilterOpenAllList, setIsFilterOpenAllList] = useState(false);
  const [isPdfFilterOpenAllList, setIsPdfFilterOpenAllList] = useState(false);
  // page refersh reload
  const handleCloseFilterModAllList = () => {
    setIsFilterOpenAllList(false);
  };

  const handleClosePdfFilterModAllList = () => {
    setIsPdfFilterOpenAllList(false);
  };
  const [isFilterOpenUpdatedList, setIsFilterOpenUpdatedList] = useState(false);
  const [isPdfFilterOpenUpdatedList, setIsPdfFilterOpenUpdatedList] = useState(false);
  // page refersh reload
  const handleCloseFilterModUpdatedList = () => {
    setIsFilterOpenUpdatedList(false);
  };

  const handleClosePdfFilterModUpdatedList = () => {
    setIsPdfFilterOpenUpdatedList(false);
  };

  const handleInputChangeFirst = (event) => {
    const inputValue = event.target.value;

    const pattern = /^\d*\.?\d*$/;

    if (pattern.test(inputValue) || inputValue === "") {
      setFlagCountFirst(inputValue);
    }
  };

  const gridRef = useRef(null);

  const [searchQueryManage, setSearchQueryManage] = useState("");

  const [copiedData, setCopiedData] = useState("");

  //NEW FLAG POPUP
  const [newflagpopOpen, setNewflagpopOpen] = useState(false);
  //Datatable
  const handleNewflagpopOpen = () => {
    setNewflagpopOpen(true);
  };
  const handleNewflagpopClose = () => {
    setNewflagpopOpen(false);
  };

  //NEW FLAG POPUP
  const [multiUnitFlagOpen, setMultiUnitFlagOpen] = useState(false);
  //Datatable
  const handleMultiUnitflagpopOpen = () => {
    setMultiUnitFlagOpen(true);
  };
  const handleMultiUnitflagpopClose = () => {
    setMultiUnitFlagOpen(false);
  };

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Production Unmatch Unit.png");
        });
      });
    }
  };

  //image
  const handleCaptureImageTwo = () => {
    if (gridRefTwo.current) {
      html2canvas(gridRefTwo.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Production Unmatch Unit.png");
        });
      });
    }
  };

  //image
  const handleCaptureImageThree = () => {
    if (gridRefThree.current) {
      html2canvas(gridRefThree.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Production Unmatch Unit.png");
        });
      });
    }
  };

  //image
  const handleCaptureImageFour = () => {
    if (gridRefFour.current) {
      html2canvas(gridRefFour.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Production Unmatch Unit.png");
        });
      });
    }
  };

  //image
  const handleCaptureImageFive = () => {
    if (gridRefFive.current) {
      html2canvas(gridRefFive.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Production Unmatch Unit.png");
        });
      });
    }
  };

  //image
  const handleCaptureImageAllList = () => {
    if (gridRefAllList.current) {
      html2canvas(gridRefAllList.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Production Unmatch Unit.png");
        });
      });
    }
  };

  //image
  const handleCaptureImageUpdatedList = () => {
    if (gridRefUpdatedList.current) {
      html2canvas(gridRefUpdatedList.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Production Unmatch Unit.png");
        });
      });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  //-----------------------------------Table Two--------------------------------------------------------------------------------------------------

  const [itemsTwo, setItemsTwo] = useState([]);
  const [pageTwo, setPageTwo] = useState(1);
  const [searchQueryManageTwo, setSearchQueryManageTwo] = useState("");
  const [searchQueryTwo, setSearchQueryTwo] = useState("");

  // Manage Columns

  const addSerialNumberTwo = () => {
    const itemsWithSerialNumber = tableTwoDatas?.map((item, index) => ({
      ...item,
      serialNumber: index + 1, id: index, vendornew: item.vendor?.split("-")[0],

    }));
    setItemsTwo(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumberTwo();
  }, [tableTwoDatas]);

  const initialColumnVisibilityTwo = {
    serialNumber: true,
    checkbox: true,
    date: true,
    category: true,
    vendor: true,
    vendornew: true,
    count: true,
    actions: true,
  };

  const [columnVisibilityTwo, setColumnVisibilityTwo] = useState(initialColumnVisibilityTwo);

  // Manage Columns
  const [isManageColumnsOpenTwo, setManageColumnsOpenTwo] = useState(false);
  const [anchorElTwo, setAnchorElTwo] = useState(null);

  const handleOpenManageColumnsTwo = (event) => {
    setAnchorElTwo(event.currentTarget);
    setManageColumnsOpenTwo(true);
  };

  const openTwo = Boolean(anchorElTwo);
  const idTwo = openTwo ? "simple-popover" : undefined;

  const handleCloseManageColumnsTwo = () => {
    setManageColumnsOpenTwo(false);
    setSearchQueryManageTwo("");
  };

  const [pageSizeTwo, setPageSizeTwo] = useState(10);
  //Datatable
  const handlePageChangeTwo = (newPage) => {
    setPageTwo(newPage);
  };
  const handlePageSizeChangeTwo = (event) => {
    setPageSizeTwo(Number(event.target.value));
    setSelectedRows([]);
    setSelectAllChecked(false);
    setPageTwo(1);
  };

  // Split the search query into individual terms
  const searchTermsTwo = searchQueryTwo.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDataTwos = itemsTwo?.filter((item) => {
    return searchTermsTwo.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  const filteredDataTwo = filteredDataTwos.slice((pageTwo - 1) * pageSizeTwo, pageTwo * pageSizeTwo);

  const totalPagesTwo = Math.ceil(filteredDataTwos.length / pageSizeTwo);

  const visiblePagesTwo = Math.min(totalPagesTwo, 3);

  const firstVisiblePageTwo = Math.max(1, pageTwo - 1);
  const lastVisiblePageTwo = Math.min(firstVisiblePageTwo + visiblePagesTwo - 1, totalPagesTwo);

  const pageNumbersTwo = [];

  const indexOfLastItemTwo = pageTwo * pageSizeTwo;
  const indexOfFirstItemTwo = indexOfLastItemTwo - pageSizeTwo;

  for (let i = firstVisiblePageTwo; i <= lastVisiblePageTwo; i++) {
    pageNumbersTwo.push(i);
  }
  const [selectedTwoIds, setSelectedTwoIds] = useState([]);

  const columnDataTableTwo = [
    {
      field: "checkbox",
      headerName: "Checkbox", // Default header name
      headerStyle: {
        fontWeight: "bold", // Apply the font-weight style to make the header text bold
        // Add any other CSS styles as needed
      },
      renderHeader: (params) => (
        <CheckboxHeader
          selectAllChecked={selectAllCheckedTwo}
          onSelectAll={() => {
            if (rowDataTableTwo.length === 0) {
              // Do not allow checking when there are no rows
              return;
            }
            if (selectAllCheckedTwo) {
              setSelectedRowsTwo([]);
            } else {
              const allRowIds = rowDataTableTwo.map((row) => row.id);
              setSelectedRowsTwo(allRowIds);
              const allRowUpdaetIds = rowDataTableTwo.map((row) => row.ids).flat();
              setSelectedTwoIds(allRowUpdaetIds);
            }
            setSelectAllCheckedTwo(!selectAllCheckedTwo);
          }}
        />
      ),

      renderCell: (params) => (
        <Checkbox
          checked={selectedRowsTwo.includes(params.row.id)}
          onChange={() => {
            let updatedSelectedRowsTwo;
            let updatedSelectedRowsTwoIds;
            let datas = params.row.ids.flat();
            // console.log(params.row.ids.flat())
            if (selectedRowsTwo.includes(params.row.id)) {
              updatedSelectedRowsTwo = selectedRowsTwo.filter((selectedId) => selectedId !== params.row.id);
              updatedSelectedRowsTwoIds = selectedTwoIds.filter((selectedId) => !datas.map((d) => d.category).includes(selectedId.category));
            } else {
              updatedSelectedRowsTwo = [...selectedRowsTwo, params.row.id];
              updatedSelectedRowsTwoIds = [...selectedTwoIds, ...datas];
            }

            setSelectedRowsTwo(updatedSelectedRowsTwo);
            setSelectedTwoIds(updatedSelectedRowsTwoIds);
            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllCheckedTwo(updatedSelectedRowsTwo.length === filteredDataTwo.length);
          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 90,

      hide: !columnVisibilityTwo.checkbox,
      headerClassName: "bold-header",
    },

    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 100,
      hide: !columnVisibilityTwo.serialNumber,
      headerClassName: "bold-header",
    },

    { field: "date", headerName: "Date", flex: 0, width: 100, hide: !columnVisibilityTwo.date, headerClassName: "bold-header" },
    { field: "category", headerName: "Category", flex: 0, width: 320, hide: !columnVisibilityTwo.category, headerClassName: "bold-header" },
    { field: "vendornew", headerName: "Project", flex: 0, width: 200, hide: !columnVisibilityTwo.vendornew, headerClassName: "bold-header" },
    { field: "count", headerName: "Count", flex: 0, width: 100, hide: !columnVisibilityTwo.count, headerClassName: "bold-header" },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 550,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibilityTwo.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex", gap: "10px", justifyContent: "end" }}>
          {params.row.mismatchmode?.includes("Unit + Flag") && (
            <LoadingButton
              onClick={(e) => {
                handleClickAllotUpdateTwo(params.row.ids, params.row.category, params.row.id);
              }}
              loading={isunitflagtwo === params.row.id}
              color="primary"
              size="small"
              disabled={updatedIds.length > 0 && updatedIds.map((d) => d._id).includes(params.row.id)}
              sx={{ textTransform: "capitalize", border: updatedIds.length > 0 && updatedIds.map((d) => d._id).includes(params.row.id) ? "2px solid #1976d2" : "", fontSize: updatedIds.length > 0 && updatedIds.map((d) => d._id).includes(params.row.id) ? "smaller" : "0.8125rem", padding: updatedIds.length > 0 && updatedIds.map((d) => d._id).includes(params.row.id) ? "2px" : "4px 10px", color: updatedIds.length > 0 && updatedIds.map((d) => d._id).includes(params.row.id) ? "#000000c7 !important" : "white" }}
              loadingPosition="end"
              variant="contained"
            >
              {updatedIds.map((d) => d._id).includes(params.row.id) ? "Updated Unit+Flag" : "Unit + Flag"}
            </LoadingButton>
          )}

          {params.row.mismatchmode?.includes("Unit") && (
            <LoadingButton
              onClick={(e) => {
                handleClickUnitUpdateTwo(params.row.ids, params.row.category, params.row.id);
              }}
              loading={isUnittwo === params.row.id}
              color="primary"
              size="small"
              // sx={{ textTransform: "capitalize" }}
              disabled={updatedIdsUnit.length > 0 && updatedIdsUnit.map((d) => d._id).includes(params.row.id)}
              sx={{ textTransform: "capitalize", border: updatedIdsUnit.length > 0 && updatedIdsUnit.map((d) => d._id).includes(params.row.id) ? "2px solid #1976d2" : "", fontSize: updatedIdsUnit.length > 0 && updatedIdsUnit.map((d) => d._id).includes(params.row.id) ? "smaller" : "0.8125rem", padding: updatedIdsUnit.length > 0 && updatedIdsUnit.map((d) => d._id).includes(params.row.id) ? "2px" : "4px 10px", color: updatedIdsUnit.length > 0 && updatedIdsUnit.map((d) => d._id).includes(params.row.id) ? "#000000c7 !important" : "white" }}
              loadingPosition="end"
              variant="contained"
            >
              {updatedIdsUnit.map((d) => d._id).includes(params.row.id) ? "Unit Updated" : "Unit"}
            </LoadingButton>
          )}

          {params.row.mismatchmode?.includes("Flag") && (
            <LoadingButton
              onClick={(e) => {
                handleClickFlagUpdateTwo(params.row.ids, params.row.category, params.row.id);
              }}
              loading={isFlagtwo === params.row.id}
              color="primary"
              size="small"
              disabled={updatedIdsFlag.length > 0 && updatedIdsFlag.map((d) => d._id).includes(params.row.id)}
              sx={{ textTransform: "capitalize", border: updatedIdsFlag.length > 0 && updatedIdsFlag.map((d) => d._id).includes(params.row.id) ? "2px solid #1976d2" : "", fontSize: updatedIdsFlag.length > 0 && updatedIdsFlag.map((d) => d._id).includes(params.row.id) ? "smaller" : "0.8125rem", padding: updatedIdsFlag.length > 0 && updatedIdsFlag.map((d) => d._id).includes(params.row.id) ? "2px" : "4px 10px", color: updatedIdsFlag.length > 0 && updatedIdsFlag.map((d) => d._id).includes(params.row.id) ? "#000000c7 !important" : "white" }}
              loadingPosition="end"
              variant="contained"
            >
              {updatedIdsFlag.map((d) => d._id).includes(params.row.id) ? "Flag Updated" : "Flag"}
            </LoadingButton>
          )}

          {params.row.mismatchmode?.includes("Unit + Section") && (
            <LoadingButton
              onClick={(e) => {
                handleClickSectionUpdateTwo(params.row.ids, params.row.category, params.row.id);
              }}
              loading={isSectiontwo === params.row.id}
              color="primary"
              size="small"
              disabled={updatedIdsSection.length > 0 && updatedIdsSection.map((d) => d._id).includes(params.row.id)}
              sx={{ textTransform: "capitalize", border: updatedIdsSection.length > 0 && updatedIdsSection.map((d) => d._id).includes(params.row.id) ? "2px solid #1976d2" : "", fontSize: updatedIdsSection.length > 0 && updatedIdsSection.map((d) => d._id).includes(params.row.id) ? "smaller" : "0.8125rem", padding: updatedIdsSection.length > 0 && updatedIdsSection.map((d) => d._id).includes(params.row.id) ? "2px" : "4px 10px", color: updatedIdsSection.length > 0 && updatedIdsSection.map((d) => d._id).includes(params.row.id) ? "#000000c7 !important" : "white" }}
              loadingPosition="end"
              variant="contained"
            >
              {updatedIdsSection.map((d) => d._id).includes(params.row.id) ? "Section Updated" : "Section"}
            </LoadingButton>
          )}

          {isUserRoleCompare?.includes("voriginalmismatch") && (
            <Button
              size="small"
              sx={{
                textTransform: "capitalize",
                backgroundColor: "#007F73", // Change background color to aqua
                color: "#fff", // Change text color to contrast with the background
                "&:hover": {
                  // Note the use of "&:hover" instead of "&.hover"
                  backgroundColor: "#055f56",
                },
              }}
              onClick={() => {
                // handleClickOpenview();
                setTableCount(3);
                getviewCodeTwo(params.row);
              }}
            // variant="contained"
            >
              View
            </Button>
          )}
        </Grid>
      ),
    },
  ];

  const rowDataTableTwo = filteredDataTwo.map((item, index) => {
    return {
      id: item._id,
      ids: item.ids,
      serialNumber: item.serialNumber,
      date: item.date,
      category: item.filename,
      mismatchmode: item.mismatchmode,
      mismatchmodeflagonly: item.mismatchmodeflagonly,
      vendor: item.vendor,
      vendornew: item.vendornew,
      count: item.count,
    };
  });

  //datatable....
  const handleSearchChangeTwo = (event) => {
    setSearchQueryTwo(event.target.value);
  };
  const [updatedIds, setupdatedIds] = useState([]);
  const [updatedIdsUnit, setupdatedIdsUnit] = useState([]);
  const [updatedIdsFlag, setupdatedIdsFlag] = useState([]);
  const [updatedIdsSection, setupdatedIdsSection] = useState([]);
  // console.log(selectedTwoIds,'selectedTwoIds');
  const [isBulkUpdateTwo, setIsBulkUpdateTwo] = useState(false);
  const handleBulkUpdateTwo = () => {

    setIsBulkUpdateTwo(true);
    if (isProdDayCount === 0) {
      if (selectedRowsTwo.length > 0) {
        if (mismatchmode === "Unit + Flag") {
          let filteredselectedTwoIds = selectedTwoIds.filter((item) => item.mismatchmode.includes("Unit + Flag"));

          if (filteredselectedTwoIds.filter((item) => item.mismatchmode.includes("Unit + Flag")).length > 0) {
            if (filteredselectedTwoIds.some((item) => item.mrate != undefined && item.mrate != 0 && item.unitflag != undefined && item.unitflag != 0)) {
              async function updateDataInBulk(items) {
                const updatePayload = items.map((item) => ({
                  _id: item._id,
                  mode: item.mode,

                  updatedflag: Number(item.unitflag),
                  updatedunitrate: Number(item.mrate),
                }));

                try {
                  await axios.post(
                    SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_UNITANDFLAG,
                    {
                      updates: updatePayload,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                      },
                    }
                  );
                  setupdatedIds((prev) => [...prev, ...items]);
                  // console.log( updatedIds,  "selectedTwoIds" );
                } catch (err) {
                  handleApiError(err, setShowAlert, handleClickOpenerr);
                  setSelectAllCheckedTwo(false);
                  setSelectedRowsTwo([]);
                  setSelectedTwoIds([]);
                  setIsBulkUpdateTwo(false);
                }
              }

              // Call the function to update data in bulk
              const validItems = filteredselectedTwoIds.filter((item) => item.mrate !== undefined && item.unitflag !== undefined);

              if (validItems.length > 0) {
                updateDataInBulk(validItems)
                  .then(() => {
                    setPopupContentMalert(validItems.length === filteredselectedTwoIds.length ? "Alloted" : "Present unitrate value only updated");
                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();

                    setSelectAllCheckedTwo(false);
                    setSelectedRowsTwo([]);
                    setSelectedTwoIds([]);
                    setIsBulkUpdateTwo(false);
                  })
                  .catch((err) => {
                    handleApiError(err, setShowAlert, handleClickOpenerr);
                    setSelectAllCheckedTwo(false);
                    setSelectedRowsTwo([]);
                    setSelectedTwoIds([]);
                    setIsBulkUpdateTwo(false);
                  });
              }
            } else {
              setSelectAllCheckedTwo(false);
              setSelectedRowsTwo([]);
              setSelectedTwoIds([]);
              setIsBulkUpdateTwo(false);

              setPopupContentMalert("Please Update Unitrate");
              setPopupSeverityMalert("info");
              handleClickOpenPopupMalert();
            }
          } else {
            setSelectAllCheckedTwo(false);
            setSelectedRowsTwo([]);
            setSelectedTwoIds([]);
            setIsBulkUpdateTwo(false);

            setPopupContentMalert("No Data to Update");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
          }
          setIsBulkUpdateTwo(false);
        } else if (mismatchmode === "Unit") {
          let filteredselectedTwoIds = selectedTwoIds.filter((item) => item.mismatchmode.includes("Unit"));

          if (filteredselectedTwoIds.filter((item) => item.mismatchmode.includes("Unit")).length > 0) {
            if (filteredselectedTwoIds.some((item) => item.mrate != undefined && item.mrate != 0)) {
              async function updateDataInBulk(items) {
                const updatePayload = items.map((item) => ({
                  _id: item._id,
                  mode: item.mode,
                  updatedunitrate: Number(item.mrate),
                }));

                try {
                  await axios.post(
                    SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_UNITONLY,
                    {
                      updates: updatePayload,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                      },
                    }
                  );
                  setupdatedIdsUnit((prev) => [...prev, ...items]);

                } catch (err) {
                  handleApiError(err, setShowAlert, handleClickOpenerr);
                  setSelectAllCheckedTwo(false);
                  setSelectedRowsTwo([]);
                  setSelectedTwoIds([]);
                  setIsBulkUpdateTwo(false);
                }
              }

              // Call the function to update data in bulk
              const validItems = filteredselectedTwoIds.filter((item) => item.mrate !== undefined);

              if (validItems.length > 0) {
                updateDataInBulk(validItems)
                  .then(() => {

                    setPopupContentMalert(validItems.length === filteredselectedTwoIds.length ? "Alloted" : "Present unitrate value only updated");
                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();
                    setSelectAllCheckedTwo(false);
                    setSelectedRowsTwo([]);
                    setSelectedTwoIds([]);
                    setIsBulkUpdateTwo(false);
                  })
                  .catch((err) => {
                    handleApiError(err, setShowAlert, handleClickOpenerr);
                    setSelectAllCheckedTwo(false);
                    setSelectedRowsTwo([]);
                    setSelectedTwoIds([]);
                    setIsBulkUpdateTwo(false);
                  });
              }
            } else {
              setSelectAllCheckedTwo(false);
              setSelectedRowsTwo([]);
              setSelectedTwoIds([]);
              setIsBulkUpdateTwo(false);
              setPopupContentMalert("Please Update Unitrate");
              setPopupSeverityMalert("info");
              handleClickOpenPopupMalert();
            }
          } else {
            setSelectAllCheckedTwo(false);
            setSelectedRowsTwo([]);
            setSelectedTwoIds([]);
            setIsBulkUpdateTwo(false);
            setPopupContentMalert("No Data to Update");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
          }
        } else if (mismatchmode === "Flag") {
          let filteredselectedTwoIds = selectedTwoIds.filter((item) => item.mismatchmode.includes("Flag"));
          if (filteredselectedTwoIds.filter((item) => item.mismatchmode.includes("Flag")).length > 0) {
            if (filteredselectedTwoIds.some((item) => item.unitflag != undefined && item.unitflag != 0)) {
              async function updateDataInBulk(items) {
                const updatePayload = items.map((item) => ({
                  _id: item._id,
                  mode: item.mode,
                  updatedflag: Number(item.unitflag),
                }));

                try {
                  await axios.post(
                    SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_FLAGONLY,
                    {
                      updates: updatePayload,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                      },
                    }
                  );
                  setupdatedIdsFlag((prev) => [...prev, ...items]);
                  // console.log( updatedIds,  "selectedTwoIds" );
                } catch (err) {
                  handleApiError(err, setShowAlert, handleClickOpenerr);
                  setSelectAllCheckedTwo(false);
                  setSelectedRowsTwo([]);
                  setSelectedTwoIds([]);
                  setIsBulkUpdateTwo(false);
                }
              }

              // Call the function to update data in bulk
              const validItems = filteredselectedTwoIds.filter((item) => item.unitflag !== undefined);

              if (validItems.length > 0) {
                updateDataInBulk(validItems)
                  .then(() => {

                    setPopupContentMalert(validItems.length === filteredselectedTwoIds.length ? "Alloted" : "Present unitrate value only updated");
                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();
                    setSelectAllCheckedTwo(false);
                    setSelectedRowsTwo([]);
                    setSelectedTwoIds([]);
                    setIsBulkUpdateTwo(false);
                  })
                  .catch((err) => {
                    handleApiError(err, setShowAlert, handleClickOpenerr);
                    setSelectAllCheckedTwo(false);
                    setSelectedRowsTwo([]);
                    setSelectedTwoIds([]);
                    setIsBulkUpdateTwo(false);
                  });
              }
            } else {
              setSelectAllCheckedTwo(false);
              setSelectedRowsTwo([]);
              setSelectedTwoIds([]);
              setIsBulkUpdateTwo(false);
              setPopupContentMalert("Please Update Unitrate");
              setPopupSeverityMalert("info");
              handleClickOpenPopupMalert();
            }
          } else {
            setSelectAllCheckedTwo(false);
            setSelectedRowsTwo([]);
            setSelectedTwoIds([]);
            setIsBulkUpdateTwo(false);
            setPopupContentMalert("No Data to Update");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
          }
        } else if (mismatchmode === "Unit + Section") {
          let filteredselectedTwoIds = selectedTwoIds.filter((item) => item.mismatchmode.includes("Unit + Section"));
          if (filteredselectedTwoIds.filter((item) => item.mismatchmode.includes("Unit + Section")).length > 0) {
            if (filteredselectedTwoIds.filter((item) => item.mrate != undefined && item.mrate != 0 && item.unitflag != undefined && item.unitflag != 0 && item.section !== undefined).length > 0) {
              async function updateDataInBulk(items) {
                const updatePayload = items.map((item) => ({
                  _id: item._id,
                  mode: item.mode,

                  updatedunitrate: Number(item.mrate),
                  updatedsection: Number(item.mrate) * Number(item.unitflag) * Number(item.section),
                }));

                try {
                  await axios.post(
                    SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_UNITANDSECTION,
                    {
                      updates: updatePayload,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                      },
                    }
                  );
                  setupdatedIdsFlag((prev) => [...prev, ...items]);
                  // console.log( updatedIds,  "selectedTwoIds" );
                } catch (err) {
                  handleApiError(err, setShowAlert, handleClickOpenerr);
                  setSelectAllCheckedTwo(false);
                  setSelectedRowsTwo([]);
                  setSelectedTwoIds([]);
                  setIsBulkUpdateTwo(false);
                }
              }

              // Call the function to update data in bulk
              const validItems = filteredselectedTwoIds.filter((item) => item.mrate !== undefined && item.unitflag !== undefined && item.section !== undefined);

              if (validItems.length > 0) {
                updateDataInBulk(validItems)
                  .then(() => {

                    setPopupContentMalert(validItems.length === filteredselectedTwoIds.length ? "Alloted" : "Present unitrate value only updated");
                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();
                    setSelectAllCheckedTwo(false);
                    setSelectedRowsTwo([]);
                    setSelectedTwoIds([]);
                    setIsBulkUpdateTwo(false);
                  })
                  .catch((err) => {
                    handleApiError(err, setShowAlert, handleClickOpenerr);
                    setSelectAllCheckedTwo(false);
                    setSelectedRowsTwo([]);
                    setSelectedTwoIds([]);
                    setIsBulkUpdateTwo(false);
                  });
              } else {
                setPopupContentMalert("Section not Present");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
                setSelectAllCheckedTwo(false);
                setSelectedRowsTwo([]);
                setSelectedTwoIds([]);
                setIsBulkUpdateTwo(false);
              }
            } else {
              setSelectAllCheckedTwo(false);
              setSelectedRowsTwo([]);
              setSelectedTwoIds([]);
              setIsBulkUpdateTwo(false);

              setPopupContentMalert("Section not Present");
              setPopupSeverityMalert("info");
              handleClickOpenPopupMalert();
            }
          } else {
            setSelectAllCheckedTwo(false);
            setSelectedRowsTwo([]);
            setSelectedTwoIds([]);
            setIsBulkUpdateTwo(false);
            setPopupContentMalert("No Data to Update");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
          }
        } else {
          setIsBulkUpdateTwo(false);

          setPopupContentMalert("Please Select Mode");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
        }
      } else {
        setIsBulkUpdateTwo(false);

        setPopupContentMalert("Please Select Row");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }

    }
    else {
      setIsBulkUpdateTwo(false);

      setPopupContentMalert("!Already Production Day Created ");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();

    }

  };

  const gridRefTwo = useRef(null);

  // Show All Columns functionality
  const handleShowAllColumnsTwo = () => {
    const updatedVisibility = { ...columnVisibilityTwo };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibilityTwo(updatedVisibility);
  };

  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem("columnVisibilitytwo");
    if (savedVisibility) {
      setColumnVisibilityTwo(JSON.parse(savedVisibility));
    }
  }, []);

  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem("columnVisibilitytwo", JSON.stringify(columnVisibilityTwo));
  }, [columnVisibilityTwo]);

  // // Function to filter columns based on search query
  const filteredColumnsTwo = columnDataTableTwo.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));

  // Manage Columns functionality
  const toggleColumnVisibilityTwo = (field) => {
    setColumnVisibilityTwo((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  // JSX for the "Manage Columns" popover content
  const manageColumnsContentTwo = (
    <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
      <Typography variant="h6">Manage Columns</Typography>
      <IconButton
        aria-label="close"
        onClick={handleCloseManageColumnsTwo}
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
        <TextField label="Find column" variant="standard" fullWidth value={searchQueryManageTwo} onChange={(e) => setSearchQueryManageTwo(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
      </Box>
      <br />
      <br />
      <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumnsTwo.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibilityTwo[column.field]} onChange={() => toggleColumnVisibilityTwo(column.field)} />}
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
            <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibilityTwo(initialColumnVisibilityTwo)}>
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
                columnDataTableTwo.forEach((column) => {
                  newColumnVisibility[column.field] = false; // Set hide property to true
                });
                setColumnVisibilityTwo(newColumnVisibility);
              }}
            >
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );


  //-------------------------------------------Table Three-----------------------------------------------------------

  const [itemsThree, setItemsThree] = useState([]);
  const [pageThree, setPageThree] = useState(1);
  const [searchQueryManageThree, setSearchQueryManageThree] = useState("");
  const [searchQueryThree, setSearchQueryThree] = useState("");

  // Manage Columns

  const addSerialNumberThree = () => {
    const itemsWithSerialNumber = tableThreeDatas?.map((item, index) => ({
      ...item,
      serialNumber: index + 1, id: index, category: item.filename,
    }));
    setItemsThree(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumberThree();
  }, [tableThreeDatas]);

  const initialColumnVisibilityThree = {
    serialNumber: true,
    checkbox: true,
    date: true,
    category: true,
    vendor: true,
    vendor1: true,
    project: true,
    count: true,
    actions: true,
  };

  const [columnVisibilityThree, setColumnVisibilityThree] = useState(initialColumnVisibilityThree);

  // Manage Columns
  const [isManageColumnsOpenThree, setManageColumnsOpenThree] = useState(false);
  const [anchorElThree, setAnchorElThree] = useState(null);

  const handleOpenManageColumnsThree = (event) => {
    setAnchorElThree(event.currentTarget);
    setManageColumnsOpenThree(true);
  };

  const openThree = Boolean(anchorElThree);
  const idThree = openThree ? "simple-popover" : undefined;

  const handleCloseManageColumnsThree = () => {
    setManageColumnsOpenThree(false);
    setSearchQueryManageThree("");
  };

  const [pageSizeThree, setPageSizeThree] = useState(10);
  //Datatable
  const handlePageChangeThree = (newPage) => {
    setPageThree(newPage);
  };
  const handlePageSizeChangeThree = (event) => {
    setPageSizeThree(Number(event.target.value));
    setSelectedRows([]);
    setSelectAllChecked(false);
    setPage(1);
  };

  // Split the search query into individual terms
  const searchTermsThree = searchQueryThree.toLowerCase().split(" ");

  // Modify the filtering logic to check each term
  const filteredDataThrees = itemsThree?.filter((item) => {
    return searchTermsThree.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  const filteredDataThree = filteredDataThrees.slice((pageThree - 1) * pageSizeThree, pageThree * pageSizeThree);

  const totalPagesThree = Math.ceil(filteredDataThrees.length / pageSizeThree);

  const visiblePagesThree = Math.min(totalPagesThree, 3);

  const firstVisiblePageThree = Math.max(1, pageThree - 1);
  const lastVisiblePageThree = Math.min(firstVisiblePageThree + visiblePagesThree - 1, totalPagesThree);

  const pageNumbersThree = [];

  const indexOfLastItemThree = pageThree * pageSizeThree;
  const indexOfFirstItemThree = indexOfLastItemThree - pageSizeThree;

  for (let i = firstVisiblePageThree; i <= lastVisiblePageThree; i++) {
    pageNumbersThree.push(i);
  }
  const columnDataTableThree = [
    {
      field: "checkbox",
      headerName: "Checkbox", // Default header name
      headerStyle: {
        fontWeight: "bold", // Apply the font-weight style to make the header text bold
        // Add any other CSS styles as needed
      },
      renderHeader: (params) => (
        <CheckboxHeader
          selectAllChecked={selectAllCheckedThree}
          onSelectAll={() => {
            if (rowDataTableThree.length === 0) {
              // Do not allow checking when there are no rows
              return;
            }
            if (selectAllCheckedThree) {
              setSelectedRowsThree([]);
            } else {
              const allRowIds = rowDataTableThree.map((row) => row.id);
              setSelectedRowsThree(allRowIds);
              const allRowUpdaetIds = rowDataTableThree.map((row) => row.ids).flat();
              setSelectedThreeIds(allRowUpdaetIds);
            }
            setSelectAllCheckedThree(!selectAllCheckedThree);
          }}
        />
      ),

      renderCell: (params) => (
        <Checkbox
          checked={selectedRowsThree.includes(params.row.id)}
          onChange={() => {
            let updatedSelectedRowsThree;
            let updatedSelectedRowsThreeIds;
            let datas = params.row.ids.flat();
            // console.log(params.row.ids.flat())
            if (selectedRowsThree.includes(params.row.id)) {
              updatedSelectedRowsThree = selectedRowsThree.filter((selectedId) => selectedId !== params.row.id);
              updatedSelectedRowsThreeIds = selectedThreeIds.filter((selectedId) => !datas.map((d) => d.category).includes(selectedId.category));
            } else {
              updatedSelectedRowsThree = [...selectedRowsThree, params.row.id];
              updatedSelectedRowsThreeIds = [...selectedThreeIds, ...datas];
            }

            setSelectedRowsThree(updatedSelectedRowsThree);
            setSelectedThreeIds(updatedSelectedRowsThreeIds);
            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllCheckedThree(updatedSelectedRowsThree.length === filteredDataThree.length);
          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 90,

      hide: !columnVisibilityThree.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 90,
      hide: !columnVisibilityThree.serialNumber,
      headerClassName: "bold-header",
    },

    { field: "date", headerName: "Date", flex: 0, width: 100, hide: !columnVisibilityThree.date, headerClassName: "bold-header" },
    { field: "category", headerName: "Category", flex: 0, width: 300, hide: !columnVisibilityThree.category, headerClassName: "bold-header" },
    { field: "project", headerName: "Project", flex: 0, width: 150, hide: !columnVisibilityThree.project, headerClassName: "bold-header" },
    { field: "vendor1", headerName: "Vendor", flex: 0, width: 120, hide: !columnVisibilityThree.vendor1, headerClassName: "bold-header" },

    { field: "count", headerName: "Count", flex: 0, width: 100, hide: !columnVisibilityThree.count, headerClassName: "bold-header" },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 550,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibilityThree.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex", gap: "10px" }}>
          {params.row.mismatchmode?.includes("Unit + Flag") && (
            <LoadingButton
              onClick={(e) => {
                handleClickAllotUpdateThree(params.row.ids, params.row.category, params.row.id);
              }}
              loading={isunitflagthree === params.row.id}
              color="primary"
              size="small"
              disabled={updatedIds.length > 0 && updatedIds.map((d) => d._id).includes(params.row.id)}
              sx={{ textTransform: "capitalize", border: updatedIds.length > 0 && updatedIds.map((d) => d._id).includes(params.row.id) ? "2px solid #1976d2" : "", fontSize: updatedIds.length > 0 && updatedIds.map((d) => d._id).includes(params.row.id) ? "smaller" : "0.8125rem", padding: updatedIds.length > 0 && updatedIds.map((d) => d._id).includes(params.row.id) ? "2px" : "4px 10px", color: updatedIds.length > 0 && updatedIds.map((d) => d._id).includes(params.row.id) ? "#000000c7 !important" : "white" }}
              loadingPosition="end"
              variant="contained"
            >
              {updatedIds.map((d) => d._id).includes(params.row.id) ? "Updated Unit+Flag" : "Unit + Flag"}
            </LoadingButton>
          )}

          {params.row.mismatchmode?.includes("Unit") && (
            <LoadingButton
              onClick={(e) => {
                handleClickUnitUpdateThree(params.row.ids, params.row.category, params.row.id);
              }}
              loading={isUnitthree === params.row.id}
              color="primary"
              size="small"
              disabled={updatedIdsUnit.length > 0 && updatedIdsUnit.map((d) => d._id).includes(params.row.id)}
              sx={{ textTransform: "capitalize", border: updatedIdsUnit.length > 0 && updatedIdsUnit.map((d) => d._id).includes(params.row.id) ? "2px solid #1976d2" : "", fontSize: updatedIdsUnit.length > 0 && updatedIdsUnit.map((d) => d._id).includes(params.row.id) ? "smaller" : "0.8125rem", padding: updatedIdsUnit.length > 0 && updatedIdsUnit.map((d) => d._id).includes(params.row.id) ? "2px" : "4px 10px", color: updatedIdsUnit.length > 0 && updatedIdsUnit.map((d) => d._id).includes(params.row.id) ? "#000000c7 !important" : "white" }}
              loadingPosition="end"
              variant="contained"
            >
              {updatedIdsUnit.map((d) => d._id).includes(params.row.id) ? "Unit Updated" : "Unit"}
            </LoadingButton>
          )}

          {params.row.mismatchmode?.includes("Flag") && (
            <LoadingButton
              onClick={(e) => {
                handleClickFlagUpdateThree(params.row.ids, params.row.category, params.row.id);
              }}
              loading={isFlagthree === params.row.id}
              color="primary"
              size="small"
              disabled={updatedIdsFlag.length > 0 && updatedIdsFlag.map((d) => d._id).includes(params.row.id)}
              sx={{ textTransform: "capitalize", border: updatedIdsFlag.length > 0 && updatedIdsFlag.map((d) => d._id).includes(params.row.id) ? "2px solid #1976d2" : "", fontSize: updatedIdsFlag.length > 0 && updatedIdsFlag.map((d) => d._id).includes(params.row.id) ? "smaller" : "0.8125rem", padding: updatedIdsFlag.length > 0 && updatedIdsFlag.map((d) => d._id).includes(params.row.id) ? "2px" : "4px 10px", color: updatedIdsFlag.length > 0 && updatedIdsFlag.map((d) => d._id).includes(params.row.id) ? "#000000c7 !important" : "white" }}
              loadingPosition="end"
              variant="contained"
            >
              {updatedIdsFlag.map((d) => d._id).includes(params.row.id) ? "Flag Updated" : "Flag"}
            </LoadingButton>
          )}

          {params.row.mismatchmode?.includes("Unit + Section") && (
            <LoadingButton
              onClick={(e) => {
                handleClickSectionUpdateThree(params.row.ids, params.row.category, params.row.id);
              }}
              loading={isSectionthree === params.row.id}
              color="primary"
              size="small"
              disabled={updatedIdsSection.length > 0 && updatedIdsSection.map((d) => d._id).includes(params.row.id)}
              sx={{ textTransform: "capitalize", border: updatedIdsSection.length > 0 && updatedIdsSection.map((d) => d._id).includes(params.row.id) ? "2px solid #1976d2" : "", fontSize: updatedIdsSection.length > 0 && updatedIdsSection.map((d) => d._id).includes(params.row.id) ? "smaller" : "0.8125rem", padding: updatedIdsSection.length > 0 && updatedIdsSection.map((d) => d._id).includes(params.row.id) ? "2px" : "4px 10px", color: updatedIdsSection.length > 0 && updatedIdsSection.map((d) => d._id).includes(params.row.id) ? "#000000c7 !important" : "white" }}
              loadingPosition="end"
              variant="contained"
            >
              {updatedIdsSection.map((d) => d._id).includes(params.row.id) ? "Section Updated" : "Section"}
            </LoadingButton>
          )}

          {isUserRoleCompare?.includes("voriginalmismatch") && (
            <Button
              size="small"
              sx={{
                textTransform: "capitalize",
                backgroundColor: "#007F73", // Change background color to aqua
                color: "#fff", // Change text color to contrast with the background
                "&:hover": {
                  // Note the use of "&:hover" instead of "&.hover"
                  backgroundColor: "#055f56",
                },
              }}
              onClick={() => {
                // handleClickOpenview();
                setTableCount(4);
                getviewCodeThree(params.row);
              }}
            // variant="contained"
            >
              View
            </Button>
          )}
        </Grid>
      ),
    },
  ];

  const rowDataTableThree = filteredDataThree.map((item, index) => {
    return {
      id: item._id,
      ids: item.ids,
      serialNumber: item.serialNumber,
      date: item.date,
      category: item.category,
      mismatchmode: item.mismatchmode,
      mismatchmodeflagonly: item.mismatchmodeflagonly,
      vendor: item.vendor,
      vendor1: item.vendor1,
      project: item.project,
      count: item.count,
    };
  });

  //datatable....
  const handleSearchChangeThree = (event) => {
    setSearchQueryThree(event.target.value);
  };

  const [isBulkUpdateThree, setIsBulkUpdateThree] = useState(false);
  const [selectedThreeIds, setSelectedThreeIds] = useState([]);

  const handleBulkUpdateThree = () => {
    setIsBulkUpdateThree(true);
    if (isProdDayCount === 0) {
      if (selectedRowsThree.length > 0) {
        if (mismatchmodeThree === "Unit + Flag") {
          let filteredselectedThreeIds = selectedThreeIds.filter((item) => item.mismatchmode.includes("Unit + Flag"));

          if (filteredselectedThreeIds.filter((item) => item.mismatchmode.includes("Unit + Flag")).length > 0) {
            if (filteredselectedThreeIds.some((item) => item.mrate != undefined && item.mrate != 0 && item.unitflag != undefined && item.unitflag != 0)) {
              async function updateDataInBulk(items) {
                const updatePayload = items.map((item) => ({
                  _id: item._id,
                  mode: item.mode,
                  updatedflag: Number(item.unitflag),
                  updatedunitrate: Number(item.mrate),
                }));

                try {
                  await axios.post(
                    SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_UNITANDFLAG,
                    {
                      updates: updatePayload,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                      },
                    }
                  );
                  setupdatedIds((prev) => [...prev, ...items]);
                  // console.log( updatedIds,  "selectedTwoIds" );
                } catch (err) {
                  handleApiError(err, setShowAlert, handleClickOpenerr);
                  setSelectAllCheckedTwo(false);
                  setSelectedRowsTwo([]);
                  setSelectedTwoIds([]);
                  setIsBulkUpdateTwo(false);
                }
              }

              // Call the function to update data in bulk
              const validItems = filteredselectedThreeIds.filter((item) => item.mrate !== undefined && item.unitflag !== undefined);

              if (validItems.length > 0) {
                updateDataInBulk(validItems)
                  .then(() => {
                    setPopupContentMalert(validItems.length === filteredselectedThreeIds.length ? "Alloted" : "Present unitrate value only updated");
                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();
                    setSelectAllCheckedThree(false);
                    setSelectedRowsThree([]);
                    setSelectedThreeIds([]);
                    setIsBulkUpdateThree(false);
                  })
                  .catch((err) => {
                    handleApiError(err, setShowAlert, handleClickOpenerr);
                    setSelectAllCheckedThree(false);
                    setSelectedRowsThree([]);
                    setSelectedThreeIds([]);
                    setIsBulkUpdateThree(false);
                  });
              } else {
                setSelectAllCheckedThree(false);
                setSelectedRowsThree([]);
                setSelectedThreeIds([]);
                setIsBulkUpdateThree(false);
                setPopupContentMalert("Please Update Unitrate");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
              }
            } else {
              setSelectAllCheckedThree(false);
              setSelectedRowsThree([]);
              setSelectedThreeIds([]);
              setIsBulkUpdateThree(false);
              setPopupContentMalert("Please Update Unitrate");
              setPopupSeverityMalert("info");
              handleClickOpenPopupMalert();
            }
          } else {
            setSelectAllCheckedThree(false);
            setSelectedRowsThree([]);
            setSelectedThreeIds([]);
            setIsBulkUpdateThree(false);
            setPopupContentMalert("No Data to Update");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
          }
        } else if (mismatchmodeThree === "Unit") {
          let filteredselectedThreeIds = selectedThreeIds.filter((item) => item.mismatchmode.includes("Unit"));

          if (filteredselectedThreeIds.filter((item) => item.mismatchmode.includes("Unit")).length > 0) {
            if (filteredselectedThreeIds.some((item) => item.mrate != undefined && item.mrate != 0)) {
              async function updateDataInBulk(items) {
                const updatePayload = items.map((item) => ({
                  _id: item._id,
                  mode: item.mode,

                  updatedunitrate: Number(item.mrate),
                }));

                try {
                  await axios.post(
                    SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_UNITONLY,
                    {
                      updates: updatePayload,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                      },
                    }
                  );
                  setupdatedIdsUnit((prev) => [...prev, ...items]);
                  // console.log( updatedIds,  "selectedTwoIds" );
                } catch (err) {
                  handleApiError(err, setShowAlert, handleClickOpenerr);
                  setSelectAllCheckedThree(false);
                  setSelectedRowsThree([]);
                  setSelectedThreeIds([]);
                  setIsBulkUpdateThree(false);
                }
              }

              // Call the function to update data in bulk
              const validItems = filteredselectedThreeIds.filter((item) => item.mrate !== undefined);

              if (validItems.length > 0) {
                updateDataInBulk(validItems)
                  .then(() => {

                    setPopupContentMalert(validItems.length === filteredselectedThreeIds.length ? "Alloted" : "Present unitrate value only updated");
                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();
                    setSelectAllCheckedThree(false);
                    setSelectedRowsThree([]);
                    setSelectedThreeIds([]);
                    setIsBulkUpdateThree(false);
                  })
                  .catch((err) => {
                    handleApiError(err, setShowAlert, handleClickOpenerr);
                    setSelectAllCheckedThree(false);
                    setSelectedRowsThree([]);
                    setSelectedThreeIds([]);
                    setIsBulkUpdateThree(false);
                  });
              }
            } else {
              setSelectAllCheckedThree(false);
              setSelectedRowsThree([]);
              setSelectedThreeIds([]);
              setIsBulkUpdateThree(false);
              setPopupContentMalert("Please Update Unitrate");
              setPopupSeverityMalert("info");
              handleClickOpenPopupMalert();
            }
          } else {
            setSelectAllCheckedThree(false);
            setSelectedRowsThree([]);
            setSelectedThreeIds([]);
            setIsBulkUpdateThree(false);
            setPopupContentMalert("No Data to Update");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
          }
        } else if (mismatchmodeThree === "Flag") {
          let filteredselectedThreeIds = selectedThreeIds.filter((item) => item.mismatchmode.includes("Flag"));
          if (filteredselectedThreeIds.filter((item) => item.mismatchmode.includes("Flag")).length > 0) {
            if (filteredselectedThreeIds.some((item) => item.unitflag != undefined && item.unitflag != 0)) {
              async function updateDataInBulk(items) {
                const updatePayload = items.map((item) => ({
                  _id: item._id,
                  mode: item.mode,
                  updatedflag: Number(item.unitflag),
                }));

                try {
                  await axios.post(
                    SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_FLAGONLY,
                    {
                      updates: updatePayload,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                      },
                    }
                  );
                  setupdatedIdsFlag((prev) => [...prev, ...items]);
                  // console.log( updatedIds,  "selectedTwoIds" );
                } catch (err) {
                  handleApiError(err, setShowAlert, handleClickOpenerr);
                  setSelectAllCheckedThree(false);
                  setSelectedRowsThree([]);
                  setSelectedThreeIds([]);
                  setIsBulkUpdateThree(false);
                }
              }

              // Call the function to update data in bulk
              const validItems = filteredselectedThreeIds.filter((item) => item.unitflag !== undefined);

              if (validItems.length > 0) {
                updateDataInBulk(validItems)
                  .then(() => {

                    setPopupContentMalert(validItems.length === filteredselectedThreeIds.length ? "Alloted" : "Present unitrate value only updated");
                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();
                    setSelectAllCheckedThree(false);
                    setSelectedRowsThree([]);
                    setSelectedThreeIds([]);
                    setIsBulkUpdateThree(false);
                  })
                  .catch((err) => {
                    handleApiError(err, setShowAlert, handleClickOpenerr);
                    setSelectAllCheckedThree(false);
                    setSelectedRowsThree([]);
                    setSelectedThreeIds([]);
                    setIsBulkUpdateThree(false);
                  });
              }
            } else {
              setSelectAllCheckedThree(false);
              setSelectedRowsThree([]);
              setSelectedThreeIds([]);
              setIsBulkUpdateThree(false);
              setPopupContentMalert("Please Update Unitrate");
              setPopupSeverityMalert("info");
              handleClickOpenPopupMalert();
            }
          } else {
            setSelectAllCheckedThree(false);
            setSelectedRowsThree([]);
            setSelectedThreeIds([]);
            setIsBulkUpdateThree(false);
            setPopupContentMalert("No Data to Update");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
          }
        } else if (mismatchmodeThree === "Unit + Section") {
          let filteredselectedThreeIds = selectedThreeIds.filter((item) => item.mismatchmode.includes("Unit + Section"));
          if (filteredselectedThreeIds.filter((item) => item.mismatchmode.includes("Unit + Section")).length > 0) {
            if (filteredselectedThreeIds.filter((item) => item.mrate != undefined && item.mrate != 0 && item.unitflag != undefined && item.unitflag != 0 && item.section !== undefined).length > 0) {
              async function updateDataInBulk(items) {
                const updatePayload = items.map((item) => ({
                  _id: item._id,
                  mode: item.mode,

                  updatedunitrate: Number(item.mrate),
                  updatedsection: Number(item.mrate) * Number(item.unitflag) * Number(item.section),
                }));

                try {
                  await axios.post(
                    SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_UNITANDSECTION,
                    {
                      updates: updatePayload,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                      },
                    }
                  );
                  setupdatedIdsFlag((prev) => [...prev, ...items]);
                  // console.log( updatedIds,  "selectedTwoIds" );
                } catch (err) {
                  handleApiError(err, setShowAlert, handleClickOpenerr);
                  setSelectAllCheckedThree(false);
                  setSelectedRowsThree([]);
                  setSelectedThreeIds([]);
                  setIsBulkUpdateThree(false);
                }
              }

              // Call the function to update data in bulk
              const validItems = filteredselectedThreeIds.filter((item) => item.mrate !== undefined && item.unitflag !== undefined && item.section !== undefined);

              if (validItems.length > 0) {
                updateDataInBulk(validItems)
                  .then(() => {
                    setPopupContentMalert(validItems.length === filteredselectedThreeIds.length ? "Alloted" : "Present unitrate value only updated");
                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();

                    setSelectAllCheckedThree(false);
                    setSelectedRowsThree([]);
                    setSelectedThreeIds([]);
                    setIsBulkUpdateThree(false);
                  })
                  .catch((err) => {
                    handleApiError(err, setShowAlert, handleClickOpenerr);
                    setSelectAllCheckedThree(false);
                    setSelectedRowsThree([]);
                    setSelectedThreeIds([]);
                    setIsBulkUpdateThree(false);
                  });
              } else {

                setPopupContentMalert("Section not Present");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();

                setSelectAllCheckedThree(false);
                setSelectedRowsThree([]);
                setSelectedThreeIds([]);
                setIsBulkUpdateThree(false);
              }
              // setIsSectionone(false);
            } else {
              setSelectAllCheckedThree(false);
              setSelectedRowsThree([]);
              setSelectedThreeIds([]);
              setIsBulkUpdateThree(false);
              setPopupContentMalert("Section not Present");
              setPopupSeverityMalert("info");
              handleClickOpenPopupMalert();

            }
          } else {
            setSelectAllCheckedThree(false);
            setSelectedRowsThree([]);
            setSelectedThreeIds([]);
            setIsBulkUpdateThree(false);
            setPopupContentMalert("No Data to Update");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
          }
        } else {
          setIsBulkUpdateThree(false);
          setPopupContentMalert("Please Select Mode");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
        }
      } else {
        setIsBulkUpdateThree(false);
        setPopupContentMalert("Please Select Row");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();

      }
    }
    else {
      setIsBulkUpdateThree(false);
      setPopupContentMalert("!Already Production Day Created ");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }

  };

  const gridRefThree = useRef(null);

  // Show All Columns functionality
  const handleShowAllColumnsThree = () => {
    const updatedVisibility = { ...columnVisibilityThree };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibilityThree(updatedVisibility);
  };

  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem("columnVisibilitythree");
    if (savedVisibility) {
      setColumnVisibilityThree(JSON.parse(savedVisibility));
    }
  }, []);

  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem("columnVisibilitythree", JSON.stringify(columnVisibilityThree));
  }, [columnVisibilityThree]);

  // // Function to filter columns based on search query
  const filteredColumnsThree = columnDataTableThree.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));

  // Manage Columns functionality
  const toggleColumnVisibilityThree = (field) => {
    setColumnVisibilityThree((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  // JSX for the "Manage Columns" popover content
  const manageColumnsContentThree = (
    <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
      <Typography variant="h6">Manage Columns</Typography>
      <IconButton
        aria-label="close"
        onClick={handleCloseManageColumnsThree}
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
        <TextField label="Find column" variant="standard" fullWidth value={searchQueryManageThree} onChange={(e) => setSearchQueryManageThree(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
      </Box>
      <br />
      <br />
      <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumnsThree.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibilityThree[column.field]} onChange={() => toggleColumnVisibilityThree(column.field)} />}
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
            <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibilityThree(initialColumnVisibilityThree)}>
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
                columnDataTableThree.forEach((column) => {
                  newColumnVisibility[column.field] = false; // Set hide property to true
                });
                setColumnVisibilityThree(newColumnVisibility);
              }}
            >
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );


  //-------------------------------------------Table Four-----------------------------------------------------------

  const [itemsFour, setItemsFour] = useState([]);
  const [pageFour, setPageFour] = useState(1);
  const [searchQueryManageFour, setSearchQueryManageFour] = useState("");
  const [searchQueryFour, setSearchQueryFour] = useState("");

  // Manage Columns

  const addSerialNumberFour = () => {
    const itemsWithSerialNumber = tableFourDatas?.map((item, index) => ({ ...item, serialNumber: index + 1, id: index }));
    setItemsFour(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumberFour();
  }, [tableFourDatas]);

  const initialColumnVisibilityFour = {
    serialNumber: true,
    checkbox: true,
    date: true,
    project: true,
    vendor1: true,
    category1: true,
    subcategory: true,
    count: true,
    actions: true,
  };

  const [columnVisibilityFour, setColumnVisibilityFour] = useState(initialColumnVisibilityFour);

  // Manage Columns
  const [isManageColumnsOpenFour, setManageColumnsOpenFour] = useState(false);
  const [anchorElFour, setAnchorElFour] = useState(null);

  const handleOpenManageColumnsFour = (event) => {
    setAnchorElFour(event.currentTarget);
    setManageColumnsOpenFour(true);
  };

  const openFour = Boolean(anchorElFour);
  const idFour = openFour ? "simple-popover" : undefined;

  const handleCloseManageColumnsFour = () => {
    setManageColumnsOpenFour(false);
    setSearchQueryManageFour("");
  };

  const [pageSizeFour, setPageSizeFour] = useState(10);
  //Datatable
  const handlePageChangeFour = (newPage) => {
    setPageFour(newPage);
  };
  const handlePageSizeChangeFour = (event) => {
    setPageSizeFour(Number(event.target.value));
    setSelectedRows([]);
    setSelectAllChecked(false);
    setPage(1);
  };

  // Split the search query into individual terms
  const searchTermsFour = searchQueryFour.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDataFours = itemsFour?.filter((item) => {
    return searchTermsFour.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  const filteredDataFour = filteredDataFours.slice((pageFour - 1) * pageSizeFour, pageFour * pageSizeFour);

  const totalPagesFour = Math.ceil(filteredDataFours.length / pageSizeFour);

  const visiblePagesFour = Math.min(totalPagesFour, 3);

  const firstVisiblePageFour = Math.max(1, pageFour - 1);
  const lastVisiblePageFour = Math.min(firstVisiblePageFour + visiblePagesFour - 1, totalPagesFour);

  const pageNumbersFour = [];

  const indexOfLastItemFour = pageFour * pageSizeFour;
  const indexOfFirstItemFour = indexOfLastItemFour - pageSizeFour;

  for (let i = firstVisiblePageFour; i <= lastVisiblePageFour; i++) {
    pageNumbersFour.push(i);
  }
  const columnDataTableFour = [
    {
      field: "checkbox",
      headerName: "Checkbox", // Default header name
      headerStyle: {
        fontWeight: "bold", // Apply the font-weight style to make the header text bold
        // Add any other CSS styles as needed
      },
      renderHeader: (params) => (
        <CheckboxHeader
          selectAllChecked={selectAllCheckedFour}
          onSelectAll={() => {
            if (rowDataTableFour.length === 0) {
              // Do not allow checking when there are no rows
              return;
            }
            if (selectAllCheckedFour) {
              setSelectedRowsFour([]);
            } else {
              const allRowIds = rowDataTableFour.map((row) => row.id);
              setSelectedRowsFour(allRowIds);
              const allRowUpdaetIds = rowDataTableFour.map((row) => row.ids).flat();
              setSelectedFourIds(allRowUpdaetIds);
            }
            setSelectAllCheckedFour(!selectAllCheckedFour);
          }}
        />
      ),

      renderCell: (params) => (
        <Checkbox
          checked={selectedRowsFour.includes(params.row.id)}
          onChange={() => {
            let updatedSelectedRowsFour;
            let updatedSelectedRowsFourIds;
            let datas = params.row.ids.flat();
            // console.log(params.row.ids.flat())
            if (selectedRowsFour.includes(params.row.id)) {
              updatedSelectedRowsFour = selectedRowsFour.filter((selectedId) => selectedId !== params.row.id);
              updatedSelectedRowsFourIds = selectedFourIds.filter((selectedId) => !datas.map((d) => d.category).includes(selectedId.category));
            } else {
              updatedSelectedRowsFour = [...selectedRowsFour, params.row.id];
              updatedSelectedRowsFourIds = [...selectedFourIds, ...datas];
            }

            setSelectedRowsFour(updatedSelectedRowsFour);
            setSelectedFourIds(updatedSelectedRowsFourIds);
            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllCheckedFour(updatedSelectedRowsFour.length === filteredDataFour.length);
          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 90,

      hide: !columnVisibilityFour.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 80,
      hide: !columnVisibilityFour.serialNumber,
      headerClassName: "bold-header",
    },

    { field: "date", headerName: "Date", flex: 0, width: 100, hide: !columnVisibilityFour.date, headerClassName: "bold-header" },
    { field: "project", headerName: "Project", flex: 0, width: 150, hide: !columnVisibilityFour.project, headerClassName: "bold-header" },
    { field: "vendor1", headerName: "Vendor", flex: 0, width: 120, hide: !columnVisibilityFour.vendor1, headerClassName: "bold-header" },
    { field: "category1", headerName: "Category", flex: 0, width: 270, hide: !columnVisibilityFour.category1, headerClassName: "bold-header" },
    { field: "subcategory", headerName: "Sub Category", flex: 0, width: 320, hide: !columnVisibilityFour.subcategory, headerClassName: "bold-header" },

    { field: "count", headerName: "Count", flex: 0, width: 100, hide: !columnVisibilityFour.count, headerClassName: "bold-header" },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 550,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibilityFour.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex", gap: "10px" }}>
          {params.row.mismatchmode?.includes("Unit + Flag") && (
            <LoadingButton
              onClick={(e) => {
                handleClickAllotUpdateFour(params.row.ids, params.row.category1, params.row.id);
              }}
              loading={isunitflagfour === params.row.id}
              color="primary"
              size="small"
              disabled={updatedIds.length > 0 && updatedIds.map((d) => d._id).includes(params.row.id)}
              sx={{ textTransform: "capitalize", border: updatedIds.length > 0 && updatedIds.map((d) => d._id).includes(params.row.id) ? "2px solid #1976d2" : "", fontSize: updatedIds.length > 0 && updatedIds.map((d) => d._id).includes(params.row.id) ? "smaller" : "0.8125rem", padding: updatedIds.length > 0 && updatedIds.map((d) => d._id).includes(params.row.id) ? "2px" : "4px 10px", color: updatedIds.length > 0 && updatedIds.map((d) => d._id).includes(params.row.id) ? "#000000c7 !important" : "white" }}
              loadingPosition="end"
              variant="contained"
            >
              {updatedIds.map((d) => d._id).includes(params.row.id) ? "Updated Unit+Flag" : "Unit + Flag"}
            </LoadingButton>
          )}

          {params.row.mismatchmode?.includes("Unit") && (
            <LoadingButton
              onClick={(e) => {
                handleClickUnitUpdateFour(params.row.ids, params.row.category1, params.row.id);
              }}
              loading={isUnitfour === params.row.id}
              color="primary"
              size="small"
              disabled={updatedIdsUnit.length > 0 && updatedIdsUnit.map((d) => d._id).includes(params.row.id)}
              sx={{ textTransform: "capitalize", border: updatedIdsUnit.length > 0 && updatedIdsUnit.map((d) => d._id).includes(params.row.id) ? "2px solid #1976d2" : "", fontSize: updatedIdsUnit.length > 0 && updatedIdsUnit.map((d) => d._id).includes(params.row.id) ? "smaller" : "0.8125rem", padding: updatedIdsUnit.length > 0 && updatedIdsUnit.map((d) => d._id).includes(params.row.id) ? "2px" : "4px 10px", color: updatedIdsUnit.length > 0 && updatedIdsUnit.map((d) => d._id).includes(params.row.id) ? "#000000c7 !important" : "white" }}
              loadingPosition="end"
              variant="contained"
            >
              {updatedIdsUnit.map((d) => d._id).includes(params.row.id) ? "Unit Updated" : "Unit"}
            </LoadingButton>
          )}

          {params.row.mismatchmode?.includes("Flag") && (
            <LoadingButton
              onClick={(e) => {
                handleClickFlagUpdateFour(params.row.ids, params.row.category1, params.row.id);
              }}
              loading={isFlagfour === params.row.id}
              color="primary"
              size="small"
              disabled={updatedIdsFlag.length > 0 && updatedIdsFlag.map((d) => d._id).includes(params.row.id)}
              sx={{ textTransform: "capitalize", border: updatedIdsFlag.length > 0 && updatedIdsFlag.map((d) => d._id).includes(params.row.id) ? "2px solid #1976d2" : "", fontSize: updatedIdsFlag.length > 0 && updatedIdsFlag.map((d) => d._id).includes(params.row.id) ? "smaller" : "0.8125rem", padding: updatedIdsFlag.length > 0 && updatedIdsFlag.map((d) => d._id).includes(params.row.id) ? "2px" : "4px 10px", color: updatedIdsFlag.length > 0 && updatedIdsFlag.map((d) => d._id).includes(params.row.id) ? "#000000c7 !important" : "white" }}
              loadingPosition="end"
              variant="contained"
            >
              {updatedIdsFlag.map((d) => d._id).includes(params.row.id) ? "Flag Updated" : "Flag"}
            </LoadingButton>
          )}

          {params.row.mismatchmode?.includes("Unit + Section") && (
            <LoadingButton
              onClick={(e) => {
                handleClickSectionUpdateFour(params.row.ids, params.row.category1, params.row.id);
              }}
              loading={isSectionfour === params.row.id}
              color="primary"
              size="small"
              disabled={updatedIdsSection.length > 0 && updatedIdsSection.map((d) => d._id).includes(params.row.id)}
              sx={{ textTransform: "capitalize", border: updatedIdsSection.length > 0 && updatedIdsSection.map((d) => d._id).includes(params.row.id) ? "2px solid #1976d2" : "", fontSize: updatedIdsSection.length > 0 && updatedIdsSection.map((d) => d._id).includes(params.row.id) ? "smaller" : "0.8125rem", padding: updatedIdsSection.length > 0 && updatedIdsSection.map((d) => d._id).includes(params.row.id) ? "2px" : "4px 10px", color: updatedIdsSection.length > 0 && updatedIdsSection.map((d) => d._id).includes(params.row.id) ? "#000000c7 !important" : "white" }}
              loadingPosition="end"
              variant="contained"
            >
              {updatedIdsSection.map((d) => d._id).includes(params.row.id) ? "Section Updated" : "Section"}
            </LoadingButton>
          )}

          {isUserRoleCompare?.includes("voriginalmismatch") && (
            <Button
              size="small"
              sx={{
                textTransform: "capitalize",
                backgroundColor: "#007F73", // Change background color to aqua
                color: "#fff", // Change text color to contrast with the background
                "&:hover": {
                  // Note the use of "&:hover" instead of "&.hover"
                  backgroundColor: "#055f56",
                },
              }}
              onClick={() => {
                // handleClickOpenview();
                setTableCount(5);
                getviewCodeFour(params.row);
              }}
            // variant="contained"
            >
              View
            </Button>
          )}
        </Grid>
      ),
    },
  ];

  const rowDataTableFour = filteredDataFour.map((item, index) => {
    return {
      id: item._id,
      ids: item.ids,
      serialNumber: item.serialNumber,
      date: item.date,
      category: item.category,
      category1: item.category1,
      subcategory: item.subcategory,
      mismatchmode: item.mismatchmode,
      vendor: item.vendor,
      vendor1: item.vendor1,
      project: item.project,
      count: item.count,
    };
  });

  //datatable....
  const handleSearchChangeFour = (event) => {
    setSearchQueryFour(event.target.value);
  };

  const [isBulkUpdateFour, setIsBulkUpdateFour] = useState(false);
  const [selectedFourIds, setSelectedFourIds] = useState([]);

  const handleBulkUpdateFour = () => {
    setIsBulkUpdateFour(true);
    if (isProdDayCount === 0) {
      if (selectedRowsFour.length > 0) {
        if (mismatchmodeFour === "Unit + Flag") {
          let filteredselectedFourIds = selectedFourIds.filter((item) => item.mismatchmode.includes("Unit + Flag"));

          if (filteredselectedFourIds.filter((item) => item.mismatchmode.includes("Unit + Flag")).length > 0) {
            if (filteredselectedFourIds.some((item) => item.mrate != undefined && item.mrate != 0 && item.unitflag != undefined && item.unitflag != 0)) {
              async function updateDataInBulk(items) {
                const updatePayload = items.map((item) => ({
                  _id: item._id,
                  mode: item.mode,
                  updatedflag: Number(item.unitflag),
                  updatedunitrate: Number(item.mrate),
                }));

                try {
                  await axios.post(
                    SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_UNITANDFLAG,
                    {
                      updates: updatePayload,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                      },
                    }
                  );
                  setupdatedIds((prev) => [...prev, ...items]);
                  // console.log( updatedIds,  "selectedTwoIds" );
                } catch (err) {
                  handleApiError(err, setShowAlert, handleClickOpenerr);
                  setSelectAllCheckedFour(false);
                  setSelectedRows([]);
                  setSelectedRowsFour([]);
                  setSelectedFourIds([]);
                  setIsBulkUpdateFour(false);
                }
              }

              // Call the function to update data in bulk
              const validItems = filteredselectedFourIds.filter((item) => item.mrate !== undefined && item.unitflag !== undefined);

              if (validItems.length > 0) {
                updateDataInBulk(validItems)
                  .then(() => {

                    setPopupContentMalert(validItems.length === filteredselectedFourIds.length ? "Alloted" : "Present unitrate value only updated");
                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();

                    setSelectAllCheckedFour(false);
                    setSelectedRows([]);
                    setSelectedRowsFour([]);
                    setSelectedFourIds([]);
                    setIsBulkUpdateFour(false);
                  })
                  .catch((err) => {
                    handleApiError(err, setShowAlert, handleClickOpenerr);
                    setSelectAllCheckedFour(false);
                    setSelectedRows([]);
                    setSelectedRowsFour([]);
                    setSelectedFourIds([]);
                    setIsBulkUpdateFour(false);
                  });
              } else {
                setSelectAllCheckedFour(false);
                setSelectedRows([]);
                setSelectedRowsFour([]);
                setSelectedFourIds([]);
                setIsBulkUpdateFour(false);
                setPopupContentMalert("Please Update Unitrate");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
              }
            } else {
              setSelectAllCheckedFour(false);
              setSelectedRows([]);
              setSelectedRowsFour([]);
              setSelectedFourIds([]);
              setIsBulkUpdateFour(false);
              setPopupContentMalert("Please Update Unitrate");
              setPopupSeverityMalert("info");
              handleClickOpenPopupMalert();
            }
          } else {
            setSelectAllCheckedFour(false);
            setSelectedRows([]);
            setSelectedRowsFour([]);
            setSelectedFourIds([]);
            setIsBulkUpdateFour(false);
            setPopupContentMalert("No Data to Update");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
          }
        } else if (mismatchmodeFour === "Unit") {
          let filteredselectedFourIds = selectedFourIds.filter((item) => item.mismatchmode.includes("Unit"));

          if (filteredselectedFourIds.filter((item) => item.mismatchmode.includes("Unit")).length > 0) {
            if (filteredselectedFourIds.some((item) => item.mrate != undefined && item.mrate != 0)) {
              async function updateDataInBulk(items) {
                const updatePayload = items.map((item) => ({
                  _id: item._id,
                  mode: item.mode,

                  updatedunitrate: Number(item.mrate),
                }));

                try {
                  await axios.post(
                    SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_UNITONLY,
                    {
                      updates: updatePayload,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                      },
                    }
                  );
                  setupdatedIdsUnit((prev) => [...prev, ...items]);
                  // console.log( updatedIds,  "selectedTwoIds" );
                } catch (err) {
                  handleApiError(err, setShowAlert, handleClickOpenerr);
                  setSelectAllCheckedFour(false);
                  setSelectedRows([]);
                  setSelectedRowsFour([]);
                  setSelectedFourIds([]);
                  setIsBulkUpdateFour(false);
                }
              }

              // Call the function to update data in bulk
              const validItems = filteredselectedFourIds.filter((item) => item.mrate !== undefined);

              if (validItems.length > 0) {
                updateDataInBulk(validItems)
                  .then(() => {

                    setPopupContentMalert(validItems.length === filteredselectedFourIds.length ? "Alloted" : "Present unitrate value only updated");
                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();
                    setSelectAllCheckedFour(false);
                    setSelectedRows([]);
                    setSelectedRowsFour([]);
                    setSelectedFourIds([]);
                    setIsBulkUpdateFour(false);
                  })
                  .catch((err) => {
                    handleApiError(err, setShowAlert, handleClickOpenerr);
                    setSelectAllCheckedFour(false);
                    setSelectedRows([]);
                    setSelectedRowsFour([]);
                    setSelectedFourIds([]);
                    setIsBulkUpdateFour(false);
                  });
              }
            } else {
              setSelectAllCheckedFour(false);
              setSelectedRows([]);
              setSelectedRowsFour([]);
              setSelectedFourIds([]);
              setIsBulkUpdateFour(false);
              setPopupContentMalert("Please Update Unitrate");
              setPopupSeverityMalert("info");
              handleClickOpenPopupMalert();
            }
          } else {
            setSelectAllCheckedFour(false);
            setSelectedRows([]);
            setSelectedRowsFour([]);
            setSelectedFourIds([]);
            setIsBulkUpdateFour(false);
            setPopupContentMalert("No Data to Update");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
          }
        } else if (mismatchmodeFour === "Flag") {
          let filteredselectedFourIds = selectedFourIds.filter((item) => item.mismatchmode.includes("Flag"));
          if (filteredselectedFourIds.filter((item) => item.mismatchmode.includes("Flag")).length > 0) {
            if (filteredselectedFourIds.some((item) => item.unitflag != undefined && item.unitflag != 0)) {
              async function updateDataInBulk(items) {
                const updatePayload = items.map((item) => ({
                  _id: item._id,
                  mode: item.mode,
                  updatedflag: Number(item.unitflag),
                }));

                try {
                  await axios.post(
                    SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_FLAGONLY,
                    {
                      updates: updatePayload,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                      },
                    }
                  );
                  setupdatedIdsFlag((prev) => [...prev, ...items]);
                  // console.log( updatedIds,  "selectedTwoIds" );
                } catch (err) {
                  handleApiError(err, setShowAlert, handleClickOpenerr);
                  setSelectAllCheckedFour(false);
                  setSelectedRows([]);
                  setSelectedRowsFour([]);
                  setSelectedFourIds([]);
                  setIsBulkUpdateFour(false);
                }
              }

              // Call the function to update data in bulk
              const validItems = filteredselectedFourIds.filter((item) => item.unitflag !== undefined);

              if (validItems.length > 0) {
                updateDataInBulk(validItems)
                  .then(() => {

                    setPopupContentMalert(validItems.length === filteredselectedFourIds.length ? "Alloted" : "Present unitrate value only updated");
                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();
                    setSelectAllCheckedFour(false);
                    setSelectedRows([]);
                    setSelectedRowsFour([]);
                    setSelectedFourIds([]);
                    setIsBulkUpdateFour(false);
                  })
                  .catch((err) => {
                    handleApiError(err, setShowAlert, handleClickOpenerr);
                    setSelectAllCheckedFour(false);
                    setSelectedRows([]);
                    setSelectedRowsFour([]);
                    setSelectedFourIds([]);
                    setIsBulkUpdateFour(false);
                  });
              }
            } else {
              setSelectAllCheckedFour(false);
              setSelectedRows([]);
              setSelectedRowsFour([]);
              setSelectedFourIds([]);
              setIsBulkUpdateFour(false);
              setPopupContentMalert("Please Update Unitrate");
              setPopupSeverityMalert("info");
              handleClickOpenPopupMalert();
            }
          } else {
            setSelectAllCheckedFour(false);
            setSelectedRows([]);
            setSelectedRowsFour([]);
            setSelectedFourIds([]);
            setIsBulkUpdateFour(false);
            setPopupContentMalert("No Data to Update");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
          }
        } else if (mismatchmodeFour === "Unit + Section") {
          let filteredselectedFourIds = selectedFourIds.filter((item) => item.mismatchmode.includes("Unit + Section"));
          if (filteredselectedFourIds.filter((item) => item.mismatchmode.includes("Unit + Section")).length > 0) {
            if (filteredselectedFourIds.filter((item) => item.mrate != undefined && item.mrate != 0 && item.unitflag != undefined && item.unitflag != 0 && item.section !== undefined).length > 0) {
              async function updateDataInBulk(items) {
                const updatePayload = items.map((item) => ({
                  _id: item._id,
                  mode: item.mode,

                  updatedunitrate: Number(item.mrate),
                  updatedsection: Number(item.mrate) * Number(item.unitflag) * Number(item.section),
                }));

                try {
                  await axios.post(
                    SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_UNITANDSECTION,
                    {
                      updates: updatePayload,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                      },
                    }
                  );
                  setupdatedIdsFlag((prev) => [...prev, ...items]);
                } catch (err) {
                  handleApiError(err, setShowAlert, handleClickOpenerr);
                  setSelectAllCheckedFour(false);
                  setSelectedRows([]);
                  setSelectedRowsFour([]);
                  setSelectedFourIds([]);
                  setIsBulkUpdateFour(false);
                }
              }

              // Call the function to update data in bulk
              const validItems = filteredselectedFourIds.filter((item) => item.mrate !== undefined && item.flagcount !== undefined && item.section !== undefined);

              if (validItems.length > 0) {
                updateDataInBulk(validItems)
                  .then(() => {

                    setPopupContentMalert(validItems.length === filteredselectedFourIds.length ? "Alloted" : "Present unitrate value only updated");
                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();

                    setSelectAllCheckedFour(false);
                    setSelectedRows([]);
                    setSelectedRowsFour([]);
                    setSelectedFourIds([]);
                    setIsBulkUpdateFour(false);
                  })
                  .catch((err) => {
                    handleApiError(err, setShowAlert, handleClickOpenerr);
                    setSelectAllCheckedFour(false);
                    setSelectedRows([]);
                    setSelectedRowsFour([]);
                    setSelectedFourIds([]);
                    setIsBulkUpdateFour(false);
                  });
              } else {
                setPopupContentMalert("Section not Present");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();

                setSelectAllCheckedFour(false);
                setSelectedRows([]);
                setSelectedRowsFour([]);
                setSelectedFourIds([]);
                setIsBulkUpdateFour(false);
              }
              // setIsSectionone(false);
            } else {
              setSelectAllCheckedFour(false);
              setSelectedRows([]);
              setSelectedRowsFour([]);
              setSelectedFourIds([]);
              setIsBulkUpdateFour(false);
              setPopupContentMalert("Section not Present");
              setPopupSeverityMalert("info");
              handleClickOpenPopupMalert();
            }
          } else {
            setSelectAllCheckedFour(false);
            setSelectedRows([]);
            setSelectedRowsFour([]);
            setSelectedFourIds([]);
            setIsBulkUpdateFour(false);
            setPopupContentMalert("No Data to Update");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
          }
        } else {
          setIsBulkUpdateFour(false);

          setPopupContentMalert("Please Select Mode");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
        }
      } else {
        setIsBulkUpdateFour(false);

        setPopupContentMalert("Please Select Row");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    }
    else {
      setIsBulkUpdateFour(false);
      setPopupContentMalert("!Already Production Day Created");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }

  };

  const gridRefFour = useRef(null);

  // Show All Columns functionality
  const handleShowAllColumnsFour = () => {
    const updatedVisibility = { ...columnVisibilityFour };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibilityFour(updatedVisibility);
  };

  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem("columnVisibilityfour");
    if (savedVisibility) {
      setColumnVisibilityFour(JSON.parse(savedVisibility));
    }
  }, []);

  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem("columnVisibilityfour", JSON.stringify(columnVisibilityFour));
  }, [columnVisibilityFour]);

  // // Function to filter columns based on search query
  const filteredColumnsFour = columnDataTableFour.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));

  // Manage Columns functionality
  const toggleColumnVisibilityFour = (field) => {
    setColumnVisibilityFour((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  // JSX for the "Manage Columns" popover content
  const manageColumnsContentFour = (
    <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
      <Typography variant="h6">Manage Columns</Typography>
      <IconButton
        aria-label="close"
        onClick={handleCloseManageColumnsFour}
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
        <TextField label="Find column" variant="standard" fullWidth value={searchQueryManageFour} onChange={(e) => setSearchQueryManageFour(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
      </Box>
      <br />
      <br />
      <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumnsFour.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibilityFour[column.field]} onChange={() => toggleColumnVisibilityFour(column.field)} />}
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
            <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibilityFour(initialColumnVisibilityFour)}>
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
                columnDataTableFour.forEach((column) => {
                  newColumnVisibility[column.field] = false; // Set hide property to true
                });
                setColumnVisibilityFour(newColumnVisibility);
              }}
            >
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

  //------------------------------------------------------------------------------------------------------

  //-------------------------------------------Table Five-----------------------------------------------------------

  const [itemsFive, setItemsFive] = useState([]);
  const [pageFive, setPageFive] = useState(1);
  const [searchQueryManageFive, setSearchQueryManageFive] = useState("");
  const [searchQueryFive, setSearchQueryFive] = useState("");

  // Manage Columns

  const addSerialNumberFive = () => {
    const itemsWithSerialNumber = tableFiveDatas?.map((item, index) => ({ ...item, serialNumber: index + 1, id: index }));
    setItemsFive(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumberFive();
  }, [tableFiveDatas]);

  const initialColumnVisibilityFive = {
    serialNumber: true,
    checkbox: true,
    date: true,
    category: true,
    category1: true,
    vendor: true,
    vendor1: true,
    project: true,
    unitid: true,
    flag: true,
    section: true,
    subcategory: true,
    count: true,
    actions: true,
  };

  const [columnVisibilityFive, setColumnVisibilityFive] = useState(initialColumnVisibilityFive);

  // Manage Columns
  const [isManageColumnsOpenFive, setManageColumnsOpenFive] = useState(false);
  const [anchorElFive, setAnchorElFive] = useState(null);

  const handleOpenManageColumnsFive = (event) => {
    setAnchorElFive(event.currentTarget);
    setManageColumnsOpenFive(true);
  };

  const openFive = Boolean(anchorElFour);
  const idFive = openFive ? "simple-popover" : undefined;

  const handleCloseManageColumnsFive = () => {
    setManageColumnsOpenFive(false);
    setSearchQueryManageFive("");
  };

  const [pageSizeFive, setPageSizeFive] = useState(10);
  //Datatable
  const handlePageChangeFive = (newPage) => {
    setPageFive(newPage);
  };
  const handlePageSizeChangeFive = (event) => {
    setPageSizeFive(Number(event.target.value));
    setSelectedRows([]);
    setSelectAllChecked(false);
    setPage(1);
  };

  // Split the search query into individual terms
  const searchTermsFive = searchQueryFive.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDataFives = itemsFive?.filter((item) => {
    return searchTermsFive.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  const filteredDataFive = filteredDataFives.slice((pageFive - 1) * pageSizeFive, pageFive * pageSizeFive);

  const totalPagesFive = Math.ceil(filteredDataFives.length / pageSizeFive);

  const visiblePagesFive = Math.min(totalPagesFive, 3);

  const firstVisiblePageFive = Math.max(1, pageFive - 1);
  const lastVisiblePageFive = Math.min(firstVisiblePageFive + visiblePagesFive - 1, totalPagesFive);

  const pageNumbersFive = [];

  const indexOfLastItemFive = pageFive * pageSizeFive;
  const indexOfFirstItemFive = indexOfLastItemFive - pageSizeFive;

  for (let i = firstVisiblePageFive; i <= lastVisiblePageFive; i++) {
    pageNumbersFive.push(i);
  }

  const columnDataTableFive = [
    {
      field: "checkbox",
      headerName: "Checkbox", // Default header name
      headerStyle: {
        fontWeight: "bold", // Apply the font-weight style to make the header text bold
        // Add any other CSS styles as needed
      },
      renderHeader: (params) => (
        <CheckboxHeader
          selectAllChecked={selectAllCheckedFive}
          onSelectAll={() => {
            if (rowDataTableFive.length === 0) {
              // Do not allow checking when there are no rows
              return;
            }
            if (selectAllCheckedFive) {
              setSelectedRowsFive([]);
            } else {
              const allRowIds = rowDataTableFive.map((row) => row.id);
              setSelectedRowsFive(allRowIds);
              const allRowUpdaetIds = rowDataTableFive.map((row) => row.ids).flat();
              setSelectedFiveIds(allRowUpdaetIds);
            }
            setSelectAllCheckedFive(!selectAllCheckedFive);
          }}
        />
      ),

      renderCell: (params) => (
        <Checkbox
          checked={selectedRowsFive.includes(params.row.id)}
          onChange={() => {
            let updatedSelectedRowsFive;
            let updatedSelectedRowsFiveIds;
            let datas = params.row.ids.flat();
            // console.log(params.row.ids.flat())
            if (selectedRowsFive.includes(params.row.id)) {
              updatedSelectedRowsFive = selectedRowsFive.filter((selectedId) => selectedId !== params.row.id);
              updatedSelectedRowsFiveIds = selectedFiveIds.filter((selectedId) => !datas.map((d) => d.category).includes(selectedId.category));
            } else {
              updatedSelectedRowsFive = [...selectedRowsFive, params.row.id];
              updatedSelectedRowsFiveIds = [...selectedFiveIds, ...datas];
            }

            setSelectedRowsFive(updatedSelectedRowsFive);
            setSelectedFiveIds(updatedSelectedRowsFiveIds);
            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllCheckedFive(updatedSelectedRowsFive.length === filteredDataFive.length);
          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 90,

      hide: !columnVisibilityFive.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 100,
      hide: !columnVisibilityFive.serialNumber,
      headerClassName: "bold-header",
    },

    { field: "date", headerName: "Date", flex: 0, width: 100, hide: !columnVisibilityFive.date, headerClassName: "bold-header" },
    { field: "category1", headerName: "Category", flex: 0, width: 270, hide: !columnVisibilityFive.category1, headerClassName: "bold-header" },
    { field: "subcategory", headerName: "Sub Category", flex: 0, width: 320, hide: !columnVisibilityFive.subcategory, headerClassName: "bold-header" },
    { field: "project", headerName: "Project", flex: 0, width: 170, hide: !columnVisibilityFive.project, headerClassName: "bold-header" },
    { field: "vendor1", headerName: "Vendor", flex: 0, width: 100, hide: !columnVisibilityFive.vendor1, headerClassName: "bold-header" },
    { field: "unitid", headerName: "Identifier Name", flex: 0, width: 200, hide: !columnVisibilityFive.unitid, headerClassName: "bold-header" },
    { field: "flag", headerName: "Flag", flex: 0, width: 100, hide: !columnVisibilityFive.flag, headerClassName: "bold-header" },
    { field: "section", headerName: "Section", flex: 0, width: 100, hide: !columnVisibilityFive.section, headerClassName: "bold-header" },
    { field: "count", headerName: "Count", flex: 0, width: 100, hide: !columnVisibilityFive.count, headerClassName: "bold-header" },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 550,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibilityFive.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex", gap: "10px" }}>
          {params.row.mismatchmode?.includes("Unit + Flag") && (
            <LoadingButton
              onClick={(e) => {
                handleClickUpdateAllotFive(e, params.row.ids[0], params.row.ids);
              }}
              loading={isunitflagfive === params.row.id}
              color="primary"
              size="small"
              disabled={updatedIds.length > 0 && updatedIds.map((d) => d._id).includes(params.row.id)}
              sx={{ textTransform: "capitalize", border: updatedIds.length > 0 && updatedIds.map((d) => d._id).includes(params.row.id) ? "2px solid #1976d2" : "", fontSize: updatedIds.length > 0 && updatedIds.map((d) => d._id).includes(params.row.id) ? "smaller" : "0.8125rem", padding: updatedIds.length > 0 && updatedIds.map((d) => d._id).includes(params.row.id) ? "2px" : "4px 10px", color: updatedIds.length > 0 && updatedIds.map((d) => d._id).includes(params.row.id) ? "#000000c7 !important" : "white" }}
              loadingPosition="end"
              variant="contained"
            >
              {updatedIds.map((d) => d._id).includes(params.row.id) ? "Updated Unit+Flag" : "Unit + Flag"}
            </LoadingButton>
          )}

          {params.row.mismatchmode?.includes("Unit") && (
            <LoadingButton
              onClick={(e) => {
                handleClickUnitUpdateFive(e, params.row.ids[0], params.row.ids);
              }}
              loading={isUnitfive === params.row.id}
              color="primary"
              size="small"
              disabled={updatedIdsUnit.length > 0 && updatedIdsUnit.map((d) => d._id).includes(params.row.id)}
              sx={{ textTransform: "capitalize", border: updatedIdsUnit.length > 0 && updatedIdsUnit.map((d) => d._id).includes(params.row.id) ? "2px solid #1976d2" : "", fontSize: updatedIdsUnit.length > 0 && updatedIdsUnit.map((d) => d._id).includes(params.row.id) ? "smaller" : "0.8125rem", padding: updatedIdsUnit.length > 0 && updatedIdsUnit.map((d) => d._id).includes(params.row.id) ? "2px" : "4px 10px", color: updatedIdsUnit.length > 0 && updatedIdsUnit.map((d) => d._id).includes(params.row.id) ? "#000000c7 !important" : "white" }}
              loadingPosition="end"
              variant="contained"
            >
              {updatedIdsUnit.map((d) => d._id).includes(params.row.id) ? "Unit Updated" : "Unit"}
            </LoadingButton>
          )}

          {params.row.mismatchmode?.includes("Flag") && (
            <LoadingButton
              onClick={(e) => {
                handleClickFlagUpdateFive(e, params.row.ids[0], params.row.ids);
              }}
              loading={isFlagfive === params.row.id}
              color="primary"
              size="small"
              disabled={updatedIdsFlag.length > 0 && updatedIdsFlag.map((d) => d._id).includes(params.row.id)}
              sx={{ textTransform: "capitalize", border: updatedIdsFlag.length > 0 && updatedIdsFlag.map((d) => d._id).includes(params.row.id) ? "2px solid #1976d2" : "", fontSize: updatedIdsFlag.length > 0 && updatedIdsFlag.map((d) => d._id).includes(params.row.id) ? "smaller" : "0.8125rem", padding: updatedIdsFlag.length > 0 && updatedIdsFlag.map((d) => d._id).includes(params.row.id) ? "2px" : "4px 10px", color: updatedIdsFlag.length > 0 && updatedIdsFlag.map((d) => d._id).includes(params.row.id) ? "#000000c7 !important" : "white" }}
              loadingPosition="end"
              variant="contained"
            >
              {updatedIdsFlag.map((d) => d._id).includes(params.row.id) ? "Flag Updated" : "Flag"}
            </LoadingButton>
          )}

          {params.row.mismatchmode?.includes("Unit + Section") && (
            <LoadingButton
              onClick={(e) => {
                handleClickSectionUpdateFive(e, params.row.ids[0], params.row.ids);
              }}
              loading={isSectionfive === params.row.id}
              color="primary"
              size="small"
              disabled={updatedIdsSection.length > 0 && updatedIdsSection.map((d) => d._id).includes(params.row.id)}
              sx={{ textTransform: "capitalize", border: updatedIdsSection.length > 0 && updatedIdsSection.map((d) => d._id).includes(params.row.id) ? "2px solid #1976d2" : "", fontSize: updatedIdsSection.length > 0 && updatedIdsSection.map((d) => d._id).includes(params.row.id) ? "smaller" : "0.8125rem", padding: updatedIdsSection.length > 0 && updatedIdsSection.map((d) => d._id).includes(params.row.id) ? "2px" : "4px 10px", color: updatedIdsSection.length > 0 && updatedIdsSection.map((d) => d._id).includes(params.row.id) ? "#000000c7 !important" : "white" }}
              loadingPosition="end"
              variant="contained"
            >
              {updatedIdsSection.map((d) => d._id).includes(params.row.id) ? "Section Updated" : "Section"}
            </LoadingButton>
          )}

          {/* {isUserRoleCompare?.includes("voriginalmismatch") && (
            <Button
              size="small"
              sx={{
                textTransform: "capitalize",
                backgroundColor: "#007F73", // Change background color to aqua
                color: "#fff", // Change text color to contrast with the background
                "&:hover": {
                  // Note the use of "&:hover" instead of "&.hover"
                  backgroundColor: "#055f56",
                },
              }}
              onClick={() => {
                // handleClickOpenview();
                setTableCount(5);
                getviewCodeFour(params.row);
              }}
              // variant="contained"
            >
              View
            </Button>
          )} */}
        </Grid>
      ),
    },
  ];

  const rowDataTableFive = filteredDataFive.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      date: item.date,
      ids: item.ids,
      category: item.category,
      category1: item.category1,
      vendor: item.vendor,
      vendor1: item.vendor1,
      project: item.project,
      subcategory: item.subcategory,
      mismatchmode: item.mismatchmode,
      unitid: item.unitid,
      user: item.user,
      flag: item.flagcount,
      section: item.section,
      count: item.count,
    };
  });

  //datatable....
  const handleSearchChangeFive = (event) => {
    setSearchQueryFive(event.target.value);
  };

  const [isBulkUpdateFive, setIsBulkUpdateFive] = useState(false);
  const [selectedFiveIds, setSelectedFiveIds] = useState([]);

  const handleBulkUpdateFive = () => {
    setIsBulkUpdateFive(true);
    if (isProdDayCount === 0) {
      if (selectedRowsFive.length > 0) {
        if (mismatchmodeFive === "Unit + Flag") {
          let filteredselectedFiveIds = selectedFiveIds.filter((item) => item.mismatchmode.includes("Unit + Flag"));

          if (filteredselectedFiveIds.filter((item) => item.mismatchmode.includes("Unit + Flag")).length > 0) {
            if (filteredselectedFiveIds.some((item) => item.mrate != undefined && item.mrate != 0 && item.unitflag != undefined && item.unitflag != 0)) {
              async function updateDataInBulk(items) {
                const updatePayload = items.map((item) => ({
                  _id: item._id,
                  mode: item.mode,
                  updatedflag: Number(item.unitflag),
                  updatedunitrate: Number(item.mrate),
                }));

                try {
                  await axios.post(
                    SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_UNITANDFLAG,
                    {
                      updates: updatePayload,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                      },
                    }
                  );
                  setupdatedIds((prev) => [...prev, ...items]);
                  // console.log( updatedIds,  "selectedTwoIds" );
                } catch (err) {
                  handleApiError(err, setShowAlert, handleClickOpenerr);
                  setSelectAllCheckedFive(false);
                  setSelectedRowsFive([]);
                  setSelectedFiveIds([]);
                  setIsBulkUpdateFive(false);
                }
              }

              // Call the function to update data in bulk
              const validItems = filteredselectedFiveIds.filter((item) => item.mrate !== undefined && item.unitflag !== undefined);

              if (validItems.length > 0) {
                updateDataInBulk(validItems)
                  .then(() => {
                    setPopupContentMalert(validItems.length === filteredselectedFiveIds.length ? "Alloted" : "Present unitrate value only updated");
                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();
                    setSelectAllCheckedFive(false);
                    setSelectedRowsFive([]);
                    setSelectedFiveIds([]);
                    setIsBulkUpdateFive(false);
                  })
                  .catch((err) => {
                    handleApiError(err, setShowAlert, handleClickOpenerr);
                    setSelectAllCheckedFive(false);
                    setSelectedRowsFive([]);
                    setSelectedFiveIds([]);
                    setIsBulkUpdateFive(false);
                  });
              } else {
                setSelectAllCheckedFive(false);
                setSelectedRowsFive([]);
                setSelectedFiveIds([]);
                setIsBulkUpdateFive(false);
                setPopupContentMalert("Please Update Unitrate");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
              }
            } else {
              setSelectAllCheckedFive(false);
              setSelectedRowsFive([]);
              setSelectedFiveIds([]);
              setIsBulkUpdateFive(false);
              setPopupContentMalert("Please Update Unitrate");
              setPopupSeverityMalert("info");
              handleClickOpenPopupMalert();
            }
          } else {
            setSelectAllCheckedFive(false);
            setSelectedRowsFive([]);
            setSelectedFiveIds([]);
            setIsBulkUpdateFive(false);
            setPopupContentMalert("No Data to Update");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
          }
        } else if (mismatchmodeFive === "Unit") {
          let filteredselectedFiveIds = selectedFiveIds.filter((item) => item.mismatchmode.includes("Unit"));

          if (filteredselectedFiveIds.filter((item) => item.mismatchmode.includes("Unit")).length > 0) {
            if (filteredselectedFiveIds.some((item) => item.mrate != undefined && item.mrate != 0)) {
              async function updateDataInBulk(items) {
                const updatePayload = items.map((item) => ({
                  _id: item._id,
                  mode: item.mode,

                  updatedunitrate: Number(item.mrate),
                }));

                try {
                  await axios.post(
                    SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_UNITONLY,
                    {
                      updates: updatePayload,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                      },
                    }
                  );
                  setupdatedIdsUnit((prev) => [...prev, ...items]);
                  // console.log( updatedIds,  "selectedTwoIds" );
                } catch (err) {
                  handleApiError(err, setShowAlert, handleClickOpenerr);
                  setSelectAllCheckedFive(false);
                  setSelectedRowsFive([]);
                  setSelectedFiveIds([]);
                  setIsBulkUpdateFive(false);
                }
              }

              // Call the function to update data in bulk
              const validItems = filteredselectedFiveIds.filter((item) => item.mrate !== undefined);

              if (validItems.length > 0) {
                updateDataInBulk(validItems)
                  .then(() => {

                    setPopupContentMalert(validItems.length === filteredselectedFiveIds.length ? "Alloted" : "Present unitrate value only updated");
                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();
                    setSelectAllCheckedFive(false);
                    setSelectedRowsFive([]);
                    setSelectedFiveIds([]);
                    setIsBulkUpdateFive(false);
                  })
                  .catch((err) => {
                    handleApiError(err, setShowAlert, handleClickOpenerr);
                    setSelectAllCheckedFive(false);
                    setSelectedRowsFive([]);
                    setSelectedFiveIds([]);
                    setIsBulkUpdateFive(false);
                  });
              }
            } else {
              setSelectAllCheckedFive(false);
              setSelectedRowsFive([]);
              setSelectedFiveIds([]);
              setIsBulkUpdateFive(false);
              setPopupContentMalert("Please Update Unitrate");
              setPopupSeverityMalert("info");
              handleClickOpenPopupMalert();
            }
          } else {
            setSelectAllCheckedFive(false);
            setSelectedRowsFive([]);
            setSelectedFiveIds([]);
            setIsBulkUpdateFive(false);
            setPopupContentMalert("No Data to Update");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
          }
        } else if (mismatchmodeFive === "Flag") {
          let filteredselectedFiveIds = selectedFiveIds.filter((item) => item.mismatchmode.includes("Flag"));
          if (filteredselectedFiveIds.filter((item) => item.mismatchmode.includes("Flag")).length > 0) {
            if (filteredselectedFiveIds.some((item) => item.unitflag != undefined && item.unitflag != 0)) {
              async function updateDataInBulk(items) {
                const updatePayload = items.map((item) => ({
                  _id: item._id,
                  mode: item.mode,
                  updatedflag: Number(item.unitflag),
                }));

                try {
                  await axios.post(
                    SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_FLAGONLY,
                    {
                      updates: updatePayload,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                      },
                    }
                  );
                  setupdatedIdsFlag((prev) => [...prev, ...items]);
                  // console.log( updatedIds,  "selectedTwoIds" );
                } catch (err) {
                  handleApiError(err, setShowAlert, handleClickOpenerr);
                  setSelectAllCheckedFive(false);
                  setSelectedRowsFive([]);
                  setSelectedFiveIds([]);
                  setIsBulkUpdateFive(false);
                }
              }

              // Call the function to update data in bulk
              const validItems = filteredselectedFiveIds.filter((item) => item.unitflag !== undefined);

              if (validItems.length > 0) {
                updateDataInBulk(validItems)
                  .then(() => {

                    setPopupContentMalert(validItems.length === filteredselectedFiveIds.length ? "Alloted" : "Present unitrate value only updated");
                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();
                    setSelectAllCheckedFive(false);
                    setSelectedRowsFive([]);
                    setSelectedFiveIds([]);
                    setIsBulkUpdateFive(false);
                  })
                  .catch((err) => {
                    handleApiError(err, setShowAlert, handleClickOpenerr);
                    setSelectAllCheckedFive(false);
                    setSelectedRowsFive([]);
                    setSelectedFiveIds([]);
                    setIsBulkUpdateFive(false);
                  });
              }
            } else {
              setSelectAllCheckedFive(false);
              setSelectedRowsFive([]);
              setSelectedFiveIds([]);
              setIsBulkUpdateFive(false);
              setPopupContentMalert("Please Update Unitrate");
              setPopupSeverityMalert("info");
              handleClickOpenPopupMalert();
            }
          } else {
            setSelectAllCheckedFive(false);
            setSelectedRowsFive([]);
            setSelectedFiveIds([]);
            setIsBulkUpdateFive(false);
            setPopupContentMalert("No Data to Update");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
          }
        } else if (mismatchmodeFive === "Unit + Section") {
          let filteredselectedFiveIds = selectedFiveIds.filter((item) => item.mismatchmode.includes("Unit + Section"));
          if (filteredselectedFiveIds.filter((item) => item.mismatchmode.includes("Unit + Section")).length > 0) {
            if (filteredselectedFiveIds.filter((item) => item.mrate != undefined && item.mrate != 0 && item.unitflag != undefined && item.unitflag != 0 && item.section !== undefined).length > 0) {
              async function updateDataInBulk(items) {
                const updatePayload = items.map((item) => ({
                  _id: item._id,
                  mode: item.mode,

                  updatedunitrate: Number(item.mrate),
                  updatedsection: Number(item.mrate) * Number(item.unitflag) * Number(item.section),
                }));

                try {
                  await axios.post(
                    SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_UNITANDSECTION,
                    {
                      updates: updatePayload,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                      },
                    }
                  );
                  setupdatedIdsFlag((prev) => [...prev, ...items]);
                  // console.log( updatedIds,  "selectedTwoIds" );
                } catch (err) {
                  handleApiError(err, setShowAlert, handleClickOpenerr);
                  setSelectAllCheckedTwo(false);
                  setSelectedRowsTwo([]);
                  setSelectedTwoIds([]);
                  setIsBulkUpdateTwo(false);
                }
              }

              // Call the function to update data in bulk
              const validItems = filteredselectedFiveIds.filter((item) => item.mrate !== undefined && item.unitflag !== undefined && item.section !== undefined);

              if (validItems.length > 0) {
                updateDataInBulk(validItems)
                  .then(() => {

                    setPopupContentMalert(validItems.length === filteredselectedFiveIds.length ? "Alloted" : "Present unitrate value only updated");
                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();

                    setSelectAllCheckedTwo(false);
                    setSelectedRowsTwo([]);
                    setSelectedTwoIds([]);
                    setIsBulkUpdateTwo(false);
                  })
                  .catch((err) => {
                    handleApiError(err, setShowAlert, handleClickOpenerr);
                    setSelectAllCheckedTwo(false);
                    setSelectedRowsTwo([]);
                    setSelectedTwoIds([]);
                    setIsBulkUpdateTwo(false);
                  });
              } else {

                setPopupContentMalert("Section not Present");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();

                setSelectAllCheckedFive(false);
                setSelectedRowsFive([]);
                setSelectedFiveIds([]);
                setIsBulkUpdateFive(false);
              }
              // setIsSectionone(false);
            } else {
              setSelectAllCheckedFive(false);
              setSelectedRowsFive([]);
              setSelectedFiveIds([]);
              setIsBulkUpdateFive(false);
              setPopupContentMalert("Section not Present");
              setPopupSeverityMalert("info");
              handleClickOpenPopupMalert();
            }
          } else {
            setSelectAllCheckedFive(false);
            setSelectedRowsFive([]);
            setSelectedFiveIds([]);
            setIsBulkUpdateFive(false);
            setPopupContentMalert("No Data to Update");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
          }
        } else {
          setIsBulkUpdateFive(false);
          setPopupContentMalert("Please Select Mode");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();

        }
      } else {
        setIsBulkUpdateFive(false);
        setPopupContentMalert("Please Select Row");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    }
    else {
      setIsBulkUpdateFive(false);

      setPopupContentMalert("!Already Production Day Created");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }

  };

  const gridRefFive = useRef(null);

  // Show All Columns functionality
  const handleShowAllColumnsFive = () => {
    const updatedVisibility = { ...columnVisibilityFive };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibilityFive(updatedVisibility);
  };

  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem("columnVisibilityfive");
    if (savedVisibility) {
      setColumnVisibilityFive(JSON.parse(savedVisibility));
    }
  }, []);

  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem("columnVisibilityfive", JSON.stringify(columnVisibilityFive));
  }, [columnVisibilityFive]);

  // // Function to filter columns based on search query
  const filteredColumnsFive = columnDataTableFive.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));

  // Manage Columns functionality
  const toggleColumnVisibilityFive = (field) => {
    setColumnVisibilityFive((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  // JSX for the "Manage Columns" popover content
  const manageColumnsContentFive = (
    <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
      <Typography variant="h6">Manage Columns</Typography>
      <IconButton
        aria-label="close"
        onClick={handleCloseManageColumnsFive}
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
        <TextField label="Find column" variant="standard" fullWidth value={searchQueryManageFive} onChange={(e) => setSearchQueryManageFive(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
      </Box>
      <br />
      <br />
      <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumnsFive.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibilityFive[column.field]} onChange={() => toggleColumnVisibilityFive(column.field)} />}
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
            <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibilityFive(initialColumnVisibilityFive)}>
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
                columnDataTableFive.forEach((column) => {
                  newColumnVisibility[column.field] = false; // Set hide property to true
                });
                setColumnVisibilityFive(newColumnVisibility);
              }}
            >
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

  //------------------------------------------------------------------------------------------------------
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  ///all filter table
  // --------------------------------------------------------------------------------------------------------------------
  //-------------------------------------------Table Three-----------------------------------------------------------

  const [itemsAllList, setItemsAllList] = useState([]);
  const [pageAllList, setPageAllList] = useState(1);
  const [searchQueryManageAllList, setSearchQueryManageAllList] = useState("");
  const [searchQueryAllList, setSearchQueryAllList] = useState("");

  // Manage Columns

  const addSerialNumberAllList = () => {
    const itemsWithSerialNumber = tableAllListDatas?.map((item, index) => ({ ...item, serialNumber: index + 1, id: index }));
    setItemsAllList(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumberAllList();
  }, [tableAllListDatas]);

  const initialColumnVisibilityAllList = {
    serialNumber: true,
    empcode: true,
    companyname: true,
    user: true,
    dateval: true,
    vendor: true,
    category: true,
    subcategory: true,
    unitid: true,
    unitrate: true,
    flag: true,
    section: true,
    actions: true,
  };

  const [columnVisibilityAllList, setColumnVisibilityAllList] = useState(initialColumnVisibilityAllList);

  // Manage Columns
  const [isManageColumnsOpenAllList, setManageColumnsOpenAllList] = useState(false);
  const [anchorElAllList, setAnchorElAllList] = useState(null);

  const handleOpenManageColumnsAllList = (event) => {
    setAnchorElAllList(event.currentTarget);
    setManageColumnsOpenAllList(true);
  };

  const openAllList = Boolean(anchorElAllList);
  const idAllList = openAllList ? "simple-popover" : undefined;

  const handleCloseManageColumnsAllList = () => {
    setManageColumnsOpenAllList(false);
    setSearchQueryManageAllList("");
  };

  const [pageSizeAllList, setPageSizeAllList] = useState(10);
  //Datatable
  const handlePageChangeAllList = (newPage) => {
    setPageAllList(newPage);
  };
  const handlePageSizeChangeAllList = (event) => {
    setPageSizeAllList(Number(event.target.value));
    setSelectedRows([]);
    setSelectAllChecked(false);
    setPage(1);
  };

  // Split the search query into individual terms
  const searchTermsAllList = searchQueryAllList.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDataAllLists = itemsAllList?.filter((item) => {
    return searchTermsAllList.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  const filteredDataAllList = filteredDataAllLists.slice((pageAllList - 1) * pageSizeAllList, pageAllList * pageSizeAllList);

  const totalPagesAllList = Math.ceil(filteredDataAllLists.length / pageSizeAllList);

  const visiblePagesAllList = Math.min(totalPagesAllList, 3);

  const firstVisiblePageAllList = Math.max(1, pageAllList - 1);
  const lastVisiblePageAllList = Math.min(firstVisiblePageAllList + visiblePagesAllList - 1, totalPagesAllList);

  const pageNumbersAllList = [];

  const indexOfLastItemAllList = pageAllList * pageSizeAllList;
  const indexOfFirstItemAllList = indexOfLastItemAllList - pageSizeAllList;

  for (let i = firstVisiblePageAllList; i <= lastVisiblePageAllList; i++) {
    pageNumbersAllList.push(i);
  }

  const handleClickUpdateFlag = async (id, flagcount, category, subcategory) => {

    let Res = await axios.post(SERVICE.PRODUCTION_UNITRATE_FILTER_LIMITED, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      category: category,
      subcategory: subcategory,
    });

    if (Res.data.unitsrate.length > 0) {
      let unitratevalue = Res.data.unitsrate[0].flagcount;

      let subprojectscreate = await axios.put(`${SERVICE.PRODUCTION_UPLOAD_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        flagcount: String(flagcount),
        updatedflag: String(unitratevalue),
        // updatedby: [
        //   ...updatedBy,
        //   {
        //     name: String(username),
        //     companyname: String(companyname),
        //     date: String(new Date()),
        //   },
        // ],
      });
    } else {
      setPopupContentMalert("Please Update Unitrate");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
  };

  const columnDataTableAllList = [
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 80,
      hide: !columnVisibilityAllList.serialNumber,
      headerClassName: "bold-header",
    },

    { field: "empcode", headerName: "Emp Code", flex: 0, width: 140, hide: !columnVisibilityAllList.empcode, headerClassName: "bold-header" },
    { field: "companyname", headerName: "Company Name", flex: 0, width: 220, hide: !columnVisibilityAllList.companyname, headerClassName: "bold-header" },
    { field: "user", headerName: "Login ID", flex: 0, width: 130, hide: !columnVisibilityAllList.user, headerClassName: "bold-header" },
    { field: "dateval", headerName: "Date", flex: 0, width: 200, hide: !columnVisibilityAllList.dateval, headerClassName: "bold-header" },
    { field: "vendor", headerName: "Vendor", flex: 0, width: 200, hide: !columnVisibilityAllList.vendor, headerClassName: "bold-header" },
    { field: "category", headerName: "Category", flex: 0, width: 250, hide: !columnVisibilityAllList.category, headerClassName: "bold-header" },
    { field: "subcategory", headerName: "Sub Category", flex: 0, width: 250, hide: !columnVisibilityAllList.subcategory, headerClassName: "bold-header" },
    { field: "unitid", headerName: "Identity Name", flex: 0, width: 140, hide: !columnVisibilityAllList.unitid, headerClassName: "bold-header" },

    { field: "unitrate", headerName: "Unit", flex: 0, width: 80, hide: !columnVisibilityAllList.unitrate, headerClassName: "bold-header" },
    { field: "flag", headerName: "Flag", flex: 0, width: 80, hide: !columnVisibilityAllList.flag, headerClassName: "bold-header" },
    { field: "section", headerName: "Section", flex: 0, width: 80, hide: !columnVisibilityAllList.section, headerClassName: "bold-header" },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 500,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibilityAllList.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("ioriginalmismatch") && (
            <Button
              sx={{ ...userStyle.buttonedit, marginRight: "0.5rem", textTransform: "capitalize" }}
              onClick={() => {
                handleClickUpdateFlag(params.row.id, params.row.flag, params.row.category, params.row.subcategory);
                // gettingIDs();
              }}
              variant="contained"
            >
              Flag
            </Button>
          )}
          <br />
          {isUserRoleCompare?.includes("ioriginalmismatch") && (
            <Button
              color="info"
              variant="contained"
              sx={{ marginRight: "0.5rem", textTransform: "capitalize" }}
              onClick={() => {
                handleNewflagpopOpen();
              }}
            >
              New Flag
            </Button>
          )}

          {isUserRoleCompare?.includes("voriginalmismatch") && (
            <Button
              color="warning"
              variant="contained"
              sx={{
                minWidth: "max-content",
                textTransform: "capitalize",
              }}
              onClick={() => {
                handleMultiUnitflagpopOpen();
              }}
            // variant="contained"
            >
              {/* <SettingsIcon /> */}
              <FontAwesomeIcon icon={faWrench} size="lg" />
            </Button>
          )}
        </Grid>
      ),
    },
  ];

  const rowDataTableAllList = filteredDataAllList.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      user: item.user,
      category: item.category,
      subcategory: item.subcategory,
      vendor: item.vendor,
      unitid: item.unitid,
      unitrate: item.unitrate,
      flag: item.flagcount,
      dateval: item.dateval,
      companyname: item.companyname,
      empcode: item.empcode,
    };
  });

  //datatable....
  const handleSearchChangeAllList = (event) => {
    setSearchQueryAllList(event.target.value);
  };

  const gridRefAllList = useRef(null);

  // Show All Columns functionality
  const handleShowAllColumnsAllList = () => {
    const updatedVisibility = { ...columnVisibilityAllList };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibilityAllList(updatedVisibility);
  };

  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem("columnVisibilityfour");
    if (savedVisibility) {
      setColumnVisibilityAllList(JSON.parse(savedVisibility));
    }
  }, []);

  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem("columnVisibilityfour", JSON.stringify(columnVisibilityAllList));
  }, [columnVisibilityAllList]);

  // // Function to filter columns based on search query
  const filteredColumnsAllList = columnDataTableAllList.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));

  // Manage Columns functionality
  const toggleColumnVisibilityAllList = (field) => {
    setColumnVisibilityAllList((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  // JSX for the "Manage Columns" popover content
  const manageColumnsContentAllList = (
    <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
      <Typography variant="h6">Manage Columns</Typography>
      <IconButton
        aria-label="close"
        onClick={handleCloseManageColumnsAllList}
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
        <TextField label="Find column" variant="standard" fullWidth value={searchQueryManageAllList} onChange={(e) => setSearchQueryManageAllList(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
      </Box>
      <br />
      <br />
      <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumnsAllList.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibilityAllList[column.field]} onChange={() => toggleColumnVisibilityAllList(column.field)} />}
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
            <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibilityAllList(initialColumnVisibilityAllList)}>
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
                columnDataTableAllList.forEach((column) => {
                  newColumnVisibility[column.field] = false; // Set hide property to true
                });
                setColumnVisibilityAllList(newColumnVisibility);
              }}
            >
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

  //----------------------------------------------------------------------------------------------------

  //---------------------------------updated LIST TABLE -----------------------------------------------------

  const [itemsUpdatedList, setItemsUpdatedList] = useState([]);
  const [pageUpdatedList, setPageUpdatedList] = useState(1);
  const [searchQueryManageUpdatedList, setSearchQueryManageUpdatedList] = useState("");
  const [searchQueryUpdatedList, setSearchQueryUpdatedList] = useState("");

  const [tableUpdatedListDatas, setTableUpdatedListDatas] = useState([]);

  // Manage Columns

  const addSerialNumberUpdatedList = () => {
    const itemsWithSerialNumber = tableUpdatedListDatas?.map((item, index) => ({ ...item, serialNumber: index + 1, id: index }));
    setItemsUpdatedList(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumberUpdatedList();
  }, [tableUpdatedListDatas]);

  const initialColumnVisibilityUpdatedList = {
    serialNumber: true,
    user: true,
    dateval: true,
    vendor: true,
    category: true,
    filename: true,
    unitid: true,
    unitrate: true,
    flag: true,
    section: true,
    updatedunitrate: true,
    updatedflag: true,
    updatedsection: true,
    actions: true,
  };

  const [columnVisibilityUpdatedList, setColumnVisibilityUpdatedList] = useState(initialColumnVisibilityUpdatedList);

  // Manage Columns
  const [isManageColumnsOpenUpdatedList, setManageColumnsOpenUpdatedList] = useState(false);
  const [anchorElUpdatedList, setAnchorElUpdatedList] = useState(null);

  const handleOpenManageColumnsUpdatedList = (event) => {
    setAnchorElUpdatedList(event.currentTarget);
    setManageColumnsOpenUpdatedList(true);
  };

  const openUpdatedList = Boolean(anchorElUpdatedList);
  const idUpdatedList = openUpdatedList ? "simple-popover" : undefined;

  const handleCloseManageColumnsUpdatedList = () => {
    setManageColumnsOpenUpdatedList(false);
    setSearchQueryManageUpdatedList("");
  };

  const [pageSizeUpdatedList, setPageSizeUpdatedList] = useState(10);
  //Datatable
  const handlePageChangeUpdatedList = (newPage) => {
    setPageUpdatedList(newPage);
  };
  const handlePageSizeChangeUpdatedList = (event) => {
    setPageSizeUpdatedList(Number(event.target.value));
    setSelectedRows([]);
    setSelectAllChecked(false);
    setPage(1);
  };

  // Split the search query into individual terms
  const searchTermsUpdatedList = searchQueryUpdatedList.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDataUpdatedLists = itemsUpdatedList?.filter((item) => {
    return searchTermsUpdatedList.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  const filteredDataUpdatedList = filteredDataUpdatedLists.slice((pageUpdatedList - 1) * pageSizeUpdatedList, pageUpdatedList * pageSizeUpdatedList);

  const totalPagesUpdatedList = Math.ceil(filteredDataUpdatedLists.length / pageSizeUpdatedList);

  const visiblePagesUpdatedList = Math.min(totalPagesUpdatedList, 3);

  const firstVisiblePageUpdatedList = Math.max(1, pageUpdatedList - 1);
  const lastVisiblePageUpdatedList = Math.min(firstVisiblePageUpdatedList + visiblePagesUpdatedList - 1, totalPagesUpdatedList);

  const pageNumbersUpdatedList = [];

  const indexOfLastItemUpdatedList = pageUpdatedList * pageSizeUpdatedList;
  const indexOfFirstItemUpdatedList = indexOfLastItemUpdatedList - pageSizeUpdatedList;

  for (let i = firstVisiblePageUpdatedList; i <= lastVisiblePageUpdatedList; i++) {
    pageNumbersUpdatedList.push(i);
  }
  const [btnupdateSts, setBtnupdateSts] = useState([]);
  const undoUpdatedList = async (id) => {

    setBtnupdateSts((prev) => [...prev, id]);
    try {
      let update = await axios.post(`${SERVICE.UPDATE_UNDO_FIELDNAME}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        id: id,
      });
      // console.log(update.data);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const columnDataTableUpdatedList = [
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 80,
      hide: !columnVisibilityUpdatedList.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 120,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibilityUpdatedList.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("ioriginalmismatch") && (
            <Button
              color="info"
              variant="contained"
              disabled={btnupdateSts.includes(params.row.id)}
              sx={{ marginRight: "0.5rem", textTransform: "capitalize", border: btnupdateSts.includes(params.row.id) ? "2px solid #1976d2" : "inherit" }}
              onClick={() => {
                undoUpdatedList(params.row.id);
              }}
            >
              {btnupdateSts.includes(params.row.id) ? "Updated" : "Undo"}
            </Button>
          )}
        </Grid>
      ),
    },
    // { field: "empcode", headerName: "Emp Code", flex: 0, width: 140, hide: !columnVisibilityUpdatedList.empcode, headerClassName: "bold-header" },
    // { field: "companyname", headerName: "Company Name", flex: 0, width: 220, hide: !columnVisibilityUpdatedList.companyname, headerClassName: "bold-header" },
    { field: "user", headerName: "Login ID", flex: 0, width: 130, hide: !columnVisibilityUpdatedList.user, headerClassName: "bold-header" },
    { field: "dateval", headerName: "Date", flex: 0, width: 200, hide: !columnVisibilityUpdatedList.dateval, headerClassName: "bold-header" },
    { field: "vendor", headerName: "Vendor", flex: 0, width: 200, hide: !columnVisibilityUpdatedList.vendor, headerClassName: "bold-header" },
    { field: "filename", headerName: "Category", flex: 0, width: 250, hide: !columnVisibilityUpdatedList.category, headerClassName: "bold-header" },
    { field: "category", headerName: "Sub Category", flex: 0, width: 250, hide: !columnVisibilityUpdatedList.subcategory, headerClassName: "bold-header" },
    { field: "unitid", headerName: "Identity Name", flex: 0, width: 140, hide: !columnVisibilityUpdatedList.unitid, headerClassName: "bold-header" },

    { field: "unitrate", headerName: "Unit", flex: 0, width: 80, hide: !columnVisibilityUpdatedList.unitrate, headerClassName: "bold-header" },
    { field: "flag", headerName: "Flag", flex: 0, width: 80, hide: !columnVisibilityUpdatedList.flag, headerClassName: "bold-header" },
    { field: "section", headerName: "Section", flex: 0, width: 80, hide: !columnVisibilityUpdatedList.section, headerClassName: "bold-header" },
    { field: "updatedunitrate", headerName: "A Unit", flex: 0, width: 80, hide: !columnVisibilityUpdatedList.updatedunitrate, headerClassName: "bold-header" },
    { field: "updatedflag", headerName: "A Flag", flex: 0, width: 80, hide: !columnVisibilityUpdatedList.updatedflag, headerClassName: "bold-header" },
    { field: "updatedsection", headerName: "A Section", flex: 0, width: 80, hide: !columnVisibilityUpdatedList.updatedsection, headerClassName: "bold-header" },
  ];

  const rowDataTableUpdatedList = filteredDataUpdatedList.map((item, index) => {
    let [filenameupdated] = item.mode === "Manual" ? item.filename : item.filename.split(".x");
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      user: item.user,
      category: item.category,
      filename: filenameupdated,
      vendor: item.vendor,
      unitid: item.unitid,
      unitrate: item.unitrate,
      flag: item.flagcount,
      dateval: item.dateval,
      section: item.section,
      updatedsection: item.updatedsection,
      updatedunitrate: item.updatedunitrate,
      updatedflag: item.updatedflag,
    };
  });

  //datatable....
  const handleSearchChangeUpdatedList = (event) => {
    setSearchQueryUpdatedList(event.target.value);
  };

  const gridRefUpdatedList = useRef(null);

  // Show All Columns functionality
  const handleShowAllColumnsUpdatedList = () => {
    const updatedVisibility = { ...columnVisibilityUpdatedList };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibilityUpdatedList(updatedVisibility);
  };

  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem("columnVisibilityfour");
    if (savedVisibility) {
      setColumnVisibilityUpdatedList(JSON.parse(savedVisibility));
    }
  }, []);

  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem("columnVisibilityfour", JSON.stringify(columnVisibilityUpdatedList));
  }, [columnVisibilityUpdatedList]);

  // // Function to filter columns based on search query
  const filteredColumnsUpdatedList = columnDataTableUpdatedList.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));

  // Manage Columns functionality
  const toggleColumnVisibilityUpdatedList = (field) => {
    setColumnVisibilityUpdatedList((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  // JSX for the "Manage Columns" popover content
  const manageColumnsContentUpdatedList = (
    <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
      <Typography variant="h6">Manage Columns</Typography>
      <IconButton
        aria-label="close"
        onClick={handleCloseManageColumnsUpdatedList}
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
        <TextField label="Find column" variant="standard" fullWidth value={searchQueryManageUpdatedList} onChange={(e) => setSearchQueryManageUpdatedList(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
      </Box>
      <br />
      <br />
      <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumnsUpdatedList.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibilityUpdatedList[column.field]} onChange={() => toggleColumnVisibilityUpdatedList(column.field)} />}
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
            <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibilityUpdatedList(initialColumnVisibilityUpdatedList)}>
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
                columnDataTableUpdatedList.forEach((column) => {
                  newColumnVisibility[column.field] = false; // Set hide property to true
                });
                setColumnVisibilityUpdatedList(newColumnVisibility);
              }}
            >
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

  //-------------------------------------------------------------------------------------------------------

  // view model
  const [openview, setOpenview] = useState(false);

  const handleClickOpenview = () => {
    setOpenview(true);
  };

  const handleCloseview = () => {
    setOpenview(false);
  };

  const [openviewProgress, setOpenviewProgress] = useState(false);

  const handleClickOpenviewProgress = () => {
    setOpenviewProgress(true);
  };

  const handleCloseviewProgress = () => {
    setOpenviewProgress(false);
  };

  // Error Popup model
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  // const [showAlertpop, setShowAlertpop] = useState();

  const handleOpenerrpop = () => {
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
    // setTimeout(() => {
    //   setIsErrorOpen(false);
    // }, 1000);
  };

  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
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
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    if (selectedRowsTwo.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    if (selectedRowsThree.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    if (selectedRowsFour.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    if (selectedRowsFive.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  const [projectOpt, setProjmasterOpt] = useState([]);

  const handleTimeChange = (time, timeString) => {

    // Check if timeString is a valid time format
    const isValidTime = dayjs(timeString, "h:mm:ss A").isValid();

    if (isValidTime) {
      setOverallState({
        ...overallState,
        fromtime: dayjs(timeString, "h:mm:ss A"),
        fromtime24Hrs: dayjs(timeString, "h:mm:ss A").format("HH:mm:ss"),
      });
    }
  };

  // console.log(overallState.fromtime24Hrs, "gtom");

  const handleToTimeChange = (time, timeString) => {
    // Check if timeString is a valid time format
    const isValidTime = dayjs(timeString, "h:mm:ss A").isValid();
    if (isValidTime) {
      setOverallState({
        ...overallState,
        totime: dayjs(timeString, "h:mm:ss A"),
        totime24Hrs: dayjs(timeString, "h:mm:ss A").format("HH:mm:ss"),
      });
    }
  };

  const [categoryOpt, setCategoryOPt] = useState([]);
  const [subcategory, setSubCategoryOpt] = useState([]);
  const [loginAllotFilter, setLoginAllotFilter] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [identifierList, setIdentifierList] = useState([]);

  const fetchIdentifierList = async () => {
    try {
      if (overallState.category == "Please Select Category" || overallState.category == "") {

        setPopupContentMalert("Please Select Category");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (overallState.subcategory == "Please Select Sub Category" || overallState.subcategory == "") {

        setPopupContentMalert("Please Select SubCategory");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else {
        setIdentifierClick(false);
        let filteredDatass = await axios.post(SERVICE.ORIGINALMISMATCHFILTER, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          category: String(overallState.category === "Please Select Category" ? "" : overallState.category),
          subcategory: String(overallState.subcategory === "Please Select Sub Category" ? "" : overallState.subcategory),
        });

        let showDatas = filteredDatass?.data?.filteredDatas.map((item) => ({ label: item.unitid, value: item.unitid }));

        let filteredallloginds = filteredDatass?.data?.filteredDatas.filter((d) => loginAllotFilter.map((data) => data.value).includes(d.user)).map((item) => ({ label: item.unitid, value: item.unitid }));
        let filteredSelectedloginds = filteredDatass?.data?.filteredDatas.filter((d) => overallState.login === d.user).map((item) => ({ label: item.unitid, value: item.unitid }));

        if (loginClick === false && overallState.login === "Please Select Login") {
          setIdentifierList(filteredallloginds);
        } else if (loginClick === false && overallState.login !== "Please Select Login") {
          setIdentifierList(filteredSelectedloginds);
        } else {
          setIdentifierList(showDatas);
        }
      }

    } catch (err) { setIdentifierClick(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const fetchLoginList = async () => {
    try {
      if (overallState.category == "Please Select Category" || overallState.category == "") {

        setPopupContentMalert("Please Select Category");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (overallState.subcategory == "Please Select Sub Category" || overallState.subcategory == "") {

        setPopupContentMalert("Please Select SubCategory");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else {
        setLoginClick(false);
        let filteredDatass = await axios.post(SERVICE.ORIGINALMISMATCHFILTER, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          category: String(overallState.category === "Please Select Category" ? "" : overallState.category),
          subcategory: String(overallState.subcategory === "Please Select Sub Category" ? "" : overallState.subcategory),
        });

        let loginUnique = new Set(filteredDatass?.data?.filteredDatas.map((item) => item.user));
        let uniqueArray = Array.from(loginUnique);

        let showDatas = uniqueArray.map((item) => ({ label: item, value: item }));

        setLoginAllotFilter(showDatas);
      }

    } catch (err) {
      setLoginClick(true);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const getviewCode = async (values) => {
    setTableTwo(true);
    try {
      let pickedDatas = masterDatas.filter((data) => {
        if (data.mode === "Manual") {
          return data.fromdate === values.date;
        } else {
          return data.dateval === values.date;
        }
      });

      let singledataDatewise = pickedDatas.reduce((acc, current) => {
        // console.log(acc, current, 'acc, current')
        const dateCurr = current.mode === "Manual" ? current.fromdate : current.dateval;
        const filenameCurr = current.filename;

        // First condition: mismatchmodestatus is not "Yes"
        const existingItemIndex = acc.findIndex((item) => {
          const date = item.mode === "Manual" ? item.fromdate : item.dateval;
          const filename = item.filename;
          // const mismatchmodestatus = item.mismatchmodestatus !== "Yes" && current.mismatchmodestatus !== "Yes";
          const mismatchmodeFlag = Number(item.unitrate) !== Number(item.mrate);
          const mismatchmodeFlagCurr = Number(current.unitrate) !== Number(current.mrate);
          return dateCurr === date && filename === filenameCurr && mismatchmodeFlag && mismatchmodeFlagCurr;
        });

        // Second condition: specific mismatchmode flag logic
        const existingItemIndexSecond = acc.findIndex((item) => {
          const date = item.mode === "Manual" ? item.fromdate : item.dateval;
          const filename = item.filename;
          const mismatchmodeFlag = Number(item.unitrate) == Number(item.mrate) && Number(item.unitflag) != Number(item.flagcount) && item.mismatchmodestatus == "Yes";
          const mismatchmodeFlagCurr = Number(current.unitrate) == Number(current.mrate) && Number(current.unitflag) != Number(current.flagcount) && current.mismatchmodestatus == "Yes";
          return dateCurr === date && filename === filenameCurr && mismatchmodeFlag && mismatchmodeFlagCurr;
        });



        if (existingItemIndex !== -1) {
          // Update existing item for first condition
          const existingItem = acc[existingItemIndex];
          existingItem.count += 1;
          existingItem._id = current._id;
          existingItem.ids.push({
            _id: current._id,
            category: current.category,
            filename: filenameCurr,
            flagcount: current.flagcount,
            section: current.section,
            unitrate: current.unitrate,
            mrate: current.mrate,
            mode: current.mode,
            unitflag: current.unitflag,
            mismatchmode: current.unitrate == current.mrate && current.unitflag != current.flagcount && current.mismatchmodestatus == "Yes"
              ? ["Flag"]
              : current.mismatchmode,
            mismatchmodestatus: current.mismatchmodestatus,
          });
          existingItem.date = dateCurr;
          existingItem.category = current.category;
          existingItem.flagcount = current.flagcount;
          existingItem.unitflag = current.unitflag;
          existingItem.mrate = current.mrate;
          existingItem.mismatchmodestatus = current.mismatchmodestatus;

          existingItem.filename = filenameCurr;
          existingItem.mismatchmode = [...new Set(existingItem.mismatchmode.concat(current.mismatchmode))];

        }
        else if (existingItemIndexSecond !== -1) {
          // Update existing item for second condition
          const existingItem = acc[existingItemIndexSecond];
          existingItem.count += 1;
          existingItem._id = current._id;
          existingItem.ids.push({
            _id: current._id,
            category: current.category,
            filename: filenameCurr,
            flagcount: current.flagcount,
            section: current.section,
            unitrate: current.unitrate,
            mrate: current.mrate,
            mode: current.mode,
            unitflag: current.unitflag,
            mismatchmode: ["Flag"], // Force mismatchmode to "Flag"
            mismatchmodestatus: current.mismatchmodestatus,
          });
          existingItem.date = dateCurr;
          existingItem.category = current.category;
          existingItem.flagcount = current.flagcount;
          existingItem.unitflag = current.unitflag;
          existingItem.mrate = current.mrate;
          existingItem.filename = filenameCurr;
          existingItem.mismatchmodestatus = current.mismatchmodestatus;
          existingItem.mismatchmode = ["Flag"];


        } else {
          // Add new item
          acc.push({
            date: dateCurr,
            fromdate: dateCurr,
            dateval: current.dateval,
            ids: [{
              _id: current._id,
              category: current.category,
              filename: current.filename,
              flagcount: current.flagcount,
              section: current.section,
              unitrate: current.unitrate,
              mrate: current.mrate,
              mode: current.mode,
              unitflag: current.unitflag,
              mismatchmodestatus: current.mismatchmodestatus,
              mismatchmode: current.unitrate == current.mrate && current.unitflag != current.flagcount && current.mismatchmodestatus == "Yes"
                ? ["Flag"]
                : current.mismatchmode,
              mismatchmodestatus: current.mismatchmodestatus,
            }],
            _id: current._id,
            category: current.category,
            filename: current.filename,
            mismatchmodestatus: current.mismatchmodestatus,
            flagcount: current.flagcount,
            unitflag: current.unitflag,
            unitrate: current.unitrate,
            mrate: current.mrate,
            mode: current.mode,
            vendor: current.vendor,

            mismatchmode: current.unitrate == current.mrate && current.unitflag != current.flagcount && current.mismatchmodestatus == "Yes"
              ? ["Flag"]
              : current.mismatchmode,
            count: 1,
          });
        }

        return acc;
      }, []);



      // console.log(singledataDatewise[0]);

      const result = singledataDatewise;
      // console.log(result);
      setTableTwoDatas(result);
      setTableTwo(false);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const getviewCodeTwo = async (values) => {
    setTableThree(false);
    // console.log(values, 'values')
    try {
      const [projectval, vendorval] = values.vendor.split("-");
      const checkMisMode = values.mismatchmode.length === 1 ? values.mismatchmode[0] === "Flag" : false;

      let pickedDatas = masterDatas.filter((data) => {

        const [projectcurr, vendorcurr] = data.vendor.split("-");
        const checkFlagOnly = checkMisMode ? data.mismatchmode.includes("Flag Mismatched") && Number(data.unitrate) == Number(data.mrate) : Number(data.unitrate) != Number(data.mrate);

        if (data.mode === "Manual") {
          return data.fromdate === values.date && data.filename === values.category && projectcurr === projectval && checkFlagOnly;
        } else {
          return data.dateval === values.date && data.filename === values.category && projectcurr === projectval && checkFlagOnly;
        }
      });

      // console.log(pickedDatas, masterDatas, "HGHJ2");

      let singledataDatewise = pickedDatas.reduce((acc, current) => {
        const dateCurr = current.mode === "Manual" ? current.fromdate : current.dateval;
        const filenameCurr = current.mode === "Manual" ? current.filename : current.filename;

        const [projectCurr, vendorCurr] = current.vendor.split("-");

        const existingItemIndex = acc.findIndex((item) => {
          const date = item.mode === "Manual" ? item.date : item.dateval;
          const filename = item.filename;

          const [projectitem, vendoritem] = item.vendor.split("-");
          // const mismatchmodestatus = item.mismatchmodestatus !== "Yes" && current.mismatchmodestatus !== "Yes";

          return date === dateCurr && filename === filenameCurr && vendoritem === vendorCurr && projectitem === projectCurr;
        });

        // const existingItemIndexSecond = acc.findIndex((item) => {
        //   const date = item.mode === "Manual" ? item.date : item.dateval;
        //   const filename = item.filename;

        //   const [projectitem, vendoritem] = item.vendor.split("-");
        //   const mismatchmodeFlag = Number(item.unitrate) === Number(item.mrate) && Number(item.unitflag) !== Number(item.flagcount) && item.mismatchmodestatus === "Yes";
        //   const mismatchmodeFlagCurr = Number(current.unitrate) == Number(current.mrate) && Number(current.unitflag) != Number(current.flagcount) && current.mismatchmodestatus === "Yes";
        //   // const checkFlagOnly = checkMisMode ? item.mismatchmode.every(d => d === "Flag") : item.mismatchmode.some(d => ["Unit + Flag", "Unit", "Flag", "Unit + Section"])
        //   // console.log(date === dateCurr, filename === filenameCurr, vendoritem === vendorCurr, projectitem === projectCurr, mismatchmodeFlag, mismatchmodeFlagCurr)
        //   return date === dateCurr && filename === filenameCurr && vendoritem === vendorCurr && projectitem === projectCurr;
        // });
        // console.log(existingItemIndexSecond, existingItemIndex)
        if (existingItemIndex !== -1) {
          // Update existing item
          const existingItem = acc[existingItemIndex];

          existingItem.count += 1;
          existingItem.ids.push({
            _id: current._id,
            category: current.category,
            filename: filenameCurr,
            flagcount: current.flagcount,
            section: current.section,
            unitrate: current.unitrate,
            mrate: current.mrate,
            unitflag: current.unitflag,
            mode: current.mode,
            // mismatchmode: current.mismatchmode,
            mismatchmode: (current.unitrate == current.mrate && current.unitflag != current.flagcount && current.mismatchmodestatus == "Yes") ? ["Flag"] : current.mismatchmode,

          });
          existingItem.date = dateCurr;
          existingItem.dateval = current.dateval;
          existingItem.category = current.category;
          existingItem.flagcount = current.flagcount;
          existingItem.unitflag = current.unitflag;
          existingItem.mrate = current.mrate;
          existingItem.mismatchmodestatus = current.mismatchmodestatus;
          existingItem.filename = current.filename;
          existingItem.project = projectCurr;
          existingItem.vendor = current.vendor;
          existingItem.mode = current.mode;
          existingItem.vendor1 = vendorCurr;
          // existingItem.mismatchmode = current.mismatchmode;
          existingItem.mismatchmode = (current.unitrate == current.mrate && current.unitflag != current.flagcount && current.mismatchmodestatus == "Yes") ? ["Flag"] : [...new Set(existingItem.mismatchmode.concat(current.mismatchmode))];
          // existingItem.mismatchmode = [...new Set(existingItem.mismatchmode.concat(current.mismatchmode))];

          existingItem._id = current._id;
        }
        // else if (existingItemIndexSecond !== -1) {
        //   // Update existing item for second condition
        //   const existingItem = acc[existingItemIndexSecond];
        //   existingItem.count += 1;
        //   existingItem._id = current._id;
        //   existingItem.ids.push({
        //     _id: current._id,
        //     category: current.category,
        //     filename: filenameCurr,
        //     flagcount: current.flagcount,
        //     section: current.section,
        //     unitrate: current.unitrate,
        //     mrate: current.mrate,
        //     mode: current.mode,
        //     unitflag: current.unitflag,
        //     mismatchmode: ["Flag"], // Force mismatchmode to "Flag"
        //     mismatchmodestatus: current.mismatchmodestatus,
        //   });
        //   existingItem.date = dateCurr;
        //   existingItem.category = current.category;
        //   existingItem.flagcount = current.flagcount;
        //   existingItem.unitflag = current.unitflag;
        //   existingItem.mrate = current.mrate;
        //   existingItem.filename = filenameCurr;
        //   existingItem.mismatchmodestatus = current.mismatchmodestatus;
        //   existingItem.mismatchmode = ["Flag"];
        //   existingItem.project = projectCurr;
        //   existingItem.vendor = current.vendor;
        //   existingItem.mode = current.mode;
        //   existingItem.vendor1 = vendorCurr;
        // }

        else {
          // Add new item

          acc.push({
            date: dateCurr,
            dateval: current.dateval,
            ids: [
              {
                _id: current._id,
                category: current.category,
                filename: filenameCurr,
                flagcount: current.flagcount,
                section: current.section,
                unitrate: current.unitrate,
                mrate: current.mrate,
                unitflag: current.unitflag,
                mode: current.mode,
                // mismatchmode: current.mismatchmode,
                mismatchmode: (current.unitrate == current.mrate && current.unitflag != current.flagcount && current.mismatchmodestatus == "Yes") ? ["Flag"] : current.mismatchmode,

              },
            ],
            _id: current._id,
            category: current.category,
            filename: current.filename,
            mismatchmodestatus: current.mismatchmodestatus,
            flagcount: current.flagcount,
            unitflag: current.unitflag,
            unitrate: current.unitrate,
            mode: current.mode,
            vendor: current.vendor,
            vendor1: vendorCurr,
            project: projectCurr,
            mismatchmode: (current.unitrate == current.mrate && current.unitflag != current.flagcount && current.mismatchmodestatus == "Yes") ? ["Flag"] : current.mismatchmode,

            count: Number(1),
          });
        }
        return acc;
      }, []);



      // console.log(singledataDatewise[0]);
      setTableThreeDatas(singledataDatewise);
      setTableThree(true);

    } catch (err) { setTableThree(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const getviewCodeThree = async (values) => {
    setTableFour(false);

    const [projectval, vendorval] = values.vendor.split("-");
    const checkMisMode = values.mismatchmode.length === 1 ? values.mismatchmode[0] === "Flag" : false;

    let pickedDatas = masterDatas.filter((data) => {
      const [projectcurr, vendorcurr] = data.vendor.split("-");
      // const checkFlagOnly = checkMisMode ? data.mismatchmode.includes("Flag Mismatched") : data.mismatchmode.some(d => ["Unit + Flag", "Unit", "Flag", "Unit + Section"].includes(d));
      const checkFlagOnly = checkMisMode ? data.mismatchmode.includes("Flag Mismatched") && Number(data.unitrate) == Number(data.mrate) : Number(data.unitrate) != Number(data.mrate);

      if (data.mode === "Manual") {
        return data.fromdate === values.date && data.filename === values.category && projectcurr === projectval && vendorcurr === vendorval && checkFlagOnly;
      } else {
        return data.dateval === values.date && data.filename.split(".")[0] === values.category && projectcurr === projectval && vendorcurr === vendorval && checkFlagOnly;
      }
    });
    // console.log(pickedDatas, "pickedDatas");
    // const transformToCountsArray = (pickedDatas) => {
    //   const countsObject = {};

    //   pickedDatas.forEach((item) => {
    //     // Split dateval into date, time, and zone parts
    //     const [date, time, zone] = item.dateval.split(" ");

    //     // Split vendor into project and vendor1 parts
    //     const [project, vendor1] = item.vendor.split("-");

    //     // Construct key using date, category, vendor, and project
    //     const key = `${date}*${item.filename.split(".")[0]}*${item.vendor}*${project}*${item.category}`;

    //     // Increment count for the key
    //     countsObject[key] = (countsObject[key] || 0) + 1;
    //   });

    //   // Convert countsObject to an array of objects
    //   const result = Object.keys(countsObject).map((key) => {
    //     const [date, category, vendor, project, subcategory] = key.split("*");
    //     return { date, category, vendor, project, subcategory, count: countsObject[key] };
    //   });

    //   return result;
    // };

    // // Get counts of unique combinations
    // const result = transformToCountsArray(pickedDatas);

    let singledataDatewise = pickedDatas.reduce((acc, current) => {
      const dateCurr = current.mode === "Manual" ? current.fromdate : current.dateval;
      const filenameCurr = current.mode === "Manual" ? current.filename : current.filename;

      const [projectCurr, vendorCurr] = current.vendor.split("-");
      const subcates = current.category;
      const existingItemIndex = acc.findIndex((item) => {
        const date = item.mode === "Manual" ? item.fromdate : item.dateval;
        const filename = item.mode === "Manual" ? item.filename : item.filename;

        const [projectitem, vendoritem] = item.vendor.split("-");
        // console.log(date === dateCurr , filename === filenameCurr , vendoritem === vendorCurr , projectitem === projectCurr ,item.category === current.category)
        return filename === filenameCurr && vendoritem === vendorCurr && projectitem === projectCurr && item.category === current.category;
      });

      if (existingItemIndex !== -1) {
        // Update existing item
        const existingItem = acc[existingItemIndex];

        existingItem.count += 1;
        existingItem.ids.push({
          _id: current._id,
          category: subcates,
          filename: filenameCurr,
          flagcount: current.flagcount,
          section: current.section,
          unitrate: current.unitrate,
          mrate: current.mrate,
          mode: current.mode,
          unitflag: current.unitflag,
          // mismatchmode: current.mismatchmode,
          mismatchmode: (current.unitrate == current.mrate && current.unitflag != current.flagcount && current.mismatchmodestatus == "Yes") ? ["Flag"] : [...new Set(existingItem.mismatchmode.concat(current.mismatchmode))],

        });
        existingItem.date = dateCurr;
        existingItem.dateval = current.dateval;
        existingItem.category = subcates;
        existingItem.subcategory = subcates;
        existingItem.category1 = filenameCurr;
        existingItem.filename = current.filename;
        // existingItem.mismatchmode = [...new Set(existingItem.mismatchmode.concat(current.mismatchmode))];
        existingItem.mismatchmode = (current.unitrate == current.mrate && current.unitflag != current.flagcount && current.mismatchmodestatus == "Yes") ? ["Flag"] : [...new Set(existingItem.mismatchmode.concat(current.mismatchmode))];
        existingItem.project = projectCurr;
        existingItem.flagcount = current.flagcount;
        existingItem.unitrate = current.unitrate;
        existingItem.mrate = current.mrate;
        existingItem.unitflag = current.unitflag;
        existingItem.vendor = current.vendor;
        existingItem.vendor1 = vendorCurr;
        existingItem._id = current._id;
      } else {
        // Add new item

        acc.push({
          date: dateCurr,
          dateval: current.dateval,
          ids: [
            {
              _id: current._id,
              category: subcates,
              filename: filenameCurr,
              flagcount: current.flagcount,
              mode: current.mode,
              section: current.section,
              unitrate: current.unitrate,
              mrate: current.mrate,
              unitflag: current.unitflag,
              // mismatchmode: current.mismatchmode,
              mismatchmode: (current.unitrate == current.mrate && current.unitflag != current.flagcount && current.mismatchmodestatus == "Yes") ? ["Flag"] : current.mismatchmode,

            },
          ],
          _id: current._id,
          category1: filenameCurr,
          category: subcates,
          subcategory: subcates,
          filename: current.filename,
          // mismatchmode: current.mismatchmode,
          mismatchmode: (current.unitrate == current.mrate && current.unitflag != current.flagcount && current.mismatchmodestatus == "Yes") ? ["Flag"] : current.mismatchmode,
          flagcount: current.flagcount,
          mode: current.mode,
          section: current.section,
          unitrate: current.unitrate,
          mrate: current.mrate,
          unitflag: current.unitflag,
          vendor: current.vendor,
          vendor1: vendorCurr,
          project: projectCurr,
          count: Number(1),
        });
      }
      return acc;
    }, []);
    // console.log(singledataDatewise[0]);
    setColumnVisibilityFour(initialColumnVisibilityFour)
    setTableFourDatas(singledataDatewise);
    setTableFour(true);
  };

  const getviewCodeFour = async (values) => {
    setTableFive(false);
    // console.log(values,masterDatas)
    const checkMisMode = values.mismatchmode.length === 1 ? values.mismatchmode[0] === "Flag" : false;

    let pickedDatas = masterDatas.filter((data) => {
      const checkFlagOnly = checkMisMode ? data.mismatchmode.includes("Flag Mismatched") && Number(data.unitrate) == Number(data.mrate) : Number(data.unitrate) != Number(data.mrate);

      if (data.mode === "Manual") {
        return data.filename === values.category1 && data.vendor === values.vendor && data.category === values.subcategory && checkFlagOnly;
      } else {
        return data.filename.split(".")[0] === values.category1 && data.vendor === values.vendor && data.category === values.subcategory && checkFlagOnly;
      }
    });

    // let pickedDatas = masterDatas.filter((data) => {
    //   return data.dateval === values.date && data.filename.split(".")[0] === values.category1 && data.vendor === values.vendor && data.category === values.subcategory && data._id === values._id;
    // });

    let singledataDatewise = pickedDatas.reduce((acc, current) => {
      const dateCurr = current.mode === "Manual" ? current.fromdate : current.dateval;
      const filenameCurr = current.mode === "Manual" ? current.filename : current.filename;

      const [projectCurr, vendorCurr] = current.vendor.split("-");
      const subcates = current.category;
      // const existingItemIndex = acc.findIndex((item) => {
      //   const date = item.mode ==="Manual" ? item.date : item.dateval?;
      //   const filename =item.mode ==="Manual" ? item.filename : item.filename;

      //   const [projectitem, vendoritem] = item.vendor.split("-");
      //   return date === dateCurr && filename === filenameCurr && vendoritem === vendorCurr && projectitem === projectCurr && item.category === current.category && item.user === current.user && item.unitid === current.unitid;
      // });

      // Add new item

      acc.push({
        date: dateCurr,
        _id: current._id,
        category1: filenameCurr,
        subcategory: subcates,
        ids: [
          {
            _id: current._id,
            category: subcates,
            filename: filenameCurr,
            flagcount: current.flagcount,
            section: current.section,
            unitrate: current.unitrate,
            mrate: current.mrate,
            mode: current.mode,
            unitflag: current.unitflag,
            // mismatchmode: current.mismatchmode,
            mismatchmode: (current.unitrate == current.mrate && current.unitflag != current.flagcount && current.mismatchmodestatus == "Yes") ? ["Flag"] : current.mismatchmode,

          },
        ],
        category: current.category,

        flagcount: current.flagcount,
        filename: current.filename,
        dateval: current.dateval,
        unitrate: current.unitrate,
        vendor: current.vendor,
        section: current.section,
        mismatchmode: (current.unitrate == current.mrate && current.unitflag != current.flagcount && current.mismatchmodestatus == "Yes") ? ["Flag"] : current.mismatchmode,

        vendor1: vendorCurr,
        unitid: current.unitid,
        user: current.user,
        project: projectCurr,
        count: Number(1),
      });

      return acc;
    }, []);

    // console.log(singledataDatewise);
    setTableFiveDatas(singledataDatewise);
    setTableFive(true);
  };

  const fetchVendor = async (e) => {
    try {
      let res_vendor = await axios.get(SERVICE.VENDORMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      // let filteredDatas = res_vendor?.data?.vendormaster?.filter((data) => {
      //     return e.value === data.projectname
      // }).map((item) => ({
      //     label: item.name, value: item.name
      // }))

      setVendors(res_vendor?.data?.vendormaster);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  // const [unitRates, setUnitrates] = useState([]);
  // const fetchUnitrate = async () => {
  //   try {
  //     let res = await axios.get(SERVICE.PRODUCTION_UNITRATE_LIMITED_PROD, {
  //       headers: {
  //         Authorization: `Bearer ${auth.APIToken}`,
  //       },
  //     });

  //     // let filteredDatas = res_vendor?.data?.vendormaster?.filter((data) => {
  //     //     return e.value === data.projectname
  //     // }).map((item) => ({
  //     //     label: item.name, value: item.name
  //     // }))

  //     setUnitrates(res?.data?.unitsrate);
  //   } catch (err) {
  //     const messages = err?.response?.data?.message;
  //     if (messages) {
  //       setShowAlert(
  //         <>
  //           <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
  //           <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
  //         </>
  //       );
  //       handleClickOpenerr();
  //     } else {
  //       setShowAlert(
  //         <>
  //           <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
  //           <p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong2!"}</p>
  //         </>
  //       );
  //       handleClickOpenerr();
  //     }
  //   }
  // };

  // useEffect(() => {
  //   fetchUnitrate();
  // }, [alltable]);

  //get all project.
  const fetchEmployees = async () => {
    try {
      let resEmp = await axios.get(SERVICE.ALLUSER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let getEmpNames = resEmp.data.allusers.map((emp) => emp.companyname).map((item) => ({ label: item, value: item }));

      setEmployees(getEmpNames);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //get all project.
  const fetchProjMaster = async () => {
    try {
      let res_project = await axios.get(SERVICE.PROJECTMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const projectopt = [
        ...res_project?.data?.projmaster?.map((item) => ({
          ...item,
          label: item.name,
          value: item.name,
        })),
      ];

      setProjmasterOpt(projectopt);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //get all category.
  const fetchAllCategory = async () => {
    try {
      let res_module = await axios.get(SERVICE.CATEGORYPROD_LIMITED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      // const categoryOpt = [...res_module?.data?.categoryprod.map((item) => ({
      //     ...item,
      //     label: item.name,
      //     value: item.name

      // }))]

      setCategoryOPt(res_module?.data?.categoryprod);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //get all category.
  const handleCategoryChange = async (e) => {
    try {
      let res_module = await axios.get(SERVICE.SUBCATEGORYPROD, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const projFilt = res_module?.data?.subcategoryprod
        .filter((data) => {
          return data.categoryname === e.value;
        })
        .map((item) => ({
          label: item.name,
          value: item.name,
        }));

      setSubCategoryOpt(projFilt);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const [clientids, setClientids] = useState([]);
  //get all category.
  const handleAllClientUserids = async (e) => {
    try {
      let res_vendor = await axios.get(SERVICE.CLIENTUSERID_LIMITED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      // console.log(res_vendor?.data?.clientuserid,'sdf')
      setClientids(res_vendor?.data?.clientuserid);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const StyledDataGrid1 = styled(DataGrid)(({ theme }) => ({
    "& .MuiDataGrid-virtualScroller": {
      overflowY: "hidden",
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      fontWeight: " bold !important ",
    },
  }));

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    // checkbox: true,
    date: true,
    id: true,
    ids: true,
    categories: true,
    count: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
  useEffect(() => {
    setColumnVisibility(initialColumnVisibility);
  }, []);
  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  //submit option for saving
  const handleSubmit = async (e) => {
    setTableCount(0);
    setalltable(true);
    setSourcecheck(true);
    try {
      let res = await axios.post(SERVICE.ORIGINALMISMATCHFILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        category: String(overallState.category === "Please Select Category" ? "" : overallState.category),
        project: String(overallState.project === "Please Select Category" ? "" : overallState.project),
        subcategory: String(overallState.subcategory === "Please Select Sub Category" ? "" : overallState.subcategory),
        projectvendor: overallState.project === "Please Select Project" || overallState.projectvendor === "Please Select Project Vendor" ? "" : String(`${overallState.project}-${overallState.projectvendor}`),
        employee: String(overallState.employee === "Please Select employee" ? "" : loginAllotFilter.map((item) => item.value)),
        user: String(overallState.login === "Please Select Login" ? "" : overallState.login),
        identifier: String(overallState.identifier === "Please Select Identifier" ? "" : overallState.identifier),
        date: overallState.date,
      });

      let res_vendor = await axios.get(SERVICE.CLIENTUSERID_LIMITED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      // console.log(res_vendor?.data?.clientuserid,'sdf')

      let alllist = res?.data?.filteredDatas.map((item) => {
        let filenamelist = item.filename;
        let filenamelistnew = filenamelist && filenamelist[0];

        let matchFindempname = res_vendor?.data?.clientuserid.find((d) => item.user === d.userid);
        let loginallot = matchFindempname ? matchFindempname.loginallotlog : [];

        const groupedByDateTime = {};

        // Group items by date and time
        loginallot.forEach((item) => {
          const dateTime = item.date + " " + item.time; // Assuming item.updatetime contains time in HH:mm format
          if (!groupedByDateTime[dateTime]) {
            groupedByDateTime[dateTime] = [];
          }
          groupedByDateTime[dateTime].push(item);
        });

        // Extract the last item of each group
        const lastItemsForEachDateTime = Object.values(groupedByDateTime).map((group) => group[group.length - 1]);
        //  console.log(lastItemsForEachDateTime,'SORTBEFORE' )

        // Sort the last items by date and time
        lastItemsForEachDateTime.sort((a, b) => {
          return new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time);
        });

        // Find the first item in the sorted array that meets the criteria
        let filteredDataDateTime = null;
        for (let i = 0; i < lastItemsForEachDateTime.length; i++) {
          const dateTime = lastItemsForEachDateTime[i].date + " " + lastItemsForEachDateTime[i].time;
          // let datevalsplit = item.dateval.split(" ");
          let datevalsplitfinal = item.dateval;
          // console.log(new Date(dateTime), new Date(datevalsplitfinal), "TWODATE");
          if (new Date(dateTime) <= new Date(datevalsplitfinal)) {
            filteredDataDateTime = lastItemsForEachDateTime[i];
          } else {
            break; // Break the loop if we encounter an item with date and time greater than or equal to selectedDateTime
          }
        }

        // console.log(filteredDataDateTime,'filteredDataDateTime')
        // console.log(loginallot.length,loginallot.length > 0 ? filteredDataDateTime.empname : matchFindempname.empname )
        return {
          ...item,
          category: filenamelistnew,
          subcategory: item.category,
          companyname: loginallot.length > 0 ? filteredDataDateTime.empname : matchFindempname ? matchFindempname.empname : "",
          empcode: loginallot.length > 0 ? filteredDataDateTime.empcode : matchFindempname ? matchFindempname.empcode : "",
        };
      });
      setTableAllListDatas(alllist);
      setSourcecheck(false);

    } catch (err) { setSourcecheck(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const [isupdatedlist, setisupdatedlist] = useState(false);
  const fetchUpdatedList = () => {
    setisupdatedlist(true);
    setBtnupdateSts([]);
    const batchSize = 50000;
    const batches = [];
    let page = 1; // Start from page 1

    async function fetchData(page) {
      try {
        const response = await axios.post(
          SERVICE.GET_MISMATCH_UPDATEDLIST,
          {
            page: page,
            pageSize: batchSize,
            date: overallState.date,
            // project:overallState.project,
          },
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          }
        );
        if (Array.isArray(response.data.filteredDatas)) {
          batches.push(...response.data.filteredDatas);

          // Check if there's more data to fetch
          if (response.data.filteredDatas.length === batchSize) {
            // If yes, fetch the next page
            page++;
            await fetchData(page);
          }
        } else {
          //
          console.err("Response data is not an array:", response.data.filteredDatas);
          // Handle err as needed
        }
      } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }

    fetchData(page).then(async () => {
      // console.log("All data fetched:", batches);
      setisupdatedlist(false);

      setTableUpdatedListDatas(batches);
    });
  };

  const handleUnmatchSubmit = async (e) => {
    let checkProdDay = await axios.post(SERVICE.CHECK_ISPRODDAY_CREATED, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      date: overallState.date,
    });

    if (checkProdDay.data.count > 0) {

      setPopupContentMalert("!Already Production Day Created ");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (overallState.project === "Please Select Project") {

      setPopupContentMalert("Please Select Project");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (overallState.date === "") {

      setPopupContentMalert("Please Select Date");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      setalltable(false);

      setSourcecheck(true);
      setTableCount(1);
      setSelectAllCheckedFive(false);
      setSelectedRowsFive([]);
      setSelectedFiveIds([]);
      setIsBulkUpdateFive(false);
      setSelectAllCheckedTwo(false);
      setSelectedRowsTwo([]);
      setSelectedTwoIds([]);
      setIsBulkUpdateTwo(false);
      setSelectAllCheckedThree(false);
      setSelectedRowsThree([]);
      setSelectedThreeIds([]);
      setIsBulkUpdateThree(false);
      setSelectAllCheckedFour(false);
      setSelectedRowsFour([]);
      setSelectedFourIds([]);
      setIsBulkUpdateFour(false);
      setTableTwo(false);
      setupdatedIds([]);
      setupdatedIdsUnit([]);
      setupdatedIdsFlag([]);
      setupdatedIdsSection([]);

      try {
        setUniqueDates([]);

        setMasterDatas([]);

        const resCount = await axios.post(
          SERVICE.GET_MISMATCH_DATAS_ID,
          {
            project: overallState.project,
            date: overallState.date,
            fromtime: overallState.fromtime24Hrs,
            totime: overallState.totime24Hrs
          },
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          }
        );

        // console.log(resCount.data.filteredDatas);
        let ids = resCount.data.filteredDatas.map((item) => item._id);
        let idsManual = resCount.data.filteredDatasManual.map((item) => item._id);
        // console.log(ids, "idsManual");

        if (resCount.data.count > 0) {
          const batchSize = 25000;
          const batches = [];
          const batchesManual = [];
          if (ids.length > 0) {
            for (let i = 0; i < ids.length; i += batchSize) {
              const batch = ids.slice(i, i + batchSize);

              try {
                const response = await axios.post(
                  SERVICE.PRODUCTION_UPLOAD_GETDATAS_BYID,
                  {
                    ids: batch,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },
                  }
                );
                // batches.push([...response.data.productionupload]);
                if (Array.isArray(response.data.productionupload)) {
                  batches.push(...response.data.productionupload);
                } else {
                  // console.err("Response data is not an array:", response.data.productionupload);
                  console.err("Response data is not an array:");
                  // Handle err as needed
                }
              } catch (err) {
                handleApiError(err, setShowAlert, handleClickOpenerr);
              }
            }
          }
          // if (idsManual.length > 0) {
          //   for (let i = 0; i < idsManual.length; i += batchSize) {
          //     const batch = idsManual.slice(i, i + batchSize);

          //     try {
          //       const response = await axios.post(
          //         SERVICE.PRODUCTION_UPLOAD_GETDATAS_BYID_MANUAL,
          //         {
          //           ids: batch,
          //         },
          //         {
          //           headers: {
          //             Authorization: `Bearer ${auth.APIToken}`,
          //           },
          //         }
          //       );
          //       // batches.push([...response.data.productionupload]);
          //       if (Array.isArray(response.data.productionindividual)) {
          //         batchesManual.push(...response.data.productionindividual);
          //       } else {
          //         // console.err("Response data is not an array:", response.data.productionupload);
          //         console.err("Response data is not an array:");
          //         // Handle err as needed
          //       }
          //     } catch (err) {
          //       console.err("Error sending batch:", err);
          //       // Handle err as needed
          //     }
          //   }
          // }
          setSourcecheck(false);

          let filterdmanual = batchesManual.filter((item) => item !== undefined);
          let filterduploads = batches.filter((item) => item !== undefined);
          let allData = [...filterdmanual, ...filterduploads];
          ;
          let singledataDatewise = allData.reduce((acc, current) => {
            const dateCurr = current.mode === "Manual" ? current.fromdate : current.dateval;
            const filenameCurr = current.mode === "Manual" ? current.filename : current.filename;

            const existingItemIndex = acc.findIndex((d) => {
              const datevalue = d.mode === "Manual" ? d.fromdate : d.dateval;
              return datevalue === dateCurr;
            });


            if (existingItemIndex !== -1) {
              // Update existing item
              const existingItem = acc[existingItemIndex];
              existingItem.dateval = current.dateval;
              existingItem.mismatchmode = [...new Set(existingItem.mismatchmode.concat(current.mismatchmode))];
              // existingItem.mismatchmode = (current.unitrate == current.mrate && current.unitflag != current.flagcount && current.mismatchmodestatus == "Yes") ? ["Flag"] : current.mismatchmode;

              existingItem.fromdate = current.fromdate;
              existingItem.mode = current.mode;
              // existingItem.ids.push(current._id);
              existingItem.ids.push({
                _id: current._id,
                category: current.category,
                filename: filenameCurr,
                flagcount: current.flagcount,
                section: current.section,
                unitrate: current.unitrate,
                mrate: current.mrate,
                mode: current.mode,
                mismatchmode: (current.unitrate == current.mrate && current.unitflag != current.flagcount && current.mismatchmodestatus == "Yes") ? ["Flag"] : current.mismatchmode,

                unitflag: current.unitflag,
                mismatchmodestatus: current.mismatchmodestatus,
              });
              // existingItem.categories.push(filenameCurr);
              existingItem.filename = current.filename;
              existingItem.date = dateCurr;
              existingItem.mismatchmodestatus = current.mismatchmodestatus;
              existingItem.count += 1;
            }
            else {

              acc.push({
                date: dateCurr,
                fromdate: dateCurr,
                dateval: current.dateval,
                mode: current.mode,
                // mismatchmode: current.mismatchmode,
                mismatchmode: (current.unitrate == current.mrate && current.unitflag != current.flagcount && current.mismatchmodestatus == "Yes") ? ["Flag"] : current.mismatchmode,

                // ids: [current._id],
                ids: [
                  {
                    _id: current._id,
                    category: current.category,
                    filename: filenameCurr,
                    flagcount: current.flagcount,
                    section: current.section,
                    unitrate: current.unitrate,
                    mrate: current.mrate,
                    mode: current.mode,
                    unitflag: current.unitflag,
                    mismatchmode: (current.unitrate == current.mrate && current.unitflag != current.flagcount && current.mismatchmodestatus == "Yes") ? ["Flag"] : current.mismatchmode,

                    mismatchmodestatus: current.mismatchmodestatus,
                  },
                ],

                filename: current.filename,
                mismatchmodestatus: current.mismatchmodestatus,
                count: Number(1),
              });
            }
            return acc;
          }, []);

          setUniqueDates(singledataDatewise);



          setMasterDatas(allData);

          setSourcecheck(false);
          setTableCount(1);
          setupdatedIds([]);

        } else {
          setSourcecheck(false);
          setTableCount(1);

          setSelectAllCheckedFive(false);
          setSelectedRowsFive([]);
          setSelectedFiveIds([]);
          setIsBulkUpdateFive(false);
          setSelectAllCheckedTwo(false);
          setSelectedRowsTwo([]);
          setSelectedTwoIds([]);
          setIsBulkUpdateTwo(false);
          setSelectAllCheckedThree(false);
          setSelectedRowsThree([]);
          setSelectedThreeIds([]);
          setIsBulkUpdateThree(false);
          setSelectAllCheckedFour(false);
          setSelectedRowsFour([]);
          setSelectedFourIds([]);
          setIsBulkUpdateFour(false);
          setTableTwo(false);

          setupdatedIds([]);
          setupdatedIdsUnit([]);
          setupdatedIdsFlag([]);
          setupdatedIdsSection([]);
        }
        let checkProdDay = await axios.post(SERVICE.CHECK_ISPRODDAY_CREATED, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          date: overallState.date,
        });
        setIsProdDayCount(checkProdDay.data.count);
        // fetchUpdatedList()
        // console.log(checkProdDay.data.count, 'xkfg')
      } catch (err) {



        setSourcecheck(false);
        setTableCount(1);


        setSelectAllCheckedFive(false);
        setSelectedRowsFive([]);
        setSelectedFiveIds([]);
        setIsBulkUpdateFive(false);
        setSelectAllCheckedTwo(false);
        setSelectedRowsTwo([]);
        setSelectedTwoIds([]);
        setIsBulkUpdateTwo(false);
        setSelectAllCheckedThree(false);
        setSelectedRowsThree([]);
        setSelectedThreeIds([]);
        setIsBulkUpdateThree(false);
        setSelectAllCheckedFour(false);
        setSelectedRowsFour([]);
        setSelectedFourIds([]);
        setIsBulkUpdateFour(false);
        setTableTwo(false);
        setupdatedIds([]);
        setupdatedIdsUnit([]);
        setupdatedIdsFlag([]);
        setupdatedIdsSection([]);
        handleApiError(err, setShowAlert, handleClickOpenerr);
      }
    }

  };

  const [flagChangingIDs, setFlagChangingIDs] = useState([]);

  const handleSubmitFlagCountTwo = async () => {
    if (flagCountFirst === "" || flagCountFirst === undefined) {

      setPopupContentMalert("Please Enter Flag Count");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();

    } else {
      sendRequestFlagCountTwo();
    }
  };

  //submit option for saving
  const sendRequestFlagCountTwo = async () => {
    handleCloseview();
    setUpdateContent(true);
    handleClickOpenviewProgress();
    try {
      await axios.put(SERVICE.ORIGINALMISMATCHUPDATEFLAGCOUNT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        ids: flagChangingIDs,
        newFlagCount: flagCountFirst,
      });

      setUpdateContent(false);
      setFlagChangingIDs([]);
    } catch (err) {
      handleCloseviewProgress();
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setOverallState({
      project: "Please Select Project",
      date: today,
      fromtime: dayjs("12:00:00 AM", "h:mm:ss A"),
      totime: dayjs("11:59:59 PM", "h:mm:ss A"),
      fromtime24Hrs: dayjs("12:00:00 AM", "h:mm:ss A").format("HH:mm:ss"),
      totime24Hrs: dayjs("11:59:59 PM", "h:mm:ss A").format("HH:mm:ss"),
      category: "Please Select Category",
      subcategory: "Please Select Sub Category",
      projectvendor: "Please Select Project Vendor",
      employee: "Please Select employee",
      login: "Please Select Login",
      identifier: "Please Select Identifier",
      todate: today,
    });
    setSubCategoryOpt([]);
    setVendors([]);
    setIdentifierList([]);
    setIdentifierClick(true);
    setLoginClick(true);
    setMasterDatas([]);
    setUniqueDates([]);
    setTableCount(0);
    setalltable(false);

    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  // first table
  const handleClickAllotUpdateFirst = async (ids, category, id) => {
    try {
      setIsunitflagone(id);
      if (isProdDayCount === 0) {
        if (ids.some((item) => item.mrate != undefined && item.mrate != 0 && item.unitflag != undefined && item.unitflag != 0)) {
          async function updateDataInBulk(items) {
            const updatePayload = items.map((item) => ({
              _id: item._id,
              mode: item.mode,
              updatedflag: Number(item.unitflag),
              updatedunitrate: Number(item.mrate),
            }));

            try {
              await axios.post(
                SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_UNITANDFLAG,
                {
                  updates: updatePayload,
                },
                {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },
                }
              );
              // setIsunitflagoneall((prev) => [...prev, ...items]);
              setupdatedIds((prev) => [...prev, ...items]);
            } catch (err) {

              setSelectAllCheckedTwo(false);
              setSelectedRowsTwo([]);
              setSelectedTwoIds([]);
              setIsBulkUpdateTwo(false);

              handleApiError(err, setShowAlert, handleClickOpenerr);
            }
          }

          // Call the function to update data in bulk
          const validItems = ids.filter((item) => item.mrate !== undefined && item.unitflag !== undefined);

          if (validItems.length > 0) {
            let buttonSelectValuesOnly = validItems.filter(d => d.mismatchmode.includes("Unit + Flag"))
            if (buttonSelectValuesOnly.length > 0) {

              updateDataInBulk(buttonSelectValuesOnly)
                .then(() => {
                  setIsunitflagone("");
                  setPopupContentMalert(validItems.length === ids.length ? "Alloted" : "Present unitrate value only updated");
                  setPopupSeverityMalert("info");
                  handleClickOpenPopupMalert();
                })
                .catch((err) => {
                  handleApiError(err, setShowAlert, handleClickOpenerr);
                  setSelectAllCheckedTwo(false);
                  setSelectedRowsTwo([]);
                  setSelectedTwoIds([]);
                  setIsBulkUpdateTwo(false);
                });
            } else {
              setIsunitflagone("");

              setPopupContentMalert("Unit + Flag mode is not present, No data to update");
              setPopupSeverityMalert("info");
              handleClickOpenPopupMalert();
            }

          }
        } else {
          setIsunitflagone("");

          setPopupContentMalert("Please Update Unitrate'S Mrate and Flagcount");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
        }
      } else {
        setIsunitflagone("");

        setPopupContentMalert("!Already Production Day Created");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }


    } catch (err) {

      setIsUnitone("");
      setIsunitflagone("");
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const handleClickUnitUpdateFirst = async (ids, category, id) => {
    try {
      setIsUnitone(id);
      if (isProdDayCount === 0) {
        if (ids.some((item) => item.mrate != undefined && item.mrate != 0)) {
          async function updateDataInBulk(items) {
            const updatePayload = items.map((item) => ({
              _id: item._id,
              mode: item.mode,

              updatedunitrate: Number(item.mrate),
            }));

            try {
              await axios.post(
                SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_UNITONLY,
                {
                  updates: updatePayload,
                },
                {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },
                }
              );
              // setIsUnitoneall((prev) => [...prev, ...items]);
              setupdatedIdsUnit((prev) => [...prev, ...items]);
              // console.log( updatedIds,  "selectedTwoIds" );
            } catch (err) {
              handleApiError(err, setShowAlert, handleClickOpenerr);
              setSelectAllCheckedTwo(false);
              setSelectedRowsTwo([]);
              setSelectedTwoIds([]);
              setIsBulkUpdateTwo(false);
              handleApiError(err, setShowAlert, handleClickOpenerr);
            }
          }

          // Call the function to update data in bulk
          const validItems = ids.filter((item) => item.mrate !== undefined);

          if (validItems.length > 0) {
            let buttonSelectValuesOnly = validItems.filter(d => d.mismatchmode.includes("Unit"))
            if (buttonSelectValuesOnly.length > 0) {

              updateDataInBulk(buttonSelectValuesOnly)
                .then(() => {

                  setPopupContentMalert(validItems.length === ids.length ? "Unit Updated" : "Present unitrate value only updated");
                  setPopupSeverityMalert("info");
                  handleClickOpenPopupMalert();
                  setIsUnitone(false);
                })
                .catch((err) => {
                  handleApiError(err, setShowAlert, handleClickOpenerr);
                  setIsUnitone(false);
                });
            } else {
              setIsUnitone("");

              setPopupContentMalert("Unit mode is not present, No data to update");
              setPopupSeverityMalert("info");
              handleClickOpenPopupMalert();
            }

          }
        } else {
          setIsUnitone(false);
          setPopupContentMalert("Please Update Unitrate");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
        }
      } else {
        setIsUnitone("");

        setPopupContentMalert("Please Update Unitrate'S Mrate and Flagcount");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }

    } catch (err) {

      setIsUnitone(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const handleClickFlagUpdateFirst = async (ids, category, id) => {
    try {
      setIsFlagone(id);
      if (isProdDayCount === 0) {
        if (ids.some((item) => item.unitflag != undefined && item.unitflag != 0)) {
          async function updateDataInBulk(items) {
            const updatePayload = items.map((item) => ({
              _id: item._id,
              mode: item.mode,
              updatedflag: Number(item.unitflag),
            }));

            try {
              await axios.post(
                SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_UNITANDFLAG,
                {
                  updates: updatePayload,
                },
                {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },
                }
              );
              // setIsFlagoneall((prev) => [...prev, ...items]);
              setupdatedIdsFlag((prev) => [...prev, ...items]);
              // console.log( updatedIds,  "selectedTwoIds" );
            } catch (err) {
              handleApiError(err, setShowAlert, handleClickOpenerr);
              setIsFlagone(false);
            }
          }

          // Call the function to update data in bulk
          const validItems = ids.filter((item) => item.unitflag !== undefined);

          if (validItems.length > 0) {

            let buttonSelectValuesOnly = validItems.filter(d => d.mismatchmode.includes("Flag"))
            if (buttonSelectValuesOnly.length > 0) {

              updateDataInBulk(buttonSelectValuesOnly)
                .then(() => {

                  setPopupContentMalert(validItems.length === ids.length ? "Alloted" : "Present unitrate value only updated");
                  setPopupSeverityMalert("info");
                  handleClickOpenPopupMalert();

                  setIsFlagone(false);
                })
                .catch((err) => {
                  handleApiError(err, setShowAlert, handleClickOpenerr);
                  setIsFlagone(false);
                });
            } else {
              setIsFlagone("");


              setPopupContentMalert("Flag mode is not present, No data to update");
              setPopupSeverityMalert("info");
              handleClickOpenPopupMalert();

            }


          }
        } else {
          setIsFlagone(false);
          setPopupContentMalert("Please Update Unitrate");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
        }
      } else {
        setIsFlagone("");

        setPopupContentMalert("Please Update Unitrate'S Mrate and Flagcount");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }

    } catch (err) {

      setIsFlagone(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const handleClickSectionUpdateFirst = async (ids, category, id) => {
    try {
      setIsSectionone(id);

      if (isProdDayCount === 0) {
        if (ids.filter((item) => item.mrate != undefined && item.mrate != 0 && item.unitflag != undefined && item.unitflag != 0 && item.section !== undefined).length > 0) {
          async function updateDataInBulk(items) {
            const updatePayload = items.map((item) => ({
              _id: item._id,
              mode: item.mode,

              updatedunitrate: Number(item.mrate),
              updatedsection: Number(item.mrate) * Number(item.unitflag) * Number(item.section),
            }));

            try {
              await axios.post(
                SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_UNITANDSECTION,
                {
                  updates: updatePayload,
                },
                {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },
                }
              );

              setupdatedIdsSection((prev) => [...prev, ...items]);
              // setIsSectiononeall((prev) => [...prev, ...items]);

              // console.log( updatedIds,  "selectedTwoIds" );
            } catch (err) {
              handleApiError(err, setShowAlert, handleClickOpenerr);
              setIsSectionone(false);
            }
          }

          // Call the function to update data in bulk
          const validItems = ids.filter((item) => item.mrate != undefined && item.mrate != 0 && item.unitflag != undefined && item.unitflag != 0 && item.section !== undefined);

          if (validItems.length > 0) {
            let buttonSelectValuesOnly = validItems.filter(d => d.mismatchmode.includes("Unit + Section"))
            if (buttonSelectValuesOnly.length > 0) {

              updateDataInBulk(buttonSelectValuesOnly)
                .then(() => {

                  setPopupContentMalert(validItems.length === ids.length ? "Alloted" : "Present unitrate value only updated");
                  setPopupSeverityMalert("info");
                  handleClickOpenPopupMalert();
                  setIsSectionone(false);
                })
                .catch((err) => {
                  handleApiError(err, setShowAlert, handleClickOpenerr);
                  setIsSectionone("");
                });
            } else {
              setIsSectionone("");

              setPopupContentMalert("Unit + Section mode is not present, No data to update");
              setPopupSeverityMalert("info");
              handleClickOpenPopupMalert();
            }

          }
          // setIsSectionone(false);
        } else {
          setIsSectionone(false);

          setPopupContentMalert(ids.every((item) => item.section == undefined) ? "Section not Present" : "Please Update Unitrate");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
        }
      } else {
        setIsSectionone("");

        setPopupContentMalert("Please Update Unitrate'S Mrate and Flagcount");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }

    } catch (err) {

      setIsSectionone(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // second table

  const handleClickAllotUpdateTwo = async (ids, category, id) => {
    try {
      setIsunitflagtwo(id);
      if (isProdDayCount === 0) {

        if (ids.some((item) => item.mrate != undefined && item.mrate != 0 && item.unitflag != undefined && item.unitflag != 0)) {
          async function updateDataInBulk(items) {
            const updatePayload = items.map((item) => ({
              _id: item._id,
              mode: item.mode,
              updatedflag: Number(item.unitflag),
              updatedunitrate: Number(item.mrate),
            }));

            try {
              await axios.post(
                SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_UNITANDFLAG,
                {
                  updates: updatePayload,
                },
                {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },
                }
              );
              // setIsunitflagtwoall((prev) => [...prev, ...items]);
              setupdatedIds((prev) => [...prev, ...items]);
            } catch (err) {
              handleApiError(err, setShowAlert, handleClickOpenerr);
              setIsunitflagone("");
            }
          }

          // Call the function to update data in bulk
          const validItems = ids.filter((item) => item.mrate !== undefined && item.unitflag !== undefined);

          if (validItems.length > 0) {
            let buttonSelectValuesOnly = validItems.filter(d => d.mismatchmode.includes("Unit + Flag"))
            if (buttonSelectValuesOnly.length > 0) {

              updateDataInBulk(buttonSelectValuesOnly).then(() => {

                setPopupContentMalert(validItems.length === ids.length ? "Alloted" : "Present unitrate value only updated");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();

                setIsunitflagtwo("");
              }).catch((err) => {
                handleApiError(err, setShowAlert, handleClickOpenerr);
                setIsunitflagtwo("");
              });
            } else {
              setIsunitflagtwo("");

              setPopupContentMalert("Unit + Flag mode is not present, No data to update");
              setPopupSeverityMalert("info");
              handleClickOpenPopupMalert();
            }


          } else {
            setIsunitflagtwo(false);
            setPopupContentMalert("Please Update Unitrate");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
          }


        } else {
          setIsunitflagtwo(false);

          setPopupContentMalert("Please Update Unitrate");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
        }
      } else {
        setIsunitflagtwo("");

        setPopupContentMalert("!Already Production Day Created");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    } catch (err) {

      setIsunitflagtwo(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const handleClickUnitUpdateTwo = async (ids, category, id) => {
    try {
      setIsUnittwo(id);
      if (isProdDayCount === 0) {
        if (ids.some((item) => item.mrate != undefined && item.mrate != 0)) {
          async function updateDataInBulk(items) {
            const updatePayload = items.map((item) => ({
              _id: item._id,
              mode: item.mode,

              updatedunitrate: Number(item.mrate),
            }));

            try {
              await axios.post(
                SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_UNITONLY,
                {
                  updates: updatePayload,
                },
                {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },
                }
              );
              // setIsUnittwoall((prev) => [...prev, ...items]);
              setupdatedIdsUnit((prev) => [...prev, ...items]);
              // console.log( updatedIds,  "selectedTwoIds" );
            } catch (err) {
              handleApiError(err, setShowAlert, handleClickOpenerr);
              setIsUnittwo("");
            }
          }

          // Call the function to update data in bulk
          const validItems = ids.filter((item) => item.mrate !== undefined);

          if (validItems.length > 0) {
            let buttonSelectValuesOnly = validItems.filter(d => d.mismatchmode.includes("Unit"))
            if (buttonSelectValuesOnly.filter(d => d.mismatchmode.includes("Unit")).length > 0) {

              updateDataInBulk(buttonSelectValuesOnly)
                .then(() => {
                  ;
                  setPopupContentMalert(validItems.length === ids.length ? "Unit Updated" : "Present unitrate value only updated");
                  setPopupSeverityMalert("info");
                  handleClickOpenPopupMalert();
                  setIsUnittwo("");
                })
                .catch((err) => {
                  handleApiError(err, setShowAlert, handleClickOpenerr);
                  setIsUnittwo("");
                });
            } else {
              setIsUnittwo("");
              setPopupContentMalert("Unit mode is not present, No data to update");
              setPopupSeverityMalert("info");
              handleClickOpenPopupMalert();
            }
          }

        } else {
          setIsUnittwo(false);
          setPopupContentMalert("Please Update Unitrate");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
        }
      } else {
        setIsUnittwo("");
        setPopupContentMalert("!Already Production Day Created");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }

    } catch (err) {

      setIsUnittwo(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const handleClickFlagUpdateTwo = async (ids, category, id) => {
    try {
      setIsFlagtwo(id);
      if (isProdDayCount === 0) {
        if (ids.some((item) => item.unitflag != undefined && item.unitflag != 0)) {
          async function updateDataInBulk(items) {
            const updatePayload = items.map((item) => ({
              _id: item._id,
              mode: item.mode,
              updatedflag: Number(item.unitflag),
            }));

            try {
              await axios.post(
                SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_FLAGONLY,
                {
                  updates: updatePayload,
                },
                {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },
                }
              );
              // setIsFlagtwoall((prev) => [...prev, ...items]);
              setupdatedIdsFlag((prev) => [...prev, ...items]);
              // console.log( updatedIds,  "selectedTwoIds" );
            } catch (err) {
              setIsFlagtwo(false);
              handleApiError(err, setShowAlert, handleClickOpenerr);
            }
          }

          // Call the function to update data in bulk
          const validItems = ids.filter((item) => item.unitflag !== undefined);

          if (validItems.length > 0) {
            let buttonSelectValuesOnly = validItems.filter(d => d.mismatchmode.includes("Flag"))
            if (buttonSelectValuesOnly.filter(d => d.mismatchmode.includes("Flag")).length > 0) {


              updateDataInBulk(buttonSelectValuesOnly)
                .then(() => {

                  setPopupContentMalert(validItems.length === ids.length ? "Alloted" : "Present unitrate value only updated");
                  setPopupSeverityMalert("info");
                  handleClickOpenPopupMalert();
                  setIsFlagtwo(false);
                })
                .catch((err) => {
                  handleApiError(err, setShowAlert, handleClickOpenerr);
                  setIsFlagtwo(false);
                });
            } else {

              setPopupContentMalert("Flag mode is not present, No data to update");
              setPopupSeverityMalert("info");
              handleClickOpenPopupMalert();
              setIsFlagtwo("");
            }

          }
        } else {
          setIsFlagtwo(false);
          setPopupContentMalert("Please Update Unitrate");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
        }
      } else {
        setIsFlagtwo("");
        setPopupContentMalert("!Already Production Day Created");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    } catch (err) {

      setIsFlagtwo(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const handleClickSectionUpdateTwo = async (ids, category, id) => {
    try {
      setIsSectiontwo(id);
      if (isProdDayCount === 0) {

        if (ids.filter((item) => item.mrate != undefined && item.mrate != 0 && item.unitflag != undefined && item.unitflag != 0 && item.section !== undefined).length > 0) {
          async function updateDataInBulk(items) {
            const updatePayload = items.map((item) => ({
              _id: item._id,
              mode: item.mode,

              updatedunitrate: Number(item.mrate),
              updatedsection: Number(item.mrate) * Number(item.unitflag) * Number(item.section),
            }));

            try {
              await axios.post(
                SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_UNITANDSECTION,
                {
                  updates: updatePayload,
                },
                {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },
                }
              );

              setupdatedIdsSection((prev) => [...prev, ...items]);
              // setIsSectiontwoall((prev) => [...prev, ...items]);

              // console.log( updatedIds,  "selectedTwoIds" );
            } catch (err) {
              handleApiError(err, setShowAlert, handleClickOpenerr);
            }
          }

          // Call the function to update data in bulk
          const validItems = ids.filter((item) => item.mrate !== undefined && item.unitflag !== undefined && item.section !== undefined);

          if (validItems.length > 0) {
            let buttonSelectValuesOnly = validItems.filter(d => d.mismatchmode.includes("Unit + Section"))
            if (buttonSelectValuesOnly.length > 0) {

              updateDataInBulk(buttonSelectValuesOnly)
                .then(() => {

                  setPopupContentMalert(validItems.length === ids.length ? "Alloted" : "Present unitrate value only updated");
                  setPopupSeverityMalert("info");
                  handleClickOpenPopupMalert();
                  setIsSectiontwo("");
                })
                .catch((err) => {
                  handleApiError(err, setShowAlert, handleClickOpenerr);
                  setIsSectiontwo("");
                });

            } else {

              setPopupContentMalert("Unit + Section mode is not present, No data to update");
              setPopupSeverityMalert("info");
              handleClickOpenPopupMalert();

              handleOpenerrpop();
            }

          } else {
            setPopupContentMalert("Section not Present");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
            setIsSectiontwo(false);
          }
          // setIsSectionone(false);
        } else {
          setIsSectiontwo(false);
          setPopupContentMalert("Section not Present");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
        }
      } else {
        setIsSectiontwo("");
        setPopupContentMalert("!Already Production Day Created");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }

    } catch (err) {

      setIsSectiontwo(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // third table
  const handleClickAllotUpdateThree = async (ids, category, id) => {
    try {
      setIsunitflagthree(id);
      if (isProdDayCount === 0) {
        if (ids.some((item) => item.mrate != undefined && item.mrate != 0 && item.unitflag != undefined && item.unitflag != 0)) {
          async function updateDataInBulk(items) {
            const updatePayload = items.map((item) => ({
              _id: item._id,
              mode: item.mode,
              updatedflag: Number(item.unitflag),
              updatedunitrate: Number(item.mrate),
            }));

            try {
              await axios.post(
                SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_UNITANDFLAG,
                {
                  updates: updatePayload,
                },
                {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },
                }
              );
              // setIsunitflagthreeall((prev) => [...prev, ...items]);
              setupdatedIds((prev) => [...prev, ...items]);
            } catch (err) {
              handleApiError(err, setShowAlert, handleClickOpenerr);
              setIsunitflagthree("");
            }
          }

          // Call the function to update data in bulk
          const validItems = ids.filter((item) => item.mrate !== undefined && item.unitflag !== undefined);

          if (validItems.length > 0) {

            let buttonSelectValuesOnly = validItems.filter(d => d.mismatchmode.includes("Unit + Flag"))
            if (buttonSelectValuesOnly.length > 0) {

              updateDataInBulk(buttonSelectValuesOnly)
                .then(() => {
                  setPopupContentMalert(validItems.length === ids.length ? "Alloted" : "Present unitrate value only updated");
                  setPopupSeverityMalert("info");
                  handleClickOpenPopupMalert();
                  handleClickOpenerr();
                })
                .catch((err) => {
                  handleApiError(err, setShowAlert, handleClickOpenerr);
                  setIsunitflagthree("");
                });
            } else {

              setPopupContentMalert("Unit + Flag mode is not present, No data to update");
              setPopupSeverityMalert("info");
              handleClickOpenPopupMalert();
              setIsunitflagthree("");
            }

          }
        } else {
          setIsunitflagthree(false);
          setPopupContentMalert("Please Update Unitrate");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();

        }
      } else {
        setIsunitflagthree("");
        setPopupContentMalert("!Already Production Day Created");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    } catch (err) {
      setIsunitflagthree("");
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const handleClickUnitUpdateThree = async (ids, category, id) => {
    try {
      setIsUnitthree(id);
      if (isProdDayCount === 0) {
        if (ids.some((item) => item.mrate != undefined && item.mrate != 0)) {
          async function updateDataInBulk(items) {
            const updatePayload = items.map((item) => ({
              _id: item._id,
              mode: item.mode,
              updatedunitrate: Number(item.mrate),
            }));

            try {
              await axios.post(
                SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_UNITONLY,
                {
                  updates: updatePayload,
                },
                {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },
                }
              );
              // setIsUnitthreeall((prev) => [...prev, ...items]);
              setupdatedIdsUnit((prev) => [...prev, ...items]);
              // console.log( updatedIds,  "selectedTwoIds" );
            } catch (err) {
              handleApiError(err, setShowAlert, handleClickOpenerr);
              setIsUnitthree("");
            }
          }

          // Call the function to update data in bulk
          const validItems = ids.filter((item) => item.mrate !== undefined);

          if (validItems.length > 0) {
            let buttonSelectValuesOnly = validItems.filter(d => d.mismatchmode.includes("Unit"))
            if (buttonSelectValuesOnly.length > 0) {

              updateDataInBulk(buttonSelectValuesOnly)
                .then(() => {

                  setPopupContentMalert(validItems.length === ids.length ? "Unit Updated" : "Present unitrate value only updated");
                  setPopupSeverityMalert("info");
                  handleClickOpenPopupMalert();
                  setIsUnitthree(false);
                })
                .catch((err) => {
                  handleApiError(err, setShowAlert, handleClickOpenerr);
                  setIsUnitthree(false);
                });

            } else {

              setPopupContentMalert("Unit mode is not present, No data to update");
              setPopupSeverityMalert("info");
              handleClickOpenPopupMalert();

              setIsunitflagthree("");
            }
          }
        } else {
          setIsUnitthree(false);
          setPopupContentMalert("Please Update Unitrate");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();

        }
      } else {
        setIsUnitthree("");
        setPopupContentMalert("!Already Production Day Created");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }


    } catch (err) {
      setIsUnitthree(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const handleClickFlagUpdateThree = async (ids, category, id) => {
    try {
      setIsFlagthree(id);
      if (isProdDayCount === 0) {
        if (ids.some((item) => item.unitflag != undefined && item.unitflag != 0)) {
          async function updateDataInBulk(items) {
            const updatePayload = items.map((item) => ({
              _id: item._id,
              mode: item.mode,
              updatedflag: Number(item.unitflag),
            }));

            try {
              await axios.post(
                SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_FLAGONLY,
                {
                  updates: updatePayload,
                },
                {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },
                }
              );
              // setIsFlagthreeall((prev) => [...prev, ...items]);
              setupdatedIdsFlag((prev) => [...prev, ...items]);
              // console.log( updatedIds,  "selectedTwoIds" );
            } catch (err) {
              handleApiError(err, setShowAlert, handleClickOpenerr);
            }
          }

          // Call the function to update data in bulk
          const validItems = ids.filter((item) => item.unitflag !== undefined);

          if (validItems.length > 0) {
            let buttonSelectValuesOnly = validItems.filter(d => d.mismatchmode.includes("Flag"))
            if (buttonSelectValuesOnly.length > 0) {

              updateDataInBulk(buttonSelectValuesOnly)
                .then(() => {

                  setPopupContentMalert(validItems.length === ids.length ? "Alloted" : "Present unitrate value only updated");
                  setPopupSeverityMalert("info");
                  handleClickOpenPopupMalert();
                  setIsFlagthree("");
                })
                .catch((err) => {
                  handleApiError(err, setShowAlert, handleClickOpenerr);
                  setIsFlagthree("");
                });
            } else {

              setPopupContentMalert("Flag mode is not present, No data to update");
              setPopupSeverityMalert("info");
              handleClickOpenPopupMalert();

              setIsFlagthree("");
            }
          }
        } else {
          setIsFlagthree(false);
          setPopupContentMalert("Please Update Unitrate");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();

        }
      } else {
        setIsFlagthree("");
        setPopupContentMalert("!Already Production Day Created");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }

    } catch (err) {
      setIsFlagthree(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const handleClickSectionUpdateThree = async (ids, category, id) => {
    try {
      setIsSectionthree(id);
      if (isProdDayCount === 0) {
        if (ids.filter((item) => item.mrate != undefined && item.mrate != 0 && item.unitflag != undefined && item.unitflag != 0 && item.section !== undefined).length > 0) {
          async function updateDataInBulk(items) {
            const updatePayload = items.map((item) => ({
              _id: item._id,
              mode: item.mode,

              updatedunitrate: Number(item.mrate),
              updatedsection: Number(item.mrate) * Number(item.unitflag) * Number(item.section),
            }));

            try {
              await axios.post(
                SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_UNITANDSECTION,
                {
                  updates: updatePayload,
                },
                {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },
                }
              );

              setupdatedIdsSection((prev) => [...prev, ...items]);
              // setIsSectionthreeall((prev) => [...prev, ...items]);

              // console.log( updatedIds,  "selectedTwoIds" );
            } catch (err) {
              handleApiError(err, setShowAlert, handleClickOpenerr);
            }
          }

          // Call the function to update data in bulk
          const validItems = ids.filter((item) => item.mrate !== undefined && item.unitflag !== undefined && item.section !== undefined);

          if (validItems.length > 0) {
            let buttonSelectValuesOnly = validItems.filter(d => d.mismatchmode.includes("Unit + Section"))
            if (buttonSelectValuesOnly.length > 0) {

              updateDataInBulk(buttonSelectValuesOnly)
                .then(() => {
                  setPopupContentMalert(validItems.length === ids.length ? "Alloted" : "Present unitrate value only updated");
                  setPopupSeverityMalert("info");
                  handleClickOpenPopupMalert();
                  setIsSectionthree("");
                })
                .catch((err) => {
                  handleApiError(err, setShowAlert, handleClickOpenerr);
                  setIsSectionthree("");
                });
            } else {

              setPopupContentMalert("Unit + Section mode is not present, No data to update");
              setPopupSeverityMalert("info");
              handleClickOpenPopupMalert();
              setIsSectionthree("");

            }

          } else {
            setIsSectionthree(false);
            setPopupContentMalert("Section not Present");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
          }
        } else {
          setIsSectionthree(false);

          setPopupContentMalert(ids.every((item) => item.section == undefined) ? "Section not Present" : "Please Update Unitrate");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();

        }
      } else {
        setIsSectionthree("");
        setPopupContentMalert("!Already Production Day Created");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }

    } catch (err) {

      setIsSectionthree(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //fourtable
  const handleClickAllotUpdateFour = async (ids, category, id) => {
    try {
      setIsunitflagfour(id);
      if (isProdDayCount === 0) {
        if (ids.some((item) => item.mrate != undefined && item.mrate != 0 && item.unitflag != undefined && item.unitflag != 0)) {
          async function updateDataInBulk(items) {
            const updatePayload = items.map((item) => ({
              _id: item._id,
              mode: item.mode,
              updatedflag: Number(item.unitflag),
              updatedunitrate: Number(item.mrate),
            }));

            try {
              await axios.post(
                SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_UNITANDFLAG,
                {
                  updates: updatePayload,
                },
                {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },
                }
              );
              // setIsunitflagfourall((prev) => [...prev, ...items]);
              setupdatedIds((prev) => [...prev, ...items]);
            } catch (err) {
              handleApiError(err, setShowAlert, handleClickOpenerr);
              setIsunitflagfour(false);
            }
          }

          // Call the function to update data in bulk
          const validItems = ids.filter((item) => item.mrate !== undefined && item.unitflag !== undefined);

          if (validItems.length > 0) {
            let buttonSelectValuesOnly = validItems.filter(d => d.mismatchmode.includes("Unit + Flag"))
            if (buttonSelectValuesOnly.length > 0) {

              updateDataInBulk(buttonSelectValuesOnly)
                .then(() => {

                  setPopupContentMalert(validItems.length === ids.length ? "Alloted" : "Present unitrate value only updated");
                  setPopupSeverityMalert("info");
                  handleClickOpenPopupMalert();
                  setIsunitflagfour("");
                })
                .catch((err) => {
                  handleApiError(err, setShowAlert, handleClickOpenerr);
                  setIsunitflagfour("");
                });
            } else {

              setPopupContentMalert("Unit + Flag mode is not present, No data to update");
              setPopupSeverityMalert("info");
              handleClickOpenPopupMalert();
              setIsunitflagfour("");


            }

          } else {
            setIsunitflagfour(false);
            setPopupContentMalert("Please Update Unitrate");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
          }
        } else {
          setIsunitflagfour(false);
          setPopupContentMalert("Please Update Unitrate");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
        }
      } else {
        setIsunitflagfour("");

        setPopupContentMalert("!Already Production Day Created");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }

    } catch (err) {
      setIsunitflagfour(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const handleClickUnitUpdateFour = async (ids, category, id) => {
    try {
      setIsUnitfour(id);
      if (isProdDayCount === 0) {
        if (ids.some((item) => item.mrate != undefined && item.mrate != 0)) {
          async function updateDataInBulk(items) {
            const updatePayload = items.map((item) => ({
              _id: item._id,
              mode: item.mode,

              updatedunitrate: Number(item.mrate),
            }));

            try {
              await axios.post(
                SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_UNITONLY,
                {
                  updates: updatePayload,
                },
                {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },
                }
              );
              // setIsUnitfourall((prev) => [...prev, ...items]);
              setupdatedIdsUnit((prev) => [...prev, ...items]);
              // console.log( updatedIds,  "selectedTwoIds" );
            } catch (err) {
              handleApiError(err, setShowAlert, handleClickOpenerr);
              setIsUnitfour(false);
            }
          }

          // Call the function to update data in bulk
          const validItems = ids.filter((item) => item.mrate !== undefined);

          if (validItems.length > 0) {

            let buttonSelectValuesOnly = validItems.filter(d => d.mismatchmode.includes("Unit"))
            if (buttonSelectValuesOnly.length > 0) {

              updateDataInBulk(buttonSelectValuesOnly)
                .then(() => {

                  setPopupContentMalert(validItems.length === ids.length ? "Unit Updated" : "Present unitrate value only updated");
                  setPopupSeverityMalert("info");
                  handleClickOpenPopupMalert();
                  setIsUnitfour(false);
                })
                .catch((err) => {
                  handleApiError(err, setShowAlert, handleClickOpenerr);
                  setIsUnitfour(false);
                });
            } else {

              setIsUnitfour("");
              setPopupContentMalert("Unit mode is not present, No data to update");
              setPopupSeverityMalert("info");
              handleClickOpenPopupMalert();
            }

          }
        } else {
          setIsUnitfour(false);
          setPopupContentMalert("Please Update Unitrate");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
        }
      } else {
        setIsUnitfour("");

        setPopupContentMalert("!Already Production Day Created");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    } catch (err) {
      setIsUnitfour(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const handleClickFlagUpdateFour = async (ids, category, id) => {
    try {
      setIsFlagfour(id);
      if (isProdDayCount === 0) {
        if (ids.some((item) => item.unitflag != undefined && item.unitflag != 0)) {
          async function updateDataInBulk(items) {
            const updatePayload = items.map((item) => ({
              _id: item._id,
              mode: item.mode,
              updatedflag: Number(item.unitflag),
            }));

            try {
              await axios.post(
                SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_FLAGONLY,
                {
                  updates: updatePayload,
                },
                {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },
                }
              );
              setupdatedIdsFlag((prev) => [...prev, ...items]);
            } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); setIsFlagfour(false); }
          }
          // Call the function to update data in bulk
          const validItems = ids.filter((item) => item.unitflag !== undefined);

          if (validItems.length > 0) {
            let buttonSelectValuesOnly = validItems.filter(d => d.mismatchmode.includes("Flag"))
            if (buttonSelectValuesOnly.length > 0) {

              updateDataInBulk(buttonSelectValuesOnly)
                .then(() => {

                  setPopupContentMalert(validItems.length === ids.length ? "Alloted" : "Present unitrate value only updated");
                  setPopupSeverityMalert("info");
                  handleClickOpenPopupMalert();
                  setIsFlagfour(false);
                })
                .catch((err) => {
                  handleApiError(err, setShowAlert, handleClickOpenerr);
                  setIsFlagfour(false);
                });
            } else {


              setPopupContentMalert("Flag mode is not present, No data to update");
              setPopupSeverityMalert("info");
              handleClickOpenPopupMalert();
              setIsFlagfour("");
            }
          }
        } else {
          setIsFlagfour(false);
          setPopupContentMalert("Please Update Unitrate");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
        }
      } else {
        setIsFlagfour("");
        setPopupContentMalert("!Already Production Day Created");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }

    } catch (err) {
      setIsFlagfour(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const handleClickSectionUpdateFour = async (ids, category, id) => {
    try {
      setIsSectionfour(id);
      if (isProdDayCount === 0) {
        if (ids.filter((item) => item.mrate != undefined && item.mrate != 0 && item.unitflag != undefined && item.unitflag != 0 && item.section !== undefined).length > 0) {
          async function updateDataInBulk(items) {
            const updatePayload = items.map((item) => ({
              _id: item._id,
              mode: item.mode,

              updatedunitrate: Number(item.mrate),
              updatedsection: Number(item.mrate) * Number(item.unitflag) * Number(item.section),
            }));

            try {
              await axios.post(
                SERVICE.PRODUCTION_UPLOAD_BULKUPDATE_UNITANDSECTION,
                {
                  updates: updatePayload,
                },
                {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },
                }
              );
              setupdatedIdsFlag((prev) => [...prev, ...items]);

              // console.log( updatedIds,  "selectedTwoIds" );
            } catch (err) {
              handleApiError(err, setShowAlert, handleClickOpenerr);
              setIsSectionfour("");
            }
          }

          // Call the function to update data in bulk
          const validItems = ids.filter((item) => item.mrate != undefined && item.mrate != 0 && item.unitflag != undefined && item.unitflag != 0 && item.section !== undefined);

          if (validItems.length > 0) {
            let buttonSelectValuesOnly = validItems.filter(d => d.mismatchmode.includes("Unit + Section"))
            if (buttonSelectValuesOnly.length > 0) {

              updateDataInBulk(buttonSelectValuesOnly)
                .then(() => {

                  setPopupContentMalert(validItems.length === ids.length ? "Alloted" : "Present unitrate value only updated");
                  setPopupSeverityMalert("info");
                  handleClickOpenPopupMalert();

                  setIsSectionfour("");
                })
                .catch((err) => {
                  handleApiError(err, setShowAlert, handleClickOpenerr);
                  setIsSectionfour("");
                });
            } else {

              setPopupContentMalert("Unit + Section mode is not present, No data to update");
              setPopupSeverityMalert("info");
              handleClickOpenPopupMalert();

              setIsSectionfour("");
            }

          } else {
            setIsSectionfour(false);
            setPopupContentMalert("Section not Present");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
          }
        } else {
          setIsSectionfour(false);
          setPopupContentMalert("Please Update Unitrate");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
        }
      } else {
        setIsSectionfour("");

        setPopupContentMalert("!Already Production Day Created");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    } catch (err) {
      setIsSectionthree(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // fifth table
  const handleClickUpdateAllotFive = async (e, data, ids) => {
    e.preventDefault();

    try {
      setIsunitflagfive(id);
      if (isProdDayCount === 0) {
        if (data.unitflag !== undefined && data.mrate !== undefined) {
          if (data.mode === "Manual") {
            await axios.put(`${SERVICE.PRODUCTION_INDIVIDUAL_SINGLE}/${data._id}`, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              updatedflag: String(data.unitflag),
              updatedunitrate: Number(data.mrate) * Number(data.unitflag),
            });
          } else {
            await axios.put(`${SERVICE.PRODUCTION_UPLOAD_SINGLE}/${data._id}`, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              updatedflag: String(data.unitflag),
              updatedunitrate: Number(data.mrate) * Number(data.unitflag),
            });
          }

          setIsunitflagfive(false);
          setupdatedIds((prev) => [...prev, ...ids]);

          setPopupContent("UnitRate & Flag Updated");
          setPopupSeverity("success");
          handleClickOpenPopup();
        } else {
          setIsunitflagfive(false);
          setPopupContentMalert("Please Update Unitrate");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
        }
      } else {
        setIsunitflagfive("");

        setPopupContentMalert("!Already Production Day Created");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    } catch (err) {
      setIsunitflagfive(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const handleClickUnitUpdateFive = async (e, data, ids) => {
    try {
      setIsUnitfive(id);
      if (isProdDayCount === 0) {
        if (data.mrate !== undefined) {
          // await axios.put(`${SERVICE.PRODUCTION_UPLOAD_SINGLE}/${data._id}`, {
          //   headers: {
          //     Authorization: `Bearer ${auth.APIToken}`,
          //   },

          //   updatedunitrate: Number(data.mrate),
          // });
          if (data.mode === "Manual") {
            await axios.put(`${SERVICE.PRODUCTION_INDIVIDUAL_SINGLE}/${data._id}`, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              updatedunitrate: Number(data.mrate),
            });
          } else {
            await axios.put(`${SERVICE.PRODUCTION_UPLOAD_SINGLE}/${data._id}`, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              updatedunitrate: Number(data.mrate),
            });
          }
          setIsUnitfive(false);
          setupdatedIdsUnit((prev) => [...prev, ...ids]);

          setPopupContent("Unit Updated");
          setPopupSeverity("success");
          handleClickOpenPopup();
        } else {
          setIsUnitfive(false);
          setPopupContentMalert("Please Update Unitrate");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
        }
      } else {
        setIsUnitfive("");
        setPopupContentMalert("!Already Production Day Created");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    } catch (err) {
      setIsUnitfive(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const handleClickFlagUpdateFive = async (e, data, ids) => {
    try {
      setIsFlagfive(id);
      if (isProdDayCount === 0) {
        if (data.unitflag !== undefined) {

          if (data.mode === "Manual") {
            await axios.put(`${SERVICE.PRODUCTION_INDIVIDUAL_SINGLE}/${data._id}`, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              updatedflag: String(data.unitflag),
            });
          } else {
            await axios.put(`${SERVICE.PRODUCTION_UPLOAD_SINGLE}/${data._id}`, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              updatedflag: String(data.unitflag),
            });
          }
          setIsFlagfive(false);
          setupdatedIdsFlag((prev) => [...prev, ...ids]);

          setPopupContent("Flag Updated");
          setPopupSeverity("success");
          handleClickOpenPopup();
        } else {
          setIsFlagfive(false);
          setPopupContentMalert("Please Update Unitrate");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
        }
      } else {
        setIsunitflagone("");
        setPopupContentMalert("!Already Production Day Created");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    } catch (err) {
      setIsFlagfive(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const handleClickSectionUpdateFive = async (e, data, ids) => {
    try {
      setIsSectionfive(id);
      if (isProdDayCount === 0) {
        if (data.section !== undefined) {
          if (data.unitflag !== undefined && data.mrate !== undefined) {
            // await axios.put(`${SERVICE.PRODUCTION_UPLOAD_SINGLE}/${data._id}`, {
            //   headers: {
            //     Authorization: `Bearer ${auth.APIToken}`,
            //   },

            //   updatedunitrate: Number(data.mrate) * Number(data.flagcount),
            //   updatedsection: (Number(data.mrate) * Number(data.flagcount)) * data.section,
            // });
            if (data.mode === "Manual") {
              await axios.put(`${SERVICE.PRODUCTION_INDIVIDUAL_SINGLE}/${data._id}`, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
                updatedunitrate: Number(data.mrate) * Number(data.flagcount),
                updatedsection: Number(data.mrate) * Number(data.flagcount) * data.section,
              });
            } else {
              await axios.put(`${SERVICE.PRODUCTION_UPLOAD_SINGLE}/${data._id}`, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
                updatedunitrate: Number(data.mrate) * Number(data.flagcount),
                updatedsection: Number(data.mrate) * Number(data.flagcount) * data.section,
              });
            }

            setPopupContent("Section Updated");
            setPopupSeverity("success");
            handleClickOpenPopup();

            setIsSectionfive("");
            setupdatedIdsSection((prev) => [...prev, ...ids]);
          } else {
            setIsSectionfive("");
            setPopupContentMalert("Please Update Unitrate");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
          }
        } else {
          setIsSectionfive("");
          setPopupContentMalert("Section not Present");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
        }
      } else {
        setIsunitflagone("");
        setPopupContentMalert("!Already Production Day Created");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }

    } catch (err) {
      setIsSectionfive("");
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // Excel
  const fileName = "Production Unmatch Unit";
  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Production Unmatch Unit",
    pageStyle: "print",
  });

  //print...
  const componentRefTwo = useRef();
  const handleprintTwo = useReactToPrint({
    content: () => componentRefTwo.current,
    documentTitle: "Production Unmatch Unit",
    pageStyle: "print",
  });

  //print...
  const componentRefThree = useRef();
  const handleprintThree = useReactToPrint({
    content: () => componentRefThree.current,
    documentTitle: "Production Unmatch Unit",
    pageStyle: "print",
  });

  //print...
  const componentRefFour = useRef();
  const handleprintFour = useReactToPrint({
    content: () => componentRefFour.current,
    documentTitle: "Production Unmatch Unit",
    pageStyle: "print",
  });

  //print...
  const componentRefFive = useRef();
  const handleprintFive = useReactToPrint({
    content: () => componentRefFive.current,
    documentTitle: "Production Unmatch Unit",
    pageStyle: "print",
  });

  //print...
  const componentRefAllList = useRef();
  const handleprintAllList = useReactToPrint({
    content: () => componentRefAllList.current,
    documentTitle: "Production All List",
    pageStyle: "print",
  });
  //print...
  const componentRefUpdatedList = useRef();
  const handleprintUpdatedList = useReactToPrint({
    content: () => componentRefUpdatedList.current,
    documentTitle: "Production Updated List",
    pageStyle: "print",
  });

  //id for login...
  let loginid = localStorage.LoginUserId;
  let authToken = localStorage.APIToken;

  useEffect(() => {
    fetchProjMaster();
    fetchAllCategory();
    fetchEmployees();
    // fetchIdentifierList();
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
    const itemsWithSerialNumber = uniqueDates?.map((item, index) => ({ ...item, serialNumber: index + 1, id: index }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [uniqueDates]);

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
    return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(filteredDatas.length / pageSize);

  const visiblePages = Math.min(totalPages, 3);

  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

  const pageNumbers = [];

  const indexOfLastItem = page * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;

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
      width: 90,

      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 90,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    // { field: "project", headerName: "Project", flex: 0, width: 100, hide: !columnVisibility.project, headerClassName: "bold-header" },
    { field: "date", headerName: "Date", flex: 0, width: 130, hide: !columnVisibility.date, headerClassName: "bold-header" },
    { field: "count", headerName: "Count", flex: 0, width: 120, hide: !columnVisibility.count, headerClassName: "bold-header" },
    // { field: "totime", headerName: "To Time", flex: 0, width: 100, hide: !columnVisibility.totime, headerClassName: "bold-header" },
    // { field: "category", headerName: "Category", flex: 0, width: 130, hide: !columnVisibility.category, headerClassName: "bold-header" },
    // { field: "subcategory", headerName: "Sub Category", flex: 0, width: 130, hide: !columnVisibility.subcategory, headerClassName: "bold-header" },
    // { field: "projectvendor", headerName: "Project Vendor", flex: 0, width: 130, hide: !columnVisibility.projectvendor, headerClassName: "bold-header" },
    // { field: "employee", headerName: "Employee", flex: 0, width: 100, hide: !columnVisibility.employee, headerClassName: "bold-header" },
    // { field: "login", headerName: "Login", flex: 0, width: 100, hide: !columnVisibility.login, headerClassName: "bold-header" },
    // { field: "identifierclick", headerName: "Identifier Click", flex: 0, width: 100, hide: !columnVisibility.identifierclick, headerClassName: "bold-header" },

    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 700,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex", gap: "10px" }}>
          {isUserRoleCompare?.includes("ioriginalmismatch") && (
            <LoadingButton
              onClick={() => handleClickAllotUpdateFirst(params.row.ids, params.row.categories, params.row.id)}
              loading={isunitflagone === params.row.id}
              color="primary"
              size="small"
              disabled={updatedIds.length > 0 && updatedIds.map((d) => d._id).includes(params.row.id)}
              sx={{ textTransform: "capitalize", border: updatedIds.length > 0 && updatedIds.map((d) => d._id).includes(params.row.id) ? "2px solid #1976d2" : "", fontSize: updatedIds.length > 0 && updatedIds.map((d) => d._id).includes(params.row.id) ? "smaller" : "0.8125rem", padding: updatedIds.length > 0 && updatedIds.map((d) => d._id).includes(params.row.id) ? "2px" : "4px 10px", color: updatedIds.length > 0 && updatedIds.map((d) => d._id).includes(params.row.id) ? "#000000c7 !important" : "white" }}
              loadingPosition="end"
              variant="contained"
            >
              {updatedIds.map((d) => d._id).includes(params.row.id) ? "Updated Unit+Flag" : "Unit + Flag"}
            </LoadingButton>
          )}

          {isUserRoleCompare?.includes("ioriginalmismatch") && (
            <LoadingButton
              onClick={(e) => {
                handleClickUnitUpdateFirst(params.row.ids, params.row.categories, params.row.id);
              }}
              loading={isUnitone === params.row.id}
              color="primary"
              size="small"
              // sx={{ textTransform: "capitalize" }}
              disabled={updatedIdsUnit.length > 0 && updatedIdsUnit.map((d) => d._id).includes(params.row.id)}
              sx={{ textTransform: "capitalize", border: updatedIdsUnit.length > 0 && updatedIdsUnit.map((d) => d._id).includes(params.row.id) ? "2px solid #1976d2" : "", fontSize: updatedIdsUnit.length > 0 && updatedIdsUnit.map((d) => d._id).includes(params.row.id) ? "smaller" : "0.8125rem", padding: updatedIdsUnit.length > 0 && updatedIdsUnit.map((d) => d._id).includes(params.row.id) ? "2px" : "4px 10px", color: updatedIdsUnit.length > 0 && updatedIdsUnit.map((d) => d._id).includes(params.row.id) ? "#000000c7 !important" : "white" }}
              loadingPosition="end"
              variant="contained"
            >
              {updatedIdsUnit.map((d) => d._id).includes(params.row.id) ? "Unit Updated" : "Unit"}
            </LoadingButton>
          )}

          {isUserRoleCompare?.includes("ioriginalmismatch") && (
            <LoadingButton
              onClick={(e) => {
                handleClickFlagUpdateFirst(params.row.ids, params.row.categories, params.row.id);
              }}
              loading={isFlagone === params.row.id}
              color="primary"
              size="small"
              disabled={updatedIdsFlag.length > 0 && updatedIdsFlag.map((d) => d._id).includes(params.row.id)}
              sx={{ textTransform: "capitalize", border: updatedIdsFlag.length > 0 && updatedIdsFlag.map((d) => d._id).includes(params.row.id) ? "2px solid #1976d2" : "", fontSize: updatedIdsFlag.length > 0 && updatedIdsFlag.map((d) => d._id).includes(params.row.id) ? "smaller" : "0.8125rem", padding: updatedIdsFlag.length > 0 && updatedIdsFlag.map((d) => d._id).includes(params.row.id) ? "2px" : "4px 10px", color: updatedIdsFlag.length > 0 && updatedIdsFlag.map((d) => d._id).includes(params.row.id) ? "#000000c7 !important" : "white" }}
              loadingPosition="end"
              variant="contained"
            >
              {updatedIdsFlag.map((d) => d._id).includes(params.row.id) ? "Flag Updated" : "Flag"}
            </LoadingButton>
          )}

          {isUserRoleCompare?.includes("ioriginalmismatch") && (
            <LoadingButton
              onClick={(e) => {
                handleClickSectionUpdateFirst(params.row.ids, params.row.categories, params.row.id);
              }}
              loading={isSectionone === params.row.id}
              color="primary"
              size="small"
              disabled={updatedIdsSection.length > 0 && updatedIdsSection.map((d) => d._id).includes(params.row.id)}
              sx={{ textTransform: "capitalize", border: updatedIdsSection.length > 0 && updatedIdsSection.map((d) => d._id).includes(params.row.id) ? "2px solid #1976d2" : "", fontSize: updatedIdsSection.length > 0 && updatedIdsSection.map((d) => d._id).includes(params.row.id) ? "smaller" : "0.8125rem", padding: updatedIdsSection.length > 0 && updatedIdsSection.map((d) => d._id).includes(params.row.id) ? "2px" : "4px 10px", color: updatedIdsSection.length > 0 && updatedIdsSection.map((d) => d._id).includes(params.row.id) ? "#000000c7 !important" : "white" }}
              loadingPosition="end"
              variant="contained"
            >
              {updatedIdsSection.map((d) => d._id).includes(params.row.id) ? "Section Updated" : "Section"}
            </LoadingButton>
          )}

          {isUserRoleCompare?.includes("voriginalmismatch") && (
            <Button
              size="small"
              sx={{
                textTransform: "capitalize",
                backgroundColor: "#007F73", // Change background color to aqua
                color: "#fff", // Change text color to contrast with the background
                "&:hover": {
                  // Note the use of "&:hover" instead of "&.hover"
                  backgroundColor: "#055f56",
                },
              }}
              onClick={() => {
                // handleClickOpenview();
                setTableCount(2);
                getviewCode(params.row);
              }}
            // variant="contained"
            >
              View
            </Button>
          )}
        </Grid>
      ),
    },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item.id,
      serialNumber: item.serialNumber,
      date: item.date,
      ids: item.ids,
      categories: item.categories,
      mismatchmode: item.mismatchmode,
      count: item.count,
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
    <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
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
  return (
    <Box>
      <Headtitle title={"ORIGINAL MISMATCH"} />
      {/* ****** Header Content ****** */}

      <PageHeading
        title=" Production Unmatch Unit"
        modulename="Production"
        submodulename="Upload"
        mainpagename="Original"
        subpagename="Original Mismatch"
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("aoriginalmismatch") && (
        <>
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container >
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>Add Production Unmatch Unit</Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={4}>
                  <FormControl fullWidth size="small">
                    <Typography>Project<b style={{ color: "red" }}>*</b></Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={projectOpt}
                      value={{ label: overallState.project, value: overallState.project }}
                      onChange={(e) => {
                        setOverallState({
                          ...overallState,
                          project: e.value,
                          projectvendor: "Please Select Project Vendor",
                        });
                        setOverallState((prev) => ({
                          ...prev,
                          category: "Please Select Category",
                          subcategory: "Please Select Sub Category",
                        }));
                        fetchVendor(e);
                        // setVendormasterOpt([])
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={4}>
                  <FormControl fullWidth size="small">
                    <Typography>Date <b style={{ color: "red" }}>*</b></Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="date"
                      value={overallState.date}
                      onChange={(e) => {
                        setOverallState({
                          ...overallState,
                          date: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={1.5} xs={6} sm={2}>
                  <Typography>From Time</Typography>
                  <Space wrap>
                    <TimePicker use12Hours format="h:mm:ss A" size="large" value={overallState.fromtime} defaultValue={dayjs("00:00:00", "HH:mm:ss a")} onChange={handleTimeChange} allowClear={false} />
                  </Space>
                </Grid>
                <Grid item md={1.5} xs={6} sm={2}>
                  <Typography>To Time</Typography>
                  <Space wrap>
                    <TimePicker use12Hours format="h:mm:ss A" size="large" value={overallState.totime} defaultValue={dayjs("00:00:00", "HH:mm:ss a")} onChange={handleToTimeChange} allowClear={false} />
                  </Space>
                </Grid>
                <Grid item md={3} sm={4} xs={12} marginTop={3}>
                  <Grid sx={{ display: "flex", justifyContent: "flex-start", }}>
                    <Button
                      variant="contained"
                      onClick={(e) => {
                        handleUnmatchSubmit(e);
                      }}
                    >
                      Un Match
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <br />
              <Divider />
              <br />
              <Grid container spacing={2} >
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Category</Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={Array.from(new Set(categoryOpt.filter((item) => item.project === overallState.project).map((pro) => pro.name))).map((d) => ({
                        label: d,
                        value: d,
                      }))}
                      placeholder="Please Select Category"
                      value={{ label: overallState.category, value: overallState.category }}
                      onChange={(e) => {
                        setOverallState((prev) => ({
                          ...prev,
                          category: e.value,
                          subcategory: "Please Select Sub Category",
                          identifier: "Please Select Identifier",
                          login: "Please Select Login",
                        }));
                        handleCategoryChange(e);
                        setIdentifierClick(true);
                        setLoginClick(false);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Sub Category</Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={subcategory}
                      placeholder="Please Select Project Name"
                      value={{ label: overallState.subcategory, value: overallState.subcategory }}
                      onChange={(e) => {
                        setOverallState((prev) => ({
                          ...prev,
                          subcategory: e.value,
                          identifier: "Please Select Identifier",
                          login: "Please Select Login",
                        }));
                        setIdentifierClick(true);
                        setLoginClick(true);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Project Vendor</Typography>
                    <Selects
                      maxMenuHeight={300}
                      // options={vendors}
                      options={Array.from(new Set(vendors.filter((item) => item.projectname === overallState.project).map((pro) => pro.name))).map((d) => ({
                        label: d,
                        value: d,
                      }))}
                      placeholder="Please Select Project Name"
                      value={{ label: overallState.projectvendor, value: overallState.projectvendor }}
                      onChange={(e) => {
                        setOverallState((prev) => ({
                          ...prev,
                          projectvendor: e.value,
                        }));
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Employee</Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={loginClick === false && identifierClick === false && overallState.login != "Please Select Login" && overallState.login != "Please Select Identifier" ? clientids.filter((d) => loginAllotFilter.map((data) => data.value).includes(d.user)).map((item) => ({ label: item.empname, value: item.empname })) : loginClick === false && overallState.login !== "Please Select Login" ? employees : loginClick === false && overallState.login === "Please Select Login" ? employees : loginClick === false && overallState.login !== "Please Select Login" ? employees : employees}
                      placeholder="Please Select Project Name"
                      value={{ label: overallState.employee, value: overallState.employee }}
                      onChange={(e) => {
                        setOverallState((prev) => ({
                          ...prev,
                          employee: e.value,
                        }));
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography onClick={() => fetchLoginList()} sx={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}>
                      Login
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={loginAllotFilter}
                      isDisabled={loginClick}
                      value={{ label: overallState.login, value: overallState.login }}
                      onChange={(e) => {
                        setOverallState((prev) => ({
                          ...prev,
                          login: e.value,
                          identifier: "Please Select Identifier",
                        }));
                        setIdentifierList([]);
                        setIdentifierClick(true);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography onClick={() => fetchIdentifierList()} sx={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}>
                      Identifier Click
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={identifierList}
                      isDisabled={identifierClick}
                      value={{ label: overallState.identifier, value: overallState.identifier }}
                      onChange={(e) => {
                        setOverallState((prev) => ({
                          ...prev,
                          identifier: e.value,
                        }));
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={6} xs={12} marginTop={3}>
                  <Grid sx={{ display: "flex", justifyContent: "flex-start", gap: "15px" }}>
                    <Button variant="contained" onClick={(e) => { handleSubmit(); }} >  All  </Button>
                    <Button sx={userStyle.btncancel} onClick={handleClear}>  CLEAR</Button>
                  </Grid>
                </Grid>
              </Grid>
            </>
          </Box>
        </>
      )}

      <br />
      {tableCount === 1 ? (
        <>
          {/*----------First Table----------------------------------------------------------------------------------------------------------------- */}
          {/* ****** Table Start ****** */}
          {isUserRoleCompare?.includes("loriginalmismatch") && (

            <Box sx={userStyle.container}>
              {/* ******************************************************EXPORT Buttons****************************************************** */}
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>Production Unmatch Unit List 1</Typography>
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
                      <MenuItem value={uniqueDates?.length}>All</MenuItem>
                    </Select>
                  </Box>
                </Grid>
                <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Box>
                    {isUserRoleCompare?.includes("exceloriginalmismatch") && (
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
                    {isUserRoleCompare?.includes("csvoriginalmismatch") && (
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
                    {isUserRoleCompare?.includes("printoriginalmismatch") && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("pdforiginalmismatch") && (
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
                    {isUserRoleCompare?.includes("imageoriginalmismatch") && (
                      <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                        {" "}
                        <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                      </Button>
                    )}
                  </Box>
                </Grid>
                <Grid item md={2} xs={6} sm={6}>
                  <Box>
                    <FormControl fullWidth size="small">
                      <Typography>Search</Typography>
                      <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
                    </FormControl>
                  </Box>
                </Grid>
              </Grid>
              <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                Show All Columns
              </Button>
              &ensp;
              <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
                Manage Columns
              </Button>
              &ensp;
              <br />
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
              {sourceCheck ? (
                <>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    {/* <CircularProgress color="inherit" />  */}
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
                    <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowsWithCheckboxes} columns={columnDataTable.filter((column) => columnVisibility[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true} ref={gridRef} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
                  </Box>
                  <Box style={userStyle.dataTablestyle}>
                    <Box>
                      Showing {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filteredDatas.length)} of {filteredDatas.length} entries
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
                </>
              )}
            </Box>

          )}
        </>
      ) : (
        <>
          {tableCount === 2 ? (
            <>
              {/*----------Second Table----------------------------------------------------------------------------------------------------------------- */}
              {/* ****** Table Start ****** */}
              {isUserRoleCompare?.includes("loriginalmismatch") && (
                <>
                  <Box sx={userStyle.container}>
                    {/* ******************************************************EXPORT Buttons****************************************************** */}
                    <Grid item xs={8} sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography sx={userStyle.importheadtext}>Production Unmatch Unit List 2 </Typography>
                      <Button
                        variant="contained"
                        onClick={() => {
                          setTableCount(1);
                        }}
                      >
                        Back
                      </Button>
                    </Grid>

                    <Grid container spacing={2} style={userStyle.dataTablestyle}>
                      <Grid item md={2} xs={12} sm={12}>
                        <Box>
                          <label>Show entries:</label>
                          <Select
                            id="pageSizeSelect"
                            value={pageSizeTwo}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 180,
                                  width: 80,
                                },
                              },
                            }}
                            onChange={handlePageSizeChangeTwo}
                            sx={{ width: "77px" }}
                          >
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={25}>25</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                            <MenuItem value={100}>100</MenuItem>
                            <MenuItem value={tableTwoDatas?.length}>All</MenuItem>
                          </Select>
                        </Box>
                      </Grid>
                      <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Box>
                          {isUserRoleCompare?.includes("exceloriginalmismatch") && (
                            <>
                              <Button
                                onClick={(e) => {
                                  setIsFilterOpenTwo(true);
                                  setFormat("xl");
                                }}
                                sx={userStyle.buttongrp}
                              >
                                <FaFileExcel />
                                &ensp;Export to Excel&ensp;
                              </Button>
                            </>
                          )}
                          {isUserRoleCompare?.includes("csvoriginalmismatch") && (
                            <>
                              <Button
                                onClick={(e) => {
                                  setIsFilterOpenTwo(true);
                                  setFormat("csv");
                                }}
                                sx={userStyle.buttongrp}
                              >
                                <FaFileCsv />
                                &ensp;Export to CSV&ensp;
                              </Button>
                            </>
                          )}
                          {isUserRoleCompare?.includes("printoriginalmismatch") && (
                            <>
                              <Button sx={userStyle.buttongrp} onClick={handleprintTwo}>
                                &ensp;
                                <FaPrint />
                                &ensp;Print&ensp;
                              </Button>
                            </>
                          )}
                          {isUserRoleCompare?.includes("pdforiginalmismatch") && (
                            <>
                              <Button
                                sx={userStyle.buttongrp}
                                onClick={() => {
                                  setIsPdfFilterOpenTwo(true);
                                }}
                              >
                                <FaFilePdf />
                                &ensp;Export to PDF&ensp;
                              </Button>
                            </>
                          )}
                          {isUserRoleCompare?.includes("imageoriginalmismatch") && (
                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImageTwo}>
                              {" "}
                              <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                            </Button>
                          )}
                        </Box>
                      </Grid>
                      <Grid item md={2} xs={6} sm={6}>
                        <Box>
                          <FormControl fullWidth size="small">
                            <Typography>Search</Typography>
                            <OutlinedInput id="component-outlined" type="text" value={searchQueryTwo} onChange={handleSearchChangeTwo} />
                          </FormControl>
                        </Box>
                      </Grid>
                    </Grid>

                    <Grid container spacing={1}>
                      <Grid item md={2.5} xs={12} sm={5}>
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsTwo}>
                          Show All Columns
                        </Button>
                        &ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsTwo}>
                          Manage Columns
                        </Button>
                      </Grid>
                      <Grid item md={2} xs={4} sm={8}>
                        <FormControl fullWidth size="small">
                          <Selects
                            maxMenuHeight={250}
                            options={misMatchModeOpt}
                            value={{ label: mismatchmode, value: mismatchmode }}
                            onChange={(e) => {
                              setMismatchmode(e.value);
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={2} xs={2} sm={2}>

                        <LoadingButton
                          onClick={(e) => handleBulkUpdateTwo()}
                          loading={isBulkUpdateTwo}
                          color="primary"
                          // size="small"
                          // sx={{ textTransform: "capitalize" }}
                          loadingPosition="end"
                          variant="contained"
                        >
                          {" "}
                          Bulk Update
                        </LoadingButton>
                      </Grid>
                    </Grid>

                    {tableTwo ? (
                      <>
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          {/* <CircularProgress color="inherit" />  */}
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
                          <StyledDataGrid1 onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowDataTableTwo} columns={columnDataTableTwo.filter((column) => columnVisibilityTwo[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true} ref={gridRefTwo} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
                        </Box>
                        <Box style={userStyle.dataTablestyle}>
                          <Box>
                            Showing {filteredDataTwo.length > 0 ? (pageTwo - 1) * pageSizeTwo + 1 : 0} to {Math.min(pageTwo * pageSizeTwo, filteredDataTwos.length)} of {filteredDataTwos.length} entries
                          </Box>
                          <Box>
                            <Button onClick={() => setPageTwo(1)} disabled={pageTwo === 1} sx={userStyle.paginationbtn}>
                              <FirstPageIcon />
                            </Button>
                            <Button onClick={() => handlePageChangeTwo(pageTwo - 1)} disabled={pageTwo === 1} sx={userStyle.paginationbtn}>
                              <NavigateBeforeIcon />
                            </Button>
                            {pageNumbersTwo?.map((pageNumber) => (
                              <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChangeTwo(pageNumber)} className={pageTwo === pageNumber ? "active" : ""} disabled={pageTwo === pageNumber}>
                                {pageNumber}
                              </Button>
                            ))}
                            {lastVisiblePageTwo < totalPagesTwo && <span>...</span>}
                            <Button onClick={() => handlePageChangeTwo(pageTwo + 1)} disabled={pageTwo === totalPagesTwo} sx={userStyle.paginationbtn}>
                              <NavigateNextIcon />
                            </Button>
                            <Button onClick={() => setPageTwo(totalPagesTwo)} disabled={pageTwo === totalPagesTwo} sx={userStyle.paginationbtn}>
                              <LastPageIcon />
                            </Button>
                          </Box>
                        </Box>
                      </>
                    )}
                  </Box>
                </>
              )}
              {/* Manage Column */}
              <Popover
                id={idTwo}
                open={isManageColumnsOpenTwo}
                anchorEl={anchorElTwo}
                onClose={handleCloseManageColumnsTwo}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                {manageColumnsContentTwo}
              </Popover>
              <br />
            </>
          ) : (
            <>
              {tableCount === 3 ? (
                <>
                  {/*----------Third Table----------------------------------------------------------------------------------------------------------------- */}
                  {/* ****** Table Start ****** */}
                  {isUserRoleCompare?.includes("loriginalmismatch") && (
                    <>
                      <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8} sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography sx={userStyle.importheadtext}>Production Unmatch Unit List 3 </Typography>
                          <Button
                            variant="contained"
                            onClick={() => {
                              setTableCount(2);
                            }}
                          >
                            Back
                          </Button>
                        </Grid>

                        <Grid container spacing={2} style={userStyle.dataTablestyle}>
                          <Grid item md={2} xs={12} sm={12}>
                            <Box>
                              <label>Show entries:</label>
                              <Select
                                id="pageSizeSelect"
                                value={pageSizeThree}
                                MenuProps={{
                                  PaperProps: {
                                    style: {
                                      maxHeight: 180,
                                      width: 80,
                                    },
                                  },
                                }}
                                onChange={handlePageSizeChangeThree}
                                sx={{ width: "77px" }}
                              >
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={25}>25</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                                <MenuItem value={100}>100</MenuItem>
                                <MenuItem value={tableThreeDatas?.length}>All</MenuItem>
                              </Select>
                            </Box>
                          </Grid>
                          <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Box>
                              {isUserRoleCompare?.includes("exceloriginalmismatch") && (
                                <>
                                  <Button
                                    onClick={(e) => {
                                      setIsFilterOpenThree(true);
                                      setFormat("xl");
                                    }}
                                    sx={userStyle.buttongrp}
                                  >
                                    <FaFileExcel />
                                    &ensp;Export to Excel&ensp;
                                  </Button>
                                </>
                              )}
                              {isUserRoleCompare?.includes("csvoriginalmismatch") && (
                                <>
                                  <Button
                                    onClick={(e) => {
                                      setIsFilterOpenThree(true);
                                      setFormat("csv");
                                    }}
                                    sx={userStyle.buttongrp}
                                  >
                                    <FaFileCsv />
                                    &ensp;Export to CSV&ensp;
                                  </Button>
                                </>
                              )}
                              {isUserRoleCompare?.includes("printoriginalmismatch") && (
                                <>
                                  <Button sx={userStyle.buttongrp} onClick={handleprintThree}>
                                    &ensp;
                                    <FaPrint />
                                    &ensp;Print&ensp;
                                  </Button>
                                </>
                              )}
                              {isUserRoleCompare?.includes("pdforiginalmismatch") && (
                                <>
                                  <Button
                                    sx={userStyle.buttongrp}
                                    onClick={() => {
                                      setIsPdfFilterOpenThree(true);
                                    }}
                                  >
                                    <FaFilePdf />
                                    &ensp;Export to PDF&ensp;
                                  </Button>
                                </>
                              )}
                              {isUserRoleCompare?.includes("imageoriginalmismatch") && (
                                <Button
                                  sx={userStyle.buttongrp}
                                  onClick={() => {
                                    setIsPdfFilterOpenThree(true);
                                  }}
                                >
                                  <FaFilePdf />
                                  &ensp;Export to PDF&ensp;
                                </Button>
                              )}
                            </Box>
                          </Grid>
                          <Grid item md={2} xs={6} sm={6}>
                            <Box>
                              <FormControl fullWidth size="small">
                                <Typography>Search</Typography>
                                <OutlinedInput id="component-outlined" type="text" value={searchQueryThree} onChange={handleSearchChangeThree} />
                              </FormControl>
                            </Box>
                          </Grid>
                        </Grid>

                        <Grid container spacing={1}>
                          <Grid item md={2.5} xs={12} sm={5}>
                            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsThree}>
                              Show All Columns
                            </Button>
                            &ensp;
                            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsThree}>
                              Manage Columns
                            </Button>
                          </Grid>
                          <Grid item md={2} xs={4} sm={8}>
                            <FormControl fullWidth size="small">
                              <Selects
                                maxMenuHeight={250}
                                options={misMatchModeOpt}
                                value={{ label: mismatchmodeThree, value: mismatchmodeThree }}
                                onChange={(e) => {
                                  setMismatchmodeThree(e.value);
                                }}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={2} xs={2} sm={2}>
                            {/* <Button variant="contained" onClick={(e) => handleBulkUpdateTwo()}>
                            Submit
                          </Button> */}
                            <LoadingButton
                              onClick={(e) => handleBulkUpdateThree()}
                              loading={isBulkUpdateThree}
                              color="primary"
                              // size="small"
                              // sx={{ textTransform: "capitalize" }}
                              loadingPosition="end"
                              variant="contained"
                            >
                              {" "}
                              Bulk Update
                            </LoadingButton>
                          </Grid>
                        </Grid>

                        {!tableThree ? (
                          <>
                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                              {/* <CircularProgress color="inherit" />  */}
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
                              <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowDataTableThree} columns={columnDataTableThree.filter((column) => columnVisibilityThree[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true} ref={gridRefThree} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
                            </Box>
                            <Box style={userStyle.dataTablestyle}>
                              <Box>
                                Showing {filteredDataThree.length > 0 ? (pageThree - 1) * pageSizeThree + 1 : 0} to {Math.min(pageThree * pageSizeThree, filteredDataThrees.length)} of {filteredDataThrees.length} entries
                              </Box>
                              <Box>
                                <Button onClick={() => setPageThree(1)} disabled={pageThree === 1} sx={userStyle.paginationbtn}>
                                  <FirstPageIcon />
                                </Button>
                                <Button onClick={() => handlePageChangeThree(pageThree - 1)} disabled={pageThree === 1} sx={userStyle.paginationbtn}>
                                  <NavigateBeforeIcon />
                                </Button>
                                {pageNumbersThree?.map((pageNumber) => (
                                  <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChangeThree(pageNumber)} className={pageThree === pageNumber ? "active" : ""} disabled={pageThree === pageNumber}>
                                    {pageNumber}
                                  </Button>
                                ))}
                                {lastVisiblePageThree < totalPagesThree && <span>...</span>}
                                <Button onClick={() => handlePageChangeThree(pageThree + 1)} disabled={pageThree === totalPagesThree} sx={userStyle.paginationbtn}>
                                  <NavigateNextIcon />
                                </Button>
                                <Button onClick={() => setPageThree(totalPagesThree)} disabled={pageThree === totalPagesThree} sx={userStyle.paginationbtn}>
                                  <LastPageIcon />
                                </Button>
                              </Box>
                            </Box>
                          </>
                        )}
                      </Box>
                    </>
                  )}
                  {/* Manage Column */}
                  <Popover
                    id={idThree}
                    open={isManageColumnsOpenThree}
                    anchorEl={anchorElThree}
                    onClose={handleCloseManageColumnsThree}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                  >
                    {manageColumnsContentThree}
                  </Popover>
                  <br />
                </>
              ) : (
                <>
                  {tableCount === 4 ? (
                    <>
                      {/*----------Fourth Table----------------------------------------------------------------------------------------------------------------- */}
                      {/* ****** Table Start ****** */}
                      {isUserRoleCompare?.includes("loriginalmismatch") && (
                        <>
                          <Box sx={userStyle.container}>
                            {/* ******************************************************EXPORT Buttons****************************************************** */}
                            <Grid item xs={8} sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography sx={userStyle.importheadtext}>Production Unmatch Unit List 4 </Typography>
                              <Button
                                variant="contained"
                                onClick={() => {
                                  setTableCount(3);
                                }}
                              >
                                Back
                              </Button>
                            </Grid>

                            <Grid container spacing={2} style={userStyle.dataTablestyle}>
                              <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                  <label>Show entries:</label>
                                  <Select
                                    id="pageSizeSelect"
                                    value={pageSizeFour}
                                    MenuProps={{
                                      PaperProps: {
                                        style: {
                                          maxHeight: 180,
                                          width: 80,
                                        },
                                      },
                                    }}
                                    onChange={handlePageSizeChangeFour}
                                    sx={{ width: "77px" }}
                                  >
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={25}>25</MenuItem>
                                    <MenuItem value={50}>50</MenuItem>
                                    <MenuItem value={100}>100</MenuItem>
                                    <MenuItem value={tableFourDatas?.length}>All</MenuItem>
                                  </Select>
                                </Box>
                              </Grid>
                              <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                  {isUserRoleCompare?.includes("exceloriginalmismatch") && (
                                    <>
                                      <Button
                                        onClick={(e) => {
                                          setIsFilterOpenFour(true);
                                          setFormat("xl");
                                        }}
                                        sx={userStyle.buttongrp}
                                      >
                                        <FaFileExcel />
                                        &ensp;Export to Excel&ensp;
                                      </Button>
                                    </>
                                  )}
                                  {isUserRoleCompare?.includes("csvoriginalmismatch") && (
                                    <>
                                      <Button
                                        onClick={(e) => {
                                          setIsFilterOpenFour(true);
                                          setFormat("csv");
                                        }}
                                        sx={userStyle.buttongrp}
                                      >
                                        <FaFileCsv />
                                        &ensp;Export to CSV&ensp;
                                      </Button>
                                    </>
                                  )}
                                  {isUserRoleCompare?.includes("printoriginalmismatch") && (
                                    <>
                                      <Button sx={userStyle.buttongrp} onClick={handleprintFour}>
                                        &ensp;
                                        <FaPrint />
                                        &ensp;Print&ensp;
                                      </Button>
                                    </>
                                  )}
                                  {isUserRoleCompare?.includes("pdforiginalmismatch") && (
                                    <>
                                      <Button
                                        sx={userStyle.buttongrp}
                                        onClick={() => {
                                          setIsPdfFilterOpenFour(true);
                                        }}
                                      >
                                        <FaFilePdf />
                                        &ensp;Export to PDF&ensp;
                                      </Button>
                                    </>
                                  )}
                                  {isUserRoleCompare?.includes("imageoriginalmismatch") && (
                                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImageFour}>
                                      {" "}
                                      <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                    </Button>
                                  )}
                                </Box>
                              </Grid>
                              <Grid item md={2} xs={6} sm={6}>
                                <Box>
                                  <FormControl fullWidth size="small">
                                    <Typography>Search</Typography>
                                    <OutlinedInput id="component-outlined" type="text" value={searchQueryFour} onChange={handleSearchChangeFour} />
                                  </FormControl>
                                </Box>
                              </Grid>
                            </Grid>

                            <Grid container spacing={1}>
                              <Grid item md={2.5} xs={12} sm={5}>
                                <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsFour}>
                                  Show All Columns
                                </Button>
                                &ensp;
                                <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsFour}>
                                  Manage Columns
                                </Button>
                              </Grid>
                              <Grid item md={2} xs={4} sm={8}>
                                <FormControl fullWidth size="small">
                                  <Selects
                                    maxMenuHeight={250}
                                    options={misMatchModeOpt}
                                    value={{ label: mismatchmodeFour, value: mismatchmodeFour }}
                                    onChange={(e) => {
                                      setMismatchmodeFour(e.value);
                                    }}
                                  />
                                </FormControl>
                              </Grid>
                              <Grid item md={2} xs={2} sm={2}>

                                <LoadingButton
                                  onClick={(e) => handleBulkUpdateFour()}
                                  loading={isBulkUpdateFour}
                                  color="primary"
                                  loadingPosition="end"
                                  variant="contained"
                                >
                                  Bulk Update
                                </LoadingButton>
                              </Grid>
                            </Grid>

                            {!tableFour ? (
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
                                  <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowDataTableFour} columns={columnDataTableFour.filter((column) => columnVisibilityFour[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true} ref={gridRefFour} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
                                </Box>
                                <Box style={userStyle.dataTablestyle}>
                                  <Box>
                                    Showing {filteredDataFour.length > 0 ? (pageFour - 1) * pageSizeFour + 1 : 0} to {Math.min(pageFour * pageSizeFour, filteredDataFours.length)} of {filteredDataFours.length} entries
                                  </Box>
                                  <Box>
                                    <Button onClick={() => setPageFour(1)} disabled={pageFour === 1} sx={userStyle.paginationbtn}>
                                      <FirstPageIcon />
                                    </Button>
                                    <Button onClick={() => handlePageChangeFour(pageFour - 1)} disabled={pageFour === 1} sx={userStyle.paginationbtn}>
                                      <NavigateBeforeIcon />
                                    </Button>
                                    {pageNumbersFour?.map((pageNumber) => (
                                      <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChangeFour(pageNumber)} className={pageFour === pageNumber ? "active" : ""} disabled={pageFour === pageNumber}>
                                        {pageNumber}
                                      </Button>
                                    ))}
                                    {lastVisiblePageFour < totalPagesFour && <span>...</span>}
                                    <Button onClick={() => handlePageChangeFour(pageFour + 1)} disabled={pageFour === totalPagesFour} sx={userStyle.paginationbtn}>
                                      <NavigateNextIcon />
                                    </Button>
                                    <Button onClick={() => setPageFour(totalPagesFour)} disabled={pageFour === totalPagesFour} sx={userStyle.paginationbtn}>
                                      <LastPageIcon />
                                    </Button>
                                  </Box>
                                </Box>
                              </>
                            )}
                          </Box>
                        </>
                      )}
                      {/* Manage Column */}
                      <Popover
                        id={idFour}
                        open={isManageColumnsOpenFour}
                        anchorEl={anchorElFour}
                        onClose={handleCloseManageColumnsFour}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                      >
                        {manageColumnsContentFour}
                      </Popover>
                    </>
                  ) : (
                    <>
                      {tableCount === 5 ? (
                        <>
                          {/*----------Fifth Table----------------------------------------------------------------------------------------------------------------- */}
                          {/* ****** Table Start ****** */}
                          {isUserRoleCompare?.includes("loriginalmismatch") && (
                            <>
                              <Box sx={userStyle.container}>
                                {/* ******************************************************EXPORT Buttons****************************************************** */}
                                <Grid item xs={8} sx={{ display: "flex", justifyContent: "space-between" }}>
                                  <Typography sx={userStyle.importheadtext}>Production Unmatch Unit List 5 </Typography>
                                  <Button
                                    variant="contained"
                                    onClick={() => {
                                      setTableCount(4);
                                      setColumnVisibilityFour(initialColumnVisibilityFour)
                                    }}
                                  >
                                    Back
                                  </Button>
                                </Grid>
                                <br />
                                <Grid container spacing={2} style={userStyle.dataTablestyle}>
                                  <Grid item md={2} xs={12} sm={12}>
                                    <Box>
                                      <label>Show entries:</label>
                                      <Select
                                        id="pageSizeSelect"
                                        value={pageSizeFive}
                                        MenuProps={{
                                          PaperProps: {
                                            style: {
                                              maxHeight: 180,
                                              width: 80,
                                            },
                                          },
                                        }}
                                        onChange={handlePageSizeChangeFive}
                                        sx={{ width: "77px" }}
                                      >
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        <MenuItem value={tableFiveDatas?.length}>All</MenuItem>
                                      </Select>
                                    </Box>
                                  </Grid>
                                  <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <Box>
                                      {isUserRoleCompare?.includes("exceloriginalmismatch") && (
                                        <>
                                          <Button
                                            onClick={(e) => {
                                              setIsFilterOpenFive(true);
                                              setFormat("xl");
                                            }}
                                            sx={userStyle.buttongrp}
                                          >
                                            <FaFileExcel />
                                            &ensp;Export to Excel&ensp;
                                          </Button>
                                        </>
                                      )}
                                      {isUserRoleCompare?.includes("csvoriginalmismatch") && (
                                        <>
                                          <Button
                                            onClick={(e) => {
                                              setIsFilterOpenFive(true);
                                              setFormat("csv");
                                            }}
                                            sx={userStyle.buttongrp}
                                          >
                                            <FaFileCsv />
                                            &ensp;Export to CSV&ensp;
                                          </Button>
                                        </>
                                      )}
                                      {isUserRoleCompare?.includes("printoriginalmismatch") && (
                                        <>
                                          <Button sx={userStyle.buttongrp} onClick={handleprintFive}>
                                            &ensp;
                                            <FaPrint />
                                            &ensp;Print&ensp;
                                          </Button>
                                        </>
                                      )}
                                      {isUserRoleCompare?.includes("pdforiginalmismatch") && (
                                        <>
                                          <Button
                                            sx={userStyle.buttongrp}
                                            onClick={() => {
                                              setIsPdfFilterOpenFive(true);
                                            }}
                                          >
                                            <FaFilePdf />
                                            &ensp;Export to PDF&ensp;
                                          </Button>
                                        </>
                                      )}
                                      {isUserRoleCompare?.includes("imageoriginalmismatch") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImageFive}>
                                          {" "}
                                          <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                        </Button>
                                      )}
                                    </Box>
                                  </Grid>
                                  <Grid item md={2} xs={6} sm={6}>
                                    <Box>
                                      <FormControl fullWidth size="small">
                                        <Typography>Search</Typography>
                                        <OutlinedInput id="component-outlined" type="text" value={searchQueryFive} onChange={handleSearchChangeFive} />
                                      </FormControl>
                                    </Box>
                                  </Grid>
                                </Grid>
                                <br />

                                <Grid container spacing={1}>
                                  <Grid item md={2.5} xs={12} sm={5}>
                                    <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsFive}>
                                      Show All Columns
                                    </Button>
                                    &ensp;
                                    <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsFive}>
                                      Manage Columns
                                    </Button>
                                  </Grid>
                                  <Grid item md={2} xs={4} sm={8}>
                                    <FormControl fullWidth size="small">
                                      <Selects
                                        maxMenuHeight={250}
                                        options={misMatchModeOpt}
                                        value={{ label: mismatchmodeFive, value: mismatchmodeFive }}
                                        onChange={(e) => {
                                          setMismatchmodeFive(e.value);
                                        }}
                                      />
                                    </FormControl>
                                  </Grid>
                                  <Grid item md={2} xs={2} sm={2}>
                                    {/* <Button variant="contained" onClick={(e) => handleBulkUpdateTwo()}>
                            Submit
                          </Button> */}
                                    <LoadingButton
                                      onClick={(e) => handleBulkUpdateFive()}
                                      loading={isBulkUpdateFive}
                                      color="primary"
                                      // size="small"
                                      // sx={{ textTransform: "capitalize" }}
                                      loadingPosition="end"
                                      variant="contained"
                                    >
                                      {" "}
                                      Bulk Update
                                    </LoadingButton>
                                  </Grid>
                                </Grid>
                                <br />
                                <br />
                                {!tableFive ? (
                                  <>
                                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                                      {/* <CircularProgress color="inherit" />  */}
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
                                      <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowDataTableFive} columns={columnDataTableFive.filter((column) => columnVisibilityFive[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true} ref={gridRefFive} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
                                    </Box>
                                    <Box style={userStyle.dataTablestyle}>
                                      <Box>
                                        Showing {filteredDataFive.length > 0 ? (pageFive - 1) * pageSizeFive + 1 : 0} to {Math.min(pageFive * pageSizeFive, filteredDataFives.length)} of {filteredDataFives.length} entries
                                      </Box>
                                      <Box>
                                        <Button onClick={() => setPageFive(1)} disabled={pageFive === 1} sx={userStyle.paginationbtn}>
                                          <FirstPageIcon />
                                        </Button>
                                        <Button onClick={() => handlePageChangeFive(pageFive - 1)} disabled={pageFive === 1} sx={userStyle.paginationbtn}>
                                          <NavigateBeforeIcon />
                                        </Button>
                                        {pageNumbersFive?.map((pageNumber) => (
                                          <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChangeFive(pageNumber)} className={pageFive === pageNumber ? "active" : ""} disabled={pageFive === pageNumber}>
                                            {pageNumber}
                                          </Button>
                                        ))}
                                        {lastVisiblePageFive < totalPagesFive && <span>...</span>}
                                        <Button onClick={() => handlePageChange(pageFive + 1)} disabled={pageFive === totalPagesFive} sx={userStyle.paginationbtn}>
                                          <NavigateNextIcon />
                                        </Button>
                                        <Button onClick={() => setPageFive(totalPagesFive)} disabled={pageFive === totalPagesFive} sx={userStyle.paginationbtn}>
                                          <LastPageIcon />
                                        </Button>
                                      </Box>
                                    </Box>
                                  </>
                                )}
                              </Box>
                            </>
                          )}
                          {/* Manage Column */}
                          <Popover
                            id={idFive}
                            open={isManageColumnsOpenFive}
                            anchorEl={anchorElFive}
                            onClose={handleCloseManageColumnsFive}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "left",
                            }}
                          >
                            {manageColumnsContentFive}
                          </Popover>
                        </>
                      ) : (
                        <></>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
      <br />
      {[1, 2, 3, 4, 5].includes(tableCount) && (
        <>
          {isUserRoleCompare?.includes("loriginalmismatch") && (
            <>
              <Box sx={userStyle.container}>
                {/* ******************************************************EXPORT Buttons****************************************************** */}
                <Grid container>
                  <Grid item xs={8} md={8} sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={userStyle.importheadtext}>Production Updated List</Typography>
                  </Grid>
                  <Grid item xs={4} md={4} sx={{ display: "flex", justifyContent: "end" }}>
                    <Button variant="contained" onClick={() => fetchUpdatedList()}>
                      Re Run
                    </Button>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2} style={userStyle.dataTablestyle}>
                  <Grid item md={2} xs={12} sm={12}>
                    <Box>
                      <label>Show entries:</label>
                      <Select
                        id="pageSizeSelect"
                        value={pageSizeUpdatedList}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 180,
                              width: 80,
                            },
                          },
                        }}
                        onChange={handlePageSizeChangeUpdatedList}
                        sx={{ width: "77px" }}
                      >
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={25}>25</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                        <MenuItem value={100}>100</MenuItem>
                        <MenuItem value={tableUpdatedListDatas?.length}>All</MenuItem>
                      </Select>
                    </Box>
                  </Grid>
                  <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Box>
                      {isUserRoleCompare?.includes("exceloriginalmismatch") && (
                        <>
                          <Button
                            onClick={(e) => {
                              setIsFilterOpenUpdatedList(true);
                              setFormat("xl");
                            }}
                            sx={userStyle.buttongrp}
                          >
                            <FaFileExcel />
                            &ensp;Export to Excel&ensp;
                          </Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes("csvoriginalmismatch") && (
                        <>
                          <Button
                            onClick={(e) => {
                              setIsFilterOpenUpdatedList(true);
                              setFormat("csv");
                            }}
                            sx={userStyle.buttongrp}
                          >
                            <FaFileCsv />
                            &ensp;Export to CSV&ensp;
                          </Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes("printoriginalmismatch") && (
                        <>
                          <Button sx={userStyle.buttongrp} onClick={handleprintUpdatedList}>
                            &ensp;
                            <FaPrint />
                            &ensp;Print&ensp;
                          </Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes("pdforiginalmismatch") && (
                        <>
                          <Button
                            sx={userStyle.buttongrp}
                            onClick={() => {
                              setIsPdfFilterOpenUpdatedList(true);
                            }}
                          >
                            <FaFilePdf />
                            &ensp;Export to PDF&ensp;
                          </Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes("imageoriginalmismatch") && (
                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImageUpdatedList}>
                          {" "}
                          <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                        </Button>
                      )}
                    </Box>
                  </Grid>
                  <Grid item md={2} xs={6} sm={6}>
                    <Box>
                      <FormControl fullWidth size="small">
                        <Typography>Search</Typography>
                        <OutlinedInput id="component-outlined" type="text" value={searchQueryUpdatedList} onChange={handleSearchChangeUpdatedList} />
                      </FormControl>
                    </Box>
                  </Grid>
                </Grid>
                <br />
                <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsUpdatedList}>
                  Show All Columns
                </Button>
                &ensp;
                <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsUpdatedList}>
                  Manage Columns
                </Button>
                &ensp;
                {/* Manage Column */}
                <Popover
                  id={id}
                  open={isManageColumnsOpenUpdatedList}
                  anchorEl={anchorElUpdatedList}
                  onClose={handleCloseManageColumnsUpdatedList}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  {manageColumnsContentUpdatedList}
                </Popover>
                <br />
                <br />
                <br />
                {isupdatedlist ? (
                  <>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      {/* <CircularProgress color="inherit" />  */}
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
                      <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowDataTableUpdatedList} columns={columnDataTableUpdatedList.filter((column) => columnVisibilityUpdatedList[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true} ref={gridRefUpdatedList} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
                    </Box>
                    <Box style={userStyle.dataTablestyle}>
                      <Box>
                        Showing {filteredDataUpdatedList.length > 0 ? (pageUpdatedList - 1) * pageSizeUpdatedList + 1 : 0} to {Math.min(pageUpdatedList * pageSizeUpdatedList, filteredDataUpdatedLists.length)} of {filteredDataUpdatedLists.length} entries
                      </Box>
                      <Box>
                        <Button onClick={() => setPageUpdatedList(1)} disabled={pageUpdatedList === 1} sx={userStyle.paginationbtn}>
                          <FirstPageIcon />
                        </Button>
                        <Button onClick={() => handlePageChangeUpdatedList(pageUpdatedList - 1)} disabled={pageUpdatedList === 1} sx={userStyle.paginationbtn}>
                          <NavigateBeforeIcon />
                        </Button>
                        {pageNumbersUpdatedList?.map((pageNumber) => (
                          <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChangeUpdatedList(pageNumber)} className={pageUpdatedList === pageNumber ? "active" : ""} disabled={pageUpdatedList === pageNumber}>
                            {pageNumber}
                          </Button>
                        ))}
                        {lastVisiblePageUpdatedList < totalPagesUpdatedList && <span>...</span>}
                        <Button onClick={() => handlePageChangeUpdatedList(pageUpdatedList + 1)} disabled={pageUpdatedList === totalPagesUpdatedList} sx={userStyle.paginationbtn}>
                          <NavigateNextIcon />
                        </Button>
                        <Button onClick={() => setPageUpdatedList(totalPagesUpdatedList)} disabled={pageUpdatedList === totalPagesUpdatedList} sx={userStyle.paginationbtn}>
                          <LastPageIcon />
                        </Button>
                      </Box>
                    </Box>
                  </>
                )}
              </Box>
            </>
          )}
        </>
      )}

      {alltable === true && (
        <>
          {isUserRoleCompare?.includes("loriginalmismatch") && (
            <>
              <Box sx={userStyle.container}>
                {/* ******************************************************EXPORT Buttons****************************************************** */}
                <Grid item xs={8} sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={userStyle.importheadtext}>Production All List</Typography>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setTableCount(1);
                    }}
                  >
                    Back
                  </Button>
                </Grid>
                <br />
                <Grid container spacing={2} style={userStyle.dataTablestyle}>
                  <Grid item md={2} xs={12} sm={12}>
                    <Box>
                      <label>Show entries:</label>
                      <Select
                        id="pageSizeSelect"
                        value={pageSizeAllList}
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
                        <MenuItem value={tableAllListDatas?.length}>All</MenuItem>
                      </Select>
                    </Box>
                  </Grid>
                  <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Box>
                      {isUserRoleCompare?.includes("exceloriginalmismatch") && (
                        <>
                          <ExportXL
                            csvData={rowDataTableAllList.map((item) => ({
                              "S No": item.serialNumber,
                              Date: item.date,
                              Category: item.category,
                              Vendor: item.vendor,
                              Count: item.count,
                            }))}
                            fileName={fileName}
                          />
                        </>
                      )}
                      {isUserRoleCompare?.includes("csvoriginalmismatch") && (
                        <>
                          <ExportCSV
                            csvData={rowDataTableAllList.map((item) => ({
                              "S No": item.serialNumber,
                              Date: item.date,
                              Category: item.category,
                              Vendor: item.vendor,
                              Count: item.count,
                            }))}
                            fileName={fileName}
                          />
                        </>
                      )}
                      {isUserRoleCompare?.includes("printoriginalmismatch") && (
                        <>
                          <Button sx={userStyle.buttongrp} onClick={handleprintAllList}>
                            &ensp;
                            <FaPrint />
                            &ensp;Print&ensp;
                          </Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes("pdforiginalmismatch") && (
                        <>
                          <Button
                            sx={userStyle.buttongrp}
                            onClick={() => {
                              setIsPdfFilterOpenUpdatedList(true);
                            }}
                          >
                            <FaFilePdf />
                            &ensp;Export to PDF&ensp;
                          </Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes("imageoriginalmismatch") && (
                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImageAllList}>
                          {" "}
                          <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                        </Button>
                      )}
                    </Box>
                  </Grid>
                  <Grid item md={2} xs={6} sm={6}>
                    <Box>
                      <FormControl fullWidth size="small">
                        <Typography>Search</Typography>
                        <OutlinedInput id="component-outlined" type="text" value={searchQueryAllList} onChange={handleSearchChangeAllList} />
                      </FormControl>
                    </Box>
                  </Grid>
                </Grid>
                <br />
                <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsAllList}>
                  Show All Columns
                </Button>
                &ensp;
                <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsAllList}>
                  Manage Columns
                </Button>
                &ensp;
                {/* Manage Column */}
                <Popover
                  id={id}
                  open={isManageColumnsOpenAllList}
                  anchorEl={anchorElAllList}
                  onClose={handleCloseManageColumnsAllList}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  {manageColumnsContentAllList}
                </Popover>
                {!tableThree ? (
                  <>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      {/* <CircularProgress color="inherit" />  */}
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
                      <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowDataTableAllList} columns={columnDataTableAllList.filter((column) => columnVisibilityAllList[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true} ref={gridRefAllList} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
                    </Box>
                    <Box style={userStyle.dataTablestyle}>
                      <Box>
                        Showing {filteredDataAllList.length > 0 ? (pageAllList - 1) * pageSizeAllList + 1 : 0} to {Math.min(pageAllList * pageSizeAllList, filteredDataAllLists.length)} of {filteredDataAllLists.length} entries
                      </Box>
                      <Box>
                        <Button onClick={() => setPageAllList(1)} disabled={pageAllList === 1} sx={userStyle.paginationbtn}>
                          <FirstPageIcon />
                        </Button>
                        <Button onClick={() => handlePageChangeAllList(pageAllList - 1)} disabled={pageAllList === 1} sx={userStyle.paginationbtn}>
                          <NavigateBeforeIcon />
                        </Button>
                        {pageNumbersAllList?.map((pageNumber) => (
                          <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChangeAllList(pageNumber)} className={pageAllList === pageNumber ? "active" : ""} disabled={pageAllList === pageNumber}>
                            {pageNumber}
                          </Button>
                        ))}
                        {lastVisiblePageAllList < totalPagesAllList && <span>...</span>}
                        <Button onClick={() => handlePageChangeAllList(pageAllList + 1)} disabled={pageAllList === totalPagesAllList} sx={userStyle.paginationbtn}>
                          <NavigateNextIcon />
                        </Button>
                        <Button onClick={() => setPageAllList(totalPagesAllList)} disabled={pageAllList === totalPagesAllList} sx={userStyle.paginationbtn}>
                          <LastPageIcon />
                        </Button>
                      </Box>
                    </Box>
                  </>
                )}
              </Box>
            </>
          )}
        </>
      )}

      {/*------------------------------------------------------------------------------------------------------------------------------- */}

      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      // maxWidth="lg"
      >
        <Box sx={{ width: "450px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> Edit Flag Count</Typography>
            <br /> <br />
            <Grid container spacing={2} sx={{ display: "flex", justifyContent: "space-evenly" }}>
              <Grid item md={6} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Flag Count <b style={{ color: "red" }}>*</b>
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12}>
                <FormControl fullWidth size="small">
                  <OutlinedInput value={flagCountFirst} onChange={handleInputChangeFirst} placeholder="Enter Flag Count" />
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2} sx={{ display: "flex", justifyContent: "space-evenly" }}>
              <Button variant="contained" color="primary" onClick={handleSubmitFlagCountTwo}>
                {" "}
                Submit{" "}
              </Button>
              <Button variant="contained" color="primary" onClick={handleCloseview}>
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

      {/* view model */}
      <Dialog
        open={openviewProgress}
        onClose={handleClickOpenviewProgress}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      // maxWidth="lg"
      >
        <Box sx={{ width: "450px", padding: "20px 50px" }}>
          <>
            <div>
              {updateContent ? (
                <>
                  <h1>Updating Flag Count</h1>
                  <LinearProgress />
                  <p>Please Wait....</p>
                </>
              ) : (
                <>
                  <h1>Updated Successfully</h1>
                </>
              )}
            </div>
            <br /> <br /> <br />
            <Grid container spacing={2} sx={{ display: "flex", justifyContent: "space-evenly" }}>
              <Button variant="contained" color="primary" disabled={updateContent} onClick={handleCloseviewProgress}>
                {" "}
                Close{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpenpop} onClose={handleCloseerrpop} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              style={{ padding: "7px 13px", color: "white", background: "rgb(25, 118, 210)" }}
              onClick={() => {
                // sendEditRequest();
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
            <Button autoFocus variant="contained" color="err" onClick={handleCloseModalert}>
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* ALERT DIALOG */}
      {/* <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <Typography variant="h6">{showAlert}</Typography>
            <br />
          </DialogContent>
        </Dialog>
      </Box> */}
      {/* NEW FLAG DIALOG */}
      <Dialog open={newflagpopOpen} onClose={handleNewflagpopClose} aria-labelledby="alert-dialog-title" maxWidth="sm" fullWidth={true} aria-describedby="alert-dialog-description">
        <DialogContent>
          <Typography sx={userStyle.HeaderText}> Flag Entry</Typography>
          <br />
          <Grid container spacing={2} sx={{ display: "flex", justifyContent: "space-evenly" }}>
            <Grid item md={12} xs={12}>
              <FormControl fullWidth size="small">
                <Typography> Flag Count </Typography>
                <OutlinedInput value={flagCountFirst} onChange={handleInputChangeFirst} placeholder="Enter Flag Count" />
              </FormControl>
            </Grid>
          </Grid>
          <br /> <br />
          <Grid container spacing={2} sx={{ display: "flex", justifyContent: "end", gap: "20px" }}>
            <Button variant="contained" color="primary" onClick={() => console.log("sdjkfh")}>
              {" "}
              Submit
            </Button>
            <Button sx={userStyle.btncancel} onClick={handleNewflagpopClose}>
              Back
            </Button>
          </Grid>
        </DialogContent>
      </Dialog>
      {/* edit multiple unit flag DIALOG */}
      <Dialog open={multiUnitFlagOpen} onClose={handleMultiUnitflagpopClose} aria-labelledby="alert-dialog-title" maxWidth="md" fullWidth={true} aria-describedby="alert-dialog-description">
        <DialogContent>
          <Typography sx={userStyle.HeaderText}> Auto Increase Entry</Typography>
          <br />
          <Grid container spacing={2} sx={{ display: "flex", justifyContent: "space-evenly" }}>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <FormControl fullWidth size="small">
                <Typography> Unit Rate </Typography>
                <OutlinedInput value={flagCountFirst} onChange={handleInputChangeFirst} placeholder="Enter Unit Rate" />
              </FormControl>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <FormControl fullWidth size="small">
                <Typography> Flag Count </Typography>
                <OutlinedInput value={flagCountFirst} onChange={handleInputChangeFirst} placeholder="Enter Flag Count" />
              </FormControl>
            </Grid>
          </Grid>
          <br /> <br />
          <Grid container spacing={2} sx={{ display: "flex", justifyContent: "end", gap: "20px" }}>
            <Button variant="contained" color="primary" onClick={() => console.log("sdjkfh")}>
              {" "}
              Submit
            </Button>
            <Button sx={userStyle.btncancel} onClick={handleMultiUnitflagpopClose}>
              Back
            </Button>
          </Grid>
        </DialogContent>
      </Dialog>

      <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={rowDataTable ?? []}
        itemsTwo={items ?? []}
        filename={"Original Mismatch"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      <ExportDataTwo
        isFilterOpen={isFilterOpenTwo}
        handleCloseFilterMod={handleCloseFilterModTwo}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpenTwo}
        isPdfFilterOpen={isPdfFilterOpenTwo}
        setIsPdfFilterOpen={setIsPdfFilterOpenTwo}
        handleClosePdfFilterMod={handleClosePdfFilterModTwo}
        filteredDataTwo={rowDataTableTwo ?? []}
        itemsTwo={itemsTwo ?? []}
        filename={"Original Mismatch"}
        exportColumnNames={exportColumnNamesTwo}
        exportRowValues={exportRowValuesTwo}
        componentRef={componentRefTwo}
      />
      <ExportDataThree
        isFilterOpen={isFilterOpenThree}
        handleCloseFilterMod={handleCloseFilterModThree}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpenThree}
        isPdfFilterOpen={isPdfFilterOpenThree}
        setIsPdfFilterOpen={setIsPdfFilterOpenThree}
        handleClosePdfFilterMod={handleClosePdfFilterModThree}
        filteredDataTwo={rowDataTableThree ?? []}
        itemsTwo={itemsThree ?? []}
        filename={"Original Mismatch"}
        exportColumnNames={exportColumnNamesThree}
        exportRowValues={exportRowValuesThree}
        componentRef={componentRefThree}
      />
      <ExportDataFour
        isFilterOpen={isFilterOpenFour}
        handleCloseFilterMod={handleCloseFilterModFour}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpenFour}
        isPdfFilterOpen={isPdfFilterOpenFour}
        setIsPdfFilterOpen={setIsPdfFilterOpenFour}
        handleClosePdfFilterMod={handleClosePdfFilterModFour}
        filteredDataTwo={rowDataTableFour ?? []}
        itemsTwo={itemsFour ?? []}
        filename={"Original Mismatch"}
        exportColumnNames={exportColumnNamesFour}
        exportRowValues={exportRowValuesFour}
        componentRef={componentRefFour}
      />
      <ExportDataFive
        isFilterOpen={isFilterOpenFive}
        handleCloseFilterMod={handleCloseFilterModFive}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpenFive}
        isPdfFilterOpen={isPdfFilterOpenFive}
        setIsPdfFilterOpen={setIsPdfFilterOpenFive}
        handleClosePdfFilterMod={handleClosePdfFilterModFive}
        filteredDataTwo={rowDataTableFive ?? []}
        itemsTwo={itemsFive ?? []}
        filename={"Original Mismatch"}
        exportColumnNames={exportColumnNamesFive}
        exportRowValues={exportRowValuesFive}
        componentRef={componentRefFive}
      />
      <ExportDataAllList
        isFilterOpen={isFilterOpenAllList}
        handleCloseFilterMod={handleCloseFilterModAllList}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpenAllList}
        isPdfFilterOpen={isPdfFilterOpenAllList}
        setIsPdfFilterOpen={setIsPdfFilterOpenAllList}
        handleClosePdfFilterMod={handleClosePdfFilterModAllList}
        filteredDataTwo={rowDataTableAllList ?? []}
        itemsTwo={itemsAllList ?? []}
        filename={"Prodcution List"}
        exportColumnNames={exportColumnNamesAllList}
        exportRowValues={exportRowValuesAllList}
        componentRef={componentRefAllList}
      />
      <ExportDataUpdatedList
        isFilterOpen={isFilterOpenUpdatedList}
        handleCloseFilterMod={handleCloseFilterModUpdatedList}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpenUpdatedList}
        isPdfFilterOpen={isPdfFilterOpenUpdatedList}
        setIsPdfFilterOpen={setIsPdfFilterOpenUpdatedList}
        handleClosePdfFilterMod={handleClosePdfFilterModUpdatedList}
        filteredDataTwo={rowDataTableUpdatedList ?? []}
        itemsTwo={itemsUpdatedList ?? []}
        filename={"Production Updated List"}
        exportColumnNames={exportColumnNamesUpdatedList}
        exportRowValues={exportRowValuesUpdatedList}
        componentRef={componentRefUpdatedList}
      />
    </Box>
  );
}

export default ProductionUnmatchUnitList;