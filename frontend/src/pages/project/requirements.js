import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, Dialog, TableRow, IconButton, TableCell, DialogContent, OutlinedInput, DialogActions, Grid, Select, MenuItem, FormControl, Paper, Table, TableHead, TableContainer, Button, TableBody } from "@mui/material";
import { userStyle } from "../../pageStyle";
import { FaPrint, FaFilePdf, FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { ExportXL, ExportCSV } from "../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import { SERVICE } from "../../services/Baseservice";
import { handleApiError } from "../../components/Errorhandling";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import CloseIcon from '@mui/icons-material/Close';

import { Link } from "react-router-dom";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import PageHeading from "../../components/PageHeading";
// import Taskeditmodel from "./taskeditmodel";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import LastPageIcon from "@mui/icons-material/LastPage";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';
import { saveAs } from "file-saver";

function Submodulelistview() {
  const { isUserRoleCompare,  pageName,setPageName } = useContext(UserRoleAccessContext);

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);

  const gridRef = useRef(null);

  let authToken = localStorage.APIToken;

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  // Delete model
  // Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };

  const [openview, setOpenview] = useState(false);

  const handleClickOpenview = () => {
    setOpenview(true);
  };

  const handleCloseview = () => {
    setOpenview(false);
  };

  const { auth } = useContext(AuthContext);

  const [projectModels, setProjectModels] = useState([]);
  const [submoduleEnd, setSubmoduleEnd] = useState([]);
  const [endMerge, setEndmerge] = useState([]);
  const [taskassignBoardlist, settaskassignBoardlist] = useState([]);
  const [deletePageData, setDeletePageData] = useState([]);
  const [deletePageName, setDeletePageName] = useState([]);
  const [deleteid, setSelectid] = useState("");

  const [pageModelEdit, setPageModelEdit] = useState({
    name: "",
    project: "",
    subproject: "",
    module: "",
  });

  const filteredDataend = projectModels.filter((row) => row.pageBranch === "EndPage");
  {
    filteredDataend.map((row) => <li>{row.pageBranch}</li>);
  }

  //get all role list details
  const fetchtaskassignboardlist = async () => {
    setPageName(!pageName);
    try {
      let res_sub = await axios.get(SERVICE.TASKASSIGN_BOARD_LIST_LIMITED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      settaskassignBoardlist(res_sub?.data?.taskAssignBoardList);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const rowData = async (id, name) => {
    setPageName(!pageName);
    try {
      setDeletePageName(name);
      setSelectid(id);
      if (name === "submodule") {
        let res = await axios.get(`${SERVICE.SUBMODULE_SINGLE}/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        handleClickOpen();
        setDeletePageData(res?.data?.ssubmodule);
      } else {
        let res = await axios.get(`${SERVICE.PAGEMODEL_SINGLE}/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        handleClickOpen();
        setDeletePageData(res?.data?.spagemodel);
      }
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // Alert delete popup
  let pageTypeId = deletePageData?._id;
  const delPageView = async () => {
    let ids = taskassignBoardlist.filter((task) => task.prevId == deleteid).map((item) => item._id);

    const deletePromises = ids?.map((item) => {
      return axios.delete(`${SERVICE.TASKASSIGNBOARDLIST_SINGLE}/${item}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
    });
    await Promise.all(deletePromises);
    try {
      setPageName(!pageName);
      if (deletePageName === "submodule") {
        await axios.put(`${SERVICE.SUBMODULE_SINGLE}/${pageTypeId}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          status: "not assigned",
          componentgrouping: "",
          component: "",
          subcomponent: "",
          count: "",
          subComReq: "",
          taskassignboardliststatus: "Yet to assign",
          uidesign: [],
          develop: [],
          testing: [],
          testinguidesign: [],
        });
        handleCloseMod();
        setPage(1);
      } else {
        await axios.put(`${SERVICE.PAGEMODEL_SINGLE}/${pageTypeId}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          status: "not assigned",
          componentgrouping: "",
          component: "",
          subcomponent: "",
          count: "",
          subComReq: "",
          taskassignboardliststatus: "Yet to assign",
          uidesign: [],
          develop: [],
          testing: [],
          testinguidesign: [],
        });
        handleCloseMod();
        setPage(1);
      }
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const fetchprojectModelsDropdwon = async () => {
    setPageName(!pageName);
    try {
      let res_project = await axios.get(SERVICE.PAGEMODEL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let resr = res_project.data.pagemodel.filter((a) => a.pageBranch === "EndPage");
      setProjectModels(resr);
      // setProjectModels(res_project?.data?.pagemodel);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };


  const fetchSubmodule = async () => {
    setPageName(!pageName);
    try {
      let res_submodule = await axios.get(SERVICE.SUBMODULE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let res = res_submodule?.data?.submodules?.filter((a) => a.endpage === "end");

      const res_name = res.map((t, index) => ({
        _id: t._id,
        project: t.project,
        subproject: t.subproject,
        module: t.module,
        submodule: t.name,
        page: "submodule",
        endpage: t.endpage,
        pagetype: "",
        mainpage: "---",
        subpage: "",
        subsubpage: "",
        pageBranch: "",
        endpage: t.endpage,
        status: t.status,
      }));

      setSubmoduleEnd(res_name);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const fetchmerge = () => {
    let res = [...projectModels, ...submoduleEnd];
    setEndmerge(res);
  };

  // get single row to view....
  const getviewCode = async (e, page) => {
    setPageName(!pageName);
    try {
      if (page === "submodule") {
        let res = await axios.get(`${SERVICE.SUBMODULE_SINGLE}/${e}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setPageModelEdit(res?.data?.ssubmodule);
      } else {
        let res = await axios.get(`${SERVICE.PAGEMODEL_SINGLE}/${e}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setPageModelEdit(res?.data?.spagemodel);
      }
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, 'Requirements.png');
        });
      });
    }
  };


  //  PDF
  const columns = [
    { title: "Sno", field: "serialNumber" },
    { title: "Project", field: "project" },
    { title: "Sub Project", field: "subproject" },
    { title: "Module", field: "module" },
    { title: "Sub Module", field: "submodule" },
    { title: "Page Type No", field: "pagetype" },
    { title: "Main Page", field: "mainpage" },
    { title: "Sub Page", field: "subpage" },
    { title: "Sub Sub Page", field: "name" },
    { title: "Page Branch", field: "pageBranch" },
  ];

  const downloadPdf = (isfilter) => {

    const doc = new jsPDF();

    // Initialize serial number counter
    let serialNumberCounter = 1;


    // Modify row data to include serial number
    const dataWithSerial = isfilter === "filtered" ?
      filteredData.map(row => ({ ...row, serialNumber: serialNumberCounter++ })) :
      endMerge.map(row => ({ ...row, serialNumber: serialNumberCounter++ }))


    // Generate PDF
    doc.autoTable({
      theme: "grid",
      styles: { fontSize: 5 },
      // columns: columnsWithSerial,
      columns: columns.map((col) => ({ ...col, dataKey: col.field })),
      body: dataWithSerial,
    });

    doc.save("Requirements.pdf");
  };

  // Excel
  const fileName = "Requirements";

  const [pageModelData, setPageModelData] = useState([]);

  // get particular columns for export excel
  const getexcelDatas = async () => {
    setPageName(!pageName);
    try {
      var data = items?.map((t, index) => ({
        sno: index + 1,
        project: t.project,
        subproject: t.subproject,
        module: t.module,
        submodule: t.submodule,
        pagetype: t.pagetype,
        mainpage: t.mainpage === "" ? "---" : t.mainpage,
        subpage: t.subpage === "" ? "---" : t.subpage,
        subsubpage: t.name,
        pageBranch: t.pageBranch,
        //  ...t,
      }));
      setPageModelData(data);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Requirements",
    pageStyle: "print",
  });

  useEffect(() => {
    getexcelDatas();
  }, [filteredDataend]);

  const [items, setItems] = useState([]);

  const modifiedData = endMerge.map((t, index) => ({
    // ...person,
    _id: t._id,
    sno: index + 1,
    status: t.status === "assigned" ? "Requirement assigned" : "Requirement not assigned",
    project: t.project,
    subproject: t.subproject,
    module: t.module,
    submodule: t.submodule,
    pagetype: t.pagetype === "" ? "---" : t.pagetype,
    mainpage: t.mainpage === "" ? "---" : t.mainpage,
    subpage: t.subpage === "" ? "---" : t.subpage,
    name: t.pagetypename === "SUBSUBPAGE" ? t.name : "---",
    pageBranch: t.pageBranch,
    endpage: t.endpage,
    page: t.page,
  }));

  const addSerialNumber = () => {
    const itemsWithSerialNumber = modifiedData?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [modifiedData]);

  useEffect(() => {
    fetchprojectModelsDropdwon();
    fetchSubmodule();
    fetchmerge();
  }, [submoduleEnd, projectModels]);

  useEffect(() => {
    fetchtaskassignboardlist();
  }, []);

  //table sorting
  const [sorting, setSorting] = useState({ column: "", direction: "" });

  const handleSorting = (column) => {
    const direction = sorting.column === column && sorting.direction === "asc" ? "desc" : "asc";
    setSorting({ column, direction });
  };

  items?.sort((a, b) => {
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
              <ArrowDropUpOutlinedIcon style={{ color: "black", fontSize: "1.6rem" }} />
            </Grid>
            <Grid sx={{ height: "6px" }}>
              <ArrowDropDownOutlinedIcon style={{ color: "#bbb6b6", fontSize: "1.6rem" }} />
            </Grid>
          </Box>
        </>
      );
    } else {
      return (
        <>
          <Box>
            <Grid sx={{ height: "6px" }}>
              <ArrowDropUpOutlinedIcon style={{ color: "#bbb6b6", fontSize: "1.6rem" }} />
            </Grid>
            <Grid sx={{ height: "6px" }}>
              <ArrowDropDownOutlinedIcon style={{ color: "black", fontSize: "1.6rem" }} />
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
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  // Split the search query into individual terms
  const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchOverTerms.every((term) => Object.values(item)?.join(" ")?.toLowerCase()?.includes(term));
  });

  const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredDatas?.length / pageSize);
  const visiblePages = Math.min(totalPages, 3);
  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);
  const pageNumbers = [];
  const indexOfLastItem = page * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }


  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };


  const [fileFormat, setFormat] = useState('')
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = fileFormat === "xl" ? '.xlsx' : '.csv';
  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }


  const handleExportXL = (isfilter) => {
    if (isfilter === "filtered") {
      exportToCSV(
        filteredData?.map((t, index) => ({
          sno: index + 1,
          project: t.project,
          subproject: t.subproject,
          module: t.module,
          submodule: t.submodule,
          pagetype: t.pagetype,
          mainpage: t.mainpage === "" ? "---" : t.mainpage,
          subpage: t.subpage === "" ? "---" : t.subpage,
          subsubpage: t.name,
          pageBranch: t.page == "pageBranch" ? t.name : t.pageBranch,
        })),
        fileName,
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        endMerge.map((t, index) => ({
          sno: index + 1,
          project: t.project,
          subproject: t.subproject,
          module: t.module,
          submodule: t.submodule,
          pagetype: t.pagetype,
          mainpage: t.mainpage === "" ? "---" : t.mainpage,
          subpage: t.subpage === "" ? "---" : t.subpage,
          subsubpage: t.name,
          pageBranch: t.page == "pageBranch" ? t.name : t.pageBranch,
        })),
        fileName,
      );

    }

    setIsFilterOpen(false)
  };


  return (
    <Box>
      <Headtitle title={"Requirements"} />

      {/* ****** Header Content ****** */}
      <PageHeading
        title="Requirements"
        modulename="Projects"
        submodulename="Sub Module"
        mainpagename="Requirements"
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("lrequirements") && (
        <>
          {/* <Typography sx={userStyle.HeaderText}>Requirements</Typography> */}
          <br />
          <Box sx={userStyle.container}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.SubHeaderText}>Requirements</Typography>
              </Grid>
            </Grid>
            <br />
            <br />
            {/* {isSubpagefive ?  */}
            <>
              <Grid container sx={{ justifyContent: "center" }}>
                <Grid>
                  {isUserRoleCompare?.includes("excelrequirements") && (
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        fetchmerge()
                        setFormat("xl")
                      }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvrequirements") && (
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        fetchmerge()
                        setFormat("csv")
                      }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("printrequirements") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("irequirements") && (
                    <>
                      <Button sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true)
                          fetchmerge()
                        }}
                      ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                    </>
                  )}
                  {/* {isUserRoleCompare?.includes("imagesubmodulelistview") && ( */}
                  <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>
                  {/* )} */}
                </Grid>
              </Grid>
              <br />

              <Grid style={userStyle.dataTablestyle}>
                <Box>
                  <label>Show entries:</label>
                  <Select id="pageSizeSelect" value={pageSize} onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                    {/* <MenuItem value={modifiedData?.length}>All</MenuItem> */}
                  </Select>
                </Box>
                <Box>
                  <FormControl fullWidth size="small">
                    <Typography>Search</Typography>
                    <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
                  </FormControl>
                </Box>
              </Grid>
              {/* ****** Table start ****** */}
              <TableContainer component={Paper} ref={gridRef}>
                <Table aria-label="simple table" id="branch">
                  <TableHead sx={{ fontWeight: "600" }}>
                    <StyledTableRow>
                      <StyledTableCell onClick={() => handleSorting("serialnumber")}>
                        <Box sx={userStyle.tableheadstyle}>
                          <Box>SNo</Box>
                          <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("serialnumber")}</Box>
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell onClick={() => handleSorting("project")}>
                        <Box sx={userStyle.tableheadstyle}>
                          <Box>Project</Box>
                          <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("project")}</Box>
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell onClick={() => handleSorting("subproject")}>
                        <Box sx={userStyle.tableheadstyle}>
                          <Box>Sub Project</Box>
                          <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("subproject")}</Box>
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell onClick={() => handleSorting("module")}>
                        <Box sx={userStyle.tableheadstyle}>
                          <Box>Module</Box>
                          <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("module")}</Box>
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell onClick={() => handleSorting("submodule")}>
                        <Box sx={userStyle.tableheadstyle}>
                          <Box>Sub Module</Box>
                          <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("submodule")}</Box>
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell onClick={() => handleSorting("pagetype")}>
                        <Box sx={userStyle.tableheadstyle}>
                          <Box>Page Type No</Box>
                          <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("pagetype")}</Box>
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell onClick={() => handleSorting("mainpage")}>
                        <Box sx={userStyle.tableheadstyle}>
                          <Box>Main Page</Box>
                          <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("mainpage")}</Box>
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell onClick={() => handleSorting("subpage")}>
                        <Box sx={userStyle.tableheadstyle}>
                          <Box>Sub Page</Box>
                          <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("subpage")}</Box>
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell onClick={() => handleSorting("name")}>
                        <Box sx={userStyle.tableheadstyle}>
                          <Box>Sub Sub Page</Box>
                          <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("name")}</Box>
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell onClick={() => handleSorting("pageBranch")}>
                        <Box sx={userStyle.tableheadstyle}>
                          <Box>Page Branch</Box>
                          <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("pageBranch")}</Box>
                        </Box>
                      </StyledTableCell>
                      {/* <StyledTableCell onClick={() => handleSorting('endpage')}><Box sx={userStyle.tableheadstyle}><Box>Submodule Endpage</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('endpage')}</Box></Box></StyledTableCell> */}
                      <StyledTableCell onClick={() => handleSorting("status")}>
                        <Box sx={userStyle.tableheadstyle}>
                          <Box>Alloted Status</Box>
                          <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("status")}</Box>
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell>Action</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody align="left">
                    {filteredData?.length > 0 ? (
                      filteredData?.map((row, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell>{row.serialNumber}</StyledTableCell>
                          <StyledTableCell>{row.project}</StyledTableCell>
                          <StyledTableCell>{row.subproject}</StyledTableCell>
                          <StyledTableCell>{row.module}</StyledTableCell>
                          <StyledTableCell>{row.submodule}</StyledTableCell>
                          <StyledTableCell>{row.pagetype}</StyledTableCell>
                          <StyledTableCell>{row.mainpage}</StyledTableCell>
                          <StyledTableCell>{row.subpage}</StyledTableCell>
                          <StyledTableCell>{row.name}</StyledTableCell>
                          <StyledTableCell>{row.page == "pageBranch" ? row.name : row.pageBranch}</StyledTableCell>
                          <StyledTableCell>
                            <Typography
                              style={{
                                background: row.status === "Requirement assigned" ? "#34a034ed" : "#f82c2ceb",
                                width: "max-content",
                                borderRadius: "14px",
                                color: "white",
                                padding: "0px 5px",
                                textAlign: "center",
                              }}
                              variant="subtitle2"
                            >
                              {row.status}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell component="th" scope="row" colSpan={1}>
                            <Grid sx={{ display: "flex" }}>
                              {row.status === "Requirement assigned" ? (
                                <>
                                  <Link to={`/project/pagemodelfetchEdit/${row._id}`}>
                                    <Button
                                      sx={userStyle.buttonedit}
                                      onClick={() => {
                                        // handleClickOpenEdit();
                                        // getCode(row._id);
                                      }}
                                    >
                                      <FaEdit style={{ fontsize: "large" }} />
                                    </Button>
                                  </Link>
                                  <Button
                                    sx={userStyle.buttondelete}
                                    onClick={(e) => {
                                      rowData(row._id, row.page);
                                    }}
                                  >
                                    <FaTrash style={{ fontsize: "large" }} />
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Link to={`/project/pagemodelfetch/${row._id}`}>
                                    <div
                                      style={{
                                        fontSize: "20px",
                                        color: "#1976d2",
                                      }}
                                    >
                                      <AddCircleOutlineIcon />
                                    </div>
                                  </Link>

                                  {/* <Button
                                    sx={userStyle.buttonedit}
                                    onClick={() => {
                                      handleClickOpenview();
                                      getviewCode(row._id);
                                    }}
                                  >
                                    <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
                                  </Button> */}
                                </>
                              )}
                            </Grid>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))
                    ) : (
                      <StyledTableRow>
                        {" "}
                        <StyledTableCell colSpan={15} align="center">
                          No Data Available
                        </StyledTableCell>{" "}
                      </StyledTableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box style={userStyle.dataTablestyle}>
                <Box>
                  Showing {filteredData?.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filteredDatas?.length)} of {filteredDatas?.length} entries
                </Box>
                <Box>
                  <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                    <FirstPageIcon />
                  </Button>
                  <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                    <NavigateBeforeIcon />
                  </Button>
                  {pageNumbers?.map((pageNumber) => (
                    <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={page === pageNumber ? "active" : ""} disabled={page === pageNumber}>
                      {pageNumber}
                    </Button>
                  ))}
                  {lastVisiblePage < totalPages && <span>...</span>}
                  <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                    <NavigateNextIcon />
                  </Button>
                  <Button onClick={() => setPage(totalPages)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                    <LastPageIcon />
                  </Button>
                </Box>
              </Box>
            </>{" "}
            :{" "}
            <>
              {/* <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
                    </Box> */}
            </>
            {/* } */}
          </Box>
          <Box>
            <Dialog
              // open={isErrorOpen}
              // onClose={handleCloseerr}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogContent
                sx={{
                  width: "350px",
                  textAlign: "center",
                  alignItems: "center",
                }}
              >
                {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
                <Typography variant="h6"></Typography>
              </DialogContent>
              <DialogActions>
                <Button variant="contained" color="error">
                  ok
                </Button>
              </DialogActions>
            </Dialog>
          </Box>

          {/* print layout */}
          <Box sx={userStyle.printcls}>
            <Table aria-label="simple table" id="branch" ref={componentRef}>
              <TableHead sx={{ fontWeight: "600" }}>
                <TableRow>
                  <TableCell>SNo</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Sub Project</TableCell>
                  <TableCell>Module</TableCell>
                  <TableCell>Sub Module</TableCell>
                  <TableCell>Page Type No</TableCell>
                  <TableCell>Main Page</TableCell>
                  <TableCell>Sub Page</TableCell>
                  <TableCell>Sub Sub Page</TableCell>
                  <TableCell>Page Branch</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData &&
                  filteredData.map((row, index) => (
                    <>
                      <TableRow key={index}>
                        <StyledTableCell>{row.serialNumber}</StyledTableCell>
                        <StyledTableCell>
                          {row.page == "project" ? row.name : row.project}
                        </StyledTableCell>
                        <StyledTableCell>
                          {row.page == "subproject" ? row.name : row.subproject}
                        </StyledTableCell>
                        <StyledTableCell>
                          {row.page == "module" ? row.name : row.module}
                        </StyledTableCell>
                        <StyledTableCell>
                          {row.page == "submodule" ? row.name : row.submodule}
                        </StyledTableCell>
                        <StyledTableCell>
                          {row.page == "pagetype" ? row.name : row.pagetypename}
                        </StyledTableCell>
                        <StyledTableCell>
                          {row.page == "mainpage" ? row.name : row.mainpage}
                        </StyledTableCell>
                        <StyledTableCell>
                          {row.page == "subpage" ? row.name : row.subpage}
                        </StyledTableCell>
                        <StyledTableCell>
                          {row.page == "name" ? row.name : row.name}
                        </StyledTableCell>
                        <StyledTableCell>
                          {row.pageBranch == "pageBranch"
                            ? row.name
                            : row.pageBranch}
                        </StyledTableCell>
                      </TableRow>
                    </>
                  ))}
              </TableBody>
            </Table>
          </Box>
          {/* Delete Modal */}
          <Box>
            {/* ALERT DIALOG */}
            <Dialog open={isDeleteOpen} onClose={handleCloseMod} aria-labelledby="alert-dialog-titleDELETE" aria-describedby="alert-dialog-description">
              <DialogContent
                style={{
                  width: "350px",
                  textAlign: "center",
                  alignItems: "center",
                }}
              >
                <ErrorOutlineOutlinedIcon style={{ fontSize: "80px", color: "orange" }} />
                <Typography variant="h5" style={{ color: "red", textAlign: "center" }}>
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
                <Button autoFocus variant="contained" color="error" onClick={(e) => delPageView(pageTypeId)}>
                  {" "}
                  OK{" "}
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
          {/* ALERT DIALOG */}
          <Box>
            <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
              <DialogContent
                sx={{
                  width: "350px",
                  textAlign: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">{showAlert}</Typography>
              </DialogContent>
              <DialogActions>
                <Button variant="contained" color="error" onClick={handleCloseerr}>
                  ok
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
          <Dialog open={isFilterOpen} onClose={handleCloseFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>

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

              {fileFormat === 'xl' ?
                <FaFileExcel style={{ fontSize: "70px", color: "green" }} />
                : <FaFileCsv style={{ fontSize: "70px", color: "green" }} />
              }
              <Typography variant="h5" sx={{ textAlign: "center" }}>
                Choose Export
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                autoFocus variant="contained"
                onClick={(e) => {
                  handleExportXL("filtered")
                }}
              >
                Export Filtered Data
              </Button>
              <Button autoFocus variant="contained"
                onClick={(e) => {
                  handleExportXL("overall")
                  fetchmerge()
                }}
              >
                Export Over All Data
              </Button>
            </DialogActions>
          </Dialog>
          {/*Export pdf Data  */}
          <Dialog open={isPdfFilterOpen} onClose={handleClosePdfFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
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
                  downloadPdf("filtered")
                  setIsPdfFilterOpen(false);
                }}
              >
                Export Filtered Data
              </Button>
              <Button variant="contained"
                onClick={(e) => {
                  downloadPdf("overall")
                  setIsPdfFilterOpen(false);
                }}
              >
                Export Over All Data
              </Button>
            </DialogActions>
          </Dialog>






        </>
      )}
    </Box>
  );
}

export default Submodulelistview;