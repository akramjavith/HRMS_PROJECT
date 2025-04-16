import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  TableBody,
  TableRow,
  TextField,
  TextareaAutosize,
  TableCell,
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
} from "@mui/material";
import { userStyle } from "../../pageStyle";
import { handleApiError } from "../../components/Errorhandling";
import Header from "../../components/Header";
import { useParams } from "react-router-dom";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import StyledDataGrid from "../../components/TableStyle";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { makeStyles } from "@material-ui/core";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import CancelIcon from "@mui/icons-material/Cancel";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";

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

function Refercandidate() {
  const [refferal, setRefferal] = useState({
    referingjob: "",
    prefix: "Mr",
    firstname: "",
    lastname: "",
    emailid: "",
    mobile: "",
    relation: "",
    known: "",
    notes: "",
    // files:"",
    addedby: "",
    updatedby: "",
  });

  const [refferalEdit, setRefferaledit] = useState({
    referingjob: "",
    prefix: "Mr",
    firstname: "",
    lastname: "",
    emailid: "",
    mobile: "",
    relationship: "",
    knownperiod: "",
    notes: "",
    files: "",
  });
  const [jobopenening, setJobOpeing] = useState([]);
  const [refList, setReflist] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess } = useContext(
    UserRoleAccessContext
  );
  const { auth } = useContext(AuthContext);
  const [relationship, setRelationship] = useState(
    "Please Select Relationship"
  );
  const [relationshipEdit, setRelationshipEdit] = useState(
    "Please Select Relationship"
  );
  const [knownperiod, setKnownperiod] = useState("Please Select Knownperiod");
  const [knownperiodEdit, setKnownperiodEdit] = useState(
    "Please Select Knownperiod"
  );

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);

  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();

  const [openview, setOpenview] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteproject, setDeleteproject] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [projectData, setProjectData] = useState([]);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [files, setFiles] = useState([]);
  const [fileEdit, setFilesEdit] = useState([]);

  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  // view model
  const handleClickOpenview = () => {
    setOpenview(true);
  };

  const handleCloseview = () => {
    setOpenview(false);
  };

  // info model
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };

  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  //Delete model
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };

  const id = useParams().id;

  const getJobOpenings = async () => {
    try {
      let res = await axios.get(`${SERVICE.JOBOPENING_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setJobOpeing(res?.data?.sjobopening);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  useEffect(() => {
    getJobOpenings();
  }, [id]);

  const handleMobileChange = (e) => {
    let inputValue = e.target.value.replace(/\D/g, "");
    inputValue = inputValue.slice(0, 10);
    setRefferal({
      ...refferal,
      mobile: inputValue,
    });
  };

  const handleMobileChangeEdit = (e) => {
    let inputValue = e.target.value.replace(/\D/g, "");
    inputValue = inputValue.slice(0, 10);
    setRefferaledit({
      ...refferalEdit,
      mobile: inputValue,
    });
  };

  // File Upload
  const handleFileUpload = (event, index) => {
    const filesname = event.target.files;
    let newSelectedFiles = [...files];
    for (let i = 0; i < filesname.length; i++) {
      const file = filesname[i];
      // Check if the file is an image
      const fileExtension = file.name.split(".").pop().toLowerCase();
      if (
        [
          "jpg",
          "jpeg",
          "png",
          "pdf",
          "xls",
          "xlsx",
          "csv",
          "docx",
          "doc",
        ].includes(fileExtension)
      ) {
        const reader = new FileReader();
        reader.onload = () => {
          newSelectedFiles.push({
            name: file.name,
            preview: reader.result,
            data: reader.result.split(",")[1],
            // index: indexData
          });
          setFiles(newSelectedFiles);
        };
        reader.readAsDataURL(file);
      } else {
        // Display an error message or take appropriate action for unsupported file types
        // toast.error('Unsupported file type. Only images and PDFs are allowed.');
      }
    }
  };

  const handleFileDelete = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  // this is line in edit file upload
  const handleFileUploadEdit = (event, index) => {
    const filesname = event.target.files;
    let newSelectedFiles = [...fileEdit];
    for (let i = 0; i < filesname.length; i++) {
      const file = filesname[i];
      // Check if the file is an image
      const fileExtension = file.name.split(".").pop().toLowerCase();
      if (
        [
          "jpg",
          "jpeg",
          "png",
          "pdf",
          "xls",
          "xlsx",
          "csv",
          "docx",
          "doc",
        ].includes(fileExtension)
      ) {
        const reader = new FileReader();
        reader.onload = () => {
          newSelectedFiles.push({
            name: file.name,
            preview: reader.result,
            data: reader.result.split(",")[1],
            // index: indexData
          });
          setFilesEdit(newSelectedFiles);
        };
        reader.readAsDataURL(file);
      } else {
        // Display an error message or take appropriate action for unsupported file types
        // toast.error('Unsupported file type. Only images and PDFs are allowed.');
      }
    }
  };

  const handleFileDeleteEdit = (index) => {
    setFilesEdit((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const renderFilePreviewEdit = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  const username = isUserRoleAccess.username;
  const userData = {
    name: username,
    date: new Date(),
  };

  const classes = useStyles();

  // file download and view code

  //get single row to edit....
  const fileData = async (id) => {
    try {
      let res = await axios.get(`${SERVICE.REFERCANDIDATE_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      renderFilePreview(res?.data?.srefercandidate.files[0]);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //get single row to edit....
  const fileDataDownload = async (id, fileName) => {
    try {
      const response = await axios.get(
        `${SERVICE.REFERCANDIDATE_SINGLE}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          responseType: "blob", // Set the response type to 'blob'
        }
      );

      // Check if the response is valid
      if (response.status === 200) {
        const blob = new Blob([response.data], { type: "application/pdf" }); // Set the correct content-type
        const url = window.URL.createObjectURL(blob);

        // Create an anchor element and trigger the download
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName; // Set the desired file name with the correct extension (e.g., '.pdf')
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Failed to download the file.");
      }
    } catch (err) {
      // Handle errors
      console.error(err);
    }
  };

  let printsno = 1;

  //set function to get particular row
  const rowData = async (id) => {
    try {
      let res = await axios.get(`${SERVICE.REFERCANDIDATE_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteproject(res?.data?.srefercandidate);
      handleClickOpen();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  // Alert delete popup
  let projectid = deleteproject._id;
  const delProject = async () => {
    try {
      await axios.delete(`${SERVICE.REFERCANDIDATE_SINGLE}/${projectid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchRefercandidate();
      handleCloseMod();
      setPage(1);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //add function
  const sendRequest = async () => {
    try {
      let refercreate = await axios.post(SERVICE.REFERCANDIDATE_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        referingjob: String(jobopenening.recruitmentname),
        status: String("Refered"),
        companyname: isUserRoleAccess.companyname,
        prefix: String(refferal.prefix),
        firstname: String(refferal.firstname),
        lastname: String(refferal.lastname),
        emailid: String(refferal.emailid),
        mobile: String(refferal.mobile),
        relation: String(relationship),
        known: String(knownperiod),
        notes: String(refferal.notes),
        files: [...files],
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      setRefferal(refercreate.data);
      await fetchRefercandidate();
      setFiles([]);
      setRefferal({
        referingjob: "",
        prefix: "Mr",
        firstname: "",
        lastname: "",
        emailid: "",
        mobile: "",
        relationship: "",
        knownperiod: "",
        files: "",
        notes: "",
      });
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  function isValidEmail(email) {
    // Regular expression for a simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    // const isNameMatch = refList?.some(item => item.name?.toLowerCase() === (refferal.name)?.toLowerCase());
    if (refferal.firstname === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Firstname"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (!isValidEmail(refferal.emailid)) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter  Valid Email"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else {
      sendRequest();
    }
  };

  const handleclear = (e) => {
    e.preventDefault();
    setRefferal({
      referingjob: "",
      prefix: "Mr",
      firstname: "",
      lastname: "",
      emailid: "",
      mobile: "",
      relationship: "",
      knownperiod: "",
      files: "",
      notes: "",
    });
  };

  //Edit model...
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
  };

  //get single row to edit....
  const getCode = async (e, name) => {
    try {
      let res = await axios.get(`${SERVICE.REFERCANDIDATE_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setRefferaledit(res?.data?.srefercandidate);
      setRelationshipEdit(res?.data?.srefercandidate?.relation);
      setKnownperiodEdit(res?.data?.srefercandidate.known);
      setFilesEdit(res?.data?.srefercandidate.files);
      handleClickOpenEdit();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  // get single row to view....
  const getviewCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.REFERCANDIDATE_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setRefferaledit(res?.data?.srefercandidate);
      handleClickOpenview();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.REFERCANDIDATE_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setRefferaledit(res?.data?.srefercandidate);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //Project updateby edit page...
  let updateby = refferalEdit.updatedby;
  let addedby = refferalEdit.addedby;

  let refsid = refferalEdit._id;

  //editing the single data...
  const sendEditRequest = async () => {
    try {
      let res = await axios.put(`${SERVICE.REFERCANDIDATE_SINGLE}/${refsid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        name: String(refferalEdit.name),
        referingjob: String(refferalEdit.referingjob),
        prefix: String(refferalEdit.prefix),
        firstname: String(refferalEdit.firstname),
        lastname: String(refferalEdit.lastname),
        emailid: String(refferalEdit.emailid),
        mobile: String(refferalEdit.mobile),
        relation: String(relationshipEdit),
        known: String(knownperiodEdit),
        notes: String(refferalEdit.notes),
        files: [...fileEdit],
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      setRefferaledit(res.data);
      await fetchRefercandidate();
      handleCloseModEdit();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const editSubmit = (e) => {
    e.preventDefault();
    if (refferalEdit.firstname === "") {
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
      sendEditRequest();
    }
  };

  // Show all columns
  const [columnVisibility, setColumnVisibility] = useState({
    actions: true,
    serialNumber: true,
    referingjob: true,
    emailid: true,
    mobile: true,
    relation: true,
    known: true,
    resume: true,
    status: true,
  });

  //get all refercandidate details.
  const fetchRefercandidate = async () => {
    try {
      let res_project = await axios.post(SERVICE.USERREFERCANDIDATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        companyname: isUserRoleAccess.companyname
      });
    
      setReflist(res_project?.data?.refercandidates);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  // pdf.....
  const columns = [
    { title: "S.No", field: "serialNumber" },
    { title: "Name", field: "referingjob" },
    { title: "Email Id", field: "emailid" },
    { title: "Mobile", field: "mobile" },
    { title: "Relationship", field: "relation" },
    { title: "Knownperiod", field: "known" },
    { title: "Resume", field: "resume" },
    { title: "Status", field: "status" },
    { title: "Refered By", field: "companyname" },
  ];

  const downloadPdf = () => {
    const doc = new jsPDF();
    const columnsWithSerial = [
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];
    // Add a serial number to each row
    const itemsWithSerial = refList.map((item, index) => ({
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
    doc.save("Refer Candidatepage.pdf");
  };

  // Excel
  const fileName = "Refer Candidatepage";

  // get particular columns for export excel
  const getexcelDatas = () => {
      var data = refList?.map((t, index) => ({
        Sno: index + 1,
        Name: t.firstname + t.lastname,
        Emailid: t.emailid,
        Mobile: t.mobile,
        Relationship: t.relation,
        Knownperiod: t.known,
        "Refering for job": t.referingjob,
        Resume: t.resume,
        Status: t.status,
        "Refered By": t.companyname,
      }));
      setProjectData(data);
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Refer Candidate",
    pageStyle: "print",
  });

  //serial no for listing items
  const addSerialNumber = () => {
    const itemsWithSerialNumber = refList?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [refList]);

  useEffect(() => {
    getexcelDatas();
  }, [refList]);

  // Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Split the search query into individual terms
  const searchTerms = searchQuery.toLowerCase().split(" ");

  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
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
  const indexOfFirstItem = indexOfLastItem - pageSize;

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  // Table start colum and row
  const columnDataTable = [
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 50,
      hide: !columnVisibility.serialNumber,
    },
    {
      field: "referingjob",
      headerName: "Name",
      flex: 0,
      width: 150,
      hide: !columnVisibility.referingjob,
    },
    {
      field: "emailid",
      headerName: "Emailid",
      flex: 0,
      width: 150,
      hide: !columnVisibility.emailid,
    },
    {
      field: "mobile",
      headerName: "Mobile",
      flex: 0,
      width: 100,
      hide: !columnVisibility.mobile,
    },
    {
      field: "relation",
      headerName: "Relationship",
      flex: 0,
      width: 150,
      hide: !columnVisibility.relation,
    },
    {
      field: "known",
      headerName: "Knownperiod",
      flex: 0,
      width: 150,
      hide: !columnVisibility.known,
    },
    {
      field: "files",
      headerName: "Resume",
      flex: 0,
      width: 150,
      sortable: false,
      hide: !columnVisibility.actions,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          <a
            onClick={() => {
              fileData(params.row.id);
            }}
            style={{ minWidth: "0px", color: "#357AE8" }}
          >
            View
          </a>
          <a
            href="#"
            onClick={(e) => {
              if (params.row.files && params.row.files.length > 0) {
                const fileName = params.row.files[0].name; // Get the file name
                fileDataDownload(params.row.id, fileName); // Pass the file name to the function
              } else {
                console.error("No files available.");
              }
            }}
            style={{ minWidth: "0px", color: "#357AE8", cursor: "pointer" }}
          >
            Download
          </a>
        </Grid>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0,
      width: 75,
      hide: !columnVisibility.status,
    },
    {
      field: "companyname",
      headerName: "Refered By",
      flex: 0,
      width: 150,
      hide: !columnVisibility.status,
    },

    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 300,
      sortable: false,
      hide: !columnVisibility.actions,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("ereferacandidate") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.row.id, params.row.name);
              }}
              style={{ minWidth: "0px" }}
            >
              <EditOutlinedIcon style={{ fontSize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dreferacandidate") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vreferacandidate") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.row.id);
                handleClickOpenview();
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("ireferacandidate") && (
            <Button
              sx={userStyle.buttonview}
              onClick={() => {
                handleClickOpeninfo();
                getinfoCode(params.row.id);
              }}
            >
              <InfoOutlinedIcon style={{ fontSize: "large" }} />
            </Button>
          )}
        </Grid>
      ),
    },
  ];

  // Create a row data object for the DataGrid
  const rowDataTable = filteredData.map((ref, index) => {
    return {
      id: ref._id,
      serialNumber: ref.serialNumber,
      referingjob: ref.firstname + ref.lastname,
      emailid: ref.emailid,
      mobile: ref.mobile,
      relation: ref.relation,
      known: ref.known,
      files: ref.files,
      status: ref.status,
      companyname: ref.companyname,
    };
  });

  const handleShowAllColumns = () => {
    const updatedVisibility = { ...columnVisibility };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibility(updatedVisibility);
  };

  useEffect(() => {
    fetchRefercandidate();
  }, []);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  return (
    <Box>
      <Headtitle title={"REFER CANDIDATE"} />
      <Header />
      <Box className="content">
        {/* ****** Header Content ****** */}
        <Typography sx={userStyle.HeaderText}>Refer a Candidate</Typography>
        
        <>
          {isUserRoleCompare?.includes("areferacandidate") && (
              <Box sx={userStyle.selectcontainer}>
                <>
                  <Grid container spacing={2}>
                    <Grid item md={12} sm={12} xs={12}>
                      <>
                        {" "}
                        <Button
                          variant="outlined"
                          component="label"
                          style={{ justifyContent: "center !important" }}
                        >
                          <div>
                            {" "}
                            Upload Resume{" "}
                            <CloudUploadIcon sx={{ paddingTop: "5px" }} />
                          </div>
                          <input
                            hidden
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            accept=" application/pdf, image/*"
                          />
                        </Button>
                      </>
                    </Grid>
                    <>
                      <br />
                      <br />
                      <Grid
                        item
                        lg={6}
                        md={6}
                        sm={12}
                        xs={12}
                        sx={{ padding: "10px" }}
                      >
                        <br />
                        {files?.length > 0 &&
                          files.map((file, index) => (
                            <>
                              <Grid
                                container
                                spacing={2}
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <Grid item lg={6} md={6} sm={6} xs={6}>
                                  <Typography>{file.name}</Typography>
                                </Grid>
                                {/* <br/> */}
                                <Grid item lg={2} md={2} sm={2} xs={2}>
                                  <VisibilityOutlinedIcon
                                    style={{
                                      fontsize: "large",
                                      color: "#357AE8",
                                      marginLeft: "60px",
                                      marginTop: "-20px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => renderFilePreview(file)}
                                  />
                                </Grid>
                                <Grid item lg={2} md={2} sm={2} xs={2}>
                                  <Button
                                    style={{
                                      fontsize: "large",
                                      color: "#FF0000",
                                      marginLeft: "60px",
                                      marginTop: "-20px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleFileDelete(index)}
                                    size="small"
                                  >
                                    <CancelIcon />
                                  </Button>
                                </Grid>
                              </Grid>
                            </>
                          ))}
                      </Grid>
                    </>
                    <br />
                  </Grid>
                  <br />
                  <Grid item xs={12}>
                    <Typography sx={userStyle.SubHeaderText}>
                      <b> Job Recommendation </b>
                    </Typography>
                  </Grid>
                  <br />
                  <Grid container spacing={2}>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Refering for Job</Typography>
                        <TextField
                          size="small"
                          value={jobopenening.recruitmentname}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <br /> <br />
                  <Grid item xs={12}>
                    <Typography sx={userStyle.SubHeaderText}>
                      <b> Candidate Information</b>
                    </Typography>
                  </Grid>
                  <br /> <br />
                  <Grid container spacing={2}>
                    <Grid item md={4} xs={12} sm={12}>
                      <Grid container>
                        <Grid item md={3} xs={12} sm={12}>
                          <Typography>Mr</Typography>
                          <FormControl size="small" fullWidth>
                            <Select
                              labelId="demo-select-small"
                              id="demo-select-small"
                              placeholder="Mr."
                              value={refferal.prefix}
                              onChange={(e) => {
                                setRefferal({
                                  ...refferal,
                                  prefix: e.target.value,
                                });
                              }}
                            >
                              <MenuItem value="Mr">Mr</MenuItem>
                              <MenuItem value="Ms">Ms</MenuItem>
                              <MenuItem value="Mrs">Mrs</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item md={9} xs={12} sm={12}>
                          <Typography>Firstname</Typography>
                          <FormControl size="small" fullWidth>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              value={refferal.firstname}
                              onChange={(e) => {
                                setRefferal({
                                  ...refferal,
                                  firstname: e.target.value,
                                });
                              }}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>LastName</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={refferal.lastname}
                          onChange={(e) => {
                            setRefferal({
                              ...refferal,
                              lastname: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <br />
                  <Grid container spacing={2}>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>
                          Email Id <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="email"
                          value={refferal.emailid}
                          onChange={(e) => {
                            setRefferal({
                              ...refferal,
                              emailid: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Mobile</Typography>
                        <OutlinedInput
                          sx={userStyle.input}
                          id="component-outlined"
                          type="number"
                          value={refferal.mobile}
                          onChange={handleMobileChange}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <br /> <br />
                  <Grid item xs={12}>
                    <Typography sx={userStyle.SubHeaderText}>
                      <b> Additional Information</b>
                    </Typography>
                  </Grid>
                  <br />
                  <Grid container spacing={2}>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Relationship</Typography>
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
                          value={relationship}
                          onChange={(e) => {
                            setRelationship(e.target.value);
                          }}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                        >
                          <MenuItem value="Please Select Relationship" disabled>
                            {" "}
                            {"Please Select Relationship"}{" "}
                          </MenuItem>
                          <MenuItem value="Personally known">
                            {" "}
                            {"Personally known"}{" "}
                          </MenuItem>
                          <MenuItem value="Former Colleague">
                            {" "}
                            {"Former Colleague"}{" "}
                          </MenuItem>
                          <MenuItem value="Socially Connected">
                            {" "}
                            {"Socially Connected"}{" "}
                          </MenuItem>
                          <MenuItem value="Got the resume through a common friend">
                            {" "}
                            {"Got the resume through a common friend"}{" "}
                          </MenuItem>
                          <MenuItem value="Others"> {"Others"} </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Known Period</Typography>
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
                          value={knownperiod}
                          onChange={(e) => {
                            setKnownperiod(e.target.value);
                          }}
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                        >
                          <MenuItem value="Please Select Knownperiod" disabled>
                            {" "}
                            {"Please Select Knownperiod"}{" "}
                          </MenuItem>
                          <MenuItem value="Less than a year">
                            {" "}
                            {"Less than a year"}{" "}
                          </MenuItem>
                          <MenuItem value="1-2 years"> {"1-2 years"} </MenuItem>
                          <MenuItem value="3-5 years"> {"3-5 years"} </MenuItem>
                          <MenuItem value="5 years"> {"5 years"} </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <br />
                  <Grid container spacing={2}>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Notes</Typography>
                        <TextareaAutosize
                          aria-label="minimum height"
                          minRows={5}
                          value={refferal.notes}
                          onChange={(e) => {
                            setRefferal({ ...refferal, notes: e.target.value });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <br />
                  <br />
                  <Grid container>
                    <Grid item md={3} xs={12} sm={6}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleSubmit}
                        >
                          Submit Refferal
                        </Button>
                      
                    </Grid>
                    <Grid item md={3} xs={12} sm={6}>
                        <Button sx={userStyle.btncancel} onClick={handleclear}>
                          Clear
                        </Button>
                      
                    </Grid>
                  </Grid>
                </>
              </Box>
          )}
        </>
        {/* } */}
        <Box>
          {/* Edit DIALOG */}
          <Dialog
            open={isEditOpen}
            onClose={handleCloseModEdit}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="md"
            fullWidth={true}
          >
            <Box sx={{ padding: "20px 50px" }}>
              <>
                <Grid container spacing={2}>
                  <Typography sx={userStyle.HeaderText}>
                    Edit Refer a candidate
                  </Typography>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={12} sm={12} xs={12}>
                    <>
                      {" "}
                      <Button
                        variant="outlined"
                        component="label"
                        style={{ justifyContent: "center !important" }}
                      >
                        <div>
                          {" "}
                          Upload Resume{" "}
                          <CloudUploadIcon sx={{ paddingTop: "5px" }} />
                        </div>
                        <input
                          hidden
                          type="file"
                          multiple
                          onChange={handleFileUploadEdit}
                          accept=" application/pdf, image/*"
                        />
                      </Button>
                    </>
                  </Grid>
                  <>
                    <br />
                    <br />
                    <Grid
                      item
                      lg={6}
                      md={6}
                      sm={12}
                      xs={12}
                      sx={{ padding: "10px" }}
                    >
                      <br />
                      {fileEdit?.length > 0 &&
                        fileEdit.map((file, index) => (
                          <>
                            <Grid
                              container
                              spacing={2}
                              sx={{ display: "flex", justifyContent: "center" }}
                            >
                              <Grid item lg={6} md={6} sm={6} xs={6}>
                              
                                <Typography>{file.name}</Typography>
                              </Grid>
                              {/* <br/> */}
                              <Grid item lg={2} md={2} sm={2} xs={2}>
                                <VisibilityOutlinedIcon
                                  style={{
                                    fontsize: "large",
                                    color: "#357AE8",
                                    marginLeft: "60px",
                                    marginTop: "-20px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => renderFilePreviewEdit(file)}
                                />
                              </Grid>
                              <Grid item lg={2} md={2} sm={2} xs={2}>
                                <Button
                                  style={{
                                    fontsize: "large",
                                    color: "#FF0000",
                                    marginLeft: "60px",
                                    marginTop: "-20px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleFileDeleteEdit(index)}
                                  size="small"
                                >
                                  <CancelIcon />
                                </Button>
                              </Grid>
                            </Grid>
                          </>
                        ))}
                    </Grid>
                  </>
                  <br />
                </Grid>
                <br />
                <Grid item xs={12}>
                  <Typography sx={userStyle.SubHeaderText}>
                    <b> Job Recommendation</b>
                  </Typography>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Refering for Job</Typography>
                      <TextField
                        size="small"
                        value={refferalEdit.referingjob}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <br /> <br />
                <Grid item xs={12}>
                  <Typography sx={userStyle.SubHeaderText}>
                    <b> Candidate Information</b>
                  </Typography>
                </Grid>
                <br /> <br />
                <Grid container spacing={2}>
                  <Grid item md={12} lg={12} sm={12} xs={12}>
                    <Grid sx={{ display: "flex" }}>
                      <Grid item md={1} xs={12} sm={12}>
                        <Typography>Mr</Typography>
                        <FormControl size="small" fullWidth>
                          <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            placeholder="Mr."
                            value={refferalEdit.prefix}
                            onChange={(e) => {
                              setRefferaledit({
                                ...refferalEdit,
                                prefix: e.target.value,
                              });
                            }}
                          >
                            <MenuItem value="Mr">Mr</MenuItem>
                            <MenuItem value="Ms">Ms</MenuItem>
                            <MenuItem value="Mrs">Mrs</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        <Typography>Firstname</Typography>
                        <FormControl size="small" fullWidth>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={refferalEdit.firstname}
                            onChange={(e) => {
                              setRefferaledit({
                                ...refferalEdit,
                                firstname: e.target.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={4} xs={12} sm={12}>
                        <FormControl size="small" fullWidth>
                          <Typography>LastName</Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={refferalEdit.lastname}
                            onChange={(e) => {
                              setRefferaledit({
                                ...refferalEdit,
                                lastname: e.target.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                  <br />
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl size="small" fullWidth>
                      <Typography>
                        Email Id <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={refferalEdit.emailid}
                        onChange={(e) => {
                          setRefferaledit({
                            ...refferalEdit,
                            emailid: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl size="small" fullWidth>
                      <Typography>Mobile</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={refferalEdit.mobile}
                        onChange={handleMobileChangeEdit}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <br /> <br />
                <Grid item xs={12}>
                  <Typography sx={userStyle.SubHeaderText}>
                    <b> Additional Information</b>
                  </Typography>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Relationship</Typography>
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
                        value={relationshipEdit}
                        onChange={(e) => {
                          setRelationshipEdit(e.target.value);
                        }}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                      >
                        <MenuItem value="Please Select Relationship" disabled>
                          {" "}
                          {"Please Select Relationship"}{" "}
                        </MenuItem>
                        <MenuItem value="Personally known">
                          {" "}
                          {"Personally known"}{" "}
                        </MenuItem>
                        <MenuItem value="Former Colleague">
                          {" "}
                          {"Former Colleague"}{" "}
                        </MenuItem>
                        <MenuItem value="Socially Connected">
                          {" "}
                          {"Socially Connected"}{" "}
                        </MenuItem>
                        <MenuItem value="Got the resume through a common friend">
                          {" "}
                          {"Got the resume through a common friend"}{" "}
                        </MenuItem>
                        <MenuItem value="Others"> {"Others"} </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Known Period</Typography>
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
                        value={knownperiodEdit}
                        onChange={(e) => {
                          setKnownperiodEdit(e.target.value);
                        }}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                      >
                        <MenuItem value="Please Select Knownperiod" disabled>
                          {" "}
                          {"Please Select Knownperiod"}{" "}
                        </MenuItem>
                        <MenuItem value="Less than a year">
                          {" "}
                          {"Less than a year"}{" "}
                        </MenuItem>
                        <MenuItem value="1-2 years"> {"1-2 years"} </MenuItem>
                        <MenuItem value="3-5 years"> {"3-5 years"} </MenuItem>
                        <MenuItem value="5 years"> {"5 years"} </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl size="small" fullWidth>
                      <Typography>Notes</Typography>
                      <TextareaAutosize
                        aria-label="minimum height"
                        minRows={5}
                        value={refferalEdit.notes}
                        onChange={(e) => {
                          setRefferaledit({
                            ...refferalEdit,
                            notes: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <br />
                <br />
                <br /> <br />
                <Grid container spacing={2}>
                  <Grid item md={6} xs={12} sm={12}>
                    <Button variant="contained" onClick={editSubmit}>
                      {" "}
                      Update
                    </Button>
                  </Grid>
                  <br />
                  <Grid item md={6} xs={12} sm={12}>
                    <Button
                      sx={userStyle.btncancel}
                      onClick={handleCloseModEdit}
                    >
                      {" "}
                      Cancel{" "}
                    </Button>
                  </Grid>
                </Grid>
              </>
            </Box>
          </Dialog>
        </Box>
        <br />
        {/* ****** Table Start ****** */}
        {isUserRoleCompare?.includes("lreferacandidate") && (
          <>
            <Box sx={userStyle.container}>
              {/* ******************************************************EXPORT Buttons****************************************************** */}
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  List a Referral Candidate{" "}
                </Typography>
              </Grid>
              <Grid container sx={{ justifyContent: "center" }}>
                <Grid>
                  {isUserRoleCompare?.includes("excelreferacandidate") && (
                    <>
                      <ExportXL csvData={projectData} fileName={fileName} />
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvreferacandidate") && (
                    <>
                      <ExportCSV csvData={projectData} fileName={fileName} />
                    </>
                  )}
                  {isUserRoleCompare?.includes("printreferacandidate") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfreferacandidate") && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={() => downloadPdf()}
                      >
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
                    <MenuItem value={refList?.length}>All</MenuItem>
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
              <br />
              <br />

              <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                Show All Columns
              </Button>
              <br />
              <br />
              {/* {isLoader ? ( */}
              <>
                <Box style={{ width: "100%", overflowY: "hidden" }}>
                  <StyledDataGrid
                    rows={rowDataTable}
                    columns={columnDataTable}
                    autoHeight={true}
                    hideFooter
                    density="compact"
                  />
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
              </>
            </Box>
          </>
        )}
        {/* ****** Table End ****** */}

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
              <Typography
                variant="h5"
                sx={{ color: "red", textAlign: "center" }}
              >
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
                onClick={(e) => delProject(projectid)}
              >
                {" "}
                OK{" "}
              </Button>
            </DialogActions>
          </Dialog>

          {/* this is info view details */}
          <Dialog
            open={openInfo}
            onClose={handleCloseinfo}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <Box sx={{ width: "550px", padding: "20px 50px" }}>
              <>
                <Typography sx={userStyle.HeaderText}>
                  Refercandidate Info
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
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {"SNO"}.
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {" "}
                            {"UserName"}
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
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
                                {moment(item.date).format(
                                  "DD-MM-YYYY hh:mm:ss a"
                                )}
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
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {"SNO"}.
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {" "}
                            {"UserName"}
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
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
                                {moment(item.date).format(
                                  "DD-MM-YYYY hh:mm:ss a"
                                )}
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

          {/* print layout */}

          <TableContainer component={Paper} sx={userStyle.printcls}>
            <Table
              sx={{ minWidth: 700 }}
              aria-label="customized table"
              id="usertable"
              ref={componentRef}
            >
              <TableHead>
                <TableRow>
                  <TableCell>S.No</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Emailid</TableCell>
                  <TableCell>Mobile</TableCell>
                  <TableCell>Relationship</TableCell>
                  <TableCell>Knownperiod</TableCell>
                  <TableCell>Refering For Job</TableCell>
                  <TableCell>Resume</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Refered By</TableCell>
                </TableRow>
              </TableHead>
              <TableBody align="left">
                {refList &&
                  refList.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.firstname + row.lastname}</TableCell>
                      <TableCell>{row.emailid}</TableCell>
                      <TableCell>{row.mobile}</TableCell>
                      <TableCell>{row.relation}</TableCell>
                      <TableCell>{row.known}</TableCell>
                      <TableCell>{row.referingjob}</TableCell>
                      <TableCell>{row.resume}</TableCell>
                      <TableCell>{row.status}</TableCell>
                      <TableCell>{row.companyname}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* view model */}
        <Dialog
          open={openview}
          onClose={handleClickOpenview}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <Box sx={{ width: "550px", padding: "20px 50px" }}>
            <>
              <Typography sx={userStyle.HeaderText}>
                {" "}
                View Refercandidate Page
              </Typography>
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">
                      <b> Job Recommendation </b>
                    </Typography>
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6"> Refering for job</Typography>
                    <Typography>{refferalEdit.referingjob}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">
                      <b> Candidate Information</b>
                    </Typography>
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <Grid container spacing={2}>
                    <Grid item md={1} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6"> Mr</Typography>
                        <Typography>{refferalEdit.prefix}</Typography>
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6"> Firstname</Typography>
                        <Typography>{refferalEdit.firstname}</Typography>
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6"> LastName</Typography>
                        <Typography>{refferalEdit.lastname}</Typography>
                      </FormControl>
                    </Grid>
                    <br />
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6"> Email Id</Typography>
                        <Typography>{refferalEdit.emailid}</Typography>
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">Mobile</Typography>
                        <Typography>{refferalEdit.mobile}</Typography>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">
                      <b> Additional Information</b>
                    </Typography>
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6"> Relationship</Typography>
                    <Typography>{refferalEdit.relation}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Known Period</Typography>
                    <Typography>{refferalEdit.known}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Notes</Typography>
                    <Typography>{refferalEdit.notes}</Typography>
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
                ok
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </Box>
  );
}

export default Refercandidate;
