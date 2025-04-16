import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, TableBody, Divider, TableRow, TableCell, Select, Paper, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button, List, FormGroup, FormControlLabel, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { colourStyles, userStyle } from "../../pageStyle";
import { FaPrint, FaFilePdf, FaDownload, FaTrash } from "react-icons/fa";
import "jspdf-autotable";
import axios from "axios";
import * as XLSX from "xlsx";
import { SERVICE } from "../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { handleApiError } from "../../components/Errorhandling";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import Selects from "react-select";
import { CsvBuilder } from "filefy";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LoadingButton from "@mui/lab/LoadingButton";
import SendToServer from "../sendtoserver";
import PageHeading from "../../components/PageHeading";

function SalarySlabAdd() {

  const [updateSheet, setUpdatesheet] = useState([])

  const [sheets, setSheets] = useState([]);
  const [selectedprocess, setSelectedprocess] = useState("");



  const [selectedSheet, setSelectedSheet] = useState("Please Select Sheet");
  const [selectedSheetindex, setSelectedSheetindex] = useState();
  const [salarySlab, setSalarySlab] = useState({
    company: "Please Select Company", branch: "Please Select Branch",
    processqueue: "Please Select Process", checkinput: "",
    salarycode: "", basic: "", hra: "", conveyance: "", medicalallowance: "", productionallowance: "", productionallowancetwo: "", otherallowance: "", shiftallowance: "", esideduction: false, esipercentage: "", esimaxsalary: "", esiemployeepercentage: "", pfdeduction: false, pfpercentage: "", pfemployeepercentage: ""
  });
  const [salarySlabEdit, setSalarySlabEdit] = useState({ company: "Please Select Company", branch: "Please Select Branch", processqueue: "Please Select Process", checkinput: "", salarycode: "", basic: "", hra: "", conveyance: "", medicalallowance: "", productionallowance: "", productionallowancetwo: "", otherallowance: "", shiftallowance: "", esideduction: false, esipercentage: "", esimaxsalary: "", esiemployeepercentage: "", pfdeduction: false, pfpercentage: "", pfemployeepercentage: "" });
  const [salarySlabArray, setSalarySlabArray] = useState([]);
  const [companyOption, setCompanyOption] = useState([]);
  const [branchOption, setBranchOption] = useState([]);



  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, allUnit, allTeam, allCompany, allBranch, pageName, setPageName } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [loader, setLoader] = useState(false);
  //Datatable

  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [isErrorOpensalary, setIsErrorOpenSalary] = useState(false);
  const [showAlert, setShowAlert] = useState();



  const [isEditOpen, setIsEditOpen] = useState(false);



  const [allSalarySlabEdit, setAllSalarySlabEdit] = useState([]);



  const [processQueueArray, setProcessQueueArray] = useState([]);





  // excelupload
  const [fileUploadName, setFileUploadName] = useState("");
  const [dataupdated, setDataupdated] = useState("");

  const [splitArray, setSplitArray] = useState([]);

  const [loading, setLoading] = useState(false);
  //  Datefield
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = dd + "-" + mm + "-" + yyyy;


  const ExportsHead = () => {
    let fileDownloadName = "Filename_" + salarySlab.salarycode + "_" + today;
    if (salarySlab.company === "Please Select Company" || salarySlab.branch === "Please Select Branch" || (salarySlab.processqueue === "Please Select Process" && selectedprocess === "")) {
      // let alertMsg = salarySlab.company === "Please Select Company" && salarySlab.branch === "Please Select Branch" ?
      //   "Please Choose Company & Branch" : salarySlab.company === "Please Select Company" ? "Please Choose Company" : "Please Choose Branch";
      let alertMsg =
        salarySlab.company === "Please Select Company" &&
          salarySlab.branch === "Please Select Branch" &&
          (salarySlab.processqueue === "Please Select Process"

            &&
            selectedprocess === "")


          ? "Please Choose Company, Branch & Process"
          : salarySlab.company === "Please Select Company"
            ? "Please Choose Company"
            : salarySlab.branch === "Please Select Branch"
              ? "Please Choose Branch"
              : salarySlab.processqueue === "Please Select Process" ? "Please Select Process" : "Please Enter Process";

      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{alertMsg}</p>
        </>
      );
      handleClickOpenerr();
    } else {
      new CsvBuilder(fileDownloadName).setColumns(["ProcessCode", "SalaryCode", "Basic", "Hra", "Conveyance", "MedicalAllowance",
        "ProductionAllowance", "Productionallowance1", "OtherAllowance", "ShiftAllowance", "IsESI", "ESIPercentage",
        "ESIMaxSalary", "IsPF", "PfPercentage", "ESIEmployer", "PFEmployer"
      ]).exportFile();
    }
  };


  const readExcel = (file) => {
    if (!(file instanceof Blob)) {
      // Handle the case when the file is not a Blob
      return;
    }
    else if (salarySlab.company === "Please Select Company") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Company"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (salarySlab.branch === "Please Select Branch") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Branch"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (salarySlab.processqueue === "Please Select Process" && selectedprocess === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Process"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else {
      const promise = new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);

        fileReader.onload = (e) => {
          const bufferArray = e.target.result;
          const wb = XLSX.read(bufferArray, { type: "buffer" });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];

          // Convert the sheet to JSON
          const data = XLSX.utils.sheet_to_json(ws);

          resolve(data);
        };
        fileReader.onerror = (error) => {
          reject(error);
        };
      });

      promise.then((d) => {
        function isValidBoolean(value) {
          return typeof value === 'boolean' || value == true || value == false || value == "y" || value == "Y" || value == "n" || value == "N";
        }


        let uniqueArray = d.filter(

          (item) => !salarySlabArray.some((tp) =>


            tp.company === salarySlab.company && tp.branch === salarySlab.branch &&
            tp.processqueue == ((salarySlab.processqueue == "Please Select Process"
              &&
              selectedprocess == "") ? item.ProcessCode : salarySlab.processqueue !== "Please Select Process" ? salarySlab.processqueue : selectedprocess) &&
            tp.medicalallowance == item.MedicalAllowance && tp.productionallowance == item.ProductionAllowance && tp.productionallowancetwo == item.Productionallowance1 && tp.otherallowance == item.OtherAllowance
            && tp.shiftallowance == item.ShiftAllowance && tp.esideduction == (item.IsESI == "Y" || item.IsESI == "y" ? true : false) && tp.esipercentage == item.ESIPercentage && tp.esimaxsalary == item.ESIMaxSalary

            && tp.pfdeduction == (item.IsPF == "Y" || item.IsPF == "y" ? true : false) && tp.pfpercentage == item.PfPercentage && tp.esiemployeepercentage == item.ESIEmployer && tp.pfemployeepercentage == item.PFEmployer
            && !isNaN(item.MedicalAllowance) && !isNaN(item.ProductionAllowance) && !isNaN(item.Productionallowance1) && !isNaN(item.OtherAllowance)
            && !isNaN(item.ShiftAllowance) && !isNaN(item.ESIPercentage) && !isNaN(item.ESIMaxSalary) && !isNaN(item.ESIEmployer) && !isNaN(item.PfPercentage
              && isValidBoolean(item.IsPF) &&
              isValidBoolean(item.IsESI)
            ),


          ),

        );
        if (uniqueArray.length === 0) {
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>{`No Data to Upload`}</p>
            </>
          );
          handleClickOpenerr();
        }
        else if (uniqueArray.length !== d.length) {
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>{`Dupicate & Not a Number Value Removed`}</p>
            </>
          );
          handleClickOpenerr();
        }
        const dataArray = uniqueArray.map((item) => ({
          processqueue: salarySlab.processqueue == "Please Select Process" && selectedprocess == "" ? item.ProcessCode : salarySlab.processqueue !== "Please Select Process" ? salarySlab.processqueue : selectedprocess,
          checkinput: salarySlab.processqueue !== "Please Select Process" ? "dropdown" : "input",
          salarycode: item.SalaryCode,
          basic: item.Basic,
          hra: item.Hra,
          conveyance: item.Conveyance,
          medicalallowance: item.MedicalAllowance,
          productionallowance: item.ProductionAllowance,
          productionallowancetwo: item.Productionallowance1,
          otherallowance: item.OtherAllowance,
          shiftallowance: item.ShiftAllowance,
          esideduction: item.IsESI == "Y" || item.IsESI == "y" ? true : false,
          esipercentage: item.ESIPercentage,
          esimaxsalary: item.ESIMaxSalary,
          pfpercentage: item.PfPercentage,
          esiemployeepercentage: item.ESIEmployer,
          pfemployeepercentage: item.PFEmployer,
          pfdeduction: item.IsPF == "Y" || item.IsPF == "y" ? true : false,
          filename: file.name,
          branch: salarySlab.branch,
          company: salarySlab.company,
          addedby: [
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }));
        setUpdatesheet([])
        const subarraySize = 121;
        // const subarraySize = 1000;

        const splitedArray = [];

        for (let i = 0; i < dataArray.length; i += subarraySize) {
          const subarray = dataArray.slice(i, i + subarraySize);
          splitedArray.push(subarray);

        }
        setSplitArray(splitedArray);

      });
    }

  };



  const clearFileSelection = () => {
    setUpdatesheet([])
    setSheets([]);
    setSelectedSheet("Please Select Sheet");
    setFileUploadName("");
    setSplitArray([]);
    readExcel(null);
    setDataupdated("");
  };








  useEffect(() => {
    fetchProfessionalTax();
    fetchCompany();
    fetchProfessionalTaxAll();
  }, [isEditOpen]);

  useEffect(() => {
    fetchProfessionalTax();
  }, []);
  useEffect(() => {
    fetchProfessionalTaxAll();
  }, [isEditOpen, salarySlabEdit]);
  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);




  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };

  // Error Popup model saalryslab
  const handleClickOpenerrSalary = () => {
    setIsErrorOpenSalary(true);
  };
  const handleCloseerrSalary = () => {
    setIsErrorOpenSalary(false);
    fetchProfessionalTax();
  };





  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };


  // page refersh reload
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };
  const username = isUserRoleAccess.username;





  const fetchCompany = async () => {
    setPageName(!pageName)
    try {
      let res_category = await axios.get(SERVICE.COMPANY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });




      const companyall = [
        { label: "ALL", value: "ALL" },
        ...res_category?.data?.companies.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];

      setCompanyOption(companyall);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const fetchBranch = async (e) => {
    setPageName(!pageName)
    try {
      let res_branch = await axios.get(SERVICE.BRANCH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setLoader(true);

      let data_set = e.value.toUpperCase() === 'ALL'
        ? res_branch.data.branch
        : res_branch.data.branch.filter((data) => e.value === data.company);

      const branchall = [
        { label: "ALL", value: "ALL" },
        ...data_set.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];


      // let result = res_branch.data.branch.filter((d) => d.company === e);
      // const branchall = [
      //   { label: "ALL", value: "ALL" },
      //   ...result.map((d) => ({
      //     ...d,
      //     label: d.name,
      //     value: d.name,
      //   })),
      // ];

      setBranchOption(branchall);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };




  //get all client user id.
  const fetchProcessQueue = async (e) => {
    setPageName(!pageName)
    try {
      let res_freq = await axios.get(SERVICE.ALL_PROCESSQUEUENAME, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let data_set = e.value.toUpperCase() === 'ALL'
        ? res_freq?.data?.processqueuename
        : res_freq?.data?.processqueuename.filter((data) => e.value === data.branch);






      // let result = res_freq?.data?.processqueuename.filter((d) => d.branch === e);
      //   const branchall = [

      //   data_set.map((d) => ({
      //     ...d,
      //     label: d.name,
      //     value: d.name,
      //   }));
      // ]
      const branchall = [
        // { label: "ALL", value: "ALL" },
        ...data_set.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];

      setProcessQueueArray(branchall);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };










  const getSheetExcel = () => {
    if (!Array.isArray(splitArray) || (splitArray.length === 0 && fileUploadName === "")) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Upload a file"}</p>
        </>
      );
      handleClickOpenerr();
    } else {

      let getsheets = splitArray.map((d, index) => ({

        label: "Sheet" + (index + 1),
        value: "Sheet" + (index + 1),
        index: index,
      }));

      setSheets(getsheets);
    }
  };


  const sendJSON = async () => {
    if (selectedSheetindex === "" || selectedSheet === "Please Select Sheet") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Sheet"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else {

      const dataArray = splitArray[Number(selectedSheetindex)].map((item) => ({
        ...item,
        processqueue: salarySlab.processqueue == "Please Select Process" && selectedprocess == "" ? item.ProcessCode : salarySlab.processqueue !== "Please Select Process" ? salarySlab.processqueue : selectedprocess,
        checkinput: salarySlab.processqueue !== "Please Select Process" ? "dropdown" : "input",

        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      }));



      const uniqueArray = dataArray.filter((tp) =>
        !salarySlabArray.some((item) =>
          tp.company === item.company &&
          tp.branch === item.branch &&
          tp.processqueue === item.processqueue &&
          tp.salarycode == item.salarycode &&
          tp.basic == item.basic &&
          tp.hra == item.hra &&
          tp.conveyance == item.conveyance &&
          tp.medicalallowance == item.medicalallowance &&
          tp.productionallowance == item.productionallowance &&
          tp.productionallowancetwo == item.productionallowancetwo &&
          tp.otherallowance == item.otherallowance &&
          tp.shiftallowance == item.shiftallowance &&
          tp.esideduction === item.esideduction &&
          tp.esipercentage == item.esipercentage &&
          tp.esimaxsalary == item.esimaxsalary &&
          tp.esiemployeepercentage == item.esiemployeepercentage &&
          tp.pfdeduction === item.pfdeduction &&
          tp.pfpercentage == item.pfpercentage &&
          tp.pfemployeepercentage == item.pfemployeepercentage
        )
      );



      if (uniqueArray.length === 0) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{`No Data To Upload`}</p>
          </>
        );
        handleClickOpenerr();
      }
      else {

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
          if (this.readyState === 4 && this.status === 200) {
          }
        };

        setPageName(!pageName)
        try {
          setLoading(true); // Set loading to true when starting the upload
          xmlhttp.open("POST", SERVICE.CREATE_SALARYSLAB);
          xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
          xmlhttp.send(JSON.stringify(uniqueArray));
          await fetchProfessionalTax();

        } catch (err) {
        } finally {
          setLoading(false); // Set loading back to false when the upload is complete
          setShowAlert(
            <>
              <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7ac767" }} />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Uploaded Successfully"}</p>
            </>
          );
          handleClickOpenerrSalary();
          setSelectedSheet("Please Select Sheet");
          setSelectedSheetindex(-1)
          setUpdatesheet(prev => [...prev, selectedSheetindex])
          await fetchProfessionalTax();

        }
      }

    }
  }

  //add function
  const sendRequest = async () => {
    setPageName(!pageName)
    try {
      setLoading(true);
      let brandCreate = await axios.post(SERVICE.CREATE_SALARYSLAB, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: String(salarySlab.company),
        branch: String(salarySlab.branch),
        processqueue: String(selectedprocess !== "" ? selectedprocess : salarySlab.processqueue === "Please Select Process" ? "" : salarySlab.processqueue),
        checkinput: String(selectedprocess !== "" ? "input" : "dropdown"),
        salarycode: String(salarySlab.salarycode),
        basic: Number(salarySlab.basic),
        hra: Number(salarySlab.hra),
        conveyance: Number(salarySlab.conveyance),
        medicalallowance: Number(salarySlab.medicalallowance),
        productionallowance: Number(salarySlab.productionallowance),
        productionallowancetwo: Number(salarySlab.productionallowancetwo),
        otherallowance: Number(salarySlab.otherallowance),
        shiftallowance: Number(salarySlab.shiftallowance),
        esideduction: Boolean(salarySlab.esideduction),
        esipercentage: Number(salarySlab.esideduction ? salarySlab.esipercentage : ""),
        esimaxsalary: Number(salarySlab.esideduction ? salarySlab.esimaxsalary : ""),
        esiemployeepercentage: Number(salarySlab.esideduction ? salarySlab.esiemployeepercentage : ""),
        pfdeduction: Boolean(salarySlab.pfdeduction),
        pfpercentage: Number(salarySlab.pfdeduction ? salarySlab.pfpercentage : ""),
        pfemployeepercentage: Number(salarySlab.pfdeduction ? salarySlab.pfemployeepercentage : ""),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });

      await fetchProfessionalTax();

      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Added Successfully"}
          </p>
        </>
      );
      handleClickOpenerrSalary();
      setLoading(false);
    } catch (err) { setLoading(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    const isNameMatch = salarySlabArray?.some((item) => item.company === salarySlab.company && item.branch === salarySlab.branch && item.salarycode.toLowerCase() === salarySlab.salarycode.toLowerCase());
    if (salarySlab.company === "Please Select Company") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Company"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (salarySlab.branch === "Please Select Branch") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Branch"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (salarySlab.salarycode === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Salary Code"}</p>
        </>
      );
      handleClickOpenerr();
    }

    else if (salarySlab.processqueue === "Please Select Process" && selectedprocess === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Process"}</p>
        </>
      );
      handleClickOpenerr();
    }

    else if (isNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Salary Slab already exits!"}</p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequest();
    }
  };

  const handleclear = async (e) => {
    e.preventDefault();
    setSalarySlab({ company: "Please Select Company", branch: "Please Select Branch", processqueue: "Please Select Process", salarycode: "", basic: "", hra: "", conveyance: "", medicalallowance: "", productionallowance: "", productionallowancetwo: "", otherallowance: "", shiftallowance: "", esideduction: false, esipercentage: "", esimaxsalary: "", esiemployeepercentage: "", pfdeduction: false, pfpercentage: "", pfemployeepercentage: "" });
    setBranchOption([]);
    setFileUploadName("");
    setSelectedprocess("")
    setSelectedSheet("Please Select Sheet")
    setSheets([])
    setSplitArray([]);
    setSelectedSheetindex("")
    readExcel(null);
    setDataupdated("");
    let res_freq = await axios.get(SERVICE.ALL_PROCESSQUEUENAME, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });
    let result = res_freq?.data?.processqueuename.filter((d) => d.branch === e);
    const branchall = result.map((d) => ({
      ...d,
      label: d.name,
      value: d.name,
    }));

    setProcessQueueArray(branchall);




    setShowAlert(
      <>
        <ErrorOutlineOutlinedIcon
          sx={{ fontSize: "100px", color: "orange" }}
        />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>
          {"Cleared Successfully"}
        </p>
      </>
    );
    handleClickOpenerr();
  };





  //get all client user id.
  const fetchProfessionalTax = async () => {
    setPageName(!pageName)
    try {
      let res_freq = await axios.get(SERVICE.ALL_SALARYSLAB, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setLoader(true);
      setSalarySlabArray(res_freq?.data?.salaryslab);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //get all Tax.
  const fetchProfessionalTaxAll = async () => {
    setPageName(!pageName)
    try {
      let res_freq = await axios.get(SERVICE.ALL_SALARYSLAB, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSalarySlabArray(res_freq?.data?.salaryslab);
      setAllSalarySlabEdit(res_freq?.data?.salaryslab.filter((item) => item._id !== salarySlabEdit._id));
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  return (
    <Box>
      <Headtitle title={"SALARY SLAB ADD"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Manage Salary Slab"
        modulename="PayRoll"
        submodulename="Salary Slab"
        mainpagename="Salary Slab Add"
        subpagename=""
        subsubpagename=""
      />

      <>
        {isUserRoleCompare?.includes("asalaryslabadd") && (
          <Box sx={userStyle.selectcontainer}>
            <>
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={6} >
                  <Typography sx={userStyle.importheadtext}>Add Salary Slab</Typography>
                </Grid>
                {/* <Grid item md={3} xs={12} sm={6} >

                  </Grid>
                  <Grid item md={2} xs={12} sm={6} >
                    <Button variant="contained"
                      disabled={salarySlab.salarycode !== "" || salarySlab.basic !== "" ||
                        salarySlab.hra !== "" || salarySlab.conveyance != "" ||
                        salarySlab.medicalallowance !== "" || salarySlab.productionallowance != "" ||
                        salarySlab.productionallowancetwo !== "" || salarySlab.otherallowance != "" ||
                        salarySlab.shiftallowance !== "" || salarySlab.esideduction === true ||
                        salarySlab.pfdeduction === true



                      } component="label" sx={{ textTransform: "capitalize" }}>
                      Choose File
                      <input
                        hidden
                        type="file"
                        accept=".xlsx, .xls , .csv"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          setDataupdated("uploaded");
                          readExcel(file);
                          setFileUploadName(file.name);
                          e.target.value = null;
                        }}
                      />
                    </Button>
                  </Grid>
                  <Grid item md={4} xs={12} sm={6}>
                    {fileUploadName != "" && splitArray.length > 0 ? (
                      <Box sx={{ display: "flex", justifyContent: "left" }}>
                        <p>{fileUploadName}</p>
                        <Button sx={{ minWidth: "36px", borderRadius: "50%" }} onClick={() => clearFileSelection()}>
                          <FaTrash style={{ color: "red" }} />
                        </Button>
                      </Box>
                    ) : null}
                  </Grid> */}


              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      styles={colourStyles}
                      options={[{ label: "ALL", value: "ALL" }, ...isAssignBranch?.map(data => ({
                        label: data.company,
                        value: data.company,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })]}
                      placeholder="Please Select Company"
                      value={{ label: salarySlab.company, value: salarySlab.company }}
                      onChange={(e) => {
                        setSalarySlab({
                          ...salarySlab,
                          company: e.value,
                          branch: "Please Select Branch",
                          processqueue: "Please Select Process"
                        });
                        fetchBranch(e);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      styles={colourStyles}

                      options={salarySlab?.company.toUpperCase() === 'ALL' ? [{ label: "ALL", value: "ALL" },...isAssignBranch?.map(data => ({
                        label: data.branch,
                        value: data.branch,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })] : [{ label: "ALL", value: "ALL" }, ...isAssignBranch?.filter(
                        (comp) =>
                          comp.company === salarySlab?.company
                      )?.map(data => ({
                        label: data.branch,
                        value: data.branch,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })]}

                      // options={branchOption}
                      placeholder="Please Select Branch"
                      value={{ label: salarySlab.branch, value: salarySlab.branch }}
                      onChange={(e) => {
                        setSalarySlab({
                          ...salarySlab,
                          branch: e.value,
                          processqueue: "Please Select Process"
                        });
                        fetchProcessQueue(e);
                      }}
                    />
                  </FormControl>
                </Grid>
                {/* <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Process Code
                      </Typography>
                      <Selects
                        maxMenuHeight={250}
                        styles={colourStyles}
                        options={processQueueArray}
                        disabled={fileUploadName != "" && splitArray.length > 0}
                        placeholder="Please Select Company"
                        value={{ label: salarySlab.processqueue, value: salarySlab.processqueue }}
                        onChange={(e) => {
                          setSalarySlab({
                            ...salarySlab,
                            processqueue: e.value,

                          });

                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Process Code<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        sx={userStyle.input}
                        disabled={salarySlab.processqueue !== "Please Select Process"}
                        placeholder="Please Enter Process "
                        value={salarySlab.processqueue}
                        onChange={(e) => {
                          setSalarySlab({
                            ...salarySlab,
                            processqueue: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid> */}
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Process Code<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      styles={colourStyles}
                      options={processQueueArray}
                      isDisabled={selectedprocess.length > 0}
                      placeholder="Please Select Company"
                      value={{ label: salarySlab.processqueue, value: salarySlab.processqueue }}
                      onChange={(e) => {
                        setSalarySlab({
                          ...salarySlab,
                          processqueue: e.value,
                        });

                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Process Code<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      sx={userStyle.input}
                      disabled={salarySlab.processqueue !== "Please Select Process"}
                      placeholder="Please Enter Process "
                      value={selectedprocess}
                      onChange={(e) => {
                        setSelectedprocess(e.target.value);
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <Divider />
              <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={6}>
                  <Button variant="contained" color="success"
                    sx={{ textTransform: "Capitalize" }}
                    onClick={(e) => ExportsHead()}
                  >
                    <FaDownload />
                    &ensp;Download template file
                  </Button>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={6} marginTop={3}>
                  <Grid container spacing={2}>
                    <Grid item md={4.5} xs={12} sm={6}>
                      <Button variant="contained"
                        disabled={
                          // salarySlab.processqueue == "Please Select Process" ||
                          salarySlab.salarycode !== "" || salarySlab.basic !== "" ||
                          salarySlab.hra !== "" || salarySlab.conveyance != "" ||
                          salarySlab.medicalallowance !== "" || salarySlab.productionallowance != "" ||
                          salarySlab.productionallowancetwo !== "" || salarySlab.otherallowance != "" ||
                          salarySlab.shiftallowance !== "" || salarySlab.esideduction === true ||
                          salarySlab.pfdeduction === true



                        } component="label" sx={{ textTransform: "capitalize" }}>
                        Choose File
                        <input
                          hidden
                          type="file"
                          accept=".xlsx, .xls , .csv"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            setDataupdated("uploaded");
                            readExcel(file);
                            setFileUploadName(file.name);
                            e.target.value = null;
                          }}
                        />
                      </Button>
                    </Grid>
                    <Grid item md={6.5} xs={12} sm={6}>
                      {fileUploadName != "" && splitArray.length > 0 ? (
                        <Box sx={{ display: "flex", justifyContent: "left" }}>
                          <p>{fileUploadName}</p>
                          <Button sx={{ minWidth: "36px", borderRadius: "50%" }} onClick={() => clearFileSelection()}>
                            <FaTrash style={{ color: "red" }} />
                          </Button>
                        </Box>
                      ) : null}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Sheet</Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={sheets.filter(d => !updateSheet.includes(d.index))}
                      value={{ label: selectedSheet, value: selectedSheet }}
                      onChange={(e) => {
                        setSelectedSheet(e.value);
                        setSelectedSheetindex(e.index);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={5} xs={12} sm={6} marginTop={3}>
                  <Grid container>
                    <Grid item md={7} xs={12} sm={8}>
                      <Button variant="contained" color="primary"
                        disabled={salarySlab.salarycode !== "" || salarySlab.basic !== "" ||
                          salarySlab.hra !== "" || salarySlab.conveyance != "" ||
                          salarySlab.medicalallowance !== "" || salarySlab.productionallowance != "" ||
                          salarySlab.productionallowancetwo !== "" || salarySlab.otherallowance != "" ||
                          salarySlab.shiftallowance !== "" || salarySlab.esideduction === true ||
                          salarySlab.pfdeduction === true



                        } onClick={getSheetExcel} sx={{ textTransform: "capitalize" }}>
                        Get Sheet
                      </Button>
                    </Grid>

                  </Grid>
                </Grid>
              </Grid>
              <br />
              <Divider />
              <br />

              <br />

              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Salary Code <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      sx={userStyle.input}
                      disabled={fileUploadName != "" && splitArray.length > 0}
                      placeholder="Please Enter Salary Code"
                      value={salarySlab.salarycode.toUpperCase()}
                      onChange={(e) => {
                        setSalarySlab({
                          ...salarySlab,
                          salarycode: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Basic <b>&nbsp; &#8377;</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      disabled={fileUploadName != "" && splitArray.length > 0}
                      placeholder="Please Enter Basic Amount"
                      value={salarySlab.basic}
                      onChange={(e) => {
                        setSalarySlab({
                          ...salarySlab,
                          basic: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      HRA <b>&nbsp; &#8377;</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      disabled={fileUploadName != "" && splitArray.length > 0}
                      placeholder="Please Enter HRA"
                      value={salarySlab.hra}
                      onChange={(e) => {
                        setSalarySlab({
                          ...salarySlab,
                          hra: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Conveyance <b>&nbsp; &#8377;</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      disabled={fileUploadName != "" && splitArray.length > 0}
                      placeholder="Please Enter Conveyance"
                      value={salarySlab.conveyance}
                      onChange={(e) => {
                        setSalarySlab({
                          ...salarySlab,
                          conveyance: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Medical Allowance <b>&nbsp; &#8377;</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      disabled={fileUploadName != "" && splitArray.length > 0}
                      placeholder="Please Enter Medical Allowance"
                      value={salarySlab.medicalallowance}
                      onChange={(e) => {
                        setSalarySlab({
                          ...salarySlab,
                          medicalallowance: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Production Allowance <b>&nbsp; &#8377;</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      disabled={fileUploadName != "" && splitArray.length > 0}
                      placeholder="Please Enter Production Allowance"
                      value={salarySlab.productionallowance}
                      onChange={(e) => {
                        setSalarySlab({
                          ...salarySlab,
                          productionallowance: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Production Allowance 2<b>&nbsp; &#8377;</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      disabled={fileUploadName != "" && splitArray.length > 0}
                      placeholder="Please Enter Production Allowance 2"
                      value={salarySlab.productionallowancetwo}
                      onChange={(e) => {
                        setSalarySlab({
                          ...salarySlab,
                          productionallowancetwo: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Other Allowance<b>&nbsp; &#8377;</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      disabled={fileUploadName != "" && splitArray.length > 0}
                      placeholder="Please Enter Other Allowance"
                      value={salarySlab.otherallowance}
                      onChange={(e) => {
                        setSalarySlab({
                          ...salarySlab,
                          otherallowance: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Shift Allowance<b>&nbsp; &#8377;</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      disabled={fileUploadName != "" && splitArray.length > 0}
                      placeholder="Please Enter Shift Allowance"
                      value={salarySlab.shiftallowance}
                      onChange={(e) => {
                        setSalarySlab({
                          ...salarySlab,
                          shiftallowance: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}></Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography> &nbsp; </Typography>
                  <FormGroup>
                    <FormControlLabel control={<Checkbox checked={salarySlab.esideduction} />}
                      disabled={fileUploadName != "" && splitArray.length > 0}
                      onChange={(e) => setSalarySlab({ ...salarySlab, esideduction: !salarySlab.esideduction })} label="ESI Deduction" />
                  </FormGroup>
                </Grid>
                {salarySlab.esideduction && (
                  <>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          ESI Percentage<b>&nbsp;%</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          sx={userStyle.input}
                          placeholder="Please Enter ESI Percentage"
                          value={salarySlab.esipercentage}
                          onChange={(e) => {
                            setSalarySlab({
                              ...salarySlab,
                              esipercentage: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography> ESI Max Salary </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          sx={userStyle.input}
                          placeholder="Please Enter ESI Max Salary"
                          value={salarySlab.esimaxsalary}
                          onChange={(e) => {
                            setSalarySlab({
                              ...salarySlab,
                              esimaxsalary: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          ESI Employee Percentage<b>&nbsp;%</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          sx={userStyle.input}
                          placeholder="Please Enter ESI Employee Percentage"
                          value={salarySlab.esiemployeepercentage}
                          onChange={(e) => {
                            setSalarySlab({
                              ...salarySlab,
                              esiemployeepercentage: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}
                <Grid item md={3} xs={12} sm={12}>
                  <Typography> &nbsp; </Typography>
                  <FormGroup>
                    <FormControlLabel control={<Checkbox checked={salarySlab.pfdeduction} />}
                      disabled={fileUploadName != "" && splitArray.length > 0}
                      onChange={(e) => setSalarySlab({ ...salarySlab, pfdeduction: !salarySlab.pfdeduction })} label="PF Deduction" />
                  </FormGroup>
                </Grid>
                {salarySlab.pfdeduction && (
                  <>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          PF Percentage<b>&nbsp;%</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          sx={userStyle.input}
                          placeholder="Please Enter PF Percentage"
                          value={salarySlab.pfpercentage}
                          onChange={(e) => {
                            setSalarySlab({
                              ...salarySlab,
                              pfpercentage: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          PF Employee Percentage<b>&nbsp;%</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          sx={userStyle.input}
                          placeholder="Please Enter PF Employee Percentage"
                          value={salarySlab.pfemployeepercentage}
                          onChange={(e) => {
                            setSalarySlab({
                              ...salarySlab,
                              pfemployeepercentage: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}
              </Grid>
              <br />
              <br />
              <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
                <Grid item lg={1} md={2} sm={2} xs={12}>
                  {!loading ? (
                    fileUploadName != "" && splitArray.length > 0 ? (
                      <>
                        <div readExcel={readExcel}>
                          <SendToServer sendJSON={sendJSON} />
                        </div>
                      </>
                    ) : (

                      <Button variant="contained" onClick={handleSubmit}>
                        Submit
                      </Button>
                    )
                  ) : (
                    <LoadingButton
                      // onClick={handleClick}
                      loading={loading}
                      loadingPosition="start"
                      variant="contained"
                    >
                      <span>Submit</span>
                    </LoadingButton>
                  )}

                </Grid>
                <Grid item lg={1} md={2} sm={2} xs={12}>
                  <Button sx={userStyle.btncancel} onClick={handleclear}>
                    Clear
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        )}
      </>
      <br /> <br />
      {/* ****** Table Start ****** */}
      {/* ****** Table End ****** */}
      {/* Manage Column */}




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


      <Box>
        <Dialog open={isErrorOpensalary} onClose={handleCloseerrSalary} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
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
              onClick={handleCloseerrSalary}
            >
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <br />
    </Box>
  );
}

export default SalarySlabAdd;