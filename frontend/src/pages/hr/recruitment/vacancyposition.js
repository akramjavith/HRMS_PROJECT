import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  TableBody,
  TableCell,
  TableRow,
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
  IconButton,
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { handleApiError } from "../../../components/Errorhandling";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Selects from "react-select";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import PageHeading from "../../../components/PageHeading";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LaunchIcon from "@mui/icons-material/Launch";
import AddIcon from "@mui/icons-material/Add";
import "../../../App.css";
import Myrequest from "./myrequest";
import { saveAs } from "file-saver";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ImageIcon from "@mui/icons-material/Image";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";

function Vacancypostion() {
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
        filteredData.map((t, i) => ({
          Sno: i + 1,
          Company: t.company,
          Branch: t.branch,
          Floor: t.floor,
          Area: t.area.join(", "),
          "Number of seats": t.seatcount,
          "Occupied Seats": checkSeatcount(t),
          "Free Seats": t.seatcount - checkSeatcount(t) || 0,
          "Notice Period": 0,
        })),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        postion?.map((t, index) => ({
          "S.No": index + 1,
          Company: t.company,
          Branch: t.branch,
          Floor: t.floor,
          Area: t.area.join(", "),
          "Number of seats": t.seatcount,
          "Occupied Seats": checkSeatcount(t),
          "Free Seats": t.seatcount - checkSeatcount(t) || 0,
          "Notice Period": 0,
        })),
        fileName
      );
    }

    setIsFilterOpen(false);
  };

  //  PDF
  const columns = [
    { title: "Company", field: "company" },
    { title: "Branch", field: "branch" },
    { title: "Floor", field: "floor" },
    { title: "Area", field: "area" },
    { title: "Number of seats", field: "seatcount" },
    { title: "Occupied Seats", field: "occupiedseats" },
    { title: "Free Seats", field: "freeseats" },
    { title: "Notice Period", field: "noticeperiod" },
  ];

  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();
    // Initialize serial number counter
    // Modify columns to include serial number column
    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" }, // Serial number column
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial =
      isfilter === "filtered"
        ? filteredData.map((t, i) => ({
            serialNumber: i + 1,
            company: t.company,
            branch: t.branch,
            floor: t.floor,
            area: t.area.join(", "),
            seatcount: t.seatcount,
            occupiedseats: checkSeatcount(t),
            freeseats: t.seatcount - checkSeatcount(t) || 0,
            noticeperiod: 0,
          }))
        : postion?.map((t, index) => ({
            serialNumber: index + 1,
            company: t.company,
            branch: t.branch,
            floor: t.floor,
            area: t.area.join(", "),
            seatcount: t.seatcount,
            occupiedseats: checkSeatcount(t),
            freeseats: t.seatcount - checkSeatcount(t) || 0,
            noticeperiod: 0,
          }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: "5" },
    });

    doc.save("Available_Vacancy_Posting.pdf");
  };

  const [postion, setPostion] = useState([]);
  const {
    isUserRoleAccess,
    isUserRoleCompare,
    isAssignBranch,
    pageName,
    setPageName,
  } = useContext(UserRoleAccessContext);

  const { auth } = useContext(AuthContext);
  const [queueCheck, setQueueCheck] = useState(false);

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [items, setItems] = useState([]);
  const [getAllDesg, setGetAllDesg] = useState([]);
  const [sorting, setSorting] = useState({ column: "", direction: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const gridRef = useRef(null);

  const [allEmp, setAllEmp] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  //image

  const handleCaptureImage = () => {
    // Find the table by its ID
    const table = document.getElementById("excelcanvastable");

    // Clone the table element
    const clonedTable = table.cloneNode(true);

    // Append the cloned table to the document body (it won't be visible)
    clonedTable.style.position = "absolute";
    clonedTable.style.top = "-9999px";
    document.body.appendChild(clonedTable);

    // Use html2canvas to capture the cloned table
    html2canvas(clonedTable).then((canvas) => {
      // Remove the cloned table from the document body
      document.body.removeChild(clonedTable);

      // Convert the canvas to a data URL and create a download link
      const dataURL = canvas.toDataURL("image/jpeg", 0.8);
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "Available_Vacancy_Posting.png";
      link.click();
    });
  };

  const setSeatsAlert = (e) => {
    if (e > singleValue.freeseates) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Available Seats {singleValue.freeseates} Enter Less Value
          </p>
        </>
      );
      handleClickOpenerr();
      let num = e.slice(0, e.length - 1);
      setUpdataData({ ...updateData, seats: num });
    }
  };

  const [designation, setDesignation] = useState([]);
  const fetchAllDesignation = async () => {
    setPageName(!pageName);
    try {
      let res_queue = await axios.get(SERVICE.DESIGNATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDesignation(
        res_queue?.data?.designation
          ?.map((t) => ({
            ...t,
            label: t.name,
            value: t.name,
          }))
          .filter(
            (value, index, self) =>
              index === self.findIndex((t) => t.value === value.value)
          )
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [showAvailable, setShowavailable] = useState(true);

  const [showAlert, setShowAlert] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };
  const username = isUserRoleAccess.username;

  const [updateData, setUpdataData] = useState({
    designationuniqid: "",
    seats: "",
    education: [],
    language: [],
    skill: [],
    designation: "Choose Designation",
    fromexperience: "",
    toexperience: "",
    fromsalary: "",
    tosalary: "",
  });
  const [isDataOpen, setIsDataOpen] = useState(false);
  const handleClickOpenData = () => {
    setIsDataOpen(true);
  };
  const handleCloseData = () => {
    setTodos([]);
    setGetAllDesg([]);
    setIsDataOpen(false);
    setUpdataData({
      designationuniqid: "",
      seats: "",
      education: [],
      language: [],
      skill: [],
      designation: "Choose Designation",
      fromexperience: "",
      toexperience: "",
      fromsalary: "",
      tosalary: "",
    });
  };

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };

  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  };

  //get all project.
  const [queueotions, setQueueOptions] = useState([]);

  //get all project.
  const fetchAllQueue = async () => {
    setPageName(!pageName);
    try {
      let resans = [];
      const [res_queue, resfloor] = await Promise.all([
        axios.get(SERVICE.MANPOWER, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.get(SERVICE.FLOOR, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
      ]);

      const accessbranch = isAssignBranch
        ?.map((data) => ({
          branch: data.branch,
          company: data.company,
        }))
        .filter((item, index, self) => {
          return (
            index ===
            self.findIndex(
              (i) => i.branch === item.branch && i.company === item.company
            )
          );
        });

      const finaldata = res_queue?.data?.manpowers.filter((data, index) => {
        accessbranch.forEach((d, i) => {
          if (d.company === data.company && d.branch === data.branch) {
            resans.push(data);
          }
        });
      });
      setPostion(resans);
      const floorall = [
        ...resfloor?.data?.floors.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      const uniqueArray = floorall.filter((item, index, self) => {
        return (
          self.findIndex(
            (i) => i.label === item.label && i.value === item.value
          ) === index
        );
      });
      setQueueOptions(uniqueArray);
      setQueueCheck(true);
    } catch (err) {
      setQueueCheck(true);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  useEffect(() => {
    fetchAllQueue();
    fetchAllDesignation();
  }, []);

  const [floorValue, setFloorValue] = useState("Please Select Floor");
  const handleClear = async () => {
    setFloorValue("Please Select Floor");
    await fetchAllQueue();
  };

  const handlefilterfloor = async (e) => {
    setPageName(!pageName);
    try {
      let resans = [];
      let res_queue = await axios.post(SERVICE.MANPOWER_FLOOR_FILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        floor: String(e.value),
      });
      const accessbranch = isAssignBranch
        ?.map((data) => ({
          branch: data.branch,
          company: data.company,
        }))
        .filter((item, index, self) => {
          return (
            index ===
            self.findIndex(
              (i) => i.branch === item.branch && i.company === item.company
            )
          );
        });

      const finaldata = res_queue?.data?.filtermanpowers.filter(
        (data, index) => {
          accessbranch.forEach((d, i) => {
            if (d.company === data.company && d.branch === data.branch) {
              resans.push(data);
            }
          });
        }
      );
      console.log(resans, "resans");
      setPostion(resans);
      setQueueCheck(true);
    } catch (err) {
      setQueueCheck(true);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [todos, setTodos] = useState([]);

  // Language Multiselect End
  const addTodo = () => {
    let totalseats = todos?.reduce((acc, data) => acc + Number(data.seats), 0);

    let isNameMatch = allApprovedSeats?.some(
      (data) =>
        data.designation === updateData.designation &&
        data.company === singleValue.company &&
        data.branch === singleValue.branch &&
        data.floor === singleValue.floor &&
        data.area.some((item) => singleValue.area?.includes(item))
    );

    let contExceed = allApprovedSeats
      ?.filter(
        (data) =>
          data.company === singleValue.company &&
          data.branch === singleValue.branch &&
          data.floor === singleValue.floor &&
          data.area.some((item) => singleValue.area?.includes(item))
      )
      ?.reduce((acc, item) => acc + (Number(item.seats) || 0), 0);

    let availSeats = singleValue.seatcount - contExceed;
    if (isNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            This Designation Already Exist in My Request
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (Number(updateData.seats) > Number(availSeats)) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Only {availSeats} seats available in my request
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      updateData.designation == "Choose Designation" ||
      updateData.designation == ""
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Please Select Designation
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (updateData.seats == "" || updateData.seats == "0") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Please Enter Seats
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      todos.some((data) => data.designation === updateData.designation)
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            This Designation Already Added!
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (totalseats + Number(updateData.seats) > singleValue.freeseates) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Already {totalseats} Seats added.{" "}
            {singleValue.freeseates - totalseats} seats are available
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      getDesignation();
    }
  };

  const getDesignation = async () => {
    let res = await axios.post(SERVICE.DESIGNATIONREQUIREMENTSFILTER, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      designation: String(updateData.designation),
    });

    if (res?.data?.individualdesignation?.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            This Designation didn't Add Specilization Eduction,Skills..etc
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (updateData !== "") {
      setTodos([
        ...todos,
        {
          designationuniqid: res?.data?.individualdesignation[0]?._id,
          seats: updateData.seats,
          designation: updateData.designation,
          education: res?.data?.individualdesignation[0]?.education,
          language: res?.data?.individualdesignation[0]?.language,
          skill: res?.data?.individualdesignation[0]?.skill,
          fromexperience: res?.data?.individualdesignation[0]?.experiencefrom,
          toexperience: res?.data?.individualdesignation[0]?.experienceto,
          fromsalary: res?.data?.individualdesignation[0]?.salaryfrom,
          tosalary: res?.data?.individualdesignation[0]?.salaryto,
          category: res?.data?.individualdesignation[0]?.category,
          department: res?.data?.individualdesignation[0]?.department,
        },
      ]);
      setUpdataData({
        designationuniqid: "",
        seats: "",
        education: [],
        language: [],
        skill: [],
        designation: "Choose Designation",
        fromexperience: "",
        toexperience: "",
        fromsalary: "",
        tosalary: "",
      });
      setGetAllDesg([updateData.designation]);
      res = [];
    }
  };
  const handleDeleteTask = (index) => {
    const newTasks = [...todos];
    newTasks.splice(index, 1);
    setTodos(newTasks);
    setGetAllDesg(newTasks);
  };

  const delvacancycheckbox = async () => {
    setPageName(!pageName);
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.MANPOWER_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);

      handleCloseModcheckbox();
      setSelectedRows([]);
      setPage(1);

      await fetchAllQueue();
      setShowAlert(
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Deleted Successfully👍"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //serial no for listing items
  const addSerialNumber = () => {
    const itemsWithSerialNumber = postion?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };

  const [singleValue, setSingleValue] = useState({});
  //get single row to edit....
  const getCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.MANPOWER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let result = allEmp.filter((data, index) => {
        return (
          data?.company === res?.data?.smanpower?.company &&
          data?.branch === res?.data?.smanpower?.branch &&
          data?.floor === res?.data?.smanpower?.floor &&
          res?.data?.smanpower?.area.includes(data?.area)
        );
      });
      setSingleValue({
        ...res?.data?.smanpower,
        occupiedseats: result?.length || 0,
        freeseates: res?.data?.smanpower?.seatcount - result?.length || 0,
      });
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const [allApprovedSeats, setAllAprovedSeats] = useState([]);

  const fetchAllApproveds = async () => {
    try {
      let res_queue = await axios.get(SERVICE.APPROVEDS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const finaldata = res_queue?.data?.approvevacancies;
      setAllAprovedSeats(finaldata);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const sendRequest = async () => {
    try {
      if (todos?.length === 0) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              Please Add Data in table
            </p>
          </>
        );
        handleClickOpenerr();
      } else {
        const updatedTodos = todos.map((todo) => ({
          ...todo,
          company: String(singleValue.company),
          area: [...singleValue.area],
          floor: String(singleValue.floor),
          branch: String(singleValue.branch),
          addedby: {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        }));
        setPageName(!pageName);

        let res_queue = await axios.post(
          SERVICE.APPROVEDS_CREATE,
          updatedTodos,

          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          }
        );
        setUpdataData({
          designationuniqid: "",
          seats: "",
          education: [],
          language: [],
          skill: [],
          designation: "Choose Designation",
          fromexperience: "",
          toexperience: "",
          fromsalary: "",
          tosalary: "",
        });
        setQueueCheck(true);
        setShowAlert(
          <>
            <CheckCircleOutlineIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Added Successfully👍"}
            </p>
          </>
        );
        handleClickOpenerr();
        handleCloseData();
        await fetchAllApproveds();
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // Edit End

  //table sorting
  const handleSorting = (column) => {
    const direction =
      sorting.column === column && sorting.direction === "asc" ? "desc" : "asc";
    setSorting({ column, direction });
  };

  const sortedData = items.sort((a, b) => {
    if (sorting.direction === "asc") {
      return a[sorting.column] > b[sorting.column] ? 1 : -1;
    } else if (sorting.direction === "desc") {
      return a[sorting.column] < b[sorting.column] ? 1 : -1;
    }
    return 0;
  });

  const renderSortingIcon = (column) => {
    if (sorting.column !== column) {
      return (
        <>
          <Box sx={{ color: "#bbb6b6" }}>
            <Grid sx={{ height: "6px", fontSize: "1.6rem" }}>
              <ArrowDropUpOutlinedIcon />
            </Grid>
            <Grid sx={{ height: "6px", fontSize: "1.6rem" }}>
              <ArrowDropDownOutlinedIcon />
            </Grid>
          </Box>
        </>
      );
    } else if (sorting.direction === "asc") {
      return (
        <>
          <Box>
            <Grid sx={{ height: "6px" }}>
              <ArrowDropUpOutlinedIcon
                style={{ color: "black", fontSize: "1.6rem" }}
              />
            </Grid>
            <Grid sx={{ height: "6px" }}>
              <ArrowDropDownOutlinedIcon
                style={{ color: "#bbb6b6", fontSize: "1.6rem" }}
              />
            </Grid>
          </Box>
        </>
      );
    } else {
      return (
        <>
          <Box>
            <Grid sx={{ height: "6px" }}>
              <ArrowDropUpOutlinedIcon
                style={{ color: "#bbb6b6", fontSize: "1.6rem" }}
              />
            </Grid>
            <Grid sx={{ height: "6px" }}>
              <ArrowDropDownOutlinedIcon
                style={{ color: "black", fontSize: "1.6rem" }}
              />
            </Grid>
          </Box>
        </>
      );
    }
  };

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

  useEffect(() => {
    fetchEmployee();
    fetchAllApproveds();
  }, []);

  const fetchEmployee = async () => {
    setPageName(!pageName);
    try {
      let res_employee = await axios.get(SERVICE.USER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setAllEmp(res_employee?.data?.users);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const checkSeatcount = (alldata) => {
    let result = allEmp.filter((data, index) => {
      return (
        data?.company === alldata?.company &&
        alldata?.area.includes(data?.area) &&
        data?.branch === alldata?.branch &&
        data?.floor === alldata?.floor
      );
    });

    return result.length;
  };

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
    addSerialNumber();
  }, [postion]);

  const fileName = "Available_Vacancy_Posting";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Available_Vacancy_Posting",
    pageStyle: "print",
  });

  return (
    <Box>
      <Headtitle title={"VACANCY POSTING"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Manage Vacancy Posting"
        modulename="Human Resources"
        submodulename="Recruitment"
        mainpagename="Vacancy Posting"
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("lvacancyposting") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid container>
              <Grid
                item
                lg={3}
                md={4}
                sm={12}
                xs={12}
                sx={{ display: "flex", justifyContent: "start" }}
              >
                <Button
                  sx={userStyle.btncancel}
                  onClick={() => {
                    setShowavailable(true);
                    setFloorValue("Please Select Floor");
                    fetchAllQueue();
                  }}
                >
                  Available
                </Button>
                &nbsp;
                <Button
                  sx={userStyle.btncancel}
                  onClick={() => {
                    setShowavailable(false);
                    setFloorValue("Please Select Floor");
                    setPostion([]);
                  }}
                >
                  My Request
                </Button>
              </Grid>
            </Grid>

            <br />

            {showAvailable ? (
              <>
                <Box style={{ padding: "20px" }}>
                  <Grid
                    container
                    sx={{ border: "2px solid #80808036", padding: "13px" }}
                    spacing={2}
                  >
                    <Grid item lg={1} md={2} sm={3} xs={12}>
                      <Typography
                        sx={userStyle.importheadtext}
                        style={{ marginTop: "7px" }}
                      >
                        <b>Filter</b>
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      lg={1}
                      md={1}
                      sm={3}
                      xs={12}
                      style={{ marginTop: "7px" }}
                    >
                      <Typography sx={userStyle.importheadtext}>
                        <b>Floor</b>
                      </Typography>
                    </Grid>
                    <Grid item lg={2} md={2} sm={3} xs={12}>
                      <Selects
                        id="component-outlined"
                        placeholder="Choose Floor"
                        value={{
                          label: floorValue,
                          value: floorValue,
                        }}
                        options={queueotions}
                        onChange={(e) => {
                          handlefilterfloor(e);
                          setFloorValue(e.value);
                        }}
                      />
                    </Grid>
                    <Grid item md={2} sm={3} xs={12}>
                      <Button
                        sx={userStyle.btncancel}
                        onClick={() => {
                          handleClear();
                        }}
                      >
                        Clear
                      </Button>
                    </Grid>
                  </Grid>
                  <br />
                  <Grid item xs={8}>
                    <Typography sx={userStyle.importheadtext}>
                      <b>Available Vacancy details</b>
                    </Typography>
                  </Grid>
                </Box>
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
                        <MenuItem value={postion?.length}>All</MenuItem>
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
                      {isUserRoleCompare?.includes("excelvacancyposting") && (
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
                      {isUserRoleCompare?.includes("csvvacancyposting") && (
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
                          </Button>{" "}
                        </>
                      )}
                      {isUserRoleCompare?.includes("printvacancyposting") && (
                        <>
                          <Button
                            sx={userStyle.buttongrp}
                            onClick={handleprint}
                          >
                            &ensp;
                            <FaPrint />
                            &ensp;Print&ensp;
                          </Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes("pdfvacancyposting") && (
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
                      {isUserRoleCompare?.includes("imagevacancyposting") && (
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
                <br />
                <br />
                {!queueCheck ? (
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
                      <TableContainer component={Paper}>
                        <Table
                          sx={{ minWidth: 700 }}
                          aria-label="customized table"
                          ref={gridRef}
                          id="excelcanvastable"
                        >
                          <TableHead sx={{ fontWeight: "600" }}>
                            <StyledTableRow>
                              <StyledTableCell
                                onClick={() => handleSorting("serialNumber")}
                              >
                                <Box sx={userStyle.tableheadstyle}>
                                  <Box>S.No</Box>
                                  <Box sx={{ marginTop: "-6PX" }}>
                                    {renderSortingIcon("serialNumber")}
                                  </Box>
                                </Box>
                              </StyledTableCell>
                              <StyledTableCell
                                onClick={() => handleSorting("company")}
                              >
                                <Box sx={userStyle.tableheadstyle}>
                                  <Box>Company</Box>
                                  <Box sx={{ marginTop: "-6PX" }}>
                                    {renderSortingIcon("company")}
                                  </Box>
                                </Box>
                              </StyledTableCell>
                              <StyledTableCell
                                onClick={() => handleSorting("branch")}
                              >
                                <Box sx={userStyle.tableheadstyle}>
                                  <Box>Branch</Box>
                                  <Box sx={{ marginTop: "-6PX" }}>
                                    {renderSortingIcon("branch")}
                                  </Box>
                                </Box>
                              </StyledTableCell>
                              <StyledTableCell
                                onClick={() => handleSorting("floor")}
                              >
                                <Box sx={userStyle.tableheadstyle}>
                                  <Box>Floor</Box>
                                  <Box sx={{ marginTop: "-6PX" }}>
                                    {renderSortingIcon("floor")}
                                  </Box>
                                </Box>
                              </StyledTableCell>
                              <StyledTableCell
                                onClick={() => handleSorting("area")}
                              >
                                <Box sx={userStyle.tableheadstyle}>
                                  <Box>Area</Box>
                                  <Box sx={{ marginTop: "-6PX" }}>
                                    {renderSortingIcon("area")}
                                  </Box>
                                </Box>
                              </StyledTableCell>
                              <StyledTableCell>Number Of Seats</StyledTableCell>
                              <StyledTableCell>Occupied Seats</StyledTableCell>
                              <StyledTableCell>Free Seats</StyledTableCell>
                              <StyledTableCell>Notice Period</StyledTableCell>
                              <StyledTableCell>Action</StyledTableCell>
                            </StyledTableRow>
                          </TableHead>
                          <TableBody>
                            {filteredData?.length > 0 ? (
                              filteredData?.map((row, index) => (
                                <StyledTableRow key={index}>
                                  <StyledTableCell>
                                    {row.serialNumber}
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    {row.company}
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    {row.branch}
                                  </StyledTableCell>
                                  <StyledTableCell>{row.floor}</StyledTableCell>
                                  <StyledTableCell>
                                    {row.area.join(", ")}
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    {row.seatcount}
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    {checkSeatcount(row)}
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    {row.seatcount - checkSeatcount(row) || 0}
                                  </StyledTableCell>
                                  <StyledTableCell>{0}</StyledTableCell>
                                  <StyledTableCell>
                                    <Grid sx={{ display: "flex" }}>
                                      {isUserRoleCompare?.includes(
                                        "evacancyposting"
                                      ) && (
                                        <Button
                                          sx={userStyle.buttonedit}
                                          onClick={() => {
                                            handleClickOpenData();
                                            getCode(row._id, row.name);
                                          }}
                                        >
                                          <LaunchIcon
                                            style={{ fontsize: "large" }}
                                          />
                                        </Button>
                                      )}
                                    </Grid>
                                  </StyledTableCell>
                                </StyledTableRow>
                              ))
                            ) : (
                              <StyledTableRow>
                                {" "}
                                <StyledTableCell colSpan={7} align="center">
                                  No Data Available
                                </StyledTableCell>{" "}
                              </StyledTableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                    <Box style={userStyle.dataTablestyle}>
                      <Box>
                        Showing{" "}
                        {filteredData.length > 0
                          ? (page - 1) * pageSize + 1
                          : 0}{" "}
                        to {Math.min(page * pageSize, filteredDatas.length)} of{" "}
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
              </>
            ) : (
              <Myrequest />
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

      <Box>
        <Dialog
          open={isDeleteOpencheckbox}
          onClose={handleCloseModcheckbox}
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
            <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
              Cancel
            </Button>
            <Button
              autoFocus
              variant="contained"
              color="error"
              onClick={(e) => delvacancycheckbox(e)}
            >
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
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
          open={isDataOpen}
          onClose={handleCloseData}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="xl"
        >
          <br />
          <Grid container spacing={2} sx={{ paddingLeft: "20px" }}>
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Approve Vacancies
              </Typography>
            </Grid>
          </Grid>
          <br />
          <hr />
          <br />
          <DialogContent style={{ height: "600px" }}>
            <>
              <Box>
                <Grid container spacing={2}>
                  <Grid item md={4} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        <b>Company:</b>
                        {singleValue.company}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        <b>Branch:</b>
                        {singleValue.branch}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        <b>Floor:</b>
                        {singleValue.floor}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        <b>Area:</b>
                        {singleValue?.area?.join(", ")}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        <b>Total Seats:</b>
                        {singleValue.seatcount}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        <b>Free Seats:</b>
                        {/* {Number(singleValue.freeseates) -
                          todos.reduce(
                            (accumulator, currentValue) =>
                              accumulator + Number(currentValue?.seats),
                            0
                          )} */}
                        {singleValue.freeseates}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        <b>In Notice Period:</b>0
                      </Typography>
                    </FormControl>
                  </Grid>
                </Grid>
                <br />
                <hr />
                <br />
                <Grid container spacing={2}>
                  <Grid item lg={1.5} md={1.5} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Designation <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        id="component-outlined"
                        type="text"
                        placeholder="Choose Designation"
                        options={designation}
                        value={{
                          label: updateData.designation,
                          value: updateData.designation,
                        }}
                        maxMenuHeight={200}
                        onChange={(e) => {
                          setUpdataData({
                            ...updateData,
                            designationuniqid: e?._id,
                            designation: e.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item lg={1} md={1} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Seats <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        sx={userStyle.input}
                        value={updateData.seats}
                        onChange={(e) => {
                          setUpdataData({
                            ...updateData,
                            seats: e.target.value,
                          });
                          setSeatsAlert(e.target.value);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item lg={1} md={2} xs={12} sm={6}>
                    <FormControl size="small">
                      <Button
                        onClick={addTodo}
                        style={{
                          backgroundColor: "#ff7600",
                          color: "white",
                          padding: "2px 1px",
                          marginTop: "30px",
                        }}
                      >
                        <AddIcon />
                        Add
                      </Button>
                    </FormControl>
                  </Grid>
                  <TableContainer component={Paper} sx={{ marginLeft: "20px" }}>
                    <br />
                    <br />
                    <Table
                      sx={{ minWidth: 700 }}
                      aria-label="customized table"
                      id="usertable"
                    >
                      <TableHead sx={{ fontWeight: "600" }}>
                        <StyledTableRow>
                          <StyledTableCell>SNo</StyledTableCell>
                          <StyledTableCell>Approved Seats</StyledTableCell>
                          <StyledTableCell>Designation</StyledTableCell>
                          <StyledTableCell>Education</StyledTableCell>
                          <StyledTableCell>Language</StyledTableCell>
                          <StyledTableCell>Skill</StyledTableCell>
                          <StyledTableCell>Experience</StyledTableCell>
                          <StyledTableCell>Salary</StyledTableCell>
                          <StyledTableCell>Action</StyledTableCell>
                        </StyledTableRow>
                      </TableHead>
                      <TableBody align="left">
                        {todos?.length > 0 ? (
                          todos?.map((row, index) => (
                            <StyledTableRow>
                              <StyledTableCell>{index + 1}</StyledTableCell>
                              <StyledTableCell>{row.seats}</StyledTableCell>
                              <StyledTableCell>
                                {row.designation}
                              </StyledTableCell>
                              <StyledTableCell>
                                {row.education?.join(",")}
                              </StyledTableCell>
                              <StyledTableCell>
                                {row.language?.join(",")}
                              </StyledTableCell>
                              <StyledTableCell>
                                {row.skill?.join(",")}
                              </StyledTableCell>
                              <StyledTableCell>
                                {row.fromexperience + "-" + row.toexperience}
                                year(s)
                              </StyledTableCell>
                              <StyledTableCell>
                                {row.fromsalary + "-" + row.tosalary + " "}
                                month(s)
                              </StyledTableCell>
                              <StyledTableCell>
                                <CloseIcon
                                  sx={{ color: "red", cursor: "pointer" }}
                                  onClick={() => {
                                    handleDeleteTask(index, row.designation);
                                  }}
                                />
                              </StyledTableCell>
                            </StyledTableRow>
                          ))
                        ) : (
                          <StyledTableRow>
                            {" "}
                            <StyledTableCell colSpan={8} align="center">
                              No Data Available
                            </StyledTableCell>{" "}
                          </StyledTableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Box>
            </>
          </DialogContent>
          <br />
          <hr />
          <Grid
            container
            spacing={2}
            sx={{ display: "flex", justifyContent: "end", paddingLeft: "22px" }}
          >
            <br />
            <Grid item lg={1} md={2} sm={6} xs={12} sx={{ marginTop: "10px" }}>
              <Grid item md={12} sm={12} xs={12}>
                <Button
                  sx={userStyle.buttonadd}
                  color="success"
                  variant="contained"
                  onClick={sendRequest}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
            <Grid item lg={1} md={2} sm={6} xs={12} sx={{ marginTop: "10px" }}>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Button
                  sx={userStyle.buttonadd}
                  onClick={handleCloseData}
                  color="error"
                  variant="contained"
                >
                  Close
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <br />
        </Dialog>

        {/* Vacancy posting available print layout */}
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
                <TableCell>Company</TableCell>
                <TableCell>Branch</TableCell>
                <TableCell>Floor</TableCell>
                <TableCell>Area</TableCell>
                <TableCell>No of Seats</TableCell>
                <TableCell>Occupied Seats</TableCell>
                <TableCell>Free Seats</TableCell>
                <TableCell>Notice Period</TableCell>
              </TableRow>
            </TableHead>
            <TableBody align="left">
              {filteredData &&
                filteredData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.company}</TableCell>
                    <TableCell>{row.branch}</TableCell>
                    <TableCell>{row.floor}</TableCell>
                    <TableCell>{row.area.join(", ")}</TableCell>
                    <TableCell>{row.seatcount}</TableCell>
                    <TableCell>{checkSeatcount(row)}</TableCell>
                    <TableCell>
                      {row.seatcount - checkSeatcount(row) || 0}
                    </TableCell>
                    <TableCell>{0}</TableCell>
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
            position: "relative",
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
          {fileFormat === "csv" ? (
            <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
          ) : (
            <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
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
              // fetchProductionClientRateArray();
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

export default Vacancypostion;
