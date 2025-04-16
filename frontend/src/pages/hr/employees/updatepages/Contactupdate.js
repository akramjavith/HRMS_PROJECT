import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  Dialog,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Popover,
  Checkbox,
  TextField,
  IconButton,
  OutlinedInput,
  TextareaAutosize,
  DialogContent,
  InputLabel,
  FormControl,
  DialogActions,
  Grid,
  Paper,
  Table,
  TableHead,
  TableContainer,
  Button,
  TableBody,
} from "@mui/material";
import { userStyle } from "../../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../../components/Table";
import EditIcon from "@mui/icons-material/Edit";
import { SERVICE } from "../../../../services/Baseservice";
import { handleApiError } from "../../../../components/Errorhandling";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment-timezone";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../../../context/Appcontext";
import { AuthContext } from "../../../../context/Appcontext";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import StyledDataGrid from "../../../../components/TableStyle";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { FaPlus } from "react-icons/fa";
import { FaFileExcel } from "react-icons/fa";
import ExcelJS from "exceljs";
import * as FileSaver from "file-saver";
import PageHeading from "../../../../components/PageHeading";
import Headtitle from "../../../../components/Headtitle";
import { MultiSelect } from "react-multi-select-component";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import * as faceapi from "face-api.js";

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

function Contactupdate() {
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
  } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);

  const [file, setFile] = useState("");

  const [isContact, setIsContact] = useState(false);

  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Copied fields Name
  const handleCopy = (message) => {
    NotificationManager.success(`${message} 👍`, "", 2000);
  };

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Contactupdate.png");
        });
      });
    }
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
  };

  const handleClearImage = () => {
    setFile(null);
    setEmpaddform({
      ...empaddform,
      profileimage: "",
    });
  };

  const [profileAvailed, setProfileAvailed] = useState(false);
  const [docID, setDocID] = useState("");

  const getCode = async (e) => {
    setPageName(!pageName);
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
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setEmpaddform(res?.data?.suser);
      setRowGetid(res?.data?.suser);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
    setPageName(!pageName);
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
      await fetchHandler();

      setShowAlert(
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Updated Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
      handleCloseModEdit();
    } catch (err) {
      console.log(err, "err");
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const editSubmit = (e) => {
    e.preventDefault();
    sendRequestt();
  };
  const [allAssignCompany, setAllAssignCompany] = useState([]);
  const [allAssignBranch, setAllAssignBranch] = useState([]);
  const [allAssignUnit, setAllAssignUnit] = useState([]);
  //get all employees list details
  const fetchHandler = async () => {
    setPageName(!pageName);
    setIsContact(true);
    try {
      let aggregationPipeline = [
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const validateEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;

    return regex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      empaddform.emergencyno === "" ||
      (empaddform.emergencyno?.length > 0 &&
        empaddform.emergencyno?.length < 10)
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter or Check Correct Emergency No"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (empaddform?.email == "" || !validateEmail(empaddform?.email)) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Valid Email"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      empaddform.contactpersonal === "" ||
      !empaddform.contactpersonal
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Contact Personal No"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      empaddform.contactpersonal?.length > 0 &&
      empaddform.contactpersonal?.length < 10
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Valid Contact Personal No"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (empaddform.contactfamily === "" || !empaddform.contactfamily) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Contact Family No"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      empaddform.contactfamily?.length > 0 &&
      empaddform.contactfamily?.length < 10
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Valid Contact Family No"}
          </p>
        </>
      );
      handleClickOpenerr();
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
      console.log(modelUrl, "modelUrl");
      await faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl);
      await faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl);
      await faceapi.nets.faceRecognitionNet.loadFromUri(modelUrl);
      console.log("Models loaded");
    };
    loadModels();
    console.log(window.location.origin, "window.location.origin");
  }, []);
  // Image Upload
  function handleChangeImage(e) {
    const maxFileSize = 1 * 1024 * 1024; // 1MB in bytes

    // Get the selected file
    const file = e.target.files[0];

    // Check if file exists and its size
    if (file && file.size < maxFileSize) {
      // Create a URL for the selected file
      const path = URL.createObjectURL(file);

      // Create an HTMLImageElement and set its source to the file URL
      const image = new Image();
      image.src = path;

      image.onload = async () => {
        try {
          // Perform face detection and extraction
          const detections = await faceapi
            .detectAllFaces(image, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptors();

          console.log("Face detections:", detections);

          if (detections.length > 0) {
            const faceDescriptor = detections[0].descriptor;
            console.log("Face descriptor:", faceDescriptor);

            // Convert the image to base64
            toDataURL(path, function (dataUrl) {
              console.log("Image base64:", dataUrl);

              // Update the state with image and face descriptor
              setEmpaddform({
                ...empaddform,
                profileimage: String(dataUrl),
                faceDescriptor: Array.from(faceDescriptor), // Convert Float32Array to Array
              });
            });
          } else {
            console.log("No face detected.");
            setShowAlert(
              <>
                <ErrorOutlineOutlinedIcon
                  sx={{ fontSize: "100px", color: "orange" }}
                />
                <p style={{ fontSize: "20px", fontWeight: 900 }}>
                  {"No face detected."}
                </p>
              </>
            );
            handleClickOpenerr();
          }
        } catch (error) {
          console.error("Error in face detection:", error);
        }
      };

      image.onerror = (err) => {
        console.error("Error loading image:", err);
      };

      setFile(URL.createObjectURL(file));
    } else {
      // Show alert if file size exceeds the limit
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"File size is greater than 1MB, please upload a file below 1MB."}
          </p>
        </>
      );
      handleClickOpenerr();
    }
  }

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

  const addSerialNumber = () => {
    const itemsWithSerialNumber = employees?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
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
      width: 90,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "empcode",
      headerName: "Emp Code",
      flex: 0,
      width: 130,
      hide: !columnVisibility.empcode,
      headerClassName: "bold-header",
      renderCell: (params) => (
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
              text={params?.row?.empcode}
            >
              <ListItemText primary={params?.row?.empcode} />
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
      renderCell: (params) => (
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
              text={params?.row?.companyname}
            >
              <ListItemText primary={params?.row?.companyname} />
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
      renderCell: (params) => {
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
      renderCell: (params) => (
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
                          getinfoCode(params.row.id);
                        }}
                      >
                        <InfoOutlinedIcon style={{ fontsize: "large" }} />
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
                      handleClickOpenEdit();
                      getCode(params.row.id);
                    }}
                  >
                    <EditIcon style={{ fontsize: "large" }} />
                  </Button>
                )}

                {isUserRoleCompare?.includes("icontactinfoupdate") && (
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
      contactpersonal: item.contactpersonal,
      contactfamily: item.contactfamily,
      emergencyno: item.emergencyno,
      imageBase64: item?.profileimage,
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

  const handleClearFilter = () => {
    setValueCompanyCat([]);
    setSelectedOptionsCompany([]);
    setValueBranchCat([]);
    setSelectedOptionsBranch([]);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setEmployees([]);
    setShowAlert(
      <>
        <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>
          {"Cleared Successfully"}
        </p>
      </>
    );
    handleClickOpenerr();
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

  //MULTISELECT ONCHANGE END

  const handleFilter = () => {
    if (selectedOptionsCompany?.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Company"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      fetchHandler();
    }
  };

  //auto select all dropdowns
  const handleAutoSelect = async () => {
    try {
      let selectedValues = isAssignBranch
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
      setValueTeamCat(selectedTeam);
      setSelectedOptionsTeam(mappedTeam);
      setAllAssignCompany(selectedCompany);

      setAllAssignBranch(selectedBranch);

      setAllAssignUnit(selectedUnit);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
        title="Manage Contact Update"
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
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    Company<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl size="small" fullWidth>
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
                <Grid item md={3} xs={12} sm={12}>
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
                </Grid>
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
                  sx={userStyle.buttonadd}
                  variant="contained"
                  onClick={handleFilter}
                >
                  {" "}
                  Filter{" "}
                </Button>
              </Grid>
              <Grid item lg={1} md={2} sm={2} xs={12}>
                <Button sx={userStyle.btncancel} onClick={handleClearFilter}>
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
                      {/* <ExportCSV csvData={userData} fileName={fileName} /> */}
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
                <Box
                  style={{
                    width: "100%",
                    overflowY: "hidden", // Hide the y-axis scrollbar
                  }}
                >
                  <StyledDataGrid
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
                    rowHeight={100}
                  />
                </Box>
                <Box style={userStyle.dataTablestyle}>
                  <Box>
                    Showing{" "}
                    {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
                    {Math.min(page * pageSize, filteredDatas.length)} of{" "}
                    {filteredDatas.length} entries
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
                                empaddform.profileimage
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
                          <Grid
                            container
                            spacing={2}
                            sx={{
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Grid item>
                              <Button
                                component="label"
                                variant="contained"
                                sx={userStyle.buttonadd}
                              >
                                Upload
                                <input
                                  type="file"
                                  id="profileimage"
                                  name="file"
                                  hidden
                                  onChange={handleChangeImage}
                                />
                              </Button>
                            </Grid>
                            {/* {file && ( */}
                            <Grid item>
                              <Button
                                sx={userStyle.btncancel}
                                onClick={handleClearImage}
                              >
                                Clear
                              </Button>
                            </Grid>
                            {/* )} */}
                          </Grid>
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
                              Max File size: 5MB
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
                    <Button variant="contained" type="submit">
                      Update
                    </Button>
                    <Grid item md={1}></Grid>
                    <Button
                      sx={userStyle.btncancel}
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
              <Button variant="contained" onClick={handleCloseinfo}>
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
                  <StyledTableCell>{row.contactpersonal}</StyledTableCell>
                  <StyledTableCell>{row.contactfamily}</StyledTableCell>
                  <StyledTableCell>{row.emergencyno}</StyledTableCell>
                  <StyledTableCell>
                    {row?.imageBase64 ? (
                      <img
                        src={row?.imageBase64}
                        style={{ height: "100px", width: "100px" }}
                      />
                    ) : (
                      ""
                    )}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Contactupdate;
