import React, { useState, useCallback, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../../components/Export";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import domtoimage from 'dom-to-image';
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { styled } from "@mui/system";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import Selects from "react-select";

// Cell Renderer Components

const ButtonCellRenderer = (props) => {
  const { data, node } = props;
  const { auth } = useContext(AuthContext);
  const { isUserRoleAccess } = useContext(UserRoleAccessContext);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();

  const { employees } = props.context;

  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };



  const [storedIds, setStoredIds] = useState([]);

  useEffect(() => {
    const storedIdsJSON = localStorage.getItem('userIds');
    if (storedIdsJSON) {
      setStoredIds(JSON.parse(storedIdsJSON));
    }
  }, []);

  // console.log((Number(node.data.holdpercent) > 0 && Number(node.data.holdpercent) < 100), (node.data.paydate === "" && (node.data.changedate === "" || node.data.changedate === undefined)))
  let finalstatus = (node.data.status === "Choose Status" || node.data.status === "") ? node.data.paidstatus : node.data.status;

  console.log(node.data, (node.data.changedate == "Choose Date" || node.data.changedate == ""), (Number(node.data.holdpercent) === 0), (new Date(node.data.paydate) < new Date()), 'finalstatus')

  const confirmSubmit = async (e) => {
    // let oldholdpercentvalue = node.data.holdpercent
    e.preventDefault();
    try {
      let finalstatus = (node.data.status === "Choose Status" || node.data.status === "") ? "" : node.data.status;

      if (node.data.status !== "Choose Status" && finalstatus?.split("_")[1] === "HOLD" && node.data.holdpercent != 100) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Hold Percent should not be less than 100"}</p>
          </>
        );
        handleClickOpenerr();
        console.log(3);
      }
      else if (
        Number(node.data.holdpercent) > 0 && Number(node.data.holdpercent) < 100 && (node.data.paidstatus === "" && (node.data.status == "Choose Status" || node.data.status == ""))
      ) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose Status"}</p>
          </>
        );
        handleClickOpenerr();
      }

      else if (
        (Number(node.data.holdpercent) > 0 && Number(node.data.holdpercent) < 100) && (node.data.paydate === "" && (node.data.changedate === "" || node.data.changedate === undefined))
      ) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose Date"}</p>
          </>
        );
        handleClickOpenerr();
      }


      else if (data.status !== "Choose Status" && data.reason === "") {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Reason"}</p>
          </>
        );
        handleClickOpenerr();
        console.log(5);
      }

      else if (Number(node.data.holdpercent) > 0 && data.reason === "") {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Reason"}</p>
          </>
        );
        handleClickOpenerr();
        console.log(5);
      }

      else if (node.data.status == "Choose Status" && node.data.changedate == "Choose Date" && (Number(node.data.holdpercent) === 0) && (node.data.paidstatus === "" || node.data.paydate === "")) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{node.data.paidstatus === "" && node.data.paydate === "" ? "Please Update Pay Status and Pay Date" : node.data.paidstatus === "" ? "Please Update Pay status" : "Please Update Pay Date"}</p>
          </>
        );
        handleClickOpenerr();
        console.log(5);
      }

      else if ((node.data.changedate == "Choose Date" || node.data.changedate == "") && (Number(node.data.holdpercent) === 0) && (new Date(node.data.paydate) < new Date() && node.data.datefixes.some(item => item.date == (node.data.paydate) && item.afterexpiry != "Enable"))) {

        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please choose future paydate, the selected this pay date is expired"}</p>
          </>
        );
        handleClickOpenerr();
        console.log(5);
      }



      else {
        let oldholdpercentvalue = Number(node.data.holdpercent) / 100
        let finalsalary = Number(node.data.finalusersalary);
        let holdpercentAmount = (finalsalary * oldholdpercentvalue);

        if (finalstatus?.split("_")[1] === "REJECT") {
          console.log(node.data.changedate, 'node.data.changedate ', node.data.paydate)
          let findReleaseYear = node.data.paydate ? node.data.paydate.split("-")[0] : "";
          let findMonthNumber = node.data.paydate ? node.data.paydate.split("-")[1] : -1;
          let findReleaseMonth = monthNames[Number(findMonthNumber) - 2];
          let res = await axios.post(`${SERVICE.CONFIRM_FIXSALARYDATE}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },

            outerId: node.data.outerId,
            innerId: node.data._id,
            logdata:
              [

                {
                  status: "bankrelease",
                  statuspage: "fixsalary",
                  holdsalaryconfirm: "Yes",
                  outerId: node.data.outerId,
                  innerId: node.data._id,
                  currentmonthavg: node.data.currentmonthavg,
                  currentmonthattendance: node.data.currentmonthattendance,
                  companyname: node.data.companyname,
                  company: node.data.company,
                  branch: node.data.branch,
                  unit: node.data.unit,
                  empcode: node.data.empcode,
                  legalname: node.data.legalname,
                  designation: node.data.designation,
                  team: node.data.team,
                  department: node.data.department,

                  totalnumberofdays: node.data.totalnumberofdays,
                  totalshift: node.data.totalshift,
                  clsl: node.data.clsl,

                  totalasbleave: node.data.totalasbleave,
                  totalpaidDays: node.data.totalpaidDays,
                  targetpoints: node.data.targetpoints,
                  acheivedpoints: node.data.achievedpoints,

                  acheivedpercent: node.data.achieved,
                  penaltyamount: node.data.penaltyamount,
                  accountholdername: node.data.accountholdername,
                  bankname: node.data.bankname,
                  accountnumber: node.data.accountno,
                  ifsccode: node.data.ifsccode,
                  releaseamount: "",
                  otherdeductionamount: "",
                  totalexcess: "",
                  totaladvance: "",
                  payamount: 0,
                  balanceamount: 0,
                  paidstatus: node.data.paidstatus,
                  approvedby: isUserRoleAccess.companyname,
                  description: `Rejected`,
                  recheckreason: "",
                  updatedpaidstatus: (node.data.status === "Choose Status" || node.data.status === "" || node.data.status === undefined) ? "" : node.data.status,
                  updatechangedate: "",
                  updatedholdpercent: node.data.holdpercent,
                  updatedreason: "",
                  payonsalarytype: node.data.payonsalarytype,
                  paymonth: node.data.paymonth,
                  payyear: node.data.payyear,
                  paydate: "",
                  finalusersalary: node.data.finalusersalary
                },

              ]

          });

          if (res.statusText === "OK") {

            const updatedIds = [...storedIds, node.data._id];
            localStorage.setItem('userIds', JSON.stringify(updatedIds));
            setStoredIds(updatedIds);
          }
        }

        else if (Number(node.data.holdpercent) == 100) {
          let res = await axios.post(`${SERVICE.CONFIRM_FIXSALARYDATE}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },

            outerId: node.data.outerId,
            innerId: node.data._id,
            logdata:
              [
                {
                  status: "holdbankrelease",
                  statuspage: "fixsalary",
                  outerId: node.data.outerId,
                  innerId: node.data._id,
                  currentmonthavg: node.data.currentmonthavg,
                  currentmonthattendance: node.data.currentmonthattendance,
                  companyname: node.data.companyname,
                  company: node.data.company,
                  branch: node.data.branch,
                  unit: node.data.unit,
                  empcode: node.data.empcode,
                  legalname: node.data.legalname,
                  designation: node.data.designation,
                  team: node.data.team,
                  department: node.data.department,

                  totalnumberofdays: node.data.totalnumberofdays,
                  totalshift: node.data.totalshift,
                  clsl: node.data.clsl,

                  totalasbleave: node.data.totalasbleave,
                  totalpaidDays: node.data.totalpaidDays,
                  targetpoints: node.data.targetpoints,
                  acheivedpoints: node.data.achievedpoints,

                  acheivedpercent: node.data.achieved,
                  penaltyamount: node.data.penaltyamount,
                  accountholdername: node.data.accountholdername,
                  bankname: node.data.bankname,
                  accountnumber: node.data.accountno,
                  ifsccode: node.data.ifsccode,
                  releaseamount: "",
                  otherdeductionamount: "",
                  totalexcess: "",
                  totaladvance: "",
                  payamount: "",
                  paidstatus: node.data.paidstatus,
                  approvedby: "",
                  description: "",
                  recheckreason: "",
                  updatedpaidstatus: (node.data.status === "Choose Status" || node.data.status === "" || node.data.status === undefined) ? "" : node.data.status,
                  updatechangedate: (node.data.changedate === "Choose Date" || node.data.changedate === "" || node.data.changedate === undefined) ? "" : node.data.changedate,
                  updatedholdpercent: node.data.holdpercent,
                  payamount: 0,
                  balanceamount: finalsalary,
                  updatedreason: node.data.reason,
                  payonsalarytype: node.data.payonsalarytype,
                  paymonth: node.data.paymonth,
                  payyear: node.data.payyear,
                  paydate: node.data.paydate,
                  finalusersalary: node.data.finalusersalary
                },

              ]
          });

          if (res.statusText === "OK") {

            const updatedIds = [...storedIds, node.data._id];
            localStorage.setItem('userIds', JSON.stringify(updatedIds));
            setStoredIds(updatedIds);
          }
        }
        else if (Number(node.data.holdpercent) > 0 && Number(node.data.holdpercent) < 100) {

          let findReleaseYear = node.data.paydate ? node.data.paydate.split("-")[0] : "";
          let findMonthNumber = node.data.paydate ? node.data.paydate.split("-")[1] : -1;
          let findReleaseMonth = monthNames[Number(findMonthNumber) - 2];
          let res = await axios.post(`${SERVICE.CONFIRM_FIXSALARYDATE}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },

            outerId: node.data.outerId,
            innerId: node.data._id,
            logdata:
              [
                {
                  status: "holdrelease",
                  statuspage: "fixsalary",
                  outerId: node.data.outerId,
                  innerId: node.data._id,
                  currentmonthavg: node.data.currentmonthavg,
                  currentmonthattendance: node.data.currentmonthattendance,
                  companyname: node.data.companyname,
                  company: node.data.company,
                  branch: node.data.branch,
                  unit: node.data.unit,
                  empcode: node.data.empcode,
                  legalname: node.data.legalname,
                  designation: node.data.designation,
                  team: node.data.team,
                  department: node.data.department,

                  totalnumberofdays: node.data.totalnumberofdays,
                  totalshift: node.data.totalshift,
                  clsl: node.data.clsl,

                  totalasbleave: node.data.totalasbleave,
                  totalpaidDays: node.data.totalpaidDays,
                  targetpoints: node.data.targetpoints,
                  acheivedpoints: node.data.achievedpoints,

                  acheivedpercent: node.data.achieved,
                  penaltyamount: node.data.penaltyamount,
                  accountholdername: node.data.accountholdername,
                  bankname: node.data.bankname,
                  accountnumber: node.data.accountno,
                  ifsccode: node.data.ifsccode,
                  releaseamount: "",
                  otherdeductionamount: "",
                  totalexcess: "",
                  totaladvance: "",
                  payamount: "",
                  paidstatus: node.data.paidstatus,
                  approvedby: "",
                  description: "",
                  recheckreason: "",
                  updatedpaidstatus: (node.data.status === "Choose Status" || node.data.status === "" || node.data.status === undefined) ? "" : node.data.status,
                  updatechangedate: (node.data.changedate === "Choose Date" || node.data.changedate === "" || node.data.changedate === undefined) ? "" : node.data.changedate,
                  updatedholdpercent: node.data.holdpercent,
                  payamount: (finalsalary - holdpercentAmount).toFixed(2),
                  balanceamount: (finalsalary * oldholdpercentvalue).toFixed(2),
                  updatedreason: node.data.reason,
                  payonsalarytype: node.data.payonsalarytype,
                  paymonth: node.data.paymonth,
                  payyear: node.data.payyear,
                  paydate: node.data.paydate,
                  finalusersalary: node.data.finalusersalary
                },
                {
                  status: "bankrelease",
                  statuspage: "fixsalary",
                  outerId: node.data.outerId,
                  innerId: node.data._id,
                  currentmonthavg: node.data.currentmonthavg,
                  currentmonthattendance: node.data.currentmonthattendance,
                  companyname: node.data.companyname,
                  company: node.data.company,
                  branch: node.data.branch,
                  unit: node.data.unit,
                  empcode: node.data.empcode,
                  legalname: node.data.legalname,
                  designation: node.data.designation,
                  team: node.data.team,
                  department: node.data.department,

                  totalnumberofdays: node.data.totalnumberofdays,
                  totalshift: node.data.totalshift,
                  clsl: node.data.clsl,

                  totalasbleave: node.data.totalasbleave,
                  totalpaidDays: node.data.totalpaidDays,
                  targetpoints: node.data.targetpoints,
                  acheivedpoints: node.data.achievedpoints,

                  acheivedpercent: node.data.achieved,
                  penaltyamount: node.data.penaltyamount,
                  accountholdername: node.data.accountholdername,
                  bankname: node.data.bankname,
                  accountnumber: node.data.accountno,
                  ifsccode: node.data.ifsccode,
                  releaseamount: "",
                  otherdeductionamount: "",
                  totalexcess: "",
                  totaladvance: "",

                  paidstatus: node.data.paidstatus,
                  approvedby: isUserRoleAccess.companyname,
                  description: `Direct Salary: From: ${node.data.payyear} ${node.data.paymonth} - Release: ${findReleaseYear} ${findReleaseMonth}`,
                  recheckreason: "",
                  updatedpaidstatus: (node.data.status === "Choose Status" || node.data.status === "" || node.data.status === undefined) ? "" : node.data.status,
                  updatechangedate: (node.data.changedate === "Choose Date" || node.data.changedate === "" || node.data.changedate === undefined) ? "" : node.data.changedate,
                  updatedholdpercent: node.data.holdpercent,

                  updatedreason: "",
                  payonsalarytype: node.data.payonsalarytype,
                  paymonth: node.data.paymonth,
                  payyear: node.data.payyear,
                  paydate: Number(node.data.holdpercent) === 100 ? "" : node.data.paydate,
                  finalusersalary: (finalsalary - holdpercentAmount).toFixed(2),
                  payamount: (finalsalary - holdpercentAmount).toFixed(2),
                  balanceamount: (finalsalary * oldholdpercentvalue).toFixed(2),
                },

              ]
          });

          if (res.statusText === "OK") {

            const updatedIds = [...storedIds, node.data._id];
            localStorage.setItem('userIds', JSON.stringify(updatedIds));
            setStoredIds(updatedIds);
          }
        }

        else if (Number(node.data.holdpercent) === 0) {
          // console.log(node.data.changedate, node.data, data, 'sdfsd')
          let findReleaseYear = node.data.paydate ? node.data.paydate.split("-")[0] : "";
          let findMonthNumber = node.data.paydate ? node.data.paydate.split("-")[1] : -1;
          let findReleaseMonth = monthNames[Number(findMonthNumber) - 2];
          let res = await axios.post(`${SERVICE.CONFIRM_FIXSALARYDATE}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },

            outerId: node.data.outerId,
            innerId: node.data._id,
            logdata:
              [

                {
                  status: "bankrelease",
                  statuspage: "fixsalary",
                  holdsalaryconfirm: "Yes",
                  outerId: node.data.outerId,
                  innerId: node.data._id,
                  currentmonthavg: node.data.currentmonthavg,
                  currentmonthattendance: node.data.currentmonthattendance,
                  companyname: node.data.companyname,
                  company: node.data.company,
                  branch: node.data.branch,
                  unit: node.data.unit,
                  empcode: node.data.empcode,
                  legalname: node.data.legalname,
                  designation: node.data.designation,
                  team: node.data.team,
                  department: node.data.department,

                  totalnumberofdays: node.data.totalnumberofdays,
                  totalshift: node.data.totalshift,
                  clsl: node.data.clsl,

                  totalasbleave: node.data.totalasbleave,
                  totalpaidDays: node.data.totalpaidDays,
                  targetpoints: node.data.targetpoints,
                  acheivedpoints: node.data.achievedpoints,

                  acheivedpercent: node.data.achieved,
                  penaltyamount: node.data.penaltyamount,
                  accountholdername: node.data.accountholdername,
                  bankname: node.data.bankname,
                  accountnumber: node.data.accountno,
                  ifsccode: node.data.ifsccode,
                  releaseamount: "",
                  otherdeductionamount: "",
                  totalexcess: "",
                  totaladvance: "",
                  payamount: (Number(node.data.finalusersalary)).toFixed(2),
                  balanceamount: 0,
                  paidstatus: node.data.paidstatus,
                  approvedby: isUserRoleAccess.companyname,
                  description: `Direct Salary: From: ${node.data.payyear} ${node.data.paymonth} - Release: ${findReleaseYear} ${findReleaseMonth}`,
                  recheckreason: "",
                  updatedpaidstatus: (node.data.status === "Choose Status" || node.data.status === "" || node.data.status === undefined) ? "" : node.data.status,
                  updatechangedate: (node.data.changedate === "Choose Date" || node.data.changedate === "" || node.data.changedate === undefined) ? "" : node.data.changedate,
                  updatedholdpercent: node.data.holdpercent,
                  updatedreason: "",
                  payonsalarytype: node.data.payonsalarytype,
                  paymonth: node.data.paymonth,
                  payyear: node.data.payyear,
                  paydate: node.data.paydate,
                  finalusersalary: node.data.finalusersalary
                },

              ]

          });

          if (res.statusText === "OK") {

            const updatedIds = [...storedIds, node.data._id];
            localStorage.setItem('userIds', JSON.stringify(updatedIds));
            setStoredIds(updatedIds);
          }
        }


        // if (Number(node.data.holdpercent) > 0) {
        //   let Res_Data = await axios.post(`${SERVICE.HOLD_SALARY_RELEASE_CREATE}`, {
        //     headers: {
        //       Authorization: `Bearer ${auth.APIToken}`,
        //     },
        //     outerId: node.data.outerId,
        //     originalid: node.data._id,
        //     companyname: node.data.companyname,
        //     company: node.data.company,
        //     branch: node.data.branch,
        //     unit: node.data.unit,
        //     empcode: node.data.empcode,
        //     legalname: node.data.legalname,
        //     designation: node.data.designation,
        //     team: node.data.team,
        //     bankname: node.data.bankname,
        //     accountnumber: node.data.accountno,
        //     ifsccode: node.data.ifsccode,
        //     salary: node.data.finalusersalary,
        //     releaseamount: "",
        //     otherdeductionamount: "",
        //     totalexcess: "",
        //     totaladvance: "",
        //     payamount: "",
        //     balanceamount: Number(node.data.finalusersalary) * (Number(node.data.holdpercent) / 100),
        //     paidstatus: node.data.paidstatus,
        //     approvedby: "",
        //     description: "",
        //     recheckreason: "",
        //     updatedpaidstatus: node.data.status === "Choose Status" ? "" : node.data.status,
        //     updatechangedate: node.data.changedate === "Choose Date" ? "" : node.data.changedate,
        //     updatedholdpercent: node.data.holdpercent,
        //     updatedreason: node.data.reason,
        //     payonsalarytype: node.data.payonsalarytype,
        //     paydate: node.data.paydate,
        //     paymonth: node.data.paymonth,
        //     payyear: node.data.payyear,
        //     finalusersalary: node.data.finalusersalary

        //   });
        //   let res = await axios.post(`${SERVICE.CONSOLIDATED_SALARY_RELEASE_CREATE}`, {
        //     headers: {
        //       Authorization: `Bearer ${auth.APIToken}`,
        //     },
        // 
        //     outerId: node.data.outerId,
        //     originalid: node.data._id,
        //     companyname: node.data.companyname,
        //     company: node.data.company,
        //     branch: node.data.branch,
        //     unit: node.data.unit,
        //     empcode: node.data.empcode,
        //     legalname: node.data.legalname,
        //     designation: node.data.designation,
        //     team: node.data.team,
        //     bankname: node.data.bankname,
        //     accountnumber: node.data.accountno,
        //     ifsccode: node.data.ifsccode,
        //     salary: node.data.finalusersalary,
        //     releaseamount: "",
        //     otherdeductionamount: "",
        //     totalexcess: "",
        //     totaladvance: "",
        //     payamount: "",
        //     balanceamount: Number(node.data.finalusersalary) * (Number(node.data.holdpercent) / 100),
        //     paidstatus: node.data.paidstatus,
        //     approvedby: "",
        //     description: "",
        //     recheckreason: "",
        //     updatedpaidstatus: node.data.status === "Choose Status" ? "" : node.data.status,
        //     updatechangedate: node.data.changedate === "Choose Date" ? "" : node.data.changedate,
        //     updatedholdpercent: node.data.holdpercent,
        //     updatedreason: node.data.reason,
        //     payonsalarytype: node.data.payonsalarytype,
        //     paymonth: node.data.paymonth,
        //     payyear: node.data.payyear,
        //     paydate: node.data.paydate,
        //     finalusersalary: node.data.finalusersalary

        //   });
        //   let resConfirm = await axios.post(`${SERVICE.CONFIRM_FIXSALARYDATE}`, {
        //     headers: {
        //       Authorization: `Bearer ${auth.APIToken}`,
        //     },
        //     outerId: node.data.outerId,
        //     innerId: node.data._id,
        //     fixsalarydateconfirm: "confirmed",

        //   });

        //   if (res.statusText === "OK") {

        //     const updatedIds = [...storedIds, node.data._id];
        //     localStorage.setItem('userIds', JSON.stringify(updatedIds));
        //     setStoredIds(updatedIds);
        //   }

        // } else {
        //   let res_Realse = await axios.post(`${SERVICE.CONSOLIDATED_SALARY_RELEASE_CREATE}`, {
        //     headers: {
        //       Authorization: `Bearer ${auth.APIToken}`,
        //     },
        //     outerId: node.data.outerId,
        //     originalid: node.data._id,
        //     companyname: node.data.companyname,
        //     company: node.data.company,
        //     branch: node.data.branch,
        //     unit: node.data.unit,
        //     empcode: node.data.empcode,
        //     legalname: node.data.legalname,
        //     designation: node.data.designation,
        //     team: node.data.team,
        //     bankname: node.data.bankname,
        //     accountnumber: node.data.accountno,
        //     ifsccode: node.data.ifsccode,
        //     salary: node.data.finalusersalary,
        //     releaseamount: "",
        //     otherdeductionamount: "",
        //     totalexcess: "",
        //     totaladvance: "",
        //     payamount: "",
        //     balanceamount: Number(node.data.finalusersalary) * (Number(node.data.holdpercent) / 100),
        //     paidstatus: node.data.paidstatus,
        //     approvedby: isUserRoleAccess.companyname,
        //     description: "",
        //     recheckreason: "",
        //     updatedpaidstatus: node.data.status === "Choose Status" ? "" : node.data.status,
        //     updatechangedate: node.data.changedate === "Choose Date" ? "" : node.data.changedate,
        //     updatedholdpercent: node.data.holdpercent,
        //     updatedreason: node.data.reason,
        //     payonsalarytype: node.data.payonsalarytype,
        //     paymonth: node.data.paymonth,
        //     payyear: node.data.payyear,
        //     paydate: node.data.paydate,
        //     finalusersalary: node.data.finalusersalary

        //   });

        //   let resConfirm = await axios.post(`${SERVICE.CONFIRM_FIXSALARYDATE}`, {
        //     headers: {
        //       Authorization: `Bearer ${auth.APIToken}`,
        //     },
        //     outerId: node.data.outerId,
        //     innerId: node.data._id,
        //     fixsalarydateconfirm: "confirmed",

        //   });

        //   if (res_Realse.statusText === "OK") {

        //     const updatedIds = [...storedIds, node.data._id];
        //     localStorage.setItem('userIds', JSON.stringify(updatedIds));
        //     setStoredIds(updatedIds);
        //   }

        // }

      }
    } catch (err) {
      console.log(err, 'err')
      const messages = err?.response?.data?.message;
      console.error(messages);
    }
  };

  return (
    <>
      <Button variant="contained" size="small" color="error" disabled={storedIds?.includes(data._id)} onClick={confirmSubmit}>
        {storedIds?.includes(data._id) ? "Confirmed" : "Confirm"}
      </Button>

      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  )
};


