import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Popover,
  Select,
  Table,
  TableBody,
  TableHead,
  TextField,
  Typography
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import domtoimage from 'dom-to-image';
import { saveAs } from "file-saver";
import "jspdf-autotable";
import moment from "moment";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { Link, useParams } from "react-router-dom";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import AggregatedSearchBar from "../../../../components/AggregatedSearchBar";
import AggridTable from "../../../../components/AggridTable";
import AlertDialog from "../../../../components/Alert";
import { handleApiError } from "../../../../components/Errorhandling";
import ExportData from "../../../../components/ExportData";
import Headtitle from "../../../../components/Headtitle";
import MessageAlert from "../../../../components/MessageAlert";
import PageHeading from "../../../../components/PageHeading";
import { StyledTableCell, StyledTableRow } from "../../../../components/Table";
import { UserRoleAccessContext } from "../../../../context/Appcontext";
import { AuthContext } from "../../../../context/Appcontext.js";
import { colourStyles, userStyle } from "../../../../pageStyle";
import { SERVICE } from "../../../../services/Baseservice.js";

function AssignmanualsalarydetailsLog() {

  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);

  const [monthSets, setMonthsets] = useState([]);
  const [salSlabs, setsalSlabs] = useState([]);
  const [salaryCode, setSalaryCode] = useState([]);
  const [autoSalarySlab, setAutoSalarySlab] = useState([]);


  const [salarySetUpForm, setSalarysetupForm] = useState({
    mode: "",
    empcode: "",
    employeename: "",
    salarycode: "",
  });

  const [formValue, setFormValue] = useState({
    esideduction: false,
    pfdeduction: false,
    gross: "",
    basic: "",
    hra: "",
    conveyance: "",
    medicalallowance: "",
    productionallowance: "",
    productionallowancetwo: "",
    otherallowance: "",
  });

  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
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

  let exportColumnNames = [
    "Exp mode",
    "Date",
    "Salary Code",
    "Gross Salary",
    "Basic",
    "Hra",
    "Conveyance",
    "Medcal Allowance",
    "Production Allowance",
    "Production Allowancetwo",
    "Other Allowance",
    "Esi Deduction",
    "Pfd Eduction",
    "Start Date",
    "Created At",
  ];
  let exportRowValues = [
    "mode",
    "date",
    "salarycode",
    "gross",
    "basic",
    "hra",
    "conveyance",
    "medicalallowance",
    "productionallowance",
    "productionallowancetwo",
    "otherallowance",
    "esideductionexport",
    "pfdeductionexport",
    "startdate",
    "createdat",
  ];

  let ids = useParams().id;

  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");

  const [teamsArray, setTeamsArray] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess, buttonStyles, pageName,
    setPageName, } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [loader, setLoader] = useState(false);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const ModeOpt = [
    { label: "Manual", value: "Manual" },
    { label: "Auto", value: "Auto" },
  ];

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
  const [openview, setOpenView] = useState(false);
  const [viewDetails, setViewDetails] = useState({});
  const handleCloseView = () => {
    setOpenView(false);
  };
  const handleOpenView = () => {
    setOpenView(true);
  };
  const [ctc, setCtc] = useState("");
  const [salarySlabOpt, setSalarySlabOpt] = useState([]);
  const [expDptDates, setExpDptDates] = useState([]);
  const [isLastLog, setIsLastLog] = useState(false);
  const [editDetails, setEditDetails] = useState({
    salarycode: "",
    pfdeduction: false,
    esideduction: false
  });
  const [editDetailsOld, setEditDetailsOld] = useState({});
  const [deleteionId, setDeletionId] = useState({});
  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleOpenDelete = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseDelete = () => {
    setIsDeleteOpen(false);
  };
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleOpenEdit = () => {
    setIsEditOpen(true);
    setCtc("");
  };
  const handleCloseEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    setEditDetails({});
    setEditDetailsOld({});
    setCtc("");
  };
  //change form
  const handleChangeGross = (e) => {
    const regex = /^[0-9]+$/; // Only allows positive integers
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setEditDetails({
        ...editDetails,
        gross: inputValue,
        basic: "",
        hra: "",
        conveyance: "",
        medicalallowance: "",
        productionallowance: "",
        productionallowancetwo: "",
        otherallowance: "",
      });
    }
  };

  //change form
  const handleChangeBasic = (e) => {
    const regex = /^[0-9]+$/; // Only allows positive integers
    // const regex = /^\d*\.?\d*$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setEditDetails({
        ...editDetails,
        basic: inputValue,
        gross:
          Number(e.target.value) +
          Number(editDetails.hra) +
          Number(editDetails.conveyance) +
          Number(editDetails.medicalallowance) +
          Number(editDetails.productionallowance) +
          Number(editDetails.productionallowancetwo) +
          Number(editDetails.otherallowance),
      });
    }
  };

  //change form
  const handleChangeHra = (e) => {
    const regex = /^[0-9]+$/; // Only allows positive integers
    // const regex = /^\d*\.?\d*$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setEditDetails({
        ...editDetails,
        hra: e.target.value,
        gross:
          Number(e.target.value) +
          Number(editDetails.basic) +
          Number(editDetails.conveyance) +
          Number(editDetails.medicalallowance) +
          Number(editDetails.productionallowance) +
          Number(editDetails.productionallowancetwo) +
          Number(editDetails.otherallowance),
      });
    }
  };

  //change form
  const handleChangeConveyance = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setEditDetails({
        ...editDetails,
        conveyance: e.target.value,
        gross:
          Number(e.target.value) +
          Number(editDetails.basic) +
          Number(editDetails.hra) +
          Number(editDetails.medicalallowance) +
          Number(editDetails.productionallowance) +
          Number(editDetails.productionallowancetwo) +
          Number(editDetails.otherallowance),
      });
    }
  };
  //change form
  const handleChangeMedAllow = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setEditDetails({
        ...editDetails,
        medicalallowance: inputValue,
        gross:
          Number(e.target.value) +
          Number(editDetails.hra) +
          Number(editDetails.conveyance) +
          Number(editDetails.basic) +
          Number(editDetails.productionallowance) +
          Number(editDetails.productionallowancetwo) +
          Number(editDetails.otherallowance),
      });
    }
  };

  //change form
  const handleChangeProdAllow = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setEditDetails({
        ...editDetails,
        productionallowance: inputValue,
        gross:
          Number(e.target.value) +
          Number(editDetails.basic) +
          Number(editDetails.hra) +
          Number(editDetails.conveyance) +
          Number(editDetails.medicalallowance) +
          Number(editDetails.medicalallowance) +
          Number(editDetails.productionallowancetwo) +
          Number(editDetails.otherallowance),
      });
    }
  };

  //change form
  const handleChangeProdAllowtwo = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setEditDetails({
        ...editDetails,
        productionallowancetwo: inputValue,
        gross:
          Number(e.target.value) +
          Number(editDetails.basic) +
          Number(editDetails.hra) +
          Number(editDetails.conveyance) +
          Number(editDetails.medicalallowance) +
          Number(editDetails.medicalallowance) +
          Number(editDetails.productionallowance) +
          Number(editDetails.otherallowance),
      });
    }
  };
  //change form
  const handleChangeOtherAllow = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value;

    if (regex.test(inputValue) || inputValue === "") {
      setEditDetails({
        ...editDetails,
        otherallowance: inputValue,
        gross:
          Number(e.target.value) +
          Number(editDetails.basic) +
          Number(editDetails.hra) +
          Number(editDetails.conveyance) +
          Number(editDetails.medicalallowance) +
          Number(editDetails.medicalallowance) +
          Number(editDetails.productionallowance) +
          Number(editDetails.productionallowancetwo),
      });
    }
  };
  const fetchProfessionalTax = async (process, salarycode) => {
    setPageName(!pageName)
    try {
      let res_freq = await axios.get(SERVICE.SALARYSLAB_PROCESS_FILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        process: process,
      });
      const OptSlaball = res_freq?.data?.salaryslab;
      const OptSlab = res_freq?.data?.salaryslab.filter((slab) => {
        return slab?.salarycode === salarycode;
      });
      setEditDetails({
        ...editDetails,
        ...OptSlab[0]
      });
      setSalarySlabOpt(OptSlaball);
      setCtc(
        OptSlab[0].basic +
        OptSlab[0].hra +
        OptSlab[0].conveyance +
        OptSlab[0].medicalallowance +
        OptSlab[0].productionallowance +
        OptSlab[0].productionallowancetwo +
        OptSlab[0].otherallowance
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  //get all employees list details
  const fetchDepartmentMonthsets = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.get(SERVICE.DEPMONTHSET_ALL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setExpDptDates(res?.data?.departmentdetails);
      setMonthsets(res.data.departmentdetails);

    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }

  };

  const fetchSalarySlabs = async () => {
    try {
      let res_employee = await axios.get(SERVICE.SALARYSLAB_LIMITED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setsalSlabs(res_employee?.data?.salaryslab);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Assign Manual Salary Details Log List"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),

      addedby: [
        {
          name: String(isUserRoleAccess?.username),
          date: String(new Date()),
        },
      ],
    });

  }

  let today1 = new Date();
  var mm = String(today1.getMonth() + 1).padStart(2, "0");
  var yyyy = today1.getFullYear();
  let curMonStartDate = yyyy + "-" + mm + "-01";

  const getCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const salusr = res?.data?.suser;

      let lastexplogsalaryslab =
        res?.data?.suser.assignExpLog[
        res?.data?.suser?.assignExpLog?.length - 1
        ];

      let findexp = monthSets.find(
        (d) =>
          d.department === salusr.department &&
          new Date(salusr?.doj) >= new Date(d.fromdate) &&
          new Date(salusr?.doj) <= new Date(d.todate)
      );

      let findDate = findexp ? findexp.fromdate : curMonStartDate;


      const handleSalaryfix = (
        process,
        updatedate,
        doj,
        assignExpMode,
        assignExpvalue,
        assignEndExpvalue,
        assignEndExpDate,
        assignEndTarvalue,
        assignEndTarDate
      ) => {
        let modevalue =
          new Date(today1) > new Date(updatedate) &&
          ((assignExpMode === "Add" && assignExpvalue !== "") ||
            (assignExpMode === "Minus" && assignExpvalue !== "") ||
            (assignExpMode === "Fix" && assignExpvalue !== "") ||
            (assignEndExpvalue === "Yes" && assignEndExpDate !== "") ||
            assignEndTarvalue === "Yes" ||
            assignEndTarDate !== "");

        const calculateMonthsBetweenDates = (startDate, endDate) => {
          if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            let years = end.getFullYear() - start.getFullYear();
            let months = end.getMonth() - start.getMonth();
            let days = end.getDate() - start.getDate();

            // Convert years to months
            months += years * 12;

            // Adjust for negative days
            if (days < 0) {
              months -= 1; // Subtract a month
              days += new Date(end.getFullYear(), end.getMonth(), 0).getDate(); // Add days of the previous month
            }

            // Adjust for days 15 and above
            if (days >= 15) {
              months += 1; // Count the month if 15 or more days have passed
            }

            return months;
          }

          return 0; // Return 0 if either date is missing
        };
        let differenceInMonths, differenceInMonthsexp, differenceInMonthstar;
        if (modevalue) {
          //findexp end difference yes/no
          if (assignEndExpvalue === "Yes") {
            differenceInMonthsexp = calculateMonthsBetweenDates(
              doj,
              assignEndExpDate
            );
            differenceInMonthsexp =
              differenceInMonthsexp < 1 ? 0 : differenceInMonthsexp;
            if (assignExpMode === "Add") {
              differenceInMonthsexp += parseInt(assignExpvalue);
            } else if (assignExpMode === "Minus") {
              differenceInMonthsexp -= parseInt(assignExpvalue);
            } else if (assignExpMode === "Fix") {
              differenceInMonthsexp = parseInt(assignExpvalue);
            }
          } else {
            differenceInMonthsexp = calculateMonthsBetweenDates(doj, findDate);
            differenceInMonthsexp =
              differenceInMonthsexp < 1 ? 0 : differenceInMonthsexp;

            if (assignExpMode === "Add") {
              differenceInMonthsexp += parseInt(assignExpvalue);
            } else if (assignExpMode === "Minus") {
              differenceInMonthsexp -= parseInt(assignExpvalue);
            } else if (assignExpMode === "Fix") {
              differenceInMonthsexp = parseInt(assignExpvalue);
            } else {
              differenceInMonthsexp = calculateMonthsBetweenDates(doj, findDate);
            }
          }

          //findtar end difference yes/no
          if (modevalue.endtar === "Yes") {
            differenceInMonthstar = calculateMonthsBetweenDates(
              doj,
              assignEndTarDate
            );
            differenceInMonthstar =
              differenceInMonthstar < 1 ? 0 : differenceInMonthstar;

            if (assignExpMode === "Add") {
              differenceInMonthstar += parseInt(assignExpvalue);
            } else if (assignExpMode === "Minus") {
              differenceInMonthstar -= parseInt(assignExpvalue);
            } else if (assignExpMode === "Fix") {
              differenceInMonthstar = parseInt(assignExpvalue);
            }
          } else {
            differenceInMonthstar = calculateMonthsBetweenDates(doj, findDate);
            differenceInMonthstar =
              differenceInMonthstar < 1 ? 0 : differenceInMonthstar;

            if (assignExpMode === "Add") {
              differenceInMonthstar += parseInt(assignExpvalue);
            } else if (assignExpMode === "Minus") {
              differenceInMonthstar -= parseInt(assignExpvalue);
            } else if (assignExpMode === "Fix") {
              differenceInMonthstar = parseInt(assignExpvalue);
            } else {
              differenceInMonthstar = calculateMonthsBetweenDates(doj, findDate);
            }
          }

          differenceInMonths = calculateMonthsBetweenDates(doj, findDate);
          differenceInMonths = differenceInMonths < 1 ? 0 : differenceInMonths;

          if (assignExpMode === "Add") {
            differenceInMonths += parseInt(assignExpvalue);
          } else if (assignExpMode === "Minus") {
            differenceInMonths -= parseInt(assignExpvalue);
          } else if (assignExpMode === "Fix") {
            differenceInMonths = parseInt(assignExpvalue);
          } else {
            // differenceInMonths = parseInt(assignExpvalue);
            differenceInMonths = calculateMonthsBetweenDates(doj, findDate);
          }
        } else {
          differenceInMonthsexp = calculateMonthsBetweenDates(doj, findDate);
          differenceInMonthstar = calculateMonthsBetweenDates(doj, findDate);
          differenceInMonths = calculateMonthsBetweenDates(doj, findDate);
        }

        let getprocessCode = process;

        let processexp = doj
          ? getprocessCode +
          (differenceInMonths < 1
            ? "00"
            : differenceInMonths <= 9
              ? `0${differenceInMonths}`
              : differenceInMonths)
          : "00";

        setSalaryCode(processexp)

        let findSalDetails = salSlabs.find(
          (d) =>
            d.company == salusr?.company &&
            d.branch == salusr?.branch &&
            d.salarycode == processexp
        );

        setAutoSalarySlab(findSalDetails)


      };

      handleSalaryfix(
        salusr?.process,
        salusr?.date,
        salusr?.doj,
        salusr?.assignExpMode,
        salusr?.assignExpvalue,
        lastexplogsalaryslab?.endexp,
        lastexplogsalaryslab?.endexpdate,
        lastexplogsalaryslab?.endtar,
        lastexplogsalaryslab?.endtardate,
      )

      if (res?.data?.suser?.assignExpLog?.length > 0) {

        let lastexplog =
          res?.data?.suser.assignExpLog[
          res?.data?.suser?.assignExpLog?.length - 1
          ];
        const mondatefilter = lastexplog?.updatedate?.split("-");
        const getmonth = mondatefilter[1] === '12' ? "December" : mondatefilter[1] === '11' ? "November" : mondatefilter[1] === '10' ? "October" : mondatefilter[1] === '09' ? "September" : mondatefilter[1] === '9' ? "September" : mondatefilter[1] === '08' ? "August" : mondatefilter[1] === '8' ? "August" : mondatefilter[1] === '07' ? "July" : mondatefilter[1] === '7' ? "July" : mondatefilter[1] === '06' ? "June" : mondatefilter[1] === '6' ? "June" : mondatefilter[1] === '05' ? "May" : mondatefilter[1] === '5' ? "May" : mondatefilter[1] === '04' ? "April" : mondatefilter[1] === '4' ? "April" : mondatefilter[1] === '03' ? "March" : mondatefilter[1] === '3' ? "March" : mondatefilter[1] === '02' ? 'February' : mondatefilter[1] === '2' ? 'February' : mondatefilter[1] === '01' ? "January" : mondatefilter[1] === '1' ? "January" : "";
        // setOldDatalog(lastexplog);
        setSalarysetupForm({
          ...salarySetUpForm,
          mode: lastexplog.expmode != "Manual" ? "Auto" : "Manual",
          // salarycode: salaryCode,
          salarycode: lastexplog?.salarycode && lastexplog?.salarycode !== "Please Select Salary Code" ? lastexplog?.salarycode : "",
        });
        setFormValue({
          ...formValue,
          gross: lastexplog.gross && lastexplog.gross !== "undefined" && lastexplog.gross !== "Please Select Salary Code" ? lastexplog.gross : "",
          hra: lastexplog.hra && lastexplog.hra !== "undefined" ? lastexplog.hra : "",
          conveyance: lastexplog.conveyance && lastexplog.gross !== "undefined" ? lastexplog.conveyance : "",
          startDate: lastexplog.updatedate ? lastexplog.updatedate : "",
          startmonthlabel: getmonth,
          startmonth: mondatefilter[1],
          startyear: mondatefilter[0],
          basic: lastexplog.basic && lastexplog.basic !== "undefined" ? lastexplog.basic : "",
          medicalallowance: lastexplog.medicalallowance && lastexplog.medicalallowance !== "undefined"
            ? lastexplog.medicalallowance
            : "",
          productionallowance: lastexplog.productionallowance && lastexplog.productionallowance !== "undefined"
            ? lastexplog.productionallowance
            : "",
          productionallowancetwo: lastexplog.productionallowancetwo && lastexplog.productionallowancetwo !== "undefined"
            ? lastexplog.productionallowancetwo
            : "",
          otherallowance: lastexplog.otherallowance && lastexplog.otherallowance !== "undefined"
            ? lastexplog.otherallowance
            : "",
          pfdeduction: lastexplog.pfdeduction && lastexplog.pfdeduction !== "undefined" ? lastexplog.pfdeduction : "",
          esideduction: lastexplog.esideduction && lastexplog.esideduction !== "undefined" ? lastexplog.esideduction : "",
        });

      } else {
        setSalarysetupForm({
          ...salarySetUpForm,
          mode: "Auto",
          startDate: "",
        });
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchDepartmentMonthsets();
    getapi();
    fetchSalarySlabs();
    getCode(ids);
  }, [ids]);
  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    mode: true,
    date: true,
    salarycode: true,
    gross: true,
    basic: true,
    hra: true,
    conveyance: true,
    medicalallowance: true,
    productionallowance: true,
    productionallowancetwo: true,
    otherallowance: true,
    esideduction: true,
    pfdeduction: true,
    startdate: true,
    enddate: true,
    createdat: true,
    actions: true,
    updatename: true,

  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );


  useEffect(() => {
    addSerialNumber(teamsArray);
  }, [teamsArray]);

  useEffect(() => {
    getAssiignmanualData();
  }, []);
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
    setIsErrorOpen(true);
  };

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };
  // Manage Columns
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
  const [useData, setUserData] = useState({});
  const [teamsArrayOverall, setTeamsArrayOverall] = useState([]);
  //get all Asset Variant name.
  const getAssiignmanualData = async () => {
    setPageName(!pageName)
    try {
      setLoader(true);
      let response = await axios.get(`${SERVICE.USER_SINGLE}/${ids}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setUserData(response?.data?.suser);

      setTeamsArray(
        response?.data?.suser.assignExpLog?.filter(
          (data) => data?.expmode === "Manual" || data?.expmode === "Auto"
        ).map((item, index) => {
          return {
            ...item,
            serialNumber: index + 1,
            mode: item?.expmode,
            date: moment(item?.updatedate).format("DD-MM-YYYY"),
            salarycode: item?.salarycode,
            gross: item?.gross,
            basic: item?.basic,
            hra: item?.hra,
            conveyance: item?.conveyance,
            medicalallowance: item?.medicalallowance,
            productionallowance: item?.productionallowance,
            productionallowancetwo: item?.productionallowancetwo,
            otherallowance: item?.otherallowance,
            esideduction: item?.esideduction,
            pfdeduction: item?.pfdeduction,
            startdate: `${getMonthName(item?.startmonth)} ${item?.startyear ?? ""}`,
            enddate: `${getMonthName(item?.endmonth)} ${item?.endyear ?? ""}`,
            createdat: moment(item?.date)?.format("DD-MM-YYYY hh:mm A"),
            updatename: item.updatename,
            updatedate: item.updatedate
          };
        })
      );

      setTeamsArrayOverall(
        response?.data?.suser.assignExpLog?.filter(
          (data) => data?.expmode === "Manual" || data?.expmode === "Auto"
        ).map((item, index) => {
          return {
            ...item,
            serialNumber: index + 1,
            mode: item?.expmode,
            date: moment(item?.updatedate).format("DD-MM-YYYY"),
            salarycode: item?.salarycode,
            gross: item?.gross,
            basic: item?.basic,
            hra: item?.hra,
            conveyance: item?.conveyance,
            medicalallowance: item?.medicalallowance,
            productionallowance: item?.productionallowance,
            productionallowancetwo: item?.productionallowancetwo,
            otherallowance: item?.otherallowance,
            esideduction: item?.esideduction === true ? "Yes" : "No",
            pfdeduction: item?.pfdeduction === true ? "Yes" : "No",
            esideductionexport: item?.esideduction === true ? "Yes" : "No",
            pfdeductionexport: item?.pfdeduction === true ? "Yes" : "No",
            startdate: `${getMonthName(item?.startmonth)} ${item?.startyear ?? ""}`,
            enddate: `${getMonthName(item?.endmonth)} ${item?.endyear ?? ""}`,
            createdat: moment(item?.date)?.format("DD-MM-YYYY hh:mm A"),
            updatename: item.updatename,
            updatedate: item.updatedate
          };
        })
      );
      setLoader(false);
    } catch (err) {
      setLoader(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  const sendEditRequest = async () => {
    setPageName(!pageName)
    try {

      await axios.put(
        `${SERVICE.UPDATEANYLOG}/?logid=${editDetails?.id}&logname=assignExpLog`,
        {
          type: editDetails.mode,
          expmode: editDetails.mode,
          salarycode: editDetails.mode === "Auto" ? autoSalarySlab?.salarycode : editDetails?.salarycode,
          endexp: "No",
          endexpdate: "",
          endtar: "No",
          endtardate: "",
          basic: editDetails.mode === "Auto" ? autoSalarySlab?.basic : String(editDetails?.basic),
          hra: editDetails.mode === "Auto" ? autoSalarySlab?.hra : String(editDetails?.hra),
          conveyance: editDetails.mode === "Auto" ? autoSalarySlab?.conveyance : String(editDetails?.conveyance),
          gross: editDetails.mode === "Auto" ? autoSalarySlab?.esimaxsalary : String(editDetails?.gross),
          medicalallowance: editDetails.mode === "Auto" ? autoSalarySlab?.medicalallowance : String(editDetails?.medicalallowance),
          productionallowance: editDetails.mode === "Auto" ? autoSalarySlab?.productionallowance : String(editDetails?.productionallowance),
          otherallowance: editDetails.mode === "Auto" ? autoSalarySlab?.otherallowance : String(editDetails?.otherallowance),
          productionallowancetwo: editDetails.mode === "Auto" ? autoSalarySlab?.productionallowancetwo : String(editDetails?.productionallowancetwo),
          pfdeduction: Boolean(editDetails.pfdeduction),
          esideduction: Boolean(editDetails.esideduction),
          ctc: String(ctc),
          updatedate: String(editDetails.updatedate),
          updatename: String(isUserRoleAccess.companyname),
          date: String(new Date()),
          startmonth: String(editDetails?.startmonth),
          endmonth: String(""),
          startyear: String(editDetails?.startyear),
          endyear: String(""),

        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      await getAssiignmanualData();

      handleCloseEdit();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();

    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const handleDeleteLog = async () => {
    await axios.delete(
      `${SERVICE.DELETEANYLOG}/?logid=${deleteionId?.id}&logname=assignExpLog`,
      {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      }
    );
    await getAssiignmanualData();
    setPage(1);
    handleCloseDelete();
    setPopupContent("Deleted Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  const editSubmit = (e) => {
    e.preventDefault();

    // Check if there are any changes
    const isChanged = Object.keys(editDetails).some(
      (key) => editDetails[key] !== editDetailsOld[key]
    );
    if (
      editDetails.mode === "Auto" &&
      (editDetails.startdate === "" || editDetails.startdate === undefined)
    ) {

      setPopupContentMalert("Please Select Start Date");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      editDetails.startdate === "" ||
      editDetails.startdate === undefined
    ) {

      setPopupContentMalert("Please Select Start Date");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (editDetails.mode === "Manual" && editDetails.gross === "") {

      setPopupContentMalert("Please Enter Gross amount");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (!isChanged) {

      setPopupContentMalert("No Changes to Update");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendEditRequest();
    }
  };


  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Assign Manual Salary Details Log.png");
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
    documentTitle: "Assign Manual Salary Details Log",
    pageStyle: "print",
  });

  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTable = useRef(null);

  const getMonthName = (monthNumber) => {
    const monthNames = [
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
    if (monthNumber) {
      return monthNames[monthNumber - 1];
    } else {
      return "";
    }
  };
  //serial no for listing items
  const addSerialNumber = (data) => {
    // const itemsWithSerialNumber = teamsArray?.map((item, index) => {
    //   return {
    //     ...item,
    //     serialNumber: index + 1,
    //     mode: item?.expmode,
    //     date: moment(item?.updatedate).format("DD-MM-YYYY"),
    //     salarycode: item?.salarycode,
    //     gross: item?.gross,
    //     basic: item?.basic,
    //     hra: item?.hra,
    //     conveyance: item?.conveyance,
    //     medicalallowance: item?.medicalallowance,
    //     productionallowance: item?.productionallowance,
    //     productionallowancetwo: item?.productionallowancetwo,
    //     otherallowance: item?.otherallowance,
    //     esideduction: item?.esideduction ? "Yes" : "No",
    //     pfdeduction: item?.pfdeduction ? "Yes" : "No",
    //     startdate: `${getMonthName(item?.startmonth)} ${item?.startyear ?? ""}`,
    //     enddate: `${getMonthName(item?.endmonth)} ${item?.endyear ?? ""}`,
    //     createdat: moment(item?.date)?.format("DD-MM-YYYY hh:mm A"),
    //     updatename: item.updatename,
    //     updatedate: item.updatedate
    //   };
    // });
    setItems(data);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setSelectedRows([]);
    setSelectAllChecked(false);
    setPage(1);
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
  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const columnDataTable = [
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 100,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "mode",
      headerName: "Exp Mode",
      flex: 0,
      width: 120,
      hide: !columnVisibility.mode,
      headerClassName: "bold-header",
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0,
      width: 120,
      hide: !columnVisibility.date,
      headerClassName: "bold-header",
    },
    {
      field: "salarycode",
      headerName: "Salary Code",
      flex: 0,
      width: 100,
      hide: !columnVisibility.salarycode,
      headerClassName: "bold-header",
    },
    {
      field: "gross",
      headerName: "Gross Salary",
      flex: 0,
      width: 100,
      hide: !columnVisibility.gross,
      headerClassName: "bold-header",
    },
    {
      field: "basic",
      headerName: "Basic",
      flex: 0,
      width: 100,
      hide: !columnVisibility.basic,
      headerClassName: "bold-header",
    },
    {
      field: "hra",
      headerName: "HRA",
      flex: 0,
      width: 100,
      hide: !columnVisibility.hra,
      headerClassName: "bold-header",
    },
    {
      field: "conveyance",
      headerName: "Conveyance",
      flex: 0,
      width: 100,
      hide: !columnVisibility.conveyance,
      headerClassName: "bold-header",
    },
    {
      field: "medicalallowance",
      headerName: "Medcal Allowance",
      flex: 0,
      width: 120,
      hide: !columnVisibility.medicalallowance,
      headerClassName: "bold-header",
    },
    {
      field: "productionallowance",
      headerName: "Production Allowance",
      flex: 0,
      width: 120,
      hide: !columnVisibility.productionallowance,
      headerClassName: "bold-header",
    },
    {
      field: "productionallowancetwo",
      headerName: "Production Allowance2",
      flex: 0,
      width: 120,
      hide: !columnVisibility.productionallowancetwo,
      headerClassName: "bold-header",
    },
    {
      field: "otherallowance",
      headerName: "Other Allowance",
      flex: 0,
      width: 120,
      hide: !columnVisibility.otherallowance,
      headerClassName: "bold-header",
    },
    {
      field: "esideduction",
      headerName: "ESI deduction",
      flex: 0,
      width: 120,
      hide: !columnVisibility.esideduction,
      headerClassName: "bold-header",
    },
    {
      field: "pfdeduction",
      headerName: "PF deduction",
      flex: 0,
      width: 120,
      hide: !columnVisibility.pfdeduction,
      headerClassName: "bold-header",
    },
    {
      field: "startdate",
      headerName: "Start Date",
      flex: 0,
      width: 120,
      hide: !columnVisibility.startdate,
      headerClassName: "bold-header",
    },

    {
      field: "createdat",
      headerName: "Created At",
      flex: 0,
      width: 120,
      hide: !columnVisibility.createdat,
      headerClassName: "bold-header",
    },
    {
      field: "updatename",
      headerName: "Added By",
      flex: 0,
      width: 120,
      hide: !columnVisibility.updatename,
      headerClassName: "bold-header",
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 350,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cellRenderer: (params) => {
        return (
          <>
            {params?.data?.index === 0 ? (
              ""
            ) : (
              <Grid sx={{ display: "flex" }}>
                {isUserRoleCompare?.includes("eassignmanualsalarydetails") && (
                  <>
                    <Button
                      size="small"
                      sx={userStyle.buttondelete}
                      onClick={(e) => {

                        setEditDetails(params.data);
                        setEditDetailsOld(params.data);
                        setIsLastLog(params?.data?.index === items?.length - 1);
                        handleOpenEdit();
                      }}
                    >
                      <EditOutlinedIcon sx={buttonStyles.buttonedit} />                       </Button>
                  </>
                )}
                {isUserRoleCompare?.includes("dassignmanualsalarydetails") && (
                  <>
                    <Button
                      size="small"
                      sx={userStyle.buttondelete}
                      onClick={(e) => {
                        handleOpenDelete();
                        setDeletionId(params.data);
                        setIsLastLog(params?.data?.index === items?.length - 1);
                      }}
                    >
                      <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
                    </Button>
                  </>
                )}
              </Grid>
            )}
            <Grid sx={{ display: "flex" }}>
              {isUserRoleCompare?.includes("vassignmanualsalarydetails") && (
                <>
                  <Button
                    size="small"
                    sx={userStyle.buttondelete}
                    onClick={(e) => {
                      handleOpenView();
                      setViewDetails(params.data);
                    }}
                  >
                    <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                  </Button>
                </>
              )}
              {isUserRoleCompare?.includes("iassignmanualsalarydetails") &&
                params?.data?.logeditedby?.length > 0 && (
                  <>
                    <Button
                      size="small"
                      sx={userStyle.buttondelete}
                      onClick={(e) => {
                        handleOpeninfo();
                        setInfoDetails(params.data);
                      }}
                    >
                      <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />                      </Button>
                  </>
                )}
            </Grid>
          </>
        );
      },
    },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    console.log(item)
    const mondatefilter = item.updatedate?.split("-");
    const getmonth = mondatefilter[1] === '12' ? "December" : mondatefilter[1] === '11' ? "November" : mondatefilter[1] === '10' ? "October" : mondatefilter[1] === '09' ? "September" : mondatefilter[1] === '9' ? "September" : mondatefilter[1] === '08' ? "August" : mondatefilter[1] === '8' ? "August" : mondatefilter[1] === '07' ? "July" : mondatefilter[1] === '7' ? "July" : mondatefilter[1] === '06' ? "June" : mondatefilter[1] === '6' ? "June" : mondatefilter[1] === '05' ? "May" : mondatefilter[1] === '5' ? "May" : mondatefilter[1] === '04' ? "April" : mondatefilter[1] === '4' ? "April" : mondatefilter[1] === '03' ? "March" : mondatefilter[1] === '3' ? "March" : mondatefilter[1] === '02' ? 'February' : mondatefilter[1] === '2' ? 'February' : mondatefilter[1] === '01' ? "January" : mondatefilter[1] === '1' ? "January" : "";
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      startmonthlabel: getmonth,
      startmonth: mondatefilter[1],
      startyear: mondatefilter[0],
      mode: item?.mode,
      date: item?.date,
      salarycode: item?.salarycode,
      gross: item?.gross,
      basic: item?.basic,
      hra: item?.hra,
      conveyance: item?.conveyance,
      medicalallowance: item?.medicalallowance,
      productionallowance: item?.productionallowance,
      productionallowancetwo: item?.productionallowancetwo,
      otherallowance: item?.otherallowance,
      esideduction: item?.esideduction === true ? "Yes" : "No",
      pfdeduction: item?.pfdeduction === true ? "Yes" : "No",
      esideductionexport: item?.esideduction === true ? "Yes" : "No",
      pfdeductionexport: item?.pfdeduction === true ? "Yes" : "No",
      startdate: item?.startdate,
      enddate: item?.enddate,
      updatedate: item?.updatedate,
      updatename: item.updatename,
      createdat: item?.createdat,
      index: index,
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

  return (
    <Box>
      <Headtitle title={"Assign Manual Salary Details Log"} />
      {/* ****** Header Content ****** */}

      <PageHeading
        title="Assign Manual Salary Details Log List"
        modulename="Human Resources"
        submodulename="HR"
        mainpagename="Employee"
        subpagename="Employee Log Details"
        subsubpagename="Assign Manual Salary Details"
      />
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lassignmanualsalarydetails") && (
        <>
          {loader ? (
            <Box sx={userStyle.container}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  minHeight: "350px",
                }}
              >
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
            </Box>
          ) : (
            <Box sx={userStyle.container}>
              {/* ******************************************************EXPORT Buttons****************************************************** */}
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>

                  </Typography>
                </Grid>
                <Grid item md={3} xs={3}></Grid>
                <Grid item md={1} xs={1}>
                  <Link to={"/assignmanualsalarydetails"}>
                    <Button sx={buttonStyles.btncancel}>Back</Button>
                  </Link>
                </Grid>
              </Grid>
              <br />
              <Grid item md={3} xs={12} sm={12}>
                <Typography sx={userStyle.importheadtext}>
                  <b>Employee Name :</b> {useData?.companyname}
                </Typography>
              </Grid>
              <br />
              <Grid item md={3} xs={12} sm={12}>
                <Typography sx={userStyle.importheadtext}>
                  <b>Employee Code :</b> {useData?.empcode}
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
                      <MenuItem value={teamsArray?.length}>
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
                    {isUserRoleCompare?.includes("excelassignmanualsalarydetails") && (
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
                    {isUserRoleCompare?.includes("csvassignmanualsalarydetails") && (
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
                    {isUserRoleCompare?.includes("printassignmanualsalarydetails") && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("pdfassignmanualsalarydetails") && (
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
                    {isUserRoleCompare?.includes("imageassignmanualsalarydetails") && (
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={handleCaptureImage}
                      >
                        {" "}
                        <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                        &ensp;Image&ensp;{" "}
                      </Button>
                    )}
                  </Box>
                </Grid>

                <Grid item md={2} xs={6} sm={6}>
                  <Box>
                    <AggregatedSearchBar
                      columnDataTable={columnDataTable}
                      setItems={setItems}
                      addSerialNumber={addSerialNumber}
                      setPage={setPage}
                      maindatas={teamsArray}
                      setSearchedString={setSearchedString}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      paginated={false}
                      totalDatas={teamsArrayOverall}
                    />
                  </Box>
                </Grid>
              </Grid>
              <br />
              <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                Show All Columns
              </Button>
              &ensp;
              <Button
                sx={userStyle.buttongrp}
                onClick={handleOpenManageColumns}
              >
                Manage Columns
              </Button>
              <br />
              <br />
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
                itemsList={teamsArrayOverall}
              />
              {/* <Box
                style={{
                  width: "100%",
                  overflowY: "hidden", // Hide the y-axis scrollbar
                }}
              >
                <StyledDataGrid
                  // onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
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
              </Box> */}
              {/* ****** Table End ****** */}
            </Box>
          )}
        </>
      )}
      {/* ****** Table End ****** */}
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
              Department Log Edited By
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

      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleCloseView}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
      >
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item md={12} sm={12} xs={12}>
              <Typography sx={userStyle.HeaderText}>
                Assign Manual Salary Details Log List View <b style={{ color: 'red' }}></b>
              </Typography>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Exp Mode</Typography>
                <Typography><b>{viewDetails?.mode}</b></Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Date</Typography>
                <Typography><b>{viewDetails?.date}</b></Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Salary Code</Typography>
                <Typography><b>{viewDetails?.salarycode}</b></Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Gross Salary</Typography>
                <Typography><b>{viewDetails?.gross}</b></Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Basic</Typography>
                <Typography><b>{viewDetails?.basic}</b></Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>HRA</Typography>
                <Typography><b>{viewDetails?.hra}</b></Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Exp Mode</Typography>
                <Typography><b>{viewDetails?.mode}</b></Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Conveyance</Typography>
                <Typography><b>{viewDetails?.conveyance}</b></Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Medcal Allowance</Typography>
                <Typography><b>{viewDetails?.medicalallowance}</b></Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Exp Mode</Typography>
                <Typography><b>{viewDetails?.mode}</b></Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Production Allowance</Typography>
                <Typography><b>{viewDetails?.productionallowance}</b></Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Production Allowance2</Typography>
                <Typography><b>{viewDetails?.productionallowancetwo}</b></Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Other Allowance</Typography>
                <Typography><b>{viewDetails?.otherallowance}</b></Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>ESI deduction</Typography>
                <Typography><b>{viewDetails?.esideduction === true ? "Yes" : "No"}</b></Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>PF deduction</Typography>
                <Typography><b>{viewDetails?.pfdeduction === true ? "Yes" : "No"}</b></Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Start Date</Typography>
                <Typography><b>{viewDetails?.startdate}</b></Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Created At</Typography>
                <Typography><b>{viewDetails?.createdat}</b></Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Created By</Typography>
                <Typography><b>{viewDetails?.updatename}</b></Typography>
              </FormControl>
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <br />
              <Grid
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "15px",
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
      <Dialog
        open={isEditOpen}
        onClose={handleCloseEdit}
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
        <Box sx={{ padding: "20px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              Edit Assign Manual Salary Details Log List
            </Typography>
            <br></br>
            <Grid container spacing={2}>
              <Grid item md={3} sm={6} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Mode<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    styles={colourStyles}
                    options={ModeOpt}
                    value={{
                      label: editDetails.mode,
                      value: editDetails.mode,
                    }}
                    onChange={(e) => {
                      setEditDetails({
                        ...editDetails,
                        mode: e.value,
                        salarycode: e.value == "Manual" ? "MANUAL" : "",
                      });
                      if (e.value === "Auto") {
                        setEditDetails({
                          ...editDetails,
                          mode: e.value,
                          salarycode: autoSalarySlab?.salarycode === undefined ? "" : autoSalarySlab?.salarycode,
                          gross: "",
                          basic: "",
                          hra: "",
                          conveyance: "",
                          medicalallowance: "",
                          productionallowance: "",
                          productionallowancetwo: "",
                          otherallowance: "",
                          pfdeduction: "",
                          esideduction: ""
                        });

                      }
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid
                item
                md={3} sm={6} xs={12}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography>
                  Date<b style={{ color: "red" }}>*</b>
                </Typography>
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
                      .filter((d) =>
                        editDetails.updatedate !== undefined ||
                          editDetails.updatedate !== "" ||
                          editDetails.updatedate != "undefined" // Problematic part
                          ? d.department === useData?.department &&
                          d.fromdate >= editDetails.updatedate
                          : d.department === useData?.department
                      )
                      .map((item) => ({
                        ...item,
                        label: item.fromdate,
                        value: item.fromdate,
                      }))}
                    value={{
                      label: editDetails.updatedate,
                      value: editDetails.updatedate,
                    }}
                    onChange={(e) => {
                      const mondatefilter = e?.value?.split("-");
                      const getmonth = mondatefilter[1] === '12' ? "December" : mondatefilter[1] === '11' ? "November" : mondatefilter[1] === '10' ? "October" : mondatefilter[1] === '09' ? "September" : mondatefilter[1] === '9' ? "September" : mondatefilter[1] === '08' ? "August" : mondatefilter[1] === '8' ? "August" : mondatefilter[1] === '07' ? "July" : mondatefilter[1] === '7' ? "July" : mondatefilter[1] === '06' ? "June" : mondatefilter[1] === '6' ? "June" : mondatefilter[1] === '05' ? "May" : mondatefilter[1] === '5' ? "May" : mondatefilter[1] === '04' ? "April" : mondatefilter[1] === '4' ? "April" : mondatefilter[1] === '03' ? "March" : mondatefilter[1] === '3' ? "March" : mondatefilter[1] === '02' ? 'February' : mondatefilter[1] === '2' ? 'February' : mondatefilter[1] === '01' ? "January" : mondatefilter[1] === '1' ? "January" : "";
                      setEditDetails({ ...editDetails, startmonthlabel: getmonth, startmonth: mondatefilter[1], startyear: mondatefilter[0], updatedate: e.value, date: e.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={6} xs={12}>
                {editDetails.mode === "Manual" ? (
                  <FormControl fullWidth size="small">
                    <Typography>
                      Salary Code <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Salary Code"
                      value={editDetails?.salarycode}
                    />
                  </FormControl>
                ) : (
                  <FormControl fullWidth size="small">
                    <Typography>Salary Code</Typography>
                    <Selects
                      isDisabled
                      options={salarySlabOpt
                        .filter(
                          (item) =>
                            item.processqueue === useData.process
                        )
                        .map((sc) => ({
                          ...sc,
                          value: sc.salarycode,
                          label: sc.salarycode,
                        }))}
                      value={{
                        label: editDetails?.salarycode,
                        value: editDetails?.salarycode,
                      }}
                      onChange={(e) => {
                        setEditDetails({
                          ...editDetails,
                          salarycode: e.value,
                        });
                        fetchProfessionalTax(e.process, e.value);
                      }}
                    />
                  </FormControl>
                )}
              </Grid>
              <>
                <Grid item md={3} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Start Month <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={editDetails.startmonthlabel}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      {" "}
                      Start Year <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={editDetails.startyear}
                    />
                  </FormControl>
                </Grid>
              </>
              {/* )} */}
              <Grid item md={3} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Gross Salary <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    disabled={editDetails.mode === "Auto"}
                    placeholder="Please Enter Gross"
                    value={editDetails.mode === "Auto" ? autoSalarySlab?.esimaxsalary : editDetails.gross}
                    onChange={handleChangeGross}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>Basic</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    disabled={editDetails.mode === "Auto"}
                    placeholder="Please Enter Basic"
                    value={editDetails.mode === "Auto" ? autoSalarySlab?.basic : editDetails.basic}
                    onChange={handleChangeBasic}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>HRA</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    disabled={editDetails.mode === "Auto"}
                    placeholder="Please Enter HRA"
                    value={editDetails.mode === "Auto" ? autoSalarySlab?.hra : editDetails.hra}
                    onChange={handleChangeHra}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>Conveyance</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    disabled={editDetails.mode === "Auto"}
                    placeholder="Please Enter Conveyance"
                    value={editDetails.mode === "Auto" ? autoSalarySlab?.conveyance : editDetails.conveyance}
                    onChange={handleChangeConveyance}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>Medical Allowance</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    disabled={editDetails.mode === "Auto"}
                    placeholder="Please Enter Medical Allowance"
                    value={editDetails.mode === "Auto" ? autoSalarySlab?.medicalallowance : editDetails.medicalallowance}
                    onChange={handleChangeMedAllow}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>Production Allowance</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    disabled={editDetails.mode === "Auto"}
                    placeholder="Please Enter Production Allowance"
                    value={editDetails.mode === "Auto" ? autoSalarySlab?.productionallowance : editDetails.productionallowance}
                    onChange={handleChangeProdAllow}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>Production Allowance 2</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    disabled={editDetails.mode === "Auto"}
                    placeholder="Please Enter Production Allowance 2"
                    value={editDetails.mode === "Auto" ? autoSalarySlab?.productionallowancetwo : editDetails.productionallowancetwo}
                    onChange={handleChangeProdAllowtwo}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>Other Allowance</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    disabled={editDetails.mode === "Auto"}
                    placeholder="Please Enter Other Allowance"
                    value={editDetails.mode === "Auto" ? autoSalarySlab?.otherallowance : editDetails.otherallowance}
                    onChange={handleChangeOtherAllow}
                  />
                </FormControl>
              </Grid>

              <Grid item md={3} xs={12} sm={12}></Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Checkbox
                    sx={{ height: "20", padding: "0  25px" }}
                    checked={editDetails.esideduction}
                    disabled={editDetails.mode === "Auto"}
                    onChange={(e) => {
                      setEditDetails({
                        ...editDetails,
                        esideduction: e.target.checked,
                      });
                    }}
                  />
                  <Typography>ESI Deduction</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Checkbox
                    sx={{ height: "20", padding: "0  25px" }}
                    checked={editDetails.pfdeduction}
                    disabled={editDetails.mode === "Auto"}
                    onChange={(e) => {
                      setEditDetails({
                        ...editDetails,
                        pfdeduction: e.target.checked,
                      });
                    }}
                  />
                  <Typography>PF Deduction</Typography>
                </FormControl>
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
                    ...buttonStyles.buttonsubmit
                  }}
                  onClick={editSubmit}
                >
                  Update
                </Button>
              </Grid>
              <Grid item md={6} xs={6} sm={6}>
                <Button sx={buttonStyles.btncancel} onClick={handleCloseEdit}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </>
        </Box>
      </Dialog>

      {/* ALERT DIALOG */}
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
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
        itemsTwo={teamsArrayOverall ?? []}
        filename={"Assign Manual Salary Details Log"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />

      {/* EXTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}

export default AssignmanualsalarydetailsLog;