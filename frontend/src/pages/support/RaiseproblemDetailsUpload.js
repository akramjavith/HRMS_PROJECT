import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Popover,
  TextField,
  DialogTitle,
  IconButton,
  Switch,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Box,
  Typography,
  OutlinedInput,
  Dialog,
  Select,
  TableRow,
  TableCell,
  MenuItem,
  TableBody,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Paper,
  Table,
  TableHead,
  TableContainer,
  Button,
} from "@mui/material";
import { handleApiError } from "../../components/Errorhandling";
import { userStyle, colourStyles } from "../../pageStyle";
import { FaPrint, FaFilePdf, FaPlus, FaTrash } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import { SERVICE } from "../../services/Baseservice";
import jsPDF from "jspdf";
import { Link } from "react-router-dom";
import axios from "axios";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Selects from "react-select";
import moment from "moment-timezone";
import { UserRoleAccessContext, AuthContext } from "../../context/Appcontext";
import { MultiSelect } from "react-multi-select-component";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import "jspdf-autotable";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress, {
  circularProgressClasses,
} from "@mui/material/CircularProgress";
import { menuItems } from "../../components/menuItemsList";
import DeleteIcon from "@mui/icons-material/Delete";
import ReactQuill from "react-quill";
import pdfIcon from "../../components/Assets/pdf-icon.png";
import wordIcon from "../../components/Assets/word-icon.png";
import excelIcon from "../../components/Assets/excel-icon.png";
import csvIcon from "../../components/Assets/CSV.png";
import fileIcon from "../../components/Assets/file-icons.png";
import Webcamimage from "../asset/Webcameimageasset";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { makeStyles } from "@material-ui/core";
import Headtitle from "../../components/Headtitle";
import { useNavigate, useParams } from "react-router-dom";
import CategoryMasterPopup from "./CategoryMasterPopup";
import "react-quill/dist/quill.snow.css";

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
      // } else {
      //   setShowAlert(
      //     <>
      //       <p style={{ fontSize: "20px", fontWeight: 900 }}>
      //         {"Only Accept Images!"}
      //       </p>
      //     </>
      //   );
      //   // handleClickOpenalert();
      // }
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
  const handleRemoveFile = (index) => {
    const newSelectedFiles = [...refImageDrag];
    newSelectedFiles.splice(index, 1);
    setRefImageDrag(newSelectedFiles);
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
  const showWebcamedit = () => {
    webcamOpenedit();
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
  const handleDragOveredit = (event) => {};
  const handleDropedit = (event) => {
    event.preventDefault();
    previewFileedit(event.dataTransfer.files[0]);
    const files = event.dataTransfer.files;
    let newSelectedFilesDrag = [...refImageDragedit];
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
          setRefImageDragedit(newSelectedFilesDrag);
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
  const handleUploadOverAlledit = () => {
    const files = refImageedit ? refImageedit : [];
    const newTodoscheck = [...todoscheck];
    newTodoscheck[editingIndexcheck].files = files;

    setTodoscheck(newTodoscheck);
    setUploadPopupOpenedit(false);
  };
  const previewFileedit = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewURLedit(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };
  const handleRemoveFileedit = (index) => {
    const newSelectedFiles = [...refImageDragedit];
    newSelectedFiles.splice(index, 1);
    setRefImageDragedit(newSelectedFiles);
  };

  const { isUserRoleCompare } = useContext(UserRoleAccessContext);

  const [todoscheck, setTodoscheck] = useState([]);
  const [editingIndexcheck, setEditingIndexcheck] = useState(-1);
  const [editedDeveloper, setEditedDeveloper] = useState("");
  const [editedReturnName, seteditedReturnName] = useState("");
  const [selectedCompanyedit, setSelectedCompanyedit] = useState("");
  const [valuecateedit, setvaluecateedit] = useState([]);
  const [empcodeedit, setempcodeedit] = useState("");
  const [highestemp, sethighestemp] = useState("");
  const [selectedoptionscateedit, setSelectedOptionsCateedit] = useState([]);

  const handleCreateTodocheck = () => {
    // if (currentText && currentText === 0) {

    if (
      (currentText === "" || currentText === "<p><br></p>") &&
      refImage?.length === 0
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Any Description or Upload Attachement"}
          </p>
        </>
      );
      handleClickOpenerr();
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
  useEffect(() => {
    fetchNewRoleList();
  }, [ids, isUserRoleAccess]);

  var filteredRoles;

  // get the current user role datas
  const fetchNewRoleList = async () => {
    try {
      let role_new = await axios.get(SERVICE.ROLE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      // setRolesNewList(
      //   role_new?.data?.roles.filter((item) =>
      //     isUserRoleAccess?.role?.includes(item?.name)
      //   )
      // );
      // filteredRoles = role_new?.data?.roles.filter((item) =>
      //   isUserRoleAccess?.role?.includes(item?.name)
      // );

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
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [disableTodos, setDisableTodos] = useState([]);

  // get single row to view....
  const getinfoCode = async (e) => {
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
  const [moduleDbNames, setModuleDbNames] = useState([]);
  const [subModuleDbNames, setSubModuleDbNames] = useState([]);
  const [mainPageDbNames, setMainPageDbNames] = useState([]);
  const [subPageDbNames, setSubPageDbNames] = useState([]);
  const [subSubPageDbNames, setSubSubPageDbNames] = useState([]);

  //setting an module names into array
  const handleModuleChange = (options) => {
    if (Array.isArray(options)) {
      setValueModule(
        options?.map((a, index) => {
          return a.value;
        })
      );
      let ans = options?.map((a, index) => {
        return a.value;
      });
      setModuleTitleNames(ans);
      let dbNames =
        options?.length > 0 &&
        options?.map((a, index) => {
          return a.dbname;
        });
      setModuleDbNames(dbNames);
      //subModuleDropDown Names
      let subModu = menuItems.filter((data) => ans.includes(data.title));
      let Submodule =
        subModu?.length > 0 && subModu?.map((item) => item.submenu);
      let singleArray = Submodule?.length > 0 && [].concat(...Submodule);
      //Removing Add in the list
      let filteredArray =
        singleArray?.length > 0 &&
        singleArray.filter((innerArray) => {
          return !innerArray.title.startsWith("Add ");
        });

      setSubModuleOptions(
        filteredArray?.length > 0 &&
          filteredArray?.map((data) => ({
            ...data,
            label: data.title,
            value: data.title,
          }))
      );

      setSelectedModuleName(options);
    }
  };

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

  //Submodule dropdowns
  const fetchSubModuleDropDowns = (e) => {
    let subModule = menuItems.filter((data) => data.title === e);
    let dropdown = subModule.map((data) => data.submenu);
    let ans = [].concat(...dropdown).map((d) => ({
      ...d,
      label: d.title,
      value: d.title,
    }));
    setSubModuleOptions(ans);
  };
  //rendering function for options(value field with comma)
  const customValueRendererModule = (valueCate, _categories) => {
    return valueCate?.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Module";
  };

  //setting an Sub module names into array
  const handleSubModuleChange = (options) => {
    if (Array.isArray(options)) {
      setSubValueModule(
        options?.map((a, index) => {
          return a.value;
        })
      );
      let submodAns = options?.map((a, index) => {
        return a.value;
      });
      setSubModuleTitleNames(submodAns);
      let dbNames =
        options?.length > 0 &&
        options.map((a, index) => {
          return a.dbname;
        });
      setSubModuleDbNames(dbNames);
      let subModu = subModuleOptions.filter((data) =>
        submodAns.includes(data.title)
      );
      let mainPage =
        subModu?.length > 0 &&
        subModu
          .map((data) => data.submenu)
          .filter(Boolean)
          .flat();
      let filteredArray =
        mainPage?.length > 0 &&
        mainPage.filter((innerArray) => {
          return !innerArray.title.startsWith("Add ");
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
    }
  };
  //rendering function for options(value field with comma)
  const customValueRendererSubModule = (valueCate, _categories) => {
    return valueCate?.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Module";
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
      options?.length > 0 &&
      options.map((a, index) => {
        return a.dbname;
      });
    setMainPageDbNames(dbNames);
    let mainPageFilt = mainPageoptions.filter((data) =>
      mainpageAns.includes(data.title)
    );

    let mainPage =
      mainPageFilt?.length > 0 &&
      mainPageFilt
        .map((data) => data.submenu)
        .filter(Boolean)
        .flat();
    //Removing Add in the list
    let filteredArray =
      mainPage?.length > 0 &&
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
  //rendering function for options(value field with comma)
  const customValueRendererMainPage = (valueCate, _categories) => {
    return valueCate?.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Main-Page";
  };

  //setting an Main Page names into array
  const handleSubPageChange = (options) => {
    setValueSubPage(
      options.map((a, index) => {
        return a.value;
      })
    );
    let subPageAns = options.map((a, index) => {
      return a.value;
    });
    setSubPageTitleNames(subPageAns);
    let dbNames =
      options?.length > 0 &&
      options.map((a, index) => {
        return a.dbname;
      });
    setSubPageDbNames(dbNames);

    let subPageFilt = subPageoptions.filter((data) =>
      subPageAns.includes(data.title)
    );
    let controlDrop =
      subPageFilt?.length > 0 &&
      subPageFilt
        .map((data) => data.submenu)
        .filter(Boolean)
        .flat();
    let filteredArray =
      controlDrop?.length > 0 &&
      controlDrop.filter((innerArray) => {
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
    setsubSubPageoptions(subPageDropDown);
    setSelectedSubPageName(options);
  };
  //rendering function for options(value field with comma)
  const customValueRendererSubPage = (valueCate, _categories) => {
    return valueCate?.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Sub-Page";
  };
  //setting an Main Page names into array
  const handleSubSubPageChange = (options) => {
    setValueSubSubPage(
      options.map((a, index) => {
        return a.value;
      })
    );
    let subPageAns = options.map((a, index) => {
      return a.value;
    });
    setSubSubPageTitleNames(subPageAns);
    let dbNames =
      options?.length > 0 &&
      options.map((a, index) => {
        return a.dbname;
      });
    setSubSubPageDbNames(dbNames);

    let subPageFilt = subPageoptions.filter((data) =>
      subPageAns.includes(data.title)
    );

    let controlDrop =
      subPageFilt?.length > 0 &&
      subPageFilt
        .map((data) => data.submenu)
        .filter(Boolean)
        .flat();
    let filteredArray =
      controlDrop?.length > 0 &&
      controlDrop.filter((innerArray) => {
        return !innerArray.title.startsWith("Add ");
      });

    setSelectedSubSubPageName(options);
  };
  //rendering function for options(value field with comma)
  const customValueRenderersubSubPage = (valueCate, _categories) => {
    return valueCate?.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Sub-Page";
  };

  const { auth } = useContext(AuthContext);

  const username = isUserRoleAccess.username;

  const fetchRaise = async () => {
    try {
      let res_branch = await axios.get(SERVICE.RAISEPROBLEM, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAllData(res_branch.data.raises.filter((item) => item._id !== ids));
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    fetchRaise();
  }, []);

  //add function...
  const sendRequest = async () => {
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const handleSubmit = () => {
    if (todoscheck?.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Add Any Data in Todo"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    if (todoscheck?.length == disableTodos?.length) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Add New Details"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      (currentText != "<p><br></p>" && currentText != "") ||
      refImage?.length > 0
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Add The Todo And Submit"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      todoscheck?.some(
        (data) =>
          (data?.document === "" || data?.document === "<p><br></p>") &&
          data?.files.length === 0
      )
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Fill All the todos and Submit"}
          </p>
        </>
      );
      handleClickOpenerr();
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
                  variant="contained"
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
                        variant="contained"
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
                variant="contained"
                color="primary"
                sx={userStyle.buttonadd}
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
                }}
              >
                <Button sx={userStyle.btncancel}>Cancel</Button>
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
                    sx={userStyle.uploadbtn}
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
          <Button onClick={handleUploadOverAll} variant="contained">
            Ok
          </Button>
          <Button onClick={resetImage} sx={userStyle.btncancel}>
            Reset
          </Button>
          <Button onClick={handleUploadPopupClose} sx={userStyle.btncancel}>
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
                    sx={userStyle.uploadbtn}
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
          <Button onClick={handleUploadOverAlledit} variant="contained">
            Ok
          </Button>
          <Button onClick={resetImageedit} sx={userStyle.btncancel}>
            Reset
          </Button>
          <Button onClick={handleUploadPopupCloseedit} sx={userStyle.btncancel}>
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
    </Box>
  );
}

export default RaiseproblemDetailsUpload;
