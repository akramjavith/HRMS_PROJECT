import { makeStyles } from "@material-ui/core";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EastIcon from "@mui/icons-material/East";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import WestIcon from "@mui/icons-material/West";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Backdrop, Box, Button, Checkbox,
  Dialog, DialogActions, DialogContent, FormControl, FormControlLabel, FormGroup, GlobalStyles, Grid, MenuItem, OutlinedInput, Select, Typography
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import * as faceapi from "face-api.js";
import "jspdf-autotable";
import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Selects from "react-select";
import { v4 as uuidv4 } from "uuid";
import csvIcon from "../components/Assets/CSV.png";
import excelIcon from "../components/Assets/excel-icon.png";
import fileIcon from "../components/Assets/file-icons.png";
import pdfIcon from "../components/Assets/pdf-icon.png";
import wordIcon from "../components/Assets/word-icon.png";
import Footer from "../components/footer/footer.js";
import { SERVICE } from "../services/Baseservice";
import ExistingProfileVisitor from "./ExisitingprofileVisitorsregistration.js";
import Webcamimage from "./ExistingWebcamprofileVisitorregistration.js";
import numberone from "./images/one.png";
import numberonenew from "./images/onenew.png";
import numberthree from "./images/three.png";
import numberthreenew from "./images/threenew.png";
import numbertwo from "./images/two.png";
import numbertwonew from "./images/twonew.png";
import wave from "./images/waving.png";
import uploadconfetti from "./images/wired-flat-1103-confetti.gif";
import "./visitors.css";
import { userStyle } from "./visitorstyle.js";

const LoadingBackdrop = ({ open }) => {
  return (
    <Backdrop
      sx={{ color: "#ffffff", zIndex: (theme) => theme.zIndex.drawer + 999 }}
      open={open}
    >
      <div className="pulsating-circle">
        <CircularProgress color="inherit" className="loading-spinner" />
      </div>
      <Typography
        variant="h6"
        sx={{ marginLeft: 2, color: "#ffffff", fontWeight: "bold" }}
      >
        please wait...
      </Typography>
    </Backdrop>
  );
};

