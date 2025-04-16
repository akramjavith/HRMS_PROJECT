import React, { useState, useEffect } from "react";
import { userStyle, useraccessStyle } from "./visitorstyle.js";
import { GlobalStyles } from "@mui/material";
import Webcamimage from "./Webcamimageasset";
import "bootstrap-icons/font/bootstrap-icons.css";
import Footer from "../components/footer/footer.js";
import "./visitors.css";
import hilife from "./images/+-removebg-preview-removebg-preview.png";
import uploadconfetti from "./images/wired-flat-1103-confetti.gif";
import numberone from "./images/one.png";
import numberonenew from "./images/onenew.png";
import numbertwo from "./images/two.png";
import numbertwonew from "./images/twonew.png";
import numberthree from "./images/three.png";
import numberthreenew from "./images/threenew.png";
import Selects from "react-select";
import wave from "./images/waving.png";
import EastIcon from "@mui/icons-material/East";
import WestIcon from "@mui/icons-material/West";
import "jspdf-autotable";
import axios from "axios";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate, useParams, Link } from "react-router-dom";
import { SERVICE } from "../services/Baseservice";
import LoadingButton from "@mui/lab/LoadingButton";

import {
  FormGroup,
  OutlinedInput,
  Checkbox,
  Dialog,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControlLabel,
  Box,
  FormControl,
  Typography,
  Grid,
  Button,
} from "@mui/material";
import { makeStyles } from "@material-ui/core";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";



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





  const [loadingdeloverall, setloadingdeloverall] = useState(false);

  const [visitorsTypeOption, setVisitorsTypeOption] = useState([]);
  const [visitorsPurposeOption, setVisitorsPurposeOption] = useState([]);

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


  const [refImage, setRefImage] = useState([]);
  const [previewURL, setPreviewURL] = useState(null);
  const [refImageDrag, setRefImageDrag] = useState([]);
  const [valNum, setValNum] = useState(0);


  const getPhoneNumber = () => {
    if (vendor.phonecheck) {
      setVendor({ ...vendor, whatsapp: vendor.mobile })
    } else {
      setVendor({ ...vendor, whatsapp: "" })
    }
  }

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

  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const handleClickOpenalert = () => {
    setIsDeleteOpenalert(true);
  };

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

  const educationTodo = () => {
    if (
      educationDetails.school == "" &&
      educationDetails.department == "" &&
      educationDetails.degree == ""
    ) {
      setShowAlert("Please Enter Atleast one field!");
      handleClickOpenerr();
    } else if (educationDetails !== "") {
      setEducationtodo([...educationtodo, educationDetails]);
      setEducationDetails({
        school: "",
        department: "",
        degree: "",
        fromduration: "",
        toduration: "",
        pursuing: false,
      });
    }
  };

  const experienceTodo = () => {
    if (
      experienceDetails.occupation == "" &&
      experienceDetails.company == "" &&
      experienceDetails.summary == ""
    ) {
      setShowAlert("Please Enter Atleast one field!");
      handleClickOpenerr();
    } else if (experienceDetails !== "") {
      setExperiencetodo([...experiencetodo, experienceDetails]);
      setExperienceDetails({
        occupation: "",
        company: "",
        summary: "",
        fromduration: "",
        toduration: "",
        currentlyworkhere: false,
      });
    }
  };

  const qualificationOption = [
    { label: "MCA", value: "MCA" },
    { label: "BE", value: "BE" },
    { label: "BSc", value: "BSc" },
    { label: "MS", value: "MS" },
    { label: "BTech", value: "BTech" },
    { label: "ME", value: "ME" },
    { label: "Diploma", value: "Diploma" },
    { label: "ITI", value: "ITI" },
  ];

  const [resumefiles, setResumeFiles] = useState([]);

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
        (d) => d.interactorstype === e.value
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


  const { company, branch } = useParams()


  const fetchallEmployee = async (type) => {
    try {

      // console.log(type.toLowerCase().includes("interview"), "check")
      if (type.toLowerCase().includes("interview") && !type.toLowerCase().includes(" ")) {

        let res = await axios.post(SERVICE.ASSIGN_INTERVIEWER_VISITOR, {

          type: "Interviewer",
          fromcompany: company,
          frombranch: branch,

        });

        let filteruser = res.data.assigninterview.map(item => item.employee).flat()
        // console.log(filteruser, "filteruser")
        filteruser = filteruser.map(d => ({
          ...d,
          label: d,
          value: d,
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

        let filteruser = res.data.assigninterview.map(item => item.employee).flat()
        // console.log(filteruser, "filteruser")
        filteruser = filteruser.map(d => ({
          ...d,
          label: d,
          value: d,
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

  const [olduniqueid, setOldUnique] = useState(0)
  const [allvisitor, setAllVisitor] = useState([])
  const [units, setUnits] = useState([])
  const [filteredUnits, setFilteredUnits] = useState([]);


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

  let uniqueid = olduniqueid ? Number(olduniqueid?.unique) : 0

  const sendRequest = async (type, index) => {
    try {
      setloadingdeloverall(true);
      let idfinal = Number(uniqueid) + 1;
      if (checkCandTrue === true) {

        let addVendorDetails = await axios.post(SERVICE.CREATE_VISITORS, {
          checkout: false,
          unique: Number(idfinal),
          company: String(company),
          branch: String(branch),
          unit: String(vendor.unit),
          visitorid: String(newval),
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
        fetchAssignedBy();
        backPage(`/addcandidates/${idfinal}`)
        // window.location.href = `/addcandidates/${idfinal}`;

      }
      else {

        let addVendorDetails = await axios.post(SERVICE.CREATE_VISITORS, {
          unique: Number(idfinal),
          checkout: false,
          company: String(company),
          branch: String(branch),
          unit: String(vendor.unit),
          visitorid: String(newval),
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
        nextStep()

        setTimeout(() => {
          backPage(`/Checkinvisitor/${company}/${branch}`)
        }, 3000)
      }
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

  const handleClear = (e) => {
    e.preventDefault();
    setVendor({
      prefix: "",
      visitorname: "",
      visitorlastname: "",
      visitorpurpose: "",
      visitorcontactnumber: "",
      visitoremail: "",

      hostname: "",
    });

    setShowAlert(
      <>
        <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7AC767" }} />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>
          {"Cleared Successfully"}
        </p>
      </>
    );
    handleClickOpenerr();
  };


  function isValidEmail(email) {
    // Regular expression for a simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }


  const stepOne = () => {


    if (vendor.firstname == "") {
      setShowAlert("Please Enter First Name");
      handleClickOpenerr();
    }
    else if (vendor.lastname == "") {
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
    else if (vendor.hostname === "Please Select HostName") {
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


  const renderStepOne = () => {
    return (
      <>
        <Box>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography sx={{ color: "#171A1C", fontWeight: 700, fontFamily: "JostMedium", fontSize: { md: "25px", sm: "25px", xs: "22px" } }}>Visitor Registration</Typography>
          </Box>
          <br />
          <Grid container spacing={2} >

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
                    fetchInteractorPurpose(e);
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
                  setRefImage={setRefImage}
                  setRefImageDrag={setRefImageDrag}
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
    </>
  );
}
export default Visitorsregister;