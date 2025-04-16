import CloseIcon from "@mui/icons-material/Close";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import LoadingButton from "@mui/lab/LoadingButton";
import PageHeading from "../../components/PageHeading";
import {
  Box, InputAdornment,
  Button,
  Checkbox,
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
import moment from "moment-timezone";
import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaSearch } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import StyledDataGrid from "../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";

import ExportData from "../../components/ExportData";
import MessageAlert from "../../components/MessageAlert";
import AlertDialog from "../../components/Alert";

//new table
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import domtoimage from 'dom-to-image';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import AdvancedSearchBar from '../../components/Searchbar';
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";


function AssetRepair() {

  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTableImg = useRef(null);
  const gridRefTable = useRef(null);
  const [assetdetails, setAssetdetails] = useState([]);

  const [openPopupMalert, setOpenPopupMalert] = useState(false);
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

  let exportColumnNames = [
    "Status",
    "Company",
    "Branch",
    "Unit",
    "Floor",
    "Area",
    "Location",
    "Material",
    "Problem",
  ];
  let exportRowValues = [
    "status",
    "company",
    "branch",
    "unit",
    "floor",
    "area",
    "location",
    "material",
    "repairproblem",
  ];




  //Access Module
  const pathname = window.location.pathname;
  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Repair Asset"),
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

  useEffect(() => {
    fetchProblem();
  }, [maintentancemaster.assetmaterial !== "Please Select Material"]);

  const [loadingdeloverall, setloadingdeloverall] = useState(false);

  const gridRefNeartat = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowsNear, setSelectedRowsNear] = useState([]);
  const [itemsneartat, setItemsNearTat] = useState([]);

  const [newcheckbranch, setNewcheckBranch] = useState("Choose Branch");
  const [floors, setFloors] = useState([]);

  const [areas, setAreas] = useState([]);
  const [problems, setProblem] = useState([]);
  // const [locations, setLocations] = useState([]);
  const [locations, setLocations] = useState([{ label: "ALL", value: "ALL" }]);


  const [materialOpt, setMaterialopt] = useState([]);

  const fetchMaterialAll = async () => {
    try {
      let res = await axios.get(SERVICE.ASSETDETAILFILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const resultall = res.data.assetdetails
        ?.filter((data) => data?.status === "In Working")
        ?.map((d) => ({
          ...d,
          label: `${d.material} - ${d.code}`,
          value: `${d.material} - ${d.code}`,
          material: d.material
        }));
      setMaterialopt(resultall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchMaterialAll();
  }, []);

  const getRowClassNameNearTat = (params) => {
    if (selectedRows.includes(params.data.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  // const handleCaptureImagenear = () => {
  //   if (gridRefNeartat.current) {
  //     html2canvas(gridRefNeartat.current).then((canvas) => {
  //       canvas.toBlob((blob) => {
  //         saveAs(blob, "Asset Repair.png");
  //       });
  //     });
  //   }
  // };
  // image
  const handleCaptureImagenear = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Asset Repair.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  const handleSelectionChangeNear = (newSelection) => {
    setSelectedRowsNear(newSelection.selectionModel);
  };

  //  Datefield
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;

  const [maintentancemaster, setMaintentancemaster] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    floor: "Please Select Floor",
    area: "Please Select Area",
    location: "Please Select Location",
    assetmaterial: "Please Select Material",
    problem: "Please Select Problem",
    assetmaterialcheck: "",
    ip: true,
    ebusage: true,
    empdistribution: true,
    addedby: "",
    updatedby: "",
  });

  const fetchRepairedAsset = async () => {
    setPageName(!pageName)


    try {
      setProjectCheck(true);
      // let res = await axios.get(SERVICE.ASSETDETAIL_REPAIRED, {
      let res = await axios.post(SERVICE.ASSET_REPAIR_ACCESS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assignbranch: accessbranch,
      });

      setAssetdetails(res?.data?.repairedasset?.map((item, index) => ({
        ...item,
        id: item._id,
        serialNumber: index + 1,
        material: `${item.material} - ${item.code}`,
      })));
      setProjectCheck(false);
    } catch (err) {
      setProjectCheck(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }

  }

  console.log(maintentancemaster.location, "location")
  const fetchAssetDetails = async () => {
    setPageName(!pageName)

    try {
      let res = await axios.post(SERVICE.ASSETDETAIL_REPAIR_LIMITED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: maintentancemaster.company,
        branch: maintentancemaster.branch,
        unit: maintentancemaster.unit,
        floor: maintentancemaster.floor,
        area: maintentancemaster.area,
        location: maintentancemaster.location == "ALL" ? locations.map(d => d.value) : [maintentancemaster.location],
        material: maintentancemaster.assetmaterial?.split(" - ")[0],
        code: maintentancemaster.assetmaterial?.split(" - ")[1],
        problem: maintentancemaster.problem,
        status: "Repair",
      });


      setMaintentancemaster({
        ...maintentancemaster,
        assetmaterial: "Please Select Material",
        problem: "Please Select Problem",
      });
      setProblem([])
      await fetchRepairedAsset();
      await fetchMaterialAll();
      setloadingdeloverall(false);
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      setProjectCheck(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const {
    isUserRoleCompare,
    isUserRoleAccess,
    isAssignBranch,
    allfloor, pageName, setPageName, buttonStyles,
    allareagrouping,
    alllocationgrouping,
  } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);

  const accessbranch = isAssignBranch
    ?.filter((data) => {
      let fetfinalurl = [];
      // Check if user is a Manager, in which case return all branches
      if (isUserRoleAccess?.role?.includes("Manager")) {
        return true; // Skip filtering, return all data for Manager
      }
      if (
        data?.modulenameurl?.length !== 0 &&
        data?.submodulenameurl?.length !== 0 &&
        data?.mainpagenameurl?.length !== 0 &&
        data?.subpagenameurl?.length !== 0 &&
        data?.subsubpagenameurl?.length !== 0
      ) {
        fetfinalurl = data.subsubpagenameurl;
      } else if (
        data?.modulenameurl?.length !== 0 &&
        data?.submodulenameurl?.length !== 0 &&
        data?.mainpagenameurl?.length !== 0 &&
        data?.subpagenameurl?.length !== 0
      ) {
        fetfinalurl = data.subpagenameurl;
      } else if (
        data?.modulenameurl?.length !== 0 &&
        data?.submodulenameurl?.length !== 0 &&
        data?.mainpagenameurl?.length !== 0
      ) {
        fetfinalurl = data.mainpagenameurl;
      } else if (
        data?.modulenameurl?.length !== 0 &&
        data?.submodulenameurl?.length !== 0
      ) {
        fetfinalurl = data.submodulenameurl;
      } else if (data?.modulenameurl?.length !== 0) {
        fetfinalurl = data.modulenameurl;
      } else {
        fetfinalurl = [];
      }

      // Check if the pathname exists in the URL
      return fetfinalurl?.includes(window.location.pathname);
    })
    ?.map((data) => ({
      branch: data.branch,
      company: data.company,
      unit: data.unit,
    }));

  const [projectCheck, setProjectCheck] = useState(false);

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [pageNearTatPrimary, setPageNearTatPrimary] = useState(1);
  const [pageSizeNearTatPrimary, setPageSizeNearTatPrimary] = useState(10);

  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();

  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
    setloadingdeloverall(false);
  };

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const handleClickOpenalert = () => {
    if (selectedRowsNear.length == 0) {
      setIsDeleteOpenalert(true);
    } else {
      // setIsDeleteOpencheckbox(true);
    }
  };
  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  const [searchQueryManageNeartat, setSearchQueryManageNeartat] = useState("");
  // Manage Columns
  const [isManageColumnsOpenNeartat, setManageColumnsOpenNeartat] =
    useState(false);
  const [anchorElNeartat, setAnchorElNeartat] = useState(null);
  const handleOpenManageColumnsNeartat = (event) => {
    setAnchorElNeartat(event.currentTarget);
    setManageColumnsOpenNeartat(true);
  };
  const handleCloseManageColumnsNeartat = () => {
    setManageColumnsOpenNeartat(false);
    setSearchQueryManageNeartat("");
  };

  const openneartat = Boolean(anchorElNeartat);
  const idneartat = openneartat ? "simple-popover" : undefined;

  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    company: true,
    branch: true,
    unit: true,
    floor: true,
    area: true,
    location: true,
    material: true,
    subcomponents: true,
    subcomponentsstring: true,
    problem: true,
    ip: true,
    ebusage: true,
    empdistribution: true,
    component: true,
    repairproblem: true,
    status: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  //submit option for saving
  const handleSubmit = async (e) => {
    setloadingdeloverall(true);
    e.preventDefault();
    if (maintentancemaster.company === "Please Select Company") {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemaster.branch === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemaster.unit === "Please Select Unit") {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemaster.floor === "Please Select Floor") {
      setPopupContentMalert("Please Select Floor!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemaster.area === "Please Select Area") {
      setPopupContentMalert("Please Select Area!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemaster.location === "Please Select Location") {
      setPopupContentMalert("Please Select Location!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemaster.assetmaterial === "Please Select Material") {
      setPopupContentMalert("Please Select Material!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (maintentancemaster.problem === "Please Select Problem") {
      setPopupContentMalert("Please Select Problem!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      fetchAssetDetails();
    }
  };

  const handleclear = (e) => {
    e.preventDefault();

    setMaintentancemaster({
      company: "Please Select Company",
      branch: "Please Select Branch",
      unit: "Please Select Unit",
      floor: "Please Select Floor",
      area: "Please Select Area",
      location: "Please Select Location",
      assetmaterial: "Please Select Material",
      problem: "Please Select Problem",
      empdistribution: true,
      ebusage: true,
    });
    setProblem([])
    setFloors([]);
    setAreas([]);
    setLocations([{ label: "ALL", value: "ALL" }]);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  const fetchFloor = async (e) => {
    let result = allfloor.filter((d) => d.branch === e.value);
    const floorall = result.map((d) => ({
      ...d,
      label: d.name,
      value: d.name,
    }));
    setFloors(floorall);
  };
  const fetchArea = async (e) => {
    let result = allareagrouping
      .filter((d) => d.branch === newcheckbranch && d.floor === e)
      .map((data) => data.area);
    let ji = [].concat(...result);
    const all = ji.map((d) => ({
      ...d,
      label: d,
      value: d,
    }));
    setAreas(all);
  };
  // const fetchLocation = async (e) => {
  //   let result = alllocationgrouping
  //     .filter(
  //       (d) =>
  //         d.branch === newcheckbranch &&
  //         d.floor === maintentancemaster.floor &&
  //         d.area === e
  //     )
  //     .map((data) => data.location);
  //   let ji = [].concat(...result);
  //   const all = [
  //     ...ji.map((d) => ({
  //       ...d,
  //       label: d,
  //       value: d,
  //     })),
  //   ];
  //   setLocations(all);
  // };

  const fetchLocation = async (e) => {

    let result = alllocationgrouping
      .filter(
        (d) =>
          d.branch === maintentancemaster.branch &&
          d.floor === maintentancemaster.floor &&
          d.area === e
      )
      .map((data) => data.location);
    let ji = [...new Set(["ALL"].concat(...result))];


    const all = [
      // { label: "ALL", value: "ALL" },
      ...ji.map((d) => ({
        ...d,
        label: d,
        value: d,
      })),
    ];
    setLocations(all);
  };

  const fetchProblem = async (e) => {
    try {
      let res_floor = await axios.get(SERVICE.ASSETPROBLEMMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      // const floorall = res_floor.data.assetproblemmaster.map((d) => ({
      //   ...d,
      //   label: d.problem,
      //   value: d.problem,
      // }));
      console.log(res_floor.data.assetproblemmaster, "lovd")
      setProblem(res_floor.data.assetproblemmaster);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  // console.log(problems, "problem")
  useEffect(() => {
    fetchProblem();
    fetchRepairedAsset();
  }, []);

  //print...
  const componentRef = useRef();

  //print...
  const componentRefNear = useRef();
  const handleprintNear = useReactToPrint({
    content: () => componentRefNear.current,
    documentTitle: "Asset Repair ",
    pageStyle: "print",
  });

  // serial no for listing items
  const addSerialNumber = (datas) => {
    setItems(datas);
  };

  useEffect(() => {
    addSerialNumber(assetdetails);
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


  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );

  const [selectAllCheckedNear, setSelectAllCheckedNear] = useState(false);

  const CheckboxHeaderNear = ({ selectAllCheckedNear, onSelectAllNear }) => (
    <div>
      <Checkbox checked={selectAllCheckedNear} onChange={onSelectAllNear} />
    </div>
  );

  const [btnSubmit, setBtnSubmit] = useState(false);
  const [rowIndex, setRowIndex] = useState();
  const [status, setStatus] = useState({});
  const handleAction = (value, rowId, sno) => {
    setStatus((prevStatus) => ({
      ...prevStatus,
      [rowId]: {
        ...prevStatus[rowId],
        status: value,
        btnShow: true,
      },
    }));
    setRowIndex(sno);
  };

  const handleUpdate = async (e, status, assignedthrough, ticketid) => {
    setBtnSubmit(true);
    try {
      let response = await axios.put(`${SERVICE.ASSETDETAIL_SINGLE}/${e}`, {
        status: String(status),
      });
      if (assignedthrough === "TICKET") {
        let res = await axios.put(`${SERVICE.RAISETICKET_SINGLE}/${ticketid}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          raiseself: "Closed",
          materialstatus: status,
          ticketclosed: isUserRoleAccess.companyname,
          resolvedate: moment(new Date()).format("DD-MM-YYYY hh:mm:ss a"),
        });
      }

      await fetchRepairedAsset();
      await fetchMaterialAll();
      setStatus({});
      setBtnSubmit(false);
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const columnDataTable = [
    // {
    //   field: "checkbox",
    //   headerName: "Checkbox", // Default header name
    //   headerStyle: {
    //     fontWeight: "bold", // Apply the font-weight style to make the header text bold
    //     // Add any other CSS styles as needed
    //   },
    //   headerComponent: (params) => (
    //     <CheckboxHeaderNear
    //       selectAllCheckedNear={selectAllCheckedNear}
    //       onSelectAllNear={() => {
    //         if (rowDataTable.length === 0) {
    //           // Do not allow checking when there are no rows
    //           return;
    //         }

    //         if (selectAllCheckedNear) {
    //           setSelectedRowsNear([]);
    //         } else {
    //           const allRowIds = rowDataTable.map((row) => row.id);
    //           setSelectedRowsNear(allRowIds);
    //         }
    //         setSelectAllCheckedNear(!selectAllCheckedNear);
    //       }}
    //     />
    //   ),

    //   cellRenderer: (params) => (
    //     <Checkbox
    //       checked={selectedRowsNear.includes(params.data.id)}
    //       onChange={() => {
    //         let updatedSelectedRows;
    //         if (selectedRowsNear.includes(params.data.id)) {
    //           updatedSelectedRows = selectedRowsNear.filter(
    //             (selectedId) => selectedId !== params.data.id
    //           );
    //         } else {
    //           updatedSelectedRows = [...selectedRowsNear, params.data.id];
    //         }

    //         setSelectedRowsNear(updatedSelectedRows);

    //         // Update the "Select All" checkbox based on whether all rows are selected
    //         setSelectAllCheckedNear(
    //           updatedSelectedRows.length === filteredData.length
    //         );
    //       }}
    //     />
    //   ),
    //   sortable: false, // Optionally, you can make this column not sortable
    //   width: 80,

    //   hide: !columnVisibility.checkbox,
    //   headerClassName: "bold-header",
    // },
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
      field: "status",
      headerName: "Status",
      flex: 0,
      width: 300,
      sortable: false,
      hide: !columnVisibility.status,
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex", gap: "10px" }}>

          <Grid item md={12} xs={12} sm={12}>
            <FormControl size="large" fullWidth>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 200,
                      width: "auto",
                    },
                  },
                }}
                style={{ minWidth: 150, width: 200, overflow: "hidden" }}
                value={
                  status[params.data.id]?.status
                    ? status[params.data.id]?.status
                    : params.data.status
                }
                onChange={(e) => {
                  handleAction(
                    e.target.value,
                    params?.data?.id,
                    params.data.serialNumber
                  );
                }}
                inputProps={{ "aria-label": "Without label" }}
              >
                <MenuItem value="In Working">Resolved</MenuItem>
                <MenuItem value="Damage">Move to Damage</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Box>
            {status[params.data.id]?.btnShow &&
              rowIndex === params.data.serialNumber ? (
              <>
                {" "}
                <LoadingButton
                  // sx={{
                  //   ...userStyle.buttonedit,
                  //   marginLeft: "10px",
                  // }}
                  variant="contained"
                  loading={btnSubmit}
                  style={{ minWidth: "0px" }}
                  onClick={(e) =>
                    handleUpdate(
                      params?.data?.id,
                      status[params.data.id]?.status,
                      params?.data?.assignedthrough,
                      params?.data?.ticketid
                    )
                  }
                >
                  SAVE
                </LoadingButton>
              </>
            ) : (
              <></>
            )}
          </Box>
        </Grid>
      ),
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 150,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 150,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 160,
      hide: !columnVisibility.unit,
      headerClassName: "bold-header",
    },
    {
      field: "floor",
      headerName: "Floor",
      flex: 0,
      width: 150,
      hide: !columnVisibility.floor,
      headerClassName: "bold-header",
    },
    {
      field: "area",
      headerName: "Area",
      flex: 0,
      width: 150,
      hide: !columnVisibility.area,
      headerClassName: "bold-header",
    },
    {
      field: "location",
      headerName: "Location",
      flex: 0,
      width: 150,
      hide: !columnVisibility.location,
      headerClassName: "bold-header",
    },
    {
      field: "material",
      headerName: "Material",
      flex: 0,
      width: 160,
      hide: !columnVisibility.material,
      headerClassName: "bold-header",
    },
    {
      field: "repairproblem",
      headerName: "Problem",
      flex: 0,
      width: 160,
      hide: !columnVisibility.repairproblem,
      headerClassName: "bold-header",
    },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      floor: item.floor,
      area: item.area,
      location: item.location,
      material: item.material,
      repairproblem: item.repairproblem,
      status: item.status,
      assignedthrough: item.assignedthrough,
      ticketid: item.ticketid,
      subcomponents: item.subcomponents,
      component: item.component?.toString(","),
    };
  });

  const rowsWithCheckboxesNear = rowDataTable.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRowsNear.includes(row.id),
  }));

  // Show All Columns functionality
  const handleShowAllColumns = () => {
    const updatedVisibility = { ...columnVisibility };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibility(updatedVisibility);
  };
  // Function to filter columns based on search query
  const filteredColumns = columnDataTable.filter((column) =>
    column.headerName.toLowerCase().includes(searchQueryManageNeartat.toLowerCase())
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
        onClick={handleCloseManageColumnsNeartat}
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
          value={searchQueryManageNeartat}
          onChange={(e) => setSearchQueryManageNeartat(e.target.value)}
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
              {" "}
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );


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


  console.log(maintentancemaster.assetmaterial.split("-")[0], "spoit")


  return (
    <Box>
      <Headtitle title={"ASSET REPAIR"} />
      {/* ****** Header Content ****** */}
      {/* <Typography sx={userStyle.HeaderText}>Asset Repair</Typography> */}
      <PageHeading
        title="Asset Repair"
        modulename="Asset"
        submodulename="Asset Details"
        mainpagename="Repair Asset"
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("arepairasset") && (
        <>
          <Box sx={userStyle.selectcontainer}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Add Repair
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
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
                      styles={colourStyles}
                      value={{
                        label: maintentancemaster.company,
                        value: maintentancemaster.company,
                      }}
                      onChange={(e) => {
                        setMaintentancemaster({
                          ...maintentancemaster,
                          company: e.value,
                          branch: "Please Select Branch",
                          unit: "Please Select Unit",
                          floor: "Please Select Floor",
                          area: "Please Select Area",
                          location: "Please Select Location",
                          assetmaterial: "Please Select Material",
                          problem: "Please Select Problem",
                        });
                        setProblem([])
                        setFloors([]);
                        setAreas([]);
                        setLocations([{ label: "ALL", value: "ALL" }]);
                        fetchFloor(e);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      {" "}
                      Branch<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={accessbranch
                        ?.filter(
                          (comp) => maintentancemaster.company === comp.company
                        )
                        ?.map((data) => ({
                          label: data.branch,
                          value: data.branch,
                        }))
                        .filter((item, index, self) => {
                          return (
                            self.findIndex(
                              (i) =>
                                i.label === item.label && i.value === item.value
                            ) === index
                          );
                        })}
                      styles={colourStyles}
                      value={{
                        label: maintentancemaster.branch,
                        value: maintentancemaster.branch,
                      }}
                      onChange={(e) => {
                        setNewcheckBranch(e.value);
                        setMaintentancemaster({
                          ...maintentancemaster,
                          branch: e.value,
                          unit: "Please Select Unit",
                          floor: "Please Select Floor",
                          area: "Please Select Area",
                          location: "Please Select Location",
                          assetmaterial: "Please Select Material",
                          problem: "Please Select Problem",
                        });
                        setProblem([])
                        setLocations([{ label: "ALL", value: "ALL" }]);
                        fetchFloor(e);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      {" "}
                      Unit<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={accessbranch
                        ?.filter(
                          (comp) =>
                            maintentancemaster.company === comp.company &&
                            maintentancemaster.branch === comp.branch
                        )
                        ?.map((data) => ({
                          label: data.unit,
                          value: data.unit,
                        }))
                        .filter((item, index, self) => {
                          return (
                            self.findIndex(
                              (i) =>
                                i.label === item.label && i.value === item.value
                            ) === index
                          );
                        })}
                      styles={colourStyles}
                      value={{
                        label: maintentancemaster.unit,
                        value: maintentancemaster.unit,
                      }}
                      onChange={(e) => {
                        setMaintentancemaster({
                          ...maintentancemaster,
                          unit: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Floor<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={floors}
                      styles={colourStyles}
                      value={{
                        label: maintentancemaster.floor,
                        value: maintentancemaster.floor,
                      }}
                      onChange={(e) => {
                        setMaintentancemaster({
                          ...maintentancemaster,
                          floor: e.value,
                          workstation: "",
                          area: "Please Select Area",
                          location: "Please Select Location",
                          assetmaterial: "Please Select Material",
                          problem: "Please Select Problem",
                        });
                        setAreas([]);
                        setProblem([])
                        setLocations([{ label: "ALL", value: "ALL" }]);
                        fetchArea(e.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Area<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={areas}
                      styles={colourStyles}
                      value={{
                        label: maintentancemaster.area,
                        value: maintentancemaster.area,
                      }}
                      onChange={(e) => {
                        setMaintentancemaster({
                          ...maintentancemaster,
                          area: e.value,
                          workstation: "",
                          location: "Please Select Location",
                          assetmaterial: "Please Select Material",
                          problem: "Please Select Problem",
                        });
                        setProblem([])
                        setLocations([{ label: "ALL", value: "ALL" }]);
                        fetchLocation(e.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Location<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={locations}
                      styles={colourStyles}
                      value={{
                        label: maintentancemaster.location,
                        value: maintentancemaster.location,
                      }}
                      onChange={(e) => {
                        setMaintentancemaster({
                          ...maintentancemaster,
                          location: e.value,
                          assetmaterial: "Please Select Material",
                          problem: "Please Select Problem",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Material<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={materialOpt?.filter(
                        (data) =>
                          data.company === maintentancemaster.company &&
                          data.branch === maintentancemaster.branch &&
                          data.unit === maintentancemaster.unit &&
                          data.floor === maintentancemaster.floor &&
                          data.area === maintentancemaster.area &&
                          (maintentancemaster.location != "ALL" ? (data.location === maintentancemaster.location) :
                            locations.map(item => item.value).includes(data.location))
                      )}
                      value={{
                        label: maintentancemaster.assetmaterial,
                        value: maintentancemaster.assetmaterial,
                      }}
                      onChange={(e) => {
                        setMaintentancemaster({
                          ...maintentancemaster,
                          assetmaterial: e.value,
                          material: e.material,
                          problem: "Please Select Problem",
                        });

                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Problem<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      // options={problems}
                      options={
                        Array.from(
                          new Set(
                            problems
                              .filter(
                                (subpro) =>
                                  // console.log(subpro.material, maintentancemaster.assetmaterial.split("-")[0], "123"),
                                  subpro.material === maintentancemaster.material
                              )
                              .map((t) => ({
                                ...t,
                                label: t.problem,
                                value: t.problem,
                              }))

                          )
                        )
                      }
                      styles={colourStyles}
                      value={{
                        label: maintentancemaster.problem,
                        value: maintentancemaster.problem,
                      }}
                      onChange={(e) => {
                        setMaintentancemaster({
                          ...maintentancemaster,
                          problem: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <br />

              <Grid container>
                <Grid item md={3} xs={12} sm={6}>
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
                <Grid item md={3} xs={12} sm={6}>
                  <Button sx={buttonStyles.btncancel} onClick={handleclear}>
                    Clear
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </>
      )}

      <br />

      <>
        <Box sx={userStyle.container}>
          {/* ******************************************************EXPORT Buttons****************************************************** */}
          <Grid item xs={8}>
            <Typography sx={userStyle.importheadtext}>
              Asset Repair List
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
                  <MenuItem value={assetdetails?.length}>All</MenuItem>
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
                {isUserRoleCompare?.includes("excelrepairasset") && (
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
                {isUserRoleCompare?.includes("csvrepairasset") && (
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
                {isUserRoleCompare?.includes("printrepairasset") && (
                  <>
                    <Button sx={userStyle.buttongrp} onClick={handleprintNear}>
                      &ensp;
                      <FaPrint />
                      &ensp;Print&ensp;
                    </Button>
                  </>
                )}
                {isUserRoleCompare?.includes("pdfrepairasset") && (
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
                {isUserRoleCompare?.includes("imagerepairasset") && (
                  <>
                    <Button
                      sx={userStyle.buttongrp}
                      onClick={handleCaptureImagenear}
                    >
                      {" "}
                      <ImageIcon
                        sx={{ fontSize: "15px" }}
                      /> &ensp;Image&ensp;{" "}
                    </Button>
                  </>
                )}
              </Box>
            </Grid>
            <Grid item md={2} xs={12} sm={12}>

              <AggregatedSearchBar
                columnDataTable={columnDataTable}
                setItems={setItems}
                addSerialNumber={addSerialNumber}
                setPage={setPage}
                maindatas={assetdetails}
                setSearchedString={setSearchedString}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                paginated={false}
                totalDatas={assetdetails}
              />
            </Grid>
          </Grid>
          <br />
          <Button
            sx={userStyle.buttongrp}
            onClick={handleShowAllColumns}
          >
            Show All Columns
          </Button>
          &ensp;
          <Button
            sx={userStyle.buttongrp}
            onClick={handleOpenManageColumnsNeartat}
          >
            Manage Columns
          </Button>
          &ensp;
          <br />
          <br />
          {projectCheck ? (
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
              <Box style={{ width: "100%", overflowY: "hidden" }}>
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
                    // totalDatas={totalDatas}
                    searchQuery={searchedString}
                    handleShowAllColumns={handleShowAllColumns}
                    setFilteredRowData={setFilteredRowData}
                    filteredRowData={filteredRowData}
                    setFilteredChanges={setFilteredChanges}
                    filteredChanges={filteredChanges}
                    gridRefTableImg={gridRefTableImg}
                    itemsList={assetdetails}
                  />
                </>
              </Box>
            </>
          )}
          {/* ****** Table End ****** */}
        </Box>
      </>

      <Popover
        id={idneartat}
        open={isManageColumnsOpenNeartat}
        anchorEl={anchorElNeartat}
        onClose={handleCloseManageColumnsNeartat}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        {manageColumnsContent}
      </Popover>


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

        itemsTwo={assetdetails ?? []}
        filename={"AssetRepair"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRefNear}
      />

      {/* EXTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}

export default AssetRepair;
