import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box, Typography, OutlinedInput, Select, MenuItem, FormControl,
  Grid, Divider, Button,
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { handleApiError } from "../../../components/Errorhandling";
import { FaDownload, FaTrash } from "react-icons/fa";
import { MultiSelect } from "react-multi-select-component";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import LoadingButton from "@mui/lab/LoadingButton";
import { CsvBuilder } from "filefy";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import Selects from "react-select";
import SendToServer from "../../sendtoserver";
import * as XLSX from 'xlsx';
import AlertDialog from "../../../components/Alert";
import MessageAlert from "../../../components/MessageAlert";
import PageHeading from "../../../components/PageHeading";

function PaidStatusFix() {
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
  };
  const handleClosePopupMalert = () => {
    setOpenPopupMalert(false);
  };
  const [updateSheet, setUpdatesheet] = useState([])
  const [valueCate, setValueCate] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const handleClickOpenPopup = () => {
    setOpenPopup(true);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  //get current month
  let month = new Date().getMonth() + 1;
  let year = new Date().getFullYear();
  const ans = new Date().getMonth();
  //get current year
  const currentYear = new Date().getFullYear();
  const years = Array.from(new Array(10), (val, index) => currentYear - index);
  const getyear = years.map((year) => {
    return { value: year, label: year };
  });

  //get all months
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];
  const check = months.find((item) => item.value === ans + 1);
  const [paidstatusfix, setPaidstatusfix] = useState({
    department: "Please Select Department",
    month: check.label,
    year: year,
    frequency: "",
    absentmodes: "Between",
    fromvalue: "",
    tovalue: "",
    achievedmodes: "Between",
    frompoint: "",
    topoint: "",
    currentabsentmodes: "Less Than or Equal",
    currentabsentvalue: "",
    currentachievedmodes: "Less Than or Equal",
    currentachievedvalue: "",
    paidstatus: "",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [paidstatusfixs, setPaidstatusfixs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName } = useContext(
    UserRoleAccessContext
  );
  const { auth } = useContext(AuthContext);
  const [absentmodes, setAbsentmodes] = useState("Between");
  const [achievedmodes, setAchievedmodes] = useState("Between");
  const [currentabsentmodes, setCurrentabsentmodes] = useState("Less Than or Equal");
  const [currentachievedmodes, setCurrentachievedmodes] = useState("Less Than or Equal");
  const [isXeroxLoad, setIsXeroxLoad] = useState(false);

  // excelupload
  const [fileUploadName, setFileUploadName] = useState("");
  const [sheets, setSheets] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState("Please Select Sheet");
  const [splitArray, setSplitArray] = useState([]);
  const [selectedSheetindex, setSelectedSheetindex] = useState();
  const [loading, setLoading] = useState(false);
  const [dataupdated, setDataupdated] = useState("");
  //  Datefield
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = dd + "-" + mm + "-" + yyyy;
  let currentdate = new Date();
  let currentyear = currentdate.getFullYear();
  // get current month in string name
  const monthstring = [
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
  let monthname = monthstring[new Date().getMonth()];
  const ExportsHead = () => {
    const columns = [
      "Department",
      "Month",
      "Year",
      "Frequency",
      "Absent Mode",
      "Absent From Value",
      "Absent To Value",
      "Achieved Mode",
      "Achieved From Value",
      "Achieved To Value",
      "Current Absent Mode",
      "Current Absent Value",
      "Current Achieved Mode",
      "Current Achieved Value",
      "Paid Status",
    ];
    const capitalizedColumns = columns.map((column) => {
      // Capitalize the first letter of each word in the column name
      const words = column.split(" ");
      const capitalizedWords = words.map(
        (word) => word.charAt(0)?.toUpperCase() + word.slice(1)?.toLowerCase()
      );
      return capitalizedWords.join(" ");
    });
    const dataRow = [
      "",
      monthname,
      currentyear,
      "",
      "Between",
      "",
      "",
      "Between",
      "",
      "",
      "Less Than or Equal",
      "",
      "Less Than or Equal",
      "",
      "",
    ];
    if (selectedOptionsCate.length == 0) {
      let alertMsg = "Please Select Department";
      setPopupContentMalert(alertMsg);
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      new CsvBuilder(`Filename_ ${today}`)
        .setColumns(capitalizedColumns)
        .addRow(dataRow)
        .exportFile();
    }
  };
  const readExcel = (file) => {
    if (selectedOptionsCate.length === 0) {
      setPopupContentMalert("Please Select Department");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return;
    }
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        // Check for missing required fields
        const invalidEntries = data.filter(
          (item) => !item.Frequency || !item["Paid Status"]
        );
        if (invalidEntries.length > 0) {
          setPopupContentMalert("Frequency and Paid Status Must be Required");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return;
        }
        // Check for incorrect format in Paid Status
        const incorrectFormatEntries = data.filter(
          (item) => item["Paid Status"] && !item["Paid Status"].includes("_")
        );
        if (incorrectFormatEntries.length > 0) {
          setPopupContentMalert("Please Enter Paid Status Format Correctly");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return;
        }
        // Remove duplicates within the Excel file itself
        const uniqueData = data.reduce((acc, current) => {
          const isDuplicate = acc.some((item) =>
            item.Frequency === current.Frequency &&
            item["Paid Status"] === current["Paid Status"] &&
            item["Absent Mode"] === current["Absent Mode"] &&
            item["Absent From Value"] === current["Absent From Value"] &&
            item["Absent To Value"] === current["Absent To Value"] &&
            item["Achieved Mode"] === current["Achieved Mode"] &&
            item["Achieved From Value"] === current["Achieved From Value"] &&
            item["Achieved To Value"] === current["Achieved To Value"] &&
            item["Current Absent Mode"] === current["Current Absent Mode"] &&
            item["Current Absent Value"] === current["Current Absent Value"] &&
            item["Current Achieved Mode"] === current["Current Achieved Mode"] &&
            item["Current Achieved Value"] === current["Current Achieved Value"]
          );
          if (!isDuplicate) {
            acc.push(current);
          }
          return acc;
        }, []);
        resolve(uniqueData);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
    promise.then((data) => {
      console.log(data)
      console.log(paidstatusfixsDup)
      // Check for duplicates against existing data
      const uniqueArray = data.filter((item) =>
        !paidstatusfixsDup.some((tp) =>
          tp.department.some((dep) => valueCate.includes(dep)) &&
          tp.frequency === item.Frequency &&
          tp.absentmodes === item["Absent Mode"] &&
          tp.fromvalue === String(item["Absent From Value"]) &&
          tp.tovalue === String(item["Absent To Value"]) &&
          tp.achievedmodes === item["Achieved Mode"] &&
          tp.frompoint === String(item["Achieved From Value"]) &&
          tp.topoint === String(item["Achieved To Value"]) &&
          tp.currentabsentmodes === item["Current Absent Mode"] &&
          tp.currentabsentvalue === String(item["Current Absent Value"]) &&
          tp.currentachievedmodes === item["Current Achieved Mode"] &&
          tp.currentachievedvalue === String(item["Current Achieved Value"]) &&
          tp.paidstatus === item["Paid Status"]
        )
      );
      console.log(uniqueArray)
      if (uniqueArray.length === 0) {
        setPopupContentMalert("Already Added The Upload Data");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
        return;
      } else if (uniqueArray.length !== data.length) {
        setPopupContentMalert("Duplicate & Not a Number Value Removed");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
      const dataArray = uniqueArray.map((item) => ({
        department: valueCate,
        month: item.Month,
        year: item.Year,
        frequency: item.Frequency,
        absentmodes: item["Absent Mode"],
        fromvalue: item["Absent From Value"],
        tovalue: item["Absent To Value"],
        achievedmodes: item["Achieved Mode"],
        frompoint: item["Achieved From Value"],
        topoint: item["Achieved To Value"],
        currentabsentmodes: item["Current Absent Mode"],
        currentabsentvalue: item["Current Absent Value"],
        currentachievedmodes: item["Current Achieved Mode"],
        currentachievedvalue: item["Current Achieved Value"],
        paidstatus: item["Paid Status"],
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      }));
      setUpdatesheet([]);
      // Split data into chunks of 1000 entries
      const subarraySize = 1000;
      const splitedArray = [];
      for (let i = 0; i < dataArray.length; i += subarraySize) {
        const subarray = dataArray.slice(i, i + subarraySize);
        splitedArray.push(subarray);
      }
      setSplitArray(splitedArray);
    });
  };
  const clearFileSelection = () => {
    setUpdatesheet([])
    setFileUploadName("");
    setSplitArray([]);
    readExcel(null);
    setDataupdated("");
    setSheets([]);
    setSelectedSheet("Please Select Sheet");
  };
  const [departments, setDepartments] = useState([]);
  // Multi Select Create
  const [selectedOptionsCate, setSelectedOptionsCate] = useState([]);
  const handleCategoryChange = (options) => {
    setValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCate(options);
    setFileUploadName("");
    setSplitArray([]);
    setDataupdated("");
    setSheets([]);
    setSelectedSheet("Please Select Sheet");
  };
  const customValueRendererCate = (valueCate, _department) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Department";
  };

  //get all Areas.
  const fetchDepartmentDropdown = async () => {
    setPageName(!pageName)
    try {
      let res_dept = await axios.get(SERVICE.DEPARTMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const deptall = [
        ...res_dept?.data?.departmentdetails.map((d) => ({
          ...d,
          label: d.deptname,
          value: d.deptname,
        })),
      ];
      setDepartments(deptall);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsXeroxLoad(false);
    setIsErrorOpen(true);
  };
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };


  const getSheetExcel = () => {
    if (
      !Array.isArray(splitArray) ||
      (splitArray.length === 0 && fileUploadName === "")
    ) {
      setPopupContentMalert("Please Upload a file");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      let getsheets = splitArray.map((d, index) => ({
        label: "Sheet" + (index + 1),
        value: "Sheet" + (index + 1),
        index: index,
      }));
      setSheets(getsheets);
    }
  };
  const sendJSON = async () => {
    let uploadExceldata = splitArray[selectedSheetindex];
    let uniqueArray = uploadExceldata.filter(
      (item) =>
        !paidstatusfixs.some(
          (tp) =>
            tp.department.some((item) =>
              valueCate.map((item) => item).includes(item)
            ) &&
            tp.frequency == item.frequency &&
            tp.absentmodes == item.absentmodes &&
            // tp.fromvalue == item.fromvalue &&
            // tp.tovalue == item.tovalue &&
            tp.achievedmodes == item.achievedmodes &&
            // tp.frompoint == item.frompoint &&
            // tp.topoint == item.topoint &&
            tp.currentabsentmodes == item.currentabsentmodes &&
            tp.currentabsentvalue == item.currentabsentvalue &&
            tp.currentachievedmodes == item.currentachievedmodes &&
            tp.currentachievedvalue == item.currentachievedvalue &&
            tp.paidstatus == item.paidstatus
        )
    );
    // Ensure that items is an array of objects before sending
    if (
      fileUploadName === "" ||
      !Array.isArray(uniqueArray) ||
      uniqueArray.length === 0 ||
      selectedSheet === "Please Select Sheet"
    ) {
      setPopupContentMalert(fileUploadName === ""
        ? "Please Upload File"
        : selectedSheet === "Please Select Sheet"
          ? "Please Select Sheet"
          : "No data to upload");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsCate.length == 0) {
      setPopupContentMalert("Please Select Department");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
        }
      };
      setPageName(!pageName)
      try {
        setLoading(true); // Set loading to true when starting the upload
        xmlhttp.open("POST", SERVICE.PAIDSTATUSFIX_CREATE);
        xmlhttp.setRequestHeader(
          "Content-Type",
          "application/json;charset=UTF-8"
        );
        xmlhttp.send(JSON.stringify(uniqueArray));
        setSelectedSheet("Please Select Sheet")
        await fetchEmployee();
        await fetchPaidStatusfixDup();
      } catch (err) {
      } finally {
        setLoading(false); // Set loading back to false when the upload is complete
        setPopupContent("Updated Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
        setSelectedSheet("Please Select Sheet")
        setUpdatesheet(prev => [...prev, selectedSheetindex])
        await fetchEmployee();
        await fetchPaidStatusfixDup();
      }
    }
  };
  //add function
  const sendRequest = async () => {
    setIsXeroxLoad(true);
    setPageName(!pageName)
    try {
      let subprojectscreate = await axios.post(SERVICE.PAIDSTATUSFIX_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        department: [...valueCate],
        month: String(paidstatusfix.month),
        year: String(paidstatusfix.year),
        frequency: String(paidstatusfix.frequency),
        absentmodes: String(absentmodes),
        fromvalue: String(paidstatusfix.fromvalue),
        tovalue: String(paidstatusfix.tovalue),
        achievedmodes: String(achievedmodes),
        frompoint: String(paidstatusfix.frompoint),
        topoint: String(paidstatusfix.topoint),
        currentabsentmodes: String(currentabsentmodes),
        currentabsentvalue: String(paidstatusfix.currentabsentvalue),
        currentachievedmodes: String(currentachievedmodes),
        currentachievedvalue: String(paidstatusfix.currentachievedvalue),
        paidstatus: String(paidstatusfix.paidstatus),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchEmployee();
      await fetchPaidStatusfixDup();
      setPaidstatusfix({
        ...paidstatusfix,
        department: "Please Select Department",
        month: check.label,
        year: year,
        frequency: "",
        absentmodes: "Between",
        fromvalue: "",
        tovalue: "",
        achievedmodes: "Between",
        frompoint: "",
        topoint: "",
        currentabsentmodes: "Less Than or Equal",
        currentabsentvalue: "",
        currentachievedmodes: "Less Than or Equal",
        currentachievedvalue: "",
        paidstatus: "",
      });
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setIsXeroxLoad(false);
    } catch (err) { setIsXeroxLoad(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const [paidstatusfixsDup, setPaidstatusfixsDup] = useState([])
  let departmen = selectedOptionsCate.map((item) => item.value);
  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    let departments = selectedOptionsCate.map((item) => item.value);
    const isNameMatch = paidstatusfixsDup.some(
      (item) =>
        item.frequency?.toLowerCase() ===
        paidstatusfix.frequency?.toLowerCase() &&
        item.month?.toLowerCase() === paidstatusfix.month?.toLowerCase() &&
        item.year == paidstatusfix.year &&
        item.absentmodes?.toLowerCase() === absentmodes?.toLowerCase() &&
        // item.fromvalue?.toLowerCase() ===
        // paidstatusfix.fromvalue?.toLowerCase() 
        // item.tovalue?.toLowerCase() === paidstatusfix.tovalue?.toLowerCase() &&
        item.achievedmodes?.toLowerCase() === achievedmodes?.toLowerCase() &&
        // item.frompoint?.toLowerCase() ===
        // paidstatusfix.frompoint?.toLowerCase() &&
        // item.topoint?.toLowerCase() === paidstatusfix.topoint?.toLowerCase() &&
        item.currentabsentmodes?.toLowerCase() === currentabsentmodes?.toLowerCase() &&
        // item.currentabsentvalue?.toLowerCase() ===
        // paidstatusfix.currentabsentvalue?.toLowerCase() &&
        item.currentachievedmodes?.toLowerCase() === currentachievedmodes?.toLowerCase() &&
        // item.currentachievedvalue?.toLowerCase() ===
        // paidstatusfix.currentachievedvalue?.toLowerCase() &&
        item.paidstatus?.toLowerCase() ===
        paidstatusfix.paidstatus?.toLowerCase() &&
        item.department.some((data) => departments.includes(data))
    );
    if (selectedOptionsCate.length == 0) {
      setPopupContentMalert("Please Select Department");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      fileUploadName != "" &&
      selectedSheet === "Please Select Sheet"
    ) {
      setPopupContentMalert("Please Select Sheet");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (paidstatusfix.frequency === "") {
      setPopupContentMalert("Please Enter Frequency");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (paidstatusfix.paidstatus === "") {
      setPopupContentMalert("Please Enter Paid Status");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (!paidstatusfix.paidstatus.includes("_")) {
      setPopupContentMalert("Please Enter Paid Status Format Correctly");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Data already exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };
  const handleClear = (e) => {
    e.preventDefault();
    setPaidstatusfix({
      department: "Please Select Department",
      month: check.label,
      year: year,
      frequency: "",
      absentmodes: "Between",
      fromvalue: "",
      tovalue: "",
      achievedmodes: "Between",
      frompoint: "",
      topoint: "",
      currentabsentmodes: "Less Than or Equal",
      currentabsentvalue: "",
      currentachievedmodes: "Less Than or Equal",
      currentachievedvalue: "",
      paidstatus: "",
    });
    setSelectedOptionsCate([]);
    setAchievedmodes("Between");
    setAbsentmodes("Between");
    setCurrentabsentmodes("Less Than or Equal");
    setCurrentachievedmodes("Less Than or Equal");
    setSelectedSheet("Please Select Sheet");
    setSheets([]);
    setSplitArray([]);
    setSelectedSheetindex("");
    setFileUploadName("");
    readExcel(null);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };
  //get all Sub vendormasters.
  const fetchPaidStatusfixDup = async () => {
    setPageName(!pageName)
    try {
      let res_vendor = await axios.get(SERVICE.PAIDSTATUSFIX, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setPaidstatusfixsDup(res_vendor?.data?.paidstatusfixs);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const [paidstatusfixsFilterArray, setPaidstatusfixsFilterArray] = useState([])
  const fetchPaidStatusfixArray = async () => {
    setPageName(!pageName)
    try {
      let res_vendor = await axios.get(SERVICE.PAIDSTATUSFIX, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setPaidstatusfixsFilterArray(res_vendor?.data?.paidstatusfixs);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  useEffect(() => {
    fetchPaidStatusfixArray()
  }, [isFilterOpen])
  const [overallFilterdata, setOverallFilterdata] = useState([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const fetchEmployee = async () => {
    setPageName(!pageName)
    try {
      let res_employee = await axios.post(SERVICE.PAIDSTATUSFIX_SORT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        page: Number(page),
        pageSize: Number(pageSize),
        searchQuery: searchQuery
      });
      const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []
      const itemsWithSerialNumber = ans?.map((item, index) => ({
        ...item,
        serialNumber: (page - 1) * pageSize + index + 1,
        // serialNumber: index + 1,
      }));
      // setAcpointCalculation(res_vendor?.data?.acpointcalculation);
      setPaidstatusfixs(itemsWithSerialNumber)
      setOverallFilterdata(itemsWithSerialNumber);
      // setClientUserIDArray(itemsWithSerialNumber)
      setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
      setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
      setPageSize((data) => { return ans?.length > 0 ? data : 10 });
      setPage((data) => { return ans?.length > 0 ? data : 1 });
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  useEffect(() => {
    fetchEmployee();
  }, [page, pageSize, searchQuery]);

  useEffect(() => {
    fetchDepartmentDropdown();
  }, []);
  useEffect(() => {
    fetchEmployee();
    fetchPaidStatusfixDup();
  }, []);
  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);


  return (
    <Box>
      <Headtitle title={"Paid Status Fix"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Paid Status Fix"
        modulename="PayRoll"
        submodulename="PayRoll Setup"
        mainpagename="Paid Status Fix"
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("apaidstatusfix") && (
        <>
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Add Paid Status Fix
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={5} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Department<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={departments}
                      value={selectedOptionsCate}
                      onChange={handleCategoryChange}
                      valueRenderer={customValueRendererCate}
                      labelledBy="Please Select Area"
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <Divider />
              <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={6}>
                  <Button
                    variant="contained"
                    color="success"
                    sx={{ textTransform: "Capitalize" }}
                    onClick={(e) => ExportsHead()}
                  >
                    <FaDownload />
                    &ensp;Download template file
                  </Button>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={6} marginTop={3}>
                  <Grid container spacing={2}>
                    <Grid item md={4.5} xs={12} sm={6}>
                      <Button
                        variant="contained"
                        disabled={
                          paidstatusfix.frequency !== "" ||
                          paidstatusfix.fromvalue !== "" ||
                          paidstatusfix.tovalue != "" ||
                          paidstatusfix.frompoint != "" ||
                          paidstatusfix.topoint !== "" ||
                          paidstatusfix.currentabsentvalue !== "" ||
                          paidstatusfix.currentachievedvalue !== "" ||
                          paidstatusfix.paidstatus !== ""
                        }
                        component="label"
                        sx={{ textTransform: "capitalize" }}
                      >
                        Choose File
                        <input
                          hidden
                          type="file"
                          accept=".xlsx, .xls , .csv"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            setDataupdated("uploaded");
                            readExcel(file);
                            setFileUploadName(file.name);
                            e.target.value = null;
                            setSplitArray([]);
                            setSheets([]);
                            setSelectedSheet("Please Select Sheet");
                          }}
                        />
                      </Button>
                    </Grid>
                    <Grid item md={6.5} xs={12} sm={6}>
                      {fileUploadName != "" && splitArray.length > 0 ? (
                        <Box sx={{ display: "flex", justifyContent: "left" }}>
                          <p>{fileUploadName}</p>
                          <Button
                            sx={{ minWidth: "36px", borderRadius: "50%" }}
                            onClick={() => clearFileSelection()}
                          >
                            <FaTrash style={{ color: "red" }} />
                          </Button>
                        </Box>
                      ) : null}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Sheet</Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={sheets.filter(d => !updateSheet.includes(d.index))}
                      value={{ label: selectedSheet, value: selectedSheet }}
                      onChange={(e) => {
                        setSelectedSheet(e.value);
                        setSelectedSheetindex(e.index);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={5} xs={12} sm={6} marginTop={3}>
                  <Grid container>
                    <Grid item md={7} xs={12} sm={8}>
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={
                          paidstatusfix.frequency !== "" ||
                          paidstatusfix.fromvalue !== "" ||
                          paidstatusfix.tovalue != "" ||
                          paidstatusfix.frompoint != "" ||
                          paidstatusfix.topoint !== "" ||
                          paidstatusfix.currentabsentvalue !== "" ||
                          paidstatusfix.currentachievedvalue !== "" ||
                          paidstatusfix.paidstatus !== ""
                        }
                        onClick={getSheetExcel}
                        sx={{ textTransform: "capitalize" }}
                      >
                        Get Sheet
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <br />
              <Divider />
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} sm={6} xs={12}>
                  <Typography>Select Month</Typography>
                  <FormControl fullWidth size="small">
                    <Selects
                      maxMenuHeight={200}
                      isDisabled={fileUploadName != "" && splitArray.length > 0}
                      value={{
                        label: paidstatusfix.month,
                        value: paidstatusfix.month,
                      }}
                      onChange={(e) => {
                        setPaidstatusfix({ ...paidstatusfix, month: e.label });
                      }}
                      options={months}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={6} xs={12}>
                  <Typography> Select Year</Typography>
                  <FormControl fullWidth size="small">
                    <Selects
                      maxMenuHeight={200}
                      isDisabled={fileUploadName != "" && splitArray.length > 0}
                      value={{
                        label: paidstatusfix.year,
                        value: paidstatusfix.year,
                      }}
                      onChange={(e) => {
                        setPaidstatusfix({ ...paidstatusfix, year: e.value });
                      }}
                      options={getyear}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Frequency <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={fileUploadName != "" && splitArray.length > 0}
                      value={paidstatusfix.frequency}
                      onChange={(e) => {
                        setPaidstatusfix({
                          ...paidstatusfix,
                          frequency: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Absent Mode </Typography>
                    <Select
                      fullWidth
                      labelId="demo-select-small"
                      id="demo-select-small"
                      disabled={fileUploadName != "" && splitArray.length > 0}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                            width: 80,
                          },
                        },
                      }}
                      value={absentmodes}
                      onChange={(e) => {
                        setAbsentmodes(e.target.value);
                      }}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem value="Between"> {"Between"} </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>From Value </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={fileUploadName != "" && splitArray.length > 0}
                      value={paidstatusfix.fromvalue}
                      onChange={(e) => {
                        setPaidstatusfix({
                          ...paidstatusfix,
                          fromvalue: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>To Value </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={fileUploadName != "" && splitArray.length > 0}
                      value={paidstatusfix.tovalue}
                      onChange={(e) => {
                        setPaidstatusfix({
                          ...paidstatusfix,
                          tovalue: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Achieved Mode</Typography>
                    <Select
                      fullWidth
                      labelId="demo-select-small"
                      id="demo-select-small"
                      disabled={fileUploadName != "" && splitArray.length > 0}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                            width: 80,
                          },
                        },
                      }}
                      value={achievedmodes}
                      onChange={(e) => {
                        setAchievedmodes(e.target.value);
                      }}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem value="Between"> {"Between"} </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>From Point </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={fileUploadName != "" && splitArray.length > 0}
                      value={paidstatusfix.frompoint}
                      onChange={(e) => {
                        setPaidstatusfix({
                          ...paidstatusfix,
                          frompoint: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>To Point </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={fileUploadName != "" && splitArray.length > 0}
                      value={paidstatusfix.topoint}
                      onChange={(e) => {
                        setPaidstatusfix({
                          ...paidstatusfix,
                          topoint: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Current Absent Mode</Typography>
                    <Select
                      fullWidth
                      labelId="demo-select-small"
                      id="demo-select-small"
                      disabled={fileUploadName != "" && splitArray.length > 0}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                            width: 80,
                          },
                        },
                      }}
                      value={currentabsentmodes}
                      onChange={(e) => {
                        setCurrentabsentmodes(e.target.value);
                      }}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem value="Less Than or Equal">
                        {" "}
                        {"Less Than or Equal"}{" "}
                      </MenuItem>
                      <MenuItem value="Less Than"> {"Less Than"} </MenuItem>
                      <MenuItem value="Greater Than">
                        {" "}
                        {"Greater Than"}{" "}
                      </MenuItem>
                      <MenuItem value="Greater Than  or Equal">
                        {" "}
                        {"Greater Than or Equal"}{" "}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Current Absent Value </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={fileUploadName != "" && splitArray.length > 0}
                      value={paidstatusfix.currentabsentvalue}
                      onChange={(e) => {
                        setPaidstatusfix({
                          ...paidstatusfix,
                          currentabsentvalue: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Current Achieved Mode </Typography>
                    <Select
                      fullWidth
                      labelId="demo-select-small"
                      id="demo-select-small"
                      disabled={fileUploadName != "" && splitArray.length > 0}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                            width: 80,
                          },
                        },
                      }}
                      value={currentachievedmodes}
                      onChange={(e) => {
                        setCurrentachievedmodes(e.target.value);
                      }}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem value="Less Than or Equal">
                        {" "}
                        {"Less Than or Equal"}{" "}
                      </MenuItem>
                      <MenuItem value="Less Than"> {"Less Than"} </MenuItem>
                      <MenuItem value="Greater Than">
                        {" "}
                        {"Greater Than"}{" "}
                      </MenuItem>
                      <MenuItem value="Greater Than  or Equal">
                        {" "}
                        {"Greater Than or Equal"}{" "}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Current Achieved Value </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={fileUploadName != "" && splitArray.length > 0}
                      value={paidstatusfix.currentachievedvalue}
                      onChange={(e) => {
                        setPaidstatusfix({
                          ...paidstatusfix,
                          currentachievedvalue: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Paid Status<b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={fileUploadName != "" && splitArray.length > 0}
                      value={paidstatusfix.paidstatus}
                      onChange={(e) => {
                        setPaidstatusfix({
                          ...paidstatusfix,
                          paidstatus: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br /> <br />
              <Grid
                container
                spacing={2}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Grid item lg={1} md={2} sm={2} xs={12}>
                  {!loading ? (
                    fileUploadName != "" &&
                      splitArray.length > 0 &&
                      selectedSheet !== "Please Select Sheet" ? (
                      <>
                        <div readExcel={readExcel}>
                          <SendToServer sendJSON={sendJSON} />
                        </div>
                      </>
                    ) : (
                      <Button
                        variant="contained"
                        disabled={isXeroxLoad === true}
                        onClick={handleSubmit}
                      >
                        Submit
                      </Button>
                    )
                  ) : (
                    <LoadingButton
                      // onClick={handleClick}
                      loading={loading}
                      loadingPosition="start"
                      variant="contained"
                    >
                      <span>Send</span>
                    </LoadingButton>
                  )}
                </Grid>
                <Grid item lg={1} md={2} sm={2} xs={12}>
                  <Button sx={userStyle.btncancel} onClick={handleClear}>
                    Clear
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </>
      )}



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

      {/* EXTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}

export default PaidStatusFix;