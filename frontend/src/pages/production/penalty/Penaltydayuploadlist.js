import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { MultiSelect } from "react-multi-select-component";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  OutlinedInput,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Popover,
  Select,
  TextField,
  Typography
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { useReactToPrint } from "react-to-print";
import * as XLSX from 'xlsx';
import { handleApiError } from "../../../components/Errorhandling";
import Headtitle from "../../../components/Headtitle";
import { AuthContext, UserRoleAccessContext } from "../../../context/Appcontext";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
// import Pagination from '../../components/Pagination';
import AggregatedSearchBar from '../../../components/AggregatedSearchBar';
import AggridTable from "../../../components/AggridTable";
import ExportData from "../../../components/ExportData";
import PageHeading from "../../../components/PageHeading";
import MessageAlert from "../../../components/MessageAlert";
import domtoimage from 'dom-to-image';
import AlertDialog from "../../../components/Alert";
import Selects from "react-select";

function PenaltyDayUploadList() {
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
  };
  const handleClosePopupMalert = () => {
    setOpenPopupMalert(false);
  };
  const [allAssignCompany, setAllAssignCompany] = useState([]);
  const [allAssignBranch, setAllAssignBranch] = useState([]);
  const [allAssignUnit, setAllAssignUnit] = useState([]);
  const daysoptions = [
    { label: "Yesterday", value: "Yesterday" },
    { label: "Last Week", value: "Last Week" },
    { label: "Last Month", value: "Last Month" },
    { label: "Today", value: "Today" },
    { label: "This Week", value: "This Week" },
    { label: "This Month", value: "This Month" },
    { label: "Custom Fields", value: "Custom Fields" },
  ]
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const handleClickOpenPopup = () => {
    setOpenPopup(true);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);

  const [overallItems, setOverallItems] = useState([]);
  const [isHandleChange, setIsHandleChange] = useState(false);
  const [searchedString, setSearchedString] = useState("")
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [singleFile, setSingleFile] = useState({});
  const [clientUserIDArray, setClientUserIDArray] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess, allTeam, allUsersData, pageName, setPageName, isAssignBranch, buttonStyles } = useContext(
    UserRoleAccessContext
  );

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


  const { auth } = useContext(AuthContext);
  const [loader, setLoader] = useState(true);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [openview, setOpenview] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [clientUserIDData, setClientUserIDData] = useState([]);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Penalty Day Upload List"),
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


  //MULTISELECT ONCHANGE START

  //company multiselect
  const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
  let [valueCompanyCat, setValueCompanyCat] = useState([]);

  const handleCompanyChange = (options) => {
    setValueCompanyCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCompany(options);
    setValueBranchCat([]);
    setSelectedOptionsBranch([]);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
  };

  const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
    return valueCompanyCat?.length
      ? valueCompanyCat.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
  };

  //branch multiselect
  const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
  let [valueBranchCat, setValueBranchCat] = useState([]);

  const handleBranchChange = (options) => {
    setValueBranchCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBranch(options);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
  };

  const customValueRendererBranch = (valueBranchCat, _categoryname) => {
    return valueBranchCat?.length
      ? valueBranchCat.map(({ label }) => label)?.join(", ")
      : "Please Select Branch";
  };

  //unit multiselect
  const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
  let [valueUnitCat, setValueUnitCat] = useState([]);

  const handleUnitChange = (options) => {
    setValueUnitCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsUnit(options);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
  };

  const customValueRendererUnit = (valueUnitCat, _categoryname) => {
    return valueUnitCat?.length
      ? valueUnitCat.map(({ label }) => label)?.join(", ")
      : "Please Select Unit";
  };

  //team multiselect
  const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
  let [valueTeamCat, setValueTeamCat] = useState([]);

  const handleTeamChange = (options) => {
    setValueTeamCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsTeam(options);
  };

  const customValueRendererTeam = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length
      ? valueTeamCat.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };
  const [selectedOptionsEmployee, setSelectedOptionsEmployee] = useState([]);
  let [valueEmployeeCat, setValueEmployeeCat] = useState([]);
  const handleEmployeeChange = (options) => {
    setValueEmployeeCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsEmployee(options);
  };
  const customValueRendererEmployee = (valueEmployeeCat, _categoryname) => {
    return valueEmployeeCat?.length
      ? valueEmployeeCat.map(({ label }) => label)?.join(", ")
      : "Please Select Employee";
  };

  //auto select all dropdowns
  const handleAutoSelect = async () => {
    setPageName(!pageName)
    try {
      let selectedValues = accessbranch
        ?.map((data) => ({
          company: data.company,
          branch: data.branch,
          unit: data.unit,
        }))
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.company === value.company &&
                t.branch === value.branch &&
                t.unit === value.unit
            )
        );
      let selectedCompany = selectedValues
        ?.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.company === value.company)
        )
        .map((a, index) => {
          return a.company;
        });

      let mappedCompany = selectedValues
        ?.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.company === value.company)
        )
        ?.map((data) => ({
          label: data?.company,
          value: data?.company,
        }));

      setValueCompanyCat(selectedCompany);
      setSelectedOptionsCompany(mappedCompany);

      let selectedBranch = selectedValues
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) => t.company === value.company && t.branch === value.branch
            )
        )
        .map((a, index) => {
          return a.branch;
        });

      let mappedBranch = selectedValues
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) => t.company === value.company && t.branch === value.branch
            )
        )
        ?.map((data) => ({
          label: data?.branch,
          value: data?.branch,
        }));

      setValueBranchCat(selectedBranch);
      setSelectedOptionsBranch(mappedBranch);

      let selectedUnit = selectedValues
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.company === value.company &&
                t.branch === value.branch &&
                t.unit === value.unit
            )
        )
        .map((a, index) => {
          return a.unit;
        });

      let mappedUnit = selectedValues
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.company === value.company &&
                t.branch === value.branch &&
                t.unit === value.unit
            )
        )
        ?.map((data) => ({
          label: data?.unit,
          value: data?.unit,
        }));

      setValueUnitCat(selectedUnit);
      setSelectedOptionsUnit(mappedUnit);

      let mappedTeam = allTeam
        ?.filter(
          (u) =>
            selectedCompany?.includes(u.company) &&
            selectedBranch?.includes(u.branch) &&
            selectedUnit?.includes(u.unit)
        )
        .map((u) => ({
          label: u.teamname,
          value: u.teamname,
        }));

      let selectedTeam = allTeam
        ?.filter(
          (u) =>
            selectedCompany?.includes(u.company) &&
            selectedBranch?.includes(u.branch) &&
            selectedUnit?.includes(u.unit)
        )
        .map((u) => u.teamname);

      let mappedemployees = allUsersData
        ?.filter(
          (u) =>
            selectedCompany?.includes(u.company) &&
            selectedBranch?.includes(u.branch) &&
            selectedUnit?.includes(u.unit) &&
            selectedTeam?.includes(u.team)
        )
        .map((u) => ({
          label: u.companyname,
          value: u.companyname,
        }));

      let employeess = allUsersData
        ?.filter(
          (u) =>
            selectedCompany?.includes(u.company) &&
            selectedBranch?.includes(u.branch) &&
            selectedUnit?.includes(u.unit) &&
            selectedTeam?.includes(u.team)
        )
        .map((u) => u.companyname);

      setValueTeamCat(selectedTeam);
      setSelectedOptionsTeam(mappedTeam);
      setAllAssignCompany(selectedCompany);

      setAllAssignBranch(selectedBranch);

      setAllAssignUnit(selectedUnit);
      setValueEmployeeCat(employeess);
      setSelectedOptionsEmployee(mappedemployees);

    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    handleAutoSelect();
  }, [isAssignBranch]);
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;

  const [filterUser, setFilterUser] = useState({
    fromdate: today,
    todate: today,
    day: "Today"
  });


  const handleChangeFilterDate = (e) => {
    let fromDate = '';
    let toDate = moment().format('YYYY-MM-DD');
    switch (e.value) {
      case 'Today':
        setFilterUser((prev) => ({ ...prev, fromdate: toDate, todate: toDate }))
        break;
      case 'Yesterday':
        fromDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
        toDate = fromDate; // Yesterday’s date
        setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
        break;

      case 'Last Week':
        fromDate = moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD');
        toDate = moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD');
        setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
        break;

      case 'This Week':
        fromDate = moment().startOf('week').format('YYYY-MM-DD');
        toDate = moment().endOf('week').format('YYYY-MM-DD');
        setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
        break;

      case 'Last Month':
        fromDate = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
        toDate = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
        setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
        break;

      case 'This Month':
        fromDate = moment().startOf('month').format('YYYY-MM-DD');
        toDate = moment().endOf('month').format('YYYY-MM-DD');
        setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
        break;

      case 'Custom Fields':
        setFilterUser((prev) => ({ ...prev, fromdate: "", todate: "" }))
        break;
      default:
        return;
    }
  }


  const getDownloadFile = async (document) => {
    const readExcel = (base64Data) => {
      return new Promise((resolve, reject) => {
        const bufferArray = Uint8Array.from(atob(base64Data), (c) =>
          c.charCodeAt(0)
        ).buffer;
        const wb = XLSX.read(bufferArray, { type: "buffer" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        resolve(data);
      });
    };
    const fileExtension = getFileExtension(document.name);
    if (
      fileExtension === "xlsx" ||
      fileExtension === "xls" ||
      fileExtension === "csv"
    ) {
      readExcel(document.data)
        .then((excelData) => {
          const htmlTable = generateHtmlTable(excelData);
          const newTab = window.open();
          newTab.document.write(htmlTable);
        })
        .catch((error) => { });
    }
    // Helper function to extract file extension from a filename
    function getFileExtension(filename) {
      return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
    }

    // Helper function to generate an HTML table from Excel data
    function generateHtmlTable(data) {
      const headers = Object.keys(data[0]);
      const tableHeader = `<tr>${headers
        .map(
          (header) =>
            `<th style="padding: 4px; background-color: #f2f2f2;">${header}</th>`
        )
        .join("")}</tr>`;
      const tableRows = data.map((row, index) => {
        const rowStyle = index % 2 === 0 ? "background-color: #f9f9f9;" : "";
        const cells = headers
          .map(
            (header) =>
              `<td style="padding: 4px;${rowStyle}">${row[header]}</td>`
          )
          .join("");
        return `<tr>${cells}</tr>`;
      });
      return `<table style="border-collapse: collapse; width: 100%;" border="1"; overflow :"scroll">${tableHeader}${tableRows.join(
        ""
      )}</table>`;
    }
  };
  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    company: true,
    branch: true,
    unit: true,
    team: true,
    processcode: true,
    name: true,
    empcode: true,
    date: true,
    vendorname: true,
    process: true,
    totalfield: true,
    autoerror: true,
    manualerror: true,
    uploaderror: true,
    moved: true,
    notupload: true,
    penalty: true,
    nonpenalty: true,
    bulkupload: true,
    bulkkeying: true,
    edited1: true,
    edited2: true,
    edited3: true,
    edited4: true,
    reject1: true,
    reject1: true,
    reject2: true,
    reject3: true,
    reject4: true,
    notvalidate: true,
    validateerror: true,
    waivererror: true,
    neterror: true,
    per: true,
    percentage: true,
    amount: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );
  useEffect(() => {
    addSerialNumber(clientUserIDArray);
  }, [clientUserIDArray]);
  useEffect(() => {
    getexcelDatas();
  }, [clientUserIDArray]);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);
  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  // view model
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };
  // page refersh reload password
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };
  const username = isUserRoleAccess.username;
  // Manage Columns
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
  //get all client user id.
  const fetchProductionLists = async () => {
    setPageName(!pageName)
    setLoader(false);
    try {
      let res_freq = await axios.post(SERVICE.GET_PENALTYDAYUPLOAD_FILTER, {
        assignbranch: accessbranch,
        fromdate: filterUser?.fromdate,
        todate: filterUser?.todate,
        company: valueCompanyCat,
        branch: valueBranchCat,
        unit: valueUnitCat,
        team: valueTeamCat,
        employeenames: valueEmployeeCat,
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      // console.log(res_freq?.data, 'res_freq?.data');
      let answer = res_freq?.data?.penaltydayuploadTesting?.map((data) => {
        return data.uploaddata.map((upload) => ({
          ...upload,
          mainid: data._id,
        }));
      })
        .flat()?.map((item) => ({ ...item, date: moment(item.date).format("DD-MM-YYYY"), }));
      setClientUserIDArray(answer);
      setLoader(true);
      // setProductionPoints(answer);
    } catch (err) {
      console.log(err, 'err')
      setLoader(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }

  };
  const [penaltyDayUploadArray, setPenaltyDayUploadArray] = useState([])
  //get all client user id.
  const fetchPenaltydayUploadListsArray = async () => {

    setPageName(!pageName)
    try {
      let res_freq = await axios.post(SERVICE.GET_PENALTYDAYUPLOAD, {
        assignbranch: accessbranch
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let answer = res_freq?.data?.penaltydayupload
        .map((data) => {
          return data.uploaddata.map((upload) => ({
            ...upload,
            mainid: data._id,
          }));
        })
        .flat();
      setPenaltyDayUploadArray(answer?.map((item) => ({
        ...item,
        date: moment(item.date).format("DD-MM-YYYY")
      })));
      // setProductionPoints(answer);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  useEffect(() => {
    fetchPenaltydayUploadListsArray();
  }, [isFilterOpen])
  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };
  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };
  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Penalty Day Upload List.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };
  let exportColumnNames = [
    'Company', 'Branch', 'Unit',
    'Team', 'Process Code', 'Name',
    'Emp Code', 'Date', 'Vendor Name',
    'Process', 'Total Field', 'Auto Error',
    'Manual Error', 'Upload Error', 'Moved',
    'Not Upload', 'Penalty', 'Non Penalty',
    'Bulk Upload', 'Bulk Keying', 'Edited1',
    'Edited2', 'Edited3', 'Edited4',
    'Reject1', 'Reject2', 'Reject3',
    'Reject4', 'Not Validate', 'Validate Error',
    'Waiver% Error', 'Net Error', 'Per%',
    'Percentage', 'Amount'
  ];
  let exportRowValues = [
    'company', 'branch', 'unit',
    'team', 'processcode', 'name',
    'empcode', 'date', 'vendorname',
    'process', 'totalfield', 'autoerror',
    'manualerror', 'uploaderror', 'moved',
    'notupload', 'penalty', 'nonpenalty',
    'bulkupload', 'bulkkeying', 'edited1',
    'edited2', 'edited3', 'edited4',
    'reject1', 'reject2', 'reject3',
    'reject4', 'notvalidate', 'validateerror',
    'waivererror', 'neterror', 'per',
    'percentage', 'amount'
  ];
  // Excel
  const fileName = "Penaltydayuploadlist";
  // get particular columns for export excel
  const getexcelDatas = () => {
    var data = clientUserIDArray.map((item, index) => ({
      Sno: index + 1,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      processcode: item.processcode,
      empcode: item.empcode,
      date: item.date,
      vendorname: item.vendorname,
      process: item.process,
      totalfield: item.totalfield,
      autoerror: item.autoerror,
      manualerror: item.manualerror,
      uploaderror: item.uploaderror,
      moved: item.moved,
      notupload: item.notupload,
      penalty: item.penalty,
      nonpenalty: item.nonpenalty,
      bulkupload: item.bulkupload,
      bulkkeying: item.bulkkeying,
      edited1: item.edited1,
      edited2: item.edited2,
      edited3: item.edited3,
      edited4: item.edited4,
      reject1: item.reject1,
      reject2: item.reject2,
      reject3: item.reject3,
      reject4: item.reject4,
      notvalidate: item.notvalidate,
      validateerror: item.validateerror,
      waivererror: item.waivererror,
      neterror: item.neterror,
      per: item.per,
      percentage: item.percentage,
      amount: item.amount,
    }));
    setClientUserIDData(data);
  };
  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Penalty Day Upload List",
    pageStyle: "print",
  });
  //serial no for listing items
  const addSerialNumber = (datas) => {
    const itemsWithSerialNumber = datas?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,

    }));
    setItems(itemsWithSerialNumber);
    setOverallItems(itemsWithSerialNumber);
  };
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
    setPage(1);
  };

  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
  }, [columnVisibility]);
  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem("columnVisibility");
    if (savedVisibility) {
      setColumnVisibility(JSON.parse(savedVisibility));
    }
  }, []);
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
  const columnDataTable = [

    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 90,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
      pinned: 'left',
      lockPinned: true,
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 150,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
      pinned: 'left',
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 120,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
      pinned: 'left',
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 120,
      hide: !columnVisibility.unit,
      headerClassName: "bold-header",
    },
    {
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 120,
      hide: !columnVisibility.team,
      headerClassName: "bold-header",
    },
    {
      field: "processcode",
      headerName: "Process Code",
      flex: 0,
      width: 150,
      hide: !columnVisibility.processcode,
      headerClassName: "bold-header",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0,
      width: 180,
      hide: !columnVisibility.name,
      headerClassName: "bold-header",
    },
    {
      field: "empcode",
      headerName: "Emp Code",
      flex: 0,
      width: 120,
      hide: !columnVisibility.empcode,
      headerClassName: "bold-header",
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0,
      width: 200,
      hide: !columnVisibility.date,
      headerClassName: "bold-header",
    },
    {
      field: "vendorname",
      headerName: "Vendor Name",
      flex: 0,
      width: 250,
      hide: !columnVisibility.vendorname,
      headerClassName: "bold-header",
    },
    {
      field: "process",
      headerName: "Process",
      flex: 0,
      width: 200,
      hide: !columnVisibility.process,
      headerClassName: "bold-header",
    },
    {
      field: "totalfield",
      headerName: "Total Field",
      flex: 0,
      width: 100,
      hide: !columnVisibility.totalfield,
      headerClassName: "bold-header",
    },
    {
      field: "autoerror",
      headerName: "Auto Error",
      flex: 0,
      width: 100,
      hide: !columnVisibility.autoerror,
      headerClassName: "bold-header",
    },
    {
      field: "manualerror",
      headerName: "Manual Error",
      flex: 0,
      width: 100,
      hide: !columnVisibility.manualerror,
      headerClassName: "bold-header",
    },
    {
      field: "uploaderror",
      headerName: "Upload Error",
      flex: 0,
      width: 100,
      hide: !columnVisibility.uploaderror,
      headerClassName: "bold-header",
    },
    {
      field: "moved",
      headerName: "Moved",
      flex: 0,
      width: 100,
      hide: !columnVisibility.moved,
      headerClassName: "bold-header",
    },
    {
      field: "notupload",
      headerName: "Not Upload",
      flex: 0,
      width: 100,
      hide: !columnVisibility.notupload,
      headerClassName: "bold-header",
    },
    {
      field: "penalty",
      headerName: "Penalty",
      flex: 0,
      width: 100,
      hide: !columnVisibility.penalty,
      headerClassName: "bold-header",
    },
    {
      field: "nonpenalty",
      headerName: "Non Penalty",
      flex: 0,
      width: 100,
      hide: !columnVisibility.nonpenalty,
      headerClassName: "bold-header",
    },
    {
      field: "bulkupload",
      headerName: "Bulk Upload",
      flex: 0,
      width: 100,
      hide: !columnVisibility.bulkupload,
      headerClassName: "bold-header",
    },
    {
      field: "bulkkeying",
      headerName: "Bulk Keying",
      flex: 0,
      width: 100,
      hide: !columnVisibility.bulkkeying,
      headerClassName: "bold-header",
    },
    {
      field: "edited1",
      headerName: "Edited1",
      flex: 0,
      width: 100,
      hide: !columnVisibility.edited1,
      headerClassName: "bold-header",
    },
    {
      field: "edited2",
      headerName: "Edited2",
      flex: 0,
      width: 100,
      hide: !columnVisibility.edited2,
      headerClassName: "bold-header",
    },
    {
      field: "edited3",
      headerName: "Edited3",
      flex: 0,
      width: 100,
      hide: !columnVisibility.edited3,
      headerClassName: "bold-header",
    },
    {
      field: "edited4",
      headerName: "Edited4",
      flex: 0,
      width: 100,
      hide: !columnVisibility.edited4,
      headerClassName: "bold-header",
    },
    {
      field: "reject1",
      headerName: "Reject1",
      flex: 0,
      width: 100,
      hide: !columnVisibility.reject1,
      headerClassName: "bold-header",
    },
    {
      field: "reject2",
      headerName: "Reject2",
      flex: 0,
      width: 100,
      hide: !columnVisibility.reject2,
      headerClassName: "bold-header",
    },
    {
      field: "reject3",
      headerName: "Reject3",
      flex: 0,
      width: 100,
      hide: !columnVisibility.reject3,
      headerClassName: "bold-header",
    },
    {
      field: "reject4",
      headerName: "Reject4",
      flex: 0,
      width: 100,
      hide: !columnVisibility.reject4,
      headerClassName: "bold-header",
    },
    {
      field: "notvalidate",
      headerName: "Not Validate",
      flex: 0,
      width: 100,
      hide: !columnVisibility.notvalidate,
      headerClassName: "bold-header",
    },
    {
      field: "validateerror",
      headerName: "Validate Error",
      flex: 0,
      width: 100,
      hide: !columnVisibility.validateerror,
      headerClassName: "bold-header",
    },
    {
      field: "waivererror",
      headerName: "Waiver% Error",
      flex: 0,
      width: 100,
      hide: !columnVisibility.waivererror,
      headerClassName: "bold-header",
    },
    {
      field: "neterror",
      headerName: "Net Error",
      flex: 0,
      width: 100,
      hide: !columnVisibility.neterror,
      headerClassName: "bold-header",
    },
    {
      field: "per",
      headerName: "Per%",
      flex: 0,
      width: 100,
      hide: !columnVisibility.per,
      headerClassName: "bold-header",
    },
    {
      field: "percentage",
      headerName: "Percentage",
      flex: 0,
      width: 100,
      hide: !columnVisibility.percentage,
      headerClassName: "bold-header",
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 0,
      width: 100,
      hide: !columnVisibility.amount,
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
      team: item.team,
      processcode: item.processcode,
      name: item.name,
      empcode: item.empcode,
      // date: item.date,
      date: item.date,
      vendorname: item.vendorname,
      process: item.process,
      totalfield: item.totalfield,
      autoerror: item.autoerror,
      manualerror: item.manualerror,
      uploaderror: item.uploaderror,
      moved: item.moved,
      notupload: item.notupload,
      penalty: item.penalty,
      nonpenalty: item.nonpenalty,
      bulkupload: item.bulkupload,
      bulkkeying: item.bulkkeying,
      edited1: item.edited1,
      edited2: item.edited2,
      edited3: item.edited3,
      edited4: item.edited4,
      reject1: item.reject1,
      reject2: item.reject2,
      reject3: item.reject3,
      reject4: item.reject4,
      notvalidate: item.notvalidate,
      validateerror: item.validateerror,
      waivererror: item.waivererror,
      neterror: item.neterror,
      per: item.per,
      percentage: item.percentage,
      amount: item.amount,
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
  // Function to filter columns based on search query
  const filteredColumns = columnDataTable.filter((column) =>
    column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
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
  const [fileFormat, setFormat] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault();
    if (filterUser.fromdate === "") {
      setPopupContentMalert("Please Select From Date");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (filterUser.todate === "") {
      setPopupContentMalert("Please Select To Date");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      fetchProductionLists();
    }
  };
  const handleClear = () => {

    setValueCompanyCat([]);
    setSelectedOptionsCompany([]);
    setValueBranchCat([]);
    setSelectedOptionsBranch([]);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setSelectedOptionsEmployee([]);
    setValueEmployeeCat([])
    setFilterUser({
      fromdate: today,
      todate: today,
      day: "Today"
    });
    setClientUserIDArray([]);
    setPopupContent('Cleared Successfully');
    setPopupSeverity("success");
    handleClickOpenPopup();
  };
  return (
    <Box>
      <Headtitle title={"PENALTY DAY UPLOAD LIST"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Penalty Day List"
        modulename="Quality"
        submodulename="Penalty"
        mainpagename="Penalty Calculation"
        subpagename="Penalty Day List"
        subsubpagename=""
      />
      <br /> <br />
      {isUserRoleCompare?.includes("lpenaltydaylist") && (
        <>
          <Box sx={userStyle.dialogbox}>
            <Grid container spacing={2}>
              <>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    Company
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <MultiSelect
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
                      value={selectedOptionsCompany}
                      onChange={(e) => {
                        handleCompanyChange(e);
                      }}
                      valueRenderer={customValueRendererCompany}
                      labelledBy="Please Select Company"
                    />
                  </FormControl>
                </Grid>
                {/* Branch Unit Team */}
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      {" "}
                      Branch
                    </Typography>
                    <MultiSelect
                      options={accessbranch
                        ?.filter((comp) =>
                          valueCompanyCat?.includes(comp.company)
                        )
                        ?.map((data) => ({
                          label: data.branch,
                          value: data.branch,
                        }))
                        .filter((item, index, self) => {
                          return (
                            self.findIndex(
                              (i) =>
                                i.label === item.label &&
                                i.value === item.value
                            ) === index
                          );
                        })}
                      value={selectedOptionsBranch}
                      onChange={(e) => {
                        handleBranchChange(e);
                      }}
                      valueRenderer={customValueRendererBranch}
                      labelledBy="Please Select Branch"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      {" "}
                      Unit
                    </Typography>
                    <MultiSelect
                      options={accessbranch
                        ?.filter(
                          (comp) =>
                            valueCompanyCat?.includes(comp.company) &&
                            valueBranchCat?.includes(comp.branch)
                        )
                        ?.map((data) => ({
                          label: data.unit,
                          value: data.unit,
                        }))
                        .filter((item, index, self) => {
                          return (
                            self.findIndex(
                              (i) =>
                                i.label === item.label &&
                                i.value === item.value
                            ) === index
                          );
                        })}
                      value={selectedOptionsUnit}
                      onChange={(e) => {
                        handleUnitChange(e);
                      }}
                      valueRenderer={customValueRendererUnit}
                      labelledBy="Please Select Unit"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Team
                    </Typography>
                    <MultiSelect
                      options={allTeam
                        ?.filter(
                          (u) =>
                            valueCompanyCat?.includes(u.company) &&
                            valueBranchCat?.includes(u.branch) &&
                            valueUnitCat?.includes(u.unit)
                        )
                        .map((u) => ({
                          ...u,
                          label: u.teamname,
                          value: u.teamname,
                        }))}
                      value={selectedOptionsTeam}
                      onChange={(e) => {
                        handleTeamChange(e);
                      }}
                      valueRenderer={customValueRendererTeam}
                      labelledBy="Please Select Team"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Employee
                    </Typography>
                    <MultiSelect
                      options={allUsersData
                        ?.filter(
                          (u) =>
                            valueCompanyCat?.includes(u.company) &&
                            valueBranchCat?.includes(u.branch) &&
                            valueUnitCat?.includes(u.unit) &&
                            valueTeamCat?.includes(u.team)
                        )
                        .map((u) => ({
                          label: u.companyname,
                          value: u.companyname,
                        }))

                      }
                      value={selectedOptionsEmployee}
                      onChange={(e) => {
                        handleEmployeeChange(e);
                      }}
                      valueRenderer={customValueRendererEmployee}
                      labelledBy="Please Select Employee"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography sx={{ fontWeight: "500" }}>
                      Days<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={daysoptions}
                      // styles={colourStyles}
                      value={{ label: filterUser.day, value: filterUser.day }}
                      onChange={(e) => {
                        handleChangeFilterDate(e);
                        setFilterUser((prev) => ({ ...prev, day: e.value }))
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      {" "}
                      From Date
                    </Typography>
                    <OutlinedInput
                      id="from-date"
                      type="date"
                      disabled={filterUser.day !== "Custom Fields"}
                      value={filterUser.fromdate}
                      onChange={(e) => {
                        const newFromDate = e.target.value;
                        setFilterUser((prevState) => ({
                          ...prevState,
                          fromdate: newFromDate,
                          todate: prevState.todate && new Date(prevState.todate) > new Date(newFromDate) ? prevState.todate : ""
                        }));
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      To Date
                    </Typography>
                    <OutlinedInput
                      id="to-date"
                      type="date"
                      value={filterUser.todate}
                      disabled={filterUser.day !== "Custom Fields"}
                      onChange={(e) => {
                        const selectedToDate = new Date(e.target.value);
                        const selectedFromDate = new Date(filterUser.fromdate);
                        const formattedDatePresent = new Date() // Assuming you have a function to format the current date
                        if (selectedToDate >= selectedFromDate && selectedToDate >= new Date(selectedFromDate)) {
                          setFilterUser({
                            ...filterUser,
                            todate: e.target.value
                          });
                        } else {
                          setFilterUser({
                            ...filterUser,
                            todate: "" // Reset to empty string if the condition fails
                          });
                        }
                      }}
                    />
                  </FormControl>
                </Grid>

              </>
            </Grid>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={3} sm={12} xs={12}>
                <Grid sx={{ display: "flex", gap: "15px" }}>
                  <Button
                    variant="contained"
                    sx={buttonStyles.buttonsubmit}
                    onClick={(e) => {
                      handleSubmit(e);
                    }}
                  >
                    {" "}
                    Filter
                  </Button>
                  <Button
                    sx={buttonStyles.btncancel}
                    onClick={() => {
                      handleClear();
                    }}
                  >
                    {" "}
                    CLEAR
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
      <br />
      <br />
      <br />
      {/* ****** Table Start ****** */}
      {
        !clientUserIDArray ? (
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
            {isUserRoleCompare?.includes("lpenaltydaylist") && (
              <>
                <Box sx={userStyle.container}>
                  {/* ******************************************************EXPORT Buttons****************************************************** */}
                  <Grid item xs={8}>
                    <Typography sx={userStyle.importheadtext}>
                      Penalty Day Upload List
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
                          <MenuItem value={clientUserIDArray?.length}>
                            All
                          </MenuItem>
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
                        {isUserRoleCompare?.includes(
                          "excelpenaltydaylist"
                        ) && (
                            <>
                              <Button onClick={(e) => {
                                setIsFilterOpen(true)
                                fetchPenaltydayUploadListsArray()
                                setFormat("xl")
                              }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                            </>
                          )}
                        {isUserRoleCompare?.includes(
                          "csvpenaltydaylist"
                        ) && (
                            <>
                              <Button onClick={(e) => {
                                setIsFilterOpen(true)
                                fetchPenaltydayUploadListsArray()
                                setFormat("csv")
                              }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                            </>
                          )}
                        {isUserRoleCompare?.includes(
                          "printpenaltydaylist"
                        ) && (
                            <>
                              <Button
                                sx={userStyle.buttongrp}
                                onClick={handleprint}
                              >
                                &ensp;
                                <FaPrint />
                                &ensp;Print&ensp;
                              </Button>
                            </>
                          )}
                        {isUserRoleCompare?.includes("pdfpenaltydaylist") && (
                          <>
                            <Button
                              sx={userStyle.buttongrp}
                              onClick={() => {
                                setIsPdfFilterOpen(true)
                                fetchPenaltydayUploadListsArray()
                              }}
                            ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                          </>
                        )}
                        {isUserRoleCompare?.includes(
                          "imagepenaltydaylist"
                        ) && (
                            <Button
                              sx={userStyle.buttongrp}
                              onClick={handleCaptureImage}
                            >
                              {" "}
                              <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                              &ensp;Image&ensp;{" "}
                            </Button>
                          )}
                      </Box>
                    </Grid>
                    <Grid item md={2} xs={12} sm={12}>
                      <AggregatedSearchBar columnDataTable={columnDataTable} setItems={setItems} addSerialNumber={addSerialNumber} setPage={setPage} maindatas={clientUserIDArray} setSearchedString={setSearchedString}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        paginated={false}
                        totalDatas={overallItems}
                      />
                    </Grid>
                  </Grid>

                  <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                    Show All Columns
                  </Button>
                  &ensp;
                  <Button
                    sx={userStyle.buttongrp}
                    onClick={handleOpenManageColumns}
                  >
                    Manage Columns
                  </Button>
                  <br />
                  <br />
                  {!loader ? (
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
                  ) : (<>
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
                      gridRefTable={gridRef}
                      paginated={false}
                      filteredDatas={filteredDatas}
                      handleShowAllColumns={handleShowAllColumns}
                      setFilteredRowData={setFilteredRowData}
                      filteredRowData={filteredRowData}
                      setFilteredChanges={setFilteredChanges}
                      filteredChanges={filteredChanges}
                      gridRefTableImg={gridRefTableImg}
                      itemsList={overallItems}
                    />
                  </>)}


                  {/* ****** Table End ****** */}
                </Box>
              </>
            )}
            {/* ****** Table End ****** */}
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
          </>
        )
      }
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
      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Production Points
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Date</Typography>
                  <Typography>
                    {moment(singleFile?.date).format("DD-MM-YYYY")}{" "}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={12} sm={6} xs={12}>
                <Typography variant="h6">File Name</Typography>
                {singleFile?.document?.map((file, fileIndex) => (
                  <Grid container key={fileIndex}>
                    <Grid item md={8} sm={10} xs={10}>
                      <Typography>{file.name}</Typography>
                    </Grid>
                    <Grid item md={2} sm={10} xs={10}>
                      <a
                        style={{
                          minWidth: "0px",
                          textDecoration: "none",
                          color: "#357AE8",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = `data:application/octet-stream;base64,${file.data}`;
                          link.download = file.name;
                          link.click();
                        }}
                      >
                        Download
                      </a>
                    </Grid>
                    <Grid item md={1} sm={2} xs={2}></Grid>
                    <Grid item md={1} sm={2} xs={2}>
                      <VisibilityOutlinedIcon
                        style={{
                          fontsize: "large",
                          color: "#357AE8",
                          cursor: "pointer",
                        }}
                        onClick={() => getDownloadFile(file)}
                      />
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCloseview}
              >
                Back
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>
      <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
        itemsTwo={clientUserIDArray ?? []}
        filename={"Penalty Day Upload List"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      <MessageAlert
        openPopup={openPopupMalert}
        handleClosePopup={handleClosePopupMalert}
        popupContent={popupContentMalert}
        popupSeverity={popupSeverityMalert}
      />
      <AlertDialog
        openPopup={openPopup}
        handleClosePopup={handleClosePopup}
        popupContent={popupContent}
        popupSeverity={popupSeverity}
      />
      <br />
    </Box >
  );
}

export default PenaltyDayUploadList;