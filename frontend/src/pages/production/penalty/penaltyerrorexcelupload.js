import React, { useState, useRef, useEffect, useContext } from "react";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import {
  Box,
  Typography,
  OutlinedInput,
  Dialog,
  TableBody,
  Select,
  DialogContent,
  DialogActions,
  FormControl,
  MenuItem,
  Grid,
  Table,
  TableHead,
  Button,
} from "@mui/material";
import MessageAlert from '../../../components/MessageAlert';
import StyledDataGrid from "../../../components/TableStyle";
import AlertDialog from '../../../components/Alert';
import { userStyle, colourStyles } from "../../../pageStyle";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import moment from "moment";
// import axios from "axios";
import axios from '../../../axiosInstance';
import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.min.css";
import { useNavigate } from "react-router-dom";
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import {
  UserRoleAccessContext,
  AuthContext,
} from "../../../context/Appcontext";
import Selects from "react-select";

const DEP_FIELDS = [
  "date", "process", "errorfilename", "documentnumber", "documenttype",
  "fieldname", "line", "errorvalue", "correctvalue", "link", "doclink"
];

const DEP_QUEUE_FIELDS = [
  "date", "process", "errorfilename", "fieldname", "line",
  "errorvalue", "correctvalue", "link", "doclink"
];

// Custom renderer for hyperlinks

// function hyperlinkRenderer(instance, td, row, col, prop, value, cellProperties) {
//   Handsontable.renderers.TextRenderer.apply(this, arguments); // now valid

//   const meta = instance.getCellMeta(row, col);
//   const link = meta?.hyperlink;
// console.log(meta,link,"ppppppp")
//   if (link) {
//     td.innerHTML = `<a href="${link}" target="_blank" style="color: blue; text-decoration: underline;">${value}</a>`;
//   }
// }

function extractOriginalUrl(displayText) {
  // Case 1: If it's already a clean URL
  try {
    const url = new URL(displayText);
    console.log(url, "url")
    return url.href;
  } catch { }

  // Case 2: If it contains common URL patterns
  const urlPatterns = [
    /(https?:\/\/[^\s]+)/i,                    // Standard URLs
    /(www\.[^\s]+\.[^\s]+)/i,                  // www domains
    /([^\s]+\.(com|net|org|gov|edu)[^\s]*)/i,  // Common TLDs
    /(\\[^\s]+)/i,                             // Network paths
    /(\/[^\s]+)/i                              // Unix paths
  ];

  for (const pattern of urlPatterns) {
    const match = displayText.match(pattern);
    if (match) return match[1];
  }

  // Case 3: If it's a document reference (like your TIF example)
  const docPattern = /([A-Za-z0-9_\-]+\.[A-Za-z]{3,4})/i;
  const docMatch = displayText.match(docPattern);
  if (docMatch) {
    return `https://your-document-server.com/${docMatch[1]}`;
  }

  // Default: return the text itself if no URL found
  return displayText;
}



function hyperlinkRenderer(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.TextRenderer.apply(this, arguments);

  if (value && value.includes('<a')) {
    const match = value.match(/<a\s+(?:[^>]*?\s+)?href="([^"]*)">(.*?)<\/a>/i);
    if (match) {
      td.innerHTML = `<a href="${match[1]}" target="_blank" rel="noopener noreferrer">${match[2]}</a>`;
    }
  }
}

const data = [
  [
    '2025-05-06',
    'SmartZone Black Verify',
    '<a href="https://example.com/file1.TIF">ND0605202502047-1424406464-001.TIF</a>',
    '<a href="https://example.com/doc1">ND0605202502047</a>',
    'Dental',
    'D17_DENTIST_CITY_STATE_ZIP',
    '0',
    'S1, SIMMONS ISLAND GEORGIA 315226245',
    'S1, SIMMONS ISLAND, GA 315226245',
    '', // extracted link from column 2 (C)
    '', // extracted link from column 3 (D)
  ]
];


// Function to convert filenames to actual document links
function createDocumentLink(filename) {
  // Implement your actual document URL logic here
  // Example: return `https://your-document-server.com/docs/${filename}`;
  return `#${filename}`; // Temporary placeholder
}

// Utility to detect URLs
const isURL = (text) => {
  // console.log(text,"text")
  try {
    const url = new URL(text);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    const filePattern = /^[A-Z0-9_\-]+\.[A-Z]{3,4}$/i;
    return filePattern.test(text.trim());
  }
};