function Fixsalarydate() {
  let today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;

  const years = [];
  for (let year = yyyy; year >= 1977; year--) {
    years.push({ value: year, label: year.toString() });
  }
  const gridRef = useRef(null);
  const [isActive, setIsActive] = useState(false);

  const [itemsTwo, setItemsTwo] = useState([]);

  const [lastVisiblePage, setlastVisiblePage] = useState([]);


  const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);

  const modeDropDowns = [
    { label: "My Hierarchy List", value: "myhierarchy" },
    { label: "All Hierarchy List", value: "allhierarchy" },
    { label: "My + All Hierarchy List", value: "myallhierarchy" },
  ];
  const sectorDropDowns = [
    { label: "Primary", value: "Primary" },
    { label: "Secondary", value: "Secondary" },
    { label: "Tertiary", value: "Tertiary" },
    { label: "All", value: "all" },
  ];
  const holdPercentOpt = [
    { label: 0, value: 0 },
    { label: 25, value: 25 },
    { label: 50, value: 50 },
    { label: 75, value: 75 },
    { label: 100, value: 100 },
  ];
  const [modeselection, setModeSelection] = useState({ label: "My Hierarchy List", value: "myhierarchy" });
  const [sectorSelection, setSectorSelection] = useState({ label: "Primary", value: "Primary" });
  // console.log(isActive, 'isActive')
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");


  const [selectAllCheckedTwo, setSelectAllCheckedTwo] = useState(false);

  const [pageTwo, setPageTwo] = useState(1);
  const [pageSizeTwo, setPageSizeTwo] = useState(10);

  const [selectedRowsTwo, setSelectedRowsTwo] = useState([]);
  const [searchQueryTwo, setSearchQueryTwo] = useState("");
  const [searchQueryManageTwo, setSearchQueryManageTwo] = useState("");

  const [copiedData, setCopiedData] = useState("");

  const handleYearChange = (event) => {
    setSelectedYear(event.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.value);
    setSelectMonthName(event.label);
    setSelectedMonthNum(event.numval);
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  let currentMonth = monthNames[mm - 1];

  const [selectedYear, setSelectedYear] = useState(yyyy);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectmonthname, setSelectMonthName] = useState(currentMonth);
  const [selectedMonthNum, setSelectedMonthNum] = useState(mm);

  //month dropdown options
  const months = [
    { value: "January", label: "January", numval: 1 },
    { value: "February", label: "February", numval: 2 },
    { value: "March", label: "March", numval: 3 },
    { value: "April", label: "April", numval: 4 },
    { value: "May", label: "May", numval: 5 },
    { value: "June", label: "June", numval: 6 },
    { value: "July", label: "July", numval: 7 },
    { value: "August", label: "August", numval: 8 },
    { value: "September", label: "September", numval: 9 },
    { value: "October", label: "October", numval: 10 },
    { value: "November", label: "November", numval: 11 },
    { value: "December", label: "December", numval: 12 },
  ];


  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Fix Salary Date Confirm List.png");
        });
      });
    }
  };

  const gridRefContainer = useRef(null);

  const handleCaptureImageNew = () => {
    if (gridRefContainer.current) {
      domtoimage.toBlob(gridRefContainer.current)
        .then((blob) => {
          saveAs(blob, "Fix salary date.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };


  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();

  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
    setIsActive(false);
  };


  // Manage TWO Columns
  const [isManageColumnsOpenTwo, setManageColumnsOpenTwo] = useState(false);
  const [anchorElTwo, setAnchorElTwo] = useState(null);

  const handleOpenManageTwoColumns = (event) => {
    setAnchorElTwo(event.currentTarget);
    setManageColumnsOpenTwo(true);
  };
  const handleCloseManageTwoColumns = () => {
    setManageColumnsOpenTwo(false);
    setSearchQueryManageTwo("");
  };

  const openTwo = Boolean(anchorElTwo);
  const idTwo = openTwo ? "simple-popover" : undefined;

  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    "& .MuiDataGrid-virtualScroller": {
      overflowY: "hidden",
    },

    "& .MuiDataGrid-columnHeaderTitle": {
      // fontSize: "11px",
      fontWeight: "bold !important",
      lineHeight: "17px",
      whiteSpace: "normal", // Wrap text within the available space
      overflow: "visible", // Allow overflowed text to be visible
      minWidth: "20px",
    },
    "& .MuiDataGrid-columnHeaders": {
      minHeight: "53px !important",
      // background: "#b7b3b347",
      padding: 0,
      maxHeight: "55px",
    },
    "& .MuiDataGrid-row": {
      fontSize: "13px", // Change the font size for row data
      minWidth: "20px",
      color: "black",
      // Add any other styles you want to apply to the row data
    },

    "& .MuiDataGrid-cell[data-field='prodlossdeduction']": {
      backgroundColor: "#2f87187a !important",
    },

    "& .MuiDataGrid-row.Mui-selected": {
      "& .custom-ago-row, & .custom-in-row, & .custom-others-row": {
        backgroundColor: "unset !important", // Clear the background color for selected rows
      },
    },
  }));
  const initialColumnVisibilityTwo = {
    serialNumber: true,
    checkbox: true,
    department: true,
    company: true,
    branch: true,
    unit: true,
    empcode: true,
    team: true,
    // designation: true,
    employeename: true,
    // aadharname: true,
    // processcode: true,
    // doj: true,
    // experienceinmonth: true,
    // prodexp:true,
    totalnumberofdays: true,
    totalshift: true,
    clsl: true,
    weekoff: true,
    holiday: true,
    totalasbleave: true,
    totalpaidDays: true,
    payonsalarytype: true,
    // newgross: true,
    // actualbasic: true,
    // actualhra: true,
    // actualconveyance: true,
    // actualmedicalallowance: true,
    // actualproductionallowance: true,
    // actualproductionallowancetwo: true,
    // actualotherallowance: true,
    // oldgross:true,
    // oldbasic: true,
    // oldhra: true,
    // oldconveyance: true,
    // oldmedicalallowance: true,
    // oldproductionallowance: true,
    // oldproductionallowancetwo: true,
    // oldotherallowance: true,

    targetpoints: true,
    achievedpoints: true,
    achieved: true,
    // achievedproductionallowance: true,
    // actualnetsalary: true,

    //FINAL
    // lopbasic: true,
    // lophra: true,
    // lopconveyance: true,
    // lopmedicalallowance: true,
    // lopproductionallowance: true,
    // lopotherallowance: true,
    // lopnetsalary: true,
    // prodbasic: true,
    // prodhra: true,
    // prodconveyance: true,
    // prodmedicalallowance: true,
    // prodproductionallowance: true,
    // prodotherallowance: true,
    // attendancelop: true,
    // calculatednetsalary: true,
    // actualpenaltyamount: true,
    penaltyamount: true,
    lossdeduction: true,
    otherdeduction: true,
    // finalbasic: true,
    // finalhra: true,
    // finalconveyance: true,
    // finalmedicalallowance: true,
    // finalproductionallowance: true,
    // finalotherallowance: true,
    // finalnetsalary: true,
    // pfdays: true,
    // ncpdays: true,
    // pfdeduction: true,
    // esideduction: true,
    // finallopdays: true,
    // paysliplop: true,
    // finalleavededuction: true,
    // professionaltax: true,
    // totaldeductions: true,
    // uan: true,
    // ipname: true,
    // noallowanceshift: true,
    // shiftallowancepoint: true,
    // shiftallowancetarget: true,
    // nightshiftallowance: true,
    // finalsalary: true,
    // finalsalarypenalty: true,
    // totalpointsvalue: true,
    // era: true,
    // actualera: true,
    // pfemployerdeduction: true,
    // esiemployerdeduction: true,
    // ctc: true,
    // revenueallowance: true,
    // finalvalue: true,
    // finalvaluetwo: true,
    // finalvaluepenalty: true,
    // shortage: true,
    // shortageone: true,
    // actualdeduction: true,
    // minimumdeduction: true,
    // finalvaluereview: true,
    // finalvaluestatus: true,
    // finalvaluepenaltystatus: true,

    // //FIXED
    // fixedlossdeduction: true,
    // fixednetsalary: true,
    // fixedbasic: true,
    // fixedhra: true,
    // fixedconveyance: true,
    // fixedmedicalallowance: true,
    // fixedproductionallowance: true,
    // fixedotherallowance: true,
    // fixednetsalaryone: true,
    // fixedemppf: true,
    // fixedempesi: true,
    // fixedempptax: true,
    // fixedemprpf: true,
    // fixedempresi: true,
    // fixedshiftallowance: true,
    // fixedtotaldeductions: true,
    // fixedsalary: true,
    // fixedsalarypenalty: true,
    // fixedlop: true,
    // fixedlopdays: true,
    // fixedleavededuction: true,
    // fixedctc: true,
    // fixedfinalvalue: true,
    // fixedactualdeduction: true,
    // fixedminimumdeduction: true,

    // //PRODUCTION
    // prodlossdeduction: true,
    // prodnetsalary: true,
    // prodbasicp: true,
    // prodhrap: true,
    // prodconveyancep: true,
    // prodmedicalallowancep: true,
    // prodproductionallowancep: true,
    // prodotherallowancep: true,
    // prodnetsalaryonep: true,
    // prodemppf: true,
    // prodempesi: true,
    // prodempptax: true,
    // prodemprpf: true,
    // prodempresi: true,
    // prodshiftallowance: true,
    // prodtotaldeductions: true,
    // prodsalary: true,
    // prodsalarypenalty: true,
    // prodlopdays: true,
    // prodlop: true,
    // prodleavededuction: true,
    // prodctc: true,
    // prodfinalvalue: true,
    // prodactualdeduction: true,
    // prodminimumdeduction: true,

    // salarytype: true,
    // deductiontype: true,
    currentmonthavg: true,
    currentmonthattendance: true,
    // payon: true,
    paidstatus: true,

    paydate: true,
    getstatus: true,
    status: true,
    getdate: true,
    changedate: true,
    payyear: true,
    paymonth: true,
    holdpercent: true,
    reason: true,
    confirmation: true,
    change: true,
    bankname: true,
    accountname: true,
    accountno: true,
    ifsccode: true,

    salarytype: true,
    updatechangedate: true,
    updatedpaidstatus: true,
    actions: true,
    updatedholdpercent: 1,
    updatedreason: 1,
  };

  const [columnVisibilityTwo, setColumnVisibilityTwo] = useState(initialColumnVisibilityTwo);

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  const handleClear = (e) => {
    e.preventDefault();
    setPage(1);
    setPageSize(10);
    setSelectedYear(yyyy);
    setSelectedMonth(currentMonth);
    setSelectMonthName(currentMonth);
    setSelectedMonthNum(mm);
    setFilteredData([]);
    setItemsTwo([]);
  };

  const columns = [
    // Serial number column
    { title: "SNo", dataKey: "serialNumber" },
    { title: "Company", dataKey: "company" },
    { title: "Branch", dataKey: "branch" },
    { title: "Unit", dataKey: "unit" },
    { title: "Emp code", dataKey: "empcode" },

    { title: "TTS Name", dataKey: "employeename" },

    { title: "totalnumberofdays", dataKey: "totalnumberofdays" },
    { title: "Total Shift", dataKey: "totalshift" },
    { title: "Total Absent/Leave", dataKey: "totalasbleave" },
    { title: "Total Paid Days", dataKey: "totalpaidDays" },

    { title: "Target Points", dataKey: "targetpoints" },
    { title: "Achieved Points", dataKey: "achievedpoints" },
    { title: "Achieved %", dataKey: "achieved" },

    { title: "Penalty Amount", dataKey: "penaltyamount" },
    { title: "Pay on", dataKey: "salarytype" },
    { title: "Paid Status", dataKey: "paidstatus" },
    { title: "Pay Date", dataKey: "paydate" },
    { title: "Status", dataKey: "status" },
    { title: "Change Date", dataKey: "changedate" },


    { title: "Pay Year", dataKey: "payyear" },
    { title: "Pay Month", dataKey: "paymonth" },


    { title: "Bank Name", dataKey: "bankname" },
    { title: "Account Name", dataKey: "account" },
    { title: "Account No", dataKey: "accountno" },
    { title: "IFSC Code", dataKey: "ifsccode" },



    { title: "Loss Deduction", dataKey: "lossdeductionfinal" },
    { title: "Other Deduction", dataKey: "otherdeductionfinal" },

    { title: `Current (${monthNames[Number(selectedMonthNum) >= 12 ? 0 : Number(selectedMonthNum)]}) Month Avg`, dataKey: "currentmonthavg" },
    { title: `Current (${monthNames[Number(selectedMonthNum) >= 12 ? 0 : Number(selectedMonthNum)]}) Month Attendance`, dataKey: "currentmonthattendance" },

  ];

  const downloadPdf = () => {
    const doc = new jsPDF({
      orientation: "landscape",
    });

    const maxColumnsPerPage = 15; // Maximum number of columns per page
    const totalPages = Math.ceil(columns.length / maxColumnsPerPage); // Calculate total pages needed

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
      const startIdx = (currentPage - 1) * maxColumnsPerPage;
      const endIdx = Math.min(startIdx + maxColumnsPerPage, columns.length);

      const currentPageColumns = columns.slice(startIdx, endIdx);

      doc.autoTable({
        theme: "grid",
        styles: {
          fontSize: 5,
        },
        columns: currentPageColumns,
        body: rowDataTable,
      });

      if (currentPage < totalPages) {
        doc.addPage(); // Add a new page if there are more columns to display
      }
    }

    doc.save("Final Salary List.pdf");
  };
  const columnsTwo = [
    // Serial number column
    { title: "SNo", dataKey: "serialNumber" },
    { title: "Company", dataKey: "company" },
    { title: "Branch", dataKey: "branch" },
    { title: "Unit", dataKey: "unit" },
    { title: "Emp code", dataKey: "empcode" },

    { title: "TTS Name", dataKey: "employeename" },

    { title: "totalnumberofdays", dataKey: "totalnumberofdays" },
    { title: "Total Shift", dataKey: "totalshift" },
    { title: "Total Absent/Leave", dataKey: "totalasbleave" },
    { title: "Total Paid Days", dataKey: "totalpaidDays" },

    { title: "Target Points", dataKey: "targetpoints" },
    { title: "Achieved Points", dataKey: "achievedpoints" },
    { title: "Achieved %", dataKey: "achieved" },

    { title: "Penalty Amount", dataKey: "penaltyamount" },
    { title: "Pay on", dataKey: "salarytype" },
    { title: "Paid Status", dataKey: "paidstatus" },
    { title: "Pay Date", dataKey: "paydate" },
    { title: "Status", dataKey: "updatedpaidstatus" },
    { title: "Change Date", dataKey: "updatechangedate" },


    { title: "Pay Year", dataKey: "payyear" },
    { title: "Pay Month", dataKey: "paymonth" },

  ];

  const downloadPdfTwo = () => {
    const doc = new jsPDF({
      orientation: "landscape",
    });

    const maxColumnsPerPage = 15; // Maximum number of columns per page
    const totalPages = Math.ceil(columnsTwo.length / maxColumnsPerPage); // Calculate total pages needed

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
      const startIdx = (currentPage - 1) * maxColumnsPerPage;
      const endIdx = Math.min(startIdx + maxColumnsPerPage, columnsTwo.length);

      const currentPageColumns = columnsTwo.slice(startIdx, endIdx);

      doc.autoTable({
        theme: "grid",
        styles: {
          fontSize: 5,
        },
        columns: currentPageColumns,
        body: rowDataTableTwo,
      });

      if (currentPage < totalPages) {
        doc.addPage(); // Add a new page if there are more columns to display
      }
    }

    doc.save("Fix Salary Date List.pdf");
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Fix Salary Date  List",
    pageStyle: "print",
  });

  //print...
  const componentRefTwo = useRef();
  const handleprintTwo = useReactToPrint({
    content: () => componentRefTwo.current,
    documentTitle: "Fix Salary Date Confrim List",
    pageStyle: "print",
  });


  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);



  const [rowData, setRowData] = useState([]);


  const handleSubmit = async (e) => {
    setIsActive(true);
    try {

      let Res = await axios.post(SERVICE.HIERARCHI_SALARY_FILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        hierachy: modeselection.value,
        sector: sectorSelection.value,
        username: isUserRoleAccess.companyname,
        team: isUserRoleAccess.team,
      });

      if (Res.data.resultAccessFilter.length > 0) {


        let employees = Res.data.resultAccessFilter.map((item) => item.companyname);

        let Res_Data = await axios.post(SERVICE.FETCH_PAYRUNLIST_MONTHWISE, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },

          month: selectedMonth,
          year: String(selectedYear),
        });


        let mergedData = Res_Data.data.payrunlists.map(item => ({ data: item.data.map(t => ({ ...t, outerId: item._id })) })).map(d => d.data).flat();


        console.log(mergedData, 'mergedData')
        let mergedDatafinal = mergedData.filter(d => employees.includes(d.companyname) && d.sentfixsalary === "Yes")?.sort((a, b) => {
          // First, sort by experienceinmonth
          if (Number(b.experience) !== Number(a.experience)) {
            return Number(b.experience) - Number(a.experience);
          }
          // If experienceinmonth is the same, sort by employeename
          return a.companyname.localeCompare(b.companyname);
        });

        console.log(mergedDatafinal, 'mergedDatafinal');

        //secondtable
        let addserialnumberfilteredtwo = mergedDatafinal.filter(d => d.fixsalarydateconfirm === "Yes").reduce((acc, item) => {
          return acc.concat(item.logdata);
        }, []);
        // && !d.bankreleasestatus == "created" && !d.bankclose == "closed"
        console.log(addserialnumberfilteredtwo, 'addserialnumberfilteredtwo')
        let finalitemstwo = addserialnumberfilteredtwo.filter(d => d.statuspage === "fixsalary" && (d.status === "bankrelease" || d.status === "holdbankrelease")).map((item, index) => ({
          ...item,
          serialNumber: index + 1,
        }))
        setItemsTwo(finalitemstwo);

        let addserialnumberfiltered = mergedDatafinal.filter(d => d.fixsalarydateconfirm !== "Yes");

        let prodDateFix = await axios.post(SERVICE.PAIDDATEFIX_FITLERED, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          month: selectmonthname,
          year: selectedYear,
        });

        const paidDatesFixed = prodDateFix.data.paiddatefixs;
        console.log(paidDatesFixed)

        let res_employee = await axios.post(SERVICE.PAIDSTATUSFIX_FILTERED, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          month: selectmonthname,
          year: String(selectedYear),

        });

        let paidStatusFixDeptModeOnly = res_employee.data.paidstatusfixs;


        let addSerialNumber = addserialnumberfiltered.map((item, index) => {


          let paidStatusVal = item.paidstatus;

          let paydate = paidDatesFixed.find((data) => data.department[0] === item.department && paidStatusVal?.split("_")[1] === data.paymode);

          let deptFiltered = paidStatusFixDeptModeOnly.filter((d) => d.department.includes(item.department));

          const order = ["FIRST", "SECOND", "THIRD", "LAST", "HOLD", "REJECT", "ADV1", "ADV2", "MISS"];

          let sorted = deptFiltered.sort((a, b) => {
            // Dates are the same, sort by name according to the order array
            const nameA = order.indexOf(a.paidstatus?.split("_")[1]);
            const nameB = order.indexOf(b.paidstatus?.split("_")[1]);
            return nameA - nameB;
          });

          const inD = sorted.findIndex((item) => item.paidstatus.includes(paidStatusVal?.split("_")[1]));

          // Filter the array to get elements after the found index
          const resultStatus = sorted.slice(inD + 1);
          let finalresultStatus = resultStatus.map((item) => item.paidstatus);
          const order2 = ["FIRST", "SECOND", "THIRD", "LAST", "HOLD", "REJECT", "ADVANCE1", "ADVANCE2", "MISS"];

          let sortedDateFix = paidDatesFixed.filter((data) => data.department[0] === item.department).sort((a, b) => {
            // Dates are the same, sort by name according to the order array
            const nameA = order2.indexOf(a.paymode);
            const nameB = order2.indexOf(b.paymode);
            return nameA - nameB;
          });

          const inDDatefix = sortedDateFix.findIndex((item) => item.paymode.includes(paidStatusVal?.split("_")[1]));
          let currentDate = new Date();
          const resultStatusDatefix = sortedDateFix.slice(inDDatefix + 1);

          let finalresultStatusDatefix = resultStatusDatefix.map((item) => {
            let datevalue = new Date(item.date) < new Date(currentDate) && item.afterexpiry != "Enable";
            return (datevalue ? `${item.date}(Expired) Choose Next` : item.date)
          })

          let paydatesfinal = finalresultStatusDatefix;

          return {
            ...item,
            serialNumber: index + 1,
            paymonth: selectedMonth,
            payyear: (selectedYear),
            statusopt: finalresultStatus && finalresultStatus.length > 0 ? ["Choose Status", ...finalresultStatus] : ["Choose Status"],
            dateopt: paydatesfinal && paydatesfinal.length > 0 ? ["Choose Date", ...paydatesfinal] : ["Choose Date"],
            percentopt: [0, 15, 25, 50, 75, 90, 100],
            holdpercent: item.paidstatus.includes("HOLD") ? 100 : 0,
            status: "Choose Status",
            lossdeductionfinal: item.lossdeductionfinal ? item.lossdeductionfinal :
              item.salarytype === "Final Salary" ? item.lossdeduction : item.salarytype === "Final Salary" ? item.fixedlossdeduction : item.prodlossdeduction,
            otherdeductionfinal: item.otherdeductionfinal ? item.otherdeductionfinal : item.otherdeduction,
            paydate: paydate ? paydate.date : "",
            payonsalarytype: item.salarytypefinal ? item.salarytypefinal : item.salarytype,
            change: item.changestatus ? (item.changestatus === "No change in Data" ? "No" : "Yes") : "No",
            datefixes: paidDatesFixed.filter((data) => data.department[0] === item.department),
            updatedholdpercent: item.updatedholdpercent[item.updatedholdpercent.length - 1],
            paidstatus: item.paidstatus ? item.paidstatus : "",
            changedate: "Choose Date",
            finalusersalary: item.salarytype === "Final Salary" ? item.finalsalary : item.salarytype === "Final Salary" ? item.fixedsalary : item.prodsalary,
          }
        })


        setRowData(addSerialNumber);
        setFilteredData(addSerialNumber);
        setIsActive(false);
      }

      setIsActive(false);
      setUndoIds([])
      localStorage.removeItem("userIds")
    } catch (err) {
      console.log(err, 'err')
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p>
          </>
        );
        handleClickOpenerr();
      }
    }

  }


  // Split the search query into individual terms
  // const searchTerms = searchQuery.toLowerCase().split(" ");
  // // Modify the filtering logic to check each term
  // const filteredDatas = items?.filter((item) => {
  //   return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  // });

  // const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

  // const totalPages = Math.ceil(filteredDatas.length / pageSize);

  // const visiblePages = Math.min(totalPages, 3);

  // const firstVisiblePage = Math.max(1, page - 1);
  // const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

  // const pageNumbers = [];

  // const indexOfLastItem = page * pageSize;
  // const indexOfFirstItem = indexOfLastItem - pageSize;

  // for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
  //   pageNumbers.push(i);
  // }

  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );


  const gridApi = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const onQuickFilterChanged = useCallback((event) => {
    if (gridApi.current) {
      const filterText = event.target.value;
      gridApi.current.setQuickFilter(filterText);
      const filtered = rowData.filter(row => JSON.stringify(row).toLowerCase().includes(filterText.toLowerCase()));
      setFilteredData(filtered);
      setCurrentPage(1);
    }
  }, [rowData]);


  let minRowHeight = 25;
  let currentRowHeight;
  const onGridReady = useCallback((params) => {
    gridApi.current = params.api;
    columnApi.current = params.columnApi;
    minRowHeight = params.api.getSizesForCurrentTheme().rowHeight;
    currentRowHeight = minRowHeight;
  }, []);

  useEffect(() => {
    updateGridData();
  }, [currentPage, filteredData, pageSize]);

  const updateGridData = () => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    setCurrentData(filteredData.slice(start, end));
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page whenever page size changes
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage === 1) {
        pageNumbers.push(1, 2, 3);
      } else if (currentPage === totalPages) {
        pageNumbers.push(totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(currentPage - 1, currentPage, currentPage + 1);
      }
    }
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  const columnDataTable = [
    { headerName: "Sno", field: "serialNumber", sortable: true, width: 80, filter: true, resizable: true, pinned: "left" },

    { headerName: "Company", field: "company", width: 110, sortable: true, headerClass: 'header-wrap', filter: true, resizable: true },
    { headerName: "Branch", field: "branch", width: 110, sortable: true, headerClass: 'header-wrap', filter: true, resizable: true },
    { headerName: "Unit", field: "unit", width: 90, sortable: true, headerClass: 'header-wrap', filter: true, resizable: true },
    { headerName: "Empcode", field: "empcode", width: 140, sortable: true, headerClass: 'header-wrap', filter: true, resizable: true },

    // { headerName: "Aadhar Name", field: "legalname", sortable: true, filter: true, resizable: true, },
    { headerName: "TTS Name", field: "employeename", sortable: true, headerClass: 'header-wrap', filter: true, resizable: true, pinned: "left" },

    { headerName: "Total No.of Days", field: "totalnumberofdays", width: 100, headerClass: 'header-wrap', sortable: true, filter: true, resizable: true },
    { headerName: "Total Shift", field: "totalshift", sortable: true, width: 100, headerClass: 'header-wrap', filter: true, resizable: true },
    { headerName: "CLSL", field: "clsl", sortable: true, width: 90, filter: true, headerClass: 'header-wrap', resizable: true },
    { headerName: "Total Absent / Leave", field: "totalasbleave", width: 100, sortable: true, headerClass: 'header-wrap', filter: true, resizable: true },
    { headerName: "Total Paid Days", field: "totalpaidDays", width: 100, sortable: true, headerClass: 'header-wrap', filter: true, resizable: true },

    { headerName: "Target Points", field: "targetpoints", width: 100, sortable: true, headerClass: 'header-wrap', filter: true, resizable: true },
    { headerName: "Achieved Points", field: "achievedpoints", width: 110, sortable: true, headerClass: 'header-wrap', filter: true, resizable: true },
    { headerName: "Achieved", field: "achieved", width: 110, sortable: true, filter: true, headerClass: 'header-wrap', resizable: true },

    { headerName: "Penalty Amount", field: "penaltyamount", width: 100, sortable: true, filter: true, headerClass: 'header-wrap', resizable: true },
    { headerName: "Pay on", field: "payonsalarytype", width: 130, sortable: true, filter: true, headerClass: 'header-wrap', resizable: true },
    { headerName: "Pay Status", field: "paidstatus", sortable: true, filter: true, headerClass: 'header-wrap', resizable: true, },
    { headerName: "Paydate", field: "paydate", width: 110, sortable: true, filter: true, headerClass: 'header-wrap', resizable: true },


    {
      headerName: 'Status', field: 'status', editable: true, headerClass: 'header-wrap', cellEditor: 'agSelectCellEditor',

      cellEditorParams: (params) => {
        const rowData = params.node.data;
        const statusopt = rowData.statusopt;

        // Ensure statusopt is an array
        const dropdown1Values = Array.isArray(statusopt) ? statusopt : [];
        // console.log('Dropdown 1 values:', dropdown1Values); // Debugging line

        return {
          values: dropdown1Values
        };
      },
      valueSetter: (params) => {
        const newValue = params.newValue;
        // Retrieve the value selected in 'Status'
        params.data.holdpercent = params.newValue.includes("HOLD") ? 100 : params.data.holdpercent
        params.data.changedate = "Choose Date"
        params.data.status = newValue
        // Return true to indicate value was set successfully
        return true;
      }
    },
    // {
    //   headerName: 'Change Date', field: 'changedate', editable: true, headerClass: 'header-wrap', cellEditor: 'agSelectCellEditor',

    //   cellEditorParams: (params) => {
    //     const rowData = params.node.data;
    //     const statusopt = rowData.status;

    //     let resultStatusDatefix = rowData.datefixes.filter((item) => item.paymode.includes(statusopt?.split("_")[1]));
    //     let currentDate = new Date();

    //     let finalresultStatusDatefix = resultStatusDatefix.map((item) => {
    //       let datevalue = new Date(item.date) < new Date(currentDate)
    //       return (datevalue ? `${item.date}(Expired) Choose Next` : item.date)
    //     })

    //     // Ensure statusopt is an array
    //     const dropdown2Values = Array.isArray(["Choose Date", ...finalresultStatusDatefix]) ? ["Choose Date", ...finalresultStatusDatefix] : [];


    //     return {
    //       values: dropdown2Values
    //     };
    //   }

    // },
    {
      headerName: 'Change Date', field: 'changedate', editable: true, headerClass: 'header-wrap', cellEditor: 'agSelectCellEditor',

      cellEditorParams: (params) => {
        const rowData = params.node.data;
        const statusopt = rowData.status;
        const paystatus = rowData.paidstatus;

        // let resultStatusDatefix = rowData.datefixes.filter((item) => item.paymode.includes(statusopt?.split("_")[1]));
        let resultStatusDatefix = statusopt === "Choose Status" ?
          rowData.datefixes.filter(item => item.paymode.includes(paystatus?.split("_")[1]))
          : rowData.datefixes.filter(item => item.paymode.includes(statusopt?.split("_")[1])
          );

        let currentDate = new Date();

        let finalresultStatusDatefix = resultStatusDatefix.map((item) => {
          const datevalue = new Date(item.date) < currentDate && item.afterexpiry != "Enable";
          return {
            value: item.date,
            label: datevalue ? `${item.date} (Expired)` : item.date,
            expired: datevalue
          };
        });

        return {
          values: ["Choose Date", ...finalresultStatusDatefix.map(item => item.label)], // Only return value for the dropdown


        };

      },

      valueSetter: (params) => {
        // console.log("New Value:", params.newValue);
        // console.log("Current Data Before Change:", params.data);
        if (params.newValue.includes("(Expired)")) {

          alert("You cannot select an expired date. Please Choose Next Date")
          if (params.data.changedate && params.data.changedate.includes("(Expired)")) {
            params.data.changedate = "Choose Date"
          }
          return false;
        } else {
          params.data.changedate = params.newValue
          return true;
        }

      }

    },


    { headerName: "Pay Year", field: "payyear", width: 100, sortable: true, filter: true, headerClass: 'header-wrap', resizable: true },
    { headerName: "Pay Month", field: "paymonth", width: 110, sortable: true, filter: true, headerClass: 'header-wrap', resizable: true },
    {
      headerName: "Hold %", field: "holdpercent", width: 100, suppressClickEdit: true, headerClass: 'header-wrap', sortable: true, editable: true, cellEditor: 'agSelectCellEditor', filter: true, resizable: true,
      cellEditorParams: (params) => {
        const rowData = params.node.data;
        const percentOpt = rowData.percentopt;

        // Ensure statusopt is an array
        const holdValues = Array.isArray(percentOpt) ? percentOpt : [];
        // console.log('Dropdown 1 values:', dropdown1Values); // Debugging line

        return {
          values: holdValues
        };
      }
    },


    {
      headerName: "Reason", field: "reason", editable: true, suppressClickEdit: true, sortable: true,
      filter: true, resizable: true,
      cellEditor: 'agTextCellEditor',
      suppressDestroy: true,

    },

    {
      headerName: 'Confirmation',
      field: 'confirmation',
      cellRenderer: ButtonCellRenderer,
      editable: false,

    },
    { headerName: "Change", field: "change", sortable: true, width: 100, filter: true, headerClass: 'header-wrap', resizable: true },
    { headerName: "BankName", field: "bankname", sortable: true, filter: true, headerClass: 'header-wrap', resizable: true },
    { headerName: "AccountName", field: "accountholdername", sortable: true, filter: true, headerClass: 'header-wrap', resizable: true },
    { headerName: "AccountNo", field: "accountnumber", sortable: true, filter: true, headerClass: 'header-wrap', resizable: true },
    { headerName: "IFSC Code", field: "ifsccode", sortable: true, filter: true, headerClass: 'header-wrap', resizable: true },
    { headerName: "Loss Deduction", field: "lossdeductionfinal", sortable: true, filter: true, headerClass: 'header-wrap', resizable: true },
    { headerName: "Other Deduction", field: "otherdeductionfinal", sortable: true, filter: true, headerClass: 'header-wrap', resizable: true },
    { headerName: `Current (${monthNames[Number(selectedMonthNum) >= 12 ? 0 : Number(selectedMonthNum)]}) Month Avg`, field: "currentmonthavg", sortable: true, headerClass: 'header-wrap', filter: true, resizable: true },
    { headerName: `Current (${monthNames[Number(selectedMonthNum) >= 12 ? 0 : Number(selectedMonthNum)]}) Month  Att`, field: "currentmonthattendance", sortable: true, headerClass: 'header-wrap', filter: true, resizable: true },
  ]

  const rowDataTable = currentData.map((item, index) => {
    return {
      ...item,
      id: item._id,
      index: index,
      change: item.change,
      employeename: item.companyname,
      aadharname: item.legalname,
      processcode: item.processcodeexp,
      payonsalarytype: item.payonsalarytype,
      experienceinmonth: item.experience,
      prodexp: item.prodexp,

      gross: item.oldgross,

      newgross: item.gross,
      actualbasic: item.basic,
      actualhra: item.hra,
      actualconveyance: item.conveyance,
      actualmedicalallowance: item.medicalallowance,
      actualproductionallowance: item.productionallowance,
      actualproductionallowancetwo: item.productionallowancetwo,
      actualotherallowance: item.otherallowance,

      targetpoints: item.monthPoint,
      achievedpoints: item.acheivedpoints,
      achieved: item.acheivedpercent,
      achievedproductionallowance: item.acheivedproductionallowance,

      actualpenaltyamount: item.penalty,

      noallowanceshift: item.noallowancepoint,
      shiftallowancepoint: item.allowancepoint,

      totalpointsvalue: item.totalpointsvalue,
      era: item.eramount,
      actualera: item.era,

      revenueallowance: item.revenueallow,
      prodnetsalary: item.prodnetsalary,
    };
  })

  const context = {
    employees: rowData.map(d => d.companyname)
  }

  const gridRefnew = useRef();

  const columnApi = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const isPopoverOpen = Boolean(anchorEl);

  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseManageColumns = () => {
    setAnchorEl(null);
  };

  const [columnVisibility, setColumnVisibility] = useState(
    columnDataTable.reduce((acc, col) => {
      acc[col.field] = !col.hide;
      return acc;
    }, {})
  );

  const toggleColumnVisibility = (field) => {
    const newVisibility = !columnVisibility[field];
    setColumnVisibility({
      ...columnVisibility,
      [field]: newVisibility
    });
    gridRefnew.current.columnApi.setColumnVisible(field, newVisibility);
  };

  // Show All Columns functionality
  const handleShowAllColumns = () => {
    const updatedVisibility = { ...columnVisibility };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibility(updatedVisibility);
  };

  const filteredColumns = columnDataTable.filter(col =>
    col.headerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const initialColumnVisibility = columnDataTable.reduce((acc, col) => {
    acc[col.field] = true;
    return acc;
  }, {});

  const manageColumnsContent = (
    <Box style={{ padding: '10px', minWidth: '325px' }}>
      <Typography variant="h6">Manage Columns</Typography>
      <IconButton
        aria-label="close"
        onClick={handleCloseManageColumns}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <Box sx={{ position: 'relative', margin: '10px' }}>
        <TextField
          label="Find column"
          variant="standard"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ marginBottom: 5, position: 'absolute' }}
        />
      </Box>
      <br />
      <br />
      <DialogContent sx={{ minWidth: 'auto', height: '200px', position: 'relative' }}>
        <List sx={{ overflow: 'auto', height: '100%' }}>
          {filteredColumns.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: 'flex' }}
                primary={
                  <Switch
                    sx={{ marginTop: '-5px' }}
                    size="small"
                    checked={columnVisibility[column.field]}
                    onChange={() => toggleColumnVisibility(column.field)}
                  />
                }
                secondary={column.headerName}
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
              sx={{ textTransform: 'none' }}
              onClick={() => {
                const newColumnVisibility = {};
                columnDataTable.forEach((column) => {
                  newColumnVisibility[column.field] = true;
                });
                setColumnVisibility(newColumnVisibility);
                columnDataTable.forEach((column) => {
                  gridRefnew.current.columnApi.setColumnVisible(column.field, true);
                });
              }}
            >
              Show All
            </Button>
          </Grid>
          <Grid item md={4}></Grid>
          <Grid item md={4}>
            <Button
              variant="text"
              sx={{ textTransform: 'none' }}
              onClick={() => {
                const newColumnVisibility = {};
                columnDataTable.forEach((column) => {
                  newColumnVisibility[column.field] = false;
                });
                setColumnVisibility(newColumnVisibility);
                columnDataTable.forEach((column) => {
                  gridRefnew.current.columnApi.setColumnVisible(column.field, false);
                });
              }}
            >
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

  //Datatable
  const handlePageChangeTwo = (newPage) => {
    setPageTwo(newPage);
    setSelectedRowsTwo([]);
    setSelectAllCheckedTwo(false);
  };

  const handlePageSizeChangeTwo = (event) => {
    setPageSizeTwo(Number(event.target.value));
    setSelectedRowsTwo([]);
    setSelectAllCheckedTwo(false);
    setPageTwo(1);
  };

  //datatable....
  const handleSearchChangeTwo = (event) => {
    setSearchQueryTwo(event.target.value);
  };
  // Split the search query into individual terms
  const searchTermsTwo = searchQueryTwo.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatasTwo = itemsTwo?.filter((item) => {
    return searchTermsTwo.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  let filteredDataTwo = filteredDatasTwo.slice((pageTwo - 1) * pageSizeTwo, pageTwo * pageSizeTwo);

  const totalPagesTwo = Math.ceil(filteredDatasTwo.length / pageSizeTwo);

  const visiblePagesTwo = Math.min(totalPagesTwo, 3);

  const firstVisiblePageTwo = Math.max(1, pageTwo - 1);
  const lastVisiblePageTwo = Math.min(firstVisiblePageTwo + visiblePagesTwo - 1, totalPagesTwo);

  const pageTwoNumbersTwo = [];

  const indexOfLastItemTwo = pageTwo * pageSizeTwo;
  const indexOfFirstItemTwo = indexOfLastItemTwo - pageSizeTwo;

  for (let i = firstVisiblePageTwo; i <= lastVisiblePageTwo; i++) {
    pageTwoNumbersTwo.push(i);
  }

  // DATATABLETWO
  const columnDataTableTwo = [
    {
      field: "checkbox",
      headerName: "Checkbox", // Default header name
      headerStyle: {
        fontWeight: "bold", // Apply the font-weight style to make the header text bold
        // Add any other CSS styles as needed
      },
      renderHeader: (params) => (
        <CheckboxHeader
          selectAllCheckedTwo={selectAllCheckedTwo}
          onSelectAll={() => {
            if (rowDataTableTwo.length === 0) {
              // Do not allow checking when there are no rows
              return;
            }
            if (selectAllCheckedTwo) {
              setSelectedRowsTwo([]);
            } else {
              const allRowIds = rowDataTableTwo.map((row) => row.id);
              setSelectedRowsTwo(allRowIds);
            }
            setSelectAllCheckedTwo(!selectAllCheckedTwo);
          }}
        />
      ),

      renderCell: (params) => (
        <Checkbox
          checked={selectedRowsTwo.includes(params.row.id)}
          onChange={() => {
            let updatedSelectedRows;
            if (selectedRowsTwo.includes(params.row.id)) {
              updatedSelectedRows = selectedRowsTwo.filter((selectedId) => selectedId !== params.row.id);
            } else {
              updatedSelectedRows = [...selectedRowsTwo, params.row.id];
            }

            setSelectedRowsTwo(updatedSelectedRows);

            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllCheckedTwo(updatedSelectedRows.length === filteredDataTwo.length);
          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 50,

      hide: !columnVisibilityTwo.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 60,
      hide: !columnVisibilityTwo.serialNumber,
      headerClassName: "bold-header",
    },

    {
      field: "actions",
      headerName: "Actions",
      flex: 0,
      width: 100,
      hide: !columnVisibilityTwo.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Button variant="contained" size="small" sx={{ border: undoIds.includes(params.row.id) ? "1px solid #1976d2" : "inherit" }} disabled={undoIds.includes(params.row.id)} onClick={(e) => undoSubmit(params.row.innerId, params.row.outerId, params.row.id)}>
          {undoIds.includes(params.row.id) ? "Updated" : "Undo"}
        </Button>
      ),
    },
    { field: "company", headerName: "Company", flex: 0, width: 80, hide: !columnVisibilityTwo.company, headerClassName: "bold-header" },
    { field: "branch", headerName: "Branch", flex: 0, width: 110, hide: !columnVisibilityTwo.branch, headerClassName: "bold-header" },
    { field: "unit", headerName: "Unit", flex: 0, width: 80, hide: !columnVisibilityTwo.unit, headerClassName: "bold-header" },
    { field: "empcode", headerName: "Empcode", flex: 0, width: 130, hide: !columnVisibilityTwo.empcode, headerClassName: "bold-header" },
    { field: "employeename", headerName: "TTS Name", flex: 0, width: 220, hide: !columnVisibilityTwo.employeename, headerClassName: "bold-header" },

    { field: "totalnumberofdays", headerName: "Total No.of Days", flex: 0, width: 80, hide: !columnVisibilityTwo.totalnumberofdays, headerClassName: "bold-header" },
    { field: "totalshift", headerName: "Total Shift", flex: 0, width: 80, hide: !columnVisibilityTwo.totalshift, headerClassName: "bold-header" },
    { field: "clsl", headerName: "C.L. / S.L.", flex: 0, width: 80, hide: !columnVisibilityTwo.clsl, headerClassName: "bold-header" },
    { field: "totalasbleave", headerName: "Total Absent/ Leave Shift", flex: 0, width: 80, hide: !columnVisibilityTwo.totalasbleave, headerClassName: "bold-header" },
    { field: "totalpaidDays", headerName: "Total Paid Shift", flex: 0, width: 80, hide: !columnVisibilityTwo.totalpaidDays, headerClassName: "bold-header" },

    { field: "targetpoints", headerName: "Target Points", flex: 0, width: 100, hide: !columnVisibilityTwo.targetpoints, headerClassName: "bold-header" },
    { field: "achievedpoints", headerName: "Achieved Points", flex: 0, width: 100, hide: !columnVisibilityTwo.achievedpoints, headerClassName: "bold-header" },
    { field: "achieved", headerName: "Achieved %", flex: 0, width: 100, hide: !columnVisibilityTwo.achieved, headerClassName: "bold-header" },

    { field: "penaltyamount", headerName: "Penalty Amount", flex: 0, width: 100, hide: !columnVisibilityTwo.penaltyamount, headerClassName: "bold-header" },

    { field: "payonsalarytype", headerName: "Pay on", flex: 0, width: 140, hide: !columnVisibilityTwo.salarytype, headerClassName: "bold-header" },
    { field: "paidstatus", headerName: "Paid Status", flex: 0, width: 200, hide: !columnVisibilityTwo.paidstatus },
    { field: "paydate", headerName: "Pay Date", flex: 0, width: 110, hide: !columnVisibilityTwo.paydate },

    {
      field: "updatedpaidstatus",
      headerName: "Status",
      flex: 0,
      width: 200,
      hide: !columnVisibilityTwo.updatedpaidstatus,
    },

    {
      field: "updatechangedate",
      headerName: "Changed Date",
      flex: 0,
      width: 110,
      hide: !columnVisibilityTwo.updatechangedate,
    },
    { field: "payyear", headerName: "Pay Year", flex: 0, width: 110, hide: !columnVisibilityTwo.payyear },
    { field: "paymonth", headerName: "Pay Month", flex: 0, width: 110, hide: !columnVisibilityTwo.paymonth },
    {
      field: "updatedholdpercent",
      headerName: "Hold %",
      flex: 0,
      width: 110,
      hide: !columnVisibilityTwo.updatedholdpercent,
    },
    {
      field: "updatedreason",
      headerName: "Reason",
      flex: 0,
      width: 150,
      hide: !columnVisibilityTwo.updatedreason,
    },


  ];

  const rowDataTableTwo = filteredDataTwo.map((item, index) => {
    return {
      ...item,
      id: item._id,
      index: index,

      employeename: item.companyname,
      aadharname: item.legalname,
      processcode: item.processcodeexp,

      // weekoff: weekoffcount,
      experienceinmonth: item.experience,
      prodexp: item.prodexp,

      targetpoints: item.targetpoints,
      achievedpoints: item.acheivedpoints,
      achieved: item.acheivedpercent,

    };
  });

  const rowsWithCheckboxesTwo = rowDataTableTwo.map((row) => ({
    ...row,

    checkbox: selectedRowsTwo.includes(row.id),
  }));

  // Show All Columns functionality
  const handleShowAllColumnsTwo = () => {
    const updatedVisibilityTwo = { ...columnVisibilityTwo };
    for (const columnKey in updatedVisibilityTwo) {
      updatedVisibilityTwo[columnKey] = true;
    }
    setColumnVisibilityTwo(updatedVisibilityTwo);
  };

  useEffect(() => {
    // Retrieve column VisibilityTwo from localStorage (if available)
    const savedVisibilityTwo = localStorage.getItem("columnVisibilityTwo");
    if (savedVisibilityTwo) {
      setColumnVisibilityTwo(JSON.parse(savedVisibilityTwo));
    }
  }, []);

  useEffect(() => {
    // Save column VisibilityTwo to localStorage whenever it changes
    localStorage.setItem("columnVisibilityTwo", JSON.stringify(columnVisibilityTwo));
  }, [columnVisibilityTwo]);

  // // Function to filter columns based on search query
  const filteredColumnsTwo = columnDataTableTwo.filter((column) => column.headerName.toLowerCase().includes(searchQueryManageTwo.toLowerCase()));

  // ManageTwo Columns functionality
  const toggleColumnVisibilityTwo = (field) => {
    setColumnVisibilityTwo((prevVisibilityTwo) => ({
      ...prevVisibilityTwo,
      [field]: !prevVisibilityTwo[field],
    }));
  };

  // JSX for the "ManageTwo Columns" popover content
  const manageColumnsContentTwo = (
    <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
      <Typography variant="h6">ManageTwo Columns</Typography>
      <IconButton
        aria-label="close"
        onClick={handleCloseManageTwoColumns}
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
        <TextField label="Find column" variant="standard" fullWidth value={searchQueryManageTwo} onChange={(e) => setSearchQueryManageTwo(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
      </Box>
      <br />
      <br />
      <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumnsTwo.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibilityTwo[column.field]} onChange={() => toggleColumnVisibilityTwo(column.field)} />}
                secondary={column.field === "checkbox" ? "Checkbox" : column.headerName}
              // secondary={column.headerName }
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Grid container>
          <Grid item md={4}>
            <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibilityTwo(initialColumnVisibilityTwo)}>
              Show All
            </Button>
          </Grid>
          <Grid item md={4}></Grid>
          <Grid item md={4}>
            <Button
              variant="text"
              sx={{ textTransform: "none" }}
              onClick={() => {
                const newColumnVisibilityTwo = {};
                columnDataTableTwo.forEach((column) => {
                  newColumnVisibilityTwo[column.field] = false; // Set hide property to true
                });
                setColumnVisibilityTwo(newColumnVisibilityTwo);
              }}
            >
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

  const [undoIds, setUndoIds] = useState([]);

  const undoSubmit = async (innerId, outerId, id) => {
    try {
      let res = await axios.post(`${SERVICE.UPDATE_UNDO_FIELDNAME_CONFIRMLIST}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        innerId: innerId,
        outerId: outerId
      });
      setUndoIds(prev => [...prev, id])
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
      } else {
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


  return (
    <Box>
      <Headtitle title={"Fix Salary Date"} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}> Fix Salary Date</Typography>
      {isUserRoleCompare?.includes("afixsalarydate") && (
        <>
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>

                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item lg={2} md={2.5} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Mode<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={modeDropDowns}
                      value={{ label: modeselection.label, value: modeselection.value }}
                      onChange={(e) => {
                        setModeSelection(e);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={2} md={2.5} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Level<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={sectorDropDowns}
                      value={{ label: sectorSelection.label, value: sectorSelection.value }}
                      onChange={(e) => {
                        setSectorSelection(e);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Year<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects options={years} value={{ label: selectedYear, value: selectedYear }} onChange={handleYearChange} />
                  </FormControl>
                </Grid>
                <Grid item md={2} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Month <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects options={selectedYear === "Select Year" ? [] : months} value={{ label: selectmonthname, value: selectmonthname }} onChange={handleMonthChange} />
                  </FormControl>
                </Grid>
              </Grid>
              <br /> <br />
              <Grid item md={12} sm={12} xs={12}>
                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "15px",
                  }}
                >
                  <Button variant="contained" disabled={isActive === true} onClick={(e) => handleSubmit(e)}>
                    Filter
                  </Button>
                  <Button sx={userStyle.btncancel} onClick={handleClear}>
                    CLEAR
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </>
      )}
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lfixsalarydate") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Pay Run-Details:</Typography>
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
                    <MenuItem value={rowData?.length}>All</MenuItem>
                  </Select>
                </Box>
              </Grid>
              <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box>
                  {isUserRoleCompare?.includes("excelfixsalarydate") && (
                    <>
                      <ExportXL
                        csvData={rowDataTable.map((t, index) => ({
                          Sno: index + 1,
                          Company: t.company,
                          Branch: t.branch,
                          Unit: t.unit,
                          Empcode: t.empcode,
                          "TTS Name": t.employeename,

                          "Total No Of Days": Number(t.totalnumberofdays),
                          "Total Shift": Number(t.totalshift),
                          CLSL: Number(t.clsl),
                          "Total Absent/Leave": Number(t.totalasbleave),
                          "Total Paid Dyas": Number(t.totalpaidDays),

                          "Target Points": Number(t.targetpoints),
                          "Achieved Points": Number(t.achievedpoints),
                          "Achieved  %": Number(t.achieved),

                          "Penalty Amount": Number(t.penaltyamount),

                          "Pay on": t.payonsalarytype,
                          "Pay Status": t.paidstatus,
                          "Pay Date": t.paydate,
                          "Status": t.updatedpaidstatus,
                          "Change Date": t.updatedchangedate,
                          "Pay Year": t.payyear,
                          "Pay Month": t.paymonth,
                          "Hold %": t.holdpercent,
                          "Reason": t.updatedreason,

                          "Change": t.change,

                          "Bank Name": (t.bankname),
                          "Account Name": (t.accountholdername),
                          "Account No": (t.accountno),
                          "IFSC Code": (t.ifsccode),


                          "Loss Deduction": Number(t.lossdeductionfinal),
                          "Other Deduction": Number(t.otherdeductionfinal),

                          [`Current (${monthNames[Number(selectedMonthNum) >= 12 ? 0 : Number(selectedMonthNum)]}) Month Avg`]: Number(t.currentmonthavg),
                          [`Current (${monthNames[Number(selectedMonthNum) >= 12 ? 0 : Number(selectedMonthNum)]}) Month Attendance`]: Number(t.currentmonthattendance),



                        }))}
                        fileName={"Fix salay Date List"}
                      />
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvfixsalarydate") && (
                    <>
                      <ExportCSV
                        csvData={rowDataTable.map((t, index) => ({
                          Sno: index + 1,
                          Company: t.company,
                          Branch: t.branch,
                          Unit: t.unit,
                          Empcode: t.empcode,
                          "TTS Name": t.employeename,

                          "Total No Of Days": Number(t.totalnumberofdays),
                          "Total Shift": Number(t.totalshift),
                          CLSL: Number(t.clsl),
                          "Total Absent/Leave": Number(t.totalasbleave),
                          "Total Paid Dyas": Number(t.totalpaidDays),

                          "Target Points": Number(t.targetpoints),
                          "Achieved Points": Number(t.achievedpoints),
                          "Achieved  %": Number(t.achieved),

                          "Penalty Amount": Number(t.penaltyamount),

                          "Pay on": t.payonsalarytype,
                          "Pay Status": t.paidstatus,
                          "Pay Date": t.paydate,
                          "Status": t.updatedpaidstatus,
                          "Change Date": t.updatedchangedate,
                          "Pay Year": t.payyear,
                          "Pay Month": t.paymonth,
                          "Hold %": t.holdpercent,
                          "Reason": t.updatedreason,

                          "Change": t.change,

                          "Bank Name": (t.bankname),
                          "Account Name": (t.accountholdername),
                          "Account No": (t.accountno),
                          "IFSC Code": (t.ifsccode),


                          "Loss Deduction": Number(t.lossdeductionfinal),
                          "Other Deduction": Number(t.otherdeductionfinal),

                          [`Current (${monthNames[Number(selectedMonthNum) >= 12 ? 0 : Number(selectedMonthNum)]}) Month Avg`]: Number(t.currentmonthavg),
                          [`Current (${monthNames[Number(selectedMonthNum) >= 12 ? 0 : Number(selectedMonthNum)]}) Month Attendance`]: Number(t.currentmonthattendance),



                        }))}
                        fileName={"Fix salay Date List"}
                      />
                    </>
                  )}
                  {isUserRoleCompare?.includes("printfixsalarydate") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdffixsalarydate") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}>
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imagefixsalarydate") && (
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImageNew}>
                      {" "}
                      <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                    </Button>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={6} sm={6}>
                <OutlinedInput
                  size="small"
                  variant="outlined"
                  onChange={onQuickFilterChanged}
                  style={{ width: '100%' }}
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
            <Popover
              open={isPopoverOpen}
              anchorEl={anchorEl}
              onClose={handleCloseManageColumns}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              {manageColumnsContent}
            </Popover>

            <br />
            {isActive ? (
              <>
                <Box sx={{ display: "flex", justifyContent: "center" }}>

                  <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                </Box>
              </>
            ) : (
              <>
                <Box
                  style={{
                    // height: 500,
                    width: "100%",
                  }}
                  className="ag-theme-quartz"
                  ref={gridRefContainer}
                >

                  <AgGridReact
                    columnDefs={columnDataTable}
                    ref={gridRefnew}
                    rowData={rowDataTable}
                    context={context}
                    getRowId={(params) => params.data.id}
                    // onCellValueChanged={handleCellValueChanged}
                    onGridReady={onGridReady}
                    // onCellValueChanged={handleCellValueChanged}
                    // onGridReady={(params) => {
                    //     // params.api.sizeColumnsToFit();
                    //     gridApi.current = params.api;
                    //     columnApi.current = params.columnApi;
                    // }}
                    headerHeight={60}
                    domLayout={"autoHeight"}
                  />

                </Box>

                <Box style={userStyle.dataTablestyle}>
                  <Box>
                    Showing {filteredData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} entries
                  </Box>
                  <Box>
                    <Button onClick={() => handlePageChange(1)} disabled={currentPage === 1} sx={userStyle.paginationbtn}>
                      <FirstPageIcon />
                    </Button>
                    <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} sx={userStyle.paginationbtn}>
                      <NavigateBeforeIcon />
                    </Button>
                    {pageNumbers[0] > 1 && <span>...</span>}
                    {pageNumbers.map((pageNumber) => (
                      <Button
                        key={pageNumber}
                        sx={userStyle.paginationbtn}
                        onClick={() => handlePageChange(pageNumber)}
                        className={currentPage === pageNumber ? 'active' : ''}
                        disabled={currentPage === pageNumber}
                      >
                        {pageNumber}
                      </Button>
                    ))}
                    {pageNumbers[pageNumbers.length - 1] < totalPages && <span>...</span>}
                    <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} sx={userStyle.paginationbtn}>
                      <NavigateNextIcon />
                    </Button>
                    <Button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} sx={userStyle.paginationbtn}>
                      <LastPageIcon />
                    </Button>

                  </Box>
                </Box>
              </>
            )}
          </Box>
        </>
      )}
      <br />
      {/* ****** Table TWO Start ****** */}
      {isUserRoleCompare?.includes("lfixsalarydate") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Confirm Pay Run-Details:</Typography>
            </Grid>
            <br />
            <Grid container spacing={2} style={userStyle.dataTablestyle}>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <label>Show entries:</label>
                  <Select
                    id="pageSizeTwoSelect"
                    value={pageSizeTwo}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 180,
                          width: 80,
                        },
                      },
                    }}
                    onChange={handlePageSizeChangeTwo}
                    sx={{ width: "77px" }}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                    <MenuItem value={itemsTwo?.length}>All</MenuItem>
                  </Select>
                </Box>
              </Grid>
              <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box>
                  {isUserRoleCompare?.includes("excelfixsalarydate") && (
                    <>
                      <ExportXL
                        csvData={rowDataTableTwo.map((t, index) => ({
                          Sno: index + 1,
                          Company: t.company,
                          Branch: t.branch,
                          Unit: t.unit,
                          Empcode: t.empcode,
                          "TTS Name": t.employeename,

                          "Total No Of Days": Number(t.totalnumberofdays),
                          "Total Shift": Number(t.totalshift),
                          CLSL: Number(t.clsl),
                          "Total Absent/Leave": Number(t.totalasbleave),
                          "Total Paid Days": Number(t.totalpaidDays),

                          "Target Points": Number(t.targetpoints),
                          "Achieved Points": Number(t.achievedpoints),
                          "Achieved  %": Number(t.achieved),


                          "Penalty Amount": Number(t.penaltyamount),

                          "Pay on": t.salarytype,
                          "Pay Status": t.paidstatus,
                          "Pay Date": t.paydate,
                          "Status": t.updatedpaidstatus,
                          "Change Date": t.updatedchangedate,
                          "Pay Year": t.payyear,
                          "Pay Month": t.paymonth,
                          "Hold %": t.holdpercent,
                          "Reason": t.updatedreason,


                        }))}
                        fileName={"Fix salay Date Confirm List"}
                      />
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvfixsalarydate") && (
                    <>
                      <ExportCSV
                        csvData={rowDataTableTwo.map((t, index) => ({
                          Sno: index + 1,
                          Company: t.company,
                          Branch: t.branch,
                          Unit: t.unit,
                          Empcode: t.empcode,
                          "TTS Name": t.employeename,

                          "Total No Of Days": Number(t.totalnumberofdays),
                          "Total Shift": Number(t.totalshift),
                          CLSL: Number(t.clsl),
                          "Total Absent/Leave": Number(t.totalasbleave),
                          "Total Paid Days": Number(t.totalpaidDays),

                          "Target Points": Number(t.targetpoints),
                          "Achieved Points": Number(t.achievedpoints),
                          "Achieved  %": Number(t.achieved),


                          "Penalty Amount": Number(t.penaltyamount),

                          "Pay on": t.salarytype,
                          "Pay Status": t.paidstatus,
                          "Pay Date": t.paydate,
                          "Status": t.updatedpaidstatus,
                          "Change Date": t.updatedchangedate,
                          "Pay Year": t.payyear,
                          "Pay Month": t.paymonth,
                          "Hold %": t.holdpercent,
                          "Reason": t.updatedreason,


                        }))}
                        fileName={"Fix salay Date Confirm List"}
                      />
                    </>
                  )}
                  {isUserRoleCompare?.includes("printfixsalarydate") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprintTwo}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdffixsalarydate") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={() => downloadPdfTwo()}>
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imagefixsalarydate") && (
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                      {" "}
                      <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                    </Button>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={6} sm={6}>
                <Box>
                  <FormControl fullWidth size="small">
                    <Typography>Search</Typography>
                    <OutlinedInput id="component-outlined" type="text" value={searchQueryTwo} onChange={handleSearchChangeTwo} />
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
            <br />
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsTwo}>
              Show All Columns
            </Button>
            &ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageTwoColumns}>
              Manage Columns
            </Button>
            &ensp;
            {/* Manage Column */}
            <Popover
              id={idTwo}
              open={isManageColumnsOpenTwo}
              anchorEl={anchorElTwo}
              onClose={handleCloseManageTwoColumns}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              {manageColumnsContentTwo}
            </Popover>
            {/* {isUserRoleCompare?.includes("bdfixsalarydate") && (
                            <Button variant="contained" color="error" onClick={handleClickOpenalert} >Bulk Delete</Button>)} */}
            <br />
            <br />
            {isActive ? (
              <>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  {/* <CircularProgress color="inherit" />  */}
                  <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
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
                    onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                    //stop autoscroll
                    disableVirtualization
                    rows={rowsWithCheckboxesTwo}
                    columns={columnDataTableTwo.filter((column) => columnVisibilityTwo[column.field])}
                    onSelectionModelChange={handleSelectionChange}
                    selectionModel={selectedRows}
                    autoHeight={true}
                    ref={gridRef}
                    density="compact"
                    hideFooter
                    getRowClassName={getRowClassName}
                    disableRowSelectionOnClick
                  />
                </Box>
                <Box style={userStyle.dataTablestyle}>
                  <Box>
                    Showing {filteredDataTwo.length > 0 ? (pageTwo - 1) * pageSizeTwo + 1 : 0} to {Math.min(pageTwo * pageSizeTwo, filteredDatasTwo.length)} of {filteredDatasTwo.length} entries
                  </Box>
                  <Box>
                    <Button onClick={() => setPageTwo(1)} disabled={pageTwo === 1} sx={userStyle.paginationbtn}>
                      <FirstPageIcon />
                    </Button>
                    <Button onClick={() => handlePageChangeTwo(pageTwo - 1)} disabled={pageTwo === 1} sx={userStyle.paginationbtn}>
                      <NavigateBeforeIcon />
                    </Button>
                    {pageTwoNumbersTwo?.map((pageTwoNumber) => (
                      <Button key={pageTwoNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChangeTwo(pageTwoNumber)} className={pageTwo === pageTwoNumber ? "active" : ""} disabled={pageTwo === pageTwoNumber}>
                        {pageTwoNumber}
                      </Button>
                    ))}
                    {lastVisiblePage < totalPagesTwo && <span>...</span>}
                    <Button onClick={() => handlePageChangeTwo(pageTwo + 1)} disabled={pageTwo === totalPagesTwo} sx={userStyle.paginationbtn}>
                      <NavigateNextIcon />
                    </Button>
                    <Button onClick={() => setPageTwo(totalPagesTwo)} disabled={pageTwo === totalPagesTwo} sx={userStyle.paginationbtn}>
                      <LastPageIcon />
                    </Button>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </>
      )}
      <Box>
        {/* print layout */}
        <TableContainer component={Paper} sx={userStyle.printcls}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
            <TableHead>
              <TableRow>
                <TableCell>S.no</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Branch</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Empcode</TableCell>
                <TableCell>TTS Name</TableCell>

                <TableCell>Total No of Dyas</TableCell>
                <TableCell>Total Shift</TableCell>
                <TableCell>CLSL</TableCell>
                <TableCell>Total Absent/Leave</TableCell>
                <TableCell>Total Paid Days</TableCell>


                <TableCell>Target Points</TableCell>
                <TableCell>Achieved Points</TableCell>
                <TableCell>Achieved %</TableCell>


                <TableCell>Penalty Amount</TableCell>


                <TableCell>Pay on</TableCell>
                <TableCell>Paid Status</TableCell>
                <TableCell>Pay Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Change Date</TableCell>
                <TableCell>Pay Year</TableCell>
                <TableCell>Pay Month</TableCell>
                <TableCell>Hold %</TableCell>
                <TableCell>Reason</TableCell>


              </TableRow>
            </TableHead>
            <TableBody align="left">
              {rowDataTable &&
                rowDataTable.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.company}</TableCell>
                    <TableCell>{row.branch}</TableCell>
                    <TableCell>{row.unit}</TableCell>
                    <TableCell>{row.empcode}</TableCell>

                    <TableCell>{row.employeename}</TableCell>


                    <TableCell>{row.totalnumberofdays}</TableCell>
                    <TableCell>{row.totalshift}</TableCell>
                    <TableCell>{row.clsl}</TableCell>
                    <TableCell>{row.totalasbleave}</TableCell>
                    <TableCell>{row.totalpaidDays}</TableCell>

                    <TableCell>{row.targetpoints}</TableCell>
                    <TableCell>{row.achievedpoints}</TableCell>
                    <TableCell>{row.achieved}</TableCell>

                    <TableCell>{row.penaltyamount}</TableCell>

                    <TableCell>{row.salarytype}</TableCell>
                    <TableCell>{row.paidstatus}</TableCell>
                    <TableCell>{row.paydate}</TableCell>
                    <TableCell>{row.updatedpaidstatus}</TableCell>
                    <TableCell>{row.updatechangedate}</TableCell>
                    <TableCell>{row.payyear}</TableCell>
                    <TableCell>{row.paymonth}</TableCell>
                    <TableCell>{row.holdpercent}</TableCell>
                    <TableCell>{row.reason}</TableCell>


                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* print layout */}

        <TableContainer component={Paper} sx={userStyle.printcls}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRefTwo}>
            <TableHead>
              <TableRow>
                <TableCell>S.no</TableCell>
                <TableCell>Employee Name</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Branch</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Team</TableCell>

                <TableCell>Total No of Dyas</TableCell>
                <TableCell>Total Shift</TableCell>
                <TableCell>CLSL</TableCell>
                <TableCell>Total Absent/Leave</TableCell>
                <TableCell>Total Paid Days</TableCell>


                <TableCell>Target Points</TableCell>
                <TableCell>Achieved Points</TableCell>
                <TableCell>Achieved %</TableCell>


                <TableCell>Penalty Amount</TableCell>


                <TableCell>Pay on</TableCell>
                <TableCell>Paid Status</TableCell>
                <TableCell>Pay Date</TableCell>
                <TableCell>Pay Year</TableCell>
                <TableCell>Pay Month</TableCell>
                <TableCell>Hold %</TableCell>
                <TableCell>Reason</TableCell>


                <TableCell>Bank Name</TableCell>
                <TableCell>Account Holder Name</TableCell>
                <TableCell>Account NO</TableCell>
                <TableCell>IFSC Code</TableCell>

                <TableCell>Loss Deduction</TableCell>
                <TableCell>Other Deduction</TableCell>

                <TableCell>Current Month Avg</TableCell>
                <TableCell>Current Month Attendance</TableCell>

              </TableRow>
            </TableHead>
            <TableBody align="left">
              {rowDataTableTwo &&
                rowDataTableTwo.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.employeename}</TableCell>
                    <TableCell>{row.department}</TableCell>
                    <TableCell>{row.company}</TableCell>
                    <TableCell>{row.branch}</TableCell>
                    <TableCell>{row.unit}</TableCell>
                    <TableCell>{row.team}</TableCell>

                    <TableCell>{row.totalnumberofdays}</TableCell>
                    <TableCell>{row.totalshift}</TableCell>
                    <TableCell>{row.clsl}</TableCell>
                    <TableCell>{row.totalasbleave}</TableCell>
                    <TableCell>{row.totalpaidDays}</TableCell>

                    <TableCell>{row.targetpoints}</TableCell>
                    <TableCell>{row.achievedpoints}</TableCell>
                    <TableCell>{row.achieved}</TableCell>

                    <TableCell>{row.penaltyamount}</TableCell>

                    <TableCell>{row.salarytype}</TableCell>
                    <TableCell>{row.paidstatus}</TableCell>
                    <TableCell>{row.paydate}</TableCell>
                    <TableCell>{row.payyear}</TableCell>
                    <TableCell>{row.paymonth}</TableCell>
                    <TableCell>{row.holdpercent}</TableCell>
                    <TableCell>{row.reason}</TableCell>

                    <TableCell>{row.bankname}</TableCell>
                    <TableCell>{row.accountholdername}</TableCell>
                    <TableCell>{row.accountno}</TableCell>
                    <TableCell>{row.ifsccode}</TableCell>


                    <TableCell>{row.lossdeductionfinal}</TableCell>
                    <TableCell>{row.otherdeductionfinal}</TableCell>

                    <TableCell>{row.currentmonthavg}</TableCell>
                    <TableCell>{row.currentmonthattendance}</TableCell>



                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

    </Box>
  );
}
export default Fixsalarydate;
