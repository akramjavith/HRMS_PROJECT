import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import ImageIcon from '@mui/icons-material/Image';
import LastPageIcon from '@mui/icons-material/LastPage';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, FormControlLabel, FormGroup, Grid, IconButton, List, ListItem, ListItemText, MenuItem, OutlinedInput, Popover, Select, Table, TableBody, TableHead, TextField, Typography } from '@mui/material';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/system';
import axios from 'axios';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';
import moment from 'moment-timezone';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from 'react-icons/fa';
import { ThreeDots } from 'react-loader-spinner';
import { MultiSelect } from 'react-multi-select-component';
import Resizable from 'react-resizable';
import { useReactToPrint } from 'react-to-print';
import { handleApiError } from '../../../../components/Errorhandling';
import StyledDataGrid from '../../../../components/TableStyle';
import { AuthContext, UserRoleAccessContext } from '../../../../context/Appcontext';
import { colourStyles, userStyle } from '../../../../pageStyle';
import { SERVICE } from '../../../../services/Baseservice';

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Selects from 'react-select';
import { StyledTableCell, StyledTableRow } from '../../../../components/Table';

import AlertDialog from '../../../../components/Alert';
import { DeleteConfirmation } from '../../../../components/DeleteConfirmation.js';
import ExportData from '../../../../components/ExportData';
import MessageAlert from '../../../../components/MessageAlert';

