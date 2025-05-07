import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
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
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import {
  FaEdit,
  FaFileCsv,
  FaFileExcel,
  FaFilePdf,
  FaPlus,
  FaPrint,
} from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import PageHeading from "../../components/PageHeading";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";

import AlertDialog from "../../components/Alert";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import domtoimage from 'dom-to-image';

function WorkStation() {
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [isDuplicateData, setIsDuplicateData] = useState([])
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setIsBtn(false);
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

  let exportColumnNames = [
    "Company",
    "Branch",
    "Unit",
    "Floor",
    "Area",
    "Location",
    "Main Cabin",
    "Sub Cabin",
    "Sub Sub Cabin",
  ];
  let exportRowValues = [
    "company",
    "branch",
    "unit",
    "floor",
    "area",
    "location",
    "maincabin",
    "cabinname",
    "subcabinname",
  ];

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

  const [workStation, setWorkStation] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    floor: "Please Select Floor",
    area: "Please Select Area",
    location: "Please Select Location",
    maincabin: "",
    subcabin: "",
  });
  const [workStationEdit, setWorkStationEdit] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    floor: "Please Select Floor",
    area: "Please Select Area",
    location: "Please Select Location",
    maincabin: "",
    subcabin: "",
  });

  const [locationgroupings, setLocationgroupings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [allWorkStationAdd, setAllWorkStationAdd] = useState([]);
  const [allWorkStationEdit, setAllWorkStationEdit] = useState([]);
  const [allWorkStationedit, setAllWorkStationedit] = useState([]);
  const [allWorkStationGrouping, setAllWorkStationGrouping] = useState([]);
  const [allCabinnameAdd, setAllCabinnameAdd] = useState([]);
  const [allSubCabinnameAdd, setAllSubCabinnameAdd] = useState([]);
  const [checkAdd, setCheckAdd] = useState([]);
  const [checkEdit, setCheckEdit] = useState([]);
  const [checkSubAdd, setCheckSubAdd] = useState([]);
  const [checkSubEdit, setCheckSubEdit] = useState([]);
  const [cabinTodoAdd, setCabinTodoAdd] = useState([]);
  const [cabinTodoEdit, setCabinTodoEdit] = useState([]);
  const {
    isUserRoleAccess,
    isUserRoleCompare,
    isAssignBranch,
    pageName,
    setPageName,
    buttonStyles,
  } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const username = isUserRoleAccess.username;
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openview, setOpenview] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [editingIndexedit, setEditingIndexedit] = useState(-1);
  const [subEditingIndexedit, setSubEditingIndexedit] = useState(-1);
  const [editedTodoedit, setEditedTodoedit] = useState("");
  const [editedSubTodoedit, setEditedSubTodoedit] = useState("");
  const [newTodoEditedIndexValue, setNewTodoEditedIndexValue] = useState("");
  const [getSubSubCabinNameAdd, setGetSubSubCabinNameAdd] = useState("");
  const [getSubSubCabinNameEdit, setGetSubSubCabinNameEdit] = useState("");
  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    company: true,
    branch: true,
    unit: true,
    floor: true,
    area: true,
    location: true,
    maincabin: true,
    cabinname: true,
    subcabinname: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );
  //useEffect
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
      pagename: String("Work Station"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),

      addedby: [
        {
          name: String(isUserRoleAccess?.username),
          date: String(new Date()),
        },
      ],
    });
  };

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

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "WorkStation.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
  };
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };
  //Delete model
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };
  //Delete model
  const handleClickOpenalert = () => {
    setIsHandleChange(true);
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
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  };
  // Manage Columns
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteWorkStationgrp, setDeleteWorkStationgrp] = useState("");
  const [floors, setFloors] = useState([]);
  const [areas, setAreas] = useState([]);
  const [locations, setLocations] = useState([]);
  const [floorsEdit, setFloorEdit] = useState([]);
  const [areasEdit, setAreasEdit] = useState([]);
  const [locationsEdit, setLocationsEdit] = useState([]);
  const [newcheckbranch, setNewcheckBranch] = useState("Choose Branch");
  const [openInfo, setOpeninfo] = useState(false);
  const [items, setItems] = useState([]);
  const [cabinValue, setCabinValue] = useState({ cabinname: "" });
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

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };
  const rowData = async (id, name) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.WORKSTATION_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteWorkStationgrp(res?.data?.slocationgrouping);
      handleClickOpen();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  // Alert delete popup
  let Locationgrpsid = deleteWorkStationgrp?._id;
  const delLocationgrp = async () => {
    setPageName(!pageName);
    try {
      if (Locationgrpsid) {
        await axios.delete(`${SERVICE.WORKSTATION_SINGLE}/${Locationgrpsid}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        await fetchWorkStation();
        handleCloseMod();
        setSelectedRows([]);
        setPage(1);
        setFilteredChanges(null)
        setFilteredRowData([])
        setSearchQuery("")
        setPopupContent("Deleted Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const delLocationgrpcheckbox = async () => {
    setPageName(!pageName);
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.WORKSTATION_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });
      await Promise.all(deletePromises);
      setIsHandleChange(false);

      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);
      setFilteredChanges(null)
      setFilteredRowData([])
      setSearchQuery("")
      await fetchWorkStation();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  //Edit model...
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    setWorkStationEdit({ ...workStationEdit, subcabin: "" });
  };

  const fetchFloor = async (e) => {
    setPageName(!pageName);
    try {
      let res_floor = await axios.get(SERVICE.FLOOR, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let result = res_floor.data.floors.filter(
        (d) => d.branch === e.value || d.branch === e.branch
      );
      const floorall = result.map((d) => ({
        ...d,
        label: d.name,
        value: d.name,
      }));
      setFloors(floorall);
      setFloorEdit(floorall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const fetchArea = async (e) => {
    setPageName(!pageName);
    try {
      let res_type = await axios.get(SERVICE.AREAGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let result = res_type.data.areagroupings
        .filter((d) => d.branch === newcheckbranch && d.floor === e)
        .map((data) => data.area);
      let ji = [].concat(...result);
      let jiii = ji.map((data) => data);
      const all = ji.map((d) => ({
        ...d,
        label: d,
        value: d,
      }));
      setAreas(all);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchLocation = async (e) => {
    setPageName(!pageName);
    try {
      let res_type = await axios.get(SERVICE.LOCATIONGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let result = res_type.data.locationgroupings
        .filter(
          (d) =>
            d.branch === newcheckbranch &&
            d.floor === workStation.floor &&
            d.area === e
        )
        .map((data) => data.location);
      let ji = [].concat(...result);
      let jiii = ji.map((data) => data);
      const all = ji.map((d) => ({
        ...d,
        label: d,
        value: d,
      }));
      setLocations(all);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchAreaEdit = async (a, e) => {
    setPageName(!pageName);
    try {
      let res_type = await axios.get(SERVICE.AREAGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let result = res_type.data.areagroupings
        .filter((d) => d.branch === a && d.floor === e)
        .map((data) => data.area);
      let ji = [].concat(...result);
      const all = ji.map((d) => ({
        ...d,
        label: d,
        value: d,
      }));
      setAreasEdit(all);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //get all Locations edit.
  const fetchAllLocationEdit = async (a, b, c) => {
    setPageName(!pageName);
    try {
      let res_type = await axios.get(SERVICE.LOCATIONGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let result = res_type.data.locationgroupings
        .filter((d) => d.branch === a && d.floor === b && d.area === c)
        .map((data) => data.location);
      let ji = [].concat(...result);
      const all = ji.map((d) => ({
        ...d,
        label: d,
        value: d,
      }));
      setLocationsEdit(all);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [locationgroupingsoverall, setLocationgroupingsoverall] = useState([])

  //get all Sub vendormasters.
  const fetchWorkStation = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.WORKSTATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let ans = res?.data?.locationgroupings?.filter((item) =>
        accessbranch.some(
          (branch) =>
            branch.company === item.company &&
            branch.branch === item.branch &&
            branch.unit === item.unit
        )
      );
      const result = res?.data?.locationgroupings.flatMap((item) => {
        return item.combinstation.flatMap((combinstationItem) => {
          return combinstationItem.subTodos.length > 0
            ? combinstationItem.subTodos.map((subTodo) => {
              return {
                company: item.company,
                branch: item.branch,
                unit: item.unit,
                floor: item.floor,
                id: item._id,
                area: item.area,
                location: item.location,
                cabinname: subTodo.subcabinname,
              };
            })
            : [
              {
                company: item.company,
                branch: item.branch,
                unit: item.unit,
                floor: item.floor,
                area: item.area,
                location: item.location,
                id: item._id,
                cabinname: combinstationItem.cabinname,
              },
            ];
        });
      });
      setIsDuplicateData(result);
      setLocationgroupings(ans);
      setLocationgroupingsoverall(ans.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
        id: item?._id,
        cabinname: item.combinstation.map((t) => t.cabinname).join(","),
        subcabinname: item.combinstation
          .map((t) => t.subTodos.map((d) => d.subcabinname).join(","))
          .toString(),
      })));
      setAllWorkStationGrouping(res?.data?.locationgroupings);
      setLoading(true);
    } catch (err) {
      setLoading(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [allManpower, setAllManpower] = useState([]);

  const fetchManpower = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.MANPOWER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAllManpower(res.data.manpowers);

      setLoading(true);
    } catch (err) {
      setLoading(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchWorkStation();
    fetchManpower();
  }, []);

  const [isBtn, setIsBtn] = useState(false);

  //add function
  const sendRequest = async () => {
    setIsBtn(true);
    setPageName(!pageName);
    try {
      let subprojectscreate = await axios.post(SERVICE.WORKSTATION_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: String(workStation.company),
        branch: String(workStation.branch),
        unit: String(workStation.unit),
        floor: String(workStation.floor),
        area: String(workStation.area),
        location: String(workStation.location),
        maincabin: String(workStation.maincabin),
        combinstation: [...cabinTodoAdd],
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      setCabinTodoAdd([]);
      setCheckSubAdd([]);
      setFilteredChanges(null)
      setFilteredRowData([])
      setSearchQuery("")
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      await fetchWorkStation();
      await fetchManpower();


      setIsBtn(false);
    } catch (err) {
      setIsBtn(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();

    function getCount(isTotalCountMatch) {
      let count = 0;
      isTotalCountMatch.forEach((obj) => {
        if (obj.combinstation && Array.isArray(obj.combinstation)) {
          obj.combinstation.forEach((item) => {
            if (item.subTodos && item.subTodos.length > 0) {
              count += item.subTodos.length;
            } else {
              count++;
            }
          });
        }
      });
      return count;
    }

    function getCountInitial(combinationArray) {
      let count = 0;

      combinationArray.forEach((item) => {
        if (item.subTodos && item.subTodos.length > 0) {
          count += item.subTodos.length;
        } else {
          count++;
        }
      });

      return count;
    }

    const InitailFind = getCountInitial(cabinTodoAdd);

    //check manpowerexist
    const IsDataMatch = allManpower?.find(
      (item) =>
        item.company?.toLowerCase() === workStation.company?.toLowerCase() &&
        item.branch?.toLowerCase() === workStation.branch?.toLowerCase() &&
        item.floor?.toLowerCase() === workStation.floor?.toLowerCase() &&
        item.area?.some(
          (areas) => areas?.toLowerCase() === workStation.area?.toLowerCase()
        )
    );

    //workstationcabincount
    const isTotalCountMatch = allWorkStationGrouping.filter(
      (item) =>
        item.branch?.toLowerCase() === workStation.branch?.toLowerCase() &&
        item.floor?.toLowerCase() === workStation.floor?.toLowerCase() &&
        item.area?.toLowerCase() === workStation.area?.toLowerCase() &&
        item.company?.toLowerCase() === workStation.company?.toLowerCase()
    );

    const counts = getCount(isTotalCountMatch);

    //checkcount
    const IsManowerCount = allManpower?.some(
      (item) =>
        item.company?.toLowerCase() === workStation.company?.toLowerCase() &&
        item.branch?.toLowerCase() === workStation.branch?.toLowerCase() &&
        item.floor?.toLowerCase() === workStation.floor?.toLowerCase() &&
        item.area?.some(
          (areas) => areas?.toLowerCase() === workStation.area?.toLowerCase()
        ) &&
        (isTotalCountMatch?.length === 0 ? InitailFind : InitailFind + counts) >
        item.seatcount
    );

    const addtodo = cabinTodoAdd.flatMap((item) => {
      return item.subTodos.length > 0 ?
        item.subTodos.map((subTodo) => {
          return {
            cabinname: subTodo.subcabinname,
          };
        }) : [
          {
            cabinname: item.cabinname,
          },
        ];
    })

    const restodo = addtodo.map(data => data.cabinname)
    //duplicatecondition
    const isNameMatch = isDuplicateData.some(
      (item) =>
        item.branch === workStation.branch &&
        item.floor === workStation.floor &&
        item.area === workStation.area &&
        item.location === workStation.location &&
        restodo?.includes(item.cabinname)
    );
    const uniqueIdentifier =
      `${workStation.company}_${workStation.branch}_${workStation.unit}_${workStation.floor}_${workStation.location}_${workStation.area}_${getSubSubCabinNameAdd}`.trim();

    if (
      allWorkStationAdd
        .map((item) => item.toLowerCase())
        .includes(uniqueIdentifier.toLowerCase())
    ) {
      // Display an error message if the combination already exists

      setPopupContentMalert(
        "This Sub Sub Cabin Name already exists for this Company, Branch, Unit, Floor, Location, and Area!"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return;
    } else if (workStation.company === "Please Select Company") {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (workStation.branch === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (workStation.unit === "Please Select Unit") {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (workStation.floor === "Please Select Floor") {
      setPopupContentMalert("Please Select Floor!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (workStation.area === "Please Select Area") {
      setPopupContentMalert("Please Select Area!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (workStation.location === "Please Select Location") {
      setPopupContentMalert("Please Select Location!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (cabinTodoAdd.length === 0) {
      if (workStation.maincabin === "") {
        setPopupContentMalert("Please Enter Main Cabin!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (workStation.subcabin === "") {
        setPopupContentMalert("Please Enter Sub Cabin!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else {
        setPopupContentMalert("Please Add Cabin!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    }
    else if (isNameMatch) {
      setPopupContentMalert("Data already exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (IsManowerCount) {
      setPopupContentMalert("Maximum Cabin Reached for Alloted Seatcount!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (IsDataMatch === undefined) {
      setPopupContentMalert("Add Manpower for Workstation!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };
  const handleClear = (e) => {
    e.preventDefault();
    setWorkStation({
      company: "Please Select Company",
      branch: "Please Select Branch",
      unit: "Please Select Unit",
      floor: "Please Select Floor",
      area: "Please Select Area",
      location: "Please Select Location",
      maincabin: "",
      subcabin: "",
    });
    setLocations([]);
    setFloors([]);
    setAreas([]);
    setCabinTodoAdd([]);
    setCheckSubAdd([]);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };
  // info model
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };
  const getCode = async (e, name) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.WORKSTATION_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setWorkStationEdit(res?.data?.slocationgrouping);
      await fetchFloor(res?.data?.slocationgrouping);
      fetchAreaEdit(
        res?.data?.slocationgrouping?.branch,
        res?.data?.slocationgrouping?.floor
      );
      fetchAllLocationEdit(
        res?.data?.slocationgrouping?.branch,
        res?.data?.slocationgrouping?.floor,
        res?.data?.slocationgrouping?.area
      );
      setCabinTodoEdit(res.data.slocationgrouping?.combinstation || []);

      let resdata = res.data.slocationgrouping?.combinstation?.map((t) => {
        return t.cabinname;
      });
      setCheckEdit(resdata);

      let allSubSubCabinname = [];
      res.data.slocationgrouping?.combinstation?.forEach((rack) => {
        rack.subTodos.forEach((subTodo) => {
          allSubSubCabinname.push(subTodo.subcabinname);
        });
      });

      setCheckSubEdit(allSubSubCabinname);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const getviewCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.WORKSTATION_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setWorkStationEdit(res?.data?.slocationgrouping);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // Add sub todo functionality
  const handleAddTodoAdd = () => {
    if (
      workStation.company == "Please Select Company" ||
      workStation.branch == "Please Select Branch" ||
      workStation.unit == "Please Select Unit" ||
      workStation.floor == "Please Select Floor" ||
      workStation.area == "Please Select Area" ||
      workStation.location == "Please Select Location" ||
      workStation.maincabin == ""
    ) {
      setPopupContentMalert("Please Fill All Details!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      if (workStation.cabinname === "") {
        setPopupContentMalert("Please Enter Main Cabin Name!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (workStation.subcabin === "") {
        setPopupContentMalert("Please Enter Sub Cabin!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else {
        let subTodos = [];
        const newTodo = {
          cabinname: workStation.maincabin + "-" + workStation.subcabin,
          subTodos,
        };

        setCheckAdd([...checkAdd, newTodo?.cabinname]);
        setCabinTodoAdd([...cabinTodoAdd, newTodo]);
        setWorkStation({ ...workStation, subcabin: "" });
      }
    }
  };

  const handleFileDeleteAdd = (index) => {
    setCabinTodoAdd((prevFiles) => prevFiles?.filter((_, i) => i !== index));
  };

  const handleAddSubTodoAdd = (idval, indexValue, cabinname, test) => {
    if (test === undefined || test === "") {
      setPopupContentMalert(
        "Please enter subsubcabinname for all main cabins!"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return; // Exit early if the test is empty or undefined
    }

    const uniqueIdentifier = `${workStation.company}_${workStation.branch}_${workStation.unit
      }_${workStation.floor}_${workStation.location}_${workStation.area}_${cabinname + test
      }`.trim();

    if (
      allWorkStationAdd
        .map((item) => item.toLowerCase())
        .includes(uniqueIdentifier.toLowerCase())
    ) {
      setPopupContentMalert(
        "This Sub Sub Cabin Name already exists for this Company, Branch, Unit, Floor, Location, and Area!"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return;
    }
    const updatedTodos = cabinTodoAdd.map((todo, index) => {
      if (indexValue === index) {
        const newSubTodo = {
          idval: `${idval}_${cabinname + test}`,
          subcabinname: cabinname + test,
        };
        const updatedSubTodos = todo.subTodos
          ? [...todo.subTodos, newSubTodo]
          : [newSubTodo];
        setGetSubSubCabinNameAdd(cabinname + test);

        if (
          allWorkStationAdd
            .map((item) => item.toLowerCase())
            .includes(uniqueIdentifier.toLowerCase())
        ) {
          setPopupContentMalert(
            "This Sub Sub Cabin Name already exists for this Company, Branch, Unit, Floor, Location, and Area!"
          );
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return todo;
        } else if (
          // allSubCabinnameAdd.includes(newSubTodo?.subcabinname) ||
          checkSubAdd.includes(newSubTodo?.subcabinname)
        ) {
          setPopupContentMalert("Sub Sub Cabin Already Exist!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return todo; // Return the original todo if the subsubcabinname already exists
        } else {
          setCheckSubAdd([...checkSubAdd, newSubTodo?.subcabinname]);
          const updatedTodo = {
            ...todo,
            subTodos: updatedSubTodos,
            subsubcabinname: "",
          };
          return updatedTodo; // Return the updated todo with the added subsubcabinname and the cleared subsubcabinname field
        }
      }
      return todo;
    });

    setCabinTodoAdd(updatedTodos); // Set the updatedTodos after the loop is finished
  };

  function multiSubSubRackInputsAdd(referenceIndex, reference, inputvalue) {
    const updatedTodos = cabinTodoAdd.map((value, index) => {
      if (referenceIndex === index) {
        return { ...value, subsubcabinname: inputvalue };
      }
      return value;
    });
    setCabinTodoAdd(updatedTodos);
  }

  // sub sub workStationEdit delete item of row
  const handleSubFileDeleteAdd = (todoIndex, subTodoIndex) => {
    const updatedTodos = cabinTodoAdd.map((todo, index) => {
      if (todoIndex === index) {
        const updatedSubTodos = todo.subTodos.filter(
          (subitem, subIndex) => subTodoIndex !== subIndex
        );
        return { ...todo, subTodos: updatedSubTodos };
      }
      return todo;
    });

    setCabinTodoAdd(updatedTodos);
    setCheckSubAdd([]);
  };

  // Edit sub todo functionality
  const handleAddTodoEdit = () => {
    if (
      workStationEdit.company == "Please Select Company" ||
      workStationEdit.company == undefined ||
      workStationEdit.branch == "Please Select Branch" ||
      workStationEdit.branch == undefined ||
      workStationEdit.unit == "Please Select Unit" ||
      workStationEdit.unit == undefined ||
      workStationEdit.floor == "Please Select Floor" ||
      workStationEdit.floor == undefined ||
      workStationEdit.area == "Please Select Area" ||
      workStationEdit.area == undefined ||
      workStationEdit.location == "Please Select Location" ||
      workStationEdit.location == undefined ||
      workStationEdit.maincabin == "" ||
      workStationEdit.maincabin == undefined
    ) {
      setPopupContentMalert("Please Fill Empty Fields!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      if (
        workStationEdit.subcabin == "" ||
        workStationEdit.subcabin == undefined
      ) {
        setPopupContentMalert("Please Enter Sub Cabin!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else {
        let subTodos = [];
        const newTodo = {
          cabinname: workStationEdit.maincabin + "-" + workStationEdit.subcabin,
          subTodos,
        };

        setCheckEdit([...checkEdit, newTodo?.cabinname]);
        setCabinTodoEdit([...cabinTodoEdit, newTodo]);
        setWorkStationEdit({ ...workStationEdit, subcabin: "" });
      }
    }
  };


  const handleAddSubTodoEdit = (idval, indexValue, cabinname, test) => {
    if (test === undefined || test === "") {
      setPopupContentMalert("Please enter subcabinname for all main cabins!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return; // Exit early if the test is empty or undefined
    }
    const uniqueIdentifier = `${workStationEdit.company}_${workStationEdit.branch
      }_${workStationEdit.unit}_${workStationEdit.floor}_${workStationEdit.location
      }_${workStationEdit.area}_${cabinname + test}`.trim();

    const updatedTodos = cabinTodoEdit.map((todo, index) => {
      if (indexValue === index) {
        const newSubTodo = {
          idval: `${idval}_${cabinname + test}`,
          subcabinname: cabinname + test,
        };
        const updatedSubTodos = todo.subTodos
          ? [...todo.subTodos, newSubTodo]
          : [newSubTodo];
        setGetSubSubCabinNameEdit(cabinname + test);

        if (checkSubEdit.includes(newSubTodo?.subcabinname)) {
          setPopupContentMalert("Sub Sub Cabin Already Exist!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return todo; // Return the original todo if the subcabinname already exists
        } else {
          setCheckSubEdit([...checkSubEdit, newSubTodo?.subcabinname]);
          const updatedTodo = {
            ...todo,
            subTodos: updatedSubTodos,
            subcabinname: "",
          };
          return updatedTodo; // Return the updated todo with the added subcabinname and the cleared subcabinname field
        }
      }
      return todo;
    });

    setCabinTodoEdit(updatedTodos); // Set the updatedTodos after the loop is finished
  };

  function multiSubSubRackInputsEdit(referenceIndex, reference, inputvalue) {
    const updatedTodos = cabinTodoEdit.map((value, index) => {
      if (referenceIndex === index) {
        return { ...value, subcabinname: inputvalue };
      }
      return value;
    });
    setCabinTodoEdit(updatedTodos);
  }
  const handleUpdateTodoEdit = (index) => {
    if (editingIndexedit >= 0 && editingIndexedit < cabinTodoEdit.length) {
      const newLabel = editedTodoedit;

      if (newLabel.trim() !== "") {
        const newTodos = [...cabinTodoEdit];
        newTodos[index].cabinname = newLabel;

        // Check if workStationEdit already exists
        if (
          cabinTodoEdit.some(
            (todo) =>
              todo.cabinname === editedTodoedit && todo !== cabinTodoEdit[index]
          )
        ) {
          setPopupContentMalert("Cabin Already Exist!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return;
        }

        setCabinTodoEdit(newTodos);
        setNewTodoEditedIndexValue(newLabel);
      }

      // Reset editing state
      setEditingIndexedit(-1);
      setEditedTodoedit("");
    }
  };

  const handleDeleteTodoEdit = (index) => {
    const newTodosedit = [...cabinTodoEdit];
    newTodosedit.splice(index, 1);
    setCabinTodoEdit(newTodosedit);
  };

  const handleEditSubTodoEdit = (parentIndex, subIndex) => {
    const currentSubTodo = cabinTodoEdit[parentIndex].subTodos[subIndex];
    setSubEditingIndexedit(currentSubTodo.idval);
    const originalSubrack = cabinTodoEdit[parentIndex].cabinname;
    const subSubrack = currentSubTodo.subcabinname;
    const editedValue = subSubrack.slice(originalSubrack.length);
    setEditedSubTodoedit(editedValue);
  };

  const handleUpdateSubTodoEdit = (parentIndex, subIndex, idval) => {
    const currentSubTodo = cabinTodoEdit[parentIndex].subTodos[subIndex];

    setValueSub(cabinTodoEdit[parentIndex].cabinname);

    if (subEditingIndexedit === currentSubTodo.idval) {
      const originalSubrack = cabinTodoEdit[parentIndex].cabinname;

      if (editedSubTodoedit != "") {
        const newSubsubrack = originalSubrack + editedSubTodoedit;

        const newTodos = cabinTodoEdit.map((todo, index) => {
          if (index === parentIndex) {
            const updatedSubTodos = todo.subTodos.map(
              (subTodo, subTodoIndex) => {
                if (subTodoIndex === subIndex) {
                  const splitIdval = idval.split("_");
                  const partBeforeUnderscore = splitIdval[0];

                  return {
                    ...subTodo,
                    idval: `${partBeforeUnderscore}_${newSubsubrack}`,
                    subcabinname: newSubsubrack,
                  };
                }
                return subTodo;
              }
            );
            return { ...todo, subTodos: updatedSubTodos };
          }
          return todo;
        });

        const existingSubTodo = newTodos[parentIndex].subTodos.find(
          (subTodo, subTodoIndex) =>
            subTodo.subcabinname === newSubsubrack && subTodoIndex !== subIndex
        );

        const filterMaincab = newTodos.filter(
          (item, index) => index !== parentIndex
        );
        const newSubsubrackExists = filterMaincab.some((item) =>
          item.subTodos.some(
            (itemsubsub) => itemsubsub.subcabinname === newSubsubrack
          )
        );

        if (existingSubTodo) {
          setPopupContentMalert("Subcabin Already Exist!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return;
        } else if (newSubsubrackExists) {
          setPopupContentMalert("SubsubCabin Already Exist!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return;
        }

        setCabinTodoEdit(newTodos);
        setNewTodoEditedIndexValue(newSubsubrack);
      }

      // Reset sub-editing state
      setSubEditingIndexedit(-1);
      setEditedSubTodoedit("");
    }
  };

  // sub sub workStationEdit delete item of row
  const handleDeleteSubTodoEdit = (todoIndex, subTodoIndex) => {
    const updatedTodos = cabinTodoEdit.map((todo, index) => {
      if (todoIndex === index) {
        const updatedSubTodos = todo.subTodos.filter(
          (subitem, subIndex) => subTodoIndex !== subIndex
        );
        return { ...todo, subTodos: updatedSubTodos };
      }
      return todo;
    });
    setCabinTodoEdit(updatedTodos);

    let allSubSubCabinname = [];
    updatedTodos?.forEach((comb) => {
      comb.subTodos.forEach((subTodo) => {
        allSubSubCabinname.push(subTodo.subcabinname);
      });
    });

    setCheckSubEdit(allSubSubCabinname);
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.WORKSTATION_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setWorkStationEdit(res?.data?.slocationgrouping);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  //Project updateby edit page...
  let updateby = workStationEdit?.updatedby;
  let addedby = workStationEdit?.addedby;
  let subprojectsid = workStationEdit?._id;

  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.put(
        `${SERVICE.WORKSTATION_SINGLE}/${subprojectsid}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          company: String(workStationEdit.company),
          branch: String(workStationEdit.branch),
          unit: String(workStationEdit.unit),
          floor: String(workStationEdit.floor),
          area: String(workStationEdit.area),
          location: String(workStationEdit.location),
          maincabin: String(workStationEdit.maincabin),
          combinstation: [...cabinTodoEdit],
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      setCabinTodoEdit([]);
      setFilteredChanges(null)
      setFilteredRowData([])
      setSearchQuery("")
      await fetchWorkStation(); fetchWorkStationAll();
      setLocationsEdit([]);
      setWorkStationEdit({ ...workStationEdit, subcabin: "" });
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      handleCloseModEdit();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const [vauleSubSub, setValueSub] = useState("");

  const editSubmit = (e) => {
    e.preventDefault();

    function getCount(isTotalCountMatch) {
      let count = 0;
      isTotalCountMatch.forEach((obj) => {
        if (obj.combinstation && Array.isArray(obj.combinstation)) {
          obj.combinstation.forEach((item) => {
            if (item.subTodos && item.subTodos.length > 0) {
              count += item.subTodos.length;
            } else {
              count++;
            }
          });
        }
      });
      return count;
    }

    function getCountInitial(combinationArray) {
      let count = 0;

      combinationArray.forEach((item) => {
        if (item.subTodos && item.subTodos.length > 0) {
          count += item.subTodos.length;
        } else {
          count++;
        }
      });

      return count;
    }

    const InitailFind = getCountInitial(cabinTodoEdit);

    const IsDataMatch = allManpower?.find(
      (item) =>
        item.company?.toLowerCase() ===
        workStationEdit.company?.toLowerCase() &&
        item.branch?.toLowerCase() === workStationEdit.branch?.toLowerCase() &&
        item.floor?.toLowerCase() === workStationEdit.floor?.toLowerCase() &&
        item.area?.some(
          (areas) =>
            areas?.toLowerCase() === workStationEdit.area?.toLowerCase()
        )
    );

    const isTotalCountMatch = allWorkStationedit.filter(
      (item) =>
        item.branch?.toLowerCase() === workStationEdit.branch?.toLowerCase() &&
        item.floor?.toLowerCase() === workStationEdit.floor?.toLowerCase() &&
        item.area?.toLowerCase() === workStationEdit.area?.toLowerCase() &&
        item.company?.toLowerCase() === workStationEdit.company?.toLowerCase()
    );

    const counts = getCount(isTotalCountMatch);

    const IsManowerCount = allManpower?.some(
      (item) =>
        item.company?.toLowerCase() ===
        workStationEdit.company?.toLowerCase() &&
        item.branch?.toLowerCase() === workStationEdit.branch?.toLowerCase() &&
        item.floor?.toLowerCase() === workStationEdit.floor?.toLowerCase() &&
        item.area?.some(
          (areas) =>
            areas?.toLowerCase() === workStationEdit.area?.toLowerCase()
        ) &&
        (isTotalCountMatch?.length === 0 ? InitailFind : InitailFind + counts) >
        item.seatcount
    );

    let allSubSubCabinname = [];
    cabinTodoEdit?.forEach((rack) => {
      rack.subTodos.forEach((subTodo) => {
        allSubSubCabinname.push(subTodo.subcabinname);
      });
    });
    const addtodo = cabinTodoEdit.flatMap((item) => {
      return item.subTodos.length > 0 ?
        item.subTodos.map((subTodo) => {
          return {
            cabinname: subTodo.subcabinname,
          };
        }) : [
          {
            cabinname: item.cabinname,
          },
        ];
    })

    const restodo = addtodo.map(data => data.cabinname)

    const isNameMatch = isDuplicateData.some(
      (item) =>
        item.branch === workStationEdit.branch &&
        item.floor === workStationEdit.floor &&
        item.area === workStationEdit.area &&
        item.location === workStationEdit.location &&
        restodo?.includes(item.cabinname)
    );

    if (workStationEdit.company === "Please Select Company") {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (workStationEdit.branch === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (workStationEdit.unit === "Please Select Unit") {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (workStationEdit.floor === "Please Select Floor") {
      setPopupContentMalert("Please Select Floor!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (workStationEdit.area === "Please Select Area") {
      setPopupContentMalert("Please Select Area!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (workStationEdit.location === "Please Select Location") {
      setPopupContentMalert("Please Select Location!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (cabinTodoEdit.length === 0) {
      setPopupContentMalert("Please Enter Cabin Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      const isDuplicate = allWorkStationEdit.some((item) =>
        allSubSubCabinname.some(
          (d) =>
            item ==
            `${workStationEdit.company}_${workStationEdit.branch}_${workStationEdit.unit}_${workStationEdit.floor}_${workStationEdit.location}_${workStationEdit.area}_${d}`
        )
      );
      let changedduplicate =
        `${workStationEdit.company}_${workStationEdit.branch}_${workStationEdit.unit}_${workStationEdit.floor}_${workStationEdit.location}_${workStationEdit.area}_${getSubSubCabinNameEdit}`.trim();

      // if (isDuplicate || allWorkStationEdit.includes(changedduplicate)) {
      if (cabinTodoEdit.includes(getSubSubCabinNameEdit)) {
        setPopupContentMalert(
          "This Sub Sub Cabin Name already exists for this Company, Branch, Unit, Floor, Location, and Area!"
        );
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (isNameMatch) {
        setPopupContentMalert("Data Already Exist!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (IsManowerCount) {
        setPopupContentMalert("Maximum Cabin Reached for Alloted Seatcount!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (IsDataMatch === undefined) {
        setPopupContentMalert("Add Manpower for Workstation!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else {
        sendEditRequest();
      }
    }
  };

  const [empId, setEmpid] = useState("");

  //get all Sub vendormasters.
  const fetchWorkStationAll = async () => {
    setPageName(!pageName);
    try {
      let res_location = await axios.get(SERVICE.WORKSTATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken} `,
        },
      });
      let resultedit = res_location?.data?.locationgroupings.filter(
        (item) => item._id !== empId
      );
      const result = res_location?.data?.locationgroupings.flatMap((item) => {
        return item.combinstation.flatMap((combinstationItem) => {
          return combinstationItem.subTodos.length > 0
            ? combinstationItem.subTodos.map((subTodo) => {
              return {
                company: item.company,
                branch: item.branch,
                unit: item.unit,
                floor: item.floor,
                id: item._id,
                area: item.area,
                location: item.location,
                cabinname: subTodo.subcabinname,
              };
            })
            : [
              {
                company: item.company,
                branch: item.branch,
                unit: item.unit,
                floor: item.floor,
                area: item.area,
                location: item.location,
                id: item._id,
                cabinname: combinstationItem.cabinname,
              },
            ];
        });
      });
      setIsDuplicateData(result);
      setAllWorkStationedit(resultedit);
      // setAllWorkStationGrouping(res_location?.data?.locationgroupings.filter((item) => item._id !== workStationEdit._id));
      let arr = [];
      let subarr = [];
      res_location?.data?.locationgroupings?.map((data, index) => {
        data.combinstation.forEach((t) => {
          arr.push(t.cabinname);
        });
        return arr;
      });
      setAllCabinnameAdd(arr);
      res_location?.data?.locationgroupings?.map((data, index) => {
        data.combinstation.forEach((t) => {
          t.subTodos.forEach((d) => {
            subarr.push(d.subcabinname);
          });
        });
        return subarr;
      });
      setAllSubCabinnameAdd(subarr);
      let formattedWorkStationAdd = [];

      res_location?.data?.locationgroupings?.forEach((data) => {
        data.combinstation.forEach((station) => {
          station.subTodos.forEach((subTodo) => {
            const formattedString = `${data.company}_${data.branch}_${data.unit}_${data.floor}_${data.location}_${data.area}_${subTodo.subcabinname} `;
            formattedWorkStationAdd.push(formattedString);
          });
        });
      });
      setAllWorkStationAdd(formattedWorkStationAdd);

      let formattedWorkStationEdit = [];

      resultedit?.forEach((data) => {
        data.combinstation.forEach((station) => {
          station.subTodos.forEach((subTodo) => {
            const formattedString =
              `${data.company}_${data.branch}_${data.unit}_${data.floor}_${data.location}_${data.area}_${subTodo.subcabinname}`.trim();
            formattedWorkStationEdit.push(formattedString);
          });
        });
      });
      setAllWorkStationEdit(formattedWorkStationEdit);
    } catch (err) {
      setLoading(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchWorkStationAll();
  }, [empId]);

  const addSerialNumber = (datas) => {
    const itemsWithSerialNumber = datas?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      cabinname: item.combinstation.map((t) => t.cabinname).join(","),
      subcabinname: item.combinstation
        .map((t) => t.subTodos.map((d) => d.subcabinname).join(","))
        .toString(),
    }));
    setItems(itemsWithSerialNumber);
  };
  useEffect(() => {
    addSerialNumber(locationgroupings);
  }, [locationgroupings]);

  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTable = useRef(null);

  // Excel
  const fileName = "WorkStation";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "WorkStation",
    pageStyle: "print",
  });

  // pdf.....
  const columns = [
    { title: "Company", field: "company" },
    { title: "Branch", field: "branch" },
    { title: "Unit", field: "unit" },
    { title: "Floor", field: "floor" },
    { title: "Area", field: "area" },
    { title: "Location", field: "location" },
    { title: "Main Cabin", field: "maincabin" },
    { title: "Cabin Name", field: "cabinname" },
    { title: "Sub Cabin Name", field: "subcabinname" },
  ];

  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();
    // Modify columns to include serial number column
    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" }, // Serial number column
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial =
      isfilter === "filtered"
        ? rowDataTable.map((item, index) => {
          return {
            serialNumber: index + 1,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            floor: item.floor,
            area: item.area,
            location: item.location,
            maincabin: item.maincabin,
            cabinname: item.cabinname,
            subcabinname: item.subcabinname,
          };
        })
        : items?.map((item, index) => ({
          serialNumber: index + 1,
          company: item.company,
          branch: item.branch,
          unit: item.unit,
          floor: item.floor,
          area: item.area,
          location: item.location,
          maincabin: item.maincabin,
          cabinname: item.cabinname,
          subcabinname: item.subcabinname,
        }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: "5" },
    });

    doc.save("WorkStation.pdf");
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
  };
  const searchTerms = searchQuery.toLowerCase().split(" ");
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
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
        fontWeight: "bold",
      },
      sortable: false,
      width: 90,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
      pinned: "left",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 60,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
      pinned: "left",
    },
    {
      field: "company",
      headerName: "Company",
      pinned: "left",
      flex: 0,
      width: 100,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch",
      pinned: "left",
      flex: 0,
      width: 100,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
    },
    {
      field: "unit",
      headerName: "Unit",
      pinned: "left",
      flex: 0,
      width: 100,
      hide: !columnVisibility.unit,
      headerClassName: "bold-header",
    },
    {
      field: "floor",
      headerName: "Floor",
      flex: 0,
      width: 100,
      hide: !columnVisibility.floor,
      headerClassName: "bold-header",
    },
    {
      field: "area",
      headerName: "Area",
      flex: 0,
      width: 100,
      hide: !columnVisibility.area,
      headerClassName: "bold-header",
    },
    {
      field: "location",
      headerName: "Location",
      flex: 0,
      width: 100,
      hide: !columnVisibility.location,
      headerClassName: "bold-header",
    },
    {
      field: "maincabin",
      headerName: "Main Cabin",
      flex: 0,
      width: 60,
      hide: !columnVisibility.maincabin,
      headerClassName: "bold-header",
    },
    {
      field: "cabinname",
      headerName: "Sub Cabin",
      flex: 0,
      width: 80,
      hide: !columnVisibility.cabinname,
      headerClassName: "bold-header",
    },
    {
      field: "subcabinname",
      headerName: "Sub Sub Cabin",
      flex: 0,
      width: 250,
      hide: !columnVisibility.subcabinname,
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
          {isUserRoleCompare?.includes("eworkstation") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpenEdit();
                getCode(params.data.id, params.data.name);
                setEmpid(params.data.id);
                fetchManpower();
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dworkstation") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id, params.data.name);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vworkstation") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpenview();
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iworkstation") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpeninfo();
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
  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      floor: item.floor,
      area: item.area,
      location: item.location,
      maincabin: item.maincabin,
      cabinname: item.cabinname,
      subcabinname: item.subcabinname,
    };
  });
  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
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

  return (
    <Box>
      <Headtitle title={"WORK STATION"} />
      {/* ****** Header Content ****** */}

      <PageHeading
        title="Work Station"
        modulename="Human Resources"
        submodulename="Facility"
        mainpagename="WorkStation"
        subpagename=""
        subsubpagename=""
      />

      {isUserRoleCompare?.includes("aworkstation") && (
        <>
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Add Work Station
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
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
                      styles={colourStyles}
                      value={{
                        label: workStation.company,
                        value: workStation.company,
                      }}
                      onChange={(e) => {
                        setWorkStation({
                          ...workStation,
                          company: e.value,
                          branch: "Please Select Branch",
                          unit: "Please Select Unit",
                          floor: "Please Select Floor",
                          area: "Please Select Area",
                          location: "Please Select Location",
                        });

                        setFloors([]);
                        setAreas([]);
                        setLocations([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={accessbranch
                        ?.filter((comp) => workStation.company === comp.company)
                        ?.map((data) => ({
                          label: data.branch,
                          value: data.branch,
                        }))
                        .filter((item, index, self) => {
                          return (
                            self.findIndex(
                              (i) =>
                                i.label === item.label && i.value === item.value
                            ) === index
                          );
                        })}
                      styles={colourStyles}
                      value={{
                        label: workStation.branch,
                        value: workStation.branch,
                      }}
                      onChange={(e) => {
                        setNewcheckBranch(e.value);
                        setWorkStation({
                          ...workStation,
                          branch: e.value,
                          unit: "Please Select Unit",
                          floor: "Please Select Floor",
                          area: "Please Select Area",
                          location: "Please Select Location",
                        });
                        setAreas([]);
                        setLocations([]);
                        fetchFloor(e);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Unit<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={accessbranch
                        ?.filter(
                          (comp) =>
                            workStation.company === comp.company &&
                            workStation.branch === comp.branch
                        )
                        ?.map((data) => ({
                          label: data.unit,
                          value: data.unit,
                        }))
                        .filter((item, index, self) => {
                          return (
                            self.findIndex(
                              (i) =>
                                i.label === item.label && i.value === item.value
                            ) === index
                          );
                        })}
                      styles={colourStyles}
                      value={{
                        label: workStation.unit,
                        value: workStation.unit,
                      }}
                      onChange={(e) => {
                        setWorkStation({ ...workStation, unit: e.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Floor<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={floors}
                      styles={colourStyles}
                      value={{
                        label: workStation.floor,
                        value: workStation.floor,
                      }}
                      onChange={(e) => {
                        setWorkStation({
                          ...workStation,
                          floor: e.value,
                          area: "Please Select Area",
                        });
                        setAreas([]);
                        setLocations([]);
                        fetchArea(e.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Area<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={areas}
                      styles={colourStyles}
                      value={{
                        label: workStation.area,
                        value: workStation.area,
                      }}
                      onChange={(e) => {
                        setWorkStation({
                          ...workStation,
                          area: e.value,
                          location: "Please Select Location",
                        });
                        setLocations([]);
                        fetchLocation(e.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Location<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={locations}
                      styles={colourStyles}
                      value={{
                        label: workStation.location,
                        value: workStation.location,
                      }}
                      onChange={(e) => {
                        setWorkStation({ ...workStation, location: e.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}></Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    {" "}
                    <Typography>
                      {" "}
                      Main Cabin <b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      placeholder="Please Enter Main Cabin"
                      value={workStation.maincabin}
                      onChange={(e) =>
                        setWorkStation({
                          ...workStation,
                          maincabin: e.target.value.toUpperCase(),
                        })
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                  <FormControl fullWidth size="small">
                    {" "}
                    <Typography>
                      Sub Cabin<b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      placeholder="Please Enter Sub Cabin"
                      value={workStation.subcabin}
                      onChange={(e) =>
                        setWorkStation({
                          ...workStation,
                          subcabin: e.target.value.toUpperCase(),
                        })
                      }
                    />
                  </FormControl>
                  &emsp;
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleAddTodoAdd}
                    type="button"
                    sx={{
                      height: "30px",
                      minWidth: "30px",
                      marginTop: "28px",
                      padding: "6px 10px",
                    }}
                  >
                    <FaPlus />
                  </Button>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <ul
                    type="none"
                    className="todoLlistUl"
                    style={{ paddingLeft: "0px", marginLeft: "0px" }}
                  >
                    {cabinTodoAdd.map((item, index) => {
                      if (!item?.cabinname) return null; // Skip rendering if cabinName is empty
                      return (
                        <li key={index}>
                          {" "}
                          <br />
                          <Grid container spacing={2}>
                            <Grid
                              item
                              lg={3}
                              md={3}
                              sm={12}
                              xs={12}
                              sx={{ display: "flex", justifyContent: "center" }}
                            >
                              <FormControl size="small" fullWidth>
                                <TextField
                                  value={item.cabinname}
                                  onChange={() => {
                                    setCabinValue({
                                      ...cabinValue,
                                      cabinname: item.cabinname,
                                    });
                                  }}
                                />
                              </FormControl>
                              &ensp;
                              <Button
                                variant="contained"
                                color="error"
                                type="button"
                                onClick={() => handleFileDeleteAdd(index)}
                                sx={{
                                  height: "30px",
                                  minWidth: "30px",
                                  marginTop: "4px",
                                  padding: "6px 10px",
                                }}
                              >
                                <AiOutlineClose />
                              </Button>
                            </Grid>
                            <Grid
                              item
                              lg={3}
                              md={3}
                              sm={10}
                              xs={10}
                              sx={{ display: "flex" }}
                            >
                              <FormControl size="small" fullWidth>
                                <OutlinedInput
                                  type="text"
                                  name="subsubcabinname"
                                  value={item.subsubcabinname}
                                  onChange={(e) =>
                                    multiSubSubRackInputsAdd(
                                      index,
                                      "subsubcabinname",
                                      e.target.value?.toUpperCase(),
                                      item.cabinname
                                    )
                                  }
                                  placeholder="Enter a Sub Sub Cabin"
                                />
                              </FormControl>
                              &emsp;
                              <Button
                                variant="contained"
                                color="success"
                                type="button"
                                onClick={() =>
                                  handleAddSubTodoAdd(
                                    cabinTodoAdd.length,
                                    index,
                                    item.cabinname,
                                    item.subsubcabinname?.toUpperCase()
                                  )
                                }
                                sx={{
                                  marginTop: "5px",
                                  height: "30px",
                                  minWidth: "30px",
                                  padding: "6px 10px",
                                }}
                              >
                                <FaPlus />
                              </Button>
                              &nbsp;
                            </Grid>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                              <ul
                                type="none"
                                className="subtodoLlistUl"
                                style={{
                                  paddingLeft: "0px",
                                  marginLeft: "0px",
                                }}
                              >
                                {item.subTodos.map((subitem, subIndex) => {
                                  if (!subitem.subcabinname) return null; // Skip rendering if cabinName is empty
                                  return (
                                    <li key={subIndex}>
                                      <br />
                                      <Grid container spacing={2}>
                                        <Grid
                                          item
                                          lg={3}
                                          md={3}
                                          sm={12}
                                          xs={12}
                                        ></Grid>
                                        <Grid
                                          item
                                          lg={3}
                                          md={3}
                                          sm={12}
                                          xs={12}
                                          sx={{ display: "flex" }}
                                        >
                                          <FormControl size="small" fullWidth>
                                            <TextField
                                              value={subitem.subcabinname}
                                            />
                                          </FormControl>
                                          &emsp;
                                          <Button
                                            variant="contained"
                                            color="error"
                                            type="button"
                                            onClick={() =>
                                              handleSubFileDeleteAdd(
                                                index,
                                                subIndex
                                              )
                                            }
                                            sx={{
                                              height: "30px",
                                              minWidth: "30px",
                                              marginTop: "5px",
                                              padding: "6px 10px",
                                            }}
                                          >
                                            <AiOutlineClose />
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </li>
                                  );
                                })}
                              </ul>
                            </Grid>
                          </Grid>
                        </li>
                      );
                    })}
                  </ul>
                </Grid>
              </Grid>
              <br />
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={2.5} xs={12} sm={6}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={isBtn}
                    sx={buttonStyles.buttonsubmit}
                  >
                    Submit
                  </Button>
                </Grid>
                <Grid item md={2.5} xs={12} sm={6}>
                  <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                    Clear
                  </Button>
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
          maxWidth="lg"
          sx={{ marginTop: "80px" }}
        >
          <Box sx={{ padding: "20px" }}>
            <>
              <form onSubmit={editSubmit}>
                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={12}>
                    <Typography sx={userStyle.HeaderText}>
                      Edit Work Station
                    </Typography>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Company<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={accessbranch
                          ?.map((data) => ({
                            label: data.company,
                            value: data.company,
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
                        styles={colourStyles}
                        value={{
                          label: workStationEdit.company,
                          value: workStationEdit.company,
                        }}
                        onChange={(e) => {
                          setWorkStationEdit({
                            ...workStationEdit,
                            company: e.value,
                            branch: "Please Select Branch",
                            unit: "Please Select Unit",
                            floor: "Please Select Floor",
                            area: "Please Select Area",
                            location: "Please Select Location",
                          });
                          setAreasEdit([]);
                          setFloorEdit([]);
                          setLocationsEdit([]);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Branch<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={accessbranch
                          ?.filter(
                            (comp) => workStationEdit.company === comp.company
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
                        styles={colourStyles}
                        value={{
                          label: workStationEdit.branch,
                          value: workStationEdit.branch,
                        }}
                        onChange={(e) => {
                          setNewcheckBranch(e.value);
                          setWorkStationEdit({
                            ...workStationEdit,
                            branch: e.value,
                            unit: "Please Select Unit",
                            floor: "Please Select Floor",
                            area: "Please Select Area",
                            location: "Please Select Location",
                          });
                          setAreasEdit([]);
                          setLocationsEdit([]);
                          setFloorEdit([]);
                          fetchFloor(e);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Unit<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={accessbranch
                          ?.filter(
                            (comp) =>
                              workStationEdit.company === comp.company &&
                              workStationEdit.branch === comp.branch
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
                        styles={colourStyles}
                        value={{
                          label: workStationEdit.unit,
                          value: workStationEdit.unit,
                        }}
                        onChange={(e) => {
                          setWorkStationEdit({
                            ...workStationEdit,
                            unit: e.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Floor<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={floorsEdit}
                        styles={colourStyles}
                        value={{
                          label: workStationEdit.floor,
                          value: workStationEdit.floor,
                        }}
                        onChange={(e) => {
                          setWorkStationEdit({
                            ...workStationEdit,
                            floor: e.value,
                            area: "Please Select Area",
                            location: "Please Select Location",
                          });
                          setAreasEdit([]);
                          setLocationsEdit([]);
                          fetchAreaEdit(workStationEdit.branch, e.value);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Area<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={areasEdit}
                        styles={colourStyles}
                        value={{
                          label: workStationEdit.area,
                          value: workStationEdit.area,
                        }}
                        onChange={(e) => {
                          setWorkStationEdit({
                            ...workStationEdit,
                            area: e.value,
                            location: "Please Select Location",
                          });
                          setLocationsEdit([]);
                          fetchAllLocationEdit(
                            workStationEdit.branch,
                            workStationEdit.floor,
                            e.value
                          );
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Location<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={locationsEdit}
                        styles={colourStyles}
                        value={{
                          label: workStationEdit.location,
                          value: workStationEdit.location,
                        }}
                        onChange={(e) => {
                          setWorkStationEdit({
                            ...workStationEdit,
                            location: e.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>{" "}
                <br /> <br />
                <Grid container spacing={2}>
                  <Grid item md={6} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Main Cabin <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        placeholder="Please Enter Main Cabin"
                        value={workStationEdit.maincabin}
                        onChange={(e) =>
                          setWorkStationEdit({
                            ...workStationEdit,
                            maincabin: e.target.value.toUpperCase(),
                          })
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} sm={12} xs={12} sx={{ display: "flex" }}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        {" "}
                        Sub Cabins <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        placeholder="Please Enter Sub Cabin"
                        value={workStationEdit.subcabin}
                        onChange={(e) =>
                          setWorkStationEdit({
                            ...workStationEdit,
                            subcabin: e.target.value.toUpperCase(),
                          })
                        }
                      />
                    </FormControl>{" "}
                    &emsp;
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handleAddTodoEdit}
                      type="button"
                      sx={{
                        height: "30px",
                        minWidth: "30px",
                        marginTop: "28px",
                        padding: "6px 10px",
                      }}
                    >
                      <FaPlus />
                    </Button>
                  </Grid>
                  <Grid item md={12} sm={12} xs={12}>
                    <ul
                      type="none"
                      className="todoLlistUl"
                      style={{ paddingLeft: "0px", marginLeft: "0px" }}
                    >
                      {cabinTodoEdit?.map((item, index) => {
                        if (!item?.cabinname) return null; // Skip rendering if cabinname is empty
                        return (
                          <li key={index}>
                            {" "}
                            <br />
                            <Grid container spacing={2}>
                              <Grid item lg={3} md={3} sm={12} xs={12}>
                                <div key={index}>
                                  {editingIndexedit === index ? (
                                    <Grid container spacing={1}>
                                      <Grid item md={5} sm={5} xs={5}>
                                        <TextField
                                          size="small"
                                          label=""
                                          variant="outlined"
                                          fullWidth
                                          value={
                                            workStationEdit.maincabin +
                                              editedTodoedit ==
                                              undefined
                                              ? ""
                                              : editedTodoedit
                                          }
                                          onChange={(e) =>
                                            setEditedTodoedit(
                                              e.target.value.toUpperCase()
                                            )
                                          }
                                        />
                                      </Grid>
                                      <Grid item md={1} sm={1} xs={1}>
                                        <Button
                                          variant="contained"
                                          style={{
                                            minWidth: "20px",
                                            minHeight: "41px",
                                            background: "transparent",
                                            boxShadow: "none",
                                            marginTop: "-3px !important",
                                            "&:hover": {
                                              background: "#f4f4f4",
                                              borderRadius: "50%",
                                              minHeight: "41px",
                                              minWidth: "20px",
                                              boxShadow: "none",
                                            },
                                          }}
                                          onClick={() =>
                                            handleUpdateTodoEdit(index)
                                          }
                                        >
                                          <CheckCircleIcon
                                            style={{
                                              color: "#216d21",
                                              fontSize: "1.5rem",
                                              marginTop: "-13px !important",
                                            }}
                                          />
                                        </Button>
                                      </Grid>
                                      <Grid item md={1} sm={1} xs={1}>
                                        <Button
                                          variant="contained"
                                          style={{
                                            minWidth: "20px",
                                            minHeight: "41px",
                                            background: "transparent",
                                            boxShadow: "none",
                                            marginTop: "-3px !important",
                                            "&:hover": {
                                              background: "#f4f4f4",
                                              borderRadius: "50%",
                                              minHeight: "41px",
                                              minWidth: "20px",
                                              boxShadow: "none",
                                            },
                                          }}
                                          onClick={() =>
                                            setEditingIndexedit(-1)
                                          }
                                        >
                                          <CancelIcon
                                            style={{
                                              color: "#b92525",
                                              fontSize: "1.5rem",
                                              marginTop: "-13px !important",
                                            }}
                                          />
                                        </Button>
                                      </Grid>
                                    </Grid>
                                  ) : (
                                    <Grid container spacing={1}>
                                      <Grid item md={4} sm={4} xs={4}>
                                        <Typography
                                          variant="subtitle2"
                                          color="textSecondary"
                                          sx={{
                                            whiteSpace: "pre-line",
                                            wordBreak: "break-all",
                                          }}
                                        >
                                          {" "}
                                          {item.cabinname}{" "}
                                        </Typography>
                                      </Grid>
                                      <Grid item md={1} sm={1} xs={1}>
                                        <Button
                                          variant="contained"
                                          style={{
                                            minWidth: "20px",
                                            minHeight: "41px",
                                            background: "transparent",
                                            boxShadow: "none",
                                            marginTop: "-13px !important",
                                            "&:hover": {
                                              background: "#f4f4f4",
                                              borderRadius: "50%",
                                              minHeight: "41px",
                                              minWidth: "20px",
                                              boxShadow: "none",
                                            },
                                          }}
                                          onClick={() => {
                                            handleDeleteTodoEdit(index);
                                            fetchWorkStation();
                                          }}
                                        >
                                          <DeleteIcon
                                            style={{
                                              color: "#b92525",
                                              fontSize: "1.2rem",
                                              marginTop: "-13px !important",
                                            }}
                                          />
                                        </Button>
                                      </Grid>
                                    </Grid>
                                  )}
                                  <br />
                                </div>
                              </Grid>
                              <Grid
                                item
                                lg={3}
                                md={3}
                                sm={12}
                                xs={12}
                                sx={{ display: "flex" }}
                              >
                                <FormControl size="small" fullWidth>
                                  <OutlinedInput
                                    type="text"
                                    name="subcabinname"
                                    value={item.subcabinname === undefined ? "" : item.subcabinname?.toUpperCase()}
                                    onChange={(e) =>
                                      multiSubSubRackInputsEdit(
                                        index,
                                        "subcabinname",
                                        e.target.value?.toUpperCase(),
                                        item.cabinname
                                      )
                                    }
                                    placeholder="Enter a Sub Sub Cabin"
                                  />
                                </FormControl>
                                &ensp;
                                <Button
                                  variant="contained"
                                  color="success"
                                  type="button"
                                  onClick={() =>
                                    handleAddSubTodoEdit(
                                      cabinTodoEdit.length,
                                      index,
                                      item.cabinname,
                                      item.subcabinname?.toUpperCase()
                                    )
                                  }
                                  sx={{
                                    marginTop: "5px",
                                    height: "30px",
                                    minWidth: "30px",
                                    padding: "6px 10px",
                                  }}
                                >
                                  <FaPlus />
                                </Button>
                                &nbsp;
                              </Grid>
                              <Grid item lg={12} md={12} sm={12} xs={12}>
                                <ul
                                  type="none"
                                  className="subtodoLlistUl"
                                  style={{
                                    paddingLeft: "0px",
                                    marginLeft: "0px",
                                  }}
                                >
                                  {item.subTodos.map((subitem, subIndex) => {
                                    if (!subitem.subcabinname) return null; // Skip rendering if cabinname is empty
                                    return (
                                      <li key={subIndex}>
                                        <Grid container spacing={3}>
                                          <Grid
                                            item
                                            lg={3}
                                            md={3}
                                            sm={12}
                                            xs={12}
                                          ></Grid>
                                          <Grid
                                            item
                                            lg={3}
                                            md={3}
                                            sm={12}
                                            xs={12}
                                          >
                                            {subEditingIndexedit ===
                                              subitem.idval ? (
                                              <Grid container spacing={1}>
                                                <Grid
                                                  item
                                                  md={8.5}
                                                  sm={9.5}
                                                  xs={9.5}
                                                  sx={{ display: "flex" }}
                                                >
                                                  <FormControl
                                                    size="small"
                                                    fullWidth
                                                  >
                                                    <TextField
                                                      fullWidth
                                                      size="small"
                                                      value={editedSubTodoedit}
                                                      onChange={(e) =>
                                                        setEditedSubTodoedit(
                                                          e.target.value.toUpperCase()
                                                        )
                                                      }
                                                    />
                                                    <br />
                                                  </FormControl>
                                                  &ensp;
                                                </Grid>
                                                <Grid
                                                  item
                                                  md={1.5}
                                                  sm={1.5}
                                                  xs={1.5}
                                                >
                                                  <Button
                                                    variant="contained"
                                                    style={{
                                                      minWidth: "20px",
                                                      minHeight: "41px",
                                                      background: "transparent",
                                                      boxShadow: "none",
                                                      marginTop:
                                                        "-3px !important",
                                                      "&:hover": {
                                                        background: "#f4f4f4",
                                                        borderRadius: "50%",
                                                        minHeight: "41px",
                                                        minWidth: "20px",
                                                        boxShadow: "none",
                                                      },
                                                    }}
                                                    onClick={() =>
                                                      handleUpdateSubTodoEdit(
                                                        index,
                                                        subIndex,
                                                        subitem.idval
                                                      )
                                                    }
                                                  >
                                                    <CheckCircleIcon
                                                      style={{
                                                        color: "#216d21",
                                                        fontSize: "1.2rem",
                                                        marginTop:
                                                          "-13px !important",
                                                      }}
                                                    />
                                                  </Button>
                                                </Grid>
                                                <Grid
                                                  item
                                                  md={1}
                                                  sm={1}
                                                  xs={1}
                                                ></Grid>
                                                <Grid item md={1} sm={1} xs={1}>
                                                  <Button
                                                    variant="contained"
                                                    style={{
                                                      minWidth: "20px",
                                                      minHeight: "41px",
                                                      background: "transparent",
                                                      boxShadow: "none",
                                                      marginTop:
                                                        "-3px !important",
                                                      "&:hover": {
                                                        background: "#f4f4f4",
                                                        borderRadius: "50%",
                                                        minHeight: "41px",
                                                        minWidth: "20px",
                                                        boxShadow: "none",
                                                      },
                                                    }}
                                                    onClick={() =>
                                                      setSubEditingIndexedit(-1)
                                                    }
                                                  >
                                                    <CancelIcon
                                                      style={{
                                                        color: "#b92525",
                                                        fontSize: "1.2rem",
                                                        marginTop:
                                                          "-13px !important",
                                                      }}
                                                    />
                                                  </Button>
                                                </Grid>
                                              </Grid>
                                            ) : (
                                              <Grid container spacing={1}>
                                                <Grid
                                                  item
                                                  md={8.5}
                                                  sm={9.5}
                                                  xs={9.5}
                                                >
                                                  <Typography
                                                    variant="subtitle2"
                                                    color="textSecondary"
                                                  >
                                                    {" "}
                                                    {subitem.subcabinname}{" "}
                                                  </Typography>
                                                </Grid>
                                                <Grid
                                                  item
                                                  md={1.5}
                                                  sm={1.5}
                                                  xs={1.5}
                                                >
                                                  <Button
                                                    variant="contained"
                                                    style={{
                                                      minWidth: "20px",
                                                      minHeight: "41px",
                                                      background: "transparent",
                                                      boxShadow: "none",
                                                      marginTop:
                                                        "-13px !important",
                                                      "&:hover": {
                                                        background: "#f4f4f4",
                                                        borderRadius: "50%",
                                                        minHeight: "41px",
                                                        minWidth: "20px",
                                                        boxShadow: "none",
                                                      },
                                                    }}
                                                    onClick={() =>
                                                      handleEditSubTodoEdit(
                                                        index,
                                                        subIndex
                                                      )
                                                    }
                                                  >
                                                    <FaEdit
                                                      style={{
                                                        color: "#1976d2",
                                                        fontSize: "1.2rem",
                                                        marginTop:
                                                          "-13px !important",
                                                      }}
                                                    />
                                                  </Button>
                                                </Grid>
                                                <Grid
                                                  item
                                                  md={1}
                                                  sm={1}
                                                  xs={1}
                                                ></Grid>
                                                <Grid item md={1} sm={1} xs={1}>
                                                  <Button
                                                    variant="contained"
                                                    style={{
                                                      minWidth: "20px",
                                                      minHeight: "41px",
                                                      background: "transparent",
                                                      boxShadow: "none",
                                                      marginTop:
                                                        "-13px !important",
                                                      "&:hover": {
                                                        background: "#f4f4f4",
                                                        borderRadius: "50%",
                                                        minHeight: "41px",
                                                        minWidth: "20px",
                                                        boxShadow: "none",
                                                      },
                                                    }}
                                                    onClick={() =>
                                                      handleDeleteSubTodoEdit(
                                                        index,
                                                        subIndex
                                                      )
                                                    }
                                                  >
                                                    <DeleteIcon
                                                      style={{
                                                        color: "#b92525",
                                                        fontSize: "1.2rem",
                                                        marginTop:
                                                          "-13px !important",
                                                      }}
                                                    />
                                                  </Button>
                                                </Grid>
                                              </Grid>
                                            )}
                                          </Grid>
                                        </Grid>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </Grid>
                            </Grid>
                          </li>
                        );
                      })}
                    </ul>
                  </Grid>
                </Grid>
                <Grid item md={1} marginTop={3}></Grid>
                <Grid item md={5}></Grid>
                <Grid container spacing={2}>
                  <Grid item md={6} xs={6} sm={6}>
                    <Button
                      variant="contained"
                      type="submit"
                      sx={buttonStyles.buttonsubmit}
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
                {/* </DialogContent> */}
              </form>
            </>
          </Box>
        </Dialog>
      </Box>
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lworkstation") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Work Station List
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
                    <MenuItem value={locationgroupings?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes("excelworkstation") && (
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
                  {isUserRoleCompare?.includes("csvworkstation") && (
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
                  {isUserRoleCompare?.includes("printworkstation") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfworkstation") && (
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
                  {isUserRoleCompare?.includes("imageworkstation") && (
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
                  maindatas={locationgroupings}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                  totalDatas={locationgroupingsoverall}
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
            &ensp;
            {isUserRoleCompare?.includes("bdworkstation") && (
              <Button
                variant="contained"
                color="error"
                onClick={handleClickOpenalert}
                sx={buttonStyles.buttonbulkdelete}
              >
                Bulk Delete
              </Button>
            )}
            <br />
            <br />
            {!loading ? (
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
                  searchQuery={searchedString}
                  handleShowAllColumns={handleShowAllColumns}
                  setFilteredRowData={setFilteredRowData}
                  filteredRowData={filteredRowData}
                  setFilteredChanges={setFilteredChanges}
                  filteredChanges={filteredChanges}
                  gridRefTableImg={gridRefTableImg}
                  itemsList={locationgroupingsoverall}
                />
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
      {/* Delete Modal */}

      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        sx={{ marginTop: "80px" }}
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Work Station
            </Typography>
            <br /> <br />
            <Grid container spacing={2} sx={{ padding: "20px" }}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Company</Typography>
                  <Typography>{workStationEdit.company}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Branch</Typography>
                  <Typography>{workStationEdit.branch}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Unit</Typography>
                  <Typography>{workStationEdit.unit}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Floor</Typography>
                  <Typography>{workStationEdit.floor}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Area</Typography>
                  <Typography>{workStationEdit.area}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={6} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Location</Typography>
                  <Typography>{workStationEdit.location}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={6} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Main Cabin </Typography>
                  <Typography>{workStationEdit.maincabin}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={6} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Sub Cabin </Typography>
                  <Typography>
                    {workStationEdit.combinstation
                      ?.map((t) => t.cabinname)
                      ?.join(",")}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Sub Sub Cabin </Typography>
                  <Typography>
                    {workStationEdit.combinstation
                      ?.map((t) =>
                        t.subTodos?.map((d) => d.subcabinname)?.join(",")
                      )
                      ?.join(",")}
                  </Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                sx={buttonStyles?.btncancel}
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
            {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              ok
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
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
        itemsTwo={locationgroupingsoverall ?? []}
        filename={fileName}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Work Station Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delLocationgrp}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={delLocationgrpcheckbox}
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
    </Box>
  );
}
export default WorkStation;
