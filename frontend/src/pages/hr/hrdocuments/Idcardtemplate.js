import React, { useState, useEffect, useRef, useContext } from "react";
import { MultiSelect } from "react-multi-select-component";
import { Backdrop } from "@mui/material";
import moment from "moment";
import placeholderImage from "../../../images/empty.png";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import StyledDataGrid from "../../../components/TableStyle";
import { handleApiError } from "../../../components/Errorhandling";
import {
  Box,
  Typography,
  OutlinedInput,
  TableBody,
  TableRow,
  TableCell,
  Select,
  Paper,
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Table,
  TableHead,
  TableContainer,
  Button,
  List,
  ListItem,
  ListItemText,
  Popover,
  Checkbox,
  TextField,
  IconButton,
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { Link } from "react-router-dom";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import LoadingButton from "@mui/lab/LoadingButton";
import axios from "axios";
import Selects from "react-select";
import html2pdf from "html2pdf.js";
import { htmlToText } from "html-to-text";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ReactDOM from "react-dom";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import { blue } from "@mui/material/colors";
import CircularProgress from "@mui/material/CircularProgress";
import PageHeading from "../../../components/PageHeading";
import AlertDialog from "../../../components/Alert";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../../components/DeleteConfirmation.js";
import ExportData from "../../../components/ExportData";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert";
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
import domtoimage from 'dom-to-image';

const ScrollingText = ({ text }) => {

  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const containerWidth = containerRef.current.offsetWidth;
    const textElement = textRef.current;

    if (!textElement) return;

    const textWidth = textElement.offsetWidth;
    let position = 0;

    const scrollText = () => {
      position -= 1;
      if (position < -textWidth) {
        position = containerWidth;
      }
      textElement.style.transform = `translateX(${position}px)`;
      requestAnimationFrame(scrollText);
    };

    scrollText();

    return () => cancelAnimationFrame(scrollText);
  }, []);

  return (
    <Grid
      item
      xs={8}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography
        sx={{
          ...userStyle.importheadtext,
          fontSize: "1.4rem",
          marginRight: "1rem",
        }}
      >
        {"List ID card Preparation"}
      </Typography>
      <div
        ref={containerRef}
        style={{ overflow: "hidden", width: "40%", whiteSpace: "nowrap" }}
      >
        <span ref={textRef} style={{ color: "red", display: "inline-block", fontSize: "1.4rem" }}>
          {text}
        </span>
      </div>
    </Grid>
  );
};

