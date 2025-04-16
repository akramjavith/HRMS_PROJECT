import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, TextField, TableBody, TextareaAutosize, TableRow, TableCell, Select, Paper, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button } from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import { FaPrint, FaFilePdf, FaTrash, FaPlus } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Selects, { components } from "react-select";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { makeStyles } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import { UserRoleAccessContext } from '../../../context/Appcontext';
import { AuthContext } from '../../../context/Appcontext';
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from 'react-loader-spinner'
import CircularProgress, { circularProgressClasses, } from '@mui/material/CircularProgress';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import { MultiSelect } from "react-multi-select-component";
import pdfIcon from "../../../components/Assets/pdf-icon.png";
import wordIcon from "../../../components/Assets/word-icon.png";
import excelIcon from "../../../components/Assets/excel-icon.png";
import csvIcon from "../../../components/Assets/CSV.png";
import fileIcon from "../../../components/Assets/file-icons.png";
// import moment from "moment-timezone";
import autoTable from 'jspdf-autotable';

const useStyles = makeStyles((theme) => ({
  inputs: {
    display: "none",
  },
  preview: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: theme.spacing(2),
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

function FacebookCircularProgress(props) {
  return (
    <Box sx={{ position: 'relative' }}>
      <CircularProgress
        variant="determinate"
        sx={{
          color: (theme) =>
            theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
        }}
        size={40}
        thickness={4}
        {...props}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        sx={{
          color: (theme) => (theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'),
          animationDuration: '550ms',
          position: 'absolute',
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: 'round',
          },
        }}
        size={40}
        thickness={4}
        {...props}
      />
    </Box>
  );
}


function ExitdetailList() {

  const [jobOpening, setJobOpening] = useState([]);
  const [jobOpeningEdit, setJobOpeningEdit] = useState({});
  const { isUserRoleCompare, allProjects, isUserRoleAccess } = useContext(UserRoleAccessContext);
  const { auth, setAuth } = useContext(AuthContext);
  const [isEditOpen, setIsEditOpen] = useState(false);
  //Datatable
  const [queueCheck, setQueueCheck] = useState(false);
  const [queueCheckedit, setQueueCheckedit] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [openInfo, setOpeninfo] = useState(false);
  const [queueData, setQueueData] = useState([]);
  const [items, setItems] = useState([]);
  const [sorting, setSorting] = useState({ column: '', direction: '' });
  const [searchQuery, setSearchQuery] = useState("");
  const [addExistlist, setAddexistall] = useState([]);
  const [addExistEdit, setAddExitsEdit] = useState({ name: "", interviewername: "", reasonleavingname: "", workingagainname: "", mostorganisation: "", think: "", anything: "", companyvechile: "", allequiment: "", exitinterview: "", resignation: "", security: "", noticeperiod: "", managesupervisor: "" });
  const [selectedempname, setSelectedempname] = useState('Please Select Empolyeename');
  const [interviewer, setInterviewer] = useState({ username: "" });
  const [empCode, setEmpCode] = useState(false)
  const [leavingfetch, setleavingfetch] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [selectedempcode, setSelectedempcode] = useState('Please Select Empolyeecode');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [leaving, setLeaving] = useState({ name: "" });
  const [working, setWorking] = useState({ workingname: "" });
  const [workingfetch, setWorkingfetch] = useState([]);
  const [empName, setEmpName] = useState(false)
  const [deleteAddexists, setDeleteAddexists] = useState({});
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);




  //get all project.

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

  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  const username = isUserRoleAccess.username
  const userData = {
    name: username,
    date: new Date(),
  };

  let today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + "-" + mm + "-" + dd;


  const classes = useStyles();

  //Project updateby edit page...
  let updateby = addExistEdit.updatedby;
  let addedby = addExistEdit.addedby;


  let authToken = localStorage.APIToken;

  // let snos = 1;
  // this is the etimation concadination value
  const modifiedData = addExistlist?.map((person) => ({
    ...person,
    // sino: snos++
  }));

  const handleUserNameChange = (e) => {
    const selectedempcode = e.value;
    setSelectedempname(selectedempcode);
    setSelectedempcode(e.empcode)
    setEmpCode(true)
  };

  //Edit model...
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
  };



  //   overall view data
  const [openview, setOpenview] = useState(false);
  // view model
  const handleClickOpenview = () => {
    setOpenview(true);
  };

  const handleCloseview = () => {
    setOpenview(false);
  };


  const [openviewReason, setOpenviewReason] = useState(false);
  const [openviewwork, setOpenviewwork] = useState(false);

  // design view on reason
  const handleClickOpenviewReason = () => {
    setOpenviewReason(true);
  };

  const handleCloseviewReason = () => {
    setOpenviewReason(false);
  };

  // design view of work
  const handleClickOpenviewwork = () => {
    setOpenviewwork(true);
  };

  const handleCloseviewwork = () => {
    setOpenviewwork(false);
  };

  //Delete model
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };


  //get single row to edit....
  const getCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.ADDEXISTSALL_SINGLE}/${e}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }

      });
      setAddExitsEdit(res?.data?.saddexistsall);
      setSelectedFiles(res?.data?.saddexistsall?.files);
      //   setAddexistall(res?.data?.saddexistsall);
      setQueueCheckedit(true);
      setSelectedempname(res.data.saddexistsall.empname)
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };


  //set function to get particular row
  const rowData = async (id, name) => {
    try {
      let res = await axios.get(`${SERVICE.ADDEXISTSALL_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      setDeleteAddexists(res?.data?.saddexistsall);
      handleClickOpen();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  // Alert delete popup
  let projectid = deleteAddexists._id;
  const delProject = async () => {
    try {
      await axios.delete(`${SERVICE.ADDEXISTSALL_SINGLE}/${projectid}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      //   await fetchAllProject();
      handleCloseMod();
      setPage(1);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };



  // get single row to view....
  const getviewCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.ADDEXISTSALL_SINGLE}/${e}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      setAddExitsEdit(res?.data?.saddexistsall);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.ADDEXISTSALL_SINGLE}/${e}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      setAddExitsEdit(res?.data?.saddexistsall);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };



  const handleInputChange = (event) => {
    const files = event.target.files;
    let newSelectedFiles = [...selectedFiles];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = () => {
        newSelectedFiles.push({
          name: file.name,
          size: file.size,
          type: file.type,
          preview: reader.result,
          base64: reader.result.split(",")[1],
        });
        setSelectedFiles(newSelectedFiles);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteFile = (index) => {
    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles.splice(index, 1);
    setSelectedFiles(newSelectedFiles);
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop();
    switch (extension) {
      case "pdf":
        return pdfIcon;
      case "doc":
      case "docx":
        return wordIcon;
      case "xls":
      case "xlsx":
        return excelIcon;
      case "csv":
        return csvIcon;
      default:
        return fileIcon;
    }
  };

  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  //add function
  const sendRequestReason = async () => {
    try {
      let projectscreate = await axios.post(SERVICE.REASON_CREATE, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        name: String(leaving.name),
        addedby: [

          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      setLeaving(projectscreate.data)

    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //add function
  const sendRequestWork = async () => {
    try {
      let projectscreate = await axios.post(SERVICE.ORGANISATION_CREATE, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        workingname: String(working.workingname),
        addedby: [

          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      setWorking(projectscreate.data)

    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };



  //submit option for saving
  const handleSubmitReason = (e) => {
    e.preventDefault();
    // const isNameMatch = projects.some(item => item.name.toLowerCase() === (project.name).toLowerCase());
    if (leaving.name === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Project Name"}
          </p>
        </>
      );
      handleClickOpenerr();
    }



    else {
      sendRequestReason();
    }
  };

  //submit option for saving
  const handleSubmitWork = (e) => {
    e.preventDefault();
    // const isNameMatch = projects.some(item => item.name.toLowerCase() === (project.name).toLowerCase());
    if (working.workingname === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Project Name"}
          </p>
        </>
      );
      handleClickOpenerr();
    }

    else {
      sendRequestWork();
    }
  };


  //get all modules.
  const fetchAllAddexits = async () => {
    try {
      let res = await axios.get(SERVICE.ADDEXISTSALL, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      setQueueCheck(true);
      setAddexistall(res?.data?.addexistsall);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  let exitsid = addExistEdit._id;

  //add function...
  const sendEditRequest = async () => {
    try {
      let addexi = await axios.put(`${SERVICE.ADDEXISTSALL_SINGLE}/${exitsid}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        // empid: String(selectedempcode),
        empname: String(selectedempname),
        interviewername: String(addExistEdit.interviewername),
        reasonleavingname: String(addExistEdit.reasonleavingname),
        workingagainname: String(addExistEdit.workingagainname),
        mostorganisation: String(addExistEdit.mostorganisation),
        think: String(addExistEdit.think),
        anything: String(addExistEdit.anything),
        companyvechile: String(addExistEdit.companyvechile),
        allequiment: String(addExistEdit.allequiment),
        exitinterview: String(addExistEdit.exitinterview),
        resignation: String(addExistEdit.resignation),
        security: String(addExistEdit.security),
        noticeperiod: String(addExistEdit.noticeperiod),
        // today: String(today),
        managesupervisor: String(addExistEdit.managesupervisor),
        files: [...selectedFiles],

        // name: String(empName.name),
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      setAddExitsEdit(addexi);
      // await fetchAllAddexits();
      // setQueueCheckedit(true);
      //   setPriority({ name: "" });
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Updated Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };


  const editSubmit = (e) => {
    e.preventDefault();
    // fetchAllAddexits();
    if ((empName.name) === "") {
      //   setShowAlert(
      //     <>
      //       <ErrorOutlineOutlinedIcon
      //         sx={{ fontSize: "100px", color: "orange" }}
      //       />
      //       <p style={{ fontSize: "20px", fontWeight: 900 }}>
      //         {"Please Enter Project Name"}
      //       </p>
      //     </>
      //   );
      handleClickOpenerr();
    }
    // else if (projid.estimation === "" || projid.estimationtime === "") {
    //   setShowAlert(
    //     <>
    //       <ErrorOutlineOutlinedIcon
    //         sx={{ fontSize: "100px", color: "orange" }}
    //       />
    //       <p style={{ fontSize: "20px", fontWeight: 900 }}>
    //         {"Please Enter Estimation time"}
    //       </p>
    //     </>
    //   );
    //   handleClickOpenerr();
    // } 

    // else if (isNameMatch) {
    //   setShowAlert(
    //     <>
    //       <ErrorOutlineOutlinedIcon
    //         sx={{ fontSize: "100px", color: "orange" }}
    //       />
    //       <p style={{ fontSize: "20px", fontWeight: 900 }}>
    //         {"Name already exits!"}
    //       </p>
    //     </>
    //   );
    //   handleClickOpenerr();
    // }    
    else {
      sendEditRequest();
    }
  };

  // pdf.....
  const columns = [
    { title: "Employee Name", field: "empname" },
    { title: "Separation Date", field: "today" },
    { title: "Reason for Leave", field: "reasonleavingname" },
    { title: "Think the Organizations do to improve Staff welfare", field: "think" },
    { title: "Anything you wish to share with us", field: "anything" },
    { title: "Notice period followed", field: "noticeperiod" },
  ];

  const downloadPdf = () => {
    const doc = new jsPDF();
    const columnsWithSerial = [
      // Serial number column
      { title: "SNo", dataKey: "serialNumber" },
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];
    // Add a serial number to each row
    const itemsWithSerial = items.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    doc.autoTable({
      theme: "grid",
      styles: {
        fontSize: 4,
      },
      // columns: columns?.map((col) => ({ ...col, dataKey: col.field })),
      // body: items,
      columns: columnsWithSerial,
      body: itemsWithSerial,
    });
    doc.save("Exit Details List.pdf");
  };



  // // PDF
  // const downloadPdf = () => {
  //     const doc = new jsPDF();
  //     autoTable(doc, { html: '#jobopening' });
  //     doc.save('Jobopening.pdf')
  // }
  // Excel
  const fileName = "Exit Details List";
  let excelno = 1;
  // get particular columns for export excel
  const getexcelDatas = async () => {
    try {
      let response = await axios.get(SERVICE.ADDEXISTSALL, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      var data = response.data.addexistsall.map((t, index) => ({
        "Sno": index + 1,
        "Employee Name": t.empname,
        "Separation Date": t.today,
        "Reason for Leave": t.reasonleavingname,
        "Think the Organizations do to improve Staff welfare": t.think,
        "Anything you wish to share with us": t.anything,
        "Notice period followed": t.noticeperiod,
      }));
      setQueueData(data);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
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
    const itemsWithSerialNumber = modifiedData?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
    setItems(itemsWithSerialNumber);
  }

  //table sorting
  const handleSorting = (column) => {
    const direction = sorting.column === column && sorting.direction === 'asc' ? 'desc' : 'asc';
    setSorting({ column, direction });
  };

  const sortedData = items?.sort((a, b) => {
    if (sorting.direction === 'asc') {
      return a[sorting.column] > b[sorting.column] ? 1 : -1;
    } else if (sorting.direction === 'desc') {
      return a[sorting.column] < b[sorting.column] ? 1 : -1;
    }
    return 0;
  });

  const renderSortingIcon = (column) => {
    if (sorting.column !== column) {
      return <>
        <Box sx={{ color: '#bbb6b6' }}>
          <Grid sx={{ height: '6px', fontSize: '1.6rem' }}>
            <ArrowDropUpOutlinedIcon />
          </Grid>
          <Grid sx={{ height: '6px', fontSize: '1.6rem' }}>
            <ArrowDropDownOutlinedIcon />
          </Grid>
        </Box>
      </>;
    } else if (sorting.direction === 'asc') {
      return <>
        <Box >
          <Grid sx={{ height: '6px' }}>
            <ArrowDropUpOutlinedIcon style={{ color: 'black', fontSize: '1.6rem' }} />
          </Grid>
          <Grid sx={{ height: '6px' }}>
            <ArrowDropDownOutlinedIcon style={{ color: '#bbb6b6', fontSize: '1.6rem' }} />
          </Grid>
        </Box>
      </>;
    } else {
      return <>
        <Box >
          <Grid sx={{ height: '6px' }}>
            <ArrowDropUpOutlinedIcon style={{ color: '#bbb6b6', fontSize: '1.6rem' }} />
          </Grid>
          <Grid sx={{ height: '6px' }}>
            <ArrowDropDownOutlinedIcon style={{ color: 'black', fontSize: '1.6rem' }} />
          </Grid>
        </Box>
      </>;
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

  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };

  useEffect(
    () => {
      const beforeUnloadHandler = (event) => handleBeforeUnload(event);
      window.addEventListener('beforeunload', beforeUnloadHandler);
      return () => {
        window.removeEventListener('beforeunload', beforeUnloadHandler);
      };
    }, []);

  useEffect(() => {
    getexcelDatas();
  }, [modifiedData])

  useEffect(() => {
    addSerialNumber();
  }, [modifiedData])

  // useEffect(()=>{
  //     fetchAllAddexits();
  // },[isEditOpen,addExistEdit])

  useEffect(() => {
    fetchAllAddexits();
  }, [])


  return (
    <Box>
      <Headtitle title={'EXIT DETAILS LIST'} />
      {/* ****** Header Content ****** */}

      <Typography sx={userStyle.HeaderText}>Exit Details List</Typography>

      {!queueCheck ?
        <Box sx={userStyle.container}>
          <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '350px' }}>
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
        :
        <>
          {isUserRoleCompare?.includes("lexistsdetailslist") && (
            <>
              <Box sx={userStyle.container}>
                {/* ******************************************************EXPORT Buttons****************************************************** */}
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>Exit Details List</Typography>
                </Grid>
                <Grid container sx={{ justifyContent: "center" }}>
                  <Grid>
                    {isUserRoleCompare?.includes("excelexistsdetailslist") && (
                      <>
                        <ExportXL csvData={queueData} fileName={fileName} />

                      </>
                    )}
                    {isUserRoleCompare?.includes("csvexistsdetailslist") && (
                      <>
                        <ExportCSV csvData={queueData} fileName={fileName} />

                      </>
                    )}
                    {isUserRoleCompare?.includes("printexistsdetailslist") && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("pdfexistsdetailslist") && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}>
                          <FaFilePdf />
                          &ensp;Export to PDF&ensp;
                        </Button>
                      </>
                    )}
                  </Grid>
                </Grid>
                <br />
                {/* ****** Table Grid Container ****** */}

                <Grid style={userStyle.dataTablestyle}>
                  <Box>
                    <label >Show entries:</label>
                    <Select id="pageSizeSelect" value={pageSize}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 180,
                            width: 80,
                          },
                        },
                      }}
                      onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={5}>5</MenuItem>
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={25}>25</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                      <MenuItem value={100}>100</MenuItem>
                      <MenuItem value={(jobOpening?.length)}>All</MenuItem>
                    </Select>
                  </Box>
                  <Box>
                    <FormControl fullWidth size="small" >
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
                    id="usertable"
                  >
                    <TableHead sx={{ fontWeight: "600" }}>
                      <StyledTableRow>
                        <StyledTableCell onClick={() => handleSorting('serialNumber')}><Box sx={userStyle.tableheadstyle}><Box>SNo</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('serialNumber')}</Box></Box></StyledTableCell>
                        {/* <StyledTableCell onClick={() => handleSorting('joboopenid')}><Box sx={userStyle.tableheadstyle}><Box>Employee Id</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('joboopenid')}</Box></Box></StyledTableCell> */}
                        <StyledTableCell onClick={() => handleSorting('empname')}><Box sx={userStyle.tableheadstyle}><Box>Employee Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('empname')}</Box></Box></StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting('recruitmentname')}><Box sx={userStyle.tableheadstyle}><Box>Separation Date</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('reasonleavingname')}</Box></Box></StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting('reasonleavingname')}><Box sx={userStyle.tableheadstyle}><Box>Reason for Leave</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('dateopened')}</Box></Box></StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting('think')}><Box sx={userStyle.tableheadstyle}><Box>Think the Organizations <br />do to improve Staff welfare</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('think')}</Box></Box></StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting('anything')}><Box sx={userStyle.tableheadstyle}><Box>Anything you wish <br />to share with us</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('anything')}</Box></Box></StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting('noticeperiod')}><Box sx={userStyle.tableheadstyle}><Box>Notice period followed</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('noticeperiod')}</Box></Box></StyledTableCell>
                        <StyledTableCell>Action</StyledTableCell>
                      </StyledTableRow>
                    </TableHead>
                    <TableBody align="left">
                      {filteredData?.length > 0 ? (
                        filteredData?.map((row, index) => (
                          <StyledTableRow key={index}>
                            <StyledTableCell>{row.serialNumber}</StyledTableCell>
                            <StyledTableCell>{row.empname}</StyledTableCell>
                            <StyledTableCell>{moment(row.today).format('DD-MM-YYYY')}</StyledTableCell>
                            <StyledTableCell>{row.reasonleavingname}</StyledTableCell>
                            <StyledTableCell>{row.think}</StyledTableCell>
                            <StyledTableCell>{row.anything}</StyledTableCell>
                            <StyledTableCell>{row.noticeperiod}</StyledTableCell>
                            <StyledTableCell component="th" scope="row" colSpan={1}>
                              <Grid sx={{ display: "flex" }}>
                                {isUserRoleCompare?.includes("eexistsdetailslist") && (
                                  <Button
                                    sx={userStyle.buttonedit}
                                    onClick={() => {
                                      getCode(row._id);
                                      handleClickOpenEdit();
                                    }}
                                  >
                                    <EditOutlinedIcon style={{ fontsize: "large" }} />
                                  </Button>
                                )}
                                {/* <Link to={`/location/${row._id}`} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonedit} style={{ minWidth: '0px' }}><EditOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link> */}
                                {isUserRoleCompare?.includes("dexistsdetailslist") && (
                                  <Button
                                    sx={userStyle.buttondelete}
                                    onClick={(e) => {
                                      rowData(row._id);
                                    }}
                                  >
                                    <DeleteOutlineOutlinedIcon
                                      style={{ fontsize: "large" }}
                                    />
                                  </Button>
                                )}
                                {isUserRoleCompare?.includes("vexistsdetailslist") && (
                                  <Button
                                    sx={userStyle.buttonedit}
                                    onClick={() => {
                                      getviewCode(row._id);
                                      handleClickOpenview();
                                    }}
                                  >
                                    <VisibilityOutlinedIcon
                                      style={{ fontsize: "large" }}
                                    />
                                  </Button>
                                )}
                                {isUserRoleCompare?.includes("iexistsdetailslist") && (
                                  <Button
                                    sx={userStyle.buttonedit}
                                    onClick={() => {
                                      handleClickOpeninfo();
                                      getinfoCode(row._id);
                                    }}
                                  >
                                    <InfoOutlinedIcon style={{ fontsize: "large" }} />
                                  </Button>
                                )}
                              </Grid>
                            </StyledTableCell>
                          </StyledTableRow>
                        ))) : <StyledTableRow> <StyledTableCell colSpan={8} align="center">No Data Available</StyledTableCell> </StyledTableRow>}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box style={userStyle.dataTablestyle}>
                  <Box>
                    Showing {filteredData.length > 0 ? ((page - 1) * pageSize) + 1 : 0} to {Math.min(page * pageSize, filteredDatas.length)} of {filteredDatas.length} entries
                  </Box>
                  <Box>
                    <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                      <FirstPageIcon />
                    </Button>
                    <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                      <NavigateBeforeIcon />
                    </Button>
                    {pageNumbers?.map((pageNumber) => (
                      <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={((page)) === pageNumber ? 'active' : ''} disabled={page === pageNumber}>
                        {pageNumber}
                      </Button>
                    ))}
                    {lastVisiblePage < totalPages && <span>...</span>}
                    <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                      <NavigateNextIcon />
                    </Button>
                    <Button onClick={() => setPage((totalPages))} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                      <LastPageIcon />
                    </Button>
                  </Box>
                </Box>


                <Box>
                  {/* Edit DIALOG */}
                  <Dialog
                    open={isEditOpen}
                    onClose={handleCloseModEdit}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="md"
                  >
                    <Box sx={userStyle.dialogbox}>
                      <DialogContent sx={{ maxWidth: "100%", padding: "20px" }}>
                        <>
                          <Grid container spacing={2}>
                            <Typography sx={userStyle.HeaderText}>
                              Edit Addexists page
                            </Typography>
                          </Grid>
                          <br />

                          {/* {!queueCheckedit ? */}
                          {/* <>
                    <Box sx={{ display: 'flex', justifyContent: 'center', paddingTop: '220px', minHeight: '600px', maxHeight: '800px', minWidth: "700px" }}>
                      <FacebookCircularProgress />
                    </Box>
                  </>
                  : */}
                          <>

                            <Grid container spacing={2} >
                              {/* {empCode ? (
                         <Grid item md={4} xs={12} sm={12}>
                         <Typography>Employee ID <b style={{ color: "red" }}>*</b></Typography>
                         <FormControl size="small" fullWidth>
                         <OutlinedInput
                             id="component-outlined"
                             type="text"
                             value={selectedempcode}
                             />
                         </FormControl>
                     </Grid>
                        
                    ):(
                        <Grid item md={4} xs={12} sm={12}>
                        <Typography>Employee ID <b style={{ color: "red" }}>*</b></Typography>
                        <FormControl size="small" fullWidth>
                            <Selects
                                options={empid}
                                styles={colourStyles}
                            value={{ label: selectedempcode, value: selectedempcode }}
                            onChange={handleProjectChange}
                           
                            />
                        </FormControl>
                    </Grid>
                    )} */}
                              {/* {empName ? ( */}
                              {/* <Grid item md={4} xs={12} sm={12}>
                        <Typography>Employee Name <b style={{ color: "red" }}>*</b></Typography>
                        <FormControl size="small" fullWidth>
                            <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={selectedempname}
                            />
                        </FormControl>
                    </Grid> */}
                              {/* ):( */}
                              <Grid item md={4} xs={12} sm={12}>
                                <Typography>Employee Name <b style={{ color: "red" }}>*</b></Typography>
                                <FormControl size="small" fullWidth>
                                  <Selects
                                    options={filteredSubCategories}
                                    styles={colourStyles}
                                    value={{ label: selectedempname, value: selectedempname }}
                                    onChange={handleUserNameChange}

                                  />
                                </FormControl>
                              </Grid>
                              {/* )} */}


                              <Grid item md={3} xs={12} sm={12}>
                                <Typography>Interviewer <b style={{ color: "red" }}>*</b></Typography>
                                <FormControl size="small" fullWidth>
                                  <Selects
                                    options={interviewer}
                                    styles={colourStyles}
                                    // value={addExist.interviewername}
                                    //     onChange={(e) => {
                                    //         setAddExits({ ...addExist, interviewername: e.value });
                                    //     }}
                                    value={{ label: addExistEdit.interviewername, value: addExistEdit.interviewername }}
                                    onChange={(e) => setAddExitsEdit({ ...addExistEdit, interviewername: e.value })}

                                  />
                                </FormControl>
                              </Grid>
                              <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                  <Typography>Reason For Leaving </Typography>
                                  <Selects
                                    options={leavingfetch}
                                    styles={colourStyles}
                                    value={{ label: addExistEdit.reasonleavingname, value: addExistEdit.reasonleavingname }}
                                    onChange={(e) => setAddExitsEdit({ ...addExistEdit, reasonleavingname: e.value })}

                                  />
                                </FormControl>
                              </Grid>
                              <Grid item md={2} sm={1} xs={1}>
                                {/* <Button
                            variant="contained"
                            style={{
                                height: "30px",
                                minWidth: "20px",
                                padding: "19px 13px",
                                color: "white",
                                marginTop: "20px",
                                background: "rgb(25, 118, 210)",
                            }}
                            onClick={() => {
                                handleClickOpenviewReason();
                            }}
                        >
                            <FaPlus style={{ fontSize: "15px" }} />
                        </Button> */}
                              </Grid>

                            </Grid> <br /> <br />

                            <Grid item xs={12}>
                              <Typography sx={userStyle.SubHeaderText}><b> Questionaries </b></Typography>
                            </Grid><br />
                            <Grid container spacing="2">
                              <Grid item md={6} xs={12} sm={12}>
                                <Typography>Working for this organization again </Typography>
                              </Grid>
                              <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                  <Selects
                                    options={workingfetch}
                                    styles={colourStyles}
                                    value={{ label: addExistEdit.workingagainname, value: addExistEdit.workingagainname }}
                                    onChange={(e) => setAddExitsEdit({ ...addExistEdit, workingagainname: e.value })}


                                  />
                                </FormControl>
                              </Grid>
                              <Grid item md={2} sm={1} xs={1}>
                                {/* <Button
                            variant="contained"
                            style={{
                                height: "30px",
                                minWidth: "20px",
                                padding: "19px 13px",
                                color: "white",
                                // marginTop: "20px",
                                background: "rgb(25, 118, 210)",
                            }}
                            onClick={() => {
                                handleClickOpenviewwork();
                            }}
                        >
                            <FaPlus style={{ fontSize: "15px" }} />
                        </Button> */}
                              </Grid>


                            </Grid> <br />

                            <Grid container spacing="2">
                              <Grid item md={6} xs={12} sm={12}>
                                <Typography>What did you like the most of the organization </Typography>
                              </Grid>
                              <Grid item md={4} xs={12} sm={12}>
                                <FormControl size="small" fullWidth>
                                  <TextareaAutosize
                                    aria-label="minimum height"
                                    minRows={5}
                                    value={addExistEdit.mostorganisation}
                                    onChange={(e) => { setAddExitsEdit({ ...addExistEdit, mostorganisation: e.target.value }) }}
                                  />
                                </FormControl>
                              </Grid>
                              <Grid item md={2} sm={1} xs={1}>
                              </Grid>


                            </Grid> <br />

                            <Grid container spacing="2">
                              <Grid item md={6} xs={12} sm={12}>
                                <Typography>Think the organization do to improve staff welfare</Typography>
                              </Grid>
                              <Grid item md={4} xs={12} sm={12}>
                                <FormControl size="small" fullWidth>
                                  <TextareaAutosize
                                    aria-label="minimum height"
                                    minRows={5}
                                    value={addExistEdit.think}
                                    onChange={(e) => { setAddExitsEdit({ ...addExistEdit, think: e.target.value }) }}
                                  />
                                </FormControl>
                              </Grid>
                              <Grid item md={2} sm={1} xs={1}>
                              </Grid>
                            </Grid> <br />

                            <Grid container spacing="2">
                              <Grid item md={6} xs={12} sm={12}>
                                <Typography>Anything you wish to share with us</Typography>
                              </Grid>
                              <Grid item md={4} xs={12} sm={12}>
                                <FormControl size="small" fullWidth>
                                  <TextareaAutosize
                                    aria-label="minimum height"
                                    minRows={5}
                                    value={addExistEdit.anything}
                                    onChange={(e) => { setAddExitsEdit({ ...addExistEdit, anything: e.target.value }) }}
                                  />
                                </FormControl>
                              </Grid>
                              <Grid item md={2} sm={1} xs={1}>
                              </Grid>
                            </Grid> <br />

                            <Grid item xs={12}>
                              <Typography sx={userStyle.SubHeaderText}><b> Checklist for Exit Interview </b></Typography>
                            </Grid><br />

                            <Grid container spacing="2">
                              <Grid item md={6} xs={12} sm={12}>
                                <Typography>Company vechile handted in</Typography>
                              </Grid>
                              <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                  <OutlinedInput
                                    id="component-outlined"
                                    type="date"
                                    value={addExistEdit.companyvechile}
                                    onChange={(e) => { setAddExitsEdit({ ...addExistEdit, companyvechile: e.target.value }) }}
                                  />

                                </FormControl>
                              </Grid>
                              <Grid item md={2} sm={1} xs={1}>
                              </Grid>
                            </Grid> <br />

                            <Grid container spacing="2">
                              <Grid item md={6} xs={12} sm={12}>
                                <Typography>All Equipment handed in</Typography>
                              </Grid>
                              <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                  <OutlinedInput
                                    id="component-outlined"
                                    type="date"
                                    value={addExistEdit.allequiment}
                                    onChange={(e) => { setAddExitsEdit({ ...addExistEdit, allequiment: e.target.value }) }}
                                  />
                                </FormControl>
                              </Grid>
                              <Grid item md={2} sm={1} xs={1}>
                              </Grid>
                            </Grid> <br />

                            <Grid container spacing="2">
                              <Grid item md={6} xs={12} sm={12}>
                                <Typography>Exit interview conducated on</Typography>
                              </Grid>
                              <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                  <OutlinedInput
                                    id="component-outlined"
                                    type="date"
                                    value={addExistEdit.exitinterview}
                                    onChange={(e) => { setAddExitsEdit({ ...addExistEdit, exitinterview: e.target.value }) }}
                                  />
                                </FormControl>
                              </Grid>
                              <Grid item md={2} sm={1} xs={1}>
                              </Grid>
                            </Grid> <br />

                            <Grid container spacing="2">
                              <Grid item md={6} xs={12} sm={12}>
                                <Typography>Resignation letter submitted</Typography>
                              </Grid>
                              <Grid item md={4} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                  {/* <Grid item md={4} sm={4}>
                        <Dropzone onDrop={handleFileSelect}>
                          {({ getRootProps, getInputProps }) => (

                            <section>
                              <div {...getRootProps()}>
                                <input {...getInputProps()} id="profileimage" onChange={handleChangeImage} />

                                <Typography sx={userStyle.uploadbtn}>Upload</Typography><br />


                              </div>
                            </section>

                          )}
                        </Dropzone>
                      </Grid>            */}

                                  {/* <Grid item lg={4} md={6} sm={12} xs={12}>
                                {file ? (
                                    <>
                                        <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                                            <img src={file} style={{ width: '50%' }} height="80px" />
                                        </Grid>
                                    </>
                                ) : (
                                    <></>
                                )
                                }
                                <Grid sx={{ display: 'flex' }}>
                                    <FormControl size="small" fullWidth>
                                        <Grid sx={{ display: 'flex' }}>
                                            <Button component="label" sx={userStyle.uploadbtn}>
                                                Upload
                                                <input type='file' id="businesslogo" accept="image/*" name='file' hidden onChange={handleChange}
                                                />
                                            </Button>
                                          
                                        </Grid>
                                       
                                    </FormControl>
                                </Grid>
                            </Grid> */}
                                  <div>
                                    <input
                                      className={classes.inputs}
                                      type="file"
                                      id="uploadprojectcreatenew"
                                      multiple
                                      onChange={handleInputChange}
                                    />
                                    <label htmlFor="uploadprojectcreatenew" style={{ textAlign: "center" }}>
                                      <Button sx={userStyle.btncancel} component="span">
                                        <AddCircleOutlineIcon /> &ensp; Add Files
                                      </Button>
                                    </label>

                                    <Grid container>
                                      {selectedFiles.map((file, index) => (
                                        <>
                                          <Grid item md={3} sm={11} xs={11}>
                                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                                              {file.type.includes("image/") ? (
                                                <img src={file.preview} alt={file.name} height="100" style={{ maxWidth: "-webkit-fill-available" }} />
                                              ) : (
                                                <img className={classes.preview} src={getFileIcon(file.name)} height="100" alt="file icon" />
                                              )}
                                            </Box>
                                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                                              <Typography variant="subtitle2">{file.name} </Typography>
                                              {/* <Typography variant="subtitle2">{file.type} - {file.size} bytes </Typography> */}
                                            </Box>
                                          </Grid>
                                          <Grid item md={1} sm={1} xs={1}>
                                            <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", marginLeft: "105px", marginTop: "-20px", cursor: "pointer" }} onClick={() => renderFilePreview(file)} />
                                          </Grid>
                                          <Grid item md={1} sm={1} xs={1}>

                                            <Button
                                              sx={{
                                                padding: '14px 14px', marginTop: '16px', minWidth: '40px !important', borderRadius: '50% !important', ':hover': {
                                                  backgroundColor: '#80808036', // theme.palette.primary.main

                                                },
                                              }}
                                              onClick={() => handleDeleteFile(index)}
                                            >
                                              <FaTrash style={{ fontSize: "large", color: "#777" }} />
                                            </Button>
                                          </Grid>
                                        </>
                                      ))}
                                    </Grid>
                                  </div>


                                </FormControl>
                              </Grid>
                              <Grid item md={2} sm={1} xs={1}>
                              </Grid>
                            </Grid> <br />

                            <Grid container spacing="2">
                              <Grid item md={6} xs={12} sm={12}>
                                <Typography>Security</Typography>
                              </Grid>
                              <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                  <Select
                                    fullWidth
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    MenuProps={{
                                      PaperProps: {
                                        style: {
                                          maxHeight: 200,
                                          width: 80,
                                        },
                                      },
                                    }}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    value={addExistEdit.security}
                                    onChange={(e) => { setAddExitsEdit({ ...addExistEdit, security: e.target.value }) }}
                                  >
                                    <MenuItem value="" disabled>Please Select</MenuItem>
                                    <MenuItem value="yes"> {"Yes"} </MenuItem>
                                    <MenuItem value="no"> {"No"} </MenuItem>

                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid item md={2} sm={1} xs={1}>
                              </Grid>
                            </Grid> <br />

                            <Grid container spacing="2">
                              <Grid item md={6} xs={12} sm={12}>
                                <Typography>Notice period followed</Typography>
                              </Grid>
                              <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                  <Select
                                    fullWidth
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    MenuProps={{
                                      PaperProps: {
                                        style: {
                                          maxHeight: 200,
                                          width: 80,
                                        },
                                      },
                                    }}
                                    value={addExistEdit.noticeperiod}
                                    onChange={(e) => { setAddExitsEdit({ ...addExistEdit, noticeperiod: e.target.value }) }}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                  >
                                    <MenuItem value="" disabled>Please Select</MenuItem>
                                    <MenuItem value="yes"> {"Yes"} </MenuItem>
                                    <MenuItem value="no"> {"No"} </MenuItem>

                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid item md={2} sm={1} xs={1}>
                              </Grid>
                            </Grid> <br />

                            <Grid container spacing="2">
                              <Grid item md={6} xs={12} sm={12}>
                                <Typography>Manage / Supevisor clearance</Typography>
                              </Grid>
                              <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                  <Select
                                    fullWidth
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    MenuProps={{
                                      PaperProps: {
                                        style: {
                                          maxHeight: 200,
                                          width: 80,
                                        },
                                      },
                                    }}
                                    value={addExistEdit.managesupervisor}
                                    onChange={(e) => { setAddExitsEdit({ ...addExistEdit, managesupervisor: e.target.value }) }}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                  >
                                    <MenuItem value="" disabled>Please Select</MenuItem>
                                    <MenuItem value="yes"> {"Yes"} </MenuItem>
                                    <MenuItem value="no"> {"No"} </MenuItem>

                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid item md={2} sm={1} xs={1}>
                              </Grid>
                            </Grid> <br /> <br />

                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6} md={2.5} lg={2.5}>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={editSubmit}
                                >
                                  UPDATE
                                </Button>


                              </Grid>
                              <Grid item xs={12} sm={6} md={2.5} lg={2.5}>
                                <Button
                                  sx={userStyle.btncancel}
                                  onClick={handleCloseModEdit}
                                >
                                  Close
                                </Button>

                              </Grid>
                            </Grid>






                            {/* Reason of Leaving  */}
                            <Dialog
                              open={openviewReason}
                              onClose={handleClickOpenviewReason}
                              aria-labelledby="alert-dialog-title"
                              aria-describedby="alert-dialog-description"
                            >
                              <Box sx={{ width: "550px", padding: "20px 50px" }}>
                                <>
                                  <Typography sx={userStyle.HeaderText}> Reason For Leaving- Quick Add</Typography>
                                  <br /> <br />
                                  <Grid container spacing={2}>
                                    <Grid item md={6} xs={12} sm={12}>
                                      <FormControl fullWidth size="small">
                                        <Typography variant="h6"> Name</Typography>

                                      </FormControl>
                                    </Grid>< br />
                                    <Grid container spacing={2}>
                                      <Grid item md={8} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                          <Typography variant="h6"></Typography>

                                          <FormControl size="small" fullWidth>
                                            <TextField
                                              value={leaving.name}
                                              onChange={(e) => {
                                                setLeaving({ ...leaving, name: e.target.value });
                                              }}
                                            />
                                          </FormControl>

                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                  <br /> <br /> <br />
                                  <Grid container spacing={2}>
                                    <Grid item md={2} xs={12} sm={12}>
                                      <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleSubmitReason}

                                      >

                                        Save
                                      </Button>
                                    </Grid>
                                    <Grid item md={2} xs={12} sm={12}>
                                      <Button
                                        variant="contained"
                                        color="primary"
                                      // onClick={handleClear}
                                      > Clear
                                      </Button>
                                    </Grid>
                                    <Grid item md={2} xs={12} sm={12} >
                                      <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleCloseviewReason}
                                      >   Close

                                      </Button>
                                    </Grid>
                                  </Grid>
                                </>
                              </Box>
                            </Dialog>

                            {/* Work Organisation  */}
                            <Dialog
                              open={openviewwork}
                              onClose={handleClickOpenviewwork}
                              aria-labelledby="alert-dialog-title"
                              aria-describedby="alert-dialog-description"
                            >
                              <Box sx={{ width: "550px", padding: "20px 50px" }}>
                                <>
                                  <Typography sx={userStyle.HeaderText}> Working for this organisation again</Typography>
                                  <br /> <br />
                                  <Grid container spacing={2}>
                                    <Grid item md={6} xs={12} sm={12}>
                                      <FormControl fullWidth size="small">
                                        <Typography variant="h6"> Name</Typography>
                                      </FormControl>
                                    </Grid>< br />
                                    <Grid container spacing={2}>
                                      <Grid item md={8} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                          <Typography variant="h6"></Typography>

                                          <FormControl size="small" fullWidth>
                                            <TextField
                                              value={working.workingname}
                                              onChange={(e) => {
                                                setWorking({ ...working, workingname: e.target.value });
                                              }}
                                            />
                                          </FormControl>

                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                  <br /> <br /> <br />
                                  <Grid container spacing={2}>
                                    <Grid item md={2} xs={12} sm={12}>
                                      <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleSubmitWork}

                                      >

                                        Save
                                      </Button>
                                    </Grid>
                                    <Grid item md={2} xs={12} sm={12}>
                                      <Button
                                        variant="contained"
                                        color="primary"
                                      // onClick={handleClear}
                                      > Clear
                                      </Button>
                                    </Grid>
                                    <Grid item md={2} xs={12} sm={12}>
                                      <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleCloseviewwork}
                                      >   Close

                                      </Button>
                                    </Grid>
                                  </Grid>
                                </>
                              </Box>
                            </Dialog>




                          </>

                          {/* } */}

                        </>
                      </DialogContent>
                    </Box>
                  </Dialog>


                  {/* Delete Modal */}
                  <Box>
                    {/* ALERT DIALOG */}
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
                        <Button onClick={handleCloseMod} style={{
                          backgroundColor: '#f4f4f4',
                          color: '#444',
                          boxShadow: 'none',
                          borderRadius: '3px',
                          border: '1px solid #0000006b',
                          '&:hover': {
                            '& .css-bluauu-MuiButtonBase-root-MuiButton-root': {
                              backgroundColor: '#f4f4f4',
                            },
                          },
                        }}>
                          Cancel
                        </Button>
                        <Button
                          autoFocus
                          variant="contained"
                          color="error"
                          onClick={(e) => delProject(projectid)}
                        >
                          {" "}
                          OK{" "}
                        </Button>
                      </DialogActions>
                    </Dialog>



                    {/* view model */}
                    <Dialog
                      open={openview}
                      onClose={handleClickOpenview}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <Box sx={{ width: "950px", padding: "20px 50px" }}>
                        <>
                          <Typography sx={userStyle.HeaderText}> View AddExits details</Typography>
                          <br /> <br />
                          <Grid container spacing={2}>
                            <Grid item md={3} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6"> EmployeeName</Typography>
                                <Typography>{addExistEdit.empname}</Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">Interviewer</Typography>
                                <Typography>
                                  <Typography>{addExistEdit.interviewername}</Typography>
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">Reason For Leaving</Typography>
                                <Typography>
                                  <Typography>{addExistEdit.reasonleavingname}</Typography>
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">Working for this organization again </Typography>
                                <Typography>
                                  <Typography>{addExistEdit.workingagainname}</Typography>
                                </Typography>
                              </FormControl>
                            </Grid>
                          </Grid>
                          <Grid container spacing={2}>
                            <Grid item md={12} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">What did you like the most of the organization </Typography>
                                <Typography>
                                  <Typography>{addExistEdit.mostorganisation}</Typography>
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={12} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">Think the organization do to improve staff welfare </Typography>
                                <Typography>
                                  <Typography>{addExistEdit.think}</Typography>
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={12} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">Anything you wish to share with us</Typography>
                                <Typography>
                                  <Typography>{addExistEdit.anything}</Typography>
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={12} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">Company vechile handted in</Typography>
                                <Typography>
                                  <Typography>{addExistEdit.companyvechile}</Typography>
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={12} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">All Equipment handed in</Typography>
                                <Typography>
                                  <Typography>{addExistEdit.allequiment}</Typography>
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={12} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">Exit interview conducated on</Typography>
                                <Typography>
                                  <Typography>{addExistEdit.exitinterview}</Typography>
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={12} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">Resignation letter submitted</Typography>
                                <Typography>
                                  {/* <Typography>{addExistEdit.files}</Typography> */}
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={12} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">Security</Typography>
                                <Typography>
                                  <Typography>{addExistEdit.security}</Typography>
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={12} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">Notice period followed</Typography>
                                <Typography>
                                  <Typography>{addExistEdit.noticeperiod}</Typography>
                                </Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={12} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">Manage / Supevisor clearance</Typography>
                                <Typography>
                                  <Typography>{addExistEdit.managesupervisor}</Typography>
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
                              {" "}
                              Back{" "}
                            </Button>
                          </Grid>
                        </>
                      </Box>
                    </Dialog>




                    {/* this is info view details */}
                    <Dialog
                      open={openInfo}
                      onClose={handleCloseinfo}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <Box sx={{ width: '550px', padding: '20px 50px' }}>
                        <>
                          <Typography sx={userStyle.HeaderText}>Project Info</Typography>
                          <br /><br />
                          <Grid container spacing={2}>
                            <Grid item md={12} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">addedby</Typography>
                                <br />
                                <Table>
                                  <TableHead>
                                    <StyledTableCell sx={{ padding: '5px 10px !important' }}>{"SNO"}.</StyledTableCell>
                                    <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"UserName"}</StyledTableCell>
                                    <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"Date"}</StyledTableCell>
                                  </TableHead>
                                  <TableBody>
                                    {addedby?.map((item, i) => (
                                      <StyledTableRow>
                                        <StyledTableCell sx={{ padding: '5px 10px !important' }}>{i + 1}.</StyledTableCell>
                                        <StyledTableCell sx={{ padding: '5px 10px !important' }}> {item.name}</StyledTableCell>
                                        <StyledTableCell sx={{ padding: '5px 10px !important' }}> {moment(item.date).format('DD-MM-YYYY hh:mm:ss a')}</StyledTableCell>
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
                                    <StyledTableCell sx={{ padding: '5px 10px !important' }}>{"SNO"}.</StyledTableCell>
                                    <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"UserName"}</StyledTableCell>
                                    <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"Date"}</StyledTableCell>
                                  </TableHead>
                                  <TableBody>
                                    {updateby?.map((item, i) => (
                                      <StyledTableRow>
                                        <StyledTableCell sx={{ padding: '5px 10px !important' }}>{i + 1}.</StyledTableCell>
                                        <StyledTableCell sx={{ padding: '5px 10px !important' }}> {item.name}</StyledTableCell>
                                        <StyledTableCell sx={{ padding: '5px 10px !important' }}> {moment(item.date).format('DD-MM-YYYY hh:mm:ss a')}</StyledTableCell>
                                      </StyledTableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </FormControl>
                            </Grid>
                          </Grid>
                          <br /> <br /><br />
                          <Grid container spacing={2}>
                            <Button variant="contained" onClick={handleCloseinfo}> Back </Button>
                          </Grid>
                        </>
                      </Box>
                    </Dialog>

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
                      <StyledTableCell>Employee Name</StyledTableCell>
                      <StyledTableCell>Separation Date</StyledTableCell>
                      <StyledTableCell>Reason for Leave</StyledTableCell>
                      <StyledTableCell>Think the Organizations <br />do to improve Staff welfare</StyledTableCell>
                      <StyledTableCell>Anything you wish <br />to share with us</StyledTableCell>
                      <StyledTableCell>Notice period followed</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody align="left">
                    {items?.length > 0 ? (
                      items?.map((row, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell>{row.serialNumber}</StyledTableCell>
                          <StyledTableCell>{row.empname}</StyledTableCell>
                          <StyledTableCell>{moment(row.today).format('DD-MM-YYYY')}</StyledTableCell>
                          <StyledTableCell>{row.reasonleavingname}</StyledTableCell>
                          <StyledTableCell>{row.think}</StyledTableCell>
                          <StyledTableCell>{row.anything}</StyledTableCell>
                          <StyledTableCell>{row.noticeperiod}</StyledTableCell>
                        </StyledTableRow>
                      ))) : <StyledTableRow> <StyledTableCell colSpan={7} align="center">No Data Available</StyledTableCell> </StyledTableRow>}
                    <StyledTableRow></StyledTableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </>
      }
    </Box>
  );
}

export default ExitdetailList;