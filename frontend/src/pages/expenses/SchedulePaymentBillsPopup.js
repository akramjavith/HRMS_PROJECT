import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,

  OutlinedInput,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Button,
} from "@mui/material";
import { handleApiError } from "../../components/Errorhandling";
import {
  paidOpt
} from "../../components/Componentkeyword";
import { userStyle } from "../../pageStyle";
import { FaTrash, } from "react-icons/fa";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { SERVICE } from "../../services/Baseservice";
import { modeofpayments } from "../../components/Componentkeyword";
import axios from "axios";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { UserRoleAccessContext, AuthContext } from "../../context/Appcontext";
import Selects from "react-select";
import "jspdf-autotable";
import pdfIcon from "../../components/Assets/pdf-icon.png";
import wordIcon from "../../components/Assets/word-icon.png";
import excelIcon from "../../components/Assets/excel-icon.png";
import csvIcon from "../../components/Assets/CSV.png";
import fileIcon from "../../components/Assets/file-icons.png";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { makeStyles } from "@material-ui/core";
import moment from "moment-timezone";
import MessageAlert from "../../components/MessageAlert";
import AlertDialog from "../../components/Alert";
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

function SchedulePamentBillsPopup({
  setVendorAuto,
  handleClickCloseMeetingPopup,
  meetingValues,
  fetchAllDatas,
}) {

  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
    // setIsBtn(false);
  };
  const handleClosePopupMalert = () => {
    setOpenPopupMalert(false);
  };
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const handleClickOpenPopup = () => {
    setOpenPopup(true);
    // setIsBtn(false);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };
  // Get the current date and format it as "YYYY-MM-DD"
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  let statusOpt = [
    { value: "Paid", label: "Paid" },
    { value: "Not Paid", label: "Not Paid" },
  ];



  // setDueDate(e)
  // const setDueDate = (e) => {
  //   let dueDate = ""; // Default value if not monthly
  //   if (e.paymentfrequency === "Monthly" && e.monthlyfrequency) {
  //     // Get the current month and year
  //     const today = moment();
  //     let proposedDate = moment(`${today.year()}-${today.month() + 1}-${e.monthlyfrequency}`, "YYYY-MM-DD");

  //     // If proposedDate is in the past, set it to next month
  //     if (proposedDate.isBefore(today, 'day')) {
  //       proposedDate.add(1, 'month');
  //     }

  //     // Filter holidays specific to the selected company, branch, and unit
  //     let mappedHolidays = holidays
  //       ?.filter(data =>
  //         data.company?.includes(newotherPaymnets.company) &&
  //         data.applicablefor?.includes(newotherPaymnets?.branchname?.label)
  //       )
  //       ?.map(item => item?.date);


  //     // Get the valid due date (not Sunday or a holiday)
  //     const validDueDate = getNextValidDate(proposedDate, mappedHolidays);
  //     dueDate = validDueDate.format("YYYY-MM-DD"); // Format as YYYY-MM-DD
  //   }



  //   setnewotherPaymnets({
  //     ...newotherPaymnets,
  //     vendor: {
  //       label: e.label,
  //       value: e.value,
  //     },
  //     vendorfrequency: e.paymentfrequency,
  //     paidmode: "Please Select Paid Mode",
  //     receiptdate: dueDate
  //   });
  // };
  const [vendorModeOfPayments, setVendorModeOfPayments] = useState([]);
  const [vendor, setVendorNew] = useState({
    bankname: "",
    bankbranchname: "",
    accountholdername: "",
    accountnumber: "",
    ifsccode: "",
    upinumber: "",
    chequenumber: "",
    cardnumber: "",
    cardholdername: "",
    cardtransactionnumber: "",
    cardtype: "",
    cardmonth: "",
    cardyear: "",
    cardsecuritycode: "",
  });

  const [vendorId, setVendorId] = useState("");

  const {
    isUserRoleCompare,
    isUserRoleAccess,
    buttonStyles,
  } = useContext(UserRoleAccessContext);

  const [newotherPaymnets, setnewotherPaymnets] = useState({
    branchname: "Please Select Branch Name",
    company: "Please Select Company",
    purpose: "Please Select Purpose",
    billno: "",
    vendor: "Please Select Vendor",
    dueamount: "",
    accountholdername: "",
    paymentfrequency: "",
    bankname: "",
    ifsccode: "",
    gstno: "",
    billdate: formattedDate,
    receiptdate: formattedDate,
    paidthrough: "Please Select Paidthrough",
    paid: "Please Select Paid",
    referenceno: "",
    paidstatus: "Not Paid",
    expansecategory: "Please Select Expense Category",
    expansesubcategory: "Please Select Expense Sub Category",
  });
  // const renderFilePreview = async (file) => {
  //   const response = await fetch(file.preview);
  //   const blob = await response.blob();
  //   const url = window.URL.createObjectURL(blob);
  //   const link = document.createElement("a");
  //   link.href = url;
  //   window.open(link, "_blank");
  // };
  const renderFilePreview = async (file) => {
    const url = window.URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };
  const classes = useStyles();
  // FILEICONPREVIEW CREATE
  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop();
    switch (extension) {
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
  const { auth } = useContext(AuthContext);
  const [showAlert, setShowAlert] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };
  const [refDocuments, setrefDocuments] = useState([]);
  const [refRecDocuments, setRefRecDouments] = useState([]);

  const [gstOptions, setGstOptions] = useState({});

  useEffect(() => {
    fetchVendorNew(meetingValues);
  }, [meetingValues]);
  const [gstNumber, setGstNumber] = useState("");
  //get all  vendordetails.
  const fetchVendorNew = async (values) => {
    try {
      let res_vendor = await axios.get(SERVICE.ALL_VENDORDETAILS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let res_status = await axios.post(SERVICE.ALL_HOLIDAY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        // assignbranch: accessbranch,
      });
      let holidays = res_status?.data?.holiday
      let filtered = res_vendor.data.vendordetails.find((data) => {
        return data._id === values[9];
      });
      setVendorId(values[9])
      setVendorNew((prev) => ({
        ...prev,
        ...filtered,
      }));
      setGstNumber(filtered?.gstnumber);
      const getNextValidDate = (date, holidays) => {
        const holidaysSet = new Set(holidays); // Store holidays for quick lookup
        let nextDate = moment(date); // Convert the date to a Moment instance

        // Increment the date until it's not a Sunday or a holiday
        while (nextDate.day() === 0 || holidaysSet.has(nextDate.format("YYYY-MM-DD"))) {
          nextDate.add(1, 'day'); // Move to the next day
        }

        return nextDate;
      };


      let dueDate = ""; // Default value if not monthly
      if (filtered.paymentfrequency === "Monthly" && filtered.monthlyfrequency) {
        // Get the current month and year
        const today = moment();
        let proposedDate = moment(`${today.year()}-${today.month() + 1}-${filtered.monthlyfrequency}`, "YYYY-MM-DD");

        // If proposedDate is in the past, set it to next month
        if (proposedDate.isBefore(today, 'day')) {
          proposedDate.add(1, 'month');
        }

        // Filter holidays specific to the selected company, branch, and unit
        let mappedHolidays = holidays
          ?.filter(data =>
            data.company?.includes(values[0]) &&
            data.applicablefor?.includes(values[1])
          )
          ?.map(item => item?.date);


        // Get the valid due date (not Sunday or a holiday)
        const validDueDate = getNextValidDate(proposedDate, mappedHolidays);
        dueDate = validDueDate.format("YYYY-MM-DD"); // Format as YYYY-MM-DD

        setnewotherPaymnets({
          ...newotherPaymnets,
          receiptdate: dueDate,
        });
      }
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const sendRequest = async () => {
    // Get the current date and time
    const currentDate = new Date();
    const currentTimeString = currentDate.toLocaleTimeString([], {
      hour12: false,
    });
    const dateTimeString = `${newotherPaymnets.receiptdate} ${currentTimeString}`;
    try {

      let formData = new FormData();

      if (refDocuments.length > 0) {
        refDocuments.forEach((item) => {
          formData.append("billsdocument", item.file); // `files` is the key for multiple files
        });
      }
      if (refRecDocuments.length > 0) {
        refRecDocuments.forEach((item) => {
          formData.append("receiptdocument", item.file); // `files` is the key for multiple files
        });
      }
      const jsonData = {
        company: String(meetingValues[0]),
        branchname: String(meetingValues[1]),
        expensecategory: String(meetingValues[2]),
        expensesubcategory: String(meetingValues[3]),
        purpose: String(meetingValues[4]),
        billno: String(newotherPaymnets.billno),
        vendor: String(meetingValues[5]),
        gstno: String(gstNumber),
        billdate: String(newotherPaymnets.billdate),
        receiptdate: String(newotherPaymnets.receiptdate),
        dueamount: Number(newotherPaymnets.dueamount),

        paymentfrequency: String(
          gstOptions.paymentfrequency == undefined
            ? ""
            : gstOptions.paymentfrequency
        ),


        paidthrough:
          newotherPaymnets.paidstatus === "Paid"
            ? String(newotherPaymnets.paidthrough)
            : "",
        paid: String(newotherPaymnets.paid),
        referenceno:
          newotherPaymnets.paidstatus === "Paid"
            ? String(newotherPaymnets.referenceno)
            : "",
        paidstatus: String(newotherPaymnets.paidstatus),
        sortdate: String(
          newotherPaymnets.paidstatus === "Paid" ? dateTimeString : ""
        ),
        vendorfrequency: String(meetingValues[6]),
        vendorid: String(vendorId),
        source: "Scheduled Payment",

        bankname:
          newotherPaymnets.paidthrough === "Bank Transfer" &&
            newotherPaymnets.paidstatus === "Paid"
            ? String(vendor.bankname)
            : "",
        bankbranchname:
          newotherPaymnets.paidthrough === "Bank Transfer" &&
            newotherPaymnets.paidstatus === "Paid"
            ? String(vendor.bankbranchname)
            : "",
        accountholdername:
          newotherPaymnets.paidthrough === "Bank Transfer" &&
            newotherPaymnets.paidstatus === "Paid"
            ? String(vendor.accountholdername)
            : "",
        accountnumber:
          newotherPaymnets.paidthrough === "Bank Transfer" &&
            newotherPaymnets.paidstatus === "Paid"
            ? String(vendor.accountnumber)
            : "",
        ifsccode:
          newotherPaymnets.paidthrough === "Bank Transfer" &&
            newotherPaymnets.paidstatus === "Paid"
            ? String(vendor.ifsccode)
            : "",

        upinumber:
          newotherPaymnets.paidthrough === "UPI" &&
            newotherPaymnets.paidstatus === "Paid"
            ? String(vendor.upinumber)
            : "",

        cardnumber:
          newotherPaymnets.paidthrough === "Card" &&
            newotherPaymnets.paidstatus === "Paid"
            ? String(vendor.cardnumber)
            : "",
        cardholdername:
          newotherPaymnets.paidthrough === "Card" &&
            newotherPaymnets.paidstatus === "Paid"
            ? String(vendor.cardholdername)
            : "",
        cardtransactionnumber:
          newotherPaymnets.paidthrough === "Card" &&
            newotherPaymnets.paidstatus === "Paid"
            ? String(vendor.cardtransactionnumber)
            : "",
        cardtype:
          newotherPaymnets.paidthrough === "Card" &&
            newotherPaymnets.paidstatus === "Paid"
            ? String(vendor.cardtype)
            : "",
        cardmonth:
          newotherPaymnets.paidthrough === "Card" &&
            newotherPaymnets.paidstatus === "Paid"
            ? String(vendor.cardmonth)
            : "",
        cardyear:
          newotherPaymnets.paidthrough === "Card" &&
            newotherPaymnets.paidstatus === "Paid"
            ? String(vendor.cardyear)
            : "",
        cardsecuritycode:
          newotherPaymnets.paidthrough === "Card" &&
            newotherPaymnets.paidstatus === "Paid"
            ? String(vendor.cardsecuritycode)
            : "",

        chequenumber:
          newotherPaymnets.paidthrough === "Cheque" &&
            newotherPaymnets.paidstatus === "Paid"
            ? String(vendor.chequenumber)
            : "",

        cash:
          newotherPaymnets.paidthrough === "Cash" &&
            newotherPaymnets.paidstatus === "Paid"
            ? String("Cash")
            : "",

        paidbillstatus: String(newotherPaymnets.paidstatus === "Not Paid" ? "InComplete" : (newotherPaymnets.paidstatus === "Paid" && Number(newotherPaymnets.dueamount) === Number(newotherPaymnets.paidamount)) ? "Completed" : "Partially Paid"),
        paiddate: newotherPaymnets.paidstatus === "Paid" ? newotherPaymnets?.paiddate : "",
        paidamount: newotherPaymnets.paidstatus === "Paid" ? Number(newotherPaymnets?.paidamount) : 0,


        paymentduereminderlog: newotherPaymnets.paidstatus === "Paid" ? [
          {
            balanceamount: Number(
              newotherPaymnets.paidstatus === "Not Paid"
                ? newotherPaymnets.dueamount
                : Number(newotherPaymnets.dueamount) - Number(newotherPaymnets.paidamount)
            ),
            expensetotal: newotherPaymnets.dueamount,
            modeofpayments: newotherPaymnets.paidthrough,
            payamountdate: newotherPaymnets?.paiddate,
            payamount: Number(
              newotherPaymnets.paidstatus === "Not Paid" ? 0 : newotherPaymnets.paidamount
            ),
            bankname: newotherPaymnets.paidthrough === "Bank Transfer"
              ? String(vendor.bankname)
              : "",
            bankbranchname: newotherPaymnets.paidthrough === "Bank Transfer"
              ? vendor.bankbranchname
              : "",
            accountholdername: newotherPaymnets.paidthrough === "Bank Transfer"
              ? vendor.accountholdername
              : "",
            accountnumber: newotherPaymnets.paidthrough === "Bank Transfer"
              ? vendor.accountnumber
              : "",
            ifsccode: newotherPaymnets.paidthrough === "Bank Transfer" ? vendor.ifsccode : "",

            upinumber: newotherPaymnets.paidthrough === "UPI" ? vendor.upinumber : "",

            cardnumber: newotherPaymnets.paidthrough === "Card" ? vendor.cardnumber : "",
            cardholdername: newotherPaymnets.paidthrough === "Card"
              ? vendor.cardholdername
              : "",
            cardtransactionnumber: newotherPaymnets.paidthrough === "Card"
              ? vendor.cardtransactionnumber
              : "",
            cardtype: newotherPaymnets.paidthrough === "Card" ? vendor.cardtype : "",
            cardmonth: newotherPaymnets.paidthrough === "Card" ? vendor.cardmonth : "",
            cardyear: newotherPaymnets.paidthrough === "Card" ? vendor.cardyear : "",
            cardsecuritycode: newotherPaymnets.paidthrough === "Card"
              ? vendor.cardsecuritycode
              : "",
            chequenumber: newotherPaymnets.paidthrough === "Cheque"
              ? vendor.chequenumber
              : "",
            addedby: [
              {
                name: String(isUserRoleAccess.companyname),
                date: String(new Date()),
              },
            ],
          }] : [],
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],

        billstatus: "ADDED",
      };
      formData.append("jsonData", JSON.stringify(jsonData));
      let response = await axios.post(`${SERVICE.NEW_OTHERPAYMENTS}`, formData, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

      });

      await axios.delete(
        `${SERVICE.SINGLE_SCHEDULEPAYMENT_NOTADDEDBILLS}/${meetingValues[8]}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      fetchAllDatas();
      setVendorAuto("none");
      handleClickCloseMeetingPopup();
      setnewotherPaymnets({
        ...newotherPaymnets,
        branchname: newotherPaymnets.branchname,

        // purpose: "",
        billno: "",
        vendor: newotherPaymnets.vendor,
        dueamount: "",
        accountholdername: "",
        paymentfrequency: "",
        bankname: "",
        ifsccode: "",
        gstno: "",
        billdate: formattedDate,
        receiptdate: formattedDate,
        paidthrough: newotherPaymnets.paidthrough,
        paid: newotherPaymnets.paid,
        referenceno: "",
      });
      setrefDocuments([]);
      setRefRecDouments([]);
      setGstOptions({});
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const handleSubmit = () => {
    if (newotherPaymnets?.billno === "") {

      setPopupContentMalert("Please Enter Billno!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (newotherPaymnets?.billdate === "") {
      setPopupContentMalert("Please Select Bill Date!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (newotherPaymnets?.dueamount === "") {
      setPopupContentMalert("Please Enter Dueamount!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      newotherPaymnets?.paidstatus === "Paid" &&
      newotherPaymnets?.paidamount === 0
    ) {
      setPopupContentMalert("Please Enter Paid Amount!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      newotherPaymnets?.paidstatus === "Paid" &&
      !newotherPaymnets?.paiddate
    ) {
      setPopupContentMalert("Please Select Paid Date!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      newotherPaymnets?.paidstatus === "Paid" &&
      newotherPaymnets?.paidthrough === "Please Select Paidthrough"
    ) {
      setPopupContentMalert("Please  Select Paidthrough!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      newotherPaymnets?.paidstatus === "Paid" &&
      newotherPaymnets?.referenceno === ""
    ) {
      setPopupContentMalert("Please  Enter  Reference No!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (refDocuments.length === 0) {
      setPopupContentMalert("Please  Upload  Bills!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };

  // bill docs
  const handleInputChangedocument = (event) => {
    const selectedFiles = Array.from(event.target.files); // Convert FileList to Array
    if (!selectedFiles.length) return;

    let largeFiles = []; // To store names of files larger than 1MB

    // Filter files that are <= 1MB (1,024,000 bytes)
    const filteredFiles = selectedFiles.filter((file) => {
      if (file.size > 1024000) {
        largeFiles.push(file.name); // Collect large file names
        return false;
      }
      return true;
    });

    // If there are large files, show a single popup message
    if (largeFiles.length > 0) {
      setPopupContentMalert(
        `The following files are larger than 1MB and will not be uploaded:\n${largeFiles.join(", ")}`
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }

    if (filteredFiles.length === 0) return; // If no valid files, exit

    setrefDocuments((prevFiles) => [
      ...prevFiles,
      ...filteredFiles.map((file) => ({
        file,
      })),
    ]);
  };

  // bill doc delete
  const handleDeleteFileDocument = (index) => {
    const newSelectedFiles = [...refDocuments];

    newSelectedFiles.splice(index, 1);
    setrefDocuments(newSelectedFiles?.length > 0 ? newSelectedFiles : []);
  };

  // receipt docs
  const handleInputChangedocumentRec = (event) => {
    const selectedFiles = Array.from(event.target.files); // Convert FileList to Array
    if (!selectedFiles.length) return;

    let largeFiles = []; // To store names of files larger than 1MB

    // Filter files that are <= 1MB (1,024,000 bytes)
    const filteredFiles = selectedFiles.filter((file) => {
      if (file.size > 1024000) {
        largeFiles.push(file.name); // Collect large file names
        return false;
      }
      return true;
    });

    // If there are large files, show a single popup message
    if (largeFiles.length > 0) {
      setPopupContentMalert(
        `The following files are larger than 1MB and will not be uploaded:\n${largeFiles.join(", ")}`
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }

    if (filteredFiles.length === 0) return; // If no valid files, exit

    setRefRecDouments((prevFiles) => [
      ...prevFiles,
      ...filteredFiles.map((file) => ({
        file,
      })),
    ]);
  };

  const handleDeleteFileDocumentRef = (index) => {
    const newSelectedFiles = [...refRecDocuments];
    newSelectedFiles.splice(index, 1);
    setRefRecDouments(newSelectedFiles);
  };

  return (
    <Box>
      {isUserRoleCompare?.includes("aaddschedulepaymentbills") && (
        <>
          <Box sx={userStyle.container}>
            <Grid container spacing={2}>
              <Grid item md={12} sm={12} xs={12}>
                <Typography sx={userStyle.HeaderText}>
                  Add Schedule Payment Bills
                </Typography>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Company <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={meetingValues[0]}
                    readOnly
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Branch <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={meetingValues[1]}
                    readOnly
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Expense Category <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={meetingValues[2]}
                    readOnly
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Expense Sub Category <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={meetingValues[3]}
                    readOnly
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Purpose<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={meetingValues[4]}
                    readOnly
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Bill No<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    value={newotherPaymnets.billno}
                    onChange={(e) => {
                      setnewotherPaymnets({
                        ...newotherPaymnets,
                        billno: e.target.value,
                      });
                    }}
                    type="text"
                  />
                </FormControl>
              </Grid>
              {/* next grdi */}
              <>
                <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Vendor<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={meetingValues[5]}
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography> GSTNO</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={gstNumber}
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl size="small" fullWidth>
                    <Typography>Frequency</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={meetingValues[6]}
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Bill Date<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      type="date"
                      value={newotherPaymnets.billdate}
                      onChange={(e) => {
                        setnewotherPaymnets({
                          ...newotherPaymnets,
                          billdate: e.target.value,
                          receiptdate: "",
                          paiddate: "",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Due Date<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      type="date"
                      value={newotherPaymnets.receiptdate}
                      onChange={(e) => {
                        setnewotherPaymnets({
                          ...newotherPaymnets,
                          receiptdate: e.target.value,
                          paiddate: ""
                        });
                      }}
                      inputProps={{
                        min: newotherPaymnets.billdate,
                        // max: today
                      }}
                    />
                  </FormControl>
                </Grid>
              </>
              {/* next grdi */}
              <>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Due Amount<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      sx={userStyle.input}
                      type="number"
                      value={newotherPaymnets.dueamount}
                      onChange={(e) => {
                        setnewotherPaymnets({
                          ...newotherPaymnets,
                          dueamount: e.target.value,
                          paidamount: 0,
                          balanceamount: 0,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Paid Status<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={statusOpt}
                      placeholder="Please Select Status"
                      value={{
                        label: newotherPaymnets.paidstatus,
                        value: newotherPaymnets.paidstatus,
                      }}
                      onChange={(e) => {
                        setnewotherPaymnets({
                          ...newotherPaymnets,
                          paidstatus: e.value,
                          paidthrough: "Please Select Paidthrough",
                          referenceno: "",
                          paidamount: 0,
                          balanceamount: 0,
                          paiddate: "",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                {newotherPaymnets.paidstatus === "Paid" && (
                  <>
                    <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Paid Amount<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          placeholder="Please Enter Paid Amount"
                          sx={userStyle.input}
                          value={newotherPaymnets.paidamount}
                          onChange={(e) => {
                            if (
                              Number(e.target.value) <=
                              Number(newotherPaymnets.dueamount)
                            ) {
                              setnewotherPaymnets({
                                ...newotherPaymnets,
                                paidamount: e.target.value,
                                balanceamount:
                                  Number(newotherPaymnets.dueamount) - e.target.value,
                              });
                            }
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Balance Amount
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          placeholder="Balance Amount"
                          sx={userStyle.input}
                          value={newotherPaymnets.balanceamount} readOnly

                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Paid Date<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          type="date"
                          value={newotherPaymnets.paiddate}
                          onChange={(e) => {
                            setnewotherPaymnets({
                              ...newotherPaymnets,
                              paiddate: e.target.value,
                            });
                          }}
                          inputProps={{
                            min: newotherPaymnets.billdate,
                            max: newotherPaymnets.receiptdate
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Paid Through<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={paidOpt?.filter((data) =>
                            vendor?.modeofpayments.includes(data?.label)
                          )}
                          value={{
                            label: newotherPaymnets?.paidthrough,
                            value: newotherPaymnets?.paidthrough,
                          }}
                          onChange={(e) => {
                            setnewotherPaymnets({
                              ...newotherPaymnets,
                              paidthrough: e.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Reference No<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Please Enter Form"
                          value={newotherPaymnets.referenceno}
                          onChange={(e) => {
                            setnewotherPaymnets({
                              ...newotherPaymnets,
                              referenceno: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}


              </>
              <Grid item md={12} sm={12} xs={12}>
                <Typography variant="h6">Attachments</Typography>
              </Grid>
              <Grid item md={12} sm={12} xs={12} sx={{ display: "flex" }}>
                <Grid>
                  <Typography variant="h6">
                    Bill<b style={{ color: "red" }}>*</b>{" "}
                  </Typography>
                  <input
                    className={classes.inputs}
                    type="file"
                    id="file-inputuploadcreatefirstedit"
                    accept=".pdf, .doc, .docx, .txt, .xls, .xlsx, .zip, .png , .jpg , "
                    multiple
                    onChange={handleInputChangedocument}
                  />
                  <label htmlFor="file-inputuploadcreatefirstedit">
                    <Button
                      component="span"
                      style={{
                        backgroundColor: "#f4f4f4",
                        color: "#444",
                        minWidth: "40px",
                        boxShadow: "none",
                        borderRadius: "5px",
                        marginTop: "-5px",
                        textTransform: "capitalize",
                        border: "1px solid #0000006b",
                        "&:hover": {
                          "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                            backgroundColor: "#f4f4f4",
                          },
                        },
                      }}
                    >
                      Upload Document &ensp; <CloudUploadIcon />
                    </Button>
                  </label>
                </Grid>
                &emsp;
                <Grid>
                  <Typography variant="h6">Receipt</Typography>
                  <input
                    className={classes.inputs}
                    type="file"
                    id="file-inputuploadedit"
                    accept=".pdf, .doc, .docx, .txt, .xls, .xlsx, .zip, .png , .jpg , "
                    multiple
                    onChange={handleInputChangedocumentRec}
                  />
                  <label htmlFor="file-inputuploadedit">
                    <Button
                      component="span"
                      style={{
                        backgroundColor: "#f4f4f4",
                        color: "#444",
                        minWidth: "40px",
                        boxShadow: "none",
                        borderRadius: "5px",
                        marginTop: "-5px",
                        textTransform: "capitalize",
                        border: "1px solid #0000006b",
                        "&:hover": {
                          "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                            backgroundColor: "#f4f4f4",
                          },
                        },
                      }}
                    >
                      Upload Document &ensp; <CloudUploadIcon />
                    </Button>
                  </label>
                </Grid>
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                <br />
                <Grid container>
                  <Grid item md={12} sm={12} xs={12}>
                    {refDocuments?.length > 0 &&
                      refDocuments.map((data, index) => {
                        const fileURL = URL.createObjectURL(data.file); // Generate a URL for the file preview

                        return (
                          <Grid container key={index}>
                            <Grid item md={2} sm={2} xs={2}>
                              <Box
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {data.file.type.includes("image/") ? (
                                  <img
                                    src={fileURL}
                                    alt={data.file.name}
                                    height={50}
                                    style={{
                                      maxWidth: "100%",
                                    }}
                                    onLoad={() => URL.revokeObjectURL(fileURL)} // Free up memory when image loads
                                  />
                                ) : (
                                  <img
                                    className={classes.preview}
                                    src={getFileIcon(data.file.name)}
                                    height="25"
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
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Typography variant="subtitle2">{data.file.name}</Typography>
                            </Grid>
                            <Grid item md={1} sm={1} xs={1}>
                              <Button
                                sx={{
                                  padding: "14px 14px",
                                  minWidth: "40px !important",
                                  borderRadius: "50% !important",
                                  ":hover": {
                                    backgroundColor: "#80808036",
                                  },
                                }}
                              >
                                <VisibilityOutlinedIcon
                                  style={{
                                    fontsize: "large",
                                    color: "#357AE8",
                                  }}
                                  onClick={() => renderFilePreview(data.file)}
                                />
                              </Button>
                            </Grid>
                            <Grid item md={1} sm={1} xs={1}>
                              <Button
                                sx={{
                                  padding: "14px 14px",
                                  minWidth: "40px !important",
                                  borderRadius: "50% !important",
                                  ":hover": {
                                    backgroundColor: "#80808036",
                                  },
                                }}
                                onClick={() => handleDeleteFileDocument(index)}
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
                        );
                      })}

                  </Grid>
                </Grid>

                <Grid container>
                  <Grid item md={12} sm={12} xs={12}>
                    {refRecDocuments?.length > 0 &&
                      refRecDocuments.map((data, index) => {
                        const fileURL = URL.createObjectURL(data.file); // Generate a URL for the file preview

                        return (
                          <Grid container key={index}>
                            <Grid item md={2} sm={2} xs={2}>
                              <Box
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {data.file.type.includes("image/") ? (
                                  <img
                                    src={fileURL}
                                    alt={data.file.name}
                                    height={50}
                                    style={{
                                      maxWidth: "100%",
                                    }}
                                    onLoad={() => URL.revokeObjectURL(fileURL)} // Free up memory when image loads
                                  />
                                ) : (
                                  <img
                                    className={classes.preview}
                                    src={getFileIcon(data.file.name)}
                                    height="25"
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
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Typography variant="subtitle2">{data.file.name}</Typography>
                            </Grid>
                            <Grid item md={1} sm={1} xs={1}>
                              <Button
                                sx={{
                                  padding: "14px 14px",
                                  minWidth: "40px !important",
                                  borderRadius: "50% !important",
                                  ":hover": {
                                    backgroundColor: "#80808036",
                                  },
                                }}
                              >
                                <VisibilityOutlinedIcon
                                  style={{
                                    fontsize: "large",
                                    color: "#357AE8",
                                  }}
                                  onClick={() => renderFilePreview(data.file)}
                                />
                              </Button>
                            </Grid>
                            <Grid item md={1} sm={1} xs={1}>
                              <Button
                                sx={{
                                  padding: "14px 14px",
                                  minWidth: "40px !important",
                                  borderRadius: "50% !important",
                                  ":hover": {
                                    backgroundColor: "#80808036",
                                  },
                                }}
                                onClick={() => handleDeleteFileDocumentRef(index)}
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
                        );
                      })}
                  </Grid>
                </Grid>
              </Grid>
              {newotherPaymnets.paidthrough === "Cash" &&
                newotherPaymnets.paidstatus === "Paid" && (
                  <>
                    <br />
                    <br />
                    <br />

                    <Grid
                      item
                      md={4}
                      lg={3}
                      xs={12}
                      sm={12}
                      sx={{ display: "flex" }}
                    >
                      <FormControl fullWidth size="small">
                        <Typography sx={{ fontWeight: "bold" }}>
                          Cash
                        </Typography>
                        <br />

                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          readOnly={true}
                          value={"Cash"}
                          onChange={(e) => { }}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}

              {newotherPaymnets.paidthrough === "Bank Transfer" &&
                newotherPaymnets.paidstatus === "Paid" && (
                  <>
                    <br />
                    <br />

                    <Grid item md={12} xs={8}>
                      <Typography sx={{ fontWeight: "bold" }}>
                        Bank Details
                      </Typography>
                    </Grid>

                    <br />
                    <br />

                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Bank Name</Typography>
                        <OutlinedInput
                          readOnly={true}
                          value={vendor.bankname}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Bank Branch Name</Typography>
                        <OutlinedInput
                          readOnly={true}
                          value={vendor.bankbranchname}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Account Holder Name</Typography>
                        <OutlinedInput
                          readOnly={true}
                          value={vendor.accountholdername}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Account Number</Typography>
                        <OutlinedInput
                          readOnly={true}
                          value={vendor.accountnumber}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12} sx={{ display: "flex" }}>
                      <FormControl fullWidth size="small">
                        <Typography>IFSC Code</Typography>
                        <OutlinedInput
                          readOnly={true}
                          value={vendor.ifsccode}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}

              {newotherPaymnets.paidthrough === "UPI" &&
                newotherPaymnets.paidstatus === "Paid" && (
                  <>
                    <br />
                    <Grid item md={12} xs={8}>
                      <Typography sx={{ fontWeight: "bold" }}>
                        UPI Details
                      </Typography>
                    </Grid>

                    <br />
                    <br />

                    <Grid item md={3} xs={12} sm={12} sx={{ display: "flex" }}>
                      <FormControl fullWidth size="small">
                        <Typography>UPI Number</Typography>
                        <OutlinedInput
                          readOnly={true}
                          value={vendor.upinumber}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}

              {newotherPaymnets.paidthrough === "Card" &&
                newotherPaymnets.paidstatus === "Paid" && (
                  <>
                    <br /> <br />
                    <Grid md={12} item xs={8}>
                      <Typography sx={{ fontWeight: "bold" }}>
                        Card Details
                      </Typography>
                    </Grid>
                    <br />
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Card Number</Typography>
                        <OutlinedInput
                          readOnly={true}
                          value={vendor.cardnumber}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Card Holder Name</Typography>
                        <OutlinedInput
                          readOnly={true}
                          value={vendor.cardholdername}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Card Transaction Number</Typography>
                        <OutlinedInput
                          readOnly={true}
                          value={vendor.cardtransactionnumber}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Card Type</Typography>
                        <OutlinedInput
                          readOnly={true}
                          value={vendor.cardtype}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={6}>
                      <Typography>Expire At</Typography>
                      <Grid container spacing={1}>
                        <Grid item md={6} xs={12} sm={6}>
                          <FormControl fullWidth size="small">
                            <OutlinedInput
                              readOnly={true}
                              value={vendor.cardmonth}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={6} xs={12} sm={6}>
                          <FormControl fullWidth size="small">
                            <OutlinedInput
                              readOnly={true}
                              value={vendor.cardyear}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12} sx={{ display: "flex" }}>
                      <FormControl fullWidth size="small">
                        <Typography>Security Code</Typography>
                        <OutlinedInput
                          readOnly={true}
                          value={vendor.cardsecuritycode}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}

              {newotherPaymnets.paidthrough === "Cheque" &&
                newotherPaymnets.paidstatus === "Paid" && (
                  <>
                    <br />
                    <br />

                    <Grid item md={12} xs={8}>
                      <Typography sx={{ fontWeight: "bold" }}>
                        Cheque Details
                      </Typography>
                    </Grid>

                    <br />

                    <Grid item md={3} xs={12} sm={12} sx={{ display: "flex" }}>
                      <FormControl fullWidth size="small">
                        <Typography>Cheque Number</Typography>
                        <OutlinedInput
                          readOnly={true}
                          value={vendor.chequenumber}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}
              <Grid container spacing={2}>
                <Grid item md={12} sm={12} xs={12}>
                  <br />
                  <br />
                  <Grid
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "15px",
                    }}
                  >
                    <Button variant="contained" onClick={handleSubmit} sx={buttonStyles.buttonsubmit}>
                      {" "}
                      SAVE
                    </Button>
                    <Button
                      sx={buttonStyles.btncancel}
                      onClick={handleClickCloseMeetingPopup}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
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
                    sx={buttonStyles.buttonsubmit}
                  >
                    ok
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </Box>
        </>
      )}

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
export default SchedulePamentBillsPopup;
