import CloseIcon from "@mui/icons-material/Close";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  Box,
  Button,
  Checkbox,
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
  Popover,
  Select,
  TextField,
  Typography,
  Dialog,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import moment from "moment";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../../components/Errorhandling";
import Headtitle from "../../../components/Headtitle";
import StyledDataGrid from "../../../components/TableStyle";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext.js";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice.js";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Link } from "react-router-dom";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { MultiSelect } from "react-multi-select-component";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import AlertDialog from "../../../components/Alert";
import ExportData from "../../../components/ExportData";
import MessageAlert from "../../../components/MessageAlert";

function CandidateMissingField() {
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
  };
  const handleClosePopupMalert = () => {
    setOpenPopupMalert(false);
  };
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  let exportColumnNames = [
    "Applicant Name",
    "Gender",
    "Contact No",
    "Email",
    "Aadhar Number",
    "DOB",
    "Education",
    "Skill",
    "Experience",
    "Missing Fields"
  ];
  let exportRowValues = [
    "fullname",
    "gender",
    "mobile",
    "email",
    "adharnumber",
    "dateofbirth",
    "qualification",
    "skill",
    "experience",
    "emptyfields",
  ];

  let obj = {
    prefix: "Prefix",
    firstname: " First Name",
    lastname: "Last Name",
    fullname: "Full Name",
    email: "Email",
    mobile: "Mobile Number",
    whatsapp: "Whats app",
    adharnumber: "Aadhar Number",
    pannumber: "Pan Number",
    age: "Age",
    dateofbirth: "DOB",
    street: "Street",
    country: "Country",
    state: "State",
    city: "City",
    postalcode: "Postal Code",
    experience: "Domain Experience",
    experienceestimation: "Overall Experience",
    domainexperienceestimation: "Domain Field Experience",
    expectedsalaryopts: "Expected Salary Options",
    joiningbydaysopts: "Joining By Days Options",
    domainexperience: "Domain Experience",
    additionalinfo: "Additional Info",
    joinbydays: "Joining By Days",
    noticeperiod: "Notice Period",
    certification: "Certification",
    uploadedimage: "Profile Image",
    currentemployer: "Current Employer",
    currentjobtitle: "Current Job Title",
    // uploadedimagename: "Profile Image",
    // files: "",
    interviewdate: "Interview Prefered Date",
    time: "Interview Prefered Time",
    gender: "Gender",
    // education: "Education",
    // category: "Educationn Category",
    // subcategory: "Educationn Sub Category",
    otherqualification: "",
    expectedsalary: "Expected Salary",
    currentsalary: "Current Salary",
    skillset: "Skill Set",
    linkedinid: "LinkedIn Id",
    // status: "",
    source: "Source",
    sourcecandidate: "Source Of Candidate",
    resumefile: "Resume",
    coverletterfile: "Cover Letter",
    candidatedatafile: "Candidate Document",
    // coverlettertext: "Cover Letter Text",
    experienceletterfile: "Experience Letter",
    payslipletterfile: "Pay Slip",
    educationdetails: "Educational Details",
    experiencedetails: "Experience Details",
    skill: "Skill",
    role: "Role",
    status: "Candidate Status"
  };

  let [valueSubModuleAdd, setValueSubModuleAdd] = useState("");

