import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  TableBody,
  TableRow,
  TableCell,
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
import { handleApiError } from "../../../../components/Errorhandling";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import moment from "moment-timezone";
import {
  UserRoleAccessContext,
  AuthContext,
} from "../../../../context/Appcontext";
import Headtitle from "../../../../components/Headtitle";
import PageHeading from "../../../../components/PageHeading";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";

import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import ImageIcon from "@mui/icons-material/Image";
import { MultiSelect } from "react-multi-select-component";
import { Link } from "react-router-dom";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import Pagination from "../../../../components/Pagination";

function Resumemanagement() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  useEffect(() => {
    exportallData();
  }, [isFilterOpen, isPdfFilterOpen]);
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
        rowDataTable?.map((item, index) => ({
          "S.No": index + 1,
          Status: item.overallstatus,
          "Applicant Name": item.fullname,
          Role: item.role,
          City: item.city,
          "Contact No": item.mobile,
          Email: item.email,
          DOB: item.dateofbirth,
          Skill: item.skill,
          Experience: item.experience,
        })),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        candidateExport?.map((item, index) => ({
          "S.No": index + 1,
          Status: item.overallstatus,
          "Applicant Name": item.fullname,
          Role: item.role,
          City: item.city,
          "Contact No": item.mobile,
          Email: item.email,
          DOB: item.dateofbirth,
          Skill: item.skill?.join(","),
          Experience: `${item?.experience} ${
            item?.experienceestimation == undefined
              ? "Years"
              : item?.experienceestimation
          }`,
        })),
        fileName
      );
    }

    setIsFilterOpen(false);
  };

  const [totalProjects, setTotalProjects] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusCheck, setStatusCheck] = useState(false);

  const [educationCategory, setEducationCategory] = useState([]);
  const [educationDatas, setEducationDatas] = useState([]);
  const [skillSet, setSkillSet] = useState([]);
  const [certification, setCertification] = useState([]);
  const [candidateFilter, setCandidateFilter] = useState({
    role: "Please Select Role",
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
    status: "Please Select Status",
  });

  const [status, setStatus] = useState([]);
  let defaultStatus = [
    { label: "Applied", value: "Applied" },
    { label: "Rejected", value: "Rejected" },
    { label: "On Hold", value: "On Hold" },
    { label: "Selected", value: "Selected" },
    { label: "Screened", value: "Screened" },
    { label: "First No Response", value: "First No Response" },
    { label: "Second No Response", value: "Second No Response" },
    { label: "No Response", value: "No Response" },
    { label: "Not Interested", value: "Not Interested" },
    { label: "Got Other Job", value: "Got Other Job" },
    { label: "Already Joined", value: "Already Joined" },
    { label: "Duplicate Candidate", value: "Duplicate Candidate" },
    { label: "Profile Not Eligible", value: "Profile Not Eligible" },
  ];

  const fetchEducation = async () => {
    setPageName(!pageName);
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
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const fetchSkillSet = async () => {
    setPageName(!pageName);
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchCertifications = async () => {
    setPageName(!pageName);
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchRoundmaster = async () => {
    setPageName(!pageName);
    try {
      let res_vendor = await axios.get(SERVICE.ROUNDMASTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let rounds = res_vendor?.data?.roundmasters?.map((item) => ({
        label: item.nameround,
        value: item.nameround,
      }));
      setStatus([...defaultStatus, ...rounds]);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const { isUserRoleCompare, pageName, setPageName } = useContext(
    UserRoleAccessContext
  );
  const { auth } = useContext(AuthContext);

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // State for manage columns search query
  const [searchQueryManage, setSearchQueryManage] = useState("");

  const [location, setLocation] = useState([]);
  const [candidate, setCandidate] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);

  useEffect(() => {
    fetchAllCandidate();
  }, [page, pageSize]);

  const fetchAllCandidate = async () => {
    setStatusCheck(false);
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.RESUMEMANAGEMENT_CANDIDATE_FILTERED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        role: String(
          candidateFilter.role === "Please Select Role"
            ? ""
            : candidateFilter.role
        ),
        age: String(candidateFilter.agefrom),
        to: String(candidateFilter.ageto),
        fromexp: String(candidateFilter.expfrom),
        toexp: String(candidateFilter.expto),
        educationcategory:
          valueEducationCategoryAdd?.length > 0
            ? valueEducationCategoryAdd
            : [],
        educationsubcategory:
          valueEducationSubCategoryAdd?.length > 0
            ? valueEducationSubCategoryAdd
            : [],
        education:
          valueEducationSpecilizationAdd?.length > 0
            ? valueEducationSpecilizationAdd
            : [],
        skill: valueSkillsetAdd?.length > 0 ? valueSkillsetAdd : [],
        location: valueLocationAdd?.length > 0 ? valueLocationAdd : [],
        certification:
          valueCertificationAdd?.length > 0 ? valueCertificationAdd : [],
        joiningindays: String(candidateFilter.joiningindays),
        expectedsalary: String(candidateFilter.expectedsalary),
        expectedsalaryto: String(candidateFilter.expectedsalaryto),
        expectedsalaryvalidation: String(
          candidateFilter.validation === "Please Select Condition"
            ? ""
            : candidateFilter.validation
        ),
        overallstatus: valueStatusAdd?.length > 0 ? valueStatusAdd : [],

        page: Number(page),
        pageSize: Number(pageSize),
        searchQuery: searchQuery,
        type: makeScreenButton,
      });

      const ans = res?.data?.result?.length > 0 ? res?.data?.result : [];
      const itemsWithSerialNumber = ans?.map((item, index) => ({
        ...item,
        serialNumber: (page - 1) * pageSize + index + 1,
      }));
      setCandidate(itemsWithSerialNumber);
      setTotalProjects(ans?.length > 0 ? res?.data?.totalProjects : 0);
      setTotalPages(ans?.length > 0 ? res?.data?.totalPages : 0);
      setPageSize((data) => {
        return ans?.length > 0 ? data : 10;
      });
      setPage((data) => {
        return ans?.length > 0 ? data : 1;
      });

      setLocation(res.data.locationdropdown);

      setRoleOptions(res.data.roledropdown);

      setStatusCheck(true);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const [candidateExport, setCandidateExport] = useState([]);
  const exportallData = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.RESUMEMANAGEMENT_CANDIDATE_SORT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        role: String(
          candidateFilter.role === "Please Select Role"
            ? ""
            : candidateFilter.role
        ),
        age: String(candidateFilter.agefrom),
        to: String(candidateFilter.ageto),
        fromexp: String(candidateFilter.expfrom),
        toexp: String(candidateFilter.expto),
        educationcategory:
          valueEducationCategoryAdd?.length > 0
            ? valueEducationCategoryAdd
            : [],
        educationsubcategory:
          valueEducationSubCategoryAdd?.length > 0
            ? valueEducationSubCategoryAdd
            : [],
        education:
          valueEducationSpecilizationAdd?.length > 0
            ? valueEducationSpecilizationAdd
            : [],
        skill: valueSkillsetAdd?.length > 0 ? valueSkillsetAdd : [],
        location: valueLocationAdd?.length > 0 ? valueLocationAdd : [],
        certification:
          valueCertificationAdd?.length > 0 ? valueCertificationAdd : [],
        joiningindays: String(candidateFilter.joiningindays),
        expectedsalary: String(candidateFilter.expectedsalary),
        expectedsalaryto: String(candidateFilter.expectedsalaryto),
        expectedsalaryvalidation: String(
          candidateFilter.validation === "Please Select Condition"
            ? ""
            : candidateFilter.validation
        ),
        overallstatus: valueStatusAdd?.length > 0 ? valueStatusAdd : [],

        page: Number(page),
        pageSize: Number(pageSize),
        searchQuery: searchQuery,
        type: makeScreenButton,
      });

      setCandidateExport(res?.data?.candidates);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const fetchAllCandidateClear = async () => {
    setStatusCheck(false);
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.RESUMEMANAGEMENT_CANDIDATE_FILTERED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        role: "",
        age: "",
        to: "",
        fromexp: "",
        toexp: "",
        educationcategory: [],
        educationsubcategory: [],
        education: [],
        skill: [],
        location: [],
        certification: [],
        joiningindays: "",
        expectedsalary: "",
        expectedsalaryto: "",
        expectedsalaryvalidation: "",
        overallstatus: [],

        page: Number(1),
        pageSize: Number(10),
        searchQuery: "",
        type: "All",
      });

      const ans = res?.data?.result?.length > 0 ? res?.data?.result : [];
      const itemsWithSerialNumber = ans?.map((item, index) => ({
        ...item,
        serialNumber: (page - 1) * pageSize + index + 1,
      }));
      setCandidate(itemsWithSerialNumber);
      setTotalProjects(ans?.length > 0 ? res?.data?.totalProjects : 0);
      setTotalPages(ans?.length > 0 ? res?.data?.totalPages : 0);
      setPageSize((data) => {
        return ans?.length > 0 ? data : 10;
      });
      setPage((data) => {
        return ans?.length > 0 ? data : 1;
      });

      setLocation(res?.data?.locationdropdown);
      setRoleOptions(res?.data?.roledropdown);
      setMakeScreenButton("All");
      setStatusCheck(true);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  useEffect(() => {
    fetchEducation();
    fetchSkillSet();
    fetchCertifications();
    fetchRoundmaster();
    fetchAllCandidate();
  }, []);

  const [makeScreenButton, setMakeScreenButton] = useState("");

  const handleFilter = async (e, from) => {
    e.preventDefault();
    setStatusCheck(false);
    setPageName(!pageName);
    try {
      if (
        from === "screening" &&
        candidateFilter.role === "Please Select Role"
      ) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Select Role for Make Screening"}
            </p>
          </>
        );
        handleClickOpenerr();
      } else if (
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
        if (from === "filter") {
          let res = await axios.post(
            SERVICE.RESUMEMANAGEMENT_CANDIDATE_FILTERED,
            {
              role: String(
                candidateFilter.role === "Please Select Role"
                  ? ""
                  : candidateFilter.role
              ),
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
              overallstatus: valueStatusAdd,
              page: Number(page),
              pageSize: Number(pageSize),
              type: "Filter",
            },
            {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
            }
          );
          // setCandidate(res?.data?.candidates);
          const ans = res?.data?.result?.length > 0 ? res?.data?.result : [];
          const itemsWithSerialNumber = ans?.map((item, index) => ({
            ...item,
            serialNumber: (page - 1) * pageSize + index + 1,
          }));
          setCandidate(itemsWithSerialNumber);
          setTotalProjects(ans?.length > 0 ? res?.data?.totalProjects : 0);
          setTotalPages(ans?.length > 0 ? res?.data?.totalPages : 0);
          setPageSize((data) => {
            return ans?.length > 0 ? data : 10;
          });
          setPage((data) => {
            return ans?.length > 0 ? data : 1;
          });
          setStatusCheck(true);
          setMakeScreenButton("Filter");
        } else if (from === "screening") {
          let res = await axios.post(
            SERVICE.RESUMEMANAGEMENT_CANDIDATE_FILTERED,
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
              role: String(candidateFilter.role),

              page: Number(page),
              pageSize: Number(pageSize),
              type: "Screening",
            },
            {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
            }
          );

          const ans = res?.data?.result?.length > 0 ? res?.data?.result : [];
          const itemsWithSerialNumber = ans
            ?.filter(
              (item) =>
                item.screencandidate === "Screened" &&
                (item?.interviewrounds?.length === 0 ||
                  item?.interviewrounds == undefined)
            )
            ?.map((item, index) => ({
              ...item,
              serialNumber: (page - 1) * pageSize + index + 1,
            }));
          setCandidate(itemsWithSerialNumber);
          setTotalProjects(ans?.length > 0 ? res?.data?.totalProjects : 0);
          setTotalPages(ans?.length > 0 ? res?.data?.totalPages : 0);
          setPageSize((data) => {
            return ans?.length > 0 ? data : 10;
          });
          setPage((data) => {
            return ans?.length > 0 ? data : 1;
          });
          setMakeScreenButton("Screening");
          setStatusCheck(true);
        }
      }
    } catch (err) {
      setStatusCheck(true);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [deletequeue, setDeleteQueue] = useState({});
  const rowData = async (id, name) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.CANDIDATES_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteQueue(res?.data?.scandidates);
      handleClickOpen();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  let queueid = deletequeue._id;
  const deleQueue = async () => {
    setPageName(!pageName);
    try {
      await axios.delete(`${SERVICE.CANDIDATES_SINGLE}/${queueid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchAllCandidate();
      handleCloseMod();
      // handleCloseCheck();
      setPage(1);
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Deleted Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const gridRef = useRef(null);

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setStatusCheck(true);
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
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

  const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    "& .MuiDataGrid-virtualScroller": { overflowY: "hidden" },
    "& .MuiDataGrid-columnHeaderTitle": { fontWeight: " bold !important " },
    "& .custom-id-row": { backgroundColor: "#1976d22b !important" },
    "& .MuiDataGrid-row.Mui-selected": {
      "& .custom-ago-row, & .custom-in-row, & .custom-others-row": {
        backgroundColor: "unset !important", // Clear the background color for selected rows
      },
    },
    "&:hover": {
      "& .custom-ago-row:hover": { backgroundColor: "#ff00004a !important" },
      "& .custom-in-row:hover": { backgroundColor: "#ffff0061 !important" },
      "& .custom-others-row:hover": { backgroundColor: "#0080005e !important" },
    },
  }));

  const dataGridStyles = {
    root: {
      "& .MuiDataGrid-row": {
        height: "15px",
      },
    },
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    actions: true,
    serialNumber: true,
    overallstatus: true,
    role: true,
    city: true,
    fullname: true,
    mobile: true,
    email: true,
    dateofbirth: true,
    qualification: true,
    skill: true,
    experience: true,
    category: true,
    subcategory: true,
    specialization: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  const handleClear = async (e) => {
    setCandidateFilter({
      role: "Please Select Role",
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
      status: "Please Select Status",
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

    setValueStatusAdd([]);
    setSelectedOptionsStatusAdd([]);

    setShowAlert(
      <>
        <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>
          {"Cleared Successfully"}
        </p>
      </>
    );
    handleClickOpenerr();

    await fetchAllCandidateClear();
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
    return valueEducationCategoryAdd?.length ? (
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
    return valueEducationSubCategoryAdd?.length ? (
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
    return valueEducationSpecilizationAdd?.length ? (
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
    return valueSkillsetAdd?.length ? (
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
    return valueCertificationAdd?.length ? (
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
    return valueLocationAdd?.length ? (
      valueLocationAdd.map(({ label }) => label).join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Location</span>
    );
  };

  //status-----------------------------------------
  const [valueStatusAdd, setValueStatusAdd] = useState([]);
  const [selectedOptionsStatusAdd, setSelectedOptionsStatusAdd] = useState([]);
  const handleStatusChangeAdd = (options) => {
    setValueStatusAdd(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsStatusAdd(options);
  };

  const customValueRendererStatusAdd = (valueStatusAdd, _shifts) => {
    return valueStatusAdd?.length ? (
      valueStatusAdd.map(({ label }) => label).join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Status</span>
    );
  };

  const [roleName, setRoleName] = useState({});
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.CANDIDATES_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setRoleName(res?.data?.scandidates);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //Edit model...
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };

  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  let updateby = roleName.updatedby;
  let addedby = roleName.addedby;

  // pdf.....
  const columns = [
    { title: "Status", field: "overallstatus" },
    { title: "Name", field: "fullname" },
    { title: "Role", field: "role" },
    { title: "City", field: "city" },
    { title: "Contact No", field: "mobile" },
    { title: "Email", field: "email" },
    { title: "DOB", field: "dateofbirth" },
    { title: "Skill", field: "skill" },
    { title: "Experience", field: "experience" },
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
        ? rowDataTable.map((item, index) => ({
            serialNumber: index + 1,
            overallstatus: item.overallstatus,
            fullname: item.fullname,
            role: item.role,
            city: item.city,
            mobile: item.mobile,
            email: item.email,
            dateofbirth: item.dateofbirth,
            skill: item.skill?.join(","),
            experience: item.experience,
          }))
        : candidateExport?.map((item, index) => ({
            serialNumber: index + 1,
            overallstatus: item.overallstatus,
            fullname: item.fullname,
            role: item.role,
            city: item.city,
            mobile: item.mobile,
            email: item.email,
            dateofbirth: item.dateofbirth,
            skill: item.skill?.join(","),
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

    doc.save("Resumemanagement.pdf");
  };

  // Excel
  const fileName = "Resumemanagement";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "ResumeManagement",
    pageStyle: "print",
  });

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = candidate?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [candidate]);

  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setPage(1);
  };

  //datatable....
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };
  // Split the search query into individual terms
  const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = candidate?.filter((item) => {
    return searchOverTerms.every((term) =>
      Object.values(item)?.join(" ")?.toLowerCase()?.includes(term)
    );
  });

  // const filteredData = filteredDatas.slice(
  //   (page - 1) * pageSize,
  //   page * pageSize
  // );

  // const totalPagesss = Math.ceil(filteredDatas?.length / pageSize);

  // const visiblePages = Math.min(totalPagesss, 3);

  // const firstVisiblePage = Math.max(1, page - 1);
  // const lastVisiblePage = Math.min(
  //   firstVisiblePage + visiblePages - 1,
  //   totalPagesss
  // );

  // const pageNumbers = [];

  // for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
  //   pageNumbers.push(i);
  // }

  const columnDataTable = [
    {
      field: "serialNumber",
      headerName: "S.No",
      flex: 0,
      width: 50,
      minHeight: "40px",
      hide: !columnVisibility.serialNumber,
    },
    {
      field: "overallstatus",
      headerName: "Status",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.overallstatus,
      renderCell: (params) => (
        <>
          {params.row.overallstatus && (
            <Button
              variant="contained"
              style={{
                padding: "5px",
                background:
                  params.row.overallstatus === "Hold" ||
                  params.row.candidatestatus === "Already Joined"
                    ? "green"
                    : params.row.overallstatus === "Rejected" ||
                      (params.row.interviewrounds?.length > 0 &&
                        params.row.interviewrounds[
                          params.row.interviewrounds?.length - 1
                        ].roundanswerstatus === "Rejected")
                    ? "red"
                    : params.row.overallstatus === "Canceled" ||
                      params.row.candidatestatus === "No Response"
                    ? "red"
                    : params.row.overallstatus === "Continue" ||
                      (params.row.interviewrounds?.length > 0 &&
                        params.row.interviewrounds[
                          params.row.interviewrounds?.length - 1
                        ].roundanswerstatus === "Selected")
                    ? "green"
                    : params.row.candidatestatus === "Duplicate Candidate" ||
                      params.row.candidatestatus === "Profile Not Eligible" ||
                      params.row.candidatestatus === "Not Interested" ||
                      params.row.candidatestatus === "Got Other Job"
                    ? "blue"
                    : params.row.overallstatus === "Screened"
                    ? "#EE4E4E"
                    : params.row.overallstatus === "Applied"
                    ? "yellow"
                    : params.row.candidatestatus === "Second No Response"
                    ? "lightgreen"
                    : params.row.interviewrounds?.length > 0 &&
                      params.row.interviewrounds[
                        params.row.interviewrounds?.length - 1
                      ].roundanswerstatus === "On Hold"
                    ? "brown"
                    : "purple",
                color:
                  params.row.overallstatus === "Applied" ||
                  params.row.candidatestatus === "Second No Response"
                    ? "black"
                    : "white",
                fontSize: "10px",
                fontWeight: "bold",
              }}
            >
              {params.row.overallstatus}
            </Button>
          )}
        </>
      ),
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
      field: "role",
      headerName: "Role",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.role,
    },
    {
      field: "city",
      headerName: "City",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.city,
    },
    {
      field: "mobile",
      headerName: "Contact No",
      flex: 0,
      width: 120,
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
      field: "dateofbirth",
      headerName: "DOB",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.dateofbirth,
    },
    // { field: "category", headerName: "Category", flex: 0, width: 100, hide: !columnVisibility.category, headerClassName: "bold-header" },
    // { field: "subcategory", headerName: "Sub Category", flex: 0, width: 100, hide: !columnVisibility.subcategory, headerClassName: "bold-header" },
    // { field: "specialization", headerName: "Specialization", flex: 0, width: 100, hide: !columnVisibility.specialization, headerClassName: "bold-header" },
    {
      field: "skill",
      headerName: "Skill",
      flex: 0,
      width: 250,
      minHeight: "40px",
      hide: !columnVisibility.skill,
    },
    {
      field: "experience",
      headerName: "Experience",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.experience,
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 300,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,

      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("eresumemanagement") && (
            <Link to={`/resumemanagement/edit/${params.row.id}`}>
              <Button sx={userStyle.buttonedit}>
                <EditOutlinedIcon style={{ fontsize: "large" }} />
              </Button>
            </Link>
          )}
          {isUserRoleCompare?.includes("dresumemanagement") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id, params.row.name);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("eresumemanagement") && (
            <Link to={`/resumemanagement/view/${params.row.id}`}>
              <Button sx={userStyle.buttonedit}>
                <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
              </Button>
            </Link>
          )}
          {isUserRoleCompare?.includes("iresumemanagement") && (
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

  // Create a row data object for the DataGrid
  const rowDataTable = filteredDatas.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      fullname: item.fullname,
      overallstatus: item.overallstatus,
      role: item.role,
      city: item.city,
      mobile: item.mobile,
      email: item.email,
      dateofbirth: item.dateofbirth,
      qualification: item.otherqualification
        ? item.otherqualification
        : item.qualification,
      skill: item.skill,
      experience: `${item?.experience} ${
        item?.experienceestimation == undefined
          ? "Years"
          : item?.experienceestimation
      }`,
      category: item.categoryedu,
      subcategory: item.subcategoryedu,
      specialization: item.specialization,
      candidatestatus: item.candidatestatus,
      interviewrounds: item.interviewrounds,
    };
  });

  // Show All Columns functionality
  const handleShowAllColumns = () => {
    const updatedVisibility = { ...columnVisibility };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibility(updatedVisibility);
  };

  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  // Function to filter columns based on search query
  const filteredColumns = columnDataTable?.filter((column) =>
    column?.headerName
      ?.toLowerCase()
      ?.includes(searchQueryManage?.toLowerCase())
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
          {filteredColumns?.map((column) => (
            <ListItem key={column?.field}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={
                  <Switch
                    sx={{ marginTop: "-10px" }}
                    checked={columnVisibility[column?.field]}
                    onChange={() => toggleColumnVisibility(column?.field)}
                  />
                }
                secondary={column?.headerName}
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

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "ResumeManagement.png");
        });
      });
    }
  };

  return (
    <Box>
      <Headtitle title={"Resume Management"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Manage Resume Management"
        modulename="Human Resources"
        submodulename="Recruitment"
        mainpagename="Resume"
        subpagename="Resume Management"
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("lresumemanagement") && (
        <Box sx={userStyle.dialogbox}>
          <>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>Filter By</Typography>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <Typography>Role</Typography>
                <FormControl size="small" fullWidth>
                  <Selects
                    options={roleOptions}
                    styles={colourStyles}
                    value={{
                      label: candidateFilter.role,
                      value: candidateFilter.role,
                    }}
                    onChange={(e) =>
                      setCandidateFilter({
                        ...candidateFilter,
                        role: e.value,
                      })
                    }
                  />
                </FormControl>
              </Grid>
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

              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>Status</Typography>
                  {/* <Selects
                    options={status}
                    styles={colourStyles}
                    value={{
                      label: candidateFilter.status,
                      value: candidateFilter.status,
                    }}
                    onChange={(e) =>
                      setCandidateFilter({
                        ...candidateFilter,
                        status: e.value,
                      })
                    }
                  /> */}
                  <MultiSelect
                    size="small"
                    options={status}
                    value={selectedOptionsStatusAdd}
                    onChange={handleStatusChangeAdd}
                    valueRenderer={customValueRendererStatusAdd}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={2.5} xs={12} sm={6}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    handleFilter(e, "filter");
                  }}
                >
                  Filter
                </Button>
              </Grid>
              <Grid item md={2.5} xs={12} sm={6}>
                <Button
                  variant="contained"
                  onClick={(e) => {
                    handleFilter(e, "screening");
                  }}
                  color="primary"
                >
                  Make Screening
                </Button>
              </Grid>
              <Grid item md={2.5} xs={12} sm={6}>
                <Button
                  sx={userStyle.btncancel}
                  onClick={(e) => {
                    handleClear(e);
                  }}
                >
                  Clear
                </Button>
              </Grid>
            </Grid>
          </>
        </Box>
      )}
      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth={true}
          maxWidth="sm"
          sx={{
            overflow: "visible",
            "& .MuiPaper-root": {
              overflow: "visible",
            },
          }}
        ></Dialog>
      </Box>
      <br />
      {/* ****** Table Start ****** */}

      {isUserRoleCompare?.includes("lresumemanagement") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              {/* <Typography sx={userStyle.importheadtext}>Vendor List</Typography> */}
            </Grid>
            <Grid container spacing={2} style={userStyle.dataTablestyle}>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <label>Show entries:</label>
                  <Select
                    id="pageSizeSelect"
                    value={pageSize}
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
                  {isUserRoleCompare?.includes("excelresumemanagement") && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          // fetchProductionClientRateArray();
                          setFormat("xl");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileExcel />
                        &ensp;Export to Excel&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvresumemanagement") && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          // fetchProductionClientRateArray();
                          setFormat("csv");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileCsv />
                        &ensp;Export to CSV&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("printresumemanagement") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfresumemanagement") && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true);
                          // fetchProductionClientRateArray();
                        }}
                      >
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  <>
                    <Button
                      sx={userStyle.buttongrp}
                      onClick={handleCaptureImage}
                    >
                      {" "}
                      <ImageIcon
                        sx={{ fontSize: "15px" }}
                      /> &ensp;image&ensp;{" "}
                    </Button>
                  </>
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
            &ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
              Manage Columns
            </Button>
            <br />
            <br />
            <Box
              style={{
                width: "100%",
                overflowY: "hidden", // Hide the y-axis scrollbar
              }}
            >
              {!statusCheck ? (
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
                <>
                  <StyledDataGrid
                    ref={gridRef}
                    rows={rowDataTable}
                    columns={columnDataTable.filter(
                      (column) => columnVisibility[column.field]
                    )} // Only render visible columns
                    autoHeight={true}
                    density="compact"
                    hideFooter
                    className={dataGridStyles.root}
                  />
                </>
              )}
            </Box>
            <br />
            <Box>
              <Pagination
                page={page}
                pageSize={pageSize}
                totalPages={searchQuery !== "" ? 1 : totalPages}
                onPageChange={handlePageChange}
                pageItemLength={filteredDatas?.length}
                totalProjects={
                  searchQuery !== "" ? filteredDatas?.length : totalProjects
                }
              />
            </Box>
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

      {/* Print start */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table
          sx={{ minWidth: 700 }}
          aria-label="customized table"
          ref={componentRef}
        >
          <TableHead>
            <TableRow>
              <TableCell>SI.No</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Dateofbirth</TableCell>
              {/* <TableCell>Category</TableCell>
                            <TableCell>Sub Category</TableCell>
                            <TableCell>Specialization</TableCell> */}
              <TableCell>Skill</TableCell>
              <TableCell>Experience</TableCell>
            </TableRow>
          </TableHead>
          <TableBody align="left">
            {candidate &&
              candidate.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.overallstatus}</TableCell>
                  <TableCell>{row.fullname}</TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell>{row.city}</TableCell>
                  <TableCell>{row.mobile}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.dateofbirth}</TableCell>
                  <TableCell>{row?.skill?.join(",")}</TableCell>
                  <TableCell>{`${row?.experience} ${
                    row?.experienceestimation == undefined
                      ? "Years"
                      : row?.experienceestimation
                  }`}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Print End */}

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
            onClick={(e) => deleQueue(queueid)}
          >
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openInfo}
        onClose={handleCloseinfo}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
      >
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              Info Memory Management
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
                        {" "}
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
              <br />
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
            Export Searched Data
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
            Export Searched Data
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

export default Resumemanagement;
