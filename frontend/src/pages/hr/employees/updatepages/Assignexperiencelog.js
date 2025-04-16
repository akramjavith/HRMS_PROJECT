import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  Dialog,
  Select,
  MenuItem,
  TableBody,
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
  Checkbox,
  TextField,
  IconButton,
} from "@mui/material";
import { userStyle } from "../../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../../components/Table";
import { SERVICE } from "../../../../services/Baseservice";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import StyledDataGrid from "../../../../components/TableStyle";
import { useReactToPrint } from "react-to-print";
import moment from "moment-timezone";
import { useParams } from "react-router-dom";
import {
  UserRoleAccessContext,
  AuthContext,
} from "../../../../context/Appcontext";
import { handleApiError } from "../../../../components/Errorhandling";
import Headtitle from "../../../../components/Headtitle";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";

function CategoryMaster() {
  const gridRef = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);
  const [monthSets, setMonthsets] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [logDatas, setLogDatas] = useState([]);
  const { isUserRoleCompare } = useContext(UserRoleAccessContext);
  const [copiedData, setCopiedData] = useState("");

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Assign Experience Log.png");
        });
      });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  //get all employees list details
  const fetchDepartmentMonthsets = async () => {
    try {
      let res_employee = await axios.get(SERVICE.DEPMONTHSET_ALL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setMonthsets(res_employee?.data?.departmentdetails);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const id = useParams().id;

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { auth } = useContext(AuthContext);

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
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
  const idval = open ? "simple-popover" : undefined;

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
    companyname: true,
    doj: true,
    department: true,
    empcode: true,
    company: true,
    branch: true,
    unit: true,
    team: true,
    expval: true,
    expmode: true,
    expdate: true,
    experience: true,
    prodexp: true,
    modeexp: true,
    targetexp: true,
    endexp: true,
    endexpdate: true,
    endtar: true,
    updatedmonthyear: true,
    endtardate: true,
    updatedTime: true,
    updatename: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  //get all category.
  const fetchAllCategory = async () => {
    try {
      let res_module = await axios.get(`${SERVICE.USER_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let values = res_module?.data?.suser.assignExpLog.map((item) => {
        const dateObject = new Date(item.date);

        // Extracting date
        const year = dateObject.getFullYear();
        const month = String(dateObject.getMonth() + 1).padStart(2, "0");
        const date = String(dateObject.getDate()).padStart(2, "0");

        const formattedDate = `${date}-${month}-${year}`;

        const options = { hour12: true };

        const formattedTime = dateObject.toLocaleTimeString("en-US", options);

        return {
          ...item,
          username: res_module?.data?.suser.companyname,
          doj: res_module?.data?.suser.doj,
          department: res_module?.data?.suser.department,
          empcode: res_module?.data?.suser.empcode,
          company: res_module?.data?.suser.company,
          branch: res_module?.data?.suser.branch,
          unit: res_module?.data?.suser.unit,
          team: res_module?.data?.suser.team,
          updatedTime: formattedDate + " / " + formattedTime,
          userUpdatedDate: formattedDate,
        };
      });

      setLogDatas(values);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
        DOJ: item.doj
          ? moment(item.doj, "YYYY-MM-DD").format("DD-MM-YYYY")
          : "",
        "Actual Exp": item.experience || "",
        "Pro Mode": item.expmode || "",
        "Pro Value": item.expval || "",
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
        "Process Code":
          item.processcode === "Please Select Process" ? "" : item.processcode,
        "Exp Process Code + Month": item.processcodeexp || "",
        "Target Process Code + Month": item.processcodetar || "",

        "Target Exp": item.targetexp || "",
        "Last Updated": item.updatedmonthyear,
        updatedTime: item.updatedTime,
        updatename: item.updatename,
      };
    });
  };

  const handleExportXL = (isfilter) => {
    const dataToExport = isfilter === "filtered" ? rowDataTable : items;

    if (!dataToExport || dataToExport.length === 0) {
      console.error("No data available to export");
      return;
    }

    exportToExcel(formatData(dataToExport), "Assign Experience");
    setIsFilterOpen(false);
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
    { title: "DOJ", dataKey: "doj" },
    { title: "Actual Exp", dataKey: "experience" },
    { title: "Mode", dataKey: "expmode" },
    { title: "Value", dataKey: "expval" },
    { title: "Mode Exp", dataKey: "modeexp" },

    { title: "End Exp", dataKey: "endexp" },
    { title: "End-Exp Date", dataKey: "endexpdate" },
    { title: "Prod Exp", dataKey: "prodexp" },

    { title: "End Tar", dataKey: "endtar" },
    { title: "End-Tar Date", dataKey: "endtardate" },
    { title: "Target Exp", dataKey: "targetexp" },
    { title: "Last Updated", dataKey: "updatedmonthyear" },
    { title: "Updated Date/Time", dataKey: "updatedTime" },
    { title: "UpdatedBy", dataKey: "updatename" },
  ];

  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();

    // Initialize serial number counter
    // Modify columns to include serial number column
    const columnsWithSerial = [
      { title: "S.No", dataKey: "serialNumber" }, // Serial number column
      ...columns.map((col) => ({ title: col.title, dataKey: col.dataKey })),
    ];

    // Modify row data to include serial number
    const dataWithSerial =
      isfilter === "filtered"
        ? rowDataTable.map((t, index) => ({
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

    doc.save("Assign Experience Log.pdf");
  };
  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Assign Experience Log",
    pageStyle: "print",
  });

  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchAllCategory();
  }, []);

  useEffect(() => {
    fetchDepartmentMonthsets();
  }, []);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = logDatas?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));

    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [logDatas]);

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
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
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
      width: 30,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 80,
      hide: !columnVisibility.company,
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 100,
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
      width: 70,
      hide: !columnVisibility.team,
    },
    {
      field: "empcode",
      headerName: "Emp code",
      flex: 0,
      width: 110,
      hide: !columnVisibility.empcode,
    },
    {
      field: "companyname",
      headerName: "Name",
      flex: 0,
      width: 150,
      hide: !columnVisibility.companyname,
    },
    {
      field: "doj",
      headerName: "DOJ",
      flex: 0,
      width: 80,
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
      field: "expmode",
      headerName: "Pro Mode",
      flex: 0,
      width: 90,
      hide: !columnVisibility.expmode,
    },
    {
      field: "expval",
      headerName: "Pro Value",
      flex: 0,
      width: 35,
      hide: !columnVisibility.expval,
    },
    {
      field: "modeexp",
      headerName: "Mode Exp",
      flex: 0,
      width: 40,
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
      width: 45,
      hide: !columnVisibility.prodexp,
    },

    {
      field: "endtar",
      headerName: "End Tar",
      flex: 0,
      width: 45,
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
      width: 45,
      hide: !columnVisibility.targetexp,
    },

    {
      field: "updatedmonthyear",
      headerName: "Last Updated",
      flex: 0,
      width: 80,
      hide: !columnVisibility.updatedmonthyear,
    },
    {
      field: "updatedTime",
      headerName: "Updated Date/Time",
      flex: 0,
      width: 120,
      hide: !columnVisibility.updatedTime,
      headerClassName: "custom-header",
      cellClassName: "custom-cell",
    },
    {
      field: "updatename",
      headerName: "Updated By",
      flex: 0,
      width: 120,
      hide: !columnVisibility.updatename,
      headerClassName: "custom-header",
      cellClassName: "custom-cell",
    },
  ];

  const rowDataTable = filteredData.map((item, index) => {
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

    let findyear = item.updatedate.split("-");
    const monthnumber = findyear[1];
    const month = months[Number(monthnumber - 1)];
    const year = findyear[0];
    let thatTimeMonStartDate = year + "-" + month + "-01";

    let findexp = monthSets.find(
      (d) =>
        d.year == year &&
        d.monthname == month &&
        d.department === item.department
    );

    let findDate = findexp ? findexp.fromdate : thatTimeMonStartDate;

    // Calculate difference in months between findDate and item.doj
    let differenceInMonths, differenceInMonthsexp, differenceInMonthstar;
    if (item) {
      //findexp end difference yes/no
      if (item.endexp === "Yes") {
        differenceInMonthsexp = Math.floor(
          (new Date(item.endexpdate) - new Date(item.doj)) /
            (30 * 24 * 60 * 60 * 1000)
        );
        if (item.expmode === "Add") {
          differenceInMonthsexp += parseInt(item.expval);
        } else if (item.expmode === "Minus") {
          differenceInMonthsexp -= parseInt(item.expval);
        } else if (item.expmode === "Fix") {
          differenceInMonthsexp = parseInt(item.expval);
        }
        if (differenceInMonthsexp < 0) {
          differenceInMonthsexp = 0;
        }
      } else {
        differenceInMonthsexp = Math.floor(
          (new Date(findDate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000)
        );
        if (item.expmode === "Add") {
          differenceInMonthsexp += parseInt(item.expval);
        } else if (item.expmode === "Minus") {
          differenceInMonthsexp -= parseInt(item.expval);
        } else if (item.expmode === "Fix") {
          differenceInMonthsexp = parseInt(item.expval);
        } else {
          // differenceInMonths = parseInt(item.expval);
          differenceInMonthsexp = Math.floor(
            (new Date(findDate) - new Date(item.doj)) /
              (30 * 24 * 60 * 60 * 1000)
          );
        }
        if (differenceInMonthsexp < 0) {
          differenceInMonthsexp = 0;
        }
      }

      //findtar end difference yes/no
      if (item.endtar === "Yes") {
        differenceInMonthstar = Math.floor(
          (new Date(item.endtardate) - new Date(item.doj)) /
            (30 * 24 * 60 * 60 * 1000)
        );
        if (item.expmode === "Add") {
          differenceInMonthstar += parseInt(item.expval);
        } else if (item.expmode === "Minus") {
          differenceInMonthstar -= parseInt(item.expval);
        } else if (item.expmode === "Fix") {
          differenceInMonthstar = parseInt(item.expval);
        }
        if (differenceInMonthstar < 0) {
          differenceInMonthstar = 0;
        }
      } else {
        differenceInMonthstar = Math.floor(
          (new Date(findDate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000)
        );
        if (item.expmode === "Add") {
          differenceInMonthstar += parseInt(item.expval);
        } else if (item.expmode === "Minus") {
          differenceInMonthstar -= parseInt(item.expval);
        } else if (item.expmode === "Fix") {
          differenceInMonthstar = parseInt(item.expval);
        } else {
          // differenceInMonths = parseInt(item.expval);
          differenceInMonthstar = Math.floor(
            (new Date(findDate) - new Date(item.doj)) /
              (30 * 24 * 60 * 60 * 1000)
          );
        }
        if (differenceInMonthstar < 0) {
          differenceInMonthstar = 0;
        }
      }

      differenceInMonths = Math.floor(
        (new Date(findDate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000)
      );
      if (item.expmode === "Add") {
        differenceInMonths += parseInt(item.expval);
      } else if (item.expmode === "Minus") {
        differenceInMonths -= parseInt(item.expval);
      } else if (item.expmode === "Fix") {
        differenceInMonths = parseInt(item.expval);
      } else {
        // differenceInMonths = parseInt(item.expval);
        differenceInMonths = Math.floor(
          (new Date(findDate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000)
        );
      }
      if (differenceInMonths < 0) {
        differenceInMonths = 0;
      }
    } else {
      differenceInMonthsexp = Math.floor(
        (new Date(findDate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000)
      );
      differenceInMonthstar = Math.floor(
        (new Date(findDate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000)
      );
      differenceInMonths = Math.floor(
        (new Date(findDate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000)
      );
    }
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

    return {
      id: item._id,
      serialNumber: item.serialNumber,
      companyname: item.username,

      department: item.department,
      empcode: item.empcode,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      updatedTime: item.updatedTime,
      updatename: item.updatename,

      doj: item.doj ? moment(item.doj)?.format("DD-MM-YYYY") : "",
      experience: calculateMonthsBetweenDates(item.doj, findDate),

      endtar: item.endtar,
      endtardate: item.endtardate
        ? moment(item.endtardate)?.format("DD-MM-YYYY")
        : "",
      targetexp: item.doj ? differenceInMonthstar : "",

      endexp: item.endexp,
      endexpdate: item.endexpdate
        ? moment(item.endexpdate)?.format("DD-MM-YYYY")
        : "",
      prodexp: item.doj ? differenceInMonthsexp : "",

      expmode: item.expmode,
      expval: item.expval,
      modeexp: item.doj ? differenceInMonths : "",

      updatedmonthyear: item.updatedate
        ? moment(item.updatedate)?.format("DD-MM-YYYY")
        : "",
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
      <Headtitle title={"Assign Experience Log"} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>
        Assign Experience Log Details
      </Typography>
      <br />
      {/* ****** Table Start ****** */}

      {isUserRoleCompare?.includes("lassignexperience") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            {/*       
          <Box sx={userStyle.container} > */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Assign Experience Log
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
            {/* {isUserRoleCompare?.includes("bdassignexperience") && (
              <Button variant="contained" color="error" onClick={handleClickOpenalert}>
                Bulk Delete
              </Button>
            )} */}
            <Popover
              id={idval}
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
            <br />
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
              {/* ****** Table End ****** */}
            </>
            {/* } */}
          </Box>
        </>
      )}
      {/* Manage Column */}

      {/* Delete Modal */}
      <Box>
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
                <StyledTableCell>Last Updated </StyledTableCell>
                <StyledTableCell>Updated Date/Time </StyledTableCell>
                <StyledTableCell>Updated By </StyledTableCell>
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
                    <StyledTableCell> {row.expmode}</StyledTableCell>
                    <StyledTableCell> {row.expval}</StyledTableCell>
                    <StyledTableCell> {row.modeexp}</StyledTableCell>

                    <StyledTableCell> {row.endexp}</StyledTableCell>
                    <StyledTableCell> {row.endexpdate}</StyledTableCell>
                    <StyledTableCell> {row.prodexp}</StyledTableCell>

                    <StyledTableCell> {row.endtar}</StyledTableCell>
                    <StyledTableCell> {row.endtardate}</StyledTableCell>
                    <StyledTableCell> {row.targetexp}</StyledTableCell>
                    <StyledTableCell> {row.updatedmonthyear}</StyledTableCell>
                    <StyledTableCell> {row.updatedTime}</StyledTableCell>
                    <StyledTableCell> {row.updatename}</StyledTableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

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

export default CategoryMaster;
