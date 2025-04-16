import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  TableBody,
  InputLabel,
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
import { FaPlus } from "react-icons/fa";
import { handleApiError } from "../../components/Errorhandling";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { userStyle } from "../../pageStyle";
import { FaPrint, FaFilePdf, FaEdit, FaFileCsv, FaFileExcel } from "react-icons/fa";
import { MultiSelect } from "react-multi-select-component";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import StyledDataGrid from "../../components/TableStyle";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import Selects from "react-select";
import { AiOutlineClose } from "react-icons/ai";
import { MdOutlineDone } from "react-icons/md";
import LoadingButton from "@mui/lab/LoadingButton";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

function TaskScheduleGrouping() {
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [taskGrouping, setTaskGrouping] = useState({
    category: "Please Select Category",
    subcategory: "Please Select SubCategory",
    schedule: "Please Select Schedule",
    frequency: "Please Select Frequency",
    duration: "00:10",
    breakupcount: "1",
    hour: "",
    min: "",
    timetype: "",
    monthdate: "",
    date: "",
    annumonth: "",
    annuday: "",
  });
  const [taskGroupingEdit, setTaskGroupingEdit] = useState({
    category: "Please Select Category",
    subcategory: "Please Select SubCategory",
    schedule: "Please Select Schedule",
    frequency: "Please Select Frequency",
    duration: "00:10",
    breakupcount: "1",
    hour: "",
    min: "",
    timetype: "",
    monthdate: "",
    date: "",
    annumonth: "",
    annuday: ""
  });

  const [btnLoad, setBtnLoad] = useState(false)

  const [editingIndexcheck, setEditingIndexcheck] = useState(-1);
  const [editingIndexcheckEdit, setEditingIndexcheckEdit] = useState(-1);
  const [taskGroupingArray, setTaskGroupingArray] = useState([]);
  const [taskGroupingArrayEdit, setTaskGroupingArrayEdit] = useState([]);

  const [categoryOption, setCategoryOption] = useState([]);
  const [subCategoryOption, setSubCategoryOption] = useState([]);
  const [filteredSubCategory, setFilteredSubCategory] = useState([]);
  const [filteredSubCategoryEdit, setFilteredSubCategoryEdit] = useState([]);
  const [addReqTodo, setAddReqTodo] = useState([]);
  const [isTodoEdit, setIsTodoEdit] = useState(
    Array(addReqTodo.length).fill(false)
  );
  const [todoSubmit, setTodoSubmit] = useState(false);
  const [selectedWeeklyOptions, setSelectedWeeklyOptions] = useState([]);
  const [addReqTodoEdit, setAddReqTodoEdit] = useState([]);
  const [isTodoEditPage, setIsTodoEditPage] = useState(
    Array(addReqTodoEdit.length).fill(false)
  );

  const [todoSubmitEdit, setTodoSubmitEdit] = useState(false);
  const [selectedWeeklyOptionsEdit, setSelectedWeeklyOptionsEdit] = useState([]);
  let [valueWeekly, setValueWeekly] = useState("");
  let [valueWeeklyEdit, setValueWeeklyEdit] = useState("");
  const [hourTodo, setHourTodo] = useState([]);
  const [minutesTodo, setMinutesTodo] = useState([]);
  const [timeTypeTodo, setTimeTypeTodo] = useState([]);
  const [hourTodoEdit, setHourTodoEdit] = useState([]);
  const [minutesTodoEdit, setMinutesTodoEdit] = useState([]);
  const [timeTypeTodoEdit, setTimeTypeTodoEdit] = useState([]);
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
  const handleExportXL = (isfilter) => {
    if (isfilter === "filtered") {
      exportToCSV(
        filteredData?.map((item, index) => ({
          "Sno": index + 1,
          Category: item.category,
          Subcategory: item.subcategory,
          Frequency: item.frequency,
          Schedule: item.schedule,
          Time: item?.timetodo,
          ["Days"]: item?.weekdays,
          ['Month Date']: item.monthdate,
          Annually: item?.annumonth,
          Duration: item.duration,
          ['Breakup Count']: item.breakupcount,
          Breakup: item.breakup,
          Required: item?.required,
        })),
        fileName,
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        items.map((item, index) => ({
          "Sno": index + 1,
          Category: item.category,
          Subcategory: item.subcategory,
          Frequency: item.frequency,
          Schedule: item.schedule,
          Time: item?.timetodo,
          ["Days"]: item?.weekdays,
          ['Month Date']: item.monthdate,
          Annually: item?.annumonth,
          Duration: item.duration,
          ['Breakup Count']: item.breakupcount,
          Breakup: item.breakup,
          Required: item?.required,
        })),
        fileName,
      );

    }

    setIsFilterOpen(false)
  };



  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();
    // Initialize serial number counter
    let serialNumberCounter = 1;

    // Modify columns to include serial number column
    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" }, // Serial number column
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial = isfilter === "filtered" ?
      filteredData.map(item => ({
        serialNumber: serialNumberCounter++,
        category: item.category,
        subcategory: item.subcategory,
        frequency: item.frequency,
        schedule: item.schedule,
        timetodo: item?.timetodo,
        weekdays: item?.weekdays,
        monthdate: item.monthdate,
        annumonth: item?.annumonth,
        duration: item.duration,
        breakupcount: item.breakupcount,
        breakup: item.breakup,
        required: item?.required,
      })) :
      items?.map(item => ({
        serialNumber: serialNumberCounter++,
        category: item.category,
        subcategory: item.subcategory,
        frequency: item.frequency,
        schedule: item.schedule,
        timetodo: item?.timetodo,
        weekdays: item?.weekdays,
        monthdate: item.monthdate,
        annumonth: item?.annumonth,
        duration: item.duration,
        breakupcount: item.breakupcount,
        breakup: item.breakup,
        required: item?.required,
      }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      styles: {
        fontSize: 5,
      },
      columns: columnsWithSerial,
      body: dataWithSerial,
    });

    doc.save("TaskScheduleGrouping.pdf");
  };


  const handleUpdateTodocheck = () => {
    const newTodoscheck = [...addReqTodo];
    newTodoscheck[editingIndexcheck].hour = hourTodo;
    newTodoscheck[editingIndexcheck].min = minutesTodo;
    newTodoscheck[editingIndexcheck].timetype = timeTypeTodo;

    setAddReqTodo(newTodoscheck);
    setEditingIndexcheck(-1);
    setTodoSubmit(false)

  };
  const handleEditTodocheck = (index) => {
    setEditingIndexcheck(index);
    setHourTodo(addReqTodo[index].hour);
    setMinutesTodo(addReqTodo[index].min);
    setTimeTypeTodo(addReqTodo[index].timetype);
    setTodoSubmit(true)
  };


  const handleUpdateTodocheckEdit = () => {
    const newTodoscheck = [...addReqTodoEdit];
    newTodoscheck[editingIndexcheckEdit].hour = hourTodoEdit;
    newTodoscheck[editingIndexcheckEdit].min = minutesTodoEdit;
    newTodoscheck[editingIndexcheckEdit].timetype = timeTypeTodoEdit;

    setAddReqTodoEdit(newTodoscheck);
    setEditingIndexcheckEdit(-1);
    setTodoSubmitEdit(false)


  };
  const handleEditTodocheckEdit = (index) => {
    setEditingIndexcheckEdit(index);
    setHourTodoEdit(addReqTodoEdit[index].hour);
    setMinutesTodoEdit(addReqTodoEdit[index].min);
    setTimeTypeTodoEdit(addReqTodoEdit[index].timetype);
    setTodoSubmitEdit(true)
  };

  const [frequencyOption, setFrequencyOption] = useState([
    { label: "Daily", value: "Daily" },
    { label: "Day Wise", value: "Day Wise" },
    { label: "Date Wise", value: "Date Wise" },
    { label: "Weekly", value: "Weekly" },
    { label: "Monthly", value: "Monthly" },
    { label: "Annually", value: "Annually" }

  ]);
  const [hrsOption, setHrsOption] = useState([]);
  const [minsOption, setMinsOption] = useState([]);
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("10");
  const [hoursEdit, setHoursEdit] = useState("00");
  const [minutesEdit, setMinutesEdit] = useState("10");
  const [breakuphours, setbreakupHours] = useState("10");
  const [breakuphoursEdit, setbreakupHoursEdit] = useState("10");

  const { isUserRoleCompare, isUserRoleAccess } = useContext(
    UserRoleAccessContext
  );
  const { auth } = useContext(AuthContext);
  const [loader, setLoader] = useState(false);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [openview, setOpenview] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTaskGrouping, setDeleteTaskGrouping] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    category: true,
    subcategory: true,
    frequency: true,
    schedule: true,
    duration: true,
    breakup: true,
    monthdate: true,
    breakupcount: true,
    required: true,
    timetodo: true,
    weekdays: true,
    annumonth: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  //useEffect
  useEffect(() => {
    addSerialNumber();
  }, [taskGroupingArray]);


  useEffect(() => {
    fetchTaskGroupingAll();
  }, [isEditOpen]);
  useEffect(() => {
    fetchTaskGrouping();
  }, []);

  useEffect(() => {
    fetchCategory();
    fetchSubCategory();
    // fetchFrequency();
    generateHrsOptions();
    generateMinsOptions();
  }, []);
  useEffect(() => {
    const filteredSubCategory = subCategoryOption?.filter(u =>
      u.category === taskGrouping.category).map(u => (
        {
          ...u,
          label: u.subcategoryname,
          value: u.subcategoryname
        }
      ))

    setFilteredSubCategory(filteredSubCategory);
  }, [taskGrouping.category]);

  useEffect(() => {
    const filteredSubCategoryedit = subCategoryOption?.filter(ue =>
      ue.category === taskGroupingEdit.category
    ).map(ue => (
      {
        ...ue,
        label: ue.subcategoryname,
        value: ue.subcategoryname
      }
    ))

    setFilteredSubCategoryEdit(filteredSubCategoryedit);
  }, [taskGroupingEdit.category]);


  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const scheduleOption = [{ label: "Fixed", value: "Fixed" }, { label: "Any Time", value: "Any Time" }]
  const requiredOption = [{ label: "Photo", value: "Photo" }, { label: "Documents", value: "Documents" }, { label: "Screenshot", value: "Screenshot" }, { label: "Email", value: "Email" }]
  // sevendays
  const weekdays = [
    { label: "Sunday", value: "Sunday" },
    { label: "Monday", value: "Monday" },
    { label: "Tuesday", value: "Tuesday" },
    { label: "Wednesday", value: "Wednesday" },
    { label: "Thursday", value: "Thursday" },
    { label: "Friday", value: "Friday" },
    { label: "Saturday", value: "Saturday" },

  ];
  const [selectedRequiredOptionsCate, setSelectedRequiredOptionsCate] = useState([]);
  const [requiredValueCate, setRequiredValueCate] = useState("");
  const [selectedRequiredOptionsCateEdit, setSelectedRequiredOptionsCateEdit] = useState([]);
  const [requiredValueCateEdit, setRequiredValueCateEdit] = useState("");
  const handleRequiredChange = (options) => {
    setRequiredValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedRequiredOptionsCate(options);
  };
  const customValueRendererRequired = (requiredValueCate, _employeename) => {
    return requiredValueCate.length ? requiredValueCate.map(({ label }) => label).join(", ") : "Please Select Required";
  };
  const handleRequiredChangeEdit = (options) => {
    setRequiredValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedRequiredOptionsCateEdit(options);

  };
  const customValueRendererRequiredEdit = (requiredValueCateEdit, _employeename) => {
    return requiredValueCateEdit.length ? requiredValueCateEdit.map(({ label }) => label).join(", ") : "Please Select Required";
  };

  const [concReqs, setConcReqs] = useState("");
  const concordinateParticipants = (fileshare) => {
    const require = fileshare.required;
    const concatenatedDepts = require.join(",");
    setConcReqs(concatenatedDepts);
  };

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

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
    setBtnLoad(false)
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
  // page refersh reload
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


  const fetchCategory = async () => {
    try {
      let res_category = await axios.get(SERVICE.TASKCATEGORY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const categoryall = [
        ...res_category?.data?.taskcategorys.map((d) => ({
          ...d,
          label: d.categoryname,
          value: d.categoryname,
        })),
      ];

      setCategoryOption(categoryall);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const fetchSubCategory = async () => {
    try {
      let res_subcategory = await axios.get(SERVICE.TASKSUBCATEGORY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSubCategoryOption(res_subcategory?.data?.tasksubcategorys);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //set function to get particular row
  const rowData = async (id) => {
    try {
      let res = await axios.get(`${SERVICE.SINGLE_TASKSCHEDULEGROUPING}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteTaskGrouping(res?.data?.staskschedulegrouping);
      handleClickOpen();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  // Alert delete popup
  let proid = deleteTaskGrouping._id;
  const delProcess = async () => {
    try {
      await axios.delete(`${SERVICE.SINGLE_TASKSCHEDULEGROUPING}/${proid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      await fetchTaskGrouping();
      handleCloseMod();
      setSelectedRows([]);
      setPage(1);
      setShowAlert(
        <>
          {" "}
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Deleted Successfully👍"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };







  const addTodo = () => {
    const result = {
      hour: taskGrouping?.hour,
      min: taskGrouping?.min,
      timetype: taskGrouping?.timetype,

    }
    if (taskGrouping?.hour === "" || taskGrouping?.min === "" || taskGrouping?.timetype === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Hour, Minutes and Type"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (addReqTodo?.some(data => data?.hour === taskGrouping?.hour && data?.min === taskGrouping?.min && data?.timetype === taskGrouping?.timetype)) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Already Added"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      setAddReqTodo((prevTodos) => [...prevTodos, result]);
      setIsTodoEdit(Array(addReqTodo.length).fill(false));
      setEditingIndexcheck(-1)
      setTodoSubmit(false)
    }


  };

  const deleteTodo = (index) => {
    const updatedTodos = [...addReqTodo];
    updatedTodos.splice(index, 1);
    setAddReqTodo(updatedTodos);
    setEditingIndexcheck(-1)
    setTodoSubmit(false)
  };


  const handleWeeklyChange = (options) => {
    setValueWeekly(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedWeeklyOptions(options);
  };

  const customValueRendererCate = (valueCate, _days) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Days";
  };

  const addTodoEdit = () => {
    const result = {
      hour: taskGroupingEdit?.hour,
      min: taskGroupingEdit?.min,
      timetype: taskGroupingEdit?.timetype,

    }

    if ((taskGroupingEdit?.hour === "" || taskGroupingEdit?.hour === undefined) || (taskGroupingEdit?.min === "" || taskGroupingEdit?.min === undefined) || (taskGroupingEdit?.timetype === "" || taskGroupingEdit?.timetype === undefined)) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Hour, Minutes and Type"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (addReqTodoEdit?.some(data => data?.hour === taskGroupingEdit?.hour && data?.min === taskGroupingEdit?.min && data?.timetype === taskGroupingEdit?.timetype)) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Already Added"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      setAddReqTodoEdit((prevTodos) => [...prevTodos, result]);
      setIsTodoEditPage(Array(addReqTodoEdit.length).fill(false));
      setEditingIndexcheckEdit(-1)
      setTodoSubmitEdit(false)
    }


  };

  const deleteTodoEdit = (index) => {
    const updatedTodos = [...addReqTodoEdit];
    updatedTodos.splice(index, 1);
    setAddReqTodoEdit(updatedTodos);
    setEditingIndexcheckEdit(-1)
    setTodoSubmitEdit(false)
  };


  const handleWeeklyChangeEdit = (options) => {
    setValueWeeklyEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedWeeklyOptionsEdit(options);
  };

  const customValueRendererCateEdit = (valueCate, _days) => {
    return valueCate?.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Days";
  };



  //add function
  const sendRequest = async (data) => {
    setBtnLoad(true)
    try {
      let brandCreate = await axios.post(SERVICE.CREATE_TASKSCHEDULEGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        category: String(taskGrouping.category),
        subcategory: String(taskGrouping.subcategory),
        timetodo: (taskGrouping.schedule === "Fixed") ? data : [],
        monthdate: ((taskGrouping.frequency === "Monthly" || taskGrouping.frequency === "Date Wise")) ? taskGrouping.monthdate : "",
        weekdays: ((taskGrouping.frequency === "Weekly" || taskGrouping.frequency === "Day Wise")) ? valueWeekly : [],
        annumonth: ((taskGrouping.frequency === "Annually")) ? taskGrouping.annumonth : "",
        annuday: ((taskGrouping.frequency === "Annually")) ? taskGrouping.annuday : "",
        schedule: String(taskGrouping.schedule),
        frequency: String(taskGrouping.frequency),
        duration: String(taskGrouping.duration),
        breakupcount: String(taskGrouping.breakupcount),
        breakup: breakuphours,
        required: [...requiredValueCate],
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      setTaskGrouping(brandCreate.data);
      await fetchTaskGrouping();
      setTaskGrouping({
        ...taskGrouping, hour: "",
        min: "",
        timetype: "",
        monthdate: "",
        date: "",
        breakupcount: "1",
        annumonth: "",
        annuday: "",
        duration: "00:10",
      })
      setbreakupHours("10")
      setHours("00")
      setMinutes("10")
      setAddReqTodo([])
      setValueWeekly([])
      setSelectedWeeklyOptions([])
      setShowAlert(
        <>
          {" "}
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Added Successfully👍"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
      setBtnLoad(false)
    } catch (err) { setBtnLoad(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    let reqopt = selectedRequiredOptionsCate.map((item) => item.value);
    const isNameMatch = taskGrouping.schedule === "Fixed" ? taskGroupingArray?.some(
      (item) => {
        const combination = `${item?.timetodo[0]?.hour}-${item?.timetodo[0]?.min}-${item?.timetodo[0]?.timetype}`;
        return item.category === taskGrouping.category &&
          item.subcategory === taskGrouping.subcategory &&
          item.schedule === taskGrouping.schedule &&
          item.frequency === taskGrouping.frequency &&
          addReqTodo?.some((todo) => {
            const combinationtodo = `${todo.hour}-${todo.min}-${todo.timetype}`;
            return combination === combinationtodo
          })
      }
    ) : taskGroupingArray?.some(
      (item) => {
        return item.category === taskGrouping.category &&
          item.subcategory === taskGrouping.subcategory &&
          item.schedule === taskGrouping.schedule &&
          item.frequency === taskGrouping.frequency
      }
    );
    const seenCombinations = new Set();

    const hasDuplicate = addReqTodo.some((todo) => {
      const combination = `${todo.hour}-${todo.min}-${todo.timetype}`;
      if (seenCombinations.has(combination)) {
        return true; // Duplicate found
      } else {
        seenCombinations.add(combination);
        return false; // No duplicate yet
      }
    });


    if (taskGrouping.category === "Please Select Category") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Category"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (taskGrouping.subcategory === "Please Select SubCategory") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select SubCategory"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (taskGrouping.frequency === "Please Select Frequency") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Frequency"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (taskGrouping.schedule === "Please Select Schedule") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Schedule"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if ((taskGrouping.schedule === "Fixed") && addReqTodo?.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Atleast Add One Data in Time todo"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if ((taskGrouping.schedule === "Fixed") && todoSubmit === true) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Update the todo and Submit "}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (((taskGrouping.frequency === "Monthly" || taskGrouping.frequency === "Date Wise")) && taskGrouping.monthdate === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {`Please Select ${taskGrouping.frequency} Date`}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (((taskGrouping.frequency === "Weekly" || taskGrouping.frequency === "Day Wise")) && selectedWeeklyOptions?.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Days"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (((taskGrouping.frequency === "Annually")) && taskGrouping.annumonth === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Month"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (((taskGrouping.frequency === "Annually")) && taskGrouping.annuday === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Day"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (taskGrouping?.duration === undefined || taskGrouping?.duration === "00:00" || taskGrouping?.duration?.includes("Mins")) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Select Duration"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    }
    else if (taskGrouping.breakupcount === "") {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Enter Breakup count"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    }
    else if (isNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Task Schedule Grouping already exists!"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if ((taskGrouping.schedule === "Fixed") && addReqTodo?.length > 0 && hasDuplicate) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Task Timing Has Same Values"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else {

      if (taskGrouping.schedule === "Fixed") {
        addReqTodo?.map(data => {
          sendRequest(data);
        })
      } else {
        sendRequest()
      }

    }
  };



  const handleclear = (e) => {
    e.preventDefault();
    setTaskGrouping({
      category: "Please Select Category",
      subcategory: "Please Select SubCategory",
      schedule: "Please Select Schedule",
      frequency: "Please Select Frequency",
      duration: "00:10",
      breakupcount: "1",
      hour: "",
      min: "",
      timetype: "",
      monthdate: "",
      date: "",
      annumonth: "",
      annuday: "",
    });
    setSelectedWeeklyOptions([])
    setValueWeekly([])
    setAddReqTodo([])
    setHours("00");
    setMinutes("10");
    setbreakupHours("10");
    setFilteredSubCategory([]);
    setSelectedRequiredOptionsCate([]);
    setRequiredValueCate("");
    setShowAlert(
      <>
        {" "}
        <CheckCircleOutlineIcon
          sx={{ fontSize: "100px", color: "orange" }}
        />{" "}
        <p style={{ fontSize: "20px", fontWeight: 900 }}>
          {" "}
          {"Cleared Successfully👍"}{" "}
        </p>{" "}
      </>
    );
    handleClickOpenerr();
  };
  //Edit model...
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
  };
  //get single row to edit....
  const getCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.SINGLE_TASKSCHEDULEGROUPING}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTaskGroupingEdit(res?.data?.staskschedulegrouping);
      const [hourscal, minutescal] = res?.data?.staskschedulegrouping.duration.split(":");
      setHoursEdit(hourscal);
      setMinutesEdit(minutescal);
      setRequiredValueCateEdit(res?.data?.staskschedulegrouping?.required);
      setbreakupHoursEdit(res?.data?.staskschedulegrouping?.breakup)
      setSelectedRequiredOptionsCateEdit([...res?.data?.staskschedulegrouping?.required.map((t) => ({ ...t, label: t, value: t }))]);
      setAddReqTodoEdit(res?.data?.staskschedulegrouping?.timetodo)
      const answerWeek = res?.data?.staskschedulegrouping?.weekdays?.length > 0 ?
        res?.data?.staskschedulegrouping?.weekdays?.map((t) => ({
          ...t,
          label: t,
          value: t,
        })) : []
      setValueWeeklyEdit(res?.data?.staskschedulegrouping?.weekdays)
      setSelectedWeeklyOptionsEdit(answerWeek)
      handleClickOpenEdit();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // get single row to view....

  const getviewCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.SINGLE_TASKSCHEDULEGROUPING}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTaskGroupingEdit(res?.data?.staskschedulegrouping);
      concordinateParticipants(res?.data?.staskschedulegrouping);
      handleClickOpenview();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // get single row to view....

  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.SINGLE_TASKSCHEDULEGROUPING}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTaskGroupingEdit(res?.data?.staskschedulegrouping);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  let updateby = taskGroupingEdit.updatedby;
  let addedby = taskGroupingEdit.addedby;
  let taskgroupingId = taskGroupingEdit._id;

  //editing the single data...

  const sendEditRequest = async () => {
    try {
      let res = await axios.put(
        `${SERVICE.SINGLE_TASKSCHEDULEGROUPING}/${taskgroupingId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          category: String(taskGroupingEdit.category),
          subcategory: String(taskGroupingEdit.subcategory),
          schedule: String(taskGroupingEdit.schedule),
          timetodo: (taskGroupingEdit.schedule === "Fixed") ? addReqTodoEdit : [],
          monthdate: ((taskGroupingEdit.frequency === "Monthly" || taskGroupingEdit.frequency === "Date Wise")) ? taskGroupingEdit.monthdate : "",
          weekdays: ((taskGroupingEdit.frequency === "Weekly" || taskGroupingEdit.frequency === "Day Wise")) ? valueWeeklyEdit : [],
          annumonth: ((taskGroupingEdit.frequency === "Annually")) ? taskGroupingEdit.annumonth : "",
          annuday: ((taskGroupingEdit.frequency === "Annually")) ? taskGroupingEdit.annuday : "",
          frequency: String(taskGroupingEdit.frequency),
          duration: String(taskGroupingEdit.duration),
          breakupcount: String(taskGroupingEdit.breakupcount),
          breakup: breakuphoursEdit,
          required: [...requiredValueCateEdit],
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      await fetchTaskGrouping();
      await fetchTaskGroupingAll();
      handleCloseModEdit();
      setShowAlert(
        <>
          {" "}
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Updated Successfully👍"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const editSubmit = (e) => {
    e.preventDefault();
    let reqtopt = selectedRequiredOptionsCateEdit.map((item) => item.value);

    const isNameMatch = taskGroupingEdit.schedule === "Fixed" ? taskGroupingArrayEdit?.some(
      (item) => {
        const combination = `${item?.timetodo[0]?.hour}-${item?.timetodo[0]?.min}-${item?.timetodo[0]?.timetype}`;
        return item.category === taskGroupingEdit.category &&
          item.subcategory === taskGroupingEdit.subcategory &&
          item.schedule === taskGroupingEdit.schedule &&
          item.frequency === taskGroupingEdit.frequency &&
          addReqTodoEdit?.some((todo) => {
            const combinationtodo = `${todo.hour}-${todo.min}-${todo.timetype}`;
            return combination === combinationtodo
          })
      }
    ) : taskGroupingArrayEdit?.some(
      (item) => {
        return item.category === taskGroupingEdit.category &&
          item.subcategory === taskGroupingEdit.subcategory &&
          item.schedule === taskGroupingEdit.schedule &&
          item.frequency === taskGroupingEdit.frequency
      }
    );


    const seenCombinations = new Set();
    const hasDuplicate = addReqTodoEdit.some((todo) => {
      const combination = `${todo.hour}-${todo.min}-${todo.timetype}`;
      if (seenCombinations.has(combination)) {
        return true; // Duplicate found
      } else {
        seenCombinations.add(combination);
        return false; // No duplicate yet
      }
    });



    if (taskGroupingEdit.category === "Please Select Category") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Category"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (taskGroupingEdit.subcategory === "Please Select SubCategory") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select SubCategory"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (taskGroupingEdit.frequency === "Please Select Frequency") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Frequency"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (taskGroupingEdit.schedule === "Please Select Schedule") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Schedule"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if ((taskGroupingEdit.schedule === "Fixed") && addReqTodoEdit?.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Atleast Add One Data in Time todo"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if ((taskGroupingEdit.schedule === "Fixed") && todoSubmitEdit === true) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Update the todo and Submit "}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (((taskGroupingEdit.frequency === "Monthly") || taskGroupingEdit?.frequency === "Date Wise") && taskGroupingEdit.monthdate === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {`Please Select ${taskGroupingEdit.frequency} Date`}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (((taskGroupingEdit.frequency === "Weekly" || taskGroupingEdit.frequency === "Day Wise")) && selectedWeeklyOptionsEdit?.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Days"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (((taskGroupingEdit.frequency === "Annually")) && taskGroupingEdit.annumonth === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Month"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (((taskGroupingEdit.frequency === "Annually")) && taskGroupingEdit.annuday === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Day"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (taskGroupingEdit?.duration === undefined || taskGroupingEdit.duration === "00:00" || taskGroupingEdit.duration.includes("Mins")) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Select Duration"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    }
    else if (taskGroupingEdit.breakupcount === "") {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Enter Breakup count"} </p>{" "}
        </>
      );
      handleClickOpenerr();
    }

    else if (isNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Task Schedule Grouping already exists!"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if ((taskGroupingEdit.schedule === "Fixed") && addReqTodoEdit?.length > 0 && hasDuplicate) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Task Timing Has Same Values"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else {
      sendEditRequest();
    }
  };

  //get all Task Schedule Grouping.

  const fetchTaskGrouping = async () => {
    try {
      let res_freq = await axios.get(SERVICE.ALL_TASKSCHEDULEGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setLoader(true);
      setTaskGroupingArray(res_freq?.data?.taskschedulegrouping);
    } catch (err) { setLoader(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const bulkdeletefunction = async () => {
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.SINGLE_TASKSCHEDULEGROUPING}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });
      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);

      await fetchTaskGrouping();
      setShowAlert(
        <>
          {" "}
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Deleted Successfully👍"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };



  //get all Task Schedule Grouping.

  const fetchTaskGroupingAll = async () => {
    try {
      let res_freq = await axios.get(SERVICE.ALL_TASKSCHEDULEGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTaskGroupingArrayEdit(
        res_freq?.data?.taskschedulegrouping.filter(
          (item) => item._id !== taskGroupingEdit._id
        ));
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "TaskScheduleGrouping.png");
        });
      });
    }
  };
  // pdf.....
  const columns = [
    { title: "Category", field: "category" },
    { title: "SubCategory", field: "subcategory" },
    { title: "Frequency", field: "frequency" },
    { title: "Schedule", field: "schedule" },
    { title: "Time", field: "timetodo" },
    { title: "Days", field: "weekdays" },
    { title: "MonthDate", field: "monthdate" },
    { title: "Annually", field: "annumonth" },
    { title: "Duration", field: "duration" },
    { title: "Breakup Count", field: "breakupcount" },
    { title: "Breakup", field: "breakup" },
    { title: "Required", field: "required" },
  ];
  //  pdf download functionality  
  // Excel
  const fileName = "TaskScheduleGrouping";
  // get particular columns for export excel


  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "TaskScheduleGrouping",
    pageStyle: "print",
  });

  //serial no for listing items
  const addSerialNumber = () => {
    const itemsWithSerialNumber = taskGroupingArray?.map((item, index) => ({
      // ...item,
      serialNumber: index + 1,
      id: item._id,
      category: item.category,
      subcategory: item.subcategory,
      schedule: item.schedule,
      duration: item.duration,
      breakup: item.breakup,
      breakupcount: item.breakupcount,
      breakup: item.breakup,
      frequency: item.frequency,
      required: item?.required.join(","),
      timetodo: item?.timetodo?.length > 0 ? item?.timetodo?.map((t, i) => `${i + 1 + ". "}` + `${t?.hour}:${t?.min} ${t?.timetype}`).toString() : "",
      weekdays: item?.weekdays?.length > 0 ? item?.weekdays?.map((t, i) => `${i + 1 + ". "}` + t).toString() : "",
      annumonth: item?.frequency === "Annually" ? `${item?.annumonth} month ${item?.annuday} days` : "",
      monthdate: item?.monthdate,
    }));
    setItems(itemsWithSerialNumber);
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


  // Split the search query into individual terms
  const searchTerms = searchQuery.toLowerCase().split(" ");

  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
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
      headerName: "Checkbox",
      headerStyle: {
        fontWeight: "bold", // Apply the font-weight style to make the header text bold
        // Add any other CSS styles as needed
      },
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
      field: "category",
      headerName: "Category",
      flex: 0,
      width: 150,
      hide: !columnVisibility.category,
      headerClassName: "bold-header",
    },
    {
      field: "subcategory",
      headerName: "SubCategory",
      flex: 0,
      width: 150,
      hide: !columnVisibility.subcategory,
      headerClassName: "bold-header",
    },
    {
      field: "frequency",
      headerName: "Frequency",
      flex: 0,
      width: 150,
      hide: !columnVisibility.frequency,
      headerClassName: "bold-header",
    },
    {
      field: "schedule",
      headerName: "Schedule",
      flex: 0,
      width: 150,
      hide: !columnVisibility.schedule,
      headerClassName: "bold-header",
    },

    {
      field: "timetodo",
      headerName: "Time",
      flex: 0,
      width: 150,
      hide: !columnVisibility.timetodo,
      headerClassName: "bold-header",
    },
    {
      field: "weekdays",
      headerName: "Days",
      flex: 0,
      width: 150,
      hide: !columnVisibility.weekdays,
      headerClassName: "bold-header",
    },
    {
      field: "monthdate",
      headerName: "Month Date",
      flex: 0,
      width: 150,
      hide: !columnVisibility.monthdate,
      headerClassName: "bold-header",
    },
    {
      field: "annumonth",
      headerName: "Annually",
      flex: 0,
      width: 150,
      hide: !columnVisibility.annumonth,
      headerClassName: "bold-header",
    },

    {
      field: "duration",
      headerName: "Duration",
      flex: 0,
      width: 150,
      hide: !columnVisibility.duration,
      headerClassName: "bold-header",
    },
    {
      field: "breakupcount",
      headerName: "Breakup Count",
      flex: 0,
      width: 150,
      hide: !columnVisibility.breakupcount,
      headerClassName: "bold-header",
    },
    {
      field: "breakup",
      headerName: "Breakup",
      flex: 0,
      width: 150,
      hide: !columnVisibility.breakup,
      headerClassName: "bold-header",
    },

    {
      field: "required",
      headerName: "Required",
      flex: 0,
      width: 150,
      hide: !columnVisibility.required,
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
          {isUserRoleCompare?.includes("etaskschedulegrouping") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.row.id);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dtaskschedulegrouping") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vtaskschedulegrouping") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("itaskschedulegrouping") && (
            <Button
              sx={userStyle.buttonedit}
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
      id: item.id,
      serialNumber: item.serialNumber,
      category: item.category,
      subcategory: item.subcategory,
      schedule: item.schedule,
      duration: item.duration,
      breakup: item.breakup,
      breakupcount: item.breakupcount,
      monthdate: item.monthdate,
      frequency: item.frequency,
      required: item?.required,
      timetodo: item?.timetodo,
      weekdays: item?.weekdays,
      annumonth: item?.annumonth,
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

  const handleTimeCalculate = (e) => {
    const breakupCount = e ? Number(e) : 1;
    const hourCal = hours !== "Hrs" ? Number(hours) : 0;
    const MinsCal = minutes !== "Mins" ? Number(minutes) : 0;
    const breakUpTime = ((hourCal * 60 + MinsCal) / breakupCount).toFixed(2);
    setbreakupHours(breakUpTime)



  }

  const handleTimeCalculateEdit = (e) => {
    const breakupCount = e ? Number(e) : 1;
    const hourCal = hoursEdit ? Number(hoursEdit) : 0;
    const MinsCal = minutesEdit ? Number(minutesEdit) : 0;
    const breakUpTime = ((hourCal * 60 + MinsCal) / breakupCount).toFixed(2);
    setbreakupHoursEdit(breakUpTime)



  }
  return (
    <Box>
      <Headtitle title={"TASK SCHEDULE GROUPING"} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}> Task Schedule Grouping</Typography>

      <>
        {isUserRoleCompare?.includes("ataskschedulegrouping") && (
          <Box sx={userStyle.selectcontainer}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext} style={{ fontWeight: "600" }}>
                    Add Task Schedule Grouping
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Category <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        maxMenuHeight={250}
                        options={categoryOption}
                        placeholder="Please Select Category"
                        value={{ label: taskGrouping.category, value: taskGrouping.category }}
                        onChange={(e) => {
                          setTaskGrouping({
                            ...taskGrouping,
                            category: e.value,
                            subcategory: "Please Select SubCategory",
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        SubCategory<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        maxMenuHeight={250}
                        options={filteredSubCategory}
                        placeholder="Please Select SubCategory"
                        value={{ label: taskGrouping.subcategory, value: taskGrouping.subcategory }}
                        onChange={(e) => {
                          setTaskGrouping({
                            ...taskGrouping,
                            subcategory: e.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Frequency<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        maxMenuHeight={250}
                        options={frequencyOption}
                        placeholder="Please Select Frequency"
                        value={{ label: taskGrouping.frequency, value: taskGrouping.frequency }}
                        onChange={(e) => {
                          setTaskGrouping({
                            ...taskGrouping,
                            frequency: e.value,
                            hour: "",
                            min: "",
                            timetype: "",
                            monthdate: "",
                            date: "",

                            annumonth: "",
                            annuday: "",

                          });
                          setSelectedWeeklyOptions([])
                          setValueWeekly([])
                          setAddReqTodo([])
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Schedule<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        maxMenuHeight={250}
                        options={scheduleOption}
                        placeholder="Please Select Schedule"
                        value={{ label: taskGrouping.schedule, value: taskGrouping.schedule }}
                        onChange={(e) => {
                          setTaskGrouping({
                            ...taskGrouping,
                            schedule: e.value,
                            hour: "",
                            min: "",
                            timetype: "",
                            monthdate: "",
                            date: "",
                            annumonth: "",

                            annuday: "",
                          });
                          setSelectedWeeklyOptions([])
                          setValueWeekly([])
                          setAddReqTodo([])
                        }}
                      />
                    </FormControl>
                  </Grid>

                  {((taskGrouping.schedule === "Fixed")) &&
                    <>
                      <Grid item lg={2.5} md={2.5} sm={12} xs={12}>
                        <InputLabel>
                          {" "}
                          <b> Time <b style={{ color: "red" }}>*</b> </b>
                        </InputLabel>
                        <Grid item lg={12} md={12} sm={6} xs={12}>
                          <Grid container >
                            <Grid item xs={4} sm={4} md={4}>
                              <FormControl size="small" fullWidth>
                                <Select
                                  labelId="demo-select-small"
                                  id="demo-select-small"
                                  value={taskGrouping.hour}
                                  MenuProps={{
                                    PaperProps: {
                                      style: {
                                        maxHeight: 200,
                                        width: 80,
                                      },
                                    },
                                  }}
                                  onChange={(e) => { setTaskGrouping({ ...taskGrouping, hour: e.target.value }) }}
                                >
                                  <MenuItem value={"01"}>01</MenuItem>
                                  <MenuItem value={"02"}>02</MenuItem>
                                  <MenuItem value={"03"}>03</MenuItem>
                                  <MenuItem value={"04"}>04</MenuItem>
                                  <MenuItem value={"05"}>05</MenuItem>
                                  <MenuItem value={"06"}>06</MenuItem>
                                  <MenuItem value={"07"}>07</MenuItem>
                                  <MenuItem value={"08"}>08</MenuItem>
                                  <MenuItem value={"09"}>09</MenuItem>
                                  <MenuItem value={"10"}>10</MenuItem>
                                  <MenuItem value={11}>11</MenuItem>
                                  <MenuItem value={12}>12</MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>
                            <Grid item xs={4} sm={4} md={4}>
                              <FormControl size="small" fullWidth>
                                <Select
                                  labelId="demo-select-small"
                                  id="demo-select-small"
                                  value={taskGrouping.min}
                                  MenuProps={{
                                    PaperProps: {
                                      style: {
                                        maxHeight: 200,
                                        width: 80,
                                      },
                                    },
                                  }}
                                  onChange={(e) => { setTaskGrouping({ ...taskGrouping, min: e.target.value }) }}
                                >
                                  <MenuItem value={"00"}>00</MenuItem>
                                  <MenuItem value={"01"}>01</MenuItem>
                                  <MenuItem value={"02"}>02</MenuItem>
                                  <MenuItem value={"03"}>03</MenuItem>
                                  <MenuItem value={"04"}>04</MenuItem>
                                  <MenuItem value={"05"}>05</MenuItem>
                                  <MenuItem value={"06"}>06</MenuItem>
                                  <MenuItem value={"07"}>07</MenuItem>
                                  <MenuItem value={"08"}>08</MenuItem>
                                  <MenuItem value={"09"}>09</MenuItem>
                                  <MenuItem value={"10"}>10</MenuItem>
                                  <MenuItem value={11}>11</MenuItem>
                                  <MenuItem value={12}>12</MenuItem>
                                  <MenuItem value={13}>13</MenuItem>
                                  <MenuItem value={14}>14</MenuItem>
                                  <MenuItem value={15}>15</MenuItem>
                                  <MenuItem value={16}>16</MenuItem>
                                  <MenuItem value={17}>17</MenuItem>
                                  <MenuItem value={18}>18</MenuItem>
                                  <MenuItem value={19}>19</MenuItem>
                                  <MenuItem value={20}>20</MenuItem>
                                  <MenuItem value={21}>21</MenuItem>
                                  <MenuItem value={22}>22</MenuItem>
                                  <MenuItem value={23}>23</MenuItem>
                                  <MenuItem value={24}>24</MenuItem>
                                  <MenuItem value={25}>25</MenuItem>
                                  <MenuItem value={26}>26</MenuItem>
                                  <MenuItem value={27}>27</MenuItem>
                                  <MenuItem value={28}>28</MenuItem>
                                  <MenuItem value={29}>29</MenuItem>
                                  <MenuItem value={30}>30</MenuItem>
                                  <MenuItem value={31}>31</MenuItem>
                                  <MenuItem value={32}>32</MenuItem>
                                  <MenuItem value={33}>33</MenuItem>
                                  <MenuItem value={34}>34</MenuItem>
                                  <MenuItem value={35}>35</MenuItem>
                                  <MenuItem value={36}>36</MenuItem>
                                  <MenuItem value={37}>37</MenuItem>
                                  <MenuItem value={38}>38</MenuItem>
                                  <MenuItem value={39}>39</MenuItem>
                                  <MenuItem value={40}>40</MenuItem>
                                  <MenuItem value={41}>41</MenuItem>
                                  <MenuItem value={42}>42</MenuItem>
                                  <MenuItem value={43}>43</MenuItem>
                                  <MenuItem value={44}>44</MenuItem>
                                  <MenuItem value={45}>45</MenuItem>
                                  <MenuItem value={46}>46</MenuItem>
                                  <MenuItem value={47}>47</MenuItem>
                                  <MenuItem value={48}>48</MenuItem>
                                  <MenuItem value={49}>49</MenuItem>
                                  <MenuItem value={50}>50</MenuItem>
                                  <MenuItem value={51}>51</MenuItem>
                                  <MenuItem value={52}>52</MenuItem>
                                  <MenuItem value={53}>53</MenuItem>
                                  <MenuItem value={54}>54</MenuItem>
                                  <MenuItem value={55}>55</MenuItem>
                                  <MenuItem value={56}>56</MenuItem>
                                  <MenuItem value={57}>57</MenuItem>
                                  <MenuItem value={58}>58</MenuItem>
                                  <MenuItem value={59}>59</MenuItem>

                                </Select>
                              </FormControl>
                            </Grid>
                            <Grid item xs={4} sm={4} md={4}>
                              <FormControl size="small" fullWidth>
                                <Select
                                  labelId="demo-select-small"
                                  id="demo-select-small"
                                  value={taskGrouping.timetype}
                                  onChange={(e) => { setTaskGrouping({ ...taskGrouping, timetype: e.target.value }) }}
                                >
                                  <MenuItem value={"AM"}>AM</MenuItem>
                                  <MenuItem value={"PM"}>PM</MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item md={0.5} xs={12} sm={12}>
                        <Button
                          variant="contained"
                          color="success"
                          onClick={addTodo}
                          type="button"
                          sx={{
                            height: "30px",
                            minWidth: "30px",
                            marginTop: "28px",
                            padding: "6px 10px",
                          }}
                        >
                          <FaPlus />
                        </Button>
                      </Grid>
                    </>
                  }
                  {
                    ((taskGrouping.frequency === "Monthly" || taskGrouping.frequency === "Date Wise")) &&
                    <>
                      <Grid item lg={3} md={3} sm={12} xs={12}>
                        <InputLabel>
                          {" "}
                          <b> Date<b style={{ color: "red" }}>*</b> </b>
                        </InputLabel>
                        <FormControl fullWidth size="small">
                          <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={taskGrouping.monthdate}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 200,
                                  width: 80,
                                },
                              },
                            }}
                            onChange={(e) => { setTaskGrouping({ ...taskGrouping, monthdate: e.target.value }) }}
                          >
                            <MenuItem value={"01"}>01</MenuItem>
                            <MenuItem value={"02"}>02</MenuItem>
                            <MenuItem value={"03"}>03</MenuItem>
                            <MenuItem value={"04"}>04</MenuItem>
                            <MenuItem value={"05"}>05</MenuItem>
                            <MenuItem value={"06"}>06</MenuItem>
                            <MenuItem value={"07"}>07</MenuItem>
                            <MenuItem value={"08"}>08</MenuItem>
                            <MenuItem value={"09"}>09</MenuItem>
                            <MenuItem value={"10"}>10</MenuItem>
                            <MenuItem value={11}>11</MenuItem>
                            <MenuItem value={12}>12</MenuItem>
                            <MenuItem value={13}>13</MenuItem>
                            <MenuItem value={14}>14</MenuItem>
                            <MenuItem value={15}>15</MenuItem>
                            <MenuItem value={16}>16</MenuItem>
                            <MenuItem value={17}>17</MenuItem>
                            <MenuItem value={18}>18</MenuItem>
                            <MenuItem value={19}>19</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                            <MenuItem value={21}>21</MenuItem>
                            <MenuItem value={22}>22</MenuItem>
                            <MenuItem value={23}>23</MenuItem>
                            <MenuItem value={24}>24</MenuItem>
                            <MenuItem value={25}>25</MenuItem>
                            <MenuItem value={26}>26</MenuItem>
                            <MenuItem value={27}>27</MenuItem>
                            <MenuItem value={28}>28</MenuItem>
                            <MenuItem value={29}>29</MenuItem>
                            <MenuItem value={30}>30</MenuItem>
                            <MenuItem value={31}>31</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </>
                  }
                  {((taskGrouping.frequency === "Weekly" || taskGrouping.frequency === "Day Wise")) &&
                    <>
                      <Grid item lg={3} md={3} sm={12} xs={12} >
                        <InputLabel>
                          {" "}
                          <b> Days <b style={{ color: "red" }}>*</b></b>
                        </InputLabel>
                        <FormControl fullWidth size="small">
                          <MultiSelect size="small"
                            options={weekdays}
                            value={selectedWeeklyOptions}
                            onChange={handleWeeklyChange}
                            valueRenderer={customValueRendererCate}
                            labelledBy="Please Select Days"
                          />
                        </FormControl>
                      </Grid>
                    </>
                  }
                  {((taskGrouping.frequency === "Annually")) &&
                    <>
                      <Grid item lg={1.5} md={1.5} sm={12} xs={12}>
                        <InputLabel>
                          {" "}
                          <b> Month <b style={{ color: "red" }}>*</b> </b>
                        </InputLabel>
                        <FormControl size="small" fullWidth>
                          <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={taskGrouping.annumonth}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 200,
                                  width: 80,
                                },
                              },
                            }}
                            onChange={(e) => { setTaskGrouping({ ...taskGrouping, annumonth: e.target.value }) }}
                          >
                            <MenuItem value={"01"}>01</MenuItem>
                            <MenuItem value={"02"}>02</MenuItem>
                            <MenuItem value={"03"}>03</MenuItem>
                            <MenuItem value={"04"}>04</MenuItem>
                            <MenuItem value={"05"}>05</MenuItem>
                            <MenuItem value={"06"}>06</MenuItem>
                            <MenuItem value={"07"}>07</MenuItem>
                            <MenuItem value={"08"}>08</MenuItem>
                            <MenuItem value={"09"}>09</MenuItem>
                            <MenuItem value={"10"}>10</MenuItem>
                            <MenuItem value={11}>11</MenuItem>
                            <MenuItem value={12}>12</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item lg={1.5} md={1.5} sm={12} xs={12}>
                        <InputLabel>
                          {" "}
                          <b> Day <b style={{ color: "red" }}>*</b> </b>
                        </InputLabel>

                        <FormControl size="small" fullWidth>
                          <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={taskGrouping.annuday}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 200,
                                  width: 80,
                                },
                              },
                            }}
                            onChange={(e) => { setTaskGrouping({ ...taskGrouping, annuday: e.target.value }) }}
                          >

                            <MenuItem value={"01"}>01</MenuItem>
                            <MenuItem value={"02"}>02</MenuItem>
                            <MenuItem value={"03"}>03</MenuItem>
                            <MenuItem value={"04"}>04</MenuItem>
                            <MenuItem value={"05"}>05</MenuItem>
                            <MenuItem value={"06"}>06</MenuItem>
                            <MenuItem value={"07"}>07</MenuItem>
                            <MenuItem value={"08"}>08</MenuItem>
                            <MenuItem value={"09"}>09</MenuItem>
                            <MenuItem value={"10"}>10</MenuItem>
                            <MenuItem value={11}>11</MenuItem>
                            <MenuItem value={12}>12</MenuItem>
                            <MenuItem value={13}>13</MenuItem>
                            <MenuItem value={14}>14</MenuItem>
                            <MenuItem value={15}>15</MenuItem>
                            <MenuItem value={16}>16</MenuItem>
                            <MenuItem value={17}>17</MenuItem>
                            <MenuItem value={18}>18</MenuItem>
                            <MenuItem value={19}>19</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                            <MenuItem value={21}>21</MenuItem>
                            <MenuItem value={22}>22</MenuItem>
                            <MenuItem value={23}>23</MenuItem>
                            <MenuItem value={24}>24</MenuItem>
                            <MenuItem value={25}>25</MenuItem>
                            <MenuItem value={26}>26</MenuItem>
                            <MenuItem value={27}>27</MenuItem>
                            <MenuItem value={28}>28</MenuItem>
                            <MenuItem value={29}>29</MenuItem>
                            <MenuItem value={30}>30</MenuItem>
                            <MenuItem value={31}>31</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </>
                  }


                  <Grid item md={3} xs={12} sm={12}>
                    <Typography>
                      Duration<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item md={6} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Selects
                            maxMenuHeight={300}
                            options={hrsOption}
                            placeholder="Hrs"
                            value={{ label: hours, value: hours }}
                            onChange={(e) => {
                              setHours(e.value);
                              setTaskGrouping({ ...taskGrouping, duration: `${e.value}:${minutes}`, breakupcount: "" });
                              setbreakupHours("")
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={6} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Selects
                            maxMenuHeight={300}
                            options={minsOption}
                            placeholder="Mins"
                            value={{ label: minutes, value: minutes }}
                            onChange={(e) => {
                              setMinutes(e.value);
                              setTaskGrouping({ ...taskGrouping, duration: `${hours}:${e.value}`, breakupcount: "" });
                              setbreakupHours("")
                            }}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <Typography>
                      Breakup Count<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="Number"
                      sx={userStyle.input}
                      value={taskGrouping.breakupcount}
                      onChange={(e) => {
                        const ans = e.target.value > 0 ? e.target.value : ""
                        handleTimeCalculate(ans)
                        setTaskGrouping({
                          ...taskGrouping,
                          breakupcount: ans,

                        });
                      }}
                    />
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <Typography>
                      Breakup
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      readOnly
                      value={`${breakuphours} mins`}

                    />
                  </Grid>

                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Required
                      </Typography>
                      <MultiSelect options={requiredOption} value={selectedRequiredOptionsCate} onChange={handleRequiredChange} valueRenderer={customValueRendererRequired} labelledBy="Please Select Required" />
                    </FormControl>
                  </Grid>

                </>
              </Grid>
              <br />

              {addReqTodo?.length > 0 && (
                <ul type="none">
                  {addReqTodo?.map((row, index) => {
                    return (
                      <li key={index}>
                        <Grid container spacing={2}>
                          {
                            editingIndexcheck === index
                              // index == 0
                              ? (
                                <>
                                  <Grid item lg={3} md={5} sm={12} xs={12}>
                                    <InputLabel>
                                      {" "}
                                      <b> Time <b style={{ color: "red" }}>*</b> </b>
                                    </InputLabel>
                                    <Grid item lg={12} md={12} sm={6} xs={12}>
                                      <Grid container >
                                        <Grid item xs={4} sm={4} md={4}>
                                          <FormControl size="small" fullWidth>
                                            <Select
                                              labelId="demo-select-small"
                                              id="demo-select-small"
                                              value={hourTodo}
                                              MenuProps={{
                                                PaperProps: {
                                                  style: {
                                                    maxHeight: 200,
                                                    width: 80,
                                                  },
                                                },
                                              }}
                                              onChange={(e) => {
                                                setHourTodo(e.target.value)
                                              }}
                                            >
                                              <MenuItem value={"01"}>01</MenuItem>
                                              <MenuItem value={"02"}>02</MenuItem>
                                              <MenuItem value={"03"}>03</MenuItem>
                                              <MenuItem value={"04"}>04</MenuItem>
                                              <MenuItem value={"05"}>05</MenuItem>
                                              <MenuItem value={"06"}>06</MenuItem>
                                              <MenuItem value={"07"}>07</MenuItem>
                                              <MenuItem value={"08"}>08</MenuItem>
                                              <MenuItem value={"09"}>09</MenuItem>
                                              <MenuItem value={"10"}>10</MenuItem>
                                              <MenuItem value={11}>11</MenuItem>
                                              <MenuItem value={12}>12</MenuItem>
                                            </Select>
                                          </FormControl>
                                        </Grid>
                                        <Grid item xs={4} sm={4} md={4}>
                                          <FormControl size="small" fullWidth>
                                            <Select
                                              labelId="demo-select-small"
                                              id="demo-select-small"
                                              value={minutesTodo}
                                              MenuProps={{
                                                PaperProps: {
                                                  style: {
                                                    maxHeight: 200,
                                                    width: 80,
                                                  },
                                                },
                                              }}
                                              onChange={(e) => {
                                                setMinutesTodo(e.target.value)
                                              }} >
                                              <MenuItem value={"00"}>00</MenuItem>
                                              <MenuItem value={"01"}>01</MenuItem>
                                              <MenuItem value={"02"}>02</MenuItem>
                                              <MenuItem value={"03"}>03</MenuItem>
                                              <MenuItem value={"04"}>04</MenuItem>
                                              <MenuItem value={"05"}>05</MenuItem>
                                              <MenuItem value={"06"}>06</MenuItem>
                                              <MenuItem value={"07"}>07</MenuItem>
                                              <MenuItem value={"08"}>08</MenuItem>
                                              <MenuItem value={"09"}>09</MenuItem>
                                              <MenuItem value={"10"}>10</MenuItem>
                                              <MenuItem value={11}>11</MenuItem>
                                              <MenuItem value={12}>12</MenuItem>
                                              <MenuItem value={13}>13</MenuItem>
                                              <MenuItem value={14}>14</MenuItem>
                                              <MenuItem value={15}>15</MenuItem>
                                              <MenuItem value={16}>16</MenuItem>
                                              <MenuItem value={17}>17</MenuItem>
                                              <MenuItem value={18}>18</MenuItem>
                                              <MenuItem value={19}>19</MenuItem>
                                              <MenuItem value={20}>20</MenuItem>
                                              <MenuItem value={21}>21</MenuItem>
                                              <MenuItem value={22}>22</MenuItem>
                                              <MenuItem value={23}>23</MenuItem>
                                              <MenuItem value={24}>24</MenuItem>
                                              <MenuItem value={25}>25</MenuItem>
                                              <MenuItem value={26}>26</MenuItem>
                                              <MenuItem value={27}>27</MenuItem>
                                              <MenuItem value={28}>28</MenuItem>
                                              <MenuItem value={29}>29</MenuItem>
                                              <MenuItem value={30}>30</MenuItem>
                                              <MenuItem value={31}>31</MenuItem>
                                              <MenuItem value={32}>32</MenuItem>
                                              <MenuItem value={33}>33</MenuItem>
                                              <MenuItem value={34}>34</MenuItem>
                                              <MenuItem value={35}>35</MenuItem>
                                              <MenuItem value={36}>36</MenuItem>
                                              <MenuItem value={37}>37</MenuItem>
                                              <MenuItem value={38}>38</MenuItem>
                                              <MenuItem value={39}>39</MenuItem>
                                              <MenuItem value={40}>40</MenuItem>
                                              <MenuItem value={41}>41</MenuItem>
                                              <MenuItem value={42}>42</MenuItem>
                                              <MenuItem value={43}>43</MenuItem>
                                              <MenuItem value={44}>44</MenuItem>
                                              <MenuItem value={45}>45</MenuItem>
                                              <MenuItem value={46}>46</MenuItem>
                                              <MenuItem value={47}>47</MenuItem>
                                              <MenuItem value={48}>48</MenuItem>
                                              <MenuItem value={49}>49</MenuItem>
                                              <MenuItem value={50}>50</MenuItem>
                                              <MenuItem value={51}>51</MenuItem>
                                              <MenuItem value={52}>52</MenuItem>
                                              <MenuItem value={53}>53</MenuItem>
                                              <MenuItem value={54}>54</MenuItem>
                                              <MenuItem value={55}>55</MenuItem>
                                              <MenuItem value={56}>56</MenuItem>
                                              <MenuItem value={57}>57</MenuItem>
                                              <MenuItem value={58}>58</MenuItem>
                                              <MenuItem value={59}>59</MenuItem>

                                            </Select>
                                          </FormControl>
                                        </Grid>
                                        <Grid item xs={4} sm={4} md={4}>
                                          <FormControl size="small" fullWidth>
                                            <Select
                                              labelId="demo-select-small"
                                              id="demo-select-small"
                                              value={timeTypeTodo}
                                              onChange={(e) => {

                                                setTimeTypeTodo(e.target.value)
                                              }} >
                                              <MenuItem value={"AM"}>AM</MenuItem>
                                              <MenuItem value={"PM"}>PM</MenuItem>
                                            </Select>
                                          </FormControl>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </Grid>

                                </>
                              ) : (
                                <>
                                  <Grid item md={1} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                      <Typography>
                                        Hour
                                      </Typography>
                                      <OutlinedInput readOnly value={row.hour} />
                                    </FormControl>
                                  </Grid>
                                  <Grid item md={1} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                      <Typography>
                                        Minutes
                                      </Typography>
                                      <OutlinedInput readOnly value={row.min} />
                                    </FormControl>
                                  </Grid>
                                  <Grid item md={1} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                      <Typography>
                                        Type
                                      </Typography>
                                      <OutlinedInput readOnly value={row.timetype} />
                                    </FormControl>
                                  </Grid>
                                </>
                              )}
                          <Grid item md={1} xs={12} sm={12}>
                            {editingIndexcheck === index ? (
                              <Button
                                variant="contained"
                                color="success"
                                sx={{
                                  height: "30px",
                                  minWidth: "30px",
                                  marginTop: "37px",
                                  padding: "6px 10px",
                                }}
                                onClick={() => {
                                  if (addReqTodo?.some((data, inde) => data?.hour === hourTodo && data?.min === minutesTodo && data?.timetype === timeTypeTodo && index !== inde)) {
                                    setShowAlert(
                                      <>
                                        <ErrorOutlineOutlinedIcon
                                          sx={{ fontSize: "100px", color: "orange" }}
                                        />
                                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                                          {"Already Time Added"}
                                        </p>
                                      </>
                                    );
                                    handleClickOpenerr();
                                  }
                                  else {
                                    const updatedIsTodoEdit = [...isTodoEdit];
                                    updatedIsTodoEdit[index] = false;
                                    setIsTodoEdit(updatedIsTodoEdit);

                                    handleUpdateTodocheck();
                                  }

                                }
                                }
                              >
                                <MdOutlineDone
                                  style={{
                                    fontSize: "17px",
                                    fontWeight: "bold",
                                  }}
                                />
                              </Button>
                            ) : (
                              <Button
                                variant="contained"
                                color="primary"
                                sx={{
                                  height: "30px",
                                  minWidth: "30px",
                                  marginTop: "37px",
                                  padding: "6px 10px",
                                }}
                                onClick={() => {
                                  const updatedIsTodoEdit = [...isTodoEdit];
                                  updatedIsTodoEdit[index] = true;
                                  setIsTodoEdit(updatedIsTodoEdit);

                                  setEditingIndexcheck(index);
                                  handleEditTodocheck(index)
                                }}
                              >
                                <FaEdit />
                              </Button>
                            )}
                          </Grid>
                          <Grid item md={1} xs={12} sm={12}>
                            {isTodoEdit[index] ? (
                              <Button
                                variant="contained"
                                color="error"
                                type="button"
                                sx={{
                                  height: "30px",
                                  minWidth: "30px",
                                  marginTop: "37px",
                                  padding: "6px 10px",
                                }}
                                onClick={() => {
                                  const updatedIsTodoEdit = [...isTodoEdit];
                                  updatedIsTodoEdit[index] = false;
                                  setIsTodoEdit(updatedIsTodoEdit);
                                  setTodoSubmit(false)
                                  setEditingIndexcheck(-1)
                                }}
                              >
                                <AiOutlineClose />
                              </Button>
                            ) : (
                              <Button
                                variant="contained"
                                color="error"
                                type="button"
                                sx={{
                                  height: "30px",
                                  minWidth: "30px",
                                  marginTop: "37px",
                                  padding: "6px 10px",
                                }}
                                onClick={() => {
                                  deleteTodo(index);
                                }}
                              >
                                <AiOutlineClose />
                              </Button>
                            )}
                          </Grid>
                          <Grid item md={2}></Grid>
                        </Grid>
                      </li>
                    );
                  })}
                </ul>
              )}




              <Grid item md={12} sm={12} xs={12}>
                <br />
                <br />
                <Grid sx={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                  <LoadingButton variant="contained"
                    loading={btnLoad}
                    onClick={handleSubmit}
                  >
                    {" "}
                    Submit
                  </LoadingButton>
                  <Button sx={userStyle.btncancel}
                    onClick={handleclear}
                  >
                    {" "}
                    CLEAR
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        )}
      </>
      <br />   <br />
      {/* ****** Table Start ****** */}
      {!loader ?
        <Box sx={userStyle.container}>
          <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '350px' }}>
            <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
          </Box>
        </Box> :
        <>
          {isUserRoleCompare?.includes("ltaskschedulegrouping") && (
            <Box sx={userStyle.container}>
              {/* ******************************************************EXPORT Buttons****************************************************** */}
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  Task Schedule Grouping List
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
                      <MenuItem value={taskGroupingArray?.length}>
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
                    {isUserRoleCompare?.includes("exceltaskschedulegrouping") && (

                      <>
                        <Button onClick={(e) => {
                          setIsFilterOpen(true)
                          setFormat("xl")
                        }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                      </>

                    )}
                    {isUserRoleCompare?.includes("csvtaskschedulegrouping") && (

                      <>
                        <Button onClick={(e) => {
                          setIsFilterOpen(true)
                          setFormat("csv")
                        }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                      </>
                    )}
                    {isUserRoleCompare?.includes("printtaskschedulegrouping") && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("pdftaskschedulegrouping") && (


                      <>
                        <Button sx={userStyle.buttongrp}
                          onClick={() => {
                            setIsPdfFilterOpen(true)
                          }}                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("imagetaskschedulegrouping") && (
                      <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                        {" "}
                        <ImageIcon
                          sx={{ fontSize: "15px" }}
                        /> &ensp;Image&ensp;{" "}
                      </Button>
                    )}
                  </Box>
                </Grid>
                <Grid item md={2} xs={12} sm={12}>
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
              {isUserRoleCompare?.includes("bdtaskschedulegrouping") && (
                <Button variant="contained" color="error" onClick={handleClickOpenalert}>
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
                <StyledDataGrid

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
                  {Math.min(page * pageSize, filteredDatas?.length)} of{" "}
                  {filteredDatas?.length} entries
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
              {/* ****** Table End ****** */}
            </Box>
          )}
        </>}
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
              <TableCell> SI.No</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>SubCategory</TableCell>
              <TableCell>Frequency</TableCell>
              <TableCell>Schedule</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Days</TableCell>
              <TableCell>Month Date</TableCell>
              <TableCell>Annually</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Breakup Count</TableCell>
              <TableCell>Breakup</TableCell>
              <TableCell>Required</TableCell>
            </TableRow>
          </TableHead>
          <TableBody align="left">
            {rowDataTable?.length > 0 &&
              rowDataTable?.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{row.subcategory}</TableCell>
                  <TableCell>{row.frequency}</TableCell>
                  <TableCell>{row.schedule}</TableCell>
                  <TableCell>{row?.timetodo}</TableCell>
                  <TableCell>{row?.weekdays}</TableCell>
                  <TableCell>{row?.monthdate}</TableCell>
                  <TableCell>{row?.annumonth}</TableCell>
                  <TableCell>{row.duration}</TableCell>
                  <TableCell>{row.breakupcount}</TableCell>
                  <TableCell>{row.breakup}</TableCell>
                  <TableCell>{row.required}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
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
              Task Schedule Grouping Info
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
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {"SNO"}.
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {"UserName"}
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
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
                            {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}
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
              <Button variant="contained" onClick={handleCloseinfo}>
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>
      {/*Export XL Data  */}
      <Dialog open={isFilterOpen} onClose={handleCloseFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
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
          {fileFormat === "xl" ? <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
            :
            <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
          }
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Choose Export
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus variant="contained"
            onClick={(e) => {
              handleExportXL("filtered")
            }}
          >
            Export Filtered Data
          </Button>
          <Button autoFocus variant="contained"
            onClick={(e) => {
              handleExportXL("overall")
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
      {/*Export pdf Data  */}
      <Dialog open={isPdfFilterOpen} onClose={handleClosePdfFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
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
              downloadPdf("filtered")
              setIsPdfFilterOpen(false);
            }}
          >
            Export Filtered Data
          </Button>
          <Button variant="contained"
            onClick={(e) => {
              downloadPdf("overall")
              setIsPdfFilterOpen(false);
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>


      {/*DELETE ALERT DIALOG */}
      <Dialog
        open={isDeleteOpen}
        onClose={handleCloseMod}
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
          <Button
            onClick={handleCloseMod}
            style={{
              backgroundColor: "#f4f4f4",
              color: "#444",
              boxShadow: "none",
              borderRadius: "3px",
              border: "1px solid #0000006b",
              "&:hover": {
                "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                  backgroundColor: "#f4f4f4",
                },
              },
            }}
          >
            Cancel
          </Button>
          <Button
            autoFocus
            variant="contained"
            color="error"
            onClick={(e) => delProcess(proid)}
          >
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>
      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth={true}
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Task Schedule Grouping
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Category</Typography>
                  <Typography>{taskGroupingEdit.category}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">SubCategory</Typography>
                  <Typography>{taskGroupingEdit.subcategory}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Frequency</Typography>
                  <Typography>{taskGroupingEdit.frequency}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Schedule</Typography>
                  <Typography>{taskGroupingEdit.schedule}</Typography>
                </FormControl>
              </Grid>

              <Grid item md={4} xs={12} sm={12}>
                {((taskGroupingEdit.schedule === "Fixed")) &&
                  <>
                    <Typography variant="h6">Time</Typography>
                    <Typography>{taskGroupingEdit.timetodo?.map((t, i) => `${i + 1 + ". "}` + `${t?.hour}:${t?.min} ${t?.timetype}`)}</Typography>
                  </>
                }
                {
                  ((taskGroupingEdit.frequency === "Monthly" || taskGroupingEdit.frequency === "Date Wise")) &&
                  <>
                    <Typography variant="h6">Days</Typography>
                    <Typography>{taskGroupingEdit?.monthdate}</Typography>
                  </>
                }
                {((taskGroupingEdit?.frequency === "Weekly" || taskGroupingEdit?.frequency === "Day Wise")) &&
                  <>
                    <Typography variant="h6">Days</Typography>
                    <Typography>{taskGroupingEdit?.weekdays?.map((t, i) => `${i + 1 + ". "}` + t)}</Typography>
                  </>
                }
                {((taskGroupingEdit.frequency === "Annually")) &&
                  <>
                    <Typography variant="h6">Annually</Typography>
                    <Typography>{`${taskGroupingEdit?.annumonth} month ${taskGroupingEdit?.annuday} days`}</Typography>
                  </>
                }

              </Grid>







              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Duration</Typography>
                  <Typography>{taskGroupingEdit.duration}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Breakup Count</Typography>
                  <Typography>{taskGroupingEdit.breakupcount}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Breakup</Typography>
                  <Typography>{`${taskGroupingEdit.breakup} mins`}</Typography>
                </FormControl>
              </Grid>

              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Required</Typography>
                  <Typography>{concReqs}</Typography>
                </FormControl>
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
      {/* Bulk delete ALERT DIALOG */}
      <Dialog open={isDeleteOpenalert} onClose={handleCloseModalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: "orange" }} />
          <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
            Please Select any Row
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus variant="contained" color="error" onClick={handleCloseModalert}>
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>
      <Box>
        <Dialog open={isDeleteOpencheckbox} onClose={handleCloseModcheckbox} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
            <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
              Are you sure?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
              Cancel
            </Button>
            <Button autoFocus variant="contained" color="error"
              onClick={(e) => bulkdeletefunction(e)}
            >
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      {/* Edit DIALOG */}
      <Box>
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="lg"
          fullWidth={true}
          sx={{
            overflow: 'Auto',
            '& .MuiPaper-root': {
              overflow: 'Auto',
            },
          }}
        >
          <Box sx={{ padding: "20px 50px" }}>
            <>
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}>
                  Edit Task Schedule Grouping
                </Typography>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Category<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={categoryOption}
                      placeholder="Please Select Category"
                      value={{ label: taskGroupingEdit.category === "" ? "Please Select Category" : taskGroupingEdit.category, value: taskGroupingEdit.category === "" ? "Please Select Category" : taskGroupingEdit.category }}
                      onChange={(e) => {
                        setTaskGroupingEdit({
                          ...taskGroupingEdit,
                          category: e.value,
                          subcategory: "Please Select SubCategory",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      SubCategory<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={filteredSubCategoryEdit}
                      placeholder="Please Select SubCategory"
                      value={{ label: taskGroupingEdit.subcategory === "" ? "Please Select SubCategory" : taskGroupingEdit.subcategory, value: taskGroupingEdit.subcategory === "" ? "Please Select SubCategory" : taskGroupingEdit.subcategory }}
                      onChange={(e) => {
                        setTaskGroupingEdit({
                          ...taskGroupingEdit,
                          subcategory: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Frequency<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={frequencyOption}
                      placeholder="Please Select Frequency"
                      value={{ label: taskGroupingEdit.frequency === "" ? "Please Select Frequency" : taskGroupingEdit.frequency, value: taskGroupingEdit.frequency === "" ? "Please Select Frequency" : taskGroupingEdit.frequency }}
                      onChange={(e) => {
                        setTaskGroupingEdit({
                          ...taskGroupingEdit,
                          frequency: e.value,
                          monthdate: "",
                          date: "",
                          annumonth: "",

                          annuday: "",
                        });
                        setSelectedWeeklyOptionsEdit([])
                        setValueWeeklyEdit([])
                        setAddReqTodoEdit([])
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Schedule<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={scheduleOption}
                      placeholder="Please Select Schedule"
                      value={{ label: taskGroupingEdit.schedule === "" ? "Please Select Schedule" : taskGroupingEdit.schedule, value: taskGroupingEdit.schedule === "" ? "Please Select Schedule" : taskGroupingEdit.schedule }}
                      onChange={(e) => {
                        setTaskGroupingEdit({
                          ...taskGroupingEdit,
                          schedule: e.value,
                          monthdate: "",
                          date: "",
                          annumonth: "",
                          annuday: "",
                        });
                        setSelectedWeeklyOptionsEdit([])
                        setValueWeeklyEdit([])
                        setAddReqTodoEdit([])
                      }}
                    />
                  </FormControl>
                </Grid>


                {((taskGroupingEdit.schedule === "Fixed")) &&
                  <>
                    <Grid item lg={2.5} md={2.5} sm={12} xs={12}>
                      <InputLabel>
                        {" "}
                        <b> Time <b style={{ color: "red" }}>*</b> </b>
                      </InputLabel>
                      <Grid item lg={12} md={12} sm={6} xs={12}>
                        <Grid container >
                          <Grid item xs={4} sm={4} md={4}>
                            <FormControl size="small" fullWidth>
                              <Select
                                labelId="demo-select-small"
                                id="demo-select-small"
                                value={taskGroupingEdit.hour}
                                MenuProps={{
                                  PaperProps: {
                                    style: {
                                      maxHeight: 200,
                                      width: 80,
                                    },
                                  },
                                }}
                                onChange={(e) => { setTaskGroupingEdit({ ...taskGroupingEdit, hour: e.target.value }) }}
                              >
                                <MenuItem value={"01"}>01</MenuItem>
                                <MenuItem value={"02"}>02</MenuItem>
                                <MenuItem value={"03"}>03</MenuItem>
                                <MenuItem value={"04"}>04</MenuItem>
                                <MenuItem value={"05"}>05</MenuItem>
                                <MenuItem value={"06"}>06</MenuItem>
                                <MenuItem value={"07"}>07</MenuItem>
                                <MenuItem value={"08"}>08</MenuItem>
                                <MenuItem value={"09"}>09</MenuItem>
                                <MenuItem value={"10"}>10</MenuItem>
                                <MenuItem value={11}>11</MenuItem>
                                <MenuItem value={12}>12</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={4} sm={4} md={4}>
                            <FormControl size="small" fullWidth>
                              <Select
                                labelId="demo-select-small"
                                id="demo-select-small"
                                value={taskGroupingEdit.min}
                                MenuProps={{
                                  PaperProps: {
                                    style: {
                                      maxHeight: 200,
                                      width: 80,
                                    },
                                  },
                                }}
                                onChange={(e) => { setTaskGroupingEdit({ ...taskGroupingEdit, min: e.target.value }) }}
                              >
                                <MenuItem value={"00"}>00</MenuItem>
                                <MenuItem value={"01"}>01</MenuItem>
                                <MenuItem value={"02"}>02</MenuItem>
                                <MenuItem value={"03"}>03</MenuItem>
                                <MenuItem value={"04"}>04</MenuItem>
                                <MenuItem value={"05"}>05</MenuItem>
                                <MenuItem value={"06"}>06</MenuItem>
                                <MenuItem value={"07"}>07</MenuItem>
                                <MenuItem value={"08"}>08</MenuItem>
                                <MenuItem value={"09"}>09</MenuItem>
                                <MenuItem value={"10"}>10</MenuItem>
                                <MenuItem value={11}>11</MenuItem>
                                <MenuItem value={12}>12</MenuItem>
                                <MenuItem value={13}>13</MenuItem>
                                <MenuItem value={14}>14</MenuItem>
                                <MenuItem value={15}>15</MenuItem>
                                <MenuItem value={16}>16</MenuItem>
                                <MenuItem value={17}>17</MenuItem>
                                <MenuItem value={18}>18</MenuItem>
                                <MenuItem value={19}>19</MenuItem>
                                <MenuItem value={20}>20</MenuItem>
                                <MenuItem value={21}>21</MenuItem>
                                <MenuItem value={22}>22</MenuItem>
                                <MenuItem value={23}>23</MenuItem>
                                <MenuItem value={24}>24</MenuItem>
                                <MenuItem value={25}>25</MenuItem>
                                <MenuItem value={26}>26</MenuItem>
                                <MenuItem value={27}>27</MenuItem>
                                <MenuItem value={28}>28</MenuItem>
                                <MenuItem value={29}>29</MenuItem>
                                <MenuItem value={30}>30</MenuItem>
                                <MenuItem value={31}>31</MenuItem>
                                <MenuItem value={32}>32</MenuItem>
                                <MenuItem value={33}>33</MenuItem>
                                <MenuItem value={34}>34</MenuItem>
                                <MenuItem value={35}>35</MenuItem>
                                <MenuItem value={36}>36</MenuItem>
                                <MenuItem value={37}>37</MenuItem>
                                <MenuItem value={38}>38</MenuItem>
                                <MenuItem value={39}>39</MenuItem>
                                <MenuItem value={40}>40</MenuItem>
                                <MenuItem value={41}>41</MenuItem>
                                <MenuItem value={42}>42</MenuItem>
                                <MenuItem value={43}>43</MenuItem>
                                <MenuItem value={44}>44</MenuItem>
                                <MenuItem value={45}>45</MenuItem>
                                <MenuItem value={46}>46</MenuItem>
                                <MenuItem value={47}>47</MenuItem>
                                <MenuItem value={48}>48</MenuItem>
                                <MenuItem value={49}>49</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                                <MenuItem value={51}>51</MenuItem>
                                <MenuItem value={52}>52</MenuItem>
                                <MenuItem value={53}>53</MenuItem>
                                <MenuItem value={54}>54</MenuItem>
                                <MenuItem value={55}>55</MenuItem>
                                <MenuItem value={56}>56</MenuItem>
                                <MenuItem value={57}>57</MenuItem>
                                <MenuItem value={58}>58</MenuItem>
                                <MenuItem value={59}>59</MenuItem>

                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={4} sm={4} md={4}>
                            <FormControl size="small" fullWidth>
                              <Select
                                labelId="demo-select-small"
                                id="demo-select-small"
                                value={taskGroupingEdit.timetype}
                                onChange={(e) => { setTaskGroupingEdit({ ...taskGroupingEdit, timetype: e.target.value }) }}
                              >
                                <MenuItem value={"AM"}>AM</MenuItem>
                                <MenuItem value={"PM"}>PM</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>




                    {addReqTodoEdit?.length < 1 && <Grid item md={0.5} xs={12} sm={12}>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={addTodoEdit}
                        type="button"
                        sx={{
                          height: "30px",
                          minWidth: "30px",
                          marginTop: "28px",
                          padding: "6px 10px",
                        }}
                      >
                        <FaPlus />
                      </Button>
                    </Grid>}
                  </>
                }
                {
                  ((taskGroupingEdit.frequency === "Monthly" || taskGroupingEdit.frequency === "Date Wise")) &&
                  <>
                    <Grid item lg={3} md={3} sm={12} xs={12}>
                      <InputLabel>
                        {" "}
                        <b> Date <b style={{ color: "red" }}>*</b></b>
                      </InputLabel>
                      <FormControl fullWidth size="small">
                        <Select
                          labelId="demo-select-small"
                          id="demo-select-small"
                          value={taskGroupingEdit.monthdate}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 200,
                                width: 80,
                              },
                            },
                          }}
                          onChange={(e) => { setTaskGroupingEdit({ ...taskGroupingEdit, monthdate: e.target.value }) }}
                        >
                          <MenuItem value={"01"}>01</MenuItem>
                          <MenuItem value={"02"}>02</MenuItem>
                          <MenuItem value={"03"}>03</MenuItem>
                          <MenuItem value={"04"}>04</MenuItem>
                          <MenuItem value={"05"}>05</MenuItem>
                          <MenuItem value={"06"}>06</MenuItem>
                          <MenuItem value={"07"}>07</MenuItem>
                          <MenuItem value={"08"}>08</MenuItem>
                          <MenuItem value={"09"}>09</MenuItem>
                          <MenuItem value={"10"}>10</MenuItem>
                          <MenuItem value={11}>11</MenuItem>
                          <MenuItem value={12}>12</MenuItem>
                          <MenuItem value={13}>13</MenuItem>
                          <MenuItem value={14}>14</MenuItem>
                          <MenuItem value={15}>15</MenuItem>
                          <MenuItem value={16}>16</MenuItem>
                          <MenuItem value={17}>17</MenuItem>
                          <MenuItem value={18}>18</MenuItem>
                          <MenuItem value={19}>19</MenuItem>
                          <MenuItem value={20}>20</MenuItem>
                          <MenuItem value={21}>21</MenuItem>
                          <MenuItem value={22}>22</MenuItem>
                          <MenuItem value={23}>23</MenuItem>
                          <MenuItem value={24}>24</MenuItem>
                          <MenuItem value={25}>25</MenuItem>
                          <MenuItem value={26}>26</MenuItem>
                          <MenuItem value={27}>27</MenuItem>
                          <MenuItem value={28}>28</MenuItem>
                          <MenuItem value={29}>29</MenuItem>
                          <MenuItem value={30}>30</MenuItem>
                          <MenuItem value={31}>31</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </>
                }
                {((taskGroupingEdit.frequency === "Weekly" || taskGroupingEdit.frequency === "Day Wise")) &&
                  <>
                    <Grid item lg={3} md={3} sm={12} xs={12} >
                      <InputLabel>
                        {" "}
                        <b> Days<b style={{ color: "red" }}>*</b> </b>
                      </InputLabel>
                      <FormControl fullWidth size="small">
                        <MultiSelect size="small"
                          options={weekdays}
                          value={selectedWeeklyOptionsEdit}
                          onChange={handleWeeklyChangeEdit}
                          valueRenderer={customValueRendererCateEdit}
                          labelledBy="Please Select Days"
                        />
                      </FormControl>
                    </Grid>
                  </>
                }

                {((taskGroupingEdit.frequency === "Annually")) &&
                  <>
                    <Grid item lg={1.5} md={1.5} sm={12} xs={12}>
                      <InputLabel>
                        {" "}
                        <b> Month  <b style={{ color: "red" }}>*</b></b>
                      </InputLabel>
                      <FormControl size="small" fullWidth>
                        <Select
                          labelId="demo-select-small"
                          id="demo-select-small"
                          value={taskGroupingEdit.annumonth}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 200,
                                width: 80,
                              },
                            },
                          }}
                          onChange={(e) => { setTaskGroupingEdit({ ...taskGroupingEdit, annumonth: e.target.value }) }}
                        >
                          <MenuItem value={"01"}>01</MenuItem>
                          <MenuItem value={"02"}>02</MenuItem>
                          <MenuItem value={"03"}>03</MenuItem>
                          <MenuItem value={"04"}>04</MenuItem>
                          <MenuItem value={"05"}>05</MenuItem>
                          <MenuItem value={"06"}>06</MenuItem>
                          <MenuItem value={"07"}>07</MenuItem>
                          <MenuItem value={"08"}>08</MenuItem>
                          <MenuItem value={"09"}>09</MenuItem>
                          <MenuItem value={"10"}>10</MenuItem>
                          <MenuItem value={11}>11</MenuItem>
                          <MenuItem value={12}>12</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item lg={1.5} md={1.5} sm={12} xs={12}>
                      <InputLabel>
                        {" "}
                        <b> Day <b style={{ color: "red" }}>*</b> </b>
                      </InputLabel>

                      <FormControl size="small" fullWidth>
                        <Select
                          labelId="demo-select-small"
                          id="demo-select-small"
                          value={taskGroupingEdit?.annuday}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 200,
                                width: 80,
                              },
                            },
                          }}
                          onChange={(e) => { setTaskGroupingEdit({ ...taskGroupingEdit, annuday: e?.target?.value }) }}
                        >

                          <MenuItem value={"01"}>01</MenuItem>
                          <MenuItem value={"02"}>02</MenuItem>
                          <MenuItem value={"03"}>03</MenuItem>
                          <MenuItem value={"04"}>04</MenuItem>
                          <MenuItem value={"05"}>05</MenuItem>
                          <MenuItem value={"06"}>06</MenuItem>
                          <MenuItem value={"07"}>07</MenuItem>
                          <MenuItem value={"08"}>08</MenuItem>
                          <MenuItem value={"09"}>09</MenuItem>
                          <MenuItem value={"10"}>10</MenuItem>
                          <MenuItem value={11}>11</MenuItem>
                          <MenuItem value={12}>12</MenuItem>
                          <MenuItem value={13}>13</MenuItem>
                          <MenuItem value={14}>14</MenuItem>
                          <MenuItem value={15}>15</MenuItem>
                          <MenuItem value={16}>16</MenuItem>
                          <MenuItem value={17}>17</MenuItem>
                          <MenuItem value={18}>18</MenuItem>
                          <MenuItem value={19}>19</MenuItem>
                          <MenuItem value={20}>20</MenuItem>
                          <MenuItem value={21}>21</MenuItem>
                          <MenuItem value={22}>22</MenuItem>
                          <MenuItem value={23}>23</MenuItem>
                          <MenuItem value={24}>24</MenuItem>
                          <MenuItem value={25}>25</MenuItem>
                          <MenuItem value={26}>26</MenuItem>
                          <MenuItem value={27}>27</MenuItem>
                          <MenuItem value={28}>28</MenuItem>
                          <MenuItem value={29}>29</MenuItem>
                          <MenuItem value={30}>30</MenuItem>
                          <MenuItem value={31}>31</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </>
                }












                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    Duration<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Selects
                          maxMenuHeight={300}
                          options={hrsOption}
                          placeholder="Hrs"
                          value={{ label: hoursEdit, value: hoursEdit }}
                          onChange={(e) => {
                            setHoursEdit(e.value);
                            setTaskGroupingEdit({ ...taskGroupingEdit, duration: `${e.value}:${minutesEdit}`, breakupcount: "" });
                            setbreakupHoursEdit("")
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Selects
                          maxMenuHeight={300}
                          options={minsOption}
                          placeholder="Mins"
                          value={{ label: minutesEdit, value: minutesEdit }}
                          onChange={(e) => {
                            setMinutesEdit(e.value);
                            setTaskGroupingEdit({ ...taskGroupingEdit, duration: `${hoursEdit}:${e.value}`, breakupcount: "" });
                            setbreakupHoursEdit("")
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    Breakup Count<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={taskGroupingEdit.breakupcount}
                      onChange={(e) => {
                        const ans = e.target.value > 0 ? e.target.value : ""
                        handleTimeCalculateEdit(ans)
                        setTaskGroupingEdit({
                          ...taskGroupingEdit,
                          breakupcount: ans,

                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    Breakup
                  </Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      readOnly
                      value={`${breakuphoursEdit} mins`}

                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Required
                    </Typography>
                    <MultiSelect options={requiredOption} value={selectedRequiredOptionsCateEdit} onChange={handleRequiredChangeEdit} valueRenderer={customValueRendererRequiredEdit} labelledBy="Please Select Required" />
                  </FormControl>
                </Grid>
              </Grid>

              <br />
              <br />
              <br />
              {addReqTodoEdit?.length > 0 && (
                <ul type="none">
                  {addReqTodoEdit?.map((row, index) => {
                    return (
                      <li key={index}>
                        <Grid container spacing={2}>
                          {
                            editingIndexcheckEdit === index
                              // index == 0
                              ? (
                                <>
                                  <Grid item lg={3} md={5} sm={12} xs={12}>
                                    <InputLabel>
                                      {" "}
                                      <b> Time <b style={{ color: "red" }}>*</b> </b>
                                    </InputLabel>
                                    <Grid item lg={12} md={12} sm={6} xs={12}>
                                      <Grid container >
                                        <Grid item xs={4} sm={4} md={4}>
                                          <FormControl size="small" fullWidth>
                                            <Select
                                              labelId="demo-select-small"
                                              id="demo-select-small"
                                              value={hourTodoEdit}
                                              MenuProps={{
                                                PaperProps: {
                                                  style: {
                                                    maxHeight: 200,
                                                    width: 80,
                                                  },
                                                },
                                              }}
                                              onChange={(e) => {
                                                setHourTodoEdit(e.target.value)
                                              }}
                                            >
                                              <MenuItem value={"01"}>01</MenuItem>
                                              <MenuItem value={"02"}>02</MenuItem>
                                              <MenuItem value={"03"}>03</MenuItem>
                                              <MenuItem value={"04"}>04</MenuItem>
                                              <MenuItem value={"05"}>05</MenuItem>
                                              <MenuItem value={"06"}>06</MenuItem>
                                              <MenuItem value={"07"}>07</MenuItem>
                                              <MenuItem value={"08"}>08</MenuItem>
                                              <MenuItem value={"09"}>09</MenuItem>
                                              <MenuItem value={"10"}>10</MenuItem>
                                              <MenuItem value={11}>11</MenuItem>
                                              <MenuItem value={12}>12</MenuItem>
                                            </Select>
                                          </FormControl>
                                        </Grid>
                                        <Grid item xs={4} sm={4} md={4}>
                                          <FormControl size="small" fullWidth>
                                            <Select
                                              labelId="demo-select-small"
                                              id="demo-select-small"
                                              value={minutesTodoEdit}
                                              MenuProps={{
                                                PaperProps: {
                                                  style: {
                                                    maxHeight: 200,
                                                    width: 80,
                                                  },
                                                },
                                              }}
                                              onChange={(e) => {
                                                setMinutesTodoEdit(e.target.value)
                                              }} >
                                              <MenuItem value={"00"}>00</MenuItem>
                                              <MenuItem value={"01"}>01</MenuItem>
                                              <MenuItem value={"02"}>02</MenuItem>
                                              <MenuItem value={"03"}>03</MenuItem>
                                              <MenuItem value={"04"}>04</MenuItem>
                                              <MenuItem value={"05"}>05</MenuItem>
                                              <MenuItem value={"06"}>06</MenuItem>
                                              <MenuItem value={"07"}>07</MenuItem>
                                              <MenuItem value={"08"}>08</MenuItem>
                                              <MenuItem value={"09"}>09</MenuItem>
                                              <MenuItem value={"10"}>10</MenuItem>
                                              <MenuItem value={11}>11</MenuItem>
                                              <MenuItem value={12}>12</MenuItem>
                                              <MenuItem value={13}>13</MenuItem>
                                              <MenuItem value={14}>14</MenuItem>
                                              <MenuItem value={15}>15</MenuItem>
                                              <MenuItem value={16}>16</MenuItem>
                                              <MenuItem value={17}>17</MenuItem>
                                              <MenuItem value={18}>18</MenuItem>
                                              <MenuItem value={19}>19</MenuItem>
                                              <MenuItem value={20}>20</MenuItem>
                                              <MenuItem value={21}>21</MenuItem>
                                              <MenuItem value={22}>22</MenuItem>
                                              <MenuItem value={23}>23</MenuItem>
                                              <MenuItem value={24}>24</MenuItem>
                                              <MenuItem value={25}>25</MenuItem>
                                              <MenuItem value={26}>26</MenuItem>
                                              <MenuItem value={27}>27</MenuItem>
                                              <MenuItem value={28}>28</MenuItem>
                                              <MenuItem value={29}>29</MenuItem>
                                              <MenuItem value={30}>30</MenuItem>
                                              <MenuItem value={31}>31</MenuItem>
                                              <MenuItem value={32}>32</MenuItem>
                                              <MenuItem value={33}>33</MenuItem>
                                              <MenuItem value={34}>34</MenuItem>
                                              <MenuItem value={35}>35</MenuItem>
                                              <MenuItem value={36}>36</MenuItem>
                                              <MenuItem value={37}>37</MenuItem>
                                              <MenuItem value={38}>38</MenuItem>
                                              <MenuItem value={39}>39</MenuItem>
                                              <MenuItem value={40}>40</MenuItem>
                                              <MenuItem value={41}>41</MenuItem>
                                              <MenuItem value={42}>42</MenuItem>
                                              <MenuItem value={43}>43</MenuItem>
                                              <MenuItem value={44}>44</MenuItem>
                                              <MenuItem value={45}>45</MenuItem>
                                              <MenuItem value={46}>46</MenuItem>
                                              <MenuItem value={47}>47</MenuItem>
                                              <MenuItem value={48}>48</MenuItem>
                                              <MenuItem value={49}>49</MenuItem>
                                              <MenuItem value={50}>50</MenuItem>
                                              <MenuItem value={51}>51</MenuItem>
                                              <MenuItem value={52}>52</MenuItem>
                                              <MenuItem value={53}>53</MenuItem>
                                              <MenuItem value={54}>54</MenuItem>
                                              <MenuItem value={55}>55</MenuItem>
                                              <MenuItem value={56}>56</MenuItem>
                                              <MenuItem value={57}>57</MenuItem>
                                              <MenuItem value={58}>58</MenuItem>
                                              <MenuItem value={59}>59</MenuItem>

                                            </Select>
                                          </FormControl>
                                        </Grid>
                                        <Grid item xs={4} sm={4} md={4}>
                                          <FormControl size="small" fullWidth>
                                            <Select
                                              labelId="demo-select-small"
                                              id="demo-select-small"
                                              value={timeTypeTodoEdit}
                                              onChange={(e) => {

                                                setTimeTypeTodoEdit(e.target.value)
                                              }} >
                                              <MenuItem value={"AM"}>AM</MenuItem>
                                              <MenuItem value={"PM"}>PM</MenuItem>
                                            </Select>
                                          </FormControl>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </Grid>

                                </>
                              ) : (
                                <>
                                  <Grid item md={1} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                      <Typography>
                                        Hour
                                      </Typography>
                                      <OutlinedInput readOnly value={row.hour} />
                                    </FormControl>
                                  </Grid>
                                  <Grid item md={1} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                      <Typography>
                                        Minutes
                                      </Typography>
                                      <OutlinedInput readOnly value={row.min} />
                                    </FormControl>
                                  </Grid>
                                  <Grid item md={1} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                      <Typography>
                                        Type
                                      </Typography>
                                      <OutlinedInput readOnly value={row.timetype} />
                                    </FormControl>
                                  </Grid>
                                </>
                              )}
                          <Grid item md={1} xs={12} sm={12}>
                            {editingIndexcheckEdit === index ? (
                              <Button
                                variant="contained"
                                color="success"
                                sx={{
                                  height: "30px",
                                  minWidth: "30px",
                                  marginTop: "47px",
                                  padding: "6px 10px",
                                }}
                                onClick={() => {
                                  if (addReqTodoEdit?.some((data, inde) => data?.hour === hourTodoEdit && data?.min === minutesTodoEdit && data?.timetype === timeTypeTodoEdit && index !== inde)) {
                                    setShowAlert(
                                      <>
                                        <ErrorOutlineOutlinedIcon
                                          sx={{ fontSize: "100px", color: "orange" }}
                                        />
                                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                                          {"Already Time Added"}
                                        </p>
                                      </>
                                    );
                                    handleClickOpenerr();
                                  }
                                  else {
                                    const updatedIsTodoEdit = [...isTodoEditPage];
                                    updatedIsTodoEdit[index] = false;
                                    setIsTodoEditPage(updatedIsTodoEdit);
                                    setTodoSubmitEdit(false)
                                    handleUpdateTodocheckEdit();
                                  }

                                }
                                }
                              >
                                <MdOutlineDone
                                  style={{
                                    fontSize: "17px",
                                    fontWeight: "bold",
                                  }}
                                />
                              </Button>
                            ) : (
                              <Button
                                variant="contained"
                                color="primary"
                                sx={{
                                  height: "30px",
                                  minWidth: "30px",
                                  marginTop: "28px",
                                  padding: "6px 10px",
                                }}
                                onClick={() => {
                                  const updatedIsTodoEdit = [...isTodoEditPage];
                                  updatedIsTodoEdit[index] = true;
                                  setIsTodoEditPage(updatedIsTodoEdit);
                                  setTodoSubmitEdit(true)
                                  setEditingIndexcheckEdit(index);
                                  handleEditTodocheckEdit(index)
                                }}
                              >
                                <FaEdit />
                              </Button>
                            )}
                          </Grid>
                          <Grid item md={1} xs={12} sm={12}>
                            {isTodoEditPage[index] ? (
                              <Button
                                variant="contained"
                                color="error"
                                type="button"
                                sx={{
                                  height: "30px",
                                  minWidth: "30px",
                                  marginTop: "47px",
                                  padding: "6px 10px",
                                }}
                                onClick={() => {
                                  const updatedIsTodoEdit = [...isTodoEditPage];
                                  updatedIsTodoEdit[index] = false;
                                  setIsTodoEditPage(updatedIsTodoEdit);
                                  setTodoSubmitEdit(false)
                                  setEditingIndexcheckEdit(-1);
                                }}
                              >
                                <AiOutlineClose />
                              </Button>
                            ) : (
                              <Button
                                variant="contained"
                                color="error"
                                type="button"
                                sx={{
                                  height: "30px",
                                  minWidth: "30px",
                                  marginTop: "28px",
                                  padding: "6px 10px",
                                }}
                                onClick={() => {
                                  deleteTodoEdit(index);
                                  setTodoSubmitEdit(false)
                                }}
                              >
                                <AiOutlineClose />
                              </Button>
                            )}
                          </Grid>
                          <Grid item md={2}></Grid>
                        </Grid>
                      </li>
                    );
                  })}
                </ul>
              )}
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <Button variant="contained" onClick={editSubmit}>
                    {" "}
                    Update
                  </Button>
                </Grid>
                <br />
                <Grid item md={6} xs={12} sm={12}>
                  <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
                    {" "}
                    Cancel{" "}
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </Dialog>
      </Box>
      <br />
    </Box>
  );
}

export default TaskScheduleGrouping;