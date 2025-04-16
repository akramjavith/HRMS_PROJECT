import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  TableBody,
  TableRow,
  TableCell, FormControlLabel, FormGroup, Checkbox,
  Select,
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Paper,
  Table,
  TableHead,
  TableContainer,
  Button,
  List,
  ListItem,
  ListItemText,
  Popover,
  TextField,
  IconButton,
} from "@mui/material";
import { userStyle, colourStyles } from "../../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../../../components/Export";
import moment from "moment-timezone";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import {
  UserRoleAccessContext,
  AuthContext,
} from "../../../../context/Appcontext";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import StyledDataGrid from "../../../../components/TableStyle";
import { handleApiError } from "../../../../components/Errorhandling";
import { styled } from "@mui/system";
import Resizable from "react-resizable";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { MultiSelect } from "react-multi-select-component";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Selects from "react-select";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { StyledTableRow, StyledTableCell } from "../../../../components/Table";

function BoardingLogEdit({ boardinglogs, userID }) {

  const [editDetails, setEditDetails] = useState({});
  const [editDetailsOld, setEditDetailsOld] = useState({});
  const [isLastLog, setIsLastLog] = useState(false);

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
            item.company === editDetails.company &&
            item.branch === editDetails.branch &&
            item.unit === editDetails.unit
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
        workStationInputOldDatas?.company === editDetails.company &&
        workStationInputOldDatas?.branch === editDetails.branch &&
        workStationInputOldDatas?.unit === editDetails.unit
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


  useEffect(() => {
    workStationAutoGenerate();
  }, [
    editDetails.company,
    editDetails.branch,
    editDetails.unit,
    editDetails.workmode,
    editDetails?.ifoffice,
    selectedBranchCode,
    selectedUnitCode,
  ]);



  useEffect(() => {
    fetchUsernames()
  }, [editDetails])

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




  useEffect(() => {
    var filteredWorks;
    if (editDetails.unit === "" && editDetails.floor === "") {
      filteredWorks = workStationOpt?.filter(
        (u) => u.company === editDetails.company && u.branch === editDetails.branch
      );
    } else if (editDetails.unit === "") {
      filteredWorks = workStationOpt?.filter(
        (u) =>
          u.company === editDetails.company &&
          u.branch === editDetails.branch &&
          u.floor === editDetails.floor
      );
    } else if (editDetails.floor === "") {
      filteredWorks = workStationOpt?.filter(
        (u) =>
          u.company === editDetails.company &&
          u.branch === editDetails.branch &&
          u.unit === editDetails.unit
      );
    } else {
      filteredWorks = workStationOpt?.filter(
        (u) =>
          u.company === editDetails.company &&
          u.branch === editDetails.branch &&
          u.unit === editDetails.unit &&
          u.floor === editDetails.floor
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
  }, [editDetails.company, editDetails.branch, editDetails.unit, editDetails.floor]);




  const [poardinglogsTeamArray, setBoardinglogsTeamArray] = useState([]);
  const [userData, setUserData] = useState({});


  const rowDataArray = async () => {
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${userID}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const newarray = res?.data?.suser?.boardingLog.map((item) => {
        let processvalue = "";
        let processid = "";
        res?.data?.suser?.processlog.forEach((data, index) => {
          if (item.company === data.company && item.branch === data.branch && item.unit === data.unit && item.team === data.team && item.startdate === data.date) {
            processvalue = data.process
            processid = data._id
          }
        })
        return {
          _id: item._id,
          unit: item.unit,
          processid: item.processid,
          username: res?.data?.suser?.companyname,
          startdate: item.startdate
            ? moment(item.startdate).format("DD-MM-YYYY")
            : "",
          time: item.time,
          branch: item.branch,
          team: item.team,
          company: item.company,
          floor: item.floor,
          area: item.area,
          workstation: item.workstation,
          process: item.processvalue,
          shifttype: item.shifttype,
        };
      });
      setBoardinglogsTeamArray(newarray);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    rowDataArray();
  }, [isFilterOpen]);

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
          SNo: index + 1,
          Company: t.company,
          Branch: t.branch,
          Unit: t.unit,
          Floor: t.floor,
          Area: t.area,
          Team: t.team,
          Workstation: t.workstationexcel,
          Process: t.process,
          "Shift Type": t.shifttype,
          "Employee Name": t.username,
          "From Date": t.startdate,
          Time: t.time,
        })),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        items.map((t, index) => ({
          SNo: index + 1,
          Company: t.company,
          Branch: t.branch,
          Unit: t.unit,
          Floor: t.floor,
          Area: t.area,
          Team: t.team,
          Workstation: t.workstationexcel,
          Process: t.process,
          "Shift Type": t.shifttype,
          "Employee Name": t.username,
          "From Date": isValidDateFormat(t.startdate)
            ? moment(t.startdate).format("DD-MM-YYYY")
            : t.startdate,
          Time: t.time,
        })),
        fileName
      );
    }

    setIsFilterOpen(false);
  };

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
    { label: "Primary", value: "Primary" },
    { label: "Secondary", value: "Secondary" },
    { label: "Tertiary", value: "Tertiary" },
  ];

  const processDuration = [
    { label: "Full", value: "Full" },
    { label: "Half", value: "Half" },
  ];

  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");

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

  const [process, setProcess] = useState([]);
  const [processOption, setProcessOption] = useState([]);

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
    let result = processOption.filter(
      (d) =>
        d.company === editDetails?.company &&
        d.branch === editDetails?.branch &&
        d.unit === editDetails?.unit &&
        d.team === editDetails?.team
    );

    const processall = result.map((d) => ({
      ...d,
      label: d.process,
      value: d.process,
    }));

    setProcess(processall);
  }, [
    editDetails.company,
    editDetails.branch,
    editDetails.unit,
    editDetails.team,
    editDetails,
  ]);
  //get single row to edit....
  const getCode = async (params) => {
    try {
      await fetchDesignationMonthChange(
        params?.process,
        userData.doj,
        userData.department
      );
      let hrs = params?.time?.split(":")[0] || "00";
      let mins = params?.time?.split(":")[1] || "00";
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
        username: params?.username,
      });
      // setEditDetails({
      //   ...editDetails,
      //   ifoffice: params.ifoffice,
      // });
      setPrimaryWorkStationInput(params?.workstationinput);
      setPrimaryWorkStation(params?.workstation[0]);
      setSelectedOptionsWorkStation(
        (params.workstation).length > 1
          //  &&
          //   res?.data?.suser?.workstation[1] !== ""
          ? params?.workstation
            .slice(1, params?.workstation?.length)
            ?.map((x) => ({
              ...x,
              label: x,
              value: x,
            }))
          : []
      );
      setValueWorkStation(
        params?.workstation.slice(
          1,
          params?.workstation.length
        )
      );
      handleOpenEdit();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [startdateoptionsEdit, setStartdateoptionsEdit] = useState([]);

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
          item.process === e &&
          new Date(Doj) >= new Date(item.fromdate) &&
          new Date(Doj) <= new Date(item.todate)
      );

      let filteredDatas;

      if (foundData) {
        filteredDatas = response?.data?.processmonthsets
          ?.filter(
            (d) =>
              d.process === e &&
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

  const editSubmit = (e) => {
    e.preventDefault();

    // Check if there are any changes
    const isChanged = Object.keys(editDetails).some(
      (key) => editDetails[key] !== editDetailsOld[key]
    );
    if (
      editDetails.company === "" ||
      editDetails.company === undefined ||
      editDetails.company === "Please Select Company"
    ) {
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
    } else if (
      editDetails.branch === "" ||
      editDetails.branch === undefined ||
      editDetails.branch === "Please Select Branch"
    ) {
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
    } else if (
      editDetails.unit === "" ||
      editDetails.unit === undefined ||
      editDetails.unit === "Please Select Unit"
    ) {
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
    else if (editDetails.floor === "Please Select Floor") {
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
    else if (editDetails.area === "Please Select Area") {
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
    else if (
      editDetails.team === "" ||
      editDetails.team === undefined ||
      editDetails.team === "Please Select Team"
    ) {
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
    else if (
      editDetails.process === "" ||
      editDetails.process === undefined ||
      editDetails.process === "Please Select Process"
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
      editDetails.originalstartdate === "" ||
      editDetails.originalstartdate === undefined ||
      editDetails.originalstartdate === "Please Select Start Date"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Start Date"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      editDetails.time === "Hrs:Mins" ||
      editDetails.time === "" ||
      editDetails.time === undefined ||
      editDetails.time.includes("Mins") ||
      editDetails.time.includes("Hrs") ||
      editDetails.time === "00:00"
    ) {
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
    } else if (!isChanged) {
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
    } else if (
      editDetailsOld?.team !== editDetails.team &&
      isLastLog &&
      ((oldHierarchyData?.length > 0 && newHierarchyData?.length < 1) ||
        (oldHierarchyDataSupervisor?.length > 0 &&
          newHierarchyData?.length < 1))
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {
              "These Employee is not allowed to change team, Update in Hierarchy first"
            }
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (isLastLog && newHierarchyData[0]?.designationgroup !== gettingDesigGroup &&
      (newHierarchyData?.length > 0)) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"These Employee is not allowed to change team, Designation is not Matched in Hierarchy"}
          </p>
        </>
      );
      handleClickOpenerr();
    }


    else {
      sendEditRequest();
    }
  };

  const [oldHierarchyData, setOldHierarchyData] = useState([]);
  const [newHierarchyData, setNewHierarchyData] = useState([]);
  const [oldHierarchyDataSupervisor, setOldHierarchyDataSupervisor] = useState(
    []
  );
  const [gettingDesigGroup, setGettingDesigGroup] = useState([]);
  const [getingOlddatas, setGettingOldDatas] = useState([]);


  const checkHierarchyName = async (newValue, type) => {
    try {
      if (
        type === "Designation"
          ? newValue != userData?.department
          : newValue != userData?.team
      ) {
        let res = await axios.post(SERVICE.HIERARCHI_TEAM_DESIGNATION_CHECK, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          oldname: userData,
          newname: newValue,
          type: type,
          username: userData.companyname,
          designation: userData.designation,
        });
        setGettingDesigGroup(res?.data?.desiggroup)
        setOldHierarchyData(res?.data?.hierarchyold);
        setNewHierarchyData(res?.data?.hierarchyfindchange);
        setOldHierarchyDataSupervisor(res?.data?.hierarchyoldsupervisor);
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const sendEditRequest = async () => {
    try {
      await axios.put(
        `${SERVICE.UPDATEANYLOG}/?logid=${editDetails?.id}&logname=boardingLog`,
        {
          company: String(editDetails.company),
          branch: String(editDetails.branch),
          unit: String(editDetails.unit),
          team: String(editDetails.team),
          floor: String(editDetails.floor),
          area: String(editDetails.area),
          workstation:
            editDetails.workmode !== "Remote"
              ? valueWorkStation.length === 0
                ? primaryWorkStation
                : [primaryWorkStation, ...valueWorkStation]
              : [primaryWorkStation, ...valueWorkStation],
          process: String(editDetails.process),
          startdate: String(editDetails.originalstartdate),
          time: String(editDetails.time),
          // enableworkstation: Boolean(enableWorkstation),
          workstationinput: String(
            editDetails.workmode === "Remote" || editDetails.ifoffice
              ? primaryWorkStationInput
              : ""
          ),
          workstationofficestatus: Boolean(editDetails.ifoffice),
          workmode: String(editDetails.workmode),
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
            company: String(editDetails.company),
            branch: String(editDetails.branch),
            unit: String(editDetails.unit),
            team: String(editDetails.team),
            floor: String(editDetails.floor),
            area: String(editDetails.area),
            workstation:
              editDetails.workmode !== "Remote"
                ? valueWorkStation.length === 0
                  ? primaryWorkStation
                  : [primaryWorkStation, ...valueWorkStation]
                : [primaryWorkStation, ...valueWorkStation],
            process: String(editDetails.process),
            processtype: String(editDetails.processtype),
            processduration: String(editDetails.processduration),
          },
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          }
        );
        if (
          oldHierarchyData?.length > 0 &&
          newHierarchyData?.length > 0 &&
          isLastLog
        ) {
          //setting New EmployeeNames into the another
          const newEmployeenames = [
            ...newHierarchyData[0].employeename,
            userData?.companyname,
          ];
          let res = await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },

            company: String(newHierarchyData[0].company),
            designationgroup: String(newHierarchyData[0].designationgroup),
            department: String(newHierarchyData[0].department),
            branch: String(newHierarchyData[0].branch),
            unit: String(newHierarchyData[0].unit),
            team: String(editDetails.team),
            supervisorchoose: String(newHierarchyData[0].supervisorchoose),
            mode: String(newHierarchyData[0].mode),
            level: String(newHierarchyData[0].level),
            control: String(newHierarchyData[0].control),
            employeename: userData.companyname,
            access: newHierarchyData[0].access,
            action: Boolean(true),
            empbranch: newHierarchyData[0].empbranch,
            empunit: newHierarchyData[0].empunit,
            empcode: userData?.empcode,
            empteam: editDetails.team,
            addedby: [
              {
                name: String(isUserRoleAccess?.username),
                date: String(new Date()),
              },
            ],
          });

          //Removing Name From the Old one
          let oldHierarchy = oldHierarchyData?.map((data) => {
            let oldemployeename = data.employeename?.filter(
              (ite) => ite != userData?.companyname
            );
            if (oldemployeename?.length > 1) {
              let res = axios.put(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
                employeename: oldemployeename,
              });
            } else {
              let res = axios.delete(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
              });
            }
          });
        }

        if (
          oldHierarchyDataSupervisor?.length > 0 &&
          newHierarchyData?.length > 0 &&
          isLastLog
        ) {
          //setting New EmployeeNames into the another
          const newEmployeenames = oldHierarchyDataSupervisor?.map((data) =>
            axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },

              company: String(newHierarchyData[0].company),
              designationgroup: String(newHierarchyData[0].designationgroup),
              department: String(newHierarchyData[0].department),
              branch: String(newHierarchyData[0].branch),
              unit: String(newHierarchyData[0].unit),
              team: String(boardinglogsUnit[0].team),
              supervisorchoose: String(newHierarchyData[0].supervisorchoose),
              mode: String(newHierarchyData[0].mode),
              level: String(newHierarchyData[0].level),
              control: String(newHierarchyData[0].control),
              employeename: data.employeename,
              access: newHierarchyData[0].access,
              action: Boolean(true),
              empbranch: newHierarchyData[0].empbranch,
              empunit: newHierarchyData[0].empunit,
              empcode: data.empcode,
              empteam: editDetails.team,
              addedby: [
                {
                  name: String(isUserRoleAccess?.username),
                  date: String(new Date()),
                },
              ],
            })
          );
          //Removing Name From the Old one
          let oldHierarchy = oldHierarchyDataSupervisor?.map((data) => {
            let oldemployeename = data.supervisorchoose?.filter(
              (ite) => ite != userData?.companyname
            );
            if (oldemployeename?.length > 1) {
              let res = axios.put(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
                supervisorchoose: oldemployeename,
              });
            } else {
              let res = axios.delete(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
              });
            }
          });
        }
        if (lastProcessLog) {
          await axios.put(
            `${SERVICE.UPDATEANYLOG}/?logid=${lastProcessLog?._id}&logname=processlog`,
            {
              company: String(editDetails.company),
              branch: String(editDetails.branch),
              unit: String(editDetails.unit),
              team: String(editDetails.team),
              floor: String(editDetails.floor),
              area: String(editDetails.area),
              workstation:
                editDetails.workmode !== "Remote"
                  ? valueWorkStation.length === 0
                    ? primaryWorkStation
                    : [primaryWorkStation, ...valueWorkStation]
                  : [primaryWorkStation, ...valueWorkStation],
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
      console.log(err, "nwaoek");
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  console.log(isLastLog, userData.designation, gettingDesigGroup, newHierarchyData[0]?.designationgroup, getingOlddatas?.team, editDetails?.team, oldHierarchyData, newHierarchyData, 'getingOlddatas?.team !== loginNotAllot.team ')
  console.log(gettingDesigGroup, 'gettingDesigGroup')
  console.log(isLastLog && newHierarchyData[0]?.designationgroup !== gettingDesigGroup &&
    (newHierarchyData?.length > 0), 'gettingDesigGroup')
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
    await axios.delete(
      `${SERVICE.DELETEANYLOG}/?logid=${deleteionId?.id}&logname=boardingLog`,
      {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      }
    );
    await fetchAllUsersLimit();
    setPage(1);
    handleCloseDelete();
    setShowAlert(
      <>
        <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7AC767" }} />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>
          {"Deleted Successfully"}
        </p>
      </>
    );
    handleClickOpenerr();
  };

  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    setEditDetails({});
    setEditDetailsOld({});
  };

  const gridRef = useRef(null);
  const {
    isUserRoleCompare,
    isUserRoleAccess,
    isAssignBranch,
    allUsersData,
    allTeam,
  } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [boardinglogsUnit, setBoardinglogsUnit] = useState([]);
  const [items, setItems] = useState([]);
  const [unitlogcheck, setUnitlogcheck] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [copiedData, setCopiedData] = useState("");

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

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

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
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
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


  const [lastProcessLog, setLastProcessLog] = useState({});
  const fetchAllUsersLimit = async () => {
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${userID}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      // Step 2: Create a new array with necessary fields
      const newarray = res?.data?.suser?.boardingLog.map((item) => {
        let processvalue = ""
        let processid = ""
        res?.data?.suser?.processlog.forEach((data, index) => {
          if (item.company === data.company && item.branch === data.branch && item.unit === data.unit && item.team === data.team
            && item.startdate === data.date
          ) {
            processvalue = data.process;
            processid = data._id
          }
        })
        return {
          _id: item._id,
          unit: item.unit,
          processid: item.processid,
          username: res?.data?.suser?.companyname,
          startdate: item.startdate,
          time: item.time,
          branch: item.branch,
          team: item.team,
          company: item.company,
          floor: item.floor,
          area: item.area,
          workstation: item.workstation,
          process: item.processvalue,
          shifttype: item.shifttype,
          process: item.process,
          logeditedby: item?.logeditedby?.length > 0 ? item?.logeditedby : [],
        };
      });

      let lastProcess =
        res?.data?.suser?.processlog?.length > 0
          ? res?.data?.suser?.processlog[
          res?.data?.suser?.processlog?.length - 1
          ]
          : {};
      setGettingOldDatas(lastProcess);
      setUserData(res?.data?.suser);
      setLastProcessLog(lastProcess);

      setBoardinglogsUnit(newarray);
      setUnitlogcheck(true);
    } catch (err) {
      setUnitlogcheck(true);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    fetchAllUsersLimit();
    fetchProcess();
    fetchfloorNames();
    fetchWorkStation();
  }, []);

  // Excel
  const fileName = "Boarding Log List";
  // get particular columns for export excel

  // print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Boarding Log List",
    pageStyle: "print",
  });

  // pdf.....
  const columns = [
    { title: "Company ", field: "company" },
    { title: "Branch", field: "branch" },
    { title: "Unit", field: "unit" },
    { title: "Floor", field: "floor" },
    { title: "Area", field: "area" },
    { title: "Team", field: "team" },
    { title: "Workstation", field: "workstation" },
    { title: "Process", field: "process" },
    { title: "Shift Type", field: "shifttype" },
    { title: "Employee Name", field: "username" },
    { title: "From Date ", field: "startdate" },
    { title: "Time", field: "time" },
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
          company: row.company,
          username: row.username,
        }))
        : poardinglogsTeamArray.map((row) => ({
          ...row,
          serialNumber: serialNumberCounter++,
          company: row.company,
          username: row.username,
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

    doc.save("Boarding Log List.pdf");
  };
  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Boarding Log List.png");
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
      workstationexcel: item.workstation?.map((t, i) => `${i + 1 + ". "}` + t)
        .toString(),
      index,

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

  const columnDataTable = [
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 80,
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
      width: 150,
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
      width: 150,
      hide: !columnVisibility.team,
      headerClassName: "bold-header",
    },
    {
      field: "workstation",
      headerName: "Workstation",
      flex: 0,
      width: 150,
      hide: !columnVisibility.workstation,
      headerClassName: "bold-header",
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
      field: "shifttype",
      headerName: "Shift Type",
      flex: 0,
      width: 150,
      hide: !columnVisibility.shifttype,
      headerClassName: "bold-header",
    },
    {
      field: "username",
      headerName: "Employee Name",
      flex: 0,
      width: 200,
      hide: !columnVisibility.username,
      headerClassName: "bold-header",
    },
    {
      field: "startdate",
      headerName: "From Date",
      flex: 0,
      width: 150,
      hide: !columnVisibility.startdate,
      headerClassName: "bold-header",
    },
    {
      field: "time",
      headerName: "Time",
      flex: 0,
      width: 150,
      hide: !columnVisibility.time,
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
      renderCell: (params) => {
        return (
          <>
            {params?.row?.index === 0 ? (
              ""
            ) : (
              <Grid sx={{ display: "flex" }}>
                {isUserRoleCompare?.includes("eboardinglog") && (
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
                      <EditOutlinedIcon style={{ fontsize: "large" }} />
                    </Button>
                  </>
                )}
                {isUserRoleCompare?.includes("dboardinglog") &&
                  params?.row?.index !== items?.length - 1 && (
                    <>
                      <Button
                        size="small"
                        sx={userStyle.buttondelete}
                        onClick={(e) => {
                          handleOpenDelete();
                          setDeletionId(params.row);
                        }}
                      >
                        <DeleteOutlineOutlinedIcon
                          style={{ fontsize: "large" }}
                        />
                      </Button>
                    </>
                  )}
              </Grid>
            )}
            <Grid sx={{ display: "flex" }}>
              {isUserRoleCompare?.includes("vboardinglog") && (
                <>
                  <Button
                    size="small"
                    sx={userStyle.buttondelete}
                    onClick={(e) => {
                      handleOpenView();
                      setViewDetails(params.row);
                    }}
                  >
                    <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
                  </Button>
                </>
              )}
              {isUserRoleCompare?.includes("iboardinglog") &&
                params?.row?.logeditedby?.length > 0 && (
                  <>
                    <Button
                      size="small"
                      sx={userStyle.buttondelete}
                      onClick={(e) => {
                        handleOpeninfo();
                        setInfoDetails(params.row);
                      }}
                    >
                      <InfoOutlinedIcon style={{ fontsize: "large" }} />
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
    const formattedStartDate = isValidDateFormat(item.startdate)
      ? moment(item.startdate).format("DD-MM-YYYY")
      : item.startdate;
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      startdate: formattedStartDate,
      username: item.username,
      starttime: item.starttime,
      time: item.time,
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
      shifttype: item.shifttype,
      logeditedby: item?.logeditedby?.length > 0 ? item?.logeditedby : [],
      index: item?.index,
      processduration: "Full",
      processtype: "Primary",
      originalstartdate: item.startdate,
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
              // secondary={column.headerName }
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

  return (
    <Box>
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lboardinglog") && (
        <>
          <Box sx={{ border: "1px solid #8080801c", padding: "20px" }}>
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
                    sx={{ width: "77px" }}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                    <MenuItem value={boardinglogsUnit?.length}>All</MenuItem>
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
                          rowDataArray();
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
                          rowDataArray();
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
                          rowDataArray();
                        }}
                      >
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imageboardinglog") && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={handleCaptureImage}
                      >
                        {" "}
                        <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                        &ensp;Image&ensp;{" "}
                      </Button>
                    </>
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
            &ensp;
            <br />
            <br />
            {!unitlogcheck ? (
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
              <TableCell>SNo</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Floor</TableCell>
              <TableCell>Area</TableCell>
              <TableCell>Team</TableCell>
              <TableCell>Workstation</TableCell>
              <TableCell>Process</TableCell>
              <TableCell>Shift Type</TableCell>
              <TableCell>Employee Name</TableCell>
              <TableCell>From Date</TableCell>
              <TableCell>Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody align="left">
            {boardinglogsUnit &&
              boardinglogsUnit.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.company}</TableCell>
                  <TableCell>{row.branch}</TableCell>
                  <TableCell>{row.unit}</TableCell>
                  <TableCell>{row.floor}</TableCell>
                  <TableCell>{row.area}</TableCell>
                  <TableCell>{row.team}</TableCell>
                  <TableCell>{row.workstation}</TableCell>
                  <TableCell>{row.process}</TableCell>
                  <TableCell>{row.shifttype}</TableCell>
                  <TableCell>{row.username}</TableCell>
                  <TableCell>
                    {moment(row.startdate).format("DD-MM-YYYY")}
                  </TableCell>
                  <TableCell>{row.time}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

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
              rowDataArray();
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

      {/* VIEW */}
      <Dialog
        maxWidth="lg"
        open={openView}
        onClose={handleCloseView}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item md={12} sm={12} xs={12}>
              <Typography sx={userStyle.HeaderText}>
                View Boarding Log
              </Typography>
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
                <Typography variant="h6">Workstation</Typography>
                <Typography>{viewDetails?.workstation?.map((t, i) => t)
                  .join(", ")
                  .toString()}</Typography>
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
                  display: "flex",
                  justifyContent: "center",
                  gap: "15px",
                }}
              >
                <Button
                  variant="contained"
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
      <Dialog
        open={isEditOpen}
        onClose={handleCloseEdit}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="lg"
      >
        <Box sx={{ padding: "20px" }}>
          <>
            {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
            <Typography sx={userStyle.HeaderText}>Edit Boarding Log</Typography>
            <br></br>
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <Typography>Employee Name</Typography>
                <FormControl fullWidth size="small">
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="User Id"
                    value={editDetails.username}
                    readOnly
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={6}>
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
                      label: editDetails.company,
                      value: editDetails.company,
                    }}
                    onChange={(e) => {
                      setEditDetails({
                        ...editDetails,
                        company: e.value,
                        branch: "Please Select Branch",
                        unit: "Please Select Unit",
                        team: "Please Select Team",
                        process: "Please Select Process",
                        area: "Please Select Area",
                        floor: "Please Select Floor",
                        originalstartdate: "Please Select Start Date",
                        processduration: "Full",
                        area: "Please Select Area",
                        processtype: "Primary",
                        floor: "Please Select Floor",
                      });
                      setPrimaryWorkStation("Please Select Primary Work Station");
                      setSelectedOptionsWorkStation([]);
                    }}
                  />
                </FormControl>
              </Grid>

              <Grid item md={4} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Branch<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    options={isAssignBranch
                      ?.filter((comp) => editDetails.company === comp.company)
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
                      label: editDetails.branch,
                      value: editDetails.branch,
                    }}
                    onChange={(e) => {
                      setEditDetails({
                        ...editDetails,
                        branch: e.value,
                        unit: "Please Select Unit",
                        team: "Please Select Team",
                        process: "Please Select Process",
                        originalstartdate: "Please Select Start Date",
                        processduration: "Full",
                        processtype: "Primary",
                        floor: "Please Select Floor",
                        area: "Please Select Area",
                      });
                      setPrimaryWorkStation("Please Select Primary Work Station");
                      setSelectedOptionsWorkStation([]);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Unit<b style={{ color: "red" }}>*</b>{" "}
                  </Typography>
                  <Selects
                    options={isAssignBranch
                      ?.filter(
                        (comp) =>
                          editDetails.company === comp.company &&
                          editDetails.branch === comp.branch
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
                      label: editDetails.unit,
                      value: editDetails.unit,
                    }}
                    onChange={(e) => {
                      setEditDetails({
                        ...editDetails,
                        unit: e.value,
                        processduration: "Full",
                        processtype: "Primary",
                        team: "Please Select Team",
                        process: "Please Select Process",
                        originalstartdate: "Please Select Start Date",
                        floor: "Please Select Floor",
                        area: "Please Select Area",
                      });
                      setPrimaryWorkStation("Please Select Primary Work Station");
                      setSelectedOptionsWorkStation([]);
                    }}
                  />
                </FormControl>
              </Grid>

              <Grid item md={4} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Floor<b style={{ color: "red" }}>*</b></Typography>
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
                      label:
                        editDetails.floor !== ""
                          ? editDetails.floor
                          : "Please Select Floor",
                      value:
                        editDetails.floor !== ""
                          ? editDetails.floor
                          : "Please Select Floor",
                    }}
                    onChange={(e, i) => {
                      setEditDetails({ ...editDetails, floor: e.value, area: "Please Select Area", });
                      fetchareaNames(e.value);
                      setPrimaryWorkStation("Please Select Primary Work Station");
                      setSelectedOptionsWorkStation([]);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} sm={12} xs={12}>
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
                        editDetails?.area === "" || editDetails?.area == undefined
                          ? "Please Select Area"
                          : editDetails?.area,
                      value:
                        editDetails?.area === "" || editDetails?.area == undefined
                          ? "Please Select Area"
                          : editDetails?.area,
                    }}
                    onChange={(e) => {
                      setEditDetails({ ...editDetails, area: e.value });
                      setPrimaryWorkStation("Please Select Primary Work Station");
                      setSelectedOptionsWorkStation([]);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={6}>
                <Typography>
                  Team<b style={{ color: "red" }}>*</b>
                </Typography>
                <FormControl fullWidth>
                  <Selects
                    options={allTeam
                      ?.filter(
                        (comp) =>
                          editDetails.company === comp.company &&
                          editDetails.branch === comp.branch &&
                          editDetails.unit === comp.unit
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
                      label: editDetails.team,
                      value: editDetails.team,
                    }}
                    onChange={(e) => {
                      setEditDetails({
                        ...editDetails,
                        team: e.value,
                        process: "Please Select Process",
                        processduration: "Full",
                        processtype: "Primary",
                        originalstartdate: "Please Select Start Date",
                      });
                      checkHierarchyName(e.value, "Team");
                    }}
                  />
                </FormControl>
              </Grid>

              {editDetails.workmode !== "Remote" ? (
                <>
                  {" "}
                  <Grid item md={4} sm={12} xs={12}>
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
                  <Grid item md={4} sm={12} xs={12}>
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
                  <Grid item md={4} sm={12} xs={12}>
                    <FormControl size="small" fullWidth>
                      <Typography>If Office</Typography>
                    </FormControl>
                    <Grid>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={editDetails.ifoffice === true}
                            />
                          }
                          onChange={(e) => {
                            setEditDetails({
                              ...editDetails,
                              ifoffice: !editDetails.ifoffice,
                            });
                            // setPrimaryWorkStation("Please Select Primary Work Station")
                            setPrimaryWorkStationInput("");
                          }}
                          label="Work Station Other"
                        />
                      </FormGroup>
                    </Grid>
                  </Grid>

                  {editDetails.ifoffice === true && (
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
                  )}
                </>
              ) : (
                <>
                  <Grid item md={4} sm={12} xs={12}>
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

                  <Grid item md={4} sm={12} xs={12}>
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

              <Grid item md={4} xs={12} sm={6}>
                <Typography>
                  Process<b style={{ color: "red" }}>*</b>
                </Typography>
                <FormControl fullWidth>
                  <Selects
                    options={process}
                    styles={colourStyles}
                    value={{
                      label: editDetails.process,
                      value: editDetails.process,
                    }}
                    onChange={(e) => {
                      setEditDetails({
                        ...editDetails,
                        process: e.value,
                        processduration: "Full",
                        processtype: "Primary",
                        originalstartdate: "Please Select Start Date",
                      });
                      fetchDesignationMonthChange(
                        e.value,
                        userData.doj,
                        userData.department
                      );
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={6}>
                <Typography>
                  Process type<b style={{ color: "red" }}>*</b>
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
                  Process Duration<b style={{ color: "red" }}>*</b>
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
                  Start Date <b style={{ color: "red" }}>*</b>
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
                  Duration<b style={{ color: "red" }}>*</b>
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
                <Button
                  variant="contained"
                  style={{
                    padding: "7px 13px",
                    color: "white",
                    background: "rgb(25, 118, 210)",
                  }}
                  onClick={editSubmit}
                >
                  Update
                </Button>
              </Grid>
              <Grid item md={6} xs={6} sm={6}>
                <Button sx={userStyle.btncancel} onClick={handleCloseEdit}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </>
        </Box>
      </Dialog>

      {/* INFO */}
      <Dialog
        open={openInfo}
        onClose={handleCloseinfo}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              Boarding Log Edited By
            </Typography>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Edited by</Typography>
                  <br />
                  <Table>
                    <TableHead>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {"SNO"}.
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {" "}
                        {"UserName"}
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {" "}
                        {"Date"}
                      </StyledTableCell>
                    </TableHead>
                    <TableBody>
                      {infoDetails?.logeditedby?.map((item, i) => (
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
                            {item.username}
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {" "}
                            {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}
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
              <Button
                variant="contained"
                onClick={handleCloseinfo}
                sx={{ marginLeft: "15px" }}
              >
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

      {/* Delete  DIALOG */}
      <Dialog
        open={isDeleteOpen}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
        >
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "80px", color: "orange" }}
          />
          <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
            Are you sure?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} sx={userStyle.btncancel}>
            Cancel
          </Button>
          <Button
            autoFocus
            variant="contained"
            color="error"
            onClick={(e) => handleDeleteLog(deleteionId)}
          >
            {" "}
            OK{" "}
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

export default BoardingLogEdit;