import React, { useState, useEffect, useRef, useContext } from 'react';
import { Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from '@mui/material';
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from 'react-icons/fa';
import { userStyle } from '../../../pageStyle';
// import { ExportXL, ExportCSV } from "../../components/Export";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';
import { SERVICE } from '../../../services/Baseservice';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { useReactToPrint } from 'react-to-print';
import moment from 'moment-timezone';
import { UserRoleAccessContext, AuthContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/Headtitle';
import StyledDataGrid from '../../../components/TableStyle';
import { ThreeDots } from 'react-loader-spinner';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
// import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/system';
// import Resizable from 'react-resizable';
import { saveAs } from 'file-saver';
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';
import Selects from 'react-select';
import { MultiSelect } from 'react-multi-select-component';
import { Space, TimePicker } from 'antd';
import dayjs from 'dayjs';
import MessageAlert from '../../../components/MessageAlert.js';
import AlertDialog from '../../../components/Alert.js';
import ExportData from '../../../components/ExportData';
import { handleApiError } from '../../../components/Errorhandling';

function OverallReport() {
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState('');
  const [popupSeverityMalert, setPopupSeverityMalert] = useState('');
  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
  };
  const handleClosePopupMalert = () => {
    setOpenPopupMalert(false);
  };
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState('');
  const [popupSeverity, setPopupSeverity] = useState('');
  const handleClickOpenPopup = () => {
    setOpenPopup(true);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const [fileFormat, setFormat] = useState('');

  const PmodeOpt = [
    { label: 'Production', value: 'Production' },
    { label: 'Manual Production', value: 'Manual Production' },
    { label: 'Non Production', value: 'Non Production' },
  ];

  const ShiftOpt = [
    { label: 'Shift Based', value: 'Shift Based' },
    { label: 'Date Based', value: 'Date Based' },
  ];

  const [searchQuery, setSearchQuery] = useState('');

  const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, isAssignBranch, buttonStyles } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);

  const [sourceCheck, setSourcecheck] = useState(false);

  const gridRef = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);

  const [searchQueryManage, setSearchQueryManage] = useState('');

  const [copiedData, setCopiedData] = useState('');

  const [selectedOptionsMode, setSelectedOptionsMode] = useState(PmodeOpt.length > 0 ? [{ label: PmodeOpt[0]?.value, value: PmodeOpt[0]?.value }] : []);

  const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
  const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
  const [selectedOptionsLoginid, setSelectedOptionsLoginid] = useState([]);
  const [selectedOptionsCategory, setSelectedOptionsCategory] = useState([]);
  const [selectedOptionsSubCategory, setSelectedOptionsSubCategory] = useState([]);
  const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
  const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);

  const [projectOpt, setProjmasterOpt] = useState([]);
  const [vendorOpt, setVendormasterOpt] = useState([]);
  const [companyOpt, setCompanyOpt] = useState([]);
  const [branchOption, setBranchOption] = useState([]);
  const [unitOption, setUnitOption] = useState([]);
  const [teamOption, setTeamOption] = useState([]);
  const [employeeOption, setEmployeeOption] = useState([]);
  const [categoryOpt, setCategoryOPt] = useState([]);
  const [subcategory, setSubCategoryOpt] = useState([]);

  const [productionFilter, setProductionFilter] = useState([]);
  const [selectedProject, setSelectedProject] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState([]);
  const [selectedEmployeeFrom, setSelectedEmployeeFrom] = useState([]);
  const [selectedEmployeeUsername, setSelectedEmployeeUsername] = useState([]);

  let [selectedDupe, setSelectedDupe] = useState('With Duplicate');
  let [selectedConversion, setSelectedConversion] = useState('IST');

  //FETCH DATA BATCHWISE
  // const [allData, setAllData] = useState([]);
  const [batchNumber, setBatchNumber] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [isLoadMorePopupOpen, setIsLoadMorePopupOpen] = useState(false);

  const handleLoadMoreClosePopup = () => {
    setIsLoadMorePopupOpen(false); // Close the popup without loading more
  };


  const CustomStyledDataGrid = styled(StyledDataGrid)(({ theme }) => ({
    "& .MuiDataGrid-columnHeaderTitle": {
      fontSize: "14px",
      fontWeight: "bold !important",
      lineHeight: "15px",
      whiteSpace: "normal", // Wrap text within the available space
      overflow: "visible", // Allow overflowed text to be visible
      minWidth: "20px",
    },
    "& .MuiDataGrid-columnHeaders": {
      minHeight: "55px !important",
      // background: "#b7b3b347",
      maxHeight: "55px",
    },
    // "& .MuiDataGrid-row": {
    //   fontSize: "13px", // Change the font size for row data
    //   minWidth: "20px",
    //   color: "#444",
    // },
    // "& .MuiDataGrid-cell": {
    //   whiteSpace: "normal !important",
    //   wordWrap: "break-word !important",
    //   lineHeight: "1.2 !important", // Optional: Adjusts line height for better readability
    // },
    '& .custom-dupe-row': {
      backgroundColor: '#ff00004a !important',
    },
    '& .custom-lateentry': {
      color: '#db2e2e !important',
    },
    '&:hover': {
      '& .custom-dupe-row:hover': {
        backgroundColor: '#ff00004a !important',
      },
      // "& .custom-lateentry:hover": {
      //   color: "#db2e2e !important",
      // },
    },
  }));

  // let exportColumnNames = [
 
  //   'Mode',
  //   'Company',
  //   'Branch',
  //   'Unit',
  //   'Team',
  //   'Vendor',
  //   'Category',
  //   'SubCategory',
  //   'Unit Identifier',

  //   'EmpCode',
  //   'Emp Name',
  //   'LoginId',
  //   'Date',
  //   'CST',

  //   'WorkTook',

  //   'U-Unitrate',
  //   'U-Points',   
  //   'U-Section',
  //   'U-FlagCount',

  //   'A-Unitrate',
  //   'A-Points',  
  //   'A-Section',
  //   'A-FlagCount',

  //   'Total Points',

   
  //   'UserName',
  //   'Dupe',
  // ];
  // let exportRowValues = [
  //   'mode',
  //   'company',
  //   'branch',
  //   'unit',
  //   'team',
  //   'vendor',
  //   'filename',
  //   'category',
  //   'unitid',

  //   'empcode',
  //   'empname',
  //   'user',
  //   'dateval',
  //   'cstist',

  //   'worktook',

  //   'unitrate',
  //   'points', 
  //   'section',
  //   'flagcount',

  //   'cunitrate',
  //   'cpoints',   
  //   'csection',
  //   'cflagcount',
    
  //   'totalpoints',
   
  //   'username',
  //   'dupe',
  // ];

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const handleTimeChange = (time, timeString) => {
    // Check if timeString is a valid time format
    const isValidTime = dayjs(timeString, 'h:mm:ss A').isValid();
    if (isValidTime) {
      setOverallState({
        ...overallState,
        fromtime: dayjs(timeString, 'h:mm:ss A'),
        fromtime24Hrs: dayjs(timeString, 'h:mm:ss A').format('HH:mm:ss'),
      });
    }
  };
  // const [selectedFromdate, setSelectedFromdate] = useState("");
  // const [selectedTodate, setSelectedTodate] = useState("");

  const handleToTimeChange = (time, timeString) => {
    // Check if timeString is a valid time format
    const isValidTime = dayjs(timeString, 'h:mm:ss A').isValid();
    if (isValidTime) {
      setOverallState({
        ...overallState,
        totime: dayjs(timeString, 'h:mm:ss A'),
        totime24Hrs: dayjs(timeString, 'h:mm:ss A').format('HH:mm:ss'),
      });
    }
  };

  let today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd;

  const [loginAllotFilter, setLoginAllotFilter] = useState([]);

  const [overallState, setOverallState] = useState({
    mode: 'Please Select Production Mode',
    project: 'Please Select Project',
    vendor: 'Please Select Vendor',
    fromdate: today,
    alllogin: 'Please Select Login',
    shift: 'Shift Based',
    todate: today,
    // fromtime: "",
    // totime: "",
    fromtime: dayjs('12:00:00 AM', 'h:mm:ss A'),
    totime: dayjs('11:59:59 PM', 'h:mm:ss A'),
    fromtime24Hrs: dayjs('12:00:00 AM', 'h:mm:ss A').format('HH:mm:ss'),
    totime24Hrs: dayjs('11:59:59 PM', 'h:mm:ss A').format('HH:mm:ss'),
  });

  // //get all  company.
  // const fetchCompany = async () => {
    const accessbranch = isUserRoleAccess?.role?.includes('Manager')
      ? []
      : 
        isAssignBranch
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
            // branch: data.branch,
            name: data.company,
            // unit: data.unit,
          }));

  //   try {
  //     let res = await axios.post(SERVICE.COMPANY_LIMITED_BY_ACCESS, {
  //       headers: {
  //         Authorization: `Bearer ${auth.APIToken}`,
  //       },
  //       role: isUserRoleAccess.role,
  //       assignbranch: accessbranch,
  //     });

  //     let companies = [...new Set(res?.data?.companies.map((data) => data.name))].map((name) => ({
  //       label: name,
  //       value: name,
  //     }));
  //     setCompanyOpt(companies);
  //     setSelectedOptionsCompany(companies);
  //     fetchBranchAll(companies);
  //   } catch (err) {
  //     handleApiError(err, setShowAlert, handleClickOpenerr);
  //   }
  // };
  // //get all branch by company.
  // const fetchBranchAll = async (company) => {
  //   const accessbranch = isUserRoleAccess?.role?.includes('Manager')
  //     ? []
  //     : isAssignBranch
  //         ?.filter((data) => {
  //           let fetfinalurl = [];

  //           if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
  //             fetfinalurl = data.subsubpagenameurl;
  //           } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
  //             fetfinalurl = data.subpagenameurl;
  //           } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
  //             fetfinalurl = data.mainpagenameurl;
  //           } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
  //             fetfinalurl = data.submodulenameurl;
  //           } else if (data?.modulenameurl?.length !== 0) {
  //             fetfinalurl = data.modulenameurl;
  //           } else {
  //             fetfinalurl = [];
  //           }

  //           const remove = [window.location.pathname?.substring(1), window.location.pathname];
  //           return fetfinalurl?.some((item) => remove?.includes(item));
  //         })
  //         ?.map((data) => ({
  //           name: data.branch,
  //           company: data.company,
  //           // unit: data.unit,
  //         }));
  //   try {
  //     let res_location = await axios.post(SERVICE.BRANCH_BY_COMPANY_ACCESS, {
  //       headers: {
  //         Authorization: `Bearer ${auth.APIToken}`,
  //       },
  //       role: isUserRoleAccess.role,
  //       assignbranch: accessbranch,
  //       company: company.map((item) => item.value),
  //     });

  //     let branchOptfirstthree = [...new Set(res_location?.data?.branches.map((data) => data.name))].map((name) => ({
  //       label: name,
  //       value: name,
  //     }));
  //     setBranchOption(branchOptfirstthree);
  //     setSelectedOptionsBranch(branchOptfirstthree);
  //     fetchUnitAll(company, branchOptfirstthree);
  //   } catch (err) {
  //     console.log(err, 'err');
  //     handleApiError(err, setShowAlert, handleClickOpenerr);
  //   }
  // };
  // //get unit by branch
  // const fetchUnitAll = async (company, branch) => {
  //   const accessbranch = isUserRoleAccess?.role?.includes('Manager')
  //     ? []
  //     : isAssignBranch
  //         ?.filter((data) => {
  //           let fetfinalurl = [];

  //           if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
  //             fetfinalurl = data.subsubpagenameurl;
  //           } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
  //             fetfinalurl = data.subpagenameurl;
  //           } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
  //             fetfinalurl = data.mainpagenameurl;
  //           } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
  //             fetfinalurl = data.submodulenameurl;
  //           } else if (data?.modulenameurl?.length !== 0) {
  //             fetfinalurl = data.modulenameurl;
  //           } else {
  //             fetfinalurl = [];
  //           }

  //           const remove = [window.location.pathname?.substring(1), window.location.pathname];
  //           return fetfinalurl?.some((item) => remove?.includes(item));
  //         })
  //         ?.map((data) => ({
  //           branch: data.branch,
  //           // company: data.company,
  //           // unit: data.unit,
  //         }));
  //   try {
  //     let res_location = await axios.post(SERVICE.UNIT_BY_ACCESS, {
  //       headers: {
  //         Authorization: `Bearer ${auth.APIToken}`,
  //       },
  //       role: isUserRoleAccess.role,
  //       assignbranch: accessbranch,
  //       branch: branch.map((item) => item.value),
  //     });

  //     let units = [...new Set(res_location?.data?.units.map((data) => data.name))].map((name) => ({
  //       label: name,
  //       value: name,
  //     }));
  //     setUnitOption(units);
  //     setSelectedOptionsUnit(units);
  //     fetchTeamAll(company, branch, units);
  //   } catch (err) {
  //     handleApiError(err, setShowAlert, handleClickOpenerr);
  //   }
  // };
  // //get all Team.
  // const fetchTeamAll = async (company, branch, unit) => {
  //   // let unitArr = e.map(data => data.name)

  //   try {
  //     let res_location = await axios.post(SERVICE.TEAMS_BY_UNIT, {
  //       headers: {
  //         Authorization: `Bearer ${auth.APIToken}`,
  //       },
  //       company: company.map((item) => item.value),
  //       branch: branch.map((item) => item.value),
  //       unit: unit.map((item) => item.value),
  //     });
  //     // const TeamOpt = res_location?.data?.teamsdetails?.filter((t) => unitArr.includes(t.unit))
  //     let TeamOpt = [...new Set(res_location?.data?.teamsdetails.map((data) => data.teamname))].map((name) => ({
  //       label: name,
  //       value: name,
  //     }));

  //     setTeamOption(TeamOpt);
  //     setSelectedOptionsTeam(TeamOpt);
  //     fetchEmployeesAll(company, branch, unit, TeamOpt);
  //   } catch (err) {
  //     handleApiError(err, setShowAlert, handleClickOpenerr);
  //   }
  // };
  // //get all project.
  // const fetchProjMaster = async () => {
  //   try {
  //     let res_project = await axios.get(SERVICE.PROJECTMASTER_LIMITED, {
  //       headers: {
  //         Authorization: `Bearer ${auth.APIToken}`,
  //       },
  //     });

  //     const projectopt = res_project?.data?.projmaster.map((item) => ({
  //       ...item,
  //       label: item.name,
  //       value: item.name,
  //     }));

  //     setProjmasterOpt(projectopt);
  //     setSelectedProject(projectopt);
  //     await fetchVendor(projectopt);
  //     await fetchAllCategory(projectopt);
  //   } catch (err) {
  //     handleApiError(err, setShowAlert, handleClickOpenerr);
  //   }
  // };
  // //get all Sub vendormasters.
  // const fetchVendor = async (project) => {
  //   try {
  //     let res_vendor = await axios.post(SERVICE.VENDORMASTER_LIMITED_BYPROJECT, {
  //       headers: {
  //         Authorization: `Bearer ${auth.APIToken}`,
  //       },
  //       project: project.map((t) => t.value),
  //     });

  //     const projFilt = [...new Set(res_vendor?.data?.vendormaster?.map((data) => data.name))].map((t) => ({
  //       ...t,
  //       label: t,
  //       value: t,
  //     }));
  //     setVendormasterOpt(projFilt);
  //     // let vendoryOptfirstthree = projFilt.filter((d, index) => index <= 2);
  //     // let prodjectvalue = vendoryOptfirstthree.length > 0 ? vendoryOptfirstthree : [];
  //     setSelectedVendor(projFilt);
  //   } catch (err) {
  //     handleApiError(err, setShowAlert, handleClickOpenerr);
  //   }
  // };
  // //get all category.
  // const fetchAllCategory = async (project) => {
  //   try {
  //     let res_module = await axios.post(SERVICE.CATEGORYPROD_LIMITED_REPORT_MULTI, {
  //       headers: {
  //         Authorization: `Bearer ${auth.APIToken}`,
  //       },
  //       projectvendor: project.map((t) => t.value),
  //     });
  //     const uniques = [...new Set(res_module?.data?.categoryprod.map((item) => item.name))];
  //     const categoryOpt = uniques.map((d) => ({
  //       label: d,
  //       value: d,
  //     }));
  //     setCategoryOPt(categoryOpt);

  //     // let categoryOptfirstthree = categoryOpt.filter((d, index) => index <= 2);

  //     // let prodjectvalue = categoryOptfirstthree.length > 0 ? categoryOptfirstthree : [];
  //     setSelectedOptionsCategory(categoryOpt);
  //     fetchAllSubCategory(project, categoryOpt);
  //   } catch (err) {
  //     handleApiError(err, setShowAlert, handleClickOpenerr);
  //   }
  // };
  //get all category.
  const fetchAllSubCategory = async (project, category) => {
    try {
      let res_module = await axios.post(SERVICE.SUBCATEGORYPROD_LIMITED_REPORT_MULTI, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        project: project.map((item) => item.value),
        category: category.map((item) => item.value),
      });
      const uniques = [...new Set(res_module?.data?.subcategoryprod.map((item) => item.name))];

      const projFilt = uniques.map((d) => ({
        label: d,
        value: d,
      }));

      setSubCategoryOpt(projFilt);
      setSelectedOptionsSubCategory(projFilt);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //get all Sub vendormasters.
  const fetchAllLogins = async () => {
    try {
      let res_vendor = await axios.get(SERVICE.ALL_CLIENTUSERID_REPORT_LIMITED_IDSONLY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const alluseridNamesadmin = [...new Set(res_vendor?.data?.clientuserid?.map((data) => data.userid))].map((t) => ({
        ...t,
        label: t,
        value: t,
      }));
      setLoginAllotFilter(alluseridNamesadmin);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchEmployeesAll = async (company, branch, unit, team, fromdate) => {
    try {
      let res = await axios.post(SERVICE.USER_PROD_LIMITED_REPORT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: company.map((item) => item.value),
        branch: branch.map((item) => item.value),
        unit: unit.map((item) => item.value),
        team: team.map((item) => item.value),
        reasondate:fromdate
      });
      const allusers =res?.data?.users.filter((item, index, self) => {
        return (
          self.findIndex(
            (i) => i.companyname === item.companyname  ) === index
        );
      }).map((t) => ({
        ...t,
        label: t.companyname,
        value: t.companyname,
        username:t.username
      }));
      
      setEmployeeOption(allusers);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchAll = async () => {

    const accessbranch = isUserRoleAccess?.role?.includes('Manager')
    ? []
    : 
      isAssignBranch
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
          name: data.branch,
          company: data.company,
          unit: data.unit,
        }));
    try {
      const [RES_COMPANY, RES_BRANCH, RES_UNIT, RES_TEAM, RES_PROJECT, RES_VENDOR, RES_CATEGORY, RES_SUBCATEGORY] = await Promise.all([
        axios.post(SERVICE.COMPANY_LIMITED_BY_ACCESS, { 
          headers: { Authorization: `Bearer ${auth.APIToken}` },
          role: isUserRoleAccess.role,
          assignbranch: accessbranch.map(data =>({name: data.company}))  
        }),
        axios.post(SERVICE.BRANCH_BY_COMPANY_ACCESS, { 
          headers: { Authorization: `Bearer ${auth.APIToken}` },
          role: isUserRoleAccess.role,
          assignbranch: accessbranch.map(data => ({name: data.branch, company: data.company, })),
        }),
        axios.post(SERVICE.UNIT_BY_ACCESS, { 
          headers: { Authorization: `Bearer ${auth.APIToken}` },
          role: isUserRoleAccess.role,
          assignbranch: accessbranch.map(data => ({ branch: data.branch, })),
        }),
        axios.get(SERVICE.TEAMS, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.PROJECTMASTER_LIMITED, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),       
        axios.get(SERVICE.VENDORMASTER_LIMITED_NAMEONLY, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),        
        axios.get(SERVICE.CATEGORY_PROD_LIMITED_PROJECT, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.SUBCATEGORYPROD_REPORT_LIMITED, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),      
      ]);
      let companies = [...new Set(RES_COMPANY?.data?.companies.map((data) => data.name))].map((name) => ({
        label: name,
        value: name,
      }));
      setCompanyOpt(companies);
      setSelectedOptionsCompany(companies);
      let branchOptfirstthree = RES_BRANCH?.data?.branches.filter((item, index, self) => {
        return (
          self.findIndex(
            (i) => i.company === item.company && i.name === item.name  ) === index
        );
      }).map((t) => ({
        ...t,
        label: t.name,
        value: t.name,
      }));
      setBranchOption(branchOptfirstthree);
      setSelectedOptionsBranch(branchOptfirstthree);
      let units = RES_UNIT?.data?.units.filter((item, index, self) => {
        return (
          self.findIndex(
            (i) => i.branch === item.branch && i.name === item.name  ) === index
        );
      }).map((t) => ({
        ...t,
        label: t.name,
        value: t.name,
      }));
      setUnitOption(units);
      setSelectedOptionsUnit(units);
      let TeamOpt =RES_TEAM?.data?.teamsdetails.filter((item, index, self) => {
        return (
          self.findIndex(
            (i) => i.company === item.company && i.branch === item.branch && i.unit === item.unit && i.teamname === item.teamname  ) === index
        );
      }).map((t) => ({
        ...t,
        label: t.teamname,
        value: t.teamname,
      }));

      setTeamOption(TeamOpt);
      setSelectedOptionsTeam(TeamOpt);
      const projectopt = RES_PROJECT?.data?.projmaster.map((item) => ({
        ...item,
        label: item.name,
        value: item.name,
      }));
      setProjmasterOpt(projectopt);
      setSelectedProject(projectopt);
      const projFilt = RES_VENDOR?.data?.vendormaster.filter((item, index, self) => {
        return (
          self.findIndex(
            (i) =>
              i.name === item.name && i.projectname === item.projectname
          ) === index
        );
      }).map((t) => ({
        ...t,
        label: t.name,
        value: t.name,
      }));
      setVendormasterOpt(projFilt);
      setSelectedVendor(projFilt);

      const categoryOpt = RES_CATEGORY?.data?.categoryprod.filter((item, index, self) => {
            return (
              self.findIndex(
                (i) =>
                  i.name === item.name && i.project === item.project
              ) === index
            );
          }).map((t) => ({
            ...t,
            label: t.name,
            value: t.name,
          }));

      setCategoryOPt(categoryOpt);
      setSelectedOptionsCategory(categoryOpt);

      const subcategories = RES_SUBCATEGORY?.data?.subcategoryprod.filter((item, index, self) => {
        return (
          self.findIndex(
            (i) =>
              i.name === item.name && i.project === item.project && i.categoryname === item.categoryname
          ) === index
        );
      }).map((t) => ({
        ...t,
        label: t.name,
        value: t.name,
      }));

      setSubCategoryOpt(subcategories);
      setSelectedOptionsSubCategory(subcategories);
      fetchEmployeesAll(companies, branchOptfirstthree, units, TeamOpt,)
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    fetchAllLogins();
    fetchAll();
  }, []);

  const handleEmployeeChangeFrom = (options) => {
    setSelectedEmployeeFrom(options);
    setSelectedEmployeeUsername(options.map(item => item.username))
  };
  const customValueRendererEmployeeFrom = (valueCate, _employeename) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(', ') : 'Please select Employee';
  };

  //employee multiselect dropdown changes
  const handleLoginChangeFrom = (options) => {
    setSelectedOptionsLoginid(options);
  };
  const customValueRendererLoginFrom = (valueLoginCat, _employeename) => {
    return valueLoginCat.length ? valueLoginCat.map(({ label }) => label).join(', ') : 'Please Select Login';
  };


  const [fetchedUsers, setFetchedUsers] = useState([])

  const fetchBatchFilter = async (batchNum) => {
    setProductionFilter([]);
  
    setSourcecheck(true);
    setIsLoading(true);
    // let allData = [];
    // let hasMoreData = true;
    setHasMoreData(true);
 
    let resultvendor = [];
    selectedProject
      .map((d) => d.value)
      .forEach((proj) => {
        selectedVendor
          .map((d) => d.value)
          .forEach((vend) => {
            // if (vendorOpt.some((v) => v.projectname === proj && v.name === vend)) {
            resultvendor.push(`${proj}-${vend}`);
            // }
          });
      });
    let projvendor = [...new Set(resultvendor)];
    try {
     
      let batchNumber = 0;
      let allData = [];
      let hasMoreData = true;
      let allusers = [];
      let apiUrl;
      let totalBatchNumber = 10;
      while (hasMoreData) {
        try {
          if (batchNumber === 0) {
            apiUrl = SERVICE.PRODUCTION_UPLOAD_FILTER_USERS;
          } else {
            apiUrl = SERVICE.PRODUCTION_UPLOAD_FILTER;
          }
          const currentBatch = Number(batchNumber) * 30;
          const beforeBatch = (Number(batchNumber) - 1) * 30;

          const response = await axios.post(
            apiUrl,
            batchNumber === 0
              ? {
                  date: overallState.fromdate,
                  empname: selectedEmployeeFrom.map((item) => item.value),
                  user: selectedOptionsLoginid.map((item) => item.value),
                  batchNumber: batchNumber,
                  batchSize: 0,
                }
              : {
                  date: overallState.fromdate,
                  users: allusers.slice(beforeBatch, currentBatch),
                  batchNumber: batchNumber,
                  company:  selectedOptionsCompany.map((item) => item.value),
                  branch:  selectedOptionsBranch.map((item) => item.value),
                  unit: selectedOptionsUnit.map((item) => item.value),
        
                  // newcategory: valueSubCat,
                  team: selectedOptionsTeam.map((item) => item.value),
                  projectvendor: projvendor,
                  // subs: result,
                  // subsmanual: resultmanual,
                  empname: selectedEmployeeFrom.map((item) => item.value),
                  user: selectedOptionsLoginid.map((item) => item.value),
                  category: selectedOptionsCategory.map((item) => item.value),
                  subcategory: selectedOptionsSubCategory.map((item) => item.value),
                  // vendor: selectedVendor.map(item => item.value),
                  // project: selectedProject.map(item => item.value),
                  username: selectedEmployeeUsername,
                  
                  selecteddupe: selectedDupe,
                  fromdate: overallState.fromdate,
                  fromtime: overallState.fromtime24Hrs,
                  totime: overallState.totime24Hrs,
                  todate: overallState.todate,
                  shift: overallState.shift,
                  mode: selectedOptionsMode.map((item) => item.value),
        
                },
            {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
            }
          );

          if (batchNumber === 0) {
            allusers = response.data.users || [];
            totalBatchNumber = Math.ceil(allusers.length / 30);
            setFetchedUsers(allusers)
          }
          const productionupload = response.data.mergedData || [];
          if (batchNumber > 0 && batchNumber > 1) {
            hasMoreData = false;
          } else {
            let filtered = productionupload.filter((item) => item != null && item !== undefined);
            allData = filtered;
            console.log(batchNumber, totalBatchNumber, filtered.length, 'batch');
            batchNumber++;
         
          }
        } catch (err) {
          console.log(err, 'err123888');
       
         

          setPopupContentMalert(err.response.data.message === 'shifttiming' ? 'Shifttime value is undefined' : 'something went wrong!');
          setPopupSeverityMalert('info');
          handleClickOpenPopupMalert();

          allData = -1;

          hasMoreData = false;
        }
      }

      if (allData === 0) {
        setHasMoreData(false);
        setSourcecheck(false);
        setIsLoading(false);
        if (batchNumber >= totalBatchNumber ) {
          setPopupContentMalert("Fully Loaded");
          setPopupSeverityMalert("success");
          handleClickOpenPopupMalert();
          setHasMoreData(false);
        }
      } else {
        const filtered = allData.filter((item) => item != null);
     
        // console.log(mergedDataall, "mergedDataall")

        setProductionFilter(filtered);

        setBatchNumber(batchNum);
        setSourcecheck(false);
        setIsLoading(false);
        if (batchNumber >= totalBatchNumber ) {
          setPopupContentMalert("Fully Loaded");
          setPopupSeverityMalert("success");
          handleClickOpenPopupMalert();
          setHasMoreData(false);
        }else{
        setIsLoadMorePopupOpen(true);
        }
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setSourcecheck(false);
      setIsLoading(false);
      setHasMoreData(false);
    } finally {
      setSourcecheck(false);
      setIsLoading(false);
      setIsLoading(false);
    }
  };

  const fetchBatch = async (batchNum) => {
 
    setSourcecheck(true);
    setIsLoading(true);
    // let allData = [];
    setHasMoreData(true);
    let batchNumber=batchNum
    let resultvendor = [];
    selectedProject
      .map((d) => d.value)
      .forEach((proj) => {
        selectedVendor
          .map((d) => d.value)
          .forEach((vend) => {
            // if (vendorOpt.some((v) => v.projectname === proj && v.name === vend)) {
            resultvendor.push(`${proj}-${vend}`);
            // }
          });
      });
    let projvendor = [...new Set(resultvendor)];
    // const isRoleManager = ['Manager', 'Director', 'Admin', 'SuperAdmin', 'ADMIN'].some((rl) => isUserRoleAccess.role.includes(rl));
   let totalBatchNumber = Math.ceil(fetchedUsers.length / 30);
    try {
    
    const apiUrl = SERVICE.PRODUCTION_UPLOAD_FILTER;
    
    const currentBatch = Number(batchNumber) * 30;
    const beforeBatch = (Number(batchNumber) - 1) * 30;

    const response = await axios.post(
      apiUrl,
      {
            date: overallState.fromdate,
            users: fetchedUsers.slice(beforeBatch, currentBatch),
            batchNumber: batchNumber,
            company:  selectedOptionsCompany.map((item) => item.value),
            branch:  selectedOptionsBranch.map((item) => item.value),
            unit: selectedOptionsUnit.map((item) => item.value),
  
            // newcategory: valueSubCat,
            team: selectedOptionsTeam.map((item) => item.value),
            projectvendor: projvendor,
            // subs: result,
            // subsmanual: resultmanual,
            empname: selectedEmployeeFrom.map((item) => item.value),
            user: selectedOptionsLoginid.map((item) => item.value),
            category: selectedOptionsCategory.map((item) => item.value),
            subcategory: selectedOptionsSubCategory.map((item) => item.value),
            // vendor: selectedVendor.map(item => item.value),
            // project: selectedProject.map(item => item.value),
            selecteddupe: selectedDupe,
            fromdate: overallState.fromdate,
            fromtime: overallState.fromtime24Hrs,
            totime: overallState.totime24Hrs,
            todate: overallState.todate,
            shift: overallState.shift,
            mode: selectedOptionsMode.map((item) => item.value),
  
          },
      {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      }
    );

      if (response.data.count === 0) {
        setHasMoreData(false);
        setSourcecheck(false);
        setIsLoading(false);
        if (batchNumber >= totalBatchNumber ) {
          setPopupContentMalert("Fully Loaded");
          setPopupSeverityMalert("success");
          handleClickOpenPopupMalert();
          setHasMoreData(false);
        }
      } else {
        const filtered = response.data.mergedData;
        // setAllData((prevData) => [...prevData, ...filtered]);
        if (filtered.length === 0) {
          const nextBatchNumber = batchNumber + 1;
          setBatchNumber(nextBatchNumber);
          fetchBatch(nextBatchNumber);
        } else {
          // let final = filtered;

      
          setProductionFilter((prevData) => [...productionFilter, ...filtered]);

          setPage(1);

          setBatchNumber(batchNum);
          setSourcecheck(false);
          setIsLoading(false);
          if (batchNumber >= totalBatchNumber ) {
            setPopupContentMalert("Fully Loaded");
            setPopupSeverityMalert("success");
            handleClickOpenPopupMalert();
            setHasMoreData(false);
          }else{
          setIsLoadMorePopupOpen(true);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setSourcecheck(false);
      setIsLoading(false);
      setHasMoreData(false);
    } 
  };

  const loadMore = () => {
    const nextBatchNumber = batchNumber + 1;
    setBatchNumber(nextBatchNumber);
    fetchBatch(nextBatchNumber);
  };
  const handleLoadMore = () => {
    setIsLoadMorePopupOpen(false); // Close the popup
    const nextBatchNumber = batchNumber + 1;
    setBatchNumber(nextBatchNumber);
    fetchBatch(nextBatchNumber); // Fetch the next batch
  };

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, 'Overall_Report.png');
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
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
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
    setSearchQueryManage('');
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return 'custom-id-row'; // This is the custom class for rows with item.tat === 'ago'
    }
    if (params.row.dupe.includes('Yes')) {
      return 'custom-dupe-row'; // This is the custom class for rows with item.tat === 'ago'
    }
    if (params.row.lateentry === true) {
      return 'custom-lateentry'; // This is the custom class for rows with item.tat === 'ago'
    }
    return ''; // Return an empty string for other rows
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    mode: true,
    company: true,
    branch: true,
    dateval: true,
    unit: true,
    team: true,
    project: true,
    vendor: true,
    category: true,
    filename: true,
    unitid: true,
    empcode: true,
    empname: true,
    username: true,
    user: true,
    fromdate: true,
    todate: true,
    section: true,
    flagcount: true,
    points: true,
    unitrate: true,

    csection: true,
    cflagcount: true,
    cpoints: true,
    cunitrate: true,

    worktook: true,
    createdAt: true,

    totalpoints: true,
    dupe: true,
    actions: true,
    proddaydate: true,
    cstist: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  const handleModeChange = (options) => {
    setSelectedOptionsMode(options);
  };
  const handleCategoryChange = (options) => {
    // fetchAllSubCategory(selectedProject, options);
    setSelectedOptionsCategory(options);
    setSelectedOptionsSubCategory([]);
  };

  const handleSubCategoryChange = (options) => {
    setSelectedOptionsSubCategory(options);
  };

  const handleCompanyChange = (options) => {
    // fetchBranchAll(options);
    setSelectedOptionsCompany(options);
    // fetchUnitAll(options, selectedOptionsBranch);
    fetchEmployeesAll(options, selectedOptionsBranch, selectedOptionsUnit, selectedOptionsTeam);
    setSelectedOptionsBranch([]);
    setSelectedOptionsUnit([]);
    setSelectedOptionsTeam([]);
    setSelectedEmployeeFrom([]);
    setSelectedEmployeeUsername([])
  };

  const handleBranchChange = (options) => {
    setSelectedOptionsBranch(options);
    // fetchUnitAll(selectedOptionsCompany, options);
    fetchEmployeesAll(selectedOptionsCompany, options, selectedOptionsUnit, selectedOptionsTeam);
    setSelectedOptionsUnit([]);
    setSelectedOptionsTeam([]);
    setSelectedEmployeeFrom([]);
    setSelectedEmployeeUsername([])
  };

  const handleUnitChange = (options) => {
    setSelectedOptionsUnit(options);
    // fetchTeamAll(selectedOptionsCompany, selectedOptionsBranch, options);
    fetchEmployeesAll(selectedOptionsCompany, selectedOptionsBranch, options, selectedOptionsTeam);
    setSelectedOptionsTeam([]);
    setSelectedEmployeeFrom([]);
    setSelectedEmployeeUsername([])
  };

  const handleTeamChange = (options) => {
    setSelectedOptionsTeam(options);
    fetchEmployeesAll(selectedOptionsCompany, selectedOptionsBranch, selectedOptionsUnit, options);
    setSelectedEmployeeFrom([]);
    setSelectedEmployeeUsername([])
  };

  const handleProjectChange = (options) => {
    setSelectedProject(options);
    // fetchVendor(options);
    // fetchAllCategory(options);
    // fetchAllSubCategory(options, selectedOptionsCategory);
    setSelectedVendor([]);
    setSelectedOptionsCategory([]);
    setSelectedOptionsSubCategory([]);
  };

  const handleVendorChange = (options) => {
    setSelectedVendor(options);
    setSelectedOptionsCategory([]);
    setSelectedOptionsSubCategory([]);
  };

  const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
    return valueCompanyCat?.length ? valueCompanyCat.map(({ label }) => label)?.join(', ') : 'Please Select Company';
  };

  const customValueRendererProject = (valueProject, _categoryname) => {
    return valueProject?.length ? valueProject.map(({ label }) => label)?.join(', ') : 'Please Select Project';
  };

  const customValueRendererVendor = (valueVendor, _categoryname) => {
    return valueVendor?.length ? valueVendor.map(({ label }) => label)?.join(', ') : 'Please Select Vendor';
  };

  const customValueRendererCategory = (valueCompanyCategory, _categoryname) => {
    return valueCompanyCategory?.length ? valueCompanyCategory.map(({ label }) => label)?.join(', ') : 'Please Select Category';
  };

  const customValueRendererSubCategory = (valueSubCat, _categoryname) => {
    return valueSubCat?.length ? valueSubCat.map(({ label }) => label)?.join(', ') : 'Please Select SubCategory';
  };

  const customValueRendererBranch = (valueBranchCat, _categoryname) => {
    return valueBranchCat?.length ? valueBranchCat.map(({ label }) => label)?.join(', ') : 'Please Select Branch';
  };
  const customValueRendererUnit = (valueUnitCat, _categoryname) => {
    return valueUnitCat?.length ? valueUnitCat.map(({ label }) => label)?.join(', ') : 'Please Select Unit';
  };
  const customValueRendererTeam = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length ? valueTeamCat.map(({ label }) => label)?.join(', ') : 'Please Select Team';
  };

  const customValueRendererMode = (valueMode, _categoryname) => {
    return valueMode?.length ? valueMode.map(({ label }) => label)?.join(', ') : 'Please Select Production';
  };

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };

  function daysBetweenDates(date1, date2) {
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  const difference = daysBetweenDates(new Date(overallState.fromdate), new Date(overallState.todate));
  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();

    if (overallState.fromdate === '') {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: '100px', color: 'orange' }} />
          <p style={{ fontSize: '20px', fontWeight: 900 }}>{'Please Select FromDate'}</p>
        </>
      );
      handleClickOpenerr();
    } else if (overallState.todate === '') {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: '100px', color: 'orange' }} />
          <p style={{ fontSize: '20px', fontWeight: 900 }}>{'Please Select ToDate'}</p>
        </>
      );
      handleClickOpenerr();
    } else if (overallState.fromdate !== overallState.todate) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: '100px', color: 'orange' }} />
          <p style={{ fontSize: '20px', fontWeight: 900 }}>{'Please Select Single Date'}</p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedOptionsMode.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: '100px', color: 'orange' }} />
          <p style={{ fontSize: '20px', fontWeight: 900 }}>{'Please Select  Mode'}</p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedProject.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: '100px', color: 'orange' }} />
          <p style={{ fontSize: '20px', fontWeight: 900 }}>{'Please Select Project'}</p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedOptionsCategory.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: '100px', color: 'orange' }} />
          <p style={{ fontSize: '20px', fontWeight: 900 }}>{'Please Select Category'}</p>
        </>
      );
      handleClickOpenerr();
    }

    // else if (selectedOptionsCategory.length > 3) {
    //     setShowAlert(
    //         <>
    //             <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
    //             <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Choose Exactly 3 Categories"}</p>
    //         </>
    //     );
    //     handleClickOpenerr();
    // }
    else if (selectedOptionsSubCategory.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: '100px', color: 'orange' }} />
          <p style={{ fontSize: '20px', fontWeight: 900 }}>{'Please Select Sub Category'}</p>
        </>
      );
      handleClickOpenerr();
    }

    // else if (selectedOptionsSubCategory.length > 3) {
    //     setShowAlert(
    //         <>
    //             <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
    //             <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Choose Exactly 3 Sub Categories"}</p>
    //         </>
    //     );
    //     handleClickOpenerr();
    // }
    // else if (selectedOptionsSubCategory.length > 3 && difference > 1) {
    //     setShowAlert(
    //         <>
    //             <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
    //             <p style={{ fontSize: '20px', fontWeight: 900 }}>{"For more than 3 Sub Categories, The Date Range Should not be More Than 2 days"}</p>
    //         </>
    //     );
    //     handleClickOpenerr();
    // }
    else if (overallState.shift === 'Date Based' && overallState.totime < overallState.fromtime) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: '100px', color: 'orange' }} />
          <p style={{ fontSize: '20px', fontWeight: 900 }}>{'To Time must be greater than or equal to From Time'}</p>
        </>
      );
      handleClickOpenerr();
    } else {
      fetchBatchFilter(1);
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setOverallState({
      mode: 'Please Select Production Mode',
      project: 'Please Select Project',
      vendor: 'Please Select Vendor',
      fromdate: today,
      todate: today,
      fromtime: '',
      totime: '',
      alllogin: 'Please Select Login',
      shift: 'Shift Based',
    });
    setSelectedOptionsCompany([]);
    setSelectedOptionsBranch([]);
    setSelectedOptionsCategory([]);
    setSelectedOptionsSubCategory([]);
    setSelectedOptionsUnit([]);
    setSelectedOptionsTeam([]);
    setSelectedEmployeeFrom([]);
    setSelectedEmployeeUsername([])
    setVendormasterOpt([]);
    setTeamOption([]);
    setBranchOption([]);
    setUnitOption([]);
    setEmployeeOption([]);
    setSelectedOptionsMode([]);
    setProductionFilter([]);
    setSelectedProject([]);
    setSelectedVendor([]);
    setCategoryOPt([]);
    setShowAlert(
      <>
        <ErrorOutlineOutlinedIcon sx={{ fontSize: '100px', color: 'orange' }} />
        <p style={{ fontSize: '20px', fontWeight: 900 }}>{'Cleared Successfully'}</p>
      </>
    );
    handleClickOpenerr();
  };

  // pdf.....
  const columns = [
    { title: 'Sno', dataKey: 'serialNumber' },
    { title: 'Mode', dataKey: 'mode' },
    { title: 'Company', dataKey: 'company' },
    { title: 'Branch', dataKey: 'branch' },
    { title: 'Unit', dataKey: 'unit' },
    { title: 'Team', dataKey: 'team' },
    { title: 'Vendor', dataKey: 'vendor' },
    { title: 'Category', dataKey: 'filename' },
    { title: 'SubCategory', dataKey: 'category' },
    { title: 'Unit Identifier', dataKey: 'unitid' },

    { title: 'Employee Name', dataKey: 'empname' },
    { title: 'Employee Code', dataKey: 'empcode' },
    { title: 'LoginId', dataKey: 'user' },
    { title: 'Date', dataKey: 'dateval' },

    { title: 'U-Points', dataKey: 'points' },
    { title: 'U-Unitrate', dataKey: 'unitrate' },
    { title: 'U-Section', dataKey: 'section' },
    { title: 'U-Flag Count', dataKey: 'flagcount' },

    { title: 'A-Points', dataKey: 'cpoints' },
    { title: 'A-Unitrate', dataKey: 'cunitrate' },
    { title: 'A-Section', dataKey: 'csection' },
    { title: 'A-Flag Count', dataKey: 'cflagcount' },

    { title: 'WorkTook', dataKey: 'worktook' },
    { title: 'Total Points', dataKey: 'totalpoints' },
    { title: 'User Name', dataKey: 'username' },
  ];

  const downloadPdf = () => {
    const doc = new jsPDF({ orientation: 'landscape' });

    const maxColumnsPerPage = 10; // Maximum number of columns per page
    const totalPages = Math.ceil(columns.length / maxColumnsPerPage); // Calculate total pages needed

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
      const startIdx = (currentPage - 1) * maxColumnsPerPage;
      const endIdx = Math.min(startIdx + maxColumnsPerPage, columns.length);

      const currentPageColumns = columns.slice(startIdx, endIdx);

      doc.autoTable({
        theme: 'grid',
        styles: {
          fontSize: 5,
        },
        columns: currentPageColumns,
        body: rowDataTable,
      });

      if (currentPage < totalPages) {
        doc.addPage(); // Add a new page if there are more columns to display
      }
    }
    doc.save('Overall Report.pdf');
  };

  // Excel
  const fileName = 'Overall Report';

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Overall Report',
    pageStyle: 'print',
  });

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener('beforeunload', beforeUnloadHandler);
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, []);

  const [items, setItems] = useState([]);

  const addSerialNumber = async () => {
    const responseDate = await axios.post(
      SERVICE.PRODUCTION_DAYPOINTS_CHECK_PRODDAY_DATE,
      {
        fromdate: overallState.fromdate,
      },
      {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      }
    );

    let dayPointsData = responseDate.data.daypoints.length > 0 ? responseDate.data.daypoints.map((item) => item.uploaddata).flat() : [];
    let prodDays = responseDate.data.produniqids.length > 0 ? responseDate.data.produniqids.map((item) => item.date) : [];
    console.log(prodDays, 'prodDays');

    const itemsWithSerialNumber = productionFilter?.map((item, index) => {
      // let totalPointsCalcValue = item.cpoints ? Number(item.cpoints) * (item.cflagcount ? Number(item.cflagcount) : Number(item.flagcount)) : Number(item.points) * (item.cflagcount ? Number(item.cflagcount) : Number(item.flagcount));
      // const filenamelistviewAll = item.mode == "Manual" ? item.filename : item.filename?.split(".x");
      // const filenamelist = item.mode == "Manual" ? item.filename : filenamelistviewAll ? filenamelistviewAll[0] : "";
      // let findProday = dayPointsData.filter(d => d.users.includes(item.user));
      const matchedDateEntry = dayPointsData.find((dateEntry) => {
        const [fromDate, toDate] = dateEntry.fromtodate.split('$').map((d) => new Date(d.split('.000Z')[0]));
        const dateval = new Date(item.dateval);

        return dateEntry.users.includes(item.user) && dateval >= fromDate && dateval <= toDate;
      });

      return {
        ...item,
        serialNumber: index + 1,
        fromdate: moment(item.fromdate).format('DD/MM/yyyy'),
        todate: moment(item.todate).format('DD/MM/yyyy'),
        filename: item.filename,
        section:item.section ? Number(item.section) : '',
        csection:item.csection ? Number(item.csection) : "",
        flagcount:item.flagcount ? Number(item.flagcount) : "",
        cflagcount:item.cflagcount ? Number(item.cflagcount) : "",
        unitrate: Number(item.unitrate),
        cunitrate:item.cunitrate ? Number(item.cunitrate) : "",
        points: Number(Number(item.points).toFixed(5)),
        cpoints: Number(Number(item.cpoints).toFixed(5)),
        totalpoints: Number(Number(item.totalpoints).toFixed(5)),
        dupe: item.dupe ? item.dupe : 'No',
        proddaydate: matchedDateEntry && matchedDateEntry.date && prodDays.includes(matchedDateEntry.date) ? matchedDateEntry.date : '',
      };
    });
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [productionFilter]);

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
    setPage(1);
    setSearchQuery(event.target.value);
  };
  // Split the search query into individual terms
  const searchTerms = searchQuery.toLowerCase().split(' ');
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) => Object.values(item).join(' ').toLowerCase().includes(term));
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

  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );

  const columnDataTable = [
    // {
    //   field: 'checkbox',
    //   headerName: 'Checkbox', // Default header name
    //   headerStyle: {
    //     fontWeight: 'bold', // Apply the font-weight style to make the header text bold
    //     // Add any other CSS styles as needed
    //   },
    //   renderHeader: (params) => (
    //     <CheckboxHeader
    //       selectAllChecked={selectAllChecked}
    //       onSelectAll={() => {
    //         if (rowDataTable.length === 0) {
    //           // Do not allow checking when there are no rows
    //           return;
    //         }
    //         if (selectAllChecked) {
    //           setSelectedRows([]);
    //         } else {
    //           const allRowIds = rowDataTable.map((row) => row.id);
    //           setSelectedRows(allRowIds);
    //         }
    //         setSelectAllChecked(!selectAllChecked);
    //       }}
    //     />
    //   ),

    //   renderCell: (params) => (
    //     <Checkbox
    //       checked={selectedRows.includes(params.row.id)}
    //       onChange={() => {
    //         let updatedSelectedRows;
    //         if (selectedRows.includes(params.row.id)) {
    //           updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.row.id);
    //         } else {
    //           updatedSelectedRows = [...selectedRows, params.row.id];
    //         }

    //         setSelectedRows(updatedSelectedRows);

    //         // Update the "Select All" checkbox based on whether all rows are selected
    //         setSelectAllChecked(updatedSelectedRows.length === filteredData.length);
    //       }}
    //     />
    //   ),
    //   sortable: false, // Optionally, you can make this column not sortable
    //   width: 90,

    //   hide: !columnVisibility.checkbox,
    //   headerClassName: 'bold-header',
    // },
    {
      field: 'serialNumber',
      headerName: 'SNo',
      flex: 0,
      width: 80,
      hide: !columnVisibility.serialNumber,
      headerClassName: 'bold-header',
    },
    { field: 'mode', headerName: 'Production Mode', flex: 0, width: 100, hide: !columnVisibility.mode, headerClassName: 'bold-header' },
    { field: 'company', headerName: 'Company', flex: 0, width: 80, hide: !columnVisibility.company, headerClassName: 'bold-header' },
    { field: 'branch', headerName: 'Branch', flex: 0, width: 130, hide: !columnVisibility.branch, headerClassName: 'bold-header' },
    { field: 'unit', headerName: 'Unit', flex: 0, width: 90, hide: !columnVisibility.unit, headerClassName: 'bold-header' },
    { field: 'team', headerName: 'Team', flex: 0, width: 90, hide: !columnVisibility.team, headerClassName: 'bold-header' },
    { field: 'vendor', headerName: 'Vendor', flex: 0, width: 170, hide: !columnVisibility.vendor, headerClassName: 'bold-header' },
    { field: 'filename', headerName: 'Category', flex: 0, width: 310, hide: !columnVisibility.filename, headerClassName: 'bold-header' },
    { field: 'category', headerName: 'Sub Category', flex: 0, width: 350, hide: !columnVisibility.category, headerClassName: 'bold-header' },
    { field: 'unitid', headerName: 'Unit Identifier', flex: 0, width: 150, hide: !columnVisibility.unitid, headerClassName: 'bold-header' },

    { field: 'empcode', headerName: 'Emp Code', flex: 0, width: 130, hide: !columnVisibility.empcode, headerClassName: 'bold-header' },
    { field: 'empname', headerName: 'Emp Name', flex: 0, width: 260, hide: !columnVisibility.empname, headerClassName: 'bold-header' },
    { field: 'user', headerName: 'LogIn Id', flex: 0, width: 100, hide: !columnVisibility.user, headerClassName: 'bold-header' },
    { field: 'dateval', headerName: 'Date', flex: 0, width: 190, hide: !columnVisibility.dateval, headerClassName: 'bold-header' },
    { field: 'cstist', headerName: 'CST', flex: 0, width: 190, hide: !columnVisibility.cstist, headerClassName: 'bold-header' },
    { field: 'worktook', headerName: 'Worktook', flex: 0, width: 140, hide: !columnVisibility.worktook, headerClassName: 'bold-header' },
    { field: 'unitrate', headerName: 'U-Unitrate', flex: 0, width: 100, hide: !columnVisibility.unitrate, headerClassName: 'bold-header' },
    { field: 'points', headerName: 'U-Points', flex: 0, width: 100, hide: !columnVisibility.points, headerClassName: 'bold-header' },
    { field: 'section', headerName: 'U-Section', flex: 0, width: 100, hide: !columnVisibility.section, headerClassName: 'bold-header' },
    { field: 'flagcount', headerName: 'U-Flag Count', flex: 0, width: 100, hide: !columnVisibility.flagcount, headerClassName: 'bold-header' },
    { field: 'cunitrate', headerName: 'A-Unitrate', flex: 0, width: 100, hide: !columnVisibility.cunitrate, headerClassName: 'bold-header' },
    { field: 'cpoints', headerName: 'A-Points', flex: 0, width: 100, hide: !columnVisibility.cpoints, headerClassName: 'bold-header' },
    { field: 'csection', headerName: 'A-Section', flex: 0, width: 100, hide: !columnVisibility.csection, headerClassName: 'bold-header' },
    { field: 'cflagcount', headerName: 'A-Flag Count', flex: 0, width: 100, hide: !columnVisibility.cflagcount, headerClassName: 'bold-header' },
    { field: 'totalpoints', headerName: 'Total Points', flex: 0, width: 100, hide: !columnVisibility.totalpoints, headerClassName: 'bold-header' },
    { field: 'username', headerName: 'User Name', flex: 0, width: 150, hide: !columnVisibility.username, headerClassName: 'bold-header' },

    {
      field: 'dupe',
      headerName: 'Dupe',
      flex: 0,
      width: 90,
      hide: !columnVisibility.dupe,
      headerClassName: 'bold-header',
      renderCell: (params) => <Typography sx={{ backgroundColor: params.row.dupe === 'Yes' ? 'red' : 'inherit', fontSize: '13px', padding: '5px', color: params.row.dupe === 'Yes' ? 'white' : 'black' }}>{params.row.dupe}</Typography>,
    },
    { field: 'proddaydate', headerName: 'Prod Day Date', flex: 0, width: 150, hide: !columnVisibility.proddaydate, headerClassName: 'bold-header' },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      ...item,
      id: item.serialNumber,
      serialNumber: item.serialNumber,
      mode: item.mode,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      project: item.project,
      worktook: item.worktook,
      vendor: item.vendor,
      filename: item.filename,
      category: item.category,
      dateval: item.dateval,
      subcategory: item.subcategory,
      empcode: item.empcode,
      empname: item.empname,
      username: item.username,
      user: item.user,
      fromdate: item.fromdate,
      todate: item.todate,
      section: item.section,
      flagcount: item.flagcount,
      points: item.points,
      csection: item.csection,
      cflagcount: item.cflagcount,
      cpoints: item.cpoints,
      unitid: item.unitid,
      dupe: item.dupe,
      proddaydate: item.proddaydate,
      totalpoints: item.totalpoints,
      unitrate: item.unitrate,
      cunitrate: item.cunitrate,
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
    <Box style={{ padding: '10px', minWidth: '325px', '& .MuiDialogContent-root': { padding: '10px 0' } }}>
      <Typography variant="h6">Manage Columns</Typography>
      <IconButton
        aria-label="close"
        onClick={handleCloseManageColumns}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <Box sx={{ position: 'relative', margin: '10px' }}>
        <TextField label="Find column" variant="standard" fullWidth value={searchQueryManage} onChange={(e) => setSearchQueryManage(e.target.value)} sx={{ marginBottom: 5, position: 'absolute' }} />
      </Box>
      <br />
      <br />
      <DialogContent sx={{ minWidth: 'auto', height: '200px', position: 'relative' }}>
        <List sx={{ overflow: 'auto', height: '100%' }}>
          {filteredColumns.map((column) => (
            <ListItem key={column.field}>
              <ListItemText sx={{ display: 'flex' }} primary={<Switch sx={{ marginTop: '-5px' }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />} secondary={column.field === 'checkbox' ? 'Checkbox' : column.headerName} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Grid container>
          <Grid item md={4}>
            <Button variant="text" sx={{ textTransform: 'none' }} onClick={() => setColumnVisibility(initialColumnVisibility)}>
              Show All
            </Button>
          </Grid>
          <Grid item md={4}></Grid>
          <Grid item md={4}>
            <Button
              variant="text"
              sx={{ textTransform: 'none' }}
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

  let exportColumnNames = columnDataTable.map(item => item.headerName).filter(d => d !=="SNo" && d !=="Checkbox"  && !d.includes("Action"));
  let exportRowValues = columnDataTable.map(item => item.field).filter(d => d !=="serialNumber" && d !=="checkbox"  && !d.includes("action"))
 

  return (
    <Box>
      <Headtitle title={'Overall Report'} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>Overall Report</Typography>

      <Box sx={userStyle.dialogbox}>
        <>
          <Grid container spacing={2}>
            <Grid item md={3} xs={12} sm={6}>
              <FormControl fullWidth>
                <Typography>
                  Production Mode<b style={{ color: 'red' }}>*</b>
                </Typography>
                <MultiSelect
                  maxMenuHeight={250}
                  options={PmodeOpt}
                  value={selectedOptionsMode}
                  onChange={(e) => {
                    handleModeChange(e);
                  }}
                  valueRenderer={customValueRendererMode}
                  labelledBy="Please Select Production"
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>Company</Typography>
                <MultiSelect
                  options={companyOpt}
                  value={selectedOptionsCompany}
                  onChange={(e) => {
                    handleCompanyChange(e);
                  }}
                  valueRenderer={customValueRendererCompany}
                  labelledBy="Please Select Company"
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>Branch</Typography>
                <MultiSelect
                  options={branchOption.filter(item => selectedOptionsCompany.map(t=> t.value).includes(item.company))}
                  value={selectedOptionsBranch}
                  onChange={(e) => {
                    handleBranchChange(e);
                  }}
                  valueRenderer={customValueRendererBranch}
                  labelledBy="Please Select Branch"
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>Unit</Typography>
                <MultiSelect
                  options={unitOption.filter(item => selectedOptionsBranch.map(t=> t.value).includes(item.branch)  )}
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
                <Typography>Team</Typography>
                <MultiSelect
                  options={teamOption.filter(item => selectedOptionsCompany.map(t=> t.value).includes(item.company) && selectedOptionsBranch.map(t=> t.value).includes(item.branch) && selectedOptionsUnit.map(t=> t.value).includes(item.unit)  )}
                  value={selectedOptionsTeam}
                  onChange={(e) => {
                    handleTeamChange(e);
                  }}
                  valueRenderer={customValueRendererTeam}
                  labelledBy="Please Select Team"
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={6}>
              <FormControl fullWidth>
                <Typography>
                  Project
                  <b style={{ color: 'red' }}>*</b>
                </Typography>
                <MultiSelect
                  options={projectOpt}
                  value={selectedProject}
                  onChange={(e) => {
                    handleProjectChange(e);
                  }}
                  valueRenderer={customValueRendererProject}
                  labelledBy="Please Select Project"
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={6}>
              <FormControl fullWidth>
                <Typography>Vendor</Typography>
                <MultiSelect
                  options={vendorOpt.filter(item => selectedProject.map(t=> t.value).includes(item.projectname)).filter((item, index, self) => {
                    return (
                      self.findIndex(
                        (i) => i.name === item.name  ) === index
                    );
                  }).map((t) => ({
                    ...t,
                    label: t.name,
                    value: t.name,
                  }))}
                  value={selectedVendor}
                  onChange={(e) => {
                    handleVendorChange(e);
                  }}
                  valueRenderer={customValueRendererVendor}
                  labelledBy="Please Select Vendor"
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>Shift</Typography>
                <Selects
                  options={ShiftOpt}
                  value={{ label: overallState.shift, value: overallState.shift }}
                  onChange={(e) => {
                    setOverallState({
                      ...overallState,
                      shift: e.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>
                  From Date <b style={{ color: 'red' }}>*</b>
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="date"
                  value={overallState.fromdate}
                  onChange={(e) => {
                    const selectedDate = e.target.value;
                    setOverallState({ ...overallState, fromdate: selectedDate, todate: selectedDate });
                  }}
                  onBlur={
                    (e) => {
                      const selectedDate = e.target.value;
                     // Ensure that the selected date is not in the future
                     const currentDate = new Date().toISOString().split('T')[0];
                     if (new Date(selectedDate) <= new Date()) {
                       // setSelectedFromdate(selectedDate);
                       // setSelectedTodate(selectedDate);
                       setOverallState({ ...overallState, fromdate: selectedDate, todate: selectedDate });
                     } else {
                      setOverallState({ ...overallState, fromdate: "", todate: "" })
                     }
                  }}
                  // Set the max attribute to the current date
                  inputProps={{ max: new Date().toISOString().split('T')[0] }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>
                  To Date <b style={{ color: 'red' }}>*</b>
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="date"
                  value={overallState.todate}
                  onChange={(e) => {
                    const selectedDate = e.target.value;
                    setOverallState({ ...overallState, todate: selectedDate });
                  }}
                  // onMouseLeave={}
                  onBlur={(e) => {
                    const selectedDate = e.target.value;
                   
                    const fromdateval = overallState.fromdate != '' && new Date(overallState.fromdate).toISOString().split('T')[0];
                    if (overallState.fromdate == '') {
                      setShowAlert(
                        <>
                          <ErrorOutlineOutlinedIcon sx={{ fontSize: '100px', color: 'orange' }} />
                          <p style={{ fontSize: '20px', fontWeight: 900 }}>{`Please Select From date`}</p>
                        </>
                      );
                      handleClickOpenerr();
                    } else if (new Date(selectedDate) <= new Date(fromdateval)) {
                      setShowAlert(
                        <>
                          <ErrorOutlineOutlinedIcon sx={{ fontSize: '100px', color: 'orange' }} />
                          <p style={{ fontSize: '20px', fontWeight: 900 }}>{`To Date should be after or equal to From Date`}</p>
                        </>
                      );
                      handleClickOpenerr();

                      setOverallState({ ...overallState, todate: '' });
                    } else if (new Date(selectedDate) <= new Date()) {
                      // setSelectedTodate(selectedDate);
                      setOverallState({ ...overallState, todate: selectedDate });
                    } else {
                      setOverallState({ ...overallState,  todate: "" })
                    }
                  }}
                  // Set the max attribute to the current date
                  inputProps={{ max: new Date().toISOString().split('T')[0], min: overallState.fromdate !== '' ? overallState.fromdate : null }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={3}>
              <FormControl fullWidth size="small">
                <Typography>From Time</Typography>
                {/* <OutlinedInput
                                    id="component-outlined"
                                    type="time"
                                    value={overallState.fromtime}
                                    onChange={(e) => {
                                        setOverallState({ ...overallState, fromtime: e.target.value });
                                    }}
                                /> */}
                <Space wrap>
                  <TimePicker use12Hours format="h:mm:ss A" size="large" disabled={overallState.shift === 'Shift Based'} value={overallState.fromtime} defaultValue={dayjs('00:00:00', 'HH:mm:ss a')} onChange={handleTimeChange} allowClear={false} />
                </Space>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={3}>
              <FormControl fullWidth size="small">
                <Typography>To Time</Typography>
                {/* <OutlinedInput
                                    id="component-outlined"
                                    type="time"
                                    value={overallState.totime}
                                    onChange={(e) => {
                                        setOverallState({ ...overallState, totime: e.target.value });
                                    }}
                                /> */}
                <Space wrap>
                  <TimePicker use12Hours format="h:mm:ss A" size="large" disabled={overallState.shift === 'Shift Based'} value={overallState.totime} defaultValue={dayjs('00:00:00', 'HH:mm:ss a')} onChange={handleToTimeChange} allowClear={false} />
                </Space>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={6}>
              <FormControl fullWidth>
                <Typography>
                  Category<b style={{ color: 'red' }}>*</b>
                </Typography>
                <MultiSelect
                  options={categoryOpt.filter(item => selectedProject.map(t=> t.value).includes(item.project)  )}
                  value={selectedOptionsCategory}
                  onChange={(e) => {
                    handleCategoryChange(e);
                  }}
                  valueRenderer={customValueRendererCategory}
                  labelledBy="Please Select Category"
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={6}>
              <FormControl fullWidth>
                <Typography>
                  Sub Category<b style={{ color: 'red' }}>*</b>
                </Typography>
                <MultiSelect
                  options={subcategory.filter(item => selectedProject.map(t=> t.value).includes(item.project) && selectedOptionsCategory.map(t=> t.value).includes(item.categoryname)  )}
                  value={selectedOptionsSubCategory}
                  onChange={(e) => {
                    handleSubCategoryChange(e);
                  }}
                  valueRenderer={customValueRendererSubCategory}
                  labelledBy="Please Select SubCategory"
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>All Login Id</Typography>
                <MultiSelect options={loginAllotFilter} value={selectedOptionsLoginid} onChange={handleLoginChangeFrom} valueRenderer={customValueRendererLoginFrom} labelledBy="Please Select Login" />
              </FormControl>
            </Grid>

            <Grid item md={3} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>Employee Name</Typography>
                <MultiSelect options={employeeOption} value={selectedEmployeeFrom} onChange={handleEmployeeChangeFrom} valueRenderer={customValueRendererEmployeeFrom} labelledBy="Please Select Employeename" />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>With/Without Duplicate</Typography>
                <Selects
                  options={[
                    { label: 'With Duplicate', value: 'With Duplicate' },
                    { label: 'Without Duplicate', value: 'Without Duplicate' },
                  ]}
                  value={{ label: selectedDupe, value: selectedDupe }}
                  onChange={(e) => setSelectedDupe(e.value)}
                />
              </FormControl>
            </Grid>
           
          </Grid>
          {isUserRoleCompare?.includes("loverallreport") && ( 
          <Grid item md={12} sm={12} xs={12}>
            <br />
            <Grid sx={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
              <Button
                variant="contained"
                onClick={(e) => {
                  handleSubmit(e);
                }}
              >
                {' '}
                Filter
              </Button>
              <Button sx={userStyle.btncancel} onClick={handleClear}>
                {' '}
                CLEAR
              </Button>
            </Grid>
          </Grid>
            )}
        </>
      </Box>

      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("loverallreport") && ( 
            
      <Box sx={userStyle.container}>
        {/* ******************************************************EXPORT Buttons****************************************************** */}
        <Grid item xs={8}>
          <Typography sx={userStyle.importheadtext}>Overall Report</Typography>
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
                sx={{ width: '77px' }}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
                <MenuItem value={productionFilter?.length}>All</MenuItem>
              </Select>
            </Box>
          </Grid>
          <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box>
              {isUserRoleCompare?.includes("exceloverallreport") && ( 
            
              <>
                <Button
                  onClick={(e) => {
                    setIsFilterOpen(true);
                    setFormat('xl');
                  }}
                  sx={userStyle.buttongrp}
                >
                  <FaFileExcel />
                  &ensp;Export to Excel&ensp;
                </Button>
              </>
             )}
                            {isUserRoleCompare?.includes("csvoverallreport") && ( 
           
              <>
                <Button
                  onClick={(e) => {
                    setIsFilterOpen(true);
                    setFormat('csv');
                  }}
                  sx={userStyle.buttongrp}
                >
                  <FaFileCsv />
                  &ensp;Export to CSV&ensp;
                </Button>
              </>
             )}
                            {isUserRoleCompare?.includes("printoverallreport") && ( 
              <>
                <Button sx={userStyle.buttongrp} onClick={handleprint}>
                  &ensp;
                  <FaPrint />
                  &ensp;Print&ensp;
                </Button>
              </>
              )}
                            {isUserRoleCompare?.includes("pdfoverallreport") && (  
            
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
                            {isUserRoleCompare?.includes("imageoverallreport") && ( 
              <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                {' '}
                <ImageIcon sx={{ fontSize: '15px' }} /> &ensp;Image&ensp;{' '}
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
        <br />
        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
          Show All Columns
        </Button>
        &ensp;
        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
          Manage Columns
        </Button>
        &ensp;
        {/* Show "Load More" button if there's more data */}
        {hasMoreData && !isLoading && productionFilter.length > 0 && (
          <Button variant="contained" onClick={loadMore}>
            Load More
          </Button>
        )}
        <br />
        <br />
        {sourceCheck ? (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              {/* <CircularProgress color="inherit" />  */}
              <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
            </Box>
          </>
        ) : (
          <>
            <Box
              style={{
                width: '100%',
                overflowY: 'hidden', // Hide the y-axis scrollbar
              }}
            >
              <CustomStyledDataGrid
                onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                rows={rowsWithCheckboxes}
                columns={columnDataTable.filter((column) => columnVisibility[column.field])}
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
                  <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={page === pageNumber ? 'active' : ''} disabled={page === pageNumber}>
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
      
  

      {/* Manage Column */}
      <Popover
        id={id}
        open={isManageColumnsOpen}
        anchorEl={anchorEl}
        onClose={handleCloseManageColumns}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        {manageColumnsContent}
      </Popover>

      {/* Delete Modal */}
      <Box>
        {/* print layout */}

        <TableContainer component={Paper} sx={userStyle.printcls}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
            <TableHead>
              <TableRow>
                <TableCell> SI.No</TableCell>
                <TableCell>Mode</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Branch</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Team</TableCell>
                <TableCell>Vendor</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>SubCategory</TableCell>
                <TableCell>Unit Identifier</TableCell>

                <TableCell>EmpCode</TableCell>
                <TableCell>Emp Name</TableCell>
                <TableCell>LoginId</TableCell>
                <TableCell>Date</TableCell>

                <TableCell>U-Unitrate</TableCell>
                <TableCell>U-Points</TableCell>
                <TableCell>U-Section</TableCell>
                <TableCell>U-FlagCount</TableCell>

                <TableCell>A-Unitrate</TableCell>
                <TableCell>A-Points</TableCell>
                <TableCell>A-Section</TableCell>
                <TableCell>A-FlagCount</TableCell>

                <TableCell>Total Points</TableCell>
                <TableCell>WorkTook</TableCell>
                <TableCell>UserName</TableCell>
              </TableRow>
            </TableHead>
            <TableBody align="left">
              {rowDataTable &&
                rowDataTable.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.mode}</TableCell>
                    <TableCell>{row.company}</TableCell>
                    <TableCell>{row.branch}</TableCell>
                    <TableCell>{row.unit}</TableCell>
                    <TableCell>{row.team}</TableCell>
                    <TableCell>{row.vendor}</TableCell>
                    <TableCell>{row.filename}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>{row.unitid}</TableCell>

                    <TableCell>{row.empcode}</TableCell>
                    <TableCell>{row.empname}</TableCell>
                    <TableCell>{row.user}</TableCell>
                    <TableCell>{row.dateval}</TableCell>

                    <TableCell>{row.unitrate}</TableCell>
                    <TableCell>{row.points}</TableCell>
                    <TableCell>{row.section}</TableCell>
                    <TableCell>{row.flagcount}</TableCell>

                    <TableCell>{row.cunitrate}</TableCell>
                    <TableCell>{row.cpoints}</TableCell>
                    <TableCell>{row.csection}</TableCell>
                    <TableCell>{row.cflagcount}</TableCell>

                    <TableCell>{row.totalpoints}</TableCell>
                    <TableCell>{row.worktook}</TableCell>
                    <TableCell>{row.username}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box>
        {/* ALERT DIALOG */}
        <Dialog open={isDeleteOpenalert} onClose={handleCloseModalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: '70px', color: 'orange' }} />
            <Typography variant="h6" sx={{ color: 'black', textAlign: 'center' }}>
              Please Select any Row
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button autoFocus variant="contained" color="error" onClick={handleCloseModalert}>
              {' '}
              OK{' '}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={filteredData ?? []}
        itemsTwo={items ?? []}
        filename={'Overall Report'}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />

      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <Dialog open={isLoadMorePopupOpen} onClose={handleLoadMoreClosePopup} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ textAlign: 'center', alignItems: 'center' }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: '60px', color: 'skyblue' }} />
          <Typography variant="h6">Loaded {productionFilter.length} Data</Typography>
          <Typography variant="body1"> Do you want to load more data?</Typography>
        </DialogContent>
        <DialogActions>
          <Button sx={buttonStyles.btncancel} onClick={handleLoadMoreClosePopup}>
            No
          </Button>
          <Button sx={buttonStyles.buttonsubmit} onClick={handleLoadMore} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <MessageAlert openPopup={openPopupMalert} handleClosePopup={handleClosePopupMalert} popupContent={popupContentMalert} popupSeverity={popupSeverityMalert} />
      {/* SUCCESS */}
      <AlertDialog openPopup={openPopup} handleClosePopup={handleClosePopup} popupContent={popupContent} popupSeverity={popupSeverity} />
    </Box>
  );
}

export default OverallReport;