import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
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
  InputLabel,
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
  TextareaAutosize,
  TextField,
  Typography,
  Tooltip,
  Chip
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import * as faceapi from "face-api.js";
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
import AggregatedSearchBar from '../../../../components/AggregatedSearchBar';
import AggridTable from "../../../../components/AggridTable";
import AlertDialog from "../../../../components/Alert";
import { handleApiError } from "../../../../components/Errorhandling";
import ExportData from "../../../../components/ExportData";
import Headtitle from "../../../../components/Headtitle";
import MessageAlert from "../../../../components/MessageAlert";
import PageHeading from "../../../../components/PageHeading";
import { StyledTableCell, StyledTableRow } from "../../../../components/Table";
import { AuthContext, UserRoleAccessContext } from "../../../../context/Appcontext";
import { colourStyles, userStyle } from "../../../../pageStyle";
import { SERVICE } from "../../../../services/Baseservice";
import domtoimage from 'dom-to-image';
import * as FileSaver from "file-saver";
import ExcelJS from "exceljs";
import Webcamimage from "../../../../components/webCamWithDuplicate";
import ExistingProfileVisitor from "../../../interactors/visitors/ExistingProfileVisitor";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import "react-image-crop/dist/ReactCrop.css";
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';

const ExportXLWithImages = ({ csvData, fileName }) => {
  const exportToExcel = async (csvData, fileName) => {
    if (!csvData || !csvData.length) {
      console.error("No data provided for export.");
      return;
    }

    if (!fileName) {
      console.error("No file name provided.");
      return;
    }

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Data");

      // Define columns
      worksheet.columns = [
        { header: "S.No", key: "serial", width: 10 },
        { header: "Empcode", key: "empcode", width: 15 },
        { header: "Employeename", key: "employeename", width: 30 },
        { header: "Email", key: "email", width: 30 },
        { header: "Work Mode", key: "workmode", width: 30 },
        { header: "Contactpersonal", key: "contactpersonal", width: 20 },
        { header: "Contactfamily", key: "contactfamily", width: 20 },
        { header: "Emergencyno", key: "emergencyno", width: 20 },
        { header: "Image", key: "image", width: 30 },
      ];

      // Add rows and images
      for (let i = 0; i < csvData.length; i++) {
        const item = csvData[i];
        const row = worksheet.addRow({
          serial: i + 1,
          empcode: item.empcode,
          employeename: item.companyname,
          email: item.email,
          workmode: item.workmode,
          contactpersonal: item.contactpersonal,
          contactfamily: item.contactfamily,
          emergencyno: item.emergencyno,
        });

        // Center align the text in each cell of the row
        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.alignment = { vertical: "middle", horizontal: "center" };
        });

        if (item.imageBase64) {
          const base64Image = item.imageBase64.split(",")[1];
          const imageId = workbook.addImage({
            base64: base64Image,
            extension: "png",
          });

          const rowIndex = row.number;

          // Adjust row height to fit the image
          worksheet.getRow(rowIndex).height = 80;

          // Add image to the worksheet
          worksheet.addImage(imageId, {
            tl: { col: 7, row: rowIndex - 1 },
            ext: { width: 100, height: 80 },
          });

          // Center align the image cell
          worksheet.getCell(`H${rowIndex}`).alignment = {
            vertical: "middle",
            horizontal: "center",
          };
        }
      }

      // Generate Excel file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      FileSaver.saveAs(blob, `${fileName}.xlsx`);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  };

  return (
    <Button
      onClick={() => exportToExcel(csvData, fileName)}
      sx={userStyle.buttongrp}
    >
      <FaFileExcel /> &ensp;Export to Excel&ensp;
    </Button>
  );
};

const ExportCSVWithImages = ({ csvData, fileName }) => {
  const exportToCSV = async (csvData, fileName) => {
    if (!csvData || !csvData.length) {
      console.error("No data provided for export.");
      return;
    }

    if (!fileName) {
      console.error("No file name provided.");
      return;
    }

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Data");

      // Define columns
      worksheet.columns = [
        { header: "S.No", key: "serial", width: 10 },
        { header: "Empcode", key: "empcode", width: 15 },
        { header: "Employeename", key: "employeename", width: 30 },
        { header: "Email", key: "email", width: 30 },
        { header: "Work Mode", key: "workmode", width: 30 },
        { header: "Contactpersonal", key: "contactpersonal", width: 20 },
        { header: "Contactfamily", key: "contactfamily", width: 20 },
        { header: "Emergencyno", key: "emergencyno", width: 20 },
        { header: "Image", key: "image", width: 30 },
      ];

      // Add rows and images
      for (let i = 0; i < csvData.length; i++) {
        const item = csvData[i];
        const row = worksheet.addRow({
          serial: i + 1,
          empcode: item.empcode,
          employeename: item.companyname,
          email: item.email,
          workmode: item.workmode,
          contactpersonal: item.contactpersonal,
          contactfamily: item.contactfamily,
          emergencyno: item.emergencyno,
        });

        // Center align the text in each cell of the row
        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.alignment = { vertical: "middle", horizontal: "center" };
        });

        if (item.imageBase64) {
          const base64Image = item.imageBase64.split(",")[1];
          const imageId = workbook.addImage({
            base64: base64Image,
            extension: "png",
          });

          const rowIndex = row.number;

          // Adjust row height to fit the image
          worksheet.getRow(rowIndex).height = 80;

          // Add image to the worksheet
          worksheet.addImage(imageId, {
            tl: { col: 7, row: rowIndex - 1 },
            ext: { width: 100, height: 80 },
          });

          // Center align the image cell
          worksheet.getCell(`H${rowIndex}`).alignment = {
            vertical: "middle",
            horizontal: "center",
          };
        }
      }

      // Generate Excel file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      FileSaver.saveAs(blob, `${fileName}.csv`);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  };

  return (
    <Button
      onClick={() => exportToCSV(csvData, fileName)}
      sx={userStyle.buttongrp}
    >
      <FaFileExcel /> &ensp;Export to CSV&ensp;
    </Button>
  );
};


function calculateLuminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Calculate luminance using the formula
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  // If luminance is greater than 128, it's a light color
  return luminance > 128;
};

