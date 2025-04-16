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
import { userStyle, colourStyles } from "../../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../../components/Table";
import { SERVICE } from "../../../../services/Baseservice";
import moment from "moment-timezone";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useReactToPrint } from "react-to-print";
import {
  UserRoleAccessContext,
  AuthContext,
} from "../../../../context/Appcontext";
import { handleApiError } from "../../../../components/Errorhandling";
import { ThreeDots } from "react-loader-spinner";
import StyledDataGrid from "../../../../components/TableStyle";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import Headtitle from "../../../../components/Headtitle";
import PageHeading from "../../../../components/PageHeading";
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
function Assignexperience() {
  const [employees, setEmployees] = useState([]);
  const [monthSets, setMonthsets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    isUserRoleCompare,
    allUsersData,
    isAssignBranch,
    pageName,
    setPageName,
  } = useContext(UserRoleAccessContext);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { auth } = useContext(AuthContext);

  //  Datefield
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;

  let monthsArr = [
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

  let currentMonth = monthsArr[mm - 1];

  const [selectedYear, setSelectedYear] = useState(yyyy);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedMonthNum, setSelectedMonthNum] = useState(mm);

  //yeardropdown
  const years = [];
  for (let year = yyyy; year >= 1977; year--) {
    years.push({ value: year, label: year.toString() });
  }
  //month dropdown options
  const months = [
    { value: "January", label: "January", numval: 1 },
    { value: "February", label: "February", numval: 2 },
    { value: "March", label: "March", numval: 3 },
    { value: "April", label: "April", numval: 4 },
    { value: "May", label: "May", numval: 5 },
    { value: "June", label: "June", numval: 6 },
    { value: "July", label: "July", numval: 7 },
    { value: "August", label: "August", numval: 8 },
    { value: "September", label: "September", numval: 9 },
    { value: "October", label: "October", numval: 10 },
    { value: "November", label: "November", numval: 11 },
    { value: "December", label: "December", numval: 12 },
  ];

  const handleYearChange = (event) => {
    setSelectedYear(event.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.value);
    setSelectedMonthNum(event.numval);
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

  //get all employees list details
  const fetchDepartmentMonthsets = async () => {
    setPageName(!pageName);
    try {
      let res_employee = await axios.post(SERVICE.DEPTMONTHSET_LIMITED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        monthname: selectedMonth,
        year: selectedYear,
      });
      let filteredMonthsets = res_employee?.data?.departmentdetails;
      setMonthsets(filteredMonthsets);
    } catch (err) {
      setBankdetail(true);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );
  const accessbranch = isAssignBranch?.map((data) => ({
    branch: data.branch,
    company: data.company,
    unit: data.unit,
  }));

  //get all employees list details
  const fetchEmployee = async () => {
    let data_emp = allUsersData.filter((data) => {
      return accessbranch.some(
        (access) =>
          access.company === data.company &&
          access.branch === data.branch &&
          access.unit === data.unit
      );
    });
    setEmployees(data_emp);
    setBankdetail(true);
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
    return data.map((item, index) => {
      return {
        Sno: index + 1,
        Company: item.company || "",
        Branch: item.branch || "",
        Unit: item.unit || "",
        Team: item.team || "",
        Empcode: item.empcode || "",
        "Employee Name": item.companyname || "",
        Username: item.username || "",
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
        "Process Code": item.processcode || "",
        "Exp Process Code + Month": item.processcodeexp || "",
        "Target Process Code + Month": item.processcodetar || "",
      };
    });
  };

  const handleExportXL = (isfilter) => {
    const dataToExport = isfilter === "filtered" ? filteredData : items;

    if (!dataToExport || dataToExport.length === 0) {
      console.error("No data available to export");
      return;
    }

    exportToExcel(formatData(dataToExport), "Assign Experience");
    setIsFilterOpen(false);
  };

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
      ...columns.map((col) => ({ title: col.title, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial =
      isfilter === "filtered"
        ? filteredData.map((t, index) => ({
            ...t,
            serialNumber: index + 1,
            doj: t.doj ? moment(t.doj, "YYYY-MM-DD").format("DD-MM-YYYY") : "",
            endexpdate: t.endexpdate
              ? moment(t.endexpdate, "YYYY-MM-DD").format("DD-MM-YYYY")
              : "",
            endtardate: t.endtardate
              ? moment(t.endtardate, "YYYY-MM-DD").format("DD-MM-YYYY")
              : "",
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
    fetchEmployee();
  }, []);

  useEffect(() => {
    // fetchDepartmentMonthsets();
    setColumnVisibility(initialColumnVisibility);
  }, []);
  useEffect(() => {
    fetchDepartmentMonthsets();
  }, [selectedMonth, selectedYear]);

  //table entries ..,.
  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    setPageName(!pageName);
    try {
      const itemsWithSerialNumber = employees?.map((item, index) => {
        // // Extract the last item of each group
        // const lastItemsForEachMonth = Object.values(groupedByMonth);
        const groupedByMonth = {};

        // Group items by month
        item.assignExpLog.forEach((item) => {
          const monthYear = item?.updatedate?.split("-").slice(0, 2).join("-");
          if (!groupedByMonth[monthYear]) {
            groupedByMonth[monthYear] = [];
          }
          groupedByMonth[monthYear].push(item);
        });

        // Extract the last item of each group
        const lastItemsForEachMonth = Object.values(groupedByMonth).map(
          (group) => group[group.length - 1]
        );

        // Filter the data array based on the month and year
        lastItemsForEachMonth.sort((a, b) => {
          return new Date(a?.updatedate) - new Date(b?.updatedate);
        });
        // Find the first item in the sorted array that meets the criteria
        let filteredDataMonth = null;
        for (let i = 0; i < lastItemsForEachMonth.length; i++) {
          const date = lastItemsForEachMonth[i]?.updatedate;
          const splitedDate = date?.split("-");
          const itemYear = splitedDate?.length > 0 ? splitedDate[0] : 0;
          const itemMonth = splitedDate?.length > 0 ? splitedDate[1] : 0; // Adding 1 because getMonth() returns 0-indexed month
          if (
            Number(itemYear) === selectedYear &&
            Number(itemMonth) === Number(selectedMonthNum)
          ) {
            filteredDataMonth = lastItemsForEachMonth[i];
            break;
          } else if (
            Number(itemYear) < selectedYear ||
            (Number(itemYear) === selectedYear &&
              Number(itemMonth) < Number(selectedMonthNum))
          ) {
            filteredDataMonth = lastItemsForEachMonth[i]; // Keep updating the filteredDataMonth until the criteria is met
          } else {
            break; // Break the loop if we encounter an item with year and month greater than selected year and month
          }
        }
        // let modevalue = item.assignExpLog[item.assignExpLog.length - 1];
        let modevalue = filteredDataMonth;

        let selectedmonthnumvalue =
          Number(selectedMonthNum) <= 9
            ? `0${Number(selectedMonthNum)}`
            : selectedMonthNum;
        let selectedMonStartDate = `${selectedYear}-${selectedmonthnumvalue}-01`;

        let findexp = monthSets.find((d) => d.department === item.department);
        let findDate = findexp ? findexp.fromdate : selectedMonStartDate;

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

        // Calculate difference in months between findDate and item.doj
        let differenceInMonths, differenceInMonthsexp, differenceInMonthstar;
        if (modevalue) {
          //findexp end difference yes/no
          if (modevalue.endexp === "Yes") {
            differenceInMonthsexp = calculateMonthsBetweenDates(
              item.doj,
              modevalue.endexpdate
            );
            //  Math.floor((new Date(modevalue.endexpdate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
            if (modevalue.expmode === "Add") {
              differenceInMonthsexp += parseInt(modevalue.expval);
            } else if (modevalue.expmode === "Minus") {
              differenceInMonthsexp -= parseInt(modevalue.expval);
            } else if (modevalue.expmode === "Fix") {
              differenceInMonthsexp = parseInt(modevalue.expval);
            }
          } else {
            differenceInMonthsexp = calculateMonthsBetweenDates(
              item.doj,
              findDate
            );
            // Math.floor((new Date(findDate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
            if (modevalue.expmode === "Add") {
              differenceInMonthsexp += parseInt(modevalue.expval);
            } else if (modevalue.expmode === "Minus") {
              differenceInMonthsexp -= parseInt(modevalue.expval);
            } else if (modevalue.expmode === "Fix") {
              differenceInMonthsexp = parseInt(modevalue.expval);
            } else {
              // differenceInMonths = parseInt(modevalue.expval);
              differenceInMonthsexp = calculateMonthsBetweenDates(
                item.doj,
                findDate
              );
            }
          }

          //findtar end difference yes/no
          if (modevalue.endtar === "Yes") {
            differenceInMonthstar = calculateMonthsBetweenDates(
              item.doj,
              modevalue.endtardate
            );
            //  Math.floor((new Date(modevalue.endtardate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
            if (modevalue.expmode === "Add") {
              differenceInMonthstar += parseInt(modevalue.expval);
            } else if (modevalue.expmode === "Minus") {
              differenceInMonthstar -= parseInt(modevalue.expval);
            } else if (modevalue.expmode === "Fix") {
              differenceInMonthstar = parseInt(modevalue.expval);
            }
          } else {
            differenceInMonthstar = calculateMonthsBetweenDates(
              item.doj,
              findDate
            );
            if (modevalue.expmode === "Add") {
              differenceInMonthstar += parseInt(modevalue.expval);
            } else if (modevalue.expmode === "Minus") {
              differenceInMonthstar -= parseInt(modevalue.expval);
            } else if (modevalue.expmode === "Fix") {
              differenceInMonthstar = parseInt(modevalue.expval);
            } else {
              // differenceInMonths = parseInt(modevalue.expval);
              differenceInMonthstar = calculateMonthsBetweenDates(
                item.doj,
                findDate
              );
            }
          }

          differenceInMonths = calculateMonthsBetweenDates(item.doj, findDate);
          if (modevalue.expmode === "Add") {
            differenceInMonths += parseInt(modevalue.expval);
          } else if (modevalue.expmode === "Minus") {
            differenceInMonths -= parseInt(modevalue.expval);
          } else if (modevalue.expmode === "Fix") {
            differenceInMonths = parseInt(modevalue.expval);
          } else {
            // differenceInMonths = parseInt(modevalue.expval);
            differenceInMonths = calculateMonthsBetweenDates(
              item.doj,
              findDate
            );
          }
        } else {
          differenceInMonthsexp = calculateMonthsBetweenDates(
            item.doj,
            findDate
          );
          differenceInMonthstar = calculateMonthsBetweenDates(
            item.doj,
            findDate
          );
          differenceInMonths = calculateMonthsBetweenDates(item.doj, findDate);
        }

        //GET PROCESS CODE FUNCTION

        const groupedByMonthProcs = {};

        // Group items by month
        item.processlog.forEach((item) => {
          const monthYear = item.date?.split("-").slice(0, 2).join("-");
          if (!groupedByMonthProcs[monthYear]) {
            groupedByMonthProcs[monthYear] = [];
          }
          groupedByMonthProcs[monthYear].push(item);
        });

        // Extract the last item of each group
        const lastItemsForEachMonthPros = Object.values(
          groupedByMonthProcs
        ).map((group) => group[group.length - 1]);

        // Filter the data array based on the month and year
        lastItemsForEachMonthPros.sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        });
        // Find the first item in the sorted array that meets the criteria
        let filteredItem = null;
        for (let i = 0; i < lastItemsForEachMonthPros.length; i++) {
          const date = lastItemsForEachMonthPros[i].date;
          const splitedDate = date?.split("-");
          const itemYear = splitedDate && splitedDate[0];
          const itemMonth = splitedDate && splitedDate[1]; // Adding 1 because getMonth() returns 0-indexed month
          if (
            Number(itemYear) === selectedYear &&
            Number(itemMonth) === Number(selectedMonthNum)
          ) {
            filteredItem = lastItemsForEachMonthPros[i];
            break;
          } else if (
            Number(itemYear) < selectedYear ||
            (Number(itemYear) === selectedYear &&
              Number(itemMonth) < Number(selectedMonthNum))
          ) {
            filteredItem = lastItemsForEachMonthPros[i]; // Keep updating the filteredItem until the criteria is met
          } else {
            break; // Break the loop if we encounter an item with year and month greater than selected year and month
          }
        }

        // let getprocessCode = filteredItem.length > 0 ? filteredItem[0].process : "";
        const getProcessCode =
          item.processlog.length > 0
            ? item.processlog[item.processlog.length - 1].process
            : "";

        return {
          ...item,
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
      });
      setItems(itemsWithSerialNumber);
    } catch (err) {
      setBankdetail(true);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    addSerialNumber();
  }, [employees]);

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
  const searchTerms = searchQuery.toLowerCase()?.split(" ");
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

  const columnDataTable = [
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
      width: 150,
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
      width: 90,
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
      width: 80,
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
      width: 80,
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
      width: 100,
      hide: !columnVisibility.processcode,
    },
    {
      field: "processcodeexp",
      headerName: "Exp. Process Code + Month",
      flex: 0,
      width: 100,
      hide: !columnVisibility.processcodeexp,
    },
    {
      field: "processcodetar",
      headerName: "Tar. Process Code + Month",
      flex: 0,
      width: 100,
      hide: !columnVisibility.processcodetar,
    },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
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

  const handleFilter = () => {
    // fetchDepartmentMonthsets();
    addSerialNumber();
  };

  return (
    <Box>
      <NotificationContainer />
      <Headtitle title={"Assign Experience"} />
      {/* ****** Header Content ****** */}

      <PageHeading
        title="Manage Assign Experience Filter"
        modulename="Human Resources"
        submodulename="HR"
        mainpagename="Employee"
        subpagename="Employee Update Details"
        subsubpagename="Assign Experience Filter"
      />
      <br />
      {isUserRoleCompare?.includes("lassignexperiencefilter") && (
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
                  {isUserRoleCompare?.includes(
                    "excelassignexperiencefilter"
                  ) && (
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
                  {isUserRoleCompare?.includes("csvassignexperiencefilter") && (
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
                  {isUserRoleCompare?.includes(
                    "printassignexperiencefilter"
                  ) && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfassignexperiencefilter") && (
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
                  {isUserRoleCompare?.includes(
                    "imageassignexperiencefilter"
                  ) && (
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
            <Grid container spacing={2}>
              <Grid item md={3.9} xs={12} sm={12} marginTop={3}>
                <Box>
                  <Button
                    sx={userStyle.buttongrpexp}
                    size="small"
                    onClick={handleShowAllColumns}
                  >
                    Show All Columns
                  </Button>

                  <Button
                    sx={userStyle.buttongrpexp}
                    size="small"
                    onClick={handleOpenManageColumns}
                  >
                    Manage Columns
                  </Button>
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
                </Box>
              </Grid>
              <Grid item md={2} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Year<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    options={years}
                    styles={colourStyles}
                    value={{ label: selectedYear, value: selectedYear }}
                    onChange={handleYearChange}
                  />
                </FormControl>
              </Grid>
              <Grid item md={2} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Month <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    options={months}
                    styles={colourStyles}
                    value={{ label: selectedMonth, value: selectedMonth }}
                    onChange={handleMonthChange}
                  />
                </FormControl>
              </Grid>
              <Grid item md={2} xs={12} sm={6} marginTop={3}>
                <Button variant="contained" onClick={() => handleFilter()}>
                  Filter
                </Button>
              </Grid>
            </Grid>
            <br />
            {!isBankdetail ? (
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
              rowDataTable.map((row, index) => (
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
