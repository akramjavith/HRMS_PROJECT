import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, Paper, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaFileCsv, FaFileExcel, FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import html2pdf from "html2pdf.js";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { htmlToText } from "html-to-text";
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import { BASE_URL } from "../../../services/Authservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import StyledDataGrid from "../../../components/TableStyle";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
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
import QRCode from 'qrcode';
import LoadingButton from "@mui/lab/LoadingButton";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';


function DocumentsPrintedStatusList({ data ,setData }) {

  //  const navigate = useNavigate();
  const generateRedirectUrl = () => {
    return `${BASE_URL}/hrdocuments/templatecreation?data=${encodeURIComponent("Rahul")}`;
  };

  let today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + "-" + mm + "-" + dd;
  //useStates
  const [date, setDate] = useState(formattedDate);
  const gridRef = useRef(null);
  let newval = "DP0001";
  // let newvalues = "DOC0001";
  const [DateFormat, setDateFormat] = useState();
  const [DateFormatEdit, setDateFormatEdit] = useState();
  const [autoId, setAutoId] = useState([]);
  const [updateGen, setUpdateGen] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [documentPreparationEdit, setDocumentPreparationEdit] = useState({ name: "" });
  const [templateCreationArray, setTemplateCreationArray] = useState([]);
  const [templateCreationArrayCreate, setTemplateCreationArrayCreate] = useState([]);
  const [templateCreationArrayEdit, setTemplateCreationArrayEdit] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [loader, setLoader] = useState(false);
  const [btnload, setBtnLoad] = useState(false);
  const [btnloadSave, setBtnLoadSave] = useState(false);
  const [fromEmail, setFromEmail] = useState("");
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [openview, setOpenview] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [cateCodeValue, setCatCodeValue] = useState([]);
  const [documentPrepartion, setDocumentPrepartion] = useState({
    date: "",
    template: "Please Select Template Name",
    referenceno: "",
    templateno: "",
    employeemode: "Please Select Employee Mode",
    department: "Please Select Department",
    company: "Please Select Company",
    issuingauthority: "Please Choose Issuing Authority",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    team: "Please Select Team",
    person: "Please Select Person",
    proption: "Please Select Print Option",
    pagesize: "Please Select pagesize",
    print: "Please Select Print Option",
    heading: "Please Select Header Option",
    signature: "Please Select Signature",
    seal: "Please Select Seal",
    issuedpersondetails: "",
  });

  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const [companyName, setCompanyName] = useState("");
  const [signatureEdit, setSignatureEdit] = useState("");
  const [companyNameEdit, setCompanyNameEdit] = useState("");
  const [sealPlacementEdit, setSealPlacementEdit] = useState("");

  const [overallExcelDatas, setOverallExcelDatas] = useState([])
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  const [fileFormat, setFormat] = useState('')
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = fileFormat === "xl" ? '.xlsx' : '.csv';
  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };
  const handleExportXL = (isfilter) => {

    if (isfilter === "filtered") {
      exportToCSV(
        rowDataTable?.map((item, index) => ({
          "Sno": index + 1,
          Date: item.date,
          "Reference No": item.referenceno,
          "Templateno": item.templateno,
          Template: item.template,
          "Employee Mode": item.employeemode,
          Department: item.department === "Please Select Department" ? "" : item.department,
          Company: item.company === "Please Select Company" ? "" : item.company,
          Branch: item.branch === "Please Select Branch" ? "" : item.branch,
          Unit: item.unit === "Please Select Unit" ? "" : item.unit,
          Team: item.team === "Please Select Team" ? "" : item.team,
          Person: item.person,
          "Printing Status": item.printingstatus,
          "Issued Person Details": item.issuedpersondetails,
          "Issuing Authority": item.issuingauthority,

        })),
        fileName,
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        overallExcelDatas.map((item, index) => ({
          "Sno": index + 1,
          Date: moment(item.date).format("DD-MM-YYYY"),
          "Reference No": item.referenceno,
          "Templateno": item.templateno,
          Template: item.template,
          "Employee Mode": item.employeemode,
          Department: item.department === "Please Select Department" ? "" : item.department,
          Company: item.company === "Please Select Company" ? "" : item.company,
          Branch: item.branch === "Please Select Branch" ? "" : item.branch,
          Unit: item.unit === "Please Select Unit" ? "" : item.unit,
          Team: item.team === "Please Select Team" ? "" : item.team,
          Person: item.person,
          "Printing Status": item.printingstatus,
          "Issued Person Details": item.issuedpersondetails,
          "Issuing Authority": item.issuingauthority,

        })),
        fileName,
      );

    }

    setIsFilterOpen(false)
  };

  // get all branches
  const fetchOverallExcelDatas = async () => {
    const accessbranch = isAssignBranch
    ? isAssignBranch.map((data) => ({
      branch: data.branch,
      company: data.company,
      unit: data.unit,
    }))
    : [];

    try {
       let res_freq = await axios.post(`${SERVICE.ACCESIBLEBRANCHALL_DOCUMENTPREPARATION}`, {
        assignbranch: accessbranch
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setOverallExcelDatas(res_freq?.data?.documentPreparation?.filter(data => ["Printed", "Re-Printed"].includes(data?.printingstatus)))
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };


  useEffect(() => {
    fetchOverallExcelDatas();
  }, [isFilterOpen])


  function encryptString(str) {
    if (str) {
      const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const shift = 3; // You can adjust the shift value as per your requirement
      let encrypted = "";
      for (let i = 0; i < str.length; i++) {
        let charIndex = characters.indexOf(str[i]);
        if (charIndex === -1) {
          // If character is not found, add it directly to the encrypted string
          encrypted += str[i];
        } else {
          // Shift the character index
          charIndex = (charIndex + shift) % characters.length;
          encrypted += characters[charIndex];
        }
      }
      return encrypted;
    }
    else {
      return ""
    }

  }

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    date: true,
    email: true,
    referenceno: true,
    templateno: true,
    template: true,
    employeemode: true,
    department: true,
    company: true,
    printingstatus: true,
    branch: true,
    unit: true,
    team: true,
    person: true,
    head: true,
    foot: true,
    headvaluetext: true,
    document: true,
    issuedpersondetails: true,
    issuingauthority:true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);


  useEffect(() => {
    addSerialNumber();
  }, [templateCreationArray]);


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
    setBtnLoad(false)
    setBtnLoadSave(false)
  };
  // view model
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
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
  const username = isUserRoleAccess.username;
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
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };
  const [UnitOptionsEdit, setUnitOptionsEdit] = useState([]);
  const [TeamOptionsEdit, setTeamOptionsEdit] = useState([]);
  const [employeeValueEdit, setEmployeeValueEdit] = useState([]);

  const [imageUrl, setImageUrl] = useState('');
  const [imageUrlEdit, setImageUrlEdit] = useState('');
  let Allcodedata = `${BASE_URL}/document/documentpreparation/${encryptString(documentPrepartion.person)}/${companyName?._id}/${encryptString(documentPrepartion?.issuingauthority)}/${DateFormat}`
  let AllcodedataEdit = `${BASE_URL}/document/documentpreparation/${encryptString(documentPreparationEdit.person)}/${companyNameEdit?._id}/${encryptString(documentPreparationEdit?.issuingauthority)}/${DateFormatEdit}`

  const generateQrCode = async () => {
    try {
      const response = await QRCode.toDataURL(` ${Allcodedata}`);
      setImageUrl(response);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  }
  const generateQrCodeEdit = async () => {
    try {
      const response = await QRCode.toDataURL(` ${Allcodedata}`);
      setImageUrlEdit(response);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  }

  useEffect(() => {
    generateQrCode();
  }, [Allcodedata])

  useEffect(() => {
    generateQrCodeEdit();
  }, [AllcodedataEdit])

  const [checking, setChecking] = useState("");

  const downloadPdfTesdtTable = async (e) => {
    // Create a new div element to hold the Quill content
    let response = await axios.get(`${SERVICE.SINGLE_DOCUMENTPREPARATION}/${e}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });

    const pdfElement = document.createElement("div");
    pdfElement.innerHTML = response.data.sdocumentPreparation.document;



    // Add custom styles to the PDF content
    const styleElement = document.createElement("style");
    styleElement.textContent = `
     .ql-indent-1 { margin-left: 75px; } /* Adjust margin for indent-1 class */
     .ql-indent-2 { margin-left: 150px; } /* Adjust margin for indent-2 class */
     .ql-indent-3 { margin-left: 225px; } /* Adjust margin for indent-3 class */
     .ql-indent-4 { margin-left: 275px; } /* Adjust margin for indent-4 class */
     .ql-indent-5 { margin-left: 325px; } /* Adjust margin for indent-5 class */
     .ql-indent-6 { margin-left: 375px; } /* Adjust margin for indent-6 class */
     .ql-indent-7 { margin-left: 425px; } /* Adjust margin for indent-7 class */
     .ql-indent-8 { margin-left: 475px; } /* Adjust margin for indent-8 class */
     .ql-align-right { text-align: right; } 
     .ql-align-left { text-align: left; } 
     .ql-align-center { text-align: center; } 
     .ql-align-justify { text-align: justify; } 
   `;

    pdfElement.appendChild(styleElement);

    // pdfElement.appendChild(styleElement);
    const addPageNumbersAndHeadersFooters = (doc, watermarkImage, qrCodeImage) => {
      const totalPages = doc.internal.getNumberOfPages();
      const margin = 15; // Adjust as needed
      const footerHeight = 15; // Adjust as needed
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Add header
        doc.setFontSize(12);
        // doc.text(convertToNumberedList(head), pageWidth / 2, 10, { align: 'center' });
        const headerImgWidth = pageWidth * 0.95; // Adjust as needed
        const headerImgHeight = pageHeight * 0.09;// Adjust as needed
        //const headerX = (pageWidth - headerImgWidth) / 2;
        // const headerY = 6; // Adjust as needed for header position
        const headerX = 5; // Start from the left
        const headerY = 3.5; // Start from the top
        doc.addImage(response.data.sdocumentPreparation.head, 'JPEG', headerX, headerY, headerImgWidth, headerImgHeight, '', 'FAST', 0.1);

        const imgWidth = pageWidth * 0.50; // 75% of page width
        const imgHeight = pageHeight * 0.25; // 50% of page height
        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2 - 20;
        doc.setFillColor(0, 0, 0, 0.1);
        doc.addImage(watermarkImage, 'PNG', x, y, imgWidth, imgHeight, '', 'FAST', 0.01);
        // Add footer
        doc.setFontSize(10);
        // doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        // Add footer image stretched to page width
        const footerImgWidth = pageWidth * 0.95; // Stretch to full page width
        const footerImgHeight = pageHeight * 0.067; // Adjust height as needed
        const footerX = 5; // Start from the left
        const footerY = (pageHeight * 1) - footerImgHeight - 5;
        doc.addImage(response?.data?.sdocumentPreparation?.foot, 'JPEG', footerX, footerY, footerImgWidth, footerImgHeight, '', 'FAST', 0.1);
        if (response?.data?.sdocumentPreparation?.pagenumberneed === "All Pages") {
          const textY = footerY - 3;
          doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, textY, { align: 'center' });
        } else if (response?.data?.sdocumentPreparation?.pagenumberneed === "End Page" && i === totalPages) {
          const textY = footerY - 3;
          doc.text(`End of the document`, pageWidth / 2, textY, { align: 'center' });
        }
        // Add QR code and statement only on the last page

        if (response?.data?.sdocumentPreparation?.qrCodeNeed) {
          if (i === totalPages) {
            // Add QR code in the left corner
            const qrCodeWidth = 25; // Adjust as needed
            const qrCodeHeight = 25; // Adjust as needed
            const qrCodeX = footerX; // Left corner
            const qrCodeY = footerY - qrCodeHeight - 4; // 15 units above the footer image
            doc.addImage(qrCodeImage, 'PNG', qrCodeX, qrCodeY, qrCodeWidth, qrCodeHeight);



            // Add statement on the right of the QR code
            const statementX = qrCodeX + qrCodeWidth + 10; // 10 units right of the QR code
            const statementY1 = qrCodeY + 10; // Align with the top of the QR code
            const statementY2 = statementY1 + 5; // Adjust as needed for spacing
            const statementY3 = statementY2 + 5; // Adjust as needed for spacing



            // Add statements
            const statementText1 = '1. Scan to verify the authenticity of this document.';
            const statementText2 = `2. This document was generated on ${moment(new Date()).format("DD-MM-YYYY hh:mm a")}`;
            const statementText3 = `3. For questions, contact us at ${fromEmail}.`;

            doc.setFontSize(12);
            doc.text(statementText1, statementX, statementY1);
            doc.text(statementText2, statementX, statementY2);
            doc.text(statementText3, statementX, statementY3);
            // doc.text(statementText, statementX, statementY, { maxWidth: lineWidth });
          }
        }
      }
    };

    // Convert the HTML content to PDF
    html2pdf()
      .from(pdfElement)
      .set({
        margin: response.data.sdocumentPreparation?.pagesize == "A3" ? [45, 15, 45, 15] : [30, 15, 45, 15],
        // filename: `${documentPrepartion.person}_${documentPrepartion.template}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: {
          unit: "mm",
          format: [
            parseFloat(response.data.sdocumentPreparation?.pagewidth) || 210, // Default to A4 width (210mm) if width is not defined or invalid
            parseFloat(response.data.sdocumentPreparation?.pageheight) || 297 // Default to A4 height (297mm) if height is not defined or invalid
          ],
          orientation: "portrait" // Use the orientation value from agendaEditStyles, fallback to default "portrait" if not set
        },
        lineHeight: 0, // Increased line spacing
        fontSize: 12,
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      }).toPdf().get('pdf').then((pdf) => {
        // Convert the watermark image to a base64 string
        const img = new Image();
        img.src = response?.data?.sdocumentPreparation?.watermark;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.globalAlpha = 0.1;
          ctx.drawImage(img, 0, 0);
          const watermarkImage = canvas.toDataURL('image/png');

          // Add QR code image
          const qrImg = new Image();
          qrImg.src = response.data.sdocumentPreparation?.qrcode; // QR code image URL
          qrImg.onload = () => {
            const qrCanvas = document.createElement('canvas');
            qrCanvas.width = qrImg.width;
            qrCanvas.height = qrImg.height;
            const qrCtx = qrCanvas.getContext('2d');
            qrCtx.drawImage(qrImg, 0, 0);
            const qrCodeImage = qrCanvas.toDataURL('image/png');

            // Add page numbers and watermark to each page
            addPageNumbersAndHeadersFooters(pdf, watermarkImage, qrCodeImage);
            // Save the PDF
            pdf.save(`${response.data.sdocumentPreparation?.template}_${response.data.sdocumentPreparation?.person}.pdf`);
          };
        };
      });
  };

  //Edit Details
  const UnitDropDownsEdit = async (e) => {
    let branchname = e ? e.value : documentPreparationEdit.branch;
    try {
      let res_type = await axios.get(SERVICE.UNIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let result = res_type.data.units.filter((d) => d.branch === branchname);
      const unitall = [
        { label: "ALL", value: "ALL" },
        ...result.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];

      setUnitOptionsEdit(unitall);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };




  const fetchTeamEdit = async (e) => {
    try {
      let unitname = e ? e.value : documentPreparationEdit.unit;
      // let unitname = e ? e.value : documentPreparationEdit.unit
      let res_type = await axios.get(SERVICE.TEAMS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let result = unitname === "ALL" ? res_type.data.teamsdetails.filter((d) => d.branch === documentPreparationEdit.branch) : res_type.data.teamsdetails.filter((d) => d.unit === unitname && d.branch === documentPreparationEdit.branch);

      const teamall = [
        { label: "ALL", value: "ALL" },
        ...result.map((d) => ({
          ...d,
          label: d.teamname,
          value: d.teamname,
        })),
      ];

      setTeamOptionsEdit(teamall);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };


  let userRoles = isUserRoleAccess?.role?.map(data => data?.toUpperCase().replace(/[^A-Z0-9]/g, ''));

  //set function to get particular row
  const rowData = async (id, name) => {
    try {
      let res = await axios.get(`${SERVICE.SINGLE_DOCUMENTPREPARATION}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDocumentPreparationEdit(res?.data?.sdocumentPreparation);
      handleClickOpen();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  // Alert delete popup
  let brandid = documentPreparationEdit?._id;
  const delBrand = async () => {
    try {
      await axios.delete(`${SERVICE.SINGLE_DOCUMENTPREPARATION}/${brandid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchBrandMaster();
      handleCloseMod();
      setSelectedRows([]);
      setData(brandid);
      setPage(1);
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Deleted Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };


  //get all brand master name.
  const fetchBrandMaster = async () => {
    setLoader(true);
    const accessbranch = isAssignBranch
    ? isAssignBranch.map((data) => ({
      branch: data.branch,
      company: data.company,
      unit: data.unit,
    }))
    : [];

    try {
       let res_freq = await axios.post(`${SERVICE.ACCESIBLEBRANCHALL_DOCUMENTPREPARATION}`, {
        assignbranch: accessbranch
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTemplateCreationArray(res_freq?.data?.documentPreparation);
      setAutoId(res_freq?.data?.documentPreparation);
      setTemplateCreationArrayCreate(res_freq?.data?.documentPreparation?.filter(data => ["Printed", "Re-Printed"].includes(data?.printingstatus)))
      setLoader(false);
    } catch (err) { 
      setLoader(false);
      handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //get all brand master name.
  const fetchBrandMasterEdit = async () => {
    const accessbranch = isAssignBranch
    ? isAssignBranch.map((data) => ({
      branch: data.branch,
      company: data.company,
      unit: data.unit,
    }))
    : [];

    try {
       let res_freq = await axios.post(`${SERVICE.ACCESIBLEBRANCHALL_DOCUMENTPREPARATION}`, {
        assignbranch: accessbranch
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTemplateCreationArrayEdit(res_freq?.data?.documentPreparation.filter((data) => data._id !== documentPreparationEdit._id));
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  useEffect(() => {
    fetchBrandMaster();
  }, [data]);

  const delAreagrpcheckbox = async () => {
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.SINGLE_DOCUMENTPREPARATION}/${item}`, {
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
      setData('Deleted');
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Deleted Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
      await fetchBrandMaster();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //get single row to edit....
  const getUpdatePrintingStatus = async (e) => {
    try {
      let res = await axios.put(`${SERVICE.SINGLE_DOCUMENTPREPARATION}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        printingstatus: "Re-Printed",
      });
      await fetchBrandMaster();
      setData(e);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // get single row to view....
  const getviewCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.SINGLE_DOCUMENTPREPARATION}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDocumentPreparationEdit(res?.data?.sdocumentPreparation);
      handleClickOpenview();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //get single row to view....
  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.SINGLE_DOCUMENTPREPARATION}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDocumentPreparationEdit(res?.data?.sdocumentPreparation);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //frequency master name updateby edit page...
  let updateby = documentPreparationEdit?.updatedby;
  let addedby = documentPreparationEdit?.addedby;
  let frequencyId = documentPreparationEdit?._id;

  const [checkingEdit, setCheckingEdit] = useState("");
  const answerEdit = async (e) => {


    let answe = e ? e === "true" ? true : false : false

    if (updateGen || answe) {
      const [res, res_emp, res_emp_break] = await Promise.all([
        axios.get(SERVICE.ALL_TEMPLATECREATION, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.get(SERVICE.USER_STATUS, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.get(SERVICE.SHIFT, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        })
      ])
      
      let format = res?.data?.templatecreation?.find((data) => data?.name === documentPreparationEdit?.template);
      let employee = res_emp?.data?.usersstatus?.find((data) => data?.companyname === employeeValueEdit);
      let convert = format?.pageformat;
      let employeeBreak = res_emp_break?.data?.shifts?.find((data) => data?.name === employee?.shifttiming);
      const tempElement = document?.createElement("div");
      tempElement.innerHTML = convert;

      const listItems = Array.from(tempElement.querySelectorAll("li"));
      listItems.forEach((li, index) => {
        li.innerHTML = `${index + 1}. ${li.innerHTML}\n`;
      });

      let texted = tempElement?.innerHTML;
      let caddress = `<br>${!employee?.cdoorno ? "" : employee?.cdoorno + ","}
    <br>${!employee?.cstreet ? "" : employee?.cstreet + ","}
<br>${!employee?.carea ? "" : employee?.carea + ","}
    <br>${!employee?.clandmark ? "" : employee?.clandmark + ","}
    <br>${!employee?.ctaluk ? "" : employee?.ctaluk + ","}
    <br>${!employee?.cpost ? "" : employee?.cpost + ","}
    <br>${!employee?.ccity ? "" : employee?.ccity + ","}
    <br>${!employee?.cstate ? "" : employee?.cstate + ","}
    <br>${!employee?.ccountry ? "" : employee?.ccountry + ","}
    ${!employee?.cpincode ? "" : "-" + employee?.cpincode}`;

      let paddress = `<br>${!employee?.pdoorno ? "" : employee?.pdoorno + ","}
    ${!employee?.pstreet ? "" : employee?.pstreet + ","}
    <br>${!employee?.parea ? "" : employee?.parea + ","}
    <br>${!employee?.plandmark ? "" : employee?.plandmark + ","}
    <br>${!employee?.ptaluk ? "" : employee?.ptaluk + ","}
    <br>${!employee?.ppost ? "" : employee?.ppost + ","}
    <br>${!employee?.pcity ? "" : employee?.pcity + ","}
    <br>${!employee?.pstate ? "" : employee?.pstate + ","}
    <br>${!employee?.pcountry ? "" : employee?.pcountry + ","}
    ${!employee?.ppincode ? "" : "-" + employee?.ppincode}`;

      let findMethod = texted
        .replaceAll("$LEGALNAME$", employee?.legalname ? employee?.legalname : "")
        .replaceAll("$DOB$", employee?.dob ? employee?.dob : "")
        .replaceAll("$C:ADDRESS$", caddress)
        .replaceAll("$LOGIN$", employee?.username ? employee?.username : "")
        .replaceAll("$P:ADDRESS$", paddress)
        .replaceAll("$EMAIL$", employee?.email ? employee?.email : "")
        .replaceAll("$P:NUMBER$", employee?.contactpersonal ? employee?.contactpersonal : "")
        .replaceAll("$DOJ$", employee?.doj ? employee?.doj : "")
        .replaceAll("$EMPCODE$", employee?.empcode ? employee?.empcode : "")
        .replaceAll("$BRANCH$", employee?.branch ? employee?.branch : "")
        .replaceAll("$UNIT$", employee?.unit ? employee?.unit : "")
        .replaceAll("$DESIGNATION$", employee?.designation ? employee?.designation : "")
        .replaceAll("$C:NAME$", employee?.companyname ? employee?.companyname : "")
        .replaceAll("$TEAM$", employee?.team ? employee?.team : "")
        .replaceAll("$PROCESS$", employee?.process ? employee?.process : "")
        .replaceAll("$DEPARTMENT$", employee?.department ? employee?.department : "")
        .replaceAll("$LWD$", employee?.reasondate ? employee?.reasondate : "")
        .replaceAll("$SHIFT$", employee?.shifttiming ? employee?.shifttiming : "")
        .replaceAll("$AC:NAME$", employee?.accname ? employee?.accname : "")
        .replaceAll("$AC:NUMBER$", employee?.accno ? employee?.accno : "")
        .replaceAll("$IFSC$", employee?.ifsc ? employee?.ifsc : "")
        .replaceAll("$AC:NUMBER$", employee?.accno ? employee?.accno : "")
        .replaceAll("$C:DATE$", date)
        .replaceAll("$C:TIME$", new Date().toLocaleTimeString())
        .replaceAll("$BREAK$", employeeBreak?.breakhours ? employeeBreak?.breakhours : "")
        .replaceAll("$UNIID$", cateCodeValue ? cateCodeValue : "")
        .replaceAll("$SIGNATURE$", signatureEdit ? `<p><img src="${signatureEdit}" alt="img" style="width: 90px; height: 50px; margin-top: 10px; margin-bottom : 20px;" /></p>` : "");

      setCheckingEdit(findMethod);
    } else {
      setCheckingEdit("")
    }
  };


  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "PrintedDocuments.png");
        });
      });
    }
  };
  // pdf.....
  const columns = [
    { title: "Date ", field: "date" },
    { title: "ReferenceNo", field: "referenceno" },
    { title: "Templateno", field: "templateno" },
    { title: "Template", field: "template" },
    { title: "EmployeeMode", field: "employeemode" },
    { title: "Department", field: "department" },
    { title: "Company", field: "company" },
    { title: "Branch", field: "branch" },
    { title: "Unit", field: "unit" },
    { title: "Team", field: "team" },
    { title: "Person", field: "person" },
    { title: "Printing Status", field: "printingstatus" },
    { title: "Issued Person Details", field: "issuedpersondetails" },
    { title: "Issuing Authority", field: "issuingauthority" },
  ];
  //  pdf download functionality
  const downloadPdf = (isfilter) => {


    const doc = new jsPDF();

    // Initialize serial number counter
    let serialNumberCounter = 1;

    // Modify columns to include serial number column
    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" }, // Serial number column
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial = isfilter === "filtered" ?
      rowDataTable?.map((item, index) => ({
        "serialNumber": index + 1,
        date:item.date,
        referenceno: item.referenceno,
        templateno: item.templateno,
        template: item.template,
        employeemode: item.employeemode,
        department: item.department === "Please Select Department" ? "" : item.department,
        company: item.company === "Please Select Company" ? "" : item.company,
        branch: item.branch === "Please Select Branch" ? "" : item.branch,
        unit: item.unit === "Please Select Unit" ? "" : item.unit,
        team: item.team === "Please Select Team" ? "" : item.team,
        person: item.person,
        printingstatus: item.printingstatus,
        issuedpersondetails: item.issuedpersondetails,
        issuingauthority: item.issuingauthority,

      })) :
      overallExcelDatas.map((item, index) => ({
        "serialNumber": index + 1,
        date: moment(item.date).format("DD-MM-YYYY"),
        referenceno: item.referenceno,
        templateno: item.templateno,
        template: item.template,
        employeemode: item.employeemode,
        department: item.department === "Please Select Department" ? "" : item.department,
        company: item.company === "Please Select Company" ? "" : item.company,
        branch: item.branch === "Please Select Branch" ? "" : item.branch,
        unit: item.unit === "Please Select Unit" ? "" : item.unit,
        team: item.team === "Please Select Team" ? "" : item.team,
        person: item.person,
        printingstatus: item.printingstatus,
        issuedpersondetails: item.issuedpersondetails,
        issuingauthority: item.issuingauthority,

      }))
      ;

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      styles: {
        fontSize: 5,
        cellWidth: 'auto'
      },
      columns: columnsWithSerial,
      body: dataWithSerial,
    });

    doc.save("PrintedDocuments.pdf");
  };
  // Excel
  const fileName = "PrintedDocuments";


  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Document Preparation",
    pageStyle: "print",
  });

  //serial no for listing items
  const addSerialNumber = () => {
    const itemsWithSerialNumber = templateCreationArrayCreate?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      date: moment(item.date).format("DD-MM-YYYY"),
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

  useEffect(() => {
    UnitDropDownsEdit();
    fetchTeamEdit();
    fetchBrandMasterEdit();
  }, [documentPreparationEdit]);


  useEffect(() => {
    answerEdit();
  }, [companyNameEdit, updateGen, sealPlacementEdit])
  // Split the search query into individual terms
  const searchTerms = searchQuery.toLowerCase().split(" ");

  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredDatas?.length / pageSize);
  const visiblePages = Math.min(totalPages, 3);
  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);
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
      width: 40,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0,
      width: 100,
      hide: !columnVisibility.date,
      headerClassName: "bold-header",
    },
    {
      field: "referenceno",
      headerName: "Reference No",
      flex: 0,
      width: 100,
      hide: !columnVisibility.referenceno,
      headerClassName: "bold-header",
    },
    {
      field: "templateno",
      headerName: "Template No",
      flex: 0,
      width: 100,
      hide: !columnVisibility.templateno,
      headerClassName: "bold-header",
    },
    {
      field: "template",
      headerName: "Template",
      flex: 0,
      width: 150,
      hide: !columnVisibility.template,
      headerClassName: "bold-header",
    },
    {
      field: "employeemode",
      headerName: "Employee Mode",
      flex: 0,
      width: 100,
      hide: !columnVisibility.employeemode,
      headerClassName: "bold-header",
    },
    {
      field: "department",
      headerName: "Department",
      flex: 0,
      width: 140,
      hide: !columnVisibility.department,
      headerClassName: "bold-header",
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 80,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 80,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 80,
      hide: !columnVisibility.unit,
      headerClassName: "bold-header",
    },
    {
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 80,
      hide: !columnVisibility.team,
      headerClassName: "bold-header",
    },
    {
      field: "person",
      headerName: "Person",
      flex: 0,
      width: 100,
      hide: !columnVisibility.person,
      headerClassName: "bold-header",
    },
    {
      field: "document",
      headerName: "Documents",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.document,
      renderCell: (params) => (
        <Grid>
          {userRoles?.includes("MANAGER", "HIRINGMANAGER") ? <Button
            variant="text"
            onClick={() => {
              downloadPdfTesdtTable(params.row.id);
              getUpdatePrintingStatus(params.row.id)
            }}
            sx={userStyle.buttonview}
          >
            View
          </Button> : ""}
        </Grid>
      ),
    },
    {
      field: "printingstatus",
      headerName: "Printing Status",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.printingstatus,

    },
    {
      field: "issuedpersondetails",
      headerName: "Issued Person Details",
      flex: 0,
      width: 100,
      hide: !columnVisibility.issuedpersondetails,
      headerClassName: "bold-header",
    },
    {
      field: "issuingauthority",
      headerName: "Issuing Authority",
      flex: 0,
      width: 100,
      hide: !columnVisibility.issuingauthority,
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
          {/* {isUserRoleCompare?.includes("edocumentpreparation") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.row.id);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )} */}
          {isUserRoleCompare?.includes("demployeedocumentpreparation") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id, params.row.name);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vemployeedocumentpreparation") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iemployeedocumentpreparation") && (
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
      date: item.date,
      referenceno: item.referenceno,
      templateno: item.templateno,
      template: item.template,
      printingstatus: item.printingstatus,
      employeemode: item.employeemode,
      department: item.department === "Please Select Department" ? "" : item.department,
      company: item.company === "Please Select Company" ? "" : item.company,
      branch: item.branch === "Please Select Branch" ? "" : item.branch,
      unit: item.unit === "Please Select Unit" ? "" : item.unit,
      team: item.team === "Please Select Team" ? "" : item.team,
      person: item.person,
      issuedpersondetails: item.issuedpersondetails,
      issuingauthority: item.issuingauthority,
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
  // Function to filter columns based on search query
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
        <TextField label="Find column" variant="standard" fullWidth value={searchQueryManage} onChange={(e) => setSearchQueryManage(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
      </Box>
      <br />
      <br />
      <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumns.map((column) => (
            <ListItem key={column.field}>
              <ListItemText sx={{ display: "flex" }} primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />} secondary={column.field === "checkbox" ? "Checkbox" : column.headerName} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Grid container>
          <Grid item md={4}>
            <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibility(initialColumnVisibility)}>
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
  let newvalues = documentPrepartion.department !== "Please Select Department" ?
    (documentPrepartion.department.slice(0, 3).toUpperCase() + "_") +
    (documentPrepartion.template === "Please Select Template Name" ? "" : documentPrepartion.template.slice(0, 3).toUpperCase() + "_") + "0001"

    :
    ((documentPrepartion.company === "Please Select Company" ? "" : documentPrepartion.company.slice(0, 3).toUpperCase() + "_")
      +
      (documentPrepartion.branch === "Please Select Branch" ? "" : documentPrepartion.branch.slice(0, 3).toUpperCase() + "_") +
      (documentPrepartion.unit === "Please Select Unit" ? "" : documentPrepartion.unit.slice(0, 3).toUpperCase() + "_") +
      (documentPrepartion.team === "Please Select Team" ? "" : documentPrepartion.team.slice(0, 3).toUpperCase() + "_"))


    +
    (documentPrepartion.template === "Please Select Template Name" ? "" : documentPrepartion.template.slice(0, 3).toUpperCase() + "_") + "0001";







  return (
    <Box>
      <Headtitle title={"DOCUMENT PREPARATION"} />
      {/* ****** Header Content ****** */}
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lemployeedocumentpreparation") && (
        <>

          {/* ******************************************************EXPORT Buttons****************************************************** */}
          <Grid item xs={8}>
            <Typography sx={userStyle.importheadtext}>Printed Documents List</Typography>
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
                {isUserRoleCompare?.includes("excelemployeedocumentpreparation") && (
                  
                  <>
                    <Button onClick={(e) => {
                      setIsFilterOpen(true)
                      fetchOverallExcelDatas()
                      setFormat("xl")
                    }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                  </>

                )}
                {isUserRoleCompare?.includes("csvemployeedocumentpreparation") && (
                  
                  <>
                    <Button onClick={(e) => {
                      setIsFilterOpen(true)
                      fetchOverallExcelDatas()
                      setFormat("csv")
                    }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                  </>
                )}
                {isUserRoleCompare?.includes("printemployeedocumentpreparation") && (
                  <>
                    <Button sx={userStyle.buttongrp} onClick={handleprint}>
                      &ensp;
                      <FaPrint />
                      &ensp;Print&ensp;
                    </Button>
                  </>
                )}
                {isUserRoleCompare?.includes("pdfemployeedocumentpreparation") && (
                  <>
                    <Button sx={userStyle.buttongrp}
                      onClick={() => {
                        setIsPdfFilterOpen(true)
                        fetchOverallExcelDatas()
                      }}                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                  </>
                )}
                <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                  {" "}
                  <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                </Button>
              </Box>
            </Grid>
            <Grid item md={2} xs={12} sm={12}>
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
          {isUserRoleCompare?.includes("bdemployeedocumentpreparation") && (
            <Button variant="contained" color="error" onClick={handleClickOpenalert}>
              Bulk Delete
            </Button>
          )}
          <br />
          <br />
          {loader ?
                  <>
            <Box sx={userStyle.container}>
                <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '350px' }}>
                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                </Box>
            </Box> 
            </>
            :
            <>
            <Box
              style={{
                width: "100%",
                overflowY: "hidden", // Hide the y-axis scrollbar
              }}
            >
              <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} 
              rows={rowsWithCheckboxes} 
              columns={columnDataTable.filter((column) => columnVisibility[column.field])}
               onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true} ref={gridRef} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
            </Box>
            </>
      }

          <Box style={userStyle.dataTablestyle}>
            <Box>
              Showing {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filteredDatas?.length)} of {filteredDatas?.length} entries
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
          {/* ****** Table End ****** */}

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
      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
          <TableHead>
            <TableRow>
              <TableCell> SI.No</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Reference No</TableCell>
              <TableCell>Template No</TableCell>
              <TableCell>Template</TableCell>
              <TableCell>Employee Mode</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Team</TableCell>
              <TableCell>Person</TableCell>
              <TableCell>Printing Status</TableCell>
              <TableCell>Issued Person Details</TableCell>
              <TableCell>Issuing Authority</TableCell>
            </TableRow>
          </TableHead>
          <TableBody align="left">
            {rowDataTable?.length > 0 &&
              rowDataTable.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.referenceno}</TableCell>
                  <TableCell>{row.templateno}</TableCell>
                  <TableCell>{row.template}</TableCell>
                  <TableCell>{row.employeemode}</TableCell>
                  <TableCell>{row.department}</TableCell>
                  <TableCell>{row.company}</TableCell>
                  <TableCell>{row.branch}</TableCell>
                  <TableCell>{row.unit}</TableCell>
                  <TableCell>{row.team}</TableCell>
                  <TableCell>{row.person}</TableCell>
                  <TableCell>{row.printingstatus}</TableCell>
                  <TableCell>{row.issuedpersondetails}</TableCell>
                                    <TableCell>{row.issuingauthority}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* this is info view details */}
      <Dialog open={openInfo} onClose={handleCloseinfo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              <b>Document Preparation Info</b>
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
                  <br />
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
      {/*Export XL Data  */}
      <Dialog open={isFilterOpen} onClose={handleCloseFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
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
          {fileFormat === "xl" ? <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
            :
            <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
          }
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Choose Export
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus variant="contained"
            onClick={(e) => {
              handleExportXL("filtered")
            }}
          >
            Export Filtered Data
          </Button>
          <Button autoFocus variant="contained"
            onClick={(e) => {
              handleExportXL("overall")
              fetchOverallExcelDatas()
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
      {/*Export pdf Data  */}
      <Dialog open={isPdfFilterOpen} onClose={handleClosePdfFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
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
              downloadPdf("filtered")
              setIsPdfFilterOpen(false);
            }}
          >
            Export Filtered Data
          </Button>
          <Button variant="contained"
            onClick={(e) => {
              downloadPdf("overall")
              setIsPdfFilterOpen(false);
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
      {/*DELETE ALERT DIALOG */}
      <Dialog open={isDeleteOpen} onClose={handleCloseMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
          <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
            Are you sure?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseMod}
            style={{
              backgroundColor: "#f4f4f4",
              color: "#444",
              boxShadow: "none",
              borderRadius: "3px",
              border: "1px solid #0000006b",
              "&:hover": {
                "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                  backgroundColor: "#f4f4f4",
                },
              },
            }}
          >
            Cancel
          </Button>
          <Button autoFocus variant="contained" color="error" onClick={(e) => delBrand(brandid)}>
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>
      {/* view model */}
      <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg" fullWidth={true}>
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              <b>View Document Preparation</b>
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Date</Typography>
                  <Typography>{documentPreparationEdit.date}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Reference No</Typography>
                  <Typography>{documentPreparationEdit.referenceno}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Template No</Typography>
                  <Typography>{documentPreparationEdit.templateno}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Template</Typography>
                  <Typography>{documentPreparationEdit.template}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Employee Mode</Typography>
                  <Typography>{documentPreparationEdit.employeemode}</Typography>
                </FormControl>
              </Grid>
              {documentPreparationEdit.branch === "Please Select Branch" ? (
                <>
                  {" "}
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Department</Typography>
                      <Typography>{documentPreparationEdit.department}</Typography>
                    </FormControl>
                  </Grid>
                </>
              ) : (
                ""
              )}
              {documentPreparationEdit.department === "Please Select Department" ? (
                <>
                  {" "}
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Company</Typography>
                      <Typography>{documentPreparationEdit.company}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Branch</Typography>
                      <Typography>{documentPreparationEdit.branch}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Unit</Typography>
                      <Typography>{documentPreparationEdit.unit}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Team</Typography>
                      <Typography>{documentPreparationEdit.team}</Typography>
                    </FormControl>
                  </Grid>
                </>
              ) : (
                ""
              )}
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Person</Typography>
                  <Typography>{documentPreparationEdit.person}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Issuing Authority</Typography>
                  <Typography>{documentPreparationEdit.issuingauthority}</Typography>
                </FormControl>
              </Grid>
              {(documentPreparationEdit.sealing !== "None" && documentPreparationEdit.sealing !== "") && <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Seal</Typography>
                  <Typography>{documentPreparationEdit.sealing}</Typography>
                </FormControl>
              </Grid>}
              {(documentPreparationEdit.sign !== "None" && documentPreparationEdit.sign !== "") &&
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Signature</Typography>
                    <Typography>{documentPreparationEdit.sign}</Typography>
                  </FormControl>
                </Grid>}





              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Document</Typography>
                  <ReactQuill readOnly style={{ height: "max-content", minHeight: "150px" }}
                    value={documentPreparationEdit.document}
                    modules={{
                      toolbar: [[{ header: "1" }, { header: "2" }, { font: [] }],
                      [{ direction: "rtl" }],
                      [{ size: [] }],

                      ["bold", "italic", "underline", "strike", "blockquote"],
                      [{ align: [] }],
                      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                      ["link", "image", "video"], ["clean"]]
                    }}

                    formats={["header", "font", "size", "bold", "italic", "underline", "strike", "blockquote", "align", "list", "bullet", "indent", "link", "image", "video"]} />
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <br /> <br />
            <br />
            <Grid container spacing={2} sx={{ marginLeft: "3px" }}>
              <Button variant="contained" color="primary" onClick={handleCloseview}>
                Back
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>
      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              style={{
                padding: "7px 13px",
                color: "white",
                background: "rgb(25, 118, 210)",
              }}
              onClick={handleCloseerr}
            >
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      {/* Bulk delete ALERT DIALOG */}
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
            <Button autoFocus variant="contained" color="error" onClick={(e) => delAreagrpcheckbox(e)}>
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <br />
    </Box>
  );
}

export default DocumentsPrintedStatusList;