import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box, Typography, OutlinedInput, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Button,
  List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { userStyle } from "../../pageStyle";
import Selects from "react-select";
import { handleApiError } from "../../components/Errorhandling";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import StyledDataGrid from "../../components/TableStyle";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { UserRoleAccessContext, AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import AlertDialog from "../../components/Alert";
import { DeleteConfirmation, PleaseSelectRow, } from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";

function Companydomain() {
  const pathname = window.location.pathname;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };
  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };
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

  // Error Popup model
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showAlertpop, setShowAlertpop] = useState();
  const handleClickOpenerrpop = () => {
    setIsErrorOpenpop(true);
  };
  const handleCloseerrpop = () => {
    setIsErrorOpenpop(false);
  };
  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };
  const [assignedBy, setAssignedBy] = useState({
    company: "Please Select Company",
    assignedname: "",
  });
  const [assignedByArray, setAssignebyArray] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [assignedByEdit, setAssignedByEdit] = useState({
    company: "Please Select Company",
    assignedname: "",
  });
  const [allCompanyedit, setAllCompanyedit] = useState([]);
  const [sources, setAssignedby] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, isAssignBranch, buttonStyles } = useContext(
    UserRoleAccessContext
  );
  // overall edit date
  const [ovProj, setOvProj] = useState("");
  const [ovProjj, setOvProjj] = useState("");
  const [ovProjCount, setOvProjCount] = useState("");
  const [getOverAllCount, setGetOverallCount] = useState("");

  const { auth } = useContext(AuthContext);
  const [sourceCheck, setSourcecheck] = useState(false);
  const username = isUserRoleAccess.username;
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");
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
          data?.subpagenameurl?.length !== 0 && data?.subpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 && data?.mainpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.mainpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 && data?.submodulenameurl?.includes(window.location.pathname)
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

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Company Domain.png");
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
      pagename: String("Company Domain"),
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
  // view model
  const [openview, setOpenview] = useState(false);
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
  };
  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
    setIsActive(false);
  };
  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  const handleClickOpenalert = () => {
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      setIsDeleteOpencheckbox(true);
    }
  };
  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };
  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);
  const handleClickOpencheckbox = () => {
    setIsDeleteOpencheckbox(true);
  };
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
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
  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };
  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    company: true,
    assignedname: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };
  const [deleteSource, setDeleteSource] = useState("");

  //check delete model
  const [isCheckOpen, setisCheckOpen] = useState(false);
  const handleClickOpenCheck = () => {
    setisCheckOpen(true);
  };
  const handleCloseCheck = () => {
    setisCheckOpen(false);
  };

  const [checkCompanydomain, setCheckCompanydomain] = useState();

  // Alert delete popup
  const rowData = async (id, company, assignedname) => {
    setPageName(!pageName);

    try {
      // Perform both GET and POST requests concurrently
      const [res, ress] = await Promise.all([
        axios.get(`${SERVICE.COMPANYDOMAIN_SINGLE}/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.post(SERVICE.CHECKCOMPANYDOMAINUSER, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          checkcompany: company,
          checkassignedname: assignedname,
        })
      ]);
      setDeleteSource(res?.data?.companydomainn);
      setCheckCompanydomain(ress?.data?.users);
      if (ress?.data?.users.length > 0) {

        handleClickOpenCheck();
      } else {

        handleClickOpen();
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  let Sourcesid = deleteSource?._id;
  const delSource = async (e) => {
    setPageName(!pageName);
    try {
      if (Sourcesid) {
        await axios.delete(`${SERVICE.COMPANYDOMAIN_SINGLE}/${Sourcesid}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        await fetchEmployee();
        handleCloseMod();
        setSelectedRows([]);
        setPage(1);
      }
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const delSourcecheckbox = async () => {
    setPageName(!pageName);
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.COMPANYDOMAIN_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });
      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);
      await fetchEmployee();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [CompanyOptions, setCompanyOptions] = useState([]);

  useEffect(() => {
    CompanyDropDowns();
  }, []);

  const CompanyDropDowns = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.COMPANY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCompanyOptions(
        res?.data?.companies.map((data) => ({
          ...data,
          label: data.name,
          value: data.name,
        }))
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  //add function
  const sendRequest = async () => {
    setPageName(!pageName);

    try {
      let subprojectscreate = await axios.post(SERVICE.COMPANYDOMAIN_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: String(assignedBy.company),
        assignedname: String(assignedBy.assignedname),
        addedby: [
          {
            // name: String(username),
            name: String(isUserRoleAccess?.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchEmployee();
      setAssignedBy({ assignedname: "", company: "Please Select Company" });
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      if (err.response.data && err.response.data.message) {
        setPopupContentMalert(err.response.data.message);
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else {
        if (err.response.data && err.response.data.message) {
          setPopupContentMalert(err.response.data.message);
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
        } else {
          handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
      }
    }
  };
  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    const isNameMatch = assignedByArray.some(
      (item) => item.assignedname.toLowerCase() == assignedBy.assignedname.toLowerCase()
    );
    if (assignedBy.company === "Please Select Company") {
      setPopupContentMalert("Please Select Company");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (assignedBy.assignedname === "") {
      setPopupContentMalert("Please Enter Company Domain");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Data already exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      sendRequest();
    }
  };
  const handleClear = (e) => {
    e.preventDefault();
    setAssignedBy({ assignedname: "", company: "Please Select Company" });
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
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
  // info model
  const [openInfo, setOpeninfo] = useState(false);
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };
  const [domainNew, setdomainNew] = useState("");
  //get single row to edit....
  const getCode = async (e, name) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.COMPANYDOMAIN_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAssignedByEdit(res?.data?.companydomainn);
      setdomainNew(res?.data?.companydomainn?.assignedname)
      getOverallEditSection(res?.data?.companydomainn?.company, res?.data?.companydomainn?.assignedname);
      setOvProj(res?.data?.companydomainn?.company);
      setOvProjj(res?.data?.companydomainn?.assignedname);
      handleClickOpenEdit();
    }
    catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.COMPANYDOMAIN_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAssignedByEdit(res?.data?.companydomainn);
      handleClickOpenview();
    }
    catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.COMPANYDOMAIN_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAssignedByEdit(res?.data?.companydomainn);
      handleClickOpeninfo();
    }
    catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  //Project updateby edit page...
  let updateby = assignedByEdit?.updatedby;
  let addedby = assignedByEdit?.addedby;
  let subprojectsid = assignedByEdit?._id;
  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.put(
        `${SERVICE.COMPANYDOMAIN_SINGLE}/${subprojectsid}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          company: String(assignedByEdit.company),
          assignedname: String(assignedByEdit.assignedname),
          updatedby: [
            {
              // name: String(username),
              name: String(isUserRoleAccess?.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      await fetchEmployee();
      await fetchSourceAll();
      await getOverallEditSectionUpdate();

      handleCloseModEdit();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();

    } catch (err) {
      if (err.response.data && err.response.data.message) {
        setPopupContentMalert(err.response.data.message);
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else {
        if (err.response.data && err.response.data.message) {
          setPopupContentMalert(err.response.data.message);
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
        } else {
          handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
      }
    }
  };
  const editSubmit = async (e) => {
    e.preventDefault();
    fetchSourceAll();
    const isNameMatch = allCompanyedit.some(
      (item) =>
        item.assignedname.toLowerCase() ==
        assignedByEdit.assignedname.toLowerCase()
    );
    if (assignedByEdit.company === "Please Select Company") {
      setPopupContentMalert("Please Select Company");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (assignedByEdit.assignedname === "") {
      setPopupContentMalert("Please Enter Company Domain");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Data already exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (assignedByEdit.assignedname != ovProj && ovProjCount > 0 && domainNew !== assignedByEdit.assignedname) {
      setShowAlertpop(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{getOverAllCount}</p>
        </>
      );
      handleClickOpenerrpop();
    }
    else {
      sendEditRequest();
    }
  };

  const getOverallEditSection = async (e, companyemail) => {
    try {
      let res = await axios.post(SERVICE.OVERALL_EDITCOMPANYDOMAINUSER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: e,
        oldname2: companyemail,
      });

      setOvProjCount(res?.data?.count);
      setGetOverallCount(`The ${companyemail} is linked in ${res?.data?.users?.length > 0 ? "Employee ," : ""}   
            whether you want to do changes ..??`);
    } catch (err) {
      if (err.response && err.response.status === 404) {
      } else {
        handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
      }
    }
  };

  //overall edit section for all pages
  const getOverallEditSectionUpdate = async () => {
    try {
      let res = await axios.post(SERVICE.OVERALL_EDITCOMPANYDOMAINUSER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: ovProj,
        oldname2: ovProjj,
      });
      sendEditRequestOverall(res?.data?.users);
      if (res?.data?.users?.length > 0) {
      } else {
        console.log('No users found for the given company.');
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const sendEditRequestOverall = async (users) => {
    try {
      if (!assignedByEdit || !assignedByEdit.assignedname || !ovProjj) {
        throw new Error('Domain information is incomplete.');
      }

      const newDomain = assignedByEdit.assignedname;
      const oldDomain = ovProjj;

      if (users.length > 0) {
        const updatePromises = users.map((user) => {
          const oldEmails = user.companyemail.split(',');
          const updatedEmails = oldEmails.map((email) => {
            const [username, domain] = email.trim().split('@');

            return domain === oldDomain ? `${username}@${newDomain}` : email;
          });

          const updatedCompanyEmail = updatedEmails.join(',');

          if (updatedCompanyEmail !== user.companyemail) {

            return axios.put(`${SERVICE.USER_SINGLE_PWD}/${user._id}`, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              companyemail: updatedCompanyEmail,
            });
          }
          return Promise.resolve();
        });

        await Promise.all(updatePromises);
        console.log('All users updated successfully with matching domain changes.');
      }
    } catch (err) {
      console.error('Error updating users:', err);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [assignebyFilterArray, setAssignebyFilterArray] = useState([]);
  //get all Sub vendormasters.
  const fetchAssignedByArray = async () => {
    setPageName(!pageName);
    try {
      let res_vendor = await axios.post(SERVICE.COMPANYDOMAIN,
        {
          assignbranch: accessbranch,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      setAssignebyFilterArray(
        res_vendor?.data?.companydomainn.map((t, index) => ({
          ...t,
          Sno: index + 1,
          assignedname: t.assignedname,
        }))
      );
    } catch (err) {
      if (err.response.data && err.response.data.message) {
        setPopupContentMalert(err.response.data.message);
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else {
        handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
      }
    }
  };
  useEffect(() => {
    fetchAssignedByArray();
  }, [isFilterOpen]);

  const fetchSourceAll = async () => {
    setPageName(!pageName);
    try {
      let res_meet = await axios.post(SERVICE.COMPANYDOMAIN,
        {
          assignbranch: accessbranch,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      setAllCompanyedit(res_meet?.data?.companydomainn.filter(
        (item) => item._id !== assignedByEdit._id
      ))
    } catch (err) {
      if (err.response.data && err.response.data.message) {
        setPopupContentMalert(err.response.data.message);
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else {
        handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
      }
    }
  };

  const [overallFilterdata, setOverallFilterdata] = useState([]);

  const fetchEmployee = async () => {
    setPageName(!pageName);
    const accessmodule = [];

    isAssignBranch.map((data) => {
      let fetfinalurl = [];

      if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 &&
        data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0 &&
        data?.subsubpagenameurl?.length !== 0
      ) {
        fetfinalurl = data.subsubpagenameurl;
      } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 &&
        data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0) {
        fetfinalurl = data.subpagenameurl;
      } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 &&
        data?.mainpagenameurl?.length !== 0) {
        fetfinalurl = data.mainpagenameurl;
      } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0) {
        fetfinalurl = data.submodulenameurl;
      } else if (data?.modulenameurl?.length !== 0) {
        fetfinalurl = data.modulenameurl;
      }
      accessmodule.push(fetfinalurl);
    });

    const uniqueValues = [...new Set(accessmodule.flat())];

    if (uniqueValues?.includes(pathname) || isUserRoleAccess?.role?.includes("Manager")) {
      try {
        let res_employee = await axios.post(SERVICE.COMPANYDOMAIN, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          assignbranch: accessbranch,

        });

        const ans = res_employee?.data?.companydomainn
        setAssignedby(ans);
        setAssignebyArray(ans);
        setOverallFilterdata(ans);

        setSourcecheck(true);
      }
      catch (err) {
        if (err.response.data && err.response.data.message) {
          setSourcecheck(true);
          setPopupContentMalert(err.response.data.message);
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
        } else {
          setSourcecheck(true);
          handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }

      }
    }
    else {
      setSourcecheck(true)
      setAssignedby([]);
    }
  };

  //print...  
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Company Domain",
    pageStyle: "print",
  });
  //id for login...
  useEffect(() => {
    fetchEmployee();
    fetchSourceAll();
  }, []);
  useEffect(() => {
    fetchSourceAll();
  }, [isEditOpen, assignedByEdit]);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);
  const [items, setItems] = useState([]);
  const addSerialNumber = () => {
    const itemsWithSerialNumber = sources?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };
  useEffect(() => {
    addSerialNumber();
  }, [sources]);
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
  };

  // Split the search query into individual terms
  const searchTerms = searchQuery.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = overallFilterdata?.filter((item) => {
    return searchTerms.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
  });
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );

  const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(filteredDatas.length / pageSize);

  const visiblePages = Math.min(totalPages, 3);

  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

  const pageNumbers = [];

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

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
              updatedSelectedRows.length === filteredDatas.length
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
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 250,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
    },
    {
      field: "assignedname",
      headerName: "Company Domain",
      flex: 0,
      width: 250,
      hide: !columnVisibility.assignedname,
      headerClassName: "bold-header",
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 250,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("ecompanydomain") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.row.id);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dcompanydomain") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id, params.row.company, params.row.assignedname);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vcompanydomain") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("icompanydomain") && (
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
  ];
  const rowDataTable = filteredData.map((item, index) => {

    return {
      ...item,
      id: item._id,
      serialNumber: index + 1,
      company: item.company,
      assignedname: item.assignedname,
    };
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
              // secondary={column.headerName }
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
  const [fileFormat, setFormat] = useState("");
  let exportColumnNames = ["Company", "Company Domain"];
  let exportRowValues = ["company", "assignedname"];
  return (
    <Box>
      <Headtitle title={"Company Domain"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Company Domain"
        modulename="Setup"
        submodulename="Company Domain"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />
      {/* <Typography sx={userStyle.HeaderText}> Company Domain</Typography> */}
      {isUserRoleCompare?.includes("acompanydomain") && (
        <>
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Add Company Domain
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={CompanyOptions}
                      placeholder="Please Select Company "
                      value={{
                        label: assignedBy.company,
                        value: assignedBy.company,
                      }}
                      onChange={(e) => {
                        setAssignedBy({
                          ...assignedBy,
                          company: e.value,

                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      {" "}
                      Company Domain <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Company Domain"
                      value={assignedBy.assignedname}
                      onChange={(e) => {
                        setAssignedBy({
                          ...assignedBy,
                          assignedname: e.target.value,
                        });

                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12} sx={{ marginTop: "25px" }}>
                  <Grid container spacing={3}>
                    <Grid item md={4} xs={12} sm={6}>
                      <Button
                        variant="contained"
                        sx={buttonStyles.buttonsubmit}
                        onClick={handleSubmit}
                        disabled={isActive}
                      >
                        Submit
                      </Button>
                    </Grid>
                    <Grid item md={4} xs={12} sm={6}>
                      <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                        Clear
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <br />

            </>
          </Box>
        </>
      )}
      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth={true}
          // maxWidth="sm"
          sx={{
            overflow: "visible",
            "& .MuiPaper-root": {
              overflow: "visible",
            },
          }}
        >
          <Box sx={{ padding: "20px" }}>
            <>
              <form onSubmit={editSubmit}>
                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={12}>
                    <Typography sx={userStyle.HeaderText}>
                      Edit Company Domain
                    </Typography>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Company <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Company Domain"
                        value={assignedByEdit.company}
                        readOnly
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Company Domain <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Company Domain"
                        value={assignedByEdit.assignedname}
                        onChange={(e) => {
                          setAssignedByEdit({
                            ...assignedByEdit,
                            assignedname: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <br />
                <br />
                <Grid container spacing={2}>
                  <Grid item md={6} xs={6} sm={6}>
                    <Button variant="contained" sx={buttonStyles.buttonsubmit} type="submit">
                      Update
                    </Button>
                  </Grid>
                  <Grid item md={6} xs={6} sm={6}>
                    <Button
                      sx={buttonStyles.btncancel}
                      onClick={handleCloseModEdit}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
                {/* </DialogContent> */}
              </form>
            </>
          </Box>
        </Dialog>
      </Box>
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lcompanydomain") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Company Domain List
              </Typography>
            </Grid>
            <br />
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
                    {/* <MenuItem value={(sources?.length)}>All</MenuItem> */}
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
                  {isUserRoleCompare?.includes("excelcompanydomain") && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          fetchAssignedByArray();
                          setFormat("xl");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileExcel />
                        &ensp;Export to Excel&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvcompanydomain") && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          fetchAssignedByArray();
                          setFormat("csv");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileCsv />
                        &ensp;Export to CSV&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("printcompanydomain") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfcompanydomain") && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true);
                          fetchAssignedByArray();
                        }}
                      >
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imagecompanydomain") && (
                    <Button
                      sx={userStyle.buttongrp}
                      onClick={handleCaptureImage}
                    >
                      {" "}
                      <ImageIcon
                        sx={{ fontSize: "15px" }}
                      /> &ensp;Image&ensp;{" "}
                    </Button>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={6} sm={6}>
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
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
              Manage Columns
            </Button>
            &ensp;
            {/* {isUserRoleCompare?.includes("bdcompanydomain") && (
              <Button
                variant="contained"
                sx={buttonStyles.buttonbulkdelete}
                onClick={handleClickOpenalert}
              >
                Bulk Delete
              </Button>
            )} */}
            <br />
            {!sourceCheck ? (
              <>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
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
            ) : (
              <>
                <Box
                  style={{
                    width: "100%",
                    overflowY: "hidden", // Hide the y-axis scrollbar
                  }}
                  ref={gridRef}
                >
                  <StyledDataGrid
                    onClipboardCopy={(copiedString) =>
                      setCopiedData(copiedString)
                    }
                    rows={rowsWithCheckboxes}
                    columns={columnDataTable.filter(
                      (column) => columnVisibility[column.field]
                    )}
                    onSelectionModelChange={handleSelectionChange}
                    selectionModel={selectedRows}
                    autoHeight={true}
                    density="compact"
                    hideFooter
                    getRowClassName={getRowClassName}
                    disableRowSelectionOnClick
                  />
                </Box>
                <Box>
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
                </Box>
              </>
            )}
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


      {/* Check delete Modal */}
      <Box>
        <Dialog open={isCheckOpen} onClose={handleCloseCheck} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />

            <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
              {checkCompanydomain?.length > 0 ? (
                <>
                  <span style={{ fontWeight: "700", color: "#777" }}>
                    {`${deleteSource.assignedname} `}
                  </span>
                  was linked in <span style={{ fontWeight: "700" }}>All Employee</span>
                </>
              ) : (
                ""
              )}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCheck} autoFocus variant="contained" color="error">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Box>


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
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
      >
        <Box sx={{ width: "450px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Company Domain
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Company</Typography>
                  <Typography>{assignedByEdit.company}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Company Domain</Typography>
                  <Typography>{assignedByEdit.assignedname}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                sx={buttonStyles.btncancel}
                onClick={handleCloseview}
              >
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>
      {/* ALERT DIALOG for the overall edit*/}
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
              onClick={handleCloseerrpop}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

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
      {/* EXTERNAL COMPONENTS -------------- END */}
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
        itemsTwo={assignebyFilterArray ?? []}
        filename={"Company Domain"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Company Domain Info"
        addedby={addedby}
        updateby={updateby}
      />
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delSource}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={delSourcecheckbox}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      <PleaseSelectRow
        open={isDeleteOpenalert}
        onClose={handleCloseModalert}
        message="Please Select any Row"
        iconColor="orange"
        buttonText="OK"
      />
    </Box>
  );
}
export default Companydomain;