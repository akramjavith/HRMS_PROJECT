import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import ImageIcon from '@mui/icons-material/Image';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
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
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Popover,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
} from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import axios from 'axios';
import { City, Country, State } from 'country-state-city';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment-timezone';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { FaFilePdf, FaPrint } from 'react-icons/fa';
import { ThreeDots } from 'react-loader-spinner';
import { MultiSelect } from 'react-multi-select-component';
import Selects from 'react-select';
import { useReactToPrint } from 'react-to-print';
import { handleApiError } from '../../../../components/Errorhandling';
import Headtitle from '../../../../components/Headtitle';
import PageHeading from '../../../../components/PageHeading';
import { StyledTableCell, StyledTableRow } from '../../../../components/Table';
import { AuthContext, UserRoleAccessContext } from '../../../../context/Appcontext';
import { userStyle } from '../../../../pageStyle';
import { SERVICE } from '../../../../services/Baseservice';

import * as FileSaver from 'file-saver';
import { FaFileCsv, FaFileExcel } from 'react-icons/fa';
import * as XLSX from 'xlsx';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import AggregatedSearchBar from '../../../../components/AggregatedSearchBar';
import AggridTable from '../../../../components/AggridTable';
import AlertDialog from '../../../../components/Alert';
import ExportData from '../../../../components/ExportData';
import MessageAlert from '../../../../components/MessageAlert';
import domtoimage from 'dom-to-image';
import {
  religionOptions,
  address_type,
  personal_prefix,
  landmark_and_positional_prefix
} from '../../../../components/Componentkeyword';
import FullAddressCard from '../../../../components/FullAddressCard.js';

