import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, MenuItem, Dialog,
  DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TextareaAutosize,
  TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton
} from "@mui/material";
import { userStyle, colourStyles } from "../../pageStyle";
import Selects from "react-select";
import { FaPrint, FaFilePdf } from "react-icons/fa";
// import { ExportXL, ExportCSV } from "../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import axios from "axios";
import { SERVICE } from '../../services/Baseservice';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import moment from 'moment-timezone';
import { UserRoleAccessContext, AuthContext } from '../../context/Appcontext';
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from 'react-loader-spinner';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/system';
import Resizable from 'react-resizable';
import { saveAs } from "file-saver";
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LoadingButton from "@mui/lab/LoadingButton";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import Pagination from '../../components/Pagination';
import AlertDialog from "../../components/Alert";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import { handleApiError } from "../../components/Errorhandling";
import PageHeading from "../../components/PageHeading";
import { Space, TimePicker } from "antd";
import dayjs from "dayjs";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';


function EBReadingDetails() {
  const [checkServicemasterBeforeDate, setcheckServicemasterBeforeDate] = useState(0);

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
    setloadingdeloverall(false);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  let exportColumnNames = [
    "Company",
    "Branch",
    "Unit",
    "Floor",
    "Area",
    "Service",
    "Date",
    "Kwh",
    "kvah",
    "Kwhunit",
    "kvahunit",
    "PF",
    "MD",
    "Mode",
    "Description",
  ];
  let exportRowValues = [
    "company",
    "branch",
    "unit",
    "floor",
    "area",
    "servicenumber",
    "date",
    "openkwh",
    "kvah",
    "kwhunit",
    "kvahunit",
    "pf",
    "md",
    "readingmode",
    "description",
  ];


  const pathname = window.location.pathname;

  //Access Module

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("EB Services Master"),
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



  const [loadingdeloverall, setloadingdeloverall] = useState(false);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);



  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };


  const [overallFilterdata, setOverallFilterdata] = useState([]);
  const [totalProjects, setTotalProjects] = useState(0);
  // const [totalPages, setTotalPages] = useState(0);


  let today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + "-" + mm + "-" + dd;









  const [ebservices, setEbServices] = useState([])
  const [ebservicesEdit, setEbServicesEdit] = useState("")


  const [readingFilter, setReadingFilter] = useState("")
  const [readingFilterKvh, setReadingFilterKVH] = useState("")

  const [readingFilterEdit, setReadingFilterEdit] = useState("")
  const [readingFilterKvhEdit, setReadingFilterKVHEdit] = useState("")

  const [futureupdate, setFutureUpdate] = useState({ id: "", openkwh: "", kvah: "", kwhunit: "", kvahunit: "" })
  const [futureupdatearr, setFutureUpdatearr] = useState([])

  const [pfdifference, setPfdifference] = useState("")



  const fetchEbServiceMaster = async (servicenumber, floor, area, e) => {
    try {
      let res_type = await axios.post(SERVICE.EBSERVICEMASTERLIVE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assignbranch: accessbranch,
      });

      let result = res_type.data.ebservicemasters.find((d) =>
        d.company === ebreadingdetail.company &&
        d.branch === ebreadingdetail.branch &&
        d.unit === ebreadingdetail.unit &&
        d.floor === floor &&
        (d.area.includes(area)
          &&
          d.servicenumber === servicenumber

        )

      );


      let answer = e === "Daily Closing" ? result?.allowedunit : e === "Month Closing" ? result?.allowedunitmonth : ""

      setEbServices(answer)



    } catch (err) {

      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // Edit status'
  const fetchEbServiceMasterEdit = async (servicenumber, floor, area, e) => {
    try {
      let res_type = await axios.post(SERVICE.EBSERVICEMASTERLIVE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assignbranch: accessbranch,
      });

      let result = res_type.data.ebservicemasters.find((d) =>
        d.company === ebreadingdetailEdit.company &&
        d.branch === ebreadingdetailEdit.branch &&
        d.unit === ebreadingdetailEdit.unit &&
        d.floor === floor &&
        (d.area.includes(area)
          &&
          d.servicenumber === servicenumber

        )

      );


      let answer = e === "Daily Closing" ? result?.allowedunit : e === "Month Closing" ? result?.allowedunitmonth : 0

      setEbServicesEdit(answer)



    } catch (err) {

      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };




  const [ebreadingdetail, setEbreadingdetail] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    floor: "Please Select Floor",
    area: "Please Select Area",
    servicenumber: "Please Select Service", readingmode: "", description: "", date: formattedDate, time: "",
    openkwh: "", kvah: "", kwhunit: "", kvahunit: "", pf: "", md: "",
    pfrphase: "", pfyphase: "", pfbphase: "", pfcurrent: "", pfaverage: "", mdrphase: "", mdyphase: "", mdbphase: "", mdcurrent: "",
    mdaverage: "",
  });

  const [ebreadingdetailEdit, setEbreadingdetailEdit] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    floor: "Please Select Floor",
    area: "Please Select Area",
    servicenumber: "Please Select Service", readingmode: "", description: "", date: formattedDate, time: "", openkwh: "", kvah: "", kwhunit: "", kvahunit: "", pf: "", md: "",
    pfrphase: "", pfyphase: "", pfbphase: "", pfcurrent: "", pfaverage: "", mdrphase: "", mdyphase: "", mdbphase: "", mdcurrent: "",
    mdaverage: "",
  })


  const handleTimeChange = (time, timeString) => {
    // Check if timeString is a valid time format
    const isValidTime = dayjs(timeString, "h:mm: A").isValid();
    if (isValidTime) {

      setEbreadingdetail({
        ...ebreadingdetail,
        time: dayjs(timeString, "h:mm A").format("HH:mm"),
        fromtime: dayjs(timeString, "h:mm A"),
        // fromtime24Hrs: dayjs(timeString, "h:mm:ss A").format("HH:mm:ss"),
      });
      fetchEbreadingdetailsFilterTime(dayjs(timeString, "h:mm A").format("HH:mm A"))

    }
  };

  const handleChangekwhreading = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setEbreadingdetail({ ...ebreadingdetail, openkwh: inputValue });
    }
  };

  const handleChangekwhreadingEdit = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setEbreadingdetailEdit({ ...ebreadingdetailEdit, openkwh: inputValue });
    }
  };

  const handleChangekvhreading = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setEbreadingdetail({ ...ebreadingdetail, kvah: inputValue });
    }
  };

  const handleChangekvhreadingEdit = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setEbreadingdetailEdit({ ...ebreadingdetailEdit, kvah: inputValue });
    }
  };

  const [serviceNumberFilter, setserviceNumberFilter] = useState([]);
  const [ebreadingdetailFilter, setEbreadingdetailFilter] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    floor: "Please Select Floor",
    materialname: "Please Select Material Name",
    servicenumber: "Please Select Service",
  });

  const [serviceNumber, setserviceNumber] = useState([]);
  const [serviceNumberEdit, setserviceNumberEdit] = useState("");
  const [ebreadingdetails, setEbreadingdetails] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [allEbreadingdetailedit, setAllEbreadingdetailedit] = useState([]);
  const [readingmode, setReadingmode] = useState("Daily Closing");
  const [readingmodeEdit, setReadingmodeEdit] = useState("");

  const [companys, setCompanys] = useState([]);
  const [branchs, setBranchs] = useState([]);
  const [units, setUnits] = useState([]);
  const [floors, setFloors] = useState([]);
  const [areas, setAreas] = useState([]);
  const [newcheckbranch, setNewcheckBranch] = useState("Choose Branch");

  const [companysEdit, setCompanysEdit] = useState([]);
  const [branchsEdit, setBranchsEdit] = useState([]);
  const [unitsEdit, setUnitsEdit] = useState([]);
  const [floorsEdit, setFloorEdit] = useState([]);
  const [areasEdit, setAreasEdit] = useState([])

  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);

  const accessbranch = isAssignBranch
    ?.map((data) => ({
      branch: data.branch,
      company: data.company,
      unit: data.unit,
    }))

  const [ebreadingdetailCheck, setEbreadingdetailcheck] = useState(false);

  const username = isUserRoleAccess.username

  const gridRef = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);


  const [searchQueryManage, setSearchQueryManage] = useState("");

  const [copiedData, setCopiedData] = useState('');


  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, 'EB Reading Details .png');
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
  const [showAlert, setShowAlert] = useState()
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
    setloadingdeloverall(false)
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
  const [anchorEl, setAnchorEl] = useState(null)

  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
    setSearchQueryManage("")
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;


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
    if ((selectedRows).includes(params.row.id)) {
      return 'custom-id-row'; // This is the custom class for rows with item.tat === 'ago'
    }
    return ''; // Return an empty string for other rows
  };


  const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    '& .MuiDataGrid-virtualScroller': {
      overflowY: 'hidden',
    },
    '& .MuiDataGrid-columnHeaderTitle': {
      fontWeight: " bold !important ",

    },
    '& .custom-id-row': {
      backgroundColor: '#1976d22b !important',
    },

    '& .MuiDataGrid-row.Mui-selected': {
      '& .custom-ago-row, & .custom-in-row, & .custom-others-row': {
        backgroundColor: 'unset !important', // Clear the background color for selected rows
      },
    },
    '&:hover': {
      '& .custom-ago-row:hover': {
        backgroundColor: '#ff00004a !important',
      },
      '& .custom-in-row:hover': {
        backgroundColor: '#ffff0061 !important',
      },
      '& .custom-others-row:hover': {
        backgroundColor: '#0080005e !important',
      },
    },
  }));

  // Show All Columns & Manage Columns 
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    company: true,
    branch: true,
    unit: true,
    floor: true,
    area: true,
    date: true,
    servicenumber: true,
    time: true,
    openkwh: true,
    kvah: true,
    kvahunit: true,
    kwhunit: true,
    pf: true,
    md: true,
    readingmode: true,
    description: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);


  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };

  const [servicemaster, setServicemaster] = useState([])

  const fetchServiceNumber = async (e) => {
    try {
      let res_freq = await axios.post(SERVICE.EBSERVICEMASTERLIVE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assignbranch: accessbranch,
      });

      let data_set = res_freq?.data?.ebservicemasters.filter((data) => e.value === data.unit);
      const branchall = [
        // { label: "ALL", value: "ALL" },
        ...data_set.map((d) => ({
          ...d,
          label: d.servicenumber,
          value: d.servicenumber,
        })),
      ];

      setserviceNumber(branchall);
    } catch (err) {

      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };


  const fetchServiceNumberall = async () => {
    try {
      let res_freq = await axios.post(SERVICE.EBSERVICEMASTERLIVE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assignbranch: accessbranch,
      });

      console.log(res_freq?.data?.ebservicemasters?.length, 'red count')
      console.log(res_freq?.data?.ebservicemasters, 'resd')
      setServicemaster(res_freq?.data?.ebservicemasters)
    } catch (err) {

      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };


  const fetchServiceNumberEdit = async (e) => {
    try {
      let res_freq = await axios.post(SERVICE.EBSERVICEMASTERLIVE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assignbranch: accessbranch,
      });

      let data_set = res_freq?.data?.ebservicemasters.filter((data) => e === data.unit);
      const branchall = [
        // { label: "ALL", value: "ALL" },
        ...data_set.map((d) => ({
          ...d,
          label: d.servicenumber,
          value: d.servicenumber,
        })),
      ];
      setserviceNumberEdit(branchall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };



  const fetchFloor = async (e) => {
    console.log(e, "eee")
    console.log(e.status, "eeestata")
    try {
      let res_freq = await axios.post(SERVICE.EBSERVICEMASTERLIVE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assignbranch: accessbranch,
      });

      let data_set = res_freq?.data?.ebservicemasters.find((data) => e.value === data.servicenumber);
      let findarea = data_set && data_set.floor
      let findarea1 = data_set && data_set.area

      const branchall = [{ label: findarea, value: findarea }]
      const branchallarea = [

        ...findarea1.map((d) => ({
          ...d,
          label: d,
          value: d,
        })),
      ];
      fetchEbServiceMaster(e.value, branchall[0]?.value, branchallarea[0]?.value, readingmode)
      setEbreadingdetail({
        ...ebreadingdetail,
        servicenumber: e.value,
        floor: branchall[0]?.value,
        area: branchallarea[0]?.value,
        status: e.status

      });
      setFloors(branchall);
      setAreas(branchallarea);
    } catch (err) {

      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchFloorEditGetCode = async (e) => {
    try {
      let res_freq = await axios.post(SERVICE.EBSERVICEMASTERLIVE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assignbranch: accessbranch,
      });

      let data_set = res_freq?.data?.ebservicemasters.find((data) => e === data.servicenumber);
      let findarea = data_set && data_set.floor
      let findarea1 = data_set && data_set.area

      const branchall = [{ label: findarea, value: findarea }]
      const branchallarea = [

        ...findarea1.map((d) => ({
          ...d,
          label: d,
          value: d,
        })),
      ];
      fetchEbServiceMasterEdit(ebreadingdetailEdit.servicenumber, branchall[0]?.value, branchallarea[0]?.value, readingmodeEdit)

      setFloorEdit(branchall);
      setAreasEdit(branchallarea);
    } catch (err) {

      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };



  useEffect(() => {
    fetchServiceNumberall();
  }, []);

  const [deleteEbreading, setDeleteEbreading] = useState("");


  const [futureupdatedelbefore, setFutureUpdatedelbefore] = useState({ id: "", openkwh: "", kvah: "", kwhunit: "", kvahunit: "" })
  const [futureupdatedelafter, setFutureUpdatedelafter] = useState({ id: "", openkwh: "", kvah: "", kwhunit: "", kvahunit: "" })
  const [futureupdatedelafterarr, setFutureUpdatedelafterarr] = useState([])
  const [futureupdatebeforearr, setFutureUpdateBeforearr] = useState([])
  const [futureUpdatedelbeforearr, setFutureUpdatedelbeforearr] = useState([])


  const rowData = async (id) => {
    setPageName(!pageName)
    let varfilter = []
    try {
      let res = await axios.get(`${SERVICE.EBREADINGDETAIL_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      let res_read = await axios.post(SERVICE.EB_SERVICEFILTER, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        company: String(res?.data?.sebreadingdetail.company),
        branch: String(res?.data?.sebreadingdetail.branch),
        unit: String(res?.data?.sebreadingdetail.unit),
        floor: String(res?.data?.sebreadingdetail.floor),
        area: String(res?.data?.sebreadingdetail.area),
        servicenumber: String(res?.data?.sebreadingdetail.servicenumber),
        date: String(res?.data?.sebreadingdetail.date),
        time: String(res?.data?.sebreadingdetail.time),
        readingmode: String(res?.data?.sebreadingdetail.readingmode),

      });

      if (res_read?.data?.ebreadingfiltertimefuture.length > 0) {

        setFutureUpdatedelafter(res_read?.data?.ebreadingfiltertimefuture[0])
        setFutureUpdatedelafterarr(res_read?.data?.ebreadingfiltertimefuture)
      }
      if (res_read?.data?.ebreadingfiltertime.length > 0) {
        setFutureUpdatedelbefore(res_read?.data?.ebreadingfiltertime[0])
        setFutureUpdatedelbeforearr(res_read?.data?.ebreadingfiltertime)
      }

      if (res_read?.data?.ebreadingfiltertimefuture.length > 1) {

        setPopupContentMalert(
          `More than two dates were Added Either Before or After the Date   ${ebreadingdetailEdit.date} Therefore, This Entry Cannot be Deleted.`
        );
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();

      } else {
        setDeleteEbreading(res?.data?.sebreadingdetail);
        handleClickOpen();
      }

    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  }

  // Alert delete popup
  let Ebreadingsid = deleteEbreading?._id;
  const delEbreading = async () => {

    setPageName(!pageName)
    try {
      if (Ebreadingsid) {

        await axios.delete(`${SERVICE.EBREADINGDETAIL_SINGLE}/${Ebreadingsid}`, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          }
        });
      }


      if (futureupdatedelafter.length >= 1 && futureUpdatedelbeforearr.length >= 1) {
        if (futureupdatedelafter && futureupdatedelafter?._id) {
          let futureid = futureupdatedelafter?._id
          let pfdiffkwh = Number(futureupdatedelafter.openkwh) - Number(futureupdatedelbefore.openkwh)
          let pfdiffkvh = Number(futureupdatedelafter.kvah) - Number(futureupdatedelbefore.kvah)
          let pfdiff = pfdiffkwh / pfdiffkvh
          let res = await axios.put(`${SERVICE.EBREADINGDETAIL_SINGLE}/${futureid}`, {
            headers: {
              'Authorization': `Bearer ${auth.APIToken}`
            },

            kwhunit: Number(futureupdatedelafter.openkwh) - Number(futureupdatedelbefore.openkwh),
            kvahunit: Number(futureupdatedelafter.kvah) - Number(futureupdatedelbefore.kvah),
            pf: pfdiff
          });

        }
        await fetchEbreadingdetails();
        // await fetchEbSort();
        handleCloseMod();
        setSelectedRows([]);
        setPage(1)

        setPopupContent("Deleted Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
      }
      else if (futureupdatedelafter.length > 1) {
        if (futureupdatedelafter && futureupdatedelafter?._id) {
          let futureid = futureupdatedelafter?._id
          let pfdiffkwh = Number(futureupdatedelafter.openkwh) - Number(futureupdatedelbefore.openkwh)
          let pfdiffkvh = Number(futureupdatedelafter.kvah) - Number(futureupdatedelbefore.kvah)
          let pfdiff = pfdiffkwh / pfdiffkvh
          let res = await axios.put(`${SERVICE.EBREADINGDETAIL_SINGLE}/${futureid}`, {
            headers: {
              'Authorization': `Bearer ${auth.APIToken}`
            },

            kwhunit: Number(futureupdatedelafter.openkwh) - Number(futureupdatedelbefore.openkwh),
            kvahunit: Number(futureupdatedelafter.kvah) - Number(futureupdatedelbefore.kvah),
            pf: pfdiff
          });

        }
        await fetchEbreadingdetails();
        // await fetchEbSort();
        handleCloseMod();
        setSelectedRows([]);
        setPage(1)

        setPopupContent("Deleted Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
      } else {
        if (futureupdatedelafter && futureupdatedelafter?._id) {
          let futureid = futureupdatedelafter?._id
          let pfdiffkwh = Number(futureupdatedelafter.openkwh) - Number(futureupdatedelbefore.openkwh)
          let pfdiffkvh = Number(futureupdatedelafter.kvah) - Number(futureupdatedelbefore.kvah)
          let pfdiff = pfdiffkwh / pfdiffkvh
          let res = await axios.put(`${SERVICE.EBREADINGDETAIL_SINGLE}/${futureid}`, {
            headers: {
              'Authorization': `Bearer ${auth.APIToken}`
            },

            kwhunit: Number(futureupdatedelafter.openkwh),
            kvahunit: Number(futureupdatedelafter.kvah),
            pf: pfdiff
          });

        }
        await fetchEbreadingdetails();
        // await fetchEbSort();
        handleCloseMod();
        setSelectedRows([]);
        setPage(1)

        setPopupContent("Deleted Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
      }
      // }
      const [year, month, day] = deleteEbreading.date.split('-');
      if (deleteEbreading.readingmode == "Daily Closing") {
        const isLastDayOfMonth = day === new Date(year, month, 0).getDate().toString();
        if (isLastDayOfMonth) {

          // Filter the array to find the record with "Month Closing" for the previous month
          const result = ebreadingdetails.find(item =>
            item.readingmode === "Month Closing"
            && item.company === deleteEbreading.company
            && item.branch === deleteEbreading.branch
            && item.unit === deleteEbreading.unit
            && item.floor === deleteEbreading.floor
            && item.area === deleteEbreading.area
            && item.servicenumber === deleteEbreading.servicenumber
            && item.date == deleteEbreading.date
          );
          // let lastvalue = result ? result : servicemasterval
          if (result) {
            let resultid = result?._id
            let res = await axios.delete(`${SERVICE.EBREADINGDETAIL_SINGLE}/${resultid}`, {
              headers: {
                'Authorization': `Bearer ${auth.APIToken}`
              },

            });
          }
        }
      }

    }
    catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };







  const delEbreadingcheckbox = async () => {
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.EBREADINGDETAIL_SINGLE}/${item}`, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          }
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);

      handleCloseModcheckbox();
      setSelectedRows([]);
      setPage(1);

      await fetchEbreadingdetails();
      // await fetchEbSort();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };


  let allowedusageunit = Number(ebservices) - Number(readingFilter)



  let allowedusageunitEdit = Number(ebservicesEdit) - Number(readingFilterEdit)



  // let status = currentusageunit < 0 ? "Greater than Allowed Unit" : currentusageunit > 0 ? "Below than Allowed Unit" : currentusageunit === 0 ? "Normal Usage Unit" : ""
  let status = allowedusageunit < 0 ? "Greater than Allowed Unit" : allowedusageunit > 0 ? "Below than Allowed Unit" : allowedusageunit === 0 ? "Normal Usage Unit" : ""



  let statusEdit = Number(ebservicesEdit) - Number(readingFilterEdit) < 0 ? "Greater than Allowed Unit" : Number(ebservicesEdit) - Number(readingFilterEdit) > 0 ? "Below than Allowed Unit" : Number(ebservicesEdit) - Number(readingFilterEdit) === 0 ? "Normal Usage Unit" : ""




  //add function 
  // const sendRequest = async () => {
  //   setPageName(!pageName)
  //   try {
  //     if (futureupdatearr.length === 1) {
  //       let subprojectscreate = await axios.post(SERVICE.EBREADINGDETAIL_CREATE, {
  //         headers: {
  //           'Authorization': `Bearer ${auth.APIToken}`
  //         },
  //         company: String(ebreadingdetail.company),
  //         branch: String(ebreadingdetail.branch),
  //         unit: String(ebreadingdetail.unit),
  //         floor: String(ebreadingdetail.floor),
  //         area: String(ebreadingdetail.area),
  //         servicenumber: String(ebreadingdetail.servicenumber),
  //         readingmode: String(readingmode),
  //         description: String(ebreadingdetail.description),
  //         date: String(ebreadingdetail.date),
  //         time: String(ebreadingdetail.time),
  //         openkwh: String(ebreadingdetail.openkwh),
  //         kvah: String(ebreadingdetail.kvah),
  //         kwhunit: readingFilter,
  //         kvahunit: readingFilterKvh,
  //         pf: pfdifference,
  //         md: String(ebreadingdetail.md),
  //         pfrphase: String(ebreadingdetail.pfrphase),
  //         pfyphase: String(ebreadingdetail.pfyphase),
  //         pfbphase: String(ebreadingdetail.pfbphase),
  //         pfcurrent: String(ebreadingdetail.pfcurrent),
  //         pfaverage: String(ebreadingdetail.pfaverage),
  //         mdrphase: String(ebreadingdetail.mdrphase),
  //         mdbphase: String(ebreadingdetail.mdbphase),
  //         mdyphase: String(ebreadingdetail.mdyphase),
  //         mdcurrent: String(ebreadingdetail.mdcurrent),
  //         mdaverage: String(ebreadingdetail.mdaverage),
  //         usageunit: ebservices,
  //         currentusageunit: allowedusageunit,
  //         currentstatus: status,
  //         addedby: [
  //           {
  //             name: String(username),
  //             date: String(new Date()),
  //           },
  //         ],
  //       })
  //       if (futureupdate && futureupdate?._id) {
  //         let futureid = futureupdate?._id
  //         let pfdiffkwh = Number(futureupdate.openkwh) - Number(ebreadingdetail.openkwh)
  //         let pfdiffkvh = Number(futureupdate.kvah) - Number(ebreadingdetail.kvah)
  //         let pfdiff = pfdiffkwh / pfdiffkvh
  //         let res = await axios.put(`${SERVICE.EBREADINGDETAIL_SINGLE}/${futureid}`, {
  //           headers: {
  //             'Authorization': `Bearer ${auth.APIToken}`
  //           },

  //           kwhunit: Number(futureupdate.openkwh) - Number(ebreadingdetail.openkwh),
  //           kvahunit: Number(futureupdate.kvah) - Number(ebreadingdetail.kvah),
  //           pf: pfdiff
  //         });
  //       }
  //       const [year, month, day] = ebreadingdetail.date.split('-');
  //       if (readingmode == "Daily Closing") {
  //         const isLastDayOfMonth = day === new Date(year, month, 0).getDate().toString();

  //         if (isLastDayOfMonth) {

  //           const previousMonth = month === 1 ? 12 : month - 1;
  //           const previousYear = month === 1 ? year - 1 : year;

  //           // Format the previous month and year as "YYYY-MM"
  //           const formattedPreviousMonth = `${previousYear}-${String(previousMonth).padStart(2, '0')}`;
  //           // Filter the array to find the record with "Month Closing" for the previous month
  //           const result = ebreadingdetails.find(item =>
  //             item.readingmode === "Month Closing"
  //             && item.company === ebreadingdetail.company
  //             && item.branch === ebreadingdetail.branch
  //             && item.unit === ebreadingdetail.unit
  //             && item.floor === ebreadingdetail.floor
  //             && item.area.includes(ebreadingdetail.area)
  //             && item.servicenumber === ebreadingdetail.servicenumber
  //             && item.date.includes(formattedPreviousMonth)
  //           );

  //           const resultcheck = ebreadingdetails.filter(item =>
  //             item.readingmode === "Month Closing"
  //             && item.date == ebreadingdetail.date
  //           );


  //           const servicemasterval = servicemaster.find(item =>
  //             item.company === ebreadingdetail.company && item.branch === ebreadingdetail.branch && item.unit === ebreadingdetail.unit
  //             && item.floor === ebreadingdetail.floor && item.area.includes(ebreadingdetail.area) && item.servicenumber === ebreadingdetail.servicenumber
  //           );
  //           let lastvalue = result ? result : servicemasterval
  //           if (lastvalue && resultcheck.length === 0) {

  //             let diffpf = (Number(ebreadingdetail.openkwh) - Number(lastvalue.openkwh)) / (Number(ebreadingdetail.kvah) - Number(lastvalue.kvah))
  //             let subprojectscreate = axios.post(SERVICE.EBREADINGDETAIL_CREATE, {
  //               headers: {
  //                 'Authorization': `Bearer ${auth.APIToken}`
  //               },
  //               company: String(ebreadingdetail.company),
  //               branch: String(ebreadingdetail.branch),
  //               unit: String(ebreadingdetail.unit),
  //               floor: String(ebreadingdetail.floor),
  //               area: String(ebreadingdetail.area),
  //               servicenumber: String(ebreadingdetail.servicenumber),
  //               readingmode: String("Month Closing"),
  //               description: String(ebreadingdetail.description),
  //               date: String(ebreadingdetail.date),
  //               time: String(ebreadingdetail.time),
  //               openkwh: String(ebreadingdetail.openkwh),
  //               kvah: String(ebreadingdetail.kvah),
  //               kwhunit: Number(ebreadingdetail.openkwh) - Number(lastvalue.openkwh),
  //               kvahunit: Number(ebreadingdetail.kvah) - Number(lastvalue.kvah),
  //               pf: diffpf,
  //               md: String(ebreadingdetail.md),
  //               pfrphase: String(ebreadingdetail.pfrphase),
  //               pfyphase: String(ebreadingdetail.pfyphase),
  //               pfbphase: String(ebreadingdetail.pfbphase),
  //               pfcurrent: String(ebreadingdetail.pfcurrent),
  //               pfaverage: String(ebreadingdetail.pfaverage),
  //               mdrphase: String(ebreadingdetail.mdrphase),
  //               mdbphase: String(ebreadingdetail.mdbphase),
  //               mdyphase: String(ebreadingdetail.mdyphase),
  //               mdcurrent: String(ebreadingdetail.mdcurrent),
  //               mdaverage: String(ebreadingdetail.mdaverage),
  //               addedby: [
  //                 {
  //                   name: String(username),
  //                   date: String(new Date()),
  //                 },
  //               ],
  //             })
  //           }
  //         }
  //       }

  //       await fetchEbreadingdetails();
  //       // await fetchEbSort();
  //       setEbreadingdetail({
  //         ...ebreadingdetail,
  //         readingmode: "", date: formattedDate, time: "", openkwh: "", kvah: "", kwhunit: "", kvahunit: "", pf: "", md: "", description: "",
  //         pfrphase: "", pfyphase: "", pfbphase: "", pfcurrent: "", pfaverage: "", mdrphase: "", mdyphase: "", mdbphase: "", mdcurrent: "",
  //         mdaverage: "",
  //       })
  //       setReadingmode("Daily Closing");
  //       setReadingFilter("")
  //       setReadingFilterKVH("")
  //       setPfdifference("")
  //       setPopupContent("Added Successfully");
  //       setPopupSeverity("success");
  //       handleClickOpenPopup();
  //       setloadingdeloverall(false)
  //     }
  //     else if (futureupdatearr.length === 0) {
  //       let subprojectscreate = await axios.post(SERVICE.EBREADINGDETAIL_CREATE, {
  //         headers: {
  //           'Authorization': `Bearer ${auth.APIToken}`
  //         },
  //         company: String(ebreadingdetail.company),
  //         branch: String(ebreadingdetail.branch),
  //         unit: String(ebreadingdetail.unit),
  //         floor: String(ebreadingdetail.floor),
  //         area: String(ebreadingdetail.area),
  //         servicenumber: String(ebreadingdetail.servicenumber),
  //         readingmode: String(readingmode),
  //         description: String(ebreadingdetail.description),
  //         date: String(ebreadingdetail.date),
  //         time: String(ebreadingdetail.time),
  //         openkwh: String(ebreadingdetail.openkwh),
  //         kvah: String(ebreadingdetail.kvah),
  //         kwhunit: readingFilter,
  //         kvahunit: readingFilterKvh,
  //         pf: pfdifference,
  //         md: String(ebreadingdetail.md),
  //         pfrphase: String(ebreadingdetail.pfrphase),
  //         pfyphase: String(ebreadingdetail.pfyphase),
  //         pfbphase: String(ebreadingdetail.pfbphase),
  //         pfcurrent: String(ebreadingdetail.pfcurrent),
  //         pfaverage: String(ebreadingdetail.pfaverage),
  //         mdrphase: String(ebreadingdetail.mdrphase),
  //         mdbphase: String(ebreadingdetail.mdbphase),
  //         mdyphase: String(ebreadingdetail.mdyphase),
  //         mdcurrent: String(ebreadingdetail.mdcurrent),
  //         mdaverage: String(ebreadingdetail.mdaverage),
  //         usageunit: ebservices,
  //         currentusageunit: allowedusageunit,
  //         currentstatus: status,
  //         addedby: [
  //           {
  //             name: String(username),
  //             date: String(new Date()),
  //           },
  //         ],
  //       })


  //       const [year, month, day] = ebreadingdetail.date.split('-');
  //       if (readingmode == "Daily Closing") {
  //         const isLastDayOfMonth = day === new Date(year, month, 0).getDate().toString();

  //         if (isLastDayOfMonth) {

  //           const previousMonth = month === 1 ? 12 : month - 1;
  //           const previousYear = month === 1 ? year - 1 : year;

  //           // Format the previous month and year as "YYYY-MM"
  //           const formattedPreviousMonth = `${previousYear}-${String(previousMonth).padStart(2, '0')}`;
  //           // Filter the array to find the record with "Month Closing" for the previous month
  //           const result = ebreadingdetails.find(item =>
  //             item.readingmode === "Month Closing"
  //             && item.company === ebreadingdetail.company
  //             && item.branch === ebreadingdetail.branch
  //             && item.unit === ebreadingdetail.unit
  //             && item.floor === ebreadingdetail.floor
  //             && item.area.includes(ebreadingdetail.area)
  //             && item.servicenumber === ebreadingdetail.servicenumber
  //             && item.date.includes(formattedPreviousMonth)
  //           );

  //           const resultcheck = ebreadingdetails.filter(item =>
  //             item.readingmode === "Month Closing"
  //             && item.date == ebreadingdetail.date
  //           );


  //           const servicemasterval = servicemaster.find(item =>
  //             item.company === ebreadingdetail.company && item.branch === ebreadingdetail.branch && item.unit === ebreadingdetail.unit
  //             && item.floor === ebreadingdetail.floor && item.area.includes(ebreadingdetail.area) && item.servicenumber === ebreadingdetail.servicenumber
  //           );
  //           let lastvalue = result ? result : servicemasterval
  //           if (lastvalue && resultcheck.length === 0) {
  //             let diffpf = (Number(ebreadingdetail.openkwh) - Number(lastvalue.openkwh)) / (Number(ebreadingdetail.kvah) - Number(lastvalue.kvah))
  //             let subprojectscreate = axios.post(SERVICE.EBREADINGDETAIL_CREATE, {
  //               headers: {
  //                 'Authorization': `Bearer ${auth.APIToken}`
  //               },
  //               company: String(ebreadingdetail.company),
  //               branch: String(ebreadingdetail.branch),
  //               unit: String(ebreadingdetail.unit),
  //               floor: String(ebreadingdetail.floor),
  //               area: String(ebreadingdetail.area),
  //               servicenumber: String(ebreadingdetail.servicenumber),
  //               readingmode: String("Month Closing"),
  //               description: String(ebreadingdetail.description),
  //               date: String(ebreadingdetail.date),
  //               time: String(ebreadingdetail.time),
  //               openkwh: String(ebreadingdetail.openkwh),
  //               kvah: String(ebreadingdetail.kvah),
  //               kwhunit: Number(ebreadingdetail.openkwh) - Number(lastvalue.openkwh),
  //               kvahunit: Number(ebreadingdetail.kvah) - Number(lastvalue.kvah),
  //               pf: diffpf,
  //               md: String(ebreadingdetail.md),
  //               pfrphase: String(ebreadingdetail.pfrphase),
  //               pfyphase: String(ebreadingdetail.pfyphase),
  //               pfbphase: String(ebreadingdetail.pfbphase),
  //               pfcurrent: String(ebreadingdetail.pfcurrent),
  //               pfaverage: String(ebreadingdetail.pfaverage),
  //               mdrphase: String(ebreadingdetail.mdrphase),
  //               mdbphase: String(ebreadingdetail.mdbphase),
  //               mdyphase: String(ebreadingdetail.mdyphase),
  //               mdcurrent: String(ebreadingdetail.mdcurrent),
  //               mdaverage: String(ebreadingdetail.mdaverage),
  //               addedby: [
  //                 {
  //                   name: String(username),
  //                   date: String(new Date()),
  //                 },
  //               ],
  //             })
  //           }
  //         }
  //       }

  //       await fetchEbreadingdetails();
  //       // await fetchEbSort();
  //       setEbreadingdetail({
  //         ...ebreadingdetail,
  //         readingmode: "", date: formattedDate, time: "", openkwh: "", kvah: "", kwhunit: "", kvahunit: "", pf: "", md: "", description: "",
  //         pfrphase: "", pfyphase: "", pfbphase: "", pfcurrent: "", pfaverage: "", mdrphase: "", mdyphase: "", mdbphase: "", mdcurrent: "",
  //         mdaverage: "",
  //       })
  //       setReadingmode("Daily Closing");
  //       setReadingFilter("")
  //       setReadingFilterKVH("")
  //       setPfdifference("")
  //       setPopupContent("Added Successfully");
  //       setPopupSeverity("success");
  //       handleClickOpenPopup();
  //       setloadingdeloverall(false)
  //     }
  //     // else if (futureupdatearr.length > 1) {
  //     //   setloadingdeloverall(false)
  //     //   setPopupContentMalert(
  //     //     `You have Already Added two more dates after this Date ${ebreadingdetail.date}`
  //     //   );
  //     //   setPopupSeverityMalert("info");
  //     //   handleClickOpenPopupMalert();

  //     // } 
  //     else {
  //       setloadingdeloverall(false)

  //     }



  //   } catch (err) {
  //   handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
  //   }
  // }


  const sendRequest = async () => {
    setPageName(!pageName)
    try {
      if (futureupdatearr.length === 1) {
        let subprojectscreate = await axios.post(SERVICE.EBREADINGDETAIL_CREATE, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          },
          company: String(ebreadingdetail.company),
          branch: String(ebreadingdetail.branch),
          unit: String(ebreadingdetail.unit),
          floor: String(ebreadingdetail.floor),
          area: String(ebreadingdetail.area),
          servicenumber: String(ebreadingdetail.servicenumber),
          readingmode: String(readingmode),
          description: String(ebreadingdetail.description),
          date: String(ebreadingdetail.date),
          time: String(ebreadingdetail.time),
          fromtime: String(ebreadingdetail.fromtime),
          openkwh: String(ebreadingdetail.openkwh),
          kvah: String(ebreadingdetail.kvah),
          kwhunit: readingFilter,
          kvahunit: readingFilterKvh,
          pf: pfdifference,
          md: String(ebreadingdetail.md),
          pfrphase: String(ebreadingdetail.pfrphase),
          pfyphase: String(ebreadingdetail.pfyphase),
          pfbphase: String(ebreadingdetail.pfbphase),
          pfcurrent: String(ebreadingdetail.pfcurrent),
          pfaverage: String(ebreadingdetail.pfaverage),
          mdrphase: String(ebreadingdetail.mdrphase),
          mdbphase: String(ebreadingdetail.mdbphase),
          mdyphase: String(ebreadingdetail.mdyphase),
          mdcurrent: String(ebreadingdetail.mdcurrent),
          mdaverage: String(ebreadingdetail.mdaverage),
          usageunit: ebservices,
          currentusageunit: allowedusageunit,
          currentstatus: status,
          addedby: [
            {
              name: String(username),
              date: String(new Date()),
            },
          ],

        }

        )
        setserviceNumber([])
        if (futureupdate && futureupdate?._id) {
          let futureid = futureupdate?._id
          let pfdiffkwh = Number(futureupdate.openkwh) - Number(ebreadingdetail.openkwh)
          let pfdiffkvh = Number(futureupdate.kvah) - Number(ebreadingdetail.kvah)
          let pfdiff = pfdiffkwh / pfdiffkvh
          let res = await axios.put(`${SERVICE.EBREADINGDETAIL_SINGLE}/${futureid}`, {
            headers: {
              'Authorization': `Bearer ${auth.APIToken}`
            },

            kwhunit: Number(futureupdate.openkwh) - Number(ebreadingdetail.openkwh),
            kvahunit: Number(futureupdate.kvah) - Number(ebreadingdetail.kvah),
            pf: pfdiff
          });
        }

        const [year, month, day] = ebreadingdetail.date.split('-');
        if (readingmode == "Daily Closing") {
          const isLastDayOfMonth = day === new Date(year, month, 0).getDate().toString();

          if (isLastDayOfMonth) {

            const previousMonth = month === 1 ? 12 : month - 1;
            const previousYear = month === 1 ? year - 1 : year;

            // Format the previous month and year as "YYYY-MM"
            const formattedPreviousMonth = `${previousYear}-${String(previousMonth).padStart(2, '0')}`;
            // Filter the array to find the record with "Month Closing" for the previous month
            const result = ebreadingdetails.find(item =>
              item.readingmode === "Month Closing"
              && item.company === ebreadingdetail.company
              && item.branch === ebreadingdetail.branch
              && item.unit === ebreadingdetail.unit
              && item.floor === ebreadingdetail.floor
              && item.area.includes(ebreadingdetail.area)
              && item.servicenumber === ebreadingdetail.servicenumber
              && item.date.includes(formattedPreviousMonth)
            );

            const resultcheck = ebreadingdetails.filter(item =>
              item.readingmode === "Month Closing"
              && item.date == ebreadingdetail.date
            );


            const servicemasterval = servicemaster.find(item =>
              item.company === ebreadingdetail.company && item.branch === ebreadingdetail.branch && item.unit === ebreadingdetail.unit
              && item.floor === ebreadingdetail.floor && item.area.includes(ebreadingdetail.area) && item.servicenumber === ebreadingdetail.servicenumber
            );
            let lastvalue = result ? result : servicemasterval
            if (lastvalue && resultcheck.length === 0) {

              let diffpf = (Number(ebreadingdetail.openkwh) - Number(lastvalue.openkwh)) / (Number(ebreadingdetail.kvah) - Number(lastvalue.kvah))
              let subprojectscreate = axios.post(SERVICE.EBREADINGDETAIL_CREATE, {
                headers: {
                  'Authorization': `Bearer ${auth.APIToken}`
                },
                company: String(ebreadingdetail.company),
                branch: String(ebreadingdetail.branch),
                unit: String(ebreadingdetail.unit),
                floor: String(ebreadingdetail.floor),
                area: String(ebreadingdetail.area),
                servicenumber: String(ebreadingdetail.servicenumber),
                readingmode: String("Month Closing"),
                description: String(ebreadingdetail.description),
                date: String(ebreadingdetail.date),
                time: String(ebreadingdetail.time),
                openkwh: String(ebreadingdetail.openkwh),
                kvah: String(ebreadingdetail.kvah),
                kwhunit: Number(ebreadingdetail.openkwh) - Number(lastvalue.openkwh),
                kvahunit: Number(ebreadingdetail.kvah) - Number(lastvalue.kvah),
                pf: diffpf,
                md: String(ebreadingdetail.md),
                pfrphase: String(ebreadingdetail.pfrphase),
                pfyphase: String(ebreadingdetail.pfyphase),
                pfbphase: String(ebreadingdetail.pfbphase),
                pfcurrent: String(ebreadingdetail.pfcurrent),
                pfaverage: String(ebreadingdetail.pfaverage),
                mdrphase: String(ebreadingdetail.mdrphase),
                mdbphase: String(ebreadingdetail.mdbphase),
                mdyphase: String(ebreadingdetail.mdyphase),
                mdcurrent: String(ebreadingdetail.mdcurrent),
                mdaverage: String(ebreadingdetail.mdaverage),
                addedby: [
                  {
                    name: String(username),
                    date: String(new Date()),
                  },
                ],
              })
            }
          }
        }

        setloadingdeloverall(false)
        await fetchEbreadingdetails();
        await fetchFilteredDatas();
        setEbreadingdetail({
          ...ebreadingdetail,
          readingmode: "", date: formattedDate, time: "", openkwh: "", kvah: "", kwhunit: "", kvahunit: "", pf: "", md: "", description: "",
          pfrphase: "", pfyphase: "", pfbphase: "", pfcurrent: "", pfaverage: "", mdrphase: "", mdyphase: "", mdbphase: "", mdcurrent: "",
          mdaverage: "",
        })
        setReadingmode("Daily Closing");
        setReadingFilter("")

        setReadingFilterKVH("")
        setPfdifference("")
        setPopupContent("Added Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
        setloadingdeloverall(false)
      }
      else if (futureupdatearr.length === 0) {
        let subprojectscreate = await axios.post(SERVICE.EBREADINGDETAIL_CREATE, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          },
          company: String(ebreadingdetail.company),
          branch: String(ebreadingdetail.branch),
          unit: String(ebreadingdetail.unit),
          floor: String(ebreadingdetail.floor),
          area: String(ebreadingdetail.area),
          servicenumber: String(ebreadingdetail.servicenumber),
          readingmode: String(readingmode),
          description: String(ebreadingdetail.description),
          date: String(ebreadingdetail.date),
          time: String(ebreadingdetail.time),
          openkwh: String(ebreadingdetail.openkwh),
          kvah: String(ebreadingdetail.kvah),
          kwhunit: readingFilter,
          kvahunit: readingFilterKvh,
          pf: pfdifference,
          md: String(ebreadingdetail.md),
          pfrphase: String(ebreadingdetail.pfrphase),
          pfyphase: String(ebreadingdetail.pfyphase),
          pfbphase: String(ebreadingdetail.pfbphase),
          pfcurrent: String(ebreadingdetail.pfcurrent),
          pfaverage: String(ebreadingdetail.pfaverage),
          mdrphase: String(ebreadingdetail.mdrphase),
          mdbphase: String(ebreadingdetail.mdbphase),
          mdyphase: String(ebreadingdetail.mdyphase),
          mdcurrent: String(ebreadingdetail.mdcurrent),
          mdaverage: String(ebreadingdetail.mdaverage),
          usageunit: ebservices,
          currentusageunit: allowedusageunit,
          currentstatus: status,
          addedby: [
            {
              name: String(username),
              date: String(new Date()),
            },
          ],
        })


        const [year, month, day] = ebreadingdetail.date.split('-');
        if (readingmode == "Daily Closing") {
          const isLastDayOfMonth = day === new Date(year, month, 0).getDate().toString();

          if (isLastDayOfMonth) {

            const previousMonth = month === 1 ? 12 : month - 1;
            const previousYear = month === 1 ? year - 1 : year;

            // Format the previous month and year as "YYYY-MM"
            const formattedPreviousMonth = `${previousYear}-${String(previousMonth).padStart(2, '0')}`;
            // Filter the array to find the record with "Month Closing" for the previous month
            const result = ebreadingdetails.find(item =>
              item.readingmode === "Month Closing"
              && item.company === ebreadingdetail.company
              && item.branch === ebreadingdetail.branch
              && item.unit === ebreadingdetail.unit
              && item.floor === ebreadingdetail.floor
              && item.area.includes(ebreadingdetail.area)
              && item.servicenumber === ebreadingdetail.servicenumber
              && item.date.includes(formattedPreviousMonth)
            );

            const resultcheck = ebreadingdetails.filter(item =>
              item.readingmode === "Month Closing"
              && item.date == ebreadingdetail.date
            );


            const servicemasterval = servicemaster.find(item =>
              item.company === ebreadingdetail.company && item.branch === ebreadingdetail.branch && item.unit === ebreadingdetail.unit
              && item.floor === ebreadingdetail.floor && item.area.includes(ebreadingdetail.area) && item.servicenumber === ebreadingdetail.servicenumber
            );
            let lastvalue = result ? result : servicemasterval
            if (lastvalue && resultcheck.length === 0) {
              let diffpf = (Number(ebreadingdetail.openkwh) - Number(lastvalue.openkwh)) / (Number(ebreadingdetail.kvah) - Number(lastvalue.kvah))
              let subprojectscreate = axios.post(SERVICE.EBREADINGDETAIL_CREATE, {
                headers: {
                  'Authorization': `Bearer ${auth.APIToken}`
                },
                company: String(ebreadingdetail.company),
                branch: String(ebreadingdetail.branch),
                unit: String(ebreadingdetail.unit),
                floor: String(ebreadingdetail.floor),
                area: String(ebreadingdetail.area),
                servicenumber: String(ebreadingdetail.servicenumber),
                readingmode: String("Month Closing"),
                description: String(ebreadingdetail.description),
                date: String(ebreadingdetail.date),
                time: String(ebreadingdetail.time),
                openkwh: String(ebreadingdetail.openkwh),
                kvah: String(ebreadingdetail.kvah),

                kwhunit: Number(ebreadingdetail.openkwh) - Number(lastvalue.openkwh),
                kvahunit: Number(ebreadingdetail.kvah) - Number(lastvalue.kvah),
                pf: diffpf,

                md: String(ebreadingdetail.md),
                pfrphase: String(ebreadingdetail.pfrphase),
                pfyphase: String(ebreadingdetail.pfyphase),
                pfbphase: String(ebreadingdetail.pfbphase),
                pfcurrent: String(ebreadingdetail.pfcurrent),
                pfaverage: String(ebreadingdetail.pfaverage),
                mdrphase: String(ebreadingdetail.mdrphase),
                mdbphase: String(ebreadingdetail.mdbphase),
                mdyphase: String(ebreadingdetail.mdyphase),
                mdcurrent: String(ebreadingdetail.mdcurrent),
                mdaverage: String(ebreadingdetail.mdaverage),
                addedby: [
                  {
                    name: String(username),
                    date: String(new Date()),
                  },
                ],
              })
            }
          }
        }
        setloadingdeloverall(false)
        await fetchEbreadingdetails();
        await fetchFilteredDatas();
        setEbreadingdetail({
          ...ebreadingdetail,
          readingmode: "", date: formattedDate, time: "", openkwh: "", kvah: "", kwhunit: "", kvahunit: "", pf: "", md: "", description: "",
          pfrphase: "", pfyphase: "", pfbphase: "", pfcurrent: "", pfaverage: "", mdrphase: "", mdyphase: "", mdbphase: "", mdcurrent: "",
          mdaverage: "",
        })

        setReadingmode("Daily Closing");
        setReadingFilter("")
        setReadingFilterKVH("")
        setPfdifference("")
        setPopupContent("Added Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();

      }
      else if (futureupdatearr.length > 1) {
        setloadingdeloverall(false)
        setPopupContentMalert(
          `You have Already Added two more dates after this Date ${ebreadingdetail.date}`
        );
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();

      }
      else {

        setloadingdeloverall(false)

      }

    } catch (err) {
      setloadingdeloverall(false)
      console.log(err, "error")
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  }


  //submit option for saving
  const handleSubmit = async (e) => {
    setPageName(!pageName)
    setloadingdeloverall(true)
    // e.preventDefault();
    // await fetchEbreadingdetails()
    // const isNameMatch = ebreadingdetails.some(item => item.company === String(ebreadingdetail.company) &&
    //     item.branch === String(ebreadingdetail.branch) &&
    //     item.unit === String(ebreadingdetail.unit) &&
    //     item.servicenumber === String(ebreadingdetail.servicenumber) &&
    //     item.floor === String(ebreadingdetail.floor)
    // );
    let checkduplicateDaily;
    let checkduplicateMonth;
    let checkduplicateBill;
    let checkduplicateBillBefore;
    if (readingmode == "Daily Closing") {
      try {
        checkduplicateDaily = await axios.post(SERVICE.CHECK_DUPE_DAILY_EB, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          },
          readingmode: String(readingmode),
          company: String(ebreadingdetail.company),
          branch: String(ebreadingdetail.branch),
          unit: String(ebreadingdetail.unit),
          servicenumber: String(ebreadingdetail.servicenumber),
          floor: String(ebreadingdetail.floor),
          area: String(ebreadingdetail.area),
          date: ebreadingdetail.date
        })
      } catch (err) {
        console.log(err, "eroror")
      }
    }
    // console.log(checkduplicateDaily, "checkduplicateDaily")


    if (readingmode == "Month Closing") {
      try {
        checkduplicateMonth = await axios.post(SERVICE.CHECK_DUPE_MONTH_EB, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          },
          readingmode: String(readingmode),
          company: String(ebreadingdetail.company),
          branch: String(ebreadingdetail.branch),
          unit: String(ebreadingdetail.unit),
          servicenumber: String(ebreadingdetail.servicenumber),
          floor: String(ebreadingdetail.floor),
          area: String(ebreadingdetail.area),
          date: ebreadingdetail.date
        })
      } catch (err) {
        console.log(err, "eroror")
      }
    }


    if (readingmode == "Bill Closing") {
      try {
        checkduplicateBill = await axios.post(SERVICE.CHECK_DUPE_BILL_EB, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          },
          readingmode: String(readingmode),
          company: String(ebreadingdetail.company),
          branch: String(ebreadingdetail.branch),
          unit: String(ebreadingdetail.unit),
          servicenumber: String(ebreadingdetail.servicenumber),
          floor: String(ebreadingdetail.floor),
          area: String(ebreadingdetail.area),
          date: ebreadingdetail.date
        })

        checkduplicateBillBefore = await axios.post(SERVICE.CHECK_DUPE_BILL_BEFORE_EB, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          },
          readingmode: String(readingmode),
          company: String(ebreadingdetail.company),
          branch: String(ebreadingdetail.branch),
          unit: String(ebreadingdetail.unit),
          servicenumber: String(ebreadingdetail.servicenumber),
          floor: String(ebreadingdetail.floor),
          area: String(ebreadingdetail.area),
          date: ebreadingdetail.date
        })
      } catch (err) {
        console.log(err, "eroror")
      }
    }



    const isNameMatchDaily = checkduplicateDaily ? checkduplicateDaily.data.ebreadingdetails : 0


    const isNameMatchMonth = checkduplicateMonth ? checkduplicateMonth.data.ebreadingdetails : 0
    const isNameMatchBill = checkduplicateBill ? checkduplicateBill.data.ebreadingdetails : 0
    const isNameMatchBillbefore = checkduplicateBillBefore ? checkduplicateBillBefore.data.ebreadingdetails : 0

    console.log(checkduplicateBill, "checkduplicateBill")

    console.log(isNameMatchBill, "isNameMatchBill")

    // const isNameMatchMonth = ebreadingdetails.some(item => {
    //   const [year, month, day] = ebreadingdetail.date.split('-');
    //   const [oldyear, oldmonth, oldday] = item.date.split('-');

    //   return readingmode === "Month Closing" && item.readingmode === "Month Closing" &&
    //     item.company === String(ebreadingdetail.company) &&
    //     item.branch === String(ebreadingdetail.branch) &&
    //     item.unit === String(ebreadingdetail.unit) &&
    //     item.servicenumber === String(ebreadingdetail.servicenumber) &&
    //     item.floor === String(ebreadingdetail.floor) &&
    //     item.area === String(ebreadingdetail.area)
    //     && month === oldmonth && year === oldyear;
    // });



    console.log(isNameMatchMonth, "isNameMatchMonth")



    // const isNameMatchBill = ebreadingdetails.some(item => {
    //   const [year, month, day] = ebreadingdetail.date.split('-');
    //   const [oldyear, oldmonth, oldday] = item.date.split('-');

    //   return readingmode === "Bill Closing" && item.readingmode === "Bill Closing" &&
    //     item.company === String(ebreadingdetail.company) &&
    //     item.branch === String(ebreadingdetail.branch) &&
    //     item.unit === String(ebreadingdetail.unit) &&
    //     item.servicenumber === String(ebreadingdetail.servicenumber) &&
    //     item.floor === String(ebreadingdetail.floor) &&
    //     item.area === String(ebreadingdetail.area)
    //     && month === oldmonth && year === oldyear;
    // });
    // console.log(isNameMatchBill, "isNameMatchBill")



    // const isNameMatchBillbefore = ebreadingdetails.some(item => {

    //   return readingmode === "Bill Closing" && item.readingmode === "Bill Closing"
    //     && item.company === String(ebreadingdetail.company) &&
    //     item.branch === String(ebreadingdetail.branch) &&
    //     item.unit === String(ebreadingdetail.unit) &&
    //     item.servicenumber === String(ebreadingdetail.servicenumber) &&
    //     item.floor === String(ebreadingdetail.floor) &&
    //     item.area === String(ebreadingdetail.area) &&
    //     item.date > ebreadingdetail.date
    // });
    // console.log(isNameMatchBillbefore, "isNameMatchBillbefore")
    let resstatus = await axios.post(SERVICE.EBREADING_DETAILS_SERVICE_STATUS, {
      headers: {
        'Authorization': `Bearer ${auth.APIToken}`
      },
      servicenumber: String(ebreadingdetail.servicenumber),
      startdate: String(ebreadingdetail.date),
      enddate: String(ebreadingdetail.date),
    })
    let servicestatus = resstatus.data.ebreadingdetails


    if (ebreadingdetail.company === "Please Select Company") {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (ebreadingdetail.branch === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (ebreadingdetail.unit === "Please Select Unit") {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (ebreadingdetail.servicenumber === "Please Select Service") {
      setPopupContentMalert("Please Select Service!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (ebreadingdetail.date === "") {
      setPopupContentMalert("Please Select Date!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (ebreadingdetail.floor === "Please Select Floor") {
      setPopupContentMalert("Please Select Floor!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (servicestatus > 0) {
      setPopupContentMalert("This Service Number Not in Use!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (checkServicemasterBeforeDate == 0) {
      setPopupContentMalert(`Please Create Before ${ebreadingdetail.date} of Service Master!`);
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (ebreadingdetail.openkwh === "") {
      setPopupContentMalert("Please Enter KWH Reading!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (ebreadingdetail.kvah === "") {
      setPopupContentMalert("Please Enter KVAH Reading!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }

    else if (readingFilter < 0) {
      setPopupContentMalert("Please Enter Correct KWH Reading!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (readingFilterKvh < 0) {
      setPopupContentMalert("Please Enter Correct KVAH Reading!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatchDaily > 0) {
      setPopupContentMalert("Daily Closing Already Added For This Date!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (isNameMatchBill > 0) {
      setPopupContentMalert("Bill  Closing Already Added For This Month!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (isNameMatchBillbefore > 0) {
      setPopupContentMalert("Bill Closing Should Add Only After Month!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (isNameMatchMonth > 0) {
      setPopupContentMalert("Month Closing Already Added For This Month!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (futureupdatearr.length > 0 && Number(ebreadingdetail.openkwh) > futureupdatearr[0]?.openkwh) {
      {
        setPopupContentMalert(`Please Enter KWH Value Less Than This ${futureupdatearr[0]?.date} KWH Value (${futureupdatearr[0]?.openkwh})`);
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    }
    else if (futureupdatearr.length > 0 && Number(ebreadingdetail.kvah) > futureupdatearr[0]?.kvah) {
      {
        setPopupContentMalert(`Please Enter KVAH Value Less Than This ${futureupdatearr[0]?.date} KVAH Value (${futureupdatearr[0]?.kvah})`);
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    }
    else {
      console.log("abf")
      sendRequest();
    }
  }

  console.log(ebreadingdetail.status, "status")

  const handleClear = (e) => {
    e.preventDefault();
    setEbreadingdetail({
      company: "Please Select Company",
      branch: "Please Select Branch",
      unit: "Please Select Unit", floor: "Please Select Floor",
      area: "Please Select Area",
      readingmode: "", description: "", date: formattedDate, time: "", openkwh: "", kvah: "", kwhunit: "", kvahunit: "", pf: "", md: "",
      pfrphase: "", pfyphase: "", pfbphase: "", pfcurrent: "", pfaverage: "", mdrphase: "", mdyphase: "", mdbphase: "", mdcurrent: "",
      mdaverage: "",
    })
    setReadingmode("Daily Closing");
    setBranchs([]);
    setUnits([]);
    setFloors([]);
    setAreas([]);
    setserviceNumber([]);
    setReadingFilter("")
    setReadingFilterKVH("")
    setPfdifference("")
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  }


  //submit option for saving
  const handleSubmitFilter = (e) => {
    e.preventDefault();

    if (ebreadingdetailFilter.company === "Please Select Company") {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (ebreadingdetailFilter.company === "Please Select Company") {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      fetchFilteredDatas();
    }

  };

  const handleClearFilter = async (e) => {
    e.preventDefault();
    fetchEbreadingdetails();
    setEbreadingdetailFilter({
      company: "Please Select Company",
      branch: "Please Select Branch",
      floor: "Please Select Floor",
      servicenumber: "Please Select Service",
    })
    setserviceNumber([]);
    setFloors([])
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  }
  //add function 
  const fetchFilteredDatas = async () => {
    try {
      let subprojectscreate = await axios.post(SERVICE.CHECK_EBREADINGDETAIL, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        company: String(ebreadingdetailFilter.company),
        branch: String(ebreadingdetailFilter.branch) === "Please Select Branch" ? "" : ebreadingdetailFilter.branch,
        floor: String(ebreadingdetailFilter.floor) === "Please Select Floor" ? "" : ebreadingdetailFilter.floor,
        servicenumber: String(ebreadingdetailFilter.servicenumber) === "Please Select Service" ? "" : ebreadingdetailFilter.servicenumber,
      })
      setEbreadingdetails(subprojectscreate.data.resulted)
      setPage(1)
      setPopupContent("Filtered Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  }

  //Edit model...
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick")
      return;
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
  const [olddate, setolddate] = useState("")

  //get single row to edit....
  const getCode = async (e, name) => {
    try {
      let res = await axios.get(`${SERVICE.EBREADINGDETAIL_SINGLE}/${e}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      setolddate(res?.data?.sebreadingdetail.date)
      setEbreadingdetailEdit(res?.data?.sebreadingdetail);
      fetchServiceNumberEdit(res.data.sebreadingdetail.unit);
      setReadingmodeEdit(res.data.sebreadingdetail.readingmode);
      fetchFloorEditGetCode(res.data.sebreadingdetail.servicenumber);
      setReadingFilterEdit(res.data.sebreadingdetail.kwhunit);
      setReadingFilterKVHEdit(res.data.sebreadingdetail.kvahunit);
      setPfdifference(res.data.sebreadingdetail.pf);
      fetchEbServiceMasterEdit(res.data.sebreadingdetail.servicenumber, res.data.sebreadingdetail.floor, res.data.sebreadingdetail.area, res.data.sebreadingdetail.readingmode)
    }
    catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  }


  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.EBREADINGDETAIL_SINGLE}/${e}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      setEbreadingdetailEdit(res?.data?.sebreadingdetail);
    }
    catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.EBREADINGDETAIL_SINGLE}/${e}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      setEbreadingdetailEdit(res?.data?.sebreadingdetail);
    }
    catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };



  //Project updateby edit page...
  let updateby = ebreadingdetailEdit?.updatedby;
  let addedby = ebreadingdetailEdit?.addedby;


  let subprojectsid = ebreadingdetailEdit?._id;

  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName)
    try {

      if (futureupdatebeforearr.length > 1) {
        setPopupContentMalert(
          `You have Already Added two more dates after this Date ${ebreadingdetailEdit.date}`
        );
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }

      else if (futureupdatedelafterarr.length === 1) {
        let res = await axios.put(`${SERVICE.EBREADINGDETAIL_SINGLE}/${subprojectsid}`, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          },
          company: String(ebreadingdetailEdit.company),
          branch: String(ebreadingdetailEdit.branch),
          unit: String(ebreadingdetailEdit.unit),
          floor: String(ebreadingdetailEdit.floor),
          area: String(ebreadingdetailEdit.area),
          servicenumber: String(ebreadingdetailEdit.servicenumber),
          readingmode: String(readingmodeEdit),
          description: String(readingmodeEdit === "Session Closing" ? ebreadingdetailEdit.description : ""),
          date: String(ebreadingdetailEdit.date),
          time: String(ebreadingdetailEdit.time),
          openkwh: String(ebreadingdetailEdit.openkwh),
          kvah: String(ebreadingdetailEdit.kvah),
          kwhunit: readingFilterEdit,
          kvahunit: readingFilterKvhEdit,
          // pf: String(ebreadingdetailEdit.pf),
          pf: pfdifference,
          md: String(ebreadingdetailEdit.md),
          pfrphase: String(ebreadingdetailEdit.pfrphase),
          pfyphase: String(ebreadingdetailEdit.pfyphase),
          pfbphase: String(ebreadingdetailEdit.pfbphase),
          pfcurrent: String(ebreadingdetailEdit.pfcurrent),
          pfaverage: String(ebreadingdetailEdit.pfaverage),
          mdrphase: String(ebreadingdetailEdit.mdrphase),
          mdbphase: String(ebreadingdetailEdit.mdbphase),
          mdyphase: String(ebreadingdetailEdit.mdyphase),
          mdcurrent: String(ebreadingdetailEdit.mdcurrent),
          mdaverage: String(ebreadingdetailEdit.mdaverage),
          usageunit: ebservicesEdit,
          currentusageunit: Number(ebservicesEdit) - Number(readingFilterEdit),
          currentstatus: statusEdit,
          updatedby: [
            ...updateby, {
              name: String(username),
              date: String(new Date()),
            },
          ],
        });

        if (futureupdatedelafter && futureupdatedelafter?._id) {
          let futureid = futureupdatedelafter?._id
          let pfdiffkwh = Number(futureupdatedelafter.openkwh) - Number(ebreadingdetailEdit.openkwh)
          let pfdiffkvh = Number(futureupdatedelafter.kvah) - Number(ebreadingdetailEdit.kvah)
          let pfdiff = pfdiffkwh / pfdiffkvh
          let res = await axios.put(`${SERVICE.EBREADINGDETAIL_SINGLE}/${futureid}`, {
            headers: {
              'Authorization': `Bearer ${auth.APIToken}`
            },

            kwhunit: Number(futureupdatedelafter.openkwh) - Number(ebreadingdetailEdit.openkwh),
            kvahunit: Number(futureupdatedelafter.kvah) - Number(ebreadingdetailEdit.kvah),
            pf: pfdiff
          });

        }

        const [year, month, day] = ebreadingdetailEdit.date.split('-');
        if (readingmodeEdit == "Daily Closing") {
          const isLastDayOfMonth = day === new Date(year, month, 0).getDate().toString();

          if (isLastDayOfMonth) {

            const previousMonth = month === 1 ? 12 : month - 1;
            const previousYear = month === 1 ? year - 1 : year;

            // Format the previous month and year as "YYYY-MM"
            const formattedPreviousMonth = `${previousYear}-${String(previousMonth).padStart(2, '0')}`;
            // Filter the array to find the record with "Month Closing" for the previous month

            const servicemasterval = servicemaster.find(item =>
              item.company === ebreadingdetailEdit.company
              && item.branch === ebreadingdetailEdit.branch
              && item.unit === ebreadingdetailEdit.unit
              && item.floor === ebreadingdetailEdit.floor
              && item.area.includes(ebreadingdetailEdit.area)
              && item.servicenumber == ebreadingdetailEdit.servicenumber
            );
            const result = ebreadingdetails.find(item =>
              item.readingmode === "Month Closing"
              && item.company === ebreadingdetailEdit.company
              && item.branch === ebreadingdetailEdit.branch
              && item.unit === ebreadingdetailEdit.unit
              && item.floor === ebreadingdetailEdit.floor
              && item.area === ebreadingdetailEdit.area
              && item.servicenumber === ebreadingdetailEdit.servicenumber
              && item.date.includes(formattedPreviousMonth)
            );
            const resultcheck = ebreadingdetails.find(item =>
              item.readingmode === "Month Closing"
              && item.date == ebreadingdetailEdit.date
            );


            let lastvalue = result ? result : servicemasterval
            if (lastvalue && resultcheck) {
              let res = await axios.put(`${SERVICE.EBREADINGDETAIL_SINGLE}/${resultcheck._id}`, {
                headers: {
                  'Authorization': `Bearer ${auth.APIToken}`
                },
                company: String(ebreadingdetailEdit.company),
                branch: String(ebreadingdetailEdit.branch),
                unit: String(ebreadingdetailEdit.unit),
                floor: String(ebreadingdetailEdit.floor),
                area: String(ebreadingdetailEdit.area),
                servicenumber: String(ebreadingdetailEdit.servicenumber),
                date: String(ebreadingdetailEdit.date),
                time: String(ebreadingdetailEdit.time),
                openkwh: String(ebreadingdetailEdit.openkwh) - Number(lastvalue.openkwh),
                kvah: String(ebreadingdetailEdit.kvah) - Number(lastvalue.kvah),
                kwhunit: readingFilterEdit,
                kvahunit: readingFilterKvhEdit,
                pf: pfdifference,
                md: String(ebreadingdetailEdit.md),
                pfrphase: String(ebreadingdetailEdit.pfrphase),
                pfyphase: String(ebreadingdetailEdit.pfyphase),
                pfbphase: String(ebreadingdetailEdit.pfbphase),
                pfcurrent: String(ebreadingdetailEdit.pfcurrent),
                pfaverage: String(ebreadingdetailEdit.pfaverage),
                mdrphase: String(ebreadingdetailEdit.mdrphase),
                mdbphase: String(ebreadingdetailEdit.mdbphase),
                mdyphase: String(ebreadingdetailEdit.mdyphase),
                mdcurrent: String(ebreadingdetailEdit.mdcurrent),
                mdaverage: String(ebreadingdetailEdit.mdaverage),
                updatedby: [
                  ...updateby, {
                    name: String(username),
                    date: String(new Date()),
                  },
                ],
              });
            }
            else {
              let diffpf = (Number(ebreadingdetailEdit.openkwh) - Number(lastvalue.openkwh)) / (Number(ebreadingdetailEdit.kvah) - Number(lastvalue.kvah))
              let subprojectscreate = axios.post(SERVICE.EBREADINGDETAIL_CREATE, {
                headers: {
                  'Authorization': `Bearer ${auth.APIToken}`
                },
                company: String(ebreadingdetailEdit.company),
                branch: String(ebreadingdetailEdit.branch),
                unit: String(ebreadingdetailEdit.unit),
                floor: String(ebreadingdetailEdit.floor),
                area: String(ebreadingdetailEdit.area),
                servicenumber: String(ebreadingdetailEdit.servicenumber),
                readingmode: String("Month Closing"),
                description: String(ebreadingdetailEdit.description),
                date: String(ebreadingdetailEdit.date),
                time: String(ebreadingdetailEdit.time),
                openkwh: String(ebreadingdetailEdit.openkwh),
                kvah: String(ebreadingdetailEdit.kvah),
                kwhunit: Number(ebreadingdetailEdit.openkwh) - Number(lastvalue.openkwh),
                kvahunit: Number(ebreadingdetailEdit.kvah) - Number(lastvalue.kvah),
                pf: diffpf,
                // pf: String(ebreadingdetail.pf),
                md: String(ebreadingdetailEdit.md),
                pfrphase: String(ebreadingdetailEdit.pfrphase),
                pfyphase: String(ebreadingdetailEdit.pfyphase),
                pfbphase: String(ebreadingdetailEdit.pfbphase),
                pfcurrent: String(ebreadingdetailEdit.pfcurrent),
                pfaverage: String(ebreadingdetailEdit.pfaverage),
                mdrphase: String(ebreadingdetailEdit.mdrphase),
                mdbphase: String(ebreadingdetailEdit.mdbphase),
                mdyphase: String(ebreadingdetailEdit.mdyphase),
                mdcurrent: String(ebreadingdetailEdit.mdcurrent),
                mdaverage: String(ebreadingdetailEdit.mdaverage),
                addedby: [
                  {
                    name: String(username),
                    date: String(new Date()),
                  },
                ],
              })
            }
          }
        }




        await fetchEbreadingdetails();
        // await fetchEbSort();
        await fetchEbreadingdetailsAll();
        handleCloseModEdit();
        setPopupContent("Updated Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
      }

      else if (futureupdatedelafterarr.length === 0 || (futureupdatedelafterarr.length > 1 && ebreadingdetailEdit.date == olddate)) {
        let res = await axios.put(`${SERVICE.EBREADINGDETAIL_SINGLE}/${subprojectsid}`, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          },
          company: String(ebreadingdetailEdit.company),
          branch: String(ebreadingdetailEdit.branch),
          unit: String(ebreadingdetailEdit.unit),
          floor: String(ebreadingdetailEdit.floor),
          area: String(ebreadingdetailEdit.area),
          servicenumber: String(ebreadingdetailEdit.servicenumber),
          readingmode: String(readingmodeEdit),
          description: String(readingmodeEdit === "Session Closing" ? ebreadingdetailEdit.description : ""),
          date: String(ebreadingdetailEdit.date),
          time: String(ebreadingdetailEdit.time),
          openkwh: String(ebreadingdetailEdit.openkwh),
          kvah: String(ebreadingdetailEdit.kvah),
          kwhunit: readingFilterEdit,
          kvahunit: readingFilterKvhEdit,
          // pf: String(ebreadingdetailEdit.pf),
          pf: pfdifference,
          md: String(ebreadingdetailEdit.md),
          pfrphase: String(ebreadingdetailEdit.pfrphase),
          pfyphase: String(ebreadingdetailEdit.pfyphase),
          pfbphase: String(ebreadingdetailEdit.pfbphase),
          pfcurrent: String(ebreadingdetailEdit.pfcurrent),
          pfaverage: String(ebreadingdetailEdit.pfaverage),
          mdrphase: String(ebreadingdetailEdit.mdrphase),
          mdbphase: String(ebreadingdetailEdit.mdbphase),
          mdyphase: String(ebreadingdetailEdit.mdyphase),
          mdcurrent: String(ebreadingdetailEdit.mdcurrent),
          mdaverage: String(ebreadingdetailEdit.mdaverage),
          usageunit: ebservicesEdit,
          currentusageunit: Number(ebservicesEdit) - Number(readingFilterEdit),
          currentstatus: statusEdit,
          updatedby: [
            ...updateby, {
              name: String(username),
              date: String(new Date()),
            },
          ],
        });

        if (futureupdatedelafter && futureupdatedelafter?._id) {
          let futureid = futureupdatedelafter?._id
          let pfdiffkwh = Number(futureupdatedelafter.openkwh) - Number(ebreadingdetailEdit.openkwh)
          let pfdiffkvh = Number(futureupdatedelafter.kvah) - Number(ebreadingdetailEdit.kvah)
          let pfdiff = pfdiffkwh / pfdiffkvh
          let res = await axios.put(`${SERVICE.EBREADINGDETAIL_SINGLE}/${futureid}`, {
            headers: {
              'Authorization': `Bearer ${auth.APIToken}`
            },

            kwhunit: Number(futureupdatedelafter.openkwh) - Number(ebreadingdetailEdit.openkwh),
            kvahunit: Number(futureupdatedelafter.kvah) - Number(ebreadingdetailEdit.kvah),
            pf: pfdiff
          });

        }

        const [year, month, day] = ebreadingdetailEdit.date.split('-');
        if (readingmodeEdit == "Daily Closing") {
          const isLastDayOfMonth = day === new Date(year, month, 0).getDate().toString();

          if (isLastDayOfMonth) {

            const previousMonth = month === 1 ? 12 : month - 1;
            const previousYear = month === 1 ? year - 1 : year;

            // Format the previous month and year as "YYYY-MM"
            const formattedPreviousMonth = `${previousYear}-${String(previousMonth).padStart(2, '0')}`;
            // Filter the array to find the record with "Month Closing" for the previous month

            const servicemasterval = servicemaster.find(item =>
              item.company === ebreadingdetailEdit.company
              && item.branch === ebreadingdetailEdit.branch
              && item.unit === ebreadingdetailEdit.unit
              && item.floor === ebreadingdetailEdit.floor
              && item.area.includes(ebreadingdetailEdit.area)
              && item.servicenumber == ebreadingdetailEdit.servicenumber
            );
            const result = ebreadingdetails.find(item =>
              item.readingmode === "Month Closing"
              && item.company === ebreadingdetailEdit.company
              && item.branch === ebreadingdetailEdit.branch
              && item.unit === ebreadingdetailEdit.unit
              && item.floor === ebreadingdetailEdit.floor
              && item.area === ebreadingdetailEdit.area
              && item.servicenumber === ebreadingdetailEdit.servicenumber
              && item.date.includes(formattedPreviousMonth)
            );
            const resultcheck = ebreadingdetails.find(item =>
              item.readingmode === "Month Closing"
              && item.date == ebreadingdetailEdit.date
            );


            let lastvalue = result ? result : servicemasterval
            if (lastvalue && resultcheck) {
              let res = await axios.put(`${SERVICE.EBREADINGDETAIL_SINGLE}/${resultcheck._id}`, {
                headers: {
                  'Authorization': `Bearer ${auth.APIToken}`
                },
                company: String(ebreadingdetailEdit.company),
                branch: String(ebreadingdetailEdit.branch),
                unit: String(ebreadingdetailEdit.unit),
                floor: String(ebreadingdetailEdit.floor),
                area: String(ebreadingdetailEdit.area),
                servicenumber: String(ebreadingdetailEdit.servicenumber),
                date: String(ebreadingdetailEdit.date),
                time: String(ebreadingdetailEdit.time),
                openkwh: String(ebreadingdetailEdit.openkwh) - Number(lastvalue.openkwh),
                kvah: String(ebreadingdetailEdit.kvah) - Number(lastvalue.kvah),
                kwhunit: readingFilterEdit,
                kvahunit: readingFilterKvhEdit,
                pf: pfdifference,
                md: String(ebreadingdetailEdit.md),
                pfrphase: String(ebreadingdetailEdit.pfrphase),
                pfyphase: String(ebreadingdetailEdit.pfyphase),
                pfbphase: String(ebreadingdetailEdit.pfbphase),
                pfcurrent: String(ebreadingdetailEdit.pfcurrent),
                pfaverage: String(ebreadingdetailEdit.pfaverage),
                mdrphase: String(ebreadingdetailEdit.mdrphase),
                mdbphase: String(ebreadingdetailEdit.mdbphase),
                mdyphase: String(ebreadingdetailEdit.mdyphase),
                mdcurrent: String(ebreadingdetailEdit.mdcurrent),
                mdaverage: String(ebreadingdetailEdit.mdaverage),
                updatedby: [
                  ...updateby, {
                    name: String(username),
                    date: String(new Date()),
                  },
                ],
              });
            }
            else {
              let diffpf = (Number(ebreadingdetailEdit.openkwh) - Number(lastvalue.openkwh)) / (Number(ebreadingdetailEdit.kvah) - Number(lastvalue.kvah))

              let subprojectscreate = axios.post(SERVICE.EBREADINGDETAIL_CREATE, {
                headers: {
                  'Authorization': `Bearer ${auth.APIToken}`
                },
                company: String(ebreadingdetailEdit.company),
                branch: String(ebreadingdetailEdit.branch),
                unit: String(ebreadingdetailEdit.unit),
                floor: String(ebreadingdetailEdit.floor),
                area: String(ebreadingdetailEdit.area),
                servicenumber: String(ebreadingdetailEdit.servicenumber),
                readingmode: String("Month Closing"),
                description: String(ebreadingdetailEdit.description),
                date: String(ebreadingdetailEdit.date),
                time: String(ebreadingdetailEdit.time),
                openkwh: String(ebreadingdetailEdit.openkwh),
                kvah: String(ebreadingdetailEdit.kvah),
                kwhunit: Number(ebreadingdetailEdit.openkwh) - Number(lastvalue.openkwh),
                kvahunit: Number(ebreadingdetailEdit.kvah) - Number(lastvalue.kvah),
                pf: diffpf,
                md: String(ebreadingdetailEdit.md),
                pfrphase: String(ebreadingdetailEdit.pfrphase),
                pfyphase: String(ebreadingdetailEdit.pfyphase),
                pfbphase: String(ebreadingdetailEdit.pfbphase),
                pfcurrent: String(ebreadingdetailEdit.pfcurrent),
                pfaverage: String(ebreadingdetailEdit.pfaverage),
                mdrphase: String(ebreadingdetailEdit.mdrphase),
                mdbphase: String(ebreadingdetailEdit.mdbphase),
                mdyphase: String(ebreadingdetailEdit.mdyphase),
                mdcurrent: String(ebreadingdetailEdit.mdcurrent),
                mdaverage: String(ebreadingdetailEdit.mdaverage),
                addedby: [
                  {
                    name: String(username),
                    date: String(new Date()),
                  },
                ],
              })
            }
          }
        }




        await fetchEbreadingdetails();
        // await fetchEbSort();
        await fetchEbreadingdetailsAll();
        handleCloseModEdit();
        setPopupContent("Updated Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
      }
      else if (futureupdatedelafterarr.length > 1 && ebreadingdetailEdit.date !== olddate) {

        setPopupContentMalert(
          `You have Already Added two more dates after this Date ${ebreadingdetailEdit.date}`
        );
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();


      }

    }


    catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  }




  //get all Sub vendormasters.
  const fetchEbreadingdetails = async () => {
    try {
      let res_vendor = await axios.post(SERVICE.EBREADINGDETAIL, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        assignbranch: accessbranch,
      });
      setEbreadingdetailcheck(true)
      setEbreadingdetails(res_vendor?.data?.ebreadingdetails.reverse());
    } catch (err) {
      setEbreadingdetailcheck(true)
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  }






  const fetchEbreadingdetailsFilterDate = async (date) => {
    let varfilter = []
    try {
      let res_read = await axios.post(SERVICE.EB_SERVICEFILTER, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        company: String(ebreadingdetail.company),
        branch: String(ebreadingdetail.branch),
        unit: String(ebreadingdetail.unit),
        floor: String(ebreadingdetail.floor),
        area: String(ebreadingdetail.area),
        servicenumber: String(ebreadingdetail.servicenumber),
        time: String(ebreadingdetail.time),
        readingmode: String(readingmode),
        date: String(date),
      });

      varfilter = res_read?.data?.ebreadingfiltertime
      const openEntries = varfilter.filter(item => item.readingmode === "Open Entry");
      const ReadingEntries = varfilter.filter(item => item.readingmode !== "Open Entry");

      // const mostRecentDate = varfilter.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ? current : prev));
      let mostRecentDate = { openkwh: 0, kvah: 0 }
      let mostRecentDatereading = { openkwh: 0, kvah: 0 }
      setcheckServicemasterBeforeDate(varfilter.length)
      if (res_read?.data?.ebreadingfiltertime.length > 0) {
        let logbeforecreated = openEntries.length > 0 && openEntries.some(current => new Date(current.date) > new Date(current.createdAt)) || (openEntries.length > 0 && ReadingEntries.length == 0)
        console.log(logbeforecreated, "logbeforecreated")

        if (logbeforecreated) {
          if (ReadingEntries.length > 0) {
            mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
              current : prev));
          }
          if (openEntries.length > 0) {
            mostRecentDate = openEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
              current : prev));
          }

          if (ReadingEntries.length > 0 && openEntries.length > 0) {

            if ((mostRecentDate.date) == (date)) {
              mostRecentDate = mostRecentDate
            } else if (new Date(mostRecentDate.date) < new Date(date) && mostRecentDate.date == (mostRecentDatereading.date) && new Date(mostRecentDate.createdAt) >= new Date(mostRecentDatereading.createdAt) && openEntries.length > 0 && ReadingEntries.length > 0) {
              mostRecentDate = mostRecentDate
            }
            else if (new Date(mostRecentDate.date) < new Date(date) && new Date(mostRecentDate.date) > new Date(mostRecentDatereading.date) && openEntries.length > 0 && ReadingEntries.length > 0) {
              mostRecentDate = mostRecentDate
            }
            else {
              mostRecentDate = mostRecentDatereading
            }
          }
          else if (ReadingEntries.length > 0) {
            mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
              current : prev));
            if (mostRecentDatereading.date == date) {
              mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                current : prev));
              mostRecentDate = mostRecentDatereading
            } else {
              mostRecentDate = mostRecentDatereading
            }
          } else {
            mostRecentDate = openEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
              current : prev));
            mostRecentDate = mostRecentDate
          }

        }
        else {
          let serviceold = res_read?.data?.ebreadingfiltertimeold
          let serviceoldRecentDate = { openkwh: 0, kvah: 0 }
          console.log(varfilter, serviceold, "varfilter")
          if (serviceold?.length > 0) {
            serviceoldRecentDate = serviceold.reduce((prev, current) => (new Date(current.servicedate) > new Date(prev.servicedate) ?
              current : prev));
          }
          if (ReadingEntries.length > 0) {
            if (readingmode == "Session Closing") {
              console.log("popo")
              mostRecentDate = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                current : prev));
            } else {

              mostRecentDate = ReadingEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                current : prev));

              const withoutlogoldentry = res_read?.data?.ebreadingwithoutlogoldentry.filter(t =>
                !serviceoldRecentDate.servicelog.some(d => new Date(t.date) >= new Date(d.startdate) && new Date(t.date) <= new Date(d.enddate) && new Date(t.createdAt) > new Date(d.date))
              )
              console.log(withoutlogoldentry, "withoutlogoldentry")

              if (withoutlogoldentry.length > 0) {
                mostRecentDate = withoutlogoldentry.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                  current : prev));
              } else if (serviceold?.length > 0 && withoutlogoldentry.length === 0) {
                mostRecentDate = serviceoldRecentDate
              } else if (new Date(serviceoldRecentDate.createdAt) >= new Date(mostRecentDate.createdAt) && serviceold?.length > 0 && ReadingEntries.length > 0) {
                mostRecentDate = serviceoldRecentDate
              } else {
                mostRecentDate = mostRecentDate
              }

            }
          }



          // const checkIslogoldentry = serviceoldRecentDate.servicelog.find(d => new Date(mostRecentDate.date) >= new Date(d.startdate) && new Date(mostRecentDate.date) <= new Date(d.enddate))

          // console.log(checkIslogoldentry, "checkIslogoldentry")

          // if (checkIslogoldentry && new Date(checkIslogoldentry.date) <= new Date(mostRecentDate.createdAt)) {
          //   mostRecentDate = serviceoldRecentDate
          // }


        }



        if (ebreadingdetail.openkwh > 0 && mostRecentDate.openkwh > 0) {
          let differecnce = Number(ebreadingdetail.openkwh) - Number(mostRecentDate.openkwh)
          setReadingFilter(differecnce)
          if (readingFilterKvh > 0 && differecnce > 0) {
            setPfdifference(differecnce / readingFilterKvh)
          }

        }

      }
      if (res_read?.data?.ebreadingfiltertime.length > 0) {

        let logbeforecreated = openEntries.length > 0 && openEntries.some(current => new Date(current.date) > new Date(current.createdAt)) || (openEntries.length > 0 && ReadingEntries.length == 0)
        console.log(logbeforecreated, "logbeforecreated")

        if (logbeforecreated) {
          if (ReadingEntries.length > 0) {
            mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
              current : prev));
          }
          if (openEntries.length > 0) {
            mostRecentDate = openEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
              current : prev));
          }

          if (ReadingEntries.length > 0 && openEntries.length > 0) {

            if ((mostRecentDate.date) == (date)) {
              mostRecentDate = mostRecentDate
            } else if (new Date(mostRecentDate.date) < new Date(date) && mostRecentDate.date == (mostRecentDatereading.date) && new Date(mostRecentDate.createdAt) >= new Date(mostRecentDatereading.createdAt) && openEntries.length > 0 && ReadingEntries.length > 0) {
              mostRecentDate = mostRecentDate
            }
            else if (new Date(mostRecentDate.date) < new Date(date) && new Date(mostRecentDate.date) > new Date(mostRecentDatereading.date) && openEntries.length > 0 && ReadingEntries.length > 0) {
              mostRecentDate = mostRecentDate
            }
            else {
              mostRecentDate = mostRecentDatereading
            }
          }
          else if (ReadingEntries.length > 0) {
            mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
              current : prev));
            if (mostRecentDatereading.date == ebreadingdetail.date) {
              mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                current : prev));
              mostRecentDate = mostRecentDatereading
            } else {
              mostRecentDate = mostRecentDatereading
            }
          } else {
            mostRecentDate = openEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
              current : prev));
            mostRecentDate = mostRecentDate
          }

        }
        else {
          let serviceold = res_read?.data?.ebreadingfiltertimeold
          let serviceoldRecentDate = { openkwh: 0, kvah: 0 }
          console.log(varfilter, serviceold, "varfilter")
          if (serviceold?.length > 0) {
            serviceoldRecentDate = serviceold.reduce((prev, current) => (new Date(current.servicedate) > new Date(prev.servicedate) ?
              current : prev));
          }
          if (ReadingEntries.length > 0) {
            if (readingmode == "Session Closing") {
              console.log("popo")
              mostRecentDate = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                current : prev));
            } else {

              mostRecentDate = ReadingEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                current : prev));

              const withoutlogoldentry = res_read?.data?.ebreadingwithoutlogoldentry.filter(t =>
                !serviceoldRecentDate.servicelog.some(d => new Date(t.date) >= new Date(d.startdate) && new Date(t.date) <= new Date(d.enddate) && new Date(t.createdAt) > new Date(d.date))
              )
              console.log(withoutlogoldentry, "withoutlogoldentry")

              if (withoutlogoldentry.length > 0) {
                mostRecentDate = withoutlogoldentry.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                  current : prev));
              } else if (serviceold?.length > 0 && withoutlogoldentry.length === 0) {
                mostRecentDate = serviceoldRecentDate
              } else if (new Date(serviceoldRecentDate.createdAt) >= new Date(mostRecentDate.createdAt) && serviceold?.length > 0 && ReadingEntries.length > 0) {
                mostRecentDate = serviceoldRecentDate
              } else {
                mostRecentDate = mostRecentDate
              }

            }
          }



          // const checkIslogoldentry = serviceoldRecentDate.servicelog.find(d => new Date(mostRecentDate.date) >= new Date(d.startdate) && new Date(mostRecentDate.date) <= new Date(d.enddate))

          // console.log(checkIslogoldentry, "checkIslogoldentry")

          // if (checkIslogoldentry && new Date(checkIslogoldentry.date) <= new Date(mostRecentDate.createdAt)) {
          //   mostRecentDate = serviceoldRecentDate
          // }


        }




        if (ebreadingdetail.kvah > 0 && mostRecentDate.kvah > 0) {

          let differecnce = Number(ebreadingdetail.kvah) - Number(mostRecentDate.kvah)
          setReadingFilterKVH(differecnce)
        }
      }
      if (res_read?.data?.ebreadingfiltertimefuture) {
        setFutureUpdate(res_read?.data?.ebreadingfiltertimefuture[0])
        setFutureUpdatearr(res_read?.data?.ebreadingfiltertimefuture)
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  }







  const fetchEbreadingdetailsFilterTime = async (date) => {
    let varfilter = []
    try {
      let res_read = await axios.post(SERVICE.EB_SERVICEFILTER, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        company: String(ebreadingdetail.company),
        branch: String(ebreadingdetail.branch),
        unit: String(ebreadingdetail.unit),
        floor: String(ebreadingdetail.floor),
        area: String(ebreadingdetail.area),
        servicenumber: String(ebreadingdetail.servicenumber),
        readingmode: String(readingmode),
        time: String(date),
        date: String(ebreadingdetail.date),
      });

      varfilter = res_read?.data?.ebreadingfiltertime
      setcheckServicemasterBeforeDate(varfilter?.length)

      const openEntries = varfilter.filter(item => item.readingmode === "Open Entry");
      const ReadingEntries = varfilter.filter(item => item.readingmode !== "Open Entry");

      // const mostRecentDate = varfilter.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ? current : prev));
      let mostRecentDate = { openkwh: 0, kvah: 0 }
      let mostRecentDatereading = { openkwh: 0, kvah: 0 }
      if (res_read?.data?.ebreadingfiltertime.length > 0) {
        let logbeforecreated = openEntries.length > 0 && openEntries.some(current => new Date(current.date) > new Date(current.createdAt)) || (openEntries.length > 0 && ReadingEntries.length == 0)
        console.log(logbeforecreated, "logbeforecreated")

        if (logbeforecreated) {
          if (ReadingEntries.length > 0) {
            mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
              current : prev));
          }
          if (openEntries.length > 0) {
            mostRecentDate = openEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
              current : prev));
          }

          if (ReadingEntries.length > 0 && openEntries.length > 0) {

            if ((mostRecentDate.date) == (ebreadingdetail.date)) {
              mostRecentDate = mostRecentDate
            } else if (new Date(mostRecentDate.date) < new Date(ebreadingdetail.date) && mostRecentDate.date == (mostRecentDatereading.date) && new Date(mostRecentDate.createdAt) >= new Date(mostRecentDatereading.createdAt) && openEntries.length > 0 && ReadingEntries.length > 0) {
              mostRecentDate = mostRecentDate
            }
            else if (new Date(mostRecentDate.date) < new Date(ebreadingdetail.date) && new Date(mostRecentDate.date) > new Date(mostRecentDatereading.date) && openEntries.length > 0 && ReadingEntries.length > 0) {
              mostRecentDate = mostRecentDate
            }
            else {
              mostRecentDate = mostRecentDatereading
            }
          }
          else if (ReadingEntries.length > 0) {
            mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
              current : prev));
            if (mostRecentDatereading.date == ebreadingdetail.date) {
              mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                current : prev));
              mostRecentDate = mostRecentDatereading
            } else {
              mostRecentDate = mostRecentDatereading
            }
          } else {
            mostRecentDate = openEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
              current : prev));
            mostRecentDate = mostRecentDate
          }

        }
        else {
          let serviceold = res_read?.data?.ebreadingfiltertimeold
          let serviceoldRecentDate = { openkwh: 0, kvah: 0 }
          console.log(varfilter, serviceold, "varfilter")
          if (serviceold?.length > 0) {
            serviceoldRecentDate = serviceold.reduce((prev, current) => (new Date(current.servicedate) > new Date(prev.servicedate) ?
              current : prev));
          }
          if (ReadingEntries.length > 0) {
            if (readingmode == "Session Closing") {
              console.log("popo")
              mostRecentDate = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                current : prev));
            } else {

              mostRecentDate = ReadingEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                current : prev));

              const withoutlogoldentry = res_read?.data?.ebreadingwithoutlogoldentry.filter(t =>
                !serviceoldRecentDate.servicelog.some(d => new Date(t.date) >= new Date(d.startdate) && new Date(t.date) <= new Date(d.enddate) && new Date(t.createdAt) > new Date(d.date))
              )
              console.log(withoutlogoldentry, "withoutlogoldentry")

              if (withoutlogoldentry.length > 0) {
                mostRecentDate = withoutlogoldentry.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                  current : prev));
              } else if (serviceold?.length > 0 && withoutlogoldentry.length === 0) {
                mostRecentDate = serviceoldRecentDate
              } else if (new Date(serviceoldRecentDate.createdAt) >= new Date(mostRecentDate.createdAt) && serviceold?.length > 0 && ReadingEntries.length > 0) {
                mostRecentDate = serviceoldRecentDate
              } else {
                mostRecentDate = mostRecentDate
              }

            }
          }



          // const checkIslogoldentry = serviceoldRecentDate.servicelog.find(d => new Date(mostRecentDate.date) >= new Date(d.startdate) && new Date(mostRecentDate.date) <= new Date(d.enddate))

          // console.log(checkIslogoldentry, "checkIslogoldentry")

          // if (checkIslogoldentry && new Date(checkIslogoldentry.date) <= new Date(mostRecentDate.createdAt)) {
          //   mostRecentDate = serviceoldRecentDate
          // }


        }





        if (ebreadingdetail.openkwh > 0 && mostRecentDate.openkwh > 0) {
          let differecnce = Number(ebreadingdetail.openkwh) - Number(mostRecentDate.openkwh)
          setReadingFilter(differecnce)
          if (readingFilterKvh > 0 && differecnce > 0) {
            setPfdifference(differecnce / readingFilterKvh)
          }

        }

      }
      if (res_read?.data?.ebreadingfiltertime.length > 0) {
        // let lastvalue = varfilter[varfilter.length - 1]
        // const mostRecentDate = varfilter.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ? current : prev));

        let logbeforecreated = openEntries.length > 0 && openEntries.some(current => new Date(current.date) > new Date(current.createdAt)) || (openEntries.length > 0 && ReadingEntries.length == 0)
        console.log(logbeforecreated, "logbeforecreated")

        if (logbeforecreated) {
          if (ReadingEntries.length > 0) {
            mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
              current : prev));
          }
          if (openEntries.length > 0) {
            mostRecentDate = openEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
              current : prev));
          }

          if (ReadingEntries.length > 0 && openEntries.length > 0) {

            if ((mostRecentDate.date) == (ebreadingdetail.date)) {
              mostRecentDate = mostRecentDate
            } else if (new Date(mostRecentDate.date) < new Date(ebreadingdetail.date) && mostRecentDate.date == (mostRecentDatereading.date) && new Date(mostRecentDate.createdAt) >= new Date(mostRecentDatereading.createdAt) && openEntries.length > 0 && ReadingEntries.length > 0) {
              mostRecentDate = mostRecentDate
            }
            else if (new Date(mostRecentDate.date) < new Date(ebreadingdetail.date) && new Date(mostRecentDate.date) > new Date(mostRecentDatereading.date) && openEntries.length > 0 && ReadingEntries.length > 0) {
              mostRecentDate = mostRecentDate
            }
            else {
              mostRecentDate = mostRecentDatereading
            }
          }
          else if (ReadingEntries.length > 0) {
            mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
              current : prev));
            if (mostRecentDatereading.date == ebreadingdetail.date) {
              mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                current : prev));
              mostRecentDate = mostRecentDatereading
            } else {
              mostRecentDate = mostRecentDatereading
            }
          } else {
            mostRecentDate = openEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
              current : prev));
            mostRecentDate = mostRecentDate
          }

        }
        else {
          let serviceold = res_read?.data?.ebreadingfiltertimeold
          let serviceoldRecentDate = { openkwh: 0, kvah: 0 }
          console.log(varfilter, serviceold, "varfilter")
          if (serviceold?.length > 0) {
            serviceoldRecentDate = serviceold.reduce((prev, current) => (new Date(current.servicedate) > new Date(prev.servicedate) ?
              current : prev));
          }
          if (ReadingEntries.length > 0) {
            if (readingmode == "Session Closing") {
              console.log("popo")
              mostRecentDate = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                current : prev));
            } else {

              mostRecentDate = ReadingEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                current : prev));

              const withoutlogoldentry = res_read?.data?.ebreadingwithoutlogoldentry.filter(t =>
                !serviceoldRecentDate.servicelog.some(d => new Date(t.date) >= new Date(d.startdate) && new Date(t.date) <= new Date(d.enddate) && new Date(t.createdAt) > new Date(d.date))
              )
              console.log(withoutlogoldentry, "withoutlogoldentry")

              if (withoutlogoldentry.length > 0) {
                mostRecentDate = withoutlogoldentry.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                  current : prev));
              } else if (serviceold?.length > 0 && withoutlogoldentry.length === 0) {
                mostRecentDate = serviceoldRecentDate
              } else if (new Date(serviceoldRecentDate.createdAt) >= new Date(mostRecentDate.createdAt) && serviceold?.length > 0 && ReadingEntries.length > 0) {
                mostRecentDate = serviceoldRecentDate
              } else {
                mostRecentDate = mostRecentDate
              }

            }
          }



          // const checkIslogoldentry = serviceoldRecentDate.servicelog.find(d => new Date(mostRecentDate.date) >= new Date(d.startdate) && new Date(mostRecentDate.date) <= new Date(d.enddate))

          // console.log(checkIslogoldentry, "checkIslogoldentry")

          // if (checkIslogoldentry && new Date(checkIslogoldentry.date) <= new Date(mostRecentDate.createdAt)) {
          //   mostRecentDate = serviceoldRecentDate
          // }


        }



        if (ebreadingdetail.kvah > 0 && mostRecentDate.kvah > 0) {

          let differecnce = Number(ebreadingdetail.kvah) - Number(mostRecentDate.kvah)
          setReadingFilterKVH(differecnce)
        }
      }
      if (res_read?.data?.ebreadingfiltertimefuture) {
        setFutureUpdate(res_read?.data?.ebreadingfiltertimefuture[0])
        setFutureUpdatearr(res_read?.data?.ebreadingfiltertimefuture)
      }
    } catch (err) {
      console.log(err, "errtime")
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  }



  const fetchEbreadingdetailsFilterReading = async (val) => {
    let varfilter = []
    try {
      let res_read = await axios.post(SERVICE.EB_SERVICEFILTER, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        company: String(ebreadingdetail.company),
        branch: String(ebreadingdetail.branch),
        unit: String(ebreadingdetail.unit),
        floor: String(ebreadingdetail.floor),
        area: String(ebreadingdetail.area),
        servicenumber: String(ebreadingdetail.servicenumber),
        readingmode: String(val),
        time: String(ebreadingdetail.time),
        date: String(ebreadingdetail.date),
      });
      varfilter = res_read?.data?.ebreadingfiltertime
      setcheckServicemasterBeforeDate(varfilter.length)
      // if (res_read?.data?.ebreadingfiltertime.length > 0) {
      //   const mostRecentDate = varfilter.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
      //     current : prev));

      //   if (ebreadingdetail.openkwh > 0 && mostRecentDate.openkwh > 0) {
      //     let differecnce = Number(ebreadingdetail.openkwh) - Number(mostRecentDate.openkwh)
      //     setReadingFilter(differecnce)
      //     if (readingFilterKvh > 0 && differecnce > 0) {
      //       setPfdifference(differecnce / readingFilterKvh)
      //     }

      //   }

      // }
      varfilter = res_read?.data?.ebreadingfiltertime
      const openEntries = varfilter.filter(item => item.readingmode === "Open Entry");
      const ReadingEntries = varfilter.filter(item => item.readingmode !== "Open Entry");

      // const mostRecentDate = varfilter.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ? current : prev));
      let mostRecentDate = { openkwh: 0, kvah: 0 }
      let mostRecentDatereading = { openkwh: 0, kvah: 0 }

      if (res_read?.data?.ebreadingfiltertime.length > 0) {

        let logbeforecreated = openEntries.length > 0 && openEntries.some(current => new Date(current.date) > new Date(current.createdAt)) || (openEntries.length > 0 && ReadingEntries.length == 0)
        console.log(logbeforecreated, "logbeforecreated")

        if (logbeforecreated) {
          if (ReadingEntries.length > 0) {
            mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
              current : prev));
          }
          if (openEntries.length > 0) {
            mostRecentDate = openEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
              current : prev));
          }

          if (ReadingEntries.length > 0 && openEntries.length > 0) {

            if ((mostRecentDate.date) == (ebreadingdetail.date)) {
              mostRecentDate = mostRecentDate
            } else if (new Date(mostRecentDate.date) < new Date(ebreadingdetail.date) && mostRecentDate.date == (mostRecentDatereading.date) && new Date(mostRecentDate.createdAt) >= new Date(mostRecentDatereading.createdAt) && openEntries.length > 0 && ReadingEntries.length > 0) {
              mostRecentDate = mostRecentDate
            }
            else if (new Date(mostRecentDate.date) < new Date(ebreadingdetail.date) && new Date(mostRecentDate.date) > new Date(mostRecentDatereading.date) && openEntries.length > 0 && ReadingEntries.length > 0) {
              mostRecentDate = mostRecentDate
            }
            else {
              mostRecentDate = mostRecentDatereading
            }
          }
          else if (ReadingEntries.length > 0) {
            mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
              current : prev));
            if (mostRecentDatereading.date == ebreadingdetail.date) {
              mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                current : prev));
              mostRecentDate = mostRecentDatereading
            } else {
              mostRecentDate = mostRecentDatereading
            }
          } else {
            mostRecentDate = openEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
              current : prev));
            mostRecentDate = mostRecentDate
          }

        }
        else {
          let serviceold = res_read?.data?.ebreadingfiltertimeold
          let serviceoldRecentDate = { openkwh: 0, kvah: 0 }
          console.log(varfilter, serviceold, "varfilter")
          if (serviceold?.length > 0) {
            serviceoldRecentDate = serviceold.reduce((prev, current) => (new Date(current.servicedate) > new Date(prev.servicedate) ?
              current : prev));
          }
          if (ReadingEntries.length > 0) {
            if (readingmode == "Session Closing") {
              console.log("popo")
              mostRecentDate = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                current : prev));
            } else {

              mostRecentDate = ReadingEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                current : prev));

              const withoutlogoldentry = res_read?.data?.ebreadingwithoutlogoldentry.filter(t =>
                !serviceoldRecentDate.servicelog.some(d => new Date(t.date) >= new Date(d.startdate) && new Date(t.date) <= new Date(d.enddate) && new Date(t.createdAt) > new Date(d.date))
              )
              console.log(withoutlogoldentry, "withoutlogoldentry")

              if (withoutlogoldentry.length > 0) {
                mostRecentDate = withoutlogoldentry.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                  current : prev));
              } else if (serviceold?.length > 0 && withoutlogoldentry.length === 0) {
                mostRecentDate = serviceoldRecentDate
              } else if (new Date(serviceoldRecentDate.createdAt) >= new Date(mostRecentDate.createdAt) && serviceold?.length > 0 && ReadingEntries.length > 0) {
                mostRecentDate = serviceoldRecentDate
              } else {
                mostRecentDate = mostRecentDate
              }

            }
          }



          // const checkIslogoldentry = serviceoldRecentDate.servicelog.find(d => new Date(mostRecentDate.date) >= new Date(d.startdate) && new Date(mostRecentDate.date) <= new Date(d.enddate))

          // console.log(checkIslogoldentry, "checkIslogoldentry")

          // if (checkIslogoldentry && new Date(checkIslogoldentry.date) <= new Date(mostRecentDate.createdAt)) {
          //   mostRecentDate = serviceoldRecentDate
          // }


        }



        if (ebreadingdetail.openkwh > 0 && mostRecentDate.openkwh > 0) {
          let differecnce = Number(ebreadingdetail.openkwh) - Number(mostRecentDate.openkwh)
          setReadingFilter(differecnce)
          if (readingFilterKvh > 0 && differecnce > 0) {
            setPfdifference(differecnce / readingFilterKvh)
          }

        }

      }
      if (res_read?.data?.ebreadingfiltertime.length > 0) {

        let logbeforecreated = openEntries.length > 0 && openEntries.some(current => new Date(current.date) > new Date(current.createdAt)) || (openEntries.length > 0 && ReadingEntries.length == 0)
        console.log(logbeforecreated, "logbeforecreated")

        if (logbeforecreated) {
          if (ReadingEntries.length > 0) {
            mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
              current : prev));
          }
          if (openEntries.length > 0) {
            mostRecentDate = openEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
              current : prev));
          }

          if (ReadingEntries.length > 0 && openEntries.length > 0) {

            if ((mostRecentDate.date) == (ebreadingdetail.date)) {
              mostRecentDate = mostRecentDate
            } else if (new Date(mostRecentDate.date) < new Date(ebreadingdetail.date) && mostRecentDate.date == (mostRecentDatereading.date) && new Date(mostRecentDate.createdAt) >= new Date(mostRecentDatereading.createdAt) && openEntries.length > 0 && ReadingEntries.length > 0) {
              mostRecentDate = mostRecentDate
            }
            else if (new Date(mostRecentDate.date) < new Date(ebreadingdetail.date) && new Date(mostRecentDate.date) > new Date(mostRecentDatereading.date) && openEntries.length > 0 && ReadingEntries.length > 0) {
              mostRecentDate = mostRecentDate
            }
            else {
              mostRecentDate = mostRecentDatereading
            }
          }
          else if (ReadingEntries.length > 0) {
            mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
              current : prev));
            if (mostRecentDatereading.date == ebreadingdetail.date) {
              mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                current : prev));
              mostRecentDate = mostRecentDatereading
            } else {
              mostRecentDate = mostRecentDatereading
            }
          } else {
            mostRecentDate = openEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
              current : prev));
            mostRecentDate = mostRecentDate
          }

        }
        else {
          let serviceold = res_read?.data?.ebreadingfiltertimeold
          let serviceoldRecentDate = { openkwh: 0, kvah: 0 }
          console.log(varfilter, serviceold, "varfilter")
          if (serviceold?.length > 0) {
            serviceoldRecentDate = serviceold.reduce((prev, current) => (new Date(current.servicedate) > new Date(prev.servicedate) ?
              current : prev));
          }
          if (ReadingEntries.length > 0) {
            if (readingmode == "Session Closing") {
              console.log("popo")
              mostRecentDate = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                current : prev));
            } else {

              mostRecentDate = ReadingEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                current : prev));

              const withoutlogoldentry = res_read?.data?.ebreadingwithoutlogoldentry.filter(t =>
                !serviceoldRecentDate.servicelog.some(d => new Date(t.date) >= new Date(d.startdate) && new Date(t.date) <= new Date(d.enddate) && new Date(t.createdAt) > new Date(d.date))
              )
              console.log(withoutlogoldentry, "withoutlogoldentry")

              if (withoutlogoldentry.length > 0) {
                mostRecentDate = withoutlogoldentry.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                  current : prev));
              } else if (serviceold?.length > 0 && withoutlogoldentry.length === 0) {
                mostRecentDate = serviceoldRecentDate
              } else if (new Date(serviceoldRecentDate.createdAt) >= new Date(mostRecentDate.createdAt) && serviceold?.length > 0 && ReadingEntries.length > 0) {
                mostRecentDate = serviceoldRecentDate
              } else {
                mostRecentDate = mostRecentDate
              }

            }
          }



          // const checkIslogoldentry = serviceoldRecentDate.servicelog.find(d => new Date(mostRecentDate.date) >= new Date(d.startdate) && new Date(mostRecentDate.date) <= new Date(d.enddate))

          // console.log(checkIslogoldentry, "checkIslogoldentry")

          // if (checkIslogoldentry && new Date(checkIslogoldentry.date) <= new Date(mostRecentDate.createdAt)) {
          //   mostRecentDate = serviceoldRecentDate
          // }


        }




        if (ebreadingdetail.kvah > 0 && mostRecentDate.kvah > 0) {

          let differecnce = Number(ebreadingdetail.kvah) - Number(mostRecentDate.kvah)
          setReadingFilterKVH(differecnce)
        }
      }
      if (res_read?.data?.ebreadingfiltertimefuture) {

        setFutureUpdate(res_read?.data?.ebreadingfiltertimefuture[0])
        setFutureUpdatearr(res_read?.data?.ebreadingfiltertimefuture)
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  }




  const fetchEbreadingdetailsFilterKWH = async (kwhval) => {
    let varfilter = []
    try {
      let res_read = await axios.post(SERVICE.EB_SERVICEFILTER, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        company: String(ebreadingdetail.company),
        branch: String(ebreadingdetail.branch),
        unit: String(ebreadingdetail.unit),
        floor: String(ebreadingdetail.floor),
        area: String(ebreadingdetail.area),
        servicenumber: String(ebreadingdetail.servicenumber),
        date: String(ebreadingdetail.date),
        time: String(ebreadingdetail.time),
        readingmode: String(readingmode),

      });
      varfilter = res_read?.data?.ebreadingfiltertime
      setcheckServicemasterBeforeDate(varfilter.length)
      console.log(varfilter, "read")
      const openEntries = varfilter.filter(item => item.readingmode === "Open Entry");
      console.log(openEntries, "openentries")
      const ReadingEntries = varfilter.filter(item => item.readingmode !== "Open Entry");
      let mostRecentDate = { openkwh: 0, kvah: 0 }
      let mostRecentDatereading = { openkwh: 0, kvah: 0 }
      if (res_read?.data?.ebreadingfiltertimefuture.length > 0) {
        setFutureUpdate(res_read?.data?.ebreadingfiltertimefuture[0])
        setFutureUpdatearr(res_read?.data?.ebreadingfiltertimefuture)

        if (Number(kwhval) > res_read?.data?.ebreadingfiltertimefuture[0]?.openkwh) {
          const mostRecentDate = varfilter.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ? current : prev));


          let differecnce = Number(kwhval) - Number(mostRecentDate.openkwh)
          setReadingFilter(differecnce)

          if (readingFilterKvh > 0 && differecnce > 0) {
            setPfdifference(differecnce / readingFilterKvh)
          }
          // setPopupContentMalert("KWH Reading Has Future Date Value");

          setPopupContentMalert(`Please Enter KWH Value Less Than This ${res_read?.data?.ebreadingfiltertimefuture[0]?.date} KWH Value (${res_read?.data?.ebreadingfiltertimefuture[0]?.openkwh})`);

          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();


        }
        else if (res_read?.data?.ebreadingfiltertime.length > 0) {

          let logbeforecreated = openEntries.length > 0 && openEntries.some(current => new Date(current.date) > new Date(current.createdAt)) || (openEntries.length > 0 && ReadingEntries.length == 0)
          console.log(logbeforecreated, "logbeforecreated")

          if (logbeforecreated) {
            if (ReadingEntries.length > 0) {
              mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                current : prev));
            }
            if (openEntries.length > 0) {
              mostRecentDate = openEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                current : prev));
            }

            if (ReadingEntries.length > 0 && openEntries.length > 0) {

              if ((mostRecentDate.date) == (ebreadingdetail.date)) {
                mostRecentDate = mostRecentDate
              } else if (new Date(mostRecentDate.date) < new Date(ebreadingdetail.date) && mostRecentDate.date == (mostRecentDatereading.date) && new Date(mostRecentDate.createdAt) >= new Date(mostRecentDatereading.createdAt) && openEntries.length > 0 && ReadingEntries.length > 0) {
                mostRecentDate = mostRecentDate
              }
              else if (new Date(mostRecentDate.date) < new Date(ebreadingdetail.date) && new Date(mostRecentDate.date) > new Date(mostRecentDatereading.date) && openEntries.length > 0 && ReadingEntries.length > 0) {
                mostRecentDate = mostRecentDate
              }
              else {
                mostRecentDate = mostRecentDatereading
              }
            }
            else if (ReadingEntries.length > 0) {
              mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                current : prev));
              if (mostRecentDatereading.date == ebreadingdetail.date) {
                mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                  current : prev));
                mostRecentDate = mostRecentDatereading
              } else {
                mostRecentDate = mostRecentDatereading
              }
            } else {
              mostRecentDate = openEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                current : prev));
              mostRecentDate = mostRecentDate
            }

          }
          else {
            let serviceold = res_read?.data?.ebreadingfiltertimeold
            let serviceoldRecentDate = { openkwh: 0, kvah: 0 }
            console.log(varfilter, serviceold, "varfilter")
            if (serviceold?.length > 0) {
              serviceoldRecentDate = serviceold.reduce((prev, current) => (new Date(current.servicedate) > new Date(prev.servicedate) ?
                current : prev));
            }
            if (ReadingEntries.length > 0) {
              if (readingmode == "Session Closing") {
                console.log("popo")
                mostRecentDate = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                  current : prev));
              } else {

                mostRecentDate = ReadingEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                  current : prev));

                const withoutlogoldentry = res_read?.data?.ebreadingwithoutlogoldentry.filter(t =>
                  !serviceoldRecentDate.servicelog.some(d => new Date(t.date) >= new Date(d.startdate) && new Date(t.date) <= new Date(d.enddate) && new Date(t.createdAt) > new Date(d.date))
                )
                console.log(withoutlogoldentry, "withoutlogoldentry")

                if (withoutlogoldentry.length > 0) {
                  mostRecentDate = withoutlogoldentry.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                    current : prev));
                } else if (serviceold?.length > 0 && withoutlogoldentry.length === 0) {
                  mostRecentDate = serviceoldRecentDate
                } else if (new Date(serviceoldRecentDate.createdAt) >= new Date(mostRecentDate.createdAt) && serviceold?.length > 0 && ReadingEntries.length > 0) {
                  mostRecentDate = serviceoldRecentDate
                } else {
                  mostRecentDate = mostRecentDate
                }

              }
            }



            // const checkIslogoldentry = serviceoldRecentDate.servicelog.find(d => new Date(mostRecentDate.date) >= new Date(d.startdate) && new Date(mostRecentDate.date) <= new Date(d.enddate))

            // console.log(checkIslogoldentry, "checkIslogoldentry")

            // if (checkIslogoldentry && new Date(checkIslogoldentry.date) <= new Date(mostRecentDate.createdAt)) {
            //   mostRecentDate = serviceoldRecentDate
            // }


          }



          let differecnce = Number(kwhval) - Number(mostRecentDate.openkwh)
          setReadingFilter(differecnce)


          if (readingFilterKvh > 0 && differecnce > 0) {
            setPfdifference(differecnce / readingFilterKvh)
          }

        }

      }

      else if (res_read?.data?.ebreadingfiltertime.length > 0) {


        let logbeforecreated = openEntries.length > 0 && openEntries.some(current => new Date(current.date) > new Date(current.createdAt)) || (openEntries.length > 0 && ReadingEntries.length == 0)
        console.log(logbeforecreated, "logbeforecreated")

        if (logbeforecreated) {
          if (ReadingEntries.length > 0) {
            mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
              current : prev));
          }
          if (openEntries.length > 0) {
            mostRecentDate = openEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
              current : prev));
          }

          if (ReadingEntries.length > 0 && openEntries.length > 0) {

            if ((mostRecentDate.date) == (ebreadingdetail.date)) {
              mostRecentDate = mostRecentDate
            } else if (new Date(mostRecentDate.date) < new Date(ebreadingdetail.date) && mostRecentDate.date == (mostRecentDatereading.date) && new Date(mostRecentDate.createdAt) >= new Date(mostRecentDatereading.createdAt) && openEntries.length > 0 && ReadingEntries.length > 0) {
              mostRecentDate = mostRecentDate
            }
            else if (new Date(mostRecentDate.date) < new Date(ebreadingdetail.date) && new Date(mostRecentDate.date) > new Date(mostRecentDatereading.date) && openEntries.length > 0 && ReadingEntries.length > 0) {
              mostRecentDate = mostRecentDate
            }
            else {
              mostRecentDate = mostRecentDatereading
            }
          }
          else if (ReadingEntries.length > 0) {
            mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
              current : prev));
            if (mostRecentDatereading.date == ebreadingdetail.date) {
              mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                current : prev));
              mostRecentDate = mostRecentDatereading
            } else {
              mostRecentDate = mostRecentDatereading
            }
          } else {
            mostRecentDate = openEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
              current : prev));
            mostRecentDate = mostRecentDate
          }

        }
        else {
          let serviceold = res_read?.data?.ebreadingfiltertimeold
          let serviceoldRecentDate = { openkwh: 0, kvah: 0 }
          console.log(varfilter, serviceold, "varfilter")
          if (serviceold?.length > 0) {
            serviceoldRecentDate = serviceold.reduce((prev, current) => (new Date(current.servicedate) > new Date(prev.servicedate) ?
              current : prev));
          }
          if (ReadingEntries.length > 0) {
            if (readingmode == "Session Closing") {
              console.log("popo")
              mostRecentDate = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                current : prev));
            } else {

              mostRecentDate = ReadingEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                current : prev));

              const withoutlogoldentry = res_read?.data?.ebreadingwithoutlogoldentry.filter(t =>
                !serviceoldRecentDate.servicelog.some(d => new Date(t.date) >= new Date(d.startdate) && new Date(t.date) <= new Date(d.enddate) && new Date(t.createdAt) > new Date(d.date))
              )
              console.log(withoutlogoldentry, "withoutlogoldentry")

              if (withoutlogoldentry.length > 0) {
                mostRecentDate = withoutlogoldentry.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                  current : prev));
              } else if (serviceold?.length > 0 && withoutlogoldentry.length === 0) {
                mostRecentDate = serviceoldRecentDate
              } else if (new Date(serviceoldRecentDate.createdAt) >= new Date(mostRecentDate.createdAt) && serviceold?.length > 0 && ReadingEntries.length > 0) {
                mostRecentDate = serviceoldRecentDate
              } else {
                mostRecentDate = mostRecentDate
              }

            }
          }



          // const checkIslogoldentry = serviceoldRecentDate.servicelog.find(d => new Date(mostRecentDate.date) >= new Date(d.startdate) && new Date(mostRecentDate.date) <= new Date(d.enddate))

          // console.log(checkIslogoldentry, "checkIslogoldentry")

          // if (checkIslogoldentry && new Date(checkIslogoldentry.date) <= new Date(mostRecentDate.createdAt)) {
          //   mostRecentDate = serviceoldRecentDate
          // }


        }




        let differecnce = Number(kwhval) - Number(mostRecentDate.openkwh)
        setReadingFilter(differecnce)


        if (readingFilterKvh > 0 && differecnce > 0) {
          setPfdifference(differecnce / readingFilterKvh)
        }

      }

    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  }







  const fetchEbreadingdetailsFilterKVH = async (kvahval) => {
    let varfilter = []
    try {
      let res_read = await axios.post(SERVICE.EB_SERVICEFILTER, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        company: String(ebreadingdetail.company),
        branch: String(ebreadingdetail.branch),
        unit: String(ebreadingdetail.unit),
        floor: String(ebreadingdetail.floor),
        area: String(ebreadingdetail.area),
        servicenumber: String(ebreadingdetail.servicenumber),
        date: String(ebreadingdetail.date),
        readingmode: String(readingmode),
        time: String(ebreadingdetail.time),

      });
      varfilter = res_read?.data?.ebreadingfiltertime
      const openEntries = varfilter.filter(item => item.readingmode === "Open Entry");
      const ReadingEntries = varfilter.filter(item => item.readingmode !== "Open Entry");

      // const mostRecentDate = varfilter.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ? current : prev));
      let mostRecentDate = { openkwh: 0, kvah: 0 }
      let mostRecentDatereading = { openkwh: 0, kvah: 0 }
      setcheckServicemasterBeforeDate(varfilter.length)
      if (res_read?.data?.ebreadingfiltertimefuture.length > 0) {
        setFutureUpdate(res_read?.data?.ebreadingfiltertimefuture[0])
        setFutureUpdatearr(res_read?.data?.ebreadingfiltertimefuture)
        if (Number(kvahval) > res_read?.data?.ebreadingfiltertimefuture[0]?.kvah) {
          const mostRecentDate = varfilter.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ? current : prev));
          let differecnce = Number(kvahval) - Number(mostRecentDate.kvah)
          setReadingFilterKVH(differecnce)


          if (readingFilter > 0 && differecnce > 0) {
            setPfdifference(readingFilter / differecnce)
          }
          // setPopupContentMalert("KVAH Reading Has Future Date Value");
          // setPopupContentMalert(`Please Enter KVAH Reading Less Than This ${res_read?.data?.ebreadingfiltertimefuture[0].date}`);
          setPopupContentMalert(`Please Enter KVAH Value Less Than This ${res_read?.data?.ebreadingfiltertimefuture[0]?.date} KVAH Value (${res_read?.data?.ebreadingfiltertimefuture[0]?.kvah})`);

          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
        } else if (res_read?.data?.ebreadingfiltertime.length > 0) {
          varfilter = res_read?.data?.ebreadingfiltertime


          let logbeforecreated = openEntries.length > 0 && openEntries.some(current => new Date(current.date) > new Date(current.createdAt)) || (openEntries.length > 0 && ReadingEntries.length == 0)
          console.log(logbeforecreated, "logbeforecreated")

          if (logbeforecreated) {
            if (ReadingEntries.length > 0) {
              mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                current : prev));
            }
            if (openEntries.length > 0) {
              mostRecentDate = openEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                current : prev));
            }

            if (ReadingEntries.length > 0 && openEntries.length > 0) {

              if ((mostRecentDate.date) == (ebreadingdetail.date)) {
                mostRecentDate = mostRecentDate
              } else if (new Date(mostRecentDate.date) < new Date(ebreadingdetail.date) && mostRecentDate.date == (mostRecentDatereading.date) && new Date(mostRecentDate.createdAt) >= new Date(mostRecentDatereading.createdAt) && openEntries.length > 0 && ReadingEntries.length > 0) {
                mostRecentDate = mostRecentDate
              }
              else if (new Date(mostRecentDate.date) < new Date(ebreadingdetail.date) && new Date(mostRecentDate.date) > new Date(mostRecentDatereading.date) && openEntries.length > 0 && ReadingEntries.length > 0) {
                mostRecentDate = mostRecentDate
              }
              else {
                mostRecentDate = mostRecentDatereading
              }
            }
            else if (ReadingEntries.length > 0) {
              mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                current : prev));
              if (mostRecentDatereading.date == ebreadingdetail.date) {
                mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                  current : prev));
                mostRecentDate = mostRecentDatereading
              } else {
                mostRecentDate = mostRecentDatereading
              }
            } else {
              mostRecentDate = openEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                current : prev));
              mostRecentDate = mostRecentDate
            }

          }
          else {
            let serviceold = res_read?.data?.ebreadingfiltertimeold
            let serviceoldRecentDate = { openkwh: 0, kvah: 0 }
            console.log(varfilter, serviceold, "varfilter")
            if (serviceold?.length > 0) {
              serviceoldRecentDate = serviceold.reduce((prev, current) => (new Date(current.servicedate) > new Date(prev.servicedate) ?
                current : prev));
            }
            if (ReadingEntries.length > 0) {
              if (readingmode == "Session Closing") {
                console.log("popo")
                mostRecentDate = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                  current : prev));
              } else {

                mostRecentDate = ReadingEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                  current : prev));

                const withoutlogoldentry = res_read?.data?.ebreadingwithoutlogoldentry.filter(t =>
                  !serviceoldRecentDate.servicelog.some(d => new Date(t.date) >= new Date(d.startdate) && new Date(t.date) <= new Date(d.enddate) && new Date(t.createdAt) > new Date(d.date))
                )
                console.log(withoutlogoldentry, "withoutlogoldentry")

                if (withoutlogoldentry.length > 0) {
                  mostRecentDate = withoutlogoldentry.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                    current : prev));
                } else if (serviceold?.length > 0 && withoutlogoldentry.length === 0) {
                  mostRecentDate = serviceoldRecentDate
                } else if (new Date(serviceoldRecentDate.createdAt) >= new Date(mostRecentDate.createdAt) && serviceold?.length > 0 && ReadingEntries.length > 0) {
                  mostRecentDate = serviceoldRecentDate
                } else {
                  mostRecentDate = mostRecentDate
                }

              }
            }



            // const checkIslogoldentry = serviceoldRecentDate.servicelog.find(d => new Date(mostRecentDate.date) >= new Date(d.startdate) && new Date(mostRecentDate.date) <= new Date(d.enddate))

            // console.log(checkIslogoldentry, "checkIslogoldentry")

            // if (checkIslogoldentry && new Date(checkIslogoldentry.date) <= new Date(mostRecentDate.createdAt)) {
            //   mostRecentDate = serviceoldRecentDate
            // }


          }


          let differecnce = Number(kvahval) - Number(mostRecentDate.kvah)
          setReadingFilterKVH(differecnce)


          if (readingFilter > 0 && differecnce > 0) {
            setPfdifference(readingFilter / differecnce)
          }

        }

      } else if (res_read?.data?.ebreadingfiltertime.length > 0) {
        varfilter = res_read?.data?.ebreadingfiltertime

        let logbeforecreated = openEntries.length > 0 && openEntries.some(current => new Date(current.date) > new Date(current.createdAt)) || (openEntries.length > 0 && ReadingEntries.length == 0)
        console.log(logbeforecreated, "logbeforecreated")

        if (logbeforecreated) {
          if (ReadingEntries.length > 0) {
            mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
              current : prev));
          }
          if (openEntries.length > 0) {
            mostRecentDate = openEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
              current : prev));
          }

          if (ReadingEntries.length > 0 && openEntries.length > 0) {

            if ((mostRecentDate.date) == (ebreadingdetail.date)) {
              mostRecentDate = mostRecentDate
            } else if (new Date(mostRecentDate.date) < new Date(ebreadingdetail.date) && mostRecentDate.date == (mostRecentDatereading.date) && new Date(mostRecentDate.createdAt) >= new Date(mostRecentDatereading.createdAt) && openEntries.length > 0 && ReadingEntries.length > 0) {
              mostRecentDate = mostRecentDate
            }
            else if (new Date(mostRecentDate.date) < new Date(ebreadingdetail.date) && new Date(mostRecentDate.date) > new Date(mostRecentDatereading.date) && openEntries.length > 0 && ReadingEntries.length > 0) {
              mostRecentDate = mostRecentDate
            }
            else {
              mostRecentDate = mostRecentDatereading
            }
          }
          else if (ReadingEntries.length > 0) {
            mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
              current : prev));
            if (mostRecentDatereading.date == ebreadingdetail.date) {
              mostRecentDatereading = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                current : prev));
              mostRecentDate = mostRecentDatereading
            } else {
              mostRecentDate = mostRecentDatereading
            }
          } else {
            mostRecentDate = openEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
              current : prev));
            mostRecentDate = mostRecentDate
          }

        }
        else {
          let serviceold = res_read?.data?.ebreadingfiltertimeold
          let serviceoldRecentDate = { openkwh: 0, kvah: 0 }
          console.log(varfilter, serviceold, "varfilter")
          if (serviceold?.length > 0) {
            serviceoldRecentDate = serviceold.reduce((prev, current) => (new Date(current.servicedate) > new Date(prev.servicedate) ?
              current : prev));
          }
          if (ReadingEntries.length > 0) {
            if (readingmode == "Session Closing") {
              console.log("popo")
              mostRecentDate = ReadingEntries.reduce((prev, current) => (new Date(current.createdAt) > new Date(prev.createdAt) ?
                current : prev));
            } else {

              mostRecentDate = ReadingEntries.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                current : prev));

              const withoutlogoldentry = res_read?.data?.ebreadingwithoutlogoldentry.filter(t =>
                !serviceoldRecentDate.servicelog.some(d => new Date(t.date) >= new Date(d.startdate) && new Date(t.date) <= new Date(d.enddate) && new Date(t.createdAt) > new Date(d.date))
              )
              console.log(withoutlogoldentry, "withoutlogoldentry")

              if (withoutlogoldentry.length > 0) {
                mostRecentDate = withoutlogoldentry.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ?
                  current : prev));
              } else if (serviceold?.length > 0 && withoutlogoldentry.length === 0) {
                mostRecentDate = serviceoldRecentDate
              } else if (new Date(serviceoldRecentDate.createdAt) >= new Date(mostRecentDate.createdAt) && serviceold?.length > 0 && ReadingEntries.length > 0) {
                mostRecentDate = serviceoldRecentDate
              } else {
                mostRecentDate = mostRecentDate
              }

            }
          }



          // const checkIslogoldentry = serviceoldRecentDate.servicelog.find(d => new Date(mostRecentDate.date) >= new Date(d.startdate) && new Date(mostRecentDate.date) <= new Date(d.enddate))

          // console.log(checkIslogoldentry, "checkIslogoldentry")

          // if (checkIslogoldentry && new Date(checkIslogoldentry.date) <= new Date(mostRecentDate.createdAt)) {
          //   mostRecentDate = serviceoldRecentDate
          // }


        }



        let differecnce = Number(kvahval) - Number(mostRecentDate.kvah)
        setReadingFilterKVH(differecnce)


        if (readingFilter > 0 && differecnce > 0) {
          setPfdifference(readingFilter / differecnce)
        }

      }
    } catch (err) {

      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  }



  //get all Sub vendormasters.
  const fetchEbreadingdetailsAll = async () => {
    try {
      let res_meet = await axios.post(SERVICE.EBREADINGDETAIL, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        assignbranch: accessbranch,
      });
      setAllEbreadingdetailedit(res_meet?.data?.ebreadingdetails.filter(item => item._id !== ebreadingdetailEdit._id));
    } catch (err) {
      setEbreadingdetailcheck(true)
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  }


  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'EB Reading Details',
    pageStyle: 'print'
  });

  //id for login...
  let loginid = localStorage.LoginUserId;
  let authToken = localStorage.APIToken;




  useEffect(() => {
    fetchEbreadingdetails();
    fetchEbreadingdetailsAll();
  }, [])

  useEffect(() => {
    fetchEbreadingdetailsAll();
  }, [isEditOpen, ebreadingdetailEdit])


  useEffect(
    () => {
      const beforeUnloadHandler = (event) => handleBeforeUnload(event);
      window.addEventListener('beforeunload', beforeUnloadHandler);
      return () => {
        window.removeEventListener('beforeunload', beforeUnloadHandler);
      };
    }, []);




  return (
    <Box>
      <Headtitle title={'EB Reading Details'} />
      {/* ****** Header Content ****** */}
      {/* <Typography sx={userStyle.HeaderText}>Manage EB Reading Details</Typography> */}
      <PageHeading
        title="Manage EB Reading Details"
        modulename="EB"
        submodulename="EB Reading Details"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("aebreadingdetails")
        && (
          <>

            <Box sx={userStyle.dialogbox}>
              <>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <Typography sx={userStyle.importheadtext}>ADD EB Reading Details</Typography>
                  </Grid>
                </Grid><br />
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Company<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={isAssignBranch?.map(data => ({
                          label: data.company,
                          value: data.company,
                        })).filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                        styles={colourStyles}
                        value={{ label: ebreadingdetail.company, value: ebreadingdetail.company }}
                        onChange={(e) => {
                          setEbreadingdetail({
                            ...ebreadingdetail,
                            company: e.value,
                            branch: "Please Select Branch",
                            unit: "Please Select Unit",
                            floor: "Please Select Floor",
                            area: "Please Select Area",
                            servicenumber: "Please Select Service",
                          });
                          setReadingFilter("");
                          setReadingFilterKVH("");
                          setFloors([]);
                          setAreas([]);
                          setserviceNumber([]);
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Branch<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={isAssignBranch?.filter(
                          (comp) =>
                            ebreadingdetail.company === comp.company
                        )?.map(data => ({
                          label: data.branch,
                          value: data.branch,
                        })).filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                        styles={colourStyles}
                        value={{ label: ebreadingdetail.branch, value: ebreadingdetail.branch }}
                        onChange={(e) => {
                          setEbreadingdetail({
                            ...ebreadingdetail,
                            branch: e.value,
                            unit: "Please Select Unit",
                            floor: "Please Select Floor",
                            area: "Please Select Area",
                            servicenumber: "Please Select Service",
                          });
                          // setserviceNumber([]);
                          setFloors([])
                          setAreas([])
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Unit<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={isAssignBranch?.filter(
                          (comp) =>
                            ebreadingdetail.company === comp.company && ebreadingdetail.branch === comp.branch
                        )?.map(data => ({
                          label: data.unit,
                          value: data.unit,
                        })).filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                        styles={colourStyles}
                        value={{ label: ebreadingdetail.unit, value: ebreadingdetail.unit }}
                        onChange={(e) => {
                          setEbreadingdetail({
                            ...ebreadingdetail, unit: e.value, servicenumber: "Please Select Service",
                            floor: "Please Select Floor",
                            area: "Please Select Area",
                          });
                          fetchServiceNumber(e)
                          setFloors([])
                          setAreas([])
                        }}

                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Service Number<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={serviceNumber}
                        styles={colourStyles}
                        value={{ label: ebreadingdetail.servicenumber, value: ebreadingdetail.servicenumber }}
                        onChange={(e) => {
                          fetchFloor(e);

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
                        value={{ label: ebreadingdetail.floor, value: ebreadingdetail.floor }}
                        onChange={(e) => {
                          setEbreadingdetail({ ...ebreadingdetail, floor: e.value });

                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Area
                      </Typography>
                      <Selects
                        options={areas}
                        styles={colourStyles}
                        value={{ label: ebreadingdetail.area, value: ebreadingdetail.area }}
                        onChange={(e) => {
                          setEbreadingdetail({ ...ebreadingdetail, area: e.value });

                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Reading Mode</Typography>
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
                        value={readingmode}
                        onChange={(e) => {
                          setReadingmode(e.target.value);
                          fetchEbreadingdetailsFilterReading(e.target.value)
                          fetchEbServiceMaster(ebreadingdetail.servicenumber, ebreadingdetail.floor, ebreadingdetail.area, e.target.value)
                        }}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                      // defaultValue="Daily Closing"
                      >
                        <MenuItem value="Daily Closing" disabled>
                          {" "}
                          {"Daily Closing"}{" "}
                        </MenuItem>
                        <MenuItem value="Daily Closing"> {"Daily Closing"} </MenuItem>
                        <MenuItem value="Bill Closing"> {"Bill Closing"} </MenuItem>
                        <MenuItem value="Session Closing"> {"Session Closing"} </MenuItem>
                        <MenuItem value="Month Closing"> {"Month Closing"} </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  {readingmode === "Session Closing" &&

                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Description</Typography>
                        <TextareaAutosize
                          aria-label="minimum height"
                          minRows={5}
                          value={ebreadingdetail.description}
                          onChange={(e) => {
                            setEbreadingdetail({ ...ebreadingdetail, description: e.target.value });
                          }}
                        />
                      </FormControl>
                    </Grid>

                  }
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Date<b style={{ color: "red" }}>*</b> </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="date"
                        value={ebreadingdetail.date}
                        // value={moment(ebreadingdetail.date).format("DD-MM-YYYY")}
                        onChange={(e) => {
                          setEbreadingdetail({ ...ebreadingdetail, date: e.target.value });
                          fetchEbreadingdetailsFilterDate(e.target.value)
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Time </Typography>

                      <Space wrap>
                        <TimePicker use12Hours format="h:mm A" size="large"
                          value={ebreadingdetail.fromtime}
                          // defaultValue={dayjs('00:00', format)}
                          onChange={handleTimeChange} allowClear={false} />
                      </Space>
                    </FormControl>
                  </Grid>

                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Kwh Reading <b style={{ color: "red" }}>*</b></Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        sx={userStyle.input}
                        value={ebreadingdetail.openkwh}
                        onChange={(e) => {
                          handleChangekwhreading(e);
                          fetchEbreadingdetailsFilterKWH(e.target.value);
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>KVAH Reading <b style={{ color: "red" }}>*</b> </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        sx={userStyle.input}
                        value={ebreadingdetail.kvah}
                        onChange={(e) => {
                          // setEbreadingdetail({ ...ebreadingdetail, kvah: e.target.value });
                          handleChangekvhreading(e);
                          fetchEbreadingdetailsFilterKVH(e.target.value)
                        }}
                      />
                    </FormControl>
                  </Grid>


                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>KWH Unit </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        readOnly
                        sx={userStyle.input}
                        value={readingFilter}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>KVAH Unit</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        readOnly
                        sx={userStyle.input}
                        value={readingFilterKvh}
                      />
                    </FormControl>
                  </Grid>

                  {serviceNumber ?
                    <>

                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>P.F R Phase </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={ebreadingdetail.pfrphase}
                            onChange={(e) => {
                              setEbreadingdetail({ ...ebreadingdetail, pfrphase: e.target.value });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>P.F Y Phase </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={ebreadingdetail.pfyphase}
                            onChange={(e) => {
                              setEbreadingdetail({ ...ebreadingdetail, pfyphase: e.target.value });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>P.f B Phase </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={ebreadingdetail.pfbphase}
                            onChange={(e) => {
                              setEbreadingdetail({ ...ebreadingdetail, pfbphase: e.target.value });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>P.F Current </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={ebreadingdetail.pfcurrent}
                            onChange={(e) => {
                              setEbreadingdetail({ ...ebreadingdetail, pfcurrent: e.target.value });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>P.F Average </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={ebreadingdetail.pfaverage}
                            onChange={(e) => {
                              setEbreadingdetail({ ...ebreadingdetail, pfaverage: e.target.value });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>P.F </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            readOnly
                            value={pfdifference}
                          // onChange={(e) => {
                          //     setEbreadingdetail({ ...ebreadingdetail, pf: e.target.value });
                          // }}
                          />
                        </FormControl>
                      </Grid>
                    </> : ""
                  }




                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>M.D R Phase </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={ebreadingdetail.mdrphase}
                        onChange={(e) => {
                          setEbreadingdetail({ ...ebreadingdetail, mdrphase: e.target.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>M.D Y Phase </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={ebreadingdetail.mdyphase}
                        onChange={(e) => {
                          setEbreadingdetail({ ...ebreadingdetail, mdyphase: e.target.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>M.D B Phase </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={ebreadingdetail.mdbphase}
                        onChange={(e) => {
                          setEbreadingdetail({ ...ebreadingdetail, mdbphase: e.target.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>M.D Current </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={ebreadingdetail.mdcurrent}
                        onChange={(e) => {
                          setEbreadingdetail({ ...ebreadingdetail, mdcurrent: e.target.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>M.D Average </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={ebreadingdetail.mdaverage}
                        onChange={(e) => {
                          setEbreadingdetail({ ...ebreadingdetail, mdaverage: e.target.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>M.D </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={ebreadingdetail.md}
                        onChange={(e) => {
                          setEbreadingdetail({ ...ebreadingdetail, md: e.target.value });
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item lg={1} md={2} sm={2} xs={6} >
                    <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                      <LoadingButton
                        onClick={handleSubmit}
                        // loading={loadingdeloverall}
                        variant="contained"
                        sx={buttonStyles.buttonsubmit}
                      >
                        Submit
                      </LoadingButton>
                    </Box>
                  </Grid>
                  <Grid item lg={1} md={2} sm={2} xs={6} >
                    <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                      <Button sx={buttonStyles.btncancel} onClick={handleClear}>Clear</Button>
                    </Box>
                  </Grid>

                </Grid>

              </>
            </Box>
          </>
        )}

      <br />
      {/* ****** Table Start ****** */}


      {/* Delete Modal */}
      <Box>
        {/* ALERT DIALOG */}
        {/* <Dialog
          open={isDeleteOpen}
          onClose={handleCloseMod}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
            <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>Are you sure?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseMod} sx={userStyle.btncancel}>Cancel</Button>
            <Button autoFocus variant="contained" color='error'
              onClick={(e) => delEbreading()}
            > OK </Button>
          </DialogActions>
        </Dialog> */}


        {/* this is info view details */}

        <Dialog
          open={openInfo}
          onClose={handleCloseinfo}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <Box sx={{ width: '550px', padding: '20px 50px' }}>
            <>
              <Typography sx={userStyle.HeaderText}>EB Reading Details Info</Typography>
              <br /><br />
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">addedby</Typography>
                    <br />
                    <Table>
                      <TableHead>
                        <StyledTableCell sx={{ padding: '5px 10px !important' }}>{"SNO"}.</StyledTableCell>
                        <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"UserName"}</StyledTableCell>
                        <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"Date"}</StyledTableCell>
                      </TableHead>
                      <TableBody>
                        {addedby?.map((item, i) => (
                          <StyledTableRow>
                            <StyledTableCell sx={{ padding: '5px 10px !important' }}>{i + 1}.</StyledTableCell>
                            <StyledTableCell sx={{ padding: '5px 10px !important' }}> {item.name}</StyledTableCell>
                            <StyledTableCell sx={{ padding: '5px 10px !important' }}> {moment(item.date).format('DD-MM-YYYY hh:mm:ss a')}</StyledTableCell>
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
                        <StyledTableCell sx={{ padding: '5px 10px !important' }}>{"SNO"}.</StyledTableCell>
                        <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"UserName"}</StyledTableCell>
                        <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"Date"}</StyledTableCell>
                      </TableHead>
                      <TableBody>
                        {updateby?.map((item, i) => (
                          <StyledTableRow>
                            <StyledTableCell sx={{ padding: '5px 10px !important' }}>{i + 1}.</StyledTableCell>
                            <StyledTableCell sx={{ padding: '5px 10px !important' }}> {item.name}</StyledTableCell>
                            <StyledTableCell sx={{ padding: '5px 10px !important' }}> {moment(item.date).format('DD-MM-YYYY hh:mm:ss a')}</StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </FormControl>
                </Grid>
              </Grid>
              <br /> <br /><br />
              <Grid container spacing={2}>
                <Button variant="contained" onClick={handleCloseinfo}> Back </Button>
              </Grid>
            </>
          </Box>
        </Dialog>

      </Box>

      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
      >
        <Box sx={{ padding: '20px' }}>
          <>
            <Typography sx={userStyle.HeaderText}> View EB Reading Details</Typography>
            <br />
            <Grid container spacing={2}>

              <Grid item md={3} xs={12} sm={12} >
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Company</Typography>
                  <Typography>{ebreadingdetailEdit.company}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12} >
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Branch</Typography>
                  <Typography>{ebreadingdetailEdit.branch}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12} >
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Unit</Typography>
                  <Typography>{ebreadingdetailEdit.unit}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12} >
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Service Number</Typography>
                  <Typography>{ebreadingdetailEdit.servicenumber}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12} >
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Floor</Typography>
                  <Typography>{ebreadingdetailEdit.floor}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12} >
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Area</Typography>
                  <Typography>{ebreadingdetailEdit.area}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12} >
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Service Number</Typography>
                  <Typography>{ebreadingdetailEdit.servicenumber}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12} >
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Reading Mode</Typography>
                  <Typography>{ebreadingdetailEdit.readingmode}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12} >
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Description</Typography>
                  <Typography>{ebreadingdetailEdit.description}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12} >
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Date</Typography>
                  <Typography>{moment(ebreadingdetailEdit.date).format("DD/MM/YYYY")}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12} >
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Time</Typography>
                  <Typography>{ebreadingdetailEdit.time}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12} >
                <FormControl fullWidth size="small">
                  <Typography variant="h6">KWH Reading</Typography>
                  <Typography>{ebreadingdetailEdit.openkwh}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12} >
                <FormControl fullWidth size="small">
                  <Typography variant="h6">KVAH</Typography>
                  <Typography>{ebreadingdetailEdit.kvah}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12} >
                <FormControl fullWidth size="small">
                  <Typography variant="h6">KWH Unit</Typography>
                  <Typography>{ebreadingdetailEdit.kwhunit}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12} >
                <FormControl fullWidth size="small">
                  <Typography variant="h6">KVAH Unit</Typography>
                  <Typography>{ebreadingdetailEdit.kvahunit}</Typography>
                </FormControl>
              </Grid>

              {/* {serviceNumberEdit ?
                <> */}
              <Grid item md={3} xs={12} sm={12} >
                <FormControl fullWidth size="small">
                  <Typography variant="h6">P.F R Phase</Typography>
                  <Typography>{ebreadingdetailEdit.pfrphase}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12} >
                <FormControl fullWidth size="small">
                  <Typography variant="h6">P.F Y Phase</Typography>
                  <Typography>{ebreadingdetailEdit.pfyphase}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12} >
                <FormControl fullWidth size="small">
                  <Typography variant="h6">P.F B Phase</Typography>
                  <Typography>{ebreadingdetailEdit.pfbphase}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12} >
                <FormControl fullWidth size="small">
                  <Typography variant="h6">P.F Current</Typography>
                  <Typography>{ebreadingdetailEdit.pfcurrent}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12} >
                <FormControl fullWidth size="small">
                  <Typography variant="h6">P.F Average</Typography>
                  <Typography>{ebreadingdetailEdit.pfaverage}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12} >
                <FormControl fullWidth >
                  <Typography variant="h6" sx={{
                    textWrap: "wrap",
                    wordBreak: "break-all"
                  }}>P.F</Typography>
                  <Typography>{ebreadingdetailEdit.pf}</Typography>
                </FormControl>
              </Grid>
              {/* </> : ""
              } */}


              <Grid item md={3} xs={12} sm={12} >
                <FormControl fullWidth size="small">
                  <Typography variant="h6">M.D R Phase</Typography>
                  <Typography>{ebreadingdetailEdit.mdbphase}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12} >
                <FormControl fullWidth size="small">
                  <Typography variant="h6">M.D Y Phase</Typography>
                  <Typography>{ebreadingdetailEdit.mdyphase}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12} >
                <FormControl fullWidth size="small">
                  <Typography variant="h6">M.D B Phase</Typography>
                  <Typography>{ebreadingdetailEdit.mdbphase}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12} >
                <FormControl fullWidth size="small">
                  <Typography variant="h6">M.D Current</Typography>
                  <Typography>{ebreadingdetailEdit.mdcurrent}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12} >
                <FormControl fullWidth size="small">
                  <Typography variant="h6">M.D Average</Typography>
                  <Typography>{ebreadingdetailEdit.mdaverage}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12} >
                <FormControl fullWidth size="small">
                  <Typography variant="h6">M.D</Typography>
                  <Typography>{ebreadingdetailEdit.md}</Typography>
                </FormControl>
              </Grid>


            </Grid>
            <br /> <br />  <br />
            <Grid container spacing={2}>
              <Button variant="contained" color="primary" onClick={handleCloseview}> Back </Button>
            </Grid>
          </>
        </Box>
      </Dialog>


      {/* ALERT DIALOG */}


      <Box>
        <Dialog
          open={isDeleteOpencheckbox}
          onClose={handleCloseModcheckbox}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
            <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>Are you sure?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>Cancel</Button>
            <Button autoFocus variant="contained" color='error'
              onClick={(e) => delEbreadingcheckbox(e)}
            > OK </Button>
          </DialogActions>
        </Dialog>

      </Box>
      <Box>
        {/* ALERT DIALOG */}
        <Dialog
          open={isDeleteOpenalert}
          onClose={handleCloseModalert}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: 'orange' }} />
            <Typography variant="h6" sx={{ color: 'black', textAlign: 'center' }}>Please Select any Row</Typography>
          </DialogContent>
          <DialogActions>
            <Button autoFocus variant="contained" color='error'
              onClick={handleCloseModalert}
            > OK </Button>
          </DialogActions>
        </Dialog>
      </Box>



      {/* EXPTERNAL COMPONENTS -------------- START */}
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

      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="EB Reading Details Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delEbreading}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={delEbreadingcheckbox}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/* PLEASE SELECT ANY ROW */}
      <PleaseSelectRow
        open={isDeleteOpenalert}
        onClose={handleCloseModalert}
        message="Please Select any Row"
        iconColor="orange"
        buttonText="OK"
      />
      {/* EXPTERNAL COMPONENTS -------------- END */}




      {/* ALERT DIALOG */}
      <Box>
        <Dialog
          open={isErrorOpen}
          onClose={handleCloseerr}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
            <Typography variant="h6" >{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleCloseerr}>ok</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}


export default EBReadingDetails;