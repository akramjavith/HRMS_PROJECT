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
import { userStyle } from "../../../pageStyle";
import { handleApiError } from "../../../components/Errorhandling";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import moment from "moment-timezone";
import {
  UserRoleAccessContext,
  AuthContext,
} from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import PageHeading from "../../../components/PageHeading";
import StyledDataGrid from "../../../components/TableStyle";
import { ThreeDots } from "react-loader-spinner";
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

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";

import InterviewStatusCountCandidate from "./InterviewStatusCountCandidate";

function InterviewStatusCountReportPage() {
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
        rowDataTable?.map((item, index) => ({
          "S.No": index + 1,
          Company: item.company,
          Branch: item.branch,
          Floor: item.floor,
          "Recruitment Name": item.recruitmentname,
          "First No Response": item.firstnoresponse,
          "Second No Response": item.secondnoresponse,
          "No Response": item.notresponse,
          "Not Interested": item.notinterested,
          "Got Other Job": item.gototherjob,
          "Already Joined": item.alreadyjoined,
          "Duplicate Candidate": item.duplicatecandidate,
          "Profile Not Eligible": item.profilenoteligible,
          Selected: item.selected,
          Rejected: item.rejected,
          Hold: item.hold,
        })),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        candidate?.map((item, index) => ({
          Sno: index + 1,
          Company: item.company,
          Branch: item.branch,
          Floor: item.floor,
          "Recruitment Name": item.recruitmentname,
          "First No Response": item.dataCount["First No Response"] || 0,
          "Second No Response": item.dataCount["Second No Response"] || 0,
          "No Response": item.dataCount["No Response"] || 0,
          "Not Interested": item.dataCount["Not Interested"] || 0,
          "Got Other Job": item.dataCount["Got Other Job"] || 0,
          "Already Joined": item.dataCount["Already Joined"] || 0,
          "Duplicate Candidate": item.dataCount["Duplicate Candidate"] || 0,
          "Profile Not Eligible": item.dataCount["Profile Not Eligible"] || 0,
          Selected: item.dataCount["Selected"] || 0,
          Rejected: item.dataCount["Rejected"] || 0,
          Hold: item.dataCount["On Hold"] || 0,
        })),
        fileName
      );
    }

    setIsFilterOpen(false);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [statusCheck, setStatusCheck] = useState(false);

  const [companies, setCompanies] = useState([]);
  const [branches, setBranches] = useState([]);
  const [floors, setFloors] = useState([]);

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

    setFloors([]);
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
  const fetchBranch = async (company) => {
    let ans = company ? company.map((data) => data.value) : [];
    setPageName(!pageName);
    try {
      setBranches(
        isAssignBranch
          ?.filter((comp) => ans.includes(comp.company))
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

  const [tableDatas, setTableDatas] = useState([]);
  const [tableName, setTableName] = useState("");
  const handleTable = async (name, alldata, uniquename) => {
    setPageName(!pageName);
    try {
      let tableDatas = alldata?.filter((data) => data?.considerValue === name);

      if (tableDatas?.length > 0) {
        setTableDatas(tableDatas);
        setTableName(`${uniquename}_${name}`);
        handleOpenTable();
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  useEffect(() => {
    fetchComapnies();
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
  const [candidateCopy, setCandidateCopy] = useState([]);
  const [candidateCopyNew, setCandidateCopyNew] = useState([]);
  const fetchAllCandidate = async () => {
    setPageName(!pageName);
    try {
      let resans = [];
      const [res, res1] = await Promise.all([
        axios.get(SERVICE.INTERVIEWCANDIDATES, {
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
              uniquename: `${foundData.company}_${foundData.branch}_${foundData.floor}_${foundData.recruitmentname}`,
            };
          } else {
            return {
              ...item,
              company: "",
              branch: "",
              floor: "",
              recruitmentname: "",
              uniquename: "",
            };
          }
        })
        .filter((data) => {
          return data.company !== "";
        });

      function countUniqueCombinations(data) {
        const counts = {};
        let uniqueArray = [];
        data.forEach((item) => {
          const key = `${item.company}_${item.branch}_${item.floor}_${item.recruitmentname}`;
          if (!uniqueArray.includes(key)) {
            uniqueArray.push(key);
          }
          counts[key] = (counts[key] || 0) + 1;
        });
        const result = Object.keys(counts).map((key) => {
          const [company, branch, floor, recruitmentname] = key.split("_");
          return {
            company,
            branch,
            floor,
            recruitmentname,
            uniquename: `${company}_${branch}_${floor}_${recruitmentname}`,
            count: counts[key],
          };
        });

        let updatedArray = result.map((data, index) => {
          let foundDatas = getAssignedCandidates.filter((item) => {
            return item.uniquename == data.uniquename;
          });

          if (foundDatas) {
            return {
              ...data,
              relatedDatas: foundDatas,
              _id: index,
            };
          }
        });

        return { result, uniqueArray, updatedArray };
      }

      let showValues = countUniqueCombinations(getAssignedCandidates);

      let finalValues = showValues?.updatedArray?.map((data) => {
        // Initialize counts object
        let counts = {};

        // Iterate through relatedDatas and assign considerValue
        let considerValue = data.relatedDatas.map((item) => {
          if (
            item.candidatestatus !== undefined &&
            item.candidatestatus !== ""
          ) {
            return { ...item, considerValue: item.candidatestatus };
          } else if (
            item.interviewrounds &&
            item.interviewrounds.length === 0
          ) {
            return { ...item, considerValue: "Ignore" };
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
                return {
                  ...item,
                  considerValue: foundObject.roundanswerstatus,
                };
              } else {
                return { ...item, considerValue: "Ignore" };
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
                return {
                  ...item,
                  considerValue: foundObject.roundanswerstatus,
                };
              } else {
                return { ...item, considerValue: "Ignore" };
              }
            }
          }
        });

        considerValue.forEach((obj) => {
          const value = obj.considerValue;
          counts[value] = (counts[value] || 0) + 1;
        });

        return { ...data, relatedDatas: considerValue, dataCount: counts };
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

      const finaldata = finalValues.filter((data, index) => {
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



  console.log(candidate.dataCount, "can")

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

  //unit multiselect
  const handleUnitChangeAdd = (options) => {
    setSelectedOptionsUnitAdd(options);
  };

  const customValueRendererUnitAdd = (valueUnitAdd, _branches) => {
    return valueUnitAdd.length ? (
      valueUnitAdd.map(({ label }) => label)?.join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>Choose Floor</span>
    );
  };

  const handleFilter = async (e, from) => {
    e.preventDefault();
    let comps = selectedOptionsCompanyAdd.map((item) => item.value);
    comps = comps.length == 0 ? "" : comps;
    let branchs = selectedOptionsBranchAdd.map((item) => item.value);
    branchs = branchs.length == 0 ? "" : branchs;
    let floors = selectedOptionsUnitAdd.map((item) => item.value);
    floors = floors.length == 0 ? "" : floors;
    setStatusCheck(false);
    setPageName(!pageName);
    try {
      if (comps.length !== 0) {
        let resans = [];
        let filteredData = candidateCopyNew.filter((entry) => {
          const companyMatch = !comps || comps.includes(entry.company); // Check if company is included in the filter or if no company filter is applied
          const branchMatch = !branchs || branchs.includes(entry.branch);
          const unitMatch = !floors || floors.includes(entry.floor);

          return companyMatch && branchMatch && unitMatch;
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

        const finaldata = filteredData.filter((data, index) => {
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
    actions: true,
    serialNumber: true,
    overallstatus: true,

    company: true,
    branch: true,
    floor: true,
    recruitmentname: true,
    notresponse: true,
    firstnoresponse: true,
    secondnoresponse: true,
    notinterested: true,
    gototherjob: true,
    selected: true,
    rejected: true,
    hold: true,
    alreadyjoined: true,
    duplicatecandidate: true,
    profilenoteligible: true,
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
    setFloors([]);
    setBranches([]);

    setCandidate(candidateCopy);

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
  //table dialog...
  const [isTableOpen, setIsTableOpen] = useState(false);

  const handleCloseTable = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsTableOpen(false);
  };
  const handleOpenTable = () => {
    setIsTableOpen(true);
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  let updateby = roleName.updatedby;
  let addedby = roleName.addedby;

  // pdf.....
  const columns = [
    { title: "Company", field: "company" },
    { title: "Branch", field: "branch" },
    { title: "Floor", field: "floor" },
    { title: "Recruitment Name", field: "recruitmentname" },
    { title: "No Response", field: "notresponse" },
    { title: "First No Response", field: "firstnoresponse" },
    { title: "Second No Response", field: "secondnoresponse" },
    { title: "Not Interested", field: "notinterested" },
    { title: "Got Other Job", field: "gototherjob" },
    { title: "Already Joined", field: "alreadyjoined" },
    { title: "Duplicate Candidate", field: "duplicatecandidate" },
    { title: "Profile Not Eligible", field: "profilenoteligible" },
    { title: "Selected", field: "selected" },
    { title: "Rejected", field: "rejected" },
    { title: "Hold", field: "hold" },
  ];

  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();
    // Initialize serial number counter
    let serialNumberCounter = 1;
    // Modify columns to include serial number column
    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" }, // Serial number column
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial =
      isfilter === "filtered"
        ? rowDataTable.map((row) => ({
          ...row,
          serialNumber: serialNumberCounter++,
        }))
        : candidate.map((item, index) => ({
          serialNumber: index + 1,
          company: item.company,
          branch: item.branch,
          floor: item.floor,
          recruitmentname: item.recruitmentname,
          notresponse: item.dataCount["First No Response"] || 0,
          firstnoresponse: item.dataCount["Second No Response"] || 0,
          secondnoresponse: item.dataCount["No Response"] || 0,
          notinterested: item.dataCount["Not Interested"] || 0,
          gototherjob: item.dataCount["Got Other Job"] || 0,
          alreadyjoined: item.dataCount["Already Joined"] || 0,
          duplicatecandidate: item.dataCount["Duplicate Candidate"] || 0,
          profilenoteligible: item.dataCount["Profile Not Eligible"] || 0,
          selected: item.dataCount["Selected"] || 0,
          rejected: item.dataCount["Rejected"] || 0,
          hold: item.dataCount["On Hold"] || 0,
        }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: "5" },
    });

    doc.save("Interview Status Count Report.pdf");
  };

  // Excel
  const fileName = "Interview Status Count Report";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Interview Status Count Report",
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
      width: 50,
      minHeight: "40px",
      hide: !columnVisibility.serialNumber,
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.company,
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.branch,
    },
    {
      field: "floor",
      headerName: "Floor",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.floor,
    },
    {
      field: "recruitmentname",
      headerName: "Recruitment Name",
      flex: 0,
      width: 200,
      minHeight: "40px",
      hide: !columnVisibility.recruitmentname,
    },
    {
      field: "firstnoresponse",
      headerName: "First No Response",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.firstnoresponse,
      renderCell: (params) => (
        <div
          style={{
            color: "#1d26c6",
            textAlign: "center",
            cursor: params.value > 0 ? "pointer" : "default",
            textDecoration: "underline",
            fontWeight: "bold",
            width: "100%",
            height: "100%",
          }}
          onClick={() => {
            handleTable(
              "First No Response",
              params.row.relatedDatas,
              params.row.uniquename
            );
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "secondnoresponse",
      headerName: "Second No Response",
      flex: 0,
      width: 170,
      minHeight: "40px",
      hide: !columnVisibility.secondnoresponse,
      renderCell: (params) => (
        <div
          style={{
            color: "#1d26c6",
            textAlign: "center",
            cursor: params.value > 0 ? "pointer" : "default",
            textDecoration: "underline",
            fontWeight: "bold",
            width: "100%",
            height: "100%",
          }}
          onClick={() => {
            handleTable(
              "Second No Response",
              params.row.relatedDatas,
              params.row.uniquename
            );
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "notresponse",
      headerName: "No Response",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.notresponse,
      renderCell: (params) => (
        <div
          style={{
            color: "#1d26c6",
            textAlign: "center",
            cursor: params.value > 0 ? "pointer" : "default",
            textDecoration: "underline",
            fontWeight: "bold",
            width: "100%",
            height: "100%",
          }}
          onClick={() => {
            handleTable(
              "No Response",
              params.row.relatedDatas,
              params.row.uniquename
            );
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "notinterested",
      headerName: "Not Interested",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.notinterested,
      renderCell: (params) => (
        <div
          style={{
            color: "#1d26c6",
            textDecoration: "underline",
            cursor: params.value > 0 ? "pointer" : "default",
            textAlign: "center",
            fontWeight: "bold",
            width: "100%",
            height: "100%",
          }}
          onClick={() => {
            handleTable(
              "Not Interested",
              params.row.relatedDatas,
              params.row.uniquename
            );
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "gototherjob",
      headerName: "Got Other Job",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.gototherjob,
      renderCell: (params) => (
        <div
          style={{
            color: "#1d26c6",
            textAlign: "center",
            cursor: params.value > 0 ? "pointer" : "default",
            textDecoration: "underline",
            fontWeight: "bold",
            width: "100%",
            height: "100%",
          }}
          onClick={() => {
            handleTable(
              "Got Other Job",
              params.row.relatedDatas,
              params.row.uniquename
            );
          }}
        >
          {params.value}
        </div>
      ),
    },

    {
      field: "alreadyjoined",
      headerName: "Already Joined",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.alreadyjoined,
      renderCell: (params) => (
        <div
          style={{
            color: "#000",
            cursor: params.value > 0 ? "pointer" : "default",
            textDecoration: "underline",
            fontWeight: "bold",
            width: "100%",
            height: "100%",
          }}
          onClick={() => {
            handleTable(
              "Already Joined",
              params.row.relatedDatas,
              params.row.uniquename
            );
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "duplicatecandidate",
      headerName: "Duplicate Candidate",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.duplicatecandidate,
      renderCell: (params) => (
        <div
          style={{
            color: "#000",
            cursor: params.value > 0 ? "pointer" : "default",
            textDecoration: "underline",
            fontWeight: "bold",
            width: "100%",
            height: "100%",
          }}
          onClick={() => {
            handleTable(
              "Duplicate Candidate",
              params.row.relatedDatas,
              params.row.uniquename
            );
          }}
        >
          {params.value}
        </div>
      ),
    },

    {
      field: "profilenoteligible",
      headerName: "Profile Not Eligible",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.profilenoteligible,
      renderCell: (params) => (
        <div
          style={{
            color: "#000",
            cursor: params.value > 0 ? "pointer" : "default",
            textDecoration: "underline",
            fontWeight: "bold",
            width: "100%",
            height: "100%",
          }}
          onClick={() => {
            handleTable(
              "Profile Not Eligible",
              params.row.relatedDatas,
              params.row.uniquename
            );
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "selected",
      headerName: "Selected",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.selected,
      renderCell: (params) => (
        <div
          style={{
            color: "green",
            textAlign: "center",
            cursor: params.value > 0 ? "pointer" : "default",
            textDecoration: "underline",
            fontWeight: "bold",
            width: "100%",
            height: "100%",
          }}
          onClick={() => {
            handleTable(
              "Selected",
              params.row.relatedDatas,
              params.row.uniquename
            );
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "rejected",
      headerName: "Rejected",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.rejected,
      renderCell: (params) => (
        <div
          style={{
            color: "red",
            textAlign: "center",
            cursor: params.value > 0 ? "pointer" : "default",
            textDecoration: "underline",
            fontWeight: "bold",
            width: "100%",
            height: "100%",
          }}
          onClick={() => {
            handleTable(
              "Rejected",
              params.row.relatedDatas,
              params.row.uniquename
            );
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "hold",
      headerName: "Hold",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.hold,
      renderCell: (params) => (
        <div
          style={{
            color: "#000",
            cursor: params.value > 0 ? "pointer" : "default",
            textDecoration: "underline",
            fontWeight: "bold",
            width: "100%",
            height: "100%",
          }}
          onClick={() => {
            handleTable("Hold", params.row.relatedDatas, params.row.uniquename);
          }}
        >
          {params.value}
        </div>
      ),
    },
  ];

  // Create a row data object for the DataGrid
  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      floor: item.floor,
      recruitmentname: item.recruitmentname,
      relatedDatas: item.relatedDatas,
      uniquename: item.uniquename,
      firstnoresponse: item.dataCount["First No Response"] || 0,
      secondnoresponse: item.dataCount["Second No Response"] || 0,
      notresponse: item.dataCount["No Response"] || 0,
      notinterested: item.dataCount["Not Interested"] || 0,
      gototherjob: item.dataCount["Got Other Job"] || 0,
      selected: item.dataCount["Selected"] || 0,
      rejected: item.dataCount["Rejected"] || 0,
      hold: item.dataCount["On Hold"] || 0,
      alreadyjoined: item.dataCount["Already Joined"] || 0,
      duplicatecandidate: item.dataCount["Duplicate Candidate"] || 0,
      profilenoteligible: item.dataCount["Profile Not Eligible"] || 0,
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
          saveAs(blob, "Interview Status Count Report.png");
        });
      });
    }
  };

  return (
    <Box>
      <Headtitle title={"INTERVIEW STATUS COUNT REPORT PAGE"} />
      {/* ****** Header Content ****** */}

      <PageHeading
        title="Manage Interview Status Count Report Page"
        modulename="Human Resources"
        submodulename="Recruitment"
        mainpagename="Interview Status Count Report Page"
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("linterviewstatuscountreportpage") && (
        <Box sx={userStyle.dialogbox}>
          <>
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12} lg={3}>
                <FormControl fullWidth size="small">
                  <Typography> Company</Typography>
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
              <Grid item md={3} xs={12} sm={12} lg={3}>
                <FormControl fullWidth size="small">
                  <Typography> Floor</Typography>
                  <MultiSelect
                    size="small"
                    options={floors}
                    value={selectedOptionsUnitAdd}
                    onChange={handleUnitChangeAdd}
                    valueRenderer={customValueRendererUnitAdd}
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

      {isUserRoleCompare?.includes("linterviewstatuscountreportpage") && (
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
                    "excelinterviewstatuscountreportpage"
                  ) && (
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
                  {isUserRoleCompare?.includes(
                    "csvinterviewstatuscountreportpage"
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
                    "printinterviewstatuscountreportpage"
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
                    "pdfinterviewstatuscountreportpage"
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
              <TableCell>Company</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Floor</TableCell>
              <TableCell>Recruitment Name</TableCell>
              <TableCell>First No Response</TableCell>
              <TableCell>Second No Response</TableCell>
              <TableCell>No Response</TableCell>
              <TableCell>Not Interested</TableCell>
              <TableCell>Got Other Job</TableCell>

              <TableCell>Already Joined</TableCell>
              <TableCell>Duplicate Candidate</TableCell>
              <TableCell>Profile Not Eligible</TableCell>

              <TableCell>Selected</TableCell>
              <TableCell>Rejected</TableCell>
              <TableCell>Hold</TableCell>
            </TableRow>
          </TableHead>
          <TableBody align="left">
            {rowDataTable &&
              rowDataTable.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.company}</TableCell>
                  <TableCell>{row.branch}</TableCell>
                  <TableCell>{row.floor}</TableCell>
                  <TableCell>{row.recruitmentname}</TableCell>
                  <TableCell>{row.firstnoresponse}</TableCell>
                  <TableCell>{row.secondnoresponse}</TableCell>
                  <TableCell>{row.notresponse}</TableCell>
                  <TableCell>{row.notinterested}</TableCell>
                  <TableCell>{row.gototherjob}</TableCell>

                  <TableCell>{row.alreadyjoined}</TableCell>
                  <TableCell>{row.duplicatecandidate}</TableCell>
                  <TableCell>{row.profilenoteligible}</TableCell>

                  <TableCell>{row.selected}</TableCell>
                  <TableCell>{row.rejected}</TableCell>
                  <TableCell>{row.hold}</TableCell>
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

      <Dialog
        open={isTableOpen}
        onClose={handleCloseTable}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="lg"
      // sx={{
      //   overflow: "visible",
      //   "& .MuiPaper-root": {
      //     overflow: "visible",
      //   },
      // }}
      >
        <InterviewStatusCountCandidate
          tableDatas={tableDatas}
          handleCloseTable={handleCloseTable}
          tableName={tableName}
        />
      </Dialog>
    </Box>
  );
}

export default InterviewStatusCountReportPage;
