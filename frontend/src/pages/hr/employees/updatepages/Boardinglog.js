import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, FormControlLabel, FormGroup, Grid, IconButton, List, ListItem, ListItemText, MenuItem, OutlinedInput, Popover, Select, TextField, Typography, Chip } from '@mui/material';
import Switch from '@mui/material/Switch';
import axios from 'axios';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';
import moment from 'moment-timezone';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaEdit, FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from 'react-icons/fa';
import { ThreeDots } from 'react-loader-spinner';
import { MultiSelect } from 'react-multi-select-component';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import Selects from 'react-select';
import { useReactToPrint } from 'react-to-print';
import { handleApiError } from '../../../../components/Errorhandling';
import Headtitle from '../../../../components/Headtitle';
import PageHeading from '../../../../components/PageHeading';
import { AuthContext, UserRoleAccessContext } from '../../../../context/Appcontext';
import { colourStyles, userStyle } from '../../../../pageStyle';
import { SERVICE } from '../../../../services/Baseservice';

import LoadingButton from '@mui/lab/LoadingButton';
import AggregatedSearchBar from '../../../../components/AggregatedSearchBar';
import AggridTable from '../../../../components/AggridTable';
import AlertDialog from '../../../../components/Alert';
import ExportData from '../../../../components/ExportData';
import InfoPopup from '../../../../components/InfoPopup.js';
import MessageAlert from '../../../../components/MessageAlert';
import domtoimage from 'dom-to-image';
function BoardingLog() {
  const [updateLoader, setUpdateLoader] = useState(false);
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState('');
  const [popupSeverityMalert, setPopupSeverityMalert] = useState('');
  const handleClickOpenPopupMalert = () => {
    setUpdateLoader(false);
    setOpenPopupMalert(true);
  };
  const workmodeOptions = [
    { label: 'Remote', value: 'Remote' },
    { label: 'Office', value: 'Office' },
  ];

  const handleClosePopupMalert = () => {
    setUpdateLoader(false);
    setOpenPopupMalert(false);
  };
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState('');
  const [popupSeverity, setPopupSeverity] = useState('');
  const handleClickOpenPopup = () => {
    setUpdateLoader(false);
    setOpenPopup(true);
  };
  const handleClosePopup = () => {
    setUpdateLoader(false);
    setOpenPopup(false);
  };

  let exportColumnNames = ['Company', 'Branch', 'Unit', 'Floor', 'Area', 'Team', 'Work Mode', 'Workstation', 'Employeename', 'Process'];
  let exportRowValues = ['companyname', 'branch', 'unit', 'floor', 'area', 'team', 'workmode', 'workstation', 'username', 'process'];

  const gridRef = useRef(null);
  const { auth } = useContext(AuthContext);
  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, allUsersData, alldesignation, allTeam, pageName, setPageName, buttonStyles, workStationSystemName, allUsersLimit } = useContext(UserRoleAccessContext);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

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
        } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0 && data?.subpagenameurl?.includes(window.location.pathname)) {
          fetfinalurl = data.subpagenameurl;
        } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.mainpagenameurl?.includes(window.location.pathname)) {
          fetfinalurl = data.mainpagenameurl;
        } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.submodulenameurl?.includes(window.location.pathname)) {
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
      pagename: String('Boarding Log'),
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

  const [boardinglogcheck, setBoardinglogcheck] = useState(false);
  const [boardinglogEdit, setBoardinglogEdit] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [copiedData, setCopiedData] = useState('');
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [items, setItems] = useState([]);
  const [process, setProcess] = useState([]);
  const [processOption, setProcessOption] = useState([]);
  const [startdateoptionsEdit, setStartdateoptionsEdit] = useState([]);

  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('00');

  const [hrsOption, setHrsOption] = useState([]);
  const [minsOption, setMinsOption] = useState([]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  const [floorNames, setFloorNames] = useState([]);
  const [areaNames, setAreaNames] = useState([]);
  const [allWorkStationOpt, setAllWorkStationOpt] = useState([]);
  const [workStationOpt, setWorkStationOpt] = useState([]);
  const [filteredWorkStation, setFilteredWorkStation] = useState([]);
  const [primaryWorkStation, setPrimaryWorkStation] = useState('Please Select Primary Work Station');
  const [primaryWorkStationLabel, setPrimaryWorkStationLabel] = useState('Select Primary Workstation');
  const [selectedWorkStation, setSelectedWorkStation] = useState('');
  const [selectedOptionsWorkStation, setSelectedOptionsWorkStation] = useState([]);
  const [maxSelections, setMaxSelections] = useState('');
  const [primaryWorkStationInput, setPrimaryWorkStationInput] = useState('');

  let [valueWorkStation, setValueWorkStation] = useState('');

  const processTypes = [
    { label: 'Primary', value: 'Primary' },
    { label: 'Secondary', value: 'Secondary' },
    { label: 'Tertiary', value: 'Tertiary' },
  ];

  const processDuration = [
    { label: 'Full', value: 'Full' },
    { label: 'Half', value: 'Half' },
  ];
  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  useEffect(() => {
    generateHrsOptions();
    generateMinsOptions();
  }, []);

  //function to generate hrs
  const generateHrsOptions = () => {
    const hrsOpt = [];
    for (let i = 0; i <= 23; i++) {
      if (i < 10) {
        i = '0' + i;
      }
      hrsOpt.push({ value: i.toString(), label: i.toString() });
    }
    setHrsOption(hrsOpt);
  };

  //function to generate mins
  const generateMinsOptions = () => {
    const minsOpt = [];
    for (let i = 0; i <= 59; i++) {
      if (i < 10) {
        i = '0' + i;
      }
      minsOpt.push({ value: i.toString(), label: i.toString() });
    }
    setMinsOption(minsOpt);
  };

  let today = new Date();

  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + '-' + mm + '-' + dd;

  const [boardingLogOld, setBoardingLogOld] = useState({});

  const [boardingLog, setBoardingLog] = useState({
    username: '',
    empcode: '',
    company: 'Select Company',
    branch: 'Select Branch',
    unit: 'Select Unit',
    floor: 'Please Select Floor',
    area: 'Please Select Area',
    ifoffice: false,
    team: 'Select Team',
    startdate: formattedDate,
    starttime: currentDateTime.toTimeString().split(' ')[0],
    enddate: 'present',
    endtime: 'present',
    process: 'Select Process',
    processduration: 'Full',
    processtype: 'Primary',
    time: '00:00',
    boardingdate: 'Please Select Start Date',
    department: '',
    companyname: '',
    doj: '',
  });
  const [boardinglogs, setBoardinglogs] = useState([]);

  // Copied fields Name
  const handleCopy = (message) => {
    NotificationManager.success(`${message} 👍`, '', 2000);
  };

  // Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  // Edit model...
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    // if (reason && reason === "backdropClick") return;
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

  // Manage Columns
  const [searchQueryManage, setSearchQueryManage] = useState('');
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

  // Floor Dropdowns
  const fetchfloorNames = async () => {
    setPageName(!pageName);
    try {
      let req = await axios.get(SERVICE.FLOOR, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setFloorNames(
        req.data.floors?.length > 0 &&
        req.data.floors?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        }))
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // Area Dropdowns
  const fetchareaNames = async (e) => {
    setPageName(!pageName);
    try {
      let req = await axios.post(SERVICE.MANPOWERAREAFILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: boardingLog.company,
        floor: String(e),
        branch: boardingLog.branch,
      });

      let result = req?.data?.allareas
        ?.map((item) => {
          return item.area.map((data) => {
            return data;
          });
        })
        .flat();

      setAreaNames(result);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // company multi select
  // const handleEmployeesChange = (options) => {
  //   // If employeecount is greater than 0, limit the selections
  //   if (maxSelections > 0) {
  //     // Limit the selections to the maximum allowed
  //     options = options.slice(0, maxSelections - 1);
  //   }

  //   // Update the disabled property based on the current selections and employeecount
  //   const updatedOptions = filteredWorkStation?.map((option) => ({
  //     ...option,
  //     disabled:
  //       maxSelections - 1 > 0 &&
  //       options?.length >= maxSelections - 1 &&
  //       !options.find(
  //         (selectedOption) => selectedOption.value === option.value
  //       ),
  //   }));

  //   setValueWorkStation(options?.map((a, index) => a.value));
  //   setSelectedOptionsWorkStation(options);
  //   setFilteredWorkStation(updatedOptions);
  // };

  const handleEmployeesChange = (options) => {
    const maxOptions = Number(maxSelections) - 1;

    // Restrict selection to maxOptions
    if (options?.length <= maxOptions) {
      setValueWorkStation(options.map((a) => a.value));
      setSelectedOptionsWorkStation(options);
    }
  };

  const customValueRendererEmployees = (valueWorkStation, _filteredWorkStation) => {
    return valueWorkStation?.length ? valueWorkStation?.map(({ label }) => label).join(', ') : <span style={{ color: 'hsl(0, 0%, 20%)' }}>Please Select Secondary Work Station</span>;
  };

  const fetchWorkStation = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.WORKSTATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const result = res?.data?.locationgroupings.flatMap((item) => {
        return item.combinstation.flatMap((combinstationItem) => {
          return combinstationItem.subTodos?.length > 0 ? combinstationItem.subTodos?.map((subTodo) => subTodo.subcabinname + '(' + item.branch + '-' + item.floor + ')') : [combinstationItem.cabinname + '(' + item.branch + '-' + item.floor + ')'];
        });
      });
      setWorkStationOpt(res?.data?.locationgroupings);
      const processedResult = result.map((e) => {
        const selectedCabinName = e?.split('(')[0];

        const Bracketsbranch = e?.match(/\(([^)]+)\)/)?.[1];

        const hyphenCount = Bracketsbranch.split('-')?.length - 1;

        const Branch = hyphenCount === 1 ? Bracketsbranch.split('-')[0].trim() : Bracketsbranch.split('-').slice(0, 2).join('-');

        const Floor = hyphenCount === 1 ? Bracketsbranch.split('-')[1].trim() : hyphenCount === 2 ? Bracketsbranch.split('-').pop() : Bracketsbranch.split('-').slice(-2).join('-').replace(')', '');

        const shortname = workStationSystemName
          ?.filter((item) => item?.branch === Branch && (Floor === '' || Floor === item?.floor) && item?.cabinname === selectedCabinName)
          ?.map((item) => item?.systemshortname)
          ?.toString();

        return e + `(${shortname})`;
      });
      setAllWorkStationOpt(
        [
          ...processedResult.map((t) => ({
            label: t,
            value: t.replace(/\([^)]*\)$/, ''),
          })),
        ].filter((data) => data.value !== primaryWorkStation)
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //get all Designationmonthset
  const fetchDesignationMonthChange = async (e, Doj, Dep) => {
    setPageName(!pageName);
    try {
      const [response, responseDep] = await Promise.all([
        axios.get(SERVICE.PROCESSMONTHSET_ALL, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.get(SERVICE.DEPMONTHSET_ALL, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
      ]);

      let foundData = response?.data?.processmonthsets?.find((item) => item.process === e.value && new Date(Doj) >= new Date(item.fromdate) && new Date(Doj) <= new Date(item.todate));

      let filteredDatas;

      if (foundData) {
        filteredDatas = response?.data?.processmonthsets
          ?.filter((d) => d.process === e.value && new Date(d.fromdate) >= new Date(foundData.fromdate))
          .map((data) => ({
            label: data.fromdate,
            value: data.fromdate,
          }));

        if (filteredDatas?.length === 0) {
          filteredDatas = responseDep?.data?.departmentdetails
            ?.filter((d) => d.department === Dep && new Date(d.fromdate) >= new Date(Doj))
            .map((data) => ({
              label: data.fromdate,
              value: data.fromdate,
            }));
        }
      } else {
        filteredDatas = responseDep?.data?.departmentdetails
          ?.filter((d) => d.department === Dep && new Date(d.fromdate) >= new Date(Doj))
          .map((data) => ({
            label: moment(data.fromdate).format('DD-MM-YYYY'),
            value: data.fromdate,
          }));
      }

      setStartdateoptionsEdit(filteredDatas);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    var filteredWorks;
    if (boardingLog.unit === '' && boardingLog.floor === '') {
      filteredWorks = workStationOpt?.filter((u) => u.company === boardingLog.company && u.branch === boardingLog.branch);
    } else if (boardingLog.unit === '') {
      filteredWorks = workStationOpt?.filter((u) => u.company === boardingLog.company && u.branch === boardingLog.branch && u.floor === boardingLog.floor);
    } else if (boardingLog.floor === '') {
      filteredWorks = workStationOpt?.filter((u) => u.company === boardingLog.company && u.branch === boardingLog.branch && u.unit === boardingLog.unit);
    } else {
      filteredWorks = workStationOpt?.filter((u) => u.company === boardingLog.company && u.branch === boardingLog.branch && u.unit === boardingLog.unit && u.floor === boardingLog.floor);
    }
    const result = filteredWorks?.flatMap((item) => {
      return item.combinstation.flatMap((combinstationItem) => {
        return combinstationItem.subTodos?.length > 0 ? combinstationItem.subTodos?.map((subTodo) => subTodo.subcabinname + '(' + item.branch + '-' + item.floor + ')') : [combinstationItem.cabinname + '(' + item.branch + '-' + item.floor + ')'];
      });
    });
    const processedResult = result.map((e) => {
      const selectedCabinName = e?.split('(')[0];

      const Bracketsbranch = e?.match(/\(([^)]+)\)/)?.[1];

      const hyphenCount = Bracketsbranch.split('-')?.length - 1;

      const Branch = hyphenCount === 1 ? Bracketsbranch.split('-')[0].trim() : Bracketsbranch.split('-').slice(0, 2).join('-');

      const Floor = hyphenCount === 1 ? Bracketsbranch.split('-')[1].trim() : hyphenCount === 2 ? Bracketsbranch.split('-').pop() : Bracketsbranch.split('-').slice(-2).join('-').replace(')', '');

      const shortname = workStationSystemName
        ?.filter((item) => item?.branch === Branch && (Floor === '' || Floor === item?.floor) && item?.cabinname === selectedCabinName)
        ?.map((item) => item?.systemshortname)
        ?.toString();

      return e + `(${shortname})`;
    });

    // setFilteredWorkStation(result.flat());
    setFilteredWorkStation([
      ...processedResult.map((t) => ({
        label: t,
        value: t.replace(/\([^)]*\)$/, ''),
      })),
    ]);
  }, [boardingLog.company, boardingLog.branch, boardingLog.unit, boardingLog.floor]);

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
    empcode: true,
    username: true,
    companyname: true,
    branch: true,
    unit: true,
    floor: true,
    area: true,
    team: true,
    workstation: true,
    workmode: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

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

  useEffect(() => {
    let result = processOption.filter((d) => d.company === boardingLog?.company && d.branch === boardingLog?.branch && d.unit === boardingLog?.unit && d.team === boardingLog?.team);

    const processall = result.map((d) => ({
      ...d,
      label: d.process,
      value: d.process,
    }));

    setProcess(processall);
  }, [boardingLog.company, boardingLog.branch, boardingLog.unit, boardingLog.team, boardingLog]);
  const fetchProcess = async () => {
    setPageName(!pageName);
    try {
      let res_freq = await axios.get(SERVICE.ALL_PROCESS_AND_TEAM, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setProcessOption(res_freq?.data?.processteam);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchProcess();
  }, []);

  const [oldData, setOldData] = useState({
    company: '',
    branch: '',
    unit: '',
    team: '',
  });
  const [oldTeam, setOldTeam] = useState('');
  const [oldTeamData, setOldTeamData] = useState([]);
  const [oldTeamSupervisor, setoldTeamSupervisor] = useState(false);
  const [newUpdateDataAll, setNewUpdateDataAll] = useState([]);
  const [newDataTeamWise, setNewDataTeamWise] = useState([]);
  const [prevLogDates, setPrveLogDates] = useState([]);
  // get single row to view....
  const [oldDatas, setOldDatas] = useState({});
  const getviewCode = async (e, floor) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setBoardinglogEdit(res?.data?.suser);
      let req = await axios.post(SERVICE.MANPOWERAREAFILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: res?.data?.suser.company,
        floor: String(res?.data?.suser.floor),
        branch: res?.data?.suser.branch,
      });
      let prevLogDates = res?.data?.suser?.boardingLog?.length > 0 ? res?.data?.suser?.boardingLog?.map((data) => data?.startdate) : [];
      setPrveLogDates(prevLogDates);
      let result = req?.data?.allareas
        ?.map((item) => {
          return item.area.map((data) => {
            return data;
          });
        })
        .flat();

      setAreaNames(result);

      let rocketchatshiftgrouping = [];
      let rocketchatshift = [];
      // Check if the user's boardingLog exists and has entries
      if (res?.data?.suser?.boardingLog && res?.data?.suser?.boardingLog?.length > 0) {
        const lastBoardingLog = res?.data?.suser?.boardingLog[res?.data?.suser?.boardingLog?.length - 1];

        // If shifttype is "Standard", push shiftgrouping and shifttiming values
        if (lastBoardingLog.shifttype === 'Standard') {
          if (lastBoardingLog.shiftgrouping) {
            rocketchatshiftgrouping.push(lastBoardingLog.shiftgrouping);
          }
          if (lastBoardingLog.shifttiming) {
            rocketchatshift.push(lastBoardingLog.shifttiming);
          }
        } else if (lastBoardingLog.shifttype !== 'Standard') {
          // If shifttype is not "Standard", check the todo array
          const boardtodo = lastBoardingLog.todo;

          if (boardtodo && boardtodo?.length > 0) {
            // Iterate over the todo array and push shiftgrouping and shifttiming
            boardtodo.forEach((item) => {
              if (item.shiftgrouping) {
                rocketchatshiftgrouping.push(item.shiftgrouping);
              }
              if (item.shifttiming) {
                rocketchatshift.push(item.shifttiming);
              }
            });
          }
        }
      }
      setWorkStationInputOldDatas({
        company: res?.data?.suser.company,
        branch: res?.data?.suser?.branch,
        unit: res?.data?.suser?.unit,
        workmode: res?.data?.suser?.workmode,
        ifoffice: res?.data?.suser?.workstationofficestatus,
        workstationinput: res?.data?.suser?.workstationinput,

        username: res?.data?.suser?.username,
        empcode: res?.data?.suser?.empcode,
        designation: res?.data?.suser?.designation,
        department: res?.data?.suser?.department,

        rocketchatemail: res?.data?.suser?.rocketchatemail,
        rocketchatid: res?.data?.suser?.rocketchatid || '',
        rocketchatroles: res?.data?.suser?.rocketchatroles?.length ? res?.data?.suser?.rocketchatroles : [],
        rocketchatteamid: res?.data?.suser?.rocketchatteamid || [],
        rocketchatchannelid: res?.data?.suser?.rocketchatchannelid || [],

        team: res?.data?.suser?.team,
        companyname: res?.data?.suser?.companyname,
        rocketchatshiftgrouping,
        rocketchatshift,
      });
      setPrimaryWorkStationInput(res?.data?.suser?.workstationinput);
      setPrimaryWorkStation(res?.data?.suser?.workstation[0]);
      console.log('1');
      var filteredWorks;
      if (res?.data?.suser?.unit === '' && res?.data?.suser?.floor === '') {
        filteredWorks = workStationOpt?.filter((u) => u.company === res?.data?.suser?.company && u.branch === res?.data?.suser?.branch);
      } else if (res?.data?.suser?.unit === '') {
        filteredWorks = workStationOpt?.filter((u) => u.company === res?.data?.suser?.company && u.branch === res?.data?.suser?.branch && u.floor === res?.data?.suser?.floor);
      } else if (res?.data?.suser?.floor === '') {
        filteredWorks = workStationOpt?.filter((u) => u.company === res?.data?.suser?.company && u.branch === res?.data?.suser?.branch && u.unit === res?.data?.suser?.unit);
      } else {
        filteredWorks = workStationOpt?.filter((u) => u.company === res?.data?.suser?.company && u.branch === res?.data?.suser?.branch && u.unit === res?.data?.suser?.unit && u.floor === res?.data?.suser?.floor);
      }
      console.log('2');
      const resultNew = filteredWorks.flatMap((item) => {
        return item.combinstation.flatMap((combinstationItem) => {
          return combinstationItem.subTodos?.length > 0 ? combinstationItem.subTodos.map((subTodo) => subTodo.subcabinname + '(' + item.branch + '-' + item.floor + ')') : [combinstationItem.cabinname + '(' + item.branch + '-' + item.floor + ')'];
        });
      });
      console.log('3');
      const processedResult = resultNew.map((e) => {
        const selectedCabinName = e?.split('(')[0];

        const Bracketsbranch = e?.match(/\(([^)]+)\)/)?.[1];

        const hyphenCount = Bracketsbranch.split('-')?.length - 1;

        const Branch = hyphenCount === 1 ? Bracketsbranch.split('-')[0].trim() : Bracketsbranch.split('-').slice(0, 2).join('-');

        const Floor = hyphenCount === 1 ? Bracketsbranch.split('-')[1].trim() : hyphenCount === 2 ? Bracketsbranch.split('-').pop() : Bracketsbranch.split('-').slice(-2).join('-').replace(')', '');

        const shortname = workStationSystemName
          ?.filter((item) => item?.branch === Branch && (Floor === '' || Floor === item?.floor) && item?.cabinname === selectedCabinName)
          ?.map((item) => item?.systemshortname)
          ?.toString();

        return e + `(${shortname})`;
      });
      console.log('4');
      // The processedResult array now contains all the mapped `shortname` values
      let workstationsFinal = [
        ...processedResult.map((t) => ({
          label: t,
          value: t.replace(/\([^)]*\)$/, ''),
        })),
      ];

      let primaryWorkstationNew = res?.data?.suser?.workstation[0];

      let findLabel = workstationsFinal?.find((item) => item.label.includes(primaryWorkstationNew));
      console.log('5');
      setPrimaryWorkStationLabel(findLabel?.label);

      // setGettingOldDatas(res?.data?.suser);
      setOldTeam(res?.data?.suser);
      if (res?.data?.suser?.boardingLog?.length !== 0) {
        setHours(res?.data?.suser?.time);
        setMinutes(res?.data?.suser?.timemins);
      } else {
        setHours('00');
        setMinutes('00');
      }

      handleClickOpenEdit();

      setOldDatas(res?.data?.suser);
      if (res?.data?.suser?.boardingLog?.length > 0) {
        setBoardingLog({
          ...boardingLog,
          username: res?.data?.suser?.companyname,
          empcode: res?.data?.suser?.empcode,

          company: res?.data?.suser?.company,
          branch: res?.data?.suser?.branch,
          unit: res?.data?.suser?.unit,
          floor: res?.data?.suser?.floor,
          area: res?.data?.suser?.area,
          workstation: res?.data?.suser?.workstation,
          team: res?.data?.suser?.team,
          process: res?.data?.suser?.process,
          department: res?.data?.suser?.department,
          doj: res?.data?.suser?.doj,

          boardingdate: res?.data?.suser?.boardingLog[res?.data?.suser?.boardingLog?.length - 1].startdate,
          processduration: res?.data?.suser?.processduration,
          processtype: res?.data?.suser?.processtype,
          companyname: res?.data?.suser?.companyname,

          ifoffice: res?.data?.suser?.workstationofficestatus,
          workmode: res?.data?.suser?.workmode,
          workstationinput: res?.data?.suser?.workstationinput,
        });
        setBoardingLogOld({
          ...boardingLogOld,
          username: res?.data?.suser?.companyname,
          empcode: res?.data?.suser?.empcode,
          company: res?.data?.suser?.company,
          branch: res?.data?.suser?.branch,
          unit: res?.data?.suser?.unit,
          team: res?.data?.suser?.team,
          floor: res?.data?.suser?.floor,
          area: res?.data?.suser?.area,
          workstation: res?.data?.suser?.workstation,
          process: res?.data?.suser?.process,
          department: res?.data?.suser?.department,
          doj: res?.data?.suser?.doj,
          boardingdate: res?.data?.suser?.boardingLog[res?.data?.suser?.boardingLog?.length - 1].startdate,
          processduration: res?.data?.suser?.processduration,
          processtype: res?.data?.suser?.processtype,
          ifoffice: res?.data?.suser?.workstationofficestatus,
          workmode: res?.data?.suser?.workmode,
          workstationinput: res?.data?.suser?.workstationinput,
        });
      } else {
        setBoardingLog({
          ...boardingLog,
          username: res?.data?.suser?.companyname,
          empcode: res?.data?.suser?.empcode,
          company: res?.data?.suser?.company,
          branch: res?.data?.suser?.branch,
          unit: res?.data?.suser?.unit,
          floor: res?.data?.suser?.floor,
          area: res?.data?.suser?.area,
          workstation: res?.data?.suser?.workstation,
          team: res?.data?.suser?.team,
          process: res?.data?.suser?.process,
          department: res?.data?.suser?.department,
          doj: res?.data?.suser?.doj,
          processduration: res?.data?.suser?.processduration,
          processtype: res?.data?.suser?.processtype,
          companyname: res?.data?.suser?.companyname,
          ifoffice: res?.data?.suser?.workstationofficestatus,
          ifoffice: res?.data?.suser?.workstationofficestatus,
          workmode: res?.data?.suser?.workmode,
          workstationinput: res?.data?.suser?.workstationinput,
        });
        setBoardingLogOld({
          ...boardingLog,
          username: res?.data?.suser?.companyname,
          empcode: res?.data?.suser?.empcode,
          company: res?.data?.suser?.company,
          branch: res?.data?.suser?.branch,
          unit: res?.data?.suser?.unit,
          team: res?.data?.suser?.team,
          floor: res?.data?.suser?.floor,
          area: res?.data?.suser?.area,
          workstation: res?.data?.suser?.workstation,
          process: res?.data?.suser?.process,
          department: res?.data?.suser?.department,
          doj: res?.data?.suser?.doj,
          processduration: res?.data?.suser?.processduration,
          processtype: res?.data?.suser?.processtype,
          ifoffice: res?.data?.suser?.workstationofficestatus,
          workmode: res?.data?.suser?.workmode,
          workstationinput: res?.data?.suser?.workstationinput,
        });
      }
      setOldData({
        ...oldData,
        empcode: res?.data?.suser?.empcode,
        company: res?.data?.suser?.company,
        unit: res?.data?.suser?.unit,
        branch: res?.data?.suser?.branch,
        team: res?.data?.suser?.team,
        floor: res?.data?.suser?.floor,
        area: res?.data?.suser?.area,
        workstation: res?.data?.suser?.workstation,
        ifoffice: res?.data?.suser?.workstationofficestatus,
        workmode: res?.data?.suser?.workmode,
        workstationinput: res?.data?.suser?.workstationinput,
      });
      console.log('7');
      setSelectedWorkStation(res?.data?.suser?.workstation.slice(1, res?.data?.suser?.workstation?.length));
      console.log('8');
      const employeeCount = res?.data?.suser?.employeecount || 0;
      const wfhcount = res?.data?.suser?.wfhcount || 0;
      setMaxSelections(Number(employeeCount) + Number(wfhcount));
      console.log('9');
      let secondaryWorkstation =
        res?.data?.suser?.workstation?.length > 1
          ? res?.data?.suser?.workstation?.slice(1, res?.data?.suser?.workstation?.length)?.map((x) => ({
            ...x,
            label: x,
            value: x,
          }))
          : [];

      console.log('10');
      let foundDataNew = secondaryWorkstation?.map((item) => {
        let getData = allWorkStationOpt?.find((data) => data.value === item.value);
        return {
          ...item,
          label: getData?.label,
        };
      });
      console.log('11');
      console.log(secondaryWorkstation, 'secondaryWorkstation');
      console.log(foundDataNew, 'foundDataNew');

      setSelectedOptionsWorkStation(foundDataNew);

      setValueWorkStation(res?.data?.suser?.workstation.slice(1, res?.data?.suser?.workstation?.length));

      fetchDesignationMonthChange(
        {
          value: res?.data?.suser?.process,
        },
        res?.data?.suser?.doj,
        res?.data?.suser?.department
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  function getUniqueData(dataArray) {
    const uniqueData = [];
    const seen = new Set();

    for (const item of dataArray) {
      // Sort supervisorchoose array for consistent uniqueness checks
      const supervisorKey = item.supervisorchoose ? [...item.supervisorchoose].sort().join(',') : '';

      // Create a unique key based on (team, designation, supervisorchoose)
      const key = `${item.team}-${item.designation}-${supervisorKey}`;

      if (!seen.has(key)) {
        seen.add(key);
        uniqueData.push(item);
      }
    }

    return uniqueData;
  }

  const fetchSuperVisorChangingHierarchy = async (value) => {
    if (oldTeam?.team !== value) {
      let designationGrpName = alldesignation?.find((data) => oldTeam?.designation === data?.name)?.group;
      let res = await axios.post(SERVICE.HIERARCHY_PROCESSALOOT_TEAM_RELATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldteam: oldTeam?.team,
        team: value,
        user: boardingLog,
        desiggroup: designationGrpName,
      });
      const oldData = res?.data?.olddata?.length > 0 ? getUniqueData(res?.data?.olddata) : [];
      const newDataAll = res?.data?.newdata[0]?.all?.length > 0 ? getUniqueData(res?.data?.newdata[0]?.all) : [];
      const newDataRemaining = res?.data?.newdata[0]?.team?.length > 0 ? getUniqueData(res?.data?.newdata[0]?.team) : [];
      const newDataAllSupervisor = res?.data?.supData?.length > 0 ? getUniqueData(res?.data?.supData) : [];

      setoldTeamSupervisor(newDataAllSupervisor);
      setOldTeamData(oldData);
      setNewUpdateDataAll(newDataAll);
      setNewDataTeamWise(newDataRemaining);
      console.log(oldData, newDataAll, newDataRemaining, newDataAllSupervisor);

      //  console.log(uniqueData);
    } else {
      setOldTeamData([]);
      setNewUpdateDataAll([]);
      setNewDataTeamWise([]);
    }
  };

  const [showButton, setShowButton] = useState(true);
  //get all processmonthset
  const fetchProcessMonth = async (e) => {
    setPageName(!pageName);
    try {
      const response = await axios.get(SERVICE.PROCESSMONTHSET_ALL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let monthSet = response.data.processmonthsets.filter((data) => data.process == e?.process).some((data) => data.fromdate === formattedDate);
      let monthSetEmpty = response.data.processmonthsets.filter((data) => data.process == e?.process);

      if (monthSet) {
        setShowButton(true);
      } else if (monthSetEmpty?.length == 0) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //get all processmonthset
  const fetchProcessMonthChange = async (e) => {
    setPageName(!pageName);
    try {
      const response = await axios.get(SERVICE.PROCESSMONTHSET_ALL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let monthSet = response.data.processmonthsets.filter((data) => data.process == e?.value);
      let monthSetEmpty = response.data.processmonthsets.filter((data) => data.process == e?.value);

      let findDate = monthSet.some((data) => data.fromdate === formattedDate);

      if (findDate) {
        setShowButton(true);
      } else if (monthSetEmpty?.length == 0) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
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
      setBoardinglogEdit(res?.data?.suser);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  //Project updateby edit page...
  let updateby = boardinglogEdit?.updatedby;
  let addedby = boardinglogEdit?.addedby;

  const sendEditRequest = async () => {
    setPageName(!pageName);
    try {
      let workStationInput = await workStationAutoGenerate();
      if (boardingLog.company !== oldDatas.company || boardingLog.branch !== oldDatas.branch || boardingLog.unit !== oldDatas.unit || boardingLog.team !== oldDatas.team) {
        await axios.post(
          `${SERVICE.UPDATE_LOGINALLOT_LOGPAGES}`,
          {
            empname: oldDatas.companyname,
            company: boardingLog?.company,
            branch: boardingLog?.branch,
            unit: boardingLog?.unit,
            team: String(boardingLog?.team),
            date: String(boardingLog.boardingdate),

            workmode: boardingLog?.workmode,
            workstationinput: String(boardingLog.workmode === 'Remote' || boardingLog.ifoffice ? workStationInput : ''),
            workstationofficestatus: Boolean(boardingLog.ifoffice),
          },
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          }
        );
      }
      if (boardingLog.company === boardinglogEdit.company && boardingLog.branch === boardinglogEdit.branch && boardingLog.unit === boardinglogEdit.unit && boardingLog.team === boardinglogEdit.team && boardingLog.process === boardinglogEdit.process) {
        let res = await axios.put(
          `${SERVICE.USER_SINGLE_PWD}/${boardinglogEdit._id}`,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            company: String(boardingLog.company),
            branch: String(boardingLog.branch),
            unit: String(boardingLog.unit),
            team: String(boardingLog.team),
            username: workStationInputOldDatas?.username,
            companyname: workStationInputOldDatas?.companyname,
            department: workStationInputOldDatas?.department,
            designation: workStationInputOldDatas?.designation,
            rocketchatemail: workStationInputOldDatas?.rocketchatemail,
            rocketchatid: workStationInputOldDatas?.rocketchatid,
            rocketchatroles: workStationInputOldDatas?.rocketchatroles,
            rocketchatteamid: workStationInputOldDatas?.rocketchatteamid,
            rocketchatchannelid: workStationInputOldDatas?.rocketchatchannelid,
            workmode: boardingLog?.workmode,
            process: boardingLog?.process,
            rocketchatshiftgrouping: workStationInputOldDatas?.rocketchatshiftgrouping,
            rocketchatshift: workStationInputOldDatas?.rocketchatshift,
            floor: String(boardingLog.floor),
            area: String(boardingLog.area),
            workstation: boardingLog.workmode !== 'Remote' ? (valueWorkStation?.length === 0 ? primaryWorkStation : [primaryWorkStation, ...valueWorkStation]) : [primaryWorkStation, ...valueWorkStation],
            workstationinput: String(boardingLog.workmode === 'Remote' || boardingLog.ifoffice ? workStationInput : ''),
            workstationofficestatus: Boolean(boardingLog.ifoffice),
            boardingLog: [
              ...boardinglogEdit.boardingLog,
              {
                workmode: boardingLog?.workmode,
                ischangeworkmode: boardingLog?.workmode !== boardinglogEdit?.workmode,

                workstationinput: String(boardingLog.workmode === 'Remote' || boardingLog.ifoffice ? workStationInput : ''),
                workstationofficestatus: Boolean(boardingLog.ifoffice),

                username: String(boardinglogEdit.companyname),
                company: String(boardingLog.company),
                startdate: String(boardingLog.boardingdate), // Fixed the field names
                time: `${hours}:${minutes}`,
                branch: String(boardingLog.branch), // Fixed the field names
                unit: String(boardingLog.unit),
                team: String(boardingLog.team),
                floor: String(boardingLog.floor),
                area: String(boardingLog.area),
                workstation: boardingLog.workmode !== 'Remote' ? (valueWorkStation?.length === 0 ? primaryWorkStation : [primaryWorkStation, ...valueWorkStation]) : [primaryWorkStation, ...valueWorkStation],
                ischangecompany: boardinglogEdit.company === boardingLog.company ? Boolean(false) : Boolean(true),
                ischangebranch: boardinglogEdit.company === boardingLog.company ? (boardinglogEdit.branch === boardingLog.branch ? Boolean(false) : Boolean(true)) : Boolean(true),
                ischangeunit: boardinglogEdit.branch === boardingLog.branch ? (boardinglogEdit.unit === boardingLog.unit ? Boolean(false) : Boolean(true)) : Boolean(true),
                ischangeteam: boardinglogEdit.unit === boardingLog.unit ? (boardinglogEdit.team === boardingLog.team ? Boolean(false) : Boolean(true)) : Boolean(true),
                ischangefloor: boardinglogEdit.company === boardingLog.company ? (boardinglogEdit.branch === boardingLog.branch ? Boolean(false) : Boolean(true)) : Boolean(true),
                ischangearea: boardinglogEdit.company === boardingLog.company ? (boardinglogEdit.branch === boardingLog.branch ? (boardinglogEdit.floor === boardingLog.floor ? Boolean(false) : Boolean(true)) : Boolean(true)) : Boolean(true),
                ischangeworkstation:
                  boardinglogEdit.company === boardingLog.company ? (boardinglogEdit.branch === boardingLog.branch ? (boardinglogEdit.unit === boardingLog.unit ? (boardinglogEdit.floor === boardingLog.floor ? Boolean(false) : Boolean(true)) : Boolean(true)) : Boolean(true)) : Boolean(true),
                logcreation: 'boarding',
                updatedusername: String(isUserRoleAccess.companyname),
                updateddatetime: String(new Date()),
                shifttype: boardinglogEdit?.boardingLog[boardinglogEdit?.boardingLog?.length - 1].shifttype,
                shifttiming: boardinglogEdit?.boardingLog[boardinglogEdit?.boardingLog?.length - 1].shifttiming,
                shiftgrouping: boardinglogEdit?.boardingLog[boardinglogEdit?.boardingLog?.length - 1].shiftgrouping,
                weekoff: boardinglogEdit?.boardingLog[boardinglogEdit?.boardingLog?.length - 1].weekoff,
                todo: boardinglogEdit?.boardingLog[boardinglogEdit?.boardingLog?.length - 1].todo,
                logeditedby: [],
              },
            ],
            updatedby: [
              ...updateby,
              {
                name: String(isUserRoleAccess.companyname),
                date: String(new Date()),
              },
            ],
          },
          {}
        );
      } else {
        let res = await axios.put(
          `${SERVICE.USER_SINGLE_PWD}/${boardinglogEdit._id}`,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            company: String(boardingLog.company),
            branch: String(boardingLog.branch),
            unit: String(boardingLog.unit),
            team: String(boardingLog.team),
            floor: String(boardingLog.floor),
            area: String(boardingLog.area),
            username: workStationInputOldDatas?.username,
            companyname: workStationInputOldDatas?.companyname,
            department: workStationInputOldDatas?.department,
            designation: workStationInputOldDatas?.designation,
            rocketchatemail: workStationInputOldDatas?.rocketchatemail,
            rocketchatid: workStationInputOldDatas?.rocketchatid,
            rocketchatroles: workStationInputOldDatas?.rocketchatroles,
            rocketchatteamid: workStationInputOldDatas?.rocketchatteamid,
            rocketchatchannelid: workStationInputOldDatas?.rocketchatchannelid,
            workmode: boardingLog?.workmode,
            rocketchatshiftgrouping: workStationInputOldDatas?.rocketchatshiftgrouping,
            rocketchatshift: workStationInputOldDatas?.rocketchatshift,
            workstation: boardingLog.workmode !== 'Remote' ? (valueWorkStation?.length === 0 ? primaryWorkStation : [primaryWorkStation, ...valueWorkStation]) : [primaryWorkStation, ...valueWorkStation],
            workstationinput: String(boardingLog.workmode === 'Remote' || boardingLog.ifoffice ? workStationInput : ''),
            workstationofficestatus: Boolean(boardingLog.ifoffice),
            process: String(boardingLog.process),
            processtype: String(boardingLog.processtype),
            processduration: String(boardingLog.processduration),
            time: String(hours),
            timemins: String(minutes),
            boardingLog: [
              ...boardinglogEdit.boardingLog,
              {
                workmode: boardingLog?.workmode,
                ischangeworkmode: boardingLog?.workmode !== boardinglogEdit?.workmode,
                workstationinput: String(boardingLog.workmode === 'Remote' || boardingLog.ifoffice ? workStationInput : ''),
                workstationofficestatus: Boolean(boardingLog.ifoffice),

                username: String(boardinglogEdit.companyname),
                company: String(boardingLog.company),
                startdate: String(boardingLog.boardingdate), // Fixed the field names
                time: `${hours}:${minutes}`,
                branch: String(boardingLog.branch), // Fixed the field names
                unit: String(boardingLog.unit),
                team: String(boardingLog.team),
                floor: String(boardingLog.floor),
                area: String(boardingLog.area),
                workstation: boardingLog.workmode !== 'Remote' ? (valueWorkStation?.length === 0 ? primaryWorkStation : [primaryWorkStation, ...valueWorkStation]) : [primaryWorkStation, ...valueWorkStation],
                ischangecompany: boardinglogEdit.company === boardingLog.company ? Boolean(false) : Boolean(true),
                ischangebranch: boardinglogEdit.company === boardingLog.company ? (boardinglogEdit.branch === boardingLog.branch ? Boolean(false) : Boolean(true)) : Boolean(true),
                ischangeunit: boardinglogEdit.branch === boardingLog.branch ? (boardinglogEdit.unit === boardingLog.unit ? Boolean(false) : Boolean(true)) : Boolean(true),
                ischangeteam: boardinglogEdit.unit === boardingLog.unit ? (boardinglogEdit.team === boardingLog.team ? Boolean(false) : Boolean(true)) : Boolean(true),
                ischangefloor: boardinglogEdit.company === boardingLog.company ? (boardinglogEdit.branch === boardingLog.branch ? Boolean(false) : Boolean(true)) : Boolean(true),
                ischangearea: boardinglogEdit.company === boardingLog.company ? (boardinglogEdit.branch === boardingLog.branch ? (boardinglogEdit.floor === boardingLog.floor ? Boolean(false) : Boolean(true)) : Boolean(true)) : Boolean(true),
                ischangeworkstation:
                  boardinglogEdit.company === boardingLog.company ? (boardinglogEdit.branch === boardingLog.branch ? (boardinglogEdit.unit === boardingLog.unit ? (boardinglogEdit.floor === boardingLog.floor ? Boolean(false) : Boolean(true)) : Boolean(true)) : Boolean(true)) : Boolean(true),
                logcreation: 'boarding',
                updatedusername: String(isUserRoleAccess.companyname),
                updateddatetime: String(new Date()),
                shifttype: boardinglogEdit?.boardingLog[boardinglogEdit?.boardingLog?.length - 1].shifttype,
                shifttiming: boardinglogEdit?.boardingLog[boardinglogEdit?.boardingLog?.length - 1].shifttiming,
                shiftgrouping: boardinglogEdit?.boardingLog[boardinglogEdit?.boardingLog?.length - 1].shiftgrouping,
                weekoff: boardinglogEdit?.boardingLog[boardinglogEdit?.boardingLog?.length - 1].weekoff,
                todo: boardinglogEdit?.boardingLog[boardinglogEdit?.boardingLog?.length - 1].todo,
                logeditedby: [],
              },
            ],
            processlog: [
              ...boardinglogEdit.processlog,
              {
                company: String(boardingLog.company),
                branch: String(boardingLog.branch),
                unit: String(boardingLog.unit),
                team: String(boardingLog.team),
                empname: String(boardinglogEdit.companyname),
                process: String(boardingLog.process),
                processtype: String(boardingLog.processtype),
                processduration: String(boardingLog.processduration),
                date: String(boardingLog.boardingdate),
                logeditedby: [],
                updateddatetime: String(new Date()),
                updatedusername: String(isUserRoleAccess.companyname),
                time: `${hours}:${minutes}`,
              },
            ],
            updatedby: [
              ...updateby,
              {
                name: String(isUserRoleAccess.companyname),
                date: String(new Date()),
              },
            ],
          },
          {}
        );
      }

      // Deleting the Old Data of TEAM MATCHED
      if (oldTeamData?.length > 0) {
        let ans = oldTeamData?.map((data) => {
          axios.delete(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          });
        });
      }
      // // Adding NEW TEAM TO ALL Conditon Employee
      // if (newUpdateDataAll?.length > 0) {
      //   let res = await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
      //     headers: {
      //       Authorization: `Bearer ${auth.APIToken}`,
      //     },

      //     company: String(newUpdateDataAll[0]?.company),
      //     designationgroup: String(newUpdateDataAll[0]?.designationgroup),
      //     department: String(newUpdateDataAll[0]?.department),
      //     branch: String(newUpdateDataAll[0].branch),
      //     unit: String(newUpdateDataAll[0].unit),
      //     team: String(boardingLog.team),
      //     supervisorchoose: String(newUpdateDataAll[0].supervisorchoose),
      //     mode: String(newUpdateDataAll[0].mode),
      //     level: String(newUpdateDataAll[0].level),
      //     control: String(newUpdateDataAll[0].control),
      //     pagecontrols: newUpdateDataAll[0]?.pagecontrols,
      //     employeename: boardinglogEdit.companyname,
      //     access: newUpdateDataAll[0].access,
      //     action: Boolean(true),
      //     empbranch: boardingLog?.branch,
      //     empunit: boardingLog.unit,
      //     empcode: oldTeam?.empcode,
      //     empteam: boardingLog.team,
      //     addedby: [
      //       {
      //         name: String(isUserRoleAccess?.username),
      //         date: String(new Date()),
      //       },
      //     ],
      //   });
      // }

      // // Adding NEW TEAM TO ACTUAL TEAM WISE DATA  Conditon Employee
      // if (newDataTeamWise?.length > 0) {
      //   let res = await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
      //     headers: {
      //       Authorization: `Bearer ${auth.APIToken}`,
      //     },

      //     company: String(newDataTeamWise[0].company),
      //     designationgroup: String(newDataTeamWise[0]?.designationgroup),
      //     department: String(newDataTeamWise[0].department),
      //     branch: String(newDataTeamWise[0].branch),
      //     unit: String(newDataTeamWise[0].unit),
      //     team: String(boardingLog.team),
      //     supervisorchoose: String(newDataTeamWise[0].supervisorchoose),
      //     mode: String(newDataTeamWise[0].mode),
      //     level: String(newDataTeamWise[0].level),
      //     control: String(newDataTeamWise[0].control),
      //     pagecontrols: newDataTeamWise[0].pagecontrols,
      //     employeename: boardinglogEdit.companyname,
      //     access: newDataTeamWise[0].access,

      //     action: Boolean(true),
      //     empbranch: boardingLog?.branch,
      //     empunit: boardingLog.unit,
      //     empcode: oldTeam?.empcode,
      //     empteam: boardingLog.team,
      //     addedby: [
      //       {
      //         name: String(isUserRoleAccess?.username),
      //         date: String(new Date()),
      //       },
      //     ],
      //   });
      // }

      async function addNewTeams(dataArray) {
        await Promise.all(
          dataArray.map(async (item) => {
            await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              company: String(item.company),
              designationgroup: String(item.designationgroup),
              department: String(item.department),
              branch: String(item.branch),
              unit: String(item.unit),
              team: String(item.team),
              supervisorchoose: String(item.supervisorchoose),
              mode: String(item.mode),
              level: String(item.level),
              control: String(item.control),
              pagecontrols: item.pagecontrols,
              access: item?.access,

              employeename: boardinglogEdit.companyname,
              action: Boolean(true),
              empbranch: boardingLog?.branch,
              empunit: boardingLog.unit,
              empcode: oldTeam?.empcode,
              empteam: boardingLog.team,
              addedby: [
                {
                  name: String(isUserRoleAccess?.username),
                  date: String(new Date()),
                },
              ],
            });
          })
        );
      }
      // Execute the operations
      if (newUpdateDataAll?.length > 0) {
        await addNewTeams(newUpdateDataAll);
      }

      if (newDataTeamWise?.length > 0) {
        await addNewTeams(newDataTeamWise);
      }

      handleCloseModEdit();

      setBoardingLog({
        ...boardingLog,
        company: 'Select Company',
        branch: 'Select Branch',
        unit: 'Select Unit',
        team: 'Select Team',
        process: 'Select Process',
        processduration: 'Full',
        processtype: 'Primary',
        companyname: '',
        floor: 'Please Select Floor',
        area: 'Please Select Area',
        ifoffice: false,
      });

      setPopupContent('Updated Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
      setFilteredChanges(null);
      setFilteredRowData([]);
      await fetchBoardinglog();
      setUpdateLoader(false);
    } catch (err) {
      setUpdateLoader(false);
      // console.log(err, "error")
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const editSubmit = (e) => {
    setUpdateLoader(true);
    e.preventDefault();

    // Check if there are any changes
    const isChanged = Object.keys(boardingLog).some((key) => boardingLog[key] !== boardingLogOld[key]);

    if (prevLogDates?.includes(boardingLog.boardingdate)) {
      setPopupContentMalert('Date Can not be same as prev logs!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (boardingLog.company === 'Select Company') {
      setPopupContentMalert('Please Select Company!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (boardingLog.branch === 'Select Branch') {
      setPopupContentMalert('Please Select Branch!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (boardingLog.unit === 'Select Unit') {
      setPopupContentMalert('Please Select Unit!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (boardingLog.floor === 'Please Select Floor') {
      setPopupContentMalert('Please Select Floor!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (boardingLog.area === 'Please Select Area') {
      setPopupContentMalert('Please Select Area!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (boardingLog.team === 'Select Team') {
      setPopupContentMalert('Please Select Team!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (!boardingLog.workmode) {
      setPopupContentMalert('Please Select Work Mode!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (primaryWorkStation === 'Please Select Primary Work Station') {
      setPopupContentMalert('Please Select Primary Work Station!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (selectedOptionsWorkStation?.length === 0) {
      setPopupContentMalert('Please Select Secondary Work Station!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (boardingLog.process === 'Please Select Process' || boardingLog.process === 'Select Process' || boardingLog.process === undefined) {
      setPopupContentMalert('Please Select Process!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (boardingLog.processtype === 'Select Process Type' || boardingLog.processtype === '' || boardingLog.processtype === undefined) {
      setPopupContentMalert('Please Select Process Type!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (boardingLog.processduration === 'Select Process Duration' || boardingLog.processduration === '' || boardingLog.processduration === undefined) {
      setPopupContentMalert('Please Select Process Duration!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (boardingLog.boardingdate === 'Please Select Start Date' || boardingLog.boardingdate === '' || boardingLog.boardingdate === undefined) {
      setPopupContentMalert('Please Select Start Date!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (hours === 'Hrs' || minutes === 'Mins') {
      setPopupContentMalert('Please Select Duration!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (hours == '00' && minutes == '00') {
      setPopupContentMalert('Please Select Duration!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (!isChanged) {
      setPopupContentMalert('No Changes to Update!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (
      boardinglogEdit.company === boardingLog.company &&
      boardinglogEdit.branch === boardingLog.branch &&
      boardinglogEdit.unit === boardingLog.unit &&
      boardinglogEdit.team === boardingLog.team &&
      boardinglogEdit.floor === boardingLog.floor &&
      boardinglogEdit.area === boardingLog.area &&
      boardinglogEdit.workstation[0] === primaryWorkStation &&
      boardinglogEdit.workstation.slice(1) === valueWorkStation?.length &&
      boardinglogEdit.workstation.slice(1).every((d) => valueWorkStation.includes(d)) &&
      boardinglogEdit.process === boardingLog.process
    ) {
      setPopupContentMalert('No Changes to Update!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (isChanged && oldTeamData?.length > 0 && newUpdateDataAll?.length < 1 && newDataTeamWise?.length < 1) {
      setPopupContentMalert('This Employee is not allowed to Change Team with their Designation , Create in Hierarchy First!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    }
    //  if (isChanged && oldTeamSupervisor?.length > 0) {
    //   setPopupContentMalert(
    //     "This Employee is supervisor in hierarchy , So not allowed to Change Team!"
    //   );
    //   setPopupSeverityMalert("info");
    //   handleClickOpenPopupMalert();
    // }
    else {
      // console.log("lkk")
      // console.log(isChanged ,  oldTeamData?.length > 0 ,  newUpdateDataAll?.length < 1 , newDataTeamWise?.length < 1)
      sendEditRequest();
    }
  };

  // console.log(oldTeamData?.length > 0 && (newUpdateDataAll?.length < 1 && newDataTeamWise?.length < 1))
  //get all Sub vendormasters.

  const [boardinglogsFilterArray, setBoardinglogsFilterArray] = useState([]);

  const fetchBoardinglogArray = async () => {
    setPageName(!pageName);
    try {
      let res_participants = await axios.get(SERVICE.USERALLLIMIT, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setBoardinglogsFilterArray(res_participants?.data?.users);
      setBoardinglogcheck(true);
    } catch (err) {
      setBoardinglogcheck(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchBoardinglogArray();
  }, [isFilterOpen]);

  useEffect(() => {
    fetchWorkStation();
    fetchfloorNames();
    fetchUnitNames();
    fetchbranchNames();
  }, []);

  // Excel
  const fileName = 'Boarding Log';

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Boarding Log',
    pageStyle: 'print',
  });

  // image

  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage
        .toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, 'BoardingLog.png');
        })
        .catch((error) => {
          console.error('dom-to-image error: ', error);
        });
    }
  };
  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  const addSerialNumber = (datas) => {
    setItems(datas);
  };

  useEffect(() => {
    addSerialNumber(boardinglogs);
  }, [boardinglogs]);
  const [searchedString, setSearchedString] = useState('');
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTable = useRef(null);

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

  // datatable....
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const searchOverTerms = searchQuery?.toLowerCase()?.split(' ');
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchOverTerms.every((term) => Object.values(item)?.join(' ')?.toLowerCase()?.includes(term));
  });

  const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(filteredDatas?.length / pageSize);

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
      field: 'serialNumber',
      headerName: 'SNo',
      flex: 0,
      width: 100,
      hide: !columnVisibility.serialNumber,
      headerClassName: 'bold-header',
      pinned: 'left',
    },
    {
      field: 'companyname',
      headerName: 'Company Name',
      flex: 0,
      width: 150,
      hide: !columnVisibility.username,
      headerClassName: 'bold-header',
      pinned: 'left',
    },
    {
      field: 'branch',
      headerName: 'Branch',
      flex: 0,
      width: 100,
      hide: !columnVisibility.branch,
      headerClassName: 'bold-header',
      pinned: 'left',
    },
    {
      field: 'unit',
      headerName: 'Unit',
      flex: 0,
      width: 100,
      hide: !columnVisibility.unit,
      headerClassName: 'bold-header',
    },
    {
      field: 'floor',
      headerName: 'Floor',
      flex: 0,
      width: 150,
      hide: !columnVisibility.floor,
      headerClassName: 'bold-header',
    },
    {
      field: 'area',
      headerName: 'Area',
      flex: 0,
      width: 150,
      hide: !columnVisibility.area,
      headerClassName: 'bold-header',
    },
    {
      field: 'team',
      headerName: 'Team',
      flex: 0,
      width: 100,
      hide: !columnVisibility.team,
      headerClassName: 'bold-header',
    },
    {
      field: 'workmode',
      headerName: 'Work Mode',
      flex: 0,
      width: 100,
      hide: !columnVisibility.workmode,
      headerClassName: 'bold-header',
    },
    {
      field: 'workstation',
      headerName: 'Workstation',
      flex: 0,
      width: 180,
      hide: !columnVisibility.workstation,
      headerClassName: 'bold-header',
    },
    {
      field: 'username',
      headerName: 'Employee Name',
      flex: 0,
      width: 200,
      hide: !columnVisibility.username,
      cellStyle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
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
                handleCopy('Copied Employee Name!');
              }}
              options={{ message: 'Copied Employee Name!' }}
              text={params?.data?.username}
            >
              <ListItemText primary={params?.data?.username} />
            </CopyToClipboard>
          </ListItem>
        </Grid>
      ),
    },
    {
      field: 'process',
      headerName: 'Process',
      flex: 0,
      width: 150,
      hide: !columnVisibility.process,
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
      cellStyle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      headerClassName: 'bold-header',
      cellRenderer: (params) => (
        <Grid sx={{ display: 'flex' }}>
          {isUserRoleCompare?.includes('vboardinglog') && (
            <Button
              variant="contained"
              sx={{
                minWidth: '15px',
                padding: '6px 5px',
              }}
              onClick={() => {
                window.open(`/updatepages/boardingloglist/${params.data.id}`, '_blank');
              }}
            >
              <MenuIcon style={{ fontsize: 'small' }} />
            </Button>
          )}
          &ensp;
          {isUserRoleCompare?.includes('eboardinglog') && (
            <Button
              style={{
                backgroundColor: 'red',
                minWidth: '15px',
                padding: '6px 5px',
              }}
              onClick={async () => {
                await fetchProcessMonth(params.data);

                await getviewCode(params.data.id, params.data.floor);
              }}
            >
              <FaEdit style={{ color: 'white', fontSize: '18px' }} />
            </Button>
          )}
          {isUserRoleCompare?.includes('iboardinglog') && (
            <Button
              onClick={() => {
                getinfoCode(params.data.id);
              }}
            >
              <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />
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
      empcode: item.empcode,
      username: item.username,
      companyname: item.companyname,
      branch: item.branch,
      unit: item.unit,
      floor: item.floor,
      area: item.area,
      workmode: item.workmode,
      workstation: item.workstation,
      team: item.team,
      process: item.process,
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

  const [fileFormat, setFormat] = useState('');

  const [selectedBranchCode, setSelectedBranchCode] = useState('');
  const [selectedUnitCode, setSelectedUnitCode] = useState('');
  const [workStationInputOldDatas, setWorkStationInputOldDatas] = useState({});
  const [repotingtonames, setrepotingtonames] = useState([]);

  const fetchUsernames = async () => {
    setrepotingtonames(allUsersData);
  };

  const workStationAutoGenerate = async () => {
    try {
      let aggregationPipeline = [
        {
          $match: {
            company: boardingLog.company,
            branch: boardingLog.branch,
            unit: boardingLog.unit,
            workstationinput: { $regex: '_[0-9]+_' }, // Match workstation codes
          },
        },
        {
          $addFields: {
            workstationNumber: {
              $toInt: { $arrayElemAt: [{ $split: ['$workstationinput', '_'] }, 1] },
            },
          },
        },
        {
          $sort: { workstationNumber: -1 }, // Get the highest workstation number
        },
        {
          $limit: 1,
        },
      ];

      let req = await axios.post(
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
      let result = req.data.users;

      let lastwscode = result?.length > 0 ? result[0].workstationNumber + 1 : 1;
      let formattedWorkstationCode = lastwscode.toString().padStart(2, '0');

      let autoWorkStation = `W${selectedBranchCode?.slice(0, 2)?.toUpperCase() || ''}${selectedUnitCode?.slice(0, 2)?.toUpperCase() || ''}_${formattedWorkstationCode || ''}_${workStationInputOldDatas?.username?.toUpperCase() || ''}`;

      let finalAuto = autoWorkStation?.slice(0, 15);
      if (workStationInputOldDatas?.company === boardingLog.company && workStationInputOldDatas?.branch === boardingLog.branch && workStationInputOldDatas?.unit === boardingLog.unit && workStationInputOldDatas?.workstationinput !== '') {
        setPrimaryWorkStationInput(workStationInputOldDatas?.workstationinput?.slice(0, 15));
        return workStationInputOldDatas?.workstationinput?.slice(0, 15);
      } else {
        setPrimaryWorkStationInput(finalAuto);
        return finalAuto;
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  // const workStationAutoGenerate = async () => {
  //   setPageName(!pageName);
  //   try {
  //     let lastwscode;
  //     let lastworkstation = repotingtonames
  //       .filter(
  //         (item) =>
  //           // item?.workmode !== "Internship" &&
  //           item.company === boardingLog.company &&
  //           item.branch === boardingLog.branch &&
  //           item.unit === boardingLog.unit
  //       )
  //       ?.filter((item) => /_[0-9]+_/.test(item?.workstationinput));

  //     if (lastworkstation?.length === 0) {
  //       lastwscode = 0;
  //     } else {
  //       let highestWorkstation = lastworkstation.reduce(
  //         (max, item) => {
  //           const num = parseInt(item.workstationinput.split("_")[1]);
  //           return num > max.num ? { num, item } : max;
  //         },
  //         { num: 0, item: null }
  //       ).num;

  //       lastwscode = highestWorkstation.toString().padStart(2, "0");
  //     }

  //     let autoWorkStation = `W${selectedBranchCode?.toUpperCase()}${selectedUnitCode?.toUpperCase()}_${lastwscode === 0
  //       ? "01"
  //       : (Number(lastwscode) + 1).toString().padStart(2, "0")
  //       }_${workStationInputOldDatas?.username?.toUpperCase()}`;

  //     if (
  //       workStationInputOldDatas?.company === boardingLog.company &&
  //       workStationInputOldDatas?.branch === boardingLog.branch &&
  //       workStationInputOldDatas?.unit === boardingLog.unit
  //       // &&
  //       // workStationInputOldDatas?.workmode === empaddform.workmode
  //     ) {
  //       setPrimaryWorkStationInput(
  //         workStationInputOldDatas?.workstationinput === "" ||
  //           workStationInputOldDatas?.workstationinput == undefined
  //           ? autoWorkStation
  //           : workStationInputOldDatas?.workstationinput
  //       );
  //     } else {
  //       setPrimaryWorkStationInput(autoWorkStation);
  //     }
  //   } catch (err) {
  //     handleApiError(
  //       err,
  //       setPopupContentMalert,
  //       setPopupSeverityMalert,
  //       handleClickOpenPopupMalert
  //     );
  //   }
  // };

  const [branchNames, setBranchNames] = useState([]);
  const [unitNames, setUnitNames] = useState([]);

  // Branch Dropdowns
  const fetchbranchNames = async () => {
    setPageName(!pageName);
    try {
      let req = await axios.get(SERVICE.BRANCH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setBranchNames(req.data.branch);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchUnitNames = async () => {
    // let branch = getunitname ? getunitname : empaddform.branch;
    setPageName(!pageName);
    try {
      let req = await axios.get(SERVICE.UNIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setUnitNames(req?.data?.units);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    const branchCode = branchNames?.filter((item) => item.name === boardingLog.branch && item.company === boardingLog.company);
    setSelectedBranchCode(branchCode[0]?.code.slice(0, 2));

    const unitCode = unitNames?.filter((item) => item.name === boardingLog.unit);
    setSelectedUnitCode(unitCode[0]?.code.slice(0, 2));
  }, [boardingLog.branch, boardingLog.unit]);

  useEffect(() => {
    workStationAutoGenerate();
  }, [boardingLog.company, boardingLog.branch, boardingLog.unit, boardingLog.workmode, boardingLog?.ifoffice, selectedBranchCode, selectedUnitCode]);

  useEffect(() => {
    fetchUsernames();
  }, [boardingLog.unit]);

  //FILTER START
  const [internChecked, setInternChecked] = useState(false);
  useEffect(() => {
    fetchDepartments();
  }, []);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const fetchDepartments = async () => {
    setPageName(!pageName);
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
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [filterState, setFilterState] = useState({
    type: 'Individual',
    employeestatus: 'Please Select Employee Status',
  });
  const EmployeeStatusOptions = [
    { label: 'Live Employee', value: 'Live Employee' },
    { label: 'Releave Employee', value: 'Releave Employee' },
    { label: 'Absconded', value: 'Absconded' },
    { label: 'Hold', value: 'Hold' },
    { label: 'Terminate', value: 'Terminate' },
  ];
  const TypeOptions = [
    { label: 'Individual', value: 'Individual' },
    { label: 'Department', value: 'Department' },
    { label: 'Company', value: 'Company' },
    { label: 'Branch', value: 'Branch' },
    { label: 'Unit', value: 'Unit' },
    { label: 'Team', value: 'Team' },
  ];

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
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
    setValueEmp([]);
  };

  const customValueRendererUnit = (valueUnitCat, _categoryname) => {
    return valueUnitCat?.length ? valueUnitCat.map(({ label }) => label)?.join(', ') : 'Please Select Unit';
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
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
    setValueEmp([]);
  };

  const customValueRendererTeam = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length ? valueTeamCat.map(({ label }) => label)?.join(', ') : 'Please Select Team';
  };

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
  //employee multiselect
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

  const [valueEmp, setValueEmp] = React.useState([]); // State for employees
  const [isBoxFocused, setIsBoxFocused] = React.useState(false); // Track focus state

  const [searchInputValue, setSearchInputValue] = useState('');

  const handlePasteForEmp = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');

    // Process the pasted text
    const pastedNames = pastedText
      .split(/[\n,]+/)
      .map((name) => name.trim())
      .filter((name) => name !== '');

    // Update the state
    updateEmployees(pastedNames);

    // Clear the search input after paste
    setSearchInputValue('');

    // Refocus the element
    e.target.focus();
  };

  // const handlePasteForEmp = (e) => {
  //   e.preventDefault();
  //   const pastedText = e.clipboardData.getData('text');

  //   // Process the pasted text
  //   const newValues = pastedText.split('\n').filter((value) => value.trim() !== '');
  //   const pastedNames = newValues
  //     .flatMap(value => value.split(","))
  //     .map(name => name.replace(/\s*\.\s*/g, ".").trim())
  //     .filter(name => name !== "");

  //   // Update the state
  //   updateEmployees(pastedNames);

  //   // Refocus the Box after paste
  //   e.target.focus();
  // };

  useEffect(() => {
    updateEmployees([]); // Pass an empty array instead of an empty string
  }, [allUsersData, valueCompanyCat, valueBranchCat, valueUnitCat, valueTeamCat]);

  // const updateEmployees = (pastedNames) => {
  //   // Ensure pastedNames is always an array
  //   const namesArray = Array.isArray(pastedNames) ? pastedNames : [];

  //   const availableOptions = allUsersLimit
  //     ?.filter(
  //       (comp) =>
  //         valueCompanyCat?.includes(comp.company) &&
  //         valueBranchCat?.includes(comp.branch) &&
  //         valueUnitCat?.includes(comp.unit) &&
  //         valueTeamCat?.includes(comp.team)
  //     )
  //     ?.map(data => data.companyname.replace(/\s*\.\s*/g, ".").trim())

  //   const matchedValues = namesArray.filter((name) =>
  //     availableOptions.includes(name.replace(/\s*\.\s*/g, ".").trim())
  //   );

  //   setValueEmp((prev) => {
  //     const uniqueValues = matchedValues.filter((value) => !prev.includes(value));
  //     const updatedValues = [...prev, ...uniqueValues];
  //     const uniqueSet = new Set(updatedValues); // Ensure uniqueness
  //     return Array.from(uniqueSet);
  //   });

  //   setSelectedOptionsEmployee((prev) => {
  //     // Filter out duplicates from namesArray
  //     const uniqueValues = matchedValues.filter((value) =>
  //       !prev.some((item) => item.value === value.replace(/\s*\.\s*/g, ".").trim())
  //     );

  //     // Map the unique values to label-value pairs
  //     const uniqueValuesMap = uniqueValues.map((data) => ({
  //       label: data.replace(/\s*\.\s*/g, ".").trim(),
  //       value: data.replace(/\s*\.\s*/g, ".").trim(),
  //     }));

  //     // Merge with previous values
  //     const updatedValues = [...prev, ...uniqueValuesMap];

  //     // Deduplicate based on the `value` property using a Map
  //     const uniqueSet = new Map(updatedValues.map((item) => [item.value, item]));

  //     // Convert the Map back to an array
  //     const uniqueArray = Array.from(uniqueSet.values());

  //     return uniqueArray;
  //   });

  //   setValueEmployeeCat((prev) => {
  //     const uniqueValues = matchedValues.filter((value) => !prev.includes(value));
  //     const updatedValues = [...prev, ...uniqueValues];
  //     const uniqueSet = new Set(updatedValues); // Ensure uniqueness
  //     return Array.from(uniqueSet);
  //   });

  // };

  // Handle clicks outside the Box

  const updateEmployees = (pastedNames) => {
    // Your existing update logic...
    const namesArray = Array.isArray(pastedNames) ? pastedNames : [];

    const availableOptions = internChecked
      ? allUsersData?.filter((u) => valueCompanyCat?.includes(u.company) && valueBranchCat?.includes(u.branch) && valueUnitCat?.includes(u.unit) && valueTeamCat?.includes(u.team) && u.workmode === 'Internship')?.map((data) => data.companyname.replace(/\s*\.\s*/g, '.').trim())
      : allUsersData?.filter((u) => valueCompanyCat?.includes(u.company) && valueBranchCat?.includes(u.branch) && valueUnitCat?.includes(u.unit) && valueTeamCat?.includes(u.team) && u.workmode !== 'Internship')?.map((data) => data.companyname.replace(/\s*\.\s*/g, '.').trim());

    const matchedValues = namesArray.filter((name) => availableOptions.includes(name.replace(/\s*\.\s*/g, '.').trim()));

    // Update selected options
    const newOptions = matchedValues.map((value) => ({
      label: value,
      value: value,
    }));

    setSelectedOptionsEmployee((prev) => {
      const newValues = newOptions.filter((newOpt) => !prev.some((prevOpt) => prevOpt.value === newOpt.value));
      return [...prev, ...newValues];
    });

    // Update other states...
    setValueEmp((prev) => [...new Set([...prev, ...matchedValues])]);
    setValueEmployeeCat((prev) => [...new Set([...prev, ...matchedValues])]);
  };

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

  //MULTISELECT ONCHANGE END
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
    setEmployeeOptions([]);
    setBoardinglogs([]);
    setInternChecked(false);
    setFilterState({
      type: 'Individual',
      employeestatus: 'Please Select Employee Status',
    });

    setPopupContent('Cleared Successfully');
    setPopupSeverity('success');
    handleClickOpenPopup();
  };

  const [filterLoader, setFilterLoader] = useState(false);
  const [tableLoader, setTableLoader] = useState(false);
  const handleFilter = () => {
    if (filterState?.type === 'Please Select Type' || filterState?.type === '') {
      setPopupContentMalert('Please Select Type!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (selectedOptionsCompany?.length === 0) {
      setPopupContentMalert('Please Select Company!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    }
    // else if (
    //   filterState?.employeestatus === "Please Select Employee Status" ||
    //   filterState?.employeestatus === ""
    // ) {
    //   setPopupContentMalert("Please Select Employee Status!");
    //   setPopupSeverityMalert("info");
    //   handleClickOpenPopupMalert();
    // }
    else if (['Individual', 'Branch', 'Unit', 'Team']?.includes(filterState?.type) && selectedOptionsBranch?.length === 0) {
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
      fetchBoardinglog();
    }
  };

  const fetchBoardinglog = async () => {
    setFilterLoader(true);
    setTableLoader(true);
    setPageName(!pageName);
    setSearchQuery('');
    setSearchedString('');
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
            ...(valueCompanyCat?.length > 0
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
            ...(valueBranchCat?.length > 0
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
            ...(valueUnitCat?.length > 0
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
            ...(valueTeamCat?.length > 0
              ? [
                {
                  team: { $in: valueTeamCat },
                },
              ]
              : []),
            // Conditional department filter
            ...(valueDepartmentCat?.length > 0
              ? [
                {
                  department: { $in: valueDepartmentCat },
                },
              ]
              : []),
            // Conditional Employee filter
            ...(valueEmployeeCat?.length > 0
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
          empcode: 1,
          companyname: 1,
          company: 1,
          branch: 1,
          unit: 1,
          team: 1,
          department: 1,
          designation: 1,
          floor: 1,
          area: 1,
          workstation: 1,
          boardingLog: 1,
          username: 1,
          workmode: 1,
          process: 1,
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
      const itemsWithSerialNumber = response.data.users?.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
        id: item._id,
        username: item.companyname,
        companyname: item.company,
        workmode: item.workmode,
      }));
      setSearchQuery('');
      setFilteredChanges(null);
      setFilteredRowData([]);
      setBoardinglogs(itemsWithSerialNumber);

      setFilterLoader(false);
      setTableLoader(false);
    } catch (err) {
      console.log(err);
      setFilterLoader(true);
      setTableLoader(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //auto select all dropdowns
  const [allAssignCompany, setAllAssignCompany] = useState([]);
  const [allAssignBranch, setAllAssignBranch] = useState([]);
  const [allAssignUnit, setAllAssignUnit] = useState([]);
  const handleAutoSelect = async () => {
    setPageName(!pageName);
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

      let mappedemployees = allUsersData
        ?.filter((u) => selectedCompany?.includes(u.company) && selectedBranch?.includes(u.branch) && selectedUnit?.includes(u.unit) && selectedTeam?.includes(u.team) && u.workmode !== 'Internship')
        .map((u) => ({
          label: u.companyname,
          value: u.companyname,
        }));

      let employees = allUsersData?.filter((u) => selectedCompany?.includes(u.company) && selectedBranch?.includes(u.branch) && selectedUnit?.includes(u.unit) && selectedTeam?.includes(u.team) && u.workmode !== 'Internship').map((u) => u.companyname);
      setValueTeamCat(selectedTeam);
      setSelectedOptionsTeam(mappedTeam);
      setAllAssignCompany(selectedCompany);

      setAllAssignBranch(selectedBranch);

      setAllAssignUnit(selectedUnit);

      setValueEmployeeCat(employees);
      setSelectedOptionsEmployee(mappedemployees);

      setValueEmp(mappedemployees?.map((item) => item?.value));
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    handleAutoSelect();
  }, [isAssignBranch]);

  //FILTER END

  return (
    <Box>
      <NotificationContainer />
      <Headtitle title={'BOARDING LOG'} />
      {/* ****** Header Content ****** */}
      <PageHeading title="Boarding Log" modulename="Human Resources" submodulename="HR" mainpagename="Employee" subpagename="Employee Log Details" subsubpagename="Boarding Log" />
      {isUserRoleCompare?.includes('lboardinglog') && (
        <>
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
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

                {/* <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Employee Status<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={EmployeeStatusOptions}
                        styles={colourStyles}
                        value={{
                          label:
                            filterState.employeestatus ??
                            "Please Select Employee Status",
                          value:
                            filterState.employeestatus ??
                            "Please Select Employee Status",
                        }}
                        onChange={(e) => {
                          setFilterState((prev) => ({
                            ...prev,
                            employeestatus: e.value,
                          }));
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
                        }}
                      />
                    </FormControl>
                  </Grid> */}

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
                {/* {["Individual"]?.includes(filterState.type) && (
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Employee<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={
                          internChecked
                            ? allUsersData
                              ?.filter(
                                (u) =>
                                  valueCompanyCat?.includes(u.company) &&
                                  valueBranchCat?.includes(u.branch) &&
                                  valueUnitCat?.includes(u.unit) &&
                                  valueTeamCat?.includes(u.team) &&
                                  u.workmode === "Internship"
                              )
                              .map((u) => ({
                                label: u.companyname,
                                value: u.companyname,
                              }))
                            : allUsersData
                              ?.filter(
                                (u) =>
                                  valueCompanyCat?.includes(u.company) &&
                                  valueBranchCat?.includes(u.branch) &&
                                  valueUnitCat?.includes(u.unit) &&
                                  valueTeamCat?.includes(u.team) &&
                                  u.workmode !== "Internship"
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
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={internChecked}
                          onChange={(event) => {
                            setInternChecked(event.target.checked);
                            setValueEmployeeCat([]);
                            setSelectedOptionsEmployee([]);
                            setValueEmp([]);
                          }}
                        />
                      }
                      label="Internship"
                    />
                  </Grid>
                )} */}
                {['Individual']?.includes(filterState.type) && (
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Employee<b style={{ color: 'red' }}>*</b>
                      </Typography>
                      <div onPaste={handlePasteForEmp} style={{ position: 'relative' }}>
                        <MultiSelect
                          options={
                            internChecked
                              ? allUsersData
                                ?.filter((u) => valueCompanyCat?.includes(u.company) && valueBranchCat?.includes(u.branch) && valueUnitCat?.includes(u.unit) && valueTeamCat?.includes(u.team) && u.workmode === 'Internship')
                                .map((u) => ({
                                  label: u.companyname,
                                  value: u.companyname,
                                }))
                              : allUsersData
                                ?.filter((u) => valueCompanyCat?.includes(u.company) && valueBranchCat?.includes(u.branch) && valueUnitCat?.includes(u.unit) && valueTeamCat?.includes(u.team) && u.workmode !== 'Internship')
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
                          // Add these props if your MultiSelect supports them
                          inputValue={searchInputValue} // Add this state if needed
                          onInputChange={(newValue) => setSearchInputValue(newValue)}
                        />
                      </div>
                    </FormControl>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={internChecked}
                          onChange={(event) => {
                            setInternChecked(event.target.checked);
                            setValueEmployeeCat([]);
                            setSelectedOptionsEmployee([]);
                            setValueEmp([]);
                          }}
                        />
                      }
                      label="Internship"
                    />
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
                <Grid item md={3} xs={12} sm={6} mt={3}>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <LoadingButton variant="contained" color="primary" onClick={handleFilter} loading={filterLoader} sx={buttonStyles.buttonsubmit}>
                      Filter
                    </LoadingButton>

                    <Button sx={buttonStyles.btncancel} onClick={handleClearFilter}>
                      Clear
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </>
          </Box>
        </>
      )}
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes('lboardinglog') && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Boarding Log</Typography>
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
                    <MenuItem value={boardinglogs?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes('excelboardinglog') && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          fetchBoardinglogArray();
                          setFormat('xl');
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileExcel />
                        &ensp;Export to Excel&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('csvboardinglog') && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          fetchBoardinglogArray();
                          setFormat('csv');
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileCsv />
                        &ensp;Export to CSV&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('printboardinglog') && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('pdfboardinglog') && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true);
                          fetchBoardinglogArray();
                        }}
                      >
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('imageboardinglog') && (
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
                  maindatas={boardinglogs}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                  totalDatas={boardinglogs}
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
            <br />
            <br />
            {tableLoader ? (
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
                  gridRefTable={gridRefTable}
                  paginated={false}
                  filteredDatas={filteredDatas}
                  // totalDatas={totalProjects}
                  searchQuery={searchQuery}
                  handleShowAllColumns={handleShowAllColumns}
                  setFilteredRowData={setFilteredRowData}
                  filteredRowData={filteredRowData}
                  setFilteredChanges={setFilteredChanges}
                  filteredChanges={filteredChanges}
                  gridRefTableImg={gridRefTableImg}
                  itemsList={boardinglogs}
                />
              </>
            )}
          </Box>
        </>
      )}

      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth={true}
          maxWidth="lg"
          sx={{
            marginTop: '50px',
            overflow: 'auto',
            '& .MuiPaper-root': {
              overflow: 'auto',
            },
          }}
        >
          <Box sx={{ padding: '5px 20px' }}>
            <>
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <Typography sx={userStyle.HeaderText}>
                    Boarding Log Change <b style={{ color: 'red' }}>{'(' + boardinglogEdit.companyname + ')'}</b>
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <Selects
                      options={isAssignBranch
                        ?.map((data) => ({
                          label: data.company,
                          value: data.company,
                        }))
                        .filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                      styles={colourStyles}
                      value={{
                        label: boardingLog.company,
                        value: boardingLog.company,
                      }}
                      onChange={(e) => {
                        setBoardingLog({
                          ...boardingLog,
                          company: e.value,
                          branch: 'Select Branch',
                          unit: 'Select Unit',
                          team: 'Select Team',
                          floor: 'Please Select Floor',
                          area: 'Please Select Area',
                          process: 'Select Process',
                          boardingdate: 'Please Select Start Date',
                          processduration: 'Full',
                          processtype: 'Primary',
                        });
                        setPrimaryWorkStation('Please Select Primary Work Station');
                        setSelectedOptionsWorkStation([]);
                        setAreaNames([]);
                        setPrimaryWorkStationInput('');
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <Selects
                      options={isAssignBranch
                        ?.filter((comp) => boardingLog.company === comp.company)
                        ?.map((data) => ({
                          label: data.branch,
                          value: data.branch,
                        }))
                        .filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                      styles={colourStyles}
                      value={{
                        label: boardingLog.branch,
                        value: boardingLog.branch,
                      }}
                      onChange={(e) => {
                        setBoardingLog({
                          ...boardingLog,
                          branch: e.value,
                          unit: 'Select Unit',
                          team: 'Select Team',
                          floor: 'Please Select Floor',
                          area: 'Please Select Area',
                          process: 'Select Process',
                          boardingdate: 'Please Select Start Date',
                          processduration: 'Full',
                          processtype: 'Primary',
                        });
                        setPrimaryWorkStation('Please Select Primary Work Station');
                        setSelectedOptionsWorkStation([]);
                        setAreaNames([]);
                        setPrimaryWorkStationInput('');
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Unit<b style={{ color: 'red' }}>*</b>{' '}
                    </Typography>
                    <Selects
                      options={isAssignBranch
                        ?.filter((comp) => boardingLog.company === comp.company && boardingLog.branch === comp.branch)
                        ?.map((data) => ({
                          label: data.unit,
                          value: data.unit,
                        }))
                        .filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                      styles={colourStyles}
                      value={{
                        label: boardingLog.unit,
                        value: boardingLog.unit,
                      }}
                      onChange={(e) => {
                        setBoardingLog({
                          ...boardingLog,
                          unit: e.value,
                          processduration: 'Full',
                          processtype: 'Primary',
                          team: 'Select Team',
                          process: 'Select Process',
                          boardingdate: 'Please Select Start Date',
                        });
                        setPrimaryWorkStation('Please Select Primary Work Station');
                        setSelectedOptionsWorkStation([]);
                        setPrimaryWorkStationInput('');
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Floor<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={floorNames
                        ?.filter((u) => u.branch === boardingLog.branch)
                        ?.map((u) => ({
                          ...u,
                          label: u.name,
                          value: u.name,
                        }))}
                      placeholder="Please Select Floor"
                      value={{
                        label: boardingLog.floor !== '' ? boardingLog.floor : 'Please Select Floor',
                        value: boardingLog.floor !== '' ? boardingLog.floor : 'Please Select Floor',
                      }}
                      onChange={(e, i) => {
                        setBoardingLog({
                          ...boardingLog,
                          floor: e.value,
                          area: 'Please Select Area',
                        });
                        fetchareaNames(e.value);
                        setPrimaryWorkStation('Please Select Primary Work Station');
                        setSelectedOptionsWorkStation([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Area<b style={{ color: 'red' }}>*</b>
                    </Typography>

                    <Selects
                      options={areaNames?.map((data) => ({
                        label: data,
                        value: data,
                      }))}
                      styles={colourStyles}
                      value={{
                        label: boardingLog?.area === '' || boardingLog?.area == undefined ? 'Please Select Area' : boardingLog?.area,
                        value: boardingLog?.area === '' || boardingLog?.area == undefined ? 'Please Select Area' : boardingLog?.area,
                      }}
                      onChange={(e) => {
                        setBoardingLog({ ...boardingLog, area: e.value });
                        setPrimaryWorkStation('Please Select Primary Work Station');
                        setSelectedOptionsWorkStation([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <Typography>
                    Team<b style={{ color: 'red' }}>*</b>
                  </Typography>
                  <FormControl fullWidth>
                    <Selects
                      options={allTeam
                        ?.filter((comp) => boardingLog.company === comp.company && boardingLog.branch === comp.branch && boardingLog.unit === comp.unit)
                        ?.map((data) => ({
                          label: data.teamname,
                          value: data.teamname,
                        }))
                        .filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                      styles={colourStyles}
                      value={{
                        label: boardingLog.team,
                        value: boardingLog.team,
                      }}
                      onChange={(e) => {
                        setBoardingLog({
                          ...boardingLog,
                          team: e.value,
                          process: 'Select Process',
                          processduration: 'Full',
                          processtype: 'Primary',
                          boardingdate: 'Please Select Start Date',
                        });
                        // checkHierarchyName(e.value, "Team");
                        fetchSuperVisorChangingHierarchy(e.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                {boardingLog.workmode === 'Internship' ? (
                  <Grid item md={3} sm={6} xs={12}>
                    <FormControl size="small" fullWidth>
                      <Typography>Work Mode</Typography>
                      <OutlinedInput id="component-outlined" type="text" placeholder="Please Enter Work Station" value="Internship" readOnly />
                    </FormControl>
                  </Grid>
                ) : (
                  <Grid item md={3} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Work Mode<b style={{ color: 'red' }}>*</b>
                      </Typography>
                      <Selects
                        maxMenuHeight={300}
                        options={workmodeOptions}
                        placeholder="Please Select Work Mode"
                        value={{
                          label: boardingLog?.workmode ? boardingLog?.workmode : 'Please Select Work Mode',
                          value: boardingLog?.workmode ? boardingLog?.workmode : 'Please Select Work Mode',
                        }}
                        onChange={(e) => {
                          setBoardingLog((prev) => ({
                            ...prev,
                            workmode: e.value,
                            ifoffice: false,
                          }));
                        }}
                      />
                    </FormControl>
                  </Grid>
                )}
                {boardingLog.workmode === 'Office' && (
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl size="small" fullWidth>
                      <Typography>If Office</Typography>
                    </FormControl>
                    <Grid>
                      <FormGroup>
                        <FormControlLabel
                          control={<Checkbox checked={boardingLog.ifoffice === true} />}
                          onChange={(e) => {
                            setBoardingLog({
                              ...boardingLog,
                              ifoffice: !boardingLog.ifoffice,
                            });
                            // setPrimaryWorkStation("Please Select Primary Work Station")
                            setPrimaryWorkStationInput('');
                          }}
                          label="Work Station Other"
                        />
                      </FormGroup>
                    </Grid>
                  </Grid>
                )}
                {boardingLog.workmode !== 'Remote' ? (
                  <>
                    {' '}
                    {boardingLog.ifoffice === true && (
                      <>
                        <Grid item md={3} sm={6} xs={12}>
                          <FormControl size="small" fullWidth>
                            <Typography>Work Station (WFH)</Typography>
                            <OutlinedInput id="component-outlined" type="text" placeholder="Please Enter Work Station" value={primaryWorkStationInput} readOnly />
                          </FormControl>
                        </Grid>
                      </>
                    )}
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>
                          Work Station (Primary)
                          <b style={{ color: 'red' }}>*</b>
                        </Typography>
                        <Selects
                          options={filteredWorkStation.filter((item, index, self) => {
                            return index === self.findIndex((i) => i.value === item.value);
                          })}
                          label="Please Select Shift"
                          value={{
                            label: primaryWorkStationLabel,
                            value: primaryWorkStation,
                          }}
                          onChange={(e) => {
                            setPrimaryWorkStation(e.value);
                            setPrimaryWorkStationLabel(e.label);
                            setSelectedOptionsWorkStation([]);
                            setValueWorkStation([]);
                          }}
                          isDisabled={maxSelections === 0}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>
                          Work Station (Secondary)
                          <b style={{ color: 'red' }}>*</b>
                        </Typography>
                        <MultiSelect
                          size="small"
                          options={allWorkStationOpt.filter((item, index, self) => {
                            return index === self.findIndex((i) => i.value === item.value) && item.value !== primaryWorkStation;
                          })}
                          isDisabled={maxSelections === 0}
                          value={selectedOptionsWorkStation}
                          onChange={handleEmployeesChange}
                          valueRenderer={customValueRendererEmployees}
                          disabled={maxSelections === 0 || Number(maxSelections) < 1 || primaryWorkStation === 'Please Select Primary Work Station' || primaryWorkStation === '' || !primaryWorkStation}
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item md={3} sm={6} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Work Station (WFH)</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Please Enter Work Station"
                          value={primaryWorkStationInput}
                          // onChange={(e) => {
                          //   setPrimaryWorkStationInput(e.target.value);
                          // }}
                          readOnly
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>
                          Work Station (Primary)
                          <b style={{ color: 'red' }}>*</b>
                        </Typography>
                        <Selects
                          options={filteredWorkStation.filter((item, index, self) => {
                            return index === self.findIndex((i) => i.value === item.value);
                          })}
                          label="Please Select Shift"
                          value={{
                            label: primaryWorkStation ? primaryWorkStation : 'Please Select Primary Work Station',
                            value: primaryWorkStation ? primaryWorkStation : 'Please Select Primary Work Station',
                          }}
                          onChange={(e) => {
                            setPrimaryWorkStation(e.value);
                            setSelectedOptionsWorkStation([]);
                            setValueWorkStation([]);
                          }}
                          isDisabled={maxSelections === 0}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>
                          Work Station (Secondary)
                          <b style={{ color: 'red' }}>*</b>
                        </Typography>
                        <MultiSelect
                          size="small"
                          options={allWorkStationOpt.filter((item, index, self) => {
                            return index === self.findIndex((i) => i.value === item.value) && item.value !== primaryWorkStation;
                          })}
                          value={selectedOptionsWorkStation}
                          onChange={handleEmployeesChange}
                          valueRenderer={customValueRendererEmployees}
                          disabled={maxSelections === 0 || Number(maxSelections) < 1 || primaryWorkStation === 'Please Select Primary Work Station' || primaryWorkStation === '' || !primaryWorkStation}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}

                <Grid item md={3} xs={12} sm={6}>
                  <Typography>
                    Process<b style={{ color: 'red' }}>*</b>
                  </Typography>
                  <FormControl fullWidth>
                    <Selects
                      options={process}
                      styles={colourStyles}
                      value={{
                        label: boardingLog.process,
                        value: boardingLog.process,
                      }}
                      onChange={(e) => {
                        setBoardingLog({
                          ...boardingLog,
                          process: e.value,
                          processduration: 'Full',
                          processtype: 'Primary',
                          boardingdate: 'Please Select Start Date',
                        });
                        fetchProcessMonthChange(e);
                        fetchDesignationMonthChange(e, boardingLog.doj, boardingLog.department);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <Typography>
                    Process type<b style={{ color: 'red' }}>*</b>
                  </Typography>
                  <FormControl fullWidth>
                    <Selects
                      options={processTypes}
                      styles={colourStyles}
                      value={{
                        label: boardingLog.processtype,
                        value: boardingLog.processtype,
                      }}
                      onChange={(e) => {
                        setBoardingLog({
                          ...boardingLog,
                          processtype: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <Typography>
                    Process Duration<b style={{ color: 'red' }}>*</b>
                  </Typography>
                  <FormControl fullWidth>
                    <Selects
                      options={processDuration}
                      styles={colourStyles}
                      value={{
                        label: boardingLog.processduration,
                        value: boardingLog.processduration,
                      }}
                      onChange={(e) => {
                        setBoardingLog({
                          ...boardingLog,
                          processduration: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <Typography>
                    Start Date <b style={{ color: 'red' }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Selects
                      options={startdateoptionsEdit}
                      styles={colourStyles}
                      value={{
                        label: boardingLog.boardingdate !== '' && boardingLog.boardingdate !== 'Please Select Start Date' ? moment(boardingLog.boardingdate).format('DD-MM-YYYY') : 'Please Select Start Date',
                        value: boardingLog.boardingdate,
                      }}
                      onChange={(e) => {
                        setBoardingLog({
                          ...boardingLog,
                          boardingdate: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <Grid container spacing={1}>
                    <Grid item md={6} xs={12} sm={6}>
                      <Typography>
                        Duration Hrs<b style={{ color: 'red' }}>*</b>
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Selects
                          maxMenuHeight={300}
                          options={hrsOption}
                          placeholder="00"
                          value={{ label: hours, value: hours }}
                          onChange={(e) => {
                            setHours(e.value);
                            setBoardingLog({
                              ...boardingLog,
                              time: `${e.value}:${minutes}`,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12} sm={6}>
                      <Typography>Mins</Typography>
                      <FormControl fullWidth size="small">
                        <Selects
                          maxMenuHeight={300}
                          options={minsOption}
                          placeholder="00"
                          value={{ label: minutes, value: minutes }}
                          onChange={(e) => {
                            setMinutes(e.value);
                            setBoardingLog({
                              ...boardingLog,
                              time: `${hours}:${e.value}`,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <LoadingButton variant="contained" color="primary" onClick={editSubmit} loading={updateLoader} sx={buttonStyles.buttonsubmit}>
                    Update
                  </LoadingButton>
                  &emsp;
                  <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit}>
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </Dialog>
      </Box>
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

      {/* EXTERNAL COMPONENTS -------------- START */}
      {/* VALIDATION */}
      <MessageAlert openPopup={openPopupMalert} handleClosePopup={handleClosePopupMalert} popupContent={popupContentMalert} popupSeverity={popupSeverityMalert} />
      {/* SUCCESS */}
      <AlertDialog openPopup={openPopup} handleClosePopup={handleClosePopup} popupContent={popupContent} popupSeverity={popupSeverity} />
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
        itemsTwo={boardinglogs ?? []}
        filename={fileName}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup openInfo={openInfo} handleCloseinfo={handleCloseinfo} heading="Boarding Log Info" addedby={addedby} updateby={updateby} />

      {/* EXTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}

export default BoardingLog;
