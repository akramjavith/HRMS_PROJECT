import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Popover,
  Select,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TextField,
  Typography,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import * as FileSaver from "file-saver";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";
import { handleApiError } from "../../../components/Errorhandling";
import Headtitle from "../../../components/Headtitle";
import { StyledTableCell, StyledTableRow } from "../../../components/Table";
import {
  AuthContext,
  UserRoleAccessContext,
} from "../../../context/Appcontext";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
import MessageAlert from "../../../components/MessageAlert";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { NotificationContainer } from "react-notifications";
import AlertDialog from "../../../components/Alert";
import PageHeading from "../../../components/PageHeading";
import { BASE_URL } from "../../../services/Authservice";
import domtoimage from 'dom-to-image';
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
import ExportData from "../../../components/ExportData";

const Loader = ({ loading, message }) => {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={loading}
    >
      <div style={{ textAlign: "center" }}>
        <CircularProgress sx={{ color: "#edf1f7" }} />
        <Typography variant="h6" sx={{ mt: 2, color: "#edf1f7" }}>
          {message}
        </Typography>
      </div>
    </Backdrop>
  );
};

function AssetStatusRecovery() {
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
  let exportColumnNames = [
    "Name",
    "Company",
    "Branch",
    "Unit",
    "Empcode",
    "Team",
    "Department",
    "Asset Material",
  ];
  let exportRowValues = [
    "empname",
    "company",
    "branch",
    "unit",
    "empcode",
    "team",
    "department",
    "assetmaterial",
  ];
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const handleClickOpenPopup = () => {
    setOpenPopup(true);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const [roundmasterEdit, setRoundmasterEdit] = useState({});

  const [openview, setOpenview] = useState(false);
  const handleClickOpenview = () => {
    setOpenview(true);
  };

  const handleCloseview = () => {
    setOpenview(false);
  };

  const setViewData = (datas) => {
    setRoundmasterEdit(datas);
    handleClickOpenview();
  };

  const [openNew, setOpenNew] = useState(false);
  const [selectedValueNew, setSelectedValueNew] = useState("");

  const handleClickOpenNew = () => {
    setOpenNew(true);
  };

  const handleCloseNew = () => {
    setOpenNew(false);
  };

  const handleSelectChangeNew = (event) => {
    setSelectedValueNew(event.target.value);
  };

  // Convert data URI to Blob
  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const handleViewImageSubEdit = (data) => {
    const blob = dataURItoBlob(data.uploadedimage);
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl);
  };

  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Please Wait...!");

  const gridRef = useRef(null);
  const gridRef1 = useRef(null);
  const [vendorAuto, setVendorAuto] = useState("");

  const [employees, setEmployees] = useState([]);
  const [employeeApproved, setemployeeApproved] = useState([]);
  const [pageApproved, setPageApproved] = useState(1);
  const [pageSizeApproved, setPageApprovedSize] = useState(10);

  const [isBoardingApproved, setIsBoardingApproved] = useState(false);

  // let username = isUserRoleAccess.name
  // const id = useParams().id
  const {
    isUserRoleAccess,
    isUserRoleCompare,
    pageName,
    setPageName,
    isAssignBranch,
    buttonStyles,
  } = useContext(UserRoleAccessContext);
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
          data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.mainpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
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
      }));

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { auth, setAuth } = useContext(AuthContext);

  let today = new Date();

  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + "-" + mm + "-" + dd;

  const [isBoarding, setIsBoarding] = useState(false);

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

  // get single row to view....


  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImageApproved = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Assest Recovery Status List.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };
  // clipboard
  const [copiedDataApproved, setCopiedDataApproved] = useState("");

  // State for manage columns search query
  const [searchQueryManageApproved, setSearchQueryManageApproved] =
    useState("");
  // Manage Columns
  const [isManageColumnsOpenApproved, setManageColumnsOpenApproved] =
    useState(false);
  const [anchorElApproved, setAnchorElApproved] = useState(null);
  const handleOpenManageColumnsApproved = (event) => {
    setAnchorElApproved(event.currentTarget);
    setManageColumnsOpenApproved(true);
  };
  const handleCloseManageColumnsApproved = () => {
    setManageColumnsOpenApproved(false);
    setSearchQueryManageApproved("");
  };

  const openApproved = Boolean(anchorElApproved);
  const idApproved = openApproved ? "simple-popover" : undefined;

  const [selectedRowsApproved, setSelectedRowsApproved] = useState([]);

  // State for manage columns search query
  const [searchQueryManage, setSearchQueryManage] = useState("");

  // Manage Columns
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
    setSearchQueryManage("");
  };

  const open = Boolean(anchorEl);
  const ids = open ? "simple-popover" : undefined;

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    checkbox: true,
    actions: true,
    serialNumber: true,
    company: true,
    branch: true,
    unit: true,
    empname: true,
    empcode: true,
    department: true,
    noticedate: true,
    reasonleavingname: true,
    status: true,
    team: true,
    files: true,
    releasedate: true,
    approved: true,
    requestdate: true,
    reject: true,
    recheck: true,
    cancel: true,
    continue: true,
    upload: true,
    requestdatereason: true,
    scheduleinterview: true,
    viewstatus: true,
    username: true,
    password: true,
    scheduledat: true,
    confirmationstatus: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
    setLoading(false);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  //------------------------------------------------------

  const [fileFormat, setFormat] = useState("xl");

  //print...
  const componentRef = useRef();

  //table entries ..,.
  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = employees?.map((item, index) => {
      return {
        ...item,
        serialNumber: index + 1,
      };
    });
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [employees]);

  //datatable....
  const [searchQuery, setSearchQuery] = useState("");

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

  const totalPages = Math.ceil(employees.length / pageSize);

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

  const initialColumnVisibilityApproved = {
    checkbox: true,
    actions: true,
    serialNumber: true,
    company: true,
    branch: true,
    unit: true,
    team: true,
    empname: true,
    empcode: true,
    department: true,
    date: true,
    reason: true,
    document: true,
    status: true,
    approvedthrough: true,
    reasonleavingname: true,
    releasedate: true,
    files: true,
    cancel: true,
    continue: true,
    scheduleinterview: true,
    viewstatus: true,
    username: true,
    password: true,
    roundlink: true,
    scheduledat: true,
    viewstatusnew: true,
    confirmationstatus: true,
    assetmaterial: true,
  };

  // Show all columns
  const [columnVisibilityApproved, setColumnVisibilityApproved] = useState(
    initialColumnVisibilityApproved
  );

  useEffect(() => { }, [isFilterOpen2]);

  //print...
  const componentRefApproved = useRef();
  const handleprintApproved = useReactToPrint({
    content: () => componentRefApproved.current,
    documentTitle: "Assest Recovery Status List",
    pageStyle: "print",
  });

  //table entries ..,.
  const [itemsApproved, setItemsApproved] = useState([]);
  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTable = useRef(null);

  const addSerialNumberApproved = (datas) => {

    setItemsApproved(datas);
  };

  useEffect(() => {
    addSerialNumberApproved(employeeApproved);
  }, [employeeApproved]);

  //table sorting
  const [sortingApproved, setSortingApproved] = useState({
    column: "",
    direction: "",
  });

  itemsApproved.sort((a, b) => {
    if (sortingApproved.direction === "asc") {
      return a[sortingApproved.column] > b[sortingApproved.column] ? 1 : -1;
    } else if (sortingApproved.direction === "desc") {
      return a[sortingApproved.column] < b[sortingApproved.column] ? 1 : -1;
    }
    return 0;
  });

  //Datatable
  const handlePageChangeApproved = (newPage) => {
    setPageApproved(newPage);
  };

  const handlePageSizeChangeApproved = (event) => {
    setPageApprovedSize(Number(event.target.value));
    setPageApproved(1);
  };

  //datatable....
  const [searchQueryApproved, setSearchQueryApproved] = useState("");
  const handleSearchChangeApproved = (event) => {
    setSearchQueryApproved(event.target.value);
  };

  // Split the search query into individual terms
  const searchTermsApproved = searchQueryApproved.toLowerCase().split(" ");

  // Modify the filtering logic to check each term
  const filteredDatasApproved = itemsApproved?.filter((item) => {
    return searchTermsApproved.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
  });

  const filteredDataApproved = filteredDatasApproved.slice(
    (pageApproved - 1) * pageSizeApproved,
    pageApproved * pageSizeApproved
  );

  const totalPagesApproved = Math.ceil(
    employeeApproved.length / pageSizeApproved
  );

  const visiblePagesApproved = Math.min(totalPagesApproved, 3);

  const firstVisiblePageApproved = Math.max(1, pageApproved - 1);
  const lastVisiblePageApproved = Math.min(
    firstVisiblePageApproved + visiblePagesApproved - 1,
    totalPagesApproved
  );

  const pageNumbersApproved = [];

  for (let i = firstVisiblePageApproved; i <= lastVisiblePageApproved; i++) {
    pageNumbersApproved.push(i);
  }

  const [selectAllCheckedApproved, setSelectAllCheckedApproved] =
    useState(false);

  const CheckboxHeaderApproved = ({
    selectAllCheckedApproved,
    onSelectAll,
  }) => (
    <div>
      <Checkbox checked={selectAllCheckedApproved} onChange={onSelectAll} />
    </div>
  );

  const sendRequestReason = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.put(
        `${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${getDetails?.id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          exitstatus: Boolean(true),
          confirmationstatus: String(selectedValueNew),
        }
      );

      await fetchUnassignedCandidates();

      handleCloseNew();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const fetchUnassignedCandidates = async () => {
    setPageName(!pageName);
    try {
      const [res, resNotEmp, resAsset] = await Promise.all([
        axios.get(SERVICE.NOTICEPERIODAPPLY, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.get(SERVICE.ALLNOTINEMPLOYEES, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.get(SERVICE.EMPLOYEEASSET, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
      ]);

      let ans = res?.data?.noticeperiodapply
        .filter(
          (data) =>
            data.approvedStatus === "true" &&
            data.cancelstatus === false &&
            data.continuestatus === false
        )
        .map((item) => ({ ...item, companyname: item?.empname }));

      let recoveredDatas = resAsset?.data?.employeeassets
        ?.filter((item) => item.status === "recovered")
        .filter((datanew) => {
          return (
            datanew !== false &&
            accessbranch?.some(
              (item) =>
                item?.company === datanew?.company &&
                item?.branch === datanew?.branch &&
                item?.unit === datanew?.unit
            )
          );
        });

      let mergedDatas = [...ans, ...resNotEmp?.data?.allinterns];
      let filteredDatas = mergedDatas
        ?.map((data) => {
          let foundData = resAsset?.data?.employeeassets
            ?.filter((item) => item.status !== "recovered")
            ?.find((itemnew) =>
              itemnew?.employeenameto?.includes(data?.companyname)
            );
          if (foundData) {
            return {
              ...data,
              assetmaterial: foundData?.assetmaterial,
              assetid: foundData?._id,
              employeenameto: foundData?.employeenameto,
            };
          }
          return false;
        })
        .filter((datanew) => {
          return (
            datanew !== false &&
            accessbranch?.some(
              (item) =>
                item?.company === datanew?.company &&
                item?.branch === datanew?.branch &&
                item?.unit === datanew?.unit
            )
          );
        });

      const finalData = [...filteredDatas, ...recoveredDatas]

      const itemsWithSerialNumber = finalData?.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
        id: item._id,
        empname: item.companyname,
        empcode: item.empcode,

        assetid: item.assetid,

        team: item.team,
        department: item.department,
        noticedate: item.noticedate,
        reasonleavingname: item.reasonleavingname,
        status: "Approved",
        exitstatus: item.exitstatus,
        approvedthrough: item.approvedthrough,
        username: item.username,
        password: item.password,
        interviewscheduled: item.interviewscheduled,
        testname: item.testname,
        interviewForm: item.interviewForm,
        confirmationstatus: item.confirmationstatus,

        company: item.company,
        branch: item.branch,
        unit: item.unit,
        employeenameto: item.employeenameto,
        assetmaterial: item.assetmaterial,
        floor: item.floor,
        location: item.location,
        area: item.area,
        assetmaterialcheck: item.assetmaterialcheck,
        workstation: item.workstation,
        uniqueid: item.uniqueid,
        assigntime: item.assigntime,
        assigndate: item.assigndate,
        companyto: item.companyto,
        branchto: item.branchto,
        unitto: item.unitto,
        teamto: item.teamto,
        statusnew: item.status,
      }));

      setemployeeApproved(itemsWithSerialNumber);
      setIsBoardingApproved(true);

      setIsBoarding(true);
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
    fetchUnassignedCandidates();
  }, [vendorAuto]);

  const [getDetails, setGetDetails] = useState([]);
  const getCodeList = async (details) => {
    let filteredDatas = details?.employeenameto?.filter(
      (item) => item !== details?.companyname
    );
    setGetDetails(details);
    setPageName(!pageName);
    try {
      if (filteredDatas?.length > 0) {
        await axios.put(
          `${SERVICE.EMPLOYEEASSET_SINGLE}/${details?.assetid}`,
          {
            employeenameto: filteredDatas,
          },
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          }
        );
        await axios.post(
          `${SERVICE.EMPLOYEEASSET_CREATE}`,
          {
            company: details.company,
            branch: details.branch,
            unit: details.unit,
            employeenameto: details.employeenameto,
            assetmaterial: details.assetmaterial,
            floor: details.floor,
            location: details.location,
            area: details.area,
            assetmaterialcheck: details.assetmaterialcheck,
            workstation: details.workstation,
            uniqueid: details.uniqueid,
            assigntime: details.assigntime,
            assigndate: details.assigndate,
            companyto: details.companyto,
            branchto: details.branchto,
            unitto: details.unitto,
            teamto: details.teamto,
            empcode: details.empcode,
            team: details.team,
            department: details.department,
            companyname: details.empname,
            status: "recovered",
          },
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          }
        );
      } else {
        await axios.delete(
          `${SERVICE.EMPLOYEEASSET_SINGLE}/${details?.assetid}`,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          }
        );
        await axios.post(
          `${SERVICE.EMPLOYEEASSET_CREATE}`,
          {
            company: details.company,
            branch: details.branch,
            unit: details.unit,
            employeenameto: details.employeenameto,
            assetmaterial: details.assetmaterial,
            floor: details.floor,
            location: details.location,
            area: details.area,
            assetmaterialcheck: details.assetmaterialcheck,
            workstation: details.workstation,
            uniqueid: details.uniqueid,
            assigntime: details.assigntime,
            assigndate: details.assigndate,
            companyto: details.companyto,
            branchto: details.branchto,
            unitto: details.unitto,
            teamto: details.teamto,
            empcode: details.empcode,
            team: details.team,
            department: details.department,
            companyname: details.empname,
            status: "recovered",
          },
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          }
        );
      }
      setPopupContent("Transfered Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setFilteredChanges(null)
      setFilteredRowData([]);
      await fetchUnassignedCandidates();
    } catch (err) {
      setLoading(false);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  // Table start colum and row
  // Define columnsApproved for the DataGrid
  const columnDataTableApproved = [
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 70,
      hide: !columnVisibilityApproved.serialNumber,
      headerClassName: "bold-header",
      pinned: "left",
      lockPinned: true,
    },
    {
      field: "scheduleinterview",
      headerName: "Change Status",
      flex: 0,
      width: 200,
      sortable: false,
      hide: !columnVisibility.scheduleinterview,
      pinned: "left",
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {params?.data?.statusnew === "recovered" ? (
            <>
              <Grid item md={4} xs={12} sm={12}>
                <div
                  style={{
                    color: "#fff",
                    border: "1px solid #76b852",
                    padding: "2px 20px",
                    borderRadius: "20px",
                    transition: "background-color 0.3s",
                    cursor: "pointer",
                    backgroundColor: "#76b852",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#fff";
                    e.target.style.color = "#76b852";
                  }} // Change background color on hover
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "#76b852";
                    e.target.style.color = "#fff";
                  }}
                  onClick={() => { }}
                >
                  Recovered
                </div>
              </Grid>
            </>
          ) : (
            <>
              <Grid item md={4} xs={12} sm={12}>
                <div
                  style={{
                    color: "#fff",
                    border: "1px solid #0082c8",
                    padding: "2px 20px",
                    borderRadius: "20px",
                    transition: "background-color 0.3s",
                    cursor: "pointer",
                    backgroundColor: "#0082c8",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#50a7c2";
                    e.target.style.color = "#fff";
                  }} // Change background color on hover
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "#0082c8";
                    e.target.style.color = "#fff";
                  }}
                  onClick={() => {
                    getCodeList(params?.data);
                  }}
                >
                  Transfer
                </div>
              </Grid>
            </>
          )}
        </Grid>
      ),
    },
    {
      field: "empname",
      headerName: "Name",
      flex: 0,
      width: 150,
      hide: !columnVisibilityApproved.empname,
      headerClassName: "bold-header",
      pinned: "left",
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 120,
      hide: !columnVisibilityApproved.company,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 120,
      hide: !columnVisibilityApproved.branch,
      headerClassName: "bold-header",
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 120,
      hide: !columnVisibilityApproved.unit,
      headerClassName: "bold-header",
    },

    {
      field: "empcode",
      headerName: "Empcode",
      flex: 0,
      width: 120,
      hide: !columnVisibilityApproved.empcode,
      headerClassName: "bold-header",
    },
    {
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 100,
      hide: !columnVisibilityApproved.team,
      headerClassName: "bold-header",
    },
    {
      field: "department",
      headerName: "Department",
      flex: 0,
      width: 150,
      hide: !columnVisibilityApproved.department,
      headerClassName: "bold-header",
    },
    {
      field: "assetmaterial",
      headerName: "Asset Material",
      flex: 0,
      width: 200,
      hide: !columnVisibilityApproved.assetmaterial,
      headerClassName: "bold-header",
    },
  ];

  // Create a data data object for the DataGrid
  const rowDataTableApproved = filteredDataApproved.map((notice, index) => {
    return {
      ...notice,
      id: notice.id,
      serialNumber: notice.serialNumber,
      company: notice.company,
      branch: notice.branch,
      unit: notice.unit,
      empname: notice.empname,
      empcode: notice.empcode,
      team: notice.team,
      department: notice.department,
      noticedate: notice.noticedate,
      reasonleavingname: notice.reasonleavingname,
      exitstatus: notice.exitstatus,
      status: notice.status,
      approvedthrough: notice.approvedthrough,
      username: notice.username,
      password: notice.password,
      interviewscheduled: notice.interviewscheduled,
      roundlink: `${BASE_URL}/interview/exitinterview/${notice._id}/${notice.testname}`,
      scheduledat:
        notice?.date && notice?.time ? `${notice?.date}/${notice?.time}` : "",
      testname: notice.testname,
      interviewForm: notice.interviewForm,
      confirmationstatus: notice.confirmationstatus,
      assetmaterial: notice.assetmaterial,
      assetid: notice.assetid,
      employeenameto: notice.employeenameto,

      floor: notice.floor,
      location: notice.location,
      area: notice.area,
      assetmaterialcheck: notice.assetmaterialcheck,
      workstation: notice.workstation,
      uniqueid: notice.uniqueid,
      assigntime: notice.assigntime,
      assigndate: notice.assigndate,
      companyto: notice.companyto,
      branchto: notice.branchto,
      unitto: notice.unitto,
      teamto: notice.teamto,
      statusnew: notice.statusnew,
    };
  });
  const handleShowAllColumns = () => {
    setColumnVisibilityApproved(initialColumnVisibilityApproved);
  };
  const handleShowAllcolumnsApproved = () => {
    setColumnVisibilityApproved(initialColumnVisibilityApproved);
  };

  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem("columnVisibilityApproved");
    if (savedVisibility) {
      setColumnVisibilityApproved(JSON.parse(savedVisibility));
    }
  }, []);

  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem(
      "columnVisibilityApproved",
      JSON.stringify(columnVisibilityApproved)
    );
  }, [columnVisibilityApproved]);
  // Manage Columns functionality
  const toggleColumnVisibilityApproved = (field) => {
    setColumnVisibilityApproved((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };
  // Function to filter columns based on search query
  const filteredColumnsApproved = columnDataTableApproved.filter((column) =>
    column.headerName
      .toLowerCase()
      .includes(searchQueryManageApproved.toLowerCase())
  );
  // JSX for the "Manage Columns" popover content
  const manageColumnsContentApproved = (
    <Box
      sx={{
        padding: "10px",
        minWidth: "325px",
        "& .MuiDialogContent-root": { padding: "10px 0" },
      }}
    >
      <Typography variant="h6">Manage Columns</Typography>
      <IconButton
        aria-label="close"
        onClick={handleCloseManageColumnsApproved}
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
          value={searchQueryManageApproved}
          onChange={(e) => setSearchQueryManageApproved(e.target.value)}
          sx={{ marginBottom: 5, position: "absolute" }}
        />
      </Box>
      <br />
      <br />
      <DialogContent
        sx={{ minWidth: "auto", height: "200px", position: "relative" }}
      >
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumnsApproved?.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={
                  <Switch
                    sx={{ marginTop: "-5px" }}
                    size="small"
                    checked={columnVisibilityApproved[column.field]}
                    onChange={() =>
                      toggleColumnVisibilityApproved(column.field)
                    }
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
              onClick={() =>
                setColumnVisibilityApproved(initialColumnVisibilityApproved)
              }
            >
              Show All
            </Button>
          </Grid>
          <Grid item md={4}></Grid>
          <Grid item md={4}>
            <Button
              variant="text"
              sx={{ textTransform: "none" }}
              onClick={() => setColumnVisibilityApproved({})}
            >
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );
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
      pagename: String("Asset Status Recovery List"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),

      addedby: [
        {
          name: String(isUserRoleAccess?.companyname),
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

  return (
    <Box>
      {/* ****** Header Content ****** */}
      <Headtitle title={"ASSET STATUS RECOVERY LIST"} />
      <NotificationContainer />
      <PageHeading
        title="Asset Status Recovery List"
        modulename="Interview"
        submodulename="Exit Interview"
        mainpagename="Asset Status Recovery List"
        subpagename=""
        subsubpagename=""
      />

      <br />
      {isUserRoleCompare?.includes("lassetstatusrecoverylist") && (
        <>
          <Box sx={userStyle.container}>
            <br />
            <Typography sx={userStyle.HeaderText}>
              Asset Status Recovery List
            </Typography>

            <Box>
              <br />
              {isUserRoleCompare?.includes("lassetstatusrecoverylist") && (
                <>
                  <Box>
                    {!isBoardingApproved ? (
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
                        <br />
                        <br />
                        <Grid container sx={{ justifyContent: "center" }}>
                          <Grid>
                            {isUserRoleCompare?.includes(
                              "csvassetstatusrecoverylist"
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
                            {isUserRoleCompare?.includes(
                              "excelassetstatusrecoverylist"
                            ) && (
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
                              "printassetstatusrecoverylist"
                            ) && (
                                <>
                                  <Button
                                    sx={userStyle.buttongrp}
                                    onClick={handleprintApproved}
                                  >
                                    &ensp;
                                    <FaPrint />
                                    &ensp;Print&ensp;
                                  </Button>
                                </>
                              )}
                            {isUserRoleCompare?.includes(
                              "pdfassetstatusrecoverylist"
                            ) && (
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
                              "imageassetstatusrecoverylist"
                            ) && (
                                <Button
                                  sx={userStyle.buttongrp}
                                  onClick={handleCaptureImageApproved}
                                >
                                  {" "}
                                  <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                                  &ensp;Image&ensp;{" "}
                                </Button>
                              )}
                          </Grid>
                        </Grid>
                        <br />
                        {/* added to the pagination grid */}
                        <Grid style={userStyle.dataTablestyle}>
                          <Box>
                            <label htmlFor="pageSizeSelect">
                              Show entries:
                            </label>
                            <Select
                              id="pageSizeSelect"
                              value={pageSizeApproved}
                              onChange={handlePageSizeChangeApproved}
                              sx={{ width: "77px" }}
                            >
                              <MenuItem value={1}>1</MenuItem>
                              <MenuItem value={5}>5</MenuItem>
                              <MenuItem value={10}>10</MenuItem>
                              <MenuItem value={25}>25</MenuItem>
                              <MenuItem value={50}>50</MenuItem>
                              <MenuItem value={100}>100</MenuItem>
                              <MenuItem value={employeeApproved.length}>
                                All
                              </MenuItem>
                            </Select>
                          </Box>
                          <Box>
                            <AggregatedSearchBar
                              columnDataTable={columnDataTableApproved}
                              setItems={setItemsApproved}
                              addSerialNumber={addSerialNumberApproved}
                              setPage={setPageApproved}
                              maindatas={employeeApproved}
                              setSearchedString={setSearchedString}
                              searchQuery={searchQueryApproved}
                              setSearchQuery={setSearchQueryApproved}
                              paginated={false}
                              totalDatas={employeeApproved}
                            />
                          </Box>
                        </Grid>
                        <br />
                        {/* ****** Table Grid Container ****** */}
                        <Grid container>
                          <Grid md={4} sm={2} xs={1}></Grid>
                          <Grid
                            md={8}
                            sm={10}
                            xs={10}
                            sx={{ align: "center" }}
                          ></Grid>
                        </Grid>
                        <br />
                        {/* ****** Table start ****** */}
                        <Button
                          sx={userStyle.buttongrp}
                          onClick={() => {
                            handleShowAllcolumnsApproved();
                            setColumnVisibilityApproved(
                              initialColumnVisibilityApproved
                            );
                          }}
                        >
                          Show All Columns
                        </Button>
                        &ensp;
                        <Button
                          sx={userStyle.buttongrp}
                          onClick={handleOpenManageColumnsApproved}
                        >
                          Manage Columns
                        </Button>
                        <br />
                        <br />
                        {/* {isLoader ? ( */}
                        <>
                          <AggridTable
                            rowDataTable={rowDataTableApproved}
                            columnDataTable={columnDataTableApproved}
                            columnVisibility={columnVisibilityApproved}
                            page={pageApproved}
                            setPage={setPageApproved}
                            pageSize={pageSizeApproved}
                            totalPages={totalPagesApproved}
                            setColumnVisibility={setColumnVisibility}
                            isHandleChange={isHandleChange}
                            items={itemsApproved}
                            selectedRows={selectedRowsApproved}
                            setSelectedRows={setSelectedRowsApproved}
                            gridRefTable={gridRefTable}
                            paginated={false}
                            filteredDatas={filteredDatasApproved}
                            // totalDatas={totalProjects}
                            searchQuery={searchQueryApproved}
                            handleShowAllColumns={handleShowAllColumns}
                            setFilteredRowData={setFilteredRowData}
                            filteredRowData={filteredRowData}
                            setFilteredChanges={setFilteredChanges}
                            filteredChanges={filteredChanges}
                            gridRefTableImg={gridRefTableImg}
                            itemsList={employeeApproved}
                          />

                          {/* Manage Column */}
                          <Popover
                            id={idApproved}
                            open={isManageColumnsOpenApproved}
                            anchorEl={anchorElApproved}
                            onClose={handleCloseManageColumnsApproved}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "left",
                            }}
                          >
                            {manageColumnsContentApproved}
                          </Popover>
                        </>
                      </>
                    )}
                  </Box>
                </>
              )}
              <br />
              {/* ****** Table End ****** */}
            </Box>
          </Box>
        </>
      )}
      <br />
      {/* ****** Table End ****** */}

      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table aria-label="simple table" id="branch" ref={componentRefApproved}>
          <TableHead sx={{ fontWeight: "600" }}>
            <StyledTableRow>
              <StyledTableCell>SI.NO</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Company</StyledTableCell>
              <StyledTableCell>Branch</StyledTableCell>
              <StyledTableCell>Unit </StyledTableCell>

              <StyledTableCell>Empcode</StyledTableCell>
              <StyledTableCell>Team</StyledTableCell>
              <StyledTableCell>Department</StyledTableCell>

              <StyledTableCell>Asset Material</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {rowDataTableApproved &&
              rowDataTableApproved.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{row.empname}</StyledTableCell>
                  <StyledTableCell>{row.company} </StyledTableCell>
                  <StyledTableCell>{row.branch} </StyledTableCell>
                  <StyledTableCell> {row.unit}</StyledTableCell>

                  <StyledTableCell>{row.empcode}</StyledTableCell>
                  <StyledTableCell>{row.team}</StyledTableCell>
                  <StyledTableCell>{row.department}</StyledTableCell>

                  <StyledTableCell>{row.assetmaterial}</StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Alert Dialog */}
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
              sx={buttonStyles.buttonsubmit}
            >
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <Loader loading={loading} message={loadingMessage} />
      <NotificationContainer />

      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleCloseview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="lg"
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Response &nbsp;&nbsp; <b> {roundmasterEdit?.username} </b>
            </Typography>
            <>
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <Typography sx={userStyle.HeaderText}>
                    {" "}
                    Main Questions
                  </Typography>
                </Grid>
                <Grid item md={8} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Questions </Typography>
                  </FormControl>
                </Grid>

                <Grid item md={2} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">User Ans </Typography>
                  </FormControl>
                </Grid>

                <Grid item md={2} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Options </Typography>
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <br />
              {roundmasterEdit?.interviewForm?.map((data, index) => {
                return (
                  <>
                    <Grid container spacing={2}>
                      <Grid item md={8} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: "100%",
                            }}
                            title={data.question}
                          >
                            &nbsp;
                            {data?.uploadedimage && (
                              <>
                                <>
                                  <IconButton
                                    aria-label="view"
                                    onClick={() => {
                                      handleViewImageSubEdit(data);
                                    }}
                                  >
                                    <VisibilityOutlinedIcon
                                      sx={{ color: "#0B7CED" }}
                                    />
                                  </IconButton>
                                </>
                              </>
                            )}
                            &nbsp;{index + 1} . {data.question}
                          </Typography>
                        </FormControl>
                      </Grid>
                      <Grid item md={2} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            {data.userans
                              ?.map((t, i) => `${i + 1 + ". "}` + t)
                              .toString()}
                          </Typography>
                        </FormControl>
                      </Grid>

                      <Grid item md={2} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            {data.optionArr
                              ?.map((t, i) => `${i + 1 + ". "}` + t.options)
                              .toString()}
                          </Typography>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <br />
                  </>
                );
              })}

              {roundmasterEdit?.interviewForm?.length > 0 &&
                roundmasterEdit?.interviewForm?.some(
                  (form) => form.secondarytodo && form.secondarytodo.length > 0
                ) && (
                  <Grid container spacing={2}>
                    <Grid item md={12} xs={12} sm={12}>
                      <Typography sx={userStyle.HeaderText}>
                        {" "}
                        Sub Questions
                      </Typography>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">Questions </Typography>
                      </FormControl>
                    </Grid>

                    <Grid item md={2} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">User Ans </Typography>
                      </FormControl>
                    </Grid>

                    <Grid item md={2} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">Options </Typography>
                      </FormControl>
                    </Grid>
                    <Grid item md={0.5} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">Status </Typography>
                      </FormControl>
                    </Grid>
                  </Grid>
                )}
              <br />
              {roundmasterEdit?.interviewForm?.length > 0 &&
                roundmasterEdit?.interviewForm?.map((data, index) => {
                  return data?.secondarytodo?.map((item, ind) => (
                    <>
                      <Grid container spacing={2}>
                        <Grid item md={4} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                maxWidth: "100%",
                              }}
                              title={item.question}
                            >
                              {item.uploadedimage && (
                                <>
                                  <>
                                    <IconButton
                                      aria-label="view"
                                      onClick={() => {
                                        handleViewImageSubEdit(item);
                                      }}
                                    >
                                      <VisibilityOutlinedIcon
                                        sx={{ color: "#0B7CED" }}
                                      />
                                    </IconButton>
                                  </>
                                </>
                              )}
                              &nbsp; {index + 1}.{ind + 1} {item?.question}
                            </Typography>
                          </FormControl>
                        </Grid>
                        <Grid item md={2} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              {item?.userans
                                ?.map((t, i) => `${i + 1 + ". "}` + t + " ")
                                .toString()}
                            </Typography>
                          </FormControl>
                        </Grid>

                        <Grid item md={2} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              {item?.optionslist
                                ?.map(
                                  (t, i) => `${i + 1 + ". "}` + t?.answer + " "
                                )
                                .toString()}
                            </Typography>
                          </FormControl>
                        </Grid>

                        <Grid item md={0.5} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              {" "}
                              {item?.userans?.filter((item) => item !== "")
                                ?.length > 0 &&
                                item?.optionslist
                                  ?.map((t, i) => t?.answer)
                                  ?.includes("NOANSWER") ? (
                                <CheckCircleIcon color="success" />
                              ) : item?.type === "Date Range" &&
                                item?.userans?.length > 0 &&
                                new Date(item?.userans[0]) >=
                                new Date(item?.optionslist[0].answer) &&
                                new Date(item?.userans[0]) <=
                                new Date(item?.optionslist[1].answer) ? (
                                <CheckCircleIcon color="success" />
                              ) : item?.type !== "Date Range" &&
                                item?.userans?.filter((item) => item !== "")
                                  ?.length > 0 &&
                                item?.optionslist
                                  ?.filter((data) =>
                                    item?.userans.includes(data?.answer)
                                  )
                                  ?.map((t, i) => t.status)
                                  .filter((item) => item.trim() === "Eligible")
                                  .length >=
                                item.optionslist
                                  ?.filter(
                                    (data) =>
                                      item?.userans.includes(data?.answer) &&
                                      (data?.status === "Not-Eligible" ||
                                        data?.status === "Manual Decision")
                                  )
                                  ?.map((t, i) => t.status).length ? (
                                <CheckCircleIcon color="success" />
                              ) : (
                                <CancelIcon color="error" />
                              )}
                            </Typography>
                          </FormControl>
                        </Grid>
                      </Grid>
                      <br />
                    </>
                  ));
                })}
            </>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} sm={2} xs={12}>
                {" "}
                <Button sx={buttonStyles.btncancel} onClick={handleCloseview}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </>
        </Box>
      </Dialog>

      <Dialog open={openNew} onClose={handleCloseNew}>
        <DialogTitle>Select an Option</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel id="select-label">Options</InputLabel>
            <Select
              labelId="select-label"
              value={selectedValueNew}
              onChange={handleSelectChangeNew}
              label="Options"
            >
              <MenuItem value={"confirm"}>confirm</MenuItem>
              <MenuItem value={"continue"}>continue</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNew} sx={buttonStyles.btncancel}>Cancel</Button>
          <Button onClick={sendRequestReason} variant="contained" sx={buttonStyles.buttonsubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
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
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTableApproved) ?? []}
        itemsTwo={employeeApproved ?? []}
        filename={"Asset Status Recovery List"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRefApproved}
      />
      <MessageAlert
        openPopup={openPopupMalert}
        handleClosePopup={handleClosePopupMalert}
        popupContent={popupContentMalert}
        popupSeverity={popupSeverityMalert}
      />
    </Box>
  );
}

export default AssetStatusRecovery;
