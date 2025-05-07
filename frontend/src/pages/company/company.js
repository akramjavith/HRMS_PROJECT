import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, Dialog, Select, MenuItem, TableRow, DialogContent, DialogActions, FormControl, Grid, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle } from "../../pageStyle";
import StyledDataGrid from "../../components/TableStyle";
import { SERVICE } from "../../services/Baseservice";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import "jspdf-autotable";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { saveAs } from "file-saver";
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';
import { FaFileCsv, FaFileExcel, FaPrint, FaFilePdf } from "react-icons/fa";
import LoadingButton from "@mui/lab/LoadingButton";
import { handleApiError } from "../../components/Errorhandling";
import ExportData from "../../components/ExportData";
import AlertDialog from "../../components/Alert";
import MessageAlert from "../../components/MessageAlert";
import InfoPopup from "../../components/InfoPopup.js";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import PageHeading from "../../components/PageHeading";

function Company() {
  const pathname = window.location.pathname;
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
  const handleClickOpenPopup = () => {
    setOpenPopup(true);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  let exportColumnNames = ['Code', 'Name'];
  let exportRowValues = ['code', 'name'];

  const [company, setCompany] = useState({ code: "", name: "" });
  const { isUserRoleAccess, pageName, setPageName, isAssignBranch, buttonStyles } = useContext(UserRoleAccessContext);
  const username = isUserRoleAccess.username;
  const [companies, setCompanies] = useState([]);
  const [allCompanyedit, setAllCompanyedit] = useState([]);
  const [areatid, setAreatid] = useState({});
  const [areaviewid, setAreaviewid] = useState({});
  const { isUserRoleCompare } = useContext(UserRoleAccessContext);
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState('');
  const [searchQuery, setSearchQuery] = useState("");
  const [isBtn, setIsBtn] = useState(false);
  const [overallExcelDatas, setOverallExcelDatas] = useState([])
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  // const accessbranch = isAssignBranch?.map((data) => ({
  //   branch: data.branch,
  //   company: data.company,
  //   unit: data.unit,
  // }));
  const accessbranch = isUserRoleAccess?.role?.includes("Manager")
    ? isAssignBranch?.map((data) => ({
      branch: data.branch,
      company: data.company,
      unit: data.unit,
    }))
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
        unit: data.unit,
      }));

  const [fileFormat, setFormat] = useState('')

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };
  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, 'Company.png');
        });
      });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Company"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),
      addedby: [
        {
          name: String(isUserRoleAccess?.username),
          date: String(new Date()),
        },
      ],
    });
  }

  useEffect(() => {
    getapi();
  }, []);

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { auth } = useContext(AuthContext);
  const [ovProj, setOvProj] = useState("");
  const [ovProjCount, setOvProjCount] = useState("");
  const [getOverAllCount, setGetOverallCount] = useState("");
  const [isCompany, setIsCompany] = useState(false);

  // Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };
  // Error Popup model
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showAlertpop, setShowAlertpop] = useState();
  const handleClickOpenerrpop = () => {
    setIsErrorOpenpop(true);
  };
  const handleCloseerrpop = () => {
    setIsErrorOpenpop(false);
  };
  // view model
  const [openview, setOpenview] = useState(false);

  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
  };

  //check delete model
  const [isCheckOpen, setisCheckOpen] = useState(false);
  const handleClickOpenCheck = () => {
    setisCheckOpen(true);
  };
  const handleCloseCheck = () => {
    setisCheckOpen(false);
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  //Edit model...
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
  };

  const [overallDeletelength, setOveralldeletelength] = useState([]);

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const handleClickOpenalert = async () => {
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      let res = await axios.post(`${SERVICE.COMPANY_OVERALLDELETE}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        id: selectedRows
      });
      setOveralldeletelength(res?.data?.final);
      if (res.data?.filteredArray?.length > 0) {

        setPopupContentMalert("These datas is linked in branch page, the remaining datas will be deleted with confirmation ");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
      else if (res.data?.final.length > 0) {
        setIsDeleteOpencheckbox(true);
      }
      // else {
      // }
    }
  };
  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };

  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  };

  // Manage Columns
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null)

  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
    setSearchQueryManage("")
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const getRowClassName = (params) => {
    if ((selectedRows).includes(params.row.id)) {
      return 'custom-id-row'; // This is the custom class for rows with item.tat === 'ago'
    }
    return ''; // Return an empty string for other rows
  };

  // Show All Columns & Manage Columns 
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    code: true,
    name: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  //get single row to edit....
  const getCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.COMPANY_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      fetchBranch();
      setAreatid(res?.data?.scompany);
      setOvProj(res?.data?.scompany?.name);
      getOverallEditSection(res?.data?.scompany?.name);
      handleClickOpenEdit();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  // get single row to edit....
  const getviewCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.COMPANY_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAreaviewid(res?.data?.scompany);
      handleClickOpenview();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.COMPANY_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAreatid(res?.data?.scompany);
      handleClickOpeninfo();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  // page refersh reload code
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

  // get all branches
  const fetchBranch = async () => {
    setPageName(!pageName);

    try {
      let res_branch = await axios.post(SERVICE.COMPANYACCESS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assignbranch: accessbranch,
        role: isUserRoleAccess.role
      });

      setCompanies(res_branch?.data?.companies);
      console.log(res_branch?.data?.companies, 'gdg')
      setIsCompany(true);
    } catch (err) { setIsCompany(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  // get all branches
  const fetchOverallExcelDatas = async () => {
    setPageName(!pageName);
    try {
      let res_branch = await axios.post(SERVICE.COMPANYACCESS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assignbranch: accessbranch,
        role: isUserRoleAccess.role
      });

      setOverallExcelDatas(res_branch?.data?.companies);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  useEffect(() => {
    fetchOverallExcelDatas();
  }, [isFilterOpen])
  // get all branches
  const fetchBranchAll = async () => {
    setPageName(!pageName);
    try {
      let res_branch = await axios.post(SERVICE.COMPANYACCESS,
        {
          assignbranch: accessbranch,
          role: isUserRoleAccess.role
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      setIsCompany(true);
      setAllCompanyedit(res_branch?.data?.companies.filter((item) => item._id !== areatid._id));
    } catch (err) { setIsCompany(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const [deletebranch, setDeletebranch] = useState({});


  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
    setIsBtn(false)
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
    setIsBtn(false)
  };

  const [checkBranch, setCheckBranch] = useState();
  const [checkUser, setCheckUser] = useState();

  //set function to get particular row
  const rowData = async (id, name) => {
    setPageName(!pageName);
    try {
      const [res, resdev, resuser] = await Promise.all([
        axios.get(`${SERVICE.COMPANY_SINGLE}/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.post(SERVICE.BRANCHNAMECHECK, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          checkbranch: String(name),
        }),
        axios.post(SERVICE.USERCHECK, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          checkuser: String(name),
        })
      ])
      setDeletebranch(res?.data?.scompany);
      setCheckBranch(resdev?.data?.branch);
      setCheckUser(resuser?.data?.users);

      if ((resdev?.data?.branch).length > 0 || (resuser?.data?.users).length > 0) {
        handleClickOpenCheck();
      } else {
        handleClickOpen();
      }
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  // Alert delete popup
  let branchid = deletebranch._id;
  const delCompany = async () => {
    setPageName(!pageName);
    try {
      await axios.delete(`${SERVICE.COMPANY_SINGLE}/${branchid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchBranch();
      setSelectedRows([]);
      setPage(1);
      handleCloseMod();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const delCompanycheckbox = async () => {
    setPageName(!pageName);
    try {
      const deletePromises = overallDeletelength?.map((item) => {
        return axios.delete(`${SERVICE.COMPANY_SINGLE}/${item}`, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          }
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);

      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);

      await fetchBranch();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();

    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //print...
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Company",
    pageStyle: "print",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const isNameMatch = companies.some((item) => item.name.toLowerCase() === company?.name?.toLowerCase());
    const isCodeMatch = companies.some((item) => item?.code?.toLowerCase()?.replaceAll(" ", "") === company?.code?.toLowerCase()?.replaceAll(" ", ""));

    if (company.code === "") {
      setPopupContentMalert("Please Enter Code");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (company.name === "") {
      setPopupContentMalert("Please Enter Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Name already exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isCodeMatch) {
      setPopupContentMalert("Code already exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };

  const sendRequest = async () => {
    setPageName(!pageName);
    setIsBtn(true)
    try {
      let companies = await axios.post(SERVICE.COMPANY_CREATE, {
        code: String(company.code),
        name: String(company.name),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchBranch();
      setCompany(companies.data);
      setCompany({ code: "", name: "" });
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setIsBtn(false)

    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setCompany({ code: "", name: "" });
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  }

  //floor updateby edit page...
  let updateby = areatid.updatedby;
  let addedby = areatid.addedby;

  let companyid = areatid._id;

  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.put(`${SERVICE.COMPANY_SINGLE}/${companyid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        code: String(areatid.code),
        name: String(areatid.name),
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchBranch();
      await fetchBranchAll();
      setAreatid(res.data);
      await getOverallEditSectionUpdate();
      handleCloseModEdit();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const editSubmit = (e) => {
    e.preventDefault();
    fetchBranchAll();
    const isNameMatch = allCompanyedit.some((item) => item.name.toLowerCase() === areatid?.name?.toLowerCase());
    const isCodeMatch = allCompanyedit.some((item) => item?.code?.toLowerCase()?.replaceAll(" ", "") === areatid?.code?.toLowerCase()?.replaceAll(" ", ""));

    if (areatid.code === "") {
      setPopupContentMalert("Please Enter Code");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (areatid.name === "") {
      setPopupContentMalert("Please Enter Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isCodeMatch) {
      setPopupContentMalert("Code already exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Name already exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (areatid.name != ovProj && ovProjCount > 0) {
      setShowAlertpop(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{getOverAllCount}</p>
        </>
      );
      handleClickOpenerrpop();
    } else {
      sendEditRequest();
    }
  };

  //overall edit section for all pages
  const getOverallEditSection = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.OVERALL_COMPANY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: e,
      });
      setOvProjCount(res?.data?.count);
      setGetOverallCount(`The ${e} is linked in ${res?.data?.users?.length > 0 ? "Add Employee ," : ""}
         ${res?.data?.branch?.length > 0 ? "Branch ," : ""}
         ${res?.data?.hierarchy?.length > 0 ? "Hierarchy ," : ""}
          whether you want to do changes ..??`);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  //overall edit section for all pages
  const getOverallEditSectionUpdate = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.OVERALL_COMPANY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: ovProj,
      });
      sendEditRequestOverall(res?.data?.users, res?.data?.branch, res?.data?.hierarchy);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const sendEditRequestOverall = async (user, branch, hierarchy) => {
    setPageName(!pageName);
    try {
      if (user.length > 0) {
        let answ = user.map((d, i) => {
          let res = axios.put(`${SERVICE.USER_SINGLE_PWD}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            company: String(areatid.name),
          });
        });
      }
      if (branch.length > 0) {
        let answ = branch.map((d, i) => {
          let res = axios.put(`${SERVICE.BRANCH_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            company: String(areatid.name),
          });
        });
      }
      if (hierarchy.length > 0) {
        let answ = hierarchy.map((d, i) => {
          let res = axios.put(`${SERVICE.HIRERARCHI_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            company: String(areatid.name),
          });
        });
      }
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  useEffect(() => {
    fetchBranch();
    fetchBranchAll();
  }, []);

  useEffect(() => {
    fetchBranchAll();
  }, [isEditOpen, areatid]);

  //table entries ..,.
  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = companies?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [companies]);

  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSelectedRows([]);
    setSelectAllChecked(false)
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setSelectedRows([]);
    setSelectAllChecked(false)
    setPage(1);
  };

  //datatable....
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

  const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(filteredDatas.length / pageSize);

  const visiblePages = Math.min(totalPages, 3);

  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

  const pageNumbers = [];

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox
        checked={selectAllChecked}
        onChange={onSelectAll}
      />
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
              updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.row.id);
            } else {
              updatedSelectedRows = [...selectedRows, params.row.id];
            }

            setSelectedRows(updatedSelectedRows);
            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllChecked(updatedSelectedRows.length === filteredData.length);

          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 90,

      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header"
    },
    {
      field: "serialNumber", headerName: "SNo",
      flex: 0, width: 100, hide: !columnVisibility.serialNumber, headerClassName: "bold-header"
    },
    { field: "code", headerName: "Code", flex: 0, width: 250, hide: !columnVisibility.code, headerClassName: "bold-header" },
    { field: "name", headerName: "Name", flex: 0, width: 250, hide: !columnVisibility.name, headerClassName: "bold-header" },

    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 250,
      minHeight: '40px !important',
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: 'flex' }}>
          {isUserRoleCompare?.includes("ecompany") && (
            <Button sx={userStyle.buttonedit} onClick={() => {
              getCode(params.row.id);
            }}><EditOutlinedIcon sx={buttonStyles.buttonedit} /></Button>
          )}
          {isUserRoleCompare?.includes("dcompany") && (
            <Button onClick={(e) => { rowData(params.row.id, params.row.name) }}><DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} /></Button>
          )}
          {isUserRoleCompare?.includes("vcompany") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("icompany") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getinfoCode(params.row.id);
              }}
            >
              <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />
            </Button>
          )}
        </Grid>
      ),
    },
  ]

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      code: item.code,
      name: item.name,
    }
  });

  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRows.includes(row.id),
  }));

  // Show All Columns functionality
  const handleShowAllColumns = () => {
    const updatedVisibility = { ...columnVisibility };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibility(updatedVisibility);
  };

  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem("columnVisibility");
    if (savedVisibility) {
      setColumnVisibility(JSON.parse(savedVisibility));
    }
  }, []);

  // // Function to filter columns based on search query
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
    <Box style={{ padding: "10px", minWidth: "325px", '& .MuiDialogContent-root': { padding: '10px 0' } }} >
      <Typography variant="h6">Manage Columns</Typography>
      <IconButton
        aria-label="close"
        onClick={handleCloseManageColumns}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <Box sx={{ position: 'relative', margin: '10px' }}>
        <TextField
          label="Find column"
          variant="standard"
          fullWidth
          value={searchQueryManage}
          onChange={(e) => setSearchQueryManage(e.target.value)}
          sx={{ marginBottom: 5, position: 'absolute', }}
        />
      </Box><br /><br />
      <DialogContent sx={{ minWidth: 'auto', height: '200px', position: 'relative' }}>
        <List sx={{ overflow: 'auto', height: '100%', }}>
          {filteredColumns.map((column) => (
            <ListItem key={column.field}>
              <ListItemText sx={{ display: 'flex' }}
                primary={
                  <Switch sx={{ marginTop: "-5px" }} size="small"
                    checked={columnVisibility[column.field]}
                    onChange={() => toggleColumnVisibility(column.field)}
                  />
                }
                secondary={(column.field === "checkbox") ? "Checkbox" : column.headerName}
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
              sx={{ textTransform: 'none', }}
              onClick={() => setColumnVisibility(initialColumnVisibility)}
            >
              Show All
            </Button>
          </Grid>
          <Grid item md={4}></Grid>
          <Grid item md={4}>
            <Button
              variant="text"
              sx={{ textTransform: 'none' }}
              onClick={() => {
                const newColumnVisibility = {};
                columnDataTable.forEach((column) => {
                  newColumnVisibility[column.field] = false; // Set hide property to true
                });
                setColumnVisibility(newColumnVisibility);
              }}

            >
              Hide All
            </Button>

          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

  return (
    <Box>
      <Headtitle title={"COMPANY"} />
      <PageHeading
        title="Company"
        modulename="Setup"
        submodulename="Company"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />
      {/* ****** Header Content ****** */}
      {isUserRoleCompare?.includes("acompany") && (
        <>
          {/* <Typography sx={userStyle.HeaderText}>Company</Typography> */}

          <Box sx={userStyle.container}>
            <Typography sx={userStyle.SubHeaderText}> Add company</Typography>
            <br />
            <br />
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Code <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlinedcode"
                      type="text"
                      placeholder="Please Enter Code"
                      value={company.code}
                      onChange={(e) => {
                        setCompany({ ...company, code: e.target.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlinedname"
                      type="text"
                      placeholder="Please Enter Name"
                      value={company.name}
                      onChange={(e) => {
                        setCompany({ ...company, name: e.target.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={6} xs={12} sx={{ marginTop: "25px" }}>

                  <Grid container spacing={3}>
                    <Grid item md={4} xs={12} sm={6}>
                      {isUserRoleCompare?.includes("acompany") && (
                        <>
                          <LoadingButton loading={isBtn} type="submit" variant='contained' sx={buttonStyles.buttonsubmit} >Submit</LoadingButton>
                        </>
                      )}

                    </Grid>
                    <Grid item md={4} xs={12} sm={6}>
                      <Button sx={buttonStyles.btncancel} onClick={handleClear}>Clear</Button>
                    </Grid>
                  </Grid>
                </Grid>

              </Grid>

            </form>
          </Box>
        </>
      )}
      <br />
      {isUserRoleCompare?.includes("lcompany") && (
        <>
          <Box sx={userStyle.container}>
            { /* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Company List</Typography>
            </Grid>

            <br />

            <Grid container spacing={2} style={userStyle.dataTablestyle}>
              <Grid item md={2} xs={12} sm={12}>
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
                    {/* <MenuItem value={(companies?.length)}>All</MenuItem> */}
                  </Select>
                </Box>
              </Grid>
              <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box >
                  {isUserRoleCompare?.includes("excelcompany") && (
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        fetchOverallExcelDatas()
                        setFormat("xl")
                      }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvcompany") && (
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        fetchOverallExcelDatas()
                        setFormat("csv")
                      }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("printcompany") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handlePrint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfcompany") && (
                    <>
                      <Button sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true)
                          fetchOverallExcelDatas()
                        }}   ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imagecompany") && (
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>
                  )}
                </Box >
              </Grid>
              <Grid item md={2} xs={6} sm={6}>
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
            </Grid>
            <br />
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button>&ensp;
            {isUserRoleCompare?.includes("bdcompany") && (
              <Button variant="contained" sx={buttonStyles.buttonbulkdelete} onClick={() => handleClickOpenalert()} >Bulk Delete</Button>
            )}
            <br />
            {!isCompany ?
              <>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
              </>
              :
              <>
                <Box
                  style={{
                    width: '100%',
                    overflowY: 'hidden', // Hide the y-axis scrollbar
                  }}
                >
                  <StyledDataGrid
                    onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                    rows={rowsWithCheckboxes}
                    columns={columnDataTable.filter((column) => columnVisibility[column.field])}
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
              </>}
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
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        {manageColumnsContent}
      </Popover>
      <Box>

        {/* edit model */}
        <Dialog open={isEditOpen} onClose={handleCloseModEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth>
          <Box sx={{ padding: "20px 30px" }}>
            <form onSubmit={editSubmit}>
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}>Edit Company</Typography>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Code <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Code"
                      value={areatid.code}
                      onChange={(e) => {
                        setAreatid({ ...areatid, code: e.target.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Name"
                      value={areatid.name}
                      onChange={(e) => {
                        setAreatid({ ...areatid, name: e.target.value });
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={12}>
                  <Button variant="contained" type="submit"
                    sx={buttonStyles.buttonsubmit}
                  >
                    {" "}
                    Update
                  </Button>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit}>
                    {" "}
                    Cancel{" "}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Dialog>

        {/* Check Delete Modal */}
        <Box>
          <>
            <Box>
              {/* ALERT DIALOG */}
              <Dialog open={isCheckOpen} onClose={handleCloseCheck} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                  <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />

                  <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                    {checkBranch?.length > 0 && checkUser?.length > 0 ? (
                      <>
                        <span style={{ fontWeight: "700", color: "#777" }}>{`${deletebranch?.name} `}</span>was linked in <span style={{ fontWeight: "700" }}>branch & user</span>{" "}
                      </>
                    ) : checkBranch?.length > 0 ? (
                      <>
                        <span style={{ fontWeight: "700", color: "#777" }}>{`${deletebranch?.name} `}</span> was linked in <span style={{ fontWeight: "700" }}>branch</span>
                      </>
                    ) : checkUser?.length > 0 ? (
                      <>
                        <span style={{ fontWeight: "700", color: "#777" }}>{`${deletebranch?.name} `}</span> was linked in <span style={{ fontWeight: "700" }}>user</span>
                      </>
                    ) : (
                      ""
                    )}
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseCheck} autoFocus variant="contained" sx={buttonStyles.buttonsubmit}>
                    {" "}
                    OK{" "}
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </>
        </Box>

        {/* view model */}
        <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth={true}>
          <Box sx={{ padding: "20px 50px" }}>
            <>
              <Typography sx={userStyle.HeaderText}> View Company</Typography>
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Code</Typography>
                    <Typography>{areaviewid.code}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6"> Name</Typography>
                    <Typography>{areaviewid.name}</Typography>
                  </FormControl>
                </Grid>

              </Grid>
              <br /> <br /> <br />
              <Grid container spacing={2}>
                <Button variant="contained" sx={buttonStyles.btncancel} onClick={handleCloseview}>
                  {" "}
                  Back{" "}
                </Button>
              </Grid>
            </>
          </Box>
        </Dialog>

      </Box>


      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpenpop} onClose={handleCloseerrpop} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
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
              sx={buttonStyles.buttonsubmit}
              onClick={() => {
                sendEditRequest();
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
              sx={buttonStyles.btncancel}
              onClick={handleCloseerrpop}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

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
        filteredDataTwo={rowDataTable ?? []}
        itemsTwo={overallExcelDatas ?? []}
        filename={"Company"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Company Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delCompany}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={delCompanycheckbox}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/* PLEASE SELECT ANY ROW */}
      <PleaseSelectRow
        open={isDeleteOpenalert}
        onClose={handleCloseModalert}
        message="Please Select any Row"
        iconColor="orange"
        buttonText="OK"
      />
      {/* EXTERNAL COMPONENTS -------------- END */}
      <br />

    </Box>
  );
}

export default Company;