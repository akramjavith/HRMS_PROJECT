import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  TableBody,
  TableRow,
  TableCell,
  Select,
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Paper,
  Table,
  TableHead,
  TableContainer,
  Button,
  List,
  ListItem,
  ListItemText,
  Popover,
  Checkbox,
  TextField,
  IconButton,
} from "@mui/material";
import { userStyle, colourStyles } from "../../../../pageStyle";
import { FaPrint, FaFilePdf, FaEdit } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import moment from "moment-timezone";
import {
  UserRoleAccessContext,
  AuthContext,
} from "../../../../context/Appcontext";
import Headtitle from "../../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import StyledDataGrid from "../../../../components/TableStyle";
import { handleApiError } from "../../../../components/Errorhandling";
import Selects from "react-select";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { Link } from "react-router-dom";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";

import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
function DesignationLog() {
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

  const { isUserRoleCompare, isUserRoleAccess, alldesignation, allUsersData } =
    useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);

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
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Designation Assign Log.png");
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
  const [superVisorChoosen, setSuperVisorChoosen] = useState("Please Select Supervisor");
  const [changeToDesign, setChangeToDesign] = useState("Please Select New/Replace");
  //get all Hierarchy.
  const fetchAllHierarchy = async () => {
    try {
      let res = await axios.get(SERVICE.HIRERARCHI, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setHierarchyall(res?.data?.hirerarchi);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const [designationGrp, setDesignationGrp] = useState([]);

  const fetchAllDesignationGrp = async () => {
    setDesignationGrp(alldesignation);
  };

  const [users, setUsers] = useState([]);

  const fetchAllUsersLimit = async () => {

  };

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
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [olddesignation, setOldDesignation] = useState("");
  const [oldDesignationGroup, setOldDesignationGroup] = useState("");
  const [newDesignationGroup, setNewDesignationGroup] = useState("");
  // const [olddesignation, setOldDesignation] = useState("");
  // get single row to view....
  const getviewCode = async (e) => {
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
      setDesignationLog({
        ...designationlog,
        username: res?.data?.suser?.username,
        empcode: res?.data?.suser?.empcode,
        designation: res?.data?.suser?.designation,
        department: res?.data?.suser?.department,
      });
      handleClickOpenEdit();
      setGettingOldDatas(res?.data?.suser);
      let designationGrpName = alldesignation?.find(
        (data) => res?.data?.suser?.designation === data?.name
      )?.group;
      setOldDesignationGroup(designationGrpName)
      setNewDesignationGroup(designationGrpName)
      let allDesignations = alldesignation
        ?.filter((data) => designationGrpName === data?.group)
        ?.map((item) => item?.name);
      const fitleredUsers = [
        ...allUsersData?.filter(data => data?.designation === res?.data?.suser?.designation && data?.companyname !== res?.data?.suser?.companyname).map((d) => ({
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const fetchNewDesignationGroup = (value) => {
    let designationGrpName = alldesignation?.find(
      (data) => value === data?.name
    )?.group;
    setNewDesignationGroup(designationGrpName)
  }

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
        user: designationlogEdit
      });
      const oldData = res?.data?.olddata?.length > 0 ? res?.data?.olddata : [];
      const newdata = res?.data?.newdata?.length > 0 ? res?.data?.newdata : [];
      const oldDataEmp = res?.data?.olddataEmp?.length > 0 ? res?.data?.olddataEmp : [];
      setOldUpdatedData(oldData);
      setNewUpdatingData(newdata);
      setOldEmployeeHierData(oldDataEmp)

    }
    else {
      setOldUpdatedData([]);
      setNewUpdatingData([]);
      setOldEmployeeHierData([])
    }

  }
  const fetchReportingToUserHierarchy = async (value) => {
    if (olddesignation !== value) {
      let designationGrpName = alldesignation?.find(
        (data) => value === data?.name
      )?.group;
      let res = await axios.post(SERVICE.REPORTINGTO_DESIGNATION_USER_HIERARCHY_RELATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        olddesig: oldDesignationGroup,
        designation: value,
        desiggroup: designationGrpName,
        user: designationlogEdit
      });
      const userResponse = res?.data?.newdata[0]?.result?.length > 0 ? res?.data?.newdata[0]?.result : []
      setUserReportingToChange(userResponse)
    }
    else {
      setUserReportingToChange([]);
    }

  }




  // get single row to view....
  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDesignationlogEdit(res?.data?.suser);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const [showButton, setShowButton] = useState(true);

 
  const fetchDesignationgroup = async (e) => {
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //get all Designationmonthset
  const fetchDesignationMonthChange = async (e, Doj, Dep) => {
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchDptDesignation = async (value) => {
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
    try {
      if (changeToDesign === "New") {
        let res = await axios.put(
          `${SERVICE.USER_SINGLE_PWD}/${designationlogEdit._id}`,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            designation: String(designationlog.designation),
            role: roles,

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
          },
        );

      } else {
        let res = await axios.put(
          `${SERVICE.USER_SINGLE_PWD}/${designationlogEdit._id}`,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            designation: String(designationlog.designation),
            role: roles,

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
          },
          {}
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

            if ([primaryDep, secondaryDep, tertiary, primaryDepAll, secondaryDepAll, tertiaryAll,
              primaryWithoutDep, secondaryWithoutDep, tertiaryWithoutDep].some(dep => dep?.length > 0)) {
              const supervisor = userReportingToChange[0]?.supervisorchoose;
              let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${designationlogEdit?._id}`, {
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
              });
            }


            if (primaryDep?.length > 0) {
              const uniqueEntries = primaryDep?.filter((item, index, self) =>
                index === self.findIndex((t) =>
                  t.company === item.company &&
                  t.branch === item.branch &&
                  t.unit === item.unit &&
                  t.team === item.team &&
                  t.supervisorchoose?.length === item.supervisorchoose?.length &&
                  t.supervisorchoose?.every(dta => item.supervisorchoose.includes(dta))
                )
              );

              let answer = uniqueEntries?.map(async data =>
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
                  employeename: designationlogEdit.companyname,
                  access: data.access,
                  action: Boolean(true),
                  empbranch: designationlogEdit?.branch,
                  empunit: designationlogEdit?.unit,
                  empcode: designationlogEdit?.empcode,
                  empteam: designationlogEdit?.team,
                  addedby: [
                    {
                      name: String(isUserRoleAccess?.username),
                      date: String(new Date()),
                    },
                  ],
                })
              )

            }
            if (secondaryDep?.length > 0) {
              const uniqueEntries = secondaryDep?.filter((item, index, self) =>
                index === self.findIndex((t) =>
                  t.company === item.company &&
                  t.branch === item.branch &&
                  t.unit === item.unit &&
                  t.team === item.team &&
                  t.supervisorchoose?.length === item.supervisorchoose?.length &&
                  t.supervisorchoose?.every(dta => item.supervisorchoose.includes(dta))
                )
              );

              let answer = uniqueEntries?.map(async data =>
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
                  employeename: designationlogEdit.companyname,
                  access: data.access,
                  action: Boolean(true),
                  empbranch: designationlogEdit?.branch,
                  empunit: designationlogEdit?.unit,
                  empcode: designationlogEdit?.empcode,
                  empteam: designationlogEdit?.team,
                  addedby: [
                    {
                      name: String(isUserRoleAccess?.username),
                      date: String(new Date()),
                    },
                  ],
                })
              )

            }
            if (tertiary?.length > 0) {
              const uniqueEntries = tertiary?.filter((item, index, self) =>
                index === self.findIndex((t) =>
                  t.company === item.company &&
                  t.branch === item.branch &&
                  t.unit === item.unit &&
                  t.team === item.team &&
                  t.supervisorchoose?.length === item.supervisorchoose?.length &&
                  t.supervisorchoose?.every(dta => item.supervisorchoose.includes(dta))
                )
              );

              let answer = uniqueEntries?.map(async data =>
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
                  employeename: designationlogEdit.companyname,
                  access: data.access,
                  action: Boolean(true),
                  empbranch: designationlogEdit?.branch,
                  empunit: designationlogEdit?.unit,
                  empcode: designationlogEdit?.empcode,
                  empteam: designationlogEdit?.team,
                  addedby: [
                    {
                      name: String(isUserRoleAccess?.username),
                      date: String(new Date()),
                    },
                  ],
                })
              )

            }
            if (primaryDepAll?.length > 0) {
              const uniqueEntries = primaryDepAll?.filter((item, index, self) =>
                index === self.findIndex((t) =>
                  t.company === item.company &&
                  t.branch === item.branch &&
                  t.unit === item.unit &&
                  t.team === item.team &&
                  t.supervisorchoose?.length === item.supervisorchoose?.length &&
                  t.supervisorchoose?.every(dta => item.supervisorchoose.includes(dta))
                )
              );

              let answer = uniqueEntries?.map(async data =>
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
                  employeename: designationlogEdit.companyname,
                  access: data.access,
                  action: Boolean(true),
                  empbranch: designationlogEdit?.branch,
                  empunit: designationlogEdit?.unit,
                  empcode: designationlogEdit?.empcode,
                  empteam: designationlogEdit?.team,
                  addedby: [
                    {
                      name: String(isUserRoleAccess?.username),
                      date: String(new Date()),
                    },
                  ],
                })
              )

            }
            if (secondaryDepAll?.length > 0) {
              const uniqueEntries = secondaryDepAll?.filter((item, index, self) =>
                index === self.findIndex((t) =>
                  t.company === item.company &&
                  t.branch === item.branch &&
                  t.unit === item.unit &&
                  t.team === item.team &&
                  t.supervisorchoose?.length === item.supervisorchoose?.length &&
                  t.supervisorchoose?.every(dta => item.supervisorchoose.includes(dta))
                )
              );

              let answer = uniqueEntries?.map(async data =>
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
                  employeename: designationlogEdit.companyname,
                  access: data.access,
                  action: Boolean(true),
                  empbranch: designationlogEdit?.branch,
                  empunit: designationlogEdit?.unit,
                  empcode: designationlogEdit?.empcode,
                  empteam: designationlogEdit?.team,
                  addedby: [
                    {
                      name: String(isUserRoleAccess?.username),
                      date: String(new Date()),
                    },
                  ],
                })
              )

            }
            if (tertiaryAll?.length > 0) {
              const uniqueEntries = tertiaryAll?.filter((item, index, self) =>
                index === self.findIndex((t) =>
                  t.company === item.company &&
                  t.branch === item.branch &&
                  t.unit === item.unit &&
                  t.team === item.team &&
                  t.supervisorchoose?.length === item.supervisorchoose?.length &&
                  t.supervisorchoose?.every(dta => item.supervisorchoose.includes(dta))
                )
              );

              let answer = uniqueEntries?.map(async data =>
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
                  employeename: designationlogEdit.companyname,
                  access: data.access,
                  action: Boolean(true),
                  empbranch: designationlogEdit?.branch,
                  empunit: designationlogEdit?.unit,
                  empcode: designationlogEdit?.empcode,
                  empteam: designationlogEdit?.team,
                  addedby: [
                    {
                      name: String(isUserRoleAccess?.username),
                      date: String(new Date()),
                    },
                  ],
                })
              )

            }
            if (primaryWithoutDep?.length > 0) {
              const uniqueEntries = primaryWithoutDep?.filter((item, index, self) =>
                index === self.findIndex((t) =>
                  t.department === item.department &&
                  t.supervisorchoose?.length === item.supervisorchoose?.length &&
                  t.supervisorchoose?.every(dta => item.supervisorchoose.includes(dta))
                )
              );

              let answer = uniqueEntries?.map(async data =>
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
                  employeename: designationlogEdit.companyname,
                  access: data.access,
                  action: Boolean(true),
                  empbranch: designationlogEdit?.branch,
                  empunit: designationlogEdit?.unit,
                  empcode: designationlogEdit?.empcode,
                  empteam: designationlogEdit?.team,
                  addedby: [
                    {
                      name: String(isUserRoleAccess?.username),
                      date: String(new Date()),
                    },
                  ],
                })
              )

            }
            if (secondaryWithoutDep?.length > 0) {
              const uniqueEntries = secondaryWithoutDep?.filter((item, index, self) =>
                index === self.findIndex((t) =>
                  t.department === item.department &&
                  t.supervisorchoose?.length === item.supervisorchoose?.length &&
                  t.supervisorchoose?.every(dta => item.supervisorchoose.includes(dta))
                )
              );

              let answer = uniqueEntries?.map(async data =>
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
                  employeename: designationlogEdit.companyname,
                  access: data.access,
                  action: Boolean(true),
                  empbranch: designationlogEdit?.branch,
                  empunit: designationlogEdit?.unit,
                  empcode: designationlogEdit?.empcode,
                  empteam: designationlogEdit?.team,
                  addedby: [
                    {
                      name: String(isUserRoleAccess?.username),
                      date: String(new Date()),
                    },
                  ],
                })
              )

            }
            if (tertiaryWithoutDep?.length > 0) {
              const uniqueEntries = tertiaryWithoutDep?.filter((item, index, self) =>
                index === self.findIndex((t) =>
                  t.department === item.department &&
                  t.supervisorchoose?.length === item.supervisorchoose?.length &&
                  t.supervisorchoose?.every(dta => item.supervisorchoose.includes(dta))
                )
              );

              let answer = uniqueEntries?.map(async data =>
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
                  employeename: designationlogEdit.companyname,
                  access: data.access,
                  action: Boolean(true),
                  empbranch: designationlogEdit?.branch,
                  empunit: designationlogEdit?.unit,
                  empcode: designationlogEdit?.empcode,
                  empteam: designationlogEdit?.team,
                  addedby: [
                    {
                      name: String(isUserRoleAccess?.username),
                      date: String(new Date()),
                    },
                  ],
                })
              )

            }

          }
          //Removing old supervisor to new supervisor
          if (oldUpdatedData?.length > 0
          ) {

            oldUpdatedData?.map(async (data, index) => {
              axios.put(`${SERVICE.HIRERARCHI_SINGLE}/${data?._id}`, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
                supervisorchoose: superVisorChoosen,
              });
            })

          }
          // Changing Employee from one deignation to another ==>> Replace
          if (oldEmployeeHierData?.length > 0 && newUpdatingData?.length > 0
          ) {

            let ans = oldEmployeeHierData?.map(data => {
              axios.delete(`${SERVICE.HIRERARCHI_SINGLE}/${data?._id}`, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
              });
            })

          }
        }

        // Only for Employees
        if (!identifySuperVisor) {
          if (oldEmployeeHierData?.length > 0
          ) {
            let ans = oldEmployeeHierData?.map(data => {
              axios.delete(`${SERVICE.HIRERARCHI_SINGLE}/${data?._id}`, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
              });
            })

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
            if ([primaryDep, secondaryDep, tertiary, primaryDepAll, secondaryDepAll, tertiaryAll,
              primaryWithoutDep, secondaryWithoutDep, tertiaryWithoutDep].some(dep => dep?.length > 0)) {
              const supervisor = userReportingToChange[0]?.supervisorchoose;
              let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${designationlogEdit?._id}`, {
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
              });
            }


            if (primaryDep?.length > 0) {
              const uniqueEntries = primaryDep?.filter((item, index, self) =>
                index === self.findIndex((t) =>
                  t.company === item.company &&
                  t.branch === item.branch &&
                  t.unit === item.unit &&
                  t.team === item.team &&
                  t.supervisorchoose?.length === item.supervisorchoose?.length &&
                  t.supervisorchoose?.every(dta => item.supervisorchoose.includes(dta))
                )
              );

              let answer = uniqueEntries?.map(async data =>
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
                  employeename: designationlogEdit.companyname,
                  access: data.access,
                  action: Boolean(true),
                  empbranch: designationlogEdit?.branch,
                  empunit: designationlogEdit?.unit,
                  empcode: designationlogEdit?.empcode,
                  empteam: designationlogEdit?.team,
                  addedby: [
                    {
                      name: String(isUserRoleAccess?.username),
                      date: String(new Date()),
                    },
                  ],
                })
              )

            }
            if (secondaryDep?.length > 0) {
              const uniqueEntries = secondaryDep?.filter((item, index, self) =>
                index === self.findIndex((t) =>
                  t.company === item.company &&
                  t.branch === item.branch &&
                  t.unit === item.unit &&
                  t.team === item.team &&
                  t.supervisorchoose?.length === item.supervisorchoose?.length &&
                  t.supervisorchoose?.every(dta => item.supervisorchoose.includes(dta))
                )
              );

              let answer = uniqueEntries?.map(async data =>
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
                  employeename: designationlogEdit.companyname,
                  access: data.access,
                  action: Boolean(true),
                  empbranch: designationlogEdit?.branch,
                  empunit: designationlogEdit?.unit,
                  empcode: designationlogEdit?.empcode,
                  empteam: designationlogEdit?.team,
                  addedby: [
                    {
                      name: String(isUserRoleAccess?.username),
                      date: String(new Date()),
                    },
                  ],
                })
              )

            }
            if (tertiary?.length > 0) {
              const uniqueEntries = tertiary?.filter((item, index, self) =>
                index === self.findIndex((t) =>
                  t.company === item.company &&
                  t.branch === item.branch &&
                  t.unit === item.unit &&
                  t.team === item.team &&
                  t.supervisorchoose?.length === item.supervisorchoose?.length &&
                  t.supervisorchoose?.every(dta => item.supervisorchoose.includes(dta))
                )
              );

              let answer = uniqueEntries?.map(async data =>
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
                  employeename: designationlogEdit.companyname,
                  access: data.access,
                  action: Boolean(true),
                  empbranch: designationlogEdit?.branch,
                  empunit: designationlogEdit?.unit,
                  empcode: designationlogEdit?.empcode,
                  empteam: designationlogEdit?.team,
                  addedby: [
                    {
                      name: String(isUserRoleAccess?.username),
                      date: String(new Date()),
                    },
                  ],
                })
              )

            }
            if (primaryDepAll?.length > 0) {
              const uniqueEntries = primaryDepAll?.filter((item, index, self) =>
                index === self.findIndex((t) =>
                  t.company === item.company &&
                  t.branch === item.branch &&
                  t.unit === item.unit &&
                  t.team === item.team &&
                  t.supervisorchoose?.length === item.supervisorchoose?.length &&
                  t.supervisorchoose?.every(dta => item.supervisorchoose.includes(dta))
                )
              );

              let answer = uniqueEntries?.map(async data =>
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
                  employeename: designationlogEdit.companyname,
                  access: data.access,
                  action: Boolean(true),
                  empbranch: designationlogEdit?.branch,
                  empunit: designationlogEdit?.unit,
                  empcode: designationlogEdit?.empcode,
                  empteam: designationlogEdit?.team,
                  addedby: [
                    {
                      name: String(isUserRoleAccess?.username),
                      date: String(new Date()),
                    },
                  ],
                })
              )

            }
            if (secondaryDepAll?.length > 0) {
              const uniqueEntries = secondaryDepAll?.filter((item, index, self) =>
                index === self.findIndex((t) =>
                  t.company === item.company &&
                  t.branch === item.branch &&
                  t.unit === item.unit &&
                  t.team === item.team &&
                  t.supervisorchoose?.length === item.supervisorchoose?.length &&
                  t.supervisorchoose?.every(dta => item.supervisorchoose.includes(dta))
                )
              );

              let answer = uniqueEntries?.map(async data =>
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
                  employeename: designationlogEdit.companyname,
                  access: data.access,
                  action: Boolean(true),
                  empbranch: designationlogEdit?.branch,
                  empunit: designationlogEdit?.unit,
                  empcode: designationlogEdit?.empcode,
                  empteam: designationlogEdit?.team,
                  addedby: [
                    {
                      name: String(isUserRoleAccess?.username),
                      date: String(new Date()),
                    },
                  ],
                })
              )

            }
            if (tertiaryAll?.length > 0) {
              const uniqueEntries = tertiaryAll?.filter((item, index, self) =>
                index === self.findIndex((t) =>
                  t.company === item.company &&
                  t.branch === item.branch &&
                  t.unit === item.unit &&
                  t.team === item.team &&
                  t.supervisorchoose?.length === item.supervisorchoose?.length &&
                  t.supervisorchoose?.every(dta => item.supervisorchoose.includes(dta))
                )
              );

              let answer = uniqueEntries?.map(async data =>
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
                  employeename: designationlogEdit.companyname,
                  access: data.access,
                  action: Boolean(true),
                  empbranch: designationlogEdit?.branch,
                  empunit: designationlogEdit?.unit,
                  empcode: designationlogEdit?.empcode,
                  empteam: designationlogEdit?.team,
                  addedby: [
                    {
                      name: String(isUserRoleAccess?.username),
                      date: String(new Date()),
                    },
                  ],
                })
              )

            }
            if (primaryWithoutDep?.length > 0) {
              const uniqueEntries = primaryWithoutDep?.filter((item, index, self) =>
                index === self.findIndex((t) =>
                  t.department === item.department &&
                  t.supervisorchoose?.length === item.supervisorchoose?.length &&
                  t.supervisorchoose?.every(dta => item.supervisorchoose.includes(dta))
                )
              );

              let answer = uniqueEntries?.map(async data =>
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
                  employeename: designationlogEdit.companyname,
                  access: data.access,
                  action: Boolean(true),
                  empbranch: designationlogEdit?.branch,
                  empunit: designationlogEdit?.unit,
                  empcode: designationlogEdit?.empcode,
                  empteam: designationlogEdit?.team,
                  addedby: [
                    {
                      name: String(isUserRoleAccess?.username),
                      date: String(new Date()),
                    },
                  ],
                })
              )

            }
            if (secondaryWithoutDep?.length > 0) {
              const uniqueEntries = secondaryWithoutDep?.filter((item, index, self) =>
                index === self.findIndex((t) =>
                  t.department === item.department &&
                  t.supervisorchoose?.length === item.supervisorchoose?.length &&
                  t.supervisorchoose?.every(dta => item.supervisorchoose.includes(dta))
                )
              );

              let answer = uniqueEntries?.map(async data =>
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
                  employeename: designationlogEdit.companyname,
                  access: data.access,
                  action: Boolean(true),
                  empbranch: designationlogEdit?.branch,
                  empunit: designationlogEdit?.unit,
                  empcode: designationlogEdit?.empcode,
                  empteam: designationlogEdit?.team,
                  addedby: [
                    {
                      name: String(isUserRoleAccess?.username),
                      date: String(new Date()),
                    },
                  ],
                })
              )

            }
            if (tertiaryWithoutDep?.length > 0) {
              const uniqueEntries = tertiaryWithoutDep?.filter((item, index, self) =>
                index === self.findIndex((t) =>
                  t.department === item.department &&
                  t.supervisorchoose?.length === item.supervisorchoose?.length &&
                  t.supervisorchoose?.every(dta => item.supervisorchoose.includes(dta))
                )
              );

              let answer = uniqueEntries?.map(async data =>
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
                  employeename: designationlogEdit.companyname,
                  access: data.access,
                  action: Boolean(true),
                  empbranch: designationlogEdit?.branch,
                  empunit: designationlogEdit?.unit,
                  empcode: designationlogEdit?.empcode,
                  empteam: designationlogEdit?.team,
                  addedby: [
                    {
                      name: String(isUserRoleAccess?.username),
                      date: String(new Date()),
                    },
                  ],
                })
              )

            }
          }
        }
      }
      handleCloseModEdit();
      await fetchDesignationlog();
      setDesignationLog({
        ...designationlog,
        designation: "Select Designation",
      });
      setShowAlert(
        <>
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "#7AC767" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Updated Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };




  const identifySuperVisor = hierarchyall?.map((item) => item.supervisorchoose[0])?.includes(designationlogEdit.companyname) && !designationsName?.includes(designationlog.designation)

  const editSubmit = (e) => {
    e.preventDefault();
    const processdeggrp = designationlogEdit?.process?.slice(-3);
    const primaryDep = newUpdatingData[0]?.primaryDep;
    const secondaryDep = newUpdatingData[0]?.secondaryDep;
    const tertiary = newUpdatingData[0]?.tertiaryDep;
    const primaryWithoutDep = newUpdatingData[0]?.primaryNotDep;
    const secondaryWithoutDep = newUpdatingData[0]?.secondaryNotDep;
    const tertiaryWithoutDep = newUpdatingData[0]?.tertiaryNotDep;
    if (designationlog.designation === "Select Designation") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Designation"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if ((!designationlogEdit?.process?.includes(newDesignationGroup)) && designationlogEdit?.processlog?.length > 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Change Process! Then only Change Designation!"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (
      changeToDesign === "Please Select New/Replace" &&
      identifySuperVisor
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select New/Replace"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (
      changeToDesign === "Replace" &&
      identifySuperVisor && superVisorChoosen === "Please Select Supervisor"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Supervisor"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (designationlog.startdate === "Please Select Startdate") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Startdate"}
          </p>
        </>
      );
      handleClickOpenerr();
    }

    else if (
      (changeToDesign === "Replace" && oldEmployeeHierData?.length > 0 && (primaryDep?.length < 1 &&
        secondaryDep?.length < 1 &&
        tertiary?.length < 1 &&
        primaryWithoutDep?.length < 1 &&
        secondaryWithoutDep?.length < 1 &&
        tertiaryWithoutDep?.length < 1
      ))) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"These Employee's Designation is not matched in hierarchy ,Add Hierarchy and update"}
          </p>
        </>
      );
      handleClickOpenerr();
    }

    else {
      sendEditRequest();
    }
  };
  //get all Sub vendormasters.
  const fetchDesignationlog = async () => {
    try {
      let res_users = await axios.get(SERVICE.LOGALLUSER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setDesignationlogs(res_users?.data?.allusers);
      setDesignationlogcheck(true);
    } catch (err) {
      setDesignationlogcheck(true);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [designationlogsFilterArray, setDesignationlogsFilterArray] = useState(
    []
  );

  //get all Sub vendormasters.
  const fetchDesignationlogArray = async () => {
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    fetchDesignationlogArray();
  }, [isFilterOpen]);

  // pdf.....
  const columns = [
    { title: "Company Name", field: "companyname" },
    { title: "Branch", field: "branch" },
    { title: "Unit", field: "unit" },
    { title: "Team", field: "team" },
    { title: "Employee Name", field: "employeename" },
    { title: "Designation ", field: "designation" },
  ];

  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();

    let serialNumberCounter = 1;

    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" },
      ...columns?.map((col) => ({ ...col, dataKey: col.field })),
    ];

    const dataWithSerial =
      isfilter === "filtered"
        ? rowDataTable?.map((row) => ({
          ...row,
          serialNumber: serialNumberCounter++,
        }))
        : designationlogsFilterArray?.map((row) => ({
          ...row,
          serialNumber: serialNumberCounter++,
          companyname: row.company,
          branch: row.branch,
          unit: row.unit,
          team: row.team,
          employeename: row.companyname,
          designation: row.designation,
        }));

    doc.autoTable({
      theme: "grid",
      styles: {
        fontSize: 4,
        cellWidth: "auto",
      },
      columns: columnsWithSerial,
      body: dataWithSerial,
    });

    doc.save("Designation Assign Log.pdf");
  };

  // Excel
  const fileName = "Designation Assign Log";
  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Designation Assign Log",
    pageStyle: "print",
  });

  useEffect(() => {
    fetchDesignationlog();
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
    const itemsWithSerialNumber = designationlogs?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [designationlogs]);

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
              const allRowIds = rowDataTable?.map((row) => row.id);
              setSelectedRows(allRowIds);
            }
            setSelectAllChecked(!selectAllChecked);
          }}
        />
      ),

      renderCell: (params) => (
        <Checkbox
          checked={selectedRows?.includes(params.row.id)}
          onChange={() => {
            let updatedSelectedRows;
            if (selectedRows?.includes(params.row.id)) {
              updatedSelectedRows = selectedRows?.filter(
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
      field: "companyname",
      headerName: "Company Name",
      flex: 0,
      width: 150,
      hide: !columnVisibility.username,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 100,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
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
      field: "username",
      headerName: "Employee Name",
      flex: 0,
      width: 150,
      hide: !columnVisibility.username,
      headerClassName: "bold-header",
      renderCell: (params) => (
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
              text={params?.row?.username}
            >
              <ListItemText primary={params?.row?.username} />
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
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("vdesignationlog") && (
            <Link
              to={`/updatepages/designationloglist/${params.row.id}`}
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
                getviewCode(params.row.id);
              }}
            >
              <FaEdit style={{ color: "white", fontSize: "18px" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("idesignationlog") && (
            <Button
              onClick={() => {
                handleClickOpeninfo();
                getinfoCode(params.row.id);
              }}
            >
              <InfoOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
        </Grid>
      ),
    },
  ];

  const rowDataTable = filteredData?.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      empcode: item.empcode,
      username: item.companyname,
      companyname: item.company,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      employeename: item.companyname,
      designation: item.designation,
    };
  });

  const rowsWithCheckboxes = rowDataTable?.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRows?.includes(row.id),
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
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = fileFormat === "xl" ? ".xlsx" : ".csv";
  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const handleExportXL = (isfilter) => {
    if (isfilter === "filtered") {
      exportToCSV(
        rowDataTable?.map((t, index) => ({
          Sno: index + 1,
          Company: t.companyname,
          Branch: t.branch,
          Unit: t.unit,
          Team: t.team,
          Employeename: t.employeename,
          Designation: t.designation,
        })),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        designationlogsFilterArray?.map((t, index) => ({
          Sno: index + 1,
          Company: t.company,
          Branch: t.branch,
          Unit: t.unit,
          Team: t.team,
          Employeename: t.companyname,
          Designation: t.designation,
        })),
        fileName
      );
    }

    setIsFilterOpen(false);
  };

  return (
    <Box>
      <NotificationContainer />
      <Headtitle title={"Designation Log"} />
      {/* ****** Header Content ****** */}

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
                    {/* <MenuItem value={designationlogs?.length}>All</MenuItem> */}
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
            <br />
            <br />
            {!designationlogCheck ? (
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
                    columns={columnDataTable?.filter(
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
                  <Typography>
                    Old Designation
                  </Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput value={olddesignation} />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    Old Designation Group
                  </Typography>
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
                        fetchNewDesignationGroup(e.value)
                        fetchSuperVisorChangingHierarchy(e.value);
                        fetchReportingToUserHierarchy(e.value)
                        setSuperVisorChoosen('Please Select Supervisor');
                        setChangeToDesign("Please Select New/Replace")
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
                  <Typography>
                    New Designation Group
                  </Typography>
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
                              setSuperVisorChoosen('Please Select Supervisor')
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
                              options={users?.filter(data => data?.designation === olddesignation)}
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
                  <Button variant="contained" onClick={editSubmit}>
                    Update
                  </Button>
                  &emsp;
                  <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </Dialog>
      </Box>
      {/*Export XL Data  */}
      <Dialog
        open={isFilterOpen}
        onClose={handleCloseFilterMod}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
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

          {fileFormat === "xl" ? (
            <FaFileExcel style={{ fontSize: "70px", color: "green" }} />
          ) : (
            <FaFileCsv style={{ fontSize: "70px", color: "green" }} />
          )}
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Choose Export
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            variant="contained"
            onClick={(e) => {
              handleExportXL("filtered");
            }}
          >
            Export Filtered Data
          </Button>
          <Button
            autoFocus
            variant="contained"
            onClick={(e) => {
              handleExportXL("overall");
              fetchDesignationlogArray();
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
      {/*Export pdf Data  */}
      <Dialog
        open={isPdfFilterOpen}
        onClose={handleClosePdfFilterMod}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
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
              downloadPdf("filtered");
              setIsPdfFilterOpen(false);
            }}
          >
            Export Filtered Data
          </Button>
          <Button
            variant="contained"
            onClick={(e) => {
              downloadPdf("overall");
              setIsPdfFilterOpen(false);
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
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

      {/* Delete Modal */}
      <Box>
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
                Designation Log Info
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
                <TableCell> SI.No</TableCell>
                <TableCell>Company Name</TableCell>
                <TableCell> Branch</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Team</TableCell>
                <TableCell>Employee Name</TableCell>
                <TableCell>Designation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody align="left">
              {rowDataTable &&
                rowDataTable?.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.companyname}</TableCell>
                    <TableCell>{row.branch}</TableCell>
                    <TableCell>{row.unit}</TableCell>
                    <TableCell>{row.team}</TableCell>
                    <TableCell>{row.employeename}</TableCell>
                    <TableCell>{row.designation}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box>
        {/* ALERT DIALOG */}
        <Dialog
          open={isDeleteOpenalert}
          onClose={handleCloseModalert}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "70px", color: "orange" }}
            />
            <Typography
              variant="h6"
              sx={{ color: "black", textAlign: "center" }}
            >
              Please Select any Row
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              variant="contained"
              color="error"
              onClick={handleCloseModalert}
            >
              {" "}
              OK{" "}
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
    </Box>
  );
}

export default DesignationLog;