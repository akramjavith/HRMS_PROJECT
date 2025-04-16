import React, { useState, useEffect, useRef, useContext } from "react";
import { MultiSelect } from "react-multi-select-component";
import {
  Box,
  Typography,
  OutlinedInput,
  Select,
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  Popover,
  Checkbox,
  TextField,
  IconButton,
} from "@mui/material";
import { userStyle } from "../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import StyledDataGrid from "../../components/TableStyle";
import Headtitle from "../../components/Headtitle";
import PageHeading from "../../components/PageHeading";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import Selects from "react-select";
import { handleApiError } from "../../components/Errorhandling";
import ExportData from "../../components/ExportData";
import AlertDialog from "../../components/Alert";
import MessageAlert from "../../components/MessageAlert";
import InfoPopup from "../../components/InfoPopup.js";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";

import CircularProgress from "@mui/material/CircularProgress";
import { Backdrop } from "@mui/material";

import { menuItems } from "../../components/menuItemsList";

function ManageTicketGrouping() {
  const LoadingBackdrop = ({ open }) => {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <div className="pulsating-circle">
          <CircularProgress color="inherit" className="loading-spinner" />
        </div>
        <Typography
          variant="h6"
          sx={{ marginLeft: 2, color: "#fff", fontWeight: "bold" }}
        >
          Please Wait...
        </Typography>
      </Backdrop>
    );
  };

  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
    setIsBtn(false);
  };
  const handleClosePopupMalert = () => {
    setOpenPopupMalert(false);
  };
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const handleClickOpenPopup = () => {
    setOpenPopup(true);
    setIsBtn(false);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  let exportColumnNames = [
    "Client Name",
    "Module Name",
    "Sub-Module Name",
    "Main Page",
    "Sub-Page",
    "Sub-Sub-Page",
    "Company",
    "Branch",
    "Unit",
    "Team",
    "Employee",
  ];
  let exportRowValues = [
    "clientname",
    "modulename",
    "submodulename",
    "mainpage",
    "subpage",
    "subsubpage",
    "company",
    "branch",
    "unit",
    "team",
    "employee",
  ];

  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [assetCapacityEdit, setAssetCapacityEdit] = useState([]);
  const [loader, setLoader] = useState(false);
  const [assetCapacityArray, setAssetCapacityArray] = useState([]);
  const [ticketGroupingView, setTicketGroupingView] = useState([]);
  const {
    isUserRoleCompare,
    isUserRoleAccess,
    isAssignBranch,
    allUsersData,
    allTeam,
    pageName,
    setPageName,
  } = useContext(UserRoleAccessContext);

  const { auth } = useContext(AuthContext);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [isBtn, setIsBtn] = useState(false);
  const [openview, setOpenview] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteAssetCapacity, setDeleteAssetCapacity] = useState();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    clientname: true,
    modulename: true,
    submodulename: true,
    mainpage: true,
    subpage: true,
    subsubpage: true,
    company: true,
    branch: true,
    unit: true,
    team: true,
    employee: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  const [clientName, setClientName] = useState("Please Select Client Name");
  const [clientNameEdit, setClientNameEdit] = useState(
    "Please Select Client Name"
  );
  const [clientNameId, setClientNameId] = useState("");
  const [clientNameEditId, setClientNameEditId] = useState("");
  const [clientNameOptions, setClientNameOptions] = useState("");
  const fetchClientName = async () => {
    setPageName(!pageName);
    try {
      let res_client = await axios.get(SERVICE.MANAGECLIENTDETAILS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setClientNameOptions(
        res_client?.data?.clientdetails?.map((item) => ({
          label: item.clientname,
          value: item.clientname,
          apikey: item.apikey,
          url: item.clienturl,
          id: item._id,
        }))
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [clientmanagerRoleDatas, setClientmanagerRoleDatas] = useState([]);
  const [clientmanagerRoleDatasEdit, setClientmanagerRoleDatasEdit] = useState(
    []
  );

  const [moduleOptions, setModuleOptions] = useState([]);
  const [subModuleOptions, setSubModuleOptions] = useState([]);
  const [mainPageoptions, setMainPageoptions] = useState([]);
  const [subPageoptions, setSubPageoptions] = useState([]);
  const [subSubPageoptions, setsubSubPageoptions] = useState([]);

  const [moduleOptionsEdit, setModuleOptionsEdit] = useState([]);
  const [subModuleOptionsEdit, setSubModuleOptionsEdit] = useState([]);
  const [mainPageoptionsEdit, setMainPageoptionsEdit] = useState([]);
  const [subPageoptionsEdit, setSubPageoptionsEdit] = useState([]);
  const [subSubPageoptionsEdit, setsubSubPageoptionsEdit] = useState([]);

  const fetchClientrole = async (options, setManagerData, setmodule) => {
    setPageName(!pageName);
    try {
      let res_clientrole = await axios.get(
        `${options?.url}/api/getclientmanagerrole`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
            "clientsupport-api-keys": options?.apikey,
          },
        }
      );

      let managerRole = res_clientrole?.data?.clientRole;

      setManagerData(managerRole);
      setmodule(
        managerRole?.modulename?.map((data) => ({
          label: data,
          value: data,
        }))
      );

      return managerRole;
    } catch (err) {
      console.log(err);
      setManagerData([]);
      setmodule([]);
      let message = err?.response?.data?.message;
      if (message) {
        setPopupContentMalert(message);
        setPopupSeverityMalert("error");
        handleClickOpenPopupMalert();
      }
      //   handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //Module  Name multiselect
  const [selectedOptionsModuleName, setSelectedOptionsModuleName] = useState(
    []
  );
  let [valueModuleNameCat, setValueModuleNameCat] = useState([]);
  const [
    selectedModuleNameOptionsCateEdit,
    setSelectedModuleNameOptionsCateEdit,
  ] = useState([]);
  const [moduleNameValueCateEdit, setModuleNameValueCateEdit] = useState("");

  const handleModuleNameChange = (options) => {
    let onlyValues = options.map((a, index) => {
      return a.value;
    });

    setValueModuleNameCat(onlyValues);
    setSelectedOptionsModuleName(options);

    const filteredMenuitems = menuItems?.filter((item) =>
      onlyValues?.includes(item.title)
    );

    const submodulerole = clientmanagerRoleDatas?.submodulename?.map(
      (item) => item
    );

    const filteredSubModulename = filteredMenuitems
      ?.flatMap((menu) => menu.submenu || [])
      ?.filter((item) => submodulerole?.includes(item.title))
      ?.map((item) => {
        return {
          label: item.title,
          value: item.title,
        };
      });

    setSubModuleOptions(filteredSubModulename);
    setMainPageoptions([]);
    setSubPageoptions([]);
    setsubSubPageoptions([]);

    setSelectedOptionsSubModuleName([]);
    setValueSubModuleNameCat([]);

    setSelectedOptionsMainPage([]);
    setValueMainPageCat([]);

    setSelectedOptionsSubPage([]);
    setValueSubPageCat([]);

    setSelectedOptionsSubSubPage([]);
    setValueSubSubPageCat([]);
  };

  const customValueRendererModuleName = (valueModuleNameCat, _categoryname) => {
    return valueModuleNameCat?.length
      ? valueModuleNameCat.map(({ label }) => label)?.join(", ")
      : "Please Select Module Name";
  };

  const handleModuleNameChangeEdit = (options, clientmanagerRoleDatasEdit) => {
    let onlyValues = options.map((a, index) => {
      return a.value;
    });

    setModuleNameValueCateEdit(onlyValues);
    setSelectedModuleNameOptionsCateEdit(options);

    const filteredMenuitems = menuItems?.filter((item) =>
      onlyValues?.includes(item.title)
    );

    const submodulerole = clientmanagerRoleDatasEdit?.submodulename?.map(
      (item) => item
    );

    const filteredSubModulename = filteredMenuitems
      ?.flatMap((menu) => menu.submenu || [])
      ?.filter((item) => submodulerole?.includes(item.title))
      ?.map((item) => {
        return {
          label: item.title,
          value: item.title,
        };
      });

    setSubModuleOptionsEdit(filteredSubModulename);
    setMainPageoptionsEdit([]);
    setSubPageoptionsEdit([]);
    setsubSubPageoptionsEdit([]);

    setSubModuleNameValueCateEdit([]);
    setSelectedSubModuleNameOptionsCateEdit([]);

    setMainPageValueCateEdit([]);
    setSelectedMainPageOptionsCateEdit([]);

    setSubPageValueCateEdit([]);
    setSelectedSubPageOptionsCateEdit([]);

    setSubSubPageValueCateEdit([]);
    setSelectedSubSubPageOptionsCateEdit([]);
  };
  const customValueRendererModuleNameEdit = (
    moduleNameValueCateEdit,
    _employeename
  ) => {
    return moduleNameValueCateEdit?.length
      ? moduleNameValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Module Name";
  };

  //Sub - Module  Name multiselect
  const [selectedOptionsSubModuleName, setSelectedOptionsSubModuleName] =
    useState([]);
  let [valueSubModuleNameCat, setValueSubModuleNameCat] = useState([]);
  const [
    selectedSubModuleNameOptionsCateEdit,
    setSelectedSubModuleNameOptionsCateEdit,
  ] = useState([]);
  const [subModuleNameValueCateEdit, setSubModuleNameValueCateEdit] =
    useState("");

  const handleSubModuleNameChange = (options) => {
    let onlyValues = options.map((a, index) => {
      return a.value;
    });

    setValueSubModuleNameCat(onlyValues);
    setSelectedOptionsSubModuleName(options);

    const filteredMenuitemsModuleName = menuItems.filter((item) =>
      valueModuleNameCat?.includes(item.title)
    );

    const filteredMenuitemsSubModuleName = filteredMenuitemsModuleName
      ?.flatMap((menu) => menu.submenu || [])
      ?.filter((item) => onlyValues?.includes(item.title));

    const mainpagerole = clientmanagerRoleDatas?.mainpagename?.map(
      (item) => item
    );

    const filteredSubModulename = filteredMenuitemsSubModuleName
      ?.flatMap((menu) => menu.submenu || [])
      ?.filter((item) => mainpagerole?.includes(item.title))
      ?.map((item) => {
        return {
          label: item.title,
          value: item.title,
        };
      });

    setMainPageoptions(filteredSubModulename);
    setSubPageoptions([]);
    setsubSubPageoptions([]);

    setSelectedOptionsMainPage([]);
    setValueMainPageCat([]);

    setSelectedOptionsSubPage([]);
    setValueSubPageCat([]);

    setSelectedOptionsSubSubPage([]);
    setValueSubSubPageCat([]);
  };

  const customValueRendererSubModuleName = (
    valueSubModuleNameCat,
    _categoryname
  ) => {
    return valueSubModuleNameCat?.length
      ? valueSubModuleNameCat.map(({ label }) => label)?.join(", ")
      : "Please Select Sub Module Name";
  };

  const handleSubModuleNameChangeEdit = (
    moduleNameValueCateEdit,
    options,
    clientmanagerRoleDatasEdit
  ) => {
    let onlyValues = options.map((a, index) => {
      return a.value;
    });

    setSubModuleNameValueCateEdit(onlyValues);
    setSelectedSubModuleNameOptionsCateEdit(options);

    const filteredMenuitemsModuleName = menuItems.filter((item) =>
      moduleNameValueCateEdit?.includes(item.title)
    );

    const filteredMenuitemsSubModuleName = filteredMenuitemsModuleName
      ?.flatMap((menu) => menu.submenu || [])
      ?.filter((item) => onlyValues?.includes(item.title));

    const mainpagerole = clientmanagerRoleDatasEdit?.mainpagename?.map(
      (item) => item
    );

    const filteredSubModulename = filteredMenuitemsSubModuleName
      ?.flatMap((menu) => menu.submenu || [])
      ?.filter((item) => mainpagerole?.includes(item.title))
      ?.map((item) => {
        return {
          label: item.title,
          value: item.title,
        };
      });

    setMainPageoptionsEdit(filteredSubModulename);
    setSubPageoptionsEdit([]);
    setsubSubPageoptionsEdit([]);

    setMainPageValueCateEdit([]);
    setSelectedMainPageOptionsCateEdit([]);

    setSubPageValueCateEdit([]);
    setSelectedSubPageOptionsCateEdit([]);

    setSubSubPageValueCateEdit([]);
    setSelectedSubSubPageOptionsCateEdit([]);
  };
  const customValueRendererSubModuleNameEdit = (
    subModuleNameValueCateEdit,
    _employeename
  ) => {
    return subModuleNameValueCateEdit?.length
      ? subModuleNameValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Sub Module Name";
  };

  //Main Page multiselect
  const [selectedOptionsMainPage, setSelectedOptionsMainPage] = useState([]);
  let [valueMainPageCat, setValueMainPageCat] = useState([]);
  const [selectedMainPageOptionsCateEdit, setSelectedMainPageOptionsCateEdit] =
    useState([]);
  const [mainPageValueCateEdit, setMainPageValueCateEdit] = useState("");

  const handleMainPageChange = (options) => {
    let onlyValues = options.map((a, index) => {
      return a.value;
    });

    setValueMainPageCat(onlyValues);
    setSelectedOptionsMainPage(options);

    const filteredMenuitemsModuleName = menuItems.filter((item) =>
      valueModuleNameCat?.includes(item.title)
    );

    const filteredMenuitemsSubModuleName = filteredMenuitemsModuleName
      ?.flatMap((menu) => menu.submenu || [])
      ?.filter((item) => valueSubModuleNameCat?.includes(item.title));

    const filteredMenuitemsMainPage = filteredMenuitemsSubModuleName
      ?.flatMap((menu) => menu.submenu || [])
      ?.filter((item) => onlyValues?.includes(item.title));

    const subpagerole = clientmanagerRoleDatas?.subpagename?.map(
      (item) => item
    );

    const filteredSubModulename = filteredMenuitemsMainPage
      ?.flatMap((menu) => menu.submenu || [])
      ?.filter((item) => subpagerole?.includes(item.title))
      ?.map((item) => {
        return {
          label: item.title,
          value: item.title,
        };
      });

    setSubPageoptions(filteredSubModulename);
    setsubSubPageoptions([]);

    setSelectedOptionsSubPage([]);
    setValueSubPageCat([]);

    setSelectedOptionsSubSubPage([]);
    setValueSubSubPageCat([]);
  };

  const customValueRendererMainPage = (valueMainPageCat, _categoryname) => {
    return valueMainPageCat?.length
      ? valueMainPageCat.map(({ label }) => label)?.join(", ")
      : "Please Select Main Page";
  };

  const handleMainPageChangeEdit = (
    moduleNameValueCateEdit,
    subModuleNameValueCateEdit,
    options,
    clientmanagerRoleDatasEdit
  ) => {
    let onlyValues = options?.map((a, index) => {
      return a.value;
    });
    setMainPageValueCateEdit(onlyValues);

    setSelectedMainPageOptionsCateEdit(options);

    const filteredMenuitemsModuleName = menuItems.filter((item) =>
      moduleNameValueCateEdit?.includes(item.title)
    );

    const filteredMenuitemsSubModuleName = filteredMenuitemsModuleName
      ?.flatMap((menu) => menu.submenu || [])
      ?.filter((item) => subModuleNameValueCateEdit?.includes(item.title));

    const filteredMenuitemsMainPage = filteredMenuitemsSubModuleName
      ?.flatMap((menu) => menu.submenu || [])
      ?.filter((item) => onlyValues?.includes(item.title));

    const subpagerole = clientmanagerRoleDatasEdit?.subpagename?.map(
      (item) => item
    );

    const filteredSubModulename = filteredMenuitemsMainPage
      ?.flatMap((menu) => menu.submenu || [])
      ?.filter((item) => subpagerole?.includes(item.title))
      ?.map((item) => {
        return {
          label: item.title,
          value: item.title,
        };
      });

    setSubPageoptionsEdit(filteredSubModulename);
    setsubSubPageoptionsEdit([]);

    setSubPageValueCateEdit([]);
    setSelectedSubPageOptionsCateEdit([]);

    setSubSubPageValueCateEdit([]);
    setSelectedSubSubPageOptionsCateEdit([]);
  };
  const customValueRendererMainPageEdit = (
    mainPageValueCateEdit,
    _employeename
  ) => {
    return mainPageValueCateEdit?.length
      ? mainPageValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Main Page";
  };

  //Sub Page multiselect
  const [selectedOptionsSubPage, setSelectedOptionsSubPage] = useState([]);
  let [valueSubPageCat, setValueSubPageCat] = useState([]);
  const [selectedSubPageOptionsCateEdit, setSelectedSubPageOptionsCateEdit] =
    useState([]);
  const [subPageValueCateEdit, setSubPageValueCateEdit] = useState("");

  const handleSubPageChange = (options) => {
    let onlyValues = options.map((a, index) => {
      return a.value;
    });
    setValueSubPageCat(onlyValues);
    setSelectedOptionsSubPage(options);

    const filteredMenuitemsModuleName = menuItems.filter((item) =>
      valueModuleNameCat?.includes(item.title)
    );

    const filteredMenuitemsSubModuleName = filteredMenuitemsModuleName
      ?.flatMap((menu) => menu.submenu || [])
      ?.filter((item) => valueSubModuleNameCat?.includes(item.title));

    const filteredMenuitemsMainPage = filteredMenuitemsSubModuleName
      ?.flatMap((menu) => menu.submenu || [])
      ?.filter((item) => valueMainPageCat?.includes(item.title));

    const filteredMenuitemsSubPage = filteredMenuitemsMainPage
      ?.flatMap((menu) => menu.submenu || [])
      ?.filter((item) => onlyValues?.includes(item.title));

    const subpagerole = clientmanagerRoleDatas?.subsubpagename?.map(
      (item) => item
    );

    const filteredSubSubModulename = filteredMenuitemsSubPage
      ?.flatMap((menu) => menu.submenu || [])
      ?.filter((item) => subpagerole?.includes(item.title))
      ?.map((item) => {
        return {
          label: item.title,
          value: item.title,
        };
      });

    setsubSubPageoptions(filteredSubSubModulename);

    setSelectedOptionsSubSubPage([]);
    setValueSubSubPageCat([]);
  };

  const customValueRendererSubPage = (valueSubPageCat, _categoryname) => {
    return valueSubPageCat?.length
      ? valueSubPageCat.map(({ label }) => label)?.join(", ")
      : "Please Select Sub Page";
  };

  const handleSubPageChangeEdit = (
    moduleNameValueCateEdit,
    subModuleNameValueCateEdit,
    mainPageValueCateEdit,
    options,
    clientmanagerRoleDatasEdit
  ) => {
    let onlyValues = options?.map((a, index) => {
      return a.value;
    });
    setSubPageValueCateEdit(onlyValues);
    setSelectedSubPageOptionsCateEdit(options);

    const filteredMenuitemsModuleName = menuItems.filter((item) =>
      moduleNameValueCateEdit?.includes(item.title)
    );

    const filteredMenuitemsSubModuleName = filteredMenuitemsModuleName
      ?.flatMap((menu) => menu.submenu || [])
      ?.filter((item) => subModuleNameValueCateEdit?.includes(item.title));

    const filteredMenuitemsMainPage = filteredMenuitemsSubModuleName
      ?.flatMap((menu) => menu.submenu || [])
      ?.filter((item) => mainPageValueCateEdit?.includes(item.title));

    const filteredMenuitemsSubPage = filteredMenuitemsMainPage
      ?.flatMap((menu) => menu.submenu || [])
      ?.filter((item) => onlyValues?.includes(item.title));

    const subpagerole = clientmanagerRoleDatasEdit?.subsubpagename?.map(
      (item) => item
    );

    const filteredSubSubModulename = filteredMenuitemsSubPage
      ?.flatMap((menu) => menu.submenu || [])
      ?.filter((item) => subpagerole?.includes(item.title))
      ?.map((item) => {
        return {
          label: item.title,
          value: item.title,
        };
      });

    setsubSubPageoptionsEdit(filteredSubSubModulename);

    setSubSubPageValueCateEdit([]);
    setSelectedSubSubPageOptionsCateEdit([]);
  };
  const customValueRendererSubPageEdit = (
    subPageValueCateEdit,
    _employeename
  ) => {
    return subPageValueCateEdit?.length
      ? subPageValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Sub Page";
  };

  //SubSub Page multiselect
  const [selectedOptionsSubSubPage, setSelectedOptionsSubSubPage] = useState(
    []
  );
  let [valueSubSubPageCat, setValueSubSubPageCat] = useState([]);
  const [
    selectedSubSubPageOptionsCateEdit,
    setSelectedSubSubPageOptionsCateEdit,
  ] = useState([]);
  const [subSubPageValueCateEdit, setSubSubPageValueCateEdit] = useState("");

  const handleSubSubPageChange = (options) => {
    let onlyValues = options.map((a, index) => {
      return a.value;
    });
    setValueSubSubPageCat(onlyValues);
    setSelectedOptionsSubSubPage(options);
  };

  const customValueRendererSubSubPage = (valueSubSubPageCat, _categoryname) => {
    return valueSubSubPageCat?.length
      ? valueSubSubPageCat.map(({ label }) => label)?.join(", ")
      : "Please Select Sub Sub Page";
  };

  const handleSubSubPageChangeEdit = (options) => {
    setSubSubPageValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedSubSubPageOptionsCateEdit(options);
  };
  const customValueRendererSubSubPageEdit = (
    subSubPageValueCateEdit,
    _employeename
  ) => {
    return subSubPageValueCateEdit?.length
      ? subSubPageValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Sub Sub Page";
  };

  //company multiselect
  const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
  let [valueCompanyCat, setValueCompanyCat] = useState([]);
  const [selectedCompanyOptionsCateEdit, setSelectedCompanyOptionsCateEdit] =
    useState([]);
  const [companyValueCateEdit, setCompanyValueCateEdit] = useState("");

  const handleCompanyChange = (options) => {
    setValueCompanyCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCompany(options);

    setValueBranchCat([]);
    setSelectedOptionsBranch([]);

    setSelectedOptionsUnit([]);
    setValueUnitCat([]);

    setValueTeamCat([]);
    setSelectedOptionsTeam([]);

    setSelectedOptionsEmployee([]);
    setValueEmployeeCat([]);
    setEmployeeDbId([]);
  };

  const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
    return valueCompanyCat?.length
      ? valueCompanyCat.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
  };

  const handleCompanyChangeEdit = (options) => {
    setCompanyValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedCompanyOptionsCateEdit(options);

    setBranchValueCateEdit([]);
    setSelectedBranchOptionsCateEdit([]);

    setUnitValueCateEdit([]);
    setSelectedUnitOptionsCateEdit([]);

    setTeamValueCateEdit([]);
    setSelectedTeamOptionsCateEdit([]);

    setEmployeeValueCateEdit([]);
    setSelectedEmployeeOptionsCateEdit([]);
    setEmployeeDbIdEdit([]);
  };
  const customValueRendererCompanyEdit = (
    companyValueCateEdit,
    _employeename
  ) => {
    return companyValueCateEdit?.length
      ? companyValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
  };

  //branch multiselect
  const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
  let [valueBranchCat, setValueBranchCat] = useState([]);
  const [selectedBranchOptionsCateEdit, setSelectedBranchOptionsCateEdit] =
    useState([]);
  const [branchValueCateEdit, setBranchValueCateEdit] = useState("");

  const handleBranchChange = (options) => {
    setValueBranchCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBranch(options);

    setSelectedOptionsUnit([]);
    setValueUnitCat([]);

    setValueTeamCat([]);
    setSelectedOptionsTeam([]);

    setSelectedOptionsEmployee([]);
    setValueEmployeeCat([]);
    setEmployeeDbId([]);
  };

  const customValueRendererBranch = (valueBranchCat, _categoryname) => {
    return valueBranchCat?.length
      ? valueBranchCat.map(({ label }) => label)?.join(", ")
      : "Please Select Branch";
  };

  const handleBranchChangeEdit = (options) => {
    setBranchValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedBranchOptionsCateEdit(options);
    setUnitValueCateEdit([]);
    setSelectedUnitOptionsCateEdit([]);
    setTeamValueCateEdit([]);
    setSelectedTeamOptionsCateEdit([]);
    setEmployeeValueCateEdit([]);
    setSelectedEmployeeOptionsCateEdit([]);
    setEmployeeDbIdEdit([]);
  };
  const customValueRendererBranchEdit = (
    branchValueCateEdit,
    _employeename
  ) => {
    return branchValueCateEdit?.length
      ? branchValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Branch";
  };

  //unit multiselect
  const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
  let [valueUnitCat, setValueUnitCat] = useState([]);
  const [selectedUnitOptionsCateEdit, setSelectedUnitOptionsCateEdit] =
    useState([]);
  const [unitValueCateEdit, setUnitValueCateEdit] = useState("");

  const handleUnitChange = (options) => {
    setValueUnitCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsUnit(options);

    setValueTeamCat([]);
    setSelectedOptionsTeam([]);

    setSelectedOptionsEmployee([]);
    setValueEmployeeCat([]);
    setEmployeeDbId([]);
  };

  const customValueRendererUnit = (valueUnitCat, _categoryname) => {
    return valueUnitCat?.length
      ? valueUnitCat.map(({ label }) => label)?.join(", ")
      : "Please Select Unit";
  };

  const handleUnitChangeEdit = (options) => {
    setUnitValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedUnitOptionsCateEdit(options);
    setTeamValueCateEdit([]);
    setSelectedTeamOptionsCateEdit([]);
    setEmployeeValueCateEdit([]);
    setSelectedEmployeeOptionsCateEdit([]);
    setEmployeeDbIdEdit([]);
  };
  const customValueRendererUnitEdit = (unitValueCateEdit, _employeename) => {
    return unitValueCateEdit?.length
      ? unitValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Unit";
  };

  //team multiselect
  const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
  let [valueTeamCat, setValueTeamCat] = useState([]);
  const [selectedTeamOptionsCateEdit, setSelectedTeamOptionsCateEdit] =
    useState([]);
  const [teamValueCateEdit, setTeamValueCateEdit] = useState("");

  const handleTeamChange = (options) => {
    let team = options.map((a, index) => {
      return a.value;
    });

    setValueTeamCat(team);
    setSelectedOptionsTeam(options);

    setSelectedOptionsEmployee([]);
    setValueEmployeeCat([]);
    setEmployeeDbId([]);
  };

  const customValueRendererTeam = (valueteamCat, _categoryname) => {
    return valueteamCat?.length
      ? valueteamCat.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };

  const handleTeamChangeEdit = (options) => {
    setTeamValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedTeamOptionsCateEdit(options);
    setEmployeeValueCateEdit([]);
    setSelectedEmployeeOptionsCateEdit([]);
    setEmployeeDbIdEdit([]);
  };
  const customValueRendererTeamEdit = (teamValueCateEdit, _employeename) => {
    return teamValueCateEdit?.length
      ? teamValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };

  //Employee multiselect
  const [selectedOptionsEmployee, setSelectedOptionsEmployee] = useState([]);
  let [valueEmployeeCat, setValueEmployeeCat] = useState([]);
  const [selectedEmployeeOptionsCateEdit, setSelectedEmployeeOptionsCateEdit] =
    useState([]);
  const [employeeValueCateEdit, setEmployeeValueCateEdit] = useState([]);
  const [employeeDbId, setEmployeeDbId] = useState([]);
  const [employeeDbIdEdit, setEmployeeDbIdEdit] = useState([]);

  const handleEmployeeChange = (options) => {
    setSelectedOptionsEmployee(options);
    setValueEmployeeCat(options.map((option) => option.value));
    setEmployeeDbId(options.map((option) => option.id));
  };

  const customValueRendererEmployee = (valueemployeeCat, _categoryname) => {
    return valueemployeeCat?.length
      ? valueemployeeCat.map(({ label }) => label)?.join(", ")
      : "Please Select Employee";
  };

  const handleEmployeeChangeEdit = (options) => {
    setSelectedEmployeeOptionsCateEdit(options);
    setEmployeeValueCateEdit(options.map((option) => option.value));
    setEmployeeDbIdEdit(options.map((option) => option.id));
  };

  const customValueRendererEmployeeEdit = (
    employeeValueCateEdit,
    _employeename
  ) => {
    return employeeValueCateEdit?.length
      ? employeeValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Employee";
  };

  //useEffect
  useEffect(() => {
    addSerialNumber();
  }, [assetCapacityArray]);

  useEffect(() => {
    fetchAssetCapacity();
    fetchClientName();
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
  // view model
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
  };
  // info model
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };
  //Delete model
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };
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
  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

  const handleClickOpencheckbox = () => {
    setIsDeleteOpencheckbox(true);
  };
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  };
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
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const getRowClassName = (params) => {
    if (selectedRows?.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  const delAsset = async () => {
    setPageName(!pageName);
    try {
      await axios.delete(
        `${SERVICE.MANAGETICKETGROUPING_SINGLE}/${deleteAssetCapacity}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      await fetchAssetCapacity();
      setLoader(true);
      handleCloseMod();
      setSelectedRows([]);
      setPage(1);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      setLoader(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //add function
  const sendRequest = async () => {
    setPageName(!pageName);
    try {
      let freqCreate = await axios.post(SERVICE.MANAGETICKETGROUPING_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        clientname: String(clientName),
        modulename: valueModuleNameCat,
        submodulename: valueSubModuleNameCat,
        mainpage: valueMainPageCat,
        subpage: valueSubPageCat,
        subsubpage: valueSubSubPageCat,
        company: valueCompanyCat,
        branch: valueBranchCat,
        unit: valueUnitCat,
        team: valueTeamCat,
        employee: valueEmployeeCat,
        employeedbid: employeeDbId,
        clientid: clientNameId,
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchAssetCapacity();
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setIsBtn(false);
    } catch (err) {
      let message = err?.response?.data?.message;
      if (message) {
        setPopupContentMalert(message);
        setPopupSeverityMalert("error");
        handleClickOpenPopupMalert();
      }

      setIsBtn(false);
      //   handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsBtn(true);
    if (clientName === "Please Select Client Name") {
      setPopupContentMalert("Please Select Client  Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (valueModuleNameCat?.length === 0) {
      setPopupContentMalert("Please Select Module Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (valueCompanyCat?.length === 0) {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (valueBranchCat?.length === 0) {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (valueUnitCat?.length === 0) {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (valueTeamCat?.length === 0) {
      setPopupContentMalert("Please Select Team!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (valueEmployeeCat?.length === 0) {
      setPopupContentMalert("Please Select Employee!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };

  const handleclear = (e) => {
    e.preventDefault();

    setValueCompanyCat([]);
    setSelectedOptionsCompany([]);

    setValueBranchCat([]);
    setSelectedOptionsBranch([]);

    setSelectedOptionsUnit([]);
    setValueUnitCat([]);

    setValueTeamCat([]);
    setSelectedOptionsTeam([]);

    setSelectedOptionsEmployee([]);
    setValueEmployeeCat([]);
    setEmployeeDbId([]);

    setValueModuleNameCat([]);
    setSelectedOptionsModuleName([]);

    setSelectedOptionsSubModuleName([]);
    setValueSubModuleNameCat([]);

    setSelectedOptionsMainPage([]);
    setValueMainPageCat([]);

    setSelectedOptionsSubPage([]);
    setValueSubPageCat([]);

    setSelectedOptionsSubSubPage([]);
    setValueSubSubPageCat([]);

    setClientName("Please Select Client Name");
    setClientNameId("");

    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };
  //Edit model...
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
  };

  const setOptions = (valueSetter, optionsSetter, data) => {
    valueSetter(data);
    optionsSetter(data.map((t) => ({ label: t, value: t })));
  };
  const [singleClientDetails, setSingleClientDetails] = useState({});
  const fetchSingleClientDetails = async (id) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.MANAGECLIENTDETAILS_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let singleData = res?.data?.sclientdetails;
      setSingleClientDetails(singleData);

      return singleData;
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const [isLoading, setIsLoading] = useState(false);
  //get single row to edit....
  const getCode = async (e) => {
    setPageName(!pageName);
    try {
      setIsLoading(true);
      let res = await axios.get(`${SERVICE.MANAGETICKETGROUPING_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let singleData = res?.data?.sticketgrouping;
      setAssetCapacityEdit(singleData);
      setClientNameEdit(singleData?.clientname);
      setClientNameEditId(singleData?.clientid);

      let singleClientData = await fetchSingleClientDetails(
        singleData?.clientid
      );

      let singleClientUrlAndKey = {
        url: singleClientData?.clienturl,
        apikey: singleClientData?.apikey,
      };

      let managerData = await fetchClientrole(
        singleClientUrlAndKey,
        setClientmanagerRoleDatasEdit,
        setModuleOptionsEdit
      );

      handleModuleNameChangeEdit(
        singleData?.modulename?.map((data) => ({
          label: data,
          value: data,
        })),
        managerData
      );
      handleSubModuleNameChangeEdit(
        singleData?.modulename,
        singleData?.submodulename?.map((data) => ({
          label: data,
          value: data,
        })),
        managerData
      );
      handleMainPageChangeEdit(
        singleData?.modulename,
        singleData?.submodulename,
        singleData?.mainpage?.map((data) => ({
          label: data,
          value: data,
        })),
        managerData
      );
      handleSubPageChangeEdit(
        singleData?.modulename,
        singleData?.submodulename,
        singleData?.mainpage,
        singleData?.subpage?.map((data) => ({
          label: data,
          value: data,
        })),
        managerData
      );

      setOptions(
        setSubSubPageValueCateEdit,
        setSelectedSubSubPageOptionsCateEdit,
        singleData?.subsubpage
      );

      setOptions(
        setCompanyValueCateEdit,
        setSelectedCompanyOptionsCateEdit,
        singleData?.company
      );
      setOptions(
        setBranchValueCateEdit,
        setSelectedBranchOptionsCateEdit,
        singleData?.branch
      );
      setOptions(
        setUnitValueCateEdit,
        setSelectedUnitOptionsCateEdit,
        singleData?.unit
      );
      setOptions(
        setTeamValueCateEdit,
        setSelectedTeamOptionsCateEdit,
        singleData?.team
      );
      setOptions(
        setEmployeeValueCateEdit,
        setSelectedEmployeeOptionsCateEdit,
        singleData?.employee
      );
      setEmployeeDbIdEdit(singleData?.employeedbid);

      handleClickOpenEdit();
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      let message = err?.response?.data?.message;
      if (message) {
        setPopupContentMalert(message);
        setPopupSeverityMalert("error");
        handleClickOpenPopupMalert();
      }
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.MANAGETICKETGROUPING_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTicketGroupingView(res?.data?.sticketgrouping);
      handleClickOpenview();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.MANAGETICKETGROUPING_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAssetCapacityEdit(res?.data?.sticketgrouping);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //frequency master name updateby edit page...
  let updateby = assetCapacityEdit?.updatedby;
  let addedby = assetCapacityEdit?.addedby;
  let frequencyId = assetCapacityEdit?._id;
  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.put(
        `${SERVICE.MANAGETICKETGROUPING_SINGLE}/${frequencyId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          clientname: String(clientNameEdit),
          modulename: moduleNameValueCateEdit,
          submodulename: subModuleNameValueCateEdit,
          mainpage: mainPageValueCateEdit,
          subpage: subPageValueCateEdit,
          subsubpage: subSubPageValueCateEdit,
          company: companyValueCateEdit,
          branch: branchValueCateEdit,
          unit: unitValueCateEdit,
          team: teamValueCateEdit,
          employee: employeeValueCateEdit,
          employeedbid: employeeDbIdEdit,
          clientid: clientNameEditId,
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      await fetchAssetCapacity();
      handleCloseModEdit();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      console.log(err);
      let message = err?.response?.data?.message;
      if (message) {
        setPopupContentMalert(message);
        setPopupSeverityMalert("error");
        handleClickOpenPopupMalert();
      }
      // handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const editSubmit = (e) => {
    e.preventDefault();

    if (
      clientNameEdit === "Please Select Client Name" ||
      clientNameEdit === "" ||
      clientNameEdit === undefined
    ) {
      setPopupContentMalert("Please Select Client  Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (moduleNameValueCateEdit?.length === 0) {
      setPopupContentMalert("Please Select Module Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (companyValueCateEdit?.length === 0) {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (branchValueCateEdit?.length === 0) {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (unitValueCateEdit?.length === 0) {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (teamValueCateEdit?.length === 0) {
      setPopupContentMalert("Please Select Team!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (employeeValueCateEdit?.length === 0) {
      setPopupContentMalert("Please Select Employee!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendEditRequest();
    }
  };
  //get all frequency master name.
  const fetchAssetCapacity = async () => {
    setPageName(!pageName);
    const accessbranch = isAssignBranch?.map((data) => ({
      branch: data.branch,
      company: data.company,
      unit: data.unit,
    }));
    try {
      let res_freq = await axios.post(
        SERVICE.MANAGETICKETGROUPING,
        {
          assignbranch: accessbranch,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setLoader(true);
      setAssetCapacityArray(res_freq?.data?.ticketgrouping);
    } catch (err) {
      setLoader(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const bulkDeleteFunction = async () => {
    setPageName(!pageName);
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.MANAGETICKETGROUPING_SINGLE}/${item}`, {
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

      await fetchAssetCapacity();

      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "ManageTicketGrouping.png");
        });
      });
    }
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "ManageTicketGrouping",
    pageStyle: "print",
  });

  //serial no for listing items
  const addSerialNumber = () => {
    const itemsWithSerialNumber = assetCapacityArray?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      modulename: item?.modulename?.join(","),
      submodulename: item?.submodulename?.join(","),
      mainpage: item?.mainpage?.join(","),
      subpage: item?.subpage?.join(","),
      subsubpage: item?.subsubpage?.join(","),
      company: item?.company?.join(","),
      branch: item?.branch?.join(","),
      unit: item?.unit?.join(","),
      team: item?.team?.join(","),
      employee: item?.employee?.join(","),
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
      Object.values(item).join(" ").toLowerCase()?.includes(term)
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
          checked={selectedRows?.includes(params.row.id)}
          onChange={() => {
            let updatedSelectedRows;
            if (selectedRows?.includes(params.row.id)) {
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
      field: "clientname",
      headerName: "Client Name",
      flex: 0,
      width: 180,
      hide: !columnVisibility.clientname,
      headerClassName: "bold-header",
    },
    {
      field: "modulename",
      headerName: "Module Name",
      flex: 0,
      width: 180,
      hide: !columnVisibility.modulename,
      headerClassName: "bold-header",
    },
    {
      field: "submodulename",
      headerName: "Sub-Module Name",
      flex: 0,
      width: 180,
      hide: !columnVisibility.submodulename,
      headerClassName: "bold-header",
    },
    {
      field: "mainpage",
      headerName: "Main Page",
      flex: 0,
      width: 180,
      hide: !columnVisibility.mainpage,
      headerClassName: "bold-header",
    },
    {
      field: "subpage",
      headerName: "Sub-Page",
      flex: 0,
      width: 180,
      hide: !columnVisibility.subpage,
      headerClassName: "bold-header",
    },
    {
      field: "subsubpage",
      headerName: "Sub-Sub-Page",
      flex: 0,
      width: 180,
      hide: !columnVisibility.subsubpage,
      headerClassName: "bold-header",
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 180,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 180,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 180,
      hide: !columnVisibility.unit,
      headerClassName: "bold-header",
    },
    {
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 180,
      hide: !columnVisibility.team,
      headerClassName: "bold-header",
    },
    {
      field: "employee",
      headerName: "Employee",
      flex: 0,
      width: 180,
      hide: !columnVisibility.employee,
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
          {isUserRoleCompare?.includes("emanageticketgrouping") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.row.id);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dmanageticketgrouping") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                setDeleteAssetCapacity(params.row.id);
                handleClickOpen();
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vmanageticketgrouping") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("imanageticketgrouping") && (
            <Button
              sx={userStyle.buttonedit}
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

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      clientname: item.clientname,
      modulename: item?.modulename,
      submodulename: item?.submodulename,
      mainpage: item?.mainpage,
      subpage: item?.subpage,
      subsubpage: item?.subsubpage,
      company: item?.company,
      branch: item?.branch,
      unit: item?.unit,
      team: item?.team,
      employee: item?.employee,
    };
  });
  const rowsWithCheckboxes = rowDataTable.map((row) => ({
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
  // Function to filter columns based on search query
  const filteredColumns = columnDataTable.filter((column) =>
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
      <Headtitle title={"MANAGE TICKET GROUPING"} />
      <LoadingBackdrop open={isLoading} />
      <PageHeading
        title="Manage Ticket Grouping"
        modulename="Client Support"
        submodulename="Manage Ticket Grouping"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("amanageticketgrouping") && (
        <>
          <Box sx={userStyle.selectcontainer}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Add Ticket Grouping
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <Typography>From</Typography>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Client Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={clientNameOptions}
                      placeholder="Please Select Client Name"
                      value={{ label: clientName, value: clientName }}
                      onChange={(e) => {
                        setClientName(e.value);
                        setClientNameId(e.id);
                        fetchClientrole(
                          e,
                          setClientmanagerRoleDatas,
                          setModuleOptions
                        );

                        setSubModuleOptions([]);
                        setMainPageoptions([]);
                        setSubPageoptions([]);
                        setsubSubPageoptions([]);

                        setValueModuleNameCat([]);
                        setSelectedOptionsModuleName([]);

                        setSelectedOptionsSubModuleName([]);
                        setValueSubModuleNameCat([]);

                        setSelectedOptionsMainPage([]);
                        setValueMainPageCat([]);

                        setSelectedOptionsSubPage([]);
                        setValueSubPageCat([]);

                        setSelectedOptionsSubSubPage([]);
                        setValueSubSubPageCat([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Module Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      size="small"
                      options={moduleOptions}
                      value={selectedOptionsModuleName}
                      onChange={(e) => {
                        handleModuleNameChange(e);
                      }}
                      valueRenderer={customValueRendererModuleName}
                      labelledBy="Please Select Module Name"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Sub-Module Name</Typography>
                    <MultiSelect
                      size="small"
                      options={subModuleOptions}
                      value={selectedOptionsSubModuleName}
                      onChange={(e) => {
                        handleSubModuleNameChange(e);
                      }}
                      valueRenderer={customValueRendererSubModuleName}
                      labelledBy="Please Select Sub Module Name"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Main Page</Typography>
                    <MultiSelect
                      size="small"
                      options={mainPageoptions}
                      value={selectedOptionsMainPage}
                      onChange={(e) => {
                        handleMainPageChange(e);
                      }}
                      valueRenderer={customValueRendererMainPage}
                      labelledBy="Please Select Main Page"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Sub-Page</Typography>
                    <MultiSelect
                      size="small"
                      options={subPageoptions}
                      value={selectedOptionsSubPage}
                      onChange={(e) => {
                        handleSubPageChange(e);
                      }}
                      valueRenderer={customValueRendererSubPage}
                      labelledBy="Please Select Sub Page"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Sub-Sub-Page</Typography>
                    <MultiSelect
                      size="small"
                      options={subSubPageoptions}
                      value={selectedOptionsSubSubPage}
                      onChange={(e) => {
                        handleSubSubPageChange(e);
                      }}
                      valueRenderer={customValueRendererSubSubPage}
                      labelledBy="Please Select Sub Sub Page"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>To</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={isAssignBranch
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
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch<b style={{ color: "red" }}>*</b>
                    </Typography>
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
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Unit<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={isAssignBranch
                        ?.filter(
                          (comp) =>
                            valueCompanyCat?.includes(comp.company) &&
                            selectedOptionsBranch
                              .map((data) => data.value)
                              ?.includes(comp.branch)
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
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Team<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={allTeam
                        ?.filter(
                          (comp) =>
                            valueCompanyCat?.includes(comp.company) &&
                            selectedOptionsBranch
                              .map((data) => data.value)
                              ?.includes(comp.branch) &&
                            selectedOptionsUnit
                              .map((data) => data.value)
                              ?.includes(comp.unit)
                        )
                        ?.map((data) => ({
                          label: data.teamname,
                          value: data.teamname,
                        }))
                        .filter((item, index, self) => {
                          return (
                            self.findIndex(
                              (i) =>
                                i.label === item.label && i.value === item.value
                            ) === index
                          );
                        })}
                      value={selectedOptionsTeam}
                      onChange={(e) => {
                        handleTeamChange(e);
                      }}
                      valueRenderer={customValueRendererTeam}
                      labelledBy="Please Select Team"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Employee<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={[
                        // { label: "ALL", value: "ALL" },
                        ...allUsersData
                          ?.filter(
                            (comp) =>
                              valueCompanyCat?.includes(comp.company) &&
                              selectedOptionsBranch
                                .map((data) => data.value)
                                ?.includes(comp.branch) &&
                              selectedOptionsUnit
                                .map((data) => data.value)
                                ?.includes(comp.unit) &&
                              selectedOptionsTeam
                                .map((data) => data.value)
                                ?.includes(comp.team)
                          )
                          ?.map((data) => ({
                            label: data.companyname,
                            value: data.companyname,
                            id: data?._id,
                          }))
                          .filter((item, index, self) => {
                            return (
                              self.findIndex(
                                (i) =>
                                  i.label === item.label &&
                                  i.value === item.value
                              ) === index
                            );
                          }),
                      ]}
                      value={selectedOptionsEmployee}
                      onChange={(e) => {
                        handleEmployeeChange(e);
                      }}
                      valueRenderer={customValueRendererEmployee}
                      labelledBy="Please Select Employee"
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <br />
              <Grid container>
                <Grid item md={3} xs={12} sm={6}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={isBtn}
                  >
                    Submit
                  </Button>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <Button sx={userStyle.btncancel} onClick={handleclear}>
                    Clear
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </>
      )}
      <br /> <br />
      {!loader ? (
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
        <>
          {/* ****** Table Start ****** */}
          {isUserRoleCompare?.includes("lmanageticketgrouping") && (
            <Box sx={userStyle.container}>
              {/* ******************************************************EXPORT Buttons****************************************************** */}
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  Ticket Grouping List
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
                      {/* <MenuItem value={assetCapacityArray?.length}>All</MenuItem> */}
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
                      "excelmanageticketgrouping"
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
                    {isUserRoleCompare?.includes("csvmanageticketgrouping") && (
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
                      "printmanageticketgrouping"
                    ) && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("pdfmanageticketgrouping") && (
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
                    <Button
                      sx={userStyle.buttongrp}
                      onClick={handleCaptureImage}
                    >
                      {" "}
                      <ImageIcon
                        sx={{ fontSize: "15px" }}
                      /> &ensp;Image&ensp;{" "}
                    </Button>
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
              &ensp;
              {isUserRoleCompare?.includes("bdmanageticketgrouping") && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleClickOpenalert}
                >
                  Bulk Delete
                </Button>
              )}
              <br />
              <br />
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
      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleCloseview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        fullWidth={true}
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              View Ticket Grouping
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">
                      <b>From</b>
                    </Typography>
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Client Name</Typography>
                    <Typography
                      sx={{
                        overflowWrap: "break-word",
                        wordWrap: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      {ticketGroupingView?.clientname}
                    </Typography>
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Module Name</Typography>
                    <Typography
                      sx={{
                        overflowWrap: "break-word",
                        wordWrap: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      {ticketGroupingView?.modulename?.join(",")}
                    </Typography>
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Sub-Module Name</Typography>
                    <Typography
                      sx={{
                        overflowWrap: "break-word",
                        wordWrap: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      {ticketGroupingView?.submodulename?.join(",")}
                    </Typography>
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Main Page</Typography>
                    <Typography
                      sx={{
                        overflowWrap: "break-word",
                        wordWrap: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      {ticketGroupingView?.mainpage?.join(",")}
                    </Typography>
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Sub-Page</Typography>
                    <Typography
                      sx={{
                        overflowWrap: "break-word",
                        wordWrap: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      {ticketGroupingView?.subpage?.join(",")}
                    </Typography>
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Sub-Sub-Page</Typography>
                    <Typography
                      sx={{
                        overflowWrap: "break-word",
                        wordWrap: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      {ticketGroupingView?.subsubpage?.join(",")}
                    </Typography>
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">
                      <b>To</b>
                    </Typography>
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Company</Typography>
                    <Typography
                      sx={{
                        overflowWrap: "break-word",
                        wordWrap: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      {ticketGroupingView?.company?.join(",")}
                    </Typography>
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Branch</Typography>
                    <Typography
                      sx={{
                        overflowWrap: "break-word",
                        wordWrap: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      {ticketGroupingView?.branch?.join(",")}
                    </Typography>
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Unit</Typography>
                    <Typography
                      sx={{
                        overflowWrap: "break-word",
                        wordWrap: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      {ticketGroupingView?.unit?.join(",")}
                    </Typography>
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Team</Typography>
                    <Typography
                      sx={{
                        overflowWrap: "break-word",
                        wordWrap: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      {ticketGroupingView?.team?.join(",")}
                    </Typography>
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Employee</Typography>
                    <Typography
                      sx={{
                        overflowWrap: "break-word",
                        wordWrap: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      {ticketGroupingView?.employee?.join(",")}
                    </Typography>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCloseview}
                sx={{ marginLeft: "15px" }}
              >
                Back
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>
      {/* Edit DIALOG */}
      <Box>
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
          fullWidth={true}
        >
          <Box sx={{ padding: "20px 50px" }}>
            <>
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}>
                  Edit Ticket Grouping
                </Typography>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>From</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Client Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={clientNameOptions}
                      placeholder="Please Select Client Name"
                      value={{ label: clientNameEdit, value: clientNameEdit }}
                      onChange={(e) => {
                        setClientNameEdit(e.value);
                        setClientNameEditId(e?.id);

                        fetchClientrole(
                          e,
                          setClientmanagerRoleDatasEdit,
                          setModuleOptionsEdit
                        );

                        setModuleNameValueCateEdit([]);
                        setSelectedModuleNameOptionsCateEdit([]);

                        setSubModuleNameValueCateEdit([]);
                        setSelectedSubModuleNameOptionsCateEdit([]);

                        setMainPageValueCateEdit([]);
                        setSelectedMainPageOptionsCateEdit([]);

                        setSubPageValueCateEdit([]);
                        setSelectedSubPageOptionsCateEdit([]);

                        setSubSubPageValueCateEdit([]);
                        setSelectedSubSubPageOptionsCateEdit([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Module Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      size="small"
                      options={moduleOptionsEdit}
                      value={selectedModuleNameOptionsCateEdit}
                      onChange={(e) => {
                        handleModuleNameChangeEdit(
                          e,
                          clientmanagerRoleDatasEdit
                        );
                      }}
                      valueRenderer={customValueRendererModuleNameEdit}
                      labelledBy="Please Select Module Name"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Sub-Module Name</Typography>
                    <MultiSelect
                      size="small"
                      options={subModuleOptionsEdit}
                      value={selectedSubModuleNameOptionsCateEdit}
                      onChange={(e) => {
                        handleSubModuleNameChangeEdit(
                          moduleNameValueCateEdit,
                          e,
                          clientmanagerRoleDatasEdit
                        );
                      }}
                      valueRenderer={customValueRendererSubModuleNameEdit}
                      labelledBy="Please Select Sub Module Name"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Main Page</Typography>
                    <MultiSelect
                      size="small"
                      options={mainPageoptionsEdit}
                      value={selectedMainPageOptionsCateEdit}
                      onChange={(e) => {
                        handleMainPageChangeEdit(
                          moduleNameValueCateEdit,
                          subModuleNameValueCateEdit,
                          e,
                          clientmanagerRoleDatasEdit
                        );
                      }}
                      valueRenderer={customValueRendererMainPageEdit}
                      labelledBy="Please Select Main Page"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Sub-Page</Typography>
                    <MultiSelect
                      size="small"
                      options={subPageoptionsEdit}
                      value={selectedSubPageOptionsCateEdit}
                      onChange={(e) => {
                        handleSubPageChangeEdit(
                          moduleNameValueCateEdit,
                          subModuleNameValueCateEdit,
                          mainPageValueCateEdit,
                          e,
                          clientmanagerRoleDatasEdit
                        );
                      }}
                      valueRenderer={customValueRendererSubPageEdit}
                      labelledBy="Please Select Sub Page"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Sub-Sub-Page</Typography>
                    <MultiSelect
                      size="small"
                      options={subSubPageoptionsEdit}
                      value={selectedSubSubPageOptionsCateEdit}
                      onChange={handleSubSubPageChangeEdit}
                      valueRenderer={customValueRendererSubSubPageEdit}
                      labelledBy="Please Select Sub Sub Page"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>To</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={isAssignBranch
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
                      value={selectedCompanyOptionsCateEdit}
                      onChange={handleCompanyChangeEdit}
                      valueRenderer={customValueRendererCompanyEdit}
                      labelledBy="Please Select Company"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={isAssignBranch
                        ?.filter((comp) =>
                          companyValueCateEdit?.includes(comp.company)
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
                      value={selectedBranchOptionsCateEdit}
                      onChange={handleBranchChangeEdit}
                      valueRenderer={customValueRendererBranchEdit}
                      labelledBy="Please Select Branch"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Unit<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={isAssignBranch
                        ?.filter(
                          (comp) =>
                            companyValueCateEdit?.includes(comp.company) &&
                            selectedBranchOptionsCateEdit
                              .map((data) => data.value)
                              ?.includes(comp.branch)
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
                      value={selectedUnitOptionsCateEdit}
                      onChange={(e) => {
                        handleUnitChangeEdit(e);
                      }}
                      valueRenderer={customValueRendererUnitEdit}
                      labelledBy="Please Select Unit"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Team<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={allTeam
                        ?.filter(
                          (comp) =>
                            companyValueCateEdit?.includes(comp.company) &&
                            selectedBranchOptionsCateEdit
                              .map((data) => data.value)
                              ?.includes(comp.branch) &&
                            selectedUnitOptionsCateEdit
                              .map((data) => data.value)
                              ?.includes(comp.unit)
                        )
                        ?.map((data) => ({
                          label: data.teamname,
                          value: data.teamname,
                        }))
                        .filter((item, index, self) => {
                          return (
                            self.findIndex(
                              (i) =>
                                i.label === item.label && i.value === item.value
                            ) === index
                          );
                        })}
                      value={selectedTeamOptionsCateEdit}
                      onChange={(e) => {
                        handleTeamChangeEdit(e);
                      }}
                      valueRenderer={customValueRendererTeamEdit}
                      labelledBy="Please Select Team"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Employee<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={[
                        // { label: "ALL", value: "ALL" },
                        ...allUsersData
                          ?.filter(
                            (comp) =>
                              companyValueCateEdit?.includes(comp.company) &&
                              selectedBranchOptionsCateEdit
                                .map((data) => data.value)
                                ?.includes(comp.branch) &&
                              selectedUnitOptionsCateEdit
                                .map((data) => data.value)
                                ?.includes(comp.unit) &&
                              selectedTeamOptionsCateEdit
                                .map((data) => data.value)
                                ?.includes(comp.team)
                          )
                          ?.map((data) => ({
                            label: data.companyname,
                            value: data.companyname,
                            id: data._id,
                          }))
                          .filter((item, index, self) => {
                            return (
                              self.findIndex(
                                (i) =>
                                  i.label === item.label &&
                                  i.value === item.value
                              ) === index
                            );
                          }),
                      ]}
                      value={selectedEmployeeOptionsCateEdit}
                      onChange={(e) => {
                        handleEmployeeChangeEdit(e);
                      }}
                      valueRenderer={customValueRendererEmployeeEdit}
                      labelledBy="Please Select Employee"
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <Button variant="contained" onClick={editSubmit}>
                    {" "}
                    Update
                  </Button>
                </Grid>
                <br />
                <Grid item md={6} xs={12} sm={12}>
                  <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
                    {" "}
                    Cancel{" "}
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </Dialog>
      </Box>
      <br />
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
      {/* EXPTERNAL COMPONENTS -------------- START */}
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
        filename={"ManageTicketGrouping"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Ticket Grouping Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delAsset}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={bulkDeleteFunction}
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
      {/* EXPTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}

export default ManageTicketGrouping;
