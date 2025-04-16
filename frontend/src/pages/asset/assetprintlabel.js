import React, { useState, useContext, useEffect, useRef } from "react";
import {
  Box, Typography, OutlinedInput, Dialog, TextField, Popover, DialogContentText, IconButton, List, ListItem, ListItemText, Checkbox, Select, MenuItem, DialogContent, DialogActions,
  FormControl, Grid, Button,
} from "@mui/material";
import { userStyle, colourStyles } from "../../pageStyle";
import { handleApiError } from "../../components/Errorhandling";
import { SERVICE } from "../../services/Baseservice";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { saveAs } from "file-saver";
import "jspdf-autotable";
import axios from "axios";
import Selects from "react-select";
import Qrcodegenerate from './Qrcode';
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext, AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import StyledDataGrid from "../../components/TableStyle";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { ThreeDots } from "react-loader-spinner";
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import PageHeading from "../../components/PageHeading";
import ExportData from "../../components/ExportData";
import AlertDialog from "../../components/Alert";
import MessageAlert from "../../components/MessageAlert";

function AssetPrintlabel() {
  const pathname = window.location.pathname;
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

  let exportColumnNames = ['Status', 'Company', 'Branch', 'Unit', 'Floor', 'Area', 'Location', 'WorkStation', 'Asset Type', 'Asset', 'Material', 'Component', 'Material Code', 'Countquantity', 'Rate', 'Warranty', 'Purchasedate', 'Vendor'];
  let exportRowValues = ['status', 'company', 'branch', 'unit', 'floor', 'area', 'location', 'workstation', 'assettype', 'asset', 'material', 'component', 'code', 'countquantity', 'rate', 'warranty', 'purchasedate', 'vendor']

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("All Label List"),
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

  const LabelFormat = [
    { label: "Asset Code", value: "Asset Code" },
    { label: "Qr Code", value: "Qr Code" },
    { label: "All Label", value: "All Label" },
  ];

  const [productLabel, setProductLabel] = useState({
    barcodesetting: "Please Select Label Size",
    labelformat: "Asset Code",
    qrcodewidth: "", qrcodeheight: "",
  });

  const [selectedItems, setSelectedItems] = useState([]);
  const [trail, setTrail] = useState([]);
  const [checkAll, setCheckAll] = useState(false)
  const [checkAllData, setCheckAllData] = useState([]);
  const [isQrCodePreview, setIsQrCodePreview] = useState(false);
  const [previewedImages, setPreviewedImages] = useState(false);

  const { auth } = useContext(AuthContext);
  const { isUserRoleCompare, pageName, setPageName, isAssignBranch, buttonStyles, isUserRoleAccess } = useContext(UserRoleAccessContext);
  const accessbranch = isUserRoleAccess?.role?.includes("Manager")
    ? isAssignBranch?.map((data) => ({
      branch: data.branch,
      company: data.company,
      unit: data.unit,
    }))
    : isAssignBranch
      ?.filter((data) => {
        let fetfinalurl = [];
        if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 &&
          data?.subpagenameurl?.length !== 0 &&
          data?.subsubpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subsubpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 &&
          data?.subpagenameurl?.length !== 0 && data?.subpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 && data?.mainpagenameurl?.includes(window.location.pathname)
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


        const remove = [window.location.pathname?.substring(1), window.location.pathname]
        return fetfinalurl?.some((item) => remove?.includes(item));
      })
      ?.map((data) => ({
        branch: data.branch,
        company: data.company,
        unit: data.unit,
      }));

  const [showAlert, setShowAlert] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [assetdetails, setAssetdetails] = useState([]);
  const [assetdetailCheck, setAssetdetailcheck] = useState(false);
  const [isLabelname, setIsLabelname] = useState([]);
  //filter fields
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const gridRef = useRef(null);

  useEffect(() => {
    fetchAssetDetails();
    fetchAllLabelnames();
  }, []);

  const fetchAllLabelnames = async () => {
    try {
      let res_grp = await axios.get(SERVICE.LABELNAME, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const labelalal = [
        ...res_grp?.data?.labelname.map((d) => ({
          ...d,
          label: d.sizename,
          value: d.sizename,
        })),
      ];
      setIsLabelname(labelalal);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "AssetDetail_Printlabel.png");
        });
      });
    }
  };
  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  //Delete model
  const [isDeleteOpencheck, setIsDeleteOpencheck] = useState(false);
  const handleClickOpencheck = () => {
    setIsDeleteOpencheck(true);
  };
  const handleCloseModcheck = () => {
    setIsDeleteOpencheck(false);
  };


  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  const handleClickOpenalert = () => {
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      // setIsDeleteOpencheckbox(true);
    }
  };
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
  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
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
    unit: true,
    floor: true,
    area: true,
    location: true,
    workstation: true,
    department: true,
    responsibleteam: true,
    subcomponent: true,
    team: true,
    asset: true,
    assettype: true,
    material: true,
    component: true,
    code: true,
    countquantity: true,
    materialcountcode: true,
    rate: true,
    warranty: true,
    purchasedate: true,
    vendor: true,
    customercare: true,
    stockcode: true,
    files: true,
    actions: true,
    status: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );
  //get all Sub vendormasters.
  const fetchAssetDetails = async () => {
    setPageName(!pageName)
    try {
      let res_vendor = await axios.post(SERVICE.ASSET_DATA_FILTER_ACCESS_OLD, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assignbranch: accessbranch,
      });
      setAssetdetails(
        res_vendor?.data?.assetdetails?.filter(
          (data) => data.status === "In Working"
        )
      );
      setAssetdetailcheck(true);
    } catch (err) { setAssetdetailcheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };


  const pageStyle = `
    @page {
      margin: 20mm 15mm; /* Top/bottom margin 20mm, left/right margin 15mm */
    }
    body {
      padding: 20px;
    }
    .print-section {
      page-break-before: auto;
      page-break-after: always;
      page-break-inside: avoid;
    }
          .no-page-break {
      page-break-inside: avoid; /* Avoid breaking inside elements with this class */
    }
  `;
  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: pageStyle,

  });

  const componentRefbtn = useRef();
  const handleprintbtn = useReactToPrint({
    content: () => componentRefbtn.current,
    documentTitle: "AssetDetail_Printlabel",
    pageStyle: "print",
  });

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

  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = assetdetails?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [assetdetails]);

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

  const checkValue = (id,
    company, branch, unit, floor, area, location, code, component, status,
    workstation, asset, assettype, material, countquantity, rate, warranty,
    purchasedate, vendor, subcomponent

  ) => {

    if (selectedRows.includes(id)) { //this used to unchecked the checkbox
      let removeUnchekedId = selectedRows.filter((checkedId) => {
        return id != checkedId;
      });
      let removeUncheckedItem = selectedItems.filter((checkedItems) => {
        return id != checkedItems.id;
      })
      let removeUncheckedItrailtem = trail.filter((checkedItems) => {
        return id != checkedItems.id;
      })
      setSelectedRows(removeUnchekedId);
      setSelectedItems(removeUncheckedItem);
      setTrail(removeUncheckedItrailtem);
    }
    else { //this used to make checked the checkbox
      setSelectedRows((ids) => {
        return [...ids, id];
      });
      setSelectedItems((checkedItems) => {

        return [
          ...checkedItems,
          {
            id: id,
            company: company,
            branch: branch,
            unit: unit,
            floor: floor,
            area: area,
            location: location,
            code: code,
            component: component,
            status: status,
            workstation: workstation,
            asset: asset,
            assettype: assettype,
            material: material,
            countquantity: countquantity,
            rate: rate,
            warranty: warranty,
            purchasedate: purchasedate,
            vendor: vendor,
            subcomponent: subcomponent,
          },
        ]
      });
      setTrail((checkedItems) => {

        return [
          ...checkedItems,
          {
            id: id,
            company: company,
            branch: branch,
            unit: unit,
            floor: floor,
            area: area,
            location: location,
            code: code,
            component: component,
            status: status,
            workstation: workstation,
            asset: asset,
            assettype: assettype,
            material: material,
            countquantity: countquantity,
            rate: rate,
            warranty: warranty,
            purchasedate: purchasedate,
            vendor: vendor,
            subcomponent: subcomponent,
          },
        ]
      });
    }

  };

  const handleChange = async (e) => {
    setCheckAllData([]);
    if (e.target.checked) {
      if (assetdetails && assetdetails.length > 0) {
        let result = filteredData.map(data => data.id);
        let resdata = filteredData.map(data => ({ ...data }));
        setSelectedRows(result);
        setTrail(resdata);
        setCheckAllData(resdata);

      }
      else {
        let result = filteredData?.map(data => data.id);
        let resdata = filteredData?.map(data => ({ ...data }));

        setSelectedRows(result);

        setTrail(resdata);
        setCheckAllData(resdata);
      }
    }
  };

  const columnDataTable = [
    {
      field: "checkbox",
      headerName: "Checkbox", // Default header name
      headerStyle: {
        fontWeight: "bold",
      },
      renderHeader: (params) => (
        <CheckboxHeader

          selectAllChecked={selectAllChecked}
          onSelectAll={(e) => {
            handleChange(e);
            if (rowDataTable.length === 0) {
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
          onChange={(e) => {
            let updatedSelectedRows;
            if (selectedRows.includes(params.row.id)) {
              updatedSelectedRows = selectedRows.filter(
                (selectedId) => selectedId !== params.row.id
              );
            } else {
              updatedSelectedRows = [...selectedRows, params.row.id];
            }
            setSelectedRows(updatedSelectedRows);
            setSelectAllChecked(
              updatedSelectedRows.length === filteredData.length
            );
            checkValue(params.row.id, params.row.company, params.row.branch, params.row.unit, params.row.floor, params.row.area, params.row.location,
              params.row.code, params.row.component, params.row.status, params.row.workstation, params.row.asset, params.row.assettype, params.row.material, params.row.countquantity, params.row.rate,
              params.row.warranty,
              params.row.purchasedate, params.row.vendor, params.row.subcomponent

            );

          }}

        />
      ),
      sortable: false,
      width: 70,
      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 70,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0,
      width: 100,
      hide: !columnVisibility.status,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Button
          variant="contained"
          style={{
            padding: "5px",
            backgroundColor:
              params.row.status === "Repair"
                ? "#FFC300"
                : params.row.status === "In Working"
                  ? "green"
                  : "inherit",
            color: params.row.status === "Repair" ? "black" : "white",
            fontSize: "10px",
            width: "90px",
            fontWeight: "bold",
          }}
        >
          {params.row.status}
        </Button>
      ),
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 100,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 100,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 100,
      hide: !columnVisibility.unit,
      headerClassName: "bold-header",
    },
    {
      field: "floor",
      headerName: "Floor",
      flex: 0,
      width: 100,
      hide: !columnVisibility.floor,
      headerClassName: "bold-header",
    },
    {
      field: "area",
      headerName: "Area",
      flex: 0,
      width: 100,
      hide: !columnVisibility.area,
      headerClassName: "bold-header",
    },
    {
      field: "location",
      headerName: "Location",
      flex: 0,
      width: 100,
      hide: !columnVisibility.location,
      headerClassName: "bold-header",
    },
    {
      field: "workstation",
      headerName: "WorkStation",
      flex: 0,
      width: 100,
      hide: !columnVisibility.workstation,
      headerClassName: "bold-header",
    },
    {
      field: "asset",
      headerName: "Asset",
      flex: 0,
      width: 150,
      hide: !columnVisibility.asset,
      headerClassName: "bold-header",
    },
    {
      field: "assettype",
      headerName: "Asset Type",
      flex: 0,
      width: 150,
      hide: !columnVisibility.assettype,
      headerClassName: "bold-header",
    },
    {
      field: "material",
      headerName: "Material",
      flex: 0,
      width: 150,
      hide: !columnVisibility.material,
      headerClassName: "bold-header",
    },
    {
      field: "component",
      headerName: "Component",
      flex: 0,
      width: 150,
      hide: !columnVisibility.component,
      headerClassName: "bold-header",
    },
    {
      field: "code",
      headerName: "Material Code",
      flex: 0,
      width: 150,
      hide: !columnVisibility.code,
      headerClassName: "bold-header",
    },
    {
      field: "countquantity",
      headerName: "Countquantity",
      flex: 0,
      width: 100,
      hide: !columnVisibility.countquantity,
      headerClassName: "bold-header",
    },
    {
      field: "rate",
      headerName: "Rate",
      flex: 0,
      width: 100,
      hide: !columnVisibility.rate,
      headerClassName: "bold-header",
    },
    {
      field: "warranty",
      headerName: "Warranty",
      flex: 0,
      width: 100,
      hide: !columnVisibility.warranty,
      headerClassName: "bold-header",
    },
    {
      field: "purchasedate",
      headerName: "Purchasedate",
      flex: 0,
      width: 150,
      hide: !columnVisibility.purchasedate,
      headerClassName: "bold-header",
    },
    {
      field: "vendor",
      headerName: "Vendor",
      flex: 0,
      width: 150,
      hide: !columnVisibility.vendor,
      headerClassName: "bold-header",
    },

  ];
  const rowDataTable = filteredData?.map((item, index) => {

    // const correctedArray = Array.isArray(item?.subcomponent) ? item.subcomponent.map((d) => (Array.isArray(d.code) ? d.code.join(",") : d.code)) : [];
    const correctedArray = Array.isArray(item?.subcomponent) ? item.subcomponent.map(d => d.code) : []
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      floor: item.floor,
      area: item.area,
      location: item.location,
      workstation: item.workstation,
      department: item.department,
      responsibleteam: item.responsibleteam,
      team: item.team,
      asset: item.asset,
      assettype: item.assettype,
      material: item.material,
      component: item.component,
      code: item.code,
      countquantity: item.countquantity,
      materialcountcode: item.materialcountcode,
      rate: item.rate,
      warranty: item.warranty,
      purchasedate: item.purchasedate,
      vendor: item.vendor,
      customercare: item.customercare,
      stockcode: item.materialcountcode + "#" + item.serialNumber,
      files: item.files,
      status: item.status,
      subcomponent: correctedArray,
      subcomponentcode: correctedArray
    };
  });

  const rowsWithCheckboxes = rowDataTable?.map((row) => ({
    ...row,
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
  const filteredColumns = columnDataTable.filter((column) =>
    column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
  );
  const toggleColumnVisibility = (field) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };
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

  const [openModal, setOpenModal] = useState(false)

  const handleOpenModal = () => {

    if (selectedRows?.length == 0) {
      handleClickOpenalert();
      setSelectedRows([]);
    }
    else {
      setOpenModal(true);
    }
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    setCheckAll(false); setSelectedRows([]); setSelectedItems([]); setTrail([]); setCheckAllData([]);
    setIsQrCodePreview(false); setSelectAllChecked(false);
    setPreviewedImages(false)

    setProductLabel({ labelformat: "Asset Code", barcodesetting: "Please Select Label Size", qrcodewidth: "", qrcodeheight: "", })
  };
  const [isLoading, setIsLoading] = useState(false);

  const sendRequest = async () => {
    setIsLoading(true);
    let changecheckedlabel = checkAll ? [...checkAllData] : [...trail]
    let getallcheckdata = changecheckedlabel.map((value) => {
      return { ...value, labelstatus: 'Printed' }
    })

    setPageName(!pageName)
    try {

      getallcheckdata?.map((item) => {
        return axios.post(`${SERVICE.ADDTOPRINTQUEUE_CREATE}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          company: String(item.company),
          branch: String(item.branch),
          unit: String(item.unit),
          floor: String(item.floor),
          area: String(item.area),
          location: String(item.location),
          code: String(item.code),
          asset: String(item.asset),
          component: String(item.component),
          assettype: String(item.assettype),
          material: String(item.material),
          vendor: String(item.vendor),
          status: String(item.status),
          labelstatus: String(item.labelstatus),
          workstation: String(item.workstation),
          purchasedate: String(item.purchasedate),
          rate: String(item.rate),
          countquantity: String(item.countquantity),

        });
      });
      setPopupContent("Printed Successfully 👍");
      setPopupSeverity("success");
      handleClickOpenPopup();
      handleprint();
      // handleCloseModal();
      setCheckAll(false)
      setPreviewedImages(false)
      setCheckAllData([])
      setSelectedRows([]);
      setTrail([]);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    await setIsLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (productLabel?.barcodesetting === "Please Select Label Size") {
      setPopupContentMalert("Please Select Label Size");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (!previewedImages) {
      setPopupContentMalert("First, preview the label before printing.");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      sendRequest();
    }
  };

  const handleSubmitPreview = (e) => {
    e.preventDefault();
    if (productLabel?.barcodesetting === "Please Select Label Size") {
      setPopupContentMalert("Please Select Label Size");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      setPreviewedImages(true)
      setIsQrCodePreview(true)
    }
  };

  const sendRequestToAddToPrintQueue = async () => {
    setIsLoading(true)
    let changecheckedlabel = checkAll ? [...checkAllData] : [...trail]
    let getallcheckdata = changecheckedlabel.map((value) => {
      return { ...value, labelstatus: 'Queue' }
    })
    setPageName(!pageName)
    try {
      for (const selectedItem of getallcheckdata) {
        const {
          status, company, branch, unit, floor, area, location, code, component,
          labelstatus, workstation, asset, assettype, material, countquantity, rate, warranty,
          purchasedate, vendor

        } = selectedItem;

        const req = await axios.post(SERVICE.ADDTOPRINTQUEUE_CREATE, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          },
          status: String(status),
          company: String(company),
          branch: String(branch),
          unit: String(unit),
          floor: String(floor),
          area: String(area),
          location: String(location),
          code: String(code),
          component: String(component),
          labelstatus: String(labelstatus),
          workstation: String(workstation),
          asset: String(asset),
          assettype: String(assettype),
          material: String(material),
          countquantity: String(countquantity),
          rate: String(rate),
          warranty: String(warranty),
          purchasedate: String(purchasedate),
          vendor: String(vendor),
        });

        setPopupContent("Queue Added Successfully 👍");
        setPopupSeverity("success");
        handleClickOpenPopup();
        setCheckAll(false)
        setCheckAllData([])
        setSelectedRows([]);
        setTrail([]);

      }
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }

    await setIsLoading(false);
  };


  const handleSubmitAddToPrintQueue = (e) => {
    e.preventDefault();
    if (selectedRows.length == 0) {
      handleClickOpenalert();
    }
    else {
      sendRequestToAddToPrintQueue();

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

  const [fileFormat, setFormat] = useState('')

  return (
    <Box>
      <Headtitle title={"ASSET PRINT LABEL"} />
      <PageHeading
        title="Manage Asset Print Label"
        modulename="Asset"
        submodulename="Stock Label"
        mainpagename="All Label List"
        subpagename=""
        subsubpagename=""
      />
      <br />
      <Box sx={userStyle.selectcontainer}>
        <>
          <Grid container spacing={2}>
            <>
              <Grid item md={3} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  sx={buttonStyles.buttonsubmit}
                  onClick={(e) => handleOpenModal(true)}
                  disableRipple >Print Label</Button>
              </Grid>
              <Grid item md={3} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center" }}>  </Grid>

              <Grid item md={3} sm={12} xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                <Button disableRipple
                  variant="contained"
                  sx={buttonStyles.buttonsubmit}
                  onClick={(e) => handleSubmitAddToPrintQueue(e)}
                >Add To Print Queue</Button>
              </Grid>
            </>
          </Grid>
        </>
      </Box>
      <br />

      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lalllabellist") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Asset Printlabel List
              </Typography>
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
                    {/* <MenuItem value={assetdetails?.length}>All</MenuItem> */}
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
                  {isUserRoleCompare?.includes("excelalllabellist") && (
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        fetchAssetDetails()
                        setFormat("xl")
                      }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvalllabellist") && (
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        fetchAssetDetails()
                        setFormat("csv")
                      }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("printalllabellist") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprintbtn}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfalllabellist") && (
                    <>
                      <Button sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true)
                          fetchAssetDetails()
                        }}
                      ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imagealllabellist") && (
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
                </Box>
              </Grid>
              <Grid item md={2} xs={6} sm={6}>
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
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
              Manage Columns
            </Button>

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
            <br />
            <br />
            {!assetdetailCheck ? (
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
                    unstable_cellSelection
                    disableRowSelectionOnClick
                    unstable_ignoreValueFormatterDuringExport
                  />
                </Box>
                <Box style={userStyle.dataTablestyle}>
                  <Box>
                    Showing{" "}
                    {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
                    {Math.min(page * pageSize, filteredDatas.length)} of{" "}
                    {filteredDatas.length} entries
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
              </>
            )}
          </Box>
        </>
      )}

      <Box>
        {/* ALERT DIALOG */}
        <Dialog
          open={isDeleteOpenalert}
          onClose={handleCloseModalert}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
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
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={userStyle.filtercontentpopup}>
          <DialogContentText id="printLabel">
            <Box >
              {/* label informations */}
              <Typography sx={userStyle.importheadtext}>Information to show in Labels</Typography><br /><br />
              <Box>
                <form action=''>
                  <Grid container>
                    <Grid item xs={12} sm={6} md={4} lg={4}>
                      <FormControl fullWidth size="small">
                        <Typography> Label Size </Typography>
                        <Selects
                          options={isLabelname}
                          styles={colourStyles}
                          value={{
                            label: productLabel.barcodesetting,
                            value: productLabel.barcodesetting,
                          }}
                          onChange={(e) => {
                            setIsQrCodePreview(false);
                            setPreviewedImages(false)
                            const fwidth = Number(e.width) + 165;
                            const fheight = Number(e.height) + 88;
                            setProductLabel({ ...productLabel, qrcodewidth: e.width, qrcodeheight: e.height, barcodesetting: e.value })
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={4}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Label Format
                        </Typography>
                        <Selects
                          options={LabelFormat}
                          styles={colourStyles}
                          value={{
                            label: productLabel.labelformat,
                            value: productLabel.labelformat,
                          }}
                          onChange={(e) => {
                            setIsQrCodePreview(false)
                            setPreviewedImages(false)
                            setProductLabel({
                              ...productLabel,
                              labelformat: e.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid><br /><br />
                  <Grid container sx={{ marginTop: '20px', justifyContent: 'center' }}>
                    <Grid>
                      <Button sx={buttonStyles.buttonsubmit}
                        variant="contained"
                        onClick={(e) => { handleSubmit(e) }}
                      >PRINT</Button>
                      &ensp;
                      &ensp;
                      <Button
                        sx={buttonStyles.buttonsubmit}
                        variant="outlined"
                        onClick={(e) => handleSubmitPreview(e)}>
                        PREVIEW
                      </Button>
                    </Grid>
                  </Grid>
                </form><br /><br />
                {/* print label qr section start */}
                <div ref={componentRef} style={{ padding: 0, margin: 0, }}>
                  < Grid container
                    columnSpacing={1}
                    sx={{ display: 'flex', padding: 0, backgroundColor: 'white', }}
                    width="645px">
                    {productLabel.barcodesetting != "Please Select Label Size" ?
                      (
                        isQrCodePreview &&
                        (() => {
                          let rows = [];
                          checkAll ? (
                            checkAllData.forEach((value, index) => {
                              rows.push(
                                <>
                                  <Grid md={3.5} className="no-page-break" sx={{ margin: 0, border: "2px solid red" }}>

                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}><Qrcodegenerate getProductData={value} productLabel={productLabel} width={`${productLabel.qrcodewidth}`} height={`${productLabel.qrcodeheight}`} /></Box>
                                  </Grid>
                                </>
                              )
                            })
                          ) : (
                            trail.forEach((value, index) => {
                              rows.push(
                                <>

                                  <Grid item md={3.5} className="no-page-break" sx={{ margin: 0, border: "2px solid red" }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}><Qrcodegenerate getProductData={value} productLabel={productLabel} width={`${productLabel.qrcodewidth}`} height={`${productLabel.qrcodeheight}`} /></Box>
                                  </Grid>
                                </>
                              )
                            })
                          )

                          return rows;
                        })()
                      ) : null
                    }
                  </Grid>
                </div>
                {/* print label qr section end */}
              </Box>
            </Box>
            <br /><br />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" sx={buttonStyles.btncancel} onClick={handleCloseModal}>CLOSE</Button>
        </DialogActions>
      </Dialog>

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
        filteredDataTwo={rowDataTable ?? []}
        itemsTwo={assetdetails ?? []}
        filename={"AssetDetail_Printlabel"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRefbtn}
      />

      {/* EXTERNAL COMPONENTS -------------- END */}
      <br />

    </Box>
  );
}

export default AssetPrintlabel;