function Personalupdate() {
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);

  const [overallItems, setOverallItems] = useState([]);

  let exportColumnNames = ['Name', 'Employee Code', 'Company', 'Branch', 'Unit', 'Team', 'Work Mode'];
  let exportRowValues = ['companyname', 'empcode', 'company', 'branch', 'unit', 'team', 'workmode'];

  const [isHandleChange, setIsHandleChange] = useState(false);
  const [searchedString, setSearchedString] = useState('');

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
  const currentYear = new Date().getFullYear();
  const maxDate = `${currentYear - 16}-12-31`;

  function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  const LoadingDialog = ({ open, onClose, progress }) => {
    const dialogStyles = {
      padding: '24px',
      textAlign: 'center',
    };

    const dialogTitleStyles = {
      fontWeight: 'bold',
      fontSize: '1.5rem',
      color: '#3f51b5', // Primary color
    };

    const dialogContentStyles = {
      padding: '16px',
    };

    const progressStyles = {
      marginTop: '16px',
      height: '10px',
      borderRadius: '5px',
    };

    const progressTextStyles = {
      marginTop: '8px',
      fontWeight: 'bold',
      color: '#4caf50', // Success color
    };

    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle style={dialogTitleStyles}>Updating...</DialogTitle>
        <DialogContent style={dialogContentStyles}>
          <Typography>Please wait while we update the empaddform names across all pages.</Typography>
          <LinearProgress style={progressStyles} variant="determinate" value={progress} />
          <Typography style={progressTextStyles}>{progress}%</Typography>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    );
  };

  //SELECT DROPDOWN STYLES
  const colourStyles = {
    menuList: (styles) => ({
      ...styles,
      background: 'white',
    }),
    option: (styles, { isFocused, isSelected }) => ({
      ...styles,
      // color:'black',
      color: isFocused ? 'rgb(255 255 255, 0.5)' : isSelected ? 'white' : 'black',
      background: isFocused ? 'rgb(25 118 210, 0.7)' : isSelected ? 'rgb(25 118 210, 0.5)' : null,
      zIndex: 1,
    }),
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
  };

  const [empaddform, setEmpaddform] = useState({
    prefix: '',
    firstname: '',
    lastname: '',
    legalname: '',
    callingname: '',
    fathername: '',
    mothername: '',
    gender: '',
    dom: '',
    maritalstatus: '',
    religion: '',
    dob: '',
    bloodgroup: '',
    pdoorno: '',
    pstreet: '',
    parea: '',
    plandmark: '',
    ptaluk: '',
    ppost: '',
    ppincode: '',
    paddresstype: '',
    ppersonalprefix: '',
    presourcename: '',
    plandmarkandpositionalprefix: '',
    pgpscoordination: '',
    caddresstype: '',
    cpersonalprefix: '',
    cresourcename: '',
    clandmarkandpositionalprefix: '',
    cgpscoordination: '',
    pcountry: '',
    pstate: '',
    pcity: '',
    cdoorno: '',
    cstreet: '',
    carea: '',
    clandmark: '',
    ctaluk: '',
    cpost: '',
    cpincode: '',
    ccountry: '',
    cstate: '',
    ccity: '',
    empcode: '',
    nothing: '',
  });

  // Country city state datas
  const [selectedCountryp, setSelectedCountryp] = useState({
    label: 'India',
    name: 'India',
  });
  const [selectedStatep, setSelectedStatep] = useState({
    label: 'Tamil Nadu',
    name: 'Tamil Nadu',
  });
  const [selectedCityp, setSelectedCityp] = useState({
    label: 'Tiruchirapalli',
    name: 'Tiruchirapalli',
  });

  const [selectedCountryc, setSelectedCountryc] = useState({
    label: 'India',
    name: 'India',
  });
  const [selectedStatec, setSelectedStatec] = useState({
    label: 'Tamil Nadu',
    name: 'Tamil Nadu',
  });
  const [selectedCityc, setSelectedCityc] = useState({
    label: 'Tiruchirapalli',
    name: 'Tiruchirapalli',
  });

  const [filterState, setFilterState] = useState({
    type: 'Individual',
    employeestatus: 'Please Select Employee Status',
  });
  const TypeOptions = [
    { label: 'Individual', value: 'Individual' },
    { label: 'Department', value: 'Department' },
    { label: 'Company', value: 'Company' },
    { label: 'Branch', value: 'Branch' },
    { label: 'Unit', value: 'Unit' },
    { label: 'Team', value: 'Team' },
  ];
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const fetchDepartments = async () => {
    try {
      let req = await axios.get(SERVICE.DEPARTMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDepartmentOptions(
        req?.data?.departmentdetails?.map((data) => ({
          label: data?.deptname,
          value: data?.deptname,
        }))
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  useEffect(() => {
    fetchDepartments();
  }, []);

  //department multiselect
  const [selectedOptionsDepartment, setSelectedOptionsDepartment] = useState([]);
  let [valueDepartmentCat, setValueDepartmentCat] = useState([]);

  const handleDepartmentChange = (options) => {
    setValueDepartmentCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsDepartment(options);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
    setValueEmp([]);
  };

  const customValueRendererDepartment = (valueDepartmentCat, _categoryname) => {
    return valueDepartmentCat?.length ? valueDepartmentCat.map(({ label }) => label)?.join(', ') : 'Please Select Department';
  };
  //empaddform multiselect
  const [selectedOptionsEmployee, setSelectedOptionsEmployee] = useState([]);
  let [valueEmployeeCat, setValueEmployeeCat] = useState([]);

  const handleEmployeeChange = (options) => {
    setValueEmployeeCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setValueEmp(
      options.map((a, index) => {
        return a.value;
      })
    );

    setSelectedOptionsEmployee(options);
  };

  const customValueRendererEmployee = (valueEmployeeCat, _categoryname) => {
    return valueEmployeeCat?.length ? valueEmployeeCat.map(({ label }) => label)?.join(', ') : 'Please Select Employee';
  };

  const [getrowid, setRowGetid] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState([]);
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState('');

  const { isUserRoleCompare, isUserRoleAccess, allTeam, isAssignBranch, pageName, setPageName, buttonStyles, allUsersData, allUsersLimit } = useContext(UserRoleAccessContext);

  const accessbranch = isUserRoleAccess?.role?.includes('Manager')
    ? isAssignBranch?.map((data) => ({
      branch: data.branch,
      company: data.company,
      unit: data.unit,
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
        unit: data.unit,
      }));

  // const [username, setUsername] = useState("");
  const { auth, setAuth } = useContext(AuthContext);
  const username = isUserRoleAccess.username;

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
      pagename: String('Personal Update'),
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
  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener('beforeunload', beforeUnloadHandler);
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, []);

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [personalcheck, setpersonalcheck] = useState(false);

  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage
        .toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, 'Personal Info Update.png');
        })
        .catch((error) => {
          console.error('dom-to-image error: ', error);
        });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };

  // Copied fields Name
  const handleCopy = (message) => {
    NotificationManager.success(`${message} 👍`, '', 2000);
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
    return ''; // Return an empty string for other rows
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    companyname: true,
    empcode: true,
    company: true,
    branch: true,
    unit: true,
    team: true,
    workmode: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  // Edit model
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === 'backdropClick') return;
    setIsEditOpen(false);
  };

  const [oldNames, setOldNames] = useState({
    firstname: '',
    lastname: '',
    companyname: '',
    employeecode: '',
  });

  const [companycaps, setcompanycaps] = useState('');

  const getCode = async (e) => {
    setPageName(!pageName);
    try {
      let response = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const savedEmployee = response?.data?.suser;

      setEmpaddform({
        ...savedEmployee,
        paddresstype: savedEmployee?.paddresstype ? savedEmployee?.paddresstype : "",
        ppersonalprefix: savedEmployee?.ppersonalprefix ? savedEmployee?.ppersonalprefix : "",
        presourcename: savedEmployee?.presourcename ? savedEmployee?.presourcename : "",
        plandmarkandpositionalprefix: savedEmployee?.plandmarkandpositionalprefix ? savedEmployee?.plandmarkandpositionalprefix : "",
        pgpscoordination: savedEmployee?.pgpscoordination ? savedEmployee?.pgpscoordination : "",
        caddresstype: savedEmployee?.caddresstype ? savedEmployee?.caddresstype : "",
        cpersonalprefix: savedEmployee?.cpersonalprefix ? savedEmployee?.cpersonalprefix : "",
        cresourcename: savedEmployee?.cresourcename ? savedEmployee?.cresourcename : "",
        clandmarkandpositionalprefix: savedEmployee?.clandmarkandpositionalprefix ? savedEmployee?.clandmarkandpositionalprefix : "",
        cgpscoordination: savedEmployee?.cgpscoordination ? savedEmployee?.cgpscoordination : "",
        religion: savedEmployee?.religion || '',
        callingname: savedEmployee?.callingname ?? savedEmployee?.legalname,
        age: calculateAge(savedEmployee?.dob),
        panstatus: savedEmployee?.panno ? 'Have PAN' : savedEmployee?.panrefno ? 'Applied' : 'Yet to Apply',
      });

      setOldNames({
        firstname: savedEmployee?.firstname,
        lastname: savedEmployee?.lastname,
        companyname: savedEmployee?.companyname,
        employeecode: savedEmployee?.empcode,
      });
      setcompanycaps(savedEmployee?.companyname);

      // Find the corresponding Country, State, and City objects
      const country = Country.getAllCountries().find((country) => country.name === savedEmployee.ccountry);
      const state = State.getStatesOfCountry(country?.isoCode).find((state) => state.name === savedEmployee.cstate);
      const city = City.getCitiesOfState(state?.countryCode, state?.isoCode).find((city) => city.name === savedEmployee.ccity);

      // Find the corresponding Country, State, and City objects
      const countryp = Country.getAllCountries().find((country) => country.name === savedEmployee.pcountry);
      const statep = State.getStatesOfCountry(country?.isoCode).find((state) => state.name === savedEmployee.pstate);
      const cityp = City.getCitiesOfState(state?.countryCode, state?.isoCode).find((city) => city.name === savedEmployee.pcity);
      setSelectedCityc(city);
      setSelectedCountryc(country);
      setSelectedStatec(state);
      setSelectedCountryp(countryp);
      setSelectedStatep(statep);
      setSelectedCityp(cityp);

      setRowGetid(response?.data?.suser);
      handleClickOpenEdit();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };

  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setEmpaddform(res?.data?.suser);
      setRowGetid(res?.data?.suser);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
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

  //personalupadate updateby edit page...
  let updateby = empaddform.updatedby;
  let addedby = empaddform.addedby;

  //EDIT POST CALL
  let logedit = getrowid._id;
  const [uploadProgress, setUploadProgress] = useState(0);
  const [openPopupUpload, setOpenPopupUpload] = useState(false);
  const sendRequestt = async () => {
    setPageName(!pageName);
    try {
      if (empaddform.firstname?.toLowerCase() !== oldNames?.firstname?.toLowerCase() || empaddform.lastname?.toLowerCase() !== oldNames?.lastname?.toLowerCase()) {
        setOpenPopupUpload(true);

        // State for tracking overall upload progress
        let totalLoaded = 0;
        let totalSize = 0;

        const handleUploadProgress = (progressEvent) => {
          if (progressEvent.event.lengthComputable) {
            console.log(`Progress Event - Loaded: ${progressEvent.loaded}, Total: ${progressEvent.total}`);
            updateTotalProgress(progressEvent.loaded, progressEvent.total);
          } else {
            console.log('Unable to compute progress information.');
          }
        };

        const updateTotalProgress = (loaded, size) => {
          totalLoaded += loaded;
          totalSize += size;
          if (totalSize > 0) {
            const percentCompleted = Math.round((totalLoaded * 100) / totalSize);
            setUploadProgress(percentCompleted);
            console.log(`Total Upload Progress: ${percentCompleted}%`);
          } else {
            console.log('Total size is zero, unable to compute progress.');
          }
        };

        let companynamecheck = await axios.post(
          SERVICE.COMPANYNAME_DUPLICATECHECK_CREATE,
          {
            aadhar: empaddform.aadhar,
            firstname: empaddform.firstname,
            lastname: empaddform.lastname,
            dob: empaddform.dob,
            employeename: `${empaddform.firstname?.toUpperCase()}.${empaddform.lastname?.toUpperCase()}`,
          },
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            onUploadProgress: handleUploadProgress,
          }
        );

        let newCompanyName = companynamecheck?.data?.uniqueCompanyName;

        setcompanycaps(newCompanyName);

        let res = await axios.put(
          `${SERVICE.USER_SINGLE_PWD}/${logedit}`,
          {
            prefix: String(empaddform.prefix ? empaddform.prefix : 'Mr'),
            firstname: String(empaddform.firstname),
            lastname: String(empaddform.lastname),
            legalname: String(empaddform.legalname),
            callingname: String(empaddform.firstname),
            fathername: String(empaddform.fathername),
            mothername: String(empaddform.mothername),
            companyname: String(newCompanyName),
            gender: String(empaddform.gender),
            maritalstatus: String(empaddform.maritalstatus),
            dom: String(empaddform.dom),
            dob: String(empaddform.dob),
            religion: String(empaddform.religion),
            bloodgroup: String(empaddform.bloodgroup),
            aadhar: String(empaddform.aadhar),
            panno: String(empaddform.panstatus === 'Have PAN' ? empaddform.panno : ''),
            panstatus: String(empaddform.panstatus),
            panrefno: String(empaddform.panstatus === 'Applied' ? empaddform.panrefno : ''),
            pdoorno: String(empaddform.pdoorno),
            pstreet: String(empaddform.pstreet),
            parea: String(empaddform.parea),
            plandmark: String(empaddform.plandmark),
            ptaluk: String(empaddform.ptaluk),
            ppost: String(empaddform.ppost),
            paddresstype: String(empaddform?.paddresstype || ''),
            ppersonalprefix: String(empaddform?.ppersonalprefix || ''),
            presourcename: String(empaddform?.presourcename || ''),
            plandmarkandpositionalprefix: String(empaddform?.plandmarkandpositionalprefix || ''),
            pgpscoordination: String(empaddform?.pgpscoordination || ''),
            caddresstype: !empaddform.samesprmnt ? String(empaddform?.caddresstype || '') : String(empaddform?.paddresstype || ''),
            cpersonalprefix: !empaddform.samesprmnt ? String(empaddform?.cpersonalprefix || '') : String(empaddform?.ppersonalprefix || ''),
            cresourcename: !empaddform.samesprmnt ? String(empaddform?.cresourcename || '') : String(empaddform?.presourcename || ''),
            clandmarkandpositionalprefix: !empaddform.samesprmnt ? String(empaddform?.clandmarkandpositionalprefix || '') : String(empaddform?.plandmarkandpositionalprefix || ''),
            cgpscoordination: !empaddform.samesprmnt ? String(empaddform?.cgpscoordination || '') : String(empaddform?.pgpscoordination || ''),
            ppincode: String(empaddform.ppincode),
            pcountry: String(selectedCountryp.name),
            pstate: String(selectedStatep.name),
            pcity: String(selectedCityp.name),
            samesprmnt: Boolean(empaddform.samesprmnt),
            cdoorno: String(!empaddform.samesprmnt ? empaddform.cdoorno : empaddform.pdoorno),
            cstreet: String(!empaddform.samesprmnt ? empaddform.cstreet : empaddform.pstreet),
            carea: String(!empaddform.samesprmnt ? empaddform.carea : empaddform.parea),
            clandmark: String(!empaddform.samesprmnt ? empaddform.clandmark : empaddform.plandmark),
            ctaluk: String(!empaddform.samesprmnt ? empaddform.ctaluk : empaddform.ptaluk),
            cpost: String(!empaddform.samesprmnt ? empaddform.cpost : empaddform.ppost),
            cpincode: String(!empaddform.samesprmnt ? empaddform.cpincode : empaddform.ppincode),
            ccountry: String(!empaddform.samesprmnt ? selectedCountryc.name : selectedCountryp.name),
            cstate: String(!empaddform.samesprmnt ? selectedStatec.name : selectedStatep.name),
            ccity: String(!empaddform.samesprmnt ? selectedCityc.name : selectedCityp.name),
            updatedby: [
              ...updateby,
              {
                name: String(isUserRoleAccess.companyname),
                date: String(new Date()),
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            onUploadProgress: handleUploadProgress,
          }
        );

        let updateOverAllEmployeeName = await axios.put(
          `${SERVICE.EMPLOYEENAMEOVERALLUPDATE}`,
          {
            oldname: oldNames?.companyname,
            newname: newCompanyName,
          },
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            onUploadProgress: handleUploadProgress,
          }
        );

        setOpenPopupUpload(false);
      } else if (empaddform.firstname?.toLowerCase() === oldNames?.firstname?.toLowerCase() && empaddform.lastname?.toLowerCase() === oldNames?.lastname?.toLowerCase()) {
        setcompanycaps(oldNames.companyname);

        let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${logedit}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          prefix: String(empaddform.prefix ? empaddform.prefix : 'Mr'),
          firstname: String(empaddform.firstname),
          lastname: String(empaddform.lastname),
          legalname: String(empaddform.legalname),
          callingname: String(empaddform.firstname),
          fathername: String(empaddform.fathername),
          mothername: String(empaddform.mothername),
          companyname: String(oldNames.companyname),
          gender: String(empaddform.gender),
          maritalstatus: String(empaddform.maritalstatus),
          dom: String(empaddform.dom),
          dob: String(empaddform.dob),
          religion: String(empaddform.religion),
          bloodgroup: String(empaddform.bloodgroup),
          aadhar: String(empaddform.aadhar),
          panno: String(empaddform.panstatus === 'Have PAN' ? empaddform.panno : ''),
          panstatus: String(empaddform.panstatus),
          panrefno: String(empaddform.panstatus === 'Applied' ? empaddform.panrefno : ''),
          pdoorno: String(empaddform.pdoorno),
          pstreet: String(empaddform.pstreet),
          parea: String(empaddform.parea),
          plandmark: String(empaddform.plandmark),
          ptaluk: String(empaddform.ptaluk),
          ppost: String(empaddform.ppost),
          paddresstype: String(empaddform?.paddresstype || ''),
          ppersonalprefix: String(empaddform?.ppersonalprefix || ''),
          presourcename: String(empaddform?.presourcename || ''),
          plandmarkandpositionalprefix: String(empaddform?.plandmarkandpositionalprefix || ''),
          pgpscoordination: String(empaddform?.pgpscoordination || ''),
          caddresstype: !empaddform.samesprmnt ? String(empaddform?.caddresstype || '') : String(empaddform?.paddresstype || ''),
          cpersonalprefix: !empaddform.samesprmnt ? String(empaddform?.cpersonalprefix || '') : String(empaddform?.ppersonalprefix || ''),
          cresourcename: !empaddform.samesprmnt ? String(empaddform?.cresourcename || '') : String(empaddform?.presourcename || ''),
          clandmarkandpositionalprefix: !empaddform.samesprmnt ? String(empaddform?.clandmarkandpositionalprefix || '') : String(empaddform?.plandmarkandpositionalprefix || ''),
          cgpscoordination: !empaddform.samesprmnt ? String(empaddform?.cgpscoordination || '') : String(empaddform?.pgpscoordination || ''),
          ppincode: String(empaddform.ppincode),
          pcountry: String(selectedCountryp.name),
          pstate: String(selectedStatep.name),
          pcity: String(selectedCityp.name),
          samesprmnt: Boolean(empaddform.samesprmnt),
          cdoorno: String(!empaddform.samesprmnt ? empaddform.cdoorno : empaddform.pdoorno),
          cstreet: String(!empaddform.samesprmnt ? empaddform.cstreet : empaddform.pstreet),
          carea: String(!empaddform.samesprmnt ? empaddform.carea : empaddform.parea),
          clandmark: String(!empaddform.samesprmnt ? empaddform.clandmark : empaddform.plandmark),
          ctaluk: String(!empaddform.samesprmnt ? empaddform.ctaluk : empaddform.ptaluk),
          cpost: String(!empaddform.samesprmnt ? empaddform.cpost : empaddform.ppost),
          cpincode: String(!empaddform.samesprmnt ? empaddform.cpincode : empaddform.ppincode),
          ccountry: String(!empaddform.samesprmnt ? selectedCountryc.name : selectedCountryp.name),
          cstate: String(!empaddform.samesprmnt ? selectedStatec.name : selectedStatep.name),
          ccity: String(!empaddform.samesprmnt ? selectedCityc.name : selectedCityp.name),
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        });
      }

      await fetchEmployee();
      setPopupContent('Updated Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();

      handleCloseModEdit();
    } catch (err) {
      setOpenPopupUpload(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const editSubmit = (e) => {
    e.preventDefault();
    sendRequestt();
  };

  function AadharValidate(aadhar) {
    var adharcardTwelveDigit = /^\d{12}$/;
    var adharSixteenDigit = /^\d{16}$/;

    if (aadhar !== '') {
      if (aadhar.match(adharcardTwelveDigit) || aadhar.match(adharSixteenDigit)) {
        if (aadhar[0] !== '0' && aadhar[0] !== '1') {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  function PanValidate(pan) {
    let panregex = /^([A-Z]){5}([0-9]){4}([A-Z]){1}$/;
    if (pan !== '') {
      if (pan.match(panregex)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    if (empaddform.firstname === '') {
      setPopupContentMalert('Please enter Name');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (empaddform.lastname === '') {
      setPopupContentMalert('Please Enter Last Name');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (empaddform.lastname.length < 3) {
      setPopupContentMalert('Last Name must be 3 characters!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (empaddform.legalname === '') {
      setPopupContentMalert('Please Enter Legal Name');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    }
    // else if (
    //   empaddform.callingname === "" ||
    //   empaddform.callingname == undefined
    // ) {
    //   setPopupContentMalert('Please Enter Calling Name');
    //   setPopupSeverityMalert("info");
    //   handleClickOpenPopupMalert();
    // }
    //  else if (
    //   empaddform.callingname !== "" &&
    //   empaddform.legalname !== "" &&
    //   empaddform.callingname?.toLowerCase() ===
    //   empaddform.legalname?.toLowerCase()
    // ) {
    //   setPopupContentMalert("Legal Name and Calling Name can't be same");
    //   setPopupSeverityMalert("info");
    //   handleClickOpenPopupMalert();
    // }
    else if (empaddform.maritalstatus === 'Married' && empaddform.dom === '') {
      setPopupContentMalert('Please Select Date of Marriage');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (empaddform.dob === '') {
      setPopupContentMalert('Please Select Date of Birth');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (empaddform.aadhar === '') {
      setPopupContentMalert('Please Enter Aadhar No');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (empaddform.aadhar && empaddform.aadhar?.length !== 12) {
      setPopupContentMalert('Aadhar No must be 12 digits required');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (empaddform.aadhar !== '' && !AadharValidate(empaddform.aadhar)) {
      setPopupContentMalert('Please Enter valid Aadhar Number');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (empaddform?.panno !== '' && empaddform?.panno?.length !== 10) {
      setPopupContentMalert('Pan No must be 10 digits required');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (empaddform?.panno !== '' && !PanValidate(empaddform?.panno)) {
      setPopupContentMalert('Please Enter Valid PAN Number');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (empaddform?.panno === '' && empaddform?.panstatus === 'Have PAN') {
      setPopupContentMalert('Please Enter Pan No');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (empaddform?.panrefno === '' && empaddform?.panstatus === 'Applied') {
      setPopupContentMalert('Please Enter Application Reference No');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (
      !empaddform?.religion
      //  &&
      // empaddform?.workmode !== "Internship"
    ) {
      setPopupContentMalert('Please Select Religion');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else {
      sendRequestt();
    }
  };

  const handlechangecpincode = (e) => {
    const regex = /^[0-9]+$/; // Only allows positive integers
    const inputValue = e.target.value?.slice(0, 6);
    if (regex.test(inputValue) || inputValue === '') {
      setEmpaddform({ ...empaddform, cpincode: inputValue });
    }
  };
  const handlechangeppincode = (e) => {
    const regex = /^[0-9]+$/; // Only allows positive integers
    const inputValue = e.target.value?.slice(0, 6);
    if (regex.test(inputValue) || inputValue === '') {
      setEmpaddform({ ...empaddform, ppincode: inputValue });
    }
  };

  let printno = 1;

  //------------------------------------------------------

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const [fileFormat, setFormat] = useState('xl');
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = fileFormat === 'xl' ? '.xlsx' : '.csv';

  const exportToExcel = (excelData, fileName) => {
    setPageName(!pageName);
    try {
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

      // Check if the browser supports Blob and FileSaver
      if (!Blob || !FileSaver) {
        console.error('Blob or FileSaver not supported');
        return;
      }

      const data = new Blob([excelBuffer], { type: fileType });

      // Check if FileSaver.saveAs is available
      if (!FileSaver.saveAs) {
        console.error('FileSaver.saveAs is not available');
        return;
      }

      FileSaver.saveAs(data, fileName + fileExtension);
    } catch (error) {
      console.error('Error exporting to Excel', error);
    }
  };

  const formatData = (data) => {
    return data.map((item, index) => {
      return {
        Sno: index + 1,
        Name: item.companyname || '',
        'Employee Code': item.empcode || '',
        Company: item.company || '',
        Branch: item.branch || '',
        Unit: item.unit || '',
        Team: item.team || '',
      };
    });
  };

  const handleExportXL = (isfilter) => {
    const dataToExport = isfilter === 'filtered' ? filteredData : employees;

    if (!dataToExport || dataToExport.length === 0) {
      console.error('No data available to export');
      return;
    }

    exportToExcel(formatData(dataToExport), 'PersonalInformationUpdate');
    setIsFilterOpen(false);
  };

  //  PDF
  // pdf.....
  const columns = [
    { title: 'Name', field: 'companyname' },
    { title: 'Employee Code', field: 'empcode' },
    { title: 'Company', field: 'company' },
    { title: 'Branch', field: 'branch' },
    { title: 'Unit', field: 'unit' },
    { title: 'Team', field: 'team' },
  ];

  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();

    // Initialize serial number counter
    // Modify columns to include serial number column
    const columnsWithSerial = [
      { title: 'S.No', dataKey: 'serialNumber' }, // Serial number column
      ...columns.map((col) => ({ title: col.title, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial =
      isfilter === 'filtered'
        ? filteredData.map((t, index) => ({
          ...t,
          serialNumber: index + 1,
        }))
        : employees?.map((item, index) => ({
          ...item,
          serialNumber: index + 1,
        }));

    // Generate PDF
    doc.autoTable({
      theme: 'grid',
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: 5 },
    });

    doc.save('PersonalInformationUpdate.pdf');
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'PersonalInformationUpdate',
    pageStyle: 'print',
  });

  //table entries ..,.
  const [items, setItems] = useState([]);

  const addSerialNumber = (datas) => {
    const itemsWithSerialNumber = datas?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
    setOverallItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber(employees);
  }, [employees]);

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
      field: 'serialNumber',
      headerName: 'SNo',
      flex: 0,
      width: 90,
      hide: !columnVisibility.serialNumber,
      headerClassName: 'bold-header',
      pinned: 'left',
    },
    {
      field: 'companyname',
      headerName: 'Name',
      flex: 0,
      width: 150,
      hide: !columnVisibility.companyname,
      headerClassName: 'bold-header',
      cellRenderer: (params) => (
        <Grid sx={{ display: 'flex' }}>
          <ListItem
            sx={{
              '&:hover': {
                cursor: 'pointer',
                color: 'blue',
                textDecoration: 'underline',
              },
            }}
          >
            <CopyToClipboard
              onCopy={() => {
                handleCopy('Copied Name!');
              }}
              options={{ message: 'Copied Name!' }}
              text={params?.data?.companyname}
            >
              <ListItemText primary={params?.data?.companyname} />
            </CopyToClipboard>
          </ListItem>
        </Grid>
      ),
    },
    {
      field: 'empcode',
      headerName: 'Employee Code',
      flex: 0,
      width: 150,
      hide: !columnVisibility.empcode,
      headerClassName: 'bold-header',
      cellRenderer: (params) => (
        <Grid sx={{ display: 'flex' }}>
          <ListItem
            sx={{
              '&:hover': {
                cursor: 'pointer',
                color: 'blue',
                textDecoration: 'underline',
              },
            }}
          >
            <CopyToClipboard
              onCopy={() => {
                handleCopy('Copied Employee Code!');
              }}
              options={{ message: 'Copied Employee Code!' }}
              text={params?.data?.empcode}
            >
              <ListItemText primary={params?.data?.empcode} />
            </CopyToClipboard>
          </ListItem>
        </Grid>
      ),
    },
    {
      field: 'company',
      headerName: 'Company',
      flex: 0,
      width: 120,
      hide: !columnVisibility.company,
      headerClassName: 'bold-header',
    },
    {
      field: 'branch',
      headerName: 'Branch',
      flex: 0,
      width: 120,
      hide: !columnVisibility.branch,
      headerClassName: 'bold-header',
    },
    {
      field: 'unit',
      headerName: 'Unit',
      flex: 0,
      width: 120,
      hide: !columnVisibility.unit,
      headerClassName: 'bold-header',
    },
    {
      field: 'team',
      headerName: 'Team',
      flex: 0,
      width: 120,
      hide: !columnVisibility.team,
      headerClassName: 'bold-header',
    },
    {
      field: 'workmode',
      headerName: 'Work Mode',
      flex: 0,
      width: 120,
      hide: !columnVisibility.workmode,
      headerClassName: 'bold-header',
    },
    {
      field: 'actions',
      headerName: 'Action',
      flex: 0,
      width: 250,
      minHeight: '40px !important',
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: 'bold-header',
      cellRenderer: (params) => (
        <>
          {isUserRoleCompare.includes('Manager') ? (
            <>
              <Grid container spacing={2}>
                <Grid item>
                  {isUserRoleCompare?.includes('ipersonalinfoupdate') && (
                    <>
                      <Button
                        sx={userStyle.buttonedit}
                        onClick={() => {
                          handleClickOpeninfo();
                          getinfoCode(params.data.id);
                        }}
                      >
                        <InfoOutlinedIcon style={{ fontsize: 'large' }} sx={buttonStyles.buttoninfo} />
                      </Button>
                    </>
                  )}
                </Grid>
              </Grid>
            </>
          ) : (
            <>
              <Grid sx={{ display: 'flex' }}>
                {isUserRoleCompare?.includes('epersonalinfoupdate') && (
                  <Button
                    sx={userStyle.buttonedit}
                    onClick={() => {
                      getCode(params.data.id);
                    }}
                  >
                    <EditIcon style={{ fontsize: 'large' }} sx={buttonStyles.buttonedit} />
                  </Button>
                )}

                {isUserRoleCompare?.includes('ipersonalinfoupdate') && (
                  <Button
                    sx={userStyle.buttonedit}
                    onClick={() => {
                      getinfoCode(params.data.id);
                    }}
                  >
                    <InfoOutlinedIcon style={{ fontsize: 'large' }} sx={buttonStyles.buttoninfo} />
                  </Button>
                )}
              </Grid>
            </>
          )}
        </>
      ),
    },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      companyname: item.companyname,
      empcode: item.empcode,
      company: item.company,
      workmode: item.workmode,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
    };
  });

  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRows.includes(row.id),
  }));

  // Show All Columns functionality
  const handleShowAllColumns = () => {
    setColumnVisibility(initialColumnVisibility);
  };

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
        padding: '10px',
        minWidth: '325px',
        '& .MuiDialogContent-root': { padding: '10px 0' },
      }}
    >
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
              <ListItemText
                sx={{ display: 'flex' }}
                primary={<Switch sx={{ marginTop: '-5px' }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />}
                secondary={column.field === 'checkbox' ? 'Checkbox' : column.headerName}
              // secondary={column.headerName }
              />
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

  const [valueEmp, setValueEmp] = React.useState([]); // State for employees
  const [isBoxFocused, setIsBoxFocused] = React.useState(false); // Track focus state
  let [valueTeamCat, setValueTeamCat] = useState([]);
  let [valueUnitCat, setValueUnitCat] = useState([]);
  let [valueBranchCat, setValueBranchCat] = useState([]);
  let [valueCompanyCat, setValueCompanyCat] = useState([]);

  const handlePasteForEmp = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');

    // Process the pasted text
    const newValues = pastedText.split('\n').filter((value) => value.trim() !== '');
    const pastedNames = newValues
      .flatMap((value) => value.split(','))
      .map((name) => name.replace(/\s*\.\s*/g, '.').trim())
      .filter((name) => name !== '');

    // Update the state
    updateEmployees(pastedNames);

    // Refocus the Box after paste
    e.target.focus();
  };

  useEffect(() => {
    updateEmployees([]); // Pass an empty array instead of an empty string
  }, [allUsersData, valueCompanyCat, valueBranchCat, valueUnitCat, valueTeamCat]);

  const updateEmployees = (pastedNames) => {
    // Ensure pastedNames is always an array
    const namesArray = Array.isArray(pastedNames) ? pastedNames : [];

    const availableOptions = allUsersLimit?.filter((comp) => valueCompanyCat?.includes(comp.company) && valueBranchCat?.includes(comp.branch) && valueUnitCat?.includes(comp.unit) && valueTeamCat?.includes(comp.team))?.map((data) => data.companyname.replace(/\s*\.\s*/g, '.').trim());

    const matchedValues = namesArray.filter((name) => availableOptions.includes(name.replace(/\s*\.\s*/g, '.').trim()));

    setValueEmp((prev) => {
      const uniqueValues = matchedValues.filter((value) => !prev.includes(value));
      const updatedValues = [...prev, ...uniqueValues];
      const uniqueSet = new Set(updatedValues); // Ensure uniqueness
      return Array.from(uniqueSet);
    });

    setSelectedOptionsEmployee((prev) => {
      // Filter out duplicates from namesArray
      const uniqueValues = matchedValues.filter((value) => !prev.some((item) => item.value === value.replace(/\s*\.\s*/g, '.').trim()));

      // Map the unique values to label-value pairs
      const uniqueValuesMap = uniqueValues.map((data) => ({
        label: data.replace(/\s*\.\s*/g, '.').trim(),
        value: data.replace(/\s*\.\s*/g, '.').trim(),
      }));

      // Merge with previous values
      const updatedValues = [...prev, ...uniqueValuesMap];

      // Deduplicate based on the `value` property using a Map
      const uniqueSet = new Map(updatedValues.map((item) => [item.value, item]));

      // Convert the Map back to an array
      const uniqueArray = Array.from(uniqueSet.values());

      return uniqueArray;
    });

    setValueEmployeeCat((prev) => {
      const uniqueValues = matchedValues.filter((value) => !prev.includes(value));
      const updatedValues = [...prev, ...uniqueValues];
      const uniqueSet = new Set(updatedValues); // Ensure uniqueness
      return Array.from(uniqueSet);
    });
  };

  // Handle clicks outside the Box
  useEffect(() => {
    const handleClickOutside = (e) => {
      const boxElement = document.getElementById('paste-box'); // Add an ID to the Box
      if (boxElement && !boxElement.contains(e.target)) {
        setIsBoxFocused(false); // Reset focus state if clicking outside the Box
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDelete = (e, value) => {
    e.preventDefault();
    setSelectedOptionsEmployee((current) => current.filter((emp) => emp.value !== value));
    setValueEmp((current) => current.filter((empValue) => empValue !== value));
    setValueEmployeeCat((current) => current.filter((empValue) => empValue !== value));
  };

  const handleClearFilter = () => {
    setValueCompanyCat([]);
    setSelectedOptionsCompany([]);
    setValueBranchCat([]);
    setSelectedOptionsBranch([]);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
    setValueEmp([]);
    setEmployees([]);
    setFilterState({
      type: 'Individual',
      employeestatus: 'Please Select Employee Status',
    });
    setPopupContent('Cleared Successfully');
    setPopupSeverity('success');
    handleClickOpenPopup();
    setSearchQuery('');
  };

  //MULTISELECT ONCHANGE START

  //company multiselect
  const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);

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
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
    setValueEmp([]);
  };

  const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
    return valueCompanyCat?.length ? valueCompanyCat.map(({ label }) => label)?.join(', ') : 'Please Select Company';
  };

  //branch multiselect
  const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);

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
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
    setValueEmp([]);
  };

  const customValueRendererBranch = (valueBranchCat, _categoryname) => {
    return valueBranchCat?.length ? valueBranchCat.map(({ label }) => label)?.join(', ') : 'Please Select Branch';
  };

  //unit multiselect
  const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);

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
    return valueUnitCat?.length ? valueUnitCat.map(({ label }) => label)?.join(', ') : 'Please Select Unit';
  };

  //team multiselect
  const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);

  const handleTeamChange = (options) => {
    setValueTeamCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsTeam(options);
  };

  const customValueRendererTeam = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length ? valueTeamCat.map(({ label }) => label)?.join(', ') : 'Please Select Team';
  };

  //MULTISELECT ONCHANGE END

  const handleFilter = () => {
    if (filterState?.type === 'Please Select Type' || filterState?.type === '') {
      setPopupContentMalert('Please Select Type!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (selectedOptionsCompany?.length === 0) {
      setPopupContentMalert('Please Select Company!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (['Individual', 'Branch', 'Unit', 'Team']?.includes(filterState?.type) && selectedOptionsBranch?.length === 0) {
      setPopupContentMalert('Please Select Branch!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (['Individual', 'Unit', 'Team']?.includes(filterState?.type) && selectedOptionsUnit?.length === 0) {
      setPopupContentMalert('Please Select Unit!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (['Individual', 'Team']?.includes(filterState?.type) && selectedOptionsTeam?.length === 0) {
      setPopupContentMalert('Please Select Team!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (filterState?.type === 'Individual' && selectedOptionsEmployee?.length === 0) {
      setPopupContentMalert('Please Select Employee!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (filterState?.type === 'Department' && selectedOptionsDepartment?.length === 0) {
      setPopupContentMalert('Please Select Department!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else {
      setSearchQuery('');
      fetchEmployee();
    }
  };
  const [allAssignCompany, setAllAssignCompany] = useState([]);
  const [allAssignBranch, setAllAssignBranch] = useState([]);
  const [allAssignUnit, setAllAssignUnit] = useState([]);
  //get all employees list details
  const fetchEmployee = async () => {
    setpersonalcheck(true);
    setPageName(!pageName);
    const aggregationPipeline = [
      {
        $match: {
          $and: [
            // Enquiry status filter
            {
              enquirystatus: {
                $nin: ['Enquiry Purpose'],
              },
            },
            // Reasonable status filter
            {
              resonablestatus: {
                $nin: ['Not Joined', 'Postponed', 'Rejected', 'Closed', 'Releave Employee', 'Absconded', 'Hold', 'Terminate'],
              },
            },
            // Conditional company filter
            ...(valueCompanyCat.length > 0
              ? [
                {
                  company: { $in: valueCompanyCat },
                },
              ]
              : [
                {
                  company: { $in: allAssignCompany },
                },
              ]),
            // Conditional branch filter
            ...(valueBranchCat.length > 0
              ? [
                {
                  branch: { $in: valueBranchCat },
                },
              ]
              : [
                {
                  branch: { $in: allAssignBranch },
                },
              ]),
            // Conditional unit filter
            ...(valueUnitCat.length > 0
              ? [
                {
                  unit: { $in: valueUnitCat },
                },
              ]
              : [
                {
                  unit: { $in: allAssignUnit },
                },
              ]),
            // Conditional team filter
            ...(valueTeamCat.length > 0
              ? [
                {
                  team: { $in: valueTeamCat },
                },
              ]
              : []),
            // Conditional department filter
            ...(valueTeamCat.length > 0
              ? [
                {
                  team: { $in: valueTeamCat },
                },
              ]
              : []),
            // Conditional department filter
            ...(valueDepartmentCat.length > 0
              ? [
                {
                  department: { $in: valueDepartmentCat },
                },
              ]
              : []),
            // Conditional Employee filter
            ...(valueEmployeeCat.length > 0
              ? [
                {
                  companyname: { $in: valueEmployeeCat },
                },
              ]
              : []),
          ],
        },
      },
      {
        $project: {
          company: 1,
          team: 1,
          branch: 1,
          unit: 1,
          floor: 1,
          empcode: 1,
          companyname: 1,
          workstation: 1,
          cabinname: 1,
          workmode: 1,
        },
      },
    ];
    try {
      let response = await axios.post(
        SERVICE.DYNAMICUSER_CONTROLLER,
        {
          aggregationPipeline,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setEmployees(response.data.users);
      setpersonalcheck(false);
    } catch (err) {
      setpersonalcheck(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  //auto select all dropdowns
  const handleAutoSelect = async () => {
    try {
      let selectedValues = accessbranch
        ?.map((data) => ({
          company: data.company,
          branch: data.branch,
          unit: data.unit,
        }))
        .filter((value, index, self) => index === self.findIndex((t) => t.company === value.company && t.branch === value.branch && t.unit === value.unit));
      let selectedCompany = selectedValues
        ?.filter((value, index, self) => index === self.findIndex((t) => t.company === value.company))
        .map((a, index) => {
          return a.company;
        });

      let mappedCompany = selectedValues
        ?.filter((value, index, self) => index === self.findIndex((t) => t.company === value.company))
        ?.map((data) => ({
          label: data?.company,
          value: data?.company,
        }));

      setValueCompanyCat(selectedCompany);
      setSelectedOptionsCompany(mappedCompany);

      let selectedBranch = selectedValues
        .filter((value, index, self) => index === self.findIndex((t) => t.company === value.company && t.branch === value.branch))
        .map((a, index) => {
          return a.branch;
        });

      let mappedBranch = selectedValues
        .filter((value, index, self) => index === self.findIndex((t) => t.company === value.company && t.branch === value.branch))
        ?.map((data) => ({
          label: data?.branch,
          value: data?.branch,
        }));

      setValueBranchCat(selectedBranch);
      setSelectedOptionsBranch(mappedBranch);

      let selectedUnit = selectedValues
        .filter((value, index, self) => index === self.findIndex((t) => t.company === value.company && t.branch === value.branch && t.unit === value.unit))
        .map((a, index) => {
          return a.unit;
        });

      let mappedUnit = selectedValues
        .filter((value, index, self) => index === self.findIndex((t) => t.company === value.company && t.branch === value.branch && t.unit === value.unit))
        ?.map((data) => ({
          label: data?.unit,
          value: data?.unit,
        }));

      setValueUnitCat(selectedUnit);
      setSelectedOptionsUnit(mappedUnit);

      let mappedTeam = allTeam
        ?.filter((u) => selectedCompany?.includes(u.company) && selectedBranch?.includes(u.branch) && selectedUnit?.includes(u.unit))
        .map((u) => ({
          label: u.teamname,
          value: u.teamname,
        }));

      let selectedTeam = allTeam?.filter((u) => selectedCompany?.includes(u.company) && selectedBranch?.includes(u.branch) && selectedUnit?.includes(u.unit)).map((u) => u.teamname);
      //----------------------------
      let mappedemployees = allUsersData
        ?.filter((u) => selectedCompany?.includes(u.company) && selectedBranch?.includes(u.branch) && selectedUnit?.includes(u.unit) && selectedTeam?.includes(u.team))
        .map((u) => ({
          label: u.companyname,
          value: u.companyname,
        }));

      let employees = allUsersData?.filter((u) => selectedCompany?.includes(u.company) && selectedBranch?.includes(u.branch) && selectedUnit?.includes(u.unit) && selectedTeam?.includes(u.team)).map((u) => u.companyname);
      setValueEmployeeCat(employees);
      setSelectedOptionsEmployee(mappedemployees);

      setValueEmp(mappedemployees?.map((item) => item?.value));
      //-----------------
      setValueTeamCat(selectedTeam);
      setSelectedOptionsTeam(mappedTeam);
      setAllAssignCompany(selectedCompany);

      setAllAssignBranch(selectedBranch);

      setAllAssignUnit(selectedUnit);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    handleAutoSelect();
  }, [isAssignBranch]);

  return (
    <Box>
      <NotificationContainer />
      <Headtitle title={'PERSONAL INFO UPDATE'} />
      <PageHeading title="Personal Info update" modulename="Human Resources" submodulename="HR" mainpagename="Employee" subpagename="Employee Update Details" subsubpagename="Personal Info update" />

      <br />
      {isUserRoleCompare?.includes('lpersonalinfoupdate') && (
        <>
          <Box sx={userStyle.selectcontainer}>
            <Grid container spacing={2}>
              <>
                <Grid item xs={12}>
                  <Typography sx={userStyle.importheadtext}>Filters</Typography>
                </Grid>
                <br />
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Type<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <Selects
                      options={TypeOptions}
                      styles={colourStyles}
                      value={{
                        label: filterState.type ?? 'Please Select Type',
                        value: filterState.type ?? 'Please Select Type',
                      }}
                      onChange={(e) => {
                        setFilterState((prev) => ({
                          ...prev,
                          type: e.value,
                        }));
                        setValueCompanyCat([]);
                        setSelectedOptionsCompany([]);
                        setValueBranchCat([]);
                        setSelectedOptionsBranch([]);
                        setValueUnitCat([]);
                        setSelectedOptionsUnit([]);
                        setValueTeamCat([]);
                        setSelectedOptionsTeam([]);
                        setValueDepartmentCat([]);
                        setSelectedOptionsDepartment([]);
                        setValueEmployeeCat([]);
                        setSelectedOptionsEmployee([]);
                        setValueEmp([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    Company<b style={{ color: 'red' }}>*</b>
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <MultiSelect
                      options={accessbranch
                        ?.map((data) => ({
                          label: data.company,
                          value: data.company,
                        }))
                        .filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
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
                {['Individual', 'Team']?.includes(filterState.type) ? (
                  <>
                    {/* Branch Unit Team */}
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          {' '}
                          Branch <b style={{ color: 'red' }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={accessbranch
                            ?.filter((comp) => valueCompanyCat?.includes(comp.company))
                            ?.map((data) => ({
                              label: data.branch,
                              value: data.branch,
                            }))
                            .filter((item, index, self) => {
                              return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
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
                          {' '}
                          Unit<b style={{ color: 'red' }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={accessbranch
                            ?.filter((comp) => valueCompanyCat?.includes(comp.company) && valueBranchCat?.includes(comp.branch))
                            ?.map((data) => ({
                              label: data.unit,
                              value: data.unit,
                            }))
                            .filter((item, index, self) => {
                              return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
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
                          Team<b style={{ color: 'red' }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={allTeam
                            ?.filter((u) => valueCompanyCat?.includes(u.company) && valueBranchCat?.includes(u.branch) && valueUnitCat?.includes(u.unit))
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
                  </>
                ) : ['Department']?.includes(filterState.type) ? (
                  <>
                    {/* Department */}
                    <Grid item md={3} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Department<b style={{ color: 'red' }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={departmentOptions}
                          value={selectedOptionsDepartment}
                          onChange={(e) => {
                            handleDepartmentChange(e);
                          }}
                          valueRenderer={customValueRendererDepartment}
                          labelledBy="Please Select Department"
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : ['Branch']?.includes(filterState.type) ? (
                  <>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          {' '}
                          Branch <b style={{ color: 'red' }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={accessbranch
                            ?.filter((comp) => valueCompanyCat?.includes(comp.company))
                            ?.map((data) => ({
                              label: data.branch,
                              value: data.branch,
                            }))
                            .filter((item, index, self) => {
                              return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
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
                  </>
                ) : ['Unit']?.includes(filterState.type) ? (
                  <>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          {' '}
                          Branch<b style={{ color: 'red' }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={accessbranch
                            ?.filter((comp) => valueCompanyCat?.includes(comp.company))
                            ?.map((data) => ({
                              label: data.branch,
                              value: data.branch,
                            }))
                            .filter((item, index, self) => {
                              return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
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
                          {' '}
                          Unit <b style={{ color: 'red' }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={accessbranch
                            ?.filter((comp) => valueCompanyCat?.includes(comp.company) && valueBranchCat?.includes(comp.branch))
                            ?.map((data) => ({
                              label: data.unit,
                              value: data.unit,
                            }))
                            .filter((item, index, self) => {
                              return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
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
                  </>
                ) : (
                  ''
                )}
                {['Individual']?.includes(filterState.type) && (
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Employee<b style={{ color: 'red' }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={allUsersData
                          ?.filter((u) => valueCompanyCat?.includes(u.company) && valueBranchCat?.includes(u.branch) && valueUnitCat?.includes(u.unit) && valueTeamCat?.includes(u.team))
                          .map((u) => ({
                            label: u.companyname,
                            value: u.companyname,
                          }))}
                        value={selectedOptionsEmployee}
                        onChange={(e) => {
                          handleEmployeeChange(e);
                        }}
                        valueRenderer={customValueRendererEmployee}
                        labelledBy="Please Select Employee"
                      />
                    </FormControl>
                  </Grid>
                )}
                {['Individual']?.includes(filterState.type) && (
                  <Grid item md={6} sm={12} xs={12} sx={{ display: 'flex', flexDirection: 'row' }}>
                    <FormControl fullWidth size="small">
                      <Typography>Selected Employees</Typography>
                      <div
                        id="paste-box" // Add an ID to the Box
                        tabIndex={0} // Make the div focusable
                        style={{
                          border: '1px solid #ccc',
                          borderRadius: '3.75px',
                          height: '110px',
                          overflow: 'auto',
                        }}
                        onPaste={handlePasteForEmp}
                        onFocus={() => setIsBoxFocused(true)} // Set focus state to true
                        onBlur={(e) => {
                          if (isBoxFocused) {
                            e.target.focus(); // Refocus only if the Box was previously focused
                          }
                        }}
                      >
                        {valueEmp.map((value) => (
                          <Chip key={value} label={value} clickable sx={{ margin: 0.2, backgroundColor: '#FFF' }} onDelete={(e) => handleDelete(e, value)} onClick={() => console.log('clicked chip')} />
                        ))}
                      </div>
                    </FormControl>
                  </Grid>
                )}
              </>
            </Grid>
            <br />
            <br />
            <br />
            <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Grid item lg={1} md={2} sm={2} xs={12}>
                <Button sx={buttonStyles.buttonsubmit} variant="contained" onClick={handleFilter}>
                  {' '}
                  Filter{' '}
                </Button>
              </Grid>
              <Grid item lg={1} md={2} sm={2} xs={12}>
                <Button sx={buttonStyles.btncancel} onClick={handleClearFilter}>
                  {' '}
                  Clear{' '}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
      <br />
      {isUserRoleCompare?.includes('lpersonalinfoupdate') && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Personal Information Update List</Typography>
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
                    <MenuItem value={employees?.length}>All</MenuItem>
                  </Select>
                </Box>
              </Grid>
              <Grid
                item
                md={8}
                xs={12}
                sm={12}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Box>
                  {isUserRoleCompare?.includes('excelpersonalinfoupdate') && (
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
                  {isUserRoleCompare?.includes('csvpersonalinfoupdate') && (
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
                  {isUserRoleCompare?.includes('printpersonalinfoupdate') && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('pdfpersonalinfoupdate') && (
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
                  {isUserRoleCompare?.includes('imagepersonalinfoupdate') && (
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                      {' '}
                      <ImageIcon sx={{ fontSize: '15px' }} /> &ensp;Image&ensp;{' '}
                    </Button>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={6} sm={6}>
                <AggregatedSearchBar
                  columnDataTable={columnDataTable}
                  setItems={setItems}
                  addSerialNumber={addSerialNumber}
                  setPage={setPage}
                  maindatas={employees}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                  totalDatas={overallItems}
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
            <br />
            <br />
            {personalcheck ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                </Box>
              </>
            ) : (
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
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        {manageColumnsContent}
      </Popover>

      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="lg"
          sx={{
            overflow: 'visible',
            '& .MuiPaper-root': {
              overflow: 'auto',
            },
            '& .dropdown-container': {
              position: 'relative', // Ensure the container is positioned relative
              zIndex: 1500, // Adjust the z-index value as needed
            },
            marginTop: '50px',
          }}
        >
          <Box sx={userStyle.dialogbox}>
            <DialogContent sx={{ maxWidth: '950px', padding: '20px', overflowY: 'visible' }}>
              <Typography sx={userStyle.SubHeaderText}> Update Personal Information </Typography>
              <br />
              <br /> <br />
              <form onSubmit={handleSubmit}>
                <Box>
                  <>
                    <Grid container spacing={1}>
                      <Grid item md={6} sm={12} xs={12} sx={{ display: 'flex' }}>
                        <Typography sx={{ fontWeight: '600', marginRight: '5px' }}>Employee Name:</Typography>
                        <Typography sx={userStyle.SubHeaderText}>{empaddform.companyname}</Typography>
                      </Grid>
                      <Grid item md={6} sm={12} xs={12} sx={{ display: 'flex' }}>
                        <Typography sx={{ fontWeight: '600', marginRight: '5px' }}>Emp Code:</Typography>
                        <Typography sx={userStyle.SubHeaderText}>{empaddform.empcode}</Typography>
                      </Grid>
                    </Grid>
                    <br />
                    <br />
                    <br />
                    <Grid container spacing={1}>
                      <Grid item md={6} sm={12} xs={12}>
                        <Typography>
                          First Name<b style={{ color: 'red' }}>*</b>
                        </Typography>
                        <Grid container sx={{ display: 'flex' }}>
                          <Grid item md={3} sm={3} xs={3}>
                            <FormControl size="small" fullWidth>
                              {/* <Select
                                labelId="demo-select-small"
                                id="demo-select-small"
                                placeholder="Mr."
                                value={empaddform.prefix}
                                MenuProps={{
                                  PaperProps: {
                                    style: {
                                      maxHeight: 200,
                                      width: 80,
                                    },
                                  },
                                }}
                                onChange={(e) => {
                                  setEmpaddform({
                                    ...empaddform,
                                    prefix: e.target.value,
                                  });
                                }}
                              >
                                <MenuItem value="Mr">Mr</MenuItem>
                                <MenuItem value="Ms">Ms</MenuItem>
                                <MenuItem value="Mrs">Mrs</MenuItem>
                              </Select> */}
                              <OutlinedInput
                                id="component-outlined"
                                type="text"
                                placeholder="Last Name"
                                value={empaddform.prefix}
                                // onChange={(e) => {
                                //   setEmpaddform({
                                //     ...empaddform,
                                //     lastname: e.target.value?.toUpperCase(),
                                //   });
                                // }}
                                readOnly
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={9} sm={9} xs={9}>
                            <FormControl size="small" fullWidth>
                              <OutlinedInput
                                id="component-outlined"
                                type="text"
                                placeholder="First Name"
                                value={empaddform.firstname}
                                // onChange={(e) => {
                                //   setEmpaddform({
                                //     ...empaddform,
                                //     firstname: e.target.value?.toUpperCase(),
                                //   });
                                // }}
                                readOnly
                              />
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item md={6} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Last Name<b style={{ color: 'red' }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            placeholder="Last Name"
                            value={empaddform.lastname}
                            // onChange={(e) => {
                            //   setEmpaddform({
                            //     ...empaddform,
                            //     lastname: e.target.value?.toUpperCase(),
                            //   });
                            // }}
                            readOnly
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Legal Name<b style={{ color: 'red' }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            placeholder="Legal Name"
                            value={empaddform.legalname}
                            onChange={(e) => {
                              setEmpaddform({
                                ...empaddform,
                                legalname: e.target.value,
                                //callingname: e.target.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Calling Name<b style={{ color: 'red' }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            placeholder="Calling Name"
                            value={empaddform.firstname}
                          // onChange={(e) => {
                          //   setEmpaddform({
                          //     ...empaddform,
                          //     callingname: e.target.value.replace(/\s/g, ""),
                          //   });
                          // }}
                          />
                        </FormControl>
                      </Grid>

                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Father Name</Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            placeholder="Father Name"
                            value={empaddform.fathername}
                            onChange={(e) => {
                              setEmpaddform({
                                ...empaddform,
                                fathername: e.target.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Mother Name</Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            placeholder="Mother Name"
                            value={empaddform.mothername}
                            onChange={(e) => {
                              setEmpaddform({
                                ...empaddform,
                                mothername: e.target.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Gender</Typography>
                          <Selects
                            maxMenuHeight={300}
                            options={[
                              { label: 'Others', value: 'Others' },
                              { label: 'Female', value: 'Female' },
                              { label: 'Male', value: 'Male' },
                            ]}
                            value={{
                              label: empaddform.gender === '' || empaddform.gender == undefined ? 'Select Gender' : empaddform.gender,
                              value: empaddform.gender === '' || empaddform.gender == undefined ? 'Select Gender' : empaddform.gender,
                            }}
                            onChange={(e) => {
                              setEmpaddform({ ...empaddform, gender: e.value });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Marital Status</Typography>

                          <Selects
                            maxMenuHeight={300}
                            options={[
                              { label: 'Single', value: 'Single' },
                              { label: 'Married', value: 'Married' },
                              { label: 'Divorced', value: 'Divorced' },
                            ]}
                            value={{
                              label: empaddform.maritalstatus === '' || empaddform.maritalstatus == undefined ? 'Select Marital Status' : empaddform.maritalstatus,
                              value: empaddform.maritalstatus === '' || empaddform.maritalstatus == undefined ? 'Select Marital Status' : empaddform.maritalstatus,
                            }}
                            onChange={(e) => {
                              setEmpaddform({
                                ...empaddform,
                                maritalstatus: e.value,
                                dom: '',
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      {empaddform.maritalstatus === 'Married' && (
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Date Of Marriage<b style={{ color: 'red' }}>*</b>
                            </Typography>
                            <OutlinedInput
                              id="component-outlined"
                              value={empaddform.dom}
                              onChange={(e) => {
                                setEmpaddform({
                                  ...empaddform,
                                  dom: e.target.value,
                                });
                              }}
                              type="date"
                              size="small"
                              name="dom"
                            />
                          </FormControl>
                        </Grid>
                      )}
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Date Of Birth <b style={{ color: 'red' }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            value={empaddform.dob}
                            onChange={(e) => {
                              let age = calculateAge(e.target.value);
                              setEmpaddform({
                                ...empaddform,
                                dob: e.target.value,
                                age,
                              });
                            }}
                            type="date"
                            size="small"
                            name="dob"
                            inputProps={{ max: maxDate }}
                            onKeyDown={(e) => e.preventDefault()}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Age</Typography>
                          <OutlinedInput id="component-outlined" type="number" value={empaddform.dob === '' ? '' : empaddform?.age} readOnly />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Aadhar No <b style={{ color: 'red' }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            value={empaddform?.aadhar}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value.length <= 12 && (value === '' || /^\d*$/.test(value))) {
                                setEmpaddform({
                                  ...empaddform,
                                  aadhar: e.target.value,
                                });
                              }
                            }}
                            type="text"
                            size="small"
                            name="dob"
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            PAN Card Status<b style={{ color: 'red' }}>*</b>
                          </Typography>
                          <Selects
                            maxMenuHeight={300}
                            options={[
                              { label: 'Have PAN', value: 'Have PAN' },
                              { label: 'Applied', value: 'Applied' },
                              { label: 'Yet to Apply', value: 'Yet to Apply' },
                            ]}
                            value={{
                              label: empaddform.panstatus === '' || empaddform.panstatus == undefined ? 'Select PAN Status' : empaddform.panstatus,
                              value: empaddform.panstatus === '' || empaddform.panstatus == undefined ? 'Select PAN Status' : empaddform.panstatus,
                            }}
                            onChange={(e) => {
                              setEmpaddform({
                                ...empaddform,
                                panstatus: e.value,
                                panno: '',
                                panrefno: '',
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      {empaddform?.panstatus === 'Have PAN' && (
                        <Grid item md={3} sm={6} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Pan No<b style={{ color: 'red' }}>*</b>
                            </Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Pan No"
                              value={empaddform.panno}
                              onChange={(e) => {
                                if (e.target.value.length < 11) {
                                  setEmpaddform({
                                    ...empaddform,
                                    panno: e.target.value,
                                  });
                                }
                              }}
                            />
                          </FormControl>
                        </Grid>
                      )}
                      {empaddform?.panstatus === 'Applied' && (
                        <Grid item md={3} sm={6} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Application Ref No
                              <b style={{ color: 'red' }}>*</b>
                            </Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Application Ref No"
                              value={empaddform.panrefno}
                              onChange={(e) => {
                                if (e.target.value.length < 16) {
                                  setEmpaddform({
                                    ...empaddform,
                                    panrefno: e.target.value,
                                  });
                                }
                              }}
                            />
                          </FormControl>
                        </Grid>
                      )}
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Religion <b style={{ color: 'red' }}>*</b>
                          </Typography>

                          <Selects
                            maxMenuHeight={300}
                            options={religionOptions}
                            value={{
                              label: empaddform.religion === '' || empaddform.religion == undefined ? 'Select Religion' : empaddform.religion,
                              value: empaddform.religion === '' || empaddform.religion == undefined ? 'Select Religion' : empaddform.religion,
                            }}
                            onChange={(e) => {
                              setEmpaddform({ ...empaddform, religion: e.value });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Blood Group</Typography>
                          <Selects
                            maxMenuHeight={300}
                            options={[
                              { label: 'A-ve-', value: 'A-ve-' },
                              { label: 'A+ve-', value: 'A+ve-' },
                              { label: 'B+ve', value: 'B+ve' },
                              { label: 'B-ve', value: 'B-ve' },
                              { label: 'O+ve', value: 'O+ve' },
                              { label: 'O-ve', value: 'O-ve' },
                              { label: 'AB+ve', value: 'AB+ve' },
                              { label: 'AB-ve', value: 'AB-ve' },
                              { label: 'A1+ve', value: 'A1+ve' },
                              { label: 'A1-ve', value: 'A1-ve' },
                              { label: 'A2+ve', value: 'A2+ve' },
                              { label: 'A2-ve', value: 'A2-ve' },
                              { label: 'A1B+ve', value: 'A1B+ve' },
                              { label: 'A1B-ve', value: 'A1B-ve' },
                              { label: 'A2B+ve', value: 'A2B+ve' },
                              { label: 'A2B-ve', value: 'A2B-ve' },
                            ]}
                            value={{
                              label: empaddform.bloodgroup === '' || empaddform.bloodgroup == undefined ? 'Select Blood Group' : empaddform.bloodgroup,
                              value: empaddform.bloodgroup === '' || empaddform.bloodgroup == undefined ? 'Select Blood Group' : empaddform.bloodgroup,
                            }}
                            onChange={(e) => {
                              setEmpaddform({
                                ...empaddform,
                                bloodgroup: e.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </>
                  <br />
                  <br />
                  <br />
                  <Typography sx={userStyle.SubHeaderText}>
                    {' '}
                    Permanent Address <b style={{ color: 'red' }}>*</b>
                  </Typography>
                  <br />
                  <br />
                  <>
                    <Grid container spacing={1}>
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Address Type
                          </Typography>
                          <Selects
                            options={address_type}
                            styles={colourStyles}
                            value={{
                              label: empaddform?.paddresstype === '' ? 'Please Select Address Type' : empaddform?.paddresstype,
                              value: empaddform?.paddresstype === '' ? 'Please Select Address Type' : empaddform?.paddresstype,
                            }}
                            onChange={(e) => {
                              setEmpaddform({ ...empaddform, paddresstype: e.value });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Personal Prefix
                          </Typography>
                          <Selects
                            options={personal_prefix}
                            styles={colourStyles}
                            value={{
                              label: empaddform?.ppersonalprefix === '' ? 'Please Select Personal Prefix' : empaddform?.ppersonalprefix,
                              value: empaddform?.ppersonalprefix === '' ? 'Please Select Personal Prefix' : empaddform?.ppersonalprefix,
                            }}
                            onChange={(e) => {
                              setEmpaddform({ ...empaddform, ppersonalprefix: e.value });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Reference Name</Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            placeholder="Reference Name"
                            value={empaddform?.presourcename}
                            onChange={(e) => {
                              setEmpaddform({ ...empaddform, presourcename: e.target.value });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Landmark & Positional Prefix
                          </Typography>
                          <Selects
                            options={landmark_and_positional_prefix}
                            styles={colourStyles}
                            value={{
                              label: empaddform?.plandmarkandpositionalprefix === '' ? 'Please Select Landmark and Positional  Prefix' : empaddform?.plandmarkandpositionalprefix,
                              value: empaddform?.plandmarkandpositionalprefix === '' ? 'Please Select Landmark and Positional  Prefix' : empaddform?.plandmarkandpositionalprefix,
                            }}
                            onChange={(e) => {
                              setEmpaddform({ ...empaddform, plandmarkandpositionalprefix: e.value });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Landmark  Name</Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            placeholder="Landmark  Name"
                            value={empaddform.plandmark}
                            onChange={(e) => {
                              setEmpaddform({
                                ...empaddform,
                                plandmark: e.target.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>House/Flat No</Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            placeholder="House/Flat No"
                            value={empaddform.pdoorno}
                            onChange={(e) => {
                              setEmpaddform({ ...empaddform, pdoorno: e.target.value });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Street/Road Name</Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            placeholder="Street/Road Name"
                            value={empaddform.pstreet}
                            onChange={(e) => {
                              setEmpaddform({ ...empaddform, pstreet: e.target.value });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Locality/Area Name</Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            placeholder="Locality/Area Name"
                            value={empaddform.parea}
                            onChange={(e) => {
                              setEmpaddform({ ...empaddform, parea: e.target.value });
                            }}
                          />
                        </FormControl>
                      </Grid>

                      {/* <Grid item md={3} sm={12} xs={12}>
                                                 <FormControl fullWidth size="small">
                                                   <Typography>Taluk</Typography>
                                                   <OutlinedInput
                                                     id="component-outlined"
                                                     type="text"
                                                     placeholder="Taluk"
                                                     value={empaddform.ptaluk}
                                                     onChange={(e) => {
                                                       setEmpaddform({ ...empaddform, ptaluk: e.target.value });
                                                     }}
                                                   />
                                                 </FormControl>
                                               </Grid>
                                               <Grid item md={3} sm={12} xs={12}>
                                                 <FormControl size="small" fullWidth>
                                                   <Typography>Post</Typography>
                                                   <OutlinedInput
                                                     id="component-outlined"
                                                     type="text"
                                                     placeholder="Post"
                                                     value={empaddform.ppost}
                                                     onChange={(e) => {
                                                       setEmpaddform({ ...empaddform, ppost: e.target.value });
                                                     }}
                                                   />
                                                 </FormControl>
                                               </Grid> */}

                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl size="small" fullWidth>
                          <Typography>Country</Typography>
                          <Selects
                            options={Country.getAllCountries()}
                            getOptionLabel={(options) => {
                              return options['name'];
                            }}
                            getOptionValue={(options) => {
                              return options['name'];
                            }}
                            styles={colourStyles}
                            value={selectedCountryp}
                            onChange={(item) => {
                              setSelectedCountryp(item);
                              setSelectedStatep('');
                              setSelectedCityp('');
                              setEmpaddform((prevSupplier) => ({
                                ...prevSupplier,
                                pcountry: item?.name || '',
                              }));
                            }}
                          />
                        </FormControl>
                      </Grid>

                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>State</Typography>
                          <Selects
                            options={State?.getStatesOfCountry(selectedCountryp?.isoCode)}
                            getOptionLabel={(options) => {
                              return options['name'];
                            }}
                            getOptionValue={(options) => {
                              return options['name'];
                            }}
                            value={selectedStatep}
                            styles={colourStyles}
                            onChange={(item) => {
                              setSelectedStatep(item);
                              setSelectedCityp('');
                              setEmpaddform((prevSupplier) => ({
                                ...prevSupplier,
                                pstate: item?.name || '',
                              }));
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>City</Typography>
                          <Selects
                            options={City.getCitiesOfState(selectedStatep?.countryCode, selectedStatep?.isoCode)}
                            getOptionLabel={(options) => {
                              return options['name'];
                            }}
                            getOptionValue={(options) => {
                              return options['name'];
                            }}
                            value={selectedCityp}
                            styles={colourStyles}
                            onChange={(item) => {
                              setSelectedCityp(item);
                              setEmpaddform((prevSupplier) => ({
                                ...prevSupplier,
                                pcity: item?.name || '',
                              }));
                            }}
                          />
                        </FormControl>
                      </Grid>

                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl size="small" fullWidth>
                          <Typography>Pincode</Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="number"
                            sx={userStyle.input}
                            placeholder="Pincode"
                            value={empaddform.ppincode}
                            onChange={(e) => {
                              handlechangeppincode(e);
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>GPS Coordination</Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            placeholder="GPS Coordination"
                            value={empaddform?.pgpscoordination}
                            onChange={(e) => {
                              setEmpaddform({
                                ...empaddform,
                                pgpscoordination: e.target.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Grid item md={12} sm={12} xs={12}>
                      <FullAddressCard employee={{
                        ...empaddform,
                        pcity: selectedCityp?.name,
                        pstate: selectedStatep?.name,
                        pcountry: selectedCountryp?.name,

                      }} />                    </Grid>
                  </>
                  <br />
                  <br />
                  <br />
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography sx={userStyle.SubHeaderText}>
                        {' '}
                        Current Address<b style={{ color: 'red' }}>*</b>{' '}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={Boolean(empaddform.samesprmnt)}
                            onChange={(e) =>
                              setEmpaddform({
                                ...empaddform,
                                samesprmnt: !empaddform.samesprmnt,
                              })
                            }
                          />
                        }
                        label="Same as permananet Address"
                      />
                    </Grid>
                  </Grid>
                  <br />
                  <br />
                  {!empaddform.samesprmnt ? (
                    <>
                      <Grid container spacing={2}>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Address Type
                            </Typography>
                            <Selects
                              options={address_type}
                              styles={colourStyles}
                              value={{
                                label: empaddform?.caddresstype === '' ? 'Please Select Address Type' : empaddform?.caddresstype,
                                value: empaddform?.caddresstype === '' ? 'Please Select Address Type' : empaddform?.caddresstype,
                              }}
                              onChange={(e) => {
                                setEmpaddform({ ...empaddform, caddresstype: e.value });
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Personal Prefix
                            </Typography>
                            <Selects
                              options={personal_prefix}
                              styles={colourStyles}
                              value={{
                                label: empaddform?.cpersonalprefix === '' ? 'Please Select Personal Prefix' : empaddform?.cpersonalprefix,
                                value: empaddform?.cpersonalprefix === '' ? 'Please Select Personal Prefix' : empaddform?.cpersonalprefix,
                              }}
                              onChange={(e) => {
                                setEmpaddform({ ...empaddform, cpersonalprefix: e.value });
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Reference Name</Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Reference Name"
                              value={empaddform?.cresourcename}
                              onChange={(e) => {
                                setEmpaddform({ ...empaddform, cresourcename: e.target.value });
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Landmark & Positional Prefix
                            </Typography>
                            <Selects
                              options={landmark_and_positional_prefix}
                              styles={colourStyles}
                              value={{
                                label: empaddform?.clandmarkandpositionalprefix === '' ? 'Please Select Landmark and Positional  Prefix' : empaddform?.clandmarkandpositionalprefix,
                                value: empaddform?.clandmarkandpositionalprefix === '' ? 'Please Select Landmark and Positional  Prefix' : empaddform?.clandmarkandpositionalprefix,
                              }}
                              onChange={(e) => {
                                setEmpaddform({ ...empaddform, clandmarkandpositionalprefix: e.value });
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Landmark  Name</Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Landmark  Name"
                              value={empaddform.clandmark}
                              onChange={(e) => {
                                setEmpaddform({
                                  ...empaddform,
                                  clandmark: e.target.value,
                                });
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>House/Flat No</Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="House/Flat No"
                              value={empaddform.cdoorno}
                              onChange={(e) => {
                                setEmpaddform({
                                  ...empaddform,
                                  cdoorno: e.target.value,
                                });
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Street/Road Name</Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Street/Road Name"
                              value={empaddform.cstreet}
                              onChange={(e) => {
                                setEmpaddform({
                                  ...empaddform,
                                  cstreet: e.target.value,
                                });
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Locality/Area Name</Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Locality/Area Name"
                              value={empaddform.carea}
                              onChange={(e) => {
                                setEmpaddform({ ...empaddform, carea: e.target.value });
                              }}
                            />
                          </FormControl>
                        </Grid>


                        {/* <Grid item md={3} sm={12} xs={12}>
                                                     <FormControl fullWidth size="small">
                                                       <Typography>Taluk</Typography>
                                                       <OutlinedInput
                                                         id="component-outlined"
                                                         type="text"
                                                         placeholder="Taluk"
                                                         value={empaddform.ctaluk}
                                                         onChange={(e) => {
                                                           setEmpaddform({
                                                             ...empaddform,
                                                             ctaluk: e.target.value,
                                                           });
                                                         }}
                                                       />
                                                     </FormControl>
                                                   </Grid>
                                                   <Grid item md={3} sm={12} xs={12}>
                                                     <FormControl size="small" fullWidth>
                                                       <Typography>Post</Typography>
                                                       <OutlinedInput
                                                         id="component-outlined"
                                                         type="text"
                                                         placeholder="Post"
                                                         value={empaddform.cpost}
                                                         onChange={(e) => {
                                                           setEmpaddform({ ...empaddform, cpost: e.target.value });
                                                         }}
                                                       />
                                                     </FormControl>
                                                   </Grid> */}

                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Country</Typography>
                            <Selects
                              options={Country.getAllCountries()}
                              getOptionLabel={(options) => {
                                return options['name'];
                              }}
                              getOptionValue={(options) => {
                                return options['name'];
                              }}
                              value={selectedCountryc}
                              styles={colourStyles}
                              onChange={(item) => {
                                setSelectedCountryc(item);
                                setSelectedStatec('');
                                setSelectedCityc('');
                                setEmpaddform((prevSupplier) => ({
                                  ...prevSupplier,
                                  ccountry: item?.name || '',
                                }));
                              }}
                            />
                          </FormControl>
                        </Grid>


                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>State</Typography>
                            <Selects
                              options={State?.getStatesOfCountry(selectedCountryc?.isoCode)}
                              getOptionLabel={(options) => {
                                return options['name'];
                              }}
                              getOptionValue={(options) => {
                                return options['name'];
                              }}
                              value={selectedStatec}
                              styles={colourStyles}
                              onChange={(item) => {
                                setSelectedStatec(item);
                                setSelectedCityc('');
                                setEmpaddform((prevSupplier) => ({
                                  ...prevSupplier,
                                  cstate: item?.name || '',
                                }));
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>City</Typography>
                            <Selects
                              options={City.getCitiesOfState(selectedStatec?.countryCode, selectedStatec?.isoCode)}
                              getOptionLabel={(options) => {
                                return options['name'];
                              }}
                              getOptionValue={(options) => {
                                return options['name'];
                              }}
                              value={selectedCityc}
                              styles={colourStyles}
                              onChange={(item) => {
                                setSelectedCityc(item);
                                setEmpaddform((prevSupplier) => ({
                                  ...prevSupplier,
                                  ccity: item?.name || '',
                                }));
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>GPS Coordination</Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Landmark  Name"
                              value={empaddform.cgpscoordination}
                              onChange={(e) => {
                                setEmpaddform({
                                  ...empaddform,
                                  cgpscoordination: e.target.value,
                                });
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl size="small" fullWidth>
                            <Typography>Pincode</Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="number"
                              sx={userStyle.input}
                              placeholder="Pincode"
                              value={empaddform.cpincode}
                              onChange={(e) => {
                                handlechangecpincode(e);
                              }}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </>
                  ) : (
                    // else condition starts here
                    <>
                      <Grid container spacing={2}>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Address Type</Typography>
                            <OutlinedInput id="component-outlined" type="text" placeholder="Address Type" value={empaddform?.paddresstype} readOnly />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Personal Prefix</Typography>
                            <OutlinedInput id="component-outlined" type="text" placeholder="Personal Prefix" value={empaddform?.ppersonalprefix} readOnly />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Reference Name</Typography>
                            <OutlinedInput id="component-outlined" type="text" placeholder="Reference Name" value={empaddform?.presourcename} readOnly />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography> Landmark & Positional Prefix </Typography>
                            <OutlinedInput id="component-outlined" type="text" placeholder="Landmark & Positional Prefix" value={empaddform?.plandmarkandpositionalprefix} readOnly />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Landmark  Name</Typography>
                            <OutlinedInput id="component-outlined" type="text" placeholder="Landmark  Name" value={empaddform.plandmark} readOnly />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>House/Flat No</Typography>
                            <OutlinedInput id="component-outlined" type="text" placeholder="House/Flat No" value={empaddform.pdoorno} readOnly />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Street/Road Name</Typography>
                            <OutlinedInput id="component-outlined" type="text" placeholder="Street/Road Name" value={empaddform.pstreet} readOnly />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Locality/Area Name</Typography>
                            <OutlinedInput id="component-outlined" type="text" placeholder="Locality/Area Name" value={empaddform.parea} readOnly />
                          </FormControl>
                        </Grid>

                        {/* <Grid item md={3} sm={12} xs={12}>
                                                    <FormControl fullWidth size="small">
                                                      <Typography>Taluk</Typography>
                                                      <OutlinedInput id="component-outlined" type="text" placeholder="Taluk" value={empaddform.ptaluk} readOnly />
                                                    </FormControl>
                                                  </Grid>
                                                  <Grid item md={3} sm={12} xs={12}>
                                                    <FormControl size="small" fullWidth>
                                                      <Typography>Post</Typography>
                                                      <OutlinedInput id="component-outlined" type="text" placeholder="Post" value={empaddform.ppost} readOnly />
                                                    </FormControl>
                                                  </Grid> */}

                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl size="small" fullWidth>
                            <Typography>Country</Typography>
                            <Selects
                              options={Country.getAllCountries()}
                              getOptionLabel={(options) => {
                                return options['name'];
                              }}
                              getOptionValue={(options) => {
                                return options['name'];
                              }}
                              value={selectedCountryp}
                              styles={colourStyles}
                              onChange={(item) => {
                                setSelectedCountryp(item);
                              }}
                              isDisabled={true}
                            />
                          </FormControl>
                        </Grid>

                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>State</Typography>
                            <Selects
                              options={State?.getStatesOfCountry(selectedCountryp?.isoCode)}
                              getOptionLabel={(options) => {
                                return options['name'];
                              }}
                              getOptionValue={(options) => {
                                return options['name'];
                              }}
                              value={selectedStatep}
                              styles={colourStyles}
                              // onChange={(item) => {
                              //   setSelectedStatep(item);
                              // }}
                              isDisabled={true}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>City</Typography>
                            <Selects
                              options={City.getCitiesOfState(selectedStatep?.countryCode, selectedStatep?.isoCode)}
                              getOptionLabel={(options) => {
                                return options['name'];
                              }}
                              getOptionValue={(options) => {
                                return options['name'];
                              }}
                              value={selectedCityp}
                              styles={colourStyles}
                              // onChange={(item) => {
                              //   setSelectedCityp(item);
                              // }}
                              isDisabled={true}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl size="small" fullWidth>
                            <Typography>Pincode</Typography>
                            <OutlinedInput id="component-outlined" type="text" placeholder="Pincode" value={empaddform.ppincode} readOnly />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl size="small" fullWidth>
                            <Typography>GPS Coordination</Typography>
                            <OutlinedInput id="component-outlined" type="text" placeholder="GPS Coordination" value={empaddform?.pgpscoordination} readOnly />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </>
                  )}
                  <br />
                  <br />
                  <br />
                  <br />
                  <Grid
                    container
                    spacing={2}
                    sx={{
                      textAlign: 'center',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Grid item md={1}></Grid>
                    <Button variant="contained" type="submit" sx={buttonStyles.buttonsubmit}>
                      Update
                    </Button>
                    <Grid item md={1}></Grid>
                    <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit}>
                      Cancel
                    </Button>
                  </Grid>
                </Box>
                <br />
              </form>
            </DialogContent>
          </Box>
        </Dialog>
      </Box>

      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={handleCloseerr} color="error">
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* this is info view details */}

      <Dialog open={openInfo} onClose={handleCloseinfo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg" sx={{ marginTop: '50px' }}>
        <Box sx={{ width: '550px', padding: '20px 50px' }}>
          <>
            <Typography sx={userStyle.HeaderText}> Personal Info</Typography>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">addedby</Typography>
                  <br />
                  <Table>
                    <TableHead>
                      <StyledTableCell sx={{ padding: '5px 10px !important' }}>{'SNO'}.</StyledTableCell>
                      <StyledTableCell sx={{ padding: '5px 10px !important' }}> {'UserName'}</StyledTableCell>
                      <StyledTableCell sx={{ padding: '5px 10px !important' }}> {'Date'}</StyledTableCell>
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
              <br />
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Updated by</Typography>
                  <br />
                  <Table>
                    <TableHead>
                      <StyledTableCell sx={{ padding: '5px 10px !important' }}>{'SNO'}.</StyledTableCell>
                      <StyledTableCell sx={{ padding: '5px 10px !important' }}> {'UserName'}</StyledTableCell>
                      <StyledTableCell sx={{ padding: '5px 10px !important' }}> {'Date'}</StyledTableCell>
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
            <br /> <br />
            <br />
            <Grid container spacing={2}>
              <Button variant="contained" onClick={handleCloseinfo} sx={buttonStyles.btncancel}>
                {' '}
                Back{' '}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>
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

      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table aria-label="simple table" id="branch" ref={componentRef}>
          <TableHead sx={{ fontWeight: '600' }}>
            <TableRow>
              <TableCell>SI.NO</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Employee Code</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Team</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rowDataTable &&
              rowDataTable.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{printno++}</TableCell>
                  <TableCell> {row.companyname}</TableCell>
                  <TableCell>{row.empcode}</TableCell>
                  <TableCell>{row.company}</TableCell>
                  <TableCell>{row.branch}</TableCell>
                  <TableCell>{row.unit}</TableCell>
                  <TableCell>{row.team}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
        itemsTwo={employees ?? []}
        filename={'Personal Update'}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />

      <MessageAlert openPopup={openPopupMalert} handleClosePopup={handleClosePopupMalert} popupContent={popupContentMalert} popupSeverity={popupSeverityMalert} />
      {/* SUCCESS */}
      <AlertDialog openPopup={openPopup} handleClosePopup={handleClosePopup} popupContent={popupContent} popupSeverity={popupSeverity} />

      <LoadingDialog open={openPopupUpload} onClose={() => setOpenPopupUpload(false)} progress={uploadProgress} />
    </Box>
  );
}

export default Personalupdate;