function BoardingLogEdit({ boardinglogs, userID }) {
  const [updateLoader, setUpdateLoader] = useState(false);
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState('');
  const [popupSeverityMalert, setPopupSeverityMalert] = useState('');
  const handleClickOpenPopupMalert = () => {
    setUpdateLoader(false);
    setOpenPopupMalert(true);
  };
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

  const workmodeOptions = [
    { label: 'Remote', value: 'Remote' },
    { label: 'Office', value: 'Office' },
  ];

  let exportColumnNames = ['Company', 'Branch', 'Unit', 'Floor', 'Area', 'Team', 'Workstation', 'Process', 'Shift Type', 'Employee Name', 'From Date', 'Time'];
  let exportRowValues = ['company', 'branch', 'unit', 'floor', 'area', 'team', 'workstationexcel', 'process', 'shifttype', 'username', 'startdate', 'time'];

  const [editDetails, setEditDetails] = useState({});
  const [editDetailsOld, setEditDetailsOld] = useState({});
  const [isLastLog, setIsLastLog] = useState(false);
  const [oldTeam, setOldTeam] = useState('');
  const [oldTeamData, setOldTeamData] = useState([]);
  const [oldTeamSupervisor, setoldTeamSupervisor] = useState(false);
  const [newUpdateDataAll, setNewUpdateDataAll] = useState([]);
  const [newDataTeamWise, setNewDataTeamWise] = useState([]);

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
            company: editDetails.company,
            branch: editDetails.branch,
            unit: editDetails.unit,
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

      let lastwscode = result.length > 0 ? result[0].workstationNumber + 1 : 1;
      let formattedWorkstationCode = lastwscode.toString().padStart(2, '0');

      let autoWorkStation = `W${selectedBranchCode?.slice(0, 2)?.toUpperCase() || ''}${selectedUnitCode?.slice(0, 2)?.toUpperCase() || ''}_${formattedWorkstationCode || ''}_${workStationInputOldDatas?.username?.toUpperCase() || ''}`;

      let finalAuto = autoWorkStation?.slice(0, 15);
      if (workStationInputOldDatas?.company === editDetails.company && workStationInputOldDatas?.branch === editDetails.branch && workStationInputOldDatas?.unit === editDetails.unit && workStationInputOldDatas?.workstationinput !== '') {
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
  //           item.company === editDetails.company &&
  //           item.branch === editDetails.branch &&
  //           item.unit === editDetails.unit
  //       )
  //       ?.filter((item) => /_[0-9]+_/.test(item?.workstationinput));

  //     if (lastworkstation.length === 0) {
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
  //         ? "01"
  //         : (Number(lastwscode) + 1).toString().padStart(2, "0")
  //       }_${workStationInputOldDatas?.username?.toUpperCase()}`;

  //     if (
  //       workStationInputOldDatas?.company === editDetails.company &&
  //       workStationInputOldDatas?.branch === editDetails.branch &&
  //       workStationInputOldDatas?.unit === editDetails.unit
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

  useEffect(() => {
    workStationAutoGenerate();
  }, [editDetails.company, editDetails.branch, editDetails.unit, editDetails.workmode, editDetails?.ifoffice, selectedBranchCode, selectedUnitCode]);

  useEffect(() => {
    fetchUsernames();
  }, [editDetails]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
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
        req.data.floors.length > 0 &&
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
        company: editDetails.company,
        floor: String(e),
        branch: editDetails.branch,
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
  //       options.length >= maxSelections - 1 &&
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
    if (options.length <= maxOptions) {
      setValueWorkStation(options.map((a) => a.value));
      setSelectedOptionsWorkStation(options);
    }
  };

  const customValueRendererEmployees = (valueWorkStation, _filteredWorkStation) => {
    return valueWorkStation.length ? valueWorkStation?.map(({ label }) => label).join(', ') : <span style={{ color: 'hsl(0, 0%, 20%)' }}>Please Select Secondary Work Station</span>;
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
          return combinstationItem.subTodos.length > 0 ? combinstationItem.subTodos?.map((subTodo) => subTodo.subcabinname + '(' + item.branch + '-' + item.floor + ')') : [combinstationItem.cabinname + '(' + item.branch + '-' + item.floor + ')'];
        });
      });
      setWorkStationOpt(res?.data?.locationgroupings);

      const processedResult = result.map((e) => {
        const selectedCabinName = e?.split('(')[0];

        const Bracketsbranch = e?.match(/\(([^)]+)\)/)?.[1];

        const hyphenCount = Bracketsbranch.split('-').length - 1;

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
        ]
        // .filter((data) => data.value !== primaryWorkStation)
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    var filteredWorks;
    if (editDetails.unit === '' && editDetails.floor === '') {
      filteredWorks = workStationOpt?.filter((u) => u.company === editDetails.company && u.branch === editDetails.branch);
    } else if (editDetails.unit === '') {
      filteredWorks = workStationOpt?.filter((u) => u.company === editDetails.company && u.branch === editDetails.branch && u.floor === editDetails.floor);
    } else if (editDetails.floor === '') {
      filteredWorks = workStationOpt?.filter((u) => u.company === editDetails.company && u.branch === editDetails.branch && u.unit === editDetails.unit);
    } else {
      filteredWorks = workStationOpt?.filter((u) => u.company === editDetails.company && u.branch === editDetails.branch && u.unit === editDetails.unit && u.floor === editDetails.floor);
    }
    const result = filteredWorks?.flatMap((item) => {
      return item.combinstation.flatMap((combinstationItem) => {
        return combinstationItem.subTodos.length > 0 ? combinstationItem.subTodos?.map((subTodo) => subTodo.subcabinname + '(' + item.branch + '-' + item.floor + ')') : [combinstationItem.cabinname + '(' + item.branch + '-' + item.floor + ')'];
      });
    });

    const processedResult = result.map((e) => {
      const selectedCabinName = e?.split('(')[0];

      const Bracketsbranch = e?.match(/\(([^)]+)\)/)?.[1];

      const hyphenCount = Bracketsbranch.split('-').length - 1;

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
  }, [editDetails.company, editDetails.branch, editDetails.unit, editDetails.floor]);

  const [poardinglogsTeamArray, setBoardinglogsTeamArray] = useState([]);
  const [userData, setUserData] = useState({});

  const rowDataArray = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${userID}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      // const newarray = res?.data?.suser?.boardingLog.map((item) => {
      //   const matchedProcess = res?.data?.suser?.processlog.find((data) =>
      //     item.company === data.company &&
      //     item.branch === data.branch &&
      //     item.unit === data.unit &&
      //     item.team === data.team &&
      //     item.startdate === data.date
      //   );

      //   return {
      //     _id: item._id,
      //     unit: item.unit,
      //     processid: matchedProcess ? matchedProcess._id : "",
      //     username: res?.data?.suser?.companyname,
      //     startdate: item.startdate ? moment(item.startdate).format("DD-MM-YYYY") : "",
      //     time: item.time,
      //     branch: item.branch,
      //     team: item.team,
      //     company: item.company,
      //     floor: item.floor,
      //     area: item.area,
      //     workstation: item.workstation,
      //     process: matchedProcess ? matchedProcess.process : "",
      //     shifttype: item.shifttype,
      //   };
      // });

      const newarray = res?.data?.suser?.boardingLog.map((item) => {
        let processvalue = '';
        let processid = '';
        res?.data?.suser?.processlog.forEach((data, index) => {
          if (item.company === data.company && item.branch === data.branch && item.unit === data.unit && item.team === data.team && item.startdate === data.date) {
            processvalue = data.process;
            processid = data._id;
          }
        });
        return {
          _id: item._id,
          unit: item.unit,
          processid: processid,
          username: res?.data?.suser?.companyname,
          startdate: item.startdate ? moment(item.startdate).format('DD-MM-YYYY') : '',
          time: item.time,
          branch: item.branch,
          team: item.team,
          company: item.company,
          floor: item.floor,
          area: item.area,
          workstation: item.workstation,
          process: processvalue,
          shifttype: item.shifttype,
        };
      });
      setBoardinglogsTeamArray(newarray);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    rowDataArray();
  }, [isFilterOpen]);

  const [fileFormat, setFormat] = useState('');

  // info
  const [openInfo, setOpenInfo] = useState(false);
  const [infoDetails, setInfoDetails] = useState({});
  const handleCloseinfo = () => {
    setOpenInfo(false);
  };
  const handleOpeninfo = () => {
    setOpenInfo(true);
  };

  //view
  const [openView, setOpenView] = useState(false);
  const [viewDetails, setViewDetails] = useState({});
  const handleCloseView = () => {
    setOpenView(false);
  };
  const handleOpenView = () => {
    setOpenView(true);
  };

  const processTypes = [
    { label: 'Primary', value: 'Primary' },
    { label: 'Secondary', value: 'Secondary' },
    { label: 'Tertiary', value: 'Tertiary' },
  ];

  const processDuration = [
    { label: 'Full', value: 'Full' },
    { label: 'Half', value: 'Half' },
  ];

  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('00');

  const [hrsOption, setHrsOption] = useState([]);
  const [minsOption, setMinsOption] = useState([]);

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

  const [process, setProcess] = useState([]);
  const [processOption, setProcessOption] = useState([]);

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
    let result = processOption.filter((d) => d.company === editDetails?.company && d.branch === editDetails?.branch && d.unit === editDetails?.unit && d.team === editDetails?.team);

    const processall = result.map((d) => ({
      ...d,
      label: d.process,
      value: d.process,
    }));

    setProcess(processall);
  }, [editDetails.company, editDetails.branch, editDetails.unit, editDetails.team, editDetails]);

  const [prevLogDates, setPrveLogDates] = useState([]);
  //get single row to edit....
  const getCode = async (params) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${userID}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const employeeCount = res?.data?.suser?.employeecount || 0;
      const wfhcount = res?.data?.suser?.wfhcount || 0;
      setMaxSelections(Number(employeeCount) + Number(wfhcount));

      setOldTeam(res?.data?.suser);

      setPrveLogDates(res?.data?.suser?.boardingLog?.length > 0 ? res?.data?.suser?.boardingLog?.filter((data) => data?._id !== params.id)?.map((item) => item?.startdate) : []);

      await fetchDesignationMonthChange(params?.process, userData.doj, userData.department);
      let hrs = params?.time?.split(':')[0] || '00';
      let mins = params?.time?.split(':')[1] || '00';
      setHours(hrs);
      setMinutes(mins);
      setWorkStationInputOldDatas({
        company: params.company,
        branch: params?.branch,
        ifoffice: params?.ifoffice,
        unit: params?.unit,
        workmode: params?.workmode,
        ifoffice: params?.workstationofficestatus,
        workstationinput: params?.workstationinput,
        username: res?.data?.suser?.username,
      });
      // setEditDetails({
      //   ...editDetails,
      //   ifoffice: params.ifoffice,
      // });

      setPrimaryWorkStationInput(params?.workstationinput);

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
          return combinstationItem.subTodos.length > 0 ? combinstationItem.subTodos.map((subTodo) => subTodo.subcabinname + '(' + item.branch + '-' + item.floor + ')') : [combinstationItem.cabinname + '(' + item.branch + '-' + item.floor + ')'];
        });
      });
      console.log('3');
      const processedResult = resultNew.map((e) => {
        const selectedCabinName = e?.split('(')[0];

        const Bracketsbranch = e?.match(/\(([^)]+)\)/)?.[1];

        const hyphenCount = Bracketsbranch.split('-').length - 1;

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

      let primaryWorkstationNew = params?.workstation[0];

      let findLabel = workstationsFinal?.find((item) => item.label.includes(primaryWorkstationNew));
      console.log('5');
      setPrimaryWorkStationLabel(findLabel?.label);
      setPrimaryWorkStation(params?.workstation[0]);

      let secondaryWorkstation =
        params.workstation.length > 1
          ? params?.workstation.slice(1, params?.workstation?.length)?.map((x) => ({
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

      setSelectedOptionsWorkStation(foundDataNew);
      setValueWorkStation(params?.workstation.slice(1, params?.workstation.length));
      handleOpenEdit();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [startdateoptionsEdit, setStartdateoptionsEdit] = useState([]);

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

      let foundData = response?.data?.processmonthsets?.find((item) => item.process === e && new Date(Doj) >= new Date(item.fromdate) && new Date(Doj) <= new Date(item.todate));

      let filteredDatas;

      if (foundData) {
        filteredDatas = response?.data?.processmonthsets
          ?.filter((d) => d.process === e && new Date(d.fromdate) >= new Date(foundData.fromdate))
          .map((data) => ({
            label: data.fromdate,
            value: data.fromdate,
          }));

        if (filteredDatas.length === 0) {
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
        user: oldTeam,
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
      // console.log(oldData, newDataAll, newDataRemaining, newDataAllSupervisor)
    } else {
      setOldTeamData([]);
      setNewUpdateDataAll([]);
      setNewDataTeamWise([]);
    }
  };

  const editSubmit = (e) => {
    setUpdateLoader(true);
    e.preventDefault();

    // Check if there are any changes
    const isChanged = Object.keys(editDetails).some((key) => editDetails[key] !== editDetailsOld[key]);
    if (prevLogDates?.includes(editDetails.originalstartdate)) {
      setPopupContentMalert('Date Can not be same as prev logs!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (editDetails.company === '' || editDetails.company === undefined || editDetails.company === 'Please Select Company') {
      setPopupContentMalert('Please Select Company!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (editDetails.branch === '' || editDetails.branch === undefined || editDetails.branch === 'Please Select Branch') {
      setPopupContentMalert('Please Select Branch!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (editDetails.unit === '' || editDetails.unit === undefined || editDetails.unit === 'Please Select Unit') {
      setPopupContentMalert('Please Select Unit!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (editDetails.floor === 'Please Select Floor') {
      setPopupContentMalert('Please Select Floor!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (editDetails.area === 'Please Select Area') {
      setPopupContentMalert('Please Select Area!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (primaryWorkStation === 'Please Select Primary Work Station') {
      setPopupContentMalert('Please Select Primary Work Station!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (editDetails.team === '' || editDetails.team === undefined || editDetails.team === 'Please Select Team') {
      setPopupContentMalert('Please Select Team!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (!editDetails.workmode) {
      setPopupContentMalert('Please Select Work Mode!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (selectedOptionsWorkStation.length === 0) {
      setPopupContentMalert('Please Select Secondary Work Station!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (editDetails.process === '' || editDetails.process === undefined || editDetails.process === 'Please Select Process') {
      setPopupContentMalert('Please Select Process!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (editDetails.originalstartdate === '' || editDetails.originalstartdate === undefined || editDetails.originalstartdate === 'Please Select Start Date') {
      setPopupContentMalert('Please Select Start Date!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (editDetails.time === 'Hrs:Mins' || editDetails.time === '' || editDetails.time === undefined || editDetails.time.includes('Mins') || editDetails.time.includes('Hrs') || editDetails.time === '00:00') {
      setPopupContentMalert('Please Select Duration!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (!isChanged) {
      setPopupContentMalert('No Changes to Update!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (editDetailsOld?.team !== editDetails.team && isLastLog && newUpdateDataAll?.length < 1 && newDataTeamWise?.length < 1) {
      setPopupContentMalert('This Employee is not allowed to Change Team with their Designation , Create in Hierarchy First!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    }
    // else if (isLastLog & (oldTeamSupervisor?.length > 0)) {
    //   setPopupContentMalert("This Employee is supervisor in hierarchy , So not allowed to Change Team.!");
    //   setPopupSeverityMalert("info");
    //   handleClickOpenPopupMalert();
    // }
    else {
      sendEditRequest();
    }
  };

  const sendEditRequest = async () => {
    setPageName(!pageName);
    try {
      let workStationInput = await workStationAutoGenerate();
      if (editDetails.company !== editDetailsOld.company || editDetails.branch !== editDetailsOld.branch || editDetails.unit !== editDetailsOld.unit || editDetails.team !== editDetailsOld.team) {
        await axios.post(
          `${SERVICE.UPDATE_LOGINALLOT_LOGPAGES}`,
          {
            empname: editDetails.username,
            company: editDetails?.company,
            branch: editDetails?.branch,
            unit: editDetails?.unit,
            team: String(editDetails?.team),
            date: String(editDetails.originalstartdate),
          },
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          }
        );
      }
      await axios.put(
        `${SERVICE.UPDATEANYLOG}/?logid=${editDetails?.id}&logname=boardingLog`,
        {
          workstationinput: String(editDetails.workmode === 'Remote' || editDetails.ifoffice ? workStationInput : ''),
          workstationofficestatus: Boolean(editDetails.ifoffice),
          workmode: String(editDetails.workmode),

          company: String(editDetails.company),
          branch: String(editDetails.branch),
          unit: String(editDetails.unit),
          team: String(editDetails.team),
          floor: String(editDetails.floor),
          area: String(editDetails.area),
          workstation: editDetails.workmode !== 'Remote' ? (valueWorkStation.length === 0 ? primaryWorkStation : [primaryWorkStation, ...valueWorkStation]) : [primaryWorkStation, ...valueWorkStation],
          process: String(editDetails.process),
          startdate: String(editDetails.originalstartdate),
          time: String(editDetails.time),
          ischangecompany: editDetailsOld.company === editDetails.company ? Boolean(false) : Boolean(true),
          ischangebranch: editDetailsOld.company === editDetails.company ? (editDetailsOld.branch === editDetails.branch ? Boolean(false) : Boolean(true)) : Boolean(true),
          ischangeunit: editDetailsOld.branch === editDetails.branch ? (editDetailsOld.unit === editDetails.unit ? Boolean(false) : Boolean(true)) : Boolean(true),
          ischangeteam: editDetailsOld.unit === editDetails.unit ? (editDetailsOld.team === editDetails.team ? Boolean(false) : Boolean(true)) : Boolean(true),
          ischangefloor: editDetailsOld.company === editDetails.company ? (editDetailsOld.branch === editDetails.branch ? Boolean(false) : Boolean(true)) : Boolean(true),
          ischangearea: editDetailsOld.company === editDetails.company ? (editDetailsOld.branch === editDetails.branch ? (editDetailsOld.floor === editDetails.floor ? Boolean(false) : Boolean(true)) : Boolean(true)) : Boolean(true),
          ischangeworkstation: editDetailsOld.company === editDetails.company ? (editDetailsOld.branch === editDetails.branch ? (editDetailsOld.unit === editDetails.unit ? (editDetailsOld.floor === editDetails.floor ? Boolean(false) : Boolean(true)) : Boolean(true)) : Boolean(true)) : Boolean(true),
          // enableworkstation: Boolean(enableWorkstation),

          logeditedby: [
            ...editDetails?.logeditedby,
            {
              username: String(isUserRoleAccess?.username),
              date: String(new Date()),
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      if (isLastLog) {
        await axios.put(
          `${SERVICE.USER_SINGLE_PWD}/${userID}`,
          {
            designation: String(userData?.designation),
            department: String(userData?.department),
            rocketchatemail: userData?.rocketchatemail,
            rocketchatid: userData?.rocketchatid,
            rocketchatroles: userData?.rocketchatroles,
            rocketchatteamid: userData?.rocketchatteamid,
            rocketchatchannelid: userData?.rocketchatchannelid,
            username: userData?.username,
            companyname: userData?.companyname,
            rocketchatshiftgrouping: userData?.rocketchatshiftgrouping,
            rocketchatshift: userData?.rocketchatshift,

            company: String(editDetails.company),
            branch: String(editDetails.branch),
            unit: String(editDetails.unit),
            team: String(editDetails.team),
            floor: String(editDetails.floor),
            area: String(editDetails.area),
            workstation: editDetails.workmode !== 'Remote' ? (valueWorkStation.length === 0 ? primaryWorkStation : [primaryWorkStation, ...valueWorkStation]) : [primaryWorkStation, ...valueWorkStation],
            process: String(editDetails.process),
            processtype: String(editDetails.processtype),
            processduration: String(editDetails.processduration),

            workstationinput: String(editDetails.workmode === 'Remote' || editDetails.ifoffice ? workStationInput : ''),
            workstationofficestatus: Boolean(editDetails.ifoffice),
            workmode: String(editDetails.workmode),
          },
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          }
        );

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

        //     company: String(newUpdateDataAll[0].company),
        //     designationgroup: String(newUpdateDataAll[0]?.designationgroup),
        //     department: String(newUpdateDataAll[0].department),
        //     branch: String(newUpdateDataAll[0].branch),
        //     unit: String(newUpdateDataAll[0].unit),
        //     team: String(editDetails.team),
        //     supervisorchoose: String(newUpdateDataAll[0].supervisorchoose),
        //     mode: String(newUpdateDataAll[0].mode),
        //     level: String(newUpdateDataAll[0].level),
        //     control: String(newUpdateDataAll[0].control),
        //     pagecontrols: newUpdateDataAll[0].pagecontrols,

        //     employeename: oldTeam.companyname,
        //     access: newUpdateDataAll[0].access,
        //     action: Boolean(true),
        //     empbranch: editDetails?.branch,
        //     empunit: editDetails.unit,
        //     empcode: oldTeam?.empcode,
        //     empteam: editDetails.team,
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
        //     team: String(editDetails.team),
        //     supervisorchoose: String(newDataTeamWise[0].supervisorchoose),
        //     mode: String(newDataTeamWise[0].mode),
        //     level: String(newDataTeamWise[0].level),
        //     control: String(newDataTeamWise[0].control),
        //     pagecontrols: newDataTeamWise[0].pagecontrols,
        //     employeename: oldTeam.companyname,
        //     access: newDataTeamWise[0].access,
        //     action: Boolean(true),
        //     empbranch: editDetails?.branch,
        //     empunit: editDetails.unit,
        //     empcode: oldTeam?.empcode,
        //     empteam: editDetails.team,
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

                employeename: oldTeam.companyname,
                access: newUpdateDataAll[0].access,
                action: Boolean(true),
                empbranch: editDetails?.branch,
                empunit: editDetails.unit,
                empcode: oldTeam?.empcode,
                empteam: editDetails.team,
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
        if (newUpdateDataAll.length > 0) {
          await addNewTeams(newUpdateDataAll);
        }

        if (newDataTeamWise.length > 0) {
          await addNewTeams(newDataTeamWise);
        }

        if (lastProcessLog) {
          await axios.put(
            `${SERVICE.UPDATEANYLOG}/?logid=${lastProcessLog?._id}&logname=processlog`,
            {
              company: String(editDetails.company),
              branch: String(editDetails.branch),
              unit: String(editDetails.unit),
              team: String(editDetails.team),
              process: String(editDetails.process),
              processtype: String(editDetails.processtype),
              processduration: String(editDetails.processduration),
              date: String(editDetails.originalstartdate),
              time: String(editDetails.time),
            },
            {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
            }
          );
        }
      }

      await fetchAllUsersLimit();

      handleCloseEdit();
      setPopupContent('Updated Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
      setUpdateLoader(false);
    } catch (err) {
      setUpdateLoader(false);
      console.log(err, 'nwaoek');
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleOpenDelete = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseDelete = () => {
    setIsDeleteOpen(false);
  };

  const [deleteionId, setDeletionId] = useState({});

  const handleDeleteLog = async () => {
    await axios.delete(`${SERVICE.DELETEANYLOG}/?logid=${deleteionId?.id}&logname=boardingLog`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });
    await fetchAllUsersLimit();
    setPage(1);
    handleCloseDelete();
    setPopupContent('Deleted Successfully');
    setPopupSeverity('success');
    handleClickOpenPopup();
  };

  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseEdit = (e, reason) => {
    if (reason && reason === 'backdropClick') return;
    setIsEditOpen(false);
    setEditDetails({});
    setEditDetailsOld({});
  };

  const gridRef = useRef(null);
  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, allUsersData, allTeam, alldesignation, pageName, setPageName, buttonStyles, workStationSystemName } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [boardinglogsUnit, setBoardinglogsUnit] = useState([]);
  const [items, setItems] = useState([]);
  const [unitlogcheck, setUnitlogcheck] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [copiedData, setCopiedData] = useState('');

  // Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setUpdateLoader(false);
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
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
    if (selectedRows.includes(params.row.id)) {
      return 'custom-id-row'; // This is the custom class for rows with item.tat === 'ago'
    }
    return ''; // Return an empty string for other rows
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    starttime: true,
    username: true,
    startdate: true,
    time: true,
    branch: true,
    unit: true,
    team: true,
    company: true,
    floor: true,
    area: true,
    workstation: true,
    process: true,
    shifttype: true,
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

  const [lastProcessLog, setLastProcessLog] = useState({});
  const fetchAllUsersLimit = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${userID}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });


      //       const seen = new Set();

      // const newarray = res?.data?.suser?.boardingLog
      //   ?.filter(item => {
      //     if (seen.has(item._id)) return false;
      //     seen.add(item._id);
      //     return true;
      //   })

      const seen = new Set();
      const uniqueBoardingLog = [];

      const original = res?.data?.suser?.boardingLog || [];
      for (let i = original.length - 1; i >= 0; i--) {
        const item = original[i];
        if (!seen.has(item._id)) {
          seen.add(item._id);
          uniqueBoardingLog.unshift(item); // keep order of last occurrences
        }
      }
      // Step 2: Create a new array with necessary fields
      const newarray = uniqueBoardingLog?.map((item) => {
        let processvalue = '';
        let processid = '';
        res?.data?.suser?.processlog.forEach((data, index) => {
          if (item.company === data.company && item.branch === data.branch && item.unit === data.unit && item.team === data.team && item.startdate === data.date) {
            processvalue = data.process;
            processid = data._id;
          }
        });
        return {
          _id: item._id,
          unit: item.unit,
          processid: processid,
          username: res?.data?.suser?.companyname,
          startdate: item.startdate,
          time: item.time,
          branch: item.branch,
          team: item.team,
          company: item.company,
          floor: item.floor,
          area: item.area,
          workstation: item.workstation,
          workmode: item?.workmode || '',
          workstationinput: item?.workstationinput || '',
          workstationofficestatus: item?.workstationofficestatus || false,
          ifoffice: item?.workstationofficestatus || false,
          process: processvalue,
          shifttype: item.shifttype,
          movetolive: item.movetolive || false,
          // process: item.process,
          logeditedby: item?.logeditedby?.length > 0 ? item?.logeditedby : [],
        };
      });


      let lastProcess = res?.data?.suser?.processlog?.length > 0 ? res?.data?.suser?.processlog[res?.data?.suser?.processlog?.length - 1] : {};

      let rocketchatshiftgrouping = [];
      let rocketchatshift = [];
      // Check if the user's boardingLog exists and has entries
      if (res?.data?.suser?.boardingLog && res?.data?.suser?.boardingLog.length > 0) {
        const lastBoardingLog = res?.data?.suser?.boardingLog[res?.data?.suser?.boardingLog.length - 1];

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

          if (boardtodo && boardtodo.length > 0) {
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
      setUserData({
        ...res?.data?.suser,
        rocketchatshiftgrouping,
        rocketchatshift,
      });
      setLastProcessLog(lastProcess);

      setBoardinglogsUnit(newarray);
      setUnitlogcheck(true);
    } catch (err) {
      setUnitlogcheck(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchAllUsersLimit();
    fetchProcess();
    fetchfloorNames();
    fetchWorkStation();
  }, []);

  // Excel
  const fileName = 'Boarding Log List';
  // get particular columns for export excel

  // print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Boarding Log List',
    pageStyle: 'print',
  });

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, 'Boarding Log List.png');
        });
      });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  const addSerialNumber = () => {
    const itemsWithSerialNumber = boardinglogsUnit?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      workstationexcel: item.workstation?.map((t, i) => `${i + 1 + '. '}` + t).toString(),
      index,
      logeditedby: item?.logeditedby?.length > 0 ? item?.logeditedby : [],
      processduration: 'Full',
      processtype: 'Primary',
      startdate: isValidDateFormat(item.startdate) ? moment(item.startdate).format('DD-MM-YYYY') : item.startdate,
      originalstartdate: item.startdate,
    }));
    setItems(itemsWithSerialNumber);
  };
  useEffect(() => {
    addSerialNumber();
  }, [boardinglogsUnit]);

  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSelectedRows([]);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setSelectedRows([]);
    setPage(1);
  };

  //datatable....
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  // Split the search query into individual terms
  const searchOverTerms = searchQuery?.toLowerCase()?.split(' ');
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchOverTerms.every((term) => Object.values(item)?.join(' ')?.toLowerCase()?.includes(term));
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

  const columnDataTable = [
    {
      field: 'serialNumber',
      headerName: 'SNo',
      flex: 0,
      width: 80,
      hide: !columnVisibility.serialNumber,
      headerClassName: 'bold-header',
    },
    {
      field: 'company',
      headerName: 'Company',
      flex: 0,
      width: 150,
      hide: !columnVisibility.company,
      headerClassName: 'bold-header',
    },
    {
      field: 'branch',
      headerName: 'Branch',
      flex: 0,
      width: 150,
      hide: !columnVisibility.branch,
      headerClassName: 'bold-header',
    },
    {
      field: 'unit',
      headerName: 'Unit',
      flex: 0,
      width: 150,
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
      width: 150,
      hide: !columnVisibility.team,
      headerClassName: 'bold-header',
    },
    {
      field: 'workstation',
      headerName: 'Workstation',
      flex: 0,
      width: 150,
      hide: !columnVisibility.workstation,
      headerClassName: 'bold-header',
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
      field: 'shifttype',
      headerName: 'Shift Type',
      flex: 0,
      width: 150,
      hide: !columnVisibility.shifttype,
      headerClassName: 'bold-header',
    },
    {
      field: 'username',
      headerName: 'Employee Name',
      flex: 0,
      width: 200,
      hide: !columnVisibility.username,
      headerClassName: 'bold-header',
    },
    {
      field: 'startdate',
      headerName: 'From Date',
      flex: 0,
      width: 150,
      hide: !columnVisibility.startdate,
      headerClassName: 'bold-header',
    },
    {
      field: 'time',
      headerName: 'Time',
      flex: 0,
      width: 150,
      hide: !columnVisibility.time,
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
      renderCell: (params) => {
        return (
          <>
            {params?.row?.index === 0 || params?.row?.movetolive ? (
              ''
            ) : (
              <Grid sx={{ display: 'flex' }}>
                {isUserRoleCompare?.includes('eboardinglog') && (
                  <>
                    <Button
                      size="small"
                      sx={userStyle.buttondelete}
                      onClick={(e) => {
                        setEditDetails(params.row);
                        setEditDetailsOld(params.row);
                        getCode(params.row);
                        setIsLastLog(params?.row?.index === items?.length - 1);
                      }}
                    >
                      <EditOutlinedIcon sx={buttonStyles.buttonedit} />
                    </Button>
                  </>
                )}
                {isUserRoleCompare?.includes('dboardinglog') && params?.row?.index !== items?.length - 1 && (
                  <>
                    <Button
                      size="small"
                      sx={userStyle.buttondelete}
                      onClick={(e) => {
                        handleOpenDelete();
                        setDeletionId(params.row);
                      }}
                    >
                      <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
                    </Button>
                  </>
                )}
              </Grid>
            )}
            <Grid sx={{ display: 'flex' }}>
              {isUserRoleCompare?.includes('vboardinglog') && (
                <>
                  <Button
                    size="small"
                    sx={userStyle.buttondelete}
                    onClick={(e) => {
                      handleOpenView();
                      setViewDetails(params.row);
                    }}
                  >
                    <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                  </Button>
                </>
              )}
              {isUserRoleCompare?.includes('iboardinglog') && params?.row?.logeditedby?.length > 0 && (
                <>
                  <Button
                    size="small"
                    sx={userStyle.buttondelete}
                    onClick={(e) => {
                      handleOpeninfo();
                      setInfoDetails(params.row);
                    }}
                  >
                    <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />
                  </Button>
                </>
              )}
            </Grid>
          </>
        );
      },
    },
  ];
  function isValidDateFormat(dateString) {
    // Regular expression to match the format YYYY-MM-DD
    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;

    return dateFormatRegex.test(dateString);
  }

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      username: item.username,
      starttime: item.starttime,
      time: item.time,
      movetolive: item.movetolive,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      floor: item.floor,
      area: item.area,
      workstation: item.workstation,
      workstationexcel: item.workstation,
      workstationinput: item.workstationinput,
      workmode: item.workmode,
      ifoffice: item.ifoffice,
      workstationofficestatus: item.workstationofficestatus,
      process: item.process,
      index: item?.index,
      shifttype: item.shifttype,

      logeditedby: item?.logeditedby,
      processduration: item?.processduration,
      processtype: item?.processtype,
      startdate: item.startdate,
      originalstartdate: item.originalstartdate,
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

  return (
    <Box>
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes('lboardinglog') && (
        <>
          <Box sx={{ border: '1px solid #8080801c', padding: '20px' }}>
            <Grid container spacing={2}>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Typography sx={userStyle.importheadtext}>
                  <b>Edit Log</b>
                </Typography>
                <br />
                <br />
              </Grid>
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
                    {/* <MenuItem value={boardinglogsUnit?.length}>All</MenuItem> */}
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
                          rowDataArray();
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
                          rowDataArray();
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
                          rowDataArray();
                        }}
                      >
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('imageboardinglog') && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                        {' '}
                        <ImageIcon sx={{ fontSize: '15px' }} /> &ensp;Image&ensp;{' '}
                      </Button>
                    </>
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
            <br />
            <br />
            {!unitlogcheck ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
                  <StyledDataGrid
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

      {/* VIEW */}
      <Dialog maxWidth="lg" open={openView} onClose={handleCloseView} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" sx={{ marginTop: '50px' }}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item md={12} sm={12} xs={12}>
              <Typography sx={userStyle.HeaderText}>View Boarding Log</Typography>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Company</Typography>
                <Typography>{viewDetails?.company}</Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Branch</Typography>
                <Typography>{viewDetails?.branch}</Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Unit</Typography>
                <Typography>{viewDetails?.unit}</Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Floor</Typography>
                <Typography>{viewDetails?.floor}</Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Area</Typography>
                <Typography>{viewDetails?.area}</Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Team</Typography>
                <Typography>{viewDetails?.team}</Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Workmode</Typography>
                <Typography>{viewDetails?.workmode}</Typography>
              </FormControl>
            </Grid>
            {viewDetails?.workmode === 'Office' && (
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Work Station Other</Typography>
                  <Typography>{viewDetails?.ifoffice ? 'Yes' : 'No'}</Typography>
                </FormControl>
              </Grid>
            )}
            {(viewDetails?.workmode === 'Remote' || viewDetails?.ifoffice) && (
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Work Station Input</Typography>
                  <Typography>{viewDetails?.workstationinput}</Typography>
                </FormControl>
              </Grid>
            )}
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Workstation</Typography>
                <Typography>
                  {viewDetails?.workstation
                    ?.map((t, i) => t)
                    .join(', ')
                    .toString()}
                </Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Employee</Typography>
                <Typography>{viewDetails?.username}</Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Process</Typography>
                <Typography>{viewDetails?.process}</Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Process Type</Typography>
                <Typography>{viewDetails?.processtype}</Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Process Duration</Typography>
                <Typography>{viewDetails?.processduration}</Typography>
              </FormControl>
            </Grid>

            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Start Date</Typography>
                <Typography>{viewDetails?.startdate}</Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Time</Typography>
                <Typography>{viewDetails?.time}</Typography>
              </FormControl>
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <br />
              <br />
              <Grid
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '15px',
                }}
              >
                <Button
                  sx={buttonStyles.btncancel}
                  onClick={() => {
                    handleCloseView();
                  }}
                >
                  Back
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      {/* Edit DIALOG */}
      <Dialog open={isEditOpen} onClose={handleCloseEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" fullWidth={true} maxWidth="lg" sx={{ marginTop: '50px' }}>
        <Box sx={{ padding: '20px' }}>
          <>
            {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
            <Typography sx={userStyle.HeaderText}>Edit Boarding Log</Typography>
            <br></br>
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <Typography>Employee Name</Typography>
                <FormControl fullWidth size="small">
                  <OutlinedInput id="component-outlined" type="text" placeholder="User Id" value={editDetails.username} readOnly />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={6}>
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
                      label: editDetails.company,
                      value: editDetails.company,
                    }}
                    onChange={(e) => {
                      setEditDetails({
                        ...editDetails,
                        company: e.value,
                        branch: 'Please Select Branch',
                        unit: 'Please Select Unit',
                        team: 'Please Select Team',
                        process: 'Please Select Process',
                        originalstartdate: 'Please Select Start Date',
                        processduration: 'Full',
                        area: 'Please Select Area',
                        processtype: 'Primary',
                        floor: 'Please Select Floor',
                      });

                      setPrimaryWorkStation('Please Select Primary Work Station');
                      setSelectedOptionsWorkStation([]);
                    }}
                  />
                </FormControl>
              </Grid>

              <Grid item md={4} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Branch<b style={{ color: 'red' }}>*</b>
                  </Typography>
                  <Selects
                    options={isAssignBranch
                      ?.filter((comp) => editDetails.company === comp.company)
                      ?.map((data) => ({
                        label: data.branch,
                        value: data.branch,
                        code: data.branchcode,
                      }))
                      .filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                    styles={colourStyles}
                    value={{
                      label: editDetails.branch,
                      value: editDetails.branch,
                    }}
                    onChange={(e) => {
                      setEditDetails({
                        ...editDetails,
                        branch: e.value,
                        unit: 'Please Select Unit',
                        team: 'Please Select Team',
                        process: 'Please Select Process',
                        originalstartdate: 'Please Select Start Date',
                        processduration: 'Full',
                        processtype: 'Primary',
                        floor: 'Please Select Floor',
                        area: 'Please Select Area',
                      });
                      setSelectedBranchCode(e?.code.slice(0, 2));

                      setSelectedUnitCode('');
                      setPrimaryWorkStation('Please Select Primary Work Station');
                      setSelectedOptionsWorkStation([]);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Unit<b style={{ color: 'red' }}>*</b>{' '}
                  </Typography>
                  <Selects
                    options={isAssignBranch
                      ?.filter((comp) => editDetails.company === comp.company && editDetails.branch === comp.branch)
                      ?.map((data) => ({
                        label: data.unit,
                        value: data.unit,
                        code: data.unitcode,
                      }))
                      .filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                    styles={colourStyles}
                    value={{
                      label: editDetails.unit,
                      value: editDetails.unit,
                    }}
                    onChange={(e) => {
                      setEditDetails({
                        ...editDetails,
                        unit: e.value,
                        processduration: 'Full',
                        processtype: 'Primary',
                        team: 'Please Select Team',
                        process: 'Please Select Process',
                        originalstartdate: 'Please Select Start Date',
                        floor: 'Please Select Floor',
                        area: 'Please Select Area',
                      });
                      setSelectedUnitCode(e?.code.slice(0, 2));
                      setPrimaryWorkStation('Please Select Primary Work Station');
                      setSelectedOptionsWorkStation([]);
                    }}
                  />
                </FormControl>
              </Grid>

              <Grid item md={4} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Floor<b style={{ color: 'red' }}>*</b>
                  </Typography>
                  <Selects
                    maxMenuHeight={300}
                    options={floorNames
                      ?.filter((u) => u.branch === editDetails.branch)
                      ?.map((u) => ({
                        ...u,
                        label: u.name,
                        value: u.name,
                      }))}
                    placeholder="Please Select Floor"
                    value={{
                      label: editDetails.floor ? editDetails.floor : 'Please Select Floor',
                      value: editDetails.floor ? editDetails.floor : 'Please Select Floor',
                    }}
                    onChange={(e, i) => {
                      setEditDetails({
                        ...editDetails,
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
              <Grid item md={4} sm={12} xs={12}>
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
                      label: editDetails?.area === '' || editDetails?.area == undefined ? 'Please Select Area' : editDetails?.area,
                      value: editDetails?.area === '' || editDetails?.area == undefined ? 'Please Select Area' : editDetails?.area,
                    }}
                    onChange={(e) => {
                      setEditDetails({ ...editDetails, area: e.value });
                      setPrimaryWorkStation('Please Select Primary Work Station');
                      setSelectedOptionsWorkStation([]);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={6}>
                <Typography>
                  Team<b style={{ color: 'red' }}>*</b>
                </Typography>
                <FormControl fullWidth>
                  <Selects
                    options={allTeam
                      ?.filter((comp) => editDetails.company === comp.company && editDetails.branch === comp.branch && editDetails.unit === comp.unit)
                      ?.map((data) => ({
                        label: data.teamname,
                        value: data.teamname,
                      }))
                      .filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                    styles={colourStyles}
                    value={{
                      label: editDetails.team,
                      value: editDetails.team,
                    }}
                    onChange={(e) => {
                      setEditDetails({
                        ...editDetails,
                        team: e.value,
                        process: 'Please Select Process',
                        processduration: 'Full',
                        processtype: 'Primary',
                        originalstartdate: 'Please Select Start Date',
                      });
                      // checkHierarchyName(e.value, "Team");
                      fetchSuperVisorChangingHierarchy(e.value);
                    }}
                  />
                </FormControl>
              </Grid>
              {editDetails.workmode === 'Internship' ? (
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
                        label: editDetails?.workmode ? editDetails?.workmode : 'Please Select Work Mode',
                        value: editDetails?.workmode ? editDetails?.workmode : 'Please Select Work Mode',
                      }}
                      onChange={(e) => {
                        setEditDetails((prev) => ({
                          ...prev,
                          workmode: e.value,
                          ifoffice: false,
                        }));
                      }}
                    />
                  </FormControl>
                </Grid>
              )}
              {editDetails.workmode === 'Office' && (
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl size="small" fullWidth>
                    <Typography>If Office</Typography>
                  </FormControl>
                  <Grid>
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox checked={editDetails.ifoffice === true} />}
                        onChange={(e) => {
                          setEditDetails({
                            ...editDetails,
                            ifoffice: !editDetails.ifoffice,
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
              {editDetails.workmode !== 'Remote' ? (
                <>
                  {editDetails.ifoffice === true && (
                    <>
                      <Grid item md={4} sm={6} xs={12}>
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
                    </>
                  )}
                  <Grid item md={4} sm={12} xs={12}>
                    <FormControl size="small" fullWidth>
                      <Typography>
                        Work Station (Primary)<b style={{ color: 'red' }}>*</b>
                      </Typography>
                      <Selects
                        options={filteredWorkStation.filter((item, index, self) => {
                          return index === self.findIndex((i) => i.value === item.value);
                        })}
                        label="Please Select Shift"
                        value={{
                          label: primaryWorkStationLabel,
                          value: primaryWorkStation ? primaryWorkStation : 'Please Select Primary Work Station',
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
                  <Grid item md={4} sm={12} xs={12}>
                    <FormControl size="small" fullWidth>
                      <Typography>
                        Work Station (Secondary)
                        <b style={{ color: 'red' }}>*</b>
                      </Typography>
                      <MultiSelect
                        size="small"
                        options={allWorkStationOpt.filter((item) => item.value !== primaryWorkStation)}
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
                  <Grid item md={4} sm={6} xs={12}>
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
                  <Grid item md={4} sm={12} xs={12}>
                    <FormControl size="small" fullWidth>
                      <Typography>
                        Work Station (Primary)<b style={{ color: 'red' }}>*</b>
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

                  <Grid item md={4} sm={12} xs={12}>
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

              <Grid item md={4} xs={12} sm={6}>
                <Typography>
                  Process<b style={{ color: 'red' }}>*</b>
                </Typography>
                <FormControl fullWidth>
                  <Selects
                    options={process}
                    styles={colourStyles}
                    value={{
                      label: editDetails.process ? editDetails.process : 'Please Select Process',
                      value: editDetails.process ? editDetails.process : 'Please Select Process',
                    }}
                    onChange={(e) => {
                      setEditDetails({
                        ...editDetails,
                        process: e.value,
                        processduration: 'Full',
                        processtype: 'Primary',
                        originalstartdate: 'Please Select Start Date',
                      });
                      fetchDesignationMonthChange(e.value, userData.doj, userData.department);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={6}>
                <Typography>
                  Process type<b style={{ color: 'red' }}>*</b>
                </Typography>
                <FormControl fullWidth>
                  <Selects
                    options={processTypes}
                    styles={colourStyles}
                    value={{
                      label: editDetails.processtype,
                      value: editDetails.processtype,
                    }}
                    onChange={(e) => {
                      setEditDetails({
                        ...editDetails,
                        processtype: e.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={6}>
                <Typography>
                  Process Duration<b style={{ color: 'red' }}>*</b>
                </Typography>
                <FormControl fullWidth>
                  <Selects
                    options={processDuration}
                    styles={colourStyles}
                    value={{
                      label: editDetails.processduration,
                      value: editDetails.processduration,
                    }}
                    onChange={(e) => {
                      setEditDetails({
                        ...editDetails,
                        processduration: e.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={6}>
                <Typography>
                  Start Date <b style={{ color: 'red' }}>*</b>
                </Typography>
                <FormControl fullWidth size="small">
                  <Selects
                    options={startdateoptionsEdit}
                    styles={colourStyles}
                    value={{
                      label: editDetails.originalstartdate,
                      value: editDetails.originalstartdate,
                    }}
                    onChange={(e) => {
                      setEditDetails({
                        ...editDetails,
                        originalstartdate: e.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={6}>
                <Typography>
                  Duration<b style={{ color: 'red' }}>*</b>
                </Typography>
                <Grid container spacing={1}>
                  <Grid item md={6} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Selects
                        maxMenuHeight={300}
                        options={hrsOption}
                        placeholder="00"
                        value={{ label: hours, value: hours }}
                        onChange={(e) => {
                          setHours(e.value);
                          setEditDetails({
                            ...editDetails,
                            time: `${e.value}:${minutes}`,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Selects
                        maxMenuHeight={300}
                        options={minsOption}
                        placeholder="00"
                        value={{ label: minutes, value: minutes }}
                        onChange={(e) => {
                          setMinutes(e.value);
                          setEditDetails({
                            ...editDetails,
                            time: `${hours}:${e.value}`,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <LoadingButton variant="contained" color="primary" onClick={editSubmit} loading={updateLoader} sx={buttonStyles.buttonsubmit}>
                  Update
                </LoadingButton>
              </Grid>
              <Grid item md={6} xs={6} sm={6}>
                <Button onClick={handleCloseEdit} sx={buttonStyles.btncancel}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </>
        </Box>
      </Dialog>

      {/* INFO */}
      <Dialog open={openInfo} onClose={handleCloseinfo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <Box sx={{ width: '550px', padding: '20px 50px' }}>
          <>
            <Typography sx={userStyle.HeaderText}>Boarding Log Edited By</Typography>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Edited by</Typography>
                  <br />
                  <Table>
                    <TableHead>
                      <StyledTableCell sx={{ padding: '5px 10px !important' }}>{'SNO'}.</StyledTableCell>
                      <StyledTableCell sx={{ padding: '5px 10px !important' }}> {'UserName'}</StyledTableCell>
                      <StyledTableCell sx={{ padding: '5px 10px !important' }}> {'Date'}</StyledTableCell>
                    </TableHead>
                    <TableBody>
                      {infoDetails?.logeditedby?.map((item, i) => (
                        <StyledTableRow>
                          <StyledTableCell sx={{ padding: '5px 10px !important' }}>{i + 1}.</StyledTableCell>
                          <StyledTableCell sx={{ padding: '5px 10px !important' }}> {item.username}</StyledTableCell>
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
              <Button variant="contained" onClick={handleCloseinfo} sx={{ marginLeft: '15px', ...buttonStyles.btncancel }}>
                {' '}
                Back{' '}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

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
        filteredDataTwo={rowDataTable ?? []}
        itemsTwo={items ?? []}
        filename={fileName}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />

      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation open={isDeleteOpen} onClose={handleCloseDelete} onConfirm={handleDeleteLog} title="Are you sure?" confirmButtonText="Yes" cancelButtonText="Cancel" />

      {/* EXTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}

export default BoardingLogEdit;