function Contactupdate() {

  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);

  const [overallItems, setOverallItems] = useState([]);


  let exportColumnNames = [
    'SNo',
    'Emp code',
    'Name',
    'Email',
    'ContactPersonal',
    'ContactFamily',
    'EmergencyNo',
    'Image'
  ];
  let exportRowValues = [
    'serialNumber',
    'empcode',
    'companyname',
    'email',
    'contactpersonal',
    'contactfamily',
    'emergencyno',
    'imageBase64'
  ];

  const [isHandleChange, setIsHandleChange] = useState(false);
  const [searchedString, setSearchedString] = useState("")

  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
    setBtnUpdate(false);
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
  const [empaddform, setEmpaddform] = useState({
    prefix: "",
    firstname: "",
    lastname: "",
    referencename: "",
    email: "",
    emergencyno: "",
    contactno: "",
    details: "",
    profileimage: "",
    empcode: "",
    contactfamily: "",
    contactpersonal: "",
  });

  // Country city state datas

  const [getrowid, setRowGetid] = useState([]);
  const [employees, setEmployees] = useState([]);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    isUserRoleCompare,
    isUserRoleAccess,
    allUsersData,
    allTeam,
    isAssignBranch,
    pageName,
    setPageName,
    buttonStyles,
    allUsersLimit
  } = useContext(UserRoleAccessContext);

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

  const { auth } = useContext(AuthContext);

  const [file, setFile] = useState("");

  const [isContact, setIsContact] = useState(false);

  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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
      pagename: String("Contact Update"),
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


  // Copied fields Name
  const handleCopy = (message) => {
    NotificationManager.success(`${message} 👍`, "", 2000);
  };

  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Contact Info Update.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

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
    setPageName(!pageName)
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
  //empaddform multiselect
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
  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
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
    empcode: true,
    companyname: true,
    email: true,
    contactno: true,
    contactfamily: true,
    emergencyno: true,
    profileimage: true,
    contactpersonal: true,
    imageBase64: true,
    details: true,
    workmode: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  // Edit model
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    setSingleReferenceTodo({
      name: "",
      relationship: "",
      occupation: "",
      contact: "",
      details: "",
    });
    setReferenceTodo([]);
    setReferenceTodoError({});
    setColor('#FFFFFF');
    setCroppedImage("");

    setFile(null);
    setGetImg(null);
    setSelectedFile(null);
    setImage("");
  };
  const [selectedFile, setSelectedFile] = useState(null);
  const [croppedImage, setCroppedImage] = useState("");
  const cropperRef = useRef(null);


  const [image, setImage] = useState("")
  const handleCrop = () => {
    if (typeof cropperRef.current.cropper.getCroppedCanvas() === "undefined") {
      return;
    }
    const croppedImageData = cropperRef.current.cropper.getCroppedCanvas().toDataURL();
    setCroppedImage(croppedImageData);
    setEmpaddform((prev) => ({ ...prev, profileimage: croppedImageData }));
    // Convert the cropped image to a Blob (which is the image file format) before sending
    const base64Data = croppedImageData.split(',')[1]; // Get base64 data (without the prefix)
    const binaryData = atob(base64Data); // Decode base64 data
    const arrayBuffer = new ArrayBuffer(binaryData.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    // Fill the array buffer with the decoded binary data
    for (let i = 0; i < binaryData.length; i++) {
      uint8Array[i] = binaryData.charCodeAt(i);
    }

    // Create a Blob from the binary data
    const blob = new Blob([uint8Array], { type: 'image/png' });
    setImage(blob);
    // setCroppedImage(cropperRef.current.cropper.getCroppedCanvas().toDataURL());
    setSelectedFile(null);
    // setGetImg(null);
    // handleChangeImage()
  };



  const [color, setColor] = useState('#FFFFFF');
  const [bgbtn, setBgbtn] = useState(false);
  const handleColorChange = (e) => {
    setColor(e.target.value);
  };
  const handleClearImage = () => {
    setFile(null);
    setFile(null);
    setGetImg(null);
    setSelectedFile(null);
    setCroppedImage(null);
    setEmpaddform({
      ...empaddform,
      profileimage: "",
      faceDescriptor: []
    });
    setImage("");
    setColor('#FFFFFF')
  };
  const handleSubmitBG = async () => {
    setBgbtn(true);
    if (!image || !color) return;

    const formData = new FormData();
    formData.append('image', image);
    formData.append('color', color);

    try {
      const response = await axios.post(SERVICE.REMOVEBG, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setCroppedImage(response?.data?.image); // Set the base64 image
      setEmpaddform({
        ...empaddform,
        profileimage: response?.data?.image,
      });
      setBgbtn(false);
    } catch (error) {
      setBgbtn(false);
      console.error('Error uploading image:', error);
    }
  };



  const isLightColor = calculateLuminance(color);

  const [profileAvailed, setProfileAvailed] = useState(false);
  const [docID, setDocID] = useState("");

  const getCode = async (e) => {
    setPageName(!pageName);
    setPageName(!pageName)
    try {
      const [res, resNew] = await Promise.all([
        axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.post(SERVICE.GETDOCUMENTS, {
          commonid: e,
        }),
      ]);

      let availedData = Object.keys(resNew?.data)?.length;

      if (availedData != 0) {
        setProfileAvailed(true);
        let profile = resNew?.data?.semployeedocument?.profileimage;
        setEmpaddform({ ...res?.data?.suser, profileimage: profile });
        setDocID(resNew?.data?.semployeedocument?._id);
      } else {
        setProfileAvailed(false);
        setEmpaddform({ ...res?.data?.suser, profileimage: "" });
        setDocID("");
      }

      setRowGetid(res?.data?.suser);
      setReferenceTodo(res?.data?.suser?.referencetodo);
      handleClickOpenEdit();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };

  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setEmpaddform(res?.data?.suser);
      setRowGetid(res?.data?.suser);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
    setBtnUpload(false);
    setBtnUpdate(false);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  // view model
  const [openview, setOpenview] = useState(false);

  const handleClickOpenview = () => {
    setOpenview(true);
  };

  const handleCloseview = () => {
    setOpenview(false);
  };

  //Contactupadate updateby edit page...
  let updateby = empaddform?.updatedby;
  let addedby = empaddform?.addedby;

  //EDIT POST CALL
  let logedit = getrowid._id;
  const sendRequestt = async () => {
    const starttime = performance.now();
    setPageName(!pageName);
    setPageName(!pageName)
    try {
      let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${logedit}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

        referencetodo: referenceTodo.length === 0 ? [] : [...referenceTodo],
        email: String(empaddform.email),
        emergencyno: String(empaddform.emergencyno),
        contactno: String(empaddform.contactno),
        // profileimage: String(empaddform.profileimage),
        faceDescriptor:
          empaddform?.faceDescriptor?.length > 0
            ? empaddform?.faceDescriptor
            : [],
        contactfamily: String(empaddform.contactfamily),
        contactpersonal: String(empaddform.contactpersonal),
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });

      let res1;
      if (profileAvailed) {
        res1 = await axios.put(`${SERVICE.EMPLOYEEDOCUMENT_SINGLE}/${docID}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          profileimage: String(empaddform.profileimage),
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        });
      } else {
        res1 = await axios.post(SERVICE.EMPLOYEEDOCUMENT_CREATE, {
          commonid: logedit,
          profileimage: String(empaddform.profileimage),
          addedby: [
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        });
      }

      setSingleReferenceTodo({
        name: "",
        relationship: "",
        occupation: "",
        contact: "",
        details: "",
      });
      setReferenceTodo([]);
      setReferenceTodoError({});
      const endTime = performance.now(); // End timing here
      const timeTaken = endTime - starttime; // Calculate the time taken in milliseconds

      await fetchHandler();
      setColor('#FFFFFF');
      setPopupContent('Updated Successfully');
      setPopupSeverity("success");
      handleClickOpenPopup();
      handleCloseModEdit();
      setBtnUpdate(false);
    } catch (err) {
      setBtnUpdate(false);
      console.log(err, "err");
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  let [valueTeamCat, setValueTeamCat] = useState([]);
  let [valueUnitCat, setValueUnitCat] = useState([]);
  let [valueBranchCat, setValueBranchCat] = useState([]);
  let [valueCompanyCat, setValueCompanyCat] = useState([]);


  const [allAssignCompany, setAllAssignCompany] = useState([]);
  const [allAssignBranch, setAllAssignBranch] = useState([]);
  const [allAssignUnit, setAllAssignUnit] = useState([]);
  //get all employees list details
  const fetchHandler = async () => {
    setPageName(!pageName);
    setIsContact(true);
    setPageName(!pageName)
    try {
      const aggregationPipeline = [
        {
          $match: {
            $and: [
              // Bank details filter
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
          $addFields: {
            userIdStr: { $toString: "$_id" }, // Convert the ObjectId to string
          },
        },
        {
          $lookup: {
            from: "employeedocuments",
            localField: "userIdStr", // Use the string version of _id
            foreignField: "commonid", // Match against the string commonid
            as: "profileimage",
          },
        },
        {
          $addFields: {
            profileimage: {
              $ifNull: [
                { $arrayElemAt: ["$profileimage.profileimage", 0] },
                "",
              ],
            },
          },
        },
        {
          $project: {
            empcode: 1,
            companyname: 1,
            email: 1,
            contactfamily: 1,
            contactpersonal: 1,
            emergencyno: 1,
            profileimage: 1,
            workmode: 1,
          },
        },
      ];
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

      setIsContact(false);
    } catch (err) {
      console.log(err);
      setIsContact(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const validateEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;

    return regex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setBtnUpdate(true);
    if (
      empaddform.emergencyno === "" ||
      (empaddform.emergencyno?.length > 0 &&
        empaddform.emergencyno?.length < 10)
    ) {
      setPopupContentMalert('Please Enter or Check Correct Emergency No');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (empaddform?.email == "" || !validateEmail(empaddform?.email)) {
      setPopupContentMalert('Please Enter Valid Email');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      empaddform.contactpersonal === "" ||
      !empaddform.contactpersonal
    ) {
      setPopupContentMalert('Please Enter Contact Personal No');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      empaddform.contactpersonal?.length > 0 &&
      empaddform.contactpersonal?.length < 10
    ) {
      setPopupContentMalert('Please Enter Valid Contact Personal No');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (empaddform.contactfamily === "" || !empaddform.contactfamily) {
      setPopupContentMalert('Please Enter Contact Family No');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      empaddform.contactfamily?.length > 0 &&
      empaddform.contactfamily?.length < 10
    ) {
      setPopupContentMalert('Please Enter Valid Contact Family No');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequestt();
    }
  };

  //  PDF
  const columns = [
    { title: "SNo", field: "serialNumber" },
    { title: "Emp code", field: "empcode" },
    { title: "Name", field: "companyname" },
    { title: "Email", field: "email" },
    { title: "Work Mode", field: "workmode" },
    { title: "ContactPersonal", field: "contactpersonal" },
    { title: "ContactFamily", field: "contactfamily" },
    { title: "EmergencyNo", field: "emergencyno" },
    { title: "Image", field: "imageBase64" },
  ];

  const downloadPdf = async () => {
    const doc = new jsPDF();
    const tableColumn = columns.map((col) => col.title);
    const tableRows = [];
    const imagesToLoad = [];

    rowDataTable.forEach((item, index) => {
      const rowData = [
        index + 1,
        item.empcode,
        item.companyname,
        item.email,
        item.workmode,
        item.contactpersonal,
        item.contactfamily,
        item.emergencyno,
        "", // Placeholder for the image column
      ];

      tableRows.push(rowData);

      if (item.imageBase64) {
        imagesToLoad.push({ index, imageBase64: item.imageBase64 });
      }
    });

    const loadImage = (imageBase64) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = imageBase64;
      });
    };

    const loadedImages = await Promise.all(
      imagesToLoad.map((item) =>
        loadImage(item.imageBase64).then((img) => ({ ...item, img }))
      )
    );

    // Calculate the required row height based on image height
    const rowHeight = 20; // Set desired row height

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      didDrawCell: (data) => {
        // Ensure that the cell belongs to the body section and it's the image column
        if (
          data.section === "body" &&
          data.column.index === columns.length - 1
        ) {
          const imageInfo = loadedImages.find(
            (image) => image.index === data.row.index
          );
          if (imageInfo) {
            const imageHeight = 20; // Desired image height
            const imageWidth = 20; // Desired image width
            const xOffset = (data.cell.width - imageWidth) / 2; // Center the image horizontally
            const yOffset = (rowHeight - imageHeight) / 2; // Center the image vertically

            doc.addImage(
              imageInfo.img,
              "PNG",
              data.cell.x + xOffset,
              data.cell.y + yOffset,
              imageWidth,
              imageHeight
            );

            // Adjust cell styles to increase height
            data.cell.height = rowHeight; // Set custom height
          }
        }
      },
      headStyles: {
        minCellHeight: 5, // Set minimum cell height for header cells
        fontSize: 4, // You can adjust the font size if needed
        cellPadding: { top: 2, right: 5, bottom: 2, left: 5 }, // Adjust padding for header cells
      },
      bodyStyles: {
        fontSize: 4,
        minCellHeight: rowHeight, // Set minimum cell height for body cells
        cellPadding: { top: 7, right: 1, bottom: 0, left: 1 }, // Adjust padding for body cells
      },
    });

    doc.save("contactupdate.pdf");
  };

  // Excel
  const fileName = "contactupdate";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "contactupdate",
    pageStyle: "print",
  });
  useEffect(() => {
    const loadModels = async () => {
      const modelUrl = SERVICE.FACEDETECTLOGINMODEL;

      await faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl);
      await faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl);
      await faceapi.nets.faceRecognitionNet.loadFromUri(modelUrl);

    };
    loadModels();
    console.log(window.location.origin, "window.location.origin");
  }, []);
  // Image Upload

  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [getImg, setGetImg] = useState(null);
  const [refImage, setRefImage] = useState([]);
  const [previewURL, setPreviewURL] = useState(null);
  const [refImageDrag, setRefImageDrag] = useState([]);
  const [valNum, setValNum] = useState(0);
  const [isWebcamCapture, setIsWebcamCapture] = useState(false);

  useEffect(() => {
    setEmpaddform((prev) => ({ ...prev, profileimage: getImg }))
  }, [getImg])
  const webcamOpen = () => {
    setIsWebcamOpen(true);
  };
  const webcamClose = () => {
    setIsWebcamOpen(false);
  };
  const closeWebCam = () => {
    setEmpaddform((prev) => ({ ...prev, profileimage: "", faceDescriptor: [] }));
    setGetImg(null);
  };
  const webcamDataStore = () => {
    setIsWebcamCapture(true);
    //popup close
    webcamClose();
  };

  //add webcamera popup
  const showWebcam = () => {
    webcamOpen();
  };
  const [btnUpload, setBtnUpload] = useState(false);
  const [btnUpdate, setBtnUpdate] = useState(false);
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showDupProfileVIsitor, setShowDupProfileVIsitor] = useState([]);
  const handleClickOpenerrpop = () => {
    setIsErrorOpenpop(true);
  };
  const handleCloseerrpop = () => {
    setIsErrorOpenpop(false);
  };
  const UploadWithDuplicate = (e) => {
    setShowDupProfileVIsitor([]);
    handleCloseerrpop();
  }
  const UploadWithoutDuplicate = (e) => {
    setEmpaddform({
      ...empaddform,
      profileimage: "",
      faceDescriptor: [],
    });

    setShowDupProfileVIsitor([]);
    handleCloseerrpop();
  }
  const [imageUploaded, setImageUploaded] = useState(false);
  function handleChangeImage(e) {
    setBtnUpload(true); // Enable loader when the process starts
    const maxFileSize = 1 * 1024 * 1024; // 1MB in bytes

    // Get the selected file
    const file = e.target.files[0];

    if (file && file.size < maxFileSize) {
      const path = URL.createObjectURL(file);
      const image = new Image();
      image.src = path;

      image.onload = async () => {
        try {
          const detections = await faceapi
            .detectAllFaces(image, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptors();
          if (detections.length > 0) {
            const faceDescriptor = detections[0].descriptor;

            const response = await axios.post(
              `${SERVICE.DUPLICATECANDIDATEFACEDETECTVISITOR}`,
              {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
                id: empaddform?._id,
                faceDescriptor: Array.from(faceDescriptor),
              }
            );


            if (response?.data?.matchfound) {
              // setPopupContentMalert('Image Already In Use.');
              // setPopupSeverityMalert("info");
              // handleClickOpenPopupMalert();
              toDataURL(path, function (dataUrl) {
                setEmpaddform({
                  ...empaddform,
                  profileimage: String(dataUrl),
                  faceDescriptor: Array.from(faceDescriptor),
                });

              });
              setShowDupProfileVIsitor(response?.data?.matchedData);
              handleClickOpenerrpop();
            } else {
              toDataURL(path, function (dataUrl) {

                setEmpaddform({
                  ...empaddform,
                  profileimage: String(dataUrl),
                  faceDescriptor: Array.from(faceDescriptor),
                });
              });
            }

            setImageUploaded(true);
          } else {
            setPopupContentMalert('No face detected.');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
          }
        } catch (error) {
          setPopupContentMalert('Error in face detection.');
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
        } finally {
          setBtnUpload(false); // Disable loader when done
        }
      };

      image.onerror = (err) => {
        setPopupContentMalert('Error loading image.');
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();;
        setBtnUpload(false); // Disable loader in case of error
      };

      setFile(URL.createObjectURL(file));
    } else {
      setPopupContentMalert('File size is greater than 1MB, please upload a file below 1MB.');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      setBtnUpload(false); // Disable loader if file is too large
    }
  }

  // function handleChangeImage(e) {
  //   setBtnUpload(true);
  //   const maxFileSize = 1 * 1024 * 1024; // 1MB in bytes

  //   // Get the selected file
  //   const file = e.target.files[0];

  //   // Check if file exists and its size
  //   if (file && file.size < maxFileSize) {
  //     // Create a URL for the selected file
  //     const path = URL.createObjectURL(file);

  //     // Create an HTMLImageElement and set its source to the file URL
  //     const image = new Image();
  //     image.src = path;

  //     image.onload = async () => {
  //       setPageName(!pageName)

  //         // Perform face detection and extraction
  //         const detections = await faceapi
  //           .detectAllFaces(image, new faceapi.TinyFaceDetectorOptions())
  //           .withFaceLandmarks()
  //           .withFaceDescriptors();

  //         console.log("Face detections:", detections);

  //         if (detections.length > 0) {
  //           const faceDescriptor = detections[0].descriptor;
  //           console.log("Face descriptor:", faceDescriptor);

  //           const response = await axios.post(
  //             `${SERVICE.DUPLICATEFACEDETECT}`,
  //             {
  //               headers: {
  //                 Authorization: `Bearer ${auth.APIToken}`,
  //               },
  //               id: getrowid._id,
  //               faceDescriptor: Array.from(faceDescriptor),
  //             }
  //           );

  //           console.log(response?.data?.matchfound);
  //           if (response?.data?.matchfound) {
  //             console.log("Image Already In Use.");
  //             setShowAlert(
  //               <>
  //                 <ErrorOutlineOutlinedIcon
  //                   sx={{ fontSize: "100px", color: "orange" }}
  //                 />
  //                 <p style={{ fontSize: "20px", fontWeight: 900 }}>
  //                   {"Image Already In Use."}
  //                 </p>
  //               </>
  //             );
  //             handleClickOpenerr();
  //           } else {
  //             // Convert the image to base64
  //             toDataURL(path, function (dataUrl) {
  //               // Update the state with image and face descriptor
  //               setEmpaddform({
  //                 ...empaddform,
  //                 profileimage: String(dataUrl),
  //                 faceDescriptor: Array.from(faceDescriptor), // Convert Float32Array to Array
  //               });
  //               setBtnUpload(false);
  //             });
  //             setBtnUpload(false);
  //           }
  //         } else {
  //           console.log("No face detected.");
  //           setShowAlert(
  //             <>
  //               <ErrorOutlineOutlinedIcon
  //                 sx={{ fontSize: "100px", color: "orange" }}
  //               />
  //               <p style={{ fontSize: "20px", fontWeight: 900 }}>
  //                 {"No face detected."}
  //               </p>
  //             </>
  //           );
  //           handleClickOpenerr();
  //         }
  //       } catch (error) {
  //         console.error("Error in face detection:", error);
  //         setShowAlert(
  //           <>
  //             <ErrorOutlineOutlinedIcon
  //               sx={{ fontSize: "100px", color: "orange" }}
  //             />
  //             <p style={{ fontSize: "20px", fontWeight: 900 }}>
  //               {"Error in face detection."}
  //             </p>
  //           </>
  //         );
  //         handleClickOpenerr();
  //       }
  //     };

  //     image.onerror = (err) => {
  //       console.error("Error loading image:", err);
  //       setShowAlert(
  //         <>
  //           <ErrorOutlineOutlinedIcon
  //             sx={{ fontSize: "100px", color: "orange" }}
  //           />
  //           <p style={{ fontSize: "20px", fontWeight: 900 }}>
  //             {"Error loading image."}
  //           </p>
  //         </>
  //       );
  //       handleClickOpenerr();
  //     };

  //     setFile(URL.createObjectURL(file));
  //     setBtnUpload(false);
  //   } else {
  //     // Show alert if file size exceeds the limit
  //     setShowAlert(
  //       <>
  //         <ErrorOutlineOutlinedIcon
  //           sx={{ fontSize: "100px", color: "orange" }}
  //         />
  //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
  //           {"File size is greater than 1MB, please upload a file below 1MB."}
  //         </p>
  //       </>
  //     );
  //     handleClickOpenerr();
  //   }
  // }

  function toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  }

  //table entries ..,.
  const [items, setItems] = useState([]);

  const addSerialNumber = (datas) => {
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

  const filteredData = filteredDatas?.slice(
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
      width: 130,
      hide: !columnVisibility.empcode,
      headerClassName: "bold-header",
      pinned: 'left',
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
      headerName: "Company Name",
      flex: 0,
      width: 180,
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
                handleCopy("Copied Company Name!");
              }}
              options={{ message: "Copied Company Name!" }}
              text={params?.data?.companyname}
            >
              <ListItemText primary={params?.data?.companyname} />
            </CopyToClipboard>
          </ListItem>
        </Grid>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 0,
      width: 130,
      hide: !columnVisibility.email,
      headerClassName: "bold-header",
    },
    {
      field: "workmode",
      headerName: "Work Mode",
      flex: 0,
      width: 130,
      hide: !columnVisibility.workmode,
      headerClassName: "bold-header",
    },
    {
      field: "contactpersonal",
      headerName: "Contact Personal",
      flex: 0,
      width: 100,
      hide: !columnVisibility.contactpersonal,
      headerClassName: "bold-header",
    },
    {
      field: "contactfamily",
      headerName: "Contact Family",
      flex: 0,
      width: 100,
      hide: !columnVisibility.contactfamily,
      headerClassName: "bold-header",
    },
    {
      field: "emergencyno",
      headerName: "EmergencyNo",
      flex: 0,
      width: 100,
      hide: !columnVisibility.emergencyno,
      headerClassName: "bold-header",
    },
    {
      field: "imageBase64",
      headerName: "Profile",
      flex: 0,
      width: 100,
      hide: !columnVisibility.profileimage,
      headerClassName: "bold-header",
      cellRenderer: (params) => {

        return params.value !== "" ? (
          <img
            src={params.value}
            alt="Profile"
            style={{ width: "100%", height: "auto" }}
          />
        ) : (
          <></>
        );
      },
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
        <>
          {isUserRoleCompare.includes("Manager") ? (
            <>
              <Grid container spacing={2}>
                <Grid item>
                  {isUserRoleCompare?.includes("icontactinfoupdate") && (
                    <>
                      <Button
                        sx={userStyle.buttonedit}
                        onClick={() => {
                          handleClickOpeninfo();
                          getinfoCode(params.data.id);
                        }}
                      >
                        <InfoOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttoninfo} />
                      </Button>
                    </>
                  )}
                </Grid>
              </Grid>
            </>
          ) : (
            <>
              <Grid sx={{ display: "flex" }}>
                {isUserRoleCompare?.includes("econtactinfoupdate") && (
                  <Button
                    sx={userStyle.buttonedit}
                    onClick={() => {

                      getCode(params.data.id);
                    }}
                  >
                    <EditIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonedit} />
                  </Button>
                )}

                {isUserRoleCompare?.includes("icontactinfoupdate") && (
                  <Button
                    sx={userStyle.buttonedit}
                    onClick={() => {

                      getinfoCode(params.data.id);
                    }}
                  >
                    <InfoOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttoninfo} />
                  </Button>
                )}
              </Grid>
            </>
          )}
        </>
      ),
    },
  ];

  const rowDataTable = filteredData.map((item) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      empcode: item.empcode,
      companyname: item.companyname,
      email: item.email,
      workmode: item.workmode,
      contactpersonal: item.contactpersonal,
      contactfamily: item.contactfamily,
      emergencyno: item.emergencyno,
      imageBase64: item?.profileimage,
    };
  });



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

  const [referenceTodo, setReferenceTodo] = useState([]);
  const [referenceTodoError, setReferenceTodoError] = useState({});
  const [singleReferenceTodo, setSingleReferenceTodo] = useState({
    name: "",
    relationship: "",
    occupation: "",
    contact: "",
    details: "",
  });

  const addReferenceTodoFunction = () => {
    const isNameMatch = referenceTodo?.some(
      (item) =>
        item.name.toLowerCase() === singleReferenceTodo.name.toLowerCase()
    );
    const newErrorsLog = {};
    if (singleReferenceTodo.name === "") {
      newErrorsLog.name = (
        <Typography style={{ color: "red" }}>Name must be required</Typography>
      );
    } else if (
      singleReferenceTodo.contact.length > 0 &&
      singleReferenceTodo.contact.length < 10
    ) {
      newErrorsLog.contact = (
        <Typography style={{ color: "red" }}>
          Contact must be 10 Digit
        </Typography>
      );
    } else if (isNameMatch) {
      newErrorsLog.duplicate = (
        <Typography style={{ color: "red" }}>
          Reference Already Exist!
        </Typography>
      );
    } else if (singleReferenceTodo !== "") {
      setReferenceTodo([...referenceTodo, singleReferenceTodo]);
      setSingleReferenceTodo({
        name: "",
        relationship: "",
        occupation: "",
        contact: "",
        details: "",
      });
    }
    setReferenceTodoError(newErrorsLog);
  };
  const deleteReferenceTodo = (index) => {
    const newTasks = [...referenceTodo];
    newTasks.splice(index, 1);
    setReferenceTodo(newTasks);
    setReferenceTodoError({});
  };

  const handlechangereferencecontactno = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value?.slice(0, 10);
    if (regex.test(inputValue) || inputValue === "") {
      setSingleReferenceTodo({ ...singleReferenceTodo, contact: inputValue });
    }
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
    } else {
      setSearchQuery("")
      fetchHandler();
    }
  };

  //auto select all dropdowns
  const handleAutoSelect = async () => {
    setPageName(!pageName)
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
      //----------------------------
      let mappedemployees = allUsersData
        ?.filter(
          (u) =>
            selectedCompany?.includes(u.company) &&
            selectedBranch?.includes(u.branch) &&
            selectedUnit?.includes(u.unit) &&
            selectedTeam?.includes(u.team)
          //   &&
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
      setValueEmployeeCat(employees);
      setSelectedOptionsEmployee(mappedemployees);
      setValueEmp(mappedemployees?.map((item) => item?.value));

      //-----------------
      setValueTeamCat(selectedTeam);
      setSelectedOptionsTeam(mappedTeam);
      setAllAssignCompany(selectedCompany);

      setAllAssignBranch(selectedBranch);

      setAllAssignUnit(selectedUnit);
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
      <Headtitle title={"CONTACT UPDATE"} />
      <PageHeading
        title="Contact Update"
        modulename="Human Resources"
        submodulename="HR"
        mainpagename="Employee"
        subpagename="Employee Update Details"
        subsubpagename="Contact Info update"
      />
      <br />
      {isUserRoleCompare?.includes("lcontactinfoupdate") && (
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
                  sx={buttonStyles.buttonsubmit}
                  variant="contained"
                  onClick={handleFilter}
                >
                  {" "}
                  Filter{" "}
                </Button>
              </Grid>
              <Grid item lg={1} md={2} sm={2} xs={12}>
                <Button sx={buttonStyles.btncancel} onClick={handleClearFilter}>
                  {" "}
                  Clear{" "}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
      <br />
      {isUserRoleCompare?.includes("lcontactinfoupdate") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Contact Update List
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
                  {isUserRoleCompare?.includes("excelcontactinfoupdate") && (
                    <>
                      <ExportXLWithImages
                        csvData={rowDataTable}
                        fileName={fileName}
                      />
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvcontactinfoupdate") && (
                    <>
                      <ExportCSVWithImages
                        csvData={rowDataTable}
                        fileName={fileName}
                      />
                    </>
                  )}
                  {isUserRoleCompare?.includes("printcontactinfoupdate") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfcontactinfoupdate") && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={() => downloadPdf()}
                      >
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imagecontactinfoupdate") && (
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
            &ensp;
            <br />
            <br />
            {isContact ? (
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
                  rowHeight={80}
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

      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth={true}
          maxWidth="md"
          sx={{ marginTop: '50px' }}
        // PaperProps={{ sx: { position: "fixed", top: 10, left: 10, m: 0 } }}
        >
          <DialogContent sx={userStyle.dialogbox}>
            <Box>
              <form onSubmit={handleSubmit}>
                <Box>
                  <Typography sx={userStyle.SubHeaderText}>
                    {" "}
                    Update Employee Contact
                  </Typography>
                  <br />
                  <br />
                  <>
                    <Grid container spacing={2}>
                      <Grid
                        item
                        md={6}
                        sm={12}
                        xs={12}
                        sx={{ display: "flex" }}
                      >
                        <Typography
                          sx={{ fontWeight: "600", marginRight: "5px" }}
                        >
                          Employee Name:
                        </Typography>
                        <Typography>{empaddform.companyname}</Typography>
                      </Grid>
                      <br />
                      <br />
                      <Grid
                        item
                        md={6}
                        sm={12}
                        xs={12}
                        sx={{ display: "flex" }}
                      >
                        <Typography
                          sx={{ fontWeight: "600", marginRight: "5px" }}
                        >
                          Emp Code:
                        </Typography>
                        <Typography>{empaddform.empcode}</Typography>
                      </Grid>
                    </Grid>
                    <br />
                    <br />
                    <Grid container spacing={2}>
                      <Grid item md={6} sm={12} xs={12}>
                        <Grid container spacing={1}>
                          <Grid item md={12} sm={12} xs={12}>
                            <FormControl fullWidth size="small">
                              <Typography>
                                Email<b style={{ color: "red" }}>*</b>
                              </Typography>
                              <OutlinedInput
                                id="component-outlined"
                                type="text"
                                placeholder="Email"
                                value={empaddform.email}
                                onChange={(e) => {
                                  setEmpaddform({
                                    ...empaddform,
                                    email: e.target.value,
                                  });
                                }}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={12} sm={12} xs={12}>
                            <FormControl fullWidth size="small">
                              <Typography>
                                Contact(personal){" "}
                                <b style={{ color: "red" }}>*</b>
                              </Typography>
                              <OutlinedInput
                                id="component-outlined"
                                type="text"
                                placeholder="Contact no(personal)"
                                value={empaddform.contactpersonal?.slice(0, 10)}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (value === "" || /^\d*$/.test(value)) {
                                    setEmpaddform({
                                      ...empaddform,
                                      contactpersonal: value,
                                    });
                                  }
                                }}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={12} sm={12} xs={12}>
                            <FormControl fullWidth size="small">
                              <Typography>
                                Contact(Family){" "}
                                <b style={{ color: "red" }}>*</b>{" "}
                              </Typography>
                              <OutlinedInput
                                id="component-outlined"
                                type="text"
                                placeholder="contact no(Family)"
                                value={empaddform.contactfamily?.slice(0, 10)}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (value === "" || /^\d*$/.test(value)) {
                                    setEmpaddform({
                                      ...empaddform,
                                      contactfamily: value,
                                    });
                                  }
                                }}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={12} sm={12} xs={12}>
                            <FormControl fullWidth size="small">
                              <Typography>
                                Emergency No<b style={{ color: "red" }}>*</b>
                              </Typography>
                              <OutlinedInput
                                id="component-outlined"
                                type="text"
                                placeholder="contact no(Emergency)"
                                value={empaddform.emergencyno?.slice(0, 10)}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (value === "" || /^\d*$/.test(value)) {
                                    setEmpaddform({
                                      ...empaddform,
                                      emergencyno: value,
                                    });
                                  }
                                }}
                              />
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Grid>
                      <br />
                      <br />
                      <br />
                      <Grid item lg={6} md={3} sm={12} xs={12}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <InputLabel>Profile Image</InputLabel>
                        </Box>
                        <br />
                        <Grid
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Box
                            sx={{
                              border: "1px solid black",
                              width: "153px",
                              height: "153px",
                            }}
                          >
                            <img
                              src={
                                croppedImage
                                  ? croppedImage
                                  : empaddform.profileimage
                                    ? empaddform.profileimage
                                    : "https://t4.ftcdn.net/jpg/03/59/58/91/360_F_359589186_JDLl8dIWoBNf1iqEkHxhUeeOulx0wOC5.jpg"
                              }
                              alt="profile"
                              width="100%"
                              height="100%"
                            />
                          </Box>
                        </Grid>
                        <br />
                        <FormControl size="small" fullWidth>
                          {/* <Grid
                            container
                            spacing={2}
                            sx={{
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Grid item>
                              <LoadingButton
                                component="label"
                                variant="contained"
                                loading={btnUpload}
                                sx={buttonStyles.buttonsubmit}
                              >
                                Upload
                                <input
                                  type="file"
                                  id="profileimage"
                                  name="file"
                                  hidden
                                  onChange={handleChangeImage}
                                />
                              </LoadingButton>
                            </Grid>
                                {empaddform.profileimage && (
                            <Grid item>
                              <Button
                                sx={buttonStyles.btncancel}
                                onClick={handleClearImage}
                              >
                                Clear
                              </Button>
                            </Grid>
                             )} 
                          </Grid> */}


                          {croppedImage && (
                            <>
                              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                {/* <img
                                  style={{
                                    height: 120,
                                    borderRadius: '8px', // Rounded corners for the image
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for the image
                                    objectFit: 'cover', // Ensure the image covers the area without distortion
                                  }}
                                  src={croppedImage}
                                  alt="Cropped"
                                /> */}

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                  {/* Color Picker */}
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <Typography
                                      variant="body1"
                                      style={{

                                        color: '#555',
                                        fontSize: '10px'
                                      }}
                                    >
                                      BG Color
                                    </Typography>
                                    <input
                                      type="color"
                                      value={color}
                                      onChange={handleColorChange}
                                      style={{
                                        width: '30px',
                                        height: '30px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        borderRadius: '5px',
                                      }}
                                    />
                                  </div>

                                  {/* Submit Button */}
                                  <LoadingButton
                                    onClick={handleSubmitBG}
                                    loading={bgbtn}
                                    variant="contained"
                                    color="primary"
                                    endIcon={<FormatColorFillIcon />}
                                    sx={{
                                      padding: '10px 10px',
                                      fontSize: '8px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '8px',
                                      borderRadius: '5px',
                                      color: isLightColor ? 'black' : 'white',
                                      fontWeight: '600',
                                      backgroundColor: color, // Dynamically set the background color
                                      '&:hover': {
                                        backgroundColor: `${color}90`, // Slightly transparent on hover for a nice effect
                                      },
                                      border: '1px solid  black'
                                    }}
                                  >

                                  </LoadingButton>
                                </div>
                              </div>
                            </>
                          )}
                          <div>
                            {empaddform.profileimage && !croppedImage ? (
                              <>
                                <Cropper
                                  style={{ height: 150 }}
                                  aspectRatio={1 / 1}
                                  src={empaddform.profileimage}
                                  ref={cropperRef}
                                />
                                <Box
                                  sx={{
                                    display: "flex",
                                    marginTop: "10px",
                                    gap: "10px",

                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}


                                >

                                  <Box>
                                    <Typography
                                      sx={userStyle.uploadbtn}
                                      onClick={handleCrop}
                                    >
                                      Crop Image
                                    </Typography>
                                  </Box>
                                  <Box>
                                    <Button
                                      variant="outlined"
                                      sx={userStyle.btncancel}
                                      onClick={handleClearImage}
                                    >
                                      Clear
                                    </Button>
                                  </Box>
                                </Box>
                              </>
                            ) : (
                              <>
                                {!empaddform.profileimage && (
                                  <Grid container sx={{
                                    display: "flex", justifyContent: "center",
                                    alignItems: "center",
                                  }}>
                                    <Grid item md={6} sm={6}>
                                      <section>
                                        <LoadingButton
                                          component="label"
                                          variant="contained"
                                          loading={btnUpload}
                                          sx={buttonStyles?.buttonsubmit}
                                        >
                                          Upload
                                          <input
                                            type="file"
                                            id="profileimage"
                                            name="file"
                                            accept="image/*"
                                            hidden
                                            onChange={handleChangeImage}
                                          />
                                          <br />
                                        </LoadingButton>
                                      </section>
                                    </Grid>
                                    <Grid item md={6} sm={6}>
                                      <Button
                                        onClick={showWebcam}
                                        variant="contained"
                                        sx={userStyle.uploadbtn}
                                      >
                                        <CameraAltIcon />
                                      </Button>
                                    </Grid>
                                  </Grid>
                                )}
                                {empaddform.profileimage && (
                                  <>
                                    <Grid item md={4} sm={4}>
                                      <Button
                                        variant="outlined"
                                        sx={userStyle.btncancel}
                                        onClick={handleClearImage}
                                      >
                                        Clear
                                      </Button>
                                    </Grid>
                                  </>
                                )}
                              </>
                            )}
                          </div>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              variant="body2"
                              style={{ marginTop: "5px" }}
                            >
                              Max File size: 1MB
                            </Typography>
                          </Box>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <br />
                  </>
                  <Grid item xs={8}>
                    <Typography sx={userStyle.importheadtext}>
                      Reference Details{" "}
                    </Typography>
                  </Grid>
                  <br />
                  <Grid container spacing={1}>
                    {/* <Grid item md={6} sm={12} xs={12}>
                                                <FormControl size="small" fullWidth>
                                                    <Typography>Name</Typography>
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="text"
                                                        placeholder="Reference Name"
                                                        value={empaddform.referencename}
                                                        onChange={(e) => { setEmpaddform({ ...empaddform, referencename: e.target.value }) }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={6} sm={12} xs={12}>
                                                <FormControl size="small" fullWidth>
                                                    <Typography>Contact</Typography>
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="number"
                                                        placeholder="Contact No"
                                                        value={(empaddform.contactno)?.slice(0, 10)}
                                                        onChange={(e) => { setEmpaddform({ ...empaddform, contactno: e.target.value }) }}
                                                    />
                                                </FormControl>
                                            </Grid><br />
                                            <Grid item md={12} sm={12} xs={12}>
                                                <FormControl fullWidth>
                                                    <Typography>Details</Typography>
                                                    <TextareaAutosize aria-label="minimum height" minRows={5}
                                                        value={empaddform.details}
                                                        onChange={(e) => { setEmpaddform({ ...empaddform, details: e.target.value }) }}
                                                        placeholder="Reference Details"
                                                    />
                                                </FormControl>
                                            </Grid> */}
                    <Grid item md={4} sm={6} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>
                          Name<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Reference Name"
                          value={singleReferenceTodo.name}
                          onChange={(e) => {
                            setSingleReferenceTodo({
                              ...singleReferenceTodo,
                              name: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                      {referenceTodoError.name && (
                        <div>{referenceTodoError.name}</div>
                      )}
                      {referenceTodoError.duplicate && (
                        <div>{referenceTodoError.duplicate}</div>
                      )}
                    </Grid>
                    <Grid item md={4} sm={6} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Relationship</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Relationship"
                          value={singleReferenceTodo.relationship}
                          onChange={(e) => {
                            setSingleReferenceTodo({
                              ...singleReferenceTodo,
                              relationship: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} sm={6} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Occupation</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Occupation"
                          value={singleReferenceTodo.occupation}
                          onChange={(e) => {
                            setSingleReferenceTodo({
                              ...singleReferenceTodo,
                              occupation: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} sm={6} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Contact</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          sx={userStyle.input}
                          placeholder="Contact No"
                          value={singleReferenceTodo.contact}
                          onChange={(e) => {
                            handlechangereferencecontactno(e);
                          }}
                        />
                      </FormControl>
                      {referenceTodoError.contact && (
                        <div>{referenceTodoError.contact}</div>
                      )}
                    </Grid>
                    <Grid item md={4} sm={12} xs={12}>
                      <FormControl fullWidth>
                        <Typography>Details</Typography>
                        <TextareaAutosize
                          aria-label="minimum height"
                          minRows={5}
                          value={singleReferenceTodo.details}
                          onChange={(e) => {
                            setSingleReferenceTodo({
                              ...singleReferenceTodo,
                              details: e.target.value,
                            });
                          }}
                          placeholder="Reference Details"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={0.5} sm={6} xs={12}>
                      <Button
                        variant="contained"
                        color="primary"
                        style={{
                          height: "30px",
                          minWidth: "20px",
                          padding: "19px 13px",
                          marginTop: "25px",
                        }}
                        onClick={addReferenceTodoFunction}
                      >
                        <FaPlus />
                      </Button>
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      {" "}
                    </Grid>
                    <Grid item md={12} sm={12} xs={12}>
                      <TableContainer component={Paper}>
                        <Table
                          sx={{ minWidth: 700 }}
                          aria-label="customized table"
                          id="usertable"
                        >
                          <TableHead sx={{ fontWeight: "600" }}>
                            <StyledTableRow>
                              <StyledTableCell>SNo</StyledTableCell>
                              <StyledTableCell>Name</StyledTableCell>
                              <StyledTableCell>Relationship</StyledTableCell>
                              <StyledTableCell>Occupation</StyledTableCell>
                              <StyledTableCell>Contact</StyledTableCell>
                              <StyledTableCell>Details</StyledTableCell>
                              <StyledTableCell></StyledTableCell>
                            </StyledTableRow>
                          </TableHead>
                          <TableBody align="left">
                            {referenceTodo?.length > 0 ? (
                              referenceTodo?.map((row, index) => (
                                <StyledTableRow>
                                  <StyledTableCell>{index + 1}</StyledTableCell>
                                  <StyledTableCell>{row.name}</StyledTableCell>
                                  <StyledTableCell>
                                    {row.relationship}
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    {row.occupation}
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    {row.contact}
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    {row.details}
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    <CloseIcon
                                      sx={{ color: "red", cursor: "pointer" }}
                                      onClick={() => {
                                        // handleClickOpen(index);
                                        // setDeleteIndex(index);
                                        deleteReferenceTodo(index);
                                      }}
                                    />
                                  </StyledTableCell>
                                </StyledTableRow>
                              ))
                            ) : (
                              <StyledTableRow>
                                {" "}
                                <StyledTableCell colSpan={8} align="center">
                                  No Data Available
                                </StyledTableCell>{" "}
                              </StyledTableRow>
                            )}
                            <StyledTableRow></StyledTableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </Grid>{" "}
                  <br />
                  <br />
                  <Grid
                    container
                    spacing={2}
                    sx={{
                      textAlign: "center",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Grid item md={1}></Grid>

                    <LoadingButton
                      type="submit"
                      variant="contained"
                      loading={btnUpdate || btnUpload}
                      sx={buttonStyles.buttonsubmit}
                    >
                      Update
                    </LoadingButton>
                    <Grid item md={1}></Grid>
                    <Button
                      sx={buttonStyles.btncancel}
                      onClick={handleCloseModEdit}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Box>
                <br />

                {/* ****** Table End ****** */}
              </form>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
      <Box></Box>
      <Box>
        <Dialog
          open={isErrorOpen}
          onClose={handleCloseerr}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{
              width: "350px",
              textAlign: "center",
              alignItems: "center",
            }}
          >
            {/* <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "80px", color: "orange" }}
                          /> */}
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
        sx={{ marginTop: '50px' }}
      >
        <Box sx={{ width: "550px", padding: "20px 30px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              Contactupdate Info
            </Typography>
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

      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box sx={{ width: "450px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              View Login Details
            </Typography>
            <br /> <br />
            <form sx={{ maxWidth: "1200px" }}>
              <Grid container spacing={3}>
                <Grid item md={6} sm={12} xs={12}>
                  <Typography>
                    {empaddform.prefix +
                      "." +
                      empaddform.firstname +
                      empaddform.lastname}
                  </Typography>
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                  <Typography>{empaddform.empcode}</Typography>
                </Grid>
              </Grid>
              <br />
              <br />
              <br />
              <Grid container spacing={4}>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography sx={userStyle.SubHeaderText}>
                      Email<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Typography>{empaddform.email}</Typography>
                  </FormControl>
                  <br />
                  <br />
                  <br />
                  <FormControl fullWidth size="small">
                    <Typography sx={userStyle.SubHeaderText}>
                      per.contact
                    </Typography>
                    <Typography>{empaddform.contactpersonal}</Typography>
                  </FormControl>
                </Grid>
                <br />
                <br />
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Upload Image</Typography>

                    <Grid
                      sx={{
                        border: "1px solid black",
                        height: 153,
                        width: 153,
                      }}
                    >
                      <img
                        src={empaddform.profileimage}
                        alt="profile"
                        height="150px"
                        width="150px"
                      ></img>
                    </Grid>
                    <Typography></Typography>
                  </FormControl>
                </Grid>
                <br />
                <br />
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography sx={userStyle.SubHeaderText}>
                      Fam.contact
                    </Typography>
                    <Typography>{empaddform.contactfamily}</Typography>
                  </FormControl>
                </Grid>
                <br />
                <br />
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography sx={userStyle.SubHeaderText}>
                      Emergency.no<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Typography>{empaddform.emergencyno}</Typography>
                  </FormControl>
                </Grid>
                <br />
                <br />
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography sx={userStyle.SubHeaderText}> Name</Typography>
                    <Typography>
                      {empaddform.prefix + "." + empaddform.firstname}
                    </Typography>
                  </FormControl>
                </Grid>
                <br />
                <br />
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography sx={userStyle.SubHeaderText}>
                      Details
                    </Typography>
                    <Typography>{empaddform.details}</Typography>
                  </FormControl>
                </Grid>
              </Grid>
              <br /> <br /> <br />
              <Grid
                container
                spacing={2}
                sx={{
                  textAlign: "center",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCloseview}
                  sx={buttonStyles.btncancel}
                >
                  {" "}
                  Back{" "}
                </Button>
              </Grid>
            </form>
          </>
        </Box>
      </Dialog>
      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table aria-label="simple table" id="branch" ref={componentRef}>
          <TableHead sx={{ fontWeight: "600" }}>
            <StyledTableRow>
              <StyledTableCell>SI.NO</StyledTableCell>
              <StyledTableCell>Emp code</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Work Mode</StyledTableCell>
              <StyledTableCell>Contact Personal</StyledTableCell>
              <StyledTableCell>Contact family</StyledTableCell>
              <StyledTableCell>EmergencyNo</StyledTableCell>
              <StyledTableCell>Image</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {rowDataTable &&
              rowDataTable.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{row.empcode}</StyledTableCell>
                  <StyledTableCell> {row.companyname}</StyledTableCell>
                  <StyledTableCell>{row.email}</StyledTableCell>
                  <StyledTableCell>{row.workmode}</StyledTableCell>
                  <StyledTableCell>{row.contactpersonal}</StyledTableCell>
                  <StyledTableCell>{row.contactfamily}</StyledTableCell>
                  <StyledTableCell>{row.emergencyno}</StyledTableCell>
                  <StyledTableCell>{row?.imageBase64 ? <img src={row?.imageBase64} style={{ height: "100px", width: "100px" }} /> : ""}</StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

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
      <Dialog open={isErrorOpenpop} onClose={(event, reason) => {
        if (reason === "backdropClick") {
          // Ignore backdrop clicks
          return;
        }
        handleCloseerrpop(); // Handle other close actions
      }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth={true}
        sx={{ marginTop: "80px" }}
      >
        <Box sx={userStyle.dialogbox}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              <b>Existing Profile List</b>
            </Typography>
            <Grid item md={6} sm={12} xs={12}>
              {showDupProfileVIsitor && showDupProfileVIsitor.length > 0 ? (
                <ExistingProfileVisitor
                  ExistingProfileVisitors={showDupProfileVIsitor}

                />) : (
                <Typography sx={{ ...userStyle.HeaderText, marginLeft: '28px', display: "flex", justifyContent: "center" }}>
                  There is No Profile
                </Typography>
              )}
            </Grid>
            <br />
            <Grid item md={12} sm={12} xs={12}>
              <Grid
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "15px",
                }}
              >
                <Tooltip
                  title={
                    showDupProfileVIsitor?.some(data => data?.modelName === "Employee")
                      ? "Cannot upload duplicate images for Employee."
                      : ""
                  }
                  placement="top"
                  arrow
                >
                  <span>
                    <Button
                      style={{
                        padding: "7px 13px",
                        color: "white",
                        background: "rgb(25, 118, 210)",
                        ...buttonStyles?.buttonsubmit,
                      }}
                      disabled={showDupProfileVIsitor?.some(data => data?.modelName === "Employee")}
                      onClick={() => {
                        UploadWithDuplicate();
                      }}
                    >
                      Upload With Duplicate
                    </Button>
                  </span>
                </Tooltip>
                <Button sx={buttonStyles.btncancel} onClick={UploadWithoutDuplicate}>
                  Upload Without Duplicate
                </Button>
              </Grid>
            </Grid>

          </>
        </Box>
      </Dialog>


      <Dialog
        open={isWebcamOpen}
        onClose={(event, reason) => {
          if (reason === "backdropClick") {
            // Ignore backdrop clicks
            return;
          }
          webcamClose(); // Handle other close actions
          closeWebCam();
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent sx={{ textAlign: "center", alignItems: "center" }}>
          <Webcamimage
            name="create"
            getImg={getImg}
            setGetImg={setGetImg}
            valNum={valNum}
            setValNum={setValNum}
            capturedImages={capturedImages}
            setCapturedImages={setCapturedImages}
            setRefImage={setRefImage}
            setRefImageDrag={setRefImageDrag}
            setVendor={setEmpaddform}
            vendor={empaddform}
            fromEmployee={true}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="success"
            onClick={webcamDataStore}
            sx={buttonStyles?.buttonsubmit}
          >
            OK
          </Button>
          <Button variant="contained" color="error" onClick={() => {
            webcamClose();
            closeWebCam();
          }}
            sx={buttonStyles?.btncancel}
          >
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Contactupdate;