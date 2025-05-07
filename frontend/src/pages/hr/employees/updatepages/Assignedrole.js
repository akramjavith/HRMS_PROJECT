import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditIcon from "@mui/icons-material/Edit";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
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
  Paper,
  Popover,
  Select,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TextField,
  Typography,
  Chip,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import * as FileSaver from "file-saver";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPlus, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";
import { handleApiError } from "../../../../components/Errorhandling";
import Headtitle from "../../../../components/Headtitle";
import { menuItems } from "../../../../components/menuItemsList";
import PageHeading from "../../../../components/PageHeading";
import { StyledTableCell, StyledTableRow } from "../../../../components/Table";
import {
  AuthContext,
  UserRoleAccessContext,
} from "../../../../context/Appcontext";
import { colourStyles, userStyle } from "../../../../pageStyle";
import { SERVICE } from "../../../../services/Baseservice";

import AggregatedSearchBar from '../../../../components/AggregatedSearchBar';
import AggridTable from "../../../../components/AggridTable";
import AlertDialog from "../../../../components/Alert";
import ExportData from "../../../../components/ExportData";
import MessageAlert from "../../../../components/MessageAlert";
import domtoimage from 'dom-to-image';
function Assignedrole() {

  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);

  const [overallItems, setOverallItems] = useState([]);

  let exportColumnNames = [
    'Emp Code',
    'Employee Name',
    'Branch',
    'Unit',
    'Floor',
    'Department',
    'Team',
    'Work Mode',
    'Designation',
    'Role'
  ];
  let exportRowValues = [
    'empcode', 'companyname',
    'branch', 'unit',
    'floor', 'department',
    'team', 'workmode', 'designation',
    'roles'
  ];

  const [isHandleChange, setIsHandleChange] = useState(false);
  const [searchedString, setSearchedString] = useState("")

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

  const [employees, setEmployees] = useState([]);
  const {
    isUserRoleAccess,
    isUserRoleCompare,
    isAssignBranch,
    pageName,
    setPageName,
    allTeam,
    allUsersData,
    buttonStyles,
    allUsersLimit
  } = useContext(UserRoleAccessContext);

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
      pagename: String("Assigned Role Update"),
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



  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { auth } = useContext(AuthContext);
  const [empaddform, setEmpaddform] = useState({
    rolename: "Please Select RoleName",
  });
  const [empupdateform, setEmpupdateform] = useState({});
  const [allRoles, setAllRoles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");

  const [roleName, setRoleName] = useState("");
  const [selectedModuleName, setSelectedModuleName] = useState([]);
  const [subModuleOptions, setSubModuleOptions] = useState([]);
  const [selectedSubModuleName, setSelectedSubModuleName] = useState([]);
  const [mainPageoptions, setMainPageoptions] = useState([]);
  const [selectedMainPageName, setSelectedMainPageName] = useState([]);
  const [subPageoptions, setSubPageoptions] = useState([]);
  const [subSubPageoptions, setsubSubPageoptions] = useState([]);
  const [selectedSubPageName, setSelectedSubPageName] = useState([]);
  const [selectedSubSubPageName, setSelectedSubSubPageName] = useState([]);
  const [selectedControlGrouping, setSelectedControlGrouping] = useState([]);
  const [controls, setControls] = useState([]);
  const [controlGroupingValues, setControlGroupingValues] = useState([]);
  const [controlTitleGroupingValues, setControlTitleGroupingValues] = useState(
    []
  );
  const [selectedControls, setSelectedControls] = useState([]);
  const [moduleTitleNames, setModuleTitleNames] = useState([]);
  const [subModuleTitleNames, setSubModuleTitleNames] = useState([]);
  const [mainPageTitleNames, setMainPageTitleNames] = useState([]);
  const [subPageTitleNames, setSubPageTitleNames] = useState([]);
  const [subsubPageTitleNames, setSubSubPageTitleNames] = useState([]);
  const [controlTitleNames, setControlTitleNames] = useState([]);
  const [moduleDbNames, setModuleDbNames] = useState([]);
  const [subModuleDbNames, setSubModuleDbNames] = useState([]);
  const [mainPageDbNames, setMainPageDbNames] = useState([]);
  const [subPageDbNames, setSubPageDbNames] = useState([]);
  const [subSubPageDbNames, setSubSubPageDbNames] = useState([]);
  const [controlDbNames, setControlDbNames] = useState([]);
  const [controlsgroupings, setControlsgroupings] = useState([]);

  // Copied fields Name
  const handleCopy = (message) => {
    NotificationManager.success(`${message} 👍`, "", 2000);
  };

  const module =
    menuItems.length > 0 &&
    menuItems?.map((data) => ({
      ...data,
      label: data.title,
      value: data.title,
    }));

  //setting an module names into array
  const handleModuleChange = (options) => {
    let ans = options.map((a, index) => {
      return a.value;
    });
    setModuleTitleNames(ans);
    let dbNames =
      options.length > 0 &&
      options.map((a, index) => {
        return a.dbname;
      });
    setModuleDbNames(dbNames);
    //subModuleDropDown Names
    let subModu = menuItems.filter((data) => ans.includes(data.title));
    let Submodule = subModu.length > 0 && subModu?.map((item) => item.submenu);
    let singleArray = Submodule.length > 0 && [].concat(...Submodule);
    //Removing Add in the list
    let filteredArray =
      singleArray.length > 0 &&
      singleArray.filter((innerArray) => {
        return !innerArray.title.startsWith("123 ");
      });

    setSubModuleOptions(
      filteredArray.length > 0 &&
      filteredArray?.map((data) => ({
        ...data,
        label: data.title,
        value: data.title,
      }))
    );

    setSelectedModuleName(options);
  };
  //rendering function for options(value field with comma)
  const customValueRendererModule = (valueCate, _categories) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Module";
  };

  //setting an Sub module names into array
  const handleSubModuleChange = (options) => {
    let submodAns = options.map((a, index) => {
      return a.value;
    });
    setSubModuleTitleNames(submodAns);
    let dbNames =
      options.length > 0 &&
      options.map((a, index) => {
        return a.dbname;
      });
    setSubModuleDbNames(dbNames);
    let subModu = subModuleOptions.filter((data) =>
      submodAns.includes(data.title)
    );
    let mainPage =
      subModu.length > 0 &&
      subModu
        .map((data) => data.submenu)
        .filter(Boolean)
        .flat();
    let filteredArray =
      mainPage.length > 0 &&
      mainPage.filter((innerArray) => {
        return !innerArray.title.startsWith("123 ");
      });
    let mainPageDropDown =
      filteredArray?.length > 0
        ? filteredArray?.map((data) => ({
          ...data,
          label: data.title,
          value: data.title,
        }))
        : [];
    setMainPageoptions(mainPageDropDown);
    setSelectedSubModuleName(options);
  };
  //rendering function for options(value field with comma)
  const customValueRendererSubModule = (valueCate, _categories) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Module";
  };

  //setting an Main Page names into array
  const handleMainPageChange = (options) => {
    let mainpageAns = options.map((a, index) => {
      return a.value;
    });
    setMainPageTitleNames(mainpageAns);
    let dbNames =
      options.length > 0 &&
      options.map((a, index) => {
        return a.dbname;
      });
    setMainPageDbNames(dbNames);
    let mainPageFilt = mainPageoptions.filter((data) =>
      mainpageAns.includes(data.title)
    );

    let mainPage =
      mainPageFilt.length > 0 &&
      mainPageFilt
        .map((data) => data.submenu)
        .filter(Boolean)
        .flat();
    //Removing Add in the list
    let filteredArray =
      mainPage.length > 0 &&
      mainPage.filter((innerArray) => {
        return !innerArray.title.startsWith("123 ");
      });
    //options fetching
    let subPageDropDown =
      filteredArray?.length > 0
        ? filteredArray?.map((data) => ({
          ...data,
          label: data.title,
          value: data.title,
        }))
        : [];
    setSubPageoptions(subPageDropDown);
    setSelectedMainPageName(options);
  };
  //rendering function for options(value field with comma)
  const customValueRendererMainPage = (valueCate, _categories) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Main-Page";
  };

  //setting an Main Page names into array
  const handleSubPageChange = (options) => {
    let subPageAns = options.map((a, index) => {
      return a.value;
    });
    setSubPageTitleNames(subPageAns);
    let dbNames =
      options.length > 0 &&
      options.map((a, index) => {
        return a.dbname;
      });
    setSubPageDbNames(dbNames);

    let subPageFilt = subPageoptions.filter((data) =>
      subPageAns.includes(data.title)
    );
    let controlDrop =
      subPageFilt.length > 0 &&
      subPageFilt
        .map((data) => data.submenu)
        .filter(Boolean)
        .flat();
    let filteredArray =
      controlDrop.length > 0 &&
      controlDrop.filter((innerArray) => {
        return !innerArray.title.startsWith("123 ");
      });
    //options fetching
    let subPageDropDown =
      filteredArray?.length > 0
        ? filteredArray?.map((data) => ({
          ...data,
          label: data.title,
          value: data.title,
        }))
        : [];
    setsubSubPageoptions(subPageDropDown);
    setSelectedSubPageName(options);
  };
  //rendering function for options(value field with comma)
  const customValueRendererSubPage = (valueCate, _categories) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Sub-Page";
  };
  //setting an Main Page names into array
  const handleSubSubPageChange = (options) => {
    let subPageAns = options.map((a, index) => {
      return a.value;
    });
    setSubSubPageTitleNames(subPageAns);
    let dbNames =
      options.length > 0 &&
      options.map((a, index) => {
        return a.dbname;
      });
    setSubSubPageDbNames(dbNames);

    let subPageFilt = subPageoptions.filter((data) =>
      subPageAns.includes(data.title)
    );

    let controlDrop =
      subPageFilt.length > 0 &&
      subPageFilt
        .map((data) => data.submenu)
        .filter(Boolean)
        .flat();
    let filteredArray =
      controlDrop.length > 0 &&
      controlDrop.filter((innerArray) => {
        return !innerArray.title.startsWith("123 ");
      });

    setSelectedSubSubPageName(options);
  };
  //rendering function for options(value field with comma)
  const customValueRenderersubSubPage = (valueCate, _categories) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Sub-Page";
  };

  const handleControlGroupingChange = (options) => {
    setSelectedControlGrouping(options);
    setControlGroupingValues(
      options.map((a, index) => {
        return a.value;
      })
    );
    let ans = options.flatMap((a, index) => {
      return a.control;
    });
    setControls(
      ans.map((data) => ({
        ...data,
        label: data,
        value: data,
      }))
    );
  };
  const customValueRendererControlGrouping = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Control Grouping";
  };

  //setting an Main Page names into array
  const handleControlsChange = (options) => {
    let subPageAns = options?.map((a, index) => {
      return a.value;
    });

    let controlsubModule = subModuleOptions
      ?.filter((data) => subModuleDbNames?.includes(data.dbname))
      .filter((data) => !data.submenu)
      .map((data) => data.value.toLowerCase().replace(/\s+/g, ""));
    let controlMainPage = mainPageoptions
      ?.filter((data) => mainPageDbNames?.includes(data.dbname))
      .filter((data) => !data.submenu)
      .map((data) => data.value.toLowerCase().replace(/\s+/g, ""));
    let controlSubPage = subPageoptions
      ?.filter((data) => subPageDbNames?.includes(data.dbname))
      .filter((data) => !data.submenu)
      .map((data) => data.value.toLowerCase().replace(/\s+/g, ""));
    let controlSubSubPage = subSubPageoptions
      ?.filter((data) => subSubPageDbNames?.includes(data.dbname))
      ?.filter((data) => !data.submenu)
      ?.map((data) => data.value.toLowerCase().replace(/\s+/g, ""));

    let overallControlNames = [
      ...controlsubModule,
      ...controlMainPage,
      ...controlSubPage,
      ...controlSubSubPage,
    ];
    let overalTitleNames = [
      ...moduleTitleNames,
      ...subModuleTitleNames,
      ...mainPageTitleNames,
      ...subPageTitleNames,
      ...subsubPageTitleNames,
    ];

    const dotFormat = [];
    for (const wordA of overalTitleNames) {
      for (const wordB of subPageAns) {
        const combinedWord = wordA + "." + wordB;
        dotFormat.push(combinedWord);
      }
    }
    const dotFormatControlGrouping = [];
    for (const wordA of overalTitleNames) {
      for (const wordB of controlGroupingValues) {
        const combinedWord = wordA + "." + wordB;
        dotFormatControlGrouping.push(combinedWord);
      }
    }
    const result = [];
    for (const wordA of overallControlNames) {
      for (const wordB of subPageAns) {
        if (
          wordB === "PDF" ||
          wordB === "Excel" ||
          wordB === "Print" ||
          wordB === "CSV" ||
          wordB === "Image"
        ) {
          const combinedWord = wordB.toLowerCase() + wordA;
          const combinedWordMenu = "menu" + wordA;
          result.push(combinedWordMenu);
          result.push(combinedWord);
        } else if (wordB === "BulkEdit") {
          const combinedWord = "be" + wordA;
          const combinedWordMenu = "menu" + wordA;
          result.push(combinedWordMenu);
          result.push(combinedWord);
        } else if (wordB === "BulkDelete") {
          const combinedWord = "bd" + wordA;
          const combinedWordMenu = "menu" + wordA;
          result.push(combinedWordMenu);
          result.push(combinedWord);
        } else {
          const combinedWord = wordB[0].toLowerCase() + wordA;
          result.push(combinedWord);
          const combinedWordMenu = "menu" + wordA;
          result.push(combinedWordMenu);
        }
      }
    }
    setControlDbNames(result);
    setControlTitleNames(dotFormat);
    setControlTitleGroupingValues(dotFormatControlGrouping);
    setSelectedControls(options);
  };
  //rendering function for options(value field with comma)
  const customValueRendererControls = (valueCate, _categories) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Controls";
  };

  const handleSubmit = () => {
    if (roleName === "" || roleName === undefined) {
      setPopupContentMalert("Please Enter Role Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();


    } else if (moduleTitleNames.length == 0) {
      setPopupContentMalert("Please Choose Module Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (subModuleTitleNames.length < 1) {
      setPopupContentMalert("Please Choose Sub-Module Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();

    } else if (controlGroupingValues?.length < 1) {
      setPopupContentMalert("Please Choose Controls Grouping");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();

    } else if (controlTitleNames.length < 1) {
      setPopupContentMalert("Please Choose Controls");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();


    } else {
      fetchRole();
    }
  };

  const handleClear = () => {
    setRoleName("");
    setSelectedModuleName([]);
    setSelectedSubModuleName([]);
    setSelectedMainPageName([]);
    setSelectedSubPageName([]);
    setSelectedControls([]);
    setSubModuleTitleNames([]);
    setMainPageDbNames([]);
    setSubPageTitleNames([]);
    setControlTitleNames([]);
    setSubSubPageTitleNames([]);
    setSelectedSubSubPageName([]);
    setControlGroupingValues([]);
    setSelectedControlGrouping([]);
    setControls([]);
  };

  //get all Control Groupping.
  const fetchControlGrouping = async () => {
    setPageName(!pageName);
    try {
      let res_vendor = await axios.get(SERVICE.CONTROLSGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setControlsgroupings(
        res_vendor?.data?.controlsgroupings?.map((data) => ({
          ...data,
          label: data.controlname,
          value: data.controlname,
        }))
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchControlGrouping();
  }, []);

  //add function...
  const fetchRole = async () => {
    setPageName(!pageName);
    try {
      let roles = await axios.post(`${SERVICE.ROLE_CREATE}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        name: String(roleName),
        modulename: moduleTitleNames,
        submodulename: subModuleTitleNames,
        mainpagename: mainPageTitleNames,
        subpagename: subPageTitleNames,
        subsubpagename: subsubPageTitleNames,
        controlname: controlTitleNames,
        controlgrouping: controlGroupingValues,
        controlgroupingtitles: controlTitleGroupingValues,
        rolenew: [
          ...moduleDbNames,
          ...subModuleDbNames,
          ...mainPageDbNames,
          ...subPageDbNames,
          ...subSubPageDbNames,
          ...controlDbNames,
        ],
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });

      await fetchAllRoles();
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      handleCloseRole();
      setRoleName("");
      setSelectedModuleName([]);
      setModuleTitleNames([]);
      setSelectedSubModuleName([]);
      setSelectedMainPageName([]);
      setSelectedSubPageName([]);
      setSelectedControls([]);
      setSubModuleTitleNames([]);
      setMainPageDbNames([]);
      setSubPageTitleNames([]);
      setControlTitleNames([]);
      setControlGroupingValues([]);
      setSelectedControlGrouping([]);
      setControls([]);
      setSearchQuery("")
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Assigned Role Update.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  const [isBoarding, setIsBoarding] = useState(false);
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
    empcode: true,
    companyname: true,
    branch: true,
    unit: true,
    floor: true,
    department: true,
    team: true,
    designation: true,
    role: true,
    actions: true,
    workmode: true,
    roles: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  const getCode = async (e) => {
    setEmpaddform({ ...empaddform, rolename: "Please Select RoleName" });
    setSelectedRoles([]);
    setPageName(!pageName);

    try {
      handleClickOpenEdit();
      let res = await axios.get(`${SERVICE.USER_SINGLE_ROLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setEmpupdateform(res?.data?.suser);
      const finalrole = [...new Set(res?.data?.suser?.role)];
      setSelectedRoles(finalrole);
      handleClickOpenEdit();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);
  const [openAddRole, setOpenAddRole] = useState(false);

  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };

  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  const handleCloseRole = () => {
    setOpenAddRole(false);
    setRoleName("");
  };

  const handleClickOpenAddRole = () => {
    setOpenAddRole(true);
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE_ROLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setEmpupdateform(res?.data?.suser);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // Edit model
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    setRoleName("");
  };

  useEffect(() => {
    fetchAllRoles();
  }, []);

  const fetchAllRoles = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.ROLENAME, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const allrolelist = [
        ...res?.data?.roles.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];

      setAllRoles(allrolelist);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
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

  //Boardingupadate updateby edit page...
  let updateby = empupdateform?.updatedby;
  let addedby = empupdateform?.addedby;

  const sendRequestt = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.put(
        `${SERVICE.USER_SINGLE_PWD}/${empupdateform?._id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          role: [...selectedRoles],
          updatedby: [
            // ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );

      handleCloseModEdit();
      await fetchEmployee();

      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const editSubmit = (e) => {
    e.preventDefault();

    if (selectedRoles.length == 0) {
      setPopupContentMalert('Please Select Any One Of Role!');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequestt();
    }
  };

  //------------------------------------------------------

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const [fileFormat, setFormat] = useState("xl");
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = fileFormat === "xl" ? ".xlsx" : ".csv";

  const exportToExcel = (excelData, fileName) => {
    setPageName(!pageName);
    try {
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

      // Check if the browser supports Blob and FileSaver
      if (!Blob || !FileSaver) {
        console.error("Blob or FileSaver not supported");
        return;
      }

      const data = new Blob([excelBuffer], { type: fileType });

      // Check if FileSaver.saveAs is available
      if (!FileSaver.saveAs) {
        console.error("FileSaver.saveAs is not available");
        return;
      }

      FileSaver.saveAs(data, fileName + fileExtension);
    } catch (error) {
      console.error("Error exporting to Excel", error);
    }
  };

  const formatData = (data) => {
    return data.map((item, index) => {
      return {
        Sno: index + 1,
        Empcode: item.empcode || "",
        "Employee Name": item.companyname || "",
        Branch: item.branch || "",
        Unit: item.unit || "",
        Floor: item.floor || "",
        Department: item.department || "",
        Team: item.team || "",
        Designation: item.designation || "",
        Role: checkUpdaterole(item.role) || "",
      };
    });
  };

  const handleExportXL = (isfilter) => {
    const dataToExport = isfilter === "filtered" ? filteredData : employees;

    if (!dataToExport || dataToExport.length === 0) {
      console.error("No data available to export");
      return;
    }

    exportToExcel(formatData(dataToExport), "AssignedRoleList");
    setIsFilterOpen(false);
  };
  //  PDF
  const columns = [
    { title: "Emp Code", field: "empcode" },
    { title: "Employee Name", field: "companyname" },
    { title: "Branch", field: "branch" },
    { title: "Unit", field: "unit" },
    { title: "Floor", field: "floor" },
    { title: "Department", field: "department" },
    { title: "Team", field: "team" },
    { title: "Designation", field: "designation" },
    { title: "Role", field: "roles" },
  ];

  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();

    // Initialize serial number counter
    // Modify columns to include serial number column
    const columnsWithSerial = [
      { title: "S.No", dataKey: "serialNumber" }, // Serial number column
      ...columns.map((col) => ({ title: col.title, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial =
      isfilter === "filtered"
        ? filteredData.map((t, index) => ({
          ...t,
          serialNumber: index + 1,
          roles: checkUpdaterole(t.role),
        }))
        : employees?.map((item, index) => ({
          ...item,
          serialNumber: index + 1,
          roles: checkUpdaterole(item.role),
        }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: 5 },
    });

    doc.save("AssignedRoleList.pdf");
  };

  const checkUpdaterole = (roles) => {
    const finalrole = [...new Set(roles)];
    const result = finalrole.map((role, i) => `${i + 1}. ${role}`).join(", ");
    return result;
  };

  const handleChangeValue = (value) => {
    if (value == "" || value == undefined) {
      setPopupContentMalert('Please Select Any One Of Role!');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (empaddform.rolename == "Please Select RoleName") {
      setPopupContentMalert('Please Select Any One Of Role!');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      if (selectedRoles.includes(value)) {
        setPopupContentMalert('Role Already Exists!');
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else {
        let result = [];
        result.push(value);
        setSelectedRoles([...selectedRoles, ...result]);
        setEmpaddform({ ...empaddform, rolename: "Please Select RoleName" });
      }
    }
  };

  const rowDataRemove = (i) => {
    setSelectedRoles(selectedRoles.filter((value, item) => item !== i));
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Assign Role Update",
    pageStyle: "print",
  });

  //table entries ..,.
  const [items, setItems] = useState([]);

  const addSerialNumber = (datas) => {
    // console.log(datas,"datas")
    const itemsWithSerialNumber = datas?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
    setOverallItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber(employees);
  }, [employees]);

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

  const totalPages = Math.ceil(employees.length / pageSize);

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
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 90,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
      pinned: 'left',
    },
    {
      field: "empcode",
      headerName: "Emp Code",
      flex: 0,
      width: 100,
      hide: !columnVisibility.empcode,
      headerClassName: "bold-header",
      pinned: 'left',
      cellRenderer
        : (params) => (
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
                  handleCopy("Copied Emp Code!");
                }}
                options={{ message: "Copied Emp Code!" }}
                text={params?.data?.empcode}
              >
                <ListItemText primary={params?.data?.empcode} />
              </CopyToClipboard>
            </ListItem>
          </Grid>
        ),
    },
    {
      field: "companyname",
      headerName: "Employee Name",
      flex: 0,
      width: 100,
      hide: !columnVisibility.companyname,
      headerClassName: "bold-header",
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
              text={params?.data?.companyname}
            >
              <ListItemText primary={params?.data?.companyname} />
            </CopyToClipboard>
          </ListItem>
        </Grid>
      ),
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
      field: "floor",
      headerName: "Floor",
      flex: 0,
      width: 100,
      hide: !columnVisibility.floor,
      headerClassName: "bold-header",
    },
    {
      field: "department",
      headerName: "Department",
      flex: 0,
      width: 100,
      hide: !columnVisibility.department,
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
      field: "designation",
      headerName: "Designation",
      flex: 0,
      width: 100,
      hide: !columnVisibility.designation,
      headerClassName: "bold-header",
    },
    {
      field: "roles",
      headerName: "Role",
      flex: 0,
      width: 160,
      hide: !columnVisibility.role,
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
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("eassignedroleupdate") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {

                getCode(params.data.id);
              }}
            >
              <EditIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {/* {isUserRoleCompare?.includes("iassignedroleupdate") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpeninfo();
                getinfoCode(params.data.id);
              }}
            >
              <InfoOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttoninfo} />
            </Button>
          )} */}
        </Grid>
      ),
    },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item?.serialNumber,
      empcode: item.empcode,
      companyname: item.companyname,
      branch: item.branch,
      unit: item.unit,
      workmode: item.workmode,
      floor: item.floor,
      department: item.department,
      team: item.team,
      designation: item.designation,
      role: item.role,
      roles: checkUpdaterole(item.role),
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
    setValueEmp([]); setEmployees([]);
    setFilterState({
      type: "Individual",
      employeestatus: "Please Select Employee Status",
    });
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
    setSearchQuery("")
  };

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
  };

  const customValueRendererTeam = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length
      ? valueTeamCat.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
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

    const availableOptions = allUsersData
      ?.filter(
        (comp) =>
          valueCompanyCat?.includes(comp.company) &&
          valueBranchCat?.includes(comp.branch) &&
          valueUnitCat?.includes(comp.unit) &&
          valueTeamCat?.includes(comp.team)
        // &&
        // comp.workmode !== "Internship"
      )
      ?.map(data => data.companyname.replace(/\s*\.\s*/g, ".").trim())

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
    }
    else {
      setSearchQuery("")
      fetchEmployee();
    }
  };
  const [allAssignCompany, setAllAssignCompany] = useState([]);
  const [allAssignBranch, setAllAssignBranch] = useState([]);
  const [allAssignUnit, setAllAssignUnit] = useState([]);
  const [filterState, setFilterState] = useState({
    type: "Individual",
    employeestatus: "Please Select Employee Status",
  });
  const TypeOptions = [
    { label: "Individual", value: "Individual" },
    { label: "Department", value: "Department" },
    { label: "Company", value: "Company" },
    { label: "Branch", value: "Branch" },
    { label: "Unit", value: "Unit" },
    { label: "Team", value: "Team" },
  ];
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const fetchDepartments = async () => {
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
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  useEffect(() => {
    fetchDepartments();
  }, []);

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

  //get all employees list details
  const fetchEmployee = async () => {
    setIsBoarding(true);
    setPageName(!pageName);
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
          company: 1,
          branch: 1,
          unit: 1,
          team: 1,
          empcode: 1,
          companyname: 1,
          department: 1,
          floor: 1,
          designation: 1,
          role: 1,
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
      setEmployees(response.data.users);
      setIsBoarding(false);
    } catch (err) {
      setIsBoarding(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  //auto select all dropdowns
  const handleAutoSelect = async () => {
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
            selectedTeam?.includes(u.team)
          //    &&
          // comp.workmode !== "Internship"
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
            selectedTeam?.includes(u.team)
          //   &&
          // comp.workmode !== "Internship"
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
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    handleAutoSelect();
  }, [isAssignBranch]);

  return (
    <Box>
      <NotificationContainer />
      {/* ****** Header Content ****** */}
      <Headtitle title={"ASSIGNED ROLE UPDATE"} />
      <PageHeading
        title="Assigned Role"
        modulename="Human Resources"
        submodulename="HR"
        mainpagename="Employee"
        subpagename="Employee Update Details"
        subsubpagename="Assigned Role Update"
      />
      <br />
      {isUserRoleCompare?.includes("lassignedroleupdate") && (
        <>
          <Box sx={userStyle.selectcontainer}>
            <Grid container spacing={2}>
              <>
                <Grid item xs={12}>
                  <Typography sx={userStyle.importheadtext}>Filters</Typography>
                </Grid>
                <br />
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
                    <Typography> Branch</Typography>
                    <MultiSelect
                      options={isAssignBranch
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
                                i.label === item.label && i.value === item.value
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
                    <Typography> Unit</Typography>
                    <MultiSelect
                      options={isAssignBranch
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
                                i.label === item.label && i.value === item.value
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
                    <Typography>Team</Typography>
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
                          options={allUsersData
                            ?.filter(
                              (u) =>
                                valueCompanyCat?.includes(u.company) &&
                                valueBranchCat?.includes(u.branch) &&
                                valueUnitCat?.includes(u.unit) &&
                                valueTeamCat?.includes(u.team)
                              // &&
                              // u.workmode !== "Internship"
                            )
                            .map((u) => ({
                              label: u.companyname,
                              value: u.companyname,
                            }))}
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
              </>
            </Grid>
            <br />
            <br />
            <br />
            <Grid
              container
              spacing={2}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Grid item lg={1} md={2} sm={2} xs={12}>
                <Button

                  variant="contained"
                  onClick={handleFilter}
                  sx={buttonStyles.buttonsubmit}
                >
                  {" "}
                  Filter{" "}
                </Button>
              </Grid>
              <Grid item lg={1} md={2} sm={2} xs={12}>
                <Button onClick={handleClearFilter} sx={buttonStyles.btncancel}>
                  {" "}
                  Clear{" "}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
      <br />
      {isUserRoleCompare?.includes("lassignedroleupdate") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Assigned Role Details List
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
                    <MenuItem value={employees?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes("csvassignedroleupdate") && (
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
                  {isUserRoleCompare?.includes("excelassignedroleupdate") && (
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
                  {isUserRoleCompare?.includes("printassignedroleupdate") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfassignedroleupdate") && (
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
                  {isUserRoleCompare?.includes("imageassignedroleupdate") && (
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
                <AggregatedSearchBar columnDataTable={columnDataTable} setItems={setItems} addSerialNumber={addSerialNumber} setPage={setPage} maindatas={employees} setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                  totalDatas={overallItems}
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
            {isBoarding ? (
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
                  gridRefTable={gridRef}
                  paginated={false}
                  filteredDatas={filteredDatas}
                  handleShowAllColumns={handleShowAllColumns}
                  setFilteredRowData={setFilteredRowData}
                  filteredRowData={filteredRowData}
                  setFilteredChanges={setFilteredChanges}
                  filteredChanges={filteredChanges}
                  gridRefTableImg={gridRefTableImg}
                  itemsList={overallItems}

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

      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
          sx={{ marginTop: '50px' }}
        >
          <Box sx={userStyle.dialogbox}>
            <Box sx={{ width: "700px", heigth: "300px" }}>
              <>
                <Typography sx={userStyle.SubHeaderText}>
                  Edit Assigned Role Information
                </Typography>
                <br />
                <br />
                <Grid container spacing={2}>
                  <Grid item md={6} sm={12} xs={12}>
                    <Typography>
                      Emp Code :<b>{empupdateform.empcode}</b>
                    </Typography>
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <Typography>
                      Company Name : <b>{empupdateform.companyname}</b>
                    </Typography>
                  </Grid>
                </Grid>{" "}
                <br />
                <br />
                <Grid container spacing={2}>
                  <Grid item lg={8} md={8} xs={10} sm={10}>
                    <FormControl size="small" fullWidth>
                      <Typography>Role</Typography>
                      <Selects
                        options={allRoles}
                        styles={colourStyles}
                        value={{
                          label: empaddform.rolename,
                          value: empaddform.rolename,
                        }}
                        onChange={(e) =>
                          setEmpaddform({ ...empaddform, rolename: e.value })
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={0.5} sm={1} xs={1}>
                    <Button
                      variant="contained"
                      style={{
                        height: "30px",
                        minWidth: "20px",
                        padding: "19px 13px",
                        color: "white",
                        marginTop: "22px",
                        background: "rgb(25, 118, 210)",
                      }}
                      onClick={() => {
                        handleChangeValue(empaddform.rolename);
                      }}
                    >
                      ADD
                    </Button>
                  </Grid>
                  <Grid item md={0.5} sm={1} xs={1}>
                    <Button
                      style={{
                        height: "30px",
                        minWidth: "20px",
                        padding: "19px 13px",
                        color: "white",
                        marginTop: "22px",
                        marginLeft: "35px",
                        background: "rgb(25, 118, 210)",
                      }}
                      onClick={() => {
                        handleClickOpenAddRole();
                      }}
                    >
                      <FaPlus style={{ fontSize: "15px" }} />
                    </Button>
                  </Grid>

                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <br />
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
                          {"RoleName"}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {" "}
                          {"Action"}
                        </StyledTableCell>
                      </TableHead>
                      <TableBody>
                        {selectedRoles.map((item, i) => (
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
                              {item}
                            </StyledTableCell>
                            <StyledTableCell
                              sx={{ padding: "5px 10px !important" }}
                            >
                              <Button
                                sx={{ color: "red", fontSize: "20px" }}
                                onClick={(e) => {
                                  rowDataRemove(i);
                                }}
                              >
                                <DeleteOutlineOutlinedIcon
                                  sx={{ fontSize: "20px" }}
                                />
                              </Button>
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Grid>
                </Grid>{" "}
                <br /> <br /> <br />
                <br />
                <br />
                <br />
                <Grid container>
                  <Grid item md={1}></Grid>
                  <Button variant="contained" onClick={editSubmit} sx={buttonStyles.buttonsubmit}>
                    Update
                  </Button>
                  <Grid item md={1}></Grid>
                  <Button onClick={handleCloseModEdit} sx={buttonStyles.btncancel}>
                    Cancel
                  </Button>
                </Grid>
              </>
            </Box>
          </Box>
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

      {/* this is info view details */}

      <Dialog
        open={openInfo}
        onClose={handleCloseinfo}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
      >
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> Assigned Role</Typography>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">addedby</Typography>
                  <br />
                  <Table>
                    <TableHead>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {"SNO"}.
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {" "}
                        {"UserName"}
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
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
                            {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </FormControl>
              </Grid>
              <br />
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Updated by</Typography>
                  <br />
                  <Table>
                    <TableHead>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {"SNO"}.
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {" "}
                        {"UserName"}
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
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
                            {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}
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
              <Button variant="contained" onClick={handleCloseinfo} sx={buttonStyles.btncancel}>
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

      {/* adding role */}

      <Dialog
        open={openAddRole}
        onClose={handleCloseRole}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        sx={{
          overflow: "visible",
          "& .MuiPaper-root": {
            overflow: "visible",
          },
        }}
      >
        <Box>
          <>
            <Box sx={userStyle.dialogbox}>
              <Grid container spacing={2}>
                {/* <Words/> */}
                <Grid item md={12} xs={12}>
                  <Grid item md={12} xs={12} sx={{ display: "flex" }}>
                    <Typography variant="h6">
                      Role Name<b style={{ color: "red" }}>*</b>:
                    </Typography>
                    &emsp;
                    <FormControl>
                      <OutlinedInput
                        type="text"
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={12} xs={12}>
                  <Typography sx={userStyle.HeaderText}>
                    Access Control
                  </Typography>
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Module Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={module}
                      value={selectedModuleName}
                      onChange={(e) => {
                        handleModuleChange(e);
                        setSelectedSubModuleName([]);
                        setSelectedMainPageName([]);
                        setSelectedSubPageName([]);
                        setSelectedControls([]);
                      }}
                      valueRenderer={customValueRendererModule}
                      labelledBy="Please Select Module"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Sub Module Name<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={subModuleOptions}
                      value={selectedSubModuleName}
                      onChange={(e) => {
                        handleSubModuleChange(e);
                        setSelectedMainPageName([]);
                        setSelectedSubPageName([]);
                        setSelectedControls([]);
                      }}
                      valueRenderer={customValueRendererSubModule}
                      labelledBy="Please Select Sub-Module"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Main Page</Typography>
                    <MultiSelect
                      options={mainPageoptions}
                      value={selectedMainPageName}
                      onChange={(e) => {
                        handleMainPageChange(e);
                        setSelectedSubPageName([]);
                        setSelectedControls([]);
                      }}
                      valueRenderer={customValueRendererMainPage}
                      labelledBy="Please Select Main-Page"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Sub Page</Typography>
                    <MultiSelect
                      options={subPageoptions}
                      value={selectedSubPageName}
                      onChange={(e) => {
                        handleSubPageChange(e);
                        setSelectedControls([]);
                      }}
                      valueRenderer={customValueRendererSubPage}
                      labelledBy="Please Select Sub-Page"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Sub Sub-Page</Typography>
                    <MultiSelect
                      options={subSubPageoptions}
                      value={selectedSubSubPageName}
                      onChange={(e) => {
                        handleSubSubPageChange(e);
                        setSelectedControls([]);
                      }}
                      valueRenderer={customValueRenderersubSubPage}
                      labelledBy="Please Select Sub sub-Page"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Controls Grouping</Typography>
                    <MultiSelect
                      options={controlsgroupings}
                      value={selectedControlGrouping}
                      onChange={(e) => {
                        handleControlGroupingChange(e);
                      }}
                      valueRenderer={customValueRendererControlGrouping}
                      labelledBy="Please Select Control Grouping"
                    />
                  </FormControl>
                </Grid>

                <Grid item md={4} sm={12} xs={12} sx={{ display: "flex" }}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Control <b style={{ color: "red" }}>*</b>
                    </Typography>
                    {/* controls */}
                    <MultiSelect
                      options={controls}
                      value={selectedControls}
                      onChange={(e) => {
                        handleControlsChange(e);
                      }}
                      valueRenderer={customValueRendererControls}
                      labelledBy="Please Select Controls"
                    />
                  </FormControl>
                  &ensp;
                </Grid>
                <Grid item md={4} sm={12} xs={12}></Grid>
                <Grid container spacing={2}>
                  <Grid item md={2} sm={12} xs={12}>
                    <Button
                      variant="contained"
                      type="submit"
                      onClick={handleSubmit}
                      sx={{
                        ...buttonStyles.buttonsubmit,
                        minWidth: "40px",
                        height: "37px",
                        marginTop: "28px",
                        padding: "6px 10px",
                      }}
                    >
                      SUBMIT
                    </Button>
                  </Grid>
                  <Grid item md={2} sm={12} xs={12}>
                    <Button
                      sx={[
                        userStyle.btncancel,
                        {
                          minWidth: "40px",
                          height: "37px",
                          marginTop: "28px",
                          padding: "6px 10px",
                        },
                      ]}
                      onClick={handleClear}
                    >
                      Clear
                    </Button>
                  </Grid>
                  <Grid item md={2} sm={12} xs={12}>
                    <Button
                      sx={[
                        buttonStyles.btncancel,
                        {
                          minWidth: "40px",
                          height: "37px",
                          marginTop: "28px",
                          padding: "6px 10px",
                        },
                      ]}
                      onClick={handleCloseRole}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </>
        </Box>
      </Dialog>
      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table aria-label="simple table" id="branch" ref={componentRef}>
          <TableHead sx={{ fontWeight: "600" }}>
            <StyledTableRow>
              <StyledTableCell>SI.NO</StyledTableCell>

              <StyledTableCell>Emp Code</StyledTableCell>
              <StyledTableCell>Employee Name</StyledTableCell>
              <StyledTableCell>Branch</StyledTableCell>
              <StyledTableCell>Unit</StyledTableCell>
              <StyledTableCell>Floor </StyledTableCell>
              <StyledTableCell>Department</StyledTableCell>
              <StyledTableCell>Team</StyledTableCell>
              <StyledTableCell>Designation</StyledTableCell>
              <StyledTableCell>Role</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {rowDataTable &&
              rowDataTable.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{row.empcode} </StyledTableCell>
                  <StyledTableCell>{row.companyname} </StyledTableCell>
                  <StyledTableCell>{row.branch} </StyledTableCell>
                  <StyledTableCell>{row.unit} </StyledTableCell>
                  <StyledTableCell> {row.floor}</StyledTableCell>
                  <StyledTableCell>{row.department}</StyledTableCell>
                  <StyledTableCell>{row.team}</StyledTableCell>
                  <StyledTableCell>{row.designation}</StyledTableCell>
                  <StyledTableCell>{checkUpdaterole(row.role)}</StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
        itemsTwo={employees ?? []}
        filename={"Assigned Role Update"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />

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
    </Box>
  );
}

export default Assignedrole;
