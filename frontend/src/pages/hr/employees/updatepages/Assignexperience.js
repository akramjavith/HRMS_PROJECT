import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Popover,
  Checkbox,
  TextField,
  IconButton,
  Select,
  OutlinedInput,
  FormControl,
  MenuItem,
  DialogActions,
  Grid,
  Paper,
  Table,
  TableHead,
  TableContainer,
  Button,
  TableBody,
} from "@mui/material";
import { userStyle } from "../../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../../components/Table";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { SERVICE } from "../../../../services/Baseservice";
import moment from "moment-timezone";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useReactToPrint } from "react-to-print";
import { Link } from "react-router-dom";
import {
  UserRoleAccessContext,
  AuthContext,
} from "../../../../context/Appcontext";
import { handleApiError } from "../../../../components/Errorhandling";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ViewHeadlineOutlinedIcon from "@mui/icons-material/ViewHeadlineOutlined";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import StyledDataGrid from "../../../../components/TableStyle";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Headtitle from "../../../../components/Headtitle";
import Selects from "react-select";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";

import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import { MultiSelect } from "react-multi-select-component";
import PageHeading from "../../../../components/PageHeading";
function Assignexperience() {
  const [employees, setEmployees] = useState([]);
  const [monthSets, setMonthsets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    isUserRoleAccess,
    isUserRoleCompare,
    allTeam,
    isAssignBranch,
    pageName,
    setPageName,
  } = useContext(UserRoleAccessContext);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { auth } = useContext(AuthContext);

  const [pfesiform, setPfesiForm] = useState({
    esideduction: false,
    pfdeduction: false,
    uan: "UAN",
    pfmembername: "",
    insurancenumber: "",
    ipname: "",
    pfesifromdate: "",
    isenddate: false,
    pfesienddate: "",
  });

  const mode = ["Auto Increment", "Add", "Minus", "Fix"];
  const modetar = ["Target Stop"];
  const modeexp = ["Exp Stop"];

  const modeOption = mode?.map((data) => ({
    ...data,
    label: data,
    value: data,
  }));

  const modeOptiontar = modetar?.map((data) => ({
    ...data,
    label: data,
    value: data,
  }));

  const modeOptionexp = modeexp?.map((data) => ({
    ...data,
    label: data,
    value: data,
  }));

  //  Datefield
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;

  const [assignExperience, setAssignExperience] = useState({
    assignExpMode: "Auto Increment",
    assignExpvalue: 0,
    assignEndExpDate: "",
    assignEndTarDate: "",
    assignEndExp: "Exp Stop",
    assignEndExpvalue: "No",
    assignEndTar: "Target Stop",
    assignEndTarvalue: "No",
    updatedate: "",
    assignTartype: "Department Month Set",
    assignExptype: "Department Month Set",
  });

  const valueOpt = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ];
  const [isAddOpenalert, setAddOpenalert] = useState(false);

  const closeUpdateAlert = () => {
    setAddOpenalert(false);
  };

  const [isBankdetail, setBankdetail] = useState(false);
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Assign Experience.png");
        });
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
    NotificationManager.success(`${message} 👍`, "", 2000);
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

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    company: true,
    branch: true,
    unit: true,
    team: true,
    empcode: true,
    companyname: true,
    actions: true,
    doj: true,
    experience: true,
    assignExpMode: true,
    targetexp: true,
    prodexp: true,
    modeexp: true,
    endtardate: true,
    endtar: true,
    endexpdate: true,
    endexp: true,
    modevalue: true,
    processcode: true,
    processcodeexp: true,
    processcodetar: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );
  const [oldDatalog, setOldDatalog] = useState({
    expmode: "",
    expval: "",
    endexp: "",
    endexpdate: "",
    endtar: "",
    endtardate: "",
    updatedate: "",
  });
  const getCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setPfesiForm(res?.data?.suser);
      if (res?.data?.suser.assignExpLog?.length > 0) {
        let lastexplog =
          res?.data?.suser.assignExpLog[
            res?.data?.suser.assignExpLog?.length - 1
          ];
        setOldDatalog(lastexplog);
        setAssignExperience({
          assignExpMode: lastexplog.expmode,
          assignExpvalue: lastexplog.expval,
          assignEndExp: "Exp Stop",
          assignEndExpvalue: lastexplog.endexp,
          assignEndExpDate: lastexplog.endexpdate,
          assignEndTar: "Target Stop",
          assignEndTarvalue: lastexplog.endtar,
          assignEndTarDate: lastexplog.endtardate,
          updatedate: lastexplog.updatedate,
          // assignExptype:typesplit[0],
          // assignTartype:typesplit[1],
        });
      } else {
        setAssignExperience({
          assignExpMode: "Auto Increment",
          assignExpvalue: 0,
          assignExpDate: "",
          assignEndExp: "Exp Stop",
          assignEndExpvalue: "No",
          assignEndExpDate: "",
          assignEndTar: "Target Stop",
          assignEndTarvalue: "No",
          assignEndTarDate: "",
          updatedate: "",
        });
      }
      handleClickOpenEdit();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);
  const handleOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };
  const [viewexplog, setviewexplog] = useState([]);
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setviewexplog(res?.data?.suser);
      handleOpeninfo();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // Edit model
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
  };

  const [expDptDates, setExpDptDates] = useState([]);

  //get all employees list details
  const fetchDepartmentMonthsets = async () => {
    let today = new Date();
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var currentyear = today.getFullYear();

    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let currentmonth = months[mm - 1];

    setPageName(!pageName);
    try {
      let res_employee = await axios.get(SERVICE.DEPMONTHSET_ALL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let filteredMonthsets = res_employee?.data?.departmentdetails?.filter(
        (item) => item.year == currentyear && item.monthname == currentmonth
      );
      let filteredMonthsetsDATES =
        res_employee?.data?.departmentdetails?.filter((item) => item.fromdate);

      setExpDptDates(res_employee?.data?.departmentdetails);

      setMonthsets(filteredMonthsets);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
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

  //Boardingupadate updateby edit page...
  let updateby = pfesiform?.updatedby;
  let explog = pfesiform?.assignExpLog ? pfesiform?.assignExpLog : [];

  //edit post call
  let boredit = pfesiform?._id;
  const sendRequestt = async () => {
    // let checkmode = assignExperience.assignExpMode.split(" ");
    // let checkval = checkmode[0];
    let now = new Date();
    let currentTime = now.toLocaleTimeString();

    setPageName(!pageName);
    try {
      let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${boredit}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

        assignExpLog: [
          ...explog,
          {
            expmode: String(assignExperience.assignExpMode),
            expval: String(assignExperience.assignExpvalue),

            endexp: String(assignExperience.assignEndExpvalue),
            endexpdate:
              assignExperience.assignEndExpvalue === "Yes"
                ? String(assignExperience.assignEndExpDate)
                : "",
            endtar: String(assignExperience.assignEndTarvalue),
            endtardate:
              assignExperience.assignEndTarvalue === "Yes"
                ? String(assignExperience.assignEndTarDate)
                : "",
            updatedate: String(assignExperience.updatedate),
            updatename: String(isUserRoleAccess.companyname),
            updatetime: currentTime,
            date: String(new Date()),
          },
        ],
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchEmployee();

      handleCloseModEdit();
      setAddOpenalert(true);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const editSubmit = (e) => {
    e.preventDefault();
    if (assignExperience.assignExpMode === "Please Select Mode") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Mode!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      (assignExperience.assignExpMode === "Add" ||
        assignExperience.assignExpMode === "Minus" ||
        assignExperience.assignExpMode === "Fix") &&
      (assignExperience.assignExpvalue === "" ||
        assignExperience.assignExpvalue == 0)
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Value"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      assignExperience.assignEndExpvalue === "Yes" &&
      assignExperience.assignEndExpDate === ""
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select End Exp Date"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      assignExperience.assignEndTarvalue === "Yes" &&
      assignExperience.assignEndTarDate === ""
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Choose End Target Date"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (assignExperience.updatedate == "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "18px", fontWeight: 800 }}>
            {"Please Choose Date"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      oldDatalog &&
      oldDatalog.expmode == assignExperience.assignExpMode &&
      oldDatalog.expval == assignExperience.assignExpvalue &&
      oldDatalog.endexp == assignExperience.assignEndExpvalue &&
      oldDatalog.endexpdate == assignExperience.assignEndExpDate &&
      oldDatalog.endtar == assignExperience.assignEndTarvalue &&
      oldDatalog.endtardate == assignExperience.assignEndTarDate &&
      oldDatalog.updatedate == assignExperience.updatedate
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "18px", fontWeight: 800 }}>
            {"No changes to Update..!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequestt();
    }
  };

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

  const [fileFormat, setFormat] = useState("xl");
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = fileFormat === "xl" ? ".xlsx" : ".csv";

  const exportToExcel = (excelData, fileName) => {
    setPageName(!pageName);
    try {
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

      // Check if the browser supports Blob and FileSaver
      if (!Blob || !FileSaver) {
        console.error("Blob or FileSaver not supported");
        return;
      }

      const data = new Blob([excelBuffer], { type: fileType });

      // Check if FileSaver.saveAs is available
      if (!FileSaver.saveAs) {
        console.error("FileSaver.saveAs is not available");
        return;
      }

      FileSaver.saveAs(data, fileName + fileExtension);
    } catch (error) {
      console.error("Error exporting to Excel", error);
    }
  };

  const formatData = (data) => {
    return data?.map((item, index) => {
      return {
        Sno: index + 1,
        Company: item.company || "",
        Branch: item.branch || "",
        Unit: item.unit || "",
        Team: item.team || "",
        Empcode: item.empcode || "",
        "Employee Name": item.companyname || "",
        DOJ: item.doj
          ? moment(item.doj, "YYYY-MM-DD").format("DD-MM-YYYY")
          : "",
        "Actual Exp": item.experience || "",
        Mode: item.assignExpMode || "",
        Value: item.modevalue || "",
        "Mode Exp": item.modeexp || "",
        "End Exp": item.endexp || "",
        "End Exp Date": item.endexpdate
          ? moment(item.endexpdate, "YYYY-MM-DD").format("DD-MM-YYYY")
          : "",
        "Production Exp": item.prodexp || "",
        "End Target": item.endtar || "",
        "End Target Date": item.endtardate
          ? moment(item.endtardate, "YYYY-MM-DD").format("DD-MM-YYYY")
          : "",
        "Target Exp": item.targetexp || "",
        "Process Code":
          item.processcode === "Please Select Process" ? "" : item.processcode,
        "Exp Process Code + Month": item.processcodeexp || "",
        "Target Process Code + Month": item.processcodetar || "",
      };
    });
  };

  const handleExportXL = (isfilter) => {
    const dataToExport = isfilter === "filtered" ? filteredData : items;

    if (!dataToExport || dataToExport?.length === 0) {
      console.error("No data available to export");
      return;
    }

    exportToExcel(formatData(dataToExport), "Assign Experience");
    setIsFilterOpen(false);
  };

  //  PDF
  // pdf.....
  const columns = [
    { title: "Company", field: "company" },
    { title: "Branch", field: "branch" },
    { title: "Unit", field: "unit" },
    { title: "Team", field: "team" },
    { title: "Emp Code", field: "empcode" },
    { title: "Name", field: "companyname" },
    { title: "DOJ", field: "doj" },
    { title: "Actual Exp", field: "experience" },

    { title: "Mode", field: "assignExpMode" },
    { title: "Value", field: "modevalue" },
    { title: "Mode Exp", field: "modeexp" },

    { title: "End Exp", field: "endexp" },
    { title: "End-Exp Date", field: "endexpdate" },
    { title: "Prod Exp", field: "prodexp" },

    { title: "End Tar", field: "endtar" },
    { title: "End-Tar Date", field: "endtardate" },
    { title: "Target Exp", field: "targetexp" },

    { title: "Process Code", field: "processcode" },
    { title: "Exp. Process Code+Month", field: "processcodeexp" },
    { title: "Tar. Process Code+Month", field: "processcodetar" },
  ];

  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();

    // Initialize serial number counter
    // Modify columns to include serial number column
    const columnsWithSerial = [
      { title: "S.No", dataKey: "serialNumber" }, // Serial number column
      ...columns?.map((col) => ({ title: col.title, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial =
      isfilter === "filtered"
        ? filteredData?.map((t, index) => ({
            ...t,
            serialNumber: index + 1,
            doj: t.doj ? moment(t.doj, "YYYY-MM-DD").format("DD-MM-YYYY") : "",
            endexpdate: t.endexpdate
              ? moment(t.endexpdate, "YYYY-MM-DD").format("DD-MM-YYYY")
              : "",
            endtardate: t.endtardate
              ? moment(t.endtardate, "YYYY-MM-DD").format("DD-MM-YYYY")
              : "",
            processcode:
              t.processcode === "Please Select Process" ? "" : t.processcode,
          }))
        : items?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
            doj: item.doj
              ? moment(item.doj, "YYYY-MM-DD").format("DD-MM-YYYY")
              : "",
            endexpdate: item.endexpdate
              ? moment(item.endexpdate, "YYYY-MM-DD").format("DD-MM-YYYY")
              : "",
            endtardate: item.endtardate
              ? moment(item.endtardate, "YYYY-MM-DD").format("DD-MM-YYYY")
              : "",
            processcode:
              item.processcode === "Please Select Process"
                ? ""
                : item.processcode,
          }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: 5 },
    });

    doc.save("Assign Experience.pdf");
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Assign Experience",
    pageStyle: "print",
  });

  useEffect(() => {
    fetchDepartmentMonthsets();
    setColumnVisibility(initialColumnVisibility);
  }, []);

  //table entries ..,.
  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    try {
      if (!Array.isArray(employees) || employees.length === 0) {
        console.error("Employees array is not valid.");
        return;
      }

      const itemsWithSerialNumber = employees.map((item, index) => {
        if (Array.isArray(item.assignExpLog) && item.assignExpLog.length > 0) {
          let modevalue = item.assignExpLog[item.assignExpLog.length - 1];

          let today = new Date();
          let mm = String(today.getMonth() + 1).padStart(2, "0");
          let yyyy = today.getFullYear();
          let curMonStartDate = `${yyyy}-${mm}-01`;

          let findexp = monthSets.find((d) => d.department === item.department);
          let findDate = findexp ? findexp.fromdate : curMonStartDate;

          const calculateMonthsBetweenDates = (startDate, endDate) => {
            if (startDate && endDate) {
              const start = new Date(startDate);
              const end = new Date(endDate);

              let years = end.getFullYear() - start.getFullYear();
              let months = end.getMonth() - start.getMonth();
              let days = end.getDate() - start.getDate();

              months += years * 12;

              if (days < 0) {
                months -= 1;
                days += new Date(
                  end.getFullYear(),
                  end.getMonth(),
                  0
                ).getDate();
              }

              if (days >= 15) {
                months += 1;
              }

              return months;
            }
            return 0;
          };

          const applyExpMode = (months, expval, expmode) => {
            expval = parseInt(expval);
            if (isNaN(expval)) return months; // Handle NaN
            if (expmode === "Add") return months + expval;
            if (expmode === "Minus") return months - expval;
            if (expmode === "Fix") return expval;
            return months;
          };

          let differenceInMonths = 0,
            differenceInMonthsexp = 0,
            differenceInMonthstar = 0;

          if (modevalue) {
            if (modevalue.endexp === "Yes") {
              differenceInMonthsexp = calculateMonthsBetweenDates(
                item.doj,
                modevalue.endexpdate
              );
              differenceInMonthsexp = applyExpMode(
                differenceInMonthsexp,
                modevalue.expval,
                modevalue.expmode
              );
            } else {
              differenceInMonthsexp = calculateMonthsBetweenDates(
                item.doj,
                findDate
              );
              differenceInMonthsexp = applyExpMode(
                differenceInMonthsexp,
                modevalue.expval,
                modevalue.expmode
              );
            }

            if (modevalue.endtar === "Yes") {
              differenceInMonthstar = calculateMonthsBetweenDates(
                item.doj,
                modevalue.endtardate
              );
              differenceInMonthstar = applyExpMode(
                differenceInMonthstar,
                modevalue.expval,
                modevalue.expmode
              );
            } else {
              differenceInMonthstar = calculateMonthsBetweenDates(
                item.doj,
                findDate
              );
              differenceInMonthstar = applyExpMode(
                differenceInMonthstar,
                modevalue.expval,
                modevalue.expmode
              );
            }

            differenceInMonths = calculateMonthsBetweenDates(
              item.doj,
              findDate
            );
            differenceInMonths = applyExpMode(
              differenceInMonths,
              modevalue?.expval,
              modevalue?.expmode
            );
          } else {
            differenceInMonthsexp = calculateMonthsBetweenDates(
              item?.doj,
              findDate
            );
            differenceInMonthstar = calculateMonthsBetweenDates(
              item.doj,
              findDate
            );
            differenceInMonths = calculateMonthsBetweenDates(
              item?.doj,
              findDate
            );
          }

          const getProcessCode =
            item.processlog?.length > 0
              ? item.processlog[item.processlog?.length - 1].process
              : "";

          return {
            id: item._id,
            serialNumber: index + 1,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            empcode: item.empcode,
            companyname: item.companyname,
            doj: item.doj ? moment(item.doj).format("DD-MM-YYYY") : "",
            experience: item.doj
              ? calculateMonthsBetweenDates(item.doj, findDate)
              : "",
            endtar: modevalue?.endtar || "",
            endtardate: modevalue?.endtardate
              ? moment(modevalue.endtardate).format("DD-MM-YYYY")
              : "",
            endexp: modevalue?.endexp || "",
            endexpdate: modevalue?.endexpdate
              ? moment(modevalue.endexpdate).format("DD-MM-YYYY")
              : "",
            assignExpMode: modevalue?.expmode || "",
            modevalue: modevalue?.expval || "",
            targetexp: item.doj ? Math.max(differenceInMonthstar, 0) : "",
            prodexp: item.doj ? Math.max(differenceInMonthsexp, 0) : "",
            modeexp: item.doj ? Math.max(differenceInMonths, 0) : "",
            processcode:
              item.doj && modevalue?.expmode === "Manual"
                ? modevalue.salarycode
                : getProcessCode,
            processcodeexp:
              item.doj && modevalue?.expmode === "Manual"
                ? `${modevalue.salarycode}${
                    differenceInMonthsexp <= 9
                      ? `0${differenceInMonthsexp}`
                      : differenceInMonthsexp
                  }`
                : `${getProcessCode}${
                    differenceInMonthsexp <= 9
                      ? `0${differenceInMonthsexp}`
                      : differenceInMonthsexp
                  }`,
            processcodetar:
              item.doj && modevalue?.expmode === "Manual"
                ? `${modevalue.salarycode}${
                    differenceInMonthstar <= 9
                      ? `0${differenceInMonthstar}`
                      : differenceInMonthstar
                  }`
                : `${getProcessCode}${
                    differenceInMonthstar <= 9
                      ? `0${differenceInMonthstar}`
                      : differenceInMonthstar
                  }`,
          };
        } else {
          return null; // Safeguard against invalid or missing assignExpLog
        }
      });

      const validItems = itemsWithSerialNumber.filter((item) => item !== null);
      setItems(validItems);
    } catch (err) {
      console.log(err, "addSerialNumberErr");
    }
  };

  useEffect(() => {
    addSerialNumber();
  }, [employees, isEditOpen]);

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

  const indexOfLastItem = page * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox
        sx={{ padding: 0 }}
        checked={selectAllChecked}
        onChange={onSelectAll}
      />
    </div>
  );

  const columnDataTable = [
    {
      field: "checkbox",
      headerName: "Checkbox", // Default header name

      renderHeader: (params) => (
        <CheckboxHeader
          selectAllChecked={selectAllChecked}
          onSelectAll={() => {
            if (rowDataTable?.length === 0) {
              // Do not allow checking when there are no rows
              return;
            }
            if (selectAllChecked) {
              setSelectedRows([]);
            } else {
              const allRowIds = rowDataTable?.map((row) => row.id);
              setSelectedRows(allRowIds);
            }
            setSelectAllChecked(!selectAllChecked);
          }}
        />
      ),

      renderCell: (params) => (
        <Checkbox
          sx={{ padding: 0 }}
          checked={selectedRows.includes(params.row.id)}
          onChange={() => {
            let updatedSelectedRows;
            if (selectedRows.includes(params.row.id)) {
              updatedSelectedRows = selectedRows?.filter(
                (selectedId) => selectedId !== params.row.id
              );
            } else {
              updatedSelectedRows = [...selectedRows, params.row.id];
            }

            setSelectedRows(updatedSelectedRows);

            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllChecked(
              updatedSelectedRows?.length === filteredData?.length
            );
          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 50,

      hide: !columnVisibility.checkbox,
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 40,
      hide: !columnVisibility.serialNumber,
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 85,
      hide: !columnVisibility.company,
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 110,
      hide: !columnVisibility.branch,
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 80,
      hide: !columnVisibility.unit,
    },
    {
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 75,
      hide: !columnVisibility.team,
    },
    {
      field: "empcode",
      headerName: "Emp Code",
      flex: 0,
      width: 100,
      hide: !columnVisibility.empcode,
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
                handleCopy("Copied Emp Code!");
              }}
              options={{ message: "Copied Emp Code!" }}
              text={params?.row?.empcode}
            >
              <ListItemText primary={params?.row?.empcode} />
            </CopyToClipboard>
          </ListItem>
        </Grid>
      ),
    },
    {
      field: "companyname",
      headerName: "Name",
      flex: 0,
      width: 200,
      hide: !columnVisibility.companyname,
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
                handleCopy("Copied Name!");
              }}
              options={{ message: "Copied Name!" }}
              text={params?.row?.companyname}
            >
              <ListItemText primary={params?.row?.companyname} />
            </CopyToClipboard>
          </ListItem>
        </Grid>
      ),
    },
    {
      field: "doj",
      headerName: "DOJ",
      flex: 0,
      width: 95,
      hide: !columnVisibility.doj,
    },
    {
      field: "experience",
      headerName: "Actual Exp",
      flex: 0,
      width: 45,
      hide: !columnVisibility.experience,
    },

    {
      field: "assignExpMode",
      headerName: "Mode",
      flex: 0,
      width: 100,
      hide: !columnVisibility.assignExpMode,
    },
    {
      field: "modevalue",
      headerName: "Value",
      flex: 0,
      width: 45,
      hide: !columnVisibility.modevalue,
    },
    {
      field: "modeexp",
      headerName: "Mode Exp",
      flex: 0,
      width: 50,
      hide: !columnVisibility.modeexp,
    },

    {
      field: "endexp",
      headerName: "End Exp",
      flex: 0,
      width: 45,
      hide: !columnVisibility.endexp,
    },
    {
      field: "endexpdate",
      headerName: "End-Exp Date",
      flex: 0,
      width: 90,
      hide: !columnVisibility.endexpdate,
    },
    {
      field: "prodexp",
      headerName: "Prod Exp",
      flex: 0,
      width: 50,
      hide: !columnVisibility.prodexp,
    },

    {
      field: "endtar",
      headerName: "End Tar",
      flex: 0,
      width: 50,
      hide: !columnVisibility.endtar,
    },
    {
      field: "endtardate",
      headerName: "End-Tar Date",
      flex: 0,
      width: 90,
      hide: !columnVisibility.endtardate,
    },
    {
      field: "targetexp",
      headerName: "Target Exp",
      flex: 0,
      width: 50,
      hide: !columnVisibility.targetexp,
    },

    {
      field: "processcode",
      headerName: "Process Code",
      flex: 0,
      width: 105,
      hide: !columnVisibility.processcode,
    },
    {
      field: "processcodeexp",
      headerName: "Exp. Process Code + Month",
      flex: 0,
      width: 105,
      hide: !columnVisibility.processcodeexp,
    },
    {
      field: "processcodetar",
      headerName: "Tar. Process Code + Month",
      flex: 0,
      width: 105,
      hide: !columnVisibility.processcodetar,
    },

    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 100,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      // Assign Bank Detail
      renderCell: (params) => (
        <Grid sx={{ display: "flex", gap: "5px" }}>
          {isUserRoleCompare?.includes("eassignexperience") && (
            <Button
              variant="contained"
              sx={{
                textTransform: "capitalize",
                minWidth: "40px",
                padding: "2px 5px",
                fontSize: "0.7125rem",
              }}
              size="small"
              onClick={() => {
                getCode(params.row.id);
              }}
            >
              Assign
            </Button>
          )}
          {isUserRoleCompare?.includes("iassignexperience") && (
            <Link to={`/updatepages/assignexperience/log/${params.row.id}`}>
              <Button
                variant="contained"
                sx={{
                  textTransform: "capitalize",
                  minWidth: "30px",
                  padding: "5px 5px",
                }}
                size="small"
                onClick={() => {
                  getinfoCode(params.row.id);
                }}
              >
                <ViewHeadlineOutlinedIcon sx={{ fontSize: "1rem" }} />
              </Button>
            </Link>
          )}
        </Grid>
      ),
    },
  ];

  const rowDataTable = filteredData?.map((item, index) => {
    return {
      id: item.id,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      empcode: item.empcode,
      companyname: item.companyname,
      doj: item.doj,

      experience: item.experience,

      endtar: item.endtar,
      endtardate: item.endtardate,
      endexp: item.endexp,
      endexpdate: item.endexpdate,

      assignExpMode: item.assignExpMode,
      modevalue: item.modevalue,

      targetexp: item.targetexp,
      prodexp: item.prodexp,
      modeexp: item.modeexp,

      processcode: item.processcode,
      processcodeexp: item.processcodeexp,
      processcodetar: item.processcodetar,
    };
  });
  const rowsWithCheckboxes = rowDataTable?.map((row) => ({
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
  const filteredColumns = columnDataTable?.filter((column) =>
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
          {filteredColumns?.map((column) => (
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

  const handleClearFilter = () => {
    setValueCompanyCat([]);
    setSelectedOptionsCompany([]);
    setValueBranchCat([]);
    setSelectedOptionsBranch([]);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setEmployees([]);
    setShowAlert(
      <>
        <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>
          {"Cleared Successfully"}
        </p>
      </>
    );
    handleClickOpenerr();
  };

  //MULTISELECT ONCHANGE START

  //company multiselect
  const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
  let [valueCompanyCat, setValueCompanyCat] = useState([]);

  const handleCompanyChange = (options) => {
    setValueCompanyCat(
      options?.map((a, index) => {
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
      ? valueCompanyCat?.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
  };

  //branch multiselect
  const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
  let [valueBranchCat, setValueBranchCat] = useState([]);

  const handleBranchChange = (options) => {
    setValueBranchCat(
      options?.map((a, index) => {
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
      ? valueBranchCat?.map(({ label }) => label)?.join(", ")
      : "Please Select Branch";
  };

  //unit multiselect
  const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
  let [valueUnitCat, setValueUnitCat] = useState([]);

  const handleUnitChange = (options) => {
    setValueUnitCat(
      options?.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsUnit(options);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
  };

  const customValueRendererUnit = (valueUnitCat, _categoryname) => {
    return valueUnitCat?.length
      ? valueUnitCat?.map(({ label }) => label)?.join(", ")
      : "Please Select Unit";
  };

  //team multiselect
  const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
  let [valueTeamCat, setValueTeamCat] = useState([]);

  const handleTeamChange = (options) => {
    setValueTeamCat(
      options?.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsTeam(options);
  };

  const customValueRendererTeam = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length
      ? valueTeamCat?.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };

  //MULTISELECT ONCHANGE END

  const handleFilter = () => {
    if (selectedOptionsCompany?.length === 0) {
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
    } else {
      fetchEmployee();
    }
  };
  const [allAssignCompany, setAllAssignCompany] = useState([]);
  const [allAssignBranch, setAllAssignBranch] = useState([]);
  const [allAssignUnit, setAllAssignUnit] = useState([]);

  //get all employees list details
  const fetchEmployee = async () => {
    setBankdetail(true);
    setPageName(!pageName);
    const aggregationPipeline = [
      {
        $match: {
          $and: [
            // Enquiry status filter
            {
              enquirystatus: {
                $nin: ["Enquiry Purpose"],
              },
            },
            // Reasonable status filter
            {
              resonablestatus: {
                $nin: [
                  "Not Joined",
                  "Postponed",
                  "Rejected",
                  "Closed",
                  "Releave Employee",
                  "Absconded",
                  "Hold",
                  "Terminate",
                ],
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
          ],
        },
      },
      {
        $project: {
          username: 1,
          usernameautogenerate: 1,
          workstationofficestatus: 1,
          workmode: 1,
          internstatus: 1,
          userprofile: 1,
          remoteworkmodestatus: 1,
          enquirystatus: 1,
          area: 1,
          password: 1,
          prefix: 1,
          shiftgrouping: 1,
          callingname: 1,
          callingname: 1,
          firstname: 1,
          lastname: 1,
          callingname: 1,
          legalname: 1,
          fathername: 1,
          mothername: 1,
          gender: 1,
          maritalstatus: 1,
          dob: 1,
          bloodgroup: 1,
          location: 1,
          email: 1,
          employeecount: 1,
          systemmode: 1,
          companyemail: 1,
          contactpersonal: 1,
          contactfamily: 1,
          emergencyno: 1,
          doj: 1,
          samesprmnt: 1,
          dot: 1,
          referencename: 1,
          contactno: 1,
          details: 1,
          pdoorno: 1,
          pstreet: 1,
          parea: 1,
          plandmark: 1,
          ptaluk: 1,
          ppost: 1,
          ppincode: 1,
          pcountry: 1,
          pstate: 1,
          pcity: 1,
          cdoorno: 1,
          cstreet: 1,
          carea: 1,
          clandmark: 1,
          ctaluk: 1,
          cpost: 1,
          cpincode: 1,
          ccountry: 1,
          cstate: 1,
          ccity: 1,
          experience: 1,
          companyname: 1,
          branch: 1,
          unit: 1,
          floor: 1,
          department: 1,
          team: 1,
          designation: 1,
          shifttiming: 1,
          reportingto: 1,
          empcode: 1,
          company: 1,
          draft: 1,
          role: 1,
          addAddQuaTodo: 1,
          eduTodo: 1,
          aadhar: 1,
          panno: 1,
          panstatus: 1,
          panrefno: 1,
          workhistTodo: 1,
          status: 1,
          percentage: 1,
          intStartDate: 1,
          intEndDate: 1,
          intCourse: 1,
          modeOfInt: 1,
          intDuration: 1,
          intCourse: 1,
          clickedGenerate: 1,
          resonablestatus: 1,
          reasondate: 1,
          reasonname: 1,
          empreason: 1,
          employeecount: 1,
          systemmode: 1,
          dom: 1,
          enableworkstation: 1,
          bankdetails: 1,
          designationlog: 1,
          departmentlog: 1,
          assignExpLog: 1,
          departmentlogdates: 1,
          twofaenabled: 1,
          twofatempsecret: 1,
          twofasecret: 1,
          process: 1,
          originalpassword: 1,
          processlog: 1,
          assignExpMode: 1,
          assignExpvalue: 1,
          endexp: 1,
          endtardate: 1,
          endtar: 1,
          assignEndExp: 1,
          assignExpDate: 1,
          assignEndExpvalue: 1,
          assignEndExpvalue: 1,
          assignEndExpDate: 1,
          assignEndTar: 1,
          assignEndTarvalue: 1,
          assignEndTarvalue: 1,
          assignEndTarDate: 1,
          process: 1,
          processtype: 1,
          processduration: 1,
          date: 1,
          time: 1,
          grosssalary: 1,
          timemins: 1,
          modeexperience: 1,
          targetexperience: 1,
          targetpts: 1,
          expval: 1,
          expmode: 1,
          shifttype: 1,
          boardingLog: 1,
          workstation: 1,
          shiftallot: 1,
          rejoin: 1,
          reasonablestatusremarks: 1,
          referencetodo: 1,
          pfesistatus: 1,
          esideduction: 1,
          pfdeduction: 1,
          uan: 1,
          pfmembername: 1,
          insurancenumber: 1,
          ipname: 1,
          pfesifromdate: 1,
          pffromdate: 1,
          pfenddate: 1,
          esifromdate: 1,
          esienddate: 1,
          isenddate: 1,
          pfesienddate: 1,
          pfesistatus: 1,
          assignpfesilog: 1,
          wordcheck: 1,
          assignExpMode: 1,
          assignExpvalue: 1,
          assignExpDate: 1,
          salarysetup: 1,
          basic: 1,
          hra: 1,
          conveyance: 1,
          medicalallowance: 1,
          productionallowance: 1,
          productionallowancetwo: 1,
          otherallowance: 1,
          esideduction: 1,
          pfdeduction: 1,
          ctc: 1,
          mode: 1,
          salarycode: 1,
          shiftallowancelog: 1,
          targetpointlog: 1,
          acheivedpointlog: 1,
          penaltylog: 1,
          totalpaiddayslog: 1,
          totalabsentlog: 1,
          currmonthavglog: 1,
          currmonthattlog: 1,
          noshiftlog: 1,
          shiftallowtargetlog: 1,
          nightshiftallowlog: 1,
          remoteworkmodestatus: 1,
          addremoteworkmode: 1,
          addedby: 1,
          updatedby: 1,
          createdAt: 1,
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
      setBankdetail(false);
    } catch (err) {
      setBankdetail(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //auto select all dropdowns
  const handleAutoSelect = async () => {
    try {
      let selectedValues = isAssignBranch
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
      setValueTeamCat(selectedTeam);
      setSelectedOptionsTeam(mappedTeam);

      setAllAssignCompany(selectedCompany);

      setAllAssignBranch(selectedBranch);

      setAllAssignUnit(selectedUnit);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    handleAutoSelect();
  }, [isAssignBranch]);

  return (
    <Box>
      <NotificationContainer />
      <Headtitle title={"Assign Experience"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Manage Assign Experience"
        modulename="Human Resources"
        submodulename="HR"
        mainpagename="Employee"
        subpagename="Employee Update Details"
        subsubpagename="Assign Experience"
      />
      <br />
      {isUserRoleCompare?.includes("lassignexperience") && (
        <>
          <Box sx={userStyle.selectcontainer}>
            <Grid container spacing={2}>
              <>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    Company<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <MultiSelect
                      options={isAssignBranch
                        ?.map((data) => ({
                          label: data.company,
                          value: data.company,
                        }))
                        ?.filter((item, index, self) => {
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
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography> Branch</Typography>
                    <MultiSelect
                      options={isAssignBranch
                        ?.filter((comp) =>
                          valueCompanyCat?.includes(comp.company)
                        )
                        ?.map((data) => ({
                          label: data.branch,
                          value: data.branch,
                        }))
                        ?.filter((item, index, self) => {
                          return (
                            self.findIndex(
                              (i) =>
                                i.label === item.label && i.value === item.value
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
                    <Typography> Unit</Typography>
                    <MultiSelect
                      options={isAssignBranch
                        ?.filter(
                          (comp) =>
                            valueCompanyCat?.includes(comp.company) &&
                            valueBranchCat?.includes(comp.branch)
                        )
                        ?.map((data) => ({
                          label: data.unit,
                          value: data.unit,
                        }))
                        ?.filter((item, index, self) => {
                          return (
                            self.findIndex(
                              (i) =>
                                i.label === item.label && i.value === item.value
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
                    <Typography>Team</Typography>
                    <MultiSelect
                      options={allTeam
                        ?.filter(
                          (u) =>
                            valueCompanyCat?.includes(u.company) &&
                            valueBranchCat?.includes(u.branch) &&
                            valueUnitCat?.includes(u.unit)
                        )
                        ?.map((u) => ({
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
            </Grid>
            <br />
            <br />
            <br />
            <Grid
              container
              spacing={2}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Grid item lg={1} md={2} sm={2} xs={12}>
                <Button
                  sx={userStyle.buttonadd}
                  variant="contained"
                  onClick={handleFilter}
                >
                  {" "}
                  Filter{" "}
                </Button>
              </Grid>
              <Grid item lg={1} md={2} sm={2} xs={12}>
                <Button sx={userStyle.btncancel} onClick={handleClearFilter}>
                  {" "}
                  Clear{" "}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
      <br />
      {isUserRoleCompare?.includes("lassignexperience") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Assign Experience List
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
                  {isUserRoleCompare?.includes("excelassignexperience") && (
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
                  {isUserRoleCompare?.includes("csvassignexperience") && (
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
                  {isUserRoleCompare?.includes("printassignexperience") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfassignexperience") && (
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
                  {isUserRoleCompare?.includes("imageassignexperience") && (
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
            &ensp;
            <br />
            <br />
            {isBankdetail ? (
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
                    columns={columnDataTable?.filter(
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
                    {filteredData?.length > 0 ? (page - 1) * pageSize + 1 : 0}{" "}
                    to {Math.min(page * pageSize, filteredDatas?.length)} of{" "}
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

      {/* Delete Modal */}

      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
          fullWidth={true}
        >
          <DialogContent>
            <Typography sx={userStyle.SubHeaderText}>
              Assign Experience Detail Info
            </Typography>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={6} sm={6} xs={12}>
                <Typography sx={{ fontSize: "13px", color: "black" }}>
                  Employee code: {pfesiform.empcode}
                </Typography>
              </Grid>
              <Grid item md={6} sm={6} xs={12}>
                <Typography sx={{ fontSize: "13px", color: "black" }}>
                  Employee Name: {pfesiform.companyname}
                </Typography>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={1}>
              <Grid item md={8} xs={0} sm={4}></Grid>
              <Grid item md={1} xs={12} sm={4} marginTop={1}>
                <Typography>
                  Date <b style={{ color: "red" }}>*</b>
                </Typography>
              </Grid>
              <Grid item md={3} xs={12} sm={4}>
                <FormControl fullWidth>
                  <Selects
                    maxMenuHeight={250}
                    styles={{
                      menu: (provided) => ({
                        ...provided,
                        maxHeight: 200, // Adjust the max height of the menu base
                      }),
                      menuList: (provided) => ({
                        ...provided,
                        maxHeight: 200, // Adjust the max height of the menu option list
                      }),
                    }}
                    options={expDptDates
                      ?.filter(
                        (d) =>
                          d.department === pfesiform.department &&
                          d.fromdate >= oldDatalog.updatedate
                      )
                      ?.map((item) => ({
                        ...item,
                        label: item.fromdate,
                        value: item.fromdate,
                      }))}
                    value={{
                      label: assignExperience.updatedate,
                      value: assignExperience.updatedate,
                    }}
                    onChange={(e) => {
                      setAssignExperience({
                        ...assignExperience,
                        updatedate: e.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={1}>
              <Grid item md={4} xs={12} sm={4}>
                <FormControl fullWidth>
                  <Typography>Mode Val</Typography>
                  <Selects
                    maxMenuHeight={250}
                    options={modeOption}
                    value={{
                      label: assignExperience.assignExpMode,
                      value: assignExperience.assignExpMode,
                    }}
                    onChange={(e) => {
                      setAssignExperience({
                        ...assignExperience,
                        assignExpMode: e.value,
                        assignExpvalue: e.value === "Auto Increment" ? 0 : "",
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              {assignExperience.assignExpMode === "Please Select Mode" ? (
                ""
              ) : (
                <>
                  {assignExperience.assignExpMode === "Exp Stop" ||
                  assignExperience.assignExpMode === "Target Stop" ? (
                    <Grid item md={4} xs={12} sm={4}>
                      <FormControl fullWidth>
                        <Typography>Value (In Months)</Typography>
                        <Selects
                          maxMenuHeight={250}
                          options={valueOpt}
                          value={{
                            label: assignExperience.assignExpvalue,
                            value: assignExperience.assignExpvalue,
                          }}
                          onChange={(e) => {
                            setAssignExperience({
                              ...assignExperience,
                              assignExpvalue: e.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  ) : (
                    <Grid item md={4} xs={12} sm={4}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Value (In Months){" "}
                          {assignExperience.assignExpMode === "Add" ||
                          assignExperience.assignExpMode === "Minus" ||
                          assignExperience.assignExpMode === "Fix" ? (
                            <b style={{ color: "red" }}>*</b>
                          ) : (
                            ""
                          )}
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Please Enter Value (In Months)"
                          disabled={
                            assignExperience.assignExpMode === "Auto Increment"
                          }
                          value={assignExperience.assignExpvalue}
                          onChange={(e) => {
                            setAssignExperience({
                              ...assignExperience,
                              assignExpvalue: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  )}
                </>
              )}
            </Grid>
            <br />
            <Grid container spacing={1}>
              <Grid item md={3} xs={12} sm={4}>
                <FormControl fullWidth>
                  <Typography>Mode Exp</Typography>
                  <Selects
                    maxMenuHeight={250}
                    options={modeOptionexp}
                    value={{
                      label: assignExperience.assignEndExp,
                      value: assignExperience.assignEndExp,
                    }}
                    // onChange={(e) => {
                    //   setAssignExperience({
                    //     ...assignExperience,
                    //     assignEndExp: e.value,
                    //   });
                    // }}
                  />
                </FormControl>
              </Grid>
              {assignExperience.assignEndExp === "Please Select Mode" ? (
                ""
              ) : (
                <>
                  {assignExperience.assignEndExp === "Exp Stop" ? (
                    <Grid item md={3} xs={12} sm={4}>
                      <FormControl fullWidth>
                        <Typography>End Exp</Typography>
                        <Selects
                          maxMenuHeight={250}
                          options={valueOpt}
                          value={{
                            label: assignExperience.assignEndExpvalue,
                            value: assignExperience.assignEndExpvalue,
                          }}
                          onChange={(e) => {
                            setAssignExperience({
                              ...assignExperience,
                              assignEndExpvalue: e.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  ) : (
                    <Grid item md={3} xs={12} sm={4}>
                      <FormControl fullWidth size="small">
                        <Typography>End Tar</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Please Select"
                          value={
                            assignExperience.assignEndExpvalue ===
                            "Please Select"
                              ? ""
                              : assignExperience.assignEndExpvalue
                          }
                          onChange={(e) => {
                            setAssignExperience({
                              ...assignExperience,
                              assignEndExpvalue: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  )}
                </>
              )}

              {assignExperience.assignEndExpvalue === "Yes" ? (
                <>
                  <Grid item md={3} xs={12} sm={4}>
                    <Typography>
                      End Exp Date{" "}
                      {assignExperience.assignEndExpvalue === "Yes" ? (
                        <b style={{ color: "red" }}>*</b>
                      ) : (
                        ""
                      )}
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      menuPlacement="top"
                      styles={{
                        menu: (provided) => ({
                          ...provided,
                          maxHeight: 200, // Adjust the max height of the menu base
                        }),
                        menuList: (provided) => ({
                          ...provided,
                          maxHeight: 200, // Adjust the max height of the menu option list
                        }),
                      }}
                      options={expDptDates
                        ?.filter((d) => d.department === pfesiform.department)
                        ?.map((item) => ({
                          ...item,
                          label: item.fromdate,
                          value: item.fromdate,
                        }))}
                      value={{
                        label: assignExperience.assignEndExpDate,
                        value: assignExperience.assignEndExpDate,
                      }}
                      onChange={(e) => {
                        setAssignExperience({
                          ...assignExperience,
                          assignEndExpDate: e.value,
                        });
                      }}
                    />
                  </Grid>
                </>
              ) : null}
            </Grid>
            <br />
            <Grid container spacing={1}>
              <Grid item md={3} xs={12} sm={4}>
                <FormControl fullWidth>
                  <Typography>Mode Target</Typography>
                  <Selects
                    maxMenuHeight={250}
                    options={modeOptiontar}
                    value={{
                      label: assignExperience.assignEndTar,
                      value: assignExperience.assignEndTar,
                    }}
                  />
                </FormControl>
              </Grid>
              {assignExperience.assignEndTar === "Please Select Mode" ? (
                ""
              ) : (
                <>
                  {assignExperience.assignEndTar === "Target Stop" ? (
                    <Grid item md={3} xs={12} sm={4}>
                      <FormControl fullWidth>
                        <Typography>End Tar</Typography>
                        <Selects
                          maxMenuHeight={250}
                          options={valueOpt}
                          value={{
                            label: assignExperience.assignEndTarvalue,
                            value: assignExperience.assignEndTarvalue,
                          }}
                          onChange={(e) => {
                            setAssignExperience({
                              ...assignExperience,
                              assignEndTarvalue: e.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  ) : (
                    <Grid item md={3} xs={12} sm={4}>
                      <FormControl fullWidth size="small">
                        <Typography>Value (In Months)</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Please Enter "
                          value={
                            assignExperience.assignEndTarvalue ===
                            "Please Select "
                              ? ""
                              : assignExperience.assignEndTarvalue
                          }
                          onChange={(e) => {
                            setAssignExperience({
                              ...assignExperience,
                              assignEndTarvalue: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  )}
                </>
              )}

              {assignExperience.assignEndTarvalue === "Yes" ? (
                <>
                  <Grid item md={3} xs={12} sm={4}>
                    <Typography>
                      End Tar Date{" "}
                      {assignExperience.assignEndTarvalue === "Yes" ? (
                        <b style={{ color: "red" }}>*</b>
                      ) : (
                        ""
                      )}
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      menuPlacement="top"
                      options={expDptDates
                        ?.filter((d) => d.department === pfesiform.department)
                        ?.map((item) => ({
                          ...item,
                          label: item.fromdate,
                          value: item.fromdate,
                        }))}
                      styles={{
                        menu: (provided) => ({
                          ...provided,
                          maxHeight: 200, // Adjust the max height of the menu base
                        }),
                        menuList: (provided) => ({
                          ...provided,
                          maxHeight: 200, // Adjust the max height of the menu option list
                        }),
                      }}
                      value={{
                        label: assignExperience.assignEndTarDate,
                        value: assignExperience.assignEndTarDate,
                      }}
                      onChange={(e) => {
                        setAssignExperience({
                          ...assignExperience,
                          assignEndTarDate: e.value,
                        });
                      }}
                    />
                  </Grid>
                </>
              ) : null}
            </Grid>
            <br /> <br />
            <Box
              sx={{ display: "flex", gap: "20px", justifyContent: "center" }}
            >
              <Button variant="contained" onClick={editSubmit}>
                Save
              </Button>
              <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
                Cancel
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>

      {/* Submit DIALOG */}
      <Dialog
        open={isAddOpenalert}
        onClose={closeUpdateAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{
            padding: "37px 23px",
            width: "350px",
            textAlign: "center",
            alignItems: "center",
          }}
        >
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
          <Typography variant="h6">
            <b>Updated Successfully👍</b>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            variant="contained"
            color="error"
            onClick={closeUpdateAlert}
          >
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>
      <Box>
        {/* ALERT DIALOG */}
        <Dialog
          open={isDeleteOpenalert}
          onClose={handleCloseModalert}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "70px", color: "orange" }}
            />
            <Typography
              variant="h6"
              sx={{ color: "black", textAlign: "center" }}
            >
              Please Select any Row
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              variant="contained"
              color="error"
              onClick={handleCloseModalert}
            >
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <Box>
        <Dialog
          // open={isErrorOpen}
          onClose={handleCloseerr}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
            <Typography variant="h6"></Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error">
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* this is info view details */}

      <Dialog
        open={openInfo}
        onClose={handleCloseinfo}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        fullWidth={true}
      >
        <Box sx={{ padding: "10px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              Experience Assign Log
            </Typography>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <Typography variant="h6">Exp Log Details</Typography>
                <br />
                <Table>
                  <TableHead>
                    <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                      {"SNO"}.
                    </StyledTableCell>
                    <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                      {" "}
                      {"Mode"}
                    </StyledTableCell>
                    <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                      {" "}
                      {"Exp (month)"}
                    </StyledTableCell>
                    <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                      {" "}
                      {"Exp Date"}
                    </StyledTableCell>
                    <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                      {" "}
                      {"Date"}
                    </StyledTableCell>
                  </TableHead>
                  <TableBody>
                    {viewexplog.assignExpLog?.map((item, i) => (
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
                          {item.expmode}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {" "}
                          {item.expval}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {" "}
                          {item.expdate}
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
              </Grid>
            </Grid>
            <br />
            <br />
            <DialogActions>
              <Button variant="contained" onClick={handleCloseinfo}>
                {" "}
                Back{" "}
              </Button>
            </DialogActions>
          </>
        </Box>
      </Dialog>

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
            {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table aria-label="simple table" id="branch" ref={componentRef}>
          <TableHead sx={{ fontWeight: "600" }}>
            <StyledTableRow>
              <StyledTableCell>SI.NO</StyledTableCell>
              <StyledTableCell>Company</StyledTableCell>
              <StyledTableCell>Branch</StyledTableCell>
              <StyledTableCell>Unit</StyledTableCell>
              <StyledTableCell>Team</StyledTableCell>
              <StyledTableCell>Emp Code</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>DOJ </StyledTableCell>
              <StyledTableCell>Acutal Exp </StyledTableCell>
              <StyledTableCell>Mode </StyledTableCell>
              <StyledTableCell>Value </StyledTableCell>
              <StyledTableCell>Mode Exp </StyledTableCell>

              <StyledTableCell>End Exp </StyledTableCell>
              <StyledTableCell>End-Exp Date </StyledTableCell>
              <StyledTableCell>Prod Exp </StyledTableCell>

              <StyledTableCell>End Tar </StyledTableCell>
              <StyledTableCell>End-Tar Date </StyledTableCell>
              <StyledTableCell>Target Exp </StyledTableCell>

              <StyledTableCell>Process Code</StyledTableCell>
              <StyledTableCell>Exp. Process Code+Month </StyledTableCell>
              <StyledTableCell>Tar. Process Code+Month</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {rowDataTable &&
              rowDataTable?.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{row.company} </StyledTableCell>
                  <StyledTableCell>{row.branch} </StyledTableCell>
                  <StyledTableCell>{row.unit} </StyledTableCell>
                  <StyledTableCell>{row.team} </StyledTableCell>
                  <StyledTableCell>{row.empcode} </StyledTableCell>
                  <StyledTableCell> {row.companyname}</StyledTableCell>
                  <StyledTableCell> {row.doj}</StyledTableCell>
                  <StyledTableCell> {row.experience}</StyledTableCell>
                  <StyledTableCell> {row.assignExpMode}</StyledTableCell>
                  <StyledTableCell> {row.modevalue}</StyledTableCell>
                  <StyledTableCell> {row.modeexp}</StyledTableCell>

                  <StyledTableCell> {row.endexp}</StyledTableCell>
                  <StyledTableCell> {row.endexpdate}</StyledTableCell>
                  <StyledTableCell> {row.prodexp}</StyledTableCell>

                  <StyledTableCell> {row.endtar}</StyledTableCell>
                  <StyledTableCell> {row.endtardate}</StyledTableCell>
                  <StyledTableCell> {row.targetexp}</StyledTableCell>

                  <StyledTableCell> {row.processcode}</StyledTableCell>
                  <StyledTableCell> {row.processcodeexp}</StyledTableCell>
                  <StyledTableCell> {row.processcodetar}</StyledTableCell>
                </StyledTableRow>
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
            position: "relative",
          }}
        >
          {fileFormat === "xl" ? (
            <>
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

              <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
              <Typography variant="h5" sx={{ textAlign: "center" }}>
                Choose Export
              </Typography>
            </>
          ) : (
            <>
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

              <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
              <Typography variant="h5" sx={{ textAlign: "center" }}>
                Choose Export
              </Typography>
            </>
          )}
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
            position: "relative",
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
    </Box>
  );
}

export default Assignexperience;