const ExcelSheet = () => {
  const hotElementRef = useRef(null);
  const hotInstanceRef = useRef(null);
  const { isUserRoleCompare,buttonStyles } = useContext(UserRoleAccessContext);

  const backPage = useNavigate();
  const { auth } = useContext(AuthContext);

  const [excelsid, setExcelsid] = useState("");
  const [excels, setExcels] = useState([]);

  const type = [
    { label: "DEP Audit Summary Report", value: "DEP Audit Summary Report" },
    { label: "DEP Queue Type Audit Summary Report", value: "DEP Queue Type Audit Summary Report" },
  ];
  const [yeardrop, setYeardrop] = useState("dd");
  const [monthdrop, setMonthdrop] = useState("MM");
  const [datedrop, setDatedrop] = useState("yyyy");
  const [symboldrop, setSymboldrop] = useState("/");
  const [hoursdrop, setHoursdrop] = useState("NAN");

  const [projects, setProjects] = useState([]);
  const [excelupdate, setExcelsupdate] = useState({
    name: "",
    project: "",
    vendor: "",
  });
  const [excelupdateall, setExcelsupdateall] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);

   const[invaliddates,setInvalidDates] = useState([])


    // Error Popup model
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showAlertpop, setShowAlertpop] = useState();
  const handleClickOpenerrpop = () => {
    setIsErrorOpenpop(true);
  };
  const handleCloseerrpop = () => {
    setIsErrorOpenpop(false);
  };


  let initialvalue = projects[0]?.name;
  let initialvaluevendor = filteredVendors[0]?.value;

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
  const [popupContent, setPopupContent] = useState('');
  const [popupSeverity, setPopupSeverity] = useState('');
  const handleClickOpenPopup = () => {
    setOpenPopup(true);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };
  let today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + "-" + mm + "-" + dd;

  var hh = String(today.getHours()).padStart(2, "0");
  var min = String(today.getMinutes()).padStart(2, "0");
  var ss = String(today.getSeconds()).padStart(2, "0");

  let formattedTime = hh + ":" + min;

  const [penaltyErrorUpload, setPenaltyErrorUpload] = useState({
    projectvendor: "Please Select Project Vendor",
    process: "Please Select Process",
    loginid: "Please Select Login ID",
    type: "DEP Audit Summary Report",
    date: formattedDate,
  });
  const [loginIdOpt, setClientLoginIDOpt] = useState([]);
  const [processOpt, setProcessQueueArray] = useState([]);
  const [projOpt, setProjOpt] = useState([]);

  const [project, setSelectedProject] = useState({
    label: initialvalue,
    value: initialvalue,
  });

  const [vendor, setSelectedVendors] = useState({
    label: initialvaluevendor,
    value: initialvaluevendor,
  });

  const { isUserRoleAccess } = useContext(UserRoleAccessContext);


  const [time, setTime] = useState(formattedTime);
  const [date, setDate] = useState(formattedDate);

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
  const [isErrorOpendupe, setIsErrorOpendupe] = useState(false);
  const [showAlertdupe, setShowAlertdupe] = useState();
  const handleClickOpenerrdupe = () => {
    setIsErrorOpendupe(true);
  };
  const handleCloseerrdupe = () => {
    setIsErrorOpendupe(false);
  };

  const getProject = async () => {
    try {
      let response = await axios.get(`${SERVICE.VENDORMASTER}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const projectOpt = [
        ...response.data.vendormaster.map((t) => ({
          ...t,
          label: t.projectname + "-" + t.name,
          value: t.projectname + "-" + t.name,
        })),
      ];
      console.log(projectOpt, "projectOpt");
      setProjOpt(projectOpt);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //get all client user id.
  const fetchProcessQueue = async (projname) => {
    try {
      let res_freq = await axios.get(SERVICE.PRODUCTIONPROCESSQUEUEGETALL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const processFilter = res_freq?.data?.productionprocessqueue.filter(
        (item) => item.projectvendor === projname
      );
      const Que = processFilter.map((t) => ({
        label: t.processqueue,
        value: t.processqueue,
      }));
      setProcessQueueArray(Que);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //get all client user id.
  const fetchClientUserID = async (proj) => {
    try {
      // let res_freq = await axios.get(SERVICE.ALL_CLIENTUSERIDDATA, {
      //   headers: {
      //     Authorization: `Bearer ${auth.APIToken}`,
      //   },
      // });
      // const filterProjBased = res_freq?.data?.clientuserid.filter((item) => item.projectvendor === proj);
      // const loginIdOpt = [
      //   ...filterProjBased.map((d) => ({
      //     ...d,
      //     label: d.userid,
      //     value: d.userid,
      //   })),
      // ];

      let res_vendor = await axios.post(
        SERVICE.CLIENT_USER_ID_VALIDATION_ERROR_ENTRY,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          role: isUserRoleAccess.role,
          project: proj,
          companyname: isUserRoleAccess.companyname,
          date: new Date().toISOString().split("T")[0],
        }
      );

      // let alluseridNames = res_vendor?.data?.clientuserid;
      let alluseridNamesadmin = res_vendor?.data?.clientuserid.map((d) => ({
        ...d,
        label: d.userid,
        value: d.userid,
      }));

      setClientLoginIDOpt(alluseridNamesadmin);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    getProject();
  }, []);

  useEffect(() => {
    const hotElement = hotElementRef.current;
    const hotInstance = new Handsontable(hotElement, {
      data: [[]],
      minRows: 17,
      minCols: 17,
      colHeaders: [],
      rowHeaders: true,
      columnSorting: true,
      filters: true,
      formulas: true,
      dropdownMenu: true,
      contextMenu: true,
      copyPaste: true,
      sorting: true,
      multiColumnSorting: true,
    });
    hotInstanceRef.current = hotInstance;

    return () => {
      hotInstance.destroy();
    };
  }, []);

  //   const handleSubmit = async () => {
  //     // const updatedData = hotInstanceRef.current.getData();
  // const hotInstance = hotInstanceRef.current;
  // const updatedData = [];

  //   // Step 1: Extract full data with value + hyperlink from Handsontable
  //   for (let row = 0; row < hotInstance.countRows(); row++) {
  //     const rowData = [];
  //     for (let col = 0; col < hotInstance.countCols(); col++) {
  //       const value = hotInstance.getDataAtCell(row, col);
  //       const link = hotInstance.getCellMeta(row, col)?.hyperlink || "";
  //       rowData.push({ value, link });
  //     }
  //     updatedData.push(rowData);
  //   }

  //   // Step 2: Filter rows with at least one non-empty value
  //   const filteredRows = updatedData.filter((row) =>
  //     row.some((cell) => cell?.value !== null && cell?.value !== "")
  //   );

  //   // Step 3: Filter columns with at least one non-empty value
  //   const filteredCols = [];
  //   for (let col = 0; col < updatedData[0].length; col++) {
  //     const columnData = filteredRows.map((row) => row[col]);
  //     if (columnData.some((cell) => cell?.value !== null && cell?.value !== "")) {
  //       filteredCols.push(columnData);
  //     }
  //   }

  //   // Step 4: Clean + standardize filtered data (ensure full structure is preserved)
  //   const filteredData = filteredRows.map((row) =>
  //     Array.from({ length: updatedData[0].length }, (_, i) => row[i] ?? { value: "", link: "" })
  //   );

  //     const fieldMap = penaltyErrorUpload.type === "DEP Audit Summary Report"
  //       ? DEP_FIELDS
  //       : penaltyErrorUpload.type === "DEP Queue Type Audit Summary Report"
  //         ? DEP_QUEUE_FIELDS
  //         : [];

  //         console.log(filteredData,"filteredData")






  // const ERROR_FILENAME_INDEX = fieldMap.indexOf("errorfilename");
  // const DOC_NUMBER_INDEX = fieldMap.indexOf("documentnumber");

  // const newArray = filteredData.map((row) => {
  //   const obj = {};

  //   row.forEach((cell, colIndex) => {
  //     const key = fieldMap[colIndex];
  //     const value = cell.value;
  //     const hyperlink = cell.link;

  //     if (key) {
  //       obj[key] = value;
  //     } else {
  //       obj.id = parseInt(value);
  //     }

  //     // Inject actual hyperlinks into the mapped object
  //     if (colIndex === ERROR_FILENAME_INDEX) {
  //       obj["link"] = hyperlink || "";
  //     }
  //     if (colIndex === DOC_NUMBER_INDEX) {
  //       obj["doclink"] = hyperlink || "";
  //     }
  //   });

  //   return obj;
  // });




  // console.log(newArray,"newArray")
  // // Main mapping logic
  // // const newArray = filteredData.map((item) => {
  // //   const obj = {};
  // //   item.forEach((value, index) => {
  // //     const key = fieldMap[index];
  // //     if (key) {
  // //       obj[key] = value;
  // //     } else {
  // //       obj.id = parseInt(value);
  // //     }
  // //   });
  // //   return obj;
  // // });

  // // Optional: constructing an expected format string from dropdowns
  // // const expectedFormat = `${yeardrop}${symboldrop}${monthdrop}${symboldrop}${datedrop}`;
  // const expectedFormat = `${monthdrop}${symboldrop}${datedrop}${symboldrop}${yeardrop}`;

  // // Step 4: Extract dates and validate
  // const datesArray = newArray.map(obj => obj["date"]);
  // console.log("Expected Format:", expectedFormat);

  //     console.log(datesArray, "datesArray")

  //        function formatToDate(dateValue, format) {
  //         console.log(dateValue, format,"heck")
  //                     dateValue = dateValue.trim(); // Remove extra spaces

  //                     // Create regex based on the given format
  //                     const separator = format.includes("/") ? "/" : (format.includes("-") ? "-" : ".");
  //                     const regexPattern = new RegExp(format.replace(/(YYYY|MM|DD)/gi, "\\d{2,4}").replace(/[-/.]/g, `\\${separator}`));

  //                     // Check if the date matches the format
  //                     if (regexPattern.test(dateValue)) {
  //                         let year, month, day;
  //                         const dateParts = dateValue.split(separator);
  //                         const formatParts = format.split(separator);

  //                         // Compare and map parts from format to actual date value
  //                         formatParts.forEach((part, index) => {
  //                             const upperPart = part.toUpperCase(); // Make it case-insensitive
  //                             if (upperPart === "YYYY") year = dateParts[index];
  //                             if (upperPart === "MM") month = dateParts[index];
  //                             if (upperPart === "DD") day = dateParts[index];
  //                         });

  //                         // Return formatted date in "YYYY-MM-DD"
  //                         return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  //                     }

  //                     return "Invalid date format";
  //                 }




  //     let SelfDupeRemovedData = []


  //     if (penaltyErrorUpload.type === "DEP Audit Summary Report") {
  //       SelfDupeRemovedData = newArray.map((item) => (

  //         {
  //           ...item,

  //           projectvendor: String(penaltyErrorUpload.projectvendor),
  //           process: String(item.process),
  //           loginid: String(penaltyErrorUpload.loginid),
  //           // date: moment(new Date(item.date)).format("YYYY-MM-DD"),
  //            date: formatToDate(item["date"], `${yeardrop}${symboldrop}${monthdrop}${symboldrop}${datedrop}`),
  //           fromdate: String(penaltyErrorUpload.date),
  //           todate: String(penaltyErrorUpload.date),
  //           type: String(penaltyErrorUpload.type),
  //      filename:penaltyErrorUpload.projectvendor + "_" +penaltyErrorUpload.loginid + "_" + penaltyErrorUpload.date + " _" + penaltyErrorUpload.type ,

  //           errorfilename: String(item.errorfilename),
  //           documentnumber: String(item.documentnumber),
  //           documenttype: String(item.documenttype),
  //           fieldname: String(item.fieldname),
  //           line: String(item.line),
  //           errorvalue: String(item.errorvalue),
  //           correctvalue: String(item.correctvalue),
  //           link: String(item.link),
  //           doclink: String(item.doclink),
  //             yeardrop: yeardrop,
  //                 monthdrop: monthdrop,
  //                 datedrop: datedrop,
  //                 symboldrop: symboldrop,
  //                 hoursdrop: hoursdrop,
  //           mode: "Errorupload",
  //         })
  //       )
  //     } else {
  //       SelfDupeRemovedData = newArray.map((item) => (

  //         {
  //           ...item,

  //           projectvendor: String(penaltyErrorUpload.projectvendor),
  //           process: String(item.process),
  //           loginid: String(penaltyErrorUpload.loginid),
  //           // date: moment(new Date(item.date)).format("YYYY-MM-DD"),
  //            date: formatToDate(item["date"], `${yeardrop}${symboldrop}${monthdrop}${symboldrop}${datedrop}`),
  //              fromdate: String(penaltyErrorUpload.date),
  //           todate: String(penaltyErrorUpload.date),
  //           errorfilename: String(item.errorfilename),
  //           type: String(penaltyErrorUpload.type),
  //         filename:penaltyErrorUpload.projectvendor + "_" +penaltyErrorUpload.loginid + "_" + penaltyErrorUpload.date + " _" + penaltyErrorUpload.type ,
  //           // documentnumber: String(item.documentnumber),
  //           // documenttype: String(item.documenttype),
  //           fieldname: String(item.fieldname),
  //           line: String(item.line),
  //           errorvalue: String(item.errorvalue),
  //           correctvalue: String(item.correctvalue),
  //           link: String(item.link),
  //           doclink: String(item.doclink),
  //             yeardrop: yeardrop,
  //                 monthdrop: monthdrop,
  //                 datedrop: datedrop,
  //                 symboldrop: symboldrop,
  //                 hoursdrop: hoursdrop,
  //           mode: "Errorupload",
  //         })
  //       )
  //     }
  //  console.log(SelfDupeRemovedData, "SelfDupeRemovedData");
  //     SelfDupeRemovedData.filter((item, index, self) =>
  //       index ===
  //       self.findIndex(
  //         (tp) =>

  //           tp.projectvendor == item.projectvendor &&
  //           tp.process == item.process &&
  //           tp.loginid == item.loginid &&
  //           tp.date == item.date &&
  //           tp.errorfilename == item.errorfilename &&
  //           tp.documentnumber == item.documentnumber &&
  //           tp.documenttype == item.documenttype &&
  //           tp.fieldname == item.fieldname &&
  //           tp.line == item.line &&
  //           tp.errorvalue == item.errorvalue &&
  //           tp.correctvalue == item.correctvalue

  //       )
  //     );





  //     let Respenalty = await axios.post(SERVICE.BULKRRORUPLOADS_FETCH_BY_DATE, {
  //       headers: {
  //         Authorization: `Bearer ${auth.APIToken}`,
  //       },

  //       projectvendor: String(penaltyErrorUpload.projectvendor),
  //       process: SelfDupeRemovedData.map(item => item.process),
  //       loginid: String(penaltyErrorUpload.loginid),
  //       date: String(penaltyErrorUpload.date),
  //     });

  //     const isNameMatchbulkDuplicate = Respenalty.data.penaltyerroruploadpoints

  //     let DupeRemovedData = SelfDupeRemovedData.filter(item =>
  //       !isNameMatchbulkDuplicate.some(tp => {
  //         const isMatch =
  //           tp.projectvendor === item.projectvendor &&
  //           tp.process === item.process &&
  //           tp.loginid === item.loginid &&
  //           tp.date === item.date &&
  //           tp.errorfilename === item.errorfilename &&
  //           tp.documentnumber === item.documentnumber &&
  //           tp.documenttype === item.documenttype &&
  //           tp.fieldname === item.fieldname &&
  //           tp.line === item.line &&
  //           tp.errorvalue === item.errorvalue &&
  //           tp.correctvalue === item.correctvalue

  //         return isMatch;
  //       })
  //     );


  //     let Res = await axios.post(SERVICE.PENALTYERRORUPLOADS_BY_DATE, {
  //       headers: {
  //         Authorization: `Bearer ${auth.APIToken}`,
  //       },

  //       projectvendor: String(penaltyErrorUpload.projectvendor),
  //       process: SelfDupeRemovedData.map(item => item.process),
  //       loginid: String(penaltyErrorUpload.loginid),
  //       date: String(penaltyErrorUpload.date),
  //     });
  //     let olddata = Res?.data?.penaltyerroruploadpoints;
  //     console.log(olddata, "olddata")


  //     let newdata = DupeRemovedData.filter(item =>
  //       !olddata.some(tp => {
  //         const isMatch =
  //           tp.projectvendor === item.projectvendor &&
  //           tp.process === item.process &&
  //           tp.loginid === item.loginid &&
  //           tp.date === item.date &&
  //           tp.errorfilename === item.errorfilename &&
  //           tp.documentnumber === item.documentnumber &&
  //           tp.documenttype === item.documenttype &&
  //           tp.fieldname === item.fieldname &&
  //           tp.line === item.line &&
  //           tp.errorvalue === item.errorvalue &&
  //           tp.correctvalue === item.correctvalue
  //         return isMatch;
  //       })
  //     );




  //     console.log(newdata, SelfDupeRemovedData, "newdata")




  //     if (penaltyErrorUpload.projectvendor === "Please Select Project Vendor") {
  //       setPopupContentMalert("Please Select Project Vendor");
  //       setPopupSeverityMalert("info");
  //       handleClickOpenPopupMalert();
  //     }

  //     else if (penaltyErrorUpload.loginid === "Please Select Login ID") {
  //       setPopupContentMalert("Please Select Login ID");
  //       setPopupSeverityMalert("info");
  //       handleClickOpenPopupMalert();
  //     }
  //     else if (penaltyErrorUpload.type === "Please Select Type") {
  //       setPopupContentMalert("Please Select Type");
  //       setPopupSeverityMalert("info");
  //       handleClickOpenPopupMalert();
  //     }
  //     // else if (penaltyErrorUpload.date === "") {
  //     //   setPopupContentMalert("Please Select Date");
  //     //   setPopupSeverityMalert("info");
  //     //   handleClickOpenPopupMalert();
  //     //   // Set the flag to true
  //     // }
  //     else if (newArray.length <= 0) {
  //       setPopupContentMalert("Please Fill Excel");
  //       setPopupSeverityMalert("info");
  //       handleClickOpenPopupMalert();


  //     }
  //   else  if (datesArray.some(d => d && getDateFormat(d) !== expectedFormat)) {
  //   setPopupContentMalert("Expected Date Format Does Not Match");
  //   setPopupSeverityMalert("info");
  //   handleClickOpenPopupMalert();
  // }
  //     else if (SelfDupeRemovedData.length != newdata.length && newdata.length == 0) {
  //       setPopupContentMalert('Duplicate Datas Removed!');
  //       setPopupSeverityMalert('info');
  //       handleClickOpenPopupMalert();
  //     }


  //     else {
  //       console.log("abc")
  //       if (SelfDupeRemovedData.length != newdata.length) {

  //         setPopupContent('Duplicate Datas Removed!');
  //         setPopupSeverity('success');
  //         handleClickOpenPopup();
  //       }

  //       try {
  //         const responses = await Promise.all(
  //           newdata.map(item =>
  //             axios.post(`${SERVICE.PENALTYERRORUPLOADS_CREATE}`, {
  //               ...item,
  //               addedby: [
  //                 {
  //                   name: String(isUserRoleAccess.companyname),
  //                   date: String(new Date()),
  //                 },
  //               ],
  //             })
  //           )
  //         );
  //         setPopupContent('Added Successfully');
  //         setPopupSeverity('success');
  //         handleClickOpenPopup();

  //       } catch (err) {
  //         handleApiError(err, setShowAlert, handleClickOpenerr);
  //       }
  //     }
  //   };


  const handleSubmit = async () => {
    const updatedData = hotInstanceRef.current.getData();
    const filteredRows = updatedData.filter((row) =>
      row.some((cell) => cell !== null && cell !== "")
    );
    const filteredCols = [];

    for (let col = 0; col < updatedData[0].length; col++) {
      const columnData = filteredRows.map((row) => row[col]);
      if (columnData.some((cell) => cell !== null && cell !== "")) {
        filteredCols.push(columnData);
      }
    }



    const filteredData = updatedData
      .filter((row) => row.some((cell) => cell !== null && cell !== ""))
      .map((row) =>
        Array.from({ length: updatedData[0].length }, (_, i) => row[i] ?? "")
      );

    const DEP_FIELDS = [
      "date", "process", "errorfilename", "documentnumber", "documenttype",
      "fieldname", "line", "errorvalue", "correctvalue", "link", "doclink"
    ];

    const DEP_QUEUE_FIELDS = [
      "date", "process", "errorfilename", "fieldname", "line",
      "errorvalue", "correctvalue", "link", "doclink"
    ];

    const fieldMap = penaltyErrorUpload.type === "DEP Audit Summary Report"
      ? DEP_FIELDS
      : penaltyErrorUpload.type === "DEP Queue Type Audit Summary Report"
        ? DEP_QUEUE_FIELDS
        : [];


    function getDateFormat(dateValue) {
      console.log(dateValue, "dateValue")
      const patterns = [
        //  "/" FORMAT
        { regex: /^\d{2}\/\d{2}\/\d{4}$/, format: "dd/MM/yyyy" },
        { regex: /^\d{1,2}\/\d{2}\/\d{4}$/, format: "d/MM/yyyy" },
        { regex: /^\d{2}\/\d{2}\/\d{4}$/, format: "MM/dd/yyyy" },
        { regex: /^\d{1,2}\/\d{2}\/\d{4}$/, format: "M/dd/yyyy" },
        { regex: /^\[A-Za-z]{3}\/\d{2}\/\d{4}$/, format: "MMM/dd/yyyy" },
        { regex: /^\[A-Za-z]{4,}\/\d{2}\/\d{4}$/, format: "MMMM/dd/yyyy" },
        { regex: /^\d{4}\/\d{2}\/\d{2}$/, format: "yyyy/MM/dd" },
        { regex: /^\d{2}\/\d{2}\/\d{2}$/, format: "yy/MM/dd" },
          { regex: /^\d{2}\/\d{2}\/\d{2}$/, format: "MM/dd/yy" },
        //  "-" FORMAT

        { regex: /^\d{2}-\d{2}-\d{4}$/, format: "dd-MM-yyyy" },
        { regex: /^\d{1,2}-\d{2}-\d{4}$/, format: "d-MM-yyyy" },
        { regex: /^\d{2}-\d{2}-\d{4}$/, format: "MM-dd-yyyy" },
        { regex: /^\d{1,2}-\d{2}-\d{4}$/, format: "M-dd-yyyy" },
        { regex: /^[A-Za-z]{3}-\d{2}-\d{4}$/, format: "MMM-dd-yyyy" },
        { regex: /^[A-Za-z]{4,}-\d{2}-\d{4}$/, format: "MMMM-dd-yyyy" },
        { regex: /^\d{4}-\d{2}-\d{2}$/, format: "yyyy-MM-dd" },
        { regex: /^\d{2}-\d{2}-\d{2}$/, format: "yy-MM-dd" },
        { regex: /^\d{2}-\d{2}-\d{2}$/, format: "MM-dd-yy" },
        //  "." FORMAT

        { regex: /^\d{2}\.\d{2}\.\d{4}$/, format: "dd.MM.yyyy" },
        { regex: /^\d{1,2}\.\d{2}\.\d{4}$/, format: "d.MM.yyyy" },
        { regex: /^\d{2}\.\d{2}\.\d{4}$/, format: "MM.dd.yyyy" },
        { regex: /^\d{1,2}\.\d{2}\.\d{4}$/, format: "M.dd.yyyy" },
        { regex: /^[A-Za-z]{3}\.\d{2}\.\d{4}$/, format: "MMM.dd.yyyy" },
        { regex: /^[A-Za-z]{4,}\.\d{2}\.\d{4}$/, format: "MMMM.dd.yyyy" },
        { regex: /^\d{4}\.\d{2}\.\d{2}$/, format: "yyyy.MM.dd" },
        { regex: /^\d{2}\.\d{2}\.\d{2}$/, format: "yy.MM.dd" },
       { regex: /^\d{2}\.\d{2}\.\d{2}$/, format: "MM.dd.yy" },
      ];

      // Find the format of the input date
      const foundPattern = patterns.filter(p => p.regex.test(dateValue));
      console.log(foundPattern, "foundPattern")
      return foundPattern?.length > 0 ? foundPattern.map(d => d.format) : [];
    }




    const newArray = filteredData.map((item) => {
      const obj = {};
      item.forEach((value, index) => {
        const key = fieldMap[index];
        if (key) {
          obj[key] = value;
        } else {
          obj.id = parseInt(value);
        }
      });
      return obj;
    });
    console.log(newArray, "newArray")
    const expectedFormat = `${yeardrop}${symboldrop}${monthdrop}${symboldrop}${datedrop}`;


    console.log("Expected Format:", expectedFormat);



    // function formatToDate(dateValue, format) {
    //   console.log(dateValue, format, "heck")
    //   dateValue = dateValue.trim(); // Remove extra spaces

    //   // Create regex based on the given format
    //   const separator = format.includes("/") ? "/" : (format.includes("-") ? "-" : ".");
    //   const regexPattern = new RegExp(format.replace(/(YYYY|MM|DD)/gi, "\\d{2,4}").replace(/[-/.]/g, `\\${separator}`));

    //   // Check if the date matches the format
    //   if (regexPattern.test(dateValue)) {
    //     let year, month, day;
    //     const dateParts = dateValue.split(separator);
    //     const formatParts = format.split(separator);

    //     // Compare and map parts from format to actual date value
    //     formatParts.forEach((part, index) => {
    //       const upperPart = part.toUpperCase(); // Make it case-insensitive
    //       if (upperPart === "YYYY") year = dateParts[index];
    //       if (upperPart === "MM") month = dateParts[index];
    //       if (upperPart === "DD") day = dateParts[index];
    //     });

    //     // Return formatted date in "YYYY-MM-DD"
    //     return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    //   }

    //   return "Invalid date format";
    // }


        function formatToDate(dateValue, format) {
  console.log(dateValue, format, "check");

  if (!dateValue || !format) return "Invalid input";

  dateValue = dateValue.trim();
  const separator = format.includes("/") ? "/" : format.includes("-") ? "-" : ".";

  const dateParts = dateValue.split(separator);
  const formatParts = format.split(separator);

  if (dateParts.length !== formatParts.length) {
    return "Invalid date format";
  }

  let year = "", month = "", day = "";

  formatParts.forEach((part, index) => {
    const value = dateParts[index];
    switch (part.toUpperCase()) {
      case "YYYY":
        year = value;
        break;
      case "YY":
        year = parseInt(value) < 50 ? `20${value}` : `19${value}`;
        break;
      case "MM":
      case "M":
        month = value.padStart(2, "0");
        break;
      case "DD":
      case "D":
        day = value.padStart(2, "0");
        break;
    }
  });

  if (!year || !month || !day) {
    return "Invalid date format";
  }

  return `${year}-${month}-${day}`;
}



    const datesArray = newArray.map(obj => obj["date"]);
    console.log(datesArray, "datesArray")

    let SelfDupeRemovedData = []
    if (penaltyErrorUpload.type === "DEP Audit Summary Report") {
      SelfDupeRemovedData = newArray.map((item) => (

        {
          ...item,

          projectvendor: String(penaltyErrorUpload.projectvendor),
          process: String(item.process),
          loginid: String(penaltyErrorUpload.loginid),
          // date: moment(new Date(item.date)).format("YYYY-MM-DD"),
          date: formatToDate(item["date"], `${yeardrop}${symboldrop}${monthdrop}${symboldrop}${datedrop}`),
          fromdate: String(penaltyErrorUpload.date),
          todate: String(penaltyErrorUpload.date),
          filename: penaltyErrorUpload.projectvendor + "_" + penaltyErrorUpload.loginid + "_" + penaltyErrorUpload.date + " _" + penaltyErrorUpload.type,

          type: String(penaltyErrorUpload.type),
          errorfilename: String(item.errorfilename),
          documentnumber: String(item.documentnumber),
          documenttype: String(item.documenttype),
          fieldname: String(item.fieldname),
          line: String(item.line),
          errorvalue: String(item.errorvalue),
          correctvalue: String(item.correctvalue),
          link: String(item.link),
          doclink: String(item.doclink),
          mode: "Errorupload",
        })
      )
    } else {
      SelfDupeRemovedData = newArray.map((item) => (

        {
          ...item,

          projectvendor: String(penaltyErrorUpload.projectvendor),
          process: String(item.process),
          loginid: String(penaltyErrorUpload.loginid),
          // date: moment(new Date(item.date)).format("YYYY-MM-DD"),
          date: formatToDate(item["date"], `${yeardrop}${symboldrop}${monthdrop}${symboldrop}${datedrop}`),
          fromdate: String(penaltyErrorUpload.date),
          todate: String(penaltyErrorUpload.date),
          errorfilename: String(item.errorfilename),
          type: String(penaltyErrorUpload.type),
          filename: penaltyErrorUpload.projectvendor + "_" + penaltyErrorUpload.loginid + "_" + penaltyErrorUpload.date + " _" + penaltyErrorUpload.type,

          // documentnumber: String(item.documentnumber),
          // documenttype: String(item.documenttype),
          fieldname: String(item.fieldname),
          line: String(item.line),
          errorvalue: String(item.errorvalue),
          correctvalue: String(item.correctvalue),
          link: String(item.link),
          doclink: String(item.doclink),
          mode: "Errorupload",
        })
      )
    }

    SelfDupeRemovedData.filter((item, index, self) =>
      index ===
      self.findIndex(
        (tp) =>

          tp.projectvendor == item.projectvendor &&
          tp.process == item.process &&
          tp.loginid == item.loginid &&
          tp.date == item.date &&
          tp.errorfilename == item.errorfilename &&
          tp.documentnumber == item.documentnumber &&
          tp.documenttype == item.documenttype &&
          tp.fieldname == item.fieldname &&
          tp.line == item.line &&
          tp.errorvalue == item.errorvalue &&
          tp.correctvalue == item.correctvalue
        //  &&
        // tp.link == item.link &&
        // tp.doclink == item.doclink
      )
    );

    console.log(SelfDupeRemovedData, "SelfDupeRemovedData");


    let Respenalty = await axios.post(SERVICE.PENALTYERRORUPLOADS_BY_DATE_NEW, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      projectvendor: String(penaltyErrorUpload.projectvendor),
      // process: String(penaltyErrorUpload.process),
      process: SelfDupeRemovedData.map(item => item.process),
      loginid: String(penaltyErrorUpload.loginid),
      date: SelfDupeRemovedData.map(item => item.date),
    });

    // const isNameMatch = targetPoints?.some((item) =>
    const isNameMatchbulkDuplicate = Respenalty.data.penaltyerroruploadpoints;

    let DupeRemovedData = SelfDupeRemovedData.filter(
      (item) =>
        !isNameMatchbulkDuplicate.some((tp) => {
          const isMatch =
            tp.projectvendor === item.projectvendor &&
            tp.process === item.process &&
            tp.loginid === item.loginid &&
            tp.date === item.date &&
            tp.errorfilename === item.errorfilename &&
            tp.documentnumber === item.documentnumber &&
            tp.documenttype === item.documenttype &&
            tp.fieldname === item.fieldname &&
            tp.line === item.line &&
            tp.errorvalue === item.errorvalue &&
            tp.correctvalue === item.correctvalue;
          // &&
          // tp.link === item.link &&
          // tp.doclink === item.doclink;

          //   console.log('Match:', isMatch, { tp, item });
          return isMatch;
        })
    );

    let Res = await axios.post(SERVICE.BULKRRORUPLOADS_FETCH_BY_DATE_NEW, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      projectvendor: String(penaltyErrorUpload.projectvendor),
      // process: String(penaltyErrorUpload.process),
      process: SelfDupeRemovedData.map(item => item.process),
      loginid: String(penaltyErrorUpload.loginid),
      date: SelfDupeRemovedData.map(item => item.date),
    });
    let olddata = Res?.data?.penaltyerroruploadpoints;
    console.log(olddata, 'olddata');

    let newdata = DupeRemovedData.filter(
      (item) =>
        !olddata.some((tp) => {
          const isMatch =
            tp.projectvendor === item.projectvendor &&
            tp.process === item.process &&
            tp.loginid === item.loginid &&
            tp.dateformatted === item.date &&
            tp.errorfilename === item.errorfilename &&
            tp.documentnumber === item.documentnumber &&
            tp.documenttype === item.documenttype &&
            tp.fieldname === item.fieldname &&
            tp.line === item.line &&
            tp.errorvalue === item.errorvalue &&
            tp.correctvalue === item.correctvalue;
          // &&
          // tp.link === item.link &&
          // tp.doclink === item.doclink;

          //   console.log('Match:', isMatch, { tp, item });
          return isMatch;
        })
    );

   
const invalidDates = datesArray.reduce((acc, d, index) => {
  if (d && !getDateFormat(d).includes(expectedFormat)) {
    acc.push({ date: d, sno: index + 1 });
  }
  return acc;
}, []);
setInvalidDates(invalidDates)

    console.log(invalidDates, 'invalidDates');

    if (penaltyErrorUpload.projectvendor === 'Please Select Project Vendor') {
      setPopupContentMalert('Please Select Project Vendor');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    }
    // else if (penaltyErrorUpload.process === 'Please Select Process') {
    //   setPopupContentMalert('Please Select Process');
    //   setPopupSeverityMalert('info');
    //   handleClickOpenPopupMalert();
    // } 
    else if (penaltyErrorUpload.loginid === 'Please Select Login ID') {
      setPopupContentMalert('Please Select Login ID');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    }
    //  else if (penaltyErrorUpload.date === '') {
    //   setPopupContentMalert('Please Select Date');
    //   setPopupSeverityMalert('info');
    //   handleClickOpenPopupMalert();
    //   // Set the flag to true
    // }
    else if (newArray.length <= 0) {
      setPopupContentMalert('Please Fill Excel');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    }
    // else if (invalidDates.length > 0 ) {
    //   setPopupContentMalert(`Expected date format does not match for line(s) ${invalidDates.map(item => item.sno)?.join(",")}`);
    //   setPopupSeverityMalert("info");
    //   handleClickOpenPopupMalert();
    // }
    else if (invalidDates.length > 0 ) {
          setShowAlertpop(
            <>
              <ErrorOutlineOutlinedIcon sx={{ fontSize: '100px', color: 'orange' }} />
              <p style={{ fontSize: '20px', fontWeight: 900 }}>{`Expected date format does not match for line(s) ${invalidDates.map(item => item.sno)?.join(",")}`}</p>
            </>
          );
          handleClickOpenerrpop();
        }
    else if (SelfDupeRemovedData.length != newdata.length && newdata.length == 0) {
      setPopupContentMalert('Duplicate Datas Removed!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    }
    // else if (isNameMatchPeanltyDuplicate) {
    //     setPopupContentMalert('Data Already In Penalty Error Upload!');
    //     setPopupSeverityMalert('info');
    //     handleClickOpenPopupMalert();
    // }
    else {
      console.log('abc');
      if (SelfDupeRemovedData.length != newdata.length) {
        setPopupContent('Duplicate Datas Removed!');
        setPopupSeverity('success');
        handleClickOpenPopup();
      }

      try {
        const responses = await Promise.all(
          newdata.map((item) =>
            axios.post(`${SERVICE.PENALTYERRORUPLOADS_CREATE}`, {
              ...item,

              addedby: [
                {
                  name: String(isUserRoleAccess.companyname),
                  date: String(new Date()),
                },
              ],
            })
          )
        );
        setPopupContent('Added Successfully');
        setPopupSeverity('success');
        handleClickOpenPopup();
      } catch (err) {
        handleApiError(err, setShowAlert, handleClickOpenerr);
      }
    }
  };



  const handleclear = (e) => {
    e.preventDefault();
    setPenaltyErrorUpload({
      ...penaltyErrorUpload,
      projectvendor: "Please Select Project Vendor",
      process: "Please Select Process",
      loginid: "Please Select Login ID",
      type: "Please Select Type",
      date: today,
      errorfilename: "",
      documentnumber: "",
      documenttype: "",
      fieldname: "",
      line: "",
      errorvalue: "",
      correctvalue: "",
      link: "",
      doclink: "",
    });
  };

  const handleclearexcel = (e) => {
    e.preventDefault();
    hotInstanceRef.current.clear();
    setPenaltyErrorUpload({
      ...penaltyErrorUpload,
      projectvendor: "Please Select Project Vendor",
      process: "Please Select Process",
      loginid: "Please Select Login ID",
      type: "Please Select Type",
      date: today,
      errorfilename: "",
      documentnumber: "",
      documenttype: "",
      fieldname: "",
      line: "",
      errorvalue: "",
      correctvalue: "",
      link: "",
      doclink: "",
    });
  };

   const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = invaliddates?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
     
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [invaliddates]);

  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
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
    return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(filteredDatas.length / pageSize);

  const visiblePages = Math.min(totalPages, 3);

  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

  const pageNumbers = [];

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  const columnDataTable = [
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 70,
      headerClassName: "bold-header",
    },
    { field: "date", headerName: "Date", flex: 0, width: 250,  headerClassName: "bold-header" },
    { field: "sno", headerName: "Line No", flex: 0, width: 250,  headerClassName: "bold-header" },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      ...item,
      id: item.serialNumber,

    };
  });

  return (
    <>
      <br />
      <Box sx={userStyle.excelbox}>

        <Grid container spacing={2}>
          <Grid item md={3} xs={12} sm={6}>
            <Typography>
              Type <b style={{ color: "red" }}>*</b>
            </Typography>
            <FormControl fullWidth size="small">
              <Selects
                maxMenuHeight={300}
                options={type}
                value={{
                  label: penaltyErrorUpload.type,
                  value: penaltyErrorUpload.type,
                }}
                onChange={(e) => {
                  setPenaltyErrorUpload({
                    ...penaltyErrorUpload,
                    type: e.value,
                  });
                }}
              />
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12} sm={6}>
            <Typography>
              Project <b style={{ color: "red" }}>*</b>
            </Typography>
            <FormControl fullWidth size="small">
              <Selects
                maxMenuHeight={300}
                options={projOpt}
                value={{
                  label: penaltyErrorUpload.projectvendor,
                  value: penaltyErrorUpload.projectvendor,
                }}
                onChange={(e) => {
                  setPenaltyErrorUpload({
                    ...penaltyErrorUpload,
                    projectvendor: e.value,
                    process: "Please Select Process",
                    loginid: "Please Select Login ID",
                  });
                  fetchClientUserID(e.value);
                  fetchProcessQueue(e.value);
                }}
              />
            </FormControl>
          </Grid>

          {/* <Grid item md={3} xs={12} sm={6}>
              <Typography>
                Vendor <b style={{ color: "red" }}>*</b>
              </Typography>
              <FormControl fullWidth size="small">
                <Selects
                  maxMenuHeight={300}
                  options={processOpt}
                  value={{
                    label: penaltyErrorUpload.process,
                    value: penaltyErrorUpload.process,
                  }}
                  onChange={(e) => {
                    setPenaltyErrorUpload({
                      ...penaltyErrorUpload,
                      process: e.value,
                      loginid: "Please Select Login ID",
                    });
                  }}
                />
              </FormControl>
            </Grid> */}

          <Grid item md={2} xs={12} sm={6}>
            <Typography>
              Login Id <b style={{ color: "red" }}>*</b>
            </Typography>
            <FormControl fullWidth size="small">
              <Selects
                maxMenuHeight={300}
                options={loginIdOpt}
                value={{
                  label: penaltyErrorUpload.loginid,
                  value: penaltyErrorUpload.loginid,
                }}
                onChange={(e) => {
                  setPenaltyErrorUpload({
                    ...penaltyErrorUpload,
                    loginid: e.value,
                  });
                }}
              />
            </FormControl>
          </Grid>

          <Grid item md={4} xs={12} sm={12}>
            <Typography>Date Format<b style={{ color: "red" }}>*</b></Typography>
            <Grid container spacing={0.3}>
              <Grid item md={2.5} xs={4} sm={2.5}>
                <FormControl fullWidth size="small">
                  <Select
                    fullWidth
                    labelId="demo-select-small"
                    id="demo-select-small"
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 200, width: 80 },
                      },
                    }}
                    value={yeardrop}
                    onChange={(e) => setYeardrop(e.target.value)}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    <MenuItem value="dd">dd</MenuItem>
                    <MenuItem value="d">d</MenuItem>
                    <MenuItem value="M">M</MenuItem>
                    <MenuItem value="MM">MM</MenuItem>
                    <MenuItem value="MMM">MMM</MenuItem>
                    <MenuItem value="MMMM">MMMM</MenuItem>
                    <MenuItem value="yyyy">yyyy</MenuItem>
                    <MenuItem value="yy">yy</MenuItem>

                  </Select>
                </FormControl>
              </Grid>

              <Grid item md={2} xs={4} sm={2.7}>
                <FormControl fullWidth size="small">
                  <Select
                    fullWidth
                    labelId="demo-select-small"
                    id="demo-select-small"
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 200, width: 80 },
                      },
                    }}
                    value={monthdrop}
                    onChange={(e) => setMonthdrop(e.target.value)}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    {/* <MenuItem value="Month" disabled>Month</MenuItem> */}
                    <MenuItem value="MM">MM</MenuItem>
                    <MenuItem value="M">M</MenuItem>
                    <MenuItem value="MMM">MMM</MenuItem>
                    <MenuItem value="MMMM">MMMM</MenuItem>
                    <MenuItem value="dd">dd</MenuItem>
                    <MenuItem value="yyyy">yyyy</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item md={2.7} xs={4} sm={2}>
                <FormControl fullWidth size="small">
                  <Select
                    fullWidth
                    labelId="demo-select-small"
                    id="demo-select-small"
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 200, width: 80 },
                      },
                    }}
                    value={datedrop}
                    onChange={(e) => setDatedrop(e.target.value)}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    {/* <MenuItem value="Date" disabled>Date</MenuItem> */}
                    <MenuItem value="dd">dd</MenuItem>
                    <MenuItem value="d">d</MenuItem>
                    <MenuItem value="yyyy">yyyy</MenuItem>
                    <MenuItem value="yy">yy</MenuItem>
                  </Select>
                </FormControl>
              </Grid>






              <Grid item md={1.8} xs={3} sm={1.8}>
                <FormControl fullWidth size="small">
                  {/* <Typography>Excel Date Format</Typography> */}
                  <Select
                    fullWidth
                    labelId="demo-select-small"
                    id="demo-select-small"
                    //   disabled={fileLength > 0}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 200,
                          width: 80,
                        },
                      },
                    }}
                    value={symboldrop}
                    onChange={(e) => {
                      setSymboldrop(e.target.value);
                    }}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    <MenuItem value="/" disabled>
                      {" "}
                      {"/"}{" "}
                    </MenuItem>
                    <MenuItem value="/"> {"/"} </MenuItem>
                    <MenuItem value="."> {"."} </MenuItem>
                    <MenuItem value="-"> {"-"} </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item md={3} xs={4} sm={3}>
                <FormControl fullWidth size="small">
                  {/* <Typography>Excel Date Format</Typography> */}
                  <Select
                    fullWidth
                    labelId="demo-select-small"
                    id="demo-select-small"
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 200,
                          width: 80,
                        },
                      },
                    }}
                    value={hoursdrop}
                    onChange={(e) => {
                      setHoursdrop(e.target.value);
                    }}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    <MenuItem value="Hours" disabled>
                      {"Hours"}{" "}
                    </MenuItem>
                    <MenuItem value="12 Hours"> {"12 Hours"} </MenuItem>
                    <MenuItem value="24 Hours"> {"24 Hours"} </MenuItem>
                    <MenuItem value="NAN"> {"NAN"} </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          {/* <Grid item md={3} xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <Typography>Date<b style={{ color: "red" }}>*</b></Typography>
              <OutlinedInput
                id="component-outlined"
                type="date"
                value={penaltyErrorUpload.date}
                onChange={(e) => {
                  setPenaltyErrorUpload({
                    ...penaltyErrorUpload,
                    date: e.target.value,
                  });
                }}
              />
            </FormControl>
          </Grid> */}

        </Grid>
        <br />
        <br />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4} md={2} lg={2}>
            <Button
              variant="contained"
              color="success"
              type="button"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Grid>

          <Grid item xs={12} sm={4} md={1} lg={1}>
            <Button sx={userStyle.btncancel} onClick={handleclear}>
              Clear
            </Button>
          </Grid>
          <Grid item xs={12} sm={4} md={4} lg={2}></Grid>
          <Grid item xs={12} sm={4} md={2} lg={2}>
            <Button sx={userStyle.btncancel} onClick={handleclearexcel}>
              Clear with Excel
            </Button>
          </Grid>
          <Grid item xs={12} sm={4} md={2} lg={2}>
            <Button
              variant="contained"
              color="success"
              type="button"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Grid>
        </Grid>

        <br /> <br />

        <Grid container spacing={2}>
          {
            (penaltyErrorUpload.type === "DEP Audit Summary Report") &&
            <>
              <Grid item xs={12} sm={1} md={1} lg={1}>
                <Typography>
                  <strong>A: Audit Date</strong>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={1} md={1} lg={1}>
                <Typography>
                  <strong>B: Process</strong>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={1} md={1} lg={1}>
                <Typography>
                  <strong>C: Error File Name</strong>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={1} md={1} lg={1}>
                <Typography>
                  <strong>D: Document Number</strong>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={1} md={1} lg={1}>
                <Typography>
                  <strong>E: Document Type</strong>
                </Typography>
              </Grid>


              <Grid item xs={12} sm={1} md={1} lg={1}>
                <Typography>
                  <strong>F: Field Name</strong>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={1} md={1} lg={1}>
                <Typography>
                  <strong>G: Line</strong>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={1} md={1} lg={1}>
                <Typography>
                  <strong>H: Error Value</strong>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={1} md={1} lg={1}>
                <Typography>
                  <strong>I: Correct Value</strong>
                </Typography>
              </Grid>
              {/* <Grid item xs={12} sm={2.5} md={2.5} lg={2.5}>
                <Typography>
                  <strong>J: Link</strong>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={2} md={2} lg={2}>
                <Typography>
                  <strong>K: Doc Link</strong>
                </Typography>
              </Grid> */}
            </>
          }

          {
            (penaltyErrorUpload.type === "DEP Queue Type Audit Summary Report") &&
            <>
              <Grid item xs={12} sm={1} md={1} lg={1}>
                <Typography>
                  <strong>A: Audit Date</strong>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={1} md={1} lg={1}>
                <Typography>
                  <strong>B: Process</strong>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={1} md={1} lg={1}>
                <Typography>
                  <strong>C: Error File Name</strong>
                </Typography>
              </Grid>

              <Grid item xs={12} sm={1} md={1} lg={1}>
                <Typography>
                  <strong>D: Field Name</strong>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={1} md={1} lg={1}>
                <Typography>
                  <strong>E: Line</strong>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={1} md={1} lg={1}>
                <Typography>
                  <strong>F: Error Value</strong>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={1} md={1} lg={1}>
                <Typography>
                  <strong>G: Correct Value</strong>
                </Typography>
              </Grid>
              {/* <Grid item xs={12} sm={2.5} md={2.5} lg={2.5}>
                <Typography>
                  <strong>H: Link</strong>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={2.5} md={2.5} lg={2.5}>
                <Typography>
                  <strong>I: Doc Link</strong>
                </Typography>
              </Grid> */}
            </>
          }
        </Grid>

        <br /> <br />
        <div style={{ zIndex: "0" }} ref={hotElementRef} />
        <br /> <br />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4} md={2} lg={2}>
            <Button
              variant="contained"
              color="success"
              type="button"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Grid>

          <Grid item xs={12} sm={4} md={1} lg={1}>
            <Button sx={userStyle.btncancel} onClick={handleclear}>
              Clear
            </Button>
          </Grid>
          <Grid item xs={12} sm={4} md={2} lg={2}>
            <Button sx={userStyle.btncancel} onClick={handleclearexcel}>
              Clear with Excel
            </Button>
          </Grid>
          <Grid item xs={12} sm={4} md={2} lg={2}>
            <Button
              variant="contained"
              color="success"
              type="button"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
        {/* ALERT DIALOG */}
        <Box>
          <Dialog
            open={isErrorOpen}
            onClose={handleCloseerr}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="sm"
          >
            <DialogContent
              sx={{
                width: "350px",
                textAlign: "center",
                alignItems: "center",
              }}
            >
              {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
              <Typography variant="h6">{showAlert}</Typography>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                color="error"
                onClick={handleCloseerr}
              >
                ok
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
        <MessageAlert openPopup={openPopupMalert}
          handleClosePopup={handleClosePopupMalert}
          popupContent={popupContentMalert}
          popupSeverity={popupSeverityMalert} />
        <AlertDialog openPopup={openPopup}
          handleClosePopup={handleClosePopup}
          popupContent={popupContent}
          popupSeverity={popupSeverity} />


          <Box>
                  <Dialog open={isErrorOpenpop} onClose={handleCloseerrpop} aria-labelledby="alert-dialog-title" maxWidth={"lg"} aria-describedby="alert-dialog-description">
                    {/* <DialogContent sx={{  textAlign: 'center', alignItems: 'center' }}>
                      <Typography variant="h6">{showAlertpop}</Typography>
                    </DialogContent> */}
                        <DialogContent>
          <Typography sx={userStyle.HeaderText}>Expected date format does not match for line(s)</Typography>
          <Grid container spacing={2}>
            <Grid item md={12} xs={12} sm={12}>
              <Grid container style={userStyle.dataTablestyle}>
                <Grid item md={2} xs={12} sm={12}>
                  <Box>
                    <label>Show entries:</label>
                    <Select
                      id="pageSizeSelect"
                      size="small"
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
                      <MenuItem value={filteredDatas?.length}>All</MenuItem>
                    </Select>
                  </Box>
                </Grid>
                <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Box>
                  
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
                <br />
              </Grid>
              <Box
                style={{
                  width: "100%",
                  overflowY: "hidden", // Hide the y-axis scrollbar
                }}
              >
                <StyledDataGrid rows={rowDataTable} columns={columnDataTable} autoHeight={true} density="compact" hideFooter disableRowSelectionOnClick />
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
            </Grid>
          </Grid>
        </DialogContent>



                    <DialogActions>
                      <Button
                        style={{
                          backgroundColor: '#f4f4f4',
                          color: '#444',
                          boxShadow: 'none',
                          borderRadius: '3px',
                          padding: '7px 13px',
                          border: '1px solid #0000006b',
                          '&:hover': {
                            '& .css-bluauu-MuiButtonBase-root-MuiButton-root': {
                              backgroundColor: '#f4f4f4',
                            },
                          },
                        }}
                        sx={buttonStyles.btncancel}
                        onClick={handleCloseerrpop}
                      >
                        Close
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Box>



      </Box>
    </>
  );
};

export default ExcelSheet;
