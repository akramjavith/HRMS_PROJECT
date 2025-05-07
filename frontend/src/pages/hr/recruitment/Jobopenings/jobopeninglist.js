import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LastPageIcon from "@mui/icons-material/LastPage";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import VisibilityIcon from "@mui/icons-material/Visibility";
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
  OutlinedInput,
  Paper,
  Popover,
  Select,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Typography,
} from "@mui/material";
import axios from "axios";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../../../components/Errorhandling";
import Headtitle from "../../../../components/Headtitle";
import PageHeading from "../../../../components/PageHeading";
import { StyledTableCell, StyledTableRow } from "../../../../components/Table";
import {
  AuthContext,
  UserRoleAccessContext,
} from "../../../../context/Appcontext";
import { userStyle } from "../../../../pageStyle";
import { BASE_URL } from "../../../../services/Authservice";
import { SERVICE } from "../../../../services/Baseservice";
import JobClosingList from "./jobclosedlist";

import ImageIcon from "@mui/icons-material/Image";
import html2canvas from "html2canvas";

import AddIcon from "@mui/icons-material/Add";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { FaFileCsv, FaFileExcel } from "react-icons/fa";

import AlertDialog from "../../../../components/Alert";
import ExportData from "../../../../components/ExportData";
import InfoPopup from "../../../../components/InfoPopup.js";
import MessageAlert from "../../../../components/MessageAlert";
import { DeleteConfirmation } from "../../../../components/DeleteConfirmation.js";