function Createidcard() {
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTable = useRef(null);
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
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const handleClickOpenPopup = () => {
    setOpenPopup(true);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  let exportColumnNames = ['company', 'Branch', 'Unit', 'Team', 'Person'];
  let exportRowValues = ['company', 'branch', 'unit', 'team', 'person'];
  const getapi = async () => {
    setPageName(!pageName);
    try {
      let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        empcode: String(isUserRoleAccess?.empcode),
        companyname: String(isUserRoleAccess?.companyname),
        pagename: String("Human Resource/HR Documents/IDcardtemplate"),
        commonid: String(isUserRoleAccess?._id),
        date: String(new Date()),

        addedby: [
          {
            name: String(isUserRoleAccess?.companyname),
            date: String(new Date()),
          },
        ],
      });
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  }
  useEffect(() => {
    getapi();
  }, []);





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


  const [isLoading, setisLoading] = useState(false);
  const LoadingBackdrop = ({ open }) => {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <div className="pulsating-circle">
          <CircularProgress color="inherit" className="loading-spinner" />
        </div>
        <Typography
          variant="h6"
          sx={{ marginLeft: 2, color: "#fff", fontWeight: "bold" }}
        >
          Fetching Data, please wait...
        </Typography>
      </Backdrop>
    );
  };

  let today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + "-" + mm + "-" + dd;
  //useStates
  const gridRef = useRef(null);
  let newval = "DP0001";

  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [documentPreparationEdit, setDocumentPreparationEdit] = useState({
    name: "",
  });
  const [templateCreationArray, setTemplateCreationArray] = useState([]);
  const [templateCreationArrayDupCheck, setTemplateCreationArrayDupCheck] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, pageName,
    setPageName,
    buttonStyles, } = useContext(
      UserRoleAccessContext
    );
  // AssignBranch For Users
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
  const [loader, setLoader] = useState(false);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [openview, setOpenview] = useState(false);
  const [openviewed, setOpenviewed] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [documentPrepartion, setDocumentPrepartion] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    team: "Please Select Team",
    person: "Please Select Person",
  });
  const [code, setcode] = useState([]);
  const [viewst, setviewst] = useState("");

  const [items, setItems] = useState([]);
  const [departmentCheck, setDepartmentCheck] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    company: true,
    branch: true,
    unit: true,
    team: true,
    person: true,
    Idcard: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );
  const [selectedOptionsEdit, setSelectedOptionsEdit] = useState([]);

  //useEffect
  useEffect(() => {
    addSerialNumber(templateCreationArray);
  }, [templateCreationArray]);

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
    setviewdata(false);
    //  setisLoading(false)
    setIsErrorOpen(true);
  };
  // view model
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleClickOpenviewed = () => {
    setOpenviewed(true);
  };
  const handleCloseviewed = () => {
    setOpenviewed(false);

    setDocumentPreparationEdit({});
    // setcode([]);

    setviewfrontfooter("");

    setviewfrontheader("");

    setviewbackheader("");

    setviewbackfooter("");

    setnewadd("");
    setnewcomp("");
    setnewcomurl("");
  };
  const handleCloseview = () => {
    setOpenview(false);
    setDocumentPreparationEdit({});
    // setcode([]);

    setviewfrontfooter("");

    setviewfrontheader("");

    setviewbackheader("");

    setviewbackfooter("");

    setnewadd("");
    setnewcomp("");
    setnewcomurl("");
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };
  // info model
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };
  //Delete model
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };
  // page refersh reload code
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
  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

  const handleClickOpencheckbox = () => {
    setIsDeleteOpencheckbox(true);
  };
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  };
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  const handleClickOpenalert = () => {
    setIsHandleChange(true)
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      setIsDeleteOpencheckbox(true);
    }
  };
  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  const [CompanyOptions, setCompanyOptions] = useState([]);
  const [BranchOptions, setBranchOptions] = useState([]);
  const [allBranch, setAllBranch] = useState("");
  const [allBranchValue, setAllBranchValue] = useState(false);
  const [UnitOptions, setUnitOptions] = useState([]);
  const [TeamOptions, setTeamOptions] = useState([]);
  const [employeenames, setEmployeenames] = useState([]);
  const [employeEdit, setEmployeeEdit] = useState([]);
  const [participantsOption, setParticipantsOption] = useState([]);

  //function to fetch participants
  const fetchParticipants = async () => {
    setPageName(!pageName);
    try {
      let res_participants = await axios.get(SERVICE.USERALLLIMIT, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });

      setParticipantsOption([
        ...res_participants?.data?.users?.map((t) => ({
          ...t,
          label: t.companyname,
          value: t.companyname,
        })),
      ]);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const CompanyDropDowns = async () => {
    setPageName(!pageName);
    try {

      setCompanyOptions(accessbranch?.map(data => ({
        label: data.company,
        value: data.company,
      })).filter((item, index, self) => {
        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
      }));
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const BranchDropDowns = async (e) => {
    setPageName(!pageName);
    try {
      setBranchOptions(accessbranch?.filter(
        (comp) =>
          e.value === comp.company
      )?.map(data => ({
        label: data.branch,
        value: data.branch,
      })).filter((item, index, self) => {
        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
      }));
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const UnitDropDowns = (e) => {
    setPageName(!pageName);
    try {

      let resdata = accessbranch?.filter(
        (comp) =>
          e === comp.branch
      )?.map(data => ({
        label: data.unit,
        value: data.unit,
      })).filter((item, index, self) => {
        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
      })
      const unitall = [
        { label: "ALL", value: "ALL" },
        ...resdata];

      setUnitOptions(unitall);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const fetchTeam = async (e) => {
    setPageName(!pageName);
    try {
      let res_type = await axios.get(SERVICE.TEAMS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let result =
        e === "ALL"
          ? res_type.data.teamsdetails?.filter((d) => d.branch === allBranch)
          : res_type.data.teamsdetails?.filter(
            (d) => d.unit === e && d.branch === allBranch
          );

      const teamall = [
        { label: "ALL", value: "ALL" },
        ...result.map((d) => ({
          ...d,
          label: d.teamname,
          value: d.teamname,
        })),
      ];

      setTeamOptions(teamall);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //get all Employeename.
  const fetchAllEmployee = async (e) => {
    setPageName(!pageName);
    try {
      const [res_module, resImages] = await Promise.all([
        axios.post(SERVICE.USEREMP_TEAMGROUP, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          company: documentPrepartion.company,
          branch: documentPrepartion.branch,
          unit: documentPrepartion.unit,
          team: e.value,
        }),
        axios.get(SERVICE.GETPROFILES, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          }
        }),
      ])
      // Extract employee data and profile images
      const employees = res_module.data.userteamgroup || [];
      const empDocs = resImages?.data?.alldocuments || [];
      // Create a Map for profile images for quick lookups
      const profileImageMap = new Map(
        empDocs.map(item => [item?.commonid, item?.profileimage || ""])
      );
      // Merge employee data with profile images
      const showData = employees.map(data => ({
        ...data,
        profileimage: profileImageMap.get(data?._id) || "",
      }));
      setEmployeenames(
        showData.map((data) => ({
          ...data,
          label: data.companyname,
          value: data.companyname,
        }))
      );
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const customValueRendererEditCompanyFrom = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Employee";
  };
  const [checking, setChecking] = useState("");
  const createHeaderElement = (headContent) => {
    const headerElement = document.createElement("div");
    headerElement.innerHTML = `
    <div>
        ${headContent}
      </div>
    `;
    return headerElement;
  };

  // Helper function to create footer element
  const createFooterElement = (footContent) => {
    const footerElement = document.createElement("div");
    footerElement.innerHTML = `
        <div >
            ${footContent}
        </div>
    `;
    return footerElement;
  };

  const [tempfrontheader, settempfrontheader] = useState("");
  const [tempfrontfooter, settempfrontfooter] = useState("");
  const [tempbackheader, settempbackheader] = useState("");
  const [tempbackfooter, settempbackfooter] = useState("");
  const [templatefrontheader, settemplatefrontheader] = useState("");
  const [templatefrontfooter, settemplatefrontfooter] = useState("");
  const [templatebackheader, settemplatebackheader] = useState("");
  const [templatebackfooter, settemplatebackfooter] = useState("");
  const [add, setadd] = useState("");
  const [comp, setcomp] = useState("");
  const [comurl, setcomurl] = useState("");

  const [tempdata, settempdata] = useState([]);

  const templateinfo = async (branch) => {
    setPageName(!pageName);
    try {
      let res = await axios.post(`${SERVICE.FILTERTEMPLATECONTROLPANEL}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: documentPrepartion.company,
        branch: branch
      });

      let crudcompany = res.data?.templatecontrolpanel?.templatecontrolpanellog[res.data?.templatecontrolpanel?.templatecontrolpanellog?.length - 1];
      settempdata(res.data?.templatecontrolpanel);
      await templateinformation(documentPrepartion.company, branch, res.data?.templatecontrolpanel?.templatecontrolpanellog);
      setadd(crudcompany?.address);
      setcomp(crudcompany?.companyname);
      setcomurl(crudcompany?.companyurl);

      settempfrontfooter(crudcompany?.idcardfrontfooter[0].preview);
      settemplatefrontfooter(crudcompany?.idcardfrontfooter);

      settempfrontheader(crudcompany?.idcardfrontheader[0].preview);
      settemplatefrontheader(crudcompany?.idcardfrontheader);

      settempbackheader(crudcompany?.idcardbackheader[0].preview);
      settemplatebackheader(crudcompany?.idcardbackheader);
      settempbackfooter(crudcompany?.idcardbackfooter[0].preview);
      settemplatebackfooter(crudcompany?.idcardbackfooter);
    } catch (err) { console.log(err, 'err'); handleApiError(err, setShowAlert, handleClickOpenerr); }
  }
  const [branchoption, setBranchOption] = useState([]);

  const templateinformation = async (company, branch, temp) => {
    console.log(temp, 'temp')
    setBranchOption(
      temp?.find(
        (item) =>
          item.company === documentPrepartion.company && item.branch === branch
      )
    );
    const branchData = temp?.find(
      (item) =>
        item.company === documentPrepartion.company && item.branch === branch
    )

    setNewdata([]);

    setadd(branchData?.address);
    setcomp(branchData?.companyname);
    setcomurl(branchData?.companyurl);

    settempfrontfooter(branchData?.idcardfrontfooter[0].preview);

    settempfrontheader(branchData?.idcardfrontheader[0].preview);

    settempbackheader(branchData?.idcardbackheader[0].preview);

    settempbackfooter(branchData?.idcardbackfooter[0].preview);
  };

  const [newdata, setNewdata] = useState([]);
  const [profile, setprofile] = useState([]);

  const profileimages = async () => {
    let res = await axios.get(`${SERVICE.EMPLOYEEDOCUMENTIDCARD}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });
    setprofile(res?.data?.alldocuments);
  };

  const answer = async () => {
    let getdetail = selectedOptionsEdit.map((data) => {
      let images = profile?.find(
        (item) => item.commonid === data._id
      )?.profileimage;
      let dob1 = moment(data.dob)?.format("DD-MM-YY");

      return {
        ...data,
        label: data.name,
        value: data.name,
        profileimage: images,
        dob: dob1,
      };
    });

    setNewdata(getdetail);

  };

  const componentRef1 = useRef(null);
  let componentRef2 = useRef("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 30;
  const maxPage = Math.ceil(code.length / itemsPerPage) - 1; // Ensure we don't go out of bounds

  const displayedCode = code?.slice(
    Math.min(currentPage, maxPage) * itemsPerPage,
    (Math.min(currentPage, maxPage) + 1) * itemsPerPage
  );
  //   const downloadPdfTesdt = (data) => {
  //     setviewsetdata(true)
  //     const displayedCode = code?.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  // console.log(displayedCode?.length , 'displayedCode?.length ')
  //     if(displayedCode?.length === 0){
  //          handleCloseviewed();
  //          return;
  //     }
  //     const content = componentRef2.current.innerHTML;

  //     // Create a temporary div element to hold the content
  //     const pdfElement = document.createElement("div");


  //     // //     <div container style="display: flex; flex-wrap: wrap; gap: 17px; ">
  //     // <div style="display: flex; flex-direction:column>
  //     const footerElement = document.createElement("div");
  //     footerElement.innerHTML = `

  //     <div style="display: flex;flex-wrap: wrap; gap: 5px;">
  //     ${content}
  //   </div>`;


  //     // Append the footer element to the pdfElement
  //     pdfElement.appendChild(footerElement);

  //     // Append the temporary element to the body to ensure it can be processed by html2pdf
  //     document.body.appendChild(pdfElement);

  //     // Convert the HTML content to PDF
  //     html2pdf()
  //       .from(pdfElement)
  //       .set({
  //         margin: 1,
  //         filename: "Downloaded_Idcard.pdf",
  //         image: { type: "jpeg", quality: 1.0 },
  //         html2canvas: { scale: 5 },
  //         jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  //       })
  //       .save()
  //       .then(() => {
  //         // Remove the temporary element after the PDF is generated
  //         document.body.removeChild(pdfElement);
  //         setviewsetdata(false)
  //         setCurrentPage((prevPage) => prevPage + 1);
  //       });
  //   };


  // const downloadPdfTesdt = async () => {
  //   setviewsetdata(true);

  //   // Function to split the array into chunks of 20
  //   const chunkArray = (arr, size) => {
  //     return arr.reduce((acc, _, i) => 
  //       (i % size ? acc[acc.length - 1].push(arr[i]) : acc.push([arr[i]]), acc), 
  //     []);
  //   };

  //   // Split the code array into chunks of 20
  //   const chunks = chunkArray(code, 20);

  //   for (let i = 0; i < chunks.length; i++) {
  //     // Wait for each chunk to be processed before moving to the next
  //     await generatePdfForChunk(chunks[i], i + 1);
  //   }

  //   setviewsetdata(false);
  // };

  // const generatePdfForChunk = async (dataChunk, chunkNumber) => {
  //   return new Promise((resolve) => {
  //     // Update the componentRef2 content dynamically
  //     componentRef2.current.innerHTML = dataChunk.map(d => `
  //       <div style="flex: 1 1 20%; width: 75px; box-sizing: border-box; padding: 150px 10px 250px 10px;">
  //         <div style="border: 1px solid black; width: 151px; height: 300px; border-radius: 3px;">
  //           <div>
  //             <img style="width: 149px; height: 100px;" src="${viewfrontheader}" />
  //           </div>
  //           <div style="margin-top: 20px;"></div>
  //           <div>
  //             <img style="display: block; margin: 0 auto; object-fit: cover; border: 2px solid black; border-radius: 4px; width: 55px; height: 75px;" src="${d.profileimage || placeholderImage}" />
  //           </div>
  //           <div style="margin-top: 15px;"></div>
  //           <div style="text-align: center; font-size: 10px; color: black; height: 12px; font-weight: bold; font-family: sans-serif;">
  //             <span style="text-transform: uppercase; font-weight: bolder;">${d.legalname}</span>
  //           </div>
  //           <div style="margin-top: 0.5px; height: 0.5px;"></div>
  //           <div style="text-align: center; font-size: 10px; color: black; height: 12px; font-weight: bold; font-family: sans-serif;">
  //             <span style="text-transform: uppercase;">(${d.callingname})</span>
  //           </div>
  //         </div>
  //       </div>
  //     `).join('');

  //     const content = componentRef2.current.innerHTML;
  //     const pdfElement = document.createElement("div");

  //     const footerElement = document.createElement("div");
  //     footerElement.innerHTML = `<div style="display: flex; flex-wrap: wrap; gap: 5px;">${content}</div>`;

  //     pdfElement.appendChild(footerElement);
  //     document.body.appendChild(pdfElement);

  //     // Convert to PDF
  //     html2pdf()
  //       .from(pdfElement)
  //       .set({
  //         margin: 1,
  //         filename: `Downloaded_Idcard_Part_${chunkNumber}.pdf`,
  //         image: { type: "jpeg", quality: 1.0 },
  //         html2canvas: { scale: 5 },
  //         jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  //       })
  //       .save()
  //       .then(() => {
  //         document.body.removeChild(pdfElement);
  //         resolve(); // Move to the next chunk
  //       });
  //   });
  // };



  const downloadPdfTesdt = () => {
    setviewsetdata(true);

    const maxPage = Math.ceil(code.length / itemsPerPage) - 1; // Ensure we don't go out of bounds

    const displayedCode = code?.slice(
      Math.min(currentPage, maxPage) * itemsPerPage,
      (Math.min(currentPage, maxPage) + 1) * itemsPerPage
    );

    console.log(displayedCode?.length, currentPage, "displayedCode?.length");

    if (!displayedCode?.length) {
      handleCloseviewed();
      setviewsetdata(false);
      setcode([]);
      setCurrentPage(0)
      return;
    }

    const content = componentRef2.current.innerHTML;

    // Create a temporary div element to hold the content
    const pdfElement = document.createElement("div");

    const footerElement = document.createElement("div");
    footerElement.innerHTML = `
      <div style="display: flex; flex-wrap: wrap; gap: 5px;">
        ${content}
      </div>`;

    pdfElement.appendChild(footerElement);
    document.body.appendChild(pdfElement);

    // Convert the HTML content to PDF
    html2pdf()
      .from(pdfElement)
      .set({
        margin: 1,
        filename: `Downloaded_Idcard_Page_${currentPage + 1}.pdf`,
        image: { type: "jpeg", quality: 1.0 },
        html2canvas: { scale: 5 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .save()
      .then(() => {
        document.body.removeChild(pdfElement);
        setviewsetdata(false);

        // Move to the next page and call the function recursively
        setCurrentPage((prevPage) => {
          const nextPage = prevPage + 1;
          if (nextPage * itemsPerPage < code.length) {
            setTimeout(downloadPdfTesdt, 500); // Delay for smooth execution
          } else {
            handleCloseviewed();
            setviewsetdata(false);
            setcode([]);
            setCurrentPage(0)
          }
          return nextPage;
        });
      });
  };


  const downloadPdfTesdtEdit = () => {
    // Create a new div element to hold the Quill content
    const pdfElement = document.createElement("div");
    pdfElement.innerHTML = checkingEdit;

    // Add custom styles to the PDF content
    const styleElement = document.createElement("style");
    styleElement.textContent = `
     .ql-indent-1 { margin-left: 75px; } /* Adjust margin for indent-1 class */
     .ql-indent-2 { margin-left: 150px; } /* Adjust margin for indent-2 class */
     .ql-indent-3 { margin-left: 225px; } /* Adjust margin for indent-3 class */
     .ql-indent-4 { margin-left: 275px; } /* Adjust margin for indent-4 class */
     .ql-indent-5 { margin-left: 325px; } /* Adjust margin for indent-5 class */
     .ql-indent-6 { margin-left: 375px; } /* Adjust margin for indent-6 class */
     .ql-indent-7 { margin-left: 425px; } /* Adjust margin for indent-7 class */
     .ql-indent-8 { margin-left: 475px; } /* Adjust margin for indent-8 class */
     .ql-align-right { text-align: right; } 
     .ql-align-left { text-align: left; } 
     .ql-align-center { text-align: center; } 
     .ql-align-justify { text-align: justify; }  
   `;

    pdfElement.appendChild(styleElement);

    // Convert the HTML content to PDF
    html2pdf(pdfElement, {
      margin: 1,
      filename: `${documentPreparationEdit.person}_${documentPreparationEdit.template}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    });
  };

  const downloadPdfTesdtTable = async (e) => {
    // Create a new div element to hold the Quill content
    let response = await axios.get(`${SERVICE.SINGLE_CARDPREPARATION}/${e}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });

    const pdfElement = document.createElement("div");
    pdfElement.innerHTML = response.data.scardPreparation.document;

    // Add custom styles to the PDF content
    const styleElement = document.createElement("style");
    styleElement.textContent = `
     .ql-indent-1 { margin-left: 75px; } /* Adjust margin for indent-1 class */
     .ql-indent-2 { margin-left: 150px; } /* Adjust margin for indent-2 class */
     .ql-indent-3 { margin-left: 225px; } /* Adjust margin for indent-3 class */
     .ql-indent-4 { margin-left: 275px; } /* Adjust margin for indent-4 class */
     .ql-indent-5 { margin-left: 325px; } /* Adjust margin for indent-5 class */
     .ql-indent-6 { margin-left: 375px; } /* Adjust margin for indent-6 class */
     .ql-indent-7 { margin-left: 425px; } /* Adjust margin for indent-7 class */
     .ql-indent-8 { margin-left: 475px; } /* Adjust margin for indent-8 class */
     .ql-align-right { text-align: right; } 
     .ql-align-left { text-align: left; } 
     .ql-align-center { text-align: center; } 
     .ql-align-justify { text-align: justify; } 
   `;

    pdfElement.appendChild(styleElement);

    // Convert the HTML content to PDF
    html2pdf(pdfElement, {
      margin: 17,
      filename: `${response.data.scardPreparation.person}_${response.data.scardPreparation.template}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    });
  };

  //get all Employeename.
  const fetchAllEmployeeEdit = async (e) => {
    setPageName(!pageName);
    try {
      let teamname = e ? e.value : documentPreparationEdit.team;
      let res_module = await axios.post(SERVICE.USEREMP_TEAMGROUP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: documentPreparationEdit.company,
        branch: documentPreparationEdit.branch,
        unit: documentPreparationEdit.unit,
        team: teamname,
      });
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //set function to get particular row
  const rowData = async (id, name) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_CARDPREPARATION}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDocumentPreparationEdit(res?.data?.scardPreparation);
      handleClickOpen();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  // Alert delete popup
  let brandid = documentPreparationEdit?._id;
  const delBrand = async () => {
    setPageName(!pageName);
    try {
      await axios.delete(`${SERVICE.SINGLE_CARDPREPARATION}/${brandid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchBrandMaster();
      handleCloseMod();
      setSelectedRows([]);
      setPage(1);
      setPopupContent('Deleted Successfully');
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //add function
  const sendRequest = async () => {
    setPageName(!pageName);
    try {
      const person = selectedOptionsEdit.map((data) => data.value);
      let brandCreate = await axios.post(SERVICE.CREATE_CARD_PREPARATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

        company: String(documentPrepartion.company),
        branch: String(documentPrepartion.branch),
        unit: String(documentPrepartion.unit),
        team: String(documentPrepartion.team),
        person: person,
        idcard: newdata,
        idcardfrontheader: templatefrontheader,
        idcardfrontfooter: templatefrontfooter,
        idcardbackheader: templatebackheader,
        idcardbackfooter: templatebackfooter,
        add: add,
        comp: comp,
        comurl: comurl,

        addedby: [
          {
            name: String(username),
            date: String(new Date()),
          },
        ],
      });
      //   setTemplateCreation(brandCreate.data);
      await fetchBrandMaster();
      setDocumentPrepartion({
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        team: "Please Select Team",
        person: "Please Select Person",
      });
      setDepartmentCheck(false);
      setAllBranchValue(false);
      setBranchOptions([]);
      setUnitOptions([]);
      setTeamOptions([]);
      setEmployeenames([]);
      setNewdata([]);
      setSelectedOptionsEdit([]);

      setPopupContent('Added Successfully');
      setPopupSeverity("success");
      handleClickOpenPopup();
      setviewdata(false);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedNames = selectedOptionsEdit?.map((data) => data.companyname);
    const isNameMatch = templateCreationArrayDupCheck?.some((item) =>
      item.person.some((data) => selectedNames.includes(data))
    );

    if (
      documentPrepartion.company === "" ||
      documentPrepartion.company === "Please Select Company"
    ) {
      setPopupContentMalert('Please Select Company');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      departmentCheck === false &&
      (documentPrepartion.branch === "" ||
        documentPrepartion.branch === "Please Select Branch")
    ) {
      setPopupContentMalert('Please Select Branch');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();


    } else if (
      documentPrepartion.unit === "" ||
      documentPrepartion.unit === "Please Select Unit"
    ) {
      setPopupContentMalert('Please Select Unit');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      documentPrepartion.team === "" ||
      documentPrepartion.team === "Please Select Team"
    ) {
      setPopupContentMalert('Please Select Team');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsEdit.length <= 0) {
      setPopupContentMalert('Please Select Person');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert('ID card with Person Name already exists!');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {

      answer();
      profileimages();
    }
  };


  //submit option for saving
  const handleSubmited = (e) => {
    e.preventDefault();
    const isNameMatch = templateCreationArrayDupCheck?.some(
      (item) =>
        item.template?.toLowerCase() ===
        documentPrepartion.template?.toLowerCase() &&
        item.person === documentPrepartion.person
    );

    setviewdata(true);

    if (
      documentPrepartion.company === "" ||
      documentPrepartion.company === "Please Select Company"
    ) {
      setPopupContentMalert('Please Select Company');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      documentPrepartion.branch === "" ||
      documentPrepartion.branch === "Please Select Branch"
    ) {
      setPopupContentMalert('Please Select Branch');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      documentPrepartion.unit === "" ||
      documentPrepartion.unit === "Please Select Unit"
    ) {
      setPopupContentMalert('Please Select Unit');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      documentPrepartion.team === "" ||
      documentPrepartion.team === "Please Select Team"
    ) {
      setPopupContentMalert('Please Select Team');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsEdit.length <= 0) {
      setPopupContentMalert('Please Select Person');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (newdata.length === 0) {
      setPopupContentMalert('Please generate IDcard');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert('ID card with Person Name already exists!');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };

  const handlecleared = (e) => {
    setadd("");
    setcomp("");
    setcomurl("");

    settempfrontfooter("");

    settempfrontheader("");

    settempbackheader("");

    settempbackfooter("");

    setNewdata([]);
    setSelectedOptionsEdit([]);
    e.preventDefault();
    setDocumentPrepartion({
      company: "Please Select Company",
      branch: "Please Select Branch",
      unit: "Please Select Unit",
      team: "Please Select Team",
      person: "Please Select Person",
    });

    setDepartmentCheck(false);
    setAllBranchValue(false);
    setBranchOptions([]);
    setUnitOptions([]);
    setTeamOptions([]);
    setEmployeenames([]);
    setChecking("");
    setPopupContent('Cleared Successfully');
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  //get all brand master name.
  const fetchBrandMaster = async () => {
    setPageName(!pageName);
    try {
      let res_freq = await axios.post(SERVICE.ALL_CARDPREPARATION_ASSIGNBRANCH, {
        assignbranch: accessbranch
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const answer = res_freq?.data?.cardpreparation?.length > 0 ? res_freq?.data?.cardpreparation?.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
      })) : [];
      setTemplateCreationArray(answer);
      setTemplateCreationArrayDupCheck(res_freq?.data?.overallList);
      setLoader(true);
    } catch (err) { setLoader(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };


  useEffect(() => {
    profileimages();
    fetchParticipants();

    CompanyDropDowns();
    fetchBrandMaster();
  }, []);

  const delAreagrpcheckbox = async () => {
    setPageName(!pageName);
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.SINGLE_CARDPREPARATION}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });
      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
      setIsHandleChange(false)
      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);

      await fetchBrandMaster();
      setPopupContent('Deleted Successfully');
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const handleCategoryEditChange = (options) => {
    setEmployeeEdit(
      options.map((a, index) => {
        return a.value;
      })
    );

    setSelectedOptionsEdit(options);
  };

  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
  };




  const getdownloadidcard = async (e) => {
    setPageName(!pageName);
    try {
      // setviewst("view")
      let res = await axios.get(`${SERVICE.SINGLE_CARDPREPARATION}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDocumentPreparationEdit(res?.data?.scardPreparation);

      setcode(res?.data?.scardPreparation?.idcard);

      setviewfrontfooter(
        res?.data?.scardPreparation.idcardfrontfooter[0].preview
      );

      setviewfrontheader(
        res?.data?.scardPreparation.idcardfrontheader[0].preview
      );

      setviewbackheader(
        res?.data?.scardPreparation.idcardbackheader[0].preview
      );

      setviewbackfooter(
        res?.data?.scardPreparation.idcardbackfooter[0].preview
      );

      setnewadd(res?.data?.scardPreparation.add);
      setnewcomp(res?.data?.scardPreparation.comp);
      setnewcomurl(res?.data?.scardPreparation.comurl);

      handleClickOpenviewed();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const [viewfrontheader, setviewfrontheader] = useState("");
  const [viewfrontfooter, setviewfrontfooter] = useState("");
  const [viewbackheader, setviewbackheader] = useState("");
  const [viewbackfooter, setviewbackfooter] = useState("");

  const [newadd, setnewadd] = useState("");
  const [newcomp, setnewcomp] = useState("");
  const [newcomurl, setnewcomurl] = useState("");

  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName);
    try {
      handleClickOpenview();

      setviewst("view");
      let res = await axios.get(`${SERVICE.SINGLE_CARDPREPARATION}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDocumentPreparationEdit(res?.data?.scardPreparation);

      setcode(res?.data?.scardPreparation.idcard);

      setviewfrontfooter(
        res?.data?.scardPreparation.idcardfrontfooter[0].preview
      );

      setviewfrontheader(
        res?.data?.scardPreparation.idcardfrontheader[0].preview
      );

      setviewbackheader(
        res?.data?.scardPreparation.idcardbackheader[0].preview
      );

      setviewbackfooter(
        res?.data?.scardPreparation.idcardbackfooter[0].preview
      );

      setnewadd(res?.data?.scardPreparation.add);
      setnewcomp(res?.data?.scardPreparation.comp);
      setnewcomurl(res?.data?.scardPreparation.comurl);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    setviewst("");
  };
  //get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_CARDPREPARATION}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDocumentPreparationEdit(res?.data?.scardPreparation);
      handleClickOpeninfo();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //frequency master name updateby edit page...
  let updateby = documentPreparationEdit?.updatedby;
  let addedby = documentPreparationEdit?.addedby;
  let frequencyId = documentPreparationEdit?._id;
  const [checkingEdit, setCheckingEdit] = useState("");

  //image
  const gridRefTableImg = useRef(null);
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "ID Card Preparation.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  // Excel
  const fileName = "Id_Card_Preparation";
  // get particular columns for export excel
  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "ID Card Preparation",
    pageStyle: "print",
  });

  //serial no for listing items
  const addSerialNumber = (data) => {
    setItems(data);
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
    fetchAllEmployeeEdit();
  }, [isEditOpen]);

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
      //lockPinned: true,
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
      field: "person",
      headerName: "Person",
      flex: 0,
      width: 200,
      hide: !columnVisibility.person,
      headerClassName: "bold-header",
    },

    {
      field: "Idcard",
      headerName: "Idcard",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.Idcard,
      cellRenderer: (params) => (
        <Grid>
          <Button
            sx={buttonStyles?.buttonsubmit}
            onClick={(e) => {
              getdownloadidcard(params.data.id);
            }}
            variant="contained"
          >
            <span>View</span>
          </Button>
        </Grid>
      ),
    },

    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 250,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("didcardpreparation") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id, params.data.name);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vidcardpreparation") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iidcardpreparation") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {

                getinfoCode(params.data.id);
              }}
            >
              <InfoOutlinedIcon sx={buttonStyles.buttoninfo} style={{ fontsize: "large" }} />
            </Button>
          )}
        </Grid>
      ),
    },
  ];

  const convertToNumberedList = (htmlContent) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = htmlContent;

    const listItems = Array.from(tempElement.querySelectorAll("li"));
    listItems.forEach((li, index) => {
      li.innerHTML = `${index + 1}. ${li.innerHTML}\n`;
    });

    return tempElement.innerText;
  };

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      company: item.company === "Please Select Company" ? "" : item.company,
      branch: item.branch === "Please Select Branch" ? "" : item.branch,
      unit: item.unit === "Please Select Unit" ? "" : item.unit,
      team: item.team === "Please Select Team" ? "" : item.team,
      person: item.person.toString(),
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


  const getMaxFontSize = (name) => {
    const maxLength = 20; // Maximum length before reducing font size
    const defaultFontSize = 12; // Default font size
    const scaleFactor = defaultFontSize / name?.length;
    return name?.length > maxLength ? Math.floor(scaleFactor * maxLength) : defaultFontSize;
  };
  const getMaxFontSizenew = (name) => {
    const maxLength = 20; // Maximum length before reducing font size
    const defaultFontSize = 12; // Default font size
    const scaleFactor = defaultFontSize / name?.length;
    return name?.length > maxLength ? Math.floor(scaleFactor * maxLength) : defaultFontSize;
  };
  const setMaxFontSize = (name) => {
    const maxLength = 18; // Maximum length before reducing font size
    const defaultFontSize = 12; // Default font size
    const scaleFactor = defaultFontSize / name?.length;
    return name?.length > maxLength ? Math.floor(scaleFactor * maxLength) : defaultFontSize;
  };
  const setMaxFontSizenew = (name) => {
    const maxLength = 18; // Maximum length before reducing font size
    const defaultFontSize = 12; // Default font size
    const scaleFactor = defaultFontSize / name?.length;
    return name?.length > maxLength ? Math.floor(scaleFactor * maxLength) : defaultFontSize;
  };











  const isValidUrl = (url) => {
    return url !== "";
  };
  const [viewdata, setviewdata] = useState(false);
  const [viewsetdata, setviewsetdata] = useState(false);
  return (
    <Box>
      <LoadingBackdrop open={isLoading} />
      <Headtitle title={"ID CARD PREPARATION"} />
      {/* ****** Header Content ****** */}

      <PageHeading title="ID Card Preparation" modulename="Human Resources" submodulename="HR Documents" mainpagename="Employee Documents" subpagename="Idcard Preparation" subsubpagename="" />

      {isUserRoleCompare?.includes("aidcardpreparation") && (
        <Box sx={userStyle.selectcontainer}>
          <Typography sx={userStyle.HeaderText}>Add ID card Preparation</Typography>
          <>
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Company<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    maxMenuHeight={300}
                    options={CompanyOptions}
                    isDisabled={departmentCheck}
                    value={{
                      label: documentPrepartion.company,
                      value: documentPrepartion.company,
                    }}
                    onChange={(e) => {
                      BranchDropDowns(e);
                      // UnitDropDowns(e.value);
                      setAllBranch(e.value);
                      setAllBranchValue(true);
                      setDocumentPrepartion({
                        ...documentPrepartion,
                        company: e.value,
                        branch: "Please Select Branch",
                        unit: "Please Select Unit",
                        team: "Please Select Team",
                        person: "Please Select Person",
                      });
                      // setBranchOptions([]);
                      setUnitOptions([]);
                      setTeamOptions([]);
                      setEmployeenames([]);
                      setSelectedOptionsEdit([]);
                      settempfrontheader("")
                      settempfrontfooter("")
                      settempbackfooter('')
                      settempbackheader('')
                      setadd("");
                      setcomp("");
                      setcomurl("");
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
                    maxMenuHeight={300}
                    options={BranchOptions}
                    isDisabled={departmentCheck}
                    value={{
                      label: documentPrepartion.branch,
                      value: documentPrepartion.branch,
                    }}
                    onChange={(e) => {
                      UnitDropDowns(e.value);
                      setAllBranch(e.value);
                      setAllBranchValue(true);
                      templateinfo(e.value)
                      setDocumentPrepartion({
                        ...documentPrepartion,
                        branch: e.value,
                        unit: "Please Select Unit",
                        team: "Please Select Team",
                        person: "Please Select Person",
                      });
                      setSelectedOptionsEdit([]);


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
                    maxMenuHeight={300}
                    options={UnitOptions}
                    isDisabled={departmentCheck}
                    value={{
                      label: documentPrepartion.unit,
                      value: documentPrepartion.unit,
                    }}
                    onChange={(e) => {
                      fetchTeam(e.value);
                      setDocumentPrepartion({
                        ...documentPrepartion,
                        unit: e.value,
                        team: "Please Select Team",
                        person: "Please Select Person",
                      });
                      setSelectedOptionsEdit([]);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Team<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    maxMenuHeight={300}
                    options={TeamOptions}
                    isDisabled={departmentCheck}
                    value={{
                      label: documentPrepartion.team,
                      value: documentPrepartion.team,
                    }}
                    onChange={(e) => {
                      setDocumentPrepartion({
                        ...documentPrepartion,
                        team: e.value,
                      });
                      fetchAllEmployee(e);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Person<b style={{ color: "red" }}>*</b>
                  </Typography>

                  <MultiSelect
                    options={employeenames}
                    value={selectedOptionsEdit}
                    onChange={handleCategoryEditChange}
                    valueRenderer={customValueRendererEditCompanyFrom}
                    labelledBy="Please Select Person"
                  />
                </FormControl>
              </Grid>

              <Grid item md={12} sm={12} xs={12}></Grid>

              <Grid item md={12} xs={12} sm={12}></Grid>

              <Grid
                md={12}
                xs={12}
                sm={12}
                container
                spacing={2}
                style={{ display: "flex", gap: "10px", flexDirection: "row" }}
              >
                <Grid item lg={3} md={3} sm={12} xs={12}>
                  <div
                    style={{
                      border: "1px solid black",
                      width: "14.2vw",
                      // height: "44vh",
                      borderRadius: "3px",
                    }}
                  >
                    <div>
                      {isValidUrl(tempfrontheader) && (
                        <img
                          style={{
                            width: "14vw",
                            height: "14vh",
                            // objectFit: "cover",
                          }}
                          src={tempfrontheader}
                        />
                      )}
                    </div>
                    <div style={{ marginTop: "1.3vh" }}></div>

                    <div
                      style={{
                        // justifyContent: "center",
                        // alignItems: "center",
                        border: "2px solid black",
                        borderRadius: "4px",
                        marginLeft: "3.7vw",
                        width: "6vw",
                        height: "14.7vh",
                      }}
                    ></div>
                    <div style={{ marginTop: "1.4vh" }}></div>
                    <div
                      style={{
                        textAlign: "center",
                        fontSize: "1vw",
                        color: "black",
                        fontWeight: "bold",
                        fontFamily: "sans-serif",
                      }}
                    >
                      {"NAME"}
                    </div>

                    <div
                      style={{
                        textAlign: "center",
                        fontSize: "0.8vw",
                        color: "black",

                        fontFamily: "sans-serif",
                      }}
                    >
                      {"(Calling Name)"}
                    </div>


                    <div
                      style={{
                        marginTop: "2.9vh",
                      }}
                    ></div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        // Assuming you want the container to take the full viewport height
                      }}
                    >
                      {isValidUrl(tempfrontfooter) && (
                        <img
                          style={{
                            height: "5vh",
                            width: "14vw",
                            // objectFit: "cover",
                          }}
                          src={tempfrontfooter}
                        />
                      )}
                    </div>
                  </div>
                </Grid>
                <Grid item lg={3} md={3} sm={12} xs={12}>
                  <div
                    style={{
                      border: "1px solid black",
                      width: "14.2vw",
                      // height: "44vh",
                      borderRadius: "3px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      {isValidUrl(tempfrontfooter) && (
                        <img
                          style={{
                            height: "4vh",
                            width: "14vw",
                            // objectFit: "cover",
                          }}
                          src={tempbackheader}
                        />
                      )}
                    </div>

                    <div
                      style={{
                        marginTop: "0.8vh",
                      }}
                    ></div>

                    <div
                      style={{
                        fontSize: "0.7vw",
                        fontWeight: "bold",
                        paddingLeft: "15px",
                        fontFamily: "sans-serif",
                        color: "black",
                      }}
                    >
                      <div>{"Employee ID :"}</div>
                      <br />
                      <div>{"Date of Birth :"}</div>
                      <br />
                      <div>{"Blood Group :"}</div>
                      <br />
                      <div>{"Emergency Contact(s) :"}</div>
                    </div>
                    {/* <div
                        style={{
                         
                          marginTop: "6.0vh",
                         
                        }}
                      >
                        
                      </div> */}
                    <br />
                    <br />

                    <div
                      style={{
                        fontFamily: "neuropol",
                        color: "darkblue",

                        textAlign: "center",
                        fontWeight: "bolder",
                        fontSize: "0.8vw",
                        // whiteSpace: "nowrap",
                      }}
                    >
                      {" "}
                      {comp}
                    </div>
                    <div
                      style={{
                        marginTop: "0.5vh",
                      }}
                    ></div>

                    <div
                      style={{
                        fontSize: "0.7vw",
                        textAlign: "center",

                        color: "black",
                        fontFamily: "sans-serif",
                        fontWeight: "bolder",
                      }}
                    >
                      {" "}
                      {add}
                    </div>
                    <div
                      style={{
                        marginTop: "0.5vh",
                      }}
                    ></div>

                    <div
                      style={{
                        fontSize: "0.7vw",
                        color: "orange",
                        textAlign: "center",

                        fontFamily: "sans-serif",
                      }}
                    >
                      {comurl}
                    </div>
                    <div
                      style={{
                        marginTop: "0.5vh",
                      }}
                    ></div>

                    <div style={{ fontWeight: "bold" }}>
                      <hr />
                    </div>
                    <div
                      style={{
                        marginTop: "0.5vh",
                      }}
                    ></div>

                    <div
                      style={{
                        textAlign: "center",
                        fontSize: "0.7vw",
                        color: "black",
                        fontFamily: "sans-serif",
                      }}
                    >
                      {"This card is a property"}
                    </div>
                    <div
                      style={{
                        fontFamily: "neuropol",
                        color: "darkblue",
                        textAlign: "center",
                        fontSize: "0.8vw",
                        fontWeight: "bolder",
                      }}
                    >
                      {" "}
                      {comp}
                    </div>
                    <div
                      style={{
                        textAlign: "center",
                        fontSize: "0.7vw",
                        color: "black",
                        fontFamily: "sans-serif",
                      }}
                    >
                      {"If found, please return to the above address"}
                    </div>
                    <div
                      style={{
                        marginBottom: "0.5vh",
                      }}
                    ></div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        // Assuming you want the container to take the full viewport height
                      }}
                    >
                      {isValidUrl(tempfrontfooter) && (
                        <img
                          style={{
                            height: "5vh",
                            width: "14vw",
                            justifyContent: "end",

                            // objectFit: "cover",
                          }}
                          src={tempbackfooter}
                        />
                      )}
                    </div>
                  </div>
                </Grid>
              </Grid>

              <Grid item md={12} xs={12} sm={12}></Grid>
              <Grid item md={12} xs={12} sm={12}></Grid>
              <Grid item md={12} xs={12} sm={12}></Grid>
              <Grid item md={12} xs={12} sm={12}></Grid>
              <Grid item md={12} xs={12} sm={12}></Grid>
              <Grid item md={12} xs={12} sm={12}></Grid>

              <Grid
                item
                md={12}
                xs={12}
                sm={12}
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
                  Generate
                </Button>
              </Grid>
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <Grid
                container
                spacing={2}
                sx={{ gap: "17px" }}
                ref={componentRef1}

              >
                {newdata.map((d, index) => (

                  <Grid item md={2} sm={12} xs={12} sx={{ display: 'flex', flexDirection: 'column', flexBasis: 'auto' }} key={index} >


                    <div
                      style={{
                        border: "1px solid black",
                        width: "14.2vw",

                        borderRadius: "3px"
                      }}
                    >
                      <div

                      >
                        <img
                          style={{
                            width: "14vw", height: "14vh",
                            // objectFit: "cover"
                          }}
                          src={tempfrontheader}
                        />
                      </div>
                      <div style={{ marginTop: "1.3vh" }}>

                      </div>

                      <div
                      >
                        <img style={{
                          display: "flex",
                          justifyContent: "center",
                          marginLeft: "3.8vw",
                          objectFit: 'cover',
                          border: "2px solid black",
                          borderRadius: "4px",

                          width: "6vw",
                          height: "14.7vh",

                        }} src={d.profileimage ? d.profileimage : placeholderImage} />
                      </div>


                      <div style={{ marginTop: "1.4vh" }}>

                      </div>
                      <div style={{ textAlign: "center", height: "12px", fontSize: `${getMaxFontSize(d.legalname)}px`, color: "black", fontWeight: "bold", fontFamily: "sans-serif" }}>
                        <span
                          style={{
                            textTransform: "uppercase",
                            fontWeight: "bolder",

                            color: "black",
                            fontFamily: "sans-serif"
                          }}
                        >
                          {d.legalname}
                        </span>
                      </div>
                      <div style={{
                        height: "0.125vh"
                      }}></div>

                      <div style={{ textAlign: "center", height: "12px", fontSize: `${getMaxFontSizenew(d.callingname)}px`, fontWeight: "bold", fontFamily: "sans-serif" }}>
                        <span
                          style={{
                            textTransform: "uppercase",
                            // fontWeight: "bolder",

                            fontFamily: "sans-serif"
                          }}
                        >
                          ({d.callingname})
                        </span>
                      </div>

                      <div style={{

                        marginTop: "4.5vh",

                      }}></div>

                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-end',
                          // Assuming you want the container to take the full viewport height
                        }}
                      >
                        <img
                          style={{
                            height: '5vh',
                            width: '14vw',
                            // objectFit: 'cover'
                          }}
                          src={tempfrontfooter}
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        border: "1px solid black",
                        width: "14.2vw",

                        borderRadius: "3px"
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",


                        }}
                      >
                        <img
                          style={{
                            height: "4vh",
                            width: "14vw",
                            //  objectFit: 'cover'
                          }}
                          src={tempbackheader}
                        />
                      </div>
                      <div
                        style={{
                          marginTop: "0.8vh",

                        }}
                      ></div>

                      <div
                        style={{

                          fontSize: "0.7vw",
                          fontWeight: "bold",
                          paddingLeft: "15px",
                          fontFamily: "sans-serif",
                          color: "black"
                        }}
                      >
                        <div>
                          {" "}
                          Employee ID :{" "}
                          <span style={{ color: "darkblue" }}>
                            {d.empcode}
                          </span>
                        </div>
                        <br />
                        <div>
                          Date of Birth :{" "}
                          <span style={{ color: "darkblue" }}>{d.dob}</span>
                        </div>
                        <br />
                        <div>
                          Blood Group :{" "}
                          <span style={{ color: "darkblue" }}>
                            {d.bloodgroup}
                          </span>
                        </div>
                        <br />
                        <div>
                          Emergency Contact(s):{" "}
                          <span style={{ color: "darkblue" }}>
                            {d.emergencyno}
                          </span>
                        </div>
                      </div>
                      <div style={{

                        marginTop: "5.7vh",

                      }}></div>

                      <div
                        style={{
                          fontFamily: "neuropol",
                          color: "darkblue",
                          fontSize: "0.7vw",
                          textAlign: "center",
                          fontWeight: "bolder",
                          // whiteSpace: "nowrap",

                        }}
                      >
                        {" "}
                        {comp}
                      </div>
                      <div
                        style={{
                          marginTop: "0.5vh",

                        }}
                      ></div>
                      <div
                        style={{
                          fontSize: "0.7vw",
                          textAlign: "center",

                          fontWeight: "bolder",
                          fontFamily: "sans-serif",
                          color: "black"
                        }}
                      >
                        {" "}
                        {add}
                      </div>
                      <div
                        style={{
                          marginTop: "0.5vh",

                        }}
                      ></div>

                      <div
                        style={{
                          fontSize: "0.7vw",
                          color: "orange",
                          textAlign: "center",

                          fontFamily: "sans-serif",
                        }}
                      >
                        {comurl}
                      </div>
                      <div
                        style={{
                          marginTop: "0.5vh",

                        }}
                      ></div>
                      <div style={{ fontWeight: "bold" }}>
                        <hr />
                      </div>
                      <div
                        style={{
                          marginTop: "0.5vh",

                        }}
                      ></div>

                      <div
                        style={{
                          textAlign: "center",
                          fontSize: "0.7vw",
                          fontFamily: "sans-serif",
                          color: "black"

                        }}
                      >
                        {"This card is a property"}
                      </div>
                      <div
                        style={{
                          fontFamily: "neuropol",
                          color: "darkblue",

                          textAlign: "center",
                          fontSize: "0.8vw",
                          fontWeight: "bolder",
                        }}
                      >
                        {" "}
                        {comp}
                      </div>
                      <div style={{
                        textAlign: "center", fontSize: "0.7vw", fontFamily: "sans-serif",
                        color: "black"
                      }}>
                        {"If found, please return to the above address"}
                      </div>
                      <div
                        style={{
                          marginTop: "0.5vh",

                        }}
                      ></div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: 'column',
                          justifyContent: "flex-end",

                        }}
                      >
                        <img
                          style={{
                            height: "5vh",
                            width: "14vw",
                            justifyContent: "end",

                            // objectFit: 'cover'
                          }}
                          src={tempbackfooter}
                        />
                      </div>
                    </div>


                  </Grid>

                ))}
              </Grid>

              <br />
            </Grid>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />

            <Grid
              container
              spacing={2}
              sx={{ display: "flex", justifyContent: "center" }}
            >

              <Grid item lg={1} md={2} sm={2} xs={12}></Grid>
              <Grid item lg={1} md={2} sm={2} xs={12}>
                <LoadingButton

                  onClick={(e) => {
                    handleSubmited(e);
                  }}
                  sx={buttonStyles.buttonsubmit}
                  loading={viewdata == true}
                  loadingPosition="end"
                  variant="contained"
                >
                  <span>Save</span>
                </LoadingButton>
              </Grid>
              <Grid item lg={1} md={2} sm={2} xs={12}>
                <Button sx={buttonStyles.btncancel} onClick={handlecleared}>
                  Clear
                </Button>
              </Grid>
            </Grid>
          </>
        </Box>
      )}
      {/* } */}
      <br /> <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lidcardpreparation") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            {/* <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                List ID card Preparation
              </Typography> */}
            <Grid item xs={8}>
              <ScrollingText text="The number of documents depends on the template count, with each document containing up to 30 templates" />
            </Grid>
            {/* </Grid> */}
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
                    <MenuItem value={templateCreationArray?.length}>
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
                  {isUserRoleCompare?.includes("excelidcardpreparation") && (
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
                  {isUserRoleCompare?.includes("csvidcardpreparation") && (
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
                  {isUserRoleCompare?.includes("printidcardpreparation") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfidcardpreparation") && (
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
                  {isUserRoleCompare?.includes("imageidcardpreparation") && (
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
              <Grid item md={2} xs={12} sm={12}>
                <AggregatedSearchBar
                  columnDataTable={columnDataTable}
                  setItems={setItems}
                  addSerialNumber={addSerialNumber}
                  setPage={setPage}
                  maindatas={templateCreationArray}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                  totalDatas={items}
                  setFilteredChanges={setFilteredChanges}
                  filteredChanges={filteredChanges}
                />
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
            {isUserRoleCompare?.includes("bdidcardpreparation") && (
              <Button
                variant="contained"
                sx={buttonStyles.buttonbulkdelete}
                color="error"
                onClick={handleClickOpenalert}
              >
                Bulk Delete
              </Button>
            )}
            <br />
            <br />
            <Box
              style={{
                width: "100%",
                overflowY: "hidden", // Hide the y-axis scrollbar
              }}
            >
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
                // totalDatas={totalProjects}
                searchQuery={searchedString}
                handleShowAllColumns={handleShowAllColumns}
                setFilteredRowData={setFilteredRowData}
                filteredRowData={filteredRowData}
                setFilteredChanges={setFilteredChanges}
                filteredChanges={filteredChanges}
                gridRefTableImg={gridRefTableImg}
                itemsList={items}
              />
            </Box>
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
      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table
          sx={{ minWidth: 700 }}
          aria-label="customized table"
          id="usertable"
          ref={componentRef}
        >
          <TableHead>
            <TableRow>
              <TableCell>sno</TableCell>
              <TableCell>company</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Team</TableCell>
              <TableCell>Person</TableCell>
            </TableRow>
          </TableHead>
          <TableBody align="left">
            {filteredData &&
              filteredData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>

                  <TableCell>{row.company}</TableCell>
                  <TableCell>{row.branch}</TableCell>
                  <TableCell>{row.unit}</TableCell>
                  <TableCell>{row.team}</TableCell>
                  <TableCell>{row.person}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        fullWidth={true}
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              {/* <b>View IDcard Preparation</b> */}
              <b>View IDcard Details</b>
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Company</Typography>
                    <Typography>{documentPreparationEdit.company}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Branch</Typography>
                    <Typography>{documentPreparationEdit.branch}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Unit</Typography>
                    <Typography>{documentPreparationEdit.unit}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Team</Typography>
                    <Typography>{documentPreparationEdit.team}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Person</Typography>
                    <Typography style={{ marginLeft: "50px", whiteSpace: "pre-line" }}>
                      {documentPreparationEdit.person
                        ?.map((t, i) => `${i + 1}. ${t}`)
                        .reduce((acc, curr, i) => {
                          if (i % 2 === 0) acc.push([]); // Create a new row every 2 items
                          acc[acc.length - 1].push(curr);
                          return acc;
                        }, [])
                        .map((row, index) => (
                          <div key={index}>{row.join(", ")}</div> // Each row has 2 names
                        ))}
                    </Typography>
                  </FormControl>
                </Grid>
              </>

            </Grid>
            <br />
            <br /> <br />
            <br />
            <Grid container spacing={2} sx={{ marginLeft: "3px" }}>
              <Button
                sx={buttonStyles.btncancel}
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
      <Dialog
        open={openviewed}
        onClose={handleClickOpenviewed}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
      // fullWidth={true}
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              <b>Are You Sure You Want To Download All..?</b>
            </Typography>
            <br /> <br />
            <Grid
              container
              spacing={2}
              sx={{ marginLeft: "3px", display: "flex" }}
            >
              <Grid item md={4} xs={12} sm={12}>
                <LoadingButton
                  variant="contained"
                  color="primary"
                  sx={buttonStyles?.buttonsubmit}
                  onClick={(e) => {
                    downloadPdfTesdt();
                  }}
                  loading={viewsetdata}
                >
                  Download
                </LoadingButton>


              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <Button
                  sx={buttonStyles.btncancel}
                  variant="contained"
                  color="primary"
                  onClick={handleCloseviewed}
                >
                  Back
                </Button>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <Typography>

                  <div
                    style={{
                      gap: "10px",
                      display: 'none',
                      flexWrap: 'wrap'
                    }}
                    ref={componentRef2}
                  >
                    {displayedCode?.map((d, index) => (
                      <div style={{ flex: '1 1 20%', width: "75px", boxSizing: 'border-box', padding: '150px 10px 250px 10px' }}>
                        <div
                          style={{
                            border: "1px solid black",
                            width: "151px", // Fixed width
                            height: "300px", // Fixed height
                            borderRadius: "3px",
                          }}
                        >
                          <div>
                            <img
                              style={{
                                width: "149px", // Fixed width
                                height: "100px", // Fixed height
                                // objectFit: "cover",
                              }}
                              src={viewfrontheader}
                            />
                          </div>
                          <div style={{ marginTop: "20px" }}></div>

                          <div>
                            <img
                              style={{
                                display: "block",
                                margin: "0 auto",
                                objectFit: "cover",
                                border: "2px solid black",
                                borderRadius: "4px",
                                width: "55px", // Fixed width
                                height: "75px", // Fixed height

                              }}
                              src={d.profileimage ? d.profileimage : placeholderImage}
                            />
                          </div>

                          <div style={{ marginTop: "15px" }}></div>
                          <div
                            style={{
                              textAlign: "center",
                              fontSize: `${setMaxFontSize(d.legalname)}px`, // Fixed font size
                              color: "black",
                              height: "12px",
                              fontWeight: "bold",
                              fontFamily: "sans-serif",
                            }}
                          >
                            <span
                              style={{
                                textTransform: "uppercase",
                                fontWeight: "bolder",
                                color: "black",

                                fontFamily: "sans-serif",
                              }}
                            >
                              {d.legalname}
                            </span>
                          </div>
                          <div style={{ marginTop: "0.5px", height: "0.5px", }}></div>

                          <div style={{
                            textAlign: "center",
                            fontSize: `${setMaxFontSizenew(d.callingname)}px`, // Fixed font size
                            color: "black",
                            height: "12px",
                            fontWeight: "bold",
                            fontFamily: "sans-serif",
                          }}>
                            <span
                              style={{
                                textTransform: "uppercase",
                                // fontWeight: "bolder",

                                fontFamily: "sans-serif"
                              }}
                            >
                              ({d.callingname})
                            </span>
                          </div>

                          <div style={{ marginTop: "29px" }}></div>

                          <div
                            style={{
                              display: "flex",
                              position: "fixed",

                              justifyContent: "flex-end",
                              //  marginRight:"100px"
                            }}
                          >
                            <img
                              style={{
                                height: "30px", // Fixed height
                                width: "149px", // Fixed width
                                // objectFit: "cover",


                              }}
                              src={viewfrontfooter}
                            />
                          </div>
                        </div>
                        <br /><br /><br /> <br /><br /><br />
                        <div
                          style={{
                            border: "1px solid black",
                            width: "150px", // Fixed width
                            height: "300px", // Fixed height
                            borderRadius: "3px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                            }}
                          >
                            <img
                              style={{
                                height: "30px", // Fixed height
                                width: "149px", // Fixed width
                                // objectFit: "cover",
                              }}
                              src={viewbackheader}
                            />
                          </div>
                          <div style={{ marginTop: "9px", height: "9px" }}></div>

                          <div
                            style={{
                              fontSize: "8px",
                              height: "8px", // Fixed font size
                              fontWeight: "bold",
                              paddingLeft: "10px",

                              fontFamily: "sans-serif",
                              color: "black",
                            }}
                          >
                            <div>
                              Employee ID :{" "}
                              <span style={{ color: "darkblue" }}>
                                {d.empcode}
                              </span>
                            </div>
                            <div style={{ marginTop: "1px" }}></div>
                            <div>
                              Date of Birth :{" "}
                              <span style={{ color: "darkblue" }}>{d.dob}</span>
                            </div>
                            <div style={{ marginTop: "1px" }}></div>
                            <div>
                              Blood Group :{" "}
                              <span style={{ color: "darkblue" }}>
                                {d.bloodgroup}
                              </span>
                            </div>
                            <div style={{ marginTop: "1px" }}></div>
                            <div>
                              Emergency Contact(s):{" "}
                              <span style={{ color: "darkblue" }}>
                                {d.emergencyno}
                              </span>
                            </div>
                          </div>

                          <div style={{ height: "15px", marginTop: "15px" }}></div>
                          <br />

                          <div
                            style={{
                              fontFamily: "neuropol",
                              color: "darkblue",
                              fontSize: "8px",
                              height: "8px", // Fixed font size
                              textAlign: "center",
                              fontWeight: "bolder",
                            }}
                          >
                            {newcomp}
                          </div>
                          <div style={{ height: "10px", marginTop: "10px" }}></div>

                          <div
                            style={{
                              fontSize: "8px",
                              height: "8px", // Fixed font size
                              textAlign: "center",
                              fontWeight: "bolder",
                              fontFamily: "sans-serif",
                              color: "black",
                            }}
                          >
                            {newadd}
                          </div>
                          <div style={{ height: "10px", marginTop: "10px" }}></div>

                          <div
                            style={{
                              fontSize: "8px",
                              height: "8px",
                              // Fixed font size
                              color: "orange",
                              textAlign: "center",
                              fontFamily: "sans-serif",
                            }}
                          >
                            {newcomurl}
                          </div>
                          <div style={{ height: "10px", marginTop: "10px" }}></div>
                          <div style={{ fontWeight: "bold" }}>
                            <hr />
                          </div>
                          <div style={{ height: "10px", marginTop: "10px" }}></div>

                          <div
                            style={{
                              textAlign: "center",
                              fontSize: "9px", // Fixed font size
                              fontFamily: "sans-serif",
                              color: "black",
                            }}
                          >
                            {"This card is a property"}
                          </div>
                          <div style={{ height: "0.5px" }}></div>
                          <div
                            style={{
                              fontFamily: "neuropol",
                              color: "darkblue",
                              textAlign: "center",
                              fontSize: "9px", // Fixed font size
                              fontWeight: "bolder",
                            }}
                          >
                            {newcomp}
                          </div>
                          <div style={{ height: "0.8px", marginTop: "0.8px" }}></div>
                          <div
                            style={{
                              textAlign: "center",
                              fontSize: "9px", // Fixed font size
                              fontFamily: "sans-serif",
                              color: "black",
                            }}
                          >
                            {"If found, please return to the above address"}
                          </div>
                          <div style={{ height: "8px", marginTop: "2px" }}></div>
                          <div
                            style={{
                              display: "flex",

                              justifyContent: "flex-end",
                              // marginRight:"100px"
                            }}
                          >
                            <img
                              style={{
                                height: "30px", // Fixed height
                                width: "148px", // Fixed width

                                // objectFit: "cover",

                              }}
                              src={viewbackfooter}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Typography>
              </Grid>
            </Grid>
          </>
        </Box>
      </Dialog>

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
      <br />

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
        itemsTwo={items ?? []}
        filename={"IdCard Template"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="ID Card Preparation Info"
        addedby={addedby}
        updateby={updateby}
      />


      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={(e) => delBrand(brandid)}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={delAreagrpcheckbox}
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
    </Box>
  );
}

export default Createidcard;