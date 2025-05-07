import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LastPageIcon from "@mui/icons-material/LastPage";
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
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Typography,
} from "@mui/material";
import axios from "axios";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../../../components/Errorhandling";
import PageHeading from "../../../../components/PageHeading";
import { StyledTableCell, StyledTableRow } from "../../../../components/Table";
import {
  AuthContext,
  UserRoleAccessContext,
} from "../../../../context/Appcontext";
import { userStyle } from "../../../../pageStyle";
import { SERVICE } from "../../../../services/Baseservice";

import { FaFileCsv, FaFileExcel } from "react-icons/fa";

import AlertDialog from "../../../../components/Alert";
import { DeleteConfirmation } from "../../../../components/DeleteConfirmation.js";
import ExportData from "../../../../components/ExportData";
import InfoPopup from "../../../../components/InfoPopup.js";
import MessageAlert from "../../../../components/MessageAlert";

function JobClosingList() {
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

  const gridRef = useRef(null);

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
      link.download = "ClosedJobopening.png";
      link.click();
    });
  };

  const [jobClosing, setJobClosing] = useState([]);
  const [queueCheck, setQueueCheck] = useState(false);

  const { isUserRoleCompare, isAssignBranch, isUserRoleAccess, buttonStyles } =
    useContext(UserRoleAccessContext);

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
  const { auth } = useContext(AuthContext);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [openInfo, setOpeninfo] = useState(false);
  const [items, setItems] = useState([]);
  const [sorting, setSorting] = useState({ column: "", direction: "" });
  const [searchQuery, setSearchQuery] = useState("");
  //delete model
  const [openDelete, setOpenDelete] = useState(false);
  const handleClickOpen = () => {
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };
  const [rowId, setRowId] = useState("");

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
  }, []);

  const fetchFilteredDatas = async () => {
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
          return data.status == "closed";
        });

        const finaldata = filterValue.filter((data, index) => {
          accessbranch.forEach((d, i) => {
            if (d.company === data.company && d.branch === data.branch) {
              resans.push(data);
            }
          });
        });
        setJobClosing(resans);
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

  //get all project.
  const fetchAllApproveds = async () => {
    let resans = [];
    try {
      let res_queue = await axios.get(SERVICE.ALLJOBOPENINGS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let filterValue = res_queue?.data?.jobopenings.filter((data, i) => {
        return data.status == "closed";
      });

      const finaldata = filterValue.filter((data, index) => {
        accessbranch.forEach((d, i) => {
          if (d.company === data.company && d.branch === data.branch) {
            resans.push(data);
          }
        });
      });
      setJobClosing(resans);
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

  const deleteJob = async () => {
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

  const handleCloseinfo = () => {
    setOpeninfo(false);
  };
  let snos = 1;
  // this is the etimation concadination value
  const modifiedData = jobClosing?.map((person) => ({
    ...person,
    sino: snos++,
  }));

  // Excel
  const fileName = "ClosedJobopening";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "JobClosed",
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

  const indexOfLastItem = page * pageSize;

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

  const [updateDetails, setUpDateDetails] = useState({});
  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.JOBOPENING_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setUpDateDetails(res.data.sjobopening);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const rowData = async (e) => {
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
  return (
    <Box>
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Closed Job Opening List"
        modulename="Human Resources"
        submodulename="Recruitment"
        mainpagename="Job Openings"
        subpagename=""
        subsubpagename=""
      />
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
                    Closed Job Opening List
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
                      onClick={() => fetchFilteredDatas()}
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
                      {/* <MenuItem value={jobClosing?.length}>All</MenuItem> */}
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
                                  "djobopenings"
                                ) && (
                                    <>
                                      <Button
                                        sx={userStyle.buttondelete}
                                        onClick={(e) => {
                                          rowData(row._id, row.username);
                                        }}
                                      >
                                        <DeleteIcon
                                          onClick={() => {
                                            rowData(row._id);
                                            setRowId(row._id);
                                            handleClickOpen();
                                          }}
                                          sx={buttonStyles.buttondelete}
                                        />
                                      </Button>
                                    </>
                                  )}
                                {isUserRoleCompare?.includes(
                                  "vjobopenings"
                                ) && (
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
                                        sx={buttonStyles.buttoninfo}
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
      <Dialog
        open={openInfo}
        onClose={handleCloseinfo}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>Job Closed Info</Typography>
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
              <Button variant="contained" onClick={handleCloseinfo} sx={buttonStyles.btncancel}>
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
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
          <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={handleCloseerr}>
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
        heading="Job Closed Info"
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
    </Box>
  );
}

export default JobClosingList;
