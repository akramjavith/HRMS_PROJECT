import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, Dialog, DialogContent, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton, Select, OutlinedInput, FormControl, MenuItem, DialogActions, Grid, Paper, Table, TableHead, TableContainer, Button, TableBody } from "@mui/material";
import { userStyle } from "../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { SERVICE } from "../../services/Baseservice";
import moment from "moment-timezone";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import StyledDataGrid from "../../components/TableStyle";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../components/Errorhandling";
import { UserRoleAccessContext, AuthContext } from "../../context/Appcontext";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import Headtitle from "../../components/Headtitle";
import Selects from "react-select";
import PageHeading from "../../components/PageHeading";

function SalarySlabFilter() {
  const [employees, setEmployees] = useState([]);
  const [monthSets, setMonthsets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { isUserRoleAccess, isUserRoleCompare, isAssignBranch, pageName, setPageName } = useContext(UserRoleAccessContext);
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

  let monthsArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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
          saveAs(blob, "Target Points.png");
        });
      });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
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
    company: true,
    branch: true,
    unit: true,
    team: true,
    empcode: true,
    companyname: true,
    processcode: true,
    tarexp: true,
    processcodetar: true,
    tarpoints: true,
  };

  //get all employees list details
  const fetchDepartmentMonthsets = async () => {
    setPageName(!pageName)
    try {
      let res_employee = await axios.post(SERVICE.DEPTMONTHSET_LIMITED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        monthname: selectedMonth,
        year: selectedYear

      });
      let filteredMonthsets = res_employee.data.departmentdetails
      // .filter((item) => item.year == selectedYear && item.monthname == selectedMonth);

      setMonthsets(filteredMonthsets);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const [tarPoints, setTarpoints] = useState([]);
  //get all employees list details
  const fetchTargetpoints = async () => {
    setPageName(!pageName)
    try {
      let res_employee = await axios.get(SERVICE.TARGETPOINTS_LIMITED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTarpoints(res_employee.data.targetpoints);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  //get all employees list details
  const fetchEmployee = async () => {
    const accessbranch = isAssignBranch
      ? isAssignBranch.map((data) => ({
        branch: data.branch,
        company: data.company,
        unit: data.unit,
      }))
      : [];
      setPageName(!pageName)
      try {
        setBankdetail(true);
      let res_employee = await axios.post(SERVICE.USERSEXCELDATAASSIGNBRANCH, {
        assignbranch: accessbranch
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      // setEmployees(res_employee?.data?.users);
      let data_emp = res_employee.data.users.filter((data) => {
        return data;
        //   return data.bankname === undefined   ;
      });
      setEmployees(data_emp);
      setBankdetail(false);
    } catch (err) { setBankdetail(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
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

  //  PDF
  const columns = [
    { title: "SNo", dataKey: "serialNumber" },
    { title: "Company", dataKey: "company" },
    { title: "Branch", dataKey: "branch" },
    { title: "Unit", dataKey: "unit" },
    { title: "Team", dataKey: "team" },
    { title: "Emp Code", dataKey: "empcode" },
    { title: "Name", dataKey: "companyname" },
    { title: "Process", dataKey: "processcode" },
    { title: "Target Exp", dataKey: "tarexp" },
    { title: "Process + Target Exp", dataKey: "processcodetar" },
    { title: "Target Points", dataKey: "tarpoints" },
  ];

  const downloadPdf = () => {
    const doc = new jsPDF({
      orientation: "landscape",
    });

    doc.autoTable({
      theme: "grid",
      styles: {
        fontSize: 5,
      },
      columns: columns,
      body: rowDataTable,
    });
    doc.save("Target Points.pdf");
  };

  // Excel
  const fileName = "Target Points";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Target Points",
    pageStyle: "print",
  });

  //table entries ..,.

  const [items, setItems] = useState([]);

  const addSerialNumber = async (targetPoints) => {
    setPageName(!pageName)
    try {
      setBankdetail(true);
      const itemsWithSerialNumber = employees?.map(async (item, index) => {
        // // Extract the last item of each group
        // const lastItemsForEachMonth = Object.values(groupedByMonth);
        const groupedByMonth = {};

        // Group items by month
        item.assignExpLog.forEach((item) => {
          const monthYear = item.updatedate.split("-").slice(0, 2).join("-");
          if (!groupedByMonth[monthYear]) {
            groupedByMonth[monthYear] = [];
          }
          groupedByMonth[monthYear].push(item);
        });

        // Extract the last item of each group
        const lastItemsForEachMonth = Object.values(groupedByMonth).map((group) => group[group.length - 1]);

        // Filter the data array based on the month and year
        lastItemsForEachMonth.sort((a, b) => {
          return new Date(a.updatedate) - new Date(b.updatedate);
        });
        // Find the first item in the sorted array that meets the criteria
        let filteredDataMonth = null;
        for (let i = 0; i < lastItemsForEachMonth.length; i++) {
          const date = lastItemsForEachMonth[i].updatedate;
          const splitedDate = date.split("-");
          const itemYear = splitedDate[0];
          const itemMonth = splitedDate[1]; // Adding 1 because getMonth() returns 0-indexed month
          if (Number(itemYear) === selectedYear && Number(itemMonth) === Number(selectedMonthNum)) {
            filteredDataMonth = lastItemsForEachMonth[i];
            break;
          } else if (Number(itemYear) < selectedYear || (Number(itemYear) === selectedYear && Number(itemMonth) < Number(selectedMonthNum))) {
            filteredDataMonth = lastItemsForEachMonth[i]; // Keep updating the filteredDataMonth until the criteria is met
          } else {
            break; // Break the loop if we encounter an item with year and month greater than selected year and month
          }
        }
        // let modevalue = item.assignExpLog[item.assignExpLog.length - 1];
        let modevalue = filteredDataMonth;

        let selectedmonthnumvalue = Number(selectedMonthNum) <= 9 ? `0${Number(selectedMonthNum)}` : selectedMonthNum;
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
            differenceInMonthsexp = calculateMonthsBetweenDates(item.doj, modevalue.endexpdate);
            //  Math.floor((new Date(modevalue.endexpdate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
            if (modevalue.expmode === "Add") {
              differenceInMonthsexp += parseInt(modevalue.expval);
            } else if (modevalue.expmode === "Minus") {
              differenceInMonthsexp -= parseInt(modevalue.expval);
            } else if (modevalue.expmode === "Fix") {
              differenceInMonthsexp = parseInt(modevalue.expval);
            }
          } else {
            differenceInMonthsexp = calculateMonthsBetweenDates(item.doj, findDate);
            // Math.floor((new Date(findDate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
            if (modevalue.expmode === "Add") {
              differenceInMonthsexp += parseInt(modevalue.expval);
            } else if (modevalue.expmode === "Minus") {
              differenceInMonthsexp -= parseInt(modevalue.expval);
            } else if (modevalue.expmode === "Fix") {
              differenceInMonthsexp = parseInt(modevalue.expval);
            } else {
              // differenceInMonths = parseInt(modevalue.expval);
              differenceInMonthsexp = calculateMonthsBetweenDates(item.doj, findDate);
            }
          }

          //findtar end difference yes/no
          if (modevalue.endtar === "Yes") {
            differenceInMonthstar = calculateMonthsBetweenDates(item.doj, modevalue.endtardate);
            //  Math.floor((new Date(modevalue.endtardate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
            if (modevalue.expmode === "Add") {
              differenceInMonthstar += parseInt(modevalue.expval);
            } else if (modevalue.expmode === "Minus") {
              differenceInMonthstar -= parseInt(modevalue.expval);
            } else if (modevalue.expmode === "Fix") {
              differenceInMonthstar = parseInt(modevalue.expval);
            }
          } else {
            differenceInMonthstar = calculateMonthsBetweenDates(item.doj, findDate);
            if (modevalue.expmode === "Add") {
              differenceInMonthstar += parseInt(modevalue.expval);
            } else if (modevalue.expmode === "Minus") {
              differenceInMonthstar -= parseInt(modevalue.expval);
            } else if (modevalue.expmode === "Fix") {
              differenceInMonthstar = parseInt(modevalue.expval);
            } else {
              // differenceInMonths = parseInt(modevalue.expval);
              differenceInMonthstar = calculateMonthsBetweenDates(item.doj, findDate);
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
            differenceInMonths = calculateMonthsBetweenDates(item.doj, findDate);
          }
        } else {
          differenceInMonthsexp = calculateMonthsBetweenDates(item.doj, findDate);
          differenceInMonthstar = calculateMonthsBetweenDates(item.doj, findDate);
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
        const lastItemsForEachMonthPros = Object.values(groupedByMonthProcs).map((group) => group[group.length - 1]);

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
          if (Number(itemYear) === selectedYear && Number(itemMonth) === Number(selectedMonthNum)) {
            filteredItem = lastItemsForEachMonthPros[i];
            break;
          } else if (Number(itemYear) < selectedYear || (Number(itemYear) === selectedYear && Number(itemMonth) < Number(selectedMonthNum))) {
            filteredItem = lastItemsForEachMonthPros[i]; // Keep updating the filteredItem until the criteria is met
          } else {
            break; // Break the loop if we encounter an item with year and month greater than selected year and month
          }
        }

        // let getprocessCode = filteredItem.length > 0 ? filteredItem[0].process : "";
        let getprocessCode = filteredItem ? filteredItem.process : "";
        let procCodecheck = item.doj ? getprocessCode + (differenceInMonthstar >= 0 ? (differenceInMonthstar <= 9 ? `${differenceInMonthstar}` : differenceInMonthstar) : 0) : "";
        let findSalDetails = targetPoints.find((d) => d.branch === item.branch && d.company === item.company && d.processcode === procCodecheck);


       let tarexpvalue = differenceInMonthstar >= 0 ? (differenceInMonthstar <= 9 ? `0${differenceInMonthstar}` : differenceInMonthstar) : "00";

        return {
          ...item,
          serialNumber: index + 1,
          company: item.company,
          branch: item.branch,
          unit: item.unit,
          team: item.team,
          empcode: item.empcode,
          companyname: item.companyname,
          doj: item.doj ? moment(item.doj)?.format("DD-MM-YYYY") : "",

          experience: item.doj ? calculateMonthsBetweenDates(item.doj, findDate) : "",

          endtar: modevalue ? modevalue.endtar : "",
          endtardate: modevalue && modevalue.endtardate ? moment(modevalue.endtardate)?.format("DD-MM-YYYY") : "",
          endexp: modevalue ? modevalue.endexp : "",
          endexpdate: modevalue && modevalue.endexpdate ? moment(modevalue.endexpdate)?.format("DD-MM-YYYY") : "",

          assignExpMode: modevalue ? modevalue.expmode : "",
          modevalue: modevalue ? modevalue.expval : "",

          targetexp: item.doj ? (differenceInMonthstar > 0 ? differenceInMonthstar : 0) : "",
          prodexp: item.doj ? (differenceInMonthsexp > 0 ? differenceInMonthsexp : 0) : "",
          modeexp: item.doj ? (differenceInMonths > 0 ? differenceInMonths : 0) : "",

          processcode: item.doj ? getprocessCode : "",
          tarexp: item.doj ? tarexpvalue : "",
          processcodetar: procCodecheck,
          tarpoints: findSalDetails ? findSalDetails.points : "",
        };
      });

      const results = await Promise.all(itemsWithSerialNumber);
      setItems(results);
      setBankdetail(false);
    } catch (err) { setBankdetail(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // useEffect(() => {
  //   addSerialNumber();
  // }, [employees, tarPoints]);

  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSelectedRows([]);
    // setSelectAllChecked(false);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setSelectedRows([]);
    // setSelectAllChecked(false);
    setPage(1);
  };

  //datatable....
  const handleSearchChange = (event) => {
    setPage(1);
    setSearchQuery(event.target.value);
  };
  // Split the search query into individual terms
  const searchTerms = searchQuery.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);

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

  //   const [selectAllChecked, setSelectAllChecked] = useState(false);

  //   const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
  //     <div>
  //       <Checkbox sx={{ padding: 0 }} checked={selectAllChecked} onChange={onSelectAll} />
  //     </div>
  //   );

  const columnDataTable = [
    // {
    //   field: "checkbox",
    //   headerName: "Checkbox", // Default header name

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
    //       sx={{ padding: 0 }}
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
    //   width: 50,

    //   hide: !columnVisibility.checkbox,
    // },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 70,
      hide: !columnVisibility.serialNumber,
    },
    { field: "company", headerName: "Company", flex: 0, width: 100, hide: !columnVisibility.company },
    { field: "branch", headerName: "Branch", flex: 0, width: 140, hide: !columnVisibility.branch },
    { field: "unit", headerName: "Unit", flex: 0, width: 100, hide: !columnVisibility.unit },
    { field: "team", headerName: "Team", flex: 0, width: 110, hide: !columnVisibility.team },
    { field: "empcode", headerName: "Emp Code", flex: 0, width: 140, hide: !columnVisibility.empcode },
    { field: "companyname", headerName: "Name", flex: 0, width: 240, hide: !columnVisibility.companyname },
    // { field: "doj", headerName: "DOJ", flex: 0, width: 75, hide: !columnVisibility.doj },
    // { field: "experience", headerName: "Actual Exp", flex: 0, width: 45, hide: !columnVisibility.experience },

    // { field: "assignExpMode", headerName: "Mode", flex: 0, width: 100, hide: !columnVisibility.assignExpMode },
    // { field: "modevalue", headerName: "Value", flex: 0, width: 45, hide: !columnVisibility.modevalue },
    // { field: "modeexp", headerName: "Mode Exp", flex: 0, width: 50, hide: !columnVisibility.modeexp },

    // { field: "endexp", headerName: "End Exp", flex: 0, width: 45, hide: !columnVisibility.endexp },
    // { field: "endexpdate", headerName: "End-Exp Date", flex: 0, width: 80, hide: !columnVisibility.endexpdate },
    // { field: "prodexp", headerName: "Prod Exp", flex: 0, width: 50, hide: !columnVisibility.prodexp },

    // { field: "endtar", headerName: "End Tar", flex: 0, width: 50, hide: !columnVisibility.endtar },
    // { field: "endtardate", headerName: "End-Tar Date", flex: 0, width: 80, hide: !columnVisibility.endtardate },
    // { field: "targetexp", headerName: "Target Exp", flex: 0, width: 50, hide: !columnVisibility.targetexp },

    { field: "processcode", headerName: "Process", flex: 0, width: 100, hide: !columnVisibility.processcode },
    { field: "tarexp", headerName: "Target Exp", flex: 0, width: 100, hide: !columnVisibility.tarexp },
    // { field: "processcodeexp", headerName: "Process + Salary Exp", flex: 0, width: 90, hide: !columnVisibility.processcodeexp },
    { field: "processcodetar", headerName: "Process + Target Exp", flex: 0, width: 150, hide: !columnVisibility.processcodetar },
    { field: "tarpoints", headerName: "Target points", flex: 0, width: 120, hide: !columnVisibility.tarpoints },
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
      tarexp: item.tarexp,
      tarpoints: item.tarpoints,
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

  // useEffect(() => {
  //   fetchTargetpoints();
  // }, [employees]);

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
    <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
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
        <TextField label="Find column" variant="standard" fullWidth value={searchQueryManage} onChange={(e) => setSearchQueryManage(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
      </Box>
      <br />
      <br />
      <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumns.map((column) => (
            <ListItem key={column.field}>
              <ListItemText sx={{ display: "flex" }} primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />} secondary={column.field === "checkbox" ? "Checkbox" : column.headerName} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Grid container>
          <Grid item md={4}>
            <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibility(initialColumnVisibility)}>
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

  const handleFilter = async () => {
    const accessbranch = isAssignBranch
      ? isAssignBranch.map((data) => ({
        branch: data.branch,
        company: data.company,
        unit: data.unit,
      }))
      : [];

    // fetchDepartmentMonthsets();
    setPageName(!pageName)
    try {
      let res_employee = await axios.post(SERVICE.TARGETPOINTS_LIMITEDASSIGNBRANCH, {
        assignbranch: accessbranch
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      console.log(res_employee.data.targetpoints)
      setTarpoints(res_employee.data.targetpoints);
      addSerialNumber(res_employee.data.targetpoints);
    } catch (err) { setBankdetail(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  return (
    <Box>
      <Headtitle title={"Target Points"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Target Points Filter"
        modulename="Production"
        submodulename="SetUp"
        mainpagename="Target Points Filter"
        subpagename=""
        subsubpagename=""
      />

      <br />
      {isUserRoleCompare?.includes("ltargetpointsfilter") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Target Points List</Typography>
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
                    <MenuItem value={employees?.length}>All</MenuItem>
                  </Select>
                </Box>
              </Grid>
              <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box>
                  {isUserRoleCompare?.includes("exceltargetpointsfilter") && (
                    <>
                      <ExportXL
                        csvData={rowDataTable?.map((item, index) => ({
                          Sno: index + 1,
                          Company: item.company,
                          Branch: item.branch,
                          Unit: item.unit,
                          Team: item.team,
                          Empcode: item.empcode,
                          Companyname: item.companyname,
                          Process: item.processcode,
                          "Target Exp": item.tarexp,
                          "Process + Target Exp": item.processcodetar,
                          "Target Points": item.tarpoints,
                        }))}
                        fileName={fileName}
                      />
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvtargetpointsfilter") && (
                    <>
                      <ExportCSV
                        csvData={rowDataTable?.map((item, index) => ({
                          Sno: index + 1,
                          Company: item.company,
                          Branch: item.branch,
                          Unit: item.unit,
                          Team: item.team,
                          Empcode: item.empcode,
                          Companyname: item.companyname,
                          Process: item.processcode,
                          "Target Exp": item.tarexp,
                          "Process + Target Exp": item.processcodetar,
                          "Target Points": item.tarpoints,
                        }))}
                        fileName={fileName}
                      />
                    </>
                  )}
                  {isUserRoleCompare?.includes("printtargetpointsfilter") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdftargetpointsfilter") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}>
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imagetargetpointsfilter") && (
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                      {" "}
                      <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
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
            <Grid container spacing={2}>
              <Grid item md={3.9} xs={12} sm={12} marginTop={3}>
                <Box>
                  <Button sx={userStyle.buttongrpexp} size="small" onClick={handleShowAllColumns}>
                    Show All Columns
                  </Button>

                  <Button sx={userStyle.buttongrpexp} size="small" onClick={handleOpenManageColumns}>
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
                  <Selects options={years} value={{ label: selectedYear, value: selectedYear }} onChange={handleYearChange} />
                </FormControl>
              </Grid>
              <Grid item md={2} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Month <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects options={months} value={{ label: selectedMonth, value: selectedMonth }} onChange={handleMonthChange} />
                </FormControl>
              </Grid>
              <Grid item md={2} xs={12} sm={6} marginTop={3}>
                <Button variant="contained" onClick={() => handleFilter()}>
                  Filter
                </Button>
              </Grid>
            </Grid>
            <br />
            {isBankdetail ? (
              <>
                <Box sx={{ display: "flex", justifyContent: "center" }}>

                  <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
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
                  <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowsWithCheckboxes} columns={columnDataTable.filter((column) => columnVisibility[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true} ref={gridRef} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
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
                      <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={page === pageNumber ? "active" : ""} disabled={page === pageNumber}>
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

      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
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
              <StyledTableCell>Process</StyledTableCell>
              <StyledTableCell>Target Exp </StyledTableCell>
              <StyledTableCell>Process+Target Exp</StyledTableCell>
              <StyledTableCell>Target Points</StyledTableCell>
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
                  <StyledTableCell> {row.processcode}</StyledTableCell>
                  <StyledTableCell> {row.tarexp}</StyledTableCell>
                  <StyledTableCell> {row.processcodetar}</StyledTableCell>
                  <StyledTableCell> {row.tarpoints}</StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default SalarySlabFilter;