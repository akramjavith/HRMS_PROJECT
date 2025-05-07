import React, { useState, useEffect, useCallback, useRef, useContext } from "react";
import { Box, Typography, TableRow, TableCell, Checkbox, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, Popover, TextField, useTheme, IconButton, Select, OutlinedInput, FormControl, MenuItem, DialogActions, Grid, Paper, Table, TableHead, TableContainer, Button, TableBody } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaPrint, FaFilePdf, FaFileExcel } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { SERVICE } from "../../../services/Baseservice";
import moment from "moment-timezone";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useReactToPrint } from "react-to-print";
import LoadingButton from "@mui/lab/LoadingButton";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import StyledDataGrid from "../../../components/TableStyle";
import { handleApiError } from "../../../components/Errorhandling";
// import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { styled } from "@mui/system";
// import styled1 from 'styled-components';
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import Headtitle from "../../../components/Headtitle";
import { MultiSelect } from "react-multi-select-component";
import * as XLSX from "xlsx";
import Selects from "react-select";
import LinearProgress from "@mui/material/LinearProgress";
// import { LinearProgress, styled, useTheme } from '@mui/material';
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import PageHeading from "../../../components/PageHeading";
import ExportData from "../../../components/ExportData";

const LinearProgressBar = ({ progress }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "20px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          height: "100%",
          backgroundColor: "#1976d2b0",
          color: "white",
          textAlign: "center",
          lineHeight: "20px",
        }}
      >
        {progress}%
      </div>
    </div>
  );
};

const StyledMultiSelect = styled(MultiSelect)`
  .dropdown-content {slac
    z-index: 9999 !important;
  }
`;

// Custom styles to mimic Bootstrap's animated progress bar
const BorderLinearProgress = styled(LinearProgress)(({ theme, status }) => ({
  height: 16,
  borderRadius: 5,
  overflow: "hidden",
  backgroundColor: theme.palette.grey[theme.palette.mode === "light" ? 200 : 700],
  // backgroundColor: status === "Success" ? "#1fc11f94" : status ===   "+/- Amount differ" ? "#ffa50099" : "#1a90ff",
  "& .MuiLinearProgress-bar": {
    borderRadius: 5,
    // backgroundColor: '#1a90ff',
    backgroundColor: status === "Success" ? "#2c852c75" : status === "+/- Amount differ" ? "#ffa50099" : "#1a90ff",

    animation: "progress-bar-stripes 1s linear infinite",
    backgroundImage: `linear-gradient(
          45deg,
          rgba(255, 255, 255, 0.15) 25%,
          transparent 25%,
          transparent 50%,
          rgba(255, 255, 255, 0.15) 50%,
          rgba(255, 255, 255, 0.15) 75%,
          transparent 75%,
          transparent
      )`,
    backgroundSize: "1rem 1rem",
  },
  "@keyframes progress-bar-stripes": {
    from: {
      backgroundPosition: "1rem 0",
    },
    to: {
      backgroundPosition: "0 0",
    },
  },
}));

const ButtonCellRenderer = (props) => {
  const { data, node, api } = props;
  const { auth } = useContext(AuthContext);
  const oldData = data;
  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [isLoad, setIsLoad] = useState(false);

  const [bankRleasePop, setBankRleasePop] = useState(false);

  const handleBankRleasePopOpen = () => {
    setBankRleasePop(true);
  };
  const handleBankRleasePopClose = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setBankRleasePop(false);
  };
  // const [payRunList, setPayRunList] = useState([])
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

  const { profTaxMaster, shifts, payruncontrolmaster, monthsArr, departmentsList, salSlabs, eraAmounts, acPointCal, attModearr, attStatus, manageshortagemasters, revenueAmount, viewMonth, viewYear, attCtrlCriteria, targetPoints, attStatusOption, fetchPayRunList } = props.context;

  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };
  const getattendancestatus = (alldata) => {
    let result = attStatus.filter((data, index) => {
      return data?.clockinstatus === alldata?.clockinstatus && data?.clockoutstatus === alldata?.clockoutstatus;
    });
    return result[0]?.name;
  };

  const getAttModeAppliedThr = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus;
    });
    return result[0]?.appliedthrough;
  };

  const getAttModeLop = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus;
    });
    return result[0]?.lop === true ? "Yes" : "No";
  };

  const getAttModeLopType = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus;
    });
    return result[0]?.loptype;
  };

  const getFinalLop = (rowlop, rowloptype) => {
    return rowloptype === undefined || rowloptype === "" ? rowlop : rowlop + " - " + rowloptype;
  };

  const getAttModeTarget = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus;
    });
    return result[0]?.target === true ? "Yes" : "No";
  };

  const getAttModePaidPresent = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus;
    });
    return result[0]?.paidleave === true ? "Yes" : "No";
  };

  const getAttModePaidPresentType = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus;
    });
    return result[0]?.paidleavetype;
  };

  const getFinalPaid = (rowpaid, rowpaidtype) => {
    return rowpaidtype === undefined || rowpaidtype === "" ? rowpaid : rowpaid + " - " + rowpaidtype;
  };

  const getAssignLeaveDayForLop = (rowlopday) => {
    if (rowlopday === "Yes - Double Day") {
      return "2";
    } else if (rowlopday === "Yes - Full Day") {
      return "1";
    } else if (rowlopday === "Yes - Half Day") {
      return "0.5";
    } else {
      return "0";
    }
  };

  const getAssignLeaveDayForPaid = (rowpaidday) => {
    if (rowpaidday === "Yes - Double Day") {
      return "2";
    } else if (rowpaidday === "Yes - Full Day") {
      return "1";
    } else if (rowpaidday === "Yes - Half Day") {
      return "0.5";
    } else {
      return "0";
    }
  };
  const getCount = (rowlopstatus) => {
    if (rowlopstatus === "Yes - Double Day") {
      return "2";
    } else if (rowlopstatus === "Yes - Full Day") {
      return "1";
    } else if (rowlopstatus === "Yes - Half Day") {
      return "0.5";
    } else {
      return "0";
    }
  };

  let updatedPenaltyAmount = Number(node.data.penaltyamount);
  let updatedacheivedpoints = Number(node.data.acheivedpoints);
  const [newRerunData, setnewRerunData] = useState([]);

  const hanleBankReleaseDataRemove = async () => {
    handleBankRleasePopClose();

    let finalDataOnlyAboveHundred = newRerunData.map((item) => {
      let findIsBankStatusCreated = oldData.logdata && oldData.logdata?.length > 0 ? oldData.logdata?.some((item) => item.bankreleasestatus == "created") : false;

      if (findIsBankStatusCreated) {
        return { ...item, changestatus: "Data in Bank Prepation was removed", isvaluechanges: "Data in Bank Prepation was removed", sentfixsalary: "Yes", logdata: [], fixsalarydateconfirm: "", fixholdsalarydateconfirm: "" };
      } else {
        // If changestatus is not "Amount Differ", update the item to set sentfixsalary: "Yes" if needed
        return item;
      }
    });

    let res = await axios.post(`${SERVICE.UPDATE_INNERDATA_SINGLE_USER_RERUN}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },

      outerId: data.outerId,
      innerId: data._id,
      updateData: finalDataOnlyAboveHundred[0],
    });

    setIsLoad(false);
    props.context.fetchPayRunList();

    setShowAlert(
      <>
        <CheckCircleOutlineOutlinedIcon sx={{ fontSize: "100px", color: "#1d8510de" }} />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Updated Successfully"}</p>
      </>
    );
    handleClickOpenerr();
  };

  const hanleBankReleaseDataNotRemove = async () => {
    handleBankRleasePopClose();
    try {
      let finalDataOnlyAboveHundred = newRerunData.map((item) => {
        let findIsBankStatusCreated = oldData.logdata && oldData.logdata?.length > 0 ? oldData.logdata?.some((item) => item.bankreleasestatus == "created") : false;

        if (findIsBankStatusCreated) {
          let findHoldReleaseData = oldData?.logdata.some((data) => data.status == "holdrelease" && data.holdsalaryconfirm != "Yes") ? oldData?.logdata.find((data) => data.status == "holdrelease" && data.holdsalaryconfirm != "Yes")._id : "";
          // console.log(findHoldReleaseData, 'findHoldReleaseData')
          let logdatas = [];
          if (findHoldReleaseData != "") {
            logdatas = oldData.logdata.map((d) => {
              if (d._id == findHoldReleaseData) {
                return {
                  ...item,
                  finalusersalary: item.salarytype == "Final Salary" ? item.finalsalary : item.salarytype === "Fixed Salary" ? item.fixedsalary : item.prodsalary,
                  holdsalaryconfirm: "No",
                  status: d.status,
                  innerId: d.innerId,
                  outerId: d.outerId,
                  payyear: d.payear,
                  paymonth: d.paymonth,
                  paydate: d.paydate,
                  statuspage: d.statuspage,
                };
              } else {
                return d;
              }
            });
          } else {
            logdatas = [
              {
                status: "holdrelease",
                statuspage: "fixsalary",
                companyname: item.companyname,
                innerId: data._id,
                outerId: data.outerId,
                company: item.company,
                branch: item.branch,
                unit: item.unit,
                team: item.team,
                empcode: item.empcode,
                department: item.department,
                legalname: item.legalname,
                designation: item.designation,
                totalnumberofdays: item.totalnumberofdays,
                totalshift: item.totalshift,

                totalasbleave: item.totalasbleave,
                totalpaidDays: item.totalpaidDays,
                targetpoints: item.targetpoints,
                clsl: item.clsl,
                acheivedpoints: item.acheivedpoints,
                acheivedpercent: item.acheivedpercent,
                currentmonthavg: item.currentmonthavg,
                currentmonthattendance: item.currentmonthattendance,

                bankname: item.bankname,
                accountholdername: item.accountholdername,
                ifsccode: item.ifsccode,
                penaltyamount: item.penaltyamount,
                releaseamount: item.releaseamount,
                otherdeductionamount: item.otherdeductionamount,
                totalexcess: item.totalexcess,
                totaladvance: item.totaladvance,
                payamount: item.payamount,
                balanceamount: item.balanceamount,
                paidstatus: item.paidstatus,
                approvedby: item.approvedby,
                description: item.description,
                recheckreason: item.recheckreason,
                updatedpaidstatus: item.updatedpaidstatus,
                updatechangedate: item.updatechangedate,
                payonsalarytype: item.payonsalarytype,

                finalusersalary: item.salarytype == "Final Salary" ? item.finalsalary : item.salarytype === "Fixed Salary" ? item.fixedsalary : item.prodsalary,
                holdsalaryconfirm: "No",
                payyear: oldData.selectedyear,
                paymonth: oldData.selectedmonth,
                paydate: "",
              },
              ...oldData?.logdata,
            ];
          }
          // console.log(logdatas, 'logdatas')
          return { ...item, changestatus: "Data in Bank Prepation is Not removed", isvaluechanges: "Data in Bank Prepation is Not removed", logdata: logdatas };
        } else {
          // If changestatus is not "Amount Differ", update the item to set sentfixsalary: "Yes" if needed
          return item;
        }
      });

      let res = await axios.post(`${SERVICE.UPDATE_INNERDATA_SINGLE_USER_RERUN}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

        outerId: data.outerId,
        innerId: data._id,
        updateData: finalDataOnlyAboveHundred[0],
      });
      setIsLoad(false);
      props.context.fetchPayRunList();
      setShowAlert(
        <>
          <CheckCircleOutlineOutlinedIcon sx={{ fontSize: "100px", color: "#1d8510de" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Updated Successfully"}</p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {
      console.log(err);
      setIsLoad(false);
    }
  };

  const confirmSubmit = async (e) => {
    // e.preventDefault();
    try {
      if (data.acheivedpoints === "") {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter acheivedpoint"}</p>
          </>
        );
        handleClickOpenerr();
      } else if (data.penaltyamount === "") {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Penaltyamount"}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setIsLoad(true);

        // console.log("sdf");
        let res = await axios.post(SERVICE.USER_PAYRUNDATA_LIMITED_FINAL, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          department: [data.department],
          employees: [data.companyname],
          month: viewMonth,
          year: viewYear,
        });

        let findSelectedMonthNum = months.find((d) => d.value === data.selectedmonth).numval;

        function splitArray(array, chunkSize) {
          const resultarr = [];
          for (let i = 0; i < array.length; i += chunkSize) {
            const chunk = array.slice(i, i + chunkSize);
            resultarr.push({
              data: chunk,
              month: Number(findSelectedMonthNum),
              year: Number(data.selectedyear),
            });
          }
          return resultarr;
        }
        function splitArray2(array, chunkSize) {
          const resultarr2 = [];
          for (let i = 0; i < array.length; i += chunkSize) {
            const chunk = array.slice(i, i + chunkSize);
            resultarr2.push({
              data: chunk,
              month: Number(findSelectedMonthNum) + 1 > 12 ? 1 : Number(findSelectedMonthNum) + 1,
              year: Number(findSelectedMonthNum) + 1 > 12 ? Number(data.selectedyear) + 1 : Number(data.selectedyear),
            });
          }
          return resultarr2;
        }

        const resultarr = splitArray([data.companyname], 10);
        const resultarr2 = splitArray2([data.companyname], 10);

        let res_applyleave = await axios.post(SERVICE.APPLYLEAVE_APPROVED, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          status: String("Approved"),
        });

        let leaveresult = res_applyleave?.data?.applyleaves;

        async function sendBatchRequest(batch) {
          try {
            let res_usershift = await axios.post(SERVICE.USER_ATTENDANCE_PAYRUN, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              department: [data.department],
              employees: batch.data,
              ismonth: batch.month,
              isyear: batch.year,
            });
            const filteredBatch = res_usershift?.data?.finaluser?.filter((d) => {
              const [day, month, year] = d.rowformattedDate.split("/");
              const formattedDate = new Date(`${year}-${month}-${day}`);
              const reasonDate = new Date(d.reasondate);
              const dojDate = new Date(d.doj);

              if (d.reasondate && d.reasondate !== "") {
                return formattedDate >= dojDate && formattedDate <= reasonDate;
              } else if (d.doj && d.doj !== "") {
                return formattedDate >= dojDate;
              } else {
                return d;
              }
            });

            let filtered = filteredBatch;
            let countByEmpcodeClockin = {}; // Object to store count for each empcode
            let countByEmpcodeClockout = {};
            let result = filtered.flatMap((item, index) => {
              // Initialize count for empcode if not already present
              if (!countByEmpcodeClockin[item.empcode]) {
                countByEmpcodeClockin[item.empcode] = 1;
              }
              if (!countByEmpcodeClockout[item.empcode]) {
                countByEmpcodeClockout[item.empcode] = 1;
              }

              // Adjust clockinstatus based on lateclockincount
              let updatedClockInStatus = item.clockinstatus;
              // Adjust clockoutstatus based on earlyclockoutcount
              let updatedClockOutStatus = item.clockoutstatus;

              // Filter out only 'Absent' items for the current employee
              const absentItems = filtered?.filter((d) => d.clockinstatus === "Absent" && item.empcode === d.empcode && d.clockin === "00:00:00" && d.clockout === "00:00:00");

              // Check if the day before and after a 'Week Off' date is marked as 'Leave' or 'Absent'
              if (item.clockinstatus === "Week Off" && item.clockoutstatus === "Week Off") {
                // Define the date format for comparison
                const itemDate = moment(item.rowformattedDate, "DD/MM/YYYY");

                const isPreviousDayLeave = leaveresult.some((leaveItem) => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, "days"), "day") && leaveItem.empcode === item.empcode);
                const isPreviousDayAbsent = absentItems.some((absentItem) => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, "days"), "day") && absentItem.empcode === item.empcode);

                const isNextDayLeave = leaveresult.some((leaveItem) => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().add(1, "days"), "day") && leaveItem.empcode === item.empcode);
                const isNextDayAbsent = absentItems.some((absentItem) => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().add(1, "days"), "day") && absentItem.empcode === item.empcode);

                if (isPreviousDayLeave) {
                  updatedClockInStatus = "BeforeWeekOffLeave";
                  updatedClockOutStatus = "BeforeWeekOffLeave";
                }
                if (isPreviousDayAbsent) {
                  updatedClockInStatus = "BeforeWeekOffAbsent";
                  updatedClockOutStatus = "BeforeWeekOffAbsent";
                }
                if (isNextDayLeave) {
                  updatedClockInStatus = "AfterWeekOffLeave";
                  updatedClockOutStatus = "AfterWeekOffLeave";
                }
                if (isNextDayAbsent) {
                  updatedClockInStatus = "AfterWeekOffAbsent";
                  updatedClockOutStatus = "AfterWeekOffAbsent";
                }
              }

              // Check if 'Late - ClockIn' count exceeds the specified limit
              if (updatedClockInStatus === "Late - ClockIn") {
                updatedClockInStatus = `${countByEmpcodeClockin[item.empcode]}Late - ClockIn`;
                countByEmpcodeClockin[item.empcode]++; // Increment count for current empcode
              }
              // Check if 'Early - ClockOut' count exceeds the specified limit
              if (updatedClockOutStatus === "Early - ClockOut") {
                updatedClockOutStatus = `${countByEmpcodeClockout[item.empcode]}Early - ClockOut`;
                countByEmpcodeClockout[item.empcode]++; // Increment count for current empcode
              }

              return {
                ...item,
                shiftallot: item.shiftallot,
                weekOffDates: item.weekOffDates,
                clockinstatus: updatedClockInStatus,
                clockoutstatus: updatedClockOutStatus,
              };
            });
            const itemsWithSerialNumber = result?.map((item, index) => ({
              ...item,
              shiftmode: item.shiftMode,
              uniqueid: item.id,
              userid: item.userid,
              totalnumberofdays: item.totalnumberofdays,
              empshiftdays: item.empshiftdays,
              totalcounttillcurrendate: item.totalcounttillcurrendate,
              totalshift: item.totalshift,
              attendanceauto: getattendancestatus(item),
              daystatus: item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item),
              appliedthrough: getAttModeAppliedThr(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
              lop: getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
              loptype: getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
              lopcalculation: getFinalLop(getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)), getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item))),
              lopcount: getCount(getFinalLop(getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)), getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)))),
              modetarget: getAttModeTarget(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
              paidpresentbefore: getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
              paidleavetype: getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
              paidpresent: getFinalPaid(getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)), getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item))),
              lopday: getAssignLeaveDayForLop(getFinalLop(getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)), getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)))),
              paidpresentday: getAssignLeaveDayForPaid(getFinalPaid(getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)), getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)))),
            }));

            const weekOption = ["BeforeWeekOffAbsent", "AfterWeekOffAbsent", "BeforeWeekOffLeave", "AfterWeekOffLeave"];
            itemsWithSerialNumber.forEach((item, index, array) => {
              if (attStatusOption.includes(item.daystatus) && item.clockin === "00:00:00" && item.clockout === "00:00:00" && item.paidpresent === "Yes - Full Day") {
                const previousItem = array[index - 1];
                const nextItem = array[index + 1];

                const hasRelevantStatus = (entry) => entry && (weekOption.includes(entry.clockinstatus) || (weekOption.includes(entry.clockoutstatus) && entry.shift === "Week Off"));

                // if (hasRelevantStatus(previousItem)) {
                //     previousItem.clockinstatus = 'Week Off';
                //     previousItem.clockoutstatus = 'Week Off';
                //     previousItem.attendanceauto = getattendancestatus(previousItem);
                //     previousItem.daystatus = previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem);
                // }
                // if (hasRelevantStatus(nextItem)) {
                //     nextItem.clockinstatus = 'Week Off';
                //     nextItem.clockoutstatus = 'Week Off';
                //     nextItem.attendanceauto = getattendancestatus(nextItem);
                //     nextItem.daystatus = nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem);
                // }
                if (hasRelevantStatus(previousItem)) {
                  previousItem.clockinstatus = "Week Off";
                  previousItem.clockoutstatus = "Week Off";
                  previousItem.attendanceauto = getattendancestatus(previousItem);
                  previousItem.daystatus = previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem);
                  previousItem.appliedthrough = getAttModeAppliedThr(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                  previousItem.lop = getAttModeLop(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                  previousItem.loptype = getAttModeLopType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                  previousItem.lopcalculation = getFinalLop(getAttModeLop(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)), getAttModeLopType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)));
                  previousItem.lopcount = getCount(getFinalLop(getAttModeLop(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)), getAttModeLopType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem))));
                  previousItem.modetarget = getAttModeTarget(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                  previousItem.paidpresentbefore = getAttModePaidPresent(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                  previousItem.paidleavetype = getAttModePaidPresentType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                  previousItem.paidpresent = getFinalPaid(getAttModePaidPresent(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)), getAttModePaidPresentType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)));
                  previousItem.lopday = getAssignLeaveDayForLop(getFinalLop(getAttModeLop(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)), getAttModeLopType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem))));
                  previousItem.paidpresentday = getAssignLeaveDayForPaid(
                    getFinalPaid(getAttModePaidPresent(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)), getAttModePaidPresentType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)))
                  );
                }
                if (hasRelevantStatus(nextItem)) {
                  nextItem.clockinstatus = "Week Off";
                  nextItem.clockoutstatus = "Week Off";
                  nextItem.attendanceauto = getattendancestatus(nextItem);
                  nextItem.daystatus = nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem);
                  nextItem.appliedthrough = getAttModeAppliedThr(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                  nextItem.lop = getAttModeLop(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                  nextItem.loptype = getAttModeLopType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                  nextItem.lopcalculation = getFinalLop(getAttModeLop(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)), getAttModeLopType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)));
                  nextItem.lopcount = getCount(getFinalLop(getAttModeLop(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)), getAttModeLopType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem))));
                  nextItem.modetarget = getAttModeTarget(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                  nextItem.paidpresentbefore = getAttModePaidPresent(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                  nextItem.paidleavetype = getAttModePaidPresentType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                  nextItem.paidpresent = getFinalPaid(getAttModePaidPresent(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)), getAttModePaidPresentType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)));
                  nextItem.lopday = getAssignLeaveDayForLop(getFinalLop(getAttModeLop(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)), getAttModeLopType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem))));
                  nextItem.paidpresentday = getAssignLeaveDayForPaid(getFinalPaid(getAttModePaidPresent(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)), getAttModePaidPresentType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem))));
                }
              }
            });

            const finalresult = [];

            itemsWithSerialNumber.forEach((item) => {
              // console.log(item, "item");
              const leaveOnDateApproved = leaveresult.find((d) => d.date === item.rowformattedDate && d.empcode === item.empcode);

              const existingEntryIndex = finalresult.findIndex((entry) => entry.empcode === item.empcode);

              if (existingEntryIndex !== -1) {
                if (item.shift !== "Not Allotted") {
                  finalresult[existingEntryIndex].shift++;
                }
                if ((item.clockinstatus === "Week Off" && item.clockoutstatus === "Week Off" && item.clockin === "00:00:00" && item.clockout === "00:00:00") || (item.daystatus === "MWEEKOFF" && item.paidpresent === "Yes - Full Day")) {
                  finalresult[existingEntryIndex].weekoff++;
                }

                if (item.clockinstatus === "Holiday" && item.clockoutstatus === "Holiday") {
                  finalresult[existingEntryIndex].holidayCount++;
                }
                if (item.shift === "Week Off") {
                  finalresult[existingEntryIndex].weekoffall++;
                }
                if (item.clockinstatus === "DLOP" && item.clockoutstatus === "DLOP") {
                  finalresult[existingEntryIndex].dlob++;
                }
                if (["MPRESENT", "PRESENT"].includes(item.daystatus) && ["MPRESENT", "PRESENT"].includes(item.daystatus)) {
                  finalresult[existingEntryIndex].present++;
                }
                // if (item.clockinstatus === 'Leave' && item.clockoutstatus === 'Leave') {
                //     finalresult[existingEntryIndex].leaveCount++;
                // }
                if (leaveOnDateApproved) {
                  // if ((item.clockinstatus === `${leaveOnDateApproved.code} ${leaveOnDateApproved.status}`) && (item.clockoutstatus === `${leaveOnDateApproved.code} ${leaveOnDateApproved.status}`)) {
                  finalresult[existingEntryIndex].leaveCount++;
                  // }
                }
                if (item.lopcalculation === "Yes - Double Day") {
                  finalresult[existingEntryIndex].doublelopcount++;
                }

                if (item.lopcalculation === "Yes - Double Half Day") {
                  finalresult[existingEntryIndex].doublehalflopcount++;
                }

                if (item.clockinstatus !== "Not Allotted" && item.clockoutstatus !== "Not Allotted" && item.attendanceauto === undefined && item.daystatus === undefined) {
                  finalresult[existingEntryIndex].nostatuscount++;
                }

                finalresult[existingEntryIndex].lopcount = String(parseFloat(finalresult[existingEntryIndex].lopcount) + parseFloat(item.lopcount));
                finalresult[existingEntryIndex].paidpresentday = String(parseFloat(finalresult[existingEntryIndex].paidpresentday) + parseFloat(item.paidpresentday));
              } else {
                const newItem = {
                  id: item.id,
                  empcode: item.empcode,
                  username: item.username,
                  company: item.company,
                  branch: item.branch,
                  unit: item.unit,
                  team: item.team,
                  department: item.department,
                  totalnumberofdays: item.totalnumberofdays,
                  empshiftdays: item.empshiftdays,
                  //  shift: (item.clockinstatus !== 'Not Allotted' && item.clockoutstatus !== 'Not Allotted' && item.clockin === '00:00:00' && item.clockout === '00:00:00') ? 1 : 0,

                  shift: 1,

                  // weekoff: item.weekoffCount,
                  weekoff: item.clockinstatus === "Week Off" && item.clockoutstatus === "Week Off" && item.clockin === "00:00:00" && item.clockout === "00:00:00" ? 1 : 0,
                  lopcount: item.lopcount,

                  paidpresentday: item.paidpresentday,
                  totalcounttillcurrendate: item.totalcounttillcurrendate,
                  totalshift: item.totalshift,
                  holidayCount: item.clockinstatus === "Holiday" && item.clockoutstatus === "Holiday" ? 1 : 0,
                  // leaveCount: (item.clockinstatus === 'Leave' && item.clockoutstatus === 'Leave') ? 1 : 0,
                  // leaveCount: leaveOnDateApproved ? ((item.clockinstatus === `${leaveOnDateApproved && leaveOnDateApproved.code} ${leaveOnDateApproved && leaveOnDateApproved.status}`) && (item.clockoutstatus === `${leaveOnDateApproved && leaveOnDateApproved.code} ${leaveOnDateApproved && leaveOnDateApproved.status}`) ? 1 : 0) : 0,
                  leaveCount: leaveOnDateApproved ? 1 : 0,
                  clsl: 0,
                  holiday: 0,
                  totalpaiddays: 0,
                  nostatus: 0,

                  // nostatuscount: item.paidpresent === 'No' && item.modetarget === 'No' && item.lopcalculation === 'No' ? 1 : 0,
                  nostatuscount: item.clockinstatus !== "Not Allotted" && item.clockoutstatus !== "Not Allotted" && item.paidpresent === "No" && item.modetarget === "No" && item.lopcalculation === "No" ? 1 : 0,
                  weekoffall: item.shift === "Week Off" ? 1 : 0,
                  present: ["MPRESENT", "PRESENT"].includes(item.daystatus) && ["MPRESENT", "PRESENT"].includes(item.daystatus) ? 1 : 0,
                  dlob: item.clockinstatus === "DLOP" && item.clockoutstatus === "DLOP" ? 1 : 0,
                  doublelopcount: item.lopcalculation === "Yes - Double Day" ? 1 : 0,
                  doublehalflopcount: item.lopcalculation === "Double Half Day" ? 0.5 : 0,
                };
                finalresult.push(newItem);
              }
            });
            let resultdata = finalresult?.map((item, index) => {
              const finalPaidPresentDays = Number(item.paidpresentday) - (Number(item.holidayCount) + Number(item.leaveCount));

              return {
                ...item,
                serialNumber: index + 1,
                totalnumberofdays: Number(item.totalnumberofdays),
                lopcount: Number(item.lopcount),
                // paidpresentday: finalPaidPresentDays,
                paidpresentday: Number(item.paidpresentday) > Number(item.shift) ? Number(item.shift) - Number(item.lopcount) : Number(item.paidpresentday) - (Number(item.doublelopcount) + Number(item.doublehalflopcount)),
              };
            });

            return resultdata;
          } catch (err) {
            // handleApiError(err, setShowAlert, handleClickOpenerr);
            return [];
          }
        }

        async function getAllResults() {
          let allResults = [];
          let allResults2 = [];
          for (let batch of resultarr) {
            const finaldata = await sendBatchRequest(batch);
            allResults = allResults.concat(finaldata);
          }
          for (let batch of resultarr2) {
            const finaldata = await sendBatchRequest(batch);
            allResults2 = allResults2.concat(finaldata);
          }

          return { allResults, allResults2 }; // Return both results as an object
        }

        getAllResults()
          .then(async (results) => {
            // addSerialNumberFilterCheck(res.data.users, results.allResults, results.allResults2);
            let emps = res.data.users;
            let finalresult = results.allResults;
            let finalresultNxt = results.allResults2;
            // const addSerialNumberFilterCheck = async () => {

            let findSelectedMonthNum = months.find((d) => d.value === data.selectedmonth).numval;

            try {
              // Fetch all necessary data
              let [prodFilter, prodFilterNxt, penaltyFilter, res_employee, res_employeeNxt, Res] = await Promise.all([
                axios.post(SERVICE.DAY_POINTS_MONTH_YEAR_FILTER, {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },
                  ismonth: Number(findSelectedMonthNum),
                  isyear: Number(data.selectedyear),
                }),
                axios.post(SERVICE.DAY_POINTS_MONTH_YEAR_FILTER_NXTMONTH, {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },
                  ismonth: Number(findSelectedMonthNum) + 1 > 12 ? 1 : Number(findSelectedMonthNum) + 1,
                  isyear: Number(findSelectedMonthNum) + 1 > 12 ? Number(data.selectedyear) + 1 : Number(data.selectedyear),
                }),
                axios.post(SERVICE.PENALTY_DAY_FILTERED, {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },
                  ismonth: Number(findSelectedMonthNum),
                  isyear: Number(data.selectedyear),
                }),
                axios.post(SERVICE.DEPTMONTHSET_LIMITED, {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },
                  monthname: data.selectedmonth,
                  year: data.selectedyear,
                }),
                axios.post(SERVICE.DEPTMONTHSET_LIMITED, {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },
                  monthname: Number(findSelectedMonthNum) + 1 > 12 ? "January" : monthsArr[Number(findSelectedMonthNum)],
                  year: Number(findSelectedMonthNum) + 1 > 12 ? String(Number(data.selectedyear) + 1) : data.selectedyear,
                }),
                axios.post(SERVICE.PAIDSTATUSFIX_LIMITED, {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },
                  month: data.selectedmonth,
                  year: data.selectedyear,
                }),
              ]);

              // Extract data from responses
              let dayPointsUser = prodFilter.data.answer;
              let dayPointsUserNxtMonth = prodFilterNxt.data.answer;
              let dayPenaltyUser = penaltyFilter.data.answer;
              let monthSetDatas = res_employee.data.departmentdetails;
              let monthSetsNxtDatas = res_employeeNxt.data.departmentdetails;
              let paidStsFixData = Res?.data?.paidstatusfixs;

              const itemsWithSerialNumber = emps.map(async (item, index) => {
                let bankDetails = item.bankdetails.find((d) => d.accountstatus === "Active");
                let findTotalNoOfDays = finalresult.find((d) => d.company == item.company && d.branch == item.branch && d.department == item.department && d.team == item.team && d.empcode == item.empcode && d.unit == item.unit && d.username == item.companyname);
                let findTotalNoOfDaysNxtMonth = finalresultNxt.find((d) => d.company == item.company && d.branch == item.branch && d.department == item.department && d.team == item.team && d.empcode == item.empcode && d.unit == item.unit && d.username == item.companyname);

                const groupedByMonth = {};
                // Group items by month
                item.assignExpLog &&
                  item.assignExpLog.length > 0 &&
                  item.assignExpLog
                    .filter((d) => d.expmode !== "Auto")
                    .sort((a, b) => {
                      return new Date(a.updatedate) - new Date(b.updatedate);
                    })
                    .forEach((item) => {
                      const monthYear = item.updatedate?.split("-").slice(0, 2).join("-");
                      if (!groupedByMonth[monthYear]) {
                        groupedByMonth[monthYear] = [];
                      }
                      groupedByMonth[monthYear].push(item);
                    });

                // Extract the last item of each group
                const lastItemsForEachMonth = Object.values(groupedByMonth).map((group) => group[group.length - 1]);

                // Filter the data array based on the month and year
                // lastItemsForEachMonth.sort((a, b) => {
                //   return new Date(a.updatedate) - new Date(b.updatedate);
                // });
                // Filter the data array based on the month and year
                // lastItemsForEachMonth.sort((a, b) => {
                //   return new Date(a.updatedate) - new Date(b.updatedate);
                // });
                // Find the first item in the sorted array that meets the criteria
                let filteredDataMonth = null;
                for (let i = 0; i < lastItemsForEachMonth.length; i++) {
                  const date = lastItemsForEachMonth[i]?.updatedate;
                  const splitedDate = date?.split("-");
                  const itemYear = splitedDate ? splitedDate[0] : -1;
                  const itemMonth = splitedDate ? splitedDate[1] : -1; // Adding 1 because getMonth() returns 0-indexed month
                  if (Number(itemYear) === Number(data.selectedyear) && Number(itemMonth) === Number(findSelectedMonthNum)) {
                    filteredDataMonth = lastItemsForEachMonth[i];
                    break;
                  } else if (Number(itemYear) < Number(data.selectedyear) || (Number(itemYear) === data.selectedyear && Number(itemMonth) < Number(findSelectedMonthNum))) {
                    filteredDataMonth = lastItemsForEachMonth[i]; // Keep updating the filteredDataMonth until the criteria is met
                  } else {
                    break; // Break the loop if we encounter an item with year and month greater than selected year and month
                  }
                }

                // let modevalue = item.assignExpLog[item.assignExpLog.length - 1];
                let modevalue = filteredDataMonth;

                let selectedmonthnumalter = Number(findSelectedMonthNum) <= 9 ? `0${Number(findSelectedMonthNum)}` : findSelectedMonthNum;

                let selectedMonStartDate = data.selectedyear + "-" + selectedmonthnumalter + "-01";

                let findexp = monthSetDatas.find((d) => d.department === item.department);
                let findexpNxt = monthSetsNxtDatas.find((d) => d.department === item.department);

                let findDate = findexp ? findexp.fromdate : selectedMonStartDate;

                //FIND SELECTEDMONTH MONTH END DATE
                const nextMonthFirstDay = new Date(Number(data.selectedyear), Number(findSelectedMonthNum), 1);

                // Subtract one day to get the last day of the given month
                const lastDate = new Date(nextMonthFirstDay - 1);

                let lastdateOfSelectedMonth = lastDate.getDate();
                let selectedMonEndDate = `${data.selectedyear}-${selectedmonthnumalter}-${lastdateOfSelectedMonth}`;
                let findmonthenddate = findexp ? findexp.todate : selectedMonEndDate;
                const thisMonthEndDate = findexp ? findexp.todate : selectedMonEndDate;

                //NEXT MONTH MONTH START AND END DATE

                let selectedmonthnumalterNxt = Number(findSelectedMonthNum) + 1 > 12 ? "01" : Number(findSelectedMonthNum) + 1 <= 9 ? `0${Number(findSelectedMonthNum) + 1}` : Number(findSelectedMonthNum) + 1;

                let Nxtmonth = Number(findSelectedMonthNum) + 1 > 12 ? 1 : Number(findSelectedMonthNum) + 1;
                let Nxtyear = Number(findSelectedMonthNum) + 1 > 12 ? Number(data.selectedyear) + 1 : data.selectedyear;

                const NxtnextMonthFirstDay = new Date(Number(Nxtyear), Number(Nxtmonth), 1);

                // Subtract one day to get the last day of the given month
                const lastDateNxtNextmonth = new Date(NxtnextMonthFirstDay - 1);

                let lastdateOfNxtSelectedMonth = lastDateNxtNextmonth.getDate();

                let selectedMonNxtStartDate = `${Nxtyear}-${selectedmonthnumalterNxt}-01`;

                let selectedMonNxtEndDate = `${Nxtyear}-${selectedmonthnumalterNxt}-${lastdateOfNxtSelectedMonth}`;

                let findNxtStartDate = findexpNxt ? findexpNxt.fromdate : selectedMonNxtStartDate;
                let findNxtEndDate = findexpNxt ? findexpNxt.todate : selectedMonNxtEndDate;

                const calculateMonthsBetweenDates = (startDate, endDate) => {
                  if (startDate && endDate) {
                    const start = new Date(startDate);
                    const end = new Date(endDate);

                    let years = end.getFullYear() - start.getFullYear();
                    let months = end.getMonth() - start.getMonth();
                    let days = end.getDate() - start.getDate();

                    // Convert years to months
                    months += years * 12;

                    // Adjust for negative days
                    if (days < 0) {
                      months -= 1; // Subtract a month
                      days += new Date(end.getFullYear(), end.getMonth(), 0).getDate(); // Add days of the previous month
                    }

                    // Adjust for days 15 and above
                    if (days >= 15) {
                      months += 1; // Count the month if 15 or more days have passed
                    }

                    return months <= 0 ? 0 : months;
                  }

                  return 0; // Return 0 if either date is missing
                };

                // Calculate difference in months between findDate and item.doj
                let differenceInMonths, differenceInMonthsexp, differenceInMonthstar;
                if (modevalue) {
                  //findexp end difference yes/no
                  if (modevalue.endexp === "Yes") {
                    differenceInMonthsexp = calculateMonthsBetweenDates(item.doj, modevalue.endexpdate);
                    //  Math.floor((new Date(modevalue.endexpdate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
                    if (modevalue.expmode === "Add") {
                      differenceInMonthsexp += parseInt(modevalue.expval);
                    } else if (modevalue.expmode === "Minus") {
                      differenceInMonthsexp -= parseInt(modevalue.expval);
                    } else if (modevalue.expmode === "Fix") {
                      differenceInMonthsexp = parseInt(modevalue.expval);
                    }
                  } else {
                    differenceInMonthsexp = calculateMonthsBetweenDates(item.doj, findDate);
                    // Math.floor((new Date(findDate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
                    if (modevalue.expmode === "Add") {
                      differenceInMonthsexp += parseInt(modevalue.expval);
                    } else if (modevalue.expmode === "Minus") {
                      differenceInMonthsexp -= parseInt(modevalue.expval);
                    } else if (modevalue.expmode === "Fix") {
                      differenceInMonthsexp = parseInt(modevalue.expval);
                    } else {
                      // differenceInMonths = parseInt(modevalue.expval);
                      differenceInMonthsexp = calculateMonthsBetweenDates(item.doj, findDate);
                    }
                  }

                  //findtar end difference yes/no
                  if (modevalue.endtar === "Yes") {
                    differenceInMonthstar = calculateMonthsBetweenDates(item.doj, modevalue.endtardate);
                    //  Math.floor((new Date(modevalue.endtardate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
                    if (modevalue.expmode === "Add") {
                      differenceInMonthstar += parseInt(modevalue.expval);
                    } else if (modevalue.expmode === "Minus") {
                      differenceInMonthstar -= parseInt(modevalue.expval);
                    } else if (modevalue.expmode === "Fix") {
                      differenceInMonthstar = parseInt(modevalue.expval);
                    }
                  } else {
                    differenceInMonthstar = calculateMonthsBetweenDates(item.doj, findDate);
                    if (modevalue.expmode === "Add") {
                      differenceInMonthstar += parseInt(modevalue.expval);
                    } else if (modevalue.expmode === "Minus") {
                      differenceInMonthstar -= parseInt(modevalue.expval);
                    } else if (modevalue.expmode === "Fix") {
                      differenceInMonthstar = parseInt(modevalue.expval);
                    } else {
                      // differenceInMonths = parseInt(modevalue.expval);
                      differenceInMonthstar = calculateMonthsBetweenDates(item.doj, findDate);
                    }
                  }

                  differenceInMonths = calculateMonthsBetweenDates(item.doj, findDate);
                  if (modevalue.expmode === "Add") {
                    differenceInMonths += parseInt(modevalue.expval);
                  } else if (modevalue.expmode === "Minus") {
                    differenceInMonths -= parseInt(modevalue.expval);
                  } else if (modevalue.expmode === "Fix") {
                    differenceInMonths = parseInt(modevalue.expval);
                  } else {
                    // differenceInMonths = parseInt(modevalue.expval);
                    differenceInMonths = calculateMonthsBetweenDates(item.doj, findDate);
                  }
                } else {
                  differenceInMonthsexp = calculateMonthsBetweenDates(item.doj, findDate);
                  differenceInMonthstar = calculateMonthsBetweenDates(item.doj, findDate);
                  differenceInMonths = calculateMonthsBetweenDates(item.doj, findDate);
                }

                //GET PROCESS CODE FUNCTION
                const groupedByMonthProcs = {};

                // Group items by month
                item.processlog &&
                  item.processlog
                    .sort((a, b) => {
                      return new Date(a.date) - new Date(b.date);
                    })
                    .forEach((item) => {
                      const monthYear = item.date?.split("-")?.slice(0, 2).join("-");
                      if (!groupedByMonthProcs[monthYear]) {
                        groupedByMonthProcs[monthYear] = [];
                      }
                      groupedByMonthProcs[monthYear].push(item);
                    });

                // Extract the last item of each group
                const lastItemsForEachMonthPros = Object.values(groupedByMonthProcs).map((group) => group[group.length - 1]);

                // Filter the data array based on the month and year
                // lastItemsForEachMonthPros.sort((a, b) => {
                //   return new Date(a.date) - new Date(b.date);
                // });
                const totaluserDays = (new Date(thisMonthEndDate) - new Date(item.doj)) / (1000 * 60 * 60 * 24);
                const totaluserDaysNxtMonth = (new Date(findNxtEndDate) - new Date(item.doj)) / (1000 * 60 * 60 * 24);
                // Find the first item in the sorted array that meets the criteria
                let filteredItem = null;
                let filteredItemNxtMonth = null;
                for (let i = 0; i < lastItemsForEachMonthPros.length; i++) {
                  const date = lastItemsForEachMonthPros[i].date;

                  if (findDate >= date) {
                    filteredItem = lastItemsForEachMonthPros[i];
                  } else if (thisMonthEndDate >= date && totaluserDays < 31) {
                    filteredItem = lastItemsForEachMonthPros[i];
                  } else {
                    break;
                  }
                }
                for (let i = 0; i < lastItemsForEachMonthPros.length; i++) {
                  const date = lastItemsForEachMonthPros[i].date;

                  if (findNxtStartDate >= date) {
                    filteredItemNxtMonth = lastItemsForEachMonthPros[i];
                  } else if (findNxtEndDate >= date && totaluserDaysNxtMonth < 31) {
                    filteredItem = lastItemsForEachMonthPros[i];
                  } else {
                    break;
                  }
                }

                let getprocessCode = filteredItem ? filteredItem.process : "";

                // let procCodecheck = item.doj ? getprocessCode + (differenceInMonthsexp > 0 ? (differenceInMonthsexp <= 9 ? `0${differenceInMonthsexp}` : differenceInMonthsexp) : 0) : "";
                let processcodeexpvalue = item.doj && modevalue && modevalue.expmode === "Manual" ? modevalue.salarycode : item.doj ? getprocessCode + (differenceInMonthstar > 0 ? (differenceInMonthstar <= 9 ? `0${differenceInMonthstar}` : differenceInMonthstar) : "00") : "";

                let processcodeexpvaluesalary = item.doj && modevalue && modevalue.expmode === "Manual" ? modevalue.salarycode : item.doj ? getprocessCode + (differenceInMonthsexp > 0 ? (differenceInMonthsexp <= 9 ? `0${differenceInMonthsexp}` : differenceInMonthsexp) : "00") : "";

                let getprocessCodeNxtMonth = filteredItemNxtMonth ? filteredItemNxtMonth.process : "";

                let processcodeexpvalueNxtMonth = item.doj && modevalue && modevalue.expmode === "Manual" ? modevalue.salarycode : item.doj ? getprocessCodeNxtMonth + (differenceInMonthstar > 0 ? (differenceInMonthstar <= 9 ? `0${differenceInMonthstar}` : differenceInMonthstar) : "00") : "";

                let CHECK_DEPARTMENT_ACCESS = departmentsList.find((d) => d.deptname === item.department);

                //findsalary from salaryslab
                let findSalDetails =
                  modevalue && modevalue.expmode === "Manual"
                    ? {
                      basic: modevalue.basic,
                      hra: modevalue.hra,
                      conveyance: modevalue.conveyance,
                      gross: modevalue.gross,
                      medicalallowance: modevalue.medicalallowance,
                      productionallowance: modevalue.productionallowance,
                      otherallowance: modevalue.otherallowance,
                      productionallowancetwo: modevalue.productionallowancetwo,
                    }
                    : salSlabs.find((d) => d.company === item.company && d.branch === item.branch && d.salarycode === processcodeexpvaluesalary);
                //shortageamount from shortage master
                let findShortage = manageshortagemasters.find((d) => d.department === item.department && differenceInMonths >= Number(d.from) && differenceInMonths <= Number(d.to));
                //revenue amount from revenue  master
                let findRevenueAllow = revenueAmount.find((d) => d.company === item.company && d.branch === item.branch && d.processcode === processcodeexpvaluesalary);
                //finderaamount from eraamount
                let findERAaountValue = eraAmounts.find((d) => d.company === item.company && d.branch === item.branch && d.processcode === processcodeexpvaluesalary);

                let findAcPointVal = acPointCal.find((d) => d.company === item.company && d.branch === item.branch && d.department === item.department);

                // let totalShiftTrgt = findTotalNoOfDays ? Number(findTotalNoOfDays.shift) : 0;
                // let totalWeekoffTrgt = findTotalNoOfDays ? Number(findTotalNoOfDays.weekoff) : 0;
                // let totalWeekoffall = findTotalNoOfDays ? Number(findTotalNoOfDays.weekoffall) : 0;

                // let totalShiftTrgtNxt = findTotalNoOfDaysNxtMonth ? Number(findTotalNoOfDaysNxtMonth.shift) : 0;
                // let totalWeekoffTrgtNxt = findTotalNoOfDaysNxtMonth ? Number(findTotalNoOfDaysNxtMonth.weekoff) : 0;
                // let totalWeekoffallNxt = findTotalNoOfDaysNxtMonth ? Number(findTotalNoOfDaysNxtMonth.weekoffall) : 0;

                // let findTarDetails = targetPoints.filter((d) => d.processcode === processcodeexpvalue).find((tr) => item.branch === tr.branch && item.company === tr.company && tr.processcode === processcodeexpvalue);

                // let findTargetVal = findTarDetails ? Number(findTarDetails.points) : 0;

                // let findTarDetailsNxtMonth = targetPoints.filter((d) => d.processcode === processcodeexpvalueNxtMonth).find((tr) => item.branch === tr.branch && item.company === tr.company && tr.processcode === processcodeexpvalueNxtMonth);

                // let findTargetValNxtMonth = findTarDetailsNxtMonth ? Number(findTarDetailsNxtMonth.points) : 0;

                const isHadreasondate = item.reasondate != "" && item.reasondate != undefined;

                const enddateproduction = isHadreasondate ? item.reasondate : findexp ? findexp.todate : selectedMonEndDate;

                //GET POINTS FOR SELECTEDMONTH
                let getdayPointsMonth = dayPointsUser
                  .filter(
                    (d) =>
                      // console.log(   d.date , findDate , d.date , (findexp ? findexp.todate : selectedMonEndDate))
                      d.date >= findDate && d.date <= enddateproduction && d.name === item.companyname
                  )
                  .reduce((acc, current) => {
                    const existingItemIndex = acc.findIndex((item) => item.name === current.name && item.companyname === current.companyname && item.branch === current.branch && item.empcode === current.empcode);

                    if (existingItemIndex !== -1) {
                      // Update existing item
                      const existingItem = acc[existingItemIndex];

                      existingItem.point += Number(current.point);
                      // existingItem.pointarray +=[ Number(current.point)];

                      // existingItem.daypoint += Number(current.daypoint);
                      existingItem.target += current.weekoff == "Not Allotted" || current.weekoff == "Not Allot" || current.weekoff == "" || current.weekoff == "Week Off" || current.daypointsts === "WEEKOFF" ? 0 : Number(current.target);
                      // existingItem.weekoffcount += current.weekoff == "Not Allotted" || current.weekoff == "Not Allot" || current.weekoff == "" || current.weekoff == "Week Off" || current.daypointsts === "WEEKOFF" ? 1 : 0;
                      existingItem.date.push(current.date);
                      // existingItem.pointarray.push(current.weekoff == "Not Allotted" || current.weekoff == "Not Allot" || current.weekoff == "" || current.weekoff == "Week Off" || current.daypointsts === "WEEKOFF" ? 0 : Number(current.target));

                      existingItem.allowancepoint += current.conshiftpoints && current.shiftsts === "Enable" ? Number(current.conshiftpoints) : current.allowancepoint ? Number(current.allowancepoint) : 0;

                      if (current.shiftsts === "Enable" || current.allowancepoint >= 1) {
                        existingItem.noallowancepoint++; // Increment count only if allowancepoint is present
                      }

                      existingItem.avgpoint = existingItem.target > 0 ? (existingItem.point / existingItem.target) * 100 : 0;
                      existingItem.allowancetarget += current.shiftsts === "Enable" ? Number(current.target) : 0;
                      // Convert the dates array to Date objects
                      const dateObjects = existingItem.date.map((date) => new Date(date));

                      // Find the earliest (from) and latest (to) dates
                      const fromDate = new Date(Math.min(...dateObjects));
                      const toDate = new Date(Math.max(...dateObjects));
                      // Update start and end date
                      existingItem.startDate = fromDate;
                      existingItem.endDate = toDate;
                    } else {
                      // Add new item
                      acc.push({
                        companyname: current.companyname,
                        name: current.name,
                        // daypoint: Number(current.daypoint),
                        avgpoint: (Number(current.point) / Number(current.target)) * 100,
                        point: Number(current.point),
                        target: current.weekoff == "Not Allotted" || current.weekoff == "Not Allot" || current.weekoff == "" || current.weekoff == "Week Off" || current.daypointsts === "WEEKOFF" ? 0 : Number(current.target),
                        // _id: current.id,
                        branch: current.branch,
                        date: [current.date],
                        unit: current.unit,
                        team: current.team,
                        empcode: current.empcode,
                        // weekoffcount: current.weekoff == "Not Allotted" || current.weekoff == "Not Allot" || current.weekoff == "" || current.weekoff == "Week Off" || current.daypointsts === "WEEKOFF" ? 1 : 0,
                        // doj: current.doj,
                        // department: current.department,
                        // prod: current.prod,
                        startDate: current.date,
                        endDate: current.date,
                        allowancetarget: current.shiftsts === "Enable" ? Number(current.target) : 0,
                        // pointarray: [current.weekoff == "Not Allotted" || current.weekoff == "Not Allot" || current.weekoff == "" || current.weekoff == "Week Off"  || current.daypointsts === "WEEKOFF" ? 0 : Number(current.target)],
                        allowancepoint: current.conshiftpoints && current.shiftsts === "Enable" ? Number(current.conshiftpoints) : current.allowancepoint ? Number(current.allowancepoint) : 0,

                        noallowancepoint: current.shiftsts === "Enable" || current.allowancepoint >= 1 ? 1 : 0,
                      });
                    }
                    return acc;
                  }, []);

                let findPointsDetails = getdayPointsMonth.find((d) => d.companyname === item.company && d.branch === item.branch && d.unit === item.unit && d.name === item.companyname);
                const enddateproductionnxtmonth = isHadreasondate ? item.reasondate : findNxtEndDate;

                //GET POINTS FOR CURRENT MONTH WHICH IS THE AFTER MONTH OF SELECTED MONTH
                let getdayPointsMonthNxtMonth = dayPointsUserNxtMonth
                  .filter(
                    (d) =>
                      // console.log(   d.date , findDate , d.date , (findexp ? findexp.todate : selectedMonEndDate))
                      d.date >= findNxtStartDate && d.date <= enddateproductionnxtmonth && d.name === item.companyname
                  )
                  .reduce((acc, current) => {
                    const existingItemIndex = acc.findIndex((item) => item.name === current.name && item.companyname === current.companyname && item.branch === current.branch && item.empcode === current.empcode);

                    if (existingItemIndex !== -1) {
                      // Update existing item
                      const existingItem = acc[existingItemIndex];

                      existingItem.point += Number(current.point);
                      // existingItem.daypoint += Number(current.daypoint);
                      // existingItem.target = Number(findTargetValNxtMonth) * existingItem.date.length;
                      existingItem.target += current.weekoff == "Not Allotted" || current.weekoff == "Not Allot" || current.weekoff == "" || current.weekoff == "Week Off" || current.daypointsts === "WEEKOFF" ? 0 : Number(current.target);

                      existingItem.date.push(current.date);

                      existingItem.allowancepoint += current.conshiftpoints && current.shiftsts === "Enable" ? Number(current.conshiftpoints) : current.allowancepoint ? Number(current.allowancepoint) : 0;
                      if ((current.conshiftpoints >= 1 && current.shiftsts === "Enable") || current.allowancepoint >= 1) {
                        existingItem.noallowancepoint++; // Increment count only if allowancepoint is present
                      }

                      existingItem.avgpoint = existingItem.target > 0 ? (existingItem.point / existingItem.target) * 100 : 0;

                      // Convert the dates array to Date objects
                      const dateObjects = existingItem.date.map((date) => new Date(date));

                      // Find the earliest (from) and latest (to) dates
                      const fromDate = new Date(Math.min(...dateObjects));
                      const toDate = new Date(Math.max(...dateObjects));
                      // Update start and end date
                      existingItem.startDate = fromDate;
                      existingItem.endDate = toDate;
                    } else {
                      // Add new item
                      acc.push({
                        companyname: current.companyname,
                        name: current.name,
                        // daypoint: Number(current.daypoint),
                        avgpoint: (Number(current.point) / Number(current.target)) * 100,
                        point: Number(current.point),
                        target: current.weekoff == "Not Allotted" || current.weekoff == "Not Allot" || current.weekoff == "" || current.weekoff == "Week Off" || current.daypointsts === "WEEKOFF" ? 0 : Number(current.target),
                        // _id: current.id,
                        branch: current.branch,
                        date: [current.date],
                        unit: current.unit,
                        team: current.team,
                        empcode: current.empcode,

                        startDate: current.date,
                        endDate: current.date,
                        allowancepoint: current.conshiftpoints && current.shiftsts === "Enable" ? Number(current.conshiftpoints) : current.allowancepoint ? Number(current.allowancepoint) : 0,
                        // noallowancepoint:Number(current.noallowancepoint),
                        noallowancepoint: (current.conshiftpoints && current.shiftsts === "Enable" ? Number(current.conshiftpoints) : current.allowancepoint ? Number(current.allowancepoint) : 0) > 0 ? 1 : 0,
                      });
                    }
                    return acc;
                  }, []);

                let findPointsDetailsNxtMonth = getdayPointsMonthNxtMonth.find(
                  (d) => d.companyname == item.company && d.branch == item.branch && d.unit == item.unit && d.name == item.companyname
                  // && d.empcode === item.empcode
                );
                // console.log(findPointsDetailsNxtMonth,'findPointsDetailsNxtMonth')
                // console.log(dayPointsUserNxtMonth, findPointsDetailsNxtMonth, findNxtStartDate, findNxtEndDate, 'dayPointsUserNxtMonth');

                let getdayPenaltyMonth = dayPenaltyUser
                  .filter((d) => d.date >= findDate && d.date <= (findexp ? findexp.todate : selectedMonEndDate))
                  .reduce((acc, current) => {
                    const existingItemIndex = acc.findIndex((item) => item.name === current.name && item.company === current.company && item.branch === current.branch && item.empcode === current.empcode);

                    if (existingItemIndex !== -1) {
                      // Update existing item
                      const existingItem = acc[existingItemIndex];

                      existingItem.amount += Number(current.amount);

                      existingItem.date.push(current.date);

                      // Convert the dates array to Date objects
                      const dateObjects = existingItem.date.map((date) => new Date(date));

                      // Find the earliest (from) and latest (to) dates
                      const fromDate = new Date(Math.min(...dateObjects));
                      const toDate = new Date(Math.max(...dateObjects));
                      // Update start and end date
                      existingItem.startDate = fromDate;
                      existingItem.endDate = toDate;
                    } else {
                      // Add new item
                      acc.push({
                        company: current.company,
                        name: current.name,
                        amount: Number(current.amount),
                        _id: current.id,
                        branch: current.branch,
                        date: [current.date],
                        unit: current.unit,
                        team: current.team,
                        empcode: current.empcode,
                        startDate: current.date,
                        endDate: current.date,
                      });
                    }
                    return acc;
                  }, []);

                let findPenaltyDetails = getdayPenaltyMonth.find(
                  (d) =>
                    d.company === item.company &&
                    d.branch === item.branch &&
                    d.unit === item.unit &&
                    // && d.team === item.team
                    d.name === item.companyname
                );

                let experienceinmonthCalcVal = item.doj ? calculateMonthsBetweenDates(item.doj, findDate) : 0;

                // REVENUE AMOUNT
                let revenueAmountCalc = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.era === true ? (findRevenueAllow ? Number(findRevenueAllow.amount) : 0) : 0;

                let shiftAllowAmt =
                  item.shiftallowancelog && item.shiftallowancelog.length > 0
                    ? item.shiftallowancelog.filter((d) => {
                      return d.month === data.selectedmonth && d.year == data.selectedyear;
                    })
                    : [];

                let TargetPointAmt =
                  item.targetpointlog && item.targetpointlog.length > 0
                    ? item.targetpointlog.filter((d) => {
                      return d.month === data.selectedmonth && d.year == data.selectedyear;
                    })
                    : [];

                let AcheivedPointAmt =
                  item.acheivedpointlog && item.acheivedpointlog.length > 0
                    ? item.acheivedpointlog.filter((d) => {
                      return d.month === data.selectedmonth && d.year == data.selectedyear;
                    })
                    : [];
                let PenaltyPointAmt =
                  item.penaltylog && item.penaltylog.length > 0
                    ? item.penaltylog.filter((d) => {
                      return d.month === data.selectedmonth && d.year == data.selectedyear;
                    })
                    : [];
                let totalPaidDaysLogVal =
                  item.totalpaiddayslog && item.totalpaiddayslog.length > 0
                    ? item.totalpaiddayslog.filter((d) => {
                      return d.month === data.selectedmonth && d.year == data.selectedyear;
                    })
                    : [];
                let totalAbsentLogVal =
                  item.totalabsentlog && item.totalabsentlog.length > 0
                    ? item.totalabsentlog.filter((d) => {
                      return d.month === data.selectedmonth && d.year == data.selectedyear;
                    })
                    : [];
                let currMonAvgLogVal =
                  item.currmonthavglog && item.currmonthavglog.length > 0
                    ? item.currmonthavglog.filter((d) => {
                      return d.month === data.selectedmonth && d.year == data.selectedyear;
                    })
                    : [];
                let currMonAttLogVal =
                  item.currmonthattlog && item.currmonthattlog.length > 0
                    ? item.currmonthattlog.filter((d) => {
                      return d.month === data.selectedmonth && d.year == data.selectedyear;
                    })
                    : [];

                let noShiftLogVal =
                  item.noshiftlog && item.noshiftlog.length > 0
                    ? item.noshiftlog.filter((d) => {
                      return d.month === data.selectedmonth && d.year == data.selectedyear;
                    })
                    : [];

                let shiftAllowTargetlogVal =
                  item.shiftallowtargetlog && item.shiftallowtargetlog.length > 0
                    ? item.shiftallowtargetlog.filter((d) => {
                      return d.month === data.selectedmonth && d.year == data.selectedyear;
                    })
                    : [];
                let nightShiftAllowlogLogVal =
                  item.nightshiftallowlog && item.nightshiftallowlog.length > 0
                    ? item.nightshiftallowlog.filter((d) => {
                      return d.month === data.selectedmonth && d.year == data.selectedyear;
                    })
                    : [];

                let paidpresentdayvalue = findTotalNoOfDays ? Number(findTotalNoOfDays.paidpresentday) : 0;
                let leaveCountvalue = findTotalNoOfDays ? Number(findTotalNoOfDays.leaveCount) : 0;
                let holidayCountvalue = findTotalNoOfDays ? Number(findTotalNoOfDays.holidayCount) : 0;
                let shiftvalue = findTotalNoOfDays ? Number(findTotalNoOfDays.shift) : 0;
                let lopcountvalue = findTotalNoOfDays ? Number(findTotalNoOfDays.lopcount) : 0;

                let paiddayscalcvalfrommonthstatus = paidpresentdayvalue;
                //  Number(paidpresentdayvalue) + Number(leaveCountvalue) + Number(holidayCountvalue) > Number(shiftvalue) ? Number(shiftvalue) - Number(lopcountvalue) : Number(paidpresentdayvalue) + Number(leaveCountvalue) + Number(holidayCountvalue);

                let paidpresentdayallCalcVal = shiftvalue;
                let totalshiftCalcVal = Number(paidpresentdayallCalcVal);
                let totalasbleaveCalcVal = item.totalabsentlog && item.totalabsentlog.length > 0 && totalAbsentLogVal && totalAbsentLogVal.length > 0 ? Number(totalAbsentLogVal[totalAbsentLogVal.length - 1].value) : findTotalNoOfDays ? Number(findTotalNoOfDays.lopcount) : 0;
                let totalpaiddaycalVal = item.totalpaiddayslog && item.totalpaiddayslog.length > 0 && totalPaidDaysLogVal && totalPaidDaysLogVal.length > 0 ? Number(totalPaidDaysLogVal[totalPaidDaysLogVal.length - 1].value) : paiddayscalcvalfrommonthstatus;

                let pfvalues = item.assignpfesilog && item.assignpfesilog.length > 0 ? item.assignpfesilog[item.assignpfesilog.length - 1] : {};

                let targetPointCalcVaue = item.targetpointlog && item.targetpointlog.length > 0 && TargetPointAmt && TargetPointAmt.length > 0 ? Number(TargetPointAmt[TargetPointAmt.length - 1].value) : findPointsDetails ? Number(findPointsDetails.target) : 0;
                let AcheivedPointsCalcVal = updatedacheivedpoints;
                AcheivedPointsCalcVal = Number(Number(AcheivedPointsCalcVal).toFixed(2));
                let AcheivedPercentCalcVal = targetPointCalcVaue > 0 ? Number(((Number(AcheivedPointsCalcVal) / Number(targetPointCalcVaue)) * 100).toFixed(2)) : 0;

                let allowancepointCalcVal = item.shiftallowancelog && item.shiftallowancelog.length > 0 && shiftAllowAmt && shiftAllowAmt.length > 0 ? Number(shiftAllowAmt[shiftAllowAmt.length - 1].value) : findPointsDetails ? Number(findPointsDetails.allowancepoint) : 0;
                allowancepointCalcVal = Number(Number(allowancepointCalcVal).toFixed(2));

                let ERAAmountCalcVal = findERAaountValue ? findERAaountValue.amount : 0;
                let penaltyCalcVal = item.penaltylog && item.penaltylog.length > 0 && PenaltyPointAmt && PenaltyPointAmt.length > 0 ? Number(PenaltyPointAmt[PenaltyPointAmt.length - 1].value) : findPenaltyDetails ? Number(findPenaltyDetails.amount) : 0;
                penaltyCalcVal = Number(Number(penaltyCalcVal).toFixed(2));
                let totalNoOfDaysCalcVal = findTotalNoOfDays ? Number(findTotalNoOfDays.totalcounttillcurrendate) : 0;

                //PRODUCTION AND PRODCTION ALLOWACE2
                let oldprodAllowanceCalcVal = modevalue && modevalue.expmode === "Manual" ? Number(modevalue.productionallowance) : findSalDetails ? Number(findSalDetails.productionallowance) : 0;
                let oldprodAllowancetwoCalcVal = modevalue && modevalue.expmode === "Manual" ? Number(modevalue.productionallowancetwo) : findSalDetails ? Number(findSalDetails.productionallowancetwo) : 0;
                // ACUTAL BASIC/HRA/CONVEYACE/MEDICAL/OTHER ALLOWANCE
                let oldactualBasicCalcVal = modevalue && modevalue.expmode === "Manual" ? Number(modevalue.basic) : findSalDetails ? Number(findSalDetails.basic) : 0;
                let oldactualHraCalcVal = modevalue && modevalue.expmode === "Manual" ? Number(modevalue.hra) : findSalDetails ? Number(findSalDetails.hra) : 0;
                let oldactualConveyanceCalcVal = modevalue && modevalue.expmode === "Manual" ? Number(modevalue.conveyance) : findSalDetails ? Number(findSalDetails.conveyance) : 0;
                let oldactualMedicalAllowCalcVal = modevalue && modevalue.expmode === "Manual" ? Number(modevalue.medicalallowance) : findSalDetails ? Number(findSalDetails.medicalallowance) : 0;
                let oldactualOtherCalVAL = modevalue && modevalue.expmode === "Manual" ? Number(modevalue.otherallowance) : findSalDetails ? Number(findSalDetails.otherallowance) : 0;

                // const getDatesInRange = (fromDate, toDate) => {
                //   const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                //   const startDate = new Date(fromDate);
                //   const endDate = new Date(toDate);

                //   // Add one day to include the end date
                //   endDate.setDate(endDate.getDate() + 1);

                //   let count = 0;
                //   for (let date = startDate; date < endDate; date.setDate(date.getDate() + 1)) {
                //     count++;
                //   }

                //   return count;
                // };

                // let tond = getDatesInRange(findDate, findmonthenddate);
                function getTotalDaysInMonthByName(monthName, year) {
                  const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth() + 1; // Convert month name to number
                  return new Date(year, monthIndex, 0).getDate();
                }

                let tond = getTotalDaysInMonthByName(data.selectedmonth, Number(data.selectedyear));
                // console.log(tond, 'tond');
                let prodAllowanceCalcVal = Number(((Number(oldprodAllowanceCalcVal) / tond) * totalshiftCalcVal).toFixed(2));
                let prodAllowancetwoCalcVal = Number(((Number(oldprodAllowancetwoCalcVal) / tond) * totalshiftCalcVal).toFixed(2));
                //calculated  ACUTAL BASIC/HRA/CONVEYACE/MEDICAL/OTHER ALLOWANCE
                let actualBasicCalcVal = Number(((Number(oldactualBasicCalcVal) / tond) * totalshiftCalcVal).toFixed(2));

                let actualHraCalcVal = Number(((Number(oldactualHraCalcVal) / tond) * totalshiftCalcVal).toFixed(2));
                let actualConveyanceCalcVal = Number(((Number(oldactualConveyanceCalcVal) / tond) * totalshiftCalcVal).toFixed(2));
                let actualMedicalAllowCalcVal = Number(((Number(oldactualMedicalAllowCalcVal) / tond) * totalshiftCalcVal).toFixed(2));
                let actualOtherCalVAL = Number(((Number(oldactualOtherCalVAL) / tond) * totalshiftCalcVal).toFixed(2));

                let oldgross = modevalue && modevalue.expmode === "Manual" ? Number(modevalue.gross) : Number(oldactualBasicCalcVal) + Number(oldactualHraCalcVal) + Number(oldactualConveyanceCalcVal) + Number(oldactualMedicalAllowCalcVal) + Number(oldprodAllowanceCalcVal) + Number(oldactualOtherCalVAL);

                let grossValue = modevalue && modevalue.expmode === "Manual" ? Number(modevalue.gross) : Number(actualBasicCalcVal) + Number(actualHraCalcVal) + Number(actualConveyanceCalcVal) + Number(actualMedicalAllowCalcVal) + Number(prodAllowanceCalcVal) + Number(actualOtherCalVAL);
                grossValue = Number(Number(grossValue).toFixed(2));
                ///FINAL-FIXED-PROD SALARY CALCULATION STARTED--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

                let findPFpercentage = modevalue && modevalue.expmode === "Manual" ? Number(modevalue.pfemployeepercentage) : findSalDetails ? Number(findSalDetails.pfemployeepercentage) : 0;
                let findESIpercentage = modevalue && modevalue.expmode === "Manual" ? Number(modevalue.esiemployeepercentage) : findSalDetails ? Number(findSalDetails.esiemployeepercentage) : 0;
                let findEsiMAXSalary = findSalDetails ? Number(findSalDetails.esimaxsalary) : 0;
                let findEmployerPercentage = findSalDetails ? Number(findSalDetails.pfpercentage) : 0;
                let findEmployerESIPercentage = findSalDetails ? Number(findSalDetails.esipercentage) : 0;

                //ATTENDANCE LOP CALCUCLATION
                let attendanceLopCalVal = totalshiftCalcVal > 0 ? ((actualBasicCalcVal + actualHraCalcVal + actualConveyanceCalcVal + actualMedicalAllowCalcVal + actualOtherCalVAL) / totalshiftCalcVal) * Number(totalasbleaveCalcVal) : 0;
                //ACHEIVED PRODUCTION ALLOWANCE
                let acheivedProductionAllowanceValCal =
                  (AcheivedPointsCalcVal ? Number(AcheivedPointsCalcVal) : 0) > 0 && Number(targetPointCalcVaue ? targetPointCalcVaue : 0)
                    ? AcheivedPointsCalcVal < targetPointCalcVaue
                      ? Number(prodAllowanceCalcVal) - (prodAllowancetwoCalcVal ? Number(prodAllowancetwoCalcVal) : 0) * ((100 - (Number(AcheivedPointsCalcVal ? AcheivedPointsCalcVal : 0) * 100) / Number(targetPointCalcVaue ? targetPointCalcVaue : 0)) * 0.01)
                      : Number(prodAllowanceCalcVal) * (((Number(AcheivedPointsCalcVal ? AcheivedPointsCalcVal : 0) * 100) / Number(targetPointCalcVaue ? targetPointCalcVaue : 0)) * 0.01)
                    : 0;

                //LOP BASIC
                let lopBasicValCal = totalNoOfDaysCalcVal > 0 ? (Number(totalpaiddaycalVal) + Number(totalasbleaveCalcVal) > Number(totalNoOfDaysCalcVal) ? (Number(actualBasicCalcVal) / (totalasbleaveCalcVal + totalpaiddaycalVal)) * totalNoOfDaysCalcVal : (Number(actualBasicCalcVal) / totalshiftCalcVal) * totalpaiddaycalVal) : 0;

                let lopHRAValCal = totalNoOfDaysCalcVal > 0 ? (Number(totalpaiddaycalVal) + Number(totalasbleaveCalcVal) > Number(totalNoOfDaysCalcVal) ? (Number(actualHraCalcVal) / (totalasbleaveCalcVal + totalpaiddaycalVal)) * totalNoOfDaysCalcVal : (Number(actualHraCalcVal) / totalshiftCalcVal) * totalpaiddaycalVal) : 0;

                let lopConveyValCal = totalNoOfDaysCalcVal > 0 ? (Number(totalpaiddaycalVal) + Number(totalasbleaveCalcVal) > Number(totalNoOfDaysCalcVal) ? (Number(actualConveyanceCalcVal) / (totalasbleaveCalcVal + totalpaiddaycalVal)) * totalNoOfDaysCalcVal : (Number(actualConveyanceCalcVal) / totalshiftCalcVal) * totalpaiddaycalVal) : 0;

                let lopMedicalValCal = totalNoOfDaysCalcVal > 0 ? (Number(totalpaiddaycalVal) + Number(totalasbleaveCalcVal) > Number(totalNoOfDaysCalcVal) ? (Number(actualMedicalAllowCalcVal) / (totalasbleaveCalcVal + totalpaiddaycalVal)) * totalNoOfDaysCalcVal : (Number(actualMedicalAllowCalcVal) / totalshiftCalcVal) * totalpaiddaycalVal) : 0;

                let lopOtherValCal = totalNoOfDaysCalcVal > 0 ? (Number(totalpaiddaycalVal) + Number(totalasbleaveCalcVal) > Number(totalNoOfDaysCalcVal) ? (Number(actualOtherCalVAL) / (totalasbleaveCalcVal + totalpaiddaycalVal)) * totalNoOfDaysCalcVal : (Number(actualOtherCalVAL) / totalshiftCalcVal) * totalpaiddaycalVal) : 0;

                let lopProductionAllowance =
                  AcheivedPointsCalcVal && Number(AcheivedPointsCalcVal) > 0
                    ? AcheivedPointsCalcVal < targetPointCalcVaue
                      ? Number(prodAllowanceCalcVal) - (prodAllowancetwoCalcVal ? Number(prodAllowancetwoCalcVal) : 0) * ((100 - (Number(AcheivedPointsCalcVal ? AcheivedPointsCalcVal : 0) * 100) / Number(targetPointCalcVaue ? targetPointCalcVaue : 0)) * 0.01)
                      : Number(prodAllowanceCalcVal) * (((Number(AcheivedPointsCalcVal ? AcheivedPointsCalcVal : 0) * 100) / Number(targetPointCalcVaue ? targetPointCalcVaue : 0)) * 0.01)
                    : 0;
                //  AcheivedPointsCalcVal > 0 ? (AcheivedPointsCalcVal < targetPointCalcVaue ? prodAllowanceCalcVal - (prodAllowancetwoCalcVal * (100 - (AcheivedPointsCalcVal * 100) / targetPointCalcVaue)) * 0.01 : (prodAllowanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal) : 0;

                //PROD BASIC
                let prodBasicValCalc = lopBasicValCal;
                let prodHraValCalc = lopHRAValCal;
                let prodConveyanceValCalc = lopConveyValCal;
                let prodMEDAllowanceValCalc = lopMedicalValCal;
                let prodOtherValCalc = lopOtherValCal;
                let prodPRODValCalc = lopProductionAllowance;
                if (CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.prod === true) {
                  if (Number(prodAllowanceCalcVal) === 0) {
                    prodBasicValCalc = lopBasicValCal;
                    prodHraValCalc = lopHRAValCal;
                    prodConveyanceValCalc = lopConveyValCal;
                    prodMEDAllowanceValCalc = lopMedicalValCal;
                    prodOtherValCalc = lopOtherValCal;
                    prodPRODValCalc = lopProductionAllowance;
                  } else {
                    prodBasicValCalc = acheivedProductionAllowanceValCal == 0 ? 0 : acheivedProductionAllowanceValCal > 0 ? lopBasicValCal : lopBasicValCal + (lopBasicValCal * ((100 * acheivedProductionAllowanceValCal) / (lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopOtherValCal))) / 100;
                    prodHraValCalc = acheivedProductionAllowanceValCal == 0 ? 0 : acheivedProductionAllowanceValCal > 0 ? lopHRAValCal : lopHRAValCal + (lopHRAValCal * ((100 * acheivedProductionAllowanceValCal) / (lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopOtherValCal))) / 100;
                    prodConveyanceValCalc = acheivedProductionAllowanceValCal == 0 ? 0 : acheivedProductionAllowanceValCal > 0 ? lopConveyValCal : lopConveyValCal + (lopConveyValCal * ((100 * acheivedProductionAllowanceValCal) / (lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopOtherValCal))) / 100;
                    prodMEDAllowanceValCalc = acheivedProductionAllowanceValCal == 0 ? 0 : acheivedProductionAllowanceValCal > 0 ? lopMedicalValCal : lopMedicalValCal + (lopMedicalValCal * ((100 * acheivedProductionAllowanceValCal) / (lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopOtherValCal))) / 100;
                    prodMEDAllowanceValCalc = acheivedProductionAllowanceValCal == 0 ? 0 : acheivedProductionAllowanceValCal > 0 ? lopOtherValCal : lopOtherValCal + (lopOtherValCal * ((100 * acheivedProductionAllowanceValCal) / (lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopOtherValCal))) / 100;
                    prodPRODValCalc = acheivedProductionAllowanceValCal == 0 ? 0 : acheivedProductionAllowanceValCal > 0 ? acheivedProductionAllowanceValCal : 0;
                  }
                } else {
                  prodBasicValCalc = lopBasicValCal;
                  prodHraValCalc = lopHRAValCal;
                  prodConveyanceValCalc = lopConveyValCal;
                  prodMEDAllowanceValCalc = lopMedicalValCal;
                  prodOtherValCalc = lopOtherValCal;
                  prodPRODValCalc = lopProductionAllowance;
                }

                // //PROD BASIC
                // let prodBasicValCalc =
                //   CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === false
                //     ? lopBasicValCal
                //     : acheivedProductionAllowanceValCal === 0
                //     ? 0
                //     : acheivedProductionAllowanceValCal > 0
                //     ? lopBasicValCal
                //     : lopBasicValCal + (lopBasicValCal * ((100 * acheivedProductionAllowanceValCal) / (lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopOtherValCal))) / 100;
                // //PROD HRA
                // let prodHraValCalc =
                //   CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === false
                //     ? lopHRAValCal
                //     : acheivedProductionAllowanceValCal === 0
                //     ? 0
                //     : acheivedProductionAllowanceValCal > 0
                //     ? lopHRAValCal
                //     : lopHRAValCal + (lopHRAValCal * ((100 * acheivedProductionAllowanceValCal) / (lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopOtherValCal))) / 100;
                // //PROD CONVEYANCE
                // let prodConveyanceValCalc =
                //   CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === false
                //     ? lopConveyValCal
                //     : acheivedProductionAllowanceValCal === 0
                //     ? 0
                //     : acheivedProductionAllowanceValCal > 0
                //     ? lopConveyValCal
                //     : lopConveyValCal + (lopConveyValCal * ((100 * acheivedProductionAllowanceValCal) / (lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopOtherValCal))) / 100;

                // //PROD MEDICAL ALLOWANCE
                // let prodMEDAllowanceValCalc =
                //   CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === false
                //     ? lopMedicalValCal
                //     : acheivedProductionAllowanceValCal === 0
                //     ? 0
                //     : acheivedProductionAllowanceValCal > 0
                //     ? lopMedicalValCal
                //     : lopMedicalValCal + (lopMedicalValCal * ((100 * acheivedProductionAllowanceValCal) / (lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopOtherValCal))) / 100;

                // //PROD OTHER ALLOWANCE
                // let prodOtherValCalc =
                //   CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === false
                //     ? lopOtherValCal
                //     : acheivedProductionAllowanceValCal === 0
                //     ? 0
                //     : acheivedProductionAllowanceValCal > 0
                //     ? lopOtherValCal
                //     : lopOtherValCal + (lopOtherValCal * ((100 * acheivedProductionAllowanceValCal) / (lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopOtherValCal))) / 100;

                // //PROD PRODUCTION ALLOWANCE
                // let prodPRODValCalc = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === false ? lopProductionAllowance : acheivedProductionAllowanceValCal > 0 ? acheivedProductionAllowanceValCal : 0;

                let penaltyAmtCalculationVal = updatedPenaltyAmount;
                // Number(experienceinmonthCalcVal) <= 0 ? 0 : Number(experienceinmonthCalcVal) >= 1 ? (Number(experienceinmonthCalcVal) >= 2 ? (Number(experienceinmonthCalcVal) >= 3 ? (Number(experienceinmonthCalcVal) >= 4 ? Number(penaltyCalcVal) - Number(penaltyCalcVal) * 0 : Number(penaltyCalcVal) - Number(penaltyCalcVal) * 0.25) : Number(penaltyCalcVal) - Number(penaltyCalcVal) * 0.5) : Number(penaltyCalcVal) - Number(penaltyCalcVal) * 0.75) : Number(penaltyCalcVal) - Number(penaltyCalcVal) * 1;

                let calcNetSalaryValCalc = Number(AcheivedPointsCalcVal) > 0 && Number(prodAllowanceCalcVal) > 0 ? lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopProductionAllowance + lopOtherValCal : 0;

                let ProdNetSalaryFinal = prodBasicValCalc + prodHraValCalc + prodConveyanceValCalc + prodMEDAllowanceValCalc + prodPRODValCalc + prodOtherValCalc;

                let lossDed = 0;
                let OtherDed = 0;

                let finalBasicValCalc = prodBasicValCalc === 0 ? 0 : prodBasicValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodBasicValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;
                let finalHraValCalc = prodHraValCalc === 0 ? 0 : prodHraValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodHraValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;
                let finalConveyValCalc =
                  prodConveyanceValCalc === 0 ? 0 : prodConveyanceValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodConveyanceValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;

                let finalMedicalAllowValcCalc =
                  prodMEDAllowanceValCalc === 0 ? 0 : prodMEDAllowanceValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodMEDAllowanceValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;
                let finalOtherValcCalc = prodOtherValCalc === 0 ? 0 : prodOtherValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodOtherValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;
                let finalProductionValcCalc = prodPRODValCalc === 0 ? 0 : prodPRODValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodPRODValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;

                let finalNetSalaryValcCalc = finalBasicValCalc + finalHraValCalc + finalConveyValCalc + finalMedicalAllowValcCalc + finalProductionValcCalc + finalOtherValcCalc;

                //PFDAYS AND PFDEDUCTION
                // let userWeekoff = findTotalNoOfDays ? Number(findTotalNoOfDays.weekoff) : 0;
                // let userCLSL = findTotalNoOfDays ? Number(findTotalNoOfDays.clsl) : 0;
                // let DLOB = findTotalNoOfDays ? Number(findTotalNoOfDays.dlob) : 0;
                // let Present = findTotalNoOfDays ? Number(findTotalNoOfDays.present) : 0;
                // //PFDAYS AND PFDEDUCTION
                // let pfdatcal = 0;
                // let daysp = totalshiftCalcVal - totalasbleaveCalcVal;
                // let IsExDate = pfvalues.pfenddate && pfvalues.pfenddate !== '' ? true : false;
                // //Dftdate = pfesifromdate findDate = monthstart fromdate or month fromdate
                // let pfmode = pfvalues.pffromdate > findDate ? 'S' : IsExDate ? 'E' : 'ALL';
                // let PLOP = userWeekoff + userCLSL;

                // pfdatcal = pfmode === 'S' || pfmode === 'E' ? Number(pfdatcal) + userWeekoff + userCLSL + Number(Present) - DLOB : Number(Present) + Number(PLOP);
                // let PfDate = daysp >= pfdatcal ? (IsExDate === true && new Date(pfvalues.pfenddate) < new Date(findDate) ? 0 : Number(pfdatcal) + Number(totalasbleaveCalcVal)) : Number(daysp) + Number(totalasbleaveCalcVal);
                // let pfDaysVal = pfvalues.pfdeduction === true ? PfDate : 0;
                // let pfAmount = pfvalues.pfdeduction === true ? Number(findPFpercentage) / 100 : 0;
                let pfdatcal = 0;
                let daysp = totalshiftCalcVal - totalasbleaveCalcVal;
                let IsExDate = pfvalues.pfenddate ? true : false;
                //Dftdate = pfesifromdate findDate = monthstart fromdate or month fromdate
                let pfmode = pfvalues.pffromdate > findDate ? "S" : IsExDate ? "E" : "ALL";
                let PLOP = (findTotalNoOfDays ? findTotalNoOfDays.weekoff : 0) + (findTotalNoOfDays ? findTotalNoOfDays.clsl : 0);
                pfdatcal = pfmode === "S" || pfmode === "E" ? Number(pfdatcal) + Number(totalpaiddaycalVal) : Number(totalpaiddaycalVal);
                let PfDate = daysp >= pfdatcal ? (IsExDate === true && new Date(pfvalues.pfenddate) < new Date(findDate) ? 0 : Number(pfdatcal) + Number(totalasbleaveCalcVal)) : Number(daysp ? daysp : 0) + Number(totalasbleaveCalcVal ? totalasbleaveCalcVal : 0);
                // console.log(daysp >= pfdatcal, daysp, pfdatcal, PfDate, 'PfDate');

                let pfDaysVal = pfvalues.pfdeduction === true ? PfDate : 0;
                let pfAmount = pfvalues.pfdeduction === true ? Number(findPFpercentage) / 100 : 0;
                // console.log(pfDaysVal, 'PfDate');
                // console.log(pfDaysVal, 'PfDate');
                // console.log(pfDaysVal, 'PfDate');
                let PF_deduction = pfDaysVal > 0 && totalshiftCalcVal > 0 ? ((Number(finalBasicValCalc) / Number(totalshiftCalcVal)) * Number(pfDaysVal) * Number(pfAmount)).toFixed(2) : 0;

                //  let PF_deduction  = ((pfDaysVal >= totalshiftCalcVal) ? (finalBasicValCalc * (Number(findPFpercentage)/100)) : ((finalBasicValCalc / totalshiftCalcVal) * pfDaysVal) * (Number(findPFpercentage)/100)) : 0
                // FIND SHIFTALLOWACE
                // let checkShiftAllowApplies = shifts.find((d) => d.name === item.shifttiming);
                // let CHECKSHIFTALLOWANCE = checkShiftAllowApplies ? checkShiftAllowApplies.isallowance : "Disable";

                let noshiftlogvalfinal = item.noshiftlog && item.noshiftlog.length > 0 && noShiftLogVal && noShiftLogVal.length > 0 ? Number(noShiftLogVal[noShiftLogVal.length - 1].value) : findPointsDetails ? Number(findPointsDetails.noallowancepoint) : 0;
                let shiftallowanceTargetDaypoint = item.noshiftlog && item.noshiftlog.length > 0 && noShiftLogVal && noShiftLogVal.length > 0 ? Number(noShiftLogVal[noShiftLogVal.length - 1].value) : findPointsDetails ? Number(findPointsDetails.allowancetarget) : 0;

                let shiftallowancetarget = noshiftlogvalfinal > 0 ? shiftallowanceTargetDaypoint : 0;

                let shiftallowancetargetfinal = item.shiftallowtargetlog && item.shiftallowtargetlog.length > 0 && shiftAllowTargetlogVal && shiftAllowTargetlogVal.length > 0 ? Number(shiftAllowTargetlogVal[shiftAllowTargetlogVal.length - 1].value) : shiftallowancetarget;

                let nightAllowancefinalcalculation =
                  //  CHECKSHIFTALLOWANCE === "Enable" &&
                  noshiftlogvalfinal > 0 ? ((1000 / tond) * noshiftlogvalfinal * (allowancepointCalcVal > 0 ? (allowancepointCalcVal * 100) / shiftallowancetargetfinal : 0)) / 100 : 0;

                let nightAllowanceCalcVal = item.nightshiftallowlog && item.nightshiftallowlog.length > 0 && nightShiftAllowlogLogVal && nightShiftAllowlogLogVal.length > 0 ? Number(nightShiftAllowlogLogVal[nightShiftAllowlogLogVal.length - 1].value) : nightAllowancefinalcalculation;

                //ESI-DEDCUTIONss
                let Esiper = pfvalues.esideduction === true ? Number(findEmployerESIPercentage) / 100 : 0;

                let ESI_deduction = grossValue >= findEsiMAXSalary || oldgross >= findEsiMAXSalary ? 0 : pfDaysVal > 0 && totalshiftCalcVal > 0 ? (finalNetSalaryValcCalc / totalshiftCalcVal) * pfDaysVal * Esiper : 0;
                // console.log(  ( Number(totalNoOfDaysCalcVal) , (Math.abs(Math.round(((finalBasicValCalc * totalNoOfDaysCalcVal) / actualBasicCalcVal) - (totalNoOfDaysCalcVal - pfDaysVal))))), "round1")
                let ncpDaysVal =
                  totalpaiddaycalVal > 0
                    ? // ( totalNoOfDaysCalcVal - ((((finalBasicValCalc * totalNoOfDaysCalcVal) / actualBasicCalcVal) - (totalNoOfDaysCalcVal - pfDaysVal)).toFixed(0)) )
                    Number(totalNoOfDaysCalcVal) - Math.abs(Math.round((finalBasicValCalc * totalNoOfDaysCalcVal) / actualBasicCalcVal - (totalNoOfDaysCalcVal - pfDaysVal)))
                    : 0;

                let finalLOPDaysCalcVal = Math.round(
                  Number(totalasbleaveCalcVal) + (Number(actualBasicCalcVal) === 0 ? 0 : Number(totalshiftCalcVal) - (Number(totalshiftCalcVal) * Number(finalBasicValCalc)) / Number(actualBasicCalcVal)) < Number(totalshiftCalcVal)
                    ? Number(totalasbleaveCalcVal) + (Number(actualBasicCalcVal) === 0 ? 0 : Number(totalshiftCalcVal) - (Number(totalshiftCalcVal) * Number(finalBasicValCalc)) / Number(actualBasicCalcVal))
                    : Number(totalshiftCalcVal)
                );

                // let findlopvaluecalc =    Number(totalasbleaveCalcVal) +
                // (
                //     (Number(actualBasicCalcVal) === 0 ? 0 : ( Number(totalshiftCalcVal) - ((Number(totalshiftCalcVal) * Number(finalBasicValCalc)) / Number(actualBasicCalcVal))   )    )
                //   )

                // let finalLOPDaysCalcVal = Number(findlopvaluecalc) <   Number(totalshiftCalcVal) ?  Number(findlopvaluecalc)  : Number(totalshiftCalcVal) ;

                let paySlipLopCalval = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 || Number(grossValue) === 0 ? 0 : totalshiftCalcVal - Math.round((totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue) < 0 ? 0 : totalshiftCalcVal - Math.round((totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue);

                let finalLeaveDeductionValCalc =
                  //  totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 ? 0 : (grossValue / totalshiftCalcVal) * ((totalshiftCalcVal - (totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue).toFixed(0) < 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue);
                  totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 || grossValue === 0 ? 0 : (grossValue / totalshiftCalcVal) * (totalshiftCalcVal - (totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue < 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue);

                let findprofTaxAmt = profTaxMaster.find((d) => d.company == item.company && d.branch === item.branch && Number(d.fromamount) <= finalNetSalaryValcCalc && Number(d.toamount) + 0.99 >= finalNetSalaryValcCalc);

                let profTaxCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.tax === false ? 0 : findprofTaxAmt ? Number(findprofTaxAmt.taxamount) : 0;

                let totalDeductionValCalc = Number(profTaxCalcVal) + Number(ESI_deduction) + Number(PF_deduction);

                let finalSalaryCalcVal = finalNetSalaryValcCalc - totalDeductionValCalc + nightAllowanceCalcVal > grossValue && AcheivedPercentCalcVal < 100 ? grossValue : finalNetSalaryValcCalc - totalDeductionValCalc + nightAllowanceCalcVal;
                let finalSalary_Penalty = finalSalaryCalcVal + penaltyAmtCalculationVal > 0 ? (finalSalaryCalcVal + penaltyAmtCalculationVal + lossDed + OtherDed > grossValue ? finalSalaryCalcVal : finalSalaryCalcVal + penaltyAmtCalculationVal + lossDed + OtherDed) : 0;
                let Mvalue = findAcPointVal ? Number(findAcPointVal.multiplevalue) : 0;
                let Dvalue = findAcPointVal ? Number(findAcPointVal.dividevalue) : 0;
                // let Dvalue = findAcPointVal ? Number(findAcPointVal.multiplevalue) : 0;
                // let Mvalue = findAcPointVal ? Number(findAcPointVal.dividevalue) : 0;
                let totalPointsValueCalc = (Number(AcheivedPointsCalcVal) / Dvalue) * Mvalue ? ((Number(AcheivedPointsCalcVal) / Dvalue) * Mvalue).toFixed(2) : Number(0).toFixed(2);

                let acutalERAValCalc = totalasbleaveCalcVal > 2 ? (ERAAmountCalcVal - (ERAAmountCalcVal / totalshiftCalcVal) * totalasbleaveCalcVal).toFixed(2) : Number(ERAAmountCalcVal);

                let pfAmount1 = findEmployerPercentage;

                let PF_Emper_deduction = pfAmount1 > 0 && totalshiftCalcVal > 0 ? (finalBasicValCalc / totalshiftCalcVal) * pfDaysVal * (pfAmount1 / 100) : 0;

                //ESI-DEDCUTION
                let ESI_EMPR_Perncetage = pfvalues.esideduction === true ? Number(findESIpercentage) / 100 : 0;

                let ESI_EMPR_deduction = grossValue >= findEsiMAXSalary || oldgross >= findEsiMAXSalary ? 0 : pfDaysVal > 0 && totalshiftCalcVal > 0 ? (finalNetSalaryValcCalc / totalshiftCalcVal) * pfDaysVal * ESI_EMPR_Perncetage : 0;

                let CTC_Calcval = Number(finalSalaryCalcVal) + Number(ESI_deduction) + Number(PF_deduction) + Number(ESI_EMPR_deduction) + Number(PF_Emper_deduction) + Number(profTaxCalcVal);

                let finalValueCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === true ? Number(totalPointsValueCalc) - (Number(acutalERAValCalc) + Number(CTC_Calcval)) + Number(revenueAmountCalc) : 0;

                let final_Value_PenaltyCalcval = finalValueCalcVal - (Number(penaltyAmtCalculationVal) + Number(lossDed) + Number(OtherDed));

                final_Value_PenaltyCalcval = final_Value_PenaltyCalcval > 0 ? (finalValueCalcVal >= grossValue ? finalValueCalcVal : final_Value_PenaltyCalcval) : 0;

                let ShortageCalVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.era === true ? findShortage && Number(findShortage.amount) : 0;
                let Shortage1ValCalc = ShortageCalVal > 0 ? (CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.era === true ? (Number(ShortageCalVal) * Number(totalpaiddaycalVal)) / Number(tond) : 0) : 0;

                let acutalDeductionCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true ? (Number(totalPointsValueCalc) + Number(revenueAmountCalc) - (Number(CTC_Calcval) + Number(Shortage1ValCalc)) >= 0 ? 0 : Number(totalPointsValueCalc) + Number(revenueAmountCalc) - (Number(CTC_Calcval) + Number(Shortage1ValCalc))) : 0;

                let minimumDeductionCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true ? (Number(Shortage1ValCalc) + Number(acutalDeductionCalcVal) >= 0 ? 0 : Number(Shortage1ValCalc) + Number(acutalDeductionCalcVal)) : 0;

                let LossDeduction = Number(minimumDeductionCalcVal) + (Number(acutalDeductionCalcVal) - Number(OtherDed) - Number(minimumDeductionCalcVal));

                lossDed = LossDeduction > 0 ? Number(LossDeduction) : Number(-1) * Number(LossDeduction);

                // -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

                // RCALCULATION AFTER FIND LOSS DEDUCTION

                if (calcNetSalaryValCalc > 0) {
                  finalBasicValCalc = prodBasicValCalc === 0 ? 0 : prodBasicValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodBasicValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;
                  finalHraValCalc = prodHraValCalc === 0 ? 0 : prodHraValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodHraValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;
                  finalConveyValCalc =
                    prodConveyanceValCalc === 0 ? 0 : prodConveyanceValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodConveyanceValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;

                  finalMedicalAllowValcCalc =
                    prodMEDAllowanceValCalc === 0 ? 0 : prodMEDAllowanceValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodMEDAllowanceValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;
                  finalOtherValcCalc = prodOtherValCalc === 0 ? 0 : prodOtherValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodOtherValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;
                  finalProductionValcCalc = prodPRODValCalc === 0 ? 0 : prodPRODValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodPRODValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;

                  finalNetSalaryValcCalc = finalBasicValCalc + finalHraValCalc + finalConveyValCalc + finalMedicalAllowValcCalc + finalProductionValcCalc + finalOtherValcCalc;
                }

                finalBasicValCalc = finalBasicValCalc > 0 ? finalBasicValCalc : 0;
                finalHraValCalc = finalHraValCalc > 0 ? finalHraValCalc : 0;
                finalConveyValCalc = finalConveyValCalc > 0 ? finalConveyValCalc : 0;

                finalMedicalAllowValcCalc = finalMedicalAllowValcCalc > 0 ? finalMedicalAllowValcCalc : 0;
                finalOtherValcCalc = finalOtherValcCalc > 0 ? finalOtherValcCalc : 0;
                finalProductionValcCalc = finalProductionValcCalc > 0 ? finalProductionValcCalc : 0;

                finalNetSalaryValcCalc = finalBasicValCalc + finalHraValCalc + finalConveyValCalc + finalMedicalAllowValcCalc + finalProductionValcCalc + finalOtherValcCalc;

                PF_deduction = pfDaysVal > 0 ? ((Number(finalBasicValCalc) / Number(totalshiftCalcVal)) * Number(pfDaysVal) * Number(pfAmount)).toFixed(2) : 0;

                ESI_deduction = grossValue >= findEsiMAXSalary || oldgross >= findEsiMAXSalary ? 0 : pfDaysVal > 0 && totalshiftCalcVal > 0 ? (finalNetSalaryValcCalc / totalshiftCalcVal) * pfDaysVal * Esiper : 0;

                let ncpvaluecalc = Number(totalNoOfDaysCalcVal) - Math.round((finalBasicValCalc * totalNoOfDaysCalcVal) / actualBasicCalcVal - (totalNoOfDaysCalcVal - pfDaysVal));
                let ncpvaluecalc1 = Number(totalNoOfDaysCalcVal) - Math.round((finalBasicValCalc * totalNoOfDaysCalcVal) / actualBasicCalcVal);

                ncpDaysVal =
                  totalpaiddaycalVal > 0
                    ? // ( totalNoOfDaysCalcVal - ((((finalBasicValCalc * totalNoOfDaysCalcVal) / actualBasicCalcVal) - (totalNoOfDaysCalcVal - pfDaysVal)).toFixed(0)) )
                    // totalNoOfDaysCalcVal - Math.round((finalBasicValCalc * totalNoOfDaysCalcVal) / actualBasicCalcVal - (totalNoOfDaysCalcVal - pfDaysVal))
                    pfvalues.pfdeduction === true
                      ? ncpvaluecalc
                      : ncpvaluecalc1
                    : 0;

                finalLOPDaysCalcVal = Math.round(
                  Number(totalasbleaveCalcVal) + (Number(actualBasicCalcVal) === 0 ? 0 : Number(totalshiftCalcVal) - (Number(totalshiftCalcVal) * Number(finalBasicValCalc)) / Number(actualBasicCalcVal)) < Number(totalshiftCalcVal)
                    ? Number(totalasbleaveCalcVal) + (Number(actualBasicCalcVal) === 0 ? 0 : Number(totalshiftCalcVal) - (Number(totalshiftCalcVal) * Number(finalBasicValCalc)) / Number(actualBasicCalcVal))
                    : Number(totalshiftCalcVal)
                );

                paySlipLopCalval = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 || Number(grossValue) === 0 ? 0 : totalshiftCalcVal - Math.round((totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue) < 0 ? 0 : totalshiftCalcVal - Math.round((totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue);

                finalLeaveDeductionValCalc = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 || grossValue === 0 ? 0 : (grossValue / totalshiftCalcVal) * (totalshiftCalcVal - (totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue < 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue);

                findprofTaxAmt = profTaxMaster.find((d) => d.company === item.company && d.branch === item.branch && Number(d.fromamount) <= finalNetSalaryValcCalc && Number(d.toamount) + 0.99 >= finalNetSalaryValcCalc);

                profTaxCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.tax === false ? 0 : findprofTaxAmt ? Number(findprofTaxAmt.taxamount) : 0;

                totalDeductionValCalc = Number(profTaxCalcVal) + Number(ESI_deduction) + Number(PF_deduction);
                nightAllowancefinalcalculation =
                  //  CHECKSHIFTALLOWANCE === "Enable" &&
                  noshiftlogvalfinal > 0 ? ((1000 / tond) * noshiftlogvalfinal * (allowancepointCalcVal > 0 ? (allowancepointCalcVal * 100) / shiftallowancetargetfinal : 0)) / 100 : 0;

                nightAllowanceCalcVal = item.nightshiftallowlog && item.nightshiftallowlog.length > 0 && nightShiftAllowlogLogVal && nightShiftAllowlogLogVal.length > 0 ? Number(nightShiftAllowlogLogVal[nightShiftAllowlogLogVal.length - 1].value) : nightAllowancefinalcalculation;

                finalSalaryCalcVal = finalNetSalaryValcCalc - totalDeductionValCalc + nightAllowanceCalcVal > grossValue && Number(AcheivedPercentCalcVal) < 100 ? grossValue : Number(finalNetSalaryValcCalc) - Number(totalDeductionValCalc) + Number(nightAllowanceCalcVal);
                finalSalary_Penalty = finalSalaryCalcVal + penaltyAmtCalculationVal > 0 ? (finalSalaryCalcVal + penaltyAmtCalculationVal + lossDed + OtherDed > grossValue ? finalSalaryCalcVal : finalSalaryCalcVal + penaltyAmtCalculationVal + lossDed + OtherDed) : 0;

                pfAmount1 = findEmployerPercentage;

                PF_Emper_deduction = pfAmount1 > 0 && totalshiftCalcVal > 0 ? (finalBasicValCalc / totalshiftCalcVal) * pfDaysVal * (pfAmount1 / 100) : 0;

                ESI_EMPR_deduction = grossValue >= findEsiMAXSalary || oldgross >= findEsiMAXSalary ? 0 : pfDaysVal > 0 && totalshiftCalcVal > 0 ? (finalNetSalaryValcCalc / totalshiftCalcVal) * pfDaysVal * ESI_EMPR_Perncetage : 0;

                CTC_Calcval = Number(finalSalaryCalcVal) + Number(ESI_deduction) + Number(PF_deduction) + Number(ESI_EMPR_deduction) + Number(PF_Emper_deduction) + Number(profTaxCalcVal);

                finalValueCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === true ? Number(totalPointsValueCalc) - (Number(acutalERAValCalc) + Number(CTC_Calcval)) + Number(revenueAmountCalc) : 0;

                final_Value_PenaltyCalcval = finalValueCalcVal - (Number(penaltyAmtCalculationVal) + Number(lossDed) + Number(OtherDed));

                final_Value_PenaltyCalcval = final_Value_PenaltyCalcval > 0 ? (finalValueCalcVal >= grossValue ? finalValueCalcVal : final_Value_PenaltyCalcval) : 0;

                let finalValueReviewCalc = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true ? (final_Value_PenaltyCalcval < -acutalERAValCalc ? "REVENUE LOSS" : "OK") : "";

                let finalValueStatus = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true ? (finalValueCalcVal > -10000 ? (finalValueCalcVal >= -2000 ? (finalValueCalcVal >= 0 ? (finalValueCalcVal >= 2000 ? (finalValueCalcVal >= 4000 ? "HIGH" : "OK") : "LOSS OK") : "LOSS") : "VERY LOSS") : "VERY VERY LOSS") : "";

                let revenuePenaltyStatus =
                  CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true
                    ? final_Value_PenaltyCalcval > -10000
                      ? final_Value_PenaltyCalcval >= -2000
                        ? final_Value_PenaltyCalcval >= 0
                          ? final_Value_PenaltyCalcval >= 2000
                            ? final_Value_PenaltyCalcval >= 4000
                              ? "HIGH"
                              : "OK"
                            : "LOSS OK"
                          : "LOSS"
                        : "VERY LOSS"
                      : "VERY VERY LOSS"
                    : "";

                //   FIXED CALCULATION START------------------
                //FIXED
                let Fixed_Loss_Deduction_Calcval = 0;

                let Fixed_NET_Salary = totalshiftCalcVal === 0 ? 0 : (grossValue / totalshiftCalcVal) * totalpaiddaycalVal;
                let Fixed_Basic_CalcVal =
                  totalshiftCalcVal === 0
                    ? 0
                    : (actualBasicCalcVal / totalshiftCalcVal) * totalpaiddaycalVal === 0
                      ? 0
                      : (actualBasicCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0
                        ? (actualBasicCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01
                        : 0;

                let Fixed_HRA_CalcVal =
                  totalshiftCalcVal === 0
                    ? 0
                    : (actualHraCalcVal / totalshiftCalcVal) * totalpaiddaycalVal === 0
                      ? 0
                      : (actualHraCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0
                        ? (actualHraCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01
                        : 0;
                // console.log(actualHraCalcVal, totalshiftCalcVal, totalpaiddaycalVal, Fixed_NET_Salary, Number(penaltyAmtCalculationVal), Fixed_Loss_Deduction_Calcval, OtherDed);

                let Fixed_Conveyance_CalcVal =
                  totalshiftCalcVal === 0
                    ? 0
                    : (actualConveyanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal === 0
                      ? 0
                      : (actualConveyanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0
                        ? (actualConveyanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01
                        : 0;

                let Fixed_Med_Allowace =
                  totalshiftCalcVal === 0
                    ? 0
                    : (actualMedicalAllowCalcVal / totalshiftCalcVal) * totalpaiddaycalVal === 0
                      ? 0
                      : (actualMedicalAllowCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0
                        ? (actualMedicalAllowCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01
                        : 0;

                let Fixed_PROD_Allowace =
                  totalshiftCalcVal === 0
                    ? 0
                    : (prodAllowanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal === 0
                      ? 0
                      : (prodAllowanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0
                        ? (prodAllowanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01
                        : 0;

                let Fixed_OTHER_Allowace =
                  totalshiftCalcVal === 0
                    ? 0
                    : (actualOtherCalVAL / totalshiftCalcVal) * totalpaiddaycalVal === 0
                      ? 0
                      : (actualOtherCalVAL / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0
                        ? (actualOtherCalVAL / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01
                        : 0;

                let Fixed_NET_Salary1 = Fixed_Basic_CalcVal + Fixed_HRA_CalcVal + Fixed_Conveyance_CalcVal + Fixed_Med_Allowace + Fixed_PROD_Allowace + Fixed_OTHER_Allowace;

                let Fixed_PF_deduction = pfDaysVal > 0 ? ((Number(Fixed_Basic_CalcVal) / Number(totalshiftCalcVal)) * Number(pfDaysVal) * Number(pfAmount)).toFixed(2) : 0;

                let Fixed_ESI_deduction = grossValue >= findEsiMAXSalary || oldgross >= findEsiMAXSalary ? 0 : pfDaysVal > 0 ? (Fixed_NET_Salary1 / totalshiftCalcVal) * pfDaysVal * Esiper : 0;

                let FixedfindprofTaxAmt = profTaxMaster.find((d) => d.company === item.company && d.branch === item.branch && Number(d.fromamount) <= Fixed_NET_Salary1 && Number(d.toamount) + 0.99 >= Fixed_NET_Salary1);

                let Fixed_TaxCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.tax === false ? 0 : FixedfindprofTaxAmt ? Number(FixedfindprofTaxAmt.taxamount) : 0;

                let FixedpfAmount1 = findEmployerPercentage / 100;

                let Fixed_PF_Emper_deduction = FixedpfAmount1 > 0 && totalshiftCalcVal > 0 ? (Fixed_Basic_CalcVal / totalshiftCalcVal) * pfDaysVal * FixedpfAmount1 : 0;

                let Fixed_ESI_EMPR_deduction = grossValue >= findEsiMAXSalary || oldgross >= findEsiMAXSalary ? 0 : pfDaysVal > 0 ? (Fixed_NET_Salary1 / totalshiftCalcVal) * pfDaysVal * ESI_EMPR_Perncetage : 0;

                let Fixed_Shift_Allowance = totalNoOfDaysCalcVal > 0 ? (1000 / tond) * noshiftlogvalfinal : 0;

                let Fixed_Total_Deductions = Number(Fixed_PF_deduction) + Number(Fixed_ESI_deduction) + Number(Fixed_TaxCalcVal) + Number(Fixed_PF_Emper_deduction) + Number(Fixed_ESI_EMPR_deduction);

                let Fixed_Salary = Fixed_NET_Salary1 - (Number(Fixed_PF_deduction) + Number(Fixed_ESI_deduction) + Number(Fixed_TaxCalcVal) + Number(Fixed_PF_Emper_deduction) + Number(Fixed_ESI_EMPR_deduction)) + Number(Fixed_Shift_Allowance);

                let Fixed_Salary_penalty = Fixed_Salary + Number(penaltyAmtCalculationVal) > 0 ? (Fixed_Salary >= grossValue ? Fixed_Salary : Fixed_Salary + (penaltyAmtCalculationVal + Fixed_Loss_Deduction_Calcval + OtherDed)) : 0;

                let Fixed_LOP1 = Fixed_Salary < grossValue ? (Fixed_Salary > 0 && grossValue > 0 ? totalshiftCalcVal - (Fixed_Salary * totalshiftCalcVal) / grossValue : totalshiftCalcVal) : 0;

                let Fixed_Lop_Days = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 || grossValue === 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * Fixed_NET_Salary1) / grossValue < 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * Fixed_NET_Salary1) / grossValue;

                let Fixed_Leave_Dedcution = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 || grossValue === 0 ? 0 : (grossValue / totalshiftCalcVal) * (totalshiftCalcVal - (totalshiftCalcVal * Fixed_NET_Salary1) / grossValue < 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * Fixed_NET_Salary1) / grossValue);

                let Fixed_CTC_Calcval = Fixed_Salary + Number(Fixed_PF_deduction) + Number(Fixed_ESI_deduction) + Number(Fixed_TaxCalcVal) + Number(Fixed_PF_Emper_deduction) + Number(Fixed_ESI_EMPR_deduction);
                let FIXED_Final_Value = Number(totalPointsValueCalc) - (Number(acutalERAValCalc) + Number(Fixed_CTC_Calcval)) + Number(revenueAmountCalc);

                let Fixed_Acutal_Deduction_Calc =
                  CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true ? (Number(totalPointsValueCalc) + Number(revenueAmountCalc) - (Number(Fixed_CTC_Calcval) + Number(Shortage1ValCalc)) < 0 ? Number(totalPointsValueCalc) + Number(revenueAmountCalc) - (Number(Fixed_CTC_Calcval) + Number(Shortage1ValCalc)) : 0) : 0;

                let Fixed_Min_Deduction = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true ? (Number(Shortage1ValCalc) + Number(Fixed_Acutal_Deduction_Calc) < 0 ? Number(Shortage1ValCalc) + Number(Fixed_Acutal_Deduction_Calc) : 0) : 0;

                let FLossDeduction = Fixed_Min_Deduction + (Fixed_Acutal_Deduction_Calc - OtherDed - Fixed_Min_Deduction);
                Fixed_Loss_Deduction_Calcval = FLossDeduction > 0 ? FLossDeduction : -1 * FLossDeduction;

                //RE CALCULATION STARTED

                Fixed_NET_Salary = totalshiftCalcVal === 0 ? 0 : (grossValue / totalshiftCalcVal) * totalpaiddaycalVal;
                Fixed_Basic_CalcVal =
                  totalshiftCalcVal === 0
                    ? 0
                    : (actualBasicCalcVal / totalshiftCalcVal) * totalpaiddaycalVal === 0
                      ? 0
                      : (actualBasicCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0
                        ? (actualBasicCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01
                        : 0;

                Fixed_HRA_CalcVal =
                  totalshiftCalcVal === 0
                    ? 0
                    : (actualHraCalcVal / totalshiftCalcVal) * totalpaiddaycalVal === 0
                      ? 0
                      : (actualHraCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0
                        ? (actualHraCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01
                        : 0;

                Fixed_Conveyance_CalcVal =
                  totalshiftCalcVal === 0
                    ? 0
                    : (actualConveyanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal === 0
                      ? 0
                      : (actualConveyanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0
                        ? (actualConveyanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01
                        : 0;

                Fixed_Med_Allowace =
                  totalshiftCalcVal === 0
                    ? 0
                    : (actualMedicalAllowCalcVal / totalshiftCalcVal) * totalpaiddaycalVal === 0
                      ? 0
                      : (actualMedicalAllowCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0
                        ? (actualMedicalAllowCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01
                        : 0;

                Fixed_PROD_Allowace =
                  totalshiftCalcVal === 0
                    ? 0
                    : (prodAllowanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal === 0
                      ? 0
                      : (prodAllowanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0
                        ? (prodAllowanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01
                        : 0;

                Fixed_OTHER_Allowace =
                  totalshiftCalcVal === 0
                    ? 0
                    : (actualOtherCalVAL / totalshiftCalcVal) * totalpaiddaycalVal === 0
                      ? 0
                      : (actualOtherCalVAL / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0
                        ? (actualOtherCalVAL / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01
                        : 0;

                Fixed_NET_Salary1 = Fixed_Basic_CalcVal + Fixed_HRA_CalcVal + Fixed_Conveyance_CalcVal + Fixed_Med_Allowace + Fixed_PROD_Allowace + Fixed_OTHER_Allowace;

                //PFDAYS AND PFDEDUCTION

                //   PfDate = daysp >= pfdatcal ? ((IsExDate == true && item.pfesienddate) < findDate ? "0" : Number(pfdatcal) + Number(totalasbleaveCalcVal)) : daysp + totalasbleaveCalcVal;

                Fixed_PF_deduction = pfDaysVal > 0 ? ((Number(Fixed_Basic_CalcVal) / Number(totalshiftCalcVal)) * Number(pfDaysVal) * Number(pfAmount)).toFixed(2) : 0;

                Fixed_ESI_deduction = grossValue >= findEsiMAXSalary || oldgross >= findEsiMAXSalary ? 0 : pfDaysVal > 0 ? (Fixed_NET_Salary1 / totalshiftCalcVal) * pfDaysVal * Esiper : 0;

                findprofTaxAmt = profTaxMaster.find((d) => d.company == item.company && d.branch === item.branch && Number(d.fromamount) <= Fixed_NET_Salary1 && Number(d.toamount) + 0.99 >= Fixed_NET_Salary1);

                Fixed_TaxCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.tax === false ? 0 : findprofTaxAmt ? Number(findprofTaxAmt.taxamount) : 0;

                Fixed_PF_Emper_deduction = FixedpfAmount1 > 0 && totalshiftCalcVal > 0 ? (Fixed_Basic_CalcVal / totalshiftCalcVal) * pfDaysVal * FixedpfAmount1 : 0;

                Fixed_ESI_EMPR_deduction = grossValue >= findEsiMAXSalary || oldgross >= findEsiMAXSalary ? 0 : pfDaysVal > 0 ? (Fixed_NET_Salary1 / totalshiftCalcVal) * pfDaysVal * ESI_EMPR_Perncetage : 0;

                Fixed_Total_Deductions = Number(Fixed_PF_deduction) + Number(Fixed_ESI_deduction) + Number(Fixed_TaxCalcVal) + Number(Fixed_PF_Emper_deduction) + Number(Fixed_ESI_EMPR_deduction);

                Fixed_Salary = Fixed_NET_Salary1 - (Number(Fixed_PF_deduction) + Number(Fixed_ESI_deduction) + Number(Fixed_TaxCalcVal) + Number(Fixed_PF_Emper_deduction) + Number(Fixed_ESI_EMPR_deduction)) + Number(Fixed_Shift_Allowance);

                Fixed_Salary_penalty = Fixed_Salary + Number(penaltyAmtCalculationVal) > 0 ? (Fixed_Salary >= grossValue ? Fixed_Salary : Fixed_Salary + (penaltyAmtCalculationVal + Fixed_Loss_Deduction_Calcval + OtherDed)) : 0;

                Fixed_LOP1 = Fixed_Salary < grossValue ? (Fixed_Salary > 0 && grossValue > 0 ? totalshiftCalcVal - (Fixed_Salary * totalshiftCalcVal) / grossValue : totalshiftCalcVal) : 0;

                Fixed_Lop_Days = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 || grossValue === 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * Fixed_NET_Salary1) / grossValue < 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * Fixed_NET_Salary1) / grossValue;

                Fixed_Leave_Dedcution = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 ? 0 : (grossValue / totalshiftCalcVal) * (totalshiftCalcVal - (totalshiftCalcVal * Fixed_NET_Salary1) / grossValue < 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * Fixed_NET_Salary1) / grossValue);
                totalPointsValueCalc = AcheivedPointsCalcVal ? ((Number(AcheivedPointsCalcVal) / Dvalue) * Mvalue ? (Number(AcheivedPointsCalcVal) / Dvalue) * Mvalue : 0) : 0;

                acutalERAValCalc = totalasbleaveCalcVal > 2 ? (ERAAmountCalcVal - (ERAAmountCalcVal / totalshiftCalcVal) * totalasbleaveCalcVal).toFixed(2) : Number(ERAAmountCalcVal);

                Fixed_CTC_Calcval = Fixed_Salary + Number(Fixed_PF_deduction) + Number(Fixed_ESI_deduction) + Number(Fixed_TaxCalcVal) + Number(Fixed_PF_Emper_deduction) + Number(Fixed_ESI_EMPR_deduction);
                FIXED_Final_Value = Number(totalPointsValueCalc) - (Number(acutalERAValCalc) + Number(Fixed_CTC_Calcval)) + Number(revenueAmountCalc);

                //PRODUCTION
                let PROD_Loss_Deduction = 0;

                let PROD_NET_Salary = AcheivedPercentCalcVal > 0 && grossValue > 0 ? grossValue * (Number(AcheivedPercentCalcVal) / 100) : 0;
                let PROD_BASIC_ValCalc =
                  (actualBasicCalcVal * AcheivedPercentCalcVal) / 100 === 0
                    ? 0
                    : ((actualBasicCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
                      ? ((actualBasicCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
                      : 0;

                let PROD_HRA_ValCalc =
                  (actualHraCalcVal * AcheivedPercentCalcVal) / 100 === 0
                    ? 0
                    : ((actualHraCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
                      ? ((actualHraCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
                      : 0;

                let PROD_CONVEYANCE_ValCalc =
                  (actualConveyanceCalcVal * AcheivedPercentCalcVal) / 100 === 0
                    ? 0
                    : ((actualConveyanceCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
                      ? ((actualConveyanceCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
                      : 0;
                let PROD_MEDICALALLOW_ValCalc =
                  (actualMedicalAllowCalcVal * AcheivedPercentCalcVal) / 100 === 0
                    ? 0
                    : ((actualMedicalAllowCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
                      ? ((actualMedicalAllowCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
                      : 0;
                let PROD_PRODUCTION_ValCalc =
                  (prodAllowanceCalcVal * AcheivedPercentCalcVal) / 100 === 0
                    ? 0
                    : ((prodAllowanceCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
                      ? ((prodAllowanceCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
                      : 0;
                let PROD_OTHER_ValCalc =
                  (actualOtherCalVAL * AcheivedPercentCalcVal) / 100 === 0
                    ? 0
                    : ((actualOtherCalVAL * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
                      ? ((actualOtherCalVAL * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
                      : 0;

                let PROD_NET_Salary1 = PROD_BASIC_ValCalc + PROD_HRA_ValCalc + PROD_CONVEYANCE_ValCalc + PROD_MEDICALALLOW_ValCalc + PROD_PRODUCTION_ValCalc + PROD_OTHER_ValCalc;

                //PFDAYS AND PFDEDUCTION

                let PROD_PF_deduction = pfDaysVal > 0 ? ((Number(PROD_BASIC_ValCalc) / Number(totalshiftCalcVal)) * Number(pfDaysVal) * Number(pfAmount)).toFixed(2) : 0;

                let PROD_ESI_deduction = grossValue >= findEsiMAXSalary || oldgross >= findEsiMAXSalary ? 0 : pfDaysVal > 0 ? (PROD_NET_Salary1 / totalshiftCalcVal) * pfDaysVal * Esiper : 0;

                let PRODfindprofTaxAmt = profTaxMaster.find((d) => d.company === item.company && d.branch === item.branch && Number(d.fromamount) <= PROD_NET_Salary1 && Number(d.toamount) + 0.99 >= PROD_NET_Salary1);

                let PROD_TaxCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.tax === false ? 0 : PRODfindprofTaxAmt ? Number(PRODfindprofTaxAmt.taxamount) : 0;

                let PRODpfAmount1 = findEmployerPercentage / 100;

                let PROD_PF_Emper_deduction = PRODpfAmount1 > 0 && totalshiftCalcVal > 0 ? (PROD_BASIC_ValCalc / totalshiftCalcVal) * pfDaysVal * PRODpfAmount1 : 0;
                //ESI-DEDCUTION

                let PROD_ESI_EMPR_deduction = grossValue >= findEsiMAXSalary || oldgross >= findEsiMAXSalary ? 0 : pfDaysVal > 0 ? (PROD_NET_Salary1 / totalshiftCalcVal) * pfDaysVal * ESI_EMPR_Perncetage : 0;

                let PROD_Total_deductions = Number(PROD_PF_deduction) + Number(PROD_ESI_deduction) + Number(PROD_TaxCalcVal) + Number(PROD_PF_Emper_deduction) + Number(PROD_ESI_EMPR_deduction);

                let PROD_Shift_Allowance = totalNoOfDaysCalcVal > 0 && shiftallowancetargetfinal > 0 ? ((1000 / tond) * noshiftlogvalfinal * (allowancepointCalcVal > 0 ? (allowancepointCalcVal * 100) / shiftallowancetargetfinal : 0)) / 100 : 0;

                let PROD_SALARY_Calcval = PROD_NET_Salary1 - PROD_Total_deductions + PROD_Shift_Allowance;

                let PROD_SALARY_PENALTY_Calcval = PROD_SALARY_Calcval + penaltyAmtCalculationVal > 0 ? (PROD_SALARY_Calcval >= grossValue ? PROD_SALARY_Calcval : PROD_SALARY_Calcval + penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed) : 0;

                let PROD_LOP_days = PROD_SALARY_Calcval < grossValue ? (PROD_SALARY_Calcval > 0 && grossValue > 0 ? Math.round(totalshiftCalcVal - (PROD_SALARY_Calcval * totalshiftCalcVal) / grossValue) : totalshiftCalcVal) : 0;

                let PROD_LOP_calcval = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 || grossValue === 0 ? 0 : Math.round(totalshiftCalcVal - (totalshiftCalcVal * PROD_NET_Salary1) / grossValue) < 0 ? 0 : Math.round(totalshiftCalcVal - (totalshiftCalcVal * PROD_NET_Salary1) / grossValue);

                let PROD_Leave_Deduction = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 || grossValue === 0 ? 0 : (grossValue / totalshiftCalcVal) * (totalshiftCalcVal - (totalshiftCalcVal * PROD_NET_Salary1) / grossValue < 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * PROD_NET_Salary1) / grossValue);

                let PROD_CTC_Valcalc = PROD_SALARY_Calcval + Number(PROD_PF_deduction) + Number(PROD_ESI_deduction) + Number(PROD_TaxCalcVal) + Number(PROD_PF_Emper_deduction) + Number(PROD_ESI_EMPR_deduction);

                let PROD_Final_Value_Calc = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === false ? 0 : Number(totalPointsValueCalc) - (Number(acutalERAValCalc) + Number(PROD_CTC_Valcalc)) + Number(revenueAmountCalc);

                let PROD_Actual_Deduction_Val = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true ? (totalPointsValueCalc + revenueAmountCalc - (PROD_CTC_Valcalc + Shortage1ValCalc) < 0 ? totalPointsValueCalc + revenueAmountCalc - (PROD_CTC_Valcalc + Shortage1ValCalc) : 0) : 0;

                let PROD_Minimum_Deduction_Val = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true ? (Number(Shortage1ValCalc) + PROD_Actual_Deduction_Val < 0 ? Number(Shortage1ValCalc) + PROD_Actual_Deduction_Val : 0) : 0;

                PROD_Loss_Deduction = 0;

                let PLossDeduction = PROD_Minimum_Deduction_Val + (PROD_Actual_Deduction_Val - OtherDed - PROD_Minimum_Deduction_Val);

                PROD_Loss_Deduction = PLossDeduction > 0 ? PLossDeduction : -1 * PLossDeduction;

                //RE-CALULCATION
                PROD_BASIC_ValCalc =
                  (actualBasicCalcVal * AcheivedPercentCalcVal) / 100 === 0
                    ? 0
                    : ((actualBasicCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
                      ? ((actualBasicCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
                      : 0;

                PROD_HRA_ValCalc =
                  (actualHraCalcVal * AcheivedPercentCalcVal) / 100 === 0
                    ? 0
                    : ((actualHraCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
                      ? ((actualHraCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
                      : 0;

                PROD_CONVEYANCE_ValCalc =
                  (actualConveyanceCalcVal * AcheivedPercentCalcVal) / 100 === 0
                    ? 0
                    : ((actualConveyanceCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
                      ? ((actualConveyanceCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
                      : 0;
                PROD_MEDICALALLOW_ValCalc =
                  (actualMedicalAllowCalcVal * AcheivedPercentCalcVal) / 100 === 0
                    ? 0
                    : ((actualMedicalAllowCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
                      ? ((actualMedicalAllowCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
                      : 0;
                PROD_PRODUCTION_ValCalc =
                  (prodAllowanceCalcVal * AcheivedPercentCalcVal) / 100 === 0
                    ? 0
                    : ((prodAllowanceCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
                      ? ((prodAllowanceCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
                      : 0;
                PROD_OTHER_ValCalc =
                  (actualOtherCalVAL * AcheivedPercentCalcVal) / 100 === 0
                    ? 0
                    : ((actualOtherCalVAL * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
                      ? ((actualOtherCalVAL * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
                      : 0;

                PROD_NET_Salary1 = PROD_BASIC_ValCalc + PROD_HRA_ValCalc + PROD_CONVEYANCE_ValCalc + PROD_MEDICALALLOW_ValCalc + PROD_PRODUCTION_ValCalc + PROD_OTHER_ValCalc;

                PROD_PF_deduction = pfDaysVal > 0 && totalshiftCalcVal > 0 ? ((Number(PROD_BASIC_ValCalc) / Number(totalshiftCalcVal)) * Number(pfDaysVal) * Number(pfAmount)).toFixed(2) : 0;

                PROD_ESI_deduction = grossValue >= findEsiMAXSalary || oldgross >= findEsiMAXSalary ? 0 : pfDaysVal > 0 && totalshiftCalcVal > 0 ? (PROD_NET_Salary1 / totalshiftCalcVal) * pfDaysVal * Esiper : 0;

                PRODfindprofTaxAmt = profTaxMaster.find((d) => d.company === item.company && d.branch === item.branch && Number(d.fromamount) <= PROD_NET_Salary1 && Number(d.toamount) + 0.99 >= PROD_NET_Salary1);

                PROD_TaxCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.tax === false ? 0 : PRODfindprofTaxAmt ? Number(PRODfindprofTaxAmt.taxamount) : 0;

                PROD_PF_Emper_deduction = PRODpfAmount1 > 0 && totalshiftCalcVal > 0 ? (PROD_BASIC_ValCalc / totalshiftCalcVal) * pfDaysVal * PRODpfAmount1 : 0;

                PROD_ESI_EMPR_deduction = grossValue >= findEsiMAXSalary || oldgross >= findEsiMAXSalary ? 0 : pfDaysVal > 0 && totalshiftCalcVal > 0 ? (PROD_NET_Salary1 / totalshiftCalcVal) * pfDaysVal * ESI_EMPR_Perncetage : 0;

                PROD_Total_deductions = Number(PROD_PF_deduction) + Number(PROD_ESI_deduction) + Number(PROD_TaxCalcVal) + Number(PROD_PF_Emper_deduction) + Number(PROD_ESI_EMPR_deduction);

                PROD_Shift_Allowance = totalNoOfDaysCalcVal > 0 && shiftallowancetargetfinal > 0 ? ((1000 / tond) * noshiftlogvalfinal * (allowancepointCalcVal > 0 ? (allowancepointCalcVal * 100) / shiftallowancetargetfinal : 0)) / 100 : 0;

                PROD_SALARY_Calcval = PROD_NET_Salary1 - PROD_Total_deductions + PROD_Shift_Allowance;

                PROD_SALARY_PENALTY_Calcval = PROD_SALARY_Calcval + penaltyAmtCalculationVal > 0 ? (PROD_SALARY_Calcval >= grossValue ? PROD_SALARY_Calcval : PROD_SALARY_Calcval + penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed) : 0;

                PROD_LOP_days = PROD_SALARY_Calcval < grossValue ? (PROD_SALARY_Calcval > 0 && grossValue > 0 ? Math.round(totalshiftCalcVal - (PROD_SALARY_Calcval * totalshiftCalcVal) / grossValue) : totalshiftCalcVal) : 0;

                PROD_LOP_calcval = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 || grossValue === 0 ? 0 : Math.round(totalshiftCalcVal - (totalshiftCalcVal * PROD_NET_Salary1) / grossValue) < 0 ? 0 : Math.round(totalshiftCalcVal - (totalshiftCalcVal * PROD_NET_Salary1) / grossValue);

                PROD_Leave_Deduction = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 || grossValue === 0 ? 0 : (grossValue / totalshiftCalcVal) * (totalshiftCalcVal - (totalshiftCalcVal * PROD_NET_Salary1) / grossValue < 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * PROD_NET_Salary1) / grossValue);

                PROD_CTC_Valcalc = PROD_SALARY_Calcval + Number(PROD_PF_deduction) + Number(PROD_ESI_deduction) + Number(PROD_TaxCalcVal) + Number(PROD_PF_Emper_deduction) + Number(PROD_ESI_EMPR_deduction);

                PROD_Final_Value_Calc = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === false ? 0 : Number(totalPointsValueCalc) - (Number(acutalERAValCalc) + Number(PROD_CTC_Valcalc)) + Number(revenueAmountCalc);

                ////daystatus---------------------------------------------------------------------------------------------------------
                let currentMonthAttendanceVal = findTotalNoOfDaysNxtMonth ? Number(findTotalNoOfDaysNxtMonth.lopcount) : 0;
                let currentMonthAvgVal = findPointsDetailsNxtMonth ? Number(findPointsDetailsNxtMonth.avgpoint).toFixed(2) : 0;

                let currMonAvgFinalcalVal = item.currmonthavglog && item.currmonthavglog.length > 0 && currMonAvgLogVal && currMonAvgLogVal.length > 0 ? Number(currMonAvgLogVal[currMonAvgLogVal.length - 1].value) : currentMonthAvgVal;

                let currMonAttFinalcalVal = item.currmonthattlog && item.currmonthattlog.length > 0 && currMonAttLogVal && currMonAttLogVal.length > 0 ? Number(currMonAttLogVal[currMonAttLogVal.length - 1].value) : currentMonthAttendanceVal;

                // let getpaidStatusVal = paidStsFixData
                //     .filter(
                //       (da) =>
                //         da.month.toLowerCase() === data.selectedmonth.toLowerCase() &&
                //         da.department.includes(item.department) &&
                //         da.year == data.selectedyear &&
                //         Number(da.fromvalue) <= Number(totalasbleaveCalcVal) &&
                //         Number(da.tovalue) >= Number(totalasbleaveCalcVal) &&
                //         Number(da.frompoint) <= Number(AcheivedPercentCalcVal) &&
                //         Number(da.topoint) >= Number(AcheivedPercentCalcVal)
                //     )
                //     .sort((a, b) => {
                //       // Sort by frequency order if needed (custom order)
                //       const frequencyOrder = ['FIRST', 'SECOND', 'THIRD', 'LAST', 'HOLD', 'REJECT', 'ADVANCE1', 'ADVANCE2', 'MISSING'];
                //       let freqA = frequencyOrder.indexOf(a.frequency);
                //       let freqB = frequencyOrder.indexOf(b.frequency);

                //       if (freqA !== freqB) return freqA - freqB;

                //       // Sort by currentabsentvalue (ascending)
                //       let absentDiff = Number(a.currentabsentvalue) - Number(b.currentabsentvalue);
                //       if (absentDiff !== 0) return absentDiff;

                //       // Sort by currentachievedvalue (descending)
                //       return Number(b.currentachievedvalue) - Number(a.currentachievedvalue);
                //     })
                //     .find(
                //       (d) =>
                //         (d.currentabsentmodes === 'Less than or Equal'
                //           ? currMonAttFinalcalVal <= Number(d.currentabsentvalue)
                //           : d.currentabsentmodes === 'Less than'
                //           ? currMonAttFinalcalVal < Number(d.currentabsentvalue)
                //           : d.currentabsentmodes === 'Greater than'
                //           ? currMonAttFinalcalVal > Number(d.currentabsentvalue)
                //           : currMonAttFinalcalVal >= Number(d.currentabsentvalue)) &&
                //         (d.currentachievedmodes === 'Less than or Equal'
                //           ? currMonAvgFinalcalVal <= Number(d.currentachievedvalue)
                //           : d.currentachievedmodes === 'Less than'
                //           ? currMonAvgFinalcalVal < Number(d.currentachievedvalue)
                //           : d.currentachievedmodes === 'Greater than'
                //           ? currMonAvgFinalcalVal > Number(d.currentachievedvalue)
                //           : currMonAvgFinalcalVal >= Number(d.currentachievedvalue))
                //     );
                let getpaidStatusVal = "";

                const ctodate = new Date(findmonthenddate).toISOString();
                const CLOP = Number(currMonAttFinalcalVal); // Current Leave or Points
                const CTotalPointsAverage = Number(currMonAvgFinalcalVal);
                paidStsFixData
                  .filter(
                    (da) =>
                      da.month.toLowerCase() === data.selectedmonth.toLowerCase() &&
                      da.department.includes(item.department) &&
                      da.year == data.selectedyear &&
                      Number(da.fromvalue) <= Number(totalasbleaveCalcVal) &&
                      Number(da.tovalue) >= Number(totalasbleaveCalcVal) &&
                      Number(da.frompoint) <= Number(AcheivedPercentCalcVal) &&
                      Number(da.topoint) >= Number(AcheivedPercentCalcVal)
                  )
                  .sort((a, b) => {
                    if (a.currentabsentvalue !== b.currentabsentvalue) {
                      return b.currentabsentvalue - a.currentabsentvalue; // Sort descending
                    }
                    return b.currentachievedvalue - a.currentachievedvalue; // Sort descending
                  })
                  .forEach((row) => {
                    let F1 = false,
                      F2 = false,
                      F3 = false,
                      F4 = false;

                    // Check AbsentMode
                    const totalLeave = totalasbleaveCalcVal;
                    const absentValue = parseFloat(row.fromvalue);

                    switch (row.absentmodes) {
                      case "Less than or Equal":
                        F1 = totalLeave <= absentValue;
                        break;
                      case "Less than":
                        F1 = totalLeave < absentValue;
                        break;
                      case "Greater than":
                        F1 = totalLeave > absentValue;
                        break;
                      case "Greater than or Equal":
                        F1 = totalLeave >= absentValue;
                        break;
                      case "Between":
                        F1 = totalLeave >= absentValue && totalLeave <= parseFloat(row.tovalue);
                        break;
                      default:
                        F1 = false;
                    }

                    // Check AchievedMode
                    const achievedPerc = AcheivedPercentCalcVal;
                    const achievedValue = parseFloat(row.frompoint);

                    switch (row.achievedmodes) {
                      case "Less than or Equal":
                        F2 = achievedPerc <= achievedValue;
                        break;
                      case "Less than":
                        F2 = achievedPerc < achievedValue;
                        break;
                      case "Greater than":
                        F2 = achievedPerc > achievedValue;
                        break;
                      case "Greater than or Equal":
                        F2 = achievedPerc >= achievedValue;
                        break;
                      case "Between":
                        F2 = achievedPerc >= achievedValue && achievedPerc <= parseFloat(row.topoint);
                        break;
                      default:
                        F2 = false;
                    }

                    // Date comparison
                    const now = new Date();
                    const fiveDaysAgo = new Date(now);
                    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

                    if (new Date(ctodate) > fiveDaysAgo) {
                      F3 = true;
                      F4 = true;
                    } else {
                      // Current Absent Mode
                      const currentAbsentValue = parseFloat(row.currentabsentvalue);
                      switch (row.currentabsentmodes) {
                        case "Less than or Equal":
                          F3 = CLOP <= currentAbsentValue;
                          break;
                        case "Less than":
                          F3 = CLOP < currentAbsentValue;
                          break;
                        case "Greater than":
                          F3 = CLOP > currentAbsentValue;
                          break;
                        case "Greater than or Equal":
                          F3 = CLOP >= currentAbsentValue;
                          break;

                        default:
                          F3 = false;
                      }

                      // Current Achieved Mode
                      const currentAchievedValue = parseFloat(row.currentachievedvalue);
                      switch (row.currentachievedmodes) {
                        case "Less than or Equal":
                          F4 = CTotalPointsAverage <= currentAchievedValue;
                          break;
                        case "Less than":
                          F4 = CTotalPointsAverage < currentAchievedValue;
                          break;
                        case "Greater than":
                          F4 = CTotalPointsAverage > currentAchievedValue;
                          break;
                        case "Greater than or Equal":
                          F4 = CTotalPointsAverage >= currentAchievedValue;
                          break;
                        default:
                          F4 = false;
                      }
                    }

                    // Final check
                    if (F1 && F2 && F3 && F4) {
                      getpaidStatusVal = row.paidstatus;

                      // if (row.Frequency === 'HOLD' || row.Frequency === 'REJECT') {
                      //   empObj.HoldPersentage = 0;
                      //   empObj.ApReason = 'Reject Auto Hold Full';
                      // } else {
                      //   empObj.HoldPersentage = 0;
                      //   empObj.ApReason = '';
                      // }
                    }
                  });
                // console.log(getpaidStatusVal, 'getpaidStatusVal');
                // Set paidStatusVal if a matching row is found
                let paidStatusVal = getpaidStatusVal === "" ? "No Status" : getpaidStatusVal;

                let getPayTypes = payruncontrolmaster.find((d) => {
                  return d.filtertype === "Individual" && d.empname.includes(item.companyname)
                    ? d.choosetype === false && d.choosestatus === "Both"
                      ? (d.achievedsymbol === "Between"
                        ? Number(AcheivedPercentCalcVal) >= Number(d.achievedfrom) && Number(AcheivedPercentCalcVal) <= Number(d.achievedto)
                        : d.achievedsymbol === "Less than or equal"
                          ? Number(AcheivedPercentCalcVal) <= Number(d.achieved)
                          : d.achievedsymbol === "Less than"
                            ? Number(AcheivedPercentCalcVal) < Number(d.achieved)
                            : d.achievedsymbol === "Greater than"
                              ? Number(AcheivedPercentCalcVal) > Number(d.achieved)
                              : Number(AcheivedPercentCalcVal) >= Number(d.achieved)) &&
                      (d.newgrosssymbol === "Between"
                        ? Number(grossValue) >= Number(d.newgrossfrom) && Number(grossValue) <= Number(d.newgrossto)
                        : d.newgrosssymbol === "Less than or equal"
                          ? Number(grossValue) <= Number(d.newgross)
                          : d.newgrosssymbol === "Less than"
                            ? Number(grossValue) < Number(d.newgross)
                            : d.newgrosssymbol === "Greater than"
                              ? Number(grossValue) > Number(d.newgross)
                              : Number(grossValue) >= Number(d.newgross))
                      : d.choosetype === false && d.choosestatus === "Production"
                        ? d.achievedsymbol === "Between"
                          ? Number(AcheivedPercentCalcVal) >= Number(d.achievedfrom) && Number(AcheivedPercentCalcVal) <= Number(d.achievedto)
                          : d.achievedsymbol === "Less than or equal"
                            ? Number(AcheivedPercentCalcVal) <= Number(d.achieved)
                            : d.achievedsymbol === "Less than"
                              ? Number(AcheivedPercentCalcVal) < Number(d.achieved)
                              : d.achievedsymbol === "Greater than"
                                ? Number(AcheivedPercentCalcVal) > Number(d.achieved)
                                : Number(AcheivedPercentCalcVal) >= Number(d.achieved)
                        : d.choosetype === false && d.choosestatus === "New Gross"
                          ? d.newgrosssymbol === "Between"
                            ? Number(grossValue) >= Number(d.newgrossfrom) && Number(grossValue) <= Number(d.newgrossto)
                            : d.newgrosssymbol === "Less than or equal"
                              ? Number(grossValue) <= Number(d.newgross)
                              : d.newgrosssymbol === "Less than"
                                ? Number(grossValue) < Number(d.newgross)
                                : d.newgrosssymbol === "Greater than"
                                  ? Number(grossValue) > Number(d.newgross)
                                  : Number(grossValue) >= Number(d.newgross)
                          : d.choosetype === true
                    : d.filtertype === "Team" && d.branch.includes(item.branch) && d.unit.includes(item.unit) && d.team.includes(item.team)
                      ? d.choosetype === false && d.choosestatus === "Both"
                        ? (d.achievedsymbol === "Between"
                          ? Number(AcheivedPercentCalcVal) >= Number(d.achievedfrom) && Number(AcheivedPercentCalcVal) <= Number(d.achievedto)
                          : d.achievedsymbol === "Less than or equal"
                            ? Number(AcheivedPercentCalcVal) <= Number(d.achieved)
                            : d.achievedsymbol === "Less than"
                              ? Number(AcheivedPercentCalcVal) < Number(d.achieved)
                              : d.achievedsymbol === "Greater than"
                                ? Number(AcheivedPercentCalcVal) > Number(d.achieved)
                                : Number(AcheivedPercentCalcVal) >= Number(d.achieved)) &&
                        (d.newgrosssymbol === "Between"
                          ? Number(grossValue) >= Number(d.newgrossfrom) && Number(grossValue) <= Number(d.newgrossto)
                          : d.newgrosssymbol === "Less than or equal"
                            ? Number(grossValue) <= Number(d.newgross)
                            : d.newgrosssymbol === "Less than"
                              ? Number(grossValue) < Number(d.newgross)
                              : d.newgrosssymbol === "Greater than"
                                ? Number(grossValue) > Number(d.newgross)
                                : Number(grossValue) >= Number(d.newgross))
                        : d.choosetype === false && d.choosestatus === "Production"
                          ? d.achievedsymbol === "Between"
                            ? Number(AcheivedPercentCalcVal) >= Number(d.achievedfrom) && Number(AcheivedPercentCalcVal) <= Number(d.achievedto)
                            : d.achievedsymbol === "Less than or equal"
                              ? Number(AcheivedPercentCalcVal) <= Number(d.achieved)
                              : d.achievedsymbol === "Less than"
                                ? Number(AcheivedPercentCalcVal) < Number(d.achieved)
                                : d.achievedsymbol === "Greater than"
                                  ? Number(AcheivedPercentCalcVal) > Number(d.achieved)
                                  : Number(AcheivedPercentCalcVal) >= Number(d.achieved)
                          : d.choosetype === false && d.choosestatus === "New Gross"
                            ? d.newgrosssymbol === "Between"
                              ? Number(grossValue) >= Number(d.newgrossfrom) && Number(grossValue) <= Number(d.newgrossto)
                              : d.newgrosssymbol === "Less than or equal"
                                ? Number(grossValue) <= Number(d.newgross)
                                : d.newgrosssymbol === "Less than"
                                  ? Number(grossValue) < Number(d.newgross)
                                  : d.newgrosssymbol === "Greater than"
                                    ? Number(grossValue) > Number(d.newgross)
                                    : Number(grossValue) >= Number(d.newgross)
                            : true
                      : d.filtertype === "Unit" && d.branch.includes(item.branch) && d.unit.includes(item.unit)
                        ? d.choosetype === false && d.choosestatus === "Both"
                          ? (d.achievedsymbol === "Between"
                            ? Number(AcheivedPercentCalcVal) >= Number(d.achievedfrom) && Number(AcheivedPercentCalcVal) <= Number(d.achievedto)
                            : d.achievedsymbol === "Less than or equal"
                              ? Number(AcheivedPercentCalcVal) <= Number(d.achieved)
                              : d.achievedsymbol === "Less than"
                                ? Number(AcheivedPercentCalcVal) < Number(d.achieved)
                                : d.achievedsymbol === "Greater than"
                                  ? Number(AcheivedPercentCalcVal) > Number(d.achieved)
                                  : Number(AcheivedPercentCalcVal) >= Number(d.achieved)) &&
                          (d.newgrosssymbol === "Between"
                            ? Number(grossValue) >= Number(d.newgrossfrom) && Number(grossValue) <= Number(d.newgrossto)
                            : d.newgrosssymbol === "Less than or equal"
                              ? Number(grossValue) <= Number(d.newgross)
                              : d.newgrosssymbol === "Less than"
                                ? Number(grossValue) < Number(d.newgross)
                                : d.newgrosssymbol === "Greater than"
                                  ? Number(grossValue) > Number(d.newgross)
                                  : Number(grossValue) >= Number(d.newgross))
                          : d.choosetype === false && d.choosestatus === "Production"
                            ? d.achievedsymbol === "Between"
                              ? Number(AcheivedPercentCalcVal) >= Number(d.achievedfrom) && Number(AcheivedPercentCalcVal) <= Number(d.achievedto)
                              : d.achievedsymbol === "Less than or equal"
                                ? Number(AcheivedPercentCalcVal) <= Number(d.achieved)
                                : d.achievedsymbol === "Less than"
                                  ? Number(AcheivedPercentCalcVal) < Number(d.achieved)
                                  : d.achievedsymbol === "Greater than"
                                    ? Number(AcheivedPercentCalcVal) > Number(d.achieved)
                                    : Number(AcheivedPercentCalcVal) >= Number(d.achieved)
                            : d.choosetype === false && d.choosestatus === "New Gross"
                              ? d.newgrosssymbol === "Between"
                                ? Number(grossValue) >= Number(d.newgrossfrom) && Number(grossValue) <= Number(d.newgrossto)
                                : d.newgrosssymbol === "Less than or equal"
                                  ? Number(grossValue) <= Number(d.newgross)
                                  : d.newgrosssymbol === "Less than"
                                    ? Number(grossValue) < Number(d.newgross)
                                    : d.newgrosssymbol === "Greater than"
                                      ? Number(grossValue) > Number(d.newgross)
                                      : Number(grossValue) >= Number(d.newgross)
                              : true
                        : d.filtertype === "Branch" && d.branch.includes(item.branch)
                          ? d.choosetype === false && d.choosestatus === "Both"
                            ? (d.achievedsymbol === "Between"
                              ? Number(AcheivedPercentCalcVal) >= Number(d.achievedfrom) && Number(AcheivedPercentCalcVal) <= Number(d.achievedto)
                              : d.achievedsymbol === "Less than or equal"
                                ? Number(AcheivedPercentCalcVal) <= Number(d.achieved)
                                : d.achievedsymbol === "Less than"
                                  ? Number(AcheivedPercentCalcVal) < Number(d.achieved)
                                  : d.achievedsymbol === "Greater than"
                                    ? Number(AcheivedPercentCalcVal) > Number(d.achieved)
                                    : Number(AcheivedPercentCalcVal) >= Number(d.achieved)) &&
                            (d.newgrosssymbol === "Between"
                              ? Number(grossValue) >= Number(d.newgrossfrom) && Number(grossValue) <= Number(d.newgrossto)
                              : d.newgrosssymbol === "Less than or equal"
                                ? Number(grossValue) <= Number(d.newgross)
                                : d.newgrosssymbol === "Less than"
                                  ? Number(grossValue) < Number(d.newgross)
                                  : d.newgrosssymbol === "Greater than"
                                    ? Number(grossValue) > Number(d.newgross)
                                    : Number(grossValue) >= Number(d.newgross))
                            : d.choosetype === false && d.choosestatus === "Production"
                              ? d.achievedsymbol === "Between"
                                ? Number(AcheivedPercentCalcVal) >= Number(d.achievedfrom) && Number(AcheivedPercentCalcVal) <= Number(d.achievedto)
                                : d.achievedsymbol === "Less than or equal"
                                  ? Number(AcheivedPercentCalcVal) <= Number(d.achieved)
                                  : d.achievedsymbol === "Less than"
                                    ? Number(AcheivedPercentCalcVal) < Number(d.achieved)
                                    : d.achievedsymbol === "Greater than"
                                      ? Number(AcheivedPercentCalcVal) > Number(d.achieved)
                                      : Number(AcheivedPercentCalcVal) >= Number(d.achieved)
                              : d.choosetype === false && d.choosestatus === "New Gross"
                                ? d.newgrosssymbol === "Between"
                                  ? Number(grossValue) >= Number(d.newgrossfrom) && Number(grossValue) <= Number(d.newgrossto)
                                  : d.newgrosssymbol === "Less than or equal"
                                    ? Number(grossValue) <= Number(d.newgross)
                                    : d.newgrosssymbol === "Less than"
                                      ? Number(grossValue) < Number(d.newgross)
                                      : d.newgrosssymbol === "Greater than"
                                        ? Number(grossValue) > Number(d.newgross)
                                        : Number(grossValue) >= Number(d.newgross)
                                : true
                          : d.filtertype === "Department" && d.department.includes(item.department)
                            ? d.choosetype === false && d.choosestatus === "Both"
                              ? (d.achievedsymbol === "Between"
                                ? Number(AcheivedPercentCalcVal) >= Number(d.achievedfrom) && Number(AcheivedPercentCalcVal) <= Number(d.achievedto)
                                : d.achievedsymbol === "Less than or equal"
                                  ? Number(AcheivedPercentCalcVal) <= Number(d.achieved)
                                  : d.achievedsymbol === "Less than"
                                    ? Number(AcheivedPercentCalcVal) < Number(d.achieved)
                                    : d.achievedsymbol === "Greater than"
                                      ? Number(AcheivedPercentCalcVal) > Number(d.achieved)
                                      : Number(AcheivedPercentCalcVal) >= Number(d.achieved)) &&
                              (d.newgrosssymbol === "Between"
                                ? Number(grossValue) >= Number(d.newgrossfrom) && Number(grossValue) <= Number(d.newgrossto)
                                : d.newgrosssymbol === "Less than or equal"
                                  ? Number(grossValue) <= Number(d.newgross)
                                  : d.newgrosssymbol === "Less than"
                                    ? Number(grossValue) < Number(d.newgross)
                                    : d.newgrosssymbol === "Greater than"
                                      ? Number(grossValue) > Number(d.newgross)
                                      : Number(grossValue) >= Number(d.newgross))
                              : d.choosetype === false && d.choosestatus === "Production"
                                ? d.achievedsymbol === "Between"
                                  ? Number(AcheivedPercentCalcVal) >= Number(d.achievedfrom) && Number(AcheivedPercentCalcVal) <= Number(d.achievedto)
                                  : d.achievedsymbol === "Less than or equal"
                                    ? Number(AcheivedPercentCalcVal) <= Number(d.achieved)
                                    : d.achievedsymbol === "Less than"
                                      ? Number(AcheivedPercentCalcVal) < Number(d.achieved)
                                      : d.achievedsymbol === "Greater than"
                                        ? Number(AcheivedPercentCalcVal) > Number(d.achieved)
                                        : Number(AcheivedPercentCalcVal) >= Number(d.achieved)
                                : d.choosetype === false && d.choosestatus === "New Gross"
                                  ? d.newgrosssymbol === "Between"
                                    ? Number(grossValue) >= Number(d.newgrossfrom) && Number(grossValue) <= Number(d.newgrossto)
                                    : d.newgrosssymbol === "Less than or equal"
                                      ? Number(grossValue) <= Number(d.newgross)
                                      : d.newgrosssymbol === "Less than"
                                        ? Number(grossValue) < Number(d.newgross)
                                        : d.newgrosssymbol === "Greater than"
                                          ? Number(grossValue) > Number(d.newgross)
                                          : Number(grossValue) >= Number(d.newgross)
                                  : true
                            : false;
                });

                let salaryTypeVal = getPayTypes ? getPayTypes.salraytype : "Final Salary";
                let deductionTypeVal = getPayTypes ? getPayTypes.deductiontype : "Acutal Deduction";
                ////daystatus---------------------------------------------------------------------------------------------------------

                let lowestValueSal, highestValueSal;

                if (finalSalaryCalcVal < Fixed_Salary && finalSalaryCalcVal < PROD_SALARY_Calcval) {
                  lowestValueSal = "Final Salary";
                } else if (Fixed_Salary < finalSalaryCalcVal && Fixed_Salary < PROD_SALARY_Calcval) {
                  lowestValueSal = "Fixed Salary";
                } else {
                  lowestValueSal = "Production Salary";
                }

                if (finalSalaryCalcVal > Fixed_Salary && finalSalaryCalcVal > PROD_SALARY_Calcval) {
                  highestValueSal = "Final Salary";
                } else if (Fixed_Salary > finalSalaryCalcVal && Fixed_Salary > PROD_SALARY_Calcval) {
                  highestValueSal = "Fixed Salary";
                } else {
                  highestValueSal = "Production Salary";
                }

                let findSalaryTypeValue = salaryTypeVal === "Whichever is Lower" ? lowestValueSal : salaryTypeVal === "Whichever is Higher" ? highestValueSal : salaryTypeVal;

                let lowestValueDed, highestValueDed;
                //salary type is final salary
                if (deductionTypeVal === "Whichever is Lower" && findSalaryTypeValue === "Final Salary") {
                  if (acutalDeductionCalcVal < finalValueCalcVal && acutalDeductionCalcVal < final_Value_PenaltyCalcval && acutalDeductionCalcVal < minimumDeductionCalcVal) {
                    lowestValueDed = "Acutal Deduction";
                  } else if (finalValueCalcVal < final_Value_PenaltyCalcval && finalValueCalcVal < minimumDeductionCalcVal) {
                    lowestValueDed = "On Value";
                  } else if (final_Value_PenaltyCalcval < minimumDeductionCalcVal) {
                    lowestValueDed = "On Penalty";
                  } else {
                    lowestValueDed = "Minimum Deduction";
                  }
                }
                if (deductionTypeVal === "Whichever is Higher" && findSalaryTypeValue === "Final Salary") {
                  if (acutalDeductionCalcVal > finalValueCalcVal && acutalDeductionCalcVal > final_Value_PenaltyCalcval && acutalDeductionCalcVal > minimumDeductionCalcVal) {
                    highestValueDed = "Acutal Deduction";
                  } else if (finalValueCalcVal > final_Value_PenaltyCalcval && finalValueCalcVal > minimumDeductionCalcVal) {
                    highestValueDed = "On Value";
                  } else if (final_Value_PenaltyCalcval > minimumDeductionCalcVal) {
                    highestValueDed = "On Penalty";
                  } else {
                    highestValueDed = "Minimum Deduction";
                  }
                }
                //salary type is fixed salary
                if (deductionTypeVal === "Whichever is Lower" && findSalaryTypeValue === "Fixed Salary") {
                  if (Fixed_Acutal_Deduction_Calc < FIXED_Final_Value && Fixed_Acutal_Deduction_Calc < Fixed_Min_Deduction) {
                    lowestValueDed = "Acutal Deduction";
                  } else if (FIXED_Final_Value < Fixed_Min_Deduction) {
                    lowestValueDed = "On Value";
                  } else {
                    lowestValueDed = "Minimum Deduction";
                  }
                }
                if (deductionTypeVal === "Whichever is Higher" && findSalaryTypeValue === "Fixed Salary") {
                  if (Fixed_Acutal_Deduction_Calc > FIXED_Final_Value && Fixed_Acutal_Deduction_Calc > Fixed_Min_Deduction) {
                    lowestValueDed = "Acutal Deduction";
                  } else if (FIXED_Final_Value > Fixed_Min_Deduction) {
                    lowestValueDed = "On Value";
                  } else {
                    lowestValueDed = "Minimum Deduction";
                  }
                }
                //salary type is PROD salary
                if (deductionTypeVal === "Whichever is Lower" && findSalaryTypeValue === "Production Salary") {
                  if (PROD_Actual_Deduction_Val < PROD_Final_Value_Calc && PROD_Actual_Deduction_Val < PROD_Minimum_Deduction_Val) {
                    lowestValueDed = "Acutal Deduction";
                  } else if (PROD_Final_Value_Calc < PROD_Minimum_Deduction_Val) {
                    lowestValueDed = "On Value";
                  } else {
                    lowestValueDed = "Minimum Deduction";
                  }
                }
                if (deductionTypeVal === "Whichever is Higher" && findSalaryTypeValue === "Production Salary") {
                  if (PROD_Actual_Deduction_Val > PROD_Final_Value_Calc && PROD_Actual_Deduction_Val > PROD_Minimum_Deduction_Val) {
                    lowestValueDed = "Acutal Deduction";
                  } else if (PROD_Final_Value_Calc > PROD_Minimum_Deduction_Val) {
                    lowestValueDed = "On Value";
                  } else {
                    lowestValueDed = "Minimum Deduction";
                  }
                }

                let findDeductionTypeVal = deductionTypeVal === "Whichever is Lower" ? lowestValueDed : deductionTypeVal === "Whichever is Higher" ? highestValueDed : deductionTypeVal;

                let findSalaryTypeValuefinal = findSalaryTypeValue ? findSalaryTypeValue : "Final Salary";

                let findChangeStatus = "";
                let findSalaryAmount = "";

                findSalaryAmount = oldData.salarytype === "Final Salary" ? oldData.finalsalary : oldData.salarytype === "Fixed Salary" ? oldData.fixedsalary : oldData.prodsalary;

                findChangeStatus =
                  findSalaryTypeValuefinal === "Final Salary"
                    ? Math.abs(Number(findSalaryAmount) - Number(finalSalaryCalcVal)) >= attCtrlCriteria
                      ? "+/- Amount differ"
                      : Math.abs(Number(findSalaryAmount) - Number(finalSalaryCalcVal)) < attCtrlCriteria && Math.abs(Number(findSalaryAmount) - Number(finalSalaryCalcVal)) >= 1
                        ? "Success"
                        : "No change in Data"
                    : findSalaryTypeValuefinal === "Fixed Salary"
                      ? Math.abs(Number(findSalaryAmount) - Number(Fixed_Salary)) >= attCtrlCriteria
                        ? "+/- Amount differ"
                        : Math.abs(Number(findSalaryAmount) - Number(Fixed_Salary)) < attCtrlCriteria && Math.abs(Number(findSalaryAmount) - Number(Fixed_Salary)) >= 1
                          ? "Success"
                          : "No change in Data"
                      : Math.abs(Number(findSalaryAmount) - Number(PROD_SALARY_Calcval)) >= attCtrlCriteria
                        ? "+/- Amount differ"
                        : Math.abs(Number(findSalaryAmount) - Number(PROD_SALARY_Calcval)) < attCtrlCriteria && Math.abs(Number(findSalaryAmount) - Number(PROD_SALARY_Calcval)) >= 1
                          ? "Success"
                          : "No change in Data";

                let findalarydataNOW = findSalaryTypeValuefinal === "Final Salary" ? Number(finalSalaryCalcVal) : findSalaryTypeValuefinal === "Fixed Salary" ? Number(Fixed_Salary) : Number(PROD_SALARY_Calcval);

                let checkSalaryExcess = Number(findSalaryAmount) - Number(Number(findalarydataNOW).toFixed(2)) < 0;

                // console.log(checkSalaryExcess, Number(findSalaryAmount), Number(Number(findalarydataNOW).toFixed(2)), item.companyname, 'checkSalaryExcess');

                return {
                  ...data,

                  serialNumber: index + 1,
                  company: item.company,
                  branch: item.branch,
                  unit: item.unit,
                  team: item.team,
                  empcode: item.empcode,
                  companyname: item.companyname,
                  doj: item.doj ? moment(item.doj)?.format("DD-MM-YYYY") : "",
                  experience: item.doj ? (calculateMonthsBetweenDates(item.doj, findDate) < 0 ? 0 : calculateMonthsBetweenDates(item.doj, findDate)) : "",
                  //ASSIGN EXP LOG DETAILS
                  endtar: modevalue ? modevalue.endtar : "",
                  endtardate: modevalue && modevalue.endtardate ? moment(modevalue.endtardate)?.format("DD-MM-YYYY") : "",
                  endexp: modevalue ? modevalue.endexp : "",
                  endexpdate: modevalue && modevalue.endexpdate ? moment(modevalue.endexpdate)?.format("DD-MM-YYYY") : "",

                  assignExpMode: modevalue ? modevalue.expmode : "",
                  modevalue: modevalue ? modevalue.expval : "",

                  targetexp: item.doj ? (differenceInMonthstar > 0 ? differenceInMonthstar : 0) : "",
                  prodexp: item.doj ? (differenceInMonthsexp > 0 ? differenceInMonthsexp : 0) : "",
                  modeexp: item.doj ? (differenceInMonths > 0 ? differenceInMonths : 0) : "",

                  processcode: item.doj && modevalue && modevalue.expmode === "Manual" ? modevalue.salarycode : item.doj ? getprocessCode : "",
                  salexp: item.doj ? (differenceInMonthsexp > 0 ? (differenceInMonthsexp <= 9 ? `0${differenceInMonthsexp}` : differenceInMonthsexp) : "00") : "",
                  processcodeexp: processcodeexpvaluesalary,

                  // gross: grossValue,

                  //SALRY SLAB FILTER PAGE
                  basic: actualBasicCalcVal,
                  hra: actualHraCalcVal,
                  conveyance: actualConveyanceCalcVal,
                  medicalallowance: actualMedicalAllowCalcVal,
                  productionallowance: prodAllowanceCalcVal,
                  productionallowancetwo: prodAllowancetwoCalcVal,
                  otherallowance: actualOtherCalVAL,

                  oldgross: oldgross,
                  oldbasic: oldactualBasicCalcVal,
                  oldhra: oldactualHraCalcVal,
                  oldconveyance: oldactualConveyanceCalcVal,
                  oldmedicalallowance: oldactualMedicalAllowCalcVal,
                  oldproductionallowance: oldprodAllowanceCalcVal,
                  oldproductionallowancetwo: oldprodAllowancetwoCalcVal,
                  oldotherallowance: oldactualOtherCalVAL,
                  gross: grossValue,

                  //REVENUE ALLOWANCE MASTER PAGE
                  revenueallow: findRevenueAllow ? findRevenueAllow.amount : 0,
                  //SHORTAGE MASTER PAGE
                  shortage: findShortage ? findShortage.amount : 0,

                  //ATTENDANCE MONTH STATUS
                  totalnumberofdays: findTotalNoOfDays ? Number(findTotalNoOfDays.totalcounttillcurrendate) : 0,
                  // totalshift: findTotalNoOfDays && Number(findTotalNoOfDays && findTotalNoOfDays.paidpresentday) - Number(findTotalNoOfDays && findTotalNoOfDays.weekoff),
                  totalshift: totalshiftCalcVal,
                  clsl: findTotalNoOfDays ? findTotalNoOfDays.clsl : 0,
                  weekoffcount: findTotalNoOfDays ? findTotalNoOfDays.weekoff : 0,
                  holiday: findTotalNoOfDays ? findTotalNoOfDays.holiday : 0,
                  totalasbleave: totalasbleaveCalcVal,
                  totalpaidDays: totalpaiddaycalVal,

                  //old value and log
                  totalpaiddaycalVal1: paiddayscalcvalfrommonthstatus,
                  totalabsentcalVal1: findTotalNoOfDays ? findTotalNoOfDays.lopcount : 0,
                  penaltyCalVal1: findPenaltyDetails ? findPenaltyDetails.amount.toFixed(2) : Number(0).toFixed(2),
                  targetpointCalVal1: findPointsDetails ? findPointsDetails.target : 0,
                  acheivedpointCalVal1: findPointsDetails ? findPointsDetails.point.toFixed(2) : Number(0).toFixed(2),
                  shiftallowanceCalVal1: findPointsDetails ? findPointsDetails.allowancepoint.toFixed(2) : Number(0).toFixed(2),
                  // paidpresentday: Number(findTotalNoOfDays && findTotalNoOfDays.paidpresentday) - Number(findTotalNoOfDays && findTotalNoOfDays.weekoff),

                  //LIST PRODUCTION POINTS
                  monthPoint: targetPointCalcVaue,

                  acheivedpoints: AcheivedPointsCalcVal,
                  editedacheivedpoints: AcheivedPointsCalcVal,
                  iseditedacheivedpoints: data.iseditedacheivedpoints,
                  acheivedpercent: AcheivedPercentCalcVal,

                  //DAY POINTS UPLOAD SHIFTALOWANCE AMOUNT
                  allowancepoint: allowancepointCalcVal,
                  noallowancepoint: noshiftlogvalfinal,

                  //ERA MASTER PAGE
                  eramount: ERAAmountCalcVal,
                  //PENALTY MASTER PAGE
                  penalty: penaltyCalcVal ? penaltyCalcVal : 0,
                  penaltyamount: penaltyAmtCalculationVal ? penaltyAmtCalculationVal.toFixed(2) : 0,
                  editedpenaltyamount: penaltyAmtCalculationVal ? penaltyAmtCalculationVal.toFixed(2) : 0,
                  iseditedpenaltyamount: data.iseditedpenaltyamount,

                  //USER INOIVIDUAL VALUE
                  ipname: item.ipname,
                  insurancenumber: item.insurancenumber,
                  pfmembername: item.pfmembername,
                  uan: item.uan,

                  currentmonthavg: Number(currMonAvgFinalcalVal),
                  currentmonthavgCalVal1: findPointsDetailsNxtMonth ? Number(findPointsDetailsNxtMonth.avgpoint).toFixed(2) : 0,

                  // currentmonthattendance: currMonAttFinalcalVal,
                  currentmonthattCalVal1: currentMonthAttendanceVal,

                  // paidstatus: paidStatusVal,

                  noshiftlog: item.noshiftlog,
                  noshiftlogCalVal1: findPointsDetails ? findPointsDetails.noallowancepoint : 0,

                  shiftallowancetarget: shiftallowancetargetfinal,
                  nightshiftallowance: Number(nightAllowanceCalcVal.toFixed(2)),

                  nightshiftallowlog: item.nightshiftallowlog,
                  nightshiftallowlogCalVal1: nightAllowancefinalcalculation,

                  shiftallowtargetlog: item.shiftallowtargetlog,
                  shiftallowtargetlogCalVal1: shiftallowancetarget,
                  from: findDate,
                  to: findmonthenddate,

                  ///FINALFIXPRODSALARY STARTED
                  acheivedproductionallowance: Number(acheivedProductionAllowanceValCal).toFixed(2),
                  attendancelop: Number(attendanceLopCalVal).toFixed(2),
                  actualnetsalary: (actualBasicCalcVal + actualHraCalcVal + actualConveyanceCalcVal + actualMedicalAllowCalcVal + actualOtherCalVAL - Number(attendanceLopCalVal) + Number(acheivedProductionAllowanceValCal)).toFixed(2),
                  lopbasic: Number(lopBasicValCal).toFixed(2),
                  lophra: Number(lopHRAValCal).toFixed(2),
                  lopconveyance: Number(lopConveyValCal).toFixed(2),
                  lopmedicalallowance: Number(lopMedicalValCal).toFixed(2),
                  lopotherallowance: Number(lopOtherValCal).toFixed(2),
                  lopproductionallowance: lopProductionAllowance.toFixed(2),
                  lopnetsalary: Number(lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopProductionAllowance + lopOtherValCal).toFixed(2),
                  prodbasic: Number(prodBasicValCalc).toFixed(2),
                  prodhra: Number(prodHraValCalc).toFixed(2),
                  prodconveyance: Number(prodConveyanceValCalc).toFixed(2),
                  prodmedicalallowance: Number(prodMEDAllowanceValCalc).toFixed(2),
                  prodotherallowance: Number(prodOtherValCalc).toFixed(2),
                  prodproductionallowance: Number(prodPRODValCalc).toFixed(2),
                  calculatednetsalary: Number(calcNetSalaryValCalc).toFixed(2),
                  lossdeduction: Number(lossDed).toFixed(2),
                  otherdeduction: Number(OtherDed).toFixed(2),
                  finalbasic: Number(finalBasicValCalc).toFixed(2),
                  finalhra: Number(finalHraValCalc).toFixed(2),
                  finalconveyance: Number(finalConveyValCalc).toFixed(2),
                  finalmedicalallowance: Number(finalMedicalAllowValcCalc).toFixed(2),
                  finalproductionallowance: Number(finalProductionValcCalc).toFixed(2),
                  finalotherallowance: Number(finalOtherValcCalc).toFixed(2),
                  finalnetsalary: Number(finalNetSalaryValcCalc).toFixed(2),
                  pfdays: pfDaysVal,
                  ncpdays: ncpDaysVal,
                  pfdeduction: Number(PF_deduction).toFixed(2),
                  esideduction: Number(ESI_deduction).toFixed(2),
                  finallopdays: finalLOPDaysCalcVal,
                  paysliplop: Number(paySlipLopCalval).toFixed(0),
                  finalleavededuction: Number(finalLeaveDeductionValCalc).toFixed(2),
                  professionaltax: profTaxCalcVal,
                  totaldeductions: Number(totalDeductionValCalc).toFixed(2),
                  shiftallowancetarget: shiftallowancetargetfinal,
                  nightshiftallowance: Number(Number(nightAllowanceCalcVal).toFixed(2)),
                  finalsalary: Number(finalSalaryCalcVal).toFixed(2),
                  finalsalarypenalty: Number(finalSalary_Penalty).toFixed(2),
                  totalpointsvalue: Number(totalPointsValueCalc).toFixed(2),
                  era: Number(acutalERAValCalc).toFixed(2),
                  pfemployerdeduction: Number(PF_Emper_deduction).toFixed(2),
                  esiemployerdeduction: Number(ESI_EMPR_deduction).toFixed(2),
                  ctc: Number(CTC_Calcval).toFixed(2),
                  // finalvaluetwo:Number(finalValueCalcVal).toFixed(2),
                  finalvalue: Number(finalValueCalcVal).toFixed(2),
                  finalvaluepenalty: Number(final_Value_PenaltyCalcval).toFixed(2),
                  shortageone: Number(Shortage1ValCalc).toFixed(2),
                  actualdeduction: Number(acutalDeductionCalcVal).toFixed(2),
                  minimumdeduction: Number(minimumDeductionCalcVal).toFixed(2),
                  finalvaluereview: finalValueReviewCalc,
                  finalvaluestatus: finalValueStatus,
                  finalvaluepenaltystatus: revenuePenaltyStatus,

                  //FIXED
                  fixedlossdeduction: Number(Fixed_Loss_Deduction_Calcval).toFixed(2),
                  fixednetsalary: Number(Fixed_NET_Salary).toFixed(2),
                  fixedbasic: Number(Fixed_Basic_CalcVal).toFixed(2),
                  fixedhra: Number(Fixed_HRA_CalcVal).toFixed(2),
                  fixedconveyance: Number(Fixed_Conveyance_CalcVal).toFixed(2),
                  fixedmedicalallowance: Number(Fixed_Med_Allowace).toFixed(2),
                  fixedproductionallowance: Number(Fixed_PROD_Allowace).toFixed(2),
                  fixedotherallowance: Number(Fixed_OTHER_Allowace).toFixed(2),
                  fixednetsalaryone: Number(Fixed_NET_Salary1).toFixed(2),
                  fixedemppf: Number(Fixed_PF_deduction).toFixed(2),
                  fixedempesi: Number(Fixed_ESI_deduction).toFixed(2),
                  fixedempptax: Number(Fixed_TaxCalcVal).toFixed(2),
                  fixedemprpf: Number(Fixed_PF_Emper_deduction).toFixed(2),
                  fixedempresi: Number(Fixed_ESI_EMPR_deduction).toFixed(2),
                  fixedshiftallowance: Number(Fixed_Shift_Allowance).toFixed(2),
                  fixedtotaldeductions: Number(Fixed_Total_Deductions).toFixed(2),
                  fixedsalary: Number(Fixed_Salary).toFixed(2),
                  fixedsalarypenalty: Number(Fixed_Salary_penalty).toFixed(2),
                  fixedlop: Number(Fixed_LOP1).toFixed(0),
                  fixedlopdays: Number(Fixed_Lop_Days).toFixed(0),
                  fixedctc: Number(Fixed_CTC_Calcval).toFixed(2),
                  fixedfinalvalue: Number(FIXED_Final_Value).toFixed(2),
                  fixedleavededuction: Number(Fixed_Leave_Dedcution).toFixed(2),
                  fixedactualdeduction: Number(Fixed_Acutal_Deduction_Calc).toFixed(2),
                  fixedminimumdeduction: Number(Fixed_Min_Deduction).toFixed(2),

                  // production
                  prodlossdeduction: Number(PROD_Loss_Deduction).toFixed(2),
                  prodnetsalary: Number(PROD_NET_Salary).toFixed(2),
                  prodbasicp: Number(PROD_BASIC_ValCalc).toFixed(2),
                  prodhrap: Number(PROD_HRA_ValCalc).toFixed(2),
                  prodconveyancep: Number(PROD_CONVEYANCE_ValCalc).toFixed(2),
                  prodmedicalallowancep: Number(PROD_MEDICALALLOW_ValCalc).toFixed(2),
                  prodproductionallowancep: Number(PROD_PRODUCTION_ValCalc).toFixed(2),
                  prodotherallowancep: Number(PROD_OTHER_ValCalc).toFixed(2),
                  prodnetsalaryonep: Number(PROD_NET_Salary1).toFixed(2),
                  prodemppf: Number(PROD_PF_deduction).toFixed(2),
                  prodempesi: Number(PROD_ESI_deduction).toFixed(2),
                  prodempptax: Number(PROD_TaxCalcVal).toFixed(2),
                  prodemprpf: Number(PROD_PF_Emper_deduction).toFixed(2),
                  prodempresi: Number(PROD_ESI_EMPR_deduction).toFixed(2),
                  prodtotaldeductions: Number(PROD_Total_deductions).toFixed(2),
                  prodshiftallowance: Number(PROD_Shift_Allowance).toFixed(2),
                  prodsalary: Number(PROD_SALARY_Calcval).toFixed(2),
                  prodsalarypenalty: Number(PROD_SALARY_PENALTY_Calcval).toFixed(2),
                  prodlopdays: Number(PROD_LOP_days).toFixed(2),
                  prodlop: Number(PROD_LOP_calcval).toFixed(2),
                  prodleavededuction: Number(PROD_Leave_Deduction).toFixed(2),
                  prodctc: Number(PROD_CTC_Valcalc).toFixed(2),
                  prodfinalvalue: Number(PROD_Final_Value_Calc).toFixed(2),
                  prodactualdeduction: Number(PROD_Actual_Deduction_Val).toFixed(2),
                  prodminimumdeduction: Number(PROD_Minimum_Deduction_Val).toFixed(2),

                  currentmonthavg: Number(currMonAvgFinalcalVal),
                  currentmonthattendance: currMonAttFinalcalVal,

                  paidstatus: paidStatusVal,
                  salarytype: findSalaryTypeValue ? findSalaryTypeValue : "",
                  deductiontype: findDeductionTypeVal ? findDeductionTypeVal : "",

                  bankname: bankDetails ? bankDetails.bankname : "",
                  accountholdername: bankDetails ? bankDetails.accountholdername : "",
                  accountnumber: bankDetails ? bankDetails.accountnumber : "",
                  ifsccode: bankDetails ? bankDetails.ifsccode : "",
                  changestatus: findChangeStatus,
                  isvaluechanges: findChangeStatus,
                  checkSalaryExcess: checkSalaryExcess,
                };
              });

              const results = await Promise.all(itemsWithSerialNumber);

              // console.log(results, oldData, "results");
              let finalDataOnlyAboveHundred = results.map((item) => {
                // const oldItem = oldData.find(oldItem => oldItem.companyname === item.companyname && oldItem.empcode === item.empcode);
                let findIsBankStatusClosed = oldData.logdata.some((item) => item.bankclose == "closed");
                let findIsBankStatusCreated = oldData.logdata.some((item) => item.bankreleasestatus == "created");

                // Check if the item's changestatus is "Amount Differ"
                // if (item.changestatus != "+/- Amount differ") {
                //   return oldData ? { ...oldData, changestatus: item.changestatus, isvaluechanges: item.changestatus } : item;
                // } else
                if (item.changestatus == "+/- Amount differ" && findIsBankStatusClosed && item.checkSalaryExcess) {
                  let findHoldReleaseData = oldData?.logdata.some((data) => data.status == "holdrelease" && data.holdsalaryconfirm != "Yes") ? oldData?.logdata.find((data) => data.status == "holdrelease" && data.holdsalaryconfirm != "Yes")._id : "";
                  // console.log(findHoldReleaseData, oldData, 'findHoldReleaseData');
                  let logdatas = [];
                  if (findHoldReleaseData != "") {
                    logdatas = oldData.logdata.map((d) => {
                      if (d._id == findHoldReleaseData) {
                        return {
                          companyname: item.companyname,
                          branch: item.branch,
                          unit: item.unit,
                          team: item.team,
                          empcode: item.empcode,
                          department: item.department,
                          legalname: item.legalname,
                          designation: item.designation,
                          totalnumberofdays: item.totalnumberofdays,
                          totalshift: item.totalshift,

                          totalasbleave: item.totalasbleave,
                          totalpaidDays: item.totalpaidDays,
                          targetpoints: item.targetpoints,
                          clsl: item.clsl,
                          acheivedpoints: item.acheivedpoints,
                          acheivedpercent: item.acheivedpercent,
                          currentmonthavg: item.currentmonthavg,
                          currentmonthattendance: item.currentmonthattendance,

                          bankname: item.bankname,
                          accountholdername: item.accountholdername,
                          ifsccode: item.ifsccode,
                          penaltyamount: item.penaltyamount,
                          releaseamount: item.releaseamount,
                          otherdeductionamount: item.otherdeductionamount,
                          totalexcess: item.totalexcess,
                          totaladvance: item.totaladvance,
                          payamount: item.payamount,
                          balanceamount: item.balanceamount,
                          paidstatus: item.paidstatus,
                          approvedby: item.approvedby,
                          description: item.description,
                          recheckreason: item.recheckreason,
                          updatedpaidstatus: item.updatedpaidstatus,
                          updatechangedate: item.updatechangedate,
                          payonsalarytype: item.payonsalarytype,

                          finalusersalary: item.salarytype == "Final Salary" ? item.finalsalary : item.salarytype === "Fixed Salary" ? item.fixedsalary : item.prodsalary,

                          holdsalaryconfirm: "No",
                          status: d.status,
                          innerId: d.innerId,

                          acheivedpoints: item.acheivedpoints,
                          acheivedpercent: item.acheivedpercent,
                          outerId: d.outerId,
                          payyear: d.payyear,
                          paymonth: d.paymonth,
                          paydate: d.paydate,
                          statuspage: d.statuspage,
                        };
                      } else {
                        return d;
                      }
                    });
                  } else {
                    logdatas = [
                      {
                        status: "holdrelease",
                        statuspage: "fixsalary",
                        companyname: item.companyname,
                        innerId: oldData._id,
                        outerId: oldData.outerId,
                        company: item.company,
                        branch: item.branch,
                        unit: item.unit,
                        team: item.team,
                        empcode: item.empcode,
                        department: item.department,
                        legalname: item.legalname,
                        designation: item.designation,
                        totalnumberofdays: item.totalnumberofdays,
                        totalshift: item.totalshift,

                        totalasbleave: item.totalasbleave,
                        totalpaidDays: item.totalpaidDays,
                        targetpoints: item.targetpoints,
                        clsl: item.clsl,
                        acheivedpoints: item.acheivedpoints,
                        acheivedpercent: item.acheivedpercent,
                        currentmonthavg: item.currentmonthavg,
                        currentmonthattendance: item.currentmonthattendance,

                        bankname: item.bankname,
                        accountholdername: item.accountholdername,
                        ifsccode: item.ifsccode,
                        penaltyamount: item.penaltyamount,
                        releaseamount: item.releaseamount,
                        otherdeductionamount: item.otherdeductionamount,
                        totalexcess: item.totalexcess,
                        totaladvance: item.totaladvance,
                        payamount: item.payamount,
                        balanceamount: item.balanceamount,
                        paidstatus: item.paidstatus,
                        approvedby: item.approvedby,
                        description: item.description,
                        recheckreason: item.recheckreason,
                        updatedpaidstatus: item.updatedpaidstatus,
                        updatechangedate: item.updatechangedate,
                        payonsalarytype: item.payonsalarytype,

                        finalusersalary: item.salarytype == "Final Salary" ? item.finalsalary : item.salarytype === "Fixed Salary" ? item.fixedsalary : item.prodsalary,
                        holdsalaryconfirm: "No",
                        payyear: oldData.selectedyear,
                        paymonth: oldData.selectedmonth,
                        paydate: "",
                      },
                      ...oldData?.logdata,
                    ];
                  }
                  // console.log(logdatas, 'logdatas');
                  return oldData ? { ...oldData, changestatus: "Data in Bank Release", isvaluechanges: "Data in Bank Release", logdata: logdatas } : item;
                } else if (item.changestatus == "+/- Amount differ" && findIsBankStatusCreated && !findIsBankStatusClosed) {
                  return { ...item, changestatus: "Data in Bank Prepation was removed", isvaluechanges: "Data in Bank Prepation was removed" };
                } else {
                  // If changestatus is not "Amount Differ", update the item to set sentfixsalary: "Yes" if needed
                  return { ...item, changestatus: item.changestatus, isvaluechanges: item.isvaluechanges, sentfixsalary: "Yes", logdata: [], fixsalarydateconfirm: "", fixholdsalarydateconfirm: "" };
                }
              });

              if (finalDataOnlyAboveHundred.some((d) => d.isvaluechanges === "Data in Bank Prepation was removed")) {
                handleBankRleasePopOpen();
                setnewRerunData(finalDataOnlyAboveHundred);
              } else {
                // console.log(oldData.outerId, finalDataOnlyAboveHundred[0], oldData._id, 'fgd');
                let res = await axios.post(`${SERVICE.UPDATE_INNERDATA_SINGLE_USER_RERUN}`, {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },
                  outerId: oldData.outerId,
                  innerId: oldData._id,
                  updateData: finalDataOnlyAboveHundred[0],
                });

                setIsLoad(false);
                props.context.fetchPayRunList();
                setShowAlert(
                  <>
                    <CheckCircleOutlineOutlinedIcon sx={{ fontSize: "100px", color: "#1d8510de" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Updated Successfully"}</p>
                  </>
                );
                handleClickOpenerr();
              }
            } catch (err) {
              setIsLoad(false);
              console.log(err);
            }
          })
          .catch((err) => {
            setIsLoad(false);
            console.log(err);
          });
      }
    } catch (err) {
      console.log(err);
      setIsLoad(false);
    }
  };

  return (
    <>
      <LoadingButton loading={isLoad} onClick={confirmSubmit} variant="contained" size="small" color="primary" sx={{ textTransform: "capitalize" }}>
        {" "}
        Re Run{" "}
      </LoadingButton>

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

        <Dialog open={bankRleasePop} onClose={handleBankRleasePopClose} aria-labelledby="alert-dialog-title-delete-BULK" maxWidth={"md"} aria-describedby="alert-dialog-description-delete-BULK">
          <DialogContent>
            {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} /> */}
            <Typography variant="h5">This user's data in bank release do you want to remove ?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => hanleBankReleaseDataRemove()} variant="contained" color="primary">
              Yes
            </Button>
            <Button sx={userStyle.btncancel} onClick={() => hanleBankReleaseDataNotRemove()}>
              No
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

function PayRun() {
  const [manageshortagemasters, setManageshortagemasters] = useState([]);
  const [revenueAmount, setRevenueAmount] = useState([]);
  const [salSlabs, setsalSlabs] = useState([]);
  const [eraAmounts, setEraAmounts] = useState([]);
  const [acPointCal, setAcPointCal] = useState([]);
  const [attStatus, setAttStatus] = useState([]);
  const [attModearr, setAttModearr] = useState([]);
  const [attStatusOption, setAttStatusOption] = useState([]);
  const [selectedViewMonthNum, setSelectedViewMonthNum] = useState();

  const theme = useTheme();

  const [fileFormat, setFormat] = useState("");
  const { isUserRoleAccess, isUserRoleCompare } = useContext(UserRoleAccessContext);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Multiselectdropdowns
  const [selectedDepartment, setSelectedDepartment] = useState([]);
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState([]);

  const [departments, setDepartments] = useState([]);
  const [departmentsList, setDepartmentsList] = useState([]);

  const [payruncontrolmaster, setPayruncontrolmaster] = useState([]);

  const [profTaxMaster, setProfTaxMaster] = useState([]);
  const [shifts, setShifts] = useState([]);

  const [payRunList, setPayRunList] = useState([]);

  const [employeesPayRun, setEmployeesPayRun] = useState([]);
  const { auth } = useContext(AuthContext);

  // datatabletwo
  //Datatable
  const gridRefList = useRef(null);
  const [pageList, setPageList] = useState(1);
  const [pageSizeList, setPageSizeList] = useState(10);
  const [itemsList, setItemsList] = useState([]);

  const [searchQueryManageList, setSearchQueryManageList] = useState("");
  const [searchQueryList, setSearchQueryList] = useState("");

  //  Datefield
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;

  let monthsArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  let currentMonth = monthsArr[mm - 1];

  const [selectedYear, setSelectedYear] = useState(yyyy);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedMonthNum, setSelectedMonthNum] = useState(mm);
  const [selectmonthname, setSelectMonthName] = useState(currentMonth);

  const [selectedYearFilter, setSelectedYearFilter] = useState(yyyy);
  const [selectedMonthFilter, setSelectedMonthFilter] = useState(currentMonth);
  const [selectedMonthNumFilter, setSelectedMonthNumFilter] = useState(mm);
  const [selectmonthnameFilter, setSelectMonthNameFilter] = useState(currentMonth);

  const [items, setItems] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [allData, setAllData] = useState([]);
  //yeardropdown
  const years = [];
  for (let year = yyyy; year >= 1977; year--) {
    years.push({ value: year, label: year.toString() });
  }
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

  const CustomStyledDataGrid = styled(StyledDataGrid)(({ theme }) => ({
    "& .MuiDataGrid-columnHeaderTitle": {
      fontSize: "14px",
      fontWeight: "bold !important",
      lineHeight: "15px",
      whiteSpace: "normal", // Wrap text within the available space
      overflow: "visible", // Allow overflowed text to be visible
      minWidth: "20px",
    },
    "& .MuiDataGrid-columnHeaders": {
      minHeight: "50px !important",
      maxHeight: "50px",
    },
    "& .MuiDataGrid-row": {
      fontSize: "12px", // Change the font size for row data
      minWidth: "20px",
      // color: "#000000de",
    },
    "& .MuiDataGrid-cell": {
      whiteSpace: "normal !important",
      wordWrap: "break-word !important",
      lineHeight: "1.2 !important", // Optional: Adjusts line height for better readability
    },
  }));

  let exportColumnNames = [
    "Department",
    "Company",
    "Branch",
    "Unit",
    "Team",
    "Designation",
    "Employee Name",
    "Emp Code",
    "Aadhar Name",
    "Process Code",
    "DOJ",
    "Actual Exp",
    "Prod Exp",
    "Total No.of Days",
    "Total Shift",
    "C.L. / S.L.",
    "Week Off",
    "Holiday",
    "Total Absent/ Leave Shift",
    "Total Paid Shift",
    "Gross",
    "Basic",
    "HRA",
    "Conveyance",
    "Medical Allowance",
    "Production Allowance",
    "Production Allowance 2",
    "Other Allowance",
    "New Gross",
    "Actual Basic",
    "Actual HRA",
    "Actual Conveyance",
    "Actual Medical Allowance",
    "Actual Production Allowance",
    "Actual Production Allowance 2",
    "Actual Other Allowance",
    "Target Points",
    "Acheived Points",
    "Acheived %",
    "Achieved Production Allowance",
    "Actual Net Salary",
    "LOP Basic",
    "LOP HRA",
    "LOP Conveyance",
    "LOP Medical Allowance",
    "LOP Production Allowance",
    "LOP Other Allowance",
    "LOP Net Salary",
    "PROD Basic",
    "PROD HRA",
    "PROD Conveyance",
    "PROD Medical Allowance",
    "PROD Production Allowance",
    "PROD Other Allowance",
    "Attendance LOP",
    "Calculated Net Salary",
    "Actual Penalty Amount",
    "Penalty Amount",
    "Loss Deduction",
    "Other Deduction",
    "Final Basic",
    "Final HRA",
    "Final Conveyance",
    "Final Medical Allowance",
    "Final Production Allowance",
    "Final Other Allowance",
    "Final Net Salary",
    "PF Days",
    "NCP Days",
    "PF Deduction",
    "ESI Deduction",
    "Final-LOP ",
    "Final LOP Days",
    "Final Leave Deduction",
    "Professional Tax",
    "Total Deductions",
    "UAN",
    "IP Name",
    "No. Allowance Shift",
    "Shift Allowance Point",
    "Shift Allowance Target",
    "Night Shift Allowance",
    "Final Salary",
    "Final Salary+ Penalty",
    "Total Points Value",
    "ERA",
    "Actual ERA",
    "PF Employer Deduction",
    "ESI Employer Deduction",
    "CTC",
    "Revenue Allowance",
    "Final Value",
    "Final Value-Penalty",
    "Shortage",
    "Shortage 1",
    "Actual Deduction",
    "Minimum Deduction",
    "Final Value Review",
    "Final Value Status",
    "Final Value Penalty Status",
    "Fixed Loss Deduction",
    "Fixed NET Salary",
    "Fixed Basic",
    "Fixed HRA",
    "Fixed Conveyance",
    "Fixed Medical Allowance",
    "Fixed Production Allowance",
    "Fixed Other Allowance",
    "Fixed NET Salary1",
    "Fixed Emp_pf",
    "Fixed Emp_Esi",
    "Fixed Emp_tax",
    "Fixed Empr_pf",
    "Fixed Empr_Esi",
    "Fixed Shift Allowance",
    "Fixed Total Deductions",
    "Fixed Salary",
    "Fixed Salary + Penalty",
    "Fixed-LOP",
    "Fixed LOP Days",
    "Fixed Leave Deduction",
    "Fixed CTC",
    "Fixed Final Value",
    "Fixed Actual Deduction",
    "Fixed Minimum Deduction",
    "PROD Loss Deduction",
    "PROD NET_Salary",
    "PROD Basic",
    "PROD HRA",
    "PROD Conveyance",
    "PROD Medical Allowance",
    "PROD Production Allowance",
    "PROD Other Allowance",
    "PROD NET_Salary1",
    "PROD Emp_pf",
    "PROD Emp_esi",
    "PROD Emp_tax",
    "PROD Empr_pf",
    "PROD Empr_Esi",
    "PROD Shift_Allowance",
    "PROD Total Deductions",
    "PROD Salary",
    "PROD Salary+Penalty",
    "PROD LOP Days",
    "PROD LOP",
    "PROD Leave Deduction",
    "PROD CTC",
    "PROD Final Value",
    "PROD Actual Deduction",
    "PROD Minimum Deduction",
    "Bank Name",
    "Account Name",
    "Account Number",
    "IFSC Code",
    "UAN",
    "pf Member Name",
    "Insurance No",
    "IP Name",
    `Current (${monthsArr[Number(selectedViewMonthNum) + 1 > 12 ? 0 : Number(selectedViewMonthNum)]}) Month Avg`,
    `Current (${monthsArr[Number(selectedViewMonthNum) + 1 > 12 ? 0 : Number(selectedViewMonthNum)]}) Month Attendance`,

    "Paid Status",
    "Salary Type",
    "Deduction Type",
  ];

  let exportRowValues = [
    "department",
    "company",
    "branch",
    "unit",
    "team",
    "designation",
    "companyname",
    "empcode",
    "legalname",
    "processcode",
    "doj",
    "experience",
    "prodexp",
    "totalnumberofdays",
    "totalshift",
    "clsl",
    "weekoff",
    "holiday",
    "totalasbleave",
    "totalpaidDays",
    "oldgross",
    "oldbasic",
    "oldhra",
    "oldconveyance",
    "oldmedicalallowance",
    "oldproductionallowance",
    "oldproductionallowancetwo",
    "oldotherallowance",
    "newgross",
    "actualbasic",
    "actualhra",
    "actualconveyance",
    "actualmedicalallowance",
    "actualproductionallowance",
    "actualproductionallowancetwo",
    "actualotherallowance",
    "monthPoint",
    "acheivedpoints",
    "acheivedpercent",
    "achievedproductionallowance",
    "actualnetsalary",
    "lopbasic",
    "lophra",
    "lopconveyance",
    "lopmedicalallowance",
    "lopproductionallowance",
    "lopotherallowance",
    "lopnetsalary",
    "prodbasic",
    "prodhra",
    "prodconveyance",
    "prodmedicalallowance",
    "prodproductionallowance",
    "prodotherallowance",
    "attendancelop",
    "calculatednetsalary",
    "actualpenaltyamount",
    "penaltyamount",
    "lossdeduction",
    "otherdeduction",
    "finalbasic",
    "finalhra",
    "finalconveyance",
    "finalmedicalallowance",
    "finalproductionallowance",
    "finalotherallowance",
    "finalnetsalary",
    "pfdays",
    "ncpdays",
    "pfdeduction",
    "esideduction",
    "finallopdays",
    "paysliplop",
    "finalleavededuction",
    "professionaltax",
    "totaldeductions",
    "uan",
    "ipname",
    "noallowanceshift",
    "shiftallowancepoint",
    "shiftallowancetarget",
    "nightshiftallowance",
    "finalsalary",
    "finalsalarypenalty",
    "totalpointsvalue",
    "era",
    "actualera",
    "pfemployerdeduction",
    "esiemployerdeduction",
    "ctc",
    "revenueallowance",
    "finalvalue",
    "finalvaluepenalty",
    "shortage",
    "shortageone",
    "actualdeduction",
    "minimumdeduction",
    "finalvaluereview",
    "finalvaluestatus",
    "finalvaluepenaltystatus",
    "fixedlossdeduction",
    "fixednetsalary",
    "fixedbasic",
    "fixedhra",
    "fixedconveyance",
    "fixedmedicalallowance",
    "fixedproductionallowance",
    "fixedotherallowance",
    "fixednetsalaryone",
    "fixedemppf",
    "fixedempesi",
    "fixedempptax",
    "fixedemprpf",
    "fixedempresi",
    "fixedshiftallowance",
    "fixedtotaldeductions",
    "fixedsalary",
    "fixedsalarypenalty",
    "fixedlop",
    "fixedlopdays",
    "fixedleavededuction",
    "fixedctc",
    "fixedfinalvalue",
    "fixedactualdeduction",
    "fixedminimumdeduction",
    "prodlossdeduction",
    "prodnetsalary",
    "prodbasicp",
    "prodhrap",
    "prodconveyancep",
    "prodmedicalallowancep",
    "prodproductionallowancep",
    "prodotherallowancep",
    "prodnetsalaryonep",
    "prodemppf",
    "prodempesi",
    "prodempptax",
    "prodemprpf",
    "prodempresi",
    "prodshiftallowance",
    "prodtotaldeductions",
    "prodsalary",
    "prodsalarypenalty",
    "prodlopdays",
    "prodlop",
    "prodleavededuction",
    "prodctc",
    "prodfinalvalue",
    "prodactualdeduction",
    "prodminimumdeduction",
    "bankname",
    "accountname",
    "accountnumber",
    "ifsccode",
    "uan",
    "pfmembername",
    "insuranceno",
    "ipname",
    "currentmonthavg",
    "currentmonthattendance",
    "paidstatus",
    "salarytype",
    "deductiontype",
  ];
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.value);
    // updateDateValue(selectedYear, event.value);
    setSelectMonthName(event.label);
    setSelectedMonthNum(event.numval);
  };

  const handleYearChangeFilter = (event) => {
    setSelectedYearFilter(event.value);
  };

  const handleMonthChangeFilter = (event) => {
    setSelectedMonthFilter(event.value);
    setSelectMonthNameFilter(event.label);
    setSelectedMonthNumFilter(event.numval);
  };

  const [isBankdetail, setBankdetail] = useState(false);

  const gridRef = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");

  const [bulkDelOpenCheck, setBulkDelOpenCheck] = useState(false);

  const handlebulkDelOpenCheck = () => {
    setBulkDelOpenCheck(true);
  };
  const handlebulkDelCloseCheck = () => {
    setBulkDelOpenCheck(false);
  };

  const [bankRleasePop, setBankRleasePop] = useState(false);

  const handleBankRleasePopOpen = () => {
    setBankRleasePop(true);
  };
  const handleBankRleasePopClose = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setBankRleasePop(false);
  };
  const [bankRleasePopAllEmp, setBankRleasePopAllEmp] = useState(false);

  const handleBankRleasePopOpenAllEmp = () => {
    setBankRleasePopAllEmp(true);
  };
  const handleBankRleasePopCloseAllEmp = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setBankRleasePopAllEmp(false);
  };

  const [bankRleasePopWithoutEdit, setBankRleasePopWithoutEdit] = useState(false);

  const handleBankRleasePopOpenWithoutEdit = () => {
    setBankRleasePopWithoutEdit(true);
  };
  const handleBankRleasePopCloseWithoutEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setBankRleasePopWithoutEdit(false);
  };

  const [bankRleasePopWithEdit, setBankRleasePopWithEdit] = useState(false);

  const handleBankRleasePopOpenWithEdit = () => {
    setBankRleasePopWithEdit(true);
  };
  const handleBankRleasePopCloseWithEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setBankRleasePopWithEdit(false);
  };

  const [selectedRowsEsi, setSelectedRowsEsi] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [openESINoDed, setOpenESINoDed] = useState(false);
  const [ESINoDedEmps, setESINoDedEmps] = useState([]);

  const handleOpenESINoDed = () => {
    setOpenESINoDed(true);
  };
  const handleCloseESINoDed = () => {
    setOpenESINoDed(false);
  };

  const handleUpdateESIfalse = async () => {
    try {
      let res = await axios.post(SERVICE.USER_UPDATE_ESIDED_FALSE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        users: selectedRowsEsi,
      });
      setShowAlert(
        <>
          <CheckCircleOutlineOutlinedIcon sx={{ fontSize: "100px", color: "#1d8510de" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Updated Successfully"}</p>
        </>
      );
      handleClickOpenerr();
      handleCloseESINoDed();
    } catch (err) {
      console.log(err, "err");
    }
  };

  //CHECK BOX SELECTION
  const handleCheckboxChange = (id) => {
    let updatedSelectedRows;
    if (selectedRowsEsi.includes(id)) {
      updatedSelectedRows = selectedRowsEsi.filter((selectedId) => selectedId !== id);
    } else {
      updatedSelectedRows = [...selectedRowsEsi, id];
    }

    setSelectedRowsEsi(updatedSelectedRows);

    // Update the "Select All" checkbox based on whether all rows are selected
    setSelectAll(updatedSelectedRows.length === ESINoDedEmps.length);
  };

  //CHECK BOX CHECKALL SELECTION
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRowsEsi([]);
      setSelectAll(false);
    } else {
      if (ESINoDedEmps.length === 0) {
        // Do not allow checking when there are no rows
        return;
      }
      const allRowIds = ESINoDedEmps.map((row) => row._id);
      setSelectedRowsEsi(allRowIds);
      setSelectAll(true);
    }
  };

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Pay Run List.png");
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

  const [bankdetailBtn, setBankdetailBtn] = useState(false);
  const [attCtrlCriteria, setAttCtrlCriteria] = useState("");
  const [targetPoints, setTargetPoints] = useState([]);

  const fetchAll = async () => {
    setBankdetailBtn(true);
    try {
      const [RES_PAYRUNCONTROL, RES_TAX, RES_SALARYSLAB, RES_SHORTAGE, RES_ERA, RES_REVENUE, RES_ACPOINT, RES_ATTSTS, RES_ATTMODE, RES_DEPT, RES_ATT_CRTIERIA, RES_TARGET, RES_SHIFT] = await Promise.all([
        axios.get(SERVICE.PAYRUNCONTROL_LIMITED, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.ALL_PROFFESIONALTAXMASTER, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),

        axios.get(SERVICE.SALARYSLAB_LIMITED, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.MANAGESHORTAGEMASTER, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.ERAAMOUNTSLIMITED, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.REVENUEAMOUNTSLIMITED, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.ACPOINTCALCULATION, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.ATTENDANCE_STATUS, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.ATTENDANCE_MODE_STATUS, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.DEPARTMENT, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        // axios.get(SERVICE.PAYRUNLIST_LIMITED, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.GET_ATTENDANCE_CONTROL_CRITERIA_LAST_INDEX_PAYAMOUNT, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.TARGETPOINTS_LIMITED, {
          headers: { Authorization: `Bearer ${auth.APIToken}` },
        }),
        // axios.get(SERVICE.SHIFTS_LIMITED, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
      ]);
      let result = RES_ATTMODE?.data?.allattmodestatus.filter((data, index) => {
        return data.appliedthrough != "Auto";
      });
      setAttStatusOption(result.map((d) => d.name));
      let customSort = ["Individual", "Department", "Team", "Unit", "Branch"];
      let sortedControl = RES_PAYRUNCONTROL?.data?.payruncontrol.sort((a, b) => {
        // Get the index of each filtertype in customSort
        let indexA = customSort.indexOf(a.filtertype);
        let indexB = customSort.indexOf(b.filtertype);

        // If filtertype is not found, assign a high index to push it to the end
        if (indexA === -1) indexA = customSort.length;
        if (indexB === -1) indexB = customSort.length;

        // Return the difference to sort
        return indexA - indexB;
      });
      let finalPayAmount = RES_ATT_CRTIERIA.data.attendancecontrolcriteria && RES_ATT_CRTIERIA.data.attendancecontrolcriteria.payrollamount ? Number(RES_ATT_CRTIERIA.data.attendancecontrolcriteria.payrollamount) : 100;
      setPayruncontrolmaster(sortedControl);
      setAcPointCal(RES_ACPOINT?.data?.acpointcalculation);
      setRevenueAmount(RES_REVENUE?.data?.revenueamounts);
      setEraAmounts(RES_ERA?.data?.eraamounts);
      setManageshortagemasters(RES_SHORTAGE?.data?.manageshortagemasters);
      setsalSlabs(RES_SALARYSLAB.data.salaryslab);
      setShifts([]);
      setProfTaxMaster(RES_TAX?.data?.professionaltaxmaster);
      setAttStatus(RES_ATTSTS?.data?.attendancestatus);
      setAttModearr(RES_ATTMODE?.data?.allattmodestatus);
      setDepartmentsList(RES_DEPT.data.departmentdetails);
      setAttCtrlCriteria(finalPayAmount);

      setDepartments(
        RES_DEPT.data.departmentdetails.map((item) => ({
          label: item.deptname,
          value: item.deptname,
        }))
      );
      setBankdetailBtn(false);
      setTargetPoints(RES_TARGET.data.targetpoints);
    } catch (err) {
      setBankdetailBtn(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
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
    actions: true,
    company: true,
    branch: true,
    unit: true,
    team: true,
    empcode: true,
    companyname: true,
    legalname: true,
    doj: true,
    designation: true,
    department: true,
    processcodeexp: true,
    experience: true,
    prodexp: true,

    //need to fetch from users
    bankname: true,
    accountname: true,
    accountnumber: true,
    ifsccode: true,
    totalnumberofdays: true,
    totalshift: true,
    clsl: true,
    weekoff: true,
    holiday: true,
    totalasbleave: true,
    totalpaidDays: true,
    processcode: true,
    //fetched from salary slab filter
    newgross: true,
    actualbasic: true,
    actualhra: true,
    actualconveyance: true,
    actualmedicalallowance: true,
    actualproductionallowance: true,
    actualproductionallowancetwo: true,
    actualotherallowance: true,
    oldgross: true,
    oldbasic: true,
    oldhra: true,
    oldconveyance: true,
    oldmedicalallowance: true,
    oldproductionallowance: true,
    oldproductionallowancetwo: true,
    oldotherallowance: true,

    //need to fetch from daypoints upload
    targetpoints: true,
    monthPoint: true,
    acheivedpoints: true,
    acheivedpercent: true,
    actualpenalty: true,
    penaltyamt: true,
    uan: true,
    pfmembername: true,
    insuranceno: true,
    ipname: true,
    noallowanceshift: true,
    shiftallowancepoint: true,
    shiftallowancetarget: true,
    nightshiftallowance: true,
    era: true,

    revenueallow: true,
    shortage: true,
    monthPoint: true,

    currentmonthavg: true,
    currentmonthattendance: true,
    paidstatus: true,

    achievedproductionallowance: true,
    actualnetsalary: true,

    //FINAL
    lopbasic: true,
    lophra: true,
    lopconveyance: true,
    lopmedicalallowance: true,
    lopproductionallowance: true,
    lopotherallowance: true,
    lopnetsalary: true,
    prodbasic: true,
    prodhra: true,
    prodconveyance: true,
    prodmedicalallowance: true,
    prodproductionallowance: true,
    prodotherallowance: true,
    attendancelop: true,
    calculatednetsalary: true,
    actualpenaltyamount: true,
    penaltyamount: true,
    lossdeduction: true,
    otherdeduction: true,
    finalbasic: true,
    finalhra: true,
    finalconveyance: true,
    finalmedicalallowance: true,
    finalproductionallowance: true,
    finalotherallowance: true,
    finalnetsalary: true,
    pfdays: true,
    ncpdays: true,
    pfdeduction: true,
    esideduction: true,
    finallopdays: true,
    paysliplop: true,
    finalleavededuction: true,
    professionaltax: true,
    totaldeductions: true,
    uan: true,
    ipname: true,
    noallowanceshift: true,
    shiftallowancepoint: true,
    shiftallowancetarget: true,
    nightshiftallowance: true,
    finalsalary: true,
    finalsalarypenalty: true,
    totalpointsvalue: true,
    era: true,
    actualera: true,
    pfemployerdeduction: true,
    esiemployerdeduction: true,
    ctc: true,
    revenueallowance: true,
    finalvalue: true,
    finalvaluetwo: true,
    finalvaluepenalty: true,
    shortage: true,
    shortageone: true,
    actualdeduction: true,
    minimumdeduction: true,
    finalvaluereview: true,
    finalvaluestatus: true,
    finalvaluepenaltystatus: true,

    //FIXED
    fixedlossdeduction: true,
    fixednetsalary: true,
    fixedbasic: true,
    fixedhra: true,
    fixedconveyance: true,
    fixedmedicalallowance: true,
    fixedproductionallowance: true,
    fixedotherallowance: true,
    fixednetsalaryone: true,
    fixedemppf: true,
    fixedempesi: true,
    fixedempptax: true,
    fixedemprpf: true,
    fixedempresi: true,
    fixedshiftallowance: true,
    fixedtotaldeductions: true,
    fixedsalary: true,
    fixedsalarypenalty: true,
    fixedlop: true,
    fixedlopdays: true,
    fixedleavededuction: true,
    fixedctc: true,
    fixedfinalvalue: true,
    fixedactualdeduction: true,
    fixedminimumdeduction: true,

    //PRODUCTION
    prodlossdeduction: true,
    prodnetsalary: true,
    prodbasicp: true,
    prodhrap: true,
    prodconveyancep: true,
    prodmedicalallowancep: true,
    prodproductionallowancep: true,
    prodotherallowancep: true,
    prodnetsalaryonep: true,
    prodemppf: true,
    prodempesi: true,
    prodempptax: true,
    prodemprpf: true,
    prodempresi: true,
    prodshiftallowance: true,
    prodtotaldeductions: true,
    prodsalary: true,
    prodsalarypenalty: true,
    prodlopdays: true,
    prodlop: true,
    prodleavededuction: true,
    prodctc: true,
    prodfinalvalue: true,
    prodactualdeduction: true,
    prodminimumdeduction: true,

    salarytype: true,
    deductiontype: true,
  };

  const fetchPayRunList = async () => {
    try {
      // let res_data = await axios.get(SERVICE.PAYRUNLIST_LIMITED, {
      //   headers: {
      //     Authorization: `Bearer ${auth.APIToken}`,
      //   },
      // });
      let res_data = await axios.post(SERVICE.PAYRUNLIST_LIMITED_FILTERED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        department: selectedDepartmentFilter.map((item) => item.value),
        month: selectmonthnameFilter,
        year: selectedYearFilter,
      });
      setPayRunList(res_data.data.payrunlists);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    fetchAll();
    // fetchPayRunList();
  }, []);

  const fetchPayrunlistOnly = async () => {
    setBankdetail(true);
    setIsLoadStart(false);
    try {
      let res_data = await axios.post(SERVICE.PAYRUNLIST_LIMITED_FILTERED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        department: selectedDepartmentFilter.map((item) => item.value),
        month: selectmonthnameFilter,
        year: selectedYearFilter,
      });
      setPayRunList(res_data.data.payrunlists);
      setBankdetail(false);
    } catch (err) {
      setBankdetail(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const addSerialNumberList = async () => {
    try {
      let sortedData = payRunList.sort((a, b) => {
        if (a.from === b.from) {
          return a.department.localeCompare(b.department);
        }
        return a.from - b.from;
      });
      let itemsWithResultsFinal = sortedData.map((item, index) => {
        return {
          ...item,
          serialNumber: index + 1,
          // totalctc: item.total,
          generatedon: moment(item.generatedon).format("DD-MM-YYYY hh:mm A"),
          from: moment(new Date(item.from)).format("DD-MM-YYYY"),
          to: moment(new Date(item.to)).format("DD-MM-YYYY"),
        };
      });

      // Initialize an object to store the totals per department
      const result = {};

      // Iterate through userData
      itemsWithResultsFinal.forEach(({ department, _id, generatedon, serialNumber, month, year, from, to, empcount, data }) => {
        // Initialize totals for this department
        let totalctc = 0;
        let totalpf = 0;
        let totalesi = 0;
        let totalproftax = 0;

        // Calculate totals based on salarytype
        data.forEach((entry) => {
          const { ctc, prodctc, fixedctc, salarytype, pfdeduction, fixedemppf, prodemppf, fixedempesi, prodempesi, professionaltax, fixedempptax, prodempptax } = entry;
          // console.log(salarytype, ctc, 'salarytype')
          switch (salarytype) {
            case "Final Salary":
              totalctc += parseFloat(ctc);
              totalpf += parseFloat(pfdeduction); // Assuming pfdeduction is a string representing a float
              totalesi += parseFloat(fixedempesi); // Assuming fixedempesi is a string representing a float
              totalproftax += parseFloat(professionaltax); // Assuming fixedempesi is a string representing a float
              break;
            case "Production Salary":
              totalctc += parseFloat(prodctc);
              totalpf += parseFloat(prodemppf); // Assuming prodemppf is a string representing a float
              totalesi += parseFloat(prodempesi); // Assuming prodempesi is a string representing a float
              totalproftax += parseFloat(prodempptax); // Assuming prodempesi is a string representing a float
              break;
            case "Fixed Salary":
              totalctc += parseFloat(fixedctc);
              totalpf += parseFloat(fixedemppf); // Assuming fixedemppf is a string representing a float
              totalesi += parseFloat(fixedempesi); // Assuming fixedempesi is a string representing a float
              totalproftax += parseFloat(fixedempptax);
              break;
            default:
              break;
          }
        });

        // Add the totals to the result object
        if (result[_id]) {
          result[_id].totalctc += totalctc;
          result[_id].totalpf += totalpf;
          result[_id].totalesi += totalesi;
          result[_id].totalproftax += totalproftax;
        } else {
          result[_id] = { department, _id, totalctc, month, year, totalproftax, totalpf, totalesi, generatedon, serialNumber, from, to, empcount };
        }
      });

      // Convert result object to the desired array format
      const results = Object.values(result);

      // console.log(results.length, 'results');

      setItemsList(results);
    } catch (err) {
      setBankdetail(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    addSerialNumberList();
  }, [payRunList]);

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  //  PDF
  const columns = [
    // Serial number column
    { title: "SNo", dataKey: "serialNumber" },
    { title: "Department", dataKey: "department" },
    { title: "Company", dataKey: "company" },
    { title: "Branch", dataKey: "branch" },
    { title: "Unit", dataKey: "unit" },
    { title: "Team", dataKey: "team" },
    { title: "Designation", dataKey: "designation" },
    { title: "Employee Name", dataKey: "companyname" },
    { title: "Employee Code", dataKey: "empcode" },
    { title: "Aadhar Name", dataKey: "legalname" },
    { title: "Process Code", dataKey: "processcode" },
    { title: "DOJ", dataKey: "doj" },
    { title: "Experience In Month", dataKey: "experience" },
    { title: "Prod Exp", dataKey: "prodexp" },
    { title: "totalnumberofdays", dataKey: "totalnumberofdays" },
    { title: "Total Shift", dataKey: "totalshift" },
    { title: "CLSL", dataKey: "clsl" },
    { title: "WeekOff", dataKey: "weekoff" },
    { title: "Holiday", dataKey: "holiday" },
    { title: "Total Absent/Leave", dataKey: "totalasbleave" },
    { title: "Total Paid Days", dataKey: "totalpaidDays" },

    { title: "Gross", dataKey: "oldgross" },
    { title: "Basic", dataKey: "oldbasic" },
    { title: "HRA", dataKey: "oldhra" },
    { title: "Conveyance", dataKey: "oldconveyance" },
    { title: "Medical Allowance", dataKey: "oldmedicalallowance" },
    { title: "Production Allowance", dataKey: "oldproductionallowance" },
    { title: "Production Allowance 2", dataKey: "oldproductionallowancetwo" },
    { title: "Other Allowance", dataKey: "oldotherallowance" },

    { title: "New Gross", dataKey: "newgross" },
    { title: "Actual Basic", dataKey: "actualbasic" },
    { title: "Actual HRA", dataKey: "actualhra" },
    { title: "Actual Conveyance", dataKey: "actualconveyance" },
    { title: "Actual Medical Allowance", dataKey: "actualmedicalallowance" },
    { title: "Actual Production Allowance", dataKey: "actualproductionallowance" },
    { title: "Actual Production Allowance 2", dataKey: "actualproductionallowancetwo" },
    { title: "Actual Other Allowance", dataKey: "actualotherallowance" },
    { title: "Target Points", dataKey: "targetpoints" },
    { title: "Achieved Points", dataKey: "acheivedpoints" },
    { title: "Achieved %", dataKey: "acheivedpercent" },
    { title: "Achieved Production Allowance", dataKey: "achievedproductionallowance" },
    { title: "Actual Net Salary", dataKey: "actualnetsalary" },
    { title: "LOP Basic", dataKey: "lopbasic" },
    { title: "LOP HRA", dataKey: "lophra" },
    { title: "LOP Conveyance", dataKey: "lopconveyance" },
    { title: "LOP Medical Allowance", dataKey: "lopmedicalallowance" },
    { title: "LOP Production Allowance", dataKey: "lopproductionallowance" },
    { title: "LOP Other Allowance", dataKey: "lopotherallowance" },
    { title: "LOP Net Salary", dataKey: "lopnetsalary" },
    { title: "PROD Basic", dataKey: "prodbasic" },
    { title: "PROD HRA", dataKey: "prodhra" },
    { title: "PROD Conveyance", dataKey: "prodconveyance" },
    { title: "PROD Medical Allowance", dataKey: "prodmedicalallowance" },
    { title: "PROD Production Allowance", dataKey: "prodproductionallowance" },
    { title: "PROD Other Allowance", dataKey: "prodotherallowance" },
    { title: "Attendance LOP", dataKey: "attendancelop" },
    { title: "Calculated Net Salary", dataKey: "calculatednetsalary" },
    { title: "Actual Penalty Amount", dataKey: "actualpenaltyamount" },
    { title: "Penalty Amount", dataKey: "penaltyamount" },
    { title: "Loss Deduction", dataKey: "lossdeduction" },
    { title: "Other Deduction", dataKey: "otherdeduction" },
    { title: "Final Basic", dataKey: "finalbasic" },
    { title: "Final HRA", dataKey: "finalhra" },
    { title: "Final Conveyance", dataKey: "finalconveyance" },
    { title: "Final Medical Allowance", dataKey: "finalmedicalallowance" },
    { title: "Final Production Allowance", dataKey: "finalproductionallowance" },
    { title: "Final Other Allowance", dataKey: "finalotherallowance" },
    { title: "Final Net Salary", dataKey: "finalnetsalary" },
    { title: "PF Days", dataKey: "pfdays" },
    { title: "NCP Days", dataKey: "ncpdays" },
    { title: "PF Deduction", dataKey: "pfdeduction" },
    { title: "ESI Deduction", dataKey: "esideduction" },
    { title: "Final LOP", dataKey: "finallopdays" },
    { title: "Final LOP Days", dataKey: "paysliplop" },
    { title: "finalleavededuction", dataKey: "finalleavededuction" },
    { title: "Professional Tax", dataKey: "professionaltax" },
    { title: "Total Deductions", dataKey: "totaldeductions" },
    { title: "UAN", dataKey: "uan" },
    { title: "IP Name", dataKey: "ipname" },
    { title: "No. Allowance Shift", dataKey: "noallowanceshift" },
    { title: "Shift Allowance Point", dataKey: "shiftallowancepoint" },
    { title: "Shift Allowance Target", dataKey: "shiftallowancetarget" },
    { title: "Night Shift Allowance", dataKey: "nightshiftallowance" },
    { title: "Final Salary", dataKey: "finalsalary" },
    { title: "Final Salary-Penalty", dataKey: "finalsalarypenalty" },
    { title: "Total Points Value", dataKey: "totalpointsvalue" },
    { title: "ERA", dataKey: "era" },
    { title: "Actual ERA", dataKey: "actualera" },
    { title: "PF Employer Deduction", dataKey: "pfemployerdeduction" },
    { title: "ESI Employer Deduction", dataKey: "esiemployerdeduction" },
    { title: "CTC", dataKey: "ctc" },
    { title: "Revenue Allowance", dataKey: "revenueallowance" },
    { title: "Final Value", dataKey: "finalvalue" },
    { title: "Final Value-Penalty", dataKey: "finalvaluepenalty" },
    { title: "Shortage", dataKey: "shortage" },
    { title: "Shortage 1", dataKey: "shortageone" },
    { title: "Actual Deduction", dataKey: "actualdeduction" },
    { title: "Minimum Deduction", dataKey: "minimumdeduction" },
    { title: "Final Value Review", dataKey: "finalvaluereview" },
    { title: "Final Value Status", dataKey: "finalvaluestatus" },
    { title: "Final Value Penalty Status", dataKey: "finalvaluepenaltystatus" },

    { title: "Fixed Loss Deduction", dataKey: "fixedlossdeduction" },
    { title: "Fixed Net Salary", dataKey: "fixednetsalary" },
    { title: "Fixed Basic", dataKey: "fixedbasic" },
    { title: "Fixed HRA", dataKey: "fixedhra" },
    { title: "Fixed Conveyance", dataKey: "fixedconveyance" },
    { title: "Fixed Medical Allowance", dataKey: "fixedmedicalallowance" },
    { title: "Fixed Production Allowance", dataKey: "fixedproductionallowance" },
    { title: "Fixed Other Allowance", dataKey: "fixedotherallowance" },
    { title: "Fixed Net Salary1", dataKey: "fixednetsalaryone" },
    { title: "PF Deduction", dataKey: "fixedemppf" },
    { title: "ESI Deduction", dataKey: "fixedempesi" },
    { title: "Fixed Emp Tax", dataKey: "fixedempptax" },
    { title: "PF Employer Deduction", dataKey: "fixedemprpf" },
    { title: "ESI Employer Deduction", dataKey: "fixedempresi" },
    { title: "Fixed Shift Allowance", dataKey: "fixedshiftallowance" },
    { title: "Fixed Total Deductions", dataKey: "fixedtotaldeductions" },
    { title: "Fixed Salary", dataKey: "fixedsalary" },
    { title: "Fixed Salary-Penalty", dataKey: "fixedsalarypenalty" },
    { title: "Fixed LOP", dataKey: "fixedlop" },
    { title: "Fixed LOP Days", dataKey: "fixedlopdays" },
    { title: "Fixed leave Deduction", dataKey: "fixedleavededuction" },
    { title: "Fixed CTC", dataKey: "fixedctc" },
    { title: "Fixed Final Value", dataKey: "fixedfinalvalue" },
    { title: "Fixed Actual Deduction", dataKey: "fixedactualdeduction" },
    { title: "Fixed Minimum Deduction", dataKey: "fixedminimumdeduction" },

    { title: "Current Month Avg", dataKey: "currentmonthavg" },
    { title: "CurrenT Month Attendance", dataKey: "currentmonthattendance" },
    { title: "Paid Status", dataKey: "paidstatus" },

    { title: "Salary Type", dataKey: "salarytype" },
    { title: "Deduction Type", dataKey: "deductiontype" },
  ];

  const downloadPdf = (type) => {
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
        body: type === "filtered" ? rowDataTable : rowData,
      });

      if (currentPage < totalPages) {
        doc.addPage(); // Add a new page if there are more columns to display
      }
    }

    doc.save("Pay Run List.pdf");
  };

  // Excel
  const fileName = "Pay Run List";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Pay Run List",
    pageStyle: "print",
  });

  const gridApi = useRef(null);
  const columnApi = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const totalPages = Math.ceil(rowData.length / pageSize);

  // const onQuickFilterChanged = useCallback((event) => {
  //   console.log("gridApi.current:", gridApi.current);
  //   if (gridApi.current) {
  //     gridApi.current.setGridOption(event.target.value);
  //   }
  // }, []);

  const onQuickFilterChanged = useCallback(
    (event) => {
      if (gridApi.current) {
        if (event.target.value != "") {
          const filterText = event.target.value;
          // gridApi.current.setQuickFilter(filterText);
          const filtered = allData.filter((row) => JSON.stringify(row).toLowerCase().includes(filterText.toLowerCase()));
          setRowData(filtered);

          setCurrentPage(1);
        } else {
          setRowData(allData);
          setCurrentPage(1);
        }
      }
    },
    [rowData]
  );

  // const onGridReady = (params) => {
  //   gridApi.current = params.api;

  // };

  let minRowHeight = 25;
  let currentRowHeight;
  const onGridReady = useCallback((params) => {
    gridApi.current = params.api;
    columnApi.current = params.columnApi;
    // minRowHeight = params.api.getSizesForCurrentTheme().rowHeight;
    // currentRowHeight = minRowHeight;
  }, []);

  useEffect(() => {
    updateGridData();
  }, [currentPage, rowData, pageSize]);

  const updateGridData = () => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    setCurrentData(rowData.slice(start, end));
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
    {
      field: "serialNumber",
      headerName: "SNo",

      width: 80,
      pinned: "left",
      hide: !columnVisibility.serialNumber,
    },
    { field: "department", headerName: "Department", width: 160, hide: !columnVisibility.department },
    { field: "company", headerName: "Company", width: 100, hide: !columnVisibility.company },
    { field: "branch", headerName: "Branch", width: 120, hide: !columnVisibility.branch },
    { field: "unit", headerName: "Unit", width: 100, hide: !columnVisibility.unit },
    { field: "team", headerName: "Team", width: 100, hide: !columnVisibility.team },
    { field: "designation", headerName: "Designation", width: 190, hide: !columnVisibility.designation },
    {
      field: "companyname",
      headerName: "Employee Name",
      width: 200,
      pinned: "left",
      hide: !columnVisibility.companyname,
    },

    { field: "empcode", headerName: "Emp Code", width: 120, hide: !columnVisibility.empcode },
    { field: "legalname", headerName: "Aadhar Name", width: 200, hide: !columnVisibility.legalname },

    { field: "processcodeexp", headerName: "Process Code", width: 140, hide: !columnVisibility.processcodeexp },

    { field: "doj", headerName: "DOJ", width: 130, hide: !columnVisibility.doj },
    { field: "experience", headerName: "Actual Exp", width: 90, hide: !columnVisibility.experience },
    { field: "prodexp", headerName: "Prod Exp", width: 90, hide: !columnVisibility.prodexp },

    { field: "totalnumberofdays", headerName: "Total No.of Days", width: 100, hide: !columnVisibility.totalnumberofdays },
    { field: "totalshift", headerName: "Total Shift", width: 100, hide: !columnVisibility.totalshift },
    { field: "clsl", headerName: "C.L. / S.L.", width: 100, hide: !columnVisibility.clsl },
    { field: "weekoff", headerName: "Week Off", width: 100, hide: !columnVisibility.weekoff },
    { field: "holiday", headerName: "Holiday", width: 100, hide: !columnVisibility.holiday },
    {
      field: "totalasbleave",
      headerName: "Total Absent/ Leave Shift",
      width: 110,
      hide: !columnVisibility.totalasbleave,
    },
    {
      field: "totalpaidDays",
      headerName: "Total Paid Shift",
      width: 110,
      hide: !columnVisibility.totalpaidDays,
    },

    { field: "oldgross", headerName: "Gross", width: 100, hide: !columnVisibility.oldgross },
    { field: "oldbasic", headerName: "Basic", width: 100, hide: !columnVisibility.oldbasic },
    { field: "oldhra", headerName: "HRA", width: 100, hide: !columnVisibility.oldhra },
    { field: "oldconveyance", headerName: "Conveyance", width: 100, hide: !columnVisibility.oldconveyance },
    { field: "oldmedicalallowance", headerName: "Medical Allowance", width: 110, hide: !columnVisibility.oldmedicalallowance },
    { field: "oldproductionallowance", headerName: "Production Allowance", width: 110, hide: !columnVisibility.oldproductionallowance },
    { field: "oldproductionallowancetwo", headerName: "Production Allowance 2", width: 110, hide: !columnVisibility.oldproductionallowancetwo },
    { field: "oldotherallowance", headerName: "Other Allowance", width: 100, hide: !columnVisibility.oldotherallowance },

    { field: "newgross", headerName: "New Gross", width: 100, hide: !columnVisibility.newgross },
    { field: "actualbasic", headerName: "Actual Basic", width: 100, hide: !columnVisibility.actualbasic },
    { field: "actualhra", headerName: "Actual HRA", width: 100, hide: !columnVisibility.actualhra },
    { field: "actualconveyance", headerName: "Actual Conveyance", width: 110, hide: !columnVisibility.actualconveyance },
    { field: "actualmedicalallowance", headerName: "Actual Medical Allowance", width: 115, hide: !columnVisibility.actualmedicalallowance },
    { field: "actualproductionallowance", headerName: "Actual Production Allowance", width: 120, hide: !columnVisibility.actualproductionallowance },
    { field: "actualproductionallowancetwo", headerName: "Actual Production Allowance 2", width: 120, hide: !columnVisibility.actualproductionallowancetwo },
    { field: "actualotherallowance", headerName: "Actual Other Allowance", width: 115, hide: !columnVisibility.actualotherallowance },

    {
      field: "monthPoint",
      headerName: "Target Points",
      width: 100,
      pinned: "left",
      hide: !columnVisibility.monthPoint,
    },
    {
      field: "acheivedpoints",
      headerName: "Acheived Points",
      pinned: "left",
      width: 110,
      valueSetter: (params) => {
        params.data.acheivedpoints = params.newValue;
        params.data.iseditedacheivedpoints = "Yes";
        params.api.applyTransaction({ update: [params.data] });
        return true;
      },
      editable: true,

      hide: !columnVisibility.acheivedpoints,
    },
    {
      field: "acheivedpercent",
      headerName: "Acheived %",
      width: 110,

      hide: !columnVisibility.acheivedpercent,
    },

    { field: "achievedproductionallowance", headerName: "Achieved Production Allowance", width: 120, hide: !columnVisibility.achievedproductionallowance },
    { field: "actualnetsalary", headerName: "Actual Net Salary", width: 100, hide: !columnVisibility.actualnetsalary },
    { field: "lopbasic", headerName: "LOP Basic", width: 100, hide: !columnVisibility.lopbasic },
    { field: "lophra", headerName: "LOP HRA", width: 100, hide: !columnVisibility.lophra },
    { field: "lopconveyance", headerName: "LOP Conveyance", width: 100, hide: !columnVisibility.lopconveyance },
    { field: "lopmedicalallowance", headerName: "LOP Medical Allowance", width: 110, hide: !columnVisibility.lopmedicalallowance },
    { field: "lopproductionallowance", headerName: "LOP Production Allowance", width: 120, hide: !columnVisibility.lopproductionallowance },
    { field: "lopotherallowance", headerName: "LOP Other Allowance", width: 110, hide: !columnVisibility.lopotherallowance },
    { field: "lopnetsalary", headerName: "LOP Net Salary", width: 100, hide: !columnVisibility.lopnetsalary },
    { field: "prodbasic", headerName: "PROD Basic", width: 100, hide: !columnVisibility.prodbasic },
    { field: "prodhra", headerName: "PROD HRA", width: 100, hide: !columnVisibility.prodhra },
    { field: "prodconveyance", headerName: "PROD Conveyance", width: 105, hide: !columnVisibility.prodconveyance },
    { field: "prodmedicalallowance", headerName: "PROD Medical Allowance", width: 110, hide: !columnVisibility.prodmedicalallowance },
    { field: "prodproductionallowance", headerName: " PROD Production Allowance", width: 120, hide: !columnVisibility.prodproductionallowance },
    { field: "prodotherallowance", headerName: "PROD Other Allowance", width: 110, hide: !columnVisibility.prodotherallowance },
    { field: "attendancelop", headerName: "Attendance LOP", width: 110, hide: !columnVisibility.attendancelop },
    { field: "calculatednetsalary", headerName: "Calculated Net Salary", width: 110, hide: !columnVisibility.calculatednetsalary },

    { field: "actualpenaltyamount", headerName: "Actual Penalty Amount", width: 100, hide: !columnVisibility.actualpenaltyamount },
    {
      field: "penaltyamount",
      pinned: "left",
      headerName: "Penalty Amount",
      width: 100,
      valueSetter: (params) => {
        params.data.penaltyamount = params.newValue;
        params.data.iseditedpenaltyamount = "Yes";
        params.api.applyTransaction({ update: [params.data] });
        return true;
      },
      editable: true,
      hide: !columnVisibility.penaltyamount,
    },

    { field: "lossdeduction", headerName: "Loss Deduction", width: 120, hide: !columnVisibility.lossdeduction },
    { field: "otherdeduction", headerName: "Other Deduction", width: 120, hide: !columnVisibility.otherdeduction },

    //FIXED

    { field: "finalbasic", headerName: "Final Basic", width: 100, hide: !columnVisibility.finalbasic },
    { field: "finalhra", headerName: "Final HRA", width: 100, hide: !columnVisibility.finalhra },
    { field: "finalconveyance", headerName: "Final Conveyance", width: 110, hide: !columnVisibility.finalconveyance },
    { field: "finalmedicalallowance", headerName: "Final Medical Allowance", width: 110, hide: !columnVisibility.finalmedicalallowance },
    { field: "finalproductionallowance", headerName: "Final Production Allowance", width: 120, hide: !columnVisibility.finalproductionallowance },
    { field: "finalotherallowance", headerName: "Final Other Allowance", width: 110, hide: !columnVisibility.finalotherallowance },
    { field: "finalnetsalary", headerName: "Final Net Salary", width: 100, hide: !columnVisibility.finalnetsalary },
    { field: "pfdays", headerName: "PF Days", width: 90, hide: !columnVisibility.pfdays },
    { field: "ncpdays", headerName: "NCP Days", width: 100, hide: !columnVisibility.ncpdays },
    { field: "pfdeduction", headerName: "PF Deduction", width: 110, hide: !columnVisibility.pfdeduction },
    { field: "esideduction", headerName: "ESI Deduction", width: 110, hide: !columnVisibility.esideduction },
    { field: "finallopdays", headerName: "Final-LOP ", width: 100, hide: !columnVisibility.finallopdays },
    { field: "paysliplop", headerName: "Final LOP Days", width: 100, hide: !columnVisibility.paysliplop },
    { field: "finalleavededuction", headerName: "Final Leave Deduction", width: 115, hide: !columnVisibility.finalleavededuction },
    { field: "professionaltax", headerName: "Professional Tax", width: 100, hide: !columnVisibility.professionaltax },
    { field: "totaldeductions", headerName: "Total Deductions", width: 120, hide: !columnVisibility.totaldeductions },
    { field: "uan", headerName: "UAN", width: 150, hide: !columnVisibility.uan },
    { field: "ipname", headerName: "IP Name", width: 170, hide: !columnVisibility.ipname },

    { field: "noallowanceshift", headerName: "No. Allowance Shift", width: 120, hide: !columnVisibility.noallowanceshift },
    { field: "shiftallowancepoint", headerName: "Shift Allowance Point", width: 120, hide: !columnVisibility.shiftallowancepoint },
    { field: "shiftallowancetarget", headerName: "Shift Allowance Target", width: 120, hide: !columnVisibility.shiftallowancetarget },
    { field: "nightshiftallowance", headerName: "Night Shift Allowance", width: 120, hide: !columnVisibility.nightshiftallowance },
    { field: "finalsalary", headerName: "Final Salary", width: 100, hide: !columnVisibility.finalsalary },
    { field: "finalsalarypenalty", headerName: "Final Salary+ Penalty", width: 105, hide: !columnVisibility.finalsalarypenalty },
    { field: "totalpointsvalue", headerName: "Total Points Value", width: 100, hide: !columnVisibility.totalpointsvalue },
    { field: "era", headerName: "ERA", width: 100, hide: !columnVisibility.era },
    { field: "actualera", headerName: "Actual ERA", width: 100, hide: !columnVisibility.actualera },
    { field: "pfemployerdeduction", headerName: "PF Employer Deduction", width: 120, hide: !columnVisibility.pfemployerdeduction },
    { field: "esiemployerdeduction", headerName: "ESI Employer Deduction", width: 120, hide: !columnVisibility.esiemployerdeduction },
    { field: "ctc", headerName: "CTC", width: 100, hide: !columnVisibility.ctc },
    { field: "revenueallowance", headerName: "Revenue Allowance", width: 110, hide: !columnVisibility.revenueallowance },
    { field: "finalvalue", headerName: "Final Value", width: 100, hide: !columnVisibility.finalvalue },
    // { field: "finalvaluetwo", headerName: "Final Value 2", width:100, , hide: !columnVisibility.finalvaluetwo, headerClassName: "bold-header" },
    { field: "finalvaluepenalty", headerName: "Final Value-Penalty", width: 100, hide: !columnVisibility.finalvaluepenalty },
    { field: "shortage", headerName: "Shortage", width: 105, hide: !columnVisibility.shortage },
    { field: "shortageone", headerName: "Shortage 1", width: 110, hide: !columnVisibility.shortageone },
    { field: "actualdeduction", headerName: "Actual Deduction", width: 110, hide: !columnVisibility.actualdeduction },
    { field: "minimumdeduction", headerName: "Minimum Deduction", width: 110, hide: !columnVisibility.minimumdeduction },
    {
      field: "finalvaluereview",
      headerName: "Final Value Review",
      width: 100,
      hide: !columnVisibility.finalvaluereview,
      headerClassName: "bold-header",
      cellRenderer: (props) => {
        const { data, node } = props;
        return (
          <>
            <Typography
              sx={{
                width: "max-content",
                color: data.finalvaluereview === "OK" ? "white" : "black",
                background: data.finalvaluereview === "OK" ? "skyblue" : "inherit",
                padding: "3px 5px",
                fontSize: "11px",
                borderRadius: "4px",
              }}
            >
              {data.finalvaluereview}
            </Typography>
          </>
        );
      },
    },
    {
      field: "finalvaluestatus",
      headerName: "Final Value Status",
      width: 100,
      hide: !columnVisibility.finalvaluestatus,
      headerClassName: "bold-header",
      cellRenderer: (props) => {
        const { data, node } = props;
        return (
          <>
            <Typography
              sx={{
                width: "max-content",
                color: data.finalvaluestatus === "VERY LOSS" ? "black" : "white",
                background: data.finalvaluestatus === "VERY LOSS" ? "yellow" : data.finalvaluestatus === "OK" ? "lightgreen" : data.finalvaluestatus === "HIGH" ? "red" : data.finalvaluestatus === "LOSS OK" ? "black" : "inherit",
                padding: "3px 5px",
                fontSize: "11px",
                borderRadius: "4px",
              }}
            >
              {data.finalvaluestatus}
            </Typography>
          </>
        );
      },
    },
    {
      field: "finalvaluepenaltystatus",
      headerName: "Final Value Penalty Status",
      width: 100,
      hide: !columnVisibility.finalvaluepenaltystatus,
      headerClassName: "bold-header",
      cellRenderer: (props) => {
        const { data, node } = props;
        return (
          <>
            <Typography
              sx={{
                width: "max-content",
                color: data.finalvaluepenaltystatus === "VERY LOSS" ? "black" : "white",
                background: data.finalvaluepenaltystatus === "VERY LOSS" ? "yellow" : data.finalvaluepenaltystatus === "OK" ? "lightgreen" : data.finalvaluepenaltystatus === "HIGH" ? "red" : data.finalvaluepenaltystatus === "LOSS OK" ? "black" : "inherit",
                padding: "3px 5px",
                fontSize: "11px",
                borderRadius: "4px",
              }}
            >
              {data.finalvaluepenaltystatus}
            </Typography>
          </>
        );
      },
    },

    //FIXED
    { field: "fixedlossdeduction", headerName: "Fixed Loss Deduction", width: 120, hide: !columnVisibility.fixedlossdeduction },
    { field: "fixednetsalary", headerName: "Fixed NET Salary", width: 100, hide: !columnVisibility.fixednetsalary },
    { field: "fixedbasic", headerName: "Fixed Basic", width: 100, hide: !columnVisibility.fixedbasic },
    { field: "fixedhra", headerName: "Fixed HRA", width: 100, hide: !columnVisibility.fixedhra },
    { field: "fixedconveyance", headerName: "Fixed Conveyance", width: 100, hide: !columnVisibility.fixedconveyance },
    { field: "fixedmedicalallowance", headerName: "Fixed Medical Allowance", width: 125, hide: !columnVisibility.fixedmedicalallowance },
    { field: "fixedproductionallowance", headerName: "Fixed Production Allowance", width: 120, hide: !columnVisibility.fixedproductionallowance },
    { field: "fixedotherallowance", headerName: "Fixed Other Allowance", width: 125, hide: !columnVisibility.fixedotherallowance },
    { field: "fixednetsalaryone", headerName: "Fixed NET Salary1", width: 100, hide: !columnVisibility.fixednetsalaryone },
    { field: "fixedemppf", headerName: "Fixed Emp_pf", width: 100, hide: !columnVisibility.fixedemppf },
    { field: "fixedempesi", headerName: "Fixed Emp_Esi", width: 105, hide: !columnVisibility.fixedempesi },
    { field: "fixedempptax", headerName: "Fixed Emp_tax", width: 105, hide: !columnVisibility.fixedempptax },
    { field: "fixedemprpf", headerName: "Fixed Empr_pf", width: 105, hide: !columnVisibility.fixedemprpf },
    { field: "fixedempresi", headerName: "Fixed Empr_Esi", width: 110, hide: !columnVisibility.fixedempresi },
    { field: "fixedshiftallowance", headerName: "Fixed Shift Allowance", width: 110, hide: !columnVisibility.fixedshiftallowance },
    { field: "fixedtotaldeductions", headerName: "Fixed Total Deductions", width: 120, hide: !columnVisibility.fixedtotaldeductions },
    { field: "fixedsalary", headerName: "Fixed Salary", width: 100, hide: !columnVisibility.fixedsalary },
    { field: "fixedsalarypenalty", headerName: "Fixed Salary + Penalty", width: 100, hide: !columnVisibility.fixedsalarypenalty },
    { field: "fixedlop", headerName: "Fixed-LOP", width: 100, hide: !columnVisibility.fixedlop },
    { field: "fixedlopdays", headerName: "Fixed LOP Days", width: 100, hide: !columnVisibility.fixedlopdays },
    { field: "fixedleavededuction", headerName: "Fixed Leave Deduction", width: 115, hide: !columnVisibility.fixedleavededuction },
    { field: "fixedctc", headerName: "Fixed CTC", width: 100, hide: !columnVisibility.fixedctc },
    { field: "fixedfinalvalue", headerName: "Fixed Final Value", width: 100, hide: !columnVisibility.fixedfinalvalue },
    { field: "fixedactualdeduction", headerName: "Fixed Actual Deduction", width: 115, hide: !columnVisibility.fixedactualdeduction },
    { field: "fixedminimumdeduction", headerName: "Fixed Minimum Deduction", width: 115, hide: !columnVisibility.fixedminimumdeduction },

    //PRODUCTION
    { field: "prodlossdeduction", headerName: "PROD Loss Deduction", width: 110, hide: !columnVisibility.prodlossdeduction },
    { field: "prodnetsalary", headerName: "PROD NET_Salary", width: 120, hide: !columnVisibility.prodnetsalary },
    { field: "prodbasicp", headerName: "PROD Basic", width: 100, hide: !columnVisibility.prodbasicp },
    { field: "prodhrap", headerName: "PROD HRA", width: 100, hide: !columnVisibility.prodhrap },
    { field: "prodconveyancep", headerName: "PROD Conveyance", width: 100, hide: !columnVisibility.prodconveyancep },
    { field: "prodmedicalallowancep", headerName: "PROD Medical Allowance", width: 115, hide: !columnVisibility.prodmedicalallowancep },
    { field: "prodproductionallowancep", headerName: "PROD Production Allowance", width: 120, hide: !columnVisibility.prodproductionallowancep },
    { field: "prodotherallowancep", headerName: "PROD Other Allowance", width: 115, hide: !columnVisibility.prodotherallowancep },
    { field: "prodnetsalaryonep", headerName: "PROD NET_Salary1", width: 110, hide: !columnVisibility.prodnetsalaryonep },
    { field: "prodemppf", headerName: "PROD Emp_pf", width: 100, hide: !columnVisibility.prodemppf },
    { field: "prodempesi", headerName: "PROD Emp_esi", width: 105, hide: !columnVisibility.prodempesi },
    { field: "prodempptax", headerName: "PROD Emp_tax", width: 110, hide: !columnVisibility.prodempptax },
    { field: "prodemprpf", headerName: "PROD Empr_pf", width: 105, hide: !columnVisibility.prodemprpf },
    { field: "prodempresi", headerName: "PROD Empr_Esi", width: 100, hide: !columnVisibility.prodempresi },
    { field: "prodshiftallowance", headerName: "PROD Shift_Allowance", width: 110, hide: !columnVisibility.prodshiftallowance },
    { field: "prodtotaldeductions", headerName: "PROD Total Deductions", width: 110, hide: !columnVisibility.prodtotaldeductions },
    { field: "prodsalary", headerName: "PROD Salary", width: 100, hide: !columnVisibility.prodsalary },
    { field: "prodsalarypenalty", headerName: "PROD Salary+Penalty", width: 100, hide: !columnVisibility.prodsalarypenalty },
    { field: "prodlopdays", headerName: "PROD LOP Days", width: 100, hide: !columnVisibility.prodlopdays },
    { field: "prodlop", headerName: "PROD LOP", width: 100, hide: !columnVisibility.prodlop },
    { field: "prodleavededuction", headerName: "PROD Leave Deduction", width: 110, hide: !columnVisibility.prodleavededuction },
    { field: "prodctc", headerName: "PROD CTC", width: 100, hide: !columnVisibility.prodctc },
    { field: "prodfinalvalue", headerName: "PROD Final Value", width: 100, hide: !columnVisibility.prodfinalvalue },
    { field: "prodactualdeduction", headerName: "PROD Actual Deduction", width: 110, hide: !columnVisibility.prodactualdeduction },
    { field: "prodminimumdeduction", headerName: "PROD Minimum Deduction", width: 110, hide: !columnVisibility.prodminimumdeduction },

    { field: "bankname", headerName: "Bank Name", width: 150, hide: !columnVisibility.bankname },
    { field: "accountname", headerName: "Account Name", width: 190, hide: !columnVisibility.accountname },
    { field: "accountnumber", headerName: "Account Number", width: 150, hide: !columnVisibility.accountnumber },
    { field: "ifsccode", headerName: "IFSC Code", width: 150, hide: !columnVisibility.ifsccode },

    // { field: "assignExpMode", headerName: "Mode", width:100, width: 100, hide: !columnVisibility.assignExpMode },
    // { field: "modevalue", headerName: "Value", width:100, width: 45, hide: !columnVisibility.modevalue },
    // { field: "modeexp", headerName: "Mode Exp", width:100, width: 50, hide: !columnVisibility.modeexp },

    // { field: "endexp", headerName: "End Exp", width:100, width: 45, hide: !columnVisibility.endexp },
    // { field: "endexpdate", headerName: "End-Exp Date", width:100, width: 80, hide: !columnVisibility.endexpdate },

    // { field: "endtar", headerName: "End Tar", width:100, width: 50, hide: !columnVisibility.endtar },
    // { field: "endtardate", headerName: "End-Tar Date", width:100, width: 80, hide: !columnVisibility.endtardate },
    // { field: "targetexp", headerName: "Target Exp", width:100, width: 50, hide: !columnVisibility.targetexp },

    // { field: "processcode", headerName: "Process Code", width:100, width: 90, hide: !columnVisibility.processcode },
    // { field: "salexp", headerName: "Salary Exp", width:100, width: 55, hide: !columnVisibility.salexp },

    // { field: "penaltyamt", headerName: "Penalty Amount", width:100, width: 90, hide: !columnVisibility.penaltyamt },

    { field: "uan", headerName: "UAN", width: 150, hide: !columnVisibility.uan },
    { field: "pfmembername", headerName: "pf Member Name", width: 150, hide: !columnVisibility.pfmembername },
    { field: "insuranceno", headerName: "Insurance No", width: 150, hide: !columnVisibility.insuranceno },
    { field: "ipname", headerName: "IP Name", width: 150, hide: !columnVisibility.ipname },

    { field: "currentmonthavg", headerName: `Current (${monthsArr[Number(selectedViewMonthNum) + 1 > 12 ? 0 : selectedViewMonthNum]}) Month Avg`, width: 130, hide: !columnVisibility.currentmonthavg },
    {
      field: "currentmonthattendance",
      headerName: `Current (${monthsArr[Number(selectedViewMonthNum) + 1 > 12 ? 0 : Number(selectedViewMonthNum)]}) Month Attendance`,

      width: 130,
      hide: !columnVisibility.currentmonthattendance,
    },

    { field: "paidstatus", headerName: "Paid Status", width: 140, hide: !columnVisibility.paidstatus },

    { field: "salarytype", headerName: "Salary Type", width: 140, hide: !columnVisibility.salarytype },
    { field: "deductiontype", headerName: "Deduction Type", width: 140, hide: !columnVisibility.deductiontype },
    {
      field: "actions",
      headerName: "Action",
      sortable: false,
      width: 100,
      filter: false,
      hide: !columnVisibility.actions,
      cellRenderer: ButtonCellRenderer,
    },
  ];
  const rowDataTable = currentData;
  // const rowDataTable = currentData.map((item, index) => {
  //   let allowancepointCalcVal = item.allowancepoint;
  //   let totalasbleaveCalcVal = item.totalasbleave;
  //   let targetPointCalcVaue = item.monthPoint;
  //   let AcheivedPointsCalcVal = item.acheivedpoints;
  //   let penaltyCalcVal = item.penalty;
  //   let totalpaiddaycalVal = item.totalpaidDays;
  //   let currMonAvgFinalcalVal = item.currentmonthavg;
  //   let currMonAttFinalcalVal = item.currentmonthattendance;
  //   let noshiftlogvalfinal = item.noallowancepoint;
  //   let shiftallowancetargetfinal = item.shiftallowancetarget;
  //   let nightAllowanceCalcVal = item.nightshiftallowance;

  //   return {
  //     //usersdatas
  //     ...item,
  //     id: item._id,
  //     outerId: item.outerId,
  //     serialNumber: item.serialNumber,
  //     company: item.company,
  //     branch: item.branch,
  //     unit: item.unit,
  //     team: item.team,
  //     empcode: item.empcode,
  //     companyname: item.companyname,
  //     legalname: item.legalname,
  //     doj: item.doj,
  //     designation: item.designation,
  //     department: item.department,
  //     processcode: item.processcode,
  //     prodexp: item.prodexp,
  //     processcodeexp: item.processcodeexp,
  //     experience: Number(item.experience),
  //     //need to fetch from users
  //     bankname: item.bankname,
  //     accountname: item.accountholdername,
  //     accountnumber: item.accountnumber,
  //     ifsccode: item.ifsccode,
  //     totalnumberofdays: Number(item.totalnumberofdays),
  //     totalshift: Number(item.totalshift),
  //     clsl: Number(item.clsl),
  //     weekoff: Number(item.weekoffcount),
  //     holiday: Number(item.holiday),
  //     totalasbleave: Number(totalasbleaveCalcVal),
  //     totalpaidDays: Number(totalpaiddaycalVal),

  //     //fetched from salary slab filter
  //     calcualted: item.calcualted,

  //     oldgross: Number(item.oldgross),
  //     oldbasic: Number(item.oldbasic),
  //     oldhra: Number(item.oldhra),
  //     oldconveyance: Number(item.oldconveyance),
  //     oldmedicalallowance: Number(item.oldmedicalallowance),
  //     oldproductionallowance: Number(item.oldproductionallowance),
  //     oldproductionallowancetwo: Number(item.oldproductionallowancetwo),
  //     oldotherallowance: Number(item.oldotherallowance),
  //     gross: Number(item.oldgross),

  //     newgross: Number(item.gross),
  //     actualbasic: Number(item.basic),
  //     actualhra: Number(item.hra),
  //     actualconveyance: Number(item.conveyance),
  //     actualmedicalallowance: Number(item.medicalallowance),
  //     actualproductionallowance: Number(item.productionallowance),
  //     actualproductionallowancetwo: Number(item.productionallowancetwo),
  //     actualotherallowance: Number(item.otherallowance),

  //     //need to fetch from daypoints upload
  //     targetpoints: Number(targetPointCalcVaue),
  //     acheivedpoints: Number(AcheivedPointsCalcVal),
  //     acheivedpercent: item.acheivedpercent,

  //     // actualpenalty: penaltyCalcVal,
  //     actualpenaltyamount: Number(item.penalty),
  //     penaltyamount: Number(item.penaltyamount),
  //     // penaltyamt: item.penalty,
  //     uan: item.uan,
  //     pfmembername: item.pfmembername,
  //     insuranceno: item.insurancenumber,
  //     ipname: item.ipname,
  //     noallowanceshift: Number(noshiftlogvalfinal),
  //     shiftallowancepoint: Number(allowancepointCalcVal),

  //     shiftallowancetarget: Number(shiftallowancetargetfinal),
  //     nightshiftallowance: Number(nightAllowanceCalcVal),

  //     era: item.eramount ? Number(item.eramount) : 0,

  //     revenueallow: item.revenueallow ? Number(item.revenueallow) : 0,
  //     shortage: item.shortage ? Number(item.shortage) : 0,

  //     endtar: item.endtar,
  //     endtardate: item.endtardate,
  //     endexp: item.endexp,
  //     endexpdate: item.endexpdate,

  //     assignExpMode: item.assignExpMode,
  //     modevalue: item.modevalue,

  //     targetexp: item.targetexp,
  //     prodexp: item.prodexp,
  //     modeexp: item.modeexp,
  //     processcode: item.processcode,

  //     processcodetar: item.processcodetar,

  //     salexp: item.salexp,

  //     monthPoint: Number(targetPointCalcVaue),
  //     dayPoint: Number(item.dayPoint),

  //     currentmonthavg: Number(currMonAvgFinalcalVal),
  //     currentmonthattendance: Number(currMonAttFinalcalVal),
  //     paidstatus: Number(item.paidstatus),

  //     //logs and value
  //     totalpaiddayslog: item.totalpaiddayslog,
  //     totalpaiddaycalVal1: item.totalpaiddaycalVal1,

  //     totalabsentlog: item.totalabsentlog,
  //     totalabsentcalVal1: item.totalabsentcalVal1,

  //     penaltylog: item.penaltylog,
  //     penaltylogcalVal1: item.penaltyCalVal1,

  //     targetpointlog: item.targetpointlog,
  //     targetpointcalVal1: item.targetpointCalVal1,

  //     acheivedpointlog: item.acheivedpointlog,
  //     acheivedpointcalVal1: item.acheivedpointCalVal1,

  //     shiftallowancelog: item.shiftallowancelog,
  //     shiftallowanceCalVal1: item.shiftallowanceCalVal1,

  //     currmonthavglog: item.currmonthavglog,
  //     currentmonthavgCalVal1: item.currentmonthavgCalVal1,

  //     currmonthattlog: item.currmonthattlog,
  //     currentmonthattCalVal1: item.currentmonthattCalVal1,

  //     noshiftlog: item.noshiftlog,
  //     noshiftlogCalVal1: item.noshiftlogCalVal1,

  //     shiftallowtargetlog: item.shiftallowtargetlog,
  //     shiftallowtargetlogCalVal1: item.shiftallowtargetlogCalVal1,

  //     nightshiftallowlog: item.nightshiftallowlog,
  //     nightshiftallowlogCalVal1: item.nightshiftallowlogCalVal1,

  //     selectedmonth: item.selectedmonth,
  //     selectedyear: item.selectedyear,

  //     achievedproductionallowance: Number(item.acheivedproductionallowance),
  //     actualnetsalary: Number(item.actualnetsalary),
  //     lopbasic: Number(item.lopbasic),
  //     lophra: Number(item.lophra),
  //     lopconveyance: Number(item.lopconveyance),
  //     lopmedicalallowance: Number(item.lopmedicalallowance),
  //     lopproductionallowance: Number(item.lopproductionallowance),
  //     lopotherallowance: Number(item.lopotherallowance),
  //     lopnetsalary: Number(item.lopnetsalary),
  //     prodbasic: Number(item.prodbasic),
  //     prodhra: Number(item.prodhra),
  //     prodconveyance: Number(item.prodconveyance),
  //     prodmedicalallowance: Number(item.prodmedicalallowance),
  //     prodproductionallowance: Number(item.prodproductionallowance),
  //     prodotherallowance: Number(item.prodotherallowance),
  //     attendancelop: Number(item.attendancelop),
  //     calculatednetsalary: Number(item.calculatednetsalary),
  //     actualpenaltyamount: Number(item.penalty),
  //     penaltyamount: Number(item.penaltyamount),
  //     lossdeduction: Number(item.lossdeduction),
  //     otherdeduction: Number(item.otherdeduction),
  //     finalbasic: Number(item.finalbasic),
  //     finalhra: Number(item.finalhra),
  //     finalconveyance: Number(item.finalconveyance),
  //     finalmedicalallowance: Number(item.finalmedicalallowance),
  //     finalproductionallowance: Number(item.finalproductionallowance),
  //     finalotherallowance: Number(item.finalotherallowance),
  //     finalnetsalary: Number(item.finalnetsalary),
  //     pfdays: Number(item.pfdays),
  //     ncpdays: Number(item.ncpdays),
  //     pfdeduction: Number(item.pfdeduction),
  //     esideduction: Number(item.esideduction),
  //     finallopdays: Number(item.finallopdays),
  //     paysliplop: Number(item.paysliplop),
  //     finalleavededuction: Number(item.finalleavededuction),
  //     professionaltax: Number(item.professionaltax),
  //     totaldeductions: Number(item.totaldeductions),
  //     uan: item.uan,
  //     ipname: item.ipname,
  //     noallowanceshift: Number(item.noallowancepoint),
  //     shiftallowancepoint: Number(item.allowancepoint),
  //     shiftallowancetarget: Number(item.shiftallowancetarget),
  //     nightshiftallowance: Number(item.nightshiftallowance),
  //     finalsalary: Number(item.finalsalary),
  //     finalsalarypenalty: Number(item.finalsalarypenalty),
  //     totalpointsvalue: Number(item.totalpointsvalue),
  //     era: Number(item.eramount),
  //     actualera: Number(item.era),
  //     pfemployerdeduction: Number(item.pfemployerdeduction),
  //     esiemployerdeduction: Number(item.esiemployerdeduction),
  //     ctc: Number(item.ctc),
  //     revenueallowance: Number(item.revenueallow),
  //     finalvalue: Number(item.finalvalue),
  //     finalvaluetwo: Number(item.finalvaluetwo),
  //     finalvaluepenalty: Number(item.finalvaluepenalty),
  //     shortage: Number(item.shortage),
  //     shortageone: Number(item.shortageone),
  //     actualdeduction: Number(item.actualdeduction),
  //     minimumdeduction: Number(item.minimumdeduction),
  //     finalvaluereview: item.finalvaluereview,
  //     finalvaluestatus: item.finalvaluestatus,
  //     finalvaluepenaltystatus: item.finalvaluepenaltystatus,

  //     //FIXED
  //     fixedlossdeduction: item.fixedlossdeduction,
  //     fixednetsalary: item.fixednetsalary,
  //     fixedbasic: item.fixedbasic,
  //     fixedhra: item.fixedhra,
  //     fixedconveyance: item.fixedconveyance,
  //     fixedmedicalallowance: item.fixedmedicalallowance,
  //     fixedproductionallowance: item.fixedproductionallowance,
  //     fixedotherallowance: item.fixedotherallowance,
  //     fixednetsalaryone: item.fixednetsalaryone,
  //     fixedemppf: item.fixedemppf,
  //     fixedempesi: item.fixedempesi,
  //     fixedempptax: item.fixedempptax,
  //     fixedemprpf: item.fixedemprpf,
  //     fixedempresi: item.fixedempresi,
  //     fixedshiftallowance: item.fixedshiftallowance,
  //     fixedtotaldeductions: item.fixedtotaldeductions,
  //     fixedsalary: item.fixedsalary,
  //     fixedsalarypenalty: item.fixedsalarypenalty,
  //     fixedlop: item.fixedlop,
  //     fixedlopdays: item.fixedlopdays,
  //     fixedleavededuction: item.fixedleavededuction,
  //     fixedctc: item.fixedctc,
  //     fixedfinalvalue: item.fixedfinalvalue,
  //     fixedactualdeduction: item.fixedactualdeduction,
  //     fixedminimumdeduction: item.fixedminimumdeduction,

  //     //PRODUCTION
  //     prodlossdeduction: item.prodlossdeduction,
  //     prodnetsalary: item.prodnetsalary,
  //     prodbasicp: item.prodbasicp,
  //     prodhrap: item.prodhrap,
  //     prodconveyancep: item.prodconveyancep,
  //     prodmedicalallowancep: item.prodmedicalallowancep,
  //     prodproductionallowancep: item.prodproductionallowancep,
  //     prodotherallowancep: item.prodotherallowancep,
  //     prodnetsalaryonep: item.prodnetsalaryonep,
  //     prodemppf: item.prodemppf,
  //     prodempesi: item.prodempesi,
  //     prodempptax: item.prodempptax,
  //     prodemprpf: item.prodemprpf,
  //     prodempresi: item.prodempresi,
  //     prodshiftallowance: item.prodshiftallowance,
  //     prodtotaldeductions: item.prodtotaldeductions,
  //     prodsalary: item.prodsalary,
  //     prodsalarypenalty: item.prodsalarypenalty,
  //     prodlopdays: item.prodlopdays,
  //     prodlop: item.prodlop,
  //     prodleavededuction: item.prodleavededuction,
  //     prodctc: item.prodctc,
  //     prodfinalvalue: item.prodfinalvalue,
  //     prodactualdeduction: item.prodactualdeduction,
  //     prodminimumdeduction: item.prodminimumdeduction,

  //     currentmonthavg: item.currentmonthavg,
  //     currentmonthattendance: item.currentmonthattendance,
  //     paidstatus: item.paidstatus,

  //     salarytype: item.salarytype,
  //     deductiontype: item.deductiontype,
  //   };
  // });

  const [viewMonth, setviewMonth] = useState("");
  const [viewYear, setviewYear] = useState("");

  const context = {
    profTaxMaster,
    shifts,
    payruncontrolmaster,
    monthsArr,
    departmentsList,
    salSlabs,
    eraAmounts,
    acPointCal,
    attModearr,
    attStatus,
    manageshortagemasters,
    revenueAmount,
    viewMonth,
    viewYear,
    attCtrlCriteria,
    targetPoints,
    attStatusOption,
    fetchPayRunList,
  };

  // Show All Columns functionality
  const handleShowAllColumns = () => {
    const updatedVisibility = { ...columnVisibility };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibility(updatedVisibility);
  };

  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem("columnVisibility");
    if (savedVisibility) {
      setColumnVisibility(JSON.parse(savedVisibility));
    }
  }, []);

  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  useEffect(() => {
    setColumnVisibility(initialColumnVisibility);
  }, []);

  // // Function to filter columns based on search query
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
    <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
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

  //department multiselect dropdown changes
  const handleDepartmentChange = (options) => {
    setSelectedDepartment(options);
  };

  const customValueRendererDepartment = (valueCate, _employeename) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Department";
  };

  //department multiselect dropdown changes
  const handleDepartmentChangeFilter = (options) => {
    setSelectedDepartmentFilter(options);
  };

  const customValueRendererDepartmentFilter = (valueCate, _employeename) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Department";
  };
  const getattendancestatus = (alldata) => {
    let result = attStatus.filter((data, index) => {
      return data?.clockinstatus === alldata?.clockinstatus && data?.clockoutstatus === alldata?.clockoutstatus;
    });
    return result[0]?.name;
  };

  const getAttModeAppliedThr = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus;
    });
    return result[0]?.appliedthrough;
  };

  const getAttModeLop = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus;
    });
    return result[0]?.lop === true ? "Yes" : "No";
  };

  const getAttModeLopType = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus;
    });
    return result[0]?.loptype;
  };

  const getFinalLop = (rowlop, rowloptype) => {
    return rowloptype === undefined || rowloptype === "" ? rowlop : rowlop + " - " + rowloptype;
  };

  const getAttModeTarget = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus;
    });
    return result[0]?.target === true ? "Yes" : "No";
  };

  const getAttModePaidPresent = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus;
    });
    return result[0]?.paidleave === true ? "Yes" : "No";
  };

  const getAttModePaidPresentType = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus;
    });
    return result[0]?.paidleavetype;
  };

  const getFinalPaid = (rowpaid, rowpaidtype) => {
    return rowpaidtype === undefined || rowpaidtype === "" ? rowpaid : rowpaid + " - " + rowpaidtype;
  };

  const getAssignLeaveDayForLop = (rowlopday) => {
    if (rowlopday === "Yes - Double Day") {
      return "2";
    } else if (rowlopday === "Yes - Full Day") {
      return "1";
    } else if (rowlopday === "Yes - Half Day") {
      return "0.5";
    } else {
      return "0";
    }
  };

  const getAssignLeaveDayForPaid = (rowpaidday) => {
    if (rowpaidday === "Yes - Double Day") {
      return "2";
    } else if (rowpaidday === "Yes - Full Day") {
      return "1";
    } else if (rowpaidday === "Yes - Half Day") {
      return "0.5";
    } else {
      return "0";
    }
  };
  const getCount = (rowlopstatus) => {
    if (rowlopstatus === "Yes - Double Day") {
      return "2";
    } else if (rowlopstatus === "Yes - Full Day") {
      return "1";
    } else if (rowlopstatus === "Yes - Half Day") {
      return "0.5";
    } else {
      return "0";
    }
  };

  const [alertMsg, setAlertMsg] = useState(false);
  const [alert, setAlert] = useState("");

  const handleProgressUpdate = (val, sts) => {
    setAlert(Number(val));
    setAlertMsg(sts);
  };

  //Dialog open
  const [isLoaderDialog, setIsLoaderDialog] = useState(false);

  const handleLoaderDialogOpen = (val, reason) => {
    setIsLoaderDialog(true);
  };
  const handleLoaderDialogClose = (event, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsLoaderDialog(false);
  };

  const fetchApiData = async (month, monthnum, year) => {
    try {
      const [prodFilter, prodFilterNxt, penaltyFilter, Res, res_employee, res_employeeNxt] = await Promise.all([
        axios.post(SERVICE.DAY_POINTS_MONTH_YEAR_FILTER, {
          headers: { Authorization: `Bearer ${auth.APIToken}` },
          ismonth: Number(monthnum),
          isyear: Number(year),
        }),
        axios.post(SERVICE.DAY_POINTS_MONTH_YEAR_FILTER_NXTMONTH, {
          headers: { Authorization: `Bearer ${auth.APIToken}` },
          ismonth: Number(monthnum) + 1 > 12 ? 1 : Number(monthnum) + 1,
          isyear: Number(monthnum) + 1 > 12 ? Number(year) + 1 : Number(year),
        }),
        axios.post(SERVICE.PENALTY_DAY_FILTERED, {
          headers: { Authorization: `Bearer ${auth.APIToken}` },
          ismonth: Number(monthnum),
          isyear: Number(year),
        }),
        axios.post(SERVICE.PAIDSTATUSFIX_LIMITED, {
          headers: { Authorization: `Bearer ${auth.APIToken}` },
          month: month,
          year: year,
        }),
        axios.post(SERVICE.DEPTMONTHSET_LIMITED, {
          headers: { Authorization: `Bearer ${auth.APIToken}` },
          monthname: month,
          year: year,
        }),
        axios.post(SERVICE.DEPTMONTHSET_LIMITED, {
          headers: { Authorization: `Bearer ${auth.APIToken}` },
          monthname: Number(monthnum) + 1 > 12 ? "January" : monthsArr[monthnum],
          year: Number(monthnum) + 1 > 12 ? String(Number(year) + 1) : year,
        }),
      ]);

      return {
        dayPointsUser: prodFilter.data.answer,
        dayPointsUserNxtMonth: prodFilterNxt.data.answer,
        dayPenaltyUser: penaltyFilter.data.answer,
        paidStatusFix: Res?.data?.paidstatusfixs,
        monthSets: res_employee.data.departmentdetails,
        monthSetsNxt: res_employeeNxt.data.departmentdetails,
      };
    } catch (err) {
      handleLoaderDialogClose();
      console.error("Error fetching API data:", err.response?.data?.message || err);
      throw err;
    }
  };
  const processEmployeeItem = async (item, index, data, finalresult, finalresultNxt) => {
    try {
      let dayPointsUser = data.dayPointsUser;
      let dayPointsUserNxtMonth = data.dayPointsUserNxtMonth;
      let dayPenaltyUser = data.dayPenaltyUser;
      let paidStatusFix = data.paidStatusFix;

      let monthSets = data.monthSets;
      let monthSetsNxt = data.monthSetsNxt;
      let bankDetails = item.bankdetails.find((d) => d.accountstatus === "Active");
      // console.log(bankDetails, "3", index)
      let findTotalNoOfDays = finalresult.find((d) => d.company === item.company && d.branch === item.branch && d.unit === item.unit && d.username === item.companyname);
      let findTotalNoOfDaysNxtMonth = finalresultNxt.find((d) => d.company === item.company && d.branch === item.branch && d.unit === item.unit && d.username === item.companyname);

      const groupedByMonth = {};

      // Group items by month
      item.assignExpLog &&
        item.assignExpLog.length > 0 &&
        item.assignExpLog
          .filter((d) => d.expmode !== "Auto")
          .sort((a, b) => {
            return new Date(a.updatedate) - new Date(b.updatedate);
          })
          .forEach((item) => {
            const monthYear = item.updatedate?.split("-").slice(0, 2).join("-");
            if (!groupedByMonth[monthYear]) {
              groupedByMonth[monthYear] = [];
            }
            groupedByMonth[monthYear].push(item);
          });

      // Extract the last item of each group
      const lastItemsForEachMonth = Object.values(groupedByMonth).map((group) => group[group.length - 1]);

      // Filter the data array based on the month and year
      // lastItemsForEachMonth.sort((a, b) => {
      //   return new Date(a.updatedate) - new Date(b.updatedate);
      // });
      // Find the first item in the sorted array that meets the criteria
      let filteredDataMonth = null;
      for (let i = 0; i < lastItemsForEachMonth.length; i++) {
        const date = lastItemsForEachMonth[i]?.updatedate;
        const splitedDate = date?.split("-");
        const itemYear = splitedDate ? splitedDate[0] : -1;
        const itemMonth = splitedDate ? splitedDate[1] : -1; // Adding 1 because getMonth() returns 0-indexed month
        if (Number(itemYear) === Number(selectedYear) && Number(itemMonth) === Number(selectedMonthNum)) {
          filteredDataMonth = lastItemsForEachMonth[i];
          break;
        } else if (Number(itemYear) < Number(selectedYear) || (Number(itemYear) === Number(selectedYear) && Number(itemMonth) <= Number(selectedMonthNum))) {
          filteredDataMonth = lastItemsForEachMonth[i]; // Keep updating the filteredDataMonth until the criteria is met
        } else {
          break; // Break the loop if we encounter an item with year and month greater than selected year and month
        }
      }

      // let modevalue = item.assignExpLog[item.assignExpLog.length - 1];
      let modevalue = filteredDataMonth;

      let selectedmonthnumalter = Number(selectedMonthNum) <= 9 ? `0${Number(selectedMonthNum)}` : selectedMonthNum;

      let selectedMonStartDate = selectedYear + "-" + selectedmonthnumalter + "-01";

      let findexp = monthSets.find((d) => d.department === item.department);
      let findexpNxt = monthSetsNxt.find((d) => d.department === item.department);

      let findDate = findexp ? findexp.fromdate : selectedMonStartDate;

      //FIND SELECTEDMONTH MONTH END DATE
      const nextMonthFirstDay = new Date(Number(selectedYear), Number(selectedMonthNum), 1);

      // Subtract one day to get the last day of the given month
      const lastDate = new Date(nextMonthFirstDay - 1);

      let lastdateOfSelectedMonth = lastDate.getDate();
      let selectedMonEndDate = `${selectedYear}-${selectedmonthnumalter}-${lastdateOfSelectedMonth}`;
      let findmonthenddate = findexp ? findexp.todate : selectedMonEndDate;

      const thisMonthEndDate = findexp ? findexp.todate : selectedMonEndDate;

      //NEXT MONTH MONTH START AND END DATE

      let selectedmonthnumalterNxt = Number(selectedMonthNum) + 1 > 12 ? "01" : Number(selectedMonthNum) + 1 <= 9 ? `0${Number(selectedMonthNum) + 1}` : Number(selectedMonthNum) + 1;

      let Nxtmonth = Number(selectedMonthNum) + 1 > 12 ? 1 : Number(selectedMonthNum) + 1;
      let Nxtyear = Number(selectedMonthNum) + 1 > 12 ? Number(selectedYear) + 1 : selectedYear;

      const NxtnextMonthFirstDay = new Date(Number(Nxtyear), Number(Nxtmonth), 1);

      // Subtract one day to get the last day of the given month
      const lastDateNxtNextmonth = new Date(NxtnextMonthFirstDay - 1);

      let lastdateOfNxtSelectedMonth = lastDateNxtNextmonth.getDate();

      let selectedMonNxtStartDate = `${Nxtyear}-${selectedmonthnumalterNxt}-01`;

      let selectedMonNxtEndDate = `${Nxtyear}-${selectedmonthnumalterNxt}-${lastdateOfNxtSelectedMonth}`;

      let findNxtStartDate = findexpNxt ? findexpNxt.fromdate : selectedMonNxtStartDate;
      let findNxtEndDate = findexpNxt ? findexpNxt.todate : selectedMonNxtEndDate;

      const calculateMonthsBetweenDates = (startDate, endDate) => {
        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);

          let years = end.getFullYear() - start.getFullYear();
          let months = end.getMonth() - start.getMonth();
          let days = end.getDate() - start.getDate();

          // Convert years to months
          months += years * 12;

          // Adjust for negative days
          if (days < 0) {
            months -= 1; // Subtract a month
            days += new Date(end.getFullYear(), end.getMonth(), 0).getDate(); // Add days of the previous month
          }

          // Adjust for days 15 and above
          if (days >= 15) {
            months += 1; // Count the month if 15 or more days have passed
          }

          return months <= 0 ? 0 : months;
        }

        return 0; // Return 0 if either date is missing
      };

      // Calculate difference in months between findDate and item.doj
      let differenceInMonths, differenceInMonthsexp, differenceInMonthstar;
      if (modevalue) {
        //findexp end difference yes/no
        if (modevalue.endexp === "Yes") {
          differenceInMonthsexp = calculateMonthsBetweenDates(item.doj, modevalue.endexpdate);
          //  Math.floor((new Date(modevalue.endexpdate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
          if (modevalue.expmode === "Add") {
            differenceInMonthsexp += parseInt(modevalue.expval);
          } else if (modevalue.expmode === "Minus") {
            differenceInMonthsexp -= parseInt(modevalue.expval);
          } else if (modevalue.expmode === "Fix") {
            differenceInMonthsexp = parseInt(modevalue.expval);
          }
        } else {
          differenceInMonthsexp = calculateMonthsBetweenDates(item.doj, findDate);
          // Math.floor((new Date(findDate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
          if (modevalue.expmode === "Add") {
            differenceInMonthsexp += parseInt(modevalue.expval);
          } else if (modevalue.expmode === "Minus") {
            differenceInMonthsexp -= parseInt(modevalue.expval);
          } else if (modevalue.expmode === "Fix") {
            differenceInMonthsexp = parseInt(modevalue.expval);
          } else {
            // differenceInMonths = parseInt(modevalue.expval);
            differenceInMonthsexp = calculateMonthsBetweenDates(item.doj, findDate);
          }
        }

        //findtar end difference yes/no
        if (modevalue.endtar === "Yes") {
          differenceInMonthstar = calculateMonthsBetweenDates(item.doj, modevalue.endtardate);
          //  Math.floor((new Date(modevalue.endtardate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
          if (modevalue.expmode === "Add") {
            differenceInMonthstar += parseInt(modevalue.expval);
          } else if (modevalue.expmode === "Minus") {
            differenceInMonthstar -= parseInt(modevalue.expval);
          } else if (modevalue.expmode === "Fix") {
            differenceInMonthstar = parseInt(modevalue.expval);
          }
        } else {
          differenceInMonthstar = calculateMonthsBetweenDates(item.doj, findDate);
          if (modevalue.expmode === "Add") {
            differenceInMonthstar += parseInt(modevalue.expval);
          } else if (modevalue.expmode === "Minus") {
            differenceInMonthstar -= parseInt(modevalue.expval);
          } else if (modevalue.expmode === "Fix") {
            differenceInMonthstar = parseInt(modevalue.expval);
          } else {
            // differenceInMonths = parseInt(modevalue.expval);
            differenceInMonthstar = calculateMonthsBetweenDates(item.doj, findDate);
          }
        }

        differenceInMonths = calculateMonthsBetweenDates(item.doj, findDate);
        if (modevalue.expmode === "Add") {
          differenceInMonths += parseInt(modevalue.expval);
        } else if (modevalue.expmode === "Minus") {
          differenceInMonths -= parseInt(modevalue.expval);
        } else if (modevalue.expmode === "Fix") {
          differenceInMonths = parseInt(modevalue.expval);
        } else {
          // differenceInMonths = parseInt(modevalue.expval);
          differenceInMonths = calculateMonthsBetweenDates(item.doj, findDate);
        }
      } else {
        differenceInMonthsexp = calculateMonthsBetweenDates(item.doj, findDate);
        differenceInMonthstar = calculateMonthsBetweenDates(item.doj, findDate);
        differenceInMonths = calculateMonthsBetweenDates(item.doj, findDate);
      }

      //GET PROCESS CODE FUNCTION
      const groupedByMonthProcs = {};

      // Group items by month
      item.processlog &&
        item.processlog
          .sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
          })
          .forEach((item) => {
            const monthYear = item.date?.split("-")?.slice(0, 2).join("-");
            if (!groupedByMonthProcs[monthYear]) {
              groupedByMonthProcs[monthYear] = [];
            }
            groupedByMonthProcs[monthYear].push(item);
          });

      // Extract the last item of each group
      const lastItemsForEachMonthPros = Object.values(groupedByMonthProcs).map((group) => group[group.length - 1]);

      // Filter the data array based on the month and year
      // lastItemsForEachMonthPros.sort((a, b) => {
      //   return new Date(a.date) - new Date(b.date);
      // });
      const totaluserDays = (new Date(thisMonthEndDate) - new Date(item.doj)) / (1000 * 60 * 60 * 24);
      const totaluserDaysNxtMonth = (new Date(findNxtEndDate) - new Date(item.doj)) / (1000 * 60 * 60 * 24);
      // Find the first item in the sorted array that meets the criteria
      let filteredItem = null;
      let filteredItemNxtMonth = null;
      for (let i = 0; i < lastItemsForEachMonthPros.length; i++) {
        const date = lastItemsForEachMonthPros[i].date;

        if (findDate >= date) {
          filteredItem = lastItemsForEachMonthPros[i];
        } else if (thisMonthEndDate >= date && totaluserDays < 31) {
          filteredItem = lastItemsForEachMonthPros[i];
        } else {
          break;
        }
      }
      for (let i = 0; i < lastItemsForEachMonthPros.length; i++) {
        const date = lastItemsForEachMonthPros[i].date;

        if (findNxtStartDate >= date) {
          filteredItemNxtMonth = lastItemsForEachMonthPros[i];
        } else if (findNxtEndDate >= date && totaluserDaysNxtMonth < 31) {
          filteredItem = lastItemsForEachMonthPros[i];
        } else {
          break;
        }
      }

      let getprocessCode = filteredItem ? filteredItem.process : "";

      // let procCodecheck = item.doj ? getprocessCode + (differenceInMonthsexp > 0 ? (differenceInMonthsexp <= 9 ? `0${differenceInMonthsexp}` : differenceInMonthsexp) : 0) : "";
      let processcodeexpvalue = item.doj && modevalue && modevalue.expmode === "Manual" ? modevalue.salarycode : item.doj ? getprocessCode + (differenceInMonthstar > 0 ? (differenceInMonthstar <= 9 ? `0${differenceInMonthstar}` : differenceInMonthstar) : "00") : "";
      let processcodeexpvaluesalary = item.doj && modevalue && modevalue.expmode === "Manual" ? modevalue.salarycode : item.doj ? getprocessCode + (differenceInMonthsexp > 0 ? (differenceInMonthsexp <= 9 ? `0${differenceInMonthsexp}` : differenceInMonthsexp) : "00") : "";

      let getprocessCodeNxtMonth = filteredItemNxtMonth ? filteredItemNxtMonth.process : "";

      let processcodeexpvalueNxtMonth = item.doj && modevalue && modevalue.expmode === "Manual" ? modevalue.salarycode : item.doj ? getprocessCodeNxtMonth + (differenceInMonthstar > 0 ? (differenceInMonthstar <= 9 ? `0${differenceInMonthstar}` : differenceInMonthstar) : "00") : "";

      let CHECK_DEPARTMENT_ACCESS = departmentsList.find((d) => d.deptname === item.department);

      //findsalary from salaryslab
      let findSalDetails =
        modevalue && modevalue.expmode === "Manual"
          ? {
            basic: modevalue.basic,
            hra: modevalue.hra,
            conveyance: modevalue.conveyance,
            gross: modevalue.gross,
            medicalallowance: modevalue.medicalallowance,
            productionallowance: modevalue.productionallowance,
            otherallowance: modevalue.otherallowance,
            productionallowancetwo: modevalue.productionallowancetwo,
          }
          : salSlabs.find((d) => d.company === item.company && d.branch === item.branch && d.salarycode === processcodeexpvaluesalary);
      //shortageamount from shortage master
      let findShortage = manageshortagemasters.find((d) => d.department === item.department && differenceInMonths >= Number(d.from) && differenceInMonths <= Number(d.to));
      //revenue amount from revenue  master
      let findRevenueAllow = revenueAmount.find((d) => d.company === item.company && d.branch === item.branch && d.processcode === processcodeexpvaluesalary);
      //finderaamount from eraamount
      let findERAaountValue = eraAmounts.find((d) => d.company === item.company && d.branch === item.branch && d.processcode === processcodeexpvaluesalary);

      let findAcPointVal = acPointCal.find((d) => d.company === item.company && d.branch === item.branch && d.department === item.department);

      let totalShiftTrgt = findTotalNoOfDays ? Number(findTotalNoOfDays.shift) : 0;
      let totalWeekoffTrgt = findTotalNoOfDays ? Number(findTotalNoOfDays.weekoff) : 0;
      let totalWeekoffall = findTotalNoOfDays ? Number(findTotalNoOfDays.weekoffall) : 0;

      let totalShiftTrgtNxt = findTotalNoOfDaysNxtMonth ? Number(findTotalNoOfDaysNxtMonth.shift) : 0;
      let totalWeekoffTrgtNxt = findTotalNoOfDaysNxtMonth ? Number(findTotalNoOfDaysNxtMonth.weekoff) : 0;
      let totalWeekoffallNxt = findTotalNoOfDaysNxtMonth ? Number(findTotalNoOfDaysNxtMonth.weekoffall) : 0;

      // let findTarDetails = targetPoints.filter((d) => d.processcode === processcodeexpvalue).find((tr) => item.branch === tr.branch && item.company === tr.company && tr.processcode === processcodeexpvalue);

      // let findTargetVal = findTarDetails ? Number(findTarDetails.points) : 0;

      // let findTarDetailsNxtMonth = targetPoints.filter((d) => d.processcode === processcodeexpvalueNxtMonth).find((tr) => item.branch === tr.branch && item.company === tr.company && tr.processcode === processcodeexpvalueNxtMonth);

      // let findTargetValNxtMonth = findTarDetailsNxtMonth ? Number(findTarDetailsNxtMonth.points) : 0;
      const isHadreasondate = item.reasondate != "" && item.reasondate != undefined;

      const enddateproduction = isHadreasondate ? item.reasondate : findexp ? findexp.todate : selectedMonEndDate;

      //GET POINTS FOR SELECTEDMONTH
      let getdayPointsMonth = dayPointsUser
        .filter(
          (d) =>
            // console.log(   d.date , findDate , d.date , (findexp ? findexp.todate : selectedMonEndDate))
            d.date >= findDate && d.date <= enddateproduction && d.name === item.companyname
        )
        .reduce((acc, current) => {
          const existingItemIndex = acc.findIndex((item) => item.name === current.name && item.companyname === current.companyname && item.branch === current.branch && item.empcode === current.empcode);

          if (existingItemIndex !== -1) {
            // Update existing item
            const existingItem = acc[existingItemIndex];

            existingItem.point += Number(current.point);
            // existingItem.pointarray +=[ Number(current.point)];

            // existingItem.daypoint += Number(current.daypoint);
            existingItem.target += current.weekoff == "Not Allotted" || current.weekoff == "Not Allot" || current.weekoff == "" || current.weekoff == "Week Off" || current.daypointsts === "WEEKOFF" ? 0 : Number(current.target);
            // existingItem.weekoffcount += current.weekoff == "Not Allotted" || current.weekoff == "Not Allot" || current.weekoff == "" || current.weekoff == "Week Off" || current.daypointsts === "WEEKOFF" ? 1 : 0;
            existingItem.date.push(current.date);
            // existingItem.pointarray.push(current.weekoff == "Not Allotted" || current.weekoff == "Not Allot" || current.weekoff == "" || current.weekoff == "Week Off" || current.daypointsts === "WEEKOFF" ? 0 : Number(current.target));

            existingItem.allowancepoint += current.conshiftpoints && current.shiftsts === "Enable" ? Number(current.conshiftpoints) : current.allowancepoint ? Number(current.allowancepoint) : 0;

            if (current.shiftsts === "Enable" || current.allowancepoint >= 1) {
              existingItem.noallowancepoint++; // Increment count only if allowancepoint is present
            }

            existingItem.avgpoint = existingItem.target > 0 ? (existingItem.point / existingItem.target) * 100 : 0;
            existingItem.allowancetarget += current.shiftsts === "Enable" ? Number(current.target) : 0;
            // Convert the dates array to Date objects
            const dateObjects = existingItem.date.map((date) => new Date(date));

            // Find the earliest (from) and latest (to) dates
            const fromDate = new Date(Math.min(...dateObjects));
            const toDate = new Date(Math.max(...dateObjects));
            // Update start and end date
            existingItem.startDate = fromDate;
            existingItem.endDate = toDate;
          } else {
            // Add new item
            acc.push({
              companyname: current.companyname,
              name: current.name,
              // daypoint: Number(current.daypoint),
              avgpoint: (Number(current.point) / Number(current.target)) * 100,
              point: Number(current.point),
              target: current.weekoff == "Not Allotted" || current.weekoff == "Not Allot" || current.weekoff == "" || current.weekoff == "Week Off" || current.daypointsts === "WEEKOFF" ? 0 : Number(current.target),
              // _id: current.id,
              branch: current.branch,
              date: [current.date],
              unit: current.unit,
              team: current.team,
              empcode: current.empcode,
              // weekoffcount: current.weekoff == "Not Allotted" || current.weekoff == "Not Allot" || current.weekoff == "" || current.weekoff == "Week Off" || current.daypointsts === "WEEKOFF" ? 1 : 0,
              // doj: current.doj,
              // department: current.department,
              // prod: current.prod,
              startDate: current.date,
              endDate: current.date,
              allowancetarget: current.shiftsts === "Enable" ? Number(current.target) : 0,
              // pointarray: [current.weekoff == "Not Allotted" || current.weekoff == "Not Allot" || current.weekoff == "" || current.weekoff == "Week Off"  || current.daypointsts === "WEEKOFF" ? 0 : Number(current.target)],
              allowancepoint: current.conshiftpoints && current.shiftsts === "Enable" ? Number(current.conshiftpoints) : current.allowancepoint ? Number(current.allowancepoint) : 0,

              noallowancepoint: current.shiftsts === "Enable" || current.allowancepoint >= 1 ? 1 : 0,
            });
          }
          return acc;
        }, []);

      let findPointsDetails = getdayPointsMonth.find((d) => d.companyname === item.company && d.branch === item.branch && d.unit === item.unit && d.name === item.companyname);
      const enddateproductionnxtmonth = isHadreasondate ? item.reasondate : findNxtEndDate;

      //GET POINTS FOR CURRENT MONTH WHICH IS THE AFTER MONTH OF SELECTED MONTH
      let getdayPointsMonthNxtMonth = dayPointsUserNxtMonth
        .filter(
          (d) =>
            // console.log(   d.date , findDate , d.date , (findexp ? findexp.todate : selectedMonEndDate))
            d.date >= findNxtStartDate && d.date <= findNxtEndDate && d.name === item.companyname
        )
        .reduce((acc, current) => {
          const existingItemIndex = acc.findIndex((item) => item.name === current.name && item.companyname === current.companyname && item.branch === current.branch && item.empcode === current.empcode);

          if (existingItemIndex !== -1) {
            // Update existing item
            const existingItem = acc[existingItemIndex];

            existingItem.point += Number(current.point);
            // existingItem.daypoint += Number(current.daypoint);
            // existingItem.target = Number(findTargetValNxtMonth) * existingItem.date.length;
            existingItem.target += current.weekoff == "Not Allotted" || current.weekoff == "Not Allot" || current.weekoff == "" || current.weekoff == "Week Off" || current.daypointsts === "WEEKOFF" ? 0 : Number(current.target);

            existingItem.date.push(current.date);

            existingItem.allowancepoint += current.conshiftpoints && current.shiftsts === "Enable" ? Number(current.conshiftpoints) : current.allowancepoint ? Number(current.allowancepoint) : 0;
            if ((current.conshiftpoints >= 1 && current.shiftsts === "Enable") || current.allowancepoint >= 1) {
              existingItem.noallowancepoint++; // Increment count only if allowancepoint is present
            }

            existingItem.avgpoint = existingItem.target > 0 ? (existingItem.point / existingItem.target) * 100 : 0;

            // Convert the dates array to Date objects
            const dateObjects = existingItem.date.map((date) => new Date(date));

            // Find the earliest (from) and latest (to) dates
            const fromDate = new Date(Math.min(...dateObjects));
            const toDate = new Date(Math.max(...dateObjects));
            // Update start and end date
            existingItem.startDate = fromDate;
            existingItem.endDate = toDate;
          } else {
            // Add new item
            acc.push({
              companyname: current.companyname,
              name: current.name,
              // daypoint: Number(current.daypoint),
              avgpoint: (Number(current.point) / Number(current.target)) * 100,
              point: Number(current.point),
              target: current.weekoff == "Not Allotted" || current.weekoff == "Not Allot" || current.weekoff == "" || current.weekoff == "Week Off" || current.daypointsts === "WEEKOFF" ? 0 : Number(current.target),
              // _id: current.id,
              branch: current.branch,
              date: [current.date],
              unit: current.unit,
              team: current.team,
              empcode: current.empcode,

              startDate: current.date,
              endDate: current.date,
              allowancepoint: current.conshiftpoints && current.shiftsts === "Enable" ? Number(current.conshiftpoints) : current.allowancepoint ? Number(current.allowancepoint) : 0,
              // noallowancepoint:Number(current.noallowancepoint),
              noallowancepoint: (current.conshiftpoints && current.shiftsts === "Enable" ? Number(current.conshiftpoints) : current.allowancepoint ? Number(current.allowancepoint) : 0) > 0 ? 1 : 0,
            });
          }
          return acc;
        }, []);

      let findPointsDetailsNxtMonth = getdayPointsMonthNxtMonth.find(
        (d) => d.companyname == item.company && d.branch == item.branch && d.unit == item.unit && d.name == item.companyname
        // && d.empcode === item.empcode
      );
      // console.log(findPointsDetailsNxtMonth,'findPointsDetailsNxtMonth')
      // console.log(dayPointsUserNxtMonth, findPointsDetailsNxtMonth, findNxtStartDate, findNxtEndDate, 'dayPointsUserNxtMonth');

      let getdayPenaltyMonth = dayPenaltyUser
        .filter((d) => d.date >= findDate && d.date <= (findexp ? findexp.todate : selectedMonEndDate))
        .reduce((acc, current) => {
          const existingItemIndex = acc.findIndex((item) => item.name === current.name && item.company === current.company && item.branch === current.branch && item.empcode === current.empcode);

          if (existingItemIndex !== -1) {
            // Update existing item
            const existingItem = acc[existingItemIndex];

            existingItem.amount += Number(current.amount);

            existingItem.date.push(current.date);

            // Convert the dates array to Date objects
            const dateObjects = existingItem.date.map((date) => new Date(date));

            // Find the earliest (from) and latest (to) dates
            const fromDate = new Date(Math.min(...dateObjects));
            const toDate = new Date(Math.max(...dateObjects));
            // Update start and end date
            existingItem.startDate = fromDate;
            existingItem.endDate = toDate;
          } else {
            // Add new item
            acc.push({
              company: current.company,
              name: current.name,
              amount: Number(current.amount),
              _id: current.id,
              branch: current.branch,
              date: [current.date],
              unit: current.unit,
              team: current.team,
              empcode: current.empcode,
              startDate: current.date,
              endDate: current.date,
            });
          }
          return acc;
        }, []);

      let findPenaltyDetails = getdayPenaltyMonth.find(
        (d) =>
          d.company === item.company &&
          d.branch === item.branch &&
          d.unit === item.unit &&
          // && d.team === item.team
          d.name === item.companyname
      );

      let experienceinmonthCalcVal = item.doj ? calculateMonthsBetweenDates(item.doj, findDate) : 0;

      // REVENUE AMOUNT
      let revenueAmountCalc = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.era === true ? (findRevenueAllow ? Number(findRevenueAllow.amount) : 0) : 0;

      let shiftAllowAmt =
        item.shiftallowancelog && item.shiftallowancelog.length > 0
          ? item.shiftallowancelog.filter((d) => {
            return d.month === selectedMonth && d.year == selectedYear;
          })
          : [];

      let TargetPointAmt =
        item.targetpointlog && item.targetpointlog.length > 0
          ? item.targetpointlog.filter((d) => {
            return d.month === selectedMonth && d.year == selectedYear;
          })
          : [];

      let AcheivedPointAmt =
        item.acheivedpointlog && item.acheivedpointlog.length > 0
          ? item.acheivedpointlog.filter((d) => {
            return d.month === selectedMonth && d.year == selectedYear;
          })
          : [];
      let PenaltyPointAmt =
        item.penaltylog && item.penaltylog.length > 0
          ? item.penaltylog.filter((d) => {
            return d.month === selectedMonth && d.year == selectedYear;
          })
          : [];
      let totalPaidDaysLogVal =
        item.totalpaiddayslog && item.totalpaiddayslog.length > 0
          ? item.totalpaiddayslog.filter((d) => {
            return d.month === selectedMonth && d.year == selectedYear;
          })
          : [];
      let totalAbsentLogVal =
        item.totalabsentlog && item.totalabsentlog.length > 0
          ? item.totalabsentlog.filter((d) => {
            return d.month === selectedMonth && d.year == selectedYear;
          })
          : [];
      let currMonAvgLogVal =
        item.currmonthavglog && item.currmonthavglog.length > 0
          ? item.currmonthavglog.filter((d) => {
            return d.month === selectedMonth && d.year == selectedYear;
          })
          : [];
      let currMonAttLogVal =
        item.currmonthattlog && item.currmonthattlog.length > 0
          ? item.currmonthattlog.filter((d) => {
            return d.month === selectedMonth && d.year == selectedYear;
          })
          : [];

      let noShiftLogVal =
        item.noshiftlog && item.noshiftlog.length > 0
          ? item.noshiftlog.filter((d) => {
            return d.month === selectedMonth && d.year == selectedYear;
          })
          : [];

      let shiftAllowTargetlogVal =
        item.shiftallowtargetlog && item.shiftallowtargetlog.length > 0
          ? item.shiftallowtargetlog.filter((d) => {
            return d.month === selectedMonth && d.year == selectedYear;
          })
          : [];
      let nightShiftAllowlogLogVal =
        item.nightshiftallowlog && item.nightshiftallowlog.length > 0
          ? item.nightshiftallowlog.filter((d) => {
            return d.month === selectedMonth && d.year == selectedYear;
          })
          : [];

      let paidpresentdayvalue = findTotalNoOfDays ? Number(findTotalNoOfDays.paidpresentday) : 0;
      let leaveCountvalue = findTotalNoOfDays ? Number(findTotalNoOfDays.leaveCount) : 0;
      let holidayCountvalue = findTotalNoOfDays ? Number(findTotalNoOfDays.holidayCount) : 0;
      let shiftvalue = findTotalNoOfDays ? Number(findTotalNoOfDays.shift) : 0;
      let lopcountvalue = findTotalNoOfDays ? Number(findTotalNoOfDays.lopcount) : 0;
      let paiddayscalcvalfrommonthstatus = paidpresentdayvalue;
      // let paiddayscalcvalfrommonthstatus = Number(paidpresentdayvalue) + Number(leaveCountvalue) + Number(holidayCountvalue) > Number(shiftvalue) ? Number(shiftvalue) - Number(lopcountvalue) : Number(paidpresentdayvalue) + Number(leaveCountvalue) + Number(holidayCountvalue);

      let paidpresentdayallCalcVal = shiftvalue;
      let totalshiftCalcVal = Number(paidpresentdayallCalcVal);
      let totalasbleaveCalcVal = item.totalabsentlog && item.totalabsentlog.length > 0 && totalAbsentLogVal && totalAbsentLogVal.length > 0 ? Number(totalAbsentLogVal[totalAbsentLogVal.length - 1].value) : findTotalNoOfDays ? Number(findTotalNoOfDays.lopcount) : 0;
      let totalpaiddaycalVal = item.totalpaiddayslog && item.totalpaiddayslog.length > 0 && totalPaidDaysLogVal && totalPaidDaysLogVal.length > 0 ? Number(totalPaidDaysLogVal[totalPaidDaysLogVal.length - 1].value) : paiddayscalcvalfrommonthstatus;

      let pfvalues = item.assignpfesilog && item.assignpfesilog.length > 0 ? item.assignpfesilog[item.assignpfesilog.length - 1] : {};

      let targetPointCalcVaue = item.targetpointlog && item.targetpointlog.length > 0 && TargetPointAmt && TargetPointAmt.length > 0 ? Number(TargetPointAmt[TargetPointAmt.length - 1].value) : findPointsDetails ? Number(findPointsDetails.target) : 0;

      let AcheivedPointsCalcVal = item.acheivedpointlog && item.acheivedpointlog.length > 0 && AcheivedPointAmt && AcheivedPointAmt.length > 0 ? Number(AcheivedPointAmt[AcheivedPointAmt.length - 1].value) : findPointsDetails ? Number(findPointsDetails.point) : 0;
      AcheivedPointsCalcVal = Number(Number(AcheivedPointsCalcVal).toFixed(2));
      let AcheivedPercentCalcVal = targetPointCalcVaue ? Number(((Number(AcheivedPointsCalcVal) / Number(targetPointCalcVaue)) * 100).toFixed(2)) : 0;

      let allowancepointCalcVal = item.shiftallowancelog && item.shiftallowancelog.length > 0 && shiftAllowAmt && shiftAllowAmt.length > 0 ? Number(shiftAllowAmt[shiftAllowAmt.length - 1].value) : findPointsDetails ? Number(findPointsDetails.allowancepoint) : 0;

      allowancepointCalcVal = Number(Number(allowancepointCalcVal).toFixed(2));

      let ERAAmountCalcVal = findERAaountValue ? Number(findERAaountValue.amount) : 0;
      let penaltyCalcVal = item.penaltylog && item.penaltylog.length > 0 && PenaltyPointAmt && PenaltyPointAmt.length > 0 ? Number(PenaltyPointAmt[PenaltyPointAmt.length - 1].value) : findPenaltyDetails ? Number(findPenaltyDetails.amount) : 0;
      penaltyCalcVal = Number(Number(penaltyCalcVal).toFixed(2));
      let totalNoOfDaysCalcVal = findTotalNoOfDays ? Number(findTotalNoOfDays.totalcounttillcurrendate) : 0;

      //PRODUCTION AND PRODCTION ALLOWACE2
      let oldprodAllowanceCalcVal = modevalue && modevalue.expmode === "Manual" ? Number(modevalue.productionallowance) : findSalDetails ? Number(findSalDetails.productionallowance) : 0;
      let oldprodAllowancetwoCalcVal = modevalue && modevalue.expmode === "Manual" ? Number(modevalue.productionallowancetwo) : findSalDetails ? Number(findSalDetails.productionallowancetwo) : 0;
      // ACUTAL BASIC/HRA/CONVEYACE/MEDICAL/OTHER ALLOWANCE
      let oldactualBasicCalcVal = modevalue && modevalue.expmode === "Manual" ? Number(modevalue.basic) : findSalDetails ? Number(findSalDetails.basic) : 0;
      let oldactualHraCalcVal = modevalue && modevalue.expmode === "Manual" ? Number(modevalue.hra) : findSalDetails ? Number(findSalDetails.hra) : 0;
      let oldactualConveyanceCalcVal = modevalue && modevalue.expmode === "Manual" ? Number(modevalue.conveyance) : findSalDetails ? Number(findSalDetails.conveyance) : 0;
      let oldactualMedicalAllowCalcVal = modevalue && modevalue.expmode === "Manual" ? Number(modevalue.medicalallowance) : findSalDetails ? Number(findSalDetails.medicalallowance) : 0;
      let oldactualOtherCalVAL = modevalue && modevalue.expmode === "Manual" ? Number(modevalue.otherallowance) : findSalDetails ? Number(findSalDetails.otherallowance) : 0;

      // const getDatesInRange = (fromDate, toDate) => {
      //   const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
      //   const startDate = new Date(fromDate);
      //   const endDate = new Date(toDate);

      //   // Add one day to include the end date
      //   endDate.setDate(endDate.getDate() + 1);

      //   let count = 0;
      //   for (let date = startDate; date < endDate; date.setDate(date.getDate() + 1)) {
      //     count++;
      //   }

      //   return count;
      // };

      // let tond = getDatesInRange(findDate, findmonthenddate);
      function getTotalDaysInMonthByName(monthName, year) {
        const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth() + 1; // Convert month name to number
        return new Date(year, monthIndex, 0).getDate();
      }

      let tond = getTotalDaysInMonthByName(selectedMonth, Number(selectedYear));
      // console.log(tond, 'tond');
      let prodAllowanceCalcVal = Number(((Number(oldprodAllowanceCalcVal) / tond) * totalshiftCalcVal).toFixed(2));
      let prodAllowancetwoCalcVal = Number(((Number(oldprodAllowancetwoCalcVal) / tond) * totalshiftCalcVal).toFixed(2));
      //calculated  ACUTAL BASIC/HRA/CONVEYACE/MEDICAL/OTHER ALLOWANCE
      let actualBasicCalcVal = Number(((Number(oldactualBasicCalcVal) / tond) * totalshiftCalcVal).toFixed(2));

      let actualHraCalcVal = Number(((Number(oldactualHraCalcVal) / tond) * totalshiftCalcVal).toFixed(2));
      let actualConveyanceCalcVal = Number(((Number(oldactualConveyanceCalcVal) / tond) * totalshiftCalcVal).toFixed(2));
      let actualMedicalAllowCalcVal = Number(((Number(oldactualMedicalAllowCalcVal) / tond) * totalshiftCalcVal).toFixed(2));
      let actualOtherCalVAL = Number(((Number(oldactualOtherCalVAL) / tond) * totalshiftCalcVal).toFixed(2));

      let oldgross = modevalue && modevalue.expmode === "Manual" ? Number(modevalue.gross) : Number(oldactualBasicCalcVal) + Number(oldactualHraCalcVal) + Number(oldactualConveyanceCalcVal) + Number(oldactualMedicalAllowCalcVal) + Number(oldprodAllowanceCalcVal) + Number(oldactualOtherCalVAL);

      let grossValue = modevalue && modevalue.expmode === "Manual" ? Number(modevalue.gross) : Number(actualBasicCalcVal) + Number(actualHraCalcVal) + Number(actualConveyanceCalcVal) + Number(actualMedicalAllowCalcVal) + Number(prodAllowanceCalcVal) + Number(actualOtherCalVAL);
      grossValue = Number(Number(grossValue).toFixed(2));
      ///FINAL-FIXED-PROD SALARY CALCULATION STARTED--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

      let findPFpercentage = modevalue && modevalue.expmode === "Manual" ? Number(modevalue.pfemployeepercentage) : findSalDetails ? Number(findSalDetails.pfemployeepercentage) : 0;
      let findESIpercentage = modevalue && modevalue.expmode === "Manual" ? Number(modevalue.esiemployeepercentage) : findSalDetails ? Number(findSalDetails.esiemployeepercentage) : 0;
      let findEsiMAXSalary = findSalDetails ? Number(findSalDetails.esimaxsalary) : 0;
      let findEmployerPercentage = findSalDetails ? Number(findSalDetails.pfpercentage) : 0;
      let findEmployerESIPercentage = findSalDetails ? Number(findSalDetails.esipercentage) : 0;

      //ATTENDANCE LOP CALCUCLATION
      let attendanceLopCalVal = totalshiftCalcVal > 0 ? ((actualBasicCalcVal + actualHraCalcVal + actualConveyanceCalcVal + actualMedicalAllowCalcVal + actualOtherCalVAL) / totalshiftCalcVal) * Number(totalasbleaveCalcVal) : 0;
      //ACHEIVED PRODUCTION ALLOWANCE
      let acheivedProductionAllowanceValCal =
        AcheivedPointsCalcVal && Number(AcheivedPointsCalcVal) > 0 && Number(targetPointCalcVaue ? targetPointCalcVaue : 0) > 0
          ? AcheivedPointsCalcVal < targetPointCalcVaue
            ? Number(prodAllowanceCalcVal) - (prodAllowancetwoCalcVal ? Number(prodAllowancetwoCalcVal) : 0) * ((100 - (Number(AcheivedPointsCalcVal ? AcheivedPointsCalcVal : 0) * 100) / Number(targetPointCalcVaue ? targetPointCalcVaue : 0)) * 0.01)
            : Number(prodAllowanceCalcVal) * (((Number(AcheivedPointsCalcVal ? AcheivedPointsCalcVal : 0) * 100) / Number(targetPointCalcVaue ? targetPointCalcVaue : 0)) * 0.01)
          : 0;

      //LOP BASIC
      let lopBasicValCal = totalNoOfDaysCalcVal > 0 ? (Number(totalpaiddaycalVal) + Number(totalasbleaveCalcVal) > Number(totalNoOfDaysCalcVal) ? (Number(actualBasicCalcVal) / (totalasbleaveCalcVal + totalpaiddaycalVal)) * totalNoOfDaysCalcVal : (Number(actualBasicCalcVal) / totalshiftCalcVal) * totalpaiddaycalVal) : 0;

      let lopHRAValCal = totalNoOfDaysCalcVal > 0 ? (Number(totalpaiddaycalVal) + Number(totalasbleaveCalcVal) > Number(totalNoOfDaysCalcVal) ? (Number(actualHraCalcVal) / (totalasbleaveCalcVal + totalpaiddaycalVal)) * totalNoOfDaysCalcVal : (Number(actualHraCalcVal) / totalshiftCalcVal) * totalpaiddaycalVal) : 0;

      let lopConveyValCal = totalNoOfDaysCalcVal > 0 ? (Number(totalpaiddaycalVal) + Number(totalasbleaveCalcVal) > Number(totalNoOfDaysCalcVal) ? (Number(actualConveyanceCalcVal) / (totalasbleaveCalcVal + totalpaiddaycalVal)) * totalNoOfDaysCalcVal : (Number(actualConveyanceCalcVal) / totalshiftCalcVal) * totalpaiddaycalVal) : 0;

      let lopMedicalValCal = totalNoOfDaysCalcVal > 0 ? (Number(totalpaiddaycalVal) + Number(totalasbleaveCalcVal) > Number(totalNoOfDaysCalcVal) ? (Number(actualMedicalAllowCalcVal) / (totalasbleaveCalcVal + totalpaiddaycalVal)) * totalNoOfDaysCalcVal : (Number(actualMedicalAllowCalcVal) / totalshiftCalcVal) * totalpaiddaycalVal) : 0;

      let lopOtherValCal = totalNoOfDaysCalcVal > 0 ? (Number(totalpaiddaycalVal) + Number(totalasbleaveCalcVal) > Number(totalNoOfDaysCalcVal) ? (Number(actualOtherCalVAL) / (totalasbleaveCalcVal + totalpaiddaycalVal)) * totalNoOfDaysCalcVal : (Number(actualOtherCalVAL) / totalshiftCalcVal) * totalpaiddaycalVal) : 0;

      let lopProductionAllowance =
        AcheivedPointsCalcVal && Number(AcheivedPointsCalcVal) > 0 && Number(targetPointCalcVaue ? targetPointCalcVaue : 0) > 0
          ? AcheivedPointsCalcVal < targetPointCalcVaue
            ? Number(prodAllowanceCalcVal) - (prodAllowancetwoCalcVal ? Number(prodAllowancetwoCalcVal) : 0) * ((100 - (Number(AcheivedPointsCalcVal ? AcheivedPointsCalcVal : 0) * 100) / Number(targetPointCalcVaue ? targetPointCalcVaue : 0)) * 0.01)
            : Number(prodAllowanceCalcVal) * (((Number(AcheivedPointsCalcVal ? AcheivedPointsCalcVal : 0) * 100) / Number(targetPointCalcVaue ? targetPointCalcVaue : 0)) * 0.01)
          : 0;
      //  AcheivedPointsCalcVal > 0 ? (AcheivedPointsCalcVal < targetPointCalcVaue ? prodAllowanceCalcVal - (prodAllowancetwoCalcVal * (100 - (AcheivedPointsCalcVal * 100) / targetPointCalcVaue)) * 0.01 : (prodAllowanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal) : 0;

      let prodBasicValCalc = lopBasicValCal;
      let prodHraValCalc = lopHRAValCal;
      let prodConveyanceValCalc = lopConveyValCal;
      let prodMEDAllowanceValCalc = lopMedicalValCal;
      let prodOtherValCalc = lopOtherValCal;
      let prodPRODValCalc = lopProductionAllowance;
      if (CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.prod === true) {
        if (Number(prodAllowanceCalcVal) === 0) {
          prodBasicValCalc = lopBasicValCal;
          prodHraValCalc = lopHRAValCal;
          prodConveyanceValCalc = lopConveyValCal;
          prodMEDAllowanceValCalc = lopMedicalValCal;
          prodOtherValCalc = lopOtherValCal;
          prodPRODValCalc = lopProductionAllowance;
        } else {
          prodBasicValCalc = acheivedProductionAllowanceValCal == 0 ? 0 : acheivedProductionAllowanceValCal > 0 ? lopBasicValCal : lopBasicValCal + (lopBasicValCal * ((100 * acheivedProductionAllowanceValCal) / (lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopOtherValCal))) / 100;
          prodHraValCalc = acheivedProductionAllowanceValCal == 0 ? 0 : acheivedProductionAllowanceValCal > 0 ? lopHRAValCal : lopHRAValCal + (lopHRAValCal * ((100 * acheivedProductionAllowanceValCal) / (lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopOtherValCal))) / 100;
          prodConveyanceValCalc = acheivedProductionAllowanceValCal == 0 ? 0 : acheivedProductionAllowanceValCal > 0 ? lopConveyValCal : lopConveyValCal + (lopConveyValCal * ((100 * acheivedProductionAllowanceValCal) / (lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopOtherValCal))) / 100;
          prodMEDAllowanceValCalc = acheivedProductionAllowanceValCal == 0 ? 0 : acheivedProductionAllowanceValCal > 0 ? lopMedicalValCal : lopMedicalValCal + (lopMedicalValCal * ((100 * acheivedProductionAllowanceValCal) / (lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopOtherValCal))) / 100;
          prodMEDAllowanceValCalc = acheivedProductionAllowanceValCal == 0 ? 0 : acheivedProductionAllowanceValCal > 0 ? lopOtherValCal : lopOtherValCal + (lopOtherValCal * ((100 * acheivedProductionAllowanceValCal) / (lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopOtherValCal))) / 100;
          prodPRODValCalc = acheivedProductionAllowanceValCal == 0 ? 0 : acheivedProductionAllowanceValCal > 0 ? acheivedProductionAllowanceValCal : 0;
        }
      } else {
        prodBasicValCalc = lopBasicValCal;
        prodHraValCalc = lopHRAValCal;
        prodConveyanceValCalc = lopConveyValCal;
        prodMEDAllowanceValCalc = lopMedicalValCal;
        prodOtherValCalc = lopOtherValCal;
        prodPRODValCalc = lopProductionAllowance;
      }

      // //PROD BASIC
      // let prodBasicValCalc =
      //   CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === false
      //     ? lopBasicValCal
      //     : acheivedProductionAllowanceValCal === 0
      //     ? 0
      //     : acheivedProductionAllowanceValCal > 0
      //     ? lopBasicValCal
      //     : lopBasicValCal + (lopBasicValCal * ((100 * acheivedProductionAllowanceValCal) / (lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopOtherValCal))) / 100;

      // //PROD HRA
      // let prodHraValCalc =
      //   CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === false
      //     ? lopHRAValCal
      //     : acheivedProductionAllowanceValCal === 0
      //     ? 0
      //     : acheivedProductionAllowanceValCal > 0
      //     ? lopHRAValCal
      //     : lopHRAValCal + (lopHRAValCal * ((100 * acheivedProductionAllowanceValCal) / (lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopOtherValCal))) / 100;
      // //PROD CONVEYANCE
      // let prodConveyanceValCalc =
      //   CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === false
      //     ? lopConveyValCal
      //     : acheivedProductionAllowanceValCal === 0
      //     ? 0
      //     : acheivedProductionAllowanceValCal > 0
      //     ? lopConveyValCal
      //     : lopConveyValCal + (lopConveyValCal * ((100 * acheivedProductionAllowanceValCal) / (lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopOtherValCal))) / 100;

      // //PROD MEDICAL ALLOWANCE
      // let prodMEDAllowanceValCalc =
      //   CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === false
      //     ? lopMedicalValCal
      //     : acheivedProductionAllowanceValCal === 0
      //     ? 0
      //     : acheivedProductionAllowanceValCal > 0
      //     ? lopMedicalValCal
      //     : lopMedicalValCal + (lopMedicalValCal * ((100 * acheivedProductionAllowanceValCal) / (lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopOtherValCal))) / 100;

      // //PROD OTHER ALLOWANCE
      // let prodOtherValCalc =
      //   CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === false
      //     ? lopOtherValCal
      //     : acheivedProductionAllowanceValCal === 0
      //     ? 0
      //     : acheivedProductionAllowanceValCal > 0
      //     ? lopOtherValCal
      //     : lopOtherValCal + (lopOtherValCal * ((100 * acheivedProductionAllowanceValCal) / (lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopOtherValCal))) / 100;

      // //PROD PRODUCTION ALLOWANCE
      // let prodPRODValCalc = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === false ? lopProductionAllowance : acheivedProductionAllowanceValCal > 0 ? acheivedProductionAllowanceValCal : 0;

      let penaltyAmtCalculationVal =
        Number(differenceInMonthsexp) <= 0
          ? 0
          : Number(differenceInMonthsexp) >= 1
            ? Number(differenceInMonthsexp) >= 2
              ? Number(differenceInMonthsexp) >= 3
                ? Number(differenceInMonthsexp) >= 4
                  ? Number(penaltyCalcVal) - Number(penaltyCalcVal) * 0
                  : Number(penaltyCalcVal) - Number(penaltyCalcVal) * 0.25
                : Number(penaltyCalcVal) - Number(penaltyCalcVal) * 0.5
              : Number(penaltyCalcVal) - Number(penaltyCalcVal) * 0.75
            : Number(penaltyCalcVal) - Number(penaltyCalcVal) * 1;

      let calcNetSalaryValCalc = Number(AcheivedPointsCalcVal) === 0 && Number(prodAllowanceCalcVal) > 0 ? 0 : lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopProductionAllowance + lopOtherValCal;

      let ProdNetSalaryFinal = prodBasicValCalc + prodHraValCalc + prodConveyanceValCalc + prodMEDAllowanceValCalc + prodPRODValCalc + prodOtherValCalc;

      let lossDed = 0;
      let OtherDed = 0;

      let finalBasicValCalc = prodBasicValCalc === 0 ? 0 : prodBasicValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodBasicValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;
      let finalHraValCalc = prodHraValCalc === 0 ? 0 : prodHraValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodHraValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;
      let finalConveyValCalc = prodConveyanceValCalc === 0 ? 0 : prodConveyanceValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodConveyanceValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;

      let finalMedicalAllowValcCalc =
        prodMEDAllowanceValCalc === 0 ? 0 : prodMEDAllowanceValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodMEDAllowanceValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;
      let finalOtherValcCalc = prodOtherValCalc === 0 ? 0 : prodOtherValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodOtherValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;
      let finalProductionValcCalc = prodPRODValCalc === 0 ? 0 : prodPRODValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodPRODValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;

      let finalNetSalaryValcCalc = finalBasicValCalc + finalHraValCalc + finalConveyValCalc + finalMedicalAllowValcCalc + finalProductionValcCalc + finalOtherValcCalc;

      //PFDAYS AND PFDEDUCTION
      let userWeekoff = findTotalNoOfDays ? Number(findTotalNoOfDays.weekoff) : 0;
      let userCLSL = findTotalNoOfDays ? Number(findTotalNoOfDays.clsl) : 0;
      let DLOB = findTotalNoOfDays ? Number(findTotalNoOfDays.dlob) : 0;
      let Present = findTotalNoOfDays ? Number(findTotalNoOfDays.present) : 0;
      //PFDAYS AND PFDEDUCTION
      // let pfdatcal = 0;
      // let daysp = totalshiftCalcVal - totalasbleaveCalcVal;
      // let IsExDate = pfvalues.pfenddate && pfvalues.pfenddate !== '' ? true : false;
      // //Dftdate = pfesifromdate findDate = monthstart fromdate or month fromdate
      // let pfmode = pfvalues.pffromdate > findDate ? 'S' : IsExDate ? 'E' : 'ALL';
      // let PLOP = userWeekoff + userCLSL;

      // pfdatcal = pfmode === 'S' || pfmode === 'E' ? Number(pfdatcal) + userWeekoff + userCLSL + Number(Present) - DLOB : Number(Present) + Number(PLOP);
      // let PfDate = daysp >= pfdatcal ? (IsExDate === true && new Date(pfvalues.pfenddate) < new Date(findDate) ? 0 : Number(pfdatcal) + Number(totalasbleaveCalcVal)) : Number(daysp) + Number(totalasbleaveCalcVal);
      // let pfDaysVal = pfvalues.pfdeduction === true ? PfDate : 0;
      // let pfAmount = pfvalues.pfdeduction === true ? Number(findPFpercentage) / 100 : 0;
      let pfdatcal = 0;
      let daysp = totalshiftCalcVal - totalasbleaveCalcVal;
      let IsExDate = pfvalues.pfenddate ? true : false;
      //Dftdate = pfesifromdate findDate = monthstart fromdate or month fromdate
      let pfmode = pfvalues.pffromdate > findDate ? "S" : IsExDate ? "E" : "ALL";
      let PLOP = (findTotalNoOfDays ? findTotalNoOfDays.weekoff : 0) + (findTotalNoOfDays ? findTotalNoOfDays.clsl : 0);
      pfdatcal = pfmode === "S" || pfmode === "E" ? Number(pfdatcal) + Number(totalpaiddaycalVal) : Number(totalpaiddaycalVal);
      let PfDate = daysp >= pfdatcal ? (IsExDate === true && new Date(pfvalues.pfenddate) < new Date(findDate) ? 0 : Number(pfdatcal) + Number(totalasbleaveCalcVal)) : Number(daysp ? daysp : 0) + Number(totalasbleaveCalcVal ? totalasbleaveCalcVal : 0);
      // console.log(daysp >= pfdatcal, daysp, pfdatcal, PfDate, 'PfDate');

      let pfDaysVal = pfvalues.pfdeduction === true ? PfDate : 0;
      let pfAmount = pfvalues.pfdeduction === true ? Number(findPFpercentage) / 100 : 0;
      // console.log(pfDaysVal, 'PfDate');
      // console.log(pfDaysVal, 'PfDate');
      let PF_deduction = pfDaysVal > 0 && totalshiftCalcVal > 0 ? ((Number(finalBasicValCalc) / Number(totalshiftCalcVal)) * Number(pfDaysVal) * Number(pfAmount)).toFixed(2) : 0;

      //  let PF_deduction  = ((pfDaysVal >= totalshiftCalcVal) ? (finalBasicValCalc * (Number(findPFpercentage)/100)) : ((finalBasicValCalc / totalshiftCalcVal) * pfDaysVal) * (Number(findPFpercentage)/100)) : 0
      // FIND SHIFTALLOWACE
      // let checkShiftAllowApplies = shifts.find((d) => d.name === item.shifttiming);
      // let CHECKSHIFTALLOWANCE = checkShiftAllowApplies ? checkShiftAllowApplies.isallowance : "Disable";

      let noshiftlogvalfinal = item.noshiftlog && item.noshiftlog.length > 0 && noShiftLogVal && noShiftLogVal.length > 0 ? Number(noShiftLogVal[noShiftLogVal.length - 1].value) : findPointsDetails ? findPointsDetails.noallowancepoint : 0;

      let shiftallowanceTargetDaypoint = item.noshiftlog && item.noshiftlog.length > 0 && noShiftLogVal && noShiftLogVal.length > 0 ? Number(noShiftLogVal[noShiftLogVal.length - 1].value) : findPointsDetails ? Number(findPointsDetails.allowancetarget) : 0;

      let shiftallowancetarget = noshiftlogvalfinal > 0 ? shiftallowanceTargetDaypoint : 0;

      let shiftallowancetargetfinal = item.shiftallowtargetlog && item.shiftallowtargetlog.length > 0 && shiftAllowTargetlogVal && shiftAllowTargetlogVal.length > 0 ? Number(shiftAllowTargetlogVal[shiftAllowTargetlogVal.length - 1].value) : shiftallowancetarget;

      let nightAllowancefinalcalculation =
        // CHECKSHIFTALLOWANCE === "Enable" &&
        noshiftlogvalfinal > 0 ? ((1000 / tond) * noshiftlogvalfinal * (allowancepointCalcVal > 0 ? (allowancepointCalcVal * 100) / shiftallowancetargetfinal : 0)) / 100 : 0;

      let nightAllowanceCalcVal = item.nightshiftallowlog && item.nightshiftallowlog.length > 0 && nightShiftAllowlogLogVal && nightShiftAllowlogLogVal.length > 0 ? Number(nightShiftAllowlogLogVal[nightShiftAllowlogLogVal.length - 1].value) : nightAllowancefinalcalculation;

      //ESI-DEDCUTIONss
      let Esiper = pfvalues.esideduction === true ? Number(findEmployerESIPercentage) / 100 : 0;

      let ESI_deduction = grossValue >= findEsiMAXSalary || oldgross >= findEsiMAXSalary ? 0 : pfDaysVal > 0 && totalshiftCalcVal > 0 ? (finalNetSalaryValcCalc / totalshiftCalcVal) * pfDaysVal * Esiper : 0;
      let ncpDaysVal =
        totalpaiddaycalVal > 0
          ? // ( totalNoOfDaysCalcVal - ((((finalBasicValCalc * totalNoOfDaysCalcVal) / actualBasicCalcVal) - (totalNoOfDaysCalcVal - pfDaysVal)).toFixed(0)) )
          Number(totalNoOfDaysCalcVal) - Math.abs(Math.round((finalBasicValCalc * totalNoOfDaysCalcVal) / actualBasicCalcVal - (totalNoOfDaysCalcVal - pfDaysVal)))
          : 0;

      let finalLOPDaysCalcVal = Math.round(
        Number(totalasbleaveCalcVal) + (Number(actualBasicCalcVal) === 0 ? 0 : Number(totalshiftCalcVal) - (Number(totalshiftCalcVal) * Number(finalBasicValCalc)) / Number(actualBasicCalcVal)) < Number(totalshiftCalcVal)
          ? Number(totalasbleaveCalcVal) + (Number(actualBasicCalcVal) === 0 ? 0 : Number(totalshiftCalcVal) - (Number(totalshiftCalcVal) * Number(finalBasicValCalc)) / Number(actualBasicCalcVal))
          : Number(totalshiftCalcVal)
      );

      let paySlipLopCalval = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 || grossValue === 0 ? 0 : totalshiftCalcVal - Math.round((totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue) < 0 ? 0 : totalshiftCalcVal - Math.round((totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue);

      let finalLeaveDeductionValCalc =
        //  totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 ? 0 : (grossValue / totalshiftCalcVal) * ((totalshiftCalcVal - (totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue).toFixed(0) < 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue);
        totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 || grossValue === 0 ? 0 : (grossValue / totalshiftCalcVal) * (totalshiftCalcVal - (totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue < 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue);

      let findprofTaxAmt = profTaxMaster.find((d) => d.company == item.company && d.branch === item.branch && Number(d.fromamount) <= finalNetSalaryValcCalc && Number(d.toamount) + 0.99 >= finalNetSalaryValcCalc);

      let profTaxCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.tax === false ? 0 : findprofTaxAmt ? Number(findprofTaxAmt.taxamount) : 0;

      let totalDeductionValCalc = Number(profTaxCalcVal) + Number(ESI_deduction) + Number(PF_deduction);

      let finalSalaryCalcVal = finalNetSalaryValcCalc - totalDeductionValCalc + nightAllowanceCalcVal > grossValue && AcheivedPercentCalcVal < 100 ? grossValue : finalNetSalaryValcCalc - totalDeductionValCalc + nightAllowanceCalcVal;
      let finalSalary_Penalty = finalSalaryCalcVal + penaltyAmtCalculationVal > 0 ? (finalSalaryCalcVal + penaltyAmtCalculationVal + lossDed + OtherDed > grossValue ? finalSalaryCalcVal : finalSalaryCalcVal + penaltyAmtCalculationVal + lossDed + OtherDed) : 0;

      let Mvalue = findAcPointVal ? Number(findAcPointVal.multiplevalue) : 0;
      let Dvalue = findAcPointVal ? Number(findAcPointVal.dividevalue) : 0;
      // let Dvalue = findAcPointVal ? Number(findAcPointVal.multiplevalue) : 0;
      // let Mvalue = findAcPointVal ? Number(findAcPointVal.dividevalue) : 0;
      let totalPointsValueCalc = (Number(AcheivedPointsCalcVal) / Dvalue) * Mvalue ? ((Number(AcheivedPointsCalcVal) / Dvalue) * Mvalue).toFixed(2) : Number(0).toFixed(2);

      let acutalERAValCalc = totalasbleaveCalcVal > 2 ? (ERAAmountCalcVal - (ERAAmountCalcVal / totalshiftCalcVal) * totalasbleaveCalcVal).toFixed(2) : Number(ERAAmountCalcVal);

      let pfAmount1 = findEmployerPercentage;

      let PF_Emper_deduction = pfAmount1 > 0 && totalshiftCalcVal > 0 ? (finalBasicValCalc / totalshiftCalcVal) * pfDaysVal * (pfAmount1 / 100) : 0;

      //ESI-DEDCUTION
      let ESI_EMPR_Perncetage = pfvalues.esideduction === true ? Number(findESIpercentage) / 100 : 0;

      let ESI_EMPR_deduction = grossValue >= findEsiMAXSalary || oldgross >= findEsiMAXSalary ? 0 : pfDaysVal > 0 && totalshiftCalcVal > 0 ? (finalNetSalaryValcCalc / totalshiftCalcVal) * pfDaysVal * ESI_EMPR_Perncetage : 0;

      let CTC_Calcval = Number(finalSalaryCalcVal) + Number(ESI_deduction) + Number(PF_deduction) + Number(ESI_EMPR_deduction) + Number(PF_Emper_deduction) + Number(profTaxCalcVal);

      let finalValueCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === true ? Number(totalPointsValueCalc) - (Number(acutalERAValCalc) + Number(CTC_Calcval)) + Number(revenueAmountCalc) : 0;

      let final_Value_PenaltyCalcval = finalValueCalcVal - (Number(penaltyAmtCalculationVal) + Number(lossDed) + Number(OtherDed));

      final_Value_PenaltyCalcval = final_Value_PenaltyCalcval > 0 ? (finalValueCalcVal >= grossValue ? finalValueCalcVal : final_Value_PenaltyCalcval) : 0;

      let ShortageCalVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.era === true ? (findShortage ? Number(findShortage.amount) : 0) : 0;

      let Shortage1ValCalc = ShortageCalVal > 0 && totalNoOfDaysCalcVal > 0 ? (CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.era === true ? (Number(ShortageCalVal) * Number(totalpaiddaycalVal)) / Number(tond) : 0) : 0;
      // console.log(CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.era, Shortage1ValCalc, "deductin")
      let acutalDeductionCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true ? (Number(totalPointsValueCalc) + Number(revenueAmountCalc) - (Number(CTC_Calcval) + Number(Shortage1ValCalc)) >= 0 ? 0 : Number(totalPointsValueCalc) + Number(revenueAmountCalc) - (Number(CTC_Calcval) + Number(Shortage1ValCalc))) : 0;

      let minimumDeductionCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true ? (Number(Shortage1ValCalc) + Number(acutalDeductionCalcVal) >= 0 ? 0 : Number(Shortage1ValCalc) + Number(acutalDeductionCalcVal)) : 0;

      let LossDeduction = Number(minimumDeductionCalcVal) + (Number(acutalDeductionCalcVal) - Number(OtherDed) - Number(minimumDeductionCalcVal));

      lossDed = LossDeduction > 0 ? Number(LossDeduction) : Number(-1) * Number(LossDeduction);

      // -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

      // RCALCULATION AFTER FIND LOSS DEDUCTION

      if (calcNetSalaryValCalc > 0) {
        finalBasicValCalc = prodBasicValCalc === 0 ? 0 : prodBasicValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodBasicValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;
        finalHraValCalc = prodHraValCalc === 0 ? 0 : prodHraValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodHraValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;
        finalConveyValCalc = prodConveyanceValCalc === 0 ? 0 : prodConveyanceValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodConveyanceValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;

        finalMedicalAllowValcCalc =
          prodMEDAllowanceValCalc === 0 ? 0 : prodMEDAllowanceValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodMEDAllowanceValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;
        finalOtherValcCalc = prodOtherValCalc === 0 ? 0 : prodOtherValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodOtherValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;
        finalProductionValcCalc = prodPRODValCalc === 0 ? 0 : prodPRODValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodPRODValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;

        finalNetSalaryValcCalc = finalBasicValCalc + finalHraValCalc + finalConveyValCalc + finalMedicalAllowValcCalc + finalProductionValcCalc + finalOtherValcCalc;
      }

      finalBasicValCalc = finalBasicValCalc > 0 ? finalBasicValCalc : 0;
      finalHraValCalc = finalHraValCalc > 0 ? finalHraValCalc : 0;
      finalConveyValCalc = finalConveyValCalc > 0 ? finalConveyValCalc : 0;

      // prodConveyanceValCalc === 0 ? 0 : prodConveyanceValCalc * ((((calcNetSalaryValCalc - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / calcNetSalaryValCalc) * 0.01) > 0 ? prodConveyanceValCalc * ((((calcNetSalaryValCalc - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / calcNetSalaryValCalc) * 0.01) : 0;
      finalMedicalAllowValcCalc = finalMedicalAllowValcCalc > 0 ? finalMedicalAllowValcCalc : 0;
      finalOtherValcCalc = finalOtherValcCalc > 0 ? finalOtherValcCalc : 0;
      finalProductionValcCalc = finalProductionValcCalc > 0 ? finalProductionValcCalc : 0;

      finalNetSalaryValcCalc = Number(finalBasicValCalc) + Number(finalHraValCalc) + Number(finalConveyValCalc) + Number(finalMedicalAllowValcCalc) + Number(finalProductionValcCalc) + Number(finalOtherValcCalc);
      //PFDAYS AND PFDEDUCTION
      //  pfdatcal = 0;
      //  daysp = totalshiftCalcVal - totalasbleaveCalcVal;
      //  IsExDate = item.isenddate ? item.isenddate : false;
      // //Dftdate = pfesifromdate findDate = monthstart fromdate or month fromdate
      //  pfmode = item.pfesifromdate > findDate ? "S" : IsExDate ? "E" : "ALL";
      //  PLOP = (findTotalNoOfDays && findTotalNoOfDays.weekoff) + (findTotalNoOfDays && findTotalNoOfDays.clsl);

      // pfdatcal = pfmode == "S" || pfmode == "E" ? pfdatcal + (findTotalNoOfDays && findTotalNoOfDays.weekoff) + (findTotalNoOfDays && findTotalNoOfDays.clsl) + totalshiftCalcVal : totalshiftCalcVal + PLOP;
      //  PfDate = daysp >= pfdatcal ? ((IsExDate == true && item.pfesienddate) < findDate ? "0" : Number(pfdatcal) + Number(totalasbleaveCalcVal)) : daysp + totalasbleaveCalcVal;

      //  pfDaysVal = item.pfdeduction === true ? PfDate : 0;
      //  pfAmount = item.pfdeduction === true ? Number(findPFpercentage) / 100 : 0;

      PF_deduction = pfDaysVal > 0 && totalshiftCalcVal > 0 ? ((Number(finalBasicValCalc) / Number(totalshiftCalcVal)) * Number(pfDaysVal) * Number(pfAmount)).toFixed(2) : 0;

      // PF_deduction  = ((pfDaysVal >= totalshiftCalcVal) ? (finalBasicValCalc * (Number(findPFpercentage)/100)) : ((finalBasicValCalc / totalshiftCalcVal) * pfDaysVal) * (Number(findPFpercentage)/100)) : 0
      // FIND SHIFTALLOWACE
      //  checkShiftAllowApplies = shifts.find((d) => d.name === item.shifttiming);
      //  CHECKSHIFTALLOWANCE = checkShiftAllowApplies ? checkShiftAllowApplies.isallowance : "Disable";
      //ESI-DEDCUTIONss
      //  Esiper = item.esideduction === true ? Number(findESIpercentage) / 100 : 0;

      ESI_deduction = grossValue >= findEsiMAXSalary || oldgross >= findEsiMAXSalary ? 0 : pfDaysVal > 0 && totalshiftCalcVal > 0 ? (finalNetSalaryValcCalc / totalshiftCalcVal) * pfDaysVal * Esiper : 0;

      let ncpvaluecalc = Number(totalNoOfDaysCalcVal) - Math.round((finalBasicValCalc * totalNoOfDaysCalcVal) / actualBasicCalcVal - (totalNoOfDaysCalcVal - pfDaysVal));
      let ncpvaluecalc1 = Number(totalNoOfDaysCalcVal) - Math.round((finalBasicValCalc * totalNoOfDaysCalcVal) / actualBasicCalcVal);

      ncpDaysVal =
        totalpaiddaycalVal > 0
          ? // ( totalNoOfDaysCalcVal - ((((finalBasicValCalc * totalNoOfDaysCalcVal) / actualBasicCalcVal) - (totalNoOfDaysCalcVal - pfDaysVal)).toFixed(0)) )
          // totalNoOfDaysCalcVal - Math.round((finalBasicValCalc * totalNoOfDaysCalcVal) / actualBasicCalcVal - (totalNoOfDaysCalcVal - pfDaysVal))
          pfvalues.pfdeduction === true
            ? ncpvaluecalc
            : ncpvaluecalc1
          : 0;

      finalLOPDaysCalcVal = Math.round(
        Number(totalasbleaveCalcVal) + (Number(actualBasicCalcVal) === 0 ? 0 : Number(totalshiftCalcVal) - (Number(totalshiftCalcVal) * Number(finalBasicValCalc)) / Number(actualBasicCalcVal)) < Number(totalshiftCalcVal)
          ? Number(totalasbleaveCalcVal) + (Number(actualBasicCalcVal) === 0 ? 0 : Number(totalshiftCalcVal) - (Number(totalshiftCalcVal) * Number(finalBasicValCalc)) / Number(actualBasicCalcVal))
          : Number(totalshiftCalcVal)
      );

      paySlipLopCalval = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 || Number(grossValue) === 0 ? 0 : totalshiftCalcVal - Math.round((totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue) < 0 ? 0 : totalshiftCalcVal - Math.round((totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue);

      finalLeaveDeductionValCalc =
        Number(totalNoOfDaysCalcVal) === 0 || Number(totalpaiddaycalVal) === 0 || Number(grossValue) === 0
          ? 0
          : (Number(grossValue) / Number(totalshiftCalcVal)) * (Number(totalshiftCalcVal) - (totalshiftCalcVal * Number(finalNetSalaryValcCalc)) / Number(grossValue) < 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue);

      findprofTaxAmt = profTaxMaster.find((d) => d.company === item.company && d.branch === item.branch && Number(d.fromamount) <= finalNetSalaryValcCalc && Number(d.toamount) + 0.99 >= finalNetSalaryValcCalc);

      profTaxCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.tax === false ? 0 : findprofTaxAmt ? Number(findprofTaxAmt.taxamount) : 0;

      totalDeductionValCalc = Number(profTaxCalcVal) + Number(ESI_deduction) + Number(PF_deduction);
      // (((decimal.Parse(shiftAllowance) / tond)) * ShiftNight) * (ShiftAcived / 100);
      // tond-NOOFDAYS
      // ShiftAcived = AlloweTarget > 0 ? (AllowePoint * 100) / AlloweTarget : AllowePoint;
      nightAllowancefinalcalculation =
        // CHECKSHIFTALLOWANCE === "Enable" &&
        noshiftlogvalfinal > 0 ? ((1000 / tond) * noshiftlogvalfinal * (allowancepointCalcVal > 0 ? (allowancepointCalcVal * 100) / shiftallowancetargetfinal : 0)) / 100 : 0;

      nightAllowanceCalcVal = item.nightshiftallowlog && item.nightshiftallowlog.length > 0 && nightShiftAllowlogLogVal && nightShiftAllowlogLogVal.length > 0 ? Number(nightShiftAllowlogLogVal[nightShiftAllowlogLogVal.length - 1].value) : nightAllowancefinalcalculation;

      finalSalaryCalcVal = Number(finalNetSalaryValcCalc) - Number(totalDeductionValCalc) + Number(nightAllowanceCalcVal) > Number(grossValue) && Number(AcheivedPercentCalcVal) < 100 ? Number(grossValue) : Number(finalNetSalaryValcCalc) - Number(totalDeductionValCalc) + Number(nightAllowanceCalcVal);

      finalSalary_Penalty = finalSalaryCalcVal + penaltyAmtCalculationVal > 0 ? (finalSalaryCalcVal + penaltyAmtCalculationVal + lossDed + OtherDed > grossValue ? finalSalaryCalcVal : finalSalaryCalcVal + penaltyAmtCalculationVal + lossDed + OtherDed) : 0;

      // totalPointsValueCalc = item.department === "PROD_GrubHub" ? (AcheivedPointsCalcVal / 1) * 360 : item.department == "TRAINEE" ? (AcheivedPointsCalcVal / 8.5) * 70 : (AcheivedPointsCalcVal / 8.5) * 60;
      // totalPointsValueCalc =((Number(AcheivedPointsCalcVal) / Dvalue) * Mvalue ) ? (Number(AcheivedPointsCalcVal) / Dvalue) * Mvalue : Number(0).toFixed(2);
      //  acutalERAValCalc = totalasbleaveCalcVal > 2 ? (ERAAmountCalcVal - (ERAAmountCalcVal / totalshiftCalcVal) * totalasbleaveCalcVal).toFixed(2) : Number(ERAAmountCalcVal);

      pfAmount1 = findEmployerPercentage;

      PF_Emper_deduction = pfAmount1 > 0 && totalshiftCalcVal > 0 ? (finalBasicValCalc / totalshiftCalcVal) * pfDaysVal * (pfAmount1 / 100) : 0;

      ESI_EMPR_deduction = grossValue >= findEsiMAXSalary || oldgross >= findEsiMAXSalary ? 0 : pfDaysVal > 0 && totalshiftCalcVal > 0 ? (finalNetSalaryValcCalc / totalshiftCalcVal) * pfDaysVal * ESI_EMPR_Perncetage : 0;

      CTC_Calcval = Number(finalSalaryCalcVal) + Number(ESI_deduction) + Number(PF_deduction) + Number(ESI_EMPR_deduction) + Number(PF_Emper_deduction) + Number(profTaxCalcVal);

      finalValueCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === true ? Number(totalPointsValueCalc) - (Number(acutalERAValCalc) + Number(CTC_Calcval)) + Number(revenueAmountCalc) : 0;

      final_Value_PenaltyCalcval = finalValueCalcVal - (Number(penaltyAmtCalculationVal) + Number(lossDed) + Number(OtherDed));

      final_Value_PenaltyCalcval = final_Value_PenaltyCalcval > 0 ? (finalValueCalcVal >= grossValue ? finalValueCalcVal : final_Value_PenaltyCalcval) : 0;

      let finalValueReviewCalc = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true ? (final_Value_PenaltyCalcval < -acutalERAValCalc ? "REVENUE LOSS" : "OK") : "";

      let finalValueStatus = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true ? (finalValueCalcVal > -10000 ? (finalValueCalcVal >= -2000 ? (finalValueCalcVal >= 0 ? (finalValueCalcVal >= 2000 ? (finalValueCalcVal >= 4000 ? "HIGH" : "OK") : "LOSS OK") : "LOSS") : "VERY LOSS") : "VERY VERY LOSS") : "";

      let revenuePenaltyStatus =
        CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true ? (final_Value_PenaltyCalcval > -10000 ? (final_Value_PenaltyCalcval >= -2000 ? (final_Value_PenaltyCalcval >= 0 ? (final_Value_PenaltyCalcval >= 2000 ? (final_Value_PenaltyCalcval >= 4000 ? "HIGH" : "OK") : "LOSS OK") : "LOSS") : "VERY LOSS") : "VERY VERY LOSS") : "";

      //   FIXED CALCULATION START------------------
      //FIXED
      let Fixed_Loss_Deduction_Calcval = 0;

      let Fixed_NET_Salary = totalshiftCalcVal === 0 ? 0 : (grossValue / totalshiftCalcVal) * totalpaiddaycalVal;
      let Fixed_Basic_CalcVal =
        totalshiftCalcVal === 0
          ? 0
          : (actualBasicCalcVal / totalshiftCalcVal) * totalpaiddaycalVal === 0
            ? 0
            : (actualBasicCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0
              ? (actualBasicCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01
              : 0;

      let Fixed_HRA_CalcVal =
        totalshiftCalcVal === 0
          ? 0
          : (actualHraCalcVal / totalshiftCalcVal) * totalpaiddaycalVal === 0
            ? 0
            : (actualHraCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0
              ? (actualHraCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01
              : 0;

      let Fixed_Conveyance_CalcVal =
        totalshiftCalcVal === 0
          ? 0
          : (actualConveyanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal === 0
            ? 0
            : (actualConveyanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0
              ? (actualConveyanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01
              : 0;

      let Fixed_Med_Allowace =
        totalshiftCalcVal === 0
          ? 0
          : (actualMedicalAllowCalcVal / totalshiftCalcVal) * totalpaiddaycalVal === 0
            ? 0
            : (actualMedicalAllowCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0
              ? (actualMedicalAllowCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01
              : 0;

      let Fixed_PROD_Allowace =
        totalshiftCalcVal === 0
          ? 0
          : (prodAllowanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal === 0
            ? 0
            : (prodAllowanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0
              ? (prodAllowanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01
              : 0;

      let Fixed_OTHER_Allowace =
        totalshiftCalcVal === 0
          ? 0
          : (actualOtherCalVAL / totalshiftCalcVal) * totalpaiddaycalVal === 0
            ? 0
            : (actualOtherCalVAL / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0
              ? (actualOtherCalVAL / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01
              : 0;

      let Fixed_NET_Salary1 = Fixed_Basic_CalcVal + Fixed_HRA_CalcVal + Fixed_Conveyance_CalcVal + Fixed_Med_Allowace + Fixed_PROD_Allowace + Fixed_OTHER_Allowace;

      //PFDAYS AND PFDEDUCTION
      //    let pfdatcal = 0;
      //    let daysp = totalshiftCalcVal - totalasbleaveCalcVal;
      //    let IsExDate = item.isenddate ? item.isenddate : false;
      //Dftdate = pfesifromdate findDate = monthstart fromdate or month fromdate
      //    let pfmode = item.pfesifromdate > findDate ? "S" : IsExDate ? "E" : "ALL";
      //    let PLOP = (findTotalNoOfDays && findTotalNoOfDays.weekoff) + (findTotalNoOfDays && findTotalNoOfDays.clsl);

      //    pfdatcal = pfmode === "S" || pfmode === "E" ? pfdatcal + (findTotalNoOfDays && findTotalNoOfDays.weekoff) + (findTotalNoOfDays && findTotalNoOfDays.clsl) + totalshiftCalcVal : totalshiftCalcVal + PLOP;
      //    let PfDate = daysp >= pfdatcal ? ((IsExDate === true && item.pfesienddate) < findDate ? "0" : Number(pfdatcal) + Number(totalasbleaveCalcVal)) : daysp + totalasbleaveCalcVal;

      //    let pfDaysVal = item.pfdeduction === true ? PfDate : 0;
      //    let pfAmount = item.pfdeduction === true ? Number(findPFpercentage) / 100 : 0;

      let Fixed_PF_deduction = pfDaysVal > 0 && totalshiftCalcVal > 0 ? ((Number(Fixed_Basic_CalcVal) / Number(totalshiftCalcVal)) * Number(pfDaysVal) * Number(pfAmount)).toFixed(2) : 0;

      //    let Esiper = item.esideduction === true ? Number(findESIpercentage) / 100 : 0;

      let Fixed_ESI_deduction = grossValue >= findEsiMAXSalary || oldgross >= findEsiMAXSalary ? 0 : pfDaysVal > 0 ? (Fixed_NET_Salary1 / totalshiftCalcVal) * pfDaysVal * Esiper : 0;

      let FixedfindprofTaxAmt = profTaxMaster.find((d) => d.company === item.company && d.branch === item.branch && Number(d.fromamount) <= Fixed_NET_Salary1 && Number(d.toamount) + 0.99 >= Fixed_NET_Salary1);

      let Fixed_TaxCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.tax === false ? 0 : FixedfindprofTaxAmt ? Number(FixedfindprofTaxAmt.taxamount) : 0;

      let FixedpfAmount1 = findEmployerPercentage > 0 ? findEmployerPercentage / 100 : 0;

      let Fixed_PF_Emper_deduction = FixedpfAmount1 > 0 && totalshiftCalcVal > 0 ? (Fixed_Basic_CalcVal / totalshiftCalcVal) * pfDaysVal * FixedpfAmount1 : 0;
      // // let pfEmployerDeductionCalc = PF_Emper_deduction
      //ESI-DEDCUTION
      //    let ESI_EMPR_Perncetage = item.esideduction === true ? Number(findEmployerESIPercentage) / 100 : 0;

      let Fixed_ESI_EMPR_deduction = grossValue >= findEsiMAXSalary || oldgross >= findEsiMAXSalary ? 0 : pfDaysVal > 0 && totalshiftCalcVal > 0 ? (Fixed_NET_Salary1 / totalshiftCalcVal) * pfDaysVal * ESI_EMPR_Perncetage : 0;

      let Fixed_Shift_Allowance = totalNoOfDaysCalcVal > 0 ? (1000 / tond) * noshiftlogvalfinal : 0;

      let Fixed_Total_Deductions = Number(Fixed_PF_deduction) + Number(Fixed_ESI_deduction) + Number(Fixed_TaxCalcVal) + Number(Fixed_PF_Emper_deduction) + Number(Fixed_ESI_EMPR_deduction);

      let Fixed_Salary = Fixed_NET_Salary1 - (Number(Fixed_PF_deduction) + Number(Fixed_ESI_deduction) + Number(Fixed_TaxCalcVal) + Number(Fixed_PF_Emper_deduction) + Number(Fixed_ESI_EMPR_deduction)) + Number(Fixed_Shift_Allowance);

      let Fixed_Salary_penalty = Fixed_Salary + Number(penaltyAmtCalculationVal) > 0 ? (Fixed_Salary >= grossValue ? Fixed_Salary : Fixed_Salary + (penaltyAmtCalculationVal + Fixed_Loss_Deduction_Calcval + OtherDed)) : 0;

      let Fixed_LOP1 = Fixed_Salary < grossValue ? (Fixed_Salary > 0 && grossValue > 0 ? totalshiftCalcVal - (Fixed_Salary * totalshiftCalcVal) / grossValue : totalshiftCalcVal) : 0;

      let Fixed_Lop_Days = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 || grossValue === 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * Fixed_NET_Salary1) / grossValue < 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * Fixed_NET_Salary1) / grossValue;

      let Fixed_Leave_Dedcution = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 || grossValue === 0 ? 0 : (grossValue / totalshiftCalcVal) * (totalshiftCalcVal - (totalshiftCalcVal * Fixed_NET_Salary1) / grossValue < 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * Fixed_NET_Salary1) / grossValue);

      // let totalPointsValueCalc = item.department === "PROD_GrubHub" ? (AcheivedPointsCalcVal / 1) * 360 : item.department == "TRAINEE" ? (AcheivedPointsCalcVal / 8.5) * 70 : (AcheivedPointsCalcVal / 8.5) * 60;
      //    let Mvalue = (findAcPointVal ? Number(findAcPointVal.dividevalue) : 0)
      //    let Dvalue = (findAcPointVal ? Number(findAcPointVal.multiplevalue) : 0)
      //    let totalPointsValueCalc =AcheivedPointsCalcVal ? (((Number(AcheivedPointsCalcVal) / Dvalue) * Mvalue) ? (Number(AcheivedPointsCalcVal) / Dvalue) * Mvalue : 0) : 0

      //    let acutalERAValCalc = totalasbleaveCalcVal > 2 ? (ERAAmountCalcVal - (ERAAmountCalcVal / totalshiftCalcVal) * totalasbleaveCalcVal).toFixed(2) : Number(ERAAmountCalcVal);

      let Fixed_CTC_Calcval = Fixed_Salary + Number(Fixed_PF_deduction) + Number(Fixed_ESI_deduction) + Number(Fixed_TaxCalcVal) + Number(Fixed_PF_Emper_deduction) + Number(Fixed_ESI_EMPR_deduction);
      let FIXED_Final_Value = Number(totalPointsValueCalc) - (Number(acutalERAValCalc) + Number(Fixed_CTC_Calcval)) + Number(revenueAmountCalc);

      let Fixed_Acutal_Deduction_Calc =
        CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true ? (Number(totalPointsValueCalc) + Number(revenueAmountCalc) - (Number(Fixed_CTC_Calcval) + Number(Shortage1ValCalc)) < 0 ? Number(totalPointsValueCalc) + Number(revenueAmountCalc) - (Number(Fixed_CTC_Calcval) + Number(Shortage1ValCalc)) : 0) : 0;

      let Fixed_Min_Deduction = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true ? (Number(Shortage1ValCalc) + Number(Fixed_Acutal_Deduction_Calc) < 0 ? Number(Shortage1ValCalc) + Number(Fixed_Acutal_Deduction_Calc) : 0) : 0;

      let FLossDeduction = Fixed_Min_Deduction + (Fixed_Acutal_Deduction_Calc - OtherDed - Fixed_Min_Deduction);
      Fixed_Loss_Deduction_Calcval = FLossDeduction > 0 ? FLossDeduction : -1 * FLossDeduction;

      //RE CALCULATION STARTED

      Fixed_NET_Salary = totalshiftCalcVal === 0 ? 0 : (grossValue / totalshiftCalcVal) * totalpaiddaycalVal;
      Fixed_Basic_CalcVal =
        totalshiftCalcVal === 0
          ? 0
          : (actualBasicCalcVal / totalshiftCalcVal) * totalpaiddaycalVal === 0
            ? 0
            : (actualBasicCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0
              ? (actualBasicCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01
              : 0;

      Fixed_HRA_CalcVal =
        totalshiftCalcVal === 0
          ? 0
          : (actualHraCalcVal / totalshiftCalcVal) * totalpaiddaycalVal === 0
            ? 0
            : (actualHraCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0
              ? (actualHraCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01
              : 0;

      Fixed_Conveyance_CalcVal =
        totalshiftCalcVal === 0
          ? 0
          : (actualConveyanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal === 0
            ? 0
            : (actualConveyanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0
              ? (actualConveyanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01
              : 0;

      Fixed_Med_Allowace =
        totalshiftCalcVal === 0
          ? 0
          : (actualMedicalAllowCalcVal / totalshiftCalcVal) * totalpaiddaycalVal === 0
            ? 0
            : (actualMedicalAllowCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0
              ? (actualMedicalAllowCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01
              : 0;

      Fixed_PROD_Allowace =
        totalshiftCalcVal === 0
          ? 0
          : (prodAllowanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal === 0
            ? 0
            : (prodAllowanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0
              ? (prodAllowanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01
              : 0;

      Fixed_OTHER_Allowace =
        totalshiftCalcVal === 0
          ? 0
          : (actualOtherCalVAL / totalshiftCalcVal) * totalpaiddaycalVal === 0
            ? 0
            : (actualOtherCalVAL / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0
              ? (actualOtherCalVAL / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01
              : 0;

      Fixed_NET_Salary1 = Fixed_Basic_CalcVal + Fixed_HRA_CalcVal + Fixed_Conveyance_CalcVal + Fixed_Med_Allowace + Fixed_PROD_Allowace + Fixed_OTHER_Allowace;

      //PFDAYS AND PFDEDUCTION

      //   PfDate = daysp >= pfdatcal ? ((IsExDate == true && item.pfesienddate) < findDate ? "0" : Number(pfdatcal) + Number(totalasbleaveCalcVal)) : daysp + totalasbleaveCalcVal;

      Fixed_PF_deduction = pfDaysVal > 0 ? ((Number(Fixed_Basic_CalcVal) / Number(totalshiftCalcVal)) * Number(pfDaysVal) * Number(pfAmount)).toFixed(2) : 0;

      Fixed_ESI_deduction = grossValue >= findEsiMAXSalary || oldgross >= findEsiMAXSalary ? 0 : pfDaysVal > 0 ? (Fixed_NET_Salary1 / totalshiftCalcVal) * pfDaysVal * Esiper : 0;

      findprofTaxAmt = profTaxMaster.find((d) => d.company == item.company && d.branch === item.branch && Number(d.fromamount) <= Fixed_NET_Salary1 && Number(d.toamount) + 0.99 >= Fixed_NET_Salary1);

      Fixed_TaxCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.tax === false ? 0 : findprofTaxAmt ? Number(findprofTaxAmt.taxamount) : 0;

      Fixed_PF_Emper_deduction = FixedpfAmount1 > 0 && totalshiftCalcVal > 0 ? (Fixed_Basic_CalcVal / totalshiftCalcVal) * pfDaysVal * FixedpfAmount1 : 0;

      Fixed_ESI_EMPR_deduction = grossValue >= findEsiMAXSalary || oldgross >= findEsiMAXSalary ? 0 : pfDaysVal > 0 ? (Fixed_NET_Salary1 / totalshiftCalcVal) * pfDaysVal * ESI_EMPR_Perncetage : 0;

      Fixed_Total_Deductions = Number(Fixed_PF_deduction) + Number(Fixed_ESI_deduction) + Number(Fixed_TaxCalcVal) + Number(Fixed_PF_Emper_deduction) + Number(Fixed_ESI_EMPR_deduction);

      Fixed_Salary = Fixed_NET_Salary1 - (Number(Fixed_PF_deduction) + Number(Fixed_ESI_deduction) + Number(Fixed_TaxCalcVal) + Number(Fixed_PF_Emper_deduction) + Number(Fixed_ESI_EMPR_deduction)) + Number(Fixed_Shift_Allowance);

      Fixed_Salary_penalty = Fixed_Salary + Number(penaltyAmtCalculationVal) > 0 ? (Fixed_Salary >= grossValue ? Fixed_Salary : Fixed_Salary + (penaltyAmtCalculationVal + Fixed_Loss_Deduction_Calcval + OtherDed)) : 0;

      Fixed_LOP1 = Fixed_Salary < grossValue ? (Fixed_Salary > 0 ? totalshiftCalcVal - (Fixed_Salary * totalshiftCalcVal) / grossValue : totalshiftCalcVal) : 0;

      Fixed_Lop_Days = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 || grossValue === 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * Fixed_NET_Salary1) / grossValue < 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * Fixed_NET_Salary1) / grossValue;

      Fixed_Leave_Dedcution = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 || grossValue === 0 ? 0 : (grossValue / totalshiftCalcVal) * (totalshiftCalcVal - (totalshiftCalcVal * Fixed_NET_Salary1) / grossValue < 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * Fixed_NET_Salary1) / grossValue);

      // totalPointsValueCalc = item.department === "PROD_GrubHub" ? (AcheivedPointsCalcVal / 1) * 360 : item.department == "TRAINEE" ? (AcheivedPointsCalcVal / 8.5) * 70 : (AcheivedPointsCalcVal / 8.5) * 60;
      // let Mvalue = (findAcPointVal ? Number(findAcPointVal.dividevalue) : 0);
      // let Dvalue = (findAcPointVal ? Number(findAcPointVal.multiplevalue) : 0);
      totalPointsValueCalc = AcheivedPointsCalcVal ? ((Number(AcheivedPointsCalcVal) / Dvalue) * Mvalue ? (Number(AcheivedPointsCalcVal) / Dvalue) * Mvalue : 0) : 0;

      acutalERAValCalc = totalasbleaveCalcVal > 2 ? (ERAAmountCalcVal - (ERAAmountCalcVal / totalshiftCalcVal) * totalasbleaveCalcVal).toFixed(2) : Number(ERAAmountCalcVal);

      Fixed_CTC_Calcval = Fixed_Salary + Number(Fixed_PF_deduction) + Number(Fixed_ESI_deduction) + Number(Fixed_TaxCalcVal) + Number(Fixed_PF_Emper_deduction) + Number(Fixed_ESI_EMPR_deduction);
      FIXED_Final_Value = Number(totalPointsValueCalc) - (Number(acutalERAValCalc) + Number(Fixed_CTC_Calcval)) + Number(revenueAmountCalc);

      let PROD_Loss_Deduction = 0;

      let PROD_NET_Salary = Number(AcheivedPercentCalcVal) > 0 && grossValue > 0 ? grossValue * (Number(AcheivedPercentCalcVal) / 100) : 0;
      let PROD_BASIC_ValCalc =
        (actualBasicCalcVal * AcheivedPercentCalcVal) / 100 === 0
          ? 0
          : ((actualBasicCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
            ? ((actualBasicCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
            : 0;

      let PROD_HRA_ValCalc =
        (actualHraCalcVal * AcheivedPercentCalcVal) / 100 === 0
          ? 0
          : ((actualHraCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
            ? ((actualHraCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
            : 0;

      let PROD_CONVEYANCE_ValCalc =
        (actualConveyanceCalcVal * AcheivedPercentCalcVal) / 100 === 0
          ? 0
          : ((actualConveyanceCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
            ? ((actualConveyanceCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
            : 0;
      let PROD_MEDICALALLOW_ValCalc =
        (actualMedicalAllowCalcVal * AcheivedPercentCalcVal) / 100 === 0
          ? 0
          : ((actualMedicalAllowCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
            ? ((actualMedicalAllowCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
            : 0;
      // console.log(prodAllowanceCalcVal, AcheivedPercentCalcVal, PROD_NET_Salary, penaltyAmtCalculationVal, PROD_Loss_Deduction, OtherDed, 'PROD_PRODUCTION_ValCalc');
      let PROD_PRODUCTION_ValCalc =
        (prodAllowanceCalcVal * AcheivedPercentCalcVal) / 100 === 0
          ? 0
          : ((prodAllowanceCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
            ? ((prodAllowanceCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
            : 0;
      let PROD_OTHER_ValCalc =
        (actualOtherCalVAL * AcheivedPercentCalcVal) / 100 === 0
          ? 0
          : ((actualOtherCalVAL * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
            ? ((actualOtherCalVAL * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
            : 0;
      let PROD_NET_Salary1 = PROD_BASIC_ValCalc + PROD_HRA_ValCalc + PROD_CONVEYANCE_ValCalc + PROD_MEDICALALLOW_ValCalc + PROD_PRODUCTION_ValCalc + PROD_OTHER_ValCalc;

      //PFDAYS AND PFDEDUCTION

      let PROD_PF_deduction = pfDaysVal > 0 ? ((Number(PROD_BASIC_ValCalc) / Number(totalshiftCalcVal)) * Number(pfDaysVal) * Number(pfAmount)).toFixed(2) : 0;

      // let Esiper = item.esideduction === true ? Number(findESIpercentage) / 100 : 0;

      let PROD_ESI_deduction = grossValue >= findEsiMAXSalary || oldgross >= findEsiMAXSalary ? 0 : pfDaysVal > 0 ? (PROD_NET_Salary1 / totalshiftCalcVal) * pfDaysVal * Esiper : 0;

      let PRODfindprofTaxAmt = profTaxMaster.find((d) => d.company === item.company && d.branch === item.branch && Number(d.fromamount) <= PROD_NET_Salary1 && Number(d.toamount) + 0.99 >= PROD_NET_Salary1);

      let PROD_TaxCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.tax === false ? 0 : PRODfindprofTaxAmt ? Number(PRODfindprofTaxAmt.taxamount) : 0;

      let PRODpfAmount1 = findEmployerPercentage > 0 ? findEmployerPercentage / 100 : 0;

      let PROD_PF_Emper_deduction = PRODpfAmount1 > 0 && totalshiftCalcVal > 0 ? (PROD_BASIC_ValCalc / totalshiftCalcVal) * pfDaysVal * PRODpfAmount1 : 0;
      // // let pfEmployerDeductionCalc = PF_Emper_deduction
      //ESI-DEDCUTION
      // let ESI_EMPR_Perncetage = item.esideduction === true ? Number(findEmployerESIPercentage) / 100 : 0;

      let PROD_ESI_EMPR_deduction = grossValue >= findEsiMAXSalary || oldgross >= findEsiMAXSalary ? 0 : pfDaysVal > 0 && totalshiftCalcVal > 0 ? (PROD_NET_Salary1 / totalshiftCalcVal) * pfDaysVal * ESI_EMPR_Perncetage : 0;

      let PROD_Total_deductions = Number(PROD_PF_deduction) + Number(PROD_ESI_deduction) + Number(PROD_TaxCalcVal) + Number(PROD_PF_Emper_deduction) + Number(PROD_ESI_EMPR_deduction);

      let PROD_Shift_Allowance = totalNoOfDaysCalcVal > 0 && shiftallowancetargetfinal > 0 ? ((1000 / tond) * noshiftlogvalfinal * (allowancepointCalcVal > 0 ? (allowancepointCalcVal * 100) / shiftallowancetargetfinal : 0)) / 100 : 0;

      let PROD_SALARY_Calcval = PROD_NET_Salary1 - PROD_Total_deductions + PROD_Shift_Allowance;

      let PROD_SALARY_PENALTY_Calcval = PROD_SALARY_Calcval + penaltyAmtCalculationVal > 0 ? (PROD_SALARY_Calcval >= grossValue ? PROD_SALARY_Calcval : PROD_SALARY_Calcval + penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed) : 0;

      let PROD_LOP_days = PROD_SALARY_Calcval < grossValue ? (PROD_SALARY_Calcval > 0 && grossValue > 0 ? Math.round(totalshiftCalcVal - (PROD_SALARY_Calcval * totalshiftCalcVal) / grossValue) : totalshiftCalcVal) : 0;

      let PROD_LOP_calcval = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 || grossValue === 0 ? 0 : Math.round(totalshiftCalcVal - (totalshiftCalcVal * PROD_NET_Salary1) / grossValue) < 0 ? 0 : Math.round(totalshiftCalcVal - (totalshiftCalcVal * PROD_NET_Salary1) / grossValue);

      // let totalPointsValueCalc =  ( CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === true &&  AcheivedPointsCalcVal) ? ((Number(AcheivedPointsCalcVal) / Dvalue) * Mvalue ? (Number(AcheivedPointsCalcVal) / Dvalue) * Mvalue : 0 ) : 0 ;

      //  item.department === "PROD_GrubHub" ? (AcheivedPointsCalcVal / 1) * 360 : item.department === "TRAINEE" ? (AcheivedPointsCalcVal / 8.5) * 70 : (AcheivedPointsCalcVal / 8.5) * 60;

      let PROD_Leave_Deduction = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 || grossValue === 0 ? 0 : (grossValue / totalshiftCalcVal) * (totalshiftCalcVal - (totalshiftCalcVal * PROD_NET_Salary1) / grossValue < 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * PROD_NET_Salary1) / grossValue);

      let PROD_CTC_Valcalc = PROD_SALARY_Calcval + Number(PROD_PF_deduction) + Number(PROD_ESI_deduction) + Number(PROD_TaxCalcVal) + Number(PROD_PF_Emper_deduction) + Number(PROD_ESI_EMPR_deduction);

      let PROD_Final_Value_Calc = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === false ? 0 : Number(totalPointsValueCalc) - (Number(acutalERAValCalc) + Number(PROD_CTC_Valcalc)) + Number(revenueAmountCalc);

      let PROD_Actual_Deduction_Val = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true ? (totalPointsValueCalc + revenueAmountCalc - (PROD_CTC_Valcalc + Shortage1ValCalc) < 0 ? totalPointsValueCalc + revenueAmountCalc - (PROD_CTC_Valcalc + Shortage1ValCalc) : 0) : 0;

      let PROD_Minimum_Deduction_Val = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true ? (Number(Shortage1ValCalc) + PROD_Actual_Deduction_Val < 0 ? Number(Shortage1ValCalc) + PROD_Actual_Deduction_Val : 0) : 0;

      PROD_Loss_Deduction = 0;

      let PLossDeduction = PROD_Minimum_Deduction_Val + (PROD_Actual_Deduction_Val - OtherDed - PROD_Minimum_Deduction_Val);

      PROD_Loss_Deduction = PLossDeduction > 0 ? PLossDeduction : -1 * PLossDeduction;

      //RE-CALULCATION

      PROD_BASIC_ValCalc =
        (actualBasicCalcVal * AcheivedPercentCalcVal) / 100 === 0
          ? 0
          : ((actualBasicCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
            ? ((actualBasicCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
            : 0;

      PROD_HRA_ValCalc =
        (actualHraCalcVal * AcheivedPercentCalcVal) / 100 === 0
          ? 0
          : ((actualHraCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
            ? ((actualHraCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
            : 0;

      PROD_CONVEYANCE_ValCalc =
        (actualConveyanceCalcVal * AcheivedPercentCalcVal) / 100 === 0
          ? 0
          : ((actualConveyanceCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
            ? ((actualConveyanceCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
            : 0;
      PROD_MEDICALALLOW_ValCalc =
        (actualMedicalAllowCalcVal * AcheivedPercentCalcVal) / 100 === 0
          ? 0
          : ((actualMedicalAllowCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
            ? ((actualMedicalAllowCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
            : 0;
      PROD_PRODUCTION_ValCalc =
        (prodAllowanceCalcVal * AcheivedPercentCalcVal) / 100 === 0
          ? 0
          : ((prodAllowanceCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
            ? ((prodAllowanceCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
            : 0;
      PROD_OTHER_ValCalc =
        (actualOtherCalVAL * AcheivedPercentCalcVal) / 100 === 0
          ? 0
          : ((actualOtherCalVAL * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
            ? ((actualOtherCalVAL * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
            : 0;

      PROD_NET_Salary1 = PROD_BASIC_ValCalc + PROD_HRA_ValCalc + PROD_CONVEYANCE_ValCalc + PROD_MEDICALALLOW_ValCalc + PROD_PRODUCTION_ValCalc + PROD_OTHER_ValCalc;

      PROD_PF_deduction = pfDaysVal > 0 ? ((Number(PROD_BASIC_ValCalc) / Number(totalshiftCalcVal)) * Number(pfDaysVal) * Number(pfAmount)).toFixed(2) : 0;

      PROD_ESI_deduction = grossValue >= findEsiMAXSalary || oldgross >= findEsiMAXSalary ? 0 : pfDaysVal > 0 ? (PROD_NET_Salary1 / totalshiftCalcVal) * pfDaysVal * Esiper : 0;

      PRODfindprofTaxAmt = profTaxMaster.find((d) => d.company === item.company && d.branch === item.branch && Number(d.fromamount) <= PROD_NET_Salary1 && Number(d.toamount) + 0.99 >= PROD_NET_Salary1);

      PROD_TaxCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.tax === false ? 0 : PRODfindprofTaxAmt ? Number(PRODfindprofTaxAmt.taxamount) : 0;

      PROD_PF_Emper_deduction = PRODpfAmount1 > 0 && totalshiftCalcVal > 0 ? (PROD_BASIC_ValCalc / totalshiftCalcVal) * pfDaysVal * PRODpfAmount1 : 0;

      PROD_ESI_EMPR_deduction = grossValue >= findEsiMAXSalary || oldgross >= findEsiMAXSalary ? 0 : pfDaysVal > 0 ? (PROD_NET_Salary1 / totalshiftCalcVal) * pfDaysVal * ESI_EMPR_Perncetage : 0;

      PROD_Total_deductions = Number(PROD_PF_deduction) + Number(PROD_ESI_deduction) + Number(PROD_TaxCalcVal) + Number(PROD_PF_Emper_deduction) + Number(PROD_ESI_EMPR_deduction);

      PROD_Shift_Allowance = totalNoOfDaysCalcVal > 0 && shiftallowancetargetfinal > 0 ? ((1000 / tond) * noshiftlogvalfinal * (allowancepointCalcVal > 0 ? (allowancepointCalcVal * 100) / shiftallowancetargetfinal : 0)) / 100 : 0;

      PROD_SALARY_Calcval = PROD_NET_Salary1 - PROD_Total_deductions + PROD_Shift_Allowance;

      PROD_SALARY_PENALTY_Calcval = PROD_SALARY_Calcval + penaltyAmtCalculationVal > 0 ? (PROD_SALARY_Calcval >= grossValue ? PROD_SALARY_Calcval : PROD_SALARY_Calcval + penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed) : 0;

      PROD_LOP_days = PROD_SALARY_Calcval < grossValue ? (PROD_SALARY_Calcval > 0 && grossValue > 0 ? Math.round(totalshiftCalcVal - (PROD_SALARY_Calcval * totalshiftCalcVal) / grossValue) : totalshiftCalcVal) : 0;

      PROD_LOP_calcval = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 || grossValue === 0 ? 0 : Math.round(totalshiftCalcVal - (totalshiftCalcVal * PROD_NET_Salary1) / grossValue) < 0 ? 0 : Math.round(totalshiftCalcVal - (totalshiftCalcVal * PROD_NET_Salary1) / grossValue);

      // totalPointsValueCalc = AcheivedPointsCalcVal ? ((Number(AcheivedPointsCalcVal) / Dvalue) * Mvalue ? (Number(AcheivedPointsCalcVal) / Dvalue) * Mvalue : 0 ) : 0
      //  item.department === "PROD_GrubHub" ? (AcheivedPointsCalcVal / 1) * 360 : item.department === "TRAINEE" ? (AcheivedPointsCalcVal / 8.5) * 70 : (AcheivedPointsCalcVal / 8.5) * 60;

      PROD_Leave_Deduction = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 || grossValue === 0 ? 0 : (grossValue / totalshiftCalcVal) * (totalshiftCalcVal - (totalshiftCalcVal * PROD_NET_Salary1) / grossValue < 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * PROD_NET_Salary1) / grossValue);

      PROD_CTC_Valcalc = PROD_SALARY_Calcval + Number(PROD_PF_deduction) + Number(PROD_ESI_deduction) + Number(PROD_TaxCalcVal) + Number(PROD_PF_Emper_deduction) + Number(PROD_ESI_EMPR_deduction);

      PROD_Final_Value_Calc = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === false ? 0 : Number(totalPointsValueCalc) - (Number(acutalERAValCalc) + Number(PROD_CTC_Valcalc)) + Number(revenueAmountCalc);

      ////daystatus---------------------------------------------------------------------------------------------------------
      let currentMonthAttendanceVal = findTotalNoOfDaysNxtMonth ? Number(findTotalNoOfDaysNxtMonth.lopcount) : 0;
      let currentMonthAvgVal = findPointsDetailsNxtMonth ? Number(findPointsDetailsNxtMonth.avgpoint).toFixed(2) : 0;

      let currMonAvgFinalcalVal = item.currmonthavglog && item.currmonthavglog.length > 0 && currMonAvgLogVal && currMonAvgLogVal.length > 0 ? Number(currMonAvgLogVal[currMonAvgLogVal.length - 1].value) : currentMonthAvgVal;

      let currMonAttFinalcalVal = item.currmonthattlog && item.currmonthattlog.length > 0 && currMonAttLogVal && currMonAttLogVal.length > 0 ? Number(currMonAttLogVal[currMonAttLogVal.length - 1].value) : currentMonthAttendanceVal;

      const ctodate = new Date(findmonthenddate).toISOString();
      const CLOP = Number(currMonAttFinalcalVal); // Current Leave or Points
      const CTotalPointsAverage = Number(currMonAvgFinalcalVal);
      let getpaidStatusVal = "";

      paidStatusFix
        .filter((data) => {
          const isMonthAndDepartmentMatched = data.month.toLowerCase() === selectedMonth.toLowerCase() && data.department.includes(item.department) && data.year == selectedYear;

          const isReasonStatusValid = item.reasondate >= findDate && (item.resonablestatus === "Absconded" || item.resonablestatus === "Terminate") ? data.frequency === "REJECT" : item.reasondate >= findDate && item.resonablestatus === "Releave Employee" ? data.frequency === "HOLD" : true;

          const isValueAndPointValid = Number(data.fromvalue) <= Number(totalasbleaveCalcVal) && Number(data.tovalue) >= Number(totalasbleaveCalcVal) && Number(data.frompoint) <= Number(AcheivedPercentCalcVal) && Number(data.topoint) >= Number(AcheivedPercentCalcVal);

          return isMonthAndDepartmentMatched && isReasonStatusValid && isValueAndPointValid;
        })
        .sort((a, b) => {
          if (a.currentabsentvalue !== b.currentabsentvalue) {
            return b.currentabsentvalue - a.currentabsentvalue; // Sort descending
          }
          return b.currentachievedvalue - a.currentachievedvalue; // Sort descending
        })
        .forEach((row) => {
          let F1 = false,
            F2 = false,
            F3 = false,
            F4 = false;

          // Check AbsentMode
          const totalLeave = totalasbleaveCalcVal;
          const absentValue = parseFloat(row.fromvalue);

          switch (row.absentmodes) {
            case "Less than or Equal":
              F1 = totalLeave <= absentValue;
              break;
            case "Less than":
              F1 = totalLeave < absentValue;
              break;
            case "Greater than":
              F1 = totalLeave > absentValue;
              break;
            case "Greater than or Equal":
              F1 = totalLeave >= absentValue;
              break;
            case "Between":
              F1 = totalLeave >= absentValue && totalLeave <= parseFloat(row.tovalue);
              break;
            default:
              F1 = false;
          }

          // Check AchievedMode
          const achievedPerc = AcheivedPercentCalcVal;
          const achievedValue = parseFloat(row.frompoint);

          switch (row.achievedmodes) {
            case "Less than or Equal":
              F2 = achievedPerc <= achievedValue;
              break;
            case "Less than":
              F2 = achievedPerc < achievedValue;
              break;
            case "Greater than":
              F2 = achievedPerc > achievedValue;
              break;
            case "Greater than or Equal":
              F2 = achievedPerc >= achievedValue;
              break;
            case "Between":
              F2 = achievedPerc >= achievedValue && achievedPerc <= parseFloat(row.topoint);
              break;
            default:
              F2 = false;
          }

          // Date comparison
          const now = new Date();
          const fiveDaysAgo = new Date(now);
          fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

          if (new Date(ctodate) > fiveDaysAgo) {
            F3 = true;
            F4 = true;
          } else {
            // Current Absent Mode
            const currentAbsentValue = parseFloat(row.currentabsentvalue);
            switch (row.currentabsentmodes) {
              case "Less than or Equal":
                F3 = CLOP <= currentAbsentValue;
                break;
              case "Less than":
                F3 = CLOP < currentAbsentValue;
                break;
              case "Greater than":
                F3 = CLOP > currentAbsentValue;
                break;
              case "Greater than or Equal":
                F3 = CLOP >= currentAbsentValue;
                break;

              default:
                F3 = false;
            }

            // Current Achieved Mode
            const currentAchievedValue = parseFloat(row.currentachievedvalue);
            switch (row.currentachievedmodes) {
              case "Less than or Equal":
                F4 = CTotalPointsAverage <= currentAchievedValue;
                break;
              case "Less than":
                F4 = CTotalPointsAverage < currentAchievedValue;
                break;
              case "Greater than":
                F4 = CTotalPointsAverage > currentAchievedValue;
                break;
              case "Greater than or Equal":
                F4 = CTotalPointsAverage >= currentAchievedValue;
                break;
              default:
                F4 = false;
            }
          }

          // Final check
          if (F1 && F2 && F3 && F4) {
            getpaidStatusVal = row.paidstatus;

            // if (row.Frequency === 'HOLD' || row.Frequency === 'REJECT') {
            //   empObj.HoldPersentage = 0;
            //   empObj.ApReason = 'Reject Auto Hold Full';
            // } else {
            //   empObj.HoldPersentage = 0;
            //   empObj.ApReason = '';
            // }
          }
        });
      // console.log(getpaidStatusVal, 'getpaidStatusVal');
      // Set paidStatusVal if a matching row is found
      let paidStatusVal = getpaidStatusVal === "" ? "No Status" : getpaidStatusVal;

      let getPayTypes = payruncontrolmaster.find((d) => {
        return d.filtertype === "Individual" && d.empname.includes(item.companyname)
          ? d.choosetype === false && d.choosestatus === "Both"
            ? (d.achievedsymbol === "Between"
              ? Number(AcheivedPercentCalcVal) >= Number(d.achievedfrom) && Number(AcheivedPercentCalcVal) <= Number(d.achievedto)
              : d.achievedsymbol === "Less than or equal"
                ? Number(AcheivedPercentCalcVal) <= Number(d.achieved)
                : d.achievedsymbol === "Less than"
                  ? Number(AcheivedPercentCalcVal) < Number(d.achieved)
                  : d.achievedsymbol === "Greater than"
                    ? Number(AcheivedPercentCalcVal) > Number(d.achieved)
                    : Number(AcheivedPercentCalcVal) >= Number(d.achieved)) &&
            (d.newgrosssymbol === "Between"
              ? Number(grossValue) >= Number(d.newgrossfrom) && Number(grossValue) <= Number(d.newgrossto)
              : d.newgrosssymbol === "Less than or equal"
                ? Number(grossValue) <= Number(d.newgross)
                : d.newgrosssymbol === "Less than"
                  ? Number(grossValue) < Number(d.newgross)
                  : d.newgrosssymbol === "Greater than"
                    ? Number(grossValue) > Number(d.newgross)
                    : Number(grossValue) >= Number(d.newgross))
            : d.choosetype === false && d.choosestatus === "Production"
              ? d.achievedsymbol === "Between"
                ? Number(AcheivedPercentCalcVal) >= Number(d.achievedfrom) && Number(AcheivedPercentCalcVal) <= Number(d.achievedto)
                : d.achievedsymbol === "Less than or equal"
                  ? Number(AcheivedPercentCalcVal) <= Number(d.achieved)
                  : d.achievedsymbol === "Less than"
                    ? Number(AcheivedPercentCalcVal) < Number(d.achieved)
                    : d.achievedsymbol === "Greater than"
                      ? Number(AcheivedPercentCalcVal) > Number(d.achieved)
                      : Number(AcheivedPercentCalcVal) >= Number(d.achieved)
              : d.choosetype === false && d.choosestatus === "New Gross"
                ? d.newgrosssymbol === "Between"
                  ? Number(grossValue) >= Number(d.newgrossfrom) && Number(grossValue) <= Number(d.newgrossto)
                  : d.newgrosssymbol === "Less than or equal"
                    ? Number(grossValue) <= Number(d.newgross)
                    : d.newgrosssymbol === "Less than"
                      ? Number(grossValue) < Number(d.newgross)
                      : d.newgrosssymbol === "Greater than"
                        ? Number(grossValue) > Number(d.newgross)
                        : Number(grossValue) >= Number(d.newgross)
                : d.choosetype === true
          : d.filtertype === "Team" && d.branch.includes(item.branch) && d.unit.includes(item.unit) && d.team.includes(item.team)
            ? d.choosetype === false && d.choosestatus === "Both"
              ? (d.achievedsymbol === "Between"
                ? Number(AcheivedPercentCalcVal) >= Number(d.achievedfrom) && Number(AcheivedPercentCalcVal) <= Number(d.achievedto)
                : d.achievedsymbol === "Less than or equal"
                  ? Number(AcheivedPercentCalcVal) <= Number(d.achieved)
                  : d.achievedsymbol === "Less than"
                    ? Number(AcheivedPercentCalcVal) < Number(d.achieved)
                    : d.achievedsymbol === "Greater than"
                      ? Number(AcheivedPercentCalcVal) > Number(d.achieved)
                      : Number(AcheivedPercentCalcVal) >= Number(d.achieved)) &&
              (d.newgrosssymbol === "Between"
                ? Number(grossValue) >= Number(d.newgrossfrom) && Number(grossValue) <= Number(d.newgrossto)
                : d.newgrosssymbol === "Less than or equal"
                  ? Number(grossValue) <= Number(d.newgross)
                  : d.newgrosssymbol === "Less than"
                    ? Number(grossValue) < Number(d.newgross)
                    : d.newgrosssymbol === "Greater than"
                      ? Number(grossValue) > Number(d.newgross)
                      : Number(grossValue) >= Number(d.newgross))
              : d.choosetype === false && d.choosestatus === "Production"
                ? d.achievedsymbol === "Between"
                  ? Number(AcheivedPercentCalcVal) >= Number(d.achievedfrom) && Number(AcheivedPercentCalcVal) <= Number(d.achievedto)
                  : d.achievedsymbol === "Less than or equal"
                    ? Number(AcheivedPercentCalcVal) <= Number(d.achieved)
                    : d.achievedsymbol === "Less than"
                      ? Number(AcheivedPercentCalcVal) < Number(d.achieved)
                      : d.achievedsymbol === "Greater than"
                        ? Number(AcheivedPercentCalcVal) > Number(d.achieved)
                        : Number(AcheivedPercentCalcVal) >= Number(d.achieved)
                : d.choosetype === false && d.choosestatus === "New Gross"
                  ? d.newgrosssymbol === "Between"
                    ? Number(grossValue) >= Number(d.newgrossfrom) && Number(grossValue) <= Number(d.newgrossto)
                    : d.newgrosssymbol === "Less than or equal"
                      ? Number(grossValue) <= Number(d.newgross)
                      : d.newgrosssymbol === "Less than"
                        ? Number(grossValue) < Number(d.newgross)
                        : d.newgrosssymbol === "Greater than"
                          ? Number(grossValue) > Number(d.newgross)
                          : Number(grossValue) >= Number(d.newgross)
                  : true
            : d.filtertype === "Unit" && d.branch.includes(item.branch) && d.unit.includes(item.unit)
              ? d.choosetype === false && d.choosestatus === "Both"
                ? (d.achievedsymbol === "Between"
                  ? Number(AcheivedPercentCalcVal) >= Number(d.achievedfrom) && Number(AcheivedPercentCalcVal) <= Number(d.achievedto)
                  : d.achievedsymbol === "Less than or equal"
                    ? Number(AcheivedPercentCalcVal) <= Number(d.achieved)
                    : d.achievedsymbol === "Less than"
                      ? Number(AcheivedPercentCalcVal) < Number(d.achieved)
                      : d.achievedsymbol === "Greater than"
                        ? Number(AcheivedPercentCalcVal) > Number(d.achieved)
                        : Number(AcheivedPercentCalcVal) >= Number(d.achieved)) &&
                (d.newgrosssymbol === "Between"
                  ? Number(grossValue) >= Number(d.newgrossfrom) && Number(grossValue) <= Number(d.newgrossto)
                  : d.newgrosssymbol === "Less than or equal"
                    ? Number(grossValue) <= Number(d.newgross)
                    : d.newgrosssymbol === "Less than"
                      ? Number(grossValue) < Number(d.newgross)
                      : d.newgrosssymbol === "Greater than"
                        ? Number(grossValue) > Number(d.newgross)
                        : Number(grossValue) >= Number(d.newgross))
                : d.choosetype === false && d.choosestatus === "Production"
                  ? d.achievedsymbol === "Between"
                    ? Number(AcheivedPercentCalcVal) >= Number(d.achievedfrom) && Number(AcheivedPercentCalcVal) <= Number(d.achievedto)
                    : d.achievedsymbol === "Less than or equal"
                      ? Number(AcheivedPercentCalcVal) <= Number(d.achieved)
                      : d.achievedsymbol === "Less than"
                        ? Number(AcheivedPercentCalcVal) < Number(d.achieved)
                        : d.achievedsymbol === "Greater than"
                          ? Number(AcheivedPercentCalcVal) > Number(d.achieved)
                          : Number(AcheivedPercentCalcVal) >= Number(d.achieved)
                  : d.choosetype === false && d.choosestatus === "New Gross"
                    ? d.newgrosssymbol === "Between"
                      ? Number(grossValue) >= Number(d.newgrossfrom) && Number(grossValue) <= Number(d.newgrossto)
                      : d.newgrosssymbol === "Less than or equal"
                        ? Number(grossValue) <= Number(d.newgross)
                        : d.newgrosssymbol === "Less than"
                          ? Number(grossValue) < Number(d.newgross)
                          : d.newgrosssymbol === "Greater than"
                            ? Number(grossValue) > Number(d.newgross)
                            : Number(grossValue) >= Number(d.newgross)
                    : true
              : d.filtertype === "Branch" && d.branch.includes(item.branch)
                ? d.choosetype === false && d.choosestatus === "Both"
                  ? (d.achievedsymbol === "Between"
                    ? Number(AcheivedPercentCalcVal) >= Number(d.achievedfrom) && Number(AcheivedPercentCalcVal) <= Number(d.achievedto)
                    : d.achievedsymbol === "Less than or equal"
                      ? Number(AcheivedPercentCalcVal) <= Number(d.achieved)
                      : d.achievedsymbol === "Less than"
                        ? Number(AcheivedPercentCalcVal) < Number(d.achieved)
                        : d.achievedsymbol === "Greater than"
                          ? Number(AcheivedPercentCalcVal) > Number(d.achieved)
                          : Number(AcheivedPercentCalcVal) >= Number(d.achieved)) &&
                  (d.newgrosssymbol === "Between"
                    ? Number(grossValue) >= Number(d.newgrossfrom) && Number(grossValue) <= Number(d.newgrossto)
                    : d.newgrosssymbol === "Less than or equal"
                      ? Number(grossValue) <= Number(d.newgross)
                      : d.newgrosssymbol === "Less than"
                        ? Number(grossValue) < Number(d.newgross)
                        : d.newgrosssymbol === "Greater than"
                          ? Number(grossValue) > Number(d.newgross)
                          : Number(grossValue) >= Number(d.newgross))
                  : d.choosetype === false && d.choosestatus === "Production"
                    ? d.achievedsymbol === "Between"
                      ? Number(AcheivedPercentCalcVal) >= Number(d.achievedfrom) && Number(AcheivedPercentCalcVal) <= Number(d.achievedto)
                      : d.achievedsymbol === "Less than or equal"
                        ? Number(AcheivedPercentCalcVal) <= Number(d.achieved)
                        : d.achievedsymbol === "Less than"
                          ? Number(AcheivedPercentCalcVal) < Number(d.achieved)
                          : d.achievedsymbol === "Greater than"
                            ? Number(AcheivedPercentCalcVal) > Number(d.achieved)
                            : Number(AcheivedPercentCalcVal) >= Number(d.achieved)
                    : d.choosetype === false && d.choosestatus === "New Gross"
                      ? d.newgrosssymbol === "Between"
                        ? Number(grossValue) >= Number(d.newgrossfrom) && Number(grossValue) <= Number(d.newgrossto)
                        : d.newgrosssymbol === "Less than or equal"
                          ? Number(grossValue) <= Number(d.newgross)
                          : d.newgrosssymbol === "Less than"
                            ? Number(grossValue) < Number(d.newgross)
                            : d.newgrosssymbol === "Greater than"
                              ? Number(grossValue) > Number(d.newgross)
                              : Number(grossValue) >= Number(d.newgross)
                      : true
                : d.filtertype === "Department" && d.department.includes(item.department)
                  ? d.choosetype === false && d.choosestatus === "Both"
                    ? (d.achievedsymbol === "Between"
                      ? Number(AcheivedPercentCalcVal) >= Number(d.achievedfrom) && Number(AcheivedPercentCalcVal) <= Number(d.achievedto)
                      : d.achievedsymbol === "Less than or equal"
                        ? Number(AcheivedPercentCalcVal) <= Number(d.achieved)
                        : d.achievedsymbol === "Less than"
                          ? Number(AcheivedPercentCalcVal) < Number(d.achieved)
                          : d.achievedsymbol === "Greater than"
                            ? Number(AcheivedPercentCalcVal) > Number(d.achieved)
                            : Number(AcheivedPercentCalcVal) >= Number(d.achieved)) &&
                    (d.newgrosssymbol === "Between"
                      ? Number(grossValue) >= Number(d.newgrossfrom) && Number(grossValue) <= Number(d.newgrossto)
                      : d.newgrosssymbol === "Less than or equal"
                        ? Number(grossValue) <= Number(d.newgross)
                        : d.newgrosssymbol === "Less than"
                          ? Number(grossValue) < Number(d.newgross)
                          : d.newgrosssymbol === "Greater than"
                            ? Number(grossValue) > Number(d.newgross)
                            : Number(grossValue) >= Number(d.newgross))
                    : d.choosetype === false && d.choosestatus === "Production"
                      ? d.achievedsymbol === "Between"
                        ? Number(AcheivedPercentCalcVal) >= Number(d.achievedfrom) && Number(AcheivedPercentCalcVal) <= Number(d.achievedto)
                        : d.achievedsymbol === "Less than or equal"
                          ? Number(AcheivedPercentCalcVal) <= Number(d.achieved)
                          : d.achievedsymbol === "Less than"
                            ? Number(AcheivedPercentCalcVal) < Number(d.achieved)
                            : d.achievedsymbol === "Greater than"
                              ? Number(AcheivedPercentCalcVal) > Number(d.achieved)
                              : Number(AcheivedPercentCalcVal) >= Number(d.achieved)
                      : d.choosetype === false && d.choosestatus === "New Gross"
                        ? d.newgrosssymbol === "Between"
                          ? Number(grossValue) >= Number(d.newgrossfrom) && Number(grossValue) <= Number(d.newgrossto)
                          : d.newgrosssymbol === "Less than or equal"
                            ? Number(grossValue) <= Number(d.newgross)
                            : d.newgrosssymbol === "Less than"
                              ? Number(grossValue) < Number(d.newgross)
                              : d.newgrosssymbol === "Greater than"
                                ? Number(grossValue) > Number(d.newgross)
                                : Number(grossValue) >= Number(d.newgross)
                        : true
                  : false;
      });
      //;

      let salaryTypeVal = getPayTypes ? getPayTypes.salraytype : "Final Salary";
      let deductionTypeVal = getPayTypes ? getPayTypes.deductiontype : "Acutal Deduction";
      ////daystatus---------------------------------------------------------------------------------------------------------

      let lowestValueSal, highestValueSal;

      if (finalSalaryCalcVal < Fixed_Salary && finalSalaryCalcVal < PROD_SALARY_Calcval) {
        lowestValueSal = "Final Salary";
      } else if (Fixed_Salary < finalSalaryCalcVal && Fixed_Salary < PROD_SALARY_Calcval) {
        lowestValueSal = "Fixed Salary";
      } else {
        lowestValueSal = "Production Salary";
      }

      if (finalSalaryCalcVal > Fixed_Salary && finalSalaryCalcVal > PROD_SALARY_Calcval) {
        highestValueSal = "Final Salary";
      } else if (Fixed_Salary > finalSalaryCalcVal && Fixed_Salary > PROD_SALARY_Calcval) {
        highestValueSal = "Fixed Salary";
      } else {
        highestValueSal = "Production Salary";
      }

      let findSalaryTypeValue = salaryTypeVal === "Whichever is Lower" ? lowestValueSal : salaryTypeVal === "Whichever is Higher" ? highestValueSal : salaryTypeVal;

      let lowestValueDed, highestValueDed;

      //salary type is final salary
      if (deductionTypeVal === "Whichever is Lower" && findSalaryTypeValue === "Final Salary") {
        if (acutalDeductionCalcVal < finalValueCalcVal && acutalDeductionCalcVal < final_Value_PenaltyCalcval && acutalDeductionCalcVal < minimumDeductionCalcVal) {
          lowestValueDed = "Acutal Deduction";
        } else if (finalValueCalcVal < final_Value_PenaltyCalcval && finalValueCalcVal < minimumDeductionCalcVal) {
          lowestValueDed = "On Value";
        } else if (final_Value_PenaltyCalcval < minimumDeductionCalcVal) {
          lowestValueDed = "On Penalty";
        } else {
          lowestValueDed = "Minimum Deduction";
        }
      }
      if (deductionTypeVal === "Whichever is Higher" && findSalaryTypeValue === "Final Salary") {
        if (acutalDeductionCalcVal > finalValueCalcVal && acutalDeductionCalcVal > final_Value_PenaltyCalcval && acutalDeductionCalcVal > minimumDeductionCalcVal) {
          highestValueDed = "Acutal Deduction";
        } else if (finalValueCalcVal > final_Value_PenaltyCalcval && finalValueCalcVal > minimumDeductionCalcVal) {
          highestValueDed = "On Value";
        } else if (final_Value_PenaltyCalcval > minimumDeductionCalcVal) {
          highestValueDed = "On Penalty";
        } else {
          highestValueDed = "Minimum Deduction";
        }
      }
      //salary type is fixed salary
      if (deductionTypeVal === "Whichever is Lower" && findSalaryTypeValue === "Fixed Salary") {
        if (Fixed_Acutal_Deduction_Calc < FIXED_Final_Value && Fixed_Acutal_Deduction_Calc < Fixed_Min_Deduction) {
          lowestValueDed = "Acutal Deduction";
        } else if (FIXED_Final_Value < Fixed_Min_Deduction) {
          lowestValueDed = "On Value";
        } else {
          lowestValueDed = "Minimum Deduction";
        }
      }
      if (deductionTypeVal === "Whichever is Higher" && findSalaryTypeValue === "Fixed Salary") {
        if (Fixed_Acutal_Deduction_Calc > FIXED_Final_Value && Fixed_Acutal_Deduction_Calc > Fixed_Min_Deduction) {
          lowestValueDed = "Acutal Deduction";
        } else if (FIXED_Final_Value > Fixed_Min_Deduction) {
          lowestValueDed = "On Value";
        } else {
          lowestValueDed = "Minimum Deduction";
        }
      }
      //salary type is PROD salary
      if (deductionTypeVal === "Whichever is Lower" && findSalaryTypeValue === "Production Salary") {
        if (PROD_Actual_Deduction_Val < PROD_Final_Value_Calc && PROD_Actual_Deduction_Val < PROD_Minimum_Deduction_Val) {
          lowestValueDed = "Acutal Deduction";
        } else if (PROD_Final_Value_Calc < PROD_Minimum_Deduction_Val) {
          lowestValueDed = "On Value";
        } else {
          lowestValueDed = "Minimum Deduction";
        }
      }
      if (deductionTypeVal === "Whichever is Higher" && findSalaryTypeValue === "Production Salary") {
        if (PROD_Actual_Deduction_Val > PROD_Final_Value_Calc && PROD_Actual_Deduction_Val > PROD_Minimum_Deduction_Val) {
          lowestValueDed = "Acutal Deduction";
        } else if (PROD_Final_Value_Calc > PROD_Minimum_Deduction_Val) {
          lowestValueDed = "On Value";
        } else {
          lowestValueDed = "Minimum Deduction";
        }
      }

      let findDeductionTypeVal = deductionTypeVal === "Whichever is Lower" ? lowestValueDed : deductionTypeVal === "Whichever is Higher" ? highestValueDed : deductionTypeVal;

      return {
        ...item,
        // totalabsentlog: [],
        // totalpaiddayslog: [],
        // acheivedpointlog: [],
        // targetpointlog: [],
        // penaltylog: [],
        // nightshiftallowlog: [],
        // shiftallowtargetlog: [],
        // noshiftlog: [],
        // shiftallowancelog: [],
        // currmonthavglog: [],
        // currmonthattlog: [],
        serialNumber: index + 1,
        company: item.company,
        branch: item.branch,
        unit: item.unit,
        team: item.team,
        empcode: item.empcode,
        companyname: item.companyname,
        doj: item.doj ? moment(item.doj)?.format("DD-MM-YYYY") : "",
        experience: item.doj ? (calculateMonthsBetweenDates(item.doj, findDate) < 0 ? 0 : calculateMonthsBetweenDates(item.doj, findDate)) : "",
        //ASSIGN EXP LOG DETAILS
        endtar: modevalue ? modevalue.endtar : "",
        endtardate: modevalue && modevalue.endtardate ? moment(modevalue.endtardate)?.format("DD-MM-YYYY") : "",
        endexp: modevalue ? modevalue.endexp : "",
        endexpdate: modevalue && modevalue.endexpdate ? moment(modevalue.endexpdate)?.format("DD-MM-YYYY") : "",

        assignExpMode: modevalue ? modevalue.expmode : "",
        modevalue: modevalue ? modevalue.expval : "",

        targetexp: item.doj ? (differenceInMonthstar > 0 ? differenceInMonthstar : 0) : "",
        prodexp: item.doj ? (differenceInMonthsexp > 0 ? differenceInMonthsexp : 0) : "",
        modeexp: item.doj ? (differenceInMonths > 0 ? differenceInMonths : 0) : "",

        processcode: item.doj && modevalue && modevalue.expmode === "Manual" ? modevalue.salarycode : item.doj ? getprocessCode : "",
        salexp: item.doj ? (differenceInMonthsexp > 0 ? (differenceInMonthsexp <= 9 ? `0${differenceInMonthsexp}` : differenceInMonthsexp) : "00") : "",
        processcodeexp: processcodeexpvaluesalary,

        // gross: grossValue,

        //SALRY SLAB FILTER PAGE
        basic: actualBasicCalcVal,
        hra: actualHraCalcVal,
        conveyance: actualConveyanceCalcVal,
        medicalallowance: actualMedicalAllowCalcVal,
        productionallowance: prodAllowanceCalcVal,
        productionallowancetwo: prodAllowancetwoCalcVal,
        otherallowance: actualOtherCalVAL,

        oldgross: oldgross,
        oldbasic: oldactualBasicCalcVal,
        oldhra: oldactualHraCalcVal,
        oldconveyance: oldactualConveyanceCalcVal,
        oldmedicalallowance: oldactualMedicalAllowCalcVal,
        oldproductionallowance: oldprodAllowanceCalcVal,
        oldproductionallowancetwo: oldprodAllowancetwoCalcVal,
        oldotherallowance: oldactualOtherCalVAL,
        gross: grossValue,

        //REVENUE ALLOWANCE MASTER PAGE
        revenueallow: findRevenueAllow ? findRevenueAllow.amount : 0,
        //SHORTAGE MASTER PAGE
        shortage: findShortage ? findShortage.amount : 0,

        //ATTENDANCE MONTH STATUS
        totalnumberofdays: findTotalNoOfDays ? Number(findTotalNoOfDays.totalcounttillcurrendate) : 0,
        // totalshift: findTotalNoOfDays && Number(findTotalNoOfDays && findTotalNoOfDays.paidpresentday) - Number(findTotalNoOfDays && findTotalNoOfDays.weekoff),
        totalshift: totalshiftCalcVal,
        clsl: findTotalNoOfDays ? findTotalNoOfDays.clsl : 0,
        weekoffcount: findTotalNoOfDays ? findTotalNoOfDays.weekoff : 0,
        holiday: findTotalNoOfDays ? findTotalNoOfDays.holiday : 0,
        totalasbleave: totalasbleaveCalcVal,
        totalpaidDays: totalpaiddaycalVal,

        //old value and log
        totalpaiddaycalVal1: paiddayscalcvalfrommonthstatus,
        totalabsentcalVal1: findTotalNoOfDays ? findTotalNoOfDays.lopcount : 0,
        penaltyCalVal1: findPenaltyDetails ? findPenaltyDetails.amount.toFixed(2) : Number(0).toFixed(2),
        targetpointCalVal1: findPointsDetails ? findPointsDetails.target : 0,
        acheivedpointCalVal1: findPointsDetails ? findPointsDetails.point.toFixed(2) : Number(0).toFixed(2),
        shiftallowanceCalVal1: findPointsDetails ? findPointsDetails.allowancepoint.toFixed(2) : Number(0).toFixed(2),
        // paidpresentday: Number(findTotalNoOfDays && findTotalNoOfDays.paidpresentday) - Number(findTotalNoOfDays && findTotalNoOfDays.weekoff),

        //LIST PRODUCTION POINTS
        monthPoint: targetPointCalcVaue,

        acheivedpoints: AcheivedPointsCalcVal,

        acheivedpercent: AcheivedPercentCalcVal ? AcheivedPercentCalcVal : 0,

        //DAY POINTS UPLOAD SHIFTALOWANCE AMOUNT
        allowancepoint: allowancepointCalcVal ? allowancepointCalcVal : 0,
        noallowancepoint: noshiftlogvalfinal ? noshiftlogvalfinal : 0,

        //ERA MASTER PAGE
        eramount: ERAAmountCalcVal,
        //PENALTY MASTER PAGE
        penalty: penaltyCalcVal ? penaltyCalcVal : 0,
        penaltyamount: penaltyAmtCalculationVal ? penaltyAmtCalculationVal.toFixed(2) : 0,
        //USER INOIVIDUAL VALUE
        ipname: item.ipname,
        insurancenumber: item.insurancenumber,
        pfmembername: item.pfmembername,
        uan: item.uan,

        // currentmonthavg: Number(currMonAvgFinalcalVal),
        currentmonthavgCalVal1: findPointsDetailsNxtMonth ? Number(findPointsDetailsNxtMonth.avgpoint).toFixed(2) : 0,

        // currentmonthattendance: currMonAttFinalcalVal,
        currentmonthattCalVal1: currentMonthAttendanceVal,

        // paidstatus: paidStatusVal,

        noshiftlog: item.noshiftlog,
        noshiftlogCalVal1: findPointsDetails ? findPointsDetails.noallowancepoint : 0,

        shiftallowancetarget: shiftallowancetargetfinal,
        // nightshiftallowance: Number(nightAllowanceCalcVal.toFixed(2)),

        nightshiftallowlog: item.nightshiftallowlog,
        nightshiftallowlogCalVal1: nightAllowancefinalcalculation,

        shiftallowtargetlog: item.shiftallowtargetlog,
        shiftallowtargetlogCalVal1: shiftallowancetarget,
        from: findDate,
        to: findmonthenddate,

        ///FINALFIXPRODSALARY STARTED
        acheivedproductionallowance: Number(acheivedProductionAllowanceValCal).toFixed(2),
        attendancelop: Number(attendanceLopCalVal).toFixed(2),
        actualnetsalary: (actualBasicCalcVal + actualHraCalcVal + actualConveyanceCalcVal + actualMedicalAllowCalcVal + actualOtherCalVAL - Number(attendanceLopCalVal) + Number(acheivedProductionAllowanceValCal)).toFixed(2),
        lopbasic: Number(lopBasicValCal).toFixed(2),
        lophra: Number(lopHRAValCal).toFixed(2),
        lopconveyance: Number(lopConveyValCal).toFixed(2),
        lopmedicalallowance: Number(lopMedicalValCal).toFixed(2),
        lopotherallowance: Number(lopOtherValCal).toFixed(2),
        lopproductionallowance: lopProductionAllowance.toFixed(2),
        lopnetsalary: Number(lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopProductionAllowance + lopOtherValCal).toFixed(2),
        prodbasic: Number(prodBasicValCalc).toFixed(2),
        prodhra: Number(prodHraValCalc).toFixed(2),
        prodconveyance: Number(prodConveyanceValCalc).toFixed(2),
        prodmedicalallowance: Number(prodMEDAllowanceValCalc).toFixed(2),
        prodotherallowance: Number(prodOtherValCalc).toFixed(2),
        prodproductionallowance: Number(prodPRODValCalc).toFixed(2),
        calculatednetsalary: Number(calcNetSalaryValCalc).toFixed(2),
        lossdeduction: Number(lossDed).toFixed(2),
        otherdeduction: Number(OtherDed).toFixed(2),
        finalbasic: Number(finalBasicValCalc).toFixed(2),
        finalhra: Number(finalHraValCalc).toFixed(2),
        finalconveyance: Number(finalConveyValCalc).toFixed(2),
        finalmedicalallowance: Number(finalMedicalAllowValcCalc).toFixed(2),
        finalproductionallowance: Number(finalProductionValcCalc).toFixed(2),
        finalotherallowance: Number(finalOtherValcCalc).toFixed(2),
        finalnetsalary: Number(finalNetSalaryValcCalc).toFixed(2),
        pfdays: pfDaysVal,
        ncpdays: ncpDaysVal,
        pfdeduction: Number(PF_deduction).toFixed(2),
        esideduction: Number(ESI_deduction).toFixed(2),
        finallopdays: finalLOPDaysCalcVal,
        paysliplop: Number(paySlipLopCalval).toFixed(0),
        finalleavededuction: Number(finalLeaveDeductionValCalc).toFixed(2),
        professionaltax: profTaxCalcVal,
        totaldeductions: Number(totalDeductionValCalc).toFixed(2),
        // shiftallowancetarget: shiftallowancetargetfinal,
        nightshiftallowance: Number(Number(nightAllowanceCalcVal).toFixed(2)),
        finalsalary: Number(finalSalaryCalcVal).toFixed(2),
        finalsalarypenalty: Number(finalSalary_Penalty).toFixed(2),
        totalpointsvalue: Number(totalPointsValueCalc).toFixed(2),
        era: Number(acutalERAValCalc).toFixed(2),
        pfemployerdeduction: Number(PF_Emper_deduction).toFixed(2),
        esiemployerdeduction: Number(ESI_EMPR_deduction).toFixed(2),
        ctc: Number(CTC_Calcval).toFixed(2),
        // finalvaluetwo:Number(finalValueCalcVal).toFixed(2),
        finalvalue: Number(finalValueCalcVal).toFixed(2),
        finalvaluepenalty: Number(final_Value_PenaltyCalcval).toFixed(2),
        shortageone: Number(Shortage1ValCalc).toFixed(2),
        actualdeduction: Number(acutalDeductionCalcVal).toFixed(2),
        minimumdeduction: Number(minimumDeductionCalcVal).toFixed(2),
        finalvaluereview: finalValueReviewCalc,
        finalvaluestatus: finalValueStatus,
        finalvaluepenaltystatus: revenuePenaltyStatus,

        //FIXED
        fixedlossdeduction: Number(Fixed_Loss_Deduction_Calcval).toFixed(2),
        fixednetsalary: Number(Fixed_NET_Salary).toFixed(2),
        fixedbasic: Number(Fixed_Basic_CalcVal).toFixed(2),
        fixedhra: Number(Fixed_HRA_CalcVal).toFixed(2),
        fixedconveyance: Number(Fixed_Conveyance_CalcVal).toFixed(2),
        fixedmedicalallowance: Number(Fixed_Med_Allowace).toFixed(2),
        fixedproductionallowance: Number(Fixed_PROD_Allowace).toFixed(2),
        fixedotherallowance: Number(Fixed_OTHER_Allowace).toFixed(2),
        fixednetsalaryone: Number(Fixed_NET_Salary1).toFixed(2),
        fixedemppf: Number(Fixed_PF_deduction).toFixed(2),
        fixedempesi: Number(Fixed_ESI_deduction).toFixed(2),
        fixedempptax: Number(Fixed_TaxCalcVal).toFixed(2),
        fixedemprpf: Number(Fixed_PF_Emper_deduction).toFixed(2),
        fixedempresi: Number(Fixed_ESI_EMPR_deduction).toFixed(2),
        fixedshiftallowance: Number(Fixed_Shift_Allowance).toFixed(2),
        fixedtotaldeductions: Number(Fixed_Total_Deductions).toFixed(2),
        fixedsalary: Number(Fixed_Salary).toFixed(2),
        fixedsalarypenalty: Number(Fixed_Salary_penalty).toFixed(2),
        fixedlop: Number(Fixed_LOP1).toFixed(0),
        fixedlopdays: Number(Fixed_Lop_Days).toFixed(0),
        fixedctc: Number(Fixed_CTC_Calcval).toFixed(2),
        fixedfinalvalue: Number(FIXED_Final_Value).toFixed(2),
        fixedleavededuction: Number(Fixed_Leave_Dedcution).toFixed(2),
        fixedactualdeduction: Number(Fixed_Acutal_Deduction_Calc).toFixed(2),
        fixedminimumdeduction: Number(Fixed_Min_Deduction).toFixed(2),

        // production
        prodlossdeduction: Number(PROD_Loss_Deduction).toFixed(2),
        prodnetsalary: Number(PROD_NET_Salary).toFixed(2),
        prodbasicp: Number(PROD_BASIC_ValCalc).toFixed(2),
        prodhrap: Number(PROD_HRA_ValCalc).toFixed(2),
        prodconveyancep: Number(PROD_CONVEYANCE_ValCalc).toFixed(2),
        prodmedicalallowancep: Number(PROD_MEDICALALLOW_ValCalc).toFixed(2),
        prodproductionallowancep: Number(PROD_PRODUCTION_ValCalc).toFixed(2),
        prodotherallowancep: Number(PROD_OTHER_ValCalc).toFixed(2),
        prodnetsalaryonep: Number(PROD_NET_Salary1).toFixed(2),
        prodemppf: Number(PROD_PF_deduction).toFixed(2),
        prodempesi: Number(PROD_ESI_deduction).toFixed(2),
        prodempptax: Number(PROD_TaxCalcVal).toFixed(2),
        prodemprpf: Number(PROD_PF_Emper_deduction).toFixed(2),
        prodempresi: Number(PROD_ESI_EMPR_deduction).toFixed(2),
        prodtotaldeductions: Number(PROD_Total_deductions).toFixed(2),
        prodshiftallowance: Number(PROD_Shift_Allowance).toFixed(2),
        prodsalary: Number(PROD_SALARY_Calcval).toFixed(2),
        prodsalarypenalty: Number(PROD_SALARY_PENALTY_Calcval).toFixed(2),
        prodlopdays: Number(PROD_LOP_days).toFixed(2),
        prodlop: Number(PROD_LOP_calcval).toFixed(2),
        prodleavededuction: Number(PROD_Leave_Deduction).toFixed(2),
        prodctc: Number(PROD_CTC_Valcalc).toFixed(2),
        prodfinalvalue: Number(PROD_Final_Value_Calc).toFixed(2),
        prodactualdeduction: Number(PROD_Actual_Deduction_Val).toFixed(2),
        prodminimumdeduction: Number(PROD_Minimum_Deduction_Val).toFixed(2),

        currentmonthavg: Number(currMonAvgFinalcalVal),
        currentmonthattendance: currMonAttFinalcalVal,
        department: item.department,

        paidstatus: paidStatusVal,
        salarytype: findSalaryTypeValue ? findSalaryTypeValue : "",
        deductiontype: findDeductionTypeVal ? findDeductionTypeVal : "",

        bankname: bankDetails ? bankDetails.bankname : "",
        accountholdername: bankDetails ? bankDetails.accountholdername : "",
        accountnumber: bankDetails ? bankDetails.accountnumber : "",
        ifsccode: bankDetails ? bankDetails.ifsccode : "",
        pfvalues: pfvalues,
      };
    } catch (err) {
      console.log(err, "ERR");
      setBankdetail(false);
    }
  };
  const processEmployeeItemReruns = async (item, index, data, finalresult, finalresultNxt, oldrerunDataDirect1, selectmonth, monthnum, selectyear, iswithedit, employeeWithEditNeedToRerun) => {
    try {
      let dayPointsUser = data.dayPointsUser;
      let dayPointsUserNxtMonth = data.dayPointsUserNxtMonth;
      let dayPenaltyUser = data.dayPenaltyUser;
      let paidStatusFix = data.paidStatusFix;

      let monthSets = data.monthSets;
      let monthSetsNxt = data.monthSetsNxt;
      let bankDetails = item.bankdetails.find((d) => d.accountstatus === "Active");
      // console.log(bankDetails, "3", index)
      let findTotalNoOfDays = finalresult.find((d) => d.company === item.company && d.branch === item.branch && d.unit === item.unit && d.username === item.companyname);
      let findTotalNoOfDaysNxtMonth = finalresultNxt.find((d) => d.company === item.company && d.branch === item.branch && d.unit === item.unit && d.username === item.companyname);

      const groupedByMonth = {};

      // Group items by month
      item.assignExpLog &&
        item.assignExpLog.length > 0 &&
        item.assignExpLog
          .filter((d) => d.expmode !== "Auto")
          .sort((a, b) => {
            return new Date(a.updatedate) - new Date(b.updatedate);
          })
          .forEach((item) => {
            const monthYear = item.updatedate?.split("-").slice(0, 2).join("-");
            if (!groupedByMonth[monthYear]) {
              groupedByMonth[monthYear] = [];
            }
            groupedByMonth[monthYear].push(item);
          });

      // Extract the last item of each group
      const lastItemsForEachMonth = Object.values(groupedByMonth).map((group) => group[group.length - 1]);

      // Filter the data array based on the month and year
      // lastItemsForEachMonth.sort((a, b) => {
      //   return new Date(a.updatedate) - new Date(b.updatedate);
      // });
      // Find the first item in the sorted array that meets the criteria
      let filteredDataMonth = null;
      for (let i = 0; i < lastItemsForEachMonth.length; i++) {
        const date = lastItemsForEachMonth[i]?.updatedate;
        const splitedDate = date?.split("-");
        const itemYear = splitedDate ? splitedDate[0] : -1;
        const itemMonth = splitedDate ? splitedDate[1] : -1; // Adding 1 because getMonth() returns 0-indexed month

        if (Number(itemYear) == Number(selectyear) && Number(itemMonth) === Number(monthnum)) {
          filteredDataMonth = lastItemsForEachMonth[i];
          break;
        } else if (Number(itemYear) < Number(selectyear) || (Number(itemYear) == selectyear && Number(itemMonth) <= Number(monthnum))) {
          filteredDataMonth = lastItemsForEachMonth[i]; // Keep updating the filteredDataMonth until the criteria is met
        } else {
          break; // Break the loop if we encounter an item with year and month greater than selected year and month
        }
      }
      // let modevalue = item.assignExpLog[item.assignExpLog.length - 1];
      let modevalue = filteredDataMonth;

      let selectedmonthnumalter = Number(monthnum) <= 9 ? `0${Number(monthnum)}` : Number(monthnum);

      let selectedMonStartDate = `${selectyear}-${selectedmonthnumalter}-01`;

      let findexp = monthSets.find((d) => d.department === item.department);
      let findexpNxt = monthSetsNxt.find((d) => d.department === item.department);

      let findDate = findexp ? findexp.fromdate : selectedMonStartDate;

      //FIND SELECTEDMONTH MONTH END DATE
      const nextMonthFirstDay = new Date(Number(selectedYear), Number(selectedMonthNum), 1);

      // Subtract one day to get the last day of the given month
      const lastDate = new Date(nextMonthFirstDay - 1);

      let lastdateOfSelectedMonth = lastDate.getDate();
      let selectedMonEndDate = `${selectedYear}-${selectedmonthnumalter}-${lastdateOfSelectedMonth}`;
      let findmonthenddate = findexp ? findexp.todate : selectedMonEndDate;
      const thisMonthEndDate = findexp ? findexp.todate : selectedMonEndDate;

      //NEXT MONTH MONTH START AND END DATE

      let selectedmonthnumalterNxt = Number(monthnum) + 1 > 12 ? "01" : Number(monthnum) + 1 <= 9 ? `0${Number(monthnum) + 1}` : Number(monthnum) + 1;

      let Nxtmonth = Number(monthnum) + 1 > 12 ? 1 : Number(monthnum) + 1;
      let Nxtyear = Number(monthnum) + 1 > 12 ? Number(selectyear) + 1 : selectyear;

      const NxtnextMonthFirstDay = new Date(Number(Nxtyear), Number(Nxtmonth), 1);

      // Subtract one day to get the last day of the given month
      const lastDateNxtNextmonth = new Date(NxtnextMonthFirstDay - 1);

      let lastdateOfNxtSelectedMonth = lastDateNxtNextmonth.getDate();

      let selectedMonNxtStartDate = `${Nxtyear}-${selectedmonthnumalterNxt}-01`;

      let selectedMonNxtEndDate = `${Nxtyear}-${selectedmonthnumalterNxt}-${lastdateOfNxtSelectedMonth}`;

      let findNxtStartDate = findexpNxt ? findexpNxt.fromdate : selectedMonNxtStartDate;
      let findNxtEndDate = findexpNxt ? findexpNxt.todate : selectedMonNxtEndDate;

      const calculateMonthsBetweenDates = (startDate, endDate) => {
        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);

          let years = end.getFullYear() - start.getFullYear();
          let months = end.getMonth() - start.getMonth();
          let days = end.getDate() - start.getDate();

          // Convert years to months
          months += years * 12;

          // Adjust for negative days
          if (days < 0) {
            months -= 1; // Subtract a month
            days += new Date(end.getFullYear(), end.getMonth(), 0).getDate(); // Add days of the previous month
          }

          // Adjust for days 15 and above
          if (days >= 15) {
            months += 1; // Count the month if 15 or more days have passed
          }

          return months <= 0 ? 0 : months;
        }

        return 0; // Return 0 if either date is missing
      };

      // Calculate difference in months between findDate and item.doj
      let differenceInMonths, differenceInMonthsexp, differenceInMonthstar;
      if (modevalue) {
        //findexp end difference yes/no
        if (modevalue.endexp === "Yes") {
          differenceInMonthsexp = calculateMonthsBetweenDates(item.doj, modevalue.endexpdate);
          //  Math.floor((new Date(modevalue.endexpdate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
          if (modevalue.expmode === "Add") {
            differenceInMonthsexp += parseInt(modevalue.expval);
          } else if (modevalue.expmode === "Minus") {
            differenceInMonthsexp -= parseInt(modevalue.expval);
          } else if (modevalue.expmode === "Fix") {
            differenceInMonthsexp = parseInt(modevalue.expval);
          }
        } else {
          differenceInMonthsexp = calculateMonthsBetweenDates(item.doj, findDate);
          // Math.floor((new Date(findDate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
          if (modevalue.expmode === "Add") {
            differenceInMonthsexp += parseInt(modevalue.expval);
          } else if (modevalue.expmode === "Minus") {
            differenceInMonthsexp -= parseInt(modevalue.expval);
          } else if (modevalue.expmode === "Fix") {
            differenceInMonthsexp = parseInt(modevalue.expval);
          } else {
            // differenceInMonths = parseInt(modevalue.expval);
            differenceInMonthsexp = calculateMonthsBetweenDates(item.doj, findDate);
          }
        }

        //findtar end difference yes/no
        if (modevalue.endtar === "Yes") {
          differenceInMonthstar = calculateMonthsBetweenDates(item.doj, modevalue.endtardate);
          //  Math.floor((new Date(modevalue.endtardate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
          if (modevalue.expmode === "Add") {
            differenceInMonthstar += parseInt(modevalue.expval);
          } else if (modevalue.expmode === "Minus") {
            differenceInMonthstar -= parseInt(modevalue.expval);
          } else if (modevalue.expmode === "Fix") {
            differenceInMonthstar = parseInt(modevalue.expval);
          }
        } else {
          differenceInMonthstar = calculateMonthsBetweenDates(item.doj, findDate);
          if (modevalue.expmode === "Add") {
            differenceInMonthstar += parseInt(modevalue.expval);
          } else if (modevalue.expmode === "Minus") {
            differenceInMonthstar -= parseInt(modevalue.expval);
          } else if (modevalue.expmode === "Fix") {
            differenceInMonthstar = parseInt(modevalue.expval);
          } else {
            // differenceInMonths = parseInt(modevalue.expval);
            differenceInMonthstar = calculateMonthsBetweenDates(item.doj, findDate);
          }
        }

        differenceInMonths = calculateMonthsBetweenDates(item.doj, findDate);
        if (modevalue.expmode === "Add") {
          differenceInMonths += parseInt(modevalue.expval);
        } else if (modevalue.expmode === "Minus") {
          differenceInMonths -= parseInt(modevalue.expval);
        } else if (modevalue.expmode === "Fix") {
          differenceInMonths = parseInt(modevalue.expval);
        } else {
          // differenceInMonths = parseInt(modevalue.expval);
          differenceInMonths = calculateMonthsBetweenDates(item.doj, findDate);
        }
      } else {
        differenceInMonthsexp = calculateMonthsBetweenDates(item.doj, findDate);
        differenceInMonthstar = calculateMonthsBetweenDates(item.doj, findDate);
        differenceInMonths = calculateMonthsBetweenDates(item.doj, findDate);
      }
      differenceInMonthstar = Number(differenceInMonthstar);
      differenceInMonthsexp = Number(differenceInMonthsexp);
      differenceInMonths = Number(differenceInMonths);

      //GET PROCESS CODE FUNCTION
      const groupedByMonthProcs = {};

      // Group items by month
      item.processlog &&
        item.processlog
          .sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
          })
          .forEach((item) => {
            const monthYear = item.date?.split("-")?.slice(0, 2).join("-");
            if (!groupedByMonthProcs[monthYear]) {
              groupedByMonthProcs[monthYear] = [];
            }
            groupedByMonthProcs[monthYear].push(item);
          });

      // Extract the last item of each group
      const lastItemsForEachMonthPros = Object.values(groupedByMonthProcs).map((group) => group[group.length - 1]);

      // Filter the data array based on the month and year
      // lastItemsForEachMonthPros.sort((a, b) => {
      //   return new Date(a.date) - new Date(b.date);
      // });
      const totaluserDays = (new Date(thisMonthEndDate) - new Date(item.doj)) / (1000 * 60 * 60 * 24);
      const totaluserDaysNxtMonth = (new Date(findNxtEndDate) - new Date(item.doj)) / (1000 * 60 * 60 * 24);
      // Find the first item in the sorted array that meets the criteria
      let filteredItem = null;
      let filteredItemNxtMonth = null;
      for (let i = 0; i < lastItemsForEachMonthPros.length; i++) {
        const date = lastItemsForEachMonthPros[i].date;

        if (findDate >= date) {
          filteredItem = lastItemsForEachMonthPros[i];
        } else if (thisMonthEndDate >= date && totaluserDays < 31) {
          filteredItem = lastItemsForEachMonthPros[i];
        } else {
          break;
        }
      }
      for (let i = 0; i < lastItemsForEachMonthPros.length; i++) {
        const date = lastItemsForEachMonthPros[i].date;

        if (findNxtStartDate >= date) {
          filteredItemNxtMonth = lastItemsForEachMonthPros[i];
        } else if (findNxtEndDate >= date && totaluserDaysNxtMonth < 31) {
          filteredItem = lastItemsForEachMonthPros[i];
        } else {
          break;
        }
      }

      let getprocessCode = filteredItem ? filteredItem.process : "";

      // let procCodecheck = item.doj ? getprocessCode + (differenceInMonthsexp > 0 ? (differenceInMonthsexp <= 9 ? `0${differenceInMonthsexp}` : differenceInMonthsexp) : 0) : "";
      let processcodeexpvalue =
        item.doj && modevalue && modevalue.expmode === "Manual"
          ? modevalue.salarycode + (differenceInMonthstar > 0 ? (differenceInMonthstar <= 9 ? `0${differenceInMonthstar}` : differenceInMonthstar) : "00")
          : item.doj
            ? getprocessCode + (differenceInMonthstar > 0 ? (differenceInMonthstar <= 9 ? `0${differenceInMonthstar}` : differenceInMonthstar) : "00")
            : "";
      let processcodeexpvaluesalary =
        item.doj && modevalue && modevalue.expmode === "Manual"
          ? modevalue.salarycode + (differenceInMonthsexp > 0 ? (differenceInMonthsexp <= 9 ? `0${differenceInMonthsexp}` : differenceInMonthsexp) : "00")
          : item.doj
            ? getprocessCode + (differenceInMonthsexp > 0 ? (differenceInMonthsexp <= 9 ? `0${differenceInMonthsexp}` : differenceInMonthsexp) : "00")
            : "";

      let getprocessCodeNxtMonth = filteredItemNxtMonth ? filteredItemNxtMonth.process : "";

      let processcodeexpvalueNxtMonth =
        item.doj && modevalue && modevalue.expmode === "Manual"
          ? modevalue.salarycode + (differenceInMonthstar > 0 ? (differenceInMonthstar <= 9 ? `0${differenceInMonthstar}` : differenceInMonthstar) : "00")
          : item.doj
            ? getprocessCodeNxtMonth + (differenceInMonthstar > 0 ? (differenceInMonthstar <= 9 ? `0${differenceInMonthstar}` : differenceInMonthstar) : "00")
            : "";

      let CHECK_DEPARTMENT_ACCESS = departmentsList.find((d) => d.deptname === item.department);

      //findsalary from salaryslab
      let findSalDetails =
        modevalue && modevalue.expmode === "Manual"
          ? {
            basic: modevalue.basic,
            hra: modevalue.hra,
            conveyance: modevalue.conveyance,
            gross: modevalue.gross,
            medicalallowance: modevalue.medicalallowance,
            productionallowance: modevalue.productionallowance,
            otherallowance: modevalue.otherallowance,
            productionallowancetwo: modevalue.productionallowancetwo,
          }
          : salSlabs.find((d) => d.company === item.company && d.branch === item.branch && d.salarycode === processcodeexpvaluesalary);
      //shortageamount from shortage master
      let findShortage = manageshortagemasters.find((d) => d.department === item.department && differenceInMonths >= Number(d.from) && differenceInMonths <= Number(d.to));
      //revenue amount from revenue  master
      let findRevenueAllow = revenueAmount.find((d) => d.company === item.company && d.branch === item.branch && d.processcode === processcodeexpvaluesalary);
      //finderaamount from eraamount
      let findERAaountValue = eraAmounts.find((d) => d.company === item.company && d.branch === item.branch && d.processcode === processcodeexpvaluesalary);

      let findAcPointVal = acPointCal.find((d) => d.company === item.company && d.branch === item.branch && d.department === item.department);

      let totalShiftTrgt = findTotalNoOfDays ? Number(findTotalNoOfDays.shift) : 0;
      let totalWeekoffTrgt = findTotalNoOfDays ? Number(findTotalNoOfDays.weekoff) : 0;
      let totalWeekoffall = findTotalNoOfDays ? Number(findTotalNoOfDays.weekoffall) : 0;

      let totalShiftTrgtNxt = findTotalNoOfDaysNxtMonth ? Number(findTotalNoOfDaysNxtMonth.shift) : 0;
      let totalWeekoffTrgtNxt = findTotalNoOfDaysNxtMonth ? Number(findTotalNoOfDaysNxtMonth.weekoff) : 0;
      let totalWeekoffallNxt = findTotalNoOfDaysNxtMonth ? Number(findTotalNoOfDaysNxtMonth.weekoffall) : 0;
      // let findTarDetails = targetPoints.filter((d) => d.processcode === processcodeexpvalue).find((tr) => item.branch === tr.branch && item.company === tr.company && tr.processcode === processcodeexpvalue);

      // let findTargetVal = findTarDetails ? Number(findTarDetails.points) : 0;

      // let findTarDetailsNxtMonth = targetPoints.filter((d) => d.processcode === processcodeexpvalueNxtMonth).find((tr) => item.branch === tr.branch && item.company === tr.company && tr.processcode === processcodeexpvalueNxtMonth);

      // let findTargetValNxtMonth = findTarDetailsNxtMonth ? Number(findTarDetailsNxtMonth.points) : 0;
      const isHadreasondate = item.reasondate != "" && item.reasondate != undefined;

      const enddateproduction = isHadreasondate ? item.reasondate : findexp ? findexp.todate : selectedMonEndDate;

      //GET POINTS FOR SELECTEDMONTH
      let getdayPointsMonth = dayPointsUser
        .filter(
          (d) =>
            // console.log(   d.date , findDate , d.date , (findexp ? findexp.todate : selectedMonEndDate))
            d.date >= findDate && d.date <= enddateproduction && d.name === item.companyname
        )
        .reduce((acc, current) => {
          const existingItemIndex = acc.findIndex((item) => item.name === current.name && item.companyname === current.companyname && item.branch === current.branch && item.empcode === current.empcode);

          if (existingItemIndex !== -1) {
            // Update existing item
            const existingItem = acc[existingItemIndex];

            existingItem.point += Number(current.point);
            // existingItem.pointarray +=[ Number(current.point)];

            // existingItem.daypoint += Number(current.daypoint);
            existingItem.target += current.weekoff == "Not Allotted" || current.weekoff == "Not Allot" || current.weekoff == "" || current.weekoff == "Week Off" || current.daypointsts === "WEEKOFF" ? 0 : Number(current.target);
            // existingItem.weekoffcount += current.weekoff == "Not Allotted" || current.weekoff == "Not Allot" || current.weekoff == "" || current.weekoff == "Week Off" || current.daypointsts === "WEEKOFF" ? 1 : 0;
            existingItem.date.push(current.date);
            // existingItem.pointarray.push(current.weekoff == "Not Allotted" || current.weekoff == "Not Allot" || current.weekoff == "" || current.weekoff == "Week Off" || current.daypointsts === "WEEKOFF" ? 0 : Number(current.target));

            existingItem.allowancepoint += current.conshiftpoints && current.shiftsts === "Enable" ? Number(current.conshiftpoints) : current.allowancepoint ? Number(current.allowancepoint) : 0;

            if (current.shiftsts === "Enable" || current.allowancepoint >= 1) {
              existingItem.noallowancepoint++; // Increment count only if allowancepoint is present
            }

            existingItem.avgpoint = existingItem.target > 0 ? (existingItem.point / existingItem.target) * 100 : 0;
            existingItem.allowancetarget += current.shiftsts === "Enable" ? Number(current.target) : 0;
            // Convert the dates array to Date objects
            const dateObjects = existingItem.date.map((date) => new Date(date));

            // Find the earliest (from) and latest (to) dates
            const fromDate = new Date(Math.min(...dateObjects));
            const toDate = new Date(Math.max(...dateObjects));
            // Update start and end date
            existingItem.startDate = fromDate;
            existingItem.endDate = toDate;
          } else {
            // Add new item
            acc.push({
              companyname: current.companyname,
              name: current.name,
              // daypoint: Number(current.daypoint),
              avgpoint: (Number(current.point) / Number(current.target)) * 100,
              point: Number(current.point),
              target: current.weekoff == "Not Allotted" || current.weekoff == "Not Allot" || current.weekoff == "" || current.weekoff == "Week Off" || current.daypointsts === "WEEKOFF" ? 0 : Number(current.target),
              // _id: current.id,
              branch: current.branch,
              date: [current.date],
              unit: current.unit,
              team: current.team,
              empcode: current.empcode,
              // weekoffcount: current.weekoff == "Not Allotted" || current.weekoff == "Not Allot" || current.weekoff == "" || current.weekoff == "Week Off" || current.daypointsts === "WEEKOFF" ? 1 : 0,
              // doj: current.doj,
              // department: current.department,
              // prod: current.prod,
              startDate: current.date,
              endDate: current.date,
              allowancetarget: current.shiftsts === "Enable" ? Number(current.target) : 0,
              // pointarray: [current.weekoff == "Not Allotted" || current.weekoff == "Not Allot" || current.weekoff == "" || current.weekoff == "Week Off"  || current.daypointsts === "WEEKOFF" ? 0 : Number(current.target)],
              allowancepoint: current.conshiftpoints && current.shiftsts === "Enable" ? Number(current.conshiftpoints) : current.allowancepoint ? Number(current.allowancepoint) : 0,

              noallowancepoint: current.shiftsts === "Enable" || current.allowancepoint >= 1 ? 1 : 0,
            });
          }
          return acc;
        }, []);

      let findPointsDetails = getdayPointsMonth.find((d) => d.companyname === item.company && d.branch === item.branch && d.unit === item.unit && d.name === item.companyname);
      const enddateproductionnxtmonth = isHadreasondate ? item.reasondate : findNxtEndDate;

      //GET POINTS FOR CURRENT MONTH WHICH IS THE AFTER MONTH OF SELECTED MONTH
      let getdayPointsMonthNxtMonth = dayPointsUserNxtMonth
        .filter(
          (d) =>
            // console.log(   d.date , findDate , d.date , (findexp ? findexp.todate : selectedMonEndDate))
            d.date >= findNxtStartDate && d.date <= enddateproductionnxtmonth && d.name === item.companyname
        )
        .reduce((acc, current) => {
          const existingItemIndex = acc.findIndex((item) => item.name === current.name && item.companyname === current.companyname && item.branch === current.branch && item.empcode === current.empcode);

          if (existingItemIndex !== -1) {
            // Update existing item
            const existingItem = acc[existingItemIndex];

            existingItem.point += Number(current.point);
            // existingItem.daypoint += Number(current.daypoint);
            // existingItem.target = Number(findTargetValNxtMonth) * existingItem.date.length;
            existingItem.target += current.weekoff == "Not Allotted" || current.weekoff == "Not Allot" || current.weekoff == "" || current.weekoff == "Week Off" || current.daypointsts === "WEEKOFF" ? 0 : Number(current.target);

            existingItem.date.push(current.date);

            existingItem.allowancepoint += current.conshiftpoints && current.shiftsts === "Enable" ? Number(current.conshiftpoints) : current.allowancepoint ? Number(current.allowancepoint) : 0;
            if ((current.conshiftpoints >= 1 && current.shiftsts === "Enable") || current.allowancepoint >= 1) {
              existingItem.noallowancepoint++; // Increment count only if allowancepoint is present
            }

            existingItem.avgpoint = existingItem.target > 0 ? (existingItem.point / existingItem.target) * 100 : 0;

            // Convert the dates array to Date objects
            const dateObjects = existingItem.date.map((date) => new Date(date));

            // Find the earliest (from) and latest (to) dates
            const fromDate = new Date(Math.min(...dateObjects));
            const toDate = new Date(Math.max(...dateObjects));
            // Update start and end date
            existingItem.startDate = fromDate;
            existingItem.endDate = toDate;
          } else {
            // Add new item
            acc.push({
              companyname: current.companyname,
              name: current.name,
              // daypoint: Number(current.daypoint),
              avgpoint: (Number(current.point) / Number(current.target)) * 100,
              point: Number(current.point),
              target: current.weekoff == "Not Allotted" || current.weekoff == "Not Allot" || current.weekoff == "" || current.weekoff == "Week Off" || current.daypointsts === "WEEKOFF" ? 0 : Number(current.target),
              // _id: current.id,
              branch: current.branch,
              date: [current.date],
              unit: current.unit,
              team: current.team,
              empcode: current.empcode,

              startDate: current.date,
              endDate: current.date,
              allowancepoint: current.conshiftpoints && current.shiftsts === "Enable" ? Number(current.conshiftpoints) : current.allowancepoint ? Number(current.allowancepoint) : 0,
              // noallowancepoint:Number(current.noallowancepoint),
              noallowancepoint: (current.conshiftpoints && current.shiftsts === "Enable" ? Number(current.conshiftpoints) : current.allowancepoint ? Number(current.allowancepoint) : 0) > 0 ? 1 : 0,
            });
          }
          return acc;
        }, []);

      let findPointsDetailsNxtMonth = getdayPointsMonthNxtMonth.find(
        (d) => d.companyname == item.company && d.branch == item.branch && d.unit == item.unit && d.name == item.companyname
        // && d.empcode === item.empcode
      );
      // console.log(findPointsDetailsNxtMonth,'findPointsDetailsNxtMonth')
      // console.log(dayPointsUserNxtMonth, findPointsDetailsNxtMonth, findNxtStartDate, findNxtEndDate, 'dayPointsUserNxtMonth');

      let getdayPenaltyMonth = dayPenaltyUser
        .filter((d) => d.date >= findDate && d.date <= (findexp ? findexp.todate : selectedMonEndDate))
        .reduce((acc, current) => {
          const existingItemIndex = acc.findIndex((item) => item.name === current.name && item.company === current.company && item.branch === current.branch && item.empcode === current.empcode);

          if (existingItemIndex !== -1) {
            // Update existing item
            const existingItem = acc[existingItemIndex];

            existingItem.amount += Number(current.amount);

            existingItem.date.push(current.date);

            // Convert the dates array to Date objects
            const dateObjects = existingItem.date.map((date) => new Date(date));

            // Find the earliest (from) and latest (to) dates
            const fromDate = new Date(Math.min(...dateObjects));
            const toDate = new Date(Math.max(...dateObjects));
            // Update start and end date
            existingItem.startDate = fromDate;
            existingItem.endDate = toDate;
          } else {
            // Add new item
            acc.push({
              company: current.company,
              name: current.name,
              amount: Number(current.amount),
              _id: current.id,
              branch: current.branch,
              date: [current.date],
              unit: current.unit,
              team: current.team,
              empcode: current.empcode,
              startDate: current.date,
              endDate: current.date,
            });
          }
          return acc;
        }, []);

      let findPenaltyDetails = getdayPenaltyMonth.find(
        (d) =>
          d.company === item.company &&
          d.branch === item.branch &&
          d.unit === item.unit &&
          // && d.team === item.team
          d.name === item.companyname
      );
      let experienceinmonthCalcVal = item.doj ? calculateMonthsBetweenDates(item.doj, findDate) : 0;

      // REVENUE AMOUNT
      let revenueAmountCalc = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.era === true ? (findRevenueAllow ? Number(findRevenueAllow.amount) : 0) : 0;

      let shiftAllowAmt =
        item.shiftallowancelog && item.shiftallowancelog.length > 0
          ? item.shiftallowancelog.filter((d) => {
            return d.month === selectmonth && d.year == selectyear;
          })
          : [];

      let TargetPointAmt =
        item.targetpointlog && item.targetpointlog.length > 0
          ? item.targetpointlog.filter((d) => {
            return d.month === selectmonth && d.year == selectyear;
          })
          : [];

      let AcheivedPointAmt =
        item.acheivedpointlog && item.acheivedpointlog.length > 0
          ? item.acheivedpointlog.filter((d) => {
            return d.month === selectmonth && d.year == selectyear;
          })
          : [];
      let PenaltyPointAmt =
        item.penaltylog && item.penaltylog.length > 0
          ? item.penaltylog.filter((d) => {
            return d.month === selectmonth && d.year == selectyear;
          })
          : [];
      let totalPaidDaysLogVal =
        item.totalpaiddayslog && item.totalpaiddayslog.length > 0
          ? item.totalpaiddayslog.filter((d) => {
            return d.month === selectmonth && d.year == selectyear;
          })
          : [];
      let totalAbsentLogVal =
        item.totalabsentlog && item.totalabsentlog.length > 0
          ? item.totalabsentlog.filter((d) => {
            return d.month === selectmonth && d.year == selectyear;
          })
          : [];
      let currMonAvgLogVal =
        item.currmonthavglog && item.currmonthavglog.length > 0
          ? item.currmonthavglog.filter((d) => {
            return d.month === selectmonth && d.year == selectyear;
          })
          : [];
      let currMonAttLogVal =
        item.currmonthattlog && item.currmonthattlog.length > 0
          ? item.currmonthattlog.filter((d) => {
            return d.month === selectmonth && d.year == selectyear;
          })
          : [];

      let noShiftLogVal =
        item.noshiftlog && item.noshiftlog.length > 0
          ? item.noshiftlog.filter((d) => {
            return d.month === selectmonth && d.year == selectyear;
          })
          : [];

      let shiftAllowTargetlogVal =
        item.shiftallowtargetlog && item.shiftallowtargetlog.length > 0
          ? item.shiftallowtargetlog.filter((d) => {
            return d.month === selectmonth && d.year == selectyear;
          })
          : [];
      let nightShiftAllowlogLogVal =
        item.nightshiftallowlog && item.nightshiftallowlog.length > 0
          ? item.nightshiftallowlog.filter((d) => {
            return d.month === selectmonth && d.year == selectyear;
          })
          : [];

      let paidpresentdayvalue = findTotalNoOfDays ? findTotalNoOfDays.paidpresentday : 0;
      let leaveCountvalue = findTotalNoOfDays ? findTotalNoOfDays.leaveCount : 0;
      let holidayCountvalue = findTotalNoOfDays ? findTotalNoOfDays.holidayCount : 0;
      let shiftvalue = findTotalNoOfDays ? findTotalNoOfDays.shift : 0;
      let lopcountvalue = findTotalNoOfDays ? findTotalNoOfDays.lopcount : 0;
      let paiddayscalcvalfrommonthstatus = paidpresentdayvalue;
      // let paiddayscalcvalfrommonthstatus = Number(paidpresentdayvalue) + Number(leaveCountvalue) + Number(holidayCountvalue) > Number(shiftvalue) ? Number(shiftvalue) - Number(lopcountvalue) : Number(paidpresentdayvalue) + Number(leaveCountvalue) + Number(holidayCountvalue);

      let paidpresentdayallCalcVal = shiftvalue;
      let totalshiftCalcVal = Number(paidpresentdayallCalcVal);
      let totalasbleaveCalcVal = item.totalabsentlog && item.totalabsentlog.length > 0 && totalAbsentLogVal && totalAbsentLogVal.length > 0 ? Number(totalAbsentLogVal[totalAbsentLogVal.length - 1].value) : findTotalNoOfDays ? findTotalNoOfDays.lopcount : 0;
      let totalpaiddaycalVal = item.totalpaiddayslog && item.totalpaiddayslog.length > 0 && totalPaidDaysLogVal && totalPaidDaysLogVal.length > 0 ? Number(totalPaidDaysLogVal[totalPaidDaysLogVal.length - 1].value) : paiddayscalcvalfrommonthstatus;

      let pfvalues = item.assignpfesilog && item.assignpfesilog.length > 0 ? item.assignpfesilog[item.assignpfesilog.length - 1] : {};

      let targetPointCalcVaue = item.targetpointlog && item.targetpointlog.length > 0 && TargetPointAmt && TargetPointAmt.length > 0 ? TargetPointAmt[TargetPointAmt.length - 1].value : findPointsDetails ? findPointsDetails.target : 0;

      // let AcheivedPointsCalcVal = 0;
      let AcheivedPointsCalcVal = item.acheivedpointlog && item.acheivedpointlog.length > 0 && AcheivedPointAmt && AcheivedPointAmt.length > 0 ? Number(AcheivedPointAmt[AcheivedPointAmt.length - 1].value) : findPointsDetails ? Number(findPointsDetails.point) : 0;

      if (iswithedit == "withedit" && employeeWithEditNeedToRerun.some((d) => d.empcode === item.empcode && d.companyname === item.companyname)) {
        let findPRODEditvalue = employeeWithEditNeedToRerun.find((d) => d.empcode === item.empcode && d.companyname === item.companyname);
        // console.log(findPRODEditvalue, 'findPRODEditvalue');
        AcheivedPointsCalcVal = findPRODEditvalue ? Number(findPRODEditvalue.acheivedpoints) : 0;
      }
      // else {
      //   AcheivedPointsCalcVal = item.acheivedpointlog && item.acheivedpointlog.length > 0 && AcheivedPointAmt && AcheivedPointAmt.length > 0 ? Number(AcheivedPointAmt[AcheivedPointAmt.length - 1].value) : findPointsDetails ? Number(findPointsDetails.point) : 0;
      // }
      AcheivedPointsCalcVal = Number(Number(AcheivedPointsCalcVal).toFixed(2));
      let AcheivedPercentCalcVal = targetPointCalcVaue > 0 ? Number(((Number(AcheivedPointsCalcVal) / Number(targetPointCalcVaue)) * 100).toFixed(2)) : 0;

      let allowancepointCalcVal = item.shiftallowancelog && item.shiftallowancelog.length > 0 && shiftAllowAmt && shiftAllowAmt.length > 0 ? shiftAllowAmt[shiftAllowAmt.length - 1].value : findPointsDetails ? Number(findPointsDetails.allowancepoint.toFixed(2)) : 0;
      allowancepointCalcVal = Number(Number(allowancepointCalcVal).toFixed(2));
      let ERAAmountCalcVal = findERAaountValue ? Number(findERAaountValue.amount) : 0;

      let penaltyCalcVal = 0;
      if (iswithedit == "withedit" && employeeWithEditNeedToRerun.some((d) => d.empcode === item.empcode && d.companyname === item.companyname)) {
        let findpenaltyEditvalue = employeeWithEditNeedToRerun.find((d) => d.empcode === item.empcode && d.companyname === item.companyname);
        penaltyCalcVal = findpenaltyEditvalue ? Number(findpenaltyEditvalue.penaltyamount) : 0;
      } else {
        penaltyCalcVal = item.penaltylog && item.penaltylog.length > 0 && PenaltyPointAmt && PenaltyPointAmt.length > 0 ? Number(PenaltyPointAmt[PenaltyPointAmt.length - 1].value).toFixed(2) : findPenaltyDetails ? Number(findPenaltyDetails.amount.toFixed(2)) : 0;
      }

      penaltyCalcVal = Number(Number(penaltyCalcVal).toFixed(2));
      let totalNoOfDaysCalcVal = findTotalNoOfDays ? Number(findTotalNoOfDays.totalcounttillcurrendate) : 0;

      //PRODUCTION AND PRODCTION ALLOWACE2
      let oldprodAllowanceCalcVal = modevalue && modevalue.expmode === "Manual" ? Number(modevalue.productionallowance) : findSalDetails ? Number(findSalDetails.productionallowance) : 0;
      let oldprodAllowancetwoCalcVal = modevalue && modevalue.expmode === "Manual" ? Number(modevalue.productionallowancetwo) : findSalDetails ? Number(findSalDetails.productionallowancetwo) : 0;
      // ACUTAL BASIC/HRA/CONVEYACE/MEDICAL/OTHER ALLOWANCE
      let oldactualBasicCalcVal = modevalue && modevalue.expmode === "Manual" ? Number(modevalue.basic) : findSalDetails ? Number(findSalDetails.basic) : 0;
      let oldactualHraCalcVal = modevalue && modevalue.expmode === "Manual" ? Number(modevalue.hra) : findSalDetails ? Number(findSalDetails.hra) : 0;
      let oldactualConveyanceCalcVal = modevalue && modevalue.expmode === "Manual" ? Number(modevalue.conveyance) : findSalDetails ? Number(findSalDetails.conveyance) : 0;
      let oldactualMedicalAllowCalcVal = modevalue && modevalue.expmode === "Manual" ? Number(modevalue.medicalallowance) : findSalDetails ? Number(findSalDetails.medicalallowance) : 0;
      let oldactualOtherCalVAL = modevalue && modevalue.expmode === "Manual" ? Number(modevalue.otherallowance) : findSalDetails ? Number(findSalDetails.otherallowance) : 0;

      // const getDatesInRange = (fromDate, toDate) => {
      //   const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
      //   const startDate = new Date(fromDate);
      //   const endDate = new Date(toDate);

      //   // Add one day to include the end date
      //   endDate.setDate(endDate.getDate() + 1);

      //   let count = 0;
      //   for (let date = startDate; date < endDate; date.setDate(date.getDate() + 1)) {
      //     count++;
      //   }

      //   return count;
      // };

      // let tond = getDatesInRange(findDate, findmonthenddate);
      function getTotalDaysInMonthByName(monthName, year) {
        const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth() + 1; // Convert month name to number
        return new Date(year, monthIndex, 0).getDate();
      }

      let tond = getTotalDaysInMonthByName(selectmonth, Number(selectyear));

      // console.log(tond, 'tond');
      let prodAllowanceCalcVal = Number(((Number(oldprodAllowanceCalcVal) / tond) * totalshiftCalcVal).toFixed(2));
      let prodAllowancetwoCalcVal = Number(((Number(oldprodAllowancetwoCalcVal) / tond) * totalshiftCalcVal).toFixed(2));
      //calculated  ACUTAL BASIC/HRA/CONVEYACE/MEDICAL/OTHER ALLOWANCE
      let actualBasicCalcVal = Number(((Number(oldactualBasicCalcVal) / tond) * totalshiftCalcVal).toFixed(2));

      let actualHraCalcVal = Number(((Number(oldactualHraCalcVal) / tond) * totalshiftCalcVal).toFixed(2));
      let actualConveyanceCalcVal = Number(((Number(oldactualConveyanceCalcVal) / tond) * totalshiftCalcVal).toFixed(2));
      let actualMedicalAllowCalcVal = Number(((Number(oldactualMedicalAllowCalcVal) / tond) * totalshiftCalcVal).toFixed(2));
      let actualOtherCalVAL = Number(((Number(oldactualOtherCalVAL) / tond) * totalshiftCalcVal).toFixed(2));

      let oldgross = modevalue && modevalue.expmode === "Manual" ? Number(modevalue.gross) : Number(oldactualBasicCalcVal) + Number(oldactualHraCalcVal) + Number(oldactualConveyanceCalcVal) + Number(oldactualMedicalAllowCalcVal) + Number(oldprodAllowanceCalcVal) + Number(oldactualOtherCalVAL);

      let grossValue = modevalue && modevalue.expmode === "Manual" ? Number(modevalue.gross) : Number(actualBasicCalcVal) + Number(actualHraCalcVal) + Number(actualConveyanceCalcVal) + Number(actualMedicalAllowCalcVal) + Number(prodAllowanceCalcVal) + Number(actualOtherCalVAL);
      grossValue = Number(Number(grossValue).toFixed(2));
      ///FINAL-FIXED-PROD SALARY CALCULATION STARTED--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

      let findPFpercentage = modevalue && modevalue.expmode === "Manual" ? Number(modevalue.pfemployeepercentage) : findSalDetails ? Number(findSalDetails.pfemployeepercentage) : 0;
      let findESIpercentage = modevalue && modevalue.expmode === "Manual" ? Number(modevalue.esiemployeepercentage) : findSalDetails ? Number(findSalDetails.esiemployeepercentage) : 0;
      let findEsiMAXSalary = findSalDetails ? Number(findSalDetails.esimaxsalary) : 0;
      let findEmployerPercentage = findSalDetails ? Number(findSalDetails.pfpercentage) : 0;
      let findEmployerESIPercentage = findSalDetails ? Number(findSalDetails.esipercentage) : 0;

      //ATTENDANCE LOP CALCUCLATION
      let attendanceLopCalVal = totalshiftCalcVal > 0 ? ((actualBasicCalcVal + actualHraCalcVal + actualConveyanceCalcVal + actualMedicalAllowCalcVal + actualOtherCalVAL) / totalshiftCalcVal) * Number(totalasbleaveCalcVal) : 0;
      //ACHEIVED PRODUCTION ALLOWANCE
      let acheivedProductionAllowanceValCal =
        AcheivedPointsCalcVal && Number(AcheivedPointsCalcVal) > 0 && Number(targetPointCalcVaue ? targetPointCalcVaue : 0) > 0
          ? AcheivedPointsCalcVal < targetPointCalcVaue
            ? Number(prodAllowanceCalcVal) - (prodAllowancetwoCalcVal ? Number(prodAllowancetwoCalcVal) : 0) * ((100 - (Number(AcheivedPointsCalcVal ? AcheivedPointsCalcVal : 0) * 100) / Number(targetPointCalcVaue ? targetPointCalcVaue : 0)) * 0.01)
            : Number(prodAllowanceCalcVal) * (((Number(AcheivedPointsCalcVal ? AcheivedPointsCalcVal : 0) * 100) / Number(targetPointCalcVaue ? targetPointCalcVaue : 0)) * 0.01)
          : 0;

      //LOP BASIC
      let lopBasicValCal = totalNoOfDaysCalcVal > 0 ? (Number(totalpaiddaycalVal) + Number(totalasbleaveCalcVal) > Number(totalNoOfDaysCalcVal) ? (Number(actualBasicCalcVal) / (totalasbleaveCalcVal + totalpaiddaycalVal)) * totalNoOfDaysCalcVal : (Number(actualBasicCalcVal) / totalshiftCalcVal) * totalpaiddaycalVal) : 0;

      let lopHRAValCal = totalNoOfDaysCalcVal > 0 ? (Number(totalpaiddaycalVal) + Number(totalasbleaveCalcVal) > Number(totalNoOfDaysCalcVal) ? (Number(actualHraCalcVal) / (totalasbleaveCalcVal + totalpaiddaycalVal)) * totalNoOfDaysCalcVal : (Number(actualHraCalcVal) / totalshiftCalcVal) * totalpaiddaycalVal) : 0;

      let lopConveyValCal = totalNoOfDaysCalcVal > 0 ? (Number(totalpaiddaycalVal) + Number(totalasbleaveCalcVal) > Number(totalNoOfDaysCalcVal) ? (Number(actualConveyanceCalcVal) / (totalasbleaveCalcVal + totalpaiddaycalVal)) * totalNoOfDaysCalcVal : (Number(actualConveyanceCalcVal) / totalshiftCalcVal) * totalpaiddaycalVal) : 0;

      let lopMedicalValCal = totalNoOfDaysCalcVal > 0 ? (Number(totalpaiddaycalVal) + Number(totalasbleaveCalcVal) > Number(totalNoOfDaysCalcVal) ? (Number(actualMedicalAllowCalcVal) / (totalasbleaveCalcVal + totalpaiddaycalVal)) * totalNoOfDaysCalcVal : (Number(actualMedicalAllowCalcVal) / totalshiftCalcVal) * totalpaiddaycalVal) : 0;

      let lopOtherValCal = totalNoOfDaysCalcVal > 0 ? (Number(totalpaiddaycalVal) + Number(totalasbleaveCalcVal) > Number(totalNoOfDaysCalcVal) ? (Number(actualOtherCalVAL) / (totalasbleaveCalcVal + totalpaiddaycalVal)) * totalNoOfDaysCalcVal : (Number(actualOtherCalVAL) / totalshiftCalcVal) * totalpaiddaycalVal) : 0;

      let lopProductionAllowance =
        AcheivedPointsCalcVal && Number(AcheivedPointsCalcVal) > 0
          ? AcheivedPointsCalcVal < targetPointCalcVaue
            ? Number(prodAllowanceCalcVal) - (prodAllowancetwoCalcVal ? Number(prodAllowancetwoCalcVal) : 0) * ((100 - (Number(AcheivedPointsCalcVal ? AcheivedPointsCalcVal : 0) * 100) / Number(targetPointCalcVaue ? targetPointCalcVaue : 0)) * 0.01)
            : Number(prodAllowanceCalcVal) * (((Number(AcheivedPointsCalcVal ? AcheivedPointsCalcVal : 0) * 100) / Number(targetPointCalcVaue ? targetPointCalcVaue : 0)) * 0.01)
          : 0;
      //  AcheivedPointsCalcVal > 0 ? (AcheivedPointsCalcVal < targetPointCalcVaue ? prodAllowanceCalcVal - (prodAllowancetwoCalcVal * (100 - (AcheivedPointsCalcVal * 100) / targetPointCalcVaue)) * 0.01 : (prodAllowanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal) : 0;

      //PROD BASIC
      let prodBasicValCalc = lopBasicValCal;
      let prodHraValCalc = lopHRAValCal;
      let prodConveyanceValCalc = lopConveyValCal;
      let prodMEDAllowanceValCalc = lopMedicalValCal;
      let prodOtherValCalc = lopOtherValCal;
      let prodPRODValCalc = lopProductionAllowance;
      if (CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.prod === true) {
        if (Number(prodAllowanceCalcVal) === 0) {
          prodBasicValCalc = lopBasicValCal;
          prodHraValCalc = lopHRAValCal;
          prodConveyanceValCalc = lopConveyValCal;
          prodMEDAllowanceValCalc = lopMedicalValCal;
          prodOtherValCalc = lopOtherValCal;
          prodPRODValCalc = lopProductionAllowance;
        } else {
          prodBasicValCalc = acheivedProductionAllowanceValCal == 0 ? 0 : acheivedProductionAllowanceValCal > 0 ? lopBasicValCal : lopBasicValCal + (lopBasicValCal * ((100 * acheivedProductionAllowanceValCal) / (lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopOtherValCal))) / 100;
          prodHraValCalc = acheivedProductionAllowanceValCal == 0 ? 0 : acheivedProductionAllowanceValCal > 0 ? lopHRAValCal : lopHRAValCal + (lopHRAValCal * ((100 * acheivedProductionAllowanceValCal) / (lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopOtherValCal))) / 100;
          prodConveyanceValCalc = acheivedProductionAllowanceValCal == 0 ? 0 : acheivedProductionAllowanceValCal > 0 ? lopConveyValCal : lopConveyValCal + (lopConveyValCal * ((100 * acheivedProductionAllowanceValCal) / (lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopOtherValCal))) / 100;
          prodMEDAllowanceValCalc = acheivedProductionAllowanceValCal == 0 ? 0 : acheivedProductionAllowanceValCal > 0 ? lopMedicalValCal : lopMedicalValCal + (lopMedicalValCal * ((100 * acheivedProductionAllowanceValCal) / (lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopOtherValCal))) / 100;
          prodMEDAllowanceValCalc = acheivedProductionAllowanceValCal == 0 ? 0 : acheivedProductionAllowanceValCal > 0 ? lopOtherValCal : lopOtherValCal + (lopOtherValCal * ((100 * acheivedProductionAllowanceValCal) / (lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopOtherValCal))) / 100;
          prodPRODValCalc = acheivedProductionAllowanceValCal == 0 ? 0 : acheivedProductionAllowanceValCal > 0 ? acheivedProductionAllowanceValCal : 0;
        }
      } else {
        prodBasicValCalc = lopBasicValCal;
        prodHraValCalc = lopHRAValCal;
        prodConveyanceValCalc = lopConveyValCal;
        prodMEDAllowanceValCalc = lopMedicalValCal;
        prodOtherValCalc = lopOtherValCal;
        prodPRODValCalc = lopProductionAllowance;
      }

      //  ? lopBasicValCal

      //   : prodAllowanceCalcVal === 0 ? 0 :

      //   prodAllowanceCalcVal > 0 ?
      //    lopBasicValCal :
      //  lopBasicValCal + (lopBasicValCal * ((100 * acheivedProductionAllowanceValCal) / (lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopOtherValCal))) / 100;

      //PROD HRA
      // let prodHraValCalc =
      //   CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.prod === false
      //     ? lopHRAValCal
      //     : acheivedProductionAllowanceValCal === 0
      //     ? 0
      //     : acheivedProductionAllowanceValCal > 0
      //     ? lopHRAValCal
      //     : lopHRAValCal + (lopHRAValCal * ((100 * acheivedProductionAllowanceValCal) / (lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopOtherValCal))) / 100;
      //PROD CONVEYANCE
      // let prodConveyanceValCalc =
      //   CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.prod === false
      //     ? lopConveyValCal
      //     : acheivedProductionAllowanceValCal === 0
      //     ? 0
      //     : acheivedProductionAllowanceValCal > 0
      //     ? lopConveyValCal
      //     : lopConveyValCal + (lopConveyValCal * ((100 * acheivedProductionAllowanceValCal) / (lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopOtherValCal))) / 100;

      //PROD MEDICAL ALLOWANCE
      // let prodMEDAllowanceValCalc =
      //   CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.prod === false
      //     ? lopMedicalValCal
      //     : acheivedProductionAllowanceValCal === 0
      //     ? 0
      //     : acheivedProductionAllowanceValCal > 0
      //     ? lopMedicalValCal
      //     : lopMedicalValCal + (lopMedicalValCal * ((100 * acheivedProductionAllowanceValCal) / (lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopOtherValCal))) / 100;

      //PROD OTHER ALLOWANCE
      // let prodOtherValCalc =
      //   CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.prod === false
      //     ? lopOtherValCal
      //     : acheivedProductionAllowanceValCal === 0
      //     ? 0
      //     : acheivedProductionAllowanceValCal > 0
      //     ? lopOtherValCal
      //     : lopOtherValCal + (lopOtherValCal * ((100 * acheivedProductionAllowanceValCal) / (lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopOtherValCal))) / 100;

      //PROD PRODUCTION ALLOWANCE
      // let prodPRODValCalc = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.prod === false ?
      //  lopProductionAllowance : acheivedProductionAllowanceValCal > 0 ? acheivedProductionAllowanceValCal : 0;

      let penaltyAmtCalculationVal =
        Number(differenceInMonthsexp) <= 0
          ? 0
          : Number(differenceInMonthsexp) >= 1
            ? Number(differenceInMonthsexp) >= 2
              ? Number(differenceInMonthsexp) >= 3
                ? Number(differenceInMonthsexp) >= 4
                  ? Number(penaltyCalcVal) - Number(penaltyCalcVal) * 0
                  : Number(penaltyCalcVal) - Number(penaltyCalcVal) * 0.25
                : Number(penaltyCalcVal) - Number(penaltyCalcVal) * 0.5
              : Number(penaltyCalcVal) - Number(penaltyCalcVal) * 0.75
            : Number(penaltyCalcVal) - Number(penaltyCalcVal) * 1;

      let calcNetSalaryValCalc = Number(AcheivedPointsCalcVal) === 0 && Number(prodAllowanceCalcVal) > 0 ? 0 : lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopProductionAllowance + lopOtherValCal;

      let ProdNetSalaryFinal = prodBasicValCalc + prodHraValCalc + prodConveyanceValCalc + prodMEDAllowanceValCalc + prodPRODValCalc + prodOtherValCalc;

      let lossDed = 0;
      let OtherDed = 0;

      let finalBasicValCalc = prodBasicValCalc === 0 ? 0 : prodBasicValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodBasicValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;
      let finalHraValCalc = prodHraValCalc === 0 ? 0 : prodHraValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodHraValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;
      let finalConveyValCalc = prodConveyanceValCalc === 0 ? 0 : prodConveyanceValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodConveyanceValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;

      let finalMedicalAllowValcCalc =
        prodMEDAllowanceValCalc === 0 ? 0 : prodMEDAllowanceValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodMEDAllowanceValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;
      let finalOtherValcCalc = prodOtherValCalc === 0 ? 0 : prodOtherValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodOtherValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;
      let finalProductionValcCalc = prodPRODValCalc === 0 ? 0 : prodPRODValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodPRODValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;

      let finalNetSalaryValcCalc = finalBasicValCalc + finalHraValCalc + finalConveyValCalc + finalMedicalAllowValcCalc + finalProductionValcCalc + finalOtherValcCalc;

      //PFDAYS AND PFDEDUCTION
      let userWeekoff = findTotalNoOfDays ? Number(findTotalNoOfDays.weekoff) : 0;
      let userCLSL = findTotalNoOfDays ? Number(findTotalNoOfDays.clsl) : 0;
      let DLOB = findTotalNoOfDays ? Number(findTotalNoOfDays.dlob) : 0;
      let Present = findTotalNoOfDays ? Number(findTotalNoOfDays.present) : 0;
      //PFDAYS AND PFDEDUCTION
      // let pfdatcal = 0;
      // let daysp = totalshiftCalcVal - totalasbleaveCalcVal;
      // let IsExDate = pfvalues.pfenddate && pfvalues.pfenddate !== '' ? true : false;
      // //Dftdate = pfesifromdate findDate = monthstart fromdate or month fromdate
      // let pfmode = pfvalues.pffromdate > findDate ? 'S' : IsExDate ? 'E' : 'ALL';
      // let PLOP = userWeekoff + userCLSL;

      // pfdatcal = pfmode === 'S' || pfmode === 'E' ? Number(pfdatcal) + userWeekoff + userCLSL + Number(Present) - DLOB : Number(Present) + Number(PLOP);
      // let PfDate = daysp >= pfdatcal ? (IsExDate === true && new Date(pfvalues.pfenddate) < new Date(findDate) ? 0 : Number(pfdatcal) + Number(totalasbleaveCalcVal)) : Number(daysp) + Number(totalasbleaveCalcVal);
      // let pfDaysVal = pfvalues.pfdeduction === true ? PfDate : 0;
      // let pfAmount = pfvalues.pfdeduction === true ? Number(findPFpercentage) / 100 : 0;
      // console.log(pfDaysVal, daysp, daysp >= pfdatcal, pfdatcal, IsExDate, 'PfDate');
      let pfdatcal = 0;
      let daysp = totalshiftCalcVal - totalasbleaveCalcVal;
      let IsExDate = pfvalues.pfenddate ? true : false;
      //Dftdate = pfesifromdate findDate = monthstart fromdate or month fromdate
      let pfmode = pfvalues.pffromdate > findDate ? "S" : IsExDate ? "E" : "ALL";
      let PLOP = (findTotalNoOfDays ? findTotalNoOfDays.weekoff : 0) + (findTotalNoOfDays ? findTotalNoOfDays.clsl : 0);
      pfdatcal = pfmode === "S" || pfmode === "E" ? Number(pfdatcal) + Number(totalpaiddaycalVal) : Number(totalpaiddaycalVal);
      let PfDate = daysp >= pfdatcal ? (IsExDate === true && new Date(pfvalues.pfenddate) < new Date(findDate) ? 0 : Number(pfdatcal) + Number(totalasbleaveCalcVal)) : Number(daysp ? daysp : 0) + Number(totalasbleaveCalcVal ? totalasbleaveCalcVal : 0);
      // console.log(daysp >= pfdatcal, daysp, pfdatcal, PfDate, 'PfDate');

      let pfDaysVal = pfvalues.pfdeduction === true ? PfDate : 0;
      let pfAmount = pfvalues.pfdeduction === true ? Number(findPFpercentage) / 100 : 0;
      // console.log(pfDaysVal, 'PfDate');
      // console.log(pfDaysVal, 'PfDate');
      // console.log(pfDaysVal, 'PfDate');
      let PF_deduction = pfDaysVal > 0 && totalshiftCalcVal > 0 ? Number(((Number(finalBasicValCalc) / Number(totalshiftCalcVal)) * Number(pfDaysVal) * Number(pfAmount)).toFixed(2)) : 0;

      //  let PF_deduction  = ((pfDaysVal >= totalshiftCalcVal) ? (finalBasicValCalc * (Number(findPFpercentage)/100)) : ((finalBasicValCalc / totalshiftCalcVal) * pfDaysVal) * (Number(findPFpercentage)/100)) : 0
      // FIND SHIFTALLOWACE
      // let checkShiftAllowApplies = shifts.find((d) => d.name === item.shifttiming);
      // let CHECKSHIFTALLOWANCE = checkShiftAllowApplies ? checkShiftAllowApplies.isallowance : "Disable";

      let noshiftlogvalfinal = item.noshiftlog && item.noshiftlog.length > 0 && noShiftLogVal && noShiftLogVal.length > 0 ? Number(noShiftLogVal[noShiftLogVal.length - 1].value) : findPointsDetails ? findPointsDetails.noallowancepoint : 0;
      let shiftallowanceTargetDaypoint = item.noshiftlog && item.noshiftlog.length > 0 && noShiftLogVal && noShiftLogVal.length > 0 ? Number(noShiftLogVal[noShiftLogVal.length - 1].value) : findPointsDetails ? Number(findPointsDetails.allowancetarget) : 0;

      let shiftallowancetarget = noshiftlogvalfinal > 0 ? shiftallowanceTargetDaypoint : 0;

      let shiftallowancetargetfinal = item.shiftallowtargetlog && item.shiftallowtargetlog.length > 0 && shiftAllowTargetlogVal && shiftAllowTargetlogVal.length > 0 ? Number(shiftAllowTargetlogVal[shiftAllowTargetlogVal.length - 1].value) : shiftallowancetarget;

      let nightAllowancefinalcalculation =
        //  CHECKSHIFTALLOWANCE === "Enable" &&
        noshiftlogvalfinal > 0 ? ((1000 / tond) * noshiftlogvalfinal * (allowancepointCalcVal > 0 ? (allowancepointCalcVal * 100) / shiftallowancetargetfinal : 0)) / 100 : 0;

      let nightAllowanceCalcVal = item.nightshiftallowlog && item.nightshiftallowlog.length > 0 && nightShiftAllowlogLogVal && nightShiftAllowlogLogVal.length > 0 ? Number(nightShiftAllowlogLogVal[nightShiftAllowlogLogVal.length - 1].value) : nightAllowancefinalcalculation;

      //ESI-DEDCUTIONss
      let Esiper = pfvalues.esideduction === true ? Number(findEmployerESIPercentage) / 100 : 0;

      let ESI_deduction = grossValue >= findEsiMAXSalary || oldgross >= findEsiMAXSalary ? 0 : pfDaysVal > 0 && totalshiftCalcVal > 0 ? (finalNetSalaryValcCalc / totalshiftCalcVal) * pfDaysVal * Esiper : 0;
      let ncpDaysVal =
        totalpaiddaycalVal > 0
          ? // ( totalNoOfDaysCalcVal - ((((finalBasicValCalc * totalNoOfDaysCalcVal) / actualBasicCalcVal) - (totalNoOfDaysCalcVal - pfDaysVal)).toFixed(0)) )
          Number(totalNoOfDaysCalcVal) - Math.abs(Math.round((finalBasicValCalc * totalNoOfDaysCalcVal) / actualBasicCalcVal - (totalNoOfDaysCalcVal - pfDaysVal)))
          : 0;

      let finalLOPDaysCalcVal = Math.round(
        Number(totalasbleaveCalcVal) + (Number(actualBasicCalcVal) === 0 ? 0 : Number(totalshiftCalcVal) - (Number(totalshiftCalcVal) * Number(finalBasicValCalc)) / Number(actualBasicCalcVal)) < Number(totalshiftCalcVal)
          ? Number(totalasbleaveCalcVal) + (Number(actualBasicCalcVal) === 0 ? 0 : Number(totalshiftCalcVal) - (Number(totalshiftCalcVal) * Number(finalBasicValCalc)) / Number(actualBasicCalcVal))
          : Number(totalshiftCalcVal)
      );

      let paySlipLopCalval = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 || grossValue === 0 ? 0 : totalshiftCalcVal - Math.round((totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue) < 0 ? 0 : totalshiftCalcVal - Math.round((totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue);

      let finalLeaveDeductionValCalc =
        //  totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 ? 0 : (grossValue / totalshiftCalcVal) * ((totalshiftCalcVal - (totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue).toFixed(0) < 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue);
        totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 || grossValue === 0 ? 0 : (grossValue / totalshiftCalcVal) * (totalshiftCalcVal - (totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue < 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue);

      let findprofTaxAmt = profTaxMaster.find((d) => d.company == item.company && d.branch === item.branch && Number(d.fromamount) <= finalNetSalaryValcCalc && Number(d.toamount) + 0.99 >= finalNetSalaryValcCalc);

      let profTaxCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.tax === false ? 0 : findprofTaxAmt ? Number(findprofTaxAmt.taxamount) : 0;

      let totalDeductionValCalc = Number(profTaxCalcVal) + Number(ESI_deduction) + Number(PF_deduction);

      let finalSalaryCalcVal = finalNetSalaryValcCalc - totalDeductionValCalc + nightAllowanceCalcVal > grossValue && AcheivedPercentCalcVal < 100 ? grossValue : finalNetSalaryValcCalc - totalDeductionValCalc + nightAllowanceCalcVal;
      let finalSalary_Penalty = finalSalaryCalcVal + penaltyAmtCalculationVal > 0 ? (finalSalaryCalcVal + penaltyAmtCalculationVal + lossDed + OtherDed > grossValue ? finalSalaryCalcVal : finalSalaryCalcVal + penaltyAmtCalculationVal + lossDed + OtherDed) : 0;

      let Mvalue = findAcPointVal ? Number(findAcPointVal.multiplevalue) : 0;
      let Dvalue = findAcPointVal ? Number(findAcPointVal.dividevalue) : 0;
      // let Dvalue = findAcPointVal ? Number(findAcPointVal.multiplevalue) : 0;
      // let Mvalue = findAcPointVal ? Number(findAcPointVal.dividevalue) : 0;
      let totalPointsValueCalc = (Number(AcheivedPointsCalcVal) / Dvalue) * Mvalue ? ((Number(AcheivedPointsCalcVal) / Dvalue) * Mvalue).toFixed(2) : Number(0).toFixed(2);

      let acutalERAValCalc = totalasbleaveCalcVal > 2 ? (ERAAmountCalcVal - (ERAAmountCalcVal / totalshiftCalcVal) * totalasbleaveCalcVal).toFixed(2) : Number(ERAAmountCalcVal);

      let pfAmount1 = findEmployerPercentage;

      let PF_Emper_deduction = pfAmount1 > 0 && totalshiftCalcVal > 0 ? (finalBasicValCalc / totalshiftCalcVal) * pfDaysVal * (pfAmount1 / 100) : 0;

      //ESI-DEDCUTION
      let ESI_EMPR_Perncetage = pfvalues.esideduction === true ? Number(findESIpercentage) / 100 : 0;

      let ESI_EMPR_deduction = grossValue >= findEsiMAXSalary || oldgross >= findEsiMAXSalary ? 0 : pfDaysVal > 0 && totalshiftCalcVal > 0 ? (finalNetSalaryValcCalc / totalshiftCalcVal) * pfDaysVal * ESI_EMPR_Perncetage : 0;

      let CTC_Calcval = Number(finalSalaryCalcVal) + Number(ESI_deduction) + Number(PF_deduction) + Number(ESI_EMPR_deduction) + Number(PF_Emper_deduction) + Number(profTaxCalcVal);

      let finalValueCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === true ? Number(totalPointsValueCalc) - (Number(acutalERAValCalc) + Number(CTC_Calcval)) + Number(revenueAmountCalc) : 0;

      let final_Value_PenaltyCalcval = finalValueCalcVal - (Number(penaltyAmtCalculationVal) + Number(lossDed) + Number(OtherDed));

      final_Value_PenaltyCalcval = final_Value_PenaltyCalcval > 0 ? (finalValueCalcVal >= grossValue ? finalValueCalcVal : final_Value_PenaltyCalcval) : 0;

      let ShortageCalVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.era === true ? (findShortage ? Number(findShortage.amount) : 0) : 0;

      let Shortage1ValCalc = ShortageCalVal > 0 && totalNoOfDaysCalcVal > 0 ? (CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.era === true ? (Number(ShortageCalVal) * Number(totalpaiddaycalVal)) / Number(tond) : 0) : 0;
      // console.log(CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.era, Shortage1ValCalc, "deductin")
      let acutalDeductionCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true ? (Number(totalPointsValueCalc) + Number(revenueAmountCalc) - (Number(CTC_Calcval) + Number(Shortage1ValCalc)) >= 0 ? 0 : Number(totalPointsValueCalc) + Number(revenueAmountCalc) - (Number(CTC_Calcval) + Number(Shortage1ValCalc))) : 0;

      let minimumDeductionCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true ? (Number(Shortage1ValCalc) + Number(acutalDeductionCalcVal) >= 0 ? 0 : Number(Shortage1ValCalc) + Number(acutalDeductionCalcVal)) : 0;

      let LossDeduction = Number(minimumDeductionCalcVal) + (Number(acutalDeductionCalcVal) - Number(OtherDed) - Number(minimumDeductionCalcVal));

      lossDed = LossDeduction > 0 ? Number(LossDeduction) : Number(-1) * Number(LossDeduction);

      // -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

      // RCALCULATION AFTER FIND LOSS DEDUCTION

      if (calcNetSalaryValCalc > 0) {
        finalBasicValCalc = prodBasicValCalc === 0 ? 0 : prodBasicValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodBasicValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;
        finalHraValCalc = prodHraValCalc === 0 ? 0 : prodHraValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodHraValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;
        finalConveyValCalc = prodConveyanceValCalc === 0 ? 0 : prodConveyanceValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodConveyanceValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;

        finalMedicalAllowValcCalc =
          prodMEDAllowanceValCalc === 0 ? 0 : prodMEDAllowanceValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodMEDAllowanceValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;
        finalOtherValcCalc = prodOtherValCalc === 0 ? 0 : prodOtherValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodOtherValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;
        finalProductionValcCalc = prodPRODValCalc === 0 ? 0 : prodPRODValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodPRODValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;

        finalNetSalaryValcCalc = finalBasicValCalc + finalHraValCalc + finalConveyValCalc + finalMedicalAllowValcCalc + finalProductionValcCalc + finalOtherValcCalc;
      }

      finalBasicValCalc = finalBasicValCalc > 0 ? finalBasicValCalc : 0;
      finalHraValCalc = finalHraValCalc > 0 ? finalHraValCalc : 0;
      finalConveyValCalc = finalConveyValCalc > 0 ? finalConveyValCalc : 0;

      // prodConveyanceValCalc === 0 ? 0 : prodConveyanceValCalc * ((((calcNetSalaryValCalc - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / calcNetSalaryValCalc) * 0.01) > 0 ? prodConveyanceValCalc * ((((calcNetSalaryValCalc - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / calcNetSalaryValCalc) * 0.01) : 0;
      finalMedicalAllowValcCalc = finalMedicalAllowValcCalc > 0 ? finalMedicalAllowValcCalc : 0;
      finalOtherValcCalc = finalOtherValcCalc > 0 ? finalOtherValcCalc : 0;
      finalProductionValcCalc = finalProductionValcCalc > 0 ? finalProductionValcCalc : 0;

      finalNetSalaryValcCalc = Number(finalBasicValCalc) + Number(finalHraValCalc) + Number(finalConveyValCalc) + Number(finalMedicalAllowValcCalc) + Number(finalProductionValcCalc) + Number(finalOtherValcCalc);
      //PFDAYS AND PFDEDUCTION
      //  pfdatcal = 0;
      //  daysp = totalshiftCalcVal - totalasbleaveCalcVal;
      //  IsExDate = item.isenddate ? item.isenddate : false;
      // //Dftdate = pfesifromdate findDate = monthstart fromdate or month fromdate
      //  pfmode = item.pfesifromdate > findDate ? "S" : IsExDate ? "E" : "ALL";
      //  PLOP = (findTotalNoOfDays && findTotalNoOfDays.weekoff) + (findTotalNoOfDays && findTotalNoOfDays.clsl);

      // pfdatcal = pfmode == "S" || pfmode == "E" ? pfdatcal + (findTotalNoOfDays && findTotalNoOfDays.weekoff) + (findTotalNoOfDays && findTotalNoOfDays.clsl) + totalshiftCalcVal : totalshiftCalcVal + PLOP;
      //  PfDate = daysp >= pfdatcal ? ((IsExDate == true && item.pfesienddate) < findDate ? "0" : Number(pfdatcal) + Number(totalasbleaveCalcVal)) : daysp + totalasbleaveCalcVal;

      //  pfDaysVal = item.pfdeduction === true ? PfDate : 0;
      //  pfAmount = item.pfdeduction === true ? Number(findPFpercentage) / 100 : 0;

      PF_deduction = pfDaysVal > 0 ? ((Number(finalBasicValCalc) / Number(totalshiftCalcVal)) * Number(pfDaysVal) * Number(pfAmount)).toFixed(2) : 0;

      // PF_deduction  = ((pfDaysVal >= totalshiftCalcVal) ? (finalBasicValCalc * (Number(findPFpercentage)/100)) : ((finalBasicValCalc / totalshiftCalcVal) * pfDaysVal) * (Number(findPFpercentage)/100)) : 0
      // FIND SHIFTALLOWACE
      //  checkShiftAllowApplies = shifts.find((d) => d.name === item.shifttiming);
      //  CHECKSHIFTALLOWANCE = checkShiftAllowApplies ? checkShiftAllowApplies.isallowance : "Disable";
      //ESI-DEDCUTIONss
      //  Esiper = item.esideduction === true ? Number(findESIpercentage) / 100 : 0;

      ESI_deduction = grossValue >= findEsiMAXSalary || oldgross >= findEsiMAXSalary ? 0 : pfDaysVal > 0 && totalshiftCalcVal > 0 ? (finalNetSalaryValcCalc / totalshiftCalcVal) * pfDaysVal * Esiper : 0;

      let ncpvaluecalc = Number(totalNoOfDaysCalcVal) - Math.round((finalBasicValCalc * totalNoOfDaysCalcVal) / actualBasicCalcVal - (totalNoOfDaysCalcVal - pfDaysVal));
      let ncpvaluecalc1 = Number(totalNoOfDaysCalcVal) - Math.round((finalBasicValCalc * totalNoOfDaysCalcVal) / actualBasicCalcVal);

      ncpDaysVal =
        totalpaiddaycalVal > 0
          ? // ( totalNoOfDaysCalcVal - ((((finalBasicValCalc * totalNoOfDaysCalcVal) / actualBasicCalcVal) - (totalNoOfDaysCalcVal - pfDaysVal)).toFixed(0)) )
          // totalNoOfDaysCalcVal - Math.round((finalBasicValCalc * totalNoOfDaysCalcVal) / actualBasicCalcVal - (totalNoOfDaysCalcVal - pfDaysVal))
          pfvalues.pfdeduction === true
            ? ncpvaluecalc
            : ncpvaluecalc1
          : 0;

      finalLOPDaysCalcVal = Math.round(
        Number(totalasbleaveCalcVal) + (Number(actualBasicCalcVal) === 0 ? 0 : Number(totalshiftCalcVal) - (Number(totalshiftCalcVal) * Number(finalBasicValCalc)) / Number(actualBasicCalcVal)) < Number(totalshiftCalcVal)
          ? Number(totalasbleaveCalcVal) + (Number(actualBasicCalcVal) === 0 ? 0 : Number(totalshiftCalcVal) - (Number(totalshiftCalcVal) * Number(finalBasicValCalc)) / Number(actualBasicCalcVal))
          : Number(totalshiftCalcVal)
      );

      paySlipLopCalval = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 || Number(grossValue) === 0 ? 0 : totalshiftCalcVal - Math.round((totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue) < 0 ? 0 : totalshiftCalcVal - Math.round((totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue);

      finalLeaveDeductionValCalc =
        Number(totalNoOfDaysCalcVal) === 0 || Number(totalpaiddaycalVal) === 0 || Number(grossValue) === 0
          ? 0
          : (Number(grossValue) / Number(totalshiftCalcVal)) * (Number(totalshiftCalcVal) - (totalshiftCalcVal * Number(finalNetSalaryValcCalc)) / Number(grossValue) < 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue);

      findprofTaxAmt = profTaxMaster.find((d) => d.company === item.company && d.branch === item.branch && Number(d.fromamount) <= finalNetSalaryValcCalc && Number(d.toamount) + 0.99 >= finalNetSalaryValcCalc);

      profTaxCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.tax === false ? 0 : findprofTaxAmt ? Number(findprofTaxAmt.taxamount) : 0;

      totalDeductionValCalc = Number(profTaxCalcVal) + Number(ESI_deduction) + Number(PF_deduction);
      // (((decimal.Parse(shiftAllowance) / tond)) * ShiftNight) * (ShiftAcived / 100);
      // tond-NOOFDAYS
      // ShiftAcived = AlloweTarget > 0 ? (AllowePoint * 100) / AlloweTarget : AllowePoint;
      nightAllowancefinalcalculation =
        // CHECKSHIFTALLOWANCE === "Enable" &&
        noshiftlogvalfinal > 0 ? ((1000 / tond) * noshiftlogvalfinal * (allowancepointCalcVal > 0 ? (allowancepointCalcVal * 100) / shiftallowancetargetfinal : 0)) / 100 : 0;

      nightAllowanceCalcVal = item.nightshiftallowlog && item.nightshiftallowlog.length > 0 && nightShiftAllowlogLogVal && nightShiftAllowlogLogVal.length > 0 ? Number(nightShiftAllowlogLogVal[nightShiftAllowlogLogVal.length - 1].value) : nightAllowancefinalcalculation;

      finalSalaryCalcVal = Number(finalNetSalaryValcCalc) - Number(totalDeductionValCalc) + Number(nightAllowanceCalcVal) > Number(grossValue) && Number(AcheivedPercentCalcVal) < 100 ? Number(grossValue) : Number(finalNetSalaryValcCalc) - Number(totalDeductionValCalc) + Number(nightAllowanceCalcVal);

      finalSalary_Penalty = finalSalaryCalcVal + penaltyAmtCalculationVal > 0 ? (finalSalaryCalcVal + penaltyAmtCalculationVal + lossDed + OtherDed > grossValue ? finalSalaryCalcVal : finalSalaryCalcVal + penaltyAmtCalculationVal + lossDed + OtherDed) : 0;

      // totalPointsValueCalc = item.department === "PROD_GrubHub" ? (AcheivedPointsCalcVal / 1) * 360 : item.department == "TRAINEE" ? (AcheivedPointsCalcVal / 8.5) * 70 : (AcheivedPointsCalcVal / 8.5) * 60;
      // totalPointsValueCalc =((Number(AcheivedPointsCalcVal) / Dvalue) * Mvalue ) ? (Number(AcheivedPointsCalcVal) / Dvalue) * Mvalue : Number(0).toFixed(2);
      //  acutalERAValCalc = totalasbleaveCalcVal > 2 ? (ERAAmountCalcVal - (ERAAmountCalcVal / totalshiftCalcVal) * totalasbleaveCalcVal).toFixed(2) : Number(ERAAmountCalcVal);

      pfAmount1 = findEmployerPercentage;

      PF_Emper_deduction = pfAmount1 > 0 && totalshiftCalcVal > 0 ? (finalBasicValCalc / totalshiftCalcVal) * pfDaysVal * (pfAmount1 / 100) : 0;

      ESI_EMPR_deduction = grossValue >= findEsiMAXSalary || oldgross >= findEsiMAXSalary ? 0 : pfDaysVal > 0 && totalshiftCalcVal > 0 ? (finalNetSalaryValcCalc / totalshiftCalcVal) * pfDaysVal * ESI_EMPR_Perncetage : 0;

      CTC_Calcval = Number(finalSalaryCalcVal) + Number(ESI_deduction) + Number(PF_deduction) + Number(ESI_EMPR_deduction) + Number(PF_Emper_deduction) + Number(profTaxCalcVal);

      finalValueCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === true ? Number(totalPointsValueCalc) - (Number(acutalERAValCalc) + Number(CTC_Calcval)) + Number(revenueAmountCalc) : 0;

      final_Value_PenaltyCalcval = finalValueCalcVal - (Number(penaltyAmtCalculationVal) + Number(lossDed) + Number(OtherDed));

      final_Value_PenaltyCalcval = final_Value_PenaltyCalcval > 0 ? (finalValueCalcVal >= grossValue ? finalValueCalcVal : final_Value_PenaltyCalcval) : 0;

      let finalValueReviewCalc = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true ? (final_Value_PenaltyCalcval < -acutalERAValCalc ? "REVENUE LOSS" : "OK") : "";

      let finalValueStatus = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true ? (finalValueCalcVal > -10000 ? (finalValueCalcVal >= -2000 ? (finalValueCalcVal >= 0 ? (finalValueCalcVal >= 2000 ? (finalValueCalcVal >= 4000 ? "HIGH" : "OK") : "LOSS OK") : "LOSS") : "VERY LOSS") : "VERY VERY LOSS") : "";

      let revenuePenaltyStatus =
        CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true ? (final_Value_PenaltyCalcval > -10000 ? (final_Value_PenaltyCalcval >= -2000 ? (final_Value_PenaltyCalcval >= 0 ? (final_Value_PenaltyCalcval >= 2000 ? (final_Value_PenaltyCalcval >= 4000 ? "HIGH" : "OK") : "LOSS OK") : "LOSS") : "VERY LOSS") : "VERY VERY LOSS") : "";

      //   FIXED CALCULATION START------------------
      //FIXED
      let Fixed_Loss_Deduction_Calcval = 0;

      let Fixed_NET_Salary = totalshiftCalcVal === 0 || grossValue === 0 ? 0 : (grossValue / totalshiftCalcVal) * totalpaiddaycalVal;
      let Fixed_Basic_CalcVal =
        totalshiftCalcVal === 0
          ? 0
          : (actualBasicCalcVal / totalshiftCalcVal) * totalpaiddaycalVal === 0
            ? 0
            : (actualBasicCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0
              ? (actualBasicCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01
              : 0;

      let Fixed_HRA_CalcVal =
        totalshiftCalcVal === 0
          ? 0
          : (actualHraCalcVal / totalshiftCalcVal) * totalpaiddaycalVal === 0
            ? 0
            : (actualHraCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0
              ? (actualHraCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01
              : 0;

      let Fixed_Conveyance_CalcVal =
        totalshiftCalcVal === 0
          ? 0
          : (actualConveyanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal === 0
            ? 0
            : (actualConveyanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0
              ? (actualConveyanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01
              : 0;

      let Fixed_Med_Allowace =
        totalshiftCalcVal === 0
          ? 0
          : (actualMedicalAllowCalcVal / totalshiftCalcVal) * totalpaiddaycalVal === 0
            ? 0
            : (actualMedicalAllowCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0
              ? (actualMedicalAllowCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01
              : 0;

      let Fixed_PROD_Allowace =
        totalshiftCalcVal === 0
          ? 0
          : (prodAllowanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal === 0
            ? 0
            : (prodAllowanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0
              ? (prodAllowanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01
              : 0;

      let Fixed_OTHER_Allowace =
        totalshiftCalcVal === 0
          ? 0
          : (actualOtherCalVAL / totalshiftCalcVal) * totalpaiddaycalVal === 0
            ? 0
            : (actualOtherCalVAL / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0
              ? (actualOtherCalVAL / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01
              : 0;

      let Fixed_NET_Salary1 = Fixed_Basic_CalcVal + Fixed_HRA_CalcVal + Fixed_Conveyance_CalcVal + Fixed_Med_Allowace + Fixed_PROD_Allowace + Fixed_OTHER_Allowace;

      //PFDAYS AND PFDEDUCTION
      //    let pfdatcal = 0;
      //    let daysp = totalshiftCalcVal - totalasbleaveCalcVal;
      //    let IsExDate = item.isenddate ? item.isenddate : false;
      //Dftdate = pfesifromdate findDate = monthstart fromdate or month fromdate
      //    let pfmode = item.pfesifromdate > findDate ? "S" : IsExDate ? "E" : "ALL";
      //    let PLOP = (findTotalNoOfDays && findTotalNoOfDays.weekoff) + (findTotalNoOfDays && findTotalNoOfDays.clsl);

      //    pfdatcal = pfmode === "S" || pfmode === "E" ? pfdatcal + (findTotalNoOfDays && findTotalNoOfDays.weekoff) + (findTotalNoOfDays && findTotalNoOfDays.clsl) + totalshiftCalcVal : totalshiftCalcVal + PLOP;
      //    let PfDate = daysp >= pfdatcal ? ((IsExDate === true && item.pfesienddate) < findDate ? "0" : Number(pfdatcal) + Number(totalasbleaveCalcVal)) : daysp + totalasbleaveCalcVal;

      //    let pfDaysVal = item.pfdeduction === true ? PfDate : 0;
      //    let pfAmount = item.pfdeduction === true ? Number(findPFpercentage) / 100 : 0;

      let Fixed_PF_deduction = pfDaysVal > 0 && totalshiftCalcVal > 0 ? ((Number(Fixed_Basic_CalcVal) / Number(totalshiftCalcVal)) * Number(pfDaysVal) * Number(pfAmount)).toFixed(2) : 0;

      //    let Esiper = item.esideduction === true ? Number(findESIpercentage) / 100 : 0;

      let Fixed_ESI_deduction = grossValue >= findEsiMAXSalary || oldgross >= findEsiMAXSalary ? 0 : pfDaysVal > 0 && totalshiftCalcVal > 0 ? (Fixed_NET_Salary1 / totalshiftCalcVal) * pfDaysVal * Esiper : 0;

      let FixedfindprofTaxAmt = profTaxMaster.find((d) => d.company === item.company && d.branch === item.branch && Number(d.fromamount) <= Fixed_NET_Salary1 && Number(d.toamount) + 0.99 >= Fixed_NET_Salary1);

      let Fixed_TaxCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.tax === false ? 0 : FixedfindprofTaxAmt ? Number(FixedfindprofTaxAmt.taxamount) : 0;

      let FixedpfAmount1 = findEmployerPercentage > 0 ? findEmployerPercentage / 100 : 0;

      let Fixed_PF_Emper_deduction = FixedpfAmount1 > 0 && totalshiftCalcVal > 0 ? (Fixed_Basic_CalcVal / totalshiftCalcVal) * pfDaysVal * FixedpfAmount1 : 0;
      // // let pfEmployerDeductionCalc = PF_Emper_deduction
      //ESI-DEDCUTION
      //    let ESI_EMPR_Perncetage = item.esideduction === true ? Number(findEmployerESIPercentage) / 100 : 0;

      let Fixed_ESI_EMPR_deduction = grossValue >= findEsiMAXSalary || oldgross >= findEsiMAXSalary ? 0 : pfDaysVal > 0 && totalshiftCalcVal > 0 ? (Fixed_NET_Salary1 / totalshiftCalcVal) * pfDaysVal * ESI_EMPR_Perncetage : 0;

      let Fixed_Shift_Allowance = totalNoOfDaysCalcVal > 0 ? (1000 / tond) * noshiftlogvalfinal : 0;

      let Fixed_Total_Deductions = Number(Fixed_PF_deduction) + Number(Fixed_ESI_deduction) + Number(Fixed_TaxCalcVal) + Number(Fixed_PF_Emper_deduction) + Number(Fixed_ESI_EMPR_deduction);

      let Fixed_Salary = Fixed_NET_Salary1 - (Number(Fixed_PF_deduction) + Number(Fixed_ESI_deduction) + Number(Fixed_TaxCalcVal) + Number(Fixed_PF_Emper_deduction) + Number(Fixed_ESI_EMPR_deduction)) + Number(Fixed_Shift_Allowance);

      let Fixed_Salary_penalty = Fixed_Salary + Number(penaltyAmtCalculationVal) > 0 ? (Fixed_Salary >= grossValue ? Fixed_Salary : Fixed_Salary + (penaltyAmtCalculationVal + Fixed_Loss_Deduction_Calcval + OtherDed)) : 0;

      let Fixed_LOP1 = Fixed_Salary < grossValue ? (Fixed_Salary > 0 && grossValue > 0 ? totalshiftCalcVal - (Fixed_Salary * totalshiftCalcVal) / grossValue : totalshiftCalcVal) : 0;

      let Fixed_Lop_Days = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 || grossValue === 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * Fixed_NET_Salary1) / grossValue < 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * Fixed_NET_Salary1) / grossValue;

      let Fixed_Leave_Dedcution = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 || grossValue === 0 ? 0 : (grossValue / totalshiftCalcVal) * (totalshiftCalcVal - (totalshiftCalcVal * Fixed_NET_Salary1) / grossValue < 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * Fixed_NET_Salary1) / grossValue);

      // let totalPointsValueCalc = item.department === "PROD_GrubHub" ? (AcheivedPointsCalcVal / 1) * 360 : item.department == "TRAINEE" ? (AcheivedPointsCalcVal / 8.5) * 70 : (AcheivedPointsCalcVal / 8.5) * 60;
      //    let Mvalue = (findAcPointVal ? Number(findAcPointVal.dividevalue) : 0)
      //    let Dvalue = (findAcPointVal ? Number(findAcPointVal.multiplevalue) : 0)
      //    let totalPointsValueCalc =AcheivedPointsCalcVal ? (((Number(AcheivedPointsCalcVal) / Dvalue) * Mvalue) ? (Number(AcheivedPointsCalcVal) / Dvalue) * Mvalue : 0) : 0

      //    let acutalERAValCalc = totalasbleaveCalcVal > 2 ? (ERAAmountCalcVal - (ERAAmountCalcVal / totalshiftCalcVal) * totalasbleaveCalcVal).toFixed(2) : Number(ERAAmountCalcVal);

      let Fixed_CTC_Calcval = Fixed_Salary + Number(Fixed_PF_deduction) + Number(Fixed_ESI_deduction) + Number(Fixed_TaxCalcVal) + Number(Fixed_PF_Emper_deduction) + Number(Fixed_ESI_EMPR_deduction);
      let FIXED_Final_Value = Number(totalPointsValueCalc) - (Number(acutalERAValCalc) + Number(Fixed_CTC_Calcval)) + Number(revenueAmountCalc);

      let Fixed_Acutal_Deduction_Calc =
        CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true ? (Number(totalPointsValueCalc) + Number(revenueAmountCalc) - (Number(Fixed_CTC_Calcval) + Number(Shortage1ValCalc)) < 0 ? Number(totalPointsValueCalc) + Number(revenueAmountCalc) - (Number(Fixed_CTC_Calcval) + Number(Shortage1ValCalc)) : 0) : 0;

      let Fixed_Min_Deduction = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true ? (Number(Shortage1ValCalc) + Number(Fixed_Acutal_Deduction_Calc) < 0 ? Number(Shortage1ValCalc) + Number(Fixed_Acutal_Deduction_Calc) : 0) : 0;

      let FLossDeduction = Fixed_Min_Deduction + (Fixed_Acutal_Deduction_Calc - OtherDed - Fixed_Min_Deduction);
      Fixed_Loss_Deduction_Calcval = FLossDeduction > 0 ? FLossDeduction : -1 * FLossDeduction;

      //RE CALCULATION STARTED

      Fixed_NET_Salary = totalshiftCalcVal === 0 ? 0 : (grossValue / totalshiftCalcVal) * totalpaiddaycalVal;
      Fixed_Basic_CalcVal =
        totalshiftCalcVal === 0
          ? 0
          : (actualBasicCalcVal / totalshiftCalcVal) * totalpaiddaycalVal === 0
            ? 0
            : (actualBasicCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0
              ? (actualBasicCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01
              : 0;

      Fixed_HRA_CalcVal =
        totalshiftCalcVal === 0
          ? 0
          : (actualHraCalcVal / totalshiftCalcVal) * totalpaiddaycalVal === 0
            ? 0
            : (actualHraCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0
              ? (actualHraCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01
              : 0;

      Fixed_Conveyance_CalcVal =
        totalshiftCalcVal === 0
          ? 0
          : (actualConveyanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal === 0
            ? 0
            : (actualConveyanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0
              ? (actualConveyanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01
              : 0;

      Fixed_Med_Allowace =
        totalshiftCalcVal === 0
          ? 0
          : (actualMedicalAllowCalcVal / totalshiftCalcVal) * totalpaiddaycalVal === 0
            ? 0
            : (actualMedicalAllowCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0
              ? (actualMedicalAllowCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01
              : 0;

      Fixed_PROD_Allowace =
        totalshiftCalcVal === 0
          ? 0
          : (prodAllowanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal === 0
            ? 0
            : (prodAllowanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0
              ? (prodAllowanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01
              : 0;

      Fixed_OTHER_Allowace =
        totalshiftCalcVal === 0
          ? 0
          : (actualOtherCalVAL / totalshiftCalcVal) * totalpaiddaycalVal === 0
            ? 0
            : (actualOtherCalVAL / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0
              ? (actualOtherCalVAL / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01
              : 0;

      Fixed_NET_Salary1 = Fixed_Basic_CalcVal + Fixed_HRA_CalcVal + Fixed_Conveyance_CalcVal + Fixed_Med_Allowace + Fixed_PROD_Allowace + Fixed_OTHER_Allowace;

      //PFDAYS AND PFDEDUCTION

      //   PfDate = daysp >= pfdatcal ? ((IsExDate == true && item.pfesienddate) < findDate ? "0" : Number(pfdatcal) + Number(totalasbleaveCalcVal)) : daysp + totalasbleaveCalcVal;

      Fixed_PF_deduction = pfDaysVal > 0 ? ((Number(Fixed_Basic_CalcVal) / Number(totalshiftCalcVal)) * Number(pfDaysVal) * Number(pfAmount)).toFixed(2) : 0;

      Fixed_ESI_deduction = grossValue >= findEsiMAXSalary || oldgross >= findEsiMAXSalary ? 0 : pfDaysVal > 0 ? (Fixed_NET_Salary1 / totalshiftCalcVal) * pfDaysVal * Esiper : 0;

      findprofTaxAmt = profTaxMaster.find((d) => d.company == item.company && d.branch === item.branch && Number(d.fromamount) <= Fixed_NET_Salary1 && Number(d.toamount) + 0.99 >= Fixed_NET_Salary1);

      Fixed_TaxCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.tax === false ? 0 : findprofTaxAmt ? Number(findprofTaxAmt.taxamount) : 0;

      Fixed_PF_Emper_deduction = FixedpfAmount1 > 0 && totalshiftCalcVal > 0 ? (Fixed_Basic_CalcVal / totalshiftCalcVal) * pfDaysVal * FixedpfAmount1 : 0;

      Fixed_ESI_EMPR_deduction = grossValue >= findEsiMAXSalary || oldgross >= findEsiMAXSalary ? 0 : pfDaysVal > 0 ? (Fixed_NET_Salary1 / totalshiftCalcVal) * pfDaysVal * ESI_EMPR_Perncetage : 0;

      Fixed_Total_Deductions = Number(Fixed_PF_deduction) + Number(Fixed_ESI_deduction) + Number(Fixed_TaxCalcVal) + Number(Fixed_PF_Emper_deduction) + Number(Fixed_ESI_EMPR_deduction);

      Fixed_Salary = Fixed_NET_Salary1 - (Number(Fixed_PF_deduction) + Number(Fixed_ESI_deduction) + Number(Fixed_TaxCalcVal) + Number(Fixed_PF_Emper_deduction) + Number(Fixed_ESI_EMPR_deduction)) + Number(Fixed_Shift_Allowance);

      Fixed_Salary_penalty = Fixed_Salary + Number(penaltyAmtCalculationVal) > 0 ? (Fixed_Salary >= grossValue ? Fixed_Salary : Fixed_Salary + (penaltyAmtCalculationVal + Fixed_Loss_Deduction_Calcval + OtherDed)) : 0;

      Fixed_LOP1 = Fixed_Salary < grossValue ? (Fixed_Salary > 0 ? totalshiftCalcVal - (Fixed_Salary * totalshiftCalcVal) / grossValue : totalshiftCalcVal) : 0;

      Fixed_Lop_Days = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 || grossValue === 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * Fixed_NET_Salary1) / grossValue < 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * Fixed_NET_Salary1) / grossValue;

      Fixed_Leave_Dedcution = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 || grossValue === 0 ? 0 : (grossValue / totalshiftCalcVal) * (totalshiftCalcVal - (totalshiftCalcVal * Fixed_NET_Salary1) / grossValue < 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * Fixed_NET_Salary1) / grossValue);

      // totalPointsValueCalc = item.department === "PROD_GrubHub" ? (AcheivedPointsCalcVal / 1) * 360 : item.department == "TRAINEE" ? (AcheivedPointsCalcVal / 8.5) * 70 : (AcheivedPointsCalcVal / 8.5) * 60;
      // let Mvalue = (findAcPointVal ? Number(findAcPointVal.dividevalue) : 0);
      // let Dvalue = (findAcPointVal ? Number(findAcPointVal.multiplevalue) : 0);
      totalPointsValueCalc = AcheivedPointsCalcVal ? ((Number(AcheivedPointsCalcVal) / Dvalue) * Mvalue ? (Number(AcheivedPointsCalcVal) / Dvalue) * Mvalue : 0) : 0;

      acutalERAValCalc = totalasbleaveCalcVal > 2 ? (ERAAmountCalcVal - (ERAAmountCalcVal / totalshiftCalcVal) * totalasbleaveCalcVal).toFixed(2) : Number(ERAAmountCalcVal);

      Fixed_CTC_Calcval = Fixed_Salary + Number(Fixed_PF_deduction) + Number(Fixed_ESI_deduction) + Number(Fixed_TaxCalcVal) + Number(Fixed_PF_Emper_deduction) + Number(Fixed_ESI_EMPR_deduction);
      FIXED_Final_Value = Number(totalPointsValueCalc) - (Number(acutalERAValCalc) + Number(Fixed_CTC_Calcval)) + Number(revenueAmountCalc);

      let PROD_Loss_Deduction = 0;

      let PROD_NET_Salary = Number(AcheivedPercentCalcVal) > 0 && grossValue > 0 ? grossValue * (Number(AcheivedPercentCalcVal) / 100) : 0;
      let PROD_BASIC_ValCalc =
        (actualBasicCalcVal * AcheivedPercentCalcVal) / 100 === 0
          ? 0
          : ((actualBasicCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
            ? ((actualBasicCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
            : 0;

      let PROD_HRA_ValCalc =
        (actualHraCalcVal * AcheivedPercentCalcVal) / 100 === 0
          ? 0
          : ((actualHraCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
            ? ((actualHraCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
            : 0;

      let PROD_CONVEYANCE_ValCalc =
        (actualConveyanceCalcVal * AcheivedPercentCalcVal) / 100 === 0
          ? 0
          : ((actualConveyanceCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
            ? ((actualConveyanceCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
            : 0;
      let PROD_MEDICALALLOW_ValCalc =
        (actualMedicalAllowCalcVal * AcheivedPercentCalcVal) / 100 === 0
          ? 0
          : ((actualMedicalAllowCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
            ? ((actualMedicalAllowCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
            : 0;
      let PROD_PRODUCTION_ValCalc =
        (prodAllowanceCalcVal * AcheivedPercentCalcVal) / 100 === 0
          ? 0
          : ((prodAllowanceCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
            ? ((prodAllowanceCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
            : 0;
      let PROD_OTHER_ValCalc =
        (actualOtherCalVAL * AcheivedPercentCalcVal) / 100 === 0
          ? 0
          : ((actualOtherCalVAL * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
            ? ((actualOtherCalVAL * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
            : 0;

      let PROD_NET_Salary1 = PROD_BASIC_ValCalc + PROD_HRA_ValCalc + PROD_CONVEYANCE_ValCalc + PROD_MEDICALALLOW_ValCalc + PROD_PRODUCTION_ValCalc + PROD_OTHER_ValCalc;

      //PFDAYS AND PFDEDUCTION

      let PROD_PF_deduction = pfDaysVal > 0 ? ((Number(PROD_BASIC_ValCalc) / Number(totalshiftCalcVal)) * Number(pfDaysVal) * Number(pfAmount)).toFixed(2) : 0;

      // let Esiper = item.esideduction === true ? Number(findESIpercentage) / 100 : 0;

      let PROD_ESI_deduction = grossValue >= findEsiMAXSalary || oldgross >= findEsiMAXSalary ? 0 : pfDaysVal > 0 ? (PROD_NET_Salary1 / totalshiftCalcVal) * pfDaysVal * Esiper : 0;

      let PRODfindprofTaxAmt = profTaxMaster.find((d) => d.company === item.company && d.branch === item.branch && Number(d.fromamount) <= PROD_NET_Salary1 && Number(d.toamount) + 0.99 >= PROD_NET_Salary1);

      let PROD_TaxCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.tax === false ? 0 : PRODfindprofTaxAmt ? Number(PRODfindprofTaxAmt.taxamount) : 0;

      let PRODpfAmount1 = findEmployerPercentage > 0 ? findEmployerPercentage / 100 : 0;

      let PROD_PF_Emper_deduction = PRODpfAmount1 > 0 && totalshiftCalcVal > 0 ? (PROD_BASIC_ValCalc / totalshiftCalcVal) * pfDaysVal * PRODpfAmount1 : 0;
      // // let pfEmployerDeductionCalc = PF_Emper_deduction
      //ESI-DEDCUTION
      // let ESI_EMPR_Perncetage = item.esideduction === true ? Number(findEmployerESIPercentage) / 100 : 0;

      let PROD_ESI_EMPR_deduction = grossValue >= findEsiMAXSalary || oldgross >= findEsiMAXSalary ? 0 : pfDaysVal > 0 && totalshiftCalcVal > 0 ? (PROD_NET_Salary1 / totalshiftCalcVal) * pfDaysVal * ESI_EMPR_Perncetage : 0;

      let PROD_Total_deductions = Number(PROD_PF_deduction) + Number(PROD_ESI_deduction) + Number(PROD_TaxCalcVal) + Number(PROD_PF_Emper_deduction) + Number(PROD_ESI_EMPR_deduction);

      let PROD_Shift_Allowance = totalNoOfDaysCalcVal > 0 && shiftallowancetargetfinal > 0 ? ((1000 / tond) * noshiftlogvalfinal * (allowancepointCalcVal > 0 ? (allowancepointCalcVal * 100) / shiftallowancetargetfinal : 0)) / 100 : 0;

      let PROD_SALARY_Calcval = PROD_NET_Salary1 - PROD_Total_deductions + PROD_Shift_Allowance;

      let PROD_SALARY_PENALTY_Calcval = PROD_SALARY_Calcval + penaltyAmtCalculationVal > 0 ? (PROD_SALARY_Calcval >= grossValue ? PROD_SALARY_Calcval : PROD_SALARY_Calcval + penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed) : 0;

      let PROD_LOP_days = PROD_SALARY_Calcval < grossValue ? (PROD_SALARY_Calcval > 0 && grossValue > 0 ? Math.round(totalshiftCalcVal - (PROD_SALARY_Calcval * totalshiftCalcVal) / grossValue) : totalshiftCalcVal) : 0;

      let PROD_LOP_calcval = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 || grossValue === 0 ? 0 : Math.round(totalshiftCalcVal - (totalshiftCalcVal * PROD_NET_Salary1) / grossValue) < 0 ? 0 : Math.round(totalshiftCalcVal - (totalshiftCalcVal * PROD_NET_Salary1) / grossValue);

      // let totalPointsValueCalc =  ( CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === true &&  AcheivedPointsCalcVal) ? ((Number(AcheivedPointsCalcVal) / Dvalue) * Mvalue ? (Number(AcheivedPointsCalcVal) / Dvalue) * Mvalue : 0 ) : 0 ;

      //  item.department === "PROD_GrubHub" ? (AcheivedPointsCalcVal / 1) * 360 : item.department === "TRAINEE" ? (AcheivedPointsCalcVal / 8.5) * 70 : (AcheivedPointsCalcVal / 8.5) * 60;

      let PROD_Leave_Deduction = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 || grossValue === 0 ? 0 : (grossValue / totalshiftCalcVal) * (totalshiftCalcVal - (totalshiftCalcVal * PROD_NET_Salary1) / grossValue < 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * PROD_NET_Salary1) / grossValue);

      let PROD_CTC_Valcalc = PROD_SALARY_Calcval + Number(PROD_PF_deduction) + Number(PROD_ESI_deduction) + Number(PROD_TaxCalcVal) + Number(PROD_PF_Emper_deduction) + Number(PROD_ESI_EMPR_deduction);

      let PROD_Final_Value_Calc = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === false ? 0 : Number(totalPointsValueCalc) - (Number(acutalERAValCalc) + Number(PROD_CTC_Valcalc)) + Number(revenueAmountCalc);

      let PROD_Actual_Deduction_Val = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true ? (totalPointsValueCalc + revenueAmountCalc - (PROD_CTC_Valcalc + Shortage1ValCalc) < 0 ? totalPointsValueCalc + revenueAmountCalc - (PROD_CTC_Valcalc + Shortage1ValCalc) : 0) : 0;

      let PROD_Minimum_Deduction_Val = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true ? (Number(Shortage1ValCalc) + PROD_Actual_Deduction_Val < 0 ? Number(Shortage1ValCalc) + PROD_Actual_Deduction_Val : 0) : 0;

      PROD_Loss_Deduction = 0;

      let PLossDeduction = PROD_Minimum_Deduction_Val + (PROD_Actual_Deduction_Val - OtherDed - PROD_Minimum_Deduction_Val);

      PROD_Loss_Deduction = PLossDeduction > 0 ? PLossDeduction : -1 * PLossDeduction;

      //RE-CALULCATION

      PROD_BASIC_ValCalc =
        (actualBasicCalcVal * AcheivedPercentCalcVal) / 100 === 0
          ? 0
          : ((actualBasicCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
            ? ((actualBasicCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
            : 0;

      PROD_HRA_ValCalc =
        (actualHraCalcVal * AcheivedPercentCalcVal) / 100 === 0
          ? 0
          : ((actualHraCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
            ? ((actualHraCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
            : 0;

      PROD_CONVEYANCE_ValCalc =
        (actualConveyanceCalcVal * AcheivedPercentCalcVal) / 100 === 0
          ? 0
          : ((actualConveyanceCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
            ? ((actualConveyanceCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
            : 0;
      PROD_MEDICALALLOW_ValCalc =
        (actualMedicalAllowCalcVal * AcheivedPercentCalcVal) / 100 === 0
          ? 0
          : ((actualMedicalAllowCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
            ? ((actualMedicalAllowCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
            : 0;
      PROD_PRODUCTION_ValCalc =
        (prodAllowanceCalcVal * AcheivedPercentCalcVal) / 100 === 0
          ? 0
          : ((prodAllowanceCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
            ? ((prodAllowanceCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
            : 0;
      PROD_OTHER_ValCalc =
        (actualOtherCalVAL * AcheivedPercentCalcVal) / 100 === 0
          ? 0
          : ((actualOtherCalVAL * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
            ? ((actualOtherCalVAL * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
            : 0;

      PROD_NET_Salary1 = PROD_BASIC_ValCalc + PROD_HRA_ValCalc + PROD_CONVEYANCE_ValCalc + PROD_MEDICALALLOW_ValCalc + PROD_PRODUCTION_ValCalc + PROD_OTHER_ValCalc;

      PROD_PF_deduction = pfDaysVal > 0 ? ((Number(PROD_BASIC_ValCalc) / Number(totalshiftCalcVal)) * Number(pfDaysVal) * Number(pfAmount)).toFixed(2) : 0;

      PROD_ESI_deduction = grossValue >= findEsiMAXSalary || oldgross >= findEsiMAXSalary ? 0 : pfDaysVal > 0 ? (PROD_NET_Salary1 / totalshiftCalcVal) * pfDaysVal * Esiper : 0;

      PRODfindprofTaxAmt = profTaxMaster.find((d) => d.company === item.company && d.branch === item.branch && Number(d.fromamount) <= PROD_NET_Salary1 && Number(d.toamount) + 0.99 >= PROD_NET_Salary1);

      PROD_TaxCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.tax === false ? 0 : PRODfindprofTaxAmt ? Number(PRODfindprofTaxAmt.taxamount) : 0;

      PROD_PF_Emper_deduction = PRODpfAmount1 > 0 && totalshiftCalcVal > 0 ? (PROD_BASIC_ValCalc / totalshiftCalcVal) * pfDaysVal * PRODpfAmount1 : 0;

      PROD_ESI_EMPR_deduction = grossValue >= findEsiMAXSalary || oldgross >= findEsiMAXSalary ? 0 : pfDaysVal > 0 ? (PROD_NET_Salary1 / totalshiftCalcVal) * pfDaysVal * ESI_EMPR_Perncetage : 0;

      PROD_Total_deductions = Number(PROD_PF_deduction) + Number(PROD_ESI_deduction) + Number(PROD_TaxCalcVal) + Number(PROD_PF_Emper_deduction) + Number(PROD_ESI_EMPR_deduction);

      PROD_Shift_Allowance = totalNoOfDaysCalcVal > 0 && shiftallowancetargetfinal > 0 ? ((1000 / tond) * noshiftlogvalfinal * (allowancepointCalcVal > 0 ? (allowancepointCalcVal * 100) / shiftallowancetargetfinal : 0)) / 100 : 0;

      PROD_SALARY_Calcval = PROD_NET_Salary1 - PROD_Total_deductions + PROD_Shift_Allowance;

      PROD_SALARY_PENALTY_Calcval = PROD_SALARY_Calcval + penaltyAmtCalculationVal > 0 ? (PROD_SALARY_Calcval >= grossValue ? PROD_SALARY_Calcval : PROD_SALARY_Calcval + penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed) : 0;

      PROD_LOP_days = PROD_SALARY_Calcval < grossValue ? (PROD_SALARY_Calcval > 0 && grossValue > 0 ? Math.round(totalshiftCalcVal - (PROD_SALARY_Calcval * totalshiftCalcVal) / grossValue) : totalshiftCalcVal) : 0;

      PROD_LOP_calcval = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 || grossValue === 0 ? 0 : Math.round(totalshiftCalcVal - (totalshiftCalcVal * PROD_NET_Salary1) / grossValue) < 0 ? 0 : Math.round(totalshiftCalcVal - (totalshiftCalcVal * PROD_NET_Salary1) / grossValue);

      // totalPointsValueCalc = AcheivedPointsCalcVal ? ((Number(AcheivedPointsCalcVal) / Dvalue) * Mvalue ? (Number(AcheivedPointsCalcVal) / Dvalue) * Mvalue : 0 ) : 0
      //  item.department === "PROD_GrubHub" ? (AcheivedPointsCalcVal / 1) * 360 : item.department === "TRAINEE" ? (AcheivedPointsCalcVal / 8.5) * 70 : (AcheivedPointsCalcVal / 8.5) * 60;

      PROD_Leave_Deduction = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 || grossValue === 0 ? 0 : (grossValue / totalshiftCalcVal) * (totalshiftCalcVal - (totalshiftCalcVal * PROD_NET_Salary1) / grossValue < 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * PROD_NET_Salary1) / grossValue);

      PROD_CTC_Valcalc = PROD_SALARY_Calcval + Number(PROD_PF_deduction) + Number(PROD_ESI_deduction) + Number(PROD_TaxCalcVal) + Number(PROD_PF_Emper_deduction) + Number(PROD_ESI_EMPR_deduction);

      PROD_Final_Value_Calc = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === false ? 0 : Number(totalPointsValueCalc) - (Number(acutalERAValCalc) + Number(PROD_CTC_Valcalc)) + Number(revenueAmountCalc);

      ////daystatus---------------------------------------------------------------------------------------------------------
      let currentMonthAttendanceVal = findTotalNoOfDaysNxtMonth ? Number(findTotalNoOfDaysNxtMonth.lopcount) : 0;
      let currentMonthAvgVal = findPointsDetailsNxtMonth ? Number(findPointsDetailsNxtMonth.avgpoint).toFixed(2) : 0;

      let currMonAvgFinalcalVal = item.currmonthavglog && item.currmonthavglog.length > 0 && currMonAvgLogVal && currMonAvgLogVal.length > 0 ? Number(currMonAvgLogVal[currMonAvgLogVal.length - 1].value) : currentMonthAvgVal;

      let currMonAttFinalcalVal = item.currmonthattlog && item.currmonthattlog.length > 0 && currMonAttLogVal && currMonAttLogVal.length > 0 ? Number(currMonAttLogVal[currMonAttLogVal.length - 1].value) : currentMonthAttendanceVal;

      const ctodate = new Date(findmonthenddate).toISOString();
      const CLOP = Number(currMonAttFinalcalVal); // Current Leave or Points
      const CTotalPointsAverage = Number(currMonAvgFinalcalVal);

      let getpaidStatusVal = "";
      paidStatusFix
        .filter((data) => {
          const isMonthAndDepartmentMatched = data.month.toLowerCase() === selectmonth.toLowerCase() && data.department.includes(item.department) && data.year == selectyear;

          const isReasonStatusValid = item.reasondate >= findDate && (item.resonablestatus === "Absconded" || item.resonablestatus === "Terminate") ? data.frequency === "REJECT" : item.reasondate >= findDate && item.resonablestatus === "Releave Employee" ? data.frequency === "HOLD" : true;

          const isValueAndPointValid = Number(data.fromvalue) <= Number(totalasbleaveCalcVal) && Number(data.tovalue) >= Number(totalasbleaveCalcVal) && Number(data.frompoint) <= Number(AcheivedPercentCalcVal) && Number(data.topoint) >= Number(AcheivedPercentCalcVal);

          return isMonthAndDepartmentMatched && isReasonStatusValid && isValueAndPointValid;
        })
        .sort((a, b) => {
          if (a.currentabsentvalue !== b.currentabsentvalue) {
            return b.currentabsentvalue - a.currentabsentvalue; // Sort descending
          }
          return b.currentachievedvalue - a.currentachievedvalue; // Sort descending
        })
        .forEach((row) => {
          let F1 = false,
            F2 = false,
            F3 = false,
            F4 = false;

          // Check AbsentMode
          const totalLeave = totalasbleaveCalcVal;
          const absentValue = parseFloat(row.fromvalue);

          switch (row.absentmodes) {
            case "Less than or Equal":
              F1 = totalLeave <= absentValue;
              break;
            case "Less than":
              F1 = totalLeave < absentValue;
              break;
            case "Greater than":
              F1 = totalLeave > absentValue;
              break;
            case "Greater than or Equal":
              F1 = totalLeave >= absentValue;
              break;
            case "Between":
              F1 = totalLeave >= absentValue && totalLeave <= parseFloat(row.tovalue);
              break;
            default:
              F1 = false;
          }

          // Check AchievedMode
          const achievedPerc = AcheivedPercentCalcVal;
          const achievedValue = parseFloat(row.frompoint);

          switch (row.achievedmodes) {
            case "Less than or Equal":
              F2 = achievedPerc <= achievedValue;
              break;
            case "Less than":
              F2 = achievedPerc < achievedValue;
              break;
            case "Greater than":
              F2 = achievedPerc > achievedValue;
              break;
            case "Greater than or Equal":
              F2 = achievedPerc >= achievedValue;
              break;
            case "Between":
              F2 = achievedPerc >= achievedValue && achievedPerc <= parseFloat(row.topoint);
              break;
            default:
              F2 = false;
          }

          // Date comparison
          const now = new Date();
          const fiveDaysAgo = new Date(now);
          fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

          if (new Date(ctodate) > fiveDaysAgo) {
            F3 = true;
            F4 = true;
          } else {
            // Current Absent Mode
            const currentAbsentValue = parseFloat(row.currentabsentvalue);
            switch (row.currentabsentmodes) {
              case "Less than or Equal":
                F3 = CLOP <= currentAbsentValue;
                break;
              case "Less than":
                F3 = CLOP < currentAbsentValue;
                break;
              case "Greater than":
                F3 = CLOP > currentAbsentValue;
                break;
              case "Greater than or Equal":
                F3 = CLOP >= currentAbsentValue;
                break;

              default:
                F3 = false;
            }

            // Current Achieved Mode
            const currentAchievedValue = parseFloat(row.currentachievedvalue);
            switch (row.currentachievedmodes) {
              case "Less than or Equal":
                F4 = CTotalPointsAverage <= currentAchievedValue;
                break;
              case "Less than":
                F4 = CTotalPointsAverage < currentAchievedValue;
                break;
              case "Greater than":
                F4 = CTotalPointsAverage > currentAchievedValue;
                break;
              case "Greater than or Equal":
                F4 = CTotalPointsAverage >= currentAchievedValue;
                break;
              default:
                F4 = false;
            }
          }

          // Final check
          if (F1 && F2 && F3 && F4) {
            getpaidStatusVal = row.paidstatus;

            // if (row.Frequency === 'HOLD' || row.Frequency === 'REJECT') {
            //   empObj.HoldPersentage = 0;
            //   empObj.ApReason = 'Reject Auto Hold Full';
            // } else {
            //   empObj.HoldPersentage = 0;
            //   empObj.ApReason = '';
            // }
          }
        });

      // Set paidStatusVal if a matching row is found
      let paidStatusVal = getpaidStatusVal === "" ? "No Status" : getpaidStatusVal;

      let getPayTypes = payruncontrolmaster.find((d) => {
        return d.filtertype === "Individual" && d.empname.includes(item.companyname)
          ? d.choosetype === false && d.choosestatus === "Both"
            ? (d.achievedsymbol === "Between"
              ? Number(AcheivedPercentCalcVal) >= Number(d.achievedfrom) && Number(AcheivedPercentCalcVal) <= Number(d.achievedto)
              : d.achievedsymbol === "Less than or equal"
                ? Number(AcheivedPercentCalcVal) <= Number(d.achieved)
                : d.achievedsymbol === "Less than"
                  ? Number(AcheivedPercentCalcVal) < Number(d.achieved)
                  : d.achievedsymbol === "Greater than"
                    ? Number(AcheivedPercentCalcVal) > Number(d.achieved)
                    : Number(AcheivedPercentCalcVal) >= Number(d.achieved)) &&
            (d.newgrosssymbol === "Between"
              ? Number(grossValue) >= Number(d.newgrossfrom) && Number(grossValue) <= Number(d.newgrossto)
              : d.newgrosssymbol === "Less than or equal"
                ? Number(grossValue) <= Number(d.newgross)
                : d.newgrosssymbol === "Less than"
                  ? Number(grossValue) < Number(d.newgross)
                  : d.newgrosssymbol === "Greater than"
                    ? Number(grossValue) > Number(d.newgross)
                    : Number(grossValue) >= Number(d.newgross))
            : d.choosetype === false && d.choosestatus === "Production"
              ? d.achievedsymbol === "Between"
                ? Number(AcheivedPercentCalcVal) >= Number(d.achievedfrom) && Number(AcheivedPercentCalcVal) <= Number(d.achievedto)
                : d.achievedsymbol === "Less than or equal"
                  ? Number(AcheivedPercentCalcVal) <= Number(d.achieved)
                  : d.achievedsymbol === "Less than"
                    ? Number(AcheivedPercentCalcVal) < Number(d.achieved)
                    : d.achievedsymbol === "Greater than"
                      ? Number(AcheivedPercentCalcVal) > Number(d.achieved)
                      : Number(AcheivedPercentCalcVal) >= Number(d.achieved)
              : d.choosetype === false && d.choosestatus === "New Gross"
                ? d.newgrosssymbol === "Between"
                  ? Number(grossValue) >= Number(d.newgrossfrom) && Number(grossValue) <= Number(d.newgrossto)
                  : d.newgrosssymbol === "Less than or equal"
                    ? Number(grossValue) <= Number(d.newgross)
                    : d.newgrosssymbol === "Less than"
                      ? Number(grossValue) < Number(d.newgross)
                      : d.newgrosssymbol === "Greater than"
                        ? Number(grossValue) > Number(d.newgross)
                        : Number(grossValue) >= Number(d.newgross)
                : d.choosetype === true
          : d.filtertype === "Team" && d.branch.includes(item.branch) && d.unit.includes(item.unit) && d.team.includes(item.team)
            ? d.choosetype === false && d.choosestatus === "Both"
              ? (d.achievedsymbol === "Between"
                ? Number(AcheivedPercentCalcVal) >= Number(d.achievedfrom) && Number(AcheivedPercentCalcVal) <= Number(d.achievedto)
                : d.achievedsymbol === "Less than or equal"
                  ? Number(AcheivedPercentCalcVal) <= Number(d.achieved)
                  : d.achievedsymbol === "Less than"
                    ? Number(AcheivedPercentCalcVal) < Number(d.achieved)
                    : d.achievedsymbol === "Greater than"
                      ? Number(AcheivedPercentCalcVal) > Number(d.achieved)
                      : Number(AcheivedPercentCalcVal) >= Number(d.achieved)) &&
              (d.newgrosssymbol === "Between"
                ? Number(grossValue) >= Number(d.newgrossfrom) && Number(grossValue) <= Number(d.newgrossto)
                : d.newgrosssymbol === "Less than or equal"
                  ? Number(grossValue) <= Number(d.newgross)
                  : d.newgrosssymbol === "Less than"
                    ? Number(grossValue) < Number(d.newgross)
                    : d.newgrosssymbol === "Greater than"
                      ? Number(grossValue) > Number(d.newgross)
                      : Number(grossValue) >= Number(d.newgross))
              : d.choosetype === false && d.choosestatus === "Production"
                ? d.achievedsymbol === "Between"
                  ? Number(AcheivedPercentCalcVal) >= Number(d.achievedfrom) && Number(AcheivedPercentCalcVal) <= Number(d.achievedto)
                  : d.achievedsymbol === "Less than or equal"
                    ? Number(AcheivedPercentCalcVal) <= Number(d.achieved)
                    : d.achievedsymbol === "Less than"
                      ? Number(AcheivedPercentCalcVal) < Number(d.achieved)
                      : d.achievedsymbol === "Greater than"
                        ? Number(AcheivedPercentCalcVal) > Number(d.achieved)
                        : Number(AcheivedPercentCalcVal) >= Number(d.achieved)
                : d.choosetype === false && d.choosestatus === "New Gross"
                  ? d.newgrosssymbol === "Between"
                    ? Number(grossValue) >= Number(d.newgrossfrom) && Number(grossValue) <= Number(d.newgrossto)
                    : d.newgrosssymbol === "Less than or equal"
                      ? Number(grossValue) <= Number(d.newgross)
                      : d.newgrosssymbol === "Less than"
                        ? Number(grossValue) < Number(d.newgross)
                        : d.newgrosssymbol === "Greater than"
                          ? Number(grossValue) > Number(d.newgross)
                          : Number(grossValue) >= Number(d.newgross)
                  : true
            : d.filtertype === "Unit" && d.branch.includes(item.branch) && d.unit.includes(item.unit)
              ? d.choosetype === false && d.choosestatus === "Both"
                ? (d.achievedsymbol === "Between"
                  ? Number(AcheivedPercentCalcVal) >= Number(d.achievedfrom) && Number(AcheivedPercentCalcVal) <= Number(d.achievedto)
                  : d.achievedsymbol === "Less than or equal"
                    ? Number(AcheivedPercentCalcVal) <= Number(d.achieved)
                    : d.achievedsymbol === "Less than"
                      ? Number(AcheivedPercentCalcVal) < Number(d.achieved)
                      : d.achievedsymbol === "Greater than"
                        ? Number(AcheivedPercentCalcVal) > Number(d.achieved)
                        : Number(AcheivedPercentCalcVal) >= Number(d.achieved)) &&
                (d.newgrosssymbol === "Between"
                  ? Number(grossValue) >= Number(d.newgrossfrom) && Number(grossValue) <= Number(d.newgrossto)
                  : d.newgrosssymbol === "Less than or equal"
                    ? Number(grossValue) <= Number(d.newgross)
                    : d.newgrosssymbol === "Less than"
                      ? Number(grossValue) < Number(d.newgross)
                      : d.newgrosssymbol === "Greater than"
                        ? Number(grossValue) > Number(d.newgross)
                        : Number(grossValue) >= Number(d.newgross))
                : d.choosetype === false && d.choosestatus === "Production"
                  ? d.achievedsymbol === "Between"
                    ? Number(AcheivedPercentCalcVal) >= Number(d.achievedfrom) && Number(AcheivedPercentCalcVal) <= Number(d.achievedto)
                    : d.achievedsymbol === "Less than or equal"
                      ? Number(AcheivedPercentCalcVal) <= Number(d.achieved)
                      : d.achievedsymbol === "Less than"
                        ? Number(AcheivedPercentCalcVal) < Number(d.achieved)
                        : d.achievedsymbol === "Greater than"
                          ? Number(AcheivedPercentCalcVal) > Number(d.achieved)
                          : Number(AcheivedPercentCalcVal) >= Number(d.achieved)
                  : d.choosetype === false && d.choosestatus === "New Gross"
                    ? d.newgrosssymbol === "Between"
                      ? Number(grossValue) >= Number(d.newgrossfrom) && Number(grossValue) <= Number(d.newgrossto)
                      : d.newgrosssymbol === "Less than or equal"
                        ? Number(grossValue) <= Number(d.newgross)
                        : d.newgrosssymbol === "Less than"
                          ? Number(grossValue) < Number(d.newgross)
                          : d.newgrosssymbol === "Greater than"
                            ? Number(grossValue) > Number(d.newgross)
                            : Number(grossValue) >= Number(d.newgross)
                    : true
              : d.filtertype === "Branch" && d.branch.includes(item.branch)
                ? d.choosetype === false && d.choosestatus === "Both"
                  ? (d.achievedsymbol === "Between"
                    ? Number(AcheivedPercentCalcVal) >= Number(d.achievedfrom) && Number(AcheivedPercentCalcVal) <= Number(d.achievedto)
                    : d.achievedsymbol === "Less than or equal"
                      ? Number(AcheivedPercentCalcVal) <= Number(d.achieved)
                      : d.achievedsymbol === "Less than"
                        ? Number(AcheivedPercentCalcVal) < Number(d.achieved)
                        : d.achievedsymbol === "Greater than"
                          ? Number(AcheivedPercentCalcVal) > Number(d.achieved)
                          : Number(AcheivedPercentCalcVal) >= Number(d.achieved)) &&
                  (d.newgrosssymbol === "Between"
                    ? Number(grossValue) >= Number(d.newgrossfrom) && Number(grossValue) <= Number(d.newgrossto)
                    : d.newgrosssymbol === "Less than or equal"
                      ? Number(grossValue) <= Number(d.newgross)
                      : d.newgrosssymbol === "Less than"
                        ? Number(grossValue) < Number(d.newgross)
                        : d.newgrosssymbol === "Greater than"
                          ? Number(grossValue) > Number(d.newgross)
                          : Number(grossValue) >= Number(d.newgross))
                  : d.choosetype === false && d.choosestatus === "Production"
                    ? d.achievedsymbol === "Between"
                      ? Number(AcheivedPercentCalcVal) >= Number(d.achievedfrom) && Number(AcheivedPercentCalcVal) <= Number(d.achievedto)
                      : d.achievedsymbol === "Less than or equal"
                        ? Number(AcheivedPercentCalcVal) <= Number(d.achieved)
                        : d.achievedsymbol === "Less than"
                          ? Number(AcheivedPercentCalcVal) < Number(d.achieved)
                          : d.achievedsymbol === "Greater than"
                            ? Number(AcheivedPercentCalcVal) > Number(d.achieved)
                            : Number(AcheivedPercentCalcVal) >= Number(d.achieved)
                    : d.choosetype === false && d.choosestatus === "New Gross"
                      ? d.newgrosssymbol === "Between"
                        ? Number(grossValue) >= Number(d.newgrossfrom) && Number(grossValue) <= Number(d.newgrossto)
                        : d.newgrosssymbol === "Less than or equal"
                          ? Number(grossValue) <= Number(d.newgross)
                          : d.newgrosssymbol === "Less than"
                            ? Number(grossValue) < Number(d.newgross)
                            : d.newgrosssymbol === "Greater than"
                              ? Number(grossValue) > Number(d.newgross)
                              : Number(grossValue) >= Number(d.newgross)
                      : true
                : d.filtertype === "Department" && d.department.includes(item.department)
                  ? d.choosetype === false && d.choosestatus === "Both"
                    ? (d.achievedsymbol === "Between"
                      ? Number(AcheivedPercentCalcVal) >= Number(d.achievedfrom) && Number(AcheivedPercentCalcVal) <= Number(d.achievedto)
                      : d.achievedsymbol === "Less than or equal"
                        ? Number(AcheivedPercentCalcVal) <= Number(d.achieved)
                        : d.achievedsymbol === "Less than"
                          ? Number(AcheivedPercentCalcVal) < Number(d.achieved)
                          : d.achievedsymbol === "Greater than"
                            ? Number(AcheivedPercentCalcVal) > Number(d.achieved)
                            : Number(AcheivedPercentCalcVal) >= Number(d.achieved)) &&
                    (d.newgrosssymbol === "Between"
                      ? Number(grossValue) >= Number(d.newgrossfrom) && Number(grossValue) <= Number(d.newgrossto)
                      : d.newgrosssymbol === "Less than or equal"
                        ? Number(grossValue) <= Number(d.newgross)
                        : d.newgrosssymbol === "Less than"
                          ? Number(grossValue) < Number(d.newgross)
                          : d.newgrosssymbol === "Greater than"
                            ? Number(grossValue) > Number(d.newgross)
                            : Number(grossValue) >= Number(d.newgross))
                    : d.choosetype === false && d.choosestatus === "Production"
                      ? d.achievedsymbol === "Between"
                        ? Number(AcheivedPercentCalcVal) >= Number(d.achievedfrom) && Number(AcheivedPercentCalcVal) <= Number(d.achievedto)
                        : d.achievedsymbol === "Less than or equal"
                          ? Number(AcheivedPercentCalcVal) <= Number(d.achieved)
                          : d.achievedsymbol === "Less than"
                            ? Number(AcheivedPercentCalcVal) < Number(d.achieved)
                            : d.achievedsymbol === "Greater than"
                              ? Number(AcheivedPercentCalcVal) > Number(d.achieved)
                              : Number(AcheivedPercentCalcVal) >= Number(d.achieved)
                      : d.choosetype === false && d.choosestatus === "New Gross"
                        ? d.newgrosssymbol === "Between"
                          ? Number(grossValue) >= Number(d.newgrossfrom) && Number(grossValue) <= Number(d.newgrossto)
                          : d.newgrosssymbol === "Less than or equal"
                            ? Number(grossValue) <= Number(d.newgross)
                            : d.newgrosssymbol === "Less than"
                              ? Number(grossValue) < Number(d.newgross)
                              : d.newgrosssymbol === "Greater than"
                                ? Number(grossValue) > Number(d.newgross)
                                : Number(grossValue) >= Number(d.newgross)
                        : true
                  : false;
      });
      //;

      let salaryTypeVal = getPayTypes ? getPayTypes.salraytype : "Final Salary";
      let deductionTypeVal = getPayTypes ? getPayTypes.deductiontype : "Acutal Deduction";
      ////daystatus---------------------------------------------------------------------------------------------------------

      let lowestValueSal, highestValueSal;

      if (finalSalaryCalcVal < Fixed_Salary && finalSalaryCalcVal < PROD_SALARY_Calcval) {
        lowestValueSal = "Final Salary";
      } else if (Fixed_Salary < finalSalaryCalcVal && Fixed_Salary < PROD_SALARY_Calcval) {
        lowestValueSal = "Fixed Salary";
      } else {
        lowestValueSal = "Production Salary";
      }

      if (finalSalaryCalcVal > Fixed_Salary && finalSalaryCalcVal > PROD_SALARY_Calcval) {
        highestValueSal = "Final Salary";
      } else if (Fixed_Salary > finalSalaryCalcVal && Fixed_Salary > PROD_SALARY_Calcval) {
        highestValueSal = "Fixed Salary";
      } else {
        highestValueSal = "Production Salary";
      }

      let findSalaryTypeValue = salaryTypeVal === "Whichever is Lower" ? lowestValueSal : salaryTypeVal === "Whichever is Higher" ? highestValueSal : salaryTypeVal;

      let lowestValueDed, highestValueDed;

      //salary type is final salary
      if (deductionTypeVal === "Whichever is Lower" && findSalaryTypeValue === "Final Salary") {
        if (acutalDeductionCalcVal < finalValueCalcVal && acutalDeductionCalcVal < final_Value_PenaltyCalcval && acutalDeductionCalcVal < minimumDeductionCalcVal) {
          lowestValueDed = "Acutal Deduction";
        } else if (finalValueCalcVal < final_Value_PenaltyCalcval && finalValueCalcVal < minimumDeductionCalcVal) {
          lowestValueDed = "On Value";
        } else if (final_Value_PenaltyCalcval < minimumDeductionCalcVal) {
          lowestValueDed = "On Penalty";
        } else {
          lowestValueDed = "Minimum Deduction";
        }
      }
      if (deductionTypeVal === "Whichever is Higher" && findSalaryTypeValue === "Final Salary") {
        if (acutalDeductionCalcVal > finalValueCalcVal && acutalDeductionCalcVal > final_Value_PenaltyCalcval && acutalDeductionCalcVal > minimumDeductionCalcVal) {
          highestValueDed = "Acutal Deduction";
        } else if (finalValueCalcVal > final_Value_PenaltyCalcval && finalValueCalcVal > minimumDeductionCalcVal) {
          highestValueDed = "On Value";
        } else if (final_Value_PenaltyCalcval > minimumDeductionCalcVal) {
          highestValueDed = "On Penalty";
        } else {
          highestValueDed = "Minimum Deduction";
        }
      }
      //salary type is fixed salary
      if (deductionTypeVal === "Whichever is Lower" && findSalaryTypeValue === "Fixed Salary") {
        if (Fixed_Acutal_Deduction_Calc < FIXED_Final_Value && Fixed_Acutal_Deduction_Calc < Fixed_Min_Deduction) {
          lowestValueDed = "Acutal Deduction";
        } else if (FIXED_Final_Value < Fixed_Min_Deduction) {
          lowestValueDed = "On Value";
        } else {
          lowestValueDed = "Minimum Deduction";
        }
      }
      if (deductionTypeVal === "Whichever is Higher" && findSalaryTypeValue === "Fixed Salary") {
        if (Fixed_Acutal_Deduction_Calc > FIXED_Final_Value && Fixed_Acutal_Deduction_Calc > Fixed_Min_Deduction) {
          lowestValueDed = "Acutal Deduction";
        } else if (FIXED_Final_Value > Fixed_Min_Deduction) {
          lowestValueDed = "On Value";
        } else {
          lowestValueDed = "Minimum Deduction";
        }
      }
      //salary type is PROD salary
      if (deductionTypeVal === "Whichever is Lower" && findSalaryTypeValue === "Production Salary") {
        if (PROD_Actual_Deduction_Val < PROD_Final_Value_Calc && PROD_Actual_Deduction_Val < PROD_Minimum_Deduction_Val) {
          lowestValueDed = "Acutal Deduction";
        } else if (PROD_Final_Value_Calc < PROD_Minimum_Deduction_Val) {
          lowestValueDed = "On Value";
        } else {
          lowestValueDed = "Minimum Deduction";
        }
      }
      if (deductionTypeVal === "Whichever is Higher" && findSalaryTypeValue === "Production Salary") {
        if (PROD_Actual_Deduction_Val > PROD_Final_Value_Calc && PROD_Actual_Deduction_Val > PROD_Minimum_Deduction_Val) {
          lowestValueDed = "Acutal Deduction";
        } else if (PROD_Final_Value_Calc > PROD_Minimum_Deduction_Val) {
          lowestValueDed = "On Value";
        } else {
          lowestValueDed = "Minimum Deduction";
        }
      }

      let findDeductionTypeVal = deductionTypeVal === "Whichever is Lower" ? lowestValueDed : deductionTypeVal === "Whichever is Higher" ? highestValueDed : deductionTypeVal;

      let findSalaryTypeValuefinal = findSalaryTypeValue ? findSalaryTypeValue : "Final Salary";

      // console.log(findSalaryTypeValuefinal, 'findSalaryTypeValuefinal')
      let findChangeStatus = "";
      let findSalaryAmount = "";

      if (oldrerunDataDirect1.data.find((d) => d.companyname === item.companyname && d.empcode === item.empcode)) {
        findSalaryAmount =
          findSalaryTypeValuefinal === "Final Salary"
            ? oldrerunDataDirect1.data.find((d) => d.companyname === item.companyname && d.empcode === item.empcode)?.finalsalary
            : findSalaryTypeValuefinal === "Fixed Salary"
              ? oldrerunDataDirect1.data.find((d) => d.companyname === item.companyname && d.empcode === item.empcode)?.fixedsalary
              : oldrerunDataDirect1.data.find((d) => d.companyname === item.companyname && d.empcode === item.empcode)?.prodsalary;

        findChangeStatus =
          findSalaryTypeValuefinal === "Final Salary"
            ? Math.abs(Number(findSalaryAmount) - Number(finalSalaryCalcVal)) >= attCtrlCriteria
              ? "+/- Amount differ"
              : Math.abs(Number(findSalaryAmount) - Number(finalSalaryCalcVal)) < attCtrlCriteria && Math.abs(Number(findSalaryAmount) - Number(finalSalaryCalcVal)) >= 1
                ? "Success"
                : "No change in Data"
            : findSalaryTypeValuefinal === "Fixed Salary"
              ? Math.abs(Number(findSalaryAmount) - Number(Fixed_Salary)) >= attCtrlCriteria
                ? "+/- Amount differ"
                : Math.abs(Number(findSalaryAmount) - Number(Fixed_Salary)) < attCtrlCriteria && Math.abs(Number(findSalaryAmount) - Number(Fixed_Salary)) >= 1
                  ? "Success"
                  : "No change in Data"
              : Math.abs(Number(findSalaryAmount) - Number(PROD_SALARY_Calcval)) >= attCtrlCriteria
                ? "+/- Amount differ"
                : Math.abs(Number(findSalaryAmount) - Number(PROD_SALARY_Calcval)) < attCtrlCriteria && Math.abs(Number(findSalaryAmount) - Number(PROD_SALARY_Calcval)) >= 1
                  ? "Success"
                  : "No change in Data";
      } else {
        findChangeStatus = "No change in Data";
      }

      let findalarydataNOW = findSalaryTypeValuefinal === "Final Salary" ? Number(finalSalaryCalcVal) : findSalaryTypeValuefinal === "Fixed Salary" ? Number(Fixed_Salary) : Number(PROD_SALARY_Calcval);

      let checkSalaryExcess = Number(findSalaryAmount) - Number(Number(findalarydataNOW).toFixed(2)) < 0;

      // console.log(checkSalaryExcess, Number(findSalaryAmount) - Number(Number(findalarydataNOW).toFixed(2)), item.companyname, 'checkSalaryExcess');

      return {
        ...item,
        // totalabsentlog: [],
        // totalpaiddayslog: [],
        // acheivedpointlog: [],
        // targetpointlog: [],
        // penaltylog: [],
        // nightshiftallowlog: [],
        // shiftallowtargetlog: [],
        // noshiftlog: [],
        // shiftallowancelog: [],
        // currmonthavglog: [],
        // currmonthattlog: [],
        checkSalaryExcess: checkSalaryExcess,
        serialNumber: index + 1,
        company: item.company,
        branch: item.branch,
        unit: item.unit,
        team: item.team,
        empcode: item.empcode,
        companyname: item.companyname,
        doj: item.doj ? moment(item.doj)?.format("DD-MM-YYYY") : "",
        experience: item.doj ? (calculateMonthsBetweenDates(item.doj, findDate) < 0 ? 0 : calculateMonthsBetweenDates(item.doj, findDate)) : "",
        //ASSIGN EXP LOG DETAILS
        endtar: modevalue ? modevalue.endtar : "",
        endtardate: modevalue && modevalue.endtardate ? moment(modevalue.endtardate)?.format("DD-MM-YYYY") : "",
        endexp: modevalue ? modevalue.endexp : "",
        endexpdate: modevalue && modevalue.endexpdate ? moment(modevalue.endexpdate)?.format("DD-MM-YYYY") : "",

        assignExpMode: modevalue ? modevalue.expmode : "",
        modevalue: modevalue ? modevalue.expval : "",

        targetexp: item.doj ? (differenceInMonthstar > 0 ? differenceInMonthstar : 0) : "",
        prodexp: item.doj ? (differenceInMonthsexp > 0 ? differenceInMonthsexp : 0) : "",
        modeexp: item.doj ? (differenceInMonths > 0 ? differenceInMonths : 0) : "",

        processcode: item.doj && modevalue && modevalue.expmode === "Manual" ? modevalue.salarycode : item.doj ? getprocessCode : "",
        salexp: item.doj ? (differenceInMonthsexp > 0 ? (differenceInMonthsexp <= 9 ? `0${differenceInMonthsexp}` : differenceInMonthsexp) : "00") : "",
        processcodeexp: processcodeexpvaluesalary,

        // gross: grossValue,

        //SALRY SLAB FILTER PAGE
        basic: actualBasicCalcVal,
        hra: actualHraCalcVal,
        conveyance: actualConveyanceCalcVal,
        medicalallowance: actualMedicalAllowCalcVal,
        productionallowance: prodAllowanceCalcVal,
        productionallowancetwo: prodAllowancetwoCalcVal,
        otherallowance: actualOtherCalVAL,

        oldgross: oldgross,
        oldbasic: oldactualBasicCalcVal,
        oldhra: oldactualHraCalcVal,
        oldconveyance: oldactualConveyanceCalcVal,
        oldmedicalallowance: oldactualMedicalAllowCalcVal,
        oldproductionallowance: oldprodAllowanceCalcVal,
        oldproductionallowancetwo: oldprodAllowancetwoCalcVal,
        oldotherallowance: oldactualOtherCalVAL,
        gross: grossValue,

        //REVENUE ALLOWANCE MASTER PAGE
        revenueallow: findRevenueAllow ? findRevenueAllow.amount : 0,
        //SHORTAGE MASTER PAGE
        shortage: findShortage ? findShortage.amount : 0,

        //ATTENDANCE MONTH STATUS
        totalnumberofdays: findTotalNoOfDays ? Number(findTotalNoOfDays.totalcounttillcurrendate) : 0,
        // totalshift: findTotalNoOfDays && Number(findTotalNoOfDays && findTotalNoOfDays.paidpresentday) - Number(findTotalNoOfDays && findTotalNoOfDays.weekoff),
        totalshift: totalshiftCalcVal,
        clsl: findTotalNoOfDays ? findTotalNoOfDays.clsl : 0,
        weekoffcount: findTotalNoOfDays ? findTotalNoOfDays.weekoff : 0,
        holiday: findTotalNoOfDays ? findTotalNoOfDays.holiday : 0,
        totalasbleave: totalasbleaveCalcVal,
        totalpaidDays: totalpaiddaycalVal,

        //old value and log
        totalpaiddaycalVal1: paiddayscalcvalfrommonthstatus,
        totalabsentcalVal1: findTotalNoOfDays ? findTotalNoOfDays.lopcount : 0,
        penaltyCalVal1: findPenaltyDetails ? findPenaltyDetails.amount.toFixed(2) : Number(0).toFixed(2),
        targetpointCalVal1: findPointsDetails ? findPointsDetails.target : 0,
        acheivedpointCalVal1: findPointsDetails ? findPointsDetails.point.toFixed(2) : Number(0).toFixed(2),
        shiftallowanceCalVal1: findPointsDetails ? findPointsDetails.allowancepoint.toFixed(2) : Number(0).toFixed(2),
        // paidpresentday: Number(findTotalNoOfDays && findTotalNoOfDays.paidpresentday) - Number(findTotalNoOfDays && findTotalNoOfDays.weekoff),

        //LIST PRODUCTION POINTS
        monthPoint: targetPointCalcVaue,

        acheivedpoints: AcheivedPointsCalcVal,

        acheivedpercent: AcheivedPercentCalcVal,

        //DAY POINTS UPLOAD SHIFTALOWANCE AMOUNT
        allowancepoint: allowancepointCalcVal,
        noallowancepoint: noshiftlogvalfinal,

        //ERA MASTER PAGE
        eramount: ERAAmountCalcVal,
        //PENALTY MASTER PAGE
        penalty: penaltyCalcVal ? penaltyCalcVal : 0,
        penaltyamount: penaltyAmtCalculationVal ? penaltyAmtCalculationVal.toFixed(2) : 0,

        //USER INOIVIDUAL VALUE
        ipname: item.ipname,
        insurancenumber: item.insurancenumber,
        pfmembername: item.pfmembername,
        uan: item.uan,

        currentmonthavg: Number(currMonAvgFinalcalVal),
        currentmonthavgCalVal1: findPointsDetailsNxtMonth ? Number(findPointsDetailsNxtMonth.avgpoint).toFixed(2) : 0,

        // currentmonthattendance: currMonAttFinalcalVal,
        currentmonthattCalVal1: currentMonthAttendanceVal,

        // paidstatus: paidStatusVal,

        noshiftlog: item.noshiftlog,
        noshiftlogCalVal1: findPointsDetails ? findPointsDetails.noallowancepoint : 0,

        shiftallowancetarget: shiftallowancetargetfinal,
        nightshiftallowance: Number(nightAllowanceCalcVal.toFixed(2)),

        nightshiftallowlog: item.nightshiftallowlog,
        nightshiftallowlogCalVal1: nightAllowancefinalcalculation,

        shiftallowtargetlog: item.shiftallowtargetlog,
        shiftallowtargetlogCalVal1: shiftallowancetarget,
        from: findDate,
        to: findmonthenddate,
        pfvalues: pfvalues,
        ///FINALFIXPRODSALARY STARTED
        acheivedproductionallowance: Number(acheivedProductionAllowanceValCal).toFixed(2),
        attendancelop: Number(attendanceLopCalVal).toFixed(2),
        actualnetsalary: (actualBasicCalcVal + actualHraCalcVal + actualConveyanceCalcVal + actualMedicalAllowCalcVal + actualOtherCalVAL - Number(attendanceLopCalVal) + Number(acheivedProductionAllowanceValCal)).toFixed(2),
        lopbasic: Number(lopBasicValCal).toFixed(2),
        lophra: Number(lopHRAValCal).toFixed(2),
        lopconveyance: Number(lopConveyValCal).toFixed(2),
        lopmedicalallowance: Number(lopMedicalValCal).toFixed(2),
        lopotherallowance: Number(lopOtherValCal).toFixed(2),
        lopproductionallowance: lopProductionAllowance.toFixed(2),
        lopnetsalary: Number(lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopProductionAllowance + lopOtherValCal).toFixed(2),
        prodbasic: Number(prodBasicValCalc).toFixed(2),
        prodhra: Number(prodHraValCalc).toFixed(2),
        prodconveyance: Number(prodConveyanceValCalc).toFixed(2),
        prodmedicalallowance: Number(prodMEDAllowanceValCalc).toFixed(2),
        prodotherallowance: Number(prodOtherValCalc).toFixed(2),
        prodproductionallowance: Number(prodPRODValCalc).toFixed(2),
        calculatednetsalary: Number(calcNetSalaryValCalc).toFixed(2),
        lossdeduction: Number(lossDed).toFixed(2),
        otherdeduction: Number(OtherDed).toFixed(2),
        finalbasic: Number(finalBasicValCalc).toFixed(2),
        finalhra: Number(finalHraValCalc).toFixed(2),
        finalconveyance: Number(finalConveyValCalc).toFixed(2),
        finalmedicalallowance: Number(finalMedicalAllowValcCalc).toFixed(2),
        finalproductionallowance: Number(finalProductionValcCalc).toFixed(2),
        finalotherallowance: Number(finalOtherValcCalc).toFixed(2),
        finalnetsalary: Number(finalNetSalaryValcCalc).toFixed(2),
        pfdays: pfDaysVal,
        ncpdays: ncpDaysVal,
        pfdeduction: Number(PF_deduction).toFixed(2),
        esideduction: Number(ESI_deduction).toFixed(2),
        finallopdays: finalLOPDaysCalcVal,
        paysliplop: Number(paySlipLopCalval).toFixed(0),
        finalleavededuction: Number(finalLeaveDeductionValCalc).toFixed(2),
        professionaltax: profTaxCalcVal,
        totaldeductions: Number(totalDeductionValCalc).toFixed(2),
        shiftallowancetarget: shiftallowancetargetfinal,
        nightshiftallowance: Number(Number(nightAllowanceCalcVal).toFixed(2)),
        finalsalary: Number(finalSalaryCalcVal).toFixed(2),
        finalsalarypenalty: Number(finalSalary_Penalty).toFixed(2),
        totalpointsvalue: Number(totalPointsValueCalc).toFixed(2),
        era: Number(acutalERAValCalc).toFixed(2),
        pfemployerdeduction: Number(PF_Emper_deduction).toFixed(2),
        esiemployerdeduction: Number(ESI_EMPR_deduction).toFixed(2),
        ctc: Number(CTC_Calcval).toFixed(2),
        // finalvaluetwo:Number(finalValueCalcVal).toFixed(2),
        finalvalue: Number(finalValueCalcVal).toFixed(2),
        finalvaluepenalty: Number(final_Value_PenaltyCalcval).toFixed(2),
        shortageone: Number(Shortage1ValCalc).toFixed(2),
        actualdeduction: Number(acutalDeductionCalcVal).toFixed(2),
        minimumdeduction: Number(minimumDeductionCalcVal).toFixed(2),
        finalvaluereview: finalValueReviewCalc,
        finalvaluestatus: finalValueStatus,
        finalvaluepenaltystatus: revenuePenaltyStatus,

        //FIXED
        fixedlossdeduction: Number(Fixed_Loss_Deduction_Calcval).toFixed(2),
        fixednetsalary: Number(Fixed_NET_Salary).toFixed(2),
        fixedbasic: Number(Fixed_Basic_CalcVal).toFixed(2),
        fixedhra: Number(Fixed_HRA_CalcVal).toFixed(2),
        fixedconveyance: Number(Fixed_Conveyance_CalcVal).toFixed(2),
        fixedmedicalallowance: Number(Fixed_Med_Allowace).toFixed(2),
        fixedproductionallowance: Number(Fixed_PROD_Allowace).toFixed(2),
        fixedotherallowance: Number(Fixed_OTHER_Allowace).toFixed(2),
        fixednetsalaryone: Number(Fixed_NET_Salary1).toFixed(2),
        fixedemppf: Number(Fixed_PF_deduction).toFixed(2),
        fixedempesi: Number(Fixed_ESI_deduction).toFixed(2),
        fixedempptax: Number(Fixed_TaxCalcVal).toFixed(2),
        fixedemprpf: Number(Fixed_PF_Emper_deduction).toFixed(2),
        fixedempresi: Number(Fixed_ESI_EMPR_deduction).toFixed(2),
        fixedshiftallowance: Number(Fixed_Shift_Allowance).toFixed(2),
        fixedtotaldeductions: Number(Fixed_Total_Deductions).toFixed(2),
        fixedsalary: Number(Fixed_Salary).toFixed(2),
        fixedsalarypenalty: Number(Fixed_Salary_penalty).toFixed(2),
        fixedlop: Number(Fixed_LOP1).toFixed(0),
        fixedlopdays: Number(Fixed_Lop_Days).toFixed(0),
        fixedctc: Number(Fixed_CTC_Calcval).toFixed(2),
        fixedfinalvalue: Number(FIXED_Final_Value).toFixed(2),
        fixedleavededuction: Number(Fixed_Leave_Dedcution).toFixed(2),
        fixedactualdeduction: Number(Fixed_Acutal_Deduction_Calc).toFixed(2),
        fixedminimumdeduction: Number(Fixed_Min_Deduction).toFixed(2),

        // production
        prodlossdeduction: Number(PROD_Loss_Deduction).toFixed(2),
        prodnetsalary: Number(PROD_NET_Salary).toFixed(2),
        prodbasicp: Number(PROD_BASIC_ValCalc).toFixed(2),
        prodhrap: Number(PROD_HRA_ValCalc).toFixed(2),
        prodconveyancep: Number(PROD_CONVEYANCE_ValCalc).toFixed(2),
        prodmedicalallowancep: Number(PROD_MEDICALALLOW_ValCalc).toFixed(2),
        prodproductionallowancep: Number(PROD_PRODUCTION_ValCalc).toFixed(2),
        prodotherallowancep: Number(PROD_OTHER_ValCalc).toFixed(2),
        prodnetsalaryonep: Number(PROD_NET_Salary1).toFixed(2),
        prodemppf: Number(PROD_PF_deduction).toFixed(2),
        prodempesi: Number(PROD_ESI_deduction).toFixed(2),
        prodempptax: Number(PROD_TaxCalcVal).toFixed(2),
        prodemprpf: Number(PROD_PF_Emper_deduction).toFixed(2),
        prodempresi: Number(PROD_ESI_EMPR_deduction).toFixed(2),
        prodtotaldeductions: Number(PROD_Total_deductions).toFixed(2),
        prodshiftallowance: Number(PROD_Shift_Allowance).toFixed(2),
        prodsalary: Number(PROD_SALARY_Calcval).toFixed(2),
        prodsalarypenalty: Number(PROD_SALARY_PENALTY_Calcval).toFixed(2),
        prodlopdays: Number(PROD_LOP_days).toFixed(2),
        prodlop: Number(PROD_LOP_calcval).toFixed(2),
        prodleavededuction: Number(PROD_Leave_Deduction).toFixed(2),
        prodctc: Number(PROD_CTC_Valcalc).toFixed(2),
        prodfinalvalue: Number(PROD_Final_Value_Calc).toFixed(2),
        prodactualdeduction: Number(PROD_Actual_Deduction_Val).toFixed(2),
        prodminimumdeduction: Number(PROD_Minimum_Deduction_Val).toFixed(2),

        currentmonthavg: Number(currMonAvgFinalcalVal),
        currentmonthattendance: currMonAttFinalcalVal,

        paidstatus: paidStatusVal,
        salarytype: findSalaryTypeValue ? findSalaryTypeValue : "",
        deductiontype: findDeductionTypeVal ? findDeductionTypeVal : "",

        bankname: bankDetails ? bankDetails.bankname : "",
        accountholdername: bankDetails ? bankDetails.accountholdername : "",
        accountnumber: bankDetails ? bankDetails.accountnumber : "",
        ifsccode: bankDetails ? bankDetails.ifsccode : "",
        changestatus: findChangeStatus,
        isvaluechanges: findChangeStatus,
        iseditedacheivedpoints: iswithedit == "withedit" && employeeWithEditNeedToRerun.some((d) => d.empcode === item.empcode && d.companyname === item.companyname) ? "Yes" : "",
        iseditedpenaltyamount: iswithedit == "withedit" && employeeWithEditNeedToRerun.some((d) => d.empcode === item.empcode && d.companyname === item.companyname) ? "Yes" : "",
      };
    } catch (err) {
      console.log(err);
    }
  };

  const splitArray = (array, chunkSize, monthnum, selectyear) => {
    const resultarr = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      const chunk = array.slice(i, i + chunkSize);
      resultarr.push({
        data: chunk,
        month: Number(monthnum),
        year: Number(selectyear),
      });
    }
    return resultarr;
  };
  const splitArray2 = (array, chunkSize, monthnum, selectyear) => {
    const resultarr2 = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      const chunk = array.slice(i, i + chunkSize);
      resultarr2.push({
        data: chunk,
        month: Number(monthnum) + 1 > 12 ? 1 : Number(monthnum) + 1,
        year: Number(monthnum) + 1 > 12 ? Number(selectyear) + 1 : Number(selectyear),
      });
    }
    return resultarr2;
  };

  //submit option for saving
  const handleFilter = async (e) => {
    // let findDeptDupe = payRunList.filter((d) => d.month == selectedMonth && d.year == String(selectedYear) && selectedDepartment.map((d) => d.value).includes(d.department));
    let paydupecheck = await axios.post(SERVICE.PAYRUNLIST_DUPECHECK, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      department: selectedDepartment.map((item) => item.value),
      month: String(selectedMonth),
      year: String(selectedYear),
    });
    let payData = paydupecheck.data.payruncontrol;
    const currentDate = new Date();
    const givenDate = new Date(selectedYear, selectedMonthNum - 1);

    // if (givenDate > currentDate) {
    //   setShowAlert(
    //     <>
    //       <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
    //       <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please select month and year that are not in the future."}</p>
    //     </>
    //   );
    //   handleClickOpenerr();
    // } else

    if (selectedDepartment.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Department"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (payData.length > 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />

          <p>{`Alredy this`}</p>
          <p style={{ fontSize: "20px", fontWeight: 900, wordBreak: "break-word" }}>{payData.map((d) => d.department).join(", ")}</p>
          <p>{`department Added for this selected Month and Year`}</p>
        </>
      );
      handleClickOpenerr();
    } else {
      setBankdetail(true);
      try {
        handleProgressUpdate(0, "Creating...");
        handleLoaderDialogOpen();
        let res = await axios.post(SERVICE.USER_PAYRUNDATA_LIMITED_FINAL, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          department: selectedDepartment.map((item) => item.value),
          month: String(selectmonthname),
          year: String(selectedYear),
        });
        let employeelistnames = res.data.users.length > 0 ? [...new Set(res.data.users.map((item) => item.companyname))] : [];
        // console.log(employeelistnames, 'employeelistnames');
        if (res.data.users.length > 0) {
          const resultarr = splitArray(employeelistnames, 5, selectedMonthNum, selectedYear);
          const resultarr2 = splitArray2(employeelistnames, 5, selectedMonthNum, selectedYear);

          let res_applyleave = await axios.post(SERVICE.APPLYLEAVE_APPROVED, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            status: String("Approved"),
          });
          let leaveresult = res_applyleave?.data?.applyleaves;

          async function sendBatchRequest(batch) {
            try {
              let res_usershift = await axios.post(SERVICE.USER_ATTENDANCE_PAYRUN, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
                department: selectedDepartment.map((item) => item.value),
                employees: batch.data,
                ismonth: batch.month,
                isyear: batch.year,
              });
              const filteredBatch = res_usershift?.data?.finaluser?.filter((d) => {
                const [day, month, year] = d.rowformattedDate.split("/");
                const formattedDate = new Date(`${year}-${month}-${day}`);
                const reasonDate = new Date(d.reasondate);
                const dojDate = new Date(d.doj);

                if (d.reasondate && d.reasondate !== "") {
                  return formattedDate >= dojDate && formattedDate <= reasonDate;
                } else if (d.doj && d.doj !== "") {
                  return formattedDate >= dojDate;
                } else {
                  return d;
                }
              });

              let filtered = filteredBatch;
              let countByEmpcodeClockin = {}; // Object to store count for each empcode
              let countByEmpcodeClockout = {};

              let result = filtered.flatMap((item, index) => {
                // Initialize count for empcode if not already present
                if (!countByEmpcodeClockin[item.empcode]) {
                  countByEmpcodeClockin[item.empcode] = 1;
                }
                if (!countByEmpcodeClockout[item.empcode]) {
                  countByEmpcodeClockout[item.empcode] = 1;
                }

                // Adjust clockinstatus based on lateclockincount
                let updatedClockInStatus = item.clockinstatus;
                // Adjust clockoutstatus based on earlyclockoutcount
                let updatedClockOutStatus = item.clockoutstatus;

                // Filter out only 'Absent' items for the current employee
                const absentItems = filtered?.filter((d) => d.clockinstatus === "Absent" && item.empcode === d.empcode && d.clockin === "00:00:00" && d.clockout === "00:00:00");

                // Check if the day before and after a 'Week Off' date is marked as 'Leave' or 'Absent'
                if (item.clockinstatus === "Week Off" && item.clockoutstatus === "Week Off") {
                  // Define the date format for comparison
                  const itemDate = moment(item.rowformattedDate, "DD/MM/YYYY");

                  const isPreviousDayLeave = leaveresult.some((leaveItem) => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, "days"), "day") && leaveItem.empcode === item.empcode);
                  const isPreviousDayAbsent = absentItems.some((absentItem) => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, "days"), "day") && absentItem.empcode === item.empcode);

                  const isNextDayLeave = leaveresult.some((leaveItem) => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().add(1, "days"), "day") && leaveItem.empcode === item.empcode);
                  const isNextDayAbsent = absentItems.some((absentItem) => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().add(1, "days"), "day") && absentItem.empcode === item.empcode);

                  if (isPreviousDayLeave) {
                    updatedClockInStatus = "BeforeWeekOffLeave";
                    updatedClockOutStatus = "BeforeWeekOffLeave";
                  }
                  if (isPreviousDayAbsent) {
                    updatedClockInStatus = "BeforeWeekOffAbsent";
                    updatedClockOutStatus = "BeforeWeekOffAbsent";
                  }
                  if (isNextDayLeave) {
                    updatedClockInStatus = "AfterWeekOffLeave";
                    updatedClockOutStatus = "AfterWeekOffLeave";
                  }
                  if (isNextDayAbsent) {
                    updatedClockInStatus = "AfterWeekOffAbsent";
                    updatedClockOutStatus = "AfterWeekOffAbsent";
                  }
                }

                // Check if 'Late - ClockIn' count exceeds the specified limit
                if (updatedClockInStatus === "Late - ClockIn") {
                  updatedClockInStatus = `${countByEmpcodeClockin[item.empcode]}Late - ClockIn`;
                  countByEmpcodeClockin[item.empcode]++; // Increment count for current empcode
                }
                // Check if 'Early - ClockOut' count exceeds the specified limit
                if (updatedClockOutStatus === "Early - ClockOut") {
                  updatedClockOutStatus = `${countByEmpcodeClockout[item.empcode]}Early - ClockOut`;
                  countByEmpcodeClockout[item.empcode]++; // Increment count for current empcode
                }

                return {
                  ...item,
                  shiftallot: item.shiftallot,
                  weekOffDates: item.weekOffDates,
                  clockinstatus: updatedClockInStatus,
                  clockoutstatus: updatedClockOutStatus,
                };
              });
              const itemsWithSerialNumber = result?.map((item, index) => ({
                ...item,
                shiftmode: item.shiftMode,
                uniqueid: item.id,
                userid: item.userid,
                totalnumberofdays: item.totalnumberofdays,
                empshiftdays: item.empshiftdays,
                totalcounttillcurrendate: item.totalcounttillcurrendate,
                totalshift: item.totalshift,
                attendanceauto: getattendancestatus(item),
                daystatus: item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item),
                appliedthrough: getAttModeAppliedThr(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
                lop: getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
                loptype: getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
                lopcalculation: getFinalLop(getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)), getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item))),
                lopcount: getCount(getFinalLop(getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)), getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)))),
                modetarget: getAttModeTarget(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
                paidpresentbefore: getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
                paidleavetype: getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
                paidpresent: getFinalPaid(getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)), getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item))),
                lopday: getAssignLeaveDayForLop(getFinalLop(getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)), getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)))),
                paidpresentday: getAssignLeaveDayForPaid(getFinalPaid(getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)), getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)))),
              }));

              const weekOption = ["BeforeWeekOffAbsent", "AfterWeekOffAbsent", "BeforeWeekOffLeave", "AfterWeekOffLeave"];
              itemsWithSerialNumber.forEach((item, index, array) => {
                if (attStatusOption.includes(item.daystatus) && item.clockin === "00:00:00" && item.clockout === "00:00:00" && item.paidpresent === "Yes - Full Day") {
                  const previousItem = array[index - 1];
                  const nextItem = array[index + 1];

                  const hasRelevantStatus = (entry) => entry && (weekOption.includes(entry.clockinstatus) || (weekOption.includes(entry.clockoutstatus) && entry.shift === "Week Off"));

                  // if (hasRelevantStatus(previousItem)) {
                  //     previousItem.clockinstatus = 'Week Off';
                  //     previousItem.clockoutstatus = 'Week Off';
                  //     previousItem.attendanceauto = getattendancestatus(previousItem);
                  //     previousItem.daystatus = previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem);
                  // }
                  // if (hasRelevantStatus(nextItem)) {
                  //     nextItem.clockinstatus = 'Week Off';
                  //     nextItem.clockoutstatus = 'Week Off';
                  //     nextItem.attendanceauto = getattendancestatus(nextItem);
                  //     nextItem.daystatus = nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem);
                  // }
                  if (hasRelevantStatus(previousItem)) {
                    previousItem.clockinstatus = "Week Off";
                    previousItem.clockoutstatus = "Week Off";
                    previousItem.attendanceauto = getattendancestatus(previousItem);
                    previousItem.daystatus = previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem);
                    previousItem.appliedthrough = getAttModeAppliedThr(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                    previousItem.lop = getAttModeLop(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                    previousItem.loptype = getAttModeLopType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                    previousItem.lopcalculation = getFinalLop(getAttModeLop(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)), getAttModeLopType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)));
                    previousItem.lopcount = getCount(getFinalLop(getAttModeLop(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)), getAttModeLopType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem))));
                    previousItem.modetarget = getAttModeTarget(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                    previousItem.paidpresentbefore = getAttModePaidPresent(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                    previousItem.paidleavetype = getAttModePaidPresentType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                    previousItem.paidpresent = getFinalPaid(getAttModePaidPresent(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)), getAttModePaidPresentType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)));
                    previousItem.lopday = getAssignLeaveDayForLop(getFinalLop(getAttModeLop(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)), getAttModeLopType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem))));
                    previousItem.paidpresentday = getAssignLeaveDayForPaid(
                      getFinalPaid(getAttModePaidPresent(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)), getAttModePaidPresentType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)))
                    );
                  }
                  if (hasRelevantStatus(nextItem)) {
                    nextItem.clockinstatus = "Week Off";
                    nextItem.clockoutstatus = "Week Off";
                    nextItem.attendanceauto = getattendancestatus(nextItem);
                    nextItem.daystatus = nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem);
                    nextItem.appliedthrough = getAttModeAppliedThr(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                    nextItem.lop = getAttModeLop(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                    nextItem.loptype = getAttModeLopType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                    nextItem.lopcalculation = getFinalLop(getAttModeLop(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)), getAttModeLopType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)));
                    nextItem.lopcount = getCount(getFinalLop(getAttModeLop(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)), getAttModeLopType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem))));
                    nextItem.modetarget = getAttModeTarget(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                    nextItem.paidpresentbefore = getAttModePaidPresent(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                    nextItem.paidleavetype = getAttModePaidPresentType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                    nextItem.paidpresent = getFinalPaid(getAttModePaidPresent(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)), getAttModePaidPresentType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)));
                    nextItem.lopday = getAssignLeaveDayForLop(getFinalLop(getAttModeLop(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)), getAttModeLopType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem))));
                    nextItem.paidpresentday = getAssignLeaveDayForPaid(getFinalPaid(getAttModePaidPresent(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)), getAttModePaidPresentType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem))));
                  }
                }
              });

              const finalresult = [];

              itemsWithSerialNumber.forEach((item) => {
                // console.log(item, "item");
                const leaveOnDateApproved = leaveresult.find((d) => d.date === item.rowformattedDate && d.empcode === item.empcode);

                const existingEntryIndex = finalresult.findIndex((entry) => entry.empcode === item.empcode);

                if (existingEntryIndex !== -1) {
                  if (item.shift !== "Not Allotted") {
                    finalresult[existingEntryIndex].shift++;
                  }
                  if ((item.clockinstatus === "Week Off" && item.clockoutstatus === "Week Off" && item.clockin === "00:00:00" && item.clockout === "00:00:00") || (item.daystatus === "MWEEKOFF" && item.paidpresent === "Yes - Full Day")) {
                    finalresult[existingEntryIndex].weekoff++;
                  }

                  if (item.clockinstatus === "Holiday" && item.clockoutstatus === "Holiday") {
                    finalresult[existingEntryIndex].holidayCount++;
                  }
                  if (item.shift === "Week Off") {
                    finalresult[existingEntryIndex].weekoffall++;
                  }
                  if (item.clockinstatus === "DLOP" && item.clockoutstatus === "DLOP") {
                    finalresult[existingEntryIndex].dlob++;
                  }
                  if (["MPRESENT", "PRESENT"].includes(item.daystatus) && ["MPRESENT", "PRESENT"].includes(item.daystatus)) {
                    finalresult[existingEntryIndex].present++;
                  }
                  // if (item.clockinstatus === 'Leave' && item.clockoutstatus === 'Leave') {
                  //     finalresult[existingEntryIndex].leaveCount++;
                  // }
                  if (leaveOnDateApproved) {
                    // if ((item.clockinstatus === `${leaveOnDateApproved.code} ${leaveOnDateApproved.status}`) && (item.clockoutstatus === `${leaveOnDateApproved.code} ${leaveOnDateApproved.status}`)) {
                    finalresult[existingEntryIndex].leaveCount++;
                    // }
                  }
                  if (item.lopcalculation === "Yes - Double Day") {
                    finalresult[existingEntryIndex].doublelopcount++;
                  }

                  if (item.lopcalculation === "Yes - Double Half Day") {
                    finalresult[existingEntryIndex].doublehalflopcount++;
                  }

                  if (item.clockinstatus !== "Not Allotted" && item.clockoutstatus !== "Not Allotted" && item.attendanceauto === undefined && item.daystatus === undefined) {
                    finalresult[existingEntryIndex].nostatuscount++;
                  }

                  finalresult[existingEntryIndex].lopcount = String(parseFloat(finalresult[existingEntryIndex].lopcount) + parseFloat(item.lopcount));
                  finalresult[existingEntryIndex].paidpresentday = String(parseFloat(finalresult[existingEntryIndex].paidpresentday) + parseFloat(item.paidpresentday));
                } else {
                  const newItem = {
                    id: item.id,
                    empcode: item.empcode,
                    username: item.username,
                    company: item.company,
                    branch: item.branch,
                    unit: item.unit,
                    team: item.team,
                    department: item.department,
                    totalnumberofdays: item.totalnumberofdays,
                    empshiftdays: item.empshiftdays,
                    //  shift: (item.clockinstatus !== 'Not Allotted' && item.clockoutstatus !== 'Not Allotted' && item.clockin === '00:00:00' && item.clockout === '00:00:00') ? 1 : 0,

                    shift: 1,

                    // weekoff: item.weekoffCount,
                    weekoff: item.clockinstatus === "Week Off" && item.clockoutstatus === "Week Off" && item.clockin === "00:00:00" && item.clockout === "00:00:00" ? 1 : 0,
                    lopcount: item.lopcount,

                    paidpresentday: item.paidpresentday,
                    totalcounttillcurrendate: item.totalcounttillcurrendate,
                    totalshift: item.totalshift,
                    holidayCount: item.clockinstatus === "Holiday" && item.clockoutstatus === "Holiday" ? 1 : 0,
                    // leaveCount: (item.clockinstatus === 'Leave' && item.clockoutstatus === 'Leave') ? 1 : 0,
                    // leaveCount: leaveOnDateApproved ? ((item.clockinstatus === `${leaveOnDateApproved && leaveOnDateApproved.code} ${leaveOnDateApproved && leaveOnDateApproved.status}`) && (item.clockoutstatus === `${leaveOnDateApproved && leaveOnDateApproved.code} ${leaveOnDateApproved && leaveOnDateApproved.status}`) ? 1 : 0) : 0,
                    leaveCount: leaveOnDateApproved ? 1 : 0,
                    clsl: 0,
                    holiday: 0,
                    totalpaiddays: 0,
                    nostatus: 0,

                    // nostatuscount: item.paidpresent === 'No' && item.modetarget === 'No' && item.lopcalculation === 'No' ? 1 : 0,
                    nostatuscount: item.clockinstatus !== "Not Allotted" && item.clockoutstatus !== "Not Allotted" && item.paidpresent === "No" && item.modetarget === "No" && item.lopcalculation === "No" ? 1 : 0,
                    weekoffall: item.shift === "Week Off" ? 1 : 0,
                    present: ["MPRESENT", "PRESENT"].includes(item.daystatus) && ["MPRESENT", "PRESENT"].includes(item.daystatus) ? 1 : 0,
                    dlob: item.clockinstatus === "DLOP" && item.clockoutstatus === "DLOP" ? 1 : 0,
                    doublelopcount: item.lopcalculation === "Yes - Double Day" ? 1 : 0,
                    doublehalflopcount: item.lopcalculation === "Double Half Day" ? 0.5 : 0,
                  };
                  finalresult.push(newItem);
                }
              });
              let resultdata = finalresult?.map((item, index) => {
                const finalPaidPresentDays = Number(item.paidpresentday) - (Number(item.holidayCount) + Number(item.leaveCount));

                return {
                  ...item,
                  serialNumber: index + 1,
                  totalnumberofdays: Number(item.totalnumberofdays),
                  lopcount: Number(item.lopcount),
                  // paidpresentday: finalPaidPresentDays,
                  paidpresentday: Number(item.paidpresentday) > Number(item.shift) ? Number(item.shift) - Number(item.lopcount) : Number(item.paidpresentday) - (Number(item.doublelopcount) + Number(item.doublehalflopcount)),
                };
              });

              return resultdata;
            } catch (err) {
              handleLoaderDialogClose();
              return [];
            }
          }

          async function getAllResults() {
            const [allResults, allResults2] = await Promise.all([processBatches(resultarr, true), processBatches(resultarr2, false)]);

            return { allResults, allResults2 };
          }

          async function processBatches(resultArray, isPrimaryArray) {
            let results = [];
            for (let [index, batch] of resultArray.entries()) {
              if (isPrimaryArray) {
                // console.log(index + 1, resultArray.length, 'index');
                handleProgressUpdate((((index + 1) / resultArray.length) * 100).toFixed(0), "Creating...");
              }
              const finaldata = await sendBatchRequest(batch);
              results = results.concat(finaldata);
              handleLoaderDialogOpen();
            }
            return results;
          }

          getAllResults()
            .then((results) => {
              setEmployeesPayRun(res.data.users);
              function splitArrayItems(array, chunkSize) {
                const resultarr = [];
                for (let i = 0; i < array.length; i += chunkSize) {
                  const chunk = array.slice(i, i + chunkSize);
                  resultarr.push({
                    emps: chunk,
                  });
                }
                return resultarr;
              }
              const resultarrItems = splitArrayItems(res.data.users, 50);
              let finalresult = results.allResults;
              let finalresultNxt = results.allResults2;
              async function sendBatchRequestItems(batch, data) {
                try {
                  const itemsWithSerialNumber = batch.emps.map(async (item, index) => processEmployeeItem(item, index, data, finalresult, finalresultNxt));
                  return await Promise.all(itemsWithSerialNumber);
                } catch (err) {
                  console.error("Error processing batch request items:", err);
                  setBankdetail(false);
                  handleApiError(err, setShowAlert, handleClickOpenerr);
                }
              }

              async function getAllResultsItems() {
                try {
                  const apiData = await fetchApiData(selectedMonth, selectedMonthNum, selectedYear);

                  let allResultsItems = [];
                  for (let batch of resultarrItems) {
                    const batchResults = await sendBatchRequestItems(batch, apiData);
                    allResultsItems.push(...batchResults);
                  }

                  return { allResultsItems, monthSets: apiData.monthSets };
                } catch (err) {
                  console.log(err, "err");
                  handleApiError(err, setShowAlert, handleClickOpenerr);
                }
              }

              getAllResultsItems().then((result) => {
                // console.log(result);
                try {
                  let resulTItems = result.allResultsItems;
                  const datasplitted = Object.values(
                    resulTItems.reduce((acc, item) => {
                      const { department } = item;
                      if (!acc[department]) {
                        acc[department] = { department, data: [] };
                      }
                      acc[department].data.push({ ...item });
                      return acc;
                    }, {})
                  );
                  handleProgressUpdate(100, "Creating...");
                  handleLoaderDialogOpen();
                  updateData(datasplitted, result.monthSets);
                  setBankdetail(false);
                } catch (err) {
                  handleLoaderDialogClose();
                  console.log(err, "err");
                  handleApiError(err, setShowAlert, handleClickOpenerr);
                }
              });
            })
            .catch((err) => {
              handleLoaderDialogClose();
              // console.error('Error in getting all results:', error);
            });
        }
      } catch (err) {
        console.log(err, "123");
        setBankdetail(false);
        handleLoaderDialogClose();
        handleApiError(err, setShowAlert, handleClickOpenerr);
      }
    }
  };

  const updateData = async (data, monthSets) => {
    try {
      if (data.length > 0) {
        handleProgressUpdate(100, "Creating...");
        handleLoaderDialogOpen();

        const esinotdeductionemployees = data
          .flatMap((item) => item.data)
          .filter((d) => Number(d.esideduction) == 0 && d.pfvalues.esideduction === true)
          .map((item) => ({ companyname: item.companyname, _id: item._id, empcode: item.empcode }));

        data?.map((d) => {
          let selectedmonthnumalter = Number(selectedMonthNum) <= 9 ? `0${Number(selectedMonthNum)}` : selectedMonthNum;

          let selectedMonStartDate = selectedYear + "-" + selectedmonthnumalter + "-01";

          let findexp = monthSets.find((item) => d.department === item.department);

          let findDatelist = findexp ? findexp.fromdate : selectedMonStartDate;

          //FIND SELECTEDMONTH MONTH END DATE
          const nextMonthFirstDay = new Date(Number(selectedYear), Number(selectedMonthNum), 1);

          // Subtract one day to get the last day of the given month
          const lastDate = new Date(nextMonthFirstDay - 1);

          let lastdateOfSelectedMonth = lastDate.getDate();
          let selectedMonEndDate = `${selectedYear}-${selectedmonthnumalter}-${lastdateOfSelectedMonth}`;
          let findmonthenddatelist = findexp ? findexp.todate : selectedMonEndDate;

          return axios.post(`${SERVICE.PAYRUNLIST_CREATE}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            department: String(d.department),
            data: d.data,
            from: findDatelist,
            to: findmonthenddatelist,
            empcount: d.data.length,
            month: String(selectedMonth),
            year: Number(selectedYear),
            generatedon: String(new Date()),
            addedby: [
              {
                name: String(isUserRoleAccess.companyname),
                date: String(new Date()),
              },
            ],
          });
        });
        handleProgressUpdate(100, "Creating...");
        await fetchPayrunlistOnly();
        handleLoaderDialogOpen();
        setShowAlert(
          <>
            <CheckCircleOutlineOutlinedIcon sx={{ fontSize: "100px", color: "#1d8510de" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Pay Run Created"}</p>
          </>
        );
        handleClickOpenerr();
        if (esinotdeductionemployees.length > 0) {
          setSelectAll(false);
          setSelectedRowsEsi([]);
          handleOpenESINoDed();
          setESINoDedEmps(esinotdeductionemployees);
        }
        handleLoaderDialogClose();
      }
    } catch (err) {
      console.log(err, "err");
      setBankdetail(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const handleClear = async (e) => {
    e.preventDefault();
    setSelectedDepartment([]);
    setItems([]);
    setPage(1);
    setPageSize(10);
    setSelectedYear(yyyy);
    setSelectedMonth(currentMonth);
    setSelectMonthName(currentMonth);
    setSelectedMonthNum(mm);
  };
  const [bankdetailFilter, setIsBankdetailFilter] = useState(false);
  const handleFilterData = async () => {
    if (selectedDepartmentFilter.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Department"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (selectmonthnameFilter === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Month"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedYearFilter === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Year"}</p>
        </>
      );
      handleClickOpenerr();
    } else {
      setIsBankdetailFilter(true);

      try {
        let res_data = await axios.post(SERVICE.PAYRUNLIST_LIMITED_FILTERED, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          department: selectedDepartmentFilter.map((item) => item.value),
          month: selectmonthnameFilter,
          year: selectedYearFilter,
        });
        setPayRunList(res_data.data.payrunlists);
        setIsBankdetailFilter(false);
      } catch (err) {
        setIsBankdetailFilter(false);
        handleApiError(err, setShowAlert, handleClickOpenerr);
      }
    }
  };

  const handleClearFilter = async (e) => {
    e.preventDefault();
    setSelectedDepartmentFilter([]);
    setItems([]);
    setPage(1);
    setPageSize(10);
    setPayRunList([]);
    setSelectedYearFilter(yyyy);
    setSelectedMonthFilter(currentMonth);
    setSelectMonthNameFilter(currentMonth);
    setSelectedMonthNumFilter(mm);
  };

  //Datatabletwo-----------------------------------------------------------------------------------
  // Show All Columns & Manage Columns
  const initialColumnVisibilityList = {
    serialNumber: true,
    department: true,
    from: true,
    to: true,
    month: true,
    year: true,
    checkbox: true,
    empcount: true,
    totalpf: true,
    totalctc: true,
    totalesi: true,
    totalproftax: true,
    generatedon: true,
    actions: true,
  };
  const [columnVisibilityList, setColumnVisibilityList] = useState(initialColumnVisibilityList);
  //image
  const handleCaptureImageList = () => {
    if (gridRefList.current) {
      html2canvas(gridRefList.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Pay Run List.png");
        });
      });
    }
  };

  // Manage Columns
  const [isManageColumnsOpenList, setManageColumnsOpenList] = useState(false);
  const [anchorElList, setAnchorElList] = useState(null);

  const openList = Boolean(anchorElList);
  const idList = openList ? "simple-popover" : undefined;

  const handleOpenManageColumnsList = (event) => {
    setAnchorElList(event.currentTarget);
    setManageColumnsOpenList(true);
  };
  const handleCloseManageColumnsList = () => {
    setManageColumnsOpenList(false);
    setSearchQueryManageList("");
  };
  const handlePageChangeList = (newPage) => {
    setPageList(newPage);
  };
  const handlePageSizeChangeList = (event) => {
    setPageSizeList(Number(event.target.value));
    setPageList(1);
  };

  const [columnName, setColumnName] = useState("");
  const inputRef = useRef(null);

  const handleColumnChange = (e) => {
    const value = e.target.value;
    setColumnName(value);

    if (!value.trim()) {
      return;
    }

    const api = gridApi.current;
    if (!api) {
      console.error("Grid API is not available.");
      return;
    }
    // console.log(api,'api')
    // Retrieve all columns
    const allColumns = api.getColumns();
    // console.log(allColumns,'allColumns')
    if (allColumns) {
      const column = allColumns.find(
        // (col) => col.colDef.headerName.toLowerCase() === value.trim().toLowerCase()
        (col) => col.colDef.headerName.toLowerCase().includes(value.trim().toLowerCase())
      );

      if (column) {
        api.ensureColumnVisible(column);
      } else {
        console.warn(`Column with headerName "${value}" not found.`);
      }
    } else {
      console.error("Unable to retrieve columns.");
    }
  };

  //datatable....
  const handleSearchChangeList = (event) => {
    setPageList(1);
    setSearchQueryList(event.target.value);
  };

  // Split the search query into individual terms
  const searchTermsList = searchQueryList.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatasList = itemsList?.filter((item) => {
    return searchTermsList.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  const filteredDataList = filteredDatasList?.slice((pageList - 1) * pageSizeList, pageList * pageSizeList);

  const totalPagesList = Math.ceil(filteredDatasList?.length / pageSizeList);

  const visiblePagesList = Math.min(totalPagesList, 3);

  const firstVisiblePageList = Math.max(1, pageList - 1);
  const lastVisiblePageList = Math.min(firstVisiblePageList + visiblePagesList - 1, totalPagesList);

  const pageNumbersList = [];

  const indexOfLastItemList = pageList * pageSizeList;
  const indexOfFirstItemList = indexOfLastItemList - pageSizeList;

  for (let i = firstVisiblePageList; i <= lastVisiblePageList; i++) {
    pageNumbersList.push(i);
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

  //Edit model...
  const [isViewOpen, setIsViewOpen] = useState(false);
  const handleClickOpenView = () => {
    setIsViewOpen(true);
  };
  const handleCloseModView = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsViewOpen(false);
  };

  //Delete model...
  const [isDelOpen, setIsDelOpen] = useState(false);
  const handleClickOpenDel = () => {
    setIsDelOpen(true);
  };
  const handleCloseModDel = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsDelOpen(false);
  };

  //Rerun popup model...
  const [isRerunOpen, setIsRerunOpen] = useState(false);

  const handleClickOpenRerun = () => {
    setIsRerunOpen(true);
  };
  const handleCloseModRerun = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsRerunOpen(false);
  };

  const [deleteId, setDeleteId] = useState("");
  const [deleteIdDataName, setDeleteIdDataName] = useState("");
  const [viewlistname, setViewlistname] = useState("");

  const handleDataFromChild = async (data) => {
    let res = await axios.get(`${SERVICE.PAYRUNLIST_SINGLE}/${data.id}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });
    setViewlistname(`${data.department} (${data.month} - ${data.year})`);
    setviewYear(data.year);
    setviewMonth(data.month);

    const sortedData = res.data.spayrunlist.data.sort((a, b) => {
      // Parse the date (`doj`) in `DD-MM-YYYY` format and compare in ascending order
      const dateA = new Date(a.doj.split("-").reverse().join("-"));
      const dateB = new Date(b.doj.split("-").reverse().join("-"));

      const dateComparison = dateA - dateB;
      if (dateComparison !== 0) {
        return dateComparison; // Sort by date if they differ
      }

      // Handle `empcode` comparison
      const getLastFiveDigits = (empcode) => {
        if (!empcode || typeof empcode !== "string") return null; // Handle missing or invalid empcode
        const numericPart = empcode.slice(-5); // Extract last 5 characters
        return parseInt(numericPart, 10); // Convert to number, returns NaN if invalid
      };

      const numA = getLastFiveDigits(a.empcode);
      const numB = getLastFiveDigits(b.empcode);

      // Place missing or invalid `empcode` last
      if (numA === null && numB === null) return 0; // Both are invalid, keep their order
      if (numA === null) return 1; // `a.empcode` is invalid, place it after `b`
      if (numB === null) return -1; // `b.empcode` is invalid, place it after `a`

      // Compare numeric parts of `empcode`
      const empcodeNumericComparison = numA - numB;
      if (empcodeNumericComparison !== 0) {
        return empcodeNumericComparison;
      }

      // Fallback to full `empcode` comparison (lexicographically)
      return a.empcode.localeCompare(b.empcode, undefined, {
        sensitivity: "base",
      });
    });

    let dataWithSerialNumber = sortedData.map((item, index) => {
      let allowancepointCalcVal = item.allowancepoint;
      let totalasbleaveCalcVal = item.totalasbleave;
      let targetPointCalcVaue = item.monthPoint;
      let AcheivedPointsCalcVal = item.acheivedpoints;
      let penaltyCalcVal = item.penalty;
      let totalpaiddaycalVal = item.totalpaidDays;
      let currMonAvgFinalcalVal = item.currentmonthavg;
      let currMonAttFinalcalVal = item.currentmonthattendance;
      let noshiftlogvalfinal = item.noallowancepoint;
      let shiftallowancetargetfinal = item.shiftallowancetarget;
      let nightAllowanceCalcVal = item.nightshiftallowance;

      return {
        //usersdatas
        ...item,
        serialNumber: index + 1,
        outerId: data.id,
        selectedmonth: data.month,
        selectedyear: data.year,
        id: item._id,
        // outerId: item.outerId,
        // serialNumber: item.serialNumber,
        company: item.company,
        branch: item.branch,
        unit: item.unit,
        team: item.team,
        empcode: item.empcode,
        companyname: item.companyname,
        legalname: item.legalname,
        doj: item.doj,
        designation: item.designation,
        department: item.department,
        processcode: item.processcode,
        // prodexp: item.prodexp,
        processcodeexp: item.processcodeexp,
        experience: Number(item.experience),
        //need to fetch from users
        bankname: item.bankname,
        accountname: item.accountholdername,
        accountnumber: item.accountnumber,
        ifsccode: item.ifsccode,
        totalnumberofdays: Number(item.totalnumberofdays),
        totalshift: Number(item.totalshift),
        clsl: Number(item.clsl),
        weekoff: Number(item.weekoffcount),
        holiday: Number(item.holiday),
        totalasbleave: Number(totalasbleaveCalcVal),
        totalpaidDays: Number(totalpaiddaycalVal),

        //fetched from salary slab filter
        calcualted: item.calcualted,

        oldgross: Number(item.oldgross),
        oldbasic: Number(item.oldbasic),
        oldhra: Number(item.oldhra),
        oldconveyance: Number(item.oldconveyance),
        oldmedicalallowance: Number(item.oldmedicalallowance),
        oldproductionallowance: Number(item.oldproductionallowance),
        oldproductionallowancetwo: Number(item.oldproductionallowancetwo),
        oldotherallowance: Number(item.oldotherallowance),
        gross: Number(item.oldgross),

        newgross: Number(item.gross),
        actualbasic: Number(item.basic),
        actualhra: Number(item.hra),
        actualconveyance: Number(item.conveyance),
        actualmedicalallowance: Number(item.medicalallowance),
        actualproductionallowance: Number(item.productionallowance),
        actualproductionallowancetwo: Number(item.productionallowancetwo),
        actualotherallowance: Number(item.otherallowance),

        //need to fetch from daypoints upload
        targetpoints: Number(targetPointCalcVaue),
        acheivedpoints: Number(Number(AcheivedPointsCalcVal).toFixed(2)),
        acheivedpercent: Number(item.acheivedpercent),

        // actualpenalty: penaltyCalcVal,
        actualpenaltyamount: Number(item.penalty),
        penaltyamount: Number(item.penaltyamount),
        // penaltyamt: item.penalty,
        uan: item.uan,
        pfmembername: item.pfmembername,
        insuranceno: item.insurancenumber,
        ipname: item.ipname,
        noallowanceshift: Number(noshiftlogvalfinal),
        shiftallowancepoint: Number(allowancepointCalcVal),

        shiftallowancetarget: Number(shiftallowancetargetfinal),
        nightshiftallowance: Number(nightAllowanceCalcVal),

        era: item.eramount ? Number(item.eramount) : 0,

        revenueallow: item.revenueallow ? Number(item.revenueallow) : 0,
        shortage: item.shortage ? Number(item.shortage) : 0,

        endtar: item.endtar,
        endtardate: item.endtardate,
        endexp: item.endexp,
        endexpdate: item.endexpdate,

        assignExpMode: item.assignExpMode,
        modevalue: item.modevalue,

        targetexp: Number(item.targetexp),
        prodexp: Number(item.prodexp),
        modeexp: Number(item.modeexp),
        // processcode: item.processcode,

        processcodetar: item.processcodetar,

        salexp: item.salexp,

        monthPoint: Number(targetPointCalcVaue),
        dayPoint: Number(item.dayPoint),

        currentmonthavg: Number(currMonAvgFinalcalVal),
        currentmonthattendance: Number(currMonAttFinalcalVal),
        paidstatus: item.paidstatus,

        //logs and value
        totalpaiddayslog: item.totalpaiddayslog,
        totalpaiddaycalVal1: item.totalpaiddaycalVal1,

        totalabsentlog: item.totalabsentlog,
        totalabsentcalVal1: item.totalabsentcalVal1,

        penaltylog: item.penaltylog,
        penaltylogcalVal1: item.penaltyCalVal1,

        targetpointlog: item.targetpointlog,
        targetpointcalVal1: item.targetpointCalVal1,

        acheivedpointlog: item.acheivedpointlog,
        acheivedpointcalVal1: item.acheivedpointCalVal1,

        shiftallowancelog: item.shiftallowancelog,
        shiftallowanceCalVal1: item.shiftallowanceCalVal1,

        currmonthavglog: item.currmonthavglog,
        currentmonthavgCalVal1: item.currentmonthavgCalVal1,

        currmonthattlog: item.currmonthattlog,
        currentmonthattCalVal1: item.currentmonthattCalVal1,

        noshiftlog: item.noshiftlog,
        noshiftlogCalVal1: item.noshiftlogCalVal1,

        shiftallowtargetlog: item.shiftallowtargetlog,
        shiftallowtargetlogCalVal1: item.shiftallowtargetlogCalVal1,

        nightshiftallowlog: item.nightshiftallowlog,
        nightshiftallowlogCalVal1: item.nightshiftallowlogCalVal1,

        // selectedmonth: item.selectedmonth,
        // selectedyear: item.selectedyear,

        achievedproductionallowance: Number(item.acheivedproductionallowance),
        actualnetsalary: Number(item.actualnetsalary),
        lopbasic: Number(item.lopbasic),
        lophra: Number(item.lophra),
        lopconveyance: Number(item.lopconveyance),
        lopmedicalallowance: Number(item.lopmedicalallowance),
        lopproductionallowance: Number(item.lopproductionallowance),
        lopotherallowance: Number(item.lopotherallowance),
        lopnetsalary: Number(item.lopnetsalary),
        prodbasic: Number(item.prodbasic),
        prodhra: Number(item.prodhra),
        prodconveyance: Number(item.prodconveyance),
        prodmedicalallowance: Number(item.prodmedicalallowance),
        prodproductionallowance: Number(item.prodproductionallowance),
        prodotherallowance: Number(item.prodotherallowance),
        attendancelop: Number(item.attendancelop),
        calculatednetsalary: Number(item.calculatednetsalary),
        // actualpenaltyamount: Number(item.penalty),
        // penaltyamount: Number(item.penaltyamount),
        lossdeduction: Number(item.lossdeduction),
        otherdeduction: Number(item.otherdeduction),
        finalbasic: Number(item.finalbasic),
        finalhra: Number(item.finalhra),
        finalconveyance: Number(item.finalconveyance),
        finalmedicalallowance: Number(item.finalmedicalallowance),
        finalproductionallowance: Number(item.finalproductionallowance),
        finalotherallowance: Number(item.finalotherallowance),
        finalnetsalary: Number(item.finalnetsalary),
        pfdays: Number(item.pfdays),
        ncpdays: Number(item.ncpdays),
        pfdeduction: Number(item.pfdeduction),
        esideduction: Number(item.esideduction),
        finallopdays: Number(item.finallopdays),
        paysliplop: Number(item.paysliplop),
        finalleavededuction: Number(item.finalleavededuction),
        professionaltax: Number(item.professionaltax),
        totaldeductions: Number(item.totaldeductions),
        // uan: item.uan,
        // ipname: item.ipname,
        // noallowanceshift: Number(item.noallowancepoint),
        // shiftallowancepoint: Number(item.allowancepoint),
        // shiftallowancetarget: Number(item.shiftallowancetarget),
        // nightshiftallowance: Number(item.nightshiftallowance),
        finalsalary: Number(item.finalsalary),
        finalsalarypenalty: Number(item.finalsalarypenalty),
        totalpointsvalue: Number(item.totalpointsvalue),
        // era: Number(item.eramount),
        actualera: Number(item.era),
        pfemployerdeduction: Number(item.pfemployerdeduction),
        esiemployerdeduction: Number(item.esiemployerdeduction),
        ctc: Number(item.ctc),
        revenueallowance: Number(item.revenueallow),
        finalvalue: Number(item.finalvalue),
        finalvaluetwo: Number(item.finalvaluetwo),
        finalvaluepenalty: Number(item.finalvaluepenalty),
        // shortage: Number(item.shortage),
        shortageone: Number(item.shortageone),
        actualdeduction: Number(item.actualdeduction),
        minimumdeduction: Number(item.minimumdeduction),
        finalvaluereview: item.finalvaluereview,
        finalvaluestatus: item.finalvaluestatus,
        finalvaluepenaltystatus: item.finalvaluepenaltystatus,

        //FIXED
        fixedlossdeduction: item.fixedlossdeduction,
        fixednetsalary: item.fixednetsalary,
        fixedbasic: item.fixedbasic,
        fixedhra: item.fixedhra,
        fixedconveyance: item.fixedconveyance,
        fixedmedicalallowance: item.fixedmedicalallowance,
        fixedproductionallowance: item.fixedproductionallowance,
        fixedotherallowance: item.fixedotherallowance,
        fixednetsalaryone: item.fixednetsalaryone,
        fixedemppf: item.fixedemppf,
        fixedempesi: item.fixedempesi,
        fixedempptax: item.fixedempptax,
        fixedemprpf: item.fixedemprpf,
        fixedempresi: item.fixedempresi,
        fixedshiftallowance: item.fixedshiftallowance,
        fixedtotaldeductions: item.fixedtotaldeductions,
        fixedsalary: item.fixedsalary,
        fixedsalarypenalty: item.fixedsalarypenalty,
        fixedlop: item.fixedlop,
        fixedlopdays: item.fixedlopdays,
        fixedleavededuction: item.fixedleavededuction,
        fixedctc: item.fixedctc,
        fixedfinalvalue: item.fixedfinalvalue,
        fixedactualdeduction: item.fixedactualdeduction,
        fixedminimumdeduction: item.fixedminimumdeduction,

        //PRODUCTION
        prodlossdeduction: item.prodlossdeduction,
        prodnetsalary: item.prodnetsalary,
        prodbasicp: item.prodbasicp,
        prodhrap: item.prodhrap,
        prodconveyancep: item.prodconveyancep,
        prodmedicalallowancep: item.prodmedicalallowancep,
        prodproductionallowancep: item.prodproductionallowancep,
        prodotherallowancep: item.prodotherallowancep,
        prodnetsalaryonep: item.prodnetsalaryonep,
        prodemppf: item.prodemppf,
        prodempesi: item.prodempesi,
        prodempptax: item.prodempptax,
        prodemprpf: item.prodemprpf,
        prodempresi: item.prodempresi,
        prodshiftallowance: item.prodshiftallowance,
        prodtotaldeductions: item.prodtotaldeductions,
        prodsalary: item.prodsalary,
        prodsalarypenalty: item.prodsalarypenalty,
        prodlopdays: item.prodlopdays,
        prodlop: item.prodlop,
        prodleavededuction: item.prodleavededuction,
        prodctc: item.prodctc,
        prodfinalvalue: item.prodfinalvalue,
        prodactualdeduction: item.prodactualdeduction,
        prodminimumdeduction: item.prodminimumdeduction,

        // currentmonthavg: item.currentmonthavg,
        // currentmonthattendance: item.currentmonthattendance,
        // paidstatus: item.paidstatus,

        salarytype: item.salarytype,
        deductiontype: item.deductiontype,
      };
    });

    // sortedData.map((item, index) => ({

    // }));
    let findSelectedMonthNum = months.find((d) => d.value === data.month).numval;
    // console.log(findSelectedMonthNum, data.month, 'findSelectedMonthNum');
    setSelectedViewMonthNum(findSelectedMonthNum);

    setItems(dataWithSerialNumber);
    setRowData(dataWithSerialNumber);
    setAllData(dataWithSerialNumber);
    setPage(1);
    setCurrentPage(1);
    handleClickOpenView();
  };

  const handleDataFromChildDel = (data) => {
    // console.log(data, 'data');
    setDeleteId(data.id);
    setDeleteIdDataName(data.department);
    handleClickOpenDel();
  };

  const [delLoad, setDelLoad] = useState(false);
  const handleDeleteList = async () => {
    setDelLoad(true);
    try {
      await axios.delete(`${SERVICE.PAYRUNLIST_SINGLE}/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDelLoad(false);
      await fetchPayRunList();
      setPageList(1);
      handleCloseModDel();
    } catch (err) {
      console.log(err, "erer");
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const [exceldataName, setExceldataName] = useState("");

  const handleDataFromChildDown = async (data) => {
    let res = await axios.get(`${SERVICE.PAYRUNLIST_SINGLE}/${data.id}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });
    // const branchOrder = ['TTS-TRICHY', 'TTS-LALGUDI', 'TTS-KULITHALAI'];
    setExceldataName(data.filename);
    let filename = data.filename;
    let findSelectedMonthNum = months.find((d) => d.value === data.month).numval;

    const sortedData = res.data.spayrunlist.data.sort((a, b) => {
      // Parse the date (`doj`) in `DD-MM-YYYY` format and compare in ascending order
      const dateA = new Date(a.doj.split("-").reverse().join("-"));
      const dateB = new Date(b.doj.split("-").reverse().join("-"));

      const dateComparison = dateA - dateB;
      if (dateComparison !== 0) {
        return dateComparison; // Sort by date if they differ
      }

      // Handle `empcode` comparison
      const getLastFiveDigits = (empcode) => {
        if (!empcode || typeof empcode !== "string") return null; // Handle missing or invalid empcode
        const numericPart = empcode.slice(-5); // Extract last 5 characters
        return parseInt(numericPart, 10); // Convert to number, returns NaN if invalid
      };

      const numA = getLastFiveDigits(a.empcode);
      const numB = getLastFiveDigits(b.empcode);

      // Place missing or invalid `empcode` last
      if (numA === null && numB === null) return 0; // Both are invalid, keep their order
      if (numA === null) return 1; // `a.empcode` is invalid, place it after `b`
      if (numB === null) return -1; // `b.empcode` is invalid, place it after `a`

      // Compare numeric parts of `empcode`
      const empcodeNumericComparison = numA - numB;
      if (empcodeNumericComparison !== 0) {
        return empcodeNumericComparison;
      }

      // Fallback to full `empcode` comparison (lexicographically)
      return a.empcode.localeCompare(b.empcode, undefined, {
        sensitivity: "base",
      });
    });

    let finaldata = sortedData.map((t, index) => ({
      Sno: index + 1,
      Department: t.department,
      Company: t.company,
      Branch: t.branch,
      Unit: t.unit,
      Team: t.team,
      Designation: t.designation,
      "Employee Name": t.companyname,
      Empcode: t.empcode,
      "Aadhar Name": t.legalname,

      "Process Code": t.processcodeexp,
      DOJ: t.doj,

      "Actual Exp": t.experience ? Number(t.experience) : 0,
      "Prod Exp": t.prodexp ? Number(t.prodexp) : 0,

      // "ProcessCode Exp": t.processcodeexp,
      "Total No.of Days": t.totalnumberofdays ? Number(t.totalnumberofdays) : 0,
      "Total Shift": t.totalshift ? Number(t.totalshift) : 0,
      "C.L. / S.L.": t.clsl ? Number(t.clsl) : 0,
      "Week Off": t.weekoffcount ? Number(t.weekoffcount) : 0,
      Holiday: t.holiday ? Number(t.holiday) : 0,
      "Total Absent/ Leave Shift": t.totalasbleave ? Number(t.totalasbleave) : 0,
      "Total Paid Shift": t.totalpaidDays ? Number(t.totalpaidDays) : 0,

      Gross: t.oldgross ? Number(t.oldgross) : 0,
      Basic: t.oldbasic ? Number(t.oldbasic) : 0,
      HRA: t.oldhra ? Number(t.oldhra) : 0,
      Conveyance: t.oldconveyance ? Number(t.oldconveyance) : 0,
      "Medical Allowance": t.oldmedicalallowance ? Number(t.oldmedicalallowance) : 0,
      "Production Allowance": t.oldproductionallowance ? Number(t.oldproductionallowance) : 0,
      "Production Allowance 2": t.oldproductionallowancetwo ? Number(t.oldproductionallowancetwo) : 0,
      "Other Allowance": t.oldotherallowance ? Number(t.oldotherallowance) : 0,

      "New Gross": t.gross ? Number(t.gross) : 0,
      "Actual Basic": t.basic ? Number(t.basic) : 0,
      "Actual HRA": t.hra ? Number(t.hra) : 0,
      "Actual Conveyance": t.conveyance ? Number(t.conveyance) : 0,
      "Actual Medical Allowance": t.medicalallowance ? Number(t.medicalallowance) : 0,
      "Actual Production Allowance": t.productionallowance ? Number(t.productionallowance) : 0,
      "Actual Production Allowance 2": t.productionallowancetwo ? Number(t.productionallowancetwo) : 0,
      "Actual Other Allowance": t.otherallowance ? Number(t.otherallowance) : 0,

      "Target Points": t.monthPoint ? Number(t.monthPoint) : 0,
      "Achieved Points": t.acheivedpoints ? Number(t.acheivedpoints) : 0,
      "Achieved  %": t.acheivedpercent ? Number(t.acheivedpercent) : 0,

      "Achieved Production Allowance": t.acheivedproductionallowance ? Number(t.acheivedproductionallowance) : 0,
      "Actual Net Salary": t.actualnetsalary ? Number(t.actualnetsalary) : 0,
      "LOP Basic": t.lopbasic ? Number(t.lopbasic) : 0,
      "LOP HRA": t.lophra ? Number(t.lophra) : 0,
      "LOP Conveyance": t.lopconveyance ? Number(t.lopconveyance) : 0,
      "LOP Medical Allowance": t.lopmedicalallowance ? Number(t.lopmedicalallowance) : 0,
      "LOP Production Allowance": t.lopproductionallowance ? Number(t.lopproductionallowance) : 0,
      "LOP Other Allowance": t.lopotherallowance ? Number(t.lopotherallowance) : 0,
      "LOP Net Salary": t.lopnetsalary ? Number(t.lopnetsalary) : 0,

      "Prod Basic": t.prodbasic ? Number(t.prodbasic) : 0,
      "Prod HRA": t.prodhra ? Number(t.prodhra) : 0,
      "Prod Conveyance": t.prodconveyance ? Number(t.prodconveyance) : 0,
      "Prod Medical Allowance": t.prodmedicalallowance ? Number(t.prodmedicalallowance) : 0,
      "Prod Production Allowance": Number(t.prodproductionallowance),
      "Prod Other Allowance": Number(t.prodotherallowance),

      "Attendance LOP": Number(t.attendancelop),
      "Calculated Net Salary": Number(t.calculatednetsalary),
      "Actual Penalty Amount": Number(t.penalty),
      "Penalty Amount": Number(t.penaltyamount),
      "Loss Deduction": Number(t.lossdeduction),
      "Other Deduction": Number(t.otherdeduction),

      "Final Basic": Number(t.finalbasic),
      "Final HRA": Number(t.finalhra),
      "Final Conveyance": Number(t.finalconveyance),
      "Final Medical Allowance": Number(t.finalmedicalallowance),
      "Final Production Allowance": Number(t.finalproductionallowance),
      "Final Other Allowance": Number(t.finalotherallowance),
      "Final Net Salary": Number(t.finalnetsalary),
      "PF Days": t.pfdays ? Number(t.pfdays) : 0,
      "NCP Days": t.ncpdays ? Number(t.ncpdays) : 0,
      "PF Deduction": t.pfdeduction ? Number(t.pfdeduction) : 0,
      "ESI Deduction": t.esideduction ? Number(t.esideduction) : 0,
      "Final-LOP": t.finallopdays ? Number(t.finallopdays) : 0,
      "Final LOP Days": t.paysliplop ? Number(t.paysliplop) : 0,
      "Final Leave Deduction": Number(t.finalleavededuction),
      "Professional Tax": Number(t.professionaltax),
      "Total Deductions": Number(t.totaldeductions),
      UAN: t.uan,
      "IP Name": t.ipname,

      // "PF Member Name": t.pfmembername,
      // "Insurance No": t.insurancenumber,

      "No. Allowance Shift": Number(t.noallowancepoint),
      "Shift Allowance Point": Number(t.allowancepoint),
      "Shift Allowance Target": Number(t.shiftallowancetarget),
      "Night Shift Allowance": Number(t.nightshiftallowance),
      "Final Salary": Number(t.finalsalary),
      "Final Salary+Penalty": Number(t.finalsalarypenalty),
      "Total Points Value": Number(t.totalpointsvalue),
      ERA: Number(t.eramount),
      "Actual ERA": Number(t.era),
      "PF Employer Deduction": Number(t.pfemployerdeduction),
      "ESI Employer Deduction": Number(t.esiemployerdeduction),
      CTC: Number(t.ctc),
      "Revenue Allowance": Number(t.revenueallow),
      "Final Value": Number(t.finalvalue),
      "Final Value-Penalty": Number(t.finalvaluepenalty),
      Shortage: Number(t.shortage),
      "Shortage 1": Number(t.shortageone),
      "Actual Deduction": Number(t.actualdeduction),
      "Minimum Deduction": Number(t.minimumdeduction),

      "Final Value Review": t.finalvaluereview,
      "Final Value Status": t.finalvaluestatus,
      "Final Value Penalty Status": t.finalvaluepenaltystatus,

      //FIXED
      "Fixed Loss Deduction": Number(t.fixedlossdeduction),
      Fixed_NET_Salary: Number(t.fixednetsalary),
      "Fixed Basic": Number(t.fixedbasic),
      "Fixed HRA": Number(t.fixedhra),
      "Fixed Conveyance": Number(t.fixedconveyance),
      "Fixed Medical Allowance": Number(t.fixedmedicalallowance),
      "Fixed Production Allowance": Number(t.fixedproductionallowance),
      "Fixed Other Allowance": Number(t.fixedotherallowance),
      Fixed_NET_Salary1: Number(t.fixednetsalaryone),
      Fixed_Emp_pf: t.fixedemppf ? Number(t.fixedemppf) : 0,
      Fixed_Emp_Esi: t.fixedempesi ? Number(t.fixedempesi) : 0,
      Fixed_Emp_tax: t.fixedempptax ? Number(t.fixedempptax) : 0,
      "Fixed Empr_pf": t.fixedemprpf ? Number(t.fixedemprpf) : 0,
      "Fixed Empr_Esi": t.fixedempresi ? Number(t.fixedempresi) : 0,
      Fixed_Shift_Allowance: Number(t.fixedshiftallowance),
      "Fixed Total Deductions": Number(t.fixedtotaldeductions),
      "Fixed Salary": Number(t.fixedsalary),
      "Fixed Salary+Penalty": Number(t.fixedsalarypenalty),
      "Fixed-LOP": Number(t.fixedlop),
      "Fixed LOP Days": Number(t.fixedlopdays),
      "Fixed Leave Deduction": Number(t.fixedleavededuction),
      "Fixed CTC": Number(t.fixedctc),
      "Fixed Final Value": Number(t.fixedfinalvalue),
      "Fixed Actual Deduction": Number(t.fixedactualdeduction),
      "Fixed Minimum Deduction": Number(t.fixedminimumdeduction),

      //PRODUCTION

      "PROD Loss Deduction": Number(t.prodlossdeduction),
      PROD_NET_Salary: Number(t.prodnetsalary),
      "PROD Basic": Number(t.prodbasicp),
      "PROD HRA": Number(t.prodhrap),
      "PROD Conveyance": Number(t.prodconveyancep),
      "PROD Medical Allowance": Number(t.prodmedicalallowancep),
      "PROD Production Allowance": Number(t.prodproductionallowancep),
      "PROD Other Allowance": Number(t.prodotherallowancep),
      PROD_NET_Salary1: Number(t.prodnetsalaryonep),

      PROD_Emp_pf: t.prodemppf ? Number(t.prodemppf) : 0,
      PROD_Emp_esi: t.prodempesi ? Number(t.prodempesi) : 0,
      PROD_Emp_tax: t.prodempptax ? Number(t.prodempptax) : 0,
      PROD_Empr_pf: t.prodemprpf ? Number(t.prodemprpf) : 0,
      PROD_Empr_Esi: t.prodempresi ? Number(t.prodempresi) : 0,
      PROD_Shift_Allowance: Number(t.prodshiftallowance),
      "PROD Total Deductions": Number(t.prodtotaldeductions),

      "PROD Salary": Number(t.prodsalary),
      "PROD Salary+Penalty": Number(t.prodsalarypenalty),
      "PROD LOP Days": Number(t.prodlopdays),
      "PROD LOP": Number(t.prodlop),
      "PROD Leave Deduction": Number(t.prodleavededuction),

      "PROD CTC": Number(t.prodctc),
      "PROD Final Value": Number(t.prodfinalvalue),

      "PROD Actual Deduction": Number(t.prodactualdeduction),
      "PROD Minimum Deduction": Number(t.prodminimumdeduction),

      "Banck Name": t.bankname,
      "Account Name": t.accountname,
      "Account Number": t.accountnumber,
      "IFSC Code": t.ifsccode,

      UAN: t.uan,
      "IP Name": t.ipname,

      "PF Member Name": t.pfmembername,
      "Insurance No": t.insurancenumber,

      [`Current (${monthsArr[Number(findSelectedMonthNum) + 1 > 12 ? 0 : Number(findSelectedMonthNum)]}) Month Avg`]: Number(t.currentmonthavg),
      [`Current (${monthsArr[Number(findSelectedMonthNum) + 1 > 12 ? 0 : Number(findSelectedMonthNum)]}) Month Attendance`]: Number(t.currentmonthattendance),
      "Paid Status": t.paidstatus,
      "Salary Type": t.salarytype,
      "Deduction Type": t.deductiontype,
    }));

    downloadExcel(finaldata, `Pay Run`);
    console.log("dgdf");
  };

  const handleBulkDownloadExcel = async () => {
    let checkMultipleMonths = [...new Set(selectedRowsMonths)].length > 1;
    // console.log(checkMultipleMonths, 'checkMultipleMonths')
    if (selectedRows.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select any row"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (checkMultipleMonths) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Same Month"}</p>
        </>
      );
      handleClickOpenerr();
    } else {
      const response = await axios.post(
        `${SERVICE.GET_PAYRUN_BULKDATA_EXCEL}`,
        {
          ids: selectedRows,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      // Process your data
      const data = response.data.payruncontrol.map((item) => item.data).flat();

      setExceldataName("Pay Run");
      let filename = "Pay Run";
      let findSelectedMonthNum = months.find((d) => d.value === response.data.payruncontrol[0].month).numval;

      const sortedData = data.sort((a, b) => {
        // Parse the date (`doj`) in `DD-MM-YYYY` format and compare in ascending order
        const dateA = new Date(a.doj.split("-").reverse().join("-"));
        const dateB = new Date(b.doj.split("-").reverse().join("-"));

        const dateComparison = dateA - dateB;
        if (dateComparison !== 0) {
          return dateComparison; // Sort by date if they differ
        }

        // Handle `empcode` comparison
        const getLastFiveDigits = (empcode) => {
          if (!empcode || typeof empcode !== "string") return null; // Handle missing or invalid empcode
          const numericPart = empcode.slice(-5); // Extract last 5 characters
          return parseInt(numericPart, 10); // Convert to number, returns NaN if invalid
        };

        const numA = getLastFiveDigits(a.empcode);
        const numB = getLastFiveDigits(b.empcode);

        // Place missing or invalid `empcode` last
        if (numA === null && numB === null) return 0; // Both are invalid, keep their order
        if (numA === null) return 1; // `a.empcode` is invalid, place it after `b`
        if (numB === null) return -1; // `b.empcode` is invalid, place it after `a`

        // Compare numeric parts of `empcode`
        const empcodeNumericComparison = numA - numB;
        if (empcodeNumericComparison !== 0) {
          return empcodeNumericComparison;
        }

        // Fallback to full `empcode` comparison (lexicographically)
        return a.empcode.localeCompare(b.empcode, undefined, {
          sensitivity: "base",
        });
      });

      let finaldata = sortedData.map((t, index) => ({
        Sno: index + 1,
        Department: t.department,
        Company: t.company,
        Branch: t.branch,
        Unit: t.unit,
        Team: t.team,
        Designation: t.designation,
        "Employee Name": t.companyname,
        Empcode: t.empcode,
        "Aadhar Name": t.legalname,

        "Process Code": t.processcodeexp,
        DOJ: t.doj,

        "Actual Exp": t.experience ? Number(t.experience) : 0,
        "Prod Exp": t.prodexp ? Number(t.prodexp) : 0,

        // "ProcessCode Exp": t.processcodeexp,
        "Total No.of Days": t.totalnumberofdays ? Number(t.totalnumberofdays) : 0,
        "Total Shift": t.totalshift ? Number(t.totalshift) : 0,
        "C.L. / S.L.": t.clsl ? Number(t.clsl) : 0,
        "Week Off": t.weekoffcount ? Number(t.weekoffcount) : 0,
        Holiday: t.holiday ? Number(t.holiday) : 0,
        "Total Absent/ Leave Shift": t.totalasbleave ? Number(t.totalasbleave) : 0,
        "Total Paid Shift": t.totalpaidDays ? Number(t.totalpaidDays) : 0,

        Gross: t.oldgross ? Number(t.oldgross) : 0,
        Basic: t.oldbasic ? Number(t.oldbasic) : 0,
        HRA: t.oldhra ? Number(t.oldhra) : 0,
        Conveyance: t.oldconveyance ? Number(t.oldconveyance) : 0,
        "Medical Allowance": t.oldmedicalallowance ? Number(t.oldmedicalallowance) : 0,
        "Production Allowance": t.oldproductionallowance ? Number(t.oldproductionallowance) : 0,
        "Production Allowance 2": t.oldproductionallowancetwo ? Number(t.oldproductionallowancetwo) : 0,
        "Other Allowance": t.oldotherallowance ? Number(t.oldotherallowance) : 0,

        "New Gross": t.gross ? Number(t.gross) : 0,
        "Actual Basic": t.basic ? Number(t.basic) : 0,
        "Actual HRA": t.hra ? Number(t.hra) : 0,
        "Actual Conveyance": t.conveyance ? Number(t.conveyance) : 0,
        "Actual Medical Allowance": t.medicalallowance ? Number(t.medicalallowance) : 0,
        "Actual Production Allowance": t.productionallowance ? Number(t.productionallowance) : 0,
        "Actual Production Allowance 2": t.productionallowancetwo ? Number(t.productionallowancetwo) : 0,
        "Actual Other Allowance": t.otherallowance ? Number(t.otherallowance) : 0,

        "Target Points": t.monthPoint ? Number(t.monthPoint) : 0,
        "Achieved Points": t.acheivedpoints ? Number(t.acheivedpoints) : 0,
        "Achieved  %": t.acheivedpercent ? Number(t.acheivedpercent) : 0,

        "Achieved Production Allowance": t.acheivedproductionallowance ? Number(t.acheivedproductionallowance) : 0,
        "Actual Net Salary": t.actualnetsalary ? Number(t.actualnetsalary) : 0,
        "LOP Basic": t.lopbasic ? Number(t.lopbasic) : 0,
        "LOP HRA": t.lophra ? Number(t.lophra) : 0,
        "LOP Conveyance": t.lopconveyance ? Number(t.lopconveyance) : 0,
        "LOP Medical Allowance": t.lopmedicalallowance ? Number(t.lopmedicalallowance) : 0,
        "LOP Production Allowance": t.lopproductionallowance ? Number(t.lopproductionallowance) : 0,
        "LOP Other Allowance": t.lopotherallowance ? Number(t.lopotherallowance) : 0,
        "LOP Net Salary": t.lopnetsalary ? Number(t.lopnetsalary) : 0,

        "Prod Basic": t.prodbasic ? Number(t.prodbasic) : 0,
        "Prod HRA": t.prodhra ? Number(t.prodhra) : 0,
        "Prod Conveyance": t.prodconveyance ? Number(t.prodconveyance) : 0,
        "Prod Medical Allowance": t.prodmedicalallowance ? Number(t.prodmedicalallowance) : 0,
        "Prod Production Allowance": Number(t.prodproductionallowance),
        "Prod Other Allowance": Number(t.prodotherallowance),

        "Attendance LOP": Number(t.attendancelop),
        "Calculated Net Salary": Number(t.calculatednetsalary),
        "Actual Penalty Amount": Number(t.penalty),
        "Penalty Amount": Number(t.penaltyamount),
        "Loss Deduction": Number(t.lossdeduction),
        "Other Deduction": Number(t.otherdeduction),

        "Final Basic": Number(t.finalbasic),
        "Final HRA": Number(t.finalhra),
        "Final Conveyance": Number(t.finalconveyance),
        "Final Medical Allowance": Number(t.finalmedicalallowance),
        "Final Production Allowance": Number(t.finalproductionallowance),
        "Final Other Allowance": Number(t.finalotherallowance),
        "Final Net Salary": Number(t.finalnetsalary),
        "PF Days": t.pfdays ? Number(t.pfdays) : 0,
        "NCP Days": t.ncpdays ? Number(t.ncpdays) : 0,
        "PF Deduction": t.pfdeduction ? Number(t.pfdeduction) : 0,
        "ESI Deduction": t.esideduction ? Number(t.esideduction) : 0,
        "Final-LOP": t.finallopdays ? Number(t.finallopdays) : 0,
        "Final LOP Days": t.paysliplop ? Number(t.paysliplop) : 0,
        "Final Leave Deduction": Number(t.finalleavededuction),
        "Professional Tax": Number(t.professionaltax),
        "Total Deductions": Number(t.totaldeductions),
        UAN: t.uan,
        "IP Name": t.ipname,

        // "PF Member Name": t.pfmembername,
        // "Insurance No": t.insurancenumber,

        "No. Allowance Shift": Number(t.noallowancepoint),
        "Shift Allowance Point": Number(t.allowancepoint),
        "Shift Allowance Target": Number(t.shiftallowancetarget),
        "Night Shift Allowance": Number(t.nightshiftallowance),
        "Final Salary": Number(t.finalsalary),
        "Final Salary+Penalty": Number(t.finalsalarypenalty),
        "Total Points Value": Number(t.totalpointsvalue),
        ERA: Number(t.eramount),
        "Actual ERA": Number(t.era),
        "PF Employer Deduction": Number(t.pfemployerdeduction),
        "ESI Employer Deduction": Number(t.esiemployerdeduction),
        CTC: Number(t.ctc),
        "Revenue Allowance": Number(t.revenueallow),
        "Final Value": Number(t.finalvalue),
        "Final Value-Penalty": Number(t.finalvaluepenalty),
        Shortage: Number(t.shortage),
        "Shortage 1": Number(t.shortageone),
        "Actual Deduction": Number(t.actualdeduction),
        "Minimum Deduction": Number(t.minimumdeduction),

        "Final Value Review": t.finalvaluereview,
        "Final Value Status": t.finalvaluestatus,
        "Final Value Penalty Status": t.finalvaluepenaltystatus,

        //FIXED
        "Fixed Loss Deduction": Number(t.fixedlossdeduction),
        Fixed_NET_Salary: Number(t.fixednetsalary),
        "Fixed Basic": Number(t.fixedbasic),
        "Fixed HRA": Number(t.fixedhra),
        "Fixed Conveyance": Number(t.fixedconveyance),
        "Fixed Medical Allowance": Number(t.fixedmedicalallowance),
        "Fixed Production Allowance": Number(t.fixedproductionallowance),
        "Fixed Other Allowance": Number(t.fixedotherallowance),
        Fixed_NET_Salary1: Number(t.fixednetsalaryone),
        Fixed_Emp_pf: t.fixedemppf ? Number(t.fixedemppf) : 0,
        Fixed_Emp_Esi: t.fixedempesi ? Number(t.fixedempesi) : 0,
        Fixed_Emp_tax: t.fixedempptax ? Number(t.fixedempptax) : 0,
        "Fixed Empr_pf": t.fixedemprpf ? Number(t.fixedemprpf) : 0,
        "Fixed Empr_Esi": t.fixedempresi ? Number(t.fixedempresi) : 0,
        Fixed_Shift_Allowance: Number(t.fixedshiftallowance),
        "Fixed Total Deductions": Number(t.fixedtotaldeductions),
        "Fixed Salary": Number(t.fixedsalary),
        "Fixed Salary+Penalty": Number(t.fixedsalarypenalty),
        "Fixed-LOP": Number(t.fixedlop),
        "Fixed LOP Days": Number(t.fixedlopdays),
        "Fixed Leave Deduction": Number(t.fixedleavededuction),
        "Fixed CTC": Number(t.fixedctc),
        "Fixed Final Value": Number(t.fixedfinalvalue),
        "Fixed Actual Deduction": Number(t.fixedactualdeduction),
        "Fixed Minimum Deduction": Number(t.fixedminimumdeduction),

        //PRODUCTION

        "PROD Loss Deduction": Number(t.prodlossdeduction),
        PROD_NET_Salary: Number(t.prodnetsalary),
        "PROD Basic": Number(t.prodbasicp),
        "PROD HRA": Number(t.prodhrap),
        "PROD Conveyance": Number(t.prodconveyancep),
        "PROD Medical Allowance": Number(t.prodmedicalallowancep),
        "PROD Production Allowance": Number(t.prodproductionallowancep),
        "PROD Other Allowance": Number(t.prodotherallowancep),
        PROD_NET_Salary1: Number(t.prodnetsalaryonep),

        PROD_Emp_pf: t.prodemppf ? Number(t.prodemppf) : 0,
        PROD_Emp_esi: t.prodempesi ? Number(t.prodempesi) : 0,
        PROD_Emp_tax: t.prodempptax ? Number(t.prodempptax) : 0,
        PROD_Empr_pf: t.prodemprpf ? Number(t.prodemprpf) : 0,
        PROD_Empr_Esi: t.prodempresi ? Number(t.prodempresi) : 0,
        PROD_Shift_Allowance: Number(t.prodshiftallowance),
        "PROD Total Deductions": Number(t.prodtotaldeductions),

        "PROD Salary": Number(t.prodsalary),
        "PROD Salary+Penalty": Number(t.prodsalarypenalty),
        "PROD LOP Days": Number(t.prodlopdays),
        "PROD LOP": Number(t.prodlop),
        "PROD Leave Deduction": Number(t.prodleavededuction),

        "PROD CTC": Number(t.prodctc),
        "PROD Final Value": Number(t.prodfinalvalue),

        "PROD Actual Deduction": Number(t.prodactualdeduction),
        "PROD Minimum Deduction": Number(t.prodminimumdeduction),

        "Banck Name": t.bankname,
        "Account Name": t.accountname,
        "Account Number": t.accountnumber,
        "IFSC Code": t.ifsccode,

        UAN: t.uan,
        "IP Name": t.ipname,

        "PF Member Name": t.pfmembername,
        "Insurance No": t.insurancenumber,

        [`Current (${monthsArr[Number(findSelectedMonthNum) + 1 > 12 ? 0 : Number(findSelectedMonthNum)]}) Month Avg`]: Number(t.currentmonthavg),
        [`Current (${monthsArr[Number(findSelectedMonthNum) + 1 > 12 ? 0 : Number(findSelectedMonthNum)]}) Month Attendance`]: Number(t.currentmonthattendance),
        "Paid Status": t.paidstatus,
        "Salary Type": t.salarytype,
        "Deduction Type": t.deductiontype,
      }));
      downloadExcel(finaldata, "Pay Run");
    }
  };

  const downloadExcel = (data, filename) => {
    const fileNameXl = `${filename}.xlsx`;
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, fileNameXl);
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select any row"}</p>
        </>
      );
      handleClickOpenerr();
    } else {
      handlebulkDelOpenCheck();
    }
  };
  const handleDeleteBulkCheckList = async () => {
    const response = await axios.post(
      `${SERVICE.DELETE_PAYRUN_BULKDATA}`,
      {
        ids: selectedRows,
      },
      {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      }
    );
    if (response.statusText === "OK") {
      handlebulkDelCloseCheck();
      await fetchPayRunList();
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Deleted Sucessfully"}</p>
        </>
      );
      handleClickOpenerr();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setSelectedRowsMonths([]);
    }
  };

  const [oldrerunData, setOldRerunData] = useState([]);
  const [loaderData, setLoaderData] = useState([]);
  const [isLoadStart, setIsLoadStart] = useState(false);

  const handleDataFromChildRerun = async (data) => {
    setOldRerunData([]);
    let res = await axios.get(`${SERVICE.PAYRUNLIST_SINGLE}/${data.id}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });
    setOldRerunData(res.data.spayrunlist);
    if (res.data.spayrunlist.data.some((d) => d.iseditedacheivedpoints === "Yes" || d.iseditedpenaltyamount === "Yes")) {
      setOldRerunData(res.data.spayrunlist);
      setLoaderData(res.data.spayrunlist.data.map((item) => ({ ...item, isvaluechanges: "Please Wait..." })));
      handleClickOpenRerun();
    } else {
      setIsLoadStart(true);
      setLoaderData(res.data.spayrunlist.data.map((item) => ({ ...item, isvaluechanges: "Please Wait..." })));
      handleRerunSubmitdirect(res.data.spayrunlist);
    }
  };

  //ALL EMPLOYEE RERUN DIRECT WITHOUT POPUP
  const handleRerunSubmitdirect = async (oldrerunDataDirect) => {
    let res;
    try {
      res = await axios.post(SERVICE.USER_PAYRUNDATA_LIMITED_FINAL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

        department: [oldrerunDataDirect.department],
        month: String(oldrerunDataDirect.month),
        year: String(oldrerunDataDirect.year),
      });
      // console.log(res.data.users, 'res.data.users')
      let employeelistnames = res.data.users.length > 0 ? [...new Set(res.data.users.map((item) => item.companyname))] : [];
      let findSelectedMonthNum = months.find((d) => d.value === oldrerunDataDirect.month).numval;

      if (res.data.users.length > 0) {
        const resultarr = splitArray(employeelistnames, 5, findSelectedMonthNum, oldrerunDataDirect.year);
        const resultarr2 = splitArray2(employeelistnames, 5, findSelectedMonthNum, oldrerunDataDirect.year);
        // console.log(resultarr, resultarr2)

        let res_applyleave = await axios.post(SERVICE.APPLYLEAVE_APPROVED, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          status: String("Approved"),
        });
        let leaveresult = res_applyleave?.data?.applyleaves;

        async function sendBatchRequest(batch) {
          try {
            let res_usershift = await axios.post(SERVICE.USER_ATTENDANCE_PAYRUN, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              department: oldrerunDataDirect.department,
              employees: batch.data,
              ismonth: batch.month,
              isyear: batch.year,
            });
            const filteredBatch = res_usershift?.data?.finaluser?.filter((d) => {
              const [day, month, year] = d.rowformattedDate.split("/");
              const formattedDate = new Date(`${year}-${month}-${day}`);
              const reasonDate = new Date(d.reasondate);
              const dojDate = new Date(d.doj);

              if (d.reasondate && d.reasondate !== "") {
                return formattedDate >= dojDate && formattedDate <= reasonDate;
              } else if (d.doj && d.doj !== "") {
                return formattedDate >= dojDate;
              } else {
                return d;
              }
            });

            let filtered = filteredBatch;
            let countByEmpcodeClockin = {}; // Object to store count for each empcode
            let countByEmpcodeClockout = {};
            let result = filtered.flatMap((item, index) => {
              // Initialize count for empcode if not already present
              if (!countByEmpcodeClockin[item.empcode]) {
                countByEmpcodeClockin[item.empcode] = 1;
              }
              if (!countByEmpcodeClockout[item.empcode]) {
                countByEmpcodeClockout[item.empcode] = 1;
              }

              // Adjust clockinstatus based on lateclockincount
              let updatedClockInStatus = item.clockinstatus;
              // Adjust clockoutstatus based on earlyclockoutcount
              let updatedClockOutStatus = item.clockoutstatus;

              // Filter out only 'Absent' items for the current employee
              const absentItems = filtered?.filter((d) => d.clockinstatus === "Absent" && item.empcode === d.empcode && d.clockin === "00:00:00" && d.clockout === "00:00:00");

              // Check if the day before and after a 'Week Off' date is marked as 'Leave' or 'Absent'
              if (item.clockinstatus === "Week Off" && item.clockoutstatus === "Week Off") {
                // Define the date format for comparison
                const itemDate = moment(item.rowformattedDate, "DD/MM/YYYY");

                const isPreviousDayLeave = leaveresult.some((leaveItem) => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, "days"), "day") && leaveItem.empcode === item.empcode);
                const isPreviousDayAbsent = absentItems.some((absentItem) => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, "days"), "day") && absentItem.empcode === item.empcode);

                const isNextDayLeave = leaveresult.some((leaveItem) => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().add(1, "days"), "day") && leaveItem.empcode === item.empcode);
                const isNextDayAbsent = absentItems.some((absentItem) => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().add(1, "days"), "day") && absentItem.empcode === item.empcode);

                if (isPreviousDayLeave) {
                  updatedClockInStatus = "BeforeWeekOffLeave";
                  updatedClockOutStatus = "BeforeWeekOffLeave";
                }
                if (isPreviousDayAbsent) {
                  updatedClockInStatus = "BeforeWeekOffAbsent";
                  updatedClockOutStatus = "BeforeWeekOffAbsent";
                }
                if (isNextDayLeave) {
                  updatedClockInStatus = "AfterWeekOffLeave";
                  updatedClockOutStatus = "AfterWeekOffLeave";
                }
                if (isNextDayAbsent) {
                  updatedClockInStatus = "AfterWeekOffAbsent";
                  updatedClockOutStatus = "AfterWeekOffAbsent";
                }
              }

              // Check if 'Late - ClockIn' count exceeds the specified limit
              if (updatedClockInStatus === "Late - ClockIn") {
                updatedClockInStatus = `${countByEmpcodeClockin[item.empcode]}Late - ClockIn`;
                countByEmpcodeClockin[item.empcode]++; // Increment count for current empcode
              }
              // Check if 'Early - ClockOut' count exceeds the specified limit
              if (updatedClockOutStatus === "Early - ClockOut") {
                updatedClockOutStatus = `${countByEmpcodeClockout[item.empcode]}Early - ClockOut`;
                countByEmpcodeClockout[item.empcode]++; // Increment count for current empcode
              }

              return {
                ...item,
                shiftallot: item.shiftallot,
                weekOffDates: item.weekOffDates,
                clockinstatus: updatedClockInStatus,
                clockoutstatus: updatedClockOutStatus,
              };
            });
            const itemsWithSerialNumber = result?.map((item, index) => ({
              ...item,
              shiftmode: item.shiftMode,
              uniqueid: item.id,
              userid: item.userid,
              totalnumberofdays: item.totalnumberofdays,
              empshiftdays: item.empshiftdays,
              totalcounttillcurrendate: item.totalcounttillcurrendate,
              totalshift: item.totalshift,
              attendanceauto: getattendancestatus(item),
              daystatus: item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item),
              appliedthrough: getAttModeAppliedThr(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
              lop: getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
              loptype: getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
              lopcalculation: getFinalLop(getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)), getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item))),
              lopcount: getCount(getFinalLop(getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)), getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)))),
              modetarget: getAttModeTarget(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
              paidpresentbefore: getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
              paidleavetype: getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
              paidpresent: getFinalPaid(getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)), getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item))),
              lopday: getAssignLeaveDayForLop(getFinalLop(getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)), getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)))),
              paidpresentday: getAssignLeaveDayForPaid(getFinalPaid(getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)), getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)))),
            }));

            const weekOption = ["BeforeWeekOffAbsent", "AfterWeekOffAbsent", "BeforeWeekOffLeave", "AfterWeekOffLeave"];
            itemsWithSerialNumber.forEach((item, index, array) => {
              if (attStatusOption.includes(item.daystatus) && item.clockin === "00:00:00" && item.clockout === "00:00:00" && item.paidpresent === "Yes - Full Day") {
                const previousItem = array[index - 1];
                const nextItem = array[index + 1];

                const hasRelevantStatus = (entry) => entry && (weekOption.includes(entry.clockinstatus) || (weekOption.includes(entry.clockoutstatus) && entry.shift === "Week Off"));

                // if (hasRelevantStatus(previousItem)) {
                //     previousItem.clockinstatus = 'Week Off';
                //     previousItem.clockoutstatus = 'Week Off';
                //     previousItem.attendanceauto = getattendancestatus(previousItem);
                //     previousItem.daystatus = previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem);
                // }
                // if (hasRelevantStatus(nextItem)) {
                //     nextItem.clockinstatus = 'Week Off';
                //     nextItem.clockoutstatus = 'Week Off';
                //     nextItem.attendanceauto = getattendancestatus(nextItem);
                //     nextItem.daystatus = nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem);
                // }
                if (hasRelevantStatus(previousItem)) {
                  previousItem.clockinstatus = "Week Off";
                  previousItem.clockoutstatus = "Week Off";
                  previousItem.attendanceauto = getattendancestatus(previousItem);
                  previousItem.daystatus = previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem);
                  previousItem.appliedthrough = getAttModeAppliedThr(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                  previousItem.lop = getAttModeLop(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                  previousItem.loptype = getAttModeLopType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                  previousItem.lopcalculation = getFinalLop(getAttModeLop(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)), getAttModeLopType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)));
                  previousItem.lopcount = getCount(getFinalLop(getAttModeLop(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)), getAttModeLopType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem))));
                  previousItem.modetarget = getAttModeTarget(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                  previousItem.paidpresentbefore = getAttModePaidPresent(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                  previousItem.paidleavetype = getAttModePaidPresentType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                  previousItem.paidpresent = getFinalPaid(getAttModePaidPresent(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)), getAttModePaidPresentType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)));
                  previousItem.lopday = getAssignLeaveDayForLop(getFinalLop(getAttModeLop(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)), getAttModeLopType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem))));
                  previousItem.paidpresentday = getAssignLeaveDayForPaid(
                    getFinalPaid(getAttModePaidPresent(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)), getAttModePaidPresentType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)))
                  );
                }
                if (hasRelevantStatus(nextItem)) {
                  nextItem.clockinstatus = "Week Off";
                  nextItem.clockoutstatus = "Week Off";
                  nextItem.attendanceauto = getattendancestatus(nextItem);
                  nextItem.daystatus = nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem);
                  nextItem.appliedthrough = getAttModeAppliedThr(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                  nextItem.lop = getAttModeLop(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                  nextItem.loptype = getAttModeLopType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                  nextItem.lopcalculation = getFinalLop(getAttModeLop(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)), getAttModeLopType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)));
                  nextItem.lopcount = getCount(getFinalLop(getAttModeLop(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)), getAttModeLopType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem))));
                  nextItem.modetarget = getAttModeTarget(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                  nextItem.paidpresentbefore = getAttModePaidPresent(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                  nextItem.paidleavetype = getAttModePaidPresentType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                  nextItem.paidpresent = getFinalPaid(getAttModePaidPresent(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)), getAttModePaidPresentType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)));
                  nextItem.lopday = getAssignLeaveDayForLop(getFinalLop(getAttModeLop(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)), getAttModeLopType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem))));
                  nextItem.paidpresentday = getAssignLeaveDayForPaid(getFinalPaid(getAttModePaidPresent(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)), getAttModePaidPresentType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem))));
                }
              }
            });

            const finalresult = [];

            itemsWithSerialNumber.forEach((item) => {
              // console.log(item, "item");
              const leaveOnDateApproved = leaveresult.find((d) => d.date === item.rowformattedDate && d.empcode === item.empcode);

              const existingEntryIndex = finalresult.findIndex((entry) => entry.empcode === item.empcode);

              if (existingEntryIndex !== -1) {
                if (item.shift !== "Not Allotted") {
                  finalresult[existingEntryIndex].shift++;
                }
                if ((item.clockinstatus === "Week Off" && item.clockoutstatus === "Week Off" && item.clockin === "00:00:00" && item.clockout === "00:00:00") || (item.daystatus === "MWEEKOFF" && item.paidpresent === "Yes - Full Day")) {
                  finalresult[existingEntryIndex].weekoff++;
                }

                if (item.clockinstatus === "Holiday" && item.clockoutstatus === "Holiday") {
                  finalresult[existingEntryIndex].holidayCount++;
                }
                if (item.shift === "Week Off") {
                  finalresult[existingEntryIndex].weekoffall++;
                }
                if (item.clockinstatus === "DLOP" && item.clockoutstatus === "DLOP") {
                  finalresult[existingEntryIndex].dlob++;
                }
                if (["MPRESENT", "PRESENT"].includes(item.daystatus) && ["MPRESENT", "PRESENT"].includes(item.daystatus)) {
                  finalresult[existingEntryIndex].present++;
                }
                // if (item.clockinstatus === 'Leave' && item.clockoutstatus === 'Leave') {
                //     finalresult[existingEntryIndex].leaveCount++;
                // }
                if (leaveOnDateApproved) {
                  // if ((item.clockinstatus === `${leaveOnDateApproved.code} ${leaveOnDateApproved.status}`) && (item.clockoutstatus === `${leaveOnDateApproved.code} ${leaveOnDateApproved.status}`)) {
                  finalresult[existingEntryIndex].leaveCount++;
                  // }
                }
                if (item.lopcalculation === "Yes - Double Day") {
                  finalresult[existingEntryIndex].doublelopcount++;
                }

                if (item.lopcalculation === "Yes - Double Half Day") {
                  finalresult[existingEntryIndex].doublehalflopcount++;
                }

                if (item.clockinstatus !== "Not Allotted" && item.clockoutstatus !== "Not Allotted" && item.attendanceauto === undefined && item.daystatus === undefined) {
                  finalresult[existingEntryIndex].nostatuscount++;
                }

                finalresult[existingEntryIndex].lopcount = String(parseFloat(finalresult[existingEntryIndex].lopcount) + parseFloat(item.lopcount));
                finalresult[existingEntryIndex].paidpresentday = String(parseFloat(finalresult[existingEntryIndex].paidpresentday) + parseFloat(item.paidpresentday));
              } else {
                const newItem = {
                  id: item.id,
                  empcode: item.empcode,
                  username: item.username,
                  company: item.company,
                  branch: item.branch,
                  unit: item.unit,
                  team: item.team,
                  department: item.department,
                  totalnumberofdays: item.totalnumberofdays,
                  empshiftdays: item.empshiftdays,
                  //  shift: (item.clockinstatus !== 'Not Allotted' && item.clockoutstatus !== 'Not Allotted' && item.clockin === '00:00:00' && item.clockout === '00:00:00') ? 1 : 0,

                  shift: 1,

                  // weekoff: item.weekoffCount,
                  weekoff: item.clockinstatus === "Week Off" && item.clockoutstatus === "Week Off" && item.clockin === "00:00:00" && item.clockout === "00:00:00" ? 1 : 0,
                  lopcount: item.lopcount,

                  paidpresentday: item.paidpresentday,
                  totalcounttillcurrendate: item.totalcounttillcurrendate,
                  totalshift: item.totalshift,
                  holidayCount: item.clockinstatus === "Holiday" && item.clockoutstatus === "Holiday" ? 1 : 0,
                  // leaveCount: (item.clockinstatus === 'Leave' && item.clockoutstatus === 'Leave') ? 1 : 0,
                  // leaveCount: leaveOnDateApproved ? ((item.clockinstatus === `${leaveOnDateApproved && leaveOnDateApproved.code} ${leaveOnDateApproved && leaveOnDateApproved.status}`) && (item.clockoutstatus === `${leaveOnDateApproved && leaveOnDateApproved.code} ${leaveOnDateApproved && leaveOnDateApproved.status}`) ? 1 : 0) : 0,
                  leaveCount: leaveOnDateApproved ? 1 : 0,
                  clsl: 0,
                  holiday: 0,
                  totalpaiddays: 0,
                  nostatus: 0,

                  // nostatuscount: item.paidpresent === 'No' && item.modetarget === 'No' && item.lopcalculation === 'No' ? 1 : 0,
                  nostatuscount: item.clockinstatus !== "Not Allotted" && item.clockoutstatus !== "Not Allotted" && item.paidpresent === "No" && item.modetarget === "No" && item.lopcalculation === "No" ? 1 : 0,
                  weekoffall: item.shift === "Week Off" ? 1 : 0,
                  present: ["MPRESENT", "PRESENT"].includes(item.daystatus) && ["MPRESENT", "PRESENT"].includes(item.daystatus) ? 1 : 0,
                  dlob: item.clockinstatus === "DLOP" && item.clockoutstatus === "DLOP" ? 1 : 0,
                  doublelopcount: item.lopcalculation === "Yes - Double Day" ? 1 : 0,
                  doublehalflopcount: item.lopcalculation === "Double Half Day" ? 0.5 : 0,
                };
                finalresult.push(newItem);
              }
            });
            let resultdata = finalresult?.map((item, index) => {
              const finalPaidPresentDays = Number(item.paidpresentday) - (Number(item.holidayCount) + Number(item.leaveCount));

              return {
                ...item,
                serialNumber: index + 1,
                totalnumberofdays: Number(item.totalnumberofdays),
                lopcount: Number(item.lopcount),
                // paidpresentday: finalPaidPresentDays,
                paidpresentday: Number(item.paidpresentday) > Number(item.shift) ? Number(item.shift) - Number(item.lopcount) : Number(item.paidpresentday) - (Number(item.doublelopcount) + Number(item.doublehalflopcount)),
              };
            });

            return resultdata;
          } catch (err) {
            handleLoaderDialogClose();
            return [];
          }
        }

        async function getAllResults() {
          const [allResults, allResults2] = await Promise.all([processBatches(resultarr, true), processBatches(resultarr2, false)]);

          return { allResults, allResults2 };
        }

        async function processBatches(resultArray, isPrimaryArray) {
          let results = [];
          for (let [index, batch] of resultArray.entries()) {
            if (isPrimaryArray) {
              // console.log(index + 1, resultArray.length, 'index');
              handleProgressUpdate((((index + 1) / resultArray.length) * 100).toFixed(0), "Creating...");
            }
            const finaldata = await sendBatchRequest(batch);
            results = results.concat(finaldata);
            // handleLoaderDialogOpen();
          }
          return results;
        }

        getAllResults()
          .then((results) => {
            setEmployeesPayRun(res.data.users);
            function splitArrayItems(array, chunkSize) {
              const resultarr = [];
              for (let i = 0; i < array.length; i += chunkSize) {
                const chunk = array.slice(i, i + chunkSize);
                resultarr.push({
                  emps: chunk,
                });
              }
              return resultarr;
            }
            const resultarrItems = splitArrayItems(res.data.users, 50);
            let finalresult = results.allResults;
            let finalresultNxt = results.allResults2;

            async function sendBatchRequestItems(batch, data) {
              try {
                const itemsWithSerialNumber = batch.emps.map(async (item, index) => processEmployeeItemReruns(item, index, data, finalresult, finalresultNxt, oldrerunDataDirect, oldrerunDataDirect.month, findSelectedMonthNum, oldrerunDataDirect.year, "", []));
                return await Promise.all(itemsWithSerialNumber);
              } catch (err) {
                console.error("Error processing batch request items:", err);
                setBankdetail(false);
                handleApiError(err, setShowAlert, handleClickOpenerr);
              }
            }

            async function getAllResultsItems() {
              try {
                const apiData = await fetchApiData(oldrerunDataDirect.month, findSelectedMonthNum, oldrerunDataDirect.year);

                let allResultsItems = [];
                for (let batch of resultarrItems) {
                  const batchResults = await sendBatchRequestItems(batch, apiData);
                  allResultsItems.push(...batchResults);
                }

                return { allResultsItems, monthSets: apiData.monthSets };
              } catch (err) {
                console.log(err, "err");
                handleApiError(err, setShowAlert, handleClickOpenerr);
              }
            }

            getAllResultsItems().then((result) => {
              try {
                let results = result.allResultsItems;

                let finalDataOnlyAboveHundred = results.map((item) => {
                  // const oldItem = oldrerunDataDirect.data.find(oldItem => oldItem.companyname === item.companyname && oldItem.empcode === item.empcode);

                  const oldItem = oldrerunDataDirect.data.find((oldItem) => oldItem.companyname === item.companyname && oldItem.empcode === item.empcode);
                  let findIsBankStatusClosed = oldItem?.logdata.some((item) => item.bankclose == "closed");
                  let findIsBankStatusCreated = oldItem?.logdata.some((item) => item.bankreleasestatus == "created");
                  // console.log(findIsBankStatusClosed, findIsBankStatusCreated, item.changestatus, 'sdlkfjsd')
                  // Check if the item's changestatus is "Amount Differ"
                  // if (item.changestatus != "+/- Amount differ") {
                  //   return oldItem ? { ...oldItem, changestatus: item.changestatus, isvaluechanges: item.changestatus } : item;
                  // }
                  // else
                  if (item.changestatus == "+/- Amount differ" && findIsBankStatusClosed) {
                    let findHoldReleaseData = oldItem?.logdata.some((data) => data.status == "holdrelease" && data.holdsalaryconfirm != "Yes") ? oldItem?.logdata.find((data) => data.status == "holdrelease" && data.holdsalaryconfirm != "Yes")._id : "";
                    let logdatas = [];
                    if (findHoldReleaseData != "") {
                      logdatas = oldItem.logdata.map((d) => {
                        if (d._id == findHoldReleaseData) {
                          return {
                            ...item,
                            finalusersalary: item.salarytype == "Final Salary" ? item.finalsalary : item.salarytype === "Fixed Salary" ? item.fixedsalary : item.prodsalary,

                            holdsalaryconfirm: "No",
                            status: d.status,
                            innerId: d.innerId,
                            outerId: d.outerId,
                            payyear: d.payear,
                            paymonth: d.paymonth,
                            paydate: d.paydate,
                            statuspage: d.statuspage,
                          };
                        } else {
                          return d;
                        }
                      });
                    } else {
                      logdatas = [
                        {
                          status: "holdrelease",
                          statuspage: "fixsalary",
                          companyname: item.companyname,
                          innerId: item._id,
                          outerId: oldrerunDataDirect._outerId,
                          company: item.company,
                          branch: item.branch,
                          unit: item.unit,
                          team: item.team,
                          empcode: item.empcode,
                          department: item.department,
                          legalname: item.legalname,
                          designation: item.designation,
                          totalnumberofdays: item.totalnumberofdays,
                          totalshift: item.totalshift,

                          totalasbleave: item.totalasbleave,
                          totalpaidDays: item.totalpaidDays,
                          targetpoints: item.targetpoints,
                          clsl: item.clsl,
                          acheivedpoints: item.acheivedpoints,
                          acheivedpercent: item.acheivedpercent,
                          currentmonthavg: item.currentmonthavg,
                          currentmonthattendance: item.currentmonthattendance,

                          bankname: item.bankname,
                          accountholdername: item.accountholdername,
                          ifsccode: item.ifsccode,
                          penaltyamount: item.penaltyamount,
                          releaseamount: item.releaseamount,
                          otherdeductionamount: item.otherdeductionamount,
                          totalexcess: item.totalexcess,
                          totaladvance: item.totaladvance,
                          payamount: item.payamount,
                          balanceamount: item.balanceamount,
                          paidstatus: item.paidstatus,
                          approvedby: item.approvedby,
                          description: item.description,
                          recheckreason: item.recheckreason,
                          updatedpaidstatus: item.updatedpaidstatus,
                          updatechangedate: item.updatechangedate,
                          payonsalarytype: item.payonsalarytype,

                          finalusersalary: item.salarytype == "Final Salary" ? item.finalsalary : item.salarytype === "Fixed Salary" ? item.fixedsalary : item.prodsalary,
                          holdsalaryconfirm: "No",
                          payyear: oldrerunDataDirect.selectedyear,
                          paymonth: oldrerunDataDirect.selectedmonth,
                          paydate: "",
                        },
                        ...oldItem?.logdata,
                      ];
                    }
                    // console.log(logdatas, 'logdatas');
                    return oldItem ? { ...oldItem, changestatus: "Data in Bank Release", isvaluechanges: "Data in Bank Release", logdata: logdatas } : item;
                  } else if (item.changestatus == "+/- Amount differ" && findIsBankStatusCreated && !findIsBankStatusClosed) {
                    return { ...item, changestatus: "Data in Bank Prepation was removed", isvaluechanges: "Data in Bank Prepation was removed", sentfixsalary: "Yes", logdata: [], fixsalarydateconfirm: "", fixholdsalarydateconfirm: "" };
                  } else {
                    // If changestatus is not "Amount Differ", update the item to set sentfixsalary: "Yes" if needed
                    return { ...item, changestatus: item.changestatus, isvaluechanges: item.isvaluechanges, sentfixsalary: "Yes", logdata: [], fixsalarydateconfirm: "", fixholdsalarydateconfirm: "" };
                  }
                });

                if (finalDataOnlyAboveHundred.some((d) => d.isvaluechanges === "Data in Bank Prepation was removed")) {
                  const oldItems = oldrerunDataDirect.data.filter((oldItem) => oldItem.logdata.some((item) => item.bankreleasestatus == "created"));

                  let bankreleasedata = oldItems;
                  setBankReleaseDatas(bankreleasedata);
                  handleBankRleasePopOpen();
                  setOldDataCheck(oldrerunDataDirect);
                  setnewRerunData(finalDataOnlyAboveHundred);
                  setMonthSetDatasBank(result.monthSets);
                } else {
                  handleProgressUpdate(100, "Creating...");
                  handleLoaderDialogOpen();
                  const datasplitted = Object.values(
                    finalDataOnlyAboveHundred.reduce((acc, item) => {
                      const { department } = item;
                      if (!acc[department]) {
                        acc[department] = { department, data: [] };
                      }
                      acc[department].data.push({ ...item });
                      return acc;
                    }, {})
                  );

                  setLoaderData(datasplitted[0].data);
                  // setLoaderData(findDifferences(oldrerunData, datasplitted).data)

                  updateDataCheckDirect(datasplitted, result.monthSets, oldrerunDataDirect);
                  handleLoaderDialogClose();
                  setBankdetail(false);
                }
              } catch (err) {
                handleLoaderDialogClose();
                console.log(err, "err");
                handleApiError(err, setShowAlert, handleClickOpenerr);
              }
            });
          })
          .catch((err) => {
            handleLoaderDialogClose();
            // console.error('Error in getting all results:', error);
          });
      }
    } catch (err) {
      console.log(err, "err");
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const updateDataCheckDirect = async (data, monthSetDatas, oldrerunDataDirect) => {
    try {
      console.log(data, "data");
      let findSelectedMonthNum = months.find((d) => d.value === oldrerunDataDirect.month).numval;
      const esinotdeductionemployees = data
        .flatMap((item) => item.data)
        .filter((d) => Number(d.esideduction) == 0 && d.pfvalues.esideduction === true)
        .map((item) => ({ companyname: item.companyname, _id: item._id, empcode: item.empcode }));

      if (data.length > 0) {
        data?.map((d) => {
          let selectedmonthnumalter = Number(findSelectedMonthNum) <= 9 ? `0${Number(findSelectedMonthNum)}` : findSelectedMonthNum;

          let selectedMonStartDate = oldrerunDataDirect.year + "-" + selectedmonthnumalter + "-01";

          let findexp = monthSetDatas.find((item) => d.department === item.department);
          let findDate = findexp ? findexp.fromdate : selectedMonStartDate;

          //FIND SELECTEDMONTH MONTH END DATE
          const nextMonthFirstDay = new Date(Number(oldrerunDataDirect.year), Number(findSelectedMonthNum), 1);

          // Subtract one day to get the last day of the given month
          const lastDate = new Date(nextMonthFirstDay - 1);

          let lastdateOfSelectedMonth = lastDate.getDate();
          let selectedMonEndDate = `${oldrerunDataDirect.year}-${selectedmonthnumalter}-${lastdateOfSelectedMonth}`;
          let findmonthenddate = findexp ? findexp.todate : selectedMonEndDate;

          return axios.put(`${SERVICE.PAYRUNLIST_SINGLE}/${oldrerunDataDirect._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            department: String(d.department),
            data: d.data,

            from: findDate,
            to: findmonthenddate,
            empcount: d.data.length,
            month: String(oldrerunDataDirect.month),
            year: Number(oldrerunDataDirect.year),
            generatedon: String(new Date()),
            addedby: [
              {
                name: String(isUserRoleAccess.username),
                date: String(new Date()),
              },
            ],
            updatedby: [
              ...oldrerunDataDirect.updatedby,
              {
                name: String(isUserRoleAccess.username),
                date: String(new Date()),
              },
            ],
          });
        });
        if (esinotdeductionemployees.length > 0) {
          setSelectAll(false);
          setSelectedRowsEsi([]);
          handleOpenESINoDed();
          setESINoDedEmps(esinotdeductionemployees);
        }
        await fetchPayRunList();
      }
    } catch (err) {
      console.log(err, "err");
      setBankdetail(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [newRerunData, setnewRerunData] = useState([]);
  const [oldDataCheck, setOldDataCheck] = useState();
  const [getMonthSetDatasBank, setMonthSetDatasBank] = useState([]);
  const [bankReleaseDatas, setBankReleaseDatas] = useState([]);

  const hanleBankReleaseDataRemove = () => {
    handleBankRleasePopClose();

    let finalDataOnlyAboveHundred = newRerunData.map((item) => {
      const oldItem = bankReleaseDatas.find((oldItem) => oldItem.companyname === item.companyname && oldItem.empcode === item.empcode);

      let findIsBankStatusCreated = oldItem?.logdata && oldItem?.logdata?.length > 0 ? oldItem?.logdata?.some((item) => item.bankreleasestatus == "created") : false;

      if (findIsBankStatusCreated) {
        return { ...item, changestatus: "Data in Bank Prepation was removed", isvaluechanges: "Data in Bank Prepation was removed", sentfixsalary: "Yes", logdata: [], fixsalarydateconfirm: "", fixholdsalarydateconfirm: "" };
      } else {
        // If changestatus is not "Amount Differ", update the item to set sentfixsalary: "Yes" if needed
        return item;
      }
    });

    const datasplitted = Object.values(
      finalDataOnlyAboveHundred.reduce((acc, item) => {
        const { department } = item;
        if (!acc[department]) {
          acc[department] = { department, data: [] };
        }
        acc[department].data.push({ ...item });
        return acc;
      }, {})
    );

    //
    setLoaderData(datasplitted[0].data);

    updateDataCheckDirect(datasplitted, getMonthSetDatasBank, oldDataCheck);
  };
  const hanleBankReleaseDataNotRemove = () => {
    handleBankRleasePopClose();

    let finalDataOnlyAboveHundred = newRerunData.map((item) => {
      const oldItem = bankReleaseDatas.find((oldItem) => oldItem.companyname === item.companyname && oldItem.empcode === item.empcode);

      let findIsBankStatusCreated = oldItem?.logdata && oldItem?.logdata?.length > 0 ? oldItem?.logdata?.some((item) => item.bankreleasestatus == "created") : false;

      if (findIsBankStatusCreated) {
        let findHoldReleaseData = oldItem?.logdata.some((data) => data.status == "holdrelease" && data.holdsalaryconfirm != "Yes") ? oldItem?.logdata.find((data) => data.status == "holdrelease" && data.holdsalaryconfirm != "Yes")._id : "";

        let logdatas = [];
        if (findHoldReleaseData != "") {
          logdatas = oldItem.logdata.map((d) => {
            if (d._id == findHoldReleaseData) {
              return {
                ...item,
                finalusersalary: item.salarytype == "Final Salary" ? item.finalsalary : item.salarytype === "Fixed Salary" ? item.fixedsalary : item.prodsalary,

                holdsalaryconfirm: "No",
                status: d.status,
                innerId: d.innerId,
                outerId: d.outerId,
                payyear: d.payear,
                paymonth: d.paymonth,
                paydate: d.paydate,
                statuspage: d.statuspage,
              };
            } else {
              return d;
            }
          });
        } else {
          logdatas = [
            {
              status: "holdrelease",
              statuspage: "fixsalary",
              companyname: item.companyname,
              innerId: item._id,
              outerId: oldrerunData.outerId,
              company: item.company,
              branch: item.branch,
              unit: item.unit,
              team: item.team,
              empcode: item.empcode,
              department: item.department,
              legalname: item.legalname,
              designation: item.designation,
              totalnumberofdays: item.totalnumberofdays,
              totalshift: item.totalshift,

              totalasbleave: item.totalasbleave,
              totalpaidDays: item.totalpaidDays,
              targetpoints: item.targetpoints,
              clsl: item.clsl,
              acheivedpoints: item.acheivedpoints,
              acheivedpercent: item.acheivedpercent,
              currentmonthavg: item.currentmonthavg,
              currentmonthattendance: item.currentmonthattendance,

              bankname: item.bankname,
              accountholdername: item.accountholdername,
              ifsccode: item.ifsccode,
              penaltyamount: item.penaltyamount,
              releaseamount: item.releaseamount,
              otherdeductionamount: item.otherdeductionamount,
              totalexcess: item.totalexcess,
              totaladvance: item.totaladvance,
              payamount: item.payamount,
              balanceamount: item.balanceamount,
              paidstatus: item.paidstatus,
              approvedby: item.approvedby,
              description: item.description,
              recheckreason: item.recheckreason,
              updatedpaidstatus: item.updatedpaidstatus,
              updatechangedate: item.updatechangedate,
              payonsalarytype: item.payonsalarytype,

              finalusersalary: item.salarytype == "Final Salary" ? item.finalsalary : item.salarytype === "Fixed Salary" ? item.fixedsalary : item.prodsalary,
              holdsalaryconfirm: "No",
              payyear: oldrerunData.selectedyear,
              paymonth: oldrerunData.selectedmonth,
              paydate: "",
            },
            ...oldItem?.logdata,
          ];
        }

        return { ...oldItem, changestatus: "Data in Bank Prepation is Not removed", isvaluechanges: "Data in Bank Prepation is Not removed", logdata: logdatas };
      } else {
        // If changestatus is not "Amount Differ", update the item to set sentfixsalary: "Yes" if needed
        return item;
      }
    });

    const datasplitted = Object.values(
      finalDataOnlyAboveHundred.reduce((acc, item) => {
        const { department } = item;
        if (!acc[department]) {
          acc[department] = { department, data: [] };
        }
        acc[department].data.push({ ...item });
        return acc;
      }, {})
    );

    setLoaderData(datasplitted[0].data);
    // setLoaderData(findDifferences(oldrerunData, datasplitted).data)

    updateDataCheckDirect(datasplitted, getMonthSetDatasBank, oldDataCheck);
  };
  const hanleBankReleaseDataRemoveAllEmp = () => {
    handleBankRleasePopCloseAllEmp();

    let finalDataOnlyAboveHundred = newRerunData.map((item) => {
      const oldItem = bankReleaseDatas.find((oldItem) => oldItem.companyname === item.companyname && oldItem.empcode === item.empcode);

      let findIsBankStatusCreated = oldItem?.logdata && oldItem?.logdata?.length > 0 ? oldItem?.logdata?.some((item) => item.bankreleasestatus == "created") : false;

      if (findIsBankStatusCreated) {
        return { ...item, changestatus: "Data in Bank Prepation was removed", isvaluechanges: "Data in Bank Prepation was removed", sentfixsalary: "Yes", logdata: [], fixsalarydateconfirm: "", fixholdsalarydateconfirm: "" };
      } else {
        // If changestatus is not "Amount Differ", update the item to set sentfixsalary: "Yes" if needed
        return item;
      }
    });

    const datasplitted = Object.values(
      finalDataOnlyAboveHundred.reduce((acc, item) => {
        const { department } = item;
        if (!acc[department]) {
          acc[department] = { department, data: [] };
        }
        acc[department].data.push({ ...item });
        return acc;
      }, {})
    );

    //
    setLoaderData(datasplitted[0].data);

    updateDataCheckDirect(datasplitted, getMonthSetDatasBank, oldDataCheck);
  };
  const hanleBankReleaseDataNotRemoveAllEmp = () => {
    handleBankRleasePopCloseAllEmp();

    let finalDataOnlyAboveHundred = newRerunData.map((item) => {
      const oldItem = bankReleaseDatas.find((oldItem) => oldItem.companyname === item.companyname && oldItem.empcode === item.empcode);

      let findIsBankStatusCreated = oldItem?.logdata && oldItem?.logdata?.length > 0 ? oldItem?.logdata?.some((item) => item.bankreleasestatus == "created") : false;

      if (findIsBankStatusCreated) {
        let findHoldReleaseData = oldItem?.logdata.some((data) => data.status == "holdrelease" && data.holdsalaryconfirm != "Yes") ? oldItem?.logdata.find((data) => data.status == "holdrelease" && data.holdsalaryconfirm != "Yes")._id : "";

        let logdatas = [];
        if (findHoldReleaseData != "") {
          logdatas = oldItem.logdata.map((d) => {
            if (d._id == findHoldReleaseData) {
              return {
                ...item,
                finalusersalary: item.salarytype == "Final Salary" ? item.finalsalary : item.salarytype === "Fixed Salary" ? item.fixedsalary : item.prodsalary,

                holdsalaryconfirm: "No",
                status: d.status,
                innerId: d.innerId,
                outerId: d.outerId,
                payyear: d.payear,
                paymonth: d.paymonth,
                paydate: d.paydate,
                statuspage: d.statuspage,
              };
            } else {
              return d;
            }
          });
        } else {
          logdatas = [
            {
              status: "holdrelease",
              statuspage: "fixsalary",
              companyname: item.companyname,
              innerId: item._id,
              outerId: oldrerunData.outerId,
              company: item.company,
              branch: item.branch,
              unit: item.unit,
              team: item.team,
              empcode: item.empcode,
              department: item.department,
              legalname: item.legalname,
              designation: item.designation,
              totalnumberofdays: item.totalnumberofdays,
              totalshift: item.totalshift,

              totalasbleave: item.totalasbleave,
              totalpaidDays: item.totalpaidDays,
              targetpoints: item.targetpoints,
              clsl: item.clsl,
              acheivedpoints: item.acheivedpoints,
              acheivedpercent: item.acheivedpercent,
              currentmonthavg: item.currentmonthavg,
              currentmonthattendance: item.currentmonthattendance,

              bankname: item.bankname,
              accountholdername: item.accountholdername,
              ifsccode: item.ifsccode,
              penaltyamount: item.penaltyamount,
              releaseamount: item.releaseamount,
              otherdeductionamount: item.otherdeductionamount,
              totalexcess: item.totalexcess,
              totaladvance: item.totaladvance,
              payamount: item.payamount,
              balanceamount: item.balanceamount,
              paidstatus: item.paidstatus,
              approvedby: item.approvedby,
              description: item.description,
              recheckreason: item.recheckreason,
              updatedpaidstatus: item.updatedpaidstatus,
              updatechangedate: item.updatechangedate,
              payonsalarytype: item.payonsalarytype,

              finalusersalary: item.salarytype == "Final Salary" ? item.finalsalary : item.salarytype === "Fixed Salary" ? item.fixedsalary : item.prodsalary,
              holdsalaryconfirm: "No",
              payyear: oldrerunData.selectedyear,
              paymonth: oldrerunData.selectedmonth,
              paydate: "",
            },
            ...oldItem?.logdata,
          ];
        }

        return { ...oldItem, changestatus: "Data in Bank Prepation is Not removed", isvaluechanges: "Data in Bank Prepation is Not removed", logdata: logdatas };
      } else {
        // If changestatus is not "Amount Differ", update the item to set sentfixsalary: "Yes" if needed
        return item;
      }
    });

    const datasplitted = Object.values(
      finalDataOnlyAboveHundred.reduce((acc, item) => {
        const { department } = item;
        if (!acc[department]) {
          acc[department] = { department, data: [] };
        }
        acc[department].data.push({ ...item });
        return acc;
      }, {})
    );

    setLoaderData(datasplitted[0].data);
    // setLoaderData(findDifferences(oldrerunData, datasplitted).data)

    updateDataCheck(datasplitted, getMonthSetDatasBank, oldDataCheck);
  };

  const hanleBankReleaseDataRemoveWithoutEdit = () => {
    handleBankRleasePopCloseWithoutEdit();
    let finalDataOnlyAboveHundred = newRerunData.map((item) => {
      const oldItem = bankReleaseDatas.find((oldItem) => oldItem.companyname === item.companyname && oldItem.empcode === item.empcode);

      let findIsBankStatusCreated = oldItem?.logdata && oldItem?.logdata?.length > 0 ? oldItem?.logdata?.some((item) => item.bankreleasestatus == "created") : false;

      if (findIsBankStatusCreated) {
        return { ...item, changestatus: "Data in Bank Prepation was removed", isvaluechanges: "Data in Bank Prepation was removed", sentfixsalary: "Yes", logdata: [], fixsalarydateconfirm: "", fixholdsalarydateconfirm: "" };
      } else {
        // If changestatus is not "Amount Differ", update the item to set sentfixsalary: "Yes" if needed
        return item;
      }
    });

    const datasplitted = Object.values(
      finalDataOnlyAboveHundred.reduce((acc, item) => {
        const { department } = item;
        if (!acc[department]) {
          acc[department] = { department, data: [] };
        }
        acc[department].data.push({ ...item });
        return acc;
      }, {})
    );

    //
    setLoaderData(datasplitted[0].data);

    updateDataCheckWithoutEdit(datasplitted, getMonthSetDatasBank, oldDataCheck);
  };
  const hanleBankReleaseDataNotRemoveWithoutEdit = () => {
    handleBankRleasePopCloseWithoutEdit();

    let finalDataOnlyAboveHundred = newRerunData.map((item) => {
      const oldItem = bankReleaseDatas.find((oldItem) => oldItem.companyname === item.companyname && oldItem.empcode === item.empcode);

      let findIsBankStatusCreated = oldItem?.logdata && oldItem?.logdata?.length > 0 ? oldItem?.logdata?.some((item) => item.bankreleasestatus == "created") : false;

      if (findIsBankStatusCreated) {
        let findHoldReleaseData = oldItem?.logdata.some((data) => data.status == "holdrelease" && data.holdsalaryconfirm != "Yes") ? oldItem?.logdata.find((data) => data.status == "holdrelease" && data.holdsalaryconfirm != "Yes")._id : "";

        let logdatas = [];
        if (findHoldReleaseData != "") {
          logdatas = oldItem.logdata.map((d) => {
            if (d._id == findHoldReleaseData) {
              return {
                ...item,
                finalusersalary: item.salarytype == "Final Salary" ? item.finalsalary : item.salarytype === "Fixed Salary" ? item.fixedsalary : item.prodsalary,

                holdsalaryconfirm: "No",
                status: d.status,
                innerId: d.innerId,
                outerId: d.outerId,
                payyear: d.payear,
                paymonth: d.paymonth,
                paydate: d.paydate,
                statuspage: d.statuspage,
              };
            } else {
              return d;
            }
          });
        } else {
          logdatas = [
            {
              status: "holdrelease",
              statuspage: "fixsalary",
              companyname: item.companyname,
              innerId: item._id,
              outerId: oldrerunData.outerId,
              company: item.company,
              branch: item.branch,
              unit: item.unit,
              team: item.team,
              empcode: item.empcode,
              department: item.department,
              legalname: item.legalname,
              designation: item.designation,
              totalnumberofdays: item.totalnumberofdays,
              totalshift: item.totalshift,

              totalasbleave: item.totalasbleave,
              totalpaidDays: item.totalpaidDays,
              targetpoints: item.targetpoints,
              clsl: item.clsl,
              acheivedpoints: item.acheivedpoints,
              acheivedpercent: item.acheivedpercent,
              currentmonthavg: item.currentmonthavg,
              currentmonthattendance: item.currentmonthattendance,

              bankname: item.bankname,
              accountholdername: item.accountholdername,
              ifsccode: item.ifsccode,
              penaltyamount: item.penaltyamount,
              releaseamount: item.releaseamount,
              otherdeductionamount: item.otherdeductionamount,
              totalexcess: item.totalexcess,
              totaladvance: item.totaladvance,
              payamount: item.payamount,
              balanceamount: item.balanceamount,
              paidstatus: item.paidstatus,
              approvedby: item.approvedby,
              description: item.description,
              recheckreason: item.recheckreason,
              updatedpaidstatus: item.updatedpaidstatus,
              updatechangedate: item.updatechangedate,
              payonsalarytype: item.payonsalarytype,

              finalusersalary: item.salarytype == "Final Salary" ? item.finalsalary : item.salarytype === "Fixed Salary" ? item.fixedsalary : item.prodsalary,
              holdsalaryconfirm: "No",
              payyear: oldrerunData.selectedyear,
              paymonth: oldrerunData.selectedmonth,
              paydate: "",
            },
            ...oldItem?.logdata,
          ];
        }

        return { ...oldItem, changestatus: "Data in Bank Prepation is Not removed", isvaluechanges: "Data in Bank Prepation is Not removed", logdata: logdatas };
      } else {
        // If changestatus is not "Amount Differ", update the item to set sentfixsalary: "Yes" if needed
        return item;
      }
    });

    const datasplitted = Object.values(
      finalDataOnlyAboveHundred.reduce((acc, item) => {
        const { department } = item;
        if (!acc[department]) {
          acc[department] = { department, data: [] };
        }
        acc[department].data.push({ ...item });
        return acc;
      }, {})
    );

    setLoaderData(datasplitted[0].data);
    // setLoaderData(findDifferences(oldrerunData, datasplitted).data)

    updateDataCheckWithoutEdit(datasplitted, getMonthSetDatasBank, oldDataCheck);
  };

  //ALL EMPLOYEE RERRUN WIHTOUT EDIT VALUES
  const handleRerunSubmit = async () => {
    setIsLoadStart(true);
    // setLoaderData(oldrerunData.data.map(item => ({ ...item, isvaluechanges: "Please Wait..." })));

    handleCloseModRerun();
    let res = await axios.post(SERVICE.USER_PAYRUNDATA_LIMITED_FINAL, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },

      // employees: oldrerunData.data.map(item => item.companyname),
      department: [oldrerunData.department],
      month: String(oldrerunData.month),
      year: String(oldrerunData.year),
    });
    let employeelistnames = res.data.users.length > 0 ? [...new Set(res.data.users.map((item) => item.companyname))] : [];
    let findSelectedMonthNum = months.find((d) => d.value === oldrerunData.month).numval;
    if (res.data.users.length > 0) {
      const resultarr = splitArray(employeelistnames, 5, findSelectedMonthNum, oldrerunData.year);
      const resultarr2 = splitArray2(employeelistnames, 5, findSelectedMonthNum, oldrerunData.year);
      // console.log(resultarr, resultarr2)

      let res_applyleave = await axios.post(SERVICE.APPLYLEAVE_APPROVED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        status: String("Approved"),
      });
      let leaveresult = res_applyleave?.data?.applyleaves;

      async function sendBatchRequest(batch) {
        try {
          let res_usershift = await axios.post(SERVICE.USER_ATTENDANCE_PAYRUN, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            department: oldrerunData.department,
            employees: batch.data,
            ismonth: batch.month,
            isyear: batch.year,
          });
          const filteredBatch = res_usershift?.data?.finaluser?.filter((d) => {
            const [day, month, year] = d.rowformattedDate.split("/");
            const formattedDate = new Date(`${year}-${month}-${day}`);
            const reasonDate = new Date(d.reasondate);
            const dojDate = new Date(d.doj);

            if (d.reasondate && d.reasondate !== "") {
              return formattedDate >= dojDate && formattedDate <= reasonDate;
            } else if (d.doj && d.doj !== "") {
              return formattedDate >= dojDate;
            } else {
              return d;
            }
          });

          let filtered = filteredBatch;
          let countByEmpcodeClockin = {}; // Object to store count for each empcode
          let countByEmpcodeClockout = {};
          let result = filtered.flatMap((item, index) => {
            // Initialize count for empcode if not already present
            if (!countByEmpcodeClockin[item.empcode]) {
              countByEmpcodeClockin[item.empcode] = 1;
            }
            if (!countByEmpcodeClockout[item.empcode]) {
              countByEmpcodeClockout[item.empcode] = 1;
            }

            // Adjust clockinstatus based on lateclockincount
            let updatedClockInStatus = item.clockinstatus;
            // Adjust clockoutstatus based on earlyclockoutcount
            let updatedClockOutStatus = item.clockoutstatus;

            // Filter out only 'Absent' items for the current employee
            const absentItems = filtered?.filter((d) => d.clockinstatus === "Absent" && item.empcode === d.empcode && d.clockin === "00:00:00" && d.clockout === "00:00:00");

            // Check if the day before and after a 'Week Off' date is marked as 'Leave' or 'Absent'
            if (item.clockinstatus === "Week Off" && item.clockoutstatus === "Week Off") {
              // Define the date format for comparison
              const itemDate = moment(item.rowformattedDate, "DD/MM/YYYY");

              const isPreviousDayLeave = leaveresult.some((leaveItem) => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, "days"), "day") && leaveItem.empcode === item.empcode);
              const isPreviousDayAbsent = absentItems.some((absentItem) => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, "days"), "day") && absentItem.empcode === item.empcode);

              const isNextDayLeave = leaveresult.some((leaveItem) => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().add(1, "days"), "day") && leaveItem.empcode === item.empcode);
              const isNextDayAbsent = absentItems.some((absentItem) => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().add(1, "days"), "day") && absentItem.empcode === item.empcode);

              if (isPreviousDayLeave) {
                updatedClockInStatus = "BeforeWeekOffLeave";
                updatedClockOutStatus = "BeforeWeekOffLeave";
              }
              if (isPreviousDayAbsent) {
                updatedClockInStatus = "BeforeWeekOffAbsent";
                updatedClockOutStatus = "BeforeWeekOffAbsent";
              }
              if (isNextDayLeave) {
                updatedClockInStatus = "AfterWeekOffLeave";
                updatedClockOutStatus = "AfterWeekOffLeave";
              }
              if (isNextDayAbsent) {
                updatedClockInStatus = "AfterWeekOffAbsent";
                updatedClockOutStatus = "AfterWeekOffAbsent";
              }
            }

            // Check if 'Late - ClockIn' count exceeds the specified limit
            if (updatedClockInStatus === "Late - ClockIn") {
              updatedClockInStatus = `${countByEmpcodeClockin[item.empcode]}Late - ClockIn`;
              countByEmpcodeClockin[item.empcode]++; // Increment count for current empcode
            }
            // Check if 'Early - ClockOut' count exceeds the specified limit
            if (updatedClockOutStatus === "Early - ClockOut") {
              updatedClockOutStatus = `${countByEmpcodeClockout[item.empcode]}Early - ClockOut`;
              countByEmpcodeClockout[item.empcode]++; // Increment count for current empcode
            }

            return {
              ...item,
              shiftallot: item.shiftallot,
              weekOffDates: item.weekOffDates,
              clockinstatus: updatedClockInStatus,
              clockoutstatus: updatedClockOutStatus,
            };
          });
          const itemsWithSerialNumber = result?.map((item, index) => ({
            ...item,
            shiftmode: item.shiftMode,
            uniqueid: item.id,
            userid: item.userid,
            totalnumberofdays: item.totalnumberofdays,
            empshiftdays: item.empshiftdays,
            totalcounttillcurrendate: item.totalcounttillcurrendate,
            totalshift: item.totalshift,
            attendanceauto: getattendancestatus(item),
            daystatus: item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item),
            appliedthrough: getAttModeAppliedThr(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
            lop: getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
            loptype: getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
            lopcalculation: getFinalLop(getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)), getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item))),
            lopcount: getCount(getFinalLop(getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)), getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)))),
            modetarget: getAttModeTarget(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
            paidpresentbefore: getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
            paidleavetype: getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
            paidpresent: getFinalPaid(getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)), getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item))),
            lopday: getAssignLeaveDayForLop(getFinalLop(getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)), getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)))),
            paidpresentday: getAssignLeaveDayForPaid(getFinalPaid(getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)), getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)))),
          }));

          const weekOption = ["BeforeWeekOffAbsent", "AfterWeekOffAbsent", "BeforeWeekOffLeave", "AfterWeekOffLeave"];
          itemsWithSerialNumber.forEach((item, index, array) => {
            if (attStatusOption.includes(item.daystatus) && item.clockin === "00:00:00" && item.clockout === "00:00:00" && item.paidpresent === "Yes - Full Day") {
              const previousItem = array[index - 1];
              const nextItem = array[index + 1];

              const hasRelevantStatus = (entry) => entry && (weekOption.includes(entry.clockinstatus) || (weekOption.includes(entry.clockoutstatus) && entry.shift === "Week Off"));

              // if (hasRelevantStatus(previousItem)) {
              //     previousItem.clockinstatus = 'Week Off';
              //     previousItem.clockoutstatus = 'Week Off';
              //     previousItem.attendanceauto = getattendancestatus(previousItem);
              //     previousItem.daystatus = previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem);
              // }
              // if (hasRelevantStatus(nextItem)) {
              //     nextItem.clockinstatus = 'Week Off';
              //     nextItem.clockoutstatus = 'Week Off';
              //     nextItem.attendanceauto = getattendancestatus(nextItem);
              //     nextItem.daystatus = nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem);
              // }
              if (hasRelevantStatus(previousItem)) {
                previousItem.clockinstatus = "Week Off";
                previousItem.clockoutstatus = "Week Off";
                previousItem.attendanceauto = getattendancestatus(previousItem);
                previousItem.daystatus = previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem);
                previousItem.appliedthrough = getAttModeAppliedThr(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                previousItem.lop = getAttModeLop(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                previousItem.loptype = getAttModeLopType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                previousItem.lopcalculation = getFinalLop(getAttModeLop(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)), getAttModeLopType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)));
                previousItem.lopcount = getCount(getFinalLop(getAttModeLop(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)), getAttModeLopType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem))));
                previousItem.modetarget = getAttModeTarget(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                previousItem.paidpresentbefore = getAttModePaidPresent(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                previousItem.paidleavetype = getAttModePaidPresentType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                previousItem.paidpresent = getFinalPaid(getAttModePaidPresent(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)), getAttModePaidPresentType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)));
                previousItem.lopday = getAssignLeaveDayForLop(getFinalLop(getAttModeLop(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)), getAttModeLopType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem))));
                previousItem.paidpresentday = getAssignLeaveDayForPaid(getFinalPaid(getAttModePaidPresent(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)), getAttModePaidPresentType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem))));
              }
              if (hasRelevantStatus(nextItem)) {
                nextItem.clockinstatus = "Week Off";
                nextItem.clockoutstatus = "Week Off";
                nextItem.attendanceauto = getattendancestatus(nextItem);
                nextItem.daystatus = nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem);
                nextItem.appliedthrough = getAttModeAppliedThr(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                nextItem.lop = getAttModeLop(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                nextItem.loptype = getAttModeLopType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                nextItem.lopcalculation = getFinalLop(getAttModeLop(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)), getAttModeLopType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)));
                nextItem.lopcount = getCount(getFinalLop(getAttModeLop(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)), getAttModeLopType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem))));
                nextItem.modetarget = getAttModeTarget(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                nextItem.paidpresentbefore = getAttModePaidPresent(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                nextItem.paidleavetype = getAttModePaidPresentType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                nextItem.paidpresent = getFinalPaid(getAttModePaidPresent(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)), getAttModePaidPresentType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)));
                nextItem.lopday = getAssignLeaveDayForLop(getFinalLop(getAttModeLop(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)), getAttModeLopType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem))));
                nextItem.paidpresentday = getAssignLeaveDayForPaid(getFinalPaid(getAttModePaidPresent(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)), getAttModePaidPresentType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem))));
              }
            }
          });

          const finalresult = [];

          itemsWithSerialNumber.forEach((item) => {
            // console.log(item, "item");
            const leaveOnDateApproved = leaveresult.find((d) => d.date === item.rowformattedDate && d.empcode === item.empcode);

            const existingEntryIndex = finalresult.findIndex((entry) => entry.empcode === item.empcode);

            if (existingEntryIndex !== -1) {
              if (item.shift !== "Not Allotted") {
                finalresult[existingEntryIndex].shift++;
              }
              if ((item.clockinstatus === "Week Off" && item.clockoutstatus === "Week Off" && item.clockin === "00:00:00" && item.clockout === "00:00:00") || (item.daystatus === "MWEEKOFF" && item.paidpresent === "Yes - Full Day")) {
                finalresult[existingEntryIndex].weekoff++;
              }

              if (item.clockinstatus === "Holiday" && item.clockoutstatus === "Holiday") {
                finalresult[existingEntryIndex].holidayCount++;
              }
              if (item.shift === "Week Off") {
                finalresult[existingEntryIndex].weekoffall++;
              }
              if (item.clockinstatus === "DLOP" && item.clockoutstatus === "DLOP") {
                finalresult[existingEntryIndex].dlob++;
              }
              if (["MPRESENT", "PRESENT"].includes(item.daystatus) && ["MPRESENT", "PRESENT"].includes(item.daystatus)) {
                finalresult[existingEntryIndex].present++;
              }
              // if (item.clockinstatus === 'Leave' && item.clockoutstatus === 'Leave') {
              //     finalresult[existingEntryIndex].leaveCount++;
              // }
              if (leaveOnDateApproved) {
                // if ((item.clockinstatus === `${leaveOnDateApproved.code} ${leaveOnDateApproved.status}`) && (item.clockoutstatus === `${leaveOnDateApproved.code} ${leaveOnDateApproved.status}`)) {
                finalresult[existingEntryIndex].leaveCount++;
                // }
              }
              if (item.lopcalculation === "Yes - Double Day") {
                finalresult[existingEntryIndex].doublelopcount++;
              }

              if (item.lopcalculation === "Yes - Double Half Day") {
                finalresult[existingEntryIndex].doublehalflopcount++;
              }

              if (item.clockinstatus !== "Not Allotted" && item.clockoutstatus !== "Not Allotted" && item.attendanceauto === undefined && item.daystatus === undefined) {
                finalresult[existingEntryIndex].nostatuscount++;
              }

              finalresult[existingEntryIndex].lopcount = String(parseFloat(finalresult[existingEntryIndex].lopcount) + parseFloat(item.lopcount));
              finalresult[existingEntryIndex].paidpresentday = String(parseFloat(finalresult[existingEntryIndex].paidpresentday) + parseFloat(item.paidpresentday));
            } else {
              const newItem = {
                id: item.id,
                empcode: item.empcode,
                username: item.username,
                company: item.company,
                branch: item.branch,
                unit: item.unit,
                team: item.team,
                department: item.department,
                totalnumberofdays: item.totalnumberofdays,
                empshiftdays: item.empshiftdays,
                //  shift: (item.clockinstatus !== 'Not Allotted' && item.clockoutstatus !== 'Not Allotted' && item.clockin === '00:00:00' && item.clockout === '00:00:00') ? 1 : 0,

                shift: 1,

                // weekoff: item.weekoffCount,
                weekoff: item.clockinstatus === "Week Off" && item.clockoutstatus === "Week Off" && item.clockin === "00:00:00" && item.clockout === "00:00:00" ? 1 : 0,
                lopcount: item.lopcount,

                paidpresentday: item.paidpresentday,
                totalcounttillcurrendate: item.totalcounttillcurrendate,
                totalshift: item.totalshift,
                holidayCount: item.clockinstatus === "Holiday" && item.clockoutstatus === "Holiday" ? 1 : 0,
                // leaveCount: (item.clockinstatus === 'Leave' && item.clockoutstatus === 'Leave') ? 1 : 0,
                // leaveCount: leaveOnDateApproved ? ((item.clockinstatus === `${leaveOnDateApproved && leaveOnDateApproved.code} ${leaveOnDateApproved && leaveOnDateApproved.status}`) && (item.clockoutstatus === `${leaveOnDateApproved && leaveOnDateApproved.code} ${leaveOnDateApproved && leaveOnDateApproved.status}`) ? 1 : 0) : 0,
                leaveCount: leaveOnDateApproved ? 1 : 0,
                clsl: 0,
                holiday: 0,
                totalpaiddays: 0,
                nostatus: 0,

                // nostatuscount: item.paidpresent === 'No' && item.modetarget === 'No' && item.lopcalculation === 'No' ? 1 : 0,
                nostatuscount: item.clockinstatus !== "Not Allotted" && item.clockoutstatus !== "Not Allotted" && item.paidpresent === "No" && item.modetarget === "No" && item.lopcalculation === "No" ? 1 : 0,
                weekoffall: item.shift === "Week Off" ? 1 : 0,
                present: ["MPRESENT", "PRESENT"].includes(item.daystatus) && ["MPRESENT", "PRESENT"].includes(item.daystatus) ? 1 : 0,
                dlob: item.clockinstatus === "DLOP" && item.clockoutstatus === "DLOP" ? 1 : 0,
                doublelopcount: item.lopcalculation === "Yes - Double Day" ? 1 : 0,
                doublehalflopcount: item.lopcalculation === "Double Half Day" ? 0.5 : 0,
              };
              finalresult.push(newItem);
            }
          });
          let resultdata = finalresult?.map((item, index) => {
            const finalPaidPresentDays = Number(item.paidpresentday) - (Number(item.holidayCount) + Number(item.leaveCount));

            return {
              ...item,
              serialNumber: index + 1,
              totalnumberofdays: Number(item.totalnumberofdays),
              lopcount: Number(item.lopcount),
              // paidpresentday: finalPaidPresentDays,
              paidpresentday: Number(item.paidpresentday) > Number(item.shift) ? Number(item.shift) - Number(item.lopcount) : Number(item.paidpresentday) - (Number(item.doublelopcount) + Number(item.doublehalflopcount)),
            };
          });

          return resultdata;
        } catch (err) {
          handleLoaderDialogClose();
          return [];
        }
      }

      async function getAllResults() {
        const [allResults, allResults2] = await Promise.all([processBatches(resultarr, true), processBatches(resultarr2, false)]);

        return { allResults, allResults2 };
      }

      async function processBatches(resultArray, isPrimaryArray) {
        let results = [];
        for (let [index, batch] of resultArray.entries()) {
          if (isPrimaryArray) {
            // console.log(index + 1, resultArray.length, 'index');
            handleProgressUpdate((((index + 1) / resultArray.length) * 100).toFixed(0), "Creating...");
          }
          const finaldata = await sendBatchRequest(batch);
          results = results.concat(finaldata);
          // handleLoaderDialogOpen();
        }
        return results;
      }

      getAllResults()
        .then((results) => {
          setEmployeesPayRun(res.data.users);
          function splitArrayItems(array, chunkSize) {
            const resultarr = [];
            for (let i = 0; i < array.length; i += chunkSize) {
              const chunk = array.slice(i, i + chunkSize);
              resultarr.push({
                emps: chunk,
              });
            }
            return resultarr;
          }
          const resultarrItems = splitArrayItems(res.data.users, 50);
          let finalresult = results.allResults;
          let finalresultNxt = results.allResults2;

          async function sendBatchRequestItems(batch, data) {
            try {
              const itemsWithSerialNumber = batch.emps.map(async (item, index) => processEmployeeItemReruns(item, index, data, finalresult, finalresultNxt, oldrerunData, oldrerunData.month, findSelectedMonthNum, oldrerunData.year, "", []));
              return await Promise.all(itemsWithSerialNumber);
            } catch (err) {
              console.error("Error processing batch request items:", err);
              setBankdetail(false);
              handleApiError(err, setShowAlert, handleClickOpenerr);
            }
          }

          async function getAllResultsItems() {
            try {
              const apiData = await fetchApiData(oldrerunData.month, findSelectedMonthNum, oldrerunData.year);

              let allResultsItems = [];
              for (let batch of resultarrItems) {
                const batchResults = await sendBatchRequestItems(batch, apiData);
                allResultsItems.push(...batchResults);
              }

              return { allResultsItems, monthSets: apiData.monthSets };
            } catch (err) {
              console.log(err, "err");
              handleApiError(err, setShowAlert, handleClickOpenerr);
            }
          }

          getAllResultsItems().then((result) => {
            try {
              let results = result.allResultsItems;

              let finalDataOnlyAboveHundred = results.map((item) => {
                // const oldItem = oldrerunDataDirect.data.find(oldItem => oldItem.companyname === item.companyname && oldItem.empcode === item.empcode);

                const oldItem = oldrerunData.data.find((oldItem) => oldItem.companyname === item.companyname && oldItem.empcode === item.empcode);
                let findIsBankStatusClosed = oldItem?.logdata.some((item) => item.bankclose == "closed");
                let findIsBankStatusCreated = oldItem?.logdata.some((item) => item.bankreleasestatus == "created");
                // console.log(findIsBankStatusClosed, findIsBankStatusCreated, item.changestatus, 'sdlkfjsd')
                // Check if the item's changestatus is "Amount Differ"
                // if (item.changestatus != "+/- Amount differ") {
                //   return oldItem ? { ...oldItem, changestatus: item.changestatus, isvaluechanges: item.changestatus } : item;
                // } else

                if (item.changestatus == "+/- Amount differ" && findIsBankStatusClosed && item.checkSalaryExcess) {
                  let findHoldReleaseData = oldItem?.logdata.some((data) => data.status == "holdrelease" && data.holdsalaryconfirm != "Yes") ? oldItem?.logdata.find((data) => data.status == "holdrelease" && data.holdsalaryconfirm != "Yes")._id : "";
                  let logdatas = [];
                  if (findHoldReleaseData != "") {
                    logdatas = oldItem.logdata.map((d) => {
                      if (d._id == findHoldReleaseData) {
                        return {
                          ...item,
                          finalusersalary: item.salarytype == "Final Salary" ? item.finalsalary : item.salarytype === "Fixed Salary" ? item.fixedsalary : item.prodsalary,

                          holdsalaryconfirm: "No",
                          status: d.status,
                          innerId: d.innerId,
                          outerId: d.outerId,
                          payyear: d.payear,
                          paymonth: d.paymonth,
                          paydate: d.paydate,
                          statuspage: d.statuspage,
                        };
                      } else {
                        return d;
                      }
                    });
                  } else {
                    // logdatas = [{
                    //   ...item, finalusersalary: item.salarytype == "Final Salary" ? item.finalsalary : item.salarytype === "Fixed Salary" ? item.fixedsalary : item.prodsalary, holdsalaryconfirm: "No", status: "holdrelease", innerId: item._id,
                    //   outerId: oldrerunData._id, payyear: oldrerunData.year, paymonth: oldrerunData.month, paydate: "", statuspage: "fixsalary",
                    // }, ...oldItem?.logdata]
                    logdatas = [
                      {
                        status: "holdrelease",
                        statuspage: "fixsalary",
                        companyname: item.companyname,
                        innerId: item._id,
                        outerId: oldrerunData.outerId,
                        company: item.company,
                        branch: item.branch,
                        unit: item.unit,
                        team: item.team,
                        empcode: item.empcode,
                        department: item.department,
                        legalname: item.legalname,
                        designation: item.designation,
                        totalnumberofdays: item.totalnumberofdays,
                        totalshift: item.totalshift,

                        totalasbleave: item.totalasbleave,
                        totalpaidDays: item.totalpaidDays,
                        targetpoints: item.targetpoints,
                        clsl: item.clsl,
                        acheivedpoints: item.acheivedpoints,
                        acheivedpercent: item.acheivedpercent,
                        currentmonthavg: item.currentmonthavg,
                        currentmonthattendance: item.currentmonthattendance,

                        bankname: item.bankname,
                        accountholdername: item.accountholdername,
                        ifsccode: item.ifsccode,
                        penaltyamount: item.penaltyamount,
                        releaseamount: item.releaseamount,
                        otherdeductionamount: item.otherdeductionamount,
                        totalexcess: item.totalexcess,
                        totaladvance: item.totaladvance,
                        payamount: item.payamount,
                        balanceamount: item.balanceamount,
                        paidstatus: item.paidstatus,
                        approvedby: item.approvedby,
                        description: item.description,
                        recheckreason: item.recheckreason,
                        updatedpaidstatus: item.updatedpaidstatus,
                        updatechangedate: item.updatechangedate,
                        payonsalarytype: item.payonsalarytype,

                        finalusersalary: item.salarytype == "Final Salary" ? item.finalsalary : item.salarytype === "Fixed Salary" ? item.fixedsalary : item.prodsalary,
                        holdsalaryconfirm: "No",
                        payyear: oldrerunData.selectedyear,
                        paymonth: oldrerunData.selectedmonth,
                        paydate: "",
                      },
                      ...oldItem?.logdata,
                    ];
                  }

                  return oldItem ? { ...oldItem, changestatus: "Data in Bank Release", isvaluechanges: "Data in Bank Release", logdata: logdatas } : item;
                } else if (item.changestatus == "+/- Amount differ" && findIsBankStatusCreated && !findIsBankStatusClosed) {
                  return { ...item, changestatus: "Data in Bank Prepation was removed", isvaluechanges: "Data in Bank Prepation was removed", sentfixsalary: "Yes", logdata: [], fixsalarydateconfirm: "", fixholdsalarydateconfirm: "" };
                } else {
                  // If changestatus is not "Amount Differ", update the item to set sentfixsalary: "Yes" if needed
                  return { ...item, changestatus: item.changestatus, isvaluechanges: item.isvaluechanges, sentfixsalary: "Yes", logdata: [], fixsalarydateconfirm: "", fixholdsalarydateconfirm: "" };
                }
              });

              if (finalDataOnlyAboveHundred.some((d) => d.isvaluechanges === "Data in Bank Prepation was removed")) {
                const oldItems = oldrerunData.data.filter((oldItem) => oldItem.logdata.some((item) => item.bankreleasestatus == "created"));

                let bankreleasedata = oldItems;
                setBankReleaseDatas(bankreleasedata);
                handleBankRleasePopOpenAllEmp();
                setOldDataCheck(oldrerunData);
                setnewRerunData(finalDataOnlyAboveHundred);
                setMonthSetDatasBank(result.monthSets);
              } else {
                handleProgressUpdate(100, "Creating...");
                handleLoaderDialogOpen();
                const datasplitted = Object.values(
                  finalDataOnlyAboveHundred.reduce((acc, item) => {
                    const { department } = item;
                    if (!acc[department]) {
                      acc[department] = { department, data: [] };
                    }
                    acc[department].data.push({ ...item });
                    return acc;
                  }, {})
                );

                setLoaderData(datasplitted[0].data);
                updateDataCheck(datasplitted, result.monthSets, oldrerunData);
                handleLoaderDialogClose();
                setBankdetail(false);
              }
            } catch (err) {
              handleLoaderDialogClose();
              console.log(err, "err");
              handleApiError(err, setShowAlert, handleClickOpenerr);
            }
          });
        })
        .catch((err) => {
          handleLoaderDialogClose();
          // console.error('Error in getting all results:', error);
        });
    }
  };

  const updateDataCheck = async (data, monthSetDatas) => {
    try {
      let findSelectedMonthNum = months.find((d) => d.value === oldrerunData.month).numval;

      if (data.length > 0) {
        const esinotdeductionemployees = data
          .flatMap((item) => item.data)
          .filter((d) => Number(d.esideduction) == 0 && d.pfvalues.esideduction === true)
          .map((item) => ({ companyname: item.companyname, _id: item._id, empcode: item.empcode }));

        data?.map((d) => {
          let selectedmonthnumalter = Number(findSelectedMonthNum) <= 9 ? `0${Number(findSelectedMonthNum)}` : findSelectedMonthNum;

          let selectedMonStartDate = oldrerunData.year + "-" + selectedmonthnumalter + "-01";

          let findexp = monthSetDatas.find((item) => d.department === item.department);
          let findDate = findexp ? findexp.fromdate : selectedMonStartDate;

          //FIND SELECTEDMONTH MONTH END DATE
          const nextMonthFirstDay = new Date(Number(oldrerunData.year), Number(findSelectedMonthNum), 1);

          // Subtract one day to get the last day of the given month
          const lastDate = new Date(nextMonthFirstDay - 1);

          let lastdateOfSelectedMonth = lastDate.getDate();
          let selectedMonEndDate = `${oldrerunData.year}-${selectedmonthnumalter}-${lastdateOfSelectedMonth}`;
          let findmonthenddate = findexp ? findexp.todate : selectedMonEndDate;

          return axios.put(`${SERVICE.PAYRUNLIST_SINGLE}/${oldrerunData._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            department: String(d.department),
            data: d.data,

            from: findDate,
            to: findmonthenddate,
            empcount: d.data.length,
            month: String(oldrerunData.month),
            year: Number(oldrerunData.year),
            generatedon: String(new Date()),
            addedby: [
              {
                name: String(isUserRoleAccess.username),
                date: String(new Date()),
              },
            ],
            updatedby: [
              ...oldrerunData.updatedby,
              {
                name: String(isUserRoleAccess.username),
                date: String(new Date()),
              },
            ],
          });
        });
        if (esinotdeductionemployees.length > 0) {
          setSelectAll(false);
          setSelectedRowsEsi([]);
          handleOpenESINoDed();
          setESINoDedEmps(esinotdeductionemployees);
        }
        await fetchPayRunList();
      }
    } catch (err) {
      console.log(err, "err");
      setBankdetail(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //RERUN WITHOUT EDIT EMPLOYEES
  const handleRerunWithoutEdiSubmit = async () => {
    setIsLoadStart(true);

    let employeeWithoutEditNeedToRerun = oldrerunData.data;

    // setLoaderData(oldrerunData.data.map(item => ({ ...item, isvaluechanges: "Please Wait..." })));

    handleCloseModRerun();
    let res = await axios.post(SERVICE.USER_PAYRUNDATA_LIMITED_FINAL, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },

      department: [oldrerunData.department],
      month: String(oldrerunData.month),
      year: String(oldrerunData.year),
    });

    let employeelistnames = res.data.users.length > 0 ? [...new Set(res.data.users.map((item) => item.companyname))] : [];

    let findSelectedMonthNum = months.find((d) => d.value === oldrerunData.month).numval;
    if (res.data.users.length > 0) {
      const resultarr = splitArray(employeelistnames, 5, findSelectedMonthNum, oldrerunData.year);
      const resultarr2 = splitArray2(employeelistnames, 5, findSelectedMonthNum, oldrerunData.year);
      // console.log(resultarr, resultarr2)

      let res_applyleave = await axios.post(SERVICE.APPLYLEAVE_APPROVED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        status: String("Approved"),
      });
      let leaveresult = res_applyleave?.data?.applyleaves;

      async function sendBatchRequest(batch) {
        try {
          let res_usershift = await axios.post(SERVICE.USER_ATTENDANCE_PAYRUN, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            department: oldrerunData.department,
            employees: batch.data,
            ismonth: batch.month,
            isyear: batch.year,
          });
          const filteredBatch = res_usershift?.data?.finaluser?.filter((d) => {
            const [day, month, year] = d.rowformattedDate.split("/");
            const formattedDate = new Date(`${year}-${month}-${day}`);
            const reasonDate = new Date(d.reasondate);
            const dojDate = new Date(d.doj);

            if (d.reasondate && d.reasondate !== "") {
              return formattedDate >= dojDate && formattedDate <= reasonDate;
            } else if (d.doj && d.doj !== "") {
              return formattedDate >= dojDate;
            } else {
              return d;
            }
          });

          let filtered = filteredBatch;
          let countByEmpcodeClockin = {}; // Object to store count for each empcode
          let countByEmpcodeClockout = {};
          let result = filtered.flatMap((item, index) => {
            // Initialize count for empcode if not already present
            if (!countByEmpcodeClockin[item.empcode]) {
              countByEmpcodeClockin[item.empcode] = 1;
            }
            if (!countByEmpcodeClockout[item.empcode]) {
              countByEmpcodeClockout[item.empcode] = 1;
            }

            // Adjust clockinstatus based on lateclockincount
            let updatedClockInStatus = item.clockinstatus;
            // Adjust clockoutstatus based on earlyclockoutcount
            let updatedClockOutStatus = item.clockoutstatus;

            // Filter out only 'Absent' items for the current employee
            const absentItems = filtered?.filter((d) => d.clockinstatus === "Absent" && item.empcode === d.empcode && d.clockin === "00:00:00" && d.clockout === "00:00:00");

            // Check if the day before and after a 'Week Off' date is marked as 'Leave' or 'Absent'
            if (item.clockinstatus === "Week Off" && item.clockoutstatus === "Week Off") {
              // Define the date format for comparison
              const itemDate = moment(item.rowformattedDate, "DD/MM/YYYY");

              const isPreviousDayLeave = leaveresult.some((leaveItem) => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, "days"), "day") && leaveItem.empcode === item.empcode);
              const isPreviousDayAbsent = absentItems.some((absentItem) => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, "days"), "day") && absentItem.empcode === item.empcode);

              const isNextDayLeave = leaveresult.some((leaveItem) => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().add(1, "days"), "day") && leaveItem.empcode === item.empcode);
              const isNextDayAbsent = absentItems.some((absentItem) => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().add(1, "days"), "day") && absentItem.empcode === item.empcode);

              if (isPreviousDayLeave) {
                updatedClockInStatus = "BeforeWeekOffLeave";
                updatedClockOutStatus = "BeforeWeekOffLeave";
              }
              if (isPreviousDayAbsent) {
                updatedClockInStatus = "BeforeWeekOffAbsent";
                updatedClockOutStatus = "BeforeWeekOffAbsent";
              }
              if (isNextDayLeave) {
                updatedClockInStatus = "AfterWeekOffLeave";
                updatedClockOutStatus = "AfterWeekOffLeave";
              }
              if (isNextDayAbsent) {
                updatedClockInStatus = "AfterWeekOffAbsent";
                updatedClockOutStatus = "AfterWeekOffAbsent";
              }
            }

            // Check if 'Late - ClockIn' count exceeds the specified limit
            if (updatedClockInStatus === "Late - ClockIn") {
              updatedClockInStatus = `${countByEmpcodeClockin[item.empcode]}Late - ClockIn`;
              countByEmpcodeClockin[item.empcode]++; // Increment count for current empcode
            }
            // Check if 'Early - ClockOut' count exceeds the specified limit
            if (updatedClockOutStatus === "Early - ClockOut") {
              updatedClockOutStatus = `${countByEmpcodeClockout[item.empcode]}Early - ClockOut`;
              countByEmpcodeClockout[item.empcode]++; // Increment count for current empcode
            }

            return {
              ...item,
              shiftallot: item.shiftallot,
              weekOffDates: item.weekOffDates,
              clockinstatus: updatedClockInStatus,
              clockoutstatus: updatedClockOutStatus,
            };
          });
          const itemsWithSerialNumber = result?.map((item, index) => ({
            ...item,
            shiftmode: item.shiftMode,
            uniqueid: item.id,
            userid: item.userid,
            totalnumberofdays: item.totalnumberofdays,
            empshiftdays: item.empshiftdays,
            totalcounttillcurrendate: item.totalcounttillcurrendate,
            totalshift: item.totalshift,
            attendanceauto: getattendancestatus(item),
            daystatus: item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item),
            appliedthrough: getAttModeAppliedThr(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
            lop: getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
            loptype: getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
            lopcalculation: getFinalLop(getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)), getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item))),
            lopcount: getCount(getFinalLop(getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)), getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)))),
            modetarget: getAttModeTarget(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
            paidpresentbefore: getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
            paidleavetype: getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
            paidpresent: getFinalPaid(getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)), getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item))),
            lopday: getAssignLeaveDayForLop(getFinalLop(getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)), getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)))),
            paidpresentday: getAssignLeaveDayForPaid(getFinalPaid(getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)), getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)))),
          }));

          const weekOption = ["BeforeWeekOffAbsent", "AfterWeekOffAbsent", "BeforeWeekOffLeave", "AfterWeekOffLeave"];
          itemsWithSerialNumber.forEach((item, index, array) => {
            if (attStatusOption.includes(item.daystatus) && item.clockin === "00:00:00" && item.clockout === "00:00:00" && item.paidpresent === "Yes - Full Day") {
              const previousItem = array[index - 1];
              const nextItem = array[index + 1];

              const hasRelevantStatus = (entry) => entry && (weekOption.includes(entry.clockinstatus) || (weekOption.includes(entry.clockoutstatus) && entry.shift === "Week Off"));

              // if (hasRelevantStatus(previousItem)) {
              //     previousItem.clockinstatus = 'Week Off';
              //     previousItem.clockoutstatus = 'Week Off';
              //     previousItem.attendanceauto = getattendancestatus(previousItem);
              //     previousItem.daystatus = previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem);
              // }
              // if (hasRelevantStatus(nextItem)) {
              //     nextItem.clockinstatus = 'Week Off';
              //     nextItem.clockoutstatus = 'Week Off';
              //     nextItem.attendanceauto = getattendancestatus(nextItem);
              //     nextItem.daystatus = nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem);
              // }
              if (hasRelevantStatus(previousItem)) {
                previousItem.clockinstatus = "Week Off";
                previousItem.clockoutstatus = "Week Off";
                previousItem.attendanceauto = getattendancestatus(previousItem);
                previousItem.daystatus = previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem);
                previousItem.appliedthrough = getAttModeAppliedThr(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                previousItem.lop = getAttModeLop(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                previousItem.loptype = getAttModeLopType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                previousItem.lopcalculation = getFinalLop(getAttModeLop(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)), getAttModeLopType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)));
                previousItem.lopcount = getCount(getFinalLop(getAttModeLop(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)), getAttModeLopType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem))));
                previousItem.modetarget = getAttModeTarget(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                previousItem.paidpresentbefore = getAttModePaidPresent(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                previousItem.paidleavetype = getAttModePaidPresentType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                previousItem.paidpresent = getFinalPaid(getAttModePaidPresent(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)), getAttModePaidPresentType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)));
                previousItem.lopday = getAssignLeaveDayForLop(getFinalLop(getAttModeLop(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)), getAttModeLopType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem))));
                previousItem.paidpresentday = getAssignLeaveDayForPaid(getFinalPaid(getAttModePaidPresent(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)), getAttModePaidPresentType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem))));
              }
              if (hasRelevantStatus(nextItem)) {
                nextItem.clockinstatus = "Week Off";
                nextItem.clockoutstatus = "Week Off";
                nextItem.attendanceauto = getattendancestatus(nextItem);
                nextItem.daystatus = nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem);
                nextItem.appliedthrough = getAttModeAppliedThr(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                nextItem.lop = getAttModeLop(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                nextItem.loptype = getAttModeLopType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                nextItem.lopcalculation = getFinalLop(getAttModeLop(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)), getAttModeLopType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)));
                nextItem.lopcount = getCount(getFinalLop(getAttModeLop(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)), getAttModeLopType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem))));
                nextItem.modetarget = getAttModeTarget(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                nextItem.paidpresentbefore = getAttModePaidPresent(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                nextItem.paidleavetype = getAttModePaidPresentType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                nextItem.paidpresent = getFinalPaid(getAttModePaidPresent(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)), getAttModePaidPresentType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)));
                nextItem.lopday = getAssignLeaveDayForLop(getFinalLop(getAttModeLop(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)), getAttModeLopType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem))));
                nextItem.paidpresentday = getAssignLeaveDayForPaid(getFinalPaid(getAttModePaidPresent(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)), getAttModePaidPresentType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem))));
              }
            }
          });

          const finalresult = [];

          itemsWithSerialNumber.forEach((item) => {
            // console.log(item, "item");
            const leaveOnDateApproved = leaveresult.find((d) => d.date === item.rowformattedDate && d.empcode === item.empcode);

            const existingEntryIndex = finalresult.findIndex((entry) => entry.empcode === item.empcode);

            if (existingEntryIndex !== -1) {
              if (item.shift !== "Not Allotted") {
                finalresult[existingEntryIndex].shift++;
              }
              if ((item.clockinstatus === "Week Off" && item.clockoutstatus === "Week Off" && item.clockin === "00:00:00" && item.clockout === "00:00:00") || (item.daystatus === "MWEEKOFF" && item.paidpresent === "Yes - Full Day")) {
                finalresult[existingEntryIndex].weekoff++;
              }

              if (item.clockinstatus === "Holiday" && item.clockoutstatus === "Holiday") {
                finalresult[existingEntryIndex].holidayCount++;
              }
              if (item.shift === "Week Off") {
                finalresult[existingEntryIndex].weekoffall++;
              }
              if (item.clockinstatus === "DLOP" && item.clockoutstatus === "DLOP") {
                finalresult[existingEntryIndex].dlob++;
              }
              if (["MPRESENT", "PRESENT"].includes(item.daystatus) && ["MPRESENT", "PRESENT"].includes(item.daystatus)) {
                finalresult[existingEntryIndex].present++;
              }
              // if (item.clockinstatus === 'Leave' && item.clockoutstatus === 'Leave') {
              //     finalresult[existingEntryIndex].leaveCount++;
              // }
              if (leaveOnDateApproved) {
                // if ((item.clockinstatus === `${leaveOnDateApproved.code} ${leaveOnDateApproved.status}`) && (item.clockoutstatus === `${leaveOnDateApproved.code} ${leaveOnDateApproved.status}`)) {
                finalresult[existingEntryIndex].leaveCount++;
                // }
              }
              if (item.lopcalculation === "Yes - Double Day") {
                finalresult[existingEntryIndex].doublelopcount++;
              }

              if (item.lopcalculation === "Yes - Double Half Day") {
                finalresult[existingEntryIndex].doublehalflopcount++;
              }

              if (item.clockinstatus !== "Not Allotted" && item.clockoutstatus !== "Not Allotted" && item.attendanceauto === undefined && item.daystatus === undefined) {
                finalresult[existingEntryIndex].nostatuscount++;
              }

              finalresult[existingEntryIndex].lopcount = String(parseFloat(finalresult[existingEntryIndex].lopcount) + parseFloat(item.lopcount));
              finalresult[existingEntryIndex].paidpresentday = String(parseFloat(finalresult[existingEntryIndex].paidpresentday) + parseFloat(item.paidpresentday));
            } else {
              const newItem = {
                id: item.id,
                empcode: item.empcode,
                username: item.username,
                company: item.company,
                branch: item.branch,
                unit: item.unit,
                team: item.team,
                department: item.department,
                totalnumberofdays: item.totalnumberofdays,
                empshiftdays: item.empshiftdays,
                //  shift: (item.clockinstatus !== 'Not Allotted' && item.clockoutstatus !== 'Not Allotted' && item.clockin === '00:00:00' && item.clockout === '00:00:00') ? 1 : 0,

                shift: 1,

                // weekoff: item.weekoffCount,
                weekoff: item.clockinstatus === "Week Off" && item.clockoutstatus === "Week Off" && item.clockin === "00:00:00" && item.clockout === "00:00:00" ? 1 : 0,
                lopcount: item.lopcount,

                paidpresentday: item.paidpresentday,
                totalcounttillcurrendate: item.totalcounttillcurrendate,
                totalshift: item.totalshift,
                holidayCount: item.clockinstatus === "Holiday" && item.clockoutstatus === "Holiday" ? 1 : 0,
                // leaveCount: (item.clockinstatus === 'Leave' && item.clockoutstatus === 'Leave') ? 1 : 0,
                // leaveCount: leaveOnDateApproved ? ((item.clockinstatus === `${leaveOnDateApproved && leaveOnDateApproved.code} ${leaveOnDateApproved && leaveOnDateApproved.status}`) && (item.clockoutstatus === `${leaveOnDateApproved && leaveOnDateApproved.code} ${leaveOnDateApproved && leaveOnDateApproved.status}`) ? 1 : 0) : 0,
                leaveCount: leaveOnDateApproved ? 1 : 0,
                clsl: 0,
                holiday: 0,
                totalpaiddays: 0,
                nostatus: 0,

                // nostatuscount: item.paidpresent === 'No' && item.modetarget === 'No' && item.lopcalculation === 'No' ? 1 : 0,
                nostatuscount: item.clockinstatus !== "Not Allotted" && item.clockoutstatus !== "Not Allotted" && item.paidpresent === "No" && item.modetarget === "No" && item.lopcalculation === "No" ? 1 : 0,
                weekoffall: item.shift === "Week Off" ? 1 : 0,
                present: ["MPRESENT", "PRESENT"].includes(item.daystatus) && ["MPRESENT", "PRESENT"].includes(item.daystatus) ? 1 : 0,
                dlob: item.clockinstatus === "DLOP" && item.clockoutstatus === "DLOP" ? 1 : 0,
                doublelopcount: item.lopcalculation === "Yes - Double Day" ? 1 : 0,
                doublehalflopcount: item.lopcalculation === "Double Half Day" ? 0.5 : 0,
              };
              finalresult.push(newItem);
            }
          });
          let resultdata = finalresult?.map((item, index) => {
            const finalPaidPresentDays = Number(item.paidpresentday) - (Number(item.holidayCount) + Number(item.leaveCount));

            return {
              ...item,
              serialNumber: index + 1,
              totalnumberofdays: Number(item.totalnumberofdays),
              lopcount: Number(item.lopcount),
              // paidpresentday: finalPaidPresentDays,
              paidpresentday: Number(item.paidpresentday) > Number(item.shift) ? Number(item.shift) - Number(item.lopcount) : Number(item.paidpresentday) - (Number(item.doublelopcount) + Number(item.doublehalflopcount)),
            };
          });

          return resultdata;
        } catch (err) {
          handleLoaderDialogClose();
          return [];
        }
      }

      async function getAllResults() {
        const [allResults, allResults2] = await Promise.all([processBatches(resultarr, true), processBatches(resultarr2, false)]);

        return { allResults, allResults2 };
      }

      async function processBatches(resultArray, isPrimaryArray) {
        let results = [];
        for (let [index, batch] of resultArray.entries()) {
          if (isPrimaryArray) {
            // console.log(index + 1, resultArray.length, 'index');
            handleProgressUpdate((((index + 1) / resultArray.length) * 100).toFixed(0), "Creating...");
          }
          const finaldata = await sendBatchRequest(batch);
          results = results.concat(finaldata);
          // handleLoaderDialogOpen();
        }
        return results;
      }

      getAllResults()
        .then((results) => {
          setEmployeesPayRun(res.data.users);
          function splitArrayItems(array, chunkSize) {
            const resultarr = [];
            for (let i = 0; i < array.length; i += chunkSize) {
              const chunk = array.slice(i, i + chunkSize);
              resultarr.push({
                emps: chunk,
              });
            }
            return resultarr;
          }
          const resultarrItems = splitArrayItems(res.data.users, 50);
          let finalresult = results.allResults;
          let finalresultNxt = results.allResults2;

          async function sendBatchRequestItems(batch, data) {
            try {
              const itemsWithSerialNumber = batch.emps.map(async (item, index) => processEmployeeItemReruns(item, index, data, finalresult, finalresultNxt, oldrerunData, oldrerunData.month, findSelectedMonthNum, oldrerunData.year, "", []));
              return await Promise.all(itemsWithSerialNumber);
            } catch (err) {
              console.error("Error processing batch request items:", err);
              setBankdetail(false);
              handleApiError(err, setShowAlert, handleClickOpenerr);
            }
          }

          async function getAllResultsItems() {
            try {
              const apiData = await fetchApiData(oldrerunData.month, findSelectedMonthNum, oldrerunData.year);

              let allResultsItems = [];
              for (let batch of resultarrItems) {
                const batchResults = await sendBatchRequestItems(batch, apiData);
                allResultsItems.push(...batchResults);
              }

              return { allResultsItems, monthSets: apiData.monthSets };
            } catch (err) {
              console.log(err, "err");
              handleApiError(err, setShowAlert, handleClickOpenerr);
            }
          }

          getAllResultsItems().then((result) => {
            try {
              let results = result.allResultsItems;

              let finalDataOnlyAboveHundred = results.map((item) => {
                // const oldItem = oldrerunDataDirect.data.find(oldItem => oldItem.companyname === item.companyname && oldItem.empcode === item.empcode);

                const oldItem = oldrerunData.data.find((oldItem) => oldItem.companyname === item.companyname && oldItem.empcode === item.empcode);
                let findIsBankStatusClosed = oldItem?.logdata.some((item) => item.bankclose == "closed");
                let findIsBankStatusCreated = oldItem?.logdata.some((item) => item.bankreleasestatus == "created");
                // console.log(findIsBankStatusClosed, findIsBankStatusCreated, item.changestatus, 'sdlkfjsd')
                // Check if the item's changestatus is "Amount Differ"
                // if (item.changestatus != "+/- Amount differ") {
                //   return oldItem ? { ...oldItem, changestatus: item.changestatus, isvaluechanges: item.changestatus } : item;
                // } else
                if (item.changestatus == "+/- Amount differ" && findIsBankStatusClosed && item.checkSalaryExcess) {
                  let findHoldReleaseData = oldItem?.logdata.some((data) => data.status == "holdrelease" && data.holdsalaryconfirm != "Yes") ? oldItem?.logdata.find((data) => data.status == "holdrelease" && data.holdsalaryconfirm != "Yes")._id : "";
                  let logdatas = [];
                  if (findHoldReleaseData != "") {
                    logdatas = oldItem.logdata.map((d) => {
                      if (d._id == findHoldReleaseData) {
                        return {
                          ...item,
                          finalusersalary: item.salarytype == "Final Salary" ? item.finalsalary : item.salarytype === "Fixed Salary" ? item.fixedsalary : item.prodsalary,

                          holdsalaryconfirm: "No",
                          status: d.status,
                          innerId: d.innerId,
                          outerId: d.outerId,
                          payyear: d.payear,
                          paymonth: d.paymonth,
                          paydate: d.paydate,
                          statuspage: d.statuspage,
                        };
                      } else {
                        return d;
                      }
                    });
                  } else {
                    // logdatas = [{
                    //   ...item, finalusersalary: item.salarytype == "Final Salary" ? item.finalsalary : item.salarytype === "Fixed Salary" ? item.fixedsalary : item.prodsalary, holdsalaryconfirm: "No", status: "holdrelease", innerId: item._id,
                    //   outerId: oldrerunData._id, payyear: oldrerunData.year, paymonth: oldrerunData.month, paydate: "", statuspage: "fixsalary",
                    // }, ...oldItem?.logdata]
                    logdatas = [
                      {
                        status: "holdrelease",
                        statuspage: "fixsalary",
                        companyname: item.companyname,
                        innerId: item._id,
                        outerId: oldrerunData.outerId,
                        company: item.company,
                        branch: item.branch,
                        unit: item.unit,
                        team: item.team,
                        empcode: item.empcode,
                        department: item.department,
                        legalname: item.legalname,
                        designation: item.designation,
                        totalnumberofdays: item.totalnumberofdays,
                        totalshift: item.totalshift,

                        totalasbleave: item.totalasbleave,
                        totalpaidDays: item.totalpaidDays,
                        targetpoints: item.targetpoints,
                        clsl: item.clsl,
                        acheivedpoints: item.acheivedpoints,
                        acheivedpercent: item.acheivedpercent,
                        currentmonthavg: item.currentmonthavg,
                        currentmonthattendance: item.currentmonthattendance,

                        bankname: item.bankname,
                        accountholdername: item.accountholdername,
                        ifsccode: item.ifsccode,
                        penaltyamount: item.penaltyamount,
                        releaseamount: item.releaseamount,
                        otherdeductionamount: item.otherdeductionamount,
                        totalexcess: item.totalexcess,
                        totaladvance: item.totaladvance,
                        payamount: item.payamount,
                        balanceamount: item.balanceamount,
                        paidstatus: item.paidstatus,
                        approvedby: item.approvedby,
                        description: item.description,
                        recheckreason: item.recheckreason,
                        updatedpaidstatus: item.updatedpaidstatus,
                        updatechangedate: item.updatechangedate,
                        payonsalarytype: item.payonsalarytype,

                        finalusersalary: item.salarytype == "Final Salary" ? item.finalsalary : item.salarytype === "Fixed Salary" ? item.fixedsalary : item.prodsalary,
                        holdsalaryconfirm: "No",
                        payyear: oldrerunData.selectedyear,
                        paymonth: oldrerunData.selectedmonth,
                        paydate: "",
                      },
                      ...oldItem?.logdata,
                    ];
                  }
                  // console.log(logdatas, 'logdatas');
                  return oldItem ? { ...oldItem, changestatus: "Data in Bank Release", isvaluechanges: "Data in Bank Release", logdata: logdatas } : item;
                } else if (item.changestatus == "+/- Amount differ" && findIsBankStatusCreated && !findIsBankStatusClosed) {
                  return { ...item, changestatus: "Data in Bank Prepation was removed", isvaluechanges: "Data in Bank Prepation was removed", sentfixsalary: "Yes", logdata: [], fixsalarydateconfirm: "", fixholdsalarydateconfirm: "" };
                } else {
                  // If changestatus is not "Amount Differ", update the item to set sentfixsalary: "Yes" if needed
                  return { ...item, changestatus: item.changestatus, isvaluechanges: item.isvaluechanges, sentfixsalary: "Yes", logdata: [], fixsalarydateconfirm: "", fixholdsalarydateconfirm: "" };
                }
              });

              if (finalDataOnlyAboveHundred.some((d) => d.isvaluechanges === "Data in Bank Prepation was removed")) {
                const oldItems = oldrerunData.data.filter((oldItem) => oldItem.logdata.some((item) => item.bankreleasestatus == "created"));

                let bankreleasedata = oldItems;
                setBankReleaseDatas(bankreleasedata);
                handleBankRleasePopOpenWithoutEdit();
                setOldDataCheck(oldrerunData);
                setnewRerunData(finalDataOnlyAboveHundred);
                setMonthSetDatasBank(result.monthSets);
              } else {
                handleProgressUpdate(100, "Creating...");
                handleLoaderDialogOpen();
                const datasplitted = Object.values(
                  finalDataOnlyAboveHundred.reduce((acc, item) => {
                    const { department } = item;
                    if (!acc[department]) {
                      acc[department] = { department, data: [] };
                    }
                    acc[department].data.push({ ...item });
                    return acc;
                  }, {})
                );

                setLoaderData(datasplitted[0].data);
                updateDataCheckWithoutEdit(datasplitted, result.monthSets, oldrerunData);
                handleLoaderDialogClose();
                setBankdetail(false);
              }
            } catch (err) {
              handleLoaderDialogClose();
              console.log(err, "err");
              handleApiError(err, setShowAlert, handleClickOpenerr);
            }
          });
        })
        .catch((err) => {
          handleLoaderDialogClose();
          // console.error('Error in getting all results:', error);
        });
    }
  };

  const updateDataCheckWithoutEdit = async (data, monthSetDatas) => {
    try {
      let findSelectedMonthNum = months.find((d) => d.value === oldrerunData.month).numval;

      if (data.length > 0) {
        const esinotdeductionemployees = data
          .flatMap((item) => item.data)
          .filter((d) => Number(d.esideduction) == 0 && d.pfvalues.esideduction === true)
          .map((item) => ({ companyname: item.companyname, _id: item._id, empcode: item.empcode }));

        data?.map((d) => {
          let selectedmonthnumalter = Number(findSelectedMonthNum) <= 9 ? `0${Number(findSelectedMonthNum)}` : findSelectedMonthNum;

          let selectedMonStartDate = oldrerunData.year + "-" + selectedmonthnumalter + "-01";

          let findexp = monthSetDatas.find((item) => d.department === item.department);
          let findDate = findexp ? findexp.fromdate : selectedMonStartDate;

          //FIND SELECTEDMONTH MONTH END DATE
          const nextMonthFirstDay = new Date(Number(oldrerunData.year), Number(findSelectedMonthNum), 1);

          // Subtract one day to get the last day of the given month
          const lastDate = new Date(nextMonthFirstDay - 1);

          let lastdateOfSelectedMonth = lastDate.getDate();
          let selectedMonEndDate = `${oldrerunData.year}-${selectedmonthnumalter}-${lastdateOfSelectedMonth}`;
          let findmonthenddate = findexp ? findexp.todate : selectedMonEndDate;

          return axios.put(`${SERVICE.PAYRUNLIST_SINGLE}/${oldrerunData._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            department: String(d.department),
            data: d.data,

            from: findDate,
            to: findmonthenddate,
            empcount: d.data.length,
            month: String(oldrerunData.month),
            year: Number(oldrerunData.year),
            generatedon: String(new Date()),
            addedby: [
              {
                name: String(isUserRoleAccess.username),
                date: String(new Date()),
              },
            ],
            updatedby: [
              ...oldrerunData.updatedby,
              {
                name: String(isUserRoleAccess.username),
                date: String(new Date()),
              },
            ],
          });
        });
        if (esinotdeductionemployees.length > 0) {
          setSelectAll(false);
          setSelectedRowsEsi([]);
          handleOpenESINoDed();
          setESINoDedEmps(esinotdeductionemployees);
        }
        await fetchPayRunList();
      }
    } catch (err) {
      console.log(err, "err");
      setBankdetail(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //RERUN WITH EDIT EMPLOYEES
  const handleRerunWithEdiSubmit = async () => {
    setIsLoadStart(true);
    let employeeWithEditNeedToRerun = oldrerunData.data.filter((d) => d.iseditedpenaltyamount == "Yes" || d.iseditedacheivedpoints == "Yes");
    // setLoaderData(oldrerunData.data.map(item => ({ ...item, isvaluechanges: "Please Wait..." })));
    // let employeelistnames = employeeWithoutEditNeedToRerun.map(item => item.companyname);
    // setEditedEmployees(employeeWithEditNeedToRerun)
    handleCloseModRerun();

    let res = await axios.post(SERVICE.USER_PAYRUNDATA_LIMITED_FINAL, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },

      // employees: employeelistnames,
      department: [oldrerunData.department],
      month: String(oldrerunData.month),
      year: String(oldrerunData.year),
    });
    let employeelistnames = res.data.users.length > 0 ? [...new Set(res.data.users.map((item) => item.companyname))] : [];
    let findSelectedMonthNum = months.find((d) => d.value === oldrerunData.month).numval;

    if (res.data.users.length > 0) {
      const resultarr = splitArray(employeelistnames, 5, findSelectedMonthNum, oldrerunData.year);
      const resultarr2 = splitArray2(employeelistnames, 5, findSelectedMonthNum, oldrerunData.year);
      // console.log(resultarr, resultarr2)

      let res_applyleave = await axios.post(SERVICE.APPLYLEAVE_APPROVED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        status: String("Approved"),
      });
      let leaveresult = res_applyleave?.data?.applyleaves;

      async function sendBatchRequest(batch) {
        try {
          let res_usershift = await axios.post(SERVICE.USER_ATTENDANCE_PAYRUN, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            department: oldrerunData.department,
            employees: batch.data,
            ismonth: batch.month,
            isyear: batch.year,
          });
          const filteredBatch = res_usershift?.data?.finaluser?.filter((d) => {
            const [day, month, year] = d.rowformattedDate.split("/");
            const formattedDate = new Date(`${year}-${month}-${day}`);
            const reasonDate = new Date(d.reasondate);
            const dojDate = new Date(d.doj);

            if (d.reasondate && d.reasondate !== "") {
              return formattedDate >= dojDate && formattedDate <= reasonDate;
            } else if (d.doj && d.doj !== "") {
              return formattedDate >= dojDate;
            } else {
              return d;
            }
          });

          let filtered = filteredBatch;
          let countByEmpcodeClockin = {}; // Object to store count for each empcode
          let countByEmpcodeClockout = {};

          let result = filtered.flatMap((item, index) => {
            // Initialize count for empcode if not already present
            if (!countByEmpcodeClockin[item.empcode]) {
              countByEmpcodeClockin[item.empcode] = 1;
            }
            if (!countByEmpcodeClockout[item.empcode]) {
              countByEmpcodeClockout[item.empcode] = 1;
            }

            // Adjust clockinstatus based on lateclockincount
            let updatedClockInStatus = item.clockinstatus;
            // Adjust clockoutstatus based on earlyclockoutcount
            let updatedClockOutStatus = item.clockoutstatus;

            // Filter out only 'Absent' items for the current employee
            const absentItems = filtered?.filter((d) => d.clockinstatus === "Absent" && item.empcode === d.empcode && d.clockin === "00:00:00" && d.clockout === "00:00:00");

            // Check if the day before and after a 'Week Off' date is marked as 'Leave' or 'Absent'
            if (item.clockinstatus === "Week Off" && item.clockoutstatus === "Week Off") {
              // Define the date format for comparison
              const itemDate = moment(item.rowformattedDate, "DD/MM/YYYY");

              const isPreviousDayLeave = leaveresult.some((leaveItem) => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, "days"), "day") && leaveItem.empcode === item.empcode);
              const isPreviousDayAbsent = absentItems.some((absentItem) => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, "days"), "day") && absentItem.empcode === item.empcode);

              const isNextDayLeave = leaveresult.some((leaveItem) => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().add(1, "days"), "day") && leaveItem.empcode === item.empcode);
              const isNextDayAbsent = absentItems.some((absentItem) => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().add(1, "days"), "day") && absentItem.empcode === item.empcode);

              if (isPreviousDayLeave) {
                updatedClockInStatus = "BeforeWeekOffLeave";
                updatedClockOutStatus = "BeforeWeekOffLeave";
              }
              if (isPreviousDayAbsent) {
                updatedClockInStatus = "BeforeWeekOffAbsent";
                updatedClockOutStatus = "BeforeWeekOffAbsent";
              }
              if (isNextDayLeave) {
                updatedClockInStatus = "AfterWeekOffLeave";
                updatedClockOutStatus = "AfterWeekOffLeave";
              }
              if (isNextDayAbsent) {
                updatedClockInStatus = "AfterWeekOffAbsent";
                updatedClockOutStatus = "AfterWeekOffAbsent";
              }
            }

            // Check if 'Late - ClockIn' count exceeds the specified limit
            if (updatedClockInStatus === "Late - ClockIn") {
              updatedClockInStatus = `${countByEmpcodeClockin[item.empcode]}Late - ClockIn`;
              countByEmpcodeClockin[item.empcode]++; // Increment count for current empcode
            }
            // Check if 'Early - ClockOut' count exceeds the specified limit
            if (updatedClockOutStatus === "Early - ClockOut") {
              updatedClockOutStatus = `${countByEmpcodeClockout[item.empcode]}Early - ClockOut`;
              countByEmpcodeClockout[item.empcode]++; // Increment count for current empcode
            }

            return {
              ...item,
              shiftallot: item.shiftallot,
              weekOffDates: item.weekOffDates,
              clockinstatus: updatedClockInStatus,
              clockoutstatus: updatedClockOutStatus,
            };
          });
          const itemsWithSerialNumber = result?.map((item, index) => ({
            ...item,
            shiftmode: item.shiftMode,
            uniqueid: item.id,
            userid: item.userid,
            totalnumberofdays: item.totalnumberofdays,
            empshiftdays: item.empshiftdays,
            totalcounttillcurrendate: item.totalcounttillcurrendate,
            totalshift: item.totalshift,
            attendanceauto: getattendancestatus(item),
            daystatus: item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item),
            appliedthrough: getAttModeAppliedThr(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
            lop: getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
            loptype: getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
            lopcalculation: getFinalLop(getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)), getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item))),
            lopcount: getCount(getFinalLop(getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)), getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)))),
            modetarget: getAttModeTarget(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
            paidpresentbefore: getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
            paidleavetype: getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
            paidpresent: getFinalPaid(getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)), getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item))),
            lopday: getAssignLeaveDayForLop(getFinalLop(getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)), getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)))),
            paidpresentday: getAssignLeaveDayForPaid(getFinalPaid(getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)), getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)))),
          }));

          const weekOption = ["BeforeWeekOffAbsent", "AfterWeekOffAbsent", "BeforeWeekOffLeave", "AfterWeekOffLeave"];
          itemsWithSerialNumber.forEach((item, index, array) => {
            if (attStatusOption.includes(item.daystatus) && item.clockin === "00:00:00" && item.clockout === "00:00:00" && item.paidpresent === "Yes - Full Day") {
              const previousItem = array[index - 1];
              const nextItem = array[index + 1];

              const hasRelevantStatus = (entry) => entry && (weekOption.includes(entry.clockinstatus) || (weekOption.includes(entry.clockoutstatus) && entry.shift === "Week Off"));

              // if (hasRelevantStatus(previousItem)) {
              //     previousItem.clockinstatus = 'Week Off';
              //     previousItem.clockoutstatus = 'Week Off';
              //     previousItem.attendanceauto = getattendancestatus(previousItem);
              //     previousItem.daystatus = previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem);
              // }
              // if (hasRelevantStatus(nextItem)) {
              //     nextItem.clockinstatus = 'Week Off';
              //     nextItem.clockoutstatus = 'Week Off';
              //     nextItem.attendanceauto = getattendancestatus(nextItem);
              //     nextItem.daystatus = nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem);
              // }
              if (hasRelevantStatus(previousItem)) {
                previousItem.clockinstatus = "Week Off";
                previousItem.clockoutstatus = "Week Off";
                previousItem.attendanceauto = getattendancestatus(previousItem);
                previousItem.daystatus = previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem);
                previousItem.appliedthrough = getAttModeAppliedThr(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                previousItem.lop = getAttModeLop(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                previousItem.loptype = getAttModeLopType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                previousItem.lopcalculation = getFinalLop(getAttModeLop(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)), getAttModeLopType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)));
                previousItem.lopcount = getCount(getFinalLop(getAttModeLop(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)), getAttModeLopType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem))));
                previousItem.modetarget = getAttModeTarget(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                previousItem.paidpresentbefore = getAttModePaidPresent(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                previousItem.paidleavetype = getAttModePaidPresentType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                previousItem.paidpresent = getFinalPaid(getAttModePaidPresent(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)), getAttModePaidPresentType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)));
                previousItem.lopday = getAssignLeaveDayForLop(getFinalLop(getAttModeLop(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)), getAttModeLopType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem))));
                previousItem.paidpresentday = getAssignLeaveDayForPaid(getFinalPaid(getAttModePaidPresent(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)), getAttModePaidPresentType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem))));
              }
              if (hasRelevantStatus(nextItem)) {
                nextItem.clockinstatus = "Week Off";
                nextItem.clockoutstatus = "Week Off";
                nextItem.attendanceauto = getattendancestatus(nextItem);
                nextItem.daystatus = nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem);
                nextItem.appliedthrough = getAttModeAppliedThr(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                nextItem.lop = getAttModeLop(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                nextItem.loptype = getAttModeLopType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                nextItem.lopcalculation = getFinalLop(getAttModeLop(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)), getAttModeLopType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)));
                nextItem.lopcount = getCount(getFinalLop(getAttModeLop(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)), getAttModeLopType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem))));
                nextItem.modetarget = getAttModeTarget(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                nextItem.paidpresentbefore = getAttModePaidPresent(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                nextItem.paidleavetype = getAttModePaidPresentType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                nextItem.paidpresent = getFinalPaid(getAttModePaidPresent(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)), getAttModePaidPresentType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)));
                nextItem.lopday = getAssignLeaveDayForLop(getFinalLop(getAttModeLop(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)), getAttModeLopType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem))));
                nextItem.paidpresentday = getAssignLeaveDayForPaid(getFinalPaid(getAttModePaidPresent(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)), getAttModePaidPresentType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem))));
              }
            }
          });

          const finalresult = [];

          itemsWithSerialNumber.forEach((item) => {
            // console.log(item, "item");
            const leaveOnDateApproved = leaveresult.find((d) => d.date === item.rowformattedDate && d.empcode === item.empcode);

            const existingEntryIndex = finalresult.findIndex((entry) => entry.empcode === item.empcode);

            if (existingEntryIndex !== -1) {
              if (item.shift !== "Not Allotted") {
                finalresult[existingEntryIndex].shift++;
              }
              if ((item.clockinstatus === "Week Off" && item.clockoutstatus === "Week Off" && item.clockin === "00:00:00" && item.clockout === "00:00:00") || (item.daystatus === "MWEEKOFF" && item.paidpresent === "Yes - Full Day")) {
                finalresult[existingEntryIndex].weekoff++;
              }

              if (item.clockinstatus === "Holiday" && item.clockoutstatus === "Holiday") {
                finalresult[existingEntryIndex].holidayCount++;
              }
              if (item.shift === "Week Off") {
                finalresult[existingEntryIndex].weekoffall++;
              }
              if (item.clockinstatus === "DLOP" && item.clockoutstatus === "DLOP") {
                finalresult[existingEntryIndex].dlob++;
              }
              if (["MPRESENT", "PRESENT"].includes(item.daystatus) && ["MPRESENT", "PRESENT"].includes(item.daystatus)) {
                finalresult[existingEntryIndex].present++;
              }
              // if (item.clockinstatus === 'Leave' && item.clockoutstatus === 'Leave') {
              //     finalresult[existingEntryIndex].leaveCount++;
              // }
              if (leaveOnDateApproved) {
                // if ((item.clockinstatus === `${leaveOnDateApproved.code} ${leaveOnDateApproved.status}`) && (item.clockoutstatus === `${leaveOnDateApproved.code} ${leaveOnDateApproved.status}`)) {
                finalresult[existingEntryIndex].leaveCount++;
                // }
              }
              if (item.lopcalculation === "Yes - Double Day") {
                finalresult[existingEntryIndex].doublelopcount++;
              }

              if (item.lopcalculation === "Yes - Double Half Day") {
                finalresult[existingEntryIndex].doublehalflopcount++;
              }

              if (item.clockinstatus !== "Not Allotted" && item.clockoutstatus !== "Not Allotted" && item.attendanceauto === undefined && item.daystatus === undefined) {
                finalresult[existingEntryIndex].nostatuscount++;
              }

              finalresult[existingEntryIndex].lopcount = String(parseFloat(finalresult[existingEntryIndex].lopcount) + parseFloat(item.lopcount));
              finalresult[existingEntryIndex].paidpresentday = String(parseFloat(finalresult[existingEntryIndex].paidpresentday) + parseFloat(item.paidpresentday));
            } else {
              const newItem = {
                id: item.id,
                empcode: item.empcode,
                username: item.username,
                company: item.company,
                branch: item.branch,
                unit: item.unit,
                team: item.team,
                department: item.department,
                totalnumberofdays: item.totalnumberofdays,
                empshiftdays: item.empshiftdays,
                //  shift: (item.clockinstatus !== 'Not Allotted' && item.clockoutstatus !== 'Not Allotted' && item.clockin === '00:00:00' && item.clockout === '00:00:00') ? 1 : 0,

                shift: 1,

                // weekoff: item.weekoffCount,
                weekoff: item.clockinstatus === "Week Off" && item.clockoutstatus === "Week Off" && item.clockin === "00:00:00" && item.clockout === "00:00:00" ? 1 : 0,
                lopcount: item.lopcount,

                paidpresentday: item.paidpresentday,
                totalcounttillcurrendate: item.totalcounttillcurrendate,
                totalshift: item.totalshift,
                holidayCount: item.clockinstatus === "Holiday" && item.clockoutstatus === "Holiday" ? 1 : 0,
                // leaveCount: (item.clockinstatus === 'Leave' && item.clockoutstatus === 'Leave') ? 1 : 0,
                // leaveCount: leaveOnDateApproved ? ((item.clockinstatus === `${leaveOnDateApproved && leaveOnDateApproved.code} ${leaveOnDateApproved && leaveOnDateApproved.status}`) && (item.clockoutstatus === `${leaveOnDateApproved && leaveOnDateApproved.code} ${leaveOnDateApproved && leaveOnDateApproved.status}`) ? 1 : 0) : 0,
                leaveCount: leaveOnDateApproved ? 1 : 0,
                clsl: 0,
                holiday: 0,
                totalpaiddays: 0,
                nostatus: 0,

                // nostatuscount: item.paidpresent === 'No' && item.modetarget === 'No' && item.lopcalculation === 'No' ? 1 : 0,
                nostatuscount: item.clockinstatus !== "Not Allotted" && item.clockoutstatus !== "Not Allotted" && item.paidpresent === "No" && item.modetarget === "No" && item.lopcalculation === "No" ? 1 : 0,
                weekoffall: item.shift === "Week Off" ? 1 : 0,
                present: ["MPRESENT", "PRESENT"].includes(item.daystatus) && ["MPRESENT", "PRESENT"].includes(item.daystatus) ? 1 : 0,
                dlob: item.clockinstatus === "DLOP" && item.clockoutstatus === "DLOP" ? 1 : 0,
                doublelopcount: item.lopcalculation === "Yes - Double Day" ? 1 : 0,
                doublehalflopcount: item.lopcalculation === "Double Half Day" ? 0.5 : 0,
              };
              finalresult.push(newItem);
            }
          });
          let resultdata = finalresult?.map((item, index) => {
            const finalPaidPresentDays = Number(item.paidpresentday) - (Number(item.holidayCount) + Number(item.leaveCount));

            return {
              ...item,
              serialNumber: index + 1,
              totalnumberofdays: Number(item.totalnumberofdays),
              lopcount: Number(item.lopcount),
              // paidpresentday: finalPaidPresentDays,
              paidpresentday: Number(item.paidpresentday) > Number(item.shift) ? Number(item.shift) - Number(item.lopcount) : Number(item.paidpresentday) - (Number(item.doublelopcount) + Number(item.doublehalflopcount)),
            };
          });

          return resultdata;
        } catch (err) {
          handleLoaderDialogClose();
          return [];
        }
      }

      async function getAllResults() {
        const [allResults, allResults2] = await Promise.all([processBatches(resultarr, true), processBatches(resultarr2, false)]);

        return { allResults, allResults2 };
      }

      async function processBatches(resultArray, isPrimaryArray) {
        let results = [];
        for (let [index, batch] of resultArray.entries()) {
          if (isPrimaryArray) {
            // console.log(index + 1, resultArray.length, 'index');
            handleProgressUpdate((((index + 1) / resultArray.length) * 100).toFixed(0), "Creating...");
          }
          const finaldata = await sendBatchRequest(batch);
          results = results.concat(finaldata);
          // handleLoaderDialogOpen();
        }
        return results;
      }

      getAllResults()
        .then((results) => {
          setEmployeesPayRun(res.data.users);
          function splitArrayItems(array, chunkSize) {
            const resultarr = [];
            for (let i = 0; i < array.length; i += chunkSize) {
              const chunk = array.slice(i, i + chunkSize);
              resultarr.push({
                emps: chunk,
              });
            }
            return resultarr;
          }
          const resultarrItems = splitArrayItems(res.data.users, 50);
          let finalresult = results.allResults;
          let finalresultNxt = results.allResults2;

          async function sendBatchRequestItems(batch, data) {
            try {
              const itemsWithSerialNumber = batch.emps.map(async (item, index) => processEmployeeItemReruns(item, index, data, finalresult, finalresultNxt, oldrerunData, oldrerunData.month, findSelectedMonthNum, oldrerunData.year, "withedit", employeeWithEditNeedToRerun));
              return await Promise.all(itemsWithSerialNumber);
            } catch (err) {
              console.error("Error processing batch request items:", err);
              setBankdetail(false);
              handleApiError(err, setShowAlert, handleClickOpenerr);
            }
          }

          async function getAllResultsItems() {
            try {
              const apiData = await fetchApiData(oldrerunData.month, findSelectedMonthNum, oldrerunData.year);

              let allResultsItems = [];
              for (let batch of resultarrItems) {
                const batchResults = await sendBatchRequestItems(batch, apiData);
                allResultsItems.push(...batchResults);
              }

              return { allResultsItems, monthSets: apiData.monthSets };
            } catch (err) {
              console.log(err, "err");
              handleApiError(err, setShowAlert, handleClickOpenerr);
            }
          }

          getAllResultsItems().then((result) => {
            try {
              let results = result.allResultsItems;
              // console.log(results, 'results');
              let finalDataOnlyAboveHundred = results.map((item) => {
                // const oldItem = oldrerunDataDirect.data.find(oldItem => oldItem.companyname === item.companyname && oldItem.empcode === item.empcode);

                const oldItem = oldrerunData.data.find((oldItem) => oldItem.companyname === item.companyname && oldItem.empcode === item.empcode);
                let findIsBankStatusClosed = oldItem?.logdata.some((item) => item.bankclose == "closed");
                let findIsBankStatusCreated = oldItem?.logdata.some((item) => item.bankreleasestatus == "created");
                // console.log(findIsBankStatusClosed, findIsBankStatusCreated, item.changestatus, 'sdlkfjsd')
                // Check if the item's changestatus is "Amount Differ"
                // if (item.changestatus != "+/- Amount differ") {
                //   return oldItem ? { ...oldItem, changestatus: item.changestatus, isvaluechanges: item.changestatus } : item;
                // } else

                if (item.changestatus == "+/- Amount differ" && findIsBankStatusClosed && item.checkSalaryExcess) {
                  let findHoldReleaseData = oldItem?.logdata.some((data) => data.status == "holdrelease" && data.holdsalaryconfirm != "Yes") ? oldItem?.logdata.find((data) => data.status == "holdrelease" && data.holdsalaryconfirm != "Yes")._id : "";
                  let logdatas = [];
                  if (findHoldReleaseData != "") {
                    logdatas = oldItem.logdata.map((d) => {
                      if (d._id == findHoldReleaseData) {
                        return {
                          ...item,
                          finalusersalary: item.salarytype == "Final Salary" ? item.finalsalary : item.salarytype === "Fixed Salary" ? item.fixedsalary : item.prodsalary,

                          holdsalaryconfirm: "No",
                          status: d.status,
                          innerId: d.innerId,

                          acheivedpoints: item.acheivedpoints,
                          acheivedpercent: item.acheivedpercent,
                          outerId: d.outerId,
                          payyear: d.payyear,
                          paymonth: d.paymonth,
                          paydate: d.paydate,
                          statuspage: d.statuspage,
                        };
                      } else {
                        return d;
                      }
                    });
                  } else {
                    // logdatas = [{
                    //   ...item, finalusersalary: item.salarytype == "Final Salary" ? item.finalsalary : item.salarytype === "Fixed Salary" ? item.fixedsalary : item.prodsalary, holdsalaryconfirm: "No", status: "holdrelease", innerId: item._id,
                    //   outerId: oldrerunData._id, payyear: oldrerunData.year, paymonth: oldrerunData.month, paydate: "", statuspage: "fixsalary",
                    // }, ...oldItem?.logdata]
                    logdatas = [
                      {
                        status: "holdrelease",
                        statuspage: "fixsalary",
                        companyname: item.companyname,
                        innerId: item._id,
                        outerId: oldrerunData.outerId,
                        company: item.company,
                        branch: item.branch,
                        unit: item.unit,
                        team: item.team,
                        empcode: item.empcode,
                        department: item.department,
                        legalname: item.legalname,
                        designation: item.designation,
                        totalnumberofdays: item.totalnumberofdays,
                        totalshift: item.totalshift,

                        totalasbleave: item.totalasbleave,
                        totalpaidDays: item.totalpaidDays,
                        targetpoints: item.targetpoints,
                        clsl: item.clsl,
                        acheivedpoints: item.acheivedpoints,
                        acheivedpercent: item.acheivedpercent,
                        currentmonthavg: item.currentmonthavg,
                        currentmonthattendance: item.currentmonthattendance,

                        bankname: item.bankname,
                        accountholdername: item.accountholdername,
                        ifsccode: item.ifsccode,
                        penaltyamount: item.penaltyamount,
                        releaseamount: item.releaseamount,
                        otherdeductionamount: item.otherdeductionamount,
                        totalexcess: item.totalexcess,
                        totaladvance: item.totaladvance,
                        payamount: item.payamount,
                        balanceamount: item.balanceamount,
                        paidstatus: item.paidstatus,
                        approvedby: item.approvedby,
                        description: item.description,
                        recheckreason: item.recheckreason,
                        updatedpaidstatus: item.updatedpaidstatus,
                        updatechangedate: item.updatechangedate,
                        payonsalarytype: item.payonsalarytype,

                        finalusersalary: item.salarytype == "Final Salary" ? item.finalsalary : item.salarytype === "Fixed Salary" ? item.fixedsalary : item.prodsalary,
                        holdsalaryconfirm: "No",
                        payyear: oldrerunData.selectedyear,
                        paymonth: oldrerunData.selectedmonth,
                        paydate: "",
                      },
                      ...oldItem?.logdata,
                    ];
                  }
                  // console.log(logdatas, findHoldReleaseData, 'logdatas');
                  return oldItem ? { ...oldItem, changestatus: "Data in Bank Release", isvaluechanges: "Data in Bank Release", logdata: logdatas } : item;
                } else if (item.changestatus == "+/- Amount differ" && findIsBankStatusCreated && !findIsBankStatusClosed) {
                  return { ...item, changestatus: "Data in Bank Prepation was removed", isvaluechanges: "Data in Bank Prepation was removed", sentfixsalary: "Yes", logdata: [], fixsalarydateconfirm: "", fixholdsalarydateconfirm: "" };
                } else {
                  // If changestatus is not "Amount Differ", update the item to set sentfixsalary: "Yes" if needed
                  return { ...item, changestatus: item.changestatus, isvaluechanges: item.isvaluechanges, sentfixsalary: "Yes", logdata: [], fixsalarydateconfirm: "", fixholdsalarydateconfirm: "" };
                }
              });

              if (finalDataOnlyAboveHundred.some((d) => d.isvaluechanges === "Data in Bank Prepation was removed")) {
                const oldItems = oldrerunData.data.filter((oldItem) => oldItem.logdata.some((item) => item.bankreleasestatus == "created"));

                let bankreleasedata = oldItems;
                setBankReleaseDatas(bankreleasedata);
                handleBankRleasePopOpenWithEdit();
                setOldDataCheck(oldrerunData);
                setnewRerunData(finalDataOnlyAboveHundred);
                setMonthSetDatasBank(result.monthSets);
              } else {
                handleProgressUpdate(100, "Creating...");
                handleLoaderDialogOpen();
                const datasplitted = Object.values(
                  finalDataOnlyAboveHundred.reduce((acc, item) => {
                    const { department } = item;
                    if (!acc[department]) {
                      acc[department] = { department, data: [] };
                    }
                    acc[department].data.push({ ...item });
                    return acc;
                  }, {})
                );

                setLoaderData(datasplitted[0].data);
                updateDataCheckWithEdit(datasplitted, result.monthSets, oldrerunData);
                handleLoaderDialogClose();
                setBankdetail(false);
              }
            } catch (err) {
              handleLoaderDialogClose();
              console.log(err, "err");
              handleApiError(err, setShowAlert, handleClickOpenerr);
            }
          });
        })
        .catch((err) => {
          handleLoaderDialogClose();
          // console.error('Error in getting all results:', error);
        });
    }
  };

  const updateDataCheckWithEdit = async (data, monthSetDatas, oldrerunData) => {
    try {
      let findSelectedMonthNum = months.find((d) => d.value === oldrerunData.month).numval;

      if (data.length > 0) {
        const esinotdeductionemployees = data
          .flatMap((item) => item.data)
          .filter((d) => Number(d.esideduction) == 0 && d.pfvalues.esideduction === true)
          .map((item) => ({ companyname: item.companyname, _id: item._id, empcode: item.empcode }));

        data?.map((d) => {
          let selectedmonthnumalter = Number(findSelectedMonthNum) <= 9 ? `0${Number(findSelectedMonthNum)}` : findSelectedMonthNum;

          let selectedMonStartDate = oldrerunData.year + "-" + selectedmonthnumalter + "-01";

          let findexp = monthSetDatas.find((item) => d.department === item.department);
          let findDate = findexp ? findexp.fromdate : selectedMonStartDate;

          //FIND SELECTEDMONTH MONTH END DATE
          const nextMonthFirstDay = new Date(Number(oldrerunData.year), Number(findSelectedMonthNum), 1);

          // Subtract one day to get the last day of the given month
          const lastDate = new Date(nextMonthFirstDay - 1);

          let lastdateOfSelectedMonth = lastDate.getDate();
          let selectedMonEndDate = `${oldrerunData.year}-${selectedmonthnumalter}-${lastdateOfSelectedMonth}`;
          let findmonthenddate = findexp ? findexp.todate : selectedMonEndDate;

          return axios.put(`${SERVICE.PAYRUNLIST_SINGLE}/${oldrerunData._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            department: String(d.department),
            data: d.data,

            from: findDate,
            to: findmonthenddate,
            empcount: d.data.length,
            month: String(oldrerunData.month),
            year: Number(oldrerunData.year),
            generatedon: String(new Date()),
            addedby: [
              {
                name: String(isUserRoleAccess.username),
                date: String(new Date()),
              },
            ],
            updatedby: [
              ...oldrerunData.updatedby,
              {
                name: String(isUserRoleAccess.username),
                date: String(new Date()),
              },
            ],
          });
        });
        if (esinotdeductionemployees.length > 0) {
          setSelectAll(false);
          setSelectedRowsEsi([]);
          handleOpenESINoDed();
          setESINoDedEmps(esinotdeductionemployees);
        }
        await fetchPayRunList();
      }
    } catch (err) {
      console.log(err, "err");
      setBankdetail(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );

  const [selectedRowsMonths, setSelectedRowsMonths] = useState([]);

  const columnDataTableList = [
    {
      field: "checkbox",
      headerName: "Checkbox", // Default header name
      width: 50,
      headerStyle: {
        fontWeight: "bold", // Apply the font-weight style to make the header text bold
        // Add any other CSS styles as needed
      },
      renderHeader: (params) => (
        <CheckboxHeader
          selectAllChecked={selectAllChecked}
          onSelectAll={() => {
            if (rowDataTableList.length === 0) {
              // Do not allow checking when there are no rowsbu
              return;
            }
            if (selectAllChecked) {
              setSelectedRows([]);
              setSelectedRowsMonths([]);
            } else {
              const allRowIds = rowDataTableList.map((row) => row.id);
              setSelectedRows(allRowIds);
              const allRowMonths = rowDataTableList.map((row) => row.month);
              setSelectedRowsMonths(allRowMonths);
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
            let updatedSelectedRowsMonths;
            if (selectedRows.includes(params.row.id)) {
              updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.row.id);
              updatedSelectedRowsMonths = selectedRowsMonths.filter((selectedId) => selectedId !== params.row.month);
            } else {
              updatedSelectedRows = [...selectedRows, params.row.id];
              updatedSelectedRowsMonths = [...selectedRowsMonths, params.row.month];
            }
            setSelectedRows(updatedSelectedRows);
            setSelectedRowsMonths(updatedSelectedRowsMonths);
            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllChecked(updatedSelectedRows.length === filteredDataList.length);
          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 70,
      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 50,
      hide: !columnVisibilityList.serialNumber,
    },
    { field: "department", headerName: "Department", flex: 0, width: 140, hide: !columnVisibilityList.department },
    { field: "from", headerName: "From", flex: 0, width: 90, hide: !columnVisibilityList.from },
    { field: "to", headerName: "To", flex: 0, width: 90, hide: !columnVisibilityList.to },
    { field: "empcount", headerName: "Emp Count", flex: 0, width: 50, hide: !columnVisibilityList.empcount },

    { field: "totalctc", headerName: "Total CTC", flex: 0, width: 100, hide: !columnVisibilityList.totalctc },
    { field: "totalpf", headerName: "Total PF", flex: 0, width: 90, hide: !columnVisibilityList.totalpf },
    { field: "totalesi", headerName: "Total ESI", flex: 0, width: 90, hide: !columnVisibilityList.totalesi },
    { field: "totalproftax", headerName: "Total Prof. Tax", flex: 0, width: 80, hide: !columnVisibilityList.totalproftax },
    { field: "generatedon", headerName: "Generated On", flex: 0, width: 100, hide: !columnVisibilityList.generatedon },
    { field: "month", headerName: "Month", flex: 0, width: 80, hide: !columnVisibilityList.month },
    { field: "year", headerName: "Year", flex: 0, width: 60, hide: !columnVisibilityList.year },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0,
      width: 300,
      hide: !columnVisibilityList.actions,
      renderCell: (params) => {
        return (
          <Grid sx={{ display: "flex", gap: "8px" }}>
            {isUserRoleCompare?.includes("vproductionday") && (
              <Button color="success" size="small" onClick={(e) => handleDataFromChild(params.row)} variant="contained" sx={{ textTransform: "capitalize", padding: "4px" }}>
                View
              </Button>
            )}

            {isUserRoleCompare?.includes("vproductionday") && (
              <Button color="info" size="small" onClick={(e) => handleDataFromChildRerun(params.row)} variant="contained" sx={{ textTransform: "capitalize", padding: "4px" }}>
                Re run
              </Button>
            )}
            {isUserRoleCompare?.includes("vproductionday") && (
              <Button color="primary" size="small" onClick={(e) => handleDataFromChildDown(params.row)} variant="contained" sx={{ textTransform: "capitalize", padding: "4px" }}>
                Download
              </Button>
            )}

            {isUserRoleCompare?.includes("dproductionday") && (
              <Button color="error" size="small" onClick={(e) => handleDataFromChildDel(params.row)} variant="contained" sx={{ textTransform: "capitalize", padding: "4px" }}>
                Delete
              </Button>
            )}
          </Grid>
        );
      },
    },
  ];

  const rowDataTableList = filteredDataList.map((item, index) => {
    return {
      ...item,
      id: item._id,
      totalctc: Number(Number(item.totalctc).toFixed(2)),
      totalpf: Number(Number(item.totalpf).toFixed(2)),
      totalesi: Number(Number(item.totalesi).toFixed(2)),
      empcount: Number(item.empcount),
      // generatedon: moment(item.generatedon).format("DD-MM-YYYY HH:MM"),
      // from: moment(item.from).format("DD-MM-YYYY"),
      // to: moment(item.to).format("DD-MM-YYYY"),
    };
  });

  // Show All Columns functionality
  const handleShowAllColumnsList = () => {
    const updatedVisibility = { ...columnVisibilityList };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibilityList(updatedVisibility);
  };

  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem("columnVisibilityList");
    if (savedVisibility) {
      setColumnVisibilityList(JSON.parse(savedVisibility));
    }
  }, []);

  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem("columnVisibilityList", JSON.stringify(columnVisibilityList));
  }, [columnVisibilityList]);

  //  PDF
  const columnsList = [
    { title: "SNo", dataKey: "serialNumber" },
    { title: "Departmet", dataKey: "department" },
    { title: "From", dataKey: "from" },
    { title: "To", dataKey: "to" },
    { title: "Total CTC", dataKey: "totalctc" },
    { title: "Total PF", dataKey: "totalpf" },
    { title: "Total ESI", dataKey: "totalesi" },
    { title: "Total Prof.tax", dataKey: "totalproftax" },
    { title: "Genrated On", dataKey: "generatedon" },
    { title: "Month", dataKey: "month" },
    { title: "Year", dataKey: "year" },
  ];

  const downloadPdfList = () => {
    const doc = new jsPDF({
      orientation: "landscape",
    });

    const maxColumnsPerPage = 15; // Maximum number of columns per page
    const totalPages = Math.ceil(columnsList.length / maxColumnsPerPage); // Calculate total pages needed

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
      const startIdx = (currentPage - 1) * maxColumnsPerPage;
      const endIdx = Math.min(startIdx + maxColumnsPerPage, columnsList.length);

      const currentPageColumns = columnsList.slice(startIdx, endIdx);

      doc.autoTable({
        theme: "grid",
        styles: {
          fontSize: 5,
        },
        columns: currentPageColumns,
        body: rowDataTableList,
      });

      if (currentPage < totalPages) {
        doc.addPage(); // Add a new page if there are more columns to display
      }
    }

    doc.save("Pay Run List.pdf");
  };
  //print...
  const componentRefList = useRef();
  const handleprintList = useReactToPrint({
    content: () => componentRefList.current,
    documentTitle: "Pay Run List",
    pageStyle: "print",
  });
  // // Function to filter columns based on search query
  const filteredColumnsList = columnDataTableList.filter((column) => column.headerName.toLowerCase().includes(searchQueryManageList.toLowerCase()));
  // Manage Columns functionality
  const toggleColumnVisibilityList = (field) => {
    setColumnVisibilityList((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };
  // JSX for the "Manage Columns" popover content
  const manageColumnsContentList = (
    <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
      <Typography variant="h6">Manage Columns</Typography>
      <IconButton
        aria-label="close"
        onClick={handleCloseManageColumnsList}
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
        <TextField label="Find column" variant="standard" fullWidth value={searchQueryManageList} onChange={(e) => setSearchQueryManageList(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
      </Box>
      <br />
      <br />
      <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumnsList.map((column) => (
            <ListItem key={column.field}>
              <ListItemText sx={{ display: "flex" }} primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibilityList[column.field]} onChange={() => toggleColumnVisibilityList(column.field)} />} secondary={column.field === "checkbox" ? "Checkbox" : column.headerName} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Grid container>
          <Grid item md={4}>
            <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibilityList(initialColumnVisibilityList)}>
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
                columnDataTableList.forEach((column) => {
                  newColumnVisibility[column.field] = false; // Set hide property to true
                });
                setColumnVisibilityList(newColumnVisibility);
              }}
            >
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );
  return (
    <Box>
      <Headtitle title={"Pay Run List"} />
      {/* ****** Header Content ****** */}

      <PageHeading title="Pay Run List" modulename="PayRoll" submodulename="PayRoll Creation" mainpagename="Pay Run" subpagename="" subsubpagename="" />
      <Box sx={userStyle.dialogbox}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Typography sx={userStyle.importheadtext}>Pay run Creation</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item md={3} sm={6} xs={12}>
            <FormControl fullWidth size="small">
              <Typography>Department</Typography>
              <MultiSelect options={departments} value={selectedDepartment} onChange={handleDepartmentChange} valueRenderer={customValueRendererDepartment} />
            </FormControl>
          </Grid>

          <Grid item md={3} xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <Typography>
                Year<b style={{ color: "red" }}>*</b>
              </Typography>
              <Selects options={years} value={{ label: selectedYear, value: selectedYear }} onChange={handleYearChange} />
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <Typography>
                Month <b style={{ color: "red" }}>*</b>
              </Typography>
              <Selects options={selectedYear === "Select Year" ? [] : months} value={{ label: selectmonthname, value: selectmonthname }} onChange={handleMonthChange} />
            </FormControl>
          </Grid>

          <Grid item md={3} sm={6} xs={12} marginTop={3}>
            <Grid
              sx={{
                display: "flex",
                justifyContent: { sm: "center", md: "left", xs: "center", lg: "left" },
                gap: "15px",
              }}
            >
              <Button variant="contained" disabled={bankdetailBtn === true} onClick={handleFilter}>
                Run
              </Button>
              <Button sx={userStyle.btncancel} onClick={handleClear}>
                CLEAR
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <br />
      {isLoadStart && (
        <Box sx={userStyle.dialogbox}>
          {loaderData.every((d) => d.isvaluechanges != "Please Wait...") && (
            <Box sx={{ display: "flex", justifyContent: "end" }}>
              <Button variant="contained" onClick={() => fetchPayrunlistOnly()}>
                Back to List
              </Button>
            </Box>
          )}
          {loaderData && loaderData.length > 0 && (
            <>
              <Typography sx={{ fontWeight: "bold", color: "#000000bd" }}>{alert}% </Typography>

              {loaderData.map((item) => {
                return (
                  <>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography sx={{ fontWeight: "bold", color: item.isvaluechanges === "Success" ? "green" : item.isvaluechanges === "+/- Amount differ" ? "#c18b28" : "#000000bd" }}>{item.isvaluechanges} </Typography>
                      <Box sx={{ position: "relative", display: "inline-block", width: "100%" }}>
                        <BorderLinearProgress theme={theme} status={item.isvaluechanges} variant="determinate" value={100} />
                        <Box sx={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "100%", textAlign: "center" }}>
                          <Typography variant="body2" sx={{ color: item.isvaluechanges === "Success" ? "#112511" : item.isvaluechanges === "+/- Amount differ" ? "#6b5b10" : "white", fontWeight: "bolder", lineHeight: "1.3" }}>
                            {item.companyname}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </>
                );
              })}
            </>
          )}
        </Box>
      )}

      {isUserRoleCompare?.includes("lpayrun") && !isLoadStart && (
        <Box sx={userStyle.container}>
          {/* ******************************************************EXPORT Buttons****************************************************** */}

          <Grid container spacing={2}>
            <Grid item md={3} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Department</Typography>
                <StyledMultiSelect options={departments} value={selectedDepartmentFilter} onChange={handleDepartmentChangeFilter} valueRenderer={customValueRendererDepartmentFilter} />
              </FormControl>
            </Grid>

            <Grid item md={3} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>
                  Year<b style={{ color: "red" }}>*</b>
                </Typography>
                <Selects
                  options={years}
                  styles={{
                    menu: (provided) => ({
                      ...provided,
                      zIndex: 9999,
                    }),
                    menuList: (provided) => ({
                      ...provided,
                      zIndex: 9999,
                    }),
                  }}
                  value={{ label: selectedYearFilter, value: selectedYearFilter }}
                  onChange={handleYearChangeFilter}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>
                  Month <b style={{ color: "red" }}>*</b>
                </Typography>
                <Selects
                  styles={{
                    menu: (provided) => ({
                      ...provided,
                      zIndex: 9999,
                    }),
                    menuList: (provided) => ({
                      ...provided,
                      zIndex: 9999,
                    }),
                  }}
                  options={selectedYearFilter === "Select Year" ? [] : months}
                  value={{ label: selectmonthnameFilter, value: selectmonthnameFilter }}
                  onChange={handleMonthChangeFilter}
                />
              </FormControl>
            </Grid>

            <Grid item md={3} sm={6} xs={12} marginTop={3}>
              <Grid
                sx={{
                  display: "flex",
                  justifyContent: { sm: "center", md: "left", xs: "center", lg: "left" },
                  gap: "15px",
                }}
              >
                <Button variant="contained" disabled={bankdetailFilter === true} onClick={handleFilterData}>
                  Filter
                </Button>
                <Button sx={userStyle.btncancel} onClick={handleClearFilter}>
                  CLEAR
                </Button>
              </Grid>
            </Grid>
          </Grid>
          {/* <Grid item xs={8}>
            <Typography sx={userStyle.importheadtext}>Pay Run List</Typography>
          </Grid> */}

          <Grid container style={userStyle.dataTablestyle}>
            <Grid item md={2} xs={12} sm={12}>
              <Typography>Show entries:</Typography>
              <Box>
                <Select
                  id="pageSizeSelect"
                  size="small"
                  value={pageSizeList}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 180,
                        width: 80,
                      },
                    },
                  }}
                  onChange={handlePageSizeChangeList}
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
                {isUserRoleCompare?.includes("excelpayrun") && (
                  <>
                    <ExportXL
                      csvData={rowDataTableList.map((item, index) => ({
                        SNo: index + 1,
                        Department: item.department,
                        From: item.from,
                        To: item.to,
                        EmpCount: Number(item.empcount),
                        "Total CTC": Number(item.totalctc),
                        "Total PF": Number(item.totalpf),
                        "Total ESI": Number(item.totalesi),
                        "Total Prof.tax": Number(item.totalproftax),
                        "Generated On": item.generatedon,
                        Month: item.month,
                        Year: item.year,
                      }))}
                      fileName={fileName}
                    />
                  </>
                )}
                {isUserRoleCompare?.includes("csvpayrun") && (
                  <>
                    <ExportCSV
                      csvData={rowDataTableList.map((item, index) => ({
                        SNo: index + 1,
                        Department: item.department,
                        From: item.from,
                        To: item.to,
                        EmpCount: Number(item.empcount),
                        "Total CTC": Number(item.totalctc),
                        "Total PF": Number(item.totalpf),
                        "Total ESI": Number(item.totalesi),
                        "Total Prof.tax": Number(item.totalproftax),
                        "Generated On": item.generatedon,
                        Month: item.month,
                        Year: item.year,
                      }))}
                      fileName={fileName}
                    />
                  </>
                )}
                {isUserRoleCompare?.includes("printpayrun") && (
                  <>
                    <Button sx={userStyle.buttongrp} onClick={handleprintList}>
                      &ensp;
                      <FaPrint />
                      &ensp;Print&ensp;
                    </Button>
                  </>
                )}
                {isUserRoleCompare?.includes("pdfpayrun") && (
                  <>
                    <Button sx={userStyle.buttongrp} onClick={() => downloadPdfList()}>
                      <FaFilePdf />
                      &ensp;Export to PDF&ensp;
                    </Button>
                  </>
                )}
                {isUserRoleCompare?.includes("imagepayrun") && (
                  <Button sx={userStyle.buttongrp} onClick={handleCaptureImageList}>
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
                  <OutlinedInput id="component-outlined" type="text" value={searchQueryList} onChange={handleSearchChangeList} />
                </FormControl>
              </Box>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item md={12} xs={12} sm={12} marginTop={1}>
              <Box>
                <Button sx={userStyle.buttongrpexp} size="small" onClick={handleShowAllColumnsList}>
                  Show All Columns
                </Button>
                <Button sx={userStyle.buttongrpexp} size="small" onClick={handleOpenManageColumnsList}>
                  Manage Columns
                </Button>
                &ensp;
                <Button color="primary" variant="contained" onClick={handleBulkDownloadExcel}>
                  Bulk Download Excel
                </Button>
                &ensp;
                <Button color="warning" variant="contained" onClick={() => handleBulkDelete()}>
                  Bulk Delete
                </Button>
                {/* Manage Column */}
                <Popover
                  id={idList}
                  open={isManageColumnsOpenList}
                  anchorEl={anchorElList}
                  onClose={handleCloseManageColumnsList}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  {manageColumnsContentList}
                </Popover>
              </Box>
            </Grid>
          </Grid>

          {isBankdetail || bankdetailFilter ? (
            <>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
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
                <CustomStyledDataGrid
                  onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                  rows={rowDataTableList}
                  columns={columnDataTableList.filter((column) => columnVisibilityList[column.field])}
                  onSelectionModelChange={handleSelectionChange}
                  autoHeight={true}
                  ref={gridRefList}
                  density="compact"
                  hideFooter
                  getRowClassName={getRowClassName}
                  disableRowSelectionOnClick
                  columnBuffer={90}
                />
              </Box>
              <Box style={userStyle.dataTablestyle}>
                <Box>
                  Showing {filteredDataList.length > 0 ? (pageList - 1) * pageSizeList + 1 : 0} to {Math.min(pageList * pageSizeList, filteredDatasList.length)} of {filteredDatasList.length} entries
                </Box>
                <Box>
                  <Button onClick={() => setPageList(1)} disabled={pageList === 1} sx={userStyle.paginationbtn}>
                    <FirstPageIcon />
                  </Button>
                  <Button onClick={() => handlePageChangeList(pageList - 1)} disabled={pageList === 1} sx={userStyle.paginationbtn}>
                    <NavigateBeforeIcon />
                  </Button>
                  {pageNumbersList?.map((pageNumberList) => (
                    <Button key={pageNumberList} sx={userStyle.paginationbtn} onClick={() => handlePageChangeList(pageNumberList)} className={pageList === pageNumberList ? "active" : ""} disabled={pageList === pageNumberList}>
                      {pageNumberList}
                    </Button>
                  ))}
                  {lastVisiblePageList < totalPagesList && <span>...</span>}
                  <Button onClick={() => handlePageChangeList(pageList + 1)} disabled={pageList === totalPagesList} sx={userStyle.paginationbtn}>
                    <NavigateNextIcon />
                  </Button>
                  <Button onClick={() => setPageList(totalPagesList)} disabled={pageList === totalPagesList} sx={userStyle.paginationbtn}>
                    <LastPageIcon />
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </Box>
      )}

      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "400px", textAlign: "center", alignItems: "center" }}>
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <Dialog open={isViewOpen} onClose={handleCloseModView} fullWidth={true} aria-labelledby="alert-dialog-title-view" aria-describedby="alert-dialog-description-view" maxWidth={"1600px"}>
        <DialogContent sx={{ padding: "20px" }}>
          <Box>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item md={8} xs={12} sm={12}>
              <Typography sx={userStyle.importheadtext}>
                <span style={{ fontSize: "20px" }}>Pay Run List </span>- <span style={{ fontWeight: "700", fontSize: "22px" }}>{viewlistname}</span>
              </Typography>
            </Grid>
            <Grid container style={userStyle.dataTablestyle}>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <label>Show entries:</label>
                  <Select
                    id="pageSizeSelect"
                    value={pageSize}
                    size="small"
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
                  {isUserRoleCompare?.includes("excelpayrun") && (
                    <>
                      {/* <ExportXL
                        csvData={rowDataTable.map((t, index) => ({
                          Sno: index + 1,
                          Department: t.department,
                          Company: t.company,
                          Branch: t.branch,
                          Unit: t.unit,
                          Team: t.team,
                          Designation: t.designation,
                          'Employee Name': t.companyname,
                          'Employee Code': t.empcode,
                          'Aadhar Name': t.legalname,
                          'Process Code': t.processcode,
                          DOJ: t.doj,
                          'Experience In Month': Number(t.experience),
                          'ProcessCode Exp': t.processcodeexp,
                          'Total No Of Days': Number(t.totalnumberofdays),
                          'Total Shift': Number(t.totalshift),
                          CLSL: Number(t.clsl),
                          'Week Off': Number(t.weekoffcount),
                          Holiday: Number(t.holiday),
                          'Total Absent/Leave': Number(t.totalasbleave),
                          'Total Paid Days': Number(t.totalpaidDays),

                          Gross: Number(t.oldgross),
                          Basic: Number(t.oldbasic),
                          HRA: Number(t.oldhra),
                          Conveyance: Number(t.oldconveyance),
                          'Medical Allowance': Number(t.oldmedicalallowance),
                          'Production Allowance': Number(t.oldproductionallowance),
                          'Production Allowance 2': Number(t.oldproductionallowancetwo),
                          'Other Allowance': Number(t.oldotherallowance),

                          'New Gross': Number(t.gross),
                          'Actual Basic': Number(t.basic),
                          'Actual HRA': Number(t.hra),
                          'Actual Conveyance': Number(t.conveyance),
                          'Actual Medical Allowance': Number(t.medicalallowance),
                          'Actual Production Allowance': Number(t.productionallowance),
                          'Actual Production Allowance 2': Number(t.productionallowancetwo),
                          'Actual Other Allowance': Number(t.otherallowance),

                          'Target Points': Number(t.monthPoint),
                          'Achieved Points': Number(t.acheivedpoints),
                          'Achieved  %': Number(t.acheivedpercent),
                          'Achieved Production Allowance': Number(t.acheivedproductionallowance),
                          'Actual Net Salary': Number(t.actualnetsalary),
                          'LOP Basic': Number(t.lopbasic),
                          'LOP HRA': Number(t.lophra),
                          'LOP Conveyance': Number(t.lopconveyance),
                          'LOP Medical Allowance': Number(t.lopmedicalallowance),
                          'LOP Production Allowance': Number(t.lopproductionallowance),
                          'LOP Other Allowance': Number(t.lopotherallowance),
                          'LOP Net Salary': Number(t.lopnetsalary),
                          'Prod Basic': Number(t.prodbasic),
                          'Prod HRA': Number(t.prodhra),
                          'Prod Conveyance': Number(t.prodconveyance),
                          'Prod Medical Allowance': Number(t.prodmedicalallowance),
                          'Prod Production Allowance': Number(t.prodproductionallowance),
                          'Prod Other Allowance': Number(t.prodotherallowance),
                          'Attendance LOP': Number(t.attendancelop),
                          'Calculated Net Salary': Number(t.calculatednetsalary),
                          'Actual Penalty Amount': Number(t.penalty),
                          'Penalty Amount': Number(t.penaltyamount),
                          'Loss Deduction': Number(t.lossdeduction),
                          'Other Deduction': Number(t.otherdeduction),
                          'Final Basic': Number(t.finalbasic),
                          'Final HRA': Number(t.finalhra),
                          'Final Conveyance': Number(t.finalconveyance),
                          'Final Medical Allowance': Number(t.finalmedicalallowance),
                          'Final Production Allowance': Number(t.finalproductionallowance),
                          'Final Other Allowance': Number(t.finalotherallowance),
                          'Final Net Salary': Number(t.finalnetsalary),
                          'PF Days': Number(t.pfdays),
                          'NCP Days': Number(t.ncpdays),
                          'PF Deduction': Number(t.pfdeduction),
                          'ESI Deduction': Number(t.esideduction),
                          'Final-LOP': Number(t.finallopdays),
                          'Final LOP Days': Number(t.paysliplop),
                          'Final Leave Deduction': Number(t.finalleavededuction),
                          'Professional Tax': Number(t.professionaltax),
                          'Total Deductions': Number(t.totaldeductions),
                          UAN: t.uan,
                          'IP Name': t.ipname,
                          'No. Allowance Shift': Number(t.noallowancepoint),
                          'Shift Allowance Point': Number(t.allowancepoint),
                          'Shift Allowance Target': Number(t.shiftallowancetarget),
                          'Night Shift Allowance': Number(t.nightshiftallowance),
                          'Final Salary': Number(t.finalsalary),
                          'Final Salary-Penalty': Number(t.finalsalarypenalty),
                          'Total Points Value': Number(t.totalpointsvalue),
                          ERA: Number(t.eramount),
                          'Actual ERA': Number(t.era),
                          'PF Employer Deduction': Number(t.pfemployerdeduction),
                          'ESI Employer Deduction': Number(t.esiemployerdeduction),
                          CTC: Number(t.ctc),
                          'Revenue Allowance': Number(t.revenueallow),
                          'Final Value': Number(t.finalvalue),
                          'Final Value-Penalty': Number(t.finalvaluepenalty),
                          Shortage: Number(t.shortage),
                          'Shortage 1': Number(t.shortageone),
                          'Actual Deduction': Number(t.actualdeduction),
                          'Minimum Deduction': Number(t.minimumdeduction),
                          'Final Value Review': t.finalvaluereview,
                          'Final Value Status': t.finalvaluestatus,
                          'Final Value Penalty Status': t.finalvaluepenaltystatus,

                          //FIXED
                          'Fixed Loss Deduction': Number(t.fixedlossdeduction),
                          Fixed_NET_Salary: Number(t.fixednetsalary),
                          'Fixed Basic': Number(t.fixedbasic),
                          'Fixed HRA': Number(t.fixedhra),
                          'Fixed Conveyance': Number(t.fixedconveyance),
                          'Fixed Medical Allowance': Number(t.fixedmedicalallowance),
                          'Fixed Production Allowance': Number(t.fixedproductionallowance),
                          'Fixed Other Allowance': Number(t.fixedotherallowance),
                          Fixed_NET_Salary1: Number(t.fixednetsalaryone),
                          Fixed_Emp_pf: Number(t.fixedemppf),
                          Fixed_Emp_Esi: Number(t.fixedempesi),
                          Fixed_Emp_tax: Number(t.fixedempptax),
                          'Fixed Empr_pf': Number(t.fixedemprpf),
                          'Fixed Empr_Esi': Number(t.fixedempresi),
                          Fixed_Shift_Allowance: Number(t.fixedshiftallowance),
                          'Fixed Total Deductions': Number(t.fixedtotaldeductions),
                          'Fixed Salary': Number(t.fixedsalary),
                          'Fixed Salary+Penalty': Number(t.fixedsalarypenalty),
                          'Fixed-LOP': Number(t.fixedlop),
                          'Fixed LOP Days': Number(t.fixedlopdays),
                          'Fixed Leave Deduction': Number(t.fixedleavededuction),
                          'Fixed CTC': Number(t.fixedctc),
                          'Fixed Final Value': Number(t.fixedfinalvalue),
                          'Fixed Actual Deduction': Number(t.fixedactualdeduction),
                          'Fixed Minimum Deduction': Number(t.fixedminimumdeduction),

                          //PRODUCTION

                          'PROD Loss Deduction': Number(t.prodlossdeduction),
                          PROD_NET_Salary: Number(t.prodnetsalary),
                          'PROD Basic': Number(t.prodbasicp),
                          'PROD HRA': Number(t.prodhrap),
                          'PROD Conveyance': Number(t.prodconveyancep),
                          'PROD Medical Allowance': Number(t.prodmedicalallowancep),
                          'PROD Production Allowance': Number(t.prodproductionallowancep),
                          'PROD Other Allowance': Number(t.prodotherallowancep),
                          PROD_NET_Salary1: Number(t.prodnetsalaryonep),

                          PROD_Emp_pf: Number(t.prodemppf),
                          PROD_Emp_esi: Number(t.prodempesi),
                          PROD_Emp_tax: Number(t.prodempptax),
                          PROD_Empr_pf: Number(t.prodemprpf),
                          PROD_Empr_Esi: Number(t.prodempresi),
                          PROD_Shift_Allowance: Number(t.prodshiftallowance),
                          'PROD Total Deductions': Number(t.prodtotaldeductions),

                          'PROD Salary': Number(t.prodsalary),
                          'PROD Salary+Penalty': Number(t.prodsalarypenalty),
                          'PROD LOP Days': Number(t.prodlopdays),
                          'PROD LOP': Number(t.prodlop),
                          'PROD Leave Deduction': Number(t.prodleavededuction),

                          'PROD CTC': Number(t.prodctc),
                          'PROD Final Value': Number(t.prodfinalvalue),

                          'PROD Actual Deduction': Number(t.prodactualdeduction),
                          'PROD Minimum Deduction': Number(t.prodminimumdeduction),

                          'Banck Name': t.bankname,
                          'Account Name': t.accountname,
                          'Account Number': t.accountnumber,
                          'IFSC Code': t.ifsccode,

                          [`Current (${monthsArr[Number(selectedViewMonthNum) + 1 > 12 ? 0 : Number(selectedViewMonthNum)]}) Month Avg`]: Number(t.currentmonthavg),
                          [`Current (${monthsArr[Number(selectedViewMonthNum) + 1 > 12 ? 0 : Number(selectedViewMonthNum)]}) Month Attendance`]: Number(t.currentmonthattendance),
                          'Paid Status': t.paidstatus,
                          'Salary Type': t.salarytype,
                          'Deduction Type': t.deductiontype,
                        }))}
                        fileName={`Pay Run List - ${viewlistname}`}
                      /> */}
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);

                          setFormat("xl");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileExcel />
                        &ensp;Export to Excel&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvpayrun") && (
                    <>
                      {/* <ExportCSV
                        csvData={rowDataTable.map((t, index) => ({
                          Sno: index + 1,
                          Department: t.department,
                          Company: t.company,
                          Branch: t.branch,
                          Unit: t.unit,
                          Team: t.team,
                          Designation: t.designation,
                          'Employee Name': t.companyname,
                          'Aadhar Name': t.legalname,
                          'Process Code': t.processcode,
                          DOJ: t.doj,
                          'Experience In Month': Number(t.experience),
                          'ProcessCode Exp': t.processcodeexp,
                          'Total No Of Days': Number(t.totalnumberofdays),
                          'Total Shift': Number(t.totalshift),
                          CLSL: Number(t.clsl),
                          'Week Off': Number(t.weekoffcount),
                          Holiday: Number(t.holiday),
                          'Total Absent/Leave': Number(t.totalasbleave),
                          'Total Paid Dyas': Number(t.totalpaidDays),

                          Gross: Number(t.oldgross),
                          Basic: Number(t.oldbasic),
                          HRA: Number(t.oldhra),
                          Conveyance: Number(t.oldconveyance),
                          'Medical Allowance': Number(t.oldmedicalallowance),
                          'Production Allowance': Number(t.oldproductionallowance),
                          'Production Allowance 2': Number(t.oldproductionallowancetwo),
                          'Other Allowance': Number(t.oldotherallowance),

                          'New Gross': Number(t.gross),
                          'Actual Basic': Number(t.basic),
                          'Actual HRA': Number(t.hra),
                          'Actual Conveyance': Number(t.conveyance),
                          'Actual Medical Allowance': Number(t.medicalallowance),
                          'Actual Production Allowance': Number(t.productionallowance),
                          'Actual Production Allowance 2': Number(t.productionallowancetwo),
                          'Actual Other Allowance': Number(t.otherallowance),

                          'Target Points': Number(t.monthPoint),
                          'Achieved Points': Number(t.acheivedpoints),
                          'Achieved  %': Number(t.acheivedpercent),
                          'Achieved Production Allowance': Number(t.acheivedproductionallowance),
                          'Actual Net Salary': Number(t.actualnetsalary),
                          'LOP Basic': Number(t.lopbasic),
                          'LOP HRA': Number(t.lophra),
                          'LOP Conveyance': Number(t.lopconveyance),
                          'LOP Medical Allowance': Number(t.lopmedicalallowance),
                          'LOP Production Allowance': Number(t.lopproductionallowance),
                          'LOP Other Allowance': Number(t.lopotherallowance),
                          'LOP Net Salary': Number(t.lopnetsalary),
                          'Prod Basic': Number(t.prodbasic),
                          'Prod HRA': Number(t.prodhra),
                          'Prod Conveyance': Number(t.prodconveyance),
                          'Prod Medical Allowance': Number(t.prodmedicalallowance),
                          'Prod Production Allowance': Number(t.prodproductionallowance),
                          'Prod Other Allowance': Number(t.prodotherallowance),
                          'Attendance LOP': Number(t.attendancelop),
                          'Calculated Net Salary': Number(t.calculatednetsalary),
                          'Actual Penalty Amount': Number(t.penalty),
                          'Penalty Amount': Number(t.penaltyamount),
                          'Loss Deduction': Number(t.lossdeduction),
                          'Other Deduction': Number(t.otherdeduction),
                          'Final Basic': Number(t.finalbasic),
                          'Final HRA': Number(t.finalhra),
                          'Final Conveyance': Number(t.finalconveyance),
                          'Final Medical Allowance': Number(t.finalmedicalallowance),
                          'Final Production Allowance': Number(t.finalproductionallowance),
                          'Final Other Allowance': Number(t.finalotherallowance),
                          'Final Net Salary': Number(t.finalnetsalary),
                          'PF Days': Number(t.pfdays),
                          'NCP Days': Number(t.ncpdays),
                          'PF Deduction': Number(t.pfdeduction),
                          'ESI Deduction': Number(t.esideduction),
                          'Final-LOP': Number(t.finallopdays),
                          'Final LOP Days': Number(t.paysliplop),
                          'Final Leave Deduction': Number(t.finalleavededuction),
                          'Professional Tax': Number(t.professionaltax),
                          'Total Deductions': Number(t.totaldeductions),
                          UAN: t.uan,
                          'IP Name': t.ipname,
                          'No. Allowance Shift': Number(t.noallowancepoint),
                          'Shift Allowance Point': Number(t.allowancepoint),
                          'Shift Allowance Target': Number(t.shiftallowancetarget),
                          'Night Shift Allowance': Number(t.nightshiftallowance),
                          'Final Salary': Number(t.finalsalary),
                          'Final Salary-Penalty': Number(t.finalsalarypenalty),
                          'Total Points Value': Number(t.totalpointsvalue),
                          ERA: Number(t.eramount),
                          'Actual ERA': Number(t.era),
                          'PF Employer Deduction': Number(t.pfemployerdeduction),
                          'ESI Employer Deduction': Number(t.esiemployerdeduction),
                          CTC: Number(t.ctc),
                          'Revenue Allowance': Number(t.revenueallow),
                          'Final Value': Number(t.finalvalue),
                          'Final Value-Penalty': Number(t.finalvaluepenalty),
                          Shortage: Number(t.shortage),
                          'Shortage 1': Number(t.shortageone),
                          'Actual Deduction': Number(t.actualdeduction),
                          'Minimum Deduction': Number(t.minimumdeduction),
                          'Final Value Review': t.finalvaluereview,
                          'Final Value Status': t.finalvaluestatus,
                          'Final Value Penalty Status': t.finalvaluepenaltystatus,

                          //FIXED
                          'Fixed Loss Deduction': Number(t.fixedlossdeduction),
                          Fixed_NET_Salary: Number(t.fixednetsalary),
                          'Fixed Basic': Number(t.fixedbasic),
                          'Fixed HRA': Number(t.fixedhra),
                          'Fixed Conveyance': Number(t.fixedconveyance),
                          'Fixed Medical Allowance': Number(t.fixedmedicalallowance),
                          'Fixed Production Allowance': Number(t.fixedproductionallowance),
                          'Fixed Other Allowance': Number(t.fixedotherallowance),
                          Fixed_NET_Salary1: Number(t.fixednetsalaryone),
                          Fixed_Emp_pf: Number(t.fixedemppf),
                          Fixed_Emp_Esi: Number(t.fixedempesi),
                          Fixed_Emp_tax: Number(t.fixedempptax),
                          'Fixed Empr_pf': Number(t.fixedemprpf),
                          'Fixed Empr_Esi': Number(t.fixedempresi),
                          Fixed_Shift_Allowance: Number(t.fixedshiftallowance),
                          'Fixed Total Deductions': Number(t.fixedtotaldeductions),
                          'Fixed Salary': Number(t.fixedsalary),
                          'Fixed Salary+Penalty': Number(t.fixedsalarypenalty),
                          'Fixed-LOP': Number(t.fixedlop),
                          'Fixed LOP Days': Number(t.fixedlopdays),
                          'Fixed Leave Deduction': Number(t.fixedleavededuction),
                          'Fixed CTC': Number(t.fixedctc),
                          'Fixed Final Value': Number(t.fixedfinalvalue),
                          'Fixed Actual Deduction': Number(t.fixedactualdeduction),
                          'Fixed Minimum Deduction': Number(t.fixedminimumdeduction),

                          //PRODUCTION

                          'PROD Loss Deduction': Number(t.prodlossdeduction),
                          PROD_NET_Salary: Number(t.prodnetsalary),
                          'PROD Basic': Number(t.prodbasicp),
                          'PROD HRA': Number(t.prodhrap),
                          'PROD Conveyance': Number(t.prodconveyancep),
                          'PROD Medical Allowance': Number(t.prodmedicalallowancep),
                          'PROD Production Allowance': Number(t.prodproductionallowancep),
                          'PROD Other Allowance': Number(t.prodotherallowancep),
                          PROD_NET_Salary1: Number(t.prodnetsalaryonep),

                          PROD_Emp_pf: Number(t.prodemppf),
                          PROD_Emp_esi: Number(t.prodempesi),
                          PROD_Emp_tax: Number(t.prodempptax),
                          PROD_Empr_pf: Number(t.prodemprpf),
                          PROD_Empr_Esi: Number(t.prodempresi),
                          PROD_Shift_Allowance: Number(t.prodshiftallowance),
                          'PROD Total Deductions': Number(t.prodtotaldeductions),

                          'PROD Salary': Number(t.prodsalary),
                          'PROD Salary+Penalty': Number(t.prodsalarypenalty),
                          'PROD LOP Days': Number(t.prodlopdays),
                          'PROD LOP': Number(t.prodlop),
                          'PROD Leave Deduction': Number(t.prodleavededuction),

                          'PROD CTC': Number(t.prodctc),
                          'PROD Final Value': Number(t.prodfinalvalue),

                          'PROD Actual Deduction': Number(t.prodactualdeduction),
                          'PROD Minimum Deduction': Number(t.prodminimumdeduction),

                          'Banck Name': t.bankname,
                          'Account Name': t.accountname,
                          'Account Number': t.accountnumber,
                          'IFSC Code': t.ifsccode,

                          [`Current (${monthsArr[Number(selectedViewMonthNum) + 1 > 12 ? 0 : Number(selectedViewMonthNum)]}) Month Avg`]: Number(t.currentmonthavg),
                          [`Current (${monthsArr[Number(selectedViewMonthNum) + 1 > 12 ? 0 : Number(selectedViewMonthNum)]}) Month Attendance`]: Number(t.currentmonthattendance),
                          'Paid Status': t.paidstatus,
                          'Salary Type': t.salarytype,
                          'Deduction Type': t.deductiontype,
                        }))}
                        fileName={`Pay Run List - ${viewlistname}`}
                      /> */}
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);

                          setFormat("csv");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileExcel />
                        &ensp;Export to Excel&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("printpayrun") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfpayrun") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={() => setIsPdfFilterOpen(true)}>
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imagepayrun") && (
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                      {" "}
                      <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                    </Button>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={6} sm={6}>
                {/* <Box>
                  <FormControl fullWidth size="small">
                    <Typography>Search</Typography>
                    <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
                  </FormControl>
                </Box> */}
                <Box>
                  <OutlinedInput size="small" variant="outlined" onChange={onQuickFilterChanged} style={{ width: "100%" }} />
                </Box>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item md={7} xs={12} sm={12} marginTop={3}>
                <Box>
                  <Button
                    sx={userStyle.buttongrpexp}
                    size="small"
                    onClick={() => setColumnVisibility(initialColumnVisibility)}
                  // onClick={handleShowAllColumns}
                  >
                    Show All Columns
                  </Button>
                  <Button sx={userStyle.buttongrpexp} size="small" onClick={handleOpenManageColumns}>
                    Manage Columns
                  </Button>
                  Jump to:-
                  <input type="text" style={{ padding: "8px", borderRadius: "4px" }} placeholder="Enter header name" ref={inputRef} value={columnName} onChange={handleColumnChange} />
                </Box>
              </Grid>
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
              <Grid item md={2} xs={12} sm={6}>
                {/* <FormControl fullWidth size="small">
                  <Typography>
                    Year<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects options={years} value={{ label: selectedYear, value: selectedYear }} onChange={handleYearChange} />
                </FormControl> */}
              </Grid>
              <Grid item md={2} xs={12} sm={6}>
                {/* <FormControl fullWidth size="small">
                  <Typography>
                    Month <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects options={months} value={{ label: selectedMonth, value: selectedMonth }} onChange={handleMonthChange} />
                </FormControl> */}
              </Grid>
              <Grid item md={2} xs={12} sm={6} marginTop={3}>
                {/* <Button variant="contained" onClick={() => handleFilter()}>
                  Filter
                </Button> */}
              </Grid>
            </Grid>

            {isBankdetail ? (
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
                    height: 500,

                    width: "100%",
                    // overflowY: "hidden", // Hide the y-axis scrollbar
                  }}
                  className="ag-theme-quartz"
                >
                  <AgGridReact
                    columnDefs={columnDataTable}
                    rowData={rowDataTable}
                    // onCellValueChanged={onCellValueChanged}
                    context={context}
                    // pagination={true}
                    defaultColDef={{
                      flex: 0,
                      resizable: true,
                      wrapHeaderText: true,
                      autoHeaderHeight: true,
                      sortable: true,
                      filter: true,
                    }}
                    ref={gridRef}
                    onGridReady={onGridReady}
                    getRowId={(params) => params.data.id}
                    getRowNodeId={(data) => data.id}
                  // domLayout="autoHeight"
                  />
                </Box>

                <Box style={userStyle.dataTablestyle}>
                  <Box>
                    Showing {rowData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, rowData.length)} of {rowData.length} entries
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
                      <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={currentPage === pageNumber ? "active" : ""} disabled={currentPage === pageNumber}>
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
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" onClick={handleCloseModView}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDelOpen} onClose={handleCloseModDel} aria-labelledby="alert-dialog-title-delete" aria-describedby="alert-dialog-description-delete">
        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
          <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
            Are you sure? to Delete '({deleteIdDataName})'
          </Typography>
        </DialogContent>
        <DialogActions>
          <LoadingButton loading={delLoad} onClick={handleDeleteList} variant="contained" color="error" sx={{ textTransform: "capitalize" }}>
            Yes
          </LoadingButton>
          <Button sx={userStyle.btncancel} onClick={handleCloseModDel}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isRerunOpen} onClose={handleCloseModRerun} aria-labelledby="alert-dialog-title-delete" maxWidth={"md"} fullWidth={true} aria-describedby="alert-dialog-description-delete">
        <DialogTitle>
          <Grid container>
            <Grid item md={10} sm={10} lg={10} xs={10}>
              {" "}
              <Typography sx={userStyle.SubHeaderText}>Please Select Mode</Typography>{" "}
            </Grid>
            <Grid item md={2} sm={2} lg={2} xs={2} sx={{ display: "flex", justifyContent: "end" }}>
              <IconButton edge="end" color="inherit" onClick={handleCloseModRerun} aria-label="close">
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent dividers sx={{ padding: "20px" }}>
          <Grid container spacing={2}>
            <Grid item md={3} sm={6} lg={3} xs={12}>
              <Button variant="contained" sx={{ textTransform: "capitalize" }} color="warning" onClick={() => handleRerunSubmit()}>
                All Employee Run
              </Button>
            </Grid>
            <Grid item md={4} sm={6} lg={4} xs={12}>
              <Button variant="contained" sx={{ textTransform: "capitalize" }} color="warning" onClick={() => handleRerunWithoutEdiSubmit()}>
                Without Edit Employee Run
              </Button>
            </Grid>
            <Grid item md={4} sm={6} lg={4} xs={12}>
              <Button variant="contained" sx={{ textTransform: "capitalize" }} color="warning" onClick={() => handleRerunWithEdiSubmit()}>
                With Edit Employee Run
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      <Dialog open={bulkDelOpenCheck} onClose={handlebulkDelCloseCheck} aria-labelledby="alert-dialog-title-delete-BULK" aria-describedby="alert-dialog-description-delete-BULK">
        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
          <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
            Are you sure?
          </Typography>
        </DialogContent>
        <DialogActions>
          <LoadingButton loading={delLoad} onClick={() => handleDeleteBulkCheckList()} variant="contained" color="error" sx={{ textTransform: "capitalize" }}>
            Yes
          </LoadingButton>
          <Button sx={userStyle.btncancel} onClick={() => handlebulkDelCloseCheck()}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={bankRleasePop} onClose={handleBankRleasePopClose} aria-labelledby="alert-dialog-title-delete-BULK" maxWidth={"md"} aria-describedby="alert-dialog-description-delete-BULK">
        <DialogContent>
          {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} /> */}
          <Typography variant="h5">Bank Release Datas</Typography>
          <TableContainer>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell> Name</StyledTableCell>
                  <StyledTableCell> Empcode</StyledTableCell>
                  <StyledTableCell> Date</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {bankReleaseDatas.map((row) => (
                  <StyledTableRow>
                    <StyledTableCell> {row.companyname}</StyledTableCell>
                    <StyledTableCell> {row.empcode}</StyledTableCell>
                    <StyledTableCell> {row.updatechangedate ? row.updatechangedate : row.paydate}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          {/* <LoadingButton
            loading={delLoad}
            onClick={() => handleDeleteBulkCheckList()}
            variant="contained" color="error"
            sx={{ textTransform: "capitalize" }}
          >
            Yes
          </LoadingButton > */}
          <Button onClick={() => hanleBankReleaseDataRemove()} variant="contained" color="primary">
            Yes
          </Button>
          <Button sx={userStyle.btncancel} onClick={() => hanleBankReleaseDataNotRemove()}>
            No
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={bankRleasePopAllEmp} onClose={handleBankRleasePopCloseAllEmp} aria-labelledby="alert-dialog-title-delete-BULK" maxWidth={"md"} aria-describedby="alert-dialog-description-delete-BULK">
        <DialogContent>
          {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} /> */}
          <Typography variant="h5">Bank Release Datas</Typography>
          <TableContainer>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell> Name</StyledTableCell>
                  <StyledTableCell> Empcode</StyledTableCell>
                  <StyledTableCell> Date</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {bankReleaseDatas.map((row) => (
                  <StyledTableRow>
                    <StyledTableCell> {row.companyname}</StyledTableCell>
                    <StyledTableCell> {row.empcode}</StyledTableCell>
                    <StyledTableCell> {row.updatechangedate ? row.updatechangedate : row.paydate}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => hanleBankReleaseDataRemoveAllEmp()} variant="contained" color="primary">
            Yes
          </Button>
          <Button sx={userStyle.btncancel} onClick={() => hanleBankReleaseDataNotRemoveAllEmp()}>
            No
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={bankRleasePopWithoutEdit} onClose={handleBankRleasePopCloseWithoutEdit} aria-labelledby="alert-dialog-title-delete-BULK" maxWidth={"md"} aria-describedby="alert-dialog-description-delete-BULK">
        <DialogContent>
          {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} /> */}
          <Typography variant="h5">Bank Release Datas</Typography>
          <TableContainer>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell> Name</StyledTableCell>
                  <StyledTableCell> Empcode</StyledTableCell>
                  <StyledTableCell> Date</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {bankReleaseDatas.map((row) => (
                  <StyledTableRow>
                    <StyledTableCell> {row.companyname}</StyledTableCell>
                    <StyledTableCell> {row.empcode}</StyledTableCell>
                    <StyledTableCell> {row.updatechangedate ? row.updatechangedate : row.paydate}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => hanleBankReleaseDataRemoveWithoutEdit()} variant="contained" color="primary">
            Yes
          </Button>
          <Button sx={userStyle.btncancel} onClick={() => hanleBankReleaseDataNotRemoveWithoutEdit()}>
            No
          </Button>
        </DialogActions>
      </Dialog>

      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table aria-label="simple table" id="branch" ref={componentRefList}>
          <TableHead sx={{ fontWeight: "600" }}>
            <StyledTableRow>
              <StyledTableCell>S.NO</StyledTableCell>
              <StyledTableCell>Department</StyledTableCell>
              <StyledTableCell>From</StyledTableCell>
              <StyledTableCell>To</StyledTableCell>
              <StyledTableCell>Emp Count</StyledTableCell>
              <StyledTableCell>Total CTC</StyledTableCell>
              <StyledTableCell>Total PF</StyledTableCell>
              <StyledTableCell>Total ESI</StyledTableCell>
              <StyledTableCell>Total Prof.tax</StyledTableCell>
              <StyledTableCell>Generated On</StyledTableCell>
              <StyledTableCell>Month </StyledTableCell>
              <StyledTableCell>Year </StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {rowDataTableList &&
              rowDataTableList.map((item, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{item.department}</StyledTableCell>
                  <StyledTableCell>{item.from}</StyledTableCell>
                  <StyledTableCell>{item.to}</StyledTableCell>
                  <StyledTableCell>{item.empcount}</StyledTableCell>
                  <StyledTableCell>{item.totalctc}</StyledTableCell>
                  <StyledTableCell>{item.totalpf}</StyledTableCell>
                  <StyledTableCell>{item.totalesi}</StyledTableCell>
                  <StyledTableCell>{item.totalproftax}</StyledTableCell>
                  <StyledTableCell>{item.generatedon}</StyledTableCell>
                  <StyledTableCell>{item.month}</StyledTableCell>
                  <StyledTableCell>{item.year}</StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table aria-label="simple-tablepayrun" id="payrun" ref={componentRef}>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>S.no</StyledTableCell>
              <StyledTableCell>Department</StyledTableCell>
              <StyledTableCell>Company</StyledTableCell>
              <StyledTableCell>Branch</StyledTableCell>
              <StyledTableCell>Unit</StyledTableCell>
              <StyledTableCell>Team</StyledTableCell>
              <StyledTableCell>Designation</StyledTableCell>
              <StyledTableCell>Employee Name</StyledTableCell>
              <StyledTableCell>Aadhar Name</StyledTableCell>
              <StyledTableCell>Process Code</StyledTableCell>
              <StyledTableCell>DOJ</StyledTableCell>
              <StyledTableCell>Actual Exp</StyledTableCell>
              <StyledTableCell>Prod Exp</StyledTableCell>
              <StyledTableCell>Total No of Dyas</StyledTableCell>
              <StyledTableCell>Total Shift</StyledTableCell>
              <StyledTableCell>CLSL</StyledTableCell>
              <StyledTableCell>Week Off</StyledTableCell>
              <StyledTableCell>Holiday</StyledTableCell>
              <StyledTableCell>Total Absent/Leave</StyledTableCell>
              <StyledTableCell>Total Paid Days</StyledTableCell>

              <StyledTableCell>Gross</StyledTableCell>

              <StyledTableCell>Basic</StyledTableCell>
              <StyledTableCell>HRA</StyledTableCell>
              <StyledTableCell>Conveyance</StyledTableCell>
              <StyledTableCell>Medical Allowance</StyledTableCell>
              <StyledTableCell>Production Allowance</StyledTableCell>
              <StyledTableCell>Production Allowance 2</StyledTableCell>
              <StyledTableCell>Other Allowance</StyledTableCell>

              <StyledTableCell>New Gross</StyledTableCell>
              <StyledTableCell>Actual Basic</StyledTableCell>
              <StyledTableCell>Actual HRA</StyledTableCell>
              <StyledTableCell>Actual Conveyance</StyledTableCell>
              <StyledTableCell>Actual Medical Allowance</StyledTableCell>
              <StyledTableCell>Actual Production Allowance</StyledTableCell>
              <StyledTableCell>Actual Production Allowance 2</StyledTableCell>
              <StyledTableCell>Actual Other Allowance</StyledTableCell>
              <StyledTableCell>Target Points</StyledTableCell>
              <StyledTableCell>Achieved Points</StyledTableCell>
              <StyledTableCell>Achieved %</StyledTableCell>
              <StyledTableCell>Achieved Production Allowance</StyledTableCell>
              <StyledTableCell>Actual Net Salary</StyledTableCell>
              <StyledTableCell>LOP Basic</StyledTableCell>
              <StyledTableCell>LOP HRA</StyledTableCell>
              <StyledTableCell>LOP Conveyance</StyledTableCell>
              <StyledTableCell>LOP Medical Allowance</StyledTableCell>
              <StyledTableCell>LOP Production Allowance</StyledTableCell>
              <StyledTableCell>LOP Other Allowance</StyledTableCell>
              <StyledTableCell>LOP Net Salary</StyledTableCell>
              <StyledTableCell>Prod Basic</StyledTableCell>
              <StyledTableCell>Prod HRA</StyledTableCell>
              <StyledTableCell>Prod Conveyance</StyledTableCell>
              <StyledTableCell>Prod Medical Allowance</StyledTableCell>
              <StyledTableCell>Prod Production Allowance</StyledTableCell>
              <StyledTableCell>Prod Other Allowance</StyledTableCell>
              <StyledTableCell>Attendance LOP</StyledTableCell>
              <StyledTableCell>Calculated Net Salary</StyledTableCell>
              <StyledTableCell>Actual Penalty Amount</StyledTableCell>
              <StyledTableCell>Penalty Amount</StyledTableCell>
              <StyledTableCell>Loss Deduction</StyledTableCell>
              <StyledTableCell>Other Deduction</StyledTableCell>
              <StyledTableCell>Final Basic</StyledTableCell>
              <StyledTableCell>Final HRA</StyledTableCell>
              <StyledTableCell>Final Conveyance</StyledTableCell>
              <StyledTableCell>Final Medical Allowance</StyledTableCell>
              <StyledTableCell>Final Production Allowance</StyledTableCell>
              <StyledTableCell>Final Other Allowance</StyledTableCell>
              <StyledTableCell>Final Net Salary</StyledTableCell>
              <StyledTableCell>PF Days</StyledTableCell>
              <StyledTableCell>NCP Days</StyledTableCell>
              <StyledTableCell>PF Deduction</StyledTableCell>
              <StyledTableCell>ESI Deduction</StyledTableCell>
              <StyledTableCell>Final LOP</StyledTableCell>
              <StyledTableCell>Final LOP Days</StyledTableCell>
              <StyledTableCell>Final Leave Deduction</StyledTableCell>
              <StyledTableCell>Professional Tax</StyledTableCell>
              <StyledTableCell>Total Deductions</StyledTableCell>
              <StyledTableCell>UAN</StyledTableCell>
              <StyledTableCell>IP Name</StyledTableCell>
              <StyledTableCell>No. Allowance Shift</StyledTableCell>
              <StyledTableCell>Shift Allowance Point</StyledTableCell>
              <StyledTableCell>Shift Allowance Target</StyledTableCell>
              <StyledTableCell>Night Shift Allowance</StyledTableCell>
              <StyledTableCell>Final Salary</StyledTableCell>
              <StyledTableCell>Final Salary-Penalty</StyledTableCell>
              <StyledTableCell>Total Points Value</StyledTableCell>
              <StyledTableCell>ERA</StyledTableCell>
              <StyledTableCell>Actual ERA</StyledTableCell>
              <StyledTableCell>PF Employer Deduction</StyledTableCell>
              <StyledTableCell>ESI Employer Deduction</StyledTableCell>
              <StyledTableCell>CTC</StyledTableCell>
              <StyledTableCell>Revenue Allowance</StyledTableCell>
              <StyledTableCell>Final Value</StyledTableCell>
              <StyledTableCell>Final Value-Penalty</StyledTableCell>
              <StyledTableCell>Shortage</StyledTableCell>
              <StyledTableCell>Shortage 1</StyledTableCell>
              <StyledTableCell>Actual Deduction</StyledTableCell>
              <StyledTableCell>Minimum Deduction</StyledTableCell>
              <StyledTableCell>Final Value Review</StyledTableCell>
              <StyledTableCell>Final Value Status</StyledTableCell>
              <StyledTableCell>Final Value Penalty Status</StyledTableCell>

              {/* FIXED */}
              <StyledTableCell>Fixed Loss Deduction</StyledTableCell>
              <StyledTableCell>Fixed Net Salary</StyledTableCell>
              <StyledTableCell>Fixed Basic</StyledTableCell>
              <StyledTableCell>Fixed HRA</StyledTableCell>
              <StyledTableCell>Fixed Conveyance</StyledTableCell>
              <StyledTableCell>Fixed Medical Allowance</StyledTableCell>
              <StyledTableCell>Fixed Production Allowance</StyledTableCell>
              <StyledTableCell>Fixed Other Allowance</StyledTableCell>
              <StyledTableCell>Fixed Net Salary1</StyledTableCell>
              <StyledTableCell>PF Deduction</StyledTableCell>
              <StyledTableCell>ESI Deduction</StyledTableCell>
              <StyledTableCell>Fixed Emp Tax</StyledTableCell>
              <StyledTableCell>Fixed PF Employer Deduction</StyledTableCell>
              <StyledTableCell>Fixed ESI Employer Deduction</StyledTableCell>
              <StyledTableCell>Fixed Shift Allowance</StyledTableCell>
              <StyledTableCell>Fixed Total Deductions</StyledTableCell>
              <StyledTableCell>Fixed Salary</StyledTableCell>
              <StyledTableCell>Fixed Salary-Penalty</StyledTableCell>
              <StyledTableCell>Fixed LOP</StyledTableCell>
              <StyledTableCell>Fixed LOP Days</StyledTableCell>
              <StyledTableCell>Fixed Leave Deduction</StyledTableCell>
              <StyledTableCell>Fixed CTC</StyledTableCell>
              <StyledTableCell>Fixed Final Value</StyledTableCell>
              <StyledTableCell>Fixed Actual Deduction</StyledTableCell>
              <StyledTableCell>Fixed Minimum Deduction</StyledTableCell>
              {/* PRODUCTION */}
              <StyledTableCell>PROD Loss Deduction</StyledTableCell>
              <StyledTableCell>PROD Net Salary</StyledTableCell>
              <StyledTableCell>PROD Basic</StyledTableCell>
              <StyledTableCell>PROD HRA</StyledTableCell>
              <StyledTableCell>PROD Conveyance</StyledTableCell>
              <StyledTableCell>PROD Medical Allowance</StyledTableCell>
              <StyledTableCell>PROD Production Allowance</StyledTableCell>
              <StyledTableCell>PROD Other Allowance</StyledTableCell>
              <StyledTableCell>PROD Net Salary1</StyledTableCell>
              <StyledTableCell>PROD_Emp_pf</StyledTableCell>
              <StyledTableCell>PROD_Emp_esi</StyledTableCell>
              <StyledTableCell>PROD Emp Tax</StyledTableCell>
              <StyledTableCell>PROD_Emp_tax</StyledTableCell>
              <StyledTableCell>PROD_Empr_pf</StyledTableCell>
              <StyledTableCell>PROD_Empr_Esi</StyledTableCell>
              <StyledTableCell>PROD Shift Allowance</StyledTableCell>
              <StyledTableCell>PROD Total Deductions</StyledTableCell>
              <StyledTableCell>PROD Salary</StyledTableCell>
              <StyledTableCell>PROD Salary-Penalty</StyledTableCell>
              <StyledTableCell>PROD LOP Days</StyledTableCell>
              <StyledTableCell>PROD LOP </StyledTableCell>
              <StyledTableCell>PROD Leave Deduction</StyledTableCell>
              <StyledTableCell>PROD CTC</StyledTableCell>
              <StyledTableCell>PROD Final Value</StyledTableCell>
              <StyledTableCell>PROD Actual Deduction</StyledTableCell>
              <StyledTableCell>PROD Minimum Deduction</StyledTableCell>

              <StyledTableCell>Current Month Avg</StyledTableCell>
              <StyledTableCell>Current Month Attendance</StyledTableCell>
              <StyledTableCell>Paid Status</StyledTableCell>

              <StyledTableCell>Salary Type</StyledTableCell>
              <StyledTableCell>Deduction Type</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody align="left">
            {rowDataTable &&
              rowDataTable.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{row.department}</StyledTableCell>
                  <StyledTableCell>{row.company}</StyledTableCell>
                  <StyledTableCell>{row.branch}</StyledTableCell>
                  <StyledTableCell>{row.unit}</StyledTableCell>
                  <StyledTableCell>{row.team}</StyledTableCell>
                  <StyledTableCell>{row.designation}</StyledTableCell>
                  <StyledTableCell>{row.employeename}</StyledTableCell>
                  <StyledTableCell>{row.aadharname}</StyledTableCell>
                  <StyledTableCell>{row.processcode}</StyledTableCell>
                  <StyledTableCell>{row.doj}</StyledTableCell>
                  <StyledTableCell>{row.experienceinmonth}</StyledTableCell>
                  <StyledTableCell>{row.prodexp}</StyledTableCell>
                  <StyledTableCell>{row.totalnumberofdays}</StyledTableCell>
                  <StyledTableCell>{row.totalshift}</StyledTableCell>
                  <StyledTableCell>{row.clsl}</StyledTableCell>
                  <StyledTableCell>{row.weekoff}</StyledTableCell>
                  <StyledTableCell>{row.holiday}</StyledTableCell>
                  <StyledTableCell>{row.totalasbleave}</StyledTableCell>
                  <StyledTableCell>{row.totalpaidDays}</StyledTableCell>

                  <StyledTableCell>{row.oldgross}</StyledTableCell>
                  <StyledTableCell>{row.oldbasic}</StyledTableCell>
                  <StyledTableCell>{row.oldhra}</StyledTableCell>
                  <StyledTableCell>{row.oldconveyance}</StyledTableCell>
                  <StyledTableCell>{row.oldmedicalallowance}</StyledTableCell>
                  <StyledTableCell>{row.oldproductionallowance}</StyledTableCell>
                  <StyledTableCell>{row.oldproductionallowancetwo}</StyledTableCell>
                  <StyledTableCell>{row.oldotherallowance}</StyledTableCell>

                  <StyledTableCell>{row.newgross}</StyledTableCell>
                  <StyledTableCell>{row.actualbasic}</StyledTableCell>
                  <StyledTableCell>{row.actualhra}</StyledTableCell>
                  <StyledTableCell>{row.actualconveyance}</StyledTableCell>
                  <StyledTableCell>{row.actualmedicalallowance}</StyledTableCell>
                  <StyledTableCell>{row.actualproductionallowance}</StyledTableCell>
                  <StyledTableCell>{row.actualproductionallowancetwo}</StyledTableCell>
                  <StyledTableCell>{row.actualotherallowance}</StyledTableCell>
                  <StyledTableCell>{row.targetpoints}</StyledTableCell>
                  <StyledTableCell>{row.achievedpoints}</StyledTableCell>
                  <StyledTableCell>{row.achieved}</StyledTableCell>
                  <StyledTableCell>{row.achievedproductionallowance}</StyledTableCell>
                  <StyledTableCell>{row.actualnetsalary}</StyledTableCell>
                  <StyledTableCell>{row.lopbasic}</StyledTableCell>
                  <StyledTableCell>{row.lophra}</StyledTableCell>
                  <StyledTableCell>{row.lopconveyance}</StyledTableCell>
                  <StyledTableCell>{row.lopmedicalallowance}</StyledTableCell>
                  <StyledTableCell>{row.lopproductionallowance}</StyledTableCell>
                  <StyledTableCell>{row.lopotherallowance}</StyledTableCell>
                  <StyledTableCell>{row.lopnetsalary}</StyledTableCell>
                  <StyledTableCell>{row.prodbasic}</StyledTableCell>
                  <StyledTableCell>{row.prodhra}</StyledTableCell>
                  <StyledTableCell>{row.prodconveyance}</StyledTableCell>
                  <StyledTableCell>{row.prodmedicalallowance}</StyledTableCell>
                  <StyledTableCell>{row.prodproductionallowance}</StyledTableCell>
                  <StyledTableCell>{row.prodotherallowance}</StyledTableCell>
                  <StyledTableCell>{row.attendancelop}</StyledTableCell>
                  <StyledTableCell>{row.calculatednetsalary}</StyledTableCell>
                  <StyledTableCell>{row.actualpenaltyamount}</StyledTableCell>
                  <StyledTableCell>{row.penaltyamount}</StyledTableCell>
                  <StyledTableCell>{row.lossdeduction}</StyledTableCell>
                  <StyledTableCell>{row.otherdeduction}</StyledTableCell>
                  <StyledTableCell>{row.finalbasic}</StyledTableCell>
                  <StyledTableCell>{row.finalhra}</StyledTableCell>
                  <StyledTableCell>{row.finalconveyance}</StyledTableCell>
                  <StyledTableCell>{row.finalmedicalallowance}</StyledTableCell>
                  <StyledTableCell>{row.finalproductionallowance}</StyledTableCell>
                  <StyledTableCell>{row.finalotherallowance}</StyledTableCell>
                  <StyledTableCell>{row.finalnetsalary}</StyledTableCell>
                  <StyledTableCell>{row.pfdays}</StyledTableCell>
                  <StyledTableCell>{row.ncpdays}</StyledTableCell>
                  <StyledTableCell>{row.pfdeduction}</StyledTableCell>
                  <StyledTableCell>{row.esideduction}</StyledTableCell>
                  <StyledTableCell>{row.finallopdays}</StyledTableCell>
                  <StyledTableCell>{row.paysliplop}</StyledTableCell>
                  <StyledTableCell>{row.finalleavededuction}</StyledTableCell>
                  <StyledTableCell>{row.professionaltax}</StyledTableCell>
                  <StyledTableCell>{row.totaldeductions}</StyledTableCell>
                  <StyledTableCell>{row.uan}</StyledTableCell>
                  <StyledTableCell>{row.ipname}</StyledTableCell>
                  <StyledTableCell>{row.noallowanceshift}</StyledTableCell>
                  <StyledTableCell>{row.shiftallowancepoint}</StyledTableCell>
                  <StyledTableCell>{row.shiftallowancetarget}</StyledTableCell>
                  <StyledTableCell>{row.nightshiftallowance}</StyledTableCell>
                  <StyledTableCell>{row.finalsalary}</StyledTableCell>
                  <StyledTableCell>{row.finalsalarypenalty}</StyledTableCell>
                  <StyledTableCell>{row.totalpointsvalue}</StyledTableCell>
                  <StyledTableCell>{row.era}</StyledTableCell>
                  <StyledTableCell>{row.actualera}</StyledTableCell>
                  <StyledTableCell>{row.pfemployerdeduction}</StyledTableCell>
                  <StyledTableCell>{row.esiemployerdeduction}</StyledTableCell>
                  <StyledTableCell>{row.ctc}</StyledTableCell>
                  <StyledTableCell>{row.revenueallowance}</StyledTableCell>
                  <StyledTableCell>{row.finalvalue}</StyledTableCell>
                  <StyledTableCell>{row.finalvaluepenalty}</StyledTableCell>
                  <StyledTableCell>{row.shortage}</StyledTableCell>
                  <StyledTableCell>{row.shortageone}</StyledTableCell>
                  <StyledTableCell>{row.actualdeduction}</StyledTableCell>
                  <StyledTableCell>{row.minimumdeduction}</StyledTableCell>
                  <StyledTableCell>{row.finalvaluereview}</StyledTableCell>
                  <StyledTableCell>{row.finalvaluestatus}</StyledTableCell>
                  <StyledTableCell>{row.finalvaluepenaltystatus}</StyledTableCell>
                  {/* FIXED */}
                  <StyledTableCell>{row.fixedlossdeduction}</StyledTableCell>
                  <StyledTableCell>{row.fixednetsalary}</StyledTableCell>
                  <StyledTableCell>{row.fixedbasic}</StyledTableCell>
                  <StyledTableCell>{row.fixedhra}</StyledTableCell>
                  <StyledTableCell>{row.fixedconveyance}</StyledTableCell>
                  <StyledTableCell>{row.fixedmedicalallowance}</StyledTableCell>
                  <StyledTableCell>{row.fixedproductionallowance}</StyledTableCell>
                  <StyledTableCell>{row.fixedotherallowance}</StyledTableCell>
                  <StyledTableCell>{row.fixednetsalaryone}</StyledTableCell>
                  <StyledTableCell>{row.fixedemppf}</StyledTableCell>
                  <StyledTableCell>{row.fixedempesi}</StyledTableCell>
                  <StyledTableCell>{row.fixedempptax}</StyledTableCell>
                  <StyledTableCell>{row.fixedemprpf}</StyledTableCell>
                  <StyledTableCell>{row.fixedempresi}</StyledTableCell>
                  <StyledTableCell>{row.fixedshiftallowance}</StyledTableCell>
                  <StyledTableCell>{row.fixedtotaldeductions}</StyledTableCell>
                  <StyledTableCell>{row.fixedsalary}</StyledTableCell>
                  <StyledTableCell>{row.fixedsalarypenalty}</StyledTableCell>
                  <StyledTableCell>{row.fixedlop}</StyledTableCell>
                  <StyledTableCell>{row.fixedlopdays}</StyledTableCell>
                  <StyledTableCell>{row.fixedleavededuction}</StyledTableCell>
                  <StyledTableCell>{row.fixedctc}</StyledTableCell>
                  <StyledTableCell>{row.fixedfinalvalue}</StyledTableCell>
                  <StyledTableCell>{row.fixedfinalvaluepenalty}</StyledTableCell>
                  <StyledTableCell>{row.fixedactualdeduction}</StyledTableCell>
                  <StyledTableCell>{row.fixedminimumdeduction}</StyledTableCell>

                  {/* PRODUCTION */}
                  <StyledTableCell>{row.prodlossdeduction}</StyledTableCell>
                  <StyledTableCell>{row.prodnetsalary}</StyledTableCell>
                  <StyledTableCell>{row.prodbasicp}</StyledTableCell>
                  <StyledTableCell>{row.prodhrap}</StyledTableCell>
                  <StyledTableCell>{row.prodconveyancep}</StyledTableCell>
                  <StyledTableCell>{row.prodmedicalallowancep}</StyledTableCell>
                  <StyledTableCell>{row.prodproductionallowancep}</StyledTableCell>
                  <StyledTableCell>{row.prodotherallowancep}</StyledTableCell>
                  <StyledTableCell>{row.prodnetsalaryonep}</StyledTableCell>
                  <StyledTableCell>{row.prodemppf}</StyledTableCell>
                  <StyledTableCell>{row.prodempesi}</StyledTableCell>
                  <StyledTableCell>{row.prodempptax}</StyledTableCell>
                  <StyledTableCell>{row.prodemprpf}</StyledTableCell>
                  <StyledTableCell>{row.prodempresi}</StyledTableCell>
                  <StyledTableCell>{row.prodshiftallowance}</StyledTableCell>
                  <StyledTableCell>{row.prodtotaldeductions}</StyledTableCell>
                  <StyledTableCell>{row.prodsalary}</StyledTableCell>
                  <StyledTableCell>{row.prodsalarypenalty}</StyledTableCell>
                  <StyledTableCell>{row.prodlopdays}</StyledTableCell>
                  <StyledTableCell>{row.fixedlopdays}</StyledTableCell>
                  <StyledTableCell>{row.prodlop}</StyledTableCell>
                  <StyledTableCell>{row.prodleavededuction}</StyledTableCell>
                  <StyledTableCell>{row.prodctc}</StyledTableCell>
                  <StyledTableCell>{row.prodfinalvalue}</StyledTableCell>
                  <StyledTableCell>{row.prodactualdeduction}</StyledTableCell>
                  <StyledTableCell>{row.prodminimumdeduction}</StyledTableCell>

                  <StyledTableCell>{row.currentmonthavg}</StyledTableCell>
                  <StyledTableCell>{row.currentmonthattendance}</StyledTableCell>
                  <StyledTableCell>{row.paidstatus}</StyledTableCell>

                  <StyledTableCell>{row.salarytype}</StyledTableCell>
                  <StyledTableCell>{row.deductiontype}</StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PRINT PDF EXCEL CSV */}
      <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        // isPdfFilterOpen={isPdfFilterOpen}
        // setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={rowDataTable ?? []}
        itemsTwo={rowData ?? []}
        filename={`Pay Run List - ${viewlistname}`}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />

      {/*Export pdf Data  */}
      <Dialog open={isPdfFilterOpen} onClose={handleClosePdfFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent
          sx={{
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
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
              downloadPdf("filtered");
              setIsPdfFilterOpen(false);
            }}
          >
            Export Filtered Data
          </Button>
          <Button
            variant="contained"
            onClick={(e) => {
              downloadPdf("overall");
              setIsPdfFilterOpen(false);
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>

      {/*DELETE ALERT DIALOG */}
      <Dialog open={isLoaderDialog} onClose={handleLoaderDialogClose} aria-labelledby="alert-dialog-title" maxWidth="sm" fullWidth={true} aria-describedby="alert-dialog-description">
        <DialogContent sx={{ textAlign: "center", alignItems: "center" }}>
          {alertMsg}
          <LinearProgressBar progress={alert} />
        </DialogContent>
      </Dialog>

      <Dialog open={openESINoDed} onClose={handleCloseESINoDed} aria-labelledby="alert-dialog-title" maxWidth="md" fullWidth={true} aria-describedby="alert-dialog-description">
        <DialogContent sx={{ textAlign: "center", alignItems: "center" }}>
          ESI Not deducted for these Employees do you want to update as false in esideduction ?
          <TableContainer component={Paper}>
            <Table aria-label="simple table" id="Customerduesreport">
              <TableHead sx={{ fontWeight: "600" }}>
                <StyledTableRow>
                  <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                    <Checkbox sx={{ padding: "4px" }} checked={selectAll} onChange={handleSelectAll} />
                  </StyledTableCell>
                  <StyledTableCell sx={{ padding: "5px 10px !important" }}> SNO</StyledTableCell>
                  <StyledTableCell sx={{ padding: "5px 10px !important" }}>Name </StyledTableCell>
                  <StyledTableCell sx={{ padding: "5px 10px !important" }}>Code</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {ESINoDedEmps &&
                  ESINoDedEmps.length > 0 &&
                  ESINoDedEmps?.map((row, index) => (
                    <StyledTableRow key={index} sx={{ background: selectedRowsEsi.includes(row._id) ? "#1976d22b !important" : "inherit" }}>
                      <StyledTableCell>
                        <Checkbox sx={{ padding: "4px" }} checked={selectedRowsEsi.includes(row._id)} onChange={() => handleCheckboxChange(row._id)} />
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>{index + 1}</StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>{row.companyname}</StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>{row.empcode}</StyledTableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <br />
          {/* <Button>Update</Button> */}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={(e) => handleUpdateESIfalse()}>
            update
          </Button>
          <Button sx={userStyle.btncancel} onClick={handleCloseESINoDed}>
            cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
export default PayRun;
