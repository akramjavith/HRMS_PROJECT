import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormGroup,
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
  Typography
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import AlertDialog from "../../components/Alert";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import { handleApiError } from "../../components/Errorhandling";
import ExportData from "../../components/ExportData";
import Headtitle from "../../components/Headtitle";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import StyledDataGrid from "../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";

function Managetypepurposegrouping() {
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



  const [fileFormat, setFormat] = useState("");



  let exportColumnNames = ["Interactors Type", "Interactors Purpose", "Candidate", 'Request Document', 'No Of Due Days'];
  let exportRowValues = ["interactorstype", "interactorspurpose", "addcandidate", 'requestdocument', 'duedays'];

  const [managetypepgState, setManagetypepgState] = useState({
    interactorstype: "Please Select Interactors Type",
    addcandidate: false,
    requestdocument: false,
    duedays: "",
  });
  const [interactorPurposeOptEdit, setInteractorPurposeOptEdit] = useState([]);
  const [interactorspurpose, setInteractorspurpose] = useState([]);
  const [interactorPurposeValues, setInteractorPurposeValues] = useState([]);
  const [interactorTypeOptEdit, setInteractorTypeOptEdit] = useState([]);
  const [assignedByArray, setAssignebyArray] = useState([]);

  const [interactorTypeOpt, setInteractorTypeOpt] = useState([]);
  const [interactorPurposeOpt, setInteractorPurposeOpt] = useState([]);
  const [managetypepgEdit, setManagetypepgEdit] = useState({
    interactorstype: "",
    addcandidate: false,
    requestdocument: false,
    duedays: "",
  });

  const [interactorPurposeOptValue, setInteractorPurposeOptValue] = useState(
    []
  );
  const [interactorPurposeOptValueReq, setInteractorPurposeOptValueReq] =
    useState([]);

  const [sources, setAssignedby] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles } =
    useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [sourceCheck, setSourcecheck] = useState(false);
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Interactor Type & Purpose Grouping.png");
        });
      });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

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
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showAlertpop, setShowAlertpop] = useState();

  const handleCloseerrpop = () => {
    setIsErrorOpenpop(false);
  };

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const handleClickOpenalert = () => {
    if (selectedRows?.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      // setIsDeleteOpencheckbox(true);
      overallBulkdelete(selectedRows);

    }
  };

  const [selectedRowsCount, setSelectedRowsCount] = useState(0);

  const overallBulkdelete = async (ids) => {
    setPageName(!pageName);
    try {
      let overallcheck = await axios.post(
        `${SERVICE.OVERALL_INTERACTORTYPEPURPOSEGROUP_BULKDELETE}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          id: ids,
        }
      );

      setSelectedRows(overallcheck?.data?.result);
      setSelectedRowsCount(overallcheck?.data?.count)
      handleClickOpencheckbox(true);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
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
    interactorstype: true,
    interactorspurpose: true,
    addcandidate: true,
    requestdocument: true,
    duedays: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  //check delete model
  const [isCheckOpen, setisCheckOpen] = useState(false);
  const handleClickOpenCheck = () => {
    setisCheckOpen(true);
  };
  const handleCloseCheck = () => {
    setisCheckOpen(false);
  };


  const [deleteSource, setDeleteSource] = useState("");
  const [checkUser, setCheckUser] = useState();


  const rowData = async (id, name, purpose) => {
    setPageName(!pageName);
    try {
      const [res, resuser] = await Promise.all([
        await axios.get(`${SERVICE.SINGLE_MANAGETYPEPG}/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.post(SERVICE.OVERALL_INTERACTORMANAGETYPEG, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          oldname: String(name),
          oldpurpose: purpose,
        })
      ])
      setDeleteSource(res?.data?.manageTypePG);
      setCheckUser(resuser?.data?.count);

      if (resuser?.data?.count > 0) {
        // handleClickOpenCheck();
        setPopupContentMalert(
          <span style={{ fontWeight: "700", color: "#777" }}>
            {`${res?.data?.manageTypePG.interactorstype} & ${res?.data?.manageTypePG.interactorspurpose.join(",")}`}            <span style={{ fontWeight: "bold", color: "black" }}>was linked</span>
          </span>
        );
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else {
        handleClickOpen();
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [ovProj, setOvProj] = useState("");
  const [ovProjCount, setOvProjCount] = useState("");
  const [getOverAllCount, setGetOverallCount] = useState("");

  const [ovProjsub, setOvProjsub] = useState("");

  const [isEditData, setIsEditData] = useState(0)

  const rowDataUpdate = async (id, name, purpose) => {
    setPageName(!pageName);
    try {
      const [res, resuser] = await Promise.all([
        await axios.get(`${SERVICE.SINGLE_MANAGETYPEPG}/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.post(SERVICE.OVERALL_INTERACTORMANAGETYPEG, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          oldname: String(name),
          oldpurpose: purpose,
        })
      ])

      setOvProjCount(resuser?.data?.count);
      setGetOverallCount(<span style={{ fontWeight: "700", color: "#777" }}>
        <span style={{ fontWeight: "bold", color: "black" }}> The </span>
        {`${name} & ${purpose?.toString()}`}
        <span style={{ fontWeight: "bold", color: "black" }}> was linked</span>
      </span>);

    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // Alert delete popup
  let Sourcesid = deleteSource?._id;

  const delSource = async (e) => {
    setPageName(!pageName);
    try {
      if (Sourcesid) {
        await axios.delete(`${SERVICE.SINGLE_MANAGETYPEPG}/${deleteSource?._id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        await fetchAssignedBy();
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
        return axios.delete(`${SERVICE.SINGLE_MANAGETYPEPG}/${item}`, {
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

      await fetchAssignedBy();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [isBtn, setIsBtn] = useState(false);

  //add function
  const sendRequest = async () => {
    setPageName(!pageName);
    setIsBtn(true);
    try {
      let subprojectscreate = await axios.post(SERVICE.CREATE_MANAGETYPEPG, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        interactorstype: String(managetypepgState.interactorstype),
        interactorspurpose: [...interactorPurposeValues],
        addcandidate: Boolean(managetypepgState.addcandidate),
        requestdocument: Boolean(managetypepgState.requestdocument),
        duedays: String(managetypepgState.duedays),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchAssignedBy();
      setManagetypepgState({
        interactorstype: "Please Select Interactors Type",
      });
      setInteractorspurpose([]);
      setInteractorPurposeValues([]);
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setIsBtn(false);
    } catch (err) {
      setIsBtn(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    const isNameMatch = assignedByArray.some(
      (item) =>
        item.interactorstype.toLowerCase() ==
        managetypepgState.interactorstype.toLowerCase() &&
        item.interactorspurpose.some((data) =>
          interactorPurposeValues.includes(data)
        )
    );
    if (
      managetypepgState.interactorstype === "Please Select Interactors Type"
    ) {

      setPopupContentMalert("Please Select Interactors Type");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (interactorspurpose?.length === 0) {

      setPopupContentMalert("Please Select Interactors Purpose");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (managetypepgState.requestdocument && managetypepgState.duedays === "") {

      setPopupContentMalert("Please Enter No of Due Days");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (isNameMatch) {

      setPopupContentMalert("Interactor Type & Purpose Grouping already exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      sendRequest();
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setManagetypepgState({ interactorstype: "Please Select Interactors Type" });
    setInteractorspurpose([]);
    setInteractorPurposeValues([]);
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

  //get single row to edit....
  const getCode = async (e, name) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_MANAGETYPEPG}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setManagetypepgEdit(res?.data?.manageTypePG);
      setInteractorPurposeOptValue([
        ...res?.data?.manageTypePG.interactorspurpose.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setInteractorPurposeOptValueReq(
        res?.data?.manageTypePG?.interactorspurpose
      );
      setOvProj(res?.data?.manageTypePG?.interactorstype);
      setOvProjsub(res?.data?.manageTypePG?.interactorspurpose);
      rowDataUpdate(e, res?.data?.manageTypePG?.interactorstype, res?.data?.manageTypePG?.interactorspurpose,);
      fetchInteractorMode();
      handleClickOpenEdit();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_MANAGETYPEPG}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setManagetypepgEdit(res?.data?.manageTypePG);
      handleClickOpenview();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_MANAGETYPEPG}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setManagetypepgEdit(res?.data?.manageTypePG);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //Project updateby edit page...
  let updateby = managetypepgEdit?.updatedby;
  let addedby = managetypepgEdit?.addedby;

  let subprojectsid = managetypepgEdit?._id;

  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.put(
        `${SERVICE.SINGLE_MANAGETYPEPG}/${subprojectsid}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          interactorstype: String(managetypepgEdit.interactorstype),
          interactorspurpose: [...interactorPurposeOptValueReq],
          addcandidate: String(managetypepgEdit.addcandidate),
          requestdocument: Boolean(managetypepgEdit.requestdocument),
          duedays: String(managetypepgEdit.duedays),
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      await fetchAssignedBy();
      handleCloseModEdit();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const editSubmit = async (e) => {
    e.preventDefault();
    let resdata = await fetchSourceAll();
    const isNameMatch = resdata.some(
      (item) =>
        item.interactorstype.toLowerCase() ==
        managetypepgEdit.interactorstype.toLowerCase() &&
        item.interactorspurpose.some((data) =>
          interactorPurposeOptValueReq.includes(data)
        )
    );
    if (managetypepgEdit.interactorstype === "") {

      setPopupContentMalert("Please Select Interactors Type");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (interactorPurposeOptValueReq.length === 0) {

      setPopupContentMalert("Please Select Interactors Purpose");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();

    }
    else if (managetypepgEdit.requestdocument && managetypepgEdit.duedays === "") {

      setPopupContentMalert("Please Enter No of Due Days");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();

    }
    else if (isNameMatch) {

      setPopupContentMalert("Interactor Type & Purpose Grouping already exists");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if ((managetypepgEdit.interactorstype != ovProj ||
      !interactorPurposeOptValueReq?.every((item) => ovProjsub?.includes(item))) &&
      ovProjCount > 0) {
      setPopupContentMalert(getOverAllCount)
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      sendEditRequest();
    }
  };

  //get all Sub vendormasters.
  const fetchAssignedBy = async () => {
    setPageName(!pageName);
    try {
      let res_vendor = await axios.get(SERVICE.ALL_MANAGETYPEPG, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSourcecheck(true);
      setAssignedby(res_vendor?.data?.manageTypePG.map((item, index) => {
        return {
          _id: item._id,
          serialNumber: index + 1,
          interactorstype: item.interactorstype,
          interactorspurposearr: item.interactorspurpose,
          duedays: item.duedays,
          interactorspurpose: item.interactorspurpose.join(","),
          addcandidate: item.addcandidate === true ? "Yes" : "No",
          requestdocument: item.requestdocument === true ? "Yes" : "No",
        };
      }));
      setAssignebyArray(res_vendor?.data?.manageTypePG);
    } catch (err) {
      setSourcecheck(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //get all Sub vendormasters.
  const fetchSourceAll = async () => {
    setPageName(!pageName);
    try {
      let res_meet = await axios.get(SERVICE.ALL_MANAGETYPEPG, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      return res_meet?.data?.manageTypePG.filter(
        (item) => item._id !== managetypepgEdit._id
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // Excel
  const fileName = "Interactor Type & Purpose Grouping";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Interactor Type & Purpose Grouping",
    pageStyle: "print",
  });

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("ManageType&PurposeGrouping"),
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
    fetchAssignedBy();
    fetchInteractorMode();
    fetchInteractorType();
    getapi();
  }, []);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    setItems(sources);
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
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
  });

  const filteredData = filteredDatas.slice(
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
            if (rowDataTable?.length === 0) {
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
              updatedSelectedRows?.length === filteredData?.length
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
      field: "interactorstype",
      headerName: "Interactors Type",
      flex: 0,
      width: 250,
      hide: !columnVisibility.interactorstype,
      headerClassName: "bold-header",
    },
    {
      field: "interactorspurpose",
      headerName: "Interactors Purpose",
      flex: 0,
      width: 250,
      hide: !columnVisibility.interactorspurpose,
      headerClassName: "bold-header",
    },
    {
      field: "addcandidate",
      headerName: "Add Candidate",
      flex: 0,
      width: 250,
      hide: !columnVisibility.addcandidate,
      headerClassName: "bold-header",
    },
    {
      field: "requestdocument",
      headerName: "Request Document",
      flex: 0,
      width: 250,
      hide: !columnVisibility.requestdocument,
      headerClassName: "bold-header",
    },
    {
      field: "duedays",
      headerName: "Due Days",
      flex: 0,
      width: 250,
      hide: !columnVisibility.duedays,
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
          {isUserRoleCompare?.includes("etype&purposegrouping") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.row.id);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />            </Button>
          )}
          {isUserRoleCompare?.includes("dtype&purposegrouping") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id, params.row.interactorstype, params.row.interactorspurposearr);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />            </Button>
          )}
          {isUserRoleCompare?.includes("vtype&purposegrouping") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />            </Button>
          )}
          {isUserRoleCompare?.includes("itype&purposegrouping") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getinfoCode(params.row.id);
              }}
            >
              <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />            </Button>
          )}
        </Grid>
      ),
    },
  ];
  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      interactorstype: item.interactorstype,
      interactorspurposearr: item.interactorspurposearr,
      interactorspurpose: item.interactorspurpose,
      addcandidate: item.addcandidate,
      requestdocument: item.requestdocument,
      duedays: item.duedays,
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
  const handleChangeFrom = (opt) => {
    setInteractorspurpose(opt);
    setInteractorPurposeValues(
      opt.map((a, index) => {
        return a.value;
      })
    );
  };

  const handleChangeFromEdit = (opt) => {
    setInteractorPurposeOptValue(opt);
    setInteractorPurposeOptValueReq(
      opt.map((a, index) => {
        return a.value;
      })
    );
  };

  const customValueRendererEditCompanyFrom = (valueCate, _employeename) => {
    return valueCate?.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Interactors Purpose";
  };

  const customValueRendererEditCompanyFromEdit = (valueCate, _employeename) => {
    return valueCate?.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Interactors Purpose";
  };

  //get all interactorType name.
  const fetchInteractorType = async () => {
    setPageName(!pageName);
    try {
      let res_freq = await axios.get(SERVICE.ALL_INTERACTORTYPE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setInteractorTypeOpt([
        ...res_freq?.data?.interactorType.map((t) => ({
          ...t,
          label: t.name,
          value: t.name,
        })),
      ]);

      setInteractorTypeOptEdit([
        ...res_freq?.data?.interactorType.map((t) => ({
          ...t,
          label: t.name,
          value: t.name,
        })),
      ]);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //get all interactorPurpose name.
  const fetchInteractorMode = async () => {
    setPageName(!pageName);
    try {
      let res_freq = await axios.get(SERVICE.ALL_INTERACTORPURPOSE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setInteractorPurposeOpt([
        ...res_freq?.data?.interactorPurpose.map((t) => ({
          ...t,
          label: t.name,
          value: t.name,
        })),
      ]);
      setInteractorPurposeOptEdit([
        ...res_freq?.data?.interactorPurpose.map((t) => ({
          ...t,
          label: t.name,
          value: t.name,
        })),
      ]);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  return (
    <Box>
      <Headtitle title={"Interactor Type & Purpose Grouping"} />
      {/* ****** Header Content ****** */}

      <PageHeading
        title="Interactor Type & Purpose Grouping"
        modulename="Interactors"
        submodulename="Master"
        mainpagename="Type & Purpose Grouping"
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("atype&purposegrouping") && (
        <>
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Add Interactor Type & Purpose Grouping
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Interactors Type <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={interactorTypeOpt}
                      value={{
                        label: managetypepgState.interactorstype,
                        value: managetypepgState.interactorstype,
                      }}
                      onChange={(e) => {
                        setManagetypepgState({
                          ...managetypepgState,
                          interactorstype: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Interactors Purpose <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={interactorPurposeOpt}
                      value={interactorspurpose}
                      onChange={handleChangeFrom}
                      valueRenderer={customValueRendererEditCompanyFrom}
                      labelledBy="Please Select Company"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2} xs={12} sm={12} marginTop={3}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={managetypepgState.addcandidate}
                          onChange={(e) =>
                            setManagetypepgState({
                              ...managetypepgState,
                              addcandidate: !managetypepgState.addcandidate,
                            })
                          }
                        />
                      }
                      label="Add Candidate"
                    />
                  </FormGroup>
                </Grid>
                <Grid item md={2} xs={12} sm={12} marginTop={3}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={managetypepgState.requestdocument}
                          onChange={(e) =>
                            setManagetypepgState({
                              ...managetypepgState,
                              requestdocument: !managetypepgState.requestdocument,
                              duedays: ""
                            })
                          }
                        />
                      }
                      label="Request Document"
                    />
                  </FormGroup>
                </Grid>
                {
                  managetypepgState.requestdocument &&
                  (
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          No of Due Days <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Please Enter Due Days"
                          value={managetypepgState.duedays}
                          onChange={(e) => {
                            // Only allow numbers and maximum 3 digits
                            const value = e.target.value;
                            if (value === '' || (value.match(/^\d{1,3}$/))) {
                              setManagetypepgState({
                                ...managetypepgState,
                                duedays: value,
                              });
                            }
                          }}
                          inputProps={{
                            inputMode: 'numeric',
                            pattern: '[0-9]*',
                          }}
                        />
                      </FormControl>
                    </Grid>
                  )


                }

                <Grid item md={2} sm={12} xs={12}>
                  <Grid
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "15px",
                    }}
                  >
                    <Button
                      sx={{ ...buttonStyles.buttonsubmit, marginTop: "25px" }}
                      disabled={isBtn}
                      onClick={handleSubmit}
                    >
                      SAVE
                    </Button>
                    <Button
                      sx={{ ...buttonStyles.btncancel, marginTop: "25px" }}
                      onClick={handleClear}
                    >
                      CLEAR
                    </Button>
                  </Grid>
                </Grid>
              </Grid>

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
          maxWidth="md"
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
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={12}>
                    <Typography sx={userStyle.HeaderText}>
                      Edit Interactor Type & Purpose Grouping
                    </Typography>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Interactors Type <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={interactorTypeOptEdit}
                        value={{
                          label: managetypepgEdit.interactorstype,
                          value: managetypepgEdit.interactorstype,
                        }}
                        onChange={(e) => {
                          setManagetypepgEdit({
                            ...managetypepgEdit,
                            interactorstype: e.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Interactors Purpose <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={interactorPurposeOptEdit}
                        value={interactorPurposeOptValue}
                        onChange={handleChangeFromEdit}
                        valueRenderer={customValueRendererEditCompanyFromEdit}
                        labelledBy="Please Select Company"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12} marginTop={3}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={managetypepgEdit.addcandidate}
                            onChange={(e) =>
                              setManagetypepgEdit({
                                ...managetypepgEdit,
                                addcandidate: !managetypepgEdit.addcandidate,
                              })
                            }
                          />
                        }
                        label="Add Candidate"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12} marginTop={3}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={managetypepgEdit.requestdocument}
                            onChange={(e) =>
                              setManagetypepgEdit({
                                ...managetypepgEdit,
                                requestdocument: !managetypepgEdit.requestdocument,
                                duedays: ""
                              })
                            }
                          />
                        }
                        label="Request Document"
                      />
                    </FormGroup>
                  </Grid>
                  {
                    managetypepgEdit.requestdocument &&
                    (
                      <Grid item md={4} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            No of Due Days <b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            placeholder="Please Enter Due Days"
                            value={managetypepgEdit.duedays}
                            onChange={(e) => {
                              // Only allow numbers and maximum 3 digits
                              const value = e.target.value;
                              if (value === '' || (value.match(/^\d{1,3}$/))) {
                                setManagetypepgEdit({
                                  ...managetypepgEdit,
                                  duedays: value,
                                });
                              }
                            }}
                            inputProps={{
                              inputMode: 'numeric',
                              pattern: '[0-9]*',
                            }}
                          />
                        </FormControl>
                      </Grid>
                    )


                  }
                </Grid>
                <br />

                <br />

                <Grid container spacing={2}>
                  <Grid item md={6} xs={6} sm={6}>
                    <Button sx={buttonStyles.buttonsubmit} type="submit"
                    >
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
              </form>
            </>
          </Box>
        </Dialog>
      </Box>
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("ltype&purposegrouping") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                List Interactor Type & Purpose Grouping
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
                  {isUserRoleCompare?.includes("exceltype&purposegrouping") && (
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
                  {isUserRoleCompare?.includes("csvtype&purposegrouping") && (
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
                  {isUserRoleCompare?.includes("printtype&purposegrouping") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdftype&purposegrouping") && (
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
                  {isUserRoleCompare?.includes("itype&purposegrouping") && (
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
            {isUserRoleCompare?.includes("bdtype&purposegrouping") && (
              <Button
                sx={buttonStyles.buttonbulkdelete}
                onClick={handleClickOpenalert}
              >
                Bulk Delete
              </Button>
            )}
            <br />
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
                    {filteredData?.length > 0 ? (page - 1) * pageSize + 1 : 0}{" "}
                    to {Math.min(page * pageSize, filteredDatas.length)} of{" "}
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

      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
      >
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              View Interactor Type & Purpose Grouping
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Interactor Type</Typography>
                  <Typography>{managetypepgEdit.interactorstype}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Interactor Purpose</Typography>
                  <Typography>
                    {managetypepgEdit.interactorspurpose
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Add Candidate</Typography>
                  <Typography>{managetypepgEdit.addcandidate === true ? "Yes" : "No"}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
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

      {/* ALERT DIALOG */}
      <Box>
        <Dialog
          open={isErrorOpenpop}
          onClose={handleCloseerrpop}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
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
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* Check delete Modal */}
      <Box>
        <>
          <Box>
            {/* ALERT DIALOG */}
            <Dialog open={isCheckOpen} onClose={handleCloseCheck} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
              <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />

                <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                  {checkUser > 0 ? (
                    <>
                      <span style={{ fontWeight: "700", color: "#777" }}>{`${deleteSource.interactorstype} & ${deleteSource.interactorspurpose.join(",")}`}</span>was linked
                    </>
                  ) : (
                    ""
                  )}
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseCheck} autoFocus variant="contained" color="error">
                  {" "}
                  OK{" "}
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </>
      </Box>

      <Box>
        <Dialog
          open={isDeleteOpencheckbox}
          onClose={handleCloseModcheckbox}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
            {selectedRowsCount > 0 ?
              <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>Some of the Data's are Linked in other pages. Do You want to Delete the Remaining.?</Typography>
              :
              <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>This Data is Linked in Some pages</Typography>

            }
          </DialogContent>
          <DialogActions>
            {selectedRowsCount > 0 ?
              <>
                <Button onClick={handleCloseModcheckbox} sx={buttonStyles.btncancel}>Cancel</Button>
                <Button sx={buttonStyles.buttonsubmit}
                  onClick={(e) => delSourcecheckbox(e)}
                > OK </Button>
              </>
              :
              <Button sx={buttonStyles.buttonsubmit} onClick={handleCloseModcheckbox} >Ok</Button>
            }
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
        itemsTwo={items ?? []}
        filename={"Interactor Type & Purpose Grouping"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Interactor Type & Purpose Grouping Info"
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
      {/* <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={delSourcecheckbox}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      /> */}
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

export default Managetypepurposegrouping;
