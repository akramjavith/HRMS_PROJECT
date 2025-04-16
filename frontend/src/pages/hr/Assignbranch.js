import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, Checkbox, List, ListItem, Popover, ListItemText, TableCell, TextField, IconButton, TableRow, Dialog, DialogContent, Select, MenuItem, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button, TableBody } from "@mui/material";
import { userStyle, colourStyles } from "../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import { SERVICE } from "../../services/Baseservice";
import { MultiSelect } from "react-multi-select-component";
import axios from "axios";
import Selects from "react-select";
import jsPDF from "jspdf";
import "jspdf-autotable";
import StyledDataGrid from "../../components/TableStyle";
import { handleApiError } from "../../components/Errorhandling";
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import moment from "moment-timezone";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { CircularProgress, Backdrop } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Resizable from "react-resizable";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import { menuItems } from "../../components/menuItemsList";

const AssignBranch = () => {

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
        rowDataTable.map((item, index) => {
          return {
            "S.No": index + 1,
            "Emp Code": item.employeecode,
            "Employee Name": item.employee,
            "From Company": item.fromcompany,
            "From Branch": item.frombranch,
            "From Unit": item.fromunit,
            "Module": item.modulename?.toString(),
            "Sub Module": item.submodulename?.toString(),
            "Main Page": item.mainpagename?.toString(),
            "Sub Page": item.subpagename?.toString(),
            "Sub Sub Page": item.subsubpagename?.toString(),
            "To Company": item.company,
            "To Branch": item.branch,
            "To Unit": item.unit,
          };
        }),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        items?.map((item, index) => ({
          "S.No": index + 1,
          "Emp Code": item.employeecode,
          "Employee Name": item.employee,
          "From Company": item.fromcompany,
          "From Branch": item.frombranch,
          "From Unit": item.fromunit,
          "Module": item.modulename?.toString(),
          "Sub Module": item.submodulename?.toString(),
          "Main Page": item.mainpagename?.toString(),
          "Sub Page": item.subpagename?.toString(),
          "Sub Sub Page": item.subsubpagename?.toString(),
          "To Company": item.company,
          "To Branch": item.branch,
          "To Unit": item.unit,
        })),
        fileName
      );
    }
    setIsFilterOpen(false);
  };

  const { auth } = useContext(AuthContext);

  const module =
    menuItems.length > 0 &&
    menuItems?.map((data) => ({
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


  //Editpostvalues
  const [moduleTitleNamesEdit, setModuleTitleNamesEdit] = useState([]);
  const [subModuleTitleNamesEdit, setSubModuleTitleNamesEdit] = useState([]);
  const [mainPageTitleNamesEdit, setMainPageTitleNamesEdit] = useState([]);
  const [subPageTitleNamesEdit, setSubPageTitleNamesEdit] = useState([]);
  const [subsubPageTitleNamesEdit, setSubSubPageTitleNamesEdit] = useState([]);


  //fieldvalue
  const [selectedModuleName, setSelectedModuleName] = useState([]);
  const [selectedSubModuleName, setSelectedSubModuleName] = useState([]);
  const [selectedMainPageName, setSelectedMainPageName] = useState([]);
  const [selectedSubPageName, setSelectedSubPageName] = useState([]);
  const [selectedSubSubPageName, setSelectedSubSubPageName] = useState([]);

  const [moduleNameRouteUrl, setModuleNameRouteUrl] = useState([]);
  const [subModuleNameRouteUrl, setSubModuleNameRouteUrl] = useState([]);
  const [mainPageNameRouteUrl, setMainPageNameRouteUrl] = useState([]);
  const [subPageNameRouteUrl, setSubPageNameRouteUrl] = useState([]);
  const [subsubPageNameRouteUrl, setSubSubPageNameRouteUrl] = useState([]);

  //Editfieldvalue
  const [selectedModuleNameEdit, setSelectedModuleNameEdit] = useState([]);
  const [selectedSubModuleNameEdit, setSelectedSubModuleNameEdit] = useState([]);
  const [selectedMainPageNameEdit, setSelectedMainPageNameEdit] = useState([]);
  const [selectedSubPageNameEdit, setSelectedSubPageNameEdit] = useState([]);
  const [selectedSubSubPageNameEdit, setSelectedSubSubPageNameEdit] = useState([]);


  const [moduleNameRouteUrlEdit, setModuleNameRouteUrlEdit] = useState([]);
  const [subModuleNameRouteUrlEdit, setSubModuleNameRouteUrlEdit] = useState([]);
  const [mainPageNameRouteUrlEdit, setMainPageNameRouteUrlEdit] = useState([]);
  const [subPageNameRouteUrlEdit, setSubPageNameRouteUrlEdit] = useState([]);
  const [subsubPageNameRouteUrlEdit, setSubSubPageNameRouteUrlEdit] = useState([]);

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


  // const [moduleDbNames, setModuleDbNames] = useState([]);
  // const [subModuleDbNames, setSubModuleDbNames] = useState([]);
  // const [mainPageDbNames, setMainPageDbNames] = useState([]);
  // const [subPageDbNames, setSubPageDbNames] = useState([]);
  // const [subSubPageDbNames, setSubSubPageDbNames] = useState([]);

  const customValueRendererModule = (valueCate, _categories) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Module";
  };

  const customValueRendererSubModule = (valueCate, _categories) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Sub Module";
  };

  const customValueRendererMainPage = (valueCate, _categories) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Main-Page";
  };
  const customValueRendererSubPage = (valueCate, _categories) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Sub-Page";
  };
  const customValueRenderersubSubPage = (valueCate, _categories) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Sub Sub-Page";
  };

  //Editrendervalue

  const customValueRendererModuleEdit = (valueCate, _categories) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Module";
  };

  const customValueRendererSubModuleEdit = (valueCate, _categories) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Sub Module";
  };

  const customValueRendererMainPageEdit = (valueCate, _categories) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Main-Page";
  };
  const customValueRendererSubPageEdit = (valueCate, _categories) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Sub-Page";
  };
  const customValueRenderersubSubPageEdit = (valueCate, _categories) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Sub Sub-Page";
  };




  //setting an module names into array
  const handleModuleChange = (options) => {
    let ans = options.map((a, index) => {
      return a.value;
    });

    let urlvalue = [];

    function extractUrls(submenus) {
      submenus.forEach(submenuItem => {
        // Check if the submenuItem has a valid URL
        if (submenuItem.url !== "") {
          urlvalue.push(submenuItem.url);
        }

        // Check if there is a nested submenu array
        if (submenuItem.submenu && submenuItem.submenu.length > 0) {
          // Recursively extract URLs from the nested submenu
          extractUrls(submenuItem.submenu);
        }
      });
    }

    options.forEach(option => {
      if (option.submenu && option.submenu.length > 0) {
        extractUrls(option.submenu);
      }
    });


    setModuleNameRouteUrl(urlvalue?.filter(Boolean))

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
        return !innerArray.title.startsWith("123 ");
      });

    setSubModuleOptions(
      filteredArray.length > 0 ?
        filteredArray?.map((data) => ({
          ...data,
          label: data.title,
          value: data.title,
        })) : []
    );
    setMainPageoptions([])
    setsubSubPageoptions([])
    setSubPageoptions([])
    setSubModuleNameRouteUrl([])
    setSelectedModuleName(options);
  };

  const handleSubModuleChange = (options) => {

    let submodAns = options.map((a, index) => {
      return a.value;
    });


    let urlvalue = [];

    function extractUrls(submenus) {
      submenus.forEach(submenuItem => {
        // Check if the submenuItem has a valid URL
        if (submenuItem.url !== "") {
          urlvalue.push(submenuItem.url);
        }

        // Check if there is a nested submenu array
        if (submenuItem.submenu && submenuItem.submenu.length > 0) {
          // Recursively extract URLs from the nested submenu
          extractUrls(submenuItem.submenu);
        }
      });
    }

    options.forEach(option => {
      // Check if the option itself has a valid URL
      if (option.url !== "") {
        urlvalue.push(option.url);
      }

      // Check if the option has a submenu and extract URLs if it does
      if (option.submenu && option.submenu.length > 0) {
        extractUrls(option.submenu);
      }
    });

    setSubModuleNameRouteUrl(urlvalue?.filter(Boolean))

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
    setsubSubPageoptions([])
    setSubPageoptions([])
    setSelectedSubModuleName(options);
  };

  const handleMainPageChange = (options) => {

    let mainpageAns = options.map((a, index) => {
      return a.value;
    });


    let urlvalue = [];

    function extractUrls(submenus) {
      submenus.forEach(submenuItem => {
        // Check if the submenuItem has a valid URL
        if (submenuItem.url !== "") {
          urlvalue.push(submenuItem.url);
        }

        // Check if there is a nested submenu array
        if (submenuItem.submenu && submenuItem.submenu.length > 0) {
          // Recursively extract URLs from the nested submenu
          extractUrls(submenuItem.submenu);
        }
      });
    }

    options.forEach(option => {
      // Check if the option itself has a valid URL
      if (option.url !== "") {
        urlvalue.push(option.url);
      }

      // Check if the option has a submenu and extract URLs if it does
      if (option.submenu && option.submenu.length > 0) {
        extractUrls(option.submenu);
      }
    });

    setMainPageNameRouteUrl(urlvalue?.filter(Boolean))

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
    setsubSubPageoptions([])
    setSelectedMainPageName(options);
  };

  const handleSubPageChange = (options) => {

    let subPageAns = options.map((a, index) => {
      return a.value;
    });


    let urlvalue = [];

    function extractUrls(submenus) {
      submenus.forEach(submenuItem => {
        // Check if the submenuItem has a valid URL
        if (submenuItem.url !== "") {
          urlvalue.push(submenuItem.url);
        }

        // Check if there is a nested submenu array
        if (submenuItem.submenu && submenuItem.submenu.length > 0) {
          // Recursively extract URLs from the nested submenu
          extractUrls(submenuItem.submenu);
        }
      });
    }

    options.forEach(option => {
      // Check if the option itself has a valid URL
      if (option.url !== "") {
        urlvalue.push(option.url);
      }

      // Check if the option has a submenu and extract URLs if it does
      if (option.submenu && option.submenu.length > 0) {
        extractUrls(option.submenu);
      }
    });

    setSubPageNameRouteUrl(urlvalue?.filter(Boolean))

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

  const handleSubSubPageChange = (options) => {
    let subPageAns = options.map((a, index) => {
      return a.value;
    });


    let urlvalue = [];

    function extractUrls(submenus) {
      submenus.forEach(submenuItem => {
        // Check if the submenuItem has a valid URL
        if (submenuItem.url !== "") {
          urlvalue.push(submenuItem.url);
        }

        // Check if there is a nested submenu array
        if (submenuItem.submenu && submenuItem.submenu.length > 0) {
          // Recursively extract URLs from the nested submenu
          extractUrls(submenuItem.submenu);
        }
      });
    }

    options.forEach(option => {
      // Check if the option itself has a valid URL
      if (option.url !== "") {
        urlvalue.push(option.url);
      }

      // Check if the option has a submenu and extract URLs if it does
      if (option.submenu && option.submenu.length > 0) {
        extractUrls(option.submenu);
      }
    });

    setSubSubPageNameRouteUrl(urlvalue?.filter(Boolean))


    setSubSubPageTitleNames(subPageAns);
    let dbNames =
      options.length > 0 &&
      options.map((a, index) => {
        return a.dbname;
      });
    // setSubSubPageDbNames(dbNames);

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

    function extractUrls(submenus) {
      submenus.forEach(submenuItem => {
        // Check if the submenuItem has a valid URL
        if (submenuItem.url !== "") {
          urlvalue.push(submenuItem.url);
        }

        // Check if there is a nested submenu array
        if (submenuItem.submenu && submenuItem.submenu.length > 0) {
          // Recursively extract URLs from the nested submenu
          extractUrls(submenuItem.submenu);
        }
      });
    }

    options.forEach(option => {
      if (option.submenu && option.submenu.length > 0) {
        extractUrls(option.submenu);
      }
    });

    // setModuleNameRouteUrlEdit([...moduleNameRouteUrlEdit, ...urlvalue?.filter(Boolean)])
    setModuleNameRouteUrlEdit(urlvalue?.filter(Boolean))

    // let dbNames =
    //   options.length > 0 &&
    //   options.map((a, index) => {
    //     return a.dbname;
    //   });
    // setModuleDbNames(dbNames);
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

    setSubModuleOptionsEdit(
      filteredArray.length > 0 ?
        filteredArray?.map((data) => ({
          ...data,
          label: data.title,
          value: data.title,
        })) : []
    );
    setMainPageoptionsEdit([])
    setsubSubPageoptionsEdit([])
    setSubPageoptionsEdit([])
    setSelectedModuleNameEdit(options);
  };

  const handleSubModuleChangeEdit = (options) => {

    let submodAns = options.map((a, index) => {
      return a.value;
    });
    setSubModuleTitleNamesEdit(submodAns);

    let urlvalue = [];

    function extractUrls(submenus) {
      submenus.forEach(submenuItem => {
        // Check if the submenuItem has a valid URL
        if (submenuItem.url !== "") {
          urlvalue.push(submenuItem.url);
        }

        // Check if there is a nested submenu array
        if (submenuItem.submenu && submenuItem.submenu.length > 0) {
          // Recursively extract URLs from the nested submenu
          extractUrls(submenuItem.submenu);
        }
      });
    }

    options.forEach(option => {
      // Check if the option itself has a valid URL
      if (option.url !== "") {
        urlvalue.push(option.url);
      }

      // Check if the option has a submenu and extract URLs if it does
      if (option.submenu && option.submenu.length > 0) {
        extractUrls(option.submenu);
      }
    });

    setSubModuleNameRouteUrlEdit(urlvalue?.filter(Boolean))

    let subModu = subModuleOptionsEdit.filter((data) => submodAns.includes(data.title));
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
    setMainPageoptionsEdit(mainPageDropDown);
    setsubSubPageoptionsEdit([])
    setSubPageoptionsEdit([])
    setSelectedSubModuleNameEdit(options);
  };

  const handleMainPageChangeEdit = (options) => {



    let mainpageAns = options.map((a, index) => {
      return a.value;
    });

    setMainPageTitleNamesEdit(mainpageAns);

    let urlvalue = [];

    function extractUrls(submenus) {
      submenus.forEach(submenuItem => {
        // Check if the submenuItem has a valid URL
        if (submenuItem.url !== "") {
          urlvalue.push(submenuItem.url);
        }

        // Check if there is a nested submenu array
        if (submenuItem.submenu && submenuItem.submenu.length > 0) {
          // Recursively extract URLs from the nested submenu
          extractUrls(submenuItem.submenu);
        }
      });
    }

    options.forEach(option => {
      // Check if the option itself has a valid URL
      if (option.url !== "") {
        urlvalue.push(option.url);
      }

      // Check if the option has a submenu and extract URLs if it does
      if (option.submenu && option.submenu.length > 0) {
        extractUrls(option.submenu);
      }
    });



    setMainPageNameRouteUrlEdit(urlvalue?.filter(Boolean))
    // setMainPageNameRouteUrlEdit([...mainPageNameRouteUrlEdit, ...urlvalue?.filter(Boolean)])
    // let dbNames =
    //   options.length > 0 &&
    //   options.map((a, index) => {
    //     return a.dbname;
    //   });
    // setMainPageDbNames(dbNames);

    let mainPageFilt = mainPageoptionsEdit.filter((data) => mainpageAns.includes(data.title));
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
    setSubPageoptionsEdit(subPageDropDown);
    setsubSubPageoptionsEdit([])
    setSelectedMainPageNameEdit(options);
  };

  const handleSubPageChangeEdit = (options) => {
    let subPageAns = options.map((a, index) => {
      return a.value;
    });
    setSubPageTitleNamesEdit(subPageAns);

    let urlvalue = [];

    function extractUrls(submenus) {
      submenus.forEach(submenuItem => {
        // Check if the submenuItem has a valid URL
        if (submenuItem.url !== "") {
          urlvalue.push(submenuItem.url);
        }

        // Check if there is a nested submenu array
        if (submenuItem.submenu && submenuItem.submenu.length > 0) {
          // Recursively extract URLs from the nested submenu
          extractUrls(submenuItem.submenu);
        }
      });
    }

    options.forEach(option => {
      // Check if the option itself has a valid URL
      if (option.url !== "") {
        urlvalue.push(option.url);
      }

      // Check if the option has a submenu and extract URLs if it does
      if (option.submenu && option.submenu.length > 0) {
        extractUrls(option.submenu);
      }
    });

    setSubPageNameRouteUrlEdit(urlvalue?.filter(Boolean))

    let subPageFilt = subPageoptionsEdit.filter((data) => subPageAns.includes(data.title));
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
    setsubSubPageoptionsEdit(subPageDropDown);
    setSelectedSubPageNameEdit(options);
  };

  const handleSubSubPageChangeEdit = (options) => {
    let subPageAns = options.map((a, index) => {
      return a.value;
    });
    setSubSubPageTitleNamesEdit(subPageAns);

    let urlvalue = [];

    function extractUrls(submenus) {
      submenus.forEach(submenuItem => {
        // Check if the submenuItem has a valid URL
        if (submenuItem.url !== "") {
          urlvalue.push(submenuItem.url);
        }

        // Check if there is a nested submenu array
        if (submenuItem.submenu && submenuItem.submenu.length > 0) {
          // Recursively extract URLs from the nested submenu
          extractUrls(submenuItem.submenu);
        }
      });
    }

    options.forEach(option => {
      // Check if the option itself has a valid URL
      if (option.url !== "") {
        urlvalue.push(option.url);
      }

      // Check if the option has a submenu and extract URLs if it does
      if (option.submenu && option.submenu.length > 0) {
        extractUrls(option.submenu);
      }
    });

    setSubSubPageNameRouteUrlEdit(urlvalue?.filter(Boolean))

    let subPageFilt = subPageoptionsEdit.filter((data) => subPageAns.includes(data.title));

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
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    employee: "Please Select Employee",
    companycode: "", unitcode: "",
    branchcode: "", branchemail: "", branchaddress: "", branchstate: "", branchcity: "", branchcountry: "",
    fromcompany: "Please Select Company",
    frombranch: "Please Select Branch",
    fromunit: "Please Select Unit",
  });
  const [locationgroupingEdit, setLocationgroupingEdit] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    employee: "Please Select Employee",
    companycode: "", unitcode: "",
    branchcode: "", branchemail: "", branchaddress: "", branchstate: "", branchcity: "", branchcountry: "",
    fromcompany: "Please Select Company",
    frombranch: "Please Select Branch",
    fromunit: "Please Select Unit",
  });
  const [employees, setEmployees] = useState([]);
  const [assignBranchEdit, setAssignBranchEdit] = useState({
    company: "", branch: "", unit: "", employee: "",
    fromcompany: "Please Select Company",
    frombranch: "Please Select Branch",
    fromunit: "Please Select Unit",
  });
  const [isAssignBranchForEdit, setIsAssignBranchForEdit] = useState([]);
  const [isBtn, setIsBtn] = useState(false)

  // employee multiselect add
  const [selectedOptionsEmployeeAdd, setSelectedOptionsEmployeeAdd] = useState([]);
  let [valueEmployeeAdd, setValueEmployeeAdd] = useState([]);


  const [assignBranches, setAssignBranches] = useState([]);
  const [getrowid, setRowGetid] = useState("");

  const [deleteAssignBranch, setDeleteAssignBranch] = useState({});

  const { isUserRoleCompare } = useContext(UserRoleAccessContext);

  const [isAllAssignBranch, setIsAllAssignBranch] = useState(false);
  const { isUserRoleAccess, isAssignBranch, pageName, setPageName } = useContext(UserRoleAccessContext);

  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);

  const [copiedData, setCopiedData] = useState("");

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

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
  const [searchQueryManage, setSearchQueryManage] = useState("");
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
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  // Edit model
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
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
        if (company === data.company && branch === data.branch && value === data.unit)
          return data
      })
      setEmployees(
        result?.map(data => ({
          label: data.companyname,
          value: data.companyname,
          employee: data.companyname,
          empcode: data.empcode
        }))
      );

    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };


  // employee multi select
  const handleEmployeeChangeAdd = (options) => {
    setValueEmployeeAdd(
      options.map((a, index) => {
        return a.employee + "-" + a.empcode;
      })
    );
    setSelectedOptionsEmployeeAdd(options);
  };

  const customValueRendererEmployeeAdd = (valueEmployeeAdd, _employees) => {
    return valueEmployeeAdd.length ? valueEmployeeAdd.map(({ label }) => label)?.join(", ") : <span style={{ color: "hsl(0, 0%, 20%)" }}>Select Responsible Person</span>;
  };


  // post call
  const sendRequest = async (data) => {
    setIsBtn(true)
    try {
      let assignbranches = await axios.post(SERVICE.ASSIGNBRANCH_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        fromcompany: locationgrouping.fromcompany,
        frombranch: locationgrouping.frombranch,
        fromunit: locationgrouping.fromunit,

        modulename: moduleTitleNames,
        submodulename: subModuleTitleNames,
        mainpagename: mainPageTitleNames,
        subpagename: subPageTitleNames,
        subsubpagename: subsubPageTitleNames,

        modulenameurl: moduleNameRouteUrl,
        submodulenameurl: subModuleNameRouteUrl,
        mainpagenameurl: mainPageNameRouteUrl,
        subpagenameurl: subPageNameRouteUrl,
        subsubpagenameurl: subsubPageNameRouteUrl,

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
        employee: data?.split("-")[0],
        employeecode: data?.split("-")[1],
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
      setShowAlert(
        <>
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "Green" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Added Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
      setIsBtn(false)
    } catch (err) { setIsBtn(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // submit option for saving....
  const handleSubmit = (e) => {
    const duplicate = assignBranches?.some(data => data.company === locationgrouping.company &&
      data.branch === locationgrouping.branch &&
      data.unit === locationgrouping.unit &&
      valueEmployeeAdd?.some(datra => datra?.split("-")[0] === data.employee)
      && data.fromcompany === locationgrouping.fromcompany
      && data.frombranch === locationgrouping.frombranch
      && data.fromunit === locationgrouping.fromunit
    )
    e.preventDefault();
    // from
    if (locationgrouping.fromcompany === "Please Select Company") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Company"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (locationgrouping.frombranch === "Please Select Branch") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Branch"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (locationgrouping.fromunit === "Please Select Unit") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Unit"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (selectedModuleName?.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Module"}</p>
        </>
      );
      handleClickOpenerr();
    }
    // to
    else if (locationgrouping.company === "Please Select Company") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Company"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (locationgrouping.branch === "Please Select Branch") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Branch"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (locationgrouping.unit === "Please Select Unit") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Unit"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (selectedOptionsEmployeeAdd?.length < 1) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Responsible Person"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (duplicate) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Data Already Added"}</p>
        </>
      );
      handleClickOpenerr();
    }

    else {
      valueEmployeeAdd?.map(data => {
        sendRequest(data)
      })


    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setLocationgrouping({
      company: "Please Select Company",
      branch: "Please Select Branch",
      unit: "Please Select Unit",
      companycode: "", unitcode: "",
      branchcode: "", branchemail: "", branchaddress: "", branchstate: "", branchcity: "", branchcountry: "",
      fromcompany: "Please Select Company",
      frombranch: "Please Select Branch",
      fromunit: "Please Select Unit",
    });
    setShowAlert(
      <>
        <CheckCircleOutlineIcon
          sx={{ fontSize: "100px", color: "green" }}
        />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>
          {"Cleared Successfully"}
        </p>
      </>
    );
    handleClickOpenerr();
  };


  const fetchNewRoleList = async () => {
    setPageName(!pageName)
    try {
      let role_new = await axios.get(SERVICE.ROLE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const allRoles = role_new?.data?.roles.filter((item) =>
        isUserRoleAccess?.role?.includes(item?.name)
      );

      let mergedObject = {};
      allRoles.forEach((obj) => {
        const keysToInclude = [
          "modulename",
          "submodulename",
          "mainpagename",
          "subpagename",
          "subsubpagename",
        ];

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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      setLocationgroupingEdit(res?.data?.sassignbranch)
      setRowGetid(res?.data?.sassignbranch);
      const moduleName = module?.filter((item) => res?.data?.sassignbranch?.modulename?.includes(item?.title))

      const submoduleName = module
        .flatMap(item =>
          item.submenu
            .filter(subItem =>
              res?.data?.sassignbranch?.submodulename?.includes(subItem?.title)
            )
        )
        .map(subItem => {
          // Check if `value` variable is present, if not add `value` and `label` with "HR"
          if (!('value' in subItem)) {
            return {
              ...subItem,
              value: subItem?.title,
              label: subItem?.title
            };
          }
          return subItem;
        }); // Filter out null values

      const flattenSubmenu = (submenuArray) => {
        return submenuArray.flatMap(subItem => {
          if (subItem.submenu) {
            // Recursively flatten nested submenu arrays
            return [subItem, ...flattenSubmenu(subItem.submenu)];
          }
          return subItem;
        });
      };

      const mainPageName = module
        .flatMap(item => flattenSubmenu(item.submenu)) // Flatten all levels of submenu
        .filter(subItem =>
          res?.data?.sassignbranch?.mainpagename?.includes(subItem?.title)
        )
        .map(subItem => {
          // Check if `value` variable is present, if not add `value` and `label` with subItem.title
          if (!('value' in subItem)) {
            return {
              ...subItem,
              value: subItem?.title,
              label: subItem?.title
            };
          }
          return subItem;
        });



      // const flattenSubmenu = (submenuArray) => {
      //   return submenuArray.flatMap(subItem => {
      //     if (subItem.submenu) {
      //       // Recursively flatten nested submenu arrays
      //       return [subItem, ...flattenSubmenu(subItem.submenu)];
      //     }
      //     return subItem;
      //   });
      // };

      const subPageName = module
        .flatMap(item => flattenSubmenu(item.submenu)) // Flatten all levels of submenu
        .filter(subItem =>
          res?.data?.sassignbranch?.subpagename?.includes(subItem?.title)
        )
        .map(subItem => {
          // Check if `value` variable is present, if not add `value` and `label` with subItem.title
          if (!('value' in subItem)) {
            return {
              ...subItem,
              value: subItem?.title,
              label: subItem?.title
            };
          }
          return subItem;
        });


      const subsubPageName = module
        .flatMap(item =>
          item.submenu
            .filter(subItem =>
              res?.data?.sassignbranch?.subsubpagename?.includes(subItem?.title)
            )
        )
        .map(subItem => {
          // Check if `value` variable is present, if not add `value` and `label` with "HR"
          if (!('value' in subItem)) {
            return {
              ...subItem,
              value: subItem?.title,
              label: subItem?.title
            };
          }
          return subItem;
        }); // Filter out null values

      const submodulename = submoduleName
      const mainpage = mainPageName
      const subpage = subPageName
      const subsubpage = subsubPageName

      setSelectedModuleNameEdit(moduleName)
      setSelectedSubModuleNameEdit(submodulename)
      setSelectedMainPageNameEdit(mainpage)
      setSelectedSubPageNameEdit(subpage)
      setSelectedSubSubPageNameEdit(subsubpage)
      handleModuleChangeEdit(moduleName);
      handleSubModuleChangeEdit(submodulename)
      handleMainPageChangeEdit(mainpage)
      handleSubPageChangeEdit(subpage)
      handleSubSubPageChangeEdit(subsubpage)
      setModuleNameRouteUrlEdit(res?.data?.sassignbranch?.modulenameurl)
      setSubModuleNameRouteUrlEdit(res?.data?.sassignbranch?.submodulenameurl)
      setMainPageNameRouteUrlEdit(res?.data?.sassignbranch?.mainpagenameurl)
      setSubPageNameRouteUrlEdit(res?.data?.sassignbranch?.subpagenameurl)
      setSubSubPageNameRouteUrlEdit(res?.data?.sassignbranch?.subsubpagenameurl)

    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const username = isUserRoleAccess.username;

  //branch updatedby edit page....
  let updateby = locationgroupingEdit?.updatedby;
  let addedby = locationgroupingEdit?.addedby;

  //edit post call
  let assignbranch_id = getrowid?._id;

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

        modulenameurl: moduleNameRouteUrlEdit,
        submodulenameurl: subModuleNameRouteUrlEdit,
        mainpagenameurl: mainPageNameRouteUrlEdit,
        subpagenameurl: subPageNameRouteUrlEdit,
        subsubpagenameurl: subsubPageNameRouteUrlEdit,

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
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchAllAssignBranch();
      handleCloseModEdit();
      setIsLoading(false);
      setShowAlert(
        <>
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "green" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Updated Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) { setIsLoading(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };


  const editSubmit = async (e) => {
    e.preventDefault();
    // Check if assignBranchEdit is defined and has _id property
    const duplicate = isAssignBranchForEdit?.some(data => data.company === locationgroupingEdit.company &&
      data.branch === locationgroupingEdit?.branch &&
      data.unit === locationgroupingEdit?.unit &&
      locationgroupingEdit?.employee === data.employee
      && data.fromcompany === locationgroupingEdit.fromcompany
      && data.frombranch === locationgroupingEdit?.frombranch
      && data.fromunit === locationgroupingEdit?.fromunit
    )
    // from
    if (locationgroupingEdit.fromcompany === "Please Select Company") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Company"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (locationgroupingEdit.frombranch === "Please Select Branch") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Branch"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (locationgroupingEdit.fromunit === "Please Select Unit") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Unit"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (selectedModuleNameEdit.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Module"}</p>
        </>
      );
      handleClickOpenerr();
    }

    //  to
    else if (locationgroupingEdit.company === "Please Select Company") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Company"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (locationgroupingEdit.branch === "Please Select Branch") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Branch"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (locationgroupingEdit.unit === "Please Select Unit") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Unit"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (locationgroupingEdit?.employee === "Please Select Employee") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Responsible Person"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (duplicate) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Data Already Added"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else {
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
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // List start
  // get all assignBranches
  const fetchAllAssignBranch = async () => {
    try {
      const [res] = await Promise.all([
        axios.get(SERVICE.ASSIGNBRANCH, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
      ]);
      const result = res?.data?.assignbranch.map((data, index) => {
        let resdata = { ...data, isownaccess: false }
        if (data.fromcompany === data.company && data.frombranch === data.branch && data.fromunit === data.unit) {
          resdata = { ...data, isownaccess: true }
        }

        return resdata
      })
      setAssignBranches(result);
      setIsAllAssignBranch(true);
    } catch (err) { setIsAllAssignBranch(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const fetchAllAssignBranchEdit = async (e) => {
    try {
      let res = await axios.get(SERVICE.ASSIGNBRANCH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setIsAssignBranchForEdit(res?.data?.assignbranch.filter((item) => item._id !== e));
      setIsAllAssignBranch(true);
    } catch (err) { setIsAllAssignBranch(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  useEffect(() => {
    fetchAllAssignBranch();
  }, []);

  const [items, setItems] = useState([]);
  const addSerialNumber = () => {
    const itemsWithSerialNumber = assignBranches?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [assignBranches]);

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
    return searchTerms.every((term) => Object.values(item)?.join(" ").toLowerCase().includes(term));
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
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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
      setShowAlert(
        <>
          <DeleteOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "#D32F2F" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Deleted Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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

      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);

      await fetchAllAssignBranch();
      setShowAlert(
        <>
          <DeleteSweepIcon sx={{ fontSize: "100px", color: "#D32F2F" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>Deleted Successfully</p>
        </>
      );
      handleClickOpenerr();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

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
      width: 75,

      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 60,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    { field: "employeecode", headerName: "Emp Code", flex: 0, width: 200, hide: !columnVisibility.employeecode, headerClassName: "bold-header" },
    {
      field: "employee",
      headerName: "Employee Name",
      flex: 0,
      width: 200,
      hide: !columnVisibility.employee,
      headerClassName: "bold-header",
    },
    // from
    { field: "fromcompany", headerName: "From Company", flex: 0, width: 200, hide: !columnVisibility.fromcompany, headerClassName: "bold-header" },
    { field: "frombranch", headerName: " From Branch", flex: 0, width: 200, hide: !columnVisibility.frombranch, headerClassName: "bold-header" },
    { field: "fromunit", headerName: " From Unit", flex: 0, width: 200, hide: !columnVisibility.fromunit, headerClassName: "bold-header" },

    { field: "modulename", headerName: "Module", flex: 0, width: 200, hide: !columnVisibility.modulename, headerClassName: "bold-header" },
    { field: "submodulename", headerName: "Sub Module", flex: 0, width: 200, hide: !columnVisibility.submodulename, headerClassName: "bold-header" },
    { field: "mainpagename", headerName: "Main Page", flex: 0, width: 200, hide: !columnVisibility.mainpagename, headerClassName: "bold-header" },
    { field: "subpagename", headerName: "Sub Page", flex: 0, width: 200, hide: !columnVisibility.subpagename, headerClassName: "bold-header" },
    { field: "subsubpagename", headerName: "Sub Sub Page", flex: 0, width: 200, hide: !columnVisibility.subsubpagename, headerClassName: "bold-header" },
    // to
    { field: "company", headerName: "To Company", flex: 0, width: 200, hide: !columnVisibility.company, headerClassName: "bold-header" },
    { field: "branch", headerName: " To Branch", flex: 0, width: 200, hide: !columnVisibility.branch, headerClassName: "bold-header" },
    { field: "unit", headerName: " To Unit", flex: 0, width: 200, hide: !columnVisibility.unit, headerClassName: "bold-header" },
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

          {isUserRoleCompare?.includes("eaccessiblecompany/branch/unit")
            && params.row.isownaccess === false
            && (
              <Button
                sx={userStyle.buttonedit}
                onClick={() => {
                  handleClickOpenEdit();
                  getCode(params.row.id);
                  fetchAllAssignBranchEdit(params.row.id)
                }}
              >
                <EditOutlinedIcon style={{ fontsize: "large" }} />
              </Button>
            )}
          {isUserRoleCompare?.includes("daccessiblecompany/branch/unit") && params.row.isownaccess === false && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vaccessiblecompany/branch/unit") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iaccessiblecompany/branch/unit") && (
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
      fromcompany: item.fromcompany,
      frombranch: item.frombranch,
      fromunit: item.fromunit,
      company: item?.company,
      branch: item?.branch,
      unit: item?.unit,
      employee: item?.employee,
      employeecode: item?.employeecode,
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
    const updatedVisibility = { ...columnVisibility };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibility(updatedVisibility);
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
    <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
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
        <TextField label="Find column" variant="standard" fullWidth value={searchQueryManage} onChange={(e) => setSearchQueryManage(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
      </Box>
      <br />
      <br />
      <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumns.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />}
                secondary={column.field === "checkbox" ? "Checkbox" : column.headerName}
              // secondary={column.headerName }
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Grid container>
          <Grid item md={4}>
            <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibility(initialColumnVisibility)}>
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

  // Excel
  const fileName = "Accessible Company/Branch/Unit";



  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Accessible Company/Branch/Unit",
    pageStyle: "print",
  });

  //  PDF
  const columns = [
    { title: "Emp Code", field: "employeecode" },
    { title: "Employee Name", field: "employee" },
    { title: "From Company", field: "fromcompany" },
    { title: "From Branch", field: "frombranch" },
    { title: "From Unit", field: "fromunit" },
    { title: "Module", field: "modulename" },
    { title: "Sub Module", field: "submodulename" },
    { title: "Main Page", field: "mainpagename" },
    { title: "Sub Page", field: "subpagename" },
    { title: "Sub Sub Page", field: "subsubpagename" },
    { title: "Company", field: "company" },
    { title: "Branch", field: "branch" },
    { title: "Unit", field: "unit" },
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
            employeecode: item.employeecode,
            employee: item.employee,
            fromcompany: item.fromcompany,
            frombranch: item.frombranch,
            fromunit: item.fromunit,
            modulename: item.modulename,
            submodulename: item.submodulename,
            mainpagename: item.mainpagename,
            subpagename: item.subpagename,
            subsubpagename: item.subsubpagename,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
          };
        })
        : items?.map((item, index) => ({
          serialNumber: index + 1,
          employeecode: item.employeecode,
          employee: item.employee,
          fromcompany: item.fromcompany,
          frombranch: item.frombranch,
          fromunit: item.fromunit,
          modulename: item.modulename,
          submodulename: item.submodulename,
          mainpagename: item.mainpagename,
          subpagename: item.subpagename,
          subsubpagename: item.subsubpagename,
          company: item.company,
          branch: item.branch,
          unit: item.unit,
        }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: "4" },
      cellWidth: "auto",
    });

    doc.save("Accessible Company/Branch/Unit.pdf");
  };


  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Accessible Company/Branch/Unit.png");
        });
      });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  return (
    <>
      <Headtitle title={"ACCESSIBLE COMPANY/BRANCH/UNIT"} />
      <Typography sx={userStyle.HeaderText}>Accessible Company/Branch/Unit</Typography>
      {isUserRoleCompare?.includes("aaccessiblecompany/branch/unit") && (
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
                        Company<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={isAssignBranch?.map(data => ({
                          label: data.company,
                          value: data.company,
                          companycode: data.companycode,
                        })).filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                        styles={colourStyles}
                        value={{ label: locationgrouping.fromcompany, value: locationgrouping.fromcompany }}
                        onChange={(e) => {
                          setLocationgrouping({ ...locationgrouping, fromcompany: e.value, companycode: e.companycode, frombranch: "Please Select Branch", fromunit: "Please Select Unit" });

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
                        options={isAssignBranch?.filter(
                          (comp) =>
                            locationgrouping.fromcompany === comp.company
                        )?.map(data => ({
                          label: data.branch,
                          value: data.branch,
                          branchpincode: data.branchpincode,
                          branchcountry: data.branchcountry,
                          branchcity: data.branchcity,
                          branchstate: data.branchstate,
                          branchaddress: data.branchaddress,
                          branchcode: data.branchcode,
                          branchemail: data.branchemail,
                        })).filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                        styles={colourStyles}
                        value={{ label: locationgrouping.frombranch, value: locationgrouping.frombranch }}
                        onChange={(e) => {
                          setLocationgrouping({ ...locationgrouping, frombranch: e.value, branchpincode: e.branchpincode, branchcountry: e.branchcountry, branchcity: e.branchcity, branchstate: e.branchstate, branchaddress: e.branchaddress, branchemail: e.branchemail, branchcode: e.branchcode, fromunit: "Please Select Unit" });

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
                        options={isAssignBranch?.filter(
                          (comp) =>
                            locationgrouping.fromcompany === comp.company && locationgrouping.frombranch === comp.branch
                        )?.map(data => ({
                          label: data.unit,
                          value: data.unit,
                          unitcode: data.unitcode,
                        })).filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                        styles={colourStyles}
                        value={{ label: locationgrouping.fromunit, value: locationgrouping.fromunit }}
                        onChange={(e) => {
                          setLocationgrouping({ ...locationgrouping, fromunit: e.value, unitcode: e.unitcode });


                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Module<b style={{ color: "red" }}>*</b>
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
                          setSubModuleNameRouteUrl([])
                          setMainPageNameRouteUrl([])
                          setSubPageNameRouteUrl([])
                          setSubSubPageNameRouteUrl([])
                        }}
                        valueRenderer={customValueRendererModule}
                        labelledBy="Please Select Module"
                      />

                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Sub Module
                      </Typography>
                      <MultiSelect
                        options={subModuleOptions}
                        value={selectedSubModuleName}
                        onChange={(e) => {
                          handleSubModuleChange(e);
                          setSelectedMainPageName([]);
                          setSelectedSubPageName([]);
                          setSelectedSubSubPageName([]);
                          setMainPageNameRouteUrl([])
                          setSubPageNameRouteUrl([])
                          setSubSubPageNameRouteUrl([])
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
                          setSubPageNameRouteUrl([])
                          setSubSubPageNameRouteUrl([])
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
                          setSubSubPageNameRouteUrl([])
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
                        Company<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={isAssignBranch?.map(data => ({
                          label: data.company,
                          value: data.company,
                        })).filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                        styles={colourStyles}
                        value={{ label: locationgrouping.company, value: locationgrouping.company }}
                        onChange={(e) => {
                          setEmployees([]);
                          setLocationgrouping({ ...locationgrouping, company: e.value, companycode: e.companycode, branch: "Please Select Branch", unit: "Please Select Unit" });

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
                        options={isAssignBranch?.filter(
                          (comp) =>
                            locationgrouping.company === comp.company
                        )?.map(data => ({
                          label: data.branch,
                          value: data.branch,
                        })).filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                        styles={colourStyles}
                        value={{ label: locationgrouping.branch, value: locationgrouping.branch }}
                        onChange={(e) => {
                          setEmployees([]);
                          setLocationgrouping({ ...locationgrouping, branch: e.value, branchpincode: e.branchpincode, branchcountry: e.branchcountry, branchcity: e.branchcity, branchstate: e.branchstate, branchaddress: e.branchaddress, branchemail: e.branchemail, branchcode: e.branchcode, unit: "Please Select Unit" });

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
                        options={isAssignBranch?.filter(
                          (comp) =>
                            locationgrouping.company === comp.company && locationgrouping.branch === comp.branch
                        )?.map(data => ({
                          label: data.unit,
                          value: data.unit,
                        })).filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                        styles={colourStyles}
                        value={{ label: locationgrouping.unit, value: locationgrouping.unit }}
                        onChange={(e) => {
                          fetchEmployees(locationgrouping.company, locationgrouping.branch, e.value);
                          setLocationgrouping({ ...locationgrouping, unit: e.value, unitcode: e.unitcode });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12} lg={3}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Responsible Person <b style={{ color: "red" }}>*</b>
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
                      <Button variant="contained" type="submit" disabled={isBtn}>
                        Submit
                      </Button>
                    </>
                  </Grid>
                  <Grid item md={2.5} xs={12} sm={6}>
                    <>
                      <Button sx={userStyle.btncancel} onClick={handleClear}>
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
      {isUserRoleCompare?.includes("laccessiblecompany/branch/unit") && (
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
                    sx={{ width: "77px" }}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                    {/* <MenuItem value={assignBranches?.length}>All</MenuItem> */}
                  </Select>
                </Box>
              </Grid>
              <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box>
                  {isUserRoleCompare?.includes("excelaccessiblecompany/branch/unit") && (
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
                  {isUserRoleCompare?.includes("csvaccessiblecompany/branch/unit") && (
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
                  {isUserRoleCompare?.includes("printaccessiblecompany/branch/unit") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfaccessiblecompany/branch/unit") && (
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
                  {isUserRoleCompare?.includes("imageaccessiblecompany/branch/unit") && (
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                      {" "}
                      <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                    </Button>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={6} sm={6}>
                <Box>
                  <FormControl fullWidth size="small">
                    <Typography>Search</Typography>
                    <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
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
            {/* {isUserRoleCompare?.includes("bdaccessiblecompany/branch/unit") && (
              <Button variant="contained" color="error" onClick={handleClickOpenalert}>
                Bulk Delete
              </Button>
            )} */}
            <br />
            <br />
            {!isAllAssignBranch ? (
              <>
                <Box sx={{ display: "flex", justifyContent: "center" }}>

                  <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
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
                    /*style={{ width: '800px' }}*/
                    onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowsWithCheckboxes} columns={columnDataTable.filter((column) => columnVisibility[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true} ref={gridRef} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
                </Box>
                <Box style={userStyle.dataTablestyle}>
                  <Box>
                    Showing {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filteredDatas.length)} of {filteredDatas.length} entries
                  </Box>
                  <Box>
                    <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                      <FirstPageIcon />
                    </Button>
                    <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                      <NavigateBeforeIcon />
                    </Button>
                    {pageNumbers?.map((pageNumber) => (
                      <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={page === pageNumber ? "active" : ""} disabled={page === pageNumber}>
                        {pageNumber}
                      </Button>
                    ))}
                    {lastVisiblePage < totalPages && <span>...</span>}
                    <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                      <NavigateNextIcon />
                    </Button>
                    <Button onClick={() => setPage(totalPages)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
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

      {/* ****** Table End ****** */}
      {/* Delete Modal */}
      <Box>
        <>
          <Box>
            {/* ALERT DIALOG */}
            <Dialog open={isDeleteOpen} onClose={handleCloseDel} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
              <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                  Are you sure?
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDel} sx={userStyle.btncancel}>
                  Cancel
                </Button>
                <Button
                  onClick={(e) => {
                    delBranch(assignbranchid);
                    handleCloseDel();
                  }}
                  autoFocus
                  variant="contained"
                  color="error"
                >
                  {" "}
                  OK{" "}
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </>
        {/* ALERT DIALOG */}
      </Box>
      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth={true}
          maxWidth="md"

        >
          <Box sx={{ padding: "30px", minWidth: "750px" }}>
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
                    Company<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    options={isAssignBranch?.map(data => ({
                      label: data.company,
                      value: data.company,
                      companycode: data.companycode,
                    })).filter((item, index, self) => {
                      return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                    })}
                    styles={colourStyles}
                    value={{ label: locationgroupingEdit.fromcompany, value: locationgroupingEdit.fromcompany }}
                    onChange={(e) => {
                      setLocationgroupingEdit({ ...locationgroupingEdit, fromcompany: e.value, companycode: e.companycode, frombranch: "Please Select Branch", fromunit: "Please Select Unit" });
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
                    options={isAssignBranch?.filter(
                      (comp) =>
                        locationgroupingEdit.fromcompany === comp.company
                    )?.map(data => ({
                      label: data.branch,
                      value: data.branch,
                      branchpincode: data.branchpincode,
                      branchcountry: data.branchcountry,
                      branchcity: data.branchcity,
                      branchstate: data.branchstate,
                      branchaddress: data.branchaddress,
                      branchcode: data.branchcode,
                      branchemail: data.branchemail,
                    })).filter((item, index, self) => {
                      return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                    })}
                    styles={colourStyles}
                    value={{ label: locationgroupingEdit.frombranch, value: locationgroupingEdit.frombranch }}
                    onChange={(e) => {
                      setLocationgroupingEdit({ ...locationgroupingEdit, frombranch: e.value, branchpincode: e.branchpincode, branchcountry: e.branchcountry, branchcity: e.branchcity, branchstate: e.branchstate, branchaddress: e.branchaddress, branchemail: e.branchemail, branchcode: e.branchcode, fromunit: "Please Select Unit" });
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
                    options={isAssignBranch?.filter(
                      (comp) =>
                        locationgroupingEdit.fromcompany === comp.company && locationgroupingEdit.frombranch === comp.branch
                    )?.map(data => ({
                      label: data.unit,
                      value: data.unit,
                      unitcode: data.unitcode,
                    })).filter((item, index, self) => {
                      return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                    })}
                    styles={colourStyles}
                    value={{ label: locationgroupingEdit.fromunit, value: locationgroupingEdit.fromunit }}
                    onChange={(e) => {
                      setLocationgroupingEdit({ ...locationgroupingEdit, unitcode: e.unitcode, fromunit: e.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Module<b style={{ color: "red" }}>*</b>
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
                      setSubModuleTitleNamesEdit([])
                      setMainPageTitleNamesEdit([])
                      setSubPageTitleNamesEdit([])
                      setSubSubPageTitleNamesEdit([])
                    }}
                    valueRenderer={customValueRendererModuleEdit}
                    labelledBy="Please Select Module"
                  />

                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Sub Module
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
                      setMainPageTitleNamesEdit([])
                      setSubPageTitleNamesEdit([])
                      setSubSubPageTitleNamesEdit([])
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
                      setSubPageTitleNamesEdit([])
                      setSubSubPageTitleNamesEdit([])
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
                      setSubSubPageTitleNamesEdit([])
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
            <br /><br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <Typography>To </Typography>
              </Grid>
              <br />
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Company<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    options={isAssignBranch?.map(data => ({
                      label: data.company,
                      value: data.company,
                    })).filter((item, index, self) => {
                      return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                    })}
                    styles={colourStyles}
                    value={{ label: locationgroupingEdit.company, value: locationgroupingEdit.company }}
                    onChange={(e) => {
                      setLocationgroupingEdit({
                        ...locationgroupingEdit,
                        company: e.value,
                        companycode: e.companycode,
                        branch: "Please Select Branch",
                        unit: "Please Select Unit",
                        employee: "Please Select Responsible Person",
                      });
                      setEmployees([])

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
                    options={isAssignBranch?.filter(
                      (comp) =>
                        locationgroupingEdit.company === comp.company
                    )?.map(data => ({
                      label: data.branch,
                      value: data.branch,
                    })).filter((item, index, self) => {
                      return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                    })}
                    styles={colourStyles}
                    value={{ label: locationgroupingEdit.branch, value: locationgroupingEdit.branch }}
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
                        unit: "Please Select Unit",
                        employee: "Please Select Responsible Person",
                      });
                      setEmployees([])

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
                    options={isAssignBranch?.filter(
                      (comp) =>
                        locationgroupingEdit.company === comp.company && locationgroupingEdit.branch === comp.branch
                    )?.map(data => ({
                      label: data.unit,
                      value: data.unit,
                    })).filter((item, index, self) => {
                      return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                    })}
                    styles={colourStyles}
                    value={{ label: locationgroupingEdit.unit, value: locationgroupingEdit.unit }}
                    onChange={(e) => {
                      fetchEmployees(locationgroupingEdit.company, locationgroupingEdit.branch, e.value);
                      setLocationgroupingEdit({
                        ...locationgroupingEdit,
                        unitcode: e.unitcode,
                        unit: e.value,
                        employee: "Please Select Responsible Person",
                      });
                      setEmployees([])

                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12} >
                <FormControl fullWidth size="small">
                  <Typography>
                    Responsible Person <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    options={employees}
                    styles={colourStyles}
                    value={{ label: locationgroupingEdit.employee, value: locationgroupingEdit.employee }}
                    onChange={(e) => {
                      setLocationgroupingEdit({ ...locationgroupingEdit, employee: e.value, employeeset: e.employee, employeecode: e.empcode });
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
                    <Backdrop sx={{ color: "blue", zIndex: (theme) => theme.zIndex.drawer + 2 }} open={isLoading}>
                      <CircularProgress color="inherit" />
                    </Backdrop>
                  </>
                ) : (
                  <>
                    <Button variant="contained" onClick={editSubmit}>
                      Update
                    </Button>
                    <Grid item md={1}></Grid>
                    <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
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
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
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

      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table sx={{ minWidth: 700 }} aria-label="simple table" id="branch" ref={componentRef}>
          <TableHead sx={{ fontWeight: "600" }}>
            <TableRow>
              <TableCell>S.NO</TableCell>
              <TableCell>Emp Code</TableCell>
              <TableCell>Emp Name </TableCell>
              <TableCell>From Company</TableCell>
              <TableCell>From Branch</TableCell>
              <TableCell>From Unit</TableCell>
              <TableCell>Module</TableCell>
              <TableCell>Sub Module</TableCell>
              <TableCell>Main Page</TableCell>
              <TableCell>Sub Page</TableCell>
              <TableCell>Sub Sub Page</TableCell>
              <TableCell>To Company</TableCell>
              <TableCell>To Branch</TableCell>
              <TableCell>To Unit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rowDataTable &&
              rowDataTable.map((row, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.employeecode}</TableCell>
                    <TableCell>{row.employee}</TableCell>
                    <TableCell>{row.fromcompany}</TableCell>
                    <TableCell>{row.frombranch}</TableCell>
                    <TableCell>{row.fromunit}</TableCell>
                    <TableCell>{row.modulename?.join(", ")}</TableCell>
                    <TableCell>{row.submodulename?.join(", ")}</TableCell>
                    <TableCell>{row.mainpagename?.join(", ")}</TableCell>
                    <TableCell>{row.subpagename?.join(", ")}</TableCell>
                    <TableCell>{row.subsubpagename?.join(", ")}</TableCell>
                    <TableCell>{row.company}</TableCell>
                    <TableCell>{row.branch}</TableCell>
                    <TableCell>{row.unit}</TableCell>

                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* view model */}
      <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description"
        fullWidth={true} maxWidth="md">
        <Box sx={{ padding: "20px 50px" }}>
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
                  <Typography>{assignBranchEdit?.modulename?.join(", ")}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Sub Module</Typography>
                  <Typography>{assignBranchEdit?.submodulename?.join(", ")}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Main Page</Typography>
                  <Typography>{assignBranchEdit?.mainpagename?.join(", ")}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Sub Page</Typography>
                  <Typography>{assignBranchEdit?.subpagename?.join(", ")}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Sub Sub Page</Typography>
                  <Typography>{assignBranchEdit?.subsubpagename?.join(", ")}</Typography>
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
              <Button variant="contained" color="primary" onClick={handleCloseview}>
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpenpop} onClose={handleCloseerrpop} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <Typography variant="h6">{showAlertpop}</Typography>
          </DialogContent>
          <DialogActions>
            {isLoading ? (
              <>
                <Backdrop sx={{ color: "blue", zIndex: (theme) => theme.zIndex.drawer + 2 }} open={isLoading}>
                  <CircularProgress color="inherit" />
                </Backdrop>
              </>
            ) : (
              <>
                <Grid>
                  <Button
                    variant="contained"
                    style={{
                      padding: "7px 13px",
                      color: "white",
                      background: "rgb(25, 118, 210)",
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

      {/* this is info view details */}

      <Dialog open={openInfo} onClose={handleCloseinfo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> Accessible Company/Branch/Unit Info</Typography>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Added by</Typography>
                  <Table>
                    <TableHead>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"UserName"}</StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                    </TableHead>
                    <TableBody>
                      {addedby?.map((item, i) => (
                        <StyledTableRow>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Updated by</Typography>
                  <Table>
                    <TableHead>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"UserName"}</StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                    </TableHead>
                    <TableBody>
                      {updateby?.map((item, i) => (
                        <StyledTableRow>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
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

      <Box>
        <Dialog open={isDeleteOpencheckbox} onClose={handleCloseModcheckbox} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
            <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
              Are you sure?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
              Cancel
            </Button>
            <Button autoFocus variant="contained" color="error" onClick={(e) => delBranchcheckbox(e)}>
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <Box>
        {/* ALERT DIALOG */}
        <Dialog open={isDeleteOpenalert} onClose={handleCloseModalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: "orange" }} />
            <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
              Please Select any Row
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button autoFocus variant="contained" color="error" onClick={handleCloseModalert}>
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
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
            position: "relative",
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
          {fileFormat === "csv" ? (
            <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
          ) : (
            <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
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
            position: "relative",
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



    </>
  );
};

export default AssignBranch;