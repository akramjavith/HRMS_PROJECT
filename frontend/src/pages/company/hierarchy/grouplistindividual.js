import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, Checkbox, OutlinedInput, TableBody, TableRow, List, ListItem, ListItemText, Popover, TextField, IconButton, TableCell, Select, Paper, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaFileCsv, FaFileExcel, FaPrint, FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Selects from "react-select";
import axios from "axios";
import Headtitle from "../../../components/Headtitle";
import PageHeading from "../../../components/PageHeading";
import { ThreeDots } from "react-loader-spinner";
import { handleApiError } from "../../../components/Errorhandling";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import StyledDataGrid from "../../../components/TableStyle";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import CloseIcon from "@mui/icons-material/Close";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AlertDialog from "../../../components/Alert";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../../components/DeleteConfirmation.js";
import ExportData from "../../../components/ExportData";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert";
import domtoimage from 'dom-to-image';
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
function AssignedgroupIndividual() {
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTable = useRef(null);
  const [loading, setLoading] = useState(false);
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

  let exportColumnNames = ['Designationgroup',
    'Department',
    'Company',
    'Branch',
    'Unit',
    'Team',
    'Employee Name',
    'Supervisor Name',
    'Mode',
    'Level',
    'Control Name',
    'Module Control'];
  let exportRowValues = [
    'designationgroup',
    'department',
    'company',
    'branch',
    'unit',
    'team',
    'employeename',
    'supervisorchoose',
    'mode',
    'level',
    'control',
    'pagecontrols'
  ];

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
      pagename: String("Setup/Hierarchy/Hierarchy Group List Individual"),
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



  const [groupListIndividual, setGroupListIndividual] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess, allUsersData, alldesignation, pageName,
    setPageName,
    buttonStyles, } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [hierarchyList, setHierarchyList] = useState([]);
  const [showAlert, setShowAlert] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  // clipboard
  const [changesupervisor, setChangeSupervisor] = useState("Please Select Change/Replace");

  // State for manage columns search query
  const [searchQueryManageIndividual, setSearchQueryManageIndividual] = useState("");
  // Manage Columns
  const [isManageColumnsOpenIndividual, setManageColumnsOpenIndividual] = useState(false);
  const [anchorElIndividual, setAnchorElIndividual] = useState(null);
  const handleOpenManageColumnsIndividual = (event) => {
    setAnchorElIndividual(event.currentTarget);
    setManageColumnsOpenIndividual(true);
  };
  const handleCloseManageColumnsIndividual = () => {
    setManageColumnsOpenIndividual(false);
    setSearchQueryManageIndividual("");
  };

  const openIndividual = Boolean(anchorElIndividual);
  const id = openIndividual ? "simple-popover" : undefined;


  const [overallExcelDatas, setOverallExcelDatas] = useState([])
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  const [fileFormat, setFormat] = useState('')
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = fileFormat === "xl" ? '.xlsx' : '.csv';
  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };


  //get all project.
  const fetchAllApprovedsIndividual = async () => {
    setPageName(!pageName);
    try {
      setLoading(true)
      let res_queue = await axios.get(SERVICE.HIRERARCHI_GROU_LIST_INDIVIDUAL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setHierarchyList(res_queue?.data?.hirerarchi);
          // Info End
      let snos = 1;
      // this is the etimation concadination value
      const modifiedDataIndividual = res_queue?.data?.resultGroup?.length > 0 ?
      res_queue?.data?.resultGroup?.map((person) => ({
        ...person,
        sino: snos++,
      })) : [];
      const answer = modifiedDataIndividual?.length > 0 ? modifiedDataIndividual?.map((item, index) => ({
        ...item, serialNumber: index + 1, supervisorchoose: item.supervisorchoose.join(","),
        pagecontrols: item?.pagecontrols?.join(", "),
      })) : [];

      setGroupListIndividual(answer);

      setLoading(false)
    } catch (err) {  setLoading(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  useEffect(() => {
    fetchAllApprovedsIndividual();
  }, []);



  //serial no for listing items
  const addSerialNumber = (data) => {
    setItems(data);
  };

  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChangeIndividual = (event) => {
    setPageSize(Number(event.target.value));
    setPage(1);
  };

  //datatable....
  const handleSearchChangeIndividual = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  // Split the search query into individual terms
  const searchOverTerms = searchQuery.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchOverTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(filteredDatas?.length / pageSize);

  const visiblePages = Math.min(totalPages, 3);

  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);
  const pageNumbers = [];


  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }
  useEffect(() => {
    addSerialNumber(groupListIndividual);
  }, [groupListIndividual]);

  const fileName = "AssignedGroupListIndividual";

  //image
  const gridRefTableImg = useRef(null);
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Assigned Group List Individual.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };


  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "AssignedGroupIndividual",
    pageStyle: "print",
  });

  const [openInfoindividual, setOpeninfoindividual] = useState(false);
  const handleClickOpeninfoindividual = () => {
    setOpeninfoindividual(true);
  };
  const handleCloseinfoindividual = () => {
    setOpeninfoindividual(false);
    setSuperVisorChoosen("Please Select SuperVisor");
    setChangeSupervisor("Please Select Change/Replace");
  };

  const [hirerarchiIndividual, setHirerarchiIndividual] = useState({
    employeename: "",
    supervisorchoose: "",
    mode: "Please Select Mode",
    level: "Please Select Sector",
    control: "",
  });
  const getCodeIndividual = async (e, name) => {
    setPageName(!pageName);
    try {

      let ans = groupListIndividual.filter((data) => data._id === e && data.employeename.includes(name));
      setHirerarchiIndividual(ans[0]);
      handleClickOpeninfoindividual();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const [groupListEdit, setSetGroupListEdit] = useState([]);
  //get all project.
  const Edit = async (e) => {
    setPageName(!pageName);
    try {

      let res_queue = await axios.get(SERVICE.HIRERARCHI, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let groupList = res_queue?.data?.hirerarchi.filter((data, i) => data._id !== e);
      setSetGroupListEdit(groupList);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  // fetch unit wise data from Team
  const [supervisorIndividual, setSupervisorIndividual] = useState([]);
  const [superVisorChoosen, setSuperVisorChoosen] = useState("Please Select SuperVisor");
  const fetchAllUsersList = async () => {
    setPageName(!pageName);
    try {


      let Designation = allUsersData.find((item) => {
        return hirerarchiIndividual.supervisorchoose.includes(item.companyname);
      });
      let filteredData = allUsersData.filter((item) => {
        return !hirerarchiIndividual.supervisorchoose.includes(item.companyname) && Designation.designation === item.designation;
      });

      let ans = filteredData?.map((t) => ({
        label: t.companyname,
        value: t.companyname,
      }));
      setSupervisorIndividual(ans);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const changeTo = [
    { label: "Add One More", value: "Add One More" },
    { label: "Replace", value: "Replace" },
  ];

  const modeopt = [
    { label: "Only", value: "Only" },
    { label: "All", value: "All" },
  ];

  const [onChangeSuperVisor, setOnChangeSuperVisior] = useState([]);

  const handleOnChangeSuperVisor = (supervisor) => {
    if (changesupervisor === "Replace") {
      setOnChangeSuperVisior(supervisor);
    }
    if (changesupervisor === "Add One More") {
      setOnChangeSuperVisior([supervisor, hirerarchiIndividual.supervisorchoose]);
    }
  };

  let updateby = hirerarchiIndividual?.updatedby;
  const username = isUserRoleAccess?.username;

  const usernameaddedby = isUserRoleAccess?.companyname;

  //submitting the form
  const fetchOnChangeCheck = async () => {
    setPageName(!pageName);
    try {

      //if the mode is ONLY
      const supervisorchoose = changesupervisor === "Replace" ? [onChangeSuperVisor] : changesupervisor === "Add One More" ? onChangeSuperVisor : hirerarchiIndividual.supervisorchoose;

      if (hirerarchiIndividual.mode === "Only") {
        let res = await axios.put(`${SERVICE.HIRERARCHI_SINGLE}/${hirerarchiIndividual._id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          supervisorchoose: supervisorchoose,
          mode: String(hirerarchiIndividual.mode),

          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        });
        setSuperVisorChoosen("Please Select SuperVisor");
        setChangeSupervisor("Please Select Change/Replace");
        setOnChangeSuperVisior([]);
        await fetchAllApprovedsIndividual();
        handleCloseinfoindividual();
        setPopupContent('Updated Successfully');
        setPopupSeverity("success");
        handleClickOpenPopup();
        setSearchQuery("")
      }

      if (hirerarchiIndividual.mode === "All") {
        const matchingItems = hierarchyList.filter((item) => item.supervisorchoose.some((name) => hirerarchiIndividual.supervisorchoose.includes(name)));
        const matchingEmpSupervisior = hierarchyList.filter((item) => item.employeename.some((name) => hirerarchiIndividual.supervisorchoose.includes(name)));

        // //matching items (checking the supervisor is same)
        if (matchingItems.length > 0) {
          let answ = matchingItems.map((d, i) => {
            //chooosing dataID matches with the matches data
            if (d._id === hirerarchiIndividual._id) {
              let res = axios.put(`${SERVICE.HIRERARCHI_SINGLE}/${d._id}`, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
                supervisorchoose: changesupervisor === "Replace" ? onChangeSuperVisor : changesupervisor === "Add One More" ? onChangeSuperVisor : hirerarchiIndividual.supervisorchoose,
                mode: String(hirerarchiIndividual.mode),
                updatedby: [
                  ...updateby,
                  {
                    name: String(isUserRoleAccess.companyname),
                    date: String(new Date()),
                  },
                ],
              });
              setSuperVisorChoosen("Please Select SuperVisor");
              setChangeSupervisor("Please Select Change/Replace");
              setOnChangeSuperVisior([]);
              fetchAllApprovedsIndividual();
              handleCloseinfoindividual();
              setPopupContent('Updated Successfully');
              setPopupSeverity("success");
              handleClickOpenPopup();
            } else {
              //chooosing dataID matches with the not-matches the data
              const supervisorchoose = changesupervisor === "Replace" ? [onChangeSuperVisor] : changesupervisor === "Add One More" ? onChangeSuperVisor : hirerarchiIndividual.supervisorchoose;
              const checkName = d.employeename.some((data) => supervisorchoose.includes(data));
              //if the employee name in other datas matched wit the supervisor name what we are choosing
              if (!checkName) {
                let res = axios.put(`${SERVICE.HIRERARCHI_SINGLE}/${d._id}`, {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },
                  supervisorchoose: changesupervisor === "Replace" ? onChangeSuperVisor : changesupervisor === "Add One More" ? onChangeSuperVisor : hirerarchiIndividual.supervisorchoose,
                  updatedby: [
                    ...updateby,
                    {
                      name: String(isUserRoleAccess.companyname),
                      date: String(new Date()),
                    },
                  ],
                });
                setSuperVisorChoosen("Please Select SuperVisor");
                setChangeSupervisor("Please Select Change/Replace");
                setOnChangeSuperVisior([]);
                fetchAllApprovedsIndividual();
                handleCloseinfoindividual();
              } else if (checkName) {
                setPopupContentMalert('Employee Names also Same');
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
              }
            }
          });
        }
        //Updating the Employeename also
        if (matchingEmpSupervisior.length > 0) {
          let answ = matchingEmpSupervisior.map((d, i) => {
            //chooosing dataID matches with the matches data
            const supervisorchoose = changesupervisor === "Replace" ? [onChangeSuperVisor] : changesupervisor === "Add One More" ? onChangeSuperVisor : hirerarchiIndividual.supervisorchoose;
            const checkName = d.supervisorchoose.some((data) => supervisorchoose.includes(data));
            const newArray = d.employeename.filter((item) => !hirerarchiIndividual.supervisorchoose.includes(item));
            const ans = typeof (changesupervisor === "Replace" ? onChangeSuperVisor : changesupervisor === "Add One More" ? onChangeSuperVisor : hirerarchiIndividual.supervisorchoose);
            const overallAns = changesupervisor === "Replace" ? onChangeSuperVisor : changesupervisor === "Add One More" ? onChangeSuperVisor : hirerarchiIndividual.supervisorchoose;
            const TypeOFObject = ans === "string" ? [...newArray, overallAns] : [...newArray, ...overallAns];
            const idCheck = hierarchyList.some((data) => TypeOFObject.some((item) => data.employeename.includes(item)) && data.level === hirerarchiIndividual.level && data.control === hirerarchiIndividual.control);
            if (!checkName && d._id !== hirerarchiIndividual._id && changesupervisor === "Replace" && !idCheck) {
              let res = axios.put(`${SERVICE.HIRERARCHI_SINGLE}/${d._id}`, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
                employeename: TypeOFObject,
                updatedby: [
                  ...updateby,
                  {
                    name: String(isUserRoleAccess.companyname),
                    date: String(new Date()),
                  },
                ],
              });
              setSuperVisorChoosen("Please Select SuperVisor");
              setChangeSupervisor("Please Select Change/Replace");
              setOnChangeSuperVisior([]);
              fetchAllApprovedsIndividual();
              handleCloseinfoindividual();
              setPopupContent('Updated Successfully');
              setPopupSeverity("success");
              handleClickOpenPopup();
            } else if (!checkName && d._id !== hirerarchiIndividual._id && changesupervisor === "Add One More" && !idCheck) {
              let res = axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
                company: d.company,
                designationgroup: d.designationgroup,
                department: d.department,
                branch: d.branch,
                unit: d.unit,
                team: d.team,
                supervisorchoose: d.supervisorchoose,
                mode: d.mode,
                level: d.level,
                control: d.control,
                employeename: superVisorChoosen,
                empbranch: d.empbranch,
                empunit: d.empunit,
                empteam: d.empteam,
                addedby: [
                  {
                    name: String(usernameaddedby),
                    date: String(new Date()),
                  },
                ],
              });
              setSuperVisorChoosen("Please Select SuperVisor");
              setChangeSupervisor("Please Select Change/Replace");
              setOnChangeSuperVisior([]);
              fetchAllApprovedsIndividual();
              handleCloseinfoindividual();
              setPopupContent('Updated Successfully');
              setPopupSeverity("success");
              handleClickOpenPopup();
            } else if (idCheck) {
              setPopupContentMalert('Data Already Present');
              setPopupSeverityMalert("info");
              handleClickOpenPopupMalert();
            }
          });
        } else {
          let res = await axios.put(`${SERVICE.HIRERARCHI_SINGLE}/${hirerarchiIndividual._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            supervisorchoose: changesupervisor === "Replace" ? onChangeSuperVisor : changesupervisor === "Add One More" ? onChangeSuperVisor : hirerarchiIndividual.supervisorchoose,
            mode: String(hirerarchiIndividual.mode),
            updatedby: [
              ...updateby,
              {
                name: String(isUserRoleAccess.companyname),
                date: String(new Date()),
              },
            ],
          });
          setSuperVisorChoosen("Please Select SuperVisor");
          setChangeSupervisor("Please Select Change/Replace");
          setOnChangeSuperVisior([]);
          await fetchAllApprovedsIndividual();
          handleCloseinfoindividual();
          setPopupContent('Updated Successfully');
          setPopupSeverity("success");
          handleClickOpenPopup();
        }

      }
      setSearchQuery("")
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //checking the Duplicate conditions
  const checkOnChangeFilter = () => {
    const supervisorchoose = changesupervisor === "Replace" ? [onChangeSuperVisor] : changesupervisor === "Add One More" ? onChangeSuperVisor : hirerarchiIndividual.supervisorchoose;
    const SameSupEmpMode = groupListEdit.some((data) => supervisorchoose.includes(data.supervisorchoose) && hirerarchiIndividual.level === data.level && data.employeename.includes(hirerarchiIndividual.employeename) && hirerarchiIndividual.mode === data.mode);

    const SSupEmpModDiffSec = groupListEdit.some((data) => supervisorchoose.includes(data.supervisorchoose) && data.employeename.includes(hirerarchiIndividual.employeename) && hirerarchiIndividual.mode === data.mode);

    const SEmpDiffSupModSec = groupListEdit.some((data) => hirerarchiIndividual.mode === data.mode && data.employeename.includes(hirerarchiIndividual.employeename) && hirerarchiIndividual.level === data.level);

    const checkingOnChange = changesupervisor === "Replace" ? onChangeSuperVisor : changesupervisor === "Add One More" ? onChangeSuperVisor : [];
    const same = [...new Set(supervisorchoose)].length !== supervisorchoose.length;

 if (changesupervisor === "Please Select Change/Replace") {
      setPopupContentMalert('Please Choose Change to');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (changesupervisor === "Replace" && checkingOnChange.length == 0) {
      setPopupContentMalert('Please Choose Supervisor');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();


    } else if (changesupervisor === "Add One More" && checkingOnChange.length == 0) {
      setPopupContentMalert('Please Choose Supervisor');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } 
        else if (same) {
      setPopupContentMalert("SuperVisor's are Same , Choose Different");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } 
    else if (onChangeSuperVisor.length > 0 && supervisorchoose?.some((element) => hirerarchiIndividual.employeename.includes(element))) {
      setPopupContentMalert('superVisor and Employee name are Same');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (SameSupEmpMode) {
      setPopupContentMalert('Employee Name , SuperVisior Choose , Mode , Sector Are Same ');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (SSupEmpModDiffSec) {
      setPopupContentMalert('Employee Name , SuperVisior Choose , Mode Are Same');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (SEmpDiffSupModSec) {
      setPopupContentMalert('Employee Name , SuperVisior Choose , Sector Are Same');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      fetchOnChangeCheck();
    }
  };



  // Show All Columns & Manage Columns
  const initialColumnVisibilityIndividual = {
    checkbox: true,
    serialNumber: true,
    designationgroup: true,
    department: true,
    company: true,
    branch: true,
    unit: true,
    team: true,
    employeename: true,
    supervisorchoose: true,
    mode: true,
    level: true,
    control: true,
    action: true, pagecontrols: true
  };
  const [columnVisibilityIndividual, setColumnVisibilityIndividual] = useState(initialColumnVisibilityIndividual);
  useEffect(() => {
    localStorage.setItem("columnVisibilityIndividual", JSON.stringify(columnVisibilityIndividual));
}, [columnVisibilityIndividual]);


  const [selectAllCheckedIndividual, setSelectAllCheckedIndividual] = useState(false);
  const [selectedRowsIndividual, setSelectedRowsIndividual] = useState([]);

  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );


  useEffect(() => {
    const savedVisibility = localStorage.getItem("columnVisibilityIndividual");
    if (savedVisibility) {
        setColumnVisibilityIndividual(JSON.parse(savedVisibility));
    }
}, []);

  const columnDataTableIndividual = [
    {
      field: "checkbox",
      headerName: "Checkbox", // Default header name
      headerStyle: {
        fontWeight: "bold", // Apply the font-weight style to make the header text bold
        // Add any other CSS styles as needed
      },

      sortable: false, // Optionally, you can make this column not sortable
      width: 70,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      hide: !columnVisibilityIndividual.checkbox,
      headerClassName: "bold-header",
      pinned: "left",
      //lockPinned: true,
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 70,
      hide: !columnVisibilityIndividual.serialNumber,
      headerClassName: "bold-header",
      pinned: "left",
      //lockPinned: true,
    },
    { field: "designationgroup", headerName: "Designation Group", flex: 0, width: 100, hide: !columnVisibilityIndividual.designationgroup, headerClassName: "bold-header" },
    { field: "department", headerName: "Department", flex: 0, width: 120, hide: !columnVisibilityIndividual.department, department: "bold-header" },
    { field: "company", headerName: "Company", flex: 0, width: 120, hide: !columnVisibilityIndividual.company, headerClassName: "bold-header" },
    { field: "branch", headerName: "Branch", flex: 0, width: 150, hide: !columnVisibilityIndividual.branch, headerClassName: "bold-header" },
    { field: "unit", headerName: "Unit", flex: 0, width: 120, hide: !columnVisibilityIndividual.unit, headerClassName: "bold-header" },
    { field: "team", headerName: "Team", flex: 0, width: 120, hide: !columnVisibilityIndividual.team, headerClassName: "bold-header" },
    { field: "employeename", headerName: "Employee name", flex: 0, width: 250, hide: !columnVisibilityIndividual.employeename, headerClassName: "bold-header" },
    { field: "supervisorchoose", headerName: "Super Visor Choose", flex: 0, width: 250, hide: !columnVisibilityIndividual.supervisorchoose, headerClassName: "bold-header" },
    { field: "mode", headerName: "Mode", flex: 0, width: 75, hide: !columnVisibilityIndividual.mode, headerClassName: "bold-header" },
    { field: "level", headerName: "Level", flex: 0, width: 100, hide: !columnVisibilityIndividual.level, headerClassName: "bold-header" },
    { field: "control", headerName: "Control", flex: 0, width: 80, hide: !columnVisibilityIndividual.control, headerClassName: "bold-header" },
    { field: "pagecontrols", headerName: "Module Control", flex: 0, width: 150, hide: !columnVisibilityIndividual.pagecontrols, headerClassName: "bold-header" },
    {
      field: "action",
      headerName: "Action",
      flex: 0,
      width: 100,
      hide: !columnVisibilityIndividual.action,
      headerClassName: "bold-header",
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("ehierarchygroupindividual") && (
            <Button
              sx={buttonStyles.buttonsubmit}
              variant="contained"
              onClick={() => {
              
                Edit(params.data.dataid);
                getCodeIndividual(params.data.dataid, params.data.employeename);
              }}
            >
              Change
            </Button>
          )}
        </Grid>
      ),
    },
  ];

  // Create a row data object for the DataGrid
  const rowDataTableIndividual = filteredData.map((item, index) => {
    return {
      id: item.serialNumber,
      serialNumber: item.serialNumber,
      dataid: item._id,
      designationgroup: item.designationgroup,
      department: item.department,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      team: item?.team,
      employeename: item.employeename,
      supervisorchoose: item.supervisorchoose,
      pagecontrols: item?.pagecontrols,
      mode: item.mode,
      level: item.level,
      control: item.control,

    };
  });

  const handleShowAllColumnsIndividual = () => {
    const updatedVisibility = { ...columnVisibilityIndividual };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibilityIndividual(updatedVisibility);
  };

  // Manage Columns functionality
  const toggleColumnVisibilityIndividual = (field) => {
    setColumnVisibilityIndividual((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  // Function to filter columns based on search query
  const filteredColumnsIndividual = columnDataTableIndividual.filter((column) => column.headerName.toLowerCase().includes(searchQueryManageIndividual.toLowerCase()));

  // JSX for the "Manage Columns" popover content
  const manageColumnsContentIndividual = (
    <Box sx={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
      <Typography variant="h6">Manage Columns</Typography>
      <IconButton
        aria-label="close"
        onClick={handleCloseManageColumnsIndividual}
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
        <TextField label="Find column" variant="standard" fullWidth value={searchQueryManageIndividual} onChange={(e) => setSearchQueryManageIndividual(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
      </Box>
      <br />
      <br />
      <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumnsIndividual.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibilityIndividual[column.field]} onChange={() => toggleColumnVisibilityIndividual(column.field)} />}
                secondary={column.field === "checkbox" ? "Checkbox" : column.headerName}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Grid container>
          <Grid item md={4}>
            <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibilityIndividual(initialColumnVisibilityIndividual)}>
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
                columnDataTableIndividual.forEach((column) => {
                  newColumnVisibility[column.field] = false; // Set hide property to true
                });
                setColumnVisibilityIndividual(newColumnVisibility);
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

  return (
    <>
      <Headtitle title={"Hierarchy Group Individual"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Hierarchy Group Individual"
        modulename="Setup"
        submodulename="Hierarchy"
        mainpagename="Hierarchy Group Individual"
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("lhierarchygroupindividual") && (
        <Box sx={userStyle.selectcontainer}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Typography sx={userStyle.importheadtext}>
              <b>Assigned Group List Individual</b>
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
                  onChange={handlePageSizeChangeIndividual}
                  sx={{ width: "77px" }}
                >
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                  <MenuItem value={groupListIndividual?.length}>All</MenuItem>
                </Select>
              </Box>
            </Grid>
            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Grid>
                {isUserRoleCompare?.includes("excelhierarchygroupindividual") &&
                  (
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                   
                        setFormat("xl")
                      }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                    </>
                  )

                }
                {isUserRoleCompare?.includes("csvhierarchygroupindividual") &&
                  (
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                      
                        setFormat("csv")
                      }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                    </>
                  )
                }
                {isUserRoleCompare?.includes("printhierarchygroupindividual") && (
                  <Button sx={userStyle.buttongrp} onClick={handleprint}>
                    &ensp;
                    <FaPrint />
                    &ensp;Print&ensp;
                  </Button>
                )}

                {isUserRoleCompare?.includes("pdfhierarchygroupindividual") && (

                  <>
                    <Button sx={userStyle.buttongrp}
                      onClick={() => {
                        setIsPdfFilterOpen(true)
                    
                      }}                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                  </>
                )}
                {isUserRoleCompare?.includes("imagehierarchygroupindividual") && (
                  <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                    {" "}
                    <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                  </Button>
                )}
              </Grid>
            </Grid>
            <Grid item md={2} xs={12} sm={12}>
                <AggregatedSearchBar
                  columnDataTable={columnDataTableIndividual}
                  setItems={setItems}
                  addSerialNumber={addSerialNumber}
                  setPage={setPage}
                  maindatas={groupListIndividual}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQueryManageIndividual}
                  setSearchQuery={setSearchQueryManageIndividual}
                  paginated={false}
                  totalDatas={groupListIndividual}
                />
              </Grid>
           
          </Grid>
          <br />
          <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsIndividual}>
            Show All Columns
          </Button>
          &ensp;
          <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsIndividual}>
            Manage Columns
          </Button>
          <br />
          <br />
          {loading ?
            (
              <>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                </Box>
                <br />
              </>
            )
            :

          <Box style={{ width: "100%", overflowY: "hidden" }}> 
            <AggridTable
                  rowDataTable={rowDataTableIndividual}
                  columnDataTable={columnDataTableIndividual}
                  columnVisibility={columnVisibilityIndividual}
                  page={page}
                  setPage={setPage}
                  pageSize={pageSize}
                  totalPages={totalPages}
                  setColumnVisibility={setColumnVisibilityIndividual}
                  isHandleChange={isHandleChange}
                  items={groupListIndividual}
                  selectedRows={selectedRowsIndividual}
                  setSelectedRows={setSelectedRowsIndividual}
                  gridRefTable={gridRefTable}
                  paginated={false}
                  filteredDatas={filteredDatas}
                  // totalDatas={totalProjects}
                  searchQuery={searchedString}
                  handleShowAllColumns={handleShowAllColumnsIndividual}
                  setFilteredRowData={setFilteredRowData}
                  filteredRowData={filteredRowData}
                  setFilteredChanges={setFilteredChanges}
                  filteredChanges={filteredChanges}
                  gridRefTableImg={gridRefTableImg}
                  itemsList={groupListIndividual}
                />
          </Box>
}
          {/* Manage Column */}
          <Popover
            id={id}
            open={isManageColumnsOpenIndividual}
            anchorEl={anchorElIndividual}
            onClose={handleCloseManageColumnsIndividual}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            {manageColumnsContentIndividual}
          </Popover>

     



          <Dialog open={openInfoindividual} 
          onClose={handleCloseinfoindividual}
           aria-labelledby="alert-dialog-title" 
           aria-describedby="alert-dialog-description" 
           maxWidth="lg" 
           fullWidth={true} 
           sx={{ margintTop: "40px" }}>
            <Box sx={[{ padding: "20px 50px" }, userStyle.dialogbox]}>
              <>
                <Typography sx={userStyle.HeaderText}>Hierarchy Individual Change</Typography>
                <br />
                <br />
                <Grid container spacing={2}>
                  <Grid item md={4} xs={6} sm={6}>
                    <Typography>Supervisor Choose</Typography>
                    <FormControl fullWidth size="small">
                      <OutlinedInput id="component-outlined" type="text" value={superVisorChoosen === "Please Select SuperVisor" ? hirerarchiIndividual?.supervisorchoose : onChangeSuperVisor} />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Change To<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={changeTo}
                        value={{ label: changesupervisor, value: changesupervisor }}
                        onChange={(e) => {
                          setChangeSupervisor(e.value);
                          setSuperVisorChoosen("Please Select SuperVisor");
                          setOnChangeSuperVisior([]);
                          fetchAllUsersList();
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Choose SuperVisor <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={supervisorIndividual}
                        value={{ label: superVisorChoosen, value: superVisorChoosen }}
                        onChange={(e) => {
                          setSuperVisorChoosen(e.value);
                          handleOnChangeSuperVisor(e.value);
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <br></br>
                <br></br>
                <Grid container spacing={2}>
                  <Grid item md={3} xs={6} sm={6}>
                    <Typography>Employee Name</Typography>
                    <FormControl fullWidth size="small">
                      <OutlinedInput id="component-outlined" type="text" value={hirerarchiIndividual?.employeename} />
                    </FormControl>
                  </Grid>
                  <Grid item md={2} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Mode</Typography>
                      <Selects
                        options={modeopt}
                        value={{ label: hirerarchiIndividual?.mode, value: hirerarchiIndividual?.mode }}
                        onChange={(e) => {
                          setHirerarchiIndividual({
                            ...hirerarchiIndividual,
                            mode: e.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={2} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Sector</Typography>
                      <OutlinedInput id="component-outlined" type="text" value={hirerarchiIndividual?.level} />
                    </FormControl>
                  </Grid>
                  <Grid item md={2} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Control</Typography>
                      <OutlinedInput id="component-outlined" type="text" value={hirerarchiIndividual?.control} />
                    </FormControl>
                  </Grid>
                  <Grid item md={2} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Module Control</Typography>
                      <OutlinedInput id="component-outlined" type="text" value={hirerarchiIndividual?.pagecontrols} />
                    </FormControl>
                  </Grid>
                </Grid>
                <br></br> <br></br>
                <Grid container spacing={2} sx={{ display: "flex" }}>
                  <Grid item md={4} xs={12} sm={6}>
                    <Button
                      variant="contained"
                      sx={buttonStyles.buttonsubmit}
                      onClick={checkOnChangeFilter}
                    >
                      Update
                    </Button>
                  </Grid>
                  <Grid item md={4} xs={12} sm={6}>
                    <Button
                      sx={buttonStyles.btncancel}
                      onClick={handleCloseinfoindividual}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </>
            </Box>
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
            filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTableIndividual) ?? []}
            itemsTwo={groupListIndividual ?? []}
            filename={"Assigned Group List Individual"}
            exportColumnNames={exportColumnNames}
            exportRowValues={exportRowValues}
            componentRef={componentRef}
          />
          {/* Edit Alert End */}
        </Box>
      )}
    </>
  );
}

export default AssignedgroupIndividual;