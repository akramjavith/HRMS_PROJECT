import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ImageIcon from '@mui/icons-material/Image';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Backdrop, Box, Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton, List, ListItem, ListItemText, MenuItem, Popover, Select, TextField, Typography, Table, TableBody, TableHead } from '@mui/material';
import { StyledTableCell, StyledTableRow } from '../../components/Table';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/system';
import axios from 'axios';
import { saveAs } from 'file-saver';
import 'jspdf-autotable';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from 'react-icons/fa';
import { ThreeDots } from 'react-loader-spinner';
import { MultiSelect } from 'react-multi-select-component';
import Resizable from 'react-resizable';
import Selects from 'react-select';
import { useReactToPrint } from 'react-to-print';
import { handleApiError } from '../../components/Errorhandling';
import Headtitle from '../../components/Headtitle';
import { menuItems } from '../../components/menuItemsList';
import PageHeading from '../../components/PageHeading';
import { AuthContext, UserRoleAccessContext } from '../../context/Appcontext';
import { colourStyles, userStyle } from '../../pageStyle';
import { SERVICE } from '../../services/Baseservice';

import AlertDialog from '../../components/Alert';
import { DeleteConfirmation, PleaseSelectRow } from '../../components/DeleteConfirmation.js';
import ExportData from '../../components/ExportData';
import InfoPopup from '../../components/InfoPopup.js';
import MessageAlert from '../../components/MessageAlert';

import domtoimage from 'dom-to-image';
import AggregatedSearchBar from '../../components/AggregatedSearchBar';
import AggridTable from '../../components/AggridTable';

