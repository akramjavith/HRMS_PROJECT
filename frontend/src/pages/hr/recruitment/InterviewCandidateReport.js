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
  Container,
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { handleApiError } from "../../../components/Errorhandling";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useReactToPrint } from "react-to-print";
import moment from "moment-timezone";
import {
  UserRoleAccessContext,
  AuthContext,
} from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import PageHeading from "../../../components/PageHeading";
import { ThreeDots } from "react-loader-spinner";
import StyledDataGrid from "../../../components/TableStyle";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import ImageIcon from "@mui/icons-material/Image";
import { MultiSelect } from "react-multi-select-component";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import DoneIcon from "@mui/icons-material/Done";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import RefreshIcon from "@mui/icons-material/Refresh";
import SensorOccupiedIcon from "@mui/icons-material/SensorOccupied";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import BlockIcon from "@mui/icons-material/Block";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ListAltIcon from "@mui/icons-material/ListAlt";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";

function InterviewCandidatesReportPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const [filterDate, setFilterDate] = useState({
    fromdate: "",
    todate: "",
  });

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
        rowDataTable.map((item, index) => {
          return {
            "S.No": index + 1,
            "Current Round": item.roundname,
            "Round Status": item.roundstatus,
            "Round Result": item.roundanswerstatus,
            Status: item.overallstatus,
            "Final Status": item.finalstatus,
            "Applicant Name": item.fullname,
            "Contact Number": item.mobile,
            Email: item.email,
            Company: item.company,
            Branch: item.branch,
            Designation: item.designation,
          };
        }),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        items?.map((item, index) => ({
          "S.No": index + 1,
          "Current Round": item.recentroundname,
          "Round Status": item.recentroundstatus,
          "Round Result": item.roundanswerstatus,
          Status: item.overallstatus,
          "Final Status": item.finalstatus,
          "Applicant Name": item.fullname,
          "Contact Number": item.mobile,
          Email: item.email,
          Company: item.company,
          Branch: item.branch,
          Designation: item.designation,
        })),
        fileName
      );
    }
    setIsFilterOpen(false);
  };

  // pdf.....
  const columns = [
    { title: "Current Round", field: "roundname" },
    { title: "Round Status", field: "roundstatus" },
    { title: "Round Result", field: "roundanswerstatus" },
    { title: "Status", field: "overallstatus" },
    { title: "Final Status", field: "finalstatus" },
    { title: "Applicant Name", field: "fullname" },
    { title: "Contact Number", field: "mobile" },
    { title: "Email", field: "email" },
    { title: "Company", field: "company" },
    { title: "Branch", field: "branch" },
    { title: "Designation", field: "designation" },
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
        ? rowDataTable.map((item, index) => {
            return {
              serialNumber: index + 1,
              roundname: item.roundname,
              roundstatus: item.roundstatus,
              roundanswerstatus: item.roundanswerstatus,
              overallstatus: item.overallstatus,
              finalstatus: item.finalstatus,
              fullname: item.fullname,
              mobile: item.mobile,
              email: item.email,
              company: item.company,
              branch: item.branch,
              designation: item.designation,
            };
          })
        : items?.map((item, index) => ({
            serialNumber: index + 1,

            roundname: item.recentroundname,
            roundstatus: item.recentroundstatus,
            roundanswerstatus: item.roundanswerstatus,
            overallstatus: item.overallstatus,
            finalstatus: item.finalstatus,
            fullname: item.fullname,
            mobile: item.mobile,
            email: item.email,
            company: item.company,
            branch: item.branch,
            designation: item.designation,
          }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: "5" },
    });

    doc.save("Interview Candidates Report Page.pdf");
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [statusCheck, setStatusCheck] = useState(false);

  const [openview, setOpenview] = useState(false);
  // view model
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
  };

  const [multipleDatas, setMultipleDatas] = useState([]);

  const [isViewOpen, setIsViewOpen] = useState(false);

  const handleCloseViewpop = () => {
    setIsViewOpen(false);
  };

  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelection = (selection) => {
    setSelectedRows(selection.selectionModel);
  };

  const [companies, setCompanies] = useState([]);
  const [branches, setBranches] = useState([]);
  const [floors, setFloors] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [designation, setDesignation] = useState([]);

  const fetchDesignation = async () => {
    setPageName(!pageName);
    try {
      let res_category = await axios.get(SERVICE.DESIGNATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const categoryall = [
        ...res_category?.data?.designation.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];

      setDesignation(categoryall);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchCandidates = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.CANDIDATESALLBYRESTRICTION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let filteredData = Array.from(
        new Set(res?.data?.candidates?.map((data) => data.fullname))
      ).map((item) => ({ label: item, value: item }));
      setCandidates(filteredData);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [viewDatas, setViewDatas] = useState({});

  const getCandidateDetails = (datas) => {
    setViewDatas(datas);
  };

  // designation multiselect
  const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
  let [valueCompanyCat, setValueCompanyCat] = useState([]);

  const handleCompanyChange = async (options) => {
    setValueCompanyCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCompany(options);
    await fetchInterviewRounds(options);
  };

  const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
    return valueCompanyCat?.length ? (
      valueCompanyCat.map(({ label }) => label)?.join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>Choose Designation</span>
    );
  };

  const [selectedOptionsCandidates, setSelectedOptionsCandidates] = useState(
    []
  );

  //unit multiselect
  const handleCandidatesChange = (options) => {
    setSelectedOptionsCandidates(options);
  };

  const customValueRendererCandidates = (valueCandidates, _branches) => {
    return valueCandidates.length ? (
      valueCandidates.map(({ label }) => label)?.join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>Choose Candidates</span>
    );
  };

  //list
  const [selectedOptionsStatus, setSelectedOptionsStatus] = useState([]);
  let [valueStatus, setValueStatus] = useState("");

  //unit multiselect
  const handleStatusChange = (options) => {
    setValueStatus(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsStatus(options);
  };

  const customValueRendererStatus = (valueStatus, _branches) => {
    return valueStatus.length ? (
      valueStatus.map(({ label }) => label)?.join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>Choose Status</span>
    );
  };

  // company multiselect add
  const [selectedOptionsCompanyAdd, setSelectedOptionsCompanyAdd] = useState(
    []
  );
  // branch multiselect add
  const [selectedOptionsBranchAdd, setSelectedOptionsBranchAdd] = useState([]);
  //floors multiselcest add
  const [selectedOptionsUnitAdd, setSelectedOptionsUnitAdd] = useState([]);

  // company multi select
  const handleCompanyChangeAdd = (options) => {
    setSelectedOptionsCompanyAdd(options);
    fetchBranch(options);
    setSelectedOptionsBranchAdd([]);
    setSelectedOptionsUnitAdd([]);
    setSelectedOptionsCompany([]);
    setSelectedOptionsCandidates([]);
    setSelectedOptionsStatus([]);
    setRounds([]);
    if (options.length == 0) {
      setSelectedOptionsBranchAdd([]);
      setSelectedOptionsUnitAdd([]);
    }
  };

  const customValueRendererCompanyAdd = (valueCompanyAdd, _companies) => {
    return valueCompanyAdd.length ? (
      valueCompanyAdd.map(({ label }) => label)?.join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>Choose Company</span>
    );
  };

  // get all assignBranches
  const fetchBranch = (company) => {
    setPageName(!pageName);
    try {
      setBranches(
        isAssignBranch
          ?.filter((comp) =>
            company.map((data) => data.value).includes(comp.company)
          )
          ?.map((data) => ({
            label: data.branch,
            value: data.branch,
          }))
          .filter((item, index, self) => {
            return (
              self.findIndex(
                (i) => i.label === item.label && i.value === item.value
              ) === index
            );
          })
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchComapnies = async () => {
    setPageName(!pageName);
    try {
      setCompanies(
        isAssignBranch
          ?.map((data) => ({
            label: data.company,
            value: data.company,
          }))
          .filter((item, index, self) => {
            return (
              self.findIndex(
                (i) => i.label === item.label && i.value === item.value
              ) === index
            );
          })
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    fetchComapnies();
    fetchDesignation();
    fetchCandidates();
  }, []);

  const { isUserRoleCompare, isAssignBranch, pageName, setPageName } =
    useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // State for manage columns search query
  const [searchQueryManage, setSearchQueryManage] = useState("");

  const [candidate, setCandidate] = useState([]);
  const [candidateDuplicate, setCandidateDuplicate] = useState([]);
  const [candidateCopy, setCandidateCopy] = useState([]);
  const [candidateCopyNew, setCandidateCopyNew] = useState([]);
  const fetchAllCandidate = async () => {
    setPageName(!pageName);
    try {
      let resans = [];
      const [res, res1] = await Promise.all([
        axios.get(SERVICE.CANDIDATESALLBYRESTRICTION, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.get(SERVICE.ALLJOBOPENINGS, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
      ]);

      let jobopeningDatas = res1?.data?.jobopenings;

      let getAssignedCandidates = res?.data?.candidates
        .filter((data) => {
          return data.role && data.role != "All";
        })
        .map((item) => {
          let foundData = jobopeningDatas.find(
            (newItem) => newItem._id == item.jobopeningsid
          );
          if (foundData) {
            return {
              ...item,
              company: foundData.company,
              branch: foundData.branch,
              floor: foundData.floor,
              recruitmentname: foundData.recruitmentname,
              designation: foundData.designation,
              uniquename: `${foundData.company}_${foundData.branch}_${foundData.floor}_${foundData.recruitmentname}`,
              recentroundname:
                item?.interviewrounds[item?.interviewrounds?.length - 1]
                  ?.roundname,
              recentroundstatus:
                item?.interviewrounds[item?.interviewrounds?.length - 1]
                  ?.roundstatus,
              roundanswerstatus:
                item?.interviewrounds[item?.interviewrounds?.length - 1]
                  ?.roundanswerstatus,
            };
          } else {
            return {
              ...item,
              company: "",
              branch: "",
              floor: "",
              recruitmentname: "",
              uniquename: "",
              designation: "",
              recentroundname: "",
              recentroundstatus: "",
              roundanswerstatus: "",
            };
          }
        })
        .filter((data) => {
          return data.company !== "";
        });

      let showStatusList = getAssignedCandidates
        .filter((data) => {
          return data.recentroundstatus !== undefined;
        })
        .map((item) => ({
          label: item.recentroundstatus,
          value: item.recentroundstatus,
        }));

      let uniqueObjects = [];
      let uniqueArray = showStatusList.filter((obj) => {
        let isUnique = !uniqueObjects.some((uniqueObj) => {
          return Object.keys(uniqueObj).every(
            (key) => uniqueObj[key] === obj[key]
          );
        });

        if (isUnique) {
          uniqueObjects.push(obj);
          return true;
        }

        return false;
      });

      setStatusList(uniqueArray);

      // Iterate through relatedDatas and assign considerValue
      let considerValue = getAssignedCandidates?.map((item) => {
        if (item.candidatestatus !== undefined && item.candidatestatus !== "") {
          return { ...item, considerValue: item.candidatestatus };
        } else if (item.interviewrounds && item.interviewrounds.length === 0) {
          return { ...item, considerValue: item.overallstatus };
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
          } else {
            let status =
              item.interviewrounds[0].roundanswerstatus !== undefined &&
              item.interviewrounds[0].roundanswerstatus !== "";
            if (status) {
              const fieldToCheck = "roundanswerstatus";
              const foundObject = item.interviewrounds.find(
                (obj) =>
                  obj[fieldToCheck] !== undefined && obj[fieldToCheck] !== ""
              );
              return { ...item, considerValue: foundObject.roundanswerstatus };
            } else {
              return { ...item, considerValue: "" };
            }
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
          } else {
            let status = item.interviewrounds.some(
              (item1) =>
                item1.roundanswerstatus !== undefined &&
                item1.roundanswerstatus !== ""
            );
            if (status) {
              const fieldToCheck = "roundanswerstatus";
              const reversedInterviewRounds = item.interviewrounds
                .slice()
                .reverse();
              const foundObject = reversedInterviewRounds.find(
                (obj) =>
                  obj[fieldToCheck] !== undefined && obj[fieldToCheck] !== ""
              );
              return { ...item, considerValue: foundObject.roundanswerstatus };
            } else {
              return { ...item, considerValue: "" };
            }
          }
        }
      });

      let finalOutput = getAssignedCandidates?.map((data) => {
        let foundDataNew = considerValue.find((item) => item._id == data._id);
        if (foundDataNew) {
          return {
            ...data,
            consolidatedvalue: foundDataNew.considerValue,
          };
        } else {
          return {
            ...data,
            consolidatedvalue: "",
          };
        }
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

      const finaldata = finalOutput.filter((data, index) => {
        accessbranch.forEach((d, i) => {
          if (d.company === data.company && d.branch === data.branch) {
            resans.push(data);
          }
        });
      });
      setCandidate(resans);
      setCandidateCopy(resans);
      setCandidateCopyNew(resans);

      setStatusCheck(true);
    } catch (err) {
      setStatusCheck(true);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  useEffect(() => {
    fetchAllCandidate();
  }, []);

  const handlePush = () => {
    setCandidate(candidateDuplicate);
    handleCloseViewpop();
  };

  // branch multi select
  const handleBranchChangeAdd = (options) => {
    setSelectedOptionsBranchAdd(options);
    fetchFloor(options);
    setSelectedOptionsUnitAdd([]);
    if (options.length == 0) {
      setSelectedOptionsUnitAdd([]);
    }
  };

  const customValueRendererBranchAdd = (valueBranchAdd, _branches) => {
    return valueBranchAdd.length ? (
      valueBranchAdd.map(({ label }) => label)?.join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>Choose Branch</span>
    );
  };

  //for fetching floors
  const fetchFloor = async (branch) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.FLOOR, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let arr = [];
      res?.data?.floors.map((t) => {
        branch.forEach((d) => {
          if (d.value == t.branch) {
            arr.push(t.name);
          }
        });
      });
      setFloors(
        arr.map((t) => ({
          label: t,
          value: t,
        }))
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //for fetching floors
  const fetchInterviewRounds = async (options) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.INTERVIEWROUNDORDER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let datas = res?.data?.interviewroundorders;

      let optionArray = options.map((item) => item.value);

      let filteredData = Array.from(
        new Set(
          datas
            .filter((data) => {
              return optionArray.includes(data.designation);
            })
            .map((item) => item.round)
            .flat()
        )
      ).map((itemNew) => ({ label: itemNew, value: itemNew }));

      setRounds(filteredData);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [checked, setChecked] = useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
    setSelectedOptionsStatus([]);
  };

  //unit multiselect
  const handleUnitChangeAdd = (options) => {
    setSelectedOptionsUnitAdd(options);
  };

  const customValueRendererUnitAdd = (valueUnitAdd, _branches) => {
    return valueUnitAdd.length ? (
      valueUnitAdd.map(({ label }) => label)?.join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>Choose Rounds</span>
    );
  };

  const handleFilter = async (e, from) => {
    e.preventDefault();

    if (selectedOptionsCompanyAdd.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Company!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (filterDate.fromdate && !filterDate.todate) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Choose To Date!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      let comps = selectedOptionsCompanyAdd.map((item) => item.value);
      comps = comps.length == 0 ? "" : comps;
      let branchs = selectedOptionsBranchAdd.map((item) => item.value);
      branchs = branchs.length == 0 ? "" : branchs;
      let desigs = selectedOptionsCompany.map((item) => item.value);
      desigs = desigs.length == 0 ? "" : desigs;
      let rounds = selectedOptionsUnitAdd.map((item) => item.value);
      rounds = rounds.length == 0 ? "" : rounds;
      let cands = selectedOptionsCandidates.map((item) =>
        item.value.toLowerCase().replace(" ", "")
      );
      cands = cands.length == 0 ? "" : cands;
      let stats = selectedOptionsStatus.map((item) => {
        if (item.value == "Hired") {
          return "added";
        } else {
          return item.value.toLowerCase().replace(" ", "");
        }
      });
      stats = stats.length == 0 ? "" : stats;

      setStatusCheck(false);
      setPageName(!pageName);
      try {
        if (
          comps.length !== 0 ||
          branchs.length !== 0 ||
          desigs.length !== 0 ||
          rounds.length !== 0 ||
          cands.length !== 0 ||
          stats.length !== 0
        ) {
          let resans = [];
          let filteredData = candidateCopyNew.filter((entry) => {
            const companyMatch = !comps || comps.includes(entry.company); // Check if company is included in the filter or if no company filter is applied
            const branchMatch = !branchs || branchs.includes(entry.branch);
            const desigsMatch = !desigs || desigs.includes(entry.designation);

            const roundsMatch =
              !rounds || rounds.includes(entry.recentroundname);
            let statusMatch;
            if (checked) {
              statusMatch =
                !stats ||
                stats.includes(
                  entry?.finalstatus?.toLowerCase().replace(" ", "")
                );
            } else {
              statusMatch =
                !stats ||
                stats.includes(
                  entry?.consolidatedvalue?.toLowerCase().replace(" ", "")
                );
            }
            const candsMatch =
              !cands ||
              cands.includes(entry.fullname.toLowerCase().replace(" ", ""));
            return (
              companyMatch &&
              branchMatch &&
              desigsMatch &&
              roundsMatch &&
              candsMatch &&
              statusMatch
            );
          });

          if (filterDate?.fromdate && filterDate?.todate) {
            const fromDate = new Date(filterDate?.fromdate);
            const toDate = new Date(filterDate?.todate);

            // const filteredDataLast = filteredData.filter((item) => {
            //   let relevantDate;
            //   if (item.interviewrounds.length === 0) {
            //     relevantDate = new Date(item.createdAt);
            //   } else {
            //     relevantDate = new Date(
            //       item.interviewrounds[
            //         item.interviewrounds.length - 1
            //       ].roundCreatedAt
            //     );
            //   }

            //   return relevantDate >= fromDate && relevantDate <= toDate;
            // });

            const filteredDataLast = filteredData.flatMap((item) => {
              if (item.interviewrounds.length === 0) {
                return [
                  {
                    ...item,
                    relevantDate: new Date(item.createdAt),
                  },
                ];
              } else {
                return item.interviewrounds.map((round) => ({
                  ...item,
                  ...round,
                  recentroundname: round?.roundname,
                  recentroundstatus: round?.roundstatus,
                  roundanswerstatus: round?.roundanswerstatus,
                  consolidatedvalue: round?.roundanswerstatus,
                  relevantDate: new Date(round.roundCreatedAt),
                }));
              }
            });

            const filteredDatafinal = filteredDataLast.filter(
              (item) =>
                item.relevantDate >= fromDate && item.relevantDate <= toDate
            );
            const accessbranch = isAssignBranch
              ?.map((data) => ({
                branch: data.branch,
                company: data.company,
              }))
              .filter((item, index, self) => {
                return (
                  index ===
                  self.findIndex(
                    (i) =>
                      i.branch === item.branch && i.company === item.company
                  )
                );
              });

            const finaldata = filteredDatafinal.filter((data, index) => {
              accessbranch.forEach((d, i) => {
                if (d.company === data.company && d.branch === data.branch) {
                  resans.push(data);
                }
              });
            });
            setCandidate(resans);
          } else {
            let resans = [];
            const accessbranch = isAssignBranch
              ?.map((data) => ({
                branch: data.branch,
                company: data.company,
              }))
              .filter((item, index, self) => {
                return (
                  index ===
                  self.findIndex(
                    (i) =>
                      i.branch === item.branch && i.company === item.company
                  )
                );
              });

            const finaldata = filteredData.filter((data, index) => {
              accessbranch.forEach((d, i) => {
                if (d.company === data.company && d.branch === data.branch) {
                  resans.push(data);
                }
              });
            });
            setCandidate(filteredData);
          }

          setStatusCheck(true);
        } else {
          let resans = [];
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

          const finaldata = candidateCopyNew.filter((data, index) => {
            accessbranch.forEach((d, i) => {
              if (d.company === data.company && d.branch === data.branch) {
                resans.push(data);
              }
            });
          });
          setCandidate(resans);
          setStatusCheck(true);
        }

        setStatusCheck(true);
      } catch (err) {
        setStatusCheck(true);
        handleApiError(err, setShowAlert, handleClickOpenerr);
      }
    }
  };

  const [deletequeue, setDeleteQueue] = useState({});

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
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showAlertpop, setShowAlertpop] = useState();

  const handleCloseerrpop = () => {
    setIsErrorOpenpop(false);
  };

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
    adharnumber: true,
    actions: true,
    company: true,
    branch: true,
    designation: true,
    roundname: true,
    roundstatus: true,
    overallstatus: true,
    finalstatus: true,
    roundanswerstatus: true,
    // subcategory: true,
    // specialization: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  const handleClear = async () => {
    setSelectedOptionsCompanyAdd([]);
    setSelectedOptionsBranchAdd([]);
    setSelectedOptionsUnitAdd([]);
    setSelectedOptionsCompany([]);
    setSelectedOptionsCandidates([]);
    setSelectedOptionsStatus([]);
    setRounds([]);

    setFloors([]);
    setBranches([]);
    setChecked(false);

    setCandidate(candidateCopy);
    setFilterDate({
      fromdate: "",
      todate: "",
    });

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

  const [roleName, setRoleName] = useState({});

  //Edit model...
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  let updateby = roleName.updatedby;
  let addedby = roleName.addedby;

  // Excel
  const fileName = "Interview Candidates Report Page";

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
    { label: " Duplicate Candidate", value: " Duplicate Candidate" },
  ];
  let finalStatusList = [
    { label: "Hired", value: "Hired" },
    { label: "Rejected", value: "Rejected" },
    { label: "Hold", value: "Hold" },
  ];

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Interview Candidates Report Page",
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
  //table sorting

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
  const filteredDatas = items?.filter((item) => {
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
    firstVisiblePage + visiblePages - 1,
    totalPages
  );

  const pageNumbers = [];

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

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
      field: "roundname",
      headerName: "Current Round",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.roundname,
      renderCell: (params) =>
        params.value !== "" && params.value !== undefined ? (
          <div
            style={{
              color: "#000",
              background: "#9fd9e0",
              border: "1px solid #000",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "15rem",
            }}
          >
            <span style={{ verticalAlign: "middle" }}>{params.value}</span>
          </div>
        ) : null,
    },
    {
      field: "roundstatus",
      headerName: "Round Status",
      flex: 0,
      width: 200,
      minHeight: "40px",
      hide: !columnVisibility.roundstatus,

      renderCell: (params) =>
        params.value == "Interview Scheduled" ? (
          <div
            style={{
              color: "#000",
              border: "1px solid #000",
              background: "#FFEC9E",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "15rem",
            }}
          >
            <span style={{ verticalAlign: "middle" }}>{params.value}</span>
          </div>
        ) : params.value == "On Progress" ? (
          <div
            style={{
              color: "#000",
              border: "1px solid #000",
              background: "#FFBB70",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "15rem",
            }}
          >
            <span style={{ verticalAlign: "middle" }}>{params.value}</span>
          </div>
        ) : params.value == "Completed" ? (
          <div
            style={{
              color: "#000",
              border: "1px solid #000",
              background: "#B5C18E",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "15rem",
            }}
          >
            <span style={{ verticalAlign: "middle" }}>{params.value}</span>
          </div>
        ) : (
          <div
            style={{ color: "#b3b7bc", fontWeight: "normal", width: "15rem" }}
          >
            {params.value}
          </div>
        ),
    },
    {
      field: "roundanswerstatus",
      headerName: "Round Result",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.roundanswerstatus,

      renderCell: (params) =>
        params.value == "Selected" ? (
          <div
            style={{
              color: "#4F6F52",
              border: "1px solid #159646",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "8rem",
            }}
          >
            <span style={{ verticalAlign: "middle" }}>{params.value}</span>
          </div>
        ) : params.value == "Rejected" ? (
          <div
            style={{
              color: "#dd060a",
              border: "1px solid #dd060a",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "8rem",
            }}
          >
            <span style={{ verticalAlign: "middle" }}>{params.value}</span>
          </div>
        ) : params.value == "On Hold" ? (
          <div
            style={{
              color: "#f7860e",
              border: "1px solid #f7860e",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "8rem",
            }}
          >
            <span style={{ verticalAlign: "middle" }}>{params.value}</span>
          </div>
        ) : (
          <div
            style={{ color: "#b3b7bc", fontWeight: "normal", width: "8rem" }}
          >
            {params.value}
          </div>
        ),
    },
    {
      field: "overallstatus",
      headerName: "Status",
      flex: 0,
      width: 220,
      minHeight: "40px",
      hide: !columnVisibility.overallstatus,

      renderCell: (params) =>
        params.value == "Selected" ? (
          <div
            style={{
              color: "#159646",
              border: "1px solid #159646",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "15rem",
            }}
          >
            <DoneIcon style={{ marginRight: "5px", verticalAlign: "middle" }} />
            <span style={{ verticalAlign: "middle" }}>{params.value}</span>
          </div>
        ) : params.value == "Rejected" ? (
          <div
            style={{
              color: "#dd060a",
              border: "1px solid #dd060a",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "15rem",
            }}
          >
            <ThumbDownOffAltIcon
              style={{ marginRight: "5px", verticalAlign: "middle" }}
            />
            <span style={{ verticalAlign: "middle" }}>{params.value}</span>
          </div>
        ) : params.value == "On Hold" ? (
          <div
            style={{
              color: "#f7860e",
              border: "1px solid #f7860e",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "15rem",
            }}
          >
            <RefreshIcon
              style={{ marginRight: "5px", verticalAlign: "middle" }}
            />
            <span style={{ verticalAlign: "middle" }}>{params.value}</span>
          </div>
        ) : params.value == "No Response" ? (
          <div
            style={{
              color: "#898c8a",
              border: "1px solid #898c8a",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "15rem",
            }}
          >
            <SensorOccupiedIcon
              style={{ marginRight: "5px", verticalAlign: "middle" }}
            />
            <span style={{ verticalAlign: "middle" }}>{params.value}</span>
          </div>
        ) : params.value == "First No Response" ? (
          <div
            style={{
              color: "#898c8a",
              border: "1px solid #898c8a",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "15rem",
            }}
          >
            <SensorOccupiedIcon
              style={{ marginRight: "5px", verticalAlign: "middle" }}
            />
            <span style={{ verticalAlign: "middle" }}>{params.value}</span>
          </div>
        ) : params.value == "Second No Response" ? (
          <div
            style={{
              color: "#898c8a",
              border: "1px solid #898c8a",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "15rem",
            }}
          >
            <SensorOccupiedIcon
              style={{ marginRight: "5px", verticalAlign: "middle" }}
            />
            <span style={{ verticalAlign: "middle" }}>{params.value}</span>
          </div>
        ) : params.value == "Applied" ? (
          <div
            style={{
              color: "#40A2E3",
              border: "1px solid #40A2E3",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "15rem",
            }}
          >
            <AssignmentIndIcon
              style={{ marginRight: "5px", verticalAlign: "middle" }}
            />
            <span style={{ verticalAlign: "middle" }}>{params.value}</span>
          </div>
        ) : params.value == "Not Interested" ? (
          <div
            style={{
              color: "#E72929",
              border: "1px solid #E72929",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "15rem",
            }}
          >
            <BlockIcon
              style={{ marginRight: "5px", verticalAlign: "middle" }}
            />
            <span style={{ verticalAlign: "middle" }}>{params.value}</span>
          </div>
        ) : params.value == "Got Other Job" ? (
          <div
            style={{
              color: "#E72929",
              border: "1px solid #E72929",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "15rem",
            }}
          >
            <BlockIcon
              style={{ marginRight: "5px", verticalAlign: "middle" }}
            />
            <span style={{ verticalAlign: "middle" }}>{params.value}</span>
          </div>
        ) : params.value == "Screened" ? (
          <div
            style={{
              color: "#10439F",
              border: "1px solid #10439F",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "15rem",
            }}
          >
            <FullscreenIcon
              style={{ marginRight: "5px", verticalAlign: "middle" }}
            />
            <span style={{ verticalAlign: "middle" }}>{params.value}</span>
          </div>
        ) : params.value == "Duplicate Candidate" ? (
          <div
            style={{
              color: "#003C43 ",
              border: "1px solid #003C43",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "15rem",
            }}
          >
            <ContentCopyIcon
              style={{ marginRight: "5px", verticalAlign: "middle" }}
            />
            <span style={{ verticalAlign: "middle" }}>{params.value}</span>
          </div>
        ) : params.value !== "" ? (
          <div
            style={{
              color: "#BED1CF",
              fontWeight: "normal",
              border: "1px solid #BED1CF",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "15rem",
            }}
          >
            {params.value}
          </div>
        ) : (
          <></>
        ),
    },
    {
      field: "finalstatus",
      headerName: "Final Status",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.finalstatus,
      renderCell: (params) =>
        params.value == "Hired" ? (
          <div
            style={{
              color: "#159646",
              border: "1px solid #159646",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "10rem",
            }}
          >
            <DoneIcon style={{ marginRight: "5px", verticalAlign: "middle" }} />
            <span style={{ verticalAlign: "middle" }}>{params.value}</span>
          </div>
        ) : params.value == "Rejected" ? (
          <div
            style={{
              color: "#dd060a",
              border: "1px solid #dd060a",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "10rem",
            }}
          >
            <ThumbDownOffAltIcon
              style={{ marginRight: "5px", verticalAlign: "middle" }}
            />
            <span style={{ verticalAlign: "middle" }}>{params.value}</span>
          </div>
        ) : params.value == "Hold" ? (
          <div
            style={{
              color: "#f7860e",
              border: "1px solid #f7860e",
              padding: "2px 20px",
              borderRadius: "20px",
              width: "10rem",
            }}
          >
            <RefreshIcon
              style={{ marginRight: "5px", verticalAlign: "middle" }}
            />
            <span style={{ verticalAlign: "middle" }}>{params.value}</span>
          </div>
        ) : (
          <div
            style={{ color: "#b3b7bc", fontWeight: "normal", width: "10rem" }}
          >
            {params.value}
          </div>
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
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.company,
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.branch,
    },
    {
      field: "designation",
      headerName: "Designation",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.designation,
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
          {params?.row?.roundname !== undefined &&
          params?.row?.roundname !== "" &&
          (params?.row?.finalstatus === undefined ||
            params?.row?.finalstatus == "Hold") ? (
            <>
              <Button
                sx={userStyle.buttonedit}
                onClick={() => {
                  getCandidateDetails(params.row);

                  window.open(
                    `/interviewrounds/${params.row.jobopeningsid}`,
                    "_blank"
                  );
                }}
              >
                <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
              </Button>
            </>
          ) : params?.row?.roundname !== undefined &&
            params?.row?.roundname !== "" &&
            params?.row?.finalstatus !== undefined &&
            params?.row?.finalstatus != "Hold" &&
            params?.row?.finalstatus != "" ? (
            <>
              <Button
                sx={userStyle.buttonedit}
                onClick={() => {
                  getCandidateDetails(params.row);

                  window.open(
                    `/company/recuritment/${params.row.jobopeningsid}`,
                    "_blank"
                  );
                }}
              >
                <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
              </Button>
            </>
          ) : params?.row?.roundname !== undefined &&
            params?.row?.roundname !== "" ? (
            <>
              <Button
                sx={userStyle.buttonedit}
                onClick={() => {
                  getCandidateDetails(params.row);

                  window.open(
                    `/interviewrounds/${params.row.jobopeningsid}`,
                    "_blank"
                  );
                }}
              >
                <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
              </Button>
            </>
          ) : (
            <>
              <Button
                sx={userStyle.buttonedit}
                onClick={() => {
                  getCandidateDetails(params.row);

                  window.open(
                    `/company/recuritment/${params.row.jobopeningsid}`,
                    "_blank"
                  );
                }}
              >
                <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
              </Button>
            </>
          )}
          <>
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpenview();
                getCandidateDetails(params.row);
              }}
            >
              <ListAltIcon style={{ fontsize: "large" }} />
            </Button>
          </>
        </Grid>
      ),
    },
  ];

  // Create a row data object for the DataGrid
  const rowDataTable = filteredData.map((item, index) => {
    const correctedArray = Array.isArray(item?.skill)
      ? item.skill.map((d) => (Array.isArray(d) ? d.join(",") : d))
      : [];
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      fullname: item.fullname,
      mobile: item.mobile,
      designation: item.designation,
      email: item.email,
      jobopeningsid: item.jobopeningsid,
      dateofbirth: item.dateofbirth,
      roundname: item.recentroundname,
      roundstatus: item.recentroundstatus,
      roundanswerstatus: item.roundanswerstatus,
      finalstatus: !item.finalstatus
        ? ""
        : item.finalstatus == "Added"
        ? "Hired"
        : item.finalstatus,
      screencandidate: item.screencandidate,
      qualification: item?.educationdetails
        ?.map(
          (t, i) =>
            `${i + 1 + ". "}` +
            `${t.categoryedu} - ${t.subcategoryedu} - ${t.specialization}`
        )
        .toString(),
      skill: correctedArray,
      experience: item.experience,
      status: item.status,
      tablename: item?.tablename,
      candidatestatus: item?.candidatestatus,
      prefix: item?.prefix,
      gender: item?.gender,
      adharnumber: item?.adharnumber,
      interviewrounds: item?.interviewrounds,
      overallstatus: item?.consolidatedvalue,
      company: item?.company,
      branch: item?.branch,
    };
  });

  const columnsDuplicate = [
    { field: "fullname", headerName: "Applicant name", width: 200 },
    { field: "company", headerName: "Company", width: 200 },
    { field: "branch", headerName: "Branch", width: 200 },
    { field: "mobile", headerName: "Mobile", width: 200 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "dateofbirth", headerName: "DOB", width: 200 },
    { field: "designation", headerName: "Designation", width: 200 },
  ];

  const rowsDuplicate = multipleDatas.map((data, index) => ({
    id: data._id,
    fullname: data.fullname,
    company: data.company,
    branch: data.branch,
    mobile: data.mobile,
    designation: data.designation,
    email: data.email,
    dateofbirth: data.dateofbirth,
  }));

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
          saveAs(blob, "Interview Candidates Report Page.png");
        });
      });
    }
  };

  return (
    <Box>
      <Headtitle title={"INTERVIEW CANDIDATES REPORT PAGE"} />
      {/* ****** Header Content ****** */}

      <PageHeading
        title="Manage Interview Candidates Report Page"
        modulename="Human Resources"
        submodulename="Recruitment"
        mainpagename="Interview/Candidates Report Page"
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("linterview/candidatesreportpage") && (
        <Box sx={userStyle.dialogbox}>
          <>
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12} lg={3}>
                <FormControl fullWidth size="small">
                  <Typography>
                    {" "}
                    Company <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <MultiSelect
                    size="small"
                    options={companies}
                    value={selectedOptionsCompanyAdd}
                    onChange={handleCompanyChangeAdd}
                    valueRenderer={customValueRendererCompanyAdd}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12} lg={3}>
                <FormControl fullWidth size="small">
                  <Typography> Branch</Typography>
                  <MultiSelect
                    size="small"
                    options={branches}
                    value={selectedOptionsBranchAdd}
                    onChange={handleBranchChangeAdd}
                    valueRenderer={customValueRendererBranchAdd}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>Designation</Typography>
                  <MultiSelect
                    size="small"
                    options={designation}
                    value={selectedOptionsCompany}
                    onChange={(e) => {
                      handleCompanyChange(e);
                    }}
                    valueRenderer={customValueRendererCompany}
                    // labelledBy="Please Select Designation"
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12} lg={3}>
                <FormControl fullWidth size="small">
                  <Typography> Rounds</Typography>
                  <MultiSelect
                    size="small"
                    options={rounds}
                    value={selectedOptionsUnitAdd}
                    onChange={handleUnitChangeAdd}
                    valueRenderer={customValueRendererUnitAdd}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12} lg={3}>
                <FormControl fullWidth size="small">
                  <Typography> Candidates</Typography>
                  <MultiSelect
                    size="small"
                    options={candidates}
                    value={selectedOptionsCandidates}
                    onChange={handleCandidatesChange}
                    valueRenderer={customValueRendererCandidates}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12} lg={3}>
                <FormControl fullWidth size="small">
                  <Typography>
                    {" "}
                    {checked ? "Final Status" : "Status"}
                  </Typography>
                  <MultiSelect
                    size="small"
                    options={checked ? finalStatusList : defaultStatus}
                    value={selectedOptionsStatus}
                    onChange={handleStatusChange}
                    valueRenderer={customValueRendererStatus}
                  />
                </FormControl>
                <FormControlLabel
                  control={
                    <Checkbox checked={checked} onChange={handleChange} />
                  }
                  label="For Final Status"
                />
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography> From Date</Typography>
                  <OutlinedInput
                    id="from-date"
                    type="date"
                    value={filterDate.fromdate}
                    onChange={(e) => {
                      setFilterDate({
                        ...filterDate,
                        fromdate: e.target.value,
                        todate: "",
                      });
                      document.getElementById("to-date").min = e.target.value;
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    To Date{" "}
                    {filterDate.fromdate && <b style={{ color: "red" }}>*</b>}
                  </Typography>
                  <OutlinedInput
                    id="to-date"
                    type="date"
                    value={filterDate.todate}
                    onChange={(e) => {
                      setFilterDate({
                        ...filterDate,
                        todate: e.target.value,
                      });
                    }}
                    min={filterDate.fromdate}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}></Grid>
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
                <Button sx={userStyle.btncancel} onClick={handleClear}>
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

      {isUserRoleCompare?.includes("linterview/candidatesreportpage") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Interview Candidate Report Page List
              </Typography>
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
                    <MenuItem value={candidate.length}>All</MenuItem>
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
                    "excelinterview/candidatesreportpage"
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
                  {isUserRoleCompare?.includes(
                    "csvinterview/candidatesreportpage"
                  ) && (
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
                  {isUserRoleCompare?.includes(
                    "printinterview/candidatesreportpage"
                  ) && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes(
                    "pdfinterview/candidatesreportpage"
                  ) && (
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

              <TableCell>Current Round</TableCell>
              <TableCell>Round Status</TableCell>
              <TableCell>Round Result</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Final Status</TableCell>
              <TableCell>Applicant Name</TableCell>
              <TableCell>Contact Number</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Designation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody align="left">
            {rowDataTable &&
              rowDataTable.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.roundname}</TableCell>
                  <TableCell>{row.roundstatus}</TableCell>
                  <TableCell>{row.roundanswerstatus}</TableCell>
                  <TableCell>{row.overallstatus}</TableCell>
                  <TableCell>{row.finalstatus}</TableCell>
                  <TableCell>{row.fullname}</TableCell>
                  <TableCell>{row.mobile}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.company}</TableCell>
                  <TableCell>{row.branch}</TableCell>
                  <TableCell>{row.designation}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Print End */}

      {/* ALERT DIALOG */}
      <Box>
        <Dialog
          open={isErrorOpenpop}
          onClose={handleCloseerrpop}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            <Typography variant="h6">{showAlertpop}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              style={{
                padding: "7px 13px",
                color: "white",
                background: "rgb(25, 118, 210)",
              }}
              onClick={() => {
                handleCloseerrpop();
              }}
            >
              ok
            </Button>
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
              onClick={handleCloseerrpop}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
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
      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleCloseview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Candidate Details
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                {viewDatas?.interviewrounds?.map((log, index) => (
                  <Accordion key={index}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                    >
                      {log?.roundname}
                    </AccordionSummary>
                    <AccordionDetails>
                      {(log?.mode == "Online or Interview Test" ||
                        log?.mode == "Questions") && (
                        <>
                          <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">Test Name</Typography>
                                <Typography>
                                  {log?.testname ? log.testname : ""}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Total Marks
                                </Typography>
                                <Typography>
                                  {log?.totalmarks ? log.totalmarks : ""}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Eligible Marks
                                </Typography>
                                <Typography>
                                  {log?.eligiblemarks ? log.eligiblemarks : ""}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">Created On</Typography>
                                <Typography>
                                  {moment(log?.roundCreatedAt)?.format(
                                    "DD-MM-YYYY HH:mm:ss A"
                                  )}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Test Completed At
                                </Typography>
                                <Typography>
                                  {moment(log?.testcompletedat)?.format(
                                    "DD-MM-YYYY HH:mm:ss A"
                                  )}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Question Type
                                </Typography>
                                <Typography>{log?.questiontype}</Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Question Count
                                </Typography>
                                <Typography>{log?.questioncount}</Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Reporting Date
                                </Typography>
                                <Typography>
                                  {moment(log?.date)?.format("DD-MM-YYYY")}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Reporting Time
                                </Typography>
                                <Typography>
                                  {log?.time
                                    ? moment(log.time, "HH:mm").format(
                                        "hh:mm:ss A"
                                      )
                                    : "Invalid date"}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Deadline Date
                                </Typography>
                                <Typography>
                                  {moment(log?.deadlinedate)?.format(
                                    "DD-MM-YYYY"
                                  )}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Deadline Time
                                </Typography>
                                <Typography>
                                  {log?.deadlinetime
                                    ? moment(log.deadlinetime, "HH:mm").format(
                                        "hh:mm:ss A"
                                      )
                                    : "Invalid date"}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">Duration</Typography>
                                <Typography>
                                  {log?.duration ? log.duration : ""}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Round Status
                                </Typography>
                                <Typography>
                                  {log?.roundstatus ? log.roundstatus : ""}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Round Result
                                </Typography>
                                <Typography>
                                  {log?.roundanswerstatus
                                    ? log.roundanswerstatus
                                    : ""}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Interviewer
                                </Typography>
                                <Typography>
                                  {log?.interviewer
                                    ? log?.interviewer?.join(",")
                                    : ""}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={12} xs={12} sm={12}>
                              <Typography variant="h6">
                                Question And Answers
                              </Typography>
                              <Container>
                                <Box mt={2}>
                                  {log?.interviewFormLog?.map((qa, index) => (
                                    <Paper
                                      key={index}
                                      elevation={3}
                                      style={{ marginBottom: "1rem" }}
                                    >
                                      {qa.map((item, indexNew) => (
                                        <>
                                          <Accordion>
                                            <AccordionSummary
                                              expandIcon={<ExpandMoreIcon />}
                                              aria-controls={`panel${indexNew}-content`}
                                              id={`panel${indexNew}-header`}
                                            >
                                              <Typography variant="h6">{`Question.${
                                                indexNew + 1
                                              }`}</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                              <Grid
                                                item
                                                md={12}
                                                xs={12}
                                                sm={12}
                                              >
                                                <FormControl
                                                  fullWidth
                                                  size="small"
                                                >
                                                  <Typography variant="h6">
                                                    {" "}
                                                    Question
                                                  </Typography>
                                                  <Typography>
                                                    {item?.question
                                                      ? item.question
                                                      : ""}
                                                  </Typography>
                                                </FormControl>
                                              </Grid>
                                              <Grid item md={6} xs={12} sm={12}>
                                                <FormControl
                                                  fullWidth
                                                  size="small"
                                                >
                                                  <Typography variant="h6">
                                                    User Answer
                                                  </Typography>
                                                  <Typography>
                                                    {item?.userans
                                                      ? item?.userans?.join(",")
                                                      : ""}
                                                  </Typography>
                                                </FormControl>
                                              </Grid>

                                              <Grid item md={6} xs={12} sm={12}>
                                                <FormControl
                                                  fullWidth
                                                  size="small"
                                                >
                                                  <Typography variant="h6">
                                                    {" "}
                                                    Type
                                                  </Typography>
                                                  <Typography>
                                                    {item?.type
                                                      ? item.type
                                                      : ""}
                                                  </Typography>
                                                </FormControl>
                                              </Grid>
                                            </AccordionDetails>
                                          </Accordion>
                                          <Container>
                                            <Box mt={2}>
                                              {item?.secondarytodo?.length >
                                                0 &&
                                                item?.secondarytodo?.map(
                                                  (qa, index) => (
                                                    <Paper
                                                      key={index}
                                                      elevation={3}
                                                      style={{
                                                        marginBottom: "1rem",
                                                      }}
                                                    >
                                                      <Typography>
                                                        Sub Questions
                                                      </Typography>
                                                      <>
                                                        <Accordion>
                                                          <AccordionSummary
                                                            expandIcon={
                                                              <ExpandMoreIcon />
                                                            }
                                                            aria-controls={`panel${index}-content`}
                                                            id={`panel${index}-header`}
                                                          >
                                                            <Typography variant="h6">{`Question.${
                                                              index + 1
                                                            }`}</Typography>
                                                          </AccordionSummary>
                                                          <AccordionDetails>
                                                            <Grid
                                                              item
                                                              md={12}
                                                              xs={12}
                                                              sm={12}
                                                            >
                                                              <FormControl
                                                                fullWidth
                                                                size="small"
                                                              >
                                                                <Typography variant="h6">
                                                                  {" "}
                                                                  Question
                                                                </Typography>
                                                                <Typography>
                                                                  {qa?.question
                                                                    ? qa.question
                                                                    : ""}
                                                                </Typography>
                                                              </FormControl>
                                                            </Grid>
                                                            <Grid
                                                              item
                                                              md={6}
                                                              xs={12}
                                                              sm={12}
                                                            >
                                                              <FormControl
                                                                fullWidth
                                                                size="small"
                                                              >
                                                                <Typography variant="h6">
                                                                  User Answer
                                                                </Typography>
                                                                <Typography>
                                                                  {qa?.userans
                                                                    ? qa?.userans?.join(
                                                                        ","
                                                                      )
                                                                    : ""}
                                                                </Typography>
                                                              </FormControl>
                                                            </Grid>
                                                            <Grid
                                                              item
                                                              md={6}
                                                              xs={12}
                                                              sm={12}
                                                            >
                                                              <FormControl
                                                                fullWidth
                                                                size="small"
                                                              >
                                                                <Typography variant="h6">
                                                                  {" "}
                                                                  Type
                                                                </Typography>
                                                                <Typography>
                                                                  {qa?.type
                                                                    ? qa.type
                                                                    : ""}
                                                                </Typography>
                                                              </FormControl>
                                                            </Grid>
                                                          </AccordionDetails>
                                                        </Accordion>
                                                      </>
                                                    </Paper>
                                                  )
                                                )}
                                            </Box>
                                          </Container>
                                        </>
                                      ))}
                                    </Paper>
                                  ))}
                                </Box>
                              </Container>
                            </Grid>
                          </Grid>
                        </>
                      )}
                      {log?.mode == "Typing Test" && (
                        <>
                          <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">Test Name</Typography>
                                <Typography>
                                  {log?.testname ? log.testname : ""}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Total Marks
                                </Typography>
                                <Typography>
                                  {log?.totalmarks ? log.totalmarks : ""}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Eligible Marks
                                </Typography>
                                <Typography>
                                  {log?.eligiblemarks ? log.eligiblemarks : ""}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">Created On</Typography>
                                <Typography>
                                  {moment(log?.roundCreatedAt)?.format(
                                    "DD-MM-YYYY HH:mm:ss A"
                                  )}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Test Completed At
                                </Typography>
                                <Typography>
                                  {moment(log?.testcompletedat)?.format(
                                    "DD-MM-YYYY HH:mm:ss A"
                                  )}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Question Type
                                </Typography>
                                <Typography>{log?.questiontype}</Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Question Count
                                </Typography>
                                <Typography>{log?.questioncount}</Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Reporting Date
                                </Typography>
                                <Typography>
                                  {moment(log?.date)?.format("DD-MM-YYYY")}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Reporting Time
                                </Typography>
                                <Typography>
                                  {log?.time
                                    ? moment(log.time, "HH:mm").format(
                                        "hh:mm:ss A"
                                      )
                                    : "Invalid date"}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Deadline Date
                                </Typography>
                                <Typography>
                                  {moment(log?.deadlinedate)?.format(
                                    "DD-MM-YYYY"
                                  )}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Deadline Time
                                </Typography>
                                <Typography>
                                  {log?.deadlinetime
                                    ? moment(log.deadlinetime, "HH:mm").format(
                                        "hh:mm:ss A"
                                      )
                                    : "Invalid date"}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">Duration</Typography>
                                <Typography>
                                  {log?.duration ? log.duration : ""}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Round Status
                                </Typography>
                                <Typography>
                                  {log?.roundstatus ? log.roundstatus : ""}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Round Result
                                </Typography>
                                <Typography>
                                  {log?.roundanswerstatus
                                    ? log.roundanswerstatus
                                    : ""}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">
                                  Interviewer
                                </Typography>
                                <Typography>
                                  {log?.interviewer
                                    ? log?.interviewer?.join(",")
                                    : ""}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={12} xs={12} sm={12}>
                              <Typography variant="h6">
                                Question And Answers
                              </Typography>
                              <Container>
                                <Box mt={2}>
                                  {log?.interviewFormLog?.map((qa, index) => (
                                    <Paper
                                      key={index}
                                      elevation={3}
                                      style={{ marginBottom: "1rem" }}
                                    >
                                      {qa.map((item, indexNew) => (
                                        <>
                                          <Accordion>
                                            <AccordionSummary
                                              expandIcon={<ExpandMoreIcon />}
                                              aria-controls={`panel${indexNew}-content`}
                                              id={`panel${indexNew}-header`}
                                            >
                                              <Typography variant="h6">{`Question.${
                                                indexNew + 1
                                              }`}</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                              <Grid
                                                item
                                                md={12}
                                                xs={12}
                                                sm={12}
                                              >
                                                <FormControl
                                                  fullWidth
                                                  size="small"
                                                >
                                                  <Typography variant="h6">
                                                    {" "}
                                                    Question
                                                  </Typography>
                                                  <Typography>
                                                    {item?.question
                                                      ? item.question
                                                      : ""}
                                                  </Typography>
                                                </FormControl>
                                              </Grid>
                                              <Grid item md={6} xs={12} sm={12}>
                                                <FormControl
                                                  fullWidth
                                                  size="small"
                                                >
                                                  <Typography variant="h6">
                                                    User Answer
                                                  </Typography>
                                                  <Typography>
                                                    {item?.userans
                                                      ? item?.userans?.join(",")
                                                      : ""}
                                                  </Typography>
                                                </FormControl>
                                              </Grid>
                                              <Grid item md={6} xs={12} sm={12}>
                                                <FormControl
                                                  fullWidth
                                                  size="small"
                                                >
                                                  <Typography variant="h6">
                                                    {" "}
                                                    Typing Speed Required
                                                  </Typography>
                                                  <Typography>
                                                    {item?.typingspeed
                                                      ? `${item.typingspeed} wpm`
                                                      : ""}
                                                  </Typography>
                                                </FormControl>
                                              </Grid>
                                              <Grid item md={6} xs={12} sm={12}>
                                                <FormControl
                                                  fullWidth
                                                  size="small"
                                                >
                                                  <Typography variant="h6">
                                                    {" "}
                                                    Type
                                                  </Typography>
                                                  <Typography>
                                                    {item?.type
                                                      ? item.type
                                                      : ""}
                                                  </Typography>
                                                </FormControl>
                                              </Grid>
                                            </AccordionDetails>
                                          </Accordion>
                                          <Container>
                                            <Box mt={2}>
                                              {item?.secondarytodo?.length >
                                                0 &&
                                                item?.secondarytodo?.map(
                                                  (qa, index) => (
                                                    <Paper
                                                      key={index}
                                                      elevation={3}
                                                      style={{
                                                        marginBottom: "1rem",
                                                      }}
                                                    >
                                                      <Typography>
                                                        Sub Questions
                                                      </Typography>
                                                      <>
                                                        <Accordion>
                                                          <AccordionSummary
                                                            expandIcon={
                                                              <ExpandMoreIcon />
                                                            }
                                                            aria-controls={`panel${index}-content`}
                                                            id={`panel${index}-header`}
                                                          >
                                                            <Typography variant="h6">{`Question.${
                                                              index + 1
                                                            }`}</Typography>
                                                          </AccordionSummary>
                                                          <AccordionDetails>
                                                            <Grid
                                                              item
                                                              md={12}
                                                              xs={12}
                                                              sm={12}
                                                            >
                                                              <FormControl
                                                                fullWidth
                                                                size="small"
                                                              >
                                                                <Typography variant="h6">
                                                                  {" "}
                                                                  Question
                                                                </Typography>
                                                                <Typography>
                                                                  {qa?.question
                                                                    ? qa.question
                                                                    : ""}
                                                                </Typography>
                                                              </FormControl>
                                                            </Grid>
                                                            <Grid
                                                              item
                                                              md={6}
                                                              xs={12}
                                                              sm={12}
                                                            >
                                                              <FormControl
                                                                fullWidth
                                                                size="small"
                                                              >
                                                                <Typography variant="h6">
                                                                  User Answer
                                                                </Typography>
                                                                <Typography>
                                                                  {qa?.userans
                                                                    ? qa?.userans?.join(
                                                                        ","
                                                                      )
                                                                    : ""}
                                                                </Typography>
                                                              </FormControl>
                                                            </Grid>
                                                            <Grid
                                                              item
                                                              md={6}
                                                              xs={12}
                                                              sm={12}
                                                            >
                                                              <FormControl
                                                                fullWidth
                                                                size="small"
                                                              >
                                                                <Typography variant="h6">
                                                                  {" "}
                                                                  Type
                                                                </Typography>
                                                                <Typography>
                                                                  {qa?.type
                                                                    ? qa.type
                                                                    : ""}
                                                                </Typography>
                                                              </FormControl>
                                                            </Grid>
                                                          </AccordionDetails>
                                                        </Accordion>
                                                      </>
                                                    </Paper>
                                                  )
                                                )}
                                            </Box>
                                          </Container>
                                        </>
                                      ))}
                                    </Paper>
                                  ))}
                                </Box>
                              </Container>
                            </Grid>
                          </Grid>
                        </>
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Candidate Name</Typography>
                  <Typography>{viewDatas?.fullname}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Company</Typography>
                  <Typography>{viewDatas?.company}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Branch</Typography>
                  <Typography>{viewDatas?.branch}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Designation</Typography>
                  <Typography>{viewDatas?.designation}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Status</Typography>
                  <Typography>{viewDatas?.overallstatus}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Email</Typography>
                  <Typography>{viewDatas?.email}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Is Screened?</Typography>
                  <Typography>
                    {viewDatas?.screencandidate
                      ? viewDatas?.screencandidate
                      : "Not Yet Screened"}
                  </Typography>
                </FormControl>
              </Grid>

              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Current Round</Typography>
                  <Typography>{viewDatas.roundname}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Current Round Status</Typography>
                  <Typography>{viewDatas.roundstatus}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Final Result</Typography>
                  <Typography
                    sx={{
                      color:
                        viewDatas?.finalstatus == "Selected"
                          ? "green"
                          : viewDatas?.finalstatus == "Rejected"
                          ? "red"
                          : "black",
                    }}
                  >
                    {viewDatas?.finalstatus ? viewDatas?.finalstatus : ""}
                  </Typography>
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

      <Dialog
        open={isViewOpen}
        onClose={handleCloseViewpop}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="md"
        sx={{
          overflow: "scroll",
          "& .MuiPaper-root": {
            overflow: "scroll",
          },
        }}
      >
        <Box sx={{ padding: "20px" }}>
          <DialogContent sx={{ width: "100%", padding: "20px" }}>
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12} sx={{ position: "relative" }}>
                <Typography variant="h6">
                  Duplicated With the Same Name
                </Typography>
                <CloseIcon
                  sx={{
                    position: "absolute",
                    top: 15,
                    right: 0,
                    cursor: "pointer",
                  }}
                  onClick={handleCloseViewpop}
                />
              </Grid>
            </Grid>
            <br />
            <DataGrid
              rows={rowsDuplicate}
              columns={columnsDuplicate}
              pageSize={5}
              checkboxSelection
              onSelectionModelChange={handleRowSelection}
              onRowSelectionModelChange={(ids) => {
                const selectedIDs = new Set(ids);
                const selectedRowData = rowsDuplicate.filter((row) =>
                  selectedIDs.has(row.id)
                );
                let getRowIDs = selectedRowData.map((item) => item.id);
                let filteredDatas = candidateCopyNew.filter((data) => {
                  return getRowIDs.includes(data._id);
                });

                setCandidateDuplicate(filteredDatas);
              }}
            />
            <Grid container spacing={2} sx={{ marginTop: 2 }}>
              <Grid item md={2} xs={6} sm={6}>
                <Button
                  variant="contained"
                  onClick={() => {
                    handlePush();
                  }}
                >
                  Filter
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
        </Box>
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
  );
}

export default InterviewCandidatesReportPage;
