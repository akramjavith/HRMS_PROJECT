import { makeStyles } from "@material-ui/core";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  Typography
} from "@mui/material";
import axios from "axios";
import "jspdf-autotable";
import React, { useContext, useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { userStyle } from "../../pageStyle";
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
function RaiseproblemDetailsUpload() {
  const [allData, setAllData] = useState([]);
  let allUploadedFiles = [];

  const backPage = useNavigate();

  let ids = useParams().id;

  const deduction = [
    { label: "Corrections", value: "Corrections" },
    { label: "Existings", value: "Existings" },
    { label: "New", value: "New" },
  ];

  const [raiseproblem, setRaiseproblem] = useState({
    mode: "Please Select Mode",
    priority: "Please Select Priority",
    modulename: "",
    submodulename: "",
    mainpagename: "",
    subpagename: "",
    subsubpagename: "",
  });

  const [singleSelectValues, setSingleSelectValues] = useState({});

  let name = "create";
  const [currentText, setCurrentText] = useState("");
  const [currentTexttodo, setCurrentTexttodo] = useState("");
  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  const [showAlert, setShowAlert] = useState();

  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

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

  const webcamOpen = () => {
    setIsWebcamOpen(true);
  };
  const webcamClose = () => {
    setIsWebcamOpen(false);
    setGetImg("");
  };
  const webcamDataStore = () => {
    setIsWebcamCapture(true);
    webcamClose();
    setGetImg("");
  };
  const showWebcam = () => {
    webcamOpen();
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

    for (let i = 0; i < files?.length; i++) {
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
  const handleDragOver = (event) => {
    event.preventDefault();
  };
  const handleDrop = (event) => {
    event.preventDefault();
    previewFile(event.dataTransfer.files[0]);
    const files = event.dataTransfer.files;
    let newSelectedFilesDrag = [...refImageDrag];
    for (let i = 0; i < files?.length; i++) {
      const file = files[i];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          newSelectedFilesDrag.push({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: reader.result,
            base64: reader.result.split(",")[1],
          });
          setRefImageDrag(newSelectedFilesDrag);
        };
        reader.readAsDataURL(file);
      } else {
        setShowAlert(
          <>
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Only Accept Images!"}
            </p>
          </>
        );
        // handleClickOpenalert();
      }
    }
  };
  const handleUploadOverAll = () => {
    setUploadPopupOpen(false);
  };
  const previewFile = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewURL(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  //todo upload
  const [refImageedit, setRefImageedit] = useState([]);
  const [previewURLedit, setPreviewURLedit] = useState(null);
  const [refImageDragedit, setRefImageDragedit] = useState([]);
  const [valNumedit, setValNumedit] = useState(0);
  const [isWebcamOpenedit, setIsWebcamOpenedit] = useState(false);
  const [capturedImagesedit, setCapturedImagesedit] = useState([]);
  const [getImgedit, setGetImgedit] = useState(null);
  const webcamOpenedit = () => {
    setIsWebcamOpenedit(true);
  };
  const webcamCloseedit = () => {
    setIsWebcamOpenedit(false);
    setGetImgedit("");
  };
  const webcamDataStoreedit = () => {
    webcamCloseedit();
    setGetImgedit("");
  };


  const handletododocumentchange = (e, field, index) => {
    setEditingIndexcheck(index);
    // setRefImageedit(todoscheck[index].files)
    // setCurrentTexttodo()
    // setCurrentTexttodo(todoscheck[index].e.target.value)
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

  const handleUploadPopupCloseedit = () => {
    setUploadPopupOpenedit(false);
    setGetImgedit("");
    setRefImageedit([]);
    setPreviewURLedit(null);
    setRefImageDragedit([]);
    setCapturedImagesedit([]);
  };
  const handleInputChangeedit = (event) => {
    const files = event.target.files;
    let newSelectedFiles = [...refImageedit];

    for (let i = 0; i < files?.length; i++) {
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
        setRefImageedit(newSelectedFiles);
      };
      reader.readAsDataURL(file);
      // } else {
      //   setShowAlert(
      //     <>
      //       <p style={{ fontSize: "20px", fontWeight: 900 }}>
      //         {"Only Accept Images!"}
      //       </p>
      //     </>
      //   );
      //   //   handleClickOpenalert();
      // }
    }
  };

  //first deletefile
  const handleDeleteFileedit = (index) => {
    const newSelectedFiles = [...refImageedit];
    newSelectedFiles.splice(index, 1);
    setRefImageedit(newSelectedFiles);
  };

  const renderFilePreviewedit = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };
  const resetImageedit = () => {
    setGetImgedit("");
    setRefImageedit([]);
    setPreviewURLedit(null);
    setRefImageDragedit([]);
    setCapturedImagesedit([]);
  };

  const [editingIndexcheck, setEditingIndexcheck] = useState(-1);


  const handleUploadOverAlledit = () => {
    const files = refImageedit ? refImageedit : [];
    const newTodoscheck = [...todoscheck];
    newTodoscheck[editingIndexcheck].files = files;

    setTodoscheck(newTodoscheck);
    setUploadPopupOpenedit(false);
  };



  const { isUserRoleCompare, buttonStyles, setPageName, pageName } = useContext(UserRoleAccessContext);

  const [todoscheck, setTodoscheck] = useState([]);

  const handleCreateTodocheck = () => {
    // if (currentText && currentText === 0) {

    if (
      (currentText === "" || currentText === "<p><br></p>") &&
      refImage?.length === 0
    ) {

      setPopupContentMalert("Please Enter Any Description or Upload Attachement");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      const newTodocheck = {
        document: currentText,
        files: allUploadedFiles.concat(refImage, refImageDrag, capturedImages),
      };
      setTodoscheck([...todoscheck, newTodocheck]);
      setRefImage([]);
      setPreviewURL(null);
      setCurrentText("");
    }
    // }
  };

  const handleDeleteTodocheck = (index) => {
    const newTodoscheck = [...todoscheck];
    newTodoscheck.splice(index, 1);
    setTodoscheck(newTodoscheck);
  };
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [categoryMaster, setCategoryMaster] = useState([]);

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

  const [filterSidebar, setFilterSidebar] = useState([]);

  const roleAccess = isUserRoleCompare;
  let ans;
  const { isUserRoleAccess } = useContext(UserRoleAccessContext);


  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Raise Problem Details Upload"),
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
    fetchNewRoleList();
    getapi()
  }, [ids, isUserRoleAccess]);

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

      await getinfoCode([mergedObject]);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [disableTodos, setDisableTodos] = useState([]);

  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.RAISEPROBLEM_SINGLE}/${ids}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setRaiseproblem(res?.data?.sraises);
      setTodoscheck(res?.data?.sraises.raisetodo);
      setDisableTodos(
        res?.data?.sraises.raisetodo?.map((data, index) => index)
      );
      setSingleSelectValues({
        module: res?.data?.sraises?.modulename,
        submodule: res?.data?.sraises?.submodulename,
        mainpage:
          res?.data?.sraises?.mainpagename === ""
            ? "Please Select Main Page"
            : res?.data?.sraises?.mainpagename,
        subpage:
          res?.data?.sraises?.subpagename === ""
            ? "Please Select Sub Page"
            : res?.data?.sraises?.subpagename,
        subsubpage:
          res?.data?.sraises?.subsubpagename === ""
            ? "Please Select Sub Sub Page"
            : res?.data?.sraises?.subsubpagename,
        category:
          res?.data?.sraises?.category === ""
            ? "Please Select Category"
            : res?.data?.sraises?.category,
        subcategory:
          res?.data?.sraises?.subcategory === ""
            ? "Please Select Sub Category"
            : res?.data?.sraises?.subcategory,
      });
      handleModuleNameChange(res?.data?.sraises?.modulename, e);
      handleSubModuleNameChange(
        res?.data?.sraises?.modulename,
        res?.data?.sraises?.submodulename,
        e
      );
      handleMainPageNameChange(
        res?.data?.sraises?.modulename,
        res?.data?.sraises?.submodulename,
        res?.data?.sraises?.mainpagename,
        e
      );
      handleSubPageNameChange(
        res?.data?.sraises?.modulename,
        res?.data?.sraises?.submodulename,
        res?.data?.sraises?.mainpagename,
        res?.data?.sraises?.subpagename,
        e
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const module =
    filterSidebar?.length > 0 &&
    filterSidebar?.map((data) => ({
      ...data,
      label: data.title,
      value: data.title,
    }));

  const [roleName, setRoleName] = useState("");
  const [rolesNewList, setRolesNewList] = useState([]);

  const [selectedModuleName, setSelectedModuleName] = useState([]);
  const [subModuleOptions, setSubModuleOptions] = useState([]);
  const [selectedSubModuleName, setSelectedSubModuleName] = useState([]);
  const [mainPageoptions, setMainPageoptions] = useState([]);
  const [selectedMainPageName, setSelectedMainPageName] = useState([]);
  const [subPageoptions, setSubPageoptions] = useState([]);
  const [subSubPageoptions, setsubSubPageoptions] = useState([]);
  const [selectedSubPageName, setSelectedSubPageName] = useState([]);
  const [selectedControls, setSelectedControls] = useState([]);
  const [moduleTitleNames, setModuleTitleNames] = useState([]);
  const [subModuleTitleNames, setSubModuleTitleNames] = useState([]);
  const [mainPageTitleNames, setMainPageTitleNames] = useState([]);
  const [subPageTitleNames, setSubPageTitleNames] = useState([]);
  const [subsubPageTitleNames, setSubSubPageTitleNames] = useState([]);
  const [controlTitleNames, setControlTitleNames] = useState([]);
  const [mainPageDbNames, setMainPageDbNames] = useState([]);



  //single select fetch Submodule
  const handleModuleNameChange = (modulename, e) => {
    const filteredMenuitems = menuItems.filter(
      (item) => item.title === modulename
    );

    const submodulerole = e[0]?.submodulename?.map((item) => item);

    const filteredSubModulename =
      filteredMenuitems?.length > 0
        ? filteredMenuitems[0]?.submenu
          ?.filter((item) => submodulerole?.includes(item.title))
          ?.map((item) => {
            return {
              label: item.title,
              value: item.title,
            };
          })
        : [];

    setSubModuleOptions(filteredSubModulename);
  };

  //single select fetch Main page
  const handleSubModuleNameChange = (modulename, submodulename, e) => {
    const filteredMenuitemsModuleName = menuItems.filter(
      (item) => item.title === modulename
    );

    const filteredMenuitemsSubModuleName =
      filteredMenuitemsModuleName?.length > 0
        ? filteredMenuitemsModuleName[0]?.submenu?.filter(
          (item) => item.title === submodulename
        )
        : [];

    const mainpagerole = e[0]?.mainpagename?.map((item) => item);

    const filteredSubModulename =
      filteredMenuitemsSubModuleName?.length > 0
        ? filteredMenuitemsSubModuleName[0]?.submenu
          ?.filter((item) => mainpagerole?.includes(item.title))
          ?.map((item) => {
            return {
              label: item.title,
              value: item.title,
            };
          })
        : [];

    setMainPageoptions(filteredSubModulename);
  };

  //single select fetch Sub page
  const handleMainPageNameChange = (modulename, submodulename, mainpage, e) => {
    const filteredMenuitemsModuleName = menuItems.filter(
      (item) => item.title === modulename
    );

    const filteredMenuitemsSubModuleName =
      filteredMenuitemsModuleName?.length > 0
        ? filteredMenuitemsModuleName[0]?.submenu?.filter(
          (item) => item.title === submodulename
        )
        : [];

    const filteredMenuitemsMainPage =
      filteredMenuitemsSubModuleName?.length > 0
        ? filteredMenuitemsSubModuleName[0]?.submenu?.filter(
          (item) => item.title === mainpage
        )
        : [];

    const subpagerole = e[0]?.subpagename?.map((item) => item);

    const filteredSubModulename =
      filteredMenuitemsMainPage?.length > 0
        ? filteredMenuitemsMainPage[0]?.submenu
          ?.filter((item) => subpagerole?.includes(item.title))
          ?.map((item) => {
            return {
              label: item.title,
              value: item.title,
            };
          })
        : [];

    setSubPageoptions(filteredSubModulename);
  };

  //single select fetch Sub Sub page
  const handleSubPageNameChange = (
    modulename,
    submodulename,
    mainpage,
    subpage,
    e
  ) => {
    const filteredMenuitemsModuleName = menuItems.filter(
      (item) => item.title === modulename
    );

    const filteredMenuitemsSubModuleName =
      filteredMenuitemsModuleName?.length > 0
        ? filteredMenuitemsModuleName[0]?.submenu?.filter(
          (item) => item.title === submodulename
        )
        : [];

    const filteredMenuitemsMainPage =
      filteredMenuitemsSubModuleName?.length > 0
        ? filteredMenuitemsSubModuleName[0]?.submenu?.filter(
          (item) => item.title === mainpage
        )
        : [];

    const filteredMenuitemsSubPage =
      filteredMenuitemsMainPage?.length > 0
        ? filteredMenuitemsMainPage[0]?.submenu?.filter(
          (item) => item.title === subpage
        )
        : [];

    const subpagerole = e[0]?.subsubpagename?.map((item) => item);

    const filteredSubSubModulename =
      filteredMenuitemsSubPage?.length > 0
        ? filteredMenuitemsSubPage[0]?.submenu
          ?.filter((item) => subpagerole?.includes(item.title))
          ?.map((item) => {
            return {
              label: item.title,
              value: item.title,
            };
          })
        : [];

    setsubSubPageoptions(filteredSubSubModulename);
  };


  const { auth } = useContext(AuthContext);

  const username = isUserRoleAccess.username;

  const fetchRaise = async () => {
    setPageName(!pageName)
    try {
      let res_branch = await axios.get(SERVICE.RAISEPROBLEM, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAllData(res_branch.data.raises.filter((item) => item._id !== ids));
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchRaise();
  }, []);

  //add function...
  const sendRequest = async () => {
    setPageName(!pageName)
    try {
      let roles = await axios.put(`${SERVICE.RAISEPROBLEM_SINGLE}/${ids}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

        raisetodo: todoscheck,
        status: "Details Uploaded",
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],

        createdby: String(isUserRoleAccess?.username),
      });

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
      backPage("/production/raiseproblemlist");
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const handleSubmit = () => {
    if (todoscheck?.length == 0) {

      setPopupContentMalert("Please Add Any Data in Todo");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    if (todoscheck?.length == disableTodos?.length) {

      setPopupContentMalert("Please Add New Details");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      (currentText != "<p><br></p>" && currentText != "") ||
      refImage?.length > 0
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
    } else {
      sendRequest();
    }
  };

  const [rolesedit, setRolesedit] = useState([]);
  let updateby = raiseproblem?.updatedby;
  let addedby = rolesedit?.addedby;

  //Delete functionalities

  // Alert delete popup
  let roleid = rolesedit._id;

  const [selectedModuleNameEdit, setSelectedModuleNameEdit] = useState([]);
  const [getModuleNameEdit, setgetModuleNameEdit] = useState([]);
  const [getSubModuleNameEdit, setgetSubModuleNameEdit] = useState([]);

  const [getMainPageNamesEdit, setgetMainPageNamesEdit] = useState([]);
  const [selectedMainPageNameEdit, setSelectedMainPageNameEdit] = useState([]);
  const [getSubPageNameEdit, setgetSubPageNameEdit] = useState([]);

  const moduleEdit =
    menuItems?.length > 0 &&
    menuItems
      ?.filter((data) => data)
      .map((data) => ({
        ...data,
        label: data.title,
        value: data.title,
      }));
  const submoduleDrop =
    menuItems?.length > 0 &&
    menuItems
      ?.filter((data) => getModuleNameEdit.includes(data.title))
      .map((data) => data.submenu);
  const submoduleEditCheck =
    submoduleDrop?.length > 0 && [].concat(...submoduleDrop);

  const submoduleEdit =
    submoduleEditCheck?.length > 0 &&
    submoduleEditCheck?.map((data) => ({
      ...data,
      label: data.title,
      value: data.title,
    }));
  const mainPage =
    submoduleEditCheck?.length > 0 &&
    submoduleEditCheck
      .map((data) => data.submenu)
      .filter(Boolean)
      .flat();
  const mainPageOptionsEditDef =
    mainPage?.length > 0
      ? mainPage.map((data) => ({
        ...data,
        label: data.title,
        value: data.title,
      }))
      : [];

  const subpage =
    mainPage?.length > 0 &&
    mainPage.filter((data) => getMainPageNamesEdit.includes(data.title));
  let main =
    subpage?.length > 0 &&
    subpage
      .map((data) => data.submenu)
      .filter(Boolean)
      .flat();
  let subPageOptionsEditDef =
    main?.length > 0
      ? main.map((data) => ({
        ...data,
        label: data.title,
        value: data.title,
      }))
      : [];

  let moduleSubmit = menuItems.filter((data) =>
    selectedModuleNameEdit.includes(data.title)
  );
  let moduleDbNameSubmit =
    moduleSubmit?.length > 0 && moduleSubmit.map((data) => data.dbname);
  let submoduleSubmit =
    submoduleEditCheck?.length > 0 &&
    submoduleEditCheck.filter((data) =>
      getSubModuleNameEdit.includes(data.title)
    );
  let submoduledbNameSubmit =
    submoduleSubmit?.length > 0 && submoduleSubmit.map((data) => data.dbname);
  let mainpageSubmit = mainPageOptionsEditDef.filter((data) =>
    selectedMainPageNameEdit.includes(data.title)
  );
  let mainPageDbNameSubmit =
    mainpageSubmit?.length > 0 && mainpageSubmit.map((data) => data.dbname);
  let subpageSubmit = mainpageSubmit
    .map((data) => data.submenu)
    .filter(Boolean)
    .flat();
  let subPageFilterSubmit =
    subpageSubmit?.length > 0 &&
    subpageSubmit.filter((data) => getSubPageNameEdit.includes(data.title));
  let subPageTitleNameDefault =
    subPageFilterSubmit?.length > 0 &&
    subPageFilterSubmit.map((data) => data.title);
  let subPageDbNamesSubmit =
    subPageFilterSubmit?.length > 0 &&
    subPageFilterSubmit.map((data) => data.dbname);

  let projectsid = rolesedit._id;
  let newval = "RUP0001";
  return (
    <Box>
      <Headtitle title={"RAISE PROBLEM DETAILS NEEDED"} />
      {isUserRoleCompare?.includes("eraiseproblem") && (
        <Box sx={userStyle.dialogbox}>
          <Grid container spacing={2}>
            <Grid item md={12} xs={12}>
              <Typography sx={userStyle.HeaderText}>
                Raise Problem Details Needed
              </Typography>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6"> Auto id</Typography>
              </FormControl>
              <Typography>{raiseproblem.autoid}</Typography>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">mode</Typography>
                <Typography>{raiseproblem.mode}</Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Priority</Typography>
                <Typography>{raiseproblem.priority}</Typography>{" "}
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Module</Typography>
                <Typography>{raiseproblem.modulename}</Typography>
              </FormControl>
            </Grid>
            <br />
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Sub-Module</Typography>
                <Typography>{raiseproblem.submodulename}</Typography>
              </FormControl>
            </Grid>
            <br />
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Main Page</Typography>
                <Typography>{raiseproblem.mainpagename}</Typography>
              </FormControl>
            </Grid>
            <br />
            <Grid item md={3} xs={12} sm={12}>
              <Typography variant="h6">Sub-Page</Typography>
              <FormControl fullWidth size="small">
                <Typography>{raiseproblem.subpagename}</Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <Typography variant="h6">Sub Sub-Page</Typography>
              <FormControl fullWidth size="small">
                <Typography>{raiseproblem.subsubpagename}</Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <Typography variant="h6">Category</Typography>
              <FormControl fullWidth size="small">
                <Typography>{raiseproblem.category}</Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <Typography variant="h6">Sub Category</Typography>
              <FormControl fullWidth size="small">
                <Typography>{raiseproblem.subcategory}</Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <Typography variant="h6">Details Needed</Typography>
              <FormControl fullWidth size="small">
                <Typography>{raiseproblem.detailsneeded}</Typography>
              </FormControl>
            </Grid>

            {/* {textShow ? ( */}
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
            {/* ) : null} */}

            <br />

            <Grid item md={4} xs={12} sm={12}>
              <Typography>Attachment</Typography>
              <Box sx={{ display: "flex", justifyContent: "left" }}>
                <Button
                  sx={buttonStyles.buttonsubmit}
                  onClick={handleClickUploadPopupOpen}
                >
                  Upload
                </Button>
              </Box>
              <Grid item md={12} xs={12} sm={12}>
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
                      </Grid>
                    </Grid>
                  </Grid>
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
                        readOnly={disableTodos?.includes(index)}
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
                        sx={buttonStyles?.buttonsubmit}
                        onClick={() => handleClickUploadPopupOpenedit(index)}
                        disabled={disableTodos?.includes(index)}
                      >
                        Upload
                      </Button>
                    </Box>
                    <Grid item md={12} xs={12} sm={12}>
                      {todo.files.map((file, index) => (
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
                            <Typography variant="subtitle2">
                              {" "}
                              {file.name}{" "}
                            </Typography>
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
                      disabled={disableTodos?.includes(index)}
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
            <Grid item lg={1} md={2} sm={2} xs={12}>
              <Button
                sx={buttonStyles.buttonsubmit}
                onClick={(e) => handleSubmit(e)}
              >
                Update
              </Button>
            </Grid>
            <Grid item lg={1} md={2} sm={2} xs={12}>
              <Link
                to="/production/raiseproblemlist"
                style={{
                  textDecoration: "none",
                  color: "white",
                  float: "right",
                  ...buttonStyles.btncancel
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
                      onChange={handleInputChange}
                    />
                  </Button>
                </Grid>
              </FormControl>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              {isWebcamCapture == true &&
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
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUploadOverAll} sx={buttonStyles.buttonsubmit}>
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

      {/* Upload Files DIALOG EDIT */}
      <Dialog
        open={uploadPopupOpenedit}
        onClose={handleUploadPopupCloseedit}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
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
            <Grid item lg={12} md={12} sm={12} xs={12}>
              {/* {showDragField ? ( */}

              {/* ) : null} */}
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <br />
              <FormControl size="small" fullWidth>
                <Grid sx={{ display: "flex" }}>
                  <Button
                    variant="contained"
                    component="label"
                    sx={buttonStyles.buttonsubmit}
                  >
                    {" "}
                    Upload
                    <input
                      type="file"
                      multiple
                      id="productimage"
                      accept=".xlsx, .xls, .csv, .pdf, .doc, .docx, .txt, .png, image/*"
                      hidden
                      onChange={handleInputChangeedit}
                    />
                  </Button>
                </Grid>
              </FormControl>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              {refImageedit?.map((file, index) => (
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
                      md={8}
                      sm={8}
                      xs={8}
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
                          onClick={() => renderFilePreviewedit(file)}
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
                          onClick={() => {
                            handleDeleteFileedit(index);
                          }}
                        >
                          <FaTrash
                            style={{ color: "#a73131", fontSize: "12px" }}
                          />
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUploadOverAlledit} sx={buttonStyles?.buttonsubmit}>
            Ok
          </Button>
          <Button onClick={resetImageedit} sx={buttonStyles.btncancel}>
            Reset
          </Button>
          <Button onClick={handleUploadPopupCloseedit} sx={buttonStyles.btncancel}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* webcam alert start */}
      <Dialog
        open={isWebcamOpenedit}
        onClose={webcamCloseedit}
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
            getImgedit={getImgedit}
            setGetImgedit={setGetImgedit}
            valNumedit={valNumedit}
            setValNumedit={setValNumedit}
            capturedImagesedit={capturedImagesedit}
            setCapturedImagesedit={setCapturedImagesedit}
            setRefImageedit={setRefImageedit}
            setRefImageDragedit={setRefImageDragedit}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="success"
            onClick={webcamDataStoreedit}
          >
            OK
          </Button>
          <Button variant="contained" color="error" onClick={webcamCloseedit}>
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>

      {/* dialog box for  category */}

      <Dialog
        open={openviewalertstockcategory}
        onClose={handleClickOpenviewalertstockcategory}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        // sx={{
        //     overflow: "visible",
        //     "& .MuiPaper-root": {
        //         overflow: "visible",
        //     },
        // }}
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

export default RaiseproblemDetailsUpload;