console.log(valueSubModuleAdd)

  const [selectedSubmodule, setselectedSubmodule] = useState([]);


  const handleSubModuleChangeAdd = (options) => {
    setValueSubModuleAdd(
      options.map(a => {
        return a.actualvalue;
      })
    )
    setselectedSubmodule(options);
  }

  const customValueRendererSubModuleAdd = (valueSubModuleAdd, _companies) => {
    return valueSubModuleAdd.length ? valueSubModuleAdd.map(({ label }) => label)?.join(",") :
      <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Missing Fields</span>
  }

  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");

  const [teamsArray, setTeamsArray] = useState([]);
  const { isUserRoleCompare } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [loader, setLoader] = useState(false);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
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
    removecandidate: false,
    adharnumber: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  //useEffect
  useEffect(() => {
    addSerialNumber();
  }, [teamsArray]);

  useEffect(() => {
    // fetchCandidates();
    fetchCandidatesAllFieldName();
    // fetchCandidatesAllFieldNameFilter();
  }, []);
  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };

  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  //Delete model

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };
  // Manage Columns
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
  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  //get all Asset Variant name.
  const fetchCandidates = async () => {
    try {
      setLoader(true);
      let response = await axios.post(
        SERVICE.CANDIDATES,
        {
          jobopeningsid: "",
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      setTeamsArray(response?.data?.allcandidate);
      setLoader(false);
    } catch (err) {
      setLoader(false);
      console.log(err);
      let error = err.response?.data?.message;
      if (error) {
        setPopupContentMalert(error);
        setPopupSeverityMalert("error");
        handleClickOpenPopupMalert();
      } else {
        handleApiError(err, setShowAlert, handleClickOpenerr);
      }
    }
  };

  const [subMissingfieldOptions, setMissingfield] = useState([])

  const fetchCandidatesAllFieldName = async () => {
    try {
      let response = await axios.get(SERVICE.CANDIDATESALLFIELDS);

      setMissingfield(response?.data?.allFieldNames?.map((item) => ({
        ...item,
        label: obj[item],
        value: obj[item],
        actualvalue: item
      })));
      console.log(response?.data?.allFieldNames.map(
        (field) =>
          obj[field] 
      ))

    } catch (err) {
      console.log(err);
      let error = err.response?.data?.message;
      if (error) {
        setPopupContentMalert(error);
        setPopupSeverityMalert("error");
        handleClickOpenPopupMalert();
      } else {
        handleApiError(err, setShowAlert, handleClickOpenerr);
      }
    }
  };

  const handleSubmit = () => {
    if (selectedSubmodule?.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Missing Fields!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      fetchCandidatesAllFieldNameFilter()
    }
  }

  const handleCleared = () => {
    setShowAlert(
      <>
        <ErrorOutlineOutlinedIcon
          sx={{ fontSize: "100px", color: "orange" }}
        />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>
          {"Cleared Successfully!"}
        </p>
      </>
    );
    handleClickOpenerr();
    setselectedSubmodule([])
    setTeamsArray([])
  }

  const fetchCandidatesAllFieldNameFilter = async () => {
    try {
      let response = await axios.post(SERVICE.CANDIDATESALLFIELDS_FILTER, {
        missingfield: selectedSubmodule,
      });

      console.log(response?.data);
      setTeamsArray(response?.data?.allEmptyFields);

    } catch (err) {
      console.log(err);
      let error = err.response?.data?.message;
      if (error) {
        setPopupContentMalert(error);
        setPopupSeverityMalert("error");
        handleClickOpenPopupMalert();
      } else {
        handleApiError(err, setShowAlert, handleClickOpenerr);
      }
    }
  };

  const [openMissingFields, setOpenMissingFields] = useState(false);
  const handleOpenMissingField = () => {
    setOpenMissingFields(true);
  };
  const handleCloseMissingField = () => {
    setOpenMissingFields(false);
  };
  const [missingFields, setMissingFields] = useState([]);
  const [documentMissingFields, setDocumentMissingFields] = useState([]);
  const [candidateName, setCandidateName] = useState("");
  const fetchCandidatesMissingField = async (id, name) => {
    try {
      let response = await axios.get(
        `${SERVICE.CANDIDATE_MISSINGFIELDS}/?id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      setMissingFields(response?.data?.emptyFields);
      //console.log(response?.data?.emptyFields);
      console.log(response?.data?.emptyFields, "emptyfields");

      setDocumentMissingFields(response?.data?.emptyDocumentFields);
      setCandidateName(name);
      handleOpenMissingField();
      //   setTeamsArray(response?.data?.allcandidate);
    } catch (err) {
      console.log(err);
      let error = err.response?.data?.message;
      if (error) {
        setPopupContentMalert(error);
        setPopupSeverityMalert("error");
        handleClickOpenPopupMalert();
      } else {
        handleApiError(err, setShowAlert, handleClickOpenerr);
      }
    }
  };

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "CandidateMissingField.png");
        });
      });
    }
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "CandidateMissingField",
    pageStyle: "print",
  });

  //serial no for listing items
  const addSerialNumber = () => {
    const itemsWithSerialNumber = teamsArray?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,

      fullname: `${item.prefix}.${item.fullname}`,
      mobile: item.mobile,
      email: item.email,
      dateofbirth: item?.dateofbirth
        ? moment(item?.dateofbirth).format("DD-MM-YYYY")
        : "",
      qualification: item?.educationdetails
        ?.map(
          (t, i) =>
            `${i + 1 + ". "}` +
            `${t.categoryedu} - ${t.subcategoryedu} - ${t.specialization}`
        )
        .toString(),
      skill: Array.isArray(item?.skill)
        ? item.skill.map((d) => (Array.isArray(d) ? d.join(",") : d))
        : [],
      experience: `${item?.experience} ${item?.experienceestimation == undefined
        ? "Years"
        : item?.experienceestimation
        }`,
      emptyfields: item?.emptyFields?.map(field => `${field.charAt(0).toUpperCase() + field.slice(1)}`),
    }));
    setItems(itemsWithSerialNumber);
  };
  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSelectedRows([]);
    setSelectAllChecked(false);
  };
  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setSelectedRows([]);
    setSelectAllChecked(false);
    setPage(1);
  };
  //datatable....
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
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
  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );
  const columnDataTable = [
    {
      field: "checkbox",
      headerName: "Checkbox", // Default header name
      headerStyle: {
        fontWeight: "bold", // Apply the font-weight style to make the header text bold
        // Add any other CSS styles as needed
      },
      renderHeader: (params) => (
        <CheckboxHeader
          selectAllChecked={selectAllChecked}
          onSelectAll={() => {
            if (rowDataTable.length === 0) {
              // Do not allow checking when there are no rows
              return;
            }
            if (selectAllChecked) {
              setSelectedRows([]);
            } else {
              const allRowIds = rowDataTable.map((row) => row.id);
              setSelectedRows(allRowIds);
            }
            setSelectAllChecked(!selectAllChecked);
          }}
        />
      ),

      renderCell: (params) => (
        <Checkbox
          checked={selectedRows.includes(params.row.id)}
          onChange={() => {
            let updatedSelectedRows;
            if (selectedRows.includes(params.row.id)) {
              updatedSelectedRows = selectedRows.filter(
                (selectedId) => selectedId !== params.row.id
              );
            } else {
              updatedSelectedRows = [...selectedRows, params.row.id];
            }
            setSelectedRows(updatedSelectedRows);
            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllChecked(
              updatedSelectedRows.length === filteredData.length
            );
          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 90,
      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 100,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
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
      field: "gender",
      headerName: "Gender",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.gender,
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
      field: "adharnumber",
      headerName: "Aadhar Number",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.adharnumber,
    },
    {
      field: "dateofbirth",
      headerName: "DOB",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.dateofbirth,
    },
    // {
    //   field: "qualification",
    //   headerName: "Education",
    //   flex: 0,
    //   width: 180,
    //   minHeight: "40px",
    //   hide: !columnVisibility.qualification,
    // },
    // {
    //   field: "skill",
    //   headerName: "Skill",
    //   flex: 0,
    //   width: 180,
    //   minHeight: "40px",
    //   hide: !columnVisibility.skill,
    // },
    // {
    //   field: "experience",
    //   headerName: "Experience",
    //   flex: 0,
    //   width: 180,
    //   minHeight: "40px",
    //   hide: !columnVisibility.experience,
    // },

    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 280,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("vcandidatemissingfields") && (
            <>
              <Button
                variant="contained"
                size="small"
                sx={{
                  height: "30px",
                  width: "120px",
                  fontSize: "0.75rem",
                  padding: "5px 10px",
                  minWidth: "unset",
                }}
                onClick={(e) => {
                  // setViewId(params.row.id);
                  // handleClickOpenView();
                  fetchCandidatesMissingField(
                    params.row.id,
                    params?.row?.fullname
                  );
                }}
              >
                VIEW
              </Button>
            </>
          )}
          {isUserRoleCompare?.includes("ecandidatemissingfields") && (
            <Link to={`/candidatemissingfield/edit/${params.row.id}/candidatemissingfield`}>
              <Button sx={userStyle.buttonedit}>
                <EditOutlinedIcon style={{ fontsize: "large" }} />
              </Button>
            </Link>
          )}
          {isUserRoleCompare?.includes("vcandidatemissingfields") && (
            <>
              <Link
                to={`/recruitment/viewresume/${params.row.id}/candidatemissingfield`}
              >
                <Button sx={userStyle.buttonedit}>
                  <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
                </Button>
              </Link>
            </>
          )}
        </Grid>
      ),
    },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      fullname: item.fullname,
      mobile: item.mobile,
      email: item.email,
      dateofbirth: item?.dateofbirth,
      qualification: item?.qualification,
      skill: item?.skill,
      experience: item?.experience,
      status: item.status,
      prefix: item?.prefix,
      gender: item?.gender,
      adharnumber: item?.adharnumber,

      //   company: singleJobData?.company,
      //   branch: singleJobData?.branch,
      //   designation: singleJobData?.designation,
    };
  });
  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRows.includes(row.id),
  }));
  // Show All Columns functionality
  const handleShowAllColumns = () => {
    setColumnVisibility(initialColumnVisibility);
  };
  // Function to filter columns based on search query
  const filteredColumns = columnDataTable.filter((column) =>
    column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
  );
  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };
  // JSX for the "Manage Columns" popover content
  const manageColumnsContent = (
    <Box
      style={{
        padding: "10px",
        minWidth: "325px",
        "& .MuiDialogContent-root": { padding: "10px 0" },
      }}
    >
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
          {filteredColumns.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={
                  <Switch
                    sx={{ marginTop: "-5px" }}
                    size="small"
                    checked={columnVisibility[column.field]}
                    onChange={() => toggleColumnVisibility(column.field)}
                  />
                }
                secondary={
                  column.field === "checkbox" ? "Checkbox" : column.headerName
                }
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
              {" "}
              Show All
            </Button>
          </Grid>
          <Grid item md={4}></Grid>
          <Grid item md={4}>
            <Button
              variant="text"
              sx={{ textTransform: "none" }}
              onClick={() => {
                const newColumnVisibility = {};
                columnDataTable.forEach((column) => {
                  newColumnVisibility[column.field] = false; // Set hide property to true
                });
                setColumnVisibility(newColumnVisibility);
              }}
            >
              {" "}
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

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


  return (
    <Box>
      <Headtitle title={"CANDIDATE MISSING FIELDS"} />
      <Typography sx={userStyle.HeaderText}>Candidate Missing Fields</Typography>

      <br />
      {/* ****** Table Start ****** */}
      <Box sx={userStyle.selectcontainer}>
        <>
          <Grid container spacing={2}>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                Candidate Fields<b style={{ color: "red" }}>*</b>
                </Typography>
                <MultiSelect
                  maxMenuHeight={300}
                  options={subMissingfieldOptions}
                  value={selectedSubmodule}
                  valueRenderer={customValueRendererSubModuleAdd}
                  onChange={handleSubModuleChangeAdd}
                />
              </FormControl>
            </Grid>
            <br />
            <br />
            <br />
          </Grid>
          <br />
          <br />
          <Grid
            container
            spacing={2}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Grid
              item
              md={1}
              xs={2}
              sm={2}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Filter
              </Button>
            </Grid>
            <Grid item lg={1} md={2} sm={2} xs={12}>
              <Button sx={userStyle.btncancel}
                onClick={handleCleared}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </>
      </Box>
      <br />
      <br />
      {isUserRoleCompare?.includes("lcandidatemissingfields") && (
        <>
          {loader ? (
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
            <Box sx={userStyle.container}>
              {/* ******************************************************EXPORT Buttons****************************************************** */}
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  List Candidate Missing Fields
                </Typography>
              </Grid>
              <Grid container spacing={2} style={userStyle.dataTablestyle}>
                <Grid item md={2} xs={12} sm={12}>
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
                      {/* <MenuItem value={teamsArray?.length}>
                      All
                    </MenuItem> */}
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
                      "excelcandidatemissingfields"
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
                      "csvcandidatemissingfields"
                    ) && (
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
                          </Button>
                        </>
                      )}
                    {isUserRoleCompare?.includes(
                      "printcandidatemissingfields"
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
                      "pdfcandidatemissingfields"
                    ) && (
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
                    {isUserRoleCompare?.includes(
                      "imagecandidatemissingfields"
                    ) && (
                        <Button
                          sx={userStyle.buttongrp}
                          onClick={handleCaptureImage}
                        >
                          {" "}
                          <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                          &ensp;Image&ensp;{" "}
                        </Button>
                      )}
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
              <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                Show All Columns
              </Button>
              &ensp;
              <Button
                sx={userStyle.buttongrp}
                onClick={handleOpenManageColumns}
              >
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
                <StyledDataGrid
                  // onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                  rows={rowsWithCheckboxes}
                  columns={columnDataTable.filter(
                    (column) => columnVisibility[column.field]
                  )}
                  onSelectionModelChange={handleSelectionChange}
                  selectionModel={selectedRows}
                  autoHeight={true}
                  ref={gridRef}
                  density="compact"
                  hideFooter
                  getRowClassName={getRowClassName}
                  disableRowSelectionOnClick
                />
              </Box>
              <Box style={userStyle.dataTablestyle}>
                <Box>
                  Showing{" "}
                  {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
                  {Math.min(page * pageSize, filteredDatas?.length)} of{" "}
                  {filteredDatas?.length} entries
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
          )}
        </>
      )}
      <Dialog
        open={openMissingFields}
        onClose={handleCloseMissingField}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        fullWidth={true}
      >
        <Box sx={userStyle.dialogbox}>
          <>
            <Typography sx={userStyle.HeaderText}>
              View Candidate Missing Fields
            </Typography>
            <br /> <br />
            <Grid sx={{ display: "flex", justifyContent: "around" }}>
              <Grid>
                <Typography sx={userStyle.SubHeaderText}>
                  Candidate Name: {candidateName}
                </Typography>
              </Grid>
            </Grid>
            <br />
            <Grid item md={12} sm={12} xs={12}>
              <br />
              {missingFields
                ?.filter((item) => obj[item])
                ?.map((data) => obj[data]).length > 0 ||
                documentMissingFields.length > 0 ? (
                <>
                  {missingFields
                    .filter(
                      (field) =>
                        obj[field] && !["updatedby", "__v"].includes(field)
                    ) // Filter and check if the field exists in the mapping object
                    .map((field, index) => (
                      <Typography
                        key={`missing-${index}`}
                        sx={{
                          margin: "5px 0",
                          padding: "10px",
                          backgroundColor: "#f5f5f5",
                          borderRadius: "5px",
                          textTransform: "capitalize", // Makes field names more readable
                        }}
                      >
                        {obj[field]}{" "}
                        {/* Display the field name from the mapping */}
                      </Typography>
                    ))}

                  {documentMissingFields.map((field, index) => (
                    <Typography
                      key={`doc-missing-${index}`}
                      sx={{
                        margin: "5px 0",
                        padding: "10px",
                        backgroundColor: "#f5f5f5",
                        borderRadius: "5px",
                        textTransform: "capitalize",
                      }}
                    >
                      {field} {/* Display missing document field name */}
                    </Typography>
                  ))}
                </>
              ) : (
                <Typography sx={{ color: "green", fontWeight: "bold" }}>
                  No missing fields
                </Typography>
              )}

              <Grid
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "15px",
                }}
              >
                <Button variant="contained" onClick={handleCloseMissingField}>
                  Back
                </Button>
              </Grid>
            </Grid>
          </>
        </Box>
      </Dialog>
      <Box>
        <Dialog
          open={isErrorOpen}
          onClose={handleCloseerr}
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
            <Typography
              variant="h6"
              style={{ fontSize: "20px", fontWeight: 900 }}
            >
              {showAlert}
            </Typography>
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

      {/* ****** Table End ****** */}
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
      <br />
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
        filename={"CandidateMissingField"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* EXTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}

export default CandidateMissingField;