const AssignBranch = () => {
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);

  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState('');
  const [popupSeverityMalert, setPopupSeverityMalert] = useState('');
  const handleClickOpenPopupMalert = () => {
    setIsBtn(false);
    setOpenPopupMalert(true);
  };
  const handleClosePopupMalert = () => {
    setOpenPopupMalert(false);
  };
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState('');
  const [popupSeverity, setPopupSeverity] = useState('');
  const handleClickOpenPopup = () => {
    setOpenPopup(true);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  let exportColumnNames = ['Emp Code', 'Employee Name', 'From Company', 'From Branch', 'From Unit', 'Module', 'Sub Module', 'Main Page', 'Sub Page', 'Sub Sub Page', 'To Company', 'To Branch', 'To Unit'];
  let exportRowValues = ['employeecode', 'employee', 'fromcompany', 'frombranch', 'fromunit', 'modulename', 'submodulename', 'mainpagename', 'subpagename', 'subsubpagename', 'company', 'branch', 'unit'];

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };
  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const [fileFormat, setFormat] = useState('');

  const { auth } = useContext(AuthContext);

  const module =
    menuItems.length > 0 &&
    menuItems
      .filter((data) => data.navmenu === true) // Only include items where navmenu is true
      .map((data) => ({
        ...data,
        label: data.title,
        value: data.title,
      }));

  //postvalues
  const [moduleTitleNames, setModuleTitleNames] = useState([]);
  const [subModuleTitleNames, setSubModuleTitleNames] = useState([]);
  const [mainPageTitleNames, setMainPageTitleNames] = useState([]);
  const [subPageTitleNames, setSubPageTitleNames] = useState([]);
  const [subsubPageTitleNames, setSubSubPageTitleNames] = useState([]);

  const [moduleNameRouteUrl, setModuleNameRouteUrl] = useState([]);
  const [subModuleNameRouteUrl, setSubModuleNameRouteUrl] = useState([]);
  const [mainPageNameRouteUrl, setMainPageNameRouteUrl] = useState([]);
  const [subPageNameRouteUrl, setSubPageNameRouteUrl] = useState([]);
  const [subsubPageNameRouteUrl, setSubSubPageNameRouteUrl] = useState([]);

  //Editpostvalues
  const [moduleTitleNamesEdit, setModuleTitleNamesEdit] = useState([]);
  const [subModuleTitleNamesEdit, setSubModuleTitleNamesEdit] = useState([]);
  const [mainPageTitleNamesEdit, setMainPageTitleNamesEdit] = useState([]);
  const [subPageTitleNamesEdit, setSubPageTitleNamesEdit] = useState([]);
  const [subsubPageTitleNamesEdit, setSubSubPageTitleNamesEdit] = useState([]);

  const [moduleNameRouteUrlEdit, setModuleNameRouteUrlEdit] = useState([]);
  const [subModuleNameRouteUrlEdit, setSubModuleNameRouteUrlEdit] = useState([]);
  const [mainPageNameRouteUrlEdit, setMainPageNameRouteUrlEdit] = useState([]);
  const [subPageNameRouteUrlEdit, setSubPageNameRouteUrlEdit] = useState([]);
  const [subsubPageNameRouteUrlEdit, setSubSubPageNameRouteUrlEdit] = useState([]);

  //fieldvalue
  const [selectedModuleName, setSelectedModuleName] = useState([]);
  const [selectedSubModuleName, setSelectedSubModuleName] = useState([]);
  const [selectedMainPageName, setSelectedMainPageName] = useState([]);
  const [selectedSubPageName, setSelectedSubPageName] = useState([]);
  const [selectedSubSubPageName, setSelectedSubSubPageName] = useState([]);

  //Editfieldvalue
  const [selectedModuleNameEdit, setSelectedModuleNameEdit] = useState([]);
  const [selectedSubModuleNameEdit, setSelectedSubModuleNameEdit] = useState([]);
  const [selectedMainPageNameEdit, setSelectedMainPageNameEdit] = useState([]);
  const [selectedSubPageNameEdit, setSelectedSubPageNameEdit] = useState([]);
  const [selectedSubSubPageNameEdit, setSelectedSubSubPageNameEdit] = useState([]);

  //moduleoptions
  const [rolesNewList, setRolesNewList] = useState([]);
  const [subModuleOptions, setSubModuleOptions] = useState([]);
  const [mainPageoptions, setMainPageoptions] = useState([]);
  const [subPageoptions, setSubPageoptions] = useState([]);
  const [subSubPageoptions, setsubSubPageoptions] = useState([]);

  //moduleoptions
  const [rolesNewListEdit, setRolesNewListEdit] = useState([]);
  const [subModuleOptionsEdit, setSubModuleOptionsEdit] = useState([]);
  const [mainPageoptionsEdit, setMainPageoptionsEdit] = useState([]);
  const [subPageoptionsEdit, setSubPageoptionsEdit] = useState([]);
  const [subSubPageoptionsEdit, setsubSubPageoptionsEdit] = useState([]);

  const customValueRendererModule = (valueCate, _categories) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(', ') : 'Please select Module';
  };

  const customValueRendererSubModule = (valueCate, _categories) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(', ') : 'Please select Sub Module';
  };

  const customValueRendererMainPage = (valueCate, _categories) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(', ') : 'Please select Main-Page';
  };
  const customValueRendererSubPage = (valueCate, _categories) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(', ') : 'Please select Sub-Page';
  };
  const customValueRenderersubSubPage = (valueCate, _categories) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(', ') : 'Please select Sub Sub-Page';
  };

  //Editrendervalue

  const customValueRendererModuleEdit = (valueCate, _categories) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(', ') : 'Please select Module';
  };

  const customValueRendererSubModuleEdit = (valueCate, _categories) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(', ') : 'Please select Sub Module';
  };

  const customValueRendererMainPageEdit = (valueCate, _categories) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(', ') : 'Please select Main-Page';
  };
  const customValueRendererSubPageEdit = (valueCate, _categories) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(', ') : 'Please select Sub-Page';
  };
  const customValueRenderersubSubPageEdit = (valueCate, _categories) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(', ') : 'Please select Sub Sub-Page';
  };

  //setting an module names into array
  const handleModuleChange = (options) => {
    let ans = options.map((a, index) => {
      return a.value;
    });

    let urlvalue = [];

    options.forEach((option) => {
      if (option.submenu.length === 0) {
        urlvalue.push(option.url);
      }
    });

    setModuleNameRouteUrl(urlvalue?.filter(Boolean));

    setModuleTitleNames(ans);
    let dbNames =
      options.length > 0 &&
      options.map((a, index) => {
        return a.dbname;
      });
    // setModuleDbNames(dbNames);
    //subModuleDropDown Names
    let subModu = menuItems.filter((data) => ans.includes(data.title));
    let Submodule = subModu.length > 0 && subModu?.map((item) => item.submenu);
    let singleArray = Submodule.length > 0 && [].concat(...Submodule);
    //Removing Add in the list
    let filteredArray =
      singleArray.length > 0 &&
      singleArray.filter((innerArray) => {
        return !innerArray.title.startsWith('123 ');
      });

    setSubModuleOptions(
      filteredArray.length > 0
        ? filteredArray?.map((data) => ({
          ...data,
          label: data.title,
          value: data.title,
        }))
        : []
    );
    setMainPageoptions([]);
    setsubSubPageoptions([]);
    setSubPageoptions([]);
    setSubModuleNameRouteUrl([]);
    setSelectedModuleName(options);
  };

  const handleSubModuleChange = (options) => {
    let submodAns = options.map((a, index) => {
      return a.value;
    });

    let urlvalue = [];

    options.forEach((option) => {
      // Check if the option itself has a valid URL
      if (option.url !== '') {
        urlvalue.push(option.url);
      }
    });

    setSubModuleNameRouteUrl(urlvalue?.filter(Boolean));

    setSubModuleTitleNames(submodAns);
    let dbNames =
      options.length > 0 &&
      options.map((a, index) => {
        return a.dbname;
      });
    // setSubModuleDbNames(dbNames);
    let subModu = subModuleOptions.filter((data) => submodAns.includes(data.title));
    let mainPage =
      subModu.length > 0 &&
      subModu
        .map((data) => data.submenu)
        .filter(Boolean)
        .flat();
    let filteredArray =
      mainPage.length > 0 &&
      mainPage.filter((innerArray) => {
        return !innerArray.title.startsWith('123 ');
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
    setsubSubPageoptions([]);
    setSubPageoptions([]);
    setSelectedSubModuleName(options);
  };

  const handleMainPageChange = (options) => {
    let mainpageAns = options.map((a, index) => {
      return a.value;
    });

    let urlvalue = [];

    options.forEach((option) => {
      // Check if the option itself has a valid URL
      if (option.url !== '') {
        urlvalue.push(option.url);
      }
    });

    setMainPageNameRouteUrl(urlvalue?.filter(Boolean));

    setMainPageTitleNames(mainpageAns);
    let dbNames =
      options.length > 0 &&
      options.map((a, index) => {
        return a.dbname;
      });
    // setMainPageDbNames(dbNames);
    let mainPageFilt = mainPageoptions.filter((data) => mainpageAns.includes(data.title));

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
        return !innerArray.title.startsWith('123 ');
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
    setsubSubPageoptions([]);
    setSelectedMainPageName(options);
  };

  const handleSubPageChange = (options) => {
    let subPageAns = options.map((a, index) => {
      return a.value;
    });

    let urlvalue = [];

    options.forEach((option) => {
      // Check if the option itself has a valid URL
      if (option.url !== '') {
        urlvalue.push(option.url);
      }
    });

    setSubPageNameRouteUrl(urlvalue?.filter(Boolean));

    setSubPageTitleNames(subPageAns);
    let dbNames =
      options.length > 0 &&
      options.map((a, index) => {
        return a.dbname;
      });
    // setSubPageDbNames(dbNames);

    let subPageFilt = subPageoptions.filter((data) => subPageAns.includes(data.title));
    let controlDrop =
      subPageFilt.length > 0 &&
      subPageFilt
        .map((data) => data.submenu)
        .filter(Boolean)
        .flat();
    let filteredArray =
      controlDrop.length > 0 &&
      controlDrop.filter((innerArray) => {
        return !innerArray.title.startsWith('123 ');
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

  const handleSubSubPageChange = (options) => {
    let subPageAns = options.map((a, index) => {
      return a.value;
    });

    let urlvalue = [];

    options.forEach((option) => {
      // Check if the option itself has a valid URL
      if (option.url !== '') {
        urlvalue.push(option.url);
      }
    });

    setSubSubPageNameRouteUrl(urlvalue?.filter(Boolean));

    setSubSubPageTitleNames(subPageAns);
    let dbNames =
      options.length > 0 &&
      options.map((a, index) => {
        return a.dbname;
      });

    let subPageFilt = subPageoptions.filter((data) => subPageAns.includes(data.title));

    let controlDrop =
      subPageFilt.length > 0 &&
      subPageFilt
        .map((data) => data.submenu)
        .filter(Boolean)
        .flat();

    setSelectedSubSubPageName(options);
  };

  //Edit module names into array
  const handleModuleChangeEdit = (options) => {
    let ans = options.map((a, index) => {
      return a.value;
    });
    setModuleTitleNamesEdit(ans);

    let urlvalue = [];

    options.forEach((option) => {
      if (option.submenu.length === 0) {
        urlvalue.push(option.url);
      }
    });

    setModuleNameRouteUrlEdit(urlvalue?.filter(Boolean));

    let subModu = menuItems.filter((data) => ans.includes(data.title));
    let Submodule = subModu.length > 0 && subModu?.map((item) => item.submenu);
    let singleArray = Submodule.length > 0 && [].concat(...Submodule);
    //Removing Add in the list
    let filteredArray =
      singleArray.length > 0 &&
      singleArray.filter((innerArray) => {
        return !innerArray.title.startsWith('123 ');
      });

    setSubModuleOptionsEdit(
      filteredArray.length > 0
        ? filteredArray?.map((data) => ({
          ...data,
          label: data.title,
          value: data.title,
        }))
        : []
    );

    setMainPageoptionsEdit([]);
    setsubSubPageoptionsEdit([]);
    setSubPageoptionsEdit([]);
    setSelectedModuleNameEdit(options);
  };

  const handleSubModuleChangeEdit = (options) => {
    let submodAns = options.map((a, index) => {
      return a.value;
    });
    setSubModuleTitleNamesEdit(submodAns);

    let urlvalue = [];

    options.forEach((option) => {
      // Check if the option itself has a valid URL
      if (option.url !== '') {
        urlvalue.push(option.url);
      }
    });

    setSubModuleNameRouteUrlEdit(urlvalue?.filter(Boolean));

    let subModu = options.filter((data) => submodAns.includes(data.title));
    let mainPage =
      subModu.length > 0 &&
      subModu
        .map((data) => data.submenu)
        .filter(Boolean)
        .flat();
    let filteredArray =
      mainPage.length > 0 &&
      mainPage.filter((innerArray) => {
        return !innerArray.title.startsWith('123 ');
      });
    let mainPageDropDown =
      filteredArray?.length > 0
        ? filteredArray?.map((data) => ({
          ...data,
          label: data.title,
          value: data.title,
        }))
        : [];

    setMainPageoptionsEdit(mainPageDropDown);
    setsubSubPageoptionsEdit([]);
    setSubPageoptionsEdit([]);
    setSelectedSubModuleNameEdit(options);
  };

  const handleMainPageChangeEdit = (options) => {
    let mainpageAns = options.map((a, index) => {
      return a.value;
    });

    setMainPageTitleNamesEdit(mainpageAns);

    let urlvalue = [];

    options.forEach((option) => {
      // Check if the option itself has a valid URL
      if (option.url !== '') {
        urlvalue.push(option.url);
      }
    });

    setMainPageNameRouteUrlEdit(urlvalue?.filter(Boolean));

    let mainPageFilt = options.filter((data) => mainpageAns.includes(data.title));
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
        return !innerArray.title.startsWith('123 ');
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
    setSubPageoptionsEdit(subPageDropDown);
    setsubSubPageoptionsEdit([]);
    setSelectedMainPageNameEdit(options);
  };

  const handleSubPageChangeEdit = (options) => {
    let subPageAns = options.map((a, index) => {
      return a.value;
    });
    setSubPageTitleNamesEdit(subPageAns);

    let urlvalue = [];

    options.forEach((option) => {
      // Check if the option itself has a valid URL
      if (option.url !== '') {
        urlvalue.push(option.url);
      }
    });

    setSubPageNameRouteUrlEdit(urlvalue?.filter(Boolean));

    let subPageFilt = options.filter((data) => subPageAns.includes(data.title));
    let controlDrop =
      subPageFilt.length > 0 &&
      subPageFilt
        .map((data) => data.submenu)
        .filter(Boolean)
        .flat();
    let filteredArray =
      controlDrop.length > 0 &&
      controlDrop.filter((innerArray) => {
        return !innerArray.title.startsWith('123 ');
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
    setsubSubPageoptionsEdit(subPageDropDown);
    setSelectedSubPageNameEdit(options);
  };

  const handleSubSubPageChangeEdit = (options) => {
    let subPageAns = options.map((a, index) => {
      return a.value;
    });
    setSubSubPageTitleNamesEdit(subPageAns);

    let urlvalue = [];

    options.forEach((option) => {
      // Check if the option itself has a valid URL
      if (option.url !== '') {
        urlvalue.push(option.url);
      }
    });

    setSubSubPageNameRouteUrlEdit(urlvalue?.filter(Boolean));

    let subPageFilt = options.filter((data) => subPageAns.includes(data.title));

    let controlDrop =
      subPageFilt.length > 0 &&
      subPageFilt
        .map((data) => data.submenu)
        .filter(Boolean)
        .flat();

    setSelectedSubSubPageNameEdit(options);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [locationgrouping, setLocationgrouping] = useState({
    company: 'Please Select Company',
    branch: 'Please Select Branch',
    unit: 'Please Select Unit',
    employee: 'Please Select Employee',
    companycode: '',
    unitcode: '',
    branchcode: '',
    branchemail: '',
    branchaddress: '',
    branchstate: '',
    branchcity: '',
    branchcountry: '',
    fromcompany: 'Please Select Company',
    frombranch: 'Please Select Branch',
    fromunit: 'Please Select Unit',
  });
  const [locationgroupingEdit, setLocationgroupingEdit] = useState({
    company: 'Please Select Company',
    branch: 'Please Select Branch',
    unit: 'Please Select Unit',
    employee: 'Please Select Employee',
    companycode: '',
    unitcode: '',
    branchcode: '',
    branchemail: '',
    branchaddress: '',
    branchstate: '',
    branchcity: '',
    branchcountry: '',
    fromcompany: 'Please Select Company',
    frombranch: 'Please Select Branch',
    fromunit: 'Please Select Unit',
  });
  const [employees, setEmployees] = useState([]);
  const [assignBranchEdit, setAssignBranchEdit] = useState({
    company: '',
    branch: '',
    unit: '',
    employee: '',
    fromcompany: 'Please Select Company',
    frombranch: 'Please Select Branch',
    fromunit: 'Please Select Unit',
  });
  const [isAssignBranchForEdit, setIsAssignBranchForEdit] = useState([]);
  const [isBtn, setIsBtn] = useState(false);

  // employee multiselect add
  const [selectedOptionsEmployeeAdd, setSelectedOptionsEmployeeAdd] = useState([]);
  let [valueEmployeeAdd, setValueEmployeeAdd] = useState([]);

  const [assignBranches, setAssignBranches] = useState([]);
  const [assignBranchesforDup, setAssignBranchesforDup] = useState([]);
  const [getrowid, setRowGetid] = useState('');

  const [deleteAssignBranch, setDeleteAssignBranch] = useState({});

  const { isUserRoleCompare } = useContext(UserRoleAccessContext);

  const [isAllAssignBranch, setIsAllAssignBranch] = useState(false);
  const { isUserRoleAccess, isAssignBranch, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);

  const accessbranch = isUserRoleAccess?.role?.includes('Manager')
    ? isAssignBranch?.map((data) => ({
      branch: data.branch,
      company: data.company,
      unit: data.unit,
    }))
    : isAssignBranch
      ?.filter((data) => {
        let fetfinalurl = [];

        if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
          fetfinalurl = data.subsubpagenameurl;
        } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
          fetfinalurl = data.subpagenameurl;
        } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
          fetfinalurl = data.mainpagenameurl;
        } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
          fetfinalurl = data.submodulenameurl;
        } else if (data?.modulenameurl?.length !== 0) {
          fetfinalurl = data.modulenameurl;
        } else {
          fetfinalurl = [];
        }

        const remove = [window.location.pathname?.substring(1), window.location.pathname];
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
      pagename: String('Accessible Company/Branch/Unit'),
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
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);

  const [copiedData, setCopiedData] = useState('');

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  // view model
  const [openview, setOpenview] = useState(false);
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
  };

  const [removeDupVal, setRemoveDupVal] = useState([]);
  const [removeDupValEdit, setRemoveDupValEdit] = useState([]);
  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  const [isErrorOpenEdit, setIsErrorOpenEdit] = useState(false);
  const [showAlertEdit, setShowAlertEdit] = useState();
  const handleClickOpenerrEdit = () => {
    setIsErrorOpenEdit(true);
  };
  const handleCloseerrEdit = () => {
    setIsErrorOpenEdit(false);
  };

  const handleCloseerrSavewitoutdup = async () => {
    removeDupVal.forEach((item) => {
      // Check all conditions regardless of matches
      if (item.field === 'submodulename') {
        setSubModuleTitleNames((prev) => prev.filter((title) => !item.value.includes(title)));
        setSubModuleNameRouteUrl((prev) => prev.filter((title) => !item.url.includes(title)));
        setSelectedSubModuleName((prev) => prev.filter((title) => !item.value.includes(title?.value)));
        setMainPageTitleNames((prev) => prev.filter((title) => !item.value.includes(title)));
        setMainPageNameRouteUrl((prev) => prev.filter((title) => !item.url.includes(title)));
        setSelectedMainPageName((prev) => prev.filter((title) => !item.value.includes(title?.value)));
        setSubPageTitleNames((prev) => prev.filter((title) => !item.value.includes(title)));
        setSubPageNameRouteUrl((prev) => prev.filter((title) => !item.url.includes(title)));
        setSelectedSubPageName((prev) => prev.filter((title) => !item.value.includes(title?.value)));
        setSubSubPageTitleNames((prev) => prev.filter((title) => !item.value.includes(title)));
        setSubSubPageNameRouteUrl((prev) => prev.filter((title) => !item.url.includes(title)));
        setSelectedSubSubPageName((prev) => prev.filter((title) => !item.value.includes(title?.value)));
      }

      if (item.field === 'mainpagename') {
        setSubModuleTitleNames((prev) => prev.filter((title) => !item.value.includes(title)));
        setSubModuleNameRouteUrl((prev) => prev.filter((title) => !item.url.includes(title)));
        setSelectedSubModuleName((prev) => prev.filter((title) => !item.value.includes(title?.value)));
        setMainPageTitleNames((prev) => prev.filter((title) => !item.value.includes(title)));
        setMainPageNameRouteUrl((prev) => prev.filter((title) => !item.url.includes(title)));
        setSelectedMainPageName((prev) => prev.filter((title) => !item.value.includes(title?.value)));
        setSubPageTitleNames((prev) => prev.filter((title) => !item.value.includes(title)));
        setSubPageNameRouteUrl((prev) => prev.filter((title) => !item.url.includes(title)));
        setSelectedSubPageName((prev) => prev.filter((title) => !item.value.includes(title?.value)));
        setSubSubPageTitleNames((prev) => prev.filter((title) => !item.value.includes(title)));
        setSubSubPageNameRouteUrl((prev) => prev.filter((title) => !item.url.includes(title)));
        setSelectedSubSubPageName((prev) => prev.filter((title) => !item.value.includes(title?.value)));
      }

      if (item.field === 'subpagename') {
        setSubModuleTitleNames((prev) => prev.filter((title) => !item.value.includes(title)));
        setSubModuleNameRouteUrl((prev) => prev.filter((title) => !item.url.includes(title)));
        setSelectedSubModuleName((prev) => prev.filter((title) => !item.value.includes(title?.value)));
        setMainPageTitleNames((prev) => prev.filter((title) => !item.value.includes(title)));
        setMainPageNameRouteUrl((prev) => prev.filter((title) => !item.url.includes(title)));
        setSelectedMainPageName((prev) => prev.filter((title) => !item.value.includes(title?.value)));
        setSubPageTitleNames((prev) => prev.filter((title) => !item.value.includes(title)));
        setSubPageNameRouteUrl((prev) => prev.filter((title) => !item.url.includes(title)));
        setSelectedSubPageName((prev) => prev.filter((title) => !item.value.includes(title?.value)));
        setSubSubPageTitleNames((prev) => prev.filter((title) => !item.value.includes(title)));
        setSubSubPageNameRouteUrl((prev) => prev.filter((title) => !item.url.includes(title)));
        setSelectedSubSubPageName((prev) => prev.filter((title) => !item.value.includes(title?.value)));
      }

      if (item.field === 'subsubpagename') {
        setSubModuleTitleNames((prev) => prev.filter((title) => !item.value.includes(title)));
        setSubModuleNameRouteUrl((prev) => prev.filter((title) => !item.url.includes(title)));
        setSelectedSubModuleName((prev) => prev.filter((title) => !item.value.includes(title?.value)));
        setMainPageTitleNames((prev) => prev.filter((title) => !item.value.includes(title)));
        setMainPageNameRouteUrl((prev) => prev.filter((title) => !item.url.includes(title)));
        setSelectedMainPageName((prev) => prev.filter((title) => !item.value.includes(title?.value)));
        setSubPageTitleNames((prev) => prev.filter((title) => !item.value.includes(title)));
        setSubPageNameRouteUrl((prev) => prev.filter((title) => !item.url.includes(title)));
        setSelectedSubPageName((prev) => prev.filter((title) => !item.value.includes(title?.value)));
        setSubSubPageTitleNames((prev) => prev.filter((title) => !item.value.includes(title)));
        setSubSubPageNameRouteUrl((prev) => prev.filter((title) => !item.url.includes(title)));
        setSelectedSubSubPageName((prev) => prev.filter((title) => !item.value.includes(title?.value)));
      }
    });
    setPopupContent('Duplicate Removed Successfully');
    setPopupSeverity('success');
    handleClickOpenPopup();
    setIsErrorOpen(false);
  };

  // const handleCloseerrSavewitoutdup = async () => {
  //   removeDupVal.forEach(item => {
  //     // Check all conditions regardless of matches
  //     if (item.field === "submodulename") {
  //       setSubModuleTitleNames(prev => prev.filter(title => !item.value.includes(title)));
  //       setSubModuleNameRouteUrl(prev => prev.filter(title => !item.url.includes(title)));
  //       setSelectedSubModuleName(prev => prev.filter(title => !item.value.includes(title?.value)));
  //     }

  //     if (item.field === "mainpagename") {
  //       setMainPageTitleNames(prev => prev.filter(title => !item.value.includes(title)));
  //       setMainPageNameRouteUrl(prev => prev.filter(title => !item.url.includes(title)));
  //       setSelectedMainPageName(prev => prev.filter(title => !item.value.includes(title?.value)));
  //     }

  //     if (item.field === "subpagename") {
  //       setSubPageTitleNames(prev => prev.filter(title => !item.value.includes(title)));
  //       setSubPageNameRouteUrl(prev => prev.filter(title => !item.url.includes(title)));
  //       setSelectedSubPageName(prev => prev.filter(title => !item.value.includes(title?.value)));
  //     }

  //     if (item.field === "subsubpagename") {
  //       setSubSubPageTitleNames(prev => prev.filter(title => !item.value.includes(title)));
  //       setSubSubPageNameRouteUrl(prev => prev.filter(title => !item.url.includes(title)));
  //       setSelectedSubSubPageName(prev => prev.filter(title => !item.value.includes(title?.value)));
  //     }
  //   });
  //   setPopupContent("Duplicate Removed Successfully");
  //   setPopupSeverity("success");
  //   handleClickOpenPopup();
  //   setIsErrorOpen(false);
  // };

  // const handleCloseerrSavewitoutdup = async () => {
  //   // Process duplicates removal
  //   const newRemoveDupVal = [...removeDupVal];

  //   const filteredSubModuleTitles = newRemoveDupVal
  //     .filter(item => item.field === "submodulename")
  //     .reduce((acc, item) => {
  //       return acc.filter(title => !item.value.some(val => val === title));
  //     }, [...subModuleTitleNames]);

  //   const filteredModuleRoutes = newRemoveDupVal
  //     .filter(item => item.field === "submodulename")
  //     .reduce((acc, item) => {
  //       return acc.filter(title => !item.url.some(url => url.includes(title)));
  //     }, [...subModuleNameRouteUrl]);

  //   const filteredMainPageTitles = newRemoveDupVal
  //     .filter(item => item.field === "mainpagename")
  //     .reduce((acc, item) => {
  //       return acc.filter(title => !item.value.some(val => val === title));
  //     }, [...mainPageTitleNames]);

  //   const filteredMainPageRoutes = newRemoveDupVal
  //     .filter(item => item.field === "mainpagename")
  //     .reduce((acc, item) => {
  //       return acc.filter(title => !item.url.some(url => url.includes(title)));
  //     }, [...mainPageNameRouteUrl]);

  //   const filteredSubPageTitles = newRemoveDupVal
  //     .filter(item => item.field === "subpagename")
  //     .reduce((acc, item) => {
  //       return acc.filter(title => !item.value.some(val => val === title));
  //     }, [...subPageTitleNames]);

  //   const filteredSubPageRoutes = newRemoveDupVal
  //     .filter(item => item.field === "subpagename")
  //     .reduce((acc, item) => {
  //       return acc.filter(title => !item.url.some(url => url.includes(title)));
  //     }, [...subPageNameRouteUrl]);

  //   const filteredSubSubPageTitles = newRemoveDupVal
  //     .filter(item => item.field === "subsubpagename")
  //     .reduce((acc, item) => {
  //       return acc.filter(title => !item.value.some(val => val === title));
  //     }, [...subsubPageTitleNames]);

  //   const filteredSubSubPageRoutes = newRemoveDupVal
  //     .filter(item => item.field === "subsubpagename")
  //     .reduce((acc, item) => {
  //       return acc.filter(title => !item.url.some(url => url.includes(title)));
  //     }, [...subsubPageNameRouteUrl]);

  //   // Update state
  //   setSubModuleTitleNames(filteredSubModuleTitles);

  //   // First convert filteredSubModuleTitles to a Set for faster lookups
  //   const filteredTitlesSet = new Set(filteredSubModuleTitles?.map(title => title?.toLowerCase()));

  //   setSelectedSubModuleName(
  //     selectedSubModuleName?.filter(item =>
  //       filteredTitlesSet.has(item?.value?.toLowerCase())
  //     )
  //   );

  //   setSelectedMainPageName(
  //     selectedMainPageName?.filter(item =>
  //       filteredTitlesSet.has(item?.value?.toLowerCase())
  //     )
  //   );

  //   setSelectedSubPageName(
  //     selectedSubPageName?.filter(item =>
  //       filteredTitlesSet.has(item?.value?.toLowerCase())
  //     )
  //   );

  //   setSelectedSubSubPageName(
  //     selectedSubSubPageName?.filter(item =>
  //       filteredTitlesSet.has(item?.value?.toLowerCase())
  //     )
  //   );

  //   setSubModuleNameRouteUrl(filteredModuleRoutes);
  //   setMainPageTitleNames(filteredMainPageTitles);
  //   setMainPageNameRouteUrl(filteredMainPageRoutes);
  //   setSubPageTitleNames(filteredSubPageTitles);
  //   setSubPageNameRouteUrl(filteredSubPageRoutes);
  //   setSubSubPageTitleNames(filteredSubSubPageTitles);
  //   setSubSubPageNameRouteUrl(filteredSubSubPageRoutes);

  //   setPopupContent("Duplicate Removed Successfully");
  //   setPopupSeverity("success");
  //   handleClickOpenPopup();
  //   setIsErrorOpen(false);
  // };

  // const handleCloseerrSavewitoutdupEdit = async () => {

  //   // Process duplicates removal
  //   const newRemoveDupValEdit = [...removeDupValEdit];

  //   const filteredSubModuleTitles = newRemoveDupValEdit
  //     .filter(item => item.field === "submodulename")
  //     .reduce((acc, item) => {
  //       return acc.filter(title => !item.value.some(val => val === title));
  //     }, [...subModuleTitleNamesEdit]);

  //   const filteredModuleRoutes = newRemoveDupValEdit
  //     .filter(item => item.field === "submodulename")
  //     .reduce((acc, item) => {
  //       return acc.filter(title => !item.url.some(url => url.includes(title)));
  //     }, [...subModuleNameRouteUrlEdit]);

  //   // (Rest of the filters remain the same)
  //   const filteredMainPageTitles = newRemoveDupValEdit
  //     .filter(item => item.field === "mainpagename")
  //     .reduce((acc, item) => {
  //       return acc.filter(title => !item.url.some(url => url.includes(title)));
  //     }, [...mainPageTitleNamesEdit]);

  //   const filteredMainPageRoutes = newRemoveDupValEdit
  //     .filter(item => item.field === "mainpagename")
  //     .reduce((acc, item) => {
  //       return acc.filter(title => !item.value.some(val => val === title));
  //     }, [...mainPageNameRouteUrlEdit]);

  //   // (Similarly update other filters if needed)
  //   const filteredsubPageTitleNamesEdit = newRemoveDupValEdit
  //     .filter(item => item.field === "subpagename")
  //     .reduce((acc, item) => {
  //       return acc.filter(title => !item.url.some(url => url.includes(title)));
  //     }, [...subPageTitleNamesEdit]);

  //   const filteredsubPageNameRouteUrlEdit = newRemoveDupValEdit
  //     .filter(item => item.field === "subpagename")
  //     .reduce((acc, item) => {
  //       return acc.filter(title => !item.value.some(val => val === title));
  //     }, [...subPageNameRouteUrlEdit]);

  //   // (Similarly update other filters if needed)
  //   const filteredsubsubPageTitleNamesEdit = newRemoveDupValEdit
  //     .filter(item => item.field === "subsubpagename")
  //     .reduce((acc, item) => {
  //       return acc.filter(title => !item.url.some(url => url.includes(title)));
  //     }, [...subsubPageTitleNamesEdit]);

  //   const filteredsubsubPageNameRouteUrlEdit = newRemoveDupValEdit
  //     .filter(item => item.field === "subsubpagename")
  //     .reduce((acc, item) => {
  //       return acc.filter(title => !item.value.some(val => val === title));
  //     }, [...subsubPageNameRouteUrlEdit]);

  //   // Update state
  //   setSubModuleTitleNamesEdit(filteredSubModuleTitles);
  //   // First convert filteredSubModuleTitles to a Set for faster lookups
  //   const filteredTitlesSet = new Set(filteredSubModuleTitles?.map(title => title?.toLowerCase()));

  //   setSelectedSubModuleNameEdit(
  //     selectedSubModuleNameEdit?.filter(item =>
  //       filteredTitlesSet.has(item?.value?.toLowerCase())
  //     )
  //   );

  //   setSelectedMainPageNameEdit(
  //     selectedMainPageNameEdit?.filter(item =>
  //       filteredTitlesSet.has(item?.value?.toLowerCase())
  //     )
  //   );
  //   setSelectedSubPageNameEdit(
  //     selectedSubPageNameEdit?.filter(item =>
  //       filteredTitlesSet.has(item?.value?.toLowerCase())
  //     )
  //   );
  //   setSelectedSubSubPageNameEdit(
  //     selectedSubSubPageNameEdit?.filter(item =>
  //       filteredTitlesSet.has(item?.value?.toLowerCase())
  //     )
  //   );

  //   setSubModuleNameRouteUrlEdit(filteredModuleRoutes);
  //   setMainPageTitleNamesEdit(filteredMainPageTitles);
  //   setMainPageNameRouteUrlEdit(filteredMainPageRoutes);

  //   setSubPageTitleNamesEdit(filteredsubPageTitleNamesEdit)
  //   setSubPageNameRouteUrlEdit(filteredsubPageNameRouteUrlEdit)
  //   setSubSubPageTitleNamesEdit(filteredsubsubPageTitleNamesEdit)
  //   setSubSubPageNameRouteUrlEdit(filteredsubsubPageNameRouteUrlEdit)
  //   setPopupContent("Duplicate Removed Successfully");
  //   setPopupSeverity("success");
  //   handleClickOpenPopup();
  //   setIsErrorOpenEdit(false);
  // };

  const handleCloseerrSavewitoutdupEdit = async () => {
    removeDupValEdit.forEach((item) => {
      // Check all conditions regardless of matches
      if (item.field === 'submodulename') {
        setSubModuleTitleNamesEdit((prev) => prev.filter((title) => !item.value.includes(title)));
        setSubModuleNameRouteUrlEdit((prev) => prev.filter((url) => !item.url.some((u) => url.includes(u))));
        setSelectedSubModuleNameEdit((prev) => prev.filter((sel) => !item.value.includes(sel?.value)));
        setMainPageTitleNamesEdit((prev) => prev.filter((title) => !item.value.includes(title)));
        setMainPageNameRouteUrlEdit((prev) => prev.filter((url) => !item.url.some((u) => url.includes(u))));
        setSelectedMainPageNameEdit((prev) => prev.filter((sel) => !item.value.includes(sel?.value)));
        setSubPageTitleNamesEdit((prev) => prev.filter((title) => !item.value.includes(title)));
        setSubPageNameRouteUrlEdit((prev) => prev.filter((url) => !item.url.some((u) => url.includes(u))));
        setSelectedSubPageNameEdit((prev) => prev.filter((sel) => !item.value.includes(sel?.value)));
        setSubSubPageTitleNamesEdit((prev) => prev.filter((title) => !item.value.includes(title)));
        setSubSubPageNameRouteUrlEdit((prev) => prev.filter((url) => !item.url.some((u) => url.includes(u))));
        setSelectedSubSubPageNameEdit((prev) => prev.filter((sel) => !item.value.includes(sel?.value)));
      }

      if (item.field === 'mainpagename') {
        setSubModuleTitleNamesEdit((prev) => prev.filter((title) => !item.value.includes(title)));
        setSubModuleNameRouteUrlEdit((prev) => prev.filter((url) => !item.url.some((u) => url.includes(u))));
        setSelectedSubModuleNameEdit((prev) => prev.filter((sel) => !item.value.includes(sel?.value)));
        setMainPageTitleNamesEdit((prev) => prev.filter((title) => !item.value.includes(title)));
        setMainPageNameRouteUrlEdit((prev) => prev.filter((url) => !item.url.some((u) => url.includes(u))));
        setSelectedMainPageNameEdit((prev) => prev.filter((sel) => !item.value.includes(sel?.value)));
        setSubPageTitleNamesEdit((prev) => prev.filter((title) => !item.value.includes(title)));
        setSubPageNameRouteUrlEdit((prev) => prev.filter((url) => !item.url.some((u) => url.includes(u))));
        setSelectedSubPageNameEdit((prev) => prev.filter((sel) => !item.value.includes(sel?.value)));
        setSubSubPageTitleNamesEdit((prev) => prev.filter((title) => !item.value.includes(title)));
        setSubSubPageNameRouteUrlEdit((prev) => prev.filter((url) => !item.url.some((u) => url.includes(u))));
        setSelectedSubSubPageNameEdit((prev) => prev.filter((sel) => !item.value.includes(sel?.value)));
      }

      if (item.field === 'subpagename') {
        setSubModuleTitleNamesEdit((prev) => prev.filter((title) => !item.value.includes(title)));
        setSubModuleNameRouteUrlEdit((prev) => prev.filter((url) => !item.url.some((u) => url.includes(u))));
        setSelectedSubModuleNameEdit((prev) => prev.filter((sel) => !item.value.includes(sel?.value)));
        setMainPageTitleNamesEdit((prev) => prev.filter((title) => !item.value.includes(title)));
        setMainPageNameRouteUrlEdit((prev) => prev.filter((url) => !item.url.some((u) => url.includes(u))));
        setSelectedMainPageNameEdit((prev) => prev.filter((sel) => !item.value.includes(sel?.value)));
        setSubPageTitleNamesEdit((prev) => prev.filter((title) => !item.value.includes(title)));
        setSubPageNameRouteUrlEdit((prev) => prev.filter((url) => !item.url.some((u) => url.includes(u))));
        setSelectedSubPageNameEdit((prev) => prev.filter((sel) => !item.value.includes(sel?.value)));
        setSubSubPageTitleNamesEdit((prev) => prev.filter((title) => !item.value.includes(title)));
        setSubSubPageNameRouteUrlEdit((prev) => prev.filter((url) => !item.url.some((u) => url.includes(u))));
        setSelectedSubSubPageNameEdit((prev) => prev.filter((sel) => !item.value.includes(sel?.value)));
      }

      if (item.field === 'subsubpagename') {
        setSubModuleTitleNamesEdit((prev) => prev.filter((title) => !item.value.includes(title)));
        setSubModuleNameRouteUrlEdit((prev) => prev.filter((url) => !item.url.some((u) => url.includes(u))));
        setSelectedSubModuleNameEdit((prev) => prev.filter((sel) => !item.value.includes(sel?.value)));
        setMainPageTitleNamesEdit((prev) => prev.filter((title) => !item.value.includes(title)));
        setMainPageNameRouteUrlEdit((prev) => prev.filter((url) => !item.url.some((u) => url.includes(u))));
        setSelectedMainPageNameEdit((prev) => prev.filter((sel) => !item.value.includes(sel?.value)));
        setSubPageTitleNamesEdit((prev) => prev.filter((title) => !item.value.includes(title)));
        setSubPageNameRouteUrlEdit((prev) => prev.filter((url) => !item.url.some((u) => url.includes(u))));
        setSelectedSubPageNameEdit((prev) => prev.filter((sel) => !item.value.includes(sel?.value)));
        setSubSubPageTitleNamesEdit((prev) => prev.filter((title) => !item.value.includes(title)));
        setSubSubPageNameRouteUrlEdit((prev) => prev.filter((url) => !item.url.some((u) => url.includes(u))));
        setSelectedSubSubPageNameEdit((prev) => prev.filter((sel) => !item.value.includes(sel?.value)));
      }
    });

    setPopupContent('Duplicate Removed Successfully');
    setPopupSeverity('success');
    handleClickOpenPopup();
    setIsErrorOpenEdit(false);
  };

  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showAlertpop, setShowAlertpop] = useState();
  const handleClickOpenerrpop = () => {
    setIsErrorOpenpop(true);
  };
  const handleCloseerrpop = () => {
    setIsErrorOpenpop(false);
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  //Delete model
  const [isDeleteOpen, setisDeleteOpen] = useState(false);
  const handleClickOpendel = () => {
    setisDeleteOpen(true);
  };
  const handleCloseDel = () => {
    setisDeleteOpen(false);
  };

  // Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
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

  // Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);
  const handleClickOpencheckbox = () => {
    setIsDeleteOpencheckbox(true);
  };
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  };

  // Manage Columns
  const [searchQueryManage, setSearchQueryManage] = useState('');
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
    setSearchQueryManage('');
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

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

  const getRowClassName = (params) => {
    if (selectedRows.includes(params.data.id)) {
      return 'custom-id-row'; // This is the custom class for rows with item.tat === 'ago'
    }
    return ''; // Return an empty string for other rows
  };

  // Edit model
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === 'backdropClick') return;
    setIsEditOpen(false);
  };

  // get all employees in the respective company
  const fetchEmployees = async (company, branch, value) => {
    try {
      let resUsers = await axios.get(SERVICE.USERALLLIMIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let result = resUsers?.data?.users.filter((data, index) => {
        if (company === data.company && branch === data.branch && value === data.unit) return data;
      });
      setEmployees(
        result?.map((data) => ({
          label: data.companyname,
          value: data.companyname,
          employee: data.companyname,
          empcode: data.empcode,
        }))
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // employee multi select
  const handleEmployeeChangeAdd = (options) => {
    setValueEmployeeAdd(
      options.map((a, index) => {
        return a.employee + '-' + a.empcode;
      })
    );
    setSelectedOptionsEmployeeAdd(options);
  };

  const customValueRendererEmployeeAdd = (valueEmployeeAdd, _employees) => {
    return valueEmployeeAdd.length ? valueEmployeeAdd.map(({ label }) => label)?.join(', ') : <span style={{ color: 'hsl(0, 0%, 20%)' }}>Select Responsible Person</span>;
  };

  // post call
  const sendRequest = async (data) => {
    setIsBtn(true);
    try {
      let assignbranches = await axios.post(SERVICE.ASSIGNBRANCH_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

        accesspage: 'assignbranch',
        fromcompany: locationgrouping.fromcompany,
        frombranch: locationgrouping.frombranch,
        fromunit: locationgrouping.fromunit,

        modulename: moduleTitleNames,
        submodulename: subModuleTitleNames,
        mainpagename: mainPageTitleNames,
        subpagename: subPageTitleNames,
        subsubpagename: subsubPageTitleNames,
        isupdated: Boolean(true),

        modulenameurl: [...moduleNameRouteUrl, ...subModuleNameRouteUrl, ...mainPageNameRouteUrl, ...subPageNameRouteUrl, ...subsubPageNameRouteUrl],
        submodulenameurl: [...moduleNameRouteUrl, ...subModuleNameRouteUrl, ...mainPageNameRouteUrl, ...subPageNameRouteUrl, ...subsubPageNameRouteUrl],
        mainpagenameurl: [...moduleNameRouteUrl, ...subModuleNameRouteUrl, ...mainPageNameRouteUrl, ...subPageNameRouteUrl, ...subsubPageNameRouteUrl],
        subpagenameurl: [...moduleNameRouteUrl, ...subModuleNameRouteUrl, ...mainPageNameRouteUrl, ...subPageNameRouteUrl, ...subsubPageNameRouteUrl],
        subsubpagenameurl: [...moduleNameRouteUrl, ...subModuleNameRouteUrl, ...mainPageNameRouteUrl, ...subPageNameRouteUrl, ...subsubPageNameRouteUrl],

        modulenameurlforedit: moduleNameRouteUrl,
        submodulenameurlforedit: subModuleNameRouteUrl,
        mainpagenameurlforedit: mainPageNameRouteUrl,
        subpagenameurlforedit: subPageNameRouteUrl,
        subsubpagenameurlforedit: subsubPageNameRouteUrl,

        company: locationgrouping.company,
        branch: locationgrouping.branch,
        unit: locationgrouping.unit,
        companycode: locationgrouping.companycode,
        branchcode: locationgrouping.branchcode,
        branchemail: locationgrouping.branchemail,
        branchaddress: locationgrouping.branchaddress,
        branchstate: locationgrouping.branchstate,
        branchcity: locationgrouping.branchcity,
        branchcountry: locationgrouping.branchcountry,
        branchpincode: locationgrouping.branchpincode,
        unitcode: locationgrouping.unitcode,
        employee: data?.split('-')[0],
        employeecode: data?.split('-')[1],
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchAllAssignBranch();
      setSelectedOptionsEmployeeAdd([]);
      setValueEmployeeAdd([]);
      setPopupContent('Added Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
      setIsBtn(false);
    } catch (err) {
      setIsBtn(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // submit option for saving....
  const handleSubmit = (e) => {
    e.preventDefault();

    const duplicate = assignBranchesforDup?.filter((data) => {
      const isCompanyMatch = data.company === locationgrouping.company;
      const isBranchMatch = data.branch === locationgrouping?.branch;
      const isUnitMatch = data.unit === locationgrouping?.unit;
      const isEmployeeMatch = selectedOptionsEmployeeAdd?.some((item) => item?.value === data?.employee);
      const isFromCompanyMatch = data.fromcompany === locationgrouping.fromcompany;
      const isFromBranchMatch = data.frombranch === locationgrouping?.frombranch;
      const isFromUnitMatch = data.fromunit === locationgrouping?.fromunit;
      const isModuleNameMatch = data.modulename?.length > 0 ? data.modulename.some((item) => moduleTitleNames?.includes(item)) : true;
      const isSubModuleNameMatch = data.submodulename?.length > 0 ? data.submodulename.some((item) => subModuleTitleNames?.includes(item)) : true;
      const isMainPageNameMatch = data.mainpagename?.length > 0 ? data.mainpagename.some((item) => mainPageTitleNames?.includes(item)) : true;
      const isSubPageNameMatch = data.subpagename?.length > 0 ? data.subpagename.some((item) => subPageTitleNames?.includes(item)) : true;
      const isSubSubPageNameMatch = data.subsubpagename?.length > 0 ? data.subsubpagename.some((item) => subsubPageTitleNames?.includes(item)) : true;

      return isCompanyMatch && isBranchMatch && isUnitMatch && isEmployeeMatch && isFromCompanyMatch && isFromBranchMatch && isFromUnitMatch && isModuleNameMatch && isSubModuleNameMatch && isMainPageNameMatch && isSubPageNameMatch && isSubSubPageNameMatch;
    });

    const getDeepestValidValueFromArray = (duplicates) => {
      if (!duplicates || !duplicates.length) return null;

      // First pass: Get all valid values (your existing logic)
      const allValidValues = duplicates
        .map((duplicate) => {
          if (duplicate.subsubpagename?.length > 0) {
            return { field: 'subsubpagename', value: duplicate.subsubpagename, url: duplicate.subpagenameurl };
          }
          if (duplicate.subpagename?.length > 0) {
            return { field: 'subpagename', value: duplicate.subpagename, url: duplicate.subpagenameurl };
          }
          if (duplicate.mainpagename?.length > 0) {
            return { field: 'mainpagename', value: duplicate.mainpagename, url: duplicate.mainpagenameurl };
          }
          if (duplicate.submodulename?.length > 0) {
            return { field: 'submodulename', value: duplicate.submodulename, url: duplicate.submodulenameurl };
          }
          if (duplicate.modulename?.length > 0) {
            return { field: 'modulename', value: duplicate.modulename, url: duplicate.modulenameurl };
          }
          return null;
        })
        .filter(Boolean);

      if (!allValidValues.length) return null;

      // Second pass: Merge objects with the same field
      const mergedValues = allValidValues.reduce((acc, current) => {
        const existing = acc.find((item) => item.field === current.field);
        if (existing) {
          // Merge values (avoid duplicates)
          existing.value = [...new Set([...existing.value, ...current.value])];
        } else {
          acc.push({ ...current });
        }
        return acc;
      }, []);

      return mergedValues;
    };

    // Usage:
    const firstValidValue = getDeepestValidValueFromArray(duplicate);
    setRemoveDupVal(firstValidValue);
    // from
    if (locationgrouping.fromcompany === 'Please Select Company') {
      setPopupContentMalert('Please Select Company!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (locationgrouping.frombranch === 'Please Select Branch') {
      setPopupContentMalert('Please Select Branch!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (locationgrouping.fromunit === 'Please Select Unit') {
      setPopupContentMalert('Please Select Unit!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (selectedModuleName?.length === 0) {
      setPopupContentMalert('Please Select Module!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (selectedSubModuleName?.length === 0) {
      setPopupContentMalert('Please Select Sub Module!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (mainPageoptions?.length > 0 && selectedMainPageName?.length === 0) {
      setPopupContentMalert('Please Select Main Page!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (subPageoptions?.length > 0 && selectedSubPageName?.length === 0) {
      setPopupContentMalert('Please Select Sub Page!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (subSubPageoptions?.length > 0 && selectedSubSubPageName?.length === 0) {
      setPopupContentMalert('Please Select Sub Sub-Page!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    }
    // to
    else if (locationgrouping.company === 'Please Select Company') {
      setPopupContentMalert('Please Select Company!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (locationgrouping.branch === 'Please Select Branch') {
      setPopupContentMalert('Please Select Branch!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (locationgrouping.unit === 'Please Select Unit') {
      setPopupContentMalert('Please Select Unit!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (selectedOptionsEmployeeAdd?.length < 1) {
      setPopupContentMalert('Please Select Responsible Person!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (firstValidValue?.length > 0) {
      setShowAlert(
        <>
          <Typography
            style={{
              fontSize: '20px',
              fontWeight: 900,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            Data Already Exist
            <Button onClick={handleCloseerr}>
              <CloseIcon color="black" />
            </Button>
          </Typography>
          <div>
            <Table style={{ width: '100%' }}>
              <TableHead>
                <StyledTableCell sx={{ padding: '10px 20px !important' }}>{'SNO'}.</StyledTableCell>
                <StyledTableCell sx={{ padding: '10px 20px !important', width: '150px' }}>{'Module'}</StyledTableCell>
                <StyledTableCell sx={{ padding: '10px 20px !important' }}>{'Page'}</StyledTableCell>
              </TableHead>
              <TableBody>
                {firstValidValue.map((item, i) => (
                  <StyledTableRow key={i}>
                    <StyledTableCell sx={{ padding: '10px 20px !important' }}>{i + 1}.</StyledTableCell>
                    <StyledTableCell sx={{ padding: '10px 20px !important', width: '150px' }}>{item.field === 'mainpagename' ? 'Main Page' : item.field === 'subpagename' ? 'Sub Page' : item.field === 'subsubpagename' ? 'Sub Sub-Page' : 'Sub Module'}</StyledTableCell>
                    <StyledTableCell sx={{ padding: '10px 20px !important' }}>{item.value?.toString()}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <br />
        </>
      );
      handleClickOpenerr();
    } else {
      valueEmployeeAdd?.map((data) => {
        sendRequest(data);
      });
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setLocationgrouping({
      company: 'Please Select Company',
      branch: 'Please Select Branch',
      unit: 'Please Select Unit',
      companycode: '',
      unitcode: '',
      branchcode: '',
      branchemail: '',
      branchaddress: '',
      branchstate: '',
      branchcity: '',
      branchcountry: '',
      fromcompany: 'Please Select Company',
      frombranch: 'Please Select Branch',
      fromunit: 'Please Select Unit',
    });
    setSelectedModuleName([]);
    setSelectedSubModuleName([]);
    setSelectedMainPageName([]);
    setSelectedSubPageName([]);
    setSelectedSubSubPageName([]);
    setModuleNameRouteUrl([]);
    setSubModuleNameRouteUrl([]);
    setMainPageNameRouteUrl([]);
    setSubPageNameRouteUrl([]);
    setSubSubPageNameRouteUrl([]);
    setModuleTitleNames([]);
    setSubModuleTitleNames([]);
    setMainPageTitleNames([]);
    setSubPageTitleNames([]);
    setSubSubPageTitleNames([]);
    setEmployees([]);
    setValueEmployeeAdd([]);
    setSelectedOptionsEmployeeAdd([]);
    setSubModuleOptions([]);
    setMainPageoptions([]);
    setSubPageoptions([]);
    setsubSubPageoptions([]);
    setPopupContent('Cleared Successfully');
    setPopupSeverity('success');
    handleClickOpenPopup();
  };

  const fetchNewRoleList = async () => {
    setPageName(!pageName);
    try {
      let role_new = await axios.get(SERVICE.ROLE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const allRoles = role_new?.data?.roles.filter((item) => isUserRoleAccess?.role?.includes(item?.name));

      let mergedObject = {};
      allRoles.forEach((obj) => {
        const keysToInclude = ['modulename', 'submodulename', 'mainpagename', 'subpagename', 'subsubpagename'];

        keysToInclude.forEach((key) => {
          if (!mergedObject[key]) {
            mergedObject[key] = [];
          }

          if (Array.isArray(obj[key])) {
            obj[key].forEach((item) => {
              if (!mergedObject[key].includes(item)) {
                mergedObject[key].push(item);
              }
            });
          } else {
            if (!mergedObject[key].includes(obj[key])) {
              mergedObject[key].push(obj[key]);
            }
          }
        });
      });
      setRolesNewList([mergedObject]);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchNewRoleList();
  }, []);

  // edit
  const getCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.ASSIGNBRANCH_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setLocationgroupingEdit(res?.data?.sassignbranch);

      fetchEmployees(res?.data?.sassignbranch?.company, res?.data?.sassignbranch?.branch, res?.data?.sassignbranch?.unit);
      setIsAssignBranchForEdit(assignBranchesforDup.filter((item) => item._id !== e));
      setRowGetid(res?.data?.sassignbranch);
      const moduleName = module?.filter((item) => res?.data?.sassignbranch?.modulename?.includes(item?.title));

      const submoduleName = module
        .flatMap((item) => item.submenu.filter((subItem) => res?.data?.sassignbranch?.submodulename?.includes(subItem?.title)))
        ?.map((submod) => ({
          ...submod,
          value: submod?.title,
          label: submod?.title,
        }));

      const flattenSubmenu = (submenuArray) => {
        return submenuArray.flatMap((subItem) => {
          if (subItem.submenu) {
            // Recursively flatten nested submenu arrays
            return [subItem, ...flattenSubmenu(subItem.submenu)];
          }
          return subItem;
        });
      };

      // const mainPageName = module
      //   .flatMap((item) => flattenSubmenu(item.submenu)) // Flatten all levels of submenu
      //   .filter((subItem) =>
      //     res?.data?.sassignbranch?.mainpagename?.includes(subItem?.title)
      //   )?.map((submod) => ({
      //     ...submod,
      //     value: submod?.title,
      //     label: submod?.title,
      //   }))
      const mainPageName = module
        .flatMap((item) => flattenSubmenu(item.submenu))
        .filter((subItem) => res?.data?.sassignbranch?.mainpagename?.includes(subItem?.title))
        ?.map((submod) => ({
          ...submod,
          value: submod?.title,
          label: submod?.title,
        }))
        // Remove duplicates by title
        .filter((item, index, self) => index === self.findIndex((t) => t.title === item.title));

      const subPageName = module
        .flatMap((item) => flattenSubmenu(item.submenu)) // Flatten all levels of submenu
        .filter((subItem) => res?.data?.sassignbranch?.subpagename?.includes(subItem?.title))
        ?.map((submod) => ({
          ...submod,
          value: submod?.title,
          label: submod?.title,
        }))
        .filter((item, index, self) => index === self.findIndex((t) => t.title === item.title));

      const subsubPageName = module
        .flatMap((item) => flattenSubmenu(item.submenu)) // Flatten all levels of submenu
        .filter((subItem) => res?.data?.sassignbranch?.subsubpagename?.includes(subItem?.title))
        ?.map((submod) => ({
          ...submod,
          value: submod?.title,
          label: submod?.title,
        }))
        .filter((item, index, self) => index === self.findIndex((t) => t.title === item.title));

      setSelectedModuleNameEdit(moduleName);
      setSelectedSubModuleNameEdit(submoduleName);
      setSelectedMainPageNameEdit(mainPageName);
      setSelectedSubPageNameEdit(subPageName);
      setSelectedSubSubPageNameEdit(subsubPageName);

      handleModuleChangeEdit(moduleName);
      handleSubModuleChangeEdit(submoduleName);
      handleMainPageChangeEdit(mainPageName);
      handleSubPageChangeEdit(subPageName);
      handleSubSubPageChangeEdit(subsubPageName);

      setModuleTitleNamesEdit(res?.data?.sassignbranch?.modulename);
      setSubModuleTitleNamesEdit(res?.data?.sassignbranch?.submodulename);
      setMainPageTitleNamesEdit(res?.data?.sassignbranch?.mainpagename);
      setSubPageTitleNamesEdit(res?.data?.sassignbranch?.subpagename);
      setSubSubPageTitleNamesEdit(res?.data?.sassignbranch?.subsubpagename);

      setModuleNameRouteUrlEdit(res?.data?.sassignbranch?.modulenameurlforedit);
      setSubModuleNameRouteUrlEdit(res?.data?.sassignbranch?.submodulenameurlforedit);
      setMainPageNameRouteUrlEdit(res?.data?.sassignbranch?.mainpagenameurlforedit);
      setSubPageNameRouteUrlEdit(res?.data?.sassignbranch?.subpagenameurlforedit);
      setSubSubPageNameRouteUrlEdit(res?.data?.sassignbranch?.subsubpagenameurlforedit);

      handleClickOpenEdit();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // get single row to edit....
  const getviewCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.ASSIGNBRANCH_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      handleClickOpenview();
      setAssignBranchEdit(res?.data?.sassignbranch);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const username = isUserRoleAccess.username;

  //branch updatedby edit page....
  let updateby = assignBranchEdit?.updatedby;
  let addedby = assignBranchEdit?.addedby;

  //edit post call
  let assignbranch_id = getrowid?._id;
  let updatebyput = getrowid?.updatedby;

  // /edit put
  const sendRequestEdit = async () => {
    setIsLoading(true);

    try {
      let assignbranches = await axios.put(`${SERVICE.ASSIGNBRANCH_SINGLE}/${assignbranch_id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        fromcompany: locationgroupingEdit.fromcompany,
        frombranch: locationgroupingEdit.frombranch,
        fromunit: locationgroupingEdit.fromunit,

        modulename: moduleTitleNamesEdit,
        submodulename: subModuleTitleNamesEdit,
        mainpagename: mainPageTitleNamesEdit,
        subpagename: subPageTitleNamesEdit,
        subsubpagename: subsubPageTitleNamesEdit,
        isupdated: Boolean(true),

        modulenameurl: [...new Set([...moduleNameRouteUrlEdit, ...subModuleNameRouteUrlEdit, ...mainPageNameRouteUrlEdit, ...subPageNameRouteUrlEdit, ...subsubPageNameRouteUrlEdit])],

        submodulenameurl: [...new Set([...moduleNameRouteUrlEdit, ...subModuleNameRouteUrlEdit, ...mainPageNameRouteUrlEdit, ...subPageNameRouteUrlEdit, ...subsubPageNameRouteUrlEdit])],

        mainpagenameurl: [...new Set([...moduleNameRouteUrlEdit, ...subModuleNameRouteUrlEdit, ...mainPageNameRouteUrlEdit, ...subPageNameRouteUrlEdit, ...subsubPageNameRouteUrlEdit])],

        subpagenameurl: [...new Set([...moduleNameRouteUrlEdit, ...subModuleNameRouteUrlEdit, ...mainPageNameRouteUrlEdit, ...subPageNameRouteUrlEdit, ...subsubPageNameRouteUrlEdit])],

        subsubpagenameurl: [...new Set([...moduleNameRouteUrlEdit, ...subModuleNameRouteUrlEdit, ...mainPageNameRouteUrlEdit, ...subPageNameRouteUrlEdit, ...subsubPageNameRouteUrlEdit])],

        modulenameurlforedit: moduleNameRouteUrlEdit,
        submodulenameurlforedit: subModuleNameRouteUrlEdit,
        mainpagenameurlforedit: mainPageNameRouteUrlEdit,
        subpagenameurlforedit: subPageNameRouteUrlEdit,
        subsubpagenameurlforedit: subsubPageNameRouteUrlEdit,

        company: locationgroupingEdit.company,
        branch: locationgroupingEdit.branch,
        unit: locationgroupingEdit.unit,
        companycode: locationgroupingEdit.companycode,
        branchcode: locationgroupingEdit.branchcode,
        branchemail: locationgroupingEdit.branchemail,
        branchaddress: locationgroupingEdit.branchaddress,
        branchstate: locationgroupingEdit.branchstate,
        branchcity: locationgroupingEdit.branchcity,
        branchcountry: locationgroupingEdit.branchcountry,
        branchpincode: locationgroupingEdit.branchpincode,
        unitcode: locationgroupingEdit.unitcode,
        employee: locationgroupingEdit?.employeeset,
        employeecode: locationgroupingEdit?.employeecode,
        updatedby: [
          ...updatebyput,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchAllAssignBranch();

      setPopupContent('Updated Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
      handleCloseModEdit();
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const editSubmit = async (e) => {
    e.preventDefault();

    const duplicate = isAssignBranchForEdit?.filter((data) => {
      const isCompanyMatch = data.company === locationgroupingEdit.company;
      const isBranchMatch = data.branch === locationgroupingEdit?.branch;
      const isUnitMatch = data.unit === locationgroupingEdit?.unit;
      const isEmployeeMatch = data.employee === locationgroupingEdit?.employee;
      const isFromCompanyMatch = data.fromcompany === locationgroupingEdit.fromcompany;
      const isFromBranchMatch = data.frombranch === locationgroupingEdit?.frombranch;
      const isFromUnitMatch = data.fromunit === locationgroupingEdit?.fromunit;
      const isModuleNameMatch = data.modulename?.length > 0 ? data.modulename.some((item) => moduleTitleNamesEdit?.includes(item)) : true;
      const isSubModuleNameMatch = data.submodulename?.length > 0 ? data.submodulename.some((item) => subModuleTitleNamesEdit?.includes(item)) : true;
      const isMainPageNameMatch = data.mainpagename?.length > 0 ? data.mainpagename.some((item) => mainPageTitleNamesEdit?.includes(item)) : true;
      const isSubPageNameMatch = data.subpagename?.length > 0 ? data.subpagename.some((item) => subPageTitleNamesEdit?.includes(item)) : true;
      const isSubSubPageNameMatch = data.subsubpagename?.length > 0 ? data.subsubpagename.some((item) => subsubPageTitleNamesEdit?.includes(item)) : true;

      return isCompanyMatch && isBranchMatch && isUnitMatch && isEmployeeMatch && isFromCompanyMatch && isFromBranchMatch && isFromUnitMatch && isModuleNameMatch && isSubModuleNameMatch && isMainPageNameMatch && isSubPageNameMatch && isSubSubPageNameMatch;
    });

    const getDeepestValidValueFromArray = (duplicates) => {
      if (!duplicates || !duplicates.length) return null;

      // First pass: Get all valid values (your existing logic)
      const allValidValues = duplicates
        .map((duplicate) => {
          if (duplicate.subsubpagename?.length > 0) {
            return { field: 'subsubpagename', value: duplicate.subsubpagename, url: duplicate.subpagenameurl };
          }
          if (duplicate.subpagename?.length > 0) {
            return { field: 'subpagename', value: duplicate.subpagename, url: duplicate.subpagenameurl };
          }
          if (duplicate.mainpagename?.length > 0) {
            return { field: 'mainpagename', value: duplicate.mainpagename, url: duplicate.mainpagenameurl };
          }
          if (duplicate.submodulename?.length > 0) {
            return { field: 'submodulename', value: duplicate.submodulename, url: duplicate.submodulenameurl };
          }
          if (duplicate.modulename?.length > 0) {
            return { field: 'modulename', value: duplicate.modulename, url: duplicate.modulenameurl };
          }
          return null;
        })
        .filter(Boolean);

      if (!allValidValues.length) return null;

      // Second pass: Merge objects with the same field
      const mergedValues = allValidValues.reduce((acc, current) => {
        const existing = acc.find((item) => item.field === current.field);
        if (existing) {
          // Merge values (avoid duplicates)
          existing.value = [...new Set([...existing.value, ...current.value])];
        } else {
          acc.push({ ...current });
        }
        return acc;
      }, []);

      return mergedValues;
    };

    // Usage:
    const firstValidValue = getDeepestValidValueFromArray(duplicate);

    setRemoveDupValEdit(firstValidValue);
    // from
    if (locationgroupingEdit.fromcompany === 'Please Select Company') {
      setPopupContentMalert('Please Select Company!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (locationgroupingEdit.frombranch === 'Please Select Branch') {
      setPopupContentMalert('Please Select Branch!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (locationgroupingEdit.fromunit === 'Please Select Unit') {
      setPopupContentMalert('Please Select Unit!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (selectedModuleNameEdit.length === 0) {
      setPopupContentMalert('Please Select Module!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (selectedSubModuleNameEdit.length === 0) {
      setPopupContentMalert('Please Select Sub Module!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (mainPageoptionsEdit?.length > 0 && selectedMainPageNameEdit?.length === 0) {
      setPopupContentMalert('Please Select Main Page!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (subPageoptionsEdit?.length > 0 && selectedSubPageNameEdit?.length === 0) {
      setPopupContentMalert('Please Select Sub Page!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (subSubPageoptionsEdit?.length > 0 && selectedSubSubPageNameEdit?.length === 0) {
      setPopupContentMalert('Please Select Sub Sub-Page!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    }

    //  to
    else if (locationgroupingEdit.company === 'Please Select Company') {
      setPopupContentMalert('Please Select Company!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (locationgroupingEdit.branch === 'Please Select Branch') {
      setPopupContentMalert('Please Select Branch!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (locationgroupingEdit.unit === 'Please Select Unit') {
      setPopupContentMalert('Please Select Unit!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (locationgroupingEdit?.employee === 'Please Select Employee') {
      setPopupContentMalert('Please Select Responsible Person!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (firstValidValue?.length > 0) {
      // setPopupContentMalert("Data Already Added!");
      // setPopupSeverityMalert("info");
      // handleClickOpenPopupMalert();
      setShowAlertEdit(
        <>
          <Typography
            style={{
              fontSize: '20px',
              fontWeight: 900,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            Data Already Exist
            <Button onClick={handleCloseerrEdit}>
              <CloseIcon color="black" />
            </Button>
          </Typography>
          <div>
            <Table style={{ width: '100%' }}>
              <TableHead>
                <StyledTableCell sx={{ padding: '10px 20px !important' }}>{'SNO'}.</StyledTableCell>
                <StyledTableCell sx={{ padding: '10px 20px !important', width: '150px' }}>{'Module'}</StyledTableCell>
                <StyledTableCell sx={{ padding: '10px 20px !important' }}>{'Page'}</StyledTableCell>
              </TableHead>
              <TableBody>
                {firstValidValue.map((item, i) => (
                  <StyledTableRow key={i}>
                    <StyledTableCell sx={{ padding: '10px 20px !important' }}>{i + 1}.</StyledTableCell>
                    <StyledTableCell sx={{ padding: '10px 20px !important', width: '150px' }}>{item.field === 'mainpagename' ? 'Main Page' : item.field === 'subpagename' ? 'Sub Page' : item.field === 'subsubpagename' ? 'Sub Sub-Page' : 'Sub Module'}</StyledTableCell>
                    <StyledTableCell sx={{ padding: '10px 20px !important' }}>{item.value?.toString()}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <br />
        </>
      );
      handleClickOpenerrEdit();
    } else {
      await sendRequestEdit(); // Make sure to wait for the asynchronous function to complete
    }
  };

  // view
  // get single row to view....
  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.ASSIGNBRANCH_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAssignBranchEdit(res?.data?.sassignbranch);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  // List start
  // get all assignBranches
  const fetchAllAssignBranch = async () => {
    try {
      let res = await axios.post(
        SERVICE.ASSIGNBRANCH_ACCESSIBLE,
        {
          assignbranchs: accessbranch,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      const result = res?.data?.assignbranch.map((data, index) => {
        let resdata = { ...data, isownaccess: false };
        if (data.fromcompany === data.company && data.frombranch === data.branch && data.fromunit === data.unit) {
          resdata = { ...data, isownaccess: true };
        }

        return resdata;
      });
      setAssignBranches(
        result?.map((item, index) => ({
          ...item,
          serialNumber: index + 1,
          modulename: item.modulename?.join(','),
          submodulename: item.submodulename?.join(','),
          mainpagename: item.mainpagename?.join(','),
          subpagename: item.subpagename?.join(','),
          subsubpagename: item.subsubpagename?.join(','),
          modulenamedup: item.modulename,
          submodulenamedup: item.submodulename,
          mainpagenamedup: item.mainpagename,
          subpagenamedup: item.subpagename,
          subsubpagenamedup: item.subsubpagename,
        }))
      );
      setAssignBranchesforDup(
        result?.map((item, index) => ({
          ...item,
          serialNumber: index + 1,
          id: item._id,
        }))
      );
      setIsAllAssignBranch(true);
    } catch (err) {
      setIsAllAssignBranch(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchAllAssignBranch();
  }, []);

  const [items, setItems] = useState([]);
  const addSerialNumber = (datas) => {
    setItems(datas);
  };

  useEffect(() => {
    addSerialNumber(assignBranches);
  }, [assignBranches]);

  const [searchedString, setSearchedString] = useState('');
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
  const searchTerms = searchQuery.toLowerCase().split(' ');
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) => Object.values(item)?.join(' ').toLowerCase().includes(term));
  });

  const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(filteredDatas?.length / pageSize);

  const visiblePages = Math.min(totalPages, 3);

  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

  const pageNumbers = [];

  const indexOfLastItem = page * pageSize;

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    fromcompany: true,
    frombranch: true,
    fromunit: true,
    company: true,
    branch: true,
    unit: true,
    employee: true,
    employeecode: true,

    modulename: true,
    submodulename: true,
    mainpagename: true,
    subpagename: true,
    subsubpagename: true,

    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem('columnVisibility', JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem('columnVisibility');
    if (savedVisibility) {
      setColumnVisibility(JSON.parse(savedVisibility));
    }
  }, []);

  //set function to get particular row
  const rowData = async (id) => {
    try {
      let res = await axios.get(`${SERVICE.ASSIGNBRANCH_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteAssignBranch(res?.data?.sassignbranch);
      handleClickOpendel();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // Alert delete popup
  let assignbranchid = deleteAssignBranch._id;

  const delBranch = async () => {
    try {
      await axios.delete(`${SERVICE.ASSIGNBRANCH_SINGLE}/${assignbranchid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchAllAssignBranch();
      setPage(1);
      setSelectedRows([]);
      setPage(1);
      handleCloseDel();
      setPopupContent('Deleted Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const delBranchcheckbox = async () => {
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.ASSIGNBRANCH_SINGLE}/${item}`, {
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

      await fetchAllAssignBranch();
      setPopupContent('Deleted Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener('beforeunload', beforeUnloadHandler);
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, []);

  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );

  const columnDataTable = [
    {
      field: 'checkbox',
      headerName: 'Checkbox', // Default header name
      headerStyle: {
        fontWeight: 'bold',
      },
      sortable: false,
      width: 90,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      hide: !columnVisibility.checkbox,
      headerClassName: 'bold-header',
      pinned: 'left',
    },
    {
      field: 'serialNumber',
      headerName: 'SNo',
      flex: 0,
      width: 60,
      hide: !columnVisibility.serialNumber,
      headerClassName: 'bold-header',
      pinned: 'left',
    },
    {
      field: 'employeecode',
      pinned: 'left',
      headerName: 'Emp Code',
      flex: 0,
      width: 200,
      hide: !columnVisibility.employeecode,
      headerClassName: 'bold-header',
    },
    {
      field: 'employee',
      headerName: 'Employee Name',
      flex: 0,
      width: 200,
      hide: !columnVisibility.employee,
      headerClassName: 'bold-header',
      pinned: 'left',
    },
    // from
    {
      field: 'fromcompany',
      headerName: 'From Company',
      flex: 0,
      width: 200,
      hide: !columnVisibility.fromcompany,
      headerClassName: 'bold-header',
    },
    {
      field: 'frombranch',
      headerName: ' From Branch',
      flex: 0,
      width: 200,
      hide: !columnVisibility.frombranch,
      headerClassName: 'bold-header',
    },
    {
      field: 'fromunit',
      headerName: ' From Unit',
      flex: 0,
      width: 200,
      hide: !columnVisibility.fromunit,
      headerClassName: 'bold-header',
    },

    {
      field: 'modulename',
      headerName: 'Module',
      flex: 0,
      width: 200,
      hide: !columnVisibility.modulename,
      headerClassName: 'bold-header',
    },
    {
      field: 'submodulename',
      headerName: 'Sub Module',
      flex: 0,
      width: 200,
      hide: !columnVisibility.submodulename,
      headerClassName: 'bold-header',
    },
    {
      field: 'mainpagename',
      headerName: 'Main Page',
      flex: 0,
      width: 200,
      hide: !columnVisibility.mainpagename,
      headerClassName: 'bold-header',
    },
    {
      field: 'subpagename',
      headerName: 'Sub Page',
      flex: 0,
      width: 200,
      hide: !columnVisibility.subpagename,
      headerClassName: 'bold-header',
    },
    {
      field: 'subsubpagename',
      headerName: 'Sub Sub Page',
      flex: 0,
      width: 200,
      hide: !columnVisibility.subsubpagename,
      headerClassName: 'bold-header',
    },
    // to
    {
      field: 'company',
      headerName: 'To Company',
      flex: 0,
      width: 200,
      hide: !columnVisibility.company,
      headerClassName: 'bold-header',
    },
    {
      field: 'branch',
      headerName: ' To Branch',
      flex: 0,
      width: 200,
      hide: !columnVisibility.branch,
      headerClassName: 'bold-header',
    },
    {
      field: 'unit',
      headerName: ' To Unit',
      flex: 0,
      width: 200,
      hide: !columnVisibility.unit,
      headerClassName: 'bold-header',
    },
    {
      field: 'actions',
      headerName: 'Action',
      flex: 0,
      width: 250,
      minHeight: '40px !important',
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: 'bold-header',
      cellStyle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      cellRenderer: (params) => (
        <Grid sx={{ display: 'flex' }}>
          {isUserRoleCompare?.includes('eaccessiblecompany/branch/unit') && (
            // params.data.isownaccess === false
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.data.id);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes('daccessiblecompany/branch/unit') && params.data.accesspage === 'assignbranch' && (
            // {isUserRoleCompare?.includes('daccessiblecompany/branch/unit') && params.data.isownaccess === false && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes('vaccessiblecompany/branch/unit') && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes('iaccessiblecompany/branch/unit') && (
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
      fromcompany: item.fromcompany,
      frombranch: item.frombranch,
      fromunit: item.fromunit,
      company: item?.company,
      branch: item?.branch,
      unit: item?.unit,
      employee: item?.employee,
      employeecode: item?.employeecode,
      accesspage: item?.accesspage,
      isownaccess: item.isownaccess,

      modulename: item.modulename,
      submodulename: item.submodulename,
      mainpagename: item.mainpagename,
      subpagename: item.subpagename,
      subsubpagename: item.subsubpagename,
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
  const filteredColumns = columnDataTable.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));

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
        padding: '10px',
        minWidth: '325px',
        '& .MuiDialogContent-root': { padding: '10px 0' },
      }}
    >
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
        <TextField label="Find column" variant="standard" fullWidth value={searchQueryManage} onChange={(e) => setSearchQueryManage(e.target.value)} sx={{ marginBottom: 5, position: 'absolute' }} />
      </Box>
      <br />
      <br />
      <DialogContent sx={{ minWidth: 'auto', height: '200px', position: 'relative' }}>
        <List sx={{ overflow: 'auto', height: '100%' }}>
          {filteredColumns.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: 'flex' }}
                primary={<Switch sx={{ marginTop: '-5px' }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />}
                secondary={column.field === 'checkbox' ? 'Checkbox' : column.headerName}
              // secondary={column.headerName }
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Grid container>
          <Grid item md={4}>
            <Button variant="text" sx={{ textTransform: 'none' }} onClick={() => setColumnVisibility(initialColumnVisibility)}>
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

  // Excel
  const fileName = 'Accessible Company/Branch/Unit';

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Accessible Company/Branch/Unit',
    pageStyle: 'print',
  });

  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage
        .toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, 'Accessible Company/Branch/Unit.png');
        })
        .catch((error) => {
          console.error('dom-to-image error: ', error);
        });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  return (
    <>
      <Headtitle title={'ACCESSIBLE COMPANY/BRANCH/UNIT'} />
      <PageHeading title="Accessible Company/Branch/Unit" modulename="Human Resources" submodulename="Facility" mainpagename="Accessible Company/Branch/Unit" subpagename="" subsubpagename="" />
      {isUserRoleCompare?.includes('aaccessiblecompany/branch/unit') && (
        <>
          <Box sx={userStyle.dialogbox}>
            <Typography sx={userStyle.SubHeaderText}> Add Accessible Company/Branch/Unit</Typography>
            <br /> <br /> <br />
            <>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={12}>
                    <Typography>From </Typography>
                  </Grid>
                  <br />
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Company<b style={{ color: 'red' }}>*</b>
                      </Typography>
                      <Selects
                        options={isAssignBranch
                          ?.map((data) => ({
                            label: data.company,
                            value: data.company,
                            companycode: data.companycode,
                          }))
                          .filter((item, index, self) => {
                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                          })}
                        styles={colourStyles}
                        value={{
                          label: locationgrouping.fromcompany,
                          value: locationgrouping.fromcompany,
                        }}
                        onChange={(e) => {
                          setLocationgrouping({
                            ...locationgrouping,
                            fromcompany: e.value,
                            companycode: e.companycode,
                            frombranch: 'Please Select Branch',
                            fromunit: 'Please Select Unit',
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Branch<b style={{ color: 'red' }}>*</b>
                      </Typography>
                      <Selects
                        options={isAssignBranch
                          ?.filter((comp) => locationgrouping.fromcompany === comp.company)
                          ?.map((data) => ({
                            label: data.branch,
                            value: data.branch,
                            branchpincode: data.branchpincode,
                            branchcountry: data.branchcountry,
                            branchcity: data.branchcity,
                            branchstate: data.branchstate,
                            branchaddress: data.branchaddress,
                            branchcode: data.branchcode,
                            branchemail: data.branchemail,
                          }))
                          .filter((item, index, self) => {
                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                          })}
                        styles={colourStyles}
                        value={{
                          label: locationgrouping.frombranch,
                          value: locationgrouping.frombranch,
                        }}
                        onChange={(e) => {
                          setLocationgrouping({
                            ...locationgrouping,
                            frombranch: e.value,
                            branchpincode: e.branchpincode,
                            branchcountry: e.branchcountry,
                            branchcity: e.branchcity,
                            branchstate: e.branchstate,
                            branchaddress: e.branchaddress,
                            branchemail: e.branchemail,
                            branchcode: e.branchcode,
                            fromunit: 'Please Select Unit',
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Unit<b style={{ color: 'red' }}>*</b>
                      </Typography>
                      <Selects
                        options={isAssignBranch
                          ?.filter((comp) => locationgrouping.fromcompany === comp.company && locationgrouping.frombranch === comp.branch)
                          ?.map((data) => ({
                            label: data.unit,
                            value: data.unit,
                            unitcode: data.unitcode,
                          }))
                          .filter((item, index, self) => {
                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                          })}
                        styles={colourStyles}
                        value={{
                          label: locationgrouping.fromunit,
                          value: locationgrouping.fromunit,
                        }}
                        onChange={(e) => {
                          setLocationgrouping({
                            ...locationgrouping,
                            fromunit: e.value,
                            unitcode: e.unitcode,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Module<b style={{ color: 'red' }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={module}
                        value={selectedModuleName}
                        onChange={(e) => {
                          handleModuleChange(e);
                          setSelectedSubModuleName([]);
                          setSelectedMainPageName([]);
                          setSelectedSubPageName([]);
                          setSelectedSubSubPageName([]);
                          setSubModuleNameRouteUrl([]);
                          setMainPageNameRouteUrl([]);
                          setSubPageNameRouteUrl([]);
                          setSubSubPageNameRouteUrl([]);
                        }}
                        valueRenderer={customValueRendererModule}
                        labelledBy="Please Select Module"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Sub Module<b style={{ color: 'red' }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={subModuleOptions}
                        value={selectedSubModuleName}
                        onChange={(e) => {
                          handleSubModuleChange(e);
                          setSelectedMainPageName([]);
                          setSelectedSubPageName([]);
                          setSelectedSubSubPageName([]);
                          setMainPageNameRouteUrl([]);
                          setSubPageNameRouteUrl([]);
                          setSubSubPageNameRouteUrl([]);
                        }}
                        valueRenderer={customValueRendererSubModule}
                        labelledBy="Please Select Sub-Module"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Main Page</Typography>
                      <MultiSelect
                        options={mainPageoptions}
                        value={selectedMainPageName}
                        onChange={(e) => {
                          handleMainPageChange(e);
                          setSelectedSubPageName([]);
                          setSelectedSubSubPageName([]);
                          setSubPageNameRouteUrl([]);
                          setSubSubPageNameRouteUrl([]);
                        }}
                        valueRenderer={customValueRendererMainPage}
                        labelledBy="Please Select Main-Page"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Sub Page</Typography>
                      <MultiSelect
                        options={subPageoptions}
                        value={selectedSubPageName}
                        onChange={(e) => {
                          handleSubPageChange(e);
                          setSelectedSubSubPageName([]);
                          setSubSubPageNameRouteUrl([]);
                        }}
                        valueRenderer={customValueRendererSubPage}
                        labelledBy="Please Select Sub-Page"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Sub Sub-Page</Typography>
                      <MultiSelect
                        options={subSubPageoptions}
                        value={selectedSubSubPageName}
                        onChange={(e) => {
                          handleSubSubPageChange(e);
                        }}
                        valueRenderer={customValueRenderersubSubPage}
                        labelledBy="Please Select Sub sub-Page"
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <br />
                <br />

                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={12}>
                    <Typography>To </Typography>
                  </Grid>
                  <br />
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Company<b style={{ color: 'red' }}>*</b>
                      </Typography>
                      <Selects
                        options={isAssignBranch
                          ?.map((data) => ({
                            label: data.company,
                            value: data.company,
                          }))
                          .filter((item, index, self) => {
                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                          })}
                        styles={colourStyles}
                        value={{
                          label: locationgrouping.company,
                          value: locationgrouping.company,
                        }}
                        onChange={(e) => {
                          setEmployees([]);
                          setLocationgrouping({
                            ...locationgrouping,
                            company: e.value,
                            companycode: e.companycode,
                            branch: 'Please Select Branch',
                            unit: 'Please Select Unit',
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Branch<b style={{ color: 'red' }}>*</b>
                      </Typography>
                      <Selects
                        options={isAssignBranch
                          ?.filter((comp) => locationgrouping.company === comp.company)
                          ?.map((data) => ({
                            label: data.branch,
                            value: data.branch,
                          }))
                          .filter((item, index, self) => {
                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                          })}
                        styles={colourStyles}
                        value={{
                          label: locationgrouping.branch,
                          value: locationgrouping.branch,
                        }}
                        onChange={(e) => {
                          setEmployees([]);
                          setLocationgrouping({
                            ...locationgrouping,
                            branch: e.value,
                            branchpincode: e.branchpincode,
                            branchcountry: e.branchcountry,
                            branchcity: e.branchcity,
                            branchstate: e.branchstate,
                            branchaddress: e.branchaddress,
                            branchemail: e.branchemail,
                            branchcode: e.branchcode,
                            unit: 'Please Select Unit',
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Unit<b style={{ color: 'red' }}>*</b>
                      </Typography>
                      <Selects
                        options={isAssignBranch
                          ?.filter((comp) => locationgrouping.company === comp.company && locationgrouping.branch === comp.branch)
                          ?.map((data) => ({
                            label: data.unit,
                            value: data.unit,
                          }))
                          .filter((item, index, self) => {
                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                          })}
                        styles={colourStyles}
                        value={{
                          label: locationgrouping.unit,
                          value: locationgrouping.unit,
                        }}
                        onChange={(e) => {
                          fetchEmployees(locationgrouping.company, locationgrouping.branch, e.value);
                          setLocationgrouping({
                            ...locationgrouping,
                            unit: e.value,
                            unitcode: e.unitcode,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12} lg={3}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Responsible Person <b style={{ color: 'red' }}>*</b>
                      </Typography>
                      <MultiSelect size="small" options={employees} value={selectedOptionsEmployeeAdd} onChange={handleEmployeeChangeAdd} valueRenderer={customValueRendererEmployeeAdd} />
                    </FormControl>
                  </Grid>
                </Grid>
                <br />
                <br />
                <Grid container spacing={2}>
                  <Grid item md={2.5} xs={12} sm={6}>
                    <>
                      <Button variant="contained" type="submit" disabled={isBtn} sx={buttonStyles.buttonsubmit}>
                        Submit
                      </Button>
                    </>
                  </Grid>
                  <Grid item md={2.5} xs={12} sm={6}>
                    <>
                      <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                        Clear
                      </Button>
                    </>
                  </Grid>
                </Grid>
              </form>
            </>
          </Box>
          <br />
        </>
      )}
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes('laccessiblecompany/branch/unit') && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Accessible Company/Branch/Unit List </Typography>
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
                    sx={{ width: '77px' }}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                    <MenuItem value={assignBranches?.length}>All</MenuItem>
                  </Select>
                </Box>
              </Grid>
              <Grid
                item
                md={8}
                xs={12}
                sm={12}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Box>
                  {isUserRoleCompare?.includes('excelaccessiblecompany/branch/unit') && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          setFormat('xl');
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileExcel />
                        &ensp;Export to Excel&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('csvaccessiblecompany/branch/unit') && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          setFormat('csv');
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileCsv />
                        &ensp;Export to CSV&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('printaccessiblecompany/branch/unit') && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('pdfaccessiblecompany/branch/unit') && (
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
                  {isUserRoleCompare?.includes('imageaccessiblecompany/branch/unit') && (
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                      {' '}
                      <ImageIcon sx={{ fontSize: '15px' }} /> &ensp;Image&ensp;{' '}
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
                  maindatas={assignBranches}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                  totalDatas={assignBranchesforDup}
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
            {/* {isUserRoleCompare?.includes("bdaccessiblecompany/branch/unit") && (
              <Button variant="contained" color="error" onClick={handleClickOpenalert} sx={buttonStyles.buttonbulkdelete}>
                Bulk Delete
              </Button>
            )} */}
            <br />
            <br />
            {!isAllAssignBranch ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
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
                  itemsList={assignBranchesforDup}
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
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        {manageColumnsContent}
      </Popover>

      {/* ****** Table End ****** */}

      <Box>
        {/* Edit DIALOG */}
        <Dialog open={isEditOpen} onClose={handleCloseModEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" fullWidth={true} maxWidth="md" sx={{ marginTop: '80px' }}>
          <Box sx={{ padding: '30px', minWidth: '750px' }}>
            <Typography sx={userStyle.SubHeaderText}> Edit Accessible Company/Branch/Unit</Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <Typography>From </Typography>
              </Grid>
              <br />
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Company<b style={{ color: 'red' }}>*</b>
                  </Typography>
                  <Selects
                    options={isAssignBranch
                      ?.map((data) => ({
                        label: data.company,
                        value: data.company,
                        companycode: data.companycode,
                      }))
                      .filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                    styles={colourStyles}
                    value={{
                      label: locationgroupingEdit.fromcompany,
                      value: locationgroupingEdit.fromcompany,
                    }}
                    onChange={(e) => {
                      setLocationgroupingEdit({
                        ...locationgroupingEdit,
                        fromcompany: e.value,
                        companycode: e.companycode,
                        frombranch: 'Please Select Branch',
                        fromunit: 'Please Select Unit',
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Branch<b style={{ color: 'red' }}>*</b>
                  </Typography>
                  <Selects
                    options={isAssignBranch
                      ?.filter((comp) => locationgroupingEdit.fromcompany === comp.company)
                      ?.map((data) => ({
                        label: data.branch,
                        value: data.branch,
                        branchpincode: data.branchpincode,
                        branchcountry: data.branchcountry,
                        branchcity: data.branchcity,
                        branchstate: data.branchstate,
                        branchaddress: data.branchaddress,
                        branchcode: data.branchcode,
                        branchemail: data.branchemail,
                      }))
                      .filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                    styles={colourStyles}
                    value={{
                      label: locationgroupingEdit.frombranch,
                      value: locationgroupingEdit.frombranch,
                    }}
                    onChange={(e) => {
                      setLocationgroupingEdit({
                        ...locationgroupingEdit,
                        frombranch: e.value,
                        branchpincode: e.branchpincode,
                        branchcountry: e.branchcountry,
                        branchcity: e.branchcity,
                        branchstate: e.branchstate,
                        branchaddress: e.branchaddress,
                        branchemail: e.branchemail,
                        branchcode: e.branchcode,
                        fromunit: 'Please Select Unit',
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Unit<b style={{ color: 'red' }}>*</b>
                  </Typography>
                  <Selects
                    options={isAssignBranch
                      ?.filter((comp) => locationgroupingEdit.fromcompany === comp.company && locationgroupingEdit.frombranch === comp.branch)
                      ?.map((data) => ({
                        label: data.unit,
                        value: data.unit,
                        unitcode: data.unitcode,
                      }))
                      .filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                    styles={colourStyles}
                    value={{
                      label: locationgroupingEdit.fromunit,
                      value: locationgroupingEdit.fromunit,
                    }}
                    onChange={(e) => {
                      setLocationgroupingEdit({
                        ...locationgroupingEdit,
                        unitcode: e.unitcode,
                        fromunit: e.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Module<b style={{ color: 'red' }}>*</b>
                  </Typography>
                  <MultiSelect
                    options={module}
                    value={selectedModuleNameEdit}
                    onChange={(e) => {
                      handleModuleChangeEdit(e);
                      setSelectedSubModuleNameEdit([]);
                      setSelectedMainPageNameEdit([]);
                      setSelectedSubPageNameEdit([]);
                      setSelectedSubSubPageNameEdit([]);

                      setSubModuleNameRouteUrlEdit([]);
                      setMainPageNameRouteUrlEdit([]);
                      setSubPageNameRouteUrlEdit([]);
                      setSubSubPageNameRouteUrlEdit([]);

                      setSubModuleTitleNamesEdit([]);
                      setMainPageTitleNamesEdit([]);
                      setSubPageTitleNamesEdit([]);
                      setSubSubPageTitleNamesEdit([]);
                    }}
                    valueRenderer={customValueRendererModuleEdit}
                    labelledBy="Please Select Module"
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Sub Module<b style={{ color: 'red' }}>*</b>
                  </Typography>
                  <MultiSelect
                    options={subModuleOptionsEdit}
                    value={selectedSubModuleNameEdit}
                    onChange={(e) => {
                      handleSubModuleChangeEdit(e);
                      setSelectedMainPageNameEdit([]);
                      setSelectedSubPageNameEdit([]);
                      setSelectedSubSubPageNameEdit([]);
                      setMainPageNameRouteUrlEdit([]);
                      setSubPageNameRouteUrlEdit([]);
                      setSubSubPageNameRouteUrlEdit([]);
                      setMainPageTitleNamesEdit([]);
                      setSubPageTitleNamesEdit([]);
                      setSubSubPageTitleNamesEdit([]);
                    }}
                    valueRenderer={customValueRendererSubModuleEdit}
                    labelledBy="Please Select Sub-Module"
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Main Page</Typography>
                  <MultiSelect
                    options={mainPageoptionsEdit}
                    value={selectedMainPageNameEdit}
                    onChange={(e) => {
                      handleMainPageChangeEdit(e);
                      setSelectedSubPageNameEdit([]);
                      setSelectedSubSubPageNameEdit([]);
                      setSubPageNameRouteUrlEdit([]);
                      setSubSubPageNameRouteUrlEdit([]);
                      setSubPageTitleNamesEdit([]);
                      setSubSubPageTitleNamesEdit([]);
                    }}
                    valueRenderer={customValueRendererMainPageEdit}
                    labelledBy="Please Select Main-Page"
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Sub Page</Typography>
                  <MultiSelect
                    options={subPageoptionsEdit}
                    value={selectedSubPageNameEdit}
                    onChange={(e) => {
                      handleSubPageChangeEdit(e);
                      setSelectedSubSubPageNameEdit([]);
                      setSubSubPageNameRouteUrlEdit([]);
                      setSubSubPageTitleNamesEdit([]);
                    }}
                    valueRenderer={customValueRendererSubPageEdit}
                    labelledBy="Please Select Sub-Page"
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Sub Sub-Page</Typography>
                  <MultiSelect
                    options={subSubPageoptionsEdit}
                    value={selectedSubSubPageNameEdit}
                    onChange={(e) => {
                      handleSubSubPageChangeEdit(e);
                    }}
                    valueRenderer={customValueRenderersubSubPageEdit}
                    labelledBy="Please Select Sub sub-Page"
                  />
                </FormControl>
              </Grid>
            </Grid>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <Typography>To </Typography>
              </Grid>
              <br />
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Company<b style={{ color: 'red' }}>*</b>
                  </Typography>
                  <Selects
                    options={isAssignBranch
                      ?.map((data) => ({
                        label: data.company,
                        value: data.company,
                      }))
                      .filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
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
                        companycode: e.companycode,
                        branch: 'Please Select Branch',
                        unit: 'Please Select Unit',
                        employee: 'Please Select Responsible Person',
                      });
                      setEmployees([]);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Branch<b style={{ color: 'red' }}>*</b>
                  </Typography>
                  <Selects
                    options={isAssignBranch
                      ?.filter((comp) => locationgroupingEdit.company === comp.company)
                      ?.map((data) => ({
                        label: data.branch,
                        value: data.branch,
                      }))
                      .filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                    styles={colourStyles}
                    value={{
                      label: locationgroupingEdit.branch,
                      value: locationgroupingEdit.branch,
                    }}
                    onChange={(e) => {
                      setLocationgroupingEdit({
                        ...locationgroupingEdit,
                        branch: e.value,
                        branchpincode: e.branchpincode,
                        branchcountry: e.branchcountry,
                        branchcity: e.branchcity,
                        branchstate: e.branchstate,
                        branchaddress: e.branchaddress,
                        branchemail: e.branchemail,
                        branchcode: e.branchcode,
                        unit: 'Please Select Unit',
                        employee: 'Please Select Responsible Person',
                      });
                      setEmployees([]);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Unit<b style={{ color: 'red' }}>*</b>
                  </Typography>
                  <Selects
                    options={isAssignBranch
                      ?.filter((comp) => locationgroupingEdit.company === comp.company && locationgroupingEdit.branch === comp.branch)
                      ?.map((data) => ({
                        label: data.unit,
                        value: data.unit,
                      }))
                      .filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                    styles={colourStyles}
                    value={{
                      label: locationgroupingEdit.unit,
                      value: locationgroupingEdit.unit,
                    }}
                    onChange={(e) => {
                      fetchEmployees(locationgroupingEdit.company, locationgroupingEdit.branch, e.value);
                      setLocationgroupingEdit({
                        ...locationgroupingEdit,
                        unitcode: e.unitcode,
                        unit: e.value,
                        employee: 'Please Select Responsible Person',
                      });
                      setEmployees([]);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Responsible Person <b style={{ color: 'red' }}>*</b>
                  </Typography>
                  <Selects
                    options={employees}
                    styles={colourStyles}
                    value={{
                      label: locationgroupingEdit.employee,
                      value: locationgroupingEdit.employee,
                    }}
                    onChange={(e) => {
                      setLocationgroupingEdit({
                        ...locationgroupingEdit,
                        employee: e.value,
                        employeeset: e.employee,
                        employeecode: e.empcode,
                      });
                    }}
                  />
                </FormControl>
                <br />
                <br />
                <br />
                <br />
              </Grid>
              <Grid container>
                <br />
                <Grid item md={1}></Grid>
                {isLoading ? (
                  <>
                    <Backdrop
                      sx={{
                        color: 'blue',
                        zIndex: (theme) => theme.zIndex.drawer + 2,
                      }}
                      open={isLoading}
                    >
                      <CircularProgress color="inherit" />
                    </Backdrop>
                  </>
                ) : (
                  <>
                    <Button variant="contained" onClick={editSubmit} sx={buttonStyles.buttonsubmit}>
                      Update
                    </Button>
                    <Grid item md={1}></Grid>
                    <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit}>
                      Cancel
                    </Button>
                  </>
                )}
              </Grid>
            </Grid>
          </Box>
        </Dialog>
      </Box>

      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" fullWidth={true} sx={{ marginTop: '80px' }}>
          <DialogContent sx={{ textAlign: 'center', alignItems: 'center' }}>
            {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleCloseerrSavewitoutdup}>
              Save Without Duplicate
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpenEdit} onClose={handleCloseerrEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" fullWidth={true} sx={{ marginTop: '80px' }}>
          <DialogContent sx={{ textAlign: 'center', alignItems: 'center' }}>
            {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
            <Typography variant="h6">{showAlertEdit}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleCloseerrSavewitoutdupEdit}>
              Save Without Duplicate
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* view model */}
      <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" fullWidth={true} maxWidth="md" sx={{ marginTop: '80px' }}>
        <Box sx={{ padding: '20px 50px' }}>
          <>
            <Typography sx={userStyle.HeaderText}> View Accessible Company/Branch/Unit Details</Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <Typography>From</Typography>
              </Grid>
              <br />
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Company</Typography>
                  <Typography>{assignBranchEdit?.fromcompany}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Branch</Typography>
                  <Typography>{assignBranchEdit?.frombranch}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Unit</Typography>
                  <Typography>{assignBranchEdit?.fromunit}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Module</Typography>
                  <Typography>{assignBranchEdit?.modulename?.join(', ')}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Sub Module</Typography>
                  <Typography>{assignBranchEdit?.submodulename?.join(', ')}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Main Page</Typography>
                  <Typography>{assignBranchEdit?.mainpagename?.join(', ')}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Sub Page</Typography>
                  <Typography>{assignBranchEdit?.subpagename?.join(', ')}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Sub Sub Page</Typography>
                  <Typography>{assignBranchEdit?.subsubpagename?.join(', ')}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <Typography>To</Typography>
              </Grid>
              <br />
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Company</Typography>
                  <Typography>{assignBranchEdit?.company}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Branch</Typography>
                  <Typography>{assignBranchEdit?.branch}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Unit</Typography>
                  <Typography>{assignBranchEdit?.unit}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Responsible Person</Typography>
                  <Typography>{assignBranchEdit?.employee}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button sx={buttonStyles?.btncancel} color="primary" onClick={handleCloseview}>
                {' '}
                Back{' '}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpenpop} onClose={handleCloseerrpop} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
            <Typography variant="h6">{showAlertpop}</Typography>
          </DialogContent>
          <DialogActions>
            {isLoading ? (
              <>
                <Backdrop
                  sx={{
                    color: 'blue',
                    zIndex: (theme) => theme.zIndex.drawer + 2,
                  }}
                  open={isLoading}
                >
                  <CircularProgress color="inherit" />
                </Backdrop>
              </>
            ) : (
              <>
                <Grid>
                  <Button
                    variant="contained"
                    style={{
                      padding: '7px 13px',
                      color: 'white',
                      background: 'rgb(25, 118, 210)',
                    }}
                    onClick={() => {
                      sendRequestEdit();
                      handleCloseerrpop();
                    }}
                  >
                    ok
                  </Button>
                </Grid>
              </>
            )}
            <Button sx={buttonStyles.btncancel} onClick={handleCloseerrpop}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* EXTERNAL COMPONENTS -------------- START */}
      {/* VALIDATION */}
      <MessageAlert openPopup={openPopupMalert} handleClosePopup={handleClosePopupMalert} popupContent={popupContentMalert} popupSeverity={popupSeverityMalert} />
      {/* SUCCESS */}
      <AlertDialog openPopup={openPopup} handleClosePopup={handleClosePopup} popupContent={popupContent} popupSeverity={popupSeverity} />
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
        itemsTwo={assignBranches ?? []}
        filename={fileName}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup openInfo={openInfo} handleCloseinfo={handleCloseinfo} heading="Accessible Company/Branch/Unit Info" addedby={addedby} updateby={updateby} />

      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation open={isDeleteOpen} onClose={handleCloseDel} onConfirm={delBranch} title="Are you sure?" confirmButtonText="Yes" cancelButtonText="Cancel" />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation open={isDeleteOpencheckbox} onClose={handleCloseModcheckbox} onConfirm={delBranchcheckbox} title="Are you sure?" confirmButtonText="Yes" cancelButtonText="Cancel" />
      {/* PLEASE SELECT ANY ROW */}
      <PleaseSelectRow open={isDeleteOpenalert} onClose={handleCloseModalert} message="Please Select any Row" iconColor="orange" buttonText="OK" />
      {/* EXTERNAL COMPONENTS -------------- END */}
    </>
  );
};

export default AssignBranch;