function Visitorsregister() {


  const [overallSettings, setOverAllsettingsCount] = useState({});



  const fetchOverAllSettings = async () => {
    try {
      let res = await axios.get(`${SERVICE.GET_OVERALL_SETTINGS}`);
      setOverAllsettingsCount(res?.data?.overallsettings[0]);

    } catch (err) {
      const messages = err?.response?.data?.message
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
            <p style={{ fontSize: '20px', fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
            <p style={{ fontSize: '20px', fontWeight: 900 }}>{"something went wrong!"}</p>
          </>
        );
        handleClickOpenerr();
      }
    }
  }

  useEffect(() => {

    fetchOverAllSettings()

  }, []);
  const [isExistVisitor, setIsExistVisitor] = useState(false)
  const [refImagePerImage, setRefImagePerImage] = useState([])

  const [visitorLogData, setVisitorLogData] = useState([])

  const [vendor, setVendor] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    visitortype: "Please Select Visitor Type",
    visitormode: "Please Select Visitor Mode",
    date: "",
    prefix: "Mr", firstname: "", lastname: "", email: "",
    mobile: "", whatsapp: "", hostname: "Please Select HostName",
    visitorname: "",
    intime: "",
    visitorpurpose: "Please Select Visitor Purpose",
    visitorcontactnumber: "",
    visitoremail: "",
    visitorcompnayname: "",
    documenttype: "Please Select Document Type",
    documentnumber: "",
    meetingdetails: true,
    meetingpersonemployeename: "Please Select Employee Name",
    meetinglocationarea: "Please Select Area",
    escortinformation: true,
    escortdetails: "",
    equipmentborrowed: "",
    outtime: "",
    remark: "",
    phonecheck: false,
    followupaction: "Please Select Follow Up Action",
    followupdate: "",
    followuptime: "",
    visitorbadge: "",
    visitorsurvey: "",
  });



  const handleCloseModEdit = async (e, reason) => {
    setIsExistVisitor(true)
    setRefImagePerImage(e?.files)

    if (reason === "webcam") {
      console.log("Exisiting Visitor")
    } else {
      setVendor({
        ...vendor,
        company: e.company,
        branch: e.branch,
        unit: e.unit,
        visitortype: e.visitortype,
        visitormode: e.visitormode,
        prefix: "Mr",
        firstname: e.visitorfirstname || e.visitorname,
        lastname: e.visitorlastname || "",
        email: e.visitoremail,
        mobile: e.visitorcontactnumber,
        visitorpurpose: e.visitorpurpose,
        hostname: e.meetingpersonemployeename,
        whatsapp: e.visitorwhatsapp || "",
        visitorid: e.visitorid,
        visitorcommonid: e.visitorcommonid,
        _id: e._id,
        faceDescriptor: e.faceDescriptor
      })
      fetchInteractorPurpose(e.visitortype);
      fetchallEmployee(e.visitortype);
      setRefImage(newimage)
      // fetchInteractorPurpose(e.visitortype);

    }

    if (reason && reason === "backdropClick") return;
    handleCloseerrpop();

    let res = await axios.get(`${SERVICE.VISITORDETAILS_LOG_SINGLE}/${encodeURIComponent(e?.visitorid)}`, {
      // headers: {
      //   Authorization: `Bearer ${auth.APIToken}`,
      // },
    });

    setVisitorLogData(res?.data?.svisitordetailslog)

    setTimeout(() => {
      setNewimage("")
    }, 1000)

  };

  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

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

  const [isLoading, setIsLoading] = useState(false);
  const [btnUpload, setBtnUpload] = useState(false);
  const [newimage, setNewimage] = useState([])
  const [showDupProfileVIsitor, setShowDupProfileVIsitor] = useState();

  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const handleClickOpenerrpop = () => {
    setIsErrorOpenpop(true);
  };
  const handleCloseerrpop = () => {
    setIsErrorOpenpop(false);
  };

  const classes = useStyles();

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

  const [loadingdeloverall, setloadingdeloverall] = useState(false);

  const [visitorsTypeOption, setVisitorsTypeOption] = useState([]);
  const [visitorsPurposeOption, setVisitorsPurposeOption] = useState([]);



  const handleValidationfirstname = (e) => {
    let val = e.target.value;
    let numbers = new RegExp('[0-9]')
    var regExSpecialChar = /[ `₹!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (e.target.value.match(numbers)) {
      setShowAlert("Please enter characters only! (A-Z or a-z)")
      handleClickOpenerr();
      let num = val.length;
      let value = val.slice(0, num - 1)
      setVendor((prevState) => {
        return { ...prevState, firstname: value };
      })
    }
    else if (regExSpecialChar.test(e.target.value)) {
      setShowAlert("Please enter characters only! (A-Z or a-z)")
      handleClickOpenerr();
      let num = val.length;
      let value = val.slice(0, num - 1)
      setVendor((prevState) => {
        return { ...prevState, firstname: value };
      })
    }

  }

  const handleValidationlastname = (e) => {
    let val = e.target.value;
    let numbers = new RegExp('[0-9]')
    var regExSpecialChar = /[ `₹!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (e.target.value.match(numbers)) {
      setShowAlert("Please enter characters only! (A-Z or a-z)")
      handleClickOpenerr();
      let num = val.length;
      let value = val.slice(0, num - 1)
      setVendor((prevState) => {
        return { ...prevState, lastname: value };
      })
    }
    else if (regExSpecialChar.test(e.target.value)) {
      setShowAlert("Please enter characters only! (A-Z or a-z)")
      handleClickOpenerr();
      let num = val.length;
      let value = val.slice(0, num - 1)
      setVendor((prevState) => {
        return { ...prevState, lastname: value };
      })
    }

  }

  const [image, setImage] = useState([])


  const [refImage, setRefImage] = useState([]);
  const [previewURL, setPreviewURL] = useState(null);
  const [refImageDrag, setRefImageDrag] = useState([]);
  const [valNum, setValNum] = useState(0);

  const handleDeleteFile = (index) => {

    const newSelectedFiles = [...refImage];
    // const bgbtnArray = [...bgbtn]
    // const colorArray = [...color]
    newSelectedFiles.splice(index, 1);
    // bgbtnArray.splice(index, 1);
    // colorArray.splice(index, 1);
    setRefImage(newSelectedFiles);
    // setBgbtn(bgbtnArray)
    // setColor(colorArray)
  };



  const getPhoneNumber = () => {
    if (vendor.phonecheck) {
      setVendor({ ...vendor, whatsapp: vendor.mobile })
    } else {
      setVendor({ ...vendor, whatsapp: "" })
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


  const [file, setFile] = useState("");


  useEffect(
    () => {
      getPhoneNumber();
    }, [vendor.phonecheck]
  )



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



  const [buttonLoad, setButtonLoad] = useState(false);

  const backPage = useNavigate();



  const [educationDetails, setEducationDetails] = useState({
    school: "",
    department: "",
    degree: "",
    fromduration: "",
    toduration: "",
    pursuing: false,
  });
  const [educationtodo, setEducationtodo] = useState([]);

  const [experienceDetails, setExperienceDetails] = useState({
    occupation: "",
    company: "",
    summary: "",
    fromduration: "",
    toduration: "",
    currentlyworkhere: false,
  });
  const [experiencetodo, setExperiencetodo] = useState([]);



  const [cateCode, setCatCode] = useState([]);
  const [errors, setErrors] = useState({});
  const [vendorArray, setVendorArray] = useState([]);

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();

  const formatDateString = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // const username = isUserRoleAccess.username;

  const handleMobile = (e) => {
    if (e.length > 10) {
      setShowAlert("Mobile number can't more than 10 characters!")
      handleClickOpenerr();
      let num = e.slice(0, 10);
      setVendor({ ...vendor, mobile: num });
    }
  };

  const handleWhatsapp = (e) => {
    if (e.length > 10) {
      setShowAlert("Whats app number can't more than 10 characters!")
      handleClickOpenerr();
      let num = e.slice(0, 10);
      setVendor({ ...vendor, whatsapp: num })
    }
  }



  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
    setButtonLoad(false);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
    setloadingdeloverall(false)
  };

  const fetchInteractorType = async () => {
    try {
      let res_freq = await axios.get(SERVICE.ALL_MANAGETYPEPG, {
        // headers: {
        //   Authorization: `Bearer ${auth.APIToken}`,
        // },
      });
      setVisitorsTypeOption(
        res_freq?.data?.manageTypePG.map((t) => ({
          ...t,
          label: t.interactorstype,
          value: t.interactorstype,
        }))
      );
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something1 went wrong!"}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };
  const [assigninterview, setAssigninterview] = useState([])



  const [checkCandTrue, setCheckCandTrue] = useState()


  const fetchInteractorPurpose = async (e) => {
    try {
      let res = await axios.get(SERVICE.ALL_MANAGETYPEPG, {
        // headers: {
        //   Authorization: `Bearer ${auth.APIToken}`,
        // },
      });

      let result = res.data.manageTypePG.filter(
        (d) => d.interactorstype === e
      );

      let ans = result.flatMap((data) => data.interactorspurpose);
      // setCheckCandTrue(result.addcandidate == true ? result.addcandidate == true : ""
      // )
      const hasAddCandidate = result.some((item) => item.addcandidate === true);
      setCheckCandTrue(hasAddCandidate);

      setVisitorsPurposeOption(
        ans.map((d) => ({
          ...d,
          label: d,
          value: d,
        }))
      );
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              style={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              style={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something2  went wrong!"}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };
  useEffect(() => {
    fetchInteractorType()

  }, [])

  const [filterdemployee, setFilteredEmployee] = useState([]);
  const { company, branch, unit } = useParams()



  const fetchallEmployee = async (type) => {
    try {

      if (type.toLowerCase().includes("interview") && !type.toLowerCase().includes(" ")) {

        let res = await axios.post(SERVICE.ASSIGN_INTERVIEWER_VISITOR, {

          type: "Interviewer",
          fromcompany: company,
          frombranch: branch,

        });

        let filteruser = res.data.assigninterview.map(item => ({
          employee: item.employee?.toString(),
          unit: item.fromunit.toString(),
        }));

        filteruser = filteruser.map(d => ({
          ...d,
          label: d?.employee,
          value: d?.employee,
          unit: d.unit
        }))


        setFilteredEmployee(filteruser);

      } else if (type.toLowerCase().includes("hiring manager")) {

        // console.log(type.toLowerCase().includes("hiring manager"), "check")
        let res = await axios.post(SERVICE.ASSIGN_INTERVIEWER_VISITOR, {

          type: "Hiring Manager",
          fromcompany: company,
          frombranch: branch,



        });

        // console.log(res.data.assigninterview, "res.data.assignintervie")

        // let filteruser = res.data.assigninterview.map(item => item.employee).flat()
        // // console.log(filteruser, "filteruser")
        // filteruser = filteruser.map(d => ({
        //   ...d,
        //   label: d,
        //   value: d,
        //   unit: d.unit
        // }))

        let filteruser = res.data.assigninterview.map(item => ({
          employee: item.employee?.toString(),
          unit: item.fromunit.toString(),
        }));

        filteruser = filteruser.map(d => ({
          ...d,
          label: d?.employee,
          value: d?.employee,
          unit: d.unit
        }))

        setFilteredEmployee(filteruser);
      }
      else {
        let res = await axios.post(SERVICE.USER_VISITOR_REGISTER, {

          company: company,
          branch: branch,
          // unit: unit

        });

        let filteruser = res.data.users.map(d => ({
          ...d,
          label: d.companyname,
          value: d.companyname,
          unit: d.unit
        }))
        setFilteredEmployee(filteruser);

      }
    }
    catch (err) {
      console.log(err, "error")
    }

  }


  const fetchVendor = async () => {
    try {
      let res_vendor = await axios.get(SERVICE.ALL_VISITORS_FILTEREDID, {
        // headers: {
        //   Authorization: `Bearer ${auth.APIToken}`,
        // },
      });
      // setVendormaster(res_vendor?.data?.visitors);

      setCatCode(res_vendor?.data?.visitors);
      // setVendorArray(res_vendor?.data?.visitors);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      } else {

        handleClickOpenerr();
      }
    }
  };
  useEffect(() => {
    fetchallEmployee("host");
    fetchVendor();
  }, [])



  let name = "create";
  let nameedit = "edit";
  let allUploadedFiles = [];

  let newval = "VISIT#0001";

  let today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  const formattedToday = `${yyyy}-${mm}-${dd}`;
  let now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  let currtime = `${hours}:${minutes}`;

  const [allvisitor, setAllVisitor] = useState([])
  const [units, setUnits] = useState([])
  const [filteredUnits, setFilteredUnits] = useState([]);

  const [olduniqueid, setOldUnique] = useState(0)

  const fetchAssignedBy = async () => {
    try {
      let res_vendor = await axios.get(SERVICE.CANDIDATESALLCOUNT, {
        // headers: {
        //   Authorization: `Bearer ${auth.APIToken}`,
        // },
      });
      setOldUnique(res_vendor?.data?.candidates);
    } catch (err) {
      setButtonLoad(false);
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      } else {
        handleClickOpenerr();
      }
    }
  };

  const fetchAllVisitors = async () => {
    try {
      let res_vendor = await axios.get(SERVICE.ALL_VISITORS_REGISTER, {
        // headers: {
        //   Authorization: `Bearer ${auth.APIToken}`,
        // },
      });
      setAllVisitor(res_vendor?.data?.visitors);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      } else {
        handleClickOpenerr();
      }
    }
  };



  const fetchUnits = async () => {
    try {
      let res_unit = await axios.get(SERVICE.UNIT, {

      });
      setUnits(res_unit?.data?.units);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      }
      else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };


  useEffect(() => {
    const matchedUnits = units
      .filter(unit => unit.company === company && unit.branch === branch)
      .map(unit => unit.name)


    setFilteredUnits(matchedUnits);
  }, [filteredUnits]);



  useEffect(() => {
    fetchAssignedBy();
    fetchAllVisitors();
    fetchUnits();

  }, [])

  const [visitorCode, setVisitorCode] = useState("VISIT#0001");

  const fetchLastindexVendor = async () => {
    try {
      let res_vendor = await axios.get(SERVICE.LASTINDEX_VISITORS, {
        // headers: {
        //   Authorization: `Bearer ${auth.APIToken}`,
        // },
      });
      let refNo = res_vendor?.data?.visitor?.visitorid;
      let codenum = refNo.split("#");
      let prefixLength = Number(codenum[1]) + 1;
      let prefixString = String(prefixLength);
      let postfixLength =
        prefixString.length == 1
          ? `000${prefixString}`
          : prefixString.length == 2
            ? `00${prefixString}`
            : prefixString.length == 3
              ? `0${prefixString}`
              : prefixString.length == 4
                ? `0${prefixString}`
                : prefixString.length == 5
                  ? `0${prefixString}`
                  : prefixString.length == 6
                    ? `0${prefixString}`
                    : prefixString.length == 7
                      ? `0${prefixString}`
                      : prefixString.length == 8
                        ? `0${prefixString}`
                        : prefixString.length == 9
                          ? `0${prefixString}`
                          : prefixString.length == 10
                            ? `0${prefixString}`
                            : prefixString;

      let newval = "VISIT#" + postfixLength;
      setVisitorCode(newval);

      return newval;
    } catch (err) {
      if (err?.response?.data?.message === "Data not found!") {
      } else {
        const messages = err?.response?.data?.message;
        if (messages) {
          setShowAlert(
            <>
              {" "}
              <ErrorOutlineOutlinedIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />{" "}
              <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
            </>
          );
          handleClickOpenerr();
        } else {
          handleClickOpenerr();
        }
      }
    }
  };

  let uniqueid = olduniqueid ? Number(olduniqueid?.unique) : 0
  let idfinal = Number(uniqueid) + 1;

  const sendRequest = async (type, index) => {
    try {
      setloadingdeloverall(true);

      if (checkCandTrue) {
        const uniqueid = uuidv4()

        let addVendorDetails = await axios.post(SERVICE.CREATE_VISITORS, {
          checkout: false,
          unique: Number(idfinal),
          company: String(company),
          branch: String(branch),
          unit: String(vendor.unit),
          visitorid: String(newval),
          visitorcommonid: isExistVisitor ? vendor?.visitorcommonid : uniqueid,
          visitortype: String(vendor.visitortype),
          visitormode: "Walk-In",
          addcandidate: true,
          date: String(formattedToday),
          prefix: String(vendor.prefix),
          visitorname: String(vendor.firstname + " " + vendor.lastname),
          visitorfirstname: String(vendor.firstname),
          visitorlastname: String(vendor.lastname),
          visitorwhatsapp: String(vendor.whatsapp),
          visitorphonecheck: Boolean(vendor.phonecheck),
          intime: String(currtime),
          visitorpurpose: String(vendor.visitorpurpose),
          visitorcontactnumber: String(vendor.mobile),
          visitoremail: String(vendor.email),
          visitorcompnayname: "",
          documenttype: "",
          addvisitorin: Boolean(true),
          faceDescriptor:
            vendor?.faceDescriptor?.length > 0
              ? vendor?.faceDescriptor
              : [],
          documentnumber: "",
          meetingdetails: true,
          meetingpersoncompany:
            String(company),
          meetingpersonbranch:
            branch,
          meetingpersonunit:
            vendor.unit,
          meetingpersondepartment:
            "",
          meetingpersonteam:
            "",
          meetingpersonemployeename: "",
          meetinglocationcompany:
            company,
          meetinglocationbranch:
            branch,
          meetinglocationunit:
            vendor.unit,
          meetinglocationfloor:
            "",
          meetinglocationarea: "",
          escortinformation: true,
          escortdetails: "",
          equipmentborrowed: "",
          outtime:
            "",
          remark: "",
          followupaction: "",
          followupdate: "",
          followuptime: "",
          visitorbadge: "",
          visitorsurvey: "",
          detailsaddedy: String("Self /" + vendor.firstname + " " + vendor.lastname),
          files: allUploadedFiles
            .concat(refImage, refImageDrag, capturedImages),
          followuparray: [
            {
              visitortype: String(vendor.visitortype),
              visitormode: "Walk-In",
              visitorpurpose: String(vendor.visitorpurpose),
              meetingdetails: true,
              intime: String(currtime),

              meetingpersoncompany:
                String(company),
              meetingpersonbranch:
                String(branch),
              meetingpersonunit:
                vendor.unit,
              meetingpersondepartment:
                "",
              meetingpersonteam:
                "",
              meetingpersonemployeename: "",

              meetinglocationcompany:
                String(company),
              meetinglocationbranch:
                String(branch),
              meetinglocationunit:
                vendor.unit,
              meetinglocationfloor:
                "",
              meetinglocationarea:
                ""
              ,

              escortinformation: true,
              escortdetails: "",
              equipmentborrowed: "",
              outtime: "",
              remark: "",
              followupaction: "",
              followupdate: "",
              followuptime: "",
              visitorbadge: "",
              visitorsurvey: "",
            },
          ],
          interactorstatus: String("visitor"),
          addedby: [{ name: String(vendor.firstname), date: String(new Date()) }],
        });

        const resdata = await fetchLastindexVendor() || "VISIT#0001";

        let addVisitorProfileDetail = await axios.post(SERVICE.VISITORDETAILS_LOG_CREATE, {
          // headers: {
          //   Authorization: `Bearer ${auth.APIToken}`,
          // },
          visitorname: String(vendor.firstname + " " + vendor.lastname),
          visitorcontactnumber: String(vendor.mobile),
          visitoremail: String(vendor.email),
          materialcarrying: [],
          visitorcommonid: isExistVisitor ? vendor?.visitorcommonid : uniqueid,
          files: allUploadedFiles.concat(refImage, refImageDrag, capturedImages),
          addedby: [
            {
              name: String(vendor.firstname),
              date: String(new Date()),
            },
          ],
        });

        fetchAssignedBy();
        backPage(`/addcandidates/${idfinal}`)
        // window.location.href = `/addcandidates/${idfinal}`;

      } else {

        const uniqueid = uuidv4()

        let addVendorDetails = await axios.post(SERVICE.CREATE_VISITORS, {
          unique: Number(idfinal),
          checkout: false,
          company: String(company),
          branch: String(branch),
          unit: String(vendor.unit),
          visitorid: String(newval),
          visitorcommonid: isExistVisitor ? vendor?.visitorcommonid : uniqueid,
          visitortype: String(vendor.visitortype),
          visitormode: "Walk-In",
          addcandidate: true,
          date: String(formattedToday),
          prefix: String(vendor.prefix),
          visitorname: String(vendor.firstname + " " + vendor.lastname),
          intime: String(currtime),
          visitorpurpose: String(vendor.visitorpurpose),
          visitorcontactnumber: String(vendor.mobile),
          visitoremail: String(vendor.email),
          visitorcompnayname: "",
          documenttype: "",
          addvisitorin: Boolean(true),
          faceDescriptor:
            vendor?.faceDescriptor?.length > 0
              ? vendor?.faceDescriptor
              : [],
          documentnumber: "",
          meetingdetails: true,
          meetingpersoncompany:
            String(company),
          meetingpersonbranch:
            branch,
          meetingpersonunit:
            vendor.unit,
          meetingpersondepartment:
            "",
          meetingpersonteam:
            "",
          meetingpersonemployeename: "",
          meetinglocationcompany:
            company,
          meetinglocationbranch:
            branch,
          meetinglocationunit:
            "",
          meetinglocationfloor:
            "",
          meetinglocationarea: "",
          escortinformation: true,
          escortdetails: "",
          equipmentborrowed: "",
          outtime:
            "",
          remark: "",
          followupaction: "",
          followupdate: "",
          followuptime: "",
          visitorbadge: "",
          visitorsurvey: "",
          detailsaddedy: String("Self /" + vendor.firstname + " " + vendor.lastname),
          files: allUploadedFiles
            .concat(refImage, refImageDrag, capturedImages),
          followuparray: [
            {
              visitortype: String(vendor.visitortype),
              visitormode: "Walk-In",
              visitorpurpose: String(vendor.visitorpurpose),
              meetingdetails: true,
              intime: String(currtime),

              meetingpersoncompany:
                String(company),
              meetingpersonbranch:
                String(branch),
              meetingpersonunit:
                vendor.unit,
              meetingpersondepartment:
                "",
              meetingpersonteam:
                "",
              meetingpersonemployeename: "",

              meetinglocationcompany:
                String(company),
              meetinglocationbranch:
                String(branch),
              meetinglocationunit:
                "",
              meetinglocationfloor:
                "",
              meetinglocationarea:
                ""
              ,

              escortinformation: true,
              escortdetails: "",
              equipmentborrowed: "",
              outtime: "",
              remark: "",
              followupaction: "",
              followupdate: "",
              followuptime: "",
              visitorbadge: "",
              visitorsurvey: "",
            },
          ],
          interactorstatus: String("visitor"),
          addedby: [{ name: String(vendor.firstname + " " + vendor.lastname), date: String(new Date()) }],
        });

        let addVisitorProfileDetail = await axios.post(SERVICE.VISITORDETAILS_LOG_CREATE, {
          // headers: {
          //   Authorization: `Bearer ${auth.APIToken}`,
          // },
          visitorname: String(vendor.firstname + " " + vendor.lastname),
          visitorcontactnumber: String(vendor.mobile),
          visitoremail: String(vendor.email),
          materialcarrying: [],
          visitorcommonid: isExistVisitor ? vendor?.visitorcommonid : uniqueid,
          files: allUploadedFiles.concat(refImage, refImageDrag, capturedImages),
          addedby: [
            {
              name: String(vendor.firstname),
              date: String(new Date()),
            },
          ],
        });

        nextStep()

        setTimeout(() => {
          backPage(`/Checkinvisitor/${company}/${branch}`)
        }, 3000)
      }
      // }
      setVendor({
        ...vendor,
        visitorname: "",
        intime: "",
        visitorcontactnumber: "",
        visitoremail: "",
        visitorcompnayname: "",
        documentnumber: "",
        meetingdetails: true,
        escortinformation: true,
        escortdetails: "",
        equipmentborrowed: "",
        outtime: "",
        remark: "",
        followupdate: "",
        followuptime: "",
        visitorbadge: "",
        visitorsurvey: "",
      });
      setloadingdeloverall(false)
      setVisitorLogData([])
      setIsExistVisitor(false)

      // setShowAlert(
      //   <>
      //     <CheckCircleOutlineIcon
      //       sx={{ fontSize: "100px", color: "#7ac767" }}
      //     />
      //     <p style={{ fontSize: "20px", fontWeight: 900 }}>
      //       {"Added Successfully 👍"}
      //     </p>
      //   </>
      // );
      // handleClickOpenerr();

    } catch (err) {
      setButtonLoad(false);
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      } else {
        handleClickOpenerr();
      }
    }
  };

  // const handlesubmit = (e) => {

  //   setloadingdeloverall(true)

  // }

  function isValidEmail(email) {
    // Regular expression for a simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }


  const stepOne = () => {


    if (refImage?.length === 0) {
      setShowAlert("Please Upload Photograph");
      handleClickOpenerr();
    }
    else if (vendor.firstname == "") {
      setShowAlert("Please Enter First Name");
      handleClickOpenerr();
    }
    else if (!isExistVisitor && vendor.lastname == "") {
      setShowAlert("Please Enter Last Name");
      handleClickOpenerr();
    }
    else if (vendor.email == "") {
      setShowAlert("Please Enter Email");
      handleClickOpenerr();
    }
    else if ((!isValidEmail((vendor.email))) && vendor.email != "") {
      setShowAlert(
        <>
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter  Valid Email"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (vendor.mobile == "") {
      setShowAlert("Please Enter Mobile Number");
      handleClickOpenerr();
    }
    else if (vendor.mobile.length != 10) {
      setShowAlert("Please Enter Valid Mobile No!")
      handleClickOpenerr();
    }
    else if (vendor.whatsapp == "") {
      setShowAlert("Please Enter Whatsapp Number");
      handleClickOpenerr();
    }
    else if (vendor.whatsapp.length != 10) {
      setShowAlert("Please Enter Valid Whatsapp No !")
      handleClickOpenerr();
    }
    else if (vendor.visitortype === "Please Select Visitor Type") {
      setShowAlert("Please Select Visitor Type");
      handleClickOpenerr();
    }
    else if (vendor.visitorpurpose === "Please Select Visitor Purpose") {
      setShowAlert("Please Select Visitor Purpose");
      handleClickOpenerr();
    }
    else if (vendor.hostname === "Please Select HostName" || vendor.hostname === "") {
      setShowAlert("Please Select HostName");
      handleClickOpenerr();
    }

    else {
      nextStep();
    }
  };
  const handlesubmit = () => {

    if (capturedImages.length == 0 || capturedImages.some(d => d.preview === null || d.base64 === undefined)) {
      setShowAlert("Please Upload Webcam Image");
      handleClickOpenerr();
    }
    else {
      sendRequest()

    }
  };
  const stepThree = () => {
    nextStep();
  };
  const stepFour = () => {
    nextStep();
  };

  const [step, setStep] = useState(1);

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  {
    cateCode &&
      cateCode.map(() => {
        let strings = "VISIT#";
        let refNo = cateCode[cateCode.length - 1]?.visitorid;
        let digits = (cateCode.length + 1).toString();
        const stringLength = refNo.length;
        let lastChar = refNo.charAt(stringLength - 1);
        let getlastBeforeChar = refNo.charAt(stringLength - 2);
        let getlastThreeChar = refNo.charAt(stringLength - 3);
        let getlastFourChar = refNo.charAt(stringLength - 4);
        let lastBeforeChar = refNo.slice(-2);
        let lastThreeChar = refNo.slice(-3);
        let lastDigit = refNo.slice(-4);

        let refNOINC = parseInt(lastChar) + 1;
        let refLstTwo = parseInt(lastBeforeChar) + 1;
        let refLstThree = parseInt(lastThreeChar) + 1;
        let refLstDigit = parseInt(lastDigit) + 1;

        if (digits.length < 4 && Number(getlastFourChar) == 0 && Number(getlastBeforeChar) == 0 && Number(getlastThreeChar) == 0) {
          refNOINC = ("000" + refNOINC);
          newval = strings + refNOINC;
        } else if (digits.length < 4 && Number(getlastFourChar) == 0 && Number(getlastBeforeChar) == 0 && Number(getlastThreeChar) > 0) {
          refNOINC = ("00" + refLstTwo);
          newval = strings + refNOINC;
        }
        else if (digits.length < 4 && Number(getlastThreeChar) > 0 && Number(getlastThreeChar) < 9 && Number(getlastFourChar) == 0) {
          refNOINC = ("0" + refLstThree);
          newval = strings + refNOINC;
        }

        else if (getlastFourChar != 0) {
          refNOINC = (refLstDigit);
          newval = strings + refNOINC;
        }
      })
  }

  // Image Upload
  useEffect(() => {
    const loadModels = async () => {
      const modelUrl = SERVICE.FACEDETECTLOGINMODEL;
      await faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl);
      await faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl);
      await faceapi.nets.faceRecognitionNet.loadFromUri(modelUrl);
    };
    loadModels();
  }, []);

  function handleChangeImage(e) {
    setIsLoading(true);
    setBtnUpload(true); // Enable loader when the process starts
    const maxFileSize = 1 * 1024 * 1024; // 1MB in bytes
    // Get the selected file
    const file = e.target.files[0];
    if (file && file.size < maxFileSize) {
      const path = URL.createObjectURL(file);
      const image = new Image();
      image.src = path;
      const NewData = []
      NewData.push({
        name: file.name,
        size: file.size,
        type: file.type,
        preview: path,
        base64: path.split(",")[1],
      });
      setNewimage(NewData);
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
                // headers: {
                //   Authorization: `Bearer ${auth.APIToken}`,
                // },
                faceDescriptor: Array.from(faceDescriptor),
              }
            );
            if (response?.data?.matchfound) {

              setIsLoading(false);
              // setUploadwithDupImage(e)
              setShowDupProfileVIsitor(response?.data?.matchedData);
              handleClickOpenerrpop();
            } else {

              const files = e.target.files;
              let newSelectedFiles = [...refImage];
              for (let i = 0; i < files.length; i++) {
                const file = files[i];

                if (file.type.startsWith("image/")) {
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
                    const base64Data = reader.result.split(",")[1]; // Get base64 data (without the prefix)
                    const binaryData = atob(base64Data); // Decode base64 data
                    const arrayBuffer = new ArrayBuffer(binaryData.length);
                    const uint8Array = new Uint8Array(arrayBuffer);
                    // Fill the array buffer with the decoded binary data
                    for (let i = 0; i < binaryData.length; i++) {
                      uint8Array[i] = binaryData.charCodeAt(i);
                    }
                    // Create a Blob from the binary data
                    const blob = new Blob([uint8Array], { type: 'image/png' });
                    setImage((prev) => [...prev, blob]);
                    // setBgbtn((prev) => {
                    //   let availed = [...prev]
                    //   if (availed.length > 0) {
                    //     availed.push(false)
                    //   } else {
                    //     Array(newSelectedFiles.length).fill(false)
                    //   }
                    //   return availed;
                    // })
                    // setColor((prev) => {
                    //   let availed = [...prev];

                    //   // Check if there are any existing colors in the state
                    //   if (availed.length > 0) {
                    //     availed.push("#ffffff");
                    //   } else {
                    //     // If no colors are present, create a new array with default colors
                    //     availed = Array(newSelectedFiles.length).fill("#ffffff");
                    //   }
                    //   // Calculate luminance for the updated array of colors
                    //   const updated = availed.map((color) => calculateLuminance(color));
                    //   // Update the state for color and light color
                    //   setIsLightColor(updated);
                    //   return availed;
                    // });
                  };
                  reader.readAsDataURL(file);
                }
              }
              toDataURL(path, function (dataUrl) {
                setVendor({
                  ...vendor,
                  uploadedimage: String(dataUrl),
                  faceDescriptor: Array.from(faceDescriptor),
                });
              });
            }
            setIsLoading(false);
          } else {
            setIsLoading(false);
            setShowAlert("No face detected!");
            handleClickOpenerr();
          }
        } catch (error) {
          setIsLoading(false);
          setShowAlert("Error in face detection!");
          handleClickOpenerr();
        } finally {

          setIsLoading(false);
          setBtnUpload(false); // Disable loader when done
        }
      };

      image.onerror = (err) => {
        setShowAlert("Error loading image!");
        handleClickOpenerr();
        setBtnUpload(false); // Disable loader in case of error
      };

      setFile(URL.createObjectURL(file));
    } else {
      setIsLoading(false);
      if (file !== undefined) {
        setShowAlert("File size is greater than 1MB, please upload a file below 1MB.!");
        handleClickOpenerr();
        setBtnUpload(false);
      }
    }
  }


  const renderStepOne = () => {
    return (
      <>
        <Box>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography sx={{ color: "#171A1C", fontWeight: 700, fontFamily: "JostMedium", fontSize: { md: "25px", sm: "25px", xs: "22px" } }}>Visitor Registration</Typography>
          </Box>
          <br />
          <Grid container spacing={2} >
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <br />
              <FormControl size="small" fullWidth>
                <Typography
                  sx={{
                    color: "black",
                    fontFamily: " League Spartan, sans-serif",
                    fontsize: "30px",
                  }}
                >
                  {" "}
                  <b>Photograph</b> <b style={{ color: "red" }}>*</b>
                </Typography>
                <Grid sx={{ display: "flex" }}>
                  {/* {showUploadBtn ? ( */}
                  <Button
                    variant="contained"
                    component="label"
                  // sx={buttonStyles.buttonsubmit}
                  >
                    Upload
                    <input
                      type="file"
                      multiple
                      id="productimage"
                      accept="image/*"
                      hidden
                      onChange={handleChangeImage}
                    />
                  </Button>
                  &ensp;

                </Grid>
              </FormControl>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
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
                      {/* <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {/* Color Picker 
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
                            value={color[index]}
                            onChange={(e) => { handleColorChange(e, index) }}
                            style={{
                              width: '30px',
                              height: '30px',
                              border: 'none',
                              cursor: 'pointer',
                              borderRadius: '5px',
                            }}
                          />
                        </div>

                        {/* Submit Button 
                        <LoadingButton
                          onClick={(e) => { handleSubmitNew(index, "upload") }}
                          loading={bgbtn[index]}
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
                            color: isLightColor[index] ? 'black' : 'white',
                            fontWeight: '600',
                            backgroundColor: color[index], // Dynamically set the background color
                            '&:hover': {
                              backgroundColor: `${color[index]}90`, // Slightly transparent on hover for a nice effect
                            },
                            border: '1px solid  black'
                          }}
                        >

                        </LoadingButton>
                      </div> */}
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>

            <Grid item lg={12} md={12} xs={12} sm={12}>
              <Typography
                sx={{
                  color: "black",
                  fontFamily: " League Spartan, sans-serif",
                  fontsize: "30px",
                }}
              >
                {" "}
                <b>First Name</b> <b style={{ color: "red" }}>*</b>:
              </Typography>
              <Grid container>

                <Grid item md={3} sm={3} xs={3}>

                  < FormControl size="small" fullWidth>
                    <Select
                      placeholder="Mr."
                      value={vendor.prefix}
                      onChange={(e) => {
                        setVendor({ ...vendor, prefix: e.target.value });
                      }}
                      disabled={isExistVisitor}
                      sx={{
                        backgroundColor: "#E3E3E3",
                      }}
                    >
                      <MenuItem value="Mr">Mr</MenuItem>
                      <MenuItem value="Ms">Ms</MenuItem>
                      <MenuItem value="Mrs">Mrs</MenuItem>
                    </Select>
                  </FormControl>


                </Grid>

                <Grid item md={9} sm={9} xs={9}>
                  <FormControl size="small" fullWidth>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      style={{
                        backgroundColor: "#E3E3E3", // Background color
                      }}
                      disabled={isExistVisitor}
                      value={vendor.firstname}
                      onChange={(e) => {
                        setVendor({
                          ...vendor,
                          firstname: e.target.value,
                        });
                        handleValidationfirstname(e)
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={12} md={12} xs={12} sm={12}>
              <Typography
                sx={{
                  color: "black",
                  fontFamily: " League Spartan, sans-serif",
                  fontsize: "30px",
                }}
              >
                {" "}
                <b>Last Name</b>
                <b style={{ color: "red" }}>*</b>:&emsp;
              </Typography>
              <FormControl size="small" fullWidth>
                <OutlinedInput
                  style={{
                    backgroundColor: "#E3E3E3", // Background color
                  }}
                  disabled={isExistVisitor}
                  id="component-outlined"
                  type="text"
                  value={vendor.lastname}
                  onChange={(e) => {
                    setVendor({
                      ...vendor,
                      lastname: e.target.value,
                    });
                    handleValidationlastname(e)
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item lg={12} md={12} xs={12} sm={12}>
              <Typography
                sx={{
                  color: "black",
                  fontFamily: " League Spartan, sans-serif",
                  fontsize: "30px",
                }}
              >
                {" "}
                <b> Email</b> <b style={{ color: "red" }}>*</b>:&emsp;
              </Typography>
              <FormControl size="small" fullWidth>
                <OutlinedInput
                  style={{
                    backgroundColor: "#E3E3E3", // Background color
                  }}
                  id="component-outlined"
                  type="email"
                  value={vendor.email}
                  onChange={(e) => {
                    setVendor({
                      ...vendor,
                      email: e.target.value,
                    });
                    // setIsValidEmail(validateEmail(e.target.value));
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item lg={12} md={12} xs={12} sm={12}>
              <Typography
                sx={{
                  color: "black",
                  fontFamily: " League Spartan, sans-serif",
                  fontsize: "30px",
                }}
              >
                {" "}
                <b> Mobile</b> <b style={{ color: "red" }}>*</b>:&emsp;
              </Typography>
              <FormControl size="small" fullWidth>
                <OutlinedInput
                  style={{
                    backgroundColor: "#E3E3E3", // Background color
                  }}
                  id="component-outlined"
                  type="number"
                  value={vendor.mobile}
                  onChange={(e) => {
                    setVendor({
                      ...vendor,
                      mobile: e.target.value,
                    });
                    handleMobile(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>


            <Grid item lg={12} md={12} xs={12} sm={12} sx={{ marginRight: "40px" }}
            >
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      sx={{}}
                      checked={vendor.phonecheck}
                      onChange={(e) =>
                        setVendor({
                          ...vendor,
                          phonecheck: !vendor.phonecheck,
                        })
                      }
                    />
                  }
                  label="Same as Whatsapp number"
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      fontFamily: " League Spartan, sans-serif",
                      color: "black",
                      fontsize: "30px", // Change this value to adjust the font size
                    },
                  }}
                />
              </FormGroup>

            </Grid>

            <Grid item lg={12} md={12} xs={12} sm={12}>
              <Typography
                sx={{
                  color: "black",
                  fontFamily: " League Spartan, sans-serif",
                  fontsize: "30px",
                }}
              >
                {" "}
                <b> Whatsapp</b> <b style={{ color: "red" }}>*</b>:&emsp;
              </Typography>
              <FormControl size="small" fullWidth>
                <OutlinedInput
                  style={{
                    backgroundColor: "#E3E3E3", // Background color
                  }}
                  id="component-outlined"
                  type="number"
                  value={vendor.whatsapp}
                  onChange={(e) => {
                    setVendor({
                      ...vendor,
                      whatsapp: e.target.value,
                    });
                    handleWhatsapp(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item lg={12} md={12} xs={12} sm={12}>
              <Typography
                sx={{
                  color: "black",
                  fontFamily: " League Spartan, sans-serif",
                  fontsize: "30px",
                }}
              >
                {" "}
                <b>Visitor Type</b>
                <b style={{ color: "red" }}>*</b>:&emsp;
              </Typography>
              <FormControl fullWidth size="small">
                <Typography>
                </Typography>
                <Selects
                  maxMenuHeight={300}
                  style={{
                    backgroundColor: "#E3E3E3", // Background color
                  }}
                  options={visitorsTypeOption}
                  placeholder="Please Select Visitor Type"
                  value={{
                    label: vendor.visitortype,
                    value: vendor.visitortype,
                  }}
                  onChange={(e) => {
                    setVendor({
                      ...vendor,
                      visitortype: e.value,
                      visitorpurpose: "Please Select Visitor Purpose",
                      hostname: "Please Select HostName"
                    });
                    fetchInteractorPurpose(e.value);
                    fetchallEmployee(e.value);
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item lg={12} md={12} xs={12} sm={12}>
              <Typography
                sx={{
                  color: "black",
                  fontFamily: " League Spartan, sans-serif",
                  fontsize: "30px",
                }}
              >
                <b>Visitor Purpose</b>
                <b style={{ color: "red" }}>*</b>:&emsp;
              </Typography>
              <FormControl fullWidth size="small">
                <Typography>
                </Typography>
                <Selects
                  maxMenuHeight={300}
                  options={visitorsPurposeOption}
                  placeholder="Please Select Visitor Purpose"
                  value={{
                    label: vendor.visitorpurpose,
                    value: vendor.visitorpurpose,
                  }}
                  onChange={(e) => {
                    setVendor({
                      ...vendor,
                      visitorpurpose: e.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item lg={12} md={12} xs={12} sm={12}>
              <Typography
                sx={{
                  color: "black",
                  fontFamily: " League Spartan, sans-serif",
                  fontsize: "30px",

                }}
              >
                {" "}
                <b> Host Name</b> <b style={{ color: "red" }}>*</b>:&emsp;
              </Typography>
              <FormControl fullWidth size="small">

                <Selects
                  maxMenuHeight={120}
                  options={filterdemployee}
                  value={{
                    label: vendor.hostname,
                    value: vendor.hostname,
                  }}
                  onChange={(e) => {
                    setVendor({
                      ...vendor,
                      hostname: e.value,
                      unit: e.unit,
                    });
                  }}
                />
              </FormControl>
            </Grid>

            <br />
            <Grid item lg={12} md={12} xs={12} sm={12} sx={{ display: "flex", justifyContent: "end" }}>
              <Button
                className="next"
                size="small"
                variant="contained"
                sx={{ ...userStyle.nextbutton, width: "100px", marginRight: 0 }}
                onClick={() => { stepOne() }}
              >
                <b>Next</b> &emsp;
                <EastIcon
                  sx={{
                    "@media only screen and (max-width: 900px)": {
                      fontSize: "medium",
                    },
                  }}
                />
              </Button>
            </Grid>
            <br />
            <Grid container marginTop={2}>
              <Footer />
            </Grid>
          </Grid>
        </Box >
      </>
    );
  };
  const renderStepTwo = () => {
    return (
      <>
        <Box>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography sx={{ color: "#171A1C", fontWeight: 700, fontFamily: "JostMedium", fontSize: { md: "25px", sm: "25px", xs: "22px" } }}>   Photographic Verification</Typography>
          </Box>
          <br />
          <Grid container >
            <Grid item lg={12} md={12} xs={12} sm={12}>

              <Typography
                style={{
                  color: "black",
                  fontFamily: "League Spartan, sans-serif",
                  fontSize: "20px",
                }}
              >
                Web Camera <b style={{ color: "red" }}>*</b>
              </Typography>
            </Grid>
            <br />
            <Grid item lg={12} md={12} xs={12} sm={12} marginTop={2}>
              <Box sx={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
                <Webcamimage
                  name={name}
                  getImg={getImg}
                  setGetImg={setGetImg}
                  valNum={valNum}
                  setValNum={setValNum}
                  capturedImages={capturedImages}
                  setCapturedImages={setCapturedImages}
                  // setRefImage={setRefImage}
                  setRefImageDrag={setRefImageDrag}
                  setVendor={setVendor}
                  vendor={vendor}
                  handleCloseModEdit={handleCloseModEdit}
                  setNewimage={setNewimage}
                />
              </Box>


            </Grid>
            <br />
            <Grid item lg={12} md={12} xs={12} sm={12} marginTop={2} sx={{ display: "flex", justifyContent: "space-between" }}>

              <Button variant="contained" type="submit"
                onClick={prevStep}>
                {" "}
                <WestIcon
                  sx={{
                    "@media only screen and (max-width: 900px)": {
                      fontSize: "medium",
                    },
                  }}
                />
                &emsp; <b>Previous</b>
              </Button>

              <LoadingButton
                onClick={handlesubmit}
                // onClick={(e) => { handlesubmit(e); }}
                loading={loadingdeloverall}
                color="primary"
                loadingPosition="end"
                variant="contained"
              >
                Submit
              </LoadingButton>
            </Grid>
            <br />

            <Grid item lg={12} md={12} xs={12} sm={12} marginTop={2}>
              <Footer />
            </Grid>

          </Grid>
        </Box>
      </>
    );
  };
  const renderStepThree = () => {
    return (
      <>
        <Box>
          <Typography sx={userStyle.heading}>Check In Details</Typography>
          <br />
          <Grid container spacing={5} >
            <Grid item lg={10} md={10} xs={12} sm={12}>
              <Box >
                <Grid container spacing={2}>
                  <Grid item md={3} sm={3} lg={3}></Grid>
                  <Grid item md={6} sm={10} lg={10}>
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          fontSize: "40px",
                          color: "black",
                          fontFamily: " League Spartan, sans-serif",
                        }}
                      >
                        Welcome :
                      </Typography>
                    </Box>
                    <br />

                    <Box
                      sx={{
                        borderRadius: "10px",
                        justifyContent: "center",
                        padding: "20px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        // height: "180px",
                      }}
                    >
                      <Box>
                        <img
                          style={{
                            height: "300px",
                            width: "300px",
                          }}
                          src={uploadconfetti}
                          alt=""
                        />{" "}
                      </Box>

                      <Box>
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            fontSize: "50px",
                            color: "black",
                            fontFamily: " League Spartan, sans-serif",
                          }}
                        >
                          Check In Successfully
                        </Typography>
                      </Box>
                      <br />
                      <Footer />
                    </Box>
                  </Grid>
                  <Grid item md={3} sm={3} lg={3}></Grid>
                </Grid>
              </Box>
            </Grid>

            <br />
          </Grid>
        </Box>
      </>
    );
  };


  const [steperDisplay, setSteperDisplay] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // setIsMobile(window.innerWidth <= 900);
      // setIsMobile1(window.innerWidth <= 900);
      setSteperDisplay(window.innerWidth <= 900);
    };
    handleResize(); // Call the handleResize function once to set the initial state
    window.addEventListener("resize", handleResize); // Listen for window resize events
    return () => {
      window.removeEventListener("resize", handleResize); // Clean up the event listener on component unmount
    };
  }, []);

  const renderIndicator = () => {
    return (
      <Box>
        {steperDisplay ? (
          <Grid container spacing={2}>
            <>
              <Grid
                item
                lg={3}
                md={3}
                sm={12}
                xs={12}
                className="indicatorvertical"
                sx={{
                  height: "100%",
                  position: "relative",
                  top: "0",
                  flexDirection: "column",
                }}
              >
                <Grid item sx={{ marginTop: "50px" }}></Grid>
                <Grid
                  item
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <img
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      height: "80px",
                      width: "80px",
                    }}
                    // src={hilife}
                    src={overallSettings?.companylogo}
                  />
                </Grid>
                <Grid item sx={{ marginTop: "10px" }}></Grid>

                <Grid
                  item
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Typography
                    sx={{
                      color: "white",
                      fontFamily: " League Spartan, sans-serif",
                      fontsize: "32px",
                    }}
                  >
                    {" "}
                    Visitor Registration{" "}
                  </Typography>
                </Grid>
                <Grid item sx={{ marginTop: "30px" }}></Grid>

                <Grid
                  item
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <ul style={{ marginLeft: "45px" }}>
                    <li
                    //  className={step === 1 ? "active" : null}
                    >
                      <Grid
                        container
                        spacing={2}
                        sx={{ display: "flex", flexDirection: "Row" }}
                      >
                        <Grid item>
                          {step === 1 ? <img src={numberonenew} /> : null}
                        </Grid>
                        <Grid item>
                          {step === 1 ? (
                            <Typography
                              sx={{
                                fontFamily: " League Spartan, sans-serif",
                                fontsize: "32px",
                              }}
                            >
                              {" "}
                              Visitor Information
                            </Typography>
                          ) : null}
                        </Grid>
                      </Grid>

                      {/* <Grid
                        style={{
                          borderLeft: "2px dashed",
                          marginLeft: "16px",
                          height: "70px",
                        }}
                      ></Grid> */}
                      <Grid
                        container
                        spacing={2}
                        sx={{ display: "flex", flexDirection: "Row" }}
                      >
                        <Grid item>
                          {step === 2 ? <img src={numbertwonew} /> : null}
                        </Grid>
                        <Grid item>
                          {step === 2 ? (
                            <Typography
                              sx={{
                                fontFamily: " League Spartan, sans-serif",
                                fontsize: "32px",
                              }}
                            >
                              {" "}
                              Photographic Verification
                            </Typography>
                          ) : null}
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        spacing={2}
                        sx={{ display: "flex", flexDirection: "Row" }}
                      >
                        <Grid item>
                          {step === 3 ? <img src={numberthreenew} /> : null}
                        </Grid>
                        <Grid item>
                          {step === 3 ? (
                            <Typography
                              sx={{
                                fontFamily: " League Spartan, sans-serif",
                                fontsize: "32px",
                              }}
                            >
                              {" "}
                              Check In Details
                            </Typography>
                          ) : null}
                        </Grid>
                      </Grid>
                    </li>
                  </ul>
                </Grid>
              </Grid>
              <Grid item lg={9} md={9} sm={12} xs={12} sx={{ padding: { lg: "20px 150px !important", md: "20px 150px !important", sm: "20px 80px !important", xs: "20px 50px !important" } }}>
                {step === 1 ? renderStepOne() : null}
                {step === 2 ? renderStepTwo() : null}
                {step === 3 ? renderStepThree() : null}
              </Grid>
            </>
          </Grid>
        ) : (
          <>
            <Grid container spacing={2}>
              <Grid
                item
                lg={3}
                md={3}
                sm={12}
                xs={12}
                className="indicatorwebsite"
                sx={{
                  position: "sticky",
                  height: "100%",
                  top: "0",
                  flexDirection: "column",
                }}
              >
                <Grid item sx={{ marginTop: "50px" }}></Grid>
                <Grid
                  item
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <img
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      height: "158px",
                      width: "158px",
                    }}
                    // src={hilife}
                    src={overallSettings?.companylogo}

                  />
                </Grid>
                <Grid item sx={{ marginTop: "30px" }}></Grid>

                <Grid
                  item
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Typography
                    sx={{
                      color: "white",
                      fontFamily: " League Spartan, sans-serif",
                      fontsize: "30px",
                    }}
                  >
                    {" "}
                    Visitor Registration{" "}
                  </Typography>
                </Grid>
                <Grid item sx={{ marginTop: "70px" }}></Grid>

                <Grid
                  item
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <ul style={{ marginLeft: "45px" }}>
                    <li
                    //  className={step === 1 ? "active" : null}
                    >
                      <Grid
                        container
                        spacing={2}
                        sx={{
                          display: "flex",
                          flexDirection: "Row",
                          "@media only screen and (max-width: 1215px)": {
                            flexDirection: "Row",
                          },
                        }}
                      >
                        <Grid item>
                          {step === 1 ? (
                            <img src={numberonenew} />
                          ) : (
                            <img src={numberone} />
                          )}
                        </Grid>
                        <Grid item>
                          <Typography
                            sx={{
                              fontFamily: " League Spartan, sans-serif",
                              fontsize: "32px",
                            }}
                          >
                            {" "}
                            visitor Information
                          </Typography>
                        </Grid>
                      </Grid>

                      <Grid
                        item
                        style={{
                          borderLeft: "2px dashed",
                          marginLeft: "16px",
                          height: "70px",
                        }}
                      ></Grid>
                      <Grid
                        container
                        spacing={2}
                        sx={{
                          display: "flex",
                          flexDirection: "Row",
                          "@media only screen and (max-width: 1215px)": {
                            flexDirection: "Row",
                          },
                        }}
                      >
                        <Grid item>
                          {step === 2 ? (
                            <img src={numbertwonew} />
                          ) : (
                            <img src={numbertwo} />
                          )}
                        </Grid>
                        <Grid item>
                          <Typography
                            sx={{
                              fontFamily: " League Spartan, sans-serif",
                              fontsize: "32px",
                            }}
                          >
                            {" "}
                            Photographic Verification
                          </Typography>
                        </Grid>
                      </Grid>

                      <Grid
                        item
                        style={{
                          borderLeft: "2px dashed",
                          marginLeft: "16px",
                          height: "70px",
                        }}
                      ></Grid>
                      <Grid
                        container
                        spacing={2}
                        sx={{
                          display: "flex",
                          flexDirection: "Row",
                          "@media only screen and (max-width: 1215px)": {
                            flexDirection: "Row",
                          },
                        }}
                      >
                        <Grid item>
                          {step === 3 ? (
                            <img src={numberthreenew} />
                          ) : (
                            <img src={numberthree} />
                          )}
                        </Grid>
                        <Grid item>
                          <Typography
                            sx={{
                              fontFamily: " League Spartan, sans-serif",
                              fontsize: "32px",
                            }}
                          >
                            {" "}
                            check In Details
                          </Typography>
                        </Grid>
                      </Grid>
                    </li>
                  </ul>
                </Grid>
              </Grid>

              <Grid item lg={9} md={9} sm={12} xs={12} sx={{ padding: { lg: "20px 150px !important", md: "20px 150px", sm: "20px 80px", xs: "20px 50px" } }}>
                {step === 1 ? renderStepOne() : null}
                {step === 2 ? renderStepTwo() : null}
                {step === 3 ? renderStepThree() : null}
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    );
  };

  const [openviewed, setOpenviewed] = useState(false);
  const handleClickOpenviewed = () => {
    setOpenviewed(true);
  };
  const handleCloseviewed = () => {
    setOpenviewed(false);
  };

  return (
    <>
      <GlobalStyles
        styles={{
          "@import":
            "url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@100..900&display=swap')",
          body: {
            fontFamily: "League Spartan, sans-serif",
          },
        }}
      />
      <>{renderIndicator()}</>

      {/* <Headtitle title={"ADD VISITORS"} /> */}

      {/* ALERT DIALOG */}

      <Dialog
        open={openviewed}
        onClose={handleClickOpenviewed}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
      >
        {/* <Box sx={{ padding: "20px" }}> */}
        <Grid container spacing={2}>
          <Grid item lg={12} md={12}>
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: "50px",
                color: "black",
                textAlign: "center",
                alignitems: "center",
                fontFamily: " League Spartan, sans-serif",
              }}
            >
              Check Out Details
            </Typography>
          </Grid>

          <Grid item lg={12} md={12}>
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: "40px",
                color: "black",
                fontFamily: " League Spartan, sans-serif",
                marginLeft: "15px",
              }}
            >
              Bye{" "}
              <img
                style={{
                  marginRight: "3px",
                  height: "40px",
                  width: "40px",
                }}
                src={wave}
              />{" "}
              !
            </Typography>
          </Grid>
          <br />
          <Grid
            item
            lg={12}
            md={12}
            sx={{ justifyContent: "center", alignItems: "center" }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                style={{
                  height: "200px",
                  width: "200px",
                  textAlign: "center",
                }}
                src={uploadconfetti}
                alt=""
              />{" "}
            </Box>
          </Grid>
          <Grid item lg={1} md={1}></Grid>
          <Grid
            item
            lg={12}
            md={12}
            sm={12}
            sx={{ justifyContent: "center", alignItems: "center" }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: "30px",
                color: "black",
                textAlign: "center",
                alignitems: "center",
                fontFamily: " League Spartan, sans-serif",
              }}
            >
              Check Out Successfully
            </Typography>
          </Grid>
          {/* </Grid> */}
          {/* </Grid> */}
          <Grid item md={1}></Grid>
          <Grid item lg={12} md={12}>
            {/* <Footer /> */}
            {
              localStorage.length === 0 &&
              <Footer />
            }
          </Grid>
        </Grid>
        {/* </Box> */}
      </Dialog>

      {/* Table For Duplicate Profile Upload */}
      <Box>
        {/* Edit DIALOG */}
        <Dialog open={isErrorOpenpop} onClose={handleCloseerrpop}
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
                    handleCloseModEdit={handleCloseModEdit}
                  />
                ) : (
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
                    justifyContent: "flex-start",
                    gap: "15px",
                  }}
                >
                  {/* <Button
                    style={{
                      padding: "7px 13px",
                      color: "white",
                      background: "rgb(25, 118, 210)",
                      ...buttonStyles?.buttonsubmit
                    }}
                    onClick={() => {
                      // sendRequestEdit();
                      UploadWithDuplicate(uploadwithDupImage, "upload")
                    }}
                  >
                    Upload
                  </Button> */}
                  <Button variant="contained" onClick={handleCloseerrpop}>
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </Dialog>
      </Box>

      <Dialog
        open={isErrorOpen}
        onClose={handleCloseerr}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'tomato' }} />
          <Typography variant="h6" sx={{ fontFamily: "JostMedium", fontWeight: "bold" }}>{showAlert}</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="error" sx={{ color: 'tomato' }} onClick={handleCloseerr} >ok</Button>
        </DialogActions>
      </Dialog>
      <LoadingBackdrop open={isLoading} />

    </>
  );
}
export default Visitorsregister;