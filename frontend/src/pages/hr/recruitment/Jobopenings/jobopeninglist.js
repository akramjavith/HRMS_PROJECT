import React, { useState, useEffect, useRef, useContext } from "react";
import {
  ListItem,
  List,
  ListItemText,
  Popover,
  Box,
  Typography,
  OutlinedInput,
  TableBody,
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
import { userStyle } from "../../../../pageStyle";
import { handleApiError } from "../../../../components/Errorhandling";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { MultiSelect } from "react-multi-select-component";
import { ExportXL, ExportCSV } from "../../../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import { UserRoleAccessContext } from "../../../../context/Appcontext";
import { AuthContext } from "../../../../context/Appcontext";
import Headtitle from "../../../../components/Headtitle";
import PageHeading from "../../../../components/PageHeading";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { Link } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import JobClosingList from "./jobclosedlist";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { BASE_URL } from "../../../../services/Authservice";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import { saveAs } from "file-saver";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import AddIcon from "@mui/icons-material/Add";
import AssessmentIcon from "@mui/icons-material/Assessment";

function JobopeningList() {
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
        filteredData?.map((row, index) => {
          return {
            "S.No": index + 1,
            Company: row.company,
            Branch: row.branch,
            Floor: row.floor,
            "Job Opening Id": row.joboopenid,
            "Recruitment Name": row.recruitmentname,
            "Opening Date": row.dateopened,
            "Closing Date": row.targetdate,
            Status: row.status,
          };
        }),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        items?.map((row, index) => ({
          "S.No": index + 1,
          Company: row.company,
          Branch: row.branch,
          Floor: row.floor,
          "Job Opening Id": row.joboopenid,
          "Recruitment Name": row.recruitmentname,
          "Opening Date": row.dateopened,
          "Closing Date": row.targetdate,
          Status: row.status,
        })),
        fileName
      );
    }

    setIsFilterOpen(false);
  };

  const columns = [
    { title: "Company", field: "company" },
    { title: "Branch", field: "branch" },
    { title: "Floor", field: "floor" },
    { title: "Job Opening Id", field: "jobopeningid" },
    { title: "Recruitment Name", field: "recruitmentname" },
    { title: "Opening Date", field: "openingdate" },
    { title: "Closing Date", field: "closingdate" },
    { title: "Status", field: "status" },
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
        ? filteredData.map((row, index) => ({
            serialNumber: index + 1,
            company: row.company,
            branch: row.branch,
            floor: row.floor,
            jobopeningid: row.joboopenid,
            recruitmentname: row.recruitmentname,
            openingdate: row.dateopened,
            closingdate: row.targetdate,
            status: row.status,
          }))
        : items?.map((row, index) => ({
            serialNumber: index + 1,
            company: row.company,
            branch: row.branch,
            floor: row.floor,
            jobopeningid: row.joboopenid,
            recruitmentname: row.recruitmentname,
            openingdate: row.dateopened,
            closingdate: row.targetdate,
            status: row.status,
          }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: "5" },
    });

    doc.save("Jobopening.pdf");
  };

  // Excel

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
  const { isUserRoleCompare, isAssignBranch, pageName, setPageName } =
    useContext(UserRoleAccessContext);
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchCompanyDropdowns = () => {
    setPageName(!pageName);
    try {
      setCompanys(
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

  const fetchBranchDropdowns = (e) => {
    let ans = e ? e.map((data) => data.value) : [];
    setPageName(!pageName);
    try {
      setBranchs(
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

  useEffect(() => {
    fetchCompanyDropdowns();
    fetchDesignationDropdowns();
    window.scrollTo(0, 0);
  }, []);

  const fetchFilteredData = async () => {
    setPageName(!pageName);
    try {
      if (selectedOptionsCom?.length === 0) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Select Company"}
            </p>
          </>
        );
        handleClickOpenerr();
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const deleteJob = async (id) => {
    setPageName(!pageName);
    try {
      await axios.delete(`${SERVICE.JOBOPENING_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      handleCloseDelete();
      await fetchAllApproveds();
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

  const handleClearFilter = async (e) => {
    e.preventDefault();
    fetchAllApproveds();
    setValueBran([]);
    setBranchs([]);
    setSelectedOptionsCom([]);
    setSelectedOptionsBran([]);
    setSelectedOptionsDesig([]);
    await fetchAllApproveds();
    setShowAlert(
      <>
        <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>
          {"Cleared Successfully👍"}
        </p>
      </>
    );
    handleClickOpenerr();
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
                          {" "}
                          <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                          &ensp;Image&ensp;{" "}
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
                    >
                      Filter
                    </Button>
                  </Grid>
                  <Grid item md={2} xs={12} sm={12} marginTop={3}>
                    <Button
                      onClick={handleClearFilter}
                      sx={userStyle.btncancel}
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
                      <MenuItem value={jobOpening?.length}>All</MenuItem>
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
                                        style={{ fontsize: "large" }}
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
                                      style={{ fontSize: "20px" }}
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
                                          style={{ fontSize: "20px" }}
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
                                      handleClickOpeninfo();
                                      getinfoCode(row._id);
                                    }}
                                  >
                                    <InfoOutlinedIcon
                                      style={{ fontsize: "large" }}
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
                                            handleClickOpenEmail();
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
              <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table
                  sx={{ minWidth: 700 }}
                  aria-label="customized table"
                  id="jobopening"
                  ref={componentRef}
                >
                  <TableHead sx={{ fontWeight: "600" }}>
                    <StyledTableRow>
                      <StyledTableCell>SNo</StyledTableCell>
                      <StyledTableCell>Company</StyledTableCell>
                      <StyledTableCell>Branch</StyledTableCell>
                      <StyledTableCell>Floor</StyledTableCell>
                      <StyledTableCell>Job opening Id</StyledTableCell>
                      <StyledTableCell>Recruitment Name</StyledTableCell>
                      <StyledTableCell>Oppening Date</StyledTableCell>
                      <StyledTableCell>Closing Date</StyledTableCell>
                      <StyledTableCell>Status</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody align="left">
                    {filteredData?.length > 0 ? (
                      filteredData?.map((row, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell>{row.serialNumber}</StyledTableCell>
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
                    <StyledTableRow></StyledTableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </>
      )}

      <Dialog
        open={openInfo}
        onClose={handleCloseinfo}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>Job Opening Info</Typography>
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
                      {updateDetails.addedby?.map((item, i) => (
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
                      {updateDetails?.updatedby?.map((item, i) => (
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

      {/* Email Layout */}
      <Dialog
        open={openEmail}
        onClose={handleCloseEmail}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
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
            <Button sx={userStyle.btncancel} onClick={handleCloseEmail}>
              {" "}
              Close{" "}
            </Button>
          </Grid>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
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
          <Button onClick={handleCloseDelete} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={(e) => deleteJob(rowId)}
            autoFocus
            variant="contained"
            color="error"
          >
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
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
          <Button variant="contained" color="error" onClick={handleCloseerr}>
            ok
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
      <br />
      <br />
      <JobClosingList />
    </Box>
  );
}

export default JobopeningList;
