import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  TableBody,
  TableRow,
  TableCell,
  Select,
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Paper,
  Table,
  TableHead, FormControlLabel,
  TableContainer,
  Button,
  List,
  FormGroup,
  ListItem,
  ListItemText,
  Popover,
  Checkbox,
  TextField,
  IconButton,
} from "@mui/material";
import { userStyle, colourStyles } from "../../../../pageStyle";
import { FaPrint, FaFilePdf, FaEdit } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import moment from "moment-timezone";
import {
  UserRoleAccessContext,
  AuthContext,
} from "../../../../context/Appcontext";
import { handleApiError } from "../../../../components/Errorhandling";
import Headtitle from "../../../../components/Headtitle";
import StyledDataGrid from "../../../../components/TableStyle";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { useNavigate } from "react-router-dom";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import { MultiSelect } from "react-multi-select-component";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
function BoardingLog() {

  const gridRef = useRef(null);
  const { auth } = useContext(AuthContext);
  const {
    isUserRoleCompare,
    isUserRoleAccess,
    isAssignBranch,
    allUsersData,
    alldesignation,
    allTeam,
  } = useContext(UserRoleAccessContext);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());






  const [boardinglogcheck, setBoardinglogcheck] = useState(false);
  const [boardinglogEdit, setBoardinglogEdit] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [copiedData, setCopiedData] = useState("");
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [items, setItems] = useState([]);
  const [process, setProcess] = useState([]);
  const [processOption, setProcessOption] = useState([]);
  const [startdateoptionsEdit, setStartdateoptionsEdit] = useState([]);

  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");

  const [hrsOption, setHrsOption] = useState([]);
  const [minsOption, setMinsOption] = useState([]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);


  const [floorNames, setFloorNames] = useState([]);
  const [areaNames, setAreaNames] = useState([])
  const [allWorkStationOpt, setAllWorkStationOpt] = useState([]);
  const [workStationOpt, setWorkStationOpt] = useState([]);
  const [filteredWorkStation, setFilteredWorkStation] = useState([]);
  const [primaryWorkStation, setPrimaryWorkStation] = useState(
    "Please Select Primary Work Station"
  );
  const [selectedWorkStation, setSelectedWorkStation] = useState("");
  const [selectedOptionsWorkStation, setSelectedOptionsWorkStation] = useState(
    []
  );
  const [maxSelections, setMaxSelections] = useState("");
  const [primaryWorkStationInput, setPrimaryWorkStationInput] = useState("");

  let [valueWorkStation, setValueWorkStation] = useState("");

  const processTypes = [
    { label: "Primary", value: "Primary" },
    { label: "Secondary", value: "Secondary" },
    { label: "Tertiary", value: "Tertiary" },
  ];

  const processDuration = [
    { label: "Full", value: "Full" },
    { label: "Half", value: "Half" },
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
        i = "0" + i;
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
        i = "0" + i;
      }
      minsOpt.push({ value: i.toString(), label: i.toString() });
    }
    setMinsOption(minsOpt);
  };

  let today = new Date();

  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + "-" + mm + "-" + dd;


  const [boardingLogOld, setBoardingLogOld] = useState({});

  const [boardingLog, setBoardingLog] = useState({
    ifoffice: false,
    username: "",
    empcode: "",
    company: "Select Company",
    branch: "Select Branch",
    unit: "Select Unit",
    floor: "Please Select Floor",
    area: "Please Select Area",
    team: "Select Team",
    startdate: formattedDate,
    starttime: currentDateTime.toTimeString().split(" ")[0],
    enddate: "present",
    endtime: "present",
    process: "Select Process",
    processduration: "Full",
    processtype: "Primary",
    time: "00:00",
    boardingdate: "Please Select Start Date",
    department: "",
    companyname: "",
    doj: "",
  });
  const [boardinglogs, setBoardinglogs] = useState([]);

  // Copied fields Name
  const handleCopy = (message) => {
    NotificationManager.success(`${message} 👍`, "", 2000);
  };

  // Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

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
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
    setSearchQueryManage("");
  };



  // Floor Dropdowns
  const fetchfloorNames = async () => {
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };


  // Area Dropdowns
  const fetchareaNames = async (e) => {
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };




  // company multi select
  const handleEmployeesChange = (options) => {
    // If employeecount is greater than 0, limit the selections
    if (maxSelections > 0) {
      // Limit the selections to the maximum allowed
      options = options.slice(0, maxSelections - 1);
    }

    // Update the disabled property based on the current selections and employeecount
    const updatedOptions = filteredWorkStation?.map((option) => ({
      ...option,
      disabled:
        maxSelections - 1 > 0 &&
        options.length >= maxSelections - 1 &&
        !options.find(
          (selectedOption) => selectedOption.value === option.value
        ),
    }));

    setValueWorkStation(options?.map((a, index) => a.value));
    setSelectedOptionsWorkStation(options);
    setFilteredWorkStation(updatedOptions);
  };

  const customValueRendererEmployees = (
    valueWorkStation,
    _filteredWorkStation
  ) => {
    return valueWorkStation.length ? (
      valueWorkStation?.map(({ label }) => label).join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>
        Please Select Secondary Work Station
      </span>
    );
  };

  const fetchWorkStation = async () => {
    try {
      let res = await axios.get(SERVICE.WORKSTATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const result = res?.data?.locationgroupings.flatMap((item) => {
        return item.combinstation.flatMap((combinstationItem) => {
          return combinstationItem.subTodos.length > 0
            ? combinstationItem.subTodos?.map(
              (subTodo) =>
                subTodo.subcabinname +
                "(" +
                item.branch +
                "-" +
                item.floor +
                ")"
            )
            : [
              combinstationItem.cabinname +
              "(" +
              item.branch +
              "-" +
              item.floor +
              ")",
            ];
        });
      });
      setWorkStationOpt(res?.data?.locationgroupings);
      setAllWorkStationOpt(
        result.flat()?.map((d) => ({
          ...d,
          label: d,
          value: d,
        }))
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //get all Designationmonthset
  const fetchDesignationMonthChange = async (e, Doj, Dep) => {
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

      let foundData = response?.data?.processmonthsets?.find(
        (item) =>
          item.process === e.value &&
          new Date(Doj) >= new Date(item.fromdate) &&
          new Date(Doj) <= new Date(item.todate)
      );

      let filteredDatas;

      if (foundData) {
        filteredDatas = response?.data?.processmonthsets
          ?.filter(
            (d) =>
              d.process === e.value &&
              new Date(d.fromdate) >= new Date(foundData.fromdate)
          )
          .map((data) => ({
            label: data.fromdate,
            value: data.fromdate,
          }));

        if (filteredDatas.length === 0) {
          filteredDatas = responseDep?.data?.departmentdetails
            ?.filter(
              (d) =>
                d.department === Dep && new Date(d.fromdate) >= new Date(Doj)
            )
            .map((data) => ({
              label: data.fromdate,
              value: data.fromdate,
            }));
        }
      } else {
        filteredDatas = responseDep?.data?.departmentdetails
          ?.filter(
            (d) => d.department === Dep && new Date(d.fromdate) >= new Date(Doj)
          )
          .map((data) => ({
            label: moment(data.fromdate).format("DD-MM-YYYY"),
            value: data.fromdate,
          }));
      }

      setStartdateoptionsEdit(filteredDatas);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };



  useEffect(() => {
    var filteredWorks;
    if (boardingLog.unit === "" && boardingLog.floor === "") {
      filteredWorks = workStationOpt?.filter(
        (u) => u.company === boardingLog.company && u.branch === boardingLog.branch
      );
    } else if (boardingLog.unit === "") {
      filteredWorks = workStationOpt?.filter(
        (u) =>
          u.company === boardingLog.company &&
          u.branch === boardingLog.branch &&
          u.floor === boardingLog.floor
      );
    } else if (boardingLog.floor === "") {
      filteredWorks = workStationOpt?.filter(
        (u) =>
          u.company === boardingLog.company &&
          u.branch === boardingLog.branch &&
          u.unit === boardingLog.unit
      );
    } else {
      filteredWorks = workStationOpt?.filter(
        (u) =>
          u.company === boardingLog.company &&
          u.branch === boardingLog.branch &&
          u.unit === boardingLog.unit &&
          u.floor === boardingLog.floor
      );
    }
    const result = filteredWorks?.flatMap((item) => {
      return item.combinstation.flatMap((combinstationItem) => {
        return combinstationItem.subTodos.length > 0
          ? combinstationItem.subTodos?.map(
            (subTodo) =>
              subTodo.subcabinname +
              "(" +
              item.branch +
              "-" +
              item.floor +
              ")"
          )
          : [
            combinstationItem.cabinname +
            "(" +
            item.branch +
            "-" +
            item.floor +
            ")",
          ];
      });
    });
    // setFilteredWorkStation(result.flat());
    setFilteredWorkStation(
      result.flat()?.map((d) => ({
        ...d,
        label: d,
        value: d,
      }))
    );
  }, [boardingLog.company, boardingLog.branch, boardingLog.unit, boardingLog.floor]);



  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
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
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

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

  useEffect(() => {
    let result = processOption.filter(
      (d) =>
        d.company === boardingLog?.company &&
        d.branch === boardingLog?.branch &&
        d.unit === boardingLog?.unit &&
        d.team === boardingLog?.team
    );

    const processall = result.map((d) => ({
      ...d,
      label: d.process,
      value: d.process,
    }));

    setProcess(processall);
  }, [
    boardingLog.company,
    boardingLog.branch,
    boardingLog.unit,
    boardingLog.team,
    boardingLog,
  ]);
  const fetchProcess = async () => {
    try {
      let res_freq = await axios.get(SERVICE.ALL_PROCESS_AND_TEAM, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setProcessOption(res_freq?.data?.processteam);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    fetchProcess();
  }, []);

  const [oldData, setOldData] = useState({
    company: "",
    branch: "",
    unit: "",
    team: "",
  });
  const [oldTeam, setOldTeam] = useState("")
  const [oldTeamData, setOldTeamData] = useState([]);
  const [oldTeamSupervisor, setoldTeamSupervisor] = useState(false);
  const [newUpdateDataAll, setNewUpdateDataAll] = useState([]);
  const [newDataTeamWise, setNewDataTeamWise] = useState([]);

  // get single row to view....
  const getviewCode = async (e, floor) => {

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

      let result = req?.data?.allareas
        ?.map((item) => {
          return item.area.map((data) => {
            return data;
          });
        })
        .flat();

      setAreaNames(result);
      setWorkStationInputOldDatas({
        company: res?.data?.suser.company,
        branch: res?.data?.suser?.branch,
        unit: res?.data?.suser?.unit,
        workmode: res?.data?.suser?.workmode,
        ifoffice: res?.data?.suser?.workstationofficestatus,
        workstationinput: res?.data?.suser?.workstationinput,
        username: res?.data?.suser?.username,
      });
      setPrimaryWorkStationInput(res?.data?.suser?.workstationinput);
      setPrimaryWorkStation(res?.data?.suser?.workstation[0]);
      // setGettingOldDatas(res?.data?.suser);
      setOldTeam(res?.data?.suser);
      if (res?.data?.suser?.boardingLog?.length !== 0) {
        setHours(res?.data?.suser?.time);
        setMinutes(res?.data?.suser?.timemins);
      } else {
        setHours("00");
        setMinutes("00");
      }

      handleClickOpenEdit();

      if (res?.data?.suser?.boardingLog?.length > 0) {
        setBoardingLog({
          ...boardingLog,
          username: res?.data?.suser?.companyname,
          empcode: res?.data?.suser?.empcode,

          company: res?.data?.suser?.boardingLog[
            res?.data?.suser?.boardingLog?.length - 1
          ]?.company,
          branch: res?.data?.suser?.boardingLog[
            res?.data?.suser?.boardingLog?.length - 1
          ]?.branch,
          unit: res?.data?.suser?.boardingLog[
            res?.data?.suser?.boardingLog?.length - 1
          ]?.unit,
          floor: res?.data?.suser?.boardingLog[
            res?.data?.suser?.boardingLog?.length - 1
          ]?.floor,
          area: res?.data?.suser?.boardingLog[
            res?.data?.suser?.boardingLog?.length - 1
          ]?.area,
          workstation: res?.data?.suser?.boardingLog[
            res?.data?.suser?.boardingLog?.length - 1
          ]?.workstation,
          team: res?.data?.suser?.boardingLog[
            res?.data?.suser?.boardingLog?.length - 1
          ]?.team,
          process: res?.data?.suser?.process,
          department: res?.data?.suser?.department,
          doj: res?.data?.suser?.doj,
          boardingdate:
            res?.data?.suser?.boardingLog[
              res?.data?.suser?.boardingLog?.length - 1
            ].startdate,
          processduration: res?.data?.suser?.processduration,
          processtype: res?.data?.suser?.processtype,
          companyname: res?.data?.suser?.companyname,
          ifoffice: res?.data?.suser?.workstationofficestatus,
        });
        setBoardingLogOld({
          ...boardingLogOld,
          username: res?.data?.suser?.companyname,
          empcode: res?.data?.suser?.empcode,
          company: res?.data?.suser?.boardingLog[
            res?.data?.suser?.boardingLog?.length - 1
          ]?.company,
          branch: res?.data?.suser?.boardingLog[
            res?.data?.suser?.boardingLog?.length - 1
          ]?.branch,
          unit: res?.data?.suser?.boardingLog[
            res?.data?.suser?.boardingLog?.length - 1
          ]?.unit,
          team: res?.data?.suser?.boardingLog[
            res?.data?.suser?.boardingLog?.length - 1
          ]?.team,
          floor: res?.data?.suser?.boardingLog[
            res?.data?.suser?.boardingLog?.length - 1
          ]?.floor,
          area: res?.data?.suser?.boardingLog[
            res?.data?.suser?.boardingLog?.length - 1
          ]?.area,
          workstation: res?.data?.suser?.boardingLog[
            res?.data?.suser?.boardingLog?.length - 1
          ]?.workstation,
          process: res?.data?.suser?.process,
          department: res?.data?.suser?.department,
          doj: res?.data?.suser?.doj,
          boardingdate:
            res?.data?.suser?.boardingLog[
              res?.data?.suser?.boardingLog?.length - 1
            ].startdate,
          processduration: res?.data?.suser?.processduration,
          processtype: res?.data?.suser?.processtype,
          ifoffice: res?.data?.suser?.workstationofficestatus,
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
        });
      }
      setOldData({
        ...oldData,
        empcode: res?.data?.suser?.empcode,
        company: res?.data?.suser?.boardingLog[
          res?.data?.suser?.boardingLog?.length - 1
        ]?.company,
        unit: res?.data?.suser?.boardingLog[
          res?.data?.suser?.boardingLog?.length - 1
        ]?.unit,
        branch: res?.data?.suser?.boardingLog[
          res?.data?.suser?.boardingLog?.length - 1
        ]?.branch,
        team: res?.data?.suser?.boardingLog[
          res?.data?.suser?.boardingLog?.length - 1
        ]?.team,
        floor: res?.data?.suser?.boardingLog[
          res?.data?.suser?.boardingLog?.length - 1
        ]?.floor,
        area: res?.data?.suser?.boardingLog[
          res?.data?.suser?.boardingLog?.length - 1
        ]?.area,
        workstation: res?.data?.suser?.boardingLog[
          res?.data?.suser?.boardingLog?.length - 1
        ]?.workstation,
        ifoffice: res?.data?.suser?.workstationofficestatus,
      });

      setSelectedWorkStation(
        res?.data?.suser?.workstation.slice(
          1,
          res?.data?.suser?.workstation.length
        )
      );
      const employeeCount = res?.data?.suser.employeecount || 0;
      setMaxSelections(employeeCount);

      setSelectedOptionsWorkStation(
        (res?.data?.suser?.workstation).length > 1
          //  &&
          //   res?.data?.suser?.workstation[1] !== ""
          ? res?.data?.suser?.workstation
            .slice(1, res?.data?.suser?.workstation?.length)
            ?.map((x) => ({
              ...x,
              label: x,
              value: x,
            }))
          : []
      );


      setValueWorkStation(
        res?.data?.suser?.workstation.slice(
          1,
          res?.data?.suser?.workstation.length
        )
      );

      fetchDesignationMonthChange(
        {
          value: res?.data?.suser?.process,
        },
        res?.data?.suser?.doj,
        res?.data?.suser?.department
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchSuperVisorChangingHierarchy = async (value) => {
    if (oldTeam?.team !== value) {
      console.log(value, oldTeam, 'value')
      let designationGrpName = alldesignation?.find(
        (data) => oldTeam?.designation === data?.name
      )?.group;
      let res = await axios.post(SERVICE.HIERARCHY_PROCESSALOOT_TEAM_RELATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldteam: oldTeam?.team,
        team: value,
        user: boardingLog,
        desiggroup: designationGrpName
      });
      const oldData = res?.data?.olddata?.length > 0 ? res?.data?.olddata : [];
      const newDataAll = res?.data?.newdata[0]?.all?.length > 0 ? res?.data?.newdata[0]?.all : [];
      const newDataRemaining = res?.data?.newdata[0]?.team?.length > 0 ? res?.data?.newdata[0]?.team : [];
      const newDataAllSupervisor = res?.data?.supData?.length > 0 ? res?.data?.supData : [];
      setoldTeamSupervisor(newDataAllSupervisor)
      setOldTeamData(oldData);
      setNewUpdateDataAll(newDataAll);
      setNewDataTeamWise(newDataRemaining)
      console.log(oldData, newDataAll, newDataRemaining, newDataAllSupervisor)
    }
    else {
      setOldTeamData([]);
      setNewUpdateDataAll([]);
      setNewDataTeamWise([])
    }

  }

  const [showButton, setShowButton] = useState(true);
  //get all processmonthset
  const fetchProcessMonth = async (e) => {
    try {
      const response = await axios.get(SERVICE.PROCESSMONTHSET_ALL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let monthSet = response.data.processmonthsets
        .filter((data) => data.process == e?.process)
        .some((data) => data.fromdate === formattedDate);
      let monthSetEmpty = response.data.processmonthsets.filter(
        (data) => data.process == e?.process
      );

      if (monthSet) {
        setShowButton(true);
      } else if (monthSetEmpty.length == 0) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //get all processmonthset
  const fetchProcessMonthChange = async (e) => {
    try {
      const response = await axios.get(SERVICE.PROCESSMONTHSET_ALL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let monthSet = response.data.processmonthsets.filter(
        (data) => data.process == e?.value
      );
      let monthSetEmpty = response.data.processmonthsets.filter(
        (data) => data.process == e?.value
      );

      let findDate = monthSet.some((data) => data.fromdate === formattedDate);

      if (findDate) {
        setShowButton(true);
      } else if (monthSetEmpty.length == 0) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setBoardinglogEdit(res?.data?.suser);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //Project updateby edit page...
  let updateby = boardinglogEdit?.updatedby;
  let addedby = boardinglogEdit?.addedby;

  const sendEditRequest = async () => {


    try {
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
          workstation:
            boardingLog.workmode !== "Remote"
              ? valueWorkStation.length === 0
                ? primaryWorkStation
                : [primaryWorkStation, ...valueWorkStation]
              : [primaryWorkStation, ...valueWorkStation],
          workstationinput: String(
            boardingLog.workmode === "Remote" || boardingLog.ifoffice
              ? primaryWorkStationInput
              : ""
          ),
          workstationofficestatus: Boolean(boardingLog.ifoffice),
          process: String(boardingLog.process),
          processtype: String(boardingLog.processtype),
          processduration: String(boardingLog.processduration),
          time: String(hours),
          timemins: String(minutes),
          boardingLog: [
            ...boardinglogEdit.boardingLog,
            {
              username: String(boardinglogEdit.companyname),
              company: String(boardingLog.company),
              startdate: String(boardingLog.boardingdate), // Fixed the field names
              time: `${hours}:${minutes}`,
              branch: String(boardingLog.branch), // Fixed the field names
              unit: String(boardingLog.unit),
              team: String(boardingLog.team),
              floor: String(boardingLog.floor),
              area: String(boardingLog.area),
              workstation:
                boardingLog.workmode !== "Remote"
                  ? valueWorkStation.length === 0
                    ? primaryWorkStation
                    : [primaryWorkStation, ...valueWorkStation]
                  : [primaryWorkStation, ...valueWorkStation],
              ischangecompany: boardinglogEdit.company === boardingLog.company ? Boolean(false) : Boolean(true),
              ischangebranch: boardinglogEdit.company === boardingLog.company ? boardinglogEdit.branch === boardingLog.branch ? Boolean(false) : Boolean(true) : Boolean(true),
              ischangeunit: boardinglogEdit.branch === boardingLog.branch ? boardinglogEdit.unit === boardingLog.unit ? Boolean(false) : Boolean(true) : Boolean(true),
              ischangeteam: boardinglogEdit.unit === boardingLog.unit ? boardinglogEdit.team === boardingLog.team ? Boolean(false) : Boolean(true) : Boolean(true),
              logcreation: "boarding",
              updatedusername: String(isUserRoleAccess.companyname),
              updateddatetime: String(new Date()),
              shifttype: boardinglogEdit?.boardingLog[
                boardinglogEdit?.boardingLog?.length - 1
              ].shifttype,
              shifttiming: boardinglogEdit?.boardingLog[
                boardinglogEdit?.boardingLog?.length - 1
              ].shifttiming,
              shiftgrouping: boardinglogEdit?.boardingLog[
                boardinglogEdit?.boardingLog?.length - 1
              ].shiftgrouping,
              weekoff: boardinglogEdit?.boardingLog[
                boardinglogEdit?.boardingLog?.length - 1
              ].weekoff,
              todo: boardinglogEdit?.boardingLog[
                boardinglogEdit?.boardingLog?.length - 1
              ].todo,
              logeditedby: [],

            },
          ],
          // boardingLog: finalboardinglog,
          processlog: [
            ...boardinglogEdit.processlog,
            {
              company: String(boardingLog.company),
              branch: String(boardingLog.branch),
              unit: String(boardingLog.unit),
              floor: String(boardingLog.floor),
              area: String(boardingLog.area),
              workstation:
                boardingLog.workmode !== "Remote"
                  ? valueWorkStation.length === 0
                    ? primaryWorkStation
                    : [primaryWorkStation, ...valueWorkStation]
                  : [primaryWorkStation, ...valueWorkStation],
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
              updatedusername: String(isUserRoleAccess.companyname),
              updateddatetime: String(new Date()),
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


      // Deleting the Old Data of TEAM MATCHED
      if (oldTeamData?.length > 0) {
        let ans = oldTeamData?.map(data => {
          axios.delete(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          });
        })

      }
      // Adding NEW TEAM TO ALL Conditon Employee
      if (newUpdateDataAll?.length > 0) {
        let res = await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },

          company: String(newUpdateDataAll[0].company),
          designationgroup: String(newUpdateDataAll[0]?.designationgroup),
          department: String(newUpdateDataAll[0].department),
          branch: String(newUpdateDataAll[0].branch),
          unit: String(newUpdateDataAll[0].unit),
          team: String(boardingLog.team,),
          supervisorchoose: String(newUpdateDataAll[0].supervisorchoose),
          mode: String(newUpdateDataAll[0].mode),
          level: String(newUpdateDataAll[0].level),
          control: String(newUpdateDataAll[0].control),
          employeename: boardinglogEdit.companyname,
          access: newUpdateDataAll[0].access,
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
      }

      // Adding NEW TEAM TO ACTUAL TEAM WISE DATA  Conditon Employee
      if (newDataTeamWise?.length > 0) {
        let res = await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },

          company: String(newDataTeamWise[0].company),
          designationgroup: String(newDataTeamWise[0]?.designationgroup),
          department: String(newDataTeamWise[0].department),
          branch: String(newDataTeamWise[0].branch),
          unit: String(newDataTeamWise[0].unit),
          team: String(boardingLog.team,),
          supervisorchoose: String(newDataTeamWise[0].supervisorchoose),
          mode: String(newDataTeamWise[0].mode),
          level: String(newDataTeamWise[0].level),
          control: String(newDataTeamWise[0].control),
          employeename: boardinglogEdit.companyname,
          access: newDataTeamWise[0].access,
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
      }





      handleCloseModEdit();
      await fetchBoardinglog();
      setBoardingLog({
        ...boardingLog,
        company: "Select Company",
        branch: "Select Branch",
        unit: "Select Unit",
        team: "Select Team",
        process: "Select Process",
        processduration: "Full",
        processtype: "Primary",
        companyname: "",
      });



      setShowAlert(
        <>
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "#7AC767" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Updated Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {
      console.log(err, "error")
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const editSubmit = (e) => {
    e.preventDefault();

    // Check if there are any changes
    const isChanged = Object.keys(boardingLog).some(
      (key) => boardingLog[key] !== boardingLogOld[key]
    );

    if (boardingLog.company === "Select Company") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Company"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (boardingLog.branch === "Select Branch") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Branch"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (boardingLog.unit === "Select Unit") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Unit"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (boardingLog.floor === "Please Select Floor") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Floor"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (boardingLog.area === "Please Select Area") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Area"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (primaryWorkStation === "Please Select Primary Work Station") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Primary Work Station"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (selectedOptionsWorkStation.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Secondary Work Station"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (boardingLog.team === "Select Team") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Team"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      boardingLog.process === "Please Select Process" ||
      boardingLog.process === "Select Process" ||
      boardingLog.process === undefined
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Process"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      boardingLog.processtype === "Select Process Type" ||
      boardingLog.processtype === "" ||
      boardingLog.processtype === undefined
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Process Type"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      boardingLog.processduration === "Select Process Duration" ||
      boardingLog.processduration === "" ||
      boardingLog.processduration === undefined
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Process Duration"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      boardingLog.boardingdate === "Please Select Start Date" ||
      boardingLog.boardingdate === "" ||
      boardingLog.boardingdate === undefined
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Please Select Start Date
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (hours === "Hrs" || minutes === "Mins") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Duration"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (hours == "00" && minutes == "00") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Duration"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (!isChanged) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"No Changes to Update"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (boardinglogEdit.company === boardingLog.company &&
      boardinglogEdit.branch === boardingLog.branch &&
      boardinglogEdit.unit === boardingLog.unit &&
      boardinglogEdit.team === boardingLog.team &&
      boardinglogEdit.floor === boardingLog.floor &&
      boardinglogEdit.area === boardingLog.area &&
      boardinglogEdit.workstation[0] === primaryWorkStation &&
      boardinglogEdit.workstation.slice(1) === valueWorkStation.length &&
      boardinglogEdit.workstation.slice(1).every(d => valueWorkStation.includes(d)) &&
      boardinglogEdit.process === boardingLog.process) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"No Changes to Update1"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (isChanged && oldTeamData?.length > 0 && (newUpdateDataAll?.length < 1 && newDataTeamWise?.length < 1)) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"This Employee is not allowed to Change Team with their Designation , Create in Hierarchy First"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (isChanged && oldTeamSupervisor?.length > 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"This Employee is supervisor in hierarchy , So not allowed to Change Team."}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else {
      console.log("lkk")
      // console.log(isChanged ,  oldTeamData?.length > 0 ,  newUpdateDataAll?.length < 1 , newDataTeamWise?.length < 1)
      sendEditRequest();
    }
  };

  //get all Sub vendormasters.
  const fetchBoardinglog = async () => {
    try {
      let res_participants = await axios.get(SERVICE.USERALLLIMIT, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setBoardinglogs(res_participants?.data?.users);
      setBoardinglogcheck(true);
    } catch (err) {
      setBoardinglogcheck(true);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [boardinglogsFilterArray, setBoardinglogsFilterArray] = useState([]);

  const fetchBoardinglogArray = async () => {
    try {
      let res_participants = await axios.get(SERVICE.USERALLLIMIT, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setBoardinglogsFilterArray(res_participants?.data?.users);
      setBoardinglogcheck(true);
    } catch (err) {
      setBoardinglogcheck(true);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    fetchBoardinglogArray();
  }, [isFilterOpen]);

  useEffect(() => {
    fetchBoardinglog();
    fetchWorkStation();
    fetchfloorNames();
    fetchUnitNames();
    fetchbranchNames();

  }, []);

  // Excel
  const fileName = "Boarding Log";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Boarding Log",
    pageStyle: "print",
  });

  // pdf.....
  const columns = [
    { title: "Company Name", field: "companyname" },
    { title: "Branch", field: "branch" },
    { title: "Unit", field: "unit" },
    { title: "Floor", field: "floor" },
    { title: "Area", field: "area" },
    { title: "Team", field: "team" },
    { title: "Workstation", field: "workstation" },
    { title: "Employee Name", field: "username" },
    { title: "Process", field: "process" },
  ];

  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();

    let serialNumberCounter = 1;

    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" },
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];

    const dataWithSerial =
      isfilter === "filtered"
        ? rowDataTable.map((row) => ({
          ...row,
          serialNumber: serialNumberCounter++,
          companyname: row.companyname,
          username: row.username,
        }))
        : boardinglogsFilterArray.map((row) => ({
          ...row,
          serialNumber: serialNumberCounter++,
          companyname: row.company,
          username: row.companyname,
        }));

    doc.autoTable({
      theme: "grid",
      styles: {
        fontSize: 4,
        cellWidth: "auto",
      },
      columns: columnsWithSerial,
      body: dataWithSerial,
    });

    doc.save("Boarding Log.pdf");
  };

  // image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Boarding Log.png");
        });
      });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  const addSerialNumber = () => {
    const itemsWithSerialNumber = boardinglogs?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [boardinglogs]);

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

  const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchOverTerms.every((term) =>
      Object.values(item)?.join(" ")?.toLowerCase()?.includes(term)
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

  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );

  const columnDataTable = [
    {
      field: "checkbox",
      headerName: "Checkbox", // Default header name
      headerStyle: { fontWeight: "bold" },
      renderHeader: (params) => (
        <CheckboxHeader
          selectAllChecked={selectAllChecked}
          onSelectAll={() => {
            if (rowDataTable.length === 0) {
              // Do not allow checking when there are no rows
              return;
            }
            if (selectAllChecked) {
              setSelectedRows([]);
            } else {
              const allRowIds = rowDataTable.map((row) => row.id);
              setSelectedRows(allRowIds);
            }
            setSelectAllChecked(!selectAllChecked);
          }}
        />
      ),

      renderCell: (params) => (
        <Checkbox
          checked={selectedRows.includes(params.row.id)}
          onChange={() => {
            let updatedSelectedRows;
            if (selectedRows.includes(params.row.id)) {
              updatedSelectedRows = selectedRows.filter(
                (selectedId) => selectedId !== params.row.id
              );
            } else {
              updatedSelectedRows = [...selectedRows, params.row.id];
            }

            setSelectedRows(updatedSelectedRows);

            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllChecked(
              updatedSelectedRows.length === filteredData.length
            );
          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 90,
      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
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
      field: "companyname",
      headerName: "Company Name",
      flex: 0,
      width: 150,
      hide: !columnVisibility.username,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 100,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 100,
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
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 100,
      hide: !columnVisibility.team,
      headerClassName: "bold-header",
    },
    {
      field: "workstation",
      headerName: "Workstation",
      flex: 0,
      width: 180,
      hide: !columnVisibility.workstation,
      headerClassName: "bold-header",
    },
    {
      field: "username",
      headerName: "Employee Name",
      flex: 0,
      width: 200,
      hide: !columnVisibility.username,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          <ListItem
            sx={{
              "&:hover": {
                cursor: "pointer",
                color: "blue",
                textDecoration: "underline",
              },
            }}
          >
            <CopyToClipboard
              onCopy={() => {
                handleCopy("Copied Employee Name!");
              }}
              options={{ message: "Copied Employee Name!" }}
              text={params?.row?.username}
            >
              <ListItemText primary={params?.row?.username} />
            </CopyToClipboard>
          </ListItem>
        </Grid>
      ),
    },
    {
      field: "process",
      headerName: "Process",
      flex: 0,
      width: 150,
      hide: !columnVisibility.process,
      headerClassName: "bold-header",
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
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("vboardinglog") && (
            <Button
              variant="contained"
              sx={{
                minWidth: "15px",
                padding: "6px 5px",
              }}
              onClick={() => {
                window.open(
                  `/updatepages/boardingloglist/${params.row.id}`,
                  "_blank"
                );
              }}
            >
              <MenuIcon style={{ fontsize: "small" }} />
            </Button>
          )}
          &ensp;
          {isUserRoleCompare?.includes("eboardinglog") && (
            <Button
              style={{
                backgroundColor: "red",
                minWidth: "15px",
                padding: "6px 5px",
              }}
              onClick={async () => {
                await fetchProcessMonth(params.row);

                await getviewCode(params.row.id, params.row.floor);
              }}
            >
              <FaEdit style={{ color: "white", fontSize: "18px" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iboardinglog") && (
            <Button
              onClick={() => {
                handleClickOpeninfo();
                getinfoCode(params.row.id);
              }}
            >
              <InfoOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
        </Grid>
      ),
    },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      empcode: item.empcode,
      username: item.companyname,
      companyname: item.company,
      branch: item.branch,
      unit: item.unit,
      floor: item.floor,
      area: item.area,
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
    const updatedVisibility = { ...columnVisibility };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibility(updatedVisibility);
  };
  // // Function to filter columns based on search query
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
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

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

  const handleExportXL = (isfilter) => {
    if (isfilter === "filtered") {
      exportToCSV(
        rowDataTable?.map((t, index) => ({
          Sno: index + 1,
          Company: t.companyname,
          Branch: t.branch,
          Unit: t.unit,
          Floor: t.floor,
          Area: t.area,
          Team: t.team,
          Workstation: t.workstation,
          Employeename: t.username,
          Process: t.process,
        })),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        boardinglogsFilterArray.map((t, index) => ({
          Sno: index + 1,
          Company: t.company,
          Branch: t.branch,
          Unit: t.unit,
          Floor: t.floor,
          Area: t.area,
          Team: t.team,
          Workstation: t.workstation,
          Employeename: t.companyname,
          Process: t.process,
        })),
        fileName
      );
    }

    setIsFilterOpen(false);
  };


  const [selectedBranchCode, setSelectedBranchCode] = useState("");
  const [selectedUnitCode, setSelectedUnitCode] = useState("");
  const [workStationInputOldDatas, setWorkStationInputOldDatas] = useState({});
  const [repotingtonames, setrepotingtonames] = useState([]);

  const fetchUsernames = async () => {
    setrepotingtonames(allUsersData);
  };



  const workStationAutoGenerate = async () => {
    try {
      let lastwscode;
      let lastworkstation = repotingtonames
        .filter(
          (item) =>
            // item?.workmode !== "Internship" &&
            item.company === boardingLog.company &&
            item.branch === boardingLog.branch &&
            item.unit === boardingLog.unit
        )
        ?.filter((item) => /_[0-9]+_/.test(item?.workstationinput));

      if (lastworkstation.length === 0) {
        lastwscode = 0;
      } else {
        let highestWorkstation = lastworkstation.reduce(
          (max, item) => {
            const num = parseInt(item.workstationinput.split("_")[1]);
            return num > max.num ? { num, item } : max;
          },
          { num: 0, item: null }
        ).num;

        lastwscode = highestWorkstation.toString().padStart(2, "0");
      }

      let autoWorkStation = `W${selectedBranchCode?.toUpperCase()}${selectedUnitCode?.toUpperCase()}_${lastwscode === 0
        ? "01"
        : (Number(lastwscode) + 1).toString().padStart(2, "0")
        }_${workStationInputOldDatas?.username?.toUpperCase()}`;

      if (
        workStationInputOldDatas?.company === boardingLog.company &&
        workStationInputOldDatas?.branch === boardingLog.branch &&
        workStationInputOldDatas?.unit === boardingLog.unit
        // &&
        // workStationInputOldDatas?.workmode === empaddform.workmode
      ) {
        setPrimaryWorkStationInput(
          workStationInputOldDatas?.workstationinput === "" ||
            workStationInputOldDatas?.workstationinput == undefined
            ? autoWorkStation
            : workStationInputOldDatas?.workstationinput
        );
      } else {
        setPrimaryWorkStationInput(autoWorkStation);
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [branchNames, setBranchNames] = useState([]);
  const [unitNames, setUnitNames] = useState([]);


  // Branch Dropdowns
  const fetchbranchNames = async () => {
    try {
      let req = await axios.get(SERVICE.BRANCH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setBranchNames(req.data.branch);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchUnitNames = async () => {
    // let branch = getunitname ? getunitname : empaddform.branch;
    try {
      let req = await axios.get(SERVICE.UNIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setUnitNames(req?.data?.units);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };


  useEffect(() => {
    const branchCode = branchNames?.filter(
      (item) => item.name === boardingLog.branch && item.company === boardingLog.company
    );
    setSelectedBranchCode(branchCode[0]?.code.slice(0, 2));

    const unitCode = unitNames?.filter((item) => item.name === boardingLog.unit);
    setSelectedUnitCode(unitCode[0]?.code.slice(0, 2));
  }, [boardingLog.branch, boardingLog.unit]);

  useEffect(() => {
    workStationAutoGenerate();
  }, [
    boardingLog.company,
    boardingLog.branch,
    boardingLog.unit,
    boardingLog.workmode,
    boardingLog?.ifoffice,
    selectedBranchCode,
    selectedUnitCode,
  ]);



  useEffect(() => {
    fetchUsernames()
  }, [boardingLog.unit])

  return (
    <Box>
      <NotificationContainer />
      <Headtitle title={"Boarding Log"} />
      {/* ****** Header Content ****** */}
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lboardinglog") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Boarding Log
              </Typography>
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
                    sx={{ width: "77px" }}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
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
                  {isUserRoleCompare?.includes("excelboardinglog") && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          fetchBoardinglogArray();
                          setFormat("xl");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileExcel />
                        &ensp;Export to Excel&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvboardinglog") && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          fetchBoardinglogArray();
                          setFormat("csv");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileCsv />
                        &ensp;Export to CSV&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("printboardinglog") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfboardinglog") && (
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
                  {isUserRoleCompare?.includes("imageboardinglog") && (
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
              <Grid item md={2} xs={6} sm={6}>
                <Box>
                  <FormControl fullWidth size="small">
                    <Typography>Search</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
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
            <br />
            <br />
            {!boardinglogcheck ? (
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
                <Box
                  style={{
                    width: "100%",
                    overflowY: "hidden", // Hide the y-axis scrollbar
                  }}
                >
                  <StyledDataGrid
                    onClipboardCopy={(copiedString) =>
                      setCopiedData(copiedString)
                    }
                    rows={rowsWithCheckboxes}
                    columns={columnDataTable.filter(
                      (column) => columnVisibility[column.field]
                    )}
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
                    Showing{" "}
                    {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
                    {Math.min(page * pageSize, filteredDatas.length)} of{" "}
                    {filteredDatas.length} entries
                  </Box>
                  <Box>
                    <Button
                      onClick={() => setPage(1)}
                      disabled={page === 1}
                      sx={userStyle.paginationbtn}
                    >
                      <FirstPageIcon />
                    </Button>
                    <Button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      sx={userStyle.paginationbtn}
                    >
                      <NavigateBeforeIcon />
                    </Button>
                    {pageNumbers?.map((pageNumber) => (
                      <Button
                        key={pageNumber}
                        sx={userStyle.paginationbtn}
                        onClick={() => handlePageChange(pageNumber)}
                        className={page === pageNumber ? "active" : ""}
                        disabled={page === pageNumber}
                      >
                        {pageNumber}
                      </Button>
                    ))}
                    {lastVisiblePage < totalPages && <span>...</span>}
                    <Button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      sx={userStyle.paginationbtn}
                    >
                      <NavigateNextIcon />
                    </Button>
                    <Button
                      onClick={() => setPage(totalPages)}
                      disabled={page === totalPages}
                      sx={userStyle.paginationbtn}
                    >
                      <LastPageIcon />
                    </Button>
                  </Box>
                </Box>
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
            overflow: "visible",
            "& .MuiPaper-root": {
              overflow: "visible",
            },
          }}
        >
          <Box sx={{ padding: "5px 20px" }}>
            <>
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <Typography sx={userStyle.HeaderText}>
                    Boarding Log Change <b style={{ color: "red" }}>{"(" + boardinglogEdit.companyname + ")"}</b>
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={isAssignBranch
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
                        label: boardingLog.company,
                        value: boardingLog.company,
                      }}
                      onChange={(e) => {
                        setBoardingLog({
                          ...boardingLog,
                          company: e.value,
                          branch: "Select Branch",
                          unit: "Select Unit",
                          team: "Select Team",
                          floor: "Please Select Floor",
                          area: "Please Select Area",
                          process: "Select Process",
                          boardingdate: "Please Select Start Date",
                          processduration: "Full",
                          processtype: "Primary",
                        });
                        setPrimaryWorkStation("Please Select Primary Work Station");
                        setSelectedOptionsWorkStation([]);
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={isAssignBranch
                        ?.filter((comp) => boardingLog.company === comp.company)
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
                        label: boardingLog.branch,
                        value: boardingLog.branch,
                      }}
                      onChange={(e) => {
                        setBoardingLog({
                          ...boardingLog,
                          branch: e.value,
                          unit: "Select Unit",
                          team: "Select Team",
                          floor: "Please Select Floor",
                          area: "Please Select Area",
                          process: "Select Process",
                          boardingdate: "Please Select Start Date",
                          processduration: "Full",
                          processtype: "Primary",
                        });
                        setPrimaryWorkStation("Please Select Primary Work Station");
                        setSelectedOptionsWorkStation([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Unit<b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <Selects
                      options={isAssignBranch
                        ?.filter(
                          (comp) =>
                            boardingLog.company === comp.company &&
                            boardingLog.branch === comp.branch
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
                        label: boardingLog.unit,
                        value: boardingLog.unit,
                      }}
                      onChange={(e) => {
                        setBoardingLog({
                          ...boardingLog,
                          unit: e.value,
                          processduration: "Full",
                          processtype: "Primary",
                          team: "Select Team",
                          floor: "Please Select Floor",
                          area: "Please Select Area",
                          process: "Select Process",
                          boardingdate: "Please Select Start Date",

                        });
                        setPrimaryWorkStation("Please Select Primary Work Station");
                        setSelectedOptionsWorkStation([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Floor<b style={{ color: "red" }}>*</b></Typography>
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
                        label:
                          boardingLog.floor !== ""
                            ? boardingLog.floor
                            : "Please Select Floor",
                        value:
                          boardingLog.floor !== ""
                            ? boardingLog.floor
                            : "Please Select Floor",
                      }}
                      onChange={(e, i) => {
                        setBoardingLog({ ...boardingLog, floor: e.value, area: "Please Select Area", });
                        fetchareaNames(e.value);
                        setPrimaryWorkStation("Please Select Primary Work Station");
                        setSelectedOptionsWorkStation([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Area<b style={{ color: "red" }}>*</b></Typography>

                    <Selects
                      options={areaNames?.map((data) => ({
                        label: data,
                        value: data,
                      }))}
                      styles={colourStyles}
                      value={{
                        label:
                          boardingLog?.area === "" || boardingLog?.area == undefined
                            ? "Please Select Area"
                            : boardingLog?.area,
                        value:
                          boardingLog?.area === "" || boardingLog?.area == undefined
                            ? "Please Select Area"
                            : boardingLog?.area,
                      }}
                      onChange={(e) => {
                        setBoardingLog({ ...boardingLog, area: e.value });
                        setPrimaryWorkStation("Please Select Primary Work Station");
                        setSelectedOptionsWorkStation([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <Typography>
                    Team<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth>
                    <Selects
                      options={allTeam
                        ?.filter(
                          (comp) =>
                            boardingLog.company === comp.company &&
                            boardingLog.branch === comp.branch &&
                            boardingLog.unit === comp.unit
                        )
                        ?.map((data) => ({
                          label: data.teamname,
                          value: data.teamname,
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
                        label: boardingLog.team,
                        value: boardingLog.team,
                      }}
                      onChange={(e) => {
                        setBoardingLog({
                          ...boardingLog,
                          team: e.value,
                          process: "Select Process",
                          processduration: "Full",
                          processtype: "Primary",
                          boardingdate: "Please Select Start Date",
                        });
                        // checkHierarchyName(e.value, "Team");
                        fetchSuperVisorChangingHierarchy(e.value)
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl size="small" fullWidth>
                    <Typography>If Office</Typography>
                  </FormControl>
                  <Grid>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={boardingLog.ifoffice === true}
                          />
                        }
                        onChange={(e) => {
                          setBoardingLog({
                            ...boardingLog,
                            ifoffice: !boardingLog.ifoffice,
                          });
                          // setPrimaryWorkStation("Please Select Primary Work Station")
                          setPrimaryWorkStationInput("");
                        }}
                        label="Work Station Other"
                      />
                    </FormGroup>
                  </Grid>
                </Grid>
                {boardingLog.workmode !== "Remote" ? (
                  <>
                    {" "}
                    {boardingLog.ifoffice === true && (
                      <>
                        <Grid item md={3} sm={6} xs={12}>
                          <FormControl size="small" fullWidth>
                            <Typography>
                              Work Station (WFH)

                            </Typography>
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
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Work Station (Primary)<b style={{ color: "red" }}>*</b></Typography>
                        <Selects
                          options={filteredWorkStation}
                          label="Please Select Shift"
                          value={{
                            label: primaryWorkStation,
                            value: primaryWorkStation,
                          }}
                          onChange={(e) => {
                            setPrimaryWorkStation(e.value);
                            setSelectedOptionsWorkStation([]);
                            setValueWorkStation([]);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Work Station (Secondary)<b style={{ color: "red" }}>*</b></Typography>
                        <MultiSelect
                          size="small"
                          options={allWorkStationOpt.filter(
                            (item) => item.value !== primaryWorkStation
                          )}
                          value={selectedOptionsWorkStation}
                          onChange={handleEmployeesChange}
                          valueRenderer={customValueRendererEmployees}
                        />
                      </FormControl>
                    </Grid>


                  </>
                ) : (
                  <>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Work Station (Primary)<b style={{ color: "red" }}>*</b></Typography>
                        <Selects
                          options={filteredWorkStation}
                          label="Please Select Shift"
                          value={{
                            label: primaryWorkStation,
                            value: primaryWorkStation,
                          }}
                          onChange={(e) => {
                            setPrimaryWorkStation(e.value);
                            setSelectedOptionsWorkStation([]);
                            setValueWorkStation([]);
                          }}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Work Station (Secondary)<b style={{ color: "red" }}>*</b></Typography>
                        <MultiSelect
                          size="small"
                          options={allWorkStationOpt}
                          value={selectedOptionsWorkStation}
                          onChange={handleEmployeesChange}
                          valueRenderer={customValueRendererEmployees}
                        />
                      </FormControl>
                    </Grid>
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
                  </>
                )}

                {/* {boardingLog.ifoffice === true && (
                  <>
                    <Grid item md={4} sm={6} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>
                          Work Station (WFH)

                        </Typography>
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
                )} */}
                <Grid item md={3} xs={12} sm={6}>
                  <Typography>
                    Process<b style={{ color: "red" }}>*</b>
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
                          processduration: "Full",
                          processtype: "Primary",
                          boardingdate: "Please Select Start Date",
                        });
                        fetchProcessMonthChange(e);
                        fetchDesignationMonthChange(
                          e,
                          boardingLog.doj,
                          boardingLog.department
                        );
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <Typography>
                    Process type<b style={{ color: "red" }}>*</b>
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
                    Process Duration<b style={{ color: "red" }}>*</b>
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
                    Start Date <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Selects
                      options={startdateoptionsEdit}
                      styles={colourStyles}
                      value={{
                        label:
                          boardingLog.boardingdate !== "" &&
                            boardingLog.boardingdate !==
                            "Please Select Start Date"
                            ? moment(boardingLog.boardingdate).format(
                              "DD-MM-YYYY"
                            )
                            : "Please Select Start Date",
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
                        Duration  Hrs<b style={{ color: "red" }}>*</b>
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
                      <Typography>
                        Mins
                      </Typography>
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
                  <Button variant="contained" onClick={editSubmit}>
                    Update
                  </Button>
                  &emsp;
                  <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
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
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        {manageColumnsContent}
      </Popover>

      {/* Delete Modal */}
      <Box>
        {/* this is info view details */}

        <Dialog
          open={openInfo}
          onClose={handleCloseinfo}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <Box sx={{ width: "550px", padding: "20px 50px" }}>
            <>
              <Typography sx={userStyle.HeaderText}>
                Boarding Log Info
              </Typography>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">addedby</Typography>
                    <br />
                    <Table>
                      <TableHead>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {"SNO"}.
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {" "}
                          {"UserName"}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {" "}
                          {"Date"}
                        </StyledTableCell>
                      </TableHead>
                      <TableBody>
                        {addedby?.map((item, i) => (
                          <StyledTableRow>
                            <StyledTableCell
                              sx={{ padding: "5px 10px !important" }}
                            >
                              {i + 1}.
                            </StyledTableCell>
                            <StyledTableCell
                              sx={{ padding: "5px 10px !important" }}
                            >
                              {" "}
                              {item.name}
                            </StyledTableCell>
                            <StyledTableCell
                              sx={{ padding: "5px 10px !important" }}
                            >
                              {" "}
                              {moment(item.date).format(
                                "DD-MM-YYYY hh:mm:ss a"
                              )}
                            </StyledTableCell>
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
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {"SNO"}.
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {" "}
                          {"UserName"}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {" "}
                          {"Date"}
                        </StyledTableCell>
                      </TableHead>
                      <TableBody>
                        {updateby?.map((item, i) => (
                          <StyledTableRow>
                            <StyledTableCell
                              sx={{ padding: "5px 10px !important" }}
                            >
                              {i + 1}.
                            </StyledTableCell>
                            <StyledTableCell
                              sx={{ padding: "5px 10px !important" }}
                            >
                              {" "}
                              {item.name}
                            </StyledTableCell>
                            <StyledTableCell
                              sx={{ padding: "5px 10px !important" }}
                            >
                              {" "}
                              {moment(item.date).format(
                                "DD-MM-YYYY hh:mm:ss a"
                              )}
                            </StyledTableCell>
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
                <Button variant="contained" onClick={handleCloseinfo}>
                  {" "}
                  Back{" "}
                </Button>
              </Grid>
            </>
          </Box>
        </Dialog>
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
                <TableCell>SNo</TableCell>
                <TableCell>Company Name</TableCell>
                <TableCell>Branch</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Floor</TableCell>
                <TableCell>Area</TableCell>
                <TableCell>Team</TableCell>
                <TableCell>Workstation</TableCell>
                <TableCell>Employee Name</TableCell>
                <TableCell>Process</TableCell>
              </TableRow>
            </TableHead>
            <TableBody align="left">
              {rowDataTable &&
                rowDataTable.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.companyname}</TableCell>
                    <TableCell>{row.branch}</TableCell>
                    <TableCell>{row.unit}</TableCell>
                    <TableCell>{row.floor}</TableCell>
                    <TableCell>{row.area}</TableCell>
                    <TableCell>{row.team}</TableCell>
                    <TableCell>{row.workstation}</TableCell>
                    <TableCell>{row.username}</TableCell>
                    <TableCell>{row.process}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/*Export XL Data  */}
      <Dialog
        open={isFilterOpen}
        onClose={handleCloseFilterMod}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleCloseFilterMod}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>

          {fileFormat === "xl" ? (
            <FaFileExcel style={{ fontSize: "70px", color: "green" }} />
          ) : (
            <FaFileCsv style={{ fontSize: "70px", color: "green" }} />
          )}
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Choose Export
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            variant="contained"
            onClick={(e) => {
              handleExportXL("filtered");
            }}
          >
            Export Filtered Data
          </Button>
          <Button
            autoFocus
            variant="contained"
            onClick={(e) => {
              handleExportXL("overall");
              fetchBoardinglogArray();
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
      {/*Export pdf Data  */}
      <Dialog
        open={isPdfFilterOpen}
        onClose={handleClosePdfFilterMod}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleClosePdfFilterMod}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>

          <PictureAsPdfIcon sx={{ fontSize: "80px", color: "red" }} />
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Choose Export
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={(e) => {
              downloadPdf("filtered");
              setIsPdfFilterOpen(false);
            }}
          >
            Export Filtered Data
          </Button>
          <Button
            variant="contained"
            onClick={(e) => {
              downloadPdf("overall");
              setIsPdfFilterOpen(false);
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
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
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default BoardingLog;