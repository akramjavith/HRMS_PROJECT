import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ImageIcon from "@mui/icons-material/Image";
import domtoimage from 'dom-to-image';
import {
  Box,
  Button,
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
  Popover,
  Select,
  Table,
  TableBody,
  TableHead,
  TextField,
  Typography,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../../components/Errorhandling";
import Headtitle from "../../../components/Headtitle";
import PageHeading from "../../../components/PageHeading";
import { StyledTableCell, StyledTableRow } from "../../../components/Table";
import {
  AuthContext,
  UserRoleAccessContext,
} from "../../../context/Appcontext";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";

import { FaFileCsv, FaFileExcel } from "react-icons/fa";

import InterviewStatusCountCandidate from "./InterviewStatusCountCandidate";

import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
import AlertDialog from "../../../components/Alert";
import ExportData from "../../../components/ExportData";

function InterviewStatusCountReportPage() {
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    // setSubmitLoader(false);
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
    "Company",
    "Branch",
    "Floor",
    "Recruitment Name",
    "First No Response",
    "Second No Response",
    "No Response",
    "Not Interested",
    "Got Other Job",
    "Already Joined",
    "Duplicate Candidate",
    "Profile Not Eligible",
    "Selected",
    "Rejected",
    "Hold",
  ];
  let exportRowValues = [
    "company",
    "branch",
    "floor",
    "recruitmentname",
    "firstnoresponse",
    "secondnoresponse",
    "notresponse",
    "notinterested",
    "gototherjob",
    "alreadyjoined",
    "duplicatecandidate",
    "profilenoteligible",
    "selected",
    "rejected",
    "hold",
  ];

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
        accessbranch
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
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const fetchComapnies = async () => {
    setPageName(!pageName);
    try {
      setCompanies(
        accessbranch
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
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
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
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  useEffect(() => {
    fetchComapnies();
  }, []);

  const {
    isUserRoleCompare,
    isAssignBranch,
    pageName,
    setPageName,
    isUserRoleAccess,
    buttonStyles,
  } = useContext(UserRoleAccessContext);

  const accessbranch = isUserRoleAccess?.role?.includes("Manager")
    ? isAssignBranch
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
      })
    : isAssignBranch
      ?.filter((data) => {
        let fetfinalurl = [];
        if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 &&
          data?.subpagenameurl?.length !== 0 &&
          data?.subsubpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subsubpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 &&
          data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.mainpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.submodulenameurl;
        } else if (data?.modulenameurl?.length !== 0) {
          fetfinalurl = data.modulenameurl;
        } else {
          fetfinalurl = [];
        }

        const remove = [
          window.location.pathname?.substring(1),
          window.location.pathname,
        ];
        return fetfinalurl?.some((item) => remove?.includes(item));
      })
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

  useEffect(() => {
    getapi();
  }, []);

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Interview Status Count Report Page"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),

      addedby: [
        {
          name: String(isUserRoleAccess?.companyname),
          date: String(new Date()),
        },
      ],
    });
  };
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

      const finaldata = finalValues.filter((data, index) => {
        accessbranch.forEach((d, i) => {
          if (d.company === data.company && d.branch === data.branch) {
            resans.push(data);
          }
        });
      });

      const itemsWithSerialNumber = resans?.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
        id: item._id,
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
      }));
      setCandidate(itemsWithSerialNumber);
      setCandidateCopy(itemsWithSerialNumber);
      setCandidateCopyNew(itemsWithSerialNumber);

      setStatusCheck(true);
    } catch (err) {
      setStatusCheck(true);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  useEffect(() => {
    fetchAllCandidate();
  }, []);

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
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
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

        const finaldata = filteredData.filter((data, index) => {
          accessbranch.forEach((d, i) => {
            if (d.company === data.company && d.branch === data.branch) {
              resans.push(data);
            }
          });
        });

        const itemsWithSerialNumber = resans?.map((item, index) => ({
          ...item,
          serialNumber: index + 1,
          id: item._id,
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
        }));
        setCandidate(itemsWithSerialNumber);
        setStatusCheck(true);
      }

      setStatusCheck(true);
    } catch (err) {
      setStatusCheck(true);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
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
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
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

    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
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
  const [selectedRows, setSelectedRows] = useState([]);
  const addSerialNumber = (datas) => {

    setItems(datas);
  };

  useEffect(() => {
    addSerialNumber(candidate);
  }, [candidate]);

  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTable = useRef(null);

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
      pinned: "left",
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.company,
      pinned: "left",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.branch,
      pinned: "left",
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
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cellRenderer: (params) => (
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
              params.data.relatedDatas,
              params.data.uniquename
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
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cellRenderer: (params) => (
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
              params.data.relatedDatas,
              params.data.uniquename
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
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cellRenderer: (params) => (
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
              params.data.relatedDatas,
              params.data.uniquename
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
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cellRenderer: (params) => (
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
              params.data.relatedDatas,
              params.data.uniquename
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
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cellRenderer: (params) => (
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
              params.data.relatedDatas,
              params.data.uniquename
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
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cellRenderer: (params) => (
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
              params.data.relatedDatas,
              params.data.uniquename
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
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cellRenderer: (params) => (
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
              params.data.relatedDatas,
              params.data.uniquename
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
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cellRenderer: (params) => (
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
              params.data.relatedDatas,
              params.data.uniquename
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
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cellRenderer: (params) => (
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
              params.data.relatedDatas,
              params.data.uniquename
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
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cellRenderer: (params) => (
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
              params.data.relatedDatas,
              params.data.uniquename
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
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cellRenderer: (params) => (
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
              "Hold",
              params.data.relatedDatas,
              params.data.uniquename
            );
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
      id: item.id,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      floor: item.floor,
      recruitmentname: item.recruitmentname,
      relatedDatas: item.relatedDatas,
      uniquename: item.uniquename,
      firstnoresponse: item?.firstnoresponse,
      secondnoresponse: item?.secondnoresponse,
      notresponse: item?.notresponse,
      notinterested: item?.notinterested,
      gototherjob: item?.gototherjob,
      selected: item?.selected,
      rejected: item?.rejected,
      hold: item?.hold,
      alreadyjoined: item?.alreadyjoined,
      duplicatecandidate: item?.duplicatecandidate,
      profilenoteligible: item?.profilenoteligible,
    };
  });
  // Show All Columns functionality

  const handleShowAllColumns = () => {
    setColumnVisibility(initialColumnVisibility);
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


  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, `Interview Status Count Report.png`);
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };
  return (
    <Box>
      <Headtitle title={"INTERVIEW STATUS COUNT REPORT PAGE"} />
      {/* ****** Header Content ****** */}

      <PageHeading
        title="Interview Status Count Report Page"
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

              <Grid item md={1} xs={6} sm={6}>
                <Typography>&nbsp;</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    handleFilter(e, "filter");
                  }}
                  sx={buttonStyles.buttonsubmit}
                >
                  Filter
                </Button>
              </Grid>
              <Grid item md={1} xs={6} sm={6}>
                <Typography>&nbsp;</Typography>
                <Button sx={buttonStyles.btncancel} onClick={handleClear}>
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
                  {isUserRoleCompare?.includes(
                    "imageinterviewstatuscountreportpage"
                  ) && (
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
                    )}
                </Box>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>
                <AggregatedSearchBar
                  columnDataTable={columnDataTable}
                  setItems={setItems}
                  addSerialNumber={addSerialNumber}
                  setPage={setPage}
                  maindatas={candidate}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                  totalDatas={candidate}
                />
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
                    itemsList={candidate}
                  />
                </>
              )}
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
              sx={buttonStyles.buttonsubmit}
              onClick={() => {
                handleCloseerrpop();
              }}
            >
              ok
            </Button>
            <Button
              sx={buttonStyles.btncancel}
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
            sx={buttonStyles.btncancel}
          >
            Cancel
          </Button>
          <Button
            autoFocus
            variant="contained"
            sx={buttonStyles.buttonsubmit}
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
              <Button variant="contained" onClick={handleCloseinfo} sx={buttonStyles.btncancel}>
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
            <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

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
        itemsTwo={candidate ?? []}
        filename={fileName}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* SUCCESS */}
      <AlertDialog
        openPopup={openPopup}
        handleClosePopup={handleClosePopup}
        popupContent={popupContent}
        popupSeverity={popupSeverity}
      />
      <Dialog
        open={isTableOpen}
        onClose={handleCloseTable}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="lg"
        sx={{
          marginTop: "50px",
        }}
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
