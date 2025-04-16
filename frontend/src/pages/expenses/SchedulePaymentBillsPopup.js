import React, { useState, useEffect, useContext } from "react";
import {Box,
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
import { userStyle } from "../../pageStyle";
import {  FaTrash, } from "react-icons/fa";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { SERVICE } from "../../services/Baseservice";
import {modeofpayments} from "../../components/Componentkeyword";
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
  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
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
    fetchVendorNew(meetingValues[9]);
  }, [meetingValues]);
  const [gstNumber, setGstNumber] = useState("");
  //get all  vendordetails.
  const fetchVendorNew = async (e) => {
    try {
      let res_vendor = await axios.get(SERVICE.ALL_VENDORDETAILS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let filtered = res_vendor.data.vendordetails.filter((data) => {
        return data._id === e;
      });

      setVendorNew((prev) => ({
        ...prev,
        ...filtered[0],
      }));
      setGstNumber(filtered[0]?.gstnumber);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      let response = await axios.post(`${SERVICE.NEW_OTHERPAYMENTS}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
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
        accountholdername: String(
          gstOptions.accountholdername == undefined
            ? ""
            : gstOptions.accountholdername
        ),
        paymentfrequency: String(
          gstOptions.paymentfrequency == undefined
            ? ""
            : gstOptions.paymentfrequency
        ),
        bankname: String(
          gstOptions.bankname == undefined ? "" : gstOptions.bankname
        ),
        ifsccode: String(
          gstOptions.ifsccode == undefined ? "" : gstOptions.ifsccode
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
        billsdocument: [...refDocuments],
        receiptdocument: [...refRecDocuments],
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

        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],

        billstatus: "ADDED",
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
      setShowAlert(
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "green" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Added Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const handleSubmit = () => {
    if (newotherPaymnets?.billno === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Billno"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (newotherPaymnets?.billdate === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Bill Date"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (newotherPaymnets?.dueamount === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Dueamount"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      newotherPaymnets?.paidstatus === "Paid" &&
      newotherPaymnets?.paidthrough === "Please Select Paidthrough"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please  Select Paidthrough"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      newotherPaymnets?.paidstatus === "Paid" &&
      newotherPaymnets?.referenceno === ""
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please  Enter  Reference No"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (refDocuments.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please  Upload  Bills"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequest();
    }
  };

  // bill docs
  const handleInputChangedocument = (event, index) => {
    const files = event.target.files;
    let newSelectedFiles = [...refDocuments];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check if the file is an image
      if (
        file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type === "text/plain" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || // Handle Excel
        file.type === "application/zip" ||
        file.type.startsWith("image/")
      ) {
        const reader = new FileReader();
        reader.onload = () => {
          newSelectedFiles.push({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: reader.result,
            base64: reader.result.split(",")[1],
          });
          setrefDocuments(newSelectedFiles);
        };
        reader.readAsDataURL(file);
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Only Accept Documents!"}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };

  // bill doc delete
  const handleDeleteFileDocument = (index) => {
    const newSelectedFiles = [...refDocuments];

    newSelectedFiles.splice(index, 1);
    setrefDocuments(newSelectedFiles?.length > 0 ? newSelectedFiles : []);
  };

  // receipt docs
  const handleInputChangedocumentRec = (event, index) => {
    const files = event.target.files;
    let newSelectedFiles = [...refRecDocuments];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check if the file is an image
      if (
        file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type === "text/plain" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || // Handle Excel
        file.type === "application/zip" ||
        file.type.startsWith("image/")
      ) {
        const reader = new FileReader();
        reader.onload = () => {
          newSelectedFiles.push({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: reader.result,
            base64: reader.result.split(",")[1],
          });
          setRefRecDouments(newSelectedFiles);
        };
        reader.readAsDataURL(file);
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Only Accept Documents!"}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };

  const handleDeleteFileDocumentRef = (index) => {
    const newSelectedFiles = [...refRecDocuments];
    newSelectedFiles.splice(index, 1);
    setRefRecDouments(newSelectedFiles);
  };

  return (
    <Box>
      {isUserRoleCompare?.includes("aschedulepaymentbills") && (
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
                        });
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
                          Paid Through<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={modeofpayments}
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
                    {refDocuments?.map((file, index) => (
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
                            <Typography variant="subtitle2">
                              {file.name}{" "}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            md={2}
                            sm={2}
                            xs={2}
                            sx={{ display: "flex" }}
                          >
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
                                onClick={() => renderFilePreview(file)}
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
                      </>
                    ))}
                  </Grid>
                </Grid>

                <Grid container>
                  <Grid item md={12} sm={12} xs={12}>
                    {refRecDocuments?.map((file, index) => (
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
                            <Typography variant="subtitle2">
                              {file.name}{" "}
                            </Typography>
                          </Grid>

                          <Grid
                            item
                            md={2}
                            sm={2}
                            xs={2}
                            sx={{ display: "flex" }}
                          >
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
                                onClick={() => renderFilePreview(file)}
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
                              onClick={() => handleDeleteFileDocumentRef(index)}
                            >
                              <FaTrash
                                style={{ fontSize: "medium", color: "#a73131" }}
                              />
                            </Button>
                          </Grid>
                        </Grid>
                      </>
                    ))}
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
                          onChange={(e) => {}}
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
                    <Button variant="contained" onClick={handleSubmit}>
                      {" "}
                      SAVE
                    </Button>
                    <Button
                      sx={userStyle.btncancel}
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
                  >
                    ok
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}
export default SchedulePamentBillsPopup;
