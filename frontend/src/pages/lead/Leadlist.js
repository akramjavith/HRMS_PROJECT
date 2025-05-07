import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, TextareaAutosize, Typography, Checkbox, FormControlLabel, OutlinedInput, TableBody, TableRow, TableCell, List, ListItem, ListItemText, Popover, TextField, IconButton, Select, Paper, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button } from "@mui/material";
import { userStyle, colourStyles } from "../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Selects from "react-select";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import moment from "moment-timezone";
import StyledDataGrid from "../../components/TableStyle";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import { ThreeDots } from "react-loader-spinner";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Resizable from "react-resizable";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate } from "react-router-dom";
import { Country, State, City } from "country-state-city";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";

function LeadList({ first }) {
  //get single row to edit....

  const { isUserRoleCompare, isUserRoleAccess,isAssignBranch,allUnit, allTeam,allCompany,allBranch } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [leadList, setSetLeadList] = useState([])
  const [leadEditId, setleadEditId] = useState('')
  const [uploadShow, setUploadShow] = useState(false);
  const [errors, setErrors] = useState({});

  const [isClearOpenalert, setClearOpenAlert] = useState(false);
  const [isUpdatealert, setUpdateAlert] = useState(false);
  const [isDeletealert, setDeleteOpenAlert] = useState(false)

  //Datatable
  const [conditionCheckEdit, setConditionCheckEdit] = useState(false);
  const gridRef = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isValidEmail, setIsValidEmail] = useState();
  const [pageList, setPageList] = useState(1);
  const [pageSizeList, setPageSizeList] = useState(10);
  const [queueData, setQueueData] = useState([]);
  const [itemsList, setItemsList] = useState([]);
  const [searchQueryList, setSearchQueryList] = useState("");

  const [selectedCountryc, setSelectedCountryc] = useState([]);
  const [selectedStatec, setSelectedStatec] = useState([]);
  const [selectedCityc, setSelectedCityc] = useState([]);
  const [documentFiles, setdocumentFiles] = useState([]);
  const [documentEditFiles, setdocumentEditFiles] = useState([]);

  const [TextEditor, setTextEditor] = useState("");
  const [textShow, setTextShow] = useState(false);



  const [leadArray, setLeadArray] = useState([])
  const [leadEdit, setLeadEdit] = useState({
    prefix: "",
    firstname: "",
    lastname: "",
    emailid: "",
    phonenumber: "",
    fax: "",
    website: "",
    leadsource: "Please Select Leadsource",
    leadstatus: "Please Select Leadstatus",
    industrytype: "Please Select Industrytype",
    noofemployee: "",
    annualrevenue: "",
    rating: "",
    skypeid: "",
    secondaryemailid: "",
    twitterid: "",
    street: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
    description: "",
    leadaddedby: "",
    document: ""
  })

  const navigate = useNavigate()

  const [showAlert, setShowAlert] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  const handleResumeUpload = (event) => {
    const resume = event.target.files;
    for (let i = 0; i < resume?.length; i++) {
      const reader = new FileReader();
      const file = resume[i];
      reader.readAsDataURL(file);
      reader.onload = () => {
        setdocumentEditFiles((prevFiles) => [...prevFiles, { name: file.name, preview: reader.result, data: reader.result.split(",")[1], remark: "resume file" }]);

      };
    }
  };

  const handleFileDelete = (index) => {
    setdocumentFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));

    setdocumentEditFiles([]);
  };

  const handleTextSummary = (value) => {
    setTextEditor(value);
  };

  // clipboard
  const [copiedData, setCopiedData] = useState("");

  // State for manage columns search query
  const [searchQueryManage, setSearchQueryManage] = useState("");
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
  // Styles for the resizable column
  const ResizableColumn = styled(Resizable)`
    .react-resizable-handle {
      width: 10px;
      height: 100%;
      position: absolute;
      right: 0;
      bottom: 0;
      cursor: col-resize;
    }
  `;

  const [openInfo, setOpeninfo] = useState(false);
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };
  const [alluser, setalluser] = useState([]);

  // Edit start
  const [isEditOpenList, setIsEditOpenList] = useState(false);

  const handleClickOpenEditList = () => {
    setIsEditOpenList(true);
  };
  const handleCloseModEditList = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpenList(false);
    setLoading("");
    setFilterUser([]);
  };

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  //Delete model
  const handleClickOpenList = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseModList = () => {
    setIsDeleteOpen(false);
  };
  // View start
  const [openview, setOpenviewList] = useState(false);

  const handleClickOpenviewList = () => {
    setOpenviewList(true);
  };

  const handleCloseviewList = () => {
    setOpenviewList(false);
  };

  // fetch company
  const [companyOpt, setCompany] = useState([]);
  const [showdept, setShowDept] = useState(false);
  const [showBranch, setShowBranch] = useState(false);
  const [filterUser, setFilterUser] = useState([]);
  const [getUsers, setGetUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [loading, setLoading] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);

  const fetchCompany = async () => {
    try {
      let res = await axios.get(SERVICE.COMPANY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCompany([
        { label: "All", value: "All" },
        ...res?.data?.companies?.map((t) => ({
          ...t,
          label: t.name,
          value: t.name,
        })),
      ]);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };

  //Edit model...
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };

  const handleCloseModEdit = () => {
    setIsEditOpen(false);
  };


  // fetch unit wise data from Team

  // fetch unit wise data from Team


  // const HandleDefFilter = async (Hierachy, empids, ids, emps) => {
  //   setLoading("");
  //   try {
  //     let res = await axios.post(SERVICE.USERWISE_FILTER_ALL, {
  //       headers: {
  //         Authorization: `Bearer ${auth.APIToken}`,
  //       },
  //       company: Hierachy.company,
  //       designationgroup: Hierachy.designationgroup,
  //       department: Hierachy.department,
  //       branch: Hierachy.branch,
  //       unit: Hierachy.unit,
  //       team: Hierachy.team,
  //     });
  //     setFilterUser(res.data.users);
  //     const allRowIds = res.data.users.map((row) => row.empcode);
  //     let answer = empids[0] ? empids.length : [];
  //     const ans = answer.length == allRowIds.length;
  //     setSelectAll(ans);
  //     setGetUsers(res.data.users.filter((item) => empids.includes(item.empcode)).map((item) => item));
  //     setemployeeseditname(emps);
  //     setemployeeseditid(ids);
  //     setemployeeseditempid(empids);
  //     setSelectedRows(empids);
  //     setLoading("loaded");
  //     handleClickOpenEditList();
  //   } catch (err) {
  //     const messages = err?.response?.data?.message;
  //     if (messages) {
  //       setShowAlert(
  //         <>
  //           <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
  //           <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
  //         </>
  //       );
  //       handleClickOpenerr();
  //     } else {
  //       setShowAlert(
  //         <>
  //           <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
  //           <p style={{ fontSize: "20px", fontWeight: 900 }}>{"something Team  3  went wrong!"}</p>
  //         </>
  //       );
  //       handleClickOpenerr();
  //     }
  //   }
  // };



  // Info End
  let sno = 1;
  // this is the etimation concadination value
  const modifiedData = filterUser?.map((person) => ({
    ...person,
    sino: sno++,
  }));

  //serial no for listing items
  const addSerialNumber = () => {
    const itemsWithSerialNumber = modifiedData?.map((item, index) => ({ ...item, serialNumber: index + 1, id: index }));
    setItems(itemsWithSerialNumber);
  };



  useEffect(() => {
    addSerialNumber();
  }, [filterUser]);



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

  //CHECK BOX CHECKALL SELECTION
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
      setSelectAll(false);
      setGetUsers([]);
    } else {
      const allRowIds = filteredData.map((row) => row.empcode);
      setGetUsers(filteredData.filter((item) => allRowIds.includes(item.empcode)));
      setSelectedRows(allRowIds);
      setSelectAll(true);
    }
  };
  //CHECK BOX SELECTION
  const handleCheckboxChange = (id, row) => {
    let updatedSelectedRows = [...selectedRows];

    if (selectedRows.includes(id)) {
      updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== id);
    } else {
      updatedSelectedRows = [...selectedRows, id];
    }

    setGetUsers(filteredData.filter((item) => updatedSelectedRows.includes(item.empcode)));
    setSelectedRows(updatedSelectedRows);
    setSelectAll(updatedSelectedRows.length === filteredData.length);
  };

  // Split the search query into individual terms
  const searchOverTerms = searchQuery.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchOverTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
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



  //get all project.
  const fetchAllLeads = async () => {
    try {
      let res_queue = await axios.get(SERVICE.LEADS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const leadData = res_queue?.data?.leads.map((item) => ({
        id: item._id,
        firstname: `${item.prefix}.${item.firstname}`,
        lastname: item.lastname,
        emailid: item.emailid,
        phonenumber: item.phonenumber,
        fax: item.fax,
        website: item.website,
        leadsource: item.leadsource,
        leadstatus: item.leadstatus,
        industrytype: item.industrytype,
        noofemployee: item.noofemployee,
        annualrevenue: item.annualrevenue,
        rating: item.rating,
        skypeid: item.skypeid,
        secondaryemailid: item.secondaryemailid,
        twitterid: item.twitterid,
        street: item.street,
        selectedCityc: item.city,
        selectedStatec: item.state,
        selectedCountryc: item.country,
        zipcode: item.zipcode,
        description: item.description,
        leadaddedby: item.leadaddedby,

      }));


      setSetLeadList(leadData);

    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };


  useEffect(() => {
    fetchAllLeads();
  }, []);

  // const [employesseditname, setemployeeseditname] = useState([]);
  // const [employesseditid, setemployeeseditid] = useState([]);
  // const [employesseditempid, setemployeeseditempid] = useState([]);

  const getCodeList = async (id, ids, emps, empids) => {
    try {
      let res = await axios.get(`${SERVICE.HIRERARCHI_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setLeadEdit(res?.data?.slead);
      // HandleDefFilter(res?.data?.slead, empids, ids, emps);
      // handleClickOpenEditList();
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };
  let updateby = leadEdit.updatedby;
  let addedby = leadEdit.addedby;

  const username = isUserRoleAccess.username;


  // View end
  // Delete start
  const [deletequeueList, setDeleteQueueList] = useState();
  const rowDataList = async (ids) => {
    try {
      // let res = await axios.get(`${SERVICE.HIRERARCHI_SINGLE}/${id}`, {
      //   headers: {
      //     Authorization: `Bearer ${auth.APIToken}`,
      //   },
      // });
      setDeleteQueueList(ids);
      handleClickOpenList();
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };

  const delLead = async () => {
    try {
      await axios.delete(`${SERVICE.LEAD_SINGLE}/${deletequeueList}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchAllLeads();
      handleCloseModList()
      setDeleteOpenAlert(true);
      setTimeout(() => {
        setDeleteOpenAlert(false);
      }, 2000)
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages + "1"}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };

  const getCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.LEAD_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setLeadEdit(res?.data?.slead);
      setIsValidEmail(validateEmail(res?.data?.slead?.emailid));
      setleadEditId(e);
      handleClickOpenEdit();
      setdocumentFiles(res?.data?.slead?.document)
      const country = Country.getAllCountries().find((country) => country.name === res?.data?.slead?.country);
      const state = State.getStatesOfCountry(country?.isoCode).find((state) => state.name === res?.data?.slead?.state);
      const city = City.getCitiesOfState(state?.countryCode, state?.isoCode).find((city) => city.name === res?.data?.slead?.city);
      setSelectedCountryc(country);
      setSelectedStatec(state);
      setSelectedCityc(city);
      await fetchLeadAll();
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}>{"something 9went wrong!"}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
    }
  };

  // View start
  // get single row to view....
  const [viewEmployees, setViewemployees] = useState([]);
  const getviewCodeList = async (e, emps) => {
    try {
      let res = await axios.get(`${SERVICE.LEAD_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setLeadEdit(res?.data?.slead)
      setViewemployees(res?.data?.slead);
      handleClickOpenviewList();
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };
  // View End

  // Info start
  const getinfoCodeList = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.LEAD_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setLeadEdit(res?.data?.slead);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };

  // Info End
  let snos = 1;
  // this is the etimation concadination value
  const modifiedDataList = leadList?.map((person) => ({
    ...person,
    sino: snos++,
  }));

  //serial no for listing items
  const addSerialNumberList = () => {
    const itemsWithSerialNumber = leadList?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
    setItemsList(itemsWithSerialNumber);
  };

  const getRowClassNameList = (params) => {
    if (selectedRowsList.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  //Datatable
  const handlePageChangeList = (newPage) => {
    setPageList(newPage);
  };

  const handlePageSizeChangeList = (event) => {
    setPageSizeList(Number(event.target.value));
    setPageList(1);
  };

  //datatable....
  const handleSearchChangeList = (event) => {
    setSearchQueryList(event.target.value);
    setPageList(1);
  };

  // Split the search query into individual terms
  const searchOverTermsList = searchQueryList.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatasList = itemsList?.filter((item) => {
    return searchOverTermsList.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  const filteredDataList = filteredDatasList?.slice((pageList - 1) * pageSizeList, pageList * pageSizeList);

  const totalPagesList = Math.ceil(filteredDatasList?.length / pageSizeList);

  const visiblePagesList = Math.min(totalPagesList, 3);

  const firstVisiblePageList = Math.max(1, pageList - 1);
  const lastVisiblePageList = Math.min(firstVisiblePageList + visiblePagesList - 1, totalPagesList);
  const pageNumbersList = [];

  const indexOfLastItemList = pageList * pageSizeList;
  const indexOfFirstItemList = indexOfLastItemList - pageSizeList;

  for (let i = firstVisiblePageList; i <= lastVisiblePageList; i++) {
    pageNumbersList.push(i);
  }
  useEffect(() => {
    addSerialNumberList();
  }, [leadList]);


  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Branch",
    pageStyle: "print",
  });

  //  PDF
  const columns = [
    { title: "Firstname", field: "Firstname" },
    { title: "Lastname", field: "Lastname" },
    { title: "Emailid", field: "Emailid" },
    { title: "Phonenumber", field: "Phonenumber" },
    { title: "Fax", field: "Fax" },
    { title: "Website", field: "Website" },
    { title: "Leadsource", field: "Leadsource" },
    { title: "Leadstatus", field: "Leadstatus" },
    { title: "Industrytype", field: "Industrytype" },
    { title: "Noofemployee", field: "Noofemployee" },
    { title: "Annualrevenue", field: "Annualrevenue" },
    { title: "Rating", field: "Rating" },
    { title: "Leadaddedby", field: "Leadaddedby" },
  ];

  const downloadPdf = () => {
    const doc = new jsPDF();
    const columnsWithSerial = [
      // Serial number column
      { title: "SNo", dataKey: "serialNumber" },
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];

    const itemsWithSerial = rowDataTableList.map((t, i) => ({
      serialNumber: i + 1,
      Firstname: `${t.prefix}.${t.firstname}`,
      Lastname: t.lastname,
      Emailid: t.emailid,
      Phonenumber: t.phonenumber,
      Fax: t.fax,
      Website: t.website,
      Leadsource: t.leadsource,
      Leadstatus: t.leadstatus,
      Industrytype: t.industrytype,
      Noofemployee: t.noofemployee,
      Annualrevenue: t.annualrevenue,
      Rating: t.rating,
      Leadaddedby: t.leadaddedby
    }));

    doc.autoTable({
      theme: "grid",
      styles: {
        fontSize: 4,
      },
      columns: columnsWithSerial,
      body: itemsWithSerial,
    });
    doc.save("Lead.pdf");
  };

  const fileName = "Lead";
  let excelno = 1;
  // get particular columns for export excel




  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    checkbox: true,
    actions: true,
    serialNumber: true,
    firstname: true,
    lastname: true,
    emailid: true,
    phonenumber: true,
    fax: true,
    website: true,
    leadsource: true,
    leadstatus: true,
    industrytype: true,
    noofemployee: true,
    annuelrevenue: true,
    rating: true,
    leadaddedby: true,
    secondaryemailid: true,
    zipcode: true,
  };

  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );
  const [selectAllCheckedList, setSelectAllCheckedList] = useState(false);
  const [selectedRowsList, setSelectedRowsList] = useState([]);
  const [columnVisibilityList, setColumnVisibilityList] = useState(initialColumnVisibility);
  const columnDataTableList = [
    {
      field: "checkbox",
      headerName: "Checkbox", // Default header name
      headerStyle: {
        fontWeight: "bold", // Apply the font-weight style to make the header text bold
        // Add any other CSS styles as needed
      },
      renderHeader: (params) => (
        <CheckboxHeader
          selectAllChecked={selectAllCheckedList}
          onSelectAll={() => {
            if (rowDataTableList.length === 0) {
              return;
            }
            if (selectAllCheckedList) {
              setSelectedRows([]);
            } else {
              const allRowIds = rowDataTableList.map((row) => row.id);
              setSelectedRows(allRowIds);
            }
            setSelectAllCheckedList(!selectAllCheckedList);
          }}
        />
      ),
      renderCell: (params) => (
        <Checkbox
          checked={selectedRows.includes(params.row.id)}
          onChange={() => {
            let updatedSelectedRows;
            if (selectedRows.includes(params.row.id)) {
              updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.row.id);
            } else {
              updatedSelectedRows = [...selectedRows, params.row.id];
            }

            setSelectedRows(updatedSelectedRows);
            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllCheckedList(updatedSelectedRows.length === filteredDataList.length);
          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 90,
      hide: !columnVisibilityList.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 70,
      hide: !columnVisibilityList.serialNumber,
      headerClassName: "bold-header",
    },
    { field: "firstname", headerName: "First Name", flex: 0, width: 100, hide: !columnVisibilityList.firstname, headerClassName: "bold-header" },
    { field: "lastname", headerName: "Last Name", flex: 0, width: 100, hide: !columnVisibilityList.lastname, department: "bold-header" },
    { field: "emailid", headerName: "Email ID", flex: 0, width: 100, hide: !columnVisibilityList.emailid, headerClassName: "bold-header" },
    { field: "phonenumber", headerName: "Phone Number", flex: 0, width: 100, hide: !columnVisibilityList.phonenumber, headerClassName: "bold-header" },
    { field: "fax", headerName: "Fax", flex: 0, width: 100, hide: !columnVisibilityList.fax, headerClassName: "bold-header" },
    { field: "website", headerName: "Website", flex: 0, width: 100, hide: !columnVisibilityList.website, headerClassName: "bold-header" },
    { field: "leadsource", headerName: "Lead Source", flex: 0, width: 150, hide: !columnVisibilityList.leadsource, headerClassName: "bold-header" },
    { field: "leadstatus", headerName: "Lead Status", flex: 0, width: 150, hide: !columnVisibilityList.leadstatus, headerClassName: "bold-header" },
    { field: "industrytype", headerName: "Industry Type", flex: 0, width: 100, hide: !columnVisibilityList.industrytype, headerClassName: "bold-header" },
    { field: "noofemployee", headerName: "No Of Employee", flex: 0, width: 100, hide: !columnVisibilityList.noofemployee, headerClassName: "bold-header" },
    { field: "annualrevenue", headerName: "Annual Revenue", flex: 0, width: 100, hide: !columnVisibilityList.annuelrevenue, headerClassName: "bold-header" },
    { field: "rating", headerName: "Rating", flex: 0, width: 100, hide: !columnVisibilityList.rating, headerClassName: "bold-header" },
    { field: "leadaddedby", headerName: "Lead Added By", flex: 0, width: 100, hide: !columnVisibilityList.leadaddedby, headerClassName: "bold-header" },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0,
      width: 300,
      // minHeight: '40px !important',
      // sortable: false,
      hide: !columnVisibilityList.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("eleadlist") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                // Edit(params.row.id);
                getCode(params.row.id);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vleadlist") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCodeList(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("ileadlist") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpeninfo();
                getinfoCodeList(params.row.id);
              }}
            >
              <InfoOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dleadlist") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowDataList(params.row.id);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
        </Grid>
      ),
    },
  ];
  // Create a row data object for the DataGrid
  const rowDataTableList = filteredDataList.map((item, index) => {
    return {

      id: item.id,
      serialNumber: item.serialNumber,
      firstname: item.firstname,
      lastname: item.lastname,
      emailid: item.emailid,
      phonenumber: item.phonenumber,
      fax: item.fax,
      website: item.website,
      leadsource: item.leadsource,
      leadstatus: item.leadstatus,
      industrytype: item.industrytype,
      noofemployee: item.noofemployee,
      annualrevenue: item.annualrevenue,
      rating: item.rating,
      skypeid: item.skypeid,
      secondaryemailid: item.secondaryemailid,
      twitterid: item.twitterid,
      street: item.street,
      city: item.city,
      state: item.state,
      country: item.country,
      zipcode: item.zipcode,
      description: item.description,
      leadaddedby: item.leadaddedby,
    };
  });
  const rowsWithCheckboxes = rowDataTableList.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRowsList.includes(row.empids),
  }));

  const handleShowAllColumns = () => {
    const updatedVisibility = { ...columnVisibilityList };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibilityList(updatedVisibility);
  };
  const handleSelectionChange = (newSelection) => {
    setSelectedRowsList(newSelection.selectionModel);
  };

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "LeadList.png");
        });
      });
    }
  };

  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem("columnVisibilityList");
    if (savedVisibility) {
      setColumnVisibilityList(JSON.parse(savedVisibility));
    }
  }, []);

  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem("columnVisibilityList", JSON.stringify(columnVisibilityList));
  }, [columnVisibilityList]);

  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    setColumnVisibilityList((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  // Function to filter columns based on search query
  const filteredColumns = columnDataTableList.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));

  // JSX for the "Manage Columns" popover content
  const manageColumnsContent = (
    <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
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
        <TextField label="Find column" variant="standard" fullWidth value={searchQueryManage} onChange={(e) => setSearchQueryManage(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
      </Box>
      <br />
      <br />
      <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumns.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibilityList[column.field]} onChange={() => toggleColumnVisibility(column.field)} />}
                secondary={column.field === "checkbox" ? "Checkbox" : column.headerName}
              // secondary={column.headerName }
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Grid container>
          <Grid item md={4}>
            <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibilityList(initialColumnVisibility)}>
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
                columnDataTableList.forEach((column) => {
                  newColumnVisibility[column.field] = false; // Set hide property to true
                });
                setColumnVisibilityList(newColumnVisibility);
              }}
            >
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

  const validateEmail = (emailbranch) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(emailbranch);
  };

  const handleChangephonenumber = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setLeadEdit({ ...leadEdit, phonenumber: e.target.value });
    }
  };
  const handleChangenoofemployee = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setLeadEdit({ ...leadEdit, noofemployee: e.target.value });
    }
  };
  const handleChangeAnnualrevenue = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setLeadEdit({ ...leadEdit, annualrevenue: e.target.value });
    }
  };
  const handleChangezipcode = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setLeadEdit({ ...leadEdit, zipcode: e.target.value });
    }
  };

  const leadsource = ["Advertisement", "Coldcall", "Employee Referral", "Online Store", "Partner", "Public Relation", "Sales Email Alies", "Seminar Partner", "Internal Server", "Chat", "Trade Show", "Web Download", "Web Search"];
  const leadstatus = ["Attempted to Contact", "Contact In Future", "Contacted", "Junk Lead", "Lost Lead", "Not Contacted", "Pre Qualified", "Not Qualified"];
  const Industry = ["ASPC (Application Service Provider)", "Data/Telecom OEM", "ERP (Enterprise Resource Planning)", "Goverment/Military", "Large Enterprise", "MSP (Management Service Provider)", "Service Provider", "Optical Networking", "Small/Medium Enterprise", "Storage Equipment", "Storage Serrvice Provider", "ERP", "Management ISV", "Wireless Industry", "System Integators"];
  const rating = ["Acquired", "Active", "Market Failed", "Project Cancelled", "Shutdown"];
  const firstname = ["Mr", "Mrs", "Ms", "Dr", "Prof"];

  const leadsourceOpt =
    leadsource.map((data) => ({
      ...data,
      label: data,
      value: data,
    }));
  const leadstatusOpt =
    leadstatus.map((data) => ({
      ...data,
      label: data,
      value: data,
    }));
  const industryOpt =
    Industry.map((data) => ({
      ...data,
      label: data,
      value: data,
    }));
  const ratingOpt =
    rating.map((data) => ({
      ...data,
      label: data,
      value: data,
    }));
  const firstnameOpt =
    firstname.map((data) => ({
      ...data,
      label: data,
      value: data,
    }));

  const fetchLeadAll = async () => {
    try {
      let res_status = await axios.get(SERVICE.LEADS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setLeadArray(res_status?.data?.leads);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}>{"something 5 went wrong!"}</p>{" "}
          </>
        );
        handleClickOpenerr();
      }
    }
  };


  const sendEditRequest = async () => {
    try {
      let res = await axios.put(`${SERVICE.LEAD_SINGLE}/${leadEdit._id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        prefix: leadEdit.prefix,
        firstname: leadEdit.firstname,
        lastname: leadEdit.lastname,
        emailid: leadEdit.emailid,
        phonenumber: leadEdit.phonenumber,
        fax: leadEdit.fax,
        website: leadEdit.website,
        leadsource: leadEdit.leadsource,
        leadstatus: leadEdit.leadstatus,
        industrytype: leadEdit.industrytype,
        noofemployee: leadEdit.noofemployee,
        annualrevenue: leadEdit.annualrevenue,
        rating: leadEdit.rating,
        skypeid: leadEdit.skypeid,
        secondaryemailid: leadEdit.secondaryemailid,
        twitterid: leadEdit.twitterid,
        street: leadEdit.street,
        city: selectedCityc.name,
        state: selectedStatec.name,
        country: selectedCountryc.name,
        zipcode: leadEdit.zipcode,
        description: leadEdit.description,
        leadaddedby: leadEdit.leadaddedby,
        document: [...documentEditFiles],
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      // const country = Country.getAllCountries().find((country) => country.name === "India");
      //       const state = State.getStatesOfCountry(country?.isoCode).find((state) => state.name === "Tamil Nadu");
      //       const city = City.getCitiesOfState(state?.countryCode, state?.isoCode).find((city) => city.name === "Tiruchirappalli");
      //       setSelectedCountryp(country);
      //       setSelectedStatep(state);
      //       setSelectedCityp(city);

      await fetchAllLeads();
      handleCloseModEdit();
      setUpdateAlert(true)
      setTimeout(() => {
        setUpdateAlert(false)
      }, 1000)
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"7went wrong!"}</p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };
  const editSubmit = (e) => {
    const newErrors = {};

    e.preventDefault();
    fetchLeadAll();
    const isNameMatch = leadArray?.some((item) => item.firstname?.toLowerCase() == leadEdit.firstname?.toLowerCase() &&
      item.lastname.toLowerCase() == leadEdit.lastname.toLowerCase() &&
      item.emailid.toLowerCase() == leadEdit.emailid.toLowerCase() &&
      item.phonenumber == leadEdit.phonenumber.toString() && 
      item.fax.toLowerCase() === leadEdit.fax.toLowerCase() &&
      item.leadsource.toLowerCase() == leadEdit.leadsource.toLowerCase() &&
      item.leadstatus.toLowerCase() == leadEdit.leadstatus.toLowerCase() &&
      item.industrytype.toLowerCase() == leadEdit.industrytype.toLowerCase() &&
      item.street.toLowerCase() == leadEdit.street.toLowerCase() &&
      item.city.toLowerCase() == selectedCityc.name.toLowerCase() &&
      item.state.toLowerCase() == selectedStatec.name.toLowerCase() &&
      item.country.toLowerCase() == selectedCountryc.name.toLowerCase() && 
      item.zipcode == leadEdit.zipcode.toString()
    );

    if (leadEdit.firstname === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Firstname"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (leadEdit.lastname === '') {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Lastname"}</p>
        </>
      );
      handleClickOpenerr();
    }
    // else if (leadEdit.emailid !== "" && isValidEmail === false) {
    //     newErrors.email = <Typography style={{ color: "red" }}>Please enter valid email</Typography>;
    // }
    else if (leadEdit.emailid !== "" && isValidEmail === false) {
      newErrors.email = <Typography style={{ color: "red" }}>Please enter valid email</Typography>;
    }

    else if (leadEdit.emailid === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter EmailId"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (leadEdit.phonenumber === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter PhoneNumber"}</p>
        </>
      );
      handleClickOpenerr();
    }
    // else if (leadEdit.lastname === '') {
    //   setShowAlert(
    //     <>
    //       <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
    //       <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Lastname"}</p>
    //     </>
    //   );
    //   handleClickOpenerr();
    // }


    // else if (leadEdit.emailid === "") {
    //   setShowAlert(
    //     <>
    //       <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
    //       <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter EmailId"}</p>
    //     </>
    //   );
    //   handleClickOpenerr();
    // }
    // else if (leadEdit.phonenumber === "") {
    //   setShowAlert(
    //     <>
    //       <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
    //       <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter PhoneNumber"}</p>
    //     </>
    //   );
    //   handleClickOpenerr();
    // }
    // else if (leadEdit.fax === "") {
    //   setShowAlert(
    //     <>
    //       <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
    //       <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Fax"}</p>
    //     </>
    //   );
    //   handleClickOpenerr();
    // }
    // else if (lead.website === "") {
    //     setShowAlert(
    //         <>
    //             <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
    //             <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Website"}</p>
    //         </>
    //     );
    //     handleClickOpenerr();
    // }
    // else if (lead.leadsource === "") {
    //     setShowAlert(
    //         <>
    //             <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
    //             <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose LeadSource"}</p>
    //         </>
    //     );
    //     handleClickOpenerr();
    // }
    // else if (lead.leadstatus === "") {
    //     setShowAlert(
    //         <>
    //             <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
    //             <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose LeadStatus"}</p>
    //         </>
    //     );
    //     handleClickOpenerr();
    // }
    // else if (lead.industrytype === "") {
    //     setShowAlert(
    //         <>
    //             <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
    //             <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose IndustryType"}</p>
    //         </>
    //     );
    //     handleClickOpenerr();
    // }
    // else if (lead.noofemployee === "") {
    //     setShowAlert(
    //         <>
    //             <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
    //             <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter NoOfEmployee"}</p>
    //         </>
    //     );
    //     handleClickOpenerr();
    // }
    // else if (lead.annualrevenue === "") {
    //     setShowAlert(
    //         <>
    //             <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
    //             <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter AnnualRevenue"}</p>
    //         </>
    //     );
    //     handleClickOpenerr();
    // }
    // else if (lead.rating === "") {
    //     setShowAlert(
    //         <>
    //             <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
    //             <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose Rating"}</p>
    //         </>
    //     );
    //     handleClickOpenerr();
    // }
    // else if (lead.skypeid === "") {
    //     setShowAlert(
    //         <>
    //             <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
    //             <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter SkypeId"}</p>
    //         </>
    //     );
    //     handleClickOpenerr();
    // }
    // else if (lead.secondaryemail === "") {
    //     setShowAlert(
    //         <>
    //             <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
    //             <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter SecondaryEmail"}</p>
    //         </>
    //     );
    //     handleClickOpenerr();
    // }
    // else if (lead.twitterid === "") {
    //     setShowAlert(
    //         <>
    //             <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
    //             <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter TwiterId"}</p>
    //         </>
    //     );
    //     handleClickOpenerr();
    // }
    // else if (lead.street === "") {
    //     setShowAlert(
    //         <>
    //             <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
    //             <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Street"}</p>
    //         </>
    //     );
    //     handleClickOpenerr();
    // }
    // else if (selectedCountryp === "") {
    //     setShowAlert(
    //         <>
    //             <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
    //             <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose Country"}</p>
    //         </>
    //     );
    //     handleClickOpenerr();
    // }
    // else if (selectedStatep === "") {
    //     setShowAlert(
    //         <>
    //             <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
    //             <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose State"}</p>
    //         </>
    //     );
    //     handleClickOpenerr();
    // }
    // else if (selectedCityp === "") {
    //     setShowAlert(
    //         <>
    //             <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
    //             <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose City"}</p>
    //         </>
    //     );
    //     handleClickOpenerr();
    // }
    // else if (lead.zipcode === "") {
    //     setShowAlert(
    //         <>
    //             <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
    //             <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter ZipCode"}</p>
    //         </>
    //     );
    //     handleClickOpenerr();
    // }
    // else if (lead.description === "") {
    //     setShowAlert(
    //         <>
    //             <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
    //             <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Description"}</p>
    //         </>
    //     );
    //     handleClickOpenerr();
    // }
    else if (isNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Lead Already Exist!"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (leadEdit.street === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Street"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (selectedCountryc.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose Country"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (selectedStatec.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose State"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (selectedCityc.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose City"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (leadEdit.zipcode === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter ZipCode"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else {
      sendEditRequest();
    }
    setErrors(newErrors);
  };


  return (
    <>
      {isUserRoleCompare?.includes("lleadlist") && (
        <Box sx={userStyle.selectcontainer}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Typography sx={userStyle.SubHeaderText}>Lead List</Typography>
            </Grid>
            <Grid item xs={4}>

              <>
                <Link to="/addlead" style={{ textDecoration: "none", color: "white", float: "right" }}>
                  <Button variant="contained">ADD</Button>
                </Link>
              </>

            </Grid>
          </Grid>
          <Grid container spacing={2} style={userStyle.dataTablestyle}>
            <Grid item md={2} xs={12} sm={12}>
              <Box>
                <label>Show entries:</label>
                <Select
                  id="pageSizeSelect"
                  value={pageSizeList}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 180,
                        width: 80,
                      },
                    },
                  }}
                  onChange={handlePageSizeChangeList}
                  sx={{ width: "77px" }}
                >
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                  <MenuItem value={leadList?.length}>All</MenuItem>
                </Select>
              </Box>
            </Grid>
            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Grid container sx={{ justifyContent: "center" }}>
                <Grid>
                  {isUserRoleCompare?.includes("excelleadlist") && <ExportXL csvData={rowDataTableList.map((t, i) => ({
                    Sno: t.serialNumber,
                    Firstname: t.firstname,
                    Lastname: t.lastname,
                    Emailid: t.emailid,
                    Phonenumber: t.phonenumber,
                    Fax: t.fax,
                    Website: t.website,
                    Leadsource: t.leadsource,
                    Leadstatus: t.leadstatus,
                    Industrytype: t.industrytype,
                    Noofemployee: t.noofemployee,
                    Annualrevenue: t.annualrevenue,
                    Rating: t.rating,
                    Leadaddedby: t.leadaddedby,
                  }))} fileName={fileName} />}
                  {isUserRoleCompare?.includes("csvleadlist") && <ExportCSV csvData={rowDataTableList.map((t, i) => ({
                    Sno: t.serialNumber,
                    Firstname: t.firstname,
                    Lastname: t.lastname,
                    Emailid: t.emailid,
                    Phonenumber: t.phonenumber,
                    Fax: t.fax,
                    Website: t.website,
                    Leadsource: t.leadsource,
                    Leadstatus: t.leadstatus,
                    Industrytype: t.industrytype,
                    Noofemployee: t.noofemployee,
                    Annualrevenue: t.annualrevenue,
                    Rating: t.rating,
                    Leadaddedby: t.leadaddedby,
                  }))} fileName={fileName} />}
                  {isUserRoleCompare?.includes("printleadlist") && (
                    <Button sx={userStyle.buttongrp} onClick={handleprint}>
                      &ensp;
                      <FaPrint />
                      &ensp;Print&ensp;
                    </Button>
                  )}
                  {isUserRoleCompare?.includes("pdfleadlist") && (
                    <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}>
                      <FaFilePdf />
                      &ensp;Export to PDF&ensp;
                    </Button>
                  )}
                  {isUserRoleCompare?.includes("imageleadlist") && (
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                      {" "}
                      <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={2} xs={6} sm={6}>
              <Box>
                <FormControl fullWidth size="small">
                  <Typography>Search</Typography>
                  <OutlinedInput id="component-outlined" type="text" value={searchQueryList} onChange={handleSearchChangeList} />
                </FormControl>
              </Box>
            </Grid>
          </Grid>
          <br />
          <Grid sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            <Grid>

              <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                Show All Columns
              </Button>
              &ensp;
              <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
                Manage Columns
              </Button>
            </Grid>
            &ensp;
          </Grid>

          &ensp;
          <br />
          <br />
          <Box
            style={{
              width: "100%",
              overflowY: "hidden", // Hide the y-axis scrollbar
            }}
          >
            <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowsWithCheckboxes} columns={columnDataTableList.filter((column) => columnVisibilityList[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRowsList} autoHeight={true} ref={gridRef} density="compact" hideFooter getRowClassNameList={getRowClassNameList} disableRowSelectionOnClick />
          </Box>
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
          <Box style={userStyle.dataTablestyle}>
            <Box>
              Showing {filteredDataList.length > 0 ? (pageList - 1) * pageSizeList + 1 : 0} to {Math.min(pageList * pageSizeList, filteredDatasList.length)} of {filteredDatasList.length} entries
            </Box>
            <Box>
              <Button onClick={() => setPageList(1)} disabled={pageList === 1} sx={userStyle.paginationbtn}>
                <FirstPageIcon />
              </Button>
              <Button onClick={() => handlePageChangeList(pageList - 1)} disabled={pageList === 1} sx={userStyle.paginationbtn}>
                <NavigateBeforeIcon />
              </Button>
              {pageNumbersList?.map((pageNumber) => (
                <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChangeList(pageNumber)} className={pageList === pageNumber ? "active" : ""} disabled={pageList === pageNumber}>
                  {pageNumber}
                </Button>
              ))}
              {lastVisiblePageList < totalPagesList && <span>...</span>}
              <Button onClick={() => handlePageChangeList(pageList + 1)} disabled={pageList === totalPagesList} sx={userStyle.paginationbtn}>
                <NavigateNextIcon />
              </Button>
              <Button onClick={() => setPageList(totalPagesList)} disabled={pageList === totalPagesList} sx={userStyle.paginationbtn}>
                <LastPageIcon />
              </Button>
            </Box>
          </Box>
          <br />
          <br />

          <Box>
            <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
              <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
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
          {/* Edit Alert End */}

          {/* Edit DIALOG */}
          <Box>
            <Dialog open={isEditOpen}
              // onClose={handleCloseModEdit} 
              aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" fullWidth={true}>
              <Box sx={{ padding: "30px 50px" }}>
                <>
                  <Grid container spacing={2}>
                    <Typography sx={userStyle.HeaderText}>Edit Lead List</Typography>
                  </Grid>
                  <br />
                  <Grid container spacing={2}>
                    <Grid item md={3} sm={12} xs={12}>


                      <Typography>First Name<b style={{ color: "red" }}>*</b></Typography>



                      <Grid container sx={{ display: "flex" }}>
                        <Grid item md={5} sm={3} xs={3}>
                          <FormControl size="small" fullWidth>

                            <Selects
                              value={{ value: leadEdit.prefix, label: leadEdit.prefix }}
                              options={firstnameOpt}
                              onChange={(e) => {
                                setLeadEdit({ ...leadEdit, prefix: e.value });
                              }}
                            />
                          </FormControl>

                        </Grid>
                        <Grid item md={7} sm={9} xs={9}>
                          <FormControl size="small" fullWidth>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Please Enter First Name"
                              value={leadEdit.firstname}
                              onChange={(e) => {
                                const inputValue = e.target.value;
                                if (/^[a-zA-Z]+$/.test(inputValue) || inputValue === '') {
                                  setLeadEdit({
                                    ...leadEdit,
                                    firstname: inputValue,
                                  });
                                }
                              }}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Last Name <b style={{ color: "red" }}>*</b></Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Please Enter Last Name"
                          value={leadEdit.lastname}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            if (/^[a-zA-Z]+$/.test(inputValue) || inputValue === '') {
                              setLeadEdit({
                                ...leadEdit,
                                lastname: inputValue,
                              });
                            }
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl>

                        <FormControl fullWidth size="small">
                          <Typography>Email Id
                            <b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            placeholder="Please Enter Email"
                            value={leadEdit.emailid}
                            onChange={(e) => {
                              setLeadEdit({ ...leadEdit, emailid: e.target.value });
                              setIsValidEmail(validateEmail(e.target.value));
                            }}

                          />
                        </FormControl>
                        {errors.email && <div>{errors.email}</div>}
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Phone Number
                          <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Please Enter Phonenumber"
                          value={leadEdit.phonenumber?.slice(0, 10)}
                          onChange={(e) => {
                            handleChangephonenumber(e);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Fax
                          {/* <b style={{ color: "red" }}>*</b> */}
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Please Enter Fax"

                          value={leadEdit.fax}
                          onChange={(e) => {
                            setLeadEdit({ ...leadEdit, fax: e.target.value });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>WebSite
                          {/* <b style={{ color: "red" }}>*</b> */}
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Please Enter Website"

                          value={leadEdit.website}
                          onChange={(e) => {
                            setLeadEdit({ ...leadEdit, website: e.target.value });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Lead Source
                          <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          maxMenuHeight={250}
                          options={leadsourceOpt}
                          placeholder="Please Select Leadsource"
                          value={{ label: leadEdit.leadsource, value: leadEdit.leadsource }}
                          onChange={(e) => {
                            setLeadEdit({
                              ...leadEdit,
                              leadsource: e.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Lead Status
                          <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          maxMenuHeight={250}
                          options={leadstatusOpt}
                          placeholder="Please Select Leadstatus"
                          value={{ label: leadEdit.leadstatus, value: leadEdit.leadstatus }}
                          onChange={(e) => {
                            setLeadEdit({
                              ...leadEdit,
                              leadstatus: e.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Industry Type
                          <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          maxMenuHeight={250}
                          options={industryOpt}
                          placeholder="Please Select Frequency"
                          value={{ label: leadEdit.industrytype, value: leadEdit.industrytype }}
                          onChange={(e) => {
                            setLeadEdit({
                              ...leadEdit,
                              industrytype: e.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>No of Employees
                          {/* <b style={{ color: "red" }}>*</b> */}
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Please Enter Employee"
                          value={leadEdit.noofemployee}
                          onChange={(e) => {
                            handleChangenoofemployee(e);

                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Annual Revenue
                          {/* <b style={{ color: "red" }}>*</b> */}
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Please Enter Annualrevenue"
                          value={leadEdit.annualrevenue}
                          onChange={(e) => {
                            handleChangeAnnualrevenue(e);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Rating
                          {/* <b style={{ color: "red" }}>*</b> */}
                        </Typography>
                        <Selects
                          maxMenuHeight={250}
                          options={ratingOpt}
                          placeholder="Please Enter Rating"
                          value={{ label: leadEdit.rating, value: leadEdit.rating }}
                          onChange={(e) => {
                            setLeadEdit({
                              ...leadEdit,
                              rating: e.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Skype Id
                          {/* <b style={{ color: "red" }}>*</b> */}
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Please Enter Skype"
                          value={leadEdit.skypeid}
                          onChange={(e) => {
                            setLeadEdit({ ...leadEdit, skypeid: e.target.value });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Secondary Email
                          {/* <b style={{ color: "red" }}>*</b> */}
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Please Enter Email"
                          value={leadEdit.secondaryemailid}
                          onChange={(e) => {
                            setLeadEdit({ ...leadEdit, secondaryemailid: e.target.value });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Twitter ID
                          {/* <b style={{ color: "red" }}>*</b> */}
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Please Enter Twitter"
                          value={leadEdit.twitterid}
                          onChange={(e) => {
                            setLeadEdit({ ...leadEdit, twitterid: e.target.value });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}></Grid>

                    <Grid item xs={12}>
                      <Typography sx={userStyle.importheadtext}><b>Address Information</b></Typography>
                    </Grid>
                    <br />
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Street<b style={{ color: "red" }}>*</b></Typography>
                        <TextareaAutosize
                          aria-label="minimum height"
                          minRows={5}
                          value={leadEdit.street}
                          onChange={(e) => {
                            setLeadEdit({ ...leadEdit, street: e.target.value });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Country
                          <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          maxMenuHeight={250}
                          options={Country.getAllCountries()}
                          getOptionLabel={(options) => {
                            return options["name"];
                          }}
                          getOptionValue={(options) => {
                            return options["name"];
                          }}
                          value={selectedCountryc}
                          placeholder="Please Select Country"
                          onChange={(item) => {
                            setSelectedCountryc(item);
                            setSelectedStatec([]);
                            setSelectedCityc([]);
                          }}
                        />
                      </FormControl>






                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          State
                          <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          maxMenuHeight={250}
                          options={State?.getStatesOfCountry(selectedCountryc?.isoCode)}
                          getOptionLabel={(options) => {
                            return options["name"];
                          }}
                          getOptionValue={(options) => {
                            return options["name"];
                          }}
                          placeholder="Please Select State"
                          value={selectedStatec}
                          onChange={(item) => {
                            setSelectedStatec(item)
                            setSelectedCityc([]);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          City
                          <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          maxMenuHeight={250}
                          options={City.getCitiesOfState(selectedStatec?.countryCode, selectedStatec?.isoCode)}
                          getOptionLabel={(options) => {
                            return options["name"];
                          }}
                          getOptionValue={(options) => {
                            return options["name"];
                          }}
                          placeholder="Please Select City"
                          value={selectedCityc}
                          onChange={(item) => {
                            setSelectedCityc(item)
                          }}
                        />
                      </FormControl>
                    </Grid>


                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Zip Code
                          <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Please Enter Zipcode"
                          value={leadEdit.zipcode?.slice(0, 6)}
                          onChange={(e) => {
                            handleChangezipcode(e);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}></Grid>

                    <Grid item xs={12}>
                      <Typography sx={userStyle.importheadtext}><b>Description Information</b></Typography>
                    </Grid>
                    <br />
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Description</Typography>
                        <TextareaAutosize
                          aria-label="minimum height"
                          minRows={5}
                          value={leadEdit.description}
                          onChange={(e) => {
                            setLeadEdit({ ...leadEdit, description: e.target.value });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Lead Added By
                          {/* <b style={{ color: "red" }}>*</b></Typography> */}
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Please Enter Leadaddedby"
                          value={leadEdit.leadaddedby}
                          onChange={(e) => {
                            setLeadEdit({ ...leadEdit, leadaddedby: e.target.value });
                          }}
                        />
                      </FormControl>
                    </Grid>


                    <Grid item md={4} sm={12} xs={12}>

                      <Typography >Upload Document</Typography>
                      <Grid >
                        <Button variant="contained" size="small" component="label" sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                          Upload
                          <input
                            type="file"
                            id="resume"
                            accept=".xlsx, .xls, .csv, .pdf, .doc, .txt,"
                            name="file"
                            hidden
                            onChange={(e) => {
                              handleResumeUpload(e);
                              setTextEditor("");
                            }}
                          />
                        </Button>
                        <br />
                        <br />
                        {(documentFiles?.length > 0 || documentEditFiles?.length > 0) &&
                          (documentEditFiles?.length > 0
                            ? documentEditFiles.map((file, index) => (
                              <Grid container spacing={2} key={index}>
                                <Grid item md={4} sm={6} xs={6}>
                                  <Typography>{file.name}</Typography>
                                </Grid>
                                <Grid item md={2} sm={6} xs={6}>
                                  <VisibilityOutlinedIcon
                                    style={{
                                      fontSize: "large",
                                      color: "#357AE8",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => renderFilePreview(file)}
                                  />
                                </Grid>
                                <Grid item md={2} sm={6} xs={6}>
                                  <Button
                                    style={{
                                      fontSize: "large",
                                      color: "#357AE8",
                                      cursor: "pointer",
                                      marginTop: "-5px",
                                    }}
                                    onClick={() => handleFileDelete(index)}
                                  >
                                    <DeleteIcon />
                                  </Button>
                                </Grid>
                              </Grid>
                            ))
                            : documentFiles.map((file, index) => (
                              <Grid container spacing={2} key={index}>
                                <Grid item md={4} sm={6} xs={6}>
                                  <Typography>{file.name}</Typography>
                                </Grid>
                                <Grid item md={2} sm={6} xs={6}>
                                  <VisibilityOutlinedIcon
                                    style={{
                                      fontSize: "large",
                                      color: "#357AE8",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => renderFilePreview(file)}
                                  />
                                </Grid>
                                <Grid item md={2} sm={6} xs={6}>
                                  <Button
                                    style={{
                                      fontSize: "large",
                                      color: "#357AE8",
                                      cursor: "pointer",
                                      marginTop: "-5px",
                                    }}
                                    onClick={() => handleFileDelete(index)}
                                  >
                                    <DeleteIcon />
                                  </Button>
                                </Grid>
                              </Grid>
                            )))}

                        {/* {documentFiles?.length > 0 || documentEditFiles?.length > 0
                      documentFiles.map((file, index) => (
                        <>
                          <Grid container spacing={2}>
                            <Grid item  md={4} sm={6} xs={6}>
                              <Typography>{file.name}</Typography>
                            </Grid>
                            <Grid></Grid>
                            <Grid item  md={2} sm={6} xs={6}>
                              <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreview(file)} />
                            </Grid>
                            <Grid item  md={2} sm={6} xs={6}>
                              <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDelete(index)}>
                                <DeleteIcon />
                              </Button>
                            </Grid>
                          </Grid>
                        </>
                      ))} */}
                      </Grid>
                    </Grid>

                  </Grid>
                  <br /> <br />
                  <Grid container spacing={2}>
                    <Grid item md={6} xs={12} sm={12}>
                      <Button variant="contained"
                        onClick={editSubmit}
                      >
                        {" "}
                        Update
                      </Button>
                    </Grid>
                    <br />
                    <Grid item md={6} xs={12} sm={12}>
                      <Button sx={userStyle.btncancel}
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
          {/* view model */}
          <Dialog open={openview} onClose={handleClickOpenviewList} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md">
            <Box sx={{ padding: "30px 50px" }}>
              <>
                <Typography sx={userStyle.HeaderText}> Lead List</Typography>
                <br /> <br />
                <Grid container spacing={2}>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">First Name</Typography>
                      <Typography>{`${leadEdit.prefix}.${leadEdit.firstname}`}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Last Name</Typography>
                      <Typography>{leadEdit.lastname}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Emailid</Typography>
                      <Typography>{leadEdit.emailid}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Phonenumber</Typography>
                      <Typography>{leadEdit.phonenumber}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Fax</Typography>
                      <Typography>{leadEdit.fax}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Website</Typography>
                      <Typography>{leadEdit.website}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Leadsource</Typography>
                      <Typography>{leadEdit.leadsource}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Lead Status</Typography>
                      <Typography>{leadEdit.leadstatus}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Industry Type</Typography>
                      <Typography>{leadEdit.industrytype}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> No of Employee</Typography>
                      <Typography>{leadEdit.noofemployee}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Annual Revenue</Typography>
                      <Typography>{leadEdit.annualrevenue}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Rating</Typography>
                      <Typography>{leadEdit.rating}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Lead Added By</Typography>
                      <Typography>{leadEdit.leadaddedby}</Typography>
                    </FormControl>
                  </Grid>
                </Grid>
                <br /> <br /> <br />
                <Grid container spacing={2}>
                  <Button variant="contained" color="primary" onClick={handleCloseviewList}>
                    Back
                  </Button>
                </Grid>
              </>
            </Box>
          </Dialog>

          {/* this is info view details */}
          <Dialog open={openInfo} onClose={handleCloseinfo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md">
            <Box sx={{ padding: "30px 50px" }}>
              <>
                <Typography sx={userStyle.HeaderText}>Lead List Info</Typography>
                <br />
                <br />
                <Grid container spacing={4}>
                  <Grid item md={12} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">addedby</Typography>
                      <br />
                      <Table>
                        <TableHead>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"UserName"}</StyledTableCell>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                        </TableHead>
                        <TableBody>
                          {addedby?.map((item, i) => (
                            <StyledTableRow>
                              <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                              <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                              <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
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
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"UserName"}</StyledTableCell>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                        </TableHead>
                        <TableBody>
                          {updateby?.map((item, i) => (
                            <StyledTableRow>
                              <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                              <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                              <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
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
            <Table sx={{ minWidth: 1000 }} aria-label="simple table" id="branch" ref={componentRef}>
              <TableHead sx={{ fontWeight: "600" }}>
                <TableRow>
                  <TableCell>SI.NO</TableCell>
                  <TableCell>Fristname</TableCell>
                  <TableCell>Lastname </TableCell>
                  <TableCell>Emailid</TableCell>
                  <TableCell>Phonenumber</TableCell>
                  <TableCell>Fax</TableCell>
                  <TableCell>Website</TableCell>
                  <TableCell>Leadsource</TableCell>
                  <TableCell>Leadstatus</TableCell>
                  <TableCell>Industrytype</TableCell>
                  <TableCell>Noofemployee</TableCell>
                  <TableCell>Annualrevenue</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Leadaddedby</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rowDataTableList &&
                  rowDataTableList.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.firstname}</TableCell>
                      <TableCell>{row.lastname} </TableCell>
                      <TableCell>{row.emailid}</TableCell>
                      <TableCell>{row.phonenumber}</TableCell>
                      <TableCell>
                        {row.fax}
                      </TableCell>
                      <TableCell>{row.website} </TableCell>
                      <TableCell>{row.leadsource}</TableCell>
                      <TableCell>{row.leadstatus}</TableCell>
                      <TableCell>{row.industrytype}</TableCell>
                      <TableCell>{row.noofemployee}</TableCell>
                      <TableCell>{row.annualrevenue}</TableCell>
                      <TableCell>{row.rating}</TableCell>
                      <TableCell>{row.leadaddedby}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          {/* Update DIALOG */}
          <Dialog open={isUpdatealert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogContent sx={{ padding: "37px 23px", width: "350px", textAlign: "center", alignItems: "center" }}>
              <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
              <Typography variant="h6"><b>Updated Successfully👍</b></Typography>
            </DialogContent>
          </Dialog>
          {/* Delete DIALOG */}
          <Dialog open={isDeletealert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogContent sx={{ padding: "37px 23px", width: "350px", textAlign: "center", alignItems: "center" }}>
              <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
              <Typography variant="h6"><b>Deleted Successfully👍</b></Typography>
            </DialogContent>
          </Dialog>
          {/*DELETE ALERT DIALOG */}
          <Dialog open={isDeleteOpen} onClose={handleCloseModList} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
              <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
              <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                Are you sure?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  handleCloseModList();
                }}

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
              <Button autoFocus variant="contained" color="error" onClick={(e) => delLead()}>
                {" "}
                OK{" "}
              </Button>
            </DialogActions>
          </Dialog>

        </Box>
      )}
    </>
  );
}

export default LeadList;
