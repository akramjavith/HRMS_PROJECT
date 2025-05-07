import { makeStyles } from "@material-ui/core";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  OutlinedInput,
  Typography
} from "@mui/material";
import axios from "axios";
import "jspdf-autotable";
import React, { useContext, useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Link, useNavigate } from "react-router-dom";
import Selects from "react-select";
import AlertDialog from "../../components/Alert";
import csvIcon from "../../components/Assets/CSV.png";
import excelIcon from "../../components/Assets/excel-icon.png";
import fileIcon from "../../components/Assets/file-icons.png";
import pdfIcon from "../../components/Assets/pdf-icon.png";
import wordIcon from "../../components/Assets/word-icon.png";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import { menuItems } from "../../components/menuItemsList";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import Webcamimage from "../asset/Webcameimageasset";
import CategoryMasterPopup from "./CategoryMasterPopup";

const useStyles = makeStyles((theme) => ({
  inputs: {
    display: "none",
  },
  preview: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: theme.spacing(2),
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));
function Raiseproblem() {
  const [billUploadedFiles, setBillUploadedFiles] = useState([]);
  const [uploadBills, setUploadBills] = useState([]);

  const handleDeleteFileDocumentEdit = (index) => {
    const newSelectedFiles = [...uploadBills];
    newSelectedFiles.splice(index, 1);
    setUploadBills(newSelectedFiles);
  };

  const handleDeleteUploadedBills = (index) => {
    setBillUploadedFiles((prevFiles) => {
      const fileToDelete = prevFiles[index];

      // Remove from uploadedFiles state
      return prevFiles.filter((_, i) => i !== index);
    });
  };

  const renderFilePreviewMulter = async (file) => {
    const url = window.URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  const [cateCode, setCatCode] = useState([]);
  const [allData, setAllData] = useState([]);
  let allUploadedFiles = [];

  const backPage = useNavigate();

  const deduction = [
    { label: "Corrections", value: "Corrections" },
    { label: "Existings", value: "Existings" },
    { label: "New", value: "New" },
  ];

  const priorityOptions = [
    { label: "Immediate", value: "Immediate" },
    { label: "Delay", value: "Delay" },
    { label: "Next Version", value: "Next Version" },
  ];
  const [btnSubmit, setBtnSubmit] = useState(false);
  const [raiseproblem, setRaiseproblem] = useState({
    mode: "Please Select Mode",
    priority: "Please Select Priority",
    modulename: "",
    submodulename: "",
    mainpagename: "",
    subpagename: "",
    subsubpagename: "",
  });

  const [singleSelectValues, setSingleSelectValues] = useState({
    module: "Please Select Module",
    submodule: "Please Select Sub Module",
    mainpage: "Please Select Main Page",
    subpage: "Please Select Sub Page",
    subsubpage: "Please Select Sub Sub Page",
    category: "Please Select Category",
    subcategory: "Please Select Sub Category",
  });
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [categoryMaster, setCategoryMaster] = useState([]);

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

  const getCategory = async () => {
    setPageName(!pageName)
    try {
      let response = await axios.get(`${SERVICE.CATEGORYMASTERGETALL}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCategoryMaster(response.data.categorymaster);
      setCategoryOptions(
        response.data.categorymaster.map((item) => ({
          label: item.categoryname,
          value: item.categoryname,
        }))
      );
      setStockCategoryAuto("");
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //alert model for stock category
  const [openviewalertstockcategory, setOpenviewalertstockcategory] =
    useState(false);
  const [stockCategoryAuto, setStockCategoryAuto] = useState("");
  // view model
  const handleClickOpenviewalertstockcategory = () => {
    setOpenviewalertstockcategory(true);
  };

  const handleCloseviewalertstockcategory = () => {
    setOpenviewalertstockcategory(false);
  };

  useEffect(() => {
    getCategory();
  }, [stockCategoryAuto]);

  let name = "create";
  const [currentText, setCurrentText] = useState("");
  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  const [showAlert, setShowAlert] = useState();

  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
    setBtnSubmit(false);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  const classes = useStyles();

  const [refImage, setRefImage] = useState([]);
  const [previewURL, setPreviewURL] = useState(null);
  const [refImageDrag, setRefImageDrag] = useState([]);
  const [valNum, setValNum] = useState(0);
  //webcam
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [getImg, setGetImg] = useState(null);
  const [isWebcamCapture, setIsWebcamCapture] = useState(false);

  const webcamClose = () => {
    setIsWebcamOpen(false);
    setGetImg("");
  };
  const webcamDataStore = () => {
    setIsWebcamCapture(true);
    webcamClose();
    setGetImg("");
  };

  // Upload Popup
  const [uploadPopupOpen, setUploadPopupOpen] = useState(false);
  const handleClickUploadPopupOpen = () => {
    setUploadPopupOpen(true);
  };
  const handleUploadPopupClose = () => {
    setUploadPopupOpen(false);
    setGetImg("");
    setRefImage([]);
    setPreviewURL(null);
    setRefImageDrag([]);
    setCapturedImages([]);
  };

  const getFileIcon = (fileName) => {
    const extension1 = fileName?.split(".").pop();
    switch (extension1) {
      case "pdf":
        return pdfIcon;
      case "doc":
      case "docx":
        return wordIcon;
      case "xls":
      case "xlsx":
        return excelIcon;
      case "csv":
        return csvIcon;
      default:
        return fileIcon;
    }
  };

  //reference images
  const handleInputChange = (event) => {
    const files = event.target.files;
    let newSelectedFiles = [...refImage];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check if the file is an image
      // if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        newSelectedFiles.push({
          name: file.name,
          size: file.size,
          type: file.type,
          preview: reader.result,
          base64: reader.result.split(",")[1],
        });
        setRefImage(newSelectedFiles);
      };
      reader.readAsDataURL(file);

    }
  };

  // const handleInputChangedocument = (event) => {
  //   const selectedFiles = Array.from(event.target.files); // Convert FileList to Array
  //   if (!selectedFiles.length) return;

  //   let largeFiles = []; // To store names of files larger than 1MB

  //   // Filter files that are <= 1MB (1,024,000 bytes)
  //   const filteredFiles = selectedFiles.filter((file) => {
  //     if (file.size > 1024000) {
  //       largeFiles.push(file.name); // Collect large file names
  //       return false;
  //     }
  //     return true;
  //   });

  //   // If there are large files, show a single popup message
  //   if (largeFiles.length > 0) {
  //     setPopupContentMalert(
  //       `The following files are larger than 1MB and will not be uploaded:\n${largeFiles.join(", ")}`
  //     );
  //     setPopupSeverityMalert("info");
  //     handleClickOpenPopupMalert();
  //   }

  //   if (filteredFiles.length === 0) return; // If no valid files, exit

  //   if (billUploadedFiles?.length > 0) {
  //     setBillUploadedFiles([])
  //     setUploadBills([{ file: filteredFiles[0] }]);
  //   } else {
  //     // Accept only one file, replacing any existing file
  //     setUploadBills([{ file: filteredFiles[0] }]);
  //   }
  // };

  const handleInputChangedocument = (event) => {
    const selectedFiles = Array.from(event.target.files); // Convert FileList to Array
    if (!selectedFiles.length) return;

    let largeFiles = []; // Store names of large files
    let validFiles = []; // Store valid files (≤1MB)

    // Filter out files larger than 1MB (1,024,000 bytes)
    selectedFiles.forEach((file) => {
      if (file.size > 1024000) {
        largeFiles.push(file.name);
      } else {
        validFiles.push({ file });
      }
    });

    // Show a warning popup if there are large files
    if (largeFiles.length > 0) {
      setPopupContentMalert(
        `The following files are larger than 1MB and will not be uploaded:\n${largeFiles.join(", ")}`
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }

    // If there are valid files, update state
    if (validFiles.length > 0) {
      setUploadBills((prevFiles) => [...prevFiles, ...validFiles]); // Append new files
    }
  };

  const handleDeleteFile = (index) => {
    const newSelectedFiles = [...refImage];
    newSelectedFiles.splice(index, 1);
    setRefImage(newSelectedFiles);
  };
  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };
  const removeCapturedImage = (index) => {
    const newCapturedImages = [...capturedImages];
    newCapturedImages.splice(index, 1);
    setCapturedImages(newCapturedImages);
  };
  const resetImage = () => {
    setGetImg("");
    setRefImage([]);
    setPreviewURL(null);
    setRefImageDrag([]);
    setCapturedImages([]);
  };

  const handleUploadOverAll = () => {
    setUploadPopupOpen(false);
  };


  //todo upload
  const [refImageedit, setRefImageedit] = useState([]);




  const handletododocumentchange = (e, field, index) => {
    setEditingIndexcheck(index);

    const newTodoscheck = [...todoscheck];
    newTodoscheck[index].document = e;

    setTodoscheck(newTodoscheck);
  };

  const [uploadPopupOpenedit, setUploadPopupOpenedit] = useState(false);

  const handleClickUploadPopupOpenedit = (index) => {
    setUploadPopupOpenedit(true);
    setEditingIndexcheck(index);
    setRefImageedit(todoscheck[index].files);
  };


  const { isUserRoleCompare, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);

  const [todoscheck, setTodoscheck] = useState([]);
  const [editingIndexcheck, setEditingIndexcheck] = useState(-1);

  const handleCreateTodocheck = () => {

    if (
      (currentText === "" || currentText === "<p><br></p>") &&
      refImage.length === 0
    ) {

      setPopupContentMalert("Please Enter Any Description or Upload Attachement");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      const newTodocheck = {
        document: currentText,
        files: allUploadedFiles.concat(uploadBills, billUploadedFiles),
      };
      setTodoscheck([...todoscheck, newTodocheck]);
      setRefImage([]);
      setPreviewURL(null);
      setCurrentText("");
      setBillUploadedFiles([])
      setUploadBills([])
    }

  };

  const handleDeleteTodocheck = (index) => {
    const newTodoscheck = [...todoscheck];
    newTodoscheck.splice(index, 1);
    setTodoscheck(newTodoscheck);
  };

  const [roleName, setRoleName] = useState("");
  const [rolesNewList, setRolesNewList] = useState([]);
  const [selectedModuleName, setSelectedModuleName] = useState([]);
  let [valueModule, setValueModule] = useState("");
  const [subModuleOptions, setSubModuleOptions] = useState([]);
  const [selectedSubModuleName, setSelectedSubModuleName] = useState([]);
  let [valueSubModule, setSubValueModule] = useState("");
  const [mainPageoptions, setMainPageoptions] = useState([]);
  const [selectedMainPageName, setSelectedMainPageName] = useState([]);
  let [valueMainPage, setValueMainPage] = useState("");
  const [subPageoptions, setSubPageoptions] = useState([]);
  const [subSubPageoptions, setsubSubPageoptions] = useState([]);
  const [selectedSubPageName, setSelectedSubPageName] = useState([]);
  const [selectedSubSubPageName, setSelectedSubSubPageName] = useState([]);
  let [valueSubPage, setValueSubPage] = useState("");
  let [valueSubSubPage, setValueSubSubPage] = useState("");
  const [selectedControls, setSelectedControls] = useState([]);
  const [moduleTitleNames, setModuleTitleNames] = useState([]);
  const [subModuleTitleNames, setSubModuleTitleNames] = useState([]);
  const [mainPageTitleNames, setMainPageTitleNames] = useState([]);
  const [subPageTitleNames, setSubPageTitleNames] = useState([]);
  const [subsubPageTitleNames, setSubSubPageTitleNames] = useState([]);
  const [controlTitleNames, setControlTitleNames] = useState([]);
  const [mainPageDbNames, setMainPageDbNames] = useState([]);

  //single select fetch Submodule
  const handleModuleNameChange = (modulename) => {
    const filteredMenuitems = menuItems.filter(
      (item) => item.title === modulename
    );

    const submodulerole = rolesNewList[0]?.submodulename?.map((item) => item);

    const filteredSubModulename = filteredMenuitems[0]?.submenu
      ?.filter((item) => submodulerole.includes(item.title))
      ?.map((item) => {
        return {
          label: item.title,
          value: item.title,
        };
      });

    setSubModuleOptions(filteredSubModulename);

    // setSelectedModuleName(options);
  };

  //single select fetch Main page
  const handleSubModuleNameChange = (modulename, submodulename) => {
    const filteredMenuitemsModuleName = menuItems.filter(
      (item) => item.title === modulename
    );

    const filteredMenuitemsSubModuleName =
      filteredMenuitemsModuleName[0]?.submenu?.filter(
        (item) => item.title === submodulename
      );

    const mainpagerole = rolesNewList[0]?.mainpagename?.map((item) => item);

    const filteredSubModulename = filteredMenuitemsSubModuleName[0]?.submenu
      ?.filter((item) => mainpagerole.includes(item.title))
      ?.map((item) => {
        return {
          label: item.title,
          value: item.title,
        };
      });

    setMainPageoptions(filteredSubModulename);
  };

  //single select fetch Sub page
  const handleMainPageNameChange = (modulename, submodulename, mainpage) => {
    const filteredMenuitemsModuleName = menuItems.filter(
      (item) => item.title === modulename
    );

    const filteredMenuitemsSubModuleName =
      filteredMenuitemsModuleName[0]?.submenu?.filter(
        (item) => item.title === submodulename
      );

    const filteredMenuitemsMainPage =
      filteredMenuitemsSubModuleName[0]?.submenu?.filter(
        (item) => item.title === mainpage
      );

    const subpagerole = rolesNewList[0]?.subpagename?.map((item) => item);

    const filteredSubModulename = filteredMenuitemsMainPage[0]?.submenu
      ?.filter((item) => subpagerole.includes(item.title))
      ?.map((item) => {
        return {
          label: item.title,
          value: item.title,
        };
      });

    setSubPageoptions(filteredSubModulename);
  };

  //single select fetch Sub Sub page
  const handleSubPageNameChange = (
    modulename,
    submodulename,
    mainpage,
    subpage
  ) => {
    const filteredMenuitemsModuleName = menuItems.filter(
      (item) => item.title === modulename
    );

    const filteredMenuitemsSubModuleName =
      filteredMenuitemsModuleName[0]?.submenu?.filter(
        (item) => item.title === submodulename
      );

    const filteredMenuitemsMainPage =
      filteredMenuitemsSubModuleName[0]?.submenu?.filter(
        (item) => item.title === mainpage
      );

    const filteredMenuitemsSubPage =
      filteredMenuitemsMainPage[0]?.submenu?.filter(
        (item) => item.title === subpage
      );

    const subpagerole = rolesNewList[0]?.subsubpagename?.map((item) => item);

    const filteredSubSubModulename = filteredMenuitemsSubPage[0]?.submenu
      ?.filter((item) => subpagerole.includes(item.title))
      ?.map((item) => {
        return {
          label: item.title,
          value: item.title,
        };
      });

    setsubSubPageoptions(filteredSubSubModulename);
  };




  //setting an Main Page names into array
  const handleMainPageChange = (options) => {
    setValueMainPage(
      options.map((a, index) => {
        return a.value;
      })
    );
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
        return !innerArray.title.startsWith("Add ");
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


  const { auth } = useContext(AuthContext);

  const { isUserRoleAccess } = useContext(UserRoleAccessContext);

  const username = isUserRoleAccess.username;

  const fetchRaise = async () => {
    setPageName(!pageName)
    try {
      let res_branch = await axios.get(SERVICE.RAISEPROBLEM, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCatCode(res_branch.data.raises);
      setAllData(res_branch.data.raises);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // get the current user role datas
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
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("RaiseProblem"),
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
    fetchRaise();
    getapi();
  }, []);
  useEffect(() => {
    fetchNewRoleList();
  }, [isUserRoleAccess]);

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

  //add function...
  const sendRequest = async () => {
    setBtnSubmit(true);
    setPageName(!pageName)

    try {
      let formData = new FormData();

      if (Array.isArray(todoscheck) && todoscheck.length > 0) {
        todoscheck.forEach((item, index) => {
          // Append the document field for each raisetodo entry
          formData.append(`raisetodo[${index}][document]`, item.document);

          // Append each file in the files array with a flat field name
          if (Array.isArray(item.files) && item.files.length > 0) {
            item.files.forEach((fileObj, fileIndex) => {
              if (fileObj?.file) {
                // Use a flat field name like `raisetodo_files_${index}_${fileIndex}`
                formData.append(`raisetodo_files_${index}_${fileIndex}`, fileObj?.file);
              }
            });
          }
        });
      }

      const jsonData = {
        mode: raiseproblem.mode,
        autoid: String(newval),
        status: String("Open"),
        priority: raiseproblem.priority,
        modulename:
          raiseproblem.mode === "New"
            ? raiseproblem.modulename
            : singleSelectValues.module,
        submodulename:
          raiseproblem.mode === "New"
            ? raiseproblem.submodulename
            : singleSelectValues.submodule,
        mainpagename:
          raiseproblem.mode === "New"
            ? raiseproblem.mainpagename
            : singleSelectValues.mainpage === "Please Select Main Page"
              ? ""
              : singleSelectValues.mainpage,
        subpagename:
          raiseproblem.mode === "New"
            ? raiseproblem.subpagename
            : singleSelectValues.subpage === "Please Select Sub Page"
              ? ""
              : singleSelectValues.subpage,
        subsubpagename:
          raiseproblem.mode === "New"
            ? raiseproblem.subsubpagename
            : singleSelectValues.subsubpage === "Please Select Sub Sub Page"
              ? ""
              : singleSelectValues.subsubpage,
        category:
          singleSelectValues.category === "Please Select Category"
            ? ""
            : singleSelectValues.category,
        subcategory:
          singleSelectValues.subcategory === "Please Select Sub Category"
            ? ""
            : singleSelectValues.subcategory,
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
        createdby: String(isUserRoleAccess?.username),
        createdbycompany: String(isUserRoleAccess?.company),
        createdbyemail: String(isUserRoleAccess?.email),
        createdbycontactnumber: String(isUserRoleAccess?.emergencyno),
      }

      formData.append("jsonData", JSON.stringify(jsonData));

      let roles = await axios.post(`${SERVICE.RAISEPROBLEM_CREATE}`, formData, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      // await fetchNewRoleList();
      setBtnSubmit(false);
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
      setTodoscheck([]);
      await fetchRaise();
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setTimeout(() => {
        backPage("/production/raiseproblemlist");
      }, 1000);
    } catch (err) {
      setBtnSubmit(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const handleSubmit = () => {
    if (raiseproblem.mode === "Please Select Mode") {

      setPopupContentMalert("Please Select Mode");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (raiseproblem.priority === "Please Select Priority") {

      setPopupContentMalert("Please Select Priority");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (raiseproblem.mode === "New" && raiseproblem.modulename === "") {

      setPopupContentMalert("Please Enter Module Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      raiseproblem.mode === "New" &&
      raiseproblem.submodulename === ""
    ) {

      setPopupContentMalert("Please Enter Sub Module Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      raiseproblem.mode !== "New" &&
      singleSelectValues.module === "Please Select Module"
    ) {

      setPopupContentMalert("Please Select Module");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      raiseproblem.mode !== "New" &&
      singleSelectValues.submodule === "Please Select Sub Module"
    ) {
      setPopupContentMalert("Please Select Sub Module");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (todoscheck.length == 0) {

      setPopupContentMalert("Please Add Any Data in Todo");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      (currentText != "<p><br></p>" && currentText != "") ||
      refImage.length > 0
    ) {
      setPopupContentMalert("Please Add The Todo And Submit");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      todoscheck?.some(
        (data) =>
          (data?.document === "" || data?.document === "<p><br></p>") &&
          data?.files.length === 0
      )
    ) {

      setPopupContentMalert("Please Fill All the todos and Submit");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }

    else {
      sendRequest();
    }
  };

  const handleClear = () => {
    setRoleName("");
    setSelectedModuleName([]);
    setSelectedSubModuleName([]);
    setSelectedMainPageName([]);
    setSelectedSubPageName([]);
    setSelectedControls([]);
    setMainPageDbNames([]);
    setControlTitleNames([]);
    setSelectedSubSubPageName([]);
    setTodoscheck([]);

    setValueModule([]);
    setModuleTitleNames([]);

    setSubValueModule([]);
    setSubModuleTitleNames([]);
    setSubModuleOptions([]);

    setValueMainPage([]);
    setMainPageTitleNames([]);
    setMainPageoptions([]);

    setValueSubPage([]);
    setSubPageTitleNames([]);
    setSubPageoptions([]);

    setValueSubSubPage([]);
    setSubSubPageTitleNames([]);
    setsubSubPageoptions([]);

    setCurrentText("");

    setSingleSelectValues({
      module: "Please Select Module",
      submodule: "Please Select Sub Module",
      mainpage: "Please Select Main Page",
      subpage: "Please Select Sub Page",
      subsubpage: "Please Select Sub Sub Page",
      category: "Please Select Category",
      subcategory: "Please Select Sub Category",
    });

    setRaiseproblem({
      mode: "Please Select Mode",
      priority: "Please Select Priority",
      modulename: "",
      submodulename: "",
      mainpagename: "",
      subpagename: "",
      subsubpagename: "",
    });
    setRefImage([])
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  const [getModuleNameEdit, setgetModuleNameEdit] = useState([]);

  const [getMainPageNamesEdit, setgetMainPageNamesEdit] = useState([]);
  const [selectedMainPageNameEdit, setSelectedMainPageNameEdit] = useState([]);
  const [getSubPageNameEdit, setgetSubPageNameEdit] = useState([]);


  const submoduleDrop =
    menuItems.length > 0 &&
    menuItems
      ?.filter((data) => getModuleNameEdit.includes(data.title))
      .map((data) => data.submenu);
  const submoduleEditCheck =
    submoduleDrop.length > 0 && [].concat(...submoduleDrop);

  const mainPage =
    submoduleEditCheck.length > 0 &&
    submoduleEditCheck
      .map((data) => data.submenu)
      .filter(Boolean)
      .flat();
  const mainPageOptionsEditDef =
    mainPage.length > 0
      ? mainPage.map((data) => ({
        ...data,
        label: data.title,
        value: data.title,
      }))
      : [];

  const subpage =
    mainPage.length > 0 &&
    mainPage.filter((data) => getMainPageNamesEdit.includes(data.title));



  let newval = "RUP0001";

  const renderFilePreviewMulterUploaded = async (file) => {
    if (!file) return false;
    const imageUrl = `${SERVICE.VEIW_SUPPORT_FILES}/${file.filename}`;
    window.open(imageUrl, '_blank'); // Open image in a new tab
  };

  return (
    <Box>
      <Headtitle title={"RAISE PROBLEM"} />
      <PageHeading
        title="Raise Problem"
        modulename="Support"
        submodulename="Raise Problem"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("araiseproblem") && (
        <Box sx={userStyle.dialogbox}>
          <Grid container spacing={2}>
            <Grid item md={12} xs={12}>
              <Typography sx={userStyle.HeaderText}>Add Raise Problem</Typography>
            </Grid>
            {cateCode &&
              cateCode.map(() => {
                let strings = "RUP";
                let refNo = cateCode[cateCode.length - 1].autoid;
                let digits = (cateCode.length + 1).toString();
                const stringLength = refNo.length;
                let lastChar = refNo.charAt(stringLength - 1);
                let getlastBeforeChar = refNo.charAt(stringLength - 2);
                let getlastThreeChar = refNo.charAt(stringLength - 3);
                let lastBeforeChar = refNo.slice(-2);
                let lastThreeChar = refNo.slice(-3);
                let lastDigit = refNo.slice(-4);
                let refNOINC = parseInt(lastChar) + 1;
                let refLstTwo = parseInt(lastBeforeChar) + 1;
                let refLstThree = parseInt(lastThreeChar) + 1;
                let refLstDigit = parseInt(lastDigit) + 1;

                if (digits.length < 4 && getlastBeforeChar == 0 && getlastThreeChar == 0) {
                  refNOINC = ("000" + refNOINC).slice(-4);
                  newval = strings + refNOINC;
                } else if (digits.length < 4 && getlastBeforeChar > 0 && getlastThreeChar == 0) {
                  refNOINC = ("00" + refLstTwo).slice(-4);
                  newval = strings + refNOINC;
                } else if (digits.length < 4 && getlastThreeChar > 0) {
                  refNOINC = ("0" + refLstThree).slice(-4);
                  newval = strings + refNOINC;
                } else {
                  refNOINC = String(refLstDigit).padStart(4, "0"); // Convert to string and pad with leading zeros
                  newval = strings + refNOINC;
                }
              })}
            <Grid item md={4} xs={12} sm={12}>
              <FormControl size="small" fullWidth>
                <Typography>
                  Mode <b style={{ color: "red" }}>*</b>
                </Typography>
                <Selects
                  options={deduction}
                  styles={colourStyles}
                  value={{ label: raiseproblem.mode, value: raiseproblem.mode }}
                  onChange={(e) => {
                    setRaiseproblem({ ...raiseproblem, mode: e.value });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Priority<b style={{ color: "red" }}>*</b>
                </Typography>
                <Selects
                  options={priorityOptions}
                  styles={colourStyles}
                  value={{
                    label: raiseproblem.priority,
                    value: raiseproblem.priority,
                  }}
                  onChange={(e) => {
                    setRaiseproblem({ ...raiseproblem, priority: e.value });
                  }}
                />
              </FormControl>
            </Grid>
            {raiseproblem.mode === "New" ? (
              <>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      {" "}
                      Module Name<b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Module"
                      value={raiseproblem.modulename}
                      onChange={(e) => {
                        setRaiseproblem({
                          ...raiseproblem,
                          modulename: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
              </>
            ) : (
              <Grid item md={4} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Module Name <b style={{ color: "red" }}>*</b>
                  </Typography>

                  <Selects
                    options={rolesNewList[0]?.modulename?.map((item) => {
                      return { label: item, value: item };
                    })}
                    styles={colourStyles}
                    value={{
                      label: singleSelectValues.module,
                      value: singleSelectValues.module,
                    }}
                    onChange={(e) => {
                      setSingleSelectValues({
                        ...singleSelectValues,
                        module: e.value,
                        submodule: "Please Select Sub Module",
                        mainpage: "Please Select Main Page",
                        subpage: "Please Select Sub Page",
                        subsubpage: "Please Select Sub Sub Page",
                        category: "Please Select Category",
                        subcategory: "Please Select Sub Category",
                      });
                      handleModuleNameChange(e.value);
                      setMainPageoptions([]);
                      setSubPageoptions([]);
                      setsubSubPageoptions([]);
                    }}
                  />
                </FormControl>
              </Grid>
            )}

            {raiseproblem.mode === "New" ? (
              <>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      {" "}
                      Sub Module Name<b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter SubModule"
                      value={raiseproblem.submodulename}
                      onChange={(e) => {
                        setRaiseproblem({
                          ...raiseproblem,
                          submodulename: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
              </>
            ) : (
              <Grid item md={4} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Sub Module Name<b style={{ color: "red" }}>*</b>
                  </Typography>

                  <Selects

                    options={subModuleOptions}
                    styles={colourStyles}
                    value={{
                      label: singleSelectValues.submodule,
                      value: singleSelectValues.submodule,
                    }}
                    onChange={(e) => {
                      setSingleSelectValues({
                        ...singleSelectValues,
                        submodule: e.value,
                        mainpage: "Please Select Main Page",
                        subpage: "Please Select Sub Page",
                        subsubpage: "Please Select Sub Sub Page",
                        category: "Please Select Category",
                        subcategory: "Please Select Sub Category",
                      });
                      handleSubModuleNameChange(
                        singleSelectValues.module,
                        e.value
                      );
                      setSubPageoptions([]);
                      setsubSubPageoptions([]);
                    }}
                  />
                </FormControl>
              </Grid>
            )}
            {raiseproblem.mode === "New" ? (
              <>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography> Main Page </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter MainPage"
                      value={raiseproblem.mainpagename}
                      onChange={(e) => {
                        setRaiseproblem({
                          ...raiseproblem,
                          mainpagename: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
              </>
            ) : (
              <Grid item md={4} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Main Page</Typography>

                  <Selects
                    options={mainPageoptions}
                    styles={colourStyles}
                    value={{
                      label: singleSelectValues.mainpage,
                      value: singleSelectValues.mainpage,
                    }}
                    onChange={(e) => {
                      setSingleSelectValues({
                        ...singleSelectValues,
                        mainpage: e.value,
                        subpage: "Please Select Sub Page",
                        subsubpage: "Please Select Sub Sub Page",
                        category: "Please Select Category",
                        subcategory: "Please Select Sub Category",
                      });
                      handleMainPageChange([e]);
                      handleMainPageNameChange(
                        singleSelectValues.module,
                        singleSelectValues.submodule,
                        e.value
                      );
                      setsubSubPageoptions([]);
                    }}
                  />
                </FormControl>
              </Grid>
            )}
            {raiseproblem.mode === "New" ? (
              <>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography> Sub Page </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter SubPage "
                      value={raiseproblem.subpagename}
                      onChange={(e) => {
                        setRaiseproblem({
                          ...raiseproblem,
                          subpagename: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
              </>
            ) : (
              <Grid item md={4} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Sub Page</Typography>

                  <Selects
                    options={subPageoptions}
                    styles={colourStyles}
                    value={{
                      label: singleSelectValues.subpage,
                      value: singleSelectValues.subpage,
                    }}
                    onChange={(e) => {
                      setSingleSelectValues({
                        ...singleSelectValues,
                        subpage: e.value,
                        subsubpage: "Please Select Sub Sub Page",
                        category: "Please Select Category",
                        subcategory: "Please Select Sub Category",
                      });
                      handleSubPageNameChange(
                        singleSelectValues.module,
                        singleSelectValues.submodule,
                        singleSelectValues.mainpage,
                        e.value
                      );
                    }}
                  />
                </FormControl>
              </Grid>
            )}

            {raiseproblem.mode === "New" ? (
              <>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Sub Sub-Page</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter SubSub-Page"
                      value={raiseproblem.subsubpagename}
                      onChange={(e) => {
                        setRaiseproblem({
                          ...raiseproblem,
                          subsubpagename: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
              </>
            ) : (
              <Grid item md={4} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Sub Sub-Page</Typography>
                  <Selects
                    options={subSubPageoptions}
                    styles={colourStyles}
                    value={{
                      label: singleSelectValues.subsubpage,
                      value: singleSelectValues.subsubpage,
                    }}
                    onChange={(e) => {
                      setSingleSelectValues({
                        ...singleSelectValues,
                        subsubpage: e.value,
                        category: "Please Select Category",
                        subcategory: "Please Select Sub Category",
                      });
                    }}
                  />
                </FormControl>
              </Grid>
            )}
            <Grid item md={3.5} sm={12} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Category</Typography>
                <Selects
                  options={categoryOptions}
                  styles={colourStyles}
                  value={{
                    label: singleSelectValues.category,
                    value: singleSelectValues.category,
                  }}
                  onChange={(e) => {
                    setSingleSelectValues({
                      ...singleSelectValues,
                      category: e.value,
                      subcategory: "Please Select Sub Category",
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={0.5} sm={1} xs={1}>
              {isUserRoleCompare?.includes("acategorymaster") && (
                <Button
                  variant="contained"
                  style={{
                    height: "30px",
                    minWidth: "20px",
                    padding: "19px 13px",
                    color: "white",
                    marginTop: "23px",
                    marginLeft: "-10px",
                    background: "rgb(25, 118, 210)",
                  }}
                  onClick={() => {
                    handleClickOpenviewalertstockcategory();
                  }}
                >
                  <FaPlus style={{ fontSize: "15px" }} />
                </Button>
              )}
            </Grid>
            <Grid item md={4} sm={12} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Sub Category</Typography>
                <Selects
                  options={categoryMaster
                    .filter(
                      (item) =>
                        item.categoryname === singleSelectValues.category
                    )
                    .map((item) => {
                      return item.subcategoryname.map((subCatName) => ({
                        label: subCatName,
                        value: subCatName,
                      }));
                    })
                    .flat()}
                  styles={colourStyles}
                  value={{
                    label: singleSelectValues.subcategory,
                    value: singleSelectValues.subcategory,
                  }}
                  onChange={(e) => {
                    setSingleSelectValues({
                      ...singleSelectValues,
                      subcategory: e.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>

            <>
              <Grid item md={6} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    <b> Description </b>
                  </Typography>
                  <ReactQuill
                    style={{ height: "180px" }}
                    value={currentText}
                    onChange={(e) => {
                      setCurrentText(e);
                    }}
                    modules={{
                      toolbar: [
                        [{ header: "1" }, { header: "2" }, { font: [] }],
                        [{ size: [] }],
                        ["bold", "italic", "underline", "strike", "blockquote"],
                        [
                          { list: "ordered" },
                          { list: "bullet" },
                          { indent: "-1" },
                          { indent: "+1" },
                        ],
                        ["link", "image", "video"],
                        ["clean"],
                      ],
                    }}
                    formats={[
                      "header",
                      "font",
                      "size",
                      "bold",
                      "italic",
                      "underline",
                      "strike",
                      "blockquote",
                      "list",
                      "bullet",
                      "indent",
                      "link",
                      "image",
                      "video",
                    ]}
                  />
                </FormControl>
              </Grid>
            </>

            <br />

            <Grid item md={4} xs={12} sm={12}>
              <Typography>Attachment</Typography>
              <Box sx={{ display: "flex", justifyContent: "left" }}>
                <Button
                  variant="contained"
                  onClick={handleClickUploadPopupOpen}
                  sx={buttonStyles.buttonsubmit}
                >
                  Upload
                </Button>
              </Box>
              <Grid item md={12} xs={12} sm={12}>
                {/* {refImage.map((file, index) => (
                  <Grid container key={index}>
                    <Grid item md={2} sm={2} xs={2}>
                      <Box
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {file.type.includes("image/") ? (
                          <img
                            src={file.preview}
                            alt={file.name}
                            height={50}
                            style={{
                              maxWidth: "-webkit-fill-available",
                            }}
                          />
                        ) : (
                          <img
                            className={classes.preview}
                            src={getFileIcon(file.name)}
                            height="10"
                            alt="file icon"
                          />
                        )}
                      </Box>
                    </Grid>
                    <Grid
                      item
                      md={7}
                      sm={7}
                      xs={7}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="subtitle2"> {file.name} </Typography>
                    </Grid>
                    <Grid item md={1} sm={1} xs={1}>
                      <Grid sx={{ display: "flex" }}>
                        <Button
                          sx={{
                            padding: "14px 14px",
                            minWidth: "40px !important",
                            borderRadius: "50% !important",
                            ":hover": {
                              backgroundColor: "#80808036", // theme.palette.primary.main
                            },
                          }}
                          onClick={() => renderFilePreview(file)}
                        >
                          <VisibilityOutlinedIcon
                            style={{ fontsize: "12px", color: "#357AE8" }}
                          />
                        </Button>

                      </Grid>
                    </Grid>
                  </Grid>
                ))} */}
                {uploadBills?.length > 0 && uploadBills?.map((data, index) => (
                  <>
                    <Grid container>
                      <Grid item md={2} sm={2} xs={2}>
                        <Box
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >

                          <img
                            className={classes.preview}
                            src={getFileIcon(data.name || data.file.name)}
                            height="25"
                            alt="file icon"
                          />
                          {/* )} */}
                        </Box>
                      </Grid>
                      <Grid
                        item
                        md={8}
                        sm={8}
                        xs={8}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="subtitle2">
                          {data.name || data.file.name}{" "}
                        </Typography>
                      </Grid>
                      <Grid item md={2} sm={2} xs={2}>
                        <Button
                          sx={{
                            padding: "14px 14px",
                            minWidth: "40px !important",
                            borderRadius: "50% !important",
                            ":hover": {
                              backgroundColor: "#80808036", // theme.palette.primary.main
                            },
                          }}
                        >
                          <VisibilityOutlinedIcon
                            style={{
                              fontsize: "large",
                              color: "#357AE8",
                            }}
                            onClick={() => renderFilePreviewMulter(data.file)}
                          />
                        </Button>
                      </Grid>
                    </Grid>
                  </>
                ))}
                {billUploadedFiles?.length > 0 && billUploadedFiles?.map((data, index) => (
                  <>
                    <Grid container>
                      <Grid item md={2} sm={2} xs={2}>
                        <Box
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >

                          <img
                            className={classes.preview}
                            src={getFileIcon(data.name || data.file.name)}
                            height="25"
                            alt="file icon"
                          />
                          {/* )} */}
                        </Box>
                      </Grid>
                      <Grid
                        item
                        md={8}
                        sm={8}
                        xs={8}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="subtitle2">
                          {data.name || data.file.name}{" "}
                        </Typography>
                      </Grid>
                      <Grid item md={2} sm={2} xs={2}>
                        <Button
                          sx={{
                            padding: "14px 14px",
                            minWidth: "40px !important",
                            borderRadius: "50% !important",
                            ":hover": {
                              backgroundColor: "#80808036", // theme.palette.primary.main
                            },
                          }}
                        >
                          <VisibilityOutlinedIcon
                            style={{
                              fontsize: "large",
                              color: "#357AE8",
                            }}
                            onClick={() => renderFilePreviewMulterUploaded(data)}
                          />
                        </Button>


                      </Grid>
                    </Grid>
                  </>
                ))}
              </Grid>
            </Grid>
            <Grid item md={1} sm={2} xs={12} marginTop={3.5}>
              <Button
                variant="contained"
                sx={{ minWidth: "35px" }}
                onClick={handleCreateTodocheck}
              >
                <FaPlus />
              </Button>
            </Grid>
          </Grid>
          <br />
          <br />
          <br />
          {todoscheck?.length > 0 &&
            todoscheck.map((todo, index) => (
              <div key={index}>
                <br />
                <br />
                <br />
                <Grid container spacing={1}>
                  <Grid item md={6} sm={4} xs={4}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        <b> Problem {index + 1} </b>
                      </Typography>
                      <ReactQuill
                        style={{ height: "180px" }}
                        value={todo.document}
                        onChange={(e) => {
                          handletododocumentchange(e, "document", index);
                        }}
                        modules={{
                          toolbar: [
                            [{ header: "1" }, { header: "2" }, { font: [] }],
                            [{ size: [] }],
                            [
                              "bold",
                              "italic",
                              "underline",
                              "strike",
                              "blockquote",
                            ],
                            [
                              { list: "ordered" },
                              { list: "bullet" },
                              { indent: "-1" },
                              { indent: "+1" },
                            ],
                            ["link", "image", "video"],
                            ["clean"],
                          ],
                        }}
                        formats={[
                          "header",
                          "font",
                          "size",
                          "bold",
                          "italic",
                          "underline",
                          "strike",
                          "blockquote",
                          "list",
                          "bullet",
                          "indent",
                          "link",
                          "image",
                          "video",
                        ]}
                      />
                    </FormControl>
                  </Grid>
                  <br />
                  <br />
                  <Grid item md={4} sm={6} xs={6}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "left",
                        marginTop: "30px",
                      }}
                    >
                      <Button
                        variant="contained"
                        onClick={() => handleClickUploadPopupOpenedit(index)}
                        sx={buttonStyles.buttonsubmit}
                      >
                        Upload
                      </Button>
                    </Box>
                    <Grid item md={12} xs={12} sm={12}>
                      {todo.files.map((data, index) => (
                        // <Grid container key={index}>
                        //   <Grid item md={2} sm={2} xs={2}>
                        //     <Box
                        //       style={{
                        //         display: "flex",
                        //         justifyContent: "center",
                        //         alignItems: "center",
                        //       }}
                        //     >
                        //       {file.type.includes("image/") ? (
                        //         <img
                        //           src={file.preview}
                        //           alt={file.name}
                        //           height={50}
                        //           style={{
                        //             maxWidth: "-webkit-fill-available",
                        //           }}
                        //         />
                        //       ) : (
                        //         <img
                        //           className={classes.preview}
                        //           src={getFileIcon(file.name)}
                        //           height="10"
                        //           alt="file icon"
                        //         />
                        //       )}
                        //     </Box>
                        //   </Grid>
                        //   <Grid
                        //     item
                        //     md={7}
                        //     sm={7}
                        //     xs={7}
                        //     sx={{
                        //       display: "flex",
                        //       justifyContent: "center",
                        //       alignItems: "center",
                        //     }}
                        //   >
                        //     <Typography variant="subtitle2">
                        //       {" "}
                        //       {file.name}{" "}
                        //     </Typography>
                        //   </Grid>
                        //   <Grid item md={1} sm={1} xs={1}>
                        //     <Grid sx={{ display: "flex" }}>
                        //       <Button
                        //         sx={{
                        //           padding: "14px 14px",
                        //           minWidth: "40px !important",
                        //           borderRadius: "50% !important",
                        //           ":hover": {
                        //             backgroundColor: "#80808036", // theme.palette.primary.main
                        //           },
                        //         }}
                        //         onClick={() => renderFilePreview(file)}
                        //       >
                        //         <VisibilityOutlinedIcon
                        //           style={{ fontsize: "12px", color: "#357AE8" }}
                        //         />
                        //       </Button>

                        //     </Grid>
                        //   </Grid>
                        // </Grid>
                        <Grid container>
                          <Grid item md={2} sm={2} xs={2}>
                            <Box
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >

                              <img
                                className={classes.preview}
                                src={getFileIcon(data.name || data.file.name)}
                                height="25"
                                alt="file icon"
                              />
                              {/* )} */}
                            </Box>
                          </Grid>
                          <Grid
                            item
                            md={8}
                            sm={8}
                            xs={8}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="subtitle2">
                              {data.name || data.file.name}{" "}
                            </Typography>
                          </Grid>
                          <Grid item md={2} sm={2} xs={2}>
                            <Button
                              sx={{
                                padding: "14px 14px",
                                minWidth: "40px !important",
                                borderRadius: "50% !important",
                                ":hover": {
                                  backgroundColor: "#80808036", // theme.palette.primary.main
                                },
                              }}
                            >
                              <VisibilityOutlinedIcon
                                style={{
                                  fontsize: "large",
                                  color: "#357AE8",
                                }}
                                onClick={() => renderFilePreviewMulter(data.file)}
                              />
                            </Button>
                          </Grid>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                  <Grid item md={2} sm={6} xs={6}>
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
                      onClick={() => handleDeleteTodocheck(index)}
                    >
                      <FaTrash
                        style={{
                          color: "#b92525",
                          fontSize: "1.2rem",
                        }}
                      />
                    </Button>
                  </Grid>
                </Grid>

                <br />
              </div>
            ))}
          <br /> <br />
          <br /> <br />
          <Grid
            container
            spacing={2}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Grid item md={1} sm={2} xs={12}>

              <LoadingButton
                sx={{
                  ...buttonStyles.buttonsubmit,
                  marginLeft: "10px",
                }}
                variant="contained"
                loading={btnSubmit}
                style={{ minWidth: "0px" }}
                onClick={handleSubmit}
              >
                SAVE
              </LoadingButton>
            </Grid>
            <Grid item md={1} sm={2} xs={12}>
              <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                Clear
              </Button>
            </Grid>
            <Grid item md={1} sm={2} xs={12}>
              <Link
                to="/production/raiseproblemlist"
                style={{
                  textDecoration: "none",
                  color: "white",
                  float: "right",
                }}
              >
                <Button sx={buttonStyles.btncancel}>Cancel</Button>
              </Link>
            </Grid>
          </Grid>
        </Box>
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
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* Upload Files DIALOG */}
      <Dialog
        open={uploadPopupOpen}
        onClose={handleUploadPopupClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        fullWidth={true}
        sx={{ marginTop: "80px" }}
      >
        <DialogTitle
          id="customized-dialog-title1"
          sx={{ backgroundColor: "#e0e0e0", color: "#000", display: "flex" }}
        >
          Upload Files
        </DialogTitle>
        <DialogContent sx={{ minWidth: "750px", height: "850px" }}>
          <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}></Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <br />
              <FormControl size="small" fullWidth>
                <Grid sx={{ display: "flex" }}>
                  {/* {showUploadBtn ? ( */}
                  <Button
                    variant="contained"
                    component="label"
                    sx={buttonStyles.buttonsubmit}
                  >
                    Upload
                    <input
                      type="file"
                      multiple
                      id="productimage"
                      accept=".xlsx, .xls, .csv, .pdf, .doc, .docx, .txt, .png, image/*"
                      hidden
                      onChange={handleInputChangedocument}
                    />
                  </Button>
                </Grid>
              </FormControl>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              {/* {isWebcamCapture == true &&
                capturedImages.map((image, index) => (
                  <Grid container key={index}>
                    <Grid item md={2} sm={2} xs={12}>
                      <Box
                        style={{
                          isplay: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginLeft: "37px",
                        }}
                      >
                        <img
                          src={image.preview}
                          alt={image.name}
                          height={50}
                          style={{ maxWidth: "-webkit-fill-available" }}
                        />
                      </Box>
                    </Grid>
                    <Grid
                      item
                      md={7}
                      sm={7}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="subtitle2">
                        {" "}
                        {image.name}{" "}
                      </Typography>
                    </Grid>
                    <Grid item md={1} sm={1} xs={12}>
                      <Grid sx={{ display: "flex" }}>
                        <Button
                          sx={{
                            marginTop: "15px !important",
                            padding: "14px 14px",
                            minWidth: "40px !important",
                            borderRadius: "50% !important",
                            ":hover": {
                              backgroundColor: "#80808036", // theme.palette.primary.main
                            },
                          }}
                          onClick={() => renderFilePreview(image)}
                        >
                          <VisibilityOutlinedIcon
                            style={{
                              fontsize: "12px",
                              color: "#357AE8",
                              marginTop: "35px !important",
                            }}
                          />
                        </Button>
                        <Button
                          sx={{
                            marginTop: "15px !important",
                            padding: "14px 14px",
                            minWidth: "40px !important",
                            borderRadius: "50% !important",
                            ":hover": {
                              backgroundColor: "#80808036",
                            },
                          }}
                          onClick={() => removeCapturedImage(index)}
                        >
                          <FaTrash
                            style={{
                              color: "#a73131",
                              fontSize: "12px",
                              marginTop: "35px !important",
                            }}
                          />
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
              {refImage.map((file, index) => (
                <Grid container key={index}>
                  <Grid item md={2} sm={2} xs={2}>
                    <Box
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {file.type.includes("image/") ? (
                        <img
                          src={file.preview}
                          alt={file.name}
                          height={50}
                          style={{
                            maxWidth: "-webkit-fill-available",
                          }}
                        />
                      ) : (
                        <img
                          className={classes.preview}
                          src={getFileIcon(file.name)}
                          height="10"
                          alt="file icon"
                        />
                      )}
                    </Box>
                  </Grid>
                  <Grid
                    item
                    md={7}
                    sm={7}
                    xs={7}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="subtitle2"> {file.name} </Typography>
                  </Grid>
                  <Grid item md={1} sm={1} xs={1}>
                    <Grid sx={{ display: "flex" }}>
                      <Button
                        sx={{
                          padding: "14px 14px",
                          minWidth: "40px !important",
                          borderRadius: "50% !important",
                          ":hover": {
                            backgroundColor: "#80808036", // theme.palette.primary.main
                          },
                        }}
                        onClick={() => renderFilePreview(file)}
                      >
                        <VisibilityOutlinedIcon
                          style={{ fontsize: "12px", color: "#357AE8" }}
                        />
                      </Button>
                      <Button
                        sx={{
                          padding: "14px 14px",
                          minWidth: "40px !important",
                          borderRadius: "50% !important",
                          ":hover": {
                            backgroundColor: "#80808036", // theme.palette.primary.main
                          },
                        }}
                        onClick={() => handleDeleteFile(index)}
                      >
                        <FaTrash
                          style={{ color: "#a73131", fontSize: "12px" }}
                        />
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              ))} */}
              {uploadBills?.length > 0 && uploadBills?.map((data, index) => (
                <>
                  <Grid container>
                    <Grid item md={2} sm={2} xs={2}>
                      <Box
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >

                        <img
                          className={classes.preview}
                          src={getFileIcon(data.name || data.file.name)}
                          height="25"
                          alt="file icon"
                        />
                        {/* )} */}
                      </Box>
                    </Grid>
                    <Grid
                      item
                      md={8}
                      sm={8}
                      xs={8}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="subtitle2">
                        {data.name || data.file.name}{" "}
                      </Typography>
                    </Grid>
                    <Grid item md={2} sm={2} xs={2}>
                      <Button
                        sx={{
                          padding: "14px 14px",
                          minWidth: "40px !important",
                          borderRadius: "50% !important",
                          ":hover": {
                            backgroundColor: "#80808036", // theme.palette.primary.main
                          },
                        }}
                      >
                        <VisibilityOutlinedIcon
                          style={{
                            fontsize: "large",
                            color: "#357AE8",
                          }}
                          onClick={() => renderFilePreviewMulter(data.file)}
                        />
                      </Button>

                      <Button
                        sx={{
                          padding: "14px 14px",
                          minWidth: "40px !important",
                          borderRadius: "50% !important",
                          ":hover": {
                            backgroundColor: "#80808036", // theme.palette.primary.main
                          },
                        }}
                        onClick={() =>
                          handleDeleteFileDocumentEdit(index)
                        }
                      >
                        <FaTrash
                          style={{
                            fontSize: "medium",
                            color: "#a73131",
                          }}
                        />
                      </Button>
                    </Grid>
                  </Grid>
                </>
              ))}
              {billUploadedFiles?.length > 0 && billUploadedFiles?.map((data, index) => (
                <>
                  <Grid container>
                    <Grid item md={2} sm={2} xs={2}>
                      <Box
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >

                        <img
                          className={classes.preview}
                          src={getFileIcon(data.name || data.file.name)}
                          height="25"
                          alt="file icon"
                        />
                        {/* )} */}
                      </Box>
                    </Grid>
                    <Grid
                      item
                      md={8}
                      sm={8}
                      xs={8}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="subtitle2">
                        {data.name || data.file.name}{" "}
                      </Typography>
                    </Grid>
                    <Grid item md={2} sm={2} xs={2}>
                      <Button
                        sx={{
                          padding: "14px 14px",
                          minWidth: "40px !important",
                          borderRadius: "50% !important",
                          ":hover": {
                            backgroundColor: "#80808036", // theme.palette.primary.main
                          },
                        }}
                      >
                        <VisibilityOutlinedIcon
                          style={{
                            fontsize: "large",
                            color: "#357AE8",
                          }}
                          onClick={() => renderFilePreviewMulterUploaded(data)}
                        />
                      </Button>

                      <Button
                        sx={{
                          padding: "14px 14px",
                          minWidth: "40px !important",
                          borderRadius: "50% !important",
                          ":hover": {
                            backgroundColor: "#80808036", // theme.palette.primary.main
                          },
                        }}
                        onClick={() =>
                          handleDeleteUploadedBills(index)
                        }
                      >
                        <FaTrash
                          style={{
                            fontSize: "medium",
                            color: "#a73131",
                          }}
                        />
                      </Button>
                    </Grid>
                  </Grid>
                </>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button sx={buttonStyles.buttonsubmit} onClick={handleUploadOverAll} variant="contained">
            Ok
          </Button>
          <Button onClick={resetImage} sx={buttonStyles.btncancel}>
            Reset
          </Button>
          <Button onClick={handleUploadPopupClose} sx={buttonStyles.btncancel}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* webcam alert start */}
      <Dialog
        open={isWebcamOpen}
        onClose={webcamClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
            alignItems: "center",
          }}
        >
          <Webcamimage
            name={name}
            getImg={getImg}
            setGetImg={setGetImg}
            valNum={valNum}
            setValNum={setValNum}
            capturedImages={capturedImages}
            setCapturedImages={setCapturedImages}
            setRefImage={setRefImage}
            setRefImageDrag={setRefImageDrag}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="success" onClick={webcamDataStore}>
            OK
          </Button>
          <Button variant="contained" color="error" onClick={webcamClose}>
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openviewalertstockcategory}
        onClose={handleClickOpenviewalertstockcategory}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"

        fullWidth={true}
      >
        <CategoryMasterPopup
          setStockCategoryAuto={setStockCategoryAuto}
          handleCloseviewalertstockcategory={handleCloseviewalertstockcategory}
        />
      </Dialog>
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

export default Raiseproblem;
