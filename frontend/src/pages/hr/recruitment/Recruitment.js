import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  Select,
  MenuItem,
  TableRow,
  TableCell,
  Dialog,
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
  TextField,
  IconButton,
} from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { SERVICE } from "../../../services/Baseservice";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import { useReactToPrint } from "react-to-print";
import Selects from "react-select";
import { ThreeDots } from "react-loader-spinner";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { BASE_URL } from "../../../services/Authservice";
import LoadingButton from "@mui/lab/LoadingButton";
import ScheduleInterview from "./ScheduleInterview";
import UndoIcon from "@mui/icons-material/Undo";
import { MultiSelect } from "react-multi-select-component";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import ImageIcon from "@mui/icons-material/Image";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useParams, useNavigate, Link } from "react-router-dom";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import moment from "moment-timezone";

const Recuritment = () => {
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
        rowDataTable?.map((item) => {
          return {
            SNO: item.serialNumber,
            "Applicant Name": item.fullname,
            Gender: item.gender,
            "Contact No": item.mobile,
            Email: item.email,
            "Aadhar Number": item.adharnumber,
            "DOB ": item.dateofbirth,
            Education: item.qualification,
            Skill: item.skill,
            Experience: item.experience,
            "Applied Date/Time": item.appliedat,
          };
        }),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        jobTable?.map((item, index) => ({
          SNO: item.serialNumber,
          "Applicant Name": item.fullname,
          Gender: item.gender,
          "Contact No": item.mobile,
          Email: item.email,
          "Aadhar Number": item.adharnumber,
          DOB: item?.dateofbirth
            ? moment(item?.dateofbirth).format("DD-MM-YYYY")
            : "",
          Education: item?.educationdetails
            ?.map(
              (t, i) =>
                `${i + 1 + ". "}` +
                `${t.categoryedu} - ${t.subcategoryedu} - ${t.specialization}`
            )
            .toString(),
          Skill: item.skill.map((d) => d + " ,"),
          Experience: `${item?.experience} ${
            item?.experienceestimation == undefined
              ? "Years"
              : item?.experienceestimation
          }`,
          "Applied Date/Time": moment(item?.createdAt).format(
            "DD-MM-YYYY hh:mm A"
          ),
        })),
        fileName
      );
    }
    setIsFilterOpen(false);
  };

  //  PDF
  const columns = [
    { title: "Applicant Name", field: "fullname" },
    { title: "Gender", field: "gender" },
    { title: "Contact No", field: "mobile" },
    { title: "Email", field: "email" },
    { title: "Aadhar Number", field: "adharnumber" },
    { title: "DOB ", field: "dateofbirth" },
    { title: "Education", field: "qualification" },
    { title: "Skill", field: "skill" },
    { title: "Experience", field: "experience" },
    { title: "Applied Date/Time", field: "appliedat" },
  ];

  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();
    // Modify columns to include serial number column
    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" }, // Serial number column
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial =
      isfilter === "filtered"
        ? rowDataTable?.map((item) => {
            return {
              serialNumber: item.serialNumber,
              fullname: item.fullname,
              gender: item.gender,
              mobile: item.mobile,
              email: item.email,
              adharnumber: item.adharnumber,
              dateofbirth: item?.dateofbirth
                ? moment(item?.dateofbirth).format("DD-MM-YYYY")
                : "",
              qualification: item.qualification,
              skill: item.skill,
              experience: item.experience,
              appliedat: item?.appliedat,
            };
          })
        : jobTable?.map((item, index) => ({
            serialNumber: item.serialNumber,
            fullname: item.fullname,
            gender: item.gender,
            mobile: item.mobile,
            email: item.email,
            adharnumber: item.adharnumber,
            dateofbirth: item?.dateofbirth
              ? moment(item?.dateofbirth).format("DD-MM-YYYY")
              : "",
            qualification: item?.educationdetails
              ?.map(
                (t, i) =>
                  `${i + 1 + ". "}` +
                  `${t.categoryedu} - ${t.subcategoryedu} - ${t.specialization}`
              )
              .toString(),
            skill: item.skill.map((d) => d + " ,"),
            appliedat: moment(item?.createdAt).format("DD-MM-YYYY hh:mm A"),
            experience: `${item?.experience} ${
              item?.experienceestimation == undefined
                ? "Years"
                : item?.experienceestimation
            }`,
          }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: "5" },
    });

    doc.save(`${tableName}.pdf`);
  };

  const backPage = useNavigate();

  const [loader, setLoader] = useState(true);
  const statusOptions = [
    { label: "OnProgress", value: "OnProgress" },
    { label: "OnHold", value: "OnHold" },
    { label: "Closed", value: "closed" },
  ];
  const [jobTable, setJobTable] = useState([]);
  const [tableName, setTableName] = useState("Overall Applicant");
  let notaround = "NOTAROUND";
  const [overAllcount, setoverAllCount] = useState(0);
  const [todayCandiDates, setTodayCandiDates] = useState(0);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQueryManage, setSearchQueryManage] = useState("");

  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [isUndoOpen, setIsUndoOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [showUndoAlert, setShowUndoAlert] = useState();
  const [showUndoAlertpopup, setShowUndoAlertPopup] = useState({
    id: "",
    action: "",
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleMakeOpen = () => {
    setIsOpen(true);
  };

  //alert model for schedule interview
  const [openMeetingPopup, setOpenMeetingPopup] = useState(false);
  const [vendorAuto, setVendorAuto] = useState("");
  const [meetingValues, setMeetingValues] = useState([]);
  // meeting popup model
  const handleClickOpenMeetingPopup = (
    company,
    branch,
    rolename,
    candidateid,
    candidatename,
    candesignation
  ) => {
    setOpenMeetingPopup(true);
    setMeetingValues([
      company,
      branch,
      rolename,
      candidateid,
      candidatename,
      candesignation,
    ]);
  };

  const handleClickCloseMeetingPopup = () => {
    setOpenMeetingPopup(false);
  };

  //screening multiselects

  //Education Category-----------------------------------------
  const [valueEducationCategoryAdd, setValueEducationCategoryAdd] = useState(
    []
  );
  const [
    selectedOptionsEducationCategoryAdd,
    setSelectedOptionsEducationCategoryAdd,
  ] = useState([]);
  const handleEducationCategoryChangeAdd = (options) => {
    setValueEducationCategoryAdd(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsEducationCategoryAdd(options);
    setSelectedOptionsEducationSubCategoryAdd([]);
    setSelectedOptionsEducationSpecilizationAdd([]);

    setValueEducationSubCategoryAdd([]);
    setValueEducationSpecilizationAdd([]);
  };

  const customValueRendererEducationCategoryAdd = (
    valueEducationCategoryAdd,
    _shifts
  ) => {
    return valueEducationCategoryAdd.length ? (
      valueEducationCategoryAdd.map(({ label }) => label).join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>
        Please Select Education Category
      </span>
    );
  };

  //Education Sub Category-----------------------------------------
  const [valueEducationSubCategoryAdd, setValueEducationSubCategoryAdd] =
    useState([]);
  const [
    selectedOptionsEducationSubCategoryAdd,
    setSelectedOptionsEducationSubCategoryAdd,
  ] = useState([]);
  const handleEducationSubCategoryChangeAdd = (options) => {
    setValueEducationSubCategoryAdd(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsEducationSubCategoryAdd(options);
    setSelectedOptionsEducationSpecilizationAdd([]);

    setValueEducationSpecilizationAdd([]);
  };

  const customValueRendererEducationSubCategoryAdd = (
    valueEducationSubCategoryAdd,
    _shifts
  ) => {
    return valueEducationSubCategoryAdd.length ? (
      valueEducationSubCategoryAdd.map(({ label }) => label).join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>
        Please Select Education SubCategory
      </span>
    );
  };

  //Education Specilization-----------------------------------------
  const [valueEducationSpecilizationAdd, setValueEducationSpecilizationAdd] =
    useState([]);
  const [
    selectedOptionsEducationSpecilizationAdd,
    setSelectedOptionsEducationSpecilizationAdd,
  ] = useState([]);
  const handleEducationSpecilizationChangeAdd = (options) => {
    setValueEducationSpecilizationAdd(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsEducationSpecilizationAdd(options);
  };

  const customValueRendererEducationSpecilizationAdd = (
    valueEducationSpecilizationAdd,
    _shifts
  ) => {
    return valueEducationSpecilizationAdd.length ? (
      valueEducationSpecilizationAdd.map(({ label }) => label).join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>
        Please Select Education Specilization
      </span>
    );
  };

  //SkillSet-----------------------------------------
  const [valueSkillsetAdd, setValueSkillsetAdd] = useState([]);
  const [selectedOptionsSkillsetAdd, setSelectedOptionsSkillsetAdd] = useState(
    []
  );
  const handleSkillsetChangeAdd = (options) => {
    setValueSkillsetAdd(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsSkillsetAdd(options);
  };

  const customValueRendererSkillsetAdd = (valueSkillsetAdd, _shifts) => {
    return valueSkillsetAdd.length ? (
      valueSkillsetAdd.map(({ label }) => label).join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>
        Please Select Education SkillSet
      </span>
    );
  };

  //certification-----------------------------------------
  const [valueCertificationAdd, setValueCertificationAdd] = useState([]);
  const [selectedOptionsCertificationAdd, setSelectedOptionsCertificationAdd] =
    useState([]);
  const handleCertificationChangeAdd = (options) => {
    setValueCertificationAdd(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCertificationAdd(options);
  };

  const customValueRendererCertificationAdd = (
    valueCertificationAdd,
    _shifts
  ) => {
    return valueCertificationAdd.length ? (
      valueCertificationAdd.map(({ label }) => label).join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>
        Please Select Certification
      </span>
    );
  };

  //location-----------------------------------------
  const [valueLocationAdd, setValueLocationAdd] = useState([]);
  const [selectedOptionsLocationAdd, setSelectedOptionsLocationAdd] = useState(
    []
  );
  const handleLocationChangeAdd = (options) => {
    setValueLocationAdd(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsLocationAdd(options);
  };

  const customValueRendererLocationAdd = (valueLocationAdd, _shifts) => {
    return valueLocationAdd.length ? (
      valueLocationAdd.map(({ label }) => label).join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Location</span>
    );
  };

  const handleMakeClose = () => {
    setIsOpen(false);
    setCandidateFilter({
      agefrom: "",
      ageto: "",
      educationcategory: "Please Select Education Category",
      educationsubcategory: "Please Select Education Sub Category",
      education: "Please Select Education Specilization",
      certification: "Please Select Certification",
      skill: "Please Select SkillSet",
      location: "Please Select Location",
      expfrom: "",
      expto: "",
      joiningindays: "",
      expectedsalary: "",
      expectedsalaryto: "",
      validation: "Please Select Condition",
    });
    setSelectedOptionsEducationCategoryAdd([]);
    setSelectedOptionsEducationSubCategoryAdd([]);
    setSelectedOptionsEducationSpecilizationAdd([]);
    setSelectedOptionsSkillsetAdd([]);
    setSelectedOptionsCertificationAdd([]);
    setSelectedOptionsLocationAdd([]);

    setValueEducationCategoryAdd([]);
    setValueEducationSubCategoryAdd([]);
    setValueEducationSpecilizationAdd([]);
    setValueSkillsetAdd([]);
    setValueCertificationAdd([]);
    setValueLocationAdd([]);
  };
  const handleClear = () => {
    setCandidateFilter({
      agefrom: "",
      ageto: "",
      educationcategory: "Please Select Education Category",
      educationsubcategory: "Please Select Education Sub Category",
      education: "Please Select Education Specilization",
      certification: "Please Select Certification",
      skill: "Please Select SkillSet",
      location: "Please Select Location",
      expfrom: "",
      expto: "",
      joiningindays: "",
      expectedsalary: "",
      expectedsalaryto: "",
      validation: "Please Select Condition",
    });
    setSelectedOptionsEducationCategoryAdd([]);
    setSelectedOptionsEducationSubCategoryAdd([]);
    setSelectedOptionsEducationSpecilizationAdd([]);
    setSelectedOptionsSkillsetAdd([]);
    setSelectedOptionsCertificationAdd([]);
    setSelectedOptionsLocationAdd([]);

    setValueEducationCategoryAdd([]);
    setValueEducationSubCategoryAdd([]);
    setValueEducationSpecilizationAdd([]);
    setValueSkillsetAdd([]);
    setValueCertificationAdd([]);
    setValueLocationAdd([]);
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
  // Error Popup model
  const handleClickOpenerr = () => {
    setBtnSubmit(false);
    setLoader(true);
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };
  // undo Popup model
  const handleClickOpenerrUndo = () => {
    setIsUndoOpen(true);
  };
  const handleCloseerrUndo = () => {
    setIsUndoOpen(false);
    setShowUndoAlertPopup({
      id: "",
      action: "",
    });
  };

  const [singleJobData, setSingleJobData] = useState({});
  const [statusChange, setStatusChange] = useState("");
  const { auth } = useContext(AuthContext);
  const { isUserRoleCompare } = useContext(UserRoleAccessContext);
  const ids = useParams().id;

  const handleCopy = () => {
    NotificationManager.success("Copied! 👍", "", 2000);
  };

  const fetchCandidateAll = async () => {
    try {
      let response = await axios.post(`${SERVICE.CANDIDATES}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        jobopeningsid: ids,
      });
      let overAllCount = response?.data?.allcandidate.filter((itemnew) => {
        return (
          !itemnew.finalstatus ||
          (itemnew.finalstatus &&
            itemnew.finalstatus != "Rejected" &&
            itemnew.finalstatus != "Added")
        );
      });
      setJobTable(
        overAllCount?.map((item, index) => ({
          ...item,
          serialNumber: index + 1,
          tablename: "overallappllicant",
        }))
      );
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong2!"}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };
  const [roleName, setRoleName] = useState("");
  const [location, setLocation] = useState([]);
  const getinfoCode = async (from) => {
    setLoader(false);
    try {
      const [res, response, todayresponse] = await Promise.all([
        axios.get(`${SERVICE.JOBOPENING_SINGLE}/${ids}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.post(`${SERVICE.CANDIDATES}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          jobopeningsid: ids,
        }),
        axios.post(`${SERVICE.TODAYCANDIDATES}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          jobopeningsid: ids,
        }),
      ]);

      setSingleJobData(res?.data?.sjobopening);
      setStatusChange(res?.data?.sjobopening?.status);
      setTodayCandiDates(todayresponse?.data?.todaycandidates?.length);
      from === "newapplicant"
        ? setJobTable(
            todayresponse?.data?.todaycandidates?.map((item, index) => ({
              ...item,
              serialNumber: index + 1,
              tablename: "newapplicant",
            }))
          )
        : setJobTable(response?.data?.allcandidate);
      let overAllCount = response?.data?.allcandidate.filter((itemnew) => {
        return (
          !itemnew.finalstatus ||
          (itemnew.finalstatus &&
            itemnew.finalstatus != "Rejected" &&
            itemnew.finalstatus != "Added")
        );
      });
      setoverAllCount(overAllCount?.length);
      setRoleName(res?.data?.sjobopening?.recruitmentname);

      const uniqueNames = new Set();
      response?.data?.allcandidate.forEach((d) => {
        uniqueNames.add(d.city);
      });
      const location = [...uniqueNames]
        .map((city) => {
          if (city.trim() !== "") {
            return {
              label: city,
              value: city,
            };
          }
          return null;
        })
        .filter(Boolean);
      setLocation(location);

      // Initialize counts object
      let counts = {};

      // Iterate through relatedDatas and assign considerValue
      let considerValue = response?.data?.allcandidate?.map((item) => {
        if (item.candidatestatus !== undefined && item.candidatestatus !== "") {
          return { ...item, considerValue: item.candidatestatus };
        } else if (item.interviewrounds && item.interviewrounds.length == 1) {
          let status =
            item.interviewrounds[0].rounduserstatus !== undefined &&
            item.interviewrounds[0].rounduserstatus !== "";
          if (status) {
            const fieldToCheck = "rounduserstatus";
            const foundObject = item.interviewrounds.find(
              (obj) =>
                obj[fieldToCheck] !== undefined && obj[fieldToCheck] !== ""
            );
            return { ...item, considerValue: foundObject.rounduserstatus };
          }
        } else {
          let status = item.interviewrounds.some(
            (item1) =>
              item1.rounduserstatus !== undefined &&
              item1.rounduserstatus !== ""
          );
          if (status) {
            const fieldToCheck = "rounduserstatus";
            const foundObject = item.interviewrounds.find(
              (obj) =>
                obj[fieldToCheck] !== undefined && obj[fieldToCheck] !== ""
            );
            return { ...item, considerValue: foundObject.rounduserstatus };
          }
        }
      });

      // Count occurrences of each considerValue
      considerValue?.forEach((obj) => {
        const value = obj?.considerValue;
        counts[value] = (counts[value] || 0) + 1;
      });

      let sum = 0;
      for (const key in counts) {
        if (key !== "undefined") {
          sum += counts[key];
        }
      }

      setInactiveCount(sum);

      setLoader(true);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong3!"}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };
  const getInActiveCount = async () => {
    try {
      const [res, response] = await Promise.all([
        axios.get(`${SERVICE.JOBOPENING_SINGLE}/${ids}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.post(`${SERVICE.CANDIDATES}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          jobopeningsid: ids,
        }),
      ]);

      // Initialize counts object
      let counts = {};

      // Iterate through relatedDatas and assign considerValue
      let considerValue = response?.data?.allcandidate?.map((item) => {
        if (
          item?.candidatestatus !== undefined &&
          item?.candidatestatus !== ""
        ) {
          return { ...item, considerValue: item.candidatestatus };
        } else if (item.interviewrounds && item.interviewrounds.length == 1) {
          let status =
            item.interviewrounds[0].rounduserstatus !== undefined &&
            item.interviewrounds[0].rounduserstatus !== "";
          if (status) {
            const fieldToCheck = "rounduserstatus";
            const foundObject = item.interviewrounds.find(
              (obj) =>
                obj[fieldToCheck] !== undefined && obj[fieldToCheck] !== ""
            );
            return { ...item, considerValue: foundObject?.rounduserstatus };
          }
        } else {
          let status = item.interviewrounds.some(
            (item1) =>
              item1.rounduserstatus !== undefined &&
              item1.rounduserstatus !== ""
          );
          if (status) {
            const fieldToCheck = "rounduserstatus";
            const foundObject = item.interviewrounds.find(
              (obj) =>
                obj[fieldToCheck] !== undefined && obj[fieldToCheck] !== ""
            );
            return { ...item, considerValue: foundObject?.rounduserstatus };
          }
        }
      });

      // Count occurrences of each considerValue
      considerValue?.forEach((obj) => {
        const value = obj?.considerValue;
        counts[value] = (counts[value] || 0) + 1;
      });

      let sum = 0;
      for (const key in counts) {
        if (key !== "undefined") {
          sum += counts[key];
        }
      }

      setInactiveCount(sum);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong3!"}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };

  const [screenedCount, setScreenedCount] = useState();
  const [interviewCount, setInterviewCount] = useState();
  const [hiredCount, setHiredCount] = useState();
  const [rejectedCount, setRejectedCount] = useState();
  const [inactiveCount, setInactiveCount] = useState();
  const getScreenedCandidate = async (from) => {
    setLoader(false);
    try {
      const [res, response] = await Promise.all([
        axios.get(`${SERVICE.JOBOPENING_SINGLE}/${ids}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.post(`${SERVICE.CANDIDATES}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          jobopeningsid: ids,
        }),
      ]);

      let screeneddatas = response?.data?.allcandidate?.filter(
        (item) =>
          (item?.candidatestatus === "" ||
            item?.candidatestatus == undefined) &&
          item.screencandidate === "Screened" &&
          (item?.interviewrounds?.length === 0 ||
            item?.interviewrounds == undefined)
      );

      let overAllCount = response?.data?.allcandidate.filter((itemnew) => {
        return (
          !itemnew.finalstatus ||
          (itemnew.finalstatus &&
            itemnew.finalstatus != "Rejected" &&
            itemnew.finalstatus != "Added")
        );
      });

      if (from === "clicked") {
        setJobTable(
          screeneddatas?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
            tablename: "resumescreen",
          }))
        );
      } else if (from === "overallappllicant") {
        setJobTable(
          overAllCount?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
            tablename: "overallappllicant",
          }))
        );
        setoverAllCount(overAllCount?.length);
      } else if (from === "newapplicant") {
        await getinfoCode("newapplicant");
      }

      setScreenedCount(screeneddatas?.length);

      // let interviewCount = response?.data?.allcandidate
      //   ?.filter(
      //     (item) =>
      //       item?.interviewrounds?.length > 0 &&
      //       item?.interviewrounds.every(
      //         (round) =>
      //           round?.rounduserstatus === "" ||
      //           round?.rounduserstatus === undefined
      //       )
      //   )
      //   .filter((itemnew) => {
      //     return (
      //       !itemnew.finalstatus ||
      //       (itemnew.finalstatus &&
      //         itemnew.finalstatus != "Rejected" &&
      //         itemnew.finalstatus != "Added")
      //     );
      //   });

      const interviewCount = response?.data?.allcandidate?.reduce(
        (count, candidate) => {
          if (candidate.finalstatus === "Hold") {
            return count + 1;
          } else if (!candidate.finalstatus || candidate.finalstatus === "") {
            const interviewrounds = candidate.interviewrounds;
            if (
              interviewrounds.length > 0 &&
              interviewrounds.every(
                (round) =>
                  round?.rounduserstatus === "" ||
                  round?.rounduserstatus === undefined
              ) &&
              interviewrounds[interviewrounds.length - 1].roundanswerstatus !==
                "Rejected"
            ) {
              return count + 1;
            }
          }
          return count;
        },
        0
      );

      let hiredCount = response?.data?.allcandidate
        ?.filter(
          (item) =>
            item?.interviewrounds?.length > 0 &&
            item?.interviewrounds.every(
              (round) =>
                round?.rounduserstatus === "" ||
                round?.rounduserstatus === undefined
            )
        )
        .filter((itemnew) => {
          return itemnew.finalstatus == "Added";
        });

      setHiredCount(hiredCount?.length);

      const rejectedCount = response?.data?.allcandidate?.reduce(
        (count, candidate) => {
          if (candidate.finalstatus === "Rejected") {
            return count + 1;
          } else if (!candidate.finalstatus) {
            const interviewrounds = candidate?.interviewrounds;
            if (interviewrounds && interviewrounds.length > 0) {
              const lastRoundStatus =
                interviewrounds[interviewrounds.length - 1].roundanswerstatus;
              if (lastRoundStatus === "Rejected") {
                return count + 1;
              }
            }
          }
          return count;
        },
        0
      );

      setRejectedCount(rejectedCount);

      setInterviewCount(interviewCount);
      setCandidateFilter({
        agefrom: "",
        ageto: "",
        educationcategory: "Please Select Education Category",
        educationsubcategory: "Please Select Education Sub Category",
        education: "Please Select Education Specilization",
        certification: "Please Select Certification",
        skill: "Please Select SkillSet",
        location: "Please Select Location",
        expfrom: "",
        expto: "",
        joiningindays: "",
        expectedsalary: "",
        expectedsalaryto: "",
        validation: "Please Select Condition",
      });
      setLoader(true);
    } catch (err) {
      console.log(err);
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong4!"}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };

  const handleFilter = async () => {
    try {
      if (
        candidateFilter.expectedsalary !== "" &&
        candidateFilter.validation === "Please Select Condition"
      ) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Select Condition for the Expected Salary"}
            </p>
          </>
        );
        handleClickOpenerr();
      } else if (
        Number(candidateFilter.expectedsalary) >
          Number(candidateFilter.expectedsalaryto) &&
        candidateFilter.validation === "Between" &&
        (candidateFilter.expectedsalary !== "" ||
          candidateFilter.expectedsalaryto !== "")
      ) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Expected Salary From Must be Less Than To"}
            </p>
          </>
        );
        handleClickOpenerr();
      } else if (
        (candidateFilter.expectedsalary === "" ||
          candidateFilter.expectedsalaryto === "") &&
        candidateFilter.validation === "Between"
      ) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Enter Expected Salary From and To"}
            </p>
          </>
        );
        handleClickOpenerr();
      } else if (
        Number(candidateFilter.agefrom) > Number(candidateFilter.ageto) &&
        (candidateFilter.agefrom !== "" || candidateFilter.ageto !== "")
      ) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Age From Must be Less Than To"}
            </p>
          </>
        );
        handleClickOpenerr();
      } else if (
        Number(candidateFilter.expfrom) > Number(candidateFilter.expto) &&
        (candidateFilter.expfrom !== "" || candidateFilter.expto !== "")
      ) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Experience From Must be Less Than To"}
            </p>
          </>
        );
        handleClickOpenerr();
      } else {
        setLoader(false);
        let res = await axios.post(
          SERVICE.CANDIDATE_SCREENING,
          {
            age: String(candidateFilter.agefrom),
            to: String(candidateFilter.ageto),
            fromexp: String(candidateFilter.expfrom),
            toexp: String(candidateFilter.expto),
            educationcategory: valueEducationCategoryAdd,
            educationsubcategory: valueEducationSubCategoryAdd,
            education: valueEducationSpecilizationAdd,
            skill: valueSkillsetAdd,
            location: valueLocationAdd,
            certification: valueCertificationAdd,
            joiningindays: String(candidateFilter.joiningindays),
            expectedsalary: String(candidateFilter.expectedsalary),
            expectedsalaryto: String(candidateFilter.expectedsalaryto),
            expectedsalaryvalidation: String(candidateFilter.validation),
            role: String(roleName),
          },
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          }
        );

        await getScreenedCandidate("useeffect");

        let screeneddatas = res?.data?.filteredUsersreturn?.filter(
          (item) =>
            (item?.candidatestatus === "" ||
              item?.candidatestatus == undefined) &&
            item.screencandidate === "Screened" &&
            (item?.interviewrounds?.length === 0 ||
              item?.interviewrounds == undefined)
        );

        setJobTable(
          screeneddatas?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
            tablename: "resumescreen",
          }))
        );
        setTableName("Resume Screen");
        handleMakeClose();

        setCandidateFilter({
          agefrom: "",
          ageto: "",
          educationcategory: "Please Select Education Category",
          educationsubcategory: "Please Select Education Sub Category",
          education: "Please Select Education Specilization",
          certification: "Please Select Certification",
          skill: "Please Select SkillSet",
          location: "Please Select Location",
          expfrom: "",
          expto: "",
          joiningindays: "",
          expectedsalary: "",
          expectedsalaryto: "",
          validation: "Please Select Condition",
        });
        setSelectedOptionsEducationCategoryAdd([]);
        setSelectedOptionsEducationSubCategoryAdd([]);
        setSelectedOptionsEducationSpecilizationAdd([]);
        setSelectedOptionsSkillsetAdd([]);
        setSelectedOptionsCertificationAdd([]);
        setSelectedOptionsLocationAdd([]);

        setValueEducationCategoryAdd([]);
        setValueEducationSubCategoryAdd([]);
        setValueEducationSpecilizationAdd([]);
        setValueSkillsetAdd([]);
        setValueCertificationAdd([]);
        setValueLocationAdd([]);
        setLoader(true);
      }

      setColumnVisibility((prevVisibility) => ({
        ...prevVisibility,
        scheduleinterview: true,
        removescreening: true,
        removecandidate: false,
      }));
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something Team  went wrong!"}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };

  useEffect(() => {
    getinfoCode("useeffect");
    getScreenedCandidate("overallappllicant");
  }, [ids]);

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
    if (params.row.roleback) {
      return "roleback-row";
    }
    return "";
  };

  const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    "& .MuiDataGrid-virtualScroller": {
      overflowY: "hidden",
    },
    "& .roleback-row": {
      backgroundColor: "#f5c6cb !important",
      position: "relative", // Ensure the row is a positioning context
      opacity: 0.5, // Make the row appear more disabled
      // pointer-events: "none", // Prevent interaction with the row
    },
  }));

  const gridRef = useRef(null);
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Job Applicants.png");
        });
      });
    }
  };

  const dataGridStyles = {
    root: {
      "& .MuiDataGrid-row": {
        height: "15px",
      },
    },
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    fullname: true,
    mobile: true,
    email: true,
    dateofbirth: true,
    qualification: true,
    skill: true,
    experience: true,
    status: true,
    scheduleinterview: true,
    prefix: true,
    gender: true,
    removescreening: false,
    removecandidate: false,
    adharnumber: true,
    appliedat: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setPage(1);
  };

  //datatable....
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };
  // Split the search query into individual terms
  const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = jobTable?.filter((item) => {
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
    Math.abs(firstVisiblePage + visiblePages - 1),
    totalPages
  );

  const pageNumbers = [];

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  const [educationCategory, setEducationCategory] = useState([]);
  const [educationDatas, setEducationDatas] = useState([]);
  const [skillSet, setSkillSet] = useState([]);
  const [certification, setCertification] = useState([]);
  const [candidateFilter, setCandidateFilter] = useState({
    agefrom: "",
    ageto: "",
    educationcategory: "Please Select Education Category",
    educationsubcategory: "Please Select Education Sub Category",
    education: "Please Select Education Specilization",
    certification: "Please Select Certification",
    skill: "Please Select SkillSet",
    location: "Please Select Location",
    expfrom: "",
    expto: "",
    joiningindays: "",
    expectedsalary: "",
    expectedsalaryto: "",
    validation: "Please Select Condition",
  });

  const fetchEducation = async () => {
    try {
      let res_unit = await axios.get(SERVICE.EDUCATIONSPECILIZATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setEducationDatas(res_unit?.data?.educationspecilizations);
      setEducationCategory(
        res_unit?.data?.educationspecilizations?.flatMap((item) =>
          item?.category?.map((data) => ({
            label: data,
            value: data,
          }))
        )
      );
      // setEducation(
      //   [
      //     ...new Set(
      //       res_unit?.data?.educationspecilizations?.flatMap((item) =>
      //         item?.specilizationgrp.map((data) => data.label)
      //       ) ?? []
      //     ),
      //   ].map((label) => ({ label, value: label }))
      // );
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong6!"}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };
  const fetchSkillSet = async () => {
    try {
      let res_unit = await axios.get(SERVICE.SKILLSET, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSkillSet(
        res_unit?.data?.skillsets?.map((item) => ({
          label: item.name,
          value: item.name,
        }))
      );
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong7!"}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };

  const fetchCertifications = async () => {
    try {
      let res_unit = await axios.get(SERVICE.CERTIFICATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let beforOther = res_unit?.data?.certifications?.map((item) => ({
        label: item.name,
        value: item.name,
      }));

      setCertification([...beforOther, { label: "Other", value: "Other" }]);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong8!"}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };

  const [btnSubmit, setBtnSubmit] = useState(false);
  const [rowIndex, setRowIndex] = useState();
  const [status, setStatus] = useState({});
  const handleAction = (value, rowId, sno) => {
    setStatus((prevStatus) => ({
      ...prevStatus,
      [rowId]: {
        ...prevStatus[rowId],
        candidatestatus: value,
        btnShow: true,
      },
    }));
    setRowIndex(sno);
  };

  const handleUpdate = async (e, candidatestatus, tablename) => {
    setBtnSubmit(true);
    try {
      await axios.put(`${SERVICE.CANDIDATES_SINGLE}/${e}`, {
        candidatestatus: String(candidatestatus),
        overallstatus: String(candidatestatus),
      });
      tablename === "overallappllicant"
        ? await getScreenedCandidate("overallappllicant")
        : tablename === "newapplicant"
        ? await getinfoCode("newapplicant")
        : await getScreenedCandidate("clicked");
      setStatus({});
      await getInActiveCount();
      setBtnSubmit(false);
      setShowAlert(
        <>
          {" "}
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "green" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Updated Successfully👍"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong10!"}
            </p>{" "}
          </>
        );
        handleClickOpenerr();
      }
    }
  };

  const handleRoleUpdate = async (updaterole) => {
    try {
      await axios.put(`${SERVICE.JOBOPENING_SINGLE}/${ids}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        status: String(updaterole),
      });
      setShowAlert(
        <>
          {" "}
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "green" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Updated Successfully👍"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
      if (updaterole == "closed") {
        backPage(`/recruitment/jobopenlist`);
      }
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert();
        handleClickOpenerr();
      }
    }
  };

  const handleRemoveScreening = async (e) => {
    setBtnSubmit(true);
    try {
      await axios.put(`${SERVICE.CANDIDATES_SINGLE}/${e}`, {
        screencandidate: "",
        overallstatus: "Applied",
      });
      await getScreenedCandidate("clicked");
      await getinfoCode("useeffect");
      setStatus({});
      setBtnSubmit(false);
      handleCloseerrUndo();
      setShowAlert(
        <>
          {" "}
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "green" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Updated Successfully👍"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong10!"}
            </p>{" "}
          </>
        );
        handleClickOpenerr();
      }
    }
  };
  const handleRemoveCandidate = async (e) => {
    setBtnSubmit(true);
    try {
      await axios.put(`${SERVICE.CANDIDATES_SINGLE}/${e}`, {
        role: "All",
        jobopeningsid: "",
        overallstatus: "",
      });
      await getinfoCode("newapplicant");
      setTableName("New Applicant");
      handleCloseerrUndo();
      setStatus({});
      setBtnSubmit(false);
      setShowAlert(
        <>
          {" "}
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "green" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Removed Successfully👍"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong10!"}
            </p>{" "}
          </>
        );
        handleClickOpenerr();
      }
    }
  };

  const columnDataTable = [
    {
      field: "serialNumber",
      headerName: "S.No",
      flex: 0,
      width: 70,
      minHeight: "40px",
      hide: !columnVisibility.serialNumber,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0,
      width: 300,
      sortable: false,
      hide: !columnVisibility.status,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {(params.row?.tablename === "resumescreen" ||
            params?.row?.tablename === "overallappllicant" ||
            params?.row?.tablename === "newapplicant") &&
          (params?.row?.interviewrounds?.length === 0 ||
            params?.row?.interviewrounds == undefined) ? (
            <>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl size="large" fullWidth>
                  <Select
                    labelId="demo-select-small"
                    id="demo-select-small"
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 200,
                          width: "auto",
                        },
                      },
                    }}
                    style={{ minWidth: 150, width: 200, overflow: "hidden" }}
                    value={
                      status[params.row.id]?.candidatestatus
                        ? status[params.row.id]?.candidatestatus
                        : params.row.candidatestatus
                    }
                    onChange={(e) => {
                      handleAction(
                        e.target.value,
                        params.row.id,
                        params.row.serialNumber
                      );
                    }}
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    {/* {statusData?.map((d) => (
                      <MenuItem key={d._id} value={d.value}>
                        {d.label}
                      </MenuItem>
                    ))} */}
                    <MenuItem value="First No Response">
                      First No Response
                    </MenuItem>
                    <MenuItem value="Second No Response">
                      Second No Response
                    </MenuItem>
                    <MenuItem value="No Response">No Response</MenuItem>
                    <MenuItem value="Not Interested">Not Interested</MenuItem>
                    <MenuItem value="Got Other Job">Got Other Job</MenuItem>
                    <MenuItem value="Already Joined">Already Joined</MenuItem>
                    <MenuItem value="Duplicate Candidate">
                      Duplicate Candidate
                    </MenuItem>
                    <MenuItem value="Profile Not Eligible">
                      Profile Not Eligible
                    </MenuItem>
                    {/* <MenuItem value="Others">Others</MenuItem> */}
                  </Select>
                </FormControl>
              </Grid>
              <br />
              <br />
              {status[params.row.id]?.btnShow &&
              rowIndex === params.row.serialNumber ? (
                <>
                  {" "}
                  <LoadingButton
                    sx={{
                      ...userStyle.buttonedit,
                      marginLeft: "10px",
                    }}
                    variant="contained"
                    loading={btnSubmit}
                    style={{ minWidth: "0px" }}
                    onClick={(e) =>
                      handleUpdate(
                        params.row.id,
                        status[params.row.id]?.candidatestatus,
                        params.row.tablename
                      )
                    }
                  >
                    SAVE
                  </LoadingButton>
                </>
              ) : (
                <></>
              )}
            </>
          ) : (
            <Typography>{params.row.overallstatus}</Typography>
          )}
        </Grid>
      ),
    },

    {
      field: "scheduleinterview",
      headerName: "Schedule Interview",
      flex: 0,
      width: 100,
      sortable: false,
      hide: !columnVisibility.scheduleinterview,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          <>
            {(params.row.candidatestatus === "" ||
              params.row.candidatestatus == undefined) &&
              (params?.row?.interviewrounds?.length === 0 ||
                params?.row?.interviewrounds == undefined) && (
                <Grid item md={3} xs={12} sm={12}>
                  <>
                    {tableName === "Resume Screen" ||
                    tableName === "Overall Applicant" ||
                    tableName === "New Applicant" ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          handleClickOpenMeetingPopup(
                            params?.row?.company,
                            params?.row?.branch,
                            roleName,
                            params?.row?.id,
                            params?.row?.fullname,
                            params?.row?.designation
                          );
                        }}
                      >
                        SI
                      </Button>
                    ) : (
                      <></>
                    )}
                  </>
                </Grid>
              )}

            {params.row.roleback && (
              <span className="roleback-message">{`This Candidate was Moved to ${
                params.row.rolebacktocompany || ""
              }_${params?.row?.rolebacktobranch || ""}_${
                params.row.rolebackto
              }`}</span>
            )}
          </>
        </Grid>
      ),
    },
    {
      field: "prefix",
      headerName: "Courtesy Titles",
      flex: 0,
      width: 80,
      minHeight: "40px",
      hide: !columnVisibility.prefix,
    },

    {
      field: "fullname",
      headerName: "Applicant Name",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.fullname,
    },
    {
      field: "gender",
      headerName: "Gender",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.gender,
    },
    {
      field: "mobile",
      headerName: "Contact No",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.mobile,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.email,
    },
    {
      field: "adharnumber",
      headerName: "Aadhar Number",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.adharnumber,
    },
    {
      field: "dateofbirth",
      headerName: "DOB",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.dateofbirth,
    },
    {
      field: "qualification",
      headerName: "Education",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.qualification,
    },
    {
      field: "skill",
      headerName: "Skill",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.skill,
    },
    {
      field: "experience",
      headerName: "Experience",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.experience,
    },
    {
      field: "appliedat",
      headerName: "Applied Date/Time",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.appliedat,
    },
    {
      field: "removescreening",
      headerName: "Remove Screening",
      flex: 0,
      width: 200,
      minHeight: "40px",
      hide: !columnVisibility.removescreening,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {tableName === "Resume Screen" ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                // handleRemoveScreening(params.row.id);
                setShowUndoAlertPopup({
                  id: params.row.id,
                  action: "removescreen",
                });
                setShowUndoAlert(
                  <>
                    <ErrorOutlineOutlinedIcon
                      sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                      {`Do You Want to Remove Screening for ${params.row.fullname}?`}
                    </p>
                  </>
                );
                handleClickOpenerrUndo();
              }}
            >
              <UndoIcon />
            </Button>
          ) : (
            <></>
          )}
        </Grid>
      ),
    },
    {
      field: "removecandidate",
      headerName: "Remove Candidate",
      flex: 0,
      width: 200,
      minHeight: "40px",
      hide: !columnVisibility.removecandidate,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {tableName === "New Applicant" ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                // handleRemoveCandidate(params.row.id);
                // handleRemoveScreening(params.row.id);
                setShowUndoAlertPopup({
                  id: params.row.id,
                  action: "removecandidate",
                });
                setShowUndoAlert(
                  <>
                    <ErrorOutlineOutlinedIcon
                      sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                      {`Do You Want to Remove ${params.row.fullname} from this Job Role?`}
                    </p>
                  </>
                );
                handleClickOpenerrUndo();
              }}
            >
              <UndoIcon />
            </Button>
          ) : (
            <></>
          )}
        </Grid>
      ),
    },

    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 150,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,

      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          <Link
            to={`/recruitment/viewresume/${params.row.id}/recruitment/${ids}`}
          >
            <Button sx={userStyle.buttonedit}>
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          </Link>
          &nbsp;
          <Button
            sx={userStyle.buttonedit}
            onClick={() => {
              window.open(`/recruitment/edit/${params.row.id}`);
            }}
          >
            <EditOutlinedIcon style={{ fontsize: "large" }} />
          </Button>
        </Grid>
      ),
    },
    // {
    //   field: "status",
    //   headerName: "Status",
    //   flex: 0,
    //   width: 180,
    //   minHeight: "40px",
    //   hide: !columnVisibility.status,
    // },
  ];
  const rowDataTable = filteredData.map((item, index) => {
    const correctedArray = Array.isArray(item?.skill)
      ? item.skill.map((d) => (Array.isArray(d) ? d.join(",") : d))
      : [];
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      fullname: item.fullname,
      mobile: item.mobile,
      email: item.email,
      dateofbirth: item?.dateofbirth
        ? moment(item?.dateofbirth).format("DD-MM-YYYY")
        : "",
      qualification: item?.educationdetails
        ?.map(
          (t, i) =>
            `${i + 1 + ". "}` +
            `${t.categoryedu} - ${t.subcategoryedu} - ${t.specialization}`
        )
        .toString(),
      skill: correctedArray,
      experience: `${item?.experience} ${
        item?.experienceestimation == undefined
          ? "Years"
          : item?.experienceestimation
      }`,
      status: item.status,
      tablename: item?.tablename,
      candidatestatus: item?.candidatestatus,
      prefix: item?.prefix,
      gender: item?.gender,
      roleback: item?.roleback,
      rolebackto: item?.rolebackto,
      rolebacktocompany: item?.rolebacktocompany,
      rolebacktobranch: item?.rolebacktobranch,

      adharnumber: item?.adharnumber,
      interviewrounds: item?.interviewrounds,
      overallstatus: item?.overallstatus,
      appliedat: moment(item?.createdAt).format("DD-MM-YYYY hh:mm A"),
      company: singleJobData?.company,
      branch: singleJobData?.branch,
      designation: singleJobData?.designation,
    };
  });
  const calculateDataGridHeight = () => {
    if (pageSize === "All") {
      return "auto"; // Auto height for 'All' entries
    } else {
      // Calculate the height based on the number of rows displayed
      const visibleRows = Math.min(pageSize, filteredData.length);
      const rowHeight = 52; // Assuming row height is 52px (adjust as needed)
      const extraSpace = 70; // Add some extra space to prevent the last row from being hidden
      const scrollbarWidth = 52; // Width of the scrollbar (adjust as needed)
      return `${
        visibleRows > 0
          ? visibleRows * rowHeight + extraSpace
          : scrollbarWidth + extraSpace
      }px`;
    }
  };

  // Show All Columns functionality
  const handleShowAllColumns = () => {
    const updatedVisibility = { ...columnVisibility };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibility(updatedVisibility);
  };

  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem("columnVisibility");
    if (savedVisibility) {
      setColumnVisibility(JSON.parse(savedVisibility));
    }
  }, []);

  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem(
      "columnVisibility",
      JSON.stringify({
        ...columnVisibility,
        removescreening: false,
        removecandidate: false,

        scheduleinterview: true,
      })
    );
  }, [columnVisibility]);

  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  // Function to filter columns based on search query
  const filteredColumns = columnDataTable.filter((column) =>
    column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
  );

  // JSX for the "Manage Columns" popover content
  const manageColumnsContent = (
    <div style={{ padding: "10px", minWidth: "325px" }}>
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
                    sx={{ marginTop: "-10px" }}
                    checked={columnVisibility[column.field]}
                    onChange={() => toggleColumnVisibility(column.field)}
                  />
                }
                secondary={column.headerName}
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
              onClick={() => setColumnVisibility({})}
            >
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </div>
  );

  // Excel
  const fileName = tableName;

  let excelno = 1;

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Excel",
    pageStyle: "print",
  });

  //   useEffect(() => {
  //     fetchExcel();
  //   }, [])

  useEffect(() => {
    fetchEducation();
    fetchSkillSet();
    fetchCertifications();
    // fetchStatusCatandSub();
  }, []);

  const handleSendRole = () => {};

  return (
    <>
      <Grid item xs={4}>
        <>
          <Link
            to={`/recruitment/jobopenlist`}
            style={{
              textDecoration: "none",
              color: "white",
              float: "right",
              marginTop: "-40px",
            }}
          >
            <Button variant="contained">Back</Button>
          </Link>
        </>
      </Grid>
      <Box sx={userStyle.container}>
        <Typography sx={userStyle.HeaderText}>Recruitment Overview </Typography>
        <NotificationContainer />
        {isUserRoleCompare?.includes("ajobopenings") && (
          <Box
            sx={{
              border: "1px solid #80808036",
              boxShadow: "0px 0px 2px grey",
            }}
          >
            <Box
              sx={{
                height: "max-content",
                backgroundColor: "#f4f4f4",
                minHeight: "60px",
                color: "#444",
                boxShadow: "0px 0px 2px grey",
                borderRadius: "3px",
                padding: "10px",
                border: "1px solid #0000006b",
                "&:hover": {
                  "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                    backgroundColor: "#f4f4f4",
                  },
                },
              }}
            >
              <Grid container spacing={2}>
                <Grid item md={2} xs={12} sm={3}>
                  Recruitment Overview
                </Grid>
                <Grid item md={2} xs={12} sm={4}>
                  <Link to={`/addcandidate/${ids}`}>
                    <Button
                      onClick={handleSendRole}
                      variant="contained"
                      color="success"
                      sx={{ textTransform: "capitalize" }}
                    >
                      {" "}
                      Add Candidate
                    </Button>
                  </Link>
                </Grid>
                <Grid item md={4} xs={12} sm={4}>
                  <CopyToClipboard
                    onCopy={handleCopy}
                    options={{ message: "Copied!" }}
                    text={`${BASE_URL}/career/jobdescriptions/${singleJobData.recruitmentname}/${singleJobData._id}`}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ textTransform: "capitalize" }}
                    >
                      {" "}
                      Internal Recruitment Link
                    </Button>
                  </CopyToClipboard>
                </Grid>
                <Grid item md={4} xs={12} sm={4}>
                  <CopyToClipboard
                    onCopy={handleCopy}
                    options={{ message: "Copied!" }}
                    text={`http://hihrms.ttsbusinessservices.com/career/jobdescriptions/${singleJobData.recruitmentname}/${singleJobData._id}`}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ textTransform: "capitalize" }}
                    >
                      {" "}
                      External Recruitment Link
                    </Button>
                  </CopyToClipboard>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ padding: "15px" }}>
              <TableContainer>
                <Table>
                  <TableHead sx={{ padding: "0" }}>
                    <TableRow style={{ minHeight: "10px" }}>
                      <TableCell
                        style={{
                          background: "black",
                          color: "white",
                          border: "1px solid grey",
                          padding: "0 16px",
                        }}
                      >
                        Recuritment Name
                      </TableCell>
                      <TableCell
                        style={{
                          background: "black",
                          color: "white",
                          border: "1px solid grey",
                          padding: "0 16px",
                        }}
                      >
                        Status
                      </TableCell>
                      <TableCell
                        style={{
                          background: "black",
                          color: "white",
                          border: "1px solid grey",
                          padding: "0 16px",
                        }}
                      >
                        Approved Seats
                      </TableCell>
                      <TableCell
                        style={{
                          background: "black",
                          color: "white",
                          border: "1px solid grey",
                          padding: "0 16px",
                        }}
                      >
                        Active Candidates
                      </TableCell>
                      <TableCell
                        style={{
                          background: "black",
                          color: "white",
                          border: "1px solid grey",
                          padding: "0 16px",
                        }}
                      >
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{singleJobData.recruitmentname}</TableCell>
                      <TableCell>{singleJobData.status}</TableCell>
                      <TableCell>{singleJobData.approvedseats}</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>
                        <Grid container spacing={2}>
                          <Grid item md={8} xs={12} sm={12}>
                            <Selects
                              styles={{
                                menuList: (styles) => ({
                                  ...styles,
                                  background: "white",
                                  maxHeight: "200px",
                                  width: "100%",
                                  boxShadow: "0px 0px 5px #00000052",
                                  position: "relative",
                                }),
                                menu: (provided) => ({
                                  ...provided,
                                  zIndex: 9999, // Adjust the value as needed
                                  position: "relative",
                                }),
                              }}
                              value={{
                                label: statusChange,
                                value: statusChange,
                              }}
                              options={statusOptions}
                              onChange={(e) => {
                                setStatusChange(e.value);
                              }}
                            />
                          </Grid>
                          <Grid item md={2} xs={12} sm={12}>
                            <Button
                              onClick={() => {
                                handleRoleUpdate(statusChange);
                              }}
                              variant="contained"
                              color="primary"
                              size="small"
                            >
                              Update
                            </Button>
                          </Grid>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        )}
      </Box>

      <br />
      {isUserRoleCompare?.includes("ljobopenings") && (
        <Box sx={userStyle.container}>
          <br />
          <Grid container spacing={2} sx={{ justifyContent: "center" }}>
            <Grid item md={1.7} xs={12} sm={4}>
              <LoadingButton
                onClick={() => {
                  fetchCandidateAll();
                  setTableName("Overall Applicant");
                  setColumnVisibility((prevVisibility) => ({
                    ...prevVisibility,
                    scheduleinterview: true,
                    removescreening: false,
                    removecandidate: false,
                  }));
                  setRowIndex();
                  setStatus({});
                }}
                sx={{
                  display: "block",
                  background: "#f4f4f4",
                  height: "75px",
                  border: "1px solid lightgrey",
                  width: "100%",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
                loading={!loader}
              >
                <Typography>{overAllcount}</Typography>
                Overall Applicant
              </LoadingButton>
            </Grid>
            <Grid item md={1.7} xs={12} sm={4}>
              <LoadingButton
                onClick={() => {
                  // fetchCandidateNew();
                  getinfoCode("newapplicant");
                  setTableName("New Applicant");
                  setColumnVisibility((prevVisibility) => ({
                    ...prevVisibility,
                    scheduleinterview: true,
                    removecandidate: true,
                    removescreening: false,
                  }));
                  setRowIndex();
                  setStatus({});
                }}
                sx={{
                  display: "block",
                  background: "#f4f4f4",
                  height: "75px",
                  border: "1px solid lightgrey",
                  width: "100%",
                  fontWeight: "bold",
                  fontSize: "13px",
                }}
                loading={!loader}
              >
                <Typography>{todayCandiDates}</Typography>
                New Applicant
              </LoadingButton>
            </Grid>
            <Grid item md={1.7} xs={12} sm={4}>
              <LoadingButton
                sx={{
                  display: "block",
                  background: "#f4f4f4",
                  height: "75px",
                  border: "1px solid lightgrey",
                  width: "100%",
                  fontWeight: "bold",
                  fontSize: "13px",
                }}
                loading={!loader}
                onClick={() => {
                  getScreenedCandidate("clicked");
                  setTableName("Resume Screen");
                  setColumnVisibility((prevVisibility) => ({
                    ...prevVisibility,
                    scheduleinterview: true,
                    removescreening: true,
                    removecandidate: false,
                  }));
                  setRowIndex();
                  setStatus({});
                }}
              >
                <Typography>{screenedCount}</Typography>
                Resume Screen
              </LoadingButton>
            </Grid>
            <Grid item md={1.7} xs={12} sm={4}>
              <Link
                to={`/interviewrounds/${ids}`}
                style={{
                  textDecoration: "none",
                  color: "#fff",
                  minWidth: "0px",
                }}
              >
                <LoadingButton
                  sx={{
                    display: "block",
                    background: "#f4f4f4",
                    height: "75px",
                    border: "1px solid lightgrey",
                    width: "100%",
                    fontWeight: "bold",
                    fontSize: "13px",
                  }}
                  loading={!loader}
                >
                  <Typography>{interviewCount}</Typography>
                  Interview
                </LoadingButton>
              </Link>
            </Grid>
            <Grid item md={1.7} xs={12} sm={4}>
              <Link
                to={`/hiredcandidates/${ids}`}
                style={{
                  textDecoration: "none",
                  color: "#fff",
                  minWidth: "0px",
                }}
              >
                <LoadingButton
                  sx={{
                    display: "block",
                    background: "#f4f4f4",
                    height: "75px",
                    border: "1px solid lightgrey",
                    width: "100%",
                    fontWeight: "bold",
                    fontSize: "13px",
                  }}
                  loading={!loader}
                >
                  <Typography>{hiredCount}</Typography>
                  Hired
                </LoadingButton>
              </Link>
            </Grid>
            <Grid item md={1.7} xs={12} sm={4}>
              <Link
                to={`/rejectedcandidates/${ids}`}
                style={{
                  textDecoration: "none",
                  color: "#fff",
                  minWidth: "0px",
                }}
              >
                <LoadingButton
                  sx={{
                    display: "block",
                    background: "#f4f4f4",
                    height: "75px",
                    border: "1px solid lightgrey",
                    width: "100%",
                    fontWeight: "bold",
                    fontSize: "13px",
                  }}
                  loading={!loader}
                >
                  <Typography>{rejectedCount}</Typography>
                  Rejected
                </LoadingButton>
              </Link>
            </Grid>
            <Grid item md={1.7} xs={12} sm={4}>
              <Link
                to={`/inactivecandidates/${ids}`}
                style={{
                  textDecoration: "none",
                  color: "#fff",
                  minWidth: "0px",
                }}
              >
                <LoadingButton
                  sx={{
                    display: "block",
                    background: "#f4f4f4",
                    height: "75px",
                    border: "1px solid lightgrey",
                    width: "100%",
                    fontWeight: "bold",
                    fontSize: "13px",
                  }}
                  loading={!loader}
                >
                  <Typography>{inactiveCount}</Typography>
                  InActive
                </LoadingButton>
              </Link>
            </Grid>
          </Grid>
          <br />
          {/* <Box sx={userStyle.container}> */}
          <Grid container spacing={1}>
            <Grid item md={12} xs={12} sm={12}>
              <Typography
                sx={{
                  fontWeight: "bold",
                  color: "#444",
                  lineHeight: "1",
                  fontSize: "18px",
                }}
              >
                {tableName}
              </Typography>
            </Grid>
          </Grid>
          <br />
          <Grid container spacing={1}>
            <Grid item md={3} xs={12} sm={12}></Grid>
          </Grid>
          {/* </Box> */}
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
                  <MenuItem value={jobTable?.length}>All</MenuItem>
                </Select>
              </Box>
            </Grid>
            <Grid
              item
              md={2}
              xs={12}
              sm={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                onClick={handleMakeOpen}
                color="primary"
              >
                Make Screening
              </Button>
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
              sm={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box>
                <>
                  {isUserRoleCompare?.includes("exceljobopenings") && (
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
                  )}
                </>

                <>
                  {isUserRoleCompare?.includes("csvjobopenings") && (
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
                  )}
                </>
                <>
                  {isUserRoleCompare?.includes("printjobopenings") && (
                    <Button sx={userStyle.buttongrp} onClick={handleprint}>
                      &ensp;
                      <FaPrint />
                      &ensp;Print&ensp;
                    </Button>
                  )}
                </>
                <>
                  {isUserRoleCompare?.includes("pdfjobopenings") && (
                    <Button
                      sx={userStyle.buttongrp}
                      onClick={() => {
                        setIsPdfFilterOpen(true);
                      }}
                    >
                      <FaFilePdf />
                      &ensp;Export to PDF&ensp;
                    </Button>
                  )}
                </>
                <>
                  {isUserRoleCompare?.includes("imagejobopenings") && (
                    <Button
                      sx={userStyle.buttongrp}
                      onClick={handleCaptureImage}
                    >
                      {" "}
                      <ImageIcon
                        sx={{ fontSize: "15px" }}
                      /> &ensp;image&ensp;{" "}
                    </Button>
                  )}
                </>
                {/* )} */}
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
          <br />
          <Button
            sx={userStyle.buttongrp}
            onClick={() => {
              handleShowAllColumns();
              setColumnVisibility(initialColumnVisibility);
            }}
          >
            Show All Columns
          </Button>
          &emsp;
          <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
            Manage Columns
          </Button>
          <br />
          <br />
          {!loader ? (
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
            <Box
              style={{
                height: calculateDataGridHeight(),
                width: "100%",
                overflowY: "hidden", // Hide the y-axis scrollbar
              }}
            >
              <StyledDataGrid
                ref={gridRef}
                rows={rowDataTable}
                columns={columnDataTable.filter(
                  (column) => columnVisibility[column.field]
                )} // Only render visible columns
                autoHeight={pageSize === "All"}
                hideFooter
                getRowClassName={getRowClassName}
                className={dataGridStyles.root}
              />
            </Box>
          )}
          <br />
          <Box style={userStyle.dataTablestyle}>
            <Box>
              Showing {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0}{" "}
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
        </Box>
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
      {/* ****** Table start ****** */}

      <TableContainer component={Paper} sx={userStyle.printcls}>
        {/* <Addcandidate applyrole={singleJobData.recruitmentname} /> */}

        {/* <Addcandidate roleName={roleName} /> */}

        <Table aria-label="simple table" id="excel" ref={componentRef}>
          <TableHead sx={{ fontWeight: "600" }}>
            <StyledTableRow>
              <StyledTableCell>S.No</StyledTableCell>
              <StyledTableCell>Applicant Name </StyledTableCell>
              <StyledTableCell>Gender </StyledTableCell>
              <StyledTableCell>Contact No </StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Aadhar Number</StyledTableCell>
              <StyledTableCell>DOB </StyledTableCell>
              <StyledTableCell>Education</StyledTableCell>
              <StyledTableCell>Skill</StyledTableCell>
              <StyledTableCell>Experience</StyledTableCell>
              <StyledTableCell>Applied Date/Time</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {rowDataTable &&
              rowDataTable.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{row.fullname} </StyledTableCell>
                  <StyledTableCell>{row.gender} </StyledTableCell>
                  <StyledTableCell>{row.mobile}</StyledTableCell>
                  <StyledTableCell>{row.email}</StyledTableCell>
                  <StyledTableCell>{row.adharnumber}</StyledTableCell>
                  <StyledTableCell>{row.dateofbirth} </StyledTableCell>
                  <StyledTableCell>{row.qualification} </StyledTableCell>
                  <StyledTableCell>{row.skill}</StyledTableCell>
                  <StyledTableCell>{row.experience}</StyledTableCell>
                  <StyledTableCell>{row.appliedat}</StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={isOpen}
        onClose={handleMakeClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth={true}
        sx={{
          overflow: "visible",
          "& .MuiPaper-root": {
            overflow: "visible",
          },
        }}
      >
        <Box sx={{ padding: "30px 35px" }}>
          <>
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <Typography sx={userStyle.HeaderText}>
                  Candidate Screening{" "}
                </Typography>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <Typography>Education Category</Typography>
                <FormControl size="small" fullWidth>
                  <MultiSelect
                    size="small"
                    options={educationCategory}
                    value={selectedOptionsEducationCategoryAdd}
                    onChange={handleEducationCategoryChangeAdd}
                    valueRenderer={customValueRendererEducationCategoryAdd}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <Typography>Education Sub Category</Typography>
                <FormControl size="small" fullWidth>
                  <MultiSelect
                    size="small"
                    options={educationDatas
                      ?.filter((item) =>
                        item.category.some((item) =>
                          valueEducationCategoryAdd.includes(item)
                        )
                      )
                      ?.flatMap((item) =>
                        item?.subcategory?.map((data) => ({
                          label: data,
                          value: data,
                        }))
                      )}
                    value={selectedOptionsEducationSubCategoryAdd}
                    onChange={handleEducationSubCategoryChangeAdd}
                    valueRenderer={customValueRendererEducationSubCategoryAdd}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <Typography>Education Specilization</Typography>
                <FormControl size="small" fullWidth>
                  <MultiSelect
                    size="small"
                    options={educationDatas
                      ?.filter(
                        (item) =>
                          item.category.some((item) =>
                            valueEducationCategoryAdd.includes(item)
                          ) &&
                          item.subcategory.some((item) =>
                            valueEducationSubCategoryAdd.includes(item)
                          )
                      )
                      ?.flatMap((item) =>
                        item?.specilizationgrp?.map((data) => ({
                          label: data.label,
                          value: data.label,
                        }))
                      )}
                    value={selectedOptionsEducationSpecilizationAdd}
                    onChange={handleEducationSpecilizationChangeAdd}
                    valueRenderer={customValueRendererEducationSpecilizationAdd}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>SkillSet</Typography>
                  <MultiSelect
                    size="small"
                    options={skillSet}
                    value={selectedOptionsSkillsetAdd}
                    onChange={handleSkillsetChangeAdd}
                    valueRenderer={customValueRendererSkillsetAdd}
                  />
                </FormControl>
              </Grid>

              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>Certification</Typography>
                  <MultiSelect
                    size="small"
                    options={certification}
                    value={selectedOptionsCertificationAdd}
                    onChange={handleCertificationChangeAdd}
                    valueRenderer={customValueRendererCertificationAdd}
                  />
                </FormControl>
              </Grid>

              <Grid
                item
                md={candidateFilter.validation !== "Between" ? 3 : 2}
                xs={12}
                sm={12}
              >
                <FormControl fullWidth size="small">
                  <Typography>Expected Salary</Typography>
                  <Selects
                    options={[
                      {
                        label: `Less Than`,
                        value: `Less Than`,
                      },
                      {
                        label: `Less Than or Equal to`,
                        value: `Less Than or Equal to`,
                      },
                      {
                        label: `Greater Than`,
                        value: `Greater Than`,
                      },
                      {
                        label: `Greater Than or Equal to`,
                        value: `Greater Than or Equal to`,
                      },
                      {
                        label: `Equal to`,
                        value: `Equal to`,
                      },
                      {
                        label: `Between`,
                        value: `Between`,
                      },
                    ]}
                    styles={colourStyles}
                    value={{
                      label: candidateFilter.validation,
                      value: candidateFilter.validation,
                    }}
                    onChange={(e) =>
                      setCandidateFilter({
                        ...candidateFilter,
                        validation: e.value,
                        expectedsalaryto: "",
                        expectedsalary: "",
                      })
                    }
                  />
                </FormControl>
              </Grid>
              <Grid
                item
                md={candidateFilter.validation !== "Between" ? 3 : 2}
                xs={12}
                sm={12}
              >
                <FormControl fullWidth size="small">
                  <Typography>&nbsp;</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder={
                      candidateFilter.validation !== "Between"
                        ? "Expected Salary"
                        : "From"
                    }
                    value={candidateFilter?.expectedsalary}
                    onChange={(e) => {
                      const numericOnly = e.target.value.replace(
                        /[^0-9.;\s]/g,
                        ""
                      );
                      setCandidateFilter({
                        ...candidateFilter,
                        expectedsalary: numericOnly,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              {candidateFilter.validation === "Between" && (
                <Grid item md={2} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>&nbsp;</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="To"
                      value={candidateFilter?.expectedsalaryto}
                      onChange={(e) => {
                        const numericOnly = e.target.value.replace(
                          /[^0-9.;\s]/g,
                          ""
                        );
                        setCandidateFilter({
                          ...candidateFilter,
                          expectedsalaryto: numericOnly,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
              )}

              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>Location</Typography>
                  <MultiSelect
                    size="small"
                    options={location}
                    value={selectedOptionsLocationAdd}
                    onChange={handleLocationChangeAdd}
                    valueRenderer={customValueRendererLocationAdd}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>Joining In Days</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Please Enter No.of days"
                    value={candidateFilter?.joiningindays}
                    onChange={(e) => {
                      const numericOnly = e.target.value
                        .replace(/[^0-9.;\s]/g, "")
                        .slice(0, 3);
                      setCandidateFilter({
                        ...candidateFilter,
                        joiningindays: numericOnly,
                      });
                    }}
                  />
                </FormControl>
              </Grid>

              <Grid item md={3} xs={12} sm={12}>
                <Typography>Age </Typography>
                <Grid container spacing={1}>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="From"
                        value={candidateFilter?.agefrom}
                        onChange={(e) => {
                          const numericOnly = e.target.value
                            .replace(/[^0-9.;\s]/g, "")
                            .slice(0, 2);
                          setCandidateFilter({
                            ...candidateFilter,
                            agefrom: numericOnly,
                            ageto: "",
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="To"
                        value={candidateFilter?.ageto}
                        onChange={(e) => {
                          const numericOnly = e.target.value
                            .replace(/[^0-9.;\s]/g, "")
                            .slice(0, 2);
                          setCandidateFilter({
                            ...candidateFilter,
                            ageto: numericOnly,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={2} xs={12} sm={12}></Grid>
                </Grid>
              </Grid>

              <Grid item md={3} xs={12} sm={12}>
                <Typography>Experience </Typography>
                <Grid container spacing={1}>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="From"
                        value={candidateFilter?.expfrom}
                        onChange={(e) => {
                          const numericOnly = e.target.value
                            .replace(/[^0-9.;\s]/g, "")
                            .slice(0, 2);
                          setCandidateFilter({
                            ...candidateFilter,
                            expfrom: numericOnly,
                            expto: "",
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="To"
                        value={candidateFilter?.expto}
                        onChange={(e) => {
                          const numericOnly = e.target.value
                            .replace(/[^0-9.;\s]/g, "")
                            .slice(0, 2);
                          setCandidateFilter({
                            ...candidateFilter,
                            expto: numericOnly,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={2} xs={12} sm={12}></Grid>
                </Grid>
              </Grid>
            </Grid>
          </>
          <br />
          <Grid
            container
            spacing={2}
            sx={{
              paddingLeft: "40px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Grid item md={4} xs={12} sm={6}>
              <Button
                variant="contained"
                style={{
                  padding: "7px 13px",
                  color: "white",
                  background: "rgb(25, 118, 210)",
                }}
                onClick={handleFilter}
              >
                filter
              </Button>
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <Button
                style={{
                  backgroundColor: "#f4f4f4",
                  color: "#444",
                  boxShadow: "none",
                  borderRadius: "3px",
                  padding: "7px 13px",
                  border: "1px solid #0000006b",
                  "&:hover": {
                    "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                      backgroundColor: "#f4f4f4",
                    },
                  },
                }}
                onClick={handleClear}
              >
                clear
              </Button>
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <Button
                style={{
                  backgroundColor: "#f4f4f4",
                  color: "#444",
                  boxShadow: "none",
                  borderRadius: "3px",
                  padding: "7px 13px",
                  border: "1px solid #0000006b",
                  "&:hover": {
                    "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                      backgroundColor: "#f4f4f4",
                    },
                  },
                }}
                onClick={handleMakeClose}
              >
                close
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Dialog>

      {/* schedule interview popup*/}
      <Dialog
        open={openMeetingPopup}
        onClose={handleClickCloseMeetingPopup}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        // sx={{
        //     overflow: "visible",
        //     "& .MuiPaper-root": {
        //         overflow: "visible",
        //     },
        // }}
        fullWidth={true}
      >
        <ScheduleInterview
          setVendorAuto={setVendorAuto}
          handleClickCloseMeetingPopup={handleClickCloseMeetingPopup}
          getScreenedCandidate={getScreenedCandidate}
          meetingValues={meetingValues}
          roundname={notaround}
          tablesname={tableName}
          jobopeningsid={ids}
        />
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
              {" "}
              ok{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      {/* Undo DIALOG */}
      <Box>
        <Dialog
          open={isUndoOpen}
          onClose={handleCloseerrUndo}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            <Typography variant="h6">{showUndoAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseerrUndo} sx={userStyle.btncancel}>
              No
            </Button>
            <Button
              autoFocus
              variant="contained"
              color="primary"
              onClick={() => {
                if (showUndoAlertpopup.action === "removescreen") {
                  handleRemoveScreening(showUndoAlertpopup.id);
                } else {
                  handleRemoveCandidate(showUndoAlertpopup.id);
                }
              }}
            >
              {" "}
              Yes{" "}
            </Button>
          </DialogActions>
        </Dialog>

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
    </>
  );
};
export default Recuritment;