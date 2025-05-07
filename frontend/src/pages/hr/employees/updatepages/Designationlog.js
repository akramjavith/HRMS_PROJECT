import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
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
  Chip
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  FaEdit,
  FaFileCsv,
  FaFileExcel,
  FaFilePdf,
  FaPrint,
} from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import { Link } from "react-router-dom";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import AlertDialog from "../../../../components/Alert";
import { handleApiError } from "../../../../components/Errorhandling";
import ExportData from "../../../../components/ExportData";
import Headtitle from "../../../../components/Headtitle";
import InfoPopup from "../../../../components/InfoPopup.js";
import MessageAlert from "../../../../components/MessageAlert";
import PageHeading from "../../../../components/PageHeading";
import {
  AuthContext,
  UserRoleAccessContext,
} from "../../../../context/Appcontext";
import { colourStyles, userStyle } from "../../../../pageStyle";
import { SERVICE } from "../../../../services/Baseservice";
import domtoimage from 'dom-to-image';
import AggregatedSearchBar from "../../../../components/AggregatedSearchBar";
import AggridTable from "../../../../components/AggridTable";

function DesignationLog() {
  const [updateLoader, setUpdateLoader] = useState(false);
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setUpdateLoader(false);
    setOpenPopupMalert(true);
  };
  const handleClosePopupMalert = () => {
    setUpdateLoader(false);
    setOpenPopupMalert(false);
  };
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const handleClickOpenPopup = () => {
    setUpdateLoader(false);
    setOpenPopup(true);
  };
  const handleClosePopup = () => {
    setUpdateLoader(false);
    setOpenPopup(false);
  };

  let exportColumnNames = [
    "Company",
    "Branch",
    "Unit",
    "Team",
    "Employeename",
    "Designation",
    "Work Mode",
  ];
  let exportRowValues = [
    "companyname",
    "branch",
    "unit",
    "team",
    "employeename",
    "designation",
    "workmode",
  ];

  let today = new Date();

  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + "-" + mm + "-" + dd;

  useEffect(() => {
    // Update the default time whenever the component mounts
    setDesignationLog((prevDesignationLog) => ({
      ...prevDesignationLog,
      time: getCurrentTime(),
    }));
  }, []);

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [roles, setRoles] = useState([]);
  const [designationlogEdit, setDesignationlogEdit] = useState({});
  const [designationlog, setDesignationLog] = useState({
    username: "",
    empcode: "",
    designation: "Select Designation",
    startdate: "Please Select Startdate",
    starttime: currentDateTime.toTimeString().split(" ")[0],
    enddate: "present",
    endtime: "present",
    time: getCurrentTime(),
  });
  const [designationlogs, setDesignationlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    isUserRoleCompare,
    isUserRoleAccess,
    alldesignation,
    allUsersData,
    isAssignBranch,
    pageName,
    setPageName,
    buttonStyles,
    allTeam,
    allUsersLimit
  } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);

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

  useEffect(() => {
    getapi();
  }, []);

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Designation Log"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),

      addedby: [
        {
          name: String(isUserRoleAccess?.companyname),
          date: String(new Date()),
        },
      ],
    });
  };

  const [designationlogCheck, setDesignationlogcheck] = useState(false);

  const gridRef = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);

  const [searchQueryManage, setSearchQueryManage] = useState("");

  const [copiedData, setCopiedData] = useState("");
  // const [olddesignation, setOldDesignation] = useState("");

  // Copied fields Name
  const handleCopy = (message) => {
    NotificationManager.success(`${message} 👍`, "", 2000);
  };

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const changeTo = [
    { label: "Replace", value: "Replace" },
    { label: "New", value: "New" },
  ];
  //image

  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "DesignationLog.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const handleClickOpenalert = () => {
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    }
  };
  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
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
    if (selectedRows?.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    empcode: true,
    username: true,
    companyname: true,
    branch: true,
    unit: true,
    team: true,
    designation: true,
    workmode: true,
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

  const [designationdatasEdit, setDesignationdatasEdit] = useState([]);
  const [startdateoptionsEdit, setStartdateoptionsEdit] = useState([]);

  //Edit model...
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
  };

  const [hierarchyall, setHierarchyall] = useState([]);
  const [designationsName, setDesignationsName] = useState([]);
  const [superVisorChoosen, setSuperVisorChoosen] = useState(
    "Please Select Supervisor"
  );
  const [changeToDesign, setChangeToDesign] = useState("Replace");
  //get all Hierarchy.
  const fetchAllHierarchy = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.HIRERARCHI, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setHierarchyall(res?.data?.hirerarchi);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  const [designationGrp, setDesignationGrp] = useState([]);

  const fetchAllDesignationGrp = async () => {
    setDesignationGrp(alldesignation);
  };

  const [users, setUsers] = useState([]);

  const fetchAllUsersLimit = async () => { };

  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };

  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  const [oldUpdatedData, setOldUpdatedData] = useState([]);
  const [newUpdatingData, setNewUpdatingData] = useState([]);
  const [oldEmployeeHierData, setOldEmployeeHierData] = useState([]);
  const [userReportingToChange, setUserReportingToChange] = useState([]);

  const [oldHierarchyData, setOldHierarchyData] = useState([]);
  const [newHierarchyData, setNewHierarchyData] = useState([]);
  const [userDepartment, setUserDepartment] = useState([]);
  const [oldHierarchyDataSupervisor, setOldHierarchyDataSupervisor] = useState(
    []
  );
  const [getingOlddatas, setGettingOldDatas] = useState([]);
  const [designationGroup, setDesignationGroup] = useState("");

  const checkHierarchyName = async (newValue, type) => {
    setPageName(!pageName);
    try {
      if (
        type === "Designation"
          ? newValue != getingOlddatas?.designation
          : newValue != getingOlddatas?.team
      ) {
        let res = await axios.post(SERVICE.HIERARCHI_TEAM_DESIGNATION_CHECK, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          oldname: getingOlddatas,
          newname: newValue,
          type: type,
          username: getingOlddatas.companyname,
        });
        setOldHierarchyData(res?.data?.hierarchyold);
        setNewHierarchyData(res?.data?.hierarchyfindchange);
        setOldHierarchyDataSupervisor(res?.data?.hierarchyoldsupervisor);
      }
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const [olddesignation, setOldDesignation] = useState("");
  const [oldDesignationGroup, setOldDesignationGroup] = useState("");
  const [newDesignationGroup, setNewDesignationGroup] = useState("");
  // const [olddesignation, setOldDesignation] = useState("");
  // get single row to view....
  const [prevLogDates, setPrveLogDates] = useState([])
  const getviewCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDesignationlogEdit(res?.data?.suser);
      setRoles(res?.data?.suser?.role);
      fetchDptDesignation(res?.data?.suser?.department);
      fetchDesignationMonthChange(
        { value: res?.data?.suser?.designation },
        res?.data?.suser?.doj,
        res?.data?.suser?.department
      );
      let prevLogDates = res?.data?.suser?.designationlog?.length > 0 ? res?.data?.suser?.designationlog?.map((data) => data?.startdate) : []
      setPrveLogDates(prevLogDates);

      let rocketchatshiftgrouping = [];
      let rocketchatshift = [];

      // Check if the user's boardingLog exists and has entries
      if (res?.data?.suser?.boardingLog && res?.data?.suser?.boardingLog.length > 0) {
        const lastBoardingLog = res?.data?.suser?.boardingLog[res?.data?.suser?.boardingLog.length - 1];

        // If shifttype is "Standard", push shiftgrouping and shifttiming values
        if (lastBoardingLog.shifttype === "Standard") {
          if (lastBoardingLog.shiftgrouping) {
            rocketchatshiftgrouping.push(lastBoardingLog.shiftgrouping);
          }
          if (lastBoardingLog.shifttiming) {
            rocketchatshift.push(lastBoardingLog.shifttiming);
          }
        } else if (lastBoardingLog.shifttype !== "Standard") {
          // If shifttype is not "Standard", check the todo array
          const boardtodo = lastBoardingLog.todo;

          if (boardtodo && boardtodo.length > 0) {
            // Iterate over the todo array and push shiftgrouping and shifttiming
            boardtodo.forEach(item => {
              if (item.shiftgrouping) {
                rocketchatshiftgrouping.push(item.shiftgrouping);
              }
              if (item.shifttiming) {
                rocketchatshift.push(item.shifttiming);
              }
            });
          }
        }
      }
      setDesignationLog({
        ...designationlog,
        username: res?.data?.suser?.username,
        empcode: res?.data?.suser?.empcode,
        designation: res?.data?.suser?.designation,
        department: res?.data?.suser?.department,


        rocketchatemail: res?.data?.suser?.rocketchatemail,
        rocketchatid: res?.data?.suser?.rocketchatid || "",
        rocketchatroles: res?.data?.suser?.rocketchatroles?.length ? res?.data?.suser?.rocketchatroles : [],
        rocketchatteamid: res?.data?.suser?.rocketchatteamid || [],
        rocketchatchannelid: res?.data?.suser?.rocketchatchannelid || [],

        company: res?.data?.suser?.company,
        branch: res?.data?.suser?.branch,
        unit: res?.data?.suser?.unit,
        team: res?.data?.suser?.team,
        companyname: res?.data?.suser?.companyname,
        process: res?.data?.suser?.process,
        workmode: res?.data?.suser?.workmode,
        rocketchatshiftgrouping,
        rocketchatshift
      });
      handleClickOpenEdit();
      setGettingOldDatas(res?.data?.suser);
      let designationGrpName = alldesignation?.find(
        (data) => res?.data?.suser?.designation === data?.name
      )?.group;
      setOldDesignationGroup(designationGrpName);
      setNewDesignationGroup(designationGrpName);
      let allDesignations = alldesignation
        ?.filter((data) => designationGrpName === data?.group)
        ?.map((item) => item?.name);
      const fitleredUsers = [
        ...allUsersData
          ?.filter(
            (data) =>
              data?.designation === res?.data?.suser?.designation &&
              data?.companyname !== res?.data?.suser?.companyname
          )
          .map((d) => ({
            label: d?.companyname,
            value: d?.companyname,
            designation: d?.designation,
          })),
      ];

      setUsers(fitleredUsers);
      setOldDesignation(res?.data?.suser?.designation);
      setDesignationsName(allDesignations);
      handleClickOpenEdit();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  const fetchNewDesignationGroup = (value) => {
    let designationGrpName = alldesignation?.find(
      (data) => value === data?.name
    )?.group;
    setNewDesignationGroup(designationGrpName);
  };

  const fetchSuperVisorChangingHierarchy = async (value) => {
    if (olddesignation !== value) {
      let designationGrpName = alldesignation?.find(
        (data) => value === data?.name
      )?.group;
      let res = await axios.post(SERVICE.HIERARCHY_DEISGNATIONLOG_RELATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        olddesig: oldDesignationGroup,
        designation: value,
        desiggroup: designationGrpName,
        user: designationlogEdit,
        company: "none",
        branch: "none",
        unit: "none",
        team: "none",
        department: "none",
      });
      const oldData = res?.data?.olddata?.length > 0 ? res?.data?.olddata : [];
      const newdata = res?.data?.newdata?.length > 0 ? res?.data?.newdata : [];
      const oldDataEmp =
        res?.data?.olddataEmp?.length > 0 ? res?.data?.olddataEmp : [];
      setOldUpdatedData(oldData);
      setNewUpdatingData(newdata);
      setOldEmployeeHierData(oldDataEmp);
    } else {
      setOldUpdatedData([]);
      setNewUpdatingData([]);
      setOldEmployeeHierData([]);
    }
  };
  const fetchReportingToUserHierarchy = async (value) => {
    if (olddesignation !== value) {
      let designationGrpName = alldesignation?.find(
        (data) => value === data?.name
      )?.group;
      let res = await axios.post(
        SERVICE.REPORTINGTO_DESIGNATION_USER_HIERARCHY_RELATION,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          olddesig: oldDesignationGroup,
          designation: value,
          desiggroup: designationGrpName,
          user: designationlogEdit,
          company: "none",
          branch: "none",
          unit: "none",
          team: "none",
          department: "none",
        }
      );
      const userResponse =
        res?.data?.newdata[0]?.result?.length > 0
          ? res?.data?.newdata[0]?.result
          : [];
      // console.log(userResponse , 'userResponse')
      setUserReportingToChange(userResponse);
    } else {
      setUserReportingToChange([]);
    }
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDesignationlogEdit(res?.data?.suser);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  const [showButton, setShowButton] = useState(true);

  const fetchDesignationgroup = async (e) => {
    setPageName(!pageName);
    try {
      let res_designationgroup = await axios.get(SERVICE.DESIGNATIONGRP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let getGroupName = alldesignation
        ?.filter((data) => {
          return data.name === e.value;
        })
        ?.map((item) => item.group);

      let getRoles = res_designationgroup?.data?.desiggroup
        ?.filter((data) => {
          return getGroupName?.includes(data.name);
        })
        .flatMap((data) => data.roles);

      let uniqueRoles = [...new Set(getRoles)];
      setRoles(uniqueRoles);
      setDesignationGroup(
        alldesignation?.find((data) => data.name === e.value)?.group
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

  //get all Designationmonthset
  const fetchDesignationMonthChange = async (e, Doj, Dep) => {
    setPageName(!pageName);
    try {
      const [response, responseDep] = await Promise.all([
        axios.get(SERVICE.DESIGNATIONMONTHSET_ALL, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.get(SERVICE.DEPMONTHSET_ALL, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
      ]);

      let monthSet = response.data.designationmonthsets?.filter(
        (data) => data.designation == e?.value
      );
      let monthSetEmpty = response.data.designationmonthsets?.filter(
        (data) => data.designation == e?.value
      );

      let findDate = monthSet.some((data) => data.fromdate === formattedDate);

      let foundData = response?.data?.designationmonthsets?.find(
        (item) =>
          item.designation === e?.value &&
          new Date(Doj) >= new Date(item.fromdate) &&
          new Date(Doj) <= new Date(item.todate)
      );

      let filteredDatas;

      if (foundData) {
        filteredDatas = response?.data?.designationmonthsets
          ?.filter(
            (d) =>
              d.designation === e.value &&
              new Date(d.fromdate) >= new Date(foundData.fromdate)
          )
          ?.map((data) => ({
            label: data.fromdate,
            value: data.fromdate,
          }));

        if (filteredDatas.length === 0) {
          filteredDatas = responseDep?.data?.departmentdetails
            ?.filter(
              (d) =>
                d.department === Dep && new Date(d.fromdate) >= new Date(Doj)
            )
            ?.map((data) => ({
              label: data.fromdate,
              value: data.fromdate,
            }));
        }
      } else {
        filteredDatas = responseDep?.data?.departmentdetails
          ?.filter(
            (d) => d.department === Dep && new Date(d.fromdate) >= new Date(Doj)
          )
          ?.map((data) => ({
            label: data.fromdate,
            value: data.fromdate,
          }));
      }

      setStartdateoptionsEdit(filteredDatas);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const fetchDptDesignation = async (value) => {
    setPageName(!pageName);
    try {
      let req = await axios.get(SERVICE.DEPARTMENTANDDESIGNATIONGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let result = req?.data?.departmentanddesignationgroupings?.filter(
        (data, index) => {
          return value === data.department;
        }
      );

      const designationall = [
        ...result?.map((d) => ({
          ...d,
          label: d.designation,
          value: d.designation,
        })),
      ];
      setDesignationdatasEdit(designationall);
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
    fetchAllHierarchy();
    fetchAllDesignationGrp();
  }, []);

  useEffect(() => {
    fetchAllUsersLimit();
  }, [designationlogEdit, designationGrp]);

  //Project updateby edit page...
  let updateby = designationlogEdit?.updatedby;
  let addedby = designationlogEdit?.addedby;

  const sendEditRequest = async () => {
    setPageName(!pageName);
    try {
      if (changeToDesign === "New") {
        let res = await axios.put(
          `${SERVICE.USER_SINGLE_PWD}/${designationlogEdit._id}`,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            role: roles,
            designation: String(designationlog.designation),
            department: String(designationlog.department),
            rocketchatemail: designationlog?.rocketchatemail,
            rocketchatid: designationlog?.rocketchatid,
            rocketchatroles: designationlog?.rocketchatroles,
            rocketchatteamid: designationlog?.rocketchatteamid,
            rocketchatchannelid: designationlog?.rocketchatchannelid,
            username: designationlog?.username,
            company: designationlog?.company,
            branch: designationlog?.branch,
            unit: designationlog?.unit,
            team: designationlog?.team,
            workmode: designationlog?.workmode,
            process: designationlog?.process,
            rocketchatshiftgrouping: designationlog?.rocketchatshiftgrouping,
            rocketchatshift: designationlog?.rocketchatshift,
            companyname: designationlog?.companyname,
            designationlog: [
              ...designationlogEdit.designationlog,
              {
                username: String(designationlogEdit.companyname),
                companyname: String(designationlogEdit.company),
                designation: String(designationlog.designation),
                startdate: String(designationlog.startdate), // Fixed the field names
                time: String(designationlog.time),
                branch: String(designationlogEdit.branch), // Fixed the field names
                unit: String(designationlogEdit.unit),
                team: String(designationlogEdit.team),
                updatedusername: String(isUserRoleAccess.companyname),
                updateddatetime: String(new Date()),
              },
            ],
            updatedby: [
              ...updateby,
              {
                name: String(isUserRoleAccess.companyname),
                date: String(new Date()),
              },
            ],
          }
        );
      } else {

        let res = await axios.put(
          `${SERVICE.USER_SINGLE_PWD}/${designationlogEdit._id}`,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            designation: String(designationlog?.designation),
            department: String(designationlog.department),
            rocketchatemail: designationlog?.rocketchatemail,
            rocketchatid: designationlog?.rocketchatid,
            rocketchatroles: designationlog?.rocketchatroles,
            rocketchatteamid: designationlog?.rocketchatteamid,
            rocketchatchannelid: designationlog?.rocketchatchannelid,
            username: designationlog?.username,
            company: designationlog?.company,
            branch: designationlog?.branch,
            unit: designationlog?.unit,
            team: designationlog?.team,
            companyname: designationlog?.companyname,
            workmode: designationlog?.workmode,
            process: designationlog?.process,
            rocketchatshiftgrouping: designationlog?.rocketchatshiftgrouping,
            rocketchatshift: designationlog?.rocketchatshift,
            role: roles,

            designationlog: [
              ...designationlogEdit?.designationlog,
              {
                username: String(designationlogEdit.companyname),
                companyname: String(designationlogEdit.company),
                designation: String(designationlog.designation),
                startdate: String(designationlog.startdate), // Fixed the field names
                time: String(designationlog.time),
                branch: String(designationlogEdit.branch), // Fixed the field names
                unit: String(designationlogEdit.unit),
                team: String(designationlogEdit.team),
                updatedusername: String(isUserRoleAccess.companyname),
                updateddatetime: String(new Date()),
              },
            ],
            updatedby: [
              ...updateby,
              {
                name: String(isUserRoleAccess.companyname),
                date: String(new Date()),
              },
            ],
          },
        );

        if (identifySuperVisor && changeToDesign === "Replace") {
          // Changing the old Supervisor to to new Group
          if (newUpdatingData?.length > 0) {
            const primaryDep = newUpdatingData[0]?.primaryDep;
            const secondaryDep = newUpdatingData[0]?.secondaryDep;
            const tertiary = newUpdatingData[0]?.tertiaryDep;
            const primaryDepAll = newUpdatingData[0]?.primaryDepAll;
            const secondaryDepAll = newUpdatingData[0]?.secondaryDepAll;
            const tertiaryAll = newUpdatingData[0]?.tertiaryDepAll;
            const primaryWithoutDep = newUpdatingData[0]?.primaryNotDep;
            const secondaryWithoutDep = newUpdatingData[0]?.secondaryNotDep;
            const tertiaryWithoutDep = newUpdatingData[0]?.tertiaryNotDep;

            if (
              [
                primaryDep,
                secondaryDep,
                tertiary,
                primaryDepAll,
                secondaryDepAll,
                tertiaryAll,
                primaryWithoutDep,
                secondaryWithoutDep,
                tertiaryWithoutDep,
              ].some(
                (dep) => dep?.length > 0 && userReportingToChange?.length > 0
              )
            ) {
              const supervisor = userReportingToChange[0]?.supervisorchoose;
              let res = await axios.put(
                `${SERVICE.USER_SINGLE_PWD}/${designationlogEdit?._id}`,
                {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },
                  reportingto: String(supervisor[0]),
                  updatedby: [
                    ...updateby,
                    {
                      name: String(isUserRoleAccess.companyname),
                      date: String(new Date()),
                    },
                  ],
                }
              );
            }

            if (primaryDep?.length > 0) {
              const uniqueEntries = primaryDep?.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.company === item.company &&
                      t.branch === item.branch &&
                      t.unit === item.unit &&
                      t.team === item.team &&
                      t.supervisorchoose?.length ===
                      item.supervisorchoose?.length &&
                      t.supervisorchoose?.every((dta) =>
                        item.supervisorchoose.includes(dta)
                      )
                  )
              );

              let answer = uniqueEntries?.map(
                async (data) =>
                  await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    level: String(data.level),
                    control: String(data.control),
                    pagecontrols: data.pagecontrols,
                    employeename: designationlogEdit.companyname,
                    access: data.access,
                    action: Boolean(true),
                    empbranch: designationlogEdit?.branch,
                    empunit: designationlogEdit?.unit,
                    empcode: getingOlddatas?.empcode,
                    empteam: designationlogEdit?.team,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  })
              );
            }
            if (secondaryDep?.length > 0) {
              const uniqueEntries = secondaryDep?.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.company === item.company &&
                      t.branch === item.branch &&
                      t.unit === item.unit &&
                      t.team === item.team &&
                      t.supervisorchoose?.length ===
                      item.supervisorchoose?.length &&
                      t.supervisorchoose?.every((dta) =>
                        item.supervisorchoose.includes(dta)
                      )
                  )
              );

              let answer = uniqueEntries?.map(
                async (data) =>
                  await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    level: String(data.level),
                    control: String(data.control),
                    pagecontrols: data.pagecontrols,
                    employeename: designationlogEdit.companyname,
                    access: data.access,
                    action: Boolean(true),
                    empbranch: designationlogEdit?.branch,
                    empunit: designationlogEdit?.unit,
                    empcode: getingOlddatas?.empcode,
                    empteam: designationlogEdit?.team,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  })
              );
            }
            if (tertiary?.length > 0) {
              const uniqueEntries = tertiary?.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.company === item.company &&
                      t.branch === item.branch &&
                      t.unit === item.unit &&
                      t.team === item.team &&
                      t.supervisorchoose?.length ===
                      item.supervisorchoose?.length &&
                      t.supervisorchoose?.every((dta) =>
                        item.supervisorchoose.includes(dta)
                      )
                  )
              );

              let answer = uniqueEntries?.map(
                async (data) =>
                  await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    level: String(data.level),
                    control: String(data.control),
                    pagecontrols: data.pagecontrols,
                    employeename: designationlogEdit.companyname,
                    access: data.access,
                    action: Boolean(true),
                    empbranch: designationlogEdit?.branch,
                    empunit: designationlogEdit?.unit,
                    empcode: getingOlddatas?.empcode,
                    empteam: designationlogEdit?.team,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  })
              );
            }
            if (primaryDepAll?.length > 0) {
              const uniqueEntries = primaryDepAll?.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.company === item.company &&
                      t.branch === item.branch &&
                      t.unit === item.unit &&
                      t.team === item.team &&
                      t.supervisorchoose?.length ===
                      item.supervisorchoose?.length &&
                      t.supervisorchoose?.every((dta) =>
                        item.supervisorchoose.includes(dta)
                      )
                  )
              );

              let answer = uniqueEntries?.map(
                async (data) =>
                  await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    level: String(data.level),
                    control: String(data.control),
                    pagecontrols: data.pagecontrols,
                    employeename: designationlogEdit.companyname,
                    access: data.access,
                    action: Boolean(true),
                    empbranch: designationlogEdit?.branch,
                    empunit: designationlogEdit?.unit,
                    empcode: getingOlddatas?.empcode,
                    empteam: designationlogEdit?.team,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  })
              );
            }
            if (secondaryDepAll?.length > 0) {
              const uniqueEntries = secondaryDepAll?.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.company === item.company &&
                      t.branch === item.branch &&
                      t.unit === item.unit &&
                      t.team === item.team &&
                      t.supervisorchoose?.length ===
                      item.supervisorchoose?.length &&
                      t.supervisorchoose?.every((dta) =>
                        item.supervisorchoose.includes(dta)
                      )
                  )
              );

              let answer = uniqueEntries?.map(
                async (data) =>
                  await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    level: String(data.level),
                    control: String(data.control),
                    pagecontrols: data.pagecontrols,
                    employeename: designationlogEdit.companyname,
                    access: data.access,
                    action: Boolean(true),
                    empbranch: designationlogEdit?.branch,
                    empunit: designationlogEdit?.unit,
                    empcode: getingOlddatas?.empcode,
                    empteam: designationlogEdit?.team,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  })
              );
            }
            if (tertiaryAll?.length > 0) {
              const uniqueEntries = tertiaryAll?.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.company === item.company &&
                      t.branch === item.branch &&
                      t.unit === item.unit &&
                      t.team === item.team &&
                      t.supervisorchoose?.length ===
                      item.supervisorchoose?.length &&
                      t.supervisorchoose?.every((dta) =>
                        item.supervisorchoose.includes(dta)
                      )
                  )
              );

              let answer = uniqueEntries?.map(
                async (data) =>
                  await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    level: String(data.level),
                    control: String(data.control),
                    pagecontrols: data.pagecontrols,
                    employeename: designationlogEdit.companyname,
                    access: data.access,
                    action: Boolean(true),
                    empbranch: designationlogEdit?.branch,
                    empunit: designationlogEdit?.unit,
                    empcode: getingOlddatas?.empcode,
                    empteam: designationlogEdit?.team,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  })
              );
            }
            if (primaryWithoutDep?.length > 0) {
              const uniqueEntries = primaryWithoutDep?.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.department === item.department &&
                      t.supervisorchoose?.length ===
                      item.supervisorchoose?.length &&
                      t.supervisorchoose?.every((dta) =>
                        item.supervisorchoose.includes(dta)
                      )
                  )
              );

              let answer = uniqueEntries?.map(
                async (data) =>
                  await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    level: String(data.level),
                    control: String(data.control),
                    pagecontrols: data.pagecontrols,
                    employeename: designationlogEdit.companyname,
                    access: data.access,
                    action: Boolean(true),
                    empbranch: designationlogEdit?.branch,
                    empunit: designationlogEdit?.unit,
                    empcode: getingOlddatas?.empcode,
                    empteam: designationlogEdit?.team,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  })
              );
            }
            if (secondaryWithoutDep?.length > 0) {
              const uniqueEntries = secondaryWithoutDep?.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.department === item.department &&
                      t.supervisorchoose?.length ===
                      item.supervisorchoose?.length &&
                      t.supervisorchoose?.every((dta) =>
                        item.supervisorchoose.includes(dta)
                      )
                  )
              );

              let answer = uniqueEntries?.map(
                async (data) =>
                  await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    level: String(data.level),
                    control: String(data.control),
                    pagecontrols: data.pagecontrols,
                    employeename: designationlogEdit.companyname,
                    access: data.access,
                    action: Boolean(true),
                    empbranch: designationlogEdit?.branch,
                    empunit: designationlogEdit?.unit,
                    empcode: getingOlddatas?.empcode,
                    empteam: designationlogEdit?.team,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  })
              );
            }
            if (tertiaryWithoutDep?.length > 0) {
              const uniqueEntries = tertiaryWithoutDep?.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.department === item.department &&
                      t.supervisorchoose?.length ===
                      item.supervisorchoose?.length &&
                      t.supervisorchoose?.every((dta) =>
                        item.supervisorchoose.includes(dta)
                      )
                  )
              );

              let answer = uniqueEntries?.map(
                async (data) =>
                  await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    level: String(data.level),
                    control: String(data.control),
                    pagecontrols: data.pagecontrols,
                    employeename: designationlogEdit.companyname,
                    access: data.access,
                    action: Boolean(true),
                    empbranch: designationlogEdit?.branch,
                    empunit: designationlogEdit?.unit,
                    empcode: getingOlddatas?.empcode,
                    empteam: designationlogEdit?.team,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  })
              );
            }
          }
          //Removing old supervisor to new supervisor
          if (oldUpdatedData?.length > 0) {
            oldUpdatedData?.map(async (data, index) => {
              axios.put(`${SERVICE.HIRERARCHI_SINGLE}/${data?._id}`, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
                supervisorchoose: superVisorChoosen,
              });
            });
          }
          // Changing Employee from one deignation to another ==>> Replace
          if (oldEmployeeHierData?.length > 0 && newUpdatingData?.length > 0) {
            let ans = oldEmployeeHierData?.map((data) => {
              axios.delete(`${SERVICE.HIRERARCHI_SINGLE}/${data?._id}`, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
              });
            });
          }
        }

        // Only for Employees
        if (!identifySuperVisor) {
          if (oldEmployeeHierData?.length > 0) {
            let ans = oldEmployeeHierData?.map((data) => {
              axios.delete(`${SERVICE.HIRERARCHI_SINGLE}/${data?._id}`, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
              });
            });
          }
          if (newUpdatingData?.length > 0) {
            const primaryDep = newUpdatingData[0]?.primaryDep;
            const secondaryDep = newUpdatingData[0]?.secondaryDep;
            const tertiary = newUpdatingData[0]?.tertiaryDep;
            const primaryDepAll = newUpdatingData[0]?.primaryDepAll;
            const secondaryDepAll = newUpdatingData[0]?.secondaryDepAll;
            const tertiaryAll = newUpdatingData[0]?.tertiaryDepAll;
            const primaryWithoutDep = newUpdatingData[0]?.primaryNotDep;
            const secondaryWithoutDep = newUpdatingData[0]?.secondaryNotDep;
            const tertiaryWithoutDep = newUpdatingData[0]?.tertiaryNotDep;
            if (
              [
                primaryDep,
                secondaryDep,
                tertiary,
                primaryDepAll,
                secondaryDepAll,
                tertiaryAll,
                primaryWithoutDep,
                secondaryWithoutDep,
                tertiaryWithoutDep,
              ].some((dep) => dep?.length > 0) &&
              userReportingToChange?.length > 0
            ) {
              const supervisor = userReportingToChange[0]?.supervisorchoose;
              let res = await axios.put(
                `${SERVICE.USER_SINGLE_PWD}/${designationlogEdit?._id}`,
                {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },
                  reportingto: String(supervisor[0]),
                  updatedby: [
                    ...updateby,
                    {
                      name: String(isUserRoleAccess.companyname),
                      date: String(new Date()),
                    },
                  ],
                }
              );
            }

            if (primaryDep?.length > 0) {
              const uniqueEntries = primaryDep?.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.company === item.company &&
                      t.branch === item.branch &&
                      t.unit === item.unit &&
                      t.team === item.team &&
                      t.supervisorchoose?.length ===
                      item.supervisorchoose?.length &&
                      t.supervisorchoose?.every((dta) =>
                        item.supervisorchoose.includes(dta)
                      )
                  )
              );

              let answer = uniqueEntries?.map(
                async (data) =>
                  await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    level: String(data.level),
                    control: String(data.control),
                    pagecontrols: data.pagecontrols,
                    employeename: designationlogEdit.companyname,
                    access: data.access,
                    action: Boolean(true),
                    empbranch: designationlogEdit?.branch,
                    empunit: designationlogEdit?.unit,
                    empcode: getingOlddatas?.empcode,
                    empteam: designationlogEdit?.team,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  })
              );
            }
            if (secondaryDep?.length > 0) {
              const uniqueEntries = secondaryDep?.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.company === item.company &&
                      t.branch === item.branch &&
                      t.unit === item.unit &&
                      t.team === item.team &&
                      t.supervisorchoose?.length ===
                      item.supervisorchoose?.length &&
                      t.supervisorchoose?.every((dta) =>
                        item.supervisorchoose.includes(dta)
                      )
                  )
              );

              let answer = uniqueEntries?.map(
                async (data) =>
                  await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    level: String(data.level),
                    control: String(data.control),
                    pagecontrols: data.pagecontrols,
                    employeename: designationlogEdit.companyname,
                    access: data.access,
                    action: Boolean(true),
                    empbranch: designationlogEdit?.branch,
                    empunit: designationlogEdit?.unit,
                    empcode: getingOlddatas?.empcode,
                    empteam: designationlogEdit?.team,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  })
              );
            }
            if (tertiary?.length > 0) {
              const uniqueEntries = tertiary?.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.company === item.company &&
                      t.branch === item.branch &&
                      t.unit === item.unit &&
                      t.team === item.team &&
                      t.supervisorchoose?.length ===
                      item.supervisorchoose?.length &&
                      t.supervisorchoose?.every((dta) =>
                        item.supervisorchoose.includes(dta)
                      )
                  )
              );

              let answer = uniqueEntries?.map(
                async (data) =>
                  await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    level: String(data.level),
                    control: String(data.control),
                    pagecontrols: data.pagecontrols,
                    employeename: designationlogEdit.companyname,
                    access: data.access,
                    action: Boolean(true),
                    empbranch: designationlogEdit?.branch,
                    empunit: designationlogEdit?.unit,
                    empcode: getingOlddatas?.empcode,
                    empteam: designationlogEdit?.team,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  })
              );
            }
            if (primaryDepAll?.length > 0) {
              const uniqueEntries = primaryDepAll?.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.company === item.company &&
                      t.branch === item.branch &&
                      t.unit === item.unit &&
                      t.team === item.team &&
                      t.supervisorchoose?.length ===
                      item.supervisorchoose?.length &&
                      t.supervisorchoose?.every((dta) =>
                        item.supervisorchoose.includes(dta)
                      )
                  )
              );

              let answer = uniqueEntries?.map(
                async (data) =>
                  await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    level: String(data.level),
                    control: String(data.control),
                    pagecontrols: data.pagecontrols,
                    employeename: designationlogEdit.companyname,
                    access: data.access,
                    action: Boolean(true),
                    empbranch: designationlogEdit?.branch,
                    empunit: designationlogEdit?.unit,
                    empcode: getingOlddatas?.empcode,
                    empteam: designationlogEdit?.team,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  })
              );
            }
            if (secondaryDepAll?.length > 0) {
              const uniqueEntries = secondaryDepAll?.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.company === item.company &&
                      t.branch === item.branch &&
                      t.unit === item.unit &&
                      t.team === item.team &&
                      t.supervisorchoose?.length ===
                      item.supervisorchoose?.length &&
                      t.supervisorchoose?.every((dta) =>
                        item.supervisorchoose.includes(dta)
                      )
                  )
              );

              let answer = uniqueEntries?.map(
                async (data) =>
                  await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    level: String(data.level),
                    control: String(data.control),
                    pagecontrols: data.pagecontrols,
                    employeename: designationlogEdit.companyname,
                    access: data.access,
                    action: Boolean(true),
                    empbranch: designationlogEdit?.branch,
                    empunit: designationlogEdit?.unit,
                    empcode: getingOlddatas?.empcode,
                    empteam: designationlogEdit?.team,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  })
              );
            }
            if (tertiaryAll?.length > 0) {
              const uniqueEntries = tertiaryAll?.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.company === item.company &&
                      t.branch === item.branch &&
                      t.unit === item.unit &&
                      t.team === item.team &&
                      t.supervisorchoose?.length ===
                      item.supervisorchoose?.length &&
                      t.supervisorchoose?.every((dta) =>
                        item.supervisorchoose.includes(dta)
                      )
                  )
              );

              let answer = uniqueEntries?.map(
                async (data) =>
                  await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    level: String(data.level),
                    control: String(data.control),
                    pagecontrols: data.pagecontrols,
                    employeename: designationlogEdit.companyname,
                    access: data.access,
                    action: Boolean(true),
                    empbranch: designationlogEdit?.branch,
                    empunit: designationlogEdit?.unit,
                    empcode: getingOlddatas?.empcode,
                    empteam: designationlogEdit?.team,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  })
              );
            }
            if (primaryWithoutDep?.length > 0) {
              const uniqueEntries = primaryWithoutDep?.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.department === item.department &&
                      t.supervisorchoose?.length ===
                      item.supervisorchoose?.length &&
                      t.supervisorchoose?.every((dta) =>
                        item.supervisorchoose.includes(dta)
                      )
                  )
              );

              let answer = uniqueEntries?.map(
                async (data) =>
                  await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    level: String(data.level),
                    control: String(data.control),
                    pagecontrols: data.pagecontrols,
                    employeename: designationlogEdit.companyname,
                    access: data.access,
                    action: Boolean(true),
                    empbranch: designationlogEdit?.branch,
                    empunit: designationlogEdit?.unit,
                    empcode: getingOlddatas?.empcode,
                    empteam: designationlogEdit?.team,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  })
              );
            }
            if (secondaryWithoutDep?.length > 0) {
              const uniqueEntries = secondaryWithoutDep?.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.department === item.department &&
                      t.supervisorchoose?.length ===
                      item.supervisorchoose?.length &&
                      t.supervisorchoose?.every((dta) =>
                        item.supervisorchoose.includes(dta)
                      )
                  )
              );

              let answer = uniqueEntries?.map(
                async (data) =>
                  await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    level: String(data.level),
                    control: String(data.control),
                    pagecontrols: data.pagecontrols,
                    employeename: designationlogEdit.companyname,
                    access: data.access,
                    action: Boolean(true),
                    empbranch: designationlogEdit?.branch,
                    empunit: designationlogEdit?.unit,
                    empcode: getingOlddatas?.empcode,
                    empteam: designationlogEdit?.team,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  })
              );
            }
            if (tertiaryWithoutDep?.length > 0) {
              const uniqueEntries = tertiaryWithoutDep?.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.department === item.department &&
                      t.supervisorchoose?.length ===
                      item.supervisorchoose?.length &&
                      t.supervisorchoose?.every((dta) =>
                        item.supervisorchoose.includes(dta)
                      )
                  )
              );

              let answer = uniqueEntries?.map(
                async (data) =>
                  await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    level: String(data.level),
                    control: String(data.control),
                    pagecontrols: data.pagecontrols,
                    employeename: designationlogEdit.companyname,
                    access: data.access,
                    action: Boolean(true),
                    empbranch: designationlogEdit?.branch,
                    empunit: designationlogEdit?.unit,
                    empcode: getingOlddatas?.empcode,
                    empteam: designationlogEdit?.team,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  })
              );
            }
          }
        }
      }
      handleCloseModEdit();
      setFilteredChanges(null)
      setFilteredRowData([]);
      await fetchDesignationlog();
      setDesignationLog({
        ...designationlog,
        designation: "Select Designation",
      });
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setUpdateLoader(false);
    } catch (err) {
      console.log(err, "err");
      console.log("catch");
      setUpdateLoader(false);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const identifySuperVisor =
    hierarchyall
      ?.map((item) => item.supervisorchoose[0])
      ?.includes(designationlogEdit.companyname) &&
    !designationsName?.includes(designationlog.designation);

  const editSubmit = (e) => {
    setUpdateLoader(true);
    e.preventDefault();
    const processdeggrp = designationlogEdit?.process?.slice(-3);
    const primaryDep = newUpdatingData[0]?.primaryDep;
    const secondaryDep = newUpdatingData[0]?.secondaryDep;
    const tertiary = newUpdatingData[0]?.tertiaryDep;
    const primaryDepAll = newUpdatingData[0]?.primaryDepAll;
    const secondaryDepAll = newUpdatingData[0]?.secondaryDepAll;
    const tertiaryAll = newUpdatingData[0]?.tertiaryDepAll;
    const primaryWithoutDep = newUpdatingData[0]?.primaryNotDep;
    const secondaryWithoutDep = newUpdatingData[0]?.secondaryNotDep;
    const tertiaryWithoutDep = newUpdatingData[0]?.tertiaryNotDep;

    if (
      designationlog.startdate !== "Please Select Startdate" && prevLogDates?.includes(designationlog.startdate)
    ) {
      setPopupContentMalert("Date Can not be same as prev logs!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (designationlog.designation === "Select Designation") {
      setPopupContentMalert("Please Select Designation!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      !designationlogEdit?.process?.includes(newDesignationGroup) &&
      designationlogEdit?.processlog?.length > 0
    ) {
      setPopupContentMalert(
        "Please Change Process! Then only Change Designation!"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      changeToDesign === "Please Select New/Replace" &&
      identifySuperVisor
    ) {
      setPopupContentMalert("Please Select New/Replace!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      changeToDesign === "Replace" &&
      identifySuperVisor &&
      superVisorChoosen === "Please Select Supervisor"
    ) {
      setPopupContentMalert("Please Select Supervisor!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (designationlog.startdate === "Please Select Startdate") {
      setPopupContentMalert("Please Select Startdate!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      changeToDesign === "Replace" &&
      oldEmployeeHierData?.length > 0 &&
      primaryDep?.length < 1 &&
      secondaryDep?.length < 1 &&
      tertiary?.length < 1 &&
      primaryDepAll?.length < 1 &&
      secondaryDepAll?.length < 1 &&
      tertiaryAll?.length < 1 &&
      primaryWithoutDep?.length < 1 &&
      secondaryWithoutDep?.length < 1 &&
      tertiaryWithoutDep?.length < 1
    ) {
      setPopupContentMalert(
        "These Employee's Designation is not matched in hierarchy ,Add Hierarchy and update!"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      console.log('check')
      sendEditRequest();
    }
  };

  const [designationlogsFilterArray, setDesignationlogsFilterArray] = useState(
    []
  );

  //get all Sub vendormasters.
  const fetchDesignationlogArray = async () => {
    setPageName(!pageName);
    try {
      let res_users = await axios.get(SERVICE.LOGALLUSER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setDesignationlogsFilterArray(res_users?.data?.allusers);
      setDesignationlogcheck(true);
    } catch (err) {
      setDesignationlogcheck(true);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  useEffect(() => {
    fetchDesignationlogArray();
  }, [isFilterOpen]);

  // Excel
  const fileName = "Designation Log";
  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Designation Log",
    pageStyle: "print",
  });

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [items, setItems] = useState([]);

  const addSerialNumber = (datas) => {

    setItems(datas);
  };

  useEffect(() => {
    addSerialNumber(designationlogs);
  }, [designationlogs]);

  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTable = useRef(null);

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
  // Modify the filtering logic to check each term
  const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchOverTerms.every((term) =>
      Object.values(item)?.join(" ")?.toLowerCase()?.includes(term)
    );
  });

  const filteredData = filteredDatas.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalPages = Math.ceil(filteredDatas.length / pageSize);

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

  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );

  const columnDataTable = [
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 100,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
      pinned: "left",
    },
    {
      field: "companyname",
      headerName: "Company Name",
      flex: 0,
      width: 150,
      hide: !columnVisibility.username,
      headerClassName: "bold-header",
      pinned: "left",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 100,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
      pinned: "left",
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 100,
      hide: !columnVisibility.unit,
      headerClassName: "bold-header",
    },
    {
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 100,
      hide: !columnVisibility.team,
      headerClassName: "bold-header",
    },
    {
      field: "workmode",
      headerName: "Work Mode",
      flex: 0,
      width: 100,
      hide: !columnVisibility.workmode,
      headerClassName: "bold-header",
    },
    {
      field: "username",
      headerName: "Employee Name",
      flex: 0,
      width: 150,
      hide: !columnVisibility.username,
      headerClassName: "bold-header",
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },

      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
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
              onCopy={() => {
                handleCopy("Copied Employee Name!");
              }}
              options={{ message: "Copied Employee Name!" }}
              text={params?.data?.username}
            >
              <ListItemText primary={params?.data?.username} />
            </CopyToClipboard>
          </ListItem>
        </Grid>
      ),
    },
    {
      field: "designation",
      headerName: "Designation",
      flex: 0,
      width: 150,
      hide: !columnVisibility.designation,
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
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },

      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("vdesignationlog") && (
            <Link
              to={`/updatepages/designationloglist/${params.data.id}`}
              target="_blank"
              style={{ textDecoration: "none", color: "#fff", minWidth: "0px" }}
            >
              <Button
                variant="contained"
                sx={{
                  minWidth: "15px",
                  padding: "6px 5px",
                }}
                y
              >
                <MenuIcon style={{ fontsize: "small" }} />
              </Button>
            </Link>
          )}
          &ensp;
          {isUserRoleCompare?.includes("edesignationlog") && (
            <Button
              style={{
                backgroundColor: "red",
                minWidth: "15px",
                padding: "6px 5px",
              }}
              onClick={() => {
                getviewCode(params.data.id);
              }}
            >
              <FaEdit style={{ color: "white", fontSize: "18px" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("idesignationlog") && (
            <Button
              onClick={() => {

                getinfoCode(params.data.id);
              }}
            >
              <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />
            </Button>
          )}
        </Grid>
      ),
    },
  ];

  const rowDataTable = filteredData?.map((item, index) => {
    return {
      ...item,
      id: item.id,
      serialNumber: item.serialNumber,
    };
  });

  const rowsWithCheckboxes = rowDataTable?.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRows?.includes(row.id),
  }));

  // Show All Columns functionality
  const handleShowAllColumns = () => {
    setColumnVisibility(initialColumnVisibility);
  };
  // // Function to filter columns based on search query
  const filteredColumns = columnDataTable?.filter((column) =>
    column.headerName.toLowerCase()?.includes(searchQueryManage.toLowerCase())
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
          {filteredColumns?.map((column) => (
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

  //FILTER START
  const [internChecked, setInternChecked] = useState(false);
  useEffect(() => {
    fetchDepartments();
  }, []);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const fetchDepartments = async () => {
    setPageName(!pageName);
    try {
      let req = await axios.get(SERVICE.DEPARTMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDepartmentOptions(
        req?.data?.departmentdetails?.map((data) => ({
          label: data?.deptname,
          value: data?.deptname,
        }))
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
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [filterState, setFilterState] = useState({
    type: "Individual",
    employeestatus: "Please Select Employee Status",
  });
  const EmployeeStatusOptions = [
    { label: "Live Employee", value: "Live Employee" },
    { label: "Releave Employee", value: "Releave Employee" },
    { label: "Absconded", value: "Absconded" },
    { label: "Hold", value: "Hold" },
    { label: "Terminate", value: "Terminate" },
  ];
  const TypeOptions = [
    { label: "Individual", value: "Individual" },
    { label: "Department", value: "Department" },
    { label: "Company", value: "Company" },
    { label: "Branch", value: "Branch" },
    { label: "Unit", value: "Unit" },
    { label: "Team", value: "Team" },
  ];

  //MULTISELECT ONCHANGE START

  //company multiselect
  const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
  let [valueCompanyCat, setValueCompanyCat] = useState([]);

  const handleCompanyChange = (options) => {
    setValueCompanyCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCompany(options);
    setValueBranchCat([]);
    setSelectedOptionsBranch([]);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
    setValueEmp([]);
  };

  const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
    return valueCompanyCat?.length
      ? valueCompanyCat.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
  };

  //branch multiselect
  const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
  let [valueBranchCat, setValueBranchCat] = useState([]);

  const handleBranchChange = (options) => {
    setValueBranchCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBranch(options);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
    setValueEmp([]);
  };

  const customValueRendererBranch = (valueBranchCat, _categoryname) => {
    return valueBranchCat?.length
      ? valueBranchCat.map(({ label }) => label)?.join(", ")
      : "Please Select Branch";
  };

  //unit multiselect
  const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
  let [valueUnitCat, setValueUnitCat] = useState([]);

  const handleUnitChange = (options) => {
    setValueUnitCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsUnit(options);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
    setValueEmp([]);
  };

  const customValueRendererUnit = (valueUnitCat, _categoryname) => {
    return valueUnitCat?.length
      ? valueUnitCat.map(({ label }) => label)?.join(", ")
      : "Please Select Unit";
  };

  //team multiselect
  const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
  let [valueTeamCat, setValueTeamCat] = useState([]);

  const handleTeamChange = (options) => {
    setValueTeamCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsTeam(options);
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
    setValueEmp([]);
  };

  const customValueRendererTeam = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length
      ? valueTeamCat.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };

  //department multiselect
  const [selectedOptionsDepartment, setSelectedOptionsDepartment] = useState(
    []
  );
  let [valueDepartmentCat, setValueDepartmentCat] = useState([]);

  const handleDepartmentChange = (options) => {
    setValueDepartmentCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsDepartment(options);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
    setValueEmp([]);
  };

  const customValueRendererDepartment = (valueDepartmentCat, _categoryname) => {
    return valueDepartmentCat?.length
      ? valueDepartmentCat.map(({ label }) => label)?.join(", ")
      : "Please Select Department";
  };
  //employee multiselect
  const [selectedOptionsEmployee, setSelectedOptionsEmployee] = useState([]);
  let [valueEmployeeCat, setValueEmployeeCat] = useState([]);

  const handleEmployeeChange = (options) => {
    setValueEmployeeCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setValueEmp(
      options.map((a, index) => {
        return a.value;
      })
    );

    setSelectedOptionsEmployee(options);
  };

  const customValueRendererEmployee = (valueEmployeeCat, _categoryname) => {
    return valueEmployeeCat?.length
      ? valueEmployeeCat.map(({ label }) => label)?.join(", ")
      : "Please Select Employee";
  };

  const [valueEmp, setValueEmp] = React.useState([]); // State for employees
  const [isBoxFocused, setIsBoxFocused] = React.useState(false); // Track focus state


  const [searchInputValue, setSearchInputValue] = useState('');

  const handlePasteForEmp = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');

    // Process the pasted text
    const pastedNames = pastedText
      .split(/[\n,]+/)
      .map(name => name.trim())
      .filter(name => name !== "");

    // Update the state
    updateEmployees(pastedNames);

    // Clear the search input after paste
    setSearchInputValue('');

    // Refocus the element
    e.target.focus();
  };

  useEffect(() => {
    updateEmployees([]); // Pass an empty array instead of an empty string
  }, [allUsersData, valueCompanyCat, valueBranchCat, valueUnitCat, valueTeamCat]);

  const updateEmployees = (pastedNames) => {
    // Your existing update logic...
    const namesArray = Array.isArray(pastedNames) ? pastedNames : [];

    const availableOptions = internChecked
      ? allUsersData
        ?.filter(
          (u) =>
            valueCompanyCat?.includes(u.company) &&
            valueBranchCat?.includes(u.branch) &&
            valueUnitCat?.includes(u.unit) &&
            valueTeamCat?.includes(u.team) &&
            u.workmode === "Internship"
        )
        ?.map(data => data.companyname.replace(/\s*\.\s*/g, ".").trim())
      : allUsersData
        ?.filter(
          (u) =>
            valueCompanyCat?.includes(u.company) &&
            valueBranchCat?.includes(u.branch) &&
            valueUnitCat?.includes(u.unit) &&
            valueTeamCat?.includes(u.team) &&
            u.workmode !== "Internship"
        )
        ?.map(data => data.companyname.replace(/\s*\.\s*/g, ".").trim())

    console.log(availableOptions, "availableOptions")

    const matchedValues = namesArray.filter((name) =>
      availableOptions.includes(name.replace(/\s*\.\s*/g, ".").trim())
    );

    // Update selected options
    const newOptions = matchedValues.map(value => ({
      label: value,
      value: value
    }));

    setSelectedOptionsEmployee(prev => {
      const newValues = newOptions.filter(
        newOpt => !prev.some(prevOpt => prevOpt.value === newOpt.value)
      );
      return [...prev, ...newValues];
    });

    // Update other states...
    setValueEmp(prev => [...new Set([...prev, ...matchedValues])]);
    setValueEmployeeCat(prev => [...new Set([...prev, ...matchedValues])]);
  };

  // Handle clicks outside the Box
  useEffect(() => {
    const handleClickOutside = (e) => {
      const boxElement = document.getElementById("paste-box"); // Add an ID to the Box
      if (boxElement && !boxElement.contains(e.target)) {
        setIsBoxFocused(false); // Reset focus state if clicking outside the Box
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDelete = (e, value) => {
    e.preventDefault();
    setSelectedOptionsEmployee((current) => current.filter(emp => emp.value !== value));
    setValueEmp((current) => current.filter(empValue => empValue !== value));
    setValueEmployeeCat((current) => current.filter(empValue => empValue !== value));
  };

  //MULTISELECT ONCHANGE END
  const handleClearFilter = () => {
    setValueCompanyCat([]);
    setSelectedOptionsCompany([]);
    setValueBranchCat([]);
    setSelectedOptionsBranch([]);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
    setValueEmp([]); setEmployeeOptions([]);
    setDesignationlogs([]);
    setInternChecked(false);
    setFilterState({
      type: "Individual",
      employeestatus: "Please Select Employee Status",
    });

    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  const [filterLoader, setFilterLoader] = useState(false);
  const [tableLoader, setTableLoader] = useState(false);
  const handleFilter = () => {
    if (
      filterState?.type === "Please Select Type" ||
      filterState?.type === ""
    ) {
      setPopupContentMalert("Please Select Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsCompany?.length === 0) {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    // else if (
    //   filterState?.employeestatus === "Please Select Employee Status" ||
    //   filterState?.employeestatus === ""
    // ) {
    //   setPopupContentMalert("Please Select Employee Status!");
    //   setPopupSeverityMalert("info");
    //   handleClickOpenPopupMalert();
    // }
    else if (
      ["Individual", "Branch", "Unit", "Team"]?.includes(filterState?.type) &&
      selectedOptionsBranch?.length === 0
    ) {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      ["Individual", "Unit", "Team"]?.includes(filterState?.type) &&
      selectedOptionsUnit?.length === 0
    ) {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      ["Individual", "Team"]?.includes(filterState?.type) &&
      selectedOptionsTeam?.length === 0
    ) {
      setPopupContentMalert("Please Select Team!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      filterState?.type === "Individual" &&
      selectedOptionsEmployee?.length === 0
    ) {
      setPopupContentMalert("Please Select Employee!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      filterState?.type === "Department" &&
      selectedOptionsDepartment?.length === 0
    ) {
      setPopupContentMalert("Please Select Department!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      fetchDesignationlog();
    }
  };

  const fetchDesignationlog = async () => {
    setFilterLoader(true);
    setTableLoader(true);
    setPageName(!pageName);
    setSearchQuery("");
    setSearchedString("");
    const aggregationPipeline = [
      {
        $match: {
          $and: [
            // Enquiry status filter
            {
              enquirystatus: {
                $nin: ["Enquiry Purpose"],
              },
            },
            // Reasonable status filter
            {
              resonablestatus: {
                $nin: [
                  "Not Joined",
                  "Postponed",
                  "Rejected",
                  "Closed",
                  "Releave Employee",
                  "Absconded",
                  "Hold",
                  "Terminate",
                ],
              },
            },
            // Conditional company filter
            ...(valueCompanyCat.length > 0
              ? [
                {
                  company: { $in: valueCompanyCat },
                },
              ]
              : [
                {
                  company: { $in: allAssignCompany },
                },
              ]),
            // Conditional branch filter
            ...(valueBranchCat.length > 0
              ? [
                {
                  branch: { $in: valueBranchCat },
                },
              ]
              : [
                {
                  branch: { $in: allAssignBranch },
                },
              ]),
            // Conditional unit filter
            ...(valueUnitCat.length > 0
              ? [
                {
                  unit: { $in: valueUnitCat },
                },
              ]
              : [
                {
                  unit: { $in: allAssignUnit },
                },
              ]),
            // Conditional team filter
            ...(valueTeamCat.length > 0
              ? [
                {
                  team: { $in: valueTeamCat },
                },
              ]
              : []),
            // Conditional department filter
            ...(valueDepartmentCat.length > 0
              ? [
                {
                  department: { $in: valueDepartmentCat },
                },
              ]
              : []),
            // Conditional Employee filter
            ...(valueEmployeeCat.length > 0
              ? [
                {
                  companyname: { $in: valueEmployeeCat },
                },
              ]
              : []),
          ],
        },
      },
      {
        $project: {
          empcode: 1,
          companyname: 1,
          username: 1,
          branch: 1,
          unit: 1,
          team: 1,
          company: 1,
          shift: 1,
          doj: 1,
          department: 1,
          designationlog: 1,
          departmentlog: 1,
          processlog: 1,
          boardingLog: 1,
          designation: 1,
          floor: 1,
          reportingto: 1,
          shifttiming: 1,
          shiftgrouping: 1,
          shifttype: 1,
          weekoff: 1,
          area: 1,
          shiftallot: 1,
          workmode: 1,
        },
      },
    ];
    try {
      let response = await axios.post(
        SERVICE.DYNAMICUSER_CONTROLLER,
        {
          aggregationPipeline,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      const itemsWithSerialNumber = response.data.users?.map((item, index) => ({
        ...items,
        id: item._id,
        serialNumber: index + 1,
        empcode: item.empcode,
        username: item.companyname,
        companyname: item.company,
        branch: item.branch,
        unit: item.unit,
        team: item.team,
        workmode: item.workmode,
        employeename: item.companyname,
        designation: item.designation,
      }));
      setSearchQuery("");
      setFilteredChanges(null)
      setFilteredRowData([]);
      setDesignationlogs(itemsWithSerialNumber);

      setFilterLoader(false);
      setTableLoader(false);
    } catch (err) {
      console.log(err);
      setFilterLoader(true);
      setTableLoader(true);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  //auto select all dropdowns
  const [allAssignCompany, setAllAssignCompany] = useState([]);
  const [allAssignBranch, setAllAssignBranch] = useState([]);
  const [allAssignUnit, setAllAssignUnit] = useState([]);
  const handleAutoSelect = async () => {
    setPageName(!pageName);
    try {
      let selectedValues = accessbranch
        ?.map((data) => ({
          company: data.company,
          branch: data.branch,
          unit: data.unit,
        }))
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.company === value.company &&
                t.branch === value.branch &&
                t.unit === value.unit
            )
        );
      let selectedCompany = selectedValues
        ?.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.company === value.company)
        )
        .map((a, index) => {
          return a.company;
        });

      let mappedCompany = selectedValues
        ?.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.company === value.company)
        )
        ?.map((data) => ({
          label: data?.company,
          value: data?.company,
        }));

      setValueCompanyCat(selectedCompany);
      setSelectedOptionsCompany(mappedCompany);

      let selectedBranch = selectedValues
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) => t.company === value.company && t.branch === value.branch
            )
        )
        .map((a, index) => {
          return a.branch;
        });

      let mappedBranch = selectedValues
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) => t.company === value.company && t.branch === value.branch
            )
        )
        ?.map((data) => ({
          label: data?.branch,
          value: data?.branch,
        }));

      setValueBranchCat(selectedBranch);
      setSelectedOptionsBranch(mappedBranch);

      let selectedUnit = selectedValues
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.company === value.company &&
                t.branch === value.branch &&
                t.unit === value.unit
            )
        )
        .map((a, index) => {
          return a.unit;
        });

      let mappedUnit = selectedValues
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.company === value.company &&
                t.branch === value.branch &&
                t.unit === value.unit
            )
        )
        ?.map((data) => ({
          label: data?.unit,
          value: data?.unit,
        }));

      setValueUnitCat(selectedUnit);
      setSelectedOptionsUnit(mappedUnit);

      let mappedTeam = allTeam
        ?.filter(
          (u) =>
            selectedCompany?.includes(u.company) &&
            selectedBranch?.includes(u.branch) &&
            selectedUnit?.includes(u.unit)
        )
        .map((u) => ({
          label: u.teamname,
          value: u.teamname,
        }));

      let selectedTeam = allTeam
        ?.filter(
          (u) =>
            selectedCompany?.includes(u.company) &&
            selectedBranch?.includes(u.branch) &&
            selectedUnit?.includes(u.unit)
        )
        .map((u) => u.teamname);

      let mappedemployees = allUsersData
        ?.filter(
          (u) =>
            selectedCompany?.includes(u.company) &&
            selectedBranch?.includes(u.branch) &&
            selectedUnit?.includes(u.unit) &&
            selectedTeam?.includes(u.team) &&
            u.workmode !== "Internship"
        )
        .map((u) => ({
          label: u.companyname,
          value: u.companyname,
        }));

      let employees = allUsersData
        ?.filter(
          (u) =>
            selectedCompany?.includes(u.company) &&
            selectedBranch?.includes(u.branch) &&
            selectedUnit?.includes(u.unit) &&
            selectedTeam?.includes(u.team) &&
            u.workmode !== "Internship"
        )
        .map((u) => u.companyname);
      setValueTeamCat(selectedTeam);
      setSelectedOptionsTeam(mappedTeam);
      setAllAssignCompany(selectedCompany);

      setAllAssignBranch(selectedBranch);

      setAllAssignUnit(selectedUnit);

      setValueEmployeeCat(employees);
      setSelectedOptionsEmployee(mappedemployees);
      setValueEmp(mappedemployees?.map((item) => item?.value));

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
    handleAutoSelect();
  }, [isAssignBranch]);

  //FILTER END

  return (
    <Box>
      <NotificationContainer />
      <Headtitle title={"DESIGNATION LOG"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Designation Log"
        modulename="Human Resources"
        submodulename="HR"
        mainpagename="Employee"
        subpagename="Employee Log Details"
        subsubpagename="Designation Log"
      />
      {isUserRoleCompare?.includes("ldesignationlog") && (
        <>
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Type<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={TypeOptions}
                      styles={colourStyles}
                      value={{
                        label: filterState.type ?? "Please Select Type",
                        value: filterState.type ?? "Please Select Type",
                      }}
                      onChange={(e) => {
                        setFilterState((prev) => ({
                          ...prev,
                          type: e.value,
                        }));
                        setValueCompanyCat([]);
                        setSelectedOptionsCompany([]);
                        setValueBranchCat([]);
                        setSelectedOptionsBranch([]);
                        setValueUnitCat([]);
                        setSelectedOptionsUnit([]);
                        setValueTeamCat([]);
                        setSelectedOptionsTeam([]);
                        setValueDepartmentCat([]);
                        setSelectedOptionsDepartment([]);
                        setValueEmployeeCat([]);
                        setSelectedOptionsEmployee([]);
                        setValueEmp([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    Company<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <MultiSelect
                      options={accessbranch
                        ?.map((data) => ({
                          label: data.company,
                          value: data.company,
                        }))
                        .filter((item, index, self) => {
                          return (
                            self.findIndex(
                              (i) =>
                                i.label === item.label && i.value === item.value
                            ) === index
                          );
                        })}
                      value={selectedOptionsCompany}
                      onChange={(e) => {
                        handleCompanyChange(e);
                      }}
                      valueRenderer={customValueRendererCompany}
                      labelledBy="Please Select Company"
                    />
                  </FormControl>
                </Grid>

                {/* <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Employee Status<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={EmployeeStatusOptions}
                        styles={colourStyles}
                        value={{
                          label:
                            filterState.employeestatus ??
                            "Please Select Employee Status",
                          value:
                            filterState.employeestatus ??
                            "Please Select Employee Status",
                        }}
                        onChange={(e) => {
                          setFilterState((prev) => ({
                            ...prev,
                            employeestatus: e.value,
                          }));
                          setValueBranchCat([]);
                          setSelectedOptionsBranch([]);
                          setValueUnitCat([]);
                          setSelectedOptionsUnit([]);
                          setValueTeamCat([]);
                          setSelectedOptionsTeam([]);
                          setValueDepartmentCat([]);
                          setSelectedOptionsDepartment([]);
                          setValueEmployeeCat([]);
                          setSelectedOptionsEmployee([]);
                        }}
                      />
                    </FormControl>
                  </Grid> */}

                {["Individual", "Team"]?.includes(filterState.type) ? (
                  <>
                    {/* Branch Unit Team */}
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          {" "}
                          Branch <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={accessbranch
                            ?.filter((comp) =>
                              valueCompanyCat?.includes(comp.company)
                            )
                            ?.map((data) => ({
                              label: data.branch,
                              value: data.branch,
                            }))
                            .filter((item, index, self) => {
                              return (
                                self.findIndex(
                                  (i) =>
                                    i.label === item.label &&
                                    i.value === item.value
                                ) === index
                              );
                            })}
                          value={selectedOptionsBranch}
                          onChange={(e) => {
                            handleBranchChange(e);
                          }}
                          valueRenderer={customValueRendererBranch}
                          labelledBy="Please Select Branch"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          {" "}
                          Unit<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={accessbranch
                            ?.filter(
                              (comp) =>
                                valueCompanyCat?.includes(comp.company) &&
                                valueBranchCat?.includes(comp.branch)
                            )
                            ?.map((data) => ({
                              label: data.unit,
                              value: data.unit,
                            }))
                            .filter((item, index, self) => {
                              return (
                                self.findIndex(
                                  (i) =>
                                    i.label === item.label &&
                                    i.value === item.value
                                ) === index
                              );
                            })}
                          value={selectedOptionsUnit}
                          onChange={(e) => {
                            handleUnitChange(e);
                          }}
                          valueRenderer={customValueRendererUnit}
                          labelledBy="Please Select Unit"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Team<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={allTeam
                            ?.filter(
                              (u) =>
                                valueCompanyCat?.includes(u.company) &&
                                valueBranchCat?.includes(u.branch) &&
                                valueUnitCat?.includes(u.unit)
                            )
                            .map((u) => ({
                              ...u,
                              label: u.teamname,
                              value: u.teamname,
                            }))}
                          value={selectedOptionsTeam}
                          onChange={(e) => {
                            handleTeamChange(e);
                          }}
                          valueRenderer={customValueRendererTeam}
                          labelledBy="Please Select Team"
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : ["Department"]?.includes(filterState.type) ? (
                  <>
                    {/* Department */}
                    <Grid item md={3} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Department<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={departmentOptions}
                          value={selectedOptionsDepartment}
                          onChange={(e) => {
                            handleDepartmentChange(e);
                          }}
                          valueRenderer={customValueRendererDepartment}
                          labelledBy="Please Select Department"
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : ["Branch"]?.includes(filterState.type) ? (
                  <>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          {" "}
                          Branch <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={accessbranch
                            ?.filter((comp) =>
                              valueCompanyCat?.includes(comp.company)
                            )
                            ?.map((data) => ({
                              label: data.branch,
                              value: data.branch,
                            }))
                            .filter((item, index, self) => {
                              return (
                                self.findIndex(
                                  (i) =>
                                    i.label === item.label &&
                                    i.value === item.value
                                ) === index
                              );
                            })}
                          value={selectedOptionsBranch}
                          onChange={(e) => {
                            handleBranchChange(e);
                          }}
                          valueRenderer={customValueRendererBranch}
                          labelledBy="Please Select Branch"
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : ["Unit"]?.includes(filterState.type) ? (
                  <>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          {" "}
                          Branch<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={accessbranch
                            ?.filter((comp) =>
                              valueCompanyCat?.includes(comp.company)
                            )
                            ?.map((data) => ({
                              label: data.branch,
                              value: data.branch,
                            }))
                            .filter((item, index, self) => {
                              return (
                                self.findIndex(
                                  (i) =>
                                    i.label === item.label &&
                                    i.value === item.value
                                ) === index
                              );
                            })}
                          value={selectedOptionsBranch}
                          onChange={(e) => {
                            handleBranchChange(e);
                          }}
                          valueRenderer={customValueRendererBranch}
                          labelledBy="Please Select Branch"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          {" "}
                          Unit <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={accessbranch
                            ?.filter(
                              (comp) =>
                                valueCompanyCat?.includes(comp.company) &&
                                valueBranchCat?.includes(comp.branch)
                            )
                            ?.map((data) => ({
                              label: data.unit,
                              value: data.unit,
                            }))
                            .filter((item, index, self) => {
                              return (
                                self.findIndex(
                                  (i) =>
                                    i.label === item.label &&
                                    i.value === item.value
                                ) === index
                              );
                            })}
                          value={selectedOptionsUnit}
                          onChange={(e) => {
                            handleUnitChange(e);
                          }}
                          valueRenderer={customValueRendererUnit}
                          labelledBy="Please Select Unit"
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : (
                  ""
                )}
                {["Individual"]?.includes(filterState.type) && (
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Employee<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <div
                        onPaste={handlePasteForEmp}
                        style={{ position: 'relative' }}
                      >
                        <MultiSelect
                          options={
                            internChecked
                              ? allUsersData
                                ?.filter(
                                  (u) =>
                                    valueCompanyCat?.includes(u.company) &&
                                    valueBranchCat?.includes(u.branch) &&
                                    valueUnitCat?.includes(u.unit) &&
                                    valueTeamCat?.includes(u.team) &&
                                    u.workmode === "Internship"
                                )
                                .map((u) => ({
                                  label: u.companyname,
                                  value: u.companyname,
                                }))
                              : allUsersData
                                ?.filter(
                                  (u) =>
                                    valueCompanyCat?.includes(u.company) &&
                                    valueBranchCat?.includes(u.branch) &&
                                    valueUnitCat?.includes(u.unit) &&
                                    valueTeamCat?.includes(u.team) &&
                                    u.workmode !== "Internship"
                                )
                                .map((u) => ({
                                  label: u.companyname,
                                  value: u.companyname,
                                }))
                          }
                          value={selectedOptionsEmployee}
                          onChange={(e) => {
                            handleEmployeeChange(e);
                          }}
                          valueRenderer={customValueRendererEmployee}
                          labelledBy="Please Select Employee"
                          // Add these props if your MultiSelect supports them
                          inputValue={searchInputValue} // Add this state if needed
                          onInputChange={(newValue) => setSearchInputValue(newValue)}
                        />
                      </div>
                    </FormControl>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={internChecked}
                          onChange={(event) => {
                            setInternChecked(event.target.checked);
                            setValueEmployeeCat([]);
                            setSelectedOptionsEmployee([]);
                            setValueEmp([]);
                          }}
                        />
                      }
                      label="Internship"
                    />
                  </Grid>
                )}
                {["Individual"]?.includes(filterState.type) &&
                  <Grid item md={6} sm={12} xs={12} sx={{ display: "flex", flexDirection: "row" }}>
                    <FormControl fullWidth size="small">
                      <Typography>Selected Employees</Typography>
                      <div
                        id="paste-box" // Add an ID to the Box
                        tabIndex={0} // Make the div focusable
                        style={{
                          border: '1px solid #ccc',
                          borderRadius: '3.75px',
                          height: '110px',
                          overflow: 'auto',
                        }}
                        onPaste={handlePasteForEmp}
                        onFocus={() => setIsBoxFocused(true)} // Set focus state to true
                        onBlur={(e) => {
                          if (isBoxFocused) {
                            e.target.focus(); // Refocus only if the Box was previously focused
                          }
                        }}
                      >
                        {valueEmp.map((value) => (
                          <Chip
                            key={value}
                            label={value}
                            clickable
                            sx={{ margin: 0.2, backgroundColor: "#FFF" }}
                            onDelete={(e) => handleDelete(e, value)}
                            onClick={() => console.log("clicked chip")}
                          />
                        ))}
                      </div>
                    </FormControl>
                  </Grid>
                }
                <Grid item md={3} xs={12} sm={6} mt={3}>
                  <div style={{ display: "flex", gap: "20px" }}>
                    <LoadingButton
                      variant="contained"
                      color="primary"
                      onClick={handleFilter}
                      loading={filterLoader}
                      sx={buttonStyles.buttonsubmit}
                    >
                      Filter
                    </LoadingButton>

                    <Button
                      sx={buttonStyles.btncancel}
                      onClick={handleClearFilter}
                    >
                      Clear
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </>
          </Box>
        </>
      )}
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("ldesignationlog") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                {" "}
                Designation Assign Log
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
                    <MenuItem value={designationlogs?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes("exceldesignationlog") && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          fetchDesignationlogArray();
                          setFormat("xl");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileExcel />
                        &ensp;Export to Excel&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvdesignationlog") && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          fetchDesignationlogArray();
                          setFormat("csv");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileCsv />
                        &ensp;Export to CSV&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("printdesignationlog") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfdesignationlog") && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true);
                          fetchDesignationlogArray();
                        }}
                      >
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imagedesignationlog") && (
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
                <AggregatedSearchBar
                  columnDataTable={columnDataTable}
                  setItems={setItems}
                  addSerialNumber={addSerialNumber}
                  setPage={setPage}
                  maindatas={designationlogs}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                  totalDatas={designationlogs}
                />
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
            <br />
            <br />
            {tableLoader ? (
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
                <AggridTable
                  rowDataTable={rowDataTable}
                  columnDataTable={columnDataTable}
                  columnVisibility={columnVisibility}
                  page={page}
                  setPage={setPage}
                  pageSize={pageSize}
                  totalPages={totalPages}
                  setColumnVisibility={setColumnVisibility}
                  isHandleChange={isHandleChange}
                  items={items}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                  gridRefTable={gridRefTable}
                  paginated={false}
                  filteredDatas={filteredDatas}
                  // totalDatas={totalProjects}
                  searchQuery={searchQuery}
                  handleShowAllColumns={handleShowAllColumns}
                  setFilteredRowData={setFilteredRowData}
                  filteredRowData={filteredRowData}
                  setFilteredChanges={setFilteredChanges}
                  filteredChanges={filteredChanges}
                  gridRefTableImg={gridRefTableImg}
                  itemsList={designationlogs}
                />
              </>
            )}
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
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <Typography sx={userStyle.HeaderText}>
                    Designation Log Change
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Employee Name </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={designationlogEdit.companyname}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    Department<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput value={designationlog.department} />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>Old Designation</Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput value={olddesignation} />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>Old Designation Group</Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput value={oldDesignationGroup} />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      New Designation<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={designationdatasEdit}
                      styles={colourStyles}
                      value={{
                        label: designationlog.designation,
                        value: designationlog.designation,
                      }}
                      onChange={(e) => {
                        setDesignationLog({
                          ...designationlog,
                          designation: e.value,
                          startdate: "Please Select Startdate",
                        });
                        fetchDesignationMonthChange(
                          e,
                          designationlogEdit.doj,
                          designationlogEdit.department
                        );
                        fetchDesignationgroup(e);
                        checkHierarchyName(e.value, "Designation");
                        fetchNewDesignationGroup(e.value);
                        fetchSuperVisorChangingHierarchy(e.value);
                        fetchReportingToUserHierarchy(e.value);
                        setSuperVisorChoosen("Please Select Supervisor");
                        setChangeToDesign("Replace");
                      }}
                    />
                    {!showButton && (
                      <Typography style={{ color: "red", fontSize: "10px" }}>
                        This designation cannot be updated now.
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>New Designation Group</Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput value={newDesignationGroup} />
                  </FormControl>
                </Grid>
                {hierarchyall
                  ?.map((item) => item.supervisorchoose[0])
                  ?.includes(designationlogEdit.companyname) &&
                  !designationsName?.includes(designationlog.designation) && (
                    <>
                      <Grid item md={3} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Change To<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <Selects
                            options={changeTo}
                            value={{
                              label: changeToDesign,
                              value: changeToDesign,
                            }}
                            onChange={(e) => {
                              setChangeToDesign(e.value);
                              setSuperVisorChoosen("Please Select Supervisor");
                            }}
                          />
                        </FormControl>
                      </Grid>

                      {changeToDesign === "Replace" && (
                        <Grid item md={3} sm={6} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Choose Supervisor{" "}
                              <b style={{ color: "red" }}>*</b>
                            </Typography>
                            <Selects
                              options={users?.filter(
                                (data) => data?.designation === olddesignation
                              )}
                              value={{
                                label: superVisorChoosen,
                                value: superVisorChoosen,
                              }}
                              onChange={(e) => {
                                setSuperVisorChoosen(e.value);
                              }}
                            />
                          </FormControl>
                        </Grid>
                      )}
                    </>
                  )}

                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Start Date<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={startdateoptionsEdit}
                      styles={colourStyles}
                      value={{
                        label: designationlog.startdate,
                        value: designationlog.startdate,
                      }}
                      onChange={(e) => {
                        setDesignationLog({
                          ...designationlog,
                          startdate: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <LoadingButton
                    variant="contained"
                    color="primary"
                    onClick={editSubmit}
                    loading={updateLoader}
                    sx={buttonStyles.buttonsubmit}
                  >
                    Update
                  </LoadingButton>
                  &emsp;
                  <Button
                    sx={buttonStyles.btncancel}
                    onClick={handleCloseModEdit}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </Dialog>
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
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
        itemsTwo={designationlogs ?? []}
        filename={fileName}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Designation Log Info"
        addedby={addedby}
        updateby={updateby}
      />

      {/* EXTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}

export default DesignationLog;
