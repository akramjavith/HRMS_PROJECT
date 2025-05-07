import CloseIcon from "@mui/icons-material/Close";
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
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Popover,
  Select,
  TextField,
  Typography,
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
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
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
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import domtoimage from "dom-to-image";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import LoadingButton from '@mui/lab/LoadingButton';
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";

const Loader = ({ loading, message }) => {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 999 }}
      open={loading}
    >
      <div style={{ textAlign: "center" }}>
        <CircularProgress sx={{ color: "#edf1f7" }} />
        <Typography variant="h6" sx={{ mt: 2, color: "#edf1f7" }}>
          {message}
        </Typography>
      </div>
    </Backdrop>
  );
};

function LocationGrouping() {
  const [loading, setLoading] = useState(false);
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);

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

  const [bulkIsLoading, setBulkIsLoading] = useState(false);

  let exportColumnNames = [
    "Company",
    "Branch",
    "Unit",
    "Floor",
    "Location",
    "Area",
  ];
  let exportRowValues = [
    "company",
    "branch",
    "unit",
    "floor",
    "location",
    "area",
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

  const [locationgrouping, setLocationgrouping] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    floor: "Please Select Floor",
    area: "Please Select Area",
    location: "",
  });

  const [locationgroupingEdit, setLocationgroupingEdit] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    floor: "Please Select Floor",
    area: "Please Select Area",
    location: "",
  });
  const [locationgroupings, setLocationgroupings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [allLocationgroupingedit, setAllLocationgroupingedit] = useState([]);

  const {
    isUserRoleCompare,
    isUserRoleAccess,
    isAssignBranch,
    pageName,
    setPageName,
    buttonStyles,
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
          data?.subsubpagenameurl?.length !== 0 &&
          data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subsubpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 &&
          data?.subpagenameurl?.length !== 0 &&
          data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 &&
          data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.mainpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.subsubpagenameurl?.includes(window.location.pathname)
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
      pagename: String("Location Grouping"),
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

  const [locationgroupingCheck, setLocationgroupingcheck] = useState(false);
  const [isBtn, setIsBtn] = useState(false);

  const username = isUserRoleAccess.username;

  const gridRef = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);

  const [searchQueryManage, setSearchQueryManage] = useState("");

  const [copiedData, setCopiedData] = useState("");

  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage
        .toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Location Grouping.png");
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
  const handleClickOpenerrpop = () => {
    setIsErrorOpenpop(true);
  };
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
    setIsHandleChange(true);
    handleCloseerr();
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      // setIsDeleteOpencheckbox(true);
      checkUsedByOtherBulk();
    }
  };

  const checkUsedByOtherBulk = async (data) => {
    setBulkIsLoading(true);
    let collectedDatas = selectedRows
      .map((item) => {
        return rowDataTable.find((data) => data.id === item);
      })
      .flatMap((item) => {
        let LocationDatas = item?.location.split(",");

        let combinedData = LocationDatas?.map((location) => ({
          company: item?.company,
          branch: item?.branch,
          unit: item?.unit,
          floor: item?.floor,
          area: item?.area,
          location: location,
          id: item.id,
        }));

        return combinedData;
      });

    console.log(collectedDatas, "collectedDatas");

    try {
      let res = await axios.post(SERVICE.LOCATIONGROUPINGOVERALLDELETECONDITION, {
        combinedData: collectedDatas,
      });
      console.log(res?.data)
      const uniqueData = Array.from(
        new Map(
          res?.data?.matchedConditions?.map((item) => [item?.id, item])
        ).values()
      );
      if (res.data.exists) {
        if (uniqueData.length === selectedRows.length) {
          setBulkIsLoading(false);
          setPopupContentMalert(`All the Selected ${res.data.popupMessage}`);
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();

        } else {
          setBulkIsLoading(false);
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />
              <p
                style={{ fontSize: "20px", fontWeight: 900 }}
              >{`Some of the ${res.data.popupMessage}`}</p>
            </>
          );
          handleClickOpenerr();
        }

        setSelectedRows((prev) => {
          return prev.filter(
            (item) =>
              !res.data.matchedConditions.some((data) => data.id === item)
          );
        });
      } else {
        setBulkIsLoading(false);
        setIsDeleteOpencheckbox(true);
      }
    } catch (err) {
      setBulkIsLoading(false);
      console.log(err);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
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
    branch: true,
    unit: true,
    floor: true,
    area: true,
    location: true,
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

  const [deletelocationgrp, setDeleteLocationgrp] = useState("");

  const rowData = async (id) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.LOCATIONGROUPING_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteLocationgrp(res?.data?.slocationgrouping);
      handleClickOpen();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  // Alert delete popup
  let Locationgrpsid = deletelocationgrp?._id;
  const delLocationgrp = async () => {
    setPageName(!pageName);
    try {
      if (Locationgrpsid) {
        await axios.delete(
          `${SERVICE.LOCATIONGROUPING_SINGLE}/${Locationgrpsid}`,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          }
        );
        await fetchLocationgrouping();
        handleCloseMod();
        setSelectedRows([]);
        setPage(1);
        setFilteredChanges(null);
        setFilteredRowData([]);
        setSearchQuery("");
        setPopupContent("Deleted Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
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

  const delLocationgrpcheckbox = async () => {
    setPageName(!pageName);
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.LOCATIONGROUPING_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
      setIsHandleChange(false);

      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);
      setFilteredChanges(null);
      setFilteredRowData([]);
      setSearchQuery("");
      await fetchLocationgrouping();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const [floors, setFloors] = useState([]);
  const [areas, setAreas] = useState([]);
  const [locations, setLocations] = useState([]);

  const [floorsEdit, setFloorEdit] = useState([]);
  const [areasEdit, setAreasEdit] = useState([]);
  const [locationsEdit, setLocationsEdit] = useState([]);

  const [newcheckbranch, setNewcheckBranch] = useState("Choose Branch");

  //Edit model...
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
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
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
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
      setAreasEdit(all);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const fetchAreaEdit = async (e) => {
    let floor = e.value ? e.value : e.floor;
    setPageName(!pageName);
    try {
      let res_type = await axios.get(SERVICE.AREAGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let result = res_type.data.areagroupings
        .filter((d) => d.branch === e.branch && d.floor === floor)
        .map((data) => data.area);
      let ji = [].concat(...result);
      let jiii = ji.map((data) => data);

      const all = ji.map((d) => ({
        ...d,
        label: d,
        value: d,
      }));

      setAreasEdit(all);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const getunitvaluesCate = (e) => {
    setSelectedOptionsCateEdit(
      Array.isArray(e?.arrlocation)
        ? e?.arrlocation?.map((x) => ({
          ...x,
          label: x,
          value: x,
          key: `location-${x._id}`,
        }))
        : []
    );
  };

  //get all Locations.
  const fetchAllLocation = async () => {
    setPageName(!pageName);
    try {
      let res_location = await axios.get(SERVICE.LOCATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const locationall = [
        ...res_location?.data?.locationdetails.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];

      setLocations(locationall);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  //get all Locations.
  const fetchAllLocationEdit = async () => {
    setPageName(!pageName);
    try {
      let res_location = await axios.get(SERVICE.LOCATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const locationall = [
        ...res_location?.data?.locationdetails.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];

      setLocationsEdit(locationall);
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
    fetchAllLocationEdit();
  }, [isEditOpen, locationgroupingEdit.floor]);

  const [selectedOptionsCate, setSelectedOptionsCate] = useState([]);
  let [valueCate, setValueCate] = useState("");

  const handleCategoryChange = (options) => {
    setValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCate(options);
  };

  const customValueRendererCate = (valueCate, _location) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label)?.join(", ")
      : "Please Select Location";
  };

  // Edit functionlity
  const [selectedOptionsCateEdit, setSelectedOptionsCateEdit] = useState([]);
  let [valueCateEdit, setValueCateEdit] = useState("");

  const handleCategoryChangeEdit = (options) => {
    // setValueCateEdit(options.map((a, index) => {
    //     return a.value
    // }))
    setSelectedOptionsCateEdit(options);
  };

  const customValueRendererCateEdit = (valueCateEdit, _location) => {
    return valueCateEdit.length
      ? valueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Location";
  };

  //add function
  const sendRequest = async () => {
    setIsBtn(true);
    setPageName(!pageName);
    try {
      let subprojectscreate = await axios.post(
        SERVICE.LOCATIONGROUPING_CREATE,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          company: String(locationgrouping.company),
          branch: String(locationgrouping.branch),
          unit: String(locationgrouping.unit),
          floor: String(locationgrouping.floor),
          area: String(locationgrouping.area),
          location: [...valueCate],
          addedby: [
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      await fetchLocationgrouping();
      setFilteredChanges(null);
      setFilteredRowData([]);
      setSearchQuery("");
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setIsBtn(false);
    } catch (err) {
      setIsBtn(false);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    let locations = selectedOptionsCate.map((item) => item.value);
    const isNameMatch = locationgroupings.some(
      (item) =>
        item.company === locationgrouping.company &&
        item.branch === locationgrouping.branch &&
        item.unit === locationgrouping.unit &&
        item.floor === locationgrouping.floor &&
        item.area === locationgrouping.area &&
        item.location.some((data) => locations.includes(data))
    );
    if (locationgrouping.company === "Please Select Company") {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (locationgrouping.branch === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (locationgrouping.unit === "Please Select Unit") {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (locationgrouping.floor === "Please Select Floor") {
      setPopupContentMalert("Please Select Floor!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (locationgrouping.area === "Please Select Area") {
      setPopupContentMalert("Please Select Area!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsCate.length == 0) {
      setPopupContentMalert("Please Select Location!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Name already exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setLocationgrouping({
      company: "Please Select Company",
      branch: "Please Select Branch",
      unit: "Please Select Unit",
      floor: "Please Select Floor",
      area: "Please Select Area",
      location: "",
    });
    setFloors([]);
    setAreas([]);
    setSelectedOptionsCate([]);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };

  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  const [updateBtnDisabled, setUpdateBtnDisabled] = useState(false);
  const [updateBtnDisabledMessage, setUpdateBtnDisabledMessage] = useState(
    "Data Linked to Other Pages"
  );
  //get single row to edit....
  const getCode = async (e, data) => {
    setLoading(true);
    setPageName(!pageName);

    let LocationDatas = data?.location.split(",");

    let combinedData = LocationDatas?.map((location) => ({
      company: data?.company,
      branch: data?.branch,
      unit: data?.unit,
      floor: data?.floor,
      area: data?.area,
      location: location,
      id: data.id,
    }));
    try {
      const [res, resNew] = await Promise.all([
        axios.get(`${SERVICE.LOCATIONGROUPING_SINGLE}/${e}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.post(
          SERVICE.LOCATIONGROUPINGOVERALLDELETECONDITION,
          {
            combinedData,
          }
        )
      ])

      if (resNew.data.exists) {
        setUpdateBtnDisabledMessage(resNew.data.popupMessage);
        setUpdateBtnDisabled(true);
      } else {
        setUpdateBtnDisabled(false);
      }

      setLocationgroupingEdit(res?.data?.slocationgrouping);
      setNewcheckBranch(res?.data?.slocationgrouping?.branch);
      fetchFloor(res?.data?.slocationgrouping);
      fetchAreaEdit(res?.data?.slocationgrouping);
      setSelectedOptionsCateEdit(
        res?.data?.slocationgrouping.location.map((item) => ({
          ...item,
          label: item,
          value: item,
        }))
      );
      setLoading(false);
      handleClickOpenEdit();
    } catch (err) {
      setLoading(false);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.LOCATIONGROUPING_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setLocationgroupingEdit(res?.data?.slocationgrouping);
      handleClickOpenview();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.LOCATIONGROUPING_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setLocationgroupingEdit(res?.data?.slocationgrouping);
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

  useEffect(() => {
    fetchAllLocation();
  }, []);

  //Project updateby edit page...
  let updateby = locationgroupingEdit?.updatedby;
  let addedby = locationgroupingEdit?.addedby;

  let subprojectsid = locationgroupingEdit?._id;

  //editing the single data...
  const sendEditRequest = async () => {
    let employ = selectedOptionsCateEdit.map((item) => item.value);
    setPageName(!pageName);
    try {
      let res = await axios.put(
        `${SERVICE.LOCATIONGROUPING_SINGLE}/${subprojectsid}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          company: String(locationgroupingEdit.company),
          branch: String(locationgroupingEdit.branch),
          unit: String(locationgroupingEdit.unit),
          floor: String(locationgroupingEdit.floor),
          area: String(locationgroupingEdit.area),
          location: [...employ],
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      await fetchLocationgrouping();
      await fetchLocationgroupingAll();
      setSelectedOptionsCateEdit([]);
      setLocationsEdit([]);
      handleCloseModEdit();
      setFilteredChanges(null);
      setFilteredRowData([]);
      setSearchQuery("");
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const editSubmit = (e) => {
    e.preventDefault();
    fetchLocationgroupingAll();
    let locationsEditt = selectedOptionsCateEdit.map((item) => item.value);
    const isNameMatch = allLocationgroupingedit.some(
      (item) =>
        item.company === locationgroupingEdit.company &&
        item.branch === locationgroupingEdit.branch &&
        item.unit === locationgroupingEdit.unit &&
        item.floor === locationgroupingEdit.floor &&
        item.area === locationgroupingEdit.area &&
        item.location.some((data) => locationsEditt.includes(data))
    );
    if (locationgroupingEdit.company === "Please Select Company") {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (locationgroupingEdit.branch === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (locationgroupingEdit.unit === "Please Select Unit") {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (locationgroupingEdit.floor === "Please Select Floor") {
      setPopupContentMalert("Please Select Floor!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (locationgroupingEdit.area === "Please Select Area") {
      setPopupContentMalert("Please Select Area!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsCateEdit.length == 0) {
      setPopupContentMalert("Please Select Location!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Name already exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendEditRequest();
    }
  };

  const [locationgroupingsall, setLocationgroupingsAll] = useState([]);

  //get all Sub vendormasters.
  const fetchLocationgrouping = async () => {
    setPageName(!pageName);
    try {
      let res_location = await axios.get(SERVICE.LOCATIONGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let ans = res_location?.data?.locationgroupings?.filter((item) =>
        accessbranch.some(
          (branch) =>
            branch.company === item.company &&
            branch.branch === item.branch &&
            branch.unit === item.unit
        )
      );
      setLocationgroupings(ans);
      setLocationgroupingsAll(
        ans?.map((item, index) => ({
          ...item,
          id: item?._id,
          serialNumber: index + 1,
          location: item.location?.toString(),
          arrlocation: item.location,
        }))
      );
      setLocationgroupingcheck(true);
    } catch (err) {
      setLocationgroupingcheck(true);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  //get all Sub vendormasters.
  const fetchLocationgroupingAll = async () => {
    setPageName(!pageName);
    try {
      let res_location = await axios.get(SERVICE.LOCATIONGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAllLocationgroupingedit(
        res_location?.data?.locationgroupings.filter(
          (item) => item._id !== locationgroupingEdit._id
        )
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

  // Excel
  const fileName = "Location Grouping";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Location Grouping",
    pageStyle: "print",
  });

  useEffect(() => {
    fetchLocationgrouping();
    fetchLocationgroupingAll();
  }, []);

  useEffect(() => {
    fetchLocationgroupingAll();
  }, [isEditOpen, locationgroupingEdit]);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const checkUsedByOther = async (data) => {
    let LocationDatas = data?.location.split(",");

    let combinedData = LocationDatas?.map((location) => ({
      company: data?.company,
      branch: data?.branch,
      unit: data?.unit,
      floor: data?.floor,
      area: data?.area,
      location: location,
      id: data.id,
    }));

    try {
      let res = await axios.post(
        SERVICE.LOCATIONGROUPINGOVERALLDELETECONDITION,
        {
          combinedData,
        }
      );
      if (res.data.exists) {
        setPopupContentMalert(res.data.popupMessage);
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else {
        rowData(data?.id);
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

  const [items, setItems] = useState([]);

  const addSerialNumber = (datas) => {
    const itemsWithSerialNumber = datas?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      location: item.location?.toString(),
      arrlocation: item.location,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber(locationgroupings);
  }, [locationgroupings]);
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
  const searchTerms = searchQuery.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) =>
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
      width: 90,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
      pinned: "left",
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 250,
      pinned: "left",
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 100,
      pinned: "left",
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 100,
      pinned: "left",
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
      field: "location",
      headerName: "Location",
      flex: 0,
      width: 100,
      hide: !columnVisibility.location,
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
          {isUserRoleCompare?.includes("elocationgrouping") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.data.id, params.data);
                getunitvaluesCate(params.data);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dlocationgrouping") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                // rowData(params.data.id, params.data.name);
                checkUsedByOther(params.data);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vlocationgrouping") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("ilocationgrouping") && (
            <Button
              sx={userStyle.buttonedit}
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

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      floor: item.floor,
      location: item.location,
      area: item.area,
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
  return (
    <Box>
      <Headtitle title={"LOCATION GROUPING"} />
      <PageHeading
        title="Location Grouping"
        modulename="Human Resources"
        submodulename="Facility"
        mainpagename="Location Grouping"
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("alocationgrouping") && (
        <>
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Add Location Grouping
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
                        label: locationgrouping.company,
                        value: locationgrouping.company,
                      }}
                      onChange={(e) => {
                        setLocationgrouping({
                          ...locationgrouping,
                          company: e.value,
                          branch: "Please Select Branch",
                          unit: "Please Select Unit",
                          floor: "Please Select Floor",
                          area: "Please Select Area",
                        });
                        setFloors([]);
                        setAreas([]);
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
                        ?.filter(
                          (comp) => locationgrouping.company === comp.company
                        )
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
                        label: locationgrouping.branch,
                        value: locationgrouping.branch,
                      }}
                      onChange={(e) => {
                        setNewcheckBranch(e.value);
                        setLocationgrouping({
                          ...locationgrouping,
                          branch: e.value,
                          unit: "Please Select Unit",
                          floor: "Please Select Floor",
                          area: "Please Select Area",
                        });
                        fetchFloor(e);
                        setAreas([]);
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
                            locationgrouping.company === comp.company &&
                            locationgrouping.branch === comp.branch
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
                        label: locationgrouping.unit,
                        value: locationgrouping.unit,
                      }}
                      onChange={(e) => {
                        setLocationgrouping({
                          ...locationgrouping,
                          unit: e.value,
                          floor: "Please Select Floor",
                          area: "Please Select Area",
                        });
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
                        label: locationgrouping.floor,
                        value: locationgrouping.floor,
                      }}
                      onChange={(e) => {
                        setLocationgrouping({
                          ...locationgrouping,
                          floor: e.value,
                          area: "Please Select Area",
                        });
                        fetchArea(e.value);
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Location<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={locations}
                      value={selectedOptionsCate}
                      onChange={handleCategoryChange}
                      valueRenderer={customValueRendererCate}
                      labelledBy="Please Select Location"
                    // className="scrollable-multiselect"
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
                        label: locationgrouping.area,
                        value: locationgrouping.area,
                      }}
                      onChange={(e) => {
                        setLocationgrouping({
                          ...locationgrouping,
                          area: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br /> <br />
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
          maxWidth="md"
          sx={{
            overflow: "visible",
            "& .MuiPaper-root": {
              overflow: "visible",
            },
          }}
        >
          <Box sx={{ padding: "20px", width: "850px" }}>
            <>
              <form onSubmit={editSubmit}>
                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={12}>
                    <Typography sx={userStyle.HeaderText}>
                      Edit Location Grouping
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
                          label: locationgroupingEdit.company,
                          value: locationgroupingEdit.company,
                        }}
                        onChange={(e) => {
                          setLocationgroupingEdit({
                            ...locationgroupingEdit,
                            company: e.value,
                            branch: "Please Select Branch",
                            unit: "Please Select Unit",
                            floor: "Please Select Floor",
                            area: "Please Select Area",
                          });
                          setFloorEdit([]);
                          setAreasEdit([]);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Branch<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={accessbranch
                          ?.filter(
                            (comp) =>
                              locationgroupingEdit.company === comp.company
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
                          label: locationgroupingEdit.branch,
                          value: locationgroupingEdit.branch,
                        }}
                        onChange={(e) => {
                          setNewcheckBranch(e.value);
                          setLocationgroupingEdit({
                            ...locationgroupingEdit,
                            branch: e.value,
                            floor: "Please Select Floor",
                            area: "Please Select Area",
                            unit: "Please Select Unit",
                          });
                          setAreasEdit([]);
                          setFloorEdit([]);
                          fetchFloor(e);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Unit<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={accessbranch
                          ?.filter(
                            (comp) =>
                              locationgroupingEdit.company === comp.company &&
                              locationgroupingEdit.branch === comp.branch
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
                          label: locationgroupingEdit.unit,
                          value: locationgroupingEdit.unit,
                        }}
                        onChange={(e) => {
                          setLocationgroupingEdit({
                            ...locationgroupingEdit,
                            unit: e.value,
                            floor: "Please Select Floor",
                            area: "Please Select Area",
                          });
                          setAreasEdit([]);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Floor<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={floorsEdit}
                        styles={colourStyles}
                        value={{
                          label: locationgroupingEdit.floor,
                          value: locationgroupingEdit.floor,
                        }}
                        onChange={(e) => {
                          setLocationgroupingEdit({
                            ...locationgroupingEdit,
                            floor: e.value,
                            area: "Please Select Area",
                          });
                          fetchAreaEdit(e);
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Location <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        className="custom-multi-select"
                        id="component-outlined"
                        options={locationsEdit}
                        value={selectedOptionsCateEdit}
                        onChange={handleCategoryChangeEdit}
                        valueRenderer={customValueRendererCateEdit}
                        labelledBy="Please Select Location"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Area<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={areasEdit}
                        styles={colourStyles}
                        value={{
                          label: locationgroupingEdit.area,
                          value: locationgroupingEdit.area,
                        }}
                        onChange={(e) => {
                          setLocationgroupingEdit({
                            ...locationgroupingEdit,
                            area: e.value,
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
                    <Button
                      variant="contained"
                      type="submit"
                      sx={buttonStyles.buttonsubmit}
                      disabled={updateBtnDisabled}
                    >
                      Update
                    </Button>
                    {updateBtnDisabled && (
                      <Tooltip
                        title={updateBtnDisabledMessage}
                        placement="top"
                        arrow
                      >
                        <IconButton color="primary">
                          <InfoIcon />
                        </IconButton>
                      </Tooltip>
                    )}
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
      {isUserRoleCompare?.includes("llocationgrouping") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Location Grouping List
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
                  {isUserRoleCompare?.includes("excellocationgrouping") && (
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
                  {isUserRoleCompare?.includes("csvlocationgrouping") && (
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
                  {isUserRoleCompare?.includes("printlocationgrouping") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdflocationgrouping") && (
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
                  {isUserRoleCompare?.includes("imagelocationgrouping") && (
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
                  totalDatas={locationgroupingsall}
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
            {isUserRoleCompare?.includes("bdlocationgrouping") && (
              <LoadingButton
                variant="contained"
                color="error"
                onClick={handleClickOpenalert}
                loading={bulkIsLoading}
                sx={buttonStyles.buttonbulkdelete}
              >
                Bulk Delete
              </LoadingButton>
            )}
            <br />
            <br />
            {!locationgroupingCheck ? (
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
                  itemsList={locationgroupingsall}
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

      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        sx={{ marginTop: "80px" }}
      >
        <Box sx={{ width: "750px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Location Grouping
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Company</Typography>
                  <Typography>{locationgroupingEdit.company}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Branch</Typography>
                  <Typography>{locationgroupingEdit.branch}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Unit</Typography>
                  <Typography>{locationgroupingEdit.unit}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Floor</Typography>
                  <Typography>{locationgroupingEdit.floor}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={6} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Location</Typography>
                  <Typography
                    style={{
                      whiteSpace: "normal",
                      wordBreak: "break-word", // Wraps long words if needed
                    }}
                  >
                    {locationgroupingEdit.location?.toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Area</Typography>
                  <Typography>{locationgroupingEdit.area}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                sx={buttonStyles.btncancel}
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
            <Button sx={buttonStyles.btncancel} onClick={handleCloseerrpop}>
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
            sx={{ width: "450px", textAlign: "center", alignItems: "center" }}
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
              variant="outlined"
              style={{
                padding: "7px 13px",
                color: "#000",
              }}
              onClick={handleCloseerr}
            >
              close
            </Button>
            <Button
              variant="contained"
              style={{
                padding: "7px 13px",
                color: "white",
                background: "rgb(25, 118, 210)",
              }}
              onClick={delLocationgrpcheckbox}
            >
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
        filteredDataTwo={
          (filteredChanges !== null ? filteredRowData : rowDataTable) ?? []
        }
        itemsTwo={locationgroupingsall ?? []}
        filename={fileName}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Location Grouping Info"
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
      <Loader loading={loading} message={"Please Wait..."} />
      {/* EXTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}

export default LocationGrouping;
