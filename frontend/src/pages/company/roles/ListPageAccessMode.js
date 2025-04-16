import { EditOutlined } from "@material-ui/icons";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { MultiSelect } from "react-multi-select-component";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";
import "jspdf-autotable";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Selects from "react-select";
import { handleApiError } from "../../../components/Errorhandling";
import Headtitle from "../../../components/Headtitle";
import { menuItems } from "../../../components/menuItemsList";
import { DeleteConfirmation } from "../../../components/DeleteConfirmation.js";
import {
  AuthContext,
  UserRoleAccessContext,
} from "../../../context/Appcontext";
import { colourStyles, userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
import PageHeading from "../../../components/PageHeading";
import { ThreeDots } from "react-loader-spinner";
import AlertDialog from "../../../components/Alert";
import MessageAlert from "../../../components/MessageAlert";

function ListPageAccessMode() {
  const [datas, setDatas] = useState({
    module: "Please Select Module",
    submodule: "Please Select Sub Module",
    mainpage: "Please Select Mainpage",
    subpage: "Please Select Subpage",
    subsubpage: "Please Select Subsubpage",
    listpageaccessmode: "",
  });
  const [submoduleOptions, setSubModuleOptionss] = useState([]);
  const [mainpageOptions, setMainPageOptions] = useState([]);
  const [subpageOptions, setSubpageOptions] = useState([]);
  const [subsubpageOptions, setSubSubpageOptions] = useState([]);
  const [changeControl, setChangeControl] = useState(false);
  const [getIndex, setGetIndex] = useState("");
  const [deleteId, setDeleteId] = useState("");

  //Delete model
  const [isDeleteOpen, setisDeleteOpen] = useState(false);

  const handleClickOpen = () => {
    setisDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setisDeleteOpen(false);
  };
  const backPage = useNavigate();
  const { isUserRoleCompare, isUserRoleAccess } = useContext(
    UserRoleAccessContext
  );

  const [roleEditOptions, setRoleEditOptions] = useState([]);
  const [loader, setLoader] = useState(true);
  const { auth } = useContext(AuthContext);

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  const [showAlert, setShowAlert] = useState();

  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };
  const [isBtn, setIsBtn] = useState(false);
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

  //get single row to edit....
  const getCode = async () => {
    try {
      //   setLoader(true);
      let res = await axios.get(`${SERVICE.LISTPAGEACCESSMODESAGGREGATION}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let sorted = res?.data?.listpageaccessmode?.sort((a, b) =>
        a.modulename.localeCompare(b.modulename)
      );
      setRoleEditOptions(sorted);
      setLoader(false);
    } catch (err) {
      setLoader(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const [allDatas, setAllDatas] = useState([]);
  const getAllDatas = async () => {
    try {
      let res = await axios.get(`${SERVICE.LISTPAGEACCESSMODES}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let sorted = res?.data?.listpageaccessmode;
      setAllDatas(sorted);
    } catch (err) {
      setLoader(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const deleteData = async () => {
    try {
      await axios.delete(
        `${SERVICE.LISTPAGEACCESSMODE_SINGLE}/${deleteId}`,

        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      await getCode();
      handleCloseMod();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const EditControls = async (index, value) => {
    setChangeControl(true);
    setGetIndex(index);
    setDescriptions((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const UpdateControls = async (id, index) => {
    setChangeControl(false);
    try {
      let res = await axios.put(
        `${SERVICE.LISTPAGEACCESSMODE_SINGLE}/${id}`,
        {
          listpageaccessmode: descriptions[index],
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      await getCode();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //module dropdowns
  const module = menuItems.map((d) => ({
    ...d,
    label: d.title,
    value: d.title,
  }));

  //Submodule dropdowns
  const fetchSubModuleDropDowns = (e) => {
    let subModule = menuItems.filter((data) => data.title === e);
    let dropdown = subModule.map((data) => data.submenu);
    let ans = [].concat(...dropdown).map((d) => ({
      ...d,
      label: d.title,
      value: d.title,
    }));
    setSubModuleOptionss(ans);
  };
  //MainPage dropdowns
  const fetchMainDropDowns = (e) => {
    let ans = e;

    let subModule = ans?.submenu ? ans?.submenu : [];
    let answer = [].concat(...subModule).map((d) => ({
      ...d,
      label: d.title,
      value: d.title,
    }));
    setMainPageOptions(answer);
  };
  //subPage dropdowns
  const fetchSubPageDropDowns = (e) => {
    let ans = e;

    let subModule = ans?.submenu ? ans?.submenu : [];
    let answer = [].concat(...subModule).map((d) => ({
      ...d,
      label: d.title,
      value: d.title,
    }));
    setSubpageOptions(answer);
  };
  //subPage dropdowns
  const fetchSubSubPageDropDowns = (e) => {
    let ans = e;
    let subModule = ans?.submenu ? ans?.submenu : [];
    let answer = [].concat(...subModule).map((d) => ({
      ...d,
      label: d.title,
      value: d.title,
    }));
    setSubSubpageOptions(answer);
  };

  const handleclear = () => {
    setDatas({
      module: "Please Select Module",
      submodule: "Please Select Sub Module",
      mainpage: "Please Select Mainpage",
      subpage: "Please Select Subpage",
      subsubpage: "Please Select Subsubpage",
      listpageaccessmode: "",
    });
    setSubModuleOptionss([]);
    setMainPageOptions([]);
    setSubpageOptions([]);
    setSubSubpageOptions([]);

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

    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  //ubmiit Request
  const fetchSubmit = async () => {
    try {
      setIsBtn(true);
      if (valueModuleNameCat?.length === 0) {
        setPopupContentMalert("Please Select Module Name!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (
        subModuleOptions?.length > 0 &&
        valueSubModuleNameCat?.length === 0
      ) {
        setPopupContentMalert("Please Select Sub-Module Name!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (
        mainPageoptions?.length > 0 &&
        valueMainPageCat?.length === 0
      ) {
        setPopupContentMalert("Please Select Main Page Name!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (subPageoptions?.length > 0 && valueSubPageCat?.length === 0) {
        setPopupContentMalert("Please Select Sub-Page Name!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (
        subSubPageoptions?.length > 0 &&
        valueSubSubPageCat?.length === 0
      ) {
        setPopupContentMalert("Please Select Sub-Sub-Page Name!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else if (datas?.listpageaccessmode === "") {
        setPopupContentMalert("Please Select List Page Access Mode!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else {
        // sendRequest();
        let finaldata = await findAndPostValues(
          menuItems,
          valueModuleNameCat,
          valueSubModuleNameCat,
          valueMainPageCat,
          valueSubPageCat,
          valueSubSubPageCat,
          datas?.listpageaccessmode
        );
        sendRequest(finaldata);
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //   function findAndPostValues(
  //     menuItemsList,
  //     valueModuleNameCat,
  //     valueSubModuleNameCat,
  //     valueMainPageCat,
  //     valueSubPageCat,
  //     valueSubSubPageCat,
  //     listpageaccessmode
  //   ) {
  //     let results = [];

  //     // Recursive function to traverse the menu structure
  //     function traverseMenu(
  //       items,
  //       moduleName = "",
  //       subModuleName = "",
  //       mainPageName = "",
  //       subPageName = "",
  //       subSubPageName = "",
  //       isTopLevel = true
  //     ) {
  //       items.forEach((item) => {
  //         // Determine if the current item matches any of the categories
  //         const isModule = valueModuleNameCat.includes(item.title);
  //         const isSubModule = valueSubModuleNameCat.includes(item.title);
  //         const isMainPage = valueMainPageCat.includes(item.title);
  //         const isSubPage = valueSubPageCat.includes(item.title);
  //         const isSubSubPage = valueSubSubPageCat.includes(item.title);

  //         // Create the result object
  //         const result = {
  //           modulename: isModule ? item.title : moduleName,
  //           submodulename: isSubModule ? item.title : subModuleName,
  //           mainpagename: isMainPage ? item.title : mainPageName,
  //           subpagename: isSubPage ? item.title : subPageName,
  //           subsubpagename: isSubSubPage ? item.title : subSubPageName,
  //           listpageaccessmode: listpageaccessmode,
  //         };

  //         // Push the result if it matches the criteria or if it's a top-level item
  //         if (
  //           isModule ||
  //           isSubModule ||
  //           isMainPage ||
  //           isSubPage ||
  //           isSubSubPage ||
  //           isTopLevel
  //         ) {
  //           results.push(result);
  //         }

  //         // Recursively traverse the submenu if it exists
  //         if (item.submenu && item.submenu.length > 0) {
  //           traverseMenu(
  //             item.submenu,
  //             isModule ? item.title : moduleName,
  //             isSubModule ? item.title : subModuleName,
  //             isMainPage ? item.title : mainPageName,
  //             isSubPage ? item.title : subPageName,
  //             isSubSubPage ? item.title : subSubPageName,
  //             false // Not a top-level item anymore
  //           );
  //         }
  //       });
  //     }

  //     // Start the recursion from the top level of the menuItemsList
  //     traverseMenu(menuItemsList);

  //     // Remove duplicate objects by converting to JSON and back
  //     const uniqueResults = Array.from(
  //       new Set(results.map((item) => JSON.stringify(item)))
  //     ).map((item) => JSON.parse(item));

  //     console.log(uniqueResults);
  //     return uniqueResults;
  //   }

  function findAndPostValues(
    menuItemsList,
    valueModuleNameCat,
    valueSubModuleNameCat,
    valueMainPageCat,
    valueSubPageCat,
    valueSubSubPageCat,
    listpageaccessmode
  ) {
    let results = [];

    // Recursive function to traverse the menu structure
    function traverseMenu(
      items,
      moduleName = "",
      subModuleName = "",
      mainPageName = "",
      subPageName = "",
      subSubPageName = ""
    ) {
      items.forEach((item) => {
        // Determine if the current item matches any of the categories
        const isModule = valueModuleNameCat.includes(item.title);
        const isSubModule = valueSubModuleNameCat.includes(item.title);
        const isMainPage = valueMainPageCat.includes(item.title);
        const isSubPage = valueSubPageCat.includes(item.title);
        const isSubSubPage = valueSubSubPageCat.includes(item.title);

        // Check if there is a submenu
        const hasSubmenu = item.submenu && item.submenu.length > 0;

        // If there's no submenu, create and add the result
        if (!hasSubmenu) {
          const result = {
            modulename: isModule ? item.title : moduleName,
            submodulename: isSubModule ? item.title : subModuleName,
            mainpagename: isMainPage ? item.title : mainPageName,
            subpagename: isSubPage ? item.title : subPageName,
            subsubpagename: isSubSubPage ? item.title : subSubPageName,
            listpageaccessmode: listpageaccessmode,
          };

          if (
            isModule ||
            isSubModule ||
            isMainPage ||
            isSubPage ||
            isSubSubPage
          ) {
            results.push(result);
          }
        }

        // Recursively traverse the submenu if it exists
        if (hasSubmenu) {
          traverseMenu(
            item.submenu,
            isModule ? item.title : moduleName,
            isSubModule ? item.title : subModuleName,
            isMainPage ? item.title : mainPageName,
            isSubPage ? item.title : subPageName,
            isSubSubPage ? item.title : subSubPageName
          );
        }
      });
    }

    // Start the recursion from the top level of the menuItemsList
    traverseMenu(menuItemsList);

    // Remove duplicate objects by converting to JSON and back
    const uniqueResults = Array.from(
      new Set(results.map((item) => JSON.stringify(item)))
    ).map((item) => JSON.parse(item));

    console.log(uniqueResults);
    return uniqueResults;
  }

  const sendRequest = async (finaldata) => {
    try {
      setLoader(true);
      let res = await axios.post(
        `${SERVICE.LISTPAGEACCESSMODE_CREATE}`, // Replace this with your backend API URL
        {
          pages: finaldata, // Sending the array of objects
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`, // Include your API token
          },
        }
      );
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setDatas((prev) => ({
        ...prev,
        listpageaccessmode: "",
      }));
      await getCode();
      setIsBtn(false);
      setLoader(false);
    } catch (err) {
      setIsBtn(false);
      setLoader(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    getCode();
    fetchClientrole();
    // getAllDatas();
  }, []);

  const [descriptions, setDescriptions] = useState({});

  const handleDescriptionChange = (index, value) => {
    setDescriptions((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  //multiselect module/submodule/mainpage/subpage/subsubpage
  const [moduleOptions, setModuleOptions] = useState([]);
  const [subModuleOptions, setSubModuleOptions] = useState([]);
  const [mainPageoptions, setMainPageoptions] = useState([]);
  const [subPageoptions, setSubPageoptions] = useState([]);
  const [subSubPageoptions, setsubSubPageoptions] = useState([]);
  const [clientmanagerRoleDatas, setClientmanagerRoleDatas] = useState([]);

  const fetchClientrole = async () => {
    // setPageName(!pageName);
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

      setClientmanagerRoleDatas(mergedObject);
      setModuleOptions(
        mergedObject?.modulename?.map((data) => ({
          label: data,
          value: data,
        }))
      );

      return mergedObject;
    } catch (err) {
      console.log(err);
      setClientmanagerRoleDatas([]);
      setModuleOptions([]);
      let message = err?.response?.data?.message;
      if (message) {
        setPopupContentMalert(message);
        setPopupSeverityMalert("error");
        handleClickOpenPopupMalert();
      }
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //module

  //Module  Name multiselect
  const [selectedOptionsModuleName, setSelectedOptionsModuleName] = useState(
    []
  );
  let [valueModuleNameCat, setValueModuleNameCat] = useState([]);
  const [
    selectedModuleNameOptionsCateEdit,
    setSelectedModuleNameOptionsCateEdit,
  ] = useState([]);

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

  //Sub - Module  Name multiselect
  const [selectedOptionsSubModuleName, setSelectedOptionsSubModuleName] =
    useState([]);
  let [valueSubModuleNameCat, setValueSubModuleNameCat] = useState([]);

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

  //Main Page multiselect
  const [selectedOptionsMainPage, setSelectedOptionsMainPage] = useState([]);
  let [valueMainPageCat, setValueMainPageCat] = useState([]);

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

  //Sub Page multiselect
  const [selectedOptionsSubPage, setSelectedOptionsSubPage] = useState([]);
  let [valueSubPageCat, setValueSubPageCat] = useState([]);

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

  //SubSub Page multiselect
  const [selectedOptionsSubSubPage, setSelectedOptionsSubSubPage] = useState(
    []
  );
  let [valueSubSubPageCat, setValueSubSubPageCat] = useState([]);

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

  return (
    <Box>
      <Headtitle title={"LIST PAGE ACCESS MODE"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Manage List Page Access Mode"
        modulename="Setup"
        submodulename="List Page Access Mode"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("erole") && (
        <>
          <Box sx={{ ...userStyle.dialogbox, marginTop: "-50px" }}>
            <>
              <Grid container spacing={2}>
                <Grid item md={10} xs={12} sm={12}>
                  <Typography sx={userStyle.importheadtext}>
                    List Page Access Mode
                  </Typography>
                </Grid>
              </Grid>
              <br />

              <Grid container sx={{ justifyContent: "left" }} spacing={2}>
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
                    <Typography>
                      Sub-Module Name{" "}
                      {subModuleOptions?.length > 0 && (
                        <b style={{ color: "red" }}>*</b>
                      )}
                    </Typography>
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
                    <Typography>
                      Main Page Name{" "}
                      {mainPageoptions?.length > 0 && (
                        <b style={{ color: "red" }}>*</b>
                      )}
                    </Typography>
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
                    <Typography>
                      Sub-Page Name{" "}
                      {subPageoptions?.length > 0 && (
                        <b style={{ color: "red" }}>*</b>
                      )}
                    </Typography>
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
                    <Typography>
                      Sub-Sub-Page Name{" "}
                      {subSubPageoptions?.length > 0 && (
                        <b style={{ color: "red" }}>*</b>
                      )}
                    </Typography>
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
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>
                    List Page Access Mode<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl size="small" fullWidth>
                    {/* <TextArea
                      value={datas?.listpageaccessmode}
                      onChange={(e) => {
                        setDatas((prev) => ({
                          ...prev,
                          listpageaccessmode: e.target.value,
                        }));
                      }}
                    /> */}
                    <Selects
                      options={[
                        {
                          label: "Hierarchy Based",
                          value: "Hierarchy Based",
                        },
                        {
                          label: "Reporting to Based",
                          value: "Reporting to Based",
                        },
                        { label: "Overall", value: "Overall" },
                      ]}
                      styles={colourStyles}
                      placeholder="Please Select List Page Access Mode"
                      value={{
                        label:
                          datas?.listpageaccessmode ||
                          "Please Select List Page Access Mode",
                        value:
                          datas?.listpageaccessmode ||
                          "Please Select List Page Access Mode",
                      }}
                      onChange={(e) => {
                        setDatas((prev) => ({
                          ...prev,
                          listpageaccessmode: e.value,
                        }));
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br></br>
              <br></br>
              <br></br>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={2.5} lg={2.5}>
                  <LoadingButton
                    loading={isBtn}
                    variant="contained"
                    color="primary"
                    onClick={fetchSubmit}
                  >
                    Add
                  </LoadingButton>
                </Grid>
                <Grid item xs={12} sm={6} md={2.5} lg={2.5}>
                  <Button sx={userStyle.btncancel} onClick={handleclear}>
                    Clear
                  </Button>
                </Grid>
              </Grid>
              <br />
              <br />

              <Typography>
                <b>List Page Access Mode List </b>
              </Typography>
              <br></br>
              {loader ? (
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
                  {roleEditOptions.length > 0 &&
                    roleEditOptions.map((data, index) => {
                      return (
                        <Accordion key={data?.modulename}>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>
                              <b>{data?.modulename}</b>
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <TableContainer component={Paper}>
                              <Table>
                                <TableHead>
                                  <TableRow>
                                    <TableCell>
                                      <b>Module Name</b>
                                    </TableCell>
                                    <TableCell>
                                      <b>Sub-Module Name</b>
                                    </TableCell>
                                    <TableCell>
                                      <b>Main Page Name</b>
                                    </TableCell>
                                    <TableCell>
                                      <b>Sub-Page Name</b>
                                    </TableCell>
                                    <TableCell>
                                      <b>Sub-Sub-Page Name</b>
                                    </TableCell>
                                    <TableCell>
                                      <b>List Page Access Mode</b>
                                    </TableCell>
                                    <TableCell>
                                      <b>Actions</b>
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {data?.submodules?.map((data, index) => (
                                    <TableRow key={index}>
                                      <TableCell
                                        sx={{ fontSize: "1rem !important" }}
                                      >
                                        {data.modulename}
                                      </TableCell>
                                      <TableCell
                                        sx={{ fontSize: "1rem !important" }}
                                      >
                                        {data.submodulename}
                                      </TableCell>
                                      <TableCell
                                        sx={{ fontSize: "1rem !important" }}
                                      >
                                        {data.mainpagename}
                                      </TableCell>
                                      <TableCell
                                        sx={{ fontSize: "1rem !important" }}
                                      >
                                        {data.subpagename}
                                      </TableCell>
                                      <TableCell
                                        sx={{ fontSize: "1rem !important" }}
                                      >
                                        {data.subsubpagename}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          fontSize: "1rem !important",
                                          wordBreak: "break-word",
                                          width: "13rem",
                                        }}
                                      >
                                        {data.listpageaccessmode}
                                      </TableCell>
                                      {changeControl && getIndex === index ? (
                                        <>
                                          <TableCell>
                                            {/* <TextArea
                                          minRows={3}
                                          style={{ width: "13rem" }}
                                          placeholder="Please Enter the Description"
                                          value={descriptions[index]}
                                          onChange={(e) =>
                                            handleDescriptionChange(
                                              index,
                                              e.target.value
                                            )
                                          }
                                        /> */}
                                            <Selects
                                              options={[
                                                {
                                                  label: "Hierarchy Based",
                                                  value: "Hierarchy Based",
                                                },
                                                {
                                                  label: "Reporting to Based",
                                                  value: "Reporting to Based",
                                                },
                                                {
                                                  label: "Overall",
                                                  value: "Overall",
                                                },
                                              ]}
                                              //   styles={colourStyles}
                                              placeholder="Please Select List Page Access Mode"
                                              value={{
                                                label:
                                                  descriptions[index] ||
                                                  "Please Select List Page Access Mode",
                                                value:
                                                  descriptions[index] ||
                                                  "Please Select List Page Access Mode",
                                              }}
                                              onChange={(e) => {
                                                handleDescriptionChange(
                                                  index,
                                                  e.value
                                                );
                                              }}
                                              // Render menu outside of the accordion
                                              menuPortalTarget={document.body}
                                              styles={{
                                                menuPortal: (base) => ({
                                                  ...base,
                                                  zIndex: 9999, // Ensure it's above the accordion
                                                }),
                                              }}
                                            />
                                          </TableCell>
                                          <TableCell>
                                            <Button
                                              onClick={() =>
                                                UpdateControls(data?._id, index)
                                              }
                                            >
                                              <CheckCircleIcon />
                                            </Button>
                                          </TableCell>
                                        </>
                                      ) : (
                                        <>
                                          <TableCell>
                                            <Button
                                              onClick={() =>
                                                EditControls(
                                                  index,
                                                  data?.listpageaccessmode
                                                )
                                              }
                                            >
                                              <EditOutlined />
                                            </Button>
                                            <Button
                                              onClick={() => {
                                                setDeleteId(data?._id);
                                                handleClickOpen();
                                              }}
                                            >
                                              <DeleteOutlineOutlinedIcon />
                                            </Button>
                                          </TableCell>
                                        </>
                                      )}
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </AccordionDetails>
                        </Accordion>
                      );
                    })}
                </>
              )}
              <br />
              <br />
              <br />
            </>
          </Box>
        </>
      )}
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

      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={deleteData}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />

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
    </Box>
  );
}

export default ListPageAccessMode;