function JobopeningList() {
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
    "Job Opening Id",
    "Recruitment Name",
    "Opening Date",
    "Closing Date",
    "Status",
  ];
  let exportRowValues = [
    "company",
    "branch",
    "floor",
    "joboopenid",
    "recruitmentname",
    "dateopened",
    "targetdate",
    "status",
  ];

  const fileName = "Jobopening";
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

  // Excel
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
      pagename: String("Job Openings"),
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

  const gridRef = useRef(null);

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
      link.download = "Jobopening.png";
      link.click();
    });
  };

  const [jobOpening, setJobOpening] = useState([]);

  const { auth } = useContext(AuthContext);
  //Datatable
  const [queueCheck, setQueueCheck] = useState(false);
  const [rowId, setRowId] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [openInfo, setOpeninfo] = useState(false);
  const [items, setItems] = useState([]);
  const [sorting, setSorting] = useState({ column: "", direction: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [recruitmentData, setRecruitmnetData] = useState({
    recruitmentid: "",
    recruitmentname: "",
  });
  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
  };

  // Filtered option fields

  const [companys, setCompanys] = useState([]);
  const [branchs, setBranchs] = useState([]);
  const [designations, setDesignations] = useState([]);

  // This is create multi select
  // company
  const [selectedOptionsCom, setSelectedOptionsCom] = useState([]);
  let [valueComp, setValueComp] = useState("");

  const handleCompanyChange = (options) => {
    setValueComp(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCom(options);
  };

  const customValueRendererCom = (valueComp, _companys) => {
    return valueComp.length
      ? valueComp.map(({ label }) => label).join(", ")
      : "Please Select Company";
  };

  // branch
  const [selectedOptionsBran, setSelectedOptionsBran] = useState([]);
  let [valueBran, setValueBran] = useState("");

  const handleBranchChange = (options) => {
    setValueBran(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBran(options);
  };

  const customValueRendererBran = (valueBran, _branchs) => {
    return valueBran.length
      ? valueBran.map(({ label }) => label).join(", ")
      : "Please Select Branch";
  };

  // Designation
  const [selectedOptionsDesig, setSelectedOptionsDesig] = useState([]);
  let [valueDesig, setValueDesig] = useState("");

  const handleDesignationChange = (options) => {
    setValueDesig(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsDesig(options);
  };

  const customValueRendererDesig = (valueDesig, _designations) => {
    return valueDesig.length
      ? valueDesig.map(({ label }) => label).join(", ")
      : "Please Select Designation";
  };

  const fetchDesignationDropdowns = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.DESIGNATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDesignations(
        res?.data?.designation
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
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const fetchCompanyDropdowns = () => {
    setPageName(!pageName);
    try {
      setCompanys(
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

  const fetchBranchDropdowns = (e) => {
    let ans = e ? e.map((data) => data.value) : [];
    setPageName(!pageName);
    try {
      setBranchs(
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

  useEffect(() => {
    fetchCompanyDropdowns();
    fetchDesignationDropdowns();
    window.scrollTo(0, 0);
  }, []);

  const fetchFilteredData = async () => {
    setPageName(!pageName);
    try {
      if (selectedOptionsCom?.length === 0) {
        setPopupContentMalert("Please Select Company!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else {
        setQueueCheck(false);
        let resans = [];
        let res = await axios.post(SERVICE.JOBOPNEING_FILTER, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          company: [...valueComp],
          branch: [...valueBran],
          designation: [...valueDesig],
        });
        let filterValue = res?.data?.jobfilters.filter((data, i) => {
          return data.status !== "closed";
        });

        const finaldata = filterValue.filter((data, index) => {
          accessbranch.forEach((d, i) => {
            if (d.company === data.company && d.branch === data.branch) {
              resans.push(data);
            }
          });
        });

        setJobOpening(resans);
        setQueueCheck(true);
      }
    } catch (err) {
      setQueueCheck(true);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  //delete model
  const [openDelete, setOpenDelete] = useState(false);
  const handleClickOpen = () => {
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  const [openEmail, setOpenEmail] = useState(false);
  const handleClickOpenEmail = () => {
    setOpenEmail(true);
    setManageColumnsOpen(false);
  };
  const handleCloseEmail = () => {
    setOpenEmail(false);
  };

  const [checking, setChecking] = useState("");
  const answer = async (e) => {
    let res_sub = await axios.get(SERVICE.GET_OVERALL_SETTINGS, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });

    let convert = res_sub.data.overallsettings[0].emaildescription;
    const tempElement = document.createElement("div");
    tempElement.innerHTML = convert;

    const listItems = Array.from(tempElement.querySelectorAll("li"));
    listItems.forEach((li, index) => {
      li.innerHTML = `${index + 1}. ${li.innerHTML}\n`;
    });

    let texted = tempElement.innerHTML;

    let findMethod = texted
      .replaceAll("$COMPANYNAME$", e.company ? e.company : "")
      .replaceAll("$JOBTITLE$", e.recruitmentname ? e.recruitmentname : "")
      .replaceAll("$LOCATION$", e.city + "," + " " + e.state)
      .replaceAll("$DEPARTMENT$", e.department ? e.department : "")
      .replaceAll("$TYPE$", e.remotejob === false ? "Full Time" : "Remote")
      .replaceAll(
        "$APPLICATION:DEADLINE$",
        moment(e.targetdate).format("DD-MM-YYYY")
          ? moment(e.targetdate).format("DD-MM-YYYY")
          : ""
      )
      .replaceAll("$JOB:DESCRIPTION$", e.jobdescription ? e.jobdescription : "")
      .replaceAll(
        "$JOB:REQUIRMENTS$",
        e.jobrequirements ? e.jobrequirements : ""
      )
      .replaceAll("$JOBBENEFITS$", e.jobbenefits ? e.jobbenefits : "")
      .replaceAll(
        "$ROLESANDRESPONSIBLITIES$",
        e.rolesresponse ? e.rolesresponse : ""
      )
      // .replaceAll("$EMPCODE$", employee.company ? employee.company : "")
      .replaceAll("$CONTACT:INFORMATION$", e.phone ? e.phone : "")
      .replaceAll("$FULLNAME$", e.hiringmanager ? e.hiringmanager : "")
      .replaceAll("$APPLICATION:EMAIL$", e.email ? e.email : "");
    // .replaceAll("$DESIGNATION$", employee.designation ? employee.designation : "")
    setChecking(findMethod);
  };

  const getEmailDetailLayout = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.JOBOPENING_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      answer(res.data.sjobopening);
      handleClickOpenEmail();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  //get all role and responsibilities details.

  //get all project.
  const fetchAllApproveds = async () => {
    let resans = [];
    setPageName(!pageName);
    try {
      let res_queue = await axios.get(SERVICE.ALLJOBOPENINGS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let filterValue = res_queue?.data?.jobopenings.filter((data, i) => {
        return !(data.status === "closed");
      });

      const finaldata = filterValue.filter((data, index) => {
        accessbranch.forEach((d, i) => {
          if (d.company === data.company && d.branch === data.branch) {
            resans.push(data);
          }
        });
      });
      setJobOpening(resans);
      setQueueCheck(true);
    } catch (err) {
      setQueueCheck(true);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  useEffect(() => {
    fetchAllApproveds();
  }, []);

  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };
  // info model
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };

  const handleCopy = () => {
    NotificationManager.success("Copied! 👍", "", 2000);
  };

  let snos = 1;
  // this is the etimation concadination value
  const modifiedData = jobOpening?.map((person) => ({
    ...person,
    sino: snos++,
  }));

  const [updateDetails, setUpDateDetails] = useState({});
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.JOBOPENING_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setUpDateDetails(res?.data?.sjobopening);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const getviewCode = async (e) => {
    setPageName(!pageName);
    try {
      await axios.get(`${SERVICE.JOBOPENING_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const deleteJob = async () => {
    setPageName(!pageName);
    try {
      await axios.delete(`${SERVICE.JOBOPENING_SINGLE}/${rowId}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      handleCloseDelete();
      await fetchAllApproveds();
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

  const handleClearFilter = async (e) => {
    e.preventDefault();
    fetchAllApproveds();
    setValueBran([]);
    setBranchs([]);
    setSelectedOptionsCom([]);
    setSelectedOptionsBran([]);
    setSelectedOptionsDesig([]);
    await fetchAllApproveds();
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Jobopening",
    pageStyle: "print",
  });

  //serial no for listing items
  const addSerialNumber = () => {
    const itemsWithSerialNumber = modifiedData?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      dateopened: moment(item.dateopened).format("DD-MM-YYYY"),
      targetdate: moment(item.targetdate).format("DD-MM-YYYY"),
    }));
    setItems(itemsWithSerialNumber);
  };

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
  }, [modifiedData]);

  return (
    <Box>
      <Headtitle title={"JOB OPEING LIST"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Job Opening List"
        modulename="Human Resources"
        submodulename="Recruitment"
        mainpagename="Job Openings"
        subpagename=""
        subsubpagename=""
      />

      <NotificationContainer />
      {!queueCheck ? (
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
          {isUserRoleCompare?.includes("ljobopenings") && (
            <>
              <Box sx={userStyle.container}>
                {/* ******************************************************EXPORT Buttons****************************************************** */}
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Job opening List
                  </Typography>
                </Grid>
                <Grid container sx={{ justifyContent: "center" }}>
                  <Grid>
                    {isUserRoleCompare?.includes("exceljobopenings") && (
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
                    {isUserRoleCompare?.includes("csvjobopenings") && (
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
                    {isUserRoleCompare?.includes("printjobopenings") && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("pdfjobopenings") && (
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
                    {isUserRoleCompare?.includes("imagejobopenings") && (
                      <>
                        <Button
                          sx={userStyle.buttongrp}
                          onClick={handleCaptureImage}
                        >
                          <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                          &ensp;Image&ensp;
                        </Button>
                      </>
                    )}
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Company <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={companys}
                        value={selectedOptionsCom}
                        onChange={(e) => {
                          handleCompanyChange(e);
                          fetchBranchDropdowns(e);
                          setSelectedOptionsBran([]);
                        }}
                        valueRenderer={customValueRendererCom}
                        labelledBy="Please Select Company"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                    <FormControl fullWidth size="small">
                      <Typography>Branch</Typography>
                      <MultiSelect
                        options={branchs}
                        value={selectedOptionsBran}
                        onChange={(e) => {
                          handleBranchChange(e);
                        }}
                        valueRenderer={customValueRendererBran}
                        labelledBy="Please Select Branch"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                    <FormControl fullWidth size="small">
                      <Typography>Designation</Typography>
                      <MultiSelect
                        options={designations}
                        value={selectedOptionsDesig}
                        onChange={(e) => {
                          handleDesignationChange(e);
                        }}
                        valueRenderer={customValueRendererDesig}
                        labelledBy="Please Select Designation"
                      />
                    </FormControl>
                  </Grid>
                  <br />
                  <Grid item md={1} xs={12} sm={12} marginTop={3}>
                    <Button
                      variant="contained"
                      onClick={() => fetchFilteredData()}
                      sx={buttonStyles.buttonsubmit}
                    >
                      Filter
                    </Button>
                  </Grid>
                  <Grid item md={2} xs={12} sm={12} marginTop={3}>
                    <Button
                      onClick={handleClearFilter}
                      sx={buttonStyles.btncancel}
                    >
                      Clear
                    </Button>
                  </Grid>
                </Grid>
                <br /> <br />
                {/* ****** Table Grid Container ****** */}
                <Grid style={userStyle.dataTablestyle}>
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
                      {/* <MenuItem value={jobOpening?.length}>All</MenuItem> */}
                    </Select>
                  </Box>
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
                {/* ****** Table start ****** */}
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
                            <Box>SNo</Box>
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
                        <StyledTableCell onClick={() => handleSorting("floor")}>
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Floor</Box>
                            <Box sx={{ marginTop: "-6PX" }}>
                              {renderSortingIcon("floor")}
                            </Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell
                          onClick={() => handleSorting("joboopenid")}
                        >
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Job opening Id</Box>
                            <Box sx={{ marginTop: "-6PX" }}>
                              {renderSortingIcon("joboopenid")}
                            </Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell
                          onClick={() => handleSorting("recruitmentname")}
                        >
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Recruitment Name</Box>
                            <Box sx={{ marginTop: "-6PX" }}>
                              {renderSortingIcon("recruitmentname")}
                            </Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell
                          onClick={() => handleSorting("dateopened")}
                        >
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Opening Date</Box>
                            <Box sx={{ marginTop: "-6PX" }}>
                              {renderSortingIcon("dateopened")}
                            </Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell
                          onClick={() => handleSorting("targetdate")}
                        >
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Closing Date</Box>
                            <Box sx={{ marginTop: "-6PX" }}>
                              {renderSortingIcon("targetdate")}
                            </Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell
                          onClick={() => handleSorting("status")}
                        >
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Status</Box>
                            <Box sx={{ marginTop: "-6PX" }}>
                              {renderSortingIcon("status")}
                            </Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell>Action</StyledTableCell>
                      </StyledTableRow>
                    </TableHead>
                    <TableBody align="left">
                      {filteredData?.length > 0 ? (
                        filteredData?.map((row, index) => (
                          <StyledTableRow key={index}>
                            <StyledTableCell>
                              {row.serialNumber}
                            </StyledTableCell>
                            <StyledTableCell>{row.company}</StyledTableCell>
                            <StyledTableCell>{row.branch}</StyledTableCell>
                            <StyledTableCell>{row.floor}</StyledTableCell>
                            <StyledTableCell>{row.joboopenid}</StyledTableCell>
                            <StyledTableCell>
                              {row.recruitmentname}
                            </StyledTableCell>
                            <StyledTableCell>{row.dateopened}</StyledTableCell>
                            <StyledTableCell>{row.targetdate}</StyledTableCell>
                            <StyledTableCell>{row.status}</StyledTableCell>
                            <StyledTableCell
                              component="th"
                              scope="row"
                              colSpan={5}
                            >
                              <Grid sx={{ display: "flex" }}>
                                {isUserRoleCompare?.includes(
                                  "ejobopenings"
                                ) && (
                                    <Link to={`/recruitment/jobedit/${row._id}`}>
                                      <Button
                                        sx={userStyle.buttonedit}
                                        onClick={() => {
                                          getviewCode(row._id);
                                        }}
                                      >
                                        <EditOutlinedIcon
                                          sx={buttonStyles.buttonedit}
                                        />
                                      </Button>
                                    </Link>
                                  )}
                                {/* <Link to={`/location/${row._id}`} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonedit} style={{ minWidth: '0px' }}><EditOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link> */}
                                {isUserRoleCompare?.includes(
                                  "djobopenings"
                                ) && (
                                    <Button
                                      sx={userStyle.buttondelete}
                                      onClick={(e) => {
                                        // rowData(row._id, row.name);
                                      }}
                                    >
                                      {" "}
                                      <DeleteIcon
                                        onClick={() => {
                                          setRowId(row._id);
                                          handleClickOpen();
                                        }}
                                        sx={buttonStyles.buttondelete}
                                      />
                                    </Button>
                                  )}
                                {isUserRoleCompare?.includes(
                                  "vjobopenings"
                                ) && (
                                    <>
                                      <Link
                                        to={`/recruitment/jobview/${row._id}`}
                                        style={{
                                          textDecoration: "none",
                                          color: "#fff",
                                        }}
                                      >
                                        <Button
                                          size="small"
                                          variant="outlined"
                                          style={userStyle.actionbutton}
                                        >
                                          <VisibilityIcon
                                            sx={buttonStyles.buttonview}
                                          />
                                        </Button>
                                      </Link>
                                    </>
                                  )}
                                {isUserRoleCompare?.includes(
                                  "ijobopenings"
                                ) && (
                                    <Button
                                      sx={userStyle.buttonedit}
                                      onClick={() => {

                                        getinfoCode(row._id);
                                      }}
                                    >
                                      <InfoOutlinedIcon
                                        sx={buttonStyles.buttoninfo}
                                      />
                                    </Button>
                                  )}
                                <Link
                                  to={`/addcandidate/${row._id}`}
                                  style={{
                                    textDecoration: "none",
                                    color: "#fff",
                                  }}
                                >
                                  <IconButton
                                    sx={userStyle.actionbutton}
                                    title="Add Candidate"
                                    color="primary"
                                  >
                                    <AddIcon />
                                  </IconButton>
                                </Link>
                                <Link
                                  to={`/company/recuritment/${row._id}`}
                                  style={{
                                    textDecoration: "none",
                                    color: "#fff",
                                  }}
                                >
                                  <IconButton
                                    sx={userStyle.actionbutton}
                                    title="Recruitment Overview"
                                    color="primary"
                                  >
                                    <AssessmentIcon />
                                  </IconButton>
                                </Link>
                                <Button
                                  sx={userStyle.buttonedit}
                                  onClick={(e) => {
                                    setRecruitmnetData({
                                      recruitmentid: row._id,
                                      recruitmentname: row.recruitmentname,
                                    });
                                    handleOpenManageColumns(e);
                                  }}
                                >
                                  <MoreVertIcon />
                                </Button>
                                <Popover
                                  id={id}
                                  open={isManageColumnsOpen}
                                  anchorEl={anchorEl}
                                  onClose={handleCloseManageColumns}
                                  anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "right",
                                  }}
                                >
                                  <Box>
                                    <List component="nav" aria-label="My List">
                                      <ListItem>
                                        <Link
                                          to={`/company/recuritment/${recruitmentData.recruitmentid}`}
                                          sx={{
                                            "&:hover": {
                                              cursor: "pointer",
                                              color: "blue",
                                              textDecoration: "underline",
                                            },
                                          }}
                                        >
                                          <ListItemText
                                            style={{
                                              textDecoration: "none",
                                              color: "#1A1110",
                                            }}
                                            primary="Recruitment Overview"
                                          />
                                        </Link>
                                      </ListItem>
                                      <ListItem>
                                        <Link
                                          to={`/addcandidate/${recruitmentData.recruitmentid}`}
                                          sx={{
                                            "&:hover": {
                                              cursor: "pointer",
                                              color: "blue",
                                              textDecoration: "underline",
                                            },
                                          }}
                                        >
                                          <ListItemText
                                            style={{
                                              textDecoration: "none",
                                              color: "#1A1110",
                                            }}
                                            primary="Add Candidate"
                                          />
                                        </Link>
                                      </ListItem>
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
                                          onCopy={handleCopy}
                                          options={{ message: "Copied!" }}
                                          text={`${BASE_URL}/career/jobdescriptions/${recruitmentData.recruitmentname}/${recruitmentData.recruitmentid}`}
                                        >
                                          <ListItemText primary="Internal Recruitment Link" />
                                        </CopyToClipboard>
                                      </ListItem>
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
                                          onCopy={handleCopy}
                                          options={{ message: "Copied!" }}
                                          text={`http://hihrms.ttsbusinessservices.com/career/jobdescriptions/${recruitmentData.recruitmentname}/${recruitmentData.recruitmentid}`}
                                        >
                                          <ListItemText primary="External Recruitment Link" />
                                        </CopyToClipboard>
                                      </ListItem>
                                      <ListItem>
                                        <ListItemText primary="Interview Schedule" />
                                      </ListItem>
                                      <ListItem button>
                                        <ListItemText
                                          primary="Email Template"
                                          onClick={() => {

                                            getEmailDetailLayout(
                                              recruitmentData.recruitmentid
                                            );
                                          }}
                                        />
                                      </ListItem>
                                    </List>
                                  </Box>
                                </Popover>
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
              </Box>
            </>
          )}
        </>
      )}

      {/* Email Layout */}
      <Dialog
        open={openEmail}
        onClose={handleCloseEmail}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        sx={{ marginTop: "50px" }}
      >
        <DialogContent sx={{ minWidth: "750px", padding: "20px" }}>
          <Typography sx={userStyle.HeaderText}> Email Template</Typography>
          <br />
          <Grid container spacing={2}>
            <Grid item md={12} xs={12} sm={12}>
              {/* {convertToNumberedList(checking)} */}
              <Typography
                variant="body2"
                sx={{
                  fontSize: "16px",
                  lineHeight: "27px",
                  fontFamily: "FiraSansRegular !important",
                  letterSpacing: "0.5px",
                  overflow: "hidden",
                  // textOverflow: 'ellipsis',
                  wordWrap: "break-word",
                  // display: '-webkit-box',
                  // WebkitBoxOrient: 'vertical',
                }}
                dangerouslySetInnerHTML={{
                  __html: checking,
                }}
              ></Typography>
            </Grid>
          </Grid>
          <br /> <br />
          <br />
          <Grid
            container
            spacing={2}
            sx={{ display: "flex", justifyContent: "right" }}
          >
            <Button onClick={handleCloseEmail} sx={buttonStyles.btncancel}>
              {" "}
              Close{" "}
            </Button>
          </Grid>
        </DialogContent>
      </Dialog>

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
          <Button variant="contained" color="error" onClick={handleCloseerr} sx={buttonStyles.buttonsubmit}>
            ok
          </Button>
        </DialogActions>
      </Dialog>

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
      {/* PRINT PDF EXCEL CSV */}
      <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={filteredData ?? []}
        itemsTwo={items ?? []}
        filename={fileName}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Job Opening Info"
        addedby={updateDetails.addedby}
        updateby={updateDetails.updatedby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={openDelete}
        onClose={handleCloseDelete}
        onConfirm={deleteJob}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />

      {/* EXTERNAL COMPONENTS -------------- END */}

      <JobClosingList />
    </Box>
  );
}

export default JobopeningList